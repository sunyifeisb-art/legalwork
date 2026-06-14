import type { ModelClient, ModelRequest, ModelStreamChunk, ModelToolSpec } from '../../ports/model-client.js'
import type { TurnItem } from '../../contracts/items.js'
import { emptyUsageSnapshot, type UsageSnapshot } from '../../contracts/usage.js'

/**
 * Configuration for an Anthropic-compatible HTTP model client.
 * Speaks `POST {baseUrl}/v1/messages` with `stream: true`, parsing
 * Anthropic-style SSE events. Used for Kimi Code and other providers
 * that expose an Anthropic-compatible endpoint.
 */
export type AnthropicCompatConfig = {
  baseUrl: string
  apiKey: string
  model: string
  /** Optional extra headers. */
  headers?: Record<string, string>
  /** HTTP fetch implementation. Defaults to global `fetch`. */
  fetchImpl?: typeof fetch
  /** When true, the client requests a non-streaming response. */
  nonStreaming?: boolean
  /** Maximum idle time between streaming chunks before the turn fails. */
  streamIdleTimeoutMs?: number
  /** Maximum number of messages to send. Defaults to the entire history. */
  historyLimit?: number
}

type AnthropicMessage =
  | { role: 'user'; content: string | AnthropicContentBlock[] }
  | { role: 'assistant'; content: string | AnthropicContentBlock[] }

type AnthropicContentBlock =
  | { type: 'text'; text: string }
  | { type: 'thinking'; thinking: string; signature?: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; tool_use_id: string; content: string; is_error?: boolean }

type AnthropicToolSpec = {
  name: string
  description: string
  input_schema: Record<string, unknown>
}

type AnthropicStreamEvent =
  | { type: 'message_start'; message: AnthropicMessageStart }
  | { type: 'content_block_start'; index: number; content_block: AnthropicContentBlock }
  | { type: 'content_block_delta'; index: number; delta: AnthropicContentDelta }
  | { type: 'content_block_stop'; index: number }
  | { type: 'message_delta'; delta: { stop_reason?: string; stop_sequence?: string | null }; usage?: AnthropicUsage }
  | { type: 'message_stop' }
  | { type: 'ping' }

type AnthropicMessageStart = {
  id: string
  type: 'message'
  role: 'assistant'
  model: string
  content: AnthropicContentBlock[]
  stop_reason: string | null
  stop_sequence: string | null
  usage: AnthropicUsage
}

type AnthropicContentDelta =
  | { type: 'text_delta'; text: string }
  | { type: 'thinking_delta'; thinking: string }
  | { type: 'input_json_delta'; partial_json: string }
  | { type: 'signature_delta'; signature: string }

type AnthropicUsage = {
  input_tokens?: number
  output_tokens?: number
  cache_creation_input_tokens?: number
  cache_read_input_tokens?: number
}

type AnthropicResponse = {
  id: string
  type: 'message'
  role: 'assistant'
  model: string
  content: AnthropicContentBlock[]
  stop_reason: string | null
  stop_sequence: string | null
  usage: AnthropicUsage
}

type PendingToolCall = {
  index: number
  id: string
  name: string
  argumentsJson: string
}

type ModelStopReason = Extract<ModelStreamChunk, { kind: 'completed' }>['stopReason']

type StreamReadResult =
  | { kind: 'chunk'; value?: Uint8Array; done: boolean }
  | { kind: 'timeout' }
  | { kind: 'aborted' }
  | { kind: 'error'; message: string }

const DEFAULT_STREAM_IDLE_TIMEOUT_MS = 45_000
const DEFAULT_MAX_TOKENS = 4096

/**
 * Anthropic-compatible model client.
 *
 * This adapter targets providers such as Kimi Code that expose an
 * Anthropic-style `/v1/messages` endpoint. It converts the internal
 * `ModelRequest` into Anthropic message format and yields the same
 * `ModelStreamChunk` union consumed by the agent loop.
 */
export class AnthropicCompatModelClient implements ModelClient {
  readonly provider = 'anthropic-compat'
  readonly model: string

  private readonly config: AnthropicCompatConfig
  private readonly fetchImpl: typeof fetch

