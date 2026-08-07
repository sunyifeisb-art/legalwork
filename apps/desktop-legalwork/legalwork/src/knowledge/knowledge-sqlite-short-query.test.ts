import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { KnowledgeDocument } from '../contracts/knowledge.js'
import { chunkKnowledgeDocument } from './knowledge-structured-chunker.js'
import { KnowledgeSqliteIndex } from './knowledge-sqlite-index.js'

describe('KnowledgeSqliteIndex Chinese queries', () => {
  it('supports both two-character terms and longer natural-language legal queries', async () => {
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
        chunkKnowledgeDocument(doc, '第一条 合同解除应当符合约定或者法律规定。解除后仍可能承担违约责任。', 'contract-hash')
      )

      const shortHits = await index.searchCandidates({ query: '合同', limit: 10 })
      const contractHit = shortHits.find((hit) => hit.content.includes('合同解除'))
      expect(contractHit).toBeTruthy()
      expect(contractHit?.provenanceId).toMatch(/^kb_[a-f0-9]{24}$/)
      expect(contractHit?.documentHash).toBe('contract-hash')

      const naturalLanguageHits = await index.searchCandidates({
        query: '合同解除以后违约责任应该如何承担',
        limit: 10
      })
      const naturalLanguageHit = naturalLanguageHits.find((hit) => hit.content.includes('违约责任'))
      expect(naturalLanguageHit).toBeTruthy()
      expect(naturalLanguageHit?.provenanceId).toMatch(/^kb_[a-f0-9]{24}$/)
    } finally {
      index.close()
      await rm(root, { recursive: true, force: true })
    }
  })
})
