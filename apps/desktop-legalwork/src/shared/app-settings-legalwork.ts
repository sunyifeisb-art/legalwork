import {
  DEFAULT_APPROVAL_POLICY,
  DEFAULT_DEEPSEEK_BASE_URL,
  DEFAULT_LEGALWORK_DATA_DIR,
  DEFAULT_LEGALWORK_MODEL,
  DEFAULT_LEGALWORK_PORT,
  DEFAULT_SANDBOX_MODE,
  type AppSettingsV1,
  type LegalworkContextCompactionSettingsV1,
  type LegalworkHistoryHygieneSettingsV1,
  type LegalworkMcpSearchSettingsV1,
  type LegalworkRuntimeTuningSettingsV1,
  type LegalworkRuntimeSettingsPatchV1,
  type LegalworkRuntimeSettingsV1,
  type LegalworkSettingsEnvelopePatchV1,
  type LegalworkSettingsEnvelopeV1,
  type LegalworkStorageSettingsV1,
  type LegalworkTokenEconomySettingsV1,
  type ModelProviderSettingsV1,
  type ApprovalPolicy,
  type SandboxMode
} from './app-settings-types'
import {
  normalizeModelProviderSettings,
  resolveLegalworkRuntimeSettings
} from './app-settings-provider'

const LEGACY_COREAGENT_DATA_DIR = '~/.deepseekgui/coreagent'
const LEGACY_LEGALWORK_DEFAULT_MODEL = 'deepseek-chat'
const LEGACY_LOCAL_HTTP_DEFAULT_PORT = 7878

type LegacyLocalHttpRuntimeSettingsV1 = {
  binaryPath: string
  port: number
  autoStart: boolean
  apiKey: string
  baseUrl: string
  runtimeToken: string
  extraCorsOrigins: string[]
  approvalPolicy: ApprovalPolicy
  sandboxMode: SandboxMode
}

type LegacyReasoningEffort = 'low' | 'medium' | 'high' | 'max'
type LegacyReasoningEditMode = 'review' | 'auto' | 'yolo' | 'plan'

type LegacyReasoningRuntimeSettingsV1 = {
  binaryPath: string
  autoStart: boolean
  apiKey: string
  baseUrl: string
  model: string
  reasoningEffort: LegacyReasoningEffort
  editMode: LegacyReasoningEditMode
}

/**
 * Legalwork runtime settings. Mirrors the `legalwork serve` CLI
 * options. It is the only active agent settings object the GUI
 * stores after legacy settings have been migrated.
 */
function legacyLocalHttpRuntimeDefaults(port = 7878): LegacyLocalHttpRuntimeSettingsV1 {
  return {
    binaryPath: '',
    port,
    autoStart: true,
    apiKey: '',
    baseUrl: DEFAULT_DEEPSEEK_BASE_URL,
    runtimeToken: '',
    extraCorsOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    approvalPolicy: DEFAULT_APPROVAL_POLICY,
    sandboxMode: DEFAULT_SANDBOX_MODE
  }
}

function legacyReasoningRuntimeDefaults(): LegacyReasoningRuntimeSettingsV1 {
  return {
    binaryPath: '',
    autoStart: true,
    apiKey: '',
    baseUrl: DEFAULT_DEEPSEEK_BASE_URL,
    model: LEGACY_LEGALWORK_DEFAULT_MODEL,
    reasoningEffort: 'medium',
    editMode: 'auto'
  }
}

export function defaultLegalworkRuntimeSettings(
  port = DEFAULT_LEGALWORK_PORT
): LegalworkRuntimeSettingsV1 {
  return {
    binaryPath: '',
    port,
    autoStart: true,
    apiKey: '',
    baseUrl: '',
    providerId: '',
    runtimeToken: '',
    dataDir: DEFAULT_LEGALWORK_DATA_DIR,
    model: DEFAULT_LEGALWORK_MODEL,
    approvalPolicy: DEFAULT_APPROVAL_POLICY,
    sandboxMode: DEFAULT_SANDBOX_MODE,
    tokenEconomyMode: false,
    tokenEconomy: defaultLegalworkTokenEconomySettings(),
    insecure: false,
    endpointFormat: '',
    mcpSearch: defaultLegalworkMcpSearchSettings(),
    storage: defaultLegalworkStorageSettings(),
    contextCompaction: defaultLegalworkContextCompactionSettings(),
    runtimeTuning: defaultLegalworkRuntimeTuningSettings()
  }
}

