import { app, BrowserWindow, type BrowserWindowConstructorOptions } from 'electron'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import type { AppSettingsV1 } from '../shared/app-settings'
import { getLegalworkRuntimeSettings } from '../shared/app-settings'
import type {
  CodexAuthActionResult,
  CodexAuthStatus,
  CodexModelSummary,
  CodexQuotaBucket,
  CodexQuotaStatus,
  CodexQuotaWindow
} from '../shared/ds-gui-api'
import { CodexAppServerRpc } from '../../legalwork/src/adapters/model/codex-app-server-rpc.js'
import { detectSystemProxy, type SystemProxy } from './system-proxy'

type JsonObject = Record<string, unknown>
type CredentialSource = 'local' | 'legalwork'

function asObject(value: unknown): JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonObject
    : {}
}

function resolveExecutableCandidate(candidate: string): string | null {
  const trimmed = candidate.trim()
  if (!trimmed) return null
  if (trimmed.includes('/') || trimmed.includes('\\')) {
    return existsSync(trimmed) ? trimmed : null
  }
  const probe = spawnSync(trimmed, ['--version'], {
    encoding: 'utf8',
    timeout: 5_000,
    windowsHide: true
  })
  return probe.status === 0 ? trimmed : null
}

export function resolveCodexBinaryPath(explicitPath = ''): string | null {
  const appRoot = app.isPackaged
    ? app.getAppPath().replace(/app\.asar$/, 'app.asar.unpacked')
    : app.getAppPath()
  const candidates = [
    explicitPath,
    process.env.LEGALWORK_CODEX_BINARY ?? '',
    app.isPackaged && process.platform === 'win32'
      ? join(process.resourcesPath, 'codex-runtime', 'bin', 'codex.exe')
      : '',
    join(appRoot, 'node_modules', '@openai', 'codex', 'bin', 'codex.js'),
    process.platform === 'darwin'
      ? '/Applications/ChatGPT.app/Contents/Resources/codex'
      : '',
    process.platform === 'darwin'
      ? join(process.env.HOME ?? '', 'Applications', 'ChatGPT.app', 'Contents', 'Resources', 'codex')
      : '',
    'codex'
  ]
  for (const candidate of candidates) {
    const resolved = resolveExecutableCandidate(candidate)
    if (resolved) return resolved
  }
  return null
}

export function resolveLegalworkCodexHome(): string {
  return join(app.getPath('userData'), 'codex-auth')
}

function ensureLegalworkCodexHome(): string {
  const codexHome = resolveLegalworkCodexHome()
  mkdirSync(codexHome, { recursive: true })
  try {
    writeFileSync(
      join(codexHome, 'config.toml'),
      'cli_auth_credentials_store = "file"\n',
      { encoding: 'utf8', flag: 'wx', mode: 0o600 }
    )
  } catch (error) {
    const code = error !== null && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : ''
    if (code !== 'EEXIST') throw error
  }
  return codexHome
}

function modelSummaries(value: unknown): CodexModelSummary[] {
  const data = asObject(value).data
  if (!Array.isArray(data)) return []
  return data.flatMap((entry) => {
    const model = asObject(entry)
    const id = typeof model.model === 'string'
      ? model.model
      : typeof model.id === 'string'
        ? model.id
        : ''
    if (!id || model.hidden === true) return []
    return [{
      id,
      displayName: typeof model.displayName === 'string' ? model.displayName : id,
      description: typeof model.description === 'string' ? model.description : '',
      isDefault: model.isDefault === true
    }]
  })
}

function finiteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '' || typeof value === 'boolean') return null
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : null
}

function quotaWindow(value: unknown): CodexQuotaWindow | null {
  const window = asObject(value)
  const usedPercent = finiteNumber(window.usedPercent)
  const windowDurationMins = finiteNumber(window.windowDurationMins)
  if (usedPercent === null || windowDurationMins === null) return null
  return {
    usedPercent: Math.max(0, Math.min(100, usedPercent)),
    windowDurationMins: Math.max(0, windowDurationMins),
    resetsAt: finiteNumber(window.resetsAt)
  }
}

