import { spawn, spawnSync, execSync, type ChildProcess } from 'node:child_process'
import { existsSync, createWriteStream, rmSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, delimiter } from 'node:path'
import { app } from 'electron'
import type { AppSettingsV1 } from '../shared/app-settings'
import { resolveLegalworkRuntimeSettings } from '../shared/app-settings-provider'

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
const MIN_PYTHON_VERSION = { major: 3, minor: 10 }
const MAX_PYTHON_VERSION = { major: 3, minor: 12 }
const REQUIRED_PYTHON_IMPORTS = [
  'flask',
  'docx',
  'pypdf',
  'openai',
  'presidio_analyzer',
  'presidio_anonymizer',
  'spacy',
  'thinc',
  'pandas',
  'openpyxl',
  'xlrd',
  'odf',
  'pptx',
  'fitz',
  'PIL'
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

  throw new Error('未找到兼容的数据合规 Python 3.10-3.12 解释器。请重新运行安装，让 legalwork 自动安装内置 Python 3.11。')
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
      throw new Error('数据合规虚拟环境不是 Python 3.10-3.12，无法稳定安装 PaddleOCR 等依赖。')
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

    const agentEnv: NodeJS.ProcessEnv = {}
    if (this.getSettings) {
      try {
        const settings = await this.getSettings()
        const runtime = resolveLegalworkRuntimeSettings(settings)
        if (runtime.apiKey?.trim()) {
          agentEnv.LEGALWORK_API_KEY = runtime.apiKey.trim()
        }
        if (runtime.baseUrl?.trim()) {
          agentEnv.LEGALWORK_BASE_URL = runtime.baseUrl.trim()
        }
        if (runtime.model?.trim()) {
          agentEnv.LEGALWORK_MODEL = runtime.model.trim()
        }
      } catch (error) {
        // Best-effort: proceed without agent env if settings cannot be loaded.
        console.warn('[data-compliance-runtime] failed to read agent settings:', error)
      }
    }

    const venvPython = pythonExecutable()
    const child = spawn(venvPython, ['server_entry.py', '--port', String(PORT)], {
      cwd: this.webRoot,
      env: {
        ...buildOcrRuntimeEnvironment([this.webRoot, this.projectRoot]),
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
  }
}
