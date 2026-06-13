import { z } from 'zod'

/**
 * Knowledge metadata: attached to each document in the managed knowledge base.
 * Supports tagging, expiry tracking, source attribution, and category organization.
 */
export const KnowledgeMeta = z.object({
  /** Auto-generated or user-assigned tags (e.g. "合同", "民法典", "2023", "废止") */
  tags: z.array(z.string().min(1)).default([]),
  /** Category path for hierarchical organization (e.g. "法规/民事/合同") */
  category: z.string().default(''),
  /** Expiry date ISO string - after this date the document is considered stale */
  expiresAt: z.string().optional(),
  /** Whether this document is explicitly marked as deprecated/outdated */
  deprecated: z.boolean().default(false),
  /** Original source description (e.g. "最高人民法院第X号指导案例", "团队2023年案例研讨") */
  source: z.string().default(''),
  /** Author or contributing team member */
  author: z.string().default(''),
  /** Confidence level for the document content */
  confidence: z.enum(['high', 'medium', 'low', 'deprecated']).default('medium'),
  /** Review/approval status */
  reviewStatus: z.enum(['draft', 'reviewed', 'approved', 'superseded']).default('draft'),
  /** Version string for tracking updates */
  version: z.string().default('1.0.0')
}).strict()
export type KnowledgeMeta = z.infer<typeof KnowledgeMeta>

/** Default metadata applied when none exists. */
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

/**
 * A knowledge context record returned by the auto-retrieval pipeline.
 * Tracks which sources were used so outputs can cite them.
 */
export const KnowledgeContextRecord = z.object({
  /** The file path relative to knowledge root */
  path: z.string().min(1),
  /** Display title */
  title: z.string().min(1),
  /** Relevance score from the retrieval */
  relevanceScore: z.number().min(0).max(1),
  /** Excerpt of the matched content */
  excerpt: z.string(),
  /** Full content if available */
  content: z.string().optional(),
  /** Citation for output (e.g. "《民法典》第584条" or "团队2024年案例研讨-王某合同纠纷") */
  citation: z.string().default(''),
  /** Tags from metadata */
  tags: z.array(z.string()).default([]),
  /** Whether this is from external web search vs local KB */
  sourceKind: z.enum(['local', 'web']).default('local')
}).strict()
export type KnowledgeContextRecord = z.infer<typeof KnowledgeContextRecord>

/** Result of auto-retrieval: context to inject + sources to cite. */
export const KnowledgeRetrievalResult = z.object({
  /** Context text formatted for model injection */
  contextText: z.string(),
  /** Individual source records for citation tracking */
  sources: z.array(KnowledgeContextRecord),
  /** Whether external web search was also consulted */
  consultedExternal: z.boolean().default(false),
  /** Retrieval latency in ms */
  latencyMs: z.number().int().nonnegative().default(0)
}).strict()
export type KnowledgeRetrievalResult = z.infer<typeof KnowledgeRetrievalResult>

/** External search result for legal-specific queries. */
export const LegalSearchResult = z.object({
  query: z.string(),
  title: z.string(),
  url: z.string().optional(),
  snippet: z.string(),
  content: z.string().optional(),
  /** Source type (e.g. "法规", "案例", "裁判规则", "行业动态") */
  sourceType: z.enum(['regulation', 'case', 'ruling', 'news', 'official_qa', 'other']).default('other'),
  /** Authority level for verification */
  authority: z.enum(['official', 'judicial', 'academic', 'media', 'other']).default('other'),
  publishedAt: z.string().optional()
}).strict()
export type LegalSearchResult = z.infer<typeof LegalSearchResult>
