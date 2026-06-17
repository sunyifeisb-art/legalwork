import type { ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Database, RefreshCw, Upload } from 'lucide-react'
import {
  builtInTemplates,
  type LegalTemplate,
  type TemplateCategory
} from './legal-templates'
import { DocumentTemplateLibrary } from './DocumentTemplateLibrary'
import { DocumentWritingEditor } from './DocumentWritingEditor'
import { DocumentKnowledgePanel } from './DocumentKnowledgePanel'
import { DocumentTemplateUploader } from './DocumentTemplateUploader'
import type { DocumentHistoryRecord } from '../../../../shared/document-history'
import { DocumentHistoryDialog } from './DocumentHistoryDialog'
import type { UserTemplate } from '../../../../shared/user-templates'

function userTemplateToLegalTemplate(ut: UserTemplate): LegalTemplate {
  return {
    id: ut.id,
    name: ut.name,
    category: ut.category,
    description: ut.description,
    content: ut.content,
    fields: ut.fields.map((f) => ({
      ...f,
      type: f.type as LegalTemplate['fields'][number]['type']
    })),
    legalBasis: ut.legalBasis,
    icon: '📄'
  }
}

const KNOWLEDGE_PANEL_DEFAULT_WIDTH = 460
const KNOWLEDGE_PANEL_MIN_WIDTH = 360
const KNOWLEDGE_PANEL_MAX_WIDTH = 640

