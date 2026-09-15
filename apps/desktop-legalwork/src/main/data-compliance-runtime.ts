import { spawn, spawnSync, execSync, type ChildProcess } from 'node:child_process'
import { existsSync, createWriteStream, rmSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, delimiter } from 'node:path'
import { tmpdir } from 'node:os'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { app } from 'electron'
import type { AppSettingsV1 } from '../shared/app-settings'
import { resolveLegalworkRuntimeSettings } from '../shared/app-settings-provider'
import {
  complianceBundleUrl,
  complianceBundleRuntimeDirName,
  resolveComplianceBundleMachine
} from './data-compliance-bundle-target'

export type DataComplianceStatus =
  | {
      ok: true
      running: boolean
      installing: boolean
      baseUrl: string
      message?: string
    }
  | {
      ok: false
      running: false
      installing: boolean
      baseUrl: string
      message: string
    }

export type DataComplianceRequestResult = {
  ok: boolean
  status: number
  body: string
  contentType?: string
}

export type DataComplianceSubmitPayload = {
  mode: 'review' | 'desensitize'
  documentName?: string
  inputText?: string
  reviewType?: 'document' | 'code'
  outputDir?: string
  outputFormat?: 'md' | 'docx' | 'pdf' | 'txt'
  redactionMode?: 'standard' | 'agent_enhanced'
  file?: {
    name: string
    type?: string
    dataBase64?: string
    filePath?: string
  }
  files?: Array<{
    name: string
    type?: string
    dataBase64?: string
    filePath?: string
  }>
}

const PORT = 5100
const BUNDLED_WEB_ROOT = join('vendor', 'data-compliance-review-codex', 'data-compliance-web')
const DEPENDENCY_MARKER = '.legalwork-deps-installed'
const MIN_PYTHON_VERSION = { major: 3, minor: 11 }
const MAX_PYTHON_VERSION = { major: 3, minor: 12 }
const REQUIRED_PYTHON_IMPORTS = [
  'flask',
  'docx',
  'pypdf',
  'legacy_doc',
  'openai',
  // presidio_analyzer / presidio_anonymizer / spacy / thinc 已从 requirements.txt 移除:
  // 发行版从未启用 presidio 路径,脱敏实际走中文正则 + RedactionDetector。
  // 若这里仍校验它们,会导致 pip 装完仍判"缺包"报错(issue #1086),故一并移除。
  'pandas',
  'openpyxl',
  'xlrd',
  'odf',
  'pptx',
  'fitz',
  'PIL',
  'paddle',
  'paddleocr',
  'pytesseract'
]
const COMMON_BINARY_DIRS = [
  '/opt/homebrew/bin',
  '/usr/local/bin',
  '/usr/bin',
  '/bin'
]

