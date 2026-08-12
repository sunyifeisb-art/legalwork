import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FilePenLine,
  FileText,
  Scale,
  ScrollText,
  User,
  Trash2,
  Loader2,
  RefreshCw,
  Upload
} from 'lucide-react'
import type { LegalTemplate, TemplateCategory } from './legal-templates'
import { AstryxSegmentedControl } from '../astryx/AstryxSegmentedControl'

type Props = {
  templates: LegalTemplate[]
  activeCategory: TemplateCategory | 'all'
  activeTemplateId: string | null
  searchQuery: string
  onSelectTemplate: (template: LegalTemplate) => void
  onCategoryChange: (category: TemplateCategory | 'all') => void
  onSearchQueryChange: (query: string) => void
  onUploadTemplate?: () => void
  onDeleteUserTemplate?: (templateId: string) => void
  onRetryUserTemplate?: (templateId: string) => void
  deletingTemplateId?: string | null
  loadingUserTemplates?: boolean
}

const categoryIcons: Record<string, ReactElement> = {
  litigation: <Scale className="h-4 w-4" strokeWidth={1.75} />,
  'non-litigation': <ScrollText className="h-4 w-4" strokeWidth={1.75} />,
  custom: <FilePenLine className="h-4 w-4" strokeWidth={1.75} />
}

