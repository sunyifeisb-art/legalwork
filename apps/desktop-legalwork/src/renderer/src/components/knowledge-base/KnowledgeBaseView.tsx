import type { DragEvent as ReactDragEvent, ReactElement } from 'react'
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
  FileArchive,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Folder,
  FolderPlus,
  Loader2,
  MoreHorizontal,
  Move,
  PanelRightClose,
  RefreshCw,
  Search,
  Square,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'
import {
  LEGALWORK_KNOWLEDGE_CREATE_FOLDER_PATH,
  LEGALWORK_KNOWLEDGE_DELETE_FILE_PATH,
  LEGALWORK_KNOWLEDGE_MOVE_PATH,
  LEGALWORK_KNOWLEDGE_READ_FILE_PATH,
  LEGALWORK_KNOWLEDGE_SYNC_PATH,
  LEGALWORK_KNOWLEDGE_TREE_PATH,
  LEGALWORK_KNOWLEDGE_WRITE_FILE_PATH
} from '../../../../shared/legalwork-endpoints'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

import type { KnowledgeTreeNode } from './types'
import { KnowledgeBaseFileView } from './KnowledgeBaseFileView'
type TreeNode = KnowledgeTreeNode

type UploadSummary = {
  done: number
  total: number
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

function joinKnowledgePath(base: string, child: string): string {
  const parts = [base, child]
    .join('/')
    .replaceAll('\\', '/')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.join('/')
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

function iconForNode(node: TreeNode): ReactElement {
  if (node.kind === 'folder') return <Folder className="h-5 w-5 text-emerald-300" strokeWidth={1.6} />
  const ext = (node.extension || node.name.split('.').pop() || '').replace(/^\./, '').toLowerCase()
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) {
    return <AudioLines className="h-5 w-5 text-cyan-500" strokeWidth={1.7} />
  }
  if (['doc', 'docx', 'pdf', 'txt', 'md', 'markdown'].includes(ext)) {
    return <FileText className="h-5 w-5 text-slate-400" strokeWidth={1.6} />
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FileSpreadsheet className="h-5 w-5 text-emerald-500" strokeWidth={1.6} />
  }
  if (['zip', 'rar', '7z'].includes(ext)) {
    return <FileArchive className="h-5 w-5 text-amber-500" strokeWidth={1.6} />
  }
  return <File className="h-5 w-5 text-slate-300" strokeWidth={1.6} />
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

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result ?? '')
      resolve(value.includes(',') ? value.slice(value.indexOf(',') + 1) : value)
    }
    reader.onerror = () => reject(reader.error ?? new Error('读取文件失败'))
    reader.readAsDataURL(file)
  })
}

type PreviewFile = {
  node: TreeNode
  content: string
  encoding: 'utf8' | 'base64'
  objectUrl?: string
}

type PreviewType = 'text' | 'pdf' | 'image' | 'audio' | 'unsupported'

type PdfRenderedPage = {
  pageNumber: number
  width: number
  height: number
  dataUrl: string
}

const PDF_RENDER_TIMEOUT_MS = 20000
const PDFJS_ASSET_BASE_URL = new URL('pdfjs/', window.location.href).toString()

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

function fileExtension(node: TreeNode): string {
  return (node.extension || node.name.split('.').pop() || '').replace(/^\./, '').toLowerCase()
}

function previewType(node: TreeNode): PreviewType {
  const ext = fileExtension(node)
  if (['pdf'].includes(ext)) return 'pdf'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image'
  if (['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'].includes(ext)) return 'audio'
  if (['txt', 'md', 'markdown', 'json', 'jsonl', 'csv', 'tsv', 'yaml', 'yml', 'html', 'xml'].includes(ext)) return 'text'
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

function base64ToBytes(base64Content: string): Uint8Array {
  const byteString = atob(base64Content)
  const bytes = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i += 1) {
    bytes[i] = byteString.charCodeAt(i)
  }
  return bytes
}

