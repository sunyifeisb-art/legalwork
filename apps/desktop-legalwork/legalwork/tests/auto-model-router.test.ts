import { describe, expect, it } from 'vitest'
import {
  autoModelHeuristic,
  parseAutoRouteRecommendation,
  recentAutoRouterContext,
  resolveAutoModelRoute
} from '../src/loop/auto-model-router.js'
import { makeAssistantTextItem, makeToolResultItem, makeUserItem } from '../src/domain/item.js'
import type { ModelClient, ModelRequest, ModelStreamChunk } from '../src/ports/model-client.js'

describe('auto model router', () => {
  it('parses trusted router model recommendations', () => {
    expect(parseAutoRouteRecommendation('{"model":"pro","thinking":"max"}')).toEqual({
      model: 'deepseek-v4-pro',
      reasoningEffort: 'max'
    })
    expect(parseAutoRouteRecommendation('noise {"model":"v4-flash"} tail')).toEqual({
      model: 'deepseek-flash'
    })
    expect(parseAutoRouteRecommendation('{"model":"auto"}')).toBeNull()
    expect(parseAutoRouteRecommendation('not json')).toBeNull()
  })

  it('defaults to flash unless input is strongly complex AND long', () => {
    expect(autoModelHeuristic('hello')).toBe('deepseek-flash')
    // Strong complex keyword alone is not enough (short input).
    expect(autoModelHeuristic('please debug this failing migration')).toBe('deepseek-flash')
    // Long but not strongly complex (e.g. a legal question) stays on flash.
    expect(autoModelHeuristic('x'.repeat(501))).toBe('deepseek-flash')
    // Strong signal + clearly long input routes to pro.
    expect(autoModelHeuristic(`${'x'.repeat(850)} debug the architecture migration`)).toBe('deepseek-v4-pro')
    // Chinese strong signal + long input.
    expect(autoModelHeuristic(`${'x'.repeat(850)} 重构整个项目的架构设计`)).toBe('deepseek-v4-pro')
  })

  it('builds recent context without the active turn', () => {
    const items = [
      makeUserItem({ id: 'u1', threadId: 'thr_1', turnId: 'turn_1', text: 'hello' }),
      makeAssistantTextItem({ id: 'a1', threadId: 'thr_1', turnId: 'turn_1', text: 'hi', status: 'completed' }),
      makeToolResultItem({
        id: 'r1',
        threadId: 'thr_1',
        turnId: 'turn_2',
        callId: 'call_1',
        toolName: 'read',
        output: 'file content'
      }),
      makeUserItem({ id: 'u2', threadId: 'thr_1', turnId: 'turn_3', text: 'latest' })
    ]

    expect(recentAutoRouterContext(items, 'turn_3')).toContain('user: hello')
    expect(recentAutoRouterContext(items, 'turn_3')).toContain('assistant: hi')
    expect(recentAutoRouterContext(items, 'turn_3')).toContain('tool: [tool result] file content')
    expect(recentAutoRouterContext(items, 'turn_3')).not.toContain('latest')
  })

  it('uses the short JSON response path without advertising tools', async () => {
    let seenRequest: ModelRequest | null = null
    const modelClient: ModelClient = {
      provider: 'fake',
      model: 'fake',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        seenRequest = request
        yield { kind: 'assistant_text_delta', text: '{"model":"deepseek-v4-flash","thinking":"off"}' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }

    await resolveAutoModelRoute({
      modelClient,
      threadId: 'thr_1',
      turnId: 'turn_1',
      latestRequest: 'hello',
      recentContext: '',
      selectedModelMode: 'auto',
      abortSignal: new AbortController().signal
    })

    const capturedRequest = seenRequest as ModelRequest | null
    expect(capturedRequest?.tools).toEqual([])
    expect(capturedRequest?.responseFormat).toBe('json_object')
  })
})
