import type { ReactElement } from 'react'
import { BookOpen, Clock, Database } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AstryxSegmentedControl } from '../astryx/AstryxSegmentedControl'
import { DocumentHistorySidebar } from './DocumentHistorySidebar'
import { DocumentTemplateLibrary } from './DocumentTemplateLibrary'
import { DocumentTemplateUploader } from './DocumentTemplateUploader'
import { useDocumentWriting } from './DocumentWritingContext'

export function DocumentWritingSidebarContent(): ReactElement {
  const { t } = useTranslation('common')
  const documentWriting = useDocumentWriting()

  return (
    <div className="ds-no-drag flex min-h-0 flex-1 flex-col pt-0">
      <div className="flex items-center gap-2 px-1 pb-1">
        <AstryxSegmentedControl
          value={documentWriting.leftTab}
          items={[
            {
              value: 'templates',
              label: t('documentWritingTemplateLibrary'),
              icon: <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
            },
            {
              value: 'history',
              label: t('documentWritingHistory'),
              icon: <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            }
          ]}
          onChange={documentWriting.setLeftTab}
          ariaLabel={`${t('documentWritingTemplateLibrary')} / ${t('documentWritingHistory')}`}
          className="flex min-w-0 flex-1 rounded-[8px] bg-[var(--ds-sidebar-field-bg)] p-1"
          buttonClassName="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-[7px] text-[12px] font-medium"
          indicatorClassName="rounded-[7px] bg-ds-card shadow-sm"
          activeClassName="text-[var(--ds-ink)]"
          inactiveClassName="text-[var(--ds-muted)] hover:text-[var(--ds-ink)]"
        />
        <button
          type="button"
          onClick={documentWriting.handleKnowledgeToggle}
          title={t('knowledgeBase')}
          aria-pressed={documentWriting.knowledgePanelOpen}
          className={`astryx-button flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-[var(--ds-sidebar-row-ring)] text-[12px] font-medium transition ${
            documentWriting.knowledgePanelOpen
              ? 'bg-ds-card text-[var(--ds-ink)] shadow-sm'
              : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)]'
          }`}
        >
          <Database className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {documentWriting.leftTab === 'templates' ? (
          <div className="flex h-full flex-col">
            <DocumentTemplateLibrary
              templates={documentWriting.allTemplates}
              activeCategory={documentWriting.activeCategory}
              activeTemplateId={documentWriting.activeTemplateId}
              searchQuery={documentWriting.searchQuery}
              onSelectTemplate={documentWriting.handleSelectTemplate}
              onCategoryChange={documentWriting.handleCategoryChange}
              onSearchQueryChange={documentWriting.setSearchQuery}
              onUploadTemplate={() => documentWriting.setUploaderOpen(true)}
              onDeleteUserTemplate={(id) => void documentWriting.handleDeleteUserTemplate(id)}
              onRetryUserTemplate={(id) => void documentWriting.handleRetryTemplateLearning(id)}
              deletingTemplateId={documentWriting.deletingTemplateId}
              loadingUserTemplates={documentWriting.loadingTemplates}
            />
          </div>
        ) : (
          <DocumentHistorySidebar
            onRestore={documentWriting.handleRestoreHistory}
            onRefreshSignal={documentWriting.historyRefreshSignal}
          />
        )}
      </div>

      <DocumentTemplateUploader
        open={documentWriting.uploaderOpen}
        onClose={() => documentWriting.setUploaderOpen(false)}
        onUpload={documentWriting.handleUpload}
      />
    </div>
  )
}
