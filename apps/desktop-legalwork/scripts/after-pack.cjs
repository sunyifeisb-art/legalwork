const { execFileSync } = require('node:child_process')
const { existsSync, rmSync } = require('node:fs')
const { join } = require('node:path')

const LEGALWORK_RUNTIME_REQUIRED_PATHS = [
  'legalwork/dist/cli/serve-entry.js',
  'legalwork/package.json',
  'legalwork/package-lock.json',
  'legalwork/node_modules/zod/package.json',
  'legalwork/node_modules/diff/package.json',
  'legalwork/node_modules/@modelcontextprotocol/sdk/package.json'
]

const DATA_COMPLIANCE_REQUIRED_PATHS = [
  'vendor/data-compliance-review-codex/data-compliance-web/app.py',
  'vendor/data-compliance-review-codex/data-compliance-web/server_entry.py',
  'vendor/data-compliance-review-codex/data-compliance-web/desensitize_engine.py',
  'vendor/data-compliance-review-codex/data-compliance-web/requirements.txt',
  'vendor/data-compliance-review-codex/data-compliance-web/templates/index.html',
  'vendor/data-compliance-review-codex/data-compliance-web/templates/result.html',
  'vendor/data-compliance-review-codex/data-compliance-web/config/review-paths.json'
]

const DATA_COMPLIANCE_OPTIONAL_PATHS = [
  'vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/local-regulations.sqlite3'
]

// legalwork 不使用相机 / 麦克风 / 蓝牙 / 相册。Electron 框架默认在 Info.plist 里塞了这些
// 权限用途串，会导致 macOS 在相关 API 被触达时弹出无谓的权限请求（如相册访问）。
// 打包后、签名前删掉这些键，即可从根本上避免这些与功能无关的权限弹窗。
const MAC_UNUSED_PERMISSION_KEYS = [
  'NSCameraUsageDescription',
  'NSMicrophoneUsageDescription',
  'NSBluetoothAlwaysUsageDescription',
  'NSBluetoothPeripheralUsageDescription',
  'NSPhotoLibraryUsageDescription',
  'NSPhotoLibraryAddUsageDescription'
]

function normalizePlatform(platform) {
  return platform === 'win' ? 'win32' : platform
}

function appBundlePath(context) {
  return join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`)
}

function packedResourcesDir(context) {
  if (normalizePlatform(context.electronPlatformName) === 'darwin') {
    return join(appBundlePath(context), 'Contents', 'Resources')
  }
  return join(context.appOutDir, 'resources')
}

function unpackedAppRoot(context) {
  return join(packedResourcesDir(context), 'app.asar.unpacked')
}

function assertExists(path, label) {
  if (!existsSync(path)) {
    throw new Error(`[after-pack] Missing ${label}: ${path}`)
  }
}

function npmCommand(args, platform = process.platform) {
  if (platform === 'win32') {
    return {
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', 'npm', ...args]
    }
  }
  return { command: 'npm', args }
}

function prunePackedLegalworkDependencies(context) {
  const root = unpackedAppRoot(context)
  const legalworkDir = join(root, 'legalwork')
  if (!existsSync(legalworkDir)) return

  assertExists(join(legalworkDir, 'package.json'), 'Legalwork package manifest')
  assertExists(join(legalworkDir, 'node_modules'), 'Legalwork node_modules')

  const prune = npmCommand(['prune', '--omit=dev', '--ignore-scripts'])
  execFileSync(prune.command, prune.args, {
    cwd: legalworkDir,
    env: {
      ...process.env,
      npm_config_audit: 'false',
      npm_config_fund: 'false'
    },
    stdio: 'inherit'
  })

  // Keep native SQLite on the app root dependency so electron-builder's
  // native-module rebuild owns the target arch and Electron ABI.
  assertExists(
    join(root, 'node_modules', 'better-sqlite3', 'package.json'),
    'root better-sqlite3 dependency'
  )
  rmSync(join(legalworkDir, 'node_modules', 'better-sqlite3'), { recursive: true, force: true })
}

function validateBundledLegalworkRuntime(context) {
  const root = unpackedAppRoot(context)
  for (const relativePath of LEGALWORK_RUNTIME_REQUIRED_PATHS) {
    assertExists(join(root, relativePath), relativePath)
  }
  assertExists(
    join(root, 'node_modules', 'better-sqlite3', 'package.json'),
    'root better-sqlite3 dependency'
  )
}

function validateBundledDataComplianceRuntime(context) {
  const root = unpackedAppRoot(context)
  for (const relativePath of DATA_COMPLIANCE_REQUIRED_PATHS) {
    assertExists(join(root, relativePath), relativePath)
  }
  for (const relativePath of DATA_COMPLIANCE_OPTIONAL_PATHS) {
    const absolutePath = join(root, relativePath)
    if (!existsSync(absolutePath)) {
      console.warn(`[after-pack] Optional data compliance resource missing: ${relativePath}`)
    }
  }
}

function maybeAdhocSignMacApp(context) {
  if (normalizePlatform(context.electronPlatformName) !== 'darwin') {
    return
  }

  if (
    process.env.CSC_LINK ||
    process.env.CSC_NAME ||
    process.env.CSC_KEY_PASSWORD ||
    process.env.MAC_SIGN === '1'
  ) {
    console.log('[after-pack] Developer ID signing is enabled, skipping ad-hoc signing.')
    return
  }

  const appBundle = appBundlePath(context)
  if (!existsSync(appBundle)) {
    throw new Error(`[after-pack] App bundle not found for ad-hoc signing: ${appBundle}`)
  }

  execFileSync(
    'codesign',
    ['--force', '--deep', '--sign', '-', '--timestamp=none', appBundle],
    { stdio: 'inherit' }
  )
}

function stripUnnecessaryMacPermissions(context) {
  if (normalizePlatform(context.electronPlatformName) !== 'darwin') {
    return
  }
  const infoPlist = join(appBundlePath(context), 'Contents', 'Info.plist')
  if (!existsSync(infoPlist)) {
    console.warn(`[after-pack] Info.plist not found, skip permission cleanup: ${infoPlist}`)
    return
  }
  for (const key of MAC_UNUSED_PERMISSION_KEYS) {
    try {
      execFileSync('/usr/libexec/PlistBuddy', ['-c', `Delete :${key}`, infoPlist], {
        stdio: 'ignore'
      })
      console.log(`[after-pack] Removed unused Info.plist permission key: ${key}`)
    } catch {
      // Key absent — nothing to remove.
    }
  }
}

async function afterPack(context) {
  prunePackedLegalworkDependencies(context)
  validateBundledLegalworkRuntime(context)
  validateBundledDataComplianceRuntime(context)
  stripUnnecessaryMacPermissions(context)
  maybeAdhocSignMacApp(context)
}

exports.LEGALWORK_RUNTIME_REQUIRED_PATHS = LEGALWORK_RUNTIME_REQUIRED_PATHS
exports.DATA_COMPLIANCE_REQUIRED_PATHS = DATA_COMPLIANCE_REQUIRED_PATHS
exports.DATA_COMPLIANCE_OPTIONAL_PATHS = DATA_COMPLIANCE_OPTIONAL_PATHS
exports._internals = {
  appBundlePath,
  packedResourcesDir,
  unpackedAppRoot,
  npmCommand,
  prunePackedLegalworkDependencies,
  validateBundledLegalworkRuntime,
  validateBundledDataComplianceRuntime,
  stripUnnecessaryMacPermissions
}
exports.default = afterPack