export function DocumentWritingView(): ReactElement {
  const { t } = useTranslation('common')

  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'all'>('all')
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploaderOpen, setUploaderOpen] = useState(false)
  const [userTemplates, setUserTemplates] = useState<LegalTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null)
  const [uploadedMaterials, setUploadedMaterials] = useState<
    Array<{ file: File; name: string; content: string; loaded: boolean }>
  >([])
  const [instruction, setInstruction] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [knowledgePanelOpen, setKnowledgePanelOpen] = useState(false)
  const [knowledgePanelWidth, setKnowledgePanelWidth] = useState(KNOWLEDGE_PANEL_DEFAULT_WIDTH)

  // Show user templates only when the custom tab is active
  const showUserTemplates = activeCategory === 'custom'

  // Load user templates from backend on mount
  useEffect(() => {
    loadUserTemplates()
  }, [])

  const loadUserTemplates = useCallback(async () => {
    setLoadingTemplates(true)
    try {
      const stored = await window.dsGui.listUserTemplates()
      setUserTemplates(stored.map(userTemplateToLegalTemplate))
    } catch {
      // Backend not available - just use built-in
    } finally {
      setLoadingTemplates(false)
    }
  }, [])

  // All visible templates based on active category
  const allTemplates = useMemo(() => {
    if (activeCategory === 'custom') {
      return userTemplates
    }
    if (activeCategory === 'all') {
      return [...builtInTemplates, ...userTemplates]
    }
    return builtInTemplates.filter((t) => t.category === activeCategory)
  }, [userTemplates, activeCategory])

  const activeTemplate = useMemo(
    () => allTemplates.find((t) => t.id === activeTemplateId) ?? null,
    [allTemplates, activeTemplateId]
  )

  const resetEditor = useCallback(() => {
    setFieldValues({})
    setGeneratedContent(null)
    setError(null)
    setUploadedMaterials([])
    setInstruction('')
  }, [])

  const handleSelectTemplate = useCallback((tmpl: LegalTemplate) => {
    setActiveTemplateId(tmpl.id)
    resetEditor()
  }, [resetEditor])

  const handleFieldChange = useCallback(
    (fieldId: string, value: string) => {
      if (fieldId === '__reset__') {
        setGeneratedContent(null)
        setError(null)
        return
      }
      setFieldValues((prev) => ({ ...prev, [fieldId]: value }))
    },
    []
  )

  const handleGenerate = useCallback(async () => {
    if (!activeTemplate) return
    setGenerating(true)
    setError(null)

    try {
      const fields = activeTemplate.fields.map((f) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        value: fieldValues[f.id] ?? '',
        required: f.required
      }))

      if (activeTemplate.category === 'custom') {
        const loadedMaterials = uploadedMaterials
          .filter((m) => m.loaded && m.content)
          .map((m) => ({ fileName: m.name, content: m.content }))
        const result = await window.dsGui.generateDocumentFromTemplate({
          template: {
            name: activeTemplate.name,
            description: activeTemplate.description,
            content: activeTemplate.content,
            fields: activeTemplate.fields,
            legalBasis: activeTemplate.legalBasis
          },
          fieldValues,
          materials: loadedMaterials.length > 0 ? loadedMaterials : undefined,
          instructions: instruction.trim() || undefined
        })
        if (result.ok) {
          setGeneratedContent(result.content)
          void saveCurrentToHistory()
        } else {
          setError(result.message)
        }
      } else {
        const result = await window.dsGui.generateDocument({
          templateName: activeTemplate.name,
          templateDescription: activeTemplate.description,
          templateContent: activeTemplate.content,
          fields,
          legalBasis: activeTemplate.legalBasis
        })
        if (result.ok) {
          setGeneratedContent(result.content)
        } else {
          setError(result.message)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试。')
    } finally {
      setGenerating(false)
    }
  }, [activeTemplate, fieldValues, uploadedMaterials, instruction])

  const handleNewDocument = useCallback(() => {
    setActiveTemplateId(null)
    resetEditor()
  }, [resetEditor])

  const handleUpload = useCallback(
    async (file: File) => {
      const text = await file.text()
      const now = new Date().toISOString()
      const newTemplate: UserTemplate = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        description: `用户上传模板：${file.name}`,
        category: 'custom',
        content: text,
        fields: [
          {
            id: 'content',
            label: '文书内容',
            type: 'textarea',
            placeholder: '请输入或编辑文书内容',
            required: true
          }
        ],
        sourceFile: file.name,
        createdAt: now,
        updatedAt: now
      }
      const saveResult = await window.dsGui.saveUserTemplate(newTemplate)
      if (!saveResult.ok) {
        throw new Error(saveResult.message)
      }
      await loadUserTemplates()
    },
    [loadUserTemplates]
  )

  const handleSaveLearnedTemplate = useCallback(
    async (learned: {
      name: string
      description: string
      content: string
      fields: Array<{
        id: string
        label: string
        type: string
        placeholder?: string
        required?: boolean
      }>
    }) => {
      const now = new Date().toISOString()
      const newTemplate: UserTemplate = {
        id: `custom-${Date.now()}`,
        name: learned.name,
        description: learned.description,
        category: 'custom',
        content: learned.content,
        fields: learned.fields.map((f) => ({
          id: f.id,
          label: f.label,
          type: f.type as 'text' | 'textarea' | 'date' | 'select' | 'array',
          placeholder: f.placeholder,
          required: f.required
        })),
        createdAt: now,
        updatedAt: now
      }
      const saveResult = await window.dsGui.saveUserTemplate(newTemplate)
      if (!saveResult.ok) {
        throw new Error(saveResult.message)
      }
      await loadUserTemplates()
    },
    [loadUserTemplates]
  )

  const saveCurrentToHistory = useCallback(async () => {
    if (!activeTemplate || !generatedContent) return
    try {
      await window.dsGui.saveDocumentHistoryRecord({
        id: `hist-${Date.now()}`,
        templateName: activeTemplate.name,
        templateCategory: activeTemplate.category,
        templateSource: activeTemplate.category === 'custom' ? 'custom' : 'builtin',
        fieldValues,
        materialFileNames: uploadedMaterials
          .filter((m) => m.loaded)
          .map((m) => m.name),
        instructions: instruction,
        generatedContent,
        createdAt: new Date().toISOString()
      })
    } catch {
      // Silently save - non-critical
    }
  }, [activeTemplate, generatedContent, fieldValues, uploadedMaterials, instruction])

  const handleDeleteUserTemplate = useCallback(
    async (templateId: string) => {
      setDeletingTemplateId(templateId)
      try {
        await window.dsGui.deleteUserTemplate(templateId)
        await loadUserTemplates()
        if (activeTemplateId === templateId) {
          handleNewDocument()
        }
      } catch {
        // Ignore errors
      } finally {
        setDeletingTemplateId(null)
      }
    },
    [loadUserTemplates, activeTemplateId, handleNewDocument]
  )

  const handleAddMaterial = useCallback(async (file: File) => {
    const id = `${file.name}-${Date.now()}`
    setUploadedMaterials((prev) => [
      ...prev,
      { file, name: file.name, content: '', loaded: false }
    ])
    try {
      const text = await file.text()
      setUploadedMaterials((prev) =>
        prev.map((m) =>
          m.name === file.name && !m.loaded ? { ...m, content: text, loaded: true } : m
        )
      )
    } catch {
      setUploadedMaterials((prev) => prev.filter((m) => m.name !== file.name || m.loaded))
    }
  }, [])

  const handleRemoveMaterial = useCallback((index: number) => {
    setUploadedMaterials((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleCategoryChange = useCallback(
    (category: TemplateCategory | 'all') => {
      setActiveCategory(category)
      // Reset selection when switching categories
      setActiveTemplateId(null)
      resetEditor()
    },
    [resetEditor]
  )

  const handleKnowledgeToggle = useCallback(() => {
    setKnowledgePanelOpen((prev) => !prev)
  }, [])

  const beginKnowledgePanelResize = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (event.button !== 0) return
      event.preventDefault()
      const startX = event.clientX
      const startWidth = knowledgePanelWidth
      const prevCursor = document.body.style.cursor
      const prevUserSelect = document.body.style.userSelect
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      const onMove = (moveEvent: PointerEvent): void => {
        const delta = startX - moveEvent.clientX
        const next = Math.min(
          KNOWLEDGE_PANEL_MAX_WIDTH,
          Math.max(KNOWLEDGE_PANEL_MIN_WIDTH, startWidth + delta)
        )
        setKnowledgePanelWidth(next)
      }

      const onUp = (): void => {
        document.body.style.cursor = prevCursor
        document.body.style.userSelect = prevUserSelect
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [knowledgePanelWidth]
  )

  return (
    <div className="flex h-full min-h-0">
      {/* Left: document writing tools (always template library) */}
      <div className="w-[320px] shrink-0 border-r border-[var(--ds-sidebar-divider)] bg-[var(--ds-sidebar)]">
        <div className="ds-no-drag border-b border-[var(--ds-sidebar-divider)] p-3">
          <div className="grid grid-cols-2 gap-2 rounded-[8px] bg-[var(--ds-sidebar-field-bg)] p-1">
            <button
              type="button"
              className="flex h-8 items-center justify-center gap-1.5 rounded-[7px] bg-ds-card text-[12px] font-medium text-[var(--ds-ink)] shadow-sm transition"
            >
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>模板库</span>
            </button>
            <button
              type="button"
              onClick={handleKnowledgeToggle}
              className={`flex h-8 items-center justify-center gap-1.5 rounded-[7px] text-[12px] font-medium transition ${
                knowledgePanelOpen
                  ? 'bg-ds-card text-[var(--ds-ink)] shadow-sm'
                  : 'text-[var(--ds-muted)] hover:text-[var(--ds-ink)]'
              }`}
            >
              <Database className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>知识库</span>
            </button>
          </div>
        </div>
        <DocumentTemplateLibrary
          templates={allTemplates}
          activeCategory={activeCategory}
          activeTemplateId={activeTemplateId}
          searchQuery={searchQuery}
          showUserTemplates={showUserTemplates}
          onSelectTemplate={handleSelectTemplate}
          onCategoryChange={handleCategoryChange}
          onSearchQueryChange={setSearchQuery}
          onDeleteUserTemplate={handleDeleteUserTemplate}
          deletingTemplateId={deletingTemplateId}
          loadingUserTemplates={loadingTemplates}
        />
        {/* Upload button area */}
        <div className="ds-no-drag shrink-0 border-t border-[var(--ds-sidebar-divider)] px-4 py-3">
          <button
            type="button"
            onClick={() => setUploaderOpen(true)}
            disabled={loadingTemplates}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[var(--ds-sidebar-field-bg)] px-4 py-2 text-[13px] font-medium text-[var(--ds-ink)] transition hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] disabled:opacity-40"
          >
            {loadingTemplates ? (
              <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={1.75} />
            ) : (
              <Upload className="h-4 w-4" strokeWidth={1.75} />
            )}
            <span>
              {loadingTemplates
                ? t('documentWritingLoadingTemplates') || '加载中...'
                : t('documentWritingUploadTemplate')}
            </span>
          </button>
        </div>
      </div>

      {/* Main: Editor always visible */}
      <div className="flex min-h-0 flex-1 flex-col bg-[var(--ds-main)]">
        <DocumentWritingEditor
          template={activeTemplate}
          fieldValues={fieldValues}
          generatedContent={generatedContent}
          generating={generating}
          error={error}
          onFieldChange={handleFieldChange}
          onGenerate={handleGenerate}
          onNewDocument={handleNewDocument}
          uploadedMaterials={uploadedMaterials}
          onAddMaterial={handleAddMaterial}
          onRemoveMaterial={handleRemoveMaterial}
          onUpdateInstruction={setInstruction}
          instruction={instruction}
        />
      </div>

      {/* Right: Knowledge panel */}
      {knowledgePanelOpen ? (
        <>
          <div
            role="separator"
            aria-orientation="vertical"
            className="relative z-20 shrink-0 cursor-col-resize border-l border-[var(--ds-sidebar-divider)]"
            onPointerDown={beginKnowledgePanelResize}
          />
          <div
            className="flex shrink-0 flex-col overflow-hidden bg-[var(--ds-sidebar)]"
            style={{ width: knowledgePanelWidth }}
          >
            <DocumentKnowledgePanel onClose={() => setKnowledgePanelOpen(false)} />
          </div>
        </>
      ) : null}

      {/* Upload dialog */}
      <DocumentTemplateUploader
        open={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onUpload={handleUpload}
        onSaveLearnedTemplate={handleSaveLearnedTemplate}
      />

      {/* History dialog */}
      <DocumentHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestore={(record) => {
          // When user clicks "查看" on a history record, populate the editor
          setGeneratedContent(record.generatedContent)
          setFieldValues(record.fieldValues)
          setUploadedMaterials([])
          setInstruction(record.instructions)
          setHistoryOpen(false)
        }}
      />
    </div>
  )
}
