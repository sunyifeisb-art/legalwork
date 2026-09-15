import type { ChangeEvent, DragEvent as ReactDragEvent, ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'
import {
  AlertCircle,
  AudioLines,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  File,
  FileArchive,
  FileCode2,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Folder,
  History,
  Loader2,
  Minimize2,
  RefreshCw,
  ScanEye,
  Sparkles,
  ShieldCheck,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import type {
  DataComplianceRequestResult,
  DataComplianceStatus,
  DataComplianceSubmitPayload
} from '@shared/ds-gui-api'
import { useChatStore } from '../../store/chat-store'
import { formatWorkspacePickerError } from '../../lib/format-workspace-picker-error'
import { AstryxSegmentedControl } from '../astryx/AstryxSegmentedControl'
import { SidebarCommandRow } from '../sidebar/SidebarPrimitives'
import { ThinkingOrbStatus } from '../chat/ThinkingOrbStatus'

export type DataComplianceSection = 'review' | 'desensitize' | 'history' | 'results'
export type DesensitizeSection = 'material' | 'history' | 'results'

type ComplianceTask = {
  id?: string
  task_id?: string
  document_name?: string
  product_type?: string
  status?: string
  created_at?: string
  review_type?: string
}

type ComplianceResult = {
  task_id?: string
  status?: string
  product_type?: string
  document_name?: string
  output_dir?: string
  report?: {
    summary?: unknown
    overview?: string
    items?: Array<Record<string, unknown>>
    findings?: Array<Record<string, unknown>>
    statistics?: Record<string, unknown>
    stats?: Record<string, unknown>
    auto_recheck_stats?: Record<string, unknown>
    risk_clusters?: Array<Record<string, unknown>>
    notes?: unknown
    [key: string]: unknown
  }
  remediation?: unknown
  evidence?: unknown
  sdk_pack?: unknown
  cross_border_pack?: unknown
  privacy_pack?: unknown
  progress?: unknown
  error?: string
}

type SubmitMode = 'review' | 'desensitize'
type DesensitizeKind = 'info' | 'material'
type ReviewType = 'document' | 'code'
type RedactionMode = 'standard' | 'agent_enhanced'
type Notice = { tone: 'info' | 'error' | 'success'; text: string }
type DataComplianceFilePayload = NonNullable<DataComplianceSubmitPayload['file']>

const FALLBACK_API_BASE = ''

const sectionMeta: Record<DataComplianceSection, { title: string; kicker: string }> = {
  review: { title: '合规审查', kicker: '文档、代码与数据处理链路风险识别' },
  desensitize: { title: '数据脱敏', kicker: '敏感数据识别、替换与脱敏报告' },
  history: { title: '历史任务', kicker: '查看已提交的合规审查任务' },
  results: { title: '结果中心', kicker: '按任务编号查询报告和整改包' }
}

function taskIdOf(task: ComplianceTask): string {
  return task.task_id ?? task.id ?? ''
}

function isReviewTask(task: ComplianceTask): boolean {
  const productType = (task.product_type ?? '').toLowerCase()
  if (productType) return productType !== 'desensitize'
  return Boolean(task.review_type)
}

function isDesensitizeTask(task: ComplianceTask): boolean {
  const productType = (task.product_type ?? '').toLowerCase()
  if (productType) return productType === 'desensitize'
  return !task.review_type
}

type ComplianceHistoryState = {
  reviewTasks: ComplianceTask[]
  desensitizeTasks: ComplianceTask[]
  reviewBusy: boolean
  desensitizeBusy: boolean
  reviewError: string
  desensitizeError: string
  selectedReviewTaskId: string
  selectedDesensitizeTaskId: string
  refresh: (mode: SubmitMode) => Promise<void>
  select: (mode: SubmitMode, taskId: string) => void
  remove: (mode: SubmitMode, taskId: string) => void
}

const complianceResultCache = new Map<string, ComplianceResult>()

const useComplianceHistoryStore = create<ComplianceHistoryState>((set) => ({
  reviewTasks: [],
  desensitizeTasks: [],
  reviewBusy: false,
  desensitizeBusy: false,
  reviewError: '',
  desensitizeError: '',
  selectedReviewTaskId: '',
  selectedDesensitizeTaskId: '',
  refresh: async (mode) => {
    set(mode === 'desensitize'
      ? { desensitizeBusy: true, desensitizeError: '' }
      : { reviewBusy: true, reviewError: '' })
    try {
      const payload = await requestJson<{ items?: ComplianceTask[] }>('/data-compliance/tasks')
      const items = Array.isArray(payload.items) ? payload.items : []
      set(mode === 'desensitize'
        ? { desensitizeTasks: items.filter(isDesensitizeTask) }
        : { reviewTasks: items.filter(isReviewTask) })
    } catch (error) {
      const message = error instanceof Error ? error.message : '历史读取失败。'
      set(mode === 'desensitize'
        ? { desensitizeError: message }
        : { reviewError: message })
      throw error
    } finally {
      set(mode === 'desensitize'
        ? { desensitizeBusy: false }
        : { reviewBusy: false })
    }
  },
  select: (mode, taskId) => set(mode === 'desensitize'
    ? { selectedDesensitizeTaskId: taskId }
    : { selectedReviewTaskId: taskId }),
  remove: (mode, taskId) => set((state) => mode === 'desensitize'
    ? {
        desensitizeTasks: state.desensitizeTasks.filter((task) => taskIdOf(task) !== taskId),
        selectedDesensitizeTaskId: state.selectedDesensitizeTaskId === taskId
          ? ''
          : state.selectedDesensitizeTaskId
      }
    : {
        reviewTasks: state.reviewTasks.filter((task) => taskIdOf(task) !== taskId),
        selectedReviewTaskId: state.selectedReviewTaskId === taskId
          ? ''
          : state.selectedReviewTaskId
      })
}))

function statusTone(status: string | undefined): string {
  const value = (status ?? '').toLowerCase()
  if (value === 'completed') return 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-200'
  if (value === 'failed' || value === 'error') return 'bg-red-500/12 text-red-700 dark:text-red-200'
  if (value === 'running' || value === 'processing' || value === 'pending') {
    return 'bg-amber-500/14 text-amber-700 dark:text-amber-200'
  }
  return 'bg-ds-subtle text-ds-muted'
}

function labelStatus(status: string | undefined, isDesensitize = false): string {
  const value = (status ?? '').toLowerCase()
  if (value === 'completed') return '已完成'
  if (value === 'failed' || value === 'error') return '失败'
  if (value === 'running' || value === 'processing') return '处理中'
  if (value === 'pending') return isDesensitize ? '待处理' : '审查中'
  return status || '未知'
}

function summarizeResult(result: ComplianceResult | null): string {
  if (!result) return ''
  if (result.error) return result.error
  if (typeof result.report?.summary === 'string') return result.report.summary
  if (typeof result.report?.overview === 'string') return result.report.overview
  const progress = asRecord(result.progress)
  if (progress && typeof progress.message === 'string' && progress.message.trim()) {
    return progress.message
  }
  if (result.status && result.status !== 'completed') return '任务仍在处理，legalwork 会继续刷新结果。'
  return '报告已生成，可在结果明细中查看结构化数据。'
}

function resultItems(result: ComplianceResult | null): Array<Record<string, unknown>> {
  if (!result?.report) return []
  const items = result.report.items ?? result.report.findings ?? []
  return Array.isArray(items) ? items.filter(isRecord) : []
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null
}

function recordArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(stringifyShort).map((item) => item.trim()).filter(Boolean)
}

function firstText(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const text = stringifyShort(record[key]).trim()
    if (text) return text
  }
  return ''
}

function stringifyShort(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value == null) return ''
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function riskToneClass(level: string): string {
  if (level.includes('高')) return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200'
  if (level.includes('中')) return 'border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-200'
  if (level.includes('低') || level.includes('建议')) {
    return 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-200'
  }
  return 'border-ds-border bg-ds-subtle text-ds-muted'
}

function parseJsonBody<T>(body: string): T {
  return JSON.parse(body) as T
}

function errorFromBody(body: string, fallback: string): Error {
  try {
    const payload = JSON.parse(body) as { error?: string; message?: string }
    return new Error(payload.error || payload.message || fallback)
  } catch {
    return new Error(body.trim() || fallback)
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunks: string[] = []
  for (let index = 0; index < bytes.length; index += 0x8000) {
    chunks.push(String.fromCharCode(...bytes.subarray(index, index + 0x8000)))
  }
  return btoa(chunks.join(''))
}

function inferOutputFormats(): Array<{ value: 'md' | 'docx' | 'pdf' | 'txt'; label: string }> {
  return [
    { value: 'docx', label: 'Word 文档 (.docx)' },
    { value: 'pdf', label: 'PDF 文档 (.pdf)' },
    { value: 'md', label: 'Markdown (.md)' },
    { value: 'txt', label: '纯文本 (.txt)' }
  ]
}

function fileTypeLabelForFile(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (!ext) return '文件'
  if (ext === 'doc' || ext === 'docx') return 'WORD'
  if (ext === 'ppt' || ext === 'pptx') return 'PPT'
  if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return 'EXCEL'
  if (ext === 'pdf') return 'PDF'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return '音频'
  if (['zip', 'rar', '7z'].includes(ext)) return '压缩包'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext)) return '图片'
  if (['txt', 'md', 'markdown', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'yml', 'html', 'xml'].includes(ext)) return '文本'
  return ext.toUpperCase()
}

function fileTypeBadgeClass(label: string): string {
  const map: Record<string, string> = {
    WORD: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20',
    PPT: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20',
    EXCEL: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20',
    PDF: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20',
    音频: 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/20',
    压缩包: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/20',
    图片: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/20',
    文本: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/20'
  }
  return map[label] || 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/20'
}

function FileTypeIcon({ fileName, className = 'h-5 w-5' }: { fileName: string; className?: string }): ReactElement {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) {
    return <AudioLines className={`${className} text-cyan-500`} strokeWidth={1.7} />
  }
  if (['doc', 'docx', 'pdf', 'txt', 'md', 'markdown'].includes(ext)) {
    return <FileText className={`${className} text-slate-400`} strokeWidth={1.6} />
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FileSpreadsheet className={`${className} text-emerald-500`} strokeWidth={1.6} />
  }
  if (['ppt', 'pptx'].includes(ext)) {
    return <FileCode2 className={`${className} text-amber-500`} strokeWidth={1.6} />
  }
  if (['zip', 'rar', '7z'].includes(ext)) {
    return <FileArchive className={`${className} text-amber-500`} strokeWidth={1.6} />
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext)) {
    return <FileCode2 className={`${className} text-purple-500`} strokeWidth={1.6} />
  }
  return <File className={`${className} text-slate-300`} strokeWidth={1.6} />
}

function readFileChunkAsBase64(file: File, start: number, end: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(arrayBufferToBase64(reader.result as ArrayBuffer))
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'))
    reader.readAsArrayBuffer(file.slice(start, end))
  })
}

async function fileToPayload(file: File): Promise<DataComplianceFilePayload> {
  const filePath = window.dsGui?.getLocalFilePath?.(file)
  if (filePath) {
    return {
      name: file.name,
      type: file.type || 'application/octet-stream',
      filePath
    }
  }
  const chunkSize = 1024 * 1024 // 1 MiB
  const chunks: string[] = []
  for (let offset = 0; offset < file.size; offset += chunkSize) {
    const base64 = await readFileChunkAsBase64(file, offset, Math.min(offset + chunkSize, file.size))
    chunks.push(base64)
  }
  return {
    name: file.name,
    type: file.type || 'application/octet-stream',
    dataBase64: chunks.join('')
  }
}

