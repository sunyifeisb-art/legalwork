import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, extname, isAbsolute, join, normalize, relative as pathRelative, resolve } from 'node:path'
import { Readable } from 'node:stream'
import {
  describePipIndexes,
  pipIndexArgs,
  resolvePipIndexCandidates,
  runPipInstallWithFallback,
  selectReachablePipIndexes,
  type PipIndexCandidate
} from '../shared/python-install-sources.js'

const DATA_COMPLIANCE_VENV_DIR_NAME = 'python-venv'
const DATA_COMPLIANCE_CORE_DEPENDENCY_MARKER = '.legalwork-core-deps-v2-installed'
const MIN_DATA_COMPLIANCE_PYTHON = { major: 3, minor: 10 }
const MAX_DATA_COMPLIANCE_PYTHON = { major: 3, minor: 12 }
const PYTHON_IMPORT_TIMEOUT_MS = 8_000
const PYTHON_VERSION_TIMEOUT_MS = 3_000

function resolveDataComplianceVenvDir(dataDir: string): string {
  return join(dataDir, 'data-compliance', DATA_COMPLIANCE_VENV_DIR_NAME)
}

function resolveDataComplianceVenvPython(venvDir: string, platform?: NodeJS.Platform): string {
  return (platform ?? process.platform) === 'win32'
    ? join(venvDir, 'Scripts', 'python.exe')
    : join(venvDir, 'bin', 'python')
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
  if (version.major !== MIN_DATA_COMPLIANCE_PYTHON.major) return false
  return version.minor >= MIN_DATA_COMPLIANCE_PYTHON.minor && version.minor <= MAX_DATA_COMPLIANCE_PYTHON.minor
}

export type DataComplianceTaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export type DataComplianceTask = {
  id: string
  document_name: string
  product_type: 'review' | 'desensitize'
  review_type?: 'document' | 'code'
  input_type: 'file' | 'text' | 'batch'
  input_path: string
  input_manifest_path?: string
  input_files?: DataComplianceStoredInputFile[]
  original_filename?: string
  stored_filename?: string
  output_dir?: string
  output_format?: 'md' | 'docx' | 'pdf' | 'txt'
  redaction_mode?: 'standard' | 'agent_enhanced'
  status: DataComplianceTaskStatus
  created_at: string
  completed_at?: string
  progress?: DataComplianceProgress
  result?: Record<string, string>
  error?: string
  error_detail?: string
}

export type DataComplianceProgress = {
  step: number
  total_steps: number
  message: string
  status?: 'running' | 'completed' | 'error'
  percent?: number
  detail?: Record<string, unknown>
}

