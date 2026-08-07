import type { KnowledgeRetrievalResult } from '../contracts/knowledge-retrieval.js'
import { KNOWLEDGE_RETRIEVER_VERSION } from './knowledge-index-version.js'

const MAX_CACHE_ENTRIES = 128
const cache = new Map<string, KnowledgeRetrievalResult>()

export function knowledgeRetrievalCacheKey(input: {
  rootDir: string
  revision: string
  query: string
  maxChars: number
  excludeExpired: boolean
  layers?: string[]
  pathPrefix?: string
}): string {
  return JSON.stringify({
    rootDir: input.rootDir,
    revision: input.revision,
    retrieverVersion: KNOWLEDGE_RETRIEVER_VERSION,
    query: normalizeQuery(input.query),
    maxChars: input.maxChars,
    excludeExpired: input.excludeExpired,
    layers: [...(input.layers ?? [])].sort(),
    pathPrefix: normalizePathPrefix(input.pathPrefix)
  })
}

export function getKnowledgeRetrievalCache(key: string): KnowledgeRetrievalResult | null {
  const hit = cache.get(key)
  if (!hit) return null
  cache.delete(key)
  cache.set(key, hit)
  return structuredClone(hit)
}

export function setKnowledgeRetrievalCache(key: string, value: KnowledgeRetrievalResult): void {
  cache.delete(key)
  cache.set(key, structuredClone(value))
  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value as string | undefined
    if (!oldest) break
    cache.delete(oldest)
  }
}

export function clearKnowledgeRetrievalCache(): void {
  cache.clear()
}

function normalizeQuery(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase()
}

function normalizePathPrefix(value?: string): string {
  return (value ?? '').trim().replaceAll('\\', '/').replace(/^\/+|\/+$/g, '')
}
