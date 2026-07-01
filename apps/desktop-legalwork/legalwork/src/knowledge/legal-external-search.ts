import type { KnowledgeContextRecord } from '../contracts/knowledge-retrieval.js'

const NPC_BASE_URL = 'https://flk.npc.gov.cn'
const NPC_TIMEOUT_MS = 12_000
const MAX_NPC_ROWS_PER_STRATEGY = 20
const MAX_NPC_RECORDS = 8
const MAX_NPC_DETAILS = 5
const MAX_NPC_ARTICLE_DOWNLOADS = 3
const MAX_NPC_DOCX_BYTES = 24 * 1024 * 1024
const MAX_ARTICLE_TEXT_CHARS = 4_000

type LegalSearchSource = {
  name: string
  url: string
  type: 'official' | 'judicial' | 'academic'
  defaultFor?: string
}

type NpcSearchStrategy = {
  query: string
  range: 1 | 2
  type: 1 | 2
  status: string[]
  label: string
}

type NpcSearchRow = {
  bbbs?: string
  title?: string
  flxz?: string
  zdjgName?: string
  gbrq?: string
  sxrq?: string
  sxx?: number | string
  score?: number
}

type NpcContentNode = {
  title?: string
  children?: NpcContentNode[]
}

type NpcDetail = NpcSearchRow & {
  content?: NpcContentNode
}

type NpcLawResult = {
  bbbs: string
  title: string
  flxz: string
  authority: string
  publishDate: string
  effectiveDate: string
  status: string
  statusCode: string
  detailUrl: string
  strategies: string[]
  score: number
  detail?: NpcDetail
  outline: string[]
  articleQuery?: string
  articleDirectoryHit?: string
  articleText?: string
  articleTextSource?: 'article-number' | 'keyword'
  articleExtractError?: string
}

type NpcArticle = {
  number: string
  text: string
}

const NPC_LAW_DATABASE: LegalSearchSource = {
  name: '国家法律法规数据库',
  url: 'https://flk.npc.gov.cn',
  type: 'official',
  defaultFor: '中国大陆法律、行政法规、地方性法规、司法解释、规章、规范性文件、具体法条原文与时效性核验'
}

const LEGAL_SEARCH_SOURCES: LegalSearchSource[] = [
  NPC_LAW_DATABASE,
  { name: '最高人民法院', url: 'https://www.court.gov.cn', type: 'judicial' },
  { name: '中国裁判文书网', url: 'https://wenshu.court.gov.cn', type: 'judicial' },
  { name: '司法部', url: 'https://www.moj.gov.cn', type: 'official' },
  {
    name: '国家市场监督管理总局',
    url: 'https://www.samr.gov.cn',
    type: 'official'
  }
]

const NPC_STATUS_LABELS: Record<string, string> = {
  '1': '已废止',
  '2': '已修改',
  '3': '现行有效',
  '4': '尚未生效'
}

const LAW_LEVEL_RANK: Record<string, number> = {
  宪法: 1,
  法律: 2,
  行政法规: 3,
  地方性法规: 4,
  司法解释: 5,
  部门规章: 6,
  地方政府规章: 7,
  监察法规: 8,
  法律解释: 9,
  决定: 10
}

const buildNpcSearchGuidance = (query: string): string =>
  [
    `默认官方法规来源：${NPC_LAW_DATABASE.name}（${NPC_LAW_DATABASE.url}）`,
    `适用：${NPC_LAW_DATABASE.defaultFor}`,
    '',
    '未指定北大法宝、元典 MCP 或其他商业库时，法条/法规原文检索默认动作：',
    '  1. 已知法规名称：标题精确检索；无结果再做标题模糊检索。',
    '  2. 主题找法：标题模糊检索 + 正文检索，按法源位阶筛选。',
    '  3. 具体法条：先定位法规详情，再抽取具体条、款、项并核对时效性。',
    '  4. 默认优先现行有效；历史沿革问题再扩展到已修改、已废止、尚未生效。',
    '  5. 输出必须标注法规名称、制定机关、公布/施行日期、时效性、条文原文、来源链接。',
    '',
    `建议 web_search 查询：site:flk.npc.gov.cn ${query}`
  ].join('\n')

