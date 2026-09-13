import { describe, expect, it } from 'vitest'
import {
  BUILTIN_MODEL_PROVIDER_PRESETS,
  computeLegalworkRuntimeCredentialPatch,
  defaultClawSettings,
  defaultLearningIterationSettings,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  defaultKeyboardShortcuts,
  normalizeModelProviderSettings,
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
    learningIteration: defaultLearningIterationSettings(),
    guiUpdate: { channel: 'stable' }
  }
}

describe('model provider settings', () => {
  it('migrates legacy DeepSeek flash aliases out of the normal provider model list', () => {
    const provider = normalizeModelProviderSettings({
      providers: [{
        id: 'deepseek',
        name: 'DeepSeek',
        apiKey: 'sk-test',
        baseUrl: 'https://api.deepseek.com',
        endpointFormat: 'chat_completions',
        models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-v4-flash', 'deepseek-v4-pro']
      }]
    })

    expect(provider.providers.find((item) => item.id === 'deepseek')?.models).toEqual([
      'deepseek-flash',
      'deepseek-v4-pro'
    ])
  })

  it('resolves Legalwork runtime credentials from the selected provider', () => {
    const runtime = resolveLegalworkRuntimeSettings(settings())

    expect(runtime.apiKey).toBe('sk-custom')
    expect(runtime.baseUrl).toBe('https://custom.example/v1')
  })

  it('defaults Legalwork file access to the whole computer', () => {
    const runtime = resolveLegalworkRuntimeSettings(settings())

    expect(runtime.restrictFileAccessToWorkspace).toBe(false)
    expect(runtime.sandboxMode).toBe('danger-full-access')
  })

  it('restricts file access only when the explicit project-files switch is on', () => {
    const base = settings()
    base.agents.legalwork = {
      ...base.agents.legalwork,
      restrictFileAccessToWorkspace: true,
      sandboxMode: 'workspace-write'
    }

    const runtime = resolveLegalworkRuntimeSettings(base)

    expect(runtime.restrictFileAccessToWorkspace).toBe(true)
    expect(runtime.sandboxMode).toBe('workspace-write')
  })

  it('ignores legacy workspace sandbox values when the explicit switch is absent', () => {
    const base = settings()
    base.agents.legalwork = {
      ...base.agents.legalwork,
      restrictFileAccessToWorkspace: false,
      sandboxMode: 'workspace-write'
    }

    const runtime = resolveLegalworkRuntimeSettings(base)

    expect(runtime.restrictFileAccessToWorkspace).toBe(false)
    expect(runtime.sandboxMode).toBe('danger-full-access')
  })

  it('resolves Kimi Code with its Anthropic-compatible endpoint format', () => {
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
    expect(runtime.endpointFormat).toBe('messages')
  })

  it('migrates the official OpenAI provider to Responses for reasoning summaries', () => {
    const base = settings()
    base.provider.providers = base.provider.providers.map((provider) =>
      provider.id === 'openai'
        ? { ...provider, apiKey: 'sk-openai', endpointFormat: 'chat_completions' }
        : provider
    )
    base.agents.legalwork = {
      ...base.agents.legalwork,
      providerId: 'openai',
      model: 'o3-mini',
      endpointFormat: 'chat_completions'
    }

    const runtime = resolveLegalworkRuntimeSettings(base)

    expect(runtime.baseUrl).toBe('https://api.openai.com/v1')
    expect(runtime.endpointFormat).toBe('responses')
  })

  it.each([
    ['mimo', 'mimo-v2.5-pro', 'https://api.xiaomimimo.com/v1'],
    ['longcat', 'LongCat-2.0', 'https://api.longcat.chat/openai/v1']
  ] as const)('resolves the built-in %s provider profile', (providerId, model, baseUrl) => {
    const base = settings()
    base.provider.providers = base.provider.providers.map((provider) =>
      provider.id === providerId
        ? { ...provider, apiKey: `sk-${providerId}` }
        : provider
    )
    base.agents.legalwork = {
      ...base.agents.legalwork,
      providerId,
      model
    }

    const runtime = resolveLegalworkRuntimeSettings(base)
    const preset = BUILTIN_MODEL_PROVIDER_PRESETS.find((item) => item.id === providerId)

    expect(preset?.models).toContain(model)
    expect(runtime.apiKey).toBe(`sk-${providerId}`)
    expect(runtime.baseUrl).toBe(baseUrl)
    expect(runtime.endpointFormat).toBe('chat_completions')
  })

  it('resolves endpoint format from a custom provider profile', () => {
    const base = settings()
    base.provider.providers.push({
      id: 'custom-messages',
      name: 'Custom Messages',
      apiKey: 'sk-messages',
      baseUrl: 'https://api.kimi.com/coding/',
      endpointFormat: 'messages',
      models: ['kimi-for-coding']
    })
    base.agents.legalwork = {
      ...base.agents.legalwork,
      providerId: 'custom-messages',
      model: 'kimi-for-coding'
    }

    const runtime = resolveLegalworkRuntimeSettings(base)

    expect(runtime.baseUrl).toBe('https://api.kimi.com/coding/')
    expect(runtime.endpointFormat).toBe('messages')
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
    expect(patch.legalwork.endpointFormat).toBe('messages')
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
