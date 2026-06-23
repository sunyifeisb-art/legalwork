import { z } from 'zod'
import {
  LEGALWORK_APPROVAL_TEMPLATE,
  LEGALWORK_ATTACHMENT_CONTENT_TEMPLATE,
  LEGALWORK_ATTACHMENT_DIAGNOSTICS_TEMPLATE,
  LEGALWORK_ATTACHMENTS_TEMPLATE,
  LEGALWORK_ATTACHMENT_TEMPLATE,
  LEGALWORK_HEALTH_TEMPLATE,
  LEGALWORK_MEMORY_DIAGNOSTICS_TEMPLATE,
  LEGALWORK_KNOWLEDGE_AGENT_SOURCES_TEMPLATE,
  LEGALWORK_KNOWLEDGE_CREATE_FOLDER_TEMPLATE,
  LEGALWORK_KNOWLEDGE_DELETE_FILE_TEMPLATE,
  LEGALWORK_KNOWLEDGE_DIAGNOSTICS_TEMPLATE,
  LEGALWORK_KNOWLEDGE_MOVE_TEMPLATE,
  LEGALWORK_KNOWLEDGE_READ_FILE_TEMPLATE,
  LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_TEMPLATE,
  LEGALWORK_KNOWLEDGE_ABSOLUTE_PATH_TEMPLATE,
  LEGALWORK_KNOWLEDGE_SEARCH_TEMPLATE,
  LEGALWORK_KNOWLEDGE_SYNC_TEMPLATE,
  LEGALWORK_KNOWLEDGE_TREE_TEMPLATE,
  LEGALWORK_KNOWLEDGE_WRITE_FILE_TEMPLATE,
  LEGALWORK_MEMORY_RECORD_TEMPLATE,
  LEGALWORK_MEMORY_TEMPLATE,
  LEGALWORK_RUNTIME_INFO_TEMPLATE,
  LEGALWORK_RUNTIME_TOOLS_TEMPLATE,
  LEGALWORK_SESSION_RESUME_TEMPLATE,
  LEGALWORK_SKILLS_TEMPLATE,
  LEGALWORK_THREADS_TEMPLATE,
  LEGALWORK_THREAD_COMPACT_TEMPLATE,
  LEGALWORK_THREAD_FORK_TEMPLATE,
  LEGALWORK_THREAD_GOAL_TEMPLATE,
  LEGALWORK_THREAD_REVIEW_TEMPLATE,
  LEGALWORK_THREAD_TODOS_TEMPLATE,
  LEGALWORK_THREAD_INTERRUPT_TEMPLATE,
  LEGALWORK_THREAD_STEER_TEMPLATE,
  LEGALWORK_THREAD_TURNS_TEMPLATE,
  LEGALWORK_THREAD_TURN_TEMPLATE,
  LEGALWORK_THREAD_TEMPLATE,
  LEGALWORK_USER_INPUT_TEMPLATE,
  LEGALWORK_USAGE_TEMPLATE
} from '../../shared/legalwork-endpoints'
import {
  CLAW_MODEL_IDS,
  SCHEDULE_MODEL_IDS,
  SCHEDULE_REASONING_EFFORT_IDS,
  WRITE_INLINE_COMPLETION_MODEL_IDS
} from '../../shared/app-settings'
import { DESKTOP_COMMANDS } from '../../shared/ds-gui-api'
import { GUI_UPDATE_CHANNELS } from '../../shared/gui-update'
import { KEYBOARD_SHORTCUT_COMMANDS } from '../../shared/keyboard-shortcuts'
import { WRITE_EXPORT_FORMATS } from '../../shared/write-export'

const MAX_BODY_BYTES = 2_000_000
const MAX_PATH_LENGTH = 4_096
const MAX_URL_LENGTH = 4_096
const MAX_ID_LENGTH = 256
const MAX_BRANCH_LENGTH = 255
const MAX_EDITOR_ID_LENGTH = 64
const MAX_NOTIFICATION_TITLE_LENGTH = 200
const MAX_NOTIFICATION_BODY_LENGTH = 5_000
const MAX_CHANNEL_TEXT_LENGTH = 100_000
const MAX_SKILL_FILE_BYTES = 1_000_000
const MAX_CONFIG_FILE_BYTES = 2_000_000
const MAX_DEVICE_CODE_LENGTH = 8_192
const MAX_EDITOR_COMPLETION_TEXT = 200_000
const MAX_DATA_COMPLIANCE_FILE_BYTES = 40 * 1024 * 1024

const SAFE_OPEN_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

function trimmedString(max: number): z.ZodString {
  return z.string().trim().min(1).max(max)
}

function optionalTrimmedString(max: number): z.ZodOptional<z.ZodString> {
  return z.string().trim().max(max).optional()
}

export function isSafeOpenExternalUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return SAFE_OPEN_EXTERNAL_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export const defaultPathSchema = optionalTrimmedString(MAX_PATH_LENGTH)

interface EndpointTemplate {
  /** Compiled path matcher. */
  match(path: string): boolean
  allowedMethods: readonly string[]
}