function localParentDirectory(filePath: string): string {
  if (!filePath) return ''
  const separatorIndex = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'))
  return separatorIndex > 0 ? filePath.slice(0, separatorIndex) : ''
}

function localFileParentDirectory(file: File): string {
  const filePath = window.dsGui?.getLocalFilePath?.(file)
  return filePath ? localParentDirectory(filePath) : ''
}

function localPathBasename(path: string): string {
  return path.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || path
}

function joinLocalPath(directory: string, leaf: string): string {
  const trimmed = directory.replace(/[\\/]+$/, '')
  if (!trimmed) return leaf
  const separator = trimmed.includes('\\') && !trimmed.includes('/') ? '\\' : '/'
  return `${trimmed}${separator}${leaf}`
}

const MATERIAL_DESENSITIZE_FOLDER_EXTENSIONS = new Set([
  '.txt', '.md', '.markdown', '.log', '.rtf', '.html', '.htm', '.xml', '.yaml', '.yml',
  '.toml', '.ini', '.cfg', '.conf', '.env', '.docx', '.doc', '.pdf', '.csv', '.tsv',
  '.xlsx', '.xls', '.ods', '.json', '.jsonl', '.ndjson', '.png', '.jpg', '.jpeg', '.webp',
  '.bmp', '.tif', '.tiff', '.pptx'
])

function isSupportedMaterialFolderFile(file: File): boolean {
  const dotIndex = file.name.lastIndexOf('.')
  if (dotIndex < 0) return false
  return MATERIAL_DESENSITIZE_FOLDER_EXTENSIONS.has(file.name.slice(dotIndex).toLowerCase())
}

function isGeneratedDesensitizeFolderFile(file: File): boolean {
  const relativePath = file.webkitRelativePath?.replace(/\\/g, '/') || ''
  const segments = relativePath.split('/').filter(Boolean)
  return segments.slice(1, -1).some((segment) => /^脱敏后文件(?:$|[-_（(])/.test(segment))
}

function localFolderRootFromFile(file: File): string {
  const filePath = window.dsGui?.getLocalFilePath?.(file)
  const relativePath = file.webkitRelativePath?.trim()
  if (!filePath || !relativePath) return ''
  const parts = relativePath.replace(/\\/g, '/').split('/').filter(Boolean)
  if (parts.length < 2) return localParentDirectory(filePath)
  let root = filePath
  for (let index = 1; index < parts.length; index += 1) {
    root = localParentDirectory(root)
  }
  return root
}

async function fallbackRequest(
  path: string,
  method: 'GET' | 'POST' | 'DELETE' = 'GET',
  body?: string
): Promise<DataComplianceRequestResult> {
  const response = await fetch(`${FALLBACK_API_BASE}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body
  })
  return {
    ok: response.ok,
    status: response.status,
    body: await response.text(),
    contentType: response.headers.get('content-type') ?? undefined
  }
}

async function requestJson<T>(
  path: string,
  method: 'GET' | 'POST' | 'DELETE' = 'GET',
  body?: string
): Promise<T> {
  const result = typeof window.dsGui?.dataComplianceRequest === 'function'
    ? await window.dsGui.dataComplianceRequest(path, method, body)
    : await fallbackRequest(path, method, body)
  if (!result.ok) throw errorFromBody(result.body, `HTTP ${result.status}`)
  return parseJsonBody<T>(result.body)
}

async function submitViaFallback(payload: DataComplianceSubmitPayload): Promise<DataComplianceRequestResult> {
  if ((payload.files?.length ?? 0) > 1) {
    return {
      ok: false,
      status: 400,
      body: JSON.stringify({ error: '当前运行环境不支持批量材料提交，请使用桌面应用主进程通道。' }),
      contentType: 'application/json'
    }
  }
  const form = new FormData()
  if (payload.file?.dataBase64) {
    const bytes = Uint8Array.from(atob(payload.file.dataBase64), (char) => char.charCodeAt(0))
    form.set('file', new Blob([bytes], { type: payload.file.type || 'application/octet-stream' }), payload.file.name)
  } else if (payload.file || payload.files?.length) {
    const first = payload.files?.[0]
    if (!first?.dataBase64) {
      return {
        ok: false,
        status: 400,
        body: JSON.stringify({ error: '缺少可提交的文件内容。' }),
        contentType: 'application/json'
      }
    }
    const bytes = Uint8Array.from(atob(first.dataBase64), (char) => char.charCodeAt(0))
    form.set('file', new Blob([bytes], { type: first.type || 'application/octet-stream' }), first.name)
  }
  if (payload.inputText?.trim()) form.set('input_text', payload.inputText.trim())
  if (payload.documentName?.trim()) form.set('document_name', payload.documentName.trim())
  if (payload.mode === 'review') form.set('review_type', payload.reviewType ?? 'document')
  if (payload.mode === 'desensitize' && payload.outputDir?.trim()) {
    form.set('output_dir', payload.outputDir.trim())
  }
  if (payload.mode === 'desensitize' && payload.outputFormat?.trim()) {
    form.set('output_format', payload.outputFormat.trim())
  }
  const endpoint = payload.mode === 'review' ? '/api/upload' : '/api/desensitize'
  const response = await fetch(`${FALLBACK_API_BASE}${endpoint}`, { method: 'POST', body: form })
  return {
    ok: response.ok,
    status: response.status,
    body: await response.text(),
    contentType: response.headers.get('content-type') ?? undefined
  }
}

async function submitComplianceTask(payload: DataComplianceSubmitPayload): Promise<{ task_id?: string; error?: string }> {
  const result = typeof window.dsGui?.submitDataComplianceTask === 'function'
    ? await window.dsGui.submitDataComplianceTask(payload)
    : await submitViaFallback(payload)
  const parsed = parseJsonBody<{ task_id?: string; error?: string }>(result.body)
  if (!result.ok || parsed.error) throw new Error(parsed.error || `HTTP ${result.status}`)
  return parsed
}

type ProgressState =
  | { kind: 'idle' }
  | { kind: 'running'; step: number; message: string; percent: number }
  | { kind: 'completed' }
  | { kind: 'failed'; message: string }

type InstallProgressState =
  | { kind: 'idle' }
  | { kind: 'installing'; step: string; percent: number; message: string }
  | { kind: 'done' }
  | { kind: 'error'; message: string }

function useComplianceProgress(taskId: string | null): ProgressState {
  const [state, setState] = useState<ProgressState>({ kind: 'idle' })
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!taskId) {
      setState({ kind: 'idle' })
      return
    }
    const targetId = taskId.trim()
    if (!targetId) {
      setState({ kind: 'idle' })
      return
    }

    abortRef.current?.abort()
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    const controller = new AbortController()
    abortRef.current = controller
    setState({ kind: 'running', step: 0, message: '任务已提交，正在启动本地处理引擎…', percent: 5 })

    // 主 LegalWork runtime 需要鉴权，renderer 无法直接连接 SSE。
    // 改为通过 IPC 轮询 /data-compliance/tasks/:id。
    const schedule = (delay: number): void => {
      if (controller.signal.aborted) return
      timerRef.current = window.setTimeout(poll, delay)
    }

    const poll = async (): Promise<void> => {
      if (controller.signal.aborted) return
      try {
        const data = await requestJson<{
          task_id?: string
          status?: string
          progress?: { step?: number; message?: string; percent?: number }
          error?: string
        }>(`/data-compliance/tasks/${encodeURIComponent(targetId)}`)
        const status = (data.status ?? '').toLowerCase()
        const progress = asRecord(data.progress)
        if (status === 'completed') {
          setState({ kind: 'completed' })
          return
        }
        if (status === 'failed' || status === 'error' || data.error) {
          setState({ kind: 'failed', message: data.error || '任务处理失败' })
          return
        }
        const step = typeof progress?.step === 'number' ? progress.step : 0
        const message = typeof progress?.message === 'string' ? progress.message : '正在处理…'
        const percent = typeof progress?.percent === 'number'
          ? progress.percent
          : step > 0
            ? Math.min(step * 9, 95)
            : 8
        setState({ kind: 'running', step, message, percent })
        schedule(1000)
      } catch {
        if (!controller.signal.aborted) {
          schedule(2000)
        }
      }
    }

    schedule(0)

    return () => {
      controller.abort()
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [taskId])

  return state
}

function ProgressModal({ state, onDismiss, modeScope = 'review' }: { state: ProgressState; onDismiss: () => void; modeScope?: SubmitMode }): ReactElement | null {
  if (state.kind === 'idle') return null
  const running = state.kind === 'running'
  const isDesensitize = modeScope === 'desensitize'
  const failed = state.kind === 'failed'
  const completed = state.kind === 'completed'
  const title = failed
    ? (isDesensitize ? '脱敏失败' : '审查失败')
    : completed
      ? (isDesensitize ? '脱敏完成' : '审查完成')
      : (isDesensitize ? '正在脱敏中' : '正在审查中')
  const subtitle = failed
    ? '任务没有完成，请查看错误信息后重新提交'
    : completed
      ? '任务已完成，可关闭弹窗查看结果'
      : isDesensitize
        ? '请稍候，系统正在处理脱敏任务'
        : '请稍候，系统正在分析文档合规性'
  const actionLabel = running ? '后台运行' : '关闭'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="relative w-full max-w-md rounded-[18px] border border-ds-border bg-ds-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={onDismiss}
          title={actionLabel}
          aria-label={actionLabel}
          className="absolute right-4 top-4 inline-flex h-8 items-center gap-1.5 rounded-full border border-ds-border-muted bg-ds-subtle px-3 text-[12px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink"
        >
          {running ? <Minimize2 className="h-3.5 w-3.5" strokeWidth={1.9} /> : <X className="h-3.5 w-3.5" strokeWidth={1.9} />}
          {actionLabel}
        </button>
        <div className="mb-4 flex items-center gap-3 pr-28">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
            failed
              ? 'bg-red-500/12 text-red-500'
              : completed
                ? 'bg-emerald-500/12 text-emerald-500'
                : ''
          }`}>
            {failed ? <AlertCircle className="h-5 w-5" /> : completed ? <CheckCircle2 className="h-5 w-5" /> : <ThinkingOrbStatus state={isDesensitize ? 'composing' : 'working'} size={20} />}
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-ds-ink">{title}</h3>
            <p className="text-[12px] text-ds-muted">{subtitle}</p>
          </div>
        </div>
        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-ds-subtle">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${failed ? 'bg-red-500' : completed ? 'bg-emerald-500' : 'bg-[var(--ds-accent)]'}`}
            style={{ width: `${running ? state.percent : completed || failed ? 100 : 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[12px] text-ds-muted">
          <span className="truncate pr-4">{running ? state.message : failed ? state.message : '处理完成'}</span>
          <span className="shrink-0">{running ? `${state.percent}%` : completed ? '100%' : ''}</span>
        </div>
      </div>
    </div>
  )
}

function InstallProgressBanner({
  state,
  onRetry
}: {
  state: InstallProgressState
  onRetry?: () => void
}): ReactElement | null {
  if (state.kind === 'idle' || state.kind === 'done') return null

  if (state.kind === 'error') {
    return (
      <div className="flex items-start gap-2 rounded-[14px] border border-red-500/25 bg-red-500/10 px-4 py-3 text-[13px] text-red-700 dark:text-red-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-medium">环境安装失败</div>
          <div className="mt-0.5 text-red-700/85 dark:text-red-200/85">{state.message}</div>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-white/60 px-2.5 py-1 text-[12px] font-medium transition hover:bg-white dark:bg-red-950/30 dark:hover:bg-red-950/50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              重试
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  const stepLabels: Record<string, string> = {
    detecting: '检测 / 下载 Python',
    venv: '创建虚拟环境',
    installing: '安装依赖包'
  }

  return (
    <div className="rounded-[14px] border border-ds-border-muted bg-ds-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <ThinkingOrbStatus
          state={
            state.kind === 'installing'
              ? state.step === 'detecting'
                ? 'searching'
                : state.step === 'installing'
                  ? 'composing'
                  : 'working'
              : 'working'
          }
          size={20}
        />
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-medium text-ds-ink">正在准备数据合规环境</div>
          <div className="text-[12px] text-ds-muted">{state.message}</div>
        </div>
        <span className="text-[13px] font-medium text-[var(--ds-accent)]">{state.percent}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ds-subtle">
        <div
          className="h-full rounded-full bg-[var(--ds-accent)] transition-all duration-500 ease-out"
          style={{ width: `${state.percent}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-ds-faint">
        <span>{stepLabels[state.step] || state.step}</span>
        <span>首次使用会自动完成，可继续使用其他功能</span>
      </div>
    </div>
  )
}

function InlineList({ items }: { items: string[] }): ReactElement | null {
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-ds-border-muted bg-ds-card px-2 py-1 text-[11.5px] text-ds-muted"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function BulletList({ items }: { items: string[] }): ReactElement | null {
  if (items.length === 0) return null
  return (
    <ul className="space-y-1.5 text-[12px] leading-5 text-ds-muted">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current opacity-45" />
          <span className="min-w-0 whitespace-pre-wrap">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function DetailField({ title, value }: { title: string; value: unknown }): ReactElement | null {
  const text = stringifyShort(value).trim()
  if (!text) return null
  return (
    <div>
      <div className="text-[11.5px] font-semibold text-ds-faint">{title}</div>
      <div className="mt-1 whitespace-pre-wrap text-[12.5px] leading-5 text-ds-muted">{text}</div>
    </div>
  )
}

function StatCards({ stats }: { stats: Record<string, unknown> | null }): ReactElement | null {
  if (!stats) return null
  const items = [
    ['total', '总项'],
    ['high_risk', '高风险'],
    ['medium_risk', '中风险'],
    ['advisory', '建议优化'],
    ['triggered', '触发复核'],
    ['maintained', '维持判断']
  ]
    .map(([key, label]) => [label, stringifyShort(stats[key]).trim()] as const)
    .filter(([, value]) => value)
  if (items.length === 0) return null
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-[12px] border border-ds-border-muted bg-ds-card px-3 py-2">
          <div className="text-[11px] text-ds-faint">{label}</div>
          <div className="mt-1 text-[18px] font-semibold text-ds-ink">{value}</div>
        </div>
      ))}
    </div>
  )
}

