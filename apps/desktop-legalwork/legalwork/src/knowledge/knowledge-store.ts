import { createHash } from 'node:crypto'
import { createReadStream, existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, normalize, relative, resolve, sep } from 'node:path'
import { extractDocumentText, EXTRACTABLE_EXTENSIONS } from './text-extractor.js'
import { makeUserItem } from '../domain/item.js'
import type { ModelClient, ModelRequest, ModelStreamChunk } from '../ports/model-client.js'
import type {
  KnowledgeChunk,
  KnowledgeClassifyRequest,
  KnowledgeClassifyResult,
  KnowledgeCreateFolderRequest,
  KnowledgeDiagnostics,
  KnowledgeDocument,
  KnowledgeFileContent,
  KnowledgeLayer,
  KnowledgeMoveRequest,
  KnowledgeSearchHit,
  KnowledgeSyncRequest,
  KnowledgeSyncResult,
  KnowledgeTreeNode
} from '../contracts/knowledge.js'
import { inferLayerFromMeta } from './knowledge-pyramid-router.js'
import { KnowledgeSqliteIndex } from './knowledge-sqlite-index.js'
import { chunkKnowledgeDocument } from './knowledge-structured-chunker.js'
import type { KnowledgeVectorRetriever } from './knowledge-vector-retriever.js'
import { reciprocalRankFuseKnowledgeCandidates } from './knowledge-vector-retriever.js'
import { clearKnowledgeRetrievalCache } from './knowledge-retrieval-cache.js'

export interface KnowledgeStore {
  sync(input?: KnowledgeSyncRequest): Promise<KnowledgeSyncResult>
  search(input: { query: string; limit: number; includeContent?: boolean; layer?: KnowledgeLayer; layers?: KnowledgeLayer[]; pathPrefix?: string }): Promise<KnowledgeSearchHit[]>
  lookupChunks(chunkIds: string[]): Promise<KnowledgeSearchHit[]>
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
  /** Extract plain text from a managed document (pdf/docx/xlsx etc.). Returns optional formatted HTML for docx. */
  extractText(path: string): Promise<{ path: string; text: string; extension: string; html?: string }>
  /** Resolve the absolute path of a managed file/folder. */
  absolutePath(path: string): Promise<{ path: string; absolute: string }>
  /** Move / rename a file or folder under managed root. */
  move(input: KnowledgeMoveRequest): Promise<{ sourcePath: string; destPath: string }>
  /** Delete a file or folder under managed root. */
  delete(path: string): Promise<{ path: string }>
  /** Automatically classify managed files into category folders. */
  classify(input?: KnowledgeClassifyRequest): Promise<KnowledgeClassifyResult>
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
const DEFAULT_MAX_FILES = 50_000
const RERANK_POOL_SIZE = 160
const MAX_PER_DOCUMENT = 3
const CLASSIFY_TEXT_LIMIT = 6000
const CLASSIFY_MODEL_TIMEOUT_MS = 18_000
const MAX_CLASSIFICATION_CACHE_SIZE = 500

const DEFAULT_CLASSIFICATION_CATEGORIES = [
  '论文',
  '调研报告',
  '合同协议',
  '诉讼仲裁',
  '案例判例',
  '法规规范',
  '模板范本',
  '会议记录',
  '音视频',
  '图片资料',
  '表格数据',
  '压缩包',
  '其他资料'
]

type ScoredChunk = {
  chunk: KnowledgeChunk
  score: number
  rankReason: string
  terms: Set<string>
}

export class FileKnowledgeStore implements KnowledgeStore {
  private lastSelectedIds: string[] = []
  /**
   * 分类模型调用缓存：key = relPath + textPreview 的 hash。同一文件内容未变时
   * 重复 classify（如 dryRun 后正式分类、反复点击）直接复用结果，不重复调模型。
   * 有界缓存，避免无限增长。
   */
  private readonly classificationCache = new Map<string, KnowledgeClassification>()
  private readonly sqliteIndex: KnowledgeSqliteIndex

