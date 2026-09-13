import type {
  AppSettingsPatch,
  AppSettingsV1,
  ClawRunResult,
  ClawTaskFromTextResult,
  ClawRuntimeStatus,
  ScheduleRunResult,
  ScheduleRuntimeStatus,
  ScheduleTaskFromTextResult
} from './app-settings'
import type { EditorListResult, EditorOpenResult, OpenEditorPathOptions } from './editor'
import type { GitBranchesResult } from './git-branches'
import type {
  GuiUpdateChannel,
  GuiUpdateDownloadResult,
  GuiUpdateInfo,
  GuiUpdateInstallResult,
  GuiUpdateState
} from './gui-update'
import type {
  ClipboardImageReadResult,
  WorkspaceClipboardImageSavePayload,
  WorkspaceClipboardImageSaveResult,
  WorkspaceFileReadResult,
  WorkspaceBinaryReadResult,
  WorkspaceImageReadResult,
  WorkspaceDirectoryCreatePayload,
  WorkspaceDirectoryCreateResult,
  WorkspaceDirectoryListResult,
  WorkspaceDirectoryTarget,
  WorkspaceEntryRenamePayload,
  WorkspaceEntryRenameResult,
  WorkspaceEntryDeletePayload,
  WorkspaceEntryDeleteResult,
  WorkspaceFileChangePayload,
  WorkspaceFileCreatePayload,
  WorkspaceFileCreateResult,
  WorkspaceFileResolveResult,
  WorkspaceFileTarget,
  WorkspaceFileWatchPayload,
  WorkspaceFileWatchResult,
  WorkspaceFileWritePayload,
  WorkspaceFileWriteResult
} from './workspace-file'
import type {
  WriteInlineCompletionDebugEntry,
  WriteInlineCompletionRequest,
  WriteInlineCompletionResult
} from './write-inline-completion'
import type {
  DocumentGenerationRequest,
  DocumentGenerationResult
} from './document-generation'
import type {
  UserTemplate,
  TemplateLearningRequest,
  TemplateLearningResult,
  TemplateSourceSaveRequest,
  TemplateSourceSaveResult,
  TemplateGenerateWithMaterialsRequest,
  TemplateGenerateWithMaterialsResult
} from './user-templates'
import type {
  DocumentHistoryRecord,
  DocumentHistorySummary,
  HistoryActionResult
} from './document-history'
import type {
  WriteExportPayload,
  WriteExportResult,
  WriteRichClipboardPayload,
  WriteRichClipboardResult
} from './write-export'

export type RuntimeRequestResult = { ok: boolean; status: number; body: string }
export type CodexModelSummary = {
  id: string
  displayName: string
  description: string
  isDefault: boolean
}
export type CodexQuotaWindow = {
  usedPercent: number
  windowDurationMins: number
  resetsAt: number | null
}
export type CodexQuotaBucket = {
  limitId: string
  limitName: string | null
  planType: string | null
  primary: CodexQuotaWindow | null
  secondary: CodexQuotaWindow | null
  credits: {
    hasCredits: boolean
    unlimited: boolean
    balance: string | null
  } | null
  rateLimitReachedType: string | null
}
export type CodexQuotaStatus = {
  buckets: CodexQuotaBucket[]
  resetCreditsAvailable: number
}
export type CodexAuthStatus = {
  available: boolean
  loggedIn: boolean
  authMode: 'chatgpt' | 'api_key' | 'none'
  email: string | null
  planType: string | null
  credentialSource: 'local' | 'legalwork' | 'none'
  binaryPath: string
  models: CodexModelSummary[]
  quota: CodexQuotaStatus | null
  message?: string
}
export type CodexAuthActionResult =
  | { ok: true; status: CodexAuthStatus }
  | { ok: false; message: string }
export type DataComplianceStatus =
  | {
      ok: true
      running: boolean
      installing: boolean
      baseUrl: string
      message?: string
    }
  | {
      ok: false
      running: false
      installing: boolean
      baseUrl: string
      message: string
    }

