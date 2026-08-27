import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const builderConfig = require('../../electron-builder.config.cjs')
const beforePack = require('../../scripts/before-pack.cjs')
const afterPack = require('../../scripts/after-pack.cjs')

const roots: string[] = []

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'legalwork-office-runtime-test-'))
  roots.push(root)
  return root
}

function macContext(root: string) {
  return {
    appOutDir: join(root, 'mac-arm64'),
    electronPlatformName: 'darwin',
    arch: 'arm64',
    packager: {
      appInfo: { productFilename: 'legalwork' },
      projectDir: join(root, 'project')
    }
  }
}

function ensurePath(path: string, directory = false): void {
  if (directory) {
    mkdirSync(path, { recursive: true })
    return
  }
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, '{}\n', 'utf8')
}

afterEach(() => {
  while (roots.length > 0) {
    const root = roots.pop()
    if (root) rmSync(root, { recursive: true, force: true })
  }
})

describe('bundled Office runtime packaging contract', () => {
  it('packages only the current OS/architecture Office runtime beside skills', () => {
    expect(builderConfig.beforePack).toBe('./scripts/before-pack.cjs')
    expect(builderConfig.extraResources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'vendor/office-runtime/${os}-${arch}',
        to: 'office-runtime',
        filter: expect.arrayContaining([
          '**/*',
          '!**/__pycache__/**/*',
          '!**/*.pyc',
          '!**/tests/**/*'
        ])
      }),
      expect.objectContaining({
        from: 'vendor/office-fonts',
        to: 'office-fonts',
        filter: ['NotoSerifSC-Regular.ttf', 'NotoSerifSC-Bold.ttf', 'OFL.txt', 'fonts.json']
      })
    ]))
  })

  it('normalizes electron-builder platform and architecture values', () => {
    expect(beforePack._internals.normalizePlatform('darwin')).toBe('mac')
    expect(beforePack._internals.normalizePlatform('win32')).toBe('win')
    expect(beforePack._internals.normalizePlatform('linux')).toBe('linux')
    expect(beforePack._internals.normalizeArch('arm64')).toBe('arm64')
    expect(beforePack._internals.normalizeArch(1)).toBe('x64')
    expect(beforePack._internals.normalizeArch(0)).toBe('ia32')
    expect(beforePack._internals.normalizeArch(3)).toBe('arm64')
    expect(beforePack._internals.CODEX_PACKAGE_BY_TARGET['win-x64']).toBe('@openai/codex-win32-x64')
  })

  it('requires Python plus Word Excel and PowerPoint libraries in the packaged app', () => {
    const root = tempRoot()
    const context = macContext(root)
    const resources = afterPack._internals.packedResourcesDir(context)
    const python = afterPack._internals.officeRuntimePythonPath(context)
    const sitePackages = afterPack._internals.officeRuntimeSitePackagesPath(context)

    ensurePath(python)
    ensurePath(join(resources, 'office-runtime', 'runtime.json'))
    for (const moduleName of afterPack.OFFICE_RUNTIME_IMPORTS) {
      ensurePath(join(sitePackages, moduleName), true)
    }
    writeFileSync(join(resources, 'office-runtime', 'runtime.json'), JSON.stringify({
      pythonLine: afterPack.OFFICE_RUNTIME_PYTHON_LINE,
      imports: afterPack.OFFICE_RUNTIME_IMPORTS
    }), 'utf8')

    expect(() => afterPack._internals.validateBundledOfficeRuntime(context)).not.toThrow()

    rmSync(join(sitePackages, 'openpyxl'), { recursive: true, force: true })
    expect(() => afterPack._internals.validateBundledOfficeRuntime(context)).toThrow(/openpyxl/)
  })

  it('keeps the COS-hosted data-compliance runtime out of Windows installers', () => {
    const root = tempRoot()
    const context = {
      appOutDir: join(root, 'win-x64'),
      electronPlatformName: 'win32',
      arch: 'x64',
      packager: { appInfo: { productFilename: 'legalwork' }, projectDir: join(root, 'project') }
    }
    const resources = afterPack._internals.packedResourcesDir(context)
    const python = afterPack._internals.officeRuntimePythonPath(context)
    const sitePackages = afterPack._internals.officeRuntimeSitePackagesPath(context)
    ensurePath(python)
    for (const moduleName of afterPack.OFFICE_RUNTIME_IMPORTS) {
      ensurePath(join(sitePackages, moduleName), true)
    }
    writeFileSync(join(resources, 'office-runtime', 'runtime.json'), JSON.stringify({
      pythonLine: afterPack.OFFICE_RUNTIME_PYTHON_LINE,
      dataComplianceReady: false,
      imports: afterPack.OFFICE_RUNTIME_IMPORTS
    }), 'utf8')

    expect(() => afterPack._internals.validateBundledOfficeRuntime(context)).not.toThrow()
    writeFileSync(join(resources, 'office-runtime', 'runtime.json'), JSON.stringify({
      pythonLine: afterPack.OFFICE_RUNTIME_PYTHON_LINE,
      dataComplianceReady: true,
      imports: [...afterPack.OFFICE_RUNTIME_IMPORTS, 'paddle']
    }), 'utf8')
    expect(() => afterPack._internals.validateBundledOfficeRuntime(context)).toThrow(/leaked/)
  })

  it('never runs npm against the completed package', () => {
    const source = readFileSync(require.resolve('../../scripts/after-pack.cjs'), 'utf8')
    expect(source).not.toContain("['prune', '--omit=dev'")
    expect(source).not.toContain('execFileSync(prune.command')
  })

  it('rejects absolute or broken Office runtime symlinks before signing', () => {
    const root = tempRoot()
    const runtime = join(root, 'office-runtime', 'python')
    const bin = join(runtime, 'bin')
    const versionedPython = join(bin, 'python3.11')
    const python = join(bin, 'python3')
    ensurePath(versionedPython)

    symlinkSync('python3.11', python)
    expect(() => afterPack._internals.validateRelocatableSymlinks(runtime)).not.toThrow()

    unlinkSync(python)
    symlinkSync('/temporary/build/python3.11', python)
    // 绝对路径指向的构建期目标在打包后已不存在（dead link），新实现会直接删除该
    // 死链接而不是抛错（避免 Linux CI 临时目录名变化导致打包间歇失败）。
    expect(() => afterPack._internals.validateRelocatableSymlinks(runtime)).not.toThrow()
    expect(existsSync(python)).toBe(false)

    symlinkSync('missing-python3.11', python)
    expect(() => afterPack._internals.validateRelocatableSymlinks(runtime)).toThrow(/broken symlink/)
  })

  it('rejects a package that is missing the application-owned PDF font', () => {
    const root = tempRoot()
    const context = macContext(root)

    expect(() => afterPack._internals.validateBundledPdfFonts(context)).toThrow(
      /bundled PDF font/
    )
  })
})
