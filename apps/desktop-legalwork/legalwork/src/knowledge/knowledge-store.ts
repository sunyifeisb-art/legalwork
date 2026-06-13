import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { extractDocumentText, EXTRACTABLE_EXTENSIONS } from './text-extractor.js'
import type {
  KnowledgeChunk,
  KnowledgeCreateFolderRequest,
  KnowledgeDiagnostics,
  KnowledgeDocument,
  KnowledgeFileContent,
  KnowledgeMoveRequest,
  KnowledgeSearchHit,
  KnowledgeSyncRequest,
  KnowledgeSyncResult,
  KnowledgeTreeNode
} from '../contracts/knowledge.js'

export interface KnowledgeStore {
  sync(input?: KnowledgeSyncRequest): Promise<KnowledgeSyncResult>
  search(input: { query: string; limit: number; includeContent?: boolean }): Promise<KnowledgeSearchHit[]>
  diagnostics(): Promise<KnowledgeDiagnostics>
  setLastSelected(ids: string[]): void
  /** List managed file/folder tree. */
  tree(prefix?: string): Promise<KnowledgeTreeNode[]>
  /** Create a folder under managed root. */
  createFolder(input: KnowledgeCreateFolderRequest): Promise<{ path: string }>
  /** Write a file under managed root. */
  writeFile(input: KnowledgeFileContent): Promise<{ path: string; sizeBytes: number }>
  /** Read a file under managed root. */
  readFile(path: string, encoding?: 'utf8' | 'base64'): Promise<KnowledgeFileContent>
  /** Resolve the absolute path of a managed file/folder. */
  absolutePath(path: string): Promise<{ path: string; absolute: string }>
  /** Move / rename a file or folder under managed root. */
  move(input: KnowledgeMoveRequest): Promise<{ sourcePath: string; destPath: string }>
  /** Delete a file or folder under managed root. */
  delete(path: string): Promise<{ path: string }>
}

type KnowledgeIndex = {
  syncedAt?: string
  roots: string[]
  documents: KnowledgeDocument[]
  chunks: KnowledgeChunk[]
  skippedCount: number
}

const TEXT_EXTENSIONS = new Set([
  '.md',
  '.markdown',
  '.txt',
  '.json',
  '.jsonl',
  '.csv',
  '.tsv',
  '.yaml',
  '.yml',
  '.html',
  '.xml'
])
const MANAGED_FILE_EXTENSIONS = new Set([
  ...TEXT_EXTENSIONS,
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.xls',
  '.xlsx',
  '.mp3',
  '.m4a',
  '.wav',
  '.aac',
  '.flac',
  '.ogg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.zip',
  '.rar',
  '.7z'
])
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'out', '.next', '.vite'])
const DEFAULT_MAX_FILE_BYTES = 2 * 1024 * 1024
const DEFAULT_MAX_FILES = 1500
const CHUNK_SIZE = 2400
const CHUNK_OVERLAP = 240

export class FileKnowledgeStore implements KnowledgeStore {
  private lastSelectedIds: string[] = []

  constructor(
    private readonly options: {
      rootDir: string
      sourceRoots?: string[]
      nowIso?: () => string
      managedRoot?: string
    }
  ) {
    // Default managed root: {rootDir}/files
    if (!this.options.managedRoot) {
      this.options.managedRoot = join(this.options.rootDir, 'files')
    }
  }

  private get managedRoot(): string {
    return this.options.managedRoot!
  }

  /** Ensure the managed root directory exists. */
  private async ensureManagedRoot(): Promise<void> {
    await mkdir(this.managedRoot, { recursive: true })
  }

  /** Resolve a relative path inside managedRoot, preventing directory escape. */
  private resolveManaged(relativePath: string): string {
    const absolute = resolve(join(this.managedRoot, relativePath))
    if (!absolute.startsWith(this.managedRoot)) {
      throw new Error(`Path "${relativePath}" escapes managed root`)
    }
    return absolute
  }

  async tree(prefix?: string): Promise<KnowledgeTreeNode[]> {
    await this.ensureManagedRoot()
    const scanDir = prefix ? this.resolveManaged(prefix) : this.managedRoot
    if (!existsSync(scanDir)) return []
    return this.buildTree(scanDir)
  }

