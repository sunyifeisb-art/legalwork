const { existsSync, mkdirSync, rmSync, writeFileSync, copyFileSync } = require('node:fs')
const { join, resolve } = require('node:path')
const { execFileSync } = require('node:child_process')
const { homedir, tmpdir } = require('node:os')

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`
}

function buildInnerCommand(projectRoot) {
  return [
    `cd ${shellQuote(projectRoot)}`,
    'if ! /usr/sbin/lsof -nP -iTCP:5173 -sTCP:LISTEN >/dev/null 2>&1; then',
    '  nohup /usr/bin/env npm run dev </dev/null >/tmp/legalwork-dev.log 2>&1 &',
    'fi',
    'exit 0'
  ].join('\n')
}

function buildAppleScript(projectRoot) {
  const command = `/bin/zsh -lc ${shellQuote(buildInnerCommand(projectRoot))}`
  return [
    'on run',
    `  do shell script ${JSON.stringify(command)}`,
    'end run',
    ''
  ].join('\n')
}

function createIcns(sourceIcon, target) {
  const iconset = join(tmpdir(), `legalwork-dev-launcher-${process.pid}.iconset`)
  rmSync(iconset, { recursive: true, force: true })
  mkdirSync(iconset, { recursive: true })
  for (const size of [16, 32, 64, 128, 256, 512]) {
    execFileSync('sips', ['-z', String(size), String(size), sourceIcon, '--out', join(iconset, `icon_${size}x${size}.png`)], { stdio: 'ignore' })
    execFileSync('sips', ['-z', String(size * 2), String(size * 2), sourceIcon, '--out', join(iconset, `icon_${size}x${size}@2x.png`)], { stdio: 'ignore' })
  }
  execFileSync('iconutil', ['-c', 'icns', iconset, '-o', target], { stdio: 'ignore' })
  rmSync(iconset, { recursive: true, force: true })
}

function launcherTarget() {
  const primary = '/Applications/LegalWork Dev.app'
  try {
    mkdirSync('/Applications', { recursive: true })
    return primary
  } catch {
    const fallbackDir = join(homedir(), 'Applications')
    mkdirSync(fallbackDir, { recursive: true })
    return join(fallbackDir, 'LegalWork Dev.app')
  }
}

function plistUpsert(targetPlist, key, value) {
  try {
    execFileSync('/usr/libexec/PlistBuddy', ['-c', `Set :${key} ${value}`, targetPlist], { stdio: 'ignore' })
  } catch {
    execFileSync('/usr/libexec/PlistBuddy', ['-c', `Add :${key} string ${value}`, targetPlist], { stdio: 'ignore' })
  }
}

function main() {
  if (process.platform !== 'darwin') {
    console.log('LegalWork Dev launcher is only needed on macOS.')
    return
  }

  const projectRoot = resolve(__dirname, '..')
  const sourceIcon = join(projectRoot, 'src', 'asset', 'img', 'legalwork-dev.png')
  const iconPath = join(tmpdir(), `legalwork-dev-launcher-${process.pid}.icns`)
  const scriptPath = join(tmpdir(), `legalwork-dev-launcher-${process.pid}.applescript`)
  if (!existsSync(sourceIcon)) throw new Error(`Missing dev icon: ${sourceIcon}`)

  createIcns(sourceIcon, iconPath)
  writeFileSync(scriptPath, buildAppleScript(projectRoot), 'utf8')

  const targetApp = launcherTarget()
  rmSync(targetApp, { recursive: true, force: true })
  execFileSync('osacompile', ['-o', targetApp, scriptPath], { stdio: 'ignore' })
  copyFileSync(iconPath, join(targetApp, 'Contents', 'Resources', 'applet.icns'))
  const targetPlist = join(targetApp, 'Contents', 'Info.plist')
  plistUpsert(targetPlist, 'CFBundleName', 'LegalWork Dev')
  plistUpsert(targetPlist, 'CFBundleDisplayName', 'LegalWork Dev')
  plistUpsert(targetPlist, 'CFBundleIdentifier', 'com.xingyuzhong.legalwork.dev.launcher')
  execFileSync('touch', [targetApp])
  rmSync(iconPath, { force: true })
  rmSync(scriptPath, { force: true })
  console.log(targetApp)
}

module.exports = { buildAppleScript, buildInnerCommand, shellQuote }

if (require.main === module) main()