  constructor(config: AnthropicCompatConfig) {
    this.config = config
    this.model = config.model
    this.fetchImpl = config.fetchImpl ?? fetch
  }

  async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
    if (request.abortSignal.aborted) {
      yield { kind: 'error', message: 'request was aborted before start' }
      return
    }
    const url = this.buildUrl('/v1/messages')
    const stream = request.stream ?? !this.config.nonStreaming
    const body = this.buildRequestBody(request, stream)
    const headers = this.buildHeaders(stream)
    const init: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: request.abortSignal
    }
    let response: Response
    try {
      response = await this.fetchImpl(url, init)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      yield { kind: 'error', message: `model request failed: ${message}` }
      return
    }
    if (!response.ok) {
      const text = await response.text()
      yield {
        kind: 'error',
        message: `model request failed with status ${response.status}: ${text.slice(0, 500)}`,
        code: `http_${response.status}`
      }
      return
    }
    if (this.config.nonStreaming || response.headers.get('content-type')?.includes('application/json')) {
      const json = (await response.json()) as AnthropicResponse
      yield* this.materializeNonStreaming(json)
      return
    }
    if (!response.body) {
      yield { kind: 'error', message: 'model response had no body' }
      return
    }
    yield* this.streamSse(response.body, request.abortSignal)
  }

  private buildUrl(path: string): string {
    const base = this.config.baseUrl.replace(/\/+$/, '')
    return `${base}${path}`
  }

  private buildHeaders(stream: boolean): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: stream ? 'text/event-stream' : 'application/json',
      'anthropic-version': '2023-06-01'
    }
    if (this.config.apiKey) {
      headers.Authorization = `Bearer ${this.config.apiKey}`
    }
    return { ...headers, ...(this.config.headers ?? {}) }
  }

  private buildRequestBody(request: ModelRequest, stream: boolean): Record<string, unknown> {
    const requestModel = request.model?.trim()
    const model = requestModel || this.config.model
    const { system, messages } = this.collectMessages(request)
    const body: Record<string, unknown> = {
      model,
      max_tokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
      messages,
      stream
    }
    if (system) {
      body.system = system
    }
    if (request.temperature !== undefined) {
      body.temperature = request.temperature
    }
    if (request.topP !== undefined) {
      body.top_p = request.topP
    }
    const tools = normalizeToolSpecs(request.tools)
    if (tools.length > 0) {
      body.tools = tools
      body.tool_choice = { type: 'auto' }
    }
    return body
  }

  private collectMessages(request: ModelRequest): { system: string; messages: AnthropicMessage[] } {
    const systemParts: string[] = []
    if (request.systemPrompt?.trim()) {
      systemParts.push(request.systemPrompt.trim())
    }
    if (request.modeInstruction?.trim()) {
      systemParts.push(request.modeInstruction.trim())
    }
    for (const instruction of request.contextInstructions ?? []) {
      if (instruction.trim()) systemParts.push(instruction.trim())
    }
    const messages: AnthropicMessage[] = []
    const windowSize = this.config.historyLimit
    const history = windowSize
      ? limitHistoryPreservingCompaction(request.history, windowSize)
      : request.history
    messages.push(...this.itemsToMessages([...request.prefix, ...history]))
    if (request.attachments?.length) {
      attachImagesToLatestUserMessage(messages, request.attachments)
    }
    if (request.attachmentTextFallbacks?.length) {
      attachTextFallbacksToLatestUserMessage(messages, request.attachmentTextFallbacks)
    }
    return {
      system: systemParts.join('\n\n'),
      messages
    }
  }

  private itemsToMessages(items: TurnItem[]): AnthropicMessage[] {
    const out: AnthropicMessage[] = []
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index]
      if (item?.kind === 'assistant_reasoning') {
        // Anthropic exposes reasoning via `thinking` content blocks or the
        // top-level `thinking` config. For history replay we drop standalone
        // reasoning items because the subsequent assistant_text carries the
        // final answer; reasoning is consumed as streaming deltas live.
        continue
      }
      if (item?.kind === 'tool_call') {
        const block = this.toolCallBlockToMessages(items, index)
        if (block) {
          out.push(...block.messages)
          index = block.nextIndex - 1
        }
        continue
      }
      if (item?.kind === 'tool_result') continue
      const message = this.itemToMessage(item)
      if (message) out.push(message)
    }
    return out
  }

  private toolCallBlockToMessages(
    items: TurnItem[],
    startIndex: number
  ): { messages: AnthropicMessage[]; nextIndex: number } | null {
    const calls: Extract<TurnItem, { kind: 'tool_call' }>[] = []
    let index = startIndex
    while (index < items.length && items[index]?.kind === 'tool_call') {
      calls.push(items[index] as Extract<TurnItem, { kind: 'tool_call' }>)
      index += 1
    }
    if (calls.length === 0) return null

    const turnId = calls[0]?.turnId ?? ''
    const expectedCallIds = new Set(calls.map((call) => call.callId))
    const seenResultIds = new Set<string>()
    const toolResultBlocks: AnthropicContentBlock[] = []
    const assistantTextParts: string[] = []
    let bridgeIndex = startIndex - 1
    while (bridgeIndex >= 0) {
      const item = items[bridgeIndex]
      if (!item || !this.isPreToolCallBridgeItem(item, turnId)) break
      if (item.kind === 'assistant_text' && item.text.trim()) {
        assistantTextParts.unshift(item.text)
      }
      bridgeIndex -= 1
    }
    let sawResult = false
    while (index < items.length) {
      const item = items[index]
      if (!item) break
      if (item.kind === 'tool_result') {
        sawResult = true
        if (expectedCallIds.has(item.callId) && !seenResultIds.has(item.callId)) {
          seenResultIds.add(item.callId)
          toolResultBlocks.push({
            type: 'tool_result',
            tool_use_id: item.callId,
            content: toolResultContent(item.output),
            is_error: item.isError
          })
        }
        index += 1
        continue
      }
      if (isToolResultBridgeItem(item, { turnId, sawResult })) {
        if (!sawResult && item.kind === 'assistant_text' && item.text.trim()) {
          assistantTextParts.push(item.text)
        }
        index += 1
        continue
      }
      break
    }

    if (![...expectedCallIds].every((callId) => seenResultIds.has(callId))) {
      return null
    }

    const assistantContent: AnthropicContentBlock[] = []
    if (assistantTextParts.length > 0) {
      assistantContent.push({ type: 'text', text: assistantTextParts.join('\n') })
    }
    for (const call of calls) {
      assistantContent.push({
        type: 'tool_use',
        id: call.callId,
        name: call.toolName,
        input: call.arguments
      })
    }

    return {
      messages: [
        { role: 'assistant', content: assistantContent },
        { role: 'user', content: toolResultBlocks }
      ],
      nextIndex: index
    }
  }

  private isPreToolCallBridgeItem(item: TurnItem, turnId: string): boolean {
    if (item.turnId !== turnId) return false
    return item.kind === 'assistant_text' || item.kind === 'assistant_reasoning'
  }

  private itemToMessage(item: TurnItem): AnthropicMessage | null {
    switch (item.kind) {
      case 'user_message':
        return { role: 'user', content: item.text }
      case 'assistant_text':
        return { role: 'assistant', content: [{ type: 'text', text: item.text }] }
      case 'tool_call':
        return {
          role: 'assistant',
          content: [
            {
              type: 'tool_use',
              id: item.callId,
              name: item.toolName,
              input: item.arguments
            }
          ]
        }
      case 'tool_result':
        return {
          role: 'user',
          content: [
            {
              type: 'tool_result',
              tool_use_id: item.callId,
              content: toolResultContent(item.output),
              is_error: item.isError
            }
          ]
        }
      case 'compaction':
        return item.replacedTokens > 0
          ? { role: 'user', content: `Conversation summary from earlier turns:\n${item.summary}` }
          : null
      case 'review':
        return item.status === 'completed' && item.reviewText?.trim()
          ? { role: 'user', content: `Code review result from an earlier turn:\n${item.reviewText}` }
          : null
      case 'assistant_reasoning':
      case 'approval':
      case 'user_input':
      case 'error':
        return null
    }
  }

  private async *streamSse(
    body: ReadableStream<Uint8Array>,
    signal: AbortSignal
  ): AsyncIterable<ModelStreamChunk> {
    const decoder = new TextDecoder('utf-8')
    const reader = body.getReader()
    let buffer = ''
    const pendingToolCalls = new Map<number, PendingToolCall>()
    let usage: UsageSnapshot | null = null
    let finishReason: string | null = null
    const idleTimeoutMs = normalizeStreamIdleTimeoutMs(this.config.streamIdleTimeoutMs)
    try {
      while (!signal.aborted) {
        const read = await readStreamChunk(reader, signal, idleTimeoutMs)
        if (read.kind === 'timeout') {
          yield {
            kind: 'error',
            message: `model stream stalled for ${idleTimeoutMs}ms without data`,
            code: 'stream_idle_timeout'
          }
          return
        }
        if (read.kind === 'aborted') break
        if (read.kind === 'error') {
          yield { kind: 'error', message: read.message, code: 'stream_read_error' }
          return
        }
        const { value, done } = read
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let eventBoundary: number
        while ((eventBoundary = buffer.indexOf('\n\n')) >= 0) {
          const frame = buffer.slice(0, eventBoundary)
          buffer = buffer.slice(eventBoundary + 2)
          const event = parseSseFrame(frame)
          if (!event) continue
          const result = this.consumeStreamEvent(event, pendingToolCalls)
          if (result.usage) usage = result.usage
          if (result.finishReason) finishReason = result.finishReason
          for (const chunk of result.chunks) yield chunk
        }
      }
    } finally {
      try {
        reader.releaseLock()
      } catch {
        // The stream may already be released; ignore.
      }
    }
    if (signal.aborted) {
      yield { kind: 'error', message: 'request was aborted' }
      return
    }
    if (usage) yield { kind: 'usage', usage }
    const stopReason: ModelStopReason = ((): ModelStopReason => {
      switch (finishReason) {
        case 'tool_use':
          return 'tool_calls'
        case 'max_tokens':
          return 'length'
        case 'error':
          return 'error'
        default:
          return 'stop'
      }
    })()
    yield { kind: 'completed', stopReason }
  }

  private consumeStreamEvent(
    event: AnthropicStreamEvent,
    pendingToolCalls: Map<number, PendingToolCall>
  ): {
    chunks: ModelStreamChunk[]
    finishReason: string | null
    usage: UsageSnapshot | null
  } {
    const chunks: ModelStreamChunk[] = []
    let finishReason: string | null = null
    let usage: UsageSnapshot | null = null

    switch (event.type) {
      case 'message_start': {
        if (event.message?.usage) {
          usage = this.mapUsage(event.message.usage)
        }
        break
      }
      case 'content_block_start': {
        const block = event.content_block
        if (block?.type === 'tool_use') {
          pendingToolCalls.set(event.index, {
            index: event.index,
            id: block.id,
            name: block.name,
            argumentsJson: ''
          })
        }
        break
      }
      case 'content_block_delta': {
        const delta = event.delta
        if (delta.type === 'text_delta' && delta.text) {
          chunks.push({ kind: 'assistant_text_delta', text: delta.text })
        } else if (delta.type === 'thinking_delta' && delta.thinking) {
          chunks.push({ kind: 'assistant_reasoning_delta', text: delta.thinking })
        } else if (delta.type === 'input_json_delta') {
          const pending = pendingToolCalls.get(event.index)
          if (pending) {
            pending.argumentsJson += delta.partial_json
            chunks.push({
              kind: 'tool_call_delta',
              callId: pending.id,
              toolName: pending.name,
              argumentsDelta: delta.partial_json
            })
          }
        }
        break
      }
      case 'content_block_stop': {
        const pending = pendingToolCalls.get(event.index)
        if (pending) {
          const args = this.parseToolArguments(pending.argumentsJson)
          chunks.push({
            kind: 'tool_call_complete',
            callId: pending.id,
            toolName: pending.name,
            arguments: args
          })
          pendingToolCalls.delete(event.index)
        }
        break
      }
      case 'message_delta': {
        if (event.delta?.stop_reason) {
          finishReason = event.delta.stop_reason
        }
        if (event.usage) {
          usage = this.mapUsage(event.usage)
        }
        break
      }
      case 'message_stop':
      case 'ping':
        break
    }

    return { chunks, finishReason, usage }
  }

  private *materializeNonStreaming(payload: AnthropicResponse): Generator<ModelStreamChunk> {
    if (!payload.content) {
      yield { kind: 'error', message: 'model response contained no content' }
      return
    }
    for (const block of payload.content) {
      if (block.type === 'text' && block.text) {
        yield { kind: 'assistant_text_delta', text: block.text }
      } else if (block.type === 'thinking' && block.thinking) {
        yield { kind: 'assistant_reasoning_delta', text: block.thinking }
      } else if (block.type === 'tool_use') {
        yield {
          kind: 'tool_call_complete',
          callId: block.id,
          toolName: block.name,
          arguments: block.input
        }
      }
    }
    if (payload.usage) {
      yield { kind: 'usage', usage: this.mapUsage(payload.usage) }
    }
    let stopReason: ModelStopReason = 'stop'
    if (payload.stop_reason === 'tool_use') stopReason = 'tool_calls'
    else if (payload.stop_reason === 'max_tokens') stopReason = 'length'
    yield { kind: 'completed', stopReason }
  }

  private mapUsage(usage: AnthropicUsage): UsageSnapshot {
    const promptTokens = Number(usage.input_tokens ?? 0) || 0
    const completionTokens = Number(usage.output_tokens ?? 0) || 0
    const cacheCreation = Number(usage.cache_creation_input_tokens ?? 0) || 0
    const cacheRead = Number(usage.cache_read_input_tokens ?? 0) || 0
    return {
      ...emptyUsageSnapshot(),
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      cacheHitTokens: cacheRead,
      cacheMissTokens: promptTokens - cacheRead,
      cachedTokens: cacheRead,
      turns: 1
    }
  }

  private parseToolArguments(raw: string): Record<string, unknown> {
    try {
      const trimmed = raw.trim()
      if (!trimmed) return {}
      return JSON.parse(trimmed) as Record<string, unknown>
    } catch {
      return {}
    }
  }
}

