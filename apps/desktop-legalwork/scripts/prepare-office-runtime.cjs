#!/usr/bin/env node
'use strict'

/**
 * Prepare relocatable Office Python runtimes at RELEASE BUILD TIME.
 *
 * End-user machines must never create a venv or run pip for Word/Excel/PPT.
 * This script downloads python-build-standalone CPython 3.11 distributions,
 * installs the pinned legal_document_formatting requirements into them,
 * verifies the core imports, and stages them under:
 *   vendor/office-runtime/<platform>-<arch>
 */

const { createHash } = require('node:crypto')
const { execFileSync } = require('node:child_process')
const {
  cpSync,
  existsSync,
  mkdirSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync
} = require('node:fs')
const { tmpdir } = require('node:os')
const { basename, delimiter, dirname, isAbsolute, join, resolve } = require('node:path')

const DESKTOP_ROOT = resolve(__dirname, '..')
const REPO_ROOT = resolve(DESKTOP_ROOT, '..', '..')
const REQUIREMENTS = join(REPO_ROOT, 'skills', 'legal_document_formatting', 'requirements.txt')
const DATA_COMPLIANCE_REQUIREMENTS = join(
  DESKTOP_ROOT,
  'vendor',
  'data-compliance-review-codex',
  'data-compliance-web',
  'requirements.txt'
)
const VENDOR_ROOT = join(DESKTOP_ROOT, 'vendor', 'office-runtime')
const FONT_VENDOR_ROOT = join(DESKTOP_ROOT, 'vendor', 'office-fonts')
const CACHE_ROOT = join(DESKTOP_ROOT, '.cache', 'office-runtime')
const PYTHON_LINE = '3.11'
const REQUIRED_IMPORTS = ['docx', 'openpyxl', 'pptx', 'lxml', 'PIL', 'reportlab']
const DATA_COMPLIANCE_REQUIRED_IMPORTS = [
  'flask',
  'fitz',
  'odf',
  'openai',
  'paddle',
  'paddleocr',
  'pypdf',
  'pandas'
]
// pip requires --only-binary=:all: when resolving wheels for a foreign
// platform. odfpy publishes a platform-independent source distribution only,
// so build it with the host Python and install it separately with --no-deps.
const CROSS_PURE_PYTHON_REQUIREMENTS = new Map([
  ['odfpy', 'odfpy>=1.4.1']
])
const RELEASE_REPOS = ['astral-sh/python-build-standalone', 'indygreg/python-build-standalone']
const SUPPORTED_TARGETS = new Set(['mac-arm64', 'mac-x64', 'win-x64', 'win-ia32', 'linux-x64'])
const FONTTOOLS_VERSION = '4.63.0'
const FONT_PREPARATION_VERSION = 2
const BUNDLED_FONT_SOURCE = {
  name: 'NotoSerifSC-VF.ttf',
  url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf',
  sha256: '050080d9255a86808f2945bffac582b31ef32bc36411ce29563b4961670c66f9'
}
const BUNDLED_FONT_LICENSE = {
  name: 'OFL.txt',
  url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifsc/OFL.txt',
  sha256: '5e0da210fb04058a8c0087985d2d456b931c2579811a49655721d3cf0c36b6d6'
}
const BUNDLED_STATIC_FONTS = [
  { name: 'NotoSerifSC-Regular.ttf', weight: 400 },
  { name: 'NotoSerifSC-Bold.ttf', weight: 700 }
]

function fail(message) {
  console.error(`[office-runtime] ${message}`)
  process.exit(1)
}

function info(message) {
  console.log(`[office-runtime] ${message}`)
}

function currentPlatformName() {
  if (process.platform === 'darwin') return 'mac'
  if (process.platform === 'win32') return 'win'
  if (process.platform === 'linux') return 'linux'
  fail(`Unsupported build host platform: ${process.platform}`)
}

function configuredTargetsForPlatform(platform) {
  if (platform === 'mac') return ['mac-x64', 'mac-arm64']
  // The complete offline compliance runtime depends on native wheels that are
  // published for Windows x64 only.
  if (platform === 'win') return ['win-x64']
  if (platform === 'linux') return ['linux-x64']
  fail(`Unsupported Office runtime platform: ${platform}`)
}

