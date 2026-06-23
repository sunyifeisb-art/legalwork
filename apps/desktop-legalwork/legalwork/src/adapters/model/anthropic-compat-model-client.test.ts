import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AnthropicCompatModelClient } from './anthropic-compat-model-client.js'
import type { ModelRequest, ModelToolSpec } from '../../ports/model-client.js'

function fakeAbortSignal(): AbortSignal {
  const controller = new AbortController()
  return controller.signal
}

function createClient(overrides?: {
  baseUrl?: string
  apiKey?: string
  model?: string
  fetchImpl?: typeof fetch
}): AnthropicCompatModelClient {
  return new AnthropicCompatModelClient({
    baseUrl: 'https://api.kimi.com/coding/',
    apiKey: 'sk-test',
    model: 'kimi-for-coding',
    fetchImpl: (overrides?.fetchImpl ?? vi.fn()) as typeof fetch,
    ...overrides
  })
}

function baseRequest(overrides?: Partial<ModelRequest>): ModelRequest {
  return {
    threadId: 't1',
    turnId: 'u1',
    model: 'kimi-for-coding',
    systemPrompt: 'You are a helpful assistant.',
    prefix: [],
    history: [],
    tools: [],
    abortSignal: fakeAbortSignal(),
    ...overrides
  }
}

function okJsonResponse(body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

function captureRequest(
  fetchImpl: ReturnType<typeof vi.fn>,
  request: ModelRequest
): Promise<Record<string, unknown>> {
  let resolveBody: (body: Record<string, unknown>) => void
  const bodyPromise = new Promise<Record<string, unknown>>((resolve) => {
    resolveBody = resolve
  })
  fetchImpl.mockImplementation((_url: string, init: RequestInit) => {
    resolveBody(JSON.parse(init.body as string) as Record<string, unknown>)
    return Promise.resolve(okJsonResponse({ id: 'msg_1', type: 'message', role: 'assistant', model: 'kimi-for-coding', content: [], stop_reason: 'end_turn', stop_sequence: null, usage: {} }))
  })
  const client = createClient({ fetchImpl: fetchImpl as unknown as typeof fetch })
  const consumePromise = (async () => {
    for await (const _ of client.stream(request)) {
      // consume
    }
  })()
  return Promise.all([bodyPromise, consumePromise]).then(([body]) => body)
}

function sseResponse(events: string[]): Response {
  const encoder = new TextEncoder()
  const sse = events.map((e) => `${e}\n\n`).join('')
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(sse))
        controller.close()
      }
    }),
    {
      status: 200,
      headers: { 'content-type': 'text/event-stream' }
    }
  )
}