function normalizeLegalworkSandboxMode(value: SandboxMode | undefined): SandboxMode {
  return value === 'read-only' || value === 'workspace-write'
    ? DEFAULT_SANDBOX_MODE
    : value ?? DEFAULT_SANDBOX_MODE
}

export function defaultLegalworkMcpSearchSettings(): LegalworkMcpSearchSettingsV1 {
  return {
    enabled: false,
    mode: 'auto',
    autoThresholdToolCount: 24,
    topKDefault: 5,
    topKMax: 10,
    minScore: 0.15
  }
}

export function defaultLegalworkTokenEconomySettings(): LegalworkTokenEconomySettingsV1 {
  return {
    enabled: false,
    compressToolDescriptions: true,
    compressToolResults: true,
    conciseResponses: true,
    historyHygiene: defaultLegalworkHistoryHygieneSettings()
  }
}

export function defaultLegalworkHistoryHygieneSettings(): LegalworkHistoryHygieneSettingsV1 {
  return {
    maxToolResultLines: 320,
    maxToolResultBytes: 32 * 1024,
    maxToolResultTokens: 8_000,
    maxToolArgumentStringBytes: 8 * 1024,
    maxToolArgumentStringTokens: 2_000,
    maxArrayItems: 80
  }
}

export function defaultLegalworkStorageSettings(): LegalworkStorageSettingsV1 {
  return {
    backend: 'hybrid',
    sqlitePath: ''
  }
}

export function defaultLegalworkContextCompactionSettings(): LegalworkContextCompactionSettingsV1 {
  return {
    defaultSoftThreshold: 16_000,
    defaultHardThreshold: 24_000,
    summaryMode: 'heuristic',
    summaryTimeoutMs: 15_000,
    summaryMaxTokens: 1_200,
    summaryInputMaxBytes: 96 * 1024
  }
}

export function defaultLegalworkRuntimeTuningSettings(): LegalworkRuntimeTuningSettingsV1 {
  return {
    toolStorm: {
      enabled: true,
      windowSize: 8,
      threshold: 3
    },
    toolArgumentRepair: {
      maxStringBytes: 512 * 1024
    }
  }
}

export function getLegalworkRuntimeSettings(
  settings: AppSettingsV1
): LegalworkRuntimeSettingsV1 {
  const raw = (settings as { agents?: { legalwork?: Partial<LegalworkRuntimeSettingsV1> } }).agents?.legalwork
  return mergeLegalworkRuntimeSettings(defaultLegalworkRuntimeSettings(), raw)
}

export function legalworkSettingsEnvelope(
  legalwork: LegalworkRuntimeSettingsV1
): LegalworkSettingsEnvelopeV1 {
  return { legalwork }
}

export function legalworkSettingsPatch(
  legalwork: LegalworkRuntimeSettingsPatchV1 | undefined
): LegalworkSettingsEnvelopePatchV1 {
  return legalwork ? { legalwork } : {}
}

