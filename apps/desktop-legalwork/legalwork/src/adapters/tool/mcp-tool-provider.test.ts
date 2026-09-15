import { describe, expect, it } from 'vitest'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { McpCapabilityConfig } from '../../contracts/capabilities.js'
import type { ToolHostContext } from '../../ports/tool-host.js'
import {
  buildMcpToolProviders,
  normalizeOfficeCliArguments,
  pendingMcpToolProviders,
  truncateMcpTextOutput,
  type McpClientLike
} from './mcp-tool-provider.js'

function fakeClient(): McpClientLike {
  return {
    listTools: async () => ({ tools: [] }),
    callTool: async () => ({}),
    close: async () => undefined
  }
}

function mcpConfig(serverId = 'officecli'): McpCapabilityConfig {
  return {
    enabled: true,
    servers: {
      [serverId]: {
        enabled: true,
        transport: 'stdio',
        command: 'fake-mcp',
        args: [],
        headers: {},
        env: {},
        trustScope: 'user',
        trustedWorkspaceRoots: [],
        timeoutMs: 30_000
      }
    },
    search: {
      enabled: false,
      mode: 'direct',
      autoThresholdToolCount: 24,
      topKDefault: 5,
      topKMax: 10,
      minScore: 0.15,
      bm25: { k1: 1.2, b: 0.75 }
    }
  }
}

function pkulawConfig(authorization?: string): McpCapabilityConfig {
  const config = mcpConfig('pkulaw-law-keyword')
  config.servers['pkulaw-law-keyword'] = {
    enabled: true,
    transport: 'streamable-http',
    url: 'https://apim-gateway.pkulaw.com/mcp-law',
    headers: authorization ? { Authorization: authorization } : {},
    env: {},
    args: [],
    trustScope: 'user',
    trustedWorkspaceRoots: [],
    timeoutMs: 30_000
  }
  return config
}

function toolContext(threadId = 'thread-officecli'): ToolHostContext {
  return {
    threadId,
    turnId: 'turn-officecli',
    workspace: '/tmp/workspace',
    approvalPolicy: 'auto',
    abortSignal: new AbortController().signal,
    awaitApproval: async () => 'allow'
  }
}

