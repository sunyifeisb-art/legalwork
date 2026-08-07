import { describe, expect, it } from 'vitest'
import { knowledgeRetrievalCacheKey } from './knowledge-retrieval-cache.js'

describe('knowledgeRetrievalCacheKey', () => {
  it('changes when the knowledge revision changes', () => {
    const base = {
      rootDir: '/tmp/kb',
      query: '合同解除 违约责任',
      maxChars: 8000,
      excludeExpired: true
    }
    const first = knowledgeRetrievalCacheKey({ ...base, revision: 'rev-1' })
    const second = knowledgeRetrievalCacheKey({ ...base, revision: 'rev-2' })
    expect(second).not.toBe(first)
  })

  it('normalizes equivalent query whitespace and path separators', () => {
    const first = knowledgeRetrievalCacheKey({
      rootDir: '/tmp/kb',
      revision: 'rev',
      query: '合同解除   违约责任',
      maxChars: 8000,
      excludeExpired: true,
      pathPrefix: '法规\\民事'
    })
    const second = knowledgeRetrievalCacheKey({
      rootDir: '/tmp/kb',
      revision: 'rev',
      query: '合同解除 违约责任',
      maxChars: 8000,
      excludeExpired: true,
      pathPrefix: '法规/民事'
    })
    expect(second).toBe(first)
  })
})