export function mergeLegalworkRuntimeSettings(
  current: LegalworkRuntimeSettingsV1,
  patch: LegalworkRuntimeSettingsPatchV1 | undefined
): LegalworkRuntimeSettingsV1 {
  const currentMcpSearch = normalizeLegalworkMcpSearchSettings(current.mcpSearch)
  const nextMcpSearch = normalizeLegalworkMcpSearchSettings({
    ...currentMcpSearch,
    ...(patch?.mcpSearch ?? {})
  })
  const currentTokenEconomy = normalizeLegalworkTokenEconomySettings(
    current.tokenEconomy,
    current.tokenEconomyMode
  )
  const patchedTokenEconomy = normalizeLegalworkTokenEconomySettings({
    ...currentTokenEconomy,
    ...(patch?.tokenEconomy ?? {}),
    historyHygiene: {
      ...currentTokenEconomy.historyHygiene,
      ...(patch?.tokenEconomy?.historyHygiene ?? {})
    }
  }, currentTokenEconomy.enabled)
  const tokenEconomyEnabled = typeof patch?.tokenEconomy?.enabled === 'boolean'
    ? patch.tokenEconomy.enabled
    : typeof patch?.tokenEconomyMode === 'boolean'
      ? patch.tokenEconomyMode
      : patchedTokenEconomy.enabled
  const nextTokenEconomy = {
    ...patchedTokenEconomy,
    enabled: tokenEconomyEnabled
  }
  const currentStorage = normalizeLegalworkStorageSettings(current.storage)
  const nextStorage = normalizeLegalworkStorageSettings({
    ...currentStorage,
    ...(patch?.storage ?? {})
  })
  const currentContextCompaction = normalizeLegalworkContextCompactionSettings(current.contextCompaction)
  const nextContextCompaction = normalizeLegalworkContextCompactionSettings({
    ...currentContextCompaction,
    ...(patch?.contextCompaction ?? {})
  })
  const currentRuntimeTuning = normalizeLegalworkRuntimeTuningSettings(current.runtimeTuning)
  const nextRuntimeTuning = normalizeLegalworkRuntimeTuningSettings({
    ...currentRuntimeTuning,
    ...(patch?.runtimeTuning
      ? {
          toolStorm: {
            ...currentRuntimeTuning.toolStorm,
            ...(patch.runtimeTuning.toolStorm ?? {})
          },
          toolArgumentRepair: {
            ...currentRuntimeTuning.toolArgumentRepair,
            ...(patch.runtimeTuning.toolArgumentRepair ?? {})
          }
        }
      : {})
  })
  return {
    ...current,
    ...(patch ?? {}),
    tokenEconomyMode: nextTokenEconomy.enabled,
    tokenEconomy: nextTokenEconomy,
    mcpSearch: nextMcpSearch,
    storage: nextStorage,
    contextCompaction: nextContextCompaction,
    runtimeTuning: nextRuntimeTuning
  }
}

function normalizeLegalworkTokenEconomySettings(
  input: Partial<LegalworkTokenEconomySettingsV1> | undefined,
  enabledFallback = false
): LegalworkTokenEconomySettingsV1 {
  return {
    enabled: typeof input?.enabled === 'boolean' ? input.enabled : enabledFallback,
    compressToolDescriptions: input?.compressToolDescriptions !== false,
    compressToolResults: input?.compressToolResults !== false,
    conciseResponses: input?.conciseResponses !== false,
    historyHygiene: normalizeLegalworkHistoryHygieneSettings(input?.historyHygiene)
  }
}

function normalizeLegalworkHistoryHygieneSettings(
  input: Partial<LegalworkHistoryHygieneSettingsV1> | undefined
): LegalworkHistoryHygieneSettingsV1 {
  const defaults = defaultLegalworkHistoryHygieneSettings()
  return {
    maxToolResultLines: boundedPositiveInt(input?.maxToolResultLines, defaults.maxToolResultLines, 100_000),
    maxToolResultBytes: boundedPositiveInt(input?.maxToolResultBytes, defaults.maxToolResultBytes, 8 * 1024 * 1024),
    maxToolResultTokens: boundedPositiveInt(input?.maxToolResultTokens, defaults.maxToolResultTokens, 256_000),
    maxToolArgumentStringBytes: boundedPositiveInt(
      input?.maxToolArgumentStringBytes,
      defaults.maxToolArgumentStringBytes,
      8 * 1024 * 1024
    ),
    maxToolArgumentStringTokens: boundedPositiveInt(
      input?.maxToolArgumentStringTokens,
      defaults.maxToolArgumentStringTokens,
      64_000
    ),
    maxArrayItems: boundedPositiveInt(input?.maxArrayItems, defaults.maxArrayItems, 10_000)
  }
}

