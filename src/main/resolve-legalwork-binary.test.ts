import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  buildLegalworkServeArgs,
  resolveLegalworkExecutable,
  type LegalworkBinaryResolution
} from './resolve-legalwork-binary'

const tempRoots: string[] = []

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'legalwork-resolver-'))
  tempRoots.push(root)
  return root
}

function touch(path: string): void {
  mkdirSync(join(path, '..'), { recursive: true })
  writeFileSync(path, '', 'utf8')
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop()
    if (root) rmSync(root, { recursive: true, force: true })
  }
})

describe('resolveLegalworkExecutable', () => {
  it('resolves the built Legalwork entry from the app root', () => {
    const root = tempRoot()
    const entry = join(root, 'legalwork/dist/cli/serve-entry.js')
    touch(entry)

    const resolution = resolveLegalworkExecutable(root, '')

    expect(resolution).toEqual({
      kind: 'node-script',
      command: process.execPath,
      args: [entry],
      dataDir: ''
    })
  })

  it('does not fall back to TypeScript source files that Node cannot execute', () => {
    const root = tempRoot()
    touch(join(root, 'legalwork/src/cli/serve-entry.ts'))

    const resolution = resolveLegalworkExecutable(root, '')

    expect(resolution).toEqual({
      kind: 'node-script',
      command: process.execPath,
      args: [join(root, 'legalwork/dist/cli/serve-entry.js')],
      dataDir: ''
    })
  })

  it('accepts a Legalwork package directory as a custom binary path', () => {
    const root = tempRoot()
    const entry = join(root, 'dist/cli/serve-entry.js')
    touch(entry)

    const resolution = resolveLegalworkExecutable('/app', root)

    expect(resolution).toEqual({
      kind: 'node-script',
      command: process.execPath,
      args: [entry],
      dataDir: ''
    })
  })

  it('runs a non-JavaScript custom executable directly', () => {
    const resolution = resolveLegalworkExecutable('/app', '/usr/local/bin/legalwork')

    expect(resolution).toEqual({
      kind: 'custom',
      command: '/usr/local/bin/legalwork',
      args: [],
      dataDir: ''
    })
  })
})

describe('buildLegalworkServeArgs', () => {
  it('does not place runtime secrets on the child process argv', () => {
    const resolution: LegalworkBinaryResolution = {
      kind: 'node-script',
      command: '/usr/bin/node',
      args: ['/app/legalwork/dist/cli/serve-entry.js'],
      dataDir: ''
    }

    const args = buildLegalworkServeArgs({
      resolution,
      host: '127.0.0.1',
      port: 8899,
      dataDir: '/tmp/legalwork',
      baseUrl: 'https://api.deepseek.com/beta',
      model: 'deepseek-chat',
      approvalPolicy: 'on-request',
      sandboxMode: 'workspace-write',
      tokenEconomyMode: false,
      insecure: false
    })

    expect(args).not.toContain('--api-key')
    expect(args).not.toContain('--runtime-token')
    expect(args).toContain('--token-economy-mode')
    expect(args).toContain('false')
  })
})
