import { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, Notification, powerMonitor, powerSaveBlocker, Tray } from 'electron'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  JsonSettingsStore,
  devServerHintUrl
} from './settings-store'
import { reportStartup } from './services/startup-report'
import legalworkLogoPng from '../asset/img/legalwork.png?url'
import { createAppIcon } from './app-icon'
import {
  applyLegalworkRuntimePatch,
  computeLegalworkRuntimeCredentialPatch,
  getActiveAgentApiKey,
  getLegalworkRuntimeSettings,
  isLegalworkModelAuthConfigured,
  mergeClawSettings,
  mergeLearningIterationSettings,
  mergeModelProviderSettings,
  mergeScheduleSettings,
  legalworkSettingsPatch,
  mergeWriteSettings,
  normalizeAppSettings,
  normalizeAppBehaviorSettings,
  normalizeKeyboardShortcuts,
  resolveLegalworkRuntimeSettings,
  type AppBehaviorConfigV1,
  type AppSettingsPatch,
  type AppSettingsV1
} from '../shared/app-settings'
import { parseRuntimeErrorBody, runtimeErrorToError, type RuntimeErrorCode } from '../shared/runtime-error'
import type { GuiUpdateState } from '../shared/gui-update'
import { isAllowedDevPreviewUrl } from '../shared/dev-preview-url'
import { fetchModelsForEndpoint, fetchUpstreamModelIds } from './upstream-models'
import { APP_PRODUCT_NAME, APP_USER_MODEL_ID, configureAppIdentity } from './app-identity'
import {
  legalworkRuntimeAdapter,
  getRuntimeBaseUrlForSettings,
  runtimeAuthHeaders,
  runtimeRequestViaHost
} from './runtime/legalwork-adapter'
import { findAvailableLegalworkPort, resolveBundledOfficePythonPath } from './legalwork-process'
import { ensureOfficeRuntimeHealthy } from './office-runtime-repair'
import { configureLogger, logError, logWarn, pruneOnStartup, setLogErrorReporter } from './logger'
import { isNonLatin1ResponseHeaderError } from './non-latin1-headers'
import {
  configureErrorReporting,
  reportError,
  ERROR_REPORT_ENDPOINT_ENV,
  ERROR_REPORT_GITHUB_REPO_ENV,
  ERROR_REPORT_GITHUB_TOKEN_ENV,
  ERROR_REPORT_GITHUB_LABEL_ENV
} from './error-report'
import { createClawRuntime, type ClawRuntime } from './claw-runtime'
import { createScheduleRuntime, type ScheduleRuntime } from './schedule-runtime'
import {
  createLearningIterationRuntime,
  type LearningIterationRuntime
} from './learning-iteration-runtime'
import { runClawScheduleMcpServerFromArgv } from './claw-schedule-mcp-server'
import {
  clawScheduleMcpSettingsChanged,
  resolveLegalworkMcpJsonPath,
  syncClawScheduleMcpConfig,
  type ClawScheduleMcpLaunchConfig
} from './claw-schedule-mcp-config'
import { registerAppIpcHandlers } from './ipc/register-app-ipc-handlers'
import {
  configureManagedWeixinBridgeUrlResolver,
  pollFeishuInstall,
  pollWeixinInstall,
  startFeishuInstallQrcode,
  startWeixinInstallQrcode
} from './claw-platform-install'
import { registerRuntimeSseIpc, stopAllRuntimeSse, stopRuntimeSseForWebContents } from './runtime-sse-ipc'
import {
  configureWeixinBridgeRuntimeContextProvider,
  ensureWeixinBridgeRpcUrl,
  sendWeixinBridgeMessage,
  stopWeixinBridgeRuntime
} from './weixin-bridge-runtime'
import { webhookUrl } from './claw-runtime-helpers'
import { isLegalworkHealthResponseBody } from './legalwork-health'
import { FingerprintedSingleFlight } from './runtime/fingerprinted-single-flight'
import { recoverUnhealthyOwnedRuntime } from './runtime/unhealthy-owned-runtime'
import { isRuntimeProbePath } from './runtime/runtime-probe-path'
import { continueAppQuitAfterCleanup } from './continue-app-quit'
import {
  ChildProcessGoneReportPolicy,
  shouldReportRenderProcessGone
} from './process-gone-policy'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HIDDEN_START_ARG = '--hidden'
const startupTraceEnabled = process.env.DEEPSEEK_GUI_STARTUP_TRACE === '1'
const startupTraceStart = Date.now()
const RUNTIME_ENSURE_SLOW_MS = 2_500
const RUNTIME_EXISTING_HEALTH_FAST_MS = 3_000
const RUNTIME_PORT_CONFLICT_HEALTH_RECHECK_MS = 2_000
const RUNTIME_THREAD_API_PROBE_TIMEOUT_MS = 2_000

function traceStartup(label: string, detail?: unknown): void {
  if (!startupTraceEnabled) return
  const elapsed = String(Date.now() - startupTraceStart).padStart(6, ' ')
  if (detail === undefined) {
    console.info(`[startup +${elapsed}ms] ${label}`)
  } else {
    console.info(`[startup +${elapsed}ms] ${label}`, detail)
  }
}

function shouldStartWeixinBridgeRuntime(settings: AppSettingsV1): boolean {
  return settings.claw.enabled &&
    settings.claw.im.enabled &&
    settings.claw.channels.some((channel) => channel.enabled && channel.provider === 'weixin')
}

function syncWeixinBridgeRuntime(settings: AppSettingsV1): void {
  if (!shouldStartWeixinBridgeRuntime(settings)) return
  void ensureWeixinBridgeRpcUrl().catch((error) => {
    logWarn('weixin-bridge', 'Failed to start managed WeChat bridge.', {
      message: error instanceof Error ? error.message : String(error)
    })
  })
}

const runningClawScheduleMcpServer =
  process.argv.includes('--gui-schedule-mcp-server') || process.argv.includes('--claw-schedule-mcp-server')

function resolveLogDirectory(): string {
  return join(app.getPath('userData'), 'logs')
}

function resolvePreloadPath(): string {
  const cjsPath = join(__dirname, '../preload/index.cjs')
  if (existsSync(cjsPath)) return cjsPath
  return join(__dirname, '../preload/index.mjs')
}