function quotaBucket(value: unknown, fallbackId = ''): CodexQuotaBucket | null {
  const bucket = asObject(value)
  const limitId = typeof bucket.limitId === 'string' ? bucket.limitId : fallbackId
  if (!limitId) return null
  const credits = asObject(bucket.credits)
  const hasCreditShape = Object.keys(credits).length > 0
  return {
    limitId,
    limitName: typeof bucket.limitName === 'string' ? bucket.limitName : null,
    planType: typeof bucket.planType === 'string' ? bucket.planType : null,
    primary: quotaWindow(bucket.primary),
    secondary: quotaWindow(bucket.secondary),
    credits: hasCreditShape
      ? {
          hasCredits: credits.hasCredits === true,
          unlimited: credits.unlimited === true,
          balance: typeof credits.balance === 'string'
            ? credits.balance
            : finiteNumber(credits.balance)?.toString() ?? null
        }
      : null,
    rateLimitReachedType: typeof bucket.rateLimitReachedType === 'string'
      ? bucket.rateLimitReachedType
      : null
  }
}

export function parseCodexQuota(value: unknown): CodexQuotaStatus | null {
  const result = asObject(value)
  const byId = asObject(result.rateLimitsByLimitId)
  const buckets = Object.entries(byId)
    .map(([id, entry]) => quotaBucket(entry, id))
    .filter((entry): entry is CodexQuotaBucket => entry !== null)
  if (buckets.length === 0) {
    const fallback = quotaBucket(result.rateLimits)
    if (fallback) buckets.push(fallback)
  }
  if (buckets.length === 0) return null
  const resetCredits = asObject(result.rateLimitResetCredits)
  return {
    buckets,
    resetCreditsAvailable: Math.max(0, finiteNumber(resetCredits.availableCount) ?? 0)
  }
}

const NETWORK_ERROR_MARKERS = [
  'error sending request',
  'connection refused',
  'connection reset',
  'connection timed out',
  'timed out',
  'dns',
  'tls handshake',
  'ssl',
  'network',
  'temporary failure in name resolution',
  'no such host',
  'unreachable',
  'getaddrinfo',
  'reqwest'
]
const ACCOUNT_ERROR_MARKERS = [
  'invalid_grant',
  'invalid client',
  'unauthorized',
  'forbidden',
  'access denied',
  'token expired',
  'authentication failed',
  'login failed',
  'account locked',
  'rate limit'
]

/**
 * Turn low-level codex login failures into a message an end user can act on.
 * `error sending request` is a reqwest transport error — the token exchange
 * never reached OpenAI (usually no proxy/network path). Account problems come
 * back as OAuth error codes like `invalid_grant`, which we leave untouched.
 */
export function friendlyChatgptErrorMessage(raw: string): string {
  const message = raw.trim()
  const lower = message.toLowerCase()
  const isNetwork = NETWORK_ERROR_MARKERS.some((marker) => lower.includes(marker))
  const isAccount = ACCOUNT_ERROR_MARKERS.some((marker) => lower.includes(marker))
  if (isNetwork && !isAccount) {
    return '无法连接到 OpenAI 服务器，请检查网络或代理设置后重试。'
  }
  return message
}

/**
 * Merge a detected system proxy into the codex process environment, but only
 * for variables the user hasn't already set. Explicitly-provided env (by the
 * user or the runtime) always wins.
 */
export function mergeProxyEnv(
  current: NodeJS.ProcessEnv,
  systemProxy: SystemProxy | null | undefined
): NodeJS.ProcessEnv | undefined {
  if (!systemProxy) return undefined
  const merged: NodeJS.ProcessEnv = {}
  if (!current.HTTPS_PROXY && !current.https_proxy && systemProxy.HTTPS_PROXY) {
    merged.HTTPS_PROXY = systemProxy.HTTPS_PROXY
  }
  if (!current.HTTP_PROXY && !current.http_proxy && systemProxy.HTTP_PROXY) {
    merged.HTTP_PROXY = systemProxy.HTTP_PROXY
  }
  if (!current.NO_PROXY && !current.no_proxy && systemProxy.NO_PROXY) {
    merged.NO_PROXY = systemProxy.NO_PROXY
  }
  return Object.keys(merged).length > 0 ? merged : undefined
}

