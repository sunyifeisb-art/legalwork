/**
 * IMA 知识库 MCP 认证管理器
 *
 * 1. 弹出 IMA 登录窗口 → 用户扫码登录
 * 2. 自动捕获 Cookie（x-ima-cookie, x-ima-bkn）
 * 3. 加密存储
 * 4. 提供获取/清除 Cookie 的接口
 */

import { BrowserWindow, session, type Session } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { app } from 'electron'
import { createHash, randomBytes } from 'node:crypto'
import { installNonLatin1ResponseHeaderGuard } from './non-latin1-headers'

const IMA_AUTH_FILE = 'ima-auth.json'
const IMA_CREDS_FILE = 'ima-creds.json'   // MCP Server 读取的明文凭证
const KEY_DERIVATION = 'legalwork:ima-auth:v1'
const IMA_SESSION_PARTITION = 'persist:ima-persistent'
const IMA_LOGIN_URL = 'https://ima.qq.com/wikis'
const IMA_WIKIS_URL = 'https://ima.qq.com/wikis'
const IMA_REFRESH_URL = 'https://ima.qq.com/cgi-bin/auth_login/refresh'

export type ImaKnowledgeBase = {
  id: string
  name?: string
}

export type ImaVerificationStatus = 'valid' | 'expired' | 'unverified' | 'network_error'

export type ImaAuthState = {
  cookie: string
  bkn: string
  capturedAt: string
  verificationStatus?: ImaVerificationStatus
  lastVerifiedAt?: string
  verificationMessage?: string
  knowledgeBases?: ImaKnowledgeBase[]
  defaultKnowledgeBaseId?: string
  // 可选的 OpenAPI 凭证
  clientId?: string
  apiKey?: string
}

export type ImaAuthStatus =
  | { kind: 'logged_in'; auth: ImaAuthState; status: ImaVerificationStatus }
  | { kind: 'expired'; auth: ImaAuthState; status: 'expired'; message?: string }
  | { kind: 'not_configured' }
  | { kind: 'capturing' }

export type ImaAuthCheckResult =
  | { status: 'valid'; auth: ImaAuthState; changed: boolean }
  | { status: 'expired'; auth: ImaAuthState; message: string }
  | { status: 'network_error'; auth: ImaAuthState; message: string }
  | { status: 'not_configured'; message: string }

type EncryptedAuth = {
  salt: string
  data: string
}

function authStorePath(): string {
  return join(app.getPath('userData'), IMA_AUTH_FILE)
}

export function credsFilePath(): string {
  return join(app.getPath('userData'), IMA_CREDS_FILE)
}

/**
 * 写明文凭证文件供 MCP Server（Python 子进程）读取。
 * 每次调用重新写，确保 MCP Server 能读到最新凭证。
 */
function saveImaCredsFile(auth: ImaAuthState): void {
  const creds = {
    cookie: auth.cookie,
    bkn: auth.bkn,
    client_id: auth.clientId || '',
    api_key: auth.apiKey || '',
    knowledge_bases: auth.knowledgeBases || [],
    default_knowledge_base_id: auth.defaultKnowledgeBaseId || '',
    verification_status: auth.verificationStatus || 'unverified',
    last_verified_at: auth.lastVerifiedAt || '',
  }
  writeFileSync(credsFilePath(), JSON.stringify(creds, null, 2), { encoding: 'utf8', mode: 0o600 })
}

function removeImaCredsFile(): void {
  try {
    const path = credsFilePath()
    if (existsSync(path)) { writeFileSync(path, '', { encoding: 'utf8' }) }
  } catch { /* ignore */ }
}

function encryptAuth(auth: ImaAuthState): EncryptedAuth {
  const salt = randomBytes(24)
  const key = createHash('sha256').update(KEY_DERIVATION).update(salt).digest()
  const plain = Buffer.from(JSON.stringify(auth), 'utf8')
  const encrypted = Buffer.allocUnsafe(plain.length)
  for (let i = 0; i < plain.length; i += 1) {
    encrypted[i] = plain[i] ^ key[i % key.length]
  }
  return { salt: salt.toString('base64'), data: encrypted.toString('base64') }
}

