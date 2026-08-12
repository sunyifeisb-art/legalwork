import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  BrainCircuit,
  Clock3,
  Database,
  FileText,
  LayoutGrid,
  LoaderCircle,
  Plus,
  Scale,
  Settings,
  Smartphone
} from 'lucide-react'
import { GuiUpdateBadge } from '../sidebar/GuiUpdateBadge'
import type { NormalizedThread, RuntimeConnectionStatus } from '../../agent/types'
import { useChatStore, type SettingsRouteSection } from '../../store/chat-store'
import type {
  ClawImChannelV1,
} from '@shared/app-settings'
import {
  ClawSidebarContent
} from './SidebarClaw'
import type { ClawImDialogMode } from './SidebarClawDialogHelpers'
import { ClawAddImDialog } from './SidebarClawDialog'
import { ConnectPhoneSidebarPanel } from './ConnectPhoneView'
import { SidebarProjectsSection } from './SidebarProjectsSection'
import { WorkspaceModeTabs } from './WorkspaceModeTabs'
import {
  SidebarCommandRow,
  SidebarFrame
} from '../sidebar/SidebarPrimitives'
import {
  DataComplianceSidebarNav,
  DesensitizeSidebarNav,
  type DataComplianceSection,
  type DesensitizeSection
} from '../data-compliance/DataCompliancePanel'
import { LegalResearchSidebar } from '../legal-research/LegalResearchSidebar'
import type { ResearchRecord } from '../legal-research/useLegalResearch'
import { KnowledgeBaseChatSidebar } from '../knowledge-base/KnowledgeBaseChatSidebar'
import { DocumentWritingSidebarContent } from '../document-writing/DocumentWritingSidebarContent'
import { LearningIterationSidebar } from '../learning-iteration/LearningIterationSidebar'
import {
  getWorkspaceModeView,
  isAgentWorkspaceView,
  type SidebarView
} from './sidebar-navigation-model'

type Props = {
  threads: NormalizedThread[]
  activeThreadId: string | null
  activeView: SidebarView
  dataComplianceSection: DataComplianceSection
  desensitizeSection: DesensitizeSection
  connectPhoneSidebarOpen: boolean
  pluginsActive: boolean
  knowledgePanelOpen: boolean
  runtimeConnection: RuntimeConnectionStatus
  runtimeReady: boolean
  threadSearch: string
  showArchivedThreads: boolean
  legalResearchRecords: ResearchRecord[]
  activeLegalResearchRecordId: string | null
  knowledgeChatThreads: NormalizedThread[]
  activeKnowledgeChatThreadId: string | null
  onThreadSearchChange: (query: string) => void
  onShowArchivedThreadsChange: (show: boolean) => void
  onSelectThread: (id: string) => void
  onRenameThread: (id: string, title: string) => Promise<void>
  onArchiveThread: (id: string) => Promise<void>
  onDeleteThread: (id: string) => Promise<void>
  onRestoreThread: (id: string) => Promise<void>
  onNewChat: () => void
  onNewChatInWorkspace: (workspaceRoot: string) => void
  onLearningIterationOpen: () => void
  onOpenSettings: (section?: SettingsRouteSection) => void
  onOpenPlugins: () => void
  onToggleConnectPhone: () => void
  onCodeOpen: () => void
  onDesensitizeOpen: () => void
  onDesensitizeSectionChange: (section: DesensitizeSection) => void
  onDataComplianceOpen: () => void
  onDataComplianceSectionChange: (section: DataComplianceSection) => void
  onScheduleOpen: () => void
  onDocumentWritingOpen: () => void
  onLegalResearchOpen: () => void
  onKnowledgeOpen: () => void
  onSelectLegalResearchRecord: (id: string) => void
  onDeleteLegalResearchRecord: (id: string) => void
  onClearLegalResearchHistory: () => void
  onStopLegalResearch: () => void
  onSelectKnowledgeChatThread: (id: string) => void
  onDeleteKnowledgeChatThread: (id: string) => void
  onToggleSidebar: () => void
}

