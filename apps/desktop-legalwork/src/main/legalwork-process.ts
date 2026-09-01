import { app } from 'electron'
import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { homedir } from 'node:os'
import { delimiter, dirname, join } from 'node:path'
import {
  defaultLegalworkTokenEconomySettings,
  isLegalworkRuntimeInsecure,
  resolveLegalworkRuntimeSettings,
  type LegalworkRuntimeSettingsV1,
  type AppSettingsV1
} from '../shared/app-settings'
import {
  buildLegalworkServeArgs,
  resolveLegalworkExecutable
} from './resolve-legalwork-binary'
import {
  LegalworkConfigSchema,
  LegalworkServeConfigSchema,
  ModelConfigSchema,
  ContextCompactionConfigSchema,
  RuntimeTuningConfigSchema
} from '../../legalwork/src/config/legalwork-config.js'
import {
  AttachmentsCapabilityConfig,
  McpCapabilityConfig,
  McpServerConfig,
  MemoryCapabilityConfig,
  SkillsCapabilityConfig,
  SubagentsCapabilityConfig,
  WebCapabilityConfig
} from '../../legalwork/src/contracts/capabilities.js'
import {
  buildClawScheduleMcpArgs,
  LEGALWORK_SCHEDULE_MCP_SERVER_NAME,
  resolveClawScheduleMcpCommand,
  resolveLegalworkMcpJsonPath,
  type ClawScheduleMcpLaunchConfig
} from './claw-schedule-mcp-config'
import { rewriteNpxFilesystemMcpServer } from './filesystem-mcp-config'
import { defaultLegalworkDataDir } from './runtime/legalwork-adapter'
import { getLegalworkBaseUrl } from './legalwork-base-url'
import { DEFAULT_PKULAW_MCP_SERVERS } from './pkulaw-default-servers'
import { isLegalworkHealthResponseBody } from './legalwork-health'
import { appendManagedLogLine } from './logger'
import { guiSkillRootsForRuntime, normalizeSkillRootPath } from './services/skill-service'
import { buildOcrRuntimeEnvironment } from './data-compliance-runtime'
import { mergeProxyEnv, resolveCodexBinaryPath } from './codex-auth-manager'
import { detectSystemProxy, type SystemProxy } from './system-proxy'
import { reportError } from './error-report'

let child: ChildProcess | null = null
let childLogCapture: LegalworkChildLogCapture | null = null
let childStartupPromise: Promise<void> | null = null
// 假死看护：runtime 进程可能因事件循环阻塞而存活但不响应 HTTP（SSE 断连
// 60 次重连耗尽、runtime-ensure fetch_failed 风暴同源）。周期探测 /health，
// 连续失败即 kill 假死进程，让下一次 ensureRuntime 在原端口正常重启。
let childWatchdog: { timer: NodeJS.Timeout; port: number; failures: number } | null = null
let lastResolvedBinary: string | null = null
const LEGALWORK_READY_PREFIX = 'LEGALWORK_READY '
const LEGALWORK_STARTUP_TIMEOUT_MS = 12_000
const LEGALWORK_STARTUP_HEALTH_POLL_MS = 500
const LEGALWORK_STARTUP_HEALTH_REQUEST_TIMEOUT_MS = 1_000
const LEGALWORK_STOP_GRACE_MS = 800
const LEGALWORK_STOP_FORCE_MS = 400
const STDERR_TAIL_MAX_CHARS = 4_000
const LEGALWORK_SCHEDULE_MCP_TIMEOUT_MS = 5_000
const LEGALWORK_OFFICECLI_MCP_TIMEOUT_MS = 30_000
const LEGALWORK_OFFICECLI_MCP_SERVER_NAME = 'officecli'
const LEGALWORK_IMA_MCP_SERVER_NAME = 'ima-knowledge-base'
const GUI_ATTACHMENT_ALLOWED_MIME_TYPES = [
  'image/*',
  'text/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/json',
  'application/zip'
]
const DEFAULT_LEGALWORK_MODEL_PROFILES: Record<string, Record<string, unknown>> = {
  'deepseek-v4-pro': {
    contextWindowTokens: 1_000_000,
    contextCompaction: {
      softThreshold: 900_000,
      hardThreshold: 950_000
    },
    inputModalities: ['text'],
    outputModalities: ['text'],
    supportsToolCalling: true,
    messageParts: ['text']
  },
  'deepseek-v4-flash': {
    aliases: ['deepseek-chat', 'deepseek-reasoner'],
    contextWindowTokens: 1_000_000,
    contextCompaction: {
      softThreshold: 900_000,
      hardThreshold: 950_000
    },
    inputModalities: ['text'],
    outputModalities: ['text'],
    supportsToolCalling: true,
    messageParts: ['text']
  },
  'kimi-for-coding': {
    contextWindowTokens: 262_144,
    contextCompaction: {
      softThreshold: 245_760,
      hardThreshold: 258_048
    },
    inputModalities: ['text', 'image'],
    outputModalities: ['text'],
    supportsToolCalling: true,
    messageParts: ['text', 'image_url'],
    reasoning: {
      supportedEfforts: ['off', 'low', 'medium', 'high'],
      defaultEffort: 'medium',
      requestProtocol: 'openai-chat-completions'
    }
  }
}

