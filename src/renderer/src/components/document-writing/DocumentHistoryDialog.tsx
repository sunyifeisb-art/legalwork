import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, FileText, Loader2, Search, Trash2, X, Eye, ArrowLeft, AlertCircle } from 'lucide-react'
import type { DocumentHistorySummary, DocumentHistoryRecord } from '../../../../shared/document-history'

type Props = {
  open: boolean
  onClose: () => void
  onRestore?: (record: DocumentHistoryRecord) => void
}

export function DocumentHistoryDialog({ open, onClose, onRestore }: Props): ReactElement {
  const { t } = useTranslation('common')
  const [summaries, setSummaries] = useState<DocumentHistorySummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [fullRecord, setFullRecord] = useState<DocumentHistoryRecord | null>(null)
  const [loadingRecord, setLoadingRecord] = useState(false)

  const loadList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await window.dsGui.listDocumentHistory()
      setSummaries(list)
    } catch {
      setError('加载历史记录失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setSelectedId(null)
      setFullRecord(null)
      setSearchQuery('')
      void loadList()
    }
  }, [open, loadList])

  const loadRecord = useCallback(async (id: string) => {
    setSelectedId(id)
    setLoadingRecord(true)
    setError(null)
    try {
      const record = await window.dsGui.getDocumentHistoryRecord(id)
      setFullRecord(record)
    } catch {
      setError('加载记录详情失败')
    } finally {
      setLoadingRecord(false)
    }
  }, [])

  const handleDelete = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await window.dsGui.deleteDocumentHistoryRecord(id)
      setSummaries((prev) => prev.filter((s) => s.id !== id))
      if (selectedId === id) {
        setSelectedId(null)
        setFullRecord(null)
      }
    } catch {
      setError('删除失败')
    }
  }, [selectedId])

  const handleClearAll = useCallback(async () => {
    if (!window.confirm('确定删除所有历史记录？此操作不可恢复。')) return
    try {
      await window.dsGui.clearDocumentHistory()
      setSummaries([])
      setSelectedId(null)
      setFullRecord(null)
    } catch {
      setError('清空失败')
    }
  }, [])

  const filtered = searchQuery
    ? summaries.filter((s) =>
        s.templateName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : summaries

  const catLabel = (cat: string): string => {
    switch (cat) {
      case 'litigation': return '诉讼'
      case 'non-litigation': return '非诉'
      case 'custom': return '自定义'
      default: return cat
    }
  }

  if (!open) return <></>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="mx-4 flex h-[80vh] w-full max-w-3xl flex-col rounded-[12px] bg-[var(--ds-sidebar-field-bg)] shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--ds-sidebar-divider)] px-5 py-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--ds-accent)]" strokeWidth={1.75} />
            <h2 className="text-[15px] font-semibold text-[var(--ds-ink)]">生成历史</h2>
            {!loading && <span className="text-[12px] text-[var(--ds-faint)]">({summaries.length}条)</span>}
          </div>
          <div className="flex items-center gap-2">
            {summaries.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-[6px] px-2.5 py-1 text-[12px] text-[var(--ds-faint)] transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                清空全部
              </button>
            )}
            <button type="button" onClick={onClose} className="rounded-[6px] p-1 text-[var(--ds-faint)] hover:text-[var(--ds-ink)]">
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="shrink-0 px-5 py-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索模板名称..."
              className="w-full rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[var(--ds-sidebar-field-bg)] px-3 py-1.5 pl-9 text-[13px] text-[var(--ds-ink)] placeholder-[var(--ds-faint)] outline-none transition focus:border-[var(--ds-accent)]"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ds-faint)]" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mb-2 flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* List */}
          <div className={`flex flex-col overflow-hidden ${fullRecord ? 'w-1/2 border-r border-[var(--ds-sidebar-divider)]' : 'flex-1'}`}>
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--ds-faint)]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center p-6">
                <FileText className="h-8 w-8 text-[var(--ds-faint)]" strokeWidth={1.5} />
                <p className="text-[13px] text-[var(--ds-faint)]">
                  {searchQuery ? '没有匹配的记录' : '还没有文书生成记录'}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-4 py-2">
                <div className="space-y-1">
                  {filtered.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => loadRecord(s.id)}
                      className={`group relative flex w-full items-start gap-3 rounded-[8px] px-3 py-2.5 text-left transition ${
                        selectedId === s.id
                          ? 'bg-[var(--ds-sidebar-field-focus)] shadow-[inset_0_0_0_1px_var(--ds-sidebar-row-ring)]'
                          : 'hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)]'
                      }`}
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ds-accent)]" strokeWidth={1.75} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-[var(--ds-ink)]">{s.templateName}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--ds-faint)]">
                          <span>{catLabel(s.templateCategory)}</span>
                          {s.materialCount > 0 && <span>{s.materialCount}份材料</span>}
                          {s.hasInstructions && <span>有说明</span>}
                          <span className="ml-auto">{formatTime(s.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(s.id, e)}
                        className="absolute right-1.5 top-2 rounded-[4px] p-0.5 text-[var(--ds-faint)] opacity-0 hover:text-red-500 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detail */}
          {fullRecord && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center gap-2 border-b border-[var(--ds-sidebar-divider)] px-4 py-2">
                <button
                  type="button"
                  onClick={() => { setSelectedId(null); setFullRecord(null) }}
                  className="rounded-[4px] p-0.5 text-[var(--ds-faint)] hover:text-[var(--ds-ink)]"
                >
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <span className="text-[13px] font-medium text-[var(--ds-ink)]">{fullRecord.templateName}</span>
                <span className="text-[11px] text-[var(--ds-faint)]">{formatTime(fullRecord.createdAt)}</span>
                {onRestore && (
                  <button
                    type="button"
                    onClick={() => onRestore(fullRecord)}
                    className="ml-auto flex items-center gap-1 rounded-[6px] bg-[var(--ds-accent)] px-3 py-1 text-[12px] font-medium text-white transition hover:brightness-110"
                  >
                    <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>查看</span>
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <pre className="whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--ds-ink)]">
                  {fullRecord.generatedContent}
                </pre>
              </div>
            </div>
          )}
        </div>

        {loadingRecord && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--ds-accent)]" />
          </div>
        )}
      </div>
    </div>
  )
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hour}:${min}`
  } catch {
    return iso.slice(0, 16)
  }
}
