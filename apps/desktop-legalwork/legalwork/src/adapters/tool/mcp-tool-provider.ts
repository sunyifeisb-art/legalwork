import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { createHash, randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { delimiter, join } from 'node:path'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import type {
  McpCapabilityConfig,
  McpServerConfig
} from '../../contracts/capabilities.js'
import { REDACTED_SECRET, redactSecretText } from '../../config/secret-redaction.js'
import type { ToolHostContext } from '../../ports/tool-host.js'
import type { CapabilityToolProvider } from './capability-registry.js'
import { LocalToolHost, type LocalTool } from './local-tool-host.js'
import {
  createMcpSearchProvider,
  mcpSearchDiagnostic,
  type McpSearchCatalogRecord,
  type McpSearchCatalogState,
  type McpSearchRuntimeDiagnostic
} from './mcp-tool-search.js'
import {
  createPkulawConnectionCandidates,
  resolveBundledPkulawToken
} from './pkulaw-fallback-auth.js'
import { isImaKnowledgeBaseProvider } from '../../shared/ima-tools.js'

export type McpToolDescriptor = {
  name: string
  title?: string
  description?: string
  inputSchema?: Record<string, unknown>
  outputSchema?: Record<string, unknown>
  annotations?: {
    title?: string
    readOnlyHint?: boolean
    destructiveHint?: boolean
    idempotentHint?: boolean
    openWorldHint?: boolean
  }
  execution?: unknown
  icons?: unknown
  _meta?: Record<string, unknown>
}

export type McpClientLike = {
  listTools(options?: {
    cursor?: string
    signal?: AbortSignal
    timeout?: number
  }): Promise<{ tools: McpToolDescriptor[]; nextCursor?: string }>
  callTool(
    input: { name: string; arguments: Record<string, unknown> },
    options?: { signal?: AbortSignal; timeout?: number }
  ): Promise<unknown>
  close(): Promise<void>
}

export type McpServerDiagnostic = {
  id: string
  enabled: boolean
  transport: McpServerConfig['transport']
  trustScope: McpServerConfig['trustScope']
  available: boolean
  status: 'disabled' | 'connecting' | 'connected' | 'error'
  toolCount: number
  catalogFingerprint?: string
  catalogDrift?: boolean
  lastConnectedAt?: string
  lastError?: string
}

export type McpToolProviderBuildResult = {
  providers: CapabilityToolProvider[]
  diagnostics: McpServerDiagnostic[]
  search: McpSearchRuntimeDiagnostic
  connectedServers: number
  toolCount: number
  close: () => Promise<void>
}

export type McpToolProviderOptions = {
  clientFactory?: (serverId: string, server: McpServerConfig) => Promise<McpClientLike>
  nowIso?: () => string
  startupTimeoutMs?: number
  resolvePkulawFallbackToken?: () => string | undefined
  onServerSettled?: (input: {
    serverId: string
    provider?: CapabilityToolProvider
    diagnostic: McpServerDiagnostic
  }) => Promise<void> | void
}

type McpConnectionState = {
  serverId: string
  server: McpServerConfig
  connectionCandidates: McpServerConfig[]
  activeCandidateIndex: number
  client: McpClientLike
  clientFactory: (serverId: string, server: McpServerConfig) => Promise<McpClientLike>
  nowIso: () => string
  catalogFingerprint?: string
  catalogDrift?: boolean
  lastConnectedAt?: string
  lastError?: string
}

type McpServerBuildOutcome = {
  directProvider?: CapabilityToolProvider
  diagnostic: McpServerDiagnostic
  state?: McpConnectionState
  catalogRecords?: McpSearchCatalogRecord[]
}

const MCP_STARTUP_TIMEOUT_MS = 30_000
const STDIO_STARTUP_TIMEOUT_MS = 60_000
const COMMON_EXEC_PATHS = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin']
const FLINT_CHART_SERVER_IDS = new Set(['flint-chart', 'flint_chart'])

export function pendingMcpToolProviders(
  config: McpCapabilityConfig | undefined
): McpToolProviderBuildResult {
  const searchConfig = config?.search ?? {
    enabled: false,
    mode: 'auto' as const,
    autoThresholdToolCount: 24,
    topKDefault: 5,
    topKMax: 10,
    minScore: 0.15,
    bm25: { k1: 1.2, b: 0.75 }
  }
  const diagnostics = Object.entries(config?.servers ?? {}).map(([serverId, server]) => {
    const effectivelyEnabled = server.enabled && (config?.enabled !== false)
    return serverDiagnostic(
      { serverId, server: { ...server, enabled: effectivelyEnabled } },
      effectivelyEnabled ? 'connecting' : 'disabled',
      0
    )
  })
  return {
    providers: [],
    diagnostics,
    search: mcpSearchDiagnostic({
      config: searchConfig,
      active: false,
      indexedToolCount: 0,
      advertisedToolCount: 0,
      state: { records: [] }
    }),
    connectedServers: 0,
    toolCount: 0,
    close: async () => undefined
  }
}

export async function buildMcpToolProviders(
  config: McpCapabilityConfig | undefined,
  options: McpToolProviderOptions = {}
): Promise<McpToolProviderBuildResult> {
  const providers: CapabilityToolProvider[] = []
  const directProviders: CapabilityToolProvider[] = []
  const diagnostics: McpServerDiagnostic[] = []
  const connected: McpConnectionState[] = []
  const catalogState: McpSearchCatalogState = { records: [] }
  const mcp = config
  const nowIso = options.nowIso ?? (() => new Date().toISOString())
  const clientFactory = options.clientFactory ?? createSdkMcpClient
  const startupTimeoutMs = options.startupTimeoutMs ?? MCP_STARTUP_TIMEOUT_MS
  if (!mcp?.enabled) {
    return {
      providers,
      diagnostics,
      search: mcpSearchDiagnostic({
        config: config?.search ?? {
          enabled: false,
          mode: 'auto',
          autoThresholdToolCount: 24,
          topKDefault: 5,
          topKMax: 10,
          minScore: 0.15,
          bm25: { k1: 1.2, b: 0.75 }
        },
        active: false,
        indexedToolCount: 0,
        advertisedToolCount: 0,
        state: catalogState
      }),
      connectedServers: 0,
      toolCount: 0,
      close: async () => undefined
    }
  }
  const pkulawFallbackToken = (
    options.resolvePkulawFallbackToken ?? resolveBundledPkulawToken
  )()

  const outcomeResults = await Promise.allSettled(Object.entries(mcp.servers).map(async ([serverId, server]) => {
    if (!server.enabled) {
      const outcome: McpServerBuildOutcome = {
        diagnostic: serverDiagnostic({ serverId, server }, 'disabled', 0)
      }
      await options.onServerSettled?.({ serverId, diagnostic: outcome.diagnostic })
      return outcome
    }
    try {
      const connectionCandidates = createPkulawConnectionCandidates(server, pkulawFallbackToken)
      const { state, listed } = await connectMcpServer({
        serverId,
        connectionCandidates,
        clientFactory,
        nowIso,
        startupTimeoutMs
      })
      const catalogRecords = listed.map((tool) => createMcpSearchCatalogRecord(state, tool))
      const tools = listed.map((tool) => createMcpLocalTool(state, tool))
      const outcome: McpServerBuildOutcome = {
        state,
        catalogRecords,
        directProvider: {
          id: `mcp:${serverId}`,
          kind: 'mcp',
          enabled: true,
          available: true,
          tools
        },
        diagnostic: serverDiagnostic(state, 'connected', tools.length)
      }
      await options.onServerSettled?.({
        serverId,
        provider: outcome.directProvider,
        diagnostic: outcome.diagnostic
      })
      return outcome
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      // 北大法宝未配用户 token、走内置 fallback 时，若 fallback 账号配额/积分耗尽
      // （401/90001/remaining points），明确提示用户自配 Token，而不是笼统地显示
      // "鉴权失败"，避免用户误以为只是自己没配 token。
      const hasUserAuthorization = Object.entries(server.headers ?? {}).some(
        ([key]) => key.toLowerCase() === 'authorization'
      )
      const isPkulawFallbackQuota =
        serverId.startsWith('pkulaw') &&
        !hasUserAuthorization &&
        isMcpAuthQuotaErrorText(message)
      const lastError = isPkulawFallbackQuota
        ? '北大法宝内置备用额度已耗尽（401/积分不足）。请在插件市场中配置你自己的北大法宝 Token 后重试。'
        : redactMcpErrorMessage(error, [server])
      const outcome: McpServerBuildOutcome = {
        diagnostic: serverDiagnostic(
          { serverId, server },
          'error',
          0,
          lastError
        )
      }
      await options.onServerSettled?.({ serverId, diagnostic: outcome.diagnostic })
      return outcome
    }
  }))
  const outcomes = outcomeResults
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter((outcome): outcome is NonNullable<typeof outcome> => outcome !== null)

  for (const outcome of outcomes) {
    diagnostics.push(outcome.diagnostic)
    if (outcome.state) connected.push(outcome.state)
    if (outcome.catalogRecords) catalogState.records.push(...outcome.catalogRecords)
    if (outcome.directProvider) directProviders.push(outcome.directProvider)
  }

  const connectedServers = diagnostics.filter((diagnostic) => diagnostic.status === 'connected').length
  const toolCount = catalogState.records.length
  catalogState.lastRefreshedAt = nowIso()
  catalogState.catalogFingerprint = catalogFingerprint(catalogState.records.map((record) => record.toolId))
  const searchActive = shouldUseMcpSearch(mcp.search, toolCount) && connectedServers > 0
  if (searchActive) {
    providers.push(createMcpSearchProvider({
      config: mcp.search,
      state: catalogState,
      refreshCatalog: async () => {
        try {
          const records: McpSearchCatalogRecord[] = []
          const previousFingerprint = catalogState.catalogFingerprint
          for (const state of connected) {
            const listed = await refreshMcpConnectionCatalogWithFallback(state)
            records.push(...listed.map((tool) => createMcpSearchCatalogRecord(state, tool)))
          }
          catalogState.records = records
          catalogState.lastError = undefined
          catalogState.lastRefreshedAt = nowIso()
          catalogState.catalogFingerprint = catalogFingerprint(records.map((record) => record.toolId))
          catalogState.catalogDrift = Boolean(previousFingerprint && previousFingerprint !== catalogState.catalogFingerprint)
          return records
        } catch (error) {
          catalogState.lastError = redactSecretText(errorMessage(error))
          throw error
        }
      },
      isServerTrusted: isMcpServerTrusted
    }))
    // IMA 知识库工具不参与折叠：工具搜索模式下其余 MCP 工具只剩 mcp_search /
    // mcp_call 调度入口，但 IMA 必须保持直连，模型才能随时自主检索知识库。
    providers.push(...directProviders.filter((provider) => isImaKnowledgeBaseProvider(provider.id)))
  } else {
    providers.push(...directProviders)
  }
  const advertisedToolCount = providers.reduce((total, provider) => total + provider.tools.length, 0)
  return {
    providers,
    diagnostics,
    search: mcpSearchDiagnostic({
      config: mcp.search,
      active: searchActive,
      indexedToolCount: toolCount,
      advertisedToolCount,
      state: catalogState
    }),
    connectedServers,
    toolCount,
    close: async () => {
      await Promise.all(connected.map((state) => closeMcpClient(state.client)))
    }
  }
}

export function normalizeMcpToolName(serverId: string, toolName: string): string {
  return `mcp_${slug(serverId)}_${slug(toolName)}`
}

export function isMcpServerTrusted(server: McpServerConfig, workspace: string): boolean {
  void server
  void workspace
  return true
}

async function connectMcpServer(input: {
  serverId: string
  connectionCandidates: McpServerConfig[]
  clientFactory: (serverId: string, server: McpServerConfig) => Promise<McpClientLike>
  nowIso: () => string
  startupTimeoutMs: number
}): Promise<{ state: McpConnectionState; listed: McpToolDescriptor[] }> {
  let lastError: Error | undefined
  for (let index = 0; index < input.connectionCandidates.length; index += 1) {
    const server = input.connectionCandidates[index]!
    let client: McpClientLike | undefined
    try {
      client = await input.clientFactory(
        input.serverId,
        serverWithStartupTimeout(server, input.startupTimeoutMs)
      )
      const state: McpConnectionState = {
        serverId: input.serverId,
        server,
        connectionCandidates: input.connectionCandidates,
        activeCandidateIndex: index,
        client,
        clientFactory: input.clientFactory,
        nowIso: input.nowIso,
        lastConnectedAt: input.nowIso()
      }
      const listed = await refreshMcpConnectionCatalog(state)
      return { state, listed }
    } catch (error) {
      await client?.close().catch(() => undefined)
      lastError = redactedMcpError(error, input.connectionCandidates)
    }
  }
  throw lastError ?? new Error(`MCP server ${input.serverId} has no usable connection candidate`)
}

async function createSdkMcpClient(serverId: string, server: McpServerConfig): Promise<McpClientLike> {
  const client = new Client({ name: `legalwork-${serverId}`, version: '0.1.0' })
  const transport = createTransport(server)
  await client.connect(transport, { timeout: server.timeoutMs })
  return {
    listTools: (options) => {
      const params = options?.cursor ? { cursor: options.cursor } : undefined
      return client.listTools(params, {
        signal: options?.signal,
        timeout: options?.timeout
      })
    },
    callTool: (input, options) => client.callTool(input, undefined, options),
    close: () => client.close()
  }
}

function createTransport(server: McpServerConfig): Transport {
  switch (server.transport) {
    case 'stdio':
      return new StdioClientTransport({
        command: server.command ?? '',
        args: server.args,
        env: stdioMcpEnv(server.env),
        stderr: 'pipe'
      })
    case 'streamable-http':
      return new StreamableHTTPClientTransport(new URL(server.url ?? ''), {
        requestInit: { headers: server.headers }
      })
    case 'sse':
      return new SSEClientTransport(new URL(server.url ?? ''), {
        requestInit: { headers: server.headers },
        eventSourceInit: { fetch: fetchWithHeaders(server.headers) }
      })
  }
}

function serverWithStartupTimeout(server: McpServerConfig, startupTimeoutMs: number): McpServerConfig {
  if (server.transport === 'stdio') {
    // stdio servers (especially via npx) may need to download/install packages on first run,
    // so guarantee a generous startup window even when the configured runtime timeout is small.
    // A larger user-configured timeout is honored as-is.
    return {
      ...server,
      timeoutMs: Math.max(server.timeoutMs, STDIO_STARTUP_TIMEOUT_MS)
    }
  }
  // Non-stdio servers are capped at the global startup budget so a slow endpoint can't stall boot.
  return {
    ...server,
    timeoutMs: Math.min(server.timeoutMs, startupTimeoutMs)
  }
}

function stdioMcpEnv(env: Record<string, string>): Record<string, string> {
  const inherited: Record<string, string> = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === 'string') inherited[key] = value
  }
  const merged = { ...inherited, ...env }
  merged.PATH = mergeExecutablePath(env.PATH ?? process.env.PATH)
  return merged
}