type LegalworkLogStream = 'stdout' | 'stderr' | 'lifecycle'
type LegalworkChildLogCapture = {
  captureStdout: (chunk: Buffer | string) => void
  captureStderr: (chunk: Buffer | string) => void
  logLifecycle: (message: string) => void
  close: () => Promise<void>
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function appendTail(current: string, nextChunk: string, maxChars = STDERR_TAIL_MAX_CHARS): string {
  const combined = `${current}${nextChunk}`
  return combined.length > maxChars ? combined.slice(-maxChars) : combined
}

function formatLegalworkLogLine(
  stream: LegalworkLogStream,
  pid: number | undefined,
  message: string
): string {
  const stamp = new Date().toISOString()
  const pidLabel = typeof pid === 'number' ? `legalwork pid=${pid}` : 'legalwork'
  return `[${stamp}] [${stream.toUpperCase()}] [${pidLabel}] ${message}\n`
}

function normalizeCapturedChunk(chunk: Buffer | string): string {
  return String(chunk).replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function createLegalworkChildLogCapture(pid: number | undefined): LegalworkChildLogCapture {
  let stdoutRemainder = ''
  let stderrRemainder = ''
  let closed = false
  let pending = Promise.resolve()

  const writeLine = (stream: LegalworkLogStream, message: string): void => {
    pending = pending
      .then(() => appendManagedLogLine('legalwork', formatLegalworkLogLine(stream, pid, message)))
      .catch(() => undefined)
  }

  const captureChunk = (
    stream: 'stdout' | 'stderr',
    chunk: Buffer | string
  ): void => {
    if (closed) return
    const text = normalizeCapturedChunk(chunk)
    const buffered = `${stream === 'stdout' ? stdoutRemainder : stderrRemainder}${text}`
    const parts = buffered.split('\n')
    const remainder = parts.pop() ?? ''
    if (stream === 'stdout') {
      stdoutRemainder = remainder
    } else {
      stderrRemainder = remainder
    }
    for (const part of parts) {
      if (stream === 'stdout') {
        handleToolErrorLine(part)
      }
      writeLine(stream, part)
    }
  }

  /**
   * 识别 runtime 通过 stdout 上报的信号行（工具错误 / 低效 turn），
   * 转发到错误上报链路（→ GitHub issue）。只含结构化字段，无对话内容。
   */
  function handleToolErrorLine(line: string): void {
    const TOOL_ERROR_PREFIX = 'LEGALWORK_TOOL_ERROR '
    const INEFFICIENT_PREFIX = 'LEGALWORK_INEFFICIENT_TURN '
    try {
      if (line.startsWith(TOOL_ERROR_PREFIX)) {
        const parsed = JSON.parse(line.slice(TOOL_ERROR_PREFIX.length)) as {
          toolName?: string
          error?: string
        }
        if (parsed && typeof parsed.toolName === 'string') {
          const message = `[${parsed.toolName}] ${parsed.error ?? 'unknown tool error'}`
          reportError({ category: 'agent-tool-error', message })
        }
        return
      }
      if (line.startsWith(INEFFICIENT_PREFIX)) {
        const parsed = JSON.parse(line.slice(INEFFICIENT_PREFIX.length)) as {
          steps?: number
          toolCalls?: number
        }
        if (parsed && typeof parsed.steps === 'number') {
          const message = `agent ran ${parsed.steps} steps without completing (toolCalls=${parsed.toolCalls ?? 0})`
          reportError({ category: 'agent-inefficient-turn', message })
        }
      }
    } catch {
      // 解析失败忽略，行仍写入日志
    }
  }

  return {
    captureStdout(chunk) {
      captureChunk('stdout', chunk)
    },
    captureStderr(chunk) {
      captureChunk('stderr', chunk)
    },
    logLifecycle(message) {
      if (closed) return
      writeLine('lifecycle', message)
    },
    async close() {
      if (closed) {
        await pending
        return
      }
      closed = true
      if (stdoutRemainder) {
        writeLine('stdout', stdoutRemainder)
        stdoutRemainder = ''
      }
      if (stderrRemainder) {
        writeLine('stderr', stderrRemainder)
        stderrRemainder = ''
      }
      await pending
    }
  }
}

function appRoot(): string {
  return app.isPackaged
    ? app.getAppPath().replace(/app\.asar$/, 'app.asar.unpacked')
    : app.getAppPath()
}

export function resolveLegalworkDataDir(runtime: { dataDir: string }): string {
  const trimmed = runtime.dataDir?.trim()
  if (trimmed) return expandHomePath(trimmed)
  return defaultLegalworkDataDir()
}

function expandHomePath(path: string): string {
  if (path === '~') return homedir()
  if (path.startsWith('~/') || path.startsWith('~\\')) {
    return join(homedir(), path.slice(2).replace(/\\/g, '/'))
  }
  return path
}

export function resolveCodexRuntimeProxyEnv(
  authMode: 'api_key' | 'chatgpt',
  current: NodeJS.ProcessEnv,
  systemProxy: SystemProxy | null | undefined
): NodeJS.ProcessEnv | undefined {
  return authMode === 'chatgpt' ? mergeProxyEnv(current, systemProxy) : undefined
}

export function isLegalworkChildRunning(): boolean {
  return child !== null && child.exitCode === null && child.signalCode === null
}

const CHILD_WATCHDOG_INTERVAL_MS = 15_000
const CHILD_WATCHDOG_MAX_FAILURES = 3
const CHILD_WATCHDOG_HEALTH_TIMEOUT_MS = 4_000

/**
 * Pure state transition for the hang watchdog. Returns the next failure count
 * and whether to kill the hung runtime on this tick. Healthy probes reset the
 * count; only `maxFailures` consecutive unresponsive probes trigger a kill.
 */
export function childWatchdogTick(
  healthy: boolean,
  failures: number,
  maxFailures = CHILD_WATCHDOG_MAX_FAILURES
): { failures: number; kill: boolean } {
  if (healthy) return { failures: 0, kill: false }
  const next = failures + 1
  return { failures: next, kill: next >= maxFailures }
}

function stopChildWatchdog(): void {
  if (!childWatchdog) return
  clearInterval(childWatchdog.timer)
  childWatchdog = null
}

function startChildWatchdog(port: number): void {
  stopChildWatchdog()
  if (port <= 0) return
  let failures = 0
  const timer = setInterval(() => {
    void (async () => {
      if (!isLegalworkChildRunning()) {
        // 进程已退出：等待现有重启链路处理，无需看护动作。
        failures = 0
        return
      }
      let healthy = false
      try {
        const res = await fetch(`${getLegalworkBaseUrl(port)}/health`, {
          signal: AbortSignal.timeout(CHILD_WATCHDOG_HEALTH_TIMEOUT_MS)
        })
        healthy = res.ok && isLegalworkHealthResponseBody(await res.text())
      } catch {
        healthy = false
      }
      const decision = childWatchdogTick(healthy, failures)
      failures = decision.failures
      if (!decision.kill) return
      failures = 0
      const victim = child
      const victimPid = victim?.pid
      if (!victim || victim.exitCode !== null) return
      console.warn(
        `[legalwork] runtime on port ${port} did not respond for ${CHILD_WATCHDOG_MAX_FAILURES * CHILD_WATCHDOG_INTERVAL_MS / 1000}s; killing hung process (pid=${victimPid}) so it can restart on the same port`
      )
      if (childLogCapture) {
        childLogCapture.logLifecycle(
          `watchdog: runtime unresponsive on port ${port}; killing (pid=${victimPid}) for restart`
        )
      }
      try {
        victim.kill('SIGTERM')
      } catch {
        /* already gone */
      }
      // SIGTERM 不响应则强杀；child exit 处理器会把 child 置空，
      // 下一次 ensureRuntime 会探测到端口空闲并在原端口重启。
      setTimeout(() => {
        try {
          if (victim.exitCode === null && victim.signalCode === null && victimPid) {
            process.kill(victimPid, 'SIGKILL')
          }
        } catch {
          /* already gone */
        }
      }, CHILD_WATCHDOG_HEALTH_TIMEOUT_MS)
    })().catch(() => {
      /* 看护失败绝不影响主流程 */
    })
  }, CHILD_WATCHDOG_INTERVAL_MS)
  timer.unref?.()
  childWatchdog = { timer, port, failures }
}

export async function startLegalworkChild(settings: AppSettingsV1): Promise<void> {
  if (childStartupPromise) return childStartupPromise
  const task = startLegalworkChildOnce(settings)
  childStartupPromise = task
  try {
    await task
  } finally {
    if (childStartupPromise === task) childStartupPromise = null
  }
}

async function startLegalworkChildOnce(settings: AppSettingsV1): Promise<void> {
  const runtime = resolveLegalworkRuntimeSettings(settings)
  if (!runtime.autoStart) return
  const codexBinaryPath = runtime.authMode === 'chatgpt'
    ? resolveCodexBinaryPath(runtime.codexBinaryPath)
    : null
  if (runtime.authMode === 'chatgpt' && !codexBinaryPath) {
    throw new Error('Codex executable was not found. Configure its path in Settings > Agents.')
  }
  const root = appRoot()
  const resolution = resolveLegalworkExecutable(root, runtime.binaryPath)
  const dataDir = resolveLegalworkDataDir(runtime)
  const legalworkCodexHome = join(app.getPath('userData'), 'codex-auth')
  const configChanged = await syncGuiManagedLegalworkConfig(dataDir, runtime, {
    scheduleMcp: {
      settings,
      launch: {
        appPath: app.getAppPath(),
        execPath: process.execPath,
        isPackaged: app.isPackaged
      }
    },
    officecli: {
      appPath: app.getAppPath(),
      isPackaged: app.isPackaged
    },
    ima: {
      appPath: app.getAppPath(),
      isPackaged: app.isPackaged
    }
  })
  if (isLegalworkChildRunning()) {
    if (!configChanged) return
    await stopLegalworkChildAndWait()
  }
  if (childLogCapture) {
    await childLogCapture.close()
    childLogCapture = null
  }
  if (resolution.command === process.execPath && !existsSync(resolution.args[0])) {
    throw new Error(
      `Legalwork runtime build is missing at ${resolution.args[0]}. Run \`npm run build:legalwork\` before starting the GUI.`
    )
  }
  lastResolvedBinary = resolution.command === process.execPath
    ? resolution.args.join(' ')
    : resolution.command
  const args = buildLegalworkServeArgs({
    resolution,
    host: '127.0.0.1',
    port: runtime.port,
    dataDir,
    authMode: runtime.authMode,
    codexBinaryPath: codexBinaryPath ?? runtime.codexBinaryPath,
    baseUrl: runtime.baseUrl,
    endpointFormat: runtime.endpointFormat,
    model: runtime.model,
    approvalPolicy: runtime.approvalPolicy,
    sandboxMode: runtime.sandboxMode,
    tokenEconomyMode: runtime.tokenEconomyMode,
    insecure: isLegalworkRuntimeInsecure(runtime)
  })
  const webRoot = join(root, 'vendor', 'data-compliance-review-codex', 'data-compliance-web')
  const repositoryRoot = join(root, '..', '..')
  const ocrAgentPath = app.isPackaged
    ? join(process.resourcesPath, 'ocr_agent.py')
    : join(repositoryRoot, 'ocr_agent.py')
  const dataComplianceVenvPython = process.platform === 'win32'
    ? join(app.getPath('userData'), 'data-compliance', 'python-venv', 'Scripts', 'python.exe')
    : join(app.getPath('userData'), 'data-compliance', 'python-venv', 'bin', 'python')
  const repositoryVenvPython = process.platform === 'win32'
    ? join(repositoryRoot, '.venv', 'Scripts', 'python.exe')
    : join(repositoryRoot, '.venv', 'bin', 'python')
  const ocrPython = [
    process.env.LEGALWORK_OCR_PYTHON,
    process.env.LEGALWORK_PYTHON,
    dataComplianceVenvPython,
    repositoryVenvPython
  ].find((candidate) => Boolean(candidate && existsSync(candidate)))
  const runtimePath = buildBundledOfficeCliPath(
    process.env.PATH,
    app.getAppPath(),
    app.isPackaged
  )
  const bundledOfficePython = resolveBundledOfficePythonPath({
    appPath: root,
    isPackaged: app.isPackaged,
    resourcesPath: process.resourcesPath
  })
  const bundledCompliancePython = resolveBundledCompliancePythonPath({
    appPath: root,
    isPackaged: app.isPackaged,
    resourcesPath: process.resourcesPath
  })
  // Chromium uses the OS proxy during ChatGPT login, while the Codex binary
  // only reads proxy environment variables. Mirror the same proxy into the
  // ChatGPT-authenticated runtime so login and subsequent model turns use the
  // same network path. API-key/DeepSeek mode remains untouched.
  const codexProxyEnv = resolveCodexRuntimeProxyEnv(
    runtime.authMode,
    process.env,
    runtime.authMode === 'chatgpt' ? detectSystemProxy() : null
  )
  const childEnvironment = buildOcrRuntimeEnvironment(
    [root, app.getAppPath()],
    {
      ...process.env,
      ...(codexProxyEnv ?? {}),
      PATH: runtimePath,
      ELECTRON_RUN_AS_NODE: '1',
      LEGALWORK_RUNTIME_TOKEN: runtime.runtimeToken,
      LEGALWORK_AUTH_MODE: runtime.authMode,
      LEGALWORK_CODEX_BINARY: (codexBinaryPath ?? runtime.codexBinaryPath) || process.env.LEGALWORK_CODEX_BINARY || '',
      LEGALWORK_CODEX_HOME: legalworkCodexHome,
      LEGALWORK_COMPLIANCE_WEB_ROOT: webRoot,
      LEGALWORK_API_KEY: runtime.apiKey || process.env.LEGALWORK_API_KEY || '',
      LEGALWORK_BASE_URL: runtime.baseUrl || process.env.LEGALWORK_BASE_URL || '',
      LEGALWORK_MODEL: runtime.model || process.env.LEGALWORK_MODEL || '',
      ...(existsSync(ocrAgentPath) ? { LEGALWORK_OCR_AGENT_PATH: ocrAgentPath } : {}),
      ...(ocrPython ? { LEGALWORK_OCR_PYTHON: ocrPython } : {}),
      ...(bundledOfficePython ? { LEGALWORK_OFFICE_PYTHON: bundledOfficePython } : {}),
      ...(bundledCompliancePython ? {
        COMPLIANCEAI_PYTHON: bundledCompliancePython,
        LEGALWORK_BUNDLED_COMPLIANCE_RUNTIME: '1',
        LEGALWORK_BUNDLED_COMPLIANCE_PYTHONHOME: dirname(bundledCompliancePython)
      } : {}),
      DEEPSEEK_API_KEY: runtime.apiKey || process.env.DEEPSEEK_API_KEY || '',
      KIMI_API_KEY: runtime.apiKey || process.env.KIMI_API_KEY || ''
    }
  )
  child = spawn(resolution.command, args, {
    env: childEnvironment,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false,
    // Windows: 隐藏子进程控制台窗口，避免每次启动 runtime 时弹出黑框。
    windowsHide: true
  })
  const startedChild = child
  const startedLogCapture = createLegalworkChildLogCapture(startedChild.pid)
  childLogCapture = startedLogCapture
  startedLogCapture.logLifecycle(`spawned on port ${runtime.port} using data dir ${dataDir}`)
  startedChild.stdout?.on('data', startedLogCapture.captureStdout)
  startedChild.stderr?.on('data', startedLogCapture.captureStderr)
  child.on('exit', (code, signal) => {
    startedLogCapture.logLifecycle(
      signal
        ? `exited with signal ${signal}`
        : `exited with code ${code ?? 'unknown'}`
    )
    void startedLogCapture.close()
    if (child === startedChild) child = null
    if (childWatchdog?.port === runtime.port) stopChildWatchdog()
  })
  child.on('error', (error) => {
    startedLogCapture.logLifecycle(
      `process error: ${error instanceof Error ? error.message : String(error)}`
    )
  })
  try {
    await waitForLegalworkStartup(startedChild, runtime.port)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    startedLogCapture.logLifecycle(`startup failed before ready: ${message}`)
    if (child === startedChild) {
      await stopLegalworkChildAndWait()
    }
    throw error
  }
  startedLogCapture.logLifecycle(`ready marker received on port ${runtime.port}`)
  // Runtime 已就绪，启动假死看护：进程存活但不响应 /health 时 kill 以便在原端口重启。
  startChildWatchdog(runtime.port)
}

export async function syncGuiManagedLegalworkConfig(
  dataDir: string,
  runtime: Pick<
    LegalworkRuntimeSettingsV1,
    'mcpSearch' | 'tokenEconomy' | 'storage' | 'contextCompaction' | 'runtimeTuning'
  >,
  options?: {
    scheduleMcp?: {
      settings: AppSettingsV1
      launch: ClawScheduleMcpLaunchConfig
    }
    officecli?: {
      appPath: string
      isPackaged: boolean
    }
    ima?: {
      appPath: string
      isPackaged: boolean
    }
    mcpConfigPath?: string
  }
): Promise<boolean> {
  const configPath = join(dataDir, 'config.json')
  const existing = sanitizeLegalworkConfigSections(await readJsonObjectIfExists(configPath))
  const guiMcpConfigPath = options?.mcpConfigPath ?? resolveLegalworkMcpJsonPath()
  const importedMcpServers = await readGuiManagedMcpServers(
    guiMcpConfigPath,
    options?.scheduleMcp?.launch
  )
  const guiPrimaryLegalSource = await readGuiManagedPrimaryLegalSource(guiMcpConfigPath)
  const hasImportedEnabledMcpServer = Object.values(importedMcpServers).some(
    (server) => objectValue(server).enabled !== false
  )

  const serve = objectValue(existing?.serve)
  const existingTokenEconomy = objectValue(serve.tokenEconomy)
  const existingContextCompaction = objectValue(existing?.contextCompaction)
  const existingModels = objectValue(existing?.models)
  const existingRuntimeTuning = objectValue(existing?.runtime)
  const capabilities = objectValue(existing?.capabilities)
  const mcp = objectValue(capabilities.mcp)
  const search = objectValue(mcp.search)
  const attachments = objectValue(capabilities.attachments)
  const web = objectValue(capabilities.web)
  const skills = objectValue(capabilities.skills)
  const memory = objectValue(capabilities.memory)
  const storage = storageConfigForRuntime(runtime.storage)
  const mcpSearch = runtime.mcpSearch
  const skillCapability = await skillCapabilityConfigForRuntime(skills, options?.scheduleMcp?.settings)
  const mergedMcpServers = {
    ...objectValue(mcp.servers),
    ...importedMcpServers,
    ...(options?.scheduleMcp
      ? {
          [LEGALWORK_SCHEDULE_MCP_SERVER_NAME]: buildGuiScheduleLegalworkMcpServer(
            options.scheduleMcp.settings,
            options.scheduleMcp.launch
          )
        }
      : {}),
    ...(options?.officecli
      ? {
          [LEGALWORK_OFFICECLI_MCP_SERVER_NAME]: buildOfficeCliLegalworkMcpServer(
            options.officecli.appPath,
            options.officecli.isPackaged
          )
        }
      : {})
  }
  const runtimeMcpServers = rebindBundledImaMcpServer(
    mergedMcpServers,
    options?.ima
  )
  const next = {
    serve: {
      ...serve,
      storage,
      tokenEconomy: tokenEconomyConfigForRuntime(runtime.tokenEconomy, existingTokenEconomy)
    },
    models: modelConfigForRuntime(existingModels),
    contextCompaction: contextCompactionConfigForRuntime(runtime.contextCompaction, existingContextCompaction),
    runtime: runtimeTuningConfigForRuntime(runtime.runtimeTuning, existingRuntimeTuning),
    capabilities: {
      ...capabilities,
      attachments: {
        ...attachments,
        enabled: attachments.enabled === false ? false : true,
        ...(attachments.enabled === false
          ? {}
          : {
              allowedMimeTypes: mergeGuiManagedAttachmentMimeTypes(attachments.allowedMimeTypes)
            })
      },
      web: {
        ...web,
        enabled: web.enabled === false ? false : true,
        fetchEnabled: web.fetchEnabled === false ? false : true
      },
      memory: {
        ...memory,
        enabled: memory.enabled === false ? false : true
      },
      skills: skillCapability,
      mcp: {
        ...mcp,
        ...(options?.scheduleMcp || mcpSearch.enabled || hasImportedEnabledMcpServer
          ? { enabled: mcp.enabled === false ? false : true }
          : {}),
        ...(guiPrimaryLegalSource ? { primaryLegalSource: guiPrimaryLegalSource } : {}),
        servers: runtimeMcpServers,
        search: {
          ...search,
          enabled: mcpSearch.enabled,
          mode: mcpSearch.mode,
          autoThresholdToolCount: mcpSearch.autoThresholdToolCount,
          topKDefault: mcpSearch.topKDefault,
          topKMax: mcpSearch.topKMax,
          minScore: mcpSearch.minScore
        }
      }
    }
  }
  const parsedNext = LegalworkConfigSchema.safeParse(next)
  if (!parsedNext.success) {
    throw new Error(
      `Refusing to write invalid GUI-managed Legalwork config at ${configPath}: ${JSON.stringify(parsedNext.error.issues, null, 2)}`
    )
  }
  const nextText = `${JSON.stringify(next, null, 2)}\n`
  if (existing && nextText === `${JSON.stringify(existing, null, 2)}\n`) return false
  await mkdir(dirname(configPath), { recursive: true })
  await writeFile(configPath, nextText, 'utf8')
  return true
}

export function resolveBundledImaMcpScriptPath(
  appPath: string,
  isPackaged: boolean
): string {
  return isPackaged
    ? join(appPath, '..', 'scripts', 'ima-mcp-server.py')
    : join(appPath, 'scripts', 'ima-mcp-server.py')
}

function rebindBundledImaMcpServer(
  servers: Record<string, unknown>,
  currentApp?: { appPath: string; isPackaged: boolean }
): Record<string, unknown> {
  if (!currentApp) return servers
  const existing = objectValue(servers[LEGALWORK_IMA_MCP_SERVER_NAME])
  if (Object.keys(existing).length === 0) return servers
  return {
    ...servers,
    [LEGALWORK_IMA_MCP_SERVER_NAME]: {
      ...existing,
      args: [resolveBundledImaMcpScriptPath(currentApp.appPath, currentApp.isPackaged)]
    }
  }
}

function buildGuiScheduleLegalworkMcpServer(
  settings: AppSettingsV1,
  launch: ClawScheduleMcpLaunchConfig
): Record<string, unknown> {
  return {
    enabled: true,
    transport: 'stdio',
    command: resolveClawScheduleMcpCommand(launch),
    args: buildClawScheduleMcpArgs(settings, launch),
    env: {
      ELECTRON_RUN_AS_NODE: '1'
    },
    trustScope: 'user',
    timeoutMs: LEGALWORK_SCHEDULE_MCP_TIMEOUT_MS
  }
}

function resolveOfficeCliBinaryPath(
  appPath: string,
  isPackaged: boolean
): { command: string; args: string[] } {
  const officeCliRoot = resolveOfficeCliRoot(appPath, isPackaged)
  const binaryPath = join(officeCliRoot, 'vendor', 'officecli')
  if (existsSync(binaryPath)) {
    return { command: binaryPath, args: ['mcp'] }
  }
  const shimPath = join(officeCliRoot, 'officecli.js')
  return { command: process.execPath, args: [shimPath, 'mcp'] }
}

function resolveOfficeCliRoot(appPath: string, isPackaged: boolean): string {
  const root = isPackaged ? appPath.replace(/app\.asar$/, 'app.asar.unpacked') : appPath
  return join(root, 'legalwork', 'node_modules', '@officecli', 'officecli')
}

export function buildBundledOfficeCliPath(
  currentPath: string | undefined,
  appPath: string,
  isPackaged: boolean
): string {
  const bundledBinDir = join(resolveOfficeCliRoot(appPath, isPackaged), 'vendor')
  const seen = new Set<string>()
  const entries: string[] = []
  for (const entry of [bundledBinDir, ...(currentPath ?? '').split(delimiter)]) {
    const normalized = entry.trim()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    entries.push(normalized)
  }
  return entries.join(delimiter)
}

export function resolveBundledOfficePythonPath(input: {
  appPath: string
  isPackaged: boolean
  resourcesPath?: string
  platform?: NodeJS.Platform
  arch?: string
}): string | undefined {
  const platform = input.platform ?? process.platform
  const arch = input.arch ?? process.arch
  const executable = platform === 'win32' ? 'python.exe' : join('bin', 'python3')
  const platformName = platform === 'darwin'
    ? 'mac'
    : platform === 'win32'
      ? 'win'
      : platform === 'linux'
        ? 'linux'
        : ''
  if (!platformName) return undefined

  const runtimeRoot = input.isPackaged
    ? join(input.resourcesPath || dirname(input.appPath), 'office-runtime')
    : join(input.appPath, 'vendor', 'office-runtime', `${platformName}-${arch}`)
  const candidate = join(runtimeRoot, 'python', executable)
  return existsSync(candidate) ? candidate : undefined
}

export function resolveBundledCompliancePythonPath(input: {
  appPath: string
  isPackaged: boolean
  resourcesPath?: string
  platform?: NodeJS.Platform
  arch?: string
}): string | undefined {
  const python = resolveBundledOfficePythonPath(input)
  if (!python) return undefined
  const platform = input.platform ?? process.platform
  const arch = input.arch ?? process.arch
  // PaddlePaddle's distributable Windows runtime is x64-only.
  if (platform !== 'win32' || arch !== 'x64') return undefined
  const runtimeRoot = dirname(dirname(python))
  const manifestPath = join(runtimeRoot, 'runtime.json')
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      dataComplianceReady?: boolean
      imports?: unknown
    }
    return manifest.dataComplianceReady === true &&
      Array.isArray(manifest.imports) &&
      manifest.imports.includes('paddle') &&
      manifest.imports.includes('paddleocr')
      ? python
      : undefined
  } catch {
    return undefined
  }
}

