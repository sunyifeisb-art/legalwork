import type { ChangeEvent, ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Upload, X, Sparkles, AlertCircle } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  onSaveLearnedTemplate?: (template: {
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
  }) => Promise<void>
}

const ALLOWED_EXTENSIONS = ['.docx', '.pdf', '.txt', '.md']

function getFileExt(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot).toLowerCase() : ''
}

export function DocumentTemplateUploader({
  open,
  onClose,
  onUpload,
  onSaveLearnedTemplate
}: Props): ReactElement {
  const { t } = useTranslation('common')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  // AI learning state
  const [learning, setLearning] = useState(false)
  const [learnedResult, setLearnedResult] = useState<{
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
  } | null>(null)
  const [templateName, setTemplateName] = useState('')

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedFile(null)
      setError(null)
      setLearning(false)
      setLearnedResult(null)
      setTemplateName('')
      setUploading(false)
    }
  }, [open])

  // AbortController for AI learning
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const validateFile = useCallback((file: File): string | null => {
    const ext = getFileExt(file.name)
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return t('documentWritingUploadInvalidType')
    }
    if (file.size > 10 * 1024 * 1024) {
      return t('documentWritingUploadTooLarge')
    }
    return null
  }, [t])

  const startAiLearning = useCallback(async (file: File, signal?: AbortSignal) => {
    setLearning(true)
    setError(null)
    try {
      const text = await file.text()
      if (signal?.aborted) return

      // Use a local variable for the name to avoid stale closure
      const nameFromFile = file.name.replace(/\.[^/.]+$/, '')
      setTemplateName(nameFromFile)

      const result = await window.dsGui.learnTemplateFromFile({
        fileContent: text,
        fileName: file.name
      })

      if (signal?.aborted) return

      if (result.ok) {
        setLearnedResult({
          name: result.name,
          description: result.description,
          content: result.content,
          fields: result.fields
        })
        setTemplateName(result.name)
      } else {
        setError(result.message)
      }
    } catch (err) {
      if (signal?.aborted) return
      setError(err instanceof Error ? err.message : 'AI 学习失败，请重试')
    } finally {
      if (!signal?.aborted) {
        setLearning(false)
      }
    }
  }, [])

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Cancel previous learning
      abortRef.current?.abort()
      const abort = new AbortController()
      abortRef.current = abort

      const err = validateFile(file)
      if (err) {
        setError(err)
        setSelectedFile(null)
        return
      }
      setError(null)
      setSelectedFile(file)
      setLearnedResult(null)
      setLearning(false)

      // Start AI learning
      void startAiLearning(file, abort.signal)
    },
    [validateFile, startAiLearning]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileSelect(file)
    },
    [handleFileSelect]
  )

  const handleUploadRaw = useCallback(async () => {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    try {
      await onUpload(selectedFile)
      setSelectedFile(null)
      setLearnedResult(null)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('documentWritingUploadError'))
    } finally {
      setUploading(false)
    }
  }, [selectedFile, onUpload, onClose, t])

  const handleSaveTemplate = useCallback(async () => {
    if (!learnedResult) return
    setUploading(true)
    setError(null)
    try {
      await onSaveLearnedTemplate?.({
        ...learnedResult,
        name: templateName || learnedResult.name
      })
      setSelectedFile(null)
      setLearnedResult(null)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存模板失败')
    } finally {
      setUploading(false)
    }
  }, [learnedResult, templateName, onSaveLearnedTemplate, onClose])

  if (!open) return <></>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="mx-4 flex max-h-[85vh] w-full max-w-lg flex-col rounded-[12px] bg-[var(--ds-sidebar-field-bg)] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[var(--ds-ink)]">
            {t('documentWritingUploadTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] p-1 text-[var(--ds-faint)] transition hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] hover:text-[var(--ds-ink)]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Dropzone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mb-4 flex cursor-pointer flex-col items-center gap-2 rounded-[8px] border-2 border-dashed p-8 transition ${
              dragging
                ? 'border-[var(--ds-accent)] bg-[var(--ds-accent)]/5'
                : 'border-[var(--ds-sidebar-row-ring)] hover:border-[var(--ds-accent)]/50'
            }`}
            onClick={() => !learning && fileInputRef.current?.click()}
          >
            {learning ? (
              <Loader2 className="h-8 w-8 animate-spin text-[var(--ds-accent)]" strokeWidth={1.5} />
            ) : (
              <Upload
                className={`h-8 w-8 ${dragging ? 'text-[var(--ds-accent)]' : 'text-[var(--ds-faint)]'}`}
                strokeWidth={1.5}
              />
            )}
            <p className="text-[13px] text-[var(--ds-ink)]">
              {learning ? 'AI 正在分析文档结构...' : t('documentWritingUploadDragHint')}
            </p>
            <p className="text-[12px] text-[var(--ds-faint)]">
              {learning ? '请稍候，正在提取模板信息' : t('documentWritingUploadFormats')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_EXTENSIONS.join(',')}
              onChange={handleInputChange}
              className="hidden"
              disabled={learning}
            />
          </div>

          {/* AI Learning result */}
          {learnedResult && !learning && (
            <div className="mb-4 space-y-3 rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] p-4">
              {/* Editable name */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[var(--ds-faint)]">
                  {t('documentWritingUploadName')}
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder={t('documentWritingUploadNamePlaceholder')}
                  className="w-full rounded-[6px] border border-[var(--ds-sidebar-row-ring)] bg-[var(--ds-sidebar-field-bg)] px-3 py-1.5 text-[13px] text-[var(--ds-ink)] outline-none transition focus:border-[var(--ds-accent)] focus:ring-1 focus:ring-[var(--ds-accent)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[var(--ds-faint)]">
                  {t('documentWritingUploadDescription')}
                </label>
                <p className="text-[13px] text-[var(--ds-ink)]">
                  {learnedResult.description}
                </p>
              </div>

              {/* Extracted fields */}
              {learnedResult.fields.length > 0 && (
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[var(--ds-faint)]">
                    提取的字段（{learnedResult.fields.length}个）
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {learnedResult.fields.map((field) => (
                      <span
                        key={field.id}
                        className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--ds-accent)]/10 px-2 py-0.5 text-[11px] text-[var(--ds-accent)]"
                      >
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content preview */}
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[var(--ds-faint)]">
                  模板预览
                </label>
                <pre className="max-h-[160px] overflow-y-auto whitespace-pre-wrap rounded-[6px] bg-[var(--ds-sidebar-field-bg)] p-3 text-[12px] leading-relaxed text-[var(--ds-ink)]">
                  {learnedResult.content.slice(0, 800)}
                  {learnedResult.content.length > 800 ? '...' : ''}
                </pre>
              </div>
            </div>
          )}

          {/* Selected file info (when learning or before learning) */}
          {selectedFile && !learnedResult && (
            <div className="mb-4 flex items-center gap-2 rounded-[6px] bg-[var(--ds-sidebar-field-focus)] px-3 py-2">
              {learning ? (
                <Loader2 className="h-4 w-4 animate-spin text-[var(--ds-accent)]" />
              ) : (
                <Upload className="h-4 w-4 text-[var(--ds-faint)]" />
              )}
              <span className="flex-1 truncate text-[13px] text-[var(--ds-ink)]">
                {selectedFile.name}
              </span>
              <span className="text-[11px] text-[var(--ds-faint)]">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
              {!learning && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    setError(null)
                    setLearnedResult(null)
                  }}
                  className="rounded-[4px] p-0.5 text-[var(--ds-faint)] hover:text-[var(--ds-ink)]"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex shrink-0 justify-end gap-2 border-t border-[var(--ds-sidebar-divider)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-[var(--ds-sidebar-row-ring)] bg-[var(--ds-sidebar-field-bg)] px-4 py-2 text-[13px] font-medium text-[var(--ds-ink)] transition hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)]"
          >
            {t('cancel')}
          </button>
          {learnedResult && !learning ? (
            <button
              type="button"
              onClick={handleSaveTemplate}
              disabled={!templateName.trim() || uploading}
              className="flex items-center gap-2 rounded-[6px] bg-[var(--ds-accent)] px-4 py-2 text-[13px] font-medium text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <Sparkles className="h-4 w-4" strokeWidth={2} />
              )}
              <span>{uploading ? '保存中...' : '保存为模板'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUploadRaw}
              disabled={!selectedFile || uploading || learning}
              className="flex items-center gap-2 rounded-[6px] bg-[var(--ds-sidebar-field-bg)] px-4 py-2 text-[13px] font-medium text-[var(--ds-ink)] transition hover:bg-[color-mix(in_srgb,var(--ds-sidebar-field-focus)_56%,transparent)] disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <Upload className="h-4 w-4" strokeWidth={2} />
              )}
              <span>{uploading ? t('documentWritingUploading') : '仅上传文件'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
