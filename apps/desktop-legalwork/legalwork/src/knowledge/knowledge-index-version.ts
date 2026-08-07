import { createHash } from 'node:crypto'

export const KNOWLEDGE_INDEX_SCHEMA_VERSION = 2
export const KNOWLEDGE_RETRIEVER_VERSION = 'sqlite-fts5-legal-v2'
export const KNOWLEDGE_CHUNKER_VERSION = 'legal-structured-v2'

export function knowledgeProvenanceId(input: {
  documentHash: string
  chunkHash: string
}): string {
  const digest = createHash('sha256')
    .update(`${input.documentHash}:${input.chunkHash}`)
    .digest('hex')
    .slice(0, 24)
  return `kb_${digest}`
}
