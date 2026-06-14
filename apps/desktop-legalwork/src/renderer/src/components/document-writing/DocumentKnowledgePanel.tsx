import type { ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Database,
  FileText,
  FolderOpen,
  RefreshCw,
  Search,
  X
} from 'lucide-react'
import {
  LEGALWORK_KNOWLEDGE_AGENT_SOURCES_PATH,
  LEGALWORK_KNOWLEDGE_CREATE_FOLDER_PATH,
  LEGALWORK_KNOWLEDGE_DELETE_FILE_PATH,
  LEGALWORK_KNOWLEDGE_DIAGNOSTICS_PATH,
  LEGALWORK_KNOWLEDGE_MOVE_PATH,
  LEGALWORK_KNOWLEDGE_READ_FILE_PATH,
  LEGALWORK_KNOWLEDGE_SEARCH_PATH,
  LEGALWORK_KNOWLEDGE_SYNC_PATH,
  LEGALWORK_KNOWLEDGE_TREE_PATH,
  LEGALWORK_KNOWLEDGE_WRITE_FILE_PATH
} from '../../../../shared/legalwork-endpoints'
import { KnowledgeFileBrowser } from './KnowledgeFileBrowser'

type KnowledgeHit = {
  documentId: string
  chunkId: string
  title: string
  path: string
  relativePath: string
  score: number
  snippet: string
  content?: string
}

type KnowledgeDiagnostics = {
  enabled: boolean
  rootDir: string
  sourceRoots: string[]
  documentCount: number
  chunkCount: number
  syncedAt?: string
  lastSelectedIds: string[]
}

type SyncResult = {
  syncedAt: string
  roots: string[]
  documentCount: number
  chunkCount: number
  skippedCount: number
}

type SearchMode = 'search' | 'agent'

async function requestJson<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const result = await window.dsGui.runtimeRequest(
    path,
    method,
    body === undefined ? undefined : JSON.stringify(body)
  )
  if (!result.ok) {
    throw new Error(result.body || `请求失败：${result.status}`)
  }
  return JSON.parse(result.body) as T
}

function highlightTerms(text: string, terms: string[]): ReactElement {
  if (!terms.length || !text) return <>{text}</>
  const lower = text.toLowerCase()
  const parts: ReactElement[] = []
  let lastEnd = 0

  for (let i = 0; i < text.length; ) {
    let matchLen = 0
    let matchedTerm = ''
    for (const term of terms) {
      if (lower.startsWith(term, i) && term.length > matchLen) {
        matchLen = term.length
        matchedTerm = term
      }
    }
    if (matchLen > 0) {
      if (i > lastEnd) {
        parts.push(<span key={`t${lastEnd}`}>{text.slice(lastEnd, i)}</span>)
      }
      parts.push(
        <mark key={`m${i}`} className="rounded-sm bg-amber-200/70 px-0.5 text-inherit dark:bg-amber-600/40">
          {text.slice(i, i + matchLen)}
        </mark>
      )
      i += matchLen
      lastEnd = i
    } else {
      i += 1
    }
  }
  if (lastEnd < text.length) {
    parts.push(<span key={`t${lastEnd}`}>{text.slice(lastEnd)}</span>)
  }
  return <>{parts}</>
}

type Props = {
  onClose?: () => void
}

