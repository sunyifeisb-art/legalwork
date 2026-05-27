import { randomUUID } from 'node:crypto'
import {
  DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL,
  DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS,
  DEFAULT_WRITE_INLINE_COMPLETION_MODEL,
  DEFAULT_WRITE_INLINE_LONG_COMPLETION_MAX_TOKENS,
  normalizeWriteInlineCompletionModel,
  type AppSettingsV1
} from '../../shared/app-settings'
import { upstreamDeepSeekFimCompletionsUrl } from '../../shared/openai-compat-url'
import type { WriteInlineCompletionRequest } from '../../shared/write-inline-completion'
import type {
  WriteInlineEditDebugEntry,
  WriteInlineEditRequest,
  WriteInlineEditResult
} from '../../shared/write-inline-edit'
import {
  retrieveWriteInlineCompletionContext,
  type WriteRetrievalContext
} from './write-retrieval-service'

const INLINE_EDIT_TIMEOUT_MS = 18_000
const MAX_INLINE_EDIT_TOKENS = 2_048
const MAX_INLINE_EDIT_DEBUG_ENTRIES = 80
const MAX_DEBUG_TEXT_CHARS = 120_000

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>
    }
    text?: string
  }>
}

const inlineEditDebugEntries: WriteInlineEditDebugEntry[] = []

function clipDebugText(text = ''): string {
  const source = String(text || '')
  if (source.length <= MAX_DEBUG_TEXT_CHARS) return source
  const head = Math.floor(MAX_DEBUG_TEXT_CHARS * 0.62)
  const tail = MAX_DEBUG_TEXT_CHARS - head - 24
  return `${source.slice(0, head)}\n\n... debug text clipped ...\n\n${source.slice(source.length - tail)}`
}

function appendInlineEditDebugEntry(entry: WriteInlineEditDebugEntry): void {
  inlineEditDebugEntries.push({
    ...entry,
    original: clipDebugText(entry.original),
    prompt: clipDebugText(entry.prompt),
    suffix: clipDebugText(entry.suffix),
    rawResponse: clipDebugText(entry.rawResponse),
    replacement: clipDebugText(entry.replacement)
  })
  if (inlineEditDebugEntries.length > MAX_INLINE_EDIT_DEBUG_ENTRIES) {
    inlineEditDebugEntries.splice(0, inlineEditDebugEntries.length - MAX_INLINE_EDIT_DEBUG_ENTRIES)
  }
}

export function listWriteInlineEditDebugEntries(): WriteInlineEditDebugEntry[] {
  return [...inlineEditDebugEntries].reverse()
}

export function clearWriteInlineEditDebugEntries(): void {
  inlineEditDebugEntries.length = 0
}

function appendInlineEditPreflightFailure(
  startedAt: number,
  settings: AppSettingsV1,
  request: WriteInlineEditRequest,
  message: string
): void {
  const model = resolveModel(request, settings)
  const prompt = buildWriteInlineEditPrompt(request, null)
  appendInlineEditDebugEntry({
    id: randomUUID(),
    createdAt: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
    ok: false,
    model,
    currentFilePath: request.currentFilePath,
    instruction: request.instruction,
    scopeKind: request.scope.kind,
    original: request.original,
    prompt,
    suffix: request.suffix,
    rawResponse: '',
    replacement: '',
    errorMessage: message,
    referenceCount: 0,
    recentEditCount: request.recentEdits?.length ?? 0,
    promptChars: prompt.length,
    suffixChars: request.suffix.length,
    responseChars: 0
  })
}

function resolveModel(request: WriteInlineEditRequest, settings: AppSettingsV1): string {
  const trimmed = request.model?.trim() || settings.write.inlineCompletion.model.trim()
  return normalizeWriteInlineCompletionModel(trimmed || DEFAULT_WRITE_INLINE_COMPLETION_MODEL)
}

