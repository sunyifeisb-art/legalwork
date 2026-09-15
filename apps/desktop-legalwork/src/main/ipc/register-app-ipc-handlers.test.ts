import { beforeEach, describe, expect, it, vi } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  mergeScheduleSettings,
  defaultClawSettings,
  defaultLegalworkRuntimeSettings,
  defaultLearningIterationSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  defaultKeyboardShortcuts,
  type AppSettingsPatch,
  type AppSettingsV1
} from '../../shared/app-settings'

const handlers = new Map<string, (event: unknown, payload?: unknown) => Promise<unknown>>()
const skillHubMocks = vi.hoisted(() => ({
  install: vi.fn(),
  list: vi.fn()
}))

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/tmp/legalwork-test-user-data'),
    quit: vi.fn()
  },
  dialog: {},
  shell: {},
  ipcMain: {
    handle: vi.fn((channel: string, handler: (event: unknown, payload?: unknown) => Promise<unknown>) => {
      handlers.set(channel, handler)
    })
  }
}))

vi.mock('../services/skillhub-service', () => ({
  installSkillHubSkill: skillHubMocks.install,
  listSkillHubSkills: skillHubMocks.list
}))

function settings(): AppSettingsV1 {
  return {
    version: 1,
    locale: 'en',
    theme: 'system',
    uiFontScale: 'small',
    provider: defaultModelProviderSettings(),
    agents: {
      legalwork: defaultLegalworkRuntimeSettings()
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

function registerOptions(overrides: Partial<Parameters<typeof import('./register-app-ipc-handlers').registerAppIpcHandlers>[0]> = {}) {
  const applySettingsPatch = vi.fn(async () => settings())
  return {
    store: { load: vi.fn(async () => settings()) } as never,
    getMainWindow: () => null,
    applySettingsPatch,
    runtimeRequest: vi.fn() as never,
    reconnectRuntime: vi.fn(async () => settings()),
    fetchUpstreamModels: vi.fn() as never,
    fetchEndpointModels: vi.fn() as never,
    getClawRuntime: () => null,
    getScheduleRuntime: () => null,
    getLearningIterationRuntime: () => null,
    startFeishuInstallQrcode: vi.fn() as never,
    pollFeishuInstall: vi.fn() as never,
    startWeixinInstallQrcode: vi.fn() as never,
    pollWeixinInstall: vi.fn() as never,
    resolveLegalworkConfigPath: () => '/tmp/legalwork.json',
    showTurnCompleteNotification: vi.fn() as never,
    getAppVersion: () => '0.1.0',
    readGuiUpdateState: vi.fn() as never,
    loadGuiUpdaterModule: vi.fn() as never,
    resolveLogDirectory: () => '/tmp/logs',
    logError: vi.fn(),
    ...overrides
  }
}

describe('registerAppIpcHandlers', () => {
  beforeEach(() => {
    handlers.clear()
    skillHubMocks.install.mockReset()
    skillHubMocks.list.mockReset()
  })

  it('rejects invalid settings patches at the handler boundary', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const applySettingsPatch = vi.fn(async () => settings())

    registerAppIpcHandlers(registerOptions({ applySettingsPatch }))

    const handler = handlers.get('settings:set')
    expect(handler).toBeTypeOf('function')
    await expect(
      handler?.({}, { agents: { legalwork: { mysteryFlag: true } } })
    ).rejects.toThrow(/Invalid payload for settings:set/)
    expect(applySettingsPatch).not.toHaveBeenCalled()
  })

  it('requires Python 3.11 or newer for data compliance installs', async () => {
    const {
      isSupportedDataCompliancePythonVersion,
      parsePythonVersionOutput
    } = await import('./register-app-ipc-handlers')

    expect(parsePythonVersionOutput('Python 3.11.9')).toEqual({ major: 3, minor: 11, patch: 9 })
    expect(isSupportedDataCompliancePythonVersion('Python 3.9.18')).toBe(false)
    expect(isSupportedDataCompliancePythonVersion('Python 3.10.0')).toBe(false)
    expect(isSupportedDataCompliancePythonVersion('Python 3.11.9')).toBe(true)
  })

  it('does not reinstall data compliance after a transient environment probe failure', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const runtimeRequest = vi.fn(async () => ({
      ok: false,
      status: 0,
      body: JSON.stringify({ error: 'fetch timed out' })
    }))

    registerAppIpcHandlers(registerOptions({ runtimeRequest: runtimeRequest as never }))

    await expect(handlers.get('data-compliance:status')?.({})).resolves.toEqual({
      ok: false,
      running: false,
      installing: false,
      baseUrl: '',
      message: 'fetch timed out'
    })
    expect(runtimeRequest).toHaveBeenCalledTimes(1)
  })

  it('preserves the runtime bundle installation state without starting a second installer', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const runtimeRequest = vi.fn(async () => ({
      ok: false,
      status: 503,
      body: JSON.stringify({
        error: '正在下载并准备数据合规环境，首次使用需要几分钟。',
        installing: true
      })
    }))

    registerAppIpcHandlers(registerOptions({ runtimeRequest: runtimeRequest as never }))

    await expect(handlers.get('data-compliance:status')?.({})).resolves.toEqual({
      ok: false,
      running: false,
      installing: true,
      baseUrl: '',
      message: '正在下载并准备数据合规环境，首次使用需要几分钟。'
    })
    expect(runtimeRequest).toHaveBeenCalledTimes(1)
  })

  it('passes valid settings patches through to applySettingsPatch', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const applySettingsPatch = vi.fn(async () => settings())

    registerAppIpcHandlers(registerOptions({ applySettingsPatch }))

    const payload = {
      theme: 'dark' as const,
      agents: {
        legalwork: {
          port: 9000
        }
      }
    }
    const handler = handlers.get('settings:set')
    await expect(handler?.({}, payload)).resolves.toEqual(settings())
    expect(applySettingsPatch).toHaveBeenCalledWith(payload)
  })

  it('routes runtime reconnect IPC to the recovery handler', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const reconnectRuntime = vi.fn(async () => settings())

    registerAppIpcHandlers(registerOptions({ reconnectRuntime }))

    const handler = handlers.get('runtime:reconnect')
    expect(handler).toBeTypeOf('function')
    await expect(handler?.({})).resolves.toEqual(settings())
    expect(reconnectRuntime).toHaveBeenCalledTimes(1)
  })

  it('waits for the runtime Skill refresh before a SkillHub install reports success', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    let finishRefresh: (() => void) | undefined
    const runtimeRequest = vi.fn(() => new Promise<void>((resolve) => {
      finishRefresh = resolve
    }))
    skillHubMocks.install.mockResolvedValue({
      ok: true,
      userSkillRoot: '/tmp/user-skills',
      installed: [{
        name: 'md-only-remote-skill',
        path: '/tmp/user-skills/md-only-remote-skill',
        replaced: false
      }]
    })
    registerAppIpcHandlers(registerOptions({ runtimeRequest: runtimeRequest as never }))

    const resultPromise = handlers.get('skillhub:install')?.({}, {
      slug: 'md-only-remote-skill',
      namespace: 'publisher',
      targetRoot: '/tmp/user-skills'
    })
    let settled = false
    void resultPromise?.then(() => { settled = true })
    await vi.waitFor(() => {
      expect(runtimeRequest).toHaveBeenCalledWith('/v1/skills/refresh', 'POST')
    })
    expect(settled).toBe(false)

    finishRefresh?.()
    await expect(resultPromise).resolves.toMatchObject({ ok: true })
    expect(settled).toBe(true)
  })

  it('accepts the full settings snapshot emitted by SettingsView auto-apply', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const applySettingsPatch = vi.fn(async () => settings())

    registerAppIpcHandlers(registerOptions({ applySettingsPatch }))

    const payload = { ...settings(), locale: 'zh' as const }
    const handler = handlers.get('settings:set')
    await expect(handler?.({}, payload)).resolves.toEqual(settings())
    expect(applySettingsPatch).toHaveBeenCalledWith(payload)
  })

  it('passes schedule settings patches through to applySettingsPatch', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const applySettingsPatch = vi.fn(async (partial: AppSettingsPatch) => ({
      ...settings(),
      schedule: mergeScheduleSettings(settings().schedule, partial.schedule)
    }))

    registerAppIpcHandlers(registerOptions({ applySettingsPatch }))

    const payload = {
      schedule: {
        enabled: true,
        keepAwake: true,
        tasks: [{
          id: 'task-1',
          title: 'Daily',
          enabled: true,
          prompt: 'Run',
          schedule: { kind: 'manual' as const }
        }]
      }
    }
    const handler = handlers.get('settings:set')
    await expect(handler?.({}, payload)).resolves.toMatchObject({
      schedule: {
        enabled: true,
        keepAwake: true,
        tasks: [{ id: 'task-1', prompt: 'Run' }]
      }
    })
    expect(applySettingsPatch).toHaveBeenCalledWith(payload)
  })

  it('writes MCP config JSON and notifies the runtime apply hook', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const tempRoot = mkdtempSync(join(tmpdir(), 'deepseek-gui-ipc-'))
    const configPath = join(tempRoot, 'mcp.json')
    const onLegalworkMcpConfigWritten = vi.fn(async () => undefined)
    const content = `${JSON.stringify({
      servers: {
        filesystem: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', '/tmp/project']
        }
      }
    }, null, 2)}\n`

    try {
      registerAppIpcHandlers(registerOptions({
        resolveLegalworkConfigPath: () => configPath,
        onLegalworkMcpConfigWritten
      }))

      await expect(handlers.get('deepseek:config:write')?.({}, content)).resolves.toEqual({
        ok: true,
        path: configPath
      })
      expect(readFileSync(configPath, 'utf8')).toBe(content)
      expect(onLegalworkMcpConfigWritten).toHaveBeenCalledWith(configPath, content)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('rejects invalid MCP config JSON before writing or applying it', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const tempRoot = mkdtempSync(join(tmpdir(), 'deepseek-gui-ipc-'))
    const configPath = join(tempRoot, 'mcp.json')
    const onLegalworkMcpConfigWritten = vi.fn(async () => undefined)

    try {
      registerAppIpcHandlers(registerOptions({
        resolveLegalworkConfigPath: () => configPath,
        onLegalworkMcpConfigWritten
      }))

      await expect(handlers.get('deepseek:config:write')?.({}, '{')).rejects.toThrow(
        /MCP config must be JSON/
      )
      await expect(handlers.get('deepseek:config:write')?.({}, '[]')).rejects.toThrow(
        /MCP config must be a JSON object/
      )
      expect(existsSync(configPath)).toBe(false)
      expect(onLegalworkMcpConfigWritten).not.toHaveBeenCalled()
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('copies selected files into the resolved knowledge target path', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const tempRoot = mkdtempSync(join(tmpdir(), 'knowledge-upload-ipc-'))
    const sourcePath = join(tempRoot, 'source.pdf')
    const targetPath = join(tempRoot, 'managed', 'cases', 'source.pdf')
    writeFileSync(sourcePath, 'pdf bytes')
    const runtimeRequest = vi.fn(async () => ({
      ok: true,
      status: 200,
      body: JSON.stringify({ path: 'cases/source.pdf', absolute: targetPath })
    }))

    try {
      registerAppIpcHandlers(registerOptions({ runtimeRequest: runtimeRequest as never }))

      await expect(
        handlers.get('knowledge:upload-file')?.({}, {
          sourcePath,
          targetPath: 'cases/source.pdf'
        })
      ).resolves.toEqual({
        ok: true,
        path: 'cases/source.pdf',
        sizeBytes: 9
      })
      expect(readFileSync(targetPath, 'utf8')).toBe('pdf bytes')
      expect(runtimeRequest).toHaveBeenCalledWith(
        '/v1/knowledge/file/absolute-path?path=cases%2Fsource.pdf',
        'GET'
      )
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('forwards data compliance upload file paths in the submit payload', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const sourcePath = '/tmp/legalwork-upload/privacy-policy.pdf'
    const runtimeRequest = vi.fn(async () => ({
      ok: true,
      status: 201,
      body: JSON.stringify({ task_id: 'task_123' })
    }))

    registerAppIpcHandlers(registerOptions({ runtimeRequest: runtimeRequest as never }))

    await expect(
      handlers.get('data-compliance:submit')?.({}, {
        mode: 'review',
        documentName: '隐私政策',
        reviewType: 'document',
        file: {
          name: 'privacy-policy.pdf',
          type: 'application/pdf',
          filePath: sourcePath
        }
      })
    ).resolves.toEqual({
      ok: true,
      status: 201,
      body: JSON.stringify({ task_id: 'task_123' })
    })

    expect(runtimeRequest).toHaveBeenCalledWith(
      '/data-compliance/tasks',
      'POST',
      expect.any(String)
    )
    const [, , body] = runtimeRequest.mock.calls[0] as unknown as [string, string, string]
    expect(JSON.parse(String(body))).toMatchObject({
      mode: 'review',
      documentName: '隐私政策',
      reviewType: 'document',
      file: {
        name: 'privacy-policy.pdf',
        type: 'application/pdf',
        filePath: sourcePath
      }
    })
  })

  it('uses the GUI-managed WeChat bridge for WeChat install handlers', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const configuredSettings = settings()
    configuredSettings.claw.im.weixinBridgeUrl = 'http://127.0.0.1:8787/rpc'
    const store = { load: vi.fn(async () => configuredSettings) }
    const startWeixinInstallQrcode = vi.fn(async () => ({
      ok: false as const,
      message: 'expected test response'
    }))
    const pollWeixinInstall = vi.fn(async () => ({ done: false as const }))

    registerAppIpcHandlers(registerOptions({
      store: store as never,
      startWeixinInstallQrcode,
      pollWeixinInstall
    }))

    await expect(
      handlers.get('claw:im-install:qrcode')?.({}, { provider: 'weixin' })
    ).resolves.toMatchObject({ ok: false })
    await expect(
      handlers.get('claw:im-install:poll')?.({}, { provider: 'weixin', deviceCode: 'device-1' })
    ).resolves.toEqual({ done: false })

    expect(startWeixinInstallQrcode).toHaveBeenCalledWith()
    expect(pollWeixinInstall).toHaveBeenCalledWith('device-1')
  })

  it('routes schedule task IPC calls to the Schedule runtime', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const scheduleRuntime = {
      status: vi.fn(async () => ({
        internalServerRunning: true,
        internalUrl: 'http://127.0.0.1:8788',
        runningTaskIds: ['task-1'],
        powerSaveBlockerActive: true
      })),
      runTask: vi.fn(async (taskId: string) => ({ ok: true as const, taskId, message: 'Started' })),
      createScheduledTaskFromText: vi.fn(async () => ({
        kind: 'created' as const,
        taskId: 'task-2',
        title: 'Reminder',
        scheduleAt: '2026-06-03T09:00:00.000+08:00',
        confirmationText: 'Scheduled.'
      }))
    }
    registerAppIpcHandlers(registerOptions({
      getScheduleRuntime: () => scheduleRuntime as never
    }))

    await expect(handlers.get('schedule:status')?.({})).resolves.toMatchObject({
      internalServerRunning: true,
      runningTaskIds: ['task-1'],
      powerSaveBlockerActive: true
    })
    await expect(handlers.get('schedule:task:run')?.({}, 'task-1')).resolves.toMatchObject({
      ok: true,
      taskId: 'task-1'
    })
    await expect(
      handlers.get('schedule:task:create-from-text')?.({}, {
        text: 'Remind me tomorrow.',
        workspaceRoot: '/tmp/schedule',
        modelHint: 'deepseek-v4-flash',
        mode: 'plan'
      })
    ).resolves.toMatchObject({
      kind: 'created',
      taskId: 'task-2'
    })

    expect(scheduleRuntime.runTask).toHaveBeenCalledWith('task-1')
    expect(scheduleRuntime.createScheduledTaskFromText).toHaveBeenCalledWith('Remind me tomorrow.', {
      workspaceRoot: '/tmp/schedule',
      modelHint: 'deepseek-v4-flash',
      mode: 'plan'
    })
  })

  it('routes desktop command IPC calls to the focused window and web contents', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
    const webContents = {
      undo: vi.fn(),
      redo: vi.fn(),
      cut: vi.fn(),
      copy: vi.fn(),
      paste: vi.fn(),
      selectAll: vi.fn(),
      reload: vi.fn(),
      getZoomLevel: vi.fn(() => 0),
      setZoomLevel: vi.fn(),
      toggleDevTools: vi.fn()
    }
    const mainWindow = {
      isDestroyed: vi.fn(() => false),
      webContents,
      minimize: vi.fn(),
      isMaximized: vi.fn(() => false),
      maximize: vi.fn(),
      unmaximize: vi.fn(),
      close: vi.fn()
    }

    registerAppIpcHandlers(registerOptions({
      getMainWindow: () => mainWindow as never
    }))

    const handler = handlers.get('desktop:command')
    await handler?.({ sender: webContents }, 'copy')
    await handler?.({ sender: webContents }, 'zoomIn')
    await handler?.({ sender: webContents }, 'toggleMaximize')
    await handler?.({ sender: webContents }, 'close')

    expect(webContents.copy).toHaveBeenCalledTimes(1)
    expect(webContents.setZoomLevel).toHaveBeenCalledWith(1)
    expect(mainWindow.maximize).toHaveBeenCalledTimes(1)
    expect(mainWindow.close).toHaveBeenCalledTimes(1)
  })

  it('deepseek:config:read returns the default PKULaw config when mcp.json is missing', async () => {
    const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')

    // resolveLegalworkConfigPath defaults to a non-existent path -> ENOENT branch.
    registerAppIpcHandlers(registerOptions())
    const handler = handlers.get('deepseek:config:read')
    expect(handler).toBeTypeOf('function')

    const result = await handler?.({}) as { path: string; content: string; exists: boolean }
    expect(result.exists).toBe(false)

    const parsed = JSON.parse(result.content) as { servers: Record<string, { enabled: boolean }> }
    expect(Object.keys(parsed.servers)).toHaveLength(9)
    expect(Object.keys(parsed.servers).every((id) => id.startsWith('pkulaw-'))).toBe(true)
    expect(Object.values(parsed.servers).every((server) => server.enabled === true)).toBe(true)
  })

  it('deepseek:config:read returns the on-disk content when mcp.json exists', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'legalwork-mcp-test-'))
    const mcpPath = join(dir, 'mcp.json')
    writeFileSync(mcpPath, JSON.stringify({ servers: { custom: { enabled: true } } }), 'utf8')

    try {
      const { registerAppIpcHandlers } = await import('./register-app-ipc-handlers')
      registerAppIpcHandlers(registerOptions({ resolveLegalworkConfigPath: () => mcpPath }))
      const handler = handlers.get('deepseek:config:read')

      const result = await handler?.({}) as { path: string; content: string; exists: boolean }
      expect(result.exists).toBe(true)
      expect(JSON.parse(result.content)).toEqual({ servers: { custom: { enabled: true } } })
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })
})
