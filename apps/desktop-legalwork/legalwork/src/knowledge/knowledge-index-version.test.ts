import { describe, expect, it } from 'vitest'
import {
  KNOWLEDGE_CHUNKER_VERSION,
  KNOWLEDGE_INDEX_SCHEMA_VERSION,
  KNOWLEDGE_RETRIEVER_VERSION,
  knowledgeProvenanceId
} from './knowledge-index-version.js'

describe('knowledge index versioning', () => {
  it('builds stable content-addressed provenance identifiers', () => {
    const first = knowledgeProvenanceId({ documentHash: 'doc-a', chunkHash: 'chunk-a' })
    const second = knowledgeProvenanceId({ documentHash: 'doc-a', chunkHash: 'chunk-a' })
    const changed = knowledgeProvenanceId({ documentHash: 'doc-a', chunkHash: 'chunk-b' })

    expect(first).toBe(second)
    expect(changed).not.toBe(first)
    expect(first).toMatch(/^kb_[a-f0-9]{24}$/)
    expect(KNOWLEDGE_INDEX_SCHEMA_VERSION).toBe(2)
    expect(KNOWLEDGE_RETRIEVER_VERSION).toContain('sqlite-fts5')
    expect(KNOWLEDGE_CHUNKER_VERSION).toContain('legal-structured')
  })
})
