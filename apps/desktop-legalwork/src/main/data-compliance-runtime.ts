import { spawn, execSync, type ChildProcess } from 'node:child_process'
import { existsSync, createWriteStream } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, delimiter } from 'node:path'
import { app } from 'electron'
import type { AppSettingsV1 } from '../shared/app-settings'
import { getLegalworkRuntimeSettings } from '../shared/app-settings-legalwork'

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
  file?: {
    name: string
    type?: string
    dataBase64: string
  }
}

const PORT = 5100
const BUNDLED_WEB_ROOT = join('vendor', 'data-compliance-review-codex', 'data-compliance-web')
const DEPENDENCY_MARKER = '.legalwork-deps-installed'

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

function pythonExecutable(webRoot: string): string {
  if (process.platform === 'win32') return join(webRoot, 'venv', 'Scripts', 'python.exe')
  return join(webRoot, 'venv', 'bin', 'python')
}

function findSystemPython(): string {
  return process.env.PYTHON || process.env.PYTHON3 || 'python3'
}

function appendPathForPython(): NodeJS.ProcessEnv {
  const extra = [
    '/opt/homebrew/bin',
    '/usr/local/bin',
    '/usr/bin',
    '/bin'
  ]
  const current = process.env.PATH ?? ''
  return {
    ...process.env,
    PATH: [current, ...extra].filter(Boolean).join(delimiter)
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
      env: options.env ?? appendPathForPython(),
      stdio: ['ignore', 'pipe', 'pipe']
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
      this.ensurePromise = this.ensureInternal().finally(() => {
        this.ensurePromise = null
      })
    }
    return this.ensurePromise
  }

  async stop(): Promise<void> {
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
      body: options.body
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
    if (payload.file) {
      const bytes = Buffer.from(payload.file.dataBase64, 'base64')
      const blob = new Blob([bytes], { type: payload.file.type || 'application/octet-stream' })
      form.set('file', blob, payload.file.name || 'upload')
    }
    const endpoint = payload.mode === 'review' ? '/api/upload' : '/api/desensitize'
    const response = await fetch(new URL(endpoint, this.baseUrl), {
      method: 'POST',
      body: form
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
      console.log('[data-compliance-runtime] starting process...')
      await this.startProcess()
      for (let attempt = 0; attempt < 80; attempt += 1) {
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
    const python = pythonExecutable(this.webRoot)
    const marker = join(this.webRoot, DEPENDENCY_MARKER)
    const logPath = join(this.logDir, 'data-compliance-runtime.log')
    if (!existsSync(python)) {
      this.installing = true
      try {
        await runCommand(findSystemPython(), ['-m', 'venv', 'venv'], {
          cwd: this.webRoot,
          logPath
        })
      } finally {
        this.installing = false
      }
    }
    if (!existsSync(marker)) {
      this.installing = true
      try {
        await runCommand(python, ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
          cwd: this.webRoot,
          logPath
        })
        await writeFile(marker, new Date().toISOString(), 'utf-8')
      } finally {
        this.installing = false
      }
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
        const runtime = getLegalworkRuntimeSettings(settings)
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

    const child = spawn(pythonExecutable(this.webRoot), ['server_entry.py', '--port', String(PORT)], {
      cwd: this.webRoot,
      env: {
        ...appendPathForPython(),
        ...agentEnv,
        COMPLIANCEAI_PYTHON: pythonExecutable(this.webRoot),
        COMPLIANCEAI_LOG_PATH: logPath
      },
      stdio: ['ignore', 'pipe', 'pipe']
    })
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
