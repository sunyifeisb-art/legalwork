import type { GuiUpdateChannel } from './gui-update'
import type { KeyboardShortcutsConfigV1 } from './keyboard-shortcuts'
import type { ApprovalPolicy, SandboxMode } from '../../legalwork/src/contracts/policy.js'
export { DEFAULT_GUI_UPDATE_CHANNEL, normalizeGuiUpdateChannel, type GuiUpdateChannel } from './gui-update'
export {
  DEFAULT_APPROVAL_POLICY,
  DEFAULT_SANDBOX_MODE,
  type ApprovalPolicy,
  type SandboxMode
} from '../../legalwork/src/contracts/policy.js'
export type UiFontScale = 'small' | 'medium' | 'large'
export type ScheduleRunMode = 'agent' | 'plan'
export type ScheduleKind = 'manual' | 'interval' | 'daily' | 'at'
export type ScheduleTaskStatus = 'idle' | 'running' | 'success' | 'error'
export type ScheduleModel = string
export type ScheduleReasoningEffort = 'off' | 'low' | 'medium' | 'high' | 'max'
export type ClawRunMode = ScheduleRunMode
export type ClawImProvider = 'feishu' | 'weixin'
export type ClawScheduleKind = ScheduleKind
export type ClawTaskStatus = ScheduleTaskStatus
export type ClawModel = ScheduleModel

export const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
export const DEFAULT_CLAW_MODEL = 'auto'
export const CLAW_MODEL_IDS = ['auto', 'deepseek-v4-pro', 'deepseek-v4-flash'] as const
export const DEFAULT_SCHEDULE_MODEL = DEFAULT_CLAW_MODEL
export const SCHEDULE_MODEL_IDS = CLAW_MODEL_IDS
export const DEFAULT_SCHEDULE_REASONING_EFFORT = 'medium'
export const SCHEDULE_REASONING_EFFORT_IDS = ['off', 'low', 'medium', 'high', 'max'] as const
export const DEFAULT_SCHEDULE_INTERNAL_PORT = 8788
export const DEFAULT_WRITE_WORKSPACE_ROOT = '~/.legalwork/write_workspace'
export const DEFAULT_LEGALWORK_DATA_DIR = '~/.legalwork/legalwork'
export const DEFAULT_LEGALWORK_MODEL = 'deepseek-v4-pro'
export const DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL = 'https://api.deepseek.com/beta'
export const DEFAULT_WRITE_INLINE_COMPLETION_MODEL = 'deepseek-v4-flash'
export const WRITE_INLINE_COMPLETION_MODEL_IDS = ['deepseek-v4-pro', 'deepseek-v4-flash'] as const
export const DEFAULT_WRITE_INLINE_COMPLETION_DEBOUNCE_MS = 650
export const DEFAULT_WRITE_INLINE_COMPLETION_MIN_ACCEPT_SCORE = 0.52
export const DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS = 96
export const DEFAULT_WRITE_INLINE_LONG_COMPLETION_DEBOUNCE_MS = 2_800
export const DEFAULT_WRITE_INLINE_LONG_COMPLETION_MIN_ACCEPT_SCORE = 0.36
export const DEFAULT_WRITE_INLINE_LONG_COMPLETION_MAX_TOKENS = 256
export const DEFAULT_LEGALWORK_PORT = 8899
export const DEFAULT_WEIXIN_BRIDGE_RPC_URL = 'http://127.0.0.1:18790/api/v1/admin/rpc'
export const DEFAULT_MODEL_PROVIDER_ID = 'deepseek'
export type ModelProviderProfileV1 = {
  id: string
  name: string
  apiKey: string
  baseUrl: string
  endpointFormat?: string
  models: string[]
}
export type ModelProviderSettingsV1 = {
  apiKey: string
  baseUrl: string
  providers: ModelProviderProfileV1[]
}

export type ModelProviderProfilePatchV1 = Partial<ModelProviderProfileV1>
export type ModelProviderSettingsPatchV1 = Partial<
  Omit<ModelProviderSettingsV1, 'providers'>
> & {
  providers?: ModelProviderProfilePatchV1[]
}

