import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import type { KnowledgeStore } from '../knowledge/knowledge-store.js'
import type { KnowledgeContextRecord, KnowledgeRetrievalResult } from '../contracts/knowledge-retrieval.js'
import { KnowledgeMeta, DEFAULT_KNOWLEDGE_META } from '../contracts/knowledge-retrieval.js'

const MAX_CONTEXT_CHARS = 8_000
const MAX_SOURCES = 12

/**
 * Auto-retrieval pipeline that, given a user query, automatically:
 * 1. Searches the local knowledge base for relevant content
 * 2. Checks metadata for expiry/deprecation status
 * 3. Formats a compact context block for model injection
 * 4. Returns source records for citation tracking
 */
export class KnowledgeRetrievalPipeline {
  constructor(private readonly store: KnowledgeStore) {}

  /**
   * Run the full retrieval pipeline for a user query.
   * Returns formatted context text + source citations.
   */
  async retrieve(query: string, options?: {
    maxChars?: number
    excludeExpired?: boolean
    includeExternal?: boolean
  }): Promise<KnowledgeRetrievalResult> {
    const startedAt = Date.now()
    const maxChars = options?.maxChars ?? MAX_CONTEXT_CHARS
    const excludeExpired = options?.excludeExpired ?? true

    // 1. Search local knowledge base
    const hits = await this.store.search({ query, limit: MAX_SOURCES, includeContent: true })

    // 2. Filter by expiry and deprecation if requested
    const filtered = excludeExpired
      ? await this.filterExpired(hits.map((h) => h.path))
      : new Set<string>()

    // 3. Build context records with metadata enrichment
    const records: KnowledgeContextRecord[] = []
    const contextEntries: string[] = []
    let totalChars = 0

    for (const hit of hits) {
      if (filtered.has(hit.path)) continue

      // Read sidecar .meta.json if available
      const meta = this.readMetadata(hit.path)
      const citation = this.buildCitationWithMeta(hit.title, hit.relativePath, meta)
      const confidenceTag = meta.confidence === 'high' ? 'high_confidence' : meta.confidence === 'deprecated' ? 'deprecated' : ''
      const tags = [...meta.tags]
      if (meta.deprecated) tags.push('deprecated')
      if (meta.expiresAt) tags.push('has_expiry')
      if (confidenceTag) tags.push(confidenceTag)

      const record: KnowledgeContextRecord = {
        path: hit.relativePath,
        title: hit.title,
        relevanceScore: Math.min(1, hit.score / 30),
        excerpt: hit.snippet,
        content: hit.content,
        citation,
        tags,
        sourceKind: 'local'
      }
      records.push(record)

      // Accumulate context text up to the limit
      const entry = this.formatEntry(record)
      if (totalChars + entry.length <= maxChars) {
        contextEntries.push(entry)
        totalChars += entry.length
      }
    }

    // 4. Format the final context text
    const contextText = this.formatContextText(contextEntries, query)

    return {
      contextText,
      sources: records,
      consultedExternal: false,
      latencyMs: Date.now() - startedAt
    }
  }

  /**
   * Read sidecar metadata file if present.
   */
  private readMetadata(filePath: string): KnowledgeMeta {
    // Derive .meta.json path from the document path
    // KnowledgeStore stores absolute paths, so we look for .meta.json alongside
    const metaPath = filePath.replace(/\.\w+$/, '.meta.json')
    if (existsSync(metaPath)) {
      try {
        const raw = readFileSync(metaPath, 'utf8')
        const parsed = JSON.parse(raw)
        const result = KnowledgeMeta.safeParse(parsed)
        if (result.success) return result.data
      } catch {
        // Fall through to default
      }
    }
    return { ...DEFAULT_KNOWLEDGE_META }
  }

  /**
   * Build a citation string enriched with metadata info.
   */
  private buildCitationWithMeta(title: string, relativePath: string, meta: KnowledgeMeta): string {
    const parts = relativePath.replace(/\\/g, '/').split('/').filter(Boolean)
    const folder = parts.slice(0, -1).join(' › ')
    const fileName = parts.at(-1)?.replace(/\.[^/.]+$/, '') ?? title
    const base = folder ? `${folder} › ${fileName}` : fileName
    if (meta.category) {
      return `[${meta.category}] ${base}`
    }
    return base
  }

  /**
   * Format a single entry for the context block.
   */
  private formatEntry(record: KnowledgeContextRecord): string {
    const badges: string[] = []
    if (record.tags.includes('has_expiry')) badges.push('⚠️ 有时效性')
    if (record.tags.includes('deprecated')) badges.push('⚠️ 已废弃')
    if (record.tags.includes('high_confidence')) badges.push('可信度高')
    if (record.tags.includes('经验分享')) badges.push('经验分享')
    const badgeStr = badges.length ? ` [${badges.join('][')}]` : ''
    return `[${record.citation}]${badgeStr}\n${record.excerpt.slice(0, 600)}\n\n`
  }

  /**
   * Format context records into a compact block for model injection.
   */
  private formatContextText(entries: string[], query: string): string {
    if (!entries.length) return ''

    const header = `【知识库检索结果】\n查询：${query}\n匹配 ${entries.length} 个来源\n\n`
    return header + entries.join('\n\n')
  }

  /**
   * Check which documents are expired/deprecated using sidecar metadata.
   */
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
          const expiresAt = new Date(meta.expiresAt).getTime()
          if (now > expiresAt) {
            expired.add(filePath)
          }
        } catch {
          // Invalid date string, skip
        }
      }
    }
    return expired
  }
}

/** Detect if a query likely relates to legal/time-sensitive information. */
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
