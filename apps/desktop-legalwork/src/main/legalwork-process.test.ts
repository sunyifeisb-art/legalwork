import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { createServer, type AddressInfo } from 'node:net'
import { homedir, tmpdir } from 'node:os'
import { delimiter, join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureLogger } from './logger'
import {
  defaultClawSettings,
  defaultKeyboardShortcuts,
  defaultLegalworkRuntimeSettings,
  defaultLearningIterationSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  type AppSettingsV1
} from '../shared/app-settings'
import { LegalworkConfigSchema } from '../../legalwork/src/config/legalwork-config.js'

vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    getAppPath: () => '/tmp/legalwork-test-app',
    getPath: () => '/tmp/legalwork-test-user-data'
  }
}))

let tempRoot: string | null = null

function createSettings(binaryPath: string, port = 8899): AppSettingsV1 {
  return {
    version: 1,
    locale: 'en',
    theme: 'system',
    uiFontScale: 'small',
    provider: defaultModelProviderSettings(),
    agents: {
      legalwork: {
        ...defaultLegalworkRuntimeSettings(port),
        binaryPath,
        autoStart: true,
        dataDir: join(tempRoot ?? tmpdir(), 'runtime-data')
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

function writeScript(name: string, content: string): string {
  if (!tempRoot) throw new Error('temp root not initialized')
  const path = join(tempRoot, name)
  writeFileSync(path, content, 'utf8')
  return path
}

async function findFreeTcpPort(): Promise<number> {
  const server = createServer()
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })
  const address = server.address() as AddressInfo
  const port = address.port
  await new Promise<void>((resolve) => server.close(() => resolve()))
  return port
}

async function readLegalworkLog(): Promise<string> {
  if (!tempRoot) throw new Error('temp root not initialized')
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const logFile = readdirSync(tempRoot).find((entry) => entry.startsWith('legalwork-') && entry.endsWith('.log'))
    if (logFile) return readFileSync(join(tempRoot, logFile), 'utf8')
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  throw new Error('Expected a legalwork log file to be created')
}

beforeEach(() => {
  tempRoot = mkdtempSync(join(tmpdir(), 'legalwork-process-'))
  configureLogger({ dir: tempRoot, enabled: true, retentionDays: 7 })
})

afterEach(async () => {
  const module = await import('./legalwork-process')
  await module.stopLegalworkChildAndWait()
  configureLogger({ dir: '', enabled: true, retentionDays: 2 })
  if (tempRoot) {
    rmSync(tempRoot, { recursive: true, force: true })
    tempRoot = null
  }
})

describe('startLegalworkChild', () => {
  it('keeps child runtime data inside the per-test temporary directory', () => {
    const runtime = createSettings('/tmp/fake-legalwork-child.js').agents.legalwork
    expect(tempRoot).toBeTruthy()
    expect(runtime.dataDir).toBe(join(tempRoot!, 'runtime-data'))
  })

  it('waits for the explicit Legalwork ready marker before resolving', async () => {
    const port = await findFreeTcpPort()
    const script = writeScript(
      'ready-child.js',
      [
        "setTimeout(() => {",
        `  process.stdout.write('LEGALWORK_READY ' + JSON.stringify({ service: 'legalwork', mode: 'serve', port: ${port} }) + '\\n')`,
        "}, 50)",
        "setInterval(() => {}, 1_000)"
      ].join('\n')
    )
    const module = await import('./legalwork-process')
    await expect(module.startLegalworkChild(createSettings(script, port))).resolves.toBeUndefined()
    expect(module.isLegalworkChildRunning()).toBe(true)
    await module.stopLegalworkChildAndWait()
    const logText = await readLegalworkLog()
    expect(logText).toContain('LEGALWORK_READY')
    expect(logText).toContain(`ready marker received on port ${port}`)
  })

  it('shares an in-flight startup between concurrent callers', async () => {
    const port = await findFreeTcpPort()
    const script = writeScript(
      'slow-ready-child.js',
      [
        "setTimeout(() => {",
        `  process.stdout.write('LEGALWORK_READY ' + JSON.stringify({ service: 'legalwork', mode: 'serve', port: ${port} }) + '\\n')`,
        "}, 120)",
        "setInterval(() => {}, 1_000)"
      ].join('\n')
    )
    const module = await import('./legalwork-process')
    const first = module.startLegalworkChild(createSettings(script, port))
    let secondResolved = false
    const second = module.startLegalworkChild(createSettings(script, port)).then(() => {
      secondResolved = true
    })

    await new Promise((resolve) => setTimeout(resolve, 40))

    expect(secondResolved).toBe(false)
    await expect(Promise.all([first, second])).resolves.toBeDefined()
    expect(module.isLegalworkChildRunning()).toBe(true)
    await module.stopLegalworkChildAndWait()
  })

  it('rejects when the child exits before reporting ready', async () => {
    const port = await findFreeTcpPort()
    const script = writeScript(
      'exit-child.js',
      [
        `process.stderr.write('bind failed on port ${port}\\n')`,
        'setTimeout(() => process.exit(23), 20)'
      ].join('\n')
    )
    const module = await import('./legalwork-process')
    await expect(module.startLegalworkChild(createSettings(script, port))).rejects.toThrow(
      new RegExp(`Legalwork exited during startup with code 23[\\s\\S]*bind failed on port ${port}`)
    )
    expect(module.isLegalworkChildRunning()).toBe(false)
    await module.stopLegalworkChildAndWait()
    const logText = await readLegalworkLog()
    expect(logText).toContain(`bind failed on port ${port}`)
    expect(logText).toContain('exited with code 23')
  })
})

describe('resolveCodexRuntimeProxyEnv', () => {
  it('mirrors the system proxy only for ChatGPT account turns', async () => {
    const { resolveCodexRuntimeProxyEnv } = await import('./legalwork-process')
    const systemProxy = {
      HTTP_PROXY: 'http://127.0.0.1:7890',
      HTTPS_PROXY: 'http://127.0.0.1:7890',
      NO_PROXY: 'localhost'
    }

    expect(resolveCodexRuntimeProxyEnv('chatgpt', {}, systemProxy)).toEqual(systemProxy)
    expect(resolveCodexRuntimeProxyEnv('api_key', {}, systemProxy)).toBeUndefined()
  })

  it('preserves an explicitly configured proxy', async () => {
    const { resolveCodexRuntimeProxyEnv } = await import('./legalwork-process')

    expect(resolveCodexRuntimeProxyEnv(
      'chatgpt',
      { HTTPS_PROXY: 'http://explicit:8080' },
      { HTTPS_PROXY: 'http://system:7890' }
    )).toBeUndefined()
  })
})

describe('resolveBundledOfficePythonPath', () => {
  it('finds the staged development Office runtime for the current target', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const python = join(
      tempRoot,
      'vendor',
      'office-runtime',
      'mac-arm64',
      'python',
      'bin',
      'python3'
    )
    mkdirSync(join(python, '..'), { recursive: true })
    writeFileSync(python, '')
    const module = await import('./legalwork-process')

    expect(module.resolveBundledOfficePythonPath({
      appPath: tempRoot,
      isPackaged: false,
      platform: 'darwin',
      arch: 'arm64'
    })).toBe(python)
  })

  it('finds the packaged Office runtime beside app.asar', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const python = join(tempRoot, 'office-runtime', 'python', 'python.exe')
    mkdirSync(join(python, '..'), { recursive: true })
    writeFileSync(python, '')
    const module = await import('./legalwork-process')

    expect(module.resolveBundledOfficePythonPath({
      appPath: join(tempRoot, 'app.asar.unpacked'),
      isPackaged: true,
      resourcesPath: tempRoot,
      platform: 'win32',
      arch: 'x64'
    })).toBe(python)
  })

  it('uses a packaged Windows runtime for compliance only when its manifest is complete', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const runtimeRoot = join(tempRoot, 'office-runtime')
    const python = join(runtimeRoot, 'python', 'python.exe')
    mkdirSync(join(python, '..'), { recursive: true })
    writeFileSync(python, '')
    writeFileSync(join(runtimeRoot, 'runtime.json'), JSON.stringify({
      dataComplianceReady: true,
      imports: ['paddle', 'paddleocr']
    }))
    const module = await import('./legalwork-process')

    expect(module.resolveBundledCompliancePythonPath({
      appPath: join(tempRoot, 'app.asar.unpacked'),
      isPackaged: true,
      resourcesPath: tempRoot,
      platform: 'win32',
      arch: 'x64'
    })).toBe(python)

    expect(module.resolveBundledCompliancePythonPath({
      appPath: join(tempRoot, 'app.asar.unpacked'),
      isPackaged: true,
      resourcesPath: tempRoot,
      platform: 'win32',
      arch: 'ia32'
    })).toBeUndefined()
  })
})

