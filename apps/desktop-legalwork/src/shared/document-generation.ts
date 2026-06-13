/**
 * Shared types for AI-powered legal document generation.
 */

import { z } from 'zod'

/** Request to generate a legal document via AI. */
export interface DocumentGenerationRequest {
  /** Template name (e.g. "民事起诉状") */
  templateName: string
  /** Template description / context */
  templateDescription: string
  /** Template content or structure (Markdown with {{field}} placeholders) */
  templateContent: string
  /** Field definitions from the template */
  fields: Array<{
    id: string
    label: string
    type: string
    value: string
    required?: boolean
  }>
  /** Legal basis / references if available */
  legalBasis?: string[]
}

/** Result of an AI document generation call. */
export type DocumentGenerationResult = {
  ok: true
  content: string
  model?: string
} | {
  ok: false
  message: string
}

/** Zod schema for IPC payload validation. */
export const documentGenerationPayloadSchema = z.object({
  templateName: z.string().min(1),
  templateDescription: z.string(),
  templateContent: z.string(),
  fields: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      value: z.string(),
      required: z.boolean().optional()
    })
  ),
  legalBasis: z.array(z.string()).optional()
})
