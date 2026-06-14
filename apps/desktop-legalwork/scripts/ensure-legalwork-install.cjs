const { existsSync, rmSync } = require('node:fs')
const { spawnSync } = require('node:child_process')

const REQUIRED_PATHS = [
  'legalwork/package-lock.json',
  'legalwork/node_modules/diff/package.json',
  'legalwork/node_modules/zod/package.json',
  'legalwork/node_modules/@modelcontextprotocol/sdk/package.json'
]
const LEGALWORK_SQLITE_MODULE_PATH = 'legalwork/node_modules/better-sqlite3'

function run(command, args) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      npm_config_audit: 'false',
      npm_config_fund: 'false'
    }
  })
}

function ensureLegalworkInstall() {
  if (!REQUIRED_PATHS.every((path) => existsSync(path))) {
    const installLegalwork = run('npm', ['--prefix', 'legalwork', 'ci'])
    if (installLegalwork.status !== 0) {
      process.exit(installLegalwork.status || 1)
    }
  }

  if (existsSync(LEGALWORK_SQLITE_MODULE_PATH)) {
    rmSync(LEGALWORK_SQLITE_MODULE_PATH, { recursive: true, force: true })
    return
  }
}

ensureLegalworkInstall()
