from pathlib import Path


def read(path: str) -> str:
    return Path(path).read_text(encoding='utf-8')


def write(path: str, text: str) -> None:
    Path(path).write_text(text, encoding='utf-8')


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{path}: expected one match, found {count}: {old[:140]!r}')
    write(path, text.replace(old, new, 1))


def replace_between(path: str, start_marker: str, end_marker: str, replacement: str) -> None:
    text = read(path)
    start = text.find(start_marker)
    if start < 0:
        raise SystemExit(f'{path}: start marker not found: {start_marker!r}')
    end = text.find(end_marker, start)
    if end < 0:
        raise SystemExit(f'{path}: end marker not found: {end_marker!r}')
    write(path, text[:start] + replacement + text[end:])


store = 'apps/desktop-legalwork/legalwork/src/knowledge/knowledge-store.ts'
replace_once(
    store,
    "import { reciprocalRankFuseKnowledgeCandidates } from './knowledge-vector-retriever.js'",
    "import { reciprocalRankFuseKnowledgeCandidates } from './knowledge-vector-retriever.js'\nimport { clearKnowledgeRetrievalCache } from './knowledge-retrieval-cache.js'"
)

sync_method = r'''  async sync(input: KnowledgeSyncRequest = {}): Promise<KnowledgeSyncResult> {
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

'''
replace_between(store, '  async sync(input: KnowledgeSyncRequest = {}): Promise<KnowledgeSyncResult> {', '  async search(', sync_method)

# Clean indentation left by the earlier remote patcher.
old_rrf = r'''        candidates = reciprocalRankFuseKnowledgeCandidates({
lexical,
vector: vectorChunks.map((chunk) => ({
  chunk,
  score: vectorScores.get(chunk.id) ?? 0
})),
limit: RERANK_POOL_SIZE * 2
        })'''
if old_rrf in read(store):
    replace_once(
        store,
        old_rrf,
        r'''        candidates = reciprocalRankFuseKnowledgeCandidates({
          lexical,
          vector: vectorChunks.map((chunk) => ({
            chunk,
            score: vectorScores.get(chunk.id) ?? 0
          })),
          limit: RERANK_POOL_SIZE * 2
        })'''
    )

sqlite = 'apps/desktop-legalwork/legalwork/src/knowledge/knowledge-sqlite-index.ts'
search_method = r'''  async searchCandidates(input: {
    query: string
    limit: number
    layers?: KnowledgeLayer[]
    pathPrefix?: string
  }): Promise<KnowledgeChunk[]> {
    const db = await this.database()
    const limit = Math.max(1, Math.min(500, Math.floor(input.limit)))
    const filters = buildFilters(input.layers, input.pathPrefix)
    const ftsQuery = buildFtsQuery(input.query, this.ftsTokenizer)
    let rows: ChunkRow[] = []

    if (ftsQuery) {
      try {
        rows = db.prepare(`
          SELECT c.*
          FROM chunks_fts
          JOIN chunks c ON c.id = chunks_fts.chunk_id
          WHERE chunks_fts MATCH @match
          ${filters.sql}
          ORDER BY bm25(chunks_fts) ASC
          LIMIT @limit
        `).all({ match: ftsQuery, limit, ...filters.params }) as ChunkRow[]
      } catch {
        rows = []
      }
    }

    if (rows.length === 0) {
      const fallbackTerms = buildFallbackLikeTerms(input.query)
      if (fallbackTerms.length > 0) {
        const params: Record<string, unknown> = { limit, ...filters.params }
        const predicates = fallbackTerms.map((term, index) => {
          params[`like${index}`] = `%${escapeLike(term)}%`
          return `(
            lower(c.title) LIKE @like${index} ESCAPE '\\'
            OR lower(c.relative_path) LIKE @like${index} ESCAPE '\\'
            OR lower(c.category) LIKE @like${index} ESCAPE '\\'
            OR lower(c.content) LIKE @like${index} ESCAPE '\\'
          )`
        })
        rows = db.prepare(`
          SELECT c.*
          FROM chunks c
          WHERE (${predicates.join(' OR ')})
          ${filters.sql}
          ORDER BY c.rowid ASC
          LIMIT @limit
        `).all(params) as ChunkRow[]
      }
    }

    return rows.map(chunkFromRow)
  }

'''
replace_between(sqlite, '  async searchCandidates(input: {', '  async lookupChunks(chunkIds: string[]): Promise<KnowledgeChunk[]> {', search_method)
replace_between(
    sqlite,
    "function buildFtsQuery(query: string, tokenizer: 'trigram' | 'unicode61'): string {",
    'function escapeLike(value: string): string {',
    r'''function buildFtsQuery(query: string, tokenizer: 'trigram' | 'unicode61'): string {
  const normalized = query.normalize('NFKC').toLowerCase()
  const terms = new Set<string>()
  for (const term of normalized.match(/[a-z0-9_]{2,}/g) ?? []) {
    terms.add(term)
  }
  for (const sequence of normalized.match(/[\u3400-\u9fff]{2,}/g) ?? []) {
    const chars = [...sequence]
    if (tokenizer === 'trigram') {
      for (let index = 0; index <= chars.length - 3 && terms.size < 20; index += 1) {
        terms.add(chars.slice(index, index + 3).join(''))
      }
    } else {
      terms.add(sequence)
    }
  }
  return [...terms]
    .slice(0, 20)
    .map((term) => `"${term.replaceAll('"', '""')}"`)
    .join(' OR ')
}

function buildFallbackLikeTerms(query: string): string[] {
  const normalized = query.normalize('NFKC').toLowerCase()
  const terms = new Set<string>()
  for (const term of normalized.match(/[a-z0-9_]{2,}/g) ?? []) {
    terms.add(term)
  }
  for (const sequence of normalized.match(/[\u3400-\u9fff]{2,}/g) ?? []) {
    const chars = [...sequence]
    if (chars.length <= 4) {
      terms.add(sequence)
      continue
    }
    for (let index = 0; index <= chars.length - 3 && terms.size < 10; index += 1) {
      terms.add(chars.slice(index, index + 3).join(''))
    }
  }
  if (terms.size === 0 && normalized.trim()) terms.add(normalized.trim())
  return [...terms].slice(0, 10)
}

'''
)

