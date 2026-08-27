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
    '**/node_modules/file-uri-to-path/**/*',
    '**/node_modules/@napi-rs/canvas/**/*',
    '**/node_modules/@openai/codex*/**/*'
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
    },
    {
      // beforePack prepares exactly this target. FileSet supports ${os}/${arch}
      // macros, so each installer carries only its own relocatable Python runtime.
      from: 'vendor/office-runtime/${os}-${arch}',
      to: 'office-runtime',
      // Ship Python sources, not build-time bytecode/test caches.  Keeping both
      // copies almost doubles the number of files that Defender scans while
      // NSIS installs the runtime.  Python can import the sources directly and
      // may regenerate bytecode in the per-user install directory.
      filter: [
        '**/*',
        '!**/__pycache__/**/*',
        '!**/*.pyc',
        '!**/*.pyo',
        '!**/test/**/*',
        '!**/tests/**/*',
        '!**/testing/**/*'
      ]
    },
    {
      // Deterministic PDF rendering uses this bundled OFL-licensed CJK font.
      // It must never fall back to fonts or office/PDF apps installed by users.
      from: 'vendor/office-fonts',
      to: 'office-fonts',
      filter: ['NotoSerifSC-Regular.ttf', 'NotoSerifSC-Bold.ttf', 'OFL.txt', 'fonts.json']
    },
    // ocr-runtime(paddle-models)已改为从腾讯云 COS 的合规环境包下载,不进安装包(瘦身)。
    // OCR/脱敏首次用时由 data-compliance-runtime 从 COS 拉取,见 ensureComplianceBundle。
    {
      from: '../../ocr_agent.py',
      to: 'ocr_agent.py'
    },
    {
      from: 'scripts',
      to: 'scripts',
      filter: ['ima-mcp-server.py']
    },
    {
      from: '../../document',
      to: 'document',
      filter: ['**/*', '!**/__pycache__/**/*', '!**/*.pyc', '!**/*.pyo', '!.DS_Store']
    },
    {
      from: 'error-report.config.json',
      to: 'error-report.config.json'
    }
  ],
  files: [
    '!.dev-dist/**/*',
    'dev-hot-entry.cjs',
    'out/**/*',
    'package.json',
    'node_modules/@openai/codex*/**/*',
    // Windows native Codex executables are staged as direct extraResources so
    // NSIS writes the two large binaries once instead of unpacking + copying.
    '!node_modules/@openai/codex-win32-*/**/*',
    'legalwork/dist/**/*',
    'legalwork/package.json',
    'legalwork/package-lock.json',
    'legalwork/node_modules/**/*',
    // 排除 legalwork 下 better-sqlite3 残壳（只有源码无 .node），避免遮蔽根
    // node_modules/better-sqlite3（含编译好的原生模块），否则 serve-entry 加载
    // 失败降级 JSONL 导致 main 探测超时连不上智能体。
    '!legalwork/node_modules/better-sqlite3/**/*',
    'redaction/**/*',
    'document/**/*',
    'vendor/data-compliance-review-codex/data-compliance-web/**/*',
    'vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/**/*',
    '!vendor/data-compliance-review-codex/data-compliance-web/venv/**/*',
    '!vendor/data-compliance-review-codex/data-compliance-web/uploads/**/*',
    '!vendor/data-compliance-review-codex/data-compliance-web/output/**/*',
    '!vendor/data-compliance-review-codex/**/__pycache__/**/*',
    '!vendor/data-compliance-review-codex/**/.openclaw/**/*',
    // 合规运行时只读 knowledge-base/local-regulations.sqlite3，下列法规源文档(md/pdf)
    // 仅用于构建该 sqlite，运行时无引用，排除以缩小安装包(约 22M)。
    '!vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/regulations-md/**/*',
    '!vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/regulations-source/**/*',
    '!vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/foreign-regulations-md/**/*',
    '!vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/foreign-regulations-source-docs/**/*',
    '!vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/foreign-regulations-seed/**/*',
    '!vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/foreign-regulations/**/*',
    '!vendor/data-compliance-review-codex/projects/data-compliance-ai-project-kit/knowledge-base/data-outbound/**/*',
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
    '!**/node_modules/openclaw/**/*',
    // 排除 agent 子包的开发/构建依赖：运行时只跑 legalwork/dist 编译产物，
    // 这些包不参与运行，却会被 legalwork/node_modules/**/* 整体打入，平白增大安装包。
    '!legalwork/node_modules/typescript/**/*',
    '!legalwork/node_modules/vite/**/*',
    '!legalwork/node_modules/vitest/**/*',
    '!legalwork/node_modules/@vitest/**/*',
    '!legalwork/node_modules/@types/**/*',
    '!legalwork/node_modules/@rolldown/**/*',
    '!legalwork/node_modules/rolldown/**/*',
    '!legalwork/node_modules/lightningcss*/**/*',
    '!legalwork/node_modules/esbuild*/**/*',
    '!legalwork/node_modules/.bin/**/*'
  ],
  artifactName: `legalwork-${artifactVersion}-\${os}-\${arch}.\${ext}`,
  publish: [
    {
      provider: 'github'
    }
  ],
  beforePack: './scripts/before-pack.cjs',
  afterPack: './scripts/after-pack.cjs',
  afterSign: './scripts/mac-notarize.cjs',
  mac: {
    category: 'public.app-category.developer-tools',
    identity: hasExplicitMacSigningIdentity ? undefined : null,
    notarize: false,
    hardenedRuntime: hasExplicitMacSigningIdentity,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.inherit.plist',
    icon: './src/asset/img/legalwork.png',
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
    extraResources: [
      {
        from: 'vendor/codex-runtime/win-${arch}',
        to: 'codex-runtime',
        filter: ['**/*']
      }
    ],
    // 4 个版本:win x64 + win ia32(32位),mac arm64 + mac x64
    target: [{ target: 'nsis', arch: ['x64', 'ia32'] }]
  },
  nsis: {
    include: 'build/installer.nsh',
    // These large, already-compressed/runtime files are emitted directly by
    // NSIS instead of entering electron-builder's atomic 7z temp-copy path.
    // This option applies its exclusion globally but only restores matching
    // files under resources. Never list .exe/.dll here or Electron itself can
    // disappear from the 7z payload. The safe resource-only extensions below
    // avoid redundant compression without omitting top-level application files.
    preCompressedFileExtensions: ['.pyd', '.node', '.asar', '.ttf'],
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false,
    allowElevation: true,
    selectPerMachineByDefault: false,
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
    main: './dev-hot-entry.cjs',
    updateChannel,
    buildHints: {
      macSigningEnabled: hasExplicitMacSigningIdentity,
      notarizationEnabled: hasNotaryToolCredentials
    }
  }
}
