import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { buildRouter } from './routes/index.js'
import {
  ensureDataComplianceTaskService
} from './routes/data-compliance.js'
import type { ServerRuntime } from './routes/server-runtime.js'
import { startNodeHttpServer, type NodeHttpServerHandle } from './node-http-server.js'
import { FileAttachmentStore } from '../attachments/attachment-store.js'
import { InMemoryApprovalGate } from '../adapters/in-memory-approval-gate.js'
import { InMemoryUserInputGate } from '../adapters/in-memory-user-input-gate.js'
import { InMemoryEventBus } from '../adapters/in-memory-event-bus.js'
import { FileSessionStore, FileThreadStore } from '../adapters/file/index.js'
import { HybridSessionStore, HybridThreadStore } from '../adapters/hybrid/index.js'
import { DeepseekCompatModelClient } from '../adapters/model/deepseek-compat-model-client.js'
import { AnthropicCompatModelClient } from '../adapters/model/anthropic-compat-model-client.js'
import { CodexAccountModelClient } from '../adapters/model/codex-account-model-client.js'
import { CapabilityRegistry } from '../adapters/tool/capability-registry.js'
import { buildGoalLocalTools } from '../adapters/tool/goal-tools.js'
import { buildTodoLocalTools } from '../adapters/tool/todo-tools.js'
import { LocalToolHost, buildDefaultLocalTools } from '../adapters/tool/local-tool-host.js'
import {
  buildMcpToolProviders,
  pendingMcpToolProviders
} from '../adapters/tool/mcp-tool-provider.js'
import { resolveBundledPkulawToken } from '../adapters/tool/pkulaw-fallback-auth.js'
import { buildMemoryToolProviders } from '../adapters/tool/memory-tool-provider.js'
import { buildKnowledgeToolProviders } from '../adapters/tool/knowledge-tool-provider.js'
import { buildDelegationToolProviders } from '../adapters/tool/delegation-tool-provider.js'
import { buildWebToolProviders } from '../adapters/tool/web-tool-provider.js'
import { LocalWorkspaceInspector } from '../adapters/workspace/local-workspace-inspector.js'
import { createImmutablePrefix } from '../cache/immutable-prefix.js'
import {
  buildRuntimeCapabilityManifest,
  type LegalworkCapabilitiesConfig
} from '../contracts/capabilities.js'
import type { ApprovalPolicy, SandboxMode } from '../contracts/policy.js'
import {
  DEFAULT_MODEL_ENDPOINT_FORMAT,
  normalizeModelEndpointFormat,
  type ModelEndpointFormat
} from '../contracts/model-endpoint-format.js'
import { AgentLoop } from '../loop/agent-loop.js'
import { ContextCompactor } from '../loop/context-compactor.js'
import type { TokenEconomyConfig } from '../loop/token-economy.js'
import {
  modelCapabilitiesForModel,
  modelContextProfilesFromConfig,
  type ContextCompactionConfig,
  type ModelConfig
} from '../loop/model-context-profile.js'
import {
  DEFAULT_STORAGE_CONFIG,
  expandHomePath,
  readOptionalLegalworkConfigFile,
  writeLegalworkConfigFile,
  type LegalworkConfig,
  type RuntimeTuningConfig,
  type StorageConfig
} from '../config/legalwork-config.js'
import { InflightTracker } from '../loop/inflight-tracker.js'
import { SteeringQueue } from '../loop/steering-queue.js'
import { RandomIdGenerator } from '../ports/id-generator.js'
import type { SessionStore } from '../ports/session-store.js'
import type { ThreadStore } from '../ports/thread-store.js'
import type { ModelClient } from '../ports/model-client.js'
import type { ToolHost } from '../ports/tool-host.js'
import { LEGALWORK_SYSTEM_PROMPT } from '../prompt/legalwork-system-prompt.js'
import { RuntimeEventRecorder } from '../services/runtime-event-recorder.js'
import { ThreadService } from '../services/thread-service.js'
import { TurnService } from '../services/turn-service.js'
import { ReviewService } from '../services/review-service.js'
import { UsageService } from '../services/usage-service.js'
import { recoverInterruptedTurns } from '../services/interrupted-turn-recovery.js'
import type { UsageEvent } from '../contracts/events.js'
import { SkillRuntime } from '../skills/skill-runtime.js'
import { FileMemoryStore } from '../memory/memory-store.js'
import { defaultKnowledgeSourceRoots, FileKnowledgeStore } from '../knowledge/knowledge-store.js'
import { DelegationRuntime, FileDelegationStore } from '../delegation/delegation-runtime.js'
import { createChildAgentExecutor } from '../delegation/child-agent-executor.js'
import { reportToolErrorNow, reportInefficientTurnNow } from '../cli/tool-error-reporter.js'

