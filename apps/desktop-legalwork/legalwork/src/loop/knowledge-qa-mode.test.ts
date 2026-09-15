import { describe, expect, it } from 'vitest'
import type { ModelToolSpec } from '../ports/model-client.js'
import { isKnowledgeQaThreadTitle, knowledgeQaToolSpecs } from './knowledge-qa-mode.js'

const tools: ModelToolSpec[] = [
  { name: 'knowledge_search', description: 'search', inputSchema: { type: 'object' } },
  { name: 'web_search', description: 'web', inputSchema: { type: 'object' } }
]

describe('knowledge QA mode', () => {
  it('recognizes file and global knowledge-base side threads', () => {
    expect(isKnowledgeQaThreadTitle('知识库：判决书.pdf · 是否支持诉请')).toBe(true)
    expect(isKnowledgeQaThreadTitle('知识库全局对话 · 竞业限制')).toBe(true)
    expect(isKnowledgeQaThreadTitle('普通法律研究')).toBe(false)
  })

  it('removes all tools from ordinary knowledge QA turns', () => {
    expect(knowledgeQaToolSpecs(tools, {
      title: '知识库全局对话 · 竞业限制'
    })).toEqual([])
  })

  it('keeps tools for normal threads but never for knowledge QA', () => {
    expect(knowledgeQaToolSpecs(tools, {
      title: '普通法律研究'
    })).toEqual(tools)
    expect(knowledgeQaToolSpecs(tools, {
      title: '知识库：判决书.pdf · 制定计划'
    })).toEqual([])
  })
})