const REDACTION_ENTITY_LABELS: Record<string, string> = {
  person_name: '自然人姓名',
  company_name: '企业名称',
  law_firm: '律师事务所',
  PERSON: '自然人姓名',
  ORGANIZATION: '机构名称',
  ADDRESS: '地址',
  PHONE_NUMBER: '电话号码',
  ID_CARD: '身份证号',
  ID_NUMBER: '证件号码',
  BANK_CARD: '银行卡号',
  EMAIL_ADDRESS: '电子邮箱',
  ACCOUNT: '账号',
  BIRTH_DATE: '出生日期',
  IP_ADDRESS: 'IP 地址',
  OTHER_IDENTIFIER: '其他身份标识'
}

function redactionEntityLabel(value: unknown): string {
  const type = stringifyShort(value).trim()
  return REDACTION_ENTITY_LABELS[type] || type
}

function DesensitizeStatCards({ stats }: { stats: Record<string, unknown> | null }): ReactElement | null {
  if (!stats) return null
  const items = Object.entries(stats)
    .map(([key, value]) => [redactionEntityLabel(key), stringifyShort(value).trim()] as const)
    .filter(([, value]) => value)
  if (items.length === 0) return null
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-[12px] border border-ds-border-muted bg-ds-card px-3 py-2">
          <div className="text-[11px] text-ds-faint">{label}</div>
          <div className="mt-1 text-[18px] font-semibold text-ds-ink">{value}</div>
        </div>
      ))}
    </div>
  )
}

