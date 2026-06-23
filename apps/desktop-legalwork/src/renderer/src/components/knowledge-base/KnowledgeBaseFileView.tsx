import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  AudioLines,
  ExternalLink,
  File,
  FileCode2,
  Loader2,
  Send,
  Trash2,
  X
} from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'
import {
  LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_PATH,
  LEGALWORK_KNOWLEDGE_READ_FILE_PATH,
  LEGALWORK_KNOWLEDGE_SEARCH_PATH,
  legalworkThreadTurnsPath,
  legalworkThreadTurnPath
} from '../../../../shared/legalwork-endpoints'
import { useChatStore } from '../../store/chat-store'
import { AnimatedWorkLogo } from '../chat/AnimatedWorkLogo'
import { ModelBrandIcon } from '../chat/ModelBrandIcon'
import { brandForModel } from '../../lib/model-brand'
import type { KnowledgeTreeNode } from './types'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

// ── Helpers (copied from KnowledgeBaseView to keep this file self-contained) ──

async function requestJson<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const result = await window.dsGui.runtimeRequest(
    path,
    method,
    body === undefined ? undefined : JSON.stringify(body)
  )
  if (!result.ok) throw new Error(result.body || `请求失败：${result.status}`)
  return JSON.parse(result.body) as T
}

/** Get the active workspace root from Electron app settings. */
async function getWorkspaceRoot(): Promise<string> {
  try {
    const settings = await window.dsGui.getSettings()
    if (settings?.workspaceRoot) return settings.workspaceRoot
  } catch {
    // fall through
  }
  return ''
}

function fileExtension(node: KnowledgeTreeNode): string {
  const raw = (node.extension ?? node.name.split('.').pop() ?? '').trim().toLowerCase()
  return raw.replace(/^\./, '').replace(/[^a-z0-9]/g, '')
}

type PreviewType = 'text' | 'pdf' | 'image' | 'audio' | 'document' | 'unsupported'

function previewType(node: KnowledgeTreeNode): PreviewType {
  const ext = fileExtension(node)
  if (ext === 'pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return 'audio'
  if (['txt', 'md', 'markdown', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'yml', 'html', 'xml'].includes(ext)) return 'text'
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) return 'document'
  return 'unsupported'
}

function mimeTypeForFile(node: KnowledgeTreeNode): string {
  const ext = fileExtension(node)
  const map: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    wav: 'audio/wav',
    aac: 'audio/aac',
    flac: 'audio/flac',
    ogg: 'audio/ogg'
  }
  return map[ext] || 'application/octet-stream'
}

function buildObjectUrl(node: KnowledgeTreeNode, base64Content: string): string {
  const byteString = atob(base64Content)
  const bytes = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i += 1) {
    bytes[i] = byteString.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: mimeTypeForFile(node) })
  return URL.createObjectURL(blob)
}