const stripHtml = (value: string | undefined): string =>
  (value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const normalizeArticleNumber = (value: string): string => {
  const normalized = value.replace(/\s+/g, '')
  if (normalized.startsWith('第') && normalized.endsWith('条')) return normalized
  if (normalized.endsWith('条')) return `第${normalized.replace(/^第/, '')}`
  return `第${normalized}条`
}

const CHINESE_DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

const intToChinese = (value: number): string => {
  if (value <= 0) return String(value)
  if (value < 10) return CHINESE_DIGITS[value] ?? String(value)
  if (value < 20) return `十${value % 10 === 0 ? '' : CHINESE_DIGITS[value % 10]}`
  if (value < 100) {
    const tens = Math.floor(value / 10)
    const ones = value % 10
    return `${CHINESE_DIGITS[tens]}十${ones === 0 ? '' : CHINESE_DIGITS[ones]}`
  }
  if (value < 1000) {
    const hundreds = Math.floor(value / 100)
    const rest = value % 100
    if (rest === 0) return `${CHINESE_DIGITS[hundreds]}百`
    return `${CHINESE_DIGITS[hundreds]}百${rest < 10 ? '零' : ''}${intToChinese(rest)}`
  }
  return String(value)
}

const normalizeArticleVariants = (articleQuery: string | undefined): Set<string> => {
  const variants = new Set<string>()
  if (!articleQuery) return variants
  const normalized = articleQuery.replace(/\s+/g, '')
  variants.add(normalized)
  const digitMatch = normalized.match(/^第?(\d+)条$/u)
  if (digitMatch?.[1]) {
    const number = Number(digitMatch[1])
    if (Number.isFinite(number)) variants.add(`第${intToChinese(number)}条`)
  }
  const chineseMatch = normalized.match(/^第?([零〇一二三四五六七八九十百千万两]+)条$/u)
  if (chineseMatch?.[1]) variants.add(`第${chineseMatch[1].replace(/〇/g, '零').replace(/两/g, '二')}条`)
  return variants
}

const extractArticleQuery = (query: string): string | undefined => {
  const match = query.match(/第?\s*([零〇一二三四五六七八九十百千万两\d]+)\s*条/u)
  if (!match?.[1]) return undefined
  return normalizeArticleNumber(match[1])
}

const removeArticleQuery = (query: string): string =>
  query
    .replace(/第?\s*[零〇一二三四五六七八九十百千万两\d]+\s*条/u, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const buildQueryCandidates = (query: string): string[] => {
  const raw = query.trim()
  const withoutArticle = removeArticleQuery(raw)
  const withoutBookMarks = withoutArticle.replace(/[《》「」“”"'`]/g, ' ').replace(/\s+/g, ' ').trim()
  const cleaned = withoutBookMarks
    .replace(/(请|帮我|查询|检索|查找|查一下|核验|验证|现行有效|法律依据|法条|法规|条文|原文|依据)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const candidates = [withoutArticle, withoutBookMarks, cleaned, raw]
    .map((item) => item.trim())
    .filter((item) => item.length >= 2)

  return [...new Set(candidates)].slice(0, 3)
}

const shouldIncludeHistoricalStatus = (query: string): boolean =>
  /废止|失效|修改|修订|历史|沿革|旧法|新旧|尚未生效|未生效|施行前|生效前/u.test(query)

const buildNpcStrategies = (query: string): NpcSearchStrategy[] => {
  const candidates = buildQueryCandidates(query)
  const status = shouldIncludeHistoricalStatus(query) ? [] : ['3']
  const strategies: NpcSearchStrategy[] = []

  for (const candidate of candidates) {
    strategies.push({ query: candidate, range: 1, type: 1, status, label: `标题精确:${candidate}` })
    strategies.push({ query: candidate, range: 1, type: 2, status, label: `标题模糊:${candidate}` })
  }

  for (const candidate of candidates.slice(0, 2)) {
    strategies.push({ query: candidate, range: 2, type: 2, status, label: `正文模糊:${candidate}` })
  }

  return strategies
}

const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), NPC_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Referer: `${NPC_BASE_URL}/`,
        'User-Agent': 'Legalwork/0.2 legal-research',
        ...(init?.headers ?? {})
      }
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json() as T
  } finally {
    clearTimeout(timeout)
  }
}

const fetchArrayBuffer = async (url: string, init?: RequestInit): Promise<ArrayBuffer> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), NPC_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: '*/*',
        Referer: `${NPC_BASE_URL}/`,
        'User-Agent': 'Legalwork/0.2 legal-research',
        ...(init?.headers ?? {})
      }
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const buffer = await response.arrayBuffer()
    if (buffer.byteLength > MAX_NPC_DOCX_BYTES) throw new Error(`DOCX too large: ${buffer.byteLength} bytes`)
    return buffer
  } finally {
    clearTimeout(timeout)
  }
}