export function DocumentKnowledgePanel({ onClose }: Props): ReactElement {
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<KnowledgeHit[]>([])
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null)
  const [diagnostics, setDiagnostics] = useState<KnowledgeDiagnostics | null>(null)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<SearchMode>('search')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [viewMode, setViewMode] = useState<'search' | 'browse'>('search')
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedHit = useMemo(
    () => hits.find((hit) => hit.chunkId === selectedChunkId) ?? hits[0] ?? null,
    [hits, selectedChunkId]
  )

  const searchTerms = useMemo(() => {
    if (!hasSearched || !query.trim()) return []
    const lower = query.toLowerCase()
    const terms = new Set<string>()
    for (const term of lower.split(/[^a-z0-9\u3400-\u9fff]+/).filter(Boolean)) {
      if (term.length > 1) terms.add(term)
    }
    return [...terms]
  }, [query, hasSearched])

  const loadDiagnostics = useCallback(async () => {
    try {
      const payload = await requestJson<{ knowledge: KnowledgeDiagnostics }>(
        LEGALWORK_KNOWLEDGE_DIAGNOSTICS_PATH
      )
      setDiagnostics(payload.knowledge)
      setError(null)
    } catch (err) {
      // Don't show error on initial load - backend might be starting
      if (diagnostics !== null) {
        setError(err instanceof Error ? err.message : '知识库状态读取失败')
      }
    }
  }, [diagnostics])

  useEffect(() => {
    void loadDiagnostics()
  }, [loadDiagnostics])

  const handleSync = useCallback(async () => {
    setSyncing(true)
    setError(null)
    setSyncResult(null)
    try {
      const result = await requestJson<SyncResult>(
        LEGALWORK_KNOWLEDGE_SYNC_PATH,
        'POST',
        { maxFiles: 1500 }
      )
      setSyncResult(result)
      void loadDiagnostics()
    } catch (err) {
      setError(err instanceof Error ? err.message : '知识库同步失败')
    } finally {
      setSyncing(false)
    }
  }, [loadDiagnostics])

  const runSearch = useCallback(async (mode: SearchMode = 'search') => {
    const trimmed = query.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    setSearchMode(mode)
    setHasSearched(true)
    try {
      const endpoint = mode === 'agent'
        ? LEGALWORK_KNOWLEDGE_AGENT_SOURCES_PATH
        : LEGALWORK_KNOWLEDGE_SEARCH_PATH
      const includeContent = mode === 'agent' ? 'true' : 'true'
      const payload = await requestJson<{ hits?: KnowledgeHit[]; sources?: KnowledgeHit[] }>(
        `${endpoint}?q=${encodeURIComponent(trimmed)}&top_k=12&include_content=${includeContent}`
      )
      const nextHits = payload.hits ?? payload.sources ?? []
      setHits(nextHits)
      setSelectedChunkId(nextHits[0]?.chunkId ?? null)
      void loadDiagnostics()
    } catch (err) {
      setError(err instanceof Error ? err.message : '知识库检索失败')
    } finally {
      setLoading(false)
    }
  }, [loadDiagnostics, query])

  const handleCopyContent = useCallback(async (content: string, chunkId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(chunkId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Fallback
    }
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      void runSearch(searchMode)
    }
  }, [runSearch, searchMode])

  const lastSyncedText = diagnostics?.syncedAt
    ? new Date(diagnostics.syncedAt).toLocaleString('zh-CN')
    : '尚未同步'

  const sortedHits = useMemo(
    () => [...hits].sort((a, b) => b.score - a.score),
    [hits]
  )

  const formatScore = (score: number): string => {
    return score.toFixed(1)
  }

  const scoreColor = (score: number): string => {
    if (score >= 20) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 10) return 'text-amber-600 dark:text-amber-400'
    return 'text-slate-400 dark:text-slate-500'
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--ds-main)]">
      {/* Header */}
      <div className="ds-no-drag shrink-0 border-b border-ds-border bg-ds-card px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--ds-ink)]">
              <Database className="h-4 w-4 text-[var(--ds-accent)]" strokeWidth={1.8} />
              <span>知识库</span>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-1 flex h-6 w-6 items-center justify-center rounded-[5px] text-[var(--ds-muted)] transition hover:bg-[var(--ds-hover)] hover:text-[var(--ds-ink)]"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              )}
            </div>
            <div className="mt-0.5 text-[11.5px] text-[var(--ds-muted)]">
              {diagnostics
                ? `${diagnostics.documentCount} 个文件 · ${diagnostics.chunkCount} 个片段 · ${lastSyncedText}`
                : '正在读取知识库状态…'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[7px] border border-ds-border bg-ds-card px-2.5 text-[12px] font-medium text-[var(--ds-ink)] transition hover:bg-ds-hover disabled:opacity-50"
            title="同步知识库文件"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} strokeWidth={1.75} />
            <span className="hidden sm:inline">{syncing ? '同步中' : '同步'}</span>
          </button>
        </div>
      </div>

      {/* View mode tabs */}
      <div className="ds-no-drag shrink-0 border-b border-ds-border px-4 pt-2 pb-2">
        <div className="flex gap-1 rounded-[8px] bg-[var(--ds-sidebar-field-bg)] p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('search')}
            className={`flex h-7 flex-1 items-center justify-center gap-1.5 rounded-[6px] text-[11.5px] font-medium transition ${
              viewMode === 'search'
                ? 'bg-ds-card text-[var(--ds-ink)] shadow-sm'
                : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)]'
            }`}
          >
            <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>检索</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('browse')}
            className={`flex h-7 flex-1 items-center justify-center gap-1.5 rounded-[6px] text-[11.5px] font-medium transition ${
              viewMode === 'browse'
                ? 'bg-ds-card text-[var(--ds-ink)] shadow-sm'
                : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)]'
            }`}
          >
            <FolderOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>文件浏览</span>
          </button>
        </div>
      </div>

      {viewMode === 'search' ? (
        <>
      {/* Search bar */}
      <div className="ds-no-drag shrink-0 border-b border-ds-border px-4 py-3">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ds-muted)]" strokeWidth={1.75} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入法规、合同条款、案由或关键词…"
              className="h-8 w-full rounded-[7px] border border-ds-border bg-[var(--ds-sidebar-field-bg)] pl-8 pr-2.5 text-[12.5px] text-[var(--ds-ink)] outline-none transition placeholder:text-[var(--ds-muted)] focus:border-[var(--ds-accent)]"
            />
          </div>
          <button
            type="button"
            onClick={() => void runSearch('search')}
            disabled={loading || !query.trim()}
            className={`inline-flex h-8 items-center gap-1.5 rounded-[7px] px-3 text-[12px] font-medium transition disabled:opacity-45 ${
              searchMode === 'search' && hasSearched
                ? 'bg-[var(--ds-accent)] text-white hover:brightness-105'
                : 'border border-ds-border bg-ds-card text-[var(--ds-ink)] hover:bg-ds-hover'
            }`}
          >
            {loading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
            ) : (
              <Search className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
            <span>检索</span>
          </button>
          <button
            type="button"
            onClick={() => void runSearch('agent')}
            disabled={loading || !query.trim()}
            className={`inline-flex h-8 items-center gap-1.5 rounded-[7px] px-2.5 text-[12px] font-medium transition disabled:opacity-45 ${
              searchMode === 'agent' && hasSearched
                ? 'bg-[var(--ds-accent)] text-white hover:brightness-105'
                : 'border border-ds-border bg-ds-card text-[var(--ds-ink)] hover:bg-ds-hover'
            }`}
            title="按 agent 自动取材格式返回来源片段"
          >
            <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Agent</span>
          </button>
        </div>

        {/* Advanced info / sync result */}
        {error ? (
          <div className="mt-2 flex items-start gap-2 rounded-[6px] bg-red-50 p-2.5 text-[11.5px] text-red-600 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>{error}</span>
          </div>
        ) : null}
        {syncResult ? (
          <div className="mt-2 rounded-[6px] bg-emerald-50 p-2.5 text-[11.5px] text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              <span>同步完成</span>
            </div>
            <div className="mt-0.5 text-emerald-600 dark:text-emerald-500">
              共 {syncResult.documentCount} 个文件，{syncResult.chunkCount} 个片段
              {syncResult.skippedCount > 0 ? `（跳过 ${syncResult.skippedCount} 个文件）` : ''}
            </div>
          </div>
        ) : null}

        {/* Search meta */}
        {hasSearched && !loading && hits.length > 0 ? (
          <div className="mt-2 flex items-center gap-3 text-[11px] text-[var(--ds-muted)]">
            <span>
              找到 <strong className="text-[var(--ds-ink)]">{hits.length}</strong> 个匹配片段
            </span>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-0.5 text-[var(--ds-muted)] hover:text-[var(--ds-ink)]"
            >
              {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>详细</span>
            </button>
          </div>
        ) : null}

        {hasSearched && !loading && hits.length === 0 ? (
          <div className="mt-2 text-[11.5px] text-[var(--ds-muted)]">
            未找到匹配结果，请尝试其他关键词或先同步知识库。
          </div>
        ) : null}
      </div>

      {/* Results area */}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(200px,40%)_1fr]">
        {/* Left: result list */}
        <div className="min-h-0 overflow-y-auto border-r border-ds-border">
          {!hasSearched && hits.length === 0 ? (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center px-6 text-center text-[12.5px] text-[var(--ds-muted)]">
              <Database className="mb-3 h-8 w-8 text-[var(--ds-muted)]" strokeWidth={1.4} />
              <span className="max-w-[200px]">输入关键词检索知识库文件，或先同步本地法规与材料。</span>
            </div>
          ) : loading ? (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-3 px-6">
              <RefreshCw className="h-6 w-6 animate-spin text-[var(--ds-accent)]" strokeWidth={1.5} />
              <span className="text-[12.5px] text-[var(--ds-muted)]">正在检索…</span>
            </div>
          ) : hits.length === 0 ? (
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center px-6 text-center text-[12.5px] text-[var(--ds-muted)]">
              <Search className="mb-3 h-7 w-7" strokeWidth={1.4} />
              <span>未找到匹配结果</span>
            </div>
          ) : (
            <div className="divide-y divide-ds-border">
              {sortedHits.map((hit) => (
                <button
                  key={hit.chunkId}
                  type="button"
                  onClick={() => setSelectedChunkId(hit.chunkId)}
                  className={`w-full px-3 py-2.5 text-left transition ${
                    selectedHit?.chunkId === hit.chunkId
                      ? 'bg-[color-mix(in_srgb,var(--ds-accent)_8%,transparent)]'
                      : 'hover:bg-ds-hover'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ds-accent)]" strokeWidth={1.7} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[12.5px] font-medium text-[var(--ds-ink)]">
                          {highlightTerms(hit.title, searchTerms)}
                        </span>
                        <span className={`ml-auto shrink-0 text-[10px] font-semibold ${scoreColor(hit.score)}`}>
                          {formatScore(hit.score)}
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[10.5px] text-[var(--ds-muted)]">
                        {hit.relativePath}
                      </div>
                      <div className="mt-1.5 line-clamp-2 text-[11.5px] leading-5 text-[var(--ds-muted)]">
                        {highlightTerms(hit.snippet, searchTerms)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: detail panel */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          {selectedHit ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Detail header */}
              <div className="ds-no-drag shrink-0 border-b border-ds-border px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--ds-ink)]">
                      {highlightTerms(selectedHit.title, searchTerms)}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--ds-muted)]">
                      <span className="truncate">{selectedHit.relativePath}</span>
                      <span className={`shrink-0 font-medium ${scoreColor(selectedHit.score)}`}>
                        匹配度 {formatScore(selectedHit.score)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCopyContent(
                      selectedHit.content ?? selectedHit.snippet,
                      selectedHit.chunkId
                    )}
                    className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-[6px] border px-2 text-[11px] font-medium transition ${
                      copiedId === selectedHit.chunkId
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                        : 'border-ds-border bg-ds-card text-[var(--ds-muted)] hover:bg-ds-hover hover:text-[var(--ds-ink)]'
                    }`}
                  >
                    {copiedId === selectedHit.chunkId ? (
                      <>
                        <Check className="h-3 w-3" strokeWidth={2} />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-3 w-3" strokeWidth={1.75} />
                        <span>复制</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Detail content */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                <div className="rounded-[8px] border border-ds-border bg-ds-card">
                  {/* Agent mode header */}
                  {searchMode === 'agent' ? (
                    <div className="flex items-center gap-2 border-b border-ds-border px-3 py-2 text-[11px] font-medium text-[var(--ds-accent)]">
                      <Bot className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <span>Agent 来源</span>
                    </div>
                  ) : null}
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words p-3 text-[12.5px] leading-6 text-[var(--ds-ink)]">
                    {highlightTerms(
                      selectedHit.content ?? selectedHit.snippet,
                      searchTerms
                    )}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center px-6 text-center text-[12.5px] text-[var(--ds-muted)]">
              {hasSearched ? '选择左侧来源后查看片段内容' : '检索后将在此显示内容详情'}
            </div>
          )}
        </div>
      </div>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <KnowledgeFileBrowser />
        </div>
      )}
    </div>
  )
}