function normalizeToolSpecs(tools: ModelToolSpec[]): AnthropicToolSpec[] {
  return [...tools]
    .map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: canonicalizeSchema(tool.inputSchema)
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function canonicalizeSchema(value: unknown): Record<string, unknown> {
  const canonical = canonicalize(value)
  return canonical && typeof canonical === 'object' && !Array.isArray(canonical)
    ? (canonical as Record<string, unknown>)
    : {}
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (!value || typeof value !== 'object') return value
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    out[key] = canonicalize((value as Record<string, unknown>)[key])
  }
  return out
}

function toolResultContent(output: unknown): string {
  if (typeof output === 'string') return output
  return JSON.stringify(output) ?? ''
}

function limitHistoryPreservingCompaction(history: TurnItem[], windowSize: number): TurnItem[] {
  if (history.length <= windowSize) return history
  const windowStart = history.length - windowSize
  const limited = history.slice(windowStart)
  if (limited.some((item) => item.kind === 'compaction' && item.replacedTokens > 0)) {
    return limited
  }
  for (let index = windowStart - 1; index >= 0; index -= 1) {
    const item = history[index]
    if (item.kind !== 'compaction' || item.replacedTokens === 0) continue
    return windowSize <= 1 ? [item] : [item, ...history.slice(-(windowSize - 1))]
  }
  return limited
}

