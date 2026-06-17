/**
 * Template Store Service
 *
 * Persists user-created templates to disk as a local JSON store.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import type { UserTemplate } from '../../shared/user-templates'

/** Directory where user templates are stored */
export const TEMPLATES_DIR_NAME = 'user-templates'
/** Filename for the templates index */
const TEMPLATES_INDEX_FILE = 'templates.json'

let templatesDir = ''
let templatesCache: UserTemplate[] | null = null

/** Set the base app data directory (called once at startup) */
export function setTemplatesBaseDir(baseDir: string): void {
  templatesDir = join(baseDir, TEMPLATES_DIR_NAME)
  templatesCache = null
}

/** Ensure the templates directory exists */
async function ensureDir(): Promise<string> {
  if (!templatesDir) {
    throw new Error('Templates base directory not set. Call setTemplatesBaseDir() first.')
  }
  await mkdir(templatesDir, { recursive: true })
  return templatesDir
}

/** Path to the templates index file */
function indexFilePath(): string {
  return join(templatesDir, TEMPLATES_INDEX_FILE)
}

/** Load all user templates from disk */
export async function loadTemplates(): Promise<UserTemplate[]> {
  if (templatesCache) return templatesCache

  try {
    const filePath = indexFilePath()
    const data = await readFile(filePath, 'utf-8')
    const parsed = JSON.parse(data)
    templatesCache = Array.isArray(parsed) ? parsed : []
    return templatesCache!
  } catch {
    // File doesn't exist or is invalid - return empty
    templatesCache = []
    return templatesCache
  }
}

/** Save all user templates to disk */
async function persistTemplates(templates: UserTemplate[]): Promise<void> {
  const dir = await ensureDir()
  const filePath = join(dir, TEMPLATES_INDEX_FILE)
  await writeFile(filePath, JSON.stringify(templates, null, 2), 'utf-8')
  templatesCache = templates
}

/** List all user templates */
export async function listTemplates(): Promise<UserTemplate[]> {
  return loadTemplates()
}

/** Get a single template by id */
export async function getTemplate(id: string): Promise<UserTemplate | null> {
  const templates = await loadTemplates()
  return templates.find((t) => t.id === id) ?? null
}

/** Save a template (create or update) */
export async function saveTemplate(
  template: UserTemplate
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const templates = await loadTemplates()
    const now = new Date().toISOString()
    const existingIdx = templates.findIndex((t) => t.id === template.id)

    if (existingIdx >= 0) {
      // Update existing
      templates[existingIdx] = {
        ...template,
        updatedAt: now
      }
    } else {
      // Create new
      templates.push({
        ...template,
        createdAt: template.createdAt || now,
        updatedAt: now
      })
    }

    await persistTemplates(templates)
    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, message }
  }
}

/** Delete a template by id */
export async function deleteTemplate(
  id: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const templates = await loadTemplates()
    const filtered = templates.filter((t) => t.id !== id)
    if (filtered.length === templates.length) {
      return { ok: false, message: '模板未找到。' }
    }
    await persistTemplates(filtered)
    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, message }
  }
}
