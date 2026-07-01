import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import { extractDocumentText, EXTRACTABLE_EXTENSIONS } from './text-extractor.js'
import type {
  KnowledgeClassifyRequest,
  KnowledgeClassifyResult,
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
  /** Extract plain text from a managed document (pdf/docx/xlsx etc.). */
  extractText(path: string): Promise<{ path: string; text: string; extension: string }>
  /** Resolve the absolute path of a managed file/folder. */
  absolutePath(path: string): Promise<{ path: string; absolute: string }>
  /** Move / rename a file or folder under managed root. */
  move(input: KnowledgeMoveRequest): Promise<{ sourcePath: string; destPath: string }>
  /** Delete a file or folder under managed root. */
  delete(path: string): Promise<{ path: string }>
  /** Automatically classify managed files into category folders. */
  classify(input?: KnowledgeClassifyRequest): Promise<KnowledgeClassifyResult>
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
const RERANK_POOL_SIZE = 80
const MAX_PER_DOCUMENT = 2

type ScoredChunk = {
  chunk: KnowledgeChunk
  score: number
  rankReason: string
  terms: Set<string>
}

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
    const managedRoot = resolve(this.managedRoot)
    if (absolute !== managedRoot && !absolute.startsWith(`${managedRoot}${sep}`)) {
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

  async extractText(filePath: string): Promise<{ path: string; text: string; extension: string }> {
    await this.ensureManagedRoot()
    const absolute = this.resolveManaged(filePath)
    const extension = extname(absolute).toLowerCase()
    const text = EXTRACTABLE_EXTENSIONS.has(extension)
      ? await extractDocumentText(absolute)
      : ''
    return { path: filePath, text, extension }
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

  async classify(input: KnowledgeClassifyRequest = {}): Promise<KnowledgeClassifyResult> {
    await this.ensureManagedRoot()
    const dryRun = input.dryRun ?? false
    const targetRoot = normalizeRelativePath(input.targetRoot ?? '')
    const selected = input.paths?.length
      ? input.paths.map((path) => normalizeRelativePath(path)).filter(Boolean)
      : ['']
    const files: string[] = []
    for (const selectedPath of selected) {
      const absolute = selectedPath ? this.resolveManaged(selectedPath) : this.managedRoot
      files.push(...await collectManagedFiles(this.managedRoot, absolute))
    }

    const moved: KnowledgeClassifyResult['moved'] = []
    const skipped: KnowledgeClassifyResult['skipped'] = []
    const uniqueFiles = [...new Set(files)]
    for (const absolute of uniqueFiles) {
      const relPath = relative(this.managedRoot, absolute).replaceAll('\\', '/')
      const name = basename(absolute)
      const classification = classifyKnowledgeFile(name, relPath)
      const currentFolder = dirname(relPath).replaceAll('\\', '/')
      const destFolder = joinKnowledgeRelative(targetRoot, classification.category)
      if (currentFolder === destFolder) {
        skipped.push({ path: relPath, reason: '已在目标分类中' })
        continue
      }
      const destPath = await this.uniqueManagedPath(joinKnowledgeRelative(destFolder, name))
      moved.push({
        sourcePath: relPath,
        destPath,
        category: classification.category,
        reason: classification.reason
      })
      if (!dryRun) {
        const destAbsolute = this.resolveManaged(destPath)
        await mkdir(dirname(destAbsolute), { recursive: true })
        await rename(absolute, destAbsolute)
      }
    }

    if (!dryRun && moved.length > 0) {
      await this.sync()
    }
    return { moved, skipped, dryRun }
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
        const category = inferCategory(filePath, relPath, content)
        const keywords = extractKeywords(`${relPath}\n${content}`, 16)
        const tags = inferTags(filePath, relPath, content, category, keywords)
        const document: KnowledgeDocument = {
          id: documentId,
          title: titleFromPath(filePath),
          path: filePath,
          sourceRoot: root,
          relativePath: relPath,
          category,
          tags,
          keywords,
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
    const queryTermSet = new Set(terms)
    const hits = rerankChunks(index.chunks
      .map((chunk) => scoreChunk(chunk, lowerQuery, terms, queryTermSet))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.chunk.relativePath.localeCompare(b.chunk.relativePath))
      .slice(0, RERANK_POOL_SIZE), Math.max(1, input.limit))
      .map(({ chunk, score, rankReason }) => ({
        documentId: chunk.documentId,
        chunkId: chunk.id,
        title: chunk.title,
        path: chunk.path,
        relativePath: chunk.relativePath,
        ...(chunk.category ? { category: chunk.category } : {}),
        ...(chunk.tags?.length ? { tags: chunk.tags } : {}),
        ...(chunk.keywords?.length ? { keywords: chunk.keywords } : {}),
        score,
        rankReason,
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

  private async uniqueManagedPath(relativePath: string): Promise<string> {
    const normalized = normalizeRelativePath(relativePath)
    const parsedExt = extname(normalized)
    const base = normalized.slice(0, normalized.length - parsedExt.length)
    let candidate = normalized
    for (let index = 1; existsSync(this.resolveManaged(candidate)); index += 1) {
      candidate = `${base} (${index})${parsedExt}`
    }
    return candidate
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

async function collectManagedFiles(managedRoot: string, absolute: string): Promise<string[]> {
  const info = await stat(absolute).catch(() => null)
  if (!info) return []
  if (info.isFile()) {
    return MANAGED_FILE_EXTENSIONS.has(extname(absolute).toLowerCase()) ? [absolute] : []
  }
  if (!info.isDirectory()) return []
  const files: string[] = []
  const entries = await readdir(absolute, { withFileTypes: true }).catch(() => [])
  for (const entry of entries) {
    const child = join(absolute, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectManagedFiles(managedRoot, child))
    } else if (entry.isFile() && MANAGED_FILE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      const rel = relative(managedRoot, child)
      if (rel && !rel.startsWith('..')) files.push(child)
    }
  }
  return files
}

function chunkDocument(document: KnowledgeDocument, content: string): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  for (let start = 0, index = 0; start < content.length; index += 1) {
    const slice = content.slice(start, start + CHUNK_SIZE).trim()
    if (slice) {
      const keywords = extractKeywords(`${document.title}\n${document.relativePath}\n${slice}`, 12)
      chunks.push({
        id: `${document.id}_${index}`,
        documentId: document.id,
        title: document.title,
        path: document.path,
        relativePath: document.relativePath,
        category: document.category,
        tags: document.tags,
        keywords,
        content: slice
      })
    }
    if (start + CHUNK_SIZE >= content.length) break
    start += CHUNK_SIZE - CHUNK_OVERLAP
  }
  return chunks
}

function scoreChunk(chunk: KnowledgeChunk, lowerQuery: string, terms: string[], queryTermSet: Set<string>): ScoredChunk {
  const haystack = `${chunk.title}\n${chunk.relativePath}\n${chunk.category ?? ''}\n${chunk.keywords?.join(' ') ?? ''}\n${chunk.content}`.toLowerCase()
  let score = haystack.includes(lowerQuery) ? 12 : 0
  const reasons: string[] = []
  if (score > 0) reasons.push('短语匹配')
  const matchedTerms = new Set<string>()
  for (const term of terms) {
    let position = haystack.indexOf(term)
    while (position >= 0) {
      matchedTerms.add(term)
      score += term.length >= 4 ? 2.4 : 1.2
      position = haystack.indexOf(term, position + term.length)
    }
  }
  const title = chunk.title.toLowerCase()
  const relativePath = chunk.relativePath.toLowerCase()
  const category = (chunk.category ?? '').toLowerCase()
  const keywords = new Set((chunk.keywords ?? []).map((keyword) => keyword.toLowerCase()))
  const coverage = terms.length ? matchedTerms.size / terms.length : 0
  if (coverage > 0) {
    score += coverage * 12
    reasons.push(`覆盖${Math.round(coverage * 100)}%`)
  }
  for (const term of queryTermSet) {
    if (title.includes(term)) score += 5
    if (relativePath.includes(term)) score += 3
    if (category.includes(term)) score += 4
    if (keywords.has(term)) score += 4
  }
  const vectorScore = cosineScore(queryTermSet, termFrequency(haystack))
  if (vectorScore > 0) {
    score += vectorScore * 18
    reasons.push('关键词向量')
  }
  const proximity = proximityScore(haystack, terms)
  if (proximity > 0) {
    score += proximity
    reasons.push('邻近匹配')
  }
  return {
    chunk,
    score,
    rankReason: reasons.slice(0, 3).join(' · ') || '关键词匹配',
    terms: new Set([...matchedTerms, ...keywords].filter((term) => queryTermSet.has(term)))
  }
}

function rerankChunks(entries: ScoredChunk[], limit: number): ScoredChunk[] {
  const selected: ScoredChunk[] = []
  const documentCounts = new Map<string, number>()
  const remaining = [...entries]
  while (selected.length < limit && remaining.length > 0) {
    let bestIndex = 0
    let bestScore = Number.NEGATIVE_INFINITY
    for (let i = 0; i < remaining.length; i += 1) {
      const entry = remaining[i]
      const docPenalty = (documentCounts.get(entry.chunk.documentId) ?? 0) >= MAX_PER_DOCUMENT ? 14 : 0
      const diversityPenalty = selected.some((item) => item.chunk.category && item.chunk.category === entry.chunk.category) ? 1.5 : 0
      const mmrPenalty = selected.reduce((total, item) => total + jaccard(item.terms, entry.terms), 0) * 4
      const adjusted = entry.score - docPenalty - diversityPenalty - mmrPenalty
      if (adjusted > bestScore) {
        bestScore = adjusted
        bestIndex = i
      }
    }
    const [next] = remaining.splice(bestIndex, 1)
    selected.push(next)
    documentCounts.set(next.chunk.documentId, (documentCounts.get(next.chunk.documentId) ?? 0) + 1)
  }
  return selected
}

function cosineScore(queryTerms: Set<string>, frequencies: Map<string, number>): number {
  if (queryTerms.size === 0 || frequencies.size === 0) return 0
  let dot = 0
  let docMagnitude = 0
  for (const value of frequencies.values()) {
    docMagnitude += value * value
  }
  for (const term of queryTerms) {
    dot += frequencies.get(term) ?? 0
  }
  return dot / (Math.sqrt(queryTerms.size) * Math.sqrt(docMagnitude || 1))
}

function proximityScore(text: string, terms: string[]): number {
  const positions = terms.map((term) => text.indexOf(term)).filter((position) => position >= 0)
  if (positions.length < 2) return 0
  const spread = Math.max(...positions) - Math.min(...positions)
  if (spread <= 120) return 6
  if (spread <= 360) return 3
  return 1
}

function jaccard(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 || right.size === 0) return 0
  let intersection = 0
  for (const term of left) {
    if (right.has(term)) intersection += 1
  }
  return intersection / (left.size + right.size - intersection)
}

function termFrequency(text: string): Map<string, number> {
  const result = new Map<string, number>()
  for (const term of queryTerms(text)) {
    result.set(term, (result.get(term) ?? 0) + 1)
  }
  return result
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
    if (text.length <= 12) terms.add(text)
    for (let size = 2; size <= Math.min(4, text.length); size += 1) {
      for (let i = 0; i <= text.length - size; i += 1) {
        terms.add(text.slice(i, i + size))
      }
    }
  }
  return [...terms]
}

function extractKeywords(text: string, limit: number): string[] {
  return [...termFrequency(text).entries()]
    .filter(([term]) => term.length >= 2 && !STOP_WORDS.has(term))
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, limit)
    .map(([term]) => term)
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'this', 'that', 'from',
  '以及', '或者', '可以', '应当', '进行', '相关', '文件', '材料', '内容'
])

function inferCategory(filePath: string, relativePath: string, content: string): string {
  const folder = dirname(relativePath).replaceAll('\\', '/')
  if (folder && folder !== '.') return folder
  return classifyKnowledgeFile(basename(filePath), `${relativePath}\n${content.slice(0, 2000)}`).category
}

function inferTags(filePath: string, relativePath: string, content: string, category: string, keywords: string[]): string[] {
  const ext = extname(filePath).toLowerCase().replace(/^\./, '')
  const tags = new Set<string>([category, ext, ...keywords.slice(0, 6)])
  const text = `${relativePath}\n${content}`.toLowerCase()
  if (/民法典|公司法|劳动法|刑法|行政|司法解释|法规|条例/.test(text)) tags.add('法规')
  if (/合同|协议|条款|违约|解除|履行/.test(text)) tags.add('合同')
  if (/起诉|答辩|证据|仲裁|诉讼|庭审|判决|裁定/.test(text)) tags.add('诉讼')
  if (/案例|判例|裁判|指导案例/.test(text)) tags.add('案例')
  return [...tags].filter(Boolean).slice(0, 20)
}

function classifyKnowledgeFile(name: string, relativePath: string): { category: string; reason: string } {
  const ext = extname(name).toLowerCase()
  const haystack = `${relativePath}/${name}`.toLowerCase()
  if (['.mp3', '.m4a', '.wav', '.aac', '.flac', '.ogg'].includes(ext)) return { category: '音视频', reason: '音频格式' }
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) return { category: '图片资料', reason: '图片格式' }
  if (['.xls', '.xlsx', '.csv', '.tsv'].includes(ext)) return { category: '表格数据', reason: '表格格式' }
  if (['.zip', '.rar', '.7z'].includes(ext)) return { category: '压缩包', reason: '压缩文件' }
  if (/模板|范本|样本|sample|template/.test(haystack)) return { category: '模板范本', reason: '文件名包含模板线索' }
  if (/合同|协议|条款|nda|contract|agreement/.test(haystack)) return { category: '合同协议', reason: '文件名包含合同线索' }
  if (/起诉|答辩|上诉|仲裁|诉讼|证据|庭审|pleading|litigation/.test(haystack)) return { category: '诉讼仲裁', reason: '文件名包含争议解决线索' }
  if (/案例|判例|裁判|判决|裁定|case/.test(haystack)) return { category: '案例判例', reason: '文件名包含案例线索' }
  if (/法规|法律|条例|办法|司法解释|民法典|公司法|保护法|法典|law|regulation/.test(haystack)) return { category: '法规规范', reason: '文件名包含法规线索' }
  if (/调研|研究|报告|memo|research/.test(haystack)) return { category: '调研报告', reason: '文件名包含调研报告线索' }
  if (/会议|纪要|记录|meeting/.test(haystack)) return { category: '会议记录', reason: '文件名包含会议线索' }
  return { category: '其他资料', reason: '默认分类' }
}

function joinKnowledgeRelative(base: string, child: string): string {
  return normalizeRelativePath([base, child].filter(Boolean).join('/'))
}

function normalizeRelativePath(path: string): string {
  return path
    .replaceAll('\\', '/')
    .split('/')
    .map((part) => part.trim())
    .filter((part) => part && part !== '.')
    .join('/')
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