export type LegalworkServeRuntimeOptions = {
  host: string
  port: number
  configPath?: string
  dataDir: string
  runtimeToken: string
  authMode?: 'api_key' | 'chatgpt'
  codexBinaryPath?: string
  codexHome?: string
  apiKey: string
  baseUrl: string
  endpointFormat?: string
  model: string
  approvalPolicy: ApprovalPolicy
  sandboxMode: SandboxMode
  tokenEconomyMode: boolean
  tokenEconomy?: TokenEconomyConfig
  insecure: boolean
  models?: ModelConfig
  contextCompaction?: ContextCompactionConfig
  runtime?: RuntimeTuningConfig
  storage?: StorageConfig
  capabilities?: LegalworkCapabilitiesConfig
  startedAt?: string
}

export type LegalworkServeHandle = NodeHttpServerHandle & {
  runtime: ServerRuntime
}

/**
 * Composition root for serve mode. This is intentionally the only
 * place that wires concrete adapters to ports; domain, services, loop,
 * and HTTP handlers stay constructor-injected and testable.
 */
export async function createLegalworkServeRuntime(
  options: LegalworkServeRuntimeOptions
): Promise<ServerRuntime> {
  await mkdir(options.dataDir, { recursive: true })
  const eventBus = new InMemoryEventBus()
  const stores = await createPersistentStores({
    dataDir: options.dataDir,
    storage: options.storage,
    nowIso: () => new Date().toISOString()
  })
  const sessionStore = stores.sessionStore
  const threadStore = stores.threadStore
  const approvalGate = new InMemoryApprovalGate()
  const userInputGate = new InMemoryUserInputGate()
  const workspaceInspector = new LocalWorkspaceInspector()
  const usageService = new UsageService()
  const inflight = new InflightTracker()
  const steering = new SteeringQueue()
  const compactor = new ContextCompactor({
    contextCompaction: options.contextCompaction,
    models: options.models
  })
  const tokenEconomy = tokenEconomyConfigForOptions(options)
  const ids = new RandomIdGenerator()
  const nowIso = () => new Date().toISOString()
  const allocateSeq = (threadId: string) => eventBus.allocateSeq(threadId)
  const events = new RuntimeEventRecorder({ eventBus, sessionStore, allocateSeq, nowIso })
  await recoverInterruptedTurns({ threadStore, sessionStore, events, nowIso })
  const prefix = createImmutablePrefix({
    systemPrompt: LEGALWORK_SYSTEM_PROMPT,
    pinnedConstraints: [
      'system: preserve user intent across compaction',
      'system: keep the HTTP/SSE contract stable for the GUI',
      'system: keep the stable Legalwork prefix byte-stable for prompt-cache reuse'
    ]
  })
  const turnService = new TurnService({
    threadStore,
    sessionStore,
    events,
    inflight,
    steering,
    compactor,
    ids,
    nowIso
  })
  const threadService = new ThreadService({ threadStore, sessionStore, events, ids, nowIso })
  void seedUsageCarryover({ threadStore, sessionStore, usageService }).catch(() => undefined)
  const modelProfiles = modelContextProfilesFromConfig({
    contextCompaction: options.contextCompaction,
    models: options.models
  })
  const modelClient = createModelClient({
    authMode: options.authMode,
    codexBinaryPath: options.codexBinaryPath,
    codexHome: options.codexHome,
    baseUrl: options.baseUrl,
    apiKey: options.apiKey,
    model: options.model,
    endpointFormat: options.endpointFormat,
    modelCapabilities: (model) => modelCapabilitiesForModel(model, modelProfiles)
  })
  const reviewService = new ReviewService({
    threadStore,
    turns: turnService,
    model: modelClient,
    defaultModel: options.model,
    nowIso,
    modelCapabilities: (model) => modelCapabilitiesForModel(model, modelProfiles),
    ...(options.models ? { models: options.models } : {}),
    ...(options.contextCompaction ? { contextCompaction: options.contextCompaction } : {}),
    ...(tokenEconomy ? { tokenEconomy } : {}),
    ...(options.runtime ? { runtime: options.runtime } : {})
  })
  let mcpProviders = pendingMcpToolProviders(options.capabilities?.mcp)
  const anysearchApiKey = process.env.ANYSEARCH_API_KEY?.trim() || options.capabilities?.web?.anysearchApiKey
  const useDeepseekServerSearch = shouldUseDeepseekServerSearch({
    apiKey: options.apiKey,
    baseUrl: options.baseUrl,
    model: options.model,
    provider: options.capabilities?.web?.provider
  })
  const webProviders = buildWebToolProviders(options.capabilities?.web, {
    anysearchApiKey,
    ...(useDeepseekServerSearch
      ? {
          deepseekApiKey: options.apiKey,
          deepseekBaseUrl: options.baseUrl,
          deepseekModel: options.model
        }
      : {})
  })
  const skillRuntime = await SkillRuntime.create(options.capabilities?.skills, {
    deferDiscovery: true,
    onRootsChanged: async (roots) => {
      if (!options.configPath) return
      const existing = readOptionalLegalworkConfigFile(options.configPath)
      if (existing) {
        const next: LegalworkConfig = {
          ...existing.config,
          capabilities: {
            ...existing.config.capabilities,
            skills: {
              ...existing.config.capabilities.skills,
              enabled: true,
              roots
            }
          }
        }
        writeLegalworkConfigFile(options.configPath, next)
      } else if (options.capabilities) {
        const next: LegalworkConfig = {
          capabilities: {
            ...options.capabilities,
            skills: {
              ...options.capabilities.skills,
              enabled: true,
              roots
            }
          }
        }
        writeLegalworkConfigFile(options.configPath, next)
      }
    }
  })
  const attachmentStore = options.capabilities?.attachments.enabled
    ? new FileAttachmentStore({
        rootDir: join(options.dataDir, 'attachments'),
        config: options.capabilities.attachments,
        nowIso
      })
    : undefined
  const memoryStore = options.capabilities?.memory.enabled
    ? new FileMemoryStore({
        rootDir: join(options.dataDir, 'memory'),
        config: options.capabilities.memory,
        nowIso
      })
    : undefined
  const knowledgeStore = new FileKnowledgeStore({
    rootDir: join(options.dataDir, 'knowledge'),
    sourceRoots: defaultKnowledgeSourceRoots(options.dataDir),
    nowIso,
    model: modelClient,
    ...(process.env.LEGALWORK_KNOWLEDGE_SQLITE === '1'
      ? { sqliteIndex: { enabled: true } }
      : {})
  })
  const explicitWebRoot = process.env.LEGALWORK_COMPLIANCE_WEB_ROOT
  const webRootOverride =
    explicitWebRoot && existsSync(join(explicitWebRoot, 'compliance_worker.py'))
      ? explicitWebRoot
      : undefined
  const dataComplianceTaskService = await ensureDataComplianceTaskService({
    dataDir: options.dataDir,
    appRoot: options.dataDir,
    isPackaged: false,
    logDir: join(options.dataDir, 'logs'),
    webRoot: webRootOverride
  })
  const baseToolProviders = [
    {
      id: 'builtin',
      kind: 'built-in' as const,
      enabled: true,
      available: true,
      tools: buildDefaultLocalTools({}, {
        dataCompliance: { service: dataComplianceTaskService },
        skillTools: { skillRuntime },
        compressContext: {
          compactor,
          prefix,
          sessionStore,
          events,
          usage: usageService
        }
      })
    },
    ...webProviders.providers,
    ...buildMemoryToolProviders(memoryStore, threadStore),
    ...buildKnowledgeToolProviders(knowledgeStore)
  ]
  const childRegistry = new CapabilityRegistry(baseToolProviders)
  const childToolHost = new LocalToolHost({ registry: childRegistry, readTracker: true })
  const delegationRuntime = options.capabilities?.subagents.enabled
    ? new DelegationRuntime({
        config: options.capabilities.subagents,
        store: new FileDelegationStore(join(options.dataDir, 'child-runs')),
        events,
        nowIso,
        executor: createChildAgentExecutor({
          model: modelClient,
          toolHost: childToolHost,
          prefix,
          defaultModel: options.model,
          models: options.models,
          contextCompaction: options.contextCompaction,
          approvalPolicy: options.approvalPolicy,
          sandboxMode: options.sandboxMode,
          modelCapabilities: (model) => modelCapabilitiesForModel(model, modelProfiles),
          skillRuntime,
          tokenEconomy,
          ...(options.runtime ? { runtime: options.runtime } : {}),
          ...(memoryStore ? { memoryStore } : {}),
          ...(options.capabilities?.mcp.primaryLegalSource
            ? { primaryLegalSource: options.capabilities.mcp.primaryLegalSource }
            : {}),
          nowIso
        }),
        recordExternalUsage: (threadId, usage) => {
          usageService.record(threadId, usage)
        }
      })
    : undefined
  const runtimeCapabilities = () => buildRuntimeCapabilityManifest({
    config: options.capabilities,
    model: modelCapabilitiesForModel(options.model, modelProfiles),
    mcp: {
      configuredServers: Object.keys(options.capabilities?.mcp.servers ?? {}).length,
      connectedServers: mcpProviders.connectedServers,
      toolCount: mcpProviders.toolCount,
      lastError: mcpProviders.diagnostics.find((diagnostic) => diagnostic.lastError)?.lastError,
      search: {
        active: mcpProviders.search.active,
        indexedToolCount: mcpProviders.search.indexedToolCount,
        advertisedToolCount: mcpProviders.search.advertisedToolCount
      }
    },
    web: {
      fetchAvailable: webProviders.fetchAvailable,
      searchAvailable: webProviders.searchAvailable,
      provider: webProviders.provider,
      reason: webProviders.diagnostics.find((diagnostic) => diagnostic.reason)?.reason
    },
    skills: {
      configuredRoots: options.capabilities?.skills.roots.length,
      discoveredSkills: skillRuntime.count(),
      reason: skillRuntime.diagnostics().validationErrors[0]?.message
    },
    attachments: {
      available: Boolean(attachmentStore)
    },
    memory: {
      available: Boolean(memoryStore)
    },
    subagents: {
      available: Boolean(delegationRuntime)
    }
  })
  const registry = new CapabilityRegistry([
    ...baseToolProviders,
    {
      id: 'goal',
      kind: 'gui' as const,
      enabled: true,
      available: true,
      tools: buildGoalLocalTools(threadService)
    },
    {
      id: 'todo',
      kind: 'gui' as const,
      enabled: true,
      available: true,
      tools: buildTodoLocalTools(threadService)
    },
    ...buildDelegationToolProviders(delegationRuntime)
  ])
  let shuttingDown = false
  const incrementalMcpRegistration = options.capabilities?.mcp.enabled === true
    && options.capabilities.mcp.search.enabled === false
  const pendingPkulawServerIds = new Set(
    Object.entries(options.capabilities?.mcp.servers ?? {})
      .filter(([serverId, server]) => server.enabled && /^pkulaw(?:-|_)/i.test(serverId))
      .map(([serverId]) => serverId)
  )
  let resolvePkulawInitialization!: () => void
  const pkulawInitializationPromise = new Promise<void>((resolve) => {
    resolvePkulawInitialization = resolve
  })
  if (pendingPkulawServerIds.size === 0) resolvePkulawInitialization()
  let mcpInitializationPromise: Promise<void> | undefined
  const startMcpInitialization = (): Promise<void> => {
    if (mcpInitializationPromise) return mcpInitializationPromise
    mcpInitializationPromise = buildMcpToolProviders(options.capabilities?.mcp, {
      resolvePkulawFallbackToken: resolveBundledPkulawToken,
      // Keep the provider's 30-second startup budget. LegalWork initializes
      // nine PKULaw HTTP endpoints alongside stdio MCPs; constraining every
      // HTTP handshake to five seconds makes otherwise healthy endpoints fail
      // together during a cold start under CPU/network contention.
      ...(incrementalMcpRegistration ? {
        onServerSettled: ({ serverId, provider }) => {
          if (provider && !shuttingDown) {
            childRegistry.registerProvider(provider)
            registry.registerProvider(provider)
          }
          pendingPkulawServerIds.delete(serverId)
          if (pendingPkulawServerIds.size === 0) resolvePkulawInitialization()
        }
      } : {})
    })
      .then(async (initialized) => {
        if (shuttingDown) {
          await initialized.close()
          return
        }
        mcpProviders = initialized
        if (!incrementalMcpRegistration) {
          for (const provider of initialized.providers) {
            childRegistry.registerProvider(provider)
            registry.registerProvider(provider)
          }
        }
      })
      .catch(() => undefined)
    return mcpInitializationPromise
  }
  const mcpInitializationTimer = setTimeout(() => {
    void startMcpInitialization()
  }, 250)
  mcpInitializationTimer.unref?.()
  const localToolHost = new LocalToolHost({ registry, readTracker: true })
  const toolHost: ToolHost = {
    id: localToolHost.id,
    async listTools(context) {
      if (context) {
        const turn = await turnService.getTurn(context.threadId, context.turnId)
        if (shouldAwaitPkulawMcpInitialization(
          turn?.prompt ?? '',
          options.capabilities?.mcp
        )) {
          void startMcpInitialization()
          await waitForAtMost(
            incrementalMcpRegistration
              ? pkulawInitializationPromise
              : mcpInitializationPromise,
            30_000
          )
        }
      }
      return localToolHost.listTools(context)
    },
    execute(call, context, onUpdate) {
      return localToolHost.execute(call, context, onUpdate)
    },
    clearReadTracker(threadId) {
      localToolHost.clearReadTracker(threadId)
    }
  }
  const loop = new AgentLoop({
    threadStore,
    sessionStore,
    approvalGate,
    userInputGate,
    model: modelClient,
    toolHost,
    usage: usageService,
    events,
    turns: turnService,
    inflight,
    steering,
    compactor,
    prefix,
    ids,
    nowIso,
    modelCapabilities: (model) => modelCapabilitiesForModel(model, modelProfiles),
    skillRuntime,
    tokenEconomy,
    contextCompaction: options.contextCompaction,
    ...(options.runtime?.toolStorm ? { toolStorm: options.runtime.toolStorm } : {}),
    ...(options.runtime?.toolArgumentRepair ? { toolArgumentRepair: options.runtime.toolArgumentRepair } : {}),
    ...(options.capabilities?.mcp.primaryLegalSource
      ? { primaryLegalSource: options.capabilities.mcp.primaryLegalSource }
      : {}),
    ...(attachmentStore ? { attachmentStore } : {}),
    ...(memoryStore ? { memoryStore } : {}),
    onPlanWritten: async ({ threadId, planId, relativePath, markdown }) => {
      await threadService.syncTodosFromPlan(threadId, {
        planId,
        relativePath,
        markdown,
        preserveCompleted: true
      })
    },
    onToolError: (info) => reportToolErrorNow(info),
    onInefficientTurn: (info) => reportInefficientTurnNow(info)
  })
  const startedAt = options.startedAt ?? nowIso()
  return {
    threadService,
    turnService,
    reviewService,
    usageService,
    eventBus,
    sessionStore,
    events,
    approvalGate,
    userInputGate,
    workspaceInspector,
    toolHost,
    ...(attachmentStore ? { attachmentStore } : {}),
    ...(memoryStore ? { memoryStore } : {}),
    knowledgeStore,
    runTurn(threadId, turnId) {
      return loop.runTurn(threadId, turnId)
    },
    runReview(input) {
      return reviewService.runReview(input)
    },
    runtimeToken: options.runtimeToken,
    insecure: options.insecure,
    allocateSeq,
    nowIso,
    info: () => ({
      host: options.host,
      port: options.port,
      configPath: options.configPath,
      dataDir: options.dataDir,
      model: options.model,
      approvalPolicy: options.approvalPolicy,
      sandboxMode: options.sandboxMode,
      tokenEconomyMode: options.tokenEconomyMode,
      insecure: options.insecure,
      startedAt,
      pid: process.pid,
      capabilities: runtimeCapabilities()
    }),
    toolDiagnostics: async () => ({
      providers: registry.diagnostics(),
      mcpServers: mcpProviders.diagnostics,
      mcpSearch: mcpProviders.search,
      webProviders: webProviders.diagnostics,
      skills: skillRuntime.diagnostics(),
      attachments: attachmentStore
        ? await attachmentStore.diagnostics()
        : { enabled: false, rootDir: '', count: 0, totalBytes: 0 },
      memory: memoryStore
        ? await memoryStore.diagnostics()
        : { enabled: false, rootDir: '', activeCount: 0, tombstoneCount: 0, lastInjectedIds: [] }
    }),
    skills: () => skillRuntime.diagnostics(),
    refreshSkills: async () => {
      await skillRuntime.refresh()
    },
    installSkillRoot: async (path: string, overwrite?: boolean) => {
      await skillRuntime.installFromPath(path, overwrite)
    },
    dataComplianceTaskService,
    shutdown: async () => {
      shuttingDown = true
      clearTimeout(mcpInitializationTimer)
      try {
        await mcpInitializationPromise?.catch(() => undefined)
        await mcpProviders.close()
      } finally {
        try {
          await modelClient.close?.()
        } finally {
          try {
            knowledgeStore.close()
          } finally {
            await stores.shutdown?.()
          }
        }
      }
    }
  }
}

