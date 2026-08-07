import type { KnowledgeChunk, KnowledgeLayer } from '../contracts/knowledge.js'

export type KnowledgeVectorHit = {
  chunkId: string
  score: number
}

export interface KnowledgeVectorRetriever {
  readonly id: string
  search(input: {
    query: string
    limit: number
    layers?: KnowledgeLayer[]
    pathPrefix?: string
  }): Promise<KnowledgeVectorHit[]>
}

export function reciprocalRankFuseKnowledgeCandidates(input: {
  lexical: KnowledgeChunk[]
  vector: Array<{ chunk: KnowledgeChunk; score: number }>
  limit: number
}): KnowledgeChunk[] {
  const scores = new Map<string, number>()
  const chunks = new Map<string, KnowledgeChunk>()
  const k = 60

  input.lexical.forEach((chunk, index) => {
    chunks.set(chunk.id, chunk)
    scores.set(chunk.id, (scores.get(chunk.id) ?? 0) + 1 / (k + index + 1))
  })
  input.vector.forEach(({ chunk, score }, index) => {
    chunks.set(chunk.id, chunk)
    const boundedScore = Number.isFinite(score) ? Math.max(0, Math.min(1, score)) : 0
    scores.set(
      chunk.id,
      (scores.get(chunk.id) ?? 0) + (1 + boundedScore) / (k + index + 1)
    )
  })

  return [...scores.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, Math.max(1, input.limit))
    .map(([chunkId]) => chunks.get(chunkId))
    .filter((chunk): chunk is KnowledgeChunk => Boolean(chunk))
}