function attachImagesToLatestUserMessage(
  messages: AnthropicMessage[],
  attachments: NonNullable<ModelRequest['attachments']>
): void {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message.role !== 'user') continue
    const blocks: AnthropicContentBlock[] = []
    if (typeof message.content === 'string' && message.content) {
      blocks.push({ type: 'text', text: message.content })
    } else if (Array.isArray(message.content)) {
      blocks.push(...message.content)
    }
    for (const attachment of attachments) {
      blocks.push({
        type: 'image_url',
        image_url: {
          url: `data:${attachment.mimeType};base64,${attachment.dataBase64}`
        }
      } as unknown as AnthropicContentBlock)
    }
    message.content = blocks
    return
  }
}

function attachTextFallbacksToLatestUserMessage(
  messages: AnthropicMessage[],
  attachments: NonNullable<ModelRequest['attachmentTextFallbacks']>
): void {
  const text = attachments.map(formatAttachmentTextFallback).join('\n\n')
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message.role !== 'user') continue
    if (typeof message.content === 'string') {
      message.content = message.content ? `${message.content}\n\n${text}` : text
      return
    }
    if (Array.isArray(message.content)) {
      message.content.push({ type: 'text', text })
      return
    }
    message.content = text
    return
  }
}

function formatAttachmentTextFallback(
  attachment: NonNullable<ModelRequest['attachmentTextFallbacks']>[number]
): string {
  return [
    '[Attached image as base64 text]',
    `Name: ${attachment.name}`,
    `MIME: ${attachment.mimeType}`,
    `Dimensions: ${formatAttachmentDimensions(attachment)}`,
    `Bytes: ${attachment.byteSize}`,
    'Base64:',
    '```base64',
    attachment.dataBase64,
    '```',
    '[/Attached image]'
  ].join('\n')
}