function buildOfficeCliLegalworkMcpServer(
  appPath: string,
  isPackaged: boolean
): Record<string, unknown> {
  const { command, args } = resolveOfficeCliBinaryPath(appPath, isPackaged)
  return {
    enabled: true,
    transport: 'stdio',
    command,
    args,
    env: {
      // OfficeCLI 自带后台自更新（启动时 + 每小时检查，会 spawn 子进程做下载/验证/应用）。
      // 在 Windows 上这些后台子进程即使被 CREATE_NO_WINDOW 启动，仍可能弹出"命令提示符"窗口。
      // officecli 是 legalwork 内置的版本化二进制，版本由打包控制，自更新没有意义反而有风险，
      // 用官方 OFFICECLI_SKIP_UPDATE=1 彻底关闭，消除弹窗源。
      OFFICECLI_SKIP_UPDATE: '1',
      // 防止 officecli 为文件操作自动拉起常驻服务进程（resident）产生新窗口。officecli mcp
      // 默认即 opt-out，此处显式注入兜底（未来版本改默认行为时仍生效）。
      OFFICECLI_NO_AUTO_RESIDENT: '1'
    },
    trustScope: 'user',
    trustedWorkspaceRoots: [],
    timeoutMs: LEGALWORK_OFFICECLI_MCP_TIMEOUT_MS
  }
}

