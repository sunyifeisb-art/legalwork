import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import type { ResearchRecord } from './useLegalResearch'

export type LegalResearchSidebarProps = {
  records: ResearchRecord[]
  activeRecordId: string | null
  onSelectRecord: (id: string) => void
  onDeleteRecord: (id: string) => void
  onClearHistory: () => void
  onStopResearch: () => void
}

export function LegalResearchSidebar({
  records,
  activeRecordId,
  onSelectRecord,
  onDeleteRecord,
  onClearHistory,
  onStopResearch
}: LegalResearchSidebarProps): ReactElement {
  const { t } = useTranslation('common')
  return (
    <div className="ds-no-drag flex h-full min-h-0 flex-col">
      <div className="border-b border-[var(--ds-sidebar-divider)] px-4 py-3">
        <h3 className="text-[13px] font-medium text-[var(--ds-ink)]">{t('legalResearchHistory')}</h3>
        <p className="mt-0.5 text-[11px] text-[var(--ds-faint)]">
          {t('legalResearchHistoryCount', { count: records.length })}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {records.length === 0 ? (
          <div className="px-3 py-6 text-center text-[11px] text-[var(--ds-faint)]">
            {t('legalResearchEmptyHistory')}
            <br />
            {t('legalResearchEmptyHistoryHint')}
          </div>
        ) : (
          records.map((record) => (
            <button
              key={record.id}
              type="button"
              onClick={() => onSelectRecord(record.id)}
              className={`group relative w-full rounded-[8px] px-3 py-2 text-left text-[13px] transition-colors ${
                activeRecordId === record.id
                  ? 'bg-[var(--ds-sidebar-row-active)] text-[var(--ds-ink)]'
                  : 'text-[var(--ds-ink)] hover:bg-[var(--ds-sidebar-row-hover)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">
                  {record.status === 'running' ? '⏳' : record.status === 'error' ? '⚠' : '✓'}
                </span>
                <span className="flex-1 truncate">{record.query}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] text-[var(--ds-faint)]">{record.timestamp}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (record.status === 'running') onStopResearch()
                    onDeleteRecord(record.id)
                  }}
                  className="rounded p-1 text-[var(--ds-faint)] opacity-0 transition-opacity hover:bg-[var(--ds-sidebar-row-hover)] hover:text-red-400 group-hover:opacity-100"
                  title={t('legalResearchDeleteRecord')}
                >
                  <Trash2 className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </div>
              {record.error && (
                <div className="mt-1 truncate text-[10px] text-red-400">{record.error}</div>
              )}
            </button>
          ))
        )}
      </div>

      {records.length > 0 && (
        <div className="border-t border-[var(--ds-sidebar-divider)] p-2">
          <button
            type="button"
            onClick={onClearHistory}
            className="w-full rounded-[8px] px-3 py-1.5 text-left text-[11px] text-[var(--ds-faint)] transition-colors hover:bg-[var(--ds-sidebar-row-hover)] hover:text-[var(--ds-ink)]"
          >
            {t('legalResearchClearHistory')}
          </button>
        </div>
      )}
    </div>
  )
}
