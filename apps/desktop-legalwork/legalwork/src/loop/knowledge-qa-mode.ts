import type { ModelToolSpec } from '../ports/model-client.js'

const FILE_KNOWLEDGE_THREAD_PREFIX = '知识库：'
const GLOBAL_KNOWLEDGE_THREAD_PREFIX = '知识库全局对话 · '

export function isKnowledgeQaThreadTitle(title: string | undefined): boolean {
  const value = title?.trim() ?? ''
  return value.startsWith(FILE_KNOWLEDGE_THREAD_PREFIX) ||
    value.startsWith(GLOBAL_KNOWLEDGE_THREAD_PREFIX)
}

/**
 * Knowledge-base UI threads already contain a renderer-produced evidence
 * bundle. Giving those turns the full Agent tool catalog creates a second RAG
 * pass (and often another model step) over evidence that is already present.
 * Knowledge QA is always a direct generation request with no tools. The
 * knowledge side panel does not expose an agent workflow, so even a stale or
 * malformed Plan-mode value must not reopen the Skill/tool path.
 */
export function knowledgeQaToolSpecs(
  tools: readonly ModelToolSpec[],
  input: { title?: string }
): ModelToolSpec[] {
  if (!isKnowledgeQaThreadTitle(input.title)) {
    return [...tools]
  }
  return []
}