async function skillCapabilityConfigForRuntime(
  existing: Record<string, unknown>,
  settings?: AppSettingsV1
): Promise<Record<string, unknown>> {
  const guiRoots = await guiSkillRootsForRuntime(settings)
  const nativeRoots = guiRoots
    .filter((root) => root.scope === 'builtin')
    .map((root) => root.path)
  const roots = uniqueStrings([
    // 原生根放在最前面；SkillRuntime 仍会用 nativeRoots 做来源判定和冲突保护，
    // 此处排序也让旧版本或其他顺序敏感的读取方保持 native-first。
    ...nativeRoots,
    ...guiRoots.filter((root) => root.scope !== 'builtin').map((root) => root.path),
    ...stringArrayValue(existing.roots).map(normalizeSkillRootPath)
  ])
  return {
    ...existing,
    enabled: existing.enabled === false ? false : roots.length > 0 || existing.enabled === true,
    roots,
    nativeRoots: uniqueStrings([
      ...nativeRoots,
      ...stringArrayValue(existing.nativeRoots).map(normalizeSkillRootPath)
    ]),
    legacySkillMd: existing.legacySkillMd === false ? false : true,
    // GUI 管理的 Legalwork agent 固定采用 native-first；补充 skill 只能在确认
    // 能力缺口后按需 load，不能沿用旧版“关键词命中即自动抢占”的配置值。
    autoActivateUserSkills: false
  }
}