function getClawScheduleMcpLaunchConfig(): ClawScheduleMcpLaunchConfig {
  return {
    appPath: app.getAppPath(),
    execPath: process.execPath,
    isPackaged: app.isPackaged
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function runtimeFailure(code: string, message: string, status = 0, details?: unknown) {
  return {
    ok: false as const,
    status,
    body: JSON.stringify({ code, message, ...(details !== undefined ? { details } : {}) })
  }
}

function resolveConfiguredApiKey(settings: AppSettingsV1): string {
  const fromSettings = getActiveAgentApiKey(settings)
  const fromEnv = process.env.DEEPSEEK_API_KEY?.trim() ?? ''
  return fromSettings || fromEnv
}

function hasConfiguredModelAuth(settings: AppSettingsV1): boolean {
  return isLegalworkModelAuthConfigured(settings) || Boolean(process.env.DEEPSEEK_API_KEY?.trim())
}

function runtimeJsonError(code: string, message: string): Error {
  return runtimeErrorToError({ code: code as RuntimeErrorCode, message })
}

traceStartup('main module evaluated')

if (runningClawScheduleMcpServer && process.platform === 'darwin' && app.dock) {
  app.dock.hide()
}

// 在最早的阶段把 app 名称、AppUserModelId 都设好。
// Windows 任务栏 / 系统托盘 / 通知中心看到的应用名都来自这里;
// 设得太晚的话 BrowserWindow title、托盘、IPC 启动时拿到的还是旧的。
configureAppIdentity()

if (!runningClawScheduleMcpServer && process.platform === 'win32') {
  app.setAppUserModelId(APP_USER_MODEL_ID)
}

let mainWindow: BrowserWindow | null = null
let store: JsonSettingsStore
let logDir = ''
let clawRuntime: ClawRuntime | null = null
let scheduleRuntime: ScheduleRuntime | null = null
let learningIterationRuntime: LearningIterationRuntime | null = null
let managedRuntimesStoppedForQuit = false
let managedRuntimesStopPromise: Promise<void> | null = null
let appBehavior: AppBehaviorConfigV1 = normalizeAppBehaviorSettings()
let tray: Tray | null = null
let isQuitting = false
let isQuittingForGuiUpdate = false
let quitContinuationStarted = false

type GuiUpdaterModule = typeof import('./gui-updater')

let guiUpdaterModulePromise: Promise<GuiUpdaterModule> | null = null
let guiUpdaterInitialized = false

function emitClawChannelActivity(payload: { channelId: string; threadId: string }): void {
  if (!mainWindow || mainWindow.isDestroyed()) return
  mainWindow.webContents.send('claw:channel-activity', payload)
}

const MANAGED_STOP_TIMEOUT_MS = 1_600
const FORCE_QUIT_TIMEOUT_MS = 2_000

async function stopManagedRuntimesForQuit(): Promise<void> {
  if (managedRuntimesStoppedForQuit) return
  await Promise.race([
    stopManagedRuntimes(),
    new Promise<void>((resolve) => setTimeout(resolve, MANAGED_STOP_TIMEOUT_MS))
  ])
  managedRuntimesStoppedForQuit = true
}

async function stopManagedRuntimes(): Promise<void> {
  if (!managedRuntimesStopPromise) {
    managedRuntimesStopPromise = (async () => {
      stopAllRuntimeSse()
      scheduleRuntime?.stop()
      clawRuntime?.stop()
      learningIterationRuntime?.stop()
      stopWeixinBridgeRuntime()
      await legalworkRuntimeAdapter.stopAndWait()
    })().finally(() => {
      managedRuntimesStopPromise = null
    })
  }
  return managedRuntimesStopPromise
}

function prepareToQuitForGuiUpdate(): void {
  isQuitting = true
  isQuittingForGuiUpdate = true
  managedRuntimesStoppedForQuit = true
}

function abortQuitForGuiUpdate(): void {
  isQuitting = false
  isQuittingForGuiUpdate = false
  managedRuntimesStoppedForQuit = false
}

async function loadGuiUpdaterModule(): Promise<GuiUpdaterModule> {
  if (!guiUpdaterModulePromise) {
    guiUpdaterModulePromise = import('./gui-updater')
      .then((module) => {
        if (!guiUpdaterInitialized) {
          module.initializeGuiUpdater(
            () => mainWindow,
            async () => (await store.load()).guiUpdate.channel,
            stopManagedRuntimesForQuit,
            prepareToQuitForGuiUpdate,
            abortQuitForGuiUpdate
          )
          guiUpdaterInitialized = true
        }
        return module
      })
      .catch((error) => {
        guiUpdaterModulePromise = null
        throw error
      })
  }
  return guiUpdaterModulePromise
}

async function readGuiUpdateState(): Promise<GuiUpdateState> {
  if (!guiUpdaterModulePromise) return { status: 'idle' }
  try {
    const module = await loadGuiUpdaterModule()
    return module.getGuiUpdateState()
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : String(error),
      code: 'unknown'
    }
  }
}


function installDevPreviewWebviewGuards(): void {
  app.on('web-contents-created', (_, contents) => {
    contents.on('will-attach-webview', (event, webPreferences, params) => {
      const src = typeof params.src === 'string' ? params.src : ''
      if (!isAllowedDevPreviewUrl(src)) {
        event.preventDefault()
        return
      }

      delete webPreferences.preload
      delete (webPreferences as { preloadURL?: string }).preloadURL
      webPreferences.nodeIntegration = false
      webPreferences.contextIsolation = true
      webPreferences.sandbox = true
      webPreferences.webSecurity = true
      webPreferences.allowRunningInsecureContent = false
    })

    contents.on('will-navigate', (event, navigationUrl) => {
      if (contents.getType() !== 'webview') return
      if (!isAllowedDevPreviewUrl(navigationUrl)) event.preventDefault()
    })

    contents.setWindowOpenHandler(({ url }) => {
      if (contents.getType() !== 'webview') return { action: 'allow' }
      return isAllowedDevPreviewUrl(url) ? { action: 'allow' } : { action: 'deny' }
    })
  })
}


const appIcon = createAppIcon(legalworkLogoPng)
traceStartup('app icon loaded', { source: legalworkLogoPng.startsWith('data:') ? 'data-url' : 'path' })
const gotSingleInstanceLock = runningClawScheduleMcpServer || app.requestSingleInstanceLock()
traceStartup('single instance lock checked', {
  gotSingleInstanceLock,
  skippedForClawScheduleMcpServer: runningClawScheduleMcpServer
})

function trayLabels(locale: AppSettingsV1['locale']): { show: string; quit: string; tooltip: string } {
  if (locale === 'zh') {
    return {
      show: `显示 ${APP_PRODUCT_NAME}`,
      quit: '退出',
      tooltip: APP_PRODUCT_NAME
    }
  }
  return {
    show: `Show ${APP_PRODUCT_NAME}`,
    quit: 'Quit',
    tooltip: APP_PRODUCT_NAME
  }
}

function shouldStartHidden(settings: AppSettingsV1): boolean {
  return (
    process.platform === 'win32' &&
    settings.appBehavior.openAtLogin &&
    settings.appBehavior.startMinimized &&
    process.argv.includes(HIDDEN_START_ARG)
  )
}

function syncLoginItemSettings(settings: AppSettingsV1): void {
  if (process.platform !== 'win32' && process.platform !== 'darwin') return
  const behavior = settings.appBehavior
  try {
    app.setLoginItemSettings({
      openAtLogin: behavior.openAtLogin,
      args:
        process.platform === 'win32' && behavior.openAtLogin && behavior.startMinimized
          ? [HIDDEN_START_ARG]
          : []
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn('[legalwork] failed to update login item settings:', error)
    logWarn('desktop-behavior', 'Failed to update login item settings.', { message })
  }
}

function revealMainWindow(): void {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow()
    return
  }
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
}

function syncTray(settings: AppSettingsV1): void {
  appBehavior = {
    ...settings.appBehavior,
    closeToTray: settings.appBehavior.closeToTray ||
      (settings.learningIteration.enabled && settings.learningIteration.keepRunningInTray)
  }
  if (!appBehavior.closeToTray) {
    if (tray) {
      tray.destroy()
      tray = null
    }
    return
  }

  if (!tray) {
    tray = new Tray(appIcon.isEmpty() ? nativeImage.createEmpty() : appIcon)
    tray.on('click', revealMainWindow)
    tray.on('double-click', revealMainWindow)
  }

  const labels = trayLabels(settings.locale)
  tray.setToolTip(labels.tooltip)
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: labels.show, click: revealMainWindow },
      { type: 'separator' },
      {
        label: labels.quit,
        click: () => {
          isQuitting = true
          app.quit()
        }
      }
    ])
  )
}

