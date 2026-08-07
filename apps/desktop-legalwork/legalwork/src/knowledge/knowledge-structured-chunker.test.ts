import { describe, expect, it } from 'vitest'
import type { KnowledgeDocument } from '../contracts/knowledge.js'
import { chunkKnowledgeDocument } from './knowledge-structured-chunker.js'

function document(): KnowledgeDocument {
  return {
    id: 'doc_1',
    title: '测试法规',
    path: '/tmp/law.md',
    sourceRoot: '/tmp',
    relativePath: '法规/测试法规.md',
    category: '法规规范',
    tags: ['法规'],
    keywords: ['个人信息', '处理者'],
    extension: '.md',
    sizeBytes: 100,
    updatedAt: '2026-08-07T00:00:00.000Z'
  }
}

describe('chunkKnowledgeDocument', () => {
  it('keeps Chinese legal article boundaries and provenance', () => {
    const content = [
      '第一章 总则',
      '第一条 为了保护个人信息权益，规范个人信息处理活动，制定本法。',
      '第二条 自然人的个人信息受法律保护。',
      '第三条 在中华人民共和国境内处理自然人个人信息的活动，适用本法。'
    ].join('\n')

    const chunks = chunkKnowledgeDocument(document(), content, 'doc-hash-1')

    expect(chunks.map((chunk) => chunk.articleNumber).filter(Boolean)).toEqual([
      '第一条',
      '第二条',
      '第三条'
    ])
    expect(chunks.find((chunk) => chunk.articleNumber === '第二条')?.headingPath).toEqual([
      '第一章 总则',
      '第二条'
    ])
    expect(chunks.every((chunk) => chunk.documentHash === 'doc-hash-1')).toBe(true)
    expect(chunks.every((chunk) => Boolean(chunk.chunkHash && chunk.provenanceId))).toBe(true)
  })

  it('splits long sections without losing heading provenance', () => {
    const content = `# 本院认为\n${'争议焦点涉及合同解除、违约责任与损失赔偿。'.repeat(500)}`
    const chunks = chunkKnowledgeDocument(document(), content, 'doc-hash-2')

    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.every((chunk) => chunk.headingPath?.[0] === '本院认为')).toBe(true)
    expect(chunks.every((chunk) => (chunk.charEnd ?? 0) > (chunk.charStart ?? -1))).toBe(true)
  })

  it('produces stable provenance IDs for unchanged content', () => {
    const content = '第一条 同一内容应产生稳定来源标识。'
    const first = chunkKnowledgeDocument(document(), content, 'stable-doc-hash')
    const second = chunkKnowledgeDocument(document(), content, 'stable-doc-hash')

    expect(first[0]?.chunkHash).toBe(second[0]?.chunkHash)
    expect(first[0]?.provenanceId).toBe(second[0]?.provenanceId)
  })
})
