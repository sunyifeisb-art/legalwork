/**
 * Shared types for document generation history records.
 */

import { z } from 'zod'

/** A single generation history record */
export interface DocumentHistoryRecord {
  /** Unique id */
  id: string
  /** Name of the template used */
  templateName: string
  /** Template category */
  templateCategory: string
  /** Whether it was a built-in or custom template */
  templateSource: 'builtin' | 'custom'
  /** Field values at generation time (keys only, values truncated to 200 chars) */
  fieldValues: Record<string, string>
  /** Reference material file names (not full content, just metadata) */
  materialFileNames: string[]
  /** User instructions if any */
  instructions: string
  /** Full generated document content */
  generatedContent: string
  /** Model used if known */
  model?: string
  /** ISO timestamp */
  createdAt: string
}

/** Slim version for list display (no content) */
export interface DocumentHistorySummary {
  id: string
  templateName: string
  templateCategory: string
  templateSource: 'builtin' | 'custom'
  materialCount: number
  hasInstructions: boolean
  createdAt: string
}

/** Result type for history operations */
export type HistoryActionResult =
  | { ok: true }
  | { ok: false; message: string }

// ─── Zod schemas ──────────────────────────────────────────────────────────

export const documentHistoryRecordSchema = z.object({
  id: z.string().min(1).max(200),
  templateName: z.string().min(1).max(200),
  templateCategory: z.string().max(50),
  templateSource: z.enum(['builtin', 'custom']),
  fieldValues: z.record(z.string(), z.string().max(50_000)),
  materialFileNames: z.array(z.string().max(500)).max(50),
  instructions: z.string().max(10_000),
  generatedContent: z.string().min(1).max(200_000),
  model: z.string().max(200).optional(),
  createdAt: z.string()
})