describe('buildMcpToolProviders', () => {
  it('exposes configured servers as connecting without blocking runtime startup', () => {
    const pending = pendingMcpToolProviders(mcpConfig('slow-server'))

    expect(pending).toMatchObject({
      connectedServers: 0,
      toolCount: 0,
      providers: [],
      diagnostics: [{
        id: 'slow-server',
        status: 'connecting',
        available: false
      }]
    })
  })

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

  it('publishes each connected provider as soon as that server settles', async () => {
    const settled: string[] = []
    const built = await buildMcpToolProviders(pkulawConfig(), {
      clientFactory: async () => ({
        ...fakeClient(),
        listTools: async () => ({
          tools: [{ name: 'search_law', inputSchema: { type: 'object' } }]
        })
      }),
      onServerSettled: ({ serverId, provider }) => {
        settled.push(`${serverId}:${provider?.tools.length ?? 0}`)
      }
    })

    expect(settled).toEqual(['pkulaw-law-keyword:1'])
    expect(built.connectedServers).toBe(1)
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
          timeoutMs: 8_000
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

    expect(seenTimeouts).toEqual([60_000])
  })

  it('uses the bundled PKULaw credential when no user credential is configured', async () => {
    const seenAuthorization: string[] = []
    const built = await buildMcpToolProviders(pkulawConfig(), {
      resolvePkulawFallbackToken: () => 'fallback-credential-456',
      clientFactory: async (_serverId, server) => {
        seenAuthorization.push(server.headers.Authorization ?? '')
        return {
          ...fakeClient(),
          listTools: async () => ({
            tools: [{ name: 'get_law_list', inputSchema: { type: 'object' } }]
          })
        }
      }
    })

    expect(seenAuthorization).toEqual(['Bearer fallback-credential-456'])
    expect(built).toMatchObject({ connectedServers: 1, toolCount: 1 })
    expect(JSON.stringify(built.diagnostics)).not.toContain('fallback-credential-456')
  })

  it('prefers the user PKULaw credential and falls back when startup authentication fails', async () => {
    const seenAuthorization: string[] = []
    const built = await buildMcpToolProviders(
      pkulawConfig('Bearer user-credential-123'),
      {
        resolvePkulawFallbackToken: () => 'fallback-credential-456',
        clientFactory: async (_serverId, server) => {
          const authorization = server.headers.Authorization ?? ''
          seenAuthorization.push(authorization)
          return {
            ...fakeClient(),
            listTools: async () => {
              if (authorization.includes('user-credential')) {
                throw new Error(`Authorization: ${authorization}`)
              }
              return { tools: [{ name: 'get_law_list', inputSchema: { type: 'object' } }] }
            }
          }
        }
      }
    )

    expect(seenAuthorization).toEqual([
      'Bearer user-credential-123',
      'Bearer fallback-credential-456'
    ])
    expect(built).toMatchObject({ connectedServers: 1, toolCount: 1 })
    expect(JSON.stringify(built.diagnostics)).not.toMatch(/user-credential|fallback-credential/)
  })

  it('does not send the bundled credential to non-PKULaw endpoints', async () => {
    const seenAuthorization: string[] = []
    const config = pkulawConfig()
    config.servers['pkulaw-law-keyword']!.url = 'https://mcp.example.test/mcp-law'

    await buildMcpToolProviders(config, {
      resolvePkulawFallbackToken: () => 'fallback-credential-456',
      clientFactory: async (_serverId, server) => {
        seenAuthorization.push(server.headers.Authorization ?? '')
        return fakeClient()
      }
    })

    expect(seenAuthorization).toEqual([''])
  })

  it('switches to the bundled credential after a user credential fails during a tool call', async () => {
    const seenAuthorization: string[] = []
    const built = await buildMcpToolProviders(
      pkulawConfig('Bearer user-credential-123'),
      {
        resolvePkulawFallbackToken: () => 'fallback-credential-456',
        clientFactory: async (_serverId, server) => {
          const authorization = server.headers.Authorization ?? ''
          seenAuthorization.push(authorization)
          return {
            listTools: async () => ({
              tools: [{ name: 'get_law_list', inputSchema: { type: 'object' } }]
            }),
            callTool: async () => {
              if (authorization.includes('user-credential')) {
                throw new Error(`Authorization: ${authorization}`)
              }
              return {
                content: [{
                  type: 'text',
                  text: `connected with fallback-credential-456`
                }]
              }
            },
            close: async () => undefined
          }
        }
      }
    )
    const tool = built.providers[0]?.tools[0]
    if (!tool) throw new Error('PKULaw tool was not built')

    const result = await tool.execute({}, toolContext('thread-pkulaw'))

    expect(seenAuthorization).toEqual([
      'Bearer user-credential-123',
      'Bearer fallback-credential-456'
    ])
    expect(JSON.stringify(result)).not.toMatch(/user-credential|fallback-credential/)
    expect(JSON.stringify(result)).toContain('<redacted>')
  })

  it('uses Flint static rendering automatically and persists image artifacts', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'legalwork-flint-chart-'))
    const png = Buffer.from('fake-png')
    const client: McpClientLike = {
      listTools: async () => ({
        tools: [
          {
            name: 'create_chart_view',
            inputSchema: { type: 'object' },
            _meta: { ui: { resourceUri: 'ui://flint-chart/chart-view.html' } }
          },
          {
            name: 'render_chart',
            inputSchema: { type: 'object' }
          }
        ]
      }),
      callTool: async () => ({
        content: [
          { type: 'image', data: png.toString('base64'), mimeType: 'image/png' },
          { type: 'text', text: 'vegalite · png · 400×300px' }
        ]
      }),
      close: async () => undefined
    }

    try {
      const built = await buildMcpToolProviders(mcpConfig('flint-chart'), {
        clientFactory: async () => client
      })
      const tools = built.providers[0]?.tools ?? []
      expect(tools.map((tool) => tool.name)).toEqual(['mcp_flint_chart_render_chart'])
      expect(tools[0]?.policy).toBe('auto')

      const rendered = await tools[0]!.execute(
        {},
        { ...toolContext('thread-flint'), workspace: tempRoot }
      )
      const output = rendered.output as {
        file_path: string
        artifacts: string[]
        result: { content: Array<{ type: string; text: string }> }
      }
      expect(output.artifacts).toEqual([output.file_path])
      expect(existsSync(output.file_path)).toBe(true)
      expect(readFileSync(output.file_path)).toEqual(png)
      expect(JSON.stringify(output.result)).not.toContain(png.toString('base64'))
      expect(output.result.content[0]?.text).toContain(output.file_path)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  it('keeps IMA knowledge-base tools directly advertised when tool search collapses the rest', async () => {
    const config = mcpConfig('ima-knowledge-base')
    config.search = {
      ...config.search,
      enabled: true,
      mode: 'auto',
      autoThresholdToolCount: 1
    }
    config.servers['pkulaw-law-keyword'] = {
      enabled: true,
      transport: 'streamable-http',
      url: 'https://apim-gateway.pkulaw.com/mcp-law',
      headers: {},
      env: {},
      args: [],
      trustScope: 'user',
      trustedWorkspaceRoots: [],
      timeoutMs: 30_000
    }
    const built = await buildMcpToolProviders(config, {
      clientFactory: async (serverId): Promise<McpClientLike> => ({
        listTools: async () => ({
          tools: serverId === 'ima-knowledge-base'
            ? [
                { name: 'research_ima', inputSchema: { type: 'object' } },
                { name: 'ask', inputSchema: { type: 'object' } }
              ]
            : [{ name: 'search_law', inputSchema: { type: 'object' } }]
        }),
        callTool: async () => ({}),
        close: async () => undefined
      })
    })

    expect(built.search.active).toBe(true)
    const providerIds = built.providers.map((provider) => provider.id)
    expect(providerIds).toContain('mcp:search')
    expect(providerIds).toContain('mcp:ima-knowledge-base')
    expect(providerIds).not.toContain('mcp:pkulaw-law-keyword')
    const imaProvider = built.providers.find((provider) => provider.id === 'mcp:ima-knowledge-base')
    expect(imaProvider?.tools.map((tool) => tool.name)).toEqual([
      'mcp_ima_knowledge_base_research_ima',
      'mcp_ima_knowledge_base_ask'
    ])
  })

  it('rebuilds split OfficeCLI add arguments with the active task document', async () => {
    const calls: Array<{ name: string; arguments: Record<string, unknown> }> = []
    const client: McpClientLike = {
      listTools: async () => ({
        tools: [{
          name: 'officecli',
          inputSchema: {
            type: 'object',
            properties: { command: { type: ['string', 'array'] } },
            required: ['command']
          }
        }]
      }),
      callTool: async (input) => {
        calls.push(input)
        return { isError: false }
      },
      close: async () => undefined
    }
    const built = await buildMcpToolProviders(mcpConfig(), {
      clientFactory: async () => client
    })
    const tool = built.providers[0]?.tools[0]
    if (!tool) throw new Error('OfficeCLI tool was not built')
    const file = '/tmp/案件材料/民事答辩状.docx'

    await tool.execute({ command: ['open', file] }, toolContext())
    await tool.execute({
      command: 'add',
      parent: '/body',
      type: 'paragraph',
      props: {
        text: '答辩人：赤峰兴业建筑有限公司',
        bold: true
      }
    }, toolContext())

    expect(tool.inputSchema).toMatchObject({ additionalProperties: false })
    expect(tool.description).toContain('prefer one batch call')
    expect(tool.description).toContain('Unknown command save')
    expect(tool.inputSchema).toMatchObject({
      properties: {
        commands: { type: 'array' },
        props: { type: 'object' }
      }
    })
    expect(calls[1]).toEqual({
      name: 'officecli',
      arguments: {
        command: [
          'add',
          file,
          '/body',
          '--type',
          'paragraph',
          '--prop',
          'text=答辩人：赤峰兴业建筑有限公司',
          '--prop',
          'bold=true'
        ]
      }
    })
  })
})