  private async buildTree(dir: string): Promise<KnowledgeTreeNode[]> {
    const entries = await readdir(dir, { withFileTypes: true })
    const nodes: KnowledgeTreeNode[] = []
    for (const entry of entries.sort((a, b) => {
      // Folders first, then alphabetical
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
      return a.name.localeCompare(b.name)
    })) {
      const fullPath = join(dir, entry.name)
      const relativePath = relative(this.managedRoot, fullPath)
      if (entry.isDirectory()) {
        const children = await this.buildTree(fullPath)
        nodes.push({
          name: entry.name,
          path: relativePath,
          kind: 'folder',
          children
        })
      } else if (entry.isFile() && MANAGED_FILE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
        const info = await stat(fullPath)
        nodes.push({
          name: entry.name,
          path: relativePath,
          kind: 'file',
          extension: extname(entry.name).toLowerCase(),
          sizeBytes: info.size,
          updatedAt: info.mtime.toISOString()
        })
      }
    }
    return nodes
  }

  async createFolder(input: KnowledgeCreateFolderRequest): Promise<{ path: string }> {
    await this.ensureManagedRoot()
    const absolute = this.resolveManaged(input.path)
    await mkdir(absolute, { recursive: true })
    return { path: input.path }
  }

  async writeFile(input: KnowledgeFileContent): Promise<{ path: string; sizeBytes: number }> {
    await this.ensureManagedRoot()
    const absolute = this.resolveManaged(input.path)
    await mkdir(dirname(absolute), { recursive: true })
    if (input.encoding === 'base64') {
      await writeFile(absolute, Buffer.from(input.content, 'base64'))
    } else {
      await writeFile(absolute, input.content, 'utf8')
    }
    const info = await stat(absolute)
    return { path: input.path, sizeBytes: info.size }
  }

  async readFile(filePath: string, encoding: 'utf8' | 'base64' = 'utf8'): Promise<KnowledgeFileContent> {
    await this.ensureManagedRoot()
    const absolute = this.resolveManaged(filePath)
    if (encoding === 'base64') {
      const buffer = await readFile(absolute)
      return { path: filePath, content: buffer.toString('base64'), encoding: 'base64' }
    }
    const content = await readFile(absolute, 'utf8')
    return { path: filePath, content, encoding: 'utf8' }
  }

  async absolutePath(filePath: string): Promise<{ path: string; absolute: string }> {
    await this.ensureManagedRoot()
    return { path: filePath, absolute: this.resolveManaged(filePath) }
  }

  async move(input: KnowledgeMoveRequest): Promise<{ sourcePath: string; destPath: string }> {
    await this.ensureManagedRoot()
    const src = this.resolveManaged(input.sourcePath)
    const dest = this.resolveManaged(input.destPath)
    await mkdir(dirname(dest), { recursive: true })
    await rename(src, dest)
    return { sourcePath: input.sourcePath, destPath: input.destPath }
  }

  async delete(filePath: string): Promise<{ path: string }> {
    await this.ensureManagedRoot()
    const absolute = this.resolveManaged(filePath)
    const info = await stat(absolute)
    if (info.isDirectory()) {
      await rm(absolute, { recursive: true, force: true })
    } else {
      await rm(absolute, { force: true })
    }
    return { path: filePath }
  }

  async sync(input: KnowledgeSyncRequest = {}): Promise<KnowledgeSyncResult> {
    await mkdir(this.options.rootDir, { recursive: true })
    await this.ensureManagedRoot()
    const defaultRoots = [...(this.options.sourceRoots ?? []), this.managedRoot]
    const roots = normalizeRoots(input.roots?.length ? input.roots : defaultRoots)
    const maxFiles = input.maxFiles ?? DEFAULT_MAX_FILES
    const files: string[] = []
    let skippedCount = 0

    for (const root of roots) {
      const result = await collectFiles(root, maxFiles - files.length)
      files.push(...result.files)
      skippedCount += result.skippedCount
      if (files.length >= maxFiles) break
    }

    const documents: KnowledgeDocument[] = []
    const chunks: KnowledgeChunk[] = []
    for (const filePath of files) {
      const root = roots.find((candidate) => isInside(filePath, candidate)) ?? roots[0] ?? resolve('.')
      try {
        const info = await stat(filePath)
        if (info.size > DEFAULT_MAX_FILE_BYTES) {
          skippedCount += 1
          continue
        }
        const ext = extname(filePath).toLowerCase()
        const content = TEXT_EXTENSIONS.has(ext)
          ? normalizeText(await readFile(filePath, 'utf8'))
          : await extractDocumentText(filePath)
        if (!content.trim()) {
          skippedCount += 1
          continue
        }
        const documentId = hashId(filePath)
        const relPath = relative(root, filePath) || basename(filePath)
        const document: KnowledgeDocument = {
          id: documentId,
          title: titleFromPath(filePath),
          path: filePath,
          sourceRoot: root,
          relativePath: relPath,
          extension: extname(filePath).toLowerCase(),
          sizeBytes: info.size,
          updatedAt: info.mtime.toISOString()
        }
        documents.push(document)
        chunks.push(...chunkDocument(document, content))
      } catch {
        skippedCount += 1
      }
    }

    const syncedAt = this.now()
    await this.writeIndex({ syncedAt, roots, documents, chunks, skippedCount })
    return {
      syncedAt,
      roots,
      documentCount: documents.length,
      chunkCount: chunks.length,
      skippedCount
    }
  }

