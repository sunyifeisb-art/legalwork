import { Component, type CSSProperties, type DragEvent as ReactDragEvent, type ErrorInfo, type ReactElement, type ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  AudioLines,
  Check,
  CheckSquare,
  ChevronRight,
  Database,
  Eye,
  ExternalLink,
  File,
  FileCode2,
  Folder,
  FolderPlus,
  Loader2,
  MoreHorizontal,
  Move,
  PanelRightClose,
  RefreshCw,
  Search,
  Sparkles,
  Square,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import { getProvider } from '../../agent/registry'
import { AssistantMarkdown } from '../chat/AssistantMarkdown'
import { resolveOrbState } from '../chat/orb-state'
import { ThinkingOrbStatus } from '../chat/ThinkingOrbStatus'
import {
  LEGALWORK_KNOWLEDGE_CLASSIFY_PATH,
  LEGALWORK_KNOWLEDGE_CREATE_FOLDER_PATH,
  LEGALWORK_KNOWLEDGE_DELETE_FILE_PATH,
  LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_PATH,
  LEGALWORK_KNOWLEDGE_MOVE_PATH,
  LEGALWORK_KNOWLEDGE_READ_FILE_PATH,
  LEGALWORK_KNOWLEDGE_RETRIEVE_PATH,
  LEGALWORK_KNOWLEDGE_SYNC_PATH,
  LEGALWORK_KNOWLEDGE_TREE_PATH,
  legalworkThreadTurnPath,
  legalworkThreadTurnsPath
} from '../../../../shared/legalwork-endpoints'
import type { ThreadEventSink } from '../../agent/types'

import type { KnowledgeTreeNode } from './types'
import { KnowledgeBaseFileView } from './KnowledgeBaseFileView'
import type { ChatMessage, KnowledgeChatContext } from './knowledge-chat-history'
import {
  findKnowledgeFileForChatContext,
  KNOWLEDGE_DIRECT_ANSWER_INSTRUCTION,
  knowledgeChatHistoryFromBlocks,
  markKnowledgeSourceReferences,
  stripRepeatedKnowledgeQuestionLead
} from './knowledge-chat-history'
import { scheduleKnowledgeUploadFeedbackDismiss } from './knowledge-upload-feedback'
import { PdfJsPreview } from './PdfJsPreview'
import {
  setKnowledgeSourceMap,
  setKnowledgeOpenFileHandler
} from './source-map-store'
import { KnowledgeFileIcon, KnowledgeFileTypeBadge } from './KnowledgeFileIcon'
import {
  KnowledgeChatComposer,
  KnowledgeChatEmptyState,
  KnowledgeChatHeader,
  KnowledgeChatMessage,
  useKnowledgeChatSidebarPresence
} from './KnowledgeChatUI'
import { KnowledgeAssistantContent } from './KnowledgeReasoningBlock'
type TreeNode = KnowledgeTreeNode

type FileViewBoundaryProps = {
  fileName: string
  onBack: () => void
  children: ReactNode
}

type FileViewBoundaryState = {
  error: Error | null
}

class KnowledgeFileViewErrorBoundary extends Component<FileViewBoundaryProps, FileViewBoundaryState> {
  state: FileViewBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): FileViewBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[KnowledgeBaseFileView] render error:', error, info.componentStack)
    if (typeof window !== 'undefined' && typeof window.dsGui?.logError === 'function') {
      void window.dsGui.logError('knowledge-base-file-view', 'Failed to render knowledge base file', {
        fileName: this.props.fileName,
        name: error.name,
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack
      }).catch(() => undefined)
    }
  }

  override render(): ReactNode {
    if (!this.state.error) return this.props.children

    return (
      <div className="ds-no-drag flex h-full min-h-0 flex-col bg-[var(--ds-main)]">
        <header className="flex shrink-0 items-center gap-3 border-b border-ds-border px-6 py-3">
          <button
            type="button"
            onClick={this.props.onBack}
            className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
            title="返回文件列表"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-[var(--ds-ink)]">{this.props.fileName}</h2>
            <p className="text-[12px] text-[var(--ds-muted)]">文件打开失败</p>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[8px] border border-red-200 bg-red-50 p-5 text-center shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
            <div className="text-[14px] font-semibold text-red-700 dark:text-red-200">
              打开该文件时应用视图出错
            </div>
            <p className="mt-2 break-words text-[12px] leading-5 text-red-600 dark:text-red-200/80">
              {this.state.error.message || String(this.state.error)}
            </p>
            <button
              type="button"
              onClick={this.props.onBack}
              className="mt-4 rounded-[6px] bg-red-700/10 px-4 py-2 text-[12px] font-medium text-red-700 transition hover:bg-red-700/15 dark:text-red-100"
            >
              返回知识库
            </button>
          </div>
        </div>
      </div>
    )
  }
}

type UploadSummary = {
  done: number
  total: number
  status: 'uploading' | 'success' | 'dismissing'
}

type KnowledgeUploadFile = File & {
  legalworkRelativePath?: string
  webkitRelativePath?: string
}

type DroppedEntry = FileSystemEntry

type DroppedFileEntry = FileSystemFileEntry

type DroppedDirectoryEntry = FileSystemDirectoryEntry

type DataTransferItemWithEntry = DataTransferItem & {
  webkitGetAsEntry?: () => FileSystemEntry | null
}

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

function joinKnowledgePath(base: string, child: string): string {
  const parts = [base, child]
    .join('/')
    .replaceAll('\\', '/')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.join('/')
}

/** Recursively search a knowledge tree for a node matching `path`. */
function findNodeByPath(nodes: TreeNode[], path: string): TreeNode | null {
  for (const node of nodes) {
    if (node.path === path) return node
    if (node.children) {
      const found = findNodeByPath(node.children, path)
      if (found) return found
    }
  }
  return null
}

function fileRelativePath(file: KnowledgeUploadFile): string {
  return file.legalworkRelativePath?.trim() || file.webkitRelativePath?.trim() || file.name
}

function withUploadPath(file: File, relativePath: string): KnowledgeUploadFile {
  return Object.defineProperty(file, 'legalworkRelativePath', {
    value: relativePath,
    configurable: true
  }) as KnowledgeUploadFile
}

function readDroppedFile(entry: DroppedFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    entry.file(resolve, (error) => reject(error ?? new Error('读取拖拽文件失败')))
  })
}

function readDroppedDirectoryEntries(entry: DroppedDirectoryEntry): Promise<DroppedEntry[]> {
  const reader = entry.createReader()
  const entries: DroppedEntry[] = []
  return new Promise((resolve, reject) => {
    const readNext = (): void => {
      reader.readEntries((batch) => {
        if (batch.length === 0) {
          resolve(entries)
          return
        }
        entries.push(...batch)
        readNext()
      }, (error) => reject(error ?? new Error('读取拖拽文件夹失败')))
    }
    readNext()
  })
}

async function collectDroppedEntry(entry: DroppedEntry, basePath = ''): Promise<KnowledgeUploadFile[]> {
  if (entry.isFile) {
    const file = await readDroppedFile(entry as DroppedFileEntry)
    return [withUploadPath(file, joinKnowledgePath(basePath, file.name))]
  }
  if (!entry.isDirectory) return []
  const folderPath = joinKnowledgePath(basePath, entry.name)
  const children = await readDroppedDirectoryEntries(entry as DroppedDirectoryEntry)
  const collected = await Promise.all(children.map((child) => collectDroppedEntry(child, folderPath)))
  return collected.flat()
}

async function filesFromDrop(dataTransfer: DataTransfer): Promise<KnowledgeUploadFile[]> {
  const entries = Array.from(dataTransfer.items)
    .map((item) => (item as DataTransferItemWithEntry).webkitGetAsEntry?.() ?? null)
    .filter((entry): entry is FileSystemEntry => Boolean(entry))
  if (entries.length === 0) return Array.from(dataTransfer.files) as KnowledgeUploadFile[]
  const collected = await Promise.all(entries.map((entry) => collectDroppedEntry(entry)))
  return collected.flat()
}