function stringArrayValue(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const value of values) {
    if (!value || seen.has(value)) continue
    seen.add(value)
    out.push(value)
  }
  return out
}

/**
 * 读取 GUI mcp.json 顶层的"首要法律调研源"选择（pkulaw/yuandian）。
 * 非 pkulaw/yuandian 值、缺失或读取失败时返回 undefined（保持默认北大法宝的现有行为，
 * 绝不因读取失败阻断 runtime 启动）。
 */
async function readGuiManagedPrimaryLegalSource(
  path: string
): Promise<'pkulaw' | 'yuandian' | undefined> {
  try {
    const parsed = await readJsonObjectIfExists(path)
    if (!parsed) return undefined
    const value = (parsed as Record<string, unknown>).primaryLegalSource
    return value === 'pkulaw' || value === 'yuandian' ? value : undefined
  } catch {
    // 读取失败（如 EACCES）降级为默认，不影响 runtime 启动。
    return undefined
  }
}

async function readGuiManagedMcpServers(
  path: string,
  launch?: ClawScheduleMcpLaunchConfig
): Promise<Record<string, unknown>> {
  const parsed = await readJsonObjectIfExists(path)
  if (!parsed) return {}

  const rawServers = mcpServersFromGuiConfig(parsed)
  const normalizedEntries = Object.entries(rawServers)
    .map(([serverId, server]) => {
      const normalized = normalizeGuiManagedMcpServer(server)
      return normalized ? [serverId, normalized] as const : null
    })
    .filter((entry): entry is readonly [string, Record<string, unknown>] => entry !== null)

  const servers = Object.fromEntries(normalizedEntries)

  // filesystem 离线化：把 npx 方式（每次启动联网查 npm registry）改写为
  // legalwork 自带 node 直接启动的本地入口，杜绝间歇性 connect 超时。
  if (launch) {
    for (const [serverId, server] of Object.entries(servers)) {
      const rewritten = rewriteNpxFilesystemMcpServer(server, launch)
      if (rewritten) servers[serverId] = rewritten
    }
  }

  // 北大法宝默认预装：mcp.json 未配置任何 pkulaw server 时自动补齐，
  // 保证装好即连（headers 为空 → runtime 注入随包 fallback token）。
  // 若 mcp.json 已含 pkulaw（用户填过自己的 token），则不覆盖，用户配置优先。
  const hasAnyPkulawServer = Object.keys(servers).some((serverId) => serverId.startsWith('pkulaw-'))
  if (!hasAnyPkulawServer) {
    Object.assign(servers, DEFAULT_PKULAW_MCP_SERVERS)
  }

  return servers
}