function compileEndpoint(
  template: string,
  allowedMethods: readonly string[]
): EndpointTemplate {
  // Build a regex from the template by escaping the literal parts and
  // substituting the `{id}` / `{turn}` placeholders with `[^/]+`. The
  // template fragments are URL-encoded by the path helpers, so they
  // contain only characters that are safe to escape directly.
  const pattern = template.replace(/[.+*?^$()|[\]\\]/g, '\\$&').replace(/\{(?:id|turn)\}/g, '[^/]+')
  const regex = new RegExp(`^${pattern}$`)
  return {
    match: (path: string) => regex.test(path),
    allowedMethods
  }
}

const ENDPOINTS: readonly EndpointTemplate[] = [
  compileEndpoint(LEGALWORK_HEALTH_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_RUNTIME_INFO_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_RUNTIME_TOOLS_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_SKILLS_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_ATTACHMENTS_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_ATTACHMENT_DIAGNOSTICS_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_ATTACHMENT_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_ATTACHMENT_CONTENT_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_MEMORY_TEMPLATE, ['GET', 'POST']),
  compileEndpoint(LEGALWORK_MEMORY_DIAGNOSTICS_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_MEMORY_RECORD_TEMPLATE, ['PATCH', 'DELETE']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_SYNC_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_SEARCH_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_AGENT_SOURCES_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_DIAGNOSTICS_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_TREE_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_CREATE_FOLDER_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_WRITE_FILE_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_READ_FILE_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_ABSOLUTE_PATH_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_MOVE_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_KNOWLEDGE_DELETE_FILE_TEMPLATE, ['DELETE']),
  compileEndpoint(LEGALWORK_THREADS_TEMPLATE, ['GET', 'POST']),
  compileEndpoint(LEGALWORK_THREAD_TEMPLATE, ['GET', 'PATCH', 'DELETE']),
  compileEndpoint(LEGALWORK_THREAD_FORK_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_THREAD_GOAL_TEMPLATE, ['GET', 'POST', 'DELETE']),
  compileEndpoint(LEGALWORK_THREAD_TODOS_TEMPLATE, ['GET', 'POST', 'DELETE']),
  compileEndpoint(LEGALWORK_THREAD_COMPACT_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_THREAD_REVIEW_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_THREAD_TURNS_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_THREAD_TURN_TEMPLATE, ['GET']),
  compileEndpoint(LEGALWORK_THREAD_STEER_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_THREAD_INTERRUPT_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_APPROVAL_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_USER_INPUT_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_SESSION_RESUME_TEMPLATE, ['POST']),
  compileEndpoint(LEGALWORK_USAGE_TEMPLATE, ['GET'])
]

function isAllowedRuntimeRequest(value: { path: string; method?: string }): boolean {
  try {
    const url = new URL(value.path, 'http://localhost')
    const path = url.pathname
    const method = value.method ?? 'GET'
    for (const endpoint of ENDPOINTS) {
      if (endpoint.match(path)) {
        if (endpoint.allowedMethods.includes(method)) return true
      }
    }
    return false
  } catch {
    return false
  }
}

export const runtimeRequestPayloadSchema = z
  .object({
    path: trimmedString(MAX_URL_LENGTH).transform((value) =>
      value.startsWith('/') ? value : `/${value}`
    ),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).optional(),
    body: z.string().max(MAX_BODY_BYTES).optional()
  })
  .refine((payload) => isAllowedRuntimeRequest(payload), {
    message: 'runtime request path is not allowed'
  })
  .strict()

