const { execFileSync } = require('node:child_process')
const { createHash } = require('node:crypto')
const { chmodSync, cpSync, existsSync, lstatSync, readFileSync, readlinkSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } = require('node:fs')
const { dirname, isAbsolute, join, relative, resolve, sep } = require('node:path')

const LEGALWORK_RUNTIME_REQUIRED_PATHS = [
  'legalwork/dist/cli/serve-entry.js',
  'legalwork/dist/loop/agent-loop.js',
  'legalwork/package.json',
  'legalwork/node_modules/zod/package.json',
  'legalwork/node_modules/diff/package.json',
  'legalwork/node_modules/@modelcontextprotocol/sdk/package.json',
  'legalwork/node_modules/@officecli/officecli/package.json'
]

const LEGALWORK_AGENT_LOOP_RELATIVE_PATH = 'legalwork/dist/loop/agent-loop.js'

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

const DOCUMENT_OCR_REQUIRED_PATHS = [
  'ocr_agent.py',
  'document/__init__.py',
  'document/intake/router.py',
  'document/ocr/router.py'
]

const OFFICE_RUNTIME_IMPORTS = ['docx', 'openpyxl', 'pptx', 'lxml', 'PIL', 'reportlab']
const DATA_COMPLIANCE_RUNTIME_IMPORTS = [
  'flask',
  'fitz',
  'openai',
  'paddle',
  'paddleocr',
  'pypdf',
  'pandas'
]
const OFFICE_RUNTIME_PYTHON_LINE = '3.11'
const BUNDLED_PDF_FONT_SOURCE_SHA256 = '050080d9255a86808f2945bffac582b31ef32bc36411ce29563b4961670c66f9'
const BUNDLED_PDF_FONT_PREPARATION_VERSION = 2
const BUNDLED_PDF_FONT_NAMES = ['NotoSerifSC-Regular.ttf', 'NotoSerifSC-Bold.ttf']
const IMA_MCP_SCRIPT_RELATIVE_PATH = 'scripts/ima-mcp-server.py'
const CANVAS_NATIVE_PACKAGE_PATTERN = /^canvas-(?:android|darwin|freebsd|linux|win32)-/
const CODEX_NATIVE_PACKAGE_PATTERN = /^codex-(?:darwin|linux|win32)-(?:arm64|x64)$/

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

function normalizeArch(arch) {
  if (typeof arch === 'string' && ['ia32', 'x64', 'arm64'].includes(arch)) return arch
  const numeric = Number(arch)
  if (numeric === 0) return 'ia32'
  if (numeric === 1) return 'x64'
  if (numeric === 3) return 'arm64'
  return String(arch)
}