function compactText(text = ''): string {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function clipHead(text = '', maxChars = 0): string {
  const source = String(text || '')
  if (!maxChars || source.length <= maxChars) return source
  return source.slice(0, maxChars)
}

function clipTail(text = '', maxChars = 0): string {
  const source = String(text || '')
  if (!maxChars || source.length <= maxChars) return source
  return source.slice(source.length - maxChars)
}

function sanitizePromptText(text = ''): string {
  return String(text || '').replace(/\r\n?/g, '\n').replace(/-->/g, '--\\>')
}

function clipPromptText(text = '', maxChars = 0): string {
  const source = sanitizePromptText(text)
  if (!maxChars || source.length <= maxChars) return source
  const head = Math.max(1, Math.floor(maxChars * 0.58))
  const tail = Math.max(1, maxChars - head - 13)
  return `${source.slice(0, head)}\n... omitted ...\n${source.slice(source.length - tail)}`
}

function flattenMessageContent(
  content: string | Array<{ type?: string; text?: string }> | undefined
): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map((part) => (part?.type === 'text' || part?.text ? part?.text ?? '' : ''))
    .join('')
}

function cleanReplacementText(raw: string): string {
  const normalized = raw.replace(/\r\n?/g, '\n').replaceAll(String.fromCharCode(0), '')
  const trimmed = normalized.trim()
  if (!trimmed) return ''

  const fenced = trimmed.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/)
  if (fenced) return fenced[1]
  const labeled = trimmed.match(/^(?:replacement|new text|edited text|替换文本|修改后)[:：]\s*([\s\S]*)$/i)
  if (labeled) return labeled[1].replace(/^\n+/, '')
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return normalized
}

function extractReplacement(responseText: string): string {
  let parsed: ChatCompletionResponse
  try {
    parsed = JSON.parse(responseText) as ChatCompletionResponse
  } catch {
    throw new Error('Inline edit provider returned non-JSON data.')
  }
  const firstChoice = parsed.choices?.[0]
  if (typeof firstChoice?.text === 'string') return cleanReplacementText(firstChoice.text)
  return cleanReplacementText(flattenMessageContent(firstChoice?.message?.content))
}

function allowsEmptyReplacement(instruction: string): boolean {
  return /\b(delete|remove|clear|drop|erase)\b/i.test(instruction) ||
    /删除|删掉|去掉|移除|清空/.test(instruction)
}

function buildRetrievalRequest(request: WriteInlineEditRequest): WriteInlineCompletionRequest {
  const recentEditText = (request.recentEdits ?? [])
    .map((edit) => [
      edit.instruction,
      edit.deletedText,
      edit.insertedText
    ].filter(Boolean).join(' '))
    .join(' ')
  const queryText = compactText([
    request.instruction,
    request.context.selectedText,
    request.original,
    recentEditText
  ].join(' ')).slice(0, 20_000)

  return {
    prefix: clipTail(`${request.prefix}\n${request.original}`, 1_600),
    suffix: clipHead(request.suffix, 900),
    mode: 'long',
    workspaceRoot: request.workspaceRoot,
    currentFilePath: request.currentFilePath,
    cursor: {
      line: request.scope.startLine,
      column: Math.max(0, request.scope.startColumn - 1)
    },
    context: {
      language: request.context.language,
      currentLinePrefix: queryText,
      currentLineSuffix: '',
      previousLine: request.context.previousLine,
      previousNonEmptyLine: request.context.previousNonEmptyLine,
      nextLine: request.context.nextLine,
      indentation: '',
      signals: {
        list: false,
        quote: false,
        heading: false,
        table: false,
        atLineEnd: false,
        endsWithSentencePunctuation: false,
        previousLineEndsWithSentencePunctuation: false,
        prefersNewLineCompletion: false,
        paragraphBreakOpportunity: false
      }
    },
    policy: {
      name: 'precision-inline-edit-v1',
      instruction: 'Retrieve references for a local in-place text edit.',
      acceptanceCriteria: ['References should share terminology, entities, or style with the requested edit.'],
      rejectionCriteria: ['Do not retrieve unrelated snippets.']
    },
    preview: {
      local: compactText(`${request.instruction} ${request.context.selectedText}`).slice(0, 120),
      documentTail: compactText(`${request.preview.documentTail} ${request.instruction} ${request.original}`).slice(0, 180)
    },
    model: request.model
  }
}