function mergeExecutablePath(pathValue: string | undefined): string {
  const seen = new Set<string>()
  const parts: string[] = []
  for (const part of [...(pathValue ?? '').split(delimiter), ...COMMON_EXEC_PATHS]) {
    const trimmed = part.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    parts.push(trimmed)
  }
  return parts.join(delimiter)
}

function fetchWithHeaders(headers: Record<string, string>): typeof fetch {
  return (input, init) => {
    const mergedHeaders = new Headers(init?.headers)
    for (const [key, value] of Object.entries(headers)) {
      mergedHeaders.set(key, value)
    }
    return fetch(input, { ...init, headers: mergedHeaders })
  }
}

function createMcpLocalTool(
  state: McpConnectionState,
  descriptor: McpToolDescriptor
): LocalTool {
  const officeCliDocuments = isOfficeCliTool(state.serverId, descriptor.name)
    ? new Map<string, string>()
    : undefined
  return LocalToolHost.defineTool({
    name: normalizeMcpToolName(state.serverId, descriptor.name),
    description: isOfficeCliTool(state.serverId, descriptor.name)
      ? officeCliToolDescription(descriptor.description)
      : descriptor.description ?? `MCP tool ${descriptor.name} from ${state.serverId}`,
    inputSchema: normalizeMcpInputSchema(state.serverId, descriptor),
    policy: policyForMcpTool(state.serverId, descriptor),
    shouldAdvertise: (context: ToolHostContext) => isMcpServerTrusted(state.server, context.workspace),
    execute: async (args, context) => {
      if (!isMcpServerTrusted(state.server, context.workspace)) {
        return {
          output: { error: `MCP server ${state.serverId} is not trusted for this workspace` },
          isError: true
        }
      }
      const normalized = officeCliDocuments
        ? normalizeOfficeCliArguments(args, officeCliDocuments.get(context.threadId))
        : { arguments: args }
      if (normalized.error) {
        return {
          output: {
            error: normalized.error,
            hint: 'Pass the complete OfficeCLI command in the command field, including the document file path.'
          },
          isError: true
        }
      }
      let result: unknown
      try {
        result = await callMcpToolWithReconnect(
          state,
          { name: descriptor.name, arguments: normalized.arguments },
          context.abortSignal
        )
      } catch (error) {
        // 认证/配额/积分不足类错误是确定性的：该源的 token 无效或额度用尽，
        // 重试不会恢复。转换成清晰的换源引导，避免模型误以为参数错误而反复重试
        // （既浪费 token 又得不到结果），并提示用户可配置自己的 Token。
        const message = error instanceof Error ? error.message : String(error)
        if (isMcpAuthQuotaErrorText(message)) {
          return {
            output: {
              error: `${state.serverId} 鉴权失败或配额/积分不足（${message.slice(0, 200)}）`,
              hint: `此 MCP 源的 Token 无效或账号额度已用尽，重试不会恢复。不要再调用此源的任何工具。` +
                `请改用其他可用来源（如元典、本地知识库、IMA），或提示用户在插件市场中配置此源的访问 Token。`
            },
            isError: true
          }
        }
        throw error
      }
      if (officeCliDocuments && !mcpResultIsError(result)) {
        rememberOfficeCliDocument(
          officeCliDocuments,
          context.threadId,
          normalized.arguments.command
        )
      }
      const hostedResult = await normalizeMcpResultForHost(
        state.serverId,
        descriptor.name,
        result,
        context.workspace
      )
      return {
        output: {
          serverId: state.serverId,
          toolName: descriptor.name,
          result: hostedResult.result,
          ...(hostedResult.artifacts.length > 0
            ? {
                file_path: hostedResult.artifacts[0],
                artifacts: hostedResult.artifacts
              }
            : {})
        },
        isError: typeof result === 'object' && result !== null && (result as { isError?: boolean }).isError === true
      }
    }
  })
}

