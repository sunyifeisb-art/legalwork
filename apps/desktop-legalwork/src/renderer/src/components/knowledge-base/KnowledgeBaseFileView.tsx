import type { CSSProperties, ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  AudioLines,
  ExternalLink,
  File,
  Loader2,
  MessageSquare,
  PanelRightClose,
  Trash2,
  Wrench,
  X
} from 'lucide-react'
import {
  LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_PATH,
  LEGALWORK_KNOWLEDGE_READ_FILE_PATH,
  LEGALWORK_KNOWLEDGE_RETRIEVE_PATH,
  legalworkThreadTurnsPath,
  legalworkThreadTurnPath
} from '../../../../shared/legalwork-endpoints'
import { resolveAgentTaskModel } from '../../agent/agent-task-model'
import { rendererRuntimeClient } from '../../agent/runtime-client'
import { useChatStore } from '../../store/chat-store'
import { AnimatedWorkLogo } from '../chat/AnimatedWorkLogo'
import { AssistantMarkdown } from '../chat/AssistantMarkdown'
import { resolveOrbState } from '../chat/orb-state'
import { ThinkingOrbStatus } from '../chat/ThinkingOrbStatus'
import { FloatingComposerModelPicker } from '../chat/FloatingComposerModelPicker'
import { ModelBrandIcon } from '../chat/ModelBrandIcon'
import { LegalworkRuntimeProvider } from '../../agent/legalwork-runtime'
import type { ThreadEventSink } from '../../agent/types'
import { brandForModel } from '../../lib/model-brand'
import type { KnowledgeTreeNode } from './types'
import {
  findKnowledgeFileForChatContext,
  KNOWLEDGE_DIRECT_ANSWER_INSTRUCTION,
  knowledgeChatHistoryFromBlocks,
  markKnowledgeSourceReferences,
  stripRepeatedKnowledgeQuestionLead,
  type KnowledgeChatQuote
} from './knowledge-chat-history'
import { extractPdfTextFromBase64, PdfJsPreview, type PdfTextSelection } from './PdfJsPreview'
import { setKnowledgeSourceMap, setKnowledgeOpenFileHandler } from './source-map-store'
import { KnowledgeFileIcon, KnowledgeFileTypeBadge } from './KnowledgeFileIcon'
import { DocxPreview } from './DocxPreview'
import {
  KnowledgeChatComposer,
  KnowledgeChatEmptyState,
  KnowledgeChatHeader,
  KnowledgeChatMessage,
  KnowledgeSelectionQuote,
  useKnowledgeChatSidebarPresence
} from './KnowledgeChatUI'
import { KnowledgeAssistantContent } from './KnowledgeReasoningBlock'

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

type PreviewType = 'text' | 'markdown' | 'pdf' | 'image' | 'audio' | 'document' | 'unsupported'

