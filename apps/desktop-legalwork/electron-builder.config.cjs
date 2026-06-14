const { existsSync, readFileSync } = require('node:fs')
const { join } = require('node:path')

function loadLocalReleaseEnv() {
  const candidates = [
    process.env.LEGALWORK_RELEASE_ENV,
    join(__dirname, 'scripts', 'release.local.env'),
    join(__dirname, 'release.local.env')
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue
    for (const rawLine of readFileSync(candidate, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!match) continue
      let value = match[2].trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[match[1]]) process.env[match[1]] = value
    }
    break
  }
}

loadLocalReleaseEnv()

const hasExplicitMacSigningIdentity = Boolean(
  process.env.CSC_LINK ||
    process.env.CSC_NAME ||
    process.env.CSC_KEY_PASSWORD ||
    process.env.MAC_SIGN === '1'
)

const hasNotaryToolCredentials = Boolean(
  process.env.APPLE_API_KEY_ID &&
    process.env.APPLE_API_ISSUER &&
    (process.env.APPLE_API_KEY || process.env.APPLE_API_KEY_BASE64)
)

const r2PublicBaseUrl = (process.env.R2_PUBLIC_BASE_URL || 'https://legalwork.local/api/r2')
  .trim()
  .replace(/\/+$/, '')
const r2ReleasePrefix = (process.env.R2_RELEASE_PREFIX || 'legalwork')
  .trim()
  .replace(/^\/+|\/+$/g, '')
const updateChannel = normalizeUpdateChannel(process.env.LEGALWORK_UPDATE_CHANNEL || 'stable')
const genericUpdateUrl = `${r2PublicBaseUrl}/${r2ReleasePrefix}/channels/${updateChannel}/latest/`
const releaseAppVersion = (process.env.LEGALWORK_APP_VERSION || '')
  .trim()
  .replace(/^v(?=\d)/i, '')
const artifactVersion = releaseAppVersion || '${version}'

function normalizeUpdateChannel(raw) {
  const value = String(raw || '').trim()
  if (value === 'stable' || value === 'frontier') return value
  throw new Error(`LEGALWORK_UPDATE_CHANNEL must be "stable" or "frontier", got: ${raw}`)
}

if (releaseAppVersion && !/^\d+\.\d+\.\d+$/.test(releaseAppVersion)) {
  throw new Error(
    `LEGALWORK_APP_VERSION must be a valid x.y.z semver for electron-updater, got: ${releaseAppVersion}`
  )
}

module.exports = {
  appId: 'com.xingyuzhong.legalwork',
  productName: 'legalwork',
  asar: true,
  asarUnpack: [
    '**/legalwork/dist/**/*',
    '**/legalwork/package*.json',
    '**/legalwork/node_modules/**/*',
    '**/redaction/**/*',
    '**/document/**/*',
    '**/vendor/data-compliance-review-codex/data-compliance-web/**/*',
    '**/vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/**/*',
    '**/node_modules/better-sqlite3/**/*',
    '**/node_modules/bindings/**/*',
    '**/node_modules/file-uri-to-path/**/*'
  ],
  npmRebuild: true,
  directories: {
    output: process.env.LEGALWORK_DIST_DIR || 'dist'
  },
  extraResources: [
    {
      from: '../../skills',
      to: 'skills',
      filter: ['**/*', '!__pycache__/**/*', '!_gen_skill.py', '!_tmp_gen.py']
    }
  ],
  files: [
    'out/**/*',
    'package.json',
    'legalwork/dist/**/*',
    'legalwork/package.json',
    'legalwork/package-lock.json',
    'legalwork/node_modules/**/*',
    'redaction/**/*',
    'document/**/*',
    'vendor/data-compliance-review-codex/data-compliance-web/**/*',
    'vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/**/*',
    '!vendor/data-compliance-review-codex/data-compliance-web/venv/**/*',
    '!vendor/data-compliance-review-codex/data-compliance-web/uploads/**/*',
    '!vendor/data-compliance-review-codex/data-compliance-web/output/**/*',
    '!vendor/data-compliance-review-codex/**/__pycache__/**/*',
    '!vendor/data-compliance-review-codex/**/.openclaw/**/*',
    '!redaction/**/__pycache__/**/*',
    '!document/**/__pycache__/**/*',
    '!**/*.pyc',
    '!**/*.pyo',
    '!**/*.map',
    '!**/*.d.ts',
    '!**/*.ts',
    '!**/tsconfig*.json',
    '!**/README*',
    '!**/CHANGELOG*',
    '!**/node_modules/openclaw/**/*'
  ],
  artifactName: `legalwork-${artifactVersion}-\${os}-\${arch}.\${ext}`,
  publish: [
    {
      provider: 'github'
    }
  ],
  afterPack: './scripts/after-pack.cjs',
  afterSign: './scripts/mac-notarize.cjs',
  mac: {
    category: 'public.app-category.developer-tools',
    identity: hasExplicitMacSigningIdentity ? undefined : null,
    // We notarize in scripts/mac-notarize.cjs so APPLE_API_KEY_BASE64 can be supported.
    notarize: false,
    hardenedRuntime: hasExplicitMacSigningIdentity,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.inherit.plist',
    icon: './src/asset/img/legalwork.png',
    // arm64 (Apple Silicon) + x64 (Intel). On M 系列 Mac 本地打包会各出一组 dmg/zip。
    target: [
      { target: 'dmg', arch: ['arm64', 'x64'] },
      { target: 'zip', arch: ['arm64', 'x64'] }
    ]
  },
  dmg: {
    sign: hasExplicitMacSigningIdentity
  },
  win: {
    icon: './src/asset/img/legalwork.png',
    target: [{ target: 'nsis', arch: ['x64', 'ia32'] }]
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false,
    allowElevation: true,
    selectPerMachineByDefault: false,
    // 明确创建快捷方式；always 在覆盖安装时也会重建（即使用户曾删掉桌面图标）
    createDesktopShortcut: 'always',
    createStartMenuShortcut: true,
    shortcutName: 'legalwork',
    uninstallDisplayName: 'legalwork',
    deleteAppDataOnUninstall: false
  },
  linux: {
    category: 'Development',
    icon: './src/asset/img/legalwork.png',
    target: [{ target: 'AppImage', arch: ['x64'] }]
  },
  extraMetadata: {
    ...(releaseAppVersion ? { version: releaseAppVersion } : {}),
    updateChannel,
    buildHints: {
      macSigningEnabled: hasExplicitMacSigningIdentity,
      notarizationEnabled: hasNotaryToolCredentials
    }
  }
}
