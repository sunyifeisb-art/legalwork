import { describe, expect, it } from 'vitest'
import {
  defaultClawSettings,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  defaultKeyboardShortcuts,
  resolveLegalworkRuntimeSettings,
  type AppSettingsV1
} from './app-settings'

function settings(): AppSettingsV1 {
  return {
    version: 1,
    locale: 'en',
    theme: 'system',
    uiFontScale: 'small',
    provider: {
      ...defaultModelProviderSettings(),
      providers: [
        ...defaultModelProviderSettings().providers,
        {
          id: 'custom',
          name: 'Custom Provider',
          apiKey: 'sk-custom',
          baseUrl: 'https://custom.example/v1',
          models: ['custom-model']
        }
      ]
    },
    agents: {
      legalwork: {
        ...defaultLegalworkRuntimeSettings(),
        providerId: 'custom',
        model: 'custom-model'
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

describe('model provider settings', () => {
  it('resolves Legalwork runtime credentials from the selected provider', () => {
    const runtime = resolveLegalworkRuntimeSettings(settings())

    expect(runtime.apiKey).toBe('sk-custom')
    expect(runtime.baseUrl).toBe('https://custom.example/v1')
  })

  it('resolves Kimi Code with its OpenAI-compatible endpoint format', () => {
    const base = settings()
    base.provider.providers = base.provider.providers.map((provider) =>
      provider.id === 'kimi-code'
        ? { ...provider, apiKey: 'sk-kimi' }
        : provider
    )
    base.agents.legalwork = {
      ...base.agents.legalwork,
      providerId: 'kimi-code',
      model: 'kimi-for-coding'
    }

    const runtime = resolveLegalworkRuntimeSettings(base)

    expect(runtime.apiKey).toBe('sk-kimi')
    expect(runtime.baseUrl).toBe('https://api.kimi.com/coding/v1')
    expect(runtime.endpointFormat).toBe('chat_completions')
  })
})