function mcpServersFromGuiConfig(config: Record<string, unknown>): Record<string, unknown> {
  const directServers = objectValue(config.servers)
  if (Object.keys(directServers).length > 0) return directServers

  const capabilities = objectValue(config.capabilities)
  const mcp = objectValue(capabilities.mcp)
  return objectValue(mcp.servers)
}

function normalizeGuiManagedMcpServer(server: unknown): Record<string, unknown> | null {
  const raw = objectValue(server)
  const command = scalarStringValue(raw.command)
  const url = scalarStringValue(raw.url)
  const args = stringArrayValue(raw.args)
  const headers = stringRecordValue(raw.headers)
  const env = stringRecordValue(raw.env)
  const transport = normalizeMcpTransport(raw.transport, command, url)
  if (!transport) return null

  const trustedWorkspaceRoots = stringArrayValue(raw.trustedWorkspaceRoots)
  const trustScope = normalizeMcpTrustScope(raw.trustScope, trustedWorkspaceRoots)

  const timeoutMs = positiveIntegerValue(raw.timeoutMs)
  const parsed = McpServerConfig.safeParse({
    enabled: raw.enabled === false || raw.disabled === true ? false : true,
    transport,
    ...(command ? { command } : {}),
    ...(args.length > 0 ? { args } : {}),
    ...(url ? { url } : {}),
    ...(Object.keys(headers).length > 0 ? { headers } : {}),
    ...(Object.keys(env).length > 0 ? { env } : {}),
    trustScope,
    ...(trustedWorkspaceRoots.length > 0 ? { trustedWorkspaceRoots } : {}),
    ...(timeoutMs ? { timeoutMs } : {})
  })

  return parsed.success ? objectValue(parsed.data) : null
}

function normalizeMcpTransport(
  value: unknown,
  command: string | undefined,
  url: string | undefined
): 'stdio' | 'streamable-http' | 'sse' | null {
  if (value === 'stdio' || value === 'streamable-http' || value === 'sse') return value
  if (command) return 'stdio'
  if (url) return 'streamable-http'
  return null
}

function normalizeMcpTrustScope(
  value: unknown,
  trustedWorkspaceRoots: string[]
): 'user' | 'workspace' {
  if (value === 'user' || value === 'workspace') return value
  return trustedWorkspaceRoots.length > 0 ? 'workspace' : 'user'
}

function scalarStringValue(value: unknown): string | undefined {
  return typeof value === 'string'
    ? value
    : typeof value === 'number' || typeof value === 'boolean'
      ? String(value)
      : undefined
}

function stringRecordValue(value: unknown): Record<string, string> {
  const record = objectValue(value)
  const next: Record<string, string> = {}
  for (const [key, item] of Object.entries(record)) {
    const normalized = scalarStringValue(item)
    if (normalized !== undefined) next[key] = normalized
  }
  return next
}

function positiveIntegerValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined
}

function modelConfigForRuntime(existing: Record<string, unknown>): Record<string, unknown> {
  const existingProfiles = objectValue(existing.profiles)
  const profiles: Record<string, unknown> = { ...DEFAULT_LEGALWORK_MODEL_PROFILES }
  for (const [modelId, profile] of Object.entries(existingProfiles)) {
    const defaultProfile = objectValue(DEFAULT_LEGALWORK_MODEL_PROFILES[modelId])
    const existingProfile = objectValue(profile)
    const existingCompaction = objectValue(existingProfile.contextCompaction)
    const mergedCompaction = {
      ...objectValue(defaultProfile.contextCompaction),
      ...existingCompaction
    }
    // Migrate the premature DeepSeek thresholds written by earlier desktop
    // builds. They caused compaction after only 4-13% of a 1M window. Preserve
    // all other pairs as deliberate user overrides.
    const existingSoft = positiveIntegerValue(existingCompaction.softThreshold)
    const existingHard = positiveIntegerValue(existingCompaction.hardThreshold)
    const isPrematureDeepseekPair =
      (existingSoft === 40_000 && existingHard === 60_000) ||
      (existingSoft === 100_000 && existingHard === 130_000)
    if (
      (modelId === 'deepseek-v4-pro' || modelId === 'deepseek-v4-flash') &&
      isPrematureDeepseekPair
    ) {
      Object.assign(mergedCompaction, objectValue(defaultProfile.contextCompaction))
    }
    // hardThreshold must stay >= softThreshold. When only soft is configured
    // (hard falls back to the aggressive default, which may be smaller than a
    // user-supplied soft), lift hard above soft so the config stays valid.
    const soft = positiveIntegerValue(mergedCompaction.softThreshold)
    const hard = positiveIntegerValue(mergedCompaction.hardThreshold)
    if (soft !== undefined && hard !== undefined && hard < soft) {
      mergedCompaction.hardThreshold = soft + 1
    }
    profiles[modelId] = {
      ...defaultProfile,
      ...existingProfile,
      contextCompaction: mergedCompaction
    }
  }
  return {
    ...existing,
    profiles
  }
}

