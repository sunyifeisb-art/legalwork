import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import {
  buildDataCompliancePythonEnv,
  DataComplianceTaskService,
  isSupportedDataCompliancePythonVersion,
  parsePythonVersionOutput
} from './data-compliance-task-service.js'

const tempDirs: string[] = []

async function makeTempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'legalwork-data-compliance-test-'))
  tempDirs.push(dir)
  return dir
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe('data compliance Python version helpers', () => {
  it('requires Python 3.11 or newer', () => {
    expect(parsePythonVersionOutput('Python 3.11.9')).toEqual({ major: 3, minor: 11, patch: 9 })
    expect(isSupportedDataCompliancePythonVersion('Python 3.9.18')).toBe(false)
    expect(isSupportedDataCompliancePythonVersion('Python 3.10.0')).toBe(false)
    expect(isSupportedDataCompliancePythonVersion('Python 3.12.1')).toBe(true)
  })
})

describe('data compliance environment checks', () => {
  it('anchors bundled Python with PYTHONHOME', () => {
    expect(buildDataCompliancePythonEnv({
      Path: 'C:\\Windows',
      LEGALWORK_BUNDLED_COMPLIANCE_PYTHONHOME: 'C:\\Program Files\\legalwork\\resources\\office-runtime\\python'
    }, 'win32')).toMatchObject({
      PYTHONHOME: 'C:\\Program Files\\legalwork\\resources\\office-runtime\\python'
    })
  })

  it('does not repeat the full package scan after environment preparation succeeds', async () => {
    const dataDir = await makeTempDir()
    const webRoot = await makeTempDir()
    const logDir = await makeTempDir()
    const service = new DataComplianceTaskService({ dataDir, webRoot, logDir })
    const internals = service as unknown as {
      resolvePythonExecutable: () => string | null
      runPython: () => Promise<{ exitCode: number; stdout: string; stderr: string }>
      ensurePythonEnvironment: () => Promise<void>
      findMissingPackages: () => Promise<string[]>
    }

    internals.resolvePythonExecutable = () => 'python'
    internals.runPython = async () => ({ exitCode: 0, stdout: 'Python 3.11.9', stderr: '' })
    internals.ensurePythonEnvironment = async () => undefined
    internals.findMissingPackages = async () => {
      throw new Error('redundant package scan')
    }

    await expect(service.checkEnvironment()).resolves.toEqual({ ok: true, python: 'python' })
  })

  it.runIf(process.platform !== 'win32')('uses a ready COS compliance bundle before system Python', async () => {
    const dataDir = await makeTempDir()
    const webRoot = await makeTempDir()
    const logDir = await makeTempDir()
    const machine = `${process.platform === 'darwin' ? 'mac' : 'linux'}-${process.arch}`
    const bundleRoot = join(dataDir, 'data-compliance', `runtime-v0.3.31-${machine}`)
    const python = join(bundleRoot, 'python', 'bin', 'python3')
    await mkdir(join(bundleRoot, 'python', 'lib', 'python3.11', 'site-packages'), { recursive: true })
    await mkdir(join(bundleRoot, 'python', 'bin'), { recursive: true })
    await writeFile(python, '#!/bin/sh\necho "Python 3.11.9"\n', 'utf-8')
    await chmod(python, 0o755)
    await writeFile(join(bundleRoot, '.legalwork-compliance-ready'), 'ready', 'utf-8')

    const previous = process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED
    process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED = '1'
    try {
      const service = new DataComplianceTaskService({ dataDir, webRoot, logDir })
      await expect(service.checkEnvironment()).resolves.toEqual({ ok: true, python })
    } finally {
      if (previous === undefined) delete process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED
      else process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED = previous
    }
  })

  it('reports a missing COS compliance bundle as installing without blocking the probe', async () => {
    const dataDir = await makeTempDir()
    const webRoot = await makeTempDir()
    const logDir = await makeTempDir()
    const service = new DataComplianceTaskService({ dataDir, webRoot, logDir })
    let finishInstall!: (python: string) => void
    const pendingInstall = new Promise<string>((resolve) => {
      finishInstall = resolve
    })
    const internals = service as unknown as {
      complianceBundleReady: () => boolean
      ensureComplianceBundle: () => Promise<string>
    }
    let installStarted = false
    internals.complianceBundleReady = () => false
    internals.ensureComplianceBundle = () => {
      installStarted = true
      return pendingInstall
    }

    const previous = process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED
    process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED = '1'
    try {
      await expect(service.checkEnvironment()).resolves.toEqual({
        ok: false,
        installing: true,
        reason: '正在下载并准备数据合规环境，首次使用需要几分钟。'
      })
      expect(installStarted).toBe(true)
    } finally {
      finishInstall('python')
      if (previous === undefined) delete process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED
      else process.env.LEGALWORK_COMPLIANCE_BUNDLE_ENABLED = previous
    }
  })
})

describe('data compliance task creation', () => {
  async function createService(): Promise<DataComplianceTaskService> {
    const dataDir = await makeTempDir()
    const webRoot = await makeTempDir()
    const logDir = await makeTempDir()
    const service = new DataComplianceTaskService({ dataDir, webRoot, logDir })
    ;(service as unknown as { checkEnvironment: () => Promise<{ ok: true; python: string }> }).checkEnvironment =
      async () => ({ ok: true, python: 'python' })
    ;(service as unknown as { runWorker: () => Promise<void> }).runWorker = async () => undefined
    return service
  }

  it('stores multi-file desensitize tasks as a batch manifest', async () => {
    const service = await createService()
    const sourceDir = await makeTempDir()
    const first = join(sourceDir, 'a.txt')
    const second = join(sourceDir, 'a copy.txt')
    await writeFile(first, '张三 13800138000', 'utf-8')
    await writeFile(second, '李四 13900139000', 'utf-8')

    const { taskId } = await service.createTask({
      mode: 'desensitize',
      documentName: 'batch',
      outputFormat: 'pdf',
      redactionMode: 'agent_enhanced',
      files: [
        { name: 'a.txt', filePath: first },
        { name: 'a.txt', filePath: second }
      ]
    })

    const task = await service.getTask(taskId)
    expect(task?.input_type).toBe('batch')
    expect(task?.output_format).toBe('pdf')
    expect(task?.redaction_mode).toBe('agent_enhanced')
    expect(task?.input_files).toHaveLength(2)
    expect(task?.input_files?.[0].stored_filename).toBe('a.txt')
    expect(task?.input_files?.[1].stored_filename).toBe('a_2.txt')
    expect(task?.input_manifest_path).toBeTruthy()

    const manifest = JSON.parse(await readFile(task!.input_manifest_path!, 'utf-8')) as { files: unknown[] }
    expect(manifest.files).toHaveLength(2)
  })

  it('stores multi-file review tasks as a batch manifest', async () => {
    const service = await createService()
    const { taskId } = await service.createTask({
      mode: 'review',
      files: [
        { name: 'one.txt', dataBase64: Buffer.from('one').toString('base64') },
        { name: 'two.txt', dataBase64: Buffer.from('two').toString('base64') }
      ]
    })

    const task = await service.getTask(taskId)
    expect(task?.input_type).toBe('batch')
    expect(task?.input_files).toHaveLength(2)
    expect(task?.input_manifest_path).toBeTruthy()
  })
})