function PdfPreview({ base64Content, fileName }: { base64Content: string; fileName: string }): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const renderKeyRef = useRef<string>('')
  const [pages, setPages] = useState<PdfRenderedPage[]>([])
  const [loading, setLoading] = useState(false)
  const [renderingMore, setRenderingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [renderWidth, setRenderWidth] = useState(480)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    let measured = false
    const updateWidth = (): void => {
      if (measured) return
      const width = Math.floor(element.clientWidth)
      if (width <= 0) return
      measured = true
      setRenderWidth(Math.min(Math.max(width - 32, 280), 960))
    }
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => {
      measured = true
      observer.disconnect()
    }
  }, [base64Content])

  useEffect(() => {
    let cancelled = false
    const renderPdf = async (): Promise<void> => {
      if (!base64Content || renderWidth <= 0) return
      const renderKey = `${base64Content.length}:${renderWidth}`
      if (renderKeyRef.current === renderKey) return
      renderKeyRef.current = renderKey
      setLoading(true)
      setRenderingMore(false)
      setError(null)
      setPages([])
      let pdf: pdfjsLib.PDFDocumentProxy | null = null
      try {
        pdf = await withTimeout(
          pdfjsLib.getDocument({
            data: base64ToBytes(base64Content),
            cMapUrl: `${PDFJS_ASSET_BASE_URL}cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `${PDFJS_ASSET_BASE_URL}standard_fonts/`
          }).promise,
          PDF_RENDER_TIMEOUT_MS,
          'PDF 加载超时'
        )
        const renderedPages: PdfRenderedPage[] = []
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) break
          if (pageNumber > 1) {
            setLoading(false)
            setRenderingMore(true)
          }
          const page = await withTimeout(pdf.getPage(pageNumber), PDF_RENDER_TIMEOUT_MS, `第 ${pageNumber} 页读取超时`)
          const baseViewport = page.getViewport({ scale: 1 })
          const scale = renderWidth / baseViewport.width
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          if (!context) throw new Error('无法创建 PDF 预览画布')
          const ratio = window.devicePixelRatio || 1
          canvas.width = Math.floor(viewport.width * ratio)
          canvas.height = Math.floor(viewport.height * ratio)
          canvas.style.width = `${viewport.width}px`
          canvas.style.height = `${viewport.height}px`
          context.setTransform(ratio, 0, 0, ratio, 0, 0)
          await withTimeout(
            page.render({ canvas, canvasContext: context, viewport }).promise,
            PDF_RENDER_TIMEOUT_MS,
            `第 ${pageNumber} 页渲染超时`
          )
          if (cancelled) break
          renderedPages.push({
            pageNumber,
            width: viewport.width,
            height: viewport.height,
            dataUrl: canvas.toDataURL('image/png')
          })
          setPages([...renderedPages])
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'PDF 预览渲染失败')
      } finally {
        if (pdf) void pdf.destroy()
        if (!cancelled) setLoading(false)
        if (!cancelled) setRenderingMore(false)
      }
    }
    void renderPdf()
    return () => {
      cancelled = true
    }
  }, [base64Content, renderWidth])

  return (
    <div ref={containerRef} className="min-h-full bg-[var(--ds-main)]">
      {loading && pages.length === 0 ? (
        <div className="flex h-full min-h-[320px] items-center justify-center gap-2 text-[13px] text-[var(--ds-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
          正在渲染 PDF...
        </div>
      ) : null}
      {error ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center text-[13px] text-[var(--ds-muted)]">
          <FileText className="h-10 w-10 text-slate-300" strokeWidth={1.4} />
          <div className="font-medium text-[var(--ds-ink)]">PDF 预览失败</div>
          <div className="max-w-sm break-words">{error}</div>
        </div>
      ) : pages.length > 0 ? (
        <div className="flex flex-col items-center gap-4 p-4">
          {pages.map((page) => (
            <figure key={page.pageNumber} className="w-full">
              <img
                src={page.dataUrl}
                alt={`${fileName} 第 ${page.pageNumber} 页`}
                className="mx-auto max-w-full rounded-[4px] bg-white shadow-sm"
                style={{ width: page.width, minHeight: page.height }}
              />
              <figcaption className="mt-2 text-center text-[11px] text-[var(--ds-muted)]">
                第 {page.pageNumber} 页
              </figcaption>
            </figure>
          ))}
          {renderingMore ? (
            <div className="flex items-center gap-2 pb-4 text-[12px] text-[var(--ds-muted)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.8} />
              继续渲染...
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
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

export function KnowledgeBaseView(): ReactElement {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<UploadSummary | null>(null)
  const [syncing, setSyncing] = useState(false)
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const newFolderInputRef = useRef<HTMLInputElement>(null)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    folderInputRef.current?.setAttribute('webkitdirectory', '')
    folderInputRef.current?.setAttribute('directory', '')
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
    setUploading({ done: 0, total: files.length })
    setError(null)
    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]
        const relative = fileRelativePath(file)
        const content = await readFileAsBase64(file)
        await requestJson(LEGALWORK_KNOWLEDGE_WRITE_FILE_PATH, 'POST', {
          path: joinKnowledgePath(currentPath, relative),
          content,
          encoding: 'base64'
        })
        setUploading({ done: i + 1, total: files.length })
      }
      await loadTree()
      setToast(`已上传 ${files.length} 个文件`)
      window.setTimeout(() => setToast(null), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (folderInputRef.current) folderInputRef.current.value = ''
    }
  }, [currentPath, loadTree])

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
    setSyncing(true)
    setError(null)
    try {
      await requestJson(LEGALWORK_KNOWLEDGE_SYNC_PATH, 'POST', { maxFiles: 5000 })
      setToast('知识库索引已同步')
      window.setTimeout(() => setToast(null), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '同步失败')
    } finally {
      setSyncing(false)
    }
  }, [])

  const closePreview = useCallback(() => {
    if (preview?.objectUrl) {
      URL.revokeObjectURL(preview.objectUrl)
    }
    setPreview(null)
  }, [preview])

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
      if (['doc', 'docx'].includes(fileExtension(node))) {
        void openInSystemApp(node)
        return
      }
      setError(`暂不支持预览 ${fileTypeLabel(node)} 文件`)
      return
    }
    setPreviewLoading(true)
    setError(null)
    closePreview()
    try {
      const isBinary = type === 'pdf' || type === 'image' || type === 'audio'
      const data = await requestJson<{ path: string; content: string; encoding: 'utf8' | 'base64' }>(
        `${LEGALWORK_KNOWLEDGE_READ_FILE_PATH}?path=${encodeURIComponent(node.path)}${isBinary ? '&encoding=base64' : ''}`
      )
      const objectUrl = isBinary && data.content ? buildObjectUrl(node, data.content) : undefined
      setPreview({ node, content: data.content, encoding: data.encoding, objectUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : '读取文件失败')
    } finally {
      setPreviewLoading(false)
    }
  }, [closePreview, openInSystemApp])

  const openFileView = useCallback((node: TreeNode): void => {
    if (node.kind === 'folder') {
      setQuery('')
      setCurrentPath(node.path)
      return
    }
    if (preview?.objectUrl) {
      URL.revokeObjectURL(preview.objectUrl)
    }
    setPreview(null)
    setViewingFile(node)
  }, [preview])

  useEffect(() => {
    return () => {
      if (preview?.objectUrl) URL.revokeObjectURL(preview.objectUrl)
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
      clearSelection()
      setToast(`已删除 ${paths.length} 项`)
      window.setTimeout(() => setToast(null), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    }
  }, [loadTree, clearSelection])

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
      clearSelection()
      setMoveModal((prev) => ({ ...prev, visible: false }))
      setToast(`已移动 ${paths.length} 项`)
      window.setTimeout(() => setToast(null), 2200)
    } catch (err) {
      setError(err instanceof Error ? err.message : '移动失败')
    }
  }, [selectedPaths, moveModal.targetPath, loadTree, clearSelection])

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

  if (viewingFile) {
    return (
      <KnowledgeBaseFileView
        node={viewingFile}
        onBack={() => setViewingFile(null)}
      />
    )
  }

  return (
    <section
      className="ds-no-drag flex h-full min-h-0 flex-col bg-[var(--ds-main)]"
      onDragOver={(event) => {
        event.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) setDragActive(false)
      }}
      onDrop={onDrop}
    >
      <header className="shrink-0 border-b border-ds-border px-8 pb-5 pt-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--ds-accent)]">
              <Database className="h-4 w-4" strokeWidth={1.8} />
              <span>Knowledge Base</span>
            </div>
            <h1 className="mt-3 text-[34px] font-semibold leading-tight text-[var(--ds-ink)]">知识库</h1>
            <p className="mt-2 text-[15px] text-[var(--ds-muted)]">按文件夹管理法律资料、论文、案例、录音与内部文档。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[var(--ds-accent)] px-4 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90"
            >
              <Upload className="h-4 w-4" strokeWidth={1.9} />
              <span>上传文件</span>
            </button>
            <button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-ds-border bg-ds-card px-4 text-[13px] font-medium text-[var(--ds-ink)] shadow-sm transition hover:bg-ds-hover"
            >
              <FolderPlus className="h-4 w-4" strokeWidth={1.8} />
              <span>上传文件夹</span>
            </button>
            <button
              type="button"
              onClick={() => void startCreateFolder()}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-ds-border bg-ds-card px-4 text-[13px] font-medium text-[var(--ds-ink)] shadow-sm transition hover:bg-ds-hover"
            >
              <FolderPlus className="h-4 w-4" strokeWidth={1.8} />
              <span>新建文件夹</span>
            </button>
            <button
              type="button"
              disabled={syncing}
              onClick={() => void syncIndex()}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-ds-border bg-ds-card px-4 text-[13px] font-medium text-[var(--ds-muted)] shadow-sm transition hover:bg-ds-hover hover:text-[var(--ds-ink)] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} strokeWidth={1.8} />
              <span>同步索引</span>
            </button>
          </div>
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

      <div className="flex min-h-0 flex-1">
        <div className={`flex min-h-0 flex-1 flex-col px-8 py-5 transition-all ${preview ? 'pr-4' : ''}`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1 text-[13px] text-[var(--ds-muted)]">
              <button
                type="button"
                onClick={() => setCurrentPath('')}
                className="rounded-[6px] px-2 py-1 text-[var(--ds-ink)] hover:bg-ds-hover"
              >
                全部文件
              </button>
              {breadcrumbs.map((part, index) => (
                <span key={`${part}-${index}`} className="flex min-w-0 items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                  <button
                    type="button"
                    onClick={() => openBreadcrumb(index)}
                    className="max-w-[220px] truncate rounded-[6px] px-2 py-1 hover:bg-ds-hover hover:text-[var(--ds-ink)]"
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
                placeholder="搜索文件或文件夹"
                className="h-9 w-full rounded-[8px] border border-ds-border bg-ds-card pl-9 pr-3 text-[13px] text-[var(--ds-ink)] outline-none transition focus:border-[var(--ds-accent)]"
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
              <div className="flex items-center gap-2">
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

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[8px] border border-ds-border bg-ds-card">
            {dragActive ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[color-mix(in_srgb,var(--ds-accent)_12%,transparent)] backdrop-blur-[1px]">
                <div className="rounded-[8px] border border-dashed border-[var(--ds-accent)] bg-ds-card px-8 py-6 text-center text-[14px] font-medium text-[var(--ds-ink)] shadow-lg">
                  松开即可上传到当前文件夹
                </div>
              </div>
            ) : null}
            {uploading ? (
              <div className="absolute left-4 right-4 top-4 z-10 rounded-[8px] border border-ds-border bg-ds-card px-4 py-3 shadow-lg">
                <div className="flex items-center justify-between text-[12px] text-[var(--ds-muted)]">
                  <span>正在上传 {uploading.done}/{uploading.total}</span>
                  <span>{Math.round((uploading.done / Math.max(uploading.total, 1)) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--ds-sidebar-field-bg)]">
                  <div
                    className="h-full rounded-full bg-[var(--ds-accent)] transition-all"
                    style={{ width: `${(uploading.done / Math.max(uploading.total, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="grid h-11 grid-cols-[44px_minmax(260px,1fr)_130px_130px_150px_54px] items-center border-b border-ds-border px-6 text-[13px] font-medium text-[var(--ds-muted)]">
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

            <div className="h-[calc(100%-44px)] overflow-y-auto">
              {loading && visibleNodes.length === 0 ? (
                <div className="flex h-full items-center justify-center text-[13px] text-[var(--ds-muted)]">加载中...</div>
              ) : visibleNodes.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-[13px] text-[var(--ds-muted)]">
                  <Folder className="h-10 w-10 text-emerald-200" strokeWidth={1.4} />
                  <div>{query.trim() ? '没有匹配的文件' : '当前文件夹为空'}</div>
                  <div className="text-[12px]">可以上传文件、上传文件夹，或直接把文件拖到这里。</div>
                </div>
              ) : (
                visibleNodes.map((node) => (
                  <div
                    key={node.path}
                    className={`grid min-h-[52px] grid-cols-[44px_minmax(260px,1fr)_130px_130px_150px_54px] items-center px-6 text-[14px] transition group ${
                      isNodeSelected(node)
                        ? 'bg-[color-mix(in_srgb,var(--ds-accent)_8%,transparent)]'
                        : 'hover:bg-ds-hover'
                    }`}
                    onDoubleClick={() => void openFileView(node)}
                    onContextMenu={(event) => handleRowContextMenu(event, node)}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={(event) => toggleSelectNode(node, event)}
                        className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
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
                      <span className="shrink-0">{iconForNode(node)}</span>
                      <span className="min-w-0 truncate font-medium text-[var(--ds-ink)]">{node.name}</span>
                    </button>
                    <div className="text-[13px] text-[var(--ds-muted)]">{fileTypeLabel(node)}</div>
                    <div className="text-[13px] text-[var(--ds-muted)]">{formatBytes(node.sizeBytes)}</div>
                    <div className="text-[13px] text-[var(--ds-muted)]">{formatDate(node.updatedAt)}</div>
                    <div className="flex items-center justify-end gap-1">
                      {node.kind === 'file' && previewType(node) !== 'unsupported' ? (
                        <button
                          type="button"
                          onClick={() => void openPreview(node)}
                          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--ds-muted)] opacity-0 transition hover:bg-ds-hover hover:text-[var(--ds-ink)] group-hover:opacity-100"
                          title="预览"
                        >
                          <Eye className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                      ) : null}
                      <button
                        type="button"
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

        {preview ? (
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
              ) : previewType(preview.node) === 'pdf' && preview.objectUrl ? (
                <PdfPreview base64Content={preview.content} fileName={preview.node.name} />
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
              <div className="flex items-center gap-1">
                {previewType(preview.node) !== 'text' ? (
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
            <div className="flex justify-end gap-2">
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
            <div className="mb-4 max-h-[240px] overflow-y-auto rounded-[8px] border border-ds-border">
              <button
                type="button"
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
            <div className="flex justify-end gap-2">
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
