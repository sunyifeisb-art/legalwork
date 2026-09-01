import { app, dialog, ipcMain, shell, type BrowserWindow, type WebContents } from 'electron'
import { watch, type FSWatcher } from 'node:fs'
import { createReadStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createGunzip } from 'node:zlib'
import { execSync, spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { dirname, extname, join } from 'node:path'
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { z } from 'zod'
import {
  type AppSettingsPatch,
  type AppSettingsV1,
  type ClawRunResult,
  type ClawTaskFromTextResult,
  type ClawRuntimeStatus,
  type ScheduleRunResult,
  type ScheduleRuntimeStatus,
  type ScheduleTaskFromTextResult,
  resolveLegalworkRuntimeSettings
} from '../../shared/app-settings'
import type {
  ClawImInstallPollResult,
  ClawImInstallQrResult,
  DesktopCommand,
  DataComplianceInstallProgress,
  DataComplianceRequestResult,
  DataComplianceStatus,
  DataComplianceSubmitPayload,
  RuntimeRequestResult,
  SystemNotificationResult,
  TurnCompleteNotificationPayload,
  UpstreamModelsResult,
  EndpointModelsResult,
  OptionalMcpInstallResult,
  LearningIterationActionResult,
  LearningIterationDetailResult,
  LearningIterationListResult,
  LearningIterationRuntimeStatus,
  WorkspacePickResult
} from '../../shared/ds-gui-api'
import type { GuiUpdateDownloadResult, GuiUpdateInfo, GuiUpdateInstallResult, GuiUpdateState } from '../../shared/gui-update'
import {
  clawMirrorPayloadSchema,
  clawImInstallPollPayloadSchema,
  clawTaskFromTextPayloadSchema,
  dataComplianceDownloadFilePayloadSchema,
  dataComplianceRequestPayloadSchema,
  dataComplianceSubmitPayloadSchema,
  deepseekConfigContentSchema,
  desktopCommandSchema,
  defaultPathSchema,
  gitBranchPayloadSchema,
  guiUpdateChannelSchema,
  knowledgeOpenFilePayloadSchema,
  knowledgeUploadFilePayloadSchema,
  logErrorPayloadSchema,
  notificationPayloadSchema,
  openEditorPathPayloadSchema,
  rootPathSchema,
  runtimeRequestPayloadSchema,
  scheduleTaskFromTextPayloadSchema,
  shellOpenExternalUrlSchema,
  skillListPayloadSchema,
  skillHubInstallPayloadSchema,
  skillHubListPayloadSchema,
  skillReadFilePayloadSchema,
  skillSaveFilePayloadSchema,
  settingsPatchSchema,
  streamIdSchema,
  workspaceDirectoryCreatePayloadSchema,
  workspaceClipboardImageSavePayloadSchema,
  workspaceDirectoryTargetPayloadSchema,
  workspaceEntryDeletePayloadSchema,
  workspaceEntryRenamePayloadSchema,
  workspaceFileCreatePayloadSchema,
  workspaceFileTargetPayloadSchema,
  workspaceFileWatchPayloadSchema,
  workspaceFileWritePayloadSchema,
  writeExportPayloadSchema,
  writeRichClipboardPayloadSchema,
  writeInlineCompletionPayloadSchema,
  documentGenerationPayloadSchema,
  workspaceRootSchema,
  userTemplateSchema,
  templateLearningRequestSchema,
  templateSourceSaveRequestSchema,
  templateGenerateWithMaterialsRequestSchema,
  documentMaterialExtractionPayloadSchema,
  documentHistoryRecordSchema
} from './app-ipc-schemas'
import type { JsonSettingsStore } from '../settings-store'
import type { ClawRuntime } from '../claw-runtime'
import type { ScheduleRuntime } from '../schedule-runtime'
import type { LearningIterationRuntime } from '../learning-iteration-runtime'
import {
  getRuntimeBaseUrlForSettings,
  runtimeAuthHeaders
} from '../runtime/legalwork-adapter'
import {
  resolveBundledImaMcpScriptPath,
  resolveLegalworkDataDir
} from '../legalwork-process'
import {
  firstSupportedStandalonePython,
  imaStandalonePythonCandidates
} from '../ima-python-runtime'
import {
  describePipIndexes,
  pipIndexArgs,
  resolvePipIndexCandidates,
  resolvePythonStandaloneUrls,
  runPipInstallWithFallback,
  selectReachablePipIndexes,
  type PipIndexCandidate
} from '../../../legalwork/src/shared/python-install-sources.js'
import { createAndSwitchGitBranch, getGitBranches, switchGitBranch } from '../services/git-service'
import {
  createWorkspaceDirectory,
  createWorkspaceFile,
  deleteWorkspaceEntry,
  expandHomePath,
  listEditorsResult,
  listWorkspaceDirectory,
  normalizeSkillFolderName,
  openEditorPath,
  openPathWithShell,
  readClipboardImage,
  readWorkspaceImage,
  readWorkspaceFile,
  readWorkspaceBinary,
  renameWorkspaceEntry,
  resolveWorkspaceFile,
  saveWorkspaceClipboardImage,
  writeWorkspaceFile
} from '../services/workspace-service'
import {
  clearWriteInlineCompletionDebugEntries,
  listWriteInlineCompletionDebugEntries,
  requestWriteInlineCompletion
} from '../services/write-inline-completion-service'
import { generateDocument } from '../services/document-generation-service'
import { learnTemplate } from '../services/template-learning-service'
import { generateFromTemplate } from '../services/template-generation-service'
import { extractDocumentMaterial } from '../services/document-material-service'
import {
  listTemplates,
  getTemplate,
  saveTemplate,
  saveTemplateSource,
  readTemplateSource,
  deleteTemplate,
  setTemplatesBaseDir
} from '../services/template-store-service'
import {
  listHistory,
  getHistoryRecord,
  saveHistoryRecord,
  deleteHistoryRecord,
  clearHistory,
  setHistoryBaseDir
} from '../services/document-history-service'
import { copyWriteDocumentAsRichText, exportWriteDocument } from '../services/write-export-service'
import {
  legalDocumentMarkdownToDocx,
  normalizeLegalDocxBuffer
} from '../services/legal-document-export-service'
import { fillDocxTemplateWithMarkdown } from '../services/template-docx-export-service'
import { exportMarkdownDocument } from '../services/markdown-export-service'
import { importGuiSkillFromPath, listGuiSkills, readGuiSkillFile } from '../services/skill-service'
import { installSkillHubSkill, listSkillHubSkills } from '../services/skillhub-service'
import { CodexAuthManager } from '../codex-auth-manager'
import { DEFAULT_PKULAW_MCP_CONFIG_TEXT } from '../pkulaw-default-servers'
import {
  loadImaAuth,
  clearImaAuth,
  clearImaLoginSession,
  captureImaAuthViaLogin,
  replaceImaAuthViaLogin,
  refreshImaAuth,
  credsFilePath,
  type ImaAuthStatus
} from '../ima-auth-manager'
import {
  claimPkulawDailyToken,
  openPkulawConsoleWindow,
  type PkulawClaimResult
} from '../pkulaw-auth-manager'
import { openYuandianConsoleWindow } from '../yuandian-auth-manager'
import { openTycConsoleWindow } from '../tyc-auth-manager'
import { openQccConsoleWindow } from '../qcc-auth-manager'
import { openWkConsoleWindow } from '../wk-auth-manager'
import {
  getPkulawAutoClaimState,
  setPkulawAutoClaimEnabled,
  startPkulawAutoClaimScheduler
} from '../pkulaw-auto-claim'

// ── IMA Cookie 自动刷新定时器 + 按需触发 ──

let imaRefreshTimer: ReturnType<typeof setInterval> | null = null
let imaRefreshInProgress = false

/** IMA 刷新触发文件路径（MCP Server 写，Electron 侦听） */
function imaRefreshTriggerPath(): string {
  return join(app.getPath('userData'), '.ima_refresh_trigger')
}

/** 启动 IMA 凭据定时刷新（每 2 小时）。仅当 IMA 已登录时有效。 */
function startImaRefreshTimer(): void {
  if (imaRefreshTimer) return
  const auth = loadImaAuth()
  if (!auth?.cookie || !auth?.bkn) return

  // 启动后立即刷新一次
  runImaRefresh()

  imaRefreshTimer = setInterval(() => {
    runImaRefresh()
  }, 120 * 60 * 1000)   // 2 小时
}

function stopImaRefreshTimer(): void {
  if (imaRefreshTimer) {
    clearInterval(imaRefreshTimer)
    imaRefreshTimer = null
  }
}

async function runImaRefresh(): Promise<void> {
  if (imaRefreshInProgress) return
  imaRefreshInProgress = true
  try {
    await refreshImaAuth()
  } catch {
    // 静默失败，下次定时器还会重试
  } finally {
    imaRefreshInProgress = false
  }
}

type GuiUpdaterModule = typeof import('../gui-updater')

type WorkspaceFileWatchRecord = {
  watcher: FSWatcher
  sender: WebContents
  path: string
  workspaceRoot: string
  timer: ReturnType<typeof setTimeout> | null
}

type RegisterAppIpcHandlersOptions = {
  store: JsonSettingsStore
  getMainWindow: () => BrowserWindow | null
  applySettingsPatch: (partial: AppSettingsPatch) => Promise<AppSettingsV1>
  runtimeRequest: (
    path: string,
    method?: string,
    body?: string
  ) => Promise<RuntimeRequestResult>
  reconnectRuntime: () => Promise<AppSettingsV1>
  fetchUpstreamModels: () => Promise<UpstreamModelsResult>
  fetchEndpointModels: (
    baseUrl: string,
    apiKey: string,
    options?: { providerId?: string; endpointFormat?: string }
  ) => Promise<EndpointModelsResult>
  getClawRuntime: () => ClawRuntime | null
  getScheduleRuntime: () => ScheduleRuntime | null
  getLearningIterationRuntime?: () => LearningIterationRuntime | null
  startFeishuInstallQrcode: (isLark: boolean) => Promise<ClawImInstallQrResult>
  pollFeishuInstall: (deviceCode: string) => Promise<ClawImInstallPollResult>
  startWeixinInstallQrcode: (weixinBridgeUrl?: string) => Promise<ClawImInstallQrResult>
  pollWeixinInstall: (deviceCode: string, weixinBridgeUrl?: string) => Promise<ClawImInstallPollResult>
  resolveLegalworkConfigPath: () => string
  onLegalworkMcpConfigWritten?: (path: string, content: string) => Promise<void> | void
  showTurnCompleteNotification: (
    payload: TurnCompleteNotificationPayload
  ) => Promise<SystemNotificationResult>
  getAppVersion: () => string
  readGuiUpdateState: () => Promise<GuiUpdateState>
  loadGuiUpdaterModule: () => Promise<GuiUpdaterModule>
  resolveLogDirectory: () => string
  logError: (category: string, message: string, detail?: unknown) => void
}

function parseIpcPayload<T>(channel: string, schema: z.ZodType<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload)
  if (parsed.success) return parsed.data
  const issue = parsed.error.issues[0]
  throw new Error(`Invalid payload for ${channel}: ${issue?.message ?? 'Bad request.'}`)
}

function validateMcpConfigContent(content: string): void {
  const trimmed = content.trim()
  if (!trimmed) return
  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed) as unknown
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`MCP config must be JSON: ${message}`)
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('MCP config must be a JSON object.')
  }
}