export type DataComplianceInstallProgress = {
  step: 'detecting' | 'venv' | 'installing' | 'done' | 'error'
  percent: number
  message: string
}
export type DataComplianceRequestResult = {
  ok: boolean
  status: number
  body: string
  contentType?: string
}
export type DataComplianceSubmitPayload = {
  mode: 'review' | 'desensitize'
  documentName?: string
  inputText?: string
  reviewType?: 'document' | 'code'
  outputDir?: string
  outputFormat?: 'md' | 'docx' | 'pdf' | 'txt'
  redactionMode?: 'standard' | 'agent_enhanced'
  file?: {
    name: string
    type?: string
    dataBase64?: string
    filePath?: string
  }
  files?: Array<{
    name: string
    type?: string
    dataBase64?: string
    filePath?: string
  }>
}
export type DataComplianceDownloadResult =
  | { ok: true; dataBase64: string; filename: string; contentType: string }
  | { ok: false; message: string }
export type WorkspacePickResult = { canceled: boolean; path: string | null }
export type PathOpenResult = { ok: boolean; message?: string }
export type KnowledgeUploadFileResult =
  | { ok: true; path: string; sizeBytes: number }
  | { ok: false; message: string }
export type AttachmentFileUploadPayload = {
  name: string
  mimeType?: string
  threadId?: string
  workspace?: string
}
export const DESKTOP_COMMANDS = [
  'undo',
  'redo',
  'cut',
  'copy',
  'paste',
  'selectAll',
  'reload',
  'zoomIn',
  'zoomOut',
  'resetZoom',
  'toggleDevTools',
  'minimize',
  'toggleMaximize',
  'close',
  'quit'
] as const
export type DesktopCommand = typeof DESKTOP_COMMANDS[number]
export type SkillSaveResult = { ok: true; path: string } | { ok: false; message: string }
export type SkillReadResult = { ok: true; path: string; content: string } | { ok: false; message: string }
export type SkillImportResult =
  | {
      ok: true
      userSkillRoot: string
      installed: Array<{ name: string; path: string; replaced: boolean }>
    }
  | { ok: false; canceled?: boolean; message: string }
export type SkillListItem = {
  id: string
  name: string
  description?: string
  root: string
  entryPath: string
  scope: 'project' | 'global' | 'builtin'
  legacy: boolean
  userInstalled?: boolean
}
export type SkillListResult =
  | { ok: true; skills: SkillListItem[]; validationErrors: Array<{ root: string; message: string }> }
  | { ok: false; message: string }
