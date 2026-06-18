import { describe, expect, it } from 'vitest'
import type { McpCapabilityConfig } from '../../contracts/capabilities.js'
import { buildMcpToolProviders, type McpClientLike } from './mcp-tool-provider.js'

function fakeClient(): McpClientLike {
  return {
    listTools: async () => ({ tools: [] }),
    callTool: async () => ({}),
    close: async () => undefined
  }
}

describe('buildMcpToolProviders', () => {
  it('connects MCP servers in parallel during startup', async () => {
    let started = 0
    let releaseFirst: (() => void) | undefined
    const firstStarted = new Promise<void>((resolve) => {
      releaseFirst = resolve
    })
    const config: McpCapabilityConfig = {
      enabled: true,
      servers: {
        first: {
          enabled: true,
          transport: 'streamable-http',
          url: 'https://mcp.example.test/first',
          headers: {},
          env: {},
          args: [],
          trustScope: 'user',
          trustedWorkspaceRoots: [],
          timeoutMs: 30000
        },
        second: {
          enabled: true,
          transport: 'streamable-http',
          url: 'https://mcp.example.test/second',
          headers: {},
          env: {},
          args: [],
          trustScope: 'user',
          trustedWorkspaceRoots: [],
          timeoutMs: 30000
        }
      },
      search: {
        enabled: false,
        mode: 'auto',
        autoThresholdToolCount: 24,
        topKDefault: 5,
        topKMax: 10,
        minScore: 0.15,
        bm25: { k1: 1.2, b: 0.75 }
      }
    }

    await expect(Promise.race([
      buildMcpToolProviders(config, {
        clientFactory: async (serverId) => {
          started += 1
          if (serverId === 'first') await firstStarted
          if (serverId === 'second') releaseFirst?.()
          return fakeClient()
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('MCP startup stayed serial')), 250))
    ])).resolves.toMatchObject({
      connectedServers: 2
    })
    expect(started).toBe(2)
  })

  it('uses the startup timeout cap while building initial MCP clients', async () => {
    const seenTimeouts: number[] = []
    const config: McpCapabilityConfig = {
      enabled: true,
      servers: {
        slow: {
          enabled: true,
          transport: 'streamable-http',
          url: 'https://mcp.example.test/slow',
          headers: {},
          env: {},
          args: [],
          trustScope: 'user',
          trustedWorkspaceRoots: [],
          timeoutMs: 30000
        }
      },
      search: {
        enabled: false,
        mode: 'auto',
        autoThresholdToolCount: 24,
        topKDefault: 5,
        topKMax: 10,
        minScore: 0.15,
        bm25: { k1: 1.2, b: 0.75 }
      }
    }

    await buildMcpToolProviders(config, {
      startupTimeoutMs: 4000,
      clientFactory: async (_serverId, server) => {
        seenTimeouts.push(server.timeoutMs)
        return fakeClient()
      }
    })

    expect(seenTimeouts).toEqual([4000])
  })

  it('gives stdio MCP servers a longer startup timeout to survive npx cold-start', async () => {
    const seenTimeouts: number[] = []
    const config: McpCapabilityConfig = {
      enabled: true,
      servers: {
        context7: {
          enabled: true,
          transport: 'stdio',
          command: 'npx',
          args: ['-y', '@upstash/context7-mcp@latest'],
          headers: {},
          env: {},
          trustScope: 'user',
          trustedWorkspaceRoots: [],
          timeoutMs: 30_000
        }
      },
      search: {
        enabled: false,
        mode: 'auto',
        autoThresholdToolCount: 24,
        topKDefault: 5,
        topKMax: 10,
        minScore: 0.15,
        bm25: { k1: 1.2, b: 0.75 }
      }
    }

    await buildMcpToolProviders(config, {
      startupTimeoutMs: 8_000,
      clientFactory: async (_serverId, server) => {
        seenTimeouts.push(server.timeoutMs)
        return fakeClient()
      }
    })

    expect(seenTimeouts).toEqual([30_000])
  })
})
