import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import {
  CORE_REQUIRED_PYTHON_PACKAGES,
  DataComplianceTaskService,
  OPTIONAL_OCR_PYTHON_PACKAGES,
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
  it('requires Python 3.10 or newer', () => {
    expect(parsePythonVersionOutput('Python 3.11.9')).toEqual({ major: 3, minor: 11, patch: 9 })
    expect(isSupportedDataCompliancePythonVersion('Python 3.9.18')).toBe(false)
    expect(isSupportedDataCompliancePythonVersion('Python 3.10.0')).toBe(true)
    expect(isSupportedDataCompliancePythonVersion('Python 3.12.1')).toBe(true)
  })

  it('does not block core workflows when optional OCR imports are unavailable', () => {
    expect(CORE_REQUIRED_PYTHON_PACKAGES).not.toContain('paddle')
    expect(CORE_REQUIRED_PYTHON_PACKAGES).not.toContain('paddleocr')
    expect(OPTIONAL_OCR_PYTHON_PACKAGES).toEqual(['paddle', 'paddleocr', 'pytesseract'])
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