export function DocumentTemplateLibrary({
  templates,
  activeCategory,
  activeTemplateId,
  searchQuery,
  onSelectTemplate,
  onCategoryChange,
  onSearchQueryChange,
  onUploadTemplate,
  onDeleteUserTemplate,
  onRetryUserTemplate,
  deletingTemplateId,
  loadingUserTemplates
}: Props): ReactElement {
  const { t } = useTranslation('common')

  const filteredTemplates = templates.filter((tmpl) => {
    if (activeCategory !== 'all' && tmpl.category !== activeCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        tmpl.name.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex h-full flex-col">
      <div className="ds-no-drag shrink-0 px-4 pb-1.5 pt-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="relative min-w-0 flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t('documentWritingSearchPlaceholder')}
            className="h-8 w-full rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[var(--ds-sidebar-field-bg)] px-3 pl-8 text-[12.5px] text-[var(--ds-ink)] placeholder-[var(--ds-faint)] outline-none transition focus:border-[var(--ds-accent)] focus:ring-1 focus:ring-[var(--ds-accent)]"
          />
          <FileText className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ds-faint)]" strokeWidth={1.75} />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[4px] p-0.5 text-[var(--ds-faint)] hover:text-[var(--ds-ink)]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          </div>
          {onUploadTemplate ? (
            <button
              type="button"
              onClick={onUploadTemplate}
              title={t('documentWritingUploadTemplate')}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[var(--ds-sidebar-field-bg)] text-[var(--ds-muted)] transition hover:bg-[var(--ds-sidebar-field-focus)] hover:text-[var(--ds-ink)]"
            >
              <Upload className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Category tabs */}
      <div className="ds-no-drag shrink-0 px-4 pb-1.5">
        <AstryxSegmentedControl
          value={activeCategory}
          items={[
            { value: 'all', label: t('documentWritingAll') },
            {
              value: 'litigation',
              label: t('documentWritingLitigation')
            },
            {
              value: 'non-litigation',
              label: t('documentWritingNonLitigation')
            },
            {
              value: 'custom',
              label: t('documentWritingMyTemplates')
            }
          ]}
          onChange={onCategoryChange}
          ariaLabel={t('documentWritingTemplateLibrary')}
          className="grid grid-cols-4 gap-0.5 rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[color-mix(in_srgb,var(--ds-sidebar-field-bg)_84%,transparent)] p-0.5"
          buttonClassName="group inline-flex h-6 w-full items-center justify-center whitespace-nowrap rounded-[6px] px-1 text-[11px] font-medium"
          indicatorClassName="rounded-[6px] bg-[var(--ds-sidebar-field-focus)] shadow-[inset_0_0_0_1px_var(--ds-sidebar-row-ring)]"
          activeClassName="text-[#182230] dark:text-white"
          inactiveClassName="text-[#5c6675] hover:text-[#1f2733] dark:text-white/58 dark:hover:text-white/88"
        />
      </div>

      {/* Template list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loadingUserTemplates && activeCategory === 'custom' ? (
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--ds-faint)]" />
            <p className="text-[13px] text-[var(--ds-faint)]">加载中...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <FileText className="h-8 w-8 text-[var(--ds-faint)]" strokeWidth={1.5} />
            <p className="text-[13px] text-[var(--ds-faint)]">
              {searchQuery
                ? t('documentWritingNoSearchResults')
                : activeCategory === 'custom'
                ? t('documentWritingMyTemplatesEmpty')
                : t('documentWritingNoTemplates')}
            </p>
          </div>
        ) : (
          <div data-control-hover-root className="grid grid-cols-2 gap-1">
            {filteredTemplates.map((tmpl) => {
              const isCustom = tmpl.category === 'custom' || '_isCustom' in tmpl
              return (
                <div key={tmpl.id} className="group relative min-w-0">
                  <button
                    type="button"
                    data-control-active={activeTemplateId === tmpl.id ? 'true' : undefined}
                    onClick={() => onSelectTemplate(tmpl)}
                    title={tmpl.name}
                    className={`ds-no-drag flex h-8 w-full min-w-0 items-center gap-1.5 rounded-[8px] px-2 text-left transition duration-150 ${
                      activeTemplateId === tmpl.id
                        ? 'bg-[var(--ds-sidebar-row-active)] text-[var(--ds-ink)] shadow-[inset_0_0_0_1px_var(--ds-sidebar-row-ring)]'
                        : 'text-[var(--ds-muted)] hover:bg-[var(--ds-sidebar-row-hover)] hover:text-[var(--ds-ink)]'
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] ${
                      activeTemplateId === tmpl.id
                        ? 'bg-[var(--ds-accent-soft)] text-[var(--ds-accent)]'
                        : 'bg-[var(--ds-sidebar-field-focus)] text-[var(--ds-muted)]'
                    }`}>
                      {categoryIcons[tmpl.category] ?? <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[var(--ds-ink)]">
                      {tmpl.name}
                    </span>
                    {isCustom && tmpl.learningStatus === 'analyzing' ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-[10.5px] text-amber-500">
                        <Loader2 className="h-2.5 w-2.5 animate-spin" strokeWidth={2.2} />
                        分析中
                      </span>
                    ) : null}
                    {isCustom && tmpl.learningStatus === 'failed' ? (
                      <span className="shrink-0 text-[10.5px] text-red-400" title={tmpl.learningError || 'AI 分析失败，可重试'}>
                        失败
                      </span>
                    ) : null}
                  </button>
                  {isCustom && tmpl.learningStatus === 'failed' && onRetryUserTemplate && (
                    <button
                      type="button"
                      data-control-hover-preserve
                      onClick={(event) => {
                        event.stopPropagation()
                        onRetryUserTemplate(tmpl.id)
                      }}
                      className="absolute right-9 top-1/2 -translate-y-1/2 rounded-[7px] p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                      title={tmpl.learningError ? `重新分析：${tmpl.learningError}` : '重新分析模板'}
                      aria-label={`重新分析 ${tmpl.name}`}
                    >
                      <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.9} />
                    </button>
                  )}
                  {isCustom && onDeleteUserTemplate && (
                    <button
                      type="button"
                      data-control-hover-preserve
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteUserTemplate(tmpl.id)
                      }}
                      disabled={deletingTemplateId === tmpl.id}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[7px] p-1 text-[var(--ds-faint)] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
                      title={t('documentWritingDeleteTemplate')}
                    >
                      {deletingTemplateId === tmpl.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
