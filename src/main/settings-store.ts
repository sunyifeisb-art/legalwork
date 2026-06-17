import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { atomicWriteFile } from '../../legalwork/src/adapters/file/atomic-write.js'
import {
  applyLegalworkRuntimePatch,
  computeLegalworkRuntimeCredentialPatch,
  legalworkSettingsEnvelope,
  DEFAULT_GUI_UPDATE_CHANNEL,
  DEFAULT_WRITE_WORKSPACE_ROOT,
  defaultClawSettings,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  getLegalworkRuntimeSettings,
  getModelProviderProfile,
  mergeLegalworkRuntimeSettings,
  mergeModelProviderSettings,
  defaultWriteSettings,
  mergeClawSettings,
  mergeScheduleSettings,
  mergeWriteSettings,
  normalizeAppBehaviorSettings,
  normalizeKeyboardShortcuts,
  migrateLegacyAppSettings,
  normalizeAppSettings,
  type AppSettingsPatch,
  type AppSettingsV1,
  type ClawImChannelV1,
  type ClawImConversationV1
} from '../shared/app-settings'

export type { AppSettingsV1 }

const DEFAULT_WORKSPACE_ROOT = join(homedir(), '.legalwork', 'default_workspace')
const DEFAULT_CLAW_CHANNELS_ROOT = join(homedir(), '.legalwork', 'claw')
const DEFAULT_WRITE_WORKSPACE_ROOT_ABSOLUTE = expandHomePath(DEFAULT_WRITE_WORKSPACE_ROOT)
const SETTINGS_FILE_NAME = 'legalwork-settings.json'
const LEGACY_SETTINGS_FILE_NAME = 'deepseek-gui-settings.json'
const COMPATIBLE_USER_DATA_DIR_NAMES = ['legalwork', 'DeepSeek GUI', 'deepseek-gui'] as const
const WELCOME_MARKDOWN = `# Welcome to Write

This is your default writing workspace.

- Create Markdown drafts from the sidebar.
- Select text in the editor and ask the writing assistant about it.
- Switch between source, live, split, and preview modes from the top bar.
`

export function expandHomePath(raw: string | null | undefined): string {
  const value = typeof raw === 'string' ? raw.trim() : ''
  if (!value) return ''
  if (value === '~') return homedir()
  if (value.startsWith('~/') || value.startsWith('~\\')) {
    return join(homedir(), value.slice(2))
  }
  return value
}

function normalizeWorkspaceRoot(raw: string | null | undefined): string {
  return expandHomePath(raw) || DEFAULT_WORKSPACE_ROOT
}

function normalizeWriteWorkspaceRoot(raw: string | null | undefined): string {
  return expandHomePath(raw) || DEFAULT_WRITE_WORKSPACE_ROOT_ABSOLUTE
}

function sanitizePathSegment(raw: string | null | undefined, fallback: string): string {
  const value = typeof raw === 'string' ? raw.trim() : ''
  const sanitized = value
    .replace(/[\\/]/g, '-')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return sanitized || fallback
}

function defaultClawChannelWorkspaceRoot(channel: ClawImChannelV1): string {
  const credential = channel.platformCredential
  const domain = credential?.kind === 'feishu'
    ? credential.domain
    : credential?.kind === 'weixin'
      ? 'weixin'
      : channel.provider
  const credentialId = credential?.kind === 'feishu'
    ? credential.appId
    : credential?.kind === 'weixin'
      ? credential.accountId
      : ''
  const workspaceId = sanitizePathSegment(credentialId || channel.id, 'channel')
  return join(DEFAULT_CLAW_CHANNELS_ROOT, channel.provider, domain, workspaceId)
}

function normalizeClawChannelWorkspaceRoot(channel: ClawImChannelV1): string {
  return expandHomePath(channel.workspaceRoot) || defaultClawChannelWorkspaceRoot(channel)
}

function sanitizeConversationWorkspaceSegment(conversation: ClawImConversationV1): string {
  return sanitizePathSegment(
    conversation.remoteThreadId || conversation.chatId,
    conversation.id || 'conversation'
  )
}

function defaultClawConversationWorkspaceRoot(
  channel: ClawImChannelV1,
  conversation: ClawImConversationV1
): string {
  return join(normalizeClawChannelWorkspaceRoot(channel), 'conversations', sanitizeConversationWorkspaceSegment(conversation))
}