function parseArgs(argv) {
  const args = { platform: '', arch: '', force: false, allCurrent: false, fontsOnly: false }
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i]
    if (value === '--platform') args.platform = String(argv[++i] || '')
    else if (value === '--arch') args.arch = String(argv[++i] || '')
    else if (value === '--all-current') args.allCurrent = true
    else if (value === '--fonts-only') args.fontsOnly = true
    else if (value === '--force') args.force = true
    else if (value === '--help' || value === '-h') {
      console.log([
        'Usage:',
        '  node prepare-office-runtime.cjs --platform mac|win|linux --arch arm64|x64|ia32 [--force]',
        '  node prepare-office-runtime.cjs --all-current [--force]',
        '  node prepare-office-runtime.cjs --fonts-only'
      ].join('\n'))
      process.exit(0)
    } else fail(`Unknown argument: ${value}`)
  }
  if (args.fontsOnly) {
    if (args.platform || args.arch || args.allCurrent || args.force) {
      fail('--fonts-only cannot be combined with runtime target options')
    }
    return { ...args, targets: [] }
  }
  if (args.allCurrent) {
    if (args.platform || args.arch) fail('--all-current cannot be combined with --platform/--arch')
    const platform = currentPlatformName()
    return { ...args, targets: configuredTargetsForPlatform(platform) }
  }
  if (!args.platform || !args.arch) fail('--platform and --arch are required (or use --all-current)')
  const target = `${args.platform}-${args.arch}`
  if (!SUPPORTED_TARGETS.has(target)) fail(`Unsupported Office runtime target: ${target}`)
  return { ...args, targets: [target] }
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function platformFromTarget(target) {
  return target.split('-')[0]
}

function pythonRelativePath(platform) {
  return platform === 'win' ? join('python', 'python.exe') : join('python', 'bin', 'python3')
}

function sitePackagesPath(runtimeRoot, platform) {
  const direct = platform === 'win'
    ? join(runtimeRoot, 'python', 'Lib', 'site-packages')
    : join(runtimeRoot, 'python', 'lib', `python${PYTHON_LINE}`, 'site-packages')
  if (existsSync(direct)) return direct
  const libRoot = join(runtimeRoot, 'python', platform === 'win' ? 'Lib' : 'lib')
  if (!existsSync(libRoot)) fail(`Cannot locate Python library directory in ${runtimeRoot}`)
  const stack = [libRoot]
  while (stack.length > 0) {
    const current = stack.pop()
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (entry.isDirectory() && entry.name === 'site-packages') return path
      if (entry.isDirectory()) stack.push(path)
    }
  }
  fail(`Cannot locate site-packages in ${runtimeRoot}`)
}

function requiredImports(target) {
  return target === 'win-x64'
    ? [...new Set([...REQUIRED_IMPORTS, ...DATA_COMPLIANCE_REQUIRED_IMPORTS])]
    : REQUIRED_IMPORTS
}

function moduleFilesPresent(runtimeRoot, platform, target) {
  const site = sitePackagesPath(runtimeRoot, platform)
  return requiredImports(target).every((name) => existsSync(join(site, name)))
}

function runtimeAlreadyValid(runtimeRoot, target, requirementsSha, dataComplianceRequirementsSha) {
  const platform = platformFromTarget(target)
  if (!existsSync(join(runtimeRoot, 'runtime.json'))) return false
  if (!existsSync(join(runtimeRoot, pythonRelativePath(platform)))) return false
  try {
    const marker = JSON.parse(readFileSync(join(runtimeRoot, 'runtime.json'), 'utf8'))
    return marker.target === target &&
      marker.requirementsSha256 === requirementsSha &&
      (target !== 'win-x64' || (
        marker.dataComplianceReady === true &&
        marker.dataComplianceRequirementsSha256 === dataComplianceRequirementsSha
      )) &&
      marker.pythonLine === PYTHON_LINE &&
      moduleFilesPresent(runtimeRoot, platform, target)
  } catch {
    return false
  }
}

function assetMatcher(target) {
  const triples = {
    'mac-arm64': 'aarch64-apple-darwin',
    'mac-x64': 'x86_64-apple-darwin',
    'win-x64': 'x86_64-pc-windows-msvc',
    'win-ia32': 'i686-pc-windows-msvc',
    'linux-x64': 'x86_64-unknown-linux-gnu'
  }
  const triple = triples[target]
  return (name) => name.startsWith(`cpython-${PYTHON_LINE}.`) &&
    name.includes(triple) &&
    name.includes('install_only') &&
    name.endsWith('.tar.gz')
}

async function githubJson(url) {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'legalwork-office-runtime-builder'
  }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) headers.authorization = `Bearer ${token}`
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.json()
}

