/** Shared types for Knowledge Base components */

export type KnowledgeTreeNode = {
  name: string
  path: string
  kind: 'file' | 'folder'
  extension?: string
  sizeBytes?: number
  updatedAt?: string
  children?: KnowledgeTreeNode[]
}