type OfficeCliNormalization = {
  arguments: Record<string, unknown>
  error?: string
}

function isOfficeCliTool(serverId: string, toolName: string): boolean {
  return serverId.toLowerCase() === 'officecli' && toolName.toLowerCase() === 'officecli'
}

function normalizeMcpInputSchema(
  serverId: string,
  descriptor: McpToolDescriptor
): Record<string, unknown> {
  const schema = descriptor.inputSchema ?? { type: 'object' }
  if (!isOfficeCliTool(serverId, descriptor.name)) return schema
  const properties = typeof schema.properties === 'object' && schema.properties !== null
    ? schema.properties as Record<string, unknown>
    : {}
  const commandProperty = typeof properties.command === 'object' && properties.command !== null
    ? properties.command as Record<string, unknown>
    : {}
  return {
    ...schema,
    properties: {
      ...properties,
      command: {
        ...commandProperty,
        description:
          'The full OfficeCLI command — a single string or an argv array. This is the ONLY required field; always populate it with the complete command including the document path. The optional fields below (file/path/parent/...) are helpers used only when command is a single verb like add/set.'
      },
      file: {
        type: 'string',
        description: 'Document path helper — only used together with a single-verb command (add/set/open/...); command is still required.'
      },
      parent: {
        type: 'string',
        description: 'Parent document element path for a bare add command, such as /body. Only used with a single-verb command; command is still required.'
      },
      path: {
        type: 'string',
        description: 'Document element path for a bare get/set/remove command. Only used with a single-verb command; command is still required.'
      },
      type: {
        type: 'string',
        description: 'Element type for a bare add command. Only used with a single-verb command; command is still required.'
      },
      props: {
        type: 'object',
        additionalProperties: true,
        description: 'Element properties for a bare add/set command. Only used with a single-verb command; command is still required.'
      },
      commands: {
        type: 'array',
        items: { type: 'object', additionalProperties: true },
        description:
          'Structured batch operations. Use with command="batch"; each item uses a bare command plus sibling fields such as parent/path/type/props.'
      },
      stop_on_error: {
        type: 'boolean',
        description: 'For batch only. Stop at the first failed operation instead of reporting per-item errors.'
      }
    },
    additionalProperties: false
  }
}