export class CodexAuthManager {
  private rpc: CodexAppServerRpc | null = null
  private binaryPath = ''
  private credentialSource: CredentialSource | '' = ''
  private loginWindow: BrowserWindow | null = null

  async status(settings: AppSettingsV1, refreshToken = false): Promise<CodexAuthStatus> {
    const runtime = getLegalworkRuntimeSettings(settings)
    const binaryPath = resolveCodexBinaryPath(runtime.codexBinaryPath)
    if (!binaryPath) {
      return {
        available: false,
        loggedIn: false,
        authMode: 'none',
        email: null,
        planType: null,
        credentialSource: 'none',
        binaryPath: '',
        models: [],
        quota: null,
        message: 'Codex executable was not found.'
      }
    }
    let lastError = ''
    for (const source of ['local', 'legalwork'] as const) {
      try {
        const rpc = await this.client(binaryPath, source)
        const result = await rpc.request<JsonObject>('account/read', { refreshToken })
        const account = asObject(result.account)
        if (account.type !== 'chatgpt') continue
        const [models, quota] = await Promise.all([
          rpc.request('model/list', { includeHidden: false, limit: 100 })
            .then(modelSummaries),
          rpc.request('account/rateLimits/read', {})
            .then(parseCodexQuota)
            .catch(() => null)
        ])
        return {
          available: true,
          loggedIn: true,
          authMode: 'chatgpt',
          email: typeof account.email === 'string' ? account.email : null,
          planType: typeof account.planType === 'string' ? account.planType : null,
          credentialSource: source,
          binaryPath,
          models,
          quota
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
      }
    }
    return {
      available: true,
      loggedIn: false,
      authMode: 'none',
      email: null,
      planType: null,
      credentialSource: 'none',
      binaryPath,
      models: [],
      quota: null,
      ...(lastError ? { message: lastError } : {})
    }
  }

  async login(settings: AppSettingsV1, parent: BrowserWindow | null): Promise<CodexAuthActionResult> {
    const runtime = getLegalworkRuntimeSettings(settings)
    const binaryPath = resolveCodexBinaryPath(runtime.codexBinaryPath)
    if (!binaryPath) return { ok: false, message: 'Codex executable was not found.' }
    try {
      const existing = await this.status(settings, false)
      if (existing.loggedIn) return { ok: true, status: existing }
      const rpc = await this.client(binaryPath, 'legalwork')
      const started = await rpc.request<JsonObject>('account/login/start', {
        type: 'chatgpt',
        useHostedLoginSuccessPage: true,
        appBrand: 'codex'
      })
      const loginId = typeof started.loginId === 'string' ? started.loginId : ''
      const authUrl = typeof started.authUrl === 'string' ? started.authUrl : ''
      if (!loginId || !authUrl) throw new Error('Codex did not return a login URL.')
      const result = await this.openLoginWindow(rpc, loginId, authUrl, parent)
      if (!result.ok) {
        return { ok: false, message: friendlyChatgptErrorMessage(result.message) }
      }
      return { ok: true, status: await this.status(settings, true) }
    } catch (error) {
      const raw = error instanceof Error ? error.message : String(error)
      return { ok: false, message: friendlyChatgptErrorMessage(raw) }
    }
  }

  async logout(settings: AppSettingsV1): Promise<CodexAuthActionResult> {
    const runtime = getLegalworkRuntimeSettings(settings)
    const binaryPath = resolveCodexBinaryPath(runtime.codexBinaryPath)
    if (!binaryPath) return { ok: false, message: 'Codex executable was not found.' }
    try {
      const current = await this.status(settings, false)
      if (current.credentialSource === 'local') {
        return { ok: false, message: 'This login is shared from the local Codex/ChatGPT app. Sign out there if you want to remove it.' }
      }
      const rpc = await this.client(binaryPath, 'legalwork')
      await rpc.request('account/logout', {})
      return { ok: true, status: await this.status(settings, false) }
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : String(error) }
    }
  }

  async close(): Promise<void> {
    if (this.loginWindow && !this.loginWindow.isDestroyed()) this.loginWindow.close()
    this.loginWindow = null
    const rpc = this.rpc
    this.rpc = null
    this.binaryPath = ''
    this.credentialSource = ''
    await rpc?.stop()
  }