export function Sidebar({
  threads,
  activeThreadId,
  activeView,
  dataComplianceSection,
  desensitizeSection,
  connectPhoneSidebarOpen,
  pluginsActive,
  knowledgePanelOpen,
  runtimeConnection,
  runtimeReady,
  threadSearch,
  showArchivedThreads,
  legalResearchRecords,
  activeLegalResearchRecordId,
  knowledgeChatThreads,
  activeKnowledgeChatThreadId,
  onThreadSearchChange,
  onShowArchivedThreadsChange,
  onSelectThread,
  onRenameThread,
  onArchiveThread,
  onDeleteThread,
  onRestoreThread,
  onNewChat,
  onNewChatInWorkspace,
  onLearningIterationOpen,
  onOpenSettings,
  onOpenPlugins,
  onToggleConnectPhone,
  onCodeOpen,
  onDesensitizeOpen,
  onDesensitizeSectionChange,
  onDataComplianceOpen,
  onDataComplianceSectionChange,
  onScheduleOpen,
  onDocumentWritingOpen,
  onLegalResearchOpen,
  onKnowledgeOpen,
  onSelectLegalResearchRecord,
  onDeleteLegalResearchRecord,
  onClearLegalResearchHistory,
  onStopLegalResearch,
  onSelectKnowledgeChatThread,
  onDeleteKnowledgeChatThread,
  onToggleSidebar
}: Props): ReactElement {
  const { t, i18n } = useTranslation('common')
  const workspaceRoot = useChatStore((s) => s.workspaceRoot)
  const codeWorkspaceRoots = useChatStore((s) => s.codeWorkspaceRoots)
  const chooseWorkspace = useChatStore((s) => s.chooseWorkspace)
  const deleteWorkspace = useChatStore((s) => s.deleteWorkspace)
  const busy = useChatStore((s) => s.busy)
  const watchTurnCompletion = useChatStore((s) => s.watchTurnCompletion)
  const unreadThreadIds = useChatStore((s) => s.unreadThreadIds)
  const clawChannels = useChatStore((s) => s.clawChannels)
  const activeClawChannelId = useChatStore((s) => s.activeClawChannelId)
  const selectClawChannel = useChatStore((s) => s.selectClawChannel)
  const addClawChannel = useChatStore((s) => s.addClawChannel)
  const deleteClawChannel = useChatStore((s) => s.deleteClawChannel)
  const resetClawChannelSession = useChatStore((s) => s.resetClawChannelSession)

  const [imDialogMode, setImDialogMode] = useState<ClawImDialogMode | null>(null)
  const showAgentStartingHint = !runtimeReady && (runtimeConnection === 'idle' || runtimeConnection === 'checking')
  const showAgentRetryingHint = !runtimeReady && runtimeConnection === 'offline'

  const activeClawChannel = useMemo(
    () => clawChannels.find((channel) => channel.id === activeClawChannelId) ?? clawChannels[0] ?? null,
    [clawChannels, activeClawChannelId]
  )

  return (
    <>
    <SidebarFrame
      title={t('appName')}
      onCollapse={onToggleSidebar}
      titlebarContent={
        <WorkspaceModeTabs
          activeView={getWorkspaceModeView(activeView)}
          onCodeOpen={onCodeOpen}
          onDesensitizeOpen={onDesensitizeOpen}
          onDataComplianceOpen={onDataComplianceOpen}
        />
      }
      footer={
        <div className="space-y-1">
          <GuiUpdateBadge />
          <SidebarCommandRow
            icon={<Smartphone className="h-4 w-4" strokeWidth={1.75} />}
            label={t('claw')}
            onClick={onToggleConnectPhone}
            active={connectPhoneSidebarOpen}
            variant="footer"
          />
          <SidebarCommandRow
            icon={<Settings className="h-4 w-4" strokeWidth={1.75} />}
            label={t('settings')}
            onClick={() => onOpenSettings('general')}
            variant="footer"
          />
        </div>
      }
    >
      <div className="ds-no-drag flex flex-col px-1">
        {isAgentWorkspaceView(activeView) ? (
          <>
            <SidebarCommandRow
              icon={<Plus className="h-4 w-4" strokeWidth={2} />}
              label={t('newAgent')}
              onClick={runtimeReady ? onNewChat : undefined}
              disabled={!runtimeReady}
              disabledHint={t('runtimeActionNeedsConnection')}
              variant="accent"
            />
            <SidebarCommandRow
              icon={<BrainCircuit className="h-4 w-4" strokeWidth={1.8} />}
              label={t('learningIteration')}
              onClick={onLearningIterationOpen}
              active={activeView === 'learningIteration'}
              variant="accent"
            />
            {showAgentStartingHint ? (
              <div className="mx-2 mb-1 mt-1 flex items-start gap-2 rounded-[8px] border border-ds-border-muted bg-ds-subtle px-2.5 py-2 text-[12px] leading-5 text-ds-muted">
                <LoaderCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-accent" strokeWidth={2} />
                <span className="min-w-0">{t('sidebarAgentStarting')}</span>
              </div>
            ) : null}
            {showAgentRetryingHint ? (
              <div className="mx-2 mb-1 mt-1 flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 px-2.5 py-2 text-[12px] leading-5 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                <LoaderCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" strokeWidth={2} />
                <span className="min-w-0">{t('sidebarAgentRetrying')}</span>
              </div>
            ) : null}
            <SidebarCommandRow
              icon={<FileText className="h-4 w-4" strokeWidth={1.75} />}
              label={t('documentWriting')}
              onClick={onDocumentWritingOpen}
              active={activeView === 'documentWriting'}
            />
            <SidebarCommandRow
              icon={<Scale className="h-4 w-4" strokeWidth={1.75} />}
              label={t('legalResearch')}
              onClick={onLegalResearchOpen}
              active={activeView === 'legalResearch'}
            />
            <SidebarCommandRow
              icon={<Database className="h-4 w-4" strokeWidth={1.75} />}
              label={t('knowledgeBase')}
              onClick={onKnowledgeOpen}
              active={activeView === 'knowledgeBase' || knowledgePanelOpen}
            />
            <SidebarCommandRow
              icon={<LayoutGrid className="h-4 w-4" strokeWidth={1.75} />}
              label={t('plugins')}
              onClick={onOpenPlugins}
              active={pluginsActive}
            />
            <SidebarCommandRow
              icon={<Clock3 className="h-4 w-4" strokeWidth={1.75} />}
              label={t('schedule')}
              onClick={onScheduleOpen}
              active={activeView === 'schedule'}
            />
          </>
        ) : null}
      </div>

      <div className={`ds-no-drag mx-1 ${activeView === 'documentWriting' ? 'my-1' : 'my-3'}`} />

      {connectPhoneSidebarOpen ? (
        <ConnectPhoneSidebarPanel
          channels={clawChannels}
          onAddProvider={async (provider, agentProfile, platformCredential, options) => {
            await addClawChannel(provider, agentProfile, platformCredential, options)
            onToggleConnectPhone()
          }}
          onDisconnect={(channelId) => deleteClawChannel(channelId)}
          onOpenSettings={() => onOpenSettings('claw')}
        />
      ) : activeView === 'learningIteration' ? (
        <LearningIterationSidebar />
      ) : activeView === 'claw' ? (
        <ClawSidebarContent
          channels={clawChannels}
          activeChannelId={activeClawChannelId}
          activeThreadId={activeThreadId}
          runtimeReady={runtimeReady}
          onSelectChannel={(channelId) => void selectClawChannel(channelId)}
          onAddChannel={() => setImDialogMode('add')}
          onResetChannel={(channelId) => void resetClawChannelSession(channelId)}
          onOpenSettings={() => setImDialogMode('edit')}
          t={t}
        />
      ) : activeView === 'documentWriting' ? (
        <DocumentWritingSidebarContent />
      ) : activeView === 'legalResearch' ? (
        <LegalResearchSidebar
          records={legalResearchRecords}
          activeRecordId={activeLegalResearchRecordId}
          onSelectRecord={onSelectLegalResearchRecord}
          onDeleteRecord={onDeleteLegalResearchRecord}
          onClearHistory={onClearLegalResearchHistory}
          onStopResearch={onStopLegalResearch}
        />
      ) : activeView === 'schedule' ? (
        <div className="ds-no-drag flex min-h-0 flex-1 flex-col px-2 pt-1">
          <div className="px-1 text-[13px] font-medium text-ds-faint">
            {t('schedule')}
          </div>
        </div>
      ) : activeView === 'knowledgeBase' ? (
        <KnowledgeBaseChatSidebar
          threads={knowledgeChatThreads}
          activeThreadId={activeKnowledgeChatThreadId}
          onSelectThread={onSelectKnowledgeChatThread}
          onDeleteThread={onDeleteKnowledgeChatThread}
        />
      ) : activeView === 'desensitize' ? (
        <DesensitizeSidebarNav
          activeSection={desensitizeSection}
          onSectionChange={onDesensitizeSectionChange}
        />
      ) : activeView === 'dataCompliance' ? (
        <DataComplianceSidebarNav
          activeSection={dataComplianceSection}
          onSectionChange={onDataComplianceSectionChange}
        />
      ) : (
      <SidebarProjectsSection
        threads={threads}
        activeView="chat"
        activeThreadId={activeThreadId}
        runtimeReady={runtimeReady}
        searchQuery={threadSearch}
        showArchived={showArchivedThreads}
        workspaceRoot={workspaceRoot}
        workspaceRoots={codeWorkspaceRoots}
        busy={busy}
        watchTurnCompletion={watchTurnCompletion}
        unreadThreadIds={unreadThreadIds}
        locale={i18n.language}
        onPickWorkspace={() => void chooseWorkspace()}
        onRemoveWorkspace={deleteWorkspace}
        onCreateThreadInWorkspace={onNewChatInWorkspace}
        onSelectThread={onSelectThread}
        onRenameThread={onRenameThread}
        onArchiveThread={onArchiveThread}
        onDeleteThread={onDeleteThread}
        onRestoreThread={onRestoreThread}
        onSearchQueryChange={onThreadSearchChange}
        onShowArchivedChange={onShowArchivedThreadsChange}
        t={t}
      />
      )}

    </SidebarFrame>

    {imDialogMode ? (
      <ClawAddImDialog
        mode={imDialogMode}
        initialProvider={activeClawChannel?.provider}
        initialChannelId={imDialogMode === 'edit' ? activeClawChannel?.id : undefined}
        channels={clawChannels}
        onClose={() => setImDialogMode(null)}
        onAddProvider={(provider, agentProfile, platformCredential, options) =>
          addClawChannel(provider, agentProfile, platformCredential, options)
        }
        onDeleteChannel={(channelId) => deleteClawChannel(channelId)}
        t={t}
      />
    ) : null}
    </>
  )
}