function formatBytes(bytes?: number): string {
  if (bytes === undefined) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`
}

function formatDate(value?: string): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('zh-CN', {
    year: date.getFullYear() === new Date().getFullYear() ? undefined : '2-digit',
    month: 'numeric',
    day: 'numeric'
  })
}

function fileTypeLabel(node: TreeNode): string {
  if (node.kind === 'folder') return '文件夹'
  const ext = (node.extension || node.name.split('.').pop() || '').replace(/^\./, '').toLowerCase()
  if (!ext) return '文件'
  if (ext === 'doc' || ext === 'docx') return 'WORD'
  if (ext === 'ppt' || ext === 'pptx') return 'PPT'
  if (ext === 'xls' || ext === 'xlsx') return 'EXCEL'
  if (ext === 'pdf') return 'PDF'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return '音频'
  if (['zip', 'rar', '7z'].includes(ext)) return '压缩包'
  return ext.toUpperCase()
}

function findFolder(nodes: TreeNode[], path: string): TreeNode | null {
  if (!path) return null
  for (const node of nodes) {
    if (node.kind !== 'folder') continue
    if (node.path === path) return node
    const nested = findFolder(node.children ?? [], path)
    if (nested) return nested
  }
  return null
}

function filterNodes(nodes: TreeNode[], query: string): TreeNode[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return nodes
  const result: TreeNode[] = []
  for (const node of nodes) {
    if (node.name.toLowerCase().includes(trimmed) || node.path.toLowerCase().includes(trimmed)) {
      result.push(node)
      continue
    }
    if (node.kind === 'folder') {
      const children = filterNodes(node.children ?? [], trimmed)
      if (children.length > 0) result.push({ ...node, children })
    }
  }
  return result
}

function flattenNodes(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = []
  for (const node of nodes) {
    result.push(node)
    if (node.kind === 'folder') result.push(...flattenNodes(node.children ?? []))
  }
  return result
}

type PreviewFile = {
  node: TreeNode
  content: string
  encoding: 'utf8' | 'base64'
  objectUrl?: string
}

type PreviewType = 'text' | 'markdown' | 'pdf' | 'image' | 'audio' | 'document' | 'unsupported'

// ── AI Chat types ──

function knowledgeChatTitle(question: string): string {
  const trimmed = question.trim()
  const summary = trimmed.length > 30 ? `${trimmed.slice(0, 30)}…` : trimmed
  return `知识库全局对话 · ${summary}`
}

type KnowledgeRetrievalSource = {
  path: string
  title: string
  relevanceScore: number
  excerpt: string
  citation: string
  tags?: string[]
}

type KnowledgeRetrievalResult = {
  contextText: string
  sources: KnowledgeRetrievalSource[]
  latencyMs: number
}

type KnowledgeClassifyResult = {
  moved: Array<{
    sourcePath: string
    destPath: string
    category: string
    reason: string
  }>
  skipped: Array<{
    path: string
    reason: string
  }>
  dryRun: boolean
}

function fileExtension(node: TreeNode): string {
  return (node.extension || node.name.split('.').pop() || '').replace(/^\./, '').toLowerCase()
}

function previewType(node: TreeNode): PreviewType {
  const ext = fileExtension(node)
  if (['pdf'].includes(ext)) return 'pdf'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return 'audio'
  if (['md', 'markdown'].includes(ext)) return 'markdown'
  if (['txt', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'yml', 'html', 'xml'].includes(ext)) return 'text'
  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) return 'document'
  return 'unsupported'
}

function mimeTypeForFile(node: TreeNode): string {
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

function buildObjectUrl(node: TreeNode, base64Content: string): string {
  const byteString = atob(base64Content)
  const bytes = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i += 1) {
    bytes[i] = byteString.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: mimeTypeForFile(node) })
  return URL.createObjectURL(blob)
}

type ContextMenuState = {
  visible: boolean
  x: number
  y: number
  node: TreeNode | null
}

type MoveTargetModalState = {
  visible: boolean
  targetPath: string
  targetFolders: TreeNode[]
}

function collectFolders(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = []
  for (const node of nodes) {
    if (node.kind === 'folder') {
      result.push(node)
      result.push(...collectFolders(node.children ?? []))
    }
  }
  return result
}

function isDescendantOf(path: string, ancestorPath: string): boolean {
  if (!ancestorPath) return false
  return path !== ancestorPath && path.startsWith(`${ancestorPath}/`)
}

type KnowledgeBaseViewProps = {
  selectedThreadId?: string | null
  onSelectThread?: (id: string | null) => void
  onChatThreadsChange?: () => void
}

export function KnowledgeBaseView({
  selectedThreadId,
  onSelectThread,
  onChatThreadsChange
}: KnowledgeBaseViewProps): ReactElement {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<UploadSummary | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [classifying, setClassifying] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [preview, setPreview] = useState<PreviewFile | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [viewingFile, setViewingFile] = useState<TreeNode | null>(null)
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set())
  const [lastSelectedPath, setLastSelectedPath] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    node: null
  })
  const [moveModal, setMoveModal] = useState<MoveTargetModalState>({
    visible: false,
    targetPath: '',
    targetFolders: []
  })

  // ── AI Chat state ──
  const [chatOpen, setChatOpen] = useState(false)
  const chatSidebarPresent = useKnowledgeChatSidebarPresence(chatOpen)
  const [chatSidebarWidth, setChatSidebarWidth] = useState(420)
  const [knowledgeLayoutWidth, setKnowledgeLayoutWidth] = useState(0)
  const knowledgeLayoutRef = useRef<HTMLDivElement>(null)
  const chatSidebarDragRef = useRef<{ startX: number; startWidth: number } | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null)
  const [liveReasoning, setLiveReasoning] = useState('')
  const [liveAssistant, setLiveAssistant] = useState('')
  const [chatContext, setChatContext] = useState<KnowledgeChatContext>({ kind: 'global' })
  const [chatContextThreadId, setChatContextThreadId] = useState<string | null>(null)
  const chatMessagesEndRef = useRef<HTMLDivElement>(null)
  const chatAbortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const element = knowledgeLayoutRef.current
    if (!element) return
    const updateWidth = (): void => setKnowledgeLayoutWidth(element.clientWidth)
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Load a selected knowledge-chat thread into the AI chat panel.
  useEffect(() => {
    if (!selectedThreadId) {
      setChatContextThreadId(null)
      return
    }
    const threadId = selectedThreadId
    let cancelled = false
    async function load(): Promise<void> {
      try {
        setChatError(null)
        setChatContextThreadId(null)
        const provider = getProvider()
        const { blocks } = await provider.getThreadDetail(threadId)
        if (cancelled) return
        const history = knowledgeChatHistoryFromBlocks(blocks)
        setChatMessages(history.messages)
        setChatContext(history.context)
        setChatContextThreadId(threadId)
        setActiveChatThreadId(threadId)
        setChatOpen(true)
      } catch (err) {
        if (cancelled) return
        setChatError(err instanceof Error ? err.message : '加载对话记录失败')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [selectedThreadId])

  useEffect(() => {
    if (!selectedThreadId || chatContextThreadId !== selectedThreadId) return
    if (chatContext.kind !== 'file') {
      setViewingFile(null)
      return
    }
    if (loading) return
    const linkedFile = findKnowledgeFileForChatContext(tree, chatContext)
    if (linkedFile) {
      setViewingFile(linkedFile)
      setChatError(null)
      return
    }
    setViewingFile(null)
    setChatError(`未找到这条对话对应的文件“${chatContext.fileName}”，文件可能已被移动、重命名或删除。`)
  }, [chatContext, chatContextThreadId, loading, selectedThreadId, tree])

  useEffect(() => {
    if (selectedThreadId) return
    if (!currentPath) {
      setChatContext({ kind: 'global' })
      return
    }
    setChatContext({
      kind: 'folder',
      folderPath: currentPath,
      folderName: currentPath.split('/').filter(Boolean).at(-1) ?? currentPath
    })
  }, [currentPath, selectedThreadId])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const newFolderInputRef = useRef<HTMLInputElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)
  const uploadFeedbackCancelRef = useRef<(() => void) | null>(null)
  const uploadSequenceRef = useRef(0)

  useEffect(() => {
    folderInputRef.current?.setAttribute('webkitdirectory', '')
    folderInputRef.current?.setAttribute('directory', '')
  }, [])

  useEffect(() => {
    return () => uploadFeedbackCancelRef.current?.()
  }, [])

  useEffect(() => {
    if (creatingFolder) {
      newFolderInputRef.current?.focus()
      newFolderInputRef.current?.select()
    }
  }, [creatingFolder])

  const loadTree = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await requestJson<{ nodes: TreeNode[] }>(LEGALWORK_KNOWLEDGE_TREE_PATH)
      setTree(data.nodes)
    } catch (err) {
      setError(err instanceof Error ? err.message : '知识库读取失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTree()
  }, [loadTree])

  const syncKnowledgeIndex = useCallback(async (showToast = true) => {
    setSyncing(true)
    setError(null)
    try {
      const result = await requestJson<{
        documentCount: number
        candidateFileCount?: number
        truncatedFileCount?: number
        truncated?: boolean
      }>(LEGALWORK_KNOWLEDGE_SYNC_PATH, 'POST', { maxFiles: 50000 })
      if (result.truncated) {
        const total = result.candidateFileCount ?? result.documentCount + (result.truncatedFileCount ?? 0)
        const omitted = result.truncatedFileCount ?? Math.max(0, total - result.documentCount)
        setToast(`索引未覆盖全部文件：已索引 ${result.documentCount}/${total}，${omitted} 个文件受当前上限限制`)
        window.setTimeout(() => setToast(null), 6000)
      } else if (showToast) {
        setToast(`知识库索引已同步（${result.documentCount} 个文件）`)
        window.setTimeout(() => setToast(null), 2200)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '同步失败')
    } finally {
      setSyncing(false)
    }
  }, [])

  const visibleNodes = useMemo(() => {
    if (query.trim()) return flattenNodes(filterNodes(tree, query))
    const folder = findFolder(tree, currentPath)
    return currentPath ? folder?.children ?? [] : tree
  }, [currentPath, query, tree])

  const breadcrumbs = useMemo(
    () => currentPath.split('/').filter(Boolean),
    [currentPath]
  )

  const uploadFiles = useCallback(async (files: KnowledgeUploadFile[]) => {
    if (files.length === 0) return
    uploadFeedbackCancelRef.current?.()
    uploadFeedbackCancelRef.current = null
    const uploadSequence = ++uploadSequenceRef.current
    setUploading({ done: 0, total: files.length, status: 'uploading' })
    setError(null)
    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]
        const relative = fileRelativePath(file)
        const result = await window.dsGui.uploadKnowledgeFile(file, joinKnowledgePath(currentPath, relative))
        if (!result.ok) throw new Error(result.message)
        setUploading({ done: i + 1, total: files.length, status: 'uploading' })
      }
      setUploading({ done: files.length, total: files.length, status: 'success' })
      uploadFeedbackCancelRef.current = scheduleKnowledgeUploadFeedbackDismiss(
        () => {
          if (uploadSequenceRef.current !== uploadSequence) return
          setUploading((current) => current?.status === 'success'
            ? { ...current, status: 'dismissing' }
            : current)
        },
        () => {
          if (uploadSequenceRef.current !== uploadSequence) return
          setUploading(null)
          uploadFeedbackCancelRef.current = null
        }
      )

      // File persistence is already complete. Refresh the tree and index in the
      // background so they cannot keep a 100% upload notice on screen.
      void Promise.all([loadTree(), syncKnowledgeIndex(false)])
    } catch (err) {
      if (uploadSequenceRef.current === uploadSequence) setUploading(null)
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (folderInputRef.current) folderInputRef.current.value = ''
    }
  }, [currentPath, loadTree, syncKnowledgeIndex])

  const startCreateFolder = useCallback(() => {
    setNewFolderName('')
    setCreatingFolder(true)
    setError(null)
  }, [])

  const cancelCreateFolder = useCallback(() => {
    setCreatingFolder(false)
    setNewFolderName('')
  }, [])

  const confirmCreateFolder = useCallback(async () => {
    const name = newFolderName.trim()
    if (!name) {
      cancelCreateFolder()
      return
    }
    try {
      await requestJson(LEGALWORK_KNOWLEDGE_CREATE_FOLDER_PATH, 'POST', {
        path: joinKnowledgePath(currentPath, name)
      })
      await loadTree()
      setCreatingFolder(false)
      setNewFolderName('')
      setToast('文件夹已创建')
      window.setTimeout(() => setToast(null), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建文件夹失败')
    }
  }, [currentPath, loadTree, newFolderName, cancelCreateFolder])

  const syncIndex = useCallback(async () => {
    await syncKnowledgeIndex(true)
  }, [syncKnowledgeIndex])

  const closePreview = useCallback(() => {
    if (preview?.objectUrl) {
      URL.revokeObjectURL(preview.objectUrl)
    }
    setPreview(null)
  }, [preview])

  const handleBack = useCallback(() => {
    setViewingFile(null)
    onSelectThread?.(null)
  }, [onSelectThread])

  const openInSystemApp = useCallback(async (node: TreeNode) => {
    setError(null)
    try {
      const result = await window.dsGui.openKnowledgeFile(node.path)
      if (!result.ok) setError(result.message || '打开文件失败')
    } catch (err) {
      setError(err instanceof Error ? err.message : '打开文件失败')
    }
  }, [])

  const openPreview = useCallback(async (node: TreeNode) => {
    if (node.kind === 'folder') {
      setQuery('')
      setCurrentPath(node.path)
      return
    }
    const type = previewType(node)
    if (type === 'unsupported') {
      setError(`暂不支持预览 ${fileTypeLabel(node)} 文件`)
      return
    }
    setPreviewLoading(true)
    setError(null)
    closePreview()
    try {
      if (type === 'document') {
        const data = await requestJson<{ path: string; text: string; extension: string }>(
          `${LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_PATH}?path=${encodeURIComponent(node.path)}`
        )
        setPreview({ node, content: data.text, encoding: 'utf8' })
        return
      }
      const isBinary = type === 'pdf' || type === 'image' || type === 'audio'
      const data = await requestJson<{ path: string; content: string; encoding: 'utf8' | 'base64' }>(
        `${LEGALWORK_KNOWLEDGE_READ_FILE_PATH}?path=${encodeURIComponent(node.path)}${isBinary ? '&encoding=base64' : ''}`
      )
      let objectUrl: string | undefined
      if (isBinary && data.content) {
        try {
          objectUrl = buildObjectUrl(node, data.content)
        } catch {
          // buildObjectUrl can fail on invalid base64; for PDF the
          // PdfJsPreview component uses raw base64Content directly anyway
        }
      }
      setPreview({ node, content: data.content, encoding: data.encoding, objectUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : '读取文件失败')
    } finally {
      setPreviewLoading(false)
    }
  }, [closePreview])

  const openFileView = useCallback((node: TreeNode): void => {
    if (node.kind === 'folder') {
      setQuery('')
      setCurrentPath(node.path)
      return
    }
    // Unsupported formats cannot be rendered inline; open with the system app.
    if (previewType(node) === 'unsupported') {
      void openInSystemApp(node)
      return
    }
    if (preview?.objectUrl) {
      URL.revokeObjectURL(preview.objectUrl)
    }
    setPreview(null)
    setViewingFile(node)
    onSelectThread?.(null)
  }, [preview, openInSystemApp, onSelectThread])

  useEffect(() => {
    const objectUrl = preview?.objectUrl
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [preview])

  const isNodeSelected = useCallback((node: TreeNode): boolean => selectedPaths.has(node.path), [selectedPaths])

  const toggleSelectNode = useCallback((node: TreeNode, event: React.MouseEvent) => {
    setSelectedPaths((prev) => {
      const next = new Set(prev)
      if (event.shiftKey && lastSelectedPath) {
        const flat = visibleNodes
        const start = flat.findIndex((n) => n.path === lastSelectedPath)
        const end = flat.findIndex((n) => n.path === node.path)
        if (start !== -1 && end !== -1) {
          const [min, max] = start < end ? [start, end] : [end, start]
          for (let i = min; i <= max; i += 1) {
            next.add(flat[i].path)
          }
          return next
        }
      }
      if (event.metaKey || event.ctrlKey) {
        if (next.has(node.path)) next.delete(node.path)
        else next.add(node.path)
      } else {
        if (next.size === 1 && next.has(node.path)) {
          next.clear()
        } else {
          next.clear()
          next.add(node.path)
        }
      }
      return next
    })
    setLastSelectedPath(node.path)
  }, [lastSelectedPath, visibleNodes])

  const selectAllVisible = useCallback(() => {
    setSelectedPaths(new Set(visibleNodes.map((node) => node.path)))
    setLastSelectedPath(visibleNodes[visibleNodes.length - 1]?.path ?? null)
  }, [visibleNodes])

  const clearSelection = useCallback(() => {
    setSelectedPaths(new Set())
    setLastSelectedPath(null)
  }, [])

  useEffect(() => {
    clearSelection()
  }, [currentPath, query, clearSelection])

  // Register a handler so clicking [来源 N] in AI chat navigates to the file.
  useEffect(() => {
    setKnowledgeOpenFileHandler((path: string) => {
      const node = findNodeByPath(tree, path)
      if (node) openFileView(node)
    })
    return () => setKnowledgeOpenFileHandler(null)
  }, [tree, openFileView])

  // ── AI Chat handlers ──

  const pollKnowledgeChat = useCallback(async (
    threadId: string,
    turnId: string,
    maxPolls = 120
  ): Promise<{ content: string; reasoning: string }> => {
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
        const reasoningItems = turnData.items
          ?.filter((item) => (item.kind === 'reasoning_text' || item.kind === 'assistant_reasoning') && item.text)
          .map((item) => item.text ?? '')
          .join('\n\n') || ''
        const textItems = turnData.items
          ?.filter((item) => item.kind === 'assistant_text' && item.text)
          .map((item) => item.text ?? '')
          .join('\n\n') || ''
        return { content: textItems, reasoning: reasoningItems }
      }
      if (turnData.status === 'failed') {
        throw new Error(turnData.error || 'AI 响应失败')
      }
      if (turnData.status === 'aborted') {
        throw new Error('对话被中断')
      }
    }
    throw new Error('AI 响应超时')
  }, [])

  const sendKnowledgeChatMessage = useCallback(async (question: string): Promise<void> => {
    if (!question.trim() || chatSending) return
    const scopePath = currentPath.trim()
    const scopeName = scopePath.split('/').filter(Boolean).at(-1) ?? scopePath
    chatAbortRef.current?.abort()
    const abort = new AbortController()
    chatAbortRef.current = abort
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: question.trim(),
      timestamp: Date.now()
    }
    setChatMessages((prev) => [...prev, userMsg])
    setChatContext(scopePath
      ? { kind: 'folder', folderPath: scopePath, folderName: scopeName }
      : { kind: 'global' })
    setChatInput('')
    setChatSending(true)
    setChatError(null)
    setLiveReasoning('')
    setLiveAssistant('')

    try {
      const retrieval = await requestJson<KnowledgeRetrievalResult>(
        `${LEGALWORK_KNOWLEDGE_RETRIEVE_PATH}?q=${encodeURIComponent(question.trim())}&max_chars=3000&exclude_expired=true${scopePath ? `&path_prefix=${encodeURIComponent(scopePath)}` : ''}`
      )

      // Save source-to-path mapping so [来源 N] links can navigate to the file.
      const sourceMapping: Record<number, { path: string; title: string }> = {}
      for (let i = 0; i < Math.min(retrieval.sources.length, 8); i += 1) {
        const s = retrieval.sources[i]
        sourceMapping[i + 1] = { path: s.path, title: s.title }
      }
      setKnowledgeSourceMap(sourceMapping)

      const context = retrieval.contextText || '（未检索到相关知识库内容）'
      const citations = retrieval.sources.length
        ? retrieval.sources
          .slice(0, 8)
          .map((source, index) => `[来源 ${index + 1}] ${source.citation || source.title}（${source.path}，相关度 ${Math.round(source.relevanceScore * 100)}%）`)
          .join('\n')
        : '无'

      const scopeContext = scopePath
        ? `## 当前知识库范围\n文件夹：${scopeName}\n路径：${scopePath}\n\n只允许使用该文件夹及其子文件夹中的资料回答，不得引用范围之外的文件。`
        : '## 当前知识库范围\n全部文件'

      const prompt = `你是一个专业的法律知识助手。请基于以下从知识库中检索到的相关内容回答用户的问题。

${scopeContext}

## RAG 检索上下文
${context}

## 可引用来源
${citations}

## 用户问题
${question.trim()}

## 回答要求
${KNOWLEDGE_DIRECT_ANSWER_INSTRUCTION}
请基于检索到的内容给出准确、专业的回答。如果内容不足以回答问题，请明确说明。${scopePath ? '当前回答必须严格限定在上述文件夹范围内。' : ''}引用来源时请标注对应的 [来源编号]，不要编造未出现在上下文中的依据。`

      // Reuse the active knowledge-chat thread if one exists; otherwise create a side thread.
      const workspace = await getWorkspaceRoot()
      // Knowledge-base Q&A defaults to the cheap flash model. If the user has
      // explicitly configured a model (e.g. pro), respect that choice.
      const settings = await window.dsGui.getSettings()
      const configuredModel = settings?.agents?.legalwork?.model?.trim()
      const threadModel = configuredModel || 'deepseek-v4-flash'
      let threadId = activeChatThreadId
      if (!threadId) {
        const threadResult = await requestJson<{ id: string }>(
          '/v1/threads',
          'POST',
          {
            workspace,
            title: knowledgeChatTitle(question.trim()),
            model: threadModel,
            mode: 'agent',
            relation: 'side'
          }
        )
        threadId = threadResult.id
        setActiveChatThreadId(threadId)
      }

      const provider = getProvider()
      const { latestSeq } = await provider.getThreadDetail(threadId)
      const turnResponse = await requestJson<{ turnId: string }>(
        legalworkThreadTurnsPath(threadId),
        'POST',
        { prompt, model: threadModel }
      )

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
          onTool: () => undefined,
          onCompaction: () => undefined,
          onApproval: () => undefined,
          onUserInput: () => undefined,
          onUserInputStatus: () => undefined,
          onGoal: () => undefined,
          onTodos: () => undefined,
          onTurnComplete: () => settle(),
          onError: (err) => settle(err)
        }
        void provider.subscribeThreadEvents(threadId, latestSeq, sink, abort.signal).then(
          () => settle(),
          (error: unknown) => settle(error instanceof Error ? error : new Error(String(error)))
        )
      })

      if (chatAbortRef.current !== abort) return

      // Re-read the specific turn so the final message includes any delta
      // emitted before the SSE subscriber became active.
      const assistantMsg = await pollKnowledgeChat(threadId, turnResponse.turnId)
      if (chatAbortRef.current !== abort) return

      // Convert [来源 N] references to safe in-app hash links. Custom URL
      // protocols are rejected by the Markdown hardener and render [blocked].
      const markedUp = markKnowledgeSourceReferences(stripRepeatedKnowledgeQuestionLead(
        assistantMsg.content || streamedAssistant,
        question
      ))
      const finalReasoning = assistantMsg.reasoning.trim() || streamedReasoning.trim()

      setChatMessages((prev) => [...prev, {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: markedUp || '（AI 未返回任何内容）',
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
      if (chatAbortRef.current === abort) {
        chatAbortRef.current = null
        setChatSending(false)
      }
    }
  }, [chatSending, currentPath, activeChatThreadId, onChatThreadsChange, pollKnowledgeChat])

  const clearChat = useCallback((): void => {
    chatAbortRef.current?.abort()
    chatAbortRef.current = null
    setChatMessages([])
    setChatError(null)
    setLiveReasoning('')
    setLiveAssistant('')
    setChatSending(false)
    setActiveChatThreadId(null)
    setChatContext(currentPath
      ? {
          kind: 'folder',
          folderPath: currentPath,
          folderName: currentPath.split('/').filter(Boolean).at(-1) ?? currentPath
        }
      : { kind: 'global' })
    onSelectThread?.(null)
  }, [currentPath, onSelectThread])

  const handleChatKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendKnowledgeChatMessage(chatInput)
    }
  }, [chatInput, sendKnowledgeChatMessage])

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, liveAssistant, liveReasoning])

  useEffect(() => {
    return () => chatAbortRef.current?.abort()
  }, [])

  const handleRowContextMenu = useCallback((event: React.MouseEvent, node: TreeNode) => {
    event.preventDefault()
    event.stopPropagation()
    if (!selectedPaths.has(node.path)) {
      setSelectedPaths(new Set([node.path]))
      setLastSelectedPath(node.path)
    }
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, node })
  }, [selectedPaths])

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }))
  }, [])

  useEffect(() => {
    if (!contextMenu.visible) return
    const onClick = (event: MouseEvent) => {
      if (!contextMenuRef.current?.contains(event.target as Node)) closeContextMenu()
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [contextMenu.visible, closeContextMenu])

  const batchDelete = useCallback(async (paths: string[]) => {
    if (paths.length === 0) return
    const label = paths.length === 1 ? `「${paths[0].split('/').pop()}」` : `${paths.length} 个选中项`
    if (!window.confirm(`确定删除${label}吗？此操作不可撤销。`)) return
    setError(null)
    try {
      await Promise.all(
        paths.map((path) =>
          requestJson(
            `${LEGALWORK_KNOWLEDGE_DELETE_FILE_PATH}?path=${encodeURIComponent(path)}`,
            'DELETE'
          )
        )
      )
      await loadTree()
      await syncKnowledgeIndex(false)
      clearSelection()
      setToast(`已删除 ${paths.length} 项`)
      window.setTimeout(() => setToast(null), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    }
  }, [loadTree, clearSelection, syncKnowledgeIndex])

  const openMoveModal = useCallback(() => {
    const folders = collectFolders(tree)
    setMoveModal({
      visible: true,
      targetPath: currentPath,
      targetFolders: folders
    })
    closeContextMenu()
  }, [tree, currentPath, closeContextMenu])

  const confirmMove = useCallback(async () => {
    const paths = Array.from(selectedPaths)
    if (paths.length === 0) return
    const targetPrefix = moveModal.targetPath
    const invalid = paths.some((path) =>
      targetPrefix ? path === targetPrefix || isDescendantOf(targetPrefix, path) : false
    )
    if (invalid) {
      setError('不能移动到自身或其子文件夹中')
      return
    }
    setError(null)
    try {
      await Promise.all(
        paths.map((path) => {
          const name = path.split('/').pop() ?? path
          const destPath = targetPrefix ? joinKnowledgePath(targetPrefix, name) : name
          return requestJson(LEGALWORK_KNOWLEDGE_MOVE_PATH, 'POST', {
            sourcePath: path,
            destPath
          })
        })
      )
      await loadTree()
      await syncKnowledgeIndex(false)
      clearSelection()
      setMoveModal((prev) => ({ ...prev, visible: false }))
      setToast(`已移动 ${paths.length} 项`)
      window.setTimeout(() => setToast(null), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '移动失败')
    }
  }, [selectedPaths, moveModal.targetPath, loadTree, clearSelection, syncKnowledgeIndex])

  const classifyPaths = useCallback(async (paths: string[]) => {
    const selected = paths.length > 0 ? paths : visibleNodes.map((node) => node.path)
    if (selected.length === 0 || classifying) return
    setClassifying(true)
    setError(null)
    closeContextMenu()
    try {
      const result = await requestJson<KnowledgeClassifyResult>(
        LEGALWORK_KNOWLEDGE_CLASSIFY_PATH,
        'POST',
        { paths: selected }
      )
      await loadTree()
      clearSelection()
      const skippedText = result.skipped.length ? `，跳过 ${result.skipped.length} 项` : ''
      setToast(`已智能分类 ${result.moved.length} 项${skippedText}`)
      window.setTimeout(() => setToast(null), 2600)
    } catch (err) {
      setError(err instanceof Error ? err.message : '智能分类失败')
    } finally {
      setClassifying(false)
    }
  }, [classifying, visibleNodes, closeContextMenu, loadTree, clearSelection])

  const openBreadcrumb = (index: number): void => {
    setCurrentPath(breadcrumbs.slice(0, index + 1).join('/'))
  }

  const onDrop = (event: ReactDragEvent<HTMLElement>): void => {
    event.preventDefault()
    setDragActive(false)
    void filesFromDrop(event.dataTransfer)
      .then((files) => uploadFiles(files))
      .catch((err) => setError(err instanceof Error ? err.message : '拖拽上传失败'))
  }

  const effectiveChatSidebarWidth = knowledgeLayoutWidth > 0
    ? Math.max(300, Math.min(chatSidebarWidth, 560, Math.floor(knowledgeLayoutWidth * 0.38)))
    : Math.min(chatSidebarWidth, 560)
  const showLibrarySidebar = !chatOpen || knowledgeLayoutWidth === 0 || knowledgeLayoutWidth >= 1040

  if (viewingFile) {
    return (
      <KnowledgeFileViewErrorBoundary
        key={viewingFile.path}
        fileName={viewingFile.name}
        onBack={handleBack}
      >
        <KnowledgeBaseFileView
          node={viewingFile}
          onBack={handleBack}
          selectedThreadId={selectedThreadId}
          onSelectThread={onSelectThread}
          onChatThreadsChange={onChatThreadsChange}
        />
      </KnowledgeFileViewErrorBoundary>
    )
  }

  return (
    <section
      className="ds-no-drag flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-[var(--ds-main)]"
      onDragOver={(event) => {
        event.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) setDragActive(false)
      }}
      onDrop={onDrop}
    >
      <header className="flex h-[74px] shrink-0 items-center justify-between gap-5 border-b border-ds-border bg-[color-mix(in_srgb,var(--ds-card-soft)_78%,transparent)] px-6 backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[color-mix(in_srgb,var(--ds-accent)_13%,transparent)] text-[var(--ds-accent)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ds-accent)_16%,transparent)]">
            <Database className="h-[19px] w-[19px]" strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[20px] font-semibold tracking-[-0.02em] text-[var(--ds-ink)]">知识库</h1>
            <p className="mt-0.5 truncate text-[12px] text-[var(--ds-muted)]">资料会在任务中被自动检索和引用</p>
          </div>
        </div>
        <div
          data-control-hover-root
          data-control-hover-layered
          className="relative flex shrink-0 items-center gap-1.5"
        >
          <div className="mr-1 flex items-center rounded-[var(--lg-radius-selection)] border border-ds-border bg-[var(--ds-card-soft)] p-0.5 shadow-sm">
            <button
              type="button"
              data-control-hover-target
              data-control-active="true"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-8 items-center gap-1.5 rounded-[calc(var(--lg-radius-selection)_-_3px)] bg-[var(--ds-accent)] px-3 text-[12.5px] font-semibold text-white shadow-[0_3px_10px_color-mix(in_srgb,var(--ds-accent)_22%,transparent)] transition duration-150 hover:brightness-105 active:scale-[0.985]"
            >
              <Upload className="h-3.5 w-3.5" strokeWidth={1.9} />
              <span>上传</span>
            </button>
            <button
              type="button"
              data-control-hover-target
              onClick={() => folderInputRef.current?.click()}
              className="ml-0.5 flex h-8 w-8 items-center justify-center rounded-[calc(var(--lg-radius-selection)_-_3px)] text-[var(--ds-muted)] transition duration-150 hover:bg-ds-hover hover:text-[var(--ds-ink)] active:scale-[0.97]"
              title="上传文件夹"
            >
              <FolderPlus className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
          <div className="mx-0.5 h-5 w-px bg-[var(--ds-border)]" />
          <button
            type="button"
            data-control-hover-target
            onClick={() => void startCreateFolder()}
            className="flex h-9 w-9 items-center justify-center rounded-[9px] text-[var(--ds-muted)] transition duration-150 hover:bg-ds-hover hover:text-[var(--ds-ink)] active:scale-[0.97]"
            title="新建文件夹"
          >
            <FolderPlus className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            data-control-hover-target
            disabled={syncing}
            onClick={() => void syncIndex()}
            className="flex h-9 w-9 items-center justify-center rounded-[9px] text-[var(--ds-muted)] transition duration-150 hover:bg-ds-hover hover:text-[var(--ds-ink)] active:scale-[0.97] disabled:opacity-50"
            title="同步索引"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            data-control-hover-target
            data-control-active={chatOpen ? 'true' : undefined}
            onClick={() => setChatOpen((prev) => !prev)}
            className={`ml-1 inline-flex h-9 items-center gap-1.5 rounded-[9px] border px-3 text-[12.5px] font-medium transition duration-150 active:scale-[0.985] ${
              chatOpen
                ? 'border-[var(--ds-accent)] bg-[var(--ds-accent)] text-white shadow-[0_3px_10px_color-mix(in_srgb,var(--ds-accent)_22%,transparent)]'
                : 'border-ds-border bg-[var(--ds-card-soft)] text-[var(--ds-ink)] shadow-sm hover:bg-ds-hover'
            }`}
            title="AI 知识库对话"
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>AI 对话</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => void uploadFiles(Array.from(event.target.files ?? []) as KnowledgeUploadFile[])}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => void uploadFiles(Array.from(event.target.files ?? []) as KnowledgeUploadFile[])}
        />
      </header>

      <div ref={knowledgeLayoutRef} className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {showLibrarySidebar ? (
        <aside
          data-sidebar-hover-root
          className="relative flex w-[218px] shrink-0 flex-col overflow-hidden border-r border-ds-border bg-[color-mix(in_srgb,var(--ds-sidebar-field-bg)_62%,transparent)] px-3 pb-3 pt-4"
        >
          <span aria-hidden data-sidebar-hover-indicator />
          <div className="px-2 pb-2 text-[10.5px] font-semibold text-[var(--ds-faint)]">资料库</div>
          <button
            type="button"
            data-sidebar-hover-target
            data-sidebar-active={!currentPath ? 'true' : undefined}
            onClick={() => {
              setQuery('')
              setCurrentPath('')
            }}
            className={`flex h-9 w-full items-center gap-2 rounded-[12px] px-2.5 text-left text-[12.5px] font-medium transition ${
              !currentPath
                ? 'bg-[color-mix(in_srgb,var(--ds-accent)_13%,transparent)] text-[var(--ds-accent)]'
                : 'text-[var(--ds-ink)] hover:bg-ds-hover'
            }`}
          >
            <Database className="h-4 w-4 shrink-0" strokeWidth={1.7} />
            <span className="min-w-0 flex-1 truncate">全部文件</span>
            <span className="text-[10.5px] font-normal tabular-nums text-[var(--ds-faint)]">{tree.length}</span>
          </button>
          <div className="mt-5 px-2 pb-2 text-[10.5px] font-semibold text-[var(--ds-faint)]">文件夹</div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {tree.filter((node) => node.kind === 'folder').map((node) => {
              const active = currentPath === node.path || currentPath.startsWith(`${node.path}/`)
              return (
                <button
                  key={node.path}
                  type="button"
                  data-sidebar-hover-target
                  data-sidebar-active={active ? 'true' : undefined}
                  onClick={() => {
                    setQuery('')
                    setCurrentPath(node.path)
                  }}
                  className={`group/folder flex min-h-9 w-full items-center gap-2 rounded-[12px] px-2.5 py-1.5 text-left text-[12.5px] transition ${
                    active
                      ? 'bg-[color-mix(in_srgb,var(--ds-accent)_13%,transparent)] font-medium text-[var(--ds-accent)]'
                      : 'text-[var(--ds-ink)] hover:bg-ds-hover'
                  }`}
                  title={node.name}
                >
                  <KnowledgeFileIcon node={node} size={20} />
                  <span className="min-w-0 flex-1 truncate">{node.name}</span>
                </button>
              )
            })}
            {!loading && tree.every((node) => node.kind !== 'folder') ? (
              <div className="px-2.5 py-3 text-[11.5px] leading-5 text-[var(--ds-faint)]">还没有文件夹</div>
            ) : null}
          </div>
          <div className="border-t border-ds-border pt-3">
            <button
              type="button"
              data-sidebar-hover-target
              disabled={classifying || visibleNodes.length === 0}
              onClick={() => void classifyPaths([])}
              className="flex h-9 w-full items-center gap-2 rounded-[12px] px-2.5 text-left text-[12.5px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)] disabled:opacity-50"
              title="读取正文并调用模型分类当前列表"
            >
              <Sparkles className={`h-4 w-4 text-[var(--ds-accent)] ${classifying ? 'animate-pulse' : ''}`} strokeWidth={1.7} />
              <span>{classifying ? '正在智能整理' : '智能整理当前列表'}</span>
            </button>
          </div>
        </aside>
        ) : null}

        <div className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-5 py-4 transition-all ${preview && !chatOpen ? 'pr-4' : ''}`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div data-control-hover-root className="flex min-w-0 items-center gap-0.5 text-[13px] text-[var(--ds-muted)]">
              <button
                type="button"
                onClick={() => setCurrentPath('')}
                className="rounded-[7px] px-2 py-1 text-[var(--ds-ink)] font-medium transition hover:bg-ds-hover"
              >
                全部文件
              </button>
              {breadcrumbs.map((part, index) => (
                <span key={`${part}-${index}`} className="flex min-w-0 items-center gap-0.5">
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--ds-muted)]" strokeWidth={1.8} />
                  <button
                    type="button"
                    onClick={() => openBreadcrumb(index)}
                    className="max-w-[220px] truncate rounded-[7px] px-2 py-1 transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  >
                    {part}
                  </button>
                </span>
              ))}
            </div>
            <div className="relative w-full max-w-[320px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-muted)]" strokeWidth={1.8} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索"
                className="h-9 w-full rounded-[10px] border border-ds-border bg-[var(--ds-card-soft)] pl-9 pr-3 text-[13px] text-[var(--ds-ink)] shadow-sm outline-none transition focus:border-[color-mix(in_srgb,var(--ds-accent)_48%,transparent)] focus:bg-[var(--ds-card-strong)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--ds-accent)_10%,transparent)]"
              />
            </div>
          </div>

          {error ? (
            <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600 dark:border-red-900/50 dark:bg-red-950/20">
              {error}
            </div>
          ) : null}

          {toast ? (
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              <span>{toast}</span>
            </div>
          ) : null}

          {selectedPaths.size > 0 ? (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-ds-border bg-ds-card px-4 py-2.5">
              <div className="flex items-center gap-2 text-[13px] text-[var(--ds-ink)]">
                <button
                  type="button"
                  onClick={selectAllVisible}
                  className="rounded-[6px] px-2 py-1 text-[var(--ds-muted)] hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  title="全选"
                >
                  <CheckSquare className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <span className="font-medium">已选择 {selectedPaths.size} 项</span>
              </div>
              <div data-control-hover-root className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={classifying}
                  onClick={() => void classifyPaths(Array.from(selectedPaths))}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-ds-border bg-ds-card px-3 text-[12px] font-medium text-[var(--ds-ink)] transition hover:bg-ds-hover disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${classifying ? 'animate-pulse' : ''}`} strokeWidth={1.8} />
                  <span>{classifying ? '整理中' : '智能分类'}</span>
                </button>
                <button
                  type="button"
                  onClick={openMoveModal}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-ds-border bg-ds-card px-3 text-[12px] font-medium text-[var(--ds-ink)] transition hover:bg-ds-hover"
                >
                  <Move className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>移动到</span>
                </button>
                <button
                  type="button"
                  data-control-hover-preserve
                  onClick={() => void batchDelete(Array.from(selectedPaths))}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-red-200 bg-red-50 px-3 text-[12px] font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:hover:bg-red-900/40"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>删除</span>
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[6px] px-3 text-[12px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <span>取消</span>
                </button>
              </div>
            </div>
          ) : null}

          <div className="relative min-h-0 flex-1 overflow-x-auto overflow-y-hidden rounded-[12px] border border-ds-border bg-[var(--ds-card-soft)] shadow-[var(--ds-shadow-card-soft)]">
            {dragActive ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[color-mix(in_srgb,var(--ds-accent)_12%,transparent)] backdrop-blur-[1px]">
                <div className="rounded-[8px] border border-dashed border-[var(--ds-accent)] bg-ds-card px-8 py-6 text-center text-[14px] font-medium text-[var(--ds-ink)] shadow-lg">
                  松开即可上传到当前文件夹
                </div>
              </div>
            ) : null}
            {uploading ? (
              <div
                role="status"
                aria-live="polite"
                className={`knowledge-upload-feedback absolute left-4 right-4 top-4 z-[30] rounded-[16px] border px-4 py-3 backdrop-blur-xl ${
                  uploading.status === 'uploading'
                    ? 'border-ds-border'
                    : 'knowledge-upload-feedback-success border-[color-mix(in_srgb,var(--ds-success)_28%,var(--ds-border))]'
                } ${
                  uploading.status === 'dismissing' ? 'knowledge-upload-feedback-exit' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[12px]">
                  <div className="flex min-w-0 items-center gap-2.5">
                    {uploading.status === 'uploading' ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[var(--ds-accent)]" strokeWidth={1.9} />
                    ) : (
                      <span className="knowledge-upload-success-icon relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--ds-success)] text-white">
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    )}
                    {uploading.status === 'uploading' ? (
                      <span className="text-[var(--ds-muted)]">
                        正在上传 {uploading.done}/{uploading.total}
                      </span>
                    ) : (
                      <span className="flex min-w-0 flex-col">
                        <span className="font-semibold leading-4 text-[var(--ds-ink)]">上传成功</span>
                        <span className="mt-0.5 text-[11px] leading-4 text-[var(--ds-muted)]">
                          已添加 {uploading.total} 个文件
                        </span>
                      </span>
                    )}
                  </div>
                  <span className={uploading.status === 'uploading'
                    ? 'text-[var(--ds-muted)]'
                    : 'font-medium text-[var(--ds-success)]'}
                  >
                    {uploading.status === 'uploading'
                      ? `${Math.round((uploading.done / Math.max(uploading.total, 1)) * 100)}%`
                      : '完成'}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--ds-sidebar-field-bg)]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      uploading.status === 'uploading'
                        ? 'bg-[var(--ds-accent)]'
                        : 'knowledge-upload-success-progress bg-[var(--ds-success)]'
                    }`}
                    style={{ width: `${(uploading.done / Math.max(uploading.total, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="grid h-10 grid-cols-[40px_minmax(260px,1fr)_112px_112px_132px_54px] items-center border-b border-ds-border bg-[color-mix(in_srgb,var(--ds-sidebar-field-bg)_40%,transparent)] px-4 text-[11.5px] font-medium text-[var(--ds-muted)]">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={selectedPaths.size === visibleNodes.length && visibleNodes.length > 0 ? clearSelection : selectAllVisible}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  title={selectedPaths.size === visibleNodes.length && visibleNodes.length > 0 ? '取消全选' : '全选'}
                >
                  {selectedPaths.size === visibleNodes.length && visibleNodes.length > 0 ? (
                    <CheckSquare className="h-4 w-4" strokeWidth={1.8} />
                  ) : selectedPaths.size > 0 ? (
                    <div className="relative flex h-4 w-4 items-center justify-center rounded-[4px] border-2 border-[var(--ds-accent)] bg-[var(--ds-accent)]">
                      <span className="absolute block h-[2px] w-2 bg-white" />
                    </div>
                  ) : (
                    <Square className="h-4 w-4" strokeWidth={1.8} />
                  )}
                </button>
              </div>
              <div>名称</div>
              <div>类型</div>
              <div>大小</div>
              <div>更新时间</div>
              <div />
            </div>

            <div
              data-sidebar-hover-root
              data-knowledge-row-hover-root
              className="h-[calc(100%-40px)] overflow-y-auto"
            >
              <span aria-hidden="true" data-sidebar-hover-indicator />
              {loading && visibleNodes.length === 0 ? (
                <div className="flex h-full items-center justify-center gap-2 text-[13px] text-[var(--ds-muted)]">
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                  加载中...
                </div>
              ) : visibleNodes.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[13px] text-[var(--ds-muted)]">
                  <Folder className="h-10 w-10 text-[color-mix(in_srgb,var(--ds-accent)_45%,transparent)]" strokeWidth={1.4} />
                  <div>{query.trim() ? '没有匹配的文件' : '当前文件夹为空'}</div>
                  <div className="text-[12px]">可以上传文件、上传文件夹，或直接把文件拖到这里。</div>
                </div>
              ) : (
                visibleNodes.map((node) => (
                  <div
                    key={node.path}
                    data-sidebar-hover-target
                    data-sidebar-active={isNodeSelected(node) ? 'true' : undefined}
                    className={`group grid min-h-[54px] grid-cols-[40px_minmax(260px,1fr)_112px_112px_132px_54px] items-center border-b border-[color-mix(in_srgb,var(--ds-border)_56%,transparent)] px-4 text-[13.5px] transition-colors duration-150 last:border-b-0 ${
                      isNodeSelected(node)
                        ? 'bg-[color-mix(in_srgb,var(--ds-accent)_11%,transparent)]'
                        : ''
                    }`}
                    onDoubleClick={() => void openFileView(node)}
                    onContextMenu={(event) => handleRowContextMenu(event, node)}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={(event) => toggleSelectNode(node, event)}
                        className={`flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)] ${
                          isNodeSelected(node) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                        }`}
                      >
                        {isNodeSelected(node) ? (
                          <CheckSquare className="h-4 w-4 text-[var(--ds-accent)]" strokeWidth={1.8} />
                        ) : (
                          <Square className="h-4 w-4" strokeWidth={1.8} />
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey) {
                          toggleSelectNode(node, event)
                        } else {
                          void openFileView(node)
                        }
                      }}
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <KnowledgeFileIcon node={node} size={27} />
                      <span className="min-w-0 truncate font-medium tracking-[-0.005em] text-[var(--ds-ink)]">{node.name}</span>
                    </button>
                    <div className="flex"><KnowledgeFileTypeBadge node={node} /></div>
                    <div className="text-[12.5px] text-[var(--ds-muted)] tabular-nums">{formatBytes(node.sizeBytes)}</div>
                    <div className="text-[12.5px] text-[var(--ds-muted)]">{formatDate(node.updatedAt)}</div>
                    <div data-control-hover-root className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                      {node.kind === 'file' && previewType(node) !== 'unsupported' ? (
                        <button
                          type="button"
                          onClick={() => void openPreview(node)}
                          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                          title="预览"
                        >
                          <Eye className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        data-control-hover-preserve
                        onClick={() => void batchDelete([node.path])}
                        className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {currentPath ? (
            <button
              type="button"
              onClick={() => {
                const parts = currentPath.split('/').filter(Boolean)
                parts.pop()
                setCurrentPath(parts.join('/'))
              }}
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-[8px] border border-ds-border bg-ds-card px-3 py-2 text-[12px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
              <span>返回上级</span>
            </button>
          ) : null}
        </div>

        {preview && !chatOpen ? (
          <aside className="ds-no-drag flex h-full w-[min(50%,560px)] min-w-[360px] flex-col border-l border-ds-border bg-ds-card">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-ds-border px-4">
              <div className="flex min-w-0 items-center gap-2">
                <FileCode2 className="h-4 w-4 shrink-0 text-[var(--ds-muted)]" strokeWidth={1.8} />
                <span className="min-w-0 truncate text-[13px] font-medium text-[var(--ds-ink)]" title={preview.node.name}>
                  {preview.node.name}
                </span>
              </div>
              <button
                type="button"
                onClick={closePreview}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                title="关闭预览"
              >
                <PanelRightClose className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              {previewLoading ? (
                <div className="flex h-full items-center justify-center gap-2 text-[13px] text-[var(--ds-muted)]">
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                  正在读取...
                </div>
              ) : previewType(preview.node) === 'pdf' && preview.content ? (
                <PdfJsPreview base64Content={preview.content} fileName={preview.node.name} />
              ) : previewType(preview.node) === 'image' && preview.objectUrl ? (
                <img
                  src={preview.objectUrl}
                  alt={preview.node.name}
                  className="h-auto w-full object-contain"
                />
              ) : previewType(preview.node) === 'audio' && preview.objectUrl ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
                  <AudioLines className="h-12 w-12 text-[var(--ds-accent)]" strokeWidth={1.5} />
                  <audio src={preview.objectUrl} controls className="w-full max-w-md" />
                  <div className="text-[12px] text-[var(--ds-muted)]">{preview.node.name}</div>
                </div>
              ) : previewType(preview.node) === 'markdown' ? (
                <AssistantMarkdown
                  text={preview.content}
                  streaming={false}
                  className="ds-markdown ds-chat-answer break-words px-5 py-4 leading-6 text-[var(--ds-ink)]"
                />
              ) : previewType(preview.node) === 'document' ? (
                <pre className="whitespace-pre-wrap p-5 font-sans text-[13px] leading-[22px] text-[var(--ds-ink)]">
                  {preview.content || '未能从该文档中提取到可预览文本。'}
                </pre>
              ) : previewType(preview.node) === 'text' ? (
                <pre className="whitespace-pre-wrap p-5 font-mono text-[12px] leading-[20px] text-[var(--ds-ink)]">
                  {preview.content}
                </pre>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-[13px] text-[var(--ds-muted)]">
                  <File className="h-10 w-10 text-slate-300" strokeWidth={1.4} />
                  <div>暂不支持预览该文件</div>
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center justify-between border-t border-ds-border px-4 py-2 text-[12px] text-[var(--ds-muted)]">
              <span>{fileTypeLabel(preview.node)} · {formatBytes(preview.node.sizeBytes)}</span>
              <div data-control-hover-root className="flex items-center gap-1">
                {!['text', 'markdown', 'document'].includes(previewType(preview.node)) ? (
                  <button
                    type="button"
                    onClick={() => void openInSystemApp(preview.node)}
                    className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
                    <span>系统打开</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={closePreview}
                  className="rounded-[6px] px-2 py-1 hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                >
                  关闭
                </button>
              </div>
            </div>
          </aside>
        ) : null}

        {/* AI Chat sidebar */}
        {chatSidebarPresent ? (
          <aside
            data-motion={chatOpen ? 'enter' : 'exit'}
            className="ds-knowledge-chat-sidebar ds-no-drag relative flex h-full min-w-0 shrink-0 flex-col overflow-hidden border-l border-ds-border bg-ds-card"
            style={{
              '--knowledge-chat-sidebar-width': `${effectiveChatSidebarWidth}px`
            } as CSSProperties}
          >
            {/* Drag handle */}
            <div
              className="absolute left-0 top-0 z-10 h-full w-1.5 cursor-col-resize bg-transparent transition hover:bg-[var(--ds-accent)] active:bg-[var(--ds-accent)]"
              onMouseDown={(e) => {
                e.preventDefault()
                chatSidebarDragRef.current = { startX: e.clientX, startWidth: effectiveChatSidebarWidth }
                const onMove = (ev: MouseEvent): void => {
                  if (!chatSidebarDragRef.current) return
                  const dx = chatSidebarDragRef.current.startX - ev.clientX
                  const responsiveMax = knowledgeLayoutWidth > 0
                    ? Math.max(300, Math.min(680, Math.floor(knowledgeLayoutWidth * 0.48)))
                    : 680
                  const next = Math.max(300, Math.min(responsiveMax, chatSidebarDragRef.current.startWidth + dx))
                  setChatSidebarWidth(next)
                }
                const onUp = (): void => {
                  chatSidebarDragRef.current = null
                  window.removeEventListener('mousemove', onMove)
                  window.removeEventListener('mouseup', onUp)
                }
                window.addEventListener('mousemove', onMove)
                window.addEventListener('mouseup', onUp)
              }}
            />
            <KnowledgeChatHeader
              title="知识库 AI 对话"
              contextLabel={chatContext.kind === 'file'
                ? `当前文件 · ${chatContext.fileName}`
                : chatContext.kind === 'folder'
                  ? `当前文件夹 · ${chatContext.folderName}`
                  : '全局知识库'}
              actions={(
                <>
              {chatMessages.length > 0 || liveAssistant || liveReasoning ? (
                <button
                  type="button"
                  onClick={clearChat}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  title="清空对话"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              ) : null}
                <button
                  type="button"
                  onClick={() => setChatOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
                  title="收起 AI 对话"
                >
                  <PanelRightClose className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
                </>
              )}
            />

            {chatMessages.length === 0 && !chatSending && !liveAssistant && !liveReasoning ? (
              <KnowledgeChatEmptyState
                visual={<Sparkles className="h-5 w-5 text-[var(--ds-accent)]" strokeWidth={1.7} />}
                title={chatContext.kind === 'file'
                  ? '关于此文件提问'
                  : chatContext.kind === 'folder'
                    ? '关于此文件夹提问'
                    : '与知识库对话'}
                description={chatContext.kind === 'file'
                  ? '基于当前文件内容进行对话，可询问关键信息、法律条款、风险分析或内容总结。'
                  : chatContext.kind === 'folder'
                    ? '只检索当前文件夹及其子文件夹，回答不会混入其他目录的内容。'
                    : '检索整个知识库后回答问题，可用于法律条款、案例分析、跨文件归纳与总结。'}
                contextLabel={chatContext.kind === 'file'
                  ? chatContext.fileName
                  : chatContext.kind === 'folder'
                    ? chatContext.folderPath
                    : '全部文件'}
              />
            ) : (
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {chatMessages.map((msg) => (
                  <KnowledgeChatMessage
                    key={msg.id}
                    role={msg.role}
                    timestamp={msg.timestamp}
                  >
                    {msg.role === 'assistant' ? (
                      <KnowledgeAssistantContent
                        content={msg.content}
                        reasoning={msg.reasoning}
                      />
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    )}
                  </KnowledgeChatMessage>
                ))}

                {liveReasoning ? (
                  <KnowledgeChatMessage role="reasoning">
                    <AssistantMarkdown
                      text={liveReasoning}
                      streaming
                      className="ds-markdown ds-chat-answer break-words !text-[12px]"
                    />
                  </KnowledgeChatMessage>
                ) : null}

                {liveAssistant ? (
                  <KnowledgeChatMessage role="assistant">
                    <AssistantMarkdown
                      text={liveAssistant}
                      streaming
                      className="ds-markdown ds-chat-answer break-words !text-[13px]"
                    />
                  </KnowledgeChatMessage>
                ) : null}

                {chatSending && !liveAssistant && !liveReasoning ? (
                  <KnowledgeChatMessage role="assistant">
                    <div className="flex items-center gap-2 text-[var(--ds-muted)]">
                      <ThinkingOrbStatus
                        state={resolveOrbState({
                          busy: true,
                          liveReasoning,
                          waitingForUserInput: false
                        })}
                        size={20}
                      />
                      <span>AI 思考中...</span>
                    </div>
                  </KnowledgeChatMessage>
                ) : null}

                {chatError ? (
                  <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600 dark:border-red-900/50 dark:bg-red-950/20">
                    {chatError}
                  </div>
                ) : null}

                <div ref={chatMessagesEndRef} />
              </div>
            )}

            <KnowledgeChatComposer
              value={chatInput}
              placeholder={chatContext.kind === 'file'
                ? '输入关于文件的问题...'
                : chatContext.kind === 'folder'
                  ? `输入关于“${chatContext.folderName}”的问题...`
                  : '输入关于知识库的问题...'}
              disabled={chatSending}
              onChange={setChatInput}
              onKeyDown={handleChatKeyDown}
              onSend={() => void sendKnowledgeChatMessage(chatInput)}
            />
          </aside>
        ) : null}
      </div>

      {creatingFolder ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
          onClick={(event) => {
            if (event.currentTarget === event.target) cancelCreateFolder()
          }}
        >
          <div className="w-full max-w-sm rounded-[12px] border border-ds-border bg-ds-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[var(--ds-ink)]">新建文件夹</h3>
              <button
                type="button"
                onClick={cancelCreateFolder}
                className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <input
              ref={newFolderInputRef}
              type="text"
              value={newFolderName}
              onChange={(event) => setNewFolderName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void confirmCreateFolder()
                } else if (event.key === 'Escape') {
                  cancelCreateFolder()
                }
              }}
              placeholder="文件夹名称"
              className="mb-4 h-10 w-full rounded-[8px] border border-ds-border bg-ds-main px-3 text-[14px] text-[var(--ds-ink)] outline-none transition focus:border-[var(--ds-accent)]"
            />
            <div data-control-hover-root className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelCreateFolder}
                className="rounded-[8px] border border-ds-border bg-ds-card px-4 py-2 text-[13px] font-medium text-[var(--ds-ink)] transition hover:bg-ds-hover"
              >
                取消
              </button>
              <button
                type="button"
                disabled={!newFolderName.trim()}
                onClick={() => void confirmCreateFolder()}
                className="rounded-[8px] bg-[var(--ds-accent)] px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {contextMenu.visible ? (
        <div
          ref={contextMenuRef}
          data-control-hover-root
          className="fixed z-50 min-w-[160px] rounded-[8px] border border-ds-border bg-ds-card py-1 shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            type="button"
            onClick={() => {
              const node = contextMenu.node
              if (node) void openPreview(node)
              closeContextMenu()
            }}
            disabled={!contextMenu.node || contextMenu.node.kind === 'folder' || previewType(contextMenu.node) === 'unsupported'}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[var(--ds-ink)] transition hover:bg-ds-hover disabled:opacity-40"
          >
            <Eye className="h-4 w-4 text-[var(--ds-muted)]" strokeWidth={1.8} />
            <span>预览</span>
          </button>
          <button
            type="button"
            onClick={() => {
              openMoveModal()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[var(--ds-ink)] transition hover:bg-ds-hover"
          >
            <Move className="h-4 w-4 text-[var(--ds-muted)]" strokeWidth={1.8} />
            <span>移动到</span>
          </button>
          <div className="my-1 border-t border-ds-border" />
          <button
            type="button"
            data-control-hover-preserve
            onClick={() => {
              void batchDelete(Array.from(selectedPaths))
              closeContextMenu()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            <span>删除</span>
          </button>
        </div>
      ) : null}

      {moveModal.visible ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]"
          onClick={(event) => {
            if (event.currentTarget === event.target) setMoveModal((prev) => ({ ...prev, visible: false }))
          }}
        >
          <div className="w-full max-w-sm rounded-[12px] border border-ds-border bg-ds-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[var(--ds-ink)]">
                移动 {selectedPaths.size} 项到
              </h3>
              <button
                type="button"
                onClick={() => setMoveModal((prev) => ({ ...prev, visible: false }))}
                className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <div data-control-hover-root className="mb-4 max-h-[240px] overflow-y-auto rounded-[8px] border border-ds-border">
              <button
                type="button"
                data-control-active={moveModal.targetPath === '' ? 'true' : undefined}
                onClick={() => setMoveModal((prev) => ({ ...prev, targetPath: '' }))}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition hover:bg-ds-hover ${
                  moveModal.targetPath === '' ? 'bg-[color-mix(in_srgb,var(--ds-accent)_8%,transparent)] text-[var(--ds-ink)]' : 'text-[var(--ds-muted)]'
                }`}
              >
                <Folder className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
                <span>根目录</span>
              </button>
              {moveModal.targetFolders.map((folder) => {
                const selectedCount = Array.from(selectedPaths).filter((p) => p === folder.path || isDescendantOf(p, folder.path)).length
                return (
                  <button
                    key={folder.path}
                    type="button"
                    data-control-active={moveModal.targetPath === folder.path ? 'true' : undefined}
                    onClick={() => setMoveModal((prev) => ({ ...prev, targetPath: folder.path }))}
                    disabled={selectedCount > 0}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition hover:bg-ds-hover disabled:opacity-40 ${
                      moveModal.targetPath === folder.path ? 'bg-[color-mix(in_srgb,var(--ds-accent)_8%,transparent)] text-[var(--ds-ink)]' : 'text-[var(--ds-muted)]'
                    }`}
                    style={{ paddingLeft: 12 + (folder.path.split('/').length - 1) * 16 }}
                  >
                    <Folder className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
                    <span className="min-w-0 flex-1 truncate">{folder.name}</span>
                    {selectedCount > 0 ? <span className="text-[10px]">已选</span> : null}
                  </button>
                )
              })}
            </div>
            <div data-control-hover-root className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMoveModal((prev) => ({ ...prev, visible: false }))}
                className="rounded-[8px] border border-ds-border bg-ds-card px-4 py-2 text-[13px] font-medium text-[var(--ds-ink)] transition hover:bg-ds-hover"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => void confirmMove()}
                className="rounded-[8px] bg-[var(--ds-accent)] px-4 py-2 text-[13px] font-medium text-white transition hover:opacity-90"
              >
                移动
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
