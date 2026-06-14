import { describe, expect, it } from 'vitest'
import { modelCapabilitiesForModel, contextThresholdsForModel } from './model-context-profile.js'

describe('model context profiles', () => {
  it('declares Kimi Code capabilities from the official coding endpoint profile', () => {
    expect(modelCapabilitiesForModel('kimi-for-coding')).toMatchObject({
      id: 'kimi-for-coding',
      contextWindowTokens: 262_144,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
      supportsToolCalling: true,
      messageParts: ['text', 'image_url'],
      reasoning: {
        supportedEfforts: ['off', 'low', 'medium', 'high'],
        defaultEffort: 'medium',
        requestProtocol: 'openai-chat-completions'
      }
    })

    expect(contextThresholdsForModel('kimi-for-coding')).toEqual({
      softThreshold: 245_760,
      hardThreshold: 258_048
    })
  })
})
