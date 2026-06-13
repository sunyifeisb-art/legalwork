import { z } from 'zod'

export const KnowledgeDocument = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  path: z.string().min(1),
  sourceRoot: z.string().min(1),
  relativePath: z.string().min(1),
  extension: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  updatedAt: z.string()
}).strict()
export type KnowledgeDocument = z.infer<typeof KnowledgeDocument>

export const KnowledgeChunk = z.object({
  id: z.string().min(1),
  documentId: z.string().min(1),
  title: z.string().min(1),
  path: z.string().min(1),
  relativePath: z.string().min(1),
  content: z.string().min(1)
}).strict()
export type KnowledgeChunk = z.infer<typeof KnowledgeChunk>

export const KnowledgeSearchHit = z.object({
  documentId: z.string().min(1),
  chunkId: z.string().min(1),
  title: z.string().min(1),
  path: z.string().min(1),
  relativePath: z.string().min(1),
  score: z.number().nonnegative(),
  snippet: z.string(),
  content: z.string().optional()
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
  skippedCount: z.number().int().nonnegative()
}).strict()
export type KnowledgeSyncResult = z.infer<typeof KnowledgeSyncResult>

export const KnowledgeDiagnostics = z.object({
  enabled: z.boolean(),
  rootDir: z.string(),
  sourceRoots: z.array(z.string()),
  documentCount: z.number().int().nonnegative(),
  chunkCount: z.number().int().nonnegative(),
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
