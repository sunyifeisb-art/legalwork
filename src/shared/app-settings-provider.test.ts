import { describe, expect, it } from 'vitest'
import {
  computeLegalworkRuntimeCredentialPatch,
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

describe('computeLegalworkRuntimeCredentialPatch', () => {
  it('inherits the active provider API key when the user edits the profile key', () => {
    const prev = settings()
    prev.agents.legalwork = {
      ...prev.agents.legalwork,
      providerId: 'kimi-code',
      model: 'kimi-for-coding',
      apiKey: ''
    }
    prev.provider.providers = prev.provider.providers.map((provider) =>
      provider.id === 'kimi-code'
        ? { ...provider, apiKey: 'sk-kimi-new', baseUrl: 'https://api.kimi.com/coding/v1' }
        : provider
    )

    const patch = computeLegalworkRuntimeCredentialPatch(prev, {
      provider: {
        providers: prev.provider.providers
      }
    })

    expect(patch.legalwork.apiKey).toBe('sk-kimi-new')
    expect(patch.legalwork.baseUrl).toBe('https://api.kimi.com/coding/v1')
  })

  it('inherits the active provider API key when the user switches provider', () => {
    const prev = settings()
    prev.agents.legalwork = {
      ...prev.agents.legalwork,
      providerId: 'deepseek',
      model: 'deepseek-v4-pro',
      apiKey: 'sk-deepseek'
    }
    prev.provider.providers = prev.provider.providers.map((provider) =>
      provider.id === 'kimi-code'
        ? { ...provider, apiKey: 'sk-kimi', baseUrl: 'https://api.kimi.com/coding/v1' }
        : provider
    )

    const patch = computeLegalworkRuntimeCredentialPatch(prev, {
      provider: {
        providers: prev.provider.providers
      },
      agents: {
        legalwork: {
          providerId: 'kimi-code',
          model: 'kimi-for-coding'
        }
      }
    })

    expect(patch.legalwork.apiKey).toBe('sk-kimi')
    expect(patch.legalwork.baseUrl).toBe('https://api.kimi.com/coding/v1')
    expect(patch.legalwork.providerId).toBe('kimi-code')
  })

  it('preserves a user-edited runtime API key override', () => {
    const prev = settings()
    prev.agents.legalwork = {
      ...prev.agents.legalwork,
      providerId: 'kimi-code',
      model: 'kimi-for-coding',
      apiKey: 'sk-runtime-override'
    }
    prev.provider.providers = prev.provider.providers.map((provider) =>
      provider.id === 'kimi-code'
        ? { ...provider, apiKey: 'sk-kimi' }
        : provider
    )

    const patch = computeLegalworkRuntimeCredentialPatch(prev, {
      agents: {
        legalwork: {
          apiKey: 'sk-runtime-override-edited'
        }
      }
    })

    expect(patch.legalwork.apiKey).toBe('sk-runtime-override-edited')
  })

  it('does not overwrite the runtime key when the active provider key is empty and the user did not edit it', () => {
    const prev = settings()
    prev.agents.legalwork = {
      ...prev.agents.legalwork,
      providerId: 'kimi-code',
      model: 'kimi-for-coding',
      apiKey: 'sk-kimi'
    }
    prev.provider.providers = prev.provider.providers.map((provider) =>
      provider.id === 'kimi-code'
        ? { ...provider, apiKey: '' }
        : provider
    )

    const patch = computeLegalworkRuntimeCredentialPatch(prev, {
      provider: {
        providers: prev.provider.providers
      }
    })

    expect(patch.legalwork.apiKey).toBeUndefined()
  })

  it('inherits the active provider key when the renderer sends the full snapshot unchanged', () => {
    const prev = settings()
    prev.agents.legalwork = {
      ...prev.agents.legalwork,
      providerId: 'kimi-code',
      model: 'kimi-for-coding',
      apiKey: 'sk-kimi-old'
    }
    prev.provider.providers = prev.provider.providers.map((provider) =>
      provider.id === 'kimi-code'
        ? { ...provider, apiKey: 'sk-kimi-new', baseUrl: 'https://api.kimi.com/coding/v1' }
        : provider
    )

    // SettingsView sends the whole settings object, so agents.legalwork.apiKey is
    // present but unchanged from prev. We should still inherit the new profile key.
    const patch = computeLegalworkRuntimeCredentialPatch(prev, {
      provider: {
        providers: prev.provider.providers
      },
      agents: {
        legalwork: prev.agents.legalwork
      }
    })

    expect(patch.legalwork.apiKey).toBe('sk-kimi-new')
    expect(patch.legalwork.baseUrl).toBe('https://api.kimi.com/coding/v1')
  })
})
