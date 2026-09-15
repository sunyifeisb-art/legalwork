import { describe, expect, it } from 'vitest'
import {
  buildFilesystemMcpServerConfig,
  isNpxFilesystemServer,
  resolveFilesystemMcpEntryPath,
  rewriteNpxFilesystemMcpServer
} from './filesystem-mcp-config'
import type { ClawScheduleMcpLaunchConfig } from './claw-schedule-mcp-config'

const LAUNCH: ClawScheduleMcpLaunchConfig = {
  appPath: '/tmp/legalwork-test-app',
  execPath: '/tmp/electron',
  isPackaged: false
}

describe('isNpxFilesystemServer', () => {
  it('detects the npx default filesystem configuration', () => {
    expect(isNpxFilesystemServer({
      command: '/opt/homebrew/bin/npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/xiangyang/']
    })).toBe(true)
  })

  it('rejects a server that is not the filesystem package', () => {
    expect(isNpxFilesystemServer({
      command: '/opt/homebrew/bin/npx',
      args: ['-y', '@playwright/mcp@latest']
    })).toBe(false)
  })

  it('rejects a server without npx', () => {
    expect(isNpxFilesystemServer({
      command: 'filesystem',
      args: ['/Users/xiangyang/']
    })).toBe(false)
  })
})

describe('resolveFilesystemMcpEntryPath', () => {
  it('joins the app path with the bundled entry', () => {
    expect(resolveFilesystemMcpEntryPath(LAUNCH)).toBe(
      '/tmp/legalwork-test-app/out/main/filesystem-mcp-node-entry.cjs'
    )
  })
})

describe('rewriteNpxFilesystemMcpServer', () => {
  it('rewrites the npx filesystem server into an offline local entry, keeping workspace roots and env', () => {
    const rewritten = rewriteNpxFilesystemMcpServer({
      command: '/opt/homebrew/bin/npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/xiangyang/', '/Users/xiangyang/docs'],
      env: { FOO: 'bar' },
      enabled: true
    }, LAUNCH)

    expect(rewritten).toMatchObject({
      enabled: true,
      transport: 'stdio',
      command: '/tmp/electron',
      args: [
        '/tmp/legalwork-test-app/out/main/filesystem-mcp-node-entry.cjs',
        '/Users/xiangyang/',
        '/Users/xiangyang/docs'
      ],
      env: {
        FOO: 'bar',
        ELECTRON_RUN_AS_NODE: '1'
      },
      trustScope: 'user',
      timeoutMs: 60_000
    })
  })

  it('is idempotent: an already-rewritten server is left untouched', () => {
    const offline = buildFilesystemMcpServerConfig(LAUNCH, ['/Users/xiangyang/'])
    expect(rewriteNpxFilesystemMcpServer(offline, LAUNCH)).toBeNull()
  })

  it('returns null when the command is not an npx filesystem server', () => {
    expect(rewriteNpxFilesystemMcpServer({
      command: '/opt/homebrew/bin/npx',
      args: ['-y', '@playwright/mcp@latest']
    }, LAUNCH)).toBeNull()
  })

  it('returns null when there are no allowed directory arguments', () => {
    expect(rewriteNpxFilesystemMcpServer({
      command: '/opt/homebrew/bin/npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem']
    }, LAUNCH)).toBeNull()
  })

  it('builds a packaged-app command for the current platform', () => {
    const packagedLaunch: ClawScheduleMcpLaunchConfig = {
      appPath: '/Applications/legalwork.app/Contents/Resources/app.asar',
      execPath: '/Applications/legalwork.app/Contents/MacOS/legalwork',
      isPackaged: true
    }
    const rewritten = rewriteNpxFilesystemMcpServer({
      command: '/opt/homebrew/bin/npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/xiangyang/']
    }, packagedLaunch)

    expect(rewritten).toMatchObject({
      enabled: true,
      transport: 'stdio',
      command: process.platform === 'darwin'
        ? '/Applications/legalwork.app/Contents/Frameworks/legalwork Helper.app/Contents/MacOS/legalwork Helper'
        : packagedLaunch.execPath,
      args: [
        '/Applications/legalwork.app/Contents/Resources/app.asar/out/main/filesystem-mcp-node-entry.cjs',
        '/Users/xiangyang/'
      ],
      env: { ELECTRON_RUN_AS_NODE: '1' },
      trustScope: 'user'
    })
  })
})