export type SkillHubSkillSummary = {
  slug: string
  name: string
  description: string
  category: string
  downloads: number
  installs: number
  stars: number
  score: number
  version: string
  namespace: string
  namespaceDisplayName: string
  iconUrl?: string
  tags: string[]
}
export type SkillHubCatalogCategory = 'legal' | 'office' | 'learning'
export type SkillHubListRequest = {
  category: SkillHubCatalogCategory
  page: number
  pageSize?: number
}
export type SkillHubListResult =
  | {
      ok: true
      skills: SkillHubSkillSummary[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  | { ok: false; message: string }
export type SkillHubInstallRequest = {
  slug: string
  namespace: string
  version?: string
  targetRoot: string
}
export type SkillHubInstallResult = SkillImportResult
export type LegalworkConfigFileResult = { path: string; content: string; exists: boolean }
export type LegalworkConfigSaveResult = { ok: true; path: string }
export type OptionalMcpInstallResult =
  | { ok: true; packageId: 'flint-chart'; version: string }
  | { ok: false; message: string }
export type LearningIterationStatus =
  | 'disabled'
  | 'idle'
  | 'waiting'
  | 'running'
  | 'completed'
  | 'failed'
  | 'rolled_back'

export type LearningIterationCounts = {
  sources: number
  threads: number
  knowledgeFiles: number
  uploadedFiles: number
  generatedFiles: number
  memoriesCreated: number
  memoriesUpdated: number
  memoriesDisabled: number
  skillsCreated: number
  skillsUpdated: number
  knowledgeNotesCreated: number
  knowledgeNotesUpdated: number
  rejected: number
}

export type LearningIterationRecordSummary = {
  id: string
  title: string
  displayName: string
  status: LearningIterationStatus
  startedAt: string
  finishedAt: string
  reportPath: string
  canRollback: boolean
  rolledBackAt?: string
  error?: string
  counts: LearningIterationCounts
}

export type LearningIterationReportItem = {
  title: string
  detail: string
}

export type LearningIterationUserReport = {
  overview: string
  learned: LearningIterationReportItem[]
  improvements: LearningIterationReportItem[]
  nextTime: string[]
}

export type LearningIterationRecordDetail = {
  summary: LearningIterationRecordSummary
  reportMarkdown: string
  userReport: LearningIterationUserReport
}

export type LearningIterationRuntimeStatus = {
  status: LearningIterationStatus
  enabled: boolean
  eligibleToday: boolean
  queued: boolean
  running: boolean
  message: string
  lastSuccessfulAt: string
  lastCheckedAt: string
  nextEligibleAt: string
  baselineComplete: boolean
  baselineProgress: number
  pendingSourceCount: number
  activeRunId?: string
  latest?: LearningIterationRecordSummary
}

export type LearningIterationActionResult =
  | { ok: true; message: string; record?: LearningIterationRecordSummary }
  | { ok: false; message: string }

export type LearningIterationListResult =
  | { ok: true; records: LearningIterationRecordSummary[] }
  | { ok: false; message: string }

export type LearningIterationDetailResult =
  | { ok: true; detail: LearningIterationRecordDetail }
  | { ok: false; message: string }
export type TurnCompleteNotificationPayload = {
  threadId?: string
  title: string
  body: string
}
export type SystemNotificationResult =
  | { ok: true; shown: boolean; reason?: string }
  | { ok: false; message: string }
export type ClawChannelActivityPayload = {
  channelId: string
  threadId: string
}
export type ClawChannelMirrorResult =
  | { ok: true }
  | { ok: false; message: string }
export type UpstreamModelsResult =
  | { ok: true; modelIds: string[]; modelGroups?: ModelProviderModelGroup[] }
  | { ok: false; message: string }
export type EndpointModelsResult =
  | { ok: true; modelIds: string[] }
  | { ok: false; message: string }
export type EndpointModelsOptions = {
  providerId?: string
  endpointFormat?: string
}
export type ModelProviderModelGroup = {
  providerId: string
  label: string
  modelIds: string[]
}
export type ClawImInstallQrResult =
  | { ok: true; url: string; deviceCode: string; userCode: string; interval: number; expireIn: number }
  | { ok: false; message: string }
export type ClawImInstallPollResult =
  | { done: true; kind: 'feishu'; appId: string; appSecret: string; domain: string }
  | { done: true; kind: 'weixin'; accountId: string; sessionKey: string }
  | { done: false; error?: string }
export type SseEventPayload = { streamId: string; data: unknown }
export type SseEndPayload = { streamId: string }
export type SseErrorPayload = { streamId: string; status?: number; message?: string }

export type LegalResearchExportResult =
  | { ok: true; path: string; formatPreserved?: boolean; warning?: string }
  | { ok: false; canceled: true; message?: string }
  | { ok: false; canceled: false; message: string }

export type LegalResearchExportPayload = {
  html?: string
  markdown?: string
  templateId?: string
  templateName?: string
  defaultName: string
}

export type MarkdownDocumentExportPayload = {
  markdown: string
  defaultName: string
}

export type MarkdownDocumentExportResult =
  | { ok: true; path: string }
  | { ok: false; canceled: true; message?: string }
  | { ok: false; canceled: false; message: string }

export type DocumentMaterialExtractionPayload = {
  fileName: string
  mimeType?: string
  dataBase64: string
}

export type DocumentMaterialExtractionResult =
  | { ok: true; content: string }
  | { ok: false; message: string }

export type DsGuiApi = {
  platform: string
  getSettings: () => Promise<AppSettingsV1>
  setSettings: (partial: AppSettingsPatch) => Promise<AppSettingsV1>
  getLocalFilePath: (file: File) => string
  runtimeRequest: (path: string, method?: string, body?: string) => Promise<RuntimeRequestResult>
  reconnectRuntime: () => Promise<AppSettingsV1>
  getCodexAuthStatus: (refreshToken?: boolean) => Promise<CodexAuthStatus>
  loginCodexWithChatGpt: () => Promise<CodexAuthActionResult>
  logoutCodex: () => Promise<CodexAuthActionResult>
  getDataComplianceStatus: () => Promise<DataComplianceStatus>
  installDataCompliance: () => Promise<boolean>
  dataComplianceRequest: (
    path: string,
    method?: 'GET' | 'POST' | 'DELETE',
    body?: string
  ) => Promise<DataComplianceRequestResult>
  submitDataComplianceTask: (
    payload: DataComplianceSubmitPayload
  ) => Promise<DataComplianceRequestResult>
  downloadDataComplianceFile: (
    taskId: string,
    fileKey: string
  ) => Promise<DataComplianceDownloadResult>
  fetchUpstreamModels: () => Promise<UpstreamModelsResult>
  fetchEndpointModels: (
    baseUrl: string,
    apiKey: string,
    options?: EndpointModelsOptions
  ) => Promise<EndpointModelsResult>
  getClawStatus: () => Promise<ClawRuntimeStatus>
  runClawTask: (taskId: string) => Promise<ClawRunResult>
  getScheduleStatus: () => Promise<ScheduleRuntimeStatus>
  runScheduleTask: (taskId: string) => Promise<ScheduleRunResult>
  getLearningIterationStatus: () => Promise<LearningIterationRuntimeStatus>
  listLearningIterations: () => Promise<LearningIterationListResult>
  getLearningIteration: (id: string) => Promise<LearningIterationDetailResult>
  queueLearningIteration: () => Promise<LearningIterationActionResult>
  cancelLearningIteration: () => Promise<LearningIterationActionResult>
  rollbackLearningIteration: (id: string) => Promise<LearningIterationActionResult>
  startClawImInstallQr: (
    provider: 'feishu' | 'weixin',
    options?: { isLark?: boolean }
  ) => Promise<ClawImInstallQrResult>
  pollClawImInstall: (
    provider: 'feishu' | 'weixin',
    deviceCode: string
  ) => Promise<ClawImInstallPollResult>
  pickWorkspaceDirectory: (defaultPath?: string) => Promise<WorkspacePickResult>
  listSkills: (workspaceRoot?: string) => Promise<SkillListResult>
  readSkillFile: (rootPath: string, entryPath: string) => Promise<SkillReadResult>
  saveSkillFile: (rootPath: string, skillName: string, content: string) => Promise<SkillSaveResult>
  importSkill: () => Promise<SkillImportResult>
  listSkillHubSkills: (request: SkillHubListRequest) => Promise<SkillHubListResult>
  installSkillHubSkill: (request: SkillHubInstallRequest) => Promise<SkillHubInstallResult>
  openSkillRoot: (rootPath: string) => Promise<PathOpenResult>
  getDeepseekConfigFile: () => Promise<LegalworkConfigFileResult>
  setDeepseekConfigFile: (content: string) => Promise<LegalworkConfigSaveResult>
  installOptionalMcpPackage: (packageId: 'flint-chart') => Promise<OptionalMcpInstallResult>
  openDeepseekConfigDir: () => Promise<PathOpenResult>
  getGitBranches: (workspaceRoot: string) => Promise<GitBranchesResult>
  switchGitBranch: (workspaceRoot: string, branch: string) => Promise<GitBranchesResult>
  createAndSwitchGitBranch: (workspaceRoot: string, branch: string) => Promise<GitBranchesResult>
  listEditors: () => Promise<EditorListResult>
  openEditorPath: (options: OpenEditorPathOptions) => Promise<EditorOpenResult>
  listWorkspaceDirectory: (options: WorkspaceDirectoryTarget) => Promise<WorkspaceDirectoryListResult>
  resolveWorkspaceFile: (options: WorkspaceFileTarget) => Promise<WorkspaceFileResolveResult>
  readWorkspaceFile: (options: WorkspaceFileTarget) => Promise<WorkspaceFileReadResult>
  readWorkspaceBinary: (options: WorkspaceFileTarget) => Promise<WorkspaceBinaryReadResult>
  readWorkspaceImage: (options: WorkspaceFileTarget) => Promise<WorkspaceImageReadResult>
  writeWorkspaceFile: (payload: WorkspaceFileWritePayload) => Promise<WorkspaceFileWriteResult>
  createWorkspaceFile: (payload: WorkspaceFileCreatePayload) => Promise<WorkspaceFileCreateResult>
  createWorkspaceDirectory: (
    payload: WorkspaceDirectoryCreatePayload
  ) => Promise<WorkspaceDirectoryCreateResult>
  saveWorkspaceClipboardImage: (
    payload: WorkspaceClipboardImageSavePayload
  ) => Promise<WorkspaceClipboardImageSaveResult>
  readClipboardImage: () => Promise<ClipboardImageReadResult>
  renameWorkspaceEntry: (
    payload: WorkspaceEntryRenamePayload
  ) => Promise<WorkspaceEntryRenameResult>
  deleteWorkspaceEntry: (
    payload: WorkspaceEntryDeletePayload
  ) => Promise<WorkspaceEntryDeleteResult>
  watchWorkspaceFile: (payload: WorkspaceFileWatchPayload) => Promise<WorkspaceFileWatchResult>
  unwatchWorkspaceFile: (watchId: string) => Promise<boolean>
  onWorkspaceFileChanged: (handler: (payload: WorkspaceFileChangePayload) => void) => () => void
  requestWriteInlineCompletion: (
    payload: WriteInlineCompletionRequest
  ) => Promise<WriteInlineCompletionResult>
  generateDocument: (
    payload: DocumentGenerationRequest
  ) => Promise<DocumentGenerationResult>
  /** List all user-created templates */
  listUserTemplates: () => Promise<UserTemplate[]>
  /** Save a user template (create or update) */
  saveUserTemplate: (template: UserTemplate) => Promise<{ ok: true } | { ok: false; message: string }>
  /** Retain the original DOCX package for format-preserving export */
  saveUserTemplateSource: (
    payload: TemplateSourceSaveRequest
  ) => Promise<TemplateSourceSaveResult>
  /** Delete a user template */
  deleteUserTemplate: (id: string) => Promise<{ ok: true } | { ok: false; message: string }>
  /** AI-learn from an uploaded document to create a template */
  learnTemplateFromFile: (
    payload: TemplateLearningRequest
  ) => Promise<TemplateLearningResult>
  /** Generate document from a user template + materials */
  generateDocumentFromTemplate: (
    payload: TemplateGenerateWithMaterialsRequest
  ) => Promise<TemplateGenerateWithMaterialsResult>
  /** Extract plain text from an uploaded case material */
  extractDocumentMaterial: (
    payload: DocumentMaterialExtractionPayload
  ) => Promise<DocumentMaterialExtractionResult>
  /** List document generation history summaries */
  listDocumentHistory: () => Promise<DocumentHistorySummary[]>
  /** Get a full history record by id */
  getDocumentHistoryRecord: (id: string) => Promise<DocumentHistoryRecord | null>
  /** Save a new generation history record */
  saveDocumentHistoryRecord: (record: DocumentHistoryRecord) => Promise<HistoryActionResult>
  /** Delete a history record */
  deleteDocumentHistoryRecord: (id: string) => Promise<HistoryActionResult>
  /** Clear all history */
  clearDocumentHistory: () => Promise<HistoryActionResult>
  listWriteInlineCompletionDebugEntries: () => Promise<WriteInlineCompletionDebugEntry[]>
  clearWriteInlineCompletionDebugEntries: () => Promise<boolean>
  exportWriteDocument: (payload: WriteExportPayload) => Promise<WriteExportResult>
  copyWriteDocumentAsRichText: (
    payload: WriteRichClipboardPayload
  ) => Promise<WriteRichClipboardResult>
  exportLegalResearchToWord: (
    payload: LegalResearchExportPayload
  ) => Promise<LegalResearchExportResult>
  exportMarkdownDocument: (
    payload: MarkdownDocumentExportPayload
  ) => Promise<MarkdownDocumentExportResult>
  startSse: (threadId: string, sinceSeq: number, streamId?: string) => Promise<{ streamId: string }>
  stopSse: (streamId: string) => Promise<boolean>
  onSseEvent: (handler: (payload: SseEventPayload) => void) => () => void
  onSseEnd: (handler: (payload: SseEndPayload) => void) => () => void
  onSseError: (handler: (payload: SseErrorPayload) => void) => () => void
  onClawChannelActivity: (handler: (payload: ClawChannelActivityPayload) => void) => () => void
  mirrorClawChannelMessage: (
    threadId: string,
    text: string,
    direction: 'user' | 'assistant'
  ) => Promise<ClawChannelMirrorResult>
  mirrorClawChannelMessageToFeishu: (
    threadId: string,
    text: string,
    direction: 'user' | 'assistant'
  ) => Promise<ClawChannelMirrorResult>
  createClawTaskFromText: (
    text: string,
    options?: { channelId?: string; modelHint?: string; mode?: 'agent' | 'plan' }
  ) => Promise<ClawTaskFromTextResult>
  createScheduleTaskFromText: (
    text: string,
    options?: { workspaceRoot?: string; modelHint?: string; mode?: 'agent' | 'plan' }
  ) => Promise<ScheduleTaskFromTextResult>
  runDesktopCommand: (command: DesktopCommand) => Promise<void>
  openExternal: (url: string) => Promise<void>
  openLocalPath: (path: string) => Promise<PathOpenResult>
  openKnowledgeFile: (path: string) => Promise<PathOpenResult>
  uploadKnowledgeFile: (file: File, targetPath: string) => Promise<KnowledgeUploadFileResult>
  uploadAttachmentFile: (file: File, payload: AttachmentFileUploadPayload) => Promise<RuntimeRequestResult>
  showTurnCompleteNotification: (
    payload: TurnCompleteNotificationPayload
  ) => Promise<SystemNotificationResult>
  getAppVersion: () => Promise<string>
  getGuiUpdateState: () => Promise<GuiUpdateState>
  checkGuiUpdate: (channel?: GuiUpdateChannel) => Promise<GuiUpdateInfo>
  downloadGuiUpdate: (channel?: GuiUpdateChannel) => Promise<GuiUpdateDownloadResult>
  installGuiUpdate: () => Promise<GuiUpdateInstallResult>
  onGuiUpdateState: (handler: (payload: GuiUpdateState) => void) => () => void
  onDataComplianceInstallProgress: (handler: (payload: DataComplianceInstallProgress) => void) => () => void
  logError: (category: string, message: string, detail?: unknown) => Promise<void>
  getLogPath: () => Promise<string>
  openLogDir: () => Promise<{ ok: boolean; message?: string }>

  // IMA 知识库认证
  imaAuthStatus: () => Promise<{ kind: string; auth?: { clientId?: string; apiKey?: string } }>
  imaLogin: () => Promise<{ ok: boolean; message?: string }>
  imaRelogin: () => Promise<{ ok: boolean; message?: string }>
  openPkulawConsole: () => Promise<{ ok: boolean; message?: string }>
  claimPkulawToken: () => Promise<{ ok: boolean; message?: string; alreadyClaimed?: boolean; needLogin?: boolean; pointsBefore?: string; pointsAfter?: string }>
  getPkulawAutoClaim: () => Promise<{ enabled: boolean; lastClaimDate: string | null }>
  setPkulawAutoClaim: (enabled: boolean) => Promise<{ enabled: boolean; lastClaimDate: string | null }>
  openYuandianConsole: () => Promise<{ ok: boolean; message?: string }>
  openWkConsole: () => Promise<{ ok: boolean; message?: string }>
  openTycConsole: () => Promise<{ ok: boolean; message?: string }>
  openQccConsole: () => Promise<{ ok: boolean; message?: string }>
  imaLogout: () => Promise<void>
  imaGetConfig: () => Promise<{
    cookie: boolean
    bkn: boolean
    loggedIn: boolean
    status: 'valid' | 'expired' | 'unverified' | 'network_error' | 'not_configured'
    message?: string
    knowledgeBaseCount: number
  }>
  imaGetMcpConfig: () => Promise<Record<string, unknown> | { error: string }>
  imaRefresh: () => Promise<{ ok: boolean; changed?: boolean; message?: string; status: string }>
}
