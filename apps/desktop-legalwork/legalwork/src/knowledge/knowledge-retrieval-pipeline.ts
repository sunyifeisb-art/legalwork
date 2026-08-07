import { readFileSync, existsSync } from 'node:fs'
import type { KnowledgeStore } from './knowledge-store.js'
import type {
  KnowledgeContextRecord,
  KnowledgeRetrievalResult,
  KnowledgeLayer
} from '../contracts/knowledge-retrieval.js'
import { KnowledgeMeta, DEFAULT_KNOWLEDGE_META } from '../contracts/knowledge-retrieval.js'
import { fieldsFromKnowledgeMeta, formatGbt7714 } from './citation-engine.js'
import {
  getKnowledgeRetrievalCache,
  knowledgeRetrievalCacheKey,
  setKnowledgeRetrievalCache
} from './knowledge-retrieval-cache.js'

const MAX_CONTEXT_CHARS = 8_000
const MAX_SOURCES = 12

/**
 * Local knowledge retrieval pipeline.
 *
 * Ordinary retrieval no longer auto-routes through the old software-engineering
 * L1-L5 pyramid. Layer filtering is only applied when a caller explicitly asks
 * for it. This keeps legal retrieval from silently excluding relevant sources.
 */
export class KnowledgeRetrievalPipeline {
  constructor(private readonly store: KnowledgeStore) {}

  async retrieve(query: string, options?: {
    maxChars?: number
    excludeExpired?: boolean
    includeExternal?: boolean
    layer?: KnowledgeLayer
    layers?: KnowledgeLayer[]
    pathPrefix?: string
  }): Promise<KnowledgeRetrievalResult> {
    const startedAt = Date.now()
    const maxChars = options?.maxChars ?? MAX_CONTEXT_CHARS
    const excludeExpired = options?.excludeExpired ?? true
    const targetLayers = options?.layers ?? (options?.layer ? [options.layer] : [])
    const diagnostics = await this.store.diagnostics()
    const cacheKey = knowledgeRetrievalCacheKey({
      rootDir: diagnostics.rootDir,
      revision: diagnostics.revision,
      query,
      maxChars,
      excludeExpired,
      layers: targetLayers,
      pathPrefix: options?.pathPrefix
    })
    const cached = getKnowledgeRetrievalCache(cacheKey)
    if (cached) {
      return {
        ...cached,
        cacheHit: true,
        latencyMs: Date.now() - startedAt
      }
    }

    const rawHits = await this.store.search({
      query,
      limit: MAX_SOURCES,
      includeContent: true,
      ...(options?.pathPrefix ? { pathPrefix: options.pathPrefix } : {}),
      ...(targetLayers.length > 0 ? { layers: targetLayers } : {})
    })

    const filtered = excludeExpired
      ? await this.filterExpired(rawHits.map((hit) => hit.path))
      : new Set<string>()

    const records: KnowledgeContextRecord[] = []
    const contextEntries: string[] = []
    const bibliographyEntries: Array<{ title: string; citation: string }> = []
    let totalChars = 0

    for (const hit of rawHits) {
      if (filtered.has(hit.path)) continue

      const meta = this.readMetadata(hit.path)
      const citation = this.buildCitationWithMeta(hit.title, hit.relativePath, meta)
      const confidenceTag = meta.confidence === 'high'
        ? 'high_confidence'
        : meta.confidence === 'deprecated'
          ? 'deprecated'
          : ''
      const tags = [...meta.tags]
      if (meta.deprecated) tags.push('deprecated')
      if (meta.expiresAt) tags.push('has_expiry')
      if (confidenceTag) tags.push(confidenceTag)

      const citationFields = fieldsFromKnowledgeMeta(
        hit.title,
        hit.relativePath,
        {
          source: meta.source,
          author: meta.author,
          category: meta.category,
          tags: meta.tags,
          confidence: meta.confidence
        },
        hit.category,
        hit.content
      )
      const gbt7714Citation = formatGbt7714(citationFields)
      const citationNumber = records.length + 1
      const documentHash = hit.documentHash ?? hit.documentId
      const chunkHash = hit.chunkHash ?? hit.chunkId
      const provenanceId = hit.provenanceId ?? `legacy_${hit.chunkId}`
      const record: KnowledgeContextRecord = {
        path: hit.relativePath,
        title: hit.title,
        relevanceScore: Math.min(1, Math.max(0, hit.score / 40)),
        excerpt: hit.snippet,
        content: hit.content,
        citation,
        citationNumber,
        tags,
        sourceKind: 'local',
        gbt7714Citation,
        authors: citationFields.authors ?? [],
        publicationYear: citationFields.year,
        publicationName: citationFields.journalName,
        doi: citationFields.doi,
        layer: hit.layer,
        documentId: hit.documentId,
        chunkId: hit.chunkId,
        provenanceId,
        documentHash,
        chunkHash,
        headingPath: hit.headingPath ?? [],
        articleNumber: hit.articleNumber,
        charStart: hit.charStart,
        charEnd: hit.charEnd
      }
      const entry = this.formatEntry(record)
      if (totalChars + entry.length > maxChars) continue

      records.push(record)
      bibliographyEntries.push({ title: hit.title, citation: gbt7714Citation })
      contextEntries.push(entry)
      totalChars += entry.length
    }

    const result: KnowledgeRetrievalResult = {
      contextText: this.formatContextText(contextEntries, query),
      sources: records,
      consultedExternal: false,
      latencyMs: Date.now() - startedAt,
      bibliography: bibliographyEntries
        .map((entry, index) => `[${index + 1}] ${entry.citation}`)
        .join('\n'),
      citations: bibliographyEntries.map((entry) => entry.citation),
      cacheHit: false,
      revision: diagnostics.revision,
      retrieverVersion: diagnostics.retrieverVersion
    }
    setKnowledgeRetrievalCache(cacheKey, result)
    return result
  }