export function shouldAwaitPkulawMcpInitialization(
  prompt: string,
  mcp: LegalworkCapabilitiesConfig['mcp'] | undefined
): boolean {
  if (!mcp?.enabled) return false
  const hasEnabledPkulawServer = Object.entries(mcp.servers).some(
    ([serverId, server]) => server.enabled && /^pkulaw(?:-|_)/i.test(serverId)
  )
  if (!hasEnabledPkulawServer) return false
  return /北大法宝|PKULaw|法律调研|多源调研/i.test(prompt)
}

/**
 * DeepSeek's server-side web search uses a provider-specific Anthropic
 * compatibility route. Generic OpenAI/Anthropic-compatible credentials must
 * never be sent to that route merely because the runtime has an API key.
 *
 * Official DeepSeek configurations are detected conservatively. Private
 * DeepSeek-compatible gateways can opt in explicitly through web.provider.
 */
export function shouldUseDeepseekServerSearch(input: {
  apiKey: string | undefined
  baseUrl: string | undefined
  model: string | undefined
  provider?: string
}): boolean {
  if (!input.apiKey?.trim()) return false

  const provider = input.provider?.trim().toLowerCase()
  if (provider) {
    return provider === 'deepseek' || provider === 'deepseek-server-search'
  }

  if (!input.model?.trim().toLowerCase().includes('deepseek')) return false

  try {
    return new URL(input.baseUrl?.trim() || '').hostname.toLowerCase() === 'api.deepseek.com'
  } catch {
    return false
  }
}

