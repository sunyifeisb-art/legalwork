/**
 * Dev mock for window.dsGui (Electron preload bridge).
 * Only loaded when running the standalone Vite dev server.
 * Provides minimal stubs so the frontend UI can render in a browser.
 */
(function () {
  if (typeof window.dsGui !== 'undefined') return

  function getDefaultSettings() {
    return {
      version: 1,
      locale: 'zh',
      theme: 'dark',
      uiFontScale: 'small',
      provider: {
        profiles: [],
        activeProfileId: '',
        upstreamModelIds: []
      },
      agents: {
        enabled: true,
        allowAnonymousMetrics: false,
        longTermMemory: false,
        customHosts: [],
        mcp: { servers: [] },
        hooks: { enabled: false },
        guardrails: {
          allowPaths: [],
          blockPaths: [],
          maxTokensPerTurn: 0,
          requireApproval: false
        },
        legalwork: {
          binaryPath: '',
          port: 5101,
          autoStart: true,
          apiKey: 'mock-api-key',
          baseUrl: '',
          providerId: '',
          runtimeToken: 'mock-token',
          dataDir: '',
          model: 'deepseek-chat',
          approvalPolicy: 'auto',
          sandboxMode: 'never',
          tokenEconomyMode: false,
          insecure: false
        }
      },
      workspaceRoot: '',
      log: {
        enabled: true,
        retentionDays: 2
      },
      notifications: {
        turnComplete: true
      },
      appBehavior: {
        openAtLogin: false,
        startMinimized: false,
        closeToTray: false
      },
      write: {
        enabled: true,
        workspaces: [],
        defaultWorkspaceRoot: '',
        activeWorkspaceRoot: ''
      },
      claw: {
        enabled: true,
        channels: [],
        im: { enabled: false },
        tasks: []
      },
      schedule: {
        enabled: true,
        tasks: []
      },
      guiUpdate: {
        channel: 'stable',
        autoDownload: false,
        autoInstall: false
      }
    }
  }

  // Track threads in memory for the mock
  const mockThreads = []

  // Basic mock that returns sensible defaults
  window.dsGui = {
    platform: 'darwin',

    getSettings: () => Promise.resolve(getDefaultSettings()),
    setSettings: (partial) => {
      console.log('[dsGui:mock] setSettings', partial)
      return Promise.resolve({ ...getDefaultSettings(), ...partial })
    },
    runtimeRequest: (path, method, body) => {
      console.log('[dsGui:mock] runtimeRequest', path, method)
      // Handle health check
      if (path === '/health') {
        return Promise.resolve({ ok: true, status: 200, body: JSON.stringify({ status: 'ok' }) })
      }
      // Handle thread listing
      if (path.startsWith('/v1/threads')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          body: JSON.stringify({ threads: mockThreads })
        })
      }
      // Default OK response
      return Promise.resolve({ ok: true, status: 200, body: '{}' })
    },

    fetchUpstreamModels: () =>
      Promise.resolve({ ok: true, modelIds: [], modelGroups: [] }),

    getClawStatus: () =>
      Promise.resolve({ ok: true, running: false, installing: false, channels: [] }),
    runClawTask: () => Promise.resolve({ ok: true, message: 'mock' }),

    getScheduleStatus: () =>
      Promise.resolve({ ok: true, running: false, tasks: [] }),
    runScheduleTask: () => Promise.resolve({ ok: true }),

    pickWorkspaceDirectory: () => Promise.resolve({ canceled: true, path: '' }),

    listSkills: () => Promise.resolve({ ok: true, skills: [] }),
    saveSkillFile: () => Promise.resolve({ ok: true }),
    openSkillRoot: () => Promise.resolve(),

    getDeepseekConfigFile: () => Promise.resolve({ ok: true, content: '' }),
    setDeepseekConfigFile: () => Promise.resolve({ ok: true }),
    openDeepseekConfigDir: () => Promise.resolve(),

    getGitBranches: () => Promise.resolve({ ok: true, current: '', branches: [] }),
    switchGitBranch: () => Promise.resolve({ ok: true, current: '' }),
    createAndSwitchGitBranch: () => Promise.resolve({ ok: true, current: '' }),

    listEditors: () => Promise.resolve({ ok: true, editors: [] }),
    openEditorPath: () => Promise.resolve({ ok: true }),

    listWorkspaceDirectory: (opts) => {
      console.log('[dsGui:mock] listWorkspaceDirectory', opts)
      return Promise.resolve({ ok: true, entries: [] })
    },
    resolveWorkspaceFile: (opts) =>
      Promise.resolve({ ok: true, resolvedPath: opts?.relativePath || '' }),
    readWorkspaceFile: () => Promise.resolve({ ok: true, data: '' }),
    readWorkspaceImage: () => Promise.resolve({ ok: true, data: '', mimeType: 'image/png' }),
    writeWorkspaceFile: () => Promise.resolve({ ok: true }),
    createWorkspaceFile: () => Promise.resolve({ ok: true, path: '' }),
    createWorkspaceDirectory: () => Promise.resolve({ ok: true, path: '' }),
    saveWorkspaceClipboardImage: () => Promise.resolve({ ok: true, path: '' }),
    readClipboardImage: () => Promise.resolve({ ok: true, data: null }),
    renameWorkspaceEntry: () => Promise.resolve({ ok: true }),
    deleteWorkspaceEntry: () => Promise.resolve({ ok: true }),
    watchWorkspaceFile: () => Promise.resolve({ ok: true, watchId: 'mock' }),
    unwatchWorkspaceFile: () => Promise.resolve(true),

    onWorkspaceFileChanged: () => {
      const noop = () => {}
      return noop
    },

    exportWriteDocument: () => Promise.resolve({ ok: true, data: '', mimeType: '' }),
    copyWriteDocumentAsRichText: () => Promise.resolve({ ok: true }),
    requestWriteInlineCompletion: () =>
      Promise.resolve({ ok: true, completion: '' }),
    generateDocument: () =>
      Promise.resolve({ ok: true, content: '# AI 生成的文书\n\n（开发模拟模式）这是 AI 生成的文书内容。' }),
    listUserTemplates: () => Promise.resolve([]),
    saveUserTemplate: () => Promise.resolve({ ok: true }),
    deleteUserTemplate: () => Promise.resolve({ ok: true }),
    learnTemplateFromFile: () =>
      Promise.resolve({
        ok: true,
        name: '学习模板',
        description: '从上传文件学习生成的模板',
        content: '# {{title}}\n\n**当事人：** {{party}}\n\n{{content}}\n',
        fields: [
          { id: 'title', label: '标题', type: 'text', placeholder: '文书标题', required: true },
          { id: 'party', label: '当事人信息', type: 'textarea', placeholder: '当事人信息', required: true },
          { id: 'content', label: '文书内容', type: 'textarea', placeholder: '文书内容', required: true }
        ]
      }),
    generateDocumentFromTemplate: () =>
      Promise.resolve({ ok: true, content: '# 根据模板和材料生成的文书\n\n（开发模拟模式）这是 AI 根据模板和上传材料生成的文书内容。' }),
    listDocumentHistory: () => Promise.resolve([]),
    getDocumentHistoryRecord: () => Promise.resolve(null),
    saveDocumentHistoryRecord: () => Promise.resolve({ ok: true }),
    deleteDocumentHistoryRecord: () => Promise.resolve({ ok: true }),
    clearDocumentHistory: () => Promise.resolve({ ok: true }),
    listWriteInlineCompletionDebugEntries: () => Promise.resolve([]),
    clearWriteInlineCompletionDebugEntries: () => Promise.resolve(),

    startSse: () => Promise.resolve({ streamId: 'mock-stream' }),
    stopSse: () => Promise.resolve(true),

    onSseEvent: () => {
      const noop = () => {}
      return noop
    },
    onSseEnd: () => {
      const noop = () => {}
      return noop
    },
    onSseError: () => {
      const noop = () => {}
      return noop
    },

    onClawChannelActivity: () => {
      const noop = () => {}
      return noop
    },
    mirrorClawChannelMessage: () => Promise.resolve({ ok: true }),
    mirrorClawChannelMessageToFeishu: () => Promise.resolve({ ok: true }),
    createClawTaskFromText: () =>
      Promise.resolve({ ok: true, taskId: 'mock' }),
    createScheduleTaskFromText: () =>
      Promise.resolve({ ok: true, taskId: 'mock' }),

    runDesktopCommand: () => Promise.resolve({ ok: true }),

    openExternal: () => Promise.resolve(),

    showTurnCompleteNotification: () => Promise.resolve(),

    getAppVersion: () => Promise.resolve('0.1.0-dev'),
    getGuiUpdateState: () => Promise.resolve({ state: 'up-to-date' }),
    checkGuiUpdate: () => Promise.resolve({ ok: true, info: null }),
    downloadGuiUpdate: () => Promise.resolve({ ok: true }),
    installGuiUpdate: () => Promise.resolve({ ok: true }),
    onGuiUpdateState: () => {
      const noop = () => {}
      return noop
    },

    getDataComplianceStatus: () =>
      Promise.resolve({ ok: false, running: false, installing: false, baseUrl: '', message: 'dev mock' }),
    dataComplianceRequest: () => Promise.resolve({ ok: true, status: 200, body: '' }),
    submitDataComplianceTask: () => Promise.resolve({ ok: true }),

    startClawImInstallQr: () => Promise.resolve({ ok: false, message: 'dev mock' }),
    pollClawImInstall: () => Promise.resolve({ ok: false, message: 'dev mock' }),

    logError: () => Promise.resolve(),
    getLogPath: () => Promise.resolve(''),
    openLogDir: () => Promise.resolve()
  }

  console.log('[dsGui:mock] Dev mock injected. window.dsGui ready.')
})()
