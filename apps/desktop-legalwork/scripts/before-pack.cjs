const { execFileSync } = require('node:child_process')
const { join } = require('node:path')

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

async function beforePack(context) {
  const platform = normalizePlatform(context.electronPlatformName)
  const arch = normalizeArch(context.arch)
  const projectDir = context.packager?.projectDir || join(__dirname, '..')
  if (process.env.LEGALWORK_SKIP_OFFICE_RUNTIME === '1') {
    console.log('[before-pack] Skipping Office runtime preparation (using existing bundled runtime).')
    return
  }
  const script = join(projectDir, 'scripts', 'prepare-office-runtime.cjs')
  console.log(`[before-pack] Preparing bundled Office runtime for ${platform}-${arch}...`)
  execFileSync(process.execPath, [script, '--platform', platform, '--arch', arch], {
    cwd: projectDir,
    env: process.env,
    stdio: 'inherit',
    windowsHide: true
  })
}

exports._internals = { normalizePlatform, normalizeArch }
exports.default = beforePack
