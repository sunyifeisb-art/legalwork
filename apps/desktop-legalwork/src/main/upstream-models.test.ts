import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtempSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  defaultClawSettings,
  defaultLegalworkRuntimeSettings,
  defaultLearningIterationSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  defaultKeyboardShortcuts,
  type AppSettingsV1
} from '../shared/app-settings'
import {
  fetchUpstreamModelIds,
  isSelectableConversationModel,
  readConfiguredLegalworkModelIds
} from './upstream-models'

afterEach(() => {
  vi.unstubAllGlobals()
})

function settings(dataDir: string, model = 'settings-model'): AppSettingsV1 {
  const provider = defaultModelProviderSettings()
  return {
    version: 1,
    locale: 'en',
    theme: 'system',
    uiFontScale: 'small',
    provider: {
      ...provider,
      providers: [
        ...provider.providers,
        {
          id: 'custom-provider',
          name: 'Custom Provider',
          apiKey: 'sk-custom',
          baseUrl: 'https://custom.example/v1',
          models: ['custom-provider-model']
        }
      ]
    },
    agents: {
      legalwork: {
        ...defaultLegalworkRuntimeSettings(),
        dataDir,
        model,
        providerId: 'custom-provider'
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

describe('upstream model picker list', () => {
  it('includes Legalwork config model profiles, aliases, and the configured agent model', async () => {
    const dataDir = mkdtempSync(join(tmpdir(), 'legalwork-models-'))
    await mkdir(dataDir, { recursive: true })
    await writeFile(
      join(dataDir, 'config.json'),
      JSON.stringify({
        contextCompaction: {
          modelProfiles: {
            'legacy-model': {}
          }
        },
        models: {
          profiles: {
            'custom-model': {
              aliases: ['vendor/custom-model']
            }
          }
        }
      }),
      'utf8'
    )

    const ids = await readConfiguredLegalworkModelIds(settings(dataDir))

    expect(ids).toEqual(expect.arrayContaining([
      'auto',
      'deepseek-v4-pro',
      'deepseek-flash',
      'settings-model',
      'legacy-model',
      'custom-model',
      'vendor/custom-model'
    ]))
  })

  it('lists only dynamically fetched models from providers with working API keys', async () => {
    const dataDir = mkdtempSync(join(tmpdir(), 'legalwork-models-'))
    await mkdir(dataDir, { recursive: true })
    const configured = settings(dataDir, 'local-only-model')
    configured.provider.providers.push({
      id: 'expired-provider',
      name: 'Expired Provider',
      apiKey: 'sk-expired',
      baseUrl: 'https://expired.example/v1',
      endpointFormat: 'chat_completions',
      models: ['stale-expired-model']
    })
    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      if (url.includes('expired.example')) {
        return new Response(JSON.stringify({ error: { message: 'membership expired' } }), {
          status: 402,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      return new Response(JSON.stringify({
        data: [
          { id: 'vendor-chat-latest' },
          { id: 'vendor-chat-2026-07-01' },
          { id: 'text-embedding-3-large' }
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }))

    const result = await fetchUpstreamModelIds(configured)

    expect(result).toMatchObject({ ok: true })
    if (result.ok) {
      expect(result.modelIds).toEqual(['auto', 'vendor-chat-2026-07-01', 'vendor-chat-latest'])
      expect(result.modelGroups).toEqual([{
        providerId: 'custom-provider',
        label: 'Custom Provider',
        modelIds: ['vendor-chat-2026-07-01', 'vendor-chat-latest']
      }])
    }
  })

  it('does not expose manually configured models when no provider API key can be queried', async () => {
    const configured = settings(mkdtempSync(join(tmpdir(), 'legalwork-models-')))
    configured.provider.providers = configured.provider.providers.map((provider) => ({
      ...provider,
      apiKey: ''
    }))

    const result = await fetchUpstreamModelIds(configured)

    expect(result).toEqual({ ok: false, message: 'No model provider API keys are configured.' })
  })

  it('filters capability-only model families without maintaining version allowlists', () => {
    expect(isSelectableConversationModel('gpt-5.2-2026-06-30')).toBe(true)
    expect(isSelectableConversationModel('glm-5.2')).toBe(true)
    expect(isSelectableConversationModel('kimi-k2.7-code')).toBe(true)
    expect(isSelectableConversationModel('text-embedding-3-large')).toBe(false)
    expect(isSelectableConversationModel('gpt-image-1')).toBe(false)
    expect(isSelectableConversationModel('gpt-4o-realtime-preview')).toBe(false)
  })
})