function officeCliToolDescription(baseDescription?: string): string {
  return [
    baseDescription ?? 'Read and write Office documents through OfficeCLI.',
    '',
    'Efficiency and quality contract:',
    '- Keep requested content, citations, structure, and visible formatting complete; batching is only an execution optimization.',
    '- For three or more related add/set operations, prefer one batch call instead of many single calls.',
    '- Structured form: command="batch", file="/path/report.docx", commands=[{"command":"add","parent":"/body","type":"paragraph","props":{"text":"..."}}].',
    '- Equivalent argv form: ["batch","/path/report.docx","--commands","<JSON array>","--json"].',
    '- Batch items use a bare verb with sibling fields (parent/path/type/props); do not put a full CLI string inside an item command.',
    '- If a batch partially fails, retry only failed items. Never repeat identical failed arguments.',
    '- After substantive writing, flush the document (save) then validate. Note: the save command is only available in recent officecli builds; if you get Unknown command save, use close instead. Once validation passes, only repair remaining issues that materially affect requested content, structure, or visible formatting.'
  ].join('\n')
}

/**
 * OfficeCLI exposes one `command` argument, but some OpenAI-compatible models
 * occasionally split CLI flags into tool-call fields. Recover the safe subset
 * here so a resident document can still be edited instead of executing a bare
 * `add`/`set` command and dumping CLI help into the conversation.
 */
export function normalizeOfficeCliArguments(
  input: Record<string, unknown>,
  activeDocument?: string
): OfficeCliNormalization {
  const rawCommand = input.command
  const parsedArray = parseJsonStringArray(rawCommand)
  if (parsedArray) {
    if (parsedArray.length === 0 || parsedArray.every((part) => !part.trim())) {
      return missingOfficeCliCommandResult()
    }
    return { arguments: { command: parsedArray } }
  }
  if (Array.isArray(rawCommand)) {
    if (!rawCommand.every((part) => typeof part === 'string')) {
      return { arguments: {}, error: 'OfficeCLI command arrays may only contain strings.' }
    }
    if (rawCommand.length === 0 || rawCommand.every((part) => !part.trim())) {
      return missingOfficeCliCommandResult()
    }
    return { arguments: { command: rawCommand } }
  }
  if (typeof rawCommand !== 'string' || !rawCommand.trim()) {
    return missingOfficeCliCommandResult()
  }

  const words = officeCliCommandWords(rawCommand)
  if (words.length !== 1) return { arguments: { command: rawCommand } }
  const verb = words[0]?.toLowerCase()
  if (!verb || !OFFICECLI_FILE_COMMANDS.has(verb)) {
    return { arguments: { command: rawCommand } }
  }

  const file = scalarToolArgument(input.file)
    ?? scalarToolArgument(input.document)
    ?? (!OFFICECLI_PARENT_COMMANDS.has(verb) ? scalarToolArgument(input.path) : undefined)
    ?? activeDocument
  if (!file) {
    return {
      arguments: {},
      error: `OfficeCLI ${verb} requires a document file path; no active document is recorded for this task.`
    }
  }

  const command = [verb, file]
  if (OFFICECLI_PARENT_COMMANDS.has(verb)) {
    const parent = scalarToolArgument(input.parent)
      ?? scalarToolArgument(input.target)
      ?? scalarToolArgument(input.element)
      ?? scalarToolArgument(input.path)
    if (!parent) {
      return {
        arguments: {},
        error: `OfficeCLI ${verb} requires a document element path such as /body.`
      }
    }
    command.push(parent)
  }
  appendOfficeCliOptions(command, input)
  return { arguments: { command } }
}

/**
 * Actionable error for a missing/blank OfficeCLI command. Models read tool
 * errors on the next turn, so the message shows the exact shape to resend
 * instead of a bare "command is required".
 */
function missingOfficeCliCommandResult(): OfficeCliNormalization {
  return {
    arguments: {},
    error:
      'OfficeCLI command is required. Send the full command as one string, e.g. "get C:/path/报告.docx /body/p[1] --json", or as an argv array, e.g. ["get","C:/path/报告.docx","/body/p[1]","--json"].'
  }
}

const OFFICECLI_FILE_COMMANDS = new Set([
  'create', 'open', 'close', 'save', 'view', 'validate', 'get', 'query', 'set', 'add', 'remove', 'move', 'swap', 'batch', 'raw'
])
const OFFICECLI_PARENT_COMMANDS = new Set(['get', 'set', 'add', 'remove', 'move', 'swap'])