function normalizeLegalworkMcpSearchSettings(
  input: Partial<LegalworkMcpSearchSettingsV1> | undefined
): LegalworkMcpSearchSettingsV1 {
  const defaults = defaultLegalworkMcpSearchSettings()
  const topKMax = positiveInt(input?.topKMax, defaults.topKMax)
  const topKDefault = Math.min(positiveInt(input?.topKDefault, defaults.topKDefault), topKMax)
  return {
    enabled: input?.enabled === true,
    mode: input?.mode === 'direct' || input?.mode === 'search' || input?.mode === 'auto'
      ? input.mode
      : defaults.mode,
    autoThresholdToolCount: positiveInt(input?.autoThresholdToolCount, defaults.autoThresholdToolCount),
    topKDefault,
    topKMax,
    minScore: nonNegativeNumber(input?.minScore, defaults.minScore)
  }
}

function positiveInt(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : fallback
}

function nonNegativeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : fallback
}

function boundedPositiveInt(value: unknown, fallback: number, max = Number.MAX_SAFE_INTEGER): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback
  return Math.min(Math.floor(value), max)
}

function normalizeLegalworkStorageSettings(
  input: Partial<LegalworkStorageSettingsV1> | undefined
): LegalworkStorageSettingsV1 {
  const defaults = defaultLegalworkStorageSettings()
  return {
    backend: input?.backend === 'file' || input?.backend === 'hybrid'
      ? input.backend
      : defaults.backend,
    sqlitePath: typeof input?.sqlitePath === 'string' ? input.sqlitePath.trim() : defaults.sqlitePath
  }
}

function normalizeLegalworkContextCompactionSettings(
  input: Partial<LegalworkContextCompactionSettingsV1> | undefined
): LegalworkContextCompactionSettingsV1 {
  const defaults = defaultLegalworkContextCompactionSettings()
  const defaultSoftThreshold = boundedPositiveInt(input?.defaultSoftThreshold, defaults.defaultSoftThreshold)
  const requestedHardThreshold = boundedPositiveInt(input?.defaultHardThreshold, defaults.defaultHardThreshold)
  return {
    defaultSoftThreshold,
    defaultHardThreshold: Math.max(defaultSoftThreshold, requestedHardThreshold),
    summaryMode: input?.summaryMode === 'model' || input?.summaryMode === 'heuristic'
      ? input.summaryMode
      : defaults.summaryMode,
    summaryTimeoutMs: boundedPositiveInt(input?.summaryTimeoutMs, defaults.summaryTimeoutMs, 120_000),
    summaryMaxTokens: boundedPositiveInt(input?.summaryMaxTokens, defaults.summaryMaxTokens, 16_000),
    summaryInputMaxBytes: boundedPositiveInt(input?.summaryInputMaxBytes, defaults.summaryInputMaxBytes, 8 * 1024 * 1024)
  }
}

function normalizeLegalworkRuntimeTuningSettings(
  input: Partial<LegalworkRuntimeTuningSettingsV1> | undefined
): LegalworkRuntimeTuningSettingsV1 {
  const defaults = defaultLegalworkRuntimeTuningSettings()
  return {
    toolStorm: {
      enabled: input?.toolStorm?.enabled !== false,
      windowSize: boundedPositiveInt(input?.toolStorm?.windowSize, defaults.toolStorm.windowSize, 128),
      threshold: Math.max(2, boundedPositiveInt(input?.toolStorm?.threshold, defaults.toolStorm.threshold, 128))
    },
    toolArgumentRepair: {
      maxStringBytes: boundedPositiveInt(
        input?.toolArgumentRepair?.maxStringBytes,
        defaults.toolArgumentRepair.maxStringBytes,
        16 * 1024 * 1024
      )
    }
  }
}

