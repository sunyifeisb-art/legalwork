import { afterEach, describe, expect, it, vi } from 'vitest'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  defaultClawSettings,
  defaultWriteSettings,
  type AppSettingsV1
} from '../../shared/app-settings'
import type { WriteInlineEditRequest } from '../../shared/write-inline-edit'
import {
  buildWriteInlineEditPrompt,
  clearWriteInlineEditDebugEntries,
  listWriteInlineEditDebugEntries,
  requestWriteInlineEdit
} from './write-inline-edit-service'
import { clearWriteRetrievalCache } from './write-retrieval-service'

function createSettings(patch: Partial<AppSettingsV1['write']['inlineCompletion']> = {}): AppSettingsV1 {
  const write = defaultWriteSettings()
  return {
    version: 1,
    locale: 'en',
    theme: 'system',
    uiFontScale: 'small',
    agentProvider: 'deepseek-runtime',
    deepseek: {
      binaryPath: '',
      port: 7878,
      autoStart: true,
      apiKey: 'sk-test',
      baseUrl: 'https://api.deepseek.com/beta',
      runtimeToken: '',
      extraCorsOrigins: [],
      approvalPolicy: 'auto',
      sandboxMode: 'workspace-write'
    },
    workspaceRoot: '/tmp/workspace',
    log: {
      enabled: true,
      retentionDays: 2
    },
    notifications: {
      turnComplete: true
    },
    write: {
      ...write,
      inlineCompletion: {
        ...write.inlineCompletion,
        ...patch
      }
    },
    guiUpdate: {
      channel: 'stable'
    },
    claw: defaultClawSettings()
  }
}

function createRequest(patch: Partial<WriteInlineEditRequest> = {}): WriteInlineEditRequest {
  return {
    prefix: '# Draft\n\n',
    suffix: '\n\nNext paragraph.',
    original: 'DeepSeek GUI keeps text editing local.',
    instruction: 'Replace DeepSeek GUI with Write mode in this paragraph.',
    workspaceRoot: '/tmp/workspace',
    currentFilePath: '/tmp/workspace/draft.md',
    scope: {
      kind: 'paragraph',
      from: 10,
      to: 48,
      startLine: 3,
      startColumn: 1,
      endLine: 3,
      endColumn: 38
    },
    context: {
      language: 'markdown',
      selectedText: 'DeepSeek GUI',
      previousLine: '',
      previousNonEmptyLine: '# Draft',
      nextLine: ''
    },
    preview: {
      local: 'DeepSeek GUI keeps text editing local.',
      documentTail: '# Draft'
    },
    model: 'deepseek-v4-flash',
    ...patch
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  clearWriteRetrievalCache()
  clearWriteInlineEditDebugEntries()
})

describe('requestWriteInlineEdit', () => {
  it('calls DeepSeek FIM completions and returns replacement text only', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ text: 'Write mode keeps text editing local.' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await requestWriteInlineEdit(createSettings({ longMaxTokens: 320 }), createRequest())

    expect(result).toEqual({
      ok: true,
      replacement: 'Write mode keeps text editing local.',
      model: 'deepseek-v4-flash',
      referenceCount: 0
    })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.deepseek.com/beta/completions')
    expect(init.headers).toMatchObject({ Authorization: 'Bearer sk-test' })
    const body = JSON.parse(String(init.body)) as { prompt: string; suffix: string; max_tokens: number }
    expect(body.prompt).toContain('DeepSeek GUI inline edit')
    expect(body.prompt).toContain('Original edit scope:')
    expect(body.prompt.endsWith(createRequest().prefix)).toBe(true)
    expect(body.suffix).toBe(createRequest().suffix)
    expect(body.max_tokens).toBeGreaterThanOrEqual(320)

    const debugEntries = listWriteInlineEditDebugEntries()
    expect(debugEntries).toHaveLength(1)
    expect(debugEntries[0]).toMatchObject({
      ok: true,
      replacement: 'Write mode keeps text editing local.',
      model: 'deepseek-v4-flash',
      referenceCount: 0
    })
    expect(debugEntries[0].prompt).toContain('DeepSeek GUI inline edit')
  })

  it('records preflight failures in the debug log', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const settings = createSettings()
    settings.deepseek.apiKey = ''

    const result = await requestWriteInlineEdit(settings, createRequest({
      original: 'Equity terms should stay consistent.',
      context: {
        ...createRequest().context,
        selectedText: 'Equity'
      }
    }))

    expect(result).toEqual({ ok: false, message: 'Missing API key for inline editing.' })
    expect(fetchMock).not.toHaveBeenCalled()
    const debugEntries = listWriteInlineEditDebugEntries()
    expect(debugEntries).toHaveLength(1)
    expect(debugEntries[0]).toMatchObject({
      ok: false,
      original: 'Equity terms should stay consistent.',
      errorMessage: 'Missing API key for inline editing.',
      referenceCount: 0,
      responseChars: 0
    })
    expect(debugEntries[0].prompt).toContain('Equity terms should stay consistent.')
  })

  it('adds BM25 retrieval snippets to the inline edit FIM prompt', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'ds-gui-write-edit-rag-'))
    await mkdir(join(workspaceRoot, 'notes'), { recursive: true })
    await writeFile(
      join(workspaceRoot, 'notes', 'terms.md'),
      [
        '# Product terms',
        '',
        'Write mode is the product name for local drafting and paragraph editing.',
        'Use the term Write mode instead of older names when revising product copy.'
      ].join('\n'),
      'utf8'
    )
    await writeFile(
      join(workspaceRoot, 'draft.md'),
      '# Draft\n\nDeepSeek GUI keeps text editing local.',
      'utf8'
    )

    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ choices: [{ text: 'Write mode keeps text editing local.' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    const request = createRequest({
      workspaceRoot,
      currentFilePath: join(workspaceRoot, 'draft.md')
    })
    const result = await requestWriteInlineEdit(createSettings(), request)

    expect(result).toMatchObject({ ok: true, referenceCount: 1 })
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    const body = JSON.parse(String(init.body)) as { prompt: string }
    expect(body.prompt).toContain('Reference snippets from the same writing workspace')
    expect(body.prompt).toContain('notes/terms.md')
    expect(body.prompt).toContain('Write mode is the product name')
  })

  it('keeps retrieval out of prompts when no snippets are supplied', () => {
    const prompt = buildWriteInlineEditPrompt(createRequest(), null)

    expect(prompt).toContain('DeepSeek GUI inline edit')
    expect(prompt).not.toContain('Reference snippets from the same writing workspace')
  })

  it('adds recent local edits as intent signals to the prompt', () => {
    const prompt = buildWriteInlineEditPrompt(createRequest({
      instruction: 'Continue the same rename.',
      recentEdits: [{
        source: 'user',
        ageMs: 2_400,
        filePath: '/tmp/workspace/draft.md',
        from: 20,
        to: 32,
        deletedText: 'DeepSeek GUI',
        insertedText: 'Write mode',
        beforeContext: 'Earlier term: ',
        afterContext: ' should be consistent.',
        instruction: 'Rename the product term.',
        scopeKind: 'paragraph'
      }]
    }), null)

    expect(prompt).toContain('Recent local edits in this file')
    expect(prompt).toContain('Continue the same rename.')
    expect(prompt).toContain('Deleted: DeepSeek GUI')
    expect(prompt).toContain('Inserted: Write mode')
    expect(prompt).toContain('Rename the product term.')
  })
})
