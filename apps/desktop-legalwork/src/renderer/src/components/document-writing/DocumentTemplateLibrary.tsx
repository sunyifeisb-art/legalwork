import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  FileText,
  Scale,
  ScrollText,
  User,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react'
import type { LegalTemplate, TemplateCategory } from './legal-templates'

type Props = {
  templates: LegalTemplate[]
  activeCategory: TemplateCategory | 'all'
  activeTemplateId: string | null
  searchQuery: string
  showUserTemplates: boolean
  onSelectTemplate: (template: LegalTemplate) => void
  onCategoryChange: (category: TemplateCategory | 'all') => void
  onSearchQueryChange: (query: string) => void
  onDeleteUserTemplate?: (templateId: string) => void
  deletingTemplateId?: string | null
  loadingUserTemplates?: boolean
}

const categoryIcons: Record<string, ReactElement> = {
  litigation: <Scale className="h-4 w-4" strokeWidth={1.75} />,
  'non-litigation': <ScrollText className="h-4 w-4" strokeWidth={1.75} />,
  custom: <User className="h-4 w-4" strokeWidth={1.75} />
}

export function DocumentTemplateLibrary({
  templates,
  activeCategory,
  activeTemplateId,
  searchQuery,
  showUserTemplates,
  onSelectTemplate,
  onCategoryChange,
  onSearchQueryChange,
  onDeleteUserTemplate,
  deletingTemplateId,
  loadingUserTemplates
}: Props): ReactElement {
  const { t } = useTranslation('common')

  const filteredTemplates = templates.filter((tmpl) => {
    if (activeCategory !== 'all' && tmpl.category !== activeCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="ds-no-drag shrink-0 px-4 pb-3 pt-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[var(--ds-accent)]" strokeWidth={1.75} />
          <h2 className="text-[15px] font-semibold text-[var(--ds-ink)]">
            {t('documentWritingTemplateLibrary')}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="ds-no-drag shrink-0 px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t('documentWritingSearchPlaceholder')}
            className="w-full rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[var(--ds-sidebar-field-bg)] px-3 py-1.5 pl-9 text-[13px] text-[var(--ds-ink)] placeholder-[var(--ds-faint)] outline-none transition focus:border-[var(--ds-accent)] focus:ring-1 focus:ring-[var(--ds-accent)]"
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
      </div>

      {/* Category tabs */}
      <div className="ds-no-drag shrink-0 px-4 pb-3">
        <div className="flex gap-1 rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[color-mix(in_srgb,var(--ds-sidebar-field-bg)_84%,transparent)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] dark:bg-white/[0.035] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`group inline-flex min-h-[30px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition ${
              activeCategory === 'all'
                ? 'bg-[var(--ds-sidebar-field-focus)] text-[#182230] shadow-[0_1px_3px_rgba(15,23,42,0.07),inset_0_0_0_1px_var(--ds-sidebar-row-ring),inset_0_1px_0_rgba(255,255,255,0.78)] dark:bg-white/[0.09] dark:text-white'
                : 'text-[#5c6675] hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] hover:text-[#1f2733] dark:text-white/58 dark:hover:bg-white/[0.055] dark:hover:text-white/88'
            }`}
          >
            <span>{t('documentWritingAll')}</span>
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange('litigation')}
            className={`group inline-flex min-h-[30px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition ${
              activeCategory === 'litigation'
                ? 'bg-[var(--ds-sidebar-field-focus)] text-[#182230] shadow-[0_1px_3px_rgba(15,23,42,0.07),inset_0_0_0_1px_var(--ds-sidebar-row-ring),inset_0_1px_0_rgba(255,255,255,0.78)] dark:bg-white/[0.09] dark:text-white'
                : 'text-[#5c6675] hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] hover:text-[#1f2733] dark:text-white/58 dark:hover:bg-white/[0.055] dark:hover:text-white/88'
            }`}
          >
            <Scale className="h-3.5 w-3.5" strokeWidth={1.9} />
            <span>{t('documentWritingLitigation')}</span>
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange('non-litigation')}
            className={`group inline-flex min-h-[30px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition ${
              activeCategory === 'non-litigation'
                ? 'bg-[var(--ds-sidebar-field-focus)] text-[#182230] shadow-[0_1px_3px_rgba(15,23,42,0.07),inset_0_0_0_1px_var(--ds-sidebar-row-ring),inset_0_1px_0_rgba(255,255,255,0.78)] dark:bg-white/[0.09] dark:text-white'
                : 'text-[#5c6675] hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] hover:text-[#1f2733] dark:text-white/58 dark:hover:bg-white/[0.055] dark:hover:text-white/88'
            }`}
          >
            <ScrollText className="h-3.5 w-3.5" strokeWidth={1.9} />
            <span>{t('documentWritingNonLitigation')}</span>
          </button>
          <button
            type="button"
            onClick={() => onCategoryChange('custom')}
            className={`group inline-flex min-h-[30px] flex-1 items-center justify-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition ${
              activeCategory === 'custom'
                ? 'bg-[var(--ds-sidebar-field-focus)] text-[#182230] shadow-[0_1px_3px_rgba(15,23,42,0.07),inset_0_0_0_1px_var(--ds-sidebar-row-ring),inset_0_1px_0_rgba(255,255,255,0.78)] dark:bg-white/[0.09] dark:text-white'
                : 'text-[#5c6675] hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] hover:text-[#1f2733] dark:text-white/58 dark:hover:bg-white/[0.055] dark:hover:text-white/88'
            }`}
          >
            <User className="h-3.5 w-3.5" strokeWidth={1.9} />
            <span>{t('documentWritingMyTemplates')}</span>
          </button>
        </div>
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
          <div className="space-y-1">
            {filteredTemplates.map((tmpl) => {
              const isCustom = tmpl.category === 'custom' || '_isCustom' in tmpl
              return (
                <div key={tmpl.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tmpl)}
                    className={`ds-no-drag w-full rounded-[8px] px-3 py-2.5 text-left transition ${
                      activeTemplateId === tmpl.id
                        ? 'bg-[var(--ds-sidebar-field-focus)] shadow-[inset_0_0_0_1px_var(--ds-sidebar-row-ring),inset_0_1px_0_rgba(255,255,255,0.78)] dark:bg-white/[0.09] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]'
                        : 'hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] dark:hover:bg-white/[0.055]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 shrink-0 text-[var(--ds-accent)]">
                        {tmpl.icon ? (
                          <span className="text-base leading-none">{tmpl.icon}</span>
                        ) : (
                          categoryIcons[tmpl.category]
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-[var(--ds-ink)]">
                          {tmpl.name}
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-[12px] leading-[1.4] text-[var(--ds-faint)]">
                          {tmpl.description}
                        </div>
                        {isCustom && (
                          <div className="mt-1 inline-flex items-center gap-1 rounded-[3px] bg-[var(--ds-accent)]/8 px-1.5 py-0.5 text-[10px] text-[var(--ds-accent)]">
                            <User className="h-2.5 w-2.5" strokeWidth={2.5} />
                            自定义
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                  {isCustom && onDeleteUserTemplate && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteUserTemplate(tmpl.id)
                      }}
                      disabled={deletingTemplateId === tmpl.id}
                      className="absolute right-1.5 top-2.5 rounded-[4px] p-1 text-[var(--ds-faint)] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
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