export type LegalworkRuntimeSettingsV1 = {
  binaryPath: string
  port: number
  autoStart: boolean
  /** Optional override. Leave empty to inherit the General model provider API key. */
  apiKey: string
  /** Optional override. Leave empty to inherit the General model provider Base URL. */
  baseUrl: string
  /** Compatible request/response protocol. Defaults to chat_completions. */
  endpointFormat: string
  /** Selected General model provider profile. Empty or missing means the default provider. */
  providerId: string
  runtimeToken: string
  dataDir: string
  model: string
  approvalPolicy: ApprovalPolicy
  sandboxMode: SandboxMode
  /** Compress safe tool context before each model call. */
  tokenEconomyMode: boolean
  /** Detailed token-saving behavior used when building Legalwork model requests. */
  tokenEconomy: LegalworkTokenEconomySettingsV1
  /** When true, the runtime skips bearer-token auth. Local dev only. */
  insecure: boolean
  /** GUI-managed MCP progressive discovery/search settings written into Legalwork config.json. */
  mcpSearch: LegalworkMcpSearchSettingsV1
  /** Persistent store backend used by Legalwork. */
  storage: LegalworkStorageSettingsV1
  /** Fallback compaction thresholds and summary behavior. Per-model thresholds live in Legalwork config models.profiles. */
  contextCompaction: LegalworkContextCompactionSettingsV1
  /** Low-level loop guards and model argument repair tuning. */
  runtimeTuning: LegalworkRuntimeTuningSettingsV1
}

export type LegalworkMcpSearchMode = 'direct' | 'search' | 'auto'

export type LegalworkMcpSearchSettingsV1 = {
  enabled: boolean
  mode: LegalworkMcpSearchMode
  autoThresholdToolCount: number
  topKDefault: number
  topKMax: number
  minScore: number
}

export type LegalworkStorageBackend = 'hybrid' | 'file'

export type LegalworkStorageSettingsV1 = {
  backend: LegalworkStorageBackend
  sqlitePath: string
}

export type LegalworkCompactionSummaryMode = 'heuristic' | 'model'

export type LegalworkHistoryHygieneSettingsV1 = {
  maxToolResultLines: number
  maxToolResultBytes: number
  maxToolResultTokens: number
  maxToolArgumentStringBytes: number
  maxToolArgumentStringTokens: number
  maxArrayItems: number
}

export type LegalworkTokenEconomySettingsV1 = {
  enabled: boolean
  compressToolDescriptions: boolean
  compressToolResults: boolean
  conciseResponses: boolean
  historyHygiene: LegalworkHistoryHygieneSettingsV1
}

export type LegalworkContextCompactionSettingsV1 = {
  defaultSoftThreshold: number
  defaultHardThreshold: number
  summaryMode: LegalworkCompactionSummaryMode
  summaryTimeoutMs: number
  summaryMaxTokens: number
  summaryInputMaxBytes: number
}

export type LegalworkToolStormSettingsV1 = {
  enabled: boolean
  windowSize: number
  threshold: number
}

export type LegalworkToolArgumentRepairSettingsV1 = {
  maxStringBytes: number
}

export type LegalworkRuntimeTuningSettingsV1 = {
  toolStorm: LegalworkToolStormSettingsV1
  toolArgumentRepair: LegalworkToolArgumentRepairSettingsV1
}

/**
 * Compatibility shell kept because persisted settings still use the
 * `agents.legalwork` envelope. Prefer operating on the contained
 * `LegalworkRuntimeSettingsV1` directly in new code.
 */
export type LegalworkSettingsEnvelopeV1 = {
  legalwork: LegalworkRuntimeSettingsV1
}

/** @deprecated Use `LegalworkSettingsEnvelopeV1`. */
export type AgentRuntimeSettingsMapV1 = LegalworkSettingsEnvelopeV1

export type LegalworkRuntimeTuningSettingsPatchV1 = {
  toolStorm?: Partial<LegalworkToolStormSettingsV1>
  toolArgumentRepair?: Partial<LegalworkToolArgumentRepairSettingsV1>
}

export type LegalworkTokenEconomySettingsPatchV1 = Partial<
  Omit<LegalworkTokenEconomySettingsV1, 'historyHygiene'>
> & {
  historyHygiene?: Partial<LegalworkHistoryHygieneSettingsV1>
}

export type LegalworkRuntimeSettingsPatchV1 = Partial<
  Omit<
    LegalworkRuntimeSettingsV1,
    'mcpSearch' | 'storage' | 'contextCompaction' | 'runtimeTuning' | 'tokenEconomy'
  >
