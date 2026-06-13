import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  Clock3,
  Database,
  FileQuestion,
  FileText,
  LayoutGrid,
  Plus,
  Scale,
  Settings,
  Smartphone
} from 'lucide-react'
import type { NormalizedThread } from '../../agent/types'
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

type Props = {
  threads: NormalizedThread[]
  activeThreadId: string | null
  activeView: 'chat' | 'dataCompliance' | 'desensitize' | 'claw' | 'schedule' | 'documentWriting' | 'legalResearch' | 'knowledgeBase'
  dataComplianceSection: DataComplianceSection
  desensitizeSection: DesensitizeSection
  connectPhoneSidebarOpen: boolean
  pluginsActive: boolean
  knowledgePanelOpen: boolean
  runtimeReady: boolean
  threadSearch: string
  showArchivedThreads: boolean
  legalResearchRecords: ResearchRecord[]
  activeLegalResearchRecordId: string | null
  onThreadSearchChange: (query: string) => void
  onShowArchivedThreadsChange: (show: boolean) => void
  onSelectThread: (id: string) => void
  onRenameThread: (id: string, title: string) => Promise<void>
  onArchiveThread: (id: string) => Promise<void>
  onDeleteThread: (id: string) => Promise<void>
  onRestoreThread: (id: string) => Promise<void>
  onNewChat: () => void
  onNewChatInWorkspace: (workspaceRoot: string) => void
  onNewRequirement: () => void
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
  runtimeReady,
  threadSearch,
  showArchivedThreads,
  legalResearchRecords,
  activeLegalResearchRecordId,
  onThreadSearchChange,
  onShowArchivedThreadsChange,
  onSelectThread,
  onRenameThread,
  onArchiveThread,
  onDeleteThread,
  onRestoreThread,
  onNewChat,
  onNewChatInWorkspace,
  onNewRequirement,
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

  const activeClawChannel = useMemo(
    () => clawChannels.find((channel) => channel.id === activeClawChannelId) ?? clawChannels[0] ?? null,
    [clawChannels, activeClawChannelId]
  )

  return (
    <>
    <SidebarFrame
      title={t('appName')}
      onCollapse={onToggleSidebar}
      footer={
        <div className="space-y-1">
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
        <WorkspaceModeTabs
          activeView={activeView === 'knowledgeBase' ? 'chat' : activeView}
          onCodeOpen={onCodeOpen}
          onDesensitizeOpen={onDesensitizeOpen}
          onDataComplianceOpen={onDataComplianceOpen}
        />

        {activeView === 'chat' || activeView === 'knowledgeBase' ? (
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
              icon={<FileQuestion className="h-4 w-4" strokeWidth={1.9} />}
              label={t('sddNewRequirement')}
              onClick={runtimeReady ? onNewRequirement : undefined}
              disabled={!runtimeReady}
              disabledHint={t('runtimeActionNeedsConnection')}
              variant="accent"
            />
            <SidebarCommandRow
              icon={<FileText className="h-4 w-4" strokeWidth={1.75} />}
              label={t('documentWriting')}
              onClick={onDocumentWritingOpen}
              active={false}
            />
            <SidebarCommandRow
              icon={<Scale className="h-4 w-4" strokeWidth={1.75} />}
              label={t('legalResearch')}
              onClick={onLegalResearchOpen}
              active={false}
            />
            <SidebarCommandRow
              icon={<Database className="h-4 w-4" strokeWidth={1.75} />}
              label={t('knowledgeBase')}
              onClick={onKnowledgeOpen}
              active={knowledgePanelOpen}
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
              active={false}
            />
          </>
        ) : null}
      </div>

      <div className="ds-no-drag mx-1 my-3" />

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
        <div className="ds-no-drag flex min-h-0 flex-1 flex-col px-2 pt-1">
          <div className="px-1 text-[15px] font-normal text-ds-faint">
            {t('documentWriting')}
          </div>
        </div>
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
          <div className="px-1 text-[15px] font-normal text-ds-faint">
            {t('schedule')}
          </div>
        </div>
      ) : activeView === 'knowledgeBase' ? (
        <div className="ds-no-drag flex min-h-0 flex-1 flex-col px-2 pt-1">
          <div className="px-1 text-[15px] font-normal text-ds-faint">
            {t('knowledgeBase')}
          </div>
        </div>
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