function decryptAuth(payload: EncryptedAuth): ImaAuthState | null {
  try {
    const salt = Buffer.from(payload.salt, 'base64')
    const encrypted = Buffer.from(payload.data, 'base64')
    const key = createHash('sha256').update(KEY_DERIVATION).update(salt).digest()
    const decoded = Buffer.allocUnsafe(encrypted.length)
    for (let i = 0; i < encrypted.length; i += 1) {
      decoded[i] = encrypted[i] ^ key[i % key.length]
    }
    return JSON.parse(decoded.toString('utf8')) as ImaAuthState
  } catch {
    return null
  }
}

export function saveImaAuth(auth: ImaAuthState): void {
  const encrypted = encryptAuth(auth)
  writeFileSync(authStorePath(), JSON.stringify(encrypted), { encoding: 'utf8', mode: 0o600 })
  saveImaCredsFile(auth)
}

export function loadImaAuth(): ImaAuthState | null {
  try {
    if (!existsSync(authStorePath())) return null
    const raw = JSON.parse(readFileSync(authStorePath(), 'utf8')) as EncryptedAuth
    return decryptAuth(raw)
  } catch {
    return null
  }
}

export function clearImaAuth(): void {
  try {
    const path = authStorePath()
    if (existsSync(path)) {
      writeFileSync(path, '', { encoding: 'utf8' })
    }
    removeImaCredsFile()
  } catch {
    // ignore
  }
}

/**
 * IMA 网关会用中文回错误响应头（trpc-error-msg: 登录失败，请重新登录），而
 * Electron 的网络层碰到非 Latin-1 响应头会抛异常并打崩应用。取 session 时统一
 * 加护栏，让"登录过期"退化成一次普通的失败响应，由调用方按 code/msg 处理。
 */
function openImaSession(): Session {
  const target = session.fromPartition(IMA_SESSION_PARTITION, { cache: true })
  installNonLatin1ResponseHeaderGuard(target, ['https://ima.qq.com/*'])
  return target
}

export async function clearImaLoginSession(): Promise<void> {
  const imaSession = openImaSession()
  await Promise.allSettled([
    imaSession.clearStorageData({ storages: ['cookies', 'localstorage'] }),
    imaSession.clearCache()
  ])
}

function readHeaderCaseInsensitive(
  headers: Record<string, string | string[]>,
  name: string
): string {
  const target = name.toLowerCase()
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== target) continue
    return Array.isArray(value) ? (value[0] || '') : value
  }
  return ''
}

function parseImaCookie(cookie: string): Map<string, string> {
  const result = new Map<string, string>()
  for (const part of cookie.split(';')) {
    const separator = part.indexOf('=')
    if (separator <= 0) continue
    result.set(part.slice(0, separator).trim().toUpperCase(), part.slice(separator + 1).trim())
  }
  return result
}

function replaceImaCookieValue(cookie: string, key: string, value: string): string {
  const pattern = new RegExp(`(^|;\\s*)${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=[^;]*`, 'i')
  if (pattern.test(cookie)) {
    return cookie.replace(pattern, (match, prefix: string) => `${prefix}${key}=${value}`)
  }
  return `${cookie.trim().replace(/;$/, '')}; ${key}=${value}`
}

function looksLikeKnowledgeBaseId(value: unknown): value is string | number {
  if (typeof value !== 'string' && typeof value !== 'number') return false
  const normalized = String(value).trim()
  return /^[a-zA-Z0-9_-]{8,80}$/.test(normalized)
}

/**
 * 从 IMA 知识库页面自己的 JSON 响应中提取知识库快照。
 * 只保存 ID/名称，不持久化响应正文或文件内容。
 */
export function extractImaKnowledgeBases(value: unknown): ImaKnowledgeBase[] {
  const found = new Map<string, ImaKnowledgeBase>()
  const idKeys = ['knowledge_base_id', 'knowledgeBaseId', 'kb_id', 'kbId']
  const nameKeys = ['knowledge_base_name', 'knowledgeBaseName', 'kb_name', 'kbName', 'name', 'title']

  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }
    if (!node || typeof node !== 'object') return
    const record = node as Record<string, unknown>
    const rawId = idKeys.map((key) => record[key]).find(looksLikeKnowledgeBaseId)
    if (rawId !== undefined) {
      const id = String(rawId).trim()
      const rawName = nameKeys.map((key) => record[key]).find((entry) => typeof entry === 'string' && entry.trim())
      const name = typeof rawName === 'string' ? rawName.trim().slice(0, 200) : undefined
      const existing = found.get(id)
      found.set(id, { id, name: name || existing?.name })
    }
    Object.values(record).forEach(visit)
  }
  visit(value)
  return [...found.values()]
}

