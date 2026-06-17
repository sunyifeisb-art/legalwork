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
  outputFormat?: 'md' | 'docx' | 'txt'
  file?: {
    name: string
    type?: string
    dataBase64: string
  }
}
export type DataComplianceDownloadResult =
  | { ok: true; dataBase64: string; filename: string; contentType: string }
  | { ok: false; message: string }
export type WorkspacePickResult = { canceled: boolean; path: string | null }
export type PathOpenResult = { ok: boolean; message?: string }
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
export type SkillListItem = {
  id: string
  name: string
  description?: string
  root: string
  entryPath: string
  scope: 'project' | 'global' | 'builtin'
  legacy: boolean
}
export type SkillListResult =
  | { ok: true; skills: SkillListItem[]; validationErrors: Array<{ root: string; message: string }> }
  | { ok: false; message: string }
export type LegalworkConfigFileResult = { path: string; content: string; exists: boolean }
export type LegalworkConfigSaveResult = { ok: true; path: string }
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
  | { ok: true; path: string }
  | { ok: false; canceled: true; message?: string }
  | { ok: false; canceled: false; message: string }

export type LegalResearchExportPayload = {
  html: string
  defaultName: string
}

export type DsGuiApi = {
  platform: string
  getSettings: () => Promise<AppSettingsV1>
  setSettings: (partial: AppSettingsPatch) => Promise<AppSettingsV1>
  runtimeRequest: (path: string, method?: string, body?: string) => Promise<RuntimeRequestResult>
  reconnectRuntime: () => Promise<AppSettingsV1>
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
  getClawStatus: () => Promise<ClawRuntimeStatus>
  runClawTask: (taskId: string) => Promise<ClawRunResult>
  getScheduleStatus: () => Promise<ScheduleRuntimeStatus>
  runScheduleTask: (taskId: string) => Promise<ScheduleRunResult>
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
  saveSkillFile: (rootPath: string, skillName: string, content: string) => Promise<SkillSaveResult>
  openSkillRoot: (rootPath: string) => Promise<PathOpenResult>
  getDeepseekConfigFile: () => Promise<LegalworkConfigFileResult>
  setDeepseekConfigFile: (content: string) => Promise<LegalworkConfigSaveResult>
  openDeepseekConfigDir: () => Promise<PathOpenResult>
  getGitBranches: (workspaceRoot: string) => Promise<GitBranchesResult>
  switchGitBranch: (workspaceRoot: string, branch: string) => Promise<GitBranchesResult>
  createAndSwitchGitBranch: (workspaceRoot: string, branch: string) => Promise<GitBranchesResult>
  listEditors: () => Promise<EditorListResult>
  openEditorPath: (options: OpenEditorPathOptions) => Promise<EditorOpenResult>
  listWorkspaceDirectory: (options: WorkspaceDirectoryTarget) => Promise<WorkspaceDirectoryListResult>
  resolveWorkspaceFile: (options: WorkspaceFileTarget) => Promise<WorkspaceFileResolveResult>
  readWorkspaceFile: (options: WorkspaceFileTarget) => Promise<WorkspaceFileReadResult>
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
  openKnowledgeFile: (path: string) => Promise<PathOpenResult>
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
}