> & {
  mcpSearch?: Partial<LegalworkMcpSearchSettingsV1>
  tokenEconomy?: LegalworkTokenEconomySettingsPatchV1
  storage?: Partial<LegalworkStorageSettingsV1>
  contextCompaction?: Partial<LegalworkContextCompactionSettingsV1>
  runtimeTuning?: LegalworkRuntimeTuningSettingsPatchV1
}

export type LegalworkSettingsEnvelopePatchV1 = {
  legalwork?: LegalworkRuntimeSettingsPatchV1
}

export type LogConfigV1 = {
  enabled: boolean
  retentionDays: number
}

export type NotificationConfigV1 = {
  turnComplete: boolean
}

export type AppBehaviorConfigV1 = {
  openAtLogin: boolean
  startMinimized: boolean
  closeToTray: boolean
}

export type ScheduleSkillSettingsV1 = {
  defaultNames: string[]
  extraDirs: string[]
}

export type ScheduledTaskScheduleV1 = {
  kind: ScheduleKind
  everyMinutes: number
  timeOfDay: string
  atTime: string
}

export type ScheduledTaskV1 = {
  id: string
  title: string
  enabled: boolean
  prompt: string
  workspaceRoot: string
  model: string
  reasoningEffort: ScheduleReasoningEffort
  mode: ScheduleRunMode
  schedule: ScheduledTaskScheduleV1
  createdAt: string
  updatedAt: string
  lastRunAt: string
  nextRunAt: string
  lastStatus: ScheduleTaskStatus
  lastMessage: string
  lastThreadId: string
}

export type ScheduleInternalSettingsV1 = {
  port: number
  secret: string
}

export type ScheduleSettingsV1 = {
  enabled: boolean
  defaultWorkspaceRoot: string
  model: string
  mode: ScheduleRunMode
  promptPrefix: string
  skills: ScheduleSkillSettingsV1
  keepAwake: boolean
  internal: ScheduleInternalSettingsV1
  tasks: ScheduledTaskV1[]
}

export type ClawSkillSettingsV1 = {
  defaultNames: string[]
  extraDirs: string[]
  promptPrefix: string
}

export type ClawImSettingsV1 = {
  enabled: boolean
  provider: ClawImProvider
  port: number
  path: string
  secret: string
  weixinBridgeUrl: string
  workspaceRoot: string
  model: string
  mode: ClawRunMode
  responseTimeoutMs: number
}

export type ClawTaskScheduleV1 = {
  kind: ClawScheduleKind
  everyMinutes: number
  timeOfDay: string
  atTime: string
}

export type ClawTaskV1 = ScheduledTaskV1

export type ClawImAgentProfileV1 = {
  name: string
  description: string
  identity: string
  personality: string
  userContext: string
  replyRules: string
}

export type ClawImFeishuPlatformCredentialV1 = {
  kind: 'feishu'
  appId: string
  appSecret: string
  domain: string
  createdAt: string
}

export type ClawImWeixinPlatformCredentialV1 = {
  kind: 'weixin'
  accountId: string
  sessionKey: string
  createdAt: string
}

export type ClawImPlatformCredentialV1 =
  | ClawImFeishuPlatformCredentialV1
  | ClawImWeixinPlatformCredentialV1

export type ClawImRemoteSessionV1 = {
  chatId: string
  messageId: string
  threadId: string
  senderId: string
  senderName: string
  updatedAt: string
}

export type ClawImConversationV1 = {
  id: string
  chatId: string
  remoteThreadId: string
  latestMessageId: string
  senderId: string
  senderName: string
  /** Legalwork thread id this conversation maps to. */
  localThreadId: string
  workspaceRoot: string
  createdAt: string
  updatedAt: string
}

export type ClawImChannelV1 = {
  id: string
  provider: ClawImProvider
  label: string
  enabled: boolean
  model: string
  /** Legalwork thread id this channel maps to. */
  threadId: string
  workspaceRoot: string
  agentProfile: ClawImAgentProfileV1
  platformCredential?: ClawImPlatformCredentialV1
  remoteSession?: ClawImRemoteSessionV1
  conversations: ClawImConversationV1[]
  createdAt: string
  updatedAt: string
}

