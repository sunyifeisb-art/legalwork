import type { ReactElement } from 'react'
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { parseClawCommand } from '@shared/claw-commands'
import {
  findKeyboardShortcutCommand,
  keyboardEventToShortcut,
  resolveKeyboardShortcutBindings,
  type KeyboardShortcutCommandId
} from '@shared/keyboard-shortcuts'
import type { DesktopCommand, SkillListItem } from '@shared/ds-gui-api'
import type { ClipboardImageReadResult } from '@shared/workspace-file'
import type { AttachmentReference, ChatBlock, NormalizedThread } from '../agent/types'
import type { CoreRuntimeInfoJson, CoreRuntimeSkillJson } from '../agent/legalwork-contract'
import { getProvider } from '../agent/registry'
import { rendererRuntimeClient } from '../agent/runtime-client'
import { useChatStore } from '../store/chat-store'
import { isClawThread, isKnowledgeThread, isLegalResearchThread } from '../store/chat-store-helpers'
import { hasPendingRuntimeWork } from '../store/chat-store-runtime-helpers'
import {
  extractLatestTurnAutoOpenDevPreviewUrls,
  extractLatestTurnDevPreviewUrls
} from '../lib/dev-preview-detection'
import { Sidebar } from './chat/Sidebar'
import { WorkbenchTopBar, type RightPanelMode } from './chat/WorkbenchTopBar'
import { MessageTimeline } from './chat/MessageTimeline'
import { FloatingComposer, type ComposerFileReference } from './chat/FloatingComposer'
import {
  buildSelectedSkillPrompt,
  type ComposerSkillSelection
} from './chat/composer-skill-selection'
import {
  composerReasoningEffortRequestValue,
  type ComposerReasoningEffort
} from './chat/FloatingComposerModelPicker'
import { SideConversationPanel } from './chat/SideConversationPanel'
import { SessionHeader } from './SessionHeader'
import { SidebarTitlebarToggleButton } from './sidebar/SidebarPrimitives'
import { composeWritePrompt } from '../write/quoted-selection'
import { useWriteWorkspaceStore } from '../write/write-workspace-store'
import { isWriteThreadId } from '../write/write-thread-registry'
import { parseGuiPlanCommand } from '../plan/plan-command'
import { DevPreviewLaunchCard } from './DevPreviewLaunchCard'
import { RuntimeBanner } from './RuntimeBanner'
import { useWorkbenchLayout } from './workbench-layout'
import { useWorkbenchPlanController } from './workbench-plan-controller'
import type { DataComplianceSection, DesensitizeSection } from './data-compliance/DataCompliancePanel'
import { useLegalResearch } from './legal-research/useLegalResearch'
import {
  isImageFile,
  resolveAttachmentMimeType,
  resolveAttachmentUploadName,
  uploadAttachmentWithMemoryFallback
} from '../lib/image-attachment-upload'
import {
  isChatAttachmentUploadEnabled,
  resolveChatAttachmentCapabilities
} from '../lib/attachment-upload-availability'
import { normalizeWorkspaceRoot } from '../lib/workspace-path'
import { useKeyboardShortcutSettings } from '../lib/keyboard-shortcut-settings'
import { workspaceLabelFromPath } from '../lib/workspace-label'
import {
  buildComposerFileContextPrompt,
  mergeComposerFileReferences,
  type ComposerFileContextEntry
} from '../lib/composer-file-references'
import { DocumentWritingProvider } from './document-writing/DocumentWritingContext'
import { deriveConversationFiles, type ConversationFile } from '../lib/conversation-files'

const ChangeInspector = lazy(() =>
  import('./ChangeInspector').then((module) => ({ default: module.ChangeInspector }))
)
const DevBrowserPanel = lazy(() =>
  import('./DevBrowserPanel').then((module) => ({ default: module.DevBrowserPanel }))
)
const PluginMarketplaceView = lazy(() =>
  import('./PluginMarketplaceView').then((module) => ({ default: module.PluginMarketplaceView }))
)
const WorkspaceFilePreviewPanel = lazy(() =>
  import('./WorkspaceFilePreviewPanel').then((module) => ({
    default: module.WorkspaceFilePreviewPanel
  }))
)
const ConversationFilesPanel = lazy(() =>
  import('./ConversationFilesPanel').then((module) => ({
    default: module.ConversationFilesPanel
  }))
)
const ConversationFilesFloating = lazy(() =>
  import('./ConversationFilesPanel').then((module) => ({
    default: module.ConversationFilesFloating
  }))
)
const PlanPanel = lazy(() =>
  import('./plan/PlanPanel').then((module) => ({ default: module.PlanPanel }))
)
const TodoPanel = lazy(() =>
  import('./todo/TodoPanel').then((module) => ({ default: module.TodoPanel }))
)
const ScheduleTasksView = lazy(() =>
  import('./schedule/ScheduleTasksView').then((module) => ({ default: module.ScheduleTasksView }))
)
const DataCompliancePanel = lazy(() =>
  import('./data-compliance/DataCompliancePanel').then((module) => ({ default: module.DataCompliancePanel }))
)
const DesensitizationPanel = lazy(() =>
  import('./data-compliance/DataCompliancePanel').then((module) => ({ default: module.DesensitizationPanel }))
)
const DocumentWritingView = lazy(() =>
  import('./document-writing/DocumentWritingView').then((module) => ({ default: module.DocumentWritingView }))
)
const LegalResearchPanel = lazy(() =>
  import('./legal-research/LegalResearchPanel').then((module) => ({ default: module.LegalResearchPanel }))
)
const KnowledgeBaseView = lazy(() =>
  import('./knowledge-base/KnowledgeBaseView').then((module) => ({ default: module.KnowledgeBaseView }))
)
const LearningIterationView = lazy(() =>
  import('./learning-iteration/LearningIterationView').then((module) => ({
    default: module.LearningIterationView
  }))
)

const COMPOSER_FILE_CONTEXT_MAX_CHARS_PER_FILE = 60_000
const COMPOSER_FILE_CONTEXT_MAX_TOTAL_CHARS = 180_000
const WINDOW_RESUME_RECOVERY_MIN_HIDDEN_MS = 1000
const WINDOW_RESUME_RECOVERY_DEBOUNCE_MS = 1500
const DESKTOP_SHORTCUT_COMMANDS: Partial<Record<KeyboardShortcutCommandId, DesktopCommand>> = {
  quit: 'quit',
  undo: 'undo',
  redo: 'redo',
  cut: 'cut',
  copy: 'copy',
  paste: 'paste',
  'select-all': 'selectAll',
  reload: 'reload',
  'zoom-in': 'zoomIn',
  'zoom-out': 'zoomOut',
  'reset-zoom': 'resetZoom',
  'toggle-devtools': 'toggleDevTools',
  close: 'close',
  minimize: 'minimize',
  'toggle-maximize': 'toggleMaximize'
}

function fileNameFromPath(path: string): string {
  return path.replaceAll('\\', '/').split('/').filter(Boolean).pop() || 'image'
}

function clipComposerFileContext(
  content: string,
  remainingChars: number,
  sourceTruncated: boolean
): { content: string; truncated: boolean; consumed: number } {
  const limit = Math.max(0, Math.min(COMPOSER_FILE_CONTEXT_MAX_CHARS_PER_FILE, remainingChars))
  const clipped = content.slice(0, limit)
  return {
    content: clipped,
    truncated: sourceTruncated || clipped.length < content.length,
    consumed: clipped.length
  }
}

function mergeSkillCommands(
  runtimeSkills: CoreRuntimeSkillJson[],
  localSkills: SkillListItem[]
): CoreRuntimeSkillJson[] {
  const merged = new Map<string, CoreRuntimeSkillJson>()
  for (const skill of localSkills) {
    merged.set(skill.id, {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      root: skill.root,
      legacy: skill.legacy,
      scope: skill.scope
    })
  }
  for (const skill of runtimeSkills) {
    const existing = merged.get(skill.id)
    merged.set(skill.id, existing ? {
      ...skill,
      ...existing,
      triggers: skill.triggers ?? existing.triggers,
      allowedTools: skill.allowedTools ?? existing.allowedTools
    } : skill)
  }
  return [...merged.values()]
}