function previewType(node: KnowledgeTreeNode): PreviewType {
  const ext = fileExtension(node)
  if (ext === 'pdf') return 'pdf'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return 'audio'
  if (['md', 'markdown'].includes(ext)) return 'markdown'
  if (['txt', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'yml', 'html', 'xml'].includes(ext)) return 'text'
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

// ── Chat message types ──

type ChatMessage = {
  id: string
  role: 'user' | 'assistant' | 'reasoning' | 'tool'
  content: string
  reasoning?: string
  quote?: KnowledgeChatQuote
  timestamp: number
  status?: string
}

type KnowledgeToolMessageInput = {
  itemId: string
  status?: string
  summary?: string
  toolKind?: string
}

type FileContent = {
  content: string
  encoding: 'utf8' | 'base64'
  objectUrl?: string
  type: PreviewType
  extractedText?: string
  /** Original .docx package for layout-faithful browser rendering. */
  docxBase64?: string
  /** Formatted HTML for document preview (docx files). */
  html?: string
}

function knowledgeFileChatTitle(fileName: string, question: string): string {
  const trimmed = question.trim()
  const summary = trimmed.length > 30 ? `${trimmed.slice(0, 30)}…` : trimmed
  return `知识库：${fileName} · ${summary}`
}

function currentFileTextForPrompt(fileContent: FileContent | null): string {
  const directText = fileContent?.extractedText?.trim()
    || (fileContent?.encoding === 'utf8' ? fileContent.content.trim() : '')
  // Cost guard: cap the injected file text. A legal document's full body is
  // rarely needed verbatim for Q&A; the RAG retrieval provides the relevant
  // excerpts. 4000 chars ≈ ~3000 tokens, down from 16000 chars previously.
  return directText.slice(0, 4000)
}

// ── Document text extraction preview component ──

function DocumentPreview({
  text,
  fileName,
  html,
  docxBase64
}: {
  text: string
  fileName: string
  html?: string
  docxBase64?: string
}): ReactElement {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-ds-border bg-ds-card px-4 py-2 text-[12px] text-[var(--ds-muted)]">
        {docxBase64 ? 'Word 版式预览' : '文档文本预览'} · {fileName}
      </div>
      <div className={`min-h-0 flex-1 overflow-auto overscroll-contain ${docxBase64 ? '' : 'p-6'}`}>
        {docxBase64 ? (
          <DocxPreview
            base64Content={docxBase64}
            fileName={fileName}
            fallbackText={text}
          />
        ) : html ? (
          <div
            className="docx-preview text-[15px] leading-[28px] text-[var(--ds-ink)]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : text ? (
          <pre className="whitespace-pre-wrap break-words font-sans text-[16px] leading-[30px] text-[var(--ds-ink)]">
            {text}
          </pre>
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-center text-[14px] text-[var(--ds-muted)]">
            <File className="h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <div>未能提取到可预览文本</div>
            <div className="text-[13px]">你可以通过右侧 AI 对话功能提问文件相关问题。</div>
          </div>
        )}
      </div>
    </div>
  )
}

type KnowledgeRetrievalSource = {
  path: string
  title: string
  relevanceScore: number
  citation: string
}

type KnowledgeRetrievalResult = {
  contextText: string
  sources: KnowledgeRetrievalSource[]
  latencyMs: number
}

const knowledgeRuntimeProvider = new LegalworkRuntimeProvider()

// ── Main component ──

type Props = {
  node: KnowledgeTreeNode
  onBack: () => void
  selectedThreadId?: string | null
  onSelectThread?: (id: string | null) => void
  onChatThreadsChange?: () => void
}