async function resolveStandaloneAsset(target) {
  const override = (process.env.LEGALWORK_OFFICE_PYTHON_STANDALONE_URL || '').trim()
  if (override) {
    return {
      url: override,
      name: basename(new URL(override).pathname),
      release: 'override',
      repository: 'override'
    }
  }
  const matcher = assetMatcher(target)
  let lastError = null
  for (const repository of RELEASE_REPOS) {
    try {
      const release = await githubJson(`https://api.github.com/repos/${repository}/releases/latest`)
      const candidates = Array.isArray(release.assets)
        ? release.assets.filter((asset) => asset && typeof asset.name === 'string' && matcher(asset.name))
        : []
      if (candidates.length === 0) {
        throw new Error(`latest release ${release.tag_name || ''} has no matching CPython ${PYTHON_LINE} asset for ${target}`)
      }
      candidates.sort((a, b) => Number(b.name.includes('-shared-')) - Number(a.name.includes('-shared-')) || a.name.localeCompare(b.name))
      const asset = candidates[0]
      return {
        url: asset.browser_download_url,
        name: asset.name,
        release: release.tag_name || 'latest',
        repository
      }
    } catch (error) {
      lastError = error
    }
  }
  throw lastError || new Error('Unable to resolve python-build-standalone release asset')
}

async function download(url, destination) {
  if (existsSync(destination) && statSync(destination).size > 1024 * 1024) {
    info(`Using cached ${basename(destination)}`)
    return
  }
  mkdirSync(dirname(destination), { recursive: true })
  const headers = { 'user-agent': 'legalwork-office-runtime-builder' }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) headers.authorization = `Bearer ${token}`
  info(`Downloading ${url}`)
  const response = await fetch(url, { headers, redirect: 'follow' })
  if (!response.ok) throw new Error(`download failed: ${response.status} ${response.statusText}`)
  const bytes = Buffer.from(await response.arrayBuffer())
  writeFileSync(destination, bytes)
}