export function parsePythonVersionOutput(output: string): { major: number; minor: number; patch: number } | null {
  const match = output.match(/Python\s+(\d+)\.(\d+)(?:\.(\d+))?/)
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
  if (version.major !== MIN_PYTHON_VERSION.major) return false
  return version.minor >= MIN_PYTHON_VERSION.minor && version.minor <= MAX_PYTHON_VERSION.minor
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function killExistingProcessOnPort(port: number): void {
  try {
    const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
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
  } catch {
    // No process on port; ignore.
  }
}

function runtimeVenvRoot(): string {
  return join(app.getPath('userData'), 'data-compliance', 'python-venv')
}

function pythonExecutable(venvRoot: string = runtimeVenvRoot()): string {
  if (process.platform === 'win32') return join(venvRoot, 'Scripts', 'python.exe')
  return join(venvRoot, 'bin', 'python')
}

// ── 合规环境包(COS 下载,方式B)──
// 不再依赖系统 Python + PyPI 联网;首次用时从腾讯云 COS 下载解压,直接跑脱敏。
const COMPLIANCE_BUNDLE_VERSION =
  process.env.LEGALWORK_COMPLIANCE_BUNDLE_VERSION || '0.3.31'
const COMPLIANCE_BUNDLE_COS_BASE =
  process.env.LEGALWORK_COMPLIANCE_COS_BASE ||
  'https://legalwork-1318565101.cos.ap-guangzhou.myqcloud.com'
const COMPLIANCE_BUNDLE_MARKER = '.legalwork-compliance-ready'

function complianceBundleRoot(machine: string = resolveComplianceBundleMachine()): string {
  return join(
    app.getPath('userData'),
    'data-compliance',
    complianceBundleRuntimeDirName(COMPLIANCE_BUNDLE_VERSION, machine)
  )
}

function complianceBundlePython(bundleRoot: string = complianceBundleRoot()): string {
  if (process.platform === 'win32') return join(bundleRoot, 'python', 'python.exe')
  return join(bundleRoot, 'python', 'bin', 'python3')
}

function complianceBundleModelRoot(bundleRoot: string = complianceBundleRoot()): string {
  return join(bundleRoot, 'paddle-models')
}

function complianceBundleReady(bundleRoot: string = complianceBundleRoot()): boolean {
  return (
    existsSync(join(bundleRoot, COMPLIANCE_BUNDLE_MARKER)) &&
    existsSync(complianceBundlePython(bundleRoot))
  )
}

function complianceBundleSitePackages(bundleRoot: string = complianceBundleRoot()): string {
  if (process.platform === 'win32') return join(bundleRoot, 'python', 'Lib', 'site-packages')
  return join(bundleRoot, 'python', 'lib', 'python3.11', 'site-packages')
}

function canRunSupportedPython(command: string, env: NodeJS.ProcessEnv = buildOcrRuntimeEnvironment()): boolean {
  if (!command.trim()) return false
  if (command.includes(' ') && !existsSync(command)) return false
  try {
    const result = spawnSync(command, ['--version'], {
      env,
      shell: false,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    })
    return result.status === 0 &&
      isSupportedDataCompliancePythonVersion(`${result.stdout ?? ''}\n${result.stderr ?? ''}`)
  } catch {
    return false
  }
}

function findSystemPython(env: NodeJS.ProcessEnv = buildOcrRuntimeEnvironment()): string {
  const explicit = [process.env.COMPLIANCEAI_PYTHON, process.env.PYTHON, process.env.PYTHON3]
    .filter((candidate): candidate is string => Boolean(candidate?.trim()))
  const candidates = process.platform === 'win32'
    ? [...explicit, 'python', 'python3', 'py']
    : [...explicit, 'python3', 'python']

  for (const candidate of candidates) {
    if (canRunSupportedPython(candidate, env)) return candidate
  }

  throw new Error('未找到兼容的数据合规 Python 3.11-3.12 解释器。请重新运行安装，让 legalwork 自动安装内置 Python 3.11。')
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

function platformOcrTags(): string[] {
  const platformAliases: Record<string, string> = {
    darwin: 'mac',
    win32: 'win',
    linux: 'linux'
  }
  const platform = process.platform
  const arch = process.arch
  const system = platformAliases[platform] ?? platform
  return [`${platform}-${arch}`, `${system}-${arch}`, system]
}

function uniqueExistingDirs(paths: string[]): string[] {
  return [...new Set(paths.filter((path) => path && existsSync(path)))]
}

function ocrRuntimeRoots(baseRoots: Array<string | undefined>): string[] {
  const candidates: string[] = []
  for (const root of baseRoots) {
    if (!root) continue
    candidates.push(
      join(root, 'ocr-runtime'),
      join(root, 'vendor', 'ocr-runtime'),
      join(dirname(root), 'ocr-runtime')
    )
  }
  return uniqueExistingDirs(candidates)
}

function ocrRuntimeBinDirs(roots: string[]): string[] {
  const dirs: string[] = []
  for (const root of roots) {
    for (const tag of platformOcrTags()) {
      dirs.push(join(root, tag, 'bin'), join(root, 'bin', tag))
    }
    dirs.push(join(root, 'bin'))
  }
  return uniqueExistingDirs(dirs)
}

function ocrRuntimeTessdataDirs(roots: string[]): string[] {
  const dirs: string[] = []
  for (const root of roots) {
    for (const tag of platformOcrTags()) {
      dirs.push(join(root, tag, 'share', 'tessdata'), join(root, tag, 'tessdata'))
    }
    dirs.push(join(root, 'share', 'tessdata'), join(root, 'tessdata'))
  }
  return uniqueExistingDirs(dirs)
}

function findTesseractCommand(binDirs: string[]): string | undefined {
  const executable = process.platform === 'win32' ? 'tesseract.exe' : 'tesseract'
  for (const dir of binDirs) {
    const candidate = join(dir, executable)
    if (existsSync(candidate)) return candidate
  }
  return undefined
}

function resolveTesseractCommand(env: NodeJS.ProcessEnv): string | undefined {
  if (env.LEGALWORK_TESSERACT_CMD && existsSync(env.LEGALWORK_TESSERACT_CMD)) {
    return env.LEGALWORK_TESSERACT_CMD
  }
  try {
    const command = process.platform === 'win32'
      ? 'where tesseract'
      : 'command -v tesseract'
    const output = execSync(command, {
      encoding: 'utf8',
      env,
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true
    }).split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0]
    return output || undefined
  } catch {
    return undefined
  }
}

function canRunTesseract(env: NodeJS.ProcessEnv): boolean {
  const command = resolveTesseractCommand(env)
  if (!command) return false
  try {
    execSync(`${shellQuote(command)} --version`, {
      encoding: 'utf8',
      env,
      stdio: ['ignore', 'pipe', 'ignore'],
      windowsHide: true
    })
    return true
  } catch {
    return false
  }
}

function findHomebrewExecutable(env: NodeJS.ProcessEnv): string | undefined {
  const candidates = [
    '/opt/homebrew/bin/brew',
    '/usr/local/bin/brew'
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  try {
    const output = execSync('command -v brew', {
      encoding: 'utf8',
      env,
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return output || undefined
  } catch {
    return undefined
  }
}

export function buildOcrRuntimeEnvironment(
  baseRoots: Array<string | undefined> = [],
  baseEnv: NodeJS.ProcessEnv = process.env
): NodeJS.ProcessEnv {
  const roots = ocrRuntimeRoots([
    ...baseRoots,
    process.resourcesPath,
    process.cwd()
  ])
  const ocrBinDirs = ocrRuntimeBinDirs(roots)
  const tesseractCmd = findTesseractCommand(ocrBinDirs)
  const tessdataDir = ocrRuntimeTessdataDirs(roots)[0]
  const paddleModelRoot = roots
    .map((root) => join(root, 'paddle-models'))
    .find((candidate) => existsSync(candidate))
  const current = baseEnv.PATH ?? ''
  return {
    ...baseEnv,
    ...(roots[0] ? { LEGALWORK_OCR_ROOT: roots[0] } : {}),
    ...(paddleModelRoot ? { LEGALWORK_PADDLEOCR_MODEL_ROOT: paddleModelRoot } : {}),
    ...(tesseractCmd ? { LEGALWORK_TESSERACT_CMD: tesseractCmd } : {}),
    ...(tessdataDir && !baseEnv.TESSDATA_PREFIX ? { TESSDATA_PREFIX: tessdataDir } : {}),
    PATH: [current, ...ocrBinDirs, ...COMMON_BINARY_DIRS].filter(Boolean).join(delimiter)
  }
}

async function runCommand(
  command: string,
  args: string[],
  options: { cwd: string; logPath: string; env?: NodeJS.ProcessEnv }
): Promise<void> {
  await mkdir(dirname(options.logPath), { recursive: true }).catch(() => undefined)
  const log = createWriteStream(options.logPath, { flags: 'a' })
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? buildOcrRuntimeEnvironment(),
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    })
    child.stdout?.pipe(log, { end: false })
    child.stderr?.pipe(log, { end: false })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`))
    })
  }).finally(() => log.end())
}

export class DataComplianceRuntime {
  private child: ChildProcess | null = null
  private ensurePromise: Promise<DataComplianceStatus> | null = null
  private ensureAbortController: AbortController | null = null
  private installing = false
  private resolvedWebRoot: string | null = null
  private agentSettingsFingerprint = ''

  constructor(
    private readonly appPath: string,
    private readonly logDir: string,
    private readonly getSettings?: () => Promise<AppSettingsV1>
  ) {}

  get baseUrl(): string {
    return `http://127.0.0.1:${PORT}`
  }

  get webRoot(): string {
    if (!this.resolvedWebRoot) {
      const packagedResourcesRoot = process.resourcesPath ?? dirname(this.appPath)
      const candidates = [
        // Packaged macOS app: resources are unpacked to app.asar.unpacked
        ...(app.isPackaged
          ? [join(packagedResourcesRoot, 'app.asar.unpacked', BUNDLED_WEB_ROOT)]
          : []),
        // Development: directly from appPath
        join(this.appPath, BUNDLED_WEB_ROOT),
        join(process.cwd(), BUNDLED_WEB_ROOT),
        join(dirname(this.appPath), BUNDLED_WEB_ROOT),
        // Fallback packaged path without isPackaged guard
        join(packagedResourcesRoot, 'app.asar.unpacked', BUNDLED_WEB_ROOT)
      ]
      this.resolvedWebRoot = candidates.find((candidate) => existsSync(candidate)) ?? candidates[0]
      console.log('[data-compliance-runtime] resolved webRoot:', this.resolvedWebRoot, {
        appPath: this.appPath,
        resourcesPath: process.resourcesPath,
        isPackaged: app.isPackaged,
        cwd: process.cwd()
      })
    }
    return this.resolvedWebRoot
  }

  get projectRoot(): string {
    return dirname(this.webRoot)
  }

  status(): DataComplianceStatus {
    if (!existsSync(this.webRoot)) {
      return {
        ok: false,
        running: false,
        installing: this.installing,
        baseUrl: this.baseUrl,
        message: '数据合规模块资源缺失，请重新安装 legalwork。'
      }
    }
    return {
      ok: true,
      running: this.child !== null,
      installing: this.installing,
      baseUrl: this.baseUrl
    }
  }

  async ensure(): Promise<DataComplianceStatus> {
    if (!this.ensurePromise) {
      this.ensureAbortController = new AbortController()
      this.ensurePromise = this.ensureInternal().finally(() => {
        this.ensurePromise = null
        this.ensureAbortController = null
      })
    }
    return this.ensurePromise
  }

  async stop(): Promise<void> {
    // Cancel any in-flight ensure cycle so it does not try to start a child
    // after we have requested shutdown.
    this.ensureAbortController?.abort()
    this.ensureAbortController = null

    if (this.ensurePromise) {
      try {
        await Promise.race([
          this.ensurePromise,
          new Promise<void>((resolve) => setTimeout(resolve, 2000))
        ])
      } catch {
        // ignore
      }
      this.ensurePromise = null
    }

    await this.stopChildProcess()
  }

  private async stopChildProcess(): Promise<void> {
    if (!this.child) return
    const child = this.child
    this.child = null

    const exitPromise = new Promise<void>((resolve) => {
      child.once('exit', () => resolve())
    })

    child.kill('SIGTERM')

    // Give the process a short grace period to shut down; if it is still
    // alive, force-kill it so the port is released before the app exits.
    const timeout = setTimeout(() => {
      try {
        child.kill('SIGKILL')
      } catch {
        // ignore
      }
    }, 1500)

    await exitPromise.finally(() => clearTimeout(timeout))
    this.agentSettingsFingerprint = ''
  }

  async request(
    path: string,
    options: { method?: string; body?: string; contentType?: string } = {}
  ): Promise<DataComplianceRequestResult> {
    const ready = await this.ensure()
    if (!ready.ok) {
      return {
        ok: false,
        status: 503,
        body: JSON.stringify({ error: ready.message }),
        contentType: 'application/json'
      }
    }
    const url = new URL(path.startsWith('/') ? path : `/${path}`, this.baseUrl)
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers: options.body
        ? { 'content-type': options.contentType ?? 'application/json' }
        : undefined,
      body: options.body,
      signal: AbortSignal.timeout(30_000)
    })
    const body = await response.text()
    return {
      ok: response.ok,
      status: response.status,
      body,
      contentType: response.headers.get('content-type') ?? undefined
    }
  }

  async submit(payload: DataComplianceSubmitPayload): Promise<DataComplianceRequestResult> {
    const ready = await this.ensure()
    if (!ready.ok) {
      return {
        ok: false,
        status: 503,
        body: JSON.stringify({ error: ready.message }),
        contentType: 'application/json'
      }
    }
    const form = new FormData()
    if (payload.documentName?.trim()) form.set('document_name', payload.documentName.trim())
    if (payload.inputText?.trim()) form.set('input_text', payload.inputText.trim())
    if (payload.mode === 'review') form.set('review_type', payload.reviewType ?? 'document')
    if (payload.mode === 'desensitize' && payload.outputDir?.trim()) {
      form.set('output_dir', payload.outputDir.trim())
    }
    if (payload.mode === 'desensitize' && payload.outputFormat?.trim()) {
      form.set('output_format', payload.outputFormat.trim())
    }
    if (payload.mode === 'desensitize') {
      form.set('redaction_mode', payload.redactionMode ?? 'standard')
    }
    if (payload.file) {
      const bytes = payload.file.filePath
        ? await readFile(payload.file.filePath)
        : Buffer.from(payload.file.dataBase64 ?? '', 'base64')
      const blob = new Blob([bytes], { type: payload.file.type || 'application/octet-stream' })
      form.set('file', blob, payload.file.name || 'upload')
    }
    const endpoint = payload.mode === 'review' ? '/api/upload' : '/api/desensitize'
    const response = await fetch(new URL(endpoint, this.baseUrl), {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(30_000)
    })
    const body = await response.text()
    return {
      ok: response.ok,
      status: response.status,
      body,
      contentType: response.headers.get('content-type') ?? undefined
    }
  }

  private async ensureInternal(): Promise<DataComplianceStatus> {
    console.log('[data-compliance-runtime] ensureInternal start, webRoot:', this.webRoot)
    if (this.ensureAbortController?.signal.aborted) {
      return {
        ok: false,
        running: false,
        installing: false,
        baseUrl: this.baseUrl,
        message: '数据合规运行时已停止。'
      }
    }
    if (!existsSync(this.webRoot)) {
      console.error('[data-compliance-runtime] webRoot does not exist:', this.webRoot)
      return this.status()
    }
    await this.restartChildForChangedAgentSettings()
    if (await this.probe()) {
      return {
        ok: true,
        running: true,
        installing: false,
        baseUrl: this.baseUrl
      }
    }
    try {
      console.log('[data-compliance-runtime] ensuring python env...')
      await this.ensurePythonEnvironment()
      if (this.ensureAbortController?.signal.aborted) {
        return {
          ok: false,
          running: false,
          installing: false,
          baseUrl: this.baseUrl,
          message: '数据合规运行时已停止。'
        }
      }
      console.log('[data-compliance-runtime] starting process...')
      await this.startProcess()
      for (let attempt = 0; attempt < 80; attempt += 1) {
        if (this.ensureAbortController?.signal.aborted) {
          return {
            ok: false,
            running: false,
            installing: false,
            baseUrl: this.baseUrl,
            message: '数据合规运行时已停止。'
          }
        }
        if (await this.probe()) {
          return {
            ok: true,
            running: true,
            installing: false,
            baseUrl: this.baseUrl
          }
        }
        await sleep(250)
      }
      return {
        ok: false,
        running: false,
        installing: false,
        baseUrl: this.baseUrl,
        message: '数据合规后端启动超时。'
      }
    } catch (error) {
      console.error('[data-compliance-runtime] ensureInternal error:', error)
      return {
        ok: false,
        running: false,
        installing: false,
        baseUrl: this.baseUrl,
        message: error instanceof Error ? error.message : String(error)
      }
    }
  }

  private async probe(): Promise<boolean> {
    try {
      const response = await fetch(new URL('/api/history', this.baseUrl), { method: 'GET' })
      return response.ok
    } catch {
      return false
    }
  }

  private async ensurePythonEnvironment(): Promise<void> {
    // 方式B:优先用从腾讯云 COS 下载的合规环境包(无需系统 Python / PyPI / 外网)。
    if (complianceBundleReady()) {
      await this.ensureOcrRuntime(
        complianceBundlePython(),
        join(this.logDir, 'data-compliance-runtime.log'),
        this.buildComplianceBundleEnv()
      )
      return
    }
    try {
      await this.ensureComplianceBundle()
      await this.ensureOcrRuntime(
        complianceBundlePython(),
        join(this.logDir, 'data-compliance-runtime.log'),
        this.buildComplianceBundleEnv()
      )
      return
    } catch (error) {
      console.warn('[data-compliance-runtime] COS 合规环境包不可用,回落系统 Python 路径:', error)
      // 回落:老逻辑(系统 Python + venv + pip)。若 COS/外网均不可达,脱敏走正则兜底。
      await this.ensurePythonEnvironmentLegacy()
    }
  }

  // 从腾讯云 COS 下载并解压合规环境包(内置 python + 依赖 + paddle-models)。方式B。
  private async ensureComplianceBundle(): Promise<void> {
    const machine = process.env.LEGALWORK_COMPLIANCE_MACHINE || resolveComplianceBundleMachine()
    const bundleRoot = complianceBundleRoot(machine)
    if (complianceBundleReady(bundleRoot)) return
    const marker = join(bundleRoot, COMPLIANCE_BUNDLE_MARKER)
    const url = complianceBundleUrl(
      COMPLIANCE_BUNDLE_COS_BASE,
      COMPLIANCE_BUNDLE_VERSION,
      machine
    )
    const logPath = join(this.logDir, 'data-compliance-runtime.log')
    const tarPath = join(tmpdir(), `legalwork-compliance-${machine}-v${COMPLIANCE_BUNDLE_VERSION}.tar.gz`)
    this.installing = true
    try {
      await mkdir(bundleRoot, { recursive: true })
      const res = await fetch(url)
      if (!res.ok) throw new Error(`下载合规环境包失败: HTTP ${res.status}`)
      if (!res.body) throw new Error('下载合规环境包失败: 响应体为空')
      await pipeline(
        Readable.fromWeb(res.body as Parameters<typeof Readable.fromWeb>[0]),
        createWriteStream(tarPath)
      )
      await new Promise<void>((resolve, reject) => {
        const child = spawn('tar', ['-xzf', tarPath, '-C', bundleRoot], { shell: false })
        child.on('error', reject)
        child.on('exit', (code) =>
          code === 0 ? resolve() : reject(new Error(`环境包解压失败(exit ${code})`))
        )
      })
      await writeFile(marker, new Date().toISOString(), 'utf-8')
    } catch (error) {
      await writeFile(
        logPath,
        `[${new Date().toISOString()}] 合规环境包下载/解压失败: ${error instanceof Error ? error.message : String(error)}\n`,
        { flag: 'a' }
      ).catch(() => {})
      throw error
    } finally {
      rmSync(tarPath, { force: true })
      this.installing = false
    }
  }

  private buildComplianceBundleEnv(bundleRoot: string = complianceBundleRoot()): NodeJS.ProcessEnv {
    return {
      ...buildOcrRuntimeEnvironment([this.webRoot, this.projectRoot]),
      PYTHONHOME: join(bundleRoot, 'python'),
      PYTHONPATH: complianceBundleSitePackages(bundleRoot),
      LEGALWORK_PADDLEOCR_MODEL_ROOT: complianceBundleModelRoot(bundleRoot)
    }
  }

  // 旧流程:系统 Python + venv + pip(PyPI)。仅在 COS 环境包不可用时回落。
  private async ensurePythonEnvironmentLegacy(): Promise<void> {
    const venvRoot = runtimeVenvRoot()
    const python = pythonExecutable(venvRoot)
    const marker = join(venvRoot, DEPENDENCY_MARKER)
    const logPath = join(this.logDir, 'data-compliance-runtime.log')
    const env = buildOcrRuntimeEnvironment([this.webRoot, this.projectRoot])
    if (existsSync(python) && !canRunSupportedPython(python, env)) {
      rmSync(venvRoot, { recursive: true, force: true })
      rmSync(marker, { force: true })
    }
    if (!existsSync(python)) {
      this.installing = true
      try {
        await mkdir(dirname(venvRoot), { recursive: true })
        await runCommand(findSystemPython(env), ['-m', 'venv', venvRoot], {
          cwd: this.webRoot,
          logPath,
          env
        })
      } finally {
        this.installing = false
      }
    }
    if (!canRunSupportedPython(python, env)) {
      throw new Error('数据合规虚拟环境不是 Python 3.11-3.12，无法稳定安装 PaddleOCR、旧版 DOC 解析等依赖。')
    }
    if (!existsSync(marker) || !(await this.hasRequiredPythonPackages(python, env))) {
      this.installing = true
      try {
        await runCommand(python, ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
          cwd: this.webRoot,
          logPath,
          env
        })
        if (!(await this.hasRequiredPythonPackages(python, env))) {
          rmSync(marker, { force: true })
          throw new Error('数据合规 Python 依赖安装后仍无法导入，请检查安装日志或重新安装应用。')
        }
        await writeFile(marker, new Date().toISOString(), 'utf-8')
      } finally {
        this.installing = false
      }
    }
    await this.ensureOcrRuntime(python, logPath, env)
  }

  private async hasRequiredPythonPackages(python: string, env: NodeJS.ProcessEnv): Promise<boolean> {
    const script = REQUIRED_PYTHON_IMPORTS.map((pkg) => `import ${pkg}`).join('\n')
    try {
      await runCommand(python, ['-c', script], {
        cwd: this.webRoot,
        logPath: join(this.logDir, 'data-compliance-runtime.log'),
        env
      })
      return true
    } catch {
      return false
    }
  }

  private async ensureOcrRuntime(python: string, logPath: string, env: NodeJS.ProcessEnv): Promise<void> {
    try {
      await runCommand(
        python,
        [
          '-c',
          'import json\nfrom scripts.ocr_text import ocr_backend_status\nprint(json.dumps(ocr_backend_status(), ensure_ascii=False))'
        ],
        { cwd: this.webRoot, logPath, env }
      )
    } catch {
      await writeFile(
        logPath,
        `[${new Date().toISOString()}] OCR backend diagnostic failed; PaddleOCR is the preferred backend and task-level fallbacks will be used if OCR cannot run.\n`,
        { flag: 'a' }
      ).catch(() => undefined)
    }
  }

  private async startProcess(): Promise<void> {
    if (this.child) return
    killExistingProcessOnPort(PORT)
    const logPath = join(this.logDir, 'data-compliance-runtime.log')
    const log = createWriteStream(logPath, { flags: 'a' })

    const agentConfig = await this.resolveAgentEnvironment()
    const agentEnv = agentConfig.env

    const usesBundle = complianceBundleReady()
    const venvPython = usesBundle ? complianceBundlePython() : pythonExecutable()
    const baseEnv = usesBundle
      ? this.buildComplianceBundleEnv()
      : buildOcrRuntimeEnvironment([this.webRoot, this.projectRoot])
    const child = spawn(venvPython, ['server_entry.py', '--port', String(PORT)], {
      cwd: this.webRoot,
      env: {
        ...baseEnv,
        ...agentEnv,
        COMPLIANCEAI_PYTHON: venvPython,
        COMPLIANCEAI_LOG_PATH: logPath
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true
    })

    // If ensure was aborted while we were spawning, kill the new child
    // immediately so it does not outlive the requested shutdown.
    if (this.ensureAbortController?.signal.aborted) {
      try {
        child.kill('SIGTERM')
      } catch {
        // ignore
      }
      log.end()
      return
    }

    child.stdout?.pipe(log, { end: false })
    child.stderr?.pipe(log, { end: false })
    child.on('exit', () => {
      if (this.child === child) this.child = null
      log.end()
    })
    child.on('error', () => {
      if (this.child === child) this.child = null
      log.end()
    })
    this.child = child
    this.agentSettingsFingerprint = agentConfig.fingerprint
  }

  private async restartChildForChangedAgentSettings(): Promise<void> {
    if (!this.child || !this.getSettings) return
    const next = await this.resolveAgentEnvironment()
    if (!this.agentSettingsFingerprint || next.fingerprint === this.agentSettingsFingerprint) return
    console.log('[data-compliance-runtime] agent model/provider settings changed; restarting worker')
    await this.stopChildProcess()
  }

  private async resolveAgentEnvironment(): Promise<{
    env: NodeJS.ProcessEnv
    fingerprint: string
  }> {
    const env: NodeJS.ProcessEnv = {}
    if (!this.getSettings) return { env, fingerprint: '' }
    try {
      const settings = await this.getSettings()
      const runtime = resolveLegalworkRuntimeSettings(settings)
      const apiKey = runtime.apiKey?.trim() ?? ''
      const baseUrl = runtime.baseUrl?.trim() ?? ''
      const model = runtime.model?.trim() ?? ''
      if (apiKey) env.LEGALWORK_API_KEY = apiKey
      if (baseUrl) env.LEGALWORK_BASE_URL = baseUrl
      if (model) env.LEGALWORK_MODEL = model
      return {
        env,
        fingerprint: JSON.stringify({
          authMode: runtime.authMode,
          apiKey,
          baseUrl,
          model
        })
      }
    } catch (error) {
      // Best-effort: proceed without agent env if settings cannot be loaded.
      console.warn('[data-compliance-runtime] failed to read agent settings:', error)
      return { env, fingerprint: '' }
    }
  }
}