  private async client(binaryPath: string, source: CredentialSource): Promise<CodexAppServerRpc> {
    if (this.rpc && this.binaryPath === binaryPath && this.credentialSource === source) {
      await this.rpc.start()
      return this.rpc
    }
    await this.close()
    const env = this.buildCodexEnv(source)
    const rpc = new CodexAppServerRpc({
      binaryPath,
      ...(env ? { env } : {}),
      requestTimeoutMs: 60_000
    })
    await rpc.start()
    this.rpc = rpc
    this.binaryPath = binaryPath
    this.credentialSource = source
    return rpc
  }

  /**
   * Mirror the system proxy into the codex process environment. The login
   * window (Chromium) honours the system proxy, but codex only reads env vars —
   * on a proxy-based VPN the browser login succeeds and the token exchange
   * fails with `error sending request`. Explicitly-set process env wins, so we
   * never override a proxy the user (or the runtime) already provided.
   */
  private buildCodexEnv(source: CredentialSource): NodeJS.ProcessEnv | undefined {
    const env: NodeJS.ProcessEnv = {
      ...(source === 'legalwork' ? { CODEX_HOME: ensureLegalworkCodexHome() } : {})
    }
    const systemProxy = detectSystemProxy()
    const merged = mergeProxyEnv(process.env, systemProxy)
    if (merged) Object.assign(env, merged)
    return Object.keys(env).length > 0 ? env : undefined
  }

  private openLoginWindow(
    rpc: CodexAppServerRpc,
    loginId: string,
    authUrl: string,
    parent: BrowserWindow | null
  ): Promise<{ ok: true } | { ok: false; message: string }> {
    return new Promise((resolve) => {
      if (this.loginWindow && !this.loginWindow.isDestroyed()) {
        this.loginWindow.focus()
        resolve({ ok: false, message: 'ChatGPT login is already in progress.' })
        return
      }
      const windowOptions: BrowserWindowConstructorOptions = {
        width: 560,
        height: 760,
        minWidth: 440,
        minHeight: 600,
        show: false,
        autoHideMenuBar: true,
        title: '登录 ChatGPT',
        backgroundColor: '#ffffff',
        ...(parent ? { parent, modal: true } : {}),
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: true,
          webviewTag: false,
          partition: 'persist:legalwork-chatgpt-auth'
        }
      }
      const loginWindow = new BrowserWindow(windowOptions)
      this.loginWindow = loginWindow
      loginWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (/^https?:\/\//i.test(url)) void loginWindow.loadURL(url)
        return { action: 'deny' }
      })
      loginWindow.webContents.on('will-attach-webview', (event) => event.preventDefault())
      loginWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
        callback(false)
      })
      loginWindow.once('ready-to-show', () => loginWindow.show())

      let settled = false
      const finish = (
        result: { ok: true } | { ok: false; message: string },
        options: { cancelLogin?: boolean; closeWindow?: boolean } = {}
      ): void => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        unsubscribe()
        if (options.cancelLogin) {
          void rpc.request('account/login/cancel', { loginId }).catch(() => undefined)
        }
        if (options.closeWindow && !loginWindow.isDestroyed()) loginWindow.close()
        if (this.loginWindow === loginWindow) this.loginWindow = null
        resolve(result)
      }
      const timer = setTimeout(() => {
        finish(
          { ok: false, message: 'ChatGPT login timed out.' },
          { cancelLogin: true, closeWindow: true }
        )
      }, 5 * 60_000)
      const unsubscribe = rpc.onNotification((method, params) => {
        if (method !== 'account/login/completed' || params.loginId !== loginId) return
        if (params.success === true) {
          finish({ ok: true }, { closeWindow: true })
        } else {
          finish({
            ok: false,
            message: typeof params.error === 'string' ? params.error : 'ChatGPT login failed.'
          }, { closeWindow: true })
        }
      })
      loginWindow.once('closed', () => {
        finish({ ok: false, message: 'ChatGPT login was cancelled.' }, { cancelLogin: true })
      })
      void loginWindow.loadURL(authUrl).catch((error) => {
        finish(
          { ok: false, message: error instanceof Error ? error.message : String(error) },
          { cancelLogin: true, closeWindow: true }
        )
      })
    })
  }
}
