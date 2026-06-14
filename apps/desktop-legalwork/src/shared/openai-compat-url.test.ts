import { describe, expect, it } from 'vitest'
import {
  upstreamOpenAiChatCompletionsUrl,
  upstreamOpenAiModelsUrl
} from './openai-compat-url'

describe('OpenAI-compatible provider URLs', () => {
  it('keeps Kimi Code under /coding/v1 for chat and model discovery', () => {
    expect(upstreamOpenAiChatCompletionsUrl('https://api.kimi.com/coding/v1')).toBe(
      'https://api.kimi.com/coding/v1/chat/completions'
    )
    expect(upstreamOpenAiModelsUrl('https://api.kimi.com/coding/v1')).toBe(
      'https://api.kimi.com/coding/v1/models'
    )
  })

  it('upgrades the Kimi Code Anthropic-style base to the OpenAI-compatible v1 path', () => {
    expect(upstreamOpenAiChatCompletionsUrl('https://api.kimi.com/coding/')).toBe(
      'https://api.kimi.com/coding/v1/chat/completions'
    )
  })
})