function RiskItemCard({ item, index }: { item: Record<string, unknown>; index: number }): ReactElement {
  const [foldOpen, setFoldOpen] = useState(false)
  const title = firstText(item, ['risk_point', 'title', 'name', 'rule']) || `风险项 ${index + 1}`
  const level = firstText(item, ['risk_level'])
  const theme = firstText(item, ['theme_name'])
  const evidence = stringArray(item.evidence)
  const sourceSections = recordArray(item.source_sections)
  const supportingRegulations = recordArray(item.supporting_regulations)
  const missingGroups = stringArray(item.missing_groups)
  const related = stringArray(item.related_risk_points)
  const fixSnippet = firstText(item, ['fix_snippet'])
  const rewrittenClause = firstText(item, ['rewritten_clause'])
  const isCodeReview = firstText(item, ['review_type']) === 'code'

  return (
    <article className="rounded-[14px] border border-ds-border-muted bg-ds-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[11.5px] font-medium text-ds-faint">风险项 {index + 1}</div>
          <h3 className="mt-1 text-[14px] font-semibold leading-6 text-ds-ink">{title}</h3>
        </div>
        {level ? (
          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${riskToneClass(level)}`}>
            {level}
          </span>
        ) : null}
      </div>

      {(sourceSections.length > 0 || evidence.length > 0) ? (
        <div className="mt-4 rounded-[12px] border border-ds-border-muted bg-ds-subtle p-3">
          <div className="mb-2 text-[12px] font-semibold text-ds-ink">{isCodeReview ? '代码位置' : '原文摘录'}</div>
          {sourceSections.length > 0 ? (
            <div className="space-y-2">
              {sourceSections.slice(0, 2).map((section, sectionIndex) => {
                const snippet = firstText(section, ['snippet', 'text'])
                const page = firstText(section, ['page'])
                return (
                  <div key={sectionIndex} className="rounded-[10px] border-l-2 border-ds-border bg-ds-card px-3 py-2">
                    {snippet ? (
                      <div className="whitespace-pre-wrap text-[12px] leading-5 text-ds-muted">{snippet}</div>
                    ) : null}
                    {page ? <div className="mt-1 text-[11px] text-ds-faint">页 {page}</div> : null}
                  </div>
                )
              })}
            </div>
          ) : (
            <BulletList items={evidence.slice(0, 2)} />
          )}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[12px] border border-amber-500/20 bg-amber-500/8 p-3">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-amber-700 dark:text-amber-200">
            <span>{isCodeReview ? '代码风险分析' : '风险分析'}</span>
          </div>
          <div className="whitespace-pre-wrap text-[12.5px] leading-5 text-ds-muted">
            {item.reason ? stringifyShort(item.reason) : (
              missingGroups.length > 0
                ? `该处未明确 ${missingGroups.join('、')}，存在 ${title}。`
                : `该处存在 ${title}。`
            )}
          </div>
        </div>
        <div className="rounded-[12px] border border-ds-border-muted bg-ds-subtle p-3">
          <div className="mb-2 text-[12px] font-semibold text-ds-ink">{isCodeReview ? '代码修改建议' : '修改建议'}</div>
          <div className="whitespace-pre-wrap text-[12.5px] leading-5 text-ds-muted">{stringifyShort(item.suggestion) || '—'}</div>
        </div>
        {fixSnippet ? (
          <div className="lg:col-span-2 rounded-[12px] border border-emerald-500/20 bg-emerald-500/8 p-3">
            <div className="mb-2 text-[12px] font-semibold text-emerald-700 dark:text-emerald-200">建议修复代码</div>
            <pre className="overflow-x-auto rounded-[10px] bg-[#171412] p-3 text-[12px] leading-5 text-[#f3f0ea]">
              <code>{fixSnippet}</code>
            </pre>
          </div>
        ) : rewrittenClause ? (
          <div className="lg:col-span-2 rounded-[12px] border border-emerald-500/20 bg-emerald-500/8 p-3">
            <div className="mb-2 text-[12px] font-semibold text-emerald-700 dark:text-emerald-200">{isCodeReview ? '修复实现思路' : '改写后条款'}</div>
            <div className="whitespace-pre-wrap text-[12.5px] leading-5 text-ds-muted">{rewrittenClause}</div>
          </div>
        ) : null}
      </div>

      {missingGroups.length > 0 || related.length > 0 ? (
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {missingGroups.length > 0 ? (
            <div>
              <div className="mb-2 text-[11.5px] font-semibold text-ds-faint">待补要素</div>
              <InlineList items={missingGroups} />
            </div>
          ) : null}
          {related.length > 0 ? (
            <div>
              <div className="mb-2 text-[11.5px] font-semibold text-ds-faint">关联风险</div>
              <InlineList items={related} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 border-t border-ds-border-muted pt-3">
        <button
          type="button"
          onClick={() => setFoldOpen((v) => !v)}
          className="flex items-center gap-2 text-[12px] font-medium text-ds-muted transition hover:text-ds-ink"
        >
          <span className={`transition-transform ${foldOpen ? 'rotate-180' : ''}`}>▼</span>
          法规依据与定位详情
        </button>
        {foldOpen ? (
          <div className="mt-3 space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <DetailField title="法律依据" value={item.legal_basis} />
              <DetailField title="依据说明" value={item.legal_basis_detail} />
              <DetailField title="主题" value={theme} />
              <DetailField title="自动复核" value={item.auto_recheck_status || item.auto_recheck_notes} />
            </div>
            {supportingRegulations.length > 0 ? (
              <div className="rounded-[12px] border border-ds-border-muted bg-ds-subtle p-3">
                <div className="mb-2 text-[12px] font-semibold text-ds-ink">补充规范索引</div>
                <div className="space-y-2">
                  {supportingRegulations.map((regulation, regulationIndex) => {
                    const regTitle = firstText(regulation, ['title', 'standard_code']) || `规范 ${regulationIndex + 1}`
                    const snippet = firstText(regulation, ['snippet'])
                    const score = firstText(regulation, ['match_score'])
                    return (
                      <div key={`${regTitle}-${regulationIndex}`} className="rounded-[10px] border border-ds-border bg-ds-card px-3 py-2">
                        <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-ds-ink">
                          <span>{regTitle}</span>
                          {score ? <span className="text-[11px] text-ds-faint">匹配 {score}</span> : null}
                        </div>
                        {snippet ? <div className="mt-1 whitespace-pre-wrap text-[12px] leading-5 text-ds-muted">{snippet}</div> : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
            {evidence.length > 0 ? (
              <div className="rounded-[12px] border border-ds-border-muted bg-ds-subtle p-3">
                <div className="mb-2 text-[12px] font-semibold text-ds-ink">补充证据片段</div>
                <BulletList items={evidence} />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

function RemediationSection({ remediation }: { remediation: unknown }): ReactElement | null {
  const data = asRecord(remediation)
  if (!data) return null
  const tasks = recordArray(data.tasks)
  if (tasks.length === 0) return null
  return (
    <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ds-ink">整改任务</h3>
        <span className="text-[12px] text-ds-faint">共 {stringifyShort(data.task_count || tasks.length)} 项</span>
      </div>
      <div className="mt-3 space-y-2">
        {tasks.map((task, index) => {
          const title = firstText(task, ['title', 'risk_point']) || `整改任务 ${index + 1}`
          const priority = firstText(task, ['priority'])
          const actions = stringArray(task.suggested_actions)
          const deliverables = stringArray(task.deliverables)
          const evidence = stringArray(task.required_evidence)
          return (
            <div key={`${title}-${index}`} className="rounded-[12px] border border-ds-border bg-ds-card p-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-[13px] font-semibold text-ds-ink">{title}</div>
                {priority ? <span className="rounded-full bg-ds-subtle px-2 py-0.5 text-[11px] text-ds-muted">{priority}</span> : null}
              </div>
              <DetailField title="目标" value={task.objective || task.summary} />
              {actions.length > 0 ? <div className="mt-2"><div className="mb-1 text-[11.5px] font-semibold text-ds-faint">建议动作</div><BulletList items={actions} /></div> : null}
              {evidence.length > 0 ? <div className="mt-2"><div className="mb-1 text-[11.5px] font-semibold text-ds-faint">所需证据</div><BulletList items={evidence} /></div> : null}
              {deliverables.length > 0 ? <div className="mt-2"><div className="mb-1 text-[11.5px] font-semibold text-ds-faint">交付物</div><InlineList items={deliverables} /></div> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function EvidenceSection({ evidence }: { evidence: unknown }): ReactElement | null {
  const data = asRecord(evidence)
  const checklist = data ? recordArray(data.checklist) : []
  if (checklist.length === 0) return null
  return (
    <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
      <h3 className="text-[15px] font-semibold text-ds-ink">证据清单</h3>
      <div className="mt-3 grid gap-2 lg:grid-cols-2">
        {checklist.map((item, index) => {
          const title = firstText(item, ['risk_point']) || `证据项 ${index + 1}`
          const items = stringArray(item.evidence_items)
          return (
            <div key={`${title}-${index}`} className="rounded-[12px] border border-ds-border bg-ds-card p-3">
              <div className="text-[13px] font-semibold text-ds-ink">{title}</div>
              <div className="mt-1 text-[11.5px] text-ds-faint">{firstText(item, ['owner_hint'])}</div>
              <DetailField title="用途" value={item.why_needed} />
              {items.length > 0 ? <div className="mt-2"><BulletList items={items} /></div> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ScenarioPackSection({ title, pack }: { title: string; pack: unknown }): ReactElement | null {
  const data = asRecord(pack)
  if (!data || data.enabled === false) return null
  const sections = recordArray(data.sections)
  if (sections.length === 0) return null
  return (
    <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-ds-ink">{title}</h3>
        <span className="text-[12px] text-ds-faint">{firstText(data, ['scenario_name'])}</span>
      </div>
      <InlineList items={stringArray(data.matched_risk_points)} />
      <div className="mt-3 grid gap-2 lg:grid-cols-2">
        {sections.map((section, index) => {
          const sectionTitle = firstText(section, ['title', 'id']) || `核查项 ${index + 1}`
          const requiredItems = stringArray(section.required_items)
          return (
            <div key={`${sectionTitle}-${index}`} className="rounded-[12px] border border-ds-border bg-ds-card p-3">
              <div className="text-[13px] font-semibold text-ds-ink">{sectionTitle}</div>
              {requiredItems.length > 0 ? <div className="mt-2"><BulletList items={requiredItems} /></div> : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function DesensitizeReport({ result }: { result: ComplianceResult }): ReactElement | null {
  const report = result.report
  if (!report || result.product_type !== 'desensitize') return null
  const findings = recordArray(report.findings)
  const summary = asRecord(report.summary)
  const warnings = stringArray(report.warnings)
  return (
    <div className="space-y-4">
      <DesensitizeStatCards stats={asRecord(summary?.entity_counts)} />
      {warnings.length > 0 ? (
        <section className="rounded-[14px] border border-amber-500/20 bg-amber-500/8 p-4">
          <h3 className="text-[15px] font-semibold text-amber-700 dark:text-amber-200">处理说明</h3>
          <div className="mt-2 space-y-1.5">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 text-[12.5px] leading-5 text-amber-700 dark:text-amber-200">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
        <h3 className="text-[15px] font-semibold text-ds-ink">脱敏命中</h3>
        {findings.length === 0 ? (
          <div className="mt-3 rounded-[12px] border border-ds-border-muted bg-ds-card px-4 py-6 text-center text-[13px] text-ds-faint">
            未识别到敏感信息或法律主体。
          </div>
        ) : (
          <div className="mt-3 space-y-2">
            {findings.map((finding, index) => (
              <div key={`${firstText(finding, ['entity_type'])}-${index}`} className="rounded-[12px] border border-ds-border bg-ds-card p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-semibold text-ds-ink">{redactionEntityLabel(firstText(finding, ['entity_type'])) || `命中 ${index + 1}`}</span>
                  <span className="rounded-full bg-ds-subtle px-2 py-0.5 text-[11px] text-ds-muted">置信度 {firstText(finding, ['score'])}</span>
                </div>
                <div className="mt-2 grid gap-2 text-[12px] lg:grid-cols-3">
                  <DetailField title="预览" value={finding.preview} />
                  <DetailField title="替换后" value={finding.replacement} />
                  <DetailField title="位置" value={`${firstText(finding, ['locator'])} ${firstText(finding, ['start'])}-${firstText(finding, ['end'])}`.trim()} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
        <h3 className="text-[15px] font-semibold text-ds-ink">脱敏策略</h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <DetailField title="策略" value={report.strategy} />
          <DetailField title="剩余风险" value={report.residual_risk} />
          <DetailField title="输入类型" value={report.input_type} />
          <DetailField title="输出文件" value={asRecord(report.output)?.file_name} />
        </div>
      </section>
    </div>
  )
}

function OverviewSection({
  result,
  items,
  remediation
}: {
  result: ComplianceResult
  items: Array<Record<string, unknown>>
  remediation: unknown
}): ReactElement | null {
  const high = items.filter((i) => String(i.risk_level).includes('高')).length
  const medium = items.filter((i) => String(i.risk_level).includes('中')).length
  const advisory = items.filter((i) => {
    const level = String(i.risk_level)
    return level.includes('低') || level.includes('建议')
  }).length
  const report = result.report
  const autoRecheck = asRecord(report?.auto_recheck_triggered)
  const regulationDb = asRecord(report?.local_regulation_db)
  const remediationData = asRecord(remediation)
  const tasks = recordArray(remediationData?.tasks)
  const topTask = tasks.find((t) => firstText(t, ['priority']) === 'P1') ?? tasks[0]

  return (
    <section className="rounded-[16px] border border-ds-border bg-ds-card p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
      <h3 className="text-[16px] font-semibold text-ds-ink">审查概览</h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
          <div className="text-[11.5px] font-semibold text-ds-faint">审查结论</div>
          <div className="mt-2 text-[15px] font-medium leading-7 text-ds-ink">
            共发现 <span className="text-[var(--ds-accent)] font-semibold">{items.length}</span> 项合规关注点
            {high > 0 ? (
              <>
                ，其中 <span className="text-red-600 dark:text-red-200 font-semibold">{high} 项高风险</span> 需优先处理
              </>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            {high > 0 ? (
              <div className="text-center">
                <div className="text-[26px] font-semibold leading-none text-red-600 dark:text-red-200">{high}</div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-ds-muted">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> 高风险
                </div>
              </div>
            ) : null}
            {medium > 0 ? (
              <div className="text-center">
                <div className="text-[26px] font-semibold leading-none text-amber-600 dark:text-amber-200">{medium}</div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-ds-muted">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> 中风险
                </div>
              </div>
            ) : null}
            {advisory > 0 ? (
              <div className="text-center">
                <div className="text-[26px] font-semibold leading-none text-blue-600 dark:text-blue-200">{advisory}</div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-ds-muted">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> 建议优化
                </div>
              </div>
            ) : null}
          </div>
          {autoRecheck ? (
            <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-700 dark:text-amber-200">
              <RefreshCw className="h-3.5 w-3.5" />
              已触发自动复核
            </div>
          ) : null}
          {regulationDb?.enabled === true ? (
            <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-ds-border-muted bg-ds-card px-3 py-2 text-[12px] text-ds-muted">
              <ShieldCheck className="h-3.5 w-3.5" />
              法规库增强已生效：{stringifyShort(regulationDb.matched_items)} 项命中，{stringifyShort(regulationDb.unmatched_items)} 项暂未命中
            </div>
          ) : null}
        </div>

        <div className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
          <div className="text-[11.5px] font-semibold text-ds-faint">优先行动</div>
          {topTask ? (
            <>
              <div className="mt-2 inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-600 dark:text-red-200">
                {firstText(topTask, ['priority']) || 'P1'}
              </div>
              <div className="mt-2 text-[15px] font-medium text-ds-ink">
                {firstText(topTask, ['title', 'risk_point']) || '整改任务'}
              </div>
              <div className="mt-1 text-[12.5px] leading-5 text-ds-muted">
                {firstText(topTask, ['objective', 'summary', 'suggestion'])}
              </div>
              {tasks.length > 1 ? (
                <div className="mt-3 text-[12px] text-ds-faint">
                  查看全部 {tasks.length} 项整改任务
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-emerald-600 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              暂无需立即处理的整改任务
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function EmbeddedComplianceReport({
  result,
  resultSummary
}: {
  result: ComplianceResult
  resultSummary: string
}): ReactElement {
  const report = result.report
  const items = resultItems(result)
  const stats = asRecord(report?.stats)
  const autoRecheckStats = asRecord(report?.auto_recheck_stats)
  const notes = stringArray(report?.notes)
  const riskClusters = recordArray(report?.risk_clusters)

  if (result.product_type === 'desensitize') {
    if (!report) return <div className="text-[13px] text-ds-muted">{resultSummary}</div>
    return (
      <div className="space-y-4">
        <DesensitizeReport result={result} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <OverviewSection result={result} items={items} remediation={result.remediation} />
      <StatCards stats={stats} />
      <StatCards stats={autoRecheckStats} />

      {riskClusters.length > 0 ? (
        <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
          <h3 className="text-[15px] font-semibold text-ds-ink">主题聚类</h3>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {riskClusters.map((cluster, index) => (
              <div key={`${firstText(cluster, ['theme_id', 'theme_name'])}-${index}`} className="rounded-[12px] border border-ds-border bg-ds-card p-3">
                <div className="text-[13px] font-semibold text-ds-ink">{firstText(cluster, ['theme_name']) || `主题 ${index + 1}`}</div>
                <div className="mt-1 text-[11.5px] text-ds-faint">
                  共 {firstText(cluster, ['item_count'])} 项，高风险 {firstText(cluster, ['high_risk_count']) || '0'}，中风险 {firstText(cluster, ['medium_risk_count']) || '0'}，建议 {firstText(cluster, ['advisory_count']) || '0'}
                </div>
                <div className="mt-2">
                  <InlineList items={stringArray(cluster.risk_points)} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
        <h3 className="text-[15px] font-semibold text-ds-ink">风险清单</h3>
        <p className="mt-1 text-[12.5px] text-ds-muted">{resultSummary}</p>
        <div className="mt-3 space-y-3">
          {items.map((item, index) => (
            <RiskItemCard key={`${firstText(item, ['risk_point', 'title'])}-${index}`} item={item} index={index} />
          ))}
        </div>
      </section>

      <RemediationSection remediation={result.remediation} />
      <EvidenceSection evidence={result.evidence} />
      <ScenarioPackSection title="隐私文档整改包" pack={result.privacy_pack} />
      <ScenarioPackSection title="数据出境专项包" pack={result.cross_border_pack} />
      <ScenarioPackSection title="SDK 与合作方审查包" pack={result.sdk_pack} />

      {notes.length > 0 ? (
        <section className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
          <h3 className="text-[15px] font-semibold text-ds-ink">审查说明</h3>
          <div className="mt-3">
            <BulletList items={notes} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

function historyStatusDot(status: string | undefined): string {
  const normalized = (status ?? '').toLowerCase()
  if (normalized === 'completed') return 'bg-emerald-500'
  if (normalized === 'failed' || normalized === 'error') return 'bg-red-500'
  if (normalized === 'running' || normalized === 'processing' || normalized === 'pending') {
    return 'bg-amber-500'
  }
  return 'bg-ds-faint'
}

function ComplianceHistorySidebarGroup({
  mode,
  label,
  active,
  onHistoryOpen,
  onTaskOpen
}: {
  mode: SubmitMode
  label: string
  active: boolean
  onHistoryOpen: () => void
  onTaskOpen: () => void
}): ReactElement {
  const tasks = useComplianceHistoryStore((state) => mode === 'desensitize'
    ? state.desensitizeTasks
    : state.reviewTasks)
  const busy = useComplianceHistoryStore((state) => mode === 'desensitize'
    ? state.desensitizeBusy
    : state.reviewBusy)
  const error = useComplianceHistoryStore((state) => mode === 'desensitize'
    ? state.desensitizeError
    : state.reviewError)
  const selectedTaskId = useComplianceHistoryStore((state) => mode === 'desensitize'
    ? state.selectedDesensitizeTaskId
    : state.selectedReviewTaskId)
  const refresh = useComplianceHistoryStore((state) => state.refresh)
  const select = useComplianceHistoryStore((state) => state.select)
  const remove = useComplianceHistoryStore((state) => state.remove)
  const [expanded, setExpanded] = useState(active)

  useEffect(() => {
    if (active) setExpanded(true)
  }, [active])

  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    if (!taskId) return
    await requestJson<{ ok?: boolean }>(`/data-compliance/tasks/${encodeURIComponent(taskId)}`, 'DELETE')
    complianceResultCache.delete(taskId)
    remove(mode, taskId)
  }, [mode, remove])

  return (
    <div className="min-h-0">
      <SidebarCommandRow
        icon={<History className="h-4 w-4" strokeWidth={1.8} />}
        label={label}
        active={active}
        trailing={expanded
          ? <ChevronDown className="h-3.5 w-3.5 text-ds-faint" strokeWidth={1.8} />
          : <ChevronRight className="h-3.5 w-3.5 text-ds-faint" strokeWidth={1.8} />}
        onClick={() => {
          setExpanded((current) => active ? !current : true)
          onHistoryOpen()
        }}
      />

      {expanded ? (
        <div className="ml-3 mt-1 border-l border-[var(--ds-sidebar-divider)] pl-2">
          <div className="flex items-center justify-between gap-2 px-2 pb-1.5 pt-1">
            <span className="text-[10.5px] text-ds-faint">{busy ? '同步中…' : `${tasks.length} 项任务`}</span>
            <button
              type="button"
              onClick={() => {
                void refresh(mode).catch((refreshError: unknown) => {
                  console.error('[ComplianceHistorySidebarGroup] refresh failed:', refreshError)
                })
              }}
              className="flex h-6 w-6 items-center justify-center rounded-[8px] text-ds-faint transition hover:bg-[var(--ds-sidebar-row-hover)] hover:text-ds-ink"
              title="刷新历史任务"
              aria-label="刷新历史任务"
            >
              {busy
                ? <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.8} />
                : <RefreshCw className="h-3 w-3" strokeWidth={1.8} />}
            </button>
          </div>

          {error && tasks.length === 0 ? (
            <div className="px-2 py-2 text-[10.5px] leading-4 text-red-500">{error}</div>
          ) : null}

          <div className="max-h-[min(52vh,480px)] space-y-0.5 overflow-y-auto pr-1">
            {!busy && tasks.length === 0 && !error ? (
              <div className="px-2 py-3 text-[11px] text-ds-faint">暂无历史任务</div>
            ) : null}
            {tasks.map((task) => {
              const id = taskIdOf(task)
              const selected = active && selectedTaskId === id
              return (
                <div
                  key={id || task.document_name}
                  data-sidebar-hover-target
                  data-sidebar-active={selected ? 'true' : undefined}
                  className="group relative rounded-[10px] [contain-intrinsic-size:42px] [content-visibility:auto]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!id) return
                      select(mode, id)
                      onTaskOpen()
                    }}
                    className={`flex min-h-[42px] w-full items-start gap-2 rounded-[10px] py-1.5 pl-2 pr-8 text-left transition ${
                      selected ? 'text-ds-ink' : 'text-ds-muted hover:text-ds-ink'
                    }`}
                    title={task.document_name || id}
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${historyStatusDot(task.status)}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium leading-5">
                        {task.document_name || id || '未命名任务'}
                      </span>
                      <span className="block truncate text-[10px] leading-4 text-ds-faint">
                        {task.created_at ? new Date(task.created_at).toLocaleString() : id}
                      </span>
                    </span>
                  </button>
                  {id ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        void deleteTask(id).catch((deleteError: unknown) => {
                          console.error('[ComplianceHistorySidebarGroup] delete failed:', deleteError)
                        })
                      }}
                      className="absolute right-1.5 top-2 flex h-6 w-6 items-center justify-center rounded-[8px] text-ds-faint opacity-0 transition hover:bg-red-500/10 hover:text-red-600 group-hover:opacity-100"
                      title="删除历史任务"
                      aria-label="删除历史任务"
                    >
                      <Trash2 className="h-3 w-3" strokeWidth={1.8} />
                    </button>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function DataComplianceSidebarNav({
  activeSection,
  onSectionChange
}: {
  activeSection: DataComplianceSection
  onSectionChange: (section: DataComplianceSection) => void
}): ReactElement {
  const selectedTaskId = useComplianceHistoryStore((state) => state.selectedReviewTaskId)
  const historyActive = activeSection === 'history' || (activeSection === 'results' && Boolean(selectedTaskId))

  return (
    <div className="ds-no-drag flex min-h-0 flex-1 flex-col px-2 pt-1">
      <div className="mb-2 px-1">
        <div className="text-[13px] font-semibold text-ds-muted">数据合规</div>
      </div>
      <div className="min-h-0 space-y-1 overflow-y-auto">
        <SidebarCommandRow
          icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.8} />}
          label="合规审查"
          active={activeSection === 'review'}
          onClick={() => onSectionChange('review')}
        />
        <SidebarCommandRow
          icon={<ScanEye className="h-4 w-4" strokeWidth={1.8} />}
          label="数据脱敏"
          active={activeSection === 'desensitize'}
          onClick={() => onSectionChange('desensitize')}
        />
        <ComplianceHistorySidebarGroup
          mode="review"
          label="历史任务"
          active={historyActive}
          onHistoryOpen={() => onSectionChange('history')}
          onTaskOpen={() => onSectionChange('results')}
        />
      </div>
    </div>
  )
}

export function DesensitizeSidebarNav({
  activeSection,
  onSectionChange
}: {
  activeSection: DesensitizeSection
  onSectionChange: (section: DesensitizeSection) => void
}): ReactElement {
  return (
    <div className="ds-no-drag flex min-h-0 flex-1 flex-col px-2 pt-1">
      <div className="mb-2 px-1">
        <div className="text-[13px] font-semibold text-ds-muted">脱敏</div>
      </div>
      <div className="min-h-0 space-y-1 overflow-y-auto">
        <SidebarCommandRow
          icon={<FileText className="h-4 w-4" strokeWidth={1.8} />}
          label="材料脱敏"
          active={activeSection === 'material'}
          onClick={() => onSectionChange('material')}
        />
        <ComplianceHistorySidebarGroup
          mode="desensitize"
          label="脱敏记录"
          active={activeSection === 'history' || activeSection === 'results'}
          onHistoryOpen={() => onSectionChange('history')}
          onTaskOpen={() => onSectionChange('results')}
        />
      </div>
    </div>
  )
}

export function DataCompliancePanel({
  activeSection,
  onSectionChange,
  modeScope = 'review',
  desensitizeKind = 'info'
}: {
  activeSection: DataComplianceSection
  onSectionChange: (section: DataComplianceSection) => void
  modeScope?: SubmitMode
  desensitizeKind?: DesensitizeKind
}): ReactElement {
  const { t } = useTranslation('common')
  const workspaceRoot = useChatStore((s) => s.workspaceRoot)
  const [reviewType, setReviewType] = useState<ReviewType>('document')
  const [documentName, setDocumentName] = useState('')
  const [inputText, setInputText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [folderRoot, setFolderRoot] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const sharedSelectedTaskId = useComplianceHistoryStore((state) => modeScope === 'desensitize'
    ? state.selectedDesensitizeTaskId
    : state.selectedReviewTaskId)
  const historyBusy = useComplianceHistoryStore((state) => modeScope === 'desensitize'
    ? state.desensitizeBusy
    : state.reviewBusy)
  const refreshHistoryStore = useComplianceHistoryStore((state) => state.refresh)
  const selectHistoryTask = useComplianceHistoryStore((state) => state.select)
  const [taskId, setTaskId] = useState(sharedSelectedTaskId)
  const [resultBusy, setResultBusy] = useState(false)
  const [result, setResult] = useState<ComplianceResult | null>(null)
  const resultRequestSequenceRef = useRef(0)
  const previousSharedSelectedTaskIdRef = useRef(sharedSelectedTaskId)
  const [progressTaskId, setProgressTaskId] = useState('')
  const [submissionProgress, setSubmissionProgress] = useState<ProgressState>({ kind: 'idle' })
  const [serverStatus, setServerStatus] = useState<DataComplianceStatus | null>({
    ok: false, running: false, installing: false,
    baseUrl: '', message: '检测中...'
  })
  const [statusBusy, setStatusBusy] = useState(false)
  const [outputDir, setOutputDir] = useState('')
  const [outputDirTouched, setOutputDirTouched] = useState(false)
  const [outputFormat, setOutputFormat] = useState<'md' | 'docx' | 'pdf' | 'txt'>('docx')
  const [redactionMode, setRedactionMode] = useState<RedactionMode>('standard')
  const [installProgress, setInstallProgress] = useState<InstallProgressState>({ kind: 'idle' })

  const ensureServer = useCallback(async (): Promise<DataComplianceStatus | null> => {
    if (typeof window.dsGui?.getDataComplianceStatus !== 'function') {
      return null
    }
    setStatusBusy(true)
    try {
      const status = await window.dsGui.getDataComplianceStatus()
      setServerStatus(status)
      if (status.ok) {
        setInstallProgress((prev) => prev.kind === 'installing' ? { kind: 'done' } : prev)
        setNotice((current) => current?.tone === 'error' && /环境|Python|服务.*不可用|检测.*失败/.test(current.text)
          ? null
          : current)
      } else {
        if (status.installing) {
          setNotice(null)
          setInstallProgress((prev) =>
            prev.kind === 'idle' || prev.kind === 'error'
              ? { kind: 'installing', step: 'detecting', percent: 5, message: status.message || '正在准备环境…' }
              : prev
          )
          // 安装由主进程 data-compliance:status handler 自动触发，renderer 只需监听进度，
          // 避免与 installDataCompliance() 重复调用导致竞态。
        } else {
          setNotice({ tone: 'error', text: status.message })
        }
      }
      return status
    } catch (error) {
      const text = error instanceof Error ? error.message : '数据合规服务启动失败。'
      setServerStatus({
        ok: false,
        running: false,
        installing: false,
        baseUrl: '',
        message: text
      })
      setNotice({ tone: 'error', text })
      return null
    } finally {
      setStatusBusy(false)
    }
  }, [])

  useEffect(() => {
    if (!serverStatus?.installing) return
    const timer = window.setInterval(() => {
      void ensureServer().catch((error: unknown) => {
        console.error('[DataCompliancePanel] environment status poll failed:', error)
      })
    }, 3_000)
    return () => window.clearInterval(timer)
  }, [ensureServer, serverStatus?.installing])

  useEffect(() => {
    const input = folderInputRef.current
    if (!input) return
    input.setAttribute('webkitdirectory', '')
    input.setAttribute('directory', '')
  }, [])

  useEffect(() => {
    if (outputDirTouched) return
    const parentDir = files[0] ? localFileParentDirectory(files[0]) : ''
    const nextOutputDir = folderRoot
      ? joinLocalPath(folderRoot, '脱敏后文件')
      : parentDir || workspaceRoot || ''
    setOutputDir((current) => current === nextOutputDir ? current : nextOutputDir)
  }, [files, folderRoot, outputDirTouched, workspaceRoot])

  useEffect(() => {
    if (typeof window.dsGui?.onDataComplianceInstallProgress !== 'function') return
    const unsubscribe = window.dsGui.onDataComplianceInstallProgress((payload) => {
      if (payload.step === 'done') {
        setInstallProgress({ kind: 'done' })
        ensureServer().catch((error: unknown) => {
          console.error('[DataCompliancePanel] ensureServer after install failed:', error)
        })
      } else if (payload.step === 'error') {
        setInstallProgress({ kind: 'error', message: payload.message })
      } else {
        setInstallProgress({
          kind: 'installing',
          step: payload.step,
          percent: payload.percent,
          message: payload.message
        })
      }
    })
    return unsubscribe
  }, [ensureServer])

  const resolvedActiveSection: DataComplianceSection = Object.prototype.hasOwnProperty.call(sectionMeta, activeSection)
    ? activeSection
    : 'review'
  const effectiveModeScope: SubmitMode = modeScope === 'desensitize' || resolvedActiveSection === 'desensitize'
    ? 'desensitize'
    : 'review'
  const effectiveDesensitizeKind: DesensitizeKind = resolvedActiveSection === 'desensitize'
    ? 'info'
    : desensitizeKind
  const meta = modeScope === 'desensitize'
    ? resolvedActiveSection === 'history'
      ? { title: '脱敏记录', kicker: '查看材料脱敏任务' }
      : resolvedActiveSection === 'results'
        ? { title: '脱敏结果', kicker: '查看当前选中任务的处理结果与输出文件' }
      : effectiveDesensitizeKind === 'material'
        ? { title: '材料脱敏', kicker: '文档材料批量脱敏处理' }
        : { title: '数据脱敏', kicker: '敏感数据识别、替换与脱敏报告' }
    : sectionMeta[resolvedActiveSection]
  const selectedTaskId = taskId.trim()
  const [progressDismissed, setProgressDismissed] = useState(false)
  const progressDismissedRef = useRef(progressDismissed)
  const progress = useComplianceProgress(progressDismissed ? null : (progressTaskId.trim() || null))
  const visibleProgress: ProgressState = progressDismissed
    ? { kind: 'idle' }
    : submissionProgress.kind !== 'idle' && progress.kind === 'idle'
      ? submissionProgress
      : progress
  const resultSummary = summarizeResult(result)

  useEffect(() => {
    progressDismissedRef.current = progressDismissed
  }, [progressDismissed])

  useEffect(() => {
    if (submissionProgress.kind !== 'idle' && progress.kind !== 'idle') {
      setSubmissionProgress({ kind: 'idle' })
    }
  }, [progress.kind, submissionProgress.kind])

  const dismissProgress = useCallback(() => {
    progressDismissedRef.current = true
    setProgressDismissed(true)
    setSubmissionProgress({ kind: 'idle' })
  }, [])

  const serverHint = useMemo(() => {
    if (!serverStatus) return '服务状态：正在检测'
    if (!serverStatus.ok) return `服务状态：${serverStatus.message}`
    if (serverStatus.installing) return '服务状态：正在准备依赖'
    return serverStatus.running ? '服务状态：运行中' : '服务状态：可启动'
  }, [serverStatus])

  const refreshHistory = useCallback(async (): Promise<void> => {
    try {
      await ensureServer()
      await refreshHistoryStore(modeScope)
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? `历史读取失败：${error.message}` : '历史读取失败。'
      })
    }
  }, [ensureServer, modeScope, refreshHistoryStore])

  const loadResult = useCallback(async (id = selectedTaskId, options: { quiet?: boolean; navigate?: boolean } = {}): Promise<ComplianceResult | null> => {
    const targetId = id.trim()
    if (!targetId) {
      setNotice({ tone: 'error', text: '请输入任务编号。' })
      return null
    }
    const requestSequence = ++resultRequestSequenceRef.current
    const cachedResult = complianceResultCache.get(targetId)
    if (cachedResult) {
      setResultBusy(false)
      setTaskId(targetId)
      setResult(cachedResult)
      selectHistoryTask(modeScope, targetId)
      if (options.navigate !== false) onSectionChange('results')
      return cachedResult
    }

    setResultBusy(true)
    if (!options.quiet) setNotice(null)
    try {
      if (!serverStatus?.ok) await ensureServer()
      const payload = await requestJson<ComplianceResult>(`/data-compliance/tasks/${encodeURIComponent(targetId)}`)
      if (requestSequence !== resultRequestSequenceRef.current) return null
      if (payload.error) throw new Error(payload.error)
      setTaskId(targetId)
      setResult(payload)
      selectHistoryTask(modeScope, targetId)
      const status = (payload.status ?? '').toLowerCase()
      if (status === 'pending' || status === 'running' || status === 'processing') {
        setProgressTaskId(targetId)
      } else {
        complianceResultCache.set(targetId, payload)
        setProgressTaskId((current) => (current === targetId ? '' : current))
      }
      if (options.navigate !== false) onSectionChange('results')
      return payload
    } catch (error) {
      if (requestSequence !== resultRequestSequenceRef.current) return null
      if (!options.quiet) {
        setNotice({
          tone: 'error',
          text: error instanceof Error ? `结果读取失败：${error.message}` : '结果读取失败。'
        })
      }
      return null
    } finally {
      if (requestSequence === resultRequestSequenceRef.current) setResultBusy(false)
    }
  }, [ensureServer, modeScope, onSectionChange, selectHistoryTask, selectedTaskId, serverStatus?.ok])

  useEffect(() => {
    const previousTaskId = previousSharedSelectedTaskIdRef.current
    previousSharedSelectedTaskIdRef.current = sharedSelectedTaskId
    if (!previousTaskId || sharedSelectedTaskId) return

    resultRequestSequenceRef.current += 1
    setTaskId('')
    setResult(null)
    setResultBusy(false)
  }, [sharedSelectedTaskId])

  useEffect(() => {
    if (resolvedActiveSection !== 'results' || !sharedSelectedTaskId) return
    if (result?.task_id === sharedSelectedTaskId) return

    setTaskId(sharedSelectedTaskId)
    setResult(null)
    void loadResult(sharedSelectedTaskId, { navigate: false }).catch((error: unknown) => {
      console.error('[DataCompliancePanel] load selected history result failed:', error)
    })
  }, [loadResult, resolvedActiveSection, result?.task_id, sharedSelectedTaskId])

  useEffect(() => {
    void refreshHistory().catch((error: unknown) => {
      console.error('[DataCompliancePanel] refreshHistory failed:', error)
    })
  }, [refreshHistory, modeScope])

  // Auto-refresh the history lists while any compliance/desensitize task is
  // still running, so status changes appear without a manual refresh click.
  // Stops polling once no task is in flight.
  useEffect(() => {
    let cancelled = false
    let timer: number | null = null

    const isInFlight = (task: ComplianceTask): boolean => {
      const status = (task.status ?? '').toLowerCase()
      return status === 'running' || status === 'processing' || status === 'pending'
    }

    const poll = async (): Promise<void> => {
      if (cancelled) return
      await refreshHistory()
      if (cancelled) return
      const { reviewTasks, desensitizeTasks } = useComplianceHistoryStore.getState()
      const anyRunning = reviewTasks.some(isInFlight) || desensitizeTasks.some(isInFlight)
      if (anyRunning) {
        timer = window.setTimeout(() => { void poll() }, 5000)
      }
    }

    void poll()
    return () => {
      cancelled = true
      if (timer !== null) window.clearTimeout(timer)
    }
  }, [refreshHistory])

  const addSelectedFiles = useCallback((nextFiles: File[]): void => {
    if (nextFiles.length === 0) return
    setFiles((current) => {
      const byKey = new Map(current.map((item) => [`${item.name}:${item.size}:${item.lastModified}`, item]))
      for (const nextFile of nextFiles) {
        byKey.set(`${nextFile.name}:${nextFile.size}:${nextFile.lastModified}`, nextFile)
      }
      return [...byKey.values()]
    })
    if (!documentName.trim()) {
      const first = nextFiles[0]
      setDocumentName(nextFiles.length === 1
        ? first.name.replace(/\.[^.]+$/, '')
        : `批量材料 ${nextFiles.length} 个文件`
      )
    }
    setOutputFormat('docx')
    if (!outputDirTouched) {
      const parentDir = localFileParentDirectory(nextFiles[0])
      if (parentDir) setOutputDir(parentDir)
    }
  }, [documentName, outputDirTouched])

  const onPickFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextFiles = Array.from(event.target.files ?? [])
    setFolderRoot('')
    addSelectedFiles(nextFiles)
    // 允许重复选择同一文件
    if (event.target) event.target.value = ''
  }

  const onPickFolder = (event: ChangeEvent<HTMLInputElement>): void => {
    const pickedFiles = Array.from(event.target.files ?? [])
    if (pickedFiles.length === 0) return
    const root = localFolderRootFromFile(pickedFiles[0])
    const nextFiles = pickedFiles.filter((file) =>
      isSupportedMaterialFolderFile(file) && !isGeneratedDesensitizeFolderFile(file)
    )
    if (nextFiles.length === 0) {
      setNotice({ tone: 'error', text: '所选文件夹中没有可脱敏的受支持文件。' })
      event.target.value = ''
      return
    }
    const skippedCount = pickedFiles.length - nextFiles.length
    setFiles(nextFiles)
    setFolderRoot(root)
    if (!documentName.trim()) {
      setDocumentName(root ? localPathBasename(root) : `批量材料 ${nextFiles.length} 个文件`)
    }
    setOutputFormat('docx')
    if (!outputDirTouched && root) {
      setOutputDir(joinLocalPath(root, '脱敏后文件'))
    }
    setNotice(skippedCount > 0
      ? { tone: 'info', text: `已导入 ${nextFiles.length} 个文件，跳过 ${skippedCount} 个不支持或已生成的脱敏文件。` }
      : null)
    // 允许重复选择同一文件夹
    event.target.value = ''
  }

  const onDropFile = useCallback((event: ReactDragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    setFolderRoot('')
    const dropped = Array.from(event.dataTransfer.files ?? [])
    addSelectedFiles(dropped)
  }, [addSelectedFiles])

  const onDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(true)
  }, [])

  const onDragLeave = useCallback((event: ReactDragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
  }, [])

  const clearFile = useCallback((): void => {
    setFiles([])
    setFolderRoot('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (folderInputRef.current) folderInputRef.current.value = ''
  }, [])

  const removeFile = useCallback((fileToRemove: File): void => {
    setFiles((current) =>
      current.filter((item) =>
        item.name !== fileToRemove.name ||
        item.size !== fileToRemove.size ||
        item.lastModified !== fileToRemove.lastModified
      )
    )
  }, [])

  const pickOutputDir = async (): Promise<void> => {
    if (typeof window.dsGui?.pickWorkspaceDirectory !== 'function') {
      setNotice({ tone: 'error', text: '目录选择器不可用。' })
      return
    }
    try {
      const picked = await window.dsGui.pickWorkspaceDirectory(outputDir || undefined)
      if (!picked.canceled && picked.path) {
        setOutputDirTouched(true)
        setOutputDir(picked.path)
      }
    } catch (error) {
      setNotice({ tone: 'error', text: formatWorkspacePickerError(error) })
    }
  }

  const submitTask = async (mode: SubmitMode): Promise<void> => {
    if (files.length === 0 && !inputText.trim()) {
      setNotice({ tone: 'error', text: '请先上传文件或输入待处理文本。' })
      return
    }
    setBusy(true)
    setNotice(null)
    progressDismissedRef.current = false
    setProgressDismissed(false)
    setProgressTaskId('')
      setSubmissionProgress({
        kind: 'running',
        step: 0,
        message: files.length > 0 ? '正在读取材料并创建任务…' : '正在创建任务…',
        percent: 3
      })
    try {
      await ensureServer()
      setSubmissionProgress({
        kind: 'running',
        step: 0,
        message: '正在提交到后台队列…',
        percent: 8
      })
      const filePayloads = files.length > 0
        ? await Promise.all(files.map((selected) => fileToPayload(selected)))
        : []
      const payload: DataComplianceSubmitPayload = {
        mode,
        documentName,
        inputText,
        reviewType: reviewType === 'code' ? 'code' : 'document',
        ...(filePayloads.length === 1 ? { file: filePayloads[0] } : {}),
        ...(filePayloads.length > 1 ? { files: filePayloads } : {})
      }
      if (mode === 'desensitize') {
        payload.redactionMode = redactionMode
        if (effectiveDesensitizeKind === 'material') {
          payload.outputDir = outputDir.trim() || workspaceRoot
          payload.outputFormat = outputFormat
        }
      }
      const submitted = await submitComplianceTask(payload)
      const nextTaskId = submitted.task_id ?? ''
      setTaskId(nextTaskId)
      selectHistoryTask(mode, nextTaskId)
      setProgressTaskId(nextTaskId)
      setSubmissionProgress(
        progressDismissedRef.current
          ? { kind: 'idle' }
          : {
              kind: 'running',
              step: 0,
              message: '任务已创建，等待 worker 启动…',
              percent: 10
            }
      )
      setResult(nextTaskId ? { task_id: nextTaskId, status: 'processing', document_name: documentName || files[0]?.name } : null)
      setNotice({ tone: 'success', text: `任务已提交：${nextTaskId}` })
      onSectionChange('results')
      refreshHistory().catch((error: unknown) => {
        console.error('[DataCompliancePanel] refreshHistory after submit failed:', error)
      })
      if (nextTaskId) {
        loadResult(nextTaskId, { quiet: true }).catch((error: unknown) => {
          console.error('[DataCompliancePanel] loadResult after submit failed:', error)
        })
      }
    } catch (error) {
      setProgressTaskId('')
      setSubmissionProgress({ kind: 'idle' })
      setNotice({
        tone: 'error',
        text: error instanceof Error ? `提交失败：${error.message}` : '提交失败。'
      })
    } finally {
      setBusy(false)
    }
  }

  const openLocalPath = useCallback(async (targetPath: string): Promise<boolean> => {
    const normalizedPath = targetPath.trim()
    if (!normalizedPath) {
      setNotice({ tone: 'error', text: '没有可打开的输出目录。' })
      return false
    }
    if (typeof window.dsGui?.openLocalPath !== 'function') {
      setNotice({ tone: 'error', text: '当前环境不支持打开本地目录。' })
      return false
    }
    const opened = await window.dsGui.openLocalPath(normalizedPath)
    if (!opened.ok) {
      setNotice({ tone: 'error', text: opened.message ? `打开目录失败：${opened.message}` : '打开目录失败。' })
      return false
    }
    return true
  }, [])

  const downloadComplianceFile = async (taskId: string, fileKey: string): Promise<void> => {
    if (typeof window.dsGui?.downloadDataComplianceFile !== 'function') {
      setNotice({ tone: 'error', text: '当前环境不支持文件下载。' })
      return
    }
    try {
      const result = await window.dsGui.downloadDataComplianceFile(taskId, fileKey)
      if (!result.ok) {
        throw new Error(result.message || '下载失败')
      }
      const bytes = Uint8Array.from(atob(result.dataBase64), (char) => char.charCodeAt(0))
      const blob = new Blob([bytes], { type: result.contentType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? `下载失败：${error.message}` : '下载失败。'
      })
    }
  }

  const reportTaskId = result?.task_id ?? selectedTaskId
  const isDesensitizeResult = result?.product_type === 'desensitize'

  const renderSubmitForm = (mode: SubmitMode): ReactElement => {
    const submitTitle = mode === 'review'
      ? '提交审查材料'
      : effectiveDesensitizeKind === 'material'
        ? '提交材料脱敏'
        : '提交数据脱敏'
    const namePlaceholder = mode === 'review'
      ? '例如：隐私政策合规审查'
      : effectiveDesensitizeKind === 'material'
        ? '例如：合同材料脱敏'
        : '例如：客户数据脱敏'
    const textPlaceholder = mode === 'review'
      ? '粘贴待审查的制度文本、隐私政策或代码片段...'
      : effectiveDesensitizeKind === 'material'
        ? '粘贴待脱敏的合同、证据材料或业务文档...'
        : '粘贴待脱敏的个人信息、业务数据或结构化文本...'
    const outputFormatOptions = inferOutputFormats()

    return (
      <section className="rounded-[16px] border border-ds-border bg-ds-card p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-ds-ink">
            {submitTitle}
          </h2>
          <p className="mt-1 text-[12.5px] text-ds-muted">支持批量文件或文本输入，提交后自动追踪结果。</p>
        </div>
        {mode === 'review' ? (
          <AstryxSegmentedControl
            value={reviewType}
            items={[
              {
                value: 'document',
                label: '文档审查',
                icon: <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
              },
              {
                value: 'code',
                label: '代码审查',
                icon: <FileCode2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              }
            ]}
            onChange={setReviewType}
            ariaLabel="文档审查 / 代码审查"
            className="flex rounded-[10px] border border-ds-border-muted bg-ds-subtle p-1"
            buttonClassName="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-medium"
            indicatorClassName="rounded-[8px] bg-ds-card shadow-sm"
            activeClassName="text-[var(--ds-accent)]"
            inactiveClassName="text-ds-muted hover:text-ds-ink"
          />
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        {mode === 'desensitize' ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] font-medium text-ds-muted">脱敏模式</span>
              <span className="text-[11.5px] text-ds-faint">提交前选择，处理过程全自动完成</span>
            </div>
            <div className="mt-1.5 grid gap-2.5 md:grid-cols-2">
              <button
                type="button"
                aria-pressed={redactionMode === 'standard'}
                onClick={() => setRedactionMode('standard')}
                disabled={busy || statusBusy}
                className={`rounded-[12px] border p-3 text-left transition ${
                  redactionMode === 'standard'
                    ? 'border-[var(--ds-accent)] bg-[color-mix(in_srgb,var(--ds-accent)_7%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--ds-accent)_20%,transparent)]'
                    : 'border-ds-border bg-ds-card hover:bg-ds-subtle'
                } disabled:opacity-55`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] ${
                    redactionMode === 'standard' ? 'bg-[var(--ds-accent)] text-white' : 'bg-ds-subtle text-ds-muted'
                  }`}>
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ds-ink">标准脱敏</div>
                    <p className="mt-1 text-[11.5px] leading-5 text-ds-muted">
                      规则识别为主；必要时仅对预脱敏、裁剪后的局部片段作受限智能判断，不读取完整原文。
                    </p>
                  </div>
                </div>
              </button>
              <button
                type="button"
                aria-pressed={redactionMode === 'agent_enhanced'}
                onClick={() => setRedactionMode('agent_enhanced')}
                disabled={busy || statusBusy}
                className={`rounded-[12px] border p-3 text-left transition ${
                  redactionMode === 'agent_enhanced'
                    ? 'border-[var(--ds-accent)] bg-[color-mix(in_srgb,var(--ds-accent)_7%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--ds-accent)_20%,transparent)]'
                    : 'border-ds-border bg-ds-card hover:bg-ds-subtle'
                } disabled:opacity-55`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] ${
                    redactionMode === 'agent_enhanced' ? 'bg-[var(--ds-accent)] text-white' : 'bg-ds-subtle text-ds-muted'
                  }`}>
                    <Sparkles className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ds-ink">Agent 增强</div>
                    <p className="mt-1 text-[11.5px] leading-5 text-ds-muted">
                      深度理解主体、别名和上下文，以识别效果与全文一致性为优先。
                    </p>
                  </div>
                </div>
              </button>
            </div>
            {redactionMode === 'agent_enhanced' ? (
              <div className="mt-2 flex items-start gap-2 rounded-[10px] border border-amber-500/25 bg-amber-500/8 px-3 py-2 text-[11.5px] leading-5 text-amber-800 dark:text-amber-200">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                <span>Agent 将完整读取材料并深度参与脱敏；模型可能会获取、阅读文件全部内容。</span>
              </div>
            ) : null}
          </div>
        ) : null}
        <label className="block">
          <span className="text-[12px] font-medium text-ds-muted">材料名称</span>
          <input
            value={documentName}
            onChange={(event) => setDocumentName(event.target.value)}
            placeholder={namePlaceholder}
            className="mt-1.5 w-full rounded-[12px] border border-ds-border bg-ds-card px-3 py-2 text-[13.5px] text-ds-ink outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <div className="block">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium text-ds-muted">上传文件</span>
            {mode === 'desensitize' && effectiveDesensitizeKind === 'material' ? (
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                disabled={busy || statusBusy || installProgress.kind === 'installing'}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-ds-border-muted bg-ds-subtle px-2.5 py-1.5 text-[12px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-55"
              >
                <Folder className="h-3.5 w-3.5" strokeWidth={1.8} />
                选择文件夹
              </button>
            ) : null}
          </div>
          <input
            ref={folderInputRef}
            type="file"
            multiple
            onChange={onPickFolder}
            className="hidden"
          />
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDropFile}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-1.5 cursor-pointer rounded-[12px] border border-dashed border-ds-border bg-ds-card px-4 py-4 transition ${
              dragActive
                ? 'border-[var(--ds-accent)] bg-[color-mix(in_srgb,var(--ds-accent)_8%,transparent)]'
                : 'hover:border-ds-border-muted hover:bg-ds-subtle'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onClick={(event) => event.stopPropagation()}
              onChange={onPickFile}
              className="hidden"
            />
            {files.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 text-[13px] font-medium text-ds-ink" title={folderRoot || undefined}>
                    {folderRoot
                      ? `已选择文件夹「${localPathBasename(folderRoot)}」 · ${files.length} 个文件`
                      : `已选择 ${files.length} 个文件`}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      clearFile()
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border border-ds-border-muted bg-ds-subtle px-2.5 py-1.5 text-[12px] text-ds-muted transition hover:bg-red-500/10 hover:text-red-600"
                    title="清空文件"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                    清空
                  </button>
                </div>
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {files.map((selected) => (
                    <div key={`${selected.name}:${selected.size}:${selected.lastModified}`} className="flex items-center gap-3 rounded-[10px] border border-ds-border-muted bg-ds-subtle px-3 py-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-ds-card">
                        <FileTypeIcon fileName={selected.name} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-ds-ink" title={selected.name}>
                          {selected.name}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-ds-muted">
                          <span className={`inline-flex items-center rounded-[6px] border px-2 py-0.5 text-[11px] font-semibold ${fileTypeBadgeClass(fileTypeLabelForFile(selected.name))}`}>
                            {fileTypeLabelForFile(selected.name)}
                          </span>
                          <span>{(selected.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          removeFile(selected)
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ds-faint transition hover:bg-red-500/10 hover:text-red-600"
                        title="移除文件"
                      >
                        <X className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-[11.5px] text-ds-faint">继续点击或拖拽可追加文件。</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ds-subtle text-ds-muted">
                  <Upload className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div className="text-[13px] font-medium text-ds-ink">拖拽文件到此处</div>
                <div className="text-[12px] text-ds-muted">或点击选择文件，可一次选择多个</div>
                {mode === 'desensitize' && effectiveDesensitizeKind === 'material' ? (
                  <div className="text-[11.5px] text-ds-faint">也可使用右上角“选择文件夹”一次导入整批材料。</div>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <label className="block">
          <span className="text-[12px] font-medium text-ds-muted">直接输入</span>
          <textarea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            rows={9}
            placeholder={textPlaceholder}
            className="mt-1.5 w-full resize-none rounded-[14px] border border-ds-border bg-ds-card px-3 py-2 text-[13.5px] leading-6 text-ds-ink outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
          />
        </label>
        {mode === 'desensitize' && effectiveDesensitizeKind === 'material' ? (
          <>
            <label className="block">
              <span className="text-[12px] font-medium text-ds-muted">输出格式</span>
              <select
                value={outputFormat}
                onChange={(event) => setOutputFormat(event.target.value as 'md' | 'docx' | 'pdf' | 'txt')}
                disabled={busy || statusBusy || installProgress.kind === 'installing'}
                className="mt-1.5 w-full rounded-[12px] border border-ds-border bg-ds-card px-3 py-2 text-[13.5px] text-ds-ink outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/15 disabled:opacity-55"
              >
                {outputFormatOptions.map((fmt) => (
                  <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                ))}
              </select>
              <p className="mt-1.5 text-[11.5px] text-ds-faint">
                Word 文档保留原格式原位脱敏；仅扫描型 PDF/图片通过 OCR 提取后重排版。
              </p>
            </label>
            <label className="block">
              <span className="text-[12px] font-medium text-ds-muted">输出目录</span>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[12px] border border-ds-border bg-ds-card px-3 py-2">
                  <Folder className="h-4 w-4 shrink-0 text-ds-muted" strokeWidth={1.8} />
                  <span className="min-w-0 truncate text-[13.5px] text-ds-ink" title={outputDir}>
                    {outputDir || '未选择输出目录'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    pickOutputDir().catch((error: unknown) => {
                      console.error('[DataCompliancePanel] pickOutputDir failed:', error)
                    })
                  }}
                  disabled={busy || statusBusy || installProgress.kind === 'installing'}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[10px] border border-ds-border bg-ds-subtle px-3 py-2 text-[12.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-55"
                >
                  浏览
                </button>
              </div>
              <p className="mt-1.5 text-[11.5px] text-ds-faint">
                {folderRoot && !outputDirTouched
                  ? '选择文件夹时，默认在原文件夹内新建“脱敏后文件”目录，批量脱敏文件统一保存到其中。'
                  : '脱敏后的文件和主体映射表将保存到该目录。'}
              </p>
            </label>
          </>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ds-border-muted pt-4">
        <div className="flex items-center gap-2 text-[12px] text-ds-faint">
          {statusBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {serverHint}
        </div>
        <button
          type="button"
          disabled={busy || statusBusy || installProgress.kind === 'installing'}
          onClick={() => {
            submitTask(mode).catch((error: unknown) => {
              console.error('[DataCompliancePanel] submitTask failed:', error)
            })
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--ds-accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          {mode === 'review' ? '开始审查' : redactionMode === 'agent_enhanced' ? '开始增强脱敏' : '开始脱敏'}
        </button>
      </div>
      </section>
    )
  }

  return (
    <div className="flex h-full w-full min-h-0 flex-col bg-ds-main">
      <div className="border-b border-ds-border-muted bg-ds-main/85 px-8 py-5 backdrop-blur">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold text-ds-ink">{meta.title}</h1>
            <p className="mt-1 text-[13.5px] text-ds-muted">{meta.kicker}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              refreshHistory().catch((error: unknown) => {
                console.error('[DataCompliancePanel] refreshHistory failed:', error)
              })
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[12.5px] font-medium text-ds-muted shadow-sm transition hover:bg-ds-hover hover:text-ds-ink"
          >
            {historyBusy || statusBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            同步历史
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
        <div className="w-full space-y-4">
          {notice ? (
            <div className={`flex items-start gap-2 rounded-[14px] border px-4 py-3 text-[13px] ${
              notice.tone === 'error'
                ? 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-200'
                : notice.tone === 'success'
                  ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
                  : 'border-ds-border bg-ds-card text-ds-muted'
            }`}
            >
              {notice.tone === 'error'
                ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{notice.text}</span>
            </div>
          ) : null}

          <InstallProgressBanner
            state={installProgress}
            onRetry={() => {
              setInstallProgress({ kind: 'idle' })
              if (typeof window.dsGui?.installDataCompliance === 'function') {
                window.dsGui.installDataCompliance().catch((error: unknown) => {
                  console.error('[DataCompliancePanel] installDataCompliance failed:', error)
                })
              }
            }}
          />

          {resolvedActiveSection === 'review' ? renderSubmitForm(effectiveModeScope) : null}
          {resolvedActiveSection === 'desensitize' ? renderSubmitForm('desensitize') : null}

          {resolvedActiveSection === 'history' ? (
            <section className="flex min-h-[360px] items-center justify-center rounded-[16px] border border-ds-border bg-ds-card p-8 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] border border-ds-border bg-ds-subtle text-ds-muted">
                  <History className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <h2 className="mt-4 text-[16px] font-semibold text-ds-ink">
                  {modeScope === 'desensitize' ? '从左侧选择脱敏记录' : '从左侧选择历史任务'}
                </h2>
                <p className="mt-2 text-[13px] leading-6 text-ds-muted">
                  历史任务已移到左侧侧边栏。展开列表并点击具体任务后，结果会在这里按需加载。
                </p>
              </div>
            </section>
          ) : null}

          {resolvedActiveSection === 'results' ? (
            <section className="rounded-[16px] border border-ds-border bg-ds-card p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-semibold text-ds-ink">
                    {sharedSelectedTaskId ? '任务结果' : '结果查询'}
                  </h2>
                  <p className="mt-1 text-[12.5px] text-ds-muted">
                    {sharedSelectedTaskId
                      ? '仅加载当前选中任务的结构化结果。'
                      : '输入任务编号，读取结构化报告。'}
                  </p>
                </div>
                {!sharedSelectedTaskId ? (
                <div className="flex min-w-[280px] max-w-md flex-1 items-center gap-2">
                  <input
                    value={taskId}
                    onChange={(event) => setTaskId(event.target.value)}
                    placeholder="任务编号"
                    className="min-w-0 flex-1 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[13px] text-ds-ink outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
                  />
                  <button
                    type="button"
                    disabled={resultBusy}
                    onClick={() => {
                      loadResult().catch((error: unknown) => {
                        console.error('[DataCompliancePanel] loadResult failed:', error)
                      })
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--ds-accent)] px-4 py-2 text-[13px] font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {resultBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
                    查询
                  </button>
                </div>
                ) : null}
              </div>

              {result ? (
                <div className="mt-5 space-y-4">
                  <div className="rounded-[14px] border border-ds-border-muted bg-ds-subtle p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[15px] font-semibold text-ds-ink">{result.document_name || result.task_id || selectedTaskId}</span>
                          <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${statusTone(result.status)}`}>
                            {labelStatus(result.status, result.product_type === 'desensitize')}
                          </span>
                        </div>
                        <p className="mt-2 text-[13px] leading-6 text-ds-muted">{resultSummary}</p>
                        {isDesensitizeResult && result.output_dir ? (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-[12px] text-ds-faint">输出目录：</span>
                            <span className="min-w-0 truncate text-[12px] text-ds-muted" title={result.output_dir}>
                              {result.output_dir}
                            </span>
                            <button
                              type="button"
                              onClick={() => { if (result.output_dir) void openLocalPath(result.output_dir) }}
                              className="inline-flex items-center gap-1 rounded-full border border-ds-border bg-ds-card px-2 py-1 text-[11.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink"
                            >
                              <Folder className="h-3 w-3" strokeWidth={1.8} />
                              打开文件夹
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div data-control-hover-root className="flex shrink-0 flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={!reportTaskId}
                          onClick={() => { if (reportTaskId) void downloadComplianceFile(reportTaskId, isDesensitizeResult ? 'desensitization_report' : 'report') }}
                          className="inline-flex items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[12.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                        >
                          <Download className="h-4 w-4" />
                          下载报告
                        </button>
                        {!isDesensitizeResult ? (
                          <button
                            type="button"
                            disabled={!reportTaskId}
                            onClick={() => { if (reportTaskId) void downloadComplianceFile(reportTaskId, 'report_md') }}
                            className="inline-flex items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[12.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                          >
                            <Download className="h-4 w-4" />
                            Markdown
                          </button>
                        ) : null}
                        {isDesensitizeResult ? (
                          <>
                            <button
                              type="button"
                              disabled={!reportTaskId}
                              onClick={() => { if (reportTaskId) void downloadComplianceFile(reportTaskId, 'desensitized_output') }}
                              className="inline-flex items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[12.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                            >
                              <Download className="h-4 w-4" />
                              下载脱敏文件
                            </button>
                            <button
                              type="button"
                              disabled={!reportTaskId}
                              onClick={() => { if (reportTaskId) void downloadComplianceFile(reportTaskId, 'subject_mapping_md') }}
                              className="inline-flex items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[12.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                            >
                              <Download className="h-4 w-4" />
                              下载主体映射表
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={!reportTaskId}
                              onClick={() => { if (reportTaskId) void downloadComplianceFile(reportTaskId, 'remediation') }}
                              className="inline-flex items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[12.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                            >
                              <Download className="h-4 w-4" />
                              下载整改包
                            </button>
                            {result?.report?.document_type === 'source_code' ? (
                              <button
                                type="button"
                                disabled={!reportTaskId}
                                onClick={() => { if (reportTaskId) void downloadComplianceFile(reportTaskId, 'code_suggestions') }}
                                className="inline-flex items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-2 text-[12.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                              >
                                <Download className="h-4 w-4" />
                                代码修改建议
                              </button>
                            ) : null}
                          </>
                        )}
                      </div>
                  </div>
                  </div>
                  <EmbeddedComplianceReport result={result} resultSummary={resultSummary} />
                </div>
              ) : resultBusy ? (
                <div className="mt-5 flex min-h-[240px] items-center justify-center rounded-[14px] border border-ds-border-muted bg-ds-subtle">
                  <div className="flex items-center gap-2 text-[13px] text-ds-muted">
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                    正在读取当前任务结果…
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[14px] border border-ds-border-muted bg-ds-subtle px-4 py-8 text-center text-[13px] text-ds-faint">
                  选择历史任务或输入任务编号后，这里会显示结果摘要。
                </div>
              )}
            </section>
          ) : null}
        </div>
      </div>
      <ProgressModal state={visibleProgress} onDismiss={dismissProgress} modeScope={effectiveModeScope} />
    </div>
  )
}

export function DesensitizationPanel({
  activeSection,
  onSectionChange
}: {
  activeSection: DesensitizeSection
  onSectionChange: (section: DesensitizeSection) => void
}): ReactElement {
  const panelSection: DataComplianceSection = activeSection === 'history'
    ? 'history'
    : activeSection === 'results'
      ? 'results'
      : 'review'

  return (
    <DataCompliancePanel
      activeSection={panelSection}
      onSectionChange={(section) => {
        if (section === 'history') onSectionChange('history')
        if (section === 'results') onSectionChange('results')
      }}
      modeScope="desensitize"
      desensitizeKind="material"
    />
  )
}
