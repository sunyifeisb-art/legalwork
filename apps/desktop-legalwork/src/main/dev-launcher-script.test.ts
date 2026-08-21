import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const {
  buildAppleScript,
  buildInnerCommand
}: {
  buildAppleScript: (projectRoot: string) => string
  buildInnerCommand: (projectRoot: string) => string
} = require('../../scripts/install-dev-launcher.cjs')

describe('LegalWork Dev launcher script', () => {
  it('keeps shell control statements separated when compiled into AppleScript', () => {
    const command = buildInnerCommand('/tmp/legalwork project')
    const syntax = spawnSync('/bin/sh', ['-n'], { input: command, encoding: 'utf8' })

    expect(syntax.status).toBe(0)
    expect(syntax.stderr).toBe('')
    expect(command).toContain("cd '/tmp/legalwork project'\nif !")
    expect(command).toContain('\nfi\nexit 0')
    expect(buildAppleScript('/tmp/legalwork project')).toContain('do shell script')
  })
})
