import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join } from 'node:path'
import {
  buildDataComplianceWebRoot
} from '../src/server/routes/data-compliance.js'
import {
  buildDataCompliancePythonEnv,
  DataComplianceTaskService
} from '../src/services/data-compliance-task-service.js'

describe('data compliance runtime environment', () => {
  let root = ''
  const originalEnv = { ...process.env }

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'legalwork-data-compliance-'))
  })

  afterEach(async () => {
    process.env = { ...originalEnv }
    await rm(root, { recursive: true, force: true })
  })

  it('uses a direct packaged data-compliance web root when the worker is already there', async () => {
    const webRoot = join(root, 'data-compliance-web')
    await mkdir(webRoot, { recursive: true })
    await writeFile(join(webRoot, 'compliance_worker.py'), '# worker\n')

    expect(buildDataComplianceWebRoot({
      appRoot: webRoot,
      isPackaged: true,
      cwd: join(root, 'elsewhere')
    })).toBe(webRoot)
  })

  it.runIf(process.platform !== 'win32')('finds python3 on PATH and creates the writable data-compliance venv', async () => {
    const fakeBin = join(root, 'fake-bin')
    const webRoot = join(root, 'web')
    const dataDir = join(root, 'data')
    await mkdir(fakeBin, { recursive: true })
    await mkdir(webRoot, { recursive: true })

    const fakePython = join(fakeBin, 'python3')
    await writeFile(fakePython, [
      '#!/bin/sh',
      'if [ "$1" = "--version" ]; then echo "Python 3.11.0"; exit 0; fi',
      'if [ "$1" = "-m" ] && [ "$2" = "venv" ]; then',
      '  VENV="$3"',
      '  /bin/mkdir -p "$VENV/bin"',
      '  /bin/cat > "$VENV/bin/python" <<"PY"',
      '#!/bin/sh',
      'if [ "$1" = "--version" ]; then echo "Python 3.11.0"; exit 0; fi',
      'if [ "$1" = "-c" ]; then exit 0; fi',
      'exit 0',
      'PY',
      '  /bin/chmod +x "$VENV/bin/python"',
      '  exit 0',
      'fi',
      'if [ "$1" = "-c" ]; then exit 0; fi',
      'exit 0',
      ''
    ].join('\n'))
    await chmod(fakePython, 0o755)

    process.env = {
      ...originalEnv,
      PATH: fakeBin,
      COMPLIANCEAI_PYTHON: '',
      PYTHON: '',
      PYTHON3: ''
    }

    const env = buildDataCompliancePythonEnv()
    expect(env.PATH?.split(delimiter)[0]).toBe(fakeBin)

    const service = new DataComplianceTaskService({
      dataDir,
      webRoot,
      logDir: join(dataDir, 'logs')
    })

    await expect(service.checkEnvironment()).resolves.toMatchObject({ ok: true })
    expect(existsSync(join(dataDir, 'data-compliance', 'python-venv', 'bin', 'python'))).toBe(true)
  })
})