export function KnowledgeBaseFileView({
  node,
  onBack,
  selectedThreadId,
  onSelectThread,
  onChatThreadsChange
}: Props): ReactElement {
  const [fileContent, setFileContent] = useState<FileContent | null>(null)
  const [fileLoading, setFileLoading] = useState(true)
  const [fileError, setFileError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [retrieving, setRetrieving] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null)
  const [liveReasoning, setLiveReasoning] = useState('')
  const [liveAssistant, setLiveAssistant] = useState('')
  const [pendingQuote, setPendingQuote] = useState<KnowledgeChatQuote | null>(null)
  const [chatOpen, setChatOpen] = useState(true)
  const chatSidebarPresent = useKnowledgeChatSidebarPresence(chatOpen)
  const [chatWidth, setChatWidth] = useState(360)
  const [splitWidth, setSplitWidth] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatAbortRef = useRef<AbortController | null>(null)
  const resizingChatRef = useRef(false)
  const splitContainerRef = useRef<HTMLDivElement>(null)

  const MIN_CHAT_WIDTH = 320
  const MAX_CHAT_WIDTH = 520
  const MIN_PREVIEW_WIDTH = 720

  useEffect(() => {
    const container = splitContainerRef.current
    if (!container) return

    const updateWidth = (): void => setSplitWidth(container.clientWidth)
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const effectiveChatWidth = splitWidth > 0
    ? Math.min(
        splitWidth,
        Math.max(
          Math.min(280, splitWidth),
          Math.min(chatWidth, MAX_CHAT_WIDTH, Math.floor(splitWidth * 0.38))
        )
      )
    : Math.min(chatWidth, MAX_CHAT_WIDTH)

  const startChatResize = useCallback((event: React.PointerEvent<HTMLDivElement>): void => {
    event.preventDefault()
    resizingChatRef.current = true
    const startX = event.clientX
    const startWidth = effectiveChatWidth
    const onMove = (ev: PointerEvent): void => {
      if (!resizingChatRef.current) return
      const delta = startX - ev.clientX
      const containerWidth = splitContainerRef.current?.clientWidth ?? window.innerWidth
      const responsivePreviewMin = Math.min(MIN_PREVIEW_WIDTH, Math.floor(containerWidth * 0.58))
      const maxWidthWithPreview = Math.max(MIN_CHAT_WIDTH, containerWidth - responsivePreviewMin)
      const nextMax = Math.min(MAX_CHAT_WIDTH, maxWidthWithPreview)
      const next = Math.max(MIN_CHAT_WIDTH, Math.min(nextMax, startWidth + delta))
      setChatWidth(next)
    }
    const onUp = (): void => {
      resizingChatRef.current = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [effectiveChatWidth])

  const toggleChat = useCallback((): void => {
    setChatOpen((prev) => !prev)
  }, [])

  const quotePdfSelectionForAI = useCallback((selection: PdfTextSelection): void => {
    setPendingQuote({
      text: selection.text,
      label: `${node.name} · 第 ${selection.pageNumber} 页`
    })
    setChatOpen(true)
  }, [node.name])

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
          return
        }
        if (type === 'pdf') {
          const data = await requestJson<{ path: string; content: string; encoding: 'utf8' | 'base64' }>(
            `${LEGALWORK_KNOWLEDGE_READ_FILE_PATH}?path=${encodeURIComponent(node.path)}&encoding=base64`
          )
          const extracted = await requestJson<{ path: string; text: string; extension: string }>(
            `${LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_PATH}?path=${encodeURIComponent(node.path)}`
          ).catch(() => null)
          if (cancelled) return
          let extractedText = extracted?.text?.trim() ?? ''
          if (!extractedText && data.content) {
            extractedText = await extractPdfTextFromBase64(data.content).catch(() => '')
            if (cancelled) return
          }
          let objectUrl: string | undefined
          if (data.content) {
            try {
              objectUrl = buildObjectUrl(node, data.content)
            } catch {
              objectUrl = undefined
            }
          }
          setFileContent({
            content: data.content,
            encoding: data.encoding,
            objectUrl,
            type,
            extractedText
          })
          return
        }
        if (type === 'document') {
          const ext = fileExtension(node)
          try {
            const extractionPromise = requestJson<{ path: string; text: string; extension: string; html?: string }>(
              `${LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_PATH}?path=${encodeURIComponent(node.path)}`
            ).catch(() => null)
            const packagePromise = ext === 'docx'
              ? requestJson<{ path: string; content: string; encoding: 'utf8' | 'base64' }>(
                  `${LEGALWORK_KNOWLEDGE_READ_FILE_PATH}?path=${encodeURIComponent(node.path)}&encoding=base64`
                ).catch(() => null)
              : Promise.resolve(null)
            const [data, docxPackage] = await Promise.all([extractionPromise, packagePromise])
            if (cancelled) return
            if (!data && !docxPackage) throw new Error('文档内容读取失败')
            const text = data?.text ?? ''
            setFileContent({
              content: text,
              encoding: 'utf8',
              type: 'document',
              extractedText: text,
              html: data?.html,
              ...(docxPackage?.content ? { docxBase64: docxPackage.content } : {})
            })
          } catch {
            if (!cancelled) setFileContent({ content: '', encoding: 'utf8', type: 'document' })
          }
          return
        }
        const isBinary = type === 'image' || type === 'audio'
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
  }, [messages, liveAssistant, liveReasoning])

  // Cleanup object URL on unmount or when the URL changes
  useEffect(() => {
    const objectUrl = fileContent?.objectUrl
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [fileContent])

  useEffect(() => {
    return () => chatAbortRef.current?.abort()
  }, [])

  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([])
      setActiveChatThreadId(null)
      setChatError(null)
      return
    }
    const threadId = selectedThreadId
    let cancelled = false
    async function loadChatHistory(): Promise<void> {
      setChatError(null)
      setMessages([])
      setActiveChatThreadId(null)
      try {
        const { blocks } = await knowledgeRuntimeProvider.getThreadDetail(threadId)
        if (cancelled) return
        const history = knowledgeChatHistoryFromBlocks(blocks)
        const linkedFile = findKnowledgeFileForChatContext([node], history.context)
        if (!linkedFile) {
          setChatError('这条对话与当前文件不匹配，请从左侧记录重新打开。')
          return
        }
        setMessages(history.messages)
        setActiveChatThreadId(threadId)
        setChatOpen(true)
      } catch (err) {
        if (!cancelled) {
          setChatError(err instanceof Error ? err.message : '加载对话记录失败')
        }
      }
    }
    void loadChatHistory()
    return () => {
      cancelled = true
    }
  }, [node, selectedThreadId])

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
  const composerPickList = useChatStore((s) => s.composerPickList)
  const composerModelGroups = useChatStore((s) => s.composerModelGroups)
  const setComposerModel = useChatStore((s) => s.setComposerModel)
  const loadComposerModels = useChatStore((s) => s.loadComposerModels)
  const [runtimeAgentModel, setRuntimeAgentModel] = useState('')
  const effectiveModel = resolveAgentTaskModel(composerModel, runtimeAgentModel)
  const modelBrand = brandForModel(effectiveModel, composerModelGroups)

  useEffect(() => {
    void loadComposerModels()
  }, [loadComposerModels])

  useEffect(() => {
    let cancelled = false
    void rendererRuntimeClient.getSettings().then((settings) => {
      if (!cancelled) setRuntimeAgentModel(settings.agents.legalwork.model)
    }).catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [composerModel])

  const pushOrUpdateToolMessage = useCallback((tool: KnowledgeToolMessageInput): void => {
    const id = `tool_${tool.itemId}`
    setMessages((prev) => {
      const content = tool.summary || tool.toolKind || '工具调用'
      const existingIndex = prev.findIndex((msg) => msg.id === id)
      if (existingIndex < 0) {
        return [...prev, {
          id,
          role: 'tool',
          content,
          status: tool.status,
          timestamp: Date.now()
        }]
      }
      const next = [...prev]
      next[existingIndex] = {
        ...next[existingIndex],
        content,
        status: tool.status,
        timestamp: Date.now()
      }
      return next
    })
  }, [])

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
    const selectedQuote = pendingQuote
    chatAbortRef.current?.abort()
    const abort = new AbortController()
    chatAbortRef.current = abort
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: question.trim(),
      ...(selectedQuote ? { quote: selectedQuote } : {}),
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])
    setPendingQuote(null)
    setInput('')
    setSending(true)
    setChatError(null)
    setLiveReasoning('')
    setLiveAssistant('')

    try {
      const settings = await rendererRuntimeClient.getSettings()
      const requestModel = resolveAgentTaskModel(composerModel, settings.agents.legalwork.model)
      setRuntimeAgentModel(settings.agents.legalwork.model)
      setRetrieving(true)
      const retrievalQuery = `${question.trim()} ${node.name} ${node.path}`
      const retrieval = await requestJson<KnowledgeRetrievalResult>(
        `${LEGALWORK_KNOWLEDGE_RETRIEVE_PATH}?q=${encodeURIComponent(retrievalQuery)}&max_chars=3000&exclude_expired=true`
      ).catch((): KnowledgeRetrievalResult => ({
        contextText: '',
        sources: [],
        latencyMs: 0
      }))
      setRetrieving(false)

      // Save source-to-path mapping so [来源 N] links can navigate to the file.
      const sourceMapping: Record<number, { path: string; title: string }> = {}
      for (let i = 0; i < Math.min(retrieval.sources.length, 8); i += 1) {
        const s = retrieval.sources[i]
        sourceMapping[i + 1] = { path: s.path, title: s.title }
      }
      setKnowledgeSourceMap(sourceMapping)

      const currentFileText = currentFileTextForPrompt(fileContent)
      const currentFileContext = currentFileText
        ? `## 当前打开文件的正文（优先依据）\n${currentFileText}`
        : `## 当前打开文件\n${node.name}（${fileTypeLabel(node)}，${formatBytes(node.sizeBytes)}）\n\n未能从当前文件直接提取到可用正文。`
      const retrievalContext = retrieval.contextText
        ? `## 知识库补充检索结果（仅作补充，不得替代当前文件）\n${retrieval.contextText}`
        : '## 知识库补充检索结果\n无'
      const citations = retrieval.sources.length
        ? retrieval.sources
          .slice(0, 8)
          .map((source, index) => `[来源 ${index + 1}] ${source.citation || source.title}（${source.path}，相关度 ${Math.round(source.relevanceScore * 100)}%）`)
          .join('\n')
        : '无'

      const selectionContext = selectedQuote
        ? `## PDF 划选引用\n来源：${node.name}\n页码：${selectedQuote.label.split(' · ').at(-1) ?? ''}\n正文：\n<<<PDF_SELECTION>>>\n${selectedQuote.text}\n<<<END_PDF_SELECTION>>>\n\n回答时应优先分析这段划选内容，并将它与用户自行输入的问题区分开。`
        : ''

      const prompt = `你是一个专业的法律知识助手。请基于以下检索到的相关内容回答用户的问题。

## 当前文件
${node.name}（${fileTypeLabel(node)}）

## 当前文件路径
${node.path}

${currentFileContext}

${selectionContext}

${retrievalContext}

## 可引用来源
当前文件：${node.name}（来自文件预览页直接读取）
${citations}

## 用户问题
${question.trim()}

## 回答要求
${KNOWLEDGE_DIRECT_ANSWER_INSTRUCTION}
请优先依据“当前打开文件的正文”回答；知识库补充检索结果只能用于交叉参考或补充背景，不能把其他文件内容误认为当前文件内容。如果当前文件正文不足以回答问题，请明确说明缺口。引用补充来源时请标注对应的 [来源编号]，不要编造未出现在上下文中的依据。`

      // Step 4: Reuse the active file-chat thread or create a side thread so it does not sync to the main chat sidebar.
      const workspace = await getWorkspaceRoot()
      let threadId = activeChatThreadId
      if (!threadId) {
        const threadResult = await requestJson<{ id: string }>(
          '/v1/threads',
          'POST',
          {
            workspace,
            title: knowledgeFileChatTitle(node.name, question.trim()),
            model: requestModel,
            mode: 'agent',
            relation: 'side'
          }
        )
        threadId = threadResult.id
        setActiveChatThreadId(threadId)
      }

      // Step 5: Start a turn with the runtime's configured model
      const turnResponse = await requestJson<{ turnId: string }>(
        legalworkThreadTurnsPath(threadId),
        'POST',
        { prompt, model: requestModel }
      )
      const turnId = turnResponse.turnId

      let streamedAssistant = ''
      let streamedReasoning = ''
      await new Promise<void>((resolve, reject) => {
        let settled = false
        const settle = (error?: Error): void => {
          if (settled) return
          settled = true
          if (!abort.signal.aborted) abort.abort()
          if (error) reject(error)
          else resolve()
        }
        const sink: ThreadEventSink = {
          onSeq: () => undefined,
          onDeltas: (deltas) => {
            for (const delta of deltas) {
              if (delta.kind === 'agent_reasoning') {
                streamedReasoning += delta.text
                setLiveReasoning(streamedReasoning)
              } else {
                streamedAssistant += delta.text
                setLiveAssistant(stripRepeatedKnowledgeQuestionLead(streamedAssistant, question))
              }
            }
          },
          onUserMessage: () => undefined,
          onTool: pushOrUpdateToolMessage,
          onCompaction: (ev) => {
            pushOrUpdateToolMessage({
              itemId: ev.itemId,
              status: ev.status,
              summary: ev.summary
            })
          },
          onApproval: (req) => {
            pushOrUpdateToolMessage({
              itemId: req.approvalId,
              status: 'running',
              summary: req.summary
            })
          },
          onUserInput: (req) => {
            pushOrUpdateToolMessage({
              itemId: req.requestId,
              status: 'running',
              summary: req.questions.map((q) => q.question).join(' · ') || '等待用户输入'
            })
          },
          onUserInputStatus: (ev) => {
            pushOrUpdateToolMessage({
              itemId: ev.itemId,
              status: ev.status === 'submitted' ? 'success' : 'error',
              summary: ev.status === 'submitted' ? '用户输入已提交' : '用户输入已取消'
            })
          },
          onGoal: () => undefined,
          onTodos: () => undefined,
          onTurnComplete: () => settle(),
          onError: (err) => settle(err)
        }
        void knowledgeRuntimeProvider.subscribeThreadEvents(threadId, 0, sink, abort.signal).then(
          () => settle(),
          (error: unknown) => settle(error instanceof Error ? error : new Error(String(error)))
        )
      })

      // Step 6: Poll for completion (poll the specific turn, not the whole thread)
      // after SSE closes so final persisted text can fill any missed early deltas.
      const assistantMsg = await pollTurnCompletion(threadId, turnId)

      const markedUp = markKnowledgeSourceReferences(stripRepeatedKnowledgeQuestionLead(
        assistantMsg || streamedAssistant,
        question
      ))

      const finalReasoning = streamedReasoning.trim()
      const finalContent = markedUp || '（AI 未返回任何内容）'

      setMessages((prev) => [...prev, {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: finalContent,
        ...(finalReasoning ? { reasoning: finalReasoning } : {}),
        timestamp: Date.now()
      }])
      setLiveReasoning('')
      setLiveAssistant('')
      onChatThreadsChange?.()
    } catch (err) {
      if (chatAbortRef.current === abort) {
        setChatError(err instanceof Error ? err.message : 'AI 响应失败')
      }
    } finally {
      if (chatAbortRef.current === abort) chatAbortRef.current = null
      setSending(false)
    }
  }, [composerModel, fileContent, node, pendingQuote, pollTurnCompletion, pushOrUpdateToolMessage, sending, activeChatThreadId, onChatThreadsChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage(input)
    }
  }, [input, sendMessage])

  const clearChat = useCallback((): void => {
    chatAbortRef.current?.abort()
    chatAbortRef.current = null
    setMessages([])
    setChatError(null)
    setLiveReasoning('')
    setLiveAssistant('')
    setPendingQuote(null)
    setSending(false)
    setActiveChatThreadId(null)
    onSelectThread?.(null)
  }, [onSelectThread])

  // ── Render ──

  return (
    <div className="ds-no-drag flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-[var(--ds-main)]">
      {/* Header */}
      <header className="flex h-[66px] shrink-0 items-center justify-between border-b border-ds-border bg-[color-mix(in_srgb,var(--ds-card-soft)_78%,transparent)] px-5 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
            title="返回文件列表"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <KnowledgeFileIcon node={node} size={30} />
          <div className="min-w-0">
            <h2 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-[var(--ds-ink)]">{node.name}</h2>
            <div className="mt-1 flex items-center gap-2 text-[11.5px] text-[var(--ds-muted)]">
              <KnowledgeFileTypeBadge node={node} />
              <span>{formatBytes(node.sizeBytes)}</span>
            </div>
          </div>
        </div>
        <div data-control-hover-root className="flex items-center gap-2">
          <button
            type="button"
            data-control-active={chatOpen ? 'true' : undefined}
            onClick={toggleChat}
            className={`inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-3 text-[12px] font-medium transition ${
              chatOpen
                ? 'border-[var(--ds-accent)] bg-[var(--ds-accent)]/10 text-[var(--ds-accent)]'
                : 'border-ds-border bg-ds-card text-[var(--ds-muted)] hover:bg-ds-hover hover:text-[var(--ds-ink)]'
            }`}
            title={chatOpen ? '收起 AI 对话' : '展开 AI 对话'}
          >
            {chatOpen ? (
              <PanelRightClose className="h-3.5 w-3.5" strokeWidth={1.8} />
            ) : (
              <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.8} />
            )}
            <span>AI 对话</span>
          </button>
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
      <div ref={splitContainerRef} className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* File Content Panel */}
        <div className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${chatSidebarPresent ? 'border-r border-ds-border' : ''}`}>
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
              {fileContent.type === 'pdf' ? (
                <PdfJsPreview
                  base64Content={fileContent.content}
                  fileName={node.name}
                  onAskAI={quotePdfSelectionForAI}
                />
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
                <DocumentPreview
                  text={fileContent.content}
                  fileName={node.name}
                  html={fileContent.html}
                  docxBase64={fileContent.docxBase64}
                />
              ) : fileContent.type === 'markdown' ? (
                <AssistantMarkdown
                  text={fileContent.content}
                  streaming={false}
                  className="ds-markdown ds-chat-answer break-words px-6 py-5 leading-7 text-[var(--ds-ink)]"
                />
              ) : fileContent.type === 'text' ? (
                <pre className="whitespace-pre-wrap p-6 font-mono text-[14px] leading-[26px] text-[var(--ds-ink)]">
                  {fileContent.content}
                </pre>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <KnowledgeFileIcon node={node} size={48} />
                  <div className="text-[13px] font-medium text-[var(--ds-ink)]">
                    {fileTypeLabel(node)} 文件
                  </div>
                  <p className="max-w-xs text-[12px] leading-relaxed text-[var(--ds-muted)]">
                    此文件类型暂不支持内联预览，{chatOpen ? '但你可以通过右侧 AI 对话功能提问文件相关问题。' : '你可以展开右侧 AI 对话提问文件相关问题。'}
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
        {chatSidebarPresent ? (
          <>
            <div
              role="separator"
              aria-orientation="vertical"
              className="relative z-20 shrink-0 cursor-col-resize bg-ds-border hover:bg-[var(--ds-accent)] w-[3px] transition-colors"
              onPointerDown={startChatResize}
            />
            <aside
              data-motion={chatOpen ? 'enter' : 'exit'}
              className="ds-knowledge-chat-sidebar flex h-full min-w-0 shrink-0 flex-col overflow-hidden border-l border-ds-border bg-ds-card"
              style={{
                '--knowledge-chat-sidebar-width': `${effectiveChatWidth}px`
              } as CSSProperties}
            >
          <KnowledgeChatHeader
            title="知识库 AI 对话"
            contextLabel={`当前文件 · ${node.name}`}
            icon={<ModelBrandIcon brand={modelBrand} className="h-5 w-5" />}
            actions={(
              <>
              <FloatingComposerModelPicker
                compact
                mode="combobox"
                composerModel={effectiveModel}
                composerPickList={composerPickList}
                composerModelGroups={composerModelGroups}
                canChangeModel={!sending}
                onComposerModelChange={setComposerModel}
              />
              {messages.length > 0 || liveAssistant || liveReasoning ? (
                <button
                  type="button"
                  onClick={clearChat}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  title="清空对话"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              ) : null}
              </>
            )}
          />

          {messages.length === 0 && !sending && !liveAssistant && !liveReasoning ? (
            <KnowledgeChatEmptyState
              visual={<AnimatedWorkLogo active brand={modelBrand} phase="lead" size="sm" />}
              title="关于此文件提问"
              description="基于当前文件内容进行对话，可询问关键信息、法律条款、风险分析或内容总结。"
              contextLabel={node.name}
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {messages.map((msg) => (
                <KnowledgeChatMessage
                  key={msg.id}
                  role={msg.role}
                  timestamp={msg.timestamp}
                  leading={msg.role !== 'user' ? (
                    msg.role === 'tool' ? (
                      <Wrench className="h-5 w-5 text-[var(--ds-muted)]" strokeWidth={1.7} />
                    ) : (
                      <ModelBrandIcon brand={modelBrand} className="h-5 w-5" />
                    )
                  ) : undefined}
                >
                  {msg.role === 'assistant' ? (
                    <KnowledgeAssistantContent
                      content={msg.content}
                      reasoning={msg.reasoning}
                    />
                  ) : msg.role === 'reasoning' ? (
                  <AssistantMarkdown
                    text={msg.content}
                    streaming={false}
                    className="ds-markdown ds-chat-answer break-words !text-[12px]"
                  />
                  ) : msg.role === 'tool' ? (
                    <div className="flex items-center gap-2">
                      {msg.status === 'running' ? (
                        <ThinkingOrbStatus state="searching" size={20} />
                      ) : null}
                      <span className="min-w-0 flex-1 break-words">{msg.content}</span>
                    </div>
                  ) : (
                    <div>
                      {msg.quote ? <KnowledgeSelectionQuote quote={msg.quote} /> : null}
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    </div>
                  )}
                </KnowledgeChatMessage>
              ))}

              {liveReasoning ? (
                <KnowledgeChatMessage
                  role="reasoning"
                  leading={<ThinkingOrbStatus state="solving" size={20} />}
                >
                  <AssistantMarkdown
                    text={liveReasoning}
                    streaming
                    className="ds-markdown ds-chat-answer break-words !text-[12px]"
                  />
                </KnowledgeChatMessage>
              ) : null}

              {liveAssistant ? (
                <KnowledgeChatMessage
                  role="assistant"
                  leading={<ModelBrandIcon brand={modelBrand} className="h-5 w-5" />}
                >
                  <AssistantMarkdown
                    text={liveAssistant}
                    streaming
                    className="ds-markdown ds-chat-answer break-words !text-[13px]"
                  />
                </KnowledgeChatMessage>
              ) : null}

              {sending ? (
                <KnowledgeChatMessage
                  role="assistant"
                  leading={
                    <ThinkingOrbStatus
                      state={resolveOrbState({
                        busy: true,
                        liveReasoning,
                        waitingForUserInput: false,
                        activeToolName: retrieving ? 'knowledge_search' : undefined
                      })}
                      size={20}
                    />
                  }
                >
                  <div className="flex items-center gap-2 text-[var(--ds-muted)]">
                    <span>AI 思考中...</span>
                  </div>
                </KnowledgeChatMessage>
              ) : null}

              {chatError ? (
                <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600 dark:border-red-900/50 dark:bg-red-950/20">
                  {chatError}
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          )}

          <KnowledgeChatComposer
            value={input}
            placeholder="输入关于文件的问题..."
            disabled={sending}
            quote={pendingQuote}
            onRemoveQuote={() => setPendingQuote(null)}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            onSend={() => void sendMessage(input)}
          />
        </aside>
          </>
        ) : null}
      </div>
    </div>
  )
}
