/**
 * Legalwork HTTP endpoint path templates. The renderer and the main
 * process IPC allow-list both derive their paths from this table, so
 * adding a new endpoint is a one-file change.
 *
 * `*TEMPLATE` constants carry the `{id}` / `{turn}` placeholders
 * literally. `*PATH(...)` builders perform the URL encoding and
 * return a concrete path for runtime use.
 */

export const LEGALWORK_HEALTH_PATH = '/health'
export const LEGALWORK_HEALTH_TEMPLATE = '/health'

export const LEGALWORK_RUNTIME_INFO_PATH = '/v1/runtime/info'
export const LEGALWORK_RUNTIME_INFO_TEMPLATE = '/v1/runtime/info'

export const LEGALWORK_RUNTIME_TOOLS_PATH = '/v1/runtime/tools'
export const LEGALWORK_RUNTIME_TOOLS_TEMPLATE = '/v1/runtime/tools'

export const LEGALWORK_SKILLS_PATH = '/v1/skills'
export const LEGALWORK_SKILLS_TEMPLATE = '/v1/skills'

export const LEGALWORK_ATTACHMENTS_PATH = '/v1/attachments'
export const LEGALWORK_ATTACHMENTS_TEMPLATE = '/v1/attachments'
export const LEGALWORK_ATTACHMENT_DIAGNOSTICS_PATH = '/v1/attachments/diagnostics'
export const LEGALWORK_ATTACHMENT_DIAGNOSTICS_TEMPLATE = '/v1/attachments/diagnostics'
export const LEGALWORK_ATTACHMENT_TEMPLATE = '/v1/attachments/{id}'
export function legalworkAttachmentPath(attachmentId: string): string {
  return `/v1/attachments/${encodeURIComponent(attachmentId)}`
}
export const LEGALWORK_ATTACHMENT_CONTENT_TEMPLATE = '/v1/attachments/{id}/content'
export function legalworkAttachmentContentPath(attachmentId: string): string {
  return `${legalworkAttachmentPath(attachmentId)}/content`
}

export const LEGALWORK_MEMORY_PATH = '/v1/memory'
export const LEGALWORK_MEMORY_TEMPLATE = '/v1/memory'
export const LEGALWORK_MEMORY_DIAGNOSTICS_PATH = '/v1/memory/diagnostics'
export const LEGALWORK_MEMORY_DIAGNOSTICS_TEMPLATE = '/v1/memory/diagnostics'
export const LEGALWORK_MEMORY_RECORD_TEMPLATE = '/v1/memory/{id}'
export function legalworkMemoryRecordPath(memoryId: string): string {
  return `/v1/memory/${encodeURIComponent(memoryId)}`
}

export const LEGALWORK_KNOWLEDGE_SYNC_PATH = '/v1/knowledge/sync'
export const LEGALWORK_KNOWLEDGE_SYNC_TEMPLATE = '/v1/knowledge/sync'
export const LEGALWORK_KNOWLEDGE_SEARCH_PATH = '/v1/knowledge/search'
export const LEGALWORK_KNOWLEDGE_SEARCH_TEMPLATE = '/v1/knowledge/search'
export const LEGALWORK_KNOWLEDGE_AGENT_SOURCES_PATH = '/v1/knowledge/agent-sources'
export const LEGALWORK_KNOWLEDGE_AGENT_SOURCES_TEMPLATE = '/v1/knowledge/agent-sources'
export const LEGALWORK_KNOWLEDGE_DIAGNOSTICS_PATH = '/v1/knowledge/diagnostics'
export const LEGALWORK_KNOWLEDGE_DIAGNOSTICS_TEMPLATE = '/v1/knowledge/diagnostics'

export const LEGALWORK_KNOWLEDGE_TREE_PATH = '/v1/knowledge/tree'
export const LEGALWORK_KNOWLEDGE_TREE_TEMPLATE = '/v1/knowledge/tree'
export const LEGALWORK_KNOWLEDGE_CREATE_FOLDER_PATH = '/v1/knowledge/folder'
export const LEGALWORK_KNOWLEDGE_CREATE_FOLDER_TEMPLATE = '/v1/knowledge/folder'
export const LEGALWORK_KNOWLEDGE_WRITE_FILE_PATH = '/v1/knowledge/file'
export const LEGALWORK_KNOWLEDGE_WRITE_FILE_TEMPLATE = '/v1/knowledge/file'
export const LEGALWORK_KNOWLEDGE_READ_FILE_PATH = '/v1/knowledge/file'
export const LEGALWORK_KNOWLEDGE_READ_FILE_TEMPLATE = '/v1/knowledge/file'
export const LEGALWORK_KNOWLEDGE_ABSOLUTE_PATH_PATH = '/v1/knowledge/file/absolute-path'
export const LEGALWORK_KNOWLEDGE_ABSOLUTE_PATH_TEMPLATE = '/v1/knowledge/file/absolute-path'
export const LEGALWORK_KNOWLEDGE_MOVE_PATH = '/v1/knowledge/move'
export const LEGALWORK_KNOWLEDGE_MOVE_TEMPLATE = '/v1/knowledge/move'
export const LEGALWORK_KNOWLEDGE_DELETE_FILE_PATH = '/v1/knowledge/file'
export const LEGALWORK_KNOWLEDGE_DELETE_FILE_TEMPLATE = '/v1/knowledge/file'