describe('AnthropicCompatModelClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    ['https://api.kimi.com/coding/', 'https://api.kimi.com/coding/v1/messages'],
    ['https://api.kimi.com/coding/v1', 'https://api.kimi.com/coding/v1/messages'],
    ['https://api.kimi.com/coding/v1/messages', 'https://api.kimi.com/coding/v1/messages'],
    ['https://api.anthropic.com/v1', 'https://api.anthropic.com/v1/messages']
  ])('builds the messages endpoint from %s', async (baseUrl, expectedUrl) => {
    const fetchImpl = vi.fn().mockResolvedValue(
      okJsonResponse({
        id: 'msg_1',
        type: 'message',
        role: 'assistant',
        model: 'kimi-for-coding',
        content: [],
        stop_reason: 'end_turn',
        stop_sequence: null,
        usage: {}
      })
    )

    const client = createClient({ baseUrl, fetchImpl: fetchImpl as unknown as typeof fetch })
    for await (const _ of client.stream(baseRequest())) {
      // consume
    }

    expect(fetchImpl).toHaveBeenCalledWith(expectedUrl, expect.any(Object))
  })

  it('builds request body with system prompt extracted to top-level', async () => {
    const fetchImpl = vi.fn()
    const body = await captureRequest(fetchImpl, baseRequest({ history: [{ kind: 'user_message', id: '1', turnId: 'u1', threadId: 't1', role: 'user', status: 'completed', createdAt: '2024-01-01T00:00:00Z', text: 'Hello' }] }))

    expect(body.model).toBe('kimi-for-coding')
    expect(body.max_tokens).toBe(4096)
    expect(body.system).toBe('You are a helpful assistant.')
    expect(body.messages).toEqual([{ role: 'user', content: 'Hello' }])
    expect(body.stream).toBe(true)
  })

  it('merges multiple system sources into top-level system', async () => {
    const fetchImpl = vi.fn()
    const body = await captureRequest(
      fetchImpl,
      baseRequest({
        systemPrompt: 'Base system.',
        modeInstruction: 'Mode instruction.',
        contextInstructions: ['Context one.', 'Context two.']
      })
    )

    expect(body.system).toBe('Base system.\n\nMode instruction.\n\nContext one.\n\nContext two.')
  })

  it('maps tools to Anthropic format', async () => {
    const fetchImpl = vi.fn()
    const tools: ModelToolSpec[] = [
      {
        name: 'read_file',
        description: 'Read a file',
        inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] }
      }
    ]
    const body = await captureRequest(fetchImpl, baseRequest({ tools }))

    expect(body.tools).toEqual([
      {
        name: 'read_file',
        description: 'Read a file',
        input_schema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] }
      }
    ])
    expect(body.tool_choice).toEqual({ type: 'auto' })
  })

  it('streams text deltas', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        'event: message_start\ndata: {"type":"message_start","message":{"id":"msg_1","type":"message","role":"assistant","model":"kimi-for-coding","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":0}}}',
        'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" world"}}',
        'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}',
        'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":2}}',
        'event: message_stop\ndata: {"type":"message_stop"}'
      ])
    )

    const client = createClient({ fetchImpl })
    const chunks: { kind: string; text?: string }[] = []
    for await (const chunk of client.stream(baseRequest())) {
      chunks.push(chunk)
    }

    const textDeltas = chunks.filter((c) => c.kind === 'assistant_text_delta')
    expect(textDeltas.map((c) => c.text)).toEqual(['Hello', ' world'])
    expect(chunks.some((c) => c.kind === 'completed')).toBe(true)
  })

  it('maps Anthropic cache usage without negative misses', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        'event: message_start\ndata: {"type":"message_start","message":{"id":"msg_1","type":"message","role":"assistant","model":"kimi-for-coding","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":4,"output_tokens":0,"cache_read_input_tokens":10,"cache_creation_input_tokens":1}}}',
        'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Hello"}}',
        'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}',
        'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":2}}',
        'event: message_stop\ndata: {"type":"message_stop"}'
      ])
    )

    const client = createClient({ fetchImpl })
    const chunks: { kind: string; usage?: Record<string, unknown> }[] = []
    for await (const chunk of client.stream(baseRequest())) {
      chunks.push(chunk)
    }

    const usage = chunks.find((c) => c.kind === 'usage')?.usage
    expect(usage).toMatchObject({
      promptTokens: 15,
      completionTokens: 2,
      totalTokens: 17,
      cacheHitTokens: 10,
      cacheMissTokens: 5,
      cachedTokens: 10,
      cacheHitRate: 10 / 15
    })
  })

  it('streams thinking/reasoning deltas', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"thinking","thinking":""}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"thinking_delta","thinking":"Let me think"}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"signature_delta","signature":"sig"}}',
        'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}',
        'event: content_block_start\ndata: {"type":"content_block_start","index":1,"content_block":{"type":"text","text":""}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":1,"delta":{"type":"text_delta","text":"Answer"}}',
        'event: content_block_stop\ndata: {"type":"content_block_stop","index":1}',
        'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"}}',
        'event: message_stop\ndata: {"type":"message_stop"}'
      ])
    )

    const client = createClient({ fetchImpl })
    const chunks: { kind: string; text?: string }[] = []
    for await (const chunk of client.stream(baseRequest())) {
      chunks.push(chunk)
    }

    const reasoningDeltas = chunks.filter((c) => c.kind === 'assistant_reasoning_delta')
    expect(reasoningDeltas.map((c) => c.text)).toEqual(['Let me think'])
    const textDeltas = chunks.filter((c) => c.kind === 'assistant_text_delta')
    expect(textDeltas.map((c) => c.text)).toEqual(['Answer'])
  })

  it('streams tool calls and completes them', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      sseResponse([
        'event: content_block_start\ndata: {"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":"toolu_1","name":"read_file","input":{}}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"{\\"path\\":\\""}}',
        'event: content_block_delta\ndata: {"type":"content_block_delta","index":0,"delta":{"type":"input_json_delta","partial_json":"/tmp/test.txt\\"}"}}',
        'event: content_block_stop\ndata: {"type":"content_block_stop","index":0}',
        'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"tool_use"}}',
        'event: message_stop\ndata: {"type":"message_stop"}'
      ])
    )

    const client = createClient({ fetchImpl })
    const chunks: { kind: string; callId?: string; toolName?: string; argumentsDelta?: string; arguments?: Record<string, unknown> }[] = []
    for await (const chunk of client.stream(baseRequest())) {
      chunks.push(chunk)
    }

    const deltas = chunks.filter((c) => c.kind === 'tool_call_delta')
    expect(deltas).toHaveLength(2)
    expect(deltas[0]?.argumentsDelta).toBe('{"path":"')

    const complete = chunks.find((c) => c.kind === 'tool_call_complete')
    expect(complete).toBeDefined()
    expect(complete?.callId).toBe('toolu_1')
    expect(complete?.toolName).toBe('read_file')
    expect(complete?.arguments).toEqual({ path: '/tmp/test.txt' })

    const completed = chunks.find((c) => c.kind === 'completed') as { kind: 'completed'; stopReason: string } | undefined
    expect(completed?.stopReason).toBe('tool_calls')
  })

  it('handles non-streaming response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({
        id: 'msg_1',
        type: 'message',
        role: 'assistant',
        model: 'kimi-for-coding',
        content: [
          { type: 'text', text: 'Hello!' }
        ],
        stop_reason: 'end_turn',
        stop_sequence: null,
        usage: { input_tokens: 5, output_tokens: 2 }
      }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      })
    )

    const client = createClient({ fetchImpl })
    const chunks: { kind: string; text?: string }[] = []
    for await (const chunk of client.stream(baseRequest())) {
      chunks.push(chunk)
    }

    expect(chunks.some((c) => c.kind === 'assistant_text_delta' && c.text === 'Hello!')).toBe(true)
    expect(chunks.some((c) => c.kind === 'usage')).toBe(true)
    expect(chunks.some((c) => c.kind === 'completed')).toBe(true)
  })

  it('yields error on HTTP failure', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'Invalid API key' } }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      })
    )

    const client = createClient({ fetchImpl })
    const chunks: { kind: string; message?: string; code?: string }[] = []
    for await (const chunk of client.stream(baseRequest())) {
      chunks.push(chunk)
    }

    expect(chunks[0]?.kind).toBe('error')
    expect(chunks[0]?.code).toBe('http_401')
  })

  it('maps tool result turn items to Anthropic tool_result blocks', async () => {
    const fetchImpl = vi.fn()
    const body = await captureRequest(
      fetchImpl,
      baseRequest({
        history: [
          {
            kind: 'tool_call',
            id: '2',
            turnId: 'u1',
            threadId: 't1',
            role: 'assistant',
            status: 'completed',
            createdAt: '2024-01-01T00:00:00Z',
            toolName: 'read_file',
            callId: 'toolu_1',
            toolKind: 'tool_call',
            arguments: { path: '/tmp/test.txt' }
          },
          {
            kind: 'tool_result',
            id: '3',
            turnId: 'u1',
            threadId: 't1',
            role: 'tool',
            status: 'completed',
            createdAt: '2024-01-01T00:00:00Z',
            toolName: 'read_file',
            callId: 'toolu_1',
            toolKind: 'tool_call',
            output: 'file contents',
            isError: false
          }
        ]
      })
    )

    const messages = body.messages as Record<string, unknown>[]
    expect(messages).toHaveLength(2)
    expect(messages[0]?.role).toBe('assistant')
    const assistantContent = messages[0]?.content as Record<string, unknown>[]
    expect(assistantContent[0]).toEqual({ type: 'tool_use', id: 'toolu_1', name: 'read_file', input: { path: '/tmp/test.txt' } })

    expect(messages[1]?.role).toBe('user')
    const userContent = messages[1]?.content as Record<string, unknown>[]
    expect(userContent[0]).toEqual({ type: 'tool_result', tool_use_id: 'toolu_1', content: 'file contents', is_error: false })
  })
})
