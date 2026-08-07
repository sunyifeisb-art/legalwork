import { createHash } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Database as BetterSqliteDatabase } from 'better-sqlite3'
import type {
  KnowledgeChunk,
  KnowledgeDocument,
  KnowledgeLayer
} from '../contracts/knowledge.js'
import {
  KNOWLEDGE_INDEX_SCHEMA_VERSION,
  KNOWLEDGE_RETRIEVER_VERSION
} from './knowledge-index-version.js'

export type KnowledgeDocumentState = {
  id: string
  documentHash: string
  sizeBytes: number
  sourceMtimeMs: number
}

export type KnowledgeIndexSyncMetadata = {
  syncedAt: string
  roots: string[]
  skippedCount: number
  candidateFileCount: number
  attemptedFileCount: number
  failedFileCount: number
  truncatedFileCount: number
}

export type KnowledgeIndexDiagnostics = KnowledgeIndexSyncMetadata & {
  documentCount: number
  chunkCount: number
  revision: string
  backend: 'sqlite-fts5'
  retrieverVersion: string
}

type ChunkRow = {
  id: string
  document_id: string
  chunk_index: number
  title: string
  path: string
  relative_path: string
  category: string | null
  tags_json: string
  keywords_json: string
  content: string
  layer: KnowledgeLayer | null
  document_hash: string
  chunk_hash: string
  provenance_id: string
  heading_path_json: string
  article_number: string | null
  char_start: number
  char_end: number
  chunker_version: string
}

type MetaRow = { value: string }

export class KnowledgeSqliteIndex {
  private readonly sqlitePath: string
  private readonly readyPromise: Promise<void>
  private db: BetterSqliteDatabase | null = null
  private ftsTokenizer: 'trigram' | 'unicode61' = 'trigram'

  constructor(rootDir: string) {
    this.sqlitePath = resolve(join(rootDir, 'knowledge.sqlite3'))
    this.readyPromise = this.initialize(rootDir)
  }

  async ready(): Promise<void> {
    await this.readyPromise
  }

  close(): void {
    try {
      this.db?.close()
    } finally {
      this.db = null
    }
  }

  async documentState(documentId: string): Promise<KnowledgeDocumentState | null> {
    const db = await this.database()
    const row = db.prepare(`
      SELECT id, document_hash, size_bytes, source_mtime_ms
      FROM documents
      WHERE id = ?
    `).get(documentId) as {
      id: string
      document_hash: string
      size_bytes: number
      source_mtime_ms: number
    } | undefined
    if (!row) return null
    return {
      id: row.id,
      documentHash: row.document_hash,
      sizeBytes: row.size_bytes,
      sourceMtimeMs: row.source_mtime_ms
    }
  }

  async touchDocument(input: {
    documentId: string
    sizeBytes: number
    sourceMtimeMs: number
    updatedAt: string
  }): Promise<void> {
    const db = await this.database()
    db.prepare(`
      UPDATE documents
      SET size_bytes = @sizeBytes,
          source_mtime_ms = @sourceMtimeMs,
          updated_at = @updatedAt
      WHERE id = @documentId
    `).run(input)
  }

