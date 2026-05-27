import { randomUUID } from 'node:crypto'
import {
  DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL,
  DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS,
  DEFAULT_WRITE_INLINE_COMPLETION_MODEL,
  normalizeWriteInlineCompletionModel,
  type AppSettingsV1
} from '../../shared/app-settings'
import { upstreamDeepSeekFimCompletionsUrl } from '../../shared/openai-compat-url'
import type {
  WriteInlineCompletionMode,
  WriteInlineCompletionDebugEntry,
  WriteInlineCompletionRequest,
  WriteInlineCompletionResult
} from '../../shared/write-inline-completion'
import {
  retrieveWriteInlineCompletionContext,
  type WriteRetrievalContext
} from './write-retrieval-service'

const INLINE_COMPLETION_TIMEOUT_MS = 12_000
const MAX_INLINE_COMPLETION_DEBUG_ENTRIES = 120
const MAX_DEBUG_TEXT_CHARS = 80_000

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>
    }
    text?: string
  }>
}

const inlineCompletionDebugEntries: WriteInlineCompletionDebugEntry[] = []

function clipDebugText(text = ''): string {
  const source = String(text || '')
  if (source.length <= MAX_DEBUG_TEXT_CHARS) return source
  const head = Math.floor(MAX_DEBUG_TEXT_CHARS * 0.62)
  const tail = MAX_DEBUG_TEXT_CHARS - head - 24
  return `${source.slice(0, head)}\n\n... debug text clipped ...\n\n${source.slice(source.length - tail)}`
}

function appendInlineCompletionDebugEntry(entry: WriteInlineCompletionDebugEntry): void {
  inlineCompletionDebugEntries.push({
    ...entry,
    prompt: clipDebugText(entry.prompt),
    suffix: clipDebugText(entry.suffix),
    rawResponse: clipDebugText(entry.rawResponse),
    completion: clipDebugText(entry.completion)
  })
  if (inlineCompletionDebugEntries.length > MAX_INLINE_COMPLETION_DEBUG_ENTRIES) {
    inlineCompletionDebugEntries.splice(0, inlineCompletionDebugEntries.length - MAX_INLINE_COMPLETION_DEBUG_ENTRIES)
  }
}

export function listWriteInlineCompletionDebugEntries(): WriteInlineCompletionDebugEntry[] {
  return [...inlineCompletionDebugEntries].reverse()
}

export function clearWriteInlineCompletionDebugEntries(): void {
  inlineCompletionDebugEntries.length = 0
}

function appendInlineCompletionPreflightFailure(
  startedAt: number,
  settings: AppSettingsV1,
  request: WriteInlineCompletionRequest,
  message: string
): void {
  const model = resolveModel(request, settings)
  const mode = resolveMode(request)
  const prompt = buildWriteInlineCompletionPrompt(request, null)
  appendInlineCompletionDebugEntry({
    id: randomUUID(),
    createdAt: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
    ok: false,
    model,
    mode,
    currentFilePath: request.currentFilePath,
    prompt,
    suffix: request.suffix,
    rawResponse: '',
    completion: '',
    errorMessage: message,
    referenceCount: 0,
    promptChars: prompt.length,
    suffixChars: request.suffix.length,
    responseChars: 0
  })
}

function resolveModel(request: WriteInlineCompletionRequest, settings: AppSettingsV1): string {
  const trimmed = request.model?.trim() || settings.write.inlineCompletion.model.trim()
  return normalizeWriteInlineCompletionModel(trimmed || DEFAULT_WRITE_INLINE_COMPLETION_MODEL)
}

function resolveMode(request: WriteInlineCompletionRequest): WriteInlineCompletionMode {
  return request.mode === 'long' ? 'long' : 'short'
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

function cleanCompletionText(raw: string): string {
  const normalized = raw.replace(/\r\n?/g, '\n').replaceAll(String.fromCharCode(0), '')
  const trimmed = normalized.trim()
  if (!trimmed) return ''

  const fenced = trimmed.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/)
  if (fenced) return fenced[1]
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return normalized
}

function sanitizePromptLine(text = ''): string {
  return String(text || '').replace(/\r\n?/g, '\n').replace(/-->/g, '--\\>')
}

function buildCompletionModePromptPrefix(mode: WriteInlineCompletionMode): string {
  if (mode !== 'long') return ''
  return [
    '<!-- DeepSeek GUI inline completion mode: long inspiration.',
    'The user paused at the cursor. Continue the draft with a grounded next thought, usually one compact paragraph or a short structural continuation.',
    'Return only insertable text. Do not mention this comment, do not summarize the document, and do not take over the whole draft.',
    '-->',
    ''
  ].join('\n')
}

