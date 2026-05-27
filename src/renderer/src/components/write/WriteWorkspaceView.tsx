import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactElement } from 'react'
import {
  BookOpen,
  ChevronDown,
  Columns2,
  Copy,
  Download,
  Eye,
  ExternalLink,
  FileCode2,
  FilePlus2,
  FilePenLine,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  ListTodo,
  MessageSquareQuote,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Save,
  Sparkles,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { WriteExportFormat } from '@shared/write-export'
import { useChatStore } from '../../store/chat-store'
import {
  useWriteWorkspaceStore,
  type WritePreviewMode,
  type WriteSaveStatus,
  writeBasenameFromPath,
  writeJoinPath,
  writeRelativeToWorkspace
} from '../../write/write-workspace-store'
import { getWriteRenderSafety } from '../../write/write-render-safety'
import {
  applyWriteInlineEditReplacement,
  buildWriteInlineEditDraft
} from '../../write/inline-edit'
import { createWriteRecentEdit } from '../../write/recent-edits'
import { WriteMarkdownEditor } from './WriteMarkdownEditor'
import { WriteMarkdownPreview } from './WriteMarkdownPreview'
import { useWriteSplitScrollSync } from './use-write-split-scroll-sync'

type Props = {
  leftSidebarCollapsed: boolean
  onToggleLeftSidebar: () => void
  input: string
  setInput: (value: string) => void
  onSubmitPrompt?: (value: string) => void
}

const WRITE_AUTOSAVE_MS = 900
const WRITE_PREVIEW_DEBOUNCE_MS = 60
const INLINE_AGENT_MIN_WIDTH = 280
const INLINE_AGENT_MAX_WIDTH = 440
const INLINE_AGENT_FALLBACK_HEIGHT = 56
const WRITE_EXPORT_NOTICE_MS = 3_600
const INLINE_EDIT_RECENT_CONTEXT_CHARS = 180
const IMAGE_MIN_ZOOM = 25
const IMAGE_MAX_ZOOM = 300
const IMAGE_ZOOM_STEP = 25
const WRITE_EXPORT_FORMATS: WriteExportFormat[] = ['html', 'pdf', 'doc', 'docx']
const WRITE_RICH_CLIPBOARD_ACTION = 'clipboard'

type WriteNotice = {
  tone: 'success' | 'error'
  message: string
}

function isMarkdownFile(filePath: string): boolean {
  return /\.(md|markdown|mdx)$/i.test(filePath)
}

function formatSaveLabel(status: WriteSaveStatus, t: (key: string) => string): string {
  if (status === 'saving') return t('writeSaving')
  if (status === 'dirty') return t('writeUnsaved')
  if (status === 'error') return t('writeSaveError')
  return t('writeSaved')
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

function clampImageZoom(value: number): number {
  return clamp(Math.round(value), IMAGE_MIN_ZOOM, IMAGE_MAX_ZOOM)
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timeoutId)
  }, [value, delayMs])

  return debounced
}

function inlineAgentPosition(selection: ReturnType<typeof useWriteWorkspaceStore.getState>['selection']): {
  left: number
  top: number
  width: number
  origin: 'top-center' | 'bottom-center'
} | null {
  const rect = selection.anchorRect
  if (!rect) return null
  const width = clamp(Math.round(window.innerWidth * 0.24), INLINE_AGENT_MIN_WIDTH, INLINE_AGENT_MAX_WIDTH)
  const height = INLINE_AGENT_FALLBACK_HEIGHT
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const left = clamp(rect.left + rect.width / 2 - width / 2, 16, viewportWidth - width - 16)
  const bottomTop = rect.bottom + 8
  const topTop = rect.top - height - 8
  const useTop = bottomTop + height > viewportHeight - 16 && topTop >= 16
  const top = clamp(useTop ? topTop : bottomTop, 16, viewportHeight - height - 16)
  return {
    left,
    top,
    width,
    origin: useTop ? 'bottom-center' : 'top-center'
  }
}

function modeButtonClass(active: boolean): string {
  return `inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-[13px] transition ${
    active
      ? 'bg-white text-ds-ink shadow-sm ring-1 ring-ds-border-muted dark:bg-white/10 dark:ring-white/10'
      : 'text-ds-faint hover:bg-white/70 hover:text-ds-ink dark:hover:bg-white/8'
  }`
}

function toolbarIconButtonClass(active = false): string {
  return `inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ds-faint transition ${
    active
      ? 'bg-accent/10 text-accent'
      : 'hover:bg-white/70 hover:text-ds-ink dark:hover:bg-white/8'
  }`
}

function toolbarMenuButtonClass(active = false): string {
  return `inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-[12.5px] font-medium text-ds-faint transition ${
    active
      ? 'bg-accent/10 text-accent'
      : 'hover:bg-white/70 hover:text-ds-ink dark:hover:bg-white/8'
  }`
}