  async upsertDocument(document: KnowledgeDocument, chunks: KnowledgeChunk[]): Promise<void> {
    const db = await this.database()
    const transaction = db.transaction(() => {
      const oldChunkIds = db.prepare('SELECT id FROM chunks WHERE document_id = ?').all(document.id) as Array<{ id: string }>
      const deleteFts = db.prepare('DELETE FROM chunks_fts WHERE chunk_id = ?')
      for (const row of oldChunkIds) deleteFts.run(row.id)
      db.prepare('DELETE FROM chunks WHERE document_id = ?').run(document.id)

      db.prepare(`
        INSERT INTO documents (
          id, title, path, source_root, relative_path, category, tags_json,
          keywords_json, extension, size_bytes, updated_at, layer,
          document_hash, source_mtime_ms, indexed_at
        ) VALUES (
          @id, @title, @path, @sourceRoot, @relativePath, @category, @tagsJson,
          @keywordsJson, @extension, @sizeBytes, @updatedAt, @layer,
          @documentHash, @sourceMtimeMs, @indexedAt
        )
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          path = excluded.path,
          source_root = excluded.source_root,
          relative_path = excluded.relative_path,
          category = excluded.category,
          tags_json = excluded.tags_json,
          keywords_json = excluded.keywords_json,
          extension = excluded.extension,
          size_bytes = excluded.size_bytes,
          updated_at = excluded.updated_at,
          layer = excluded.layer,
          document_hash = excluded.document_hash,
          source_mtime_ms = excluded.source_mtime_ms,
          indexed_at = excluded.indexed_at
      `).run({
        id: document.id,
        title: document.title,
        path: document.path,
        sourceRoot: document.sourceRoot,
        relativePath: document.relativePath,
        category: document.category ?? null,
        tagsJson: JSON.stringify(document.tags ?? []),
        keywordsJson: JSON.stringify(document.keywords ?? []),
        extension: document.extension,
        sizeBytes: document.sizeBytes,
        updatedAt: document.updatedAt,
        layer: document.layer ?? null,
        documentHash: document.documentHash ?? '',
        sourceMtimeMs: document.sourceMtimeMs ?? 0,
        indexedAt: document.indexedAt ?? document.updatedAt
      })

      const insertChunk = db.prepare(`
        INSERT INTO chunks (
          id, document_id, chunk_index, title, path, relative_path, category,
          tags_json, keywords_json, content, layer, document_hash, chunk_hash,
          provenance_id, heading_path_json, article_number, char_start, char_end,
          chunker_version
        ) VALUES (
          @id, @documentId, @chunkIndex, @title, @path, @relativePath, @category,
          @tagsJson, @keywordsJson, @content, @layer, @documentHash, @chunkHash,
          @provenanceId, @headingPathJson, @articleNumber, @charStart, @charEnd,
          @chunkerVersion
        )
      `)
      const insertFts = db.prepare(`
        INSERT INTO chunks_fts (
          chunk_id, title, relative_path, category, keywords,
          heading_path, article_number, content
        ) VALUES (
          @chunkId, @title, @relativePath, @category, @keywords,
          @headingPath, @articleNumber, @content
        )
      `)
      for (const chunk of chunks) {
        insertChunk.run({
          id: chunk.id,
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex ?? 0,
          title: chunk.title,
          path: chunk.path,
          relativePath: chunk.relativePath,
          category: chunk.category ?? null,
          tagsJson: JSON.stringify(chunk.tags ?? []),
          keywordsJson: JSON.stringify(chunk.keywords ?? []),
          content: chunk.content,
          layer: chunk.layer ?? null,
          documentHash: chunk.documentHash ?? '',
          chunkHash: chunk.chunkHash ?? '',
          provenanceId: chunk.provenanceId ?? '',
          headingPathJson: JSON.stringify(chunk.headingPath ?? []),
          articleNumber: chunk.articleNumber ?? null,
          charStart: chunk.charStart ?? 0,
          charEnd: chunk.charEnd ?? chunk.content.length,
          chunkerVersion: chunk.chunkerVersion ?? ''
        })
        insertFts.run({
          chunkId: chunk.id,
          title: chunk.title,
          relativePath: chunk.relativePath,
          category: chunk.category ?? '',
          keywords: (chunk.keywords ?? []).join(' '),
          headingPath: (chunk.headingPath ?? []).join(' > '),
          articleNumber: chunk.articleNumber ?? '',
          content: chunk.content
        })
      }
    })
    transaction()
  }

  async deleteDocument(documentId: string): Promise<boolean> {
    const db = await this.database()
    const oldChunkIds = db.prepare('SELECT id FROM chunks WHERE document_id = ?').all(documentId) as Array<{ id: string }>
    if (oldChunkIds.length === 0) {
      const info = db.prepare('DELETE FROM documents WHERE id = ?').run(documentId)
      return info.changes > 0
    }
    const transaction = db.transaction(() => {
      const deleteFts = db.prepare('DELETE FROM chunks_fts WHERE chunk_id = ?')
      for (const row of oldChunkIds) deleteFts.run(row.id)
      db.prepare('DELETE FROM documents WHERE id = ?').run(documentId)
    })
    transaction()
    return true
  }

  async deleteDocumentsNotIn(documentIds: string[]): Promise<number> {
    const db = await this.database()
    const keep = new Set(documentIds)
    const rows = db.prepare('SELECT id FROM documents').all() as Array<{ id: string }>
    let deleted = 0
    for (const row of rows) {
      if (keep.has(row.id)) continue
      if (await this.deleteDocument(row.id)) deleted += 1
    }
    return deleted
  }

