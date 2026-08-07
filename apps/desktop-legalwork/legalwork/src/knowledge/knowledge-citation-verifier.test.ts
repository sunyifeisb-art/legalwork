import { describe, expect, it, vi } from 'vitest'
import type { KnowledgeStore } from './knowledge-store.js'
import {
  extractNumericCitationNumbers,
  verifyKnowledgeCitationProvenance
} from './knowledge-citation-verifier.js'

function fakeStore(): KnowledgeStore {
  return {
    lookupChunks: vi.fn(async (ids: string[]) => ids.map((id) => ({
      documentId: 'doc_1',
      chunkId: id,
      title: '测试法规',
      path: '/tmp/law.md',
      relativePath: '法规/测试法规.md',
      score: 1,
      snippet: '正文',
      provenanceId: id === 'chunk_2' ? 'prov_current_2' : `prov_${id}`
    }))),
    sync: vi.fn(),
    search: vi.fn(),
    diagnostics: vi.fn(),
    setLastSelected: vi.fn(),
    tree: vi.fn(),
    createFolder: vi.fn(),
    writeFile: vi.fn(),
    readFile: vi.fn(),
    extractText: vi.fn(),
    absolutePath: vi.fn(),
    move: vi.fn(),
    delete: vi.fn(),
    classify: vi.fn()
  } as unknown as KnowledgeStore
}

describe('knowledge citation provenance', () => {
  it('expands numeric lists and ranges deterministically', () => {
    expect(extractNumericCitationNumbers('规则[1]，另见[2, 4-5]，重复[1]。')).toEqual([1, 2, 4, 5])
  })

  it('verifies citations against explicit chunk provenance instead of guessing from [N]', async () => {
    const store = fakeStore()
    const result = await verifyKnowledgeCitationProvenance(store, '结论一[1]，结论二[2]。', [
      { citationNumber: 1, chunkId: 'chunk_1', provenanceId: 'prov_chunk_1' },
      { citationNumber: 2, chunkId: 'chunk_2', provenanceId: 'prov_old_2' }
    ])

    expect(result.valid).toBe(false)
    expect(result.verifiedCount).toBe(1)
    expect(result.checks).toEqual([
      expect.objectContaining({ citationNumber: 1, status: 'verified' }),
      expect.objectContaining({ citationNumber: 2, status: 'provenance_mismatch' })
    ])
  })

  it('reports missing source mappings instead of treating numeric markers as searchable text', async () => {
    const store = fakeStore()
    const result = await verifyKnowledgeCitationProvenance(store, '这里引用[3]。', [])

    expect(result.valid).toBe(false)
    expect(result.checks).toEqual([{ citationNumber: 3, status: 'missing_source_mapping' }])
    expect(store.search).not.toHaveBeenCalled()
  })
})