const searchNpcByStrategy = async (strategy: NpcSearchStrategy): Promise<NpcSearchRow[]> => {
  const body = {
    searchRange: strategy.range,
    sxrq: [],
    gbrq: [],
    sxx: strategy.status,
    searchType: strategy.type,
    xgzlSearch: false,
    searchContent: strategy.query,
    orderByParam: { order: '-1', sort: '' },
    flfgCodeId: [],
    zdjgCodeId: [],
    gbrqYear: [],
    pageNum: 1,
    pageSize: MAX_NPC_ROWS_PER_STRATEGY
  }
  const result = await fetchJson<{ rows?: NpcSearchRow[] }>(`${NPC_BASE_URL}/law-search/search/list`, {
    method: 'POST',
    body: JSON.stringify(body)
  })
  return Array.isArray(result.rows) ? result.rows : []
}

const fetchNpcDetail = async (bbbs: string): Promise<NpcDetail | undefined> => {
  const result = await fetchJson<{ code?: number, data?: NpcDetail }>(
    `${NPC_BASE_URL}/law-search/search/flfgDetails?bbbs=${encodeURIComponent(bbbs)}`
  )
  return result.data
}

const fetchNpcDownloadUrl = async (bbbs: string): Promise<string | undefined> => {
  const result = await fetchJson<{ code?: number, data?: { url?: string } }>(
    `${NPC_BASE_URL}/law-search/download/pc?format=docx&bbbs=${encodeURIComponent(bbbs)}`
  )
  return result.data?.url
}

const extractDocxTextFromBuffer = async (buffer: ArrayBuffer): Promise<string> => {
  const bytes = Buffer.from(buffer)
  if (bytes.subarray(0, 4).toString('binary') !== 'PK\u0003\u0004') {
    throw new Error('downloaded file is not a DOCX package')
  }
  const { default: mammoth } = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer: bytes })
  return result.value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const isArticleLine = (line: string): boolean =>
  /^第[一二三四五六七八九十百千万零〇两\d]+条/u.test(line.trim())

const extractArticleNumberFromLine = (line: string): string => {
  const match = line.trim().match(/^(第[一二三四五六七八九十百千万零〇两\d]+条)/u)
  return match?.[1] ?? line.trim().slice(0, 20)
}

const splitIntoArticles = (text: string): NpcArticle[] => {
  const articles: NpcArticle[] = []
  let currentNumber = '题注/前言'
  let currentLines: string[] = []

  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (isArticleLine(trimmed)) {
      if (currentLines.length) articles.push({ number: currentNumber, text: currentLines.join('\n') })
      currentNumber = extractArticleNumberFromLine(trimmed)
      currentLines = [trimmed]
    } else {
      currentLines.push(trimmed)
    }
  }

  if (currentLines.length) articles.push({ number: currentNumber, text: currentLines.join('\n') })
  return articles
}