export const dataComplianceRequestPayloadSchema = z
  .object({
    path: trimmedString(MAX_URL_LENGTH).transform((value) =>
      value.startsWith('/') ? value : `/${value}`
    ),
    method: z.enum(['GET', 'POST', 'DELETE']).optional(),
    body: z.string().max(MAX_BODY_BYTES).optional()
  })
  .refine((payload) => {
    const method = payload.method ?? 'GET'
    try {
      const url = new URL(payload.path, 'http://localhost')
      const path = url.pathname
      // 新主 runtime 路径
      if (path === '/data-compliance/tasks') return method === 'GET' || method === 'POST'
      if (path === '/data-compliance/environment') return method === 'GET'
      if (/^\/data-compliance\/tasks\/[A-Za-z0-9_-]+$/.test(path)) return method === 'GET' || method === 'DELETE'
      if (/^\/data-compliance\/tasks\/[A-Za-z0-9_-]+\/files\/[A-Za-z0-9_-]+$/.test(path)) return method === 'GET'
      if (/^\/data-compliance\/tasks\/[A-Za-z0-9_-]+\/progress$/.test(path)) return method === 'GET'
      // 旧 Flask 路径兼容映射
      if (path === '/api/history') return method === 'GET'
      if (/^\/api\/history\/[A-Za-z0-9_-]+$/.test(path)) return method === 'DELETE'
      if (/^\/api\/result\/[A-Za-z0-9_-]+$/.test(path)) return method === 'GET'
      if (/^\/api\/progress\/[A-Za-z0-9_-]+$/.test(path)) return method === 'GET'
      if (/^\/api\/download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === 'GET'
      if (/^\/api\/desensitize\/download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === 'GET'
      if (/^\/api\/save-download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === 'POST'
      if (/^\/api\/desensitize\/save-download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === 'POST'
      if (/^\/api\/task\/[A-Za-z0-9_-]+\/(?:locations|preview-full|preview-document)$/.test(path)) return method === 'GET'
      if (/^\/api\/task\/[A-Za-z0-9_-]+\/preview-page\/\d+$/.test(path)) return method === 'GET'
      if (/^\/api\/task\/[A-Za-z0-9_-]+\/preview-file$/.test(path)) return method === 'GET'
      return false
    } catch {
      return false
    }
  }, {
    message: 'data compliance request path is not allowed'
  })
  .strict()

export const dataComplianceSubmitPayloadSchema = z.object({
  mode: z.enum(['review', 'desensitize']),
  documentName: z.string().trim().max(500).optional(),
  inputText: z.string().max(MAX_BODY_BYTES).optional(),
  reviewType: z.enum(['document', 'code']).optional(),
  outputDir: z.string().trim().max(2000).optional(),
  outputFormat: z.enum(['md', 'docx', 'txt']).optional(),
  file: z.object({
    name: z.string().trim().min(1).max(500),
    type: z.string().trim().max(200).optional(),
    dataBase64: z.string().max(Math.ceil(MAX_DATA_COMPLIANCE_FILE_BYTES * 1.4))
  }).strict().optional()
}).strict().refine((payload) => Boolean(payload.file || payload.inputText?.trim()), {
  message: 'file or input text is required'
})

export const dataComplianceDownloadFilePayloadSchema = z.object({
  taskId: z.string().trim().min(1).max(64),
  fileKey: z.string().trim().min(1).max(100)
}).strict()

const localeSchema = z.enum(['en', 'zh'])
const themeSchema = z.enum(['system', 'light', 'dark'])
const uiFontScaleSchema = z.enum(['small', 'medium', 'large'])
const approvalPolicySchema = z.enum(['on-request', 'untrusted', 'never', 'auto', 'suggest'])
const sandboxModeSchema = z.enum(['read-only', 'workspace-write', 'danger-full-access', 'external-sandbox'])
const mcpSearchModeSchema = z.enum(['direct', 'search', 'auto'])
const legalworkStorageBackendSchema = z.enum(['hybrid', 'file'])
const legalworkCompactionSummaryModeSchema = z.enum(['heuristic', 'model'])
const clawRunModeSchema = z.enum(['agent', 'plan'])
const clawImProviderSchema = z.enum(['feishu', 'weixin'])
const clawScheduleKindSchema = z.enum(['manual', 'interval', 'daily', 'at'])
const clawTaskStatusSchema = z.enum(['idle', 'running', 'success', 'error'])
const clawModelSchema = z.union([z.enum(CLAW_MODEL_IDS), trimmedString(128)])
const scheduleReasoningEffortSchema = z.enum(SCHEDULE_REASONING_EFFORT_IDS)
const writeInlineCompletionModelSchema = z.union([
  z.enum(WRITE_INLINE_COMPLETION_MODEL_IDS),
  trimmedString(128)
])

const modelProviderPatchSchema = z.object({
  apiKey: z.string().max(MAX_BODY_BYTES).optional(),
  baseUrl: z.string().trim().max(MAX_URL_LENGTH).optional(),
  providers: z.array(z.object({
    id: z.string().trim().min(1).max(64).optional(),
    name: z.string().trim().min(1).max(80).optional(),
    apiKey: z.string().max(MAX_BODY_BYTES).optional(),
    baseUrl: z.string().trim().max(MAX_URL_LENGTH).optional(),
    endpointFormat: z.string().trim().max(64).optional(),
    models: z.array(z.string().trim().min(1).max(128)).max(200).optional()
  }).strict()).max(50).optional()
}).strict()

const legalworkRuntimePatchSchema = z.object({
  binaryPath: defaultPathSchema,
  port: z.number().int().min(1).max(65_535).optional(),
  autoStart: z.boolean().optional(),
  apiKey: z.string().max(MAX_BODY_BYTES).optional(),
  baseUrl: z.string().trim().max(MAX_URL_LENGTH).optional(),
  endpointFormat: z.string().trim().max(64).optional(),
  providerId: z.string().trim().max(64).optional(),
  runtimeToken: z.string().max(MAX_BODY_BYTES).optional(),
  dataDir: defaultPathSchema,
  model: z.string().trim().min(1).max(128).optional(),
  approvalPolicy: approvalPolicySchema.optional(),
  sandboxMode: sandboxModeSchema.optional(),
  tokenEconomyMode: z.boolean().optional(),
  tokenEconomy: z.object({
    enabled: z.boolean().optional(),
    compressToolDescriptions: z.boolean().optional(),
    compressToolResults: z.boolean().optional(),
    conciseResponses: z.boolean().optional(),
    historyHygiene: z.object({
      maxToolResultLines: z.number().int().positive().max(100_000).optional(),
      maxToolResultBytes: z.number().int().positive().max(8 * 1024 * 1024).optional(),
      maxToolResultTokens: z.number().int().positive().max(256_000).optional(),
      maxToolArgumentStringBytes: z.number().int().positive().max(8 * 1024 * 1024).optional(),
      maxToolArgumentStringTokens: z.number().int().positive().max(64_000).optional(),
      maxArrayItems: z.number().int().positive().max(10_000).optional()
    }).strict().optional()
  }).strict().optional(),
  insecure: z.boolean().optional(),
  mcpSearch: z.object({
    enabled: z.boolean().optional(),
    mode: mcpSearchModeSchema.optional(),
    autoThresholdToolCount: z.number().int().positive().optional(),
    topKDefault: z.number().int().positive().optional(),
    topKMax: z.number().int().positive().optional(),
    minScore: z.number().nonnegative().optional()
  }).strict().optional(),
  storage: z.object({
    backend: legalworkStorageBackendSchema.optional(),
    sqlitePath: defaultPathSchema
  }).strict().optional(),
  contextCompaction: z.object({
    defaultSoftThreshold: z.number().int().positive().optional(),
    defaultHardThreshold: z.number().int().positive().optional(),
    summaryMode: legalworkCompactionSummaryModeSchema.optional(),
    summaryTimeoutMs: z.number().int().positive().max(120_000).optional(),
    summaryMaxTokens: z.number().int().positive().max(16_000).optional(),
    summaryInputMaxBytes: z.number().int().positive().max(8 * 1024 * 1024).optional()
  }).strict().optional(),
  runtimeTuning: z.object({
    toolStorm: z.object({
      enabled: z.boolean().optional(),
      windowSize: z.number().int().positive().max(128).optional(),
      threshold: z.number().int().min(2).max(128).optional()
    }).strict().optional(),
    toolArgumentRepair: z.object({
      maxStringBytes: z.number().int().positive().max(16 * 1024 * 1024).optional()
    }).strict().optional()
  }).strict().optional()
}).strict()

const logPatchSchema = z.object({
  enabled: z.boolean().optional(),
  retentionDays: z.number().int().min(1).max(365).optional()
}).strict()

const notificationsPatchSchema = z.object({
  turnComplete: z.boolean().optional()
}).strict()

const appBehaviorPatchSchema = z.object({
  openAtLogin: z.boolean().optional(),
  startMinimized: z.boolean().optional(),
  closeToTray: z.boolean().optional()
}).strict()

const keyboardShortcutCommandIds = KEYBOARD_SHORTCUT_COMMANDS.map((command) => command.id) as [
  typeof KEYBOARD_SHORTCUT_COMMANDS[number]['id'],
  ...Array<typeof KEYBOARD_SHORTCUT_COMMANDS[number]['id']>
]

const keyboardShortcutsPatchSchema = z.object({
  bindings: z.partialRecord(
    z.enum(keyboardShortcutCommandIds),
    z.array(z.string().trim().max(64)).max(4)
  ).optional()
}).strict()

const writeInlineCompletionPatchSchema = z.object({
  enabled: z.boolean().optional(),
  retrievalEnabled: z.boolean().optional(),
  longCompletionEnabled: z.boolean().optional(),
  apiKey: z.string().max(MAX_BODY_BYTES).optional(),
  baseUrl: z.string().trim().max(MAX_URL_LENGTH).optional(),
  inheritModel: z.boolean().optional(),
  model: writeInlineCompletionModelSchema.optional(),
  debounceMs: z.number().int().min(150).max(5_000).optional(),
  longDebounceMs: z.number().int().min(1_000).max(15_000).optional(),
  minAcceptScore: z.number().min(0.1).max(0.95).optional(),
  longMinAcceptScore: z.number().min(0.1).max(0.95).optional(),
  maxTokens: z.number().int().min(16).max(512).optional(),
  longMaxTokens: z.number().int().min(64).max(1_024).optional()
}).strict()

const writeSettingsPatchSchema = z.object({
  defaultWorkspaceRoot: defaultPathSchema,
  activeWorkspaceRoot: defaultPathSchema,
  workspaces: z.array(trimmedString(MAX_PATH_LENGTH)).max(256).optional(),
  inlineCompletion: writeInlineCompletionPatchSchema.optional()
}).strict()

const clawSkillPatchSchema = z.object({
  defaultNames: z.array(trimmedString(128)).max(128).optional(),
  extraDirs: z.array(trimmedString(MAX_PATH_LENGTH)).max(128).optional(),
  promptPrefix: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional()
}).strict()

const clawImPatchSchema = z.object({
  enabled: z.boolean().optional(),
  provider: clawImProviderSchema.optional(),
  port: z.number().int().min(1024).max(65_535).optional(),
  path: trimmedString(MAX_PATH_LENGTH).optional(),
  secret: z.string().max(MAX_BODY_BYTES).optional(),
  weixinBridgeUrl: z.string().trim().max(MAX_URL_LENGTH).optional(),
  openClawGatewayUrl: z.string().trim().max(MAX_URL_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  model: z.string().trim().min(1).max(128).optional(),
  mode: clawRunModeSchema.optional(),
  responseTimeoutMs: z.number().int().min(5_000).max(600_000).optional()
}).strict()

const clawImAgentProfilePatchSchema = z.object({
  name: z.string().max(200).optional(),
  description: z.string().max(2_000).optional(),
  identity: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  personality: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  userContext: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  replyRules: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional()
}).strict()

const clawImPlatformCredentialPatchSchema = z.union([
  z.object({
    kind: z.literal('feishu').optional(),
    appId: z.string().max(512).optional(),
    appSecret: z.string().max(MAX_BODY_BYTES).optional(),
    domain: z.string().max(512).optional(),
    createdAt: z.string().max(128).optional()
  }).strict(),
  z.object({
    kind: z.literal('weixin'),
    accountId: z.string().max(512).optional(),
    sessionKey: z.string().max(MAX_BODY_BYTES).optional(),
    createdAt: z.string().max(128).optional()
  }).strict()
])

const clawImRemoteSessionPatchSchema = z.object({
  chatId: z.string().max(MAX_ID_LENGTH).optional(),
  messageId: z.string().max(MAX_ID_LENGTH).optional(),
  threadId: z.string().max(MAX_ID_LENGTH).optional(),
  senderId: z.string().max(MAX_ID_LENGTH).optional(),
  senderName: z.string().max(512).optional(),
  updatedAt: z.string().max(128).optional()
}).strict()

const clawImConversationPatchSchema = z.object({
  id: z.string().max(MAX_ID_LENGTH).optional(),
  chatId: z.string().max(MAX_ID_LENGTH).optional(),
  remoteThreadId: z.string().max(MAX_ID_LENGTH).optional(),
  latestMessageId: z.string().max(MAX_ID_LENGTH).optional(),
  senderId: z.string().max(MAX_ID_LENGTH).optional(),
  senderName: z.string().max(512).optional(),
  localThreadId: z.string().max(MAX_ID_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  createdAt: z.string().max(128).optional(),
  updatedAt: z.string().max(128).optional()
}).strict()

const clawImChannelPatchSchema = z.object({
  id: z.string().max(MAX_ID_LENGTH).optional(),
  provider: clawImProviderSchema.optional(),
  label: z.string().max(512).optional(),
  enabled: z.boolean().optional(),
  model: z.string().trim().min(1).max(128).optional(),
  threadId: z.string().max(MAX_ID_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  agentProfile: clawImAgentProfilePatchSchema.optional(),
  platformCredential: clawImPlatformCredentialPatchSchema.optional(),
  remoteSession: clawImRemoteSessionPatchSchema.optional(),
  conversations: z.array(clawImConversationPatchSchema).max(512).optional(),
  createdAt: z.string().max(128).optional(),
  updatedAt: z.string().max(128).optional()
}).strict()

const clawTaskSchedulePatchSchema = z.object({
  kind: clawScheduleKindSchema.optional(),
  everyMinutes: z.number().int().min(1).max(10_080).optional(),
  timeOfDay: z.string().max(16).optional(),
  atTime: z.string().max(128).optional()
}).strict()

const clawTaskPatchSchema = z.object({
  id: z.string().max(MAX_ID_LENGTH).optional(),
  title: z.string().max(512).optional(),
  enabled: z.boolean().optional(),
  prompt: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  model: z.string().trim().min(1).max(128).optional(),
  reasoningEffort: scheduleReasoningEffortSchema.optional(),
  mode: clawRunModeSchema.optional(),
  schedule: clawTaskSchedulePatchSchema.optional(),
  createdAt: z.string().max(128).optional(),
  updatedAt: z.string().max(128).optional(),
  lastRunAt: z.string().max(128).optional(),
  nextRunAt: z.string().max(128).optional(),
  lastStatus: clawTaskStatusSchema.optional(),
  lastMessage: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  lastThreadId: z.string().max(MAX_ID_LENGTH).optional()
}).strict()

const clawSettingsPatchSchema = z.object({
  enabled: z.boolean().optional(),
  skills: clawSkillPatchSchema.optional(),
  im: clawImPatchSchema.optional(),
  channels: z.array(clawImChannelPatchSchema).max(512).optional(),
  tasks: z.array(clawTaskPatchSchema).max(512).optional()
}).strict()

const scheduleSkillPatchSchema = z.object({
  defaultNames: z.array(trimmedString(128)).max(128).optional(),
  extraDirs: z.array(trimmedString(MAX_PATH_LENGTH)).max(128).optional()
}).strict()

const scheduleInternalPatchSchema = z.object({
  port: z.number().int().min(1024).max(65_535).optional(),
  secret: z.string().max(MAX_BODY_BYTES).optional()
}).strict()

const scheduledTaskSchedulePatchSchema = z.object({
  kind: clawScheduleKindSchema.optional(),
  everyMinutes: z.number().int().min(1).max(10_080).optional(),
  timeOfDay: z.string().max(16).optional(),
  atTime: z.string().max(128).optional()
}).strict()

const scheduledTaskPatchSchema = z.object({
  id: z.string().max(MAX_ID_LENGTH).optional(),
  title: z.string().max(512).optional(),
  enabled: z.boolean().optional(),
  prompt: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  model: z.string().trim().min(1).max(128).optional(),
  reasoningEffort: scheduleReasoningEffortSchema.optional(),
  mode: clawRunModeSchema.optional(),
  schedule: scheduledTaskSchedulePatchSchema.optional(),
  createdAt: z.string().max(128).optional(),
  updatedAt: z.string().max(128).optional(),
  lastRunAt: z.string().max(128).optional(),
  nextRunAt: z.string().max(128).optional(),
  lastStatus: clawTaskStatusSchema.optional(),
  lastMessage: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  lastThreadId: z.string().max(MAX_ID_LENGTH).optional()
}).strict()

const scheduleSettingsPatchSchema = z.object({
  enabled: z.boolean().optional(),
  defaultWorkspaceRoot: defaultPathSchema,
  model: z.union([z.enum(SCHEDULE_MODEL_IDS), trimmedString(128)]).optional(),
  mode: clawRunModeSchema.optional(),
  promptPrefix: z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  skills: scheduleSkillPatchSchema.optional(),
  keepAwake: z.boolean().optional(),
  internal: scheduleInternalPatchSchema.optional(),
  tasks: z.array(scheduledTaskPatchSchema).max(512).optional()
}).strict()

function stripLegacySettingsPatchKeys(payload: unknown): unknown {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return payload
  const source = payload as Record<string, unknown>
  const next: Record<string, unknown> = { ...source }

  delete next.agentProvider
  delete next.deepseek
  delete next.reasonix
  delete next.quickChat

  if (typeof next.agents === 'object' && next.agents !== null && !Array.isArray(next.agents)) {
    const agents = { ...(next.agents as Record<string, unknown>) }
    delete agents.codewhale
    delete agents.reasonix
    delete agents.quickChat
    next.agents = agents
  }

  return next
}

const settingsPatchObjectSchema = z.object({
  version: z.literal(1).optional(),
  locale: localeSchema.optional(),
  theme: themeSchema.optional(),
  uiFontScale: uiFontScaleSchema.optional(),
  provider: modelProviderPatchSchema.optional(),
  agents: z.object({
    legalwork: legalworkRuntimePatchSchema.optional()
  }).strict().optional(),
  workspaceRoot: defaultPathSchema,
  log: logPatchSchema.optional(),
  notifications: notificationsPatchSchema.optional(),
  appBehavior: appBehaviorPatchSchema.optional(),
  keyboardShortcuts: keyboardShortcutsPatchSchema.optional(),
  write: writeSettingsPatchSchema.optional(),
  claw: clawSettingsPatchSchema.optional(),
  schedule: scheduleSettingsPatchSchema.optional(),
  guiUpdate: z.object({
    channel: z.enum(GUI_UPDATE_CHANNELS).optional()
  }).strict().optional()
}).strict()

export const settingsPatchSchema = z.preprocess(stripLegacySettingsPatchKeys, settingsPatchObjectSchema)

export const skillSaveFilePayloadSchema = z
  .object({
    rootPath: trimmedString(MAX_PATH_LENGTH),
    skillName: trimmedString(128),
    content: z.string().max(MAX_SKILL_FILE_BYTES)
  })
  .strict()

export const skillListPayloadSchema = z
  .object({
    workspaceRoot: z.string().trim().max(MAX_PATH_LENGTH).optional()
  })
  .strict()

export const rootPathSchema = trimmedString(MAX_PATH_LENGTH)
export const deepseekConfigContentSchema = z.string().max(MAX_CONFIG_FILE_BYTES)

export const workspaceRootSchema = trimmedString(MAX_PATH_LENGTH)
export const gitBranchPayloadSchema = z
  .object({
    workspaceRoot: workspaceRootSchema,
    branch: trimmedString(MAX_BRANCH_LENGTH)
  })
  .strict()

export const openEditorPathPayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
    editorId: optionalTrimmedString(MAX_EDITOR_ID_LENGTH),
    line: z.number().int().positive().max(1_000_000).optional(),
    column: z.number().int().positive().max(1_000_000).optional()
  })
  .strict()

export const workspaceFileTargetPayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
    line: z.number().int().positive().max(1_000_000).optional(),
    column: z.number().int().positive().max(1_000_000).optional()
  })
  .strict()

export const workspaceDirectoryTargetPayloadSchema = z
  .object({
    path: optionalTrimmedString(MAX_PATH_LENGTH),
    workspaceRoot: trimmedString(MAX_PATH_LENGTH)
  })
  .strict()

export const workspaceFileWritePayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
    content: z.string().max(MAX_BODY_BYTES)
  })
  .strict()

export const workspaceFileCreatePayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: trimmedString(MAX_PATH_LENGTH),
    content: z.string().max(MAX_BODY_BYTES).optional()
  })
  .strict()

export const workspaceDirectoryCreatePayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: trimmedString(MAX_PATH_LENGTH)
  })
  .strict()

export const workspaceClipboardImageSavePayloadSchema = z
  .object({
    workspaceRoot: trimmedString(MAX_PATH_LENGTH),
    currentFilePath: trimmedString(MAX_PATH_LENGTH),
    imageDirectory: optionalTrimmedString(MAX_PATH_LENGTH)
  })
  .strict()

export const workspaceEntryRenamePayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: trimmedString(MAX_PATH_LENGTH),
    newName: trimmedString(255)
  })
  .strict()

export const workspaceEntryDeletePayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: trimmedString(MAX_PATH_LENGTH)
  })
  .strict()

export const workspaceFileWatchPayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: trimmedString(MAX_PATH_LENGTH)
  })
  .strict()

export const writeExportPayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
    format: z.enum(WRITE_EXPORT_FORMATS),
    content: z.string().max(MAX_BODY_BYTES)
  })
  .strict()

export const writeRichClipboardPayloadSchema = z
  .object({
    path: trimmedString(MAX_PATH_LENGTH),
    workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
    content: z.string().max(MAX_BODY_BYTES)
  })
  .strict()

const writeInlineEditRecentEditSchema = z
  .object({
    source: z.enum(['user', 'inline-edit']),
    ageMs: z.number().int().min(0).max(24 * 60 * 60 * 1_000),
    filePath: optionalTrimmedString(MAX_PATH_LENGTH),
    from: z.number().int().min(0).max(MAX_BODY_BYTES),
    to: z.number().int().min(0).max(MAX_BODY_BYTES),
    deletedText: z.string().max(8_000),
    insertedText: z.string().max(8_000),
    beforeContext: z.string().max(4_000),
    afterContext: z.string().max(4_000),
    instruction: z.string().trim().min(1).max(10_000).optional(),
    scopeKind: z.enum(['selection', 'paragraph']).optional()
  })
  .strict()
  .refine((edit) => edit.to >= edit.from, {
    message: 'Recent edit end must be greater than or equal to start.'
  })

