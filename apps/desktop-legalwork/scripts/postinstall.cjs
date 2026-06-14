const { spawnSync } = require('node:child_process')

function run(command, args) {
  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  })
}

require('./ensure-legalwork-install.cjs')

const buildLegalwork = run('npm', ['--prefix', 'legalwork', 'run', 'build'])
if (buildLegalwork.status !== 0) {
  process.exit(buildLegalwork.status || 1)
}
