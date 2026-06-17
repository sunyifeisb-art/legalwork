import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import {
  LEGALWORK_KNOWLEDGE_CREATE_FOLDER_PATH,
  LEGALWORK_KNOWLEDGE_DELETE_FILE_PATH,
  LEGALWORK_KNOWLEDGE_MOVE_PATH,
  LEGALWORK_KNOWLEDGE_READ_FILE_PATH,
  LEGALWORK_KNOWLEDGE_TREE_PATH,
  LEGALWORK_KNOWLEDGE_WRITE_FILE_PATH
} from '../../../../shared/legalwork-endpoints'

type TreeNode = {
  name: string
  path: string
  kind: 'file' | 'folder'
  extension?: string
  sizeBytes?: number
  updatedAt?: string
  children?: TreeNode[]
}

async function requestJson<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const result = await window.dsGui.runtimeRequest(
    path,
    method,
    body === undefined ? undefined : JSON.stringify(body)
  )
  if (!result.ok) {
    throw new Error(result.body || `请求失败：${result.status}`)
  }
  return JSON.parse(result.body) as T
}

type ContextMenuState = {
  visible: boolean
  x: number
  y: number
  node: TreeNode
}

export function KnowledgeFileBrowser({ onRefresh }: { onRefresh?: () => void }): ReactElement {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false, x: 0, y: 0, node: { name: '', path: '', kind: 'file' }
  })
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const renameInputRef = useRef<HTMLInputElement>(null)

  const loadTree = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await requestJson<{ nodes: TreeNode[] }>(LEGALWORK_KNOWLEDGE_TREE_PATH)
      setTree(data.nodes)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载知识库文件列表失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTree()
  }, [loadTree])

  const toggleExpand = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])

  const handleSelect = useCallback(async (node: TreeNode) => {
    setSelectedPath(node.path)
    if (node.kind === 'file') {
      try {
        const data = await requestJson<{ path: string; content: string }>(
          `${LEGALWORK_KNOWLEDGE_READ_FILE_PATH}?path=${encodeURIComponent(node.path)}`
        )
        setSelectedContent(data.content)
      } catch {
        setSelectedContent('（无法读取文件内容）')
      }
    }
  }, [])

  const handleContextMenu = useCallback((event: React.MouseEvent, node: TreeNode) => {
    event.preventDefault()
    event.stopPropagation()
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, node })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }))
  }, [])

  useEffect(() => {
    if (contextMenu.visible) {
      const handler = () => closeContextMenu()
      window.addEventListener('click', handler)
      return () => window.removeEventListener('click', handler)
    }
  }, [contextMenu.visible, closeContextMenu])

  const handleRenameStart = useCallback(() => {
    const node = contextMenu.node
    setRenaming(node.path)
    setRenameValue(node.name)
    closeContextMenu()
    setTimeout(() => renameInputRef.current?.select(), 50)
  }, [contextMenu.node, closeContextMenu])

  const handleRenameSubmit = useCallback(async () => {
    if (!renaming || !renameValue.trim()) {
      setRenaming(null)
      return
    }
    const oldPath = renaming
    const parts = oldPath.split('/')
    parts[parts.length - 1] = renameValue.trim()
    const newPath = parts.join('/')
    if (oldPath === newPath) {
      setRenaming(null)
      return
    }
    try {
      await requestJson(LEGALWORK_KNOWLEDGE_MOVE_PATH, 'POST', {
        sourcePath: oldPath,
        destPath: newPath
      })
      setRenaming(null)
      void loadTree()
      onRefresh?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : '重命名失败')
      setRenaming(null)
    }
  }, [renaming, renameValue, loadTree, onRefresh])

  const handleDelete = useCallback(async () => {
    const node = contextMenu.node
    closeContextMenu()
    const label = node.kind === 'folder' ? `文件夹「${node.name}」` : `文件「${node.name}」`
    if (!confirm(`确定删除${label}吗？此操作不可撤销。`)) return
    try {
      await requestJson(
        `${LEGALWORK_KNOWLEDGE_DELETE_FILE_PATH}?path=${encodeURIComponent(node.path)}`,
        'DELETE'
      )
      setSelectedPath((prev) => prev === node.path ? null : prev)
      setSelectedContent(null)
      void loadTree()
      onRefresh?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败')
    }
  }, [contextMenu.node, closeContextMenu, loadTree, onRefresh])

  const handleCreateFolder = useCallback(async () => {
    if (!newFolderName.trim()) {
      setCreatingFolder(false)
      return
    }
    try {
      await requestJson(LEGALWORK_KNOWLEDGE_CREATE_FOLDER_PATH, 'POST', {
        path: newFolderName.trim()
      })
      setNewFolderName('')
      setCreatingFolder(false)
      void loadTree()
      onRefresh?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建文件夹失败')
    }
  }, [newFolderName, loadTree, onRefresh])

  const handleUploadFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError(null)
    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i]
        const content = await file.text()
        await requestJson(LEGALWORK_KNOWLEDGE_WRITE_FILE_PATH, 'POST', {
          path: file.name,
          content,
          encoding: 'utf8'
        })
      }
      void loadTree()
      onRefresh?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传文件失败')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [loadTree, onRefresh])

  const formatBytes = (bytes?: number): string => {
    if (bytes === undefined) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const renderNode = (node: TreeNode, depth: number): ReactElement => {
    const isExpanded = expanded.has(node.path)
    const isSelected = selectedPath === node.path

    if (node.kind === 'folder') {
      return (
        <div key={node.path}>
          <div
            className={`group flex cursor-pointer items-center gap-1 px-2 py-1.5 text-[12.5px] transition ${
              isSelected ? 'bg-[color-mix(in_srgb,var(--ds-accent)_8%,transparent)]' : 'hover:bg-ds-hover'
            }`}
            style={{ paddingLeft: 8 + depth * 16 }}
            onClick={() => { toggleExpand(node.path); handleSelect(node) }}
            onContextMenu={(e) => handleContextMenu(e, node)}
          >
            <span className="shrink-0 text-[var(--ds-muted)]">
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
            <span className="shrink-0 text-amber-500">
              {isExpanded ? <FolderOpen className="h-4 w-4" strokeWidth={1.5} /> : <Folder className="h-4 w-4" strokeWidth={1.5} />}
            </span>
            <span className="min-w-0 truncate text-[var(--ds-ink)]">{node.name}</span>
          </div>
          {isExpanded && node.children?.map((child) => renderNode(child, depth + 1))}
        </div>
      )
    }

    return (
      <div
        key={node.path}
        className={`group flex cursor-pointer items-center gap-1 px-2 py-1.5 text-[12.5px] transition ${
          isSelected ? 'bg-[color-mix(in_srgb,var(--ds-accent)_8%,transparent)]' : 'hover:bg-ds-hover'
        }`}
        style={{ paddingLeft: 8 + depth * 16 }}
        onClick={() => handleSelect(node)}
        onContextMenu={(e) => handleContextMenu(e, node)}
      >
        <span className="w-[14px]" />
        <span className="shrink-0 text-[var(--ds-accent)]">
          <FileText className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[var(--ds-ink)]">{node.name}</span>
        <span className="hidden shrink-0 text-[10px] text-[var(--ds-muted)] group-hover:block">
          {formatBytes(node.sizeBytes)}
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Toolbar */}
      <div className="ds-no-drag flex shrink-0 items-center gap-1 border-b border-ds-border px-2 py-2">
        <button
          type="button"
          onClick={() => {
            setCreatingFolder(true)
            setNewFolderName('')
            setTimeout(() => renameInputRef.current?.focus(), 50)
          }}
          className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[11.5px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
          title="新建文件夹"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>新建文件夹</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[11.5px] font-medium text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)] disabled:opacity-40"
          title="上传文件"
        >
          <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>{uploading ? '上传中…' : '上传文件'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".md,.markdown,.txt,.json,.csv,.yaml,.yml,.html,.xml"
          className="hidden"
          onChange={(e) => void handleUploadFiles(e.target.files)}
        />
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => void loadTree()}
          className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--ds-muted)] transition hover:bg-ds-hover hover:text-[var(--ds-ink)]"
          title="刷新"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>

      {/* Inline create folder */}
      {creatingFolder ? (
        <div className="flex shrink-0 items-center gap-1 border-b border-ds-border px-3 py-2">
          <Folder className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
          <input
            ref={renameInputRef}
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleCreateFolder()
              if (e.key === 'Escape') setCreatingFolder(false)
            }}
            placeholder="文件夹名称…"
            className="min-w-0 flex-1 rounded-[4px] border border-[var(--ds-accent)] bg-transparent px-2 py-0.5 text-[12px] text-[var(--ds-ink)] outline-none"
          />
          <button
            type="button"
            onClick={() => void handleCreateFolder()}
            className="flex h-6 items-center rounded-[4px] bg-[var(--ds-accent)] px-2 text-[11px] font-medium text-white"
          >
            创建
          </button>
          <button
            type="button"
            onClick={() => setCreatingFolder(false)}
            className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[var(--ds-muted)] hover:bg-ds-hover"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {/* Error */}
      {error ? (
        <div className="shrink-0 border-b border-ds-border px-3 py-2 text-[11px] text-red-500">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 text-[var(--ds-muted)] hover:text-[var(--ds-ink)]"
          >
            ✕
          </button>
        </div>
      ) : null}

      {/* Rename inline */}
      {renaming ? (
        <div className="flex shrink-0 items-center gap-1 border-b border-ds-border px-3 py-2">
          <Pencil className="h-3.5 w-3.5 text-[var(--ds-muted)]" strokeWidth={1.75} />
          <input
            ref={renameInputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleRenameSubmit()
              if (e.key === 'Escape') setRenaming(null)
            }}
            className="min-w-0 flex-1 rounded-[4px] border border-[var(--ds-accent)] bg-transparent px-2 py-0.5 text-[12px] text-[var(--ds-ink)] outline-none"
          />
          <button
            type="button"
            onClick={() => void handleRenameSubmit()}
            className="flex h-6 items-center rounded-[4px] bg-[var(--ds-accent)] px-2 text-[11px] font-medium text-white"
          >
            确定
          </button>
          <button
            type="button"
            onClick={() => setRenaming(null)}
            className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[var(--ds-muted)] hover:bg-ds-hover"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {/* Tree or Loading */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && tree.length === 0 ? (
          <div className="flex h-full min-h-[160px] items-center justify-center text-[12px] text-[var(--ds-muted)]">
            加载中…
          </div>
        ) : tree.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 px-6 text-center text-[12px] text-[var(--ds-muted)]">
            <Folder className="h-8 w-8" strokeWidth={1.2} />
            <span>知识库为空</span>
            <span className="text-[11px]">点击上方「上传文件」或「新建文件夹」开始管理</span>
          </div>
        ) : (
          <div className="py-1">
            {tree.map((node) => renderNode(node, 0))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.visible ? (
        <div
          className="fixed z-50 min-w-[140px] rounded-[8px] border border-ds-border bg-ds-card py-1 shadow-lg"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            type="button"
            onClick={handleRenameStart}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] text-[var(--ds-ink)] transition hover:bg-ds-hover"
          >
            <Pencil className="h-3.5 w-3.5 text-[var(--ds-muted)]" strokeWidth={1.75} />
            <span>重命名</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>删除</span>
          </button>
        </div>
      ) : null}

      {/* Preview */}
      {selectedPath && selectedContent !== null ? (
        <div className="shrink-0 border-t border-ds-border">
          <div className="flex items-center justify-between border-b border-ds-border px-3 py-1.5">
            <span className="truncate text-[11px] font-medium text-[var(--ds-ink)]">
              {selectedPath.split('/').pop()}
            </span>
            <button
              type="button"
              onClick={() => { setSelectedPath(null); setSelectedContent(null) }}
              className="flex h-5 w-5 items-center justify-center rounded-[4px] text-[var(--ds-muted)] hover:bg-ds-hover"
            >
              <X className="h-3 w-3" strokeWidth={1.75} />
            </button>
          </div>
          <pre className="max-h-[240px] overflow-y-auto whitespace-pre-wrap break-words px-3 py-2 text-[11.5px] leading-5 text-[var(--ds-muted)]">
            {selectedContent}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