function appendOfficeCliOptions(command: string[], input: Record<string, unknown>): void {
  const type = scalarToolArgument(input.type)
  if (type) command.push('--type', type)
  for (const [name, value] of Object.entries(objectToolArgument(input.props) ?? objectToolArgument(input.properties) ?? {})) {
    const normalized = scalarToolArgument(value)
    if (normalized !== undefined) command.push('--prop', `${name}=${normalized}`)
  }
  for (const option of ['from', 'index', 'after', 'before', 'input'] as const) {
    const value = scalarToolArgument(input[option])
    if (value !== undefined) command.push(`--${option}`, value)
  }
  const commands = input.commands
  if (Array.isArray(commands)) {
    command.push('--commands', JSON.stringify(commands))
  } else if (typeof commands === 'string' && commands.trim()) {
    command.push('--commands', commands.trim())
  }
  if (input.stop_on_error === true || input.stopOnError === true) {
    command.push('--stop-on-error')
  }
  if (input.force === true) command.push('--force')
  if (input.json === true || (command[0]?.toLowerCase() === 'batch' && input.json !== false)) {
    command.push('--json')
  }
  const additional = input.additionalArguments ?? input.additional_arguments
  if (Array.isArray(additional)) {
    for (const value of additional) {
      const normalized = scalarToolArgument(value)
      if (normalized !== undefined) command.push(normalized)
    }
  }
}

function scalarToolArgument(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

function objectToolArgument(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined
}

function parseJsonStringArray(value: unknown): string[] | undefined {
  if (typeof value !== 'string' || !value.trim().startsWith('[')) return undefined
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) && parsed.every((part) => typeof part === 'string')
      ? parsed
      : undefined
  } catch {
    return undefined
  }
}

function officeCliCommandWords(command: unknown): string[] {
  if (Array.isArray(command)) {
    return command.filter((part): part is string => typeof part === 'string')
  }
  if (typeof command !== 'string') return []
  const words: string[] = []
  let current = ''
  let quote: '"' | "'" | undefined
  let escaped = false
  for (const char of command.trim()) {
    if (escaped) {
      current += char
      escaped = false
      continue
    }
    if (char === '\\' && quote !== "'") {
      escaped = true
      continue
    }
    if (quote) {
      if (char === quote) quote = undefined
      else current += char
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if (/\s/.test(char)) {
      if (current) {
        words.push(current)
        current = ''
      }
      continue
    }
    current += char
  }
  if (escaped) current += '\\'
  if (current) words.push(current)
  if (words[0]?.toLowerCase() === 'officecli') words.shift()
  return words
}

function rememberOfficeCliDocument(
  documents: Map<string, string>,
  threadId: string,
  command: unknown
): void {
  const words = officeCliCommandWords(command)
  const verb = words[0]?.toLowerCase()
  const file = words[1]
  if (!verb || !file) return
  if (verb === 'create' || verb === 'open') {
    documents.set(threadId, file)
  } else if (verb === 'close' && documents.get(threadId) === file) {
    documents.delete(threadId)
  }
}

function mcpResultIsError(result: unknown): boolean {
  return typeof result === 'object'
    && result !== null
    && (result as { isError?: boolean }).isError === true
}

async function listAllMcpTools(client: McpClientLike, timeout: number): Promise<McpToolDescriptor[]> {
  const tools: McpToolDescriptor[] = []
  let cursor: string | undefined
  do {
    const listed = await client.listTools({ cursor, timeout })
    tools.push(...listed.tools)
    cursor = listed.nextCursor
  } while (cursor)
  return tools
}

function createMcpSearchCatalogRecord(
  state: McpConnectionState,
  descriptor: McpToolDescriptor
): McpSearchCatalogRecord {
  return {
    toolId: `${state.serverId}/${descriptor.name}`,
    serverId: state.serverId,
    server: state.server,
    client: {
      callTool: (input, options) =>
        callMcpToolWithReconnect(state, input, options?.signal, options?.timeout)
    },
    descriptor,
    normalizedName: normalizeMcpToolName(state.serverId, descriptor.name),
    policy: policyForMcpTool(state.serverId, descriptor)
  }
}

async function refreshMcpConnectionCatalog(state: McpConnectionState): Promise<McpToolDescriptor[]> {
  const listed = (await listAllMcpTools(state.client, state.server.timeoutMs))
    .filter((tool) => !isUnsupportedFlintMcpAppTool(state.serverId, tool))
  const nextFingerprint = catalogFingerprint(listed.map((tool) => tool.name))
  state.catalogDrift = Boolean(state.catalogFingerprint && state.catalogFingerprint !== nextFingerprint)
  state.catalogFingerprint = nextFingerprint
  state.lastError = undefined
  return listed
}

async function refreshMcpConnectionCatalogWithFallback(
  state: McpConnectionState
): Promise<McpToolDescriptor[]> {
  try {
    return await refreshMcpConnectionCatalog(state)
  } catch (error) {
    state.lastError = redactMcpErrorMessage(error, state.connectionCandidates)
    const client = await reconnectMcpConnection(state)
    void client
    try {
      return await refreshMcpConnectionCatalog(state)
    } catch (retryError) {
      throw redactedMcpError(retryError, state.connectionCandidates)
    }
  }
}

async function callMcpToolWithReconnect(
  state: McpConnectionState,
  input: { name: string; arguments: Record<string, unknown> },
  signal: AbortSignal | undefined,
  timeout = state.server.timeoutMs
): Promise<unknown> {
  try {
    const result = await state.client.callTool(input, { signal, timeout })
    if (mcpResultRequiresCredentialFallback(result) && hasNextConnectionCandidate(state)) {
      const client = await reconnectMcpConnection(state)
      const retried = await client.callTool(input, { signal, timeout })
      return redactMcpPayload(retried, state.connectionCandidates)
    }
    return redactMcpPayload(result, state.connectionCandidates)
  } catch (error) {
    const safeMessage = redactMcpErrorMessage(error, state.connectionCandidates)
    state.lastError = safeMessage
    if (signal?.aborted) throw error
    // 鉴权/配额/积分不足类错误是确定性的（token 无效或额度用尽），重连不会恢复，
    // 跳过重连直接抛出，让上层/提示词走"换源或 web_search 兜底"，避免白烧一次调用。
    if (isMcpAuthQuotaErrorText(safeMessage)) {
      throw redactedMcpError(error, state.connectionCandidates)
    }
    try {
      const client = await reconnectMcpConnection(state)
      const result = await client.callTool(input, { signal, timeout })
      return redactMcpPayload(result, state.connectionCandidates)
    } catch (retryError) {
      throw redactedMcpError(retryError, state.connectionCandidates)
    }
  }
}

// 重连超时：stdio 冷启动（spawn 子进程 + 可能首次启动）需要更宽预算，
// 网络型（sse/http）则更快超时避免拖死调用。
const MCP_RECONNECT_TIMEOUT_MS = 15_000
const MCP_RECONNECT_STDIO_TIMEOUT_MS = 45_000

/**
 * 安全关闭一个可能未初始化（undefined）的 MCP 客户端。`client.close()` 在 client
 * 为 undefined 时会同步抛 TypeError（"Cannot read properties of undefined (reading
 * 'close')"），必须用可选链 + try/catch 兜底；关闭失败不影响重连/调用主流程。
 */
async function closeMcpClient(client: McpClientLike | undefined): Promise<void> {
  try {
    await client?.close()
  } catch {
    // close 失败绝不能影响主流程（曾出现连接中途被清理导致 close 抛错）
  }
}

async function reconnectMcpConnection(state: McpConnectionState): Promise<McpClientLike> {
  const isStdio = state.server.transport === 'stdio'
  const reconnectTimeoutMs = isStdio ? MCP_RECONNECT_STDIO_TIMEOUT_MS : MCP_RECONNECT_TIMEOUT_MS
  // 给 close 加超时，避免客户端卡在关闭流程导致调用挂死；同时清理 timer。
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  await Promise.race([
    closeMcpClient(state.client),
    new Promise<void>((resolve) => {
      closeTimer = setTimeout(resolve, reconnectTimeoutMs)
    })
  ])
  if (closeTimer) clearTimeout(closeTimer)
  const nextIndex = hasNextConnectionCandidate(state)
    ? state.activeCandidateIndex + 1
    : state.activeCandidateIndex
  const indexes = [
    ...Array.from(
      { length: state.connectionCandidates.length - nextIndex },
      (_, offset) => nextIndex + offset
    ),
    ...(nextIndex === state.activeCandidateIndex ? [] : [state.activeCandidateIndex])
  ]
  let lastError: unknown
  for (const index of indexes) {
    const server = state.connectionCandidates[index]!
    let connecting: Promise<McpClientLike> | undefined
    try {
      connecting = state.clientFactory(state.serverId, server)
      const client = await Promise.race([
        connecting,
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error(`MCP reconnect to ${server.command ?? server.url ?? index} timed out after ${reconnectTimeoutMs}ms`)),
            reconnectTimeoutMs
          )
        )
      ])
      state.server = server
      state.activeCandidateIndex = index
      state.client = client
      state.lastConnectedAt = state.nowIso()
      state.lastError = undefined
      return client
    } catch (error) {
      // 超时/失败时，若 clientFactory 仍在后台建立连接，把随后连上的 client
      // 关闭掉，避免孤儿连接/子进程泄漏（stdio transport 会 spawn 进程）。
      if (connecting) {
        void connecting
          .then((leaked) => closeMcpClient(leaked))
          .catch(() => undefined)
      }
      lastError = error
    }
  }
  // 所有候选都失败：旧的 state.client 可能已处于半关闭状态，不能再复用。
  // 清理掉，避免后续调用复用一个损坏的连接。
  const staleClient = state.client
  if (staleClient) {
    state.client = undefined as unknown as McpClientLike
    void closeMcpClient(staleClient)
  }
  // No viable candidate found; throw the last error or a clear fallback
  if (lastError) throw redactedMcpError(lastError, state.connectionCandidates)
  throw new Error(`MCP server ${state.serverId}: all connection candidates failed (${state.connectionCandidates.length} tried)`)
}