const writeInlineCompletionEditCandidateSchema = z
  .object({
    kind: z.enum(['selection', 'paragraph']),
    from: z.number().int().min(0).max(MAX_BODY_BYTES),
    to: z.number().int().min(0).max(MAX_BODY_BYTES),
    startLine: z.number().int().positive().max(1_000_000),
    startColumn: z.number().int().positive().max(1_000_000),
    endLine: z.number().int().positive().max(1_000_000),
    endColumn: z.number().int().positive().max(1_000_000),
    original: z.string().max(MAX_EDITOR_COMPLETION_TEXT),
    selectedText: z.string().max(50_000).optional()
  })
  .strict()
  .refine((scope) => scope.to >= scope.from, {
    message: 'Completion edit candidate end must be greater than or equal to start.'
  })

export const writeInlineCompletionPayloadSchema = z
  .object({
    prefix: z.string().max(MAX_EDITOR_COMPLETION_TEXT),
    suffix: z.string().max(MAX_EDITOR_COMPLETION_TEXT),
    mode: z.enum(['short', 'long', 'edit']).optional(),
    workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
    currentFilePath: optionalTrimmedString(MAX_PATH_LENGTH),
    cursor: z
      .object({
        line: z.number().int().positive().max(1_000_000),
        column: z.number().int().min(0).max(1_000_000)
      })
      .strict(),
    context: z
      .object({
        language: trimmedString(64),
        currentLinePrefix: z.string().max(20_000),
        currentLineSuffix: z.string().max(20_000),
        previousLine: z.string().max(20_000),
        previousNonEmptyLine: z.string().max(20_000),
        nextLine: z.string().max(20_000),
        indentation: z.string().max(2_000),
        signals: z
          .object({
            list: z.boolean(),
            quote: z.boolean(),
            heading: z.boolean(),
            table: z.boolean(),
            atLineEnd: z.boolean(),
            endsWithSentencePunctuation: z.boolean(),
            previousLineEndsWithSentencePunctuation: z.boolean(),
            prefersNewLineCompletion: z.boolean(),
            paragraphBreakOpportunity: z.boolean()
          })
          .strict()
      })
      .strict(),
    policy: z
      .object({
        name: trimmedString(128),
        instruction: z.string().max(50_000),
        acceptanceCriteria: z.array(z.string().max(5_000)).max(12),
        rejectionCriteria: z.array(z.string().max(5_000)).max(12)
      })
      .strict(),
    preview: z
      .object({
        local: z.string().max(5_000),
        documentTail: z.string().max(20_000)
      })
      .strict(),
    editCandidate: writeInlineCompletionEditCandidateSchema.optional(),
    recentEdits: z.array(writeInlineEditRecentEditSchema).max(12).optional(),
    model: optionalTrimmedString(128)
  })
  .strict()

