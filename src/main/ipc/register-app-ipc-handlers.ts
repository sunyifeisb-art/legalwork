import { app, dialog, ipcMain, shell, type BrowserWindow, type WebContents } from 'electron'
import { watch, type FSWatcher } from 'node:fs'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
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
  logErrorPayloadSchema,
  notificationPayloadSchema,
  openEditorPathPayloadSchema,
  rootPathSchema,
  runtimeRequestPayloadSchema,
  scheduleTaskFromTextPayloadSchema,
  shellOpenExternalUrlSchema,
  skillListPayloadSchema,
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
  templateGenerateWithMaterialsRequestSchema,
  documentHistoryRecordSchema
} from './app-ipc-schemas'
import type { JsonSettingsStore } from '../settings-store'
import type { ClawRuntime } from '../claw-runtime'
import type { ScheduleRuntime } from '../schedule-runtime'
import {
  getRuntimeBaseUrlForSettings,
  runtimeAuthHeaders
} from '../runtime/legalwork-adapter'
import { resolveLegalworkDataDir } from '../legalwork-process'
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
import {
  listTemplates,
  saveTemplate,
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
import { listGuiSkills } from '../services/skill-service'

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
  getClawRuntime: () => ClawRuntime | null
  getScheduleRuntime: () => ScheduleRuntime | null
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
    getClawRuntime,
    getScheduleRuntime,
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

  ipcMain.handle('upstream:models', async () => fetchUpstreamModels())

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
      const webRoot = resolveDataComplianceWebRootCandidates()
        .find((candidate) => existsSync(join(candidate, 'requirements.txt'))) ??
        resolveDataComplianceWebRootCandidates()[0]
      const requirementsPath = join(webRoot, 'requirements.txt')

      // 1. Detect Python
      sendProgress({ step: 'detecting', percent: 5, message: '正在检测 Python 环境…' })
      let pythonCmd = await resolvePythonForCompliance()

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
          message: '未找到 Python 3，自动安装失败。请检查网络连接后重试，或手动安装 Python 3 并确保其在 PATH 中。'
        })
        return false
      }

      // 2. Create venv if needed
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

      // 3. Install dependencies via pip
      if (existsSync(requirementsPath)) {
        sendProgress({ step: 'installing', percent: 60, message: '正在安装 Python 依赖包（这可能需要几分钟）…' })
        const installResult = await runCommand(
          venvPython,
          ['-m', 'pip', 'install', '-r', requirementsPath],
          { cwd: webRoot, timeout: 600_000 }
        )
        if (installResult.exitCode !== 0) {
          sendProgress({
            step: 'error',
            percent: 0,
            message: `安装 Python 依赖失败: ${installResult.stderr || installResult.stdout || '未知错误'}`
          })
          return false
        }
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
    const https = await import('node:https')
    const { createWriteStream } = await import('node:fs')
    const { pipeline } = await import('node:stream/promises')
    const tmpDir = join(app.getPath('userData'), 'data-compliance', 'tmp')
    mkdirSync(tmpDir, { recursive: true })

    const pythonVersion = '3.11.9'
    const installerName = 'python-3.11.9-amd64.exe'
    const installerPath = join(tmpDir, installerName)
    const url = `https://www.python.org/ftp/python/${pythonVersion}/${installerName}`

    // Download installer if not cached.
    if (!existsSync(installerPath)) {
      sendProgress({ step: 'detecting', percent: 10, message: '未找到 Python，正在下载安装器…' })
      await new Promise<void>((resolve, reject) => {
        const file = createWriteStream(installerPath)
        https
          .get(url, (response) => {
            if (response.statusCode !== 200) {
              reject(new Error(`下载失败: HTTP ${response.statusCode}`))
              return
            }
            const total = parseInt(response.headers['content-length'] || '0', 10)
            let downloaded = 0
            response.on('data', (chunk: Buffer) => {
              downloaded += chunk.length
              if (total > 0) {
                const percent = Math.round((downloaded / total) * 20) // 10-30%
                sendProgress({
                  step: 'detecting',
                  percent,
                  message: `正在下载 Python 安装器 (${Math.round(downloaded / 1024 / 1024)}MB / ${Math.round(total / 1024 / 1024)}MB)…`
                })
              }
            })
            response.pipe(file)
            file.on('finish', () => {
              file.close()
              resolve()
            })
            file.on('error', reject)
          })
          .on('error', reject)
      })
    }

    // Silent install.
    sendProgress({ step: 'detecting', percent: 32, message: '正在安装 Python（可能需要管理员权限）…' })
    const installResult = await runCommand(installerPath, [
      '/quiet',
      'InstallAllUsers=0',
      'PrependPath=1',
      'Include_pip=1',
      'Include_test=0'
    ], { timeout: 300_000 })
    if (installResult.exitCode !== 0) {
      throw new Error(`Python 安装失败: ${installResult.stderr || installResult.stdout || `exit code ${installResult.exitCode}`}`)
    }

    // Verify installation by looking in common locations and refreshed PATH.
    sendProgress({ step: 'detecting', percent: 33, message: '正在验证 Python 安装…' })

    const userProfile = process.env.USERPROFILE
    const localAppData = process.env.LOCALAPPDATA
    const programFiles = process.env.PROGRAMFILES
    const programFilesX86 = process.env['PROGRAMFILES(X86)']

    const possiblePaths = [
      join(localAppData || '', 'Programs', 'Python', 'Python311', 'python.exe'),
      join(programFiles || '', 'Python311', 'python.exe'),
      join(programFilesX86 || '', 'Python311', 'python.exe'),
      join(userProfile || '', 'AppData', 'Local', 'Programs', 'Python', 'Python311', 'python.exe')
    ]

    for (const p of possiblePaths) {
      if (existsSync(p)) return p
    }

    // Try refreshed PATH via cmd.exe.
    const pathResult = await runCommand('cmd.exe', ['/c', 'echo %PATH%'])
    if (pathResult.exitCode === 0) {
      const updatedPath = pathResult.stdout.trim()
      const env = { ...process.env, Path: updatedPath, PATH: updatedPath }
      for (const cmd of ['python', 'python3', 'py']) {
        try {
          const r = await runCommand(cmd, ['--version'], { env })
          if (r.exitCode === 0 && r.stdout.includes('Python 3')) return cmd
        } catch {
          // ignore
        }
      }
    }

    throw new Error('Python 安装后未能找到 python.exe，请重启应用后重试。')
  }

  function getPythonBuildStandaloneUrl(): string | null {
    const releaseTag = '20240415'
    const pythonVersion = '3.11.9'
    const baseUrl = `https://github.com/astral-sh/python-build-standalone/releases/download/${releaseTag}`
    const mapping: Record<string, Record<string, string>> = {
      darwin: {
        arm64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-aarch64-apple-darwin-install_only.tar.gz`,
        x64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-x86_64-apple-darwin-install_only.tar.gz`
      },
      linux: {
        arm64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-aarch64-unknown-linux-gnu-install_only.tar.gz`,
        x64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-x86_64-unknown-linux-gnu-install_only.tar.gz`
      }
    }
    const arch = process.arch === 'arm64' ? 'arm64' : 'x64'
    return mapping[process.platform]?.[arch] ?? null
  }

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

  async function downloadAndInstallPythonBuildStandalone(
    sendProgress: (progress: DataComplianceInstallProgress) => void,
    platformLabel: string
  ): Promise<string | null> {
    const tmpDir = join(app.getPath('userData'), 'data-compliance', 'tmp')
    const installDir = join(app.getPath('userData'), 'data-compliance', 'python-standalone')
    mkdirSync(tmpDir, { recursive: true })

    const url = getPythonBuildStandaloneUrl()
    if (!url) {
      throw new Error(`当前平台 ${process.platform} (${process.arch}) 不支持自动安装 Python。`)
    }

    const fileName = `python-standalone-${process.platform}-${process.arch}.tar.gz`
    const tarPath = join(tmpDir, fileName)

    // Download if not cached.
    if (!existsSync(tarPath)) {
      sendProgress({ step: 'detecting', percent: 10, message: `未找到 Python，正在下载 ${platformLabel} 版 Python…` })
      try {
        await downloadFileWithProgress(url, tarPath, (downloaded, total) => {
          const percent = Math.round((downloaded / total) * 20) // 10-30%
          sendProgress({
            step: 'detecting',
            percent,
            message: `正在下载 Python (${Math.round(downloaded / 1024 / 1024)}MB / ${Math.round(total / 1024 / 1024)}MB)…`
          })
        })
      } catch (error) {
        // Clean up partial download so retry can start fresh.
        try {
          rmSync(tarPath, { force: true })
        } catch {
          // ignore
        }
        throw error
      }
    }

    // Clean any previous extraction and extract.
    sendProgress({ step: 'detecting', percent: 32, message: '正在解压 Python…' })
    if (existsSync(installDir)) {
      rmSync(installDir, { recursive: true, force: true })
    }
    try {
      await extractTarGz(tarPath, installDir)
    } catch (error) {
      // Clean up broken extraction so retry can start fresh.
      try {
        rmSync(installDir, { recursive: true, force: true })
      } catch {
        // ignore
      }
      throw error
    }

    // Verify.
    sendProgress({ step: 'detecting', percent: 33, message: '正在验证 Python 安装…' })
    const pythonPath = join(installDir, 'bin', 'python3')
    if (!existsSync(pythonPath)) {
      throw new Error('Python 解压后未找到 python3 可执行文件')
    }
    const verify = await runCommand(pythonPath, ['--version'])
    if (verify.exitCode !== 0) {
      throw new Error(`Python 验证失败: ${verify.stderr || verify.stdout}`)
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
        return { path, content: '', exists: false as const }
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
      const { html, defaultName } = parseIpcPayload(
        'legal-research:export-word',
        z.object({ html: z.string(), defaultName: z.string().max(200) }).strict(),
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
      const { createRequire } = await import('node:module')
      const require = createRequire(import.meta.url)
      const htmlToDocx = require('html-to-docx') as (
        htmlString: string,
        headerHtmlString?: string | null,
        documentOptions?: Record<string, unknown> | null
      ) => Promise<ArrayBuffer | Blob>
      const docx = await htmlToDocx(html, null, {
        title: defaultName,
        creator: 'legalwork',
        keywords: ['legal research', '法律调研'],
        description: `法律调研报告：${defaultName}`,
        font: 'SimSun',
        fontSize: 24
      })
      const buffer = Buffer.from(
        docx instanceof ArrayBuffer ? new Uint8Array(docx) : Buffer.from(await docx.arrayBuffer())
      )
      await writeFile(result.filePath, buffer)
      return { ok: true, path: result.filePath }
    } catch (error) {
      return {
        ok: false,
        canceled: false,
        message: error instanceof Error ? error.message : String(error)
      }
    }
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
}

/** Resolve a Python 3 executable available on the system for data compliance */
async function resolvePythonForCompliance(env?: NodeJS.ProcessEnv): Promise<string | null> {
  const candidates = process.platform === 'win32'
    ? ['python', 'python3', 'py']
    : ['python3', 'python']

  for (const candidate of candidates) {
    try {
      const result = await runCommand(candidate, ['--version'], { env })
      if (result.exitCode === 0 && result.stdout?.includes('Python 3')) {
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
  options?: { cwd?: string; timeout?: number; env?: NodeJS.ProcessEnv }
): Promise<{ exitCode: number | null; stdout: string; stderr: string }> {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: options?.cwd,
      env: options?.env,
      timeout: options?.timeout ?? 120_000 // 2 min default
    })
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    child.stdout?.on('data', (chunk: Buffer) => stdout.push(chunk))
    child.stderr?.on('data', (chunk: Buffer) => stderr.push(chunk))
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