function hasNextConnectionCandidate(state: McpConnectionState): boolean {
  return state.activeCandidateIndex + 1 < state.connectionCandidates.length
}

/**
 * 判定一段 MCP 错误文本是否属于"认证/配额/积分不足"类。这类错误是确定性的
 * （该源的 token 无效或账号额度用尽），重试不会恢复，模型应当换源而不是反复重试。
 * 覆盖通用 HTTP 鉴权码、北大法宝特有的 90001 / remaining points / 积分 等。
 */
function isMcpAuthQuotaErrorText(text: string): boolean {
  // 只匹配明确指向"源级认证/配额"的错误，避免把工具正文里恰好出现"权限/余额/积分"
  // 等词的正常业务响应误判为鉴权失败（那会让模型放弃一个其实可用的源）。
  // 要求额度/余额/积分等词必须伴随"不足/耗尽/用尽"等否定语境；英文 quota/balance 同理。
  return (
    /\b(401|403|429)\b|unauthori[sz]ed|forbidden|invalid[^.\n]*(token|credential)/i.test(text) ||
    /\b90001\b|remaining\s+points/i.test(text) ||
    /(?:额度|余额|积分|points|credits)\s*(?:已\s*)?(?:不足|耗尽|用尽|用完)/i.test(text) ||
    /(?:不足|耗尽|用尽|用完)\s*(?:额度|余额|积分|points|credits)/i.test(text) ||
    /(?:quota|balance|credit|funds).{0,24}(?:exhausted|insufficient|depleted)/i.test(text) ||
    /(?:insufficient|exhausted|depleted).{0,24}(?:balance|quota|credit|funds)/i.test(text)
  )
}

function mcpResultRequiresCredentialFallback(result: unknown): boolean {
  if (!mcpResultIsError(result)) return false
  return isMcpAuthQuotaErrorText(stringifyForSecretScan(result))
}

function isFlintChartServer(serverId: string): boolean {
  return FLINT_CHART_SERVER_IDS.has(serverId.toLowerCase())
}

function isUnsupportedFlintMcpAppTool(
  serverId: string,
  descriptor: McpToolDescriptor
): boolean {
  return isFlintChartServer(serverId) && descriptor.name === 'create_chart_view'
}

function policyForMcpTool(
  serverId: string,
  descriptor: McpToolDescriptor
): LocalTool['policy'] {
  if (
    isFlintChartServer(serverId) &&
    descriptor.annotations?.destructiveHint !== true &&
    descriptor.annotations?.openWorldHint !== true
  ) {
    return 'auto'
  }
  return policyFromAnnotations(descriptor.annotations)
}

type HostedMcpResult = {
  result: unknown
  artifacts: string[]
}

/**
 * 最大单条 MCP 文本输出长度（字符）。超过则保留头部 + 尾部、中间省略，
 * 防止 officecli `view html` 之类返回完整文档（几十 KB HTML）作为
 * tool_result 全量进 history——那会让后续每次请求都重发大段内容，既费
 * token 又拖慢。模型需要细节时可改用更精确的命令（如 get /body/p[N]）。
 */
const MCP_TEXT_RESULT_MAX_CHARS = 8_000
const MCP_TEXT_RESULT_TAIL_CHARS = 1_500

/**
 * 无损精简 MCP 工具结果：
 * - 保留 `content` 文本（核心内容，法条/案例正文，一字不损）
 * - 删除 `structuredContent` 冗余副本（text 里已含完整 JSON，两份重复纯费 token）
 * - 仅对超大文本（> 9500 字符，如整篇法规/完整 HTML）做 head+tail 有损截断，
 *   单条法条远低于该阈值，永不触发，知识获取完全无损
 */