export function withLegalworkRuntimeSettings(
  settings: AppSettingsV1,
  legalwork: LegalworkRuntimeSettingsV1
): AppSettingsV1 {
  return {
    ...settings,
    agents: legalworkSettingsEnvelope(legalwork)
  }
}

export function applyLegalworkRuntimePatch(
  settings: AppSettingsV1,
  patch: LegalworkRuntimeSettingsPatchV1 | undefined
): AppSettingsV1 {
  return withLegalworkRuntimeSettings(
    settings,
    mergeLegalworkRuntimeSettings(getLegalworkRuntimeSettings(settings), patch)
  )
}

export function isLegalworkRuntimeInsecure(runtime: Pick<LegalworkRuntimeSettingsV1, 'insecure' | 'runtimeToken'>): boolean {
  return runtime.insecure || !runtime.runtimeToken.trim()
}

export function getActiveAgentApiKey(settings: AppSettingsV1): string {
  return resolveLegalworkRuntimeSettings(settings).apiKey?.trim() ?? ''
}

export function mergeAgentRuntimeSettings(
  defaults: LegalworkSettingsEnvelopeV1,
  patch: LegalworkSettingsEnvelopePatchV1 | undefined
): LegalworkSettingsEnvelopeV1 {
  return legalworkSettingsEnvelope(
    mergeLegalworkRuntimeSettings(defaults.legalwork, patch?.legalwork)
  )
}

type LegacyAgentsSettingsShape = {
  legalwork?: Partial<LegalworkRuntimeSettingsV1>
  codewhale?: Partial<LegacyLocalHttpRuntimeSettingsV1>
  reasonix?: Partial<LegacyReasoningRuntimeSettingsV1>
}

type LegacyAppSettingsShape = Partial<Omit<AppSettingsV1, 'agents' | 'provider'>> & {
  agents?: LegacyAgentsSettingsShape
  provider?: Partial<ModelProviderSettingsV1>
  deepseek?: Partial<LegacyLocalHttpRuntimeSettingsV1>
  /** Legacy single-provider discriminator. Read only inside migration. */
  agentProvider?: unknown
}

