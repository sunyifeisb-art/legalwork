import { spawn, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  appendFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, extname, isAbsolute, join, relative as pathRelative, resolve } from 'node:path'
import { Readable } from 'node:stream'

const DATA_COMPLIANCE_VENV_DIR_NAME = 'python-venv'

function resolveDataComplianceVenvDir(dataDir: string): string {
  return join(dataDir, 'data-compliance', DATA_COMPLIANCE_VENV_DIR_NAME)
}

function resolveDataComplianceVenvPython(venvDir: string, platform?: NodeJS.Platform): string {
  return (platform ?? process.platform) === 'win32'
    ? join(venvDir, 'Scripts', 'python.exe')
    : join(venvDir, 'bin', 'python')
}

export type DataComplianceTaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export type DataComplianceTask = {
  id: string
  document_name: string
  product_type: 'review' | 'desensitize'
  review_type?: 'document' | 'code'
  input_type: 'file' | 'text'
  input_path: string
  original_filename?: string
  stored_filename?: string
  output_dir?: string
  output_format?: 'md' | 'docx' | 'txt'
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
  detail?: Record<string, unknown>
}

export type DataComplianceCreateTaskInput = {
  mode: 'review' | 'desensitize'
  documentName?: string
  inputText?: string
  reviewType?: 'document' | 'code'
  outputDir?: string
  outputFormat?: 'md' | 'docx' | 'txt'
  file?: {
    name: string
    type?: string
    dataBase64: string
  }
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

const REQUIRED_PYTHON_PACKAGES = [
  'docx',
  'fitz',
  'pandas',
  'PIL',
  'presidio_analyzer',
  'presidio_anonymizer'
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
  }

  private venvPythonPath(): string {
    return resolveDataComplianceVenvPython(this.venvDir, process.platform)
  }

  private resolvePythonExecutable(): string | null {
    const venvPython = this.venvPythonPath()
    if (this.canRunPython(venvPython)) return venvPython

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
        stdio: 'ignore'
      })
      return result.status === 0
    } catch {
      return false
    }
  }

  async checkEnvironment(): Promise<DataComplianceEnvironmentCheckResult> {
    if (!this.pythonBin) {
      return {
        ok: false,
        reason: '未找到 Python 解释器',
        fix: '请安装 Python 3 并确保 python3 在 PATH 中，或在设置中指定 PYTHON 环境变量。'
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
        fix: '请确认已安装 Python 3，并检查网络是否允许安装数据合规依赖。'
      }
    }

    const missing: string[] = []
    for (const pkg of REQUIRED_PYTHON_PACKAGES) {
      try {
        const result = await this.runPython(['-c', `import ${pkg}`])
        if (result.exitCode !== 0) {
          missing.push(pkg)
        }
      } catch {
        missing.push(pkg)
      }
    }

    if (missing.length > 0) {
      return {
        ok: false,
        reason: `缺少 Python 依赖包: ${missing.join(', ')}`,
        fix: `请在数据合规 venv 中运行: ${this.pythonBin} -m pip install -r ${join(this.webRoot, 'requirements.txt')}`
      }
    }

    return { ok: true, python: this.pythonBin }
  }

  private async ensurePythonEnvironment(): Promise<void> {
    const venvPython = this.venvPythonPath()
    const requirementsPath = join(this.webRoot, 'requirements.txt')

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

    const missing = await this.findMissingPackages(REQUIRED_PYTHON_PACKAGES, venvPython)
    if (missing.length === 0) return

    const result = await this.runCommand(
      venvPython,
      ['-m', 'pip', 'install', '-r', requirementsPath],
      { cwd: this.webRoot }
    )
    if (result.exitCode !== 0) {
      throw new Error(`安装依赖失败: ${result.stderr || result.stdout}`)
    }
  }

  private async findMissingPackages(packages: string[], python: string): Promise<string[]> {
    const missing: string[] = []
    for (const pkg of packages) {
      const result = await this.runCommand(python, ['-c', `import ${pkg}`])
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
    options: { cwd?: string } = {}
  ): Promise<{ exitCode: number; stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options.cwd,
        env: buildDataCompliancePythonEnv()
      })
      let stdout = ''
      let stderr = ''
      child.stdout?.on('data', (chunk) => {
        stdout += String(chunk)
      })
      child.stderr?.on('data', (chunk) => {
        stderr += String(chunk)
      })
      child.on('error', reject)
      child.on('exit', (exitCode) => {
        resolve({ exitCode: exitCode ?? 1, stdout, stderr })
      })
    })
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
    let inputType: 'file' | 'text'
    let originalFilename: string | undefined
    let storedFilename: string | undefined

    if (input.file?.dataBase64) {
      const name = safeFilename(input.file.name || 'upload')
      storedFilename = `${taskId}_${name}`
      originalFilename = input.file.name || name
      const buffer = Buffer.from(input.file.dataBase64, 'base64')
      inputPath = join(taskDir, storedFilename)
      await writeFile(inputPath, buffer)
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
      original_filename: originalFilename,
      stored_filename: storedFilename,
      output_dir: input.outputDir?.trim() || undefined,
      output_format: input.outputFormat,
      status: 'pending',
      created_at: nowIso(),
      progress: {
        step: 0,
        total_steps: mode === 'desensitize' ? 4 : 11,
        message: '任务已创建，等待 worker 启动',
        status: 'running'
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

    const payload = {
      task_id: taskId,
      document_name: task.document_name,
      input_path: task.input_path,
      input_type: task.input_type,
      review_type: task.review_type ?? 'document',
      output_dir: task.output_dir,
      output_format: task.output_format
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

    const child = spawn(
      python,
      [workerScript, mode, '--payload', payloadPath, '--output', taskDir],
      {
        cwd: this.webRoot,
        env: {
          ...process.env,
          COMPLIANCEAI_PYTHON: python,
          COMPLIANCEAI_LOG_PATH: logPath,
          LEGALWORK_API_KEY: process.env.LEGALWORK_API_KEY ?? '',
          DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ?? ''
        },
        stdio: ['ignore', 'pipe', 'pipe']
      }
    )
    this.runningChildren.set(taskId, child)

    child.stdout?.on('data', (chunk) => {
      // Worker stdout goes to log only
      try {
        appendFileSync(logPath, `[stdout ${taskId}] ${String(chunk)}`)
      } catch {
        // ignore
      }
    })
    child.stderr?.on('data', (chunk) => {
      try {
        appendFileSync(logPath, `[stderr ${taskId}] ${String(chunk)}`)
      } catch {
        // ignore
      }
    })

    // Poll task_state.json while worker runs
    const pollInterval = setInterval(async () => {
      const latest = await this.readTaskState(taskId)
      if (latest && latest.status !== 'pending' && latest.status !== 'running') {
        clearInterval(pollInterval)
      }
    }, 1000)

    return new Promise((resolve) => {
      child.on('exit', async (code) => {
        clearInterval(pollInterval)
        this.runningChildren.delete(taskId)
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
          await this.failTask(taskId, message)
        } else {
          await this.finalizeTask(taskId)
        }
        resolve()
      })
      child.on('error', async (error) => {
        clearInterval(pollInterval)
        this.runningChildren.delete(taskId)
        await this.failTask(taskId, error.message)
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
    const taskDir = this.taskDir(taskId)
    const resolved = resolve(taskDir)
    const rootResolved = resolve(this.tasksDir)
    if (!resolved.startsWith(rootResolved + '/') && resolved !== rootResolved) {
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
    const taskDir = this.taskDir(taskId)
    const state = this.readTaskStateSync(taskId)
    if (!state) return null

    const mapping = state.product_type === 'desensitize'
      ? this.desensitizeFileMapping(state, fileKey)
      : this.reviewFileMapping(state, fileKey)

    if (!mapping) return null
    const absolutePath = resolve(taskDir, mapping.relativePath)
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
