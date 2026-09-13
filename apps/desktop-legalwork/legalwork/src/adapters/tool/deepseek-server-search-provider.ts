import type { WebProvider, WebSearchResult } from '../../ports/web-provider.js'

/**
 * Web search provider backed by the DeepSeek server-side
 * `web_search_20250305` tool (Anthropic-compatible endpoint).
 *
 * The search itself executes inside the DeepSeek API — the client only
 * issues a request that declares the server tool and reads back the
 * `web_search_tool_result` blocks. This keeps the search result cheap
 * (the server runs it) and returns real titles + URLs for citation.
 */
export class DeepseekServerSearchProvider implements WebProvider {
  readonly id = 'deepseek-server-search'

  private readonly apiKey: string | undefined
  private readonly baseUrl: string
  private readonly model: string
  private readonly nowIso: () => string

  constructor(options?: {
    apiKey?: string
    baseUrl?: string
    model?: string
    nowIso?: () => string
  }) {
    this.apiKey = options?.apiKey?.trim() || undefined
    this.baseUrl = normalizeDeepseekServerSearchBaseUrl(options?.baseUrl)
    this.model = options?.model ?? 'deepseek-flash'
    this.nowIso = options?.nowIso ?? (() => new Date().toISOString())
  }

  async search(request: {
    query: string
    limit?: number
    timeoutMs?: number
    signal: AbortSignal
  }): Promise<WebSearchResult[]> {
    if (!this.apiKey) throw new Error('deepseek server search requires an API key')
    // 单次请求内服务端搜索次数默认 3、上限 8（用户指定），压缩整体耗时避免超过调用方超时
    const maxUses = Math.min(Math.max(request.limit ?? 3, 1), 8)
    const timeoutMs = request.timeoutMs ?? 60_000

    const controller = new AbortController()
    const onAbort = (): void => controller.abort()
    request.signal.addEventListener('abort', onAbort, { once: true })
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch(`${this.baseUrl}/anthropic/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 2048,
          messages: [
            { role: 'user', content: `Perform a web search for the query: ${request.query}` }
          ],
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: maxUses }],
          stream: false
        }),
        signal: controller.signal
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`deepseek server search failed with HTTP ${res.status}: ${body.slice(0, 200)}`)
      }
      const json = await res.json() as {
        content?: Array<{
          type?: string
          content?: Array<{ type?: string; title?: string; url?: string }>
        }>
      }
      return this.parseResults(json, request.query)
    } finally {
      clearTimeout(timer)
      request.signal.removeEventListener('abort', onAbort)
    }
  }

  private parseResults(json: {
    content?: Array<{
      type?: string
      content?: Array<{ type?: string; title?: string; url?: string }>
    }>
  }, query: string): WebSearchResult[] {
    const results: WebSearchResult[] = []
    const blocks = json.content ?? []
    for (const block of blocks) {
      if (block.type !== 'web_search_tool_result') continue
      for (const item of block.content ?? []) {
        if (item.type !== 'web_search_result') continue
        const url = item.url?.trim()
        if (!url) continue
        const title = item.title?.trim() ?? ''
        // 尝试提取真实摘要/描述（DeepSeek 可能返回 snippet/description/content 字段），
        // 避免 snippet 恒等于标题导致"依赖 snippet 核验"的指令无内容可用。
        const extra = item as { snippet?: string; description?: string; content?: string }
        const snippetText = (
          extra.snippet ??
          extra.description ??
          (typeof extra.content === 'string' ? extra.content : '') ??
          ''
        ).trim()
        const rank = results.length
        results.push({
          sourceId: `deepseek_search_${rank}_${url.length}`,
          url,
          title: title || url,
          snippet: snippetText || title || url,
          provider: this.id,
          rank,
          retrievedAt: this.nowIso()
        })
      }
    }
    if (results.length === 0) {
      throw new Error(`deepseek server search returned no results for query: ${query}`)
    }
    return results
  }
}

export function normalizeDeepseekServerSearchBaseUrl(baseUrl?: string): string {
  return (baseUrl?.trim() || 'https://api.deepseek.com')
    .replace(/\/+$/, '')
    .replace(/\/v1$/i, '')
}