describe('normalizeOfficeCliArguments', () => {
  it('repairs a JSON-stringified argv array emitted by the model', () => {
    expect(normalizeOfficeCliArguments({
      command: '["open","/tmp/民事答辩状.docx"]'
    })).toEqual({
      arguments: { command: ['open', '/tmp/民事答辩状.docx'] }
    })
  })

  it('returns a concise retryable error instead of executing a bare add', () => {
    expect(normalizeOfficeCliArguments({
      command: 'add',
      parent: '/body',
      type: 'paragraph'
    })).toMatchObject({
      error: expect.stringContaining('no active document')
    })
  })

  it('turns structured batch operations into one AI-friendly OfficeCLI command', () => {
    const commands = [
      {
        command: 'add',
        parent: '/body',
        type: 'paragraph',
        props: { text: '第一段' }
      },
      {
        command: 'set',
        path: '/body/p[1]',
        props: { bold: true }
      }
    ]

    expect(normalizeOfficeCliArguments({
      command: 'batch',
      commands
    }, '/tmp/综述.docx')).toEqual({
      arguments: {
        command: [
          'batch',
          '/tmp/综述.docx',
          '--commands',
          JSON.stringify(commands),
          '--json'
        ]
      }
    })
  })

  it('treats path as the document element for bare set commands', () => {
    expect(normalizeOfficeCliArguments({
      command: 'set',
      path: '/body/p[1]',
      props: { style: 'Heading 1' }
    }, '/tmp/综述.docx')).toEqual({
      arguments: {
        command: [
          'set',
          '/tmp/综述.docx',
          '/body/p[1]',
          '--prop',
          'style=Heading 1'
        ]
      }
    })
  })

  it('rejects a missing command with an actionable error instead of executing', () => {
    const result = normalizeOfficeCliArguments({
      file: '/tmp/报告.docx',
      path: '/body/p[1]'
    }, '/tmp/报告.docx')
    expect(result.error).toContain('OfficeCLI command is required')
    expect(result.error).toContain('"get C:/path/报告.docx /body/p[1] --json"')
    expect(result.arguments).toEqual({})
  })

  it('treats an empty command array as a missing command', () => {
    expect(normalizeOfficeCliArguments({
      command: []
    })).toMatchObject({
      error: expect.stringContaining('OfficeCLI command is required')
    })
  })

  it('treats an all-blank command array as a missing command', () => {
    expect(normalizeOfficeCliArguments({
      command: ['', '  ']
    })).toMatchObject({
      error: expect.stringContaining('OfficeCLI command is required')
    })
  })

  it('treats a blank string command as a missing command', () => {
    expect(normalizeOfficeCliArguments({
      command: '   '
    })).toMatchObject({
      error: expect.stringContaining('OfficeCLI command is required')
    })
  })

  it('treats a JSON-stringified empty array as a missing command', () => {
    expect(normalizeOfficeCliArguments({
      command: '[]'
    })).toMatchObject({
      error: expect.stringContaining('OfficeCLI command is required')
    })
  })

  it('treats a JSON-stringified all-blank array as a missing command', () => {
    expect(normalizeOfficeCliArguments({
      command: '["", "  "]'
    })).toMatchObject({
      error: expect.stringContaining('OfficeCLI command is required')
    })
  })

  it('truncates large MCP text outputs so big tool results do not bloat history', () => {
    const bigText = 'x'.repeat(20_000)
    const input = { content: [{ type: 'text', text: bigText }] }

    const out = truncateMcpTextOutput(input) as { content: Array<{ text: string }> }

    expect(out.content[0]?.text.length).toBeLessThan(10_000)
    expect(out.content[0]?.text).toContain('输出已截断')
    expect(out.content[0]?.text).toContain('x'.repeat(1_000)) // 头部保留
  })

  it('leaves small MCP text outputs unchanged', () => {
    const input = { content: [{ type: 'text', text: 'short result' }] }

    const out = truncateMcpTextOutput(input) as { content: Array<{ text: string }> }

    expect(out.content[0]?.text).toBe('short result')
  })

  it('does not truncate in the 8001-9500 char band (would grow the output and report negative omitted)', () => {
    // head(8000) + tail(1500) = 9500; input in (8000, 9500] must stay untouched.
    const input = { content: [{ type: 'text', text: 'x'.repeat(9_000) }] }

    const out = truncateMcpTextOutput(input) as { content: Array<{ text: string }> }

    expect(out.content[0]?.text.length).toBe(9_000)
    expect(out.content[0]?.text).not.toContain('输出已截断')
  })

  it('truncates only when the output actually shrinks and reports a non-negative omitted count', () => {
    const input = { content: [{ type: 'text', text: 'x'.repeat(9_501) }] }

    const out = truncateMcpTextOutput(input) as { content: Array<{ text: string }> }

    const text = out.content[0]?.text
    expect(text).toContain('输出已截断')
    // head(8000) + tail(1500) + marker; the middle of the input is dropped.
    expect(text).not.toContain('x'.repeat(8_500))
    expect(text).toMatch(/省略约 \d+ 字符/) // no negative count
  })
})
