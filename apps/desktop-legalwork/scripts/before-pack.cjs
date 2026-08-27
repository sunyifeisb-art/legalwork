const { execFileSync } = require('node:child_process')
const { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const { join } = require('node:path')

const CODEX_PACKAGE_BY_TARGET = {
  'mac-arm64': '@openai/codex-darwin-arm64',
  'mac-x64': '@openai/codex-darwin-x64',
  'win-x64': '@openai/codex-win32-x64',
  'linux-x64': '@openai/codex-linux-x64'
}

function normalizePlatform(platform) {
  if (platform === 'darwin') return 'mac'
  if (platform === 'win32' || platform === 'win') return 'win'
  if (platform === 'linux') return 'linux'
  throw new Error(`[before-pack] Unsupported platform for Office runtime: ${platform}`)
}

function normalizeArch(arch) {
  // electron-builder may expose Arch enum numbers or strings depending on API path.
  if (typeof arch === 'string') {
    if (arch === 'arm64' || arch === 'x64' || arch === 'ia32') return arch
  }
  const numeric = Number(arch)
  if (numeric === 0) return 'ia32'
  if (numeric === 1) return 'x64'
  if (numeric === 3) return 'arm64'
  throw new Error(`[before-pack] Unsupported architecture for Office runtime: ${String(arch)}`)
}

function targetCodexPackage(projectDir, platform, arch) {
  const target = `${platform}-${arch}`
  const packageName = CODEX_PACKAGE_BY_TARGET[target]
  if (!packageName) {
    throw new Error(`[before-pack] Codex does not provide a native package for ${target}`)
  }
  const packageRoot = join(projectDir, 'node_modules', ...packageName.split('/'))
  const codexManifestPath = join(projectDir, 'node_modules', '@openai', 'codex', 'package.json')
  const codexManifest = JSON.parse(readFileSync(codexManifestPath, 'utf8'))
  const aliasSpec = codexManifest.optionalDependencies?.[packageName]
  if (!aliasSpec) {
    throw new Error(`[before-pack] ${packageName} is absent from Codex optionalDependencies`)
  }
  return { packageName, packageRoot, packageSpec: aliasSpec.replace(/^npm:/, '') }
}

function stageWindowsCodexRuntime(projectDir, platform, arch) {
  if (platform !== 'win' || arch !== 'x64') return
  const { packageName, packageRoot, packageSpec } = targetCodexPackage(projectDir, platform, arch)
  const target = join(projectDir, 'vendor', 'codex-runtime', 'win-x64')
  const required = [
    join('bin', 'codex.exe'),
    join('bin', 'codex-code-mode-host.exe'),
    join('codex-path', 'rg.exe'),
    join('codex-resources', 'codex-command-runner.exe'),
    join('codex-resources', 'codex-windows-sandbox-setup.exe'),
    'codex-package.json'
  ]
  if (required.every((path) => existsSync(join(target, path)))) return

  let temporaryRoot
  let resolvedPackageRoot = packageRoot
  try {
    if (!existsSync(join(packageRoot, 'package.json'))) {
      // npm install mutates the host dependency tree and can silently replace
      // Electron/native modules during a macOS -> Windows cross-build. npm pack
      // downloads the exact optional package without touching node_modules.
      temporaryRoot = mkdtempSync(join(tmpdir(), 'legalwork-codex-runtime-'))
      console.log(`[before-pack] Fetching target Codex runtime ${packageName}...`)
      const output = execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', [
        'pack', packageSpec, '--force', '--pack-destination', temporaryRoot, '--json'
      ], {
        cwd: projectDir,
        env: process.env,
        encoding: 'utf8',
        windowsHide: true
      })
      const packed = JSON.parse(output)
      const filename = packed?.[0]?.filename
      if (!filename) throw new Error('npm pack did not report an archive filename')
      const extracted = join(temporaryRoot, 'extracted')
      mkdirSync(extracted, { recursive: true })
      execFileSync('tar', ['-xzf', join(temporaryRoot, filename), '-C', extracted], {
        cwd: projectDir,
        env: process.env,
        stdio: 'inherit',
        windowsHide: true
      })
      resolvedPackageRoot = join(extracted, 'package')
    }

    const source = join(resolvedPackageRoot, 'vendor', 'x86_64-pc-windows-msvc')
    for (const path of required) {
      if (!existsSync(join(source, path))) {
        throw new Error(`[before-pack] Missing Windows Codex runtime file: ${join(source, path)}`)
      }
    }
    rmSync(target, { recursive: true, force: true })
    mkdirSync(target, { recursive: true })
    cpSync(source, target, { recursive: true, force: true })
  } finally {
    if (temporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true })
  }
}

async function beforePack(context) {
  const platform = normalizePlatform(context.electronPlatformName)
  const arch = normalizeArch(context.arch)
  const projectDir = context.packager?.projectDir || join(__dirname, '..')
  targetCodexPackage(projectDir, platform, arch)
  stageWindowsCodexRuntime(projectDir, platform, arch)
  const script = join(projectDir, 'scripts', 'prepare-office-runtime.cjs')
  console.log(`[before-pack] Preparing bundled Office runtime for ${platform}-${arch}...`)
  execFileSync(process.execPath, [script, '--platform', platform, '--arch', arch], {
    cwd: projectDir,
    env: process.env,
    stdio: 'inherit',
    windowsHide: true
  })
}

exports._internals = {
  normalizePlatform,
  normalizeArch,
  targetCodexPackage,
  stageWindowsCodexRuntime,
  CODEX_PACKAGE_BY_TARGET
}
exports.default = beforePack