export const shellOpenExternalUrlSchema = trimmedString(MAX_URL_LENGTH).refine(
  isSafeOpenExternalUrl,
  { message: 'Only http, https, and mailto URLs are allowed.' }
)

export const knowledgeOpenFilePayloadSchema = z.object({
  path: trimmedString(MAX_PATH_LENGTH)
}).strict()

export const notificationPayloadSchema = z
  .object({
    threadId: optionalTrimmedString(MAX_ID_LENGTH),
    title: trimmedString(MAX_NOTIFICATION_TITLE_LENGTH),
    body: trimmedString(MAX_NOTIFICATION_BODY_LENGTH)
  })
  .strict()

export const guiUpdateChannelSchema = z.enum(GUI_UPDATE_CHANNELS).optional()

export const desktopCommandSchema = z.enum(DESKTOP_COMMANDS)


export const logErrorPayloadSchema = z
  .object({
    category: trimmedString(128),
    message: trimmedString(2_000),
    detail: z.unknown().optional()
  })
  .strict()

export const clawMirrorPayloadSchema = z
  .object({
    threadId: trimmedString(MAX_ID_LENGTH),
    text: z.string().trim().min(1).max(MAX_CHANNEL_TEXT_LENGTH),
    direction: z.enum(['user', 'assistant'])
  })
  .strict()