function exportFormatLabel(format: WriteExportFormat, t: (key: string) => string): string {
  if (format === 'html') return t('writeExportHtml')
  if (format === 'pdf') return t('writeExportPdf')
  if (format === 'doc') return t('writeExportDoc')
  return t('writeExportDocx')
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type WriteImagePreviewProps = {
  src: string
  filePath: string
  mimeType: string
  size: number
  workspaceRoot: string
}

type WriteImageFitMode = 'fit' | 'actual'

function WriteImagePreview({
  src,
  filePath,
  mimeType,
  size,
  workspaceRoot
}: WriteImagePreviewProps): ReactElement {
  const { t } = useTranslation('common')
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [fitMode, setFitMode] = useState<WriteImageFitMode>('fit')
  const [zoom, setZoom] = useState(100)
  const fileName = writeBasenameFromPath(filePath)
  const relativePath = writeRelativeToWorkspace(workspaceRoot, filePath)
  const actualMode = fitMode === 'actual'
  useEffect(() => {
    setDimensions(null)
  }, [src, filePath])
  const openImage = (): void => {
    if (typeof window.dsGui?.openEditorPath !== 'function') return
    void window.dsGui.openEditorPath({ path: filePath, workspaceRoot, editorId: 'system' })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[radial-gradient(circle_at_top,rgba(0,136,255,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,250,255,0.68))] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.13),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]">
      <div className="flex min-h-[54px] shrink-0 items-center justify-between gap-3 border-b border-ds-border-muted px-4 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            <ImageIcon className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-ds-ink">{fileName}</div>
            <div className="mt-1 truncate text-[12px] text-ds-faint" title={relativePath}>
              {relativePath}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-ds-border-muted bg-white/48 p-1 dark:bg-white/[0.035]">
          <button
            type="button"
            onClick={() => {
              setFitMode('actual')
              setZoom((value) => clampImageZoom(value - IMAGE_ZOOM_STEP))
            }}
            className={toolbarIconButtonClass()}
            title={t('writeImageZoomOut')}
            aria-label={t('writeImageZoomOut')}
          >
            <ZoomOut className="h-4 w-4" strokeWidth={1.85} />
          </button>
          <input
            type="range"
            min={IMAGE_MIN_ZOOM}
            max={IMAGE_MAX_ZOOM}
            step={IMAGE_ZOOM_STEP}
            value={zoom}
            aria-label={t('writeImageZoom')}
            className="h-8 w-24 accent-[var(--ds-accent)]"
            onChange={(event) => {
              setFitMode('actual')
              setZoom(clampImageZoom(Number(event.target.value)))
            }}
          />
          <button
            type="button"
            onClick={() => {
              setFitMode('actual')
              setZoom((value) => clampImageZoom(value + IMAGE_ZOOM_STEP))
            }}
            className={toolbarIconButtonClass()}
            title={t('writeImageZoomIn')}
            aria-label={t('writeImageZoomIn')}
          >
            <ZoomIn className="h-4 w-4" strokeWidth={1.85} />
          </button>
          <button
            type="button"
            onClick={() => setFitMode((mode) => mode === 'fit' ? 'actual' : 'fit')}
            className={`${toolbarMenuButtonClass(fitMode === 'fit')} min-w-[52px] justify-center`}
            title={fitMode === 'fit' ? t('writeImageActualSize') : t('writeImageFit')}
            aria-label={fitMode === 'fit' ? t('writeImageActualSize') : t('writeImageFit')}
          >
            {fitMode === 'fit' ? t('writeImageFitShort') : `${zoom}%`}
          </button>
        </div>
        <button
          type="button"
          onClick={openImage}
          className={toolbarIconButtonClass()}
          title={t('writeImageOpenExternal')}
          aria-label={t('writeImageOpenExternal')}
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.85} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        <div className="flex min-h-full items-center justify-center">
          <img
            src={src}
            alt={fileName}
            className={`${actualMode ? 'max-w-none' : 'max-h-full max-w-full'} select-none rounded-lg object-contain shadow-[0_18px_50px_rgba(15,23,42,0.16)]`}
            style={actualMode && dimensions ? {
              width: `${Math.round(dimensions.width * zoom / 100)}px`,
              height: 'auto'
            } : undefined}
            onLoad={(event) => {
              const image = event.currentTarget
              setDimensions({ width: image.naturalWidth, height: image.naturalHeight })
            }}
          />
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-ds-border-muted bg-white/44 px-4 py-2 text-[11.5px] text-ds-faint dark:bg-white/[0.035] sm:px-5">
        <span className="rounded-lg bg-ds-hover/70 px-2 py-1 font-mono">{mimeType}</span>
        <span className="rounded-lg bg-ds-hover/70 px-2 py-1 font-mono">{formatBytes(size)}</span>
        {dimensions ? (
          <span className="rounded-lg bg-ds-hover/70 px-2 py-1 font-mono">
            {dimensions.width} x {dimensions.height}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function WriteWorkspaceView({
  leftSidebarCollapsed,
  onToggleLeftSidebar,
  input,
  setInput,
  onSubmitPrompt
}: Props): ReactElement {
  const { t } = useTranslation('common')
  const ensureWriteThreadForWorkspace = useChatStore((s) => s.ensureWriteThreadForWorkspace)
  const runtimeConnection = useChatStore((s) => s.runtimeConnection)
  const {
    workspaceRoot,
    activeFilePath,
    activeFileKind,
    rootDirectory,
    inlineCompletion,
    inlineCompletionApiReady,
    fileContent,
    imageDataUrl,
    imageMimeType,
    fileSize,
    fileTruncated,
    fileError,
    fileLoading,
    saveStatus,
    previewMode,
    assistantOpen,
    selection,
    recentEdits,
    loadWriteSettings,
    addWriteWorkspace,
    setFileContent,
    syncActiveFileFromDisk,
    syncActiveImageFromDisk,
    flushSave,
    createFile,
    refreshWorkspace,
    setFileError,
    setPreviewMode,
    setAssistantOpen,
    setSelection,
    recordRecentEdits,
    quoteCurrentSelection
  } = useWriteWorkspaceStore()
  const saveTimerRef = useRef<number | null>(null)
  const exportMenuRef = useRef<HTMLDivElement | null>(null)
  const modeMenuRef = useRef<HTMLDivElement | null>(null)
  const editorPaneRef = useRef<HTMLDivElement | null>(null)
  const previewPaneRef = useRef<HTMLDivElement | null>(null)
  const exportNoticeTimerRef = useRef<number | null>(null)
  const inlineAgentTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [inlineAgentValue, setInlineAgentValue] = useState('')
  const [inlineAgentOpen, setInlineAgentOpen] = useState(false)
  const [inlineEditInFlight, setInlineEditInFlight] = useState(false)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<WriteExportFormat | typeof WRITE_RICH_CLIPBOARD_ACTION | null>(null)
  const [exportNotice, setExportNotice] = useState<WriteNotice | null>(null)
  const workspaceReady = workspaceRoot.trim().length > 0
  const activeFileIsImage = activeFileKind === 'image'
  const activeFileIsText = activeFileKind === 'text'
  const isMarkdown = activeFilePath && activeFileIsText ? isMarkdownFile(activeFilePath) : true
  const renderSafety = getWriteRenderSafety({
    isMarkdown,
    contentLength: fileContent.length,
    fileSize,
    truncated: fileTruncated
  })
  const debouncedPreviewContent = useDebouncedValue(fileContent, WRITE_PREVIEW_DEBOUNCE_MS)
  const saveLabel = activeFileIsImage
    ? t('writeImagePreview')
    : renderSafety.readOnly ? t('writeReadOnly') : formatSaveLabel(saveStatus, t)
  const selectionAction = selection.charCount > 0 ? inlineAgentPosition(selection) : null
  const selectionActionActive = Boolean(selectionAction)
  const selectionActionLeft = selectionAction?.left
  const selectionActionTop = selectionAction?.top
  const activeFileLabel = activeFilePath
    ? writeRelativeToWorkspace(workspaceRoot, activeFilePath)
    : t('writeNoFileOpen')
  const activeFileName = activeFilePath ? writeBasenameFromPath(activeFilePath) : t('writeStudio')
  const workspacePathLabel = rootDirectory || workspaceRoot
  const workspaceName = workspacePathLabel ? writeBasenameFromPath(workspacePathLabel) : t('writeWorkspace')
  const exportInFlight = exportingFormat !== null
  const fileGuardMessage = renderSafety.notice === 'truncated'
    ? t('writeLargeFileTruncated')
    : renderSafety.notice === 'large-file'
      ? t('writeLargeFileSafeMode')
      : ''
  const fileGuardDetail = renderSafety.notice === 'large-file' ? t('writeLargeFileSafeModeSub') : ''

  useWriteSplitScrollSync({
    enabled: workspaceReady && previewMode === 'split' && activeFileIsText,
    editorRootRef: editorPaneRef,
    previewRef: previewPaneRef,
    rebindKey: activeFilePath ?? 'write-preview'
  })

  const showExportNotice = (notice: WriteNotice): void => {
    setExportNotice(notice)
  }

  const createDraftFile = async (): Promise<void> => {
    if (!workspaceReady) {
      await pickWriteWorkspace()
      return
    }
    const root = rootDirectory || workspaceRoot
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const path = writeJoinPath(root, `draft-${stamp}.md`)
    await createFile(workspaceRoot, path, `# ${t('writeUntitledDraft')}\n\n`)
  }

  const setAssistantPrompt = (prompt: string): void => {
    setAssistantOpen(true)
    setInput(input.trim() ? `${input.trim()}\n\n${prompt}` : prompt)
  }

  const submitInlineAgent = (prompt: string): void => {
    const trimmed = prompt.trim()
    if (!trimmed || !workspaceReady || !activeFilePath) return
    quoteCurrentSelection(workspaceRoot)
    setAssistantOpen(true)
    setInlineAgentValue('')
    setInlineAgentOpen(false)
    if (onSubmitPrompt) {
      onSubmitPrompt(trimmed)
      return
    }
    setInput(input.trim() ? `${input.trim()}\n\n${trimmed}` : trimmed)
  }

  const submitInlineEdit = async (prompt: string): Promise<void> => {
    const trimmed = prompt.trim()
    if (!trimmed || !workspaceReady || !activeFilePath || inlineEditInFlight) return
    if (renderSafety.readOnly) {
      setFileError(t('writeReadOnlySaveDisabled'))
      return
    }
    if (selection.ranges.length !== 1) {
      setFileError(t(selection.ranges.length > 1 ? 'writeInlineEditMultiSelection' : 'writeInlineEditNoSelection'))
      return
    }
    if (typeof window.dsGui?.requestWriteInlineEdit !== 'function') {
      setFileError(t('writeInlineEditUnavailable'))
      return
    }

    const draft = buildWriteInlineEditDraft(fileContent, selection.ranges[0], trimmed, {
      workspaceRoot,
      currentFilePath: activeFilePath,
      model: inlineCompletion.model,
      language: 'markdown',
      recentEdits
    })

    setInlineEditInFlight(true)
    try {
      const result = await window.dsGui.requestWriteInlineEdit(draft.request)
      if (!result.ok) {
        setFileError(t('writeInlineEditFailed', { message: result.message }))
        return
      }

      const latest = useWriteWorkspaceStore.getState()
      if (
        latest.activeFilePath !== activeFilePath ||
        latest.activeFileKind !== 'text' ||
        latest.fileContent.slice(draft.scope.from, draft.scope.to) !== draft.scope.text
      ) {
        setFileError(t('writeInlineEditChanged'))
        return
      }

      const nextContent = applyWriteInlineEditReplacement(latest.fileContent, draft.scope, result.replacement)
      const inlineEditRecord = createWriteRecentEdit({
        source: 'inline-edit',
        filePath: activeFilePath,
        from: draft.scope.from,
        to: draft.scope.to,
        deletedText: draft.scope.text,
        insertedText: result.replacement,
        beforeContext: latest.fileContent.slice(
          Math.max(0, draft.scope.from - INLINE_EDIT_RECENT_CONTEXT_CHARS),
          draft.scope.from
        ),
        afterContext: nextContent.slice(
          draft.scope.from + result.replacement.length,
          Math.min(nextContent.length, draft.scope.from + result.replacement.length + INLINE_EDIT_RECENT_CONTEXT_CHARS)
        ),
        instruction: trimmed,
        scopeKind: draft.scope.kind
      })

      setFileContent(nextContent)
      if (inlineEditRecord) recordRecentEdits([inlineEditRecord])
      setSelection({ text: '', ranges: [], charCount: 0 })
      setInlineAgentValue('')
      setInlineAgentOpen(false)
      setFileError(null)
      showExportNotice({ tone: 'success', message: t('writeInlineEditApplied') })
    } catch (error) {
      setFileError(t('writeInlineEditFailed', {
        message: error instanceof Error ? error.message : String(error)
      }))
    } finally {
      setInlineEditInFlight(false)
    }
  }

  const handleInlineAgentKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      if (inlineEditInFlight) return
      setInlineAgentOpen(false)
      setInlineAgentValue('')
      return
    }
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    if (event.metaKey || event.ctrlKey) {
      void submitInlineEdit(inlineAgentValue)
      return
    }
    submitInlineAgent(inlineAgentValue)
  }

  const pickWriteWorkspace = async (): Promise<void> => {
    if (typeof window.dsGui?.pickWorkspaceDirectory !== 'function') return
    const picked = await window.dsGui.pickWorkspaceDirectory(workspaceRoot || undefined)
    if (!picked.canceled && picked.path) {
      await addWriteWorkspace(picked.path)
      if (runtimeConnection === 'ready') void ensureWriteThreadForWorkspace(picked.path)
    }
  }

  const exportCurrentFile = async (format: WriteExportFormat): Promise<void> => {
    if (!activeFilePath) return
    if (!activeFileIsText) return
    if (typeof window.dsGui?.exportWriteDocument !== 'function') {
      showExportNotice({ tone: 'error', message: t('writeExportUnavailable') })
      return
    }

    setExportMenuOpen(false)
    setExportingFormat(format)
    try {
      const result = await window.dsGui.exportWriteDocument({
        path: activeFilePath,
        workspaceRoot,
        format,
        content: fileContent
      })
      if (!result.ok) {
        if (!result.canceled) {
          showExportNotice({
            tone: 'error',
            message: t('writeExportFailed', {
              format: exportFormatLabel(format, t),
              message: result.message
            })
          })
        }
        return
      }
      showExportNotice({
        tone: 'success',
        message: t('writeExportSuccess', { format: exportFormatLabel(format, t) })
      })
    } catch (error) {
      showExportNotice({
        tone: 'error',
        message: t('writeExportFailed', {
          format: exportFormatLabel(format, t),
          message: error instanceof Error ? error.message : String(error)
        })
      })
    } finally {
      setExportingFormat(null)
    }
  }

  const copyCurrentFileAsRichText = async (): Promise<void> => {
    if (!activeFilePath) return
    if (!activeFileIsText) return
    if (typeof window.dsGui?.copyWriteDocumentAsRichText !== 'function') {
      showExportNotice({ tone: 'error', message: t('writeCopyRichTextUnavailable') })
      return
    }

    setExportMenuOpen(false)
    setExportingFormat(WRITE_RICH_CLIPBOARD_ACTION)
    try {
      const result = await window.dsGui.copyWriteDocumentAsRichText({
        path: activeFilePath,
        workspaceRoot,
        content: fileContent
      })
      if (!result.ok) {
        showExportNotice({
          tone: 'error',
          message: t('writeCopyRichTextFailed', {
            message: result.message
          })
        })
        return
      }
      showExportNotice({
        tone: 'success',
        message: t('writeCopyRichTextSuccess')
      })
    } catch (error) {
      showExportNotice({
        tone: 'error',
        message: t('writeCopyRichTextFailed', {
          message: error instanceof Error ? error.message : String(error)
        })
      })
    } finally {
      setExportingFormat(null)
    }
  }

  useEffect(() => {
    void loadWriteSettings()
  }, [loadWriteSettings])

  useEffect(() => {
    setExportMenuOpen(false)
  }, [activeFilePath])

  useEffect(() => {
    setModeMenuOpen(false)
  }, [activeFilePath, previewMode])

  useEffect(() => {
    if (!selectionActionActive || !inlineAgentOpen) return
    window.requestAnimationFrame(() => inlineAgentTextareaRef.current?.focus())
  }, [inlineAgentOpen, selectionActionActive, selectionActionLeft, selectionActionTop])

  useEffect(() => {
    setInlineAgentOpen(false)
    setInlineAgentValue('')
  }, [selection.charCount, selection.text])

  useEffect(() => {
    if (!exportMenuOpen && !modeMenuOpen) return

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target
      if (
        exportMenuRef.current &&
        target instanceof Node &&
        !exportMenuRef.current.contains(target)
      ) {
        setExportMenuOpen(false)
      }
      if (
        modeMenuRef.current &&
        target instanceof Node &&
        !modeMenuRef.current.contains(target)
      ) {
        setModeMenuOpen(false)
      }
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      setExportMenuOpen(false)
      setModeMenuOpen(false)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [exportMenuOpen, modeMenuOpen])

  useEffect(() => {
    if (exportNoticeTimerRef.current) {
      window.clearTimeout(exportNoticeTimerRef.current)
      exportNoticeTimerRef.current = null
    }
    if (!exportNotice) return
    exportNoticeTimerRef.current = window.setTimeout(() => {
      exportNoticeTimerRef.current = null
      setExportNotice(null)
    }, WRITE_EXPORT_NOTICE_MS)
    return () => {
      if (exportNoticeTimerRef.current) {
        window.clearTimeout(exportNoticeTimerRef.current)
        exportNoticeTimerRef.current = null
      }
    }
  }, [exportNotice])

  useEffect(() => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    if (saveStatus !== 'dirty' || !workspaceReady || !activeFileIsText || renderSafety.readOnly) return
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null
      void flushSave(workspaceRoot)
    }, WRITE_AUTOSAVE_MS)
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }
    }
  }, [flushSave, saveStatus, workspaceReady, workspaceRoot, fileContent, activeFileIsText, renderSafety.readOnly])

  useEffect(() => () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
    if (exportNoticeTimerRef.current) {
      window.clearTimeout(exportNoticeTimerRef.current)
      exportNoticeTimerRef.current = null
    }
    void useWriteWorkspaceStore.getState().flushSave(workspaceRoot)
  }, [workspaceRoot])

  useEffect(() => {
    if (!activeFilePath || !workspaceRoot.trim() || (!activeFileIsText && !activeFileIsImage)) return
    if (
      typeof window.dsGui?.watchWorkspaceFile !== 'function' ||
      typeof window.dsGui?.unwatchWorkspaceFile !== 'function' ||
      typeof window.dsGui?.onWorkspaceFileChanged !== 'function'
    ) {
      return
    }

    let cancelled = false
    let watchId = ''
    const offChanged = window.dsGui.onWorkspaceFileChanged((payload) => {
      if (!watchId || payload.watchId !== watchId) return
      if (activeFileIsImage) {
        void syncActiveImageFromDisk(workspaceRoot, payload.path)
        return
      }
      if (payload.ok) {
        void syncActiveFileFromDisk(workspaceRoot, {
          path: payload.path,
          content: payload.content,
          size: payload.size,
          truncated: payload.truncated,
          animate: true
        })
        return
      }
      void syncActiveFileFromDisk(workspaceRoot, {
        path: payload.path,
        message: payload.message,
        animate: false
      })
    })

    void window.dsGui.watchWorkspaceFile({ path: activeFilePath, workspaceRoot }).then((result) => {
      if (cancelled) {
        if (result.ok) void window.dsGui.unwatchWorkspaceFile(result.watchId)
        return
      }
      if (result.ok) {
        watchId = result.watchId
      }
    })

    return () => {
      cancelled = true
      offChanged()
      if (watchId) void window.dsGui.unwatchWorkspaceFile(watchId)
    }
  }, [
    activeFilePath,
    activeFileIsImage,
    activeFileIsText,
    workspaceRoot,
    syncActiveFileFromDisk,
    syncActiveImageFromDisk
  ])

  const emptyState = (
    <div className="flex h-full min-h-0 items-center justify-center">
      <div className="max-w-md rounded-[28px] border border-ds-border bg-ds-card/90 px-8 py-8 text-center shadow-[0_22px_56px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <FolderOpen className="h-6 w-6" strokeWidth={1.9} />
        </div>
        <h2 className="mt-5 text-[24px] font-semibold tracking-[-0.04em] text-ds-ink">
          {t('writeEmptyTitle')}
        </h2>
        <p className="mt-3 text-[14.5px] leading-7 text-ds-muted">
          {t('writeEmptySub')}
        </p>
        <button
          type="button"
          onClick={() => void pickWriteWorkspace()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(0,136,255,0.22)] transition hover:brightness-110"
        >
          <FolderOpen className="h-4 w-4" strokeWidth={1.9} />
          {t('selectWorkspace')}
        </button>
      </div>
    </div>
  )

  if (!workspaceReady) return emptyState

  const editorVisible = activeFileIsText && previewMode !== 'preview'
  const previewVisible = activeFileIsText && (previewMode === 'split' || previewMode === 'preview')
  const editorWidth = previewMode === 'split'
    ? 'min-w-0 flex-1 basis-1/2 border-r border-ds-border-muted'
    : 'min-w-0 flex-1'
  const previewWidth = previewMode === 'split'
    ? 'min-w-0 flex-1 basis-1/2'
    : 'min-w-0 flex-1'
  const liveModeActive = previewMode === 'live' && renderSafety.livePreviewEnabled
  const sourceModeActive = previewMode === 'source' || (previewMode === 'live' && !renderSafety.livePreviewEnabled)
  const editorAppearance = sourceModeActive ? 'source' : 'live'

  const modeMenuItems: Array<{ mode: WritePreviewMode; label: string; shortLabel: string; icon: ReactElement; active: boolean }> = [
    {
      mode: 'source',
      label: t('writeModeSource'),
      shortLabel: t('writeModeSource'),
      icon: <FileCode2 className="h-4 w-4" strokeWidth={1.85} />,
      active: sourceModeActive
    },
    {
      mode: 'split',
      label: t('writeModeSplit'),
      shortLabel: t('writeModeSplit'),
      icon: <Columns2 className="h-4 w-4" strokeWidth={1.85} />,
      active: previewMode === 'split'
    },
    {
      mode: 'preview',
      label: t('writeModePreview'),
      shortLabel: t('writeModePreview'),
      icon: <Eye className="h-4 w-4" strokeWidth={1.85} />,
      active: previewMode === 'preview'
    }
  ]

  return (
    <div className="write-workspace-view ds-no-drag flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8">
      <header className="ds-topbar-surface relative z-10 mt-3 flex min-h-[56px] w-full shrink-0 items-stretch overflow-visible rounded-[18px]">
        <div className="write-workspace-toolbar-grid grid w-full min-w-0 items-center gap-2 px-3 py-2 lg:gap-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleLeftSidebar}
              className="ds-sidebar-toggle-button shrink-0"
              aria-label={leftSidebarCollapsed ? t('sidebarExpand') : t('sidebarCollapse')}
              title={leftSidebarCollapsed ? t('sidebarExpand') : t('sidebarCollapse')}
            >
              {leftSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" strokeWidth={1.85} />
              ) : (
                <PanelLeftClose className="h-4 w-4" strokeWidth={1.85} />
              )}
            </button>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FilePenLine className="h-4 w-4" strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1 leading-none">
              <div className="truncate text-[15px] font-semibold tracking-[-0.01em] text-ds-ink">
                {activeFileName}
              </div>
              <div className="mt-1.5 truncate text-[12px] text-ds-faint">
                {activeFileLabel}
              </div>
            </div>
          </div>

          <div
            ref={modeMenuRef}
            className="write-workspace-toolbar-modes relative flex min-w-0 items-center justify-start gap-1 rounded-xl border border-ds-border-muted bg-white/68 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:bg-white/[0.06] dark:shadow-none"
          >
            <button
              type="button"
              onClick={() => setPreviewMode('live')}
              disabled={!activeFileIsText}
              className={`${modeButtonClass(liveModeActive)} gap-1.5 ${!activeFileIsText ? 'cursor-not-allowed opacity-45' : ''}`}
              title={t('writeModeLive')}
              aria-label={t('writeModeLive')}
            >
              <BookOpen className="h-4 w-4" strokeWidth={1.85} />
              <span className="hidden text-[12.5px] font-semibold sm:inline">{t('writeModeLiveShort')}</span>
            </button>
            <button
              type="button"
              onClick={() => setModeMenuOpen((open) => !open)}
              disabled={!activeFileIsText}
              className={`${modeButtonClass(modeMenuOpen || !liveModeActive)} px-2 ${!activeFileIsText ? 'cursor-not-allowed opacity-45' : ''}`}
              title={t('writeModePreview')}
              aria-label={t('writeModePreview')}
              aria-haspopup="menu"
              aria-expanded={modeMenuOpen}
            >
              <ChevronDown
                className={`h-4 w-4 transition ${modeMenuOpen ? 'rotate-180' : ''}`}
                strokeWidth={1.9}
              />
            </button>
            {modeMenuOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full z-30 mt-2 min-w-[188px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#131722]"
              >
                {modeMenuItems.map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    role="menuitem"
                    disabled={!activeFileIsText}
                    onClick={() => {
                      setPreviewMode(item.mode)
                      setModeMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
                      item.active
                        ? 'bg-accent/12 text-accent'
                        : 'text-ds-ink hover:bg-slate-100'
                    } ${!activeFileIsText ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.shortLabel}</span>
                    </span>
                    {item.active ? (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.08em]">
                        ON
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="write-workspace-toolbar-actions flex min-w-0 items-center justify-start gap-1.5">
            <button
              type="button"
              onClick={() => void pickWriteWorkspace()}
              className={toolbarIconButtonClass()}
              title={t('changeWorkspace')}
            >
              <FolderOpen className="h-4 w-4" strokeWidth={1.85} />
            </button>
            <button
              type="button"
              onClick={() => setAssistantOpen(!assistantOpen)}
              className={toolbarIconButtonClass(assistantOpen)}
              title={t('writeToggleAssistant')}
              aria-label={t('writeToggleAssistant')}
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.85} />
            </button>
            <div ref={exportMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setExportMenuOpen((open) => !open)}
                disabled={!activeFilePath || !activeFileIsText || exportInFlight}
                className={`${toolbarMenuButtonClass(exportMenuOpen)} disabled:cursor-not-allowed disabled:opacity-40`}
                title={exportInFlight ? t('writeExporting') : t('writeExport')}
                aria-label={exportInFlight ? t('writeExporting') : t('writeExport')}
                aria-haspopup="menu"
                aria-expanded={exportMenuOpen}
              >
                {exportInFlight ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.85} />
                ) : (
                  <Download className="h-4 w-4" strokeWidth={1.85} />
                )}
                <span className="hidden lg:inline">{t('writeExport')}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={1.9} />
              </button>
              {exportMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-ds-border bg-ds-card/95 p-1.5 shadow-[0_22px_48px_rgba(15,23,42,0.16)] backdrop-blur-xl"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void copyCurrentFileAsRichText()}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] text-ds-ink transition hover:bg-ds-hover/80"
                  >
                    <span>{t('writeCopyRichText')}</span>
                    <Copy className="h-3.5 w-3.5 text-ds-faint" strokeWidth={1.9} />
                  </button>
                  <div className="my-1 h-px bg-ds-border-muted" />
                  {WRITE_EXPORT_FORMATS.map((format) => (
                    <button
                      key={format}
                      type="button"
                      role="menuitem"
                      onClick={() => void exportCurrentFile(format)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] text-ds-ink transition hover:bg-ds-hover/80"
                    >
                      <span>{exportFormatLabel(format, t)}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ds-faint">
                        {format}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
                void flushSave(workspaceRoot)
              }}
              disabled={!activeFilePath || !activeFileIsText || renderSafety.readOnly}
              className={`${toolbarIconButtonClass()} disabled:cursor-not-allowed disabled:opacity-40`}
              title={activeFileIsImage ? t('writeImageSaveDisabled') : renderSafety.readOnly ? t('writeReadOnlySaveDisabled') : t('writeSaveFile')}
              aria-label={activeFileIsImage ? t('writeImageSaveDisabled') : renderSafety.readOnly ? t('writeReadOnlySaveDisabled') : t('writeSaveFile')}
            >
              <Save className="h-4 w-4" strokeWidth={1.85} />
            </button>
            <span className={`ml-1 inline-flex min-w-[64px] justify-center rounded-lg px-2.5 py-1 text-[11.5px] font-semibold ${
              renderSafety.readOnly
                ? 'bg-slate-500/12 text-slate-700 dark:text-slate-300'
                : saveStatus === 'error'
                ? 'bg-red-500/12 text-red-600 dark:text-red-300'
                : saveStatus === 'dirty'
                  ? 'bg-amber-500/12 text-amber-700 dark:text-amber-300'
                  : saveStatus === 'saving'
                    ? 'bg-sky-500/12 text-sky-700 dark:text-sky-300'
                    : 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
            }`}>
              {saveLabel}
            </span>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 gap-3 overflow-hidden pb-3 pt-3">
        <div className="min-w-0 flex-1 overflow-hidden rounded-[28px] border border-ds-border bg-ds-card/88 shadow-[0_20px_56px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          {!activeFilePath ? (
            <div className="write-start-shell relative h-full min-h-[420px] overflow-auto rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(247,250,255,0.62))] px-5 py-5 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] sm:px-8 sm:py-8">
              <div className="write-start-grid mx-auto grid min-h-full w-full max-w-6xl gap-6">
                <section className="write-start-hero min-w-0 py-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold text-accent">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.9} />
                    <span>{t('writeStudio')}</span>
                  </div>
                  <h2 className="write-start-heading mt-5 max-w-[12ch] text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[0] text-ds-ink">
                    {t('writeStartTitle')}
                  </h2>
                  <p className="write-start-copy mt-4 max-w-[56ch] text-[15px] leading-7 text-ds-muted">
                    {t('writeStartSub')}
                  </p>

                  <div className="write-start-primary-actions mt-7 grid gap-3">
                    <button
                      type="button"
                      onClick={() => void createDraftFile()}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-[14px] font-semibold text-white shadow-[0_14px_30px_rgba(0,136,255,0.22)] transition hover:brightness-110"
                    >
                      <FilePlus2 className="h-4 w-4" strokeWidth={1.9} />
                      {t('writeStartNewDraft')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssistantPrompt(t('writeStartAskAiPrompt'))}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-ds-border bg-white/70 px-5 text-[14px] font-semibold text-ds-ink shadow-sm transition hover:bg-white dark:bg-white/[0.055] dark:hover:bg-white/[0.08]"
                    >
                      <ListTodo className="h-4 w-4 text-emerald-600 dark:text-emerald-300" strokeWidth={1.9} />
                      {t('writeStartAskAi')}
                    </button>
                  </div>

                  <div className="write-start-shortcuts mt-7 grid gap-3">
                    <button
                      type="button"
                      onClick={() => void refreshWorkspace(workspaceRoot)}
                      className="group flex min-h-[82px] items-center gap-3 rounded-2xl border border-ds-border-muted bg-white/52 px-4 py-3 text-left transition hover:border-accent/25 hover:bg-white/78 dark:bg-white/[0.035] dark:hover:bg-white/[0.07]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                        <RefreshCw className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold text-ds-ink">
                          {t('writeStartRefresh')}
                        </span>
                        <span className="mt-1 block text-[12.5px] leading-5 text-ds-faint">
                          {t('writeStartRefreshSub')}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void pickWriteWorkspace()}
                      className="group flex min-h-[82px] items-center gap-3 rounded-2xl border border-ds-border-muted bg-white/52 px-4 py-3 text-left transition hover:border-accent/25 hover:bg-white/78 dark:bg-white/[0.035] dark:hover:bg-white/[0.07]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                        <FolderOpen className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold text-ds-ink">
                          {t('writeStartChangeWorkspace')}
                        </span>
                        <span className="mt-1 block truncate text-[12.5px] leading-5 text-ds-faint">
                          {workspaceName}
                        </span>
                      </span>
                    </button>
                  </div>
                </section>

                <aside className="write-start-card min-w-0 rounded-[24px] border border-ds-border-muted bg-white/58 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)] dark:bg-white/[0.04]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-ds-faint">
                        {t('writeStartWorkspaceLabel')}
                      </div>
                      <div className="mt-1 truncate text-[18px] font-semibold text-ds-ink">
                        {workspaceName}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {t('writeStartReadyLabel')}
                    </span>
                  </div>

                  <div className="mt-5 rounded-[20px] border border-ds-border-muted bg-white/76 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)] dark:bg-white/[0.035] dark:shadow-none">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                        <FilePenLine className="h-5 w-5" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-[15px] font-semibold text-ds-ink">
                          {t('writeStartPreviewTitle')}
                        </div>
                        <div className="mt-1 text-[12.5px] leading-5 text-ds-faint">
                          {t('writeStartPreviewSub')}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-3" aria-hidden="true">
                      <div className="h-3 w-2/3 rounded-full bg-slate-900/10 dark:bg-white/10" />
                      <div className="h-2.5 w-full rounded-full bg-slate-900/5 dark:bg-white/10" />
                      <div className="h-2.5 w-11/12 rounded-full bg-slate-900/5 dark:bg-white/10" />
                      <div className="h-2.5 w-4/5 rounded-full bg-slate-900/5 dark:bg-white/10" />
                      <div className="pt-2">
                        <div className="h-2.5 w-1/2 rounded-full bg-accent/15" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-ds-border-muted bg-ds-subtle/45 px-4 py-3">
                    <div className="text-[12px] font-semibold text-ds-faint">
                      {t('writeStartWorkspacePath')}
                    </div>
                    <div className="mt-2 break-all font-mono text-[12px] leading-5 text-ds-muted" title={workspacePathLabel}>
                      {workspacePathLabel}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          ) : fileLoading ? (
            <div className="flex h-full min-h-[320px] items-center justify-center text-[14px] text-ds-muted">
              {t('filePreviewLoading')}
            </div>
          ) : activeFileIsImage ? (
            <WriteImagePreview
              src={imageDataUrl}
              filePath={activeFilePath}
              mimeType={imageMimeType}
              size={fileSize}
              workspaceRoot={workspaceRoot}
            />
          ) : (
            <div className="flex h-full min-h-0 min-w-0 flex-col">
              {renderSafety.notice !== 'none' ? (
                <div className="shrink-0 border-b border-amber-200/80 bg-amber-50/90 px-5 py-3 text-[12.5px] leading-5 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/35 dark:text-amber-100 sm:px-6">
                  <div className="font-semibold">{fileGuardMessage}</div>
                  {fileGuardDetail ? (
                    <div className="mt-1 text-amber-800/90 dark:text-amber-100/90">{fileGuardDetail}</div>
                  ) : null}
                </div>
              ) : null}
              <div className="flex min-h-0 min-w-0 flex-1">
                {editorVisible ? (
                  <div ref={editorPaneRef} className={`${editorWidth} min-h-0 overflow-hidden`}>
                    <WriteMarkdownEditor
                      value={fileContent}
                      workspaceRoot={workspaceRoot}
                      filePath={activeFilePath}
                      appearance={editorAppearance}
                      livePreviewEnabled={renderSafety.livePreviewEnabled}
                      readOnly={renderSafety.readOnly}
                      completionModel={inlineCompletion.model}
                      completionEnabled={inlineCompletion.enabled && inlineCompletionApiReady}
                      completionDebounceMs={inlineCompletion.debounceMs}
                      completionMinAcceptScore={inlineCompletion.minAcceptScore}
                      completionLongEnabled={inlineCompletion.longCompletionEnabled}
                      completionLongDebounceMs={inlineCompletion.longDebounceMs}
                      completionLongMinAcceptScore={inlineCompletion.longMinAcceptScore}
                      onChange={setFileContent}
                      onDocumentEdit={recordRecentEdits}
                      onSelectionChange={setSelection}
                      onSaveShortcut={() => {
                        if (renderSafety.readOnly) return
                        if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)
                        void flushSave(workspaceRoot)
                      }}
                      onImagePasteSaved={() => {
                        setFileError(null)
                        void refreshWorkspace(workspaceRoot)
                      }}
                      onImagePasteError={(message) => setFileError(message)}
                    />
                  </div>
                ) : null}

                {previewVisible ? (
                  <div ref={previewPaneRef} className={`${previewWidth} min-h-0 overflow-y-auto overflow-x-hidden`}>
                    <WriteMarkdownPreview
                      content={debouncedPreviewContent}
                      isMarkdown={isMarkdown && renderSafety.markdownPreviewEnabled}
                      filePath={activeFilePath}
                      previewErrorMessage={t('writePreviewErrorFallback')}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

      </div>

      {selectionAction && activeFilePath && activeFileIsText ? (
        <div
          className="write-inline-agent fixed z-50"
          data-origin={selectionAction.origin}
          data-selection-ignore="true"
          style={{ left: selectionAction.left, top: selectionAction.top, width: selectionAction.width }}
        >
          {inlineAgentOpen ? (
            <form
              className="write-inline-agent-form"
              onSubmit={(event) => {
                event.preventDefault()
                submitInlineAgent(inlineAgentValue)
              }}
            >
              <textarea
                ref={inlineAgentTextareaRef}
                rows={1}
                value={inlineAgentValue}
                placeholder={t('writeInlineAgentPlaceholder')}
                aria-label={t('writeInlineAgentPlaceholder')}
                spellCheck={false}
                className="write-inline-agent-input"
                disabled={inlineEditInFlight}
                onChange={(event) => setInlineAgentValue(event.target.value)}
                onKeyDown={handleInlineAgentKeyDown}
              />
              <button
                type="button"
                className="write-inline-agent-secondary"
                aria-label={t('writeInlineAgentSend')}
                title={t('writeInlineAgentSend')}
                disabled={!inlineAgentValue.trim() || inlineEditInFlight}
                onClick={() => submitInlineAgent(inlineAgentValue)}
              >
                <MessageSquareQuote className="h-4 w-4" strokeWidth={1.9} />
              </button>
              <button
                type="button"
                className="write-inline-agent-submit"
                aria-label={inlineEditInFlight ? t('writeInlineEditApplying') : t('writeInlineEditApply')}
                title={inlineEditInFlight ? t('writeInlineEditApplying') : t('writeInlineEditApply')}
                disabled={!inlineAgentValue.trim() || inlineEditInFlight}
                onClick={() => void submitInlineEdit(inlineAgentValue)}
              >
                {inlineEditInFlight ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                ) : (
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="write-inline-agent-trigger"
              aria-label={t('writeInlineEditOpen')}
              title={t('writeInlineEditOpen')}
              onPointerDown={(event) => {
                event.stopPropagation()
                if (event.pointerType !== 'mouse') event.preventDefault()
              }}
              onPointerUp={(event) => {
                if (event.pointerType === 'mouse') return
                event.preventDefault()
                event.stopPropagation()
                setInlineAgentOpen(true)
              }}
              onMouseDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              onClick={() => setInlineAgentOpen(true)}
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.9} />
              <span>{t('writeInlineEditOpen')}</span>
            </button>
          )}
        </div>
      ) : null}

      {fileError ? (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-red-200/70 bg-red-50/92 px-4 py-2 text-[13px] text-red-700 shadow-[0_14px_32px_rgba(15,23,42,0.12)] dark:border-red-900/60 dark:bg-red-950/84 dark:text-red-200">
          {fileError}
        </div>
      ) : null}
      {exportNotice ? (
        <div
          className={`pointer-events-none fixed left-1/2 z-40 -translate-x-1/2 rounded-full border px-4 py-2 text-[13px] shadow-[0_14px_32px_rgba(15,23,42,0.12)] ${
            exportNotice.tone === 'error'
              ? 'border-red-200/70 bg-red-50/92 text-red-700 dark:border-red-900/60 dark:bg-red-950/84 dark:text-red-200'
              : 'border-emerald-200/80 bg-emerald-50/92 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/84 dark:text-emerald-200'
          }`}
          style={{ bottom: fileError ? 68 : 20 }}
        >
          {exportNotice.message}
        </div>
      ) : null}
    </div>
  )
}