function clipboardImageToFile(image: Extract<ClipboardImageReadResult, { ok: true }>): File {
  return base64ToFile(image.dataBase64, image.name, image.mimeType)
}

function base64ToFile(dataBase64: string, name: string, mimeType: string): File {
  const binary = atob(dataBase64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return new File([bytes], name || 'image', { type: mimeType })
}

export function Workbench(): ReactElement {
  const { t } = useTranslation('common')
  const {
    threads,
    threadSearch,
    showArchivedThreads,
    activeThreadId,
    selectThread,
    createThread,
    blocks,
    liveReasoning,
    liveAssistant,
    error,
    runtimeErrorDetail,
    busy,
    route,
    pluginHostRoute,
    workspaceRoot,
    codeWorkspaceRoots,
    runtimeConnection,
    setRoute,
    openCode,
    openSettings,
    openPlugins,
    openClaw,
    openSchedule,
    openDocumentWriting,
    openLegalResearch,
    openKnowledgeBase,
    openLearningIteration,
    chooseWorkspace,
    setWorkspaceRoot,
    clearWorkspace,
    clawChannels,
    activeClawChannelId,
    selectClawChannel,
    resetClawChannelSession,
    setClawChannelModel,
    appendLocalClawTurn,
    setError,
    sendMessage,
    reviewActiveThread,
    queuedMessages,
    removeQueuedMessage,
    interrupt,
    probeRuntime,
    composerModel,
    composerProviderId,
    composerPickList,
    composerModelGroups,
    loadComposerModels,
    setComposerModel,
    setThreadSearch,
    setShowArchivedThreads,
    renameThread,
    archiveThread,
    deleteThread,
    spawnSideConversation,
    openSideConversationDraft,
    selectSideConversation,
    setSidePanelOpen,
    sideConversations,
    sidePanel
  } = useChatStore(
    useShallow((s) => ({
      threads: s.threads,
      threadSearch: s.threadSearch,
      showArchivedThreads: s.showArchivedThreads,
      activeThreadId: s.activeThreadId,
      selectThread: s.selectThread,
      createThread: s.createThread,
      blocks: s.blocks,
      liveReasoning: s.liveReasoning,
      liveAssistant: s.liveAssistant,
      error: s.error,
      runtimeErrorDetail: s.runtimeErrorDetail,
      busy: s.busy,
      route: s.route,
      pluginHostRoute: s.pluginHostRoute,
      workspaceRoot: s.workspaceRoot,
      codeWorkspaceRoots: s.codeWorkspaceRoots,
      runtimeConnection: s.runtimeConnection,
      setRoute: s.setRoute,
      openCode: s.openCode,
      openSettings: s.openSettings,
      openPlugins: s.openPlugins,
      openClaw: s.openClaw,
      openSchedule: s.openSchedule,
      openDocumentWriting: s.openDocumentWriting,
      openLegalResearch: s.openLegalResearch,
      openKnowledgeBase: s.openKnowledgeBase,
      openLearningIteration: s.openLearningIteration,
      chooseWorkspace: s.chooseWorkspace,
      setWorkspaceRoot: s.setWorkspaceRoot,
      clearWorkspace: s.clearWorkspace,
      clawChannels: s.clawChannels,
      activeClawChannelId: s.activeClawChannelId,
      selectClawChannel: s.selectClawChannel,
      resetClawChannelSession: s.resetClawChannelSession,
      setClawChannelModel: s.setClawChannelModel,
      appendLocalClawTurn: s.appendLocalClawTurn,
      setError: s.setError,
      sendMessage: s.sendMessage,
      reviewActiveThread: s.reviewActiveThread,
      queuedMessages: s.queuedMessages,
      removeQueuedMessage: s.removeQueuedMessage,
      interrupt: s.interrupt,
      probeRuntime: s.probeRuntime,
      composerModel: s.composerModel,
      composerProviderId: s.composerProviderId,
      composerPickList: s.composerPickList,
      composerModelGroups: s.composerModelGroups,
      loadComposerModels: s.loadComposerModels,
      setComposerModel: s.setComposerModel,
      setThreadSearch: s.setThreadSearch,
      setShowArchivedThreads: s.setShowArchivedThreads,
      renameThread: s.renameThread,
      archiveThread: s.archiveThread,
      deleteThread: s.deleteThread,
      spawnSideConversation: s.spawnSideConversation,
      openSideConversationDraft: s.openSideConversationDraft,
      selectSideConversation: s.selectSideConversation,
      setSidePanelOpen: s.setSidePanelOpen,
      sideConversations: s.sideConversations,
      sidePanel: s.sidePanel
    }))
  )
  const [input, setInput] = useState('')
  const [selectedComposerSkill, setSelectedComposerSkill] =
    useState<ComposerSkillSelection | null>(null)
  const [mode, setMode] = useState<'plan' | 'agent'>('agent')
  const [composerReasoningEffort, setComposerReasoningEffort] =
    useState<ComposerReasoningEffort>('high')
  const [runtimeInfo, setRuntimeInfo] = useState<CoreRuntimeInfoJson | null>(null)
  const [runtimeSkills, setRuntimeSkills] = useState<CoreRuntimeSkillJson[]>([])
  const [composerAttachments, setComposerAttachments] = useState<AttachmentReference[]>([])
  const composerAttachmentsRef = useRef<AttachmentReference[]>([])

  useEffect(() => {
    composerAttachmentsRef.current = composerAttachments
  }, [composerAttachments])

  useEffect(() => {
    return () => {
      for (const attachment of composerAttachmentsRef.current) {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl)
        }
      }
    }
  }, [])
  const legalResearch = useLegalResearch()
  const [selectedKnowledgeChatThreadId, setSelectedKnowledgeChatThreadId] = useState<string | null>(null)
  const [knowledgeChatThreads, setKnowledgeChatThreads] = useState<NormalizedThread[]>([])
  const [composerFileReferences, setComposerFileReferences] = useState<ComposerFileReference[]>([])
  const [attachmentUploadBusy, setAttachmentUploadBusy] = useState(false)
  const [attachmentUploadError, setAttachmentUploadError] = useState<string | null>(null)
  const [connectPhoneSidebarOpen, setConnectPhoneSidebarOpen] = useState(false)
  const [runtimeLogPath, setRuntimeLogPath] = useState('')
  const [filesFloatingOpen, setFilesFloatingOpen] = useState(false)
  const [conversationFilePreviewAttachment, setConversationFilePreviewAttachment] = useState<ConversationFile | null>(null)
  const hiddenAtRef = useRef<number | null>(document.hidden ? Date.now() : null)
  const lastWindowResumeRecoveryRef = useRef(0)
  const writeAssistantOpen = useWriteWorkspaceStore((s) => s.assistantOpen)
  const setWriteAssistantOpen = useWriteWorkspaceStore((s) => s.setAssistantOpen)
  const writeAssistantModel = useWriteWorkspaceStore((s) => s.assistantModel)
  const setWriteAssistantModel = useWriteWorkspaceStore((s) => s.setAssistantModel)
  const [dataComplianceSection, setDataComplianceSection] = useState<DataComplianceSection>('review')
  const [desensitizeSection, setDesensitizeSection] = useState<DesensitizeSection>('material')
  const stageInsetClass = 'ds-stage-inset'
  const keyboardShortcuts = useKeyboardShortcutSettings()
  const keyboardShortcutBindings = useMemo(
    () => resolveKeyboardShortcutBindings(keyboardShortcuts),
    [keyboardShortcuts]
  )

  const refreshKnowledgeChatThreads = useCallback(async (): Promise<void> => {
    try {
      const response = await rendererRuntimeClient.runtimeRequest(
        '/v1/threads?include=side&include_archived=true',
        'GET'
      )
      if (!response.ok) return
      const payload = JSON.parse(response.body) as { threads: NormalizedThread[] }
      const threads = Array.isArray(payload.threads) ? payload.threads : []
      setKnowledgeChatThreads(threads.filter((thread) => isKnowledgeThread(thread)))
    } catch {
      // Ignore fetch errors; the list stays empty until the next refresh.
    }
  }, [])

  useEffect(() => {
    if (route === 'knowledgeBase') {
      void refreshKnowledgeChatThreads()
    }
  }, [route, refreshKnowledgeChatThreads])

  const draftByThread = useRef<Record<string, string>>({})
  const prevThreadId = useRef<string | null>(null)
  const inputRef = useRef('')

  useEffect(() => {
    let recoveryTimer: ReturnType<typeof setTimeout> | null = null

    const clearRecoveryTimer = (): void => {
      if (!recoveryTimer) return
      clearTimeout(recoveryTimer)
      recoveryTimer = null
    }

    const scheduleRecovery = (force = false): void => {
      if (document.hidden) return
      const now = Date.now()
      const hiddenAt = hiddenAtRef.current
      if (!force && hiddenAt !== null && now - hiddenAt < WINDOW_RESUME_RECOVERY_MIN_HIDDEN_MS) return
      if (now - lastWindowResumeRecoveryRef.current < WINDOW_RESUME_RECOVERY_DEBOUNCE_MS) return
      lastWindowResumeRecoveryRef.current = now
      clearRecoveryTimer()
      recoveryTimer = setTimeout(() => {
        recoveryTimer = null
        const state = useChatStore.getState()
        if (!state.activeThreadId) return
        void (async () => {
          if (state.runtimeConnection !== 'ready') {
            await state.probeRuntime('background')
          }
          const next = useChatStore.getState()
          if (next.runtimeConnection !== 'ready' || !next.activeThreadId) return
          await next.recoverActiveTurn()
        })()
      }, 250)
    }

    const onVisibilityChange = (): void => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now()
        clearRecoveryTimer()
        return
      }
      scheduleRecovery()
    }
    const onPageShow = (event: PageTransitionEvent): void => {
      scheduleRecovery(event.persisted)
    }
    const onOnline = (): void => {
      scheduleRecovery(true)
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('online', onOnline)
    return () => {
      clearRecoveryTimer()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  const timelineBlocks = blocks
  const timelineLiveReasoning = liveReasoning
  const timelineLiveAssistant = liveAssistant
  const conversationFiles = useMemo(() => deriveConversationFiles(timelineBlocks), [timelineBlocks])
  const waitingForUserInput = timelineBlocks.some(
    (block) => block.kind === 'user_input' && block.status === 'pending'
  )
  const hasMessages = timelineBlocks.length > 0 || !!timelineLiveAssistant.trim() || !!timelineLiveReasoning.trim()
  const hasActiveWork = busy || timelineBlocks.some(hasPendingRuntimeWork)
  const devPreviewBlocks = useMemo<ChatBlock[]>(() => {
    const liveText = timelineLiveAssistant.trim()
    if (!liveText) return timelineBlocks
    return [
      ...timelineBlocks,
      {
        kind: 'assistant',
        id: '__live-assistant-dev-preview',
        text: timelineLiveAssistant
      }
    ]
  }, [timelineBlocks, timelineLiveAssistant])
  const detectedDevPreviewUrls = useMemo(
    () => extractLatestTurnDevPreviewUrls(devPreviewBlocks),
    [devPreviewBlocks]
  )
  const autoOpenDevPreviewUrls = useMemo(
    () => extractLatestTurnAutoOpenDevPreviewUrls(devPreviewBlocks),
    [devPreviewBlocks]
  )
  const activeClawChannel = useMemo(
    () => clawChannels.find((channel) => channel.id === activeClawChannelId) ?? null,
    [activeClawChannelId, clawChannels]
  )
  const activeSkillWorkspace = useMemo(
    () => {
      if (!hasMessages) return workspaceRoot || ''
      return threads.find((thread) => thread.id === activeThreadId)?.workspace || workspaceRoot || ''
    },
    [activeThreadId, hasMessages, threads, workspaceRoot]
  )
  const latestDevPreviewUrl = detectedDevPreviewUrls[0] ?? null
  const latestAutoOpenDevPreviewUrl = autoOpenDevPreviewUrls[0] ?? null
  const currentSideConversations = useMemo(
    () =>
      Object.values(sideConversations)
        .filter((side) => side.parentThreadId === activeThreadId)
        .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
    [activeThreadId, sideConversations]
  )
  const currentSideRunningCount = currentSideConversations.reduce(
    (count, side) => count + (side.busy ? 1 : 0),
    0
  )
  const {
    beginLeftResize,
    beginRightResize,
    filePreviewTarget,
    leftSidebarCollapsed,
    leftSidebarWidth,
    openDevPreview,
    rightPanelMode,
    rightPanelVisible,
    rightSidebarWidth,
    setFilePreviewTarget,
    setRightPanelMode,
    setRightSidebarWidth,
    shellRef,
    toggleLeftSidebar,
    toggleRightPanelMode,
  } = useWorkbenchLayout({
    activeThreadId,
    latestAutoOpenDevPreviewUrl,
    latestDevPreviewUrl,
    route,
    workspaceRoot
  })

  const {
    activeGuiPlan,
    buildGuiPlan,
    handleGuiPlanCommand,
    openGuiPlanPanel,
    sendPlanTurn
  } = useWorkbenchPlanController({
    blocks,
    busy,
    mode,
    route,
    sendMessage,
    setError,
    setMode,
    setRightPanelMode,
    setRightSidebarWidth,
    t,
    workspaceRoot
  })

  useEffect(() => {
    const runDesktopShortcut = (command: DesktopCommand): void => {
      if (typeof window.dsGui?.runDesktopCommand !== 'function') return
      void window.dsGui.runDesktopCommand(command)
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.defaultPrevented || event.repeat || event.isComposing) return
      const commandId = findKeyboardShortcutCommand(
        keyboardShortcutBindings,
        keyboardEventToShortcut(event)
      )
      if (!commandId) return
      event.preventDefault()

      if (commandId === 'toggle-plan-mode') {
        if (mode === 'plan') {
          setMode('agent')
        } else {
          setMode('plan')
          void handleGuiPlanCommand()
        }
        return
      }
      if (commandId === 'new-chat') {
        void createThread()
        return
      }
      if (commandId === 'choose-workspace') {
        void chooseWorkspace()
        return
      }
      if (commandId === 'settings') {
        openSettings()
        return
      }

      const desktopCommand = DESKTOP_SHORTCUT_COMMANDS[commandId]
      if (desktopCommand) runDesktopShortcut(desktopCommand)
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [
    chooseWorkspace,
    createThread,
    handleGuiPlanCommand,
    keyboardShortcutBindings,
    mode,
    openSettings,
    setMode
  ])
  const showDevPreviewCard =
    route === 'chat' &&
    latestDevPreviewUrl !== null

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.dsGui?.getLogPath !== 'function') return
    let cancelled = false
    void window.dsGui
      .getLogPath()
      .then((path) => {
        if (!cancelled) setRuntimeLogPath(path)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const previousThreadId = prevThreadId.current
    prevThreadId.current = activeThreadId
    if (previousThreadId !== null && previousThreadId !== activeThreadId && sidePanel.open) {
      setSidePanelOpen(false)
    }
  }, [activeThreadId, setSidePanelOpen, sidePanel.open])

  const openSideChat = (): void => {
    const latestSide = currentSideConversations.at(-1)
    if (latestSide) {
      selectSideConversation(latestSide.threadId)
      return
    }
    openSideConversationDraft()
  }

  const codeThreads = useMemo(
    () => threads.filter((thread) =>
      !isClawThread(thread, clawChannels) &&
      !isLegalResearchThread(thread)
    ),
    [clawChannels, threads]
  )

  const mirrorClawCommand = async (userText: string, replyText: string): Promise<void> => {
    if (!activeThreadId || typeof window.dsGui?.mirrorClawChannelMessage !== 'function') return
    const userResult = await window.dsGui.mirrorClawChannelMessage(
      activeThreadId,
      userText,
      'user'
    )
    if (!userResult.ok) return
    await window.dsGui.mirrorClawChannelMessage(
      activeThreadId,
      replyText,
      'assistant'
    )
  }

  const clawHelpText = (): string =>
    [
      t('clawHelpTitle'),
      '',
      `- \`/help\`: ${t('clawHelpCommandHelp')}`,
      `- \`/new\`: ${t('clawHelpCommandNew')}`,
      `- \`/model auto\`: ${t('clawHelpCommandModelAuto')}`,
      `- \`/model pro\`: ${t('clawHelpCommandModelPro')}`,
      `- \`/model flash\`: ${t('clawHelpCommandModelFlash')}`,
      `- \`/model\`: ${t('clawHelpCommandModelShow')}`
    ].join('\n')

  useEffect(() => {
    inputRef.current = input
  }, [input])

  useEffect(() => {
    if (rightPanelMode === 'plan' && !activeGuiPlan) {
      setRightPanelMode(null)
    }
  }, [activeGuiPlan, rightPanelMode, setRightPanelMode])

  useEffect(() => {
    let cancelled = false
    const runtimeReady = runtimeConnection === 'ready'
    if (!runtimeReady) setRuntimeInfo(null)
    const provider = getProvider()
    const localSkillsTask = typeof window !== 'undefined' && typeof window.dsGui?.listSkills === 'function'
      ? window.dsGui.listSkills(activeSkillWorkspace || undefined)
      : Promise.resolve({ ok: true as const, skills: [], validationErrors: [] })
    void Promise.allSettled([
      runtimeReady && provider.getRuntimeInfo ? provider.getRuntimeInfo() : Promise.resolve(null),
      runtimeReady && provider.listSkills ? provider.listSkills() : Promise.resolve([]),
      localSkillsTask
    ])
      .then(([runtimeResult, skillsResult, localSkillsResult]) => {
        if (cancelled) return
        setRuntimeInfo(runtimeResult.status === 'fulfilled' ? runtimeResult.value : null)
        const runtimeSkillList = skillsResult.status === 'fulfilled' ? skillsResult.value : []
        const localSkillList =
          localSkillsResult.status === 'fulfilled' && localSkillsResult.value.ok
            ? localSkillsResult.value.skills
            : []
        setRuntimeSkills(mergeSkillCommands(runtimeSkillList, localSkillList))
      })
      .catch(() => {
        if (!cancelled) {
          if (!runtimeReady) setRuntimeInfo(null)
          setRuntimeSkills([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [activeSkillWorkspace, runtimeConnection])

  useEffect(() => {
    if (runtimeConnection !== 'ready' || runtimeInfo) return
    const provider = getProvider()
    if (!provider.getRuntimeInfo) return
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let attempt = 0
    const refreshRuntimeInfo = async (): Promise<void> => {
      try {
        const info = await provider.getRuntimeInfo?.()
        if (!cancelled && info) setRuntimeInfo(info)
      } catch {
        attempt += 1
        if (!cancelled && attempt < 4) {
          timer = setTimeout(() => void refreshRuntimeInfo(), 500 * (2 ** (attempt - 1)))
        }
      }
    }
    timer = setTimeout(() => void refreshRuntimeInfo(), 500)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [runtimeConnection, runtimeInfo])

  const attachmentUploadEnabled = isChatAttachmentUploadEnabled({
    runtimeConnection,
    route,
    mode,
    attachmentStoreAvailable: runtimeInfo?.capabilities.attachments.available
  })
  const webAccessAvailable =
    runtimeInfo?.capabilities.web.fetch.available === true ||
    runtimeInfo?.capabilities.web.search.available === true

  const clearComposerAttachments = (): void => {
    setComposerAttachments((current) => {
      for (const attachment of current) {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl)
          attachment.previewUrl = undefined
        }
      }
      return []
    })
  }

  const clearComposerFileReferences = (): void => {
    setComposerFileReferences([])
  }

  const addComposerFileReference = (reference: ComposerFileReference): void => {
    setComposerFileReferences((current) => mergeComposerFileReferences(current, reference))
  }

  const removeComposerFileReference = (relativePath: string): void => {
    const key = relativePath.trim().replaceAll('\\', '/').replace(/\/+/g, '/').toLowerCase()
    setComposerFileReferences((current) =>
      current.filter((reference) =>
        reference.relativePath.trim().replaceAll('\\', '/').replace(/\/+/g, '/').toLowerCase() !== key
      )
    )
  }

  useEffect(() => {
    if (route !== 'chat') setComposerFileReferences([])
  }, [route])

  const handlePickAttachments = async (files: File[]): Promise<void> => {
    if (!files.length || !attachmentUploadEnabled) return
    const provider = getProvider()
    if (
      typeof provider.uploadAttachment !== 'function' &&
      typeof provider.uploadAttachmentFile !== 'function'
    ) {
      setAttachmentUploadError(t('composerAttachmentUnavailable'))
      return
    }
    setAttachmentUploadBusy(true)
    setAttachmentUploadError(null)
    try {
      const workspace = threads.find((thread) => thread.id === activeThreadId)?.workspace || workspaceRoot || undefined
      const resolvedCapabilities = await resolveChatAttachmentCapabilities({
        cached: runtimeInfo?.capabilities.attachments,
        loadRuntimeInfo: provider.getRuntimeInfo
          ? () => provider.getRuntimeInfo!()
          : undefined
      })
      if (!resolvedCapabilities) {
        setAttachmentUploadError(t('composerAttachmentUnavailable'))
        return
      }
      if (resolvedCapabilities.runtimeInfo) {
        setRuntimeInfo(resolvedCapabilities.runtimeInfo)
      }
      const attachmentCapabilities = resolvedCapabilities.capabilities
      const uploaded: AttachmentReference[] = []
      for (const file of files) {
        const mimeType = resolveAttachmentMimeType(file)
        const scope = {
          ...(activeThreadId ? { threadId: activeThreadId } : {}),
          ...(workspace ? { workspace } : {})
        }
        const { attachment, prepared } = await uploadAttachmentWithMemoryFallback(
          file,
          attachmentCapabilities,
          provider,
          {
            name: resolveAttachmentUploadName(file),
            mimeType,
            ...scope
          }
        )
        uploaded.push({
          id: attachment.id,
          name: attachment.name,
          mimeType: attachment.mimeType,
          width: attachment.width,
          height: attachment.height,
          ...(prepared?.previewUrl ? { previewUrl: prepared.previewUrl } : {}),
          ...(!prepared && isImageFile(file) ? { previewUrl: URL.createObjectURL(file) } : {})
        })
      }
      if (uploaded.length > 0) {
        setComposerAttachments((current) => {
          const byId = new Map(current.map((attachment) => [attachment.id, attachment]))
          for (const attachment of uploaded) {
            byId.set(attachment.id, attachment)
          }
          return [...byId.values()]
        })
      }
    } catch (error) {
      setAttachmentUploadError(error instanceof Error ? error.message : String(error))
    } finally {
      setAttachmentUploadBusy(false)
    }
  }

  const removeComposerAttachment = (id: string): void => {
    setComposerAttachments((current) => {
      const removed = current.find((attachment) => attachment.id === id)
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl)
        removed.previewUrl = undefined
      }
      return current.filter((attachment) => attachment.id !== id)
    })
  }

  const handlePasteClipboardImage = async (options: { silentNoImage?: boolean } = {}): Promise<void> => {
    if (!attachmentUploadEnabled) return
    if (typeof window.dsGui?.readClipboardImage !== 'function') {
      setAttachmentUploadError(t('composerAttachmentUnavailable'))
      return
    }
    const image = await window.dsGui.readClipboardImage()
    if (!image.ok) {
      if (options.silentNoImage) return
      setAttachmentUploadError(image.message)
      return
    }
    await handlePickAttachments([clipboardImageToFile(image)])
  }

  /**
   * Long plain-text paste → upload the whole text as a `text/plain`
   * attachment named "粘贴文本.txt". Rendered by the existing non-image
   * attachment card with a "文本" type badge in both the composer and the
   * sent message bubble.
   */
  const handlePasteLongText = async (text: string): Promise<void> => {
    if (!attachmentUploadEnabled) return
    const trimmed = text.trim()
    if (!trimmed) return
    await handlePickAttachments([
      new File([trimmed], '粘贴文本.txt', { type: 'text/plain' })
    ])
  }

  const readComposerFileContextEntries = async (
    references: ComposerFileReference[],
    workspace: string
  ): Promise<ComposerFileContextEntry[]> => {
    const entries: ComposerFileContextEntry[] = []
    let remainingChars = COMPOSER_FILE_CONTEXT_MAX_TOTAL_CHARS
    for (const reference of references) {
      if (remainingChars <= 0) break
      const result = await window.dsGui.readWorkspaceFile({
        workspaceRoot: workspace,
        path: reference.relativePath || reference.path
      })
      if (!result.ok) {
        throw new Error(t('composerFileReadFailed', {
          path: reference.relativePath,
          message: result.message
        }))
      }
      const clipped = clipComposerFileContext(result.content, remainingChars, result.truncated)
      remainingChars -= clipped.consumed
      entries.push({
        relativePath: reference.relativePath,
        content: clipped.content,
        ...(clipped.truncated ? { truncated: true } : {})
      })
    }
    return entries
  }

  const handleSend = (): void => {
    void handleSendAsync()
  }

  const handleInterruptAndSend = (): void => {
    interrupt()
    // Send after interrupt settles UI state synchronously
    window.setTimeout(() => handleSend(), 0)
  }

  const handleGuideQueuedMessage = (id: string): void => {
    const store = useChatStore.getState()
    const msg = store.queuedMessages.find((m) => m.id === id)
    if (!msg) return
    store.removeQueuedMessage(id)
    interrupt()
    window.setTimeout(() => {
      void store.sendMessage(msg.text)
    }, 0)
  }

  const handleSendAsync = async (): Promise<void> => {
    const v = input.trim()
    const attachments = route === 'chat' ? composerAttachments : []
    const attachmentIds = attachments.map((attachment) => attachment.id)
    const fileReferences = route === 'chat' ? composerFileReferences : []
    const reasoningEffort = composerReasoningEffortRequestValue(composerReasoningEffort)
    if (!v && attachmentIds.length === 0 && fileReferences.length === 0) return
    const emptyPrompt =
      fileReferences.length > 0 && attachmentIds.length > 0
        ? t('composerFileAndAttachmentOnlyPrompt')
        : fileReferences.length > 0
          ? t('composerFileOnlyPrompt')
          : t('composerAttachmentOnlyPrompt')
    const emptyDisplayText = v
      ? undefined
      : fileReferences.length > 0 && attachmentIds.length > 0
        ? t('composerFileAndAttachmentOnlyDisplay', { count: fileReferences.length })
        : fileReferences.length > 0
          ? t('composerFileOnlyDisplay', { count: fileReferences.length })
          : t('composerAttachmentOnlyDisplay')
    const messageText = v || emptyPrompt
    const prepareChatMessage = async (): Promise<{ text: string; displayText?: string } | null> => {
      if (fileReferences.length === 0) {
        return {
          text: buildSelectedSkillPrompt(selectedComposerSkill, messageText),
          ...(selectedComposerSkill && v
            ? { displayText: v }
            : emptyDisplayText
              ? { displayText: emptyDisplayText }
              : {})
        }
      }
      const workspace = normalizeWorkspaceRoot(
        threads.find((thread) => thread.id === activeThreadId)?.workspace || workspaceRoot
      )
      if (!workspace) {
        setError(t('workspaceRequiredToCreateThread'))
        return null
      }
      try {
        const fileContext = await readComposerFileContextEntries(fileReferences, workspace)
        const displayText = v || emptyDisplayText
        return {
          text: buildSelectedSkillPrompt(
            selectedComposerSkill,
            buildComposerFileContextPrompt(messageText, fileContext)
          ),
          ...(displayText ? { displayText } : {})
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error))
        return null
      }
    }

    const planCommand = parseGuiPlanCommand(v)
    if (planCommand) {
      setInput('')
      void handleGuiPlanCommand(planCommand.kind === 'create' ? planCommand.request : undefined)
      return
    }
    if (route === 'chat' && mode === 'plan') {
      const prepared = await prepareChatMessage()
      if (!prepared) return
      setInput('')
      setSelectedComposerSkill(null)
      clearComposerAttachments()
      clearComposerFileReferences()
      void sendPlanTurn(prepared.text, {
        ...(prepared.displayText ? { displayText: prepared.displayText } : {}),
        ...(reasoningEffort ? { reasoningEffort } : {}),
        ...(attachmentIds.length ? { attachmentIds, attachments } : {})
      })
      return
    }
    if (route === 'claw') {
      const command = parseClawCommand(v)
      if (command?.kind === 'clear') {
        if (!activeClawChannelId) {
          setError(t('clawNoActiveIm'))
          return
        }
        setInput('')
        void (async () => {
          await resetClawChannelSession(activeClawChannelId)
          const replyText = t('clawNewSessionStarted')
          appendLocalClawTurn(v, replyText)
          await mirrorClawCommand(v, replyText)
        })()
        return
      }
      if (command?.kind === 'help') {
        setInput('')
        const replyText = clawHelpText()
        appendLocalClawTurn(v, replyText)
        void mirrorClawCommand(v, replyText)
        return
      }
      if (command?.kind === 'model') {
        if (!activeClawChannelId) {
          setError(t('clawNoActiveIm'))
          return
        }
        setInput('')
        void (async () => {
          await setClawChannelModel(activeClawChannelId, command.model)
          const replyText = t('clawModelChanged', { model: command.model })
          appendLocalClawTurn(v, replyText)
          await mirrorClawCommand(v, replyText)
        })()
        return
      }
      if (command?.kind === 'showModel') {
        if (!activeClawChannelId) {
          setError(t('clawNoActiveIm'))
          return
        }
        setInput('')
        const replyText = t('clawModelCurrent', {
          model: activeClawChannel?.model ?? 'auto'
        })
        appendLocalClawTurn(v, replyText)
        void mirrorClawCommand(v, replyText)
        return
      }
      if (command?.kind === 'invalidModel') {
        setError(t('clawModelCommandHint'))
        return
      }
      if (!activeClawChannelId) {
        setError(t('clawNoActiveIm'))
        return
      }
      setInput('')
      void (async () => {
        const taskResult = typeof window.dsGui?.createClawTaskFromText === 'function'
          ? await window.dsGui.createClawTaskFromText(v, {
              channelId: activeClawChannelId,
              modelHint: activeClawChannel?.model,
              mode
            })
          : { kind: 'noop' as const }
        if (taskResult.kind === 'created') {
          appendLocalClawTurn(v, taskResult.confirmationText)
          await mirrorClawCommand(v, taskResult.confirmationText)
          return
        }
        if (taskResult.kind === 'error') {
          appendLocalClawTurn(v, `Failed to create scheduled task: ${taskResult.message}`)
          return
        }
        if (!activeThreadId) {
          await selectClawChannel(activeClawChannelId)
          await useChatStore.getState().sendMessage(v, mode === 'plan' ? 'plan' : 'agent', {
            ...(reasoningEffort ? { reasoningEffort } : {})
          })
          return
        }
        await sendMessage(v, mode === 'plan' ? 'plan' : 'agent', {
          ...(reasoningEffort ? { reasoningEffort } : {})
        })
      })()
      return
    }
    const prepared = await prepareChatMessage()
    if (!prepared) return
    setInput('')
    setSelectedComposerSkill(null)
    clearComposerAttachments()
    clearComposerFileReferences()
    void sendMessage(prepared.text, mode === 'plan' ? 'plan' : 'agent', {
      ...(prepared.displayText ? { displayText: prepared.displayText } : {}),
      ...(reasoningEffort ? { reasoningEffort } : {}),
      ...(attachmentIds.length ? { attachmentIds, attachments } : {})
    })
  }

  const openThread = (id: string): void => {
    setConnectPhoneSidebarOpen(false)
    setSelectedComposerSkill(null)
    setRoute('chat')
    void selectThread(id)
  }

  const startNewChat = (): void => {
    setConnectPhoneSidebarOpen(false)
    setSelectedComposerSkill(null)
    setRoute('chat')
    void createThread()
  }

  const startNewChatInWorkspace = (workspaceRoot: string): void => {
    setConnectPhoneSidebarOpen(false)
    setSelectedComposerSkill(null)
    setRoute('chat')
    void createThread({ workspaceRoot })
  }

  const trySkillInNewConversation = (skill: ComposerSkillSelection): void => {
    setConnectPhoneSidebarOpen(false)
    setInput('')
    clearComposerAttachments()
    clearComposerFileReferences()
    setMode('agent')
    setSelectedComposerSkill(skill)
    setRoute('chat')
    void createThread({ forceNew: true })
  }

  const selectNewConversationWorkspace = (nextWorkspaceRoot: string): void => {
    setConnectPhoneSidebarOpen(false)
    setRoute('chat')
    void (async () => {
      await setWorkspaceRoot(nextWorkspaceRoot)
      if (activeThreadId && !hasMessages) {
        await createThread({ workspaceRoot: nextWorkspaceRoot })
      }
    })()
  }

  const pickNewConversationWorkspace = (): void => {
    setConnectPhoneSidebarOpen(false)
    setRoute('chat')
    void chooseWorkspace({ selectThreadAfter: false })
  }

  const clearNewConversationWorkspace = (): void => {
    setConnectPhoneSidebarOpen(false)
    setRoute('chat')
    void clearWorkspace()
  }

  const openCodeMode = (): void => {
    setConnectPhoneSidebarOpen(false)
    void openCode()
  }

  const openDataComplianceProject = (): void => {
    setConnectPhoneSidebarOpen(false)
    if (rightPanelMode !== null) setRightPanelMode(null)
    useChatStore.setState({
      route: 'dataCompliance',
      error: null
    })
  }

  const openDesensitizeProject = (): void => {
    setConnectPhoneSidebarOpen(false)
    if (rightPanelMode !== null) setRightPanelMode(null)
    useChatStore.setState({
      route: 'desensitize',
      error: null
    })
  }

  const openPluginsView = (): void => {
    setConnectPhoneSidebarOpen(false)
    openPlugins(sidebarView === 'claw' ? 'claw' : 'chat')
  }

  const openScheduleView = (): void => {
    setConnectPhoneSidebarOpen(false)
    openSchedule()
  }

  const openDocumentWritingView = (): void => {
    setConnectPhoneSidebarOpen(false)
    openDocumentWriting()
  }

  const openLegalResearchView = (): void => {
    setConnectPhoneSidebarOpen(false)
    openLegalResearch()
  }

  const openKnowledgeBaseView = (): void => {
    setConnectPhoneSidebarOpen(false)
    if (rightPanelMode !== null) setRightPanelMode(null)
    openKnowledgeBase()
  }

  const openLearningIterationView = (): void => {
    setConnectPhoneSidebarOpen(false)
    if (rightPanelMode !== null) setRightPanelMode(null)
    openLearningIteration()
  }

  const toggleConnectPhone = (): void => {
    openClaw()
    setConnectPhoneSidebarOpen((open) => !open)
  }

  const sidebarView: 'chat' | 'dataCompliance' | 'desensitize' | 'claw' | 'schedule' | 'documentWriting' | 'legalResearch' | 'knowledgeBase' | 'learningIteration' =
    route === 'claw' || (route === 'plugins' && pluginHostRoute === 'claw')
      ? 'claw'
      : route === 'schedule'
        ? 'schedule'
        : route === 'documentWriting'
          ? 'documentWriting'
          : route === 'legalResearch'
            ? 'legalResearch'
            : route === 'knowledgeBase'
              ? 'knowledgeBase'
              : route === 'learningIteration'
                ? 'learningIteration'
              : route === 'dataCompliance'
                ? 'dataCompliance'
                : route === 'desensitize'
                  ? 'desensitize'
                  : 'chat'
  const usesSubfeatureControlRadius =
    route === 'plugins' ||
    route === 'learningIteration' ||
    route === 'schedule' ||
    route === 'documentWriting' ||
    route === 'legalResearch' ||
    route === 'knowledgeBase' ||
    route === 'dataCompliance' ||
    route === 'desensitize'

  const closeRightPanel = (): void => {
    setRightPanelMode(null)
    setFilePreviewTarget(null)
    setConversationFilePreviewAttachment(null)
  }

  const toggleFilesFloating = (): void => {
    setFilesFloatingOpen((open) => !open)
  }

  const openConversationFilePreview = (file: ConversationFile): void => {
    setFilesFloatingOpen(false)
    if (file.kind === 'attachment') {
      setConversationFilePreviewAttachment(file)
      setRightPanelMode('files')
      return
    }
    setFilePreviewTarget({ path: file.path, workspaceRoot })
    setRightSidebarWidth((width) => Math.max(width, 720))
    setRightPanelMode('file')
  }

  const startNewWriteAssistantConversation = (): void => {
    const writeState = useWriteWorkspaceStore.getState()
    const writeWorkspaceRoot = writeState.workspaceRoot || workspaceRoot
    setInput('')
    writeState.clearQuotedSelections()
    void createThread({ workspaceRoot: writeWorkspaceRoot })
  }

  const renderRuntimeBanner = (message: string, detail?: string | null): ReactElement => (
    <RuntimeBanner
      message={message}
      detail={detail}
      logPath={runtimeLogPath || null}
      runtimeReady={runtimeConnection === 'ready'}
      stageInsetClass={stageInsetClass}
      t={t}
      onOpenLogDir={
        typeof window !== 'undefined' && typeof window.dsGui?.openLogDir === 'function'
          ? () => window.dsGui.openLogDir()
          : undefined
      }
      onOpenSettings={() => openSettings('agents')}
      onRetryConnection={() => void probeRuntime('user')}
    />
  )

  const renderRightPanel = (): ReactElement | null => {
    if (!rightPanelVisible) return null
    return (
      <>
        <div
          role="separator"
          aria-orientation="vertical"
          className="ds-workbench-divider ds-no-drag relative z-20 shrink-0 cursor-col-resize"
          onPointerDown={beginRightResize}
        />
        <div className="h-full min-h-0 shrink-0" style={{ width: rightSidebarWidth }}>
          <Suspense fallback={<div className="h-full w-full bg-ds-sidebar" />}>
            {rightPanelMode === 'changes' ? (
              <ChangeInspector
                blocks={blocks}
                className="h-full max-h-full w-full flex-col"
                onCollapse={closeRightPanel}
              />
            ) : rightPanelMode === 'todo' ? (
              <TodoPanel
                className="h-full max-h-full w-full"
                onCollapse={closeRightPanel}
                onOpenPlan={openGuiPlanPanel}
              />
            ) : rightPanelMode === 'browser' ? (
              <DevBrowserPanel
                blocks={devPreviewBlocks}
                preferredUrl={latestDevPreviewUrl}
                className="h-full max-h-full w-full flex-col"
                onCollapse={closeRightPanel}
              />
            ) : rightPanelMode === 'plan' ? (
              <PlanPanel
                workspaceRoot={workspaceRoot}
                activeThreadId={activeThreadId}
                runtimeReady={runtimeConnection === 'ready'}
                busy={busy}
                className="h-full max-h-full w-full"
                onCollapse={closeRightPanel}
                onBuildPlan={() => void buildGuiPlan()}
              />
            ) : rightPanelMode === 'files' ? (
              <ConversationFilesPanel
                files={conversationFiles}
                activeThreadId={activeThreadId}
                workspaceRoot={workspaceRoot}
                className="h-full max-h-full w-full"
                onClose={closeRightPanel}
                onOpenWorkspaceFile={(path) => {
                  setFilePreviewTarget({ path, workspaceRoot })
                  setRightSidebarWidth((width) => Math.max(width, 720))
                  setRightPanelMode('file')
                }}
                initialAttachment={conversationFilePreviewAttachment}
              />
            ) : (
              <WorkspaceFilePreviewPanel
                target={filePreviewTarget}
                workspaceRoot={workspaceRoot}
                className="h-full max-h-full w-full"
                onClose={closeRightPanel}
                onBack={() => setRightPanelMode('files')}
              />
            )}
          </Suspense>
        </div>
      </>
    )
  }

  return (
    <DocumentWritingProvider>
    <div
      ref={shellRef}
      className={`ds-workbench-shell ds-drag flex h-full min-h-0 w-full min-w-0 bg-ds-main ${
        usesSubfeatureControlRadius ? 'ds-subfeature-controls' : ''
      }`}
    >
      {!leftSidebarCollapsed ? (
        <>
          <div className="min-h-0 shrink-0" style={{ width: leftSidebarWidth }}>
            <Sidebar
              threads={codeThreads}
              activeThreadId={activeThreadId}
              activeView={sidebarView}
              dataComplianceSection={dataComplianceSection}
              desensitizeSection={desensitizeSection}
              connectPhoneSidebarOpen={connectPhoneSidebarOpen}
              pluginsActive={route === 'plugins'}
              knowledgePanelOpen={route === 'knowledgeBase'}
              runtimeConnection={runtimeConnection}
              runtimeReady={runtimeConnection === 'ready'}
              threadSearch={threadSearch}
              showArchivedThreads={showArchivedThreads}
              legalResearchRecords={legalResearch.records}
              activeLegalResearchRecordId={legalResearch.activeRecordId}
              knowledgeChatThreads={knowledgeChatThreads}
              activeKnowledgeChatThreadId={selectedKnowledgeChatThreadId}
              onThreadSearchChange={setThreadSearch}
              onShowArchivedThreadsChange={setShowArchivedThreads}
              onSelectThread={openThread}
              onRenameThread={renameThread}
              onArchiveThread={(id) => archiveThread(id, true)}
              onDeleteThread={deleteThread}
              onRestoreThread={(id) => archiveThread(id, false)}
              onNewChat={startNewChat}
              onNewChatInWorkspace={startNewChatInWorkspace}
              onLearningIterationOpen={openLearningIterationView}
              onOpenSettings={(section) => openSettings(section)}
              onOpenPlugins={openPluginsView}
              onToggleConnectPhone={toggleConnectPhone}
              onCodeOpen={openCodeMode}
              onDesensitizeOpen={openDesensitizeProject}
              onDesensitizeSectionChange={setDesensitizeSection}
              onDataComplianceOpen={openDataComplianceProject}
              onDataComplianceSectionChange={setDataComplianceSection}
              onScheduleOpen={openScheduleView}
              onDocumentWritingOpen={openDocumentWritingView}
              onLegalResearchOpen={openLegalResearchView}
              onKnowledgeOpen={openKnowledgeBaseView}
              onSelectLegalResearchRecord={legalResearch.setActiveRecordId}
              onDeleteLegalResearchRecord={legalResearch.deleteRecord}
              onClearLegalResearchHistory={legalResearch.clearHistory}
              onStopLegalResearch={legalResearch.stopResearch}
              onSelectKnowledgeChatThread={setSelectedKnowledgeChatThreadId}
              onDeleteKnowledgeChatThread={async (id) => {
                try {
                  await rendererRuntimeClient.runtimeRequest(`/v1/threads/${id}`, 'DELETE')
                } catch {
                  // Ignore errors; the list refresh will show the current state.
                }
                if (selectedKnowledgeChatThreadId === id) {
                  setSelectedKnowledgeChatThreadId(null)
                }
                await refreshKnowledgeChatThreads()
              }}
              onToggleSidebar={toggleLeftSidebar}
            />
          </div>
          <div
            role="separator"
            aria-orientation="vertical"
            className="ds-workbench-divider ds-no-drag relative z-20 shrink-0 cursor-col-resize"
            onPointerDown={beginLeftResize}
          />
        </>
      ) : null}

      <main
        className={`ds-drag ds-stage-surface relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${
          route === 'plugins' ? 'px-0' : ''
        }`}
      >
        {route === 'plugins' ? (
          <>
            <div className="ds-no-drag shrink-0 px-4 pt-4">
              <SidebarTitlebarToggleButton
                onClick={toggleLeftSidebar}
                title={leftSidebarCollapsed ? t('sidebarExpand') : t('sidebarCollapse')}
                ariaLabel={leftSidebarCollapsed ? t('sidebarExpand') : t('sidebarCollapse')}
              />
            </div>
            <Suspense fallback={<div className="h-full bg-ds-main" />}>
              <PluginMarketplaceView onTrySkill={trySkillInNewConversation} />
            </Suspense>
          </>
        ) : route === 'learningIteration' ? (
          <Suspense fallback={<div className="h-full bg-ds-main" />}>
            <LearningIterationView
              leftSidebarCollapsed={leftSidebarCollapsed}
              onToggleLeftSidebar={toggleLeftSidebar}
            />
          </Suspense>
        ) : route === 'schedule' ? (
          <Suspense fallback={<div className="h-full bg-ds-main" />}>
            <ScheduleTasksView
              leftSidebarCollapsed={leftSidebarCollapsed}
              onToggleLeftSidebar={toggleLeftSidebar}
              onOpenThread={openThread}
            />
          </Suspense>
        ) : route === 'documentWriting' ? (
          <>
            <div className="ds-no-drag shrink-0 px-4 pt-4">
              {leftSidebarCollapsed ? (
                <SidebarTitlebarToggleButton
                  onClick={toggleLeftSidebar}
                  title={t('sidebarExpand')}
                  ariaLabel={t('sidebarExpand')}
                />
              ) : null}
            </div>
            <div className="ds-no-drag flex min-h-0 flex-1 overflow-hidden">
              <Suspense fallback={<div className="h-full bg-ds-main" />}>
                <DocumentWritingView />
              </Suspense>
            </div>
          </>
        ) : route === 'legalResearch' ? (
          <>
            <div className="ds-no-drag shrink-0 px-4 pt-4">
              {leftSidebarCollapsed ? (
                <SidebarTitlebarToggleButton
                  onClick={toggleLeftSidebar}
                  title={t('sidebarExpand')}
                  ariaLabel={t('sidebarExpand')}
                />
              ) : null}
            </div>
            <div className="ds-no-drag flex min-h-0 flex-1 overflow-hidden">
              <Suspense fallback={<div className="h-full flex-1 bg-ds-main" />}>
                <LegalResearchPanel legalResearch={legalResearch} />
              </Suspense>
            </div>
          </>
        ) : route === 'knowledgeBase' ? (
          <>
            <div className="ds-no-drag shrink-0 px-4 pt-4">
              {leftSidebarCollapsed ? (
                <SidebarTitlebarToggleButton
                  onClick={toggleLeftSidebar}
                  title={t('sidebarExpand')}
                  ariaLabel={t('sidebarExpand')}
                />
              ) : null}
            </div>
            <div className="ds-no-drag flex min-h-0 flex-1 overflow-hidden">
              <Suspense fallback={<div className="h-full flex-1 bg-ds-main" />}>
                <KnowledgeBaseView
                  selectedThreadId={selectedKnowledgeChatThreadId}
                  onSelectThread={setSelectedKnowledgeChatThreadId}
                  onChatThreadsChange={refreshKnowledgeChatThreads}
                />
              </Suspense>
            </div>
          </>
        ) : route === 'dataCompliance' ? (
          <>
            <div className="ds-no-drag shrink-0 px-4 pt-4">
              {leftSidebarCollapsed ? (
                <SidebarTitlebarToggleButton
                  onClick={toggleLeftSidebar}
                  title={t('sidebarExpand')}
                  ariaLabel={t('sidebarExpand')}
                />
              ) : null}
            </div>
            <div className="ds-no-drag flex min-h-0 flex-1 overflow-hidden">
              <Suspense fallback={<div className="h-full flex-1 bg-ds-main" />}>
                <DataCompliancePanel
                  activeSection={dataComplianceSection}
                  onSectionChange={setDataComplianceSection}
                />
              </Suspense>
            </div>
          </>
        ) : route === 'desensitize' ? (
          <>
            <div className="ds-no-drag shrink-0 px-4 pt-4">
              {leftSidebarCollapsed ? (
                <SidebarTitlebarToggleButton
                  onClick={toggleLeftSidebar}
                  title={t('sidebarExpand')}
                  ariaLabel={t('sidebarExpand')}
                />
              ) : null}
            </div>
            <div className="ds-no-drag flex min-h-0 flex-1 overflow-hidden">
              <Suspense fallback={<div className="h-full flex-1 bg-ds-main" />}>
                <DesensitizationPanel
                  activeSection={desensitizeSection}
                  onSectionChange={setDesensitizeSection}
                />
              </Suspense>
            </div>
          </>
        ) : (
          <>
        {error && !(runtimeConnection !== 'ready' && !activeThreadId) ? renderRuntimeBanner(error, runtimeErrorDetail) : null}

        <div className="flex min-h-0 flex-1">
          <div className={`flex min-h-0 min-w-0 flex-1 ${stageInsetClass}`}>
            <section className="ds-chat-stage ds-drag flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="chat-topbar ds-topbar-surface relative z-10 mt-3 flex min-h-[46px] w-full shrink-0 items-stretch overflow-visible rounded-[24px]">
              <div className="chat-topbar-grid grid w-full min-w-0 items-start gap-2.5 px-3 py-2 sm:px-4 md:pl-5 md:pr-2">
                <div
                  className={`chat-topbar-session flex min-w-0 items-center gap-2.5 ${
                    leftSidebarCollapsed ? 'ds-window-controls-safe-inset' : ''
                  }`}
                >
                  {leftSidebarCollapsed ? (
                    <SidebarTitlebarToggleButton
                      onClick={toggleLeftSidebar}
                      title={t('sidebarExpand')}
                      ariaLabel={t('sidebarExpand')}
                    />
                  ) : null}
                  <SessionHeader compact className="min-w-0 flex-1" />
                </div>
                <div className="chat-topbar-actions flex min-w-0 flex-wrap items-center justify-end gap-2 self-start">
                  {busy ? (
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                        waitingForUserInput
                          ? 'bg-accent/12 text-accent'
                          : 'bg-amber-500/16 text-amber-950 dark:text-amber-100'
                      }`}
                    >
                      {t(waitingForUserInput ? 'waitingForUserInput' : 'running')}
                    </span>
                  ) : null}
                  <WorkbenchTopBar
                    rightPanelMode={rightPanelMode}
                    onToggleRightPanelMode={toggleRightPanelMode}
                    planPanelEnabled={Boolean(activeGuiPlan)}
                    sideChatCount={currentSideConversations.length}
                    sideChatRunningCount={currentSideRunningCount}
                    sideChatOpen={sidePanel.open}
                    sideChatEnabled={runtimeConnection === 'ready' && Boolean(activeThreadId)}
                    onOpenSideChat={openSideChat}
                    conversationFileCount={conversationFiles.length}
                    filesFloatingOpen={filesFloatingOpen}
                    onToggleFilesFloating={toggleFilesFloating}
                  />
                </div>
              </div>
            </header>
            <div className={hasMessages ? 'flex min-h-0 flex-1 flex-col' : 'flex-shrink-0'}>
            <MessageTimeline
              blocks={timelineBlocks}
              liveReasoning={timelineLiveReasoning}
              live={timelineLiveAssistant}
              activeThreadId={activeThreadId}
              runtimeConnection={runtimeConnection}
              runtimeError={error}
              onRetryConnection={() => void probeRuntime('user')}
              onOpenSettings={() => openSettings('agents')}
              onSelectSuggestion={(text) => setInput(text)}
              planActionsBusy={busy}
              onBuildPlan={() => void buildGuiPlan()}
              onOpenPlan={openGuiPlanPanel}
              devPreviewCard={
                showDevPreviewCard ? (
                  <DevPreviewLaunchCard
                    url={latestDevPreviewUrl}
                    opened={rightPanelMode === 'browser'}
                    onOpen={openDevPreview}
                  />
                ) : null
              }
            />
            </div>
            <div className={`flex justify-center px-2 pt-0 sm:px-4 md:px-6 lg:px-8 transition-all duration-300 ease-in-out ${hasMessages ? 'shrink-0 pb-3' : 'flex-col flex-1 items-center justify-center'}`}>
              {!hasMessages && (
                <div className="mb-6 text-center text-2xl font-medium text-ds-muted">
                  我们需要在"{workspaceLabelFromPath(activeSkillWorkspace)}"中做什么？
                </div>
              )}
              <FloatingComposer
                workspaceRootOverride={!hasMessages ? workspaceRoot : undefined}
                input={input}
                setInput={setInput}
                mode={mode}
                setMode={setMode}
                busy={busy}
                hasActiveWork={hasActiveWork}
                runtimeReady={runtimeConnection === 'ready'}
                hasActiveThread={Boolean(activeThreadId)}
                composerModel={
                  route === 'claw'
                    ? clawChannels.find((channel) => channel.id === activeClawChannelId)?.model ?? 'auto'
                    : composerModel
                }
                composerProviderId={route === 'claw' ? undefined : composerProviderId}
                composerPickList={composerPickList}
                composerModelGroups={composerModelGroups}
                composerReasoningEffort={
                  route === 'chat' || route === 'claw' ? composerReasoningEffort : undefined
                }
                onComposerModelChange={(modelId, providerId) => {
                  if (route === 'claw' && activeClawChannelId) {
                    void setClawChannelModel(activeClawChannelId, modelId)
                    return
                  }
                  setComposerModel(modelId, providerId)
                }}
                onModelMenuOpen={() => {
                  void loadComposerModels()
                }}
                onComposerReasoningEffortChange={
                  route === 'chat' || route === 'claw' ? setComposerReasoningEffort : undefined
                }
                onSend={handleSend}
                attachments={composerAttachments}
                attachmentUploadEnabled={attachmentUploadEnabled}
                attachmentUploadBusy={attachmentUploadBusy}
                attachmentUploadError={attachmentUploadError}
                fileReferenceEnabled={route === 'chat'}
                fileReferences={composerFileReferences}
                webAccessAvailable={webAccessAvailable}
                skillCommands={runtimeSkills}
                selectedSkill={route === 'chat' ? selectedComposerSkill : null}
                onSelectSkill={setSelectedComposerSkill}
                onRemoveSelectedSkill={() => setSelectedComposerSkill(null)}
                onPickAttachments={(files) => void handlePickAttachments(files)}
                onPasteClipboardImage={(options) => void handlePasteClipboardImage(options)}
                onPasteLongText={(text) => void handlePasteLongText(text)}
                onRemoveAttachment={removeComposerAttachment}
                onAddFileReference={addComposerFileReference}
                onRemoveFileReference={removeComposerFileReference}
                queuedMessages={queuedMessages}
                onRemoveQueuedMessage={removeQueuedMessage}
                onGuideQueuedMessage={handleGuideQueuedMessage}
                onInterrupt={(options) => void interrupt(options)}
                onInterruptAndSend={handleInterruptAndSend}
                onPlanCommand={() => void handleGuiPlanCommand()}
                onReviewCommand={(target) => void reviewActiveThread(target)}
                onBtwCommand={(seedText) => {
                  if (seedText?.trim()) {
                    void spawnSideConversation(seedText)
                    return
                  }
                  openSideConversationDraft()
                }}
                threads={!hasMessages ? codeThreads : undefined}
                workspaceRoots={!hasMessages ? codeWorkspaceRoots : undefined}
                onSelectWorkspace={!hasMessages ? selectNewConversationWorkspace : undefined}
                onPickWorkspace={!hasMessages ? pickNewConversationWorkspace : undefined}
                onClearWorkspace={clearNewConversationWorkspace}
              />
            </div>
          </section>
          </div>

          {route === 'chat' ? (
            <SideConversationPanel rightOffset={rightPanelVisible ? rightSidebarWidth + 24 : 24} />
          ) : null}

          {route === 'chat' ? (
            <Suspense fallback={null}>
              <ConversationFilesFloating
                files={conversationFiles}
                open={filesFloatingOpen}
                onClose={() => setFilesFloatingOpen(false)}
                onOpenFile={openConversationFilePreview}
              />
            </Suspense>
          ) : null}

          {renderRightPanel()}
        </div>

          </>
        )}
      </main>
    </div>
    </DocumentWritingProvider>
  )
}
