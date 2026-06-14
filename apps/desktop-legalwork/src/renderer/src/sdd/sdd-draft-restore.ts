import type { WorkspaceFileReadResult, WorkspaceFileTarget } from '@shared/workspace-file'
import {
  forgetRememberedSddDraft,
  readRememberedSddDraft,
  type SddDraft
} from './sdd-draft-store'

export type RestoredSddDraft = {
  kind: 'restored'
  draft: SddDraft
  content: string
}

export type UnrestorableSddDraft =
  | { kind: 'missing' }
  | { kind: 'unreadable'; draft: SddDraft; message: string }

export type RestoreRememberedSddDraftResult = RestoredSddDraft | UnrestorableSddDraft

type RestoreRememberedSddDraftOptions = {
  workspaceRoot: string
  readWorkspaceFile: (options: WorkspaceFileTarget) => Promise<WorkspaceFileReadResult>
}

export async function restoreRememberedSddDraft({
  workspaceRoot,
  readWorkspaceFile
}: RestoreRememberedSddDraftOptions): Promise<RestoreRememberedSddDraftResult> {
  const remembered = readRememberedSddDraft(workspaceRoot)
  if (!remembered) return { kind: 'missing' }

  const result = await readWorkspaceFile({
    workspaceRoot: remembered.workspaceRoot,
    path: remembered.relativePath
  })
  if (!result.ok) {
    forgetRememberedSddDraft(remembered)
    return { kind: 'unreadable', draft: remembered, message: result.message }
  }

  return {
    kind: 'restored',
    draft: { ...remembered, absolutePath: result.path },
    content: result.content
  }
}