describe('reclaimLegalworkPort', () => {
  it('reports a port as unavailable when another listener owns it', async () => {
    const server = createServer()
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', () => resolve())
    })
    try {
      const address = server.address() as AddressInfo
      const module = await import('./legalwork-process')

      await expect(module.reclaimLegalworkPort(address.port)).resolves.toEqual({
        ok: false,
        message: `port ${address.port} is in use`
      })
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()))
    }
  })

  it('allows non-positive ports so Legalwork can request an ephemeral port', async () => {
    const module = await import('./legalwork-process')

    await expect(module.reclaimLegalworkPort(0)).resolves.toEqual({ ok: true })
  })
})

describe('findAvailableLegalworkPort', () => {
  it('returns the preferred port when it is free', async () => {
    const module = await import('./legalwork-process')

    const preferred = 28_999
    await expect(module.findAvailableLegalworkPort(preferred)).resolves.toBe(preferred)
  })

  it('skips an occupied port and returns the next free port', async () => {
    const server = createServer()
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', () => resolve())
    })
    try {
      const address = server.address() as AddressInfo
      const module = await import('./legalwork-process')

      const found = await module.findAvailableLegalworkPort(address.port)
      expect(found).toBeGreaterThan(address.port)
      // The returned port must actually be free.
      await expect(module.reclaimLegalworkPort(found)).resolves.toEqual({ ok: true })
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()))
    }
  })
})

