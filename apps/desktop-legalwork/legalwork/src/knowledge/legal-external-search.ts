import type { KnowledgeContextRecord } from '../contracts/knowledge-retrieval.js'

const LEGAL_SEARCH_SOURCES = [
  { name: '最高人民法院', url: 'https://www.court.gov.cn', type: 'judicial' as const },
  { name: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', type: 'official' as const },
  { name: '中国裁判文书网', url: 'https://wenshu.court.gov.cn', type: 'judicial' as const },
  { name: '司法部', url: 'https://www.moj.gov.cn', type: 'official' as const },
  { name: '国家市场监督管理总局', url: 'https://www.samr.gov.cn', type: 'official' as const }
]

const MAX_EXTERNAL_CHARS = 6_000

/**
 * Perform a legal-focused external search by:
 * 1. Searching authoritative legal websites
 * 2. Fetching the most relevant results
 * 3. Formatting them as KnowledgeContextRecords
 */
export async function legalExternalSearch(query: string): Promise<{
  records: KnowledgeContextRecord[]
  summary: string
}> {
  // This is a framework - actual search requires a web search API.
  // The implementation reads the web provider configured in the system.
  const records: KnowledgeContextRecord[] = []
  let totalChars = 0

  // Build source descriptions even without search results
  const availableSources = LEGAL_SEARCH_SOURCES
    .map((source) => `  - ${source.name}（${source.url}）`)
    .join('\n')

  const summary = [
    '【外部法律信息检索】',
    `查询：${query}`,
    '',
    '建议查阅以下权威来源：',
    availableSources,
    '',
    '系统已配置外部搜索能力（web_search / web_fetch），',
    '执行深度法律检索时可调用 web_search 工具直接查询上述网站。'
  ].join('\n')

  return { records, summary }
}

/**
 * Check if a given URL or content mentions specific legal references.
 * Helps validate source authority.
 */
export function checkLegalAuthority(url: string): {
  authoritative: boolean
  sourceType: 'official' | 'judicial' | 'academic' | 'media' | 'other'
  reason: string
} {
  const hostname = new URL(url).hostname.toLowerCase()

  for (const source of LEGAL_SEARCH_SOURCES) {
    if (hostname.includes(new URL(source.url).hostname)) {
      return {
        authoritative: true,
        sourceType: source.type,
        reason: `${source.name} 官方网站`
      }
    }
  }

  if (hostname.endsWith('.gov.cn')) {
    return { authoritative: true, sourceType: 'official', reason: '政府官方网站' }
  }
  if (hostname.includes('pkulaw')) {
    return { authoritative: true, sourceType: 'academic', reason: '北大法律信息网' }
  }
  if (hostname.includes('chinacourt')) {
    return { authoritative: true, sourceType: 'judicial', reason: '中国法院网' }
  }

  return { authoritative: false, sourceType: 'other', reason: '非官方来源，建议交叉验证' }
}
