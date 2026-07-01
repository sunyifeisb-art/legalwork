import type { ChangeEvent, DragEvent as ReactDragEvent, MouseEvent, ReactElement } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  AudioLines,
  CheckCircle2,
  Download,
  Eye,
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

export type DataComplianceSection = 'review' | 'desensitize' | 'history' | 'results'
export type DesensitizeSection = 'material' | 'history'

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
type Notice = { tone: 'info' | 'error' | 'success'; text: string }

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

function inferOutputFormats(file: File | null): Array<{ value: 'md' | 'docx' | 'txt'; label: string }> {
  if (!file) return []
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  if (ext === 'docx' || ext === 'doc') {
    return [
      { value: 'docx', label: 'Word 文档 (.docx)' },
      { value: 'md', label: 'Markdown (.md)' }
    ]
  }
  if (ext === 'pdf') {
    return [
      { value: 'txt', label: '纯文本 (.txt)' },
      { value: 'md', label: 'Markdown (.md)' },
      { value: 'docx', label: 'Word 文档 (.docx)' }
    ]
  }
  return []
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

const LARGE_FILE_THRESHOLD_BYTES = 20 * 1024 * 1024

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

async function fileToPayload(file: File): Promise<DataComplianceSubmitPayload['file']> {
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
  const form = new FormData()
  if (payload.file) {
    const bytes = Uint8Array.from(atob(payload.file.dataBase64), (char) => char.charCodeAt(0))
    form.set('file', new Blob([bytes], { type: payload.file.type || 'application/octet-stream' }), payload.file.name)
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
    setState({ kind: 'running', step: 0, message: '任务已提交，等待开始处理…', percent: 0 })

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
        const percent = typeof progress?.percent === 'number' ? progress.percent : Math.min(step * 9, 95)
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
  if (state.kind === 'completed' || state.kind === 'failed') return null
  const running = state.kind === 'running'
  const isDesensitize = modeScope === 'desensitize'
  const title = isDesensitize ? '正在脱敏中' : '正在审查中'
  const subtitle = isDesensitize ? '请稍候，系统正在处理脱敏任务' : '请稍候，系统正在分析文档合规性'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss() }}>
      <div className="relative w-full max-w-md rounded-[18px] border border-ds-border bg-ds-card p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={onDismiss}
          title="后台运行"
          aria-label="后台运行"
          className="absolute right-4 top-4 inline-flex h-8 items-center gap-1.5 rounded-full border border-ds-border-muted bg-ds-subtle px-3 text-[12px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink"
        >
          <Minimize2 className="h-3.5 w-3.5" strokeWidth={1.9} />
          后台运行
        </button>
        <div className="mb-4 flex items-center gap-3 pr-28">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ds-accent-soft)] text-[var(--ds-accent)]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-ds-ink">{title}</h3>
            <p className="text-[12px] text-ds-muted">{subtitle}</p>
          </div>
        </div>
        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-ds-subtle">
          <div
            className="h-full rounded-full bg-[var(--ds-accent)] transition-all duration-500 ease-out"
            style={{ width: `${running ? state.percent : 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[12px] text-ds-muted">
          <span className="truncate pr-4">{running ? state.message : '处理中…'}</span>
          <span className="shrink-0">{running ? `${state.percent}%` : ''}</span>
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
        <Loader2 className="h-5 w-5 animate-spin text-[var(--ds-accent)]" />
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
      <StatCards stats={asRecord(summary?.entity_counts)} />
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
                  <span className="text-[13px] font-semibold text-ds-ink">{firstText(finding, ['entity_type']) || `命中 ${index + 1}`}</span>
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

export function DataComplianceSidebarNav({
  activeSection,
  onSectionChange
}: {
  activeSection: DataComplianceSection
  onSectionChange: (section: DataComplianceSection) => void
}): ReactElement {
  const items: Array<{ section: DataComplianceSection; label: string; icon: ReactElement }> = [
    { section: 'review', label: '合规审查', icon: <ShieldCheck className="h-4 w-4" strokeWidth={1.8} /> },
    { section: 'desensitize', label: '数据脱敏', icon: <ScanEye className="h-4 w-4" strokeWidth={1.8} /> },
    { section: 'history', label: '历史任务', icon: <History className="h-4 w-4" strokeWidth={1.8} /> },
    { section: 'results', label: '结果中心', icon: <FileSearch className="h-4 w-4" strokeWidth={1.8} /> }
  ]

  return (
    <div className="ds-no-drag flex min-h-0 flex-1 flex-col px-2 pt-1">
      <div className="mb-2 px-1">
        <div className="text-[13px] font-semibold text-ds-muted">数据合规</div>
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const active = activeSection === item.section
          return (
            <button
              key={item.section}
              type="button"
              onClick={() => onSectionChange(item.section)}
              className={`flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-left transition ${
                active
                  ? 'bg-[var(--ds-accent-soft)] text-[var(--ds-accent)] shadow-[inset_0_0_0_1px_rgba(0,136,255,0.14)] text-[13px] font-semibold'
                  : 'text-ds-muted hover:bg-ds-hover hover:text-ds-ink text-[13px] font-medium'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
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
  const items: Array<{ section: DesensitizeSection; label: string; icon: ReactElement }> = [
    { section: 'material', label: '材料脱敏', icon: <FileText className="h-4 w-4" strokeWidth={1.8} /> },
    { section: 'history', label: '脱敏记录', icon: <History className="h-4 w-4" strokeWidth={1.8} /> }
  ]

  return (
    <div className="ds-no-drag flex min-h-0 flex-1 flex-col px-2 pt-1">
      <div className="mb-2 px-1">
        <div className="text-[13px] font-semibold text-ds-muted">脱敏</div>
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const active = activeSection === item.section
          return (
            <button
              key={item.section}
              type="button"
              onClick={() => onSectionChange(item.section)}
              className={`flex w-full items-center gap-2 rounded-[10px] px-2.5 py-2 text-left transition ${
                active
                  ? 'bg-[var(--ds-accent-soft)] text-[var(--ds-accent)] shadow-[inset_0_0_0_1px_rgba(0,136,255,0.14)] text-[13px] font-semibold'
                  : 'text-ds-muted hover:bg-ds-hover hover:text-ds-ink text-[13px] font-medium'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
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
  const workspaceRoot = useChatStore((s) => s.workspaceRoot)
  const [reviewType, setReviewType] = useState<ReviewType>('document')
  const [documentName, setDocumentName] = useState('')
  const [inputText, setInputText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [taskId, setTaskId] = useState('')
  const [history, setHistory] = useState<ComplianceTask[]>([])
  const [historyBusy, setHistoryBusy] = useState(false)
  const [resultBusy, setResultBusy] = useState(false)
  const [result, setResult] = useState<ComplianceResult | null>(null)
  const [progressTaskId, setProgressTaskId] = useState('')
  const [submissionProgress, setSubmissionProgress] = useState<ProgressState>({ kind: 'idle' })
  const [serverStatus, setServerStatus] = useState<DataComplianceStatus | null>({
    ok: false, running: false, installing: false,
    baseUrl: '', message: '检测中...'
  })
  const [statusBusy, setStatusBusy] = useState(false)
  const [outputDir, setOutputDir] = useState(workspaceRoot || '')
  const [outputFormat, setOutputFormat] = useState<'md' | 'docx' | 'txt' | ''>('')
  const [installProgress, setInstallProgress] = useState<InstallProgressState>({ kind: 'idle' })

  const ensureServer = useCallback(async (): Promise<DataComplianceStatus | null> => {
    if (typeof window.dsGui?.getDataComplianceStatus !== 'function') {
      return null
    }
    setStatusBusy(true)
    try {
      const status = await window.dsGui.getDataComplianceStatus()
      setServerStatus(status)
      if (!status.ok) {
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
    if (workspaceRoot && !outputDir.trim()) {
      setOutputDir(workspaceRoot)
    }
  }, [workspaceRoot, outputDir])

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
    setHistoryBusy(true)
    try {
      await ensureServer()
      const payload = await requestJson<{ items?: ComplianceTask[] }>('/data-compliance/tasks')
      const items = Array.isArray(payload.items) ? payload.items : []
      setHistory(items.filter(modeScope === 'desensitize' ? isDesensitizeTask : isReviewTask))
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? `历史读取失败：${error.message}` : '历史读取失败。'
      })
    } finally {
      setHistoryBusy(false)
    }
  }, [ensureServer, modeScope])

  const loadResult = useCallback(async (id = selectedTaskId, options: { quiet?: boolean } = {}): Promise<ComplianceResult | null> => {
    const targetId = id.trim()
    if (!targetId) {
      setNotice({ tone: 'error', text: '请输入任务编号。' })
      return null
    }
    setResultBusy(true)
    if (!options.quiet) setNotice(null)
    try {
      await ensureServer()
      const payload = await requestJson<ComplianceResult>(`/data-compliance/tasks/${encodeURIComponent(targetId)}`)
      if (payload.error) throw new Error(payload.error)
      setTaskId(targetId)
      setResult(payload)
      const status = (payload.status ?? '').toLowerCase()
      if (status === 'pending' || status === 'running' || status === 'processing') {
        setProgressTaskId(targetId)
      } else {
        setProgressTaskId((current) => (current === targetId ? '' : current))
      }
      onSectionChange('results')
      return payload
    } catch (error) {
      if (!options.quiet) {
        setNotice({
          tone: 'error',
          text: error instanceof Error ? `结果读取失败：${error.message}` : '结果读取失败。'
        })
      }
      return null
    } finally {
      setResultBusy(false)
    }
  }, [ensureServer, onSectionChange, selectedTaskId])

  useEffect(() => {
    void refreshHistory().catch((error: unknown) => {
      console.error('[DataCompliancePanel] refreshHistory failed:', error)
    })
  }, [refreshHistory, modeScope])

  // Dismiss progress modal when result loads as completed/failed/error
  useEffect(() => {
    const status = (result?.status ?? '').toLowerCase()
    if (status === 'completed' || status === 'failed' || status === 'error') {
      setProgressDismissed(true)
      setProgressTaskId('')
    }
  }, [result?.status])

  const setSelectedFile = useCallback((nextFile: File | null): void => {
    setFile(nextFile)
    if (nextFile && !documentName.trim()) {
      setDocumentName(nextFile.name.replace(/\.[^.]+$/, ''))
    }
    const formats = inferOutputFormats(nextFile)
    setOutputFormat(formats[0]?.value ?? '')
  }, [documentName])

  const onPickFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
    // 允许重复选择同一文件
    if (event.target) event.target.value = ''
  }

  const onDropFile = useCallback((event: ReactDragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    const dropped = event.dataTransfer.files?.[0] ?? null
    if (dropped) setSelectedFile(dropped)
  }, [setSelectedFile])

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
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [setSelectedFile])

  const pickOutputDir = async (): Promise<void> => {
    if (typeof window.dsGui?.pickWorkspaceDirectory !== 'function') {
      setNotice({ tone: 'error', text: '目录选择器不可用。' })
      return
    }
    try {
      const picked = await window.dsGui.pickWorkspaceDirectory(outputDir || undefined)
      if (!picked.canceled && picked.path) {
        setOutputDir(picked.path)
      }
    } catch (error) {
      setNotice({ tone: 'error', text: formatWorkspacePickerError(error) })
    }
  }

  const submitTask = async (mode: SubmitMode): Promise<void> => {
    if (!file && !inputText.trim()) {
      setNotice({ tone: 'error', text: '请先上传文件或输入待处理文本。' })
      return
    }
    if (file && file.size > LARGE_FILE_THRESHOLD_BYTES) {
      setNotice({
        tone: 'error',
        text: `文件过大（${(file.size / 1024 / 1024).toFixed(1)} MB），建议先压缩、拆分或仅粘贴关键文本，以免前端卡死。`
      })
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
      message: file ? '正在读取材料并创建任务…' : '正在创建任务…',
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
      const filePayload = file ? await fileToPayload(file) : undefined
      const payload: DataComplianceSubmitPayload = {
        mode,
        documentName,
        inputText,
        reviewType: reviewType === 'code' ? 'code' : 'document',
        file: filePayload
      }
      if (mode === 'desensitize' && effectiveDesensitizeKind === 'material') {
        payload.outputDir = outputDir.trim() || workspaceRoot
        if (outputFormat.trim()) {
          payload.outputFormat = outputFormat.trim() as 'md' | 'docx' | 'txt'
        }
      }
      const submitted = await submitComplianceTask(payload)
      const nextTaskId = submitted.task_id ?? ''
      setTaskId(nextTaskId)
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
      setResult(nextTaskId ? { task_id: nextTaskId, status: 'processing', document_name: documentName || file?.name } : null)
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

  const deleteHistoryTask = async (id: string, event: MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.stopPropagation()
    if (!id) return
    try {
      await requestJson<{ ok?: boolean }>(`/data-compliance/tasks/${encodeURIComponent(id)}`, 'DELETE')
      setHistory((items) => items.filter((item) => taskIdOf(item) !== id))
      if (selectedTaskId === id) {
        setTaskId('')
        setResult(null)
      }
      setProgressTaskId((current) => (current === id ? '' : current))
    } catch (error) {
      setNotice({
        tone: 'error',
        text: error instanceof Error ? `删除失败：${error.message}` : '删除失败。'
      })
    }
  }

  const openExternalUrl = (url: string): void => {
    if (typeof window.dsGui?.openExternal === 'function') {
      void window.dsGui.openExternal(url).catch(() => window.open(url, '_blank', 'noreferrer'))
      return
    }
    window.open(url, '_blank', 'noreferrer')
  }

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

    return (
      <section className="rounded-[16px] border border-ds-border bg-ds-card p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold text-ds-ink">
            {submitTitle}
          </h2>
          <p className="mt-1 text-[12.5px] text-ds-muted">支持文件或文本输入，提交后自动追踪结果。</p>
        </div>
        {mode === 'review' ? (
          <div className="flex rounded-[10px] border border-ds-border-muted bg-ds-subtle p-1">
            {(['document', 'code'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setReviewType(type)}
                className={`rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition ${
                  reviewType === type
                    ? 'bg-ds-card text-[var(--ds-accent)] shadow-sm'
                    : 'text-ds-muted hover:text-ds-ink'
                }`}
              >
                {type === 'document' ? '文档审查' : '代码审查'}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-[12px] font-medium text-ds-muted">材料名称</span>
          <input
            value={documentName}
            onChange={(event) => setDocumentName(event.target.value)}
            placeholder={namePlaceholder}
            className="mt-1.5 w-full rounded-[12px] border border-ds-border bg-ds-card px-3 py-2 text-[13.5px] text-ds-ink outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-ds-muted">上传文件</span>
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
              onChange={onPickFile}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-ds-subtle">
                  <FileTypeIcon fileName={file.name} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-medium text-ds-ink" title={file.name}>
                    {file.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-ds-muted">
                    <span className={`inline-flex items-center rounded-[6px] border px-2 py-0.5 text-[11px] font-semibold ${fileTypeBadgeClass(fileTypeLabelForFile(file.name))}`}>
                      {fileTypeLabelForFile(file.name)}
                    </span>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    clearFile()
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ds-faint transition hover:bg-red-500/10 hover:text-red-600"
                  title="移除文件"
                >
                  <X className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-2 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ds-subtle text-ds-muted">
                  <Upload className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div className="text-[13px] font-medium text-ds-ink">拖拽文件到此处</div>
                <div className="text-[12px] text-ds-muted">或点击选择文件</div>
              </div>
            )}
          </div>
        </label>
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
                onChange={(event) => setOutputFormat(event.target.value as 'md' | 'docx' | 'txt' | '')}
                disabled={busy || statusBusy || installProgress.kind === 'installing' || inferOutputFormats(file).length === 0}
                className="mt-1.5 w-full rounded-[12px] border border-ds-border bg-ds-card px-3 py-2 text-[13.5px] text-ds-ink outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/15 disabled:opacity-55"
              >
                {inferOutputFormats(file).length === 0 ? (
                  <option value="">按原格式输出</option>
                ) : (
                  inferOutputFormats(file).map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                  ))
                )}
              </select>
              <p className="mt-1.5 text-[11.5px] text-ds-faint">
                Word 与 PDF 材料可选择输出为 Markdown、Word 或 Text。
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
                脱敏后的文件和主体映射表将保存到该目录。
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
          {mode === 'review' ? '开始审查' : '开始脱敏'}
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
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--ds-accent)]">
              {modeScope === 'desensitize'
                ? <Eye className="h-4 w-4" strokeWidth={1.8} />
                : <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />}
              {modeScope === 'desensitize' ? 'DESENSITIZE' : '数据合规'}
            </div>
            <h1 className="mt-2 text-[24px] font-semibold text-ds-ink">{meta.title}</h1>
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
            <section className="rounded-[16px] border border-ds-border bg-ds-card p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[16px] font-semibold text-ds-ink">历史任务</h2>
                <button
                  type="button"
                  onClick={() => {
                    refreshHistory().catch((error: unknown) => {
                      console.error('[DataCompliancePanel] refreshHistory failed:', error)
                    })
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 py-1.5 text-[12px] font-medium text-ds-muted hover:bg-ds-hover hover:text-ds-ink"
                >
                  {historyBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                  刷新
                </button>
              </div>
              <div className="mt-4 divide-y divide-ds-border-muted overflow-hidden rounded-[12px] border border-ds-border-muted">
                {history.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[13px] text-ds-faint">暂无历史任务。</div>
                ) : history.map((task) => {
                  const id = taskIdOf(task)
                  return (
                    <button
                      key={id || task.document_name}
                      type="button"
                      onClick={() => {
                        if (id) {
                          loadResult(id).catch((error: unknown) => {
                            console.error('[DataCompliancePanel] loadResult failed:', error)
                          })
                        }
                      }}
                      className="flex w-full items-center justify-between gap-3 bg-ds-card px-4 py-3 text-left transition hover:bg-ds-hover"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-[13.5px] font-medium text-ds-ink">{task.document_name || id || '未命名任务'}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11.5px] text-ds-faint">
                          <span>{id}</span>
                          {task.created_at ? <span>{new Date(task.created_at).toLocaleString()}</span> : null}
                          {task.review_type ? <span>{task.review_type}</span> : null}
                          {task.product_type ? <span>{task.product_type}</span> : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${statusTone(task.status)}`}>
                          {labelStatus(task.status, task.product_type === 'desensitize')}
                        </span>
                        {id ? (
                          <button
                            type="button"
                            onClick={(event) => void deleteHistoryTask(id, event)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ds-faint transition hover:bg-red-500/10 hover:text-red-600"
                            aria-label="删除历史任务"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          ) : null}

          {resolvedActiveSection === 'results' ? (
            <section className="rounded-[16px] border border-ds-border bg-ds-card p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-[16px] font-semibold text-ds-ink">结果查询</h2>
                  <p className="mt-1 text-[12.5px] text-ds-muted">输入任务编号，读取结构化报告。</p>
                </div>
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
                              onClick={() =>
                                openExternalUrl(
                                  `file://${encodeURIComponent(result.output_dir ?? '')}`
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-full border border-ds-border bg-ds-card px-2 py-1 text-[11.5px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink"
                            >
                              <Folder className="h-3 w-3" strokeWidth={1.8} />
                              打开文件夹
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
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
              ) : (
                <div className="mt-5 rounded-[14px] border border-ds-border-muted bg-ds-subtle px-4 py-8 text-center text-[13px] text-ds-faint">
                  选择历史任务或输入任务编号后，这里会显示结果摘要。
                </div>
              )}
            </section>
          ) : null}
        </div>
      </div>
      <ProgressModal state={visibleProgress} onDismiss={dismissProgress} modeScope={modeScope} />
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
  const panelSection: DataComplianceSection = activeSection === 'history' ? 'history' : 'review'

  return (
    <DataCompliancePanel
      activeSection={panelSection}
      onSectionChange={(section) => {
        if (section === 'history') onSectionChange('history')
      }}
      modeScope="desensitize"
      desensitizeKind="material"
    />
  )
}