function normalizeClawConversationWorkspaceRoot(
  channel: ClawImChannelV1,
  conversation: ClawImConversationV1
): string {
  return expandHomePath(conversation.workspaceRoot) || defaultClawConversationWorkspaceRoot(channel, conversation)
}

function normalizeStoredSettings(settings: AppSettingsV1): AppSettingsV1 {
  const normalized = normalizeAppSettings(settings)
  const writeDefaultRoot = normalizeWriteWorkspaceRoot(normalized.write.defaultWorkspaceRoot)
  const writeActiveRoot = normalizeWriteWorkspaceRoot(normalized.write.activeWorkspaceRoot || writeDefaultRoot)
  const writeWorkspaces = [...new Set(
    [writeDefaultRoot, writeActiveRoot, ...normalized.write.workspaces.map(normalizeWriteWorkspaceRoot)]
      .filter(Boolean)
  )]
  return {
    ...normalized,
    workspaceRoot: normalizeWorkspaceRoot(normalized.workspaceRoot),
    write: {
      defaultWorkspaceRoot: writeDefaultRoot,
      activeWorkspaceRoot: writeWorkspaces.includes(writeActiveRoot) ? writeActiveRoot : writeDefaultRoot,
      workspaces: writeWorkspaces.length > 0 ? writeWorkspaces : [writeDefaultRoot],
      inlineCompletion: normalized.write.inlineCompletion
    },
    claw: {
      ...normalized.claw,
      channels: normalized.claw.channels.map((channel) => ({
        ...channel,
        workspaceRoot: normalizeClawChannelWorkspaceRoot(channel),
        conversations: channel.conversations.map((conversation) => ({
          ...conversation,
          workspaceRoot: normalizeClawConversationWorkspaceRoot(channel, conversation)
        }))
      }))
    }
  }
}

function serializeSettingsForDisk(settings: AppSettingsV1): string {
  return JSON.stringify(normalizeStoredSettings(settings), null, 2)
}

/** Tracks directories already confirmed to exist, avoiding redundant mkdir calls. */
const knownDirs = new Set<string>()

async function ensureDirExists(dir: string): Promise<void> {
  if (knownDirs.has(dir)) return
  await mkdir(dir, { recursive: true })
  knownDirs.add(dir)
}

export async function ensureWorkspaceRootExists(workspaceRoot: string): Promise<string> {
  const normalized = normalizeWorkspaceRoot(workspaceRoot)
  await ensureDirExists(normalized)
  return normalized
}

async function ensureWriteWorkspaceRootsExist(settings: AppSettingsV1): Promise<void> {
  for (const workspaceRoot of settings.write.workspaces) {
    if (!workspaceRoot) continue
    await ensureDirExists(workspaceRoot)
  }

  const welcomePath = join(settings.write.defaultWorkspaceRoot, 'welcome.md')
  try {
    await writeFile(welcomePath, WELCOME_MARKDOWN, { encoding: 'utf8', flag: 'wx' })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
  }
}

async function ensureClawChannelWorkspaceRootsExist(settings: AppSettingsV1): Promise<void> {
  for (const channel of settings.claw.channels) {
    const workspaceRoot = normalizeClawChannelWorkspaceRoot(channel)
    if (!workspaceRoot) continue
    await ensureDirExists(workspaceRoot)
    for (const conversation of channel.conversations) {
      const conversationWorkspaceRoot = normalizeClawConversationWorkspaceRoot(channel, conversation)
      if (!conversationWorkspaceRoot) continue
      await ensureDirExists(conversationWorkspaceRoot)
    }
  }
}

const defaultSettings = (): AppSettingsV1 => ({
  version: 1,
  locale: 'zh',
  theme: 'system',
  uiFontScale: 'small',
  provider: defaultModelProviderSettings(),
  agents: {
    legalwork: defaultLegalworkRuntimeSettings()
  },
  workspaceRoot: DEFAULT_WORKSPACE_ROOT,
  log: {
    enabled: true,
    retentionDays: 2
  },
  notifications: {
    turnComplete: true
  },
  appBehavior: normalizeAppBehaviorSettings(),
  keyboardShortcuts: normalizeKeyboardShortcuts(),
  guiUpdate: {
    channel: DEFAULT_GUI_UPDATE_CHANNEL
  },
  write: defaultWriteSettings(),
  claw: defaultClawSettings(),
  schedule: defaultScheduleSettings()
})