function normalizeNotificationText(raw: string | undefined, fallback: string, maxLength: number): string {
  const value = typeof raw === 'string' && raw.trim() ? raw.trim() : fallback
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value
}

type TurnCompleteNotificationPayload = {
  threadId?: string
  title?: string
  body?: string
}

async function showTurnCompleteNotification(
  payload: TurnCompleteNotificationPayload
): Promise<{ ok: true; shown: boolean; reason?: string } | { ok: false; message: string }> {
  const settings = await store.load()
  if (!settings.notifications.turnComplete) {
    return { ok: true, shown: false, reason: 'disabled' }
  }
  if (!Notification.isSupported()) {
    return { ok: true, shown: false, reason: 'unsupported' }
  }

  const title = normalizeNotificationText(payload.title, APP_PRODUCT_NAME, 80)
  const body = normalizeNotificationText(payload.body, 'Conversation complete.', 180)

  try {
    const notification = new Notification({
      title,
      body,
      icon: appIcon.isEmpty() ? undefined : appIcon
    })
    notification.on('click', () => {
      revealMainWindow()
    })
    notification.show()
    return { ok: true, shown: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    logError('notification', 'Failed to show turn completion notification', {
      message,
      threadId: payload.threadId
    })
    return { ok: false, message }
  }
}

async function probeThreadApi(settings: AppSettingsV1): Promise<
  | { ok: true }
  | { ok: false; error: string; message: string }
> {
  const base = getRuntimeBaseUrlForSettings(settings)
  const headers = runtimeAuthHeaders(settings)
  headers.set('Accept', 'application/json')

  try {
    const res = await fetch(`${base}/v1/threads?limit=1`, {
      headers,
      signal: AbortSignal.timeout(RUNTIME_THREAD_API_PROBE_TIMEOUT_MS)
    })
    if (res.ok) return { ok: true }
    const info = parseRuntimeErrorBody(
      await res.text(),
      'The local runtime returned an unexpected error.'
    )
    if (res.status === 401 && /bearer token required/i.test(info.message)) {
      return {
        ok: false,
        error: 'runtime_auth_required',
        message: 'The local runtime requires a bearer token for thread APIs.'
      }
    }
    return {
      ok: false,
      error: info.code === 'unknown' ? 'runtime_request_failed' : info.code,
      message: info.message
    }
  } catch (e) {
    return {
      ok: false,
      error: 'fetch_failed',
      message: e instanceof Error ? e.message : String(e)
    }
  }
}

async function waitForLegalworkHealth(settings: AppSettingsV1, timeoutMs: number): Promise<boolean> {
  const base = getRuntimeBaseUrlForSettings(settings)
  const deadline = Date.now() + timeoutMs

  while (Date.now() <= deadline) {
    try {
      const remaining = Math.max(1, deadline - Date.now())
      const res = await fetch(`${base}/health`, {
        headers: runtimeAuthHeaders(settings),
        signal: AbortSignal.timeout(Math.max(250, Math.min(1_000, remaining)))
      })
      if (res.ok && isLegalworkHealthResponseBody(await res.text())) return true
    } catch {
      /* retry until the deadline */
    }
    await sleep(150)
  }

  return false
}

async function sleepWithAbort(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted || ms <= 0) return
  await new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = (): void => {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      resolve()
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

const runtimeEnsureSingleFlight = new FingerprintedSingleFlight()
let runtimeSettingsApplyPromise: Promise<void> | null = null
let lastAppliedSettings: AppSettingsV1 | null = null

function queueRuntimeSettingsApply(prev: AppSettingsV1, next: AppSettingsV1): void {
  // Always update the prev/next anchor so a later task diffs against
  // the settings that were actually applied last, not against the
  // original `prev` captured when this call was queued.
  const anchor = lastAppliedSettings ?? prev
  lastAppliedSettings = next
  const startupConfigChanged = runtimeStartupConfigChanged(anchor, next)
  if (!startupConfigChanged) return

  const previousTask = runtimeSettingsApplyPromise ?? Promise.resolve()
  const task = previousTask
    .catch(() => undefined)
    .then(async () => {
      const current = lastAppliedSettings ?? next
      await restartManagedRuntimeForSettingsChange(anchor, current)
    })
    .catch((error: unknown) => {
      logWarn('settings-apply', 'Failed to apply Legalwork runtime settings in background', {
        message: error instanceof Error ? error.message : String(error)
      })
    })
    .finally(() => {
      if (runtimeSettingsApplyPromise === task) {
        runtimeSettingsApplyPromise = null
      }
    })

  runtimeSettingsApplyPromise = task
}

function queueRuntimeMcpConfigApply(settings: AppSettingsV1): void {
  lastAppliedSettings = settings

  const previousTask = runtimeSettingsApplyPromise ?? Promise.resolve()
  const task = previousTask
    .catch(() => undefined)
    .then(async () => {
      const current = lastAppliedSettings ?? settings
      await restartManagedRuntimeForMcpConfigChange(current)
    })
    .catch((error: unknown) => {
      logWarn('mcp-config', 'Failed to apply Legalwork MCP config change in background', {
        message: error instanceof Error ? error.message : String(error)
      })
    })
    .finally(() => {
      if (runtimeSettingsApplyPromise === task) {
        runtimeSettingsApplyPromise = null
      }
    })

  runtimeSettingsApplyPromise = task
}

async function waitForQueuedRuntimeSettingsApply(): Promise<void> {
  if (!runtimeSettingsApplyPromise) return
  await runtimeSettingsApplyPromise
}

/**
 * Build a stable fingerprint of the settings that affect the
 * Legalwork runtime. Calls for the same configuration share one
 * result, while a changed configuration waits and starts a new check.
 */
function runtimeFingerprint(settings: AppSettingsV1): string {
  return stableSettingsStringify(resolveLegalworkRuntimeSettings(settings))
}

async function ensureRuntime(settings: AppSettingsV1): Promise<void> {
  const fingerprint = runtimeFingerprint(settings)
  await runtimeEnsureSingleFlight.run(fingerprint, async () => {
    const startedAt = Date.now()
    let failure: unknown
    try {
      await ensureRuntimeOnce(settings)
    } catch (error) {
      failure = error
      throw error
    } finally {
      const durationMs = Date.now() - startedAt
      if (failure) {
        logWarn('runtime-ensure', 'Legalwork runtime ensure failed.', {
          durationMs,
          message: failure instanceof Error ? failure.message : String(failure)
        })
      } else if (durationMs >= RUNTIME_ENSURE_SLOW_MS) {
        logWarn('runtime-ensure', 'Legalwork runtime ensure was slow.', { durationMs })
      }
    }
  })
}

async function ensureRuntimeOnce(settings: AppSettingsV1): Promise<void> {
  await waitForQueuedRuntimeSettingsApply()
  await ensureLegalworkRuntime(settings)
}

async function ensureLegalworkRuntime(settings: AppSettingsV1): Promise<void> {
  const runtime = getLegalworkRuntimeSettings(settings)
  const hasModelAuth = hasConfiguredModelAuth(settings)
  const adapter = legalworkRuntimeAdapter

  const healthy = await waitForLegalworkHealth(settings, RUNTIME_EXISTING_HEALTH_FAST_MS)
  if (healthy) {
    const threadApi = await probeThreadApi(settings)
    if (threadApi.ok) return
    // An externally managed runtime must not be terminated by this app. An
    // owned child, however, is unhealthy if its core API fails even while the
    // shallow /health endpoint still responds, so let it enter recovery below.
    if (!adapter.isChildRunning()) {
      throw runtimeJsonError(threadApi.error, threadApi.message)
    }
    logWarn('runtime-ensure', 'Owned Legalwork child passed health but failed the thread API probe.', {
      message: threadApi.message
    })
  }

  if (!hasModelAuth) {
    throw runtimeJsonError(
      'missing_model_auth',
      'Configure a model API key or sign in to ChatGPT before the GUI starts Legalwork.'
    )
  }
  if (!runtime.autoStart) {
    throw runtimeJsonError(
      'runtime_offline',
      'Legalwork is offline. Enable automatic startup in Settings, or start `legalwork serve` manually.'
    )
  }

  const ownedRecovery = await recoverUnhealthyOwnedRuntime(adapter, async () => {
    const lateHealthy = await waitForLegalworkHealth(settings, RUNTIME_PORT_CONFLICT_HEALTH_RECHECK_MS)
    if (!lateHealthy) return false
    return (await probeThreadApi(settings)).ok
  })
  if (ownedRecovery === 'became-healthy') return
  if (ownedRecovery === 'stopped') {
    logWarn('runtime-ensure', 'Stopped an owned Legalwork child after its health probe failed.', {
      port: runtime.port
    })
  }
  const reclaim = await adapter.reclaimPort(runtime.port)
  if (!reclaim.ok) {
    const lateHealthy = await waitForLegalworkHealth(settings, RUNTIME_PORT_CONFLICT_HEALTH_RECHECK_MS)
    if (lateHealthy) {
      const threadApi = await probeThreadApi(settings)
      if (threadApi.ok) return
      throw runtimeJsonError(threadApi.error, threadApi.message)
    }
    // The preferred port is taken by another process (common on shared machines:
    // another Legalwork instance, a leftover serve process, or an unrelated app).
    // Auto-select the next free port and persist it so the runtime and all
    // health/thread probes use the same port. Only fail if no port is free.
    const fallbackPort = await findAvailableLegalworkPort(runtime.port)
    const patched = await store.patch({ agents: legalworkSettingsPatch({ port: fallbackPort }) })
    const newRuntime = getLegalworkRuntimeSettings(patched)
    console.warn(
      `[legalwork] port ${runtime.port} is in use; falling back to ${newRuntime.port}`
    )
    const healthy2 = await waitForLegalworkHealth(patched, RUNTIME_PORT_CONFLICT_HEALTH_RECHECK_MS)
    if (healthy2) {
      const threadApi2 = await probeThreadApi(patched)
      if (threadApi2.ok) return
      throw runtimeJsonError(threadApi2.error, threadApi2.message)
    }
    try {
      await adapter.ensureRunning(patched)
    } catch (e) {
      console.error('[legalwork] failed to start legalwork on fallback port:', e)
      throw e
    }
    const started = await waitForLegalworkHealth(patched, 20_000)
    if (!started) {
      throw runtimeJsonError(
        'runtime_unhealthy',
        'Legalwork did not become healthy after launch.'
      )
    }
    const threadApi3 = await probeThreadApi(patched)
    if (!threadApi3.ok) {
      throw runtimeJsonError(threadApi3.error, threadApi3.message)
    }
    return
  }
  try {
    await adapter.ensureRunning(settings)
  } catch (e) {
    console.error('[legalwork] failed to start legalwork:', e)
    throw e
  }
  const started = await waitForLegalworkHealth(settings, 20_000)
  if (!started) {
    throw runtimeJsonError(
      'runtime_unhealthy',
      'Legalwork did not become healthy after launch.'
    )
  }

  const threadApi = await probeThreadApi(settings)
  if (!threadApi.ok) {
    throw runtimeJsonError(threadApi.error, threadApi.message)
  }
}

function createWindow(options: { suppressInitialShow?: boolean } = {}): void {
  traceStartup('createWindow:start')
  // macOS 上若不显式设置应用菜单，Electron 会使用默认英文菜单
  // （File/Edit/View/Window/Help），导致用户看到满屏英文。这里为 macOS
  // 提供中文应用菜单；Windows/Linux 用 setApplicationMenu(null) 彻底移除
  // 顶部菜单栏（窗口内菜单 + Alt 唤出的系统菜单）。
  if (process.platform === 'darwin') {
    const appMenu = Menu.buildFromTemplate([
      {
        label: APP_PRODUCT_NAME,
        submenu: [
          { role: 'about', label: `关于 ${APP_PRODUCT_NAME}` },
          { type: 'separator' },
          { role: 'hide', label: `隐藏 ${APP_PRODUCT_NAME}` },
          { role: 'hideOthers', label: '隐藏其他' },
          { role: 'unhide', label: '全部显示' },
          { type: 'separator' },
          { role: 'quit', label: `退出 ${APP_PRODUCT_NAME}` }
        ]
      },
      {
        label: '文件',
        submenu: [
          { role: 'close', label: '关闭窗口' },
          { type: 'separator' },
          { role: 'quit', label: `退出 ${APP_PRODUCT_NAME}` }
        ]
      },
      {
        label: '编辑',
        submenu: [
          { role: 'undo', label: '撤销' },
          { role: 'redo', label: '重做' },
          { type: 'separator' },
          { role: 'cut', label: '剪切' },
          { role: 'copy', label: '复制' },
          { role: 'paste', label: '粘贴' },
          { role: 'selectAll', label: '全选' }
        ]
      },
      {
        label: '窗口',
        role: 'windowMenu'
      },
      {
        label: '帮助',
        role: 'help',
        submenu: [
          { role: 'about', label: `关于 ${APP_PRODUCT_NAME}` }
        ]
      }
    ])
    Menu.setApplicationMenu(appMenu)
  } else {
    Menu.setApplicationMenu(null)
  }
  const preloadPath = resolvePreloadPath()
  const usesDesktopTitleBar = process.platform === 'win32' || process.platform === 'linux'
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    icon: appIcon.isEmpty() ? undefined : appIcon,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : usesDesktopTitleBar ? 'hidden' : 'default',
    trafficLightPosition: process.platform === 'darwin' ? { x: 31, y: 22 } : undefined,
    autoHideMenuBar: usesDesktopTitleBar,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      sandbox: true,
      webviewTag: true,
      // 窗口最小化/被遮挡时不要节流渲染层。否则定时器、轮询、fetch 与 SSE 事件消费
      // 会被 Electron 暂停，导致到 Legalwork 运行时的连接在最小化后处于半死状态、
      // 恢复时表现为“重新连接”却连不上，必须完全退出重启。
      backgroundThrottling: false
    }
  })
  if (usesDesktopTitleBar) {
    mainWindow.setMenu(null)
    mainWindow.setMenuBarVisibility(false)
  }
  mainWindow.webContents.on('preload-error', (_event, preloadPath, error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[legalwork] failed to load preload ${preloadPath}:`, error)
    logError('preload', 'Failed to load preload script', { preloadPath, message })
  })
  const showWindow = (): void => {
    if (options.suppressInitialShow) return
    if (!mainWindow || mainWindow.isDestroyed() || mainWindow.isVisible()) return
    mainWindow.show()
  }
  mainWindow.on('close', (event) => {
    if (isQuitting || !appBehavior.closeToTray) return
    event.preventDefault()
    mainWindow?.hide()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  const webContentsId = mainWindow.webContents.id
  mainWindow.webContents.on('destroyed', () => {
    stopRuntimeSseForWebContents(webContentsId)
  })
  const devUrl = devServerHintUrl()
  traceStartup('createWindow:load', { devUrl: devUrl ?? 'file' })
  if (devUrl) {
    mainWindow.loadURL(devUrl)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.once('ready-to-show', () => {
    traceStartup('window:ready-to-show')
    showWindow()
  })
  mainWindow.webContents.once('did-finish-load', () => {
    traceStartup('window:did-finish-load')
    showWindow()
  })
  setTimeout(() => {
    traceStartup('window:fallback-show-timeout')
    showWindow()
  }, 1500)
}

/**
 * Stable equality for the Legalwork runtime settings. Most fields are flat,
 * but GUI-managed capability options can be nested, so compare values
 * structurally while still surviving future field additions.
 */
function legalworkRuntimeConfigChanged(prev: AppSettingsV1, next: AppSettingsV1): boolean {
  const a = resolveLegalworkRuntimeSettings(prev)
  const b = resolveLegalworkRuntimeSettings(next)
  const keys = new Set([...Object.keys(a), ...Object.keys(b)] as Array<keyof typeof a>)
  for (const key of keys) {
    if (!stableSettingsValueEqual(a[key], b[key])) return true
  }
  return false
}

function stableSettingsValueEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  return stableSettingsStringify(a) === stableSettingsStringify(b)
}

function stableSettingsStringify(value: unknown): string {
  return JSON.stringify(canonicalSettingsValue(value))
}

function canonicalSettingsValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalSettingsValue)
  if (!value || typeof value !== 'object') return value
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    out[key] = canonicalSettingsValue((value as Record<string, unknown>)[key])
  }
  return out
}

function runtimeStartupConfigChanged(prev: AppSettingsV1, next: AppSettingsV1): boolean {
  return legalworkRuntimeConfigChanged(prev, next) || clawScheduleMcpSettingsChanged(prev, next)
}

async function restartManagedRuntimeForSettingsChange(
  prev: AppSettingsV1,
  next: AppSettingsV1
): Promise<void> {
  if (!runtimeStartupConfigChanged(prev, next)) return

  const runtime = resolveLegalworkRuntimeSettings(next)
  const adapter = legalworkRuntimeAdapter
  const wasRunning = adapter.isChildRunning()

  if (!wasRunning) return
  if (wasRunning) {
    await adapter.stopAndWait()
  }
  if (!hasConfiguredModelAuth(next) || !runtime.autoStart) return

  try {
    await adapter.ensureRunning(next)
    const healthy = await waitForLegalworkHealth(next, 20_000)
    if (!healthy) {
      console.warn('[legalwork] Legalwork restart did not become healthy after settings change')
    }
  } catch (e) {
    console.warn('[legalwork] Legalwork restart failed after settings change:', e)
  }
}

async function restartManagedRuntimeForMcpConfigChange(settings: AppSettingsV1): Promise<void> {
  const runtime = resolveLegalworkRuntimeSettings(settings)
  const adapter = legalworkRuntimeAdapter
  const wasRunning = adapter.isChildRunning()

  if (!wasRunning) return
  await adapter.stopAndWait()
  if (!hasConfiguredModelAuth(settings) || !runtime.autoStart) return

  try {
    await adapter.ensureRunning(settings)
    const healthy = await waitForLegalworkHealth(settings, 20_000)
    if (!healthy) {
      console.warn('[legalwork] Legalwork restart did not become healthy after MCP config change')
    }
  } catch (e) {
    console.warn('[legalwork] Legalwork restart failed after MCP config change:', e)
  }
}

async function runtimeRequest(
  settings: AppSettingsV1,
  pathAndQuery: string,
  init: { method?: string; body?: string; headers?: Record<string, string> }
): Promise<{ ok: boolean; status: number; body: string }> {
  try {
    return await runtimeRequestViaHost(settings, pathAndQuery, init, ensureRuntime)
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    if (isRuntimeProbePath(pathAndQuery) && (init.method ?? 'GET') === 'GET') {
      logWarn('runtime-request', `HTTP request to ${pathAndQuery} failed (probe, not reported)`, { message })
    } else {
      logError('runtime-request', `HTTP request to ${pathAndQuery} failed`, { message })
    }
    const parsed = parseRuntimeErrorBody(message, message)
    if (parsed.code !== 'unknown' || parsed.message !== message) {
      return runtimeFailure(parsed.code, parsed.message, 0, parsed.details)
    }
    return runtimeFailure('fetch_failed', message)
  }
}

function registerGlobalErrorHandlers(): void {
  const childProcessGonePolicy = new ChildProcessGoneReportPolicy()
  const report = (input: { category: string; message: string; stack?: string }): void => {
    // logError writes the local log AND (via the injected reporter) triggers
    // the silent error report. Never let this path itself throw. The stack goes
    // in `detail` so a crash that never reaches the reporter is still
    // diagnosable from the local log alone.
    try {
      logError(input.category, input.message, input.stack ? { stack: input.stack } : undefined)
    } catch {
      /* ignore */
    }
  }

  process.on('uncaughtException', (error) => {
    const message = error instanceof Error ? error.message : String(error)
    // Electron's network layer rejects non-Latin-1 response headers, and the
    // throw happens inside Electron's own callback — it escapes the request's
    // promise and lands here. Only that one request failed; the app itself is
    // intact, so record it and keep running instead of taking the app down.
    if (isNonLatin1ResponseHeaderError(error)) {
      logWarn('uncaught-exception', `${message}（该请求已失败，应用继续运行）`)
      return
    }
    report({
      category: 'uncaught-exception',
      message,
      stack: error instanceof Error ? error.stack : undefined
    })
    // State after an uncaught exception is unreliable. Exit explicitly (via
    // app.exit, skipping the quit-cleanup chain) — same "crash" behavior as
    // before, but with the failure recorded and reported first.
    app.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    report({
      category: 'unhandled-rejection',
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined
    })
    // Not necessarily fatal; record + report but keep running.
  })

  app.on('render-process-gone', (_event, _webContents, details) => {
    if (!shouldReportRenderProcessGone(details, isQuitting)) {
      logWarn('render-process-gone', 'Renderer process exited without an actionable crash.', details)
      return
    }
    report({
      category: 'render-process-gone',
      message: `${details.reason} (exit code ${details.exitCode})`
    })
  })

  app.on('child-process-gone', (_event, details) => {
    if (!childProcessGonePolicy.shouldReport(details, isQuitting)) {
      logWarn('child-process-gone', 'Child process exited without a persistent actionable crash.', details)
      return
    }
    report({
      category: 'child-process-gone',
      message: `${details.type} ${details.reason} (${details.exitCode ?? ''})`
    })
  })
}

if (runningClawScheduleMcpServer) {
  void runClawScheduleMcpServerFromArgv(process.argv).catch((error) => {
    console.error('[claw-schedule-mcp] server failed:', error)
    process.exit(1)
  })
} else {
app.whenReady().then(async () => {
  traceStartup('app.whenReady:start')
  if (!gotSingleInstanceLock) return

  traceStartup('install webview guards:start')
  installDevPreviewWebviewGuards()
  traceStartup('install webview guards:done')

  if (process.platform === 'darwin' && app.dock && !appIcon.isEmpty()) {
    app.dock.setIcon(appIcon)
  }

  store = new JsonSettingsStore(app.getPath('userData'))
  traceStartup('settings load:start')
  const initial = await store.load()
  traceStartup('settings load:done')
  // Best-effort unique-device startup report. Endpoint reads from env so it
  // can be wired without a rebuild; failures are swallowed inside.
  const startupReportEndpoint = (process.env.LEGALWORK_STARTUP_REPORT_URL || '').trim()
  void reportStartup({
    dataDir: app.getPath('userData'),
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    appId: app.getName(),
    endpoint: startupReportEndpoint || undefined
  })
  appBehavior = initial.appBehavior
  syncLoginItemSettings(initial)
  syncTray(initial)
  await syncClawScheduleMcpConfig(initial, getClawScheduleMcpLaunchConfig()).catch((error) => {
    console.error('[claw-schedule-mcp] failed to sync config on startup:', error)
  })

  logDir = resolveLogDirectory()
  configureLogger({
    dir: logDir,
    enabled: initial.log.enabled,
    retentionDays: initial.log.retentionDays
  })
  // Silent automatic error reporting. Publisher-controlled: nothing is sent
  // unless a destination is configured; users do nothing. Prefer GitHub issue
  // reporting (repo + minimal token); a generic endpoint URL also works.
  // Runtime env (dev/CI) wins; otherwise the config file bundled into the
  // packaged app resources supplies the destination.
  configureErrorReporting({
    dataDir: app.getPath('userData'),
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    appId: app.getName(),
    githubRepo: (process.env[ERROR_REPORT_GITHUB_REPO_ENV] || '').trim() || undefined,
    githubToken: (process.env[ERROR_REPORT_GITHUB_TOKEN_ENV] || '').trim() || undefined,
    githubLabels: (process.env[ERROR_REPORT_GITHUB_LABEL_ENV] || '').split(',').map((s) => s.trim()).filter(Boolean),
    endpoint: (process.env[ERROR_REPORT_ENDPOINT_ENV] || '').trim() || undefined,
    // Development builds may have the release config in the repository root,
    // but local hot-reload/chunk errors must not be uploaded as user reports.
    // Developers can still opt in explicitly through the environment variables.
    configPath: app.isPackaged
      ? join(process.resourcesPath || '', 'error-report.config.json')
      : undefined
  })
  setLogErrorReporter((input) => reportError(input))
  registerGlobalErrorHandlers()
  traceStartup('logger configured')

  // Self-check the bundled Office Python and repair it in place when only its
  // packages are missing. A Windows upgrade over a running LegalWork cannot
  // replace files that are in use, and the resulting half-installed runtime
  // used to tell the user to reinstall — which is the same overwrite-install
  // that broke it. Deliberately not awaited: startup must not wait on pip.
  if (app.isPackaged) {
    void ensureOfficeRuntimeHealthy({
      python: resolveBundledOfficePythonPath({
        appPath: app.getAppPath(),
        isPackaged: app.isPackaged,
        resourcesPath: process.resourcesPath
      }),
      resourcesPath: process.resourcesPath || '',
      log: (message) => console.info(message)
    }).catch((error) => {
      console.error('[office-runtime] self-check failed:', error)
    })
  }
  scheduleRuntime = createScheduleRuntime({ store, runtimeRequest, logError, powerSaveBlocker })
  scheduleRuntime.sync(initial)
  clawRuntime = createClawRuntime({
    store,
    runtimeRequest,
    logError,
    notifyChannelActivity: emitClawChannelActivity,
    sendWeixinBridgeMessage,
    createScheduledTaskFromText: (text, options) =>
      scheduleRuntime?.createScheduledTaskFromText(text, options) ?? Promise.resolve({ kind: 'noop' })
  })
  clawRuntime.sync(initial)
  learningIterationRuntime = createLearningIterationRuntime({
    store,
    runtimeRequest,
    getSystemIdleSeconds: () => powerMonitor.getSystemIdleTime(),
    getExternalBusy: async () => {
      const [scheduleStatus, clawStatus] = await Promise.all([
        scheduleRuntime?.status(),
        clawRuntime?.status()
      ])
      return Boolean(
        scheduleStatus?.runningTaskIds.length ||
        clawStatus?.runningTaskIds.length
      )
    },
    logError
  })
  learningIterationRuntime.sync(initial)
  configureWeixinBridgeRuntimeContextProvider(async () => {
    const settings = await store.load()
    const channel = settings.claw.channels.find((item) => item.enabled && item.provider === 'weixin')
    return {
      webhookUrl: webhookUrl(settings),
      webhookSecret: settings.claw.im.secret,
      channelId: channel?.id ?? ''
    }
  })
  configureManagedWeixinBridgeUrlResolver(ensureWeixinBridgeRpcUrl)
  syncWeixinBridgeRuntime(initial)

  traceStartup('ipc registration:start')
  const applySettingsPatch = async (partial: AppSettingsPatch): Promise<AppSettingsV1> => {
    const prev = await store.load()
    const { agents: agentsPatch, provider: providerPatch, ...restPatch } = partial

    // Keep the Legalwork runtime API key/base URL in sync with whichever provider
    // profile the runtime is actually configured to use. Settings > General edits the
    // active profile's credentials; the runtime override at agents.legalwork.apiKey
    // should inherit from that profile unless the user explicitly edited the override
    // in Settings > Agents.
    const mergedProvider = mergeModelProviderSettings(prev.provider, providerPatch)
    const agentsPatchWithKey = computeLegalworkRuntimeCredentialPatch(prev, {
      agents: agentsPatch,
      provider: providerPatch
    })

    const next = normalizeAppSettings({
      ...applyLegalworkRuntimePatch(prev, agentsPatchWithKey.legalwork),
      ...restPatch,
      provider: mergedProvider,
      log: { ...prev.log, ...(partial.log ?? {}) },
      notifications: { ...prev.notifications, ...(partial.notifications ?? {}) },
      appBehavior: normalizeAppBehaviorSettings({
        ...prev.appBehavior,
        ...(partial.appBehavior ?? {})
      }),
      keyboardShortcuts: normalizeKeyboardShortcuts({
        bindings: {
          ...prev.keyboardShortcuts.bindings,
          ...(partial.keyboardShortcuts?.bindings ?? {})
        }
      }),
      write: mergeWriteSettings(prev.write, partial.write),
      claw: mergeClawSettings(prev.claw, partial.claw),
      schedule: mergeScheduleSettings(prev.schedule, partial.schedule),
      learningIteration: mergeLearningIterationSettings(
        prev.learningIteration,
        partial.learningIteration
      ),
      guiUpdate: { ...prev.guiUpdate, ...(partial.guiUpdate ?? {}) }
    })
    if (prev.log.enabled !== next.log.enabled || prev.log.retentionDays !== next.log.retentionDays) {
      configureLogger({ enabled: next.log.enabled, retentionDays: next.log.retentionDays })
    }

    // Persist the merged/normalized settings so that computed fields (like the
    // synchronized agent API key above) are actually written to disk. Passing
    // the raw partial would drop anything computed in this function.
    const patchToSave: AppSettingsPatch = {
      ...partial,
      agents: agentsPatchWithKey
    }
    const saved = await store.patch(patchToSave)
    await syncClawScheduleMcpConfig(saved, getClawScheduleMcpLaunchConfig()).catch((error) => {
      console.error('[claw-schedule-mcp] failed to sync config after settings change:', error)
    })
    if (prev.guiUpdate.channel !== saved.guiUpdate.channel && guiUpdaterModulePromise) {
      void guiUpdaterModulePromise.then((module) => module.setGuiUpdateChannel(saved.guiUpdate.channel))
    }
    queueRuntimeSettingsApply(prev, saved)
    scheduleRuntime?.sync(saved)
    clawRuntime?.sync(saved)
    learningIterationRuntime?.sync(saved)
    syncWeixinBridgeRuntime(saved)
    syncLoginItemSettings(saved)
    syncTray(saved)
    return saved
  }

  const fetchModels = async () => {
    const settings = await store.load()
    const key = resolveConfiguredApiKey(settings)
    return fetchUpstreamModelIds(settings, key)
  }

  registerAppIpcHandlers({
    store,
    getMainWindow: () => mainWindow,
    applySettingsPatch,
    runtimeRequest: async (path, method, body) => {
      const settings = await store.load()
      return runtimeRequest(settings, path, { method, body })
    },
    reconnectRuntime: async () => {
      const settings = await store.load()
      await ensureRuntime(settings)
      return settings
    },
    fetchUpstreamModels: fetchModels,
    fetchEndpointModels: fetchModelsForEndpoint,
    getClawRuntime: () => clawRuntime,
    getScheduleRuntime: () => scheduleRuntime,
    getLearningIterationRuntime: () => learningIterationRuntime,
    startFeishuInstallQrcode,
    pollFeishuInstall,
    startWeixinInstallQrcode,
    pollWeixinInstall,
    resolveLegalworkConfigPath: resolveLegalworkMcpJsonPath,
    onLegalworkMcpConfigWritten: async () => {
      const settings = await store.load()
      queueRuntimeMcpConfigApply(settings)
    },
    showTurnCompleteNotification,
    getAppVersion: () => {
      const v = app.getVersion()
      return !app.isPackaged ? `${v}-beta` : v
    },
    readGuiUpdateState,
    loadGuiUpdaterModule,
    resolveLogDirectory,
    logError
  })

  void loadGuiUpdaterModule().catch((error) => {
    console.warn('[legalwork updater] failed to initialize on startup:', error)
  })

  registerRuntimeSseIpc({ ipcMain, store, ensureRuntime, logError })
  traceStartup('ipc registration:done')

  powerMonitor.on('suspend', () => {
    stopAllRuntimeSse()
  })
  powerMonitor.on('resume', () => {
    void store.load()
      .then(async (settings) => {
        await ensureRuntime(settings)
        learningIterationRuntime?.sync(settings)
      })
      .catch((err) => {
        console.warn('[legalwork] runtime resume warmup failed:', err)
      })
  })

  if (hasConfiguredModelAuth(initial) && getLegalworkRuntimeSettings(initial).autoStart) {
    void ensureRuntime(initial).catch((err) => {
      console.warn('[legalwork] startup runtime warmup failed:', err)
    })
  }

  createWindow({ suppressInitialShow: shouldStartHidden(initial) })
  traceStartup('createWindow:returned')

  void pruneOnStartup().catch((err) => {
    console.warn('[legalwork] prune logs:', err)
  })

  if (hasConfiguredModelAuth(initial)) {
    setTimeout(() => {
      void legalworkRuntimeAdapter.resolveExecutable(initial).catch((err) => {
        console.warn('[legalwork] prewarm Legalwork binary:', err)
      })
    }, 1500)
  }

  app.on('second-instance', () => {
    revealMainWindow()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
    else revealMainWindow()
  })
}).catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error('[legalwork] startup failed:', error)
  dialog.showErrorBox(`${APP_PRODUCT_NAME} failed to start`, message)
  app.quit()
})
}

app.on('window-all-closed', () => {
  if (process.platform === 'darwin' && !isQuitting) return
  void stopManagedRuntimes().catch((error) => {
    console.warn('[legalwork] failed to stop Legalwork runtime:', error)
  })
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', (event) => {
  isQuitting = true
  if (isQuittingForGuiUpdate) return
  if (managedRuntimesStoppedForQuit) return
  event.preventDefault()
  if (quitContinuationStarted) return
  quitContinuationStarted = true

  continueAppQuitAfterCleanup({
    cleanup: stopManagedRuntimesForQuit,
    quit: () => {
      managedRuntimesStoppedForQuit = true
      app.quit()
    },
    forceAfterMs: FORCE_QUIT_TIMEOUT_MS,
    onCleanupError: (error) => {
      console.warn('[legalwork] failed to stop managed runtimes before quit:', error)
    }
  })
})