provider = 'apps/desktop-legalwork/legalwork/src/adapters/tool/knowledge-tool-provider.ts'
search_tool = r'''      LocalToolHost.defineTool({
        name: 'knowledge_search',
        description: 'Search the local legal knowledge base for relevant legal provisions, contract clauses, cases, research, and matter materials. Returns ranked evidence chunks with source metadata and provenance. Retrieval strategy is selected internally; do not apply the legacy software-engineering pyramid as a legal relevance filter.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query for legal terms, clauses, case names, article numbers, facts, or keywords' },
            limit: { type: 'number', minimum: 1, maximum: 20, description: 'Max results (default 8, max 20)' }
          },
          required: ['query'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const query = typeof args.query === 'string' ? args.query.trim() : ''
          if (!query) return { output: { error: 'query is required' }, isError: true }
          const limit = typeof args.limit === 'number' && Number.isFinite(args.limit)
            ? Math.max(1, Math.min(20, Math.floor(args.limit)))
            : 8
          const sources = await store.search({ query, limit, includeContent: true })
          const cappedSources = sources.slice(0, 8)
          const truncatedSources = cappedSources.map((source) => ({
            ...source,
            ...(source.content && source.content.length > 500
              ? { content: `${source.content.slice(0, 500)}\n…[截断，完整内容请用 knowledge_read_file 读取 ${source.relativePath}]` }
              : {})
          }))
          return { output: { query, sources: truncatedSources } }
        }
      }),
'''
replace_between(provider, "      LocalToolHost.defineTool({\n        name: 'knowledge_search'", "      LocalToolHost.defineTool({\n        name: 'knowledge_list_tree'", search_tool)

auto_tool = r'''      LocalToolHost.defineTool({
        name: 'knowledge_auto_retrieve',
        description: 'One-step legal knowledge retrieval: given a user question or task description, searches the local knowledge base, filters expired/deprecated materials, and returns a citation-ready context block with source provenance. Retrieval strategy is selected internally.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The user question or task that needs legal knowledge context' },
            excludeExpired: { type: 'boolean', description: 'Whether to filter out expired/deprecated content (default true)' }
          },
          required: ['query'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args) => {
          const query = typeof args.query === 'string' ? args.query.trim() : ''
          if (!query) return { output: { error: 'query is required' }, isError: true }
          const excludeExpired = args.excludeExpired !== false
          const { KnowledgeRetrievalPipeline } = await import('../../knowledge/knowledge-retrieval-pipeline.js')
          const pipeline = new KnowledgeRetrievalPipeline(store)
          const result = await pipeline.retrieve(query, { excludeExpired })
          const cappedSources = result.sources.slice(0, 8)
          const trimmedSources = cappedSources.map((source) => ({
            ...source,
            ...(source.content && source.content.length > 500
              ? { content: `${source.content.slice(0, 500)}\n…[截断，完整内容请用 knowledge_read_file 读取]` }
              : {})
          }))
          return { output: { ...result, sources: trimmedSources } }
        }
      }),
'''
replace_between(provider, "      LocalToolHost.defineTool({\n        name: 'knowledge_auto_retrieve'", "      LocalToolHost.defineTool({\n        name: 'knowledge_legal_external_sources'", auto_tool)