function runDesktopCommand(
  command: DesktopCommand,
  sender: WebContents,
  getMainWindow: () => BrowserWindow | null
): void {
  const mainWindow = getMainWindow()
  const contents = mainWindow && !mainWindow.isDestroyed() ? mainWindow.webContents : sender

  switch (command) {
    case 'undo':
      contents.undo()
      return
    case 'redo':
      contents.redo()
      return
    case 'cut':
      contents.cut()
      return
    case 'copy':
      contents.copy()
      return
    case 'paste':
      contents.paste()
      return
    case 'selectAll':
      contents.selectAll()
      return
    case 'reload':
      contents.reload()
      return
    case 'zoomIn':
      contents.setZoomLevel(contents.getZoomLevel() + 1)
      return
    case 'zoomOut':
      contents.setZoomLevel(contents.getZoomLevel() - 1)
      return
    case 'resetZoom':
      contents.setZoomLevel(0)
      return
    case 'toggleDevTools':
      contents.toggleDevTools()
      return
    case 'minimize':
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize()
      return
    case 'toggleMaximize':
      if (!mainWindow || mainWindow.isDestroyed()) return
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
      return
    case 'close':
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close()
      return
    case 'quit':
      app.quit()
      return
  }
}

export function registerAppIpcHandlers(options: RegisterAppIpcHandlersOptions): void {
  const {
    store,
    getMainWindow,
    applySettingsPatch,
    runtimeRequest,
    reconnectRuntime,
    fetchUpstreamModels,
    fetchEndpointModels,
    getClawRuntime,
    getScheduleRuntime,
    getLearningIterationRuntime = () => null,
    startFeishuInstallQrcode,
    pollFeishuInstall,
    startWeixinInstallQrcode,
    pollWeixinInstall,
    resolveLegalworkConfigPath,
    onLegalworkMcpConfigWritten,
    showTurnCompleteNotification,
    getAppVersion,
    readGuiUpdateState,
    loadGuiUpdaterModule,
    resolveLogDirectory,
    logError
  } = options
  const codexAuthManager = new CodexAuthManager()
  const workspaceFileWatchers = new Map<string, WorkspaceFileWatchRecord>()

  const disposeWorkspaceFileWatch = (watchId: string): boolean => {
    const record = workspaceFileWatchers.get(watchId)
    if (!record) return false
    if (record.timer) clearTimeout(record.timer)
    try {
      record.watcher.close()
    } catch (error) {
      logError('workspace-watch', 'Failed to close workspace file watcher', {
        watchId,
        message: error instanceof Error ? error.message : String(error)
      })
    }
    workspaceFileWatchers.delete(watchId)
    return true
  }

  const disposeWorkspaceFileWatchesForSender = (sender: WebContents): void => {
    for (const [watchId, record] of workspaceFileWatchers) {
      if (record.sender.id === sender.id) {
        disposeWorkspaceFileWatch(watchId)
      }
    }
  }

  const emitWorkspaceFileChange = async (watchId: string): Promise<void> => {
    const record = workspaceFileWatchers.get(watchId)
    if (!record) return
    const changedAt = new Date().toISOString()
    try {
      const result = await readWorkspaceFile({
        path: record.path,
        workspaceRoot: record.workspaceRoot
      })
      const latest = workspaceFileWatchers.get(watchId)
      if (!latest || latest.sender.isDestroyed()) return
      if (result.ok) {
        latest.sender.send('file:workspace-changed', {
          ok: true,
          watchId,
          workspaceRoot: latest.workspaceRoot,
          path: result.path,
          content: result.content,
          size: result.size,
          truncated: result.truncated,
          changedAt
        })
        return
      }
      latest.sender.send('file:workspace-changed', {
        ok: false,
        watchId,
        workspaceRoot: latest.workspaceRoot,
        path: latest.path,
        message: result.message,
        changedAt
      })
    } catch (error) {
      const latest = workspaceFileWatchers.get(watchId)
      if (!latest || latest.sender.isDestroyed()) return
      latest.sender.send('file:workspace-changed', {
        ok: false,
        watchId,
        workspaceRoot: latest.workspaceRoot,
        path: latest.path,
        message: error instanceof Error ? error.message : String(error),
        changedAt
      })
    }
  }

  const scheduleWorkspaceFileChange = (watchId: string): void => {
    const record = workspaceFileWatchers.get(watchId)
    if (!record) return
    if (record.timer) clearTimeout(record.timer)
    record.timer = setTimeout(() => {
      const latest = workspaceFileWatchers.get(watchId)
      if (!latest) return
      latest.timer = null
      void emitWorkspaceFileChange(watchId)
    }, 90)
  }

  ipcMain.handle('settings:get', async () => store.load())
  ipcMain.handle('settings:set', async (_, partial: unknown) =>
    applySettingsPatch(
      parseIpcPayload('settings:set', settingsPatchSchema, partial) as AppSettingsPatch
    )
  )

  ipcMain.handle('runtime:request', async (_, payload: unknown) => {
    const request = parseIpcPayload('runtime:request', runtimeRequestPayloadSchema, payload)
    return runtimeRequest(request.path, request.method, request.body)
  })
  ipcMain.handle('runtime:reconnect', async () => reconnectRuntime())
  ipcMain.handle('codex:auth-status', async (_, payload: unknown) => {
    const parsed = z.object({ refreshToken: z.boolean().optional() }).strict().parse(payload ?? {})
    return codexAuthManager.status(await store.load(), parsed.refreshToken === true)
  })
  ipcMain.handle('codex:auth-login', async () =>
    codexAuthManager.login(await store.load(), getMainWindow())
  )
  ipcMain.handle('codex:auth-logout', async () =>
    codexAuthManager.logout(await store.load())
  )

  ipcMain.handle('upstream:models', async () => fetchUpstreamModels())
  ipcMain.handle('upstream:models-for-endpoint', async (_, payload: unknown) => {
    const body = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
    const baseUrl = typeof body.baseUrl === 'string' ? body.baseUrl : ''
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey : ''
    const providerId = typeof body.providerId === 'string' ? body.providerId : undefined
    const endpointFormat = typeof body.endpointFormat === 'string' ? body.endpointFormat : undefined
    return fetchEndpointModels(baseUrl, apiKey, { providerId, endpointFormat })
  })

  // 将旧 Flask API 路径映射到主 LegalWork runtime 的 /data-compliance 路径。
  // 这样前端在过渡期可以继续使用 /api/history、/api/result/:id 等旧路径。
  function translateDataCompliancePath(path: string): string {
    // /api/history/:id (DELETE) -> /data-compliance/tasks/:id
    const historyDeleteMatch = /^\/api\/history\/([^/]+)$/.exec(path)
    if (historyDeleteMatch) {
      return `/data-compliance/tasks/${encodeURIComponent(historyDeleteMatch[1])}`
    }
    // /api/history -> /data-compliance/tasks
    if (path === '/api/history') return '/data-compliance/tasks'
    // /api/result/:id -> /data-compliance/tasks/:id
    const resultMatch = /^\/api\/result\/([^/]+)$/.exec(path)
    if (resultMatch) {
      return `/data-compliance/tasks/${encodeURIComponent(resultMatch[1])}`
    }
    // /api/download/:id/:fileType 和 /api/desensitize/download/:id/:fileType -> /data-compliance/tasks/:id/files/:fileKey
    const downloadMatch = /^\/api(?:\/desensitize)?\/download\/([^/]+)\/([^/]+)$/.exec(path)
    if (downloadMatch) {
      return `/data-compliance/tasks/${encodeURIComponent(downloadMatch[1])}/files/${encodeURIComponent(downloadMatch[2])}`
    }
    // 已经使用新路径的直接放行
    if (path.startsWith('/data-compliance/')) return path
    return path
  }

  // Inline data-compliance path helpers so the main process installs the venv
  // and requirements into the exact same locations the runtime service uses.
  function resolveDataComplianceVenvDir(dataDir: string): string {
    return join(dataDir, 'data-compliance', 'python-venv')
  }

  function resolveDataComplianceVenvPython(venvDir: string): string {
    return process.platform === 'win32'
      ? join(venvDir, 'Scripts', 'python.exe')
      : join(venvDir, 'bin', 'python')
  }

  function resolveDataComplianceWebRootCandidates(): string[] {
    const appRoot = app.isPackaged
      ? app.getAppPath().replace(/app\.asar$/, 'app.asar.unpacked')
      : app.getAppPath()
    const bundleRoot = 'vendor/data-compliance-review-codex/data-compliance-web'
    return [
      join(appRoot, 'app.asar.unpacked', bundleRoot),
      join(appRoot, bundleRoot),
      join(appRoot, '..', bundleRoot),
      join(process.cwd(), bundleRoot)
    ]
  }

  let dataComplianceInstalling = false

  async function installDataComplianceEnvironment(
    event: Electron.IpcMainInvokeEvent,
    getInstallingFlag: () => boolean
  ): Promise<boolean> {
    const setInstalling = (value: boolean): void => {
      dataComplianceInstalling = value
    }

    const sendProgress = (progress: DataComplianceInstallProgress): void => {
      const win = getMainWindow()
      const contents = win && !win.isDestroyed() ? win.webContents : event.sender
      if (!contents.isDestroyed()) {
        contents.send('data-compliance:install-progress', progress)
      }
    }

    if (getInstallingFlag()) return true
    setInstalling(true)

    try {
      // Resolve paths using the same logic as the runtime service.
      const settings = await store.load()
      const runtime = resolveLegalworkRuntimeSettings(settings)
      const dataDir = resolveLegalworkDataDir(runtime)
      const venvDir = resolveDataComplianceVenvDir(dataDir)
      const venvPython = resolveDataComplianceVenvPython(venvDir)
      const standaloneCandidates = imaStandalonePythonCandidates(
        app.getPath('userData'),
        dataDir,
        process.platform
      )
      const webRoot = resolveDataComplianceWebRootCandidates()
        .find((candidate) => existsSync(join(candidate, 'requirements.txt'))) ??
        resolveDataComplianceWebRootCandidates()[0]
      const requirementsPath = join(webRoot, 'requirements.txt')

      // 1. Detect Python
      sendProgress({ step: 'detecting', percent: 5, message: '正在检测 Python 3.10-3.12 环境…' })
      let pythonCmd = await firstSupportedStandalonePython(
        standaloneCandidates,
        async (candidate) => existsSync(candidate) && await isSupportedPythonExecutable(candidate)
      ) ?? await resolvePythonForCompliance()

      // Windows: auto-download and install Python if not found.
      if (!pythonCmd && process.platform === 'win32') {
        pythonCmd = await downloadAndInstallPythonWindows(sendProgress)
      }

      // macOS / Linux: auto-download a portable Python build if not found.
      if (!pythonCmd && process.platform === 'darwin') {
        pythonCmd = await downloadAndInstallPythonMacOS(sendProgress)
      }
      if (!pythonCmd && process.platform === 'linux') {
        pythonCmd = await downloadAndInstallPythonLinux(sendProgress)
      }

      if (!pythonCmd) {
        sendProgress({
          step: 'error',
          percent: 0,
          message: '未找到 Python 3.10-3.12，自动安装失败。请检查网络连接后重试，或使用内置 Python 3.11 安装包。'
        })
        return false
      }

      // 2. Create venv, install deps, verify imports. Paddle 2.x/3.x mixed
      //    installs (orphan files from an old paddle that pip cannot remove)
      //    fail import verification with bwd_graph_utils; rebuild the venv
      //    once automatically so the user needs no manual cleanup step.
      const requiredImports = [
        'flask',
        'docx',
        'fitz',
        'openpyxl',
        'pptx',
        'pypdf',
        'pandas',
        'PIL',
        'paddle',
        'paddleocr',
        'pytesseract'
      ]
      let rebuildCount = 0
      for (;;) {
        if (existsSync(venvPython) && !(await isSupportedPythonExecutable(venvPython))) {
          sendProgress({ step: 'venv', percent: 34, message: '检测到旧版 Python 虚拟环境，正在重建…' })
          // The venv python.exe may still be referenced on Windows; kill first, then retry removal.
          killProcessesUsingDirectory(venvDir)
          await rmPathWithRetry(venvDir)
        }
        if (!existsSync(venvPython)) {
          sendProgress({ step: 'venv', percent: 35, message: '正在创建 Python 虚拟环境…' })
          mkdirSync(venvDir, { recursive: true })
          const venvResult = await runCommand(pythonCmd, ['-m', 'venv', venvDir])
          if (venvResult.exitCode !== 0) {
            sendProgress({
              step: 'error',
              percent: 0,
              message: `创建 venv 失败: ${venvResult.stderr || venvResult.stdout || '未知错误'}`
            })
            return false
          }
        }

        // 3. Install dependencies via pip with per-package progress.
        //    PaddlePaddle/PaddleOCR are large and a slow or blocked index is
        //    by far the most common reason this fails. Probing first tells
        //    "mirror is dead" apart from "mirror is slow", so the pip attempts
        //    we do spend land on hosts that actually answered.
        if (!existsSync(requirementsPath)) break
        const reqText = readFileSync(requirementsPath, 'utf8')
        const reqLines = reqText.split('\n').filter((l: string) => l.trim() && !l.trim().startsWith('#')).length
        sendProgress({ step: 'installing', percent: 35, message: '正在检测可用的依赖下载源…' })
        const pipCandidates = await selectReachablePipIndexes(resolvePipIndexCandidates())

        const runPipInstall = async (candidate: PipIndexCandidate): Promise<boolean> => {
          sendProgress({ step: 'installing', percent: 36, message: `正在从 ${candidate.label} 下载并安装 ${reqLines} 个 Python 依赖包（首次需要几分钟）…` })
          let completedPkgs = 0
          const result = await runCommand(
            venvPython,
            ['-m', 'pip', 'install', '-r', requirementsPath, '--verbose', ...pipIndexArgs(candidate)],
            {
              cwd: webRoot,
              timeout: 900_000,
              onStderr: (line: string) => {
                // pip verbose output: "Collecting package_name==version" or "Installing collected packages: ..."
                const collectMatch = line.match(/^Collecting\s+(\S+)/)
                const installMatch = line.match(/^(Successfully installed|Installing collected packages)/)
                if (collectMatch || installMatch) completedPkgs += 1
                const pct = Math.min(88, 36 + Math.round((completedPkgs / Math.max(reqLines, 1)) * 52))
                sendProgress({ step: 'installing', percent: pct, message: `正在安装依赖包 (${Math.min(completedPkgs, reqLines)}/${reqLines})…` })
              }
            }
          )
          return result.exitCode === 0
        }

        const pipOutcome = await runPipInstallWithFallback({
          candidates: pipCandidates,
          attempt: runPipInstall,
          succeeded: (ok) => ok,
          onSwitch: () => {
            sendProgress({ step: 'installing', percent: 36, message: '当前下载源不可用，正在切换备用下载源…' })
          }
        })
        if (!pipOutcome.succeededWith) {
          sendProgress({
            step: 'error',
            percent: 0,
            message: `安装 Python 依赖失败：已依次尝试 ${describePipIndexes(pipOutcome.attempted)} 均未成功。请检查网络后重试，或设置 LEGALWORK_PIP_INDEX_URL 指定可用的镜像源。`
          })
          return false
        }

        sendProgress({ step: 'installing', percent: 92, message: '正在校验数据合规运行环境…' })
        const verifyResult = await runCommand(
          venvPython,
          ['-c', requiredImports.map((name) => `import ${name}`).join('\n')],
          { cwd: webRoot, timeout: 120_000 }
        )
        if (verifyResult.exitCode !== 0) {
          const verifyText = verifyResult.stderr || verifyResult.stdout || '未知错误'
          // Paddle 新旧版本文件残留混装（2.x 与 3.x 并存）会报
          // "cannot import name 'capture_backward_subgraph_guard' from 'paddle.utils.bwd_graph_utils'"。
          // pip 升级无法清理不属于新 wheel 清单的孤儿文件，必须重建 venv 才能修复。
          const isPaddleMixedInstall =
            /cannot import name [\s\S]{0,120}bwd_graph_utils|capture_backward_subgraph_guard/.test(verifyText)
          if (isPaddleMixedInstall && rebuildCount === 0) {
            rebuildCount += 1
            sendProgress({
              step: 'venv',
              percent: 34,
              message: '检测到 PaddleOCR 依赖损坏（paddle 新旧版本混装），正在自动重建 Python 环境并重新安装，请稍候…'
            })
            killProcessesUsingDirectory(venvDir)
            await rmPathWithRetry(venvDir)
            continue
          }
          sendProgress({
            step: 'error',
            percent: 0,
            message: isPaddleMixedInstall
              ? `PaddleOCR 依赖损坏，自动重建后仍无法恢复，请删除目录 ${venvDir} 后重试。`
              : `Python 依赖校验失败: ${verifyText}`
          })
          return false
        }
        break
      }

      // 4. Done
      sendProgress({ step: 'done', percent: 100, message: 'Python 环境安装完成' })

      // Recheck backend environment.
      try {
        await runtimeRequest('/data-compliance/environment', 'GET')
      } catch {
        // ignore
      }

      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      sendProgress({ step: 'error', percent: 0, message: `环境安装异常: ${message}` })
      return false
    } finally {
      setInstalling(false)
    }
  }

  async function downloadAndInstallPythonWindows(
    sendProgress: (progress: DataComplianceInstallProgress) => void
  ): Promise<string | null> {
    // Use the portable python-build-standalone build (same as macOS/Linux) instead of the
    // python.org silent installer. The .exe installer is fragile under /quiet — it can fail
    // with installer exit codes (e.g. 1392 ERROR_FILE_CORRUPT) due to elevation requirements,
    // registry state, or a corrupt cached download. The standalone tarball needs no admin
    // rights, touches no registry/PATH, and unpacks straight into userData.
    return downloadAndInstallPythonBuildStandalone(sendProgress, 'Windows')
  }

  // Standalone CPython sources (domestic mirror first, GitHub last) live in
  // ../../../legalwork/src/shared/python-install-sources.ts so the embedded
  // legalwork server resolves them the same way.

  async function downloadFileWithProgress(
    url: string,
    destPath: string,
    onProgress: (downloaded: number, total: number) => void,
    redirectCount = 0
  ): Promise<void> {
    const https = await import('node:https')
    const http = await import('node:http')
    const { createWriteStream } = await import('node:fs')
    const { mkdirSync } = await import('node:fs')
    const { dirname } = await import('node:path')
    mkdirSync(dirname(destPath), { recursive: true })

    if (redirectCount > 5) {
      throw new Error('下载重定向次数过多')
    }

    const client = url.startsWith('https:') ? https : http

    await new Promise<void>((resolve, reject) => {
      const file = createWriteStream(destPath)
      const request = client
        .get(url, { timeout: 120_000 }, (response) => {
          const statusCode = response.statusCode ?? 0
          if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
            file.destroy()
            const redirectUrl = new URL(response.headers.location, url).toString()
            downloadFileWithProgress(redirectUrl, destPath, onProgress, redirectCount + 1)
              .then(resolve)
              .catch(reject)
            return
          }
          if (response.statusCode !== 200) {
            file.destroy()
            reject(new Error(`下载失败: HTTP ${response.statusCode}`))
            return
          }
          const total = parseInt(response.headers['content-length'] || '0', 10)
          let downloaded = 0
          response.on('data', (chunk: Buffer) => {
            downloaded += chunk.length
            if (total > 0) {
              onProgress(downloaded, total)
            }
          })
          response.pipe(file)
          file.on('finish', () => {
            file.close()
            // 完整性校验：声明了 content-length 但收到的字节不足 = 下载被截断。
            // 损坏的 tar.gz 会导致解压报 "truncated gzip input"，且会被当作
            // 有效缓存反复解压同一坏文件。这里宁可抛错重试，也不缓存坏文件。
            if (total > 0 && downloaded < total) {
              file.destroy()
              reject(new Error(`下载不完整: 已接收 ${downloaded} / ${total} 字节，文件可能被截断`))
              return
            }
            resolve()
          })
          file.on('error', reject)
        })
        .on('error', (error) => {
          file.destroy()
          reject(error)
        })
        .on('timeout', () => {
          request.destroy()
          reject(new Error('下载超时，请检查网络连接。'))
        })
    })
  }

  async function extractTarGz(tarPath: string, destDir: string): Promise<void> {
    mkdirSync(destDir, { recursive: true })
    const result = await runCommand('tar', ['-xzf', tarPath, '-C', destDir, '--strip-components=1'])
    if (result.exitCode !== 0) {
      throw new Error(`解压 Python 失败: ${result.stderr || result.stdout || '未知错误'}`)
    }
  }

  /**
   * Verify a gzip file is intact by decompressing it in-memory.
   *
   * Used to detect truncated/corrupt tar.gz downloads (content-length can match
   * even when bytes were damaged in transit, and a missing content-length skips
   * the download byte-count check entirely). Must use Node's built-in zlib
   * rather than an external `gzip -t`: Windows ships no gzip executable, so the
   * command would fail with ENOENT and be misread as "archive corrupt", deleting
   * and re-downloading a perfectly good cached tarball.
   */
  const GZIP_VERIFY_TIMEOUT_MS = 30_000
  /**
   * Verify a gzip file is intact by decompressing it in-memory.
   *
   * Used to detect truncated/corrupt tar.gz downloads (content-length can match
   * even when bytes were damaged in transit, and a missing content-length skips
   * the download byte-count check entirely). Must use Node's built-in zlib
   * rather than an external `gzip -t`: Windows ships no gzip executable, so the
   * command would fail with ENOENT and be misread as "archive corrupt", deleting
   * and re-downloading a perfectly good cached tarball.
   *
   * A timeout guards against a stalled stream that never emits end/error (e.g.
   * disk IO wedged) — without it the returned Promise never settles and the
   * install hangs at "正在解压 Python…" forever. On timeout we treat the file
   * as corrupt so the caller re-downloads it.
   */
  function verifyGzipIntegrity(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      let settled = false
      let readStream: ReturnType<typeof createReadStream> | null = null
      let gunzip: ReturnType<typeof createGunzip> | null = null
      const settle = (ok: boolean): void => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        readStream?.destroy()
        gunzip?.destroy()
        resolve(ok)
      }
      const timer = setTimeout(() => settle(false), GZIP_VERIFY_TIMEOUT_MS)
      timer.unref?.()
      try {
        readStream = createReadStream(filePath)
        gunzip = createGunzip()
        gunzip.on('error', () => settle(false))
        readStream.on('error', () => settle(false))
        gunzip.on('end', () => settle(true))
        // Drain decompressed output; without a consumer the transform buffers,
        // backpressure stalls the pipe and 'end' never fires on large archives.
        gunzip.resume()
        readStream.pipe(gunzip)
      } catch {
        settle(false)
      }
    })
  }

  /**
   * Force-kill any process whose command line references the given directory.
   *
   * On Windows, python-build-standalone DLLs (e.g. DLLs\libcrypto-*.dll) are
   * locked while a data-compliance Python subprocess is alive; rmSync then fails
   * with EPERM when we try to reinstall Python. Kill those processes first so
   * the directory can be removed. Non-fatal on macOS/Linux (same lock semantics
   * apply for loaded shared objects, but pgrep covers the common cases).
   */
  function killProcessesUsingDirectory(dirPath: string): void {
    try {
      // Escape the path so it cannot break out of the string literal / pattern
      // (defense against command injection and over-broad matches). The data
      // dir is user-configurable, so treat it as untrusted input.
      if (process.platform === 'win32') {
        // PowerShell single-quote escaping: '' inside a single-quoted literal.
        const escaped = dirPath.replace(/'/g, "''")
        // ExecutablePath may be empty for some processes; CommandLine matches the
        // python.exe path even when launched via pythonw or a venv shim.
        const script =
          `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*${escaped}*' } ` +
          `| ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`
        execSync(`powershell -NoProfile -NonInteractive -Command "${script}"`, {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 20_000,
          windowsHide: true
        })
      } else {
        // Escape double quotes and backslashes for the shell, and match the
        // python interpreter path (python3/python) under the target directory to
        // avoid killing unrelated processes whose command line merely contains
        // the data dir as a substring.
        const escaped = dirPath.replace(/["\\$`]/g, '\\$&')
        const pids = execSync(`pgrep -f "${escaped}/python"`, {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore']
        })
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
        for (const pid of pids) {
          try {
            process.kill(Number(pid), 'SIGKILL')
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // No process matched (or pgrep not available); nothing to kill.
    }
  }

  /**
   * Remove a directory tree, retrying on Windows file-lock errors.
   *
   * EPERM/EBUSY on win32 usually means a DLL or executable is still referenced
   * (antivirus scanning or a briefly held handle), which resolves within a few
   * hundred ms to seconds. Retry with backoff before surfacing the error.
   */
  async function rmPathWithRetry(targetPath: string, maxAttempts = 8, delayMs = 500): Promise<void> {
    let lastError: unknown
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        rmSync(targetPath, { recursive: true, force: true })
        return
      } catch (error) {
        lastError = error
        const code = (error as NodeJS.ErrnoException)?.code
        if (code === 'EPERM' || code === 'EBUSY' || code === 'ENOTEMPTY') {
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
          continue
        }
        throw error
      }
    }
    throw lastError
  }

  async function downloadAndInstallPythonBuildStandalone(
    sendProgress: (progress: DataComplianceInstallProgress) => void,
    platformLabel: string
  ): Promise<string | null> {
    const tmpDir = join(app.getPath('userData'), 'data-compliance', 'tmp')
    const installDir = join(app.getPath('userData'), 'data-compliance', 'python-standalone')
    mkdirSync(tmpDir, { recursive: true })

    const urls = resolvePythonStandaloneUrls()
    if (urls.length === 0) {
      throw new Error(`当前平台 ${process.platform} (${process.arch}) 不支持自动安装 Python。`)
    }

    const fileName = `python-standalone-${process.platform}-${process.arch}.tar.gz`
    const tarPath = join(tmpDir, fileName)

    // Walk every source in turn (domestic mirror first, GitHub last) and retry
    // each one twice: a single host that is slow or blocked would otherwise
    // abort the whole environment install.
    const downloadPythonTarball = async (
      onProgress: (downloaded: number, total: number) => void
    ): Promise<void> => {
      const ATTEMPTS_PER_URL = 2
      let lastDownloadError: unknown = null
      for (const [urlIndex, url] of urls.entries()) {
        for (let attempt = 1; attempt <= ATTEMPTS_PER_URL; attempt += 1) {
          try {
            await downloadFileWithProgress(url, tarPath, onProgress)
            return
          } catch (error) {
            lastDownloadError = error
            // Clean up partial download so the next attempt starts fresh.
            try {
              rmSync(tarPath, { force: true })
            } catch {
              // ignore
            }
            const moreAttemptsHere = attempt < ATTEMPTS_PER_URL
            const moreSourcesLeft = urlIndex < urls.length - 1
            if (moreAttemptsHere || moreSourcesLeft) {
              sendProgress({
                step: 'detecting',
                percent: 10 + Math.min(urlIndex * 2 + attempt, 8),
                message: moreAttemptsHere
                  ? `下载失败，正在重试 (${attempt}/${ATTEMPTS_PER_URL})…`
                  : '当前下载源不可用，正在切换备用下载源…'
              })
              await new Promise((resolve) => setTimeout(resolve, 1_000 * attempt))
            }
          }
        }
      }
      throw lastDownloadError ?? new Error('Python 下载失败')
    }

    // Download if not cached.
    if (!existsSync(tarPath)) {
      sendProgress({ step: 'detecting', percent: 10, message: `未找到 Python，正在下载 ${platformLabel} 版 Python…` })
      await downloadPythonTarball((downloaded, total) => {
        const percent = Math.round((downloaded / total) * 20) // 10-30%
        sendProgress({
          step: 'detecting',
          percent,
          message: `正在下载 Python (${Math.round(downloaded / 1024 / 1024)}MB / ${Math.round(total / 1024 / 1024)}MB)…`
        })
      })
    }

    // Stop any running data-compliance subprocess that may lock the DLLs
    // (Windows EPERM on unlink), then clean the previous extraction.
    sendProgress({ step: 'detecting', percent: 32, message: '正在解压 Python…' })
    killProcessesUsingDirectory(installDir)
    if (existsSync(installDir)) {
      await rmPathWithRetry(installDir)
    }
    // 解压失败时删除损坏的 tar.gz 缓存并重新下载解压，避免卡在同一个坏文件上。
    const MAX_EXTRACT_ATTEMPTS = 3
    let lastExtractError: unknown = null
    for (let attempt = 1; attempt <= MAX_EXTRACT_ATTEMPTS; attempt += 1) {
      // 先做 gzip 完整性校验（content-length 匹配也可能在传输中损坏字节）。
      // 用 Node 内置 zlib（跨平台），不能用外部 gzip 命令——Windows 无 gzip。
      const gzipOk = await verifyGzipIntegrity(tarPath)
      if (!gzipOk) {
        try {
          rmSync(tarPath, { force: true })
        } catch {
          // ignore
        }
        try {
          sendProgress({
            step: 'detecting',
            percent: 32,
            message: `Python 压缩包损坏，正在重新下载 (${attempt}/${MAX_EXTRACT_ATTEMPTS})…`
          })
          await downloadPythonTarball(() => {})
          lastExtractError = null
          continue
        } catch (error) {
          lastExtractError = error
          if (attempt < MAX_EXTRACT_ATTEMPTS) continue
          break
        }
      }
      try {
        await extractTarGz(tarPath, installDir)
        lastExtractError = null
        break
      } catch (error) {
        lastExtractError = error
        // Clean up broken extraction so retry can start fresh.
        try {
          await rmPathWithRetry(installDir)
        } catch {
          // ignore
        }
        // 坏 tar 缓存会导致每次都解压同一损坏文件——删掉它，下次走重新下载。
        try {
          rmSync(tarPath, { force: true })
        } catch {
          // ignore
        }
        if (attempt < MAX_EXTRACT_ATTEMPTS) {
          sendProgress({
            step: 'detecting',
            percent: 32,
            message: `解压失败，正在重新下载 Python (${attempt}/${MAX_EXTRACT_ATTEMPTS})…`
          })
          continue
        }
      }
    }
    if (lastExtractError) {
      throw lastExtractError
    }

    // Verify.
    sendProgress({ step: 'detecting', percent: 33, message: '正在验证 Python 安装…' })
    const pythonPath =
      process.platform === 'win32'
        ? join(installDir, 'python.exe')
        : join(installDir, 'bin', 'python3')
    if (!existsSync(pythonPath)) {
      throw new Error('Python 解压后未找到可执行文件')
    }
    const verify = await runCommand(pythonPath, ['--version'])
    if (verify.exitCode !== 0 || !isSupportedDataCompliancePythonVersion(`${verify.stdout}\n${verify.stderr}`)) {
      throw new Error(`Python 验证失败，需要 Python 3.10-3.12，当前输出: ${verify.stderr || verify.stdout || '未知'}`)
    }

    sendProgress({ step: 'detecting', percent: 34, message: 'Python 已就绪' })
    return pythonPath
  }

  async function downloadAndInstallPythonMacOS(
    sendProgress: (progress: DataComplianceInstallProgress) => void
  ): Promise<string | null> {
    return downloadAndInstallPythonBuildStandalone(sendProgress, 'macOS')
  }

  async function downloadAndInstallPythonLinux(
    sendProgress: (progress: DataComplianceInstallProgress) => void
  ): Promise<string | null> {
    return downloadAndInstallPythonBuildStandalone(sendProgress, 'Linux')
  }

  ipcMain.handle('data-compliance:status', async (event): Promise<DataComplianceStatus> => {
    try {
      const result = await runtimeRequest('/data-compliance/environment', 'GET')
      if (!result.ok) {
        const parsed = JSON.parse(result.body || '{}') as { error?: string; fix?: string }
        // status 0 is a transport/probe failure (for example, the backend is
        // still starting or a cold Python import exceeded the request timeout).
        // It is not evidence that the managed environment is missing. Starting
        // an installer here can race the running Python process and fail while
        // deleting loaded DLLs on Windows (EPERM: unlink libcrypto-3-x64.dll).
        if (result.status === 0) {
          return {
            ok: false,
            running: false,
            installing: dataComplianceInstalling,
            baseUrl: '',
            message: parsed.error || '数据合规环境检测暂时不可用，请稍后重试'
          }
        }
        // Auto-trigger silent install whenever the environment is not ready.
        // The install function itself will skip already-completed steps (Python, venv, deps).
        if (!dataComplianceInstalling) {
          void installDataComplianceEnvironment(event, () => dataComplianceInstalling)
            .then((ok) => {
              if (!ok) {
                console.error('[data-compliance:status] auto-install failed')
              }
            })
            .catch((error) => {
              console.error('[data-compliance:status] auto-install error:', error)
            })
          return {
            ok: false,
            running: false,
            installing: true,
            baseUrl: '',
            message: parsed.error || '正在自动安装 Python 环境，请稍候…'
          }
        }
        return {
          ok: false,
          running: false,
          installing: dataComplianceInstalling,
          baseUrl: '',
          message: parsed.error || '数据合规服务不可用'
        }
      }
      const parsed = JSON.parse(result.body || '{}') as { python?: string }
      return {
        ok: true,
        running: true,
        installing: false,
        baseUrl: '',
        message: parsed.python ? `Python: ${parsed.python}` : undefined
      }
    } catch (error) {
      return {
        ok: false,
        running: false,
        installing: dataComplianceInstalling,
        baseUrl: '',
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })

  ipcMain.handle('data-compliance:install', async (event): Promise<boolean> => {
    if (dataComplianceInstalling) return true
    return installDataComplianceEnvironment(event, () => dataComplianceInstalling)
  })

  ipcMain.handle('data-compliance:request', async (_, payload: unknown): Promise<DataComplianceRequestResult> => {
    const request = parseIpcPayload('data-compliance:request', dataComplianceRequestPayloadSchema, payload)
    const translatedPath = translateDataCompliancePath(request.path)
    try {
      return await runtimeRequest(translatedPath, request.method, request.body)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        ok: false,
        status: 503,
        body: JSON.stringify({ error: message }),
        contentType: 'application/json'
      }
    }
  })

  ipcMain.handle('data-compliance:submit', async (_, payload: unknown): Promise<DataComplianceRequestResult> => {
    const request = parseIpcPayload(
      'data-compliance:submit',
      dataComplianceSubmitPayloadSchema,
      payload
    ) as DataComplianceSubmitPayload
    try {
      return await runtimeRequest('/data-compliance/tasks', 'POST', JSON.stringify(request))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        ok: false,
        status: 503,
        body: JSON.stringify({ error: message }),
        contentType: 'application/json'
      }
    }
  })

  ipcMain.handle('data-compliance:download-file', async (_, payload: unknown) => {
    const request = parseIpcPayload(
      'data-compliance:download-file',
      dataComplianceDownloadFilePayloadSchema,
      payload
    )
    try {
      await reconnectRuntime()
      const settings = await store.load()
      const base = getRuntimeBaseUrlForSettings(settings)
      const headers = runtimeAuthHeaders(settings)
      const url = `${base}/data-compliance/tasks/${encodeURIComponent(request.taskId)}/files/${encodeURIComponent(request.fileKey)}`
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        return { ok: false as const, message: text || `HTTP ${res.status}` }
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      const contentDisposition = res.headers.get('content-disposition') || ''
      const filenameMatch = /filename="([^"]+)"/.exec(contentDisposition)
      const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : `${request.taskId}_${request.fileKey}`
      const contentType = res.headers.get('content-type') || 'application/octet-stream'
      return {
        ok: true as const,
        dataBase64: buffer.toString('base64'),
        filename,
        contentType
      }
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })

  ipcMain.handle('claw:status', async (): Promise<ClawRuntimeStatus> =>
    getClawRuntime()?.status() ?? {
      imServerRunning: false,
      imUrl: '',
      runningTaskIds: []
    }
  )

  ipcMain.handle('claw:task:run', async (_, taskId: unknown): Promise<ClawRunResult> => {
    const normalizedTaskId = parseIpcPayload('claw:task:run', streamIdSchema, taskId)
    const scheduleRuntime = getScheduleRuntime()
    if (!scheduleRuntime) return { ok: false, message: 'Schedule runtime is not initialized.' }
    return scheduleRuntime.runTask(normalizedTaskId)
  })

  ipcMain.handle('schedule:status', async (): Promise<ScheduleRuntimeStatus> =>
    getScheduleRuntime()?.status() ?? {
      internalServerRunning: false,
      internalUrl: '',
      runningTaskIds: [],
      powerSaveBlockerActive: false
    }
  )

  ipcMain.handle(
    'learning-iteration:status',
    async (): Promise<LearningIterationRuntimeStatus> =>
      getLearningIterationRuntime()?.status() ?? {
        status: 'disabled',
        enabled: false,
        eligibleToday: false,
        queued: false,
        running: false,
        message: '学习迭代运行时尚未初始化。',
        lastSuccessfulAt: '',
        lastCheckedAt: '',
        nextEligibleAt: '',
        baselineComplete: false,
        baselineProgress: 0,
        pendingSourceCount: 0
      }
  )
  ipcMain.handle(
    'learning-iteration:list',
    async (): Promise<LearningIterationListResult> =>
      getLearningIterationRuntime()?.list() ?? {
        ok: false,
        message: '学习迭代运行时尚未初始化。'
      }
  )
  ipcMain.handle(
    'learning-iteration:get',
    async (_, id: unknown): Promise<LearningIterationDetailResult> => {
      const normalizedId = parseIpcPayload('learning-iteration:get', streamIdSchema, id)
      return getLearningIterationRuntime()?.get(normalizedId) ?? {
        ok: false,
        message: '学习迭代运行时尚未初始化。'
      }
    }
  )
  ipcMain.handle(
    'learning-iteration:queue',
    async (): Promise<LearningIterationActionResult> =>
      getLearningIterationRuntime()?.queue() ?? {
        ok: false,
        message: '学习迭代运行时尚未初始化。'
      }
  )
  ipcMain.handle(
    'learning-iteration:cancel',
    async (): Promise<LearningIterationActionResult> =>
      getLearningIterationRuntime()?.cancel() ?? {
        ok: false,
        message: '学习迭代运行时尚未初始化。'
      }
  )
  ipcMain.handle(
    'learning-iteration:rollback',
    async (_, id: unknown): Promise<LearningIterationActionResult> => {
      const normalizedId = parseIpcPayload('learning-iteration:rollback', streamIdSchema, id)
      return getLearningIterationRuntime()?.rollback(normalizedId) ?? {
        ok: false,
        message: '学习迭代运行时尚未初始化。'
      }
    }
  )

  ipcMain.handle('schedule:task:run', async (_, taskId: unknown): Promise<ScheduleRunResult> => {
    const normalizedTaskId = parseIpcPayload('schedule:task:run', streamIdSchema, taskId)
    const scheduleRuntime = getScheduleRuntime()
    if (!scheduleRuntime) return { ok: false, message: 'Schedule runtime is not initialized.' }
    return scheduleRuntime.runTask(normalizedTaskId)
  })

  ipcMain.handle(
    'claw:channel:mirror',
    async (_, payload: unknown) => {
      const request = parseIpcPayload('claw:channel:mirror', clawMirrorPayloadSchema, payload)
      const clawRuntime = getClawRuntime()
      if (!clawRuntime) return { ok: false as const, message: 'Claw runtime is not initialized.' }
      return clawRuntime.mirrorThreadMessageToIm(
        request.threadId,
        request.text,
        request.direction
      )
    }
  )

  ipcMain.handle(
    'claw:channel:mirror-to-feishu',
    async (_, payload: unknown) => {
      const request = parseIpcPayload('claw:channel:mirror-to-feishu', clawMirrorPayloadSchema, payload)
      const clawRuntime = getClawRuntime()
      if (!clawRuntime) return { ok: false as const, message: 'Claw runtime is not initialized.' }
      return clawRuntime.mirrorThreadMessageToIm(
        request.threadId,
        request.text,
        request.direction
      )
    }
  )

  ipcMain.handle(
    'claw:task:create-from-text',
    async (_, payload: unknown): Promise<ClawTaskFromTextResult> => {
      const request = parseIpcPayload(
        'claw:task:create-from-text',
        clawTaskFromTextPayloadSchema,
        payload
      )
      const scheduleRuntime = getScheduleRuntime()
      if (!scheduleRuntime) return { kind: 'error', message: 'Schedule runtime is not initialized.' }
      const settings = await store.load()
      const channel = request.channelId
        ? settings.claw.channels.find((item) => item.id === request.channelId)
        : undefined
      return scheduleRuntime.createScheduledTaskFromText(request.text, {
        workspaceRoot: channel?.workspaceRoot || settings.schedule.defaultWorkspaceRoot || settings.workspaceRoot,
        modelHint: request.modelHint,
        mode: request.mode
      })
    }
  )

  ipcMain.handle(
    'schedule:task:create-from-text',
    async (_, payload: unknown): Promise<ScheduleTaskFromTextResult> => {
      const request = parseIpcPayload(
        'schedule:task:create-from-text',
        scheduleTaskFromTextPayloadSchema,
        payload
      )
      const scheduleRuntime = getScheduleRuntime()
      if (!scheduleRuntime) return { kind: 'error', message: 'Schedule runtime is not initialized.' }
      return scheduleRuntime.createScheduledTaskFromText(request.text, {
        workspaceRoot: request.workspaceRoot,
        modelHint: request.modelHint,
        mode: request.mode
      })
    }
  )

  ipcMain.handle(
    'claw:im-install:qrcode',
    async (_, payload: unknown) => {
      const request = parseIpcPayload(
        'claw:im-install:qrcode',
        z.object({ provider: z.enum(['feishu', 'weixin']), isLark: z.boolean().optional() }).strict(),
        payload
      )
      if (request.provider === 'weixin') {
        return startWeixinInstallQrcode()
      }
      return startFeishuInstallQrcode(request.isLark === true)
    }
  )

  ipcMain.handle(
    'claw:im-install:poll',
    async (_, payload: unknown) => {
      const request = parseIpcPayload('claw:im-install:poll', clawImInstallPollPayloadSchema, payload)
      if (request.provider === 'weixin') {
        return pollWeixinInstall(request.deviceCode)
      }
      return pollFeishuInstall(request.deviceCode)
    }
  )

  ipcMain.handle('workspace:pick-directory', async (_, defaultPath: unknown): Promise<WorkspacePickResult> => {
    const normalizedDefaultPath = parseIpcPayload(
      'workspace:pick-directory',
      z.object({ defaultPath: defaultPathSchema }).strict(),
      { defaultPath }
    ).defaultPath
    const options: Electron.OpenDialogOptions = {
      title: 'Select working directory',
      defaultPath: normalizedDefaultPath,
      properties: ['openDirectory', 'createDirectory', 'dontAddToRecent']
    }
    const mainWindow = getMainWindow()
    const result = mainWindow
      ? await dialog.showOpenDialog(mainWindow, options)
      : await dialog.showOpenDialog(options)
    return {
      canceled: result.canceled,
      path: result.canceled ? null : (result.filePaths[0] ?? null)
    }
  })

  /**
   * 通知运行中的 legalwork runtime 重新扫描 skill 根，使新保存/导入的
   * skill 立即可用（无需重启）。失败静默——不影响保存本身。
   */
  const refreshRuntimeSkills = async (): Promise<void> => {
    try {
      await runtimeRequest('/v1/skills/refresh', 'POST')
    } catch {
      // runtime 可能未运行或暂不可达——忽略
    }
  }

  /** 从 SKILL.md frontmatter 提取 description。 */
  const skillDescriptionFromFrontmatter = (content: string): string | null => {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!match) return null
    const desc = match[1].match(/^description:\s*(.+)$/m)?.[1]?.trim()
    return desc || null
  }

  ipcMain.handle(
    'skill:save-file',
    async (_, payload: unknown) => {
      const request = parseIpcPayload('skill:save-file', skillSaveFilePayloadSchema, payload)
      try {
        const rootPath = expandHomePath(request.rootPath)
        if (!rootPath) {
          return { ok: false as const, message: 'Skill directory is required.' }
        }
        const skillName = normalizeSkillFolderName(request.skillName)
        const skillDir = join(rootPath, skillName)
        const filePath = join(skillDir, 'SKILL.md')
        await mkdir(skillDir, { recursive: true })
        await writeFile(filePath, request.content, 'utf8')
        // 生成 skill.json（仅 name/description）。runtime 的 SkillManifest schema
        // 是 .strict()：多余字段（如 keywords）会导致整个 manifest 解析失败、
        // skill 无法加载。关键词匹配由 runtime 从 name/description 自动提取。
        await writeFile(join(skillDir, 'skill.json'), `${JSON.stringify({
          name: skillName,
          description: skillDescriptionFromFrontmatter(request.content) ?? skillName
        }, null, 2)}\n`, 'utf8')
        // 等待 runtime 完成重扫后再向界面报告成功，避免用户立刻发起任务时
        // 新安装的 Skill 还没进入运行时目录。
        await refreshRuntimeSkills()
        return { ok: true as const, path: filePath }
      } catch (error) {
        return {
          ok: false as const,
          message: error instanceof Error ? error.message : String(error)
        }
      }
    }
  )

  ipcMain.handle('skill:list', async (_, payload: unknown) => {
    const request = parseIpcPayload('skill:list', skillListPayloadSchema, payload)
    const settings = await store.load()
    return listGuiSkills(settings, request.workspaceRoot)
  })

  ipcMain.handle('skill:read-file', async (_, payload: unknown) => {
    const request = parseIpcPayload('skill:read-file', skillReadFilePayloadSchema, payload)
    return readGuiSkillFile(request.rootPath, request.entryPath)
  })

  ipcMain.handle('skill:import', async () => {
    const options: Electron.OpenDialogOptions = {
      title: '导入 Skill 文件夹或 zip',
      properties: ['openFile', 'openDirectory', 'dontAddToRecent'],
      filters: [
        { name: 'Skill zip', extensions: ['zip'] },
        { name: 'All files', extensions: ['*'] }
      ]
    }
    const mainWindow = getMainWindow()
    const result = mainWindow
      ? await dialog.showOpenDialog(mainWindow, options)
      : await dialog.showOpenDialog(options)
    if (result.canceled) {
      return { ok: false as const, canceled: true as const, message: '已取消导入。' }
    }
    const sourcePath = result.filePaths[0]
    if (!sourcePath) {
      return { ok: false as const, message: '未选择 Skill 文件夹或 zip。' }
    }
    const imported = await importGuiSkillFromPath(sourcePath)
    if (imported.ok) {
      // 导入成功 → 通知运行中的 runtime 重新扫描，让新 skill 立即可用。
      await refreshRuntimeSkills()
    }
    return imported
  })

  ipcMain.handle('skillhub:list', async (_, payload: unknown) => {
    const request = parseIpcPayload('skillhub:list', skillHubListPayloadSchema, payload)
    return listSkillHubSkills(request)
  })

  ipcMain.handle('skillhub:install', async (_, payload: unknown) => {
    const request = parseIpcPayload('skillhub:install', skillHubInstallPayloadSchema, payload)
    const installed = await installSkillHubSkill(request)
    if (installed.ok) {
      // 远程安装与本地导入保持一致：完成后立即让运行时重扫技能目录。
      await refreshRuntimeSkills()
    }
    return installed
  })

  ipcMain.handle('skill:open-root', async (_, rootPath: unknown) => {
    const normalizedRootPath = parseIpcPayload('skill:open-root', rootPathSchema, rootPath)
    try {
      const target = expandHomePath(normalizedRootPath)
      if (!target) {
        return { ok: false as const, message: 'Skill directory is required.' }
      }
      await mkdir(target, { recursive: true })
      return openPathWithShell(target)
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })

  ipcMain.handle('deepseek:config:read', async () => {
    const path = resolveLegalworkConfigPath()
    try {
      const content = await readFile(path, 'utf8')
      return { path, content, exists: true as const }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // mcp.json 尚未创建：返回默认预装的北大法宝配置，插件市场据此显示"已预装"。
        return { path, content: DEFAULT_PKULAW_MCP_CONFIG_TEXT, exists: false as const }
      }
      throw error
    }
  })

  ipcMain.handle('deepseek:config:write', async (_, content: unknown) => {
    const validatedContent = parseIpcPayload(
      'deepseek:config:write',
      deepseekConfigContentSchema,
      content
    )
    validateMcpConfigContent(validatedContent)
    const path = resolveLegalworkConfigPath()
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, validatedContent, 'utf8')
    try {
      await onLegalworkMcpConfigWritten?.(path, validatedContent)
    } catch (error: unknown) {
      logError('mcp-config', 'Failed to apply MCP config change after write', {
        path,
        message: error instanceof Error ? error.message : String(error)
      })
    }
    return { ok: true as const, path }
  })

  ipcMain.handle(
    'mcp:install-optional-package',
    async (_, packageId: unknown): Promise<OptionalMcpInstallResult> => {
      const validatedPackageId = parseIpcPayload(
        'mcp:install-optional-package',
        z.literal('flint-chart'),
        packageId
      )
      const executable = resolveNpxPath()
      const result = await runCommand(
        executable,
        ['--yes', 'flint-chart-mcp@0.3.0', '--version'],
        { timeout: 10 * 60_000, env: process.env }
      )
      if (result.exitCode !== 0) {
        const detail = result.stderr || result.stdout || `exit code ${result.exitCode ?? 'unknown'}`
        return {
          ok: false,
          message: detail.slice(-2_000)
        }
      }
      return {
        ok: true,
        packageId: validatedPackageId,
        version: result.stdout.trim() || '0.3.0'
      }
    }
  )

  ipcMain.handle('deepseek:config:open-dir', async () => {
    try {
      const path = resolveLegalworkConfigPath()
      const dirPath = dirname(path)
      await mkdir(dirPath, { recursive: true })
      return openPathWithShell(dirPath)
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })

  ipcMain.handle('git:branches', async (_, workspaceRoot: unknown) =>
    getGitBranches(parseIpcPayload('git:branches', workspaceRootSchema, workspaceRoot))
  )
  ipcMain.handle(
    'git:switch-branch',
    async (_, payload: unknown) => {
      const request = parseIpcPayload('git:switch-branch', gitBranchPayloadSchema, payload)
      return switchGitBranch(request.workspaceRoot, request.branch)
    }
  )
  ipcMain.handle(
    'git:create-and-switch-branch',
    async (_, payload: unknown) => {
      const request = parseIpcPayload(
        'git:create-and-switch-branch',
        gitBranchPayloadSchema,
        payload
      )
      return createAndSwitchGitBranch(request.workspaceRoot, request.branch)
    }
  )

  ipcMain.handle('editor:list', async () => listEditorsResult())
  ipcMain.handle('editor:open-path', async (_, payload: unknown) =>
    openEditorPath(parseIpcPayload('editor:open-path', openEditorPathPayloadSchema, payload))
  )

  ipcMain.handle('file:resolve-workspace', async (_, payload: unknown) =>
    resolveWorkspaceFile(
      parseIpcPayload('file:resolve-workspace', workspaceFileTargetPayloadSchema, payload)
    )
  )
  ipcMain.handle('file:list-workspace-directory', async (_, payload: unknown) =>
    listWorkspaceDirectory(
      parseIpcPayload('file:list-workspace-directory', workspaceDirectoryTargetPayloadSchema, payload)
    )
  )
  ipcMain.handle('file:read-workspace', async (_, payload: unknown) =>
    readWorkspaceFile(
      parseIpcPayload('file:read-workspace', workspaceFileTargetPayloadSchema, payload)
    )
  )
  ipcMain.handle('file:read-workspace-binary', async (_, payload: unknown) =>
    readWorkspaceBinary(
      parseIpcPayload('file:read-workspace-binary', workspaceFileTargetPayloadSchema, payload)
    )
  )
  ipcMain.handle('file:read-workspace-image', async (_, payload: unknown) =>
    readWorkspaceImage(
      parseIpcPayload('file:read-workspace-image', workspaceFileTargetPayloadSchema, payload)
    )
  )
  ipcMain.handle('file:write-workspace', async (_, payload: unknown) =>
    writeWorkspaceFile(
      parseIpcPayload('file:write-workspace', workspaceFileWritePayloadSchema, payload)
    )
  )
  ipcMain.handle('file:create-workspace', async (_, payload: unknown) =>
    createWorkspaceFile(
      parseIpcPayload('file:create-workspace', workspaceFileCreatePayloadSchema, payload)
    )
  )
  ipcMain.handle('file:create-workspace-directory', async (_, payload: unknown) =>
    createWorkspaceDirectory(
      parseIpcPayload('file:create-workspace-directory', workspaceDirectoryCreatePayloadSchema, payload)
    )
  )
  ipcMain.handle('file:save-workspace-clipboard-image', async (_, payload: unknown) =>
    saveWorkspaceClipboardImage(
      parseIpcPayload(
        'file:save-workspace-clipboard-image',
        workspaceClipboardImageSavePayloadSchema,
        payload
      )
    )
  )
  ipcMain.handle('clipboard:read-image', async () => readClipboardImage())
  ipcMain.handle('file:rename-workspace-entry', async (_, payload: unknown) =>
    renameWorkspaceEntry(
      parseIpcPayload('file:rename-workspace-entry', workspaceEntryRenamePayloadSchema, payload)
    )
  )
  ipcMain.handle('file:delete-workspace-entry', async (_, payload: unknown) =>
    deleteWorkspaceEntry(
      parseIpcPayload('file:delete-workspace-entry', workspaceEntryDeletePayloadSchema, payload)
    )
  )
  ipcMain.handle('file:watch-workspace', async (event, payload: unknown) => {
    const request = parseIpcPayload('file:watch-workspace', workspaceFileWatchPayloadSchema, payload)
    const initial = await readWorkspaceFile(request)
    let watchedPath: string
    let initialContent: string
    let initialSize: number
    let initialTruncated: boolean
    if (initial.ok) {
      watchedPath = initial.path
      initialContent = initial.content
      initialSize = initial.size
      initialTruncated = initial.truncated
    } else {
      const initialImage = await readWorkspaceImage(request)
      if (!initialImage.ok) return initial
      watchedPath = initialImage.path
      initialContent = ''
      initialSize = initialImage.size
      initialTruncated = false
    }

    const watchId = randomUUID()
    try {
      const watcher = watch(watchedPath, { persistent: false }, () => {
        scheduleWorkspaceFileChange(watchId)
      })
      workspaceFileWatchers.set(watchId, {
        watcher,
        sender: event.sender,
        path: watchedPath,
        workspaceRoot: request.workspaceRoot,
        timer: null
      })
      event.sender.once('destroyed', () => disposeWorkspaceFileWatchesForSender(event.sender))
      return {
        ok: true as const,
        watchId,
        path: watchedPath,
        content: initialContent,
        size: initialSize,
        truncated: initialTruncated,
        startedAt: new Date().toISOString()
      }
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
  ipcMain.handle('file:unwatch-workspace', async (_, watchId: unknown) =>
    disposeWorkspaceFileWatch(parseIpcPayload('file:unwatch-workspace', streamIdSchema, watchId))
  )
  ipcMain.handle('write:export', async (_, payload: unknown) =>
    exportWriteDocument(
      parseIpcPayload('write:export', writeExportPayloadSchema, payload),
      { parentWindow: getMainWindow() }
    )
  )
  ipcMain.handle('write:copy-rich-text', async (_, payload: unknown) =>
    copyWriteDocumentAsRichText(
      parseIpcPayload('write:copy-rich-text', writeRichClipboardPayloadSchema, payload)
    )
  )
  ipcMain.handle('legal-research:export-word', async (_, payload: unknown) => {
    try {
      const { html, markdown, templateId, templateName, defaultName } = parseIpcPayload(
        'legal-research:export-word',
        z.object({
          html: z.string().optional(),
          markdown: z.string().optional(),
          templateId: z.string().max(200).optional(),
          templateName: z.string().max(200).optional(),
          defaultName: z.string().max(200)
        }).strict().refine((value) => Boolean(value.html || value.markdown), {
          message: 'html or markdown is required'
        }),
        payload
      )
      const result = await dialog.showSaveDialog({
        title: '导出调研结果',
        defaultPath: `${defaultName.replace(/[<>:"/\\|?*]/g, '_')}.docx`,
        filters: [{ name: 'Word 文档', extensions: ['docx'] }]
      })
      if (result.canceled || !result.filePath) {
        return { ok: false, canceled: true }
      }
      const targetPath = extname(result.filePath).toLowerCase() === '.docx'
        ? result.filePath
        : `${result.filePath}.docx`
      let buffer: Buffer
      let formatPreserved = false
      let warning: string | undefined
      if (markdown) {
        const userTemplate = templateId ? await getTemplate(templateId) : null
        const templateSource = userTemplate ? await readTemplateSource(userTemplate) : null
        if (userTemplate?.sourceDocument && !templateSource) {
          throw new Error('未找到模板原文件，请重新上传 DOCX 模板后再导出。')
        }
        if (templateSource) {
          const filled = await fillDocxTemplateWithMarkdown(templateSource, markdown)
          buffer = filled.buffer
          formatPreserved = true
        } else {
          buffer = await legalDocumentMarkdownToDocx({
            markdown,
            templateId,
            templateName: templateName || defaultName
          })
          if (userTemplate) {
            warning = '该模板未保留原始 DOCX，已按 LegalWork 标准法律文书格式导出。重新上传 DOCX 后可保留原版式。'
          }
        }
      } else {
        const { createRequire } = await import('node:module')
        const require = createRequire(import.meta.url)
        const htmlToDocx = require('html-to-docx') as (
          htmlString: string,
          headerHtmlString?: string | null,
          documentOptions?: Record<string, unknown> | null
        ) => Promise<ArrayBuffer | Blob>
        const docx = await htmlToDocx(html!, null, {
          title: defaultName,
          creator: 'legalwork',
          keywords: ['legal research', '法律调研'],
          description: `法律调研报告：${defaultName}`,
          font: 'SimSun',
          fontSize: 24,
          pageSize: { width: 11906, height: 16838 },
          margins: { top: 1440, right: 1800, bottom: 1440, left: 1800, header: 851, footer: 992, gutter: 0 }
        })
        if (Buffer.isBuffer(docx)) {
          buffer = docx
        } else if (docx instanceof ArrayBuffer) {
          buffer = Buffer.from(new Uint8Array(docx))
        } else {
          buffer = Buffer.from(await (docx as Blob).arrayBuffer())
        }
        buffer = await normalizeLegalDocxBuffer(buffer)
      }
      await writeFile(targetPath, buffer)
      return { ok: true, path: targetPath, formatPreserved, warning }
    } catch (error) {
      return {
        ok: false,
        canceled: false,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
  ipcMain.handle('document:export-markdown', async (_, payload: unknown) => {
    return exportMarkdownDocument(
      parseIpcPayload(
        'document:export-markdown',
        z.object({
          markdown: z.string().max(10_000_000),
          defaultName: z.string().min(1).max(200)
        }).strict(),
        payload
      ),
      {
        showSaveDialog: (options) => dialog.showSaveDialog(options),
        writeFile
      }
    )
  })
  ipcMain.handle('write:inline-completion', async (_, payload: unknown) =>
    requestWriteInlineCompletion(
      await store.load(),
      parseIpcPayload('write:inline-completion', writeInlineCompletionPayloadSchema, payload)
    )
  )
  ipcMain.handle('write:inline-completion-debug:list', async () => listWriteInlineCompletionDebugEntries())
  ipcMain.handle('write:inline-completion-debug:clear', async () => {
    clearWriteInlineCompletionDebugEntries()
    return true
  })
  ipcMain.handle('document:generate', async (_, payload: unknown) =>
    generateDocument(
      await store.load(),
      parseIpcPayload('document:generate', documentGenerationPayloadSchema, payload)
    )
  )

  // ── User Templates (我的模板) ──────────────────────────────────────────
  // Initialize template store with userData path
  setTemplatesBaseDir(app.getPath('userData'))

  ipcMain.handle('templates:list', async () => {
    return listTemplates()
  })

  ipcMain.handle('templates:save', async (_, payload: unknown) => {
    const template = parseIpcPayload('templates:save', userTemplateSchema, payload)
    return saveTemplate(template)
  })

  ipcMain.handle('templates:save-source', async (_, payload: unknown) => {
    const request = parseIpcPayload(
      'templates:save-source',
      templateSourceSaveRequestSchema,
      payload
    )
    return saveTemplateSource(request)
  })

  ipcMain.handle('templates:delete', async (_, id: unknown) => {
    const validatedId = parseIpcPayload(
      'templates:delete',
      z.string().min(1).max(200),
      id
    )
    return deleteTemplate(validatedId)
  })

  ipcMain.handle('templates:learn', async (_, payload: unknown) => {
    const request = parseIpcPayload('templates:learn', templateLearningRequestSchema, payload)
    return learnTemplate(await store.load(), request)
  })

  ipcMain.handle('templates:generate', async (_, payload: unknown) => {
    const request = parseIpcPayload(
      'templates:generate',
      templateGenerateWithMaterialsRequestSchema,
      payload
    )
    return generateFromTemplate(await store.load(), request)
  })

  // ── IMA 知识库认证 ──

  ipcMain.handle('ima:auth-status', async (): Promise<ImaAuthStatus> => {
    const auth = loadImaAuth()
    if (auth) {
      const sanitized = { ...auth, cookie: '', bkn: '' }
      if (auth.verificationStatus === 'expired') {
        return {
          kind: 'expired',
          auth: sanitized,
          status: 'expired',
          message: auth.verificationMessage
        }
      }
      return {
        kind: 'logged_in',
        auth: sanitized,
        status: auth.verificationStatus || 'unverified'
      }
    }
    return { kind: 'not_configured' }
  })

  ipcMain.handle('pkulaw:open-console', async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      openPkulawConsoleWindow()
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
  })

  ipcMain.handle('pkulaw:claim-token', async (): Promise<PkulawClaimResult> => {
    return claimPkulawDailyToken()
  })

  ipcMain.handle('pkulaw:auto-claim-state', async (): Promise<{ enabled: boolean; lastClaimDate: string | null }> => {
    return getPkulawAutoClaimState()
  })

  ipcMain.handle(
    'pkulaw:auto-claim-set',
    async (_: unknown, enabled: unknown): Promise<{ enabled: boolean; lastClaimDate: string | null }> => {
      return setPkulawAutoClaimEnabled(enabled === true)
    }
  )

  // 每日自动领取调度：应用启动后延迟触发，不抢在连接前，也不影响连接。
  startPkulawAutoClaimScheduler()

  ipcMain.handle('yuandian:open-console', async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      openYuandianConsoleWindow()
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
  })

  ipcMain.handle('tyc:open-console', async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      openTycConsoleWindow()
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
  })

  ipcMain.handle('wk:open-console', async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      openWkConsoleWindow()
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
  })

  ipcMain.handle('qcc:open-console', async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      openQccConsoleWindow()
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
  })

  ipcMain.handle('ima:auth-login', async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      await captureImaAuthViaLogin()
      startImaRefreshTimer()
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
  })

  ipcMain.handle('ima:auth-relogin', async (): Promise<{ ok: true } | { ok: false; message: string }> => {
    stopImaRefreshTimer()
    try {
      await replaceImaAuthViaLogin()
      startImaRefreshTimer()
      return { ok: true }
    } catch (error) {
      if (loadImaAuth()) startImaRefreshTimer()
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
  })

  ipcMain.handle('ima:auth-logout', async (): Promise<void> => {
    clearImaAuth()
    await clearImaLoginSession()
    stopImaRefreshTimer()
  })

  ipcMain.handle('ima:auth-refresh', async (): Promise<{ ok: true; changed: boolean; status: string } | { ok: false; message: string; status: string }> => {
    try {
      const auth = loadImaAuth()
      if (!auth?.cookie || !auth?.bkn) {
        return { ok: false, message: 'IMA 未登录', status: 'not_configured' }
      }
      const result = await refreshImaAuth()
      if (result.status === 'valid') {
        return { ok: true, changed: result.changed, status: result.status }
      }
      return { ok: false, message: result.message, status: result.status }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message, status: 'network_error' }
    }
  })

  ipcMain.handle('ima:get-config', async (): Promise<{
    cookie: boolean
    bkn: boolean
    loggedIn: boolean
    status: string
    message?: string
    knowledgeBaseCount: number
  }> => {
    const auth = loadImaAuth()
    if (!auth?.cookie || !auth?.bkn) {
      return {
        cookie: false,
        bkn: false,
        loggedIn: false,
        status: 'not_configured',
        knowledgeBaseCount: 0
      }
    }
    const result = await refreshImaAuth()
    const current = 'auth' in result ? result.auth : auth
    return {
      cookie: true,
      bkn: true,
      loggedIn: result.status === 'valid',
      status: result.status,
      message: result.status === 'valid' ? undefined : result.message,
      knowledgeBaseCount: current.knowledgeBases?.length || 0
    }
  })

  let imaPythonInstallPromise: Promise<string | null> | null = null

  async function ensureImaPythonCommand(
    event: Electron.IpcMainInvokeEvent
  ): Promise<string | null> {
    const settings = await store.load()
    const runtime = resolveLegalworkRuntimeSettings(settings)
    const dataDir = resolveLegalworkDataDir(runtime)
    const standaloneCandidates = imaStandalonePythonCandidates(
      app.getPath('userData'),
      dataDir,
      process.platform
    )
    for (const candidate of standaloneCandidates) {
      if (existsSync(candidate) && await isSupportedPythonExecutable(candidate)) return candidate
    }

    const systemPython = await resolvePythonForCompliance()
    if (systemPython) return systemPython

    if (!imaPythonInstallPromise) {
      const sendProgress = (progress: DataComplianceInstallProgress): void => {
        const win = getMainWindow()
        const contents = win && !win.isDestroyed() ? win.webContents : event.sender
        if (!contents.isDestroyed()) contents.send('ima:python-install-progress', progress)
      }
      imaPythonInstallPromise = (
        process.platform === 'win32'
          ? downloadAndInstallPythonWindows(sendProgress)
          : process.platform === 'darwin'
            ? downloadAndInstallPythonMacOS(sendProgress)
            : process.platform === 'linux'
              ? downloadAndInstallPythonLinux(sendProgress)
              : Promise.resolve(null)
      ).finally(() => {
        imaPythonInstallPromise = null
      })
    }
    return imaPythonInstallPromise
  }

  ipcMain.handle('ima:get-mcp-config', async (event): Promise<Record<string, unknown> | { error: string }> => {
    const auth = loadImaAuth()
    if (!auth?.cookie || !auth?.bkn) {
      return { error: 'IMA 未登录，请先登录' }
    }
    const scriptPath = resolveBundledImaMcpScriptPath(app.getAppPath(), app.isPackaged)
    if (!existsSync(scriptPath)) {
      return { error: 'IMA MCP 服务脚本不存在' }
    }
    let pythonCmd: string | null
    try {
      pythonCmd = await ensureImaPythonCommand(event)
    } catch (error) {
      return {
        error: `IMA 运行环境安装失败：${error instanceof Error ? error.message : String(error)}`
      }
    }
    if (!pythonCmd) {
      return { error: 'IMA 运行环境不可用：未找到 Python，自动安装也未成功' }
    }
    // 传递凭证文件路径供 MCP Server 实时读取（自动刷新后无需重启即可生效）
    return {
      servers: {
        'ima-knowledge-base': {
          enabled: true,
          transport: 'stdio',
          command: pythonCmd,
          args: [scriptPath],
          env: {
            IMA_CREDS_FILE: credsFilePath(),
            IMA_REFRESH_TRIGGER_PATH: imaRefreshTriggerPath(),
            IMA_X_IMA_COOKIE: auth.cookie,   // 兜底：文件不存在时回退到环境变量
            IMA_X_IMA_BKN: auth.bkn,
          },
          trustScope: 'user',
          // research_ima performs catalog routing and then streams a full KB
          // answer. Keep the outer MCP deadline above its bounded internal
          // stages so LegalWork does not terminate a healthy long answer.
          timeoutMs: 360000
        }
      }
    }
  })

  ipcMain.handle('document:material:extract', async (_, payload: unknown) => {
    const request = parseIpcPayload(
      'document:material:extract',
      documentMaterialExtractionPayloadSchema,
      payload
    )
    return extractDocumentMaterial(request)
  })

  // ── Document History ──────────────────────────────────────────────
  setHistoryBaseDir(app.getPath('userData'))

  ipcMain.handle('history:list', async () => {
    return listHistory()
  })

  ipcMain.handle('history:get', async (_, id: unknown) => {
    const validatedId = parseIpcPayload('history:get', z.string().min(1).max(200), id)
    return getHistoryRecord(validatedId)
  })

  ipcMain.handle('history:save', async (_, payload: unknown) => {
    const record = parseIpcPayload('history:save', documentHistoryRecordSchema, payload)
    return saveHistoryRecord(record)
  })

  ipcMain.handle('history:delete', async (_, id: unknown) => {
    const validatedId = parseIpcPayload('history:delete', z.string().min(1).max(200), id)
    return deleteHistoryRecord(validatedId)
  })

  ipcMain.handle('history:clear', async () => {
    return clearHistory()
  })
  ipcMain.handle('desktop:command', async (event, command: unknown) => {
    runDesktopCommand(
      parseIpcPayload('desktop:command', desktopCommandSchema, command),
      event.sender,
      getMainWindow
    )
  })
  ipcMain.handle('shell:open-external', async (_, url: unknown) => {
    const validatedUrl = parseIpcPayload('shell:open-external', shellOpenExternalUrlSchema, url)
    await shell.openExternal(validatedUrl)
  })
  ipcMain.handle('shell:open-path', async (_, targetPath: unknown) => {
    const validatedPath = parseIpcPayload('shell:open-path', rootPathSchema, targetPath)
    return openPathWithShell(validatedPath)
  })
  ipcMain.handle('knowledge:open-file', async (_, payload: unknown) => {
    const { path } = parseIpcPayload('knowledge:open-file', knowledgeOpenFilePayloadSchema, payload)
    try {
      const result = await runtimeRequest(
        `/v1/knowledge/file/absolute-path?path=${encodeURIComponent(path)}`,
        'GET'
      )
      if (!result.ok) {
        return { ok: false as const, message: result.body || `请求失败：${result.status}` }
      }
      const parsed = JSON.parse(result.body) as { absolute?: string }
      if (!parsed.absolute) {
        return { ok: false as const, message: '无法解析文件路径' }
      }
      return openPathWithShell(parsed.absolute)
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
  ipcMain.handle('knowledge:upload-file', async (_, payload: unknown) => {
    const { sourcePath, targetPath } = parseIpcPayload(
      'knowledge:upload-file',
      knowledgeUploadFilePayloadSchema,
      payload
    )
    try {
      const result = await runtimeRequest(
        `/v1/knowledge/file/absolute-path?path=${encodeURIComponent(targetPath)}`,
        'GET'
      )
      if (!result.ok) {
        return { ok: false as const, message: result.body || `请求失败：${result.status}` }
      }
      const parsed = JSON.parse(result.body) as { absolute?: string; path?: string }
      if (!parsed.absolute) {
        return { ok: false as const, message: '无法解析知识库目标路径' }
      }
      await mkdir(dirname(parsed.absolute), { recursive: true })
      if (sourcePath !== parsed.absolute) {
        await copyFile(sourcePath, parsed.absolute)
      }
      const info = await stat(parsed.absolute)
      return {
        ok: true as const,
        path: parsed.path ?? targetPath,
        sizeBytes: info.size
      }
    } catch (error) {
      return {
        ok: false as const,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  })
  ipcMain.handle('notification:turn-complete', async (_, payload: unknown) =>
    showTurnCompleteNotification(
      parseIpcPayload('notification:turn-complete', notificationPayloadSchema, payload)
    )
  )
  ipcMain.handle('app:version', async () => getAppVersion())
  ipcMain.handle('gui:update-state', async () => readGuiUpdateState())
  ipcMain.handle('gui:update-check', async (_, channel: unknown): Promise<GuiUpdateInfo> => {
    const module = await loadGuiUpdaterModule()
    return module.checkGuiUpdate(
      parseIpcPayload(
        'gui:update-check',
        z.object({ channel: guiUpdateChannelSchema }).strict(),
        { channel }
      ).channel
    )
  })
  ipcMain.handle('gui:update-download', async (_, channel: unknown): Promise<GuiUpdateDownloadResult> => {
    const module = await loadGuiUpdaterModule()
    return module.downloadGuiUpdate(
      parseIpcPayload(
        'gui:update-download',
        z.object({ channel: guiUpdateChannelSchema }).strict(),
        { channel }
      ).channel
    )
  })
  ipcMain.handle('gui:update-install', async (): Promise<GuiUpdateInstallResult> => {
    const module = await loadGuiUpdaterModule()
    return module.installGuiUpdate()
  })

  ipcMain.handle('log:error', async (_, payload: unknown) => {
    const request = parseIpcPayload('log:error', logErrorPayloadSchema, payload)
    logError(request.category, request.message, request.detail)
  })
  ipcMain.handle('log:get-path', async () => resolveLogDirectory())
  ipcMain.handle('log:open-dir', async () => {
    const dir = resolveLogDirectory()
    try {
      await mkdir(dir, { recursive: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, message }
    }
    const error = await shell.openPath(dir)
    if (error) return { ok: false, message: error }
    return { ok: true }
  })

  // ── IMA 按需触发文件侦听（仅 agent 调 MCP 工具 `open_ima_login` 时触发） ──
  const triggerPath = imaRefreshTriggerPath()
  let imaLoginInProgress = false
  let triggerLastProcessed = 0
  const TRIGGER_COOLDOWN = 5_000

  function processImaTrigger(): void {
    try {
      if (!existsSync(triggerPath)) return
      const stat = readFileSync(triggerPath, 'utf8')
      if (!stat.trim()) return
      const now = Date.now()
      if (now - triggerLastProcessed < TRIGGER_COOLDOWN) return

      const content = JSON.parse(stat)
      triggerLastProcessed = now
      const action = content?.action || 'refresh'

      if (action === 'login') {
        if (imaLoginInProgress) return  // 已有登录弹窗，不重复弹
        imaLoginInProgress = true
        replaceImaAuthViaLogin().then(() => {
          imaLoginInProgress = false
          try { writeFileSync(triggerPath, '', { encoding: 'utf8' }) } catch { /* ignore */ }
        }).catch(() => {
          imaLoginInProgress = false
          try { writeFileSync(triggerPath, '', { encoding: 'utf8' }) } catch { /* ignore */ }
        })
      } else {
        runImaRefresh().then(() => {
          try { writeFileSync(triggerPath, '', { encoding: 'utf8' }) } catch { /* ignore */ }
        })
      }
    } catch { /* 无触发文件或解析失败则跳过 */ }
  }

  setInterval(processImaTrigger, 2_000)

  // fs.watch 作为辅助加速
  try {
    const userDataDir = app.getPath('userData')
    if (existsSync(userDataDir)) {
      watch(userDataDir, () => processImaTrigger())
    }
  } catch { /* fs.watch 不可用则跳过 */ }

  // 启动 IMA Cookie 定时刷新（如已登录自动开始）
  startImaRefreshTimer()
}

export function parsePythonVersionOutput(output: string): { major: number; minor: number; patch: number } | null {
  const match = /Python\s+(\d+)\.(\d+)(?:\.(\d+))?/.exec(output.trim())
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3] ?? 0)
  }
}

export function isSupportedDataCompliancePythonVersion(output: string): boolean {
  const version = parsePythonVersionOutput(output)
  if (!version) return false
  if (version.major !== 3) return false
  return version.minor >= 10 && version.minor <= 12
}

async function isSupportedPythonExecutable(command: string, env?: NodeJS.ProcessEnv): Promise<boolean> {
  const result = await runCommand(command, ['--version'], { env })
  return result.exitCode === 0 &&
    isSupportedDataCompliancePythonVersion(`${result.stdout}\n${result.stderr}`)
}

/** Common paths to search for executables (npx, python, etc.) in packaged Electron apps */
const COMMON_BIN_PATHS = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin']

/**
 * Resolve the full path to the `npx` executable.
 * In packaged Electron apps, `process.env.PATH` may not include
 * Homebrew or other package manager bin directories, so we search
 * the common paths explicitly.
 */
function resolveNpxPath(): string {
  if (process.platform === 'win32') {
    // Windows: just try npx.cmd — the env usually has System32 etc.
    return 'npx.cmd'
  }
  const candidates = COMMON_BIN_PATHS.map((dir) => join(dir, 'npx'))
  for (const candidate of candidates) {
    try {
      if (existsSync(candidate)) return candidate
    } catch {
      continue
    }
  }
  // Last resort: rely on PATH
  return 'npx'
}

/** Resolve a Python 3.10-3.12 executable available on the system for data compliance */
async function resolvePythonForCompliance(env?: NodeJS.ProcessEnv): Promise<string | null> {
  const candidates = process.platform === 'win32'
    ? ['python', 'python3', 'py']
    : ['python3', 'python']

  for (const candidate of candidates) {
    try {
      if (await isSupportedPythonExecutable(candidate, env)) {
        return candidate
      }
    } catch {
      continue
    }
  }
  return null
}

/** Run a command and return exit code + stdout + stderr */
function runCommand(
  command: string,
  args: string[],
  options?: { cwd?: string; timeout?: number; env?: NodeJS.ProcessEnv; onStderr?: (line: string) => void }
): Promise<{ exitCode: number | null; stdout: string; stderr: string }> {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: options?.cwd,
      env: options?.env,
      timeout: options?.timeout ?? 120_000, // 2 min default
      windowsHide: true
    })
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    child.stdout?.on('data', (chunk: Buffer) => stdout.push(chunk))
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr.push(chunk)
      if (options?.onStderr) {
        const lines = chunk.toString('utf8').split('\n')
        for (const line of lines) {
          if (line.trim()) options.onStderr(line.trim())
        }
      }
    })
    child.on('close', (exitCode) => {
      resolvePromise({
        exitCode,
        stdout: Buffer.concat(stdout).toString('utf8').trim(),
        stderr: Buffer.concat(stderr).toString('utf8').trim()
      })
    })
    child.on('error', (error) => {
      resolvePromise({
        exitCode: -1,
        stdout: '',
        stderr: error.message
      })
    })
  })
}
