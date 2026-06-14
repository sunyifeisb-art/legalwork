import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { restoreRememberedSddDraft } from './sdd-draft-restore'
import { createSddDraft, readRememberedSddDraft, useSddDraftStore } from './sdd-draft-store'

function createMemoryStorage(): Storage {
  const items = new Map<string, string>()
  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, value)
    }
  }
}

describe('sdd-draft-restore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage())
    vi.stubGlobal('window', { localStorage })
    useSddDraftStore.getState().clearActiveDraft()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    useSddDraftStore.getState().clearActiveDraft()
  })

  it('restores a remembered draft from disk', async () => {
    const draft = createSddDraft({
      id: '123e4567-e89b-12d3-a456-426614174000',
      workspaceRoot: '/tmp/app/',
      now: 1
    })
    useSddDraftStore.getState().setActiveDraft(draft, '# Previous')
    const readWorkspaceFile = vi.fn().mockResolvedValue({
      ok: true,
      path: '/tmp/app/.kunsdd/draft/123e4567-e89b-12d3-a456-426614174000/requirement.md',
      content: '# Restored',
      size: 10,
      truncated: false
    })

    const result = await restoreRememberedSddDraft({
      workspaceRoot: '/tmp/app',
      readWorkspaceFile
    })

    expect(readWorkspaceFile).toHaveBeenCalledWith({
      workspaceRoot: '/tmp/app',
      path: '.kunsdd/draft/123e4567-e89b-12d3-a456-426614174000/requirement.md'
    })
    expect(result).toMatchObject({
      kind: 'restored',
      content: '# Restored',
      draft: {
        id: draft.id,
        workspaceRoot: '/tmp/app',
        absolutePath: '/tmp/app/.kunsdd/draft/123e4567-e89b-12d3-a456-426614174000/requirement.md'
      }
    })
  })

  it('clears an unreadable remembered draft so the caller can create a fresh one', async () => {
    const draft = createSddDraft({
      id: '123e4567-e89b-12d3-a456-426614174000',
      workspaceRoot: '/tmp/app',
      now: 1
    })
    useSddDraftStore.getState().setActiveDraft(draft, '# Previous')
    const readWorkspaceFile = vi.fn().mockResolvedValue({
      ok: false,
      message: 'ENOENT'
    })

    const result = await restoreRememberedSddDraft({
      workspaceRoot: '/tmp/app',
      readWorkspaceFile
    })

    expect(result).toMatchObject({
      kind: 'unreadable',
      draft,
      message: 'ENOENT'
    })
    expect(readRememberedSddDraft('/tmp/app')).toBeNull()
  })

  it('does not read from disk when no remembered draft exists', async () => {
    const readWorkspaceFile = vi.fn()

    await expect(restoreRememberedSddDraft({
      workspaceRoot: '/tmp/app',
      readWorkspaceFile
    })).resolves.toEqual({ kind: 'missing' })
    expect(readWorkspaceFile).not.toHaveBeenCalled()
  })
})