  async searchCandidates(input: {
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

  async lookupChunks(chunkIds: string[]): Promise<KnowledgeChunk[]> {
    const db = await this.database()
    const ids = [...new Set(chunkIds.filter(Boolean))].slice(0, 100)
    if (ids.length === 0) return []
    const placeholders = ids.map(() => '?').join(',')
    const rows = db.prepare(`SELECT * FROM chunks WHERE id IN (${placeholders})`).all(...ids) as ChunkRow[]
    const byId = new Map(rows.map((row) => [row.id, chunkFromRow(row)]))
    return ids.map((id) => byId.get(id)).filter((chunk): chunk is KnowledgeChunk => Boolean(chunk))
  }

  async setSyncMetadata(metadata: KnowledgeIndexSyncMetadata): Promise<void> {
    const db = await this.database()
    const statement = db.prepare(`
      INSERT INTO knowledge_meta(key, value)
      VALUES(@key, @value)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `)
    const transaction = db.transaction(() => {
      for (const [key, value] of Object.entries(metadata)) {
        statement.run({ key, value: JSON.stringify(value) })
      }
      statement.run({ key: 'schemaVersion', value: JSON.stringify(KNOWLEDGE_INDEX_SCHEMA_VERSION) })
      statement.run({ key: 'retrieverVersion', value: JSON.stringify(KNOWLEDGE_RETRIEVER_VERSION) })
    })
    transaction()
  }

  async recomputeRevision(): Promise<string> {
    const db = await this.database()
    const rows = db.prepare(`
      SELECT relative_path, document_hash
      FROM documents
      ORDER BY relative_path ASC
    `).all() as Array<{ relative_path: string; document_hash: string }>
    const hash = createHash('sha256')
    for (const row of rows) hash.update(`${row.relative_path}\u0000${row.document_hash}\u0000`)
    const revision = hash.digest('hex')
    this.setMeta(db, 'revision', revision)
    return revision
  }

  async revision(): Promise<string> {
    const db = await this.database()
    return this.getMeta<string>(db, 'revision', '')
  }

  async diagnostics(): Promise<KnowledgeIndexDiagnostics> {
    const db = await this.database()
    const documentCount = (db.prepare('SELECT count(*) AS count FROM documents').get() as { count: number }).count
    const chunkCount = (db.prepare('SELECT count(*) AS count FROM chunks').get() as { count: number }).count
    return {
      syncedAt: this.getMeta<string>(db, 'syncedAt', ''),
      roots: this.getMeta<string[]>(db, 'roots', []),
      skippedCount: this.getMeta<number>(db, 'skippedCount', 0),
      candidateFileCount: this.getMeta<number>(db, 'candidateFileCount', documentCount),
      attemptedFileCount: this.getMeta<number>(db, 'attemptedFileCount', documentCount),
      failedFileCount: this.getMeta<number>(db, 'failedFileCount', 0),
      truncatedFileCount: this.getMeta<number>(db, 'truncatedFileCount', 0),
      documentCount,
      chunkCount,
      revision: this.getMeta<string>(db, 'revision', ''),
      backend: 'sqlite-fts5',
      retrieverVersion: KNOWLEDGE_RETRIEVER_VERSION
    }
  }

  private async initialize(rootDir: string): Promise<void> {
    await mkdir(rootDir, { recursive: true })
    const sqlite = await import('better-sqlite3')
    const Database = sqlite.default
    this.db = new Database(this.sqlitePath)
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('foreign_keys = ON')
    this.db.pragma('synchronous = NORMAL')
    this.db.pragma('temp_store = MEMORY')
    this.migrate(this.db)
  }

  private migrate(db: BetterSqliteDatabase): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        source_root TEXT NOT NULL,
        relative_path TEXT NOT NULL,
        category TEXT,
        tags_json TEXT NOT NULL DEFAULT '[]',
        keywords_json TEXT NOT NULL DEFAULT '[]',
        extension TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        updated_at TEXT NOT NULL,
        layer TEXT,
        document_hash TEXT NOT NULL,
        source_mtime_ms REAL NOT NULL,
        indexed_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS documents_relative_path_idx ON documents(relative_path);
      CREATE INDEX IF NOT EXISTS documents_hash_idx ON documents(document_hash);

      CREATE TABLE IF NOT EXISTS chunks (
        rowid INTEGER PRIMARY KEY,
        id TEXT NOT NULL UNIQUE,
        document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        chunk_index INTEGER NOT NULL,
        title TEXT NOT NULL,
        path TEXT NOT NULL,
        relative_path TEXT NOT NULL,
        category TEXT,
        tags_json TEXT NOT NULL DEFAULT '[]',
        keywords_json TEXT NOT NULL DEFAULT '[]',
        content TEXT NOT NULL,
        layer TEXT,
        document_hash TEXT NOT NULL,
        chunk_hash TEXT NOT NULL,
        provenance_id TEXT NOT NULL,
        heading_path_json TEXT NOT NULL DEFAULT '[]',
        article_number TEXT,
        char_start INTEGER NOT NULL,
        char_end INTEGER NOT NULL,
        chunker_version TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS chunks_document_idx ON chunks(document_id, chunk_index);
      CREATE INDEX IF NOT EXISTS chunks_relative_path_idx ON chunks(relative_path);
      CREATE INDEX IF NOT EXISTS chunks_layer_idx ON chunks(layer);
      CREATE INDEX IF NOT EXISTS chunks_provenance_idx ON chunks(provenance_id);
    `)

    const existingFts = db.prepare(`
      SELECT sql FROM sqlite_master
      WHERE type = 'table' AND name = 'chunks_fts'
    `).get() as { sql?: string } | undefined
    if (existingFts) {
      this.ftsTokenizer = /unicode61/i.test(existingFts.sql ?? '') ? 'unicode61' : 'trigram'
    } else {
      try {
        db.exec(`
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  chunk_id UNINDEXED,
  title,
  relative_path,
  category,
  keywords,
  heading_path,
  article_number,
  content,
  tokenize='trigram'
);
        `)
        this.ftsTokenizer = 'trigram'
      } catch {
        db.exec(`DROP TABLE IF EXISTS chunks_fts;`)
        db.exec(`
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  chunk_id UNINDEXED,
  title,
  relative_path,
  category,
  keywords,
  heading_path,
  article_number,
  content,
  tokenize='unicode61'
);
        `)
        this.ftsTokenizer = 'unicode61'
      }
    }
    this.setMeta(db, 'schemaVersion', KNOWLEDGE_INDEX_SCHEMA_VERSION)
    this.setMeta(db, 'retrieverVersion', KNOWLEDGE_RETRIEVER_VERSION)
    this.setMeta(db, 'ftsTokenizer', this.ftsTokenizer)
  }

  private async database(): Promise<BetterSqliteDatabase> {
    await this.ready()
    if (!this.db) throw new Error('knowledge SQLite index is unavailable')
    return this.db
  }

  private setMeta(db: BetterSqliteDatabase, key: string, value: unknown): void {
    db.prepare(`
      INSERT INTO knowledge_meta(key, value)
      VALUES(?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, JSON.stringify(value))
  }

