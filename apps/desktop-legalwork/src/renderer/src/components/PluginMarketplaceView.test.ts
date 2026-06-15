import { describe, expect, it } from 'vitest'
import {
  buildMcpConfig,
  customMcpConfigFragment,
  mcpConfigHasServer,
  mcpMarketplaceItemsFromConfigAndDiagnostics,
  mergeMcpJsonConfig,
  skillMarketplaceItemsFromDiscoveredSkills
} from './PluginMarketplaceView'

const mcpLabels = {
  configured: 'Configured',
  connected: 'Connected',
  error: 'Error',
  disabled: 'Disabled',
  pkulawTitle: 'PKULaw',
  pkulawSummary: (values: {
    total: number
    connected: number
    tools: number
    errors: number
    disabled: number
    lastError: string
  }) =>
    `${values.total} sub-services · ${values.connected} connected · ${values.tools} tools · ${values.errors} errors · ${values.disabled} disabled${values.lastError ? ` · ${values.lastError}` : ''}`
}

describe('PluginMarketplaceView MCP config helpers', () => {
  it('merges recommended MCP servers into JSON config without dropping existing fields', () => {
    const existing = JSON.stringify({
      timeouts: { read_timeout: 120 },
      servers: {
        legalwork_schedule: { command: '/Applications/legalwork.app' }
      }
    })

    const merged = mergeMcpJsonConfig(
      existing,
      buildMcpConfig('playwright', 'npx', ['-y', '@playwright/mcp@latest'])
    )
    const parsed = JSON.parse(merged.text) as Record<string, any>

    expect(merged.alreadyExists).toBe(false)
    expect(parsed.timeouts).toEqual({ read_timeout: 120 })
    expect(parsed.servers.legalwork_schedule).toEqual({ command: '/Applications/legalwork.app' })
    expect(parsed.servers.playwright).toMatchObject({
      enabled: true,
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest'],
      trustScope: 'user'
    })
    expect(mcpConfigHasServer(merged.text, 'playwright')).toBe(true)
  })

  it('treats PKULaw endpoint servers as the single PKULaw install', () => {
    const content = JSON.stringify({
      servers: {
        'pkulaw-law-keyword': {
          transport: 'streamable-http',
          url: 'https://apim-gateway.pkulaw.com/mcp-law'
        }
      }
    })

    expect(mcpConfigHasServer(content, 'pkulaw')).toBe(true)
  })

  it('detects duplicate MCP servers instead of appending old-style snippets', () => {
    const fragment = buildMcpConfig('context7', 'npx', ['-y', '@upstash/context7-mcp@latest'])
    const first = mergeMcpJsonConfig('', fragment)
    const second = mergeMcpJsonConfig(first.text, fragment)

    expect(first.alreadyExists).toBe(false)
    expect(second.alreadyExists).toBe(true)
    expect(JSON.parse(second.text).servers.context7).toMatchObject({ command: 'npx' })
  })

  it('accepts custom JSON as either a single server or a Legalwork config fragment', () => {
    expect(customMcpConfigFragment(
      'docs',
      '{"transport":"stdio","command":"npx","args":["-y","docs-mcp"]}',
      {}
    )).toEqual({
      servers: {
        docs: {
          transport: 'stdio',
          command: 'npx',
          args: ['-y', 'docs-mcp']
        }
      }
    })

    expect(customMcpConfigFragment(
      'github',
      '{"capabilities":{"mcp":{"servers":{"github":{"transport":"stdio","command":"github-mcp"}}}}}',
      {}
    )).toEqual({
      servers: {
        github: {
          transport: 'stdio',
          command: 'github-mcp'
        }
      }
    })
  })

  it('detects MCP servers from full Legalwork capability config', () => {
    const content = JSON.stringify({
      capabilities: {
        mcp: {
          servers: {
            github: {
              transport: 'stdio',
              command: 'github-mcp'
            }
          }
        }
      }
    })

    expect(mcpConfigHasServer(content, 'github')).toBe(true)
  })

  it('turns configured MCP servers into personal marketplace items', () => {
    const items = mcpMarketplaceItemsFromConfigAndDiagnostics(
      '{"servers":{"docs":{"transport":"stdio","command":"docs-mcp"}}}',
      null,
      mcpLabels
    )

    expect(items).toEqual([
      expect.objectContaining({
        id: 'docs',
        kind: 'mcp',
        group: 'personal',
        title: 'docs',
        description: expect.stringContaining('docs-mcp'),
        sourceLabel: 'Configured',
        statusTone: 'default'
      })
    ])
  })

  it('overlays MCP runtime diagnostics onto configured marketplace items', () => {
    const items = mcpMarketplaceItemsFromConfigAndDiagnostics(
      JSON.stringify({
        servers: {
          github: {
            transport: 'stdio',
            command: 'github-mcp'
          },
          disabled_docs: {
            transport: 'stdio',
            command: 'docs-mcp',
            enabled: false
          }
        }
      }),
      {
        mcpServers: [
          { id: 'github', status: 'connected', toolCount: 12 },
          { id: 'bad', status: 'error', lastError: 'missing token' }
        ]
      },
      mcpLabels
    )

    expect(items).toEqual([
      expect.objectContaining({
        id: 'bad',
        sourceLabel: 'Error',
        statusTone: 'error',
        description: expect.stringContaining('missing token')
      }),
      expect.objectContaining({
        id: 'disabled_docs',
        sourceLabel: 'Disabled',
        statusTone: 'warning'
      }),
      expect.objectContaining({
        id: 'github',
        sourceLabel: 'Connected',
        statusTone: 'success',
        description: expect.stringContaining('github-mcp')
      })
    ])
  })

  it('groups PKULaw child endpoints into one marketplace item', () => {
    const items = mcpMarketplaceItemsFromConfigAndDiagnostics(
      JSON.stringify({
        servers: {
          'pkulaw-law-keyword': {
            enabled: true,
            transport: 'streamable-http',
            url: 'https://apim-gateway.pkulaw.com/mcp-law'
          },
          'pkulaw-case-keyword': {
            enabled: true,
            transport: 'streamable-http',
            url: 'https://apim-gateway.pkulaw.com/mcp-case'
          },
          docs: {
            transport: 'stdio',
            command: 'docs-mcp'
          }
        }
      }),
      {
        mcpServers: [
          { id: 'pkulaw-law-keyword', status: 'connected', toolCount: 3 },
          { id: 'pkulaw-case-keyword', status: 'error', lastError: '401' }
        ]
      },
      mcpLabels
    )

    expect(items).toEqual([
      expect.objectContaining({ id: 'docs' }),
      expect.objectContaining({
        id: 'pkulaw',
        title: 'PKULaw',
        sourceLabel: 'Error',
        statusTone: 'error',
        description: expect.stringContaining('2 sub-services')
      })
    ])
    expect(items.some((item) => item.id === 'pkulaw-law-keyword')).toBe(false)
    expect(items.some((item) => item.id === 'pkulaw-case-keyword')).toBe(false)
  })
})