export async function waitForAtMost(
  promise: Promise<void> | undefined,
  timeoutMs: number
): Promise<'ready' | 'timeout'> {
  if (!promise) return 'ready'
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise.then(() => 'ready' as const),
      new Promise<'timeout'>((resolve) => {
        timer = setTimeout(() => resolve('timeout'), Math.max(0, timeoutMs))
      })
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

function createModelClient(input: {
  authMode?: 'api_key' | 'chatgpt'
  codexBinaryPath?: string
  codexHome?: string
  baseUrl: string
  apiKey: string
  model: string
  endpointFormat?: string
  modelCapabilities?: (model: string) => ReturnType<typeof modelCapabilitiesForModel>
}): ModelClient {
  if (input.authMode === 'chatgpt') {
    return new CodexAccountModelClient({
      binaryPath: input.codexBinaryPath?.trim() || 'codex',
      model: input.model,
      legalworkCodexHome: input.codexHome?.trim()
    })
  }
  const endpointFormat = normalizeModelEndpointFormat(input.endpointFormat ?? DEFAULT_MODEL_ENDPOINT_FORMAT)
  if (endpointFormat === 'messages') {
    return new AnthropicCompatModelClient(input)
  }
  return new DeepseekCompatModelClient({
    ...input,
    endpointFormat: endpointFormat as ModelEndpointFormat
  })
}

function tokenEconomyConfigForOptions(
  options: Pick<LegalworkServeRuntimeOptions, 'tokenEconomyMode' | 'tokenEconomy'>
): TokenEconomyConfig {
  return {
    ...(options.tokenEconomy ?? {}),
    enabled: options.tokenEconomy?.enabled ?? options.tokenEconomyMode
  }
}

async function createPersistentStores(input: {
  dataDir: string
  storage?: StorageConfig
  nowIso: () => string
}): Promise<{ threadStore: ThreadStore; sessionStore: SessionStore; shutdown?: () => Promise<void> }> {
  const storage = input.storage ?? DEFAULT_STORAGE_CONFIG
  if (storage.backend === 'file') {
    return {
      sessionStore: new FileSessionStore({ dataDir: input.dataDir }),
      threadStore: new FileThreadStore({ dataDir: input.dataDir })
    }
  }

  const threadStore = new HybridThreadStore({
    dataDir: input.dataDir,
    sqlitePath: storage.sqlitePath ? expandHomePath(storage.sqlitePath) : undefined,
    nowIso: input.nowIso
  })
  await threadStore.ready()
  return {
    threadStore,
    sessionStore: new HybridSessionStore({
      dataDir: input.dataDir,
      index: threadStore
    }),
    shutdown: async () => {
      threadStore.close()
    }
  }
}

export async function seedUsageCarryover(input: {
  threadStore: ThreadStore
  sessionStore: SessionStore
  usageService: UsageService
}): Promise<void> {
  const threadSummaries = await input.threadStore.list()
  await Promise.all(threadSummaries.map(async (thread) => {
    const events = await input.sessionStore.loadEventsSince(thread.id, 0)
    const latestUsage = events.reduce<UsageEvent | null>((latest, event) => {
      if (event.kind !== 'usage') return latest
      if (!latest || event.seq > latest.seq) return event
      return latest
    }, null)
    if (latestUsage) input.usageService.seedThread(thread.id, latestUsage.usage)
  }))
}

export async function startLegalworkServe(
  options: LegalworkServeRuntimeOptions
): Promise<LegalworkServeHandle> {
  const runtime = await createLegalworkServeRuntime(options)
  const router = buildRouter(runtime)
  const server = await startNodeHttpServer({
    router,
    host: options.host,
    port: options.port
  })
  return {
    ...server,
    runtime,
    close: async () => {
      try {
        await server.close()
      } finally {
        await runtime.shutdown?.()
      }
    }
  }
}