/** 仅对 text 即完整数据源的 server（元典/北大法宝）做 structuredContent 去冗余。 */
export function shouldDropMcpStructuredContent(serverId: string): boolean {
  return /^(?:pkulaw|yuandian)/i.test(serverId)
}

export function truncateMcpTextOutput(
  result: unknown,
  opts?: { dropStructuredContent?: boolean }
): unknown {
  if (!result || typeof result !== 'object') return result
  const record = result as { content?: unknown; structuredContent?: unknown }
  const hasTextContent = Array.isArray(record.content) && record.content.some(
    (item) => item && typeof item === 'object' && (item as { type?: unknown; text?: unknown }).type === 'text' && typeof (item as { text?: unknown }).text === 'string'
  )
  const slim: Record<string, unknown> = { ...record }
  // 只有调用方确认该 server 的 text 已含完整数据（元典/北大法宝，见
  // shouldDropMcpStructuredContent）时才删除 structuredContent 冗余副本；
  // 其它 server 的 structuredContent 可能是权威结构（表格/ID/数值字段），
  // 无条件删除会静默丢数据。
  if (hasTextContent && opts?.dropStructuredContent === true) delete slim.structuredContent

  if (!Array.isArray(slim.content)) return slim
  const truncated = slim.content.map((item) => {
    if (!item || typeof item !== 'object') return item
    const entry = item as { type?: unknown; text?: unknown }
    if (entry.type !== 'text' || typeof entry.text !== 'string') return item
    const text = entry.text
    // Only truncate when the output would actually shrink: head(MAX) + tail(TAIL)
    // must be smaller than the input, otherwise the "truncated" result would be
    // larger than the original and report a negative omitted count.
    if (text.length <= MCP_TEXT_RESULT_MAX_CHARS + MCP_TEXT_RESULT_TAIL_CHARS) return item
    return { ...entry, text: pruneMcpTextStructurally(text) }
  })
  return { ...slim, content: truncated }
}

/**
 * 结构安全地截断 MCP 大文本：优先按 JSON 数组元素边界（整篇法规/多案列表通常
 * 是 JSON 数组），否则按行边界，避免把法条/案例从中间硬切产出非法 JSON。
 */
function pruneMcpTextStructurally(text: string): string {
  const trimmed = text.trimStart()
  if (trimmed.startsWith('[')) {
    const pruned = pruneJsonArrayText(text)
    if (pruned !== null) return pruned
  }
  return pruneLinesText(text)
}

/** 解析 JSON 数组并按字符预算丢中间元素；marker 用 JSON 字符串，结果保持可解析。 */
function pruneJsonArrayText(text: string): string | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return null
  }
  if (!Array.isArray(parsed) || parsed.length <= 8) return null
  const budget = MCP_TEXT_RESULT_MAX_CHARS + MCP_TEXT_RESULT_TAIL_CHARS
  const tailCount = 3
  // 从 head=3 起逐档增加，取第一个不超预算的档位（元素大时自动收窄 head）
  for (let keepHead = 3; keepHead <= 8; keepHead++) {
    const omitted = parsed.length - keepHead - tailCount
    if (omitted <= 0) break
    const marker = JSON.stringify(`… 输出已截断，省略 ${omitted} 个元素；如需更多内容请用更精确的检索 …`)
    const headStr = JSON.stringify(parsed.slice(0, keepHead))
    const tailStr = JSON.stringify(parsed.slice(-tailCount))
    const candidate = `${headStr.slice(0, -1)},\n  ${marker},\n${tailStr.slice(1)}`
    if (candidate.length <= budget || keepHead === 8) {
      return candidate
    }
  }
  return null
}

/** 行边界截断：超长行做字符级 head+tail，避免整行内容被整体丢弃。 */
function pruneLinesText(text: string): string {
  const lines = text.split('\n')
  // 单行超长（无换行大文本）：直接字符级 head+tail
  if (lines.length === 1 && lines[0].length > MCP_TEXT_RESULT_MAX_CHARS) {
    return charsHeadTail(lines[0])
  }
  const head: string[] = []
  let headChars = 0
  for (const line of lines) {
    if (line.length > MCP_TEXT_RESULT_MAX_CHARS) {
      // 非首行超长行也不能整体丢弃：字符级 head+tail 保留其头部与尾部内容
      head.push(charsHeadTail(line))
      break
    }
    if (headChars + line.length + 1 > MCP_TEXT_RESULT_MAX_CHARS) break
    head.push(line)
    headChars += line.length + 1
  }
  const tail: string[] = []
  let tailChars = 0
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].length > MCP_TEXT_RESULT_TAIL_CHARS) {
      tail.unshift(charsHeadTail(lines[i]))
      break
    }
    if (tailChars + lines[i].length + 1 > MCP_TEXT_RESULT_TAIL_CHARS) break
    tail.unshift(lines[i])
    tailChars += lines[i].length + 1
  }
  const omitted = lines.length - head.length - tail.length
  if (omitted <= 0) return text
  return `${head.join('\n')}\n\n… [输出已截断，省略 ${omitted} 行；如需更多内容请用更精确的命令] …\n\n${tail.join('\n')}`
}

/** 超长单行的字符级 head+tail。 */
function charsHeadTail(line: string): string {
  const omitted = Math.max(0, line.length - MCP_TEXT_RESULT_MAX_CHARS - MCP_TEXT_RESULT_TAIL_CHARS)
  return `${line.slice(0, MCP_TEXT_RESULT_MAX_CHARS)}\n\n… [输出已截断，省略约 ${omitted} 字符；如需更多内容请用更精确的命令] …\n\n${line.slice(-MCP_TEXT_RESULT_TAIL_CHARS)}`
}