describe('skillMarketplaceItemsFromDiscoveredSkills', () => {
  it('turns discovered project and global skills into personal marketplace items', () => {
    const items = skillMarketplaceItemsFromDiscoveredSkills([
      {
        id: 'openspec-apply-change',
        name: 'Openspec Apply Change',
        description: 'Implement tasks from an OpenSpec change.',
        root: '/workspace/.codex/skills/openspec-apply-change',
        entryPath: '/workspace/.codex/skills/openspec-apply-change/SKILL.md',
        scope: 'project',
        legacy: true
      },
      {
        id: 'remotion-best-practices',
        name: 'Remotion Best Practices',
        description: 'Best practices for Remotion.',
        root: '/Users/demo/.agents/skills/remotion-best-practices',
        entryPath: '/Users/demo/.agents/skills/remotion-best-practices/SKILL.md',
        scope: 'global',
        legacy: true
      }
    ], { project: 'Project', global: 'Global', builtin: 'Builtin' })

    expect(items).toEqual([
      expect.objectContaining({
        id: 'openspec-apply-change',
        group: 'personal',
        title: 'Openspec Apply Change',
        sourceLabel: 'Project'
      }),
      expect.objectContaining({
        id: 'remotion-best-practices',
        group: 'personal',
        title: 'Remotion Best Practices',
        sourceLabel: 'Global'
      })
    ])
  })
})