export const clawTaskFromTextPayloadSchema = z
  .object({
    text: z.string().trim().min(1).max(MAX_CHANNEL_TEXT_LENGTH),
    channelId: z.string().trim().min(1).max(MAX_ID_LENGTH).nullable().optional(),
    modelHint: z.string().trim().min(1).max(128).nullable().optional(),
    mode: z.enum(['agent', 'plan']).nullable().optional()
  })
  .strict()

export const scheduleTaskFromTextPayloadSchema = z
  .object({
    text: z.string().trim().min(1).max(MAX_CHANNEL_TEXT_LENGTH),
    workspaceRoot: defaultPathSchema,
    modelHint: z.string().trim().min(1).max(128).nullable().optional(),
    mode: z.enum(['agent', 'plan']).nullable().optional()
  })
  .strict()

export const clawImInstallPollPayloadSchema = z
  .object({
    provider: clawImProviderSchema,
    deviceCode: trimmedString(MAX_DEVICE_CODE_LENGTH)
  })
  .strict()

export const sseStartPayloadSchema = z
  .object({
    threadId: trimmedString(MAX_ID_LENGTH),
    sinceSeq: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
    streamId: optionalTrimmedString(MAX_ID_LENGTH)
  })
  .strict()

export const documentGenerationPayloadSchema = z
  .object({
    templateName: z.string().min(1).max(200),
    templateDescription: z.string().max(2000),
    templateContent: z.string().max(50_000),
    fields: z
      .array(
        z.object({
          id: z.string().max(200),
          label: z.string().max(200),
          type: z.string().max(50),
          value: z.string().max(10_000),
          required: z.boolean().optional()
        })
      )
      .max(200),
    legalBasis: z.array(z.string().max(1000)).max(50).optional()
  })
  .strict()