  private readMetadata(filePath: string): KnowledgeMeta {
    const metaPath = filePath.replace(/\.\w+$/, '.meta.json')
    if (existsSync(metaPath)) {
      try {
        const raw = readFileSync(metaPath, 'utf8')
        const parsed = JSON.parse(raw)
        const result = KnowledgeMeta.safeParse(parsed)
        if (result.success) return result.data
      } catch {
        // Fall through to default.
      }
    }
    return { ...DEFAULT_KNOWLEDGE_META }
  }

  private buildCitationWithMeta(title: string, relativePath: string, meta: KnowledgeMeta): string {
    const parts = relativePath.replace(/\\/g, '/').split('/').filter(Boolean)
    const folder = parts.slice(0, -1).join(' › ')
    const fileName = parts.at(-1)?.replace(/\.[^/.]+$/, '') ?? title
    const base = folder ? `${folder} › ${fileName}` : fileName
    return meta.category ? `[${meta.category}] ${base}` : base
  }

  private formatEntry(record: KnowledgeContextRecord): string {
    const badges: string[] = []
    if (record.tags.includes('has_expiry')) badges.push('⚠️ 有时效性')
    if (record.tags.includes('deprecated')) badges.push('⚠️ 已废弃')
    if (record.tags.includes('high_confidence')) badges.push('可信度高')
    if (record.tags.includes('经验分享')) badges.push('经验分享')
    if (record.articleNumber) badges.push(record.articleNumber)
    const badgeStr = badges.length ? ` [${badges.join('][')}]` : ''
    const headingPath = record.headingPath ?? []
    const heading = headingPath.length
      ? `\n位置：${headingPath.join(' › ')}`
      : ''
    return [
      `[${record.citationNumber}] ${record.citation}${badgeStr}`,
      `source_id: ${record.provenanceId}`,
      `chunk_id: ${record.chunkId}${heading}`,
      record.excerpt.slice(0, 700),
      ''
    ].join('\n')
  }

  private formatContextText(entries: string[], query: string): string {
    if (!entries.length) return ''
    return [
      '【知识库检索结果】',
      `查询：${query}`,
      `匹配 ${entries.length} 个证据片段`,
      '引用这些材料时请使用对应的 [N] 编号；编号与 source_id/chunk_id 的映射由系统保留用于核验。',
      '',
      entries.join('\n')
    ].join('\n')
  }

  private async filterExpired(filePaths: string[]): Promise<Set<string>> {
    const expired = new Set<string>()
    const now = Date.now()
    for (const filePath of filePaths) {
      const meta = this.readMetadata(filePath)
      if (meta.deprecated) {
        expired.add(filePath)
        continue
      }
      if (meta.expiresAt) {
        try {
          if (now > new Date(meta.expiresAt).getTime()) expired.add(filePath)
        } catch {
          // Invalid date string; do not silently exclude the document.
        }
      }
    }
    return expired
  }
}

export function isLegalQuery(query: string): boolean {
  const legalTerms = [
    '法', '法规', '条例', '规定', '办法', '通知', '公告',
    '合同', '协议', '条款', '违约', '责任', '赔偿',
    '诉讼', '仲裁', '判决', '裁定', '案例',
    '合规', '尽调', '审查',
    '民法典', '公司法', '劳动法', '刑法', '行政',
    '最高法', '最高检', '司法',
    '废止', '失效', '修改',
    '裁判', '要旨', '规则'
  ]
  const lower = query.toLowerCase()
  return legalTerms.some((term) => lower.includes(term))
}
