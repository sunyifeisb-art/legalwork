import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { KnowledgeDocument } from '../contracts/knowledge.js'
import { chunkKnowledgeDocument } from './knowledge-structured-chunker.js'
import { KnowledgeSqliteIndex } from './knowledge-sqlite-index.js'

describe('KnowledgeSqliteIndex short Chinese queries', () => {
  it('falls back safely for a two-character legal term such as 合同', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-short-query-'))
    const index = new KnowledgeSqliteIndex(root)
    try {
      const doc: KnowledgeDocument = {
        id: 'doc_contract',
        title: '合同解除规则',
        path: '/tmp/contract.md',
        sourceRoot: '/tmp',
        relativePath: '合同/解除规则.md',
        extension: '.md',
        sizeBytes: 80,
        updatedAt: '2026-08-07T00:00:00.000Z',
        documentHash: 'contract-hash',
        sourceMtimeMs: 1,
        indexedAt: '2026-08-07T00:00:00.000Z'
      }
      await index.upsertDocument(
        doc,
        chunkKnowledgeDocument(doc, '第一条 合同解除应当符合约定或者法律规定。', 'contract-hash')
      )

      const hits = await index.searchCandidates({ query: '合同', limit: 10 })
      expect(hits.some((hit) => hit.content.includes('合同解除'))).toBe(true)
      expect(hits.find((hit) => hit.content.includes('合同解除'))?.provenanceId).toMatch(/^kb_[a-f0-9]{24}$/)
    } finally {
      index.close()
      await rm(root, { recursive: true, force: true })
    }
  })
})