describe('resolveLegalworkDataDir', () => {
  it('expands Windows-style home-relative data directories', async () => {
    const module = await import('./legalwork-process')

    expect(module.resolveLegalworkDataDir({ dataDir: '~\\deepseek\\legalwork' })).toBe(join(homedir(), 'deepseek', 'legalwork'))
  })

  it('does not expand non-home tilde prefixes', async () => {
    const module = await import('./legalwork-process')

    expect(module.resolveLegalworkDataDir({ dataDir: '~other\\legalwork' })).toBe('~other\\legalwork')
  })
})

describe('syncGuiManagedLegalworkConfig', () => {
  it('migrates premature persisted DeepSeek compaction thresholds', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      models: {
        profiles: {
          'deepseek-v4-pro': {
            contextCompaction: { softThreshold: 40_000, hardThreshold: 60_000 }
          },
          'deepseek-v4-flash': {
            contextCompaction: { softThreshold: 100_000, hardThreshold: 130_000 }
          }
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.models.profiles['deepseek-v4-pro'].contextCompaction).toMatchObject({
      softThreshold: 900_000,
      hardThreshold: 950_000
    })
    expect(parsed.models.profiles['deepseek-flash'].contextCompaction).toMatchObject({
      softThreshold: 900_000,
      hardThreshold: 950_000
    })
    expect(parsed.models.profiles['deepseek-v4-flash']).toBeUndefined()
  })

  it('creates GUI-managed config with attachments enabled for image paste/upload', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.serve.storage).toMatchObject({ backend: 'hybrid' })
    expect(parsed.serve.tokenEconomy).toMatchObject({
      enabled: false,
      compressToolDescriptions: true,
      compressToolResults: true,
      conciseResponses: true,
      historyHygiene: {
        maxToolResultLines: 320,
        maxToolResultBytes: 32768,
        maxToolResultTokens: 8000,
        maxToolArgumentStringBytes: 8192,
        maxToolArgumentStringTokens: 2000,
        maxArrayItems: 80
      }
    })
    expect(parsed.contextCompaction).toMatchObject({
      defaultSoftThreshold: 16000,
      defaultHardThreshold: 24000,
      summaryMode: 'heuristic'
    })
    expect(parsed.models.profiles['deepseek-v4-pro']).toMatchObject({
      contextWindowTokens: 1_000_000,
      contextCompaction: {
        softThreshold: 900_000,
        hardThreshold: 950_000
      }
    })
    expect(parsed.models.profiles['deepseek-flash']).toMatchObject({
      aliases: ['deepseek-v4-flash', 'deepseek-chat', 'deepseek-reasoner'],
      contextWindowTokens: 1_000_000,
      contextCompaction: {
        softThreshold: 900_000,
        hardThreshold: 950_000
      }
    })
    expect(parsed.runtime.toolStorm).toMatchObject({ enabled: true, windowSize: 8, threshold: 3 })
    expect(parsed.runtime.toolArgumentRepair).toMatchObject({ maxStringBytes: 524288 })
    expect(parsed.capabilities.attachments).toMatchObject({ enabled: true })
    expect(parsed.capabilities.attachments.allowedMimeTypes).toEqual(expect.arrayContaining([
      'image/*',
      'text/*',
      'application/pdf'
    ]))
    expect(parsed.capabilities.web).toMatchObject({ enabled: true, fetchEnabled: true })
    expect(parsed.capabilities.memory).toMatchObject({ enabled: true })
    expect(parsed.capabilities.mcp.search).toMatchObject({ enabled: true, mode: 'auto' })
  })

  it('migrates image-only attachment MIME types to include document uploads', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      capabilities: {
        attachments: {
          enabled: true,
          allowedMimeTypes: ['image/png']
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.attachments.allowedMimeTypes).toEqual(expect.arrayContaining([
      'image/png',
      'image/*',
      'text/*',
      'application/pdf'
    ]))
  })

  it('GUI-managed attachments accept every file type via */*', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      capabilities: {
        attachments: {
          enabled: true,
          allowedMimeTypes: ['image/png']
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.attachments.allowedMimeTypes).toContain('*/*')
  })

  it('adds the built-in schedule MCP server to Legalwork runtime capabilities', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const module = await import('./legalwork-process')
    const settings = createSettings('/tmp/fake-legalwork-child.js')
    settings.schedule.internal.port = 9788
    settings.schedule.internal.secret = 'top-secret'

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      scheduleMcp: {
        settings,
        launch: {
          appPath: '/tmp/legalwork-test-app',
          execPath: '/tmp/electron',
          isPackaged: false
        }
      }
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.mcp.enabled).toBe(true)
    expect(parsed.capabilities.mcp.servers.legalwork_schedule).toMatchObject({
      enabled: true,
      transport: 'stdio',
      command: '/tmp/electron',
      args: [
        '/tmp/legalwork-test-app/out/main/claw-schedule-mcp-node-entry.cjs',
        '--gui-schedule-mcp-server',
        '--base-url',
        'http://127.0.0.1:9788',
        '--secret',
        'top-secret'
      ],
      env: {
        ELECTRON_RUN_AS_NODE: '1'
      },
      trustScope: 'user'
    })
  })

  it('adds the bundled OfficeCLI MCP server to Legalwork runtime capabilities', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const module = await import('./legalwork-process')
    const appPath = '/tmp/legalwork-test-app'

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      officecli: {
        appPath,
        isPackaged: false
      }
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.mcp.enabled).toBe(true)
    expect(parsed.capabilities.mcp.servers.officecli).toMatchObject({
      enabled: true,
      transport: 'stdio',
      command: process.execPath,
      args: [join(appPath, 'legalwork', 'node_modules', '@officecli', 'officecli', 'officecli.js'), 'mcp'],
      env: {},
      trustScope: 'user',
      trustedWorkspaceRoots: [],
      timeoutMs: 30000
    })
  })

  it('uses the unpacked asar path for OfficeCLI when packaged', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const module = await import('./legalwork-process')
    const appPath = join(tempRoot, 'legalwork.app', 'Contents', 'Resources', 'app.asar')
    const officeCliBinary = join(
      appPath.replace(/app\.asar$/, 'app.asar.unpacked'),
      'legalwork',
      'node_modules',
      '@officecli',
      'officecli',
      'vendor',
      'officecli'
    )
    mkdirSync(join(officeCliBinary, '..'), { recursive: true })
    writeFileSync(officeCliBinary, '', 'utf8')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      officecli: {
        appPath,
        isPackaged: true
      }
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.mcp.servers.officecli.command).toBe(officeCliBinary)
    expect(parsed.capabilities.mcp.servers.officecli.args).toEqual(['mcp'])
    // 禁用 OfficeCLI 自更新与 resident 常驻进程：Windows 上后台子进程会弹"命令提示符"窗口。
    expect(parsed.capabilities.mcp.servers.officecli.env).toMatchObject({
      OFFICECLI_SKIP_UPDATE: '1',
      OFFICECLI_NO_AUTO_RESIDENT: '1'
    })
  })

  it('places the bundled OfficeCLI ahead of system binaries in the runtime PATH', async () => {
    const module = await import('./legalwork-process')
    const appPath = '/Applications/legalwork.app/Contents/Resources/app.asar'
    const bundledVendor = join(
      '/Applications/legalwork.app/Contents/Resources/app.asar.unpacked',
      'legalwork',
      'node_modules',
      '@officecli',
      'officecli',
      'vendor'
    )

    const result = module.buildBundledOfficeCliPath(
      ['/opt/homebrew/bin', bundledVendor, '/usr/bin'].join(delimiter),
      appPath,
      true
    )

    expect(result.split(delimiter)).toEqual([
      bundledVendor,
      '/opt/homebrew/bin',
      '/usr/bin'
    ])
  })

  it('adds GUI project and configured global skill roots to Legalwork runtime capabilities', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const module = await import('./legalwork-process')
    const settings = createSettings('/tmp/fake-legalwork-child.js')
    const workspaceRoot = join(tempRoot, 'workspace')
    const extraRoot = join(tempRoot, 'extra-skills')
    settings.workspaceRoot = workspaceRoot
    settings.claw.skills.extraDirs = [extraRoot]
    mkdirSync(join(workspaceRoot, '.codex', 'skills'), { recursive: true })

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      scheduleMcp: {
        settings,
        launch: {
          appPath: '/tmp/legalwork-test-app',
          execPath: '/tmp/electron',
          isPackaged: false
        }
      }
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.skills.enabled).toBe(true)
    expect(parsed.capabilities.skills.legacySkillMd).toBe(true)
    expect(parsed.capabilities.skills.autoActivateUserSkills).toBe(false)
    expect(parsed.capabilities.skills.nativeRoots).toEqual(expect.any(Array))
    expect(parsed.capabilities.skills.roots).toEqual(expect.arrayContaining([
      join(workspaceRoot, '.codex', 'skills'),
      extraRoot
    ]))
  })

  it('writes GUI-managed MCP search settings without removing existing servers', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      legacyTopLevelFlag: true,
      contextCompaction: {
        modelProfiles: {
          'custom-model': {
            contextWindowTokens: 128000
          }
        }
      },
      models: {
        profiles: {
          'user-model': {
            contextWindowTokens: 96000,
            contextCompaction: {
              softThreshold: 86000
            }
          },
          'deepseek-v4-pro': {
            contextCompaction: {
              softThreshold: 970000
            }
          },
          'deepseek-v4-flash': {
            contextCompaction: {
              softThreshold: 980000,
              hardThreshold: 990000
            }
          }
        }
      },
      runtime: {
        customRuntimeFlag: true,
        toolStorm: {
          customStormFlag: 'keep'
        }
      },
      serve: {
        legacyServeFlag: true,
        tokenEconomy: {
          customTokenEconomyFlag: 'keep',
          historyHygiene: {
            customHistoryFlag: true
          }
        }
      },
      capabilities: {
        mcp: {
          enabled: true,
          servers: {
            github: {
              transport: 'stdio',
              command: 'github-mcp',
              trustScope: 'user'
            }
          }
        },
        web: {
          enabled: true,
          fetchEnabled: true
        }
      }
    }), 'utf8')
    const mcpConfigPath = join(tempRoot, 'empty-mcp.json')
    writeFileSync(mcpConfigPath, JSON.stringify({ servers: {} }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, {
      ...defaultLegalworkRuntimeSettings(),
      storage: {
        backend: 'hybrid',
        sqlitePath: '/tmp/legalwork-index.sqlite3'
      },
      contextCompaction: {
        defaultSoftThreshold: 32000,
        defaultHardThreshold: 64000,
        summaryMode: 'model',
        summaryTimeoutMs: 30000,
        summaryMaxTokens: 1600,
        summaryInputMaxBytes: 131072
      },
      runtimeTuning: {
        toolStorm: {
          enabled: false,
          windowSize: 12,
          threshold: 4
        },
        toolArgumentRepair: {
          maxStringBytes: 262144
        }
      },
      mcpSearch: {
        enabled: true,
        mode: 'search',
        autoThresholdToolCount: 12,
        topKDefault: 4,
        topKMax: 9,
        minScore: 0.2
      },
      tokenEconomy: {
        enabled: true,
        compressToolDescriptions: false,
        compressToolResults: true,
        conciseResponses: false,
        historyHygiene: {
          maxToolResultLines: 100,
          maxToolResultBytes: 16384,
          maxToolResultTokens: 4000,
          maxToolArgumentStringBytes: 4096,
          maxToolArgumentStringTokens: 1000,
          maxArrayItems: 40
        }
      }
    }, { mcpConfigPath })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(LegalworkConfigSchema.safeParse(parsed).success).toBe(true)
    expect(parsed.legacyTopLevelFlag).toBeUndefined()
    expect(parsed.serve.legacyServeFlag).toBeUndefined()
    expect(parsed.serve.storage).toMatchObject({
      backend: 'hybrid',
      sqlitePath: '/tmp/legalwork-index.sqlite3'
    })
    expect(parsed.serve.tokenEconomy).toMatchObject({
      enabled: true,
      compressToolDescriptions: false,
      compressToolResults: true,
      conciseResponses: false,
      historyHygiene: {
        maxToolResultLines: 100,
        maxToolResultBytes: 16384,
        maxToolResultTokens: 4000,
        maxToolArgumentStringBytes: 4096,
        maxToolArgumentStringTokens: 1000,
        maxArrayItems: 40
      }
    })
    expect(parsed.serve.tokenEconomy.customTokenEconomyFlag).toBeUndefined()
    expect(parsed.serve.tokenEconomy.historyHygiene.customHistoryFlag).toBeUndefined()
    expect(parsed.contextCompaction).toMatchObject({
      defaultSoftThreshold: 32000,
      defaultHardThreshold: 64000,
      summaryMode: 'model',
      summaryTimeoutMs: 30000,
      summaryMaxTokens: 1600,
      summaryInputMaxBytes: 131072
    })
    expect(parsed.contextCompaction.modelProfiles['custom-model']).toMatchObject({
      contextWindowTokens: 128000
    })
    expect(parsed.models.profiles['user-model']).toMatchObject({
      contextWindowTokens: 96000,
      contextCompaction: {
        softThreshold: 86000
      }
    })
    expect(parsed.models.profiles['deepseek-v4-pro']).toMatchObject({
      contextWindowTokens: 1_000_000,
      contextCompaction: {
        // User explicitly overrides softThreshold; hard is clamped to >= soft
        // (970000+1) so the profile stays valid even though the new default
        // hard (950K) is below the user's soft value.
        softThreshold: 970_000,
        hardThreshold: 970_001
      }
    })
    expect(parsed.models.profiles['deepseek-flash']).toMatchObject({
      contextWindowTokens: 1_000_000,
      contextCompaction: {
        // A deliberate near-window override remains untouched.
        softThreshold: 980_000,
        hardThreshold: 990_000
      }
    })
    expect(parsed.runtime.toolStorm).toMatchObject({
      enabled: false,
      windowSize: 12,
      threshold: 4
    })
    expect(parsed.runtime.toolStorm.customStormFlag).toBeUndefined()
    expect(parsed.runtime.customRuntimeFlag).toBeUndefined()
    expect(parsed.runtime.toolArgumentRepair).toMatchObject({ maxStringBytes: 262144 })
    expect(parsed.capabilities.attachments).toMatchObject({ enabled: true })
    expect(parsed.capabilities.mcp.servers.github.command).toBe('github-mcp')
    expect(parsed.capabilities.web.fetchEnabled).toBe(true)
    expect(parsed.capabilities.mcp.search).toMatchObject({
      enabled: true,
      mode: 'search',
      autoThresholdToolCount: 12,
      topKDefault: 4,
      topKMax: 9,
      minScore: 0.2
    })
  })

  it('imports GUI-managed MCP servers into runtime capabilities', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const mcpConfigPath = join(tempRoot, 'mcp.json')
    writeFileSync(mcpConfigPath, JSON.stringify({
      servers: {
        'stata-mcp': {
          command: 'uvx',
          args: ['stata-mcp'],
          env: {
            STATA_CLI: 'D:\\stata\\StataMP-64.exe'
          },
          enabled: true,
          disabled: false
        },
        'docs-mcp': {
          url: 'https://mcp.example.test/mcp',
          headers: {
            Authorization: 'Bearer docs-token'
          }
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      mcpConfigPath
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.mcp.enabled).toBe(true)
    expect(parsed.capabilities.mcp.servers['stata-mcp']).toMatchObject({
      enabled: true,
      transport: 'stdio',
      command: 'uvx',
      args: ['stata-mcp'],
      env: {
        STATA_CLI: 'D:\\stata\\StataMP-64.exe'
      },
      trustScope: 'user'
    })
    expect(parsed.capabilities.mcp.servers['docs-mcp']).toMatchObject({
      enabled: true,
      transport: 'streamable-http',
      url: 'https://mcp.example.test/mcp',
      headers: {
        Authorization: 'Bearer docs-token'
      },
      trustScope: 'user'
    })
    // 未配置 primaryLegalSource 时不出现在 capabilities.mcp（向后兼容）。
    expect(parsed.capabilities.mcp.primaryLegalSource).toBeUndefined()
  })

  it('propagates the GUI primaryLegalSource into runtime capabilities', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const mcpConfigPath = join(tempRoot, 'mcp.json')
    writeFileSync(mcpConfigPath, JSON.stringify({
      primaryLegalSource: 'yuandian',
      servers: {
        'yuandian-law': {
          url: 'https://open.chineselaw.com/mcp/law/stream',
          headers: { Authorization: 'Bearer yd-token' }
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      mcpConfigPath
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.mcp.primaryLegalSource).toBe('yuandian')
  })

  it('rebinds the bundled IMA MCP script to the currently running app', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const mcpConfigPath = join(tempRoot, 'mcp.json')
    const appPath = '/Users/test/Desktop/legalwork-dev.app/Contents/Resources/app.asar'
    writeFileSync(mcpConfigPath, JSON.stringify({
      servers: {
        'ima-knowledge-base': {
          enabled: true,
          transport: 'stdio',
          command: 'python3',
          args: ['/Applications/legalwork.app/Contents/Resources/scripts/ima-mcp-server.py'],
          env: {
            IMA_CREDS_FILE: '/Users/test/Library/Application Support/legalwork/ima-creds.json'
          },
          trustScope: 'user',
          timeoutMs: 120000
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      ima: { appPath, isPackaged: true },
      mcpConfigPath
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.mcp.servers['ima-knowledge-base']).toMatchObject({
      enabled: true,
      transport: 'stdio',
      command: 'python3',
      args: ['/Users/test/Desktop/legalwork-dev.app/Contents/Resources/scripts/ima-mcp-server.py'],
      env: {
        IMA_CREDS_FILE: '/Users/test/Library/Application Support/legalwork/ima-creds.json'
      },
      trustScope: 'user',
      timeoutMs: 120000
    })
  })

  it('replaces unparsable historical Legalwork config with a valid GUI-managed config', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, '{ legacy config', 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as unknown
    expect(LegalworkConfigSchema.safeParse(parsed).success).toBe(true)
  })

  it('does not enable MCP when the capability is explicitly disabled', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      capabilities: {
        mcp: {
          enabled: false
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings(), {
      scheduleMcp: {
        settings: createSettings('/tmp/fake-legalwork-child.js'),
        launch: {
          appPath: '/tmp/legalwork-test-app',
          execPath: '/tmp/electron',
          isPackaged: false
        }
      }
    })

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.mcp.enabled).toBe(false)
    expect(parsed.capabilities.mcp.servers.legalwork_schedule).toMatchObject({
      transport: 'stdio',
      command: '/tmp/electron',
      args: [
        '/tmp/legalwork-test-app/out/main/claw-schedule-mcp-node-entry.cjs',
        '--gui-schedule-mcp-server',
        '--base-url',
        'http://127.0.0.1:8788'
      ],
      env: {
        ELECTRON_RUN_AS_NODE: '1'
      }
    })
  })

  it('does not override an explicitly disabled attachment capability', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      capabilities: {
        attachments: {
          enabled: false,
          maxImageBytes: 1024
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.attachments).toMatchObject({
      enabled: false,
      maxImageBytes: 1024
    })
  })

  it('does not override explicitly disabled web fetch capability', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      capabilities: {
        web: {
          enabled: false,
          fetchEnabled: false,
          searchEnabled: true,
          provider: 'custom-search'
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.web).toMatchObject({
      enabled: false,
      fetchEnabled: false,
      searchEnabled: true,
      provider: 'custom-search'
    })
  })

  it('does not override an explicitly disabled memory capability', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    writeFileSync(configPath, JSON.stringify({
      capabilities: {
        memory: {
          enabled: false,
          maxInjectedRecords: 3
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(tempRoot, defaultLegalworkRuntimeSettings())

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    expect(parsed.capabilities.memory).toMatchObject({
      enabled: false,
      maxInjectedRecords: 3
    })
  })

  it('injects the default PKULaw MCP servers when mcp.json has none', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const mcpPath = join(tempRoot, 'mcp.json')
    writeFileSync(mcpPath, JSON.stringify({
      servers: {
        custom: { enabled: true, transport: 'streamable-http', url: 'https://example.com/mcp' }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(
      tempRoot,
      defaultLegalworkRuntimeSettings(),
      { mcpConfigPath: mcpPath }
    )

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    const servers = parsed.capabilities.mcp.servers
    const pkulawIds = Object.keys(servers).filter((id: string) => id.startsWith('pkulaw-'))
    expect(pkulawIds).toHaveLength(9)
    expect(Object.values(
      Object.fromEntries(pkulawIds.map((id: string) => [id, servers[id]]))
    ).every((server: any) => server.enabled === true)).toBe(true)
    expect(servers.custom).toBeTruthy()
  })

  it('keeps user-configured PKULaw servers without injecting defaults', async () => {
    if (!tempRoot) throw new Error('temp root not initialized')
    const configPath = join(tempRoot, 'config.json')
    const mcpPath = join(tempRoot, 'mcp.json')
    writeFileSync(mcpPath, JSON.stringify({
      servers: {
        'pkulaw-law-keyword': {
          enabled: true,
          transport: 'streamable-http',
          url: 'https://apim-gateway.pkulaw.com/mcp-law',
          headers: { Authorization: 'Bearer user-token-123' }
        },
        'pkulaw-case-keyword': {
          enabled: true,
          transport: 'streamable-http',
          url: 'https://apim-gateway.pkulaw.com/mcp-case'
        }
      }
    }), 'utf8')
    const module = await import('./legalwork-process')

    await module.syncGuiManagedLegalworkConfig(
      tempRoot,
      defaultLegalworkRuntimeSettings(),
      { mcpConfigPath: mcpPath }
    )

    const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as any
    const servers = parsed.capabilities.mcp.servers
    const pkulawIds = Object.keys(servers).filter((id: string) => id.startsWith('pkulaw-'))
    expect(pkulawIds).toHaveLength(2)
    expect(servers['pkulaw-law-keyword'].headers.Authorization).toBe('Bearer user-token-123')
  })
})

describe('childWatchdogTick', () => {
  it('resets the failure count on a healthy probe', async () => {
    const module = await import('./legalwork-process')
    const tick = module.childWatchdogTick
    expect(tick(true, 2)).toEqual({ failures: 0, kill: false })
    expect(tick(true, 0)).toEqual({ failures: 0, kill: false })
  })

  it('increments failures without killing below the threshold', async () => {
    const module = await import('./legalwork-process')
    const tick = module.childWatchdogTick
    // 默认阈值 3：前 2 次失败只累计，不 kill
    expect(tick(false, 0)).toEqual({ failures: 1, kill: false })
    expect(tick(false, 1)).toEqual({ failures: 2, kill: false })
  })

  it('kills when consecutive failures reach the configured threshold', async () => {
    const module = await import('./legalwork-process')
    const tick = module.childWatchdogTick
    // 默认阈值 3：第 3 次连续失败即触发 kill
    expect(tick(false, 2)).toEqual({ failures: 3, kill: true })
    expect(tick(false, 3)).toEqual({ failures: 4, kill: true })
    // 更高阈值：第 5 次才 kill
    expect(tick(false, 4, 5)).toEqual({ failures: 5, kill: true })
    expect(tick(false, 3, 5)).toEqual({ failures: 4, kill: false })
  })
})