function buildRetrievalPromptPrefix(
  retrieval: WriteRetrievalContext,
  mode: WriteInlineCompletionMode
): string {
  const lines = [
    '<!-- DeepSeek GUI inline completion references.',
    'Use these snippets only for local terminology, factual continuity, and style. Do not insert or mention this comment.',
    `Completion mode: ${mode}.`,
    `Retrieval: ${retrieval.source}; indexed ${retrieval.indexedFiles} files / ${retrieval.indexedChunks} chunks.`,
    `Query keywords: ${retrieval.keywords.join(', ')}`
  ]

  retrieval.snippets.forEach((snippet, index) => {
    const location = snippet.lineStart === snippet.lineEnd
      ? `${snippet.path}:${snippet.lineStart}`
      : `${snippet.path}:${snippet.lineStart}-${snippet.lineEnd}`
    lines.push('')
    lines.push(`[${index + 1}] ${location}`)
    if (snippet.title) lines.push(`Title: ${sanitizePromptLine(snippet.title)}`)
    lines.push(`Matched: ${snippet.keywords.join(', ')}`)
    lines.push(sanitizePromptLine(snippet.text))
  })

  lines.push('-->')
  return `${lines.join('\n')}\n\n`
}

export function buildWriteInlineCompletionPrompt(
  request: WriteInlineCompletionRequest,
  retrieval: WriteRetrievalContext | null = null
): string {
  const mode = resolveMode(request)
  const modePrefix = buildCompletionModePromptPrefix(mode)
  const retrievalPrefix = retrieval?.snippets.length
    ? buildRetrievalPromptPrefix(retrieval, mode)
    : ''
  return `${modePrefix}${retrievalPrefix}${request.prefix}`
}

function extractCompletion(responseText: string): string {
  let parsed: ChatCompletionResponse
  try {
    parsed = JSON.parse(responseText) as ChatCompletionResponse
  } catch {
    throw new Error('Inline completion provider returned non-JSON data.')
  }
  const firstChoice = parsed.choices?.[0]
  if (typeof firstChoice?.text === 'string') return cleanCompletionText(firstChoice.text)
  const first = firstChoice?.message?.content
  return cleanCompletionText(flattenMessageContent(first))
}

export async function requestWriteInlineCompletion(
  settings: AppSettingsV1,
  request: WriteInlineCompletionRequest
): Promise<WriteInlineCompletionResult> {
  const startedAt = Date.now()
  if (settings.write.inlineCompletion.enabled === false) {
    appendInlineCompletionPreflightFailure(startedAt, settings, request, 'Inline completion is disabled.')
    return { ok: false, message: 'Inline completion is disabled.' }
  }

  const apiKey = settings.deepseek.apiKey.trim()
  if (!apiKey) {
    appendInlineCompletionPreflightFailure(startedAt, settings, request, 'Missing API key for inline completion.')
    return { ok: false, message: 'Missing API key for inline completion.' }
  }

  const model = resolveModel(request, settings)
  const mode = resolveMode(request)
  const url = upstreamDeepSeekFimCompletionsUrl(
    settings.write.inlineCompletion.baseUrl.trim() || DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL
  )
  const maxTokens = mode === 'long'
    ? settings.write.inlineCompletion.longMaxTokens || settings.write.inlineCompletion.maxTokens || DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS
    : settings.write.inlineCompletion.maxTokens || DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS
  const retrieval = settings.write.inlineCompletion.retrievalEnabled === false
    ? null
    : await retrieveWriteInlineCompletionContext(request, {
        maxSnippets: mode === 'long' ? 5 : 3
      }).catch(() => null)
  const prompt = buildWriteInlineCompletionPrompt(request, retrieval)
  const debugBase = {
    id: randomUUID(),
    createdAt: new Date(startedAt).toISOString(),
    model,
    mode,
    currentFilePath: request.currentFilePath,
    prompt,
    suffix: request.suffix,
    referenceCount: retrieval?.snippets.length ?? 0,
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
        max_tokens: maxTokens
      }),
      signal: AbortSignal.timeout(INLINE_COMPLETION_TIMEOUT_MS)
    })
    const text = await response.text()
    if (!response.ok) {
      appendInlineCompletionDebugEntry({
        ...debugBase,
        durationMs: Date.now() - startedAt,
        ok: false,
        rawResponse: text,
        completion: '',
        responseChars: text.length,
        errorMessage: `Inline completion request failed (${response.status})`
      })
      return {
        ok: false,
        message: `Inline completion request failed (${response.status}): ${text.slice(0, 300)}`
      }
    }

    const completion = extractCompletion(text)
    appendInlineCompletionDebugEntry({
      ...debugBase,
      durationMs: Date.now() - startedAt,
      ok: true,
      rawResponse: text,
      completion,
      responseChars: text.length
    })

    return {
      ok: true,
      completion,
      model,
      mode
    }
  } catch (error) {
    appendInlineCompletionDebugEntry({
      ...debugBase,
      durationMs: Date.now() - startedAt,
      ok: false,
      rawResponse: '',
      completion: '',
      responseChars: 0,
      errorMessage: error instanceof Error ? error.message : String(error)
    })
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    }
  }
}