async function normalizeMcpResultForHost(
  serverId: string,
  toolName: string,
  result: unknown,
  workspace: string
): Promise<HostedMcpResult> {
  if (!isFlintChartServer(serverId) || toolName !== 'render_chart') {
    // 通用大输出防护：所有 MCP 工具的文本结果都截断，避免大 tool_result 进 history。
    // structuredContent 去冗余仅对确认 text 即完整数据源的 server（元典/北大法宝）开启。
    return { result: truncateMcpTextOutput(result, { dropStructuredContent: shouldDropMcpStructuredContent(serverId) }), artifacts: [] }
  }
  if (
    !result ||
    typeof result !== 'object' ||
    !Array.isArray((result as { content?: unknown }).content)
  ) {
    return { result, artifacts: [] }
  }

  const outputDir = workspace.trim()
    ? join(workspace, '.legalwork', 'flint-charts')
    : ''
  const content = (result as { content: unknown[] }).content
  const artifacts: string[] = []
  const normalizedContent: unknown[] = []

  for (const item of content) {
    const record = item && typeof item === 'object' && !Array.isArray(item)
      ? item as Record<string, unknown>
      : null
    const imageData = record?.type === 'image' && typeof record.data === 'string'
      ? record.data
      : null
    const mimeType = typeof record?.mimeType === 'string' ? record.mimeType : 'image/png'
    const svgText = record?.type === 'text' &&
      typeof record.text === 'string' &&
      record.text.trimStart().startsWith('<svg')
      ? record.text
      : null

    if (!imageData && !svgText) {
      normalizedContent.push(item)
      continue
    }
    if (!outputDir) {
      normalizedContent.push({
        type: 'text',
        text: 'Chart rendered, but no workspace was available to save the artifact.'
      })
      continue
    }

    try {
      await mkdir(outputDir, { recursive: true })
      const extension = svgText
        ? 'svg'
        : mimeType === 'image/jpeg'
          ? 'jpg'
          : mimeType === 'image/webp'
            ? 'webp'
            : 'png'
      const artifactPath = join(outputDir, `flint-chart-${randomUUID()}.${extension}`)
      if (svgText) {
        await writeFile(artifactPath, svgText, 'utf8')
      } else {
        await writeFile(artifactPath, Buffer.from(imageData ?? '', 'base64'))
      }
      artifacts.push(artifactPath)
      normalizedContent.push({
        type: 'text',
        text: `Chart artifact saved to ${artifactPath}`
      })
    } catch (error) {
      normalizedContent.push({
        type: 'text',
        text: `Chart rendered, but the artifact could not be saved: ${errorMessage(error)}`
      })
    }
  }

  return {
    result: {
      ...(result as Record<string, unknown>),
      content: normalizedContent
    },
    artifacts
  }
}

function shouldUseMcpSearch(config: NonNullable<McpCapabilityConfig['search']>, toolCount: number): boolean {
  if (!config.enabled) return false
  if (config.mode === 'direct') return false
  if (config.mode === 'search') return true
  return toolCount >= config.autoThresholdToolCount
}

function policyFromAnnotations(annotation: McpToolDescriptor['annotations']): LocalTool['policy'] {
  if (annotation?.readOnlyHint && !annotation.openWorldHint && !annotation.destructiveHint) return 'auto'
  if (annotation?.destructiveHint) return 'on-request'
  if (annotation?.openWorldHint) return 'untrusted'
  return 'on-request'
}

function serverDiagnostic(
  state: { serverId: string; server: McpServerConfig; catalogFingerprint?: string; catalogDrift?: boolean; lastConnectedAt?: string },
  status: McpServerDiagnostic['status'],
  toolCount: number,
  lastError?: string
): McpServerDiagnostic {
  return {
    id: state.serverId,
    enabled: state.server.enabled,
    transport: state.server.transport,
    trustScope: state.server.trustScope,
    available: status === 'connected',
    status,
    toolCount,
    ...(state.catalogFingerprint ? { catalogFingerprint: state.catalogFingerprint } : {}),
    ...(state.catalogDrift !== undefined ? { catalogDrift: state.catalogDrift } : {}),
    ...(state.lastConnectedAt ? { lastConnectedAt: state.lastConnectedAt } : {}),
    ...(lastError ? { lastError: redactSecretText(lastError) } : {})
  }
}

function catalogFingerprint(values: readonly string[]): string {
  return createHash('sha256')
    .update(JSON.stringify([...values].sort()))
    .digest('hex')
    .slice(0, 16)
}

function slug(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || 'tool'
}

function normalizePathForTrust(value: string): string {
  return value.replace(/\\/g, '/').replace(/\/+$/g, '')
}

function redactMcpPayload<T>(value: T, servers: McpServerConfig[]): T {
  const secrets = mcpServerSecretValues(servers)
  const visit = (input: unknown): unknown => {
    if (typeof input === 'string') return redactKnownSecretText(input, secrets)
    if (Array.isArray(input)) return input.map(visit)
    if (!input || typeof input !== 'object') return input
    return Object.fromEntries(
      Object.entries(input).map(([key, child]) => [
        key,
        /authorization|token|secret|password|api[-_]?key/i.test(key)
          ? REDACTED_SECRET
          : visit(child)
      ])
    )
  }
  return visit(value) as T
}

function redactMcpErrorMessage(error: unknown, servers: McpServerConfig[]): string {
  return redactKnownSecretText(errorMessage(error), mcpServerSecretValues(servers))
}

function redactedMcpError(error: unknown, servers: McpServerConfig[]): Error {
  const safe = new Error(redactMcpErrorMessage(error, servers))
  safe.name = error instanceof Error ? error.name : 'Error'
  return safe
}

function redactKnownSecretText(value: string, secrets: string[]): string {
  let redacted = value
  for (const secret of secrets) {
    if (secret.length >= 8) redacted = redacted.split(secret).join(REDACTED_SECRET)
  }
  return redactSecretText(redacted)
}

function mcpServerSecretValues(servers: McpServerConfig[]): string[] {
  const values = new Set<string>()
  for (const server of servers) {
    // Extract from Authorization and other secret headers
    for (const [key, value] of Object.entries(server.headers)) {
      if (!/authorization|token|secret|password|api[-_]?key/i.test(key)) continue
      const trimmed = value.trim()
      if (!trimmed) continue
      values.add(trimmed)
      const bearer = trimmed.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()
      if (bearer) values.add(bearer)
    }
    // Extract embedded credentials from URL (user:password@host)
    if (server.url) {
      try {
        const parsed = new URL(server.url)
        if (parsed.password) values.add(parsed.password)
        if (parsed.username) values.add(parsed.username)
      } catch { /* ignore invalid URLs */ }
    }
    // Extract token-like values from env (secret-looking env values)
    for (const [, value] of Object.entries(server.env)) {
      const trimmed = value.trim()
      if (!trimmed || trimmed.length < 16) continue
      if (/^(?:sk-|pk-|Bearer\s+|eyJ)/i.test(trimmed)) values.add(trimmed)
    }
    // Extract token-like values from command args
    for (const arg of server.args) {
      const trimmed = arg.trim()
      if (!trimmed || trimmed.length < 16) continue
      if (/^(?:sk-|pk-|eyJ|[A-Za-z0-9_-]{20,})/.test(trimmed)) values.add(trimmed)
    }
  }
  return [...values].sort((left, right) => right.length - left.length)
}

function stringifyForSecretScan(value: unknown): string {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