function formatBytes(bytes?: number): string {
  if (bytes === undefined) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`
}

function fileTypeLabel(node: KnowledgeTreeNode): string {
  if (node.kind === 'folder') return '文件夹'
  const ext = fileExtension(node)
  if (!ext) return '文件'
  if (ext === 'doc' || ext === 'docx') return 'WORD'
  if (ext === 'ppt' || ext === 'pptx') return 'PPT'
  if (ext === 'xls' || ext === 'xlsx') return 'EXCEL'
  if (ext === 'pdf') return 'PDF'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return '音频'
  if (['zip', 'rar', '7z'].includes(ext)) return '压缩包'
  return ext.toUpperCase()
}

// ── PDF Preview component ──

type PdfRenderedPage = {
  pageNumber: number
  width: number
  height: number
  dataUrl: string
}

const PDF_RENDER_TIMEOUT_MS = 20000

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error(message)), timeoutMs)
    promise.then(
      (value) => {
        window.clearTimeout(timeout)
        resolve(value)
      },
      (error: unknown) => {
        window.clearTimeout(timeout)
        reject(error)
      }
    )
  })
}

function PdfPreview({ base64Content, fileName }: { base64Content: string; fileName: string }): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<PdfRenderedPage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      setLoading(true)
      setError(null)
      try {
        const pdf = await withTimeout(
          pdfjsLib.getDocument({ data: base64ToBytes(base64Content), cMapUrl: undefined }).promise,
          PDF_RENDER_TIMEOUT_MS,
          'PDF 加载超时'
        )
        if (cancelled) return
        const rendered: PdfRenderedPage[] = []
        for (let i = 1; i <= pdf.numPages; i += 1) {
          if (cancelled) return
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1.5 })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          const context = canvas.getContext('2d')
          if (!context) throw new Error('无法创建 PDF 预览画布')
          await page.render({ canvas, canvasContext: context, viewport }).promise
          rendered.push({
            pageNumber: i,
            width: viewport.width,
            height: viewport.height,
            dataUrl: canvas.toDataURL('image/png')
          })
        }
        if (!cancelled) setPages(rendered)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'PDF 预览渲染失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [base64Content])

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-[13px] text-red-500">{error}</div>
    )
  }

  return (
    <div ref={containerRef} className="flex h-full flex-col items-center gap-4 overflow-auto p-4">
      {loading ? (
        <div className="flex items-center gap-2 py-12 text-[13px] text-[var(--ds-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          正在渲染 {fileName} …
        </div>
      ) : (
        pages.map((page) => (
          <div key={page.pageNumber} className="w-full max-w-[800px] overflow-hidden rounded-[8px] border border-ds-border shadow-sm">
            <div className="flex items-center justify-between bg-ds-card px-4 py-1.5 text-[11px] text-[var(--ds-muted)]">
              <span>第 {page.pageNumber} 页</span>
            </div>
            <img src={page.dataUrl} alt={`第 ${page.pageNumber} 页`} className="block w-full" />
          </div>
        ))
      )}
    </div>
  )
}

function base64ToBytes(base64Content: string): Uint8Array {
  const byteString = atob(base64Content)
  const bytes = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i += 1) {
    bytes[i] = byteString.charCodeAt(i)
  }
  return bytes
}

// ── Chat message types ──

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

type FileContent = {
  content: string
  encoding: 'utf8' | 'base64'
  objectUrl?: string
  type: PreviewType
}

// ── Document text extraction preview component ──

function DocumentPreview({ text, fileName }: { text: string; fileName: string }): ReactElement {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ds-border bg-ds-card px-4 py-2 text-[12px] text-[var(--ds-muted)]">
        文档文本预览 · {fileName}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {text ? (
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-[22px] text-[var(--ds-ink)]">
            {text}
          </pre>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[13px] text-[var(--ds-muted)]">
            <File className="h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <div>未能提取到可预览文本</div>
            <div className="text-[12px]">你可以通过右侧 AI 对话功能提问文件相关问题。</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Knowledge search result type ──

type KnowledgeHit = {
  documentId: string
  chunkId: string
  title: string
  path: string
  relativePath: string
  score: number
  snippet: string
  content?: string
}

// ── Main component ──

type Props = {
  node: KnowledgeTreeNode
  onBack: () => void
}

export function KnowledgeBaseFileView({ node, onBack }: Props): ReactElement {
  const [fileContent, setFileContent] = useState<FileContent | null>(null)
  const [fileLoading, setFileLoading] = useState(true)
  const [fileError, setFileError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load file content on mount
  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      setFileLoading(true)
      setFileError(null)
      try {
        const type = previewType(node)
        // For unsupported binary types, try to read as base64 and extract what we can
        if (type === 'unsupported') {
          // Try reading as base64 to at least show file info
          try {
            const data = await requestJson<{ path: string; content: string; encoding: 'utf8' | 'base64' }>(
              `${LEGALWORK_KNOWLEDGE_READ_FILE_PATH}?path=${encodeURIComponent(node.path)}&encoding=base64`
            )
            if (cancelled) return
            const objectUrl = buildObjectUrl(node, data.content)
            setFileContent({ content: data.content, encoding: 'base64', objectUrl, type: 'unsupported' })
          } catch {
            // If even binary read fails, just set empty content
            if (!cancelled) setFileContent({ content: '', encoding: 'utf8', type: 'unsupported' })
          }
          if (!cancelled) setFileLoading(false)
          return
        }
        if (type === 'document') {
          // Extract plain text from pdf/docx/xlsx via the runtime
          try {
            const data = await requestJson<{ path: string; text: string; extension: string }>(
              `${LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_PATH}?path=${encodeURIComponent(node.path)}`
            )
            if (cancelled) return
            setFileContent({ content: data.text, encoding: 'utf8', type: 'document' })
          } catch {
            if (!cancelled) setFileContent({ content: '', encoding: 'utf8', type: 'document' })
          }
          if (!cancelled) setFileLoading(false)
          return
        }
        const isBinary = type === 'pdf' || type === 'image' || type === 'audio'
        const data = await requestJson<{ path: string; content: string; encoding: 'utf8' | 'base64' }>(
          `${LEGALWORK_KNOWLEDGE_READ_FILE_PATH}?path=${encodeURIComponent(node.path)}${isBinary ? '&encoding=base64' : ''}`
        )
        if (cancelled) return
        let objectUrl: string | undefined
        if (isBinary && data.content) {
          try {
            objectUrl = buildObjectUrl(node, data.content)
          } catch {
            // buildObjectUrl can fail on invalid base64; for PDF the
            // PdfPreview component uses raw base64Content directly anyway
          }
        }
        setFileContent({ content: data.content, encoding: data.encoding, objectUrl, type })
      } catch (err) {
        if (!cancelled) setFileError(err instanceof Error ? err.message : '读取文件失败')
      } finally {
        if (!cancelled) setFileLoading(false)
      }
    }
    void load()
    return () => { cancelled = true }
  }, [node])

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (fileContent?.objectUrl) URL.revokeObjectURL(fileContent.objectUrl)
    }
  }, [fileContent])

  const openInSystemApp = useCallback(async (): Promise<void> => {
    try {
      const result = await window.dsGui.openKnowledgeFile(node.path)
      if (!result.ok) setChatError(result.message || '打开文件失败')
    } catch (err) {
      setChatError(err instanceof Error ? err.message : '打开文件失败')
    }
  }, [node.path])

  // ── AI Chat: RAG-based Q&A ──
  const composerModel = useChatStore((s) => s.composerModel)
  const composerModelGroups = useChatStore((s) => s.composerModelGroups)
  const modelBrand = brandForModel(composerModel, composerModelGroups)

  // Poll for turn completion
  const pollTurnCompletion = useCallback(async (threadId: string, turnId: string, maxPolls = 120): Promise<string> => {
    for (let i = 0; i < maxPolls; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const turnData = await requestJson<{
        id: string
        status: string
        items?: Array<{
          kind: string
          text?: string
          toolName?: string
          status?: string
        }>
        error?: string
      }>(legalworkThreadTurnPath(threadId, turnId))

      if (turnData.status === 'completed') {
        // Extract the assistant's text response from items
        const textItems = turnData.items
          ?.filter((item) => item.kind === 'assistant_text' && item.text)
          .map((item) => item.text ?? '')
          .join('\n\n') || '（AI 未返回任何内容）'
        return textItems
      }

      if (turnData.status === 'failed') {
        throw new Error(turnData.error || 'AI 响应失败')
      }

      if (turnData.status === 'aborted') {
        throw new Error('对话被中断')
      }

      // For 'queued' or 'running', continue polling
    }
    throw new Error('AI 响应超时')
  }, [])

  const sendMessage = useCallback(async (question: string): Promise<void> => {
    if (!question.trim() || sending) return
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: question.trim(),
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)
    setChatError(null)

    try {
      // Step 1: Retrieve relevant chunks from the knowledge base (RAG)
      const searchResult = await requestJson<{ hits: KnowledgeHit[] }>(
        `${LEGALWORK_KNOWLEDGE_SEARCH_PATH}?q=${encodeURIComponent(question.trim())}&top_k=8&include_content=true`
      )
      const hits = searchResult.hits ?? []

      // Step 2: Prioritize chunks from the current file, then include others
      const fileHits = hits.filter((h) => h.path === node.path || h.relativePath === node.path)
      const otherHits = hits.filter((h) => h.path !== node.path && h.relativePath !== node.path)
      const topHits = [...fileHits, ...otherHits].slice(0, 6)

      // Step 3: Build context from retrieved chunks
      let context = ''
      if (topHits.length > 0) {
        context = topHits
          .map(
            (hit, i) =>
              `[来源 ${i + 1}] ${hit.title || hit.path}\n` +
              (hit.content
                ? `相关内容：\n${hit.content.slice(0, 2000)}`
                : `摘要：${hit.snippet}`)
          )
          .join('\n\n---\n\n')
      } else {
        // Fallback: use file content directly if no search results
        const rawContent = fileContent?.encoding === 'utf8'
          ? fileContent.content.slice(0, 4000)
          : ''
        context = rawContent
          ? `文件内容：\n${rawContent}`
          : `文件：${node.name}（${fileTypeLabel(node)}，${formatBytes(node.sizeBytes)}）`
      }

      const prompt = `你是一个专业的法律知识助手。请基于以下检索到的相关内容回答用户的问题。

## 当前文件
${node.name}（${fileTypeLabel(node)}）

## 检索到的相关内容
${context}

${
  fileHits.length === 0 && topHits.length > 0
    ? '\n（注：以上内容来自知识库中其他相关文件，可能与当前文件无直接关联）\n'
    : ''
}

## 用户问题
${question.trim()}

请基于检索到的内容给出准确、专业的回答。如果内容不足以回答问题，请明确说明。引用来源时请标注 [来源编号]。`

      // Step 4: Create a thread with the current workspace
      const workspace = await getWorkspaceRoot()
      const threadResult = await requestJson<{ id: string }>(
        '/v1/threads',
        'POST',
        {
          workspace,
          title: `知识库：${node.name}`,
          model: composerModel || 'deepseek-chat',
          mode: 'agent'
        }
      )
      const threadId = threadResult.id

      // Step 5: Start a turn and capture the turnId for precise polling
      const turnResponse = await requestJson<{ turnId: string }>(
        legalworkThreadTurnsPath(threadId),
        'POST',
        { prompt }
      )
      const turnId = turnResponse.turnId

      // Step 6: Poll for completion (poll the specific turn, not the whole thread)
      const assistantMsg = await pollTurnCompletion(threadId, turnId)

      setMessages((prev) => [...prev, {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: assistantMsg,
        timestamp: Date.now()
      }])
    } catch (err) {
      setChatError(err instanceof Error ? err.message : 'AI 响应失败')
    } finally {
      setSending(false)
    }
  }, [fileContent, node, sending, composerModel, pollTurnCompletion])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage(input)
    }
  }, [input, sendMessage])

  const clearChat = useCallback((): void => {
    setMessages([])
    setChatError(null)
  }, [])

  // ── Render ──

  return (
    <div className="ds-no-drag flex h-full min-h-0 flex-col bg-[var(--ds-main)]">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-ds-border px-6 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
            title="返回文件列表"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <FileCode2 className="h-5 w-5 text-[var(--ds-accent)]" strokeWidth={1.7} />
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-[var(--ds-ink)]">{node.name}</h2>
            <p className="text-[12px] text-[var(--ds-muted)]">
              {fileTypeLabel(node)} · {formatBytes(node.sizeBytes)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void openInSystemApp()}
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-ds-border bg-ds-card px-3 text-[12px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>系统打开</span>
          </button>
        </div>
      </header>

      {/* Content + Chat split */}
      <div className="flex min-h-0 flex-1">
        {/* File Content Panel */}
        <div className="flex min-w-0 flex-1 flex-col border-r border-ds-border">
          {fileLoading ? (
            <div className="flex h-full items-center justify-center gap-2 text-[13px] text-[var(--ds-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
              正在读取...
            </div>
          ) : fileError ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="text-[13px] text-red-500">{fileError}</div>
              <button
                type="button"
                onClick={() => void openInSystemApp()}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-ds-border bg-ds-card px-4 py-2 text-[12px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>系统打开</span>
              </button>
            </div>
          ) : !fileContent ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-[13px] text-[var(--ds-muted)]">
              <File className="h-10 w-10 text-slate-300" strokeWidth={1.4} />
              <div>无法加载文件内容</div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto">
              {fileContent.type === 'pdf' && fileContent.content ? (
                <PdfPreview base64Content={fileContent.content} fileName={node.name} />
              ) : fileContent.type === 'image' && fileContent.objectUrl ? (
                <div className="flex h-full items-center justify-center p-4">
                  <img
                    src={fileContent.objectUrl}
                    alt={node.name}
                    className="h-auto max-h-full w-full object-contain"
                  />
                </div>
              ) : fileContent.type === 'audio' && fileContent.objectUrl ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
                  <AudioLines className="h-12 w-12 text-[var(--ds-accent)]" strokeWidth={1.5} />
                  <audio src={fileContent.objectUrl} controls className="w-full max-w-md" />
                  <div className="text-[12px] text-[var(--ds-muted)]">{node.name}</div>
                </div>
              ) : fileContent.type === 'document' ? (
                <DocumentPreview text={fileContent.content} fileName={node.name} />
              ) : fileContent.type === 'text' ? (
                <pre className="whitespace-pre-wrap p-6 font-mono text-[13px] leading-[22px] text-[var(--ds-ink)]">
                  {fileContent.content}
                </pre>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <File className="h-10 w-10 text-slate-300" strokeWidth={1.4} />
                  <div className="text-[13px] font-medium text-[var(--ds-ink)]">
                    {fileTypeLabel(node)} 文件
                  </div>
                  <p className="max-w-xs text-[12px] leading-relaxed text-[var(--ds-muted)]">
                    此文件类型暂不支持内联预览，但你可以通过右侧 AI 对话功能提问文件相关问题。
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--ds-muted)]">
                    <span>{formatBytes(node.sizeBytes)}</span>
                    <span className="text-ds-border">·</span>
                    <span>{fileTypeLabel(node)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void openInSystemApp()}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-ds-border bg-ds-card px-4 py-2 text-[12px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>系统打开</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Chat Panel */}
        <aside className="flex h-full w-[340px] min-w-[300px] flex-col border-l border-ds-border bg-ds-card">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-ds-border px-4">
            <div className="flex items-center gap-2">
              <ModelBrandIcon brand={modelBrand} className="h-5 w-5" />
              <span className="text-[13px] font-medium text-[var(--ds-ink)]">AI 对话</span>
            </div>
            {messages.length > 0 ? (
              <button
                type="button"
                onClick={clearChat}
                className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                title="清空对话"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            ) : null}
          </div>

          {messages.length === 0 && !sending ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <AnimatedWorkLogo active brand={modelBrand} phase="lead" size="md" />
              <div className="text-[13px] font-medium text-[var(--ds-ink)]">关于此文件提问</div>
              <p className="text-[12px] leading-relaxed text-[var(--ds-muted)]">
                基于当前文件内容进行 AI 对话。你可以询问文件中的关键信息、法律条款分析或内容总结。
              </p>
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="mr-2 mt-1 shrink-0">
                      <ModelBrandIcon brand={modelBrand} className="h-5 w-5" />
                    </div>
                  ) : null}
                  <div
                    className={`max-w-[85%] rounded-[12px] px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--ds-accent)] text-white'
                        : 'border border-ds-border bg-[var(--ds-main)] text-[var(--ds-ink)]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`mt-1 text-[10px] ${
                        msg.role === 'user' ? 'text-white/60' : 'text-[var(--ds-muted)]'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {sending ? (
                <div className="mb-4 flex justify-start">
                  <div className="mr-2 mt-1 shrink-0">
                    <AnimatedWorkLogo active brand={modelBrand} phase="trail" size="sm" />
                  </div>
                  <div className="max-w-[85%] rounded-[12px] border border-ds-border bg-[var(--ds-main)] px-4 py-3">
                    <div className="flex items-center gap-2 text-[13px] text-[var(--ds-muted)]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.8} />
                      <span>AI 思考中...</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {chatError ? (
                <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600 dark:border-red-900/50 dark:bg-red-950/20">
                  {chatError}
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          )}

          <div className="shrink-0 border-t border-ds-border p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入关于文件的问题..."
                disabled={sending}
                className="h-10 flex-1 rounded-[8px] border border-ds-border bg-[var(--ds-main)] px-3 text-[13px] text-[var(--ds-ink)] outline-none transition focus:border-[var(--ds-accent)] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={sending || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[var(--ds-accent)] text-white transition hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
