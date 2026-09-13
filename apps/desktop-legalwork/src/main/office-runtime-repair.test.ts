import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { bundledOfficePythonEnv, inspectOfficeRuntime, repairOfficeRuntime } from './office-runtime-repair'

const vendorRoot = join(__dirname, '..', '..', 'vendor', 'office-runtime')

function bundledPythonForThisMachine(): string | undefined {
  if (process.platform !== 'darwin') return undefined
  const target = process.arch === 'arm64' ? 'mac-arm64' : 'mac-x64'
  const python = join(vendorRoot, target, 'python', 'bin', 'python3')
  return existsSync(python) ? python : undefined
}

describe('bundledOfficePythonEnv', () => {
  // python-build-standalone bakes sys.prefix in at build time, so the packaged
  // tree only finds its own stdlib when PYTHONHOME re-anchors it. The two
  // layouts differ on purpose and skill_runner.py computes the same thing —
  // if these drift, the self-check disagrees with the code it is checking.
  it('anchors to the python dir on Windows', () => {
    const env = bundledOfficePythonEnv('C:\\app\\office-runtime\\python\\python.exe', 'win32')
    expect(env.PYTHONHOME).toBe('C:\\app\\office-runtime\\python')
    expect(env.PYTHONDONTWRITEBYTECODE).toBe('1')
  })

  it('anchors two levels up on Unix', () => {
    const env = bundledOfficePythonEnv('/app/office-runtime/python/bin/python3', 'darwin')
    expect(env.PYTHONHOME).toBe('/app/office-runtime/python')
    expect(env.PYTHONDONTWRITEBYTECODE).toBe('1')
  })
})

describe('inspectOfficeRuntime', () => {
  it('reports absent rather than throwing when there is no bundled runtime', async () => {
    expect((await inspectOfficeRuntime({ python: undefined })).status).toBe('absent')
    expect((await inspectOfficeRuntime({ python: '/nope/python' })).status).toBe('absent')
  })

  it('reports interpreter-broken when the interpreter cannot run', async () => {
    // package.json is a real file that is definitely not an interpreter.
    const notPython = join(__dirname, '..', '..', 'package.json')
    const report = await inspectOfficeRuntime({ python: notPython, imports: ['json'] })
    expect(report.status).toBe('interpreter-broken')
  })

  const python = bundledPythonForThisMachine()
  const withBundled = python ? it : it.skip

  withBundled('reports ok when every required module imports', async () => {
    const report = await inspectOfficeRuntime({ python, imports: ['json', 'docx'] })
    expect(report.status).toBe('ok')
    expect(report.missingImports).toEqual([])
  })

  withBundled('names exactly the modules that are missing', async () => {
    const report = await inspectOfficeRuntime({
      python,
      imports: ['json', 'legalwork_module_that_does_not_exist']
    })
    expect(report.status).toBe('packages-missing')
    expect(report.missingImports).toEqual(['legalwork_module_that_does_not_exist'])
  })
})

describe('repairOfficeRuntime', () => {
  it('does not run pip for a report it cannot fix', async () => {
    for (const status of ['ok', 'absent', 'interpreter-broken'] as const) {
      const result = await repairOfficeRuntime({
        report: { status, python: '/tmp/python', expectedImports: [], missingImports: [] },
        resourcesPath: '/tmp'
      })
      expect(result.attempted).toBe(false)
      expect(result.repaired).toBe(false)
    }
  })

  it('refuses to run when the packaged requirements file is absent', async () => {
    const result = await repairOfficeRuntime({
      report: {
        status: 'packages-missing',
        python: '/tmp/python',
        expectedImports: ['docx'],
        missingImports: ['docx']
      },
      resourcesPath: '/tmp/definitely-not-a-resources-dir'
    })
    expect(result.attempted).toBe(false)
    expect(result.detail).toContain('找不到打包的 Office 依赖清单')
  })
})