function buildMergedSettings(parsed: Partial<AppSettingsV1>): AppSettingsV1 {
  const migrated = migrateLegacyAppSettings(parsed)
  const defaults = defaultSettings()
  return {
    ...defaults,
    ...migrated,
    provider: mergeModelProviderSettings(defaults.provider, migrated.provider),
    agents: legalworkSettingsEnvelope(
      mergeLegalworkRuntimeSettings(getLegalworkRuntimeSettings(defaults), migrated.agents?.legalwork)
    ),
    log: { ...defaults.log, ...migrated.log },
    notifications: { ...defaults.notifications, ...migrated.notifications },
    appBehavior: normalizeAppBehaviorSettings({
      ...defaults.appBehavior,
      ...migrated.appBehavior
    }),
    keyboardShortcuts: normalizeKeyboardShortcuts(migrated.keyboardShortcuts),
    write: mergeWriteSettings(defaults.write, migrated.write),
    claw: mergeClawSettings(defaults.claw, migrated.claw),
    schedule: mergeScheduleSettings(defaults.schedule, migrated.schedule),
    guiUpdate: { ...defaults.guiUpdate, ...migrated.guiUpdate }
  }
}

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null
}

async function loadDefaultSettings(): Promise<AppSettingsV1> {
  const defaults = normalizeStoredSettings(defaultSettings())
  await ensureWorkspaceRootExists(defaults.workspaceRoot)
  await ensureWriteWorkspaceRootsExist(defaults)
  await ensureClawChannelWorkspaceRootsExist(defaults)
  return defaults
}

async function writeInvalidSettingsBackup(path: string, raw: string): Promise<string | null> {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = join(
    dirname(path),
    `${basename(path, '.json')}.invalid-${stamp}.json`
  )
  try {
    await writeFile(backupPath, raw, 'utf8')
    return backupPath
  } catch {
    return null
  }
}

function compatibleSettingsPaths(currentPath: string): string[] {
  const currentUserDataDir = dirname(currentPath)
  const currentDirName = basename(currentUserDataDir)
  const parentDir = dirname(currentUserDataDir)
  return [
    join(currentUserDataDir, LEGACY_SETTINGS_FILE_NAME),
    ...COMPATIBLE_USER_DATA_DIR_NAMES
      .filter((dirName) => dirName !== currentDirName)
      .flatMap((dirName) => [
        join(parentDir, dirName, SETTINGS_FILE_NAME),
        join(parentDir, dirName, LEGACY_SETTINGS_FILE_NAME)
      ])
  ].filter((path, index, paths) => path !== currentPath && paths.indexOf(path) === index)
}

async function readSettingsFileWithCompatibility(
  currentPath: string
): Promise<{ raw: string, sourcePath: string } | null> {
  try {
    return {
      raw: await readFile(currentPath, 'utf8'),
      sourcePath: currentPath
    }
  } catch (error) {
    if (!isErrnoException(error) || error.code !== 'ENOENT') throw error
  }

  for (const candidatePath of compatibleSettingsPaths(currentPath)) {
    try {
      return {
        raw: await readFile(candidatePath, 'utf8'),
        sourcePath: candidatePath
      }
    } catch (error) {
      if (isErrnoException(error) && error.code === 'ENOENT') continue
      throw error
    }
  }

  return null
}

export class JsonSettingsStore {
  private path: string
  private cache: AppSettingsV1 | null = null

  constructor(userDataPath: string) {
    this.path = join(userDataPath, SETTINGS_FILE_NAME)
  }

  async load(): Promise<AppSettingsV1> {
    if (this.cache) return this.cache

    let found: { raw: string, sourcePath: string } | null
    try {
      found = await readSettingsFileWithCompatibility(this.path)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to read settings file ${this.path}: ${message}`, { cause: error })
    }
    if (!found) {
      this.cache = await loadDefaultSettings()
      return this.cache
    }
    const { raw, sourcePath } = found

    let parsed: Partial<AppSettingsV1>
    try {
      parsed = JSON.parse(raw) as Partial<AppSettingsV1>
    } catch (error) {
      if (error instanceof SyntaxError) {
        const backupPath = await writeInvalidSettingsBackup(sourcePath, raw)
        const defaults = await loadDefaultSettings()
        await this.save(defaults)
        if (backupPath) {
          console.warn(
            `[legalwork] Invalid settings JSON was replaced with defaults. Backup: ${backupPath}`
          )
        } else {
          console.warn(
            `[legalwork] Invalid settings JSON was replaced with defaults. Backup could not be written for ${this.path}.`
          )
        }
        return defaults
      }
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to parse settings file ${sourcePath}: ${message}`, { cause: error })
    }