export type ClawSettingsV1 = {
  enabled: boolean
  skills: ClawSkillSettingsV1
  im: ClawImSettingsV1
  channels: ClawImChannelV1[]
  tasks: ClawTaskV1[]
}

export type WriteInlineCompletionSettingsV1 = {
  enabled: boolean
  retrievalEnabled: boolean
  longCompletionEnabled: boolean
  apiKey: string
  baseUrl: string
  /** When true, Write inherits Legalwork's runtime model instead of using `model` as an override. */
  inheritModel: boolean
  model: string
  debounceMs: number
  longDebounceMs: number
  minAcceptScore: number
  longMinAcceptScore: number
  maxTokens: number
  longMaxTokens: number
}

export type WriteSettingsV1 = {
  defaultWorkspaceRoot: string
  activeWorkspaceRoot: string
  workspaces: string[]
  inlineCompletion: WriteInlineCompletionSettingsV1
}

export type ClawSettingsPatchV1 = Partial<Omit<ClawSettingsV1, 'skills' | 'im' | 'channels' | 'tasks'>> & {
  skills?: Partial<ClawSkillSettingsV1>
  im?: Partial<ClawImSettingsV1>
  channels?: Array<Partial<ClawImChannelV1>>
  tasks?: Array<Partial<ClawTaskV1>>
}

export type ScheduleSettingsPatchV1 = Partial<
  Omit<ScheduleSettingsV1, 'skills' | 'internal' | 'tasks'>
> & {
  skills?: Partial<ScheduleSkillSettingsV1>
  internal?: Partial<ScheduleInternalSettingsV1>
  tasks?: Array<Partial<ScheduledTaskV1>>
}

export type WriteSettingsPatchV1 = Partial<Omit<WriteSettingsV1, 'inlineCompletion'>> & {
  inlineCompletion?: Partial<WriteInlineCompletionSettingsV1>
}

export type ClawGeneratedFileV1 = {
  path: string
  relativePath?: string
  fileName: string
}

export type ClawRunResult =
  | { ok: true; threadId: string; turnId?: string; text?: string; message?: string; files?: ClawGeneratedFileV1[] }
  | { ok: false; message: string }

export type ScheduleRunResult = ClawRunResult

export type ScheduleTaskFromTextResult =
  | { kind: 'noop' }
  | { kind: 'created'; taskId: string; title: string; scheduleAt: string; confirmationText: string }
  | { kind: 'error'; message: string }

export type ClawTaskFromTextResult = ScheduleTaskFromTextResult

export type ClawRuntimeStatus = {
  imServerRunning: boolean
  imUrl: string
  runningTaskIds: string[]
}

export type ScheduleRuntimeStatus = {
  internalServerRunning: boolean
  internalUrl: string
  runningTaskIds: string[]
  powerSaveBlockerActive: boolean
}

export type GuiUpdateConfigV1 = {
  channel: GuiUpdateChannel
}

export type AppSettingsV1 = {
  version: 1
  locale: 'en' | 'zh'
  theme: 'system' | 'light' | 'dark'
  uiFontScale: UiFontScale
  provider: ModelProviderSettingsV1
  agents: LegalworkSettingsEnvelopeV1
  workspaceRoot: string
  log: LogConfigV1
  notifications: NotificationConfigV1
  appBehavior: AppBehaviorConfigV1
  keyboardShortcuts: KeyboardShortcutsConfigV1
  write: WriteSettingsV1
  claw: ClawSettingsV1
  schedule: ScheduleSettingsV1
  guiUpdate: GuiUpdateConfigV1
}

export type AppSettingsPatch = Partial<
  Omit<AppSettingsV1, 'provider' | 'agents' | 'log' | 'notifications' | 'appBehavior' | 'keyboardShortcuts' | 'write' | 'claw' | 'schedule' | 'guiUpdate'>
> & {
  provider?: ModelProviderSettingsPatchV1
  agents?: LegalworkSettingsEnvelopePatchV1
  log?: Partial<LogConfigV1>
  notifications?: Partial<NotificationConfigV1>
  appBehavior?: Partial<AppBehaviorConfigV1>
  keyboardShortcuts?: Partial<KeyboardShortcutsConfigV1>
  write?: WriteSettingsPatchV1
  claw?: ClawSettingsPatchV1
  schedule?: ScheduleSettingsPatchV1
  guiUpdate?: Partial<GuiUpdateConfigV1>
}
