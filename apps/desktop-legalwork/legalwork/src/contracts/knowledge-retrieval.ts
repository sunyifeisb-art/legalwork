import { z } from 'zod'
import { KnowledgeLayer } from './knowledge.js'
export type { KnowledgeLayer }

export const KnowledgeMeta = z.object({
  tags: z.array(z.string().min(1)).default([]),
  category: z.string().default(''),
  expiresAt: z.string().optional(),
  deprecated: z.boolean().default(false),
  source: z.string().default(''),
  author: z.string().default(''),
  confidence: z.enum(['high', 'medium', 'low', 'deprecated']).default('medium'),
  reviewStatus: z.enum(['draft', 'reviewed', 'approved', 'superseded']).default('draft'),
  version: z.string().default('1.0.0'),
  layer: KnowledgeLayer.optional()
}).strict()
export type KnowledgeMeta = z.infer<typeof KnowledgeMeta>

export const DEFAULT_KNOWLEDGE_META: KnowledgeMeta = {
  tags: [],
  category: '',
  deprecated: false,
  source: '',
  author: '',
  confidence: 'medium',
  reviewStatus: 'draft',
  version: '1.0.0'
}

export const KnowledgeContextRecord = z.object({
  path: z.string().min(1),
  title: z.string().min(1),
  relevanceScore: z.number().min(0).max(1),
  excerpt: z.string(),
  content: z.string().optional(),
  citation: z.string().default(''),
  citationNumber: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
  sourceKind: z.enum(['local', 'web']).default('local'),
  gbt7714Citation: z.string().optional(),
  authors: z.array(z.string()).default([]),
  publicationYear: z.number().int().optional(),
  publicationName: z.string().optional(),
  doi: z.string().optional(),
  layer: KnowledgeLayer.optional(),
  /** Local-index provenance. Web/external sources intentionally do not fake these IDs. */
  documentId: z.string().min(1).optional(),
  chunkId: z.string().min(1).optional(),
  provenanceId: z.string().min(1).optional(),
  documentHash: z.string().min(1).optional(),
  chunkHash: z.string().min(1).optional(),
  headingPath: z.array(z.string()).optional(),
  articleNumber: z.string().optional(),
  charStart: z.number().int().nonnegative().optional(),
  charEnd: z.number().int().nonnegative().optional()
}).strict()
export type KnowledgeContextRecord = z.infer<typeof KnowledgeContextRecord>

export const KnowledgeRetrievalResult = z.object({
  contextText: z.string(),
  sources: z.array(KnowledgeContextRecord),
  consultedExternal: z.boolean().default(false),
  latencyMs: z.number().int().nonnegative().default(0),
  bibliography: z.string().default(''),
  citations: z.array(z.string()).default([]),
  cacheHit: z.boolean().default(false),
  revision: z.string().default(''),
  retrieverVersion: z.string().default('')
}).strict()
export type KnowledgeRetrievalResult = z.infer<typeof KnowledgeRetrievalResult>

export const LegalSearchResult = z.object({
  query: z.string(),
  title: z.string(),
  url: z.string().optional(),
  snippet: z.string(),
  content: z.string().optional(),
  sourceType: z.enum(['regulation', 'case', 'ruling', 'news', 'official_qa', 'other']).default('other'),
  authority: z.enum(['official', 'judicial', 'academic', 'media', 'other']).default('other'),
  publishedAt: z.string().optional()
}).strict()
export type LegalSearchResult = z.infer<typeof LegalSearchResult>