function mergeKnowledgeBases(
  current: ImaKnowledgeBase[],
  incoming: ImaKnowledgeBase[]
): ImaKnowledgeBase[] {
  const merged = new Map(current.map((kb) => [kb.id, kb]))
  for (const kb of incoming) {
    const previous = merged.get(kb.id)
    merged.set(kb.id, { id: kb.id, name: kb.name || previous?.name })
  }
  return [...merged.values()]
}

function imaRequestHeaders(auth: ImaAuthState): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': IMA_WIKIS_URL,
    'x-ima-cookie': auth.cookie,
    'x-ima-bkn': auth.bkn,
    'extension_version': '999.999.999',
    'from_browser_ima': '1',
  }
}

export async function verifyImaAuth(
  auth: ImaAuthState,
  imaSession: Pick<Session, 'fetch'>
): Promise<ImaAuthCheckResult> {
  const cookieParts = parseImaCookie(auth.cookie)
  const userId = cookieParts.get('IMA-UID')
  const refreshToken = cookieParts.get('IMA-REFRESH-TOKEN') || cookieParts.get('IMA-TOKEN')
  if (!userId || !refreshToken || !auth.bkn) {
    return {
      status: 'expired',
      auth: {
        ...auth,
        verificationStatus: 'expired',
        lastVerifiedAt: new Date().toISOString(),
        verificationMessage: '捕获到的 IMA 凭据不完整'
      },
      message: '捕获到的 IMA 凭据不完整（缺少 IMA-UID、IMA-REFRESH-TOKEN 或 x-ima-bkn）'
    }
  }

  const checkedAt = new Date().toISOString()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15_000)
  try {
    const response = await imaSession.fetch(IMA_REFRESH_URL, {
      method: 'POST',
      headers: imaRequestHeaders(auth),
      body: JSON.stringify({ user_id: userId, refresh_token: decodeURIComponent(refreshToken), token_type: 14 }),
      signal: controller.signal
    })
    const raw = await response.text()
    let payload: Record<string, unknown> = {}
    try {
      payload = raw ? JSON.parse(raw) as Record<string, unknown> : {}
    } catch {
      payload = {}
    }
    if (!response.ok || payload.code !== 0 || typeof payload.token !== 'string' || !payload.token) {
      const message = typeof payload.msg === 'string' && payload.msg
        ? payload.msg
        : `IMA 认证验证失败（HTTP ${response.status}）`
      const explicitAuthFailure = response.status === 401
        || response.status === 403
        || (typeof payload.code === 'number' && payload.code !== 0)
      return {
        status: explicitAuthFailure ? 'expired' : 'network_error',
        auth: {
          ...auth,
          verificationStatus: explicitAuthFailure ? 'expired' : 'network_error',
          lastVerifiedAt: checkedAt,
          verificationMessage: message
        },
        message
      }
    }

    const nextCookie = replaceImaCookieValue(auth.cookie, 'IMA-TOKEN', payload.token)
    const verified: ImaAuthState = {
      ...auth,
      cookie: nextCookie,
      verificationStatus: 'valid',
      lastVerifiedAt: checkedAt,
      verificationMessage: undefined
    }
    return { status: 'valid', auth: verified, changed: nextCookie !== auth.cookie }
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? 'IMA 认证验证超时'
      : `IMA 认证验证网络错误：${error instanceof Error ? error.message : String(error)}`
    return {
      status: 'network_error',
      auth: {
        ...auth,
        verificationStatus: 'network_error',
        lastVerifiedAt: checkedAt,
        verificationMessage: message
      },
      message
    }
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * 打开 IMA 登录窗口，用户扫码登录后自动捕获 Cookie。
 * 返回捕获到的认证信息。
 */
export async function captureImaAuthViaLogin(): Promise<ImaAuthState> {
  return new Promise((resolve, reject) => {
    const loginWin = new BrowserWindow({
      width: 520,
      height: 740,
      title: '登录 IMA 知识库',
      resizable: false,
      webPreferences: {
        partition: IMA_SESSION_PARTITION
      }
    })

    let captureDone = false
    let verificationInProgress = false
    let capturedXCookie = ''
    let capturedBkn = ''
    let capturedKnowledgeBases: ImaKnowledgeBase[] = []
    let defaultKnowledgeBaseId = ''
    let lastVerificationMessage = ''

    /** 尝试用当前已捕获的凭证验证并完成登录 */
    async function tryFinish(): Promise<void> {
      if (captureDone || verificationInProgress || !capturedXCookie || !capturedBkn) return
      verificationInProgress = true
      if (!loginWin.isDestroyed()) loginWin.setTitle('正在验证 IMA 登录…')

      const auth: ImaAuthState = {
        cookie: capturedXCookie,
        bkn: capturedBkn,
        capturedAt: new Date().toISOString(),
        verificationStatus: 'unverified',
        knowledgeBases: capturedKnowledgeBases,
        defaultKnowledgeBaseId: defaultKnowledgeBaseId || undefined
      }
      // 尝试读取 OpenAPI 凭证
      try {
        const configPath = join(app.getPath('userData'), 'config.json')
        if (existsSync(configPath)) {
          const config = JSON.parse(readFileSync(configPath, 'utf8'))
          const anysearchKey = config?.capabilities?.web?.anysearchApiKey
          if (anysearchKey) {
            const parts = anysearchKey.split('|')
            if (parts.length === 2) {
              auth.clientId = parts[0].trim()
              auth.apiKey = parts[1].trim()
            }
          }
        }
      } catch { /* ignore */ }

      const result = await verifyImaAuth(auth, loginWin.webContents.session)
      if (result.status === 'valid') {
        captureDone = true
        // 给 /wikis 列表请求一个很短的收尾窗口，以便把共享库也纳入快照。
        await new Promise((finish) => setTimeout(finish, 800))
        result.auth.knowledgeBases = mergeKnowledgeBases(
          result.auth.knowledgeBases || [],
          capturedKnowledgeBases
        )
        result.auth.defaultKnowledgeBaseId ||= defaultKnowledgeBaseId || undefined
        saveImaAuth(result.auth)
        if (!loginWin.isDestroyed()) loginWin.setTitle('IMA 登录成功')
        if (!loginWin.isDestroyed()) loginWin.close()
        resolve(result.auth)
        return
      }
      lastVerificationMessage = result.message
      verificationInProgress = false
      if (!loginWin.isDestroyed()) loginWin.setTitle('凭据未就绪，请停留在知识库页面')
    }

    // 只接受 /wikis 前端真实 API 请求注入的自定义认证头；普通 Cookie 并不等价。
    const filter = { urls: ['https://ima.qq.com/cgi-bin/*', 'https://ima.qq.com/openapi/*'] }
    const imaWebRequest = loginWin.webContents.session.webRequest
    imaWebRequest.onBeforeSendHeaders(filter, (details, callback) => {
      const h = details.requestHeaders
      const xCookie = readHeaderCaseInsensitive(h, 'x-ima-cookie')
      const bkn = readHeaderCaseInsensitive(h, 'x-ima-bkn')
      if (xCookie) capturedXCookie = xCookie
      if (bkn) capturedBkn = bkn
      callback(details)
      setTimeout(() => void tryFinish(), 800)
    })

    // init_session 请求体包含当前选中的知识库 ID，可作为默认库。
    imaWebRequest.onBeforeRequest(filter, (details, callback) => {
      try {
        const body = details.uploadData
          ?.map((part) => part.bytes?.toString('utf8') || '')
          .join('') || ''
        if (body) {
          const payload = JSON.parse(body) as unknown
          const discovered = extractImaKnowledgeBases(payload)
          capturedKnowledgeBases = mergeKnowledgeBases(capturedKnowledgeBases, discovered)
          if (details.url.includes('/init_session') && discovered[0]?.id) {
            defaultKnowledgeBaseId = discovered[0].id
          }
        }
      } catch { /* ignore */ }
      callback({})
    })

    // 被动读取 /wikis 自身的 JSON 响应，仅提取知识库 ID/名称，补全“加入的”共享库。
    const jsonResponseIds = new Set<string>()
    const debugHandler = (_event: Electron.Event, method: string, params: Record<string, unknown>): void => {
      const requestId = typeof params.requestId === 'string' ? params.requestId : ''
      if (!requestId) return
      if (method === 'Network.responseReceived') {
        const response = params.response as { url?: string; mimeType?: string } | undefined
        if (response?.url?.startsWith('https://ima.qq.com/') && response.mimeType?.includes('json')) {
          jsonResponseIds.add(requestId)
        }
        return
      }
      if (method !== 'Network.loadingFinished' || !jsonResponseIds.delete(requestId)) return
      void loginWin.webContents.debugger.sendCommand('Network.getResponseBody', { requestId })
        .then((result: { body?: string; base64Encoded?: boolean }) => {
          if (!result.body) return
          const text = result.base64Encoded
            ? Buffer.from(result.body, 'base64').toString('utf8')
            : result.body
          if (text.length > 5_000_000) return
          const discovered = extractImaKnowledgeBases(JSON.parse(text) as unknown)
          capturedKnowledgeBases = mergeKnowledgeBases(capturedKnowledgeBases, discovered)
        })
        .catch(() => undefined)
    }
    try {
      loginWin.webContents.debugger.attach('1.3')
      void loginWin.webContents.debugger.sendCommand('Network.enable')
      loginWin.webContents.debugger.on('message', debugHandler)
    } catch { /* DevTools protocol unavailable; default KB can still come from init_session */ }

    loginWin.webContents.on('did-finish-load', () => {
      if (loginWin.webContents.getURL().startsWith(IMA_WIKIS_URL)) {
        setTimeout(() => void tryFinish(), 1200)
      }
    })

    const pollTimer = setInterval(() => void tryFinish(), 2000)
    const killTimer = setTimeout(() => {
      clearInterval(pollTimer)
      if (!loginWin.isDestroyed()) loginWin.close()
      if (!captureDone) {
        reject(new Error(lastVerificationMessage || '登录超时：未捕获到 /wikis 页面发出的完整 IMA 凭据'))
      }
    }, 300_000)

    loginWin.on('closed', () => {
      clearInterval(pollTimer)
      clearTimeout(killTimer)
      imaWebRequest.onBeforeSendHeaders(filter, null)
      imaWebRequest.onBeforeRequest(filter, null)
      try {
        loginWin.webContents.debugger.off('message', debugHandler)
        if (loginWin.webContents.debugger.isAttached()) loginWin.webContents.debugger.detach()
      } catch { /* ignore */ }
      if (!captureDone) {
        reject(new Error(lastVerificationMessage || '登录取消'))
      }
    })

    loginWin.loadURL(IMA_LOGIN_URL, {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }).catch(() => { reject(new Error('无法加载 IMA 页面')) })
  })
}

/**
 * 静默刷新并验证 IMA 凭据。
 * 使用认证专用 refresh 接口，不再以“空知识库问 ping”的 Q&A 结果判断登录状态。
 */
export async function refreshImaAuth(): Promise<ImaAuthCheckResult> {
  const existing = loadImaAuth()
  if (!existing?.cookie || !existing?.bkn) {
    return { status: 'not_configured', message: 'IMA 未登录' }
  }
  const imaSession = openImaSession()
  const result = await verifyImaAuth(existing, imaSession)
  if ('auth' in result) saveImaAuth(result.auth)
  return result
}

/**
 * 清除持久会话后重新扫码登录。只有新认证成功时才覆盖旧凭证；
 * 用户取消或登录失败时恢复原凭证，避免破坏现有连接。
 */
export async function replaceImaAuthViaLogin(): Promise<ImaAuthState> {
  const previousAuth = loadImaAuth()
  await clearImaLoginSession()
  try {
    const auth = await captureImaAuthViaLogin()
    return auth
  } catch (error) {
    // 登录失败时恢复旧凭证
    if (previousAuth?.cookie && previousAuth?.bkn) saveImaAuth(previousAuth)
    throw error
  }
}
