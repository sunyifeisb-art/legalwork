/**
 * Shared types for user-created legal document templates
 * and AI-powered template learning & generation.
 */

import { z } from 'zod'

/** Template field definition (same as LegalTemplateField in legal-templates.ts) */
export interface UserTemplateField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'array'
  placeholder?: string
  options?: string[]
  required?: boolean
}

/** A user-created / learned template stored on disk */
export interface UserTemplate {
  /** Unique id (uuid or timestamp-based) */
  id: string
  /** User-assigned name */
  name: string
  /** Optional description */
  description: string
  /** Category: always 'custom' */
  category: 'custom'
  /** Template content (Markdown with {{fieldName}} placeholders) */
  content: string
  /** Extracted field definitions */
  fields: UserTemplateField[]
  /** Legal basis if known */
  legalBasis?: string[]
  /** Path to the original uploaded file (if any) */
  sourceFile?: string
  /** ISO timestamp of creation */
  createdAt: string
  /** ISO timestamp of last modification */
  updatedAt: string
}

/** Request to AI-learn from an uploaded document */
export interface TemplateLearningRequest {
  /** Raw text content of the uploaded file */
  fileContent: string
  /** Original file name (for context) */
  fileName: string
  /** User-provided template name (optional, AI can suggest) */
  suggestedName?: string
}

/** Result of AI template learning */
export type TemplateLearningResult =
  | {
      ok: true
      /** Suggested template name */
      name: string
      /** Brief description */
      description: string
      /** Generated template content with {{field}} placeholders */
      content: string
      /** Extracted fields */
      fields: UserTemplateField[]
      /** Legal basis if detected */
      legalBasis?: string[]
    }
  | {
      ok: false
      message: string
    }

/** Request to generate a document from a template + user materials */
export interface TemplateGenerateWithMaterialsRequest {
  /** The selected template */
  template: {
    id?: string
    name: string
    description: string
    content: string
    fields: UserTemplateField[]
    legalBasis?: string[]
  }
  /** Field values already filled by user */
  fieldValues: Record<string, string>
  /** New material files uploaded for this generation (raw text) */
  materials?: Array<{
    fileName: string
    content: string
  }>
  /** Free-form instructions from user */
  instructions?: string
}

/** Result of template-based generation */
export type TemplateGenerateWithMaterialsResult =
  | {
      ok: true
      content: string
      model?: string
    }
  | {
      ok: false
      message: string
    }

// ─── Zod schemas for IPC validation ───────────────────────────────────────

export const userTemplateFieldSchema = z.object({
  id: z.string().min(1).max(200),
  label: z.string().min(1).max(200),
  type: z.enum(['text', 'textarea', 'date', 'select', 'array']),
  placeholder: z.string().max(1000).optional(),
  options: z.array(z.string().max(200)).max(100).optional(),
  required: z.boolean().optional()
})

export const userTemplateSchema = z.object({
  id: z.string().min(1).max(200),
  name: z.string().min(1).max(200),
  description: z.string().max(2000),
  category: z.literal('custom'),
  content: z.string().max(50_000),
  fields: z.array(userTemplateFieldSchema).max(200),
  legalBasis: z.array(z.string().max(1000)).max(50).optional(),
  sourceFile: z.string().max(1000).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const templateLearningRequestSchema = z.object({
  fileContent: z.string().min(1).max(100_000),
  fileName: z.string().min(1).max(500),
  suggestedName: z.string().max(200).optional()
})

export const templateGenerateWithMaterialsRequestSchema = z.object({
  template: z.object({
    id: z.string().max(200).optional(),
    name: z.string().min(1).max(200),
    description: z.string().max(2000),
    content: z.string().min(1).max(50_000),
    fields: z.array(userTemplateFieldSchema).max(200),
    legalBasis: z.array(z.string().max(1000)).max(50).optional()
  }),
  fieldValues: z.record(z.string(), z.string().max(50_000)),
  materials: z
    .array(
      z.object({
        fileName: z.string().max(500),
        content: z.string().max(100_000)
      })
    )
    .max(20)
    .optional(),
  instructions: z.string().max(5000).optional()
})