function expectedCanvasNativePackage(context) {
  const platform = normalizePlatform(context.electronPlatformName)
  const arch = normalizeArch(context.arch)
  if (platform === 'darwin' && (arch === 'arm64' || arch === 'x64')) {
    return `canvas-darwin-${arch}`
  }
  if (platform === 'win32' && (arch === 'arm64' || arch === 'x64' || arch === 'ia32')) {
    return `canvas-win32-${arch}-msvc`
  }
  if (platform === 'linux' && (arch === 'arm64' || arch === 'x64')) {
    return `canvas-linux-${arch}-gnu`
  }
  return null
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

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function prunePackedLegalworkDependencies(context) {
  const root = unpackedAppRoot(context)
  const legalworkDir = join(root, 'legalwork')
  if (!existsSync(legalworkDir)) return

  assertExists(join(legalworkDir, 'package.json'), 'Legalwork package manifest')
  assertExists(join(legalworkDir, 'node_modules'), 'Legalwork node_modules')

  // Keep native SQLite on the app root dependency so electron-builder's
  // native-module rebuild owns the target arch and Electron ABI.
  assertExists(
    join(root, 'node_modules', 'better-sqlite3', 'package.json'),
    'root better-sqlite3 dependency'
  )
  rmSync(join(legalworkDir, 'node_modules', 'better-sqlite3'), { recursive: true, force: true })
}

function canvasPackageRoots(context) {
  const root = unpackedAppRoot(context)
  return [
    join(root, 'node_modules', '@napi-rs'),
    join(root, 'node_modules', 'pdf-parse', 'node_modules', '@napi-rs'),
    join(root, 'legalwork', 'node_modules', '@napi-rs'),
    join(root, 'legalwork', 'node_modules', 'pdf-parse', 'node_modules', '@napi-rs')
  ]
}

/** Remove host-architecture Canvas binaries from cross-architecture artifacts. */
function pruneIncompatibleCanvasNativePackages(context) {
  const expected = expectedCanvasNativePackage(context)
  for (const packageRoot of canvasPackageRoots(context)) {
    if (!existsSync(packageRoot)) continue
    for (const entry of readdirSync(packageRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      if (!CANVAS_NATIVE_PACKAGE_PATTERN.test(entry.name)) continue
      if (entry.name === expected) continue
      rmSync(join(packageRoot, entry.name), { recursive: true, force: true })
    }
  }
}

function expectedCodexNativePackage(context) {
  const platform = normalizePlatform(context.electronPlatformName)
  const arch = normalizeArch(context.arch)
  if (platform === 'darwin' && (arch === 'arm64' || arch === 'x64')) return `codex-darwin-${arch}`
  if (platform === 'win32' && arch === 'x64') return 'codex-win32-x64'
  if (platform === 'linux' && arch === 'x64') return 'codex-linux-x64'
  return null
}

function pruneAndValidateCodexNativePackage(context) {
  const expected = expectedCodexNativePackage(context)
  if (!expected) throw new Error('[after-pack] Unsupported Codex target platform/architecture')
  const packageRoot = join(unpackedAppRoot(context), 'node_modules', '@openai')
  if (!existsSync(packageRoot)) throw new Error('[after-pack] Missing @openai package directory')
  const platform = normalizePlatform(context.electronPlatformName)
  for (const entry of readdirSync(packageRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !CODEX_NATIVE_PACKAGE_PATTERN.test(entry.name)) continue
    if (platform === 'win32' || entry.name !== expected) {
      rmSync(join(packageRoot, entry.name), { recursive: true, force: true })
    }
  }
  if (platform === 'win32') {
    const runtimeRoot = join(packedResourcesDir(context), 'codex-runtime')
    assertExists(join(runtimeRoot, 'bin', 'codex.exe'), 'staged Windows Codex executable')
    assertExists(join(runtimeRoot, 'bin', 'codex-code-mode-host.exe'), 'staged Windows Codex code-mode host')
    assertExists(join(runtimeRoot, 'codex-path', 'rg.exe'), 'staged Windows Codex search executable')
    assertExists(join(runtimeRoot, 'codex-resources', 'codex-command-runner.exe'), 'staged Windows Codex command runner')
    assertExists(join(runtimeRoot, 'codex-resources', 'codex-windows-sandbox-setup.exe'), 'staged Windows Codex sandbox setup')
    return
  }
  const triple = {
    'codex-darwin-arm64': 'aarch64-apple-darwin',
    'codex-darwin-x64': 'x86_64-apple-darwin',
    'codex-win32-x64': 'x86_64-pc-windows-msvc',
    'codex-linux-x64': 'x86_64-unknown-linux-musl'
  }[expected]
  assertExists(
    join(packageRoot, expected, 'vendor', triple, 'bin', 'codex'),
    `target Codex executable for ${expected}`
  )
}

function validateBundledPdfParserRuntime(context) {
  const root = unpackedAppRoot(context)
  assertExists(
    join(root, 'node_modules', '@napi-rs', 'canvas', 'geometry.js'),
    'root PDF DOM geometry fallback'
  )
  assertExists(
    join(root, 'legalwork', 'node_modules', '@napi-rs', 'canvas', 'geometry.js'),
    'Legalwork PDF DOM geometry fallback'
  )

  const expected = expectedCanvasNativePackage(context)
  for (const packageRoot of canvasPackageRoots(context)) {
    if (!existsSync(packageRoot)) continue
    const incompatible = readdirSync(packageRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && CANVAS_NATIVE_PACKAGE_PATTERN.test(entry.name))
      .map((entry) => entry.name)
      .filter((name) => name !== expected)
    if (incompatible.length > 0) {
      throw new Error(
        `[after-pack] PDF Canvas runtime contains incompatible target packages: ${incompatible.join(', ')}`
      )
    }
  }
}

function projectDir(context) {
  return context.packager?.projectDir || join(__dirname, '..')
}

function restoreBundledOfficeCli(context) {
  const source = join(projectDir(context), 'legalwork', 'node_modules', '@officecli', 'officecli')
  const target = join(
    unpackedAppRoot(context),
    'legalwork',
    'node_modules',
    '@officecli',
    'officecli'
  )
  const targetBinary = join(target, 'vendor', 'officecli')
  if (!existsSync(source)) {
    console.warn(`[after-pack] OfficeCLI package not found at ${source}; skipping bundled restore.`)
    return
  }
  cpSync(source, target, { recursive: true, force: true })
  if (existsSync(targetBinary)) {
    chmodSync(targetBinary, 0o755)
    // 打包机的 host 二进制只适用于构建机自身架构。目标平台与构建机平台不一致时
    // （例如在 macOS 开发机上打 Windows 包，host 二进制是 Mach-O），这个二进制在
    // 目标平台不可执行：保留它会让 resolveOfficeCliBinaryPath 误判"二进制存在"而走
    // direct 路径（Windows 上 CreateProcess 直接失败）。删除它，回落到 officecli.js
    // shim，由 shim 在目标平台首次运行时下载正确的原生二进制。
    // 仅当"构建机是 darwin 且目标非 darwin"才删：在 Windows/Linux 打包机上，host
    // 二进制本就可用于同平台目标，删除反而迫使走需联网下载的 shim 通道。
    const hostPlatform = process.platform
    const targetPlatform = normalizePlatform(context.electronPlatformName)
    if (hostPlatform === 'darwin' && targetPlatform !== 'darwin') {
      rmSync(targetBinary, { force: true })
      console.warn(
        '[after-pack] Removed macOS host-arch OfficeCLI binary for non-darwin target; launcher shim will download the correct binary on first run.'
      )
    }
  }
  patchOfficeCliShimWindowsHide(target)
}

/**
 * Patch the bundled officecli.js launcher shim so its child-process spawn never
 * pops a console window on Windows. The shim runs `spawnSync(bin, argv, { stdio:
 * 'inherit' })` to exec the native binary; on Windows, launching a console app
 * this way without `windowsHide` shows a command-prompt window (titled
 * "Default: <path>"). MCP starts officecli through this shim whenever the native
 * binary is absent / not-yet-downloaded, so this is the reliable place to hide it.
 */
function patchOfficeCliShimWindowsHide(targetDir) {
  const shimPath = join(targetDir, 'officecli.js')
  if (!existsSync(shimPath)) {
    console.warn(`[after-pack] officecli.js shim not found at ${shimPath}; cannot apply windowsHide patch.`)
    return
  }
  const original = readFileSync(shimPath, 'utf8')
  const patched = original.replace(
    /(\{[\s'"]*stdio[\s'"]*:[\s'"]*inherit[\s'"]*)(\})/,
    "$1, windowsHide: true }"
  )
  if (patched === original) {
    console.warn(
      '[after-pack] FAILED to patch officecli.js shim: did not find the `{ stdio: "inherit" }` spawn options. Windows console popup may still occur.'
    )
    return
  }
  writeFileSync(shimPath, patched, 'utf8')
  console.warn('[after-pack] Patched officecli.js shim: spawnSync now uses windowsHide (no console popup on Windows).')
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
  validateBundledAgentLoop(join(root, LEGALWORK_AGENT_LOOP_RELATIVE_PATH))
}

/**
 * Reject a compiled runtime that can crash before the first model request.
 *
 * A temporary ZERO-TOOLS diagnostic was once inserted directly into the
 * generated agent-loop.js before `requestToolSpecs` was initialized.  The
 * resulting temporal-dead-zone exception made every document turn fail during
 * input routing and the GUI appeared to stop after an intermediate sentence.
 * Checking the actual compiled file here protects release artifacts even when
 * the TypeScript source and unit tests are clean.
 */
function validateBundledAgentLoop(agentLoopPath) {
  const source = readFileSync(agentLoopPath, 'utf8')
  const declarationIndex = source.indexOf('const requestToolSpecs')
  if (declarationIndex < 0) {
    throw new Error(`[after-pack] Invalid Legalwork agent loop: requestToolSpecs declaration missing: ${agentLoopPath}`)
  }
  if (source.slice(0, declarationIndex).includes('requestToolSpecs')) {
    throw new Error(
      `[after-pack] Invalid Legalwork agent loop: requestToolSpecs is accessed before initialization: ${agentLoopPath}`
    )
  }
  if (source.includes('[ZERO-TOOLS]') || source.includes('[ZERO-TOOLS2]')) {
    throw new Error(`[after-pack] Invalid Legalwork agent loop: temporary ZERO-TOOLS diagnostics remain: ${agentLoopPath}`)
  }
}

function officeRuntimePythonPath(context) {
  const root = join(packedResourcesDir(context), 'office-runtime', 'python')
  return normalizePlatform(context.electronPlatformName) === 'win32'
    ? join(root, 'python.exe')
    : join(root, 'bin', 'python3')
}

function officeRuntimeSitePackagesPath(context) {
  const root = join(packedResourcesDir(context), 'office-runtime', 'python')
  return normalizePlatform(context.electronPlatformName) === 'win32'
    ? join(root, 'Lib', 'site-packages')
    : join(root, 'lib', `python${OFFICE_RUNTIME_PYTHON_LINE}`, 'site-packages')
}

function validateRelocatableSymlinks(root) {
  if (!existsSync(root)) return
  const stack = [root]
  while (stack.length > 0) {
    const current = stack.pop()
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      const stat = lstatSync(path)
      if (stat.isSymbolicLink()) {
        const target = readlinkSync(path)
        const resolvedTarget = resolve(dirname(path), target)
        const fromRoot = relative(root, resolvedTarget)
        if (isAbsolute(target) || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) {
          // Some bundled Python builds embed an absolute build-time symlink
          // (e.g. share/terminfo/z/z19 -> /tmp/<build>/python/share/terminfo/h/h19).
          // The temp build dir no longer exists after packaging, so these are
          // dead links. If the absolute target still resolves to a real file
          // inside the same tree, rewrite it as a relocatable relative link;
          // otherwise drop the dead link entirely (terminfo alias entries like
          // z19 -> h19 are purely cosmetic terminal aliases — removing them does
          // not affect functionality). This was failing intermittently on Linux
          // CI where the temp build dir name changes between runs.
          const absTarget = isAbsolute(target) ? target : resolve(dirname(path), target)
          const absFromRoot = relative(root, absTarget)
          if (!absFromRoot.startsWith('..') && existsSync(absTarget)) {
            const relTarget = relative(dirname(path), absTarget)
            // Rewrite the symlink in place to a relative target.
            rmSync(path, { force: true })
            symlinkSync(relTarget, path)
            continue
          }
          if (!existsSync(absTarget)) {
            // Dead link to a removed build-time path: remove it.
            rmSync(path, { force: true })
            continue
          }
          throw new Error(`[after-pack] Office runtime contains a non-relocatable symlink: ${path} -> ${target}`)
        }
        if (!existsSync(resolvedTarget)) {
          throw new Error(`[after-pack] Office runtime contains a broken symlink: ${path} -> ${target}`)
        }
        continue
      }
      if (stat.isDirectory()) stack.push(path)
    }
  }
}

function validateBundledOfficeRuntime(context) {
  const root = join(packedResourcesDir(context), 'office-runtime')
  const python = officeRuntimePythonPath(context)
  const sitePackages = officeRuntimeSitePackagesPath(context)
  assertExists(join(root, 'runtime.json'), 'Office runtime manifest')
  assertExists(python, 'Office runtime Python executable')
  assertExists(sitePackages, 'Office runtime site-packages')
  for (const moduleName of OFFICE_RUNTIME_IMPORTS) {
    assertExists(join(sitePackages, moduleName), `Office Python module ${moduleName}`)
  }
  if (normalizePlatform(context.electronPlatformName) !== 'win32') {
    validateRelocatableSymlinks(join(root, 'python'))
    chmodSync(python, 0o755)
  }
  let manifest
  try {
    manifest = JSON.parse(readFileSync(join(root, 'runtime.json'), 'utf8'))
  } catch (error) {
    throw new Error(`[after-pack] Invalid Office runtime manifest: ${error instanceof Error ? error.message : String(error)}`)
  }
  if (manifest.pythonLine !== OFFICE_RUNTIME_PYTHON_LINE) {
    throw new Error(`[after-pack] Office runtime Python line mismatch: expected ${OFFICE_RUNTIME_PYTHON_LINE}, got ${String(manifest.pythonLine)}`)
  }
  if (!Array.isArray(manifest.imports) || OFFICE_RUNTIME_IMPORTS.some((name) => !manifest.imports.includes(name))) {
    throw new Error('[after-pack] Office runtime manifest is missing required Word/Excel/PPT imports')
  }
  if (normalizePlatform(context.electronPlatformName) === 'win32') {
    if (context.arch !== 'x64' && Number(context.arch) !== 1) {
      throw new Error('[after-pack] Bundled Windows Office runtime is supported only for x64')
    }
    if (manifest.dataComplianceReady === true ||
        DATA_COMPLIANCE_RUNTIME_IMPORTS.some((name) => manifest.imports.includes(name))) {
      throw new Error('[after-pack] COS-hosted data-compliance dependencies leaked into the installer')
    }
  }
}

function validateBundledPdfFonts(context) {
  const root = join(packedResourcesDir(context), 'office-fonts')
  assertExists(join(root, 'OFL.txt'), 'bundled PDF font license')
  const manifestPath = join(root, 'fonts.json')
  assertExists(manifestPath, 'bundled PDF font manifest')
  let manifest
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch (error) {
    throw new Error(`[after-pack] Invalid bundled PDF font manifest: ${error instanceof Error ? error.message : String(error)}`)
  }
  if (
    manifest.preparationVersion !== BUNDLED_PDF_FONT_PREPARATION_VERSION ||
    manifest.sourceSha256 !== BUNDLED_PDF_FONT_SOURCE_SHA256
  ) {
    throw new Error('[after-pack] Bundled PDF font manifest has an untrusted source checksum')
  }
  for (const name of BUNDLED_PDF_FONT_NAMES) {
    const font = join(root, name)
    assertExists(font, 'bundled deterministic PDF CJK font')
    const actual = sha256File(font)
    const expected = manifest.fonts?.[name]
    if (actual !== expected) {
      throw new Error(
        `[after-pack] Bundled PDF font checksum mismatch for ${name}: expected ${expected}, got ${actual}`
      )
    }
  }
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

function validateBundledDocumentOcrRuntime(context) {
  const root = packedResourcesDir(context)
  for (const relativePath of DOCUMENT_OCR_REQUIRED_PATHS) {
    assertExists(join(root, relativePath), relativePath)
  }
  // ocr-runtime(paddle-models)已改从腾讯云 COS 的合规环境包下载,不再打进安装包(瘦身)。
  // 运行时由 data-compliance-runtime 首次用时拉取,故此处不再校验其存在。
}

function validateBundledImaMcpServer(context) {
  const relativePath = IMA_MCP_SCRIPT_RELATIVE_PATH
  const sourcePath = join(projectDir(context), relativePath)
  const bundledPath = join(packedResourcesDir(context), relativePath)
  assertExists(sourcePath, 'IMA MCP source script')
  assertExists(bundledPath, 'bundled IMA MCP script')
  if (!readFileSync(sourcePath).equals(readFileSync(bundledPath))) {
    throw new Error(
      `[after-pack] Bundled IMA MCP script is stale and does not match the release source: ${bundledPath}`
    )
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

function findInfoPlists(root) {
  if (!existsSync(root)) return []
  const results = []
  const stack = [root]
  while (stack.length > 0) {
    const current = stack.pop()
    let entries
    try {
      entries = readdirSync(current, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(path)
      } else if (entry.isFile() && entry.name === 'Info.plist') {
        results.push(path)
      }
    }
  }
  return results.sort()
}

function macInfoPlistPaths(context) {
  const appBundle = appBundlePath(context)
  if (!existsSync(appBundle)) return []
  try {
    if (!statSync(appBundle).isDirectory()) return []
  } catch {
    return []
  }
  return findInfoPlists(appBundle)
}

function stripUnnecessaryMacPermissions(context) {
  if (normalizePlatform(context.electronPlatformName) !== 'darwin') {
    return
  }
  const infoPlists = macInfoPlistPaths(context)
  if (infoPlists.length === 0) {
    console.warn(`[after-pack] Info.plist not found, skip permission cleanup: ${appBundlePath(context)}`)
    return
  }
  for (const infoPlist of infoPlists) {
    for (const key of MAC_UNUSED_PERMISSION_KEYS) {
      try {
        execFileSync('/usr/libexec/PlistBuddy', ['-c', `Delete :${key}`, infoPlist], {
          stdio: 'ignore'
        })
        console.log(`[after-pack] Removed unused Info.plist permission key: ${key} from ${infoPlist}`)
      } catch {
        // Key absent — nothing to remove.
      }
    }
  }
}

async function afterPack(context) {
  prunePackedLegalworkDependencies(context)
  pruneIncompatibleCanvasNativePackages(context)
  pruneAndValidateCodexNativePackage(context)
  restoreBundledOfficeCli(context)
  validateBundledLegalworkRuntime(context)
  validateBundledPdfParserRuntime(context)
  validateBundledOfficeRuntime(context)
  validateBundledPdfFonts(context)
  validateBundledDataComplianceRuntime(context)
  validateBundledDocumentOcrRuntime(context)
  validateBundledImaMcpServer(context)
  stripUnnecessaryMacPermissions(context)
  maybeAdhocSignMacApp(context)
}

exports.LEGALWORK_RUNTIME_REQUIRED_PATHS = LEGALWORK_RUNTIME_REQUIRED_PATHS
exports.DATA_COMPLIANCE_REQUIRED_PATHS = DATA_COMPLIANCE_REQUIRED_PATHS
exports.DATA_COMPLIANCE_OPTIONAL_PATHS = DATA_COMPLIANCE_OPTIONAL_PATHS
exports.DOCUMENT_OCR_REQUIRED_PATHS = DOCUMENT_OCR_REQUIRED_PATHS
exports.OFFICE_RUNTIME_IMPORTS = OFFICE_RUNTIME_IMPORTS
exports.DATA_COMPLIANCE_RUNTIME_IMPORTS = DATA_COMPLIANCE_RUNTIME_IMPORTS
exports.OFFICE_RUNTIME_PYTHON_LINE = OFFICE_RUNTIME_PYTHON_LINE
exports.IMA_MCP_SCRIPT_RELATIVE_PATH = IMA_MCP_SCRIPT_RELATIVE_PATH
exports._internals = {
  appBundlePath,
  packedResourcesDir,
  unpackedAppRoot,
  findInfoPlists,
  macInfoPlistPaths,
  officeRuntimePythonPath,
  officeRuntimeSitePackagesPath,
  validateRelocatableSymlinks,
  prunePackedLegalworkDependencies,
  restoreBundledOfficeCli,
  validateBundledLegalworkRuntime,
  normalizeArch,
  expectedCanvasNativePackage,
  pruneIncompatibleCanvasNativePackages,
  expectedCodexNativePackage,
  pruneAndValidateCodexNativePackage,
  validateBundledPdfParserRuntime,
  validateBundledAgentLoop,
  validateBundledOfficeRuntime,
  validateBundledPdfFonts,
  validateBundledDataComplianceRuntime,
  validateBundledDocumentOcrRuntime,
  validateBundledImaMcpServer,
  stripUnnecessaryMacPermissions
}
exports.default = afterPack