  async search(input: { query: string; limit: number; includeContent?: boolean }): Promise<KnowledgeSearchHit[]> {
    const query = input.query.trim()
    if (!query) return []
    let index = await this.readIndex()
    if (index.chunks.length === 0 && (this.options.sourceRoots?.length ?? 0) > 0) {
      await this.sync()
      index = await this.readIndex()
    }
    const terms = queryTerms(query)
    const lowerQuery = query.toLowerCase()
    const hits = index.chunks
      .map((chunk) => {
        const score = scoreChunk(chunk, lowerQuery, terms)
        return { chunk, score }
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.chunk.relativePath.localeCompare(b.chunk.relativePath))
      .slice(0, Math.max(1, input.limit))
      .map(({ chunk, score }) => ({
        documentId: chunk.documentId,
        chunkId: chunk.id,
        title: chunk.title,
        path: chunk.path,
        relativePath: chunk.relativePath,
        score,
        snippet: makeSnippet(chunk.content, lowerQuery, terms),
        ...(input.includeContent ? { content: chunk.content } : {})
      }))
    this.setLastSelected(hits.map((hit) => hit.documentId))
    return hits
  }

  async diagnostics(): Promise<KnowledgeDiagnostics> {
    const index = await this.readIndex()
    return {
      enabled: true,
      rootDir: this.options.rootDir,
      sourceRoots: normalizeRoots(this.options.sourceRoots ?? []),
      documentCount: index.documents.length,
      chunkCount: index.chunks.length,
      ...(index.syncedAt ? { syncedAt: index.syncedAt } : {}),
      lastSelectedIds: [...this.lastSelectedIds]
    }
  }

  setLastSelected(ids: string[]): void {
    this.lastSelectedIds = [...new Set(ids)].slice(0, 20)
  }

  private async readIndex(): Promise<KnowledgeIndex> {
    try {
      const text = await readFile(this.indexPath(), 'utf8')
      const parsed = JSON.parse(text) as Partial<KnowledgeIndex>
      return {
        syncedAt: parsed.syncedAt,
        roots: Array.isArray(parsed.roots) ? parsed.roots.filter((root): root is string => typeof root === 'string') : [],
        documents: Array.isArray(parsed.documents) ? parsed.documents as KnowledgeDocument[] : [],
        chunks: Array.isArray(parsed.chunks) ? parsed.chunks as KnowledgeChunk[] : [],
        skippedCount: typeof parsed.skippedCount === 'number' ? parsed.skippedCount : 0
      }
    } catch {
      return { roots: [], documents: [], chunks: [], skippedCount: 0 }
    }
  }

  private async writeIndex(index: KnowledgeIndex): Promise<void> {
    await writeFile(this.indexPath(), JSON.stringify(index, null, 2), 'utf8')
  }

  private indexPath(): string {
    return join(this.options.rootDir, 'index.json')
  }

  private now(): string {
    return this.options.nowIso?.() ?? new Date().toISOString()
  }
}

export function defaultKnowledgeSourceRoots(dataDir?: string): string[] {
  const fromEnv = (process.env.LEGALWORK_KNOWLEDGE_ROOTS ?? '')
    .split(':')
    .map((entry) => entry.trim())
    .filter(Boolean)
  const anchors = [process.cwd(), dataDir].filter((value): value is string => Boolean(value))
  const candidates: string[] = [...fromEnv]
  for (const anchor of anchors) {
    for (const base of ancestors(anchor, 8)) {
      candidates.push(
        join(base, 'knowledge-base'),
        join(base, 'knowledge'),
        join(base, 'docs'),
        join(base, 'projects/compliance/projects/data-compliance-ai-project-kit/knowledge-base')
      )
    }
  }
  return normalizeRoots(candidates)
}

function normalizeRoots(roots: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const root of roots) {
    const absolute = resolve(root)
    if (seen.has(absolute) || !existsSync(absolute)) continue
    seen.add(absolute)
    result.push(absolute)
  }
  return result
}

