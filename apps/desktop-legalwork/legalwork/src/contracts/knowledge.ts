import { z } from 'zod'

/**
 * Pyramid knowledge layers L1-L5.
 * Each layer represents an abstraction level with different stability and cognitive purpose.
 */
export const KnowledgeLayer = z.enum([
  'principle',       // L1 — 不变的原则 (SOLID, KISS, YAGNI)
  'architecture',    // L2 — 架构决策与系统设计 (ADR)
  'standard',        // L3 — 编码规范与标准 (ESLint rules, style guides)
  'implementation',  // L4 — 实现参考与模板 (code samples, SDK docs)
  'experience'       // L5 — 经验复盘与运维日志 (postmortems, runbooks)
])
export type KnowledgeLayer = z.infer<typeof KnowledgeLayer>

/**
 * Edge types for cross-document graph relationships.
 */
export const KnowledgeEdgeRelation = z.enum([
  'governs',       // L1→L2   原则约束架构
  'defines',       // L1→L2/L3 概念定义边界
  'constrains',    // L2→L3   架构约束规范
  'implements',    // L2/L3→L4 规范/架构的具体实现
  'validates',     // L4→L5   实现产生验证经验
  'feedback',      // L5→L3/L4 经验反哺改进
  'cross_ref',     // 任意     同层或跨层的横向引用
])
export type KnowledgeEdgeRelation = z.infer<typeof KnowledgeEdgeRelation>

export const KnowledgeEdge = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  relation: KnowledgeEdgeRelation,
  label: z.string().optional(),
  weight: z.number().min(0).max(1).default(0.5)
}).strict()
export type KnowledgeEdge = z.infer<typeof KnowledgeEdge>

export const KnowledgeDocument = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  path: z.string().min(1),
  sourceRoot: z.string().min(1),
  relativePath: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  extension: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  updatedAt: z.string(),
  /** Pyramid knowledge layer (L1-L5). Undefined for legacy documents. */
  layer: KnowledgeLayer.optional()
}).strict()
export type KnowledgeDocument = z.infer<typeof KnowledgeDocument>

export const KnowledgeChunk = z.object({
  id: z.string().min(1),
  documentId: z.string().min(1),
  title: z.string().min(1),
  path: z.string().min(1),
  relativePath: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  content: z.string().min(1),
  /** Pyramid knowledge layer inherited from parent document. */
  layer: KnowledgeLayer.optional()
}).strict()
export type KnowledgeChunk = z.infer<typeof KnowledgeChunk>

export const KnowledgeSearchHit = z.object({
  documentId: z.string().min(1),
  chunkId: z.string().min(1),
  title: z.string().min(1),
  path: z.string().min(1),
  relativePath: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  score: z.number().nonnegative(),
  rankReason: z.string().optional(),
  snippet: z.string(),
  content: z.string().optional(),
  /** Pyramid knowledge layer from the parent document. */
  layer: KnowledgeLayer.optional()
}).strict()
export type KnowledgeSearchHit = z.infer<typeof KnowledgeSearchHit>

export const KnowledgeSyncRequest = z.object({
  roots: z.array(z.string().min(1)).max(20).optional(),
  maxFiles: z.number().int().positive().max(5000).optional()
}).strict()
export type KnowledgeSyncRequest = z.infer<typeof KnowledgeSyncRequest>

export const KnowledgeSyncResult = z.object({
  syncedAt: z.string(),
  roots: z.array(z.string()),
  documentCount: z.number().int().nonnegative(),
  chunkCount: z.number().int().nonnegative(),
  skippedCount: z.number().int().nonnegative(),
  candidateFileCount: z.number().int().nonnegative(),
  attemptedFileCount: z.number().int().nonnegative(),
  failedFileCount: z.number().int().nonnegative(),
  truncatedFileCount: z.number().int().nonnegative(),
  truncated: z.boolean()
}).strict()
export type KnowledgeSyncResult = z.infer<typeof KnowledgeSyncResult>

export const KnowledgeDiagnostics = z.object({
  enabled: z.boolean(),
  rootDir: z.string(),
  sourceRoots: z.array(z.string()),
  documentCount: z.number().int().nonnegative(),
  chunkCount: z.number().int().nonnegative(),
  candidateFileCount: z.number().int().nonnegative(),
  attemptedFileCount: z.number().int().nonnegative(),
  failedFileCount: z.number().int().nonnegative(),
  truncatedFileCount: z.number().int().nonnegative(),
  truncated: z.boolean(),
  syncedAt: z.string().optional(),
  lastSelectedIds: z.array(z.string()).default([])
}).strict()
export type KnowledgeDiagnostics = z.infer<typeof KnowledgeDiagnostics>

/** A node in the knowledge file tree. */
export type KnowledgeTreeNode = {
  name: string
  path: string
  kind: 'file' | 'folder'
  extension?: string
  sizeBytes?: number
  updatedAt?: string
  children?: KnowledgeTreeNode[]
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const KnowledgeTreeNode: z.ZodType<KnowledgeTreeNode> = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  kind: z.enum(['file', 'folder']),
  extension: z.string().optional(),
  sizeBytes: z.number().int().nonnegative().optional(),
  updatedAt: z.string().optional(),
  children: z.array(z.lazy(() => KnowledgeTreeNode)).optional()
}).strict()

export const KnowledgeMoveRequest = z.object({
  sourcePath: z.string().min(1),
  destPath: z.string().min(1)
}).strict()
export type KnowledgeMoveRequest = z.infer<typeof KnowledgeMoveRequest>

export const KnowledgeCreateFolderRequest = z.object({
  path: z.string().min(1)
}).strict()
export type KnowledgeCreateFolderRequest = z.infer<typeof KnowledgeCreateFolderRequest>

export const KnowledgeFileContent = z.object({
  path: z.string().min(1),
  content: z.string(),
  encoding: z.enum(['utf8', 'base64']).default('utf8')
}).strict()
export type KnowledgeFileContent = z.infer<typeof KnowledgeFileContent>

export const KnowledgeClassifyRequest = z.object({
  paths: z.array(z.string().min(1)).max(500).optional(),
  targetRoot: z.string().optional(),
  dryRun: z.boolean().default(false)
}).strict()
export type KnowledgeClassifyRequest = z.infer<typeof KnowledgeClassifyRequest>

export const KnowledgeClassifyMove = z.object({
  sourcePath: z.string().min(1),
  destPath: z.string().min(1),
  category: z.string().min(1),
  reason: z.string().min(1)
}).strict()
export type KnowledgeClassifyMove = z.infer<typeof KnowledgeClassifyMove>

export const KnowledgeClassifyResult = z.object({
  moved: z.array(KnowledgeClassifyMove),
  skipped: z.array(z.object({
    path: z.string().min(1),
    reason: z.string().min(1)
  })),
  dryRun: z.boolean()
}).strict()
export type KnowledgeClassifyResult = z.infer<typeof KnowledgeClassifyResult>