  constructor(
    private readonly options: {
      rootDir: string
      sourceRoots?: string[]
      nowIso?: () => string
      managedRoot?: string
      model?: ModelClient
      classifyModel?: string
      vectorRetriever?: KnowledgeVectorRetriever
    }
  ) {
    this.sqliteIndex = new KnowledgeSqliteIndex(this.options.rootDir)
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
    if (!relativePath || relativePath === '.' || relativePath === '..') {
      throw new Error(`Invalid knowledge path: "${relativePath}"`)
    }
    const normalized = normalize(relativePath)
    if (normalized === '..' || normalized.startsWith(`..${sep}`)) {
      throw new Error(`Path "${relativePath}" escapes managed root`)
    }
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

  async extractText(filePath: string): Promise<{ path: string; text: string; extension: string; html?: string }> {
    await this.ensureManagedRoot()
    const absolute = this.resolveManaged(filePath)
    const extension = extname(absolute).toLowerCase()
    const result = EXTRACTABLE_EXTENSIONS.has(extension)
      ? await extractDocumentText(absolute)
      : { text: '' }
    return { path: filePath, text: result.text, extension, html: result.html }
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

  async classify(input: Partial<KnowledgeClassifyRequest> = {}): Promise<KnowledgeClassifyResult> {
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
    const candidateCategories = await this.classificationCategories(targetRoot)
    for (const absolute of uniqueFiles) {
      const relPath = relative(this.managedRoot, absolute).replaceAll('\\', '/')
      const name = basename(absolute)
      const textPreview = await this.readClassificationText(absolute)
      const fallbackClassification = classifyKnowledgeFile(name, relPath, textPreview)
      // 内容未变时复用已分类结果，避免同一文件重复调用分类模型。
      const cacheKey = hashId(`${relPath}::${textPreview}`)
      let classification = this.classificationCache.get(cacheKey)
      if (!classification) {
        classification = await this.classifyWithModel({
          relativePath: relPath,
          name,
          textPreview,
          candidateCategories,
          fallback: fallbackClassification
        })
        this.classificationCache.set(cacheKey, classification)
        if (this.classificationCache.size > MAX_CLASSIFICATION_CACHE_SIZE) {
          this.classificationCache.clear()
        }
      }
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
    const candidateFiles: string[] = []
    let skippedCount = 0

    for (const root of roots) {
      const result = await collectFiles(root)
      candidateFiles.push(...result.files)
      skippedCount += result.skippedCount
    }

    const uniqueCandidates = [...new Set(candidateFiles.map((filePath) => resolve(filePath)))]
    const uniqueFiles = uniqueCandidates.slice(0, maxFiles)
    const truncatedFileCount = Math.max(0, uniqueCandidates.length - uniqueFiles.length)
    const syncedAt = this.now()
    const indexedDocumentIds: string[] = []
    let failedFileCount = 0
    let unchangedFileCount = 0
    let updatedFileCount = 0

    for (const filePath of uniqueFiles) {
      const documentId = hashId(filePath)
      indexedDocumentIds.push(documentId)
      const root = roots
        .filter((candidate) => isInside(filePath, candidate))
        .sort((left, right) => right.length - left.length)[0] ?? roots[0] ?? resolve('.')
      try {
        const info = await stat(filePath)
        const existing = await this.sqliteIndex.documentState(documentId)
        const metadataUnchanged = existing
          && existing.sizeBytes === info.size
          && Math.abs(existing.sourceMtimeMs - info.mtimeMs) < 1
        if (metadataUnchanged) {
          unchangedFileCount += 1
          await this.sqliteIndex.touchDocument({
            documentId,
            sizeBytes: info.size,
            sourceMtimeMs: info.mtimeMs,
            updatedAt: info.mtime.toISOString()
          })
          continue
        }

        // Only hash file bytes when size/mtime changed. This keeps a repeated
        // sync over a 10k-50k document library metadata-bound instead of doing
        // a full disk read of every unchanged file.
        const documentHash = await hashFileSha256(filePath)
        if (existing?.documentHash === documentHash) {
          unchangedFileCount += 1
          await this.sqliteIndex.touchDocument({
            documentId,
            sizeBytes: info.size,
            sourceMtimeMs: info.mtimeMs,
            updatedAt: info.mtime.toISOString()
          })
          continue
        }

        const ext = extname(filePath).toLowerCase()
        const content = TEXT_EXTENSIONS.has(ext)
          ? normalizeText(await readFile(filePath, 'utf8'))
          : normalizeText((await extractDocumentText(filePath)).text)
        if (!content.trim()) {
          failedFileCount += 1
          skippedCount += 1
          await this.sqliteIndex.deleteDocument(documentId)
          continue
        }

        const relPath = relative(root, filePath) || basename(filePath)
        const category = inferCategory(filePath, relPath, content)
        const keywords = extractKeywords(`${relPath}\n${content}`, 16)
        const tags = inferTags(filePath, relPath, content, category, keywords)
        const layer = inferLayerFromMeta(relPath, category, tags, ext, content.slice(0, 2000))
        const document: KnowledgeDocument = {
          id: documentId,
          title: titleFromPath(filePath),
          path: filePath,
          sourceRoot: root,
          relativePath: relPath,
          category,
          tags,
          keywords,
          extension: ext,
          sizeBytes: info.size,
          updatedAt: info.mtime.toISOString(),
          layer,
          documentHash,
          sourceMtimeMs: info.mtimeMs,
          indexedAt: syncedAt
        }
        const chunks = chunkKnowledgeDocument(document, content, documentHash)
        await this.sqliteIndex.upsertDocument(document, chunks)
        updatedFileCount += 1
      } catch {
        failedFileCount += 1
        skippedCount += 1
        await this.sqliteIndex.deleteDocument(documentId).catch(() => false)
      }
    }

    const deletedFileCount = await this.sqliteIndex.deleteDocumentsNotIn(indexedDocumentIds)
    await this.sqliteIndex.setSyncMetadata({
      syncedAt,
      roots,
      skippedCount,
      candidateFileCount: uniqueCandidates.length,
      attemptedFileCount: uniqueFiles.length,
      failedFileCount,
      truncatedFileCount
    })
    const revision = await this.sqliteIndex.recomputeRevision()
    // Sync can change sidecar metadata or expiry/deprecation state without
    // changing document bytes/revision, so process-local retrieval cache must
    // be invalidated after every completed sync.
    clearKnowledgeRetrievalCache()
    const diagnostics = await this.sqliteIndex.diagnostics()
    return {
      syncedAt,
      roots,
      documentCount: diagnostics.documentCount,
      chunkCount: diagnostics.chunkCount,
      skippedCount,
      candidateFileCount: uniqueCandidates.length,
      attemptedFileCount: uniqueFiles.length,
      failedFileCount,
      truncatedFileCount,
      truncated: truncatedFileCount > 0,
      unchangedFileCount,
      updatedFileCount,
      deletedFileCount,
      revision,
      backend: 'sqlite-fts5',
      retrieverVersion: diagnostics.retrieverVersion
    }
  }

  async search(input: { query: string; limit: number; includeContent?: boolean; layer?: KnowledgeLayer; layers?: KnowledgeLayer[]; pathPrefix?: string }): Promise<KnowledgeSearchHit[]> {
    const query = input.query.trim()
    if (!query) return []

    let indexDiagnostics = await this.sqliteIndex.diagnostics()
    if (indexDiagnostics.documentCount === 0) {
      await this.sync()
      indexDiagnostics = await this.sqliteIndex.diagnostics()
    }

    const targetLayers = new Set<KnowledgeLayer>()
    if (input.layer) targetLayers.add(input.layer)
    if (input.layers) input.layers.forEach((layer) => targetLayers.add(layer))
    const lexical = await this.sqliteIndex.searchCandidates({
      query,
      limit: Math.max(RERANK_POOL_SIZE * 2, Math.max(1, input.limit) * 12),
      ...(targetLayers.size ? { layers: [...targetLayers] } : {}),
      ...(input.pathPrefix ? { pathPrefix: input.pathPrefix } : {})
    })

    let candidates = lexical
    if (this.options.vectorRetriever) {
      const vectorHits = await this.options.vectorRetriever.search({
        query,
        limit: Math.max(RERANK_POOL_SIZE, Math.max(1, input.limit) * 8),
        ...(targetLayers.size ? { layers: [...targetLayers] } : {}),
        ...(input.pathPrefix ? { pathPrefix: input.pathPrefix } : {})
      }).catch(() => [])
      if (vectorHits.length) {
        const vectorChunks = await this.sqliteIndex.lookupChunks(vectorHits.map((hit) => hit.chunkId))
        const vectorScores = new Map(vectorHits.map((hit) => [hit.chunkId, hit.score]))
        candidates = reciprocalRankFuseKnowledgeCandidates({
          lexical,
          vector: vectorChunks.map((chunk) => ({
            chunk,
            score: vectorScores.get(chunk.id) ?? 0
          })),
          limit: RERANK_POOL_SIZE * 2
        })
      }
    }

    candidates = [...new Map(candidates.map((chunk) => [chunk.id, chunk])).values()]
    const terms = queryTerms(query)
    const lowerQuery = query.toLowerCase()
    const queryTermSet = new Set(terms)
    const primaryLayer = input.layer ?? (targetLayers.size === 1 ? [...targetLayers][0] : undefined)
    const hits = rerankChunks(candidates
      .map((chunk) => scoreChunk(chunk, lowerQuery, terms, queryTermSet, primaryLayer))
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
        ...(chunk.layer ? { layer: chunk.layer } : {}),
        ...(typeof chunk.chunkIndex === 'number' ? { chunkIndex: chunk.chunkIndex } : {}),
        ...(chunk.documentHash ? { documentHash: chunk.documentHash } : {}),
        ...(chunk.chunkHash ? { chunkHash: chunk.chunkHash } : {}),
        ...(chunk.provenanceId ? { provenanceId: chunk.provenanceId } : {}),
        ...(chunk.headingPath?.length ? { headingPath: chunk.headingPath } : {}),
        ...(chunk.articleNumber ? { articleNumber: chunk.articleNumber } : {}),
        ...(typeof chunk.charStart === 'number' ? { charStart: chunk.charStart } : {}),
        ...(typeof chunk.charEnd === 'number' ? { charEnd: chunk.charEnd } : {}),
        ...(chunk.chunkerVersion ? { chunkerVersion: chunk.chunkerVersion } : {}),
        score,
        rankReason,
        snippet: makeSnippet(chunk.content, lowerQuery, terms),
        ...(input.includeContent ? { content: chunk.content } : {})
      }))
    this.setLastSelected(hits.map((hit) => hit.documentId))
    return hits
  }

  async lookupChunks(chunkIds: string[]): Promise<KnowledgeSearchHit[]> {
    const chunks = await this.sqliteIndex.lookupChunks(chunkIds)
    return chunks.map((chunk) => ({
      documentId: chunk.documentId,
      chunkId: chunk.id,
      title: chunk.title,
      path: chunk.path,
      relativePath: chunk.relativePath,
      ...(chunk.category ? { category: chunk.category } : {}),
      ...(chunk.tags?.length ? { tags: chunk.tags } : {}),
      ...(chunk.keywords?.length ? { keywords: chunk.keywords } : {}),
      ...(chunk.layer ? { layer: chunk.layer } : {}),
      ...(typeof chunk.chunkIndex === 'number' ? { chunkIndex: chunk.chunkIndex } : {}),
      ...(chunk.documentHash ? { documentHash: chunk.documentHash } : {}),
      ...(chunk.chunkHash ? { chunkHash: chunk.chunkHash } : {}),
      ...(chunk.provenanceId ? { provenanceId: chunk.provenanceId } : {}),
      ...(chunk.headingPath?.length ? { headingPath: chunk.headingPath } : {}),
      ...(chunk.articleNumber ? { articleNumber: chunk.articleNumber } : {}),
      ...(typeof chunk.charStart === 'number' ? { charStart: chunk.charStart } : {}),
      ...(typeof chunk.charEnd === 'number' ? { charEnd: chunk.charEnd } : {}),
      ...(chunk.chunkerVersion ? { chunkerVersion: chunk.chunkerVersion } : {}),
      score: 1,
      rankReason: 'provenance lookup',
      snippet: chunk.content.slice(0, 480).replace(/\s+/g, ' ').trim(),
      content: chunk.content
    }))
  }

  async diagnostics(): Promise<KnowledgeDiagnostics> {
    const index = await this.sqliteIndex.diagnostics()
    return {
      enabled: true,
      rootDir: this.options.rootDir,
      sourceRoots: normalizeRoots(this.options.sourceRoots ?? []),
      documentCount: index.documentCount,
      chunkCount: index.chunkCount,
      candidateFileCount: index.candidateFileCount,
      attemptedFileCount: index.attemptedFileCount,
      failedFileCount: index.failedFileCount,
      truncatedFileCount: index.truncatedFileCount,
      truncated: index.truncatedFileCount > 0,
      revision: index.revision,
      backend: 'sqlite-fts5',
      retrieverVersion: index.retrieverVersion,
      ...(index.syncedAt ? { syncedAt: index.syncedAt } : {}),
      lastSelectedIds: [...this.lastSelectedIds]
    }
  }

  setLastSelected(ids: string[]): void {
    this.lastSelectedIds = [...new Set(ids)].slice(0, 20)
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

  private now(): string {
    return this.options.nowIso?.() ?? new Date().toISOString()
  }

  private async classificationCategories(targetRoot: string): Promise<string[]> {
    const folders = await directChildFolders(targetRoot ? this.resolveManaged(targetRoot) : this.managedRoot)
    return uniqueCategories([...folders, ...DEFAULT_CLASSIFICATION_CATEGORIES])
  }

  private async readClassificationText(absolute: string): Promise<string> {
    const ext = extname(absolute).toLowerCase()
    try {
      const content = TEXT_EXTENSIONS.has(ext)
        ? await readFile(absolute, 'utf8')
        : EXTRACTABLE_EXTENSIONS.has(ext)
          ? (await extractDocumentText(absolute)).text
          : ''
      return normalizeText(content).slice(0, CLASSIFY_TEXT_LIMIT)
    } catch {
      return ''
    }
  }

  private async classifyWithModel(input: {
    relativePath: string
    name: string
    textPreview: string
    candidateCategories: string[]
    fallback: KnowledgeClassification
  }): Promise<KnowledgeClassification> {
    const model = this.options.model
    if (!model || !input.textPreview.trim()) return input.fallback

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), CLASSIFY_MODEL_TIMEOUT_MS)
    try {
      const turnId = `knowledge_classify_${hashId(input.relativePath)}`
      const request: ModelRequest = {
        threadId: 'knowledge-classifier',
        turnId,
        model: this.options.classifyModel ?? model.model,
        systemPrompt: KNOWLEDGE_CLASSIFIER_SYSTEM_PROMPT,
        prefix: [],
        history: [
          makeUserItem({
            id: `${turnId}_user`,
            threadId: 'knowledge-classifier',
            turnId,
            text: buildKnowledgeClassifierPrompt(input)
          })
        ],
        tools: [],
        abortSignal: controller.signal,
        stream: false,
        maxTokens: 220,
        temperature: 0,
        responseFormat: 'json_object',
        reasoningEffort: 'off'
      }
      const raw = await collectModelText(model.stream(request), controller.signal)
      const parsed = parseModelClassification(raw, input.candidateCategories)
      if (!parsed) return input.fallback
      return parsed
    } catch {
      return input.fallback
    } finally {
      clearTimeout(timeout)
    }
  }
}

type KnowledgeClassification = {
  category: string
  reason: string
}

const KNOWLEDGE_CLASSIFIER_SYSTEM_PROMPT = [
  '你是法律知识库文件分类器。',
  '必须根据文件正文的实质内容分类，文件名和扩展名只能作为辅助。',
  '只能输出紧凑 JSON，不要输出 Markdown。',
  '格式：{"category":"候选目录名","reason":"20字内中文理由"}。'
].join('')

function buildKnowledgeClassifierPrompt(input: {
  relativePath: string
  name: string
  textPreview: string
  candidateCategories: string[]
  fallback: KnowledgeClassification
}): string {
  return [
    `候选目录：${input.candidateCategories.join('、')}`,
    `文件路径：${input.relativePath}`,
    `文件名：${input.name}`,
    `规则兜底分类：${input.fallback.category}（${input.fallback.reason}）`,
    '分类要求：优先选择候选目录；只有正文确实无法归入候选目录时，才使用“其他资料”。',
    '正文预览：',
    input.textPreview || '(无可读取正文)'
  ].join('\n')
}

async function collectModelText(stream: AsyncIterable<ModelStreamChunk>, abortSignal: AbortSignal): Promise<string> {
  let text = ''
  for await (const chunk of stream) {
    if (abortSignal.aborted) break
    if (chunk.kind === 'assistant_text_delta') text += chunk.text
    if (chunk.kind === 'error') throw new Error(chunk.message)
  }
  return text.trim()
}

function parseModelClassification(raw: string, candidateCategories: string[]): KnowledgeClassification | null {
  const json = extractFirstJsonObject(raw)
  if (!json) return null
  try {
    const value = JSON.parse(json) as { category?: unknown; reason?: unknown }
    const category = normalizeModelCategory(
      typeof value.category === 'string' ? value.category : '',
      candidateCategories
    )
    if (!category || !candidateCategories.includes(category)) return null
    const reason = typeof value.reason === 'string' && value.reason.trim()
      ? value.reason.trim().slice(0, 80)
      : '模型根据正文分类'
    return { category, reason }
  } catch {
    return null
  }
}

function normalizeModelCategory(category: string, candidateCategories: string[]): string {
  const normalized = normalizeCategory(category)
  if (candidateCategories.includes(normalized)) return normalized
  const aliases: Record<string, string> = {
    研究报告: '调研报告',
    调查报告: '调研报告',
    法律法规: '法规规范',
    法规: '法规规范',
    案例: '案例判例',
    判例: '案例判例',
    合同: '合同协议',
    协议: '合同协议',
    诉讼材料: '诉讼仲裁',
    仲裁材料: '诉讼仲裁',
    模板: '模板范本',
    范本: '模板范本',
    音频: '音视频',
    视频: '音视频',
    图片: '图片资料',
    表格: '表格数据',
    资料: '其他资料'
  }
  const alias = aliases[normalized]
  return alias && candidateCategories.includes(alias) ? alias : normalized
}

function extractFirstJsonObject(raw: string): string | null {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) return null
  return raw.slice(start, end + 1)
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

async function collectFiles(root: string): Promise<{ files: string[]; skippedCount: number }> {
  const files: string[] = []
  let skippedCount = 0
  async function visit(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) {
          skippedCount += 1
          continue
        }
        await visit(path)
      } else if (entry.isFile()) {
        // Never index our own system files as knowledge documents: index.json
        // is the search index itself and *.meta.json are sidecar metadata. Both
        // are internal bookkeeping, not user content, and indexing them pollutes
        // retrieval results with noise entries titled "index".
        if (entry.name === 'index.json' || entry.name.endsWith('.meta.json')) {
          skippedCount += 1
          continue
        }
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

async function directChildFolders(absolute: string): Promise<string[]> {
  const entries = await readdir(absolute, { withFileTypes: true }).catch(() => [])
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => normalizeCategory(entry.name))
    .filter(Boolean)
}

function scoreChunk(chunk: KnowledgeChunk, lowerQuery: string, terms: string[], queryTermSet: Set<string>, primaryLayer?: KnowledgeLayer): ScoredChunk {
  const haystack = `${chunk.title}\n${chunk.relativePath}\n${chunk.category ?? ''}\n${chunk.keywords?.join(' ') ?? ''}\n${chunk.content}`.toLowerCase()
  let score = haystack.includes(lowerQuery) ? 12 : 0
  const reasons: string[] = []
  if (score > 0) reasons.push('短语匹配')

  // Layer-aware boost: chunks matching the primary target layer get a bonus
  if (primaryLayer && chunk.layer === primaryLayer) {
    score += 8
    reasons.push('层匹配')
  }
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
  return classifyKnowledgeFile(basename(filePath), relativePath, content.slice(0, 2000)).category
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

function classifyKnowledgeFile(name: string, relativePath: string, content = ''): KnowledgeClassification {
  const ext = extname(name).toLowerCase()
  const haystack = `${relativePath}/${name}`.toLowerCase()
  const contentHaystack = content.toLowerCase()
  if (/摘要|关键词|参考文献|文献综述|开题报告|毕业论文|学位论文|journal|thesis|dissertation/.test(contentHaystack)) {
    return { category: '论文', reason: '正文包含论文结构' }
  }
  if (/调研|研究报告|访谈|问卷|行业分析|现状分析|可行性研究|尽职调查|research report|survey/.test(contentHaystack)) {
    return { category: '调研报告', reason: '正文包含调研报告线索' }
  }
  if (/合同|协议|条款|违约责任|解除条件|付款条款|履行期限|contract|agreement/.test(contentHaystack)) {
    return { category: '合同协议', reason: '正文包含合同条款线索' }
  }
  if (/起诉状|答辩状|上诉状|仲裁申请|证据目录|质证意见|庭审笔录|诉讼请求|litigation/.test(contentHaystack)) {
    return { category: '诉讼仲裁', reason: '正文包含争议解决线索' }
  }
  if (/本院认为|裁判要旨|指导案例|判决如下|裁定如下|案号|case/.test(contentHaystack)) {
    return { category: '案例判例', reason: '正文包含裁判案例线索' }
  }
  if (/民法典|公司法|劳动法|刑法|行政法规|司法解释|法律条文|条例|办法|个人信息保护法|个人信息处理者|敏感个人信息|单独同意|regulation/.test(contentHaystack)) {
    return { category: '法规规范', reason: '正文包含法规规范线索' }
  }
  if (/模板|范本|填写说明|示范文本|sample|template/.test(contentHaystack)) {
    return { category: '模板范本', reason: '正文包含模板线索' }
  }
  if (/会议纪要|会议记录|参会人员|会议时间|meeting minutes/.test(contentHaystack)) {
    return { category: '会议记录', reason: '正文包含会议记录线索' }
  }
  if (['.mp3', '.m4a', '.wav', '.aac', '.flac', '.ogg'].includes(ext)) return { category: '音视频', reason: '音频格式' }
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) return { category: '图片资料', reason: '图片格式' }
  if (['.xls', '.xlsx', '.csv', '.tsv'].includes(ext)) return { category: '表格数据', reason: '表格格式' }
  if (['.zip', '.rar', '.7z'].includes(ext)) return { category: '压缩包', reason: '压缩文件' }
  if (/论文|thesis|paper|dissertation/.test(haystack)) return { category: '论文', reason: '文件名包含论文线索' }
  if (/模板|范本|样本|sample|template/.test(haystack)) return { category: '模板范本', reason: '文件名包含模板线索' }
  if (/合同|协议|条款|nda|contract|agreement/.test(haystack)) return { category: '合同协议', reason: '文件名包含合同线索' }
  if (/起诉|答辩|上诉|仲裁|诉讼|证据|庭审|pleading|litigation/.test(haystack)) return { category: '诉讼仲裁', reason: '文件名包含争议解决线索' }
  if (/案例|判例|裁判|判决|裁定|case/.test(haystack)) return { category: '案例判例', reason: '文件名包含案例线索' }
  if (/法规|法律|条例|办法|司法解释|民法典|公司法|保护法|法典|law|regulation/.test(haystack)) return { category: '法规规范', reason: '文件名包含法规线索' }
  if (/调研|研究|报告|memo|research/.test(haystack)) return { category: '调研报告', reason: '文件名包含调研报告线索' }
  if (/会议|纪要|记录|meeting/.test(haystack)) return { category: '会议记录', reason: '文件名包含会议线索' }
  return { category: '其他资料', reason: '默认分类' }
}

function uniqueCategories(categories: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const category of categories) {
    const normalized = normalizeCategory(category)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }
  return result
}

function normalizeCategory(category: string): string {
  return normalizeRelativePath(category).split('/').at(-1)?.trim().slice(0, 40) ?? ''
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

function knowledgeSearchRelativePath(chunk: KnowledgeChunk, managedRoot: string): string {
  if (isInside(chunk.path, managedRoot)) {
    return normalizeRelativePath(relative(managedRoot, chunk.path))
  }
  return normalizeRelativePath(chunk.relativePath)
}

async function hashFileSha256(filePath: string): Promise<string> {
  return await new Promise<string>((resolveHash, rejectHash) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('error', rejectHash)
    stream.on('end', () => resolveHash(hash.digest('hex')))
  })
}

function normalizeText(text: string): string {
  // eslint-disable-next-line no-control-regex
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
