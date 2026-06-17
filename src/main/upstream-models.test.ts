import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mkdtempSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  defaultClawSettings,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  defaultKeyboardShortcuts,
  type AppSettingsV1
} from '../shared/app-settings'
import { fetchUpstreamModelIds, readConfiguredLegalworkModelIds } from './upstream-models'

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
      'deepseek-v4-flash',
      'settings-model',
      'legacy-model',
      'custom-model',
      'vendor/custom-model'
    ]))
  })

  it('falls back to configured model ids when upstream cannot be queried', async () => {
    const dataDir = mkdtempSync(join(tmpdir(), 'legalwork-models-'))
    await mkdir(dataDir, { recursive: true })
    await writeFile(
      join(dataDir, 'config.json'),
      JSON.stringify({
        models: {
          profiles: {
            'deepseek-v4-flash': {
              aliases: ['deepseek-chat', 'deepseek-reasoner']
            }
          }
        }
      }),
      'utf8'
    )
    const result = await fetchUpstreamModelIds(settings(dataDir, 'local-only-model'), '')

    expect(result).toMatchObject({ ok: true })
    if (result.ok) {
      expect(result.modelIds).toContain('local-only-model')
      expect(result.modelIds).toContain('custom-provider-model')
      expect(result.modelIds).not.toContain('deepseek-v4-pro')
      expect(result.modelIds).not.toContain('gpt-4o')
      expect(result.modelGroups).toEqual(expect.arrayContaining([
        expect.objectContaining({
          providerId: 'custom-provider',
          label: 'Custom Provider',
          modelIds: expect.arrayContaining(['custom-provider-model'])
        }),
        expect.objectContaining({
          providerId: 'deepseek',
          label: 'DeepSeek',
          modelIds: expect.arrayContaining(['deepseek-chat', 'deepseek-reasoner'])
        })
      ]))
    }
  })
})