export const streamIdSchema = trimmedString(MAX_ID_LENGTH)

export const userTemplateSchema = z
  .object({
    id: z.string().min(1).max(200),
    name: z.string().min(1).max(200),
    description: z.string().max(2000),
    category: z.literal('custom'),
    content: z.string().max(50_000),
    fields: z
      .array(
        z.object({
          id: z.string().min(1).max(200),
          label: z.string().min(1).max(200),
          type: z.enum(['text', 'textarea', 'date', 'select', 'array']),
          placeholder: z.string().max(1000).optional(),
          options: z.array(z.string().max(200)).max(100).optional(),
          required: z.boolean().optional()
        })
      )
      .max(200),
    legalBasis: z.array(z.string().max(1000)).max(50).optional(),
    sourceFile: z.string().max(1000).optional(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
  .strict()

export const templateLearningRequestSchema = z
  .object({
    fileContent: z.string().min(1).max(100_000),
    fileName: z.string().min(1).max(500),
    suggestedName: z.string().max(200).optional()
  })
  .strict()

export const templateGenerateWithMaterialsRequestSchema = z
  .object({
    template: z.object({
      id: z.string().max(200).optional(),
      name: z.string().min(1).max(200),
      description: z.string().max(2000),
      content: z.string().min(1).max(50_000),
      fields: z
        .array(
          z.object({
            id: z.string().min(1).max(200),
            label: z.string().min(1).max(200),
            type: z.enum(['text', 'textarea', 'date', 'select', 'array']),
            placeholder: z.string().max(1000).optional(),
            options: z.array(z.string().max(200)).max(100).optional(),
            required: z.boolean().optional()
          })
        )
        .max(200),
      legalBasis: z.array(z.string().max(1000)).max(50).optional()
    }),
    fieldValues: z.record(z.string(), z.string().max(50_000)),
    materials: z
      .array(
        z.object({
          fileName: z.string().max(500),
          content: z.string().max(100_000)
        })
      )
      .max(20)
      .optional(),
    instructions: z.string().max(5000).optional()
  })
  .strict()

export const documentHistoryRecordSchema = z
  .object({
    id: z.string().min(1).max(200),
    templateName: z.string().min(1).max(200),
    templateCategory: z.string().max(50),
    templateSource: z.enum(['builtin', 'custom']),
    fieldValues: z.record(z.string(), z.string().max(50_000)),
    materialFileNames: z.array(z.string().max(500)).max(50),
    instructions: z.string().max(10_000),
    generatedContent: z.string().min(1).max(200_000),
    model: z.string().max(200).optional(),
    createdAt: z.string()
  })
  .strict()
