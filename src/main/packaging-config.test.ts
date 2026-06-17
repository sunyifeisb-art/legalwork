import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const builderConfig = require('../../electron-builder.config.cjs')
const afterPack = require('../../scripts/after-pack.cjs')

const tempRoots: string[] = []

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'ds-gui-packaging-'))
  tempRoots.push(root)
  return root
}

function touch(path: string): void {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, '{}\n', 'utf8')
}

function createMacPackContext(root: string): {
  appOutDir: string
  electronPlatformName: string
  packager: { appInfo: { productFilename: string } }
} {
  return {
    appOutDir: join(root, 'mac-arm64'),
    electronPlatformName: 'darwin',
    packager: {
      appInfo: {
        productFilename: 'legalwork'
      }
    }
  }
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop()
    if (root) rmSync(root, { recursive: true, force: true })
  }
})

describe('electron-builder Legalwork packaging', () => {
  it('includes Legalwork runtime dependencies in the packaged app', () => {
    expect(builderConfig.files).toEqual(expect.arrayContaining([
      'legalwork/dist/**/*',
      'legalwork/package.json',
      'legalwork/package-lock.json',
      'legalwork/node_modules/**/*'
    ]))
    expect(builderConfig.asarUnpack).toEqual(expect.arrayContaining([
      '**/legalwork/dist/**/*',
      '**/legalwork/package*.json',
      '**/legalwork/node_modules/**/*'
    ]))
    expect(builderConfig.asarUnpack).not.toEqual(expect.arrayContaining([
      '**/node_modules/node-bin-darwin-*/*',
      '**/node_modules/node-bin-linux-*/*',
      '**/node_modules/node-bin-win-*/*',
      '**/node_modules/openclaw/**/*',
      '**/node_modules/@tencent-weixin/openclaw-weixin/**/*'
    ]))
    expect(builderConfig.files).toEqual(expect.arrayContaining([
      '!**/node_modules/openclaw/**/*'
    ]))
  })

  it('validates the unpacked Legalwork runtime before release artifacts are created', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)
    const unpackedRoot = afterPack._internals.unpackedAppRoot(context)

    for (const relativePath of afterPack.LEGALWORK_RUNTIME_REQUIRED_PATHS) {
      touch(join(unpackedRoot, relativePath))
    }
    touch(join(unpackedRoot, 'node_modules/better-sqlite3/package.json'))

    expect(() => afterPack._internals.validateBundledLegalworkRuntime(context)).not.toThrow()

    rmSync(join(unpackedRoot, 'legalwork/node_modules/zod'), { recursive: true, force: true })

    expect(() => afterPack._internals.validateBundledLegalworkRuntime(context)).toThrow(
      /legalwork\/node_modules\/zod\/package\.json/
    )
  })

  it('includes data compliance resources in the packaged app', () => {
    expect(builderConfig.files).toEqual(expect.arrayContaining([
      'vendor/data-compliance-review-codex/data-compliance-web/**/*',
      'vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/**/*',
      '!vendor/data-compliance-review-codex/data-compliance-web/venv/**/*',
      '!vendor/data-compliance-review-codex/data-compliance-web/uploads/**/*',
      '!vendor/data-compliance-review-codex/data-compliance-web/output/**/*'
    ]))
    expect(builderConfig.asarUnpack).toEqual(expect.arrayContaining([
      '**/vendor/data-compliance-review-codex/data-compliance-web/**/*',
      '**/vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/**/*'
    ]))
  })

  it('validates the unpacked data compliance runtime before release artifacts are created', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)
    const unpackedRoot = afterPack._internals.unpackedAppRoot(context)

    for (const relativePath of afterPack.DATA_COMPLIANCE_REQUIRED_PATHS) {
      touch(join(unpackedRoot, relativePath))
    }

    expect(() => afterPack._internals.validateBundledDataComplianceRuntime(context)).not.toThrow()

    rmSync(
      join(unpackedRoot, 'vendor/data-compliance-review-codex/data-compliance-web/server_entry.py'),
      { force: true }
    )

    expect(() => afterPack._internals.validateBundledDataComplianceRuntime(context)).toThrow(
      /data-compliance-web\/server_entry\.py/
    )
  })

  it('does not fail packaging when optional data compliance databases are absent', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)
    const unpackedRoot = afterPack._internals.unpackedAppRoot(context)

    for (const relativePath of afterPack.DATA_COMPLIANCE_REQUIRED_PATHS) {
      touch(join(unpackedRoot, relativePath))
    }

    for (const relativePath of afterPack.DATA_COMPLIANCE_OPTIONAL_PATHS) {
      rmSync(join(unpackedRoot, relativePath), { force: true })
    }

    expect(() => afterPack._internals.validateBundledDataComplianceRuntime(context)).not.toThrow()
  })

  it('runs npm through cmd.exe during Windows afterPack hooks', () => {
    expect(afterPack._internals.npmCommand(['prune'], 'win32')).toEqual({
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', 'npm', 'prune']
    })
    expect(afterPack._internals.npmCommand(['prune'], 'darwin')).toEqual({
      command: 'npm',
      args: ['prune']
    })
  })
})