  private getMeta<T>(db: BetterSqliteDatabase, key: string, fallback: T): T {
    const row = db.prepare('SELECT value FROM knowledge_meta WHERE key = ?').get(key) as MetaRow | undefined
    if (!row) return fallback
    try {
      return JSON.parse(row.value) as T
    } catch {
      return fallback
    }
  }
}

function chunkFromRow(row: ChunkRow): KnowledgeChunk {
  return {
    id: row.id,
    documentId: row.document_id,
    title: row.title,
    path: row.path,
    relativePath: row.relative_path,
    ...(row.category ? { category: row.category } : {}),
    tags: parseStringArray(row.tags_json),
    keywords: parseStringArray(row.keywords_json),
    content: row.content,
    ...(row.layer ? { layer: row.layer } : {}),
    chunkIndex: row.chunk_index,
    documentHash: row.document_hash,
    chunkHash: row.chunk_hash,
    provenanceId: row.provenance_id,
    headingPath: parseStringArray(row.heading_path_json),
    ...(row.article_number ? { articleNumber: row.article_number } : {}),
    charStart: row.char_start,
    charEnd: row.char_end,
    chunkerVersion: row.chunker_version
  }
}

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function buildFilters(layers?: KnowledgeLayer[], pathPrefix?: string): {
  sql: string
  params: Record<string, unknown>
} {
  const where: string[] = []
  const params: Record<string, unknown> = {}
  const normalizedLayers = [...new Set((layers ?? []).filter(Boolean))]
  if (normalizedLayers.length > 0) {
    const placeholders = normalizedLayers.map((_, index) => `@layer${index}`)
    where.push(`(c.layer IS NULL OR c.layer IN (${placeholders.join(', ')}))`)
    normalizedLayers.forEach((layer, index) => { params[`layer${index}`] = layer })
  }
  const prefix = pathPrefix?.trim().replaceAll('\\', '/').replace(/^\/+|\/+$/g, '')
  if (prefix) {
    where.push(`(c.relative_path = @pathPrefix OR c.relative_path LIKE @pathPrefixLike ESCAPE '\\')`)
    params.pathPrefix = prefix
    params.pathPrefixLike = `${escapeLike(prefix)}/%`
  }
  return {
    sql: where.length ? `AND ${where.join(' AND ')}` : '',
    params
  }
}

function buildFtsQuery(query: string, tokenizer: 'trigram' | 'unicode61'): string {
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

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`)
}
