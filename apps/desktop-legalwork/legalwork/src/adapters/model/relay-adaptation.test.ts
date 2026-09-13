import { describe, expect, it, vi } from 'vitest'
import { DeepseekCompatModelClient } from './deepseek-compat-model-client.js'
import { estimateDeepseekCost } from './deepseek-pricing.js'
import { modelCapabilitiesForModel } from '../../loop/model-context-profile.js'

function okChatResponse(): Response {
  return new Response(JSON.stringify({
    id: 'chatcmpl-1',
    model: 'deepseek-v4-flash',
    choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content: 'Hi' } }],
    usage: {}
  }), { status: 200, headers: { 'content-type': 'application/json' } })
}

function request(overrides: Record<string, unknown> = {}) {
  return {
    threadId: 'thread-1',
    turnId: 'turn-1',
    model: 'deepseek-v4-flash',
    systemPrompt: 'You are helpful.',
    prefix: [],
    history: [],
    tools: [],
    stream: false,
    abortSignal: new AbortController().signal,
    ...overrides
  } as never
}

describe('relay station adaptation', () => {
  it('does NOT inject thinking on a non-official relay host even with a deepseek model id', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okChatResponse())
    const client = new DeepseekCompatModelClient({
      baseUrl: 'https://relay.example.com/v1',
      apiKey: 'sk-relay',
      model: 'deepseek-v4-flash',
      endpointFormat: 'chat_completions',
      nonStreaming: true,
      fetchImpl: fetchImpl as unknown as typeof fetch
    })
    for await (const _ of client.stream(request())) { void _ }
    const body = JSON.parse(fetchImpl.mock.calls[0]?.[1]?.body as string) as Record<string, unknown>
    expect(body.model).toBe('deepseek-v4-flash')
    expect(body).not.toHaveProperty('thinking')
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://relay.example.com/v1/chat/completions',
      expect.anything()
    )
  })

  it('still injects thinking on the official DeepSeek host', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okChatResponse())
    const client = new DeepseekCompatModelClient({
      baseUrl: 'https://api.deepseek.com/beta',
      apiKey: 'sk-ds',
      model: 'deepseek-v4-flash',
      endpointFormat: 'chat_completions',
      nonStreaming: true,
      fetchImpl: fetchImpl as unknown as typeof fetch
    })
    for await (const _ of client.stream(request())) { void _ }
    const body = JSON.parse(fetchImpl.mock.calls[0]?.[1]?.body as string) as Record<string, unknown>
    expect(body.thinking).toEqual({ type: 'enabled' })
  })

  it('round-trips reasoning for the deepseek-flash API alias', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okChatResponse())
    const client = new DeepseekCompatModelClient({
      baseUrl: 'https://api.deepseek.com',
      apiKey: 'sk-ds',
      model: 'deepseek-flash',
      endpointFormat: 'chat_completions',
      nonStreaming: true,
      modelCapabilities: modelCapabilitiesForModel,
      fetchImpl: fetchImpl as unknown as typeof fetch
    })
    const historyReq = request({
      model: 'deepseek-flash',
      history: [{
        kind: 'assistant_reasoning',
        id: 'r1',
        turnId: 'turn-1',
        threadId: 'thread-1',
        role: 'assistant',
        status: 'completed',
        createdAt: '2026-01-01T00:00:00.000Z',
        text: '先核对材料。'
      }, {
        kind: 'assistant_text',
        id: 'a1',
        turnId: 'turn-1',
        threadId: 'thread-1',
        role: 'assistant',
        status: 'completed',
        createdAt: '2026-01-01T00:00:01.000Z',
        text: '材料已核对。'
      }]
    })

    for await (const _ of client.stream(historyReq)) { void _ }

    const body = JSON.parse(fetchImpl.mock.calls[0]?.[1]?.body as string) as Record<string, unknown>
    const assistantMessage = (body.messages as Array<Record<string, unknown>>)
      ?.find((message) => message.role === 'assistant')
    expect(body.thinking).toEqual({ type: 'enabled' })
    expect(assistantMessage?.reasoning_content).toBe('先核对材料。')
  })

  it('estimates no DeepSeek list price on a relay host', () => {
    const relay = estimateDeepseekCost({ model: 'deepseek-v4-flash', providerHost: 'https://relay.example.com/v1', cacheHitTokens: 0, cacheMissTokens: 1000, outputTokens: 100 })
    expect(relay).toBeNull()
    const official = estimateDeepseekCost({ model: 'deepseek-v4-flash', providerHost: 'https://api.deepseek.com', cacheHitTokens: 0, cacheMissTokens: 1000, outputTokens: 100 })
    expect(official).not.toBeNull()
    const noHost = estimateDeepseekCost({ model: 'deepseek-v4-flash', cacheHitTokens: 0, cacheMissTokens: 1000, outputTokens: 100 })
    expect(noHost).not.toBeNull()
    expect(estimateDeepseekCost({
      model: 'deepseek-flash',
      providerHost: 'https://api.deepseek.com',
      cacheHitTokens: 0,
      cacheMissTokens: 1000,
      outputTokens: 100
    })).not.toBeNull()
  })

  it('does not inject reasoning round-trip on a relay host even with modelCapabilities configured', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okChatResponse())
    const client = new DeepseekCompatModelClient({
      baseUrl: 'https://relay.example.com/v1',
      apiKey: 'sk-relay',
      model: 'deepseek-v4-flash',
      endpointFormat: 'chat_completions',
      nonStreaming: true,
      modelCapabilities: modelCapabilitiesForModel,
      fetchImpl: fetchImpl as unknown as typeof fetch
    })
    const historyReq = request({
      history: [{
        kind: 'assistant_text',
        id: 'a1',
        turnId: 'turn-1',
        threadId: 'thread-1',
        role: 'assistant',
        status: 'completed',
        createdAt: '2026-01-01T00:00:00.000Z',
        text: 'Done.'
      }]
    })
    for await (const _ of client.stream(historyReq)) { void _ }
    const body = JSON.parse(fetchImpl.mock.calls[0]?.[1]?.body as string) as Record<string, unknown>
    const assistantMessage = (body.messages as Array<Record<string, unknown>>)
      ?.find((m) => m.role === 'assistant')
    expect(assistantMessage).toBeDefined()
    expect(assistantMessage).not.toHaveProperty('reasoning_content')
    expect(body).not.toHaveProperty('thinking')
  })
})
