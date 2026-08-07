import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { KnowledgeDocument } from '../contracts/knowledge.js'
import { chunkKnowledgeDocument } from './knowledge-structured-chunker.js'
import { KnowledgeSqliteIndex } from './knowledge-sqlite-index.js'

describe('KnowledgeSqliteIndex', () => {
  it('persists chunks, retrieves FTS candidates and resolves provenance IDs', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-sqlite-'))
    const index = new KnowledgeSqliteIndex(root)
    try {
      const doc: KnowledgeDocument = {
        id: 'doc_a',
        title: '个人信息保护法摘录',
        path: '/tmp/pipl.md',
        sourceRoot: '/tmp',
        relativePath: '法规/个人信息保护法摘录.md',
        category: '法规规范',
        tags: ['法规'],
        keywords: ['敏感个人信息', '单独同意'],
        extension: '.md',
        sizeBytes: 128,
        updatedAt: '2026-08-07T00:00:00.000Z',
        documentHash: 'hash-a',
        sourceMtimeMs: 100,
        indexedAt: '2026-08-07T00:00:00.000Z'
      }
      const chunks = chunkKnowledgeDocument(
        doc,
        '第一条 处理敏感个人信息应当取得个人的单独同意。\n第二条 个人信息处理者应当采取严格保护措施。',
        'hash-a'
      )
      await index.upsertDocument(doc, chunks)
      await index.setSyncMetadata({
        syncedAt: '2026-08-07T00:00:00.000Z',
        roots: ['/tmp'],
        skippedCount: 0,
        candidateFileCount: 1,
        attemptedFileCount: 1,
        failedFileCount: 0,
        truncatedFileCount: 0
      })
      const revision = await index.recomputeRevision()

      const hits = await index.searchCandidates({ query: '敏感个人信息 单独同意', limit: 10 })
      expect(hits.length).toBeGreaterThan(0)
      expect(hits.some((hit) => hit.content.includes('单独同意'))).toBe(true)
      expect(hits[0]?.provenanceId).toBeTruthy()

      const lookedUp = await index.lookupChunks([hits[0]!.id])
      expect(lookedUp[0]?.provenanceId).toBe(hits[0]?.provenanceId)

      const diagnostics = await index.diagnostics()
      expect(diagnostics.backend).toBe('sqlite-fts5')
      expect(diagnostics.documentCount).toBe(1)
      expect(diagnostics.chunkCount).toBe(chunks.length)
      expect(diagnostics.revision).toBe(revision)
    } finally {
      index.close()
      await rm(root, { recursive: true, force: true })
    }
  })

  it('reopens an existing FTS database and preserves retrieval behavior', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-sqlite-reopen-'))
    let index = new KnowledgeSqliteIndex(root)
    try {
      const doc: KnowledgeDocument = {
        id: 'doc_reopen',
        title: '合同解除规则',
        path: '/tmp/reopen.md',
        sourceRoot: '/tmp',
        relativePath: '法规/合同解除规则.md',
        extension: '.md',
        sizeBytes: 64,
        updatedAt: '2026-08-07T00:00:00.000Z',
        documentHash: 'hash-reopen',
        sourceMtimeMs: 10,
        indexedAt: '2026-08-07T00:00:00.000Z'
      }
      await index.upsertDocument(doc, chunkKnowledgeDocument(doc, '第一条 合同解除应当符合约定或者法律规定。', 'hash-reopen'))
      index.close()

      index = new KnowledgeSqliteIndex(root)
      const hits = await index.searchCandidates({ query: '合同解除', limit: 10 })
      expect(hits.some((hit) => hit.content.includes('合同解除'))).toBe(true)
    } finally {
      index.close()
      await rm(root, { recursive: true, force: true })
    }
  })

  it('deletes documents that are no longer in the current indexed set', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-sqlite-delete-'))
    const index = new KnowledgeSqliteIndex(root)
    try {
      for (const id of ['doc_a', 'doc_b']) {
        const doc: KnowledgeDocument = {
          id,
          title: id,
          path: `/tmp/${id}.md`,
          sourceRoot: '/tmp',
          relativePath: `法规/${id}.md`,
          extension: '.md',
          sizeBytes: 20,
          updatedAt: '2026-08-07T00:00:00.000Z',
          documentHash: `hash-${id}`,
          sourceMtimeMs: 1,
          indexedAt: '2026-08-07T00:00:00.000Z'
        }
        await index.upsertDocument(doc, chunkKnowledgeDocument(doc, `${id} 行政程序正当性规则`, `hash-${id}`))
      }

      const deleted = await index.deleteDocumentsNotIn(['doc_b'])
      expect(deleted).toBe(1)
      expect((await index.diagnostics()).documentCount).toBe(1)
    } finally {
      index.close()
      await rm(root, { recursive: true, force: true })
    }
  })
})
