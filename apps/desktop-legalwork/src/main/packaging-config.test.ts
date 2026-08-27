import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
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

function writeInfoPlist(path: string): void {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>CFBundleName</key>
    <string>legalwork</string>
    <key>NSCameraUsageDescription</key>
    <string>This app needs access to the camera</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>This app needs access to the microphone</string>
    <key>NSBluetoothAlwaysUsageDescription</key>
    <string>This app needs access to Bluetooth</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>This app needs access to the photo library</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>This app needs write access to the photo library</string>
  </dict>
</plist>
`, 'utf8')
}

function createMacPackContext(root: string): {
  appOutDir: string
  electronPlatformName: string
  arch: string
  packager: { appInfo: { productFilename: string } }
} {
  return {
    appOutDir: join(root, 'mac-arm64'),
    electronPlatformName: 'darwin',
    arch: 'arm64',
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
  it('uses the faster default 7z payload instead of the slow ZIP extractor', () => {
    expect(builderConfig.nsis.useZip).toBeUndefined()
  })

  it('bounds Windows process shutdown without PowerShell or WMI', () => {
    const installerInclude = readFileSync(join(
      dirname(require.resolve('../../electron-builder.config.cjs')),
      'build',
      'installer.nsh'
    ), 'utf8')
    const executableLines = installerInclude
      .split(/\r?\n/)
      .filter((line) => !line.trimStart().startsWith(';'))
      .join('\n')

    expect(builderConfig.nsis.include).toBe('build/installer.nsh')
    expect(installerInclude).toContain('${nsProcess::FindProcess}')
    expect(installerInclude).toContain('/TIMEOUT=10000')
    expect(installerInclude).toContain('taskkill.exe')
    expect(executableLines).not.toMatch(/powershell|Get-CimInstance|Win32_Process/i)
  })

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
      '**/legalwork/node_modules/**/*',
      '**/node_modules/@napi-rs/canvas/**/*'
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

  it('packages the pure-JavaScript PDF geometry fallback and removes wrong-arch Canvas binaries', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)
    const unpackedRoot = afterPack._internals.unpackedAppRoot(context)
    const rootCanvas = join(unpackedRoot, 'node_modules/@napi-rs/canvas')
    const legalworkCanvas = join(unpackedRoot, 'legalwork/node_modules/@napi-rs/canvas')
    const arm64Package = join(unpackedRoot, 'node_modules/@napi-rs/canvas-darwin-arm64')
    const x64Package = join(unpackedRoot, 'node_modules/@napi-rs/canvas-darwin-x64')

    touch(join(rootCanvas, 'geometry.js'))
    touch(join(legalworkCanvas, 'geometry.js'))
    touch(join(arm64Package, 'skia.darwin-arm64.node'))
    touch(join(x64Package, 'skia.darwin-x64.node'))

    afterPack._internals.pruneIncompatibleCanvasNativePackages(context)

    expect(existsSync(arm64Package)).toBe(true)
    expect(existsSync(x64Package)).toBe(false)
    expect(() => afterPack._internals.validateBundledPdfParserRuntime(context)).not.toThrow()
  })

  it('rejects an installer that omits the PDF geometry fallback', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)

    expect(() => afterPack._internals.validateBundledPdfParserRuntime(context)).toThrow(
      /PDF DOM geometry fallback/
    )
  })

  it('maps Electron target architectures to their Canvas native package', () => {
    expect(afterPack._internals.expectedCanvasNativePackage({
      electronPlatformName: 'darwin',
      arch: 'x64'
    })).toBe('canvas-darwin-x64')
    expect(afterPack._internals.expectedCanvasNativePackage({
      electronPlatformName: 'darwin',
      arch: 3
    })).toBe('canvas-darwin-arm64')
    expect(afterPack._internals.expectedCanvasNativePackage({
      electronPlatformName: 'win32',
      arch: 'x64'
    })).toBe('canvas-win32-x64-msvc')
  })

  it('validates the unpacked Legalwork runtime before release artifacts are created', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)
    const unpackedRoot = afterPack._internals.unpackedAppRoot(context)

    for (const relativePath of afterPack.LEGALWORK_RUNTIME_REQUIRED_PATHS) {
      touch(join(unpackedRoot, relativePath))
    }
    writeFileSync(
      join(unpackedRoot, 'legalwork/dist/loop/agent-loop.js'),
      'const requestToolSpecs = [];\nvoid requestToolSpecs;\n',
      'utf8'
    )
    touch(join(unpackedRoot, 'node_modules/better-sqlite3/package.json'))

    expect(() => afterPack._internals.validateBundledLegalworkRuntime(context)).not.toThrow()

    rmSync(join(unpackedRoot, 'legalwork/node_modules/zod'), { recursive: true, force: true })

    expect(() => afterPack._internals.validateBundledLegalworkRuntime(context)).toThrow(
      /legalwork\/node_modules\/zod\/package\.json/
    )
  })

  it('rejects a bundled Agent Loop that reads requestToolSpecs before initialization', () => {
    const root = tempRoot()
    const agentLoopPath = join(root, 'agent-loop.js')
    writeFileSync(
      agentLoopPath,
      'process.stderr.write(String(requestToolSpecs.length));\nconst requestToolSpecs = [];\n',
      'utf8'
    )

    expect(() => afterPack._internals.validateBundledAgentLoop(agentLoopPath)).toThrow(
      /requestToolSpecs is accessed before initialization/
    )
  })

  it('rejects temporary ZERO-TOOLS diagnostics in the bundled Agent Loop', () => {
    const root = tempRoot()
    const agentLoopPath = join(root, 'agent-loop.js')
    writeFileSync(
      agentLoopPath,
      'const requestToolSpecs = [];\nprocess.stderr.write("[ZERO-TOOLS]");\n',
      'utf8'
    )

    expect(() => afterPack._internals.validateBundledAgentLoop(agentLoopPath)).toThrow(
      /temporary ZERO-TOOLS diagnostics remain/
    )
  })

  it('includes data compliance resources in the packaged app', () => {
    expect(builderConfig.extraResources).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ from: 'vendor/ocr-runtime' })
    ]))
    expect(builderConfig.extraResources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '../../ocr_agent.py',
        to: 'ocr_agent.py'
      }),
      expect.objectContaining({
        from: '../../document',
        to: 'document'
      })
    ]))
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
    const runtimeSource = readFileSync(join(
      dirname(require.resolve('../../electron-builder.config.cjs')),
      'src/main/data-compliance-runtime.ts'
    ), 'utf8')
    expect(runtimeSource).toContain('legalwork/compliance/env/${machine}')
    expect(runtimeSource).toContain('legalwork-1318565101.cos.ap-guangzhou.myqcloud.com')
  })

  it('validates the packaged document OCR entrypoint and modules', () => {
    const root = tempRoot()
    const context = createMacPackContext(root)
    const resourcesRoot = afterPack._internals.packedResourcesDir(context)

    for (const relativePath of afterPack.DOCUMENT_OCR_REQUIRED_PATHS) {
      touch(join(resourcesRoot, relativePath))
    }
    mkdirSync(join(resourcesRoot, 'ocr-runtime'), { recursive: true })

    expect(() => afterPack._internals.validateBundledDocumentOcrRuntime(context)).not.toThrow()

    rmSync(join(resourcesRoot, 'ocr_agent.py'), { force: true })

    expect(() => afterPack._internals.validateBundledDocumentOcrRuntime(context)).toThrow(
      /ocr_agent\.py/
    )
  })

  it('ships the current IMA MCP server and rejects stale packaged copies', () => {
    expect(builderConfig.extraResources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: 'scripts',
        to: 'scripts',
        filter: expect.arrayContaining(['ima-mcp-server.py'])
      })
    ]))

    const root = tempRoot()
    const projectDir = join(root, 'project')
    const context = {
      ...createMacPackContext(root),
      packager: {
        ...createMacPackContext(root).packager,
        projectDir
      }
    }
    const sourcePath = join(projectDir, afterPack.IMA_MCP_SCRIPT_RELATIVE_PATH)
    const bundledPath = join(
      afterPack._internals.packedResourcesDir(context),
      afterPack.IMA_MCP_SCRIPT_RELATIVE_PATH
    )
    mkdirSync(join(sourcePath, '..'), { recursive: true })
    mkdirSync(join(bundledPath, '..'), { recursive: true })
    writeFileSync(sourcePath, 'current IMA MCP script\n', 'utf8')
    writeFileSync(bundledPath, 'current IMA MCP script\n', 'utf8')

    expect(() => afterPack._internals.validateBundledImaMcpServer(context)).not.toThrow()

    writeFileSync(bundledPath, 'stale IMA MCP script\n', 'utf8')
    expect(() => afterPack._internals.validateBundledImaMcpServer(context)).toThrow(
      /Bundled IMA MCP script is stale/
    )
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

  it('removes unused macOS privacy permission prompts from app and helper plists', () => {
    if (process.platform !== 'darwin' || !existsSync('/usr/libexec/PlistBuddy')) return

    const root = tempRoot()
    const context = createMacPackContext(root)
    const appBundle = afterPack._internals.appBundlePath(context)
    const mainPlist = join(appBundle, 'Contents/Info.plist')
    const helperPlist = join(
      appBundle,
      'Contents/Frameworks/legalwork Helper.app/Contents/Info.plist'
    )
    writeInfoPlist(mainPlist)
    writeInfoPlist(helperPlist)

    expect(afterPack._internals.macInfoPlistPaths(context)).toEqual([helperPlist, mainPlist].sort())

    afterPack._internals.stripUnnecessaryMacPermissions(context)

    for (const plist of [mainPlist, helperPlist]) {
      const content = readFileSync(plist, 'utf8')
      expect(content).toContain('CFBundleName')
      expect(content).not.toMatch(/NS(PhotoLibrary|Camera|Microphone|Bluetooth)/)
    }
  })

  it('does not run npm against an already completed package', () => {
    expect(afterPack._internals.npmCommand).toBeUndefined()
    const source = readFileSync(require.resolve('../../scripts/after-pack.cjs'), 'utf8')
    expect(source).not.toContain("['prune', '--omit=dev'")
    expect(source).not.toContain('execFileSync(prune.command')
  })
})