async function prepareBundledFonts() {
  mkdirSync(FONT_VENDOR_ROOT, { recursive: true })
  mkdirSync(CACHE_ROOT, { recursive: true })
  const source = join(CACHE_ROOT, BUNDLED_FONT_SOURCE.name)
  if (!existsSync(source) || sha256File(source) !== BUNDLED_FONT_SOURCE.sha256) {
    rmSync(source, { force: true })
    await download(BUNDLED_FONT_SOURCE.url, source)
  }
  if (sha256File(source) !== BUNDLED_FONT_SOURCE.sha256) {
    rmSync(source, { force: true })
    fail(`Bundled font source checksum mismatch for ${BUNDLED_FONT_SOURCE.name}`)
  }

  const license = join(FONT_VENDOR_ROOT, BUNDLED_FONT_LICENSE.name)
  if (!existsSync(license) || sha256File(license) !== BUNDLED_FONT_LICENSE.sha256) {
    rmSync(license, { force: true })
    await download(BUNDLED_FONT_LICENSE.url, license)
  }
  if (sha256File(license) !== BUNDLED_FONT_LICENSE.sha256) {
    rmSync(license, { force: true })
    fail(`Bundled font license checksum mismatch for ${BUNDLED_FONT_LICENSE.name}`)
  }

  const manifestPath = join(FONT_VENDOR_ROOT, 'fonts.json')
  let existingManifest = null
  try {
    existingManifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch {
    existingManifest = null
  }
  const outputsValid = existingManifest?.preparationVersion === FONT_PREPARATION_VERSION &&
    existingManifest?.sourceSha256 === BUNDLED_FONT_SOURCE.sha256 &&
    existingManifest?.fontToolsVersion === FONTTOOLS_VERSION &&
    BUNDLED_STATIC_FONTS.every((font) => {
      const path = join(FONT_VENDOR_ROOT, font.name)
      return existsSync(path) && existingManifest.fonts?.[font.name] === sha256File(path)
    })
  if (!outputsValid) {
    const python = builderPython()
    if (!python) fail('A build-time Python is required to prepare deterministic static PDF fonts')
    const fontToolsRoot = join(CACHE_ROOT, `fonttools-${FONTTOOLS_VERSION}`)
    const pythonEnv = {
      ...process.env,
      PYTHONPATH: [fontToolsRoot, process.env.PYTHONPATH].filter(Boolean).join(delimiter)
    }
    try {
      execFileSync(python, ['-c', `import fontTools; assert fontTools.__version__ == '${FONTTOOLS_VERSION}'`], {
        stdio: 'ignore', windowsHide: true, env: pythonEnv
      })
    } catch {
      rmSync(fontToolsRoot, { recursive: true, force: true })
      mkdirSync(fontToolsRoot, { recursive: true })
      execFileSync(python, [
        '-m', 'pip', 'install', '--disable-pip-version-check', '--no-input', '--quiet',
        '--target', fontToolsRoot, `fonttools==${FONTTOOLS_VERSION}`
      ], { stdio: 'inherit', windowsHide: true })
    }
    const script = [
      'import sys',
      'from fontTools.ttLib import TTFont',
      'from fontTools.varLib.instancer import instantiateVariableFont',
      'source = sys.argv[1]',
      'pairs = ((400, "Regular", sys.argv[2]), (700, "Bold", sys.argv[3]))',
      'for weight, style, output in pairs:',
      '    font = TTFont(source)',
      '    instantiateVariableFont(font, {"wght": weight}, inplace=True)',
      '    family = "Noto Serif SC"',
      '    full = f"{family} {style}"',
      '    postscript = f"NotoSerifSC-{style}"',
      '    for name_id, value in ((1, family), (2, style), (3, full), (4, full), (6, postscript), (16, family), (17, style)):',
      '        font["name"].setName(value, name_id, 3, 1, 0x409)',
      '        font["name"].setName(value, name_id, 1, 0, 0)',
      '    if style == "Bold":',
      '        font["OS/2"].fsSelection = (font["OS/2"].fsSelection | (1 << 5)) & ~(1 << 6)',
      '        font["head"].macStyle |= 1',
      '    else:',
      '        font["OS/2"].fsSelection = (font["OS/2"].fsSelection | (1 << 6)) & ~(1 << 5)',
      '        font["head"].macStyle &= ~1',
      '    font.save(output)',
      '    font.close()'
    ].join('\n')
    execFileSync(python, [
      '-c', script, source,
      ...BUNDLED_STATIC_FONTS.map((font) => join(FONT_VENDOR_ROOT, font.name))
    ], { stdio: 'inherit', windowsHide: true, env: pythonEnv })
  }
  const fontHashes = {}
  for (const font of BUNDLED_STATIC_FONTS) {
    const path = join(FONT_VENDOR_ROOT, font.name)
    if (!existsSync(path) || statSync(path).size < 1_000_000) {
      fail(`Static bundled PDF font is missing or truncated: ${font.name}`)
    }
    fontHashes[font.name] = sha256File(path)
  }
  writeFileSync(manifestPath, `${JSON.stringify({
    preparationVersion: FONT_PREPARATION_VERSION,
    source: BUNDLED_FONT_SOURCE.url,
    sourceSha256: BUNDLED_FONT_SOURCE.sha256,
    fontToolsVersion: FONTTOOLS_VERSION,
    fonts: fontHashes
  }, null, 2)}\n`, 'utf8')
  rmSync(join(FONT_VENDOR_ROOT, BUNDLED_FONT_SOURCE.name), { force: true })
  info(`Prepared deterministic PDF fonts at ${FONT_VENDOR_ROOT}`)
}

function extractArchive(archive, destination) {
  mkdirSync(destination, { recursive: true })
  execFileSync('tar', ['-xzf', archive, '-C', destination], { stdio: 'inherit', windowsHide: true })
}

function canRun(executable, args = ['--version']) {
  try {
    execFileSync(executable, args, { stdio: 'ignore', windowsHide: true })
    return true
  } catch {
    return false
  }
}

function builderPython() {
  const candidates = [
    process.env.PYTHON,
    process.env.PYTHON3,
    process.platform === 'win32' ? 'python' : 'python3',
    'python'
  ]
  for (const candidate of candidates) {
    if (candidate && canRun(candidate)) return candidate
  }
  return null
}

function pipPlatform(target) {
  return {
    'mac-arm64': 'macosx_11_0_arm64',
    'mac-x64': 'macosx_11_0_x86_64',
    'win-x64': 'win_amd64',
    'win-ia32': 'win32',
    'linux-x64': 'manylinux_2_17_x86_64'
  }[target]
}

/**
 * python-build-standalone ships links in bin/, lib/pkgconfig/, share/man/, and
 * potentially other directories as absolute paths into its extraction root.
 * Once that temporary root is removed those links break and macOS codesign
 * rejects the whole app bundle. Every link currently targets a peer in the
 * same directory, so replace absolute build-time paths with peer-relative links
 * throughout the complete Python tree.
 */
function repairBundledSymlinks(runtimeRoot) {
  const pythonRoot = join(runtimeRoot, 'python')
  if (!existsSync(pythonRoot)) return
  let repaired = 0
  const stack = [pythonRoot]
  while (stack.length > 0) {
    const currentDir = stack.pop()
    let entries
    try {
      entries = readdirSync(currentDir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      const path = join(currentDir, entry.name)
      let stat
      try {
        stat = lstatSync(path)
      } catch {
        continue
      }
      if (stat.isDirectory()) {
        stack.push(path)
        continue
      }
      if (!stat.isSymbolicLink()) continue
      try {
        const currentTarget = readlinkSync(path)
        if (!isAbsolute(currentTarget)) continue
        const relativeTarget = basename(currentTarget)
        if (!existsSync(join(currentDir, relativeTarget))) continue
        unlinkSync(path)
        symlinkSync(relativeTarget, path)
        repaired += 1
      } catch {
        // Leave the link as-is; after-pack validation will reject the bundle
        // instead of publishing a runtime whose relocation is unsafe.
      }
    }
  }
  if (repaired > 0) info(`Repaired ${repaired} office-runtime Python symlinks in ${pythonRoot}`)
}

function targetPythonEnv(runtimeRoot) {
  // python-build-standalone macOS builds hard-code sys.prefix at build time and
  // are NOT relocatable by default: when the tree is moved from the extract temp
  // dir to vendor/office-runtime/<target>, the python still looks for its
  // stdlib/site-packages under the old temp path. Pointing PYTHONHOME at the
  // vendored python dir re-anchors sys.prefix so pip installs into the right
  // site-packages and `import docx` resolves from the packaged location.
  return { ...process.env, PYTHONHOME: join(runtimeRoot, 'python') }
}

function crossBinaryRequirements(source, destination) {
  const filtered = readFileSync(source, 'utf8')
    .split(/\r?\n/)
    .filter((line) => {
      const match = line.trim().match(/^([A-Za-z0-9_.-]+)/)
      if (!match) return true
      return !CROSS_PURE_PYTHON_REQUIREMENTS.has(match[1].toLowerCase().replace(/[-_.]+/g, '-'))
    })
    .join('\n')
  writeFileSync(destination, `${filtered}\n`, 'utf8')
}

function installRequirements(runtimeRoot, platform, target) {
  const targetPython = join(runtimeRoot, pythonRelativePath(platform))
  const requirements = target === 'win-x64'
    ? [REQUIREMENTS, DATA_COMPLIANCE_REQUIREMENTS]
    : [REQUIREMENTS]
  const commonArgs = [
    '-m', 'pip', 'install', '--disable-pip-version-check', '--no-input',
    ...requirements.flatMap((path) => ['-r', path])
  ]
  if (canRun(targetPython)) {
    try {
      info(`Installing Office packages with target Python (${target})`)
      execFileSync(targetPython, commonArgs, { stdio: 'inherit', windowsHide: true, env: targetPythonEnv(runtimeRoot) })
      return
    } catch (error) {
      info(`Target Python pip failed (${error.message}); trying cross-platform wheel installation.`)
    }
  }

  const hostPython = builderPython()
  if (!hostPython) fail(`Cannot execute target Python and no builder Python is available for cross-wheel install (${target})`)
  const site = sitePackagesPath(runtimeRoot, platform)
  mkdirSync(site, { recursive: true })
  info(`Installing binary wheels into ${target} runtime using builder Python`)
  const crossRequirementsRoot = mkdtempSync(join(tmpdir(), 'legalwork-cross-requirements-'))
  try {
    const binaryRequirements = requirements.map((source, index) => {
      const destination = join(crossRequirementsRoot, `requirements-${index}.txt`)
      crossBinaryRequirements(source, destination)
      return destination
    })
    execFileSync(hostPython, [
      '-m', 'pip', 'install',
      '--disable-pip-version-check', '--no-input',
      '--only-binary=:all:',
      '--platform', pipPlatform(target),
      '--python-version', '311',
      '--implementation', 'cp',
      '--abi', 'cp311',
      '--target', site,
      ...binaryRequirements.flatMap((path) => ['-r', path])
    ], { stdio: 'inherit', windowsHide: true })

    if (CROSS_PURE_PYTHON_REQUIREMENTS.size > 0) {
      info(`Installing pure-Python source packages into ${target} runtime`)
      execFileSync(hostPython, [
        '-m', 'pip', 'install',
        '--disable-pip-version-check', '--no-input', '--no-deps',
        '--target', site,
        ...CROSS_PURE_PYTHON_REQUIREMENTS.values()
      ], { stdio: 'inherit', windowsHide: true })
    }
  } finally {
    rmSync(crossRequirementsRoot, { recursive: true, force: true })
  }
}

function verifyRuntime(runtimeRoot, platform, target) {
  const python = join(runtimeRoot, pythonRelativePath(platform))
  if (!existsSync(python)) fail(`Bundled Python executable missing after preparation: ${python}`)
  if (!moduleFilesPresent(runtimeRoot, platform, target)) fail(`One or more bundled Python packages are missing from ${target}`)
  if (canRun(python)) {
    const script = requiredImports(target).map((name) => `import ${name}`).join(';')
    execFileSync(python, ['-c', script], { stdio: 'inherit', windowsHide: true, env: targetPythonEnv(runtimeRoot) })
  } else {
    info(`Target Python cannot execute on this builder; validated packaged module files for ${target}.`)
  }
}

async function prepareTarget(target, force, requirementsSha, dataComplianceRequirementsSha) {
  const platform = platformFromTarget(target)
  const runtimeRoot = join(VENDOR_ROOT, target)
  // A prepared runtime can outlive the temporary extraction directory that
  // originally supplied it. Repair legacy absolute links before accepting the
  // cache, otherwise every later release keeps repackaging the same broken
  // links even after the repair logic itself has shipped.
  if (!force) repairBundledSymlinks(runtimeRoot)
  if (!force && runtimeAlreadyValid(runtimeRoot, target, requirementsSha, dataComplianceRequirementsSha)) {
    info(`${target} Office runtime is already prepared.`)
    return
  }

  const asset = await resolveStandaloneAsset(target)
  mkdirSync(CACHE_ROOT, { recursive: true })
  const archive = join(CACHE_ROOT, asset.name)
  await download(asset.url, archive)

  const temp = mkdtempSync(join(tmpdir(), `legalwork-office-runtime-${target}-`))
  try {
    extractArchive(archive, temp)
    const extractedPython = join(temp, 'python')
    if (!existsSync(extractedPython)) fail(`Archive ${asset.name} did not contain python/`)
    rmSync(runtimeRoot, { recursive: true, force: true })
    mkdirSync(runtimeRoot, { recursive: true })
    cpSync(extractedPython, join(runtimeRoot, 'python'), { recursive: true, force: true })
    // bin/python3 等是指向临时目录的绝对符号链接，cpSync 不解引用，需手动重建为相对链接。
    repairBundledSymlinks(runtimeRoot)
    installRequirements(runtimeRoot, platform, target)
    verifyRuntime(runtimeRoot, platform, target)
    writeFileSync(join(runtimeRoot, 'runtime.json'), `${JSON.stringify({
      target,
      pythonLine: PYTHON_LINE,
      requirementsSha256: requirementsSha,
      dataComplianceReady: target === 'win-x64',
      dataComplianceRequirementsSha256: target === 'win-x64'
        ? dataComplianceRequirementsSha
        : undefined,
      sourceRepository: asset.repository,
      sourceRelease: asset.release,
      sourceAsset: asset.name,
      preparedAt: new Date().toISOString(),
      imports: requiredImports(target)
    }, null, 2)}\n`, 'utf8')
    info(`Prepared ${target} Office runtime at ${runtimeRoot}`)
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
}

async function main() {
  if (!existsSync(REQUIREMENTS)) fail(`Missing Office requirements: ${REQUIREMENTS}`)
  if (!existsSync(DATA_COMPLIANCE_REQUIREMENTS)) {
    fail(`Missing data compliance requirements: ${DATA_COMPLIANCE_REQUIREMENTS}`)
  }
  const args = parseArgs(process.argv.slice(2))
  await prepareBundledFonts()
  if (args.fontsOnly) return
  const requirementsSha = sha256File(REQUIREMENTS)
  const dataComplianceRequirementsSha = sha256File(DATA_COMPLIANCE_REQUIREMENTS)
  for (const target of args.targets) {
    await prepareTarget(target, args.force, requirementsSha, dataComplianceRequirementsSha)
  }
}

main().catch((error) => fail(error instanceof Error ? error.stack || error.message : String(error)))