async function collectFiles(root: string, remaining: number): Promise<{ files: string[]; skippedCount: number }> {
  const files: string[] = []
  let skippedCount = 0
  async function visit(dir: string): Promise<void> {
    if (files.length >= remaining) return
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      if (files.length >= remaining) return
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) {
          skippedCount += 1
          continue
        }
        await visit(path)
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase()
        if (TEXT_EXTENSIONS.has(ext) || EXTRACTABLE_EXTENSIONS.has(ext)) {
          files.push(path)
        } else {
          skippedCount += 1
        }
      }
    }
  }
  await visit(root)
  return { files, skippedCount }
}

function chunkDocument(document: KnowledgeDocument, content: string): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  for (let start = 0, index = 0; start < content.length; index += 1) {
    const slice = content.slice(start, start + CHUNK_SIZE).trim()
    if (slice) {
      chunks.push({
        id: `${document.id}_${index}`,
        documentId: document.id,
        title: document.title,
        path: document.path,
        relativePath: document.relativePath,
        content: slice
      })
    }
    if (start + CHUNK_SIZE >= content.length) break
    start += CHUNK_SIZE - CHUNK_OVERLAP
  }
  return chunks
}

function scoreChunk(chunk: KnowledgeChunk, lowerQuery: string, terms: string[]): number {
  const haystack = `${chunk.title}\n${chunk.relativePath}\n${chunk.content}`.toLowerCase()
  let score = haystack.includes(lowerQuery) ? 8 : 0
  for (const term of terms) {
    let position = haystack.indexOf(term)
    while (position >= 0) {
      score += term.length >= 4 ? 2 : 1
      position = haystack.indexOf(term, position + term.length)
    }
  }
  if (chunk.title.toLowerCase().includes(lowerQuery)) score += 6
  if (chunk.relativePath.toLowerCase().includes(lowerQuery)) score += 4
  return score
}

function makeSnippet(content: string, lowerQuery: string, terms: string[]): string {
  const lower = content.toLowerCase()
  let at = lower.indexOf(lowerQuery)
  if (at < 0) {
    at = terms.map((term) => lower.indexOf(term)).filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? 0
  }
  const start = Math.max(0, at - 120)
  const end = Math.min(content.length, at + 360)
  const prefix = start > 0 ? '...' : ''
  const suffix = end < content.length ? '...' : ''
  return `${prefix}${content.slice(start, end).replace(/\s+/g, ' ').trim()}${suffix}`
}

function queryTerms(query: string): string[] {
  const lower = query.toLowerCase()
  const terms = new Set<string>()
  for (const term of lower.split(/[^a-z0-9_]+/).filter((part) => part.length > 1)) {
    terms.add(term)
  }
  const cjk = lower.match(/[\u3400-\u9fff]{2,}/g) ?? []
  for (const text of cjk) {
    terms.add(text)
    for (let size = 2; size <= Math.min(4, text.length); size += 1) {
      for (let i = 0; i <= text.length - size; i += 1) {
        terms.add(text.slice(i, i + size))
      }
    }
  }
  return [...terms]
}

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\u0000/g, '')
}

function titleFromPath(path: string): string {
  return basename(path, extname(path)).replace(/[-_]+/g, ' ').trim() || basename(path)
}

function hashId(value: string): string {
  return `kb_${createHash('sha1').update(value).digest('hex').slice(0, 16)}`
}

function isInside(path: string, root: string): boolean {
  const rel = relative(root, path)
  return Boolean(rel) && !rel.startsWith('..')
}

function ancestors(start: string, limit: number): string[] {
  const result: string[] = []
  let current = resolve(start)
  for (let i = 0; i < limit; i += 1) {
    result.push(current)
    const parent = resolve(current, '..')
    if (parent === current) break
    current = parent
  }
  return result
}