function formatAttachmentDimensions(
  attachment: NonNullable<ModelRequest['attachmentTextFallbacks']>[number]
): string {
  return attachment.width && attachment.height ? `${attachment.width}x${attachment.height}` : 'unknown'
}

function parseSseFrame(frame: string): AnthropicStreamEvent | null {
  const lines = frame.split('\n')
  let eventType = ''
  let data = ''
  for (const line of lines) {
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      data = line.slice(5).trim()
    }
  }
  if (!data) return null
  try {
    const parsed = JSON.parse(data) as Record<string, unknown>
    parsed.type = eventType
    return parsed as AnthropicStreamEvent
  } catch {
    return null
  }
}

function normalizeStreamIdleTimeoutMs(value: number | undefined): number {
  if (value === undefined) return DEFAULT_STREAM_IDLE_TIMEOUT_MS
  if (!Number.isFinite(value)) return DEFAULT_STREAM_IDLE_TIMEOUT_MS
  return Math.max(0, Math.floor(value))
}

async function readStreamChunk(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  signal: AbortSignal,
  idleTimeoutMs: number
): Promise<StreamReadResult> {
  if (signal.aborted) return { kind: 'aborted' }
  let timeout: ReturnType<typeof setTimeout> | undefined
  let cleanupAbort: (() => void) | undefined
  const readPromise = reader
    .read()
    .then((result): StreamReadResult => ({ kind: 'chunk', ...result }))
    .catch((error): StreamReadResult => {
      if (signal.aborted) return { kind: 'aborted' }
      const message = error instanceof Error ? error.message : String(error)
      return { kind: 'error', message: `model stream read failed: ${message}` }
    })
  const abortPromise = new Promise<StreamReadResult>((resolve) => {
    const onAbort = (): void => resolve({ kind: 'aborted' })
    if (signal.aborted) {
      resolve({ kind: 'aborted' })
      return
    }
    signal.addEventListener('abort', onAbort, { once: true })
    cleanupAbort = () => signal.removeEventListener('abort', onAbort)
  })
  const candidates: Array<Promise<StreamReadResult>> = [readPromise, abortPromise]
  if (idleTimeoutMs > 0) {
    candidates.push(
      new Promise<StreamReadResult>((resolve) => {
        timeout = setTimeout(() => resolve({ kind: 'timeout' }), idleTimeoutMs)
      })
    )
  }
  const result = await Promise.race(candidates)
  if (timeout) clearTimeout(timeout)
  cleanupAbort?.()
  if (result.kind === 'timeout') {
    try {
      await reader.cancel('model stream idle timeout')
    } catch {
      // Best-effort cancellation; the caller will surface the timeout.
    }
  }
  return result
}

function isToolResultBridgeItem(
  item: TurnItem,
  context: { turnId: string; sawResult: boolean }
): boolean {
  if (item.turnId !== context.turnId) return false
  return item.kind === 'assistant_text' || item.kind === 'assistant_reasoning'
}