export const LEGALWORK_THREADS_PATH = '/v1/threads'
export const LEGALWORK_THREADS_TEMPLATE = '/v1/threads'

export const LEGALWORK_THREAD_TEMPLATE = '/v1/threads/{id}'
export function legalworkThreadPath(threadId: string): string {
  return `/v1/threads/${encodeURIComponent(threadId)}`
}

export const LEGALWORK_THREAD_FORK_TEMPLATE = '/v1/threads/{id}/fork'
export function legalworkThreadForkPath(threadId: string): string {
  return `${legalworkThreadPath(threadId)}/fork`
}

export const LEGALWORK_THREAD_GOAL_TEMPLATE = '/v1/threads/{id}/goal'
export function legalworkThreadGoalPath(threadId: string): string {
  return `${legalworkThreadPath(threadId)}/goal`
}

export const LEGALWORK_THREAD_TODOS_TEMPLATE = '/v1/threads/{id}/todos'
export function legalworkThreadTodosPath(threadId: string): string {
  return `${legalworkThreadPath(threadId)}/todos`
}

export const LEGALWORK_THREAD_COMPACT_TEMPLATE = '/v1/threads/{id}/compact'
export function legalworkThreadCompactPath(threadId: string): string {
  return `${legalworkThreadPath(threadId)}/compact`
}

export const LEGALWORK_THREAD_REVIEW_TEMPLATE = '/v1/threads/{id}/review'
export function legalworkThreadReviewPath(threadId: string): string {
  return `${legalworkThreadPath(threadId)}/review`
}

export const LEGALWORK_THREAD_TURNS_TEMPLATE = '/v1/threads/{id}/turns'
export function legalworkThreadTurnsPath(threadId: string): string {
  return `${legalworkThreadPath(threadId)}/turns`
}

export const LEGALWORK_THREAD_STEER_TEMPLATE = '/v1/threads/{id}/turns/{turn}/steer'
export function legalworkThreadSteerPath(threadId: string, turnId: string): string {
  return `${legalworkThreadTurnsPath(threadId)}/${encodeURIComponent(turnId)}/steer`
}

export const LEGALWORK_THREAD_INTERRUPT_TEMPLATE = '/v1/threads/{id}/turns/{turn}/interrupt'
export function legalworkThreadInterruptPath(threadId: string, turnId: string): string {
  return `${legalworkThreadTurnsPath(threadId)}/${encodeURIComponent(turnId)}/interrupt`
}

export const LEGALWORK_THREAD_EVENTS_TEMPLATE = '/v1/threads/{id}/events'
export function legalworkThreadEventsPath(threadId: string): string {
  return `${legalworkThreadPath(threadId)}/events`
}

export const LEGALWORK_APPROVAL_TEMPLATE = '/v1/approvals/{id}'
export function legalworkApprovalPath(approvalId: string): string {
  return `/v1/approvals/${encodeURIComponent(approvalId)}`
}

export const LEGALWORK_USER_INPUT_TEMPLATE = '/v1/user-inputs/{id}'
export function legalworkUserInputPath(inputId: string): string {
  return `/v1/user-inputs/${encodeURIComponent(inputId)}`
}

export const LEGALWORK_SESSION_RESUME_TEMPLATE = '/v1/sessions/{id}/resume-thread'
export function legalworkSessionResumePath(sessionId: string): string {
  return `/v1/sessions/${encodeURIComponent(sessionId)}/resume-thread`
}

export const LEGALWORK_USAGE_PATH = '/v1/usage'
export const LEGALWORK_USAGE_TEMPLATE = '/v1/usage'

/** Thread mode shared with the Legalwork contract. */
export type LegalworkThreadMode = 'agent' | 'plan'

const THREAD_MODES: ReadonlySet<LegalworkThreadMode> = new Set<LegalworkThreadMode>(['agent', 'plan'])

export function isLegalworkThreadMode(value: unknown): value is LegalworkThreadMode {
  return typeof value === 'string' && (THREAD_MODES as Set<string>).has(value)
}

export function normalizeThreadMode(value: unknown): LegalworkThreadMode {
  return value === 'plan' ? 'plan' : 'agent'
}