    const normalized = normalizeStoredSettings(buildMergedSettings(parsed))
    const runtime = getLegalworkRuntimeSettings(normalized)
    const activeProvider = getModelProviderProfile(normalized, runtime.providerId)
    const activeKey = activeProvider.apiKey.trim()
    // Only backfill an empty runtime API key when the file is not in the middle
    // of a legacy migration that moves the runtime key into the shared provider
    // settings. During that migration the runtime override is intentionally left
    // empty so it inherits from the selected provider profile at runtime.
    const hasTopLevelProvider = typeof parsed.provider === 'object' && parsed.provider !== null
    const hasRuntimeCredential =
      typeof parsed.agents?.legalwork?.apiKey === 'string' &&
      parsed.agents.legalwork.apiKey.trim().length > 0
    const migratingRuntimeCredentialToProvider = !hasTopLevelProvider && hasRuntimeCredential
    const needsBackfill = activeKey && !runtime.apiKey.trim() && !migratingRuntimeCredentialToProvider
    if (needsBackfill) {
      normalized.agents = legalworkSettingsEnvelope(
        mergeLegalworkRuntimeSettings(runtime, { apiKey: activeKey })
      )
    }
    await ensureWorkspaceRootExists(normalized.workspaceRoot)
    await ensureWriteWorkspaceRootsExist(normalized)
    await ensureClawChannelWorkspaceRootsExist(normalized)
    this.cache = normalized
    if (sourcePath !== this.path) {
      await this.save(normalized)
    }
    return this.cache
  }

  async save(data: AppSettingsV1): Promise<void> {
    const normalized = normalizeStoredSettings(data)
    await ensureWorkspaceRootExists(normalized.workspaceRoot)
    if (normalized.write.workspaces.length > 0 || normalized.claw.channels.length > 0) {
      await ensureWriteWorkspaceRootsExist(normalized)
      await ensureClawChannelWorkspaceRootsExist(normalized)
    }
    this.cache = normalized
    await ensureDirExists(dirname(this.path))
    await atomicWriteFile(this.path, serializeSettingsForDisk(normalized))
  }

  async patch(partial: AppSettingsPatch): Promise<AppSettingsV1> {
    const cur = await this.load()
    const { agents: agentsPatch, provider: providerPatch, ...restPatch } = partial
    const agentsPatchWithCredentials = computeLegalworkRuntimeCredentialPatch(cur, {
      agents: agentsPatch,
      provider: providerPatch
    })
    const next = normalizeStoredSettings({
      ...applyLegalworkRuntimePatch(cur, agentsPatchWithCredentials.legalwork),
      ...restPatch,
      provider: mergeModelProviderSettings(cur.provider, providerPatch),
      log: { ...cur.log, ...(partial.log ?? {}) },
      notifications: { ...cur.notifications, ...(partial.notifications ?? {}) },
      appBehavior: normalizeAppBehaviorSettings({
        ...cur.appBehavior,
        ...(partial.appBehavior ?? {})
      }),
      keyboardShortcuts: normalizeKeyboardShortcuts({
        bindings: {
          ...cur.keyboardShortcuts.bindings,
          ...(partial.keyboardShortcuts?.bindings ?? {})
        }
      }),
      write: mergeWriteSettings(cur.write, partial.write),
      claw: mergeClawSettings(cur.claw, partial.claw),
      schedule: mergeScheduleSettings(cur.schedule, partial.schedule),
      guiUpdate: { ...cur.guiUpdate, ...(partial.guiUpdate ?? {}) }
    })
    await this.save(next)
    return next
  }
}

export function getRuntimeBaseUrl(port: number): string {
  return `http://127.0.0.1:${port}`
}

export function devServerHintUrl(): string | undefined {
  return process.env.ELECTRON_RENDERER_URL
}