const findArticleByNumber = (articles: NpcArticle[], articleQuery: string | undefined): NpcArticle | undefined => {
  const variants = normalizeArticleVariants(articleQuery)
  if (!variants.size) return undefined
  return articles.find((article) => variants.has(article.number.replace(/\s+/g, '')))
}

const keywordTokensForArticleSearch = (query: string): string[] => {
  const cleaned = removeArticleQuery(query)
    .replace(/[《》「」“”"'`]/g, ' ')
    .replace(/(请|帮我|查询|检索|查找|查一下|核验|验证|现行有效|法律依据|法条|法规|条文|原文|依据|中华人民共和国|第|条)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return [...new Set(cleaned.split(/\s+/).filter((token) => token.length >= 2))].slice(0, 6)
}

const findArticlesByKeywords = (articles: NpcArticle[], query: string, title: string): NpcArticle[] => {
  const titleTokens = title
    .replace(/^中华人民共和国/u, '')
    .replace(/法|条例|办法|规定|解释/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const titleTokenSet = new Set(titleTokens)
  const tokens = keywordTokensForArticleSearch(query).filter((token) => !titleTokenSet.has(token) && !title.includes(token))
  if (!tokens.length) return []
  return articles
    .map((article) => ({
      article,
      score: tokens.reduce((sum, token) => sum + (article.text.includes(token) ? 1 : 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.article)
}

const extractNpcArticleText = async (result: NpcLawResult, query: string): Promise<Partial<NpcLawResult>> => {
  try {
    const signedUrl = await fetchNpcDownloadUrl(result.bbbs)
    if (!signedUrl) return { articleExtractError: 'download URL unavailable' }
    const buffer = await fetchArrayBuffer(signedUrl)
    const text = await extractDocxTextFromBuffer(buffer)
    const articles = splitIntoArticles(text)

    const numberedArticle = findArticleByNumber(articles, result.articleQuery)
    if (numberedArticle) {
      return {
        articleText: numberedArticle.text.slice(0, MAX_ARTICLE_TEXT_CHARS),
        articleTextSource: 'article-number'
      }
    }

    const keywordArticles = findArticlesByKeywords(articles, query, result.title)
    if (keywordArticles.length) {
      return {
        articleText: keywordArticles.map((article) => article.text).join('\n\n').slice(0, MAX_ARTICLE_TEXT_CHARS),
        articleTextSource: 'keyword'
      }
    }

    return { articleExtractError: 'no matching article found in DOCX' }
  } catch (error) {
    return { articleExtractError: error instanceof Error ? error.message : String(error) }
  }
}

const collectOutline = (node: NpcContentNode | undefined, maxItems = 28): string[] => {
  const result: string[] = []
  const walk = (current: NpcContentNode | undefined): void => {
    if (!current || result.length >= maxItems) return
    const title = stripHtml(current.title)
    if (title) result.push(title)
    for (const child of current.children ?? []) walk(child)
  }
  walk(node)
  return result
}

const findArticleDirectoryHit = (node: NpcContentNode | undefined, articleQuery: string | undefined): string | undefined => {
  if (!node || !articleQuery) return undefined
  const normalized = articleQuery.replace(/\s+/g, '')
  const stack = [node]
  while (stack.length) {
    const current = stack.shift()
    const title = stripHtml(current?.title)
    if (title.replace(/\s+/g, '') === normalized) return title
    stack.push(...(current?.children ?? []))
  }
  return undefined
}

const statusLabel = (value: number | string | undefined): string => {
  const key = String(value ?? '')
  return NPC_STATUS_LABELS[key] ?? (key ? `未知状态(${key})` : '未标注')
}

const scoreNpcRow = (row: NpcSearchRow, strategies: string[], query: string): number => {
  const title = stripHtml(row.title)
  const normalizedQuery = removeArticleQuery(query).replace(/[《》\s]/g, '')
  const normalizedTitle = title.replace(/[《》\s]/g, '')
  const statusScore = String(row.sxx) === '3' ? 0.28 : String(row.sxx) === '4' ? 0.12 : 0
  const exactTitleScore = normalizedQuery && normalizedTitle === normalizedQuery ? 0.32 : 0
  const titleContainsScore = normalizedQuery && normalizedTitle.includes(normalizedQuery) ? 0.2 : 0
  const strategyScore = Math.min(0.22, strategies.length * 0.055)
  const levelScore = Math.max(0, 0.14 - ((LAW_LEVEL_RANK[row.flxz ?? ''] ?? 9) - 1) * 0.015)
  const remoteScore = Math.min(0.08, Math.max(0, (row.score ?? 0) / 1200))
  return Math.min(1, statusScore + exactTitleScore + titleContainsScore + strategyScore + levelScore + remoteScore)
}

const searchNpcLaws = async (query: string): Promise<NpcLawResult[]> => {
  const strategies = buildNpcStrategies(query)
  const settled = await Promise.allSettled(strategies.map(async (strategy) => ({
    strategy,
    rows: await searchNpcByStrategy(strategy)
  })))

  const byId = new Map<string, { row: NpcSearchRow, strategies: string[] }>()
  for (const item of settled) {
    if (item.status !== 'fulfilled') continue
    for (const row of item.value.rows) {
      if (!row.bbbs) continue
      const existing = byId.get(row.bbbs)
      if (existing) {
        existing.strategies.push(item.value.strategy.label)
      } else {
        byId.set(row.bbbs, { row, strategies: [item.value.strategy.label] })
      }
    }
  }

  const articleQuery = extractArticleQuery(query)
  const ranked = [...byId.entries()]
    .map(([bbbs, item]) => {
      const title = stripHtml(item.row.title)
      return {
        bbbs,
        title,
        flxz: item.row.flxz ?? '未标注',
        authority: item.row.zdjgName ?? '未标注',
        publishDate: item.row.gbrq ?? '未标注',
        effectiveDate: item.row.sxrq ?? '未标注',
        status: statusLabel(item.row.sxx),
        statusCode: String(item.row.sxx ?? ''),
        detailUrl: `${NPC_BASE_URL}/detail?id=${encodeURIComponent(bbbs)}`,
        strategies: [...new Set(item.strategies)],
        score: scoreNpcRow(item.row, item.strategies, query),
        outline: [] as string[],
        articleQuery
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_NPC_RECORDS)

  const detailSettled = await Promise.allSettled(
    ranked.slice(0, MAX_NPC_DETAILS).map(async (result) => ({
      bbbs: result.bbbs,
      detail: await fetchNpcDetail(result.bbbs)
    }))
  )
  const details = new Map<string, NpcDetail>()
  for (const item of detailSettled) {
    if (item.status === 'fulfilled' && item.value.detail) details.set(item.value.bbbs, item.value.detail)
  }

  const withDetails = ranked.map((result) => {
    const detail = details.get(result.bbbs)
    const outline = collectOutline(detail?.content)
    return {
      ...result,
      title: detail?.title ?? result.title,
      flxz: detail?.flxz ?? result.flxz,
      authority: detail?.zdjgName ?? result.authority,
      publishDate: detail?.gbrq ?? result.publishDate,
      effectiveDate: detail?.sxrq ?? result.effectiveDate,
      status: statusLabel(detail?.sxx ?? result.statusCode),
      statusCode: String(detail?.sxx ?? result.statusCode),
      detail,
      outline,
      articleDirectoryHit: findArticleDirectoryHit(detail?.content, articleQuery)
    }
  })

  const shouldExtractArticles = Boolean(articleQuery) || !buildQueryCandidates(query).some((candidate) => candidate.length >= 5 && /法|条例|办法|规定|解释/u.test(candidate))
  if (!shouldExtractArticles) return withDetails

  const extractSettled = await Promise.allSettled(
    withDetails.slice(0, MAX_NPC_ARTICLE_DOWNLOADS).map(async (result) => ({
      bbbs: result.bbbs,
      patch: await extractNpcArticleText(result, query)
    }))
  )
  const patches = new Map<string, Partial<NpcLawResult>>()
  for (const item of extractSettled) {
    if (item.status === 'fulfilled') patches.set(item.value.bbbs, item.value.patch)
  }

  return withDetails.map((result) => ({
    ...result,
    ...(patches.get(result.bbbs) ?? {})
  }))
}

const formatNpcRecord = (result: NpcLawResult): KnowledgeContextRecord => {
  const articleLine = result.articleQuery
    ? result.articleText
      ? `条文原文(${result.articleTextSource === 'article-number' ? '按条号抽取' : '按关键词抽取'}):\n${result.articleText}`
      : result.articleDirectoryHit
      ? `目录命中：${result.articleDirectoryHit}。`
      : `请求条文：${result.articleQuery}；详情目录未确认该条，需继续下载原文核验。`
    : result.articleText
      ? `相关条文原文(${result.articleTextSource === 'keyword' ? '按关键词抽取' : '按条号抽取'}):\n${result.articleText}`
      : ''
  const extractErrorLine = result.articleExtractError && (result.articleQuery || result.articleDirectoryHit)
    ? `原文抽取提示：${result.articleExtractError}`
    : ''
  const outline = result.outline.length ? `目录预览：${result.outline.slice(0, 18).join(' / ')}` : ''
  const excerpt = [
    `${result.flxz}｜${result.status}｜制定机关：${result.authority}`,
    `公布日期：${result.publishDate}；施行日期：${result.effectiveDate}`,
    articleLine,
    extractErrorLine,
    `命中策略：${result.strategies.slice(0, 4).join('；')}`,
    outline,
    `来源：${result.detailUrl}`
  ].filter(Boolean).join('\n')

  return {
    path: result.detailUrl,
    title: result.title,
    relevanceScore: result.score,
    excerpt,
    content: excerpt,
    citation: `国家法律法规数据库：${result.title}`,
    tags: ['official', 'npc-law-db', result.flxz, result.status].filter(Boolean),
    sourceKind: 'web'
  }
}

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
  let npcResults: NpcLawResult[] = []
  let npcError: string | undefined
  try {
    npcResults = await searchNpcLaws(query)
  } catch (error) {
    npcError = error instanceof Error ? error.message : String(error)
  }

  const records = npcResults.map(formatNpcRecord)

  // Build source descriptions even without search results
  const availableSources = LEGAL_SEARCH_SOURCES
    .map((source) => {
      const suffix = source.defaultFor ? `：${source.defaultFor}` : ''
      return `  - ${source.name}（${source.url}）${suffix}`
    })
    .join('\n')

  const articleQuery = extractArticleQuery(query)
  const npcSummary = npcError
    ? [
        `国家法律法规数据库 API 检索失败：${npcError}`,
        '已保留官方来源和 web_search/web_fetch 回退建议。'
      ].join('\n')
    : records.length
      ? [
          `国家法律法规数据库 API 已直接检索：返回 ${records.length} 个去重候选。`,
          '执行策略：标题精确 + 标题模糊 + 正文模糊；结果已按现行有效、标题命中、法源位阶和多策略重合度排序。',
          articleQuery
            ? `检测到具体条文请求：${articleQuery}。已在候选法规目录中做条号定位；引用正文前仍应以下载原文/详情页逐字核验为准。`
            : undefined,
          '可直接优先使用 records 中的官方候选；无需先让模型自行猜测法规名称。'
        ].filter(Boolean).join('\n')
      : [
          '国家法律法规数据库 API 未返回结构化候选。',
          '建议放宽关键词、去掉条号后重试，或使用下列官方来源继续检索。'
        ].join('\n')

  const summary = [
    '【外部法律信息检索】',
    `查询：${query}`,
    '',
    npcSummary,
    '',
    buildNpcSearchGuidance(query),
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