function tokenEconomyConfigForRuntime(
  tokenEconomy: Pick<LegalworkRuntimeSettingsV1, 'tokenEconomy'>['tokenEconomy'] | undefined,
  existing: Record<string, unknown>
): Record<string, unknown> {
  const defaults = defaultLegalworkTokenEconomySettings()
  const normalized = {
    ...defaults,
    ...(tokenEconomy ?? {}),
    historyHygiene: {
      ...defaults.historyHygiene,
      ...(tokenEconomy?.historyHygiene ?? {})
    }
  }
  const existingHistoryHygiene = objectValue(existing.historyHygiene)
  return {
    ...existing,
    enabled: normalized.enabled,
    compressToolDescriptions: normalized.compressToolDescriptions,
    compressToolResults: normalized.compressToolResults,
    conciseResponses: normalized.conciseResponses,
    historyHygiene: {
      ...existingHistoryHygiene,
      maxToolResultLines: normalized.historyHygiene.maxToolResultLines,
      maxToolResultBytes: normalized.historyHygiene.maxToolResultBytes,
      maxToolResultTokens: normalized.historyHygiene.maxToolResultTokens,
      maxToolArgumentStringBytes: normalized.historyHygiene.maxToolArgumentStringBytes,
      maxToolArgumentStringTokens: normalized.historyHygiene.maxToolArgumentStringTokens,
      maxArrayItems: normalized.historyHygiene.maxArrayItems
    }
  }
}

function storageConfigForRuntime(
  storage: Pick<LegalworkRuntimeSettingsV1, 'storage'>['storage']
): Record<string, unknown> {
  const sqlitePath = storage.sqlitePath.trim()
  return {
    backend: storage.backend,
    ...(sqlitePath ? { sqlitePath } : {})
  }
}

function contextCompactionConfigForRuntime(
  contextCompaction: Pick<LegalworkRuntimeSettingsV1, 'contextCompaction'>['contextCompaction'],
  existing: Record<string, unknown>
): Record<string, unknown> {
  return {
    ...existing,
    defaultSoftThreshold: contextCompaction.defaultSoftThreshold,
    defaultHardThreshold: contextCompaction.defaultHardThreshold,
    summaryMode: contextCompaction.summaryMode,
    summaryTimeoutMs: contextCompaction.summaryTimeoutMs,
    summaryMaxTokens: contextCompaction.summaryMaxTokens,
    summaryInputMaxBytes: contextCompaction.summaryInputMaxBytes
  }
}

function runtimeTuningConfigForRuntime(
  runtimeTuning: Pick<LegalworkRuntimeSettingsV1, 'runtimeTuning'>['runtimeTuning'],
  existing: Record<string, unknown>
): Record<string, unknown> {
  const existingToolStorm = objectValue(existing.toolStorm)
  const existingToolArgumentRepair = objectValue(existing.toolArgumentRepair)
  return {
    ...existing,
    toolStorm: {
      ...existingToolStorm,
      enabled: runtimeTuning.toolStorm.enabled,
      windowSize: runtimeTuning.toolStorm.windowSize,
      threshold: runtimeTuning.toolStorm.threshold
    },
    toolArgumentRepair: {
      ...existingToolArgumentRepair,
      maxStringBytes: runtimeTuning.toolArgumentRepair.maxStringBytes
    }
  }
}

function mergeGuiManagedAttachmentMimeTypes(existing: unknown): string[] {
  const current = Array.isArray(existing)
    ? existing.filter((mimeType): mimeType is string => typeof mimeType === 'string' && mimeType.trim().length > 0)
    : []
  if (current.some((mimeType) => mimeType === '*/*')) return current
  // GUI-managed attachments accept every file type. `*/*` overrides the
  // convenience list so unknown MIME types (e.g. application/octet-stream)
  // are never rejected by the runtime's attachment validation.
  return ['*/*', ...new Set([...current, ...GUI_ATTACHMENT_ALLOWED_MIME_TYPES])]
}

async function readJsonObjectIfExists(path: string): Promise<Record<string, unknown> | null> {
  try {
    const text = await readFile(path, 'utf8')
    const parsed = JSON.parse(text) as unknown
    return objectValue(parsed)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    if (error instanceof SyntaxError) return null
    throw error
  }
}

type SafeParseSchema = {
  safeParse: (value: unknown) =>
    | { success: true; data: unknown }
    | { success: false }
}

function parseLegalworkConfigSection(
  schema: SafeParseSchema,
  value: unknown
): Record<string, unknown> {
  const parsed = schema.safeParse(objectValue(value))
  return parsed.success ? objectValue(parsed.data) : {}
}

function sanitizeLegalworkCapabilitiesConfig(value: unknown): Record<string, unknown> {
  const raw = objectValue(value)
  const next: Record<string, unknown> = {}
  if ('mcp' in raw) next.mcp = parseLegalworkConfigSection(McpCapabilityConfig, raw.mcp)
  if ('web' in raw) next.web = parseLegalworkConfigSection(WebCapabilityConfig, raw.web)
  if ('skills' in raw) next.skills = parseLegalworkConfigSection(SkillsCapabilityConfig, raw.skills)
  if ('subagents' in raw) {
    next.subagents = parseLegalworkConfigSection(SubagentsCapabilityConfig, raw.subagents)
  }
  if ('attachments' in raw) {
    next.attachments = parseLegalworkConfigSection(AttachmentsCapabilityConfig, raw.attachments)
  }
  if ('memory' in raw) next.memory = parseLegalworkConfigSection(MemoryCapabilityConfig, raw.memory)
  return next
}