function nonEmptyStringOrFallback(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function upgradeLegacyLegalworkDefaultDataDir(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_LEGALWORK_DATA_DIR
  const trimmed = value.trim()
  const normalized = trimmed.replace(/\\/g, '/').toLowerCase()
  if (
    !trimmed ||
    normalized === LEGACY_COREAGENT_DATA_DIR ||
    normalized.endsWith('/.deepseekgui/coreagent')
  ) {
    return DEFAULT_LEGALWORK_DATA_DIR
  }
  return trimmed
}

function upgradeLegacyLegalworkDefaultModel(value: unknown, fallback: string): string {
  const model = nonEmptyStringOrFallback(value, fallback).trim()
  return model === LEGACY_LEGALWORK_DEFAULT_MODEL ? DEFAULT_LEGALWORK_MODEL : model
}

function upgradeLegacyLegalworkDefaultPort(value: unknown, fallback: number): number {
  return value === LEGACY_LOCAL_HTTP_DEFAULT_PORT ? DEFAULT_LEGALWORK_PORT : fallback
}

export function migrateLegacyAppSettings(parsed: LegacyAppSettingsShape): Partial<AppSettingsV1> {
  const rawAgentProvider = parsed.agentProvider
  const isReasoningLegacy = rawAgentProvider === 'reasonix'
  const hasProviderSettings = typeof parsed.provider === 'object' && parsed.provider !== null
  const defaults = legacyLocalHttpRuntimeDefaults()
  const legalworkDefaults = defaultLegalworkRuntimeSettings()
  const legacyDeepseek = parsed.deepseek ?? {}
  const legacyLocalHttp = {
    ...defaults,
    ...(parsed.agents?.codewhale ?? {}),
    ...legacyDeepseek
  }
  const legacyReasoning = {
    ...legacyReasoningRuntimeDefaults(),
    ...(parsed.agents?.reasonix ?? {})
  }
  const explicitLegalwork: Partial<LegalworkRuntimeSettingsV1> = parsed.agents?.legalwork ?? {}
  const legacySource = isReasoningLegacy ? legacyReasoning : legacyLocalHttp
  const legacySeed = {
    binaryPath: legalworkDefaults.binaryPath,
    port: isReasoningLegacy
      ? legalworkDefaults.port
      : upgradeLegacyLegalworkDefaultPort(legacyLocalHttp.port, legacyLocalHttp.port),
    autoStart: isReasoningLegacy ? legacyReasoning.autoStart : legacyLocalHttp.autoStart,
    apiKey: legacySource.apiKey,
    baseUrl: legacySource.baseUrl,
    providerId: '',
    runtimeToken: isReasoningLegacy ? legalworkDefaults.runtimeToken : legacyLocalHttp.runtimeToken,
    model: isReasoningLegacy ? legacyReasoning.model : legalworkDefaults.model,
    approvalPolicy: isReasoningLegacy ? legalworkDefaults.approvalPolicy : legacyLocalHttp.approvalPolicy,
    sandboxMode: isReasoningLegacy ? legalworkDefaults.sandboxMode : legacyLocalHttp.sandboxMode
  }
  const provider = normalizeModelProviderSettings({
    apiKey: hasProviderSettings
      ? parsed.provider?.apiKey
      : nonEmptyStringOrFallback(explicitLegalwork.apiKey, legacySeed.apiKey),
    baseUrl: hasProviderSettings
      ? parsed.provider?.baseUrl
      : nonEmptyStringOrFallback(explicitLegalwork.baseUrl, legacySeed.baseUrl),
    providers: hasProviderSettings ? parsed.provider?.providers : undefined
  })
  const legalwork = {
    ...legalworkDefaults,
    ...legacySeed,
    ...explicitLegalwork,
    apiKey: hasProviderSettings ? explicitLegalwork.apiKey ?? '' : '',
    baseUrl: hasProviderSettings ? explicitLegalwork.baseUrl ?? '' : '',
    runtimeToken: nonEmptyStringOrFallback(explicitLegalwork.runtimeToken, legacySeed.runtimeToken),
    dataDir: upgradeLegacyLegalworkDefaultDataDir(explicitLegalwork.dataDir),
    model: upgradeLegacyLegalworkDefaultModel(explicitLegalwork.model, legacySeed.model),
    tokenEconomyMode: typeof explicitLegalwork.tokenEconomy?.enabled === 'boolean'
      ? explicitLegalwork.tokenEconomy.enabled
      : explicitLegalwork.tokenEconomyMode ?? legalworkDefaults.tokenEconomyMode,
    tokenEconomy: normalizeLegalworkTokenEconomySettings(
      explicitLegalwork.tokenEconomy,
      explicitLegalwork.tokenEconomyMode ?? legalworkDefaults.tokenEconomyMode
    ),
    mcpSearch: normalizeLegalworkMcpSearchSettings(explicitLegalwork.mcpSearch),
    storage: normalizeLegalworkStorageSettings(explicitLegalwork.storage),
    contextCompaction: normalizeLegalworkContextCompactionSettings(explicitLegalwork.contextCompaction),
    runtimeTuning: normalizeLegalworkRuntimeTuningSettings(explicitLegalwork.runtimeTuning),
    sandboxMode: normalizeLegalworkSandboxMode(explicitLegalwork.sandboxMode ?? legacySeed.sandboxMode)
  }
  // Strip the legacy `agentProvider` discriminator and the legacy
  // per-provider settings from the surfaced migration result. The
  // runtime now has a single agent (Legalwork) and we no longer
  // round-trip the legacy value into the new settings shape.
  const { deepseek: _legacyDeepseek, agents: _agents, agentProvider: _agentProvider, ...rest } = parsed
  void _legacyDeepseek
  void _agents
  void _agentProvider
  return {
    ...rest,
    provider,
    agents: {
      legalwork
    }
  }
}
