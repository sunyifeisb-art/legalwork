export interface KnowledgeEmbeddingProvider {
  readonly modelVersion: string
  readonly dimensions?: number

  embed(text: string): Promise<number[]>

  embedBatch(texts: string[]): Promise<number[][]>
}

export class NoopKnowledgeEmbeddingProvider implements KnowledgeEmbeddingProvider {
  readonly modelVersion = 'none'

  async embed(_text: string): Promise<number[]> {
    return []
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return texts.map(() => [])
  }
}