function sanitizeLegalworkConfigSections(
  existing: Record<string, unknown> | null
): Record<string, unknown> | null {
  if (!existing) return null
  return {
    serve: parseLegalworkConfigSection(LegalworkServeConfigSchema, existing.serve),
    models: parseLegalworkConfigSection(ModelConfigSchema, existing.models),
    contextCompaction: parseLegalworkConfigSection(
      ContextCompactionConfigSchema,
      existing.contextCompaction
    ),
    runtime: parseLegalworkConfigSection(RuntimeTuningConfigSchema, existing.runtime),
    capabilities: sanitizeLegalworkCapabilitiesConfig(existing.capabilities)
  }
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

export async function stopLegalworkChildAndWait(): Promise<void> {
  // 主动停止：先停看护，避免在 kill 窗口期内误判假死重复触发。
  stopChildWatchdog()
  if (!child) {
    if (childLogCapture) {
      const capture = childLogCapture
      childLogCapture = null
      await capture.close()
    }
    return
  }
  const stoppingChild = child
  const pid = child.pid
  const capture = childLogCapture
  if (stoppingChild.exitCode === null && stoppingChild.signalCode === null) {
    try {
      stoppingChild.kill('SIGTERM')
    } catch {
      /* already gone */
    }
  }
  const exited = await waitForChildExit(stoppingChild, LEGALWORK_STOP_GRACE_MS)
  if (!exited) {
    try {
      if (pid) process.kill(pid, 'SIGKILL')
    } catch {
      /* already gone */
    }
    await waitForChildExit(stoppingChild, LEGALWORK_STOP_FORCE_MS)
  }
  if (child === stoppingChild) child = null
  if (capture) {
    childLogCapture = null
    await capture.close()
  }
}

function waitForChildExit(process: ChildProcess, timeoutMs: number): Promise<boolean> {
  if (process.exitCode !== null || process.signalCode !== null) return Promise.resolve(true)
  return new Promise((resolve) => {
    let settled = false
    const timer = setTimeout(() => settle(false), timeoutMs)
    const settle = (exited: boolean): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      process.removeListener('exit', onExit)
      process.removeListener('error', onError)
      resolve(exited)
    }
    const onExit = (): void => settle(true)
    const onError = (): void => settle(true)
    process.once('exit', onExit)
    process.once('error', onError)
  })
}

export async function reclaimLegalworkPort(
  port: number
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (port <= 0) return { ok: true }
  const available = await canBindTcpPort(port, '127.0.0.1')
  return available
    ? { ok: true }
    : { ok: false, message: `port ${port} is in use` }
}

export async function findAvailableLegalworkPort(
  preferredPort: number,
  maxAttempts = 50
): Promise<number> {
  const start = Math.max(1, preferredPort)
  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const port = start + offset
    if (await canBindTcpPort(port, '127.0.0.1')) return port
  }
  throw new Error(`No available Legalwork runtime port found near ${preferredPort}`)
}

function canBindTcpPort(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false
    const server = createServer()
    const settle = (available: boolean): void => {
      if (settled) return
      settled = true
      server.removeAllListeners('error')
      resolve(available)
    }
    server.unref()
    server.once('error', () => settle(false))
    server.listen({ port, host, exclusive: true }, () => {
      server.close(() => settle(true))
    })
  })
}

async function waitForLegalworkStartup(startedChild: ChildProcess, port?: number): Promise<void> {
  if (startedChild.exitCode !== null) {
    throw new Error(describeLegalworkExit(startedChild.exitCode, null))
  }
  await new Promise<void>((resolve, reject) => {
    let settled = false
    let stdoutBuffer = ''
    let stderrTail = ''
    let healthProbeInFlight = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(describeLegalworkStartupTimeout(stderrTail)))
    }, LEGALWORK_STARTUP_TIMEOUT_MS)
    // The stdout ready marker can lag behind the actual server (pipe
    // buffering) or get lost in unusual spawn environments; the HTTP
    // health endpoint is the ground truth, so poll it in parallel.
    const healthTimer = port
      ? setInterval(() => {
          if (settled || healthProbeInFlight) return
          healthProbeInFlight = true
          void probeLegalworkHealth(port)
            .then((healthy) => {
              if (healthy) settleReady()
            })
            .finally(() => {
              healthProbeInFlight = false
            })
        }, LEGALWORK_STARTUP_HEALTH_POLL_MS)
      : null
    const cleanup = (): void => {
      clearTimeout(timer)
      if (healthTimer) clearInterval(healthTimer)
      startedChild.removeListener('exit', onExit)
      startedChild.removeListener('error', onError)
      startedChild.stdout?.removeListener('data', onStdout)
      startedChild.stderr?.removeListener('data', onStderr)
    }
    const tryParseReady = (): boolean => {
      const markerIndex = stdoutBuffer.indexOf(LEGALWORK_READY_PREFIX)
      if (markerIndex < 0) return false
      const afterPrefix = stdoutBuffer.slice(markerIndex + LEGALWORK_READY_PREFIX.length)
      const newlineIndex = afterPrefix.indexOf('\n')
      if (newlineIndex < 0) return false
      const jsonLine = afterPrefix.slice(0, newlineIndex).trim()
      if (!jsonLine) return false
      try {
        const parsed = JSON.parse(jsonLine) as { service?: string; mode?: string; port?: number }
        return parsed.service === 'legalwork' && parsed.mode === 'serve' && typeof parsed.port === 'number'
      } catch {
        return false
      }
    }
    const settleReady = (): void => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }
    const onStdout = (chunk: Buffer | string): void => {
      stdoutBuffer = appendTail(stdoutBuffer, String(chunk), STDERR_TAIL_MAX_CHARS * 2)
      if (tryParseReady()) settleReady()
    }
    const onStderr = (chunk: Buffer | string): void => {
      stderrTail = appendTail(stderrTail, String(chunk))
    }
    const onExit = (code: number | null, signal: NodeJS.Signals | null): void => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error(describeLegalworkExit(code, signal, stderrTail)))
    }
    const onError = (error: Error): void => {
      if (settled) return
      settled = true
      cleanup()
      reject(error)
    }
    startedChild.stdout?.on('data', onStdout)
    startedChild.stderr?.on('data', onStderr)
    startedChild.once('exit', onExit)
    startedChild.once('error', onError)
  })
}

function describeLegalworkExit(
  code: number | null,
  signal: NodeJS.Signals | null,
  stderrTail = ''
): string {
  const suffix = stderrTail.trim() ? `\n${stderrTail.trim()}` : ''
  if (signal) return `Legalwork exited during startup with signal ${signal}${suffix}`
  if (typeof code === 'number') return `Legalwork exited during startup with code ${code}${suffix}`
  return `Legalwork exited during startup${suffix}`
}

function describeLegalworkStartupTimeout(stderrTail: string): string {
  const suffix = stderrTail.trim() ? `\n${stderrTail.trim()}` : ''
  return `Legalwork did not report ready within ${LEGALWORK_STARTUP_TIMEOUT_MS}ms${suffix}`
}

async function probeLegalworkHealth(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, {
      signal: AbortSignal.timeout(LEGALWORK_STARTUP_HEALTH_REQUEST_TIMEOUT_MS)
    })
    if (!response.ok) return false
    return isLegalworkHealthResponseBody(await response.text())
  } catch {
    return false
  }
}