export type DataComplianceCreateTaskInput = {
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

export type DataComplianceStoredInputFile = {
  name: string
  type?: string
  path: string
  stored_filename: string
}

export type DataComplianceEnvironmentCheckResult =
  | { ok: true; python: string }
  | { ok: false; reason: string; fix?: string }

export type DataComplianceFileKey =
  | 'report'
  | 'report_md'
  | 'remediation'
  | 'evidence'
  | 'sdk_pack'
  | 'cross_border_pack'
  | 'privacy_pack'
  | 'code_suggestions'
  | 'desensitized_output'
  | 'desensitization_report'
  | 'desensitization_report_md'
  | 'retention_note'
  | 'subject_mapping_md'
  | 'subject_mapping_json'

const CORE_REQUIRED_PYTHON_PACKAGES = [
  'flask',
  'docx',
  'fitz',
  'openai',
  'openpyxl',
  'paddle',
  'paddleocr',
  'pptx',
  'pypdf',
  'pandas',
  'PIL'
]

const OPTIONAL_OCR_PYTHON_PACKAGES = [
  'pytesseract'
]

const PYTHON_COMMAND_CANDIDATES = process.platform === 'win32'
  ? ['python', 'python3', 'py']
  : ['python3', 'python']

export function dataCompliancePythonPathEntries(platform: NodeJS.Platform = process.platform): string[] {
  if (platform === 'darwin') {
    return [
      '/opt/homebrew/bin',
      '/usr/local/bin',
      '/Library/Frameworks/Python.framework/Versions/Current/bin',
      '/usr/bin',
      '/bin',
      '/usr/sbin',
      '/sbin'
    ]
  }
  if (platform === 'win32') return []
  return ['/usr/local/bin', '/usr/bin', '/bin']
}

export function buildDataCompliancePythonEnv(
  env: NodeJS.ProcessEnv = process.env,
  platform: NodeJS.Platform = process.platform
): NodeJS.ProcessEnv {
  const delimiter = platform === 'win32' ? ';' : ':'
  const pathKey = platform === 'win32'
    ? Object.keys(env).find((key) => key.toLowerCase() === 'path') ?? 'Path'
    : 'PATH'
  const existingPath = env[pathKey] ?? ''
  const entries = [
    existingPath,
    ...dataCompliancePythonPathEntries(platform)
  ].filter(Boolean)
  return {
    ...env,
    ...(env.LEGALWORK_BUNDLED_COMPLIANCE_PYTHONHOME
      ? { PYTHONHOME: env.LEGALWORK_BUNDLED_COMPLIANCE_PYTHONHOME }
      : {}),
    [pathKey]: entries.join(delimiter)
  }
}

const REVIEW_FILE_KEYS: DataComplianceFileKey[] = [
  'report',
  'report_md',
  'remediation',
  'evidence',
  'sdk_pack',
  'cross_border_pack',
  'privacy_pack',
  'code_suggestions'
]

const DESENSITIZE_FILE_KEYS: DataComplianceFileKey[] = [
  'desensitized_output',
  'desensitization_report',
  'desensitization_report_md',
  'retention_note',
  'subject_mapping_md',
  'subject_mapping_json'
]

function nowIso(): string {
  return new Date().toISOString()
}

function shortId(): string {
  return createHash('sha256')
    .update(`${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 10)
}

function safeFilename(name: string): string {
  const base = name.trim() || 'upload'
  const stem = base.replace(/\.[^.]+$/, '')
  const suffix = base.slice(stem.length)
  const safeStem = stem.replace(/[^\w一-龥.-]+/g, '_').replace(/^[._]+|[._]+$/g, '') || 'upload'
  return `${safeStem}${suffix.toLowerCase() || '.txt'}`
}

function uniqueSafeFilename(name: string, used: Set<string>): string {
  const safe = safeFilename(name)
  const dotIndex = safe.lastIndexOf('.')
  const stem = dotIndex > 0 ? safe.slice(0, dotIndex) : safe
  const suffix = dotIndex > 0 ? safe.slice(dotIndex) : ''
  let candidate = safe
  let counter = 2
  while (used.has(candidate.toLowerCase())) {
    candidate = `${stem}_${counter}${suffix}`
    counter += 1
  }
  used.add(candidate.toLowerCase())
  return candidate
}

/** Verify that a resolved path stays inside a root directory. */
function isInsideDir(candidate: string, rootDir: string): boolean {
  const resolvedCandidate = resolve(candidate)
  const resolvedRoot = resolve(rootDir)
  if (resolvedCandidate === resolvedRoot) return true
  const rel = pathRelative(resolvedRoot, resolvedCandidate)
  return !rel.startsWith('..') && !isAbsolute(rel)
}

function isValidTaskId(taskId: string): boolean {
  return /^[a-f0-9]{10}$/.test(taskId)
}

export class DataComplianceTaskService {
  private readonly tasksDir: string
  private readonly venvDir: string
  private pythonBin: string | null = null
  private readonly webRoot: string
  private readonly logDir: string
  private readonly runningChildren = new Map<string, ReturnType<typeof spawn>>()

  constructor(input: { dataDir: string; webRoot: string; logDir: string }) {
    this.tasksDir = join(input.dataDir, 'data-compliance', 'tasks')
    this.venvDir = resolveDataComplianceVenvDir(input.dataDir)
    this.webRoot = input.webRoot
    this.logDir = input.logDir
    this.pythonBin = this.resolvePythonExecutable()
    mkdirSync(this.tasksDir, { recursive: true })
    this.markInterruptedTasks()
  }

  private venvPythonPath(): string {
    return resolveDataComplianceVenvPython(this.venvDir, process.platform)
  }

  private standalonePythonPath(): string {
    const root = join(dirname(this.venvDir), 'python-standalone')
    return process.platform === 'win32'
      ? join(root, 'python.exe')
      : join(root, 'bin', 'python3')
  }

  private resolvePythonExecutable(): string | null {
    const venvPython = this.venvPythonPath()
    if (this.canRunPython(venvPython)) return venvPython
    const standalonePython = this.standalonePythonPath()
    if (this.canRunPython(standalonePython)) return standalonePython

    const explicitCandidates = [
      process.env.COMPLIANCEAI_PYTHON,
      process.env.PYTHON,
      process.env.PYTHON3
    ].filter((candidate): candidate is string => Boolean(candidate?.trim()))

    const candidates = [
      ...explicitCandidates,
      ...PYTHON_COMMAND_CANDIDATES
    ]

    for (const candidate of candidates) {
      const resolved = this.tryResolvePython(candidate)
      if (resolved) return resolved
    }
    return null
  }

  private tryResolvePython(candidate: string): string | null {
    const value = candidate.trim()
    if (!value) return null
    if (isAbsolute(value) && !existsSync(value)) return null
    return this.canRunPython(value) ? value : null
  }

  private canRunPython(command: string): boolean {
    try {
      const result = spawnSync(command, ['--version'], {
        env: buildDataCompliancePythonEnv(),
        shell: false,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: PYTHON_VERSION_TIMEOUT_MS,
        windowsHide: true
      })
      return result.status === 0 &&
        isSupportedDataCompliancePythonVersion(`${result.stdout ?? ''}\n${result.stderr ?? ''}`)
    } catch {
      return false
    }
  }

  async checkEnvironment(): Promise<DataComplianceEnvironmentCheckResult> {
    this.pythonBin = this.resolvePythonExecutable()
    if (!this.pythonBin) {
      return {
        ok: false,
        reason: '未找到 Python 3.10-3.12 解释器',
        fix: '请点击“重试”让 legalwork 自动安装内置 Python 3.11。'
      }
    }

    try {
      const result = await this.runPython(['--version'])
      if (result.exitCode !== 0) {
        return { ok: false, reason: `Python 无法运行: ${result.stderr}` }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { ok: false, reason: `Python 检测失败: ${message}` }
    }

    try {
      await this.ensurePythonEnvironment()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        ok: false,
        reason: `Python 环境准备失败: ${message}`,
        fix: '请点击“重试”让 legalwork 自动重建数据合规 Python 环境，并检查网络是否允许下载依赖。'
      }
    }

    // ensurePythonEnvironment is the single source of truth for dependency
    // installation and verification. Re-importing every core package here makes
    // each status request start PaddleOCR again, which can exceed the desktop
    // client's probe timeout and falsely trigger a destructive reinstall.
    return { ok: true, python: this.pythonBin }
  }

  private async ensurePythonEnvironment(): Promise<void> {
    // Release builds can carry a verified, relocatable Python distribution
    // containing every data-compliance dependency. Use it in place instead of
    // creating a user venv and running pip on first launch.
    if (
      process.env.LEGALWORK_BUNDLED_COMPLIANCE_RUNTIME === '1' &&
      this.pythonBin === process.env.COMPLIANCEAI_PYTHON &&
      this.pythonBin &&
      this.canRunPython(this.pythonBin)
    ) {
      return
    }

    // Paddle 2.x/3.x 混装残留（旧 paddle 孤儿文件，pip 无法清理）会让
    // import paddle 持续失败，表现为"缺少 paddle/paddleocr"。自动重建一次
    // venv 即可修复，用户无需手动删除目录。
    let rebuildCount = 0
    for (;;) {
      const venvPython = this.venvPythonPath()
      const requirementsPath = join(this.webRoot, 'requirements.txt')
      const markerPath = join(this.venvDir, DATA_COMPLIANCE_CORE_DEPENDENCY_MARKER)

      if (!this.canRunPython(venvPython)) {
        const basePython = this.pythonBin
        if (!basePython) {
          throw new Error('未找到可用的 Python 解释器来创建 venv')
        }
        const result = await this.runCommand(basePython, ['-m', 'venv', this.venvDir])
        if (result.exitCode !== 0) {
          throw new Error(`创建 venv 失败: ${result.stderr || result.stdout}`)
        }
      }

      this.pythonBin = venvPython

      if (!existsSync(requirementsPath)) return
      if (existsSync(markerPath)) {
        // This versioned marker is written only after every core import passes.
        // Trust it on status probes: cold Paddle/PaddleOCR imports are expensive
        // and concurrent renderer probes can otherwise time out and start a
        // reinstall that tries to delete loaded Windows DLLs.
        return
      }

      const missing = await this.findMissingPackages(CORE_REQUIRED_PYTHON_PACKAGES, venvPython)
      if (missing.length === 0) {
        writeFileSync(markerPath, JSON.stringify({
          checked_at: nowIso(),
          core_packages: CORE_REQUIRED_PYTHON_PACKAGES,
          optional_ocr_packages: OPTIONAL_OCR_PYTHON_PACKAGES
        }, null, 2), 'utf-8')
        return
      }

      // PaddlePaddle/PaddleOCR are large and a slow or blocked index is the
      // most common reason this fails. Unreachable indexes are probed out
      // first; the retry policy itself lives in python-install-sources so the
      // desktop installer and this service cannot drift apart.
      const pipCandidates = await selectReachablePipIndexes(resolvePipIndexCandidates())
      const pipInstall = async (
        candidate: PipIndexCandidate
      ): Promise<{ exitCode: number | null; stderr: string }> => {
        const result = await this.runCommand(
          venvPython,
          ['-m', 'pip', 'install', '-r', requirementsPath, ...pipIndexArgs(candidate)],
          { cwd: this.webRoot }
        )
        return { exitCode: result.exitCode, stderr: result.stderr || result.stdout || '' }
      }

      const pipOutcome = await runPipInstallWithFallback({
        candidates: pipCandidates,
        attempt: pipInstall,
        succeeded: (result) => result.exitCode === 0
      })
      if (!pipOutcome.succeededWith) {
        throw new Error(
          `安装依赖失败: ${pipOutcome.result?.stderr ?? ''}. ` +
          `已依次尝试 ${describePipIndexes(pipOutcome.attempted)} 均未成功，请检查网络后重试，` +
          '或设置 LEGALWORK_PIP_INDEX_URL 指定可用的镜像源。'
        )
      }

      const stillMissing = await this.findMissingPackages(CORE_REQUIRED_PYTHON_PACKAGES, venvPython)
      if (stillMissing.length === 0) {
        writeFileSync(markerPath, JSON.stringify({
          checked_at: nowIso(),
          core_packages: CORE_REQUIRED_PYTHON_PACKAGES,
          optional_ocr_packages: OPTIONAL_OCR_PYTHON_PACKAGES
        }, null, 2), 'utf-8')
        return
      }
      // paddle/paddleocr 装完仍 import 失败 → 探测是否混装，混装则自动重建 venv
      if (rebuildCount === 0 && stillMissing.includes('paddle')) {
        const probe = await this.runCommand(venvPython, ['-c', 'import paddle'], {
          timeoutMs: PYTHON_IMPORT_TIMEOUT_MS
        })
        const probeText = `${probe.stdout}\n${probe.stderr}`
        if (/cannot import name [\s\S]{0,120}bwd_graph_utils|capture_backward_subgraph_guard/.test(probeText)) {
          rebuildCount += 1
          await rm(this.venvDir, { recursive: true, force: true })
          continue
        }
      }
      throw new Error(`安装依赖后仍缺少核心包: ${stillMissing.join(', ')}`)
    }
  }

  private async findMissingPackages(packages: string[], python: string): Promise<string[]> {
    const missing: string[] = []
    for (const pkg of packages) {
      const result = await this.runCommand(python, ['-c', `import ${pkg}`], {
        timeoutMs: PYTHON_IMPORT_TIMEOUT_MS
      })
      if (result.exitCode !== 0) {
        missing.push(pkg)
      }
    }
    return missing
  }

  private runPython(args: string[]): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    const python = this.pythonBin
    if (!python) {
      return Promise.reject(new Error('Python executable not found'))
    }
    return this.runCommand(python, args)
  }

  private runCommand(
    command: string,
    args: string[],
    options: { cwd?: string; timeoutMs?: number } = {}
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options.cwd,
        env: buildDataCompliancePythonEnv(),
        windowsHide: true
      })
      let settled = false
      const finish = (value: { exitCode: number; stdout: string; stderr: string }): void => {
        if (settled) return
        settled = true
        if (timeout) clearTimeout(timeout)
        resolve(value)
      }
      const timeout = options.timeoutMs
        ? setTimeout(() => {
            child.kill('SIGKILL')
          }, options.timeoutMs)
        : null
      let stdout = ''
      let stderr = ''
      child.stdout?.on('data', (chunk) => {
        stdout += String(chunk)
      })
      child.stderr?.on('data', (chunk) => {
        stderr += String(chunk)
      })
      child.on('error', (error) => {
        if (settled) return
        settled = true
        if (timeout) clearTimeout(timeout)
        reject(error)
      })
      child.on('exit', (exitCode) => {
        finish({ exitCode: exitCode ?? 1, stdout, stderr })
      })
    })
  }

  private markInterruptedTasks(): void {
    let entries: Array<{ isDirectory: () => boolean; name: string }>
    try {
      entries = readdirSync(this.tasksDir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const task = this.readTaskStateSync(entry.name)
      if (!task) continue
      if (task.status !== 'pending' && task.status !== 'running') continue

      task.status = 'failed'
      task.error = '任务已中断，请重新提交。'
      task.completed_at = nowIso()
      task.progress = {
        step: task.progress?.step ?? 0,
        total_steps: task.progress?.total_steps ?? (task.product_type === 'desensitize' ? 4 : 11),
        message: '任务已中断，请重新提交。',
        status: 'error'
      }
      this.writeTaskState(task)
    }
  }

  private taskDir(taskId: string): string {
    return join(this.tasksDir, taskId)
  }

  private taskStatePath(taskId: string): string {
    return join(this.taskDir(taskId), 'task_state.json')
  }

  private async readTaskState(taskId: string): Promise<DataComplianceTask | null> {
    const path = this.taskStatePath(taskId)
    try {
      const text = await readFile(path, 'utf-8')
      return JSON.parse(text) as DataComplianceTask
    } catch {
      return null
    }
  }

  private writeTaskState(task: DataComplianceTask): void {
    const path = this.taskStatePath(task.id)
    mkdirSync(dirname(path), { recursive: true })
    const tmp = `${path}.tmp`
    writeFileSync(tmp, JSON.stringify(task, null, 2), 'utf-8')
    try {
      renameSync(tmp, path)
    } catch {
      writeFileSync(path, JSON.stringify(task, null, 2), 'utf-8')
    }
  }

  private workerScriptPath(): string {
    return join(this.webRoot, 'compliance_worker.py')
  }

  async createTask(input: DataComplianceCreateTaskInput): Promise<{ taskId: string }> {
    const envCheck = await this.checkEnvironment()
    if (!envCheck.ok) {
      throw new Error(envCheck.reason + (envCheck.fix ? ` (${envCheck.fix})` : ''))
    }

    const taskId = shortId()
    const taskDir = this.taskDir(taskId)
    await mkdir(taskDir, { recursive: true })

    const mode = input.mode
    const reviewType = input.reviewType ?? 'document'
    const documentName = input.documentName?.trim() || '未命名任务'

    let inputPath: string
    let inputType: 'file' | 'text' | 'batch'
    let inputManifestPath: string | undefined
    let inputFiles: DataComplianceStoredInputFile[] | undefined
    let originalFilename: string | undefined
    let storedFilename: string | undefined

    const inputFilePayloads = [
      ...(input.files ?? []),
      ...(input.file ? [input.file] : [])
    ].filter((file) => Boolean(file.filePath || file.dataBase64))

    if (inputFilePayloads.length > 1) {
      const filesDir = join(taskDir, 'input_files')
      await mkdir(filesDir, { recursive: true })
      const used = new Set<string>()
      inputFiles = []
      for (const [index, file] of inputFilePayloads.entries()) {
        const stored = uniqueSafeFilename(file.name || `upload_${index + 1}`, used)
        const targetPath = join(filesDir, stored)
        if (file.filePath) {
          await copyFile(file.filePath, targetPath)
        } else {
          await writeFile(targetPath, Buffer.from(file.dataBase64 ?? '', 'base64'))
        }
        inputFiles.push({
          name: file.name || stored,
          type: file.type,
          path: targetPath,
          stored_filename: stored
        })
      }
      inputManifestPath = join(taskDir, 'input_manifest.json')
      await writeFile(
        inputManifestPath,
        JSON.stringify({ files: inputFiles }, null, 2),
        'utf-8'
      )
      inputPath = inputManifestPath
      inputType = 'batch'
      originalFilename = `${inputFiles.length} files`
      storedFilename = 'input_manifest.json'
    } else if (inputFilePayloads.length === 1) {
      const file = inputFilePayloads[0]
      const name = safeFilename(file.name || 'upload')
      storedFilename = `${taskId}_${name}`
      originalFilename = file.name || name
      inputPath = join(taskDir, storedFilename)
      if (file.filePath) {
        await copyFile(file.filePath, inputPath)
      } else {
        await writeFile(inputPath, Buffer.from(file.dataBase64 ?? '', 'base64'))
      }
      inputType = 'file'
    } else if (input.inputText?.trim()) {
      const suffix = mode === 'review' && reviewType === 'code' ? 'code.txt' : 'txt'
      inputPath = join(taskDir, `${taskId}.${suffix}`)
      await writeFile(inputPath, input.inputText.trim(), 'utf-8')
      inputType = 'text'
    } else {
      throw new Error('请上传文件或输入文本')
    }

    const task: DataComplianceTask = {
      id: taskId,
      document_name: documentName,
      product_type: mode,
      review_type: mode === 'review' ? reviewType : undefined,
      input_type: inputType,
      input_path: inputPath,
      input_manifest_path: inputManifestPath,
      input_files: inputFiles,
      original_filename: originalFilename,
      stored_filename: storedFilename,
      output_dir: input.outputDir?.trim() || undefined,
      output_format: input.outputFormat,
      redaction_mode: input.redactionMode ?? 'standard',
      status: 'pending',
      created_at: nowIso(),
      progress: {
        step: 0,
        total_steps: mode === 'desensitize' ? 4 : 11,
        message: '任务已创建，正在启动 worker',
        status: 'running',
        percent: 5
      }
    }
    this.writeTaskState(task)

    // Spawn worker asynchronously
    void this.runWorker(taskId, mode)

    return { taskId }
  }

  private async runWorker(taskId: string, mode: 'review' | 'desensitize'): Promise<void> {
    const taskDir = this.taskDir(taskId)
    const task = await this.readTaskState(taskId)
    if (!task) return

    task.status = 'running'
    task.progress = {
      step: 0,
      total_steps: task.progress?.total_steps ?? (mode === 'desensitize' ? 4 : 11),
      message: 'worker 已启动，正在准备处理任务',
      status: 'running',
      percent: 8
    }
    this.writeTaskState(task)

    const payload = {
      task_id: taskId,
      document_name: task.document_name,
      input_path: task.input_path,
      input_manifest_path: task.input_manifest_path,
      input_files: task.input_files ?? [],
      input_type: task.input_type,
      review_type: task.review_type ?? 'document',
      output_dir: task.output_dir,
      output_format: task.output_format,
      redaction_mode: task.redaction_mode ?? 'standard'
    }
    const payloadPath = join(taskDir, 'worker_input.json')
    await writeFile(payloadPath, JSON.stringify(payload, null, 2), 'utf-8')

    const python = this.pythonBin
    if (!python) {
      await this.failTask(taskId, 'Python 解释器不可用')
      return
    }

    const workerScript = this.workerScriptPath()
    if (!existsSync(workerScript)) {
      await this.failTask(taskId, `worker 脚本不存在: ${workerScript}`)
      return
    }

    const logPath = join(this.logDir, 'data-compliance-worker.log')
    await mkdir(dirname(logPath), { recursive: true })
    const logOut = createWriteStream(logPath, { flags: 'a' })
    const logErr = createWriteStream(logPath, { flags: 'a' })

    const child = spawn(
      python,
      [workerScript, mode, '--payload', payloadPath, '--output', taskDir],
      {
        cwd: this.webRoot,
        env: {
          ...buildDataCompliancePythonEnv(),
          COMPLIANCEAI_PYTHON: python,
          COMPLIANCEAI_LOG_PATH: logPath,
          LEGALWORK_API_KEY: process.env.LEGALWORK_API_KEY ?? '',
          DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ?? '',
          LEGALWORK_BASE_URL: process.env.LEGALWORK_BASE_URL ?? '',
          LEGALWORK_MODEL: process.env.LEGALWORK_MODEL ?? ''
        },
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      }
    )
    child.stdout?.pipe(logOut, { end: false })
    child.stderr?.pipe(logErr, { end: false })
    this.runningChildren.set(taskId, child)

    // Poll task_state.json while worker runs; cap total polling time to avoid
    // leaking intervals if the worker process hangs.
    const POLL_INTERVAL_MS = 1000
    const MAX_POLL_MINUTES = 30
    let polls = 0
    const maxPolls = (MAX_POLL_MINUTES * 60 * 1000) / POLL_INTERVAL_MS
    let failed = false
    const markFailed = async (message: string): Promise<void> => {
      if (failed) return
      failed = true
      await this.failTask(taskId, message)
    }
    const pollInterval = setInterval(async () => {
      polls += 1
      const latest = await this.readTaskState(taskId)
      if (latest && latest.status !== 'pending' && latest.status !== 'running') {
        clearInterval(pollInterval)
        return
      }
      if (latest && polls >= 5 && (latest.progress?.step ?? 0) === 0) {
        latest.progress = {
          step: 0,
          total_steps: latest.progress?.total_steps ?? (mode === 'desensitize' ? 4 : 11),
          message: '本地处理引擎正在加载依赖并读取输入，请稍候',
          status: 'running',
          percent: Math.min(18, 8 + polls)
        }
        this.writeTaskState(latest)
      }
      if (polls >= maxPolls) {
        clearInterval(pollInterval)
        child.kill('SIGTERM')
        await markFailed('Worker 运行超过 30 分钟，已强制终止')
      }
    }, POLL_INTERVAL_MS)

    return new Promise((resolve) => {
      const cleanup = (): void => {
        clearInterval(pollInterval)
        this.runningChildren.delete(taskId)
        logOut.end()
        logErr.end()
      }

      child.on('exit', async (code) => {
        cleanup()
        if (code !== 0) {
          const errorPath = join(taskDir, 'worker_error.json')
          let message = `worker 退出码 ${code ?? 'unknown'}`
          try {
            const errorJson = await readFile(errorPath, 'utf-8')
            const parsed = JSON.parse(errorJson)
            if (parsed.error) message = parsed.error
          } catch {
            // ignore
          }
          await markFailed(message)
        } else {
          await this.finalizeTask(taskId)
        }
        resolve()
      })
      child.on('error', async (error) => {
        cleanup()
        await markFailed(error.message)
        resolve()
      })
    })
  }

  private async failTask(taskId: string, message: string): Promise<void> {
    const task = await this.readTaskState(taskId)
    if (!task) return
    task.status = 'failed'
    task.error = message
    task.completed_at = nowIso()
    task.progress = {
      step: task.progress?.step ?? 0,
      total_steps: task.progress?.total_steps ?? 1,
      message: `出错了: ${message}`,
      status: 'error'
    }
    this.writeTaskState(task)
  }

  private async finalizeTask(taskId: string): Promise<void> {
    const task = await this.readTaskState(taskId)
    if (!task) return
    if (task.status === 'failed') return
    if (task.status === 'completed') return
    task.status = 'completed'
    task.completed_at = nowIso()
    task.progress = {
      step: task.progress?.total_steps ?? 1,
      total_steps: task.progress?.total_steps ?? 1,
      message: task.product_type === 'desensitize' ? '脱敏完成' : '审查完成',
      status: 'completed'
    }
    this.writeTaskState(task)
  }

  async getTask(taskId: string): Promise<DataComplianceTask | null> {
    const task = await this.readTaskState(taskId)
    if (!task) return null
    // Refresh from disk if still running
    return task
  }

  async listTasks(limit = 200): Promise<DataComplianceTask[]> {
    const entries = readdirSync(this.tasksDir, { withFileTypes: true })
    const tasks: DataComplianceTask[] = []
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const task = await this.readTaskState(entry.name)
      if (task) tasks.push(task)
    }
    tasks.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
    return tasks.slice(0, limit)
  }

  async deleteTask(taskId: string): Promise<boolean> {
    if (!isValidTaskId(taskId)) return false
    const taskDir = this.taskDir(taskId)
    if (!isInsideDir(taskDir, this.tasksDir)) {
      return false
    }
    const child = this.runningChildren.get(taskId)
    if (child) {
      child.kill('SIGTERM')
      this.runningChildren.delete(taskId)
    }
    try {
      await rm(taskDir, { recursive: true, force: true })
      return true
    } catch {
      return false
    }
  }

  resolveFilePath(taskId: string, fileKey: DataComplianceFileKey): { path: string; filename: string } | null {
    if (!isValidTaskId(taskId)) return null
    const taskDir = this.taskDir(taskId)
    const state = this.readTaskStateSync(taskId)
    if (!state) return null

    const mapping = state.product_type === 'desensitize'
      ? this.desensitizeFileMapping(state, fileKey)
      : this.reviewFileMapping(state, fileKey)

    if (!mapping) return null
    const absolutePath = resolve(taskDir, mapping.relativePath)
    if (!isInsideDir(absolutePath, taskDir)) return null
    if (!existsSync(absolutePath)) return null
    return { path: absolutePath, filename: mapping.downloadName }
  }

  private readTaskStateSync(taskId: string): DataComplianceTask | null {
    const path = this.taskStatePath(taskId)
    try {
      return JSON.parse(readFileSync(path, 'utf-8')) as DataComplianceTask
    } catch {
      return null
    }
  }

  private reviewFileMapping(
    task: DataComplianceTask,
    fileKey: DataComplianceFileKey
  ): { relativePath: string; downloadName: string } | null {
    const result = task.result ?? {}
    const mappings: Record<string, { key: string; ext: string }> = {
      report: { key: 'report', ext: '.json' },
      report_md: { key: 'report_markdown', ext: '.md' },
      remediation: { key: 'remediation', ext: '.json' },
      evidence: { key: 'evidence', ext: '.json' },
      sdk_pack: { key: 'sdk_pack', ext: '.json' },
      cross_border_pack: { key: 'cross_border_pack', ext: '.json' },
      privacy_pack: { key: 'privacy_pack', ext: '.json' },
      code_suggestions: { key: 'code_suggestions', ext: '.md' }
    }
    const mapped = mappings[fileKey]
    if (!mapped) return null
    const filePath = result[mapped.key]
    if (!filePath) return null
    return {
      relativePath: relative(this.taskDir(task.id), filePath),
      downloadName: `${safeFilename(task.document_name)}_${fileKey}${mapped.ext}`
    }
  }

  private desensitizeFileMapping(
    task: DataComplianceTask,
    fileKey: DataComplianceFileKey
  ): { relativePath: string; downloadName: string } | null {
    const result = task.result ?? {}
    const mappings: Record<string, { key: string; ext: string }> = {
      desensitized_output: { key: 'desensitized_output', ext: '' },
      desensitization_report: { key: 'desensitization_report', ext: '.json' },
      desensitization_report_md: { key: 'desensitization_report_md', ext: '.md' },
      retention_note: { key: 'retention_note', ext: '.txt' },
      subject_mapping_md: { key: 'subject_mapping_md', ext: '.md' },
      subject_mapping_json: { key: 'subject_mapping_json', ext: '.json' }
    }
    const mapped = mappings[fileKey]
    if (!mapped) return null
    const filePath = result[mapped.key]
    if (!filePath) return null
    const absolutePath = resolve(this.taskDir(task.id), filePath)
    const ext = mapped.ext || extname(absolutePath)
    return {
      relativePath: pathRelative(this.taskDir(task.id), filePath),
      downloadName: `${safeFilename(task.document_name)}_${fileKey}${ext}`
    }
  }

  createResultResponse(task: DataComplianceTask): Record<string, unknown> {
    if (task.product_type === 'desensitize') {
      return {
        task_id: task.id,
        status: task.status,
        product_type: 'desensitize',
        document_name: task.document_name,
        output_dir: task.output_dir,
        report: this.loadResultJson(task, 'desensitization_report'),
        progress: task.progress,
        error: task.error
      }
    }

    return {
      task_id: task.id,
      status: task.status,
      document_name: task.document_name,
      report: this.loadResultJson(task, 'report'),
      remediation: this.loadResultJson(task, 'remediation'),
      evidence: this.loadResultJson(task, 'evidence'),
      sdk_pack: this.loadResultJson(task, 'sdk_pack'),
      cross_border_pack: this.loadResultJson(task, 'cross_border_pack'),
      privacy_pack: this.loadResultJson(task, 'privacy_pack'),
      progress: task.progress,
      error: task.error
    }
  }

  private loadResultJson(task: DataComplianceTask, resultKey: string): unknown {
    const filePath = task.result?.[resultKey]
    if (!filePath) return undefined
    try {
      const text = readFileSync(filePath, 'utf-8')
      return JSON.parse(text)
    } catch {
      return undefined
    }
  }

  streamProgress(taskId: string): Readable {
    const stream = new Readable({ read() {} })

    const send = (data: Record<string, unknown>) => {
      stream.push(`data: ${JSON.stringify(data)}\n\n`)
    }

    let stopped = false
    let lastStatus = ''

    const interval = setInterval(async () => {
      if (stopped) return
      const task = await this.readTaskState(taskId)
      if (!task) {
        send({ error: '任务不存在' })
        stop()
        return
      }
      if (task.status !== lastStatus || task.status === 'running') {
        lastStatus = task.status
        send({ status: task.status, progress: task.progress })
      }
      if (task.status === 'completed' || task.status === 'failed') {
        stop()
      }
    }, 500)

    const stop = () => {
      if (stopped) return
      stopped = true
      clearInterval(interval)
      stream.push(null)
    }

    stream.on('close', stop)
    return stream
  }

  getInputFileReadStream(taskId: string): { stream: Readable; filename: string; contentType: string } | null {
    const task = this.readTaskStateSync(taskId)
    if (!task?.input_path || !existsSync(task.input_path)) return null
    const ext = extname(task.input_path).toLowerCase()
    const contentType = ext === '.pdf' ? 'application/pdf' : ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/octet-stream'
    return {
      stream: createReadStream(task.input_path),
      filename: task.original_filename || task.stored_filename || 'input',
      contentType
    }
  }
}

function relative(from: string, to: string): string {
  return pathRelative(from, to)
}