function buildRetrievalEditBlock(retrieval: WriteRetrievalContext | null): string[] {
  if (!retrieval?.snippets.length) return []
  const lines = [
    '',
    'Reference snippets from the same writing workspace. Use them only for terminology, entities, factual continuity, and local style. Do not copy them unless the edit explicitly asks for it.',
    `Retrieval: ${retrieval.source}; indexed ${retrieval.indexedFiles} files / ${retrieval.indexedChunks} chunks.`,
    `Query keywords: ${retrieval.keywords.join(', ')}`
  ]

  retrieval.snippets.forEach((snippet, index) => {
    const location = snippet.lineStart === snippet.lineEnd
      ? `${snippet.path}:${snippet.lineStart}`
      : `${snippet.path}:${snippet.lineStart}-${snippet.lineEnd}`
    lines.push('')
    lines.push(`[${index + 1}] ${location}`)
    if (snippet.title) lines.push(`Title: ${sanitizePromptText(snippet.title)}`)
    lines.push(`Matched: ${snippet.keywords.join(', ')}`)
    lines.push(sanitizePromptText(snippet.text))
  })

  return lines
}

function formatRecentEditAge(ageMs: number): string {
  const seconds = Math.max(0, Math.round(ageMs / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.round(minutes / 60)}h ago`
}

function buildRecentEditsPromptBlock(request: WriteInlineEditRequest): string[] {
  const edits = (request.recentEdits ?? [])
    .filter((edit) => edit.deletedText || edit.insertedText || edit.instruction)
    .slice(-8)
  if (edits.length === 0) return []

  const lines = [
    '',
    'Recent local edits in this file. Treat these as intent signals: continue obvious terminology, tone, or rewrite patterns when they fit the current instruction. If they conflict with the current instruction, follow the current instruction.'
  ]

  edits.forEach((edit, index) => {
    lines.push('')
    lines.push(`[${index + 1}] ${formatRecentEditAge(edit.ageMs)}; source=${edit.source}; range=${edit.from}-${edit.to}${edit.scopeKind ? `; scope=${edit.scopeKind}` : ''}`)
    if (edit.instruction) lines.push(`Instruction: ${clipPromptText(edit.instruction, 420)}`)
    if (edit.deletedText) lines.push(`Deleted: ${clipPromptText(edit.deletedText, 520)}`)
    if (edit.insertedText) lines.push(`Inserted: ${clipPromptText(edit.insertedText, 520)}`)
    const around = compactText(`${edit.beforeContext} [[edit]] ${edit.afterContext}`)
    if (around) lines.push(`Around: ${clipPromptText(around, 520)}`)
  })

  return lines
}

export function buildWriteInlineEditPrompt(
  request: WriteInlineEditRequest,
  retrieval: WriteRetrievalContext | null = null
): string {
  const scopeLines = request.scope.startLine === request.scope.endLine
    ? `line ${request.scope.startLine}`
    : `lines ${request.scope.startLine}-${request.scope.endLine}`
  const lines = [
    '<!-- DeepSeek GUI inline edit.',
    'You are replacing the missing middle between PREFIX and SUFFIX.',
    'Return exactly the replacement text for the edit scope.',
    'Do not include explanations, markdown fences, before/after labels, or unchanged surrounding text.',
    'Preserve Markdown structure, indentation, voice, and nearby wording unless the user instruction asks to change them.',
    'When the user asks to continue, do the same, keep replacing terms, or follow the previous style, infer that intent from Recent local edits.',
    `Edit scope: ${request.scope.kind}; ${scopeLines}.`,
    `User instruction: ${sanitizePromptText(request.instruction)}`,
    ...buildRecentEditsPromptBlock(request),
    '',
    'Original edit scope:',
    sanitizePromptText(request.original),
    ...buildRetrievalEditBlock(retrieval),
    '-->',
    ''
  ]
  return `${lines.join('\n')}${request.prefix}`
}

function resolveMaxTokens(request: WriteInlineEditRequest, settings: AppSettingsV1): number {
  const configured = Math.max(
    settings.write.inlineCompletion.longMaxTokens || DEFAULT_WRITE_INLINE_LONG_COMPLETION_MAX_TOKENS,
    settings.write.inlineCompletion.maxTokens || DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS
  )
  const estimatedReplacementTokens = Math.ceil(Math.max(request.original.length, request.instruction.length) / 3) + 128
  return Math.max(64, Math.min(MAX_INLINE_EDIT_TOKENS, Math.max(configured, estimatedReplacementTokens)))
}

export async function requestWriteInlineEdit(
  settings: AppSettingsV1,
  request: WriteInlineEditRequest
): Promise<WriteInlineEditResult> {
  const startedAt = Date.now()
  if (settings.write.inlineCompletion.enabled === false) {
    appendInlineEditPreflightFailure(startedAt, settings, request, 'Inline editing is disabled.')
    return { ok: false, message: 'Inline editing is disabled.' }
  }

  const instruction = request.instruction.trim()
  if (!instruction) {
    appendInlineEditPreflightFailure(startedAt, settings, request, 'Missing edit instruction.')
    return { ok: false, message: 'Missing edit instruction.' }
  }
  if (!request.original && !allowsEmptyReplacement(instruction)) {
    appendInlineEditPreflightFailure(startedAt, settings, request, 'Missing edit scope.')
    return { ok: false, message: 'Missing edit scope.' }
  }

  const apiKey = settings.deepseek.apiKey.trim()
  if (!apiKey) {
    appendInlineEditPreflightFailure(startedAt, settings, request, 'Missing API key for inline editing.')
    return { ok: false, message: 'Missing API key for inline editing.' }
  }

  const model = resolveModel(request, settings)
  const url = upstreamDeepSeekFimCompletionsUrl(
    settings.write.inlineCompletion.baseUrl.trim() || DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL
  )
  const retrieval = settings.write.inlineCompletion.retrievalEnabled === false
    ? null
    : await retrieveWriteInlineCompletionContext(buildRetrievalRequest(request), {
        maxSnippets: 5
      }).catch(() => null)
  const prompt = buildWriteInlineEditPrompt(request, retrieval)
  const debugBase = {
    id: randomUUID(),
    createdAt: new Date(startedAt).toISOString(),
    model,
    currentFilePath: request.currentFilePath,
    instruction: request.instruction,
    scopeKind: request.scope.kind,
    original: request.original,
    prompt,
    suffix: request.suffix,
    referenceCount: retrieval?.snippets.length ?? 0,
    recentEditCount: request.recentEdits?.length ?? 0,
    promptChars: prompt.length,
    suffixChars: request.suffix.length
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt,
        suffix: request.suffix,
        max_tokens: resolveMaxTokens(request, settings)
      }),
      signal: AbortSignal.timeout(INLINE_EDIT_TIMEOUT_MS)
    })
    const text = await response.text()
    if (!response.ok) {
      appendInlineEditDebugEntry({
        ...debugBase,
        durationMs: Date.now() - startedAt,
        ok: false,
        rawResponse: text,
        replacement: '',
        responseChars: text.length,
        errorMessage: `Inline edit request failed (${response.status})`
      })
      return {
        ok: false,
        message: `Inline edit request failed (${response.status}): ${text.slice(0, 300)}`
      }
    }

    const replacement = extractReplacement(text)
    if (!replacement && !allowsEmptyReplacement(instruction)) {
      appendInlineEditDebugEntry({
        ...debugBase,
        durationMs: Date.now() - startedAt,
        ok: false,
        rawResponse: text,
        replacement,
        responseChars: text.length,
        errorMessage: 'Inline edit returned an empty replacement.'
      })
      return { ok: false, message: 'Inline edit returned an empty replacement.' }
    }

    appendInlineEditDebugEntry({
      ...debugBase,
      durationMs: Date.now() - startedAt,
      ok: true,
      rawResponse: text,
      replacement,
      responseChars: text.length
    })

    return {
      ok: true,
      replacement,
      model,
      referenceCount: retrieval?.snippets.length ?? 0
    }
  } catch (error) {
    appendInlineEditDebugEntry({
      ...debugBase,
      durationMs: Date.now() - startedAt,
      ok: false,
      rawResponse: '',
      replacement: '',
      responseChars: 0,
      errorMessage: error instanceof Error ? error.message : String(error)
    })
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    }
  }
}
