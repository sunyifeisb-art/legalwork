import { describe, expect, it } from 'vitest'
import {
  allowedToolNamesWithGuiStateTools,
  documentWritingKnowledgeAccessInstruction,
  isDocumentWritingFeatureTitle
} from './agent-loop.js'

describe('standalone document-writing knowledge access', () => {
  it('recognizes only the dedicated document-writing thread title', () => {
    expect(isDocumentWritingFeatureTitle('文书写作：法律意见书')).toBe(true)
    expect(isDocumentWritingFeatureTitle('文书写作:法律意见书')).toBe(true)
    expect(isDocumentWritingFeatureTitle('帮我写一份法律意见书')).toBe(false)
  })

  it('keeps local and IMA knowledge tools available when a Skill narrows the catalog', () => {
    const allowed = allowedToolNamesWithGuiStateTools(
      ['read'],
      false,
      '请根据案件材料起草法律意见书，代表被告。',
      ['some-writing-skill'],
      undefined,
      '文书写作：法律意见书'
    )

    expect(allowed).toEqual(expect.arrayContaining([
      'knowledge_list_tree',
      'knowledge_auto_retrieve',
      'knowledge_search',
      'knowledge_read_file',
      'mcp_search',
      'mcp_call',
      'mcp_ima_knowledge_base_research_ima',
      'mcp_ima_knowledge_base_search_ima_catalog',
      'mcp_ima_knowledge_base_list_available_knowledge_bases',
      'mcp_ima_knowledge_base_ask'
    ]))
  })

  it('does not grant document-writing knowledge tools to an ordinary main-chat title', () => {
    const allowed = allowedToolNamesWithGuiStateTools(
      ['read'],
      false,
      '请起草法律意见书，代表被告。',
      ['some-writing-skill'],
      undefined,
      '新会话'
    )

    expect(allowed).not.toContain('knowledge_list_tree')
    expect(allowed).not.toContain('mcp_ima_knowledge_base_research_ima')
  })

  it('tells the drafting agent to inspect catalogs first and retrieve only relevant KBs', () => {
    const instruction = documentWritingKnowledgeAccessInstruction(true)
    expect(instruction).toContain('knowledge_list_tree')
    expect(instruction).toContain('<ima_knowledge_bases>')
    expect(instruction).toContain('只有识别到可能有用的知识库时才取正文')
    expect(instruction).toContain('不替代权威法源核验')
  })
})
