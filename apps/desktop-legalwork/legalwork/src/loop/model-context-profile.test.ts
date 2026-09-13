import { describe, expect, it } from 'vitest'
import {
  modelCapabilitiesForModel,
  contextThresholdsForModel,
  modelContextProfilesFromConfig,
  resolveModelContextProfile
} from './model-context-profile.js'

describe('model context profiles', () => {
  it('uses nearly the full advertised DeepSeek 1M window before compacting', () => {
    expect(modelCapabilitiesForModel('deepseek-v4-flash')).toMatchObject({
      contextWindowTokens: 1_000_000
    })
    expect(contextThresholdsForModel('provider/deepseek-v4-flash')).toEqual({
      softThreshold: 900_000,
      hardThreshold: 950_000
    })
    expect(modelCapabilitiesForModel('deepseek-flash')).toMatchObject({
      contextWindowTokens: 1_000_000
    })
    expect(resolveModelContextProfile('deepseek-v4-flash')?.canonicalModel).toBe('deepseek-flash')
  })

  it('merges a persisted legacy v4 flash profile into the current canonical profile', () => {
    const profiles = modelContextProfilesFromConfig({
      profiles: {
        'deepseek-v4-flash': {
          contextWindowTokens: 1_000_000,
          contextCompaction: {
            softThreshold: 880_000,
            hardThreshold: 930_000
          }
        }
      }
    })
    const profile = resolveModelContextProfile('deepseek-flash', profiles)
    expect(profile).toMatchObject({
      canonicalModel: 'deepseek-flash',
      softThreshold: 880_000,
      hardThreshold: 930_000
    })
  })

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

  it('declares MiMo V2.5 profiles with text and image input variants', () => {
    expect(modelCapabilitiesForModel('mimo-v2.5-pro')).toMatchObject({
      id: 'mimo-v2.5-pro',
      contextWindowTokens: 128_000,
      inputModalities: ['text'],
      outputModalities: ['text'],
      supportsToolCalling: true,
      messageParts: ['text'],
      reasoning: {
        supportedEfforts: ['off', 'low', 'medium', 'high'],
        defaultEffort: 'medium',
        requestProtocol: 'mimo-chat-completions'
      }
    })

    expect(modelCapabilitiesForModel('mimo-v2.5')).toMatchObject({
      id: 'mimo-v2.5',
      contextWindowTokens: 128_000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
      supportsToolCalling: true,
      messageParts: ['text', 'image_url']
    })

    expect(contextThresholdsForModel('mimo-v2.5-pro')).toEqual({
      softThreshold: 125_440,
      hardThreshold: 126_720
    })
  })

  it('declares LongCat 2.0 as a 1M text tool-calling profile', () => {
    expect(modelCapabilitiesForModel('LongCat-2.0')).toMatchObject({
      id: 'LongCat-2.0',
      contextWindowTokens: 1_000_000,
      inputModalities: ['text'],
      outputModalities: ['text'],
      supportsToolCalling: true,
      messageParts: ['text']
    })

    expect(contextThresholdsForModel('LongCat-2.0')).toEqual({
      softThreshold: 980_000,
      hardThreshold: 990_000
    })
  })
})