# No Agent-facing knowledge tool now needs the legacy pyramid type.
provider_text = read(provider)
provider_text = provider_text.replace("import type { KnowledgeLayer } from '../../contracts/knowledge.js'\n", '', 1)
write(provider, provider_text)

# Cache must be invalidated even by an unchanged sync because sidecar metadata
# can change independently of document bytes.
tests = 'apps/desktop-legalwork/legalwork/src/knowledge/knowledge-store.test.ts'
replace_once(
    tests,
    """      const secondSync = await store.sync()\n      expect(secondSync.updatedFileCount).toBe(0)\n      expect(secondSync.unchangedFileCount).toBe(1)\n      expect(secondSync.revision).toBe(firstSync.revision)\n\n      await writeFile(filePath, '第一条 修改后的行政程序规则与听证要求。', 'utf8')""",
    """      const secondSync = await store.sync()\n      expect(secondSync.updatedFileCount).toBe(0)\n      expect(secondSync.unchangedFileCount).toBe(1)\n      expect(secondSync.revision).toBe(firstSync.revision)\n      const afterSync = await new KnowledgeRetrievalPipeline(store).retrieve('行政程序规则')\n      expect(afterSync.cacheHit).toBe(false)\n\n      await writeFile(filePath, '第一条 修改后的行政程序规则与听证要求。', 'utf8')"""
)

short_test = Path('apps/desktop-legalwork/legalwork/src/knowledge/knowledge-sqlite-short-query.test.ts')
short_test.write_text(r'''import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { KnowledgeDocument } from '../contracts/knowledge.js'
import { chunkKnowledgeDocument } from './knowledge-structured-chunker.js'
import { KnowledgeSqliteIndex } from './knowledge-sqlite-index.js'

describe('KnowledgeSqliteIndex Chinese queries', () => {
  it('supports both two-character terms and longer natural-language legal queries', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-kb-short-query-'))
    const index = new KnowledgeSqliteIndex(root)
    try {
      const doc: KnowledgeDocument = {
        id: 'doc_contract',
        title: '合同解除规则',
        path: '/tmp/contract.md',
        sourceRoot: '/tmp',
        relativePath: '合同/解除规则.md',
        extension: '.md',
        sizeBytes: 80,
        updatedAt: '2026-08-07T00:00:00.000Z',
        documentHash: 'contract-hash',
        sourceMtimeMs: 1,
        indexedAt: '2026-08-07T00:00:00.000Z'
      }
      await index.upsertDocument(
        doc,
        chunkKnowledgeDocument(doc, '第一条 合同解除应当符合约定或者法律规定。解除后仍可能承担违约责任。', 'contract-hash')
      )
      const shortHits = await index.searchCandidates({ query: '合同', limit: 10 })
      const contractHit = shortHits.find((hit) => hit.content.includes('合同解除'))
      expect(contractHit).toBeTruthy()
      expect(contractHit?.provenanceId).toMatch(/^kb_[a-f0-9]{24}$/)
      expect(contractHit?.documentHash).toBe('contract-hash')

      const naturalLanguageHits = await index.searchCandidates({
        query: '合同解除以后违约责任应该如何承担',
        limit: 10
      })
      const naturalLanguageHit = naturalLanguageHits.find((hit) => hit.content.includes('违约责任'))
      expect(naturalLanguageHit).toBeTruthy()
      expect(naturalLanguageHit?.provenanceId).toMatch(/^kb_[a-f0-9]{24}$/)
    } finally {
      index.close()
      await rm(root, { recursive: true, force: true })
    }
  })
})
''', encoding='utf-8')

# This file is only a staging aid for a remote validation runner. Remove it so
# the validated product commit cannot retain the patch script.
Path(__file__).unlink()
