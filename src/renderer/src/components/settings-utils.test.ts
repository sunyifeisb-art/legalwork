import { describe, expect, it } from 'vitest'
import {
  BUILTIN_MODEL_PROVIDER_PRESETS,
  DEFAULT_MODEL_PROVIDER_ID,
  defaultClawSettings,
  defaultKeyboardShortcuts,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  type AppSettingsV1
} from '@shared/app-settings'
import { mergeSettings } from './settings-utils'

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
    }
  )
})
