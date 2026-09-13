import { describe, expect, it } from 'vitest'
import {
  BUILTIN_MODEL_PROVIDER_PRESETS,
  DEFAULT_MODEL_PROVIDER_ID,
  defaultClawSettings,
  defaultKeyboardShortcuts,
  defaultLearningIterationSettings,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  type AppSettingsV1
} from '@shared/app-settings'
import {
  getCodexQuotaRemainingPercent,
  mergeSettings,
  selectModelProviderPatch,
  updateModelProviderBaseUrlPatch,
  updateModelProviderProfilePatch
} from './settings-utils'

function settings(providerId: string, model: string): AppSettingsV1 {
  const provider = defaultModelProviderSettings()
  return {
    version: 1,
    locale: 'en',
    theme: 'system',
    uiFontScale: 'small',
    provider,
    agents: {
      legalwork: {
        ...defaultLegalworkRuntimeSettings(),
        providerId,
        model,
        apiKey: ''
      }
    },
    workspaceRoot: '/tmp/workspace',
    log: { enabled: false, retentionDays: 7 },
    notifications: { turnComplete: true },
    appBehavior: { openAtLogin: false, startMinimized: false, closeToTray: false },
    keyboardShortcuts: defaultKeyboardShortcuts(),
    write: defaultWriteSettings(),
    claw: defaultClawSettings(),
    schedule: defaultScheduleSettings(),
    learningIteration: defaultLearningIterationSettings(),
    guiUpdate: { channel: 'stable' }
  }
}

describe('mergeSettings', () => {
  it.each(BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) => [preset.id, preset.models[0], preset.baseUrl] as const))(
    'keeps the Legalwork runtime key in sync when editing the active %s provider key',
    (providerId, model, baseUrl) => {
    const current = settings(providerId, model)
    const apiKey = `sk-${providerId}-test`
    const providers = current.provider.providers.map((provider) =>
      provider.id === providerId
        ? { ...provider, apiKey, baseUrl }
        : provider
    )

    const merged = mergeSettings(current, {
      provider: providerId === DEFAULT_MODEL_PROVIDER_ID
        ? { apiKey, baseUrl, providers }
        : { providers }
    })

    expect(merged.provider.providers.find((provider) => provider.id === providerId)?.apiKey).toBe(apiKey)
    expect(merged.agents.legalwork.apiKey).toBe(apiKey)
    expect(merged.agents.legalwork.baseUrl).toBe(baseUrl)
    expect(merged.agents.legalwork.endpointFormat).toBe(
      merged.provider.providers.find((provider) => provider.id === providerId)?.endpointFormat
    )
    }
  )
})

describe('model provider settings helpers', () => {
  it('switches provider and keeps the Legalwork runtime aligned with that provider', () => {
    let current = settings('deepseek', 'deepseek-chat')
    current = mergeSettings(current, updateModelProviderProfilePatch(current, 'claude', {
      apiKey: 'sk-ant-test'
    }))

    const merged = mergeSettings(current, selectModelProviderPatch(current, 'claude'))
    const claudeProvider = merged.provider.providers.find((provider) => provider.id === 'claude')

    expect(merged.agents.legalwork.providerId).toBe('claude')
    expect(merged.agents.legalwork.model).toBe(claudeProvider?.models[0])
    expect(merged.agents.legalwork.apiKey).toBe('sk-ant-test')
    expect(merged.agents.legalwork.baseUrl).toBe('https://api.anthropic.com/v1')
    expect(merged.agents.legalwork.endpointFormat).toBe('messages')
  })

  it('auto-detects the protocol when the base URL changes and no manual override exists', () => {
    const current = settings('deepseek', 'deepseek-chat')
    const merged = mergeSettings(
      current,
      updateModelProviderBaseUrlPatch(current, 'deepseek', 'https://api.anthropic.com/v1')
    )

    expect(merged.provider.providers.find((provider) => provider.id === 'deepseek')?.endpointFormat).toBe('messages')
    expect(merged.agents.legalwork.endpointFormat).toBe('messages')
  })

  it('preserves a manually selected protocol when the base URL changes', () => {
    let current = settings('deepseek', 'deepseek-chat')
    current = mergeSettings(current, updateModelProviderProfilePatch(current, 'deepseek', {
      endpointFormat: 'responses'
    }))

    const merged = mergeSettings(
      current,
      updateModelProviderBaseUrlPatch(current, 'deepseek', 'https://api.anthropic.com/v1')
    )

    expect(merged.provider.providers.find((provider) => provider.id === 'deepseek')?.endpointFormat).toBe('responses')
    expect(merged.agents.legalwork.endpointFormat).toBe('responses')
  })
})

describe('getCodexQuotaRemainingPercent', () => {
  it('converts used quota into remaining quota', () => {
    expect(getCodexQuotaRemainingPercent(39)).toBe(61)
    expect(getCodexQuotaRemainingPercent(73.25)).toBe(26.75)
  })

  it('keeps the remaining percentage within the quota range', () => {
    expect(getCodexQuotaRemainingPercent(-5)).toBe(100)
    expect(getCodexQuotaRemainingPercent(130)).toBe(0)
  })
})
