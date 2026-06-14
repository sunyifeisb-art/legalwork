/**
 * Document History Service
 *
 * Persists document generation history records to disk.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import type {
  DocumentHistoryRecord,
  DocumentHistorySummary,
  HistoryActionResult
} from '../../shared/document-history'

const HISTORY_DIR_NAME = 'document-history'
const HISTORY_FILE = 'history.json'

let baseDir = ''
let cache: DocumentHistoryRecord[] | null = null

export function setHistoryBaseDir(dir: string): void {
  baseDir = join(dir, HISTORY_DIR_NAME)
  cache = null
}

async function ensureDir(): Promise<string> {
  if (!baseDir) throw new Error('History base dir not set.')
  await mkdir(baseDir, { recursive: true })
  return baseDir
}

function filePath(): string {
  return join(baseDir, HISTORY_FILE)
}

async function loadAll(): Promise<DocumentHistoryRecord[]> {
  if (cache) return cache
  try {
    const data = await readFile(filePath(), 'utf-8')
    const parsed = JSON.parse(data)
    cache = Array.isArray(parsed) ? parsed : []
  } catch {
    cache = []
  }
  return cache!
}

async function persist(records: DocumentHistoryRecord[]): Promise<void> {
  const dir = await ensureDir()
  await writeFile(join(dir, HISTORY_FILE), JSON.stringify(records, null, 2), 'utf-8')
  cache = records
}

/** List all history records (summary only, no content) */
export async function listHistory(): Promise<DocumentHistorySummary[]> {
  const records = await loadAll()
  return records.map((r) => ({
    id: r.id,
    templateName: r.templateName,
    templateCategory: r.templateCategory,
    templateSource: r.templateSource,
    materialCount: r.materialFileNames.length,
    hasInstructions: r.instructions.length > 0,
    createdAt: r.createdAt
  }))
}

/** Get a single full record by id */
export async function getHistoryRecord(
  id: string
): Promise<DocumentHistoryRecord | null> {
  const records = await loadAll()
  return records.find((r) => r.id === id) ?? null
}

/** Save a new history record */
export async function saveHistoryRecord(
  record: DocumentHistoryRecord
): Promise<HistoryActionResult> {
  try {
    const records = await loadAll()
    // Keep max 500 records, remove oldest
    const updated = [record, ...records].slice(0, 500)
    await persist(updated)
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) }
  }
}

/** Delete a history record by id */
export async function deleteHistoryRecord(id: string): Promise<HistoryActionResult> {
  try {
    const records = await loadAll()
    const filtered = records.filter((r) => r.id !== id)
    if (filtered.length === records.length) {
      return { ok: false, message: '记录未找到。' }
    }
    await persist(filtered)
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) }
  }
}

/** Clear all history */
export async function clearHistory(): Promise<HistoryActionResult> {
  try {
    await persist([])
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) }
  }
}
