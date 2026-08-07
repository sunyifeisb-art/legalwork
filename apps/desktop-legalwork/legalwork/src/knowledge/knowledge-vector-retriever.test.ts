import { describe, expect, it } from 'vitest'
import type { KnowledgeChunk } from '../contracts/knowledge.js'
import { reciprocalRankFuseKnowledgeCandidates } from './knowledge-vector-retriever.js'

function chunk(id: string): KnowledgeChunk {
  return {
    id,
    documentId: `doc_${id}`,
    title: id,
    path: `/tmp/${id}.md`,
    relativePath: `${id}.md`,
    content: id
  }
}

describe('reciprocalRankFuseKnowledgeCandidates', () => {
  it('keeps lexical-only retrieval useful when no vector provider is configured', () => {
    const lexical = [chunk('a'), chunk('b')]
    expect(reciprocalRankFuseKnowledgeCandidates({ lexical, vector: [], limit: 5 }).map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('can promote a vector-supported candidate without discarding lexical candidates', () => {
    const a = chunk('a')
    const b = chunk('b')
    const c = chunk('c')
    const fused = reciprocalRankFuseKnowledgeCandidates({
      lexical: [a, b, c],
      vector: [
        { chunk: c, score: 1 },
        { chunk: b, score: 0.8 }
      ],
      limit: 3
    })

    expect(fused.map((item) => item.id)).toEqual(['c', 'b', 'a'])
  })
})
