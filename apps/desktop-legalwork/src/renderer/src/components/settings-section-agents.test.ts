import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { defaultLegalworkRuntimeSettings } from '@shared/app-settings'
import { AgentsSettingsSection } from './settings-section-agents'

const labels: Record<string, string> = {
  agentsQuickBase: 'Base',
  agentsQuickSkill: 'Skills',
  agentsQuickMcp: 'MCP',
  agentsQuickPermissions: 'Permissions',
  agents: 'Agents',
  legalworkProvider: 'Provider',
  legalworkProviderDesc: 'Provider description',
  legalworkApiKey: 'Legalwork API key',
  legalworkApiKeyDesc: 'Legalwork API key description',
  legalworkApiKeyPlaceholder: 'Inherit API key',
  legalworkApiKeyInherited: 'Inherited API key',
  legalworkApiKeyMissing: 'Missing API key',
  legalworkApiKeyOverride: 'Override API key',
  legalworkBaseUrl: 'Legalwork base URL',
  legalworkBaseUrlDesc: 'Legalwork base URL description',
  legalworkBaseUrlPlaceholder: 'Inherit base URL',
  legalworkBaseUrlOfficial: 'Official base URL',
  legalworkBaseUrlInherited: 'Inherited base URL',
  legalworkBaseUrlOverride: 'Override base URL',
  legalworkAssistantAdvanced: 'Assistant advanced settings',
  legalworkAssistantAdvancedDesc: 'Assistant advanced settings description',
  autoStart: 'Auto start',
  autoStartDesc: 'Auto start description',
  port: 'Port',
  portDesc: 'Port description',
  legalworkBinary: 'Legalwork binary',
  legalworkBinaryDesc: 'Legalwork binary description',
  legalworkBinaryPlaceholder: 'Bundled Legalwork',
  legalworkDataDir: 'Data dir',
  legalworkDataDirDesc: 'Data dir description',
  legalworkModel: 'Model',
  legalworkModelDesc: 'Model description',
  legalworkTokenEconomy: 'Token-saving mode',
  legalworkTokenEconomyDesc: 'Token-saving mode description',
  legalworkTokenEconomySavings: 'Saved {{tokens}} / {{cost}}',
  legalworkTokenEconomySavingsLoading: 'Loading savings',
  legalworkTokenEconomySavingsEmpty: 'Savings empty',
  legalworkTokenEconomyAdvanced: 'Token-saving advanced settings',
  legalworkTokenEconomyAdvancedDesc: 'Token-saving advanced settings description',
  legalworkTokenEconomyOptions: 'Token-saving options',
  legalworkTokenEconomyOptionsDesc: 'Token-saving options description',
  legalworkCompressToolDescriptions: 'Compress tool descriptions',
  legalworkCompressToolResults: 'Compress tool results',
  legalworkConciseResponses: 'Concise responses',
  legalworkHistoryHygiene: 'History guard',
  legalworkHistoryHygieneDesc: 'History guard description',
  legalworkHistoryMaxResultLines: 'Max result lines',
  legalworkHistoryMaxResultBytes: 'Max result bytes',
  legalworkHistoryMaxResultTokens: 'Max result tokens',
  legalworkHistoryMaxArgumentBytes: 'Max argument bytes',
  legalworkHistoryMaxArgumentTokens: 'Max argument tokens',
  legalworkHistoryMaxArrayItems: 'Max array items',
  runtimeToken: 'Runtime token',
  runtimeTokenDesc: 'Runtime token description',
  showSecret: 'Show',
  hideSecret: 'Hide',
  legalworkInsecure: 'Insecure',
  legalworkInsecureDesc: 'Insecure description',
  legalworkInsecureForcedDesc: 'Insecure forced',
  legalworkAdvanced: 'Advanced runtime settings',
  legalworkAdvancedDetails: 'Storage, model context, and tool guards',
  legalworkAdvancedDetailsDesc: 'Per-model context policy comes from models.profiles',
  legalworkStorageBackend: 'Storage backend',
  legalworkStorageBackendDesc: 'Storage backend description',
  legalworkStorageHybrid: 'Hybrid storage',
  legalworkStorageFile: 'Pure JSONL file storage',
  legalworkStorageSqlitePath: 'SQLite path',
  legalworkStorageSqlitePathDesc: 'SQLite path description',
  legalworkStorageSqlitePathPlaceholder: 'Automatic SQLite path',
  legalworkModelContextProfile: 'Current model context policy',
  legalworkModelContextProfileDesc: 'Current model context policy description',
  legalworkModelContextModel: 'Matched model',
  legalworkModelContextWindow: 'Context window',
  legalworkModelContextSoft: 'Model soft threshold',
  legalworkModelContextHard: 'Model hard threshold',
  legalworkModelContextSourceBuiltIn: 'Built-in model config',
  legalworkModelContextSourceFallback: 'Fallback model config',
  legalworkCompactionThresholds: 'Fallback compaction thresholds',
  legalworkCompactionThresholdsDesc: 'Fallback compaction thresholds description',
  legalworkCompactionSoftThreshold: 'Fallback soft threshold',
  legalworkCompactionHardThreshold: 'Fallback hard threshold',
  legalworkCompactionSummary: 'Compaction summary',
  legalworkCompactionSummaryDesc: 'Compaction summary description',
  legalworkCompactionSummaryMode: 'Summary mode',
  legalworkCompactionSummaryHeuristic: 'Heuristic summary',
  legalworkCompactionSummaryModel: 'Model summary',
  legalworkCompactionSummaryTimeout: 'Summary timeout',
  legalworkCompactionSummaryMaxTokens: 'Summary max tokens',
  legalworkCompactionSummaryInputBytes: 'Summary input bytes',
  legalworkToolStorm: 'Tool storm',
  legalworkToolStormDesc: 'Tool storm description',
  legalworkToolStormLimits: 'Tool storm limits',
  legalworkToolStormLimitsDesc: 'Tool storm limits description',
  legalworkToolStormWindowSize: 'Tool storm window',
  legalworkToolStormThreshold: 'Tool storm threshold',
  legalworkToolArgumentRepair: 'Tool argument repair',
  legalworkToolArgumentRepairDesc: 'Tool argument repair description',
  legalworkDiagnostics: 'Legalwork diagnostics',
  legalworkDiagnosticsAdvanced: 'Detailed diagnostics',
  legalworkDiagnosticsAdvancedDesc: 'Detailed diagnostics description',
  legalworkRuntimeCapabilities: 'Runtime capabilities',
  legalworkRuntimeCapabilitiesDesc: 'Runtime capabilities description',
  legalworkRuntimeModel: 'Runtime model',
  legalworkRuntimePid: 'Runtime PID',
  legalworkDiagnosticsRefresh: 'Refresh diagnostics',
  legalworkToolDiagnostics: 'Tool diagnostics',
  legalworkToolDiagnosticsDesc: 'Tool diagnostics description',
  legalworkDiagnosticsProviders: 'Providers',
  legalworkDiagnosticsMcpServers: 'MCP servers',
  legalworkDiagnosticsSkills: 'Discovered Skills',
  legalworkDiagnosticsAttachments: 'Attachments',
  legalworkMemoryRecords: 'Memory records',
  legalworkMemoryRecordsDesc: 'Memory records description',
  legalworkMemoryEmpty: 'No memories',
  legalworkMemoryDisable: 'Disable memory',
  legalworkMemoryDelete: 'Delete memory',
  legalworkMemoryDisabled: 'Disabled',
  skill: 'Skill',
  skillsLocation: 'Skill location',
  skillsLocationDesc: 'Skill location description',
  skillsPath: 'Skills path',
  skillsPathDesc: 'Skills path description',
  skillsRootUnavailable: 'Unavailable',
  skillsScanDirs: 'Scan dirs',
  skillsScanDirsDesc: 'Scan dirs description',
  skillsActions: 'Skill actions',
  skillsActionsDesc: 'Skill actions description',
  skillsOpenRoot: 'Open root',
  skillsOpenPlugins: 'Open plugins',
  mcp: 'MCP',
  mcpSearchEnabled: 'MCP search enabled',
  mcpSearchEnabledDesc: 'MCP search description',
  mcpServers: 'Connected MCP services',
  mcpServersDesc: 'Connected MCP services description',
  mcpServersEmpty: 'No MCP services configured',
  mcpServerEnabled: 'Enabled',
  mcpServerDisabled: 'Disabled',
  mcpServerAuth: 'Auth',
  mcpServerTools: '{{count}} tools',
  mcpEnable: 'Enable',
  mcpDisable: 'Disable',
  mcpRemove: 'Remove',
  mcpYuandian: 'Yuandian Legal Intelligence MCP',
  mcpYuandianDesc: 'Yuandian MCP description',
  mcpYuandianKeyPlaceholder: 'Yuandian API key',
  mcpYuandianAdd: 'Add Yuandian MCP',
  mcpYuandianKeyRequired: 'Yuandian API key required',
  mcpCustomAdd: 'Add any MCP',
  mcpCustomAddDesc: 'Add any MCP description',
  mcpCustomId: 'Service ID',
  mcpCustomUrl: 'MCP URL',
  mcpCustomCommand: 'Command',
  mcpCustomArgs: 'Arguments',
  mcpCustomHeaders: 'Headers JSON',
  mcpCustomEnv: 'Env JSON',
  mcpCustomAddButton: 'Add MCP',
  mcpCustomIdRequired: 'MCP ID required',
  mcpCustomIdExists: 'MCP ID exists',
  mcpCustomUrlRequired: 'MCP URL required',
  mcpAdvanced: 'MCP advanced settings',
  mcpAdvancedDesc: 'MCP advanced settings description',
  mcpSearchMode: 'MCP search mode',
  mcpSearchModeDesc: 'MCP search mode description',
  mcpSearchModeAuto: 'Auto mode',
  mcpSearchModeSearch: 'Search mode',
  mcpSearchModeDirect: 'Direct mode',
  mcpSearchLimits: 'MCP search limits',
  mcpSearchLimitsDesc: 'MCP search limits description',
  mcpSearchAutoThreshold: 'Auto threshold',
  mcpSearchTopKDefault: 'Default results',
  mcpSearchTopKMax: 'Max results',
  mcpSearchMinScore: 'Minimum score',
  mcpSearchDiagnostics: 'MCP search diagnostics',
  mcpSearchDiagnosticsDesc: 'MCP search diagnostics description',
  mcpSearchStatus: 'MCP search status',
  mcpSearchActive: 'Active',
  mcpSearchInactive: 'Inactive',
  mcpSearchIndexed: 'Indexed',
  mcpSearchAdvertised: 'Advertised',
  configFilePath: 'External tool config path',
  mcpPathDesc: 'MCP JSON path description',
  mcpEditor: 'MCP editor',
  mcpEditorDesc: 'Model and API credentials do not live in this MCP file',
  mcpFileStatusReady: 'MCP config ready',
  mcpFileStatusMissing: 'MCP config missing',
  loading: 'Loading',
  mcpActions: 'MCP actions',
  mcpRuntimeHint: 'MCP runtime hint',
  mcpSave: 'Save MCP config',
  mcpReload: 'Reload MCP config',
  mcpOpenDir: 'Open MCP directory',
  permissions: 'Permissions',
  approvalPolicy: 'Approval policy',
  approvalPolicyDesc: 'Approval policy description',
  approvalAuto: 'Auto',
  approvalOnRequest: 'On request',
  approvalUntrusted: 'Untrusted',
  approvalSuggest: 'Suggest',
  approvalNever: 'Never',
  sandboxMode: 'Sandbox mode',
  sandboxModeDesc: 'Sandbox description',
  sandboxWorkspaceWrite: 'Workspace write',
  sandboxReadOnly: 'Read only',
  sandboxFullAccess: 'Full access',
  sandboxExternal: 'External sandbox'
}

function t(key: string): string {
  return labels[key] ?? key
}

function baseCtx(): Record<string, unknown> {
  const noop = () => undefined
  const asyncNoop = async () => undefined
  const ref = { current: null }
  const legalwork = {
    ...defaultLegalworkRuntimeSettings(),
    autoStart: true,
    runtimeToken: '',
    insecure: true
  }
  return {
    t,
    tCommon: t,
    form: { claw: { skills: { extraDirs: ['/tmp/project/.agents/skills'] } } },
    legalwork,
    activeApiKey: '',
    update: noop,
    updateLegalwork: noop,
    updateSharedCredential: noop,
    sharedApiKey: '',
    sharedBaseUrl: '',
    showApiKey: false,
    setShowApiKey: noop,
    showRuntimeToken: false,
    setShowRuntimeToken: noop,
    portError: '',
    selectControlClass: 'select',
    openOnboardingPreview: noop,
    pickWorkspace: asyncNoop,
    resetWorkspaceToDefault: noop,
    workspacePickerError: '',
    guiUpdateInfo: null,
    checkingGuiUpdate: false,
    downloadingGuiUpdate: false,
    installingGuiUpdate: false,
    guiUpdateDownloaded: false,
    guiUpdateProgress: null,
    guiUpdateError: null,
    checkGuiUpdate: asyncNoop,
    downloadGuiUpdate: asyncNoop,
    installGuiUpdate: asyncNoop,
    logPath: '',
    logDirOpenError: '',
    setLogDirOpenError: noop,
    pickWriteWorkspace: asyncNoop,
    resetWriteWorkspaceToDefault: noop,
    writeWorkspacePickerError: '',
    writeInlineBaseUrlInherited: false,
    effectiveWriteInlineBaseUrl: '',
    writeInlineModelInherited: false,
    effectiveWriteInlineModel: '',
    setWriteDebugModalOpen: noop,
    loadWriteDebugEntries: asyncNoop,
    scrollToAgentSection: noop,
    agentsSectionRef: ref,
    skillSectionRef: ref,
    mcpSectionRef: ref,
    permissionsSectionRef: ref,
    selectedSkillRoot: {
      id: 'workspace',
      label: 'Workspace',
      path: '/tmp/project/.agents/skills',
      available: true
    },
    skillRootOptions: [
      {
        id: 'workspace',
        label: 'Workspace',
        path: '/tmp/project/.agents/skills',
        available: true
      }
    ],
    skillRootId: 'workspace',
    setSkillRootId: noop,
    skillNotice: null,
    openSkillRoot: asyncNoop,
    openPlugins: noop,
    mcpConfigPath: '/tmp/project/.legalwork/mcp.json',
    mcpConfigExists: true,
    mcpConfigText: '{"mcpServers":{}}',
    setMcpConfigText: noop,
    mcpLoading: false,
    mcpBusy: false,
    mcpNotice: null,
    saveMcpConfig: asyncNoop,
    loadMcpConfig: asyncNoop,
    openMcpConfigDir: asyncNoop,
    runtimeInfo: null,
    toolDiagnostics: null,
    memoryRecords: [],
    runtimeDiagnosticsBusy: false,
    runtimeDiagnosticsNotice: null,
    refreshLegalworkDiagnostics: asyncNoop,
    disableMemoryRecord: asyncNoop,
    deleteMemoryRecord: asyncNoop,
    pickClawWorkspace: asyncNoop,
    resetClawWorkspaceToDefault: noop,
    clawWorkspacePickerError: '',
    splitSettingsList: (value: string) => value.split('\n').filter(Boolean),
    listSettingsText: (value: string[]) => value.join('\n')
  }
}

describe('AgentsSettingsSection Legalwork diagnostics smoke', () => {
  it('keeps advanced agent controls behind collapsed disclosures', () => {
    const html = renderToStaticMarkup(createElement(AgentsSettingsSection, { ctx: baseCtx() }))

    expect(html).toContain('Assistant advanced settings')
    expect(html).toContain('Token-saving advanced settings')
    expect(html).toContain('MCP advanced settings')
    expect(html).not.toContain('<details open')
  })

  it('renders pure JSONL as a selectable storage backend', () => {
    const html = renderToStaticMarkup(createElement(AgentsSettingsSection, { ctx: baseCtx() }))

    expect(html).toContain('Storage backend')
    expect(html).toContain('<option value="hybrid"')
    expect(html).toContain('Hybrid storage')
    expect(html).toContain('<option value="file"')
    expect(html).toContain('Pure JSONL file storage')
  })

  it('shows DeepSeek V4 model compaction thresholds from the model profile', () => {
    const html = renderToStaticMarkup(createElement(AgentsSettingsSection, { ctx: baseCtx() }))

    expect(html).toContain('Current model context policy')
    expect(html).toContain('deepseek-v4-pro')
    expect(html).toContain('Built-in model config')
    expect(html).toContain('1,000,000')
    expect(html).toContain('980,000')
    expect(html).toContain('990,000')
    expect(html).toContain('Fallback compaction thresholds')
  })

  it('renders MCP, Skill, web, attachment, and memory diagnostics', () => {
    const ctx = {
      ...baseCtx(),
      runtimeInfo: {
        pid: 123,
        capabilities: {
          model: { id: 'deepseek-chat' },
          mcp: { status: 'available', configuredServers: 2, connectedServers: 2 },
          web: { status: 'available', provider: 'brave-search' },
          skills: { status: 'available' },
          subagents: { status: 'available' },
          attachments: { status: 'available' },
          memory: { status: 'available' }
        }
      },
      toolDiagnostics: {
        providers: [{ id: 'builtin' }, { id: 'mcp' }, { id: 'web' }, { id: 'memory' }],
        mcpServers: [{ id: 'github' }],
        skills: { skills: [{ id: 'skill_docs' }] },
        attachments: { count: 1 }
      },
      memoryRecords: [
        {
          id: 'mem_1',
          content: 'Prefer pnpm for this workspace',
          scope: 'workspace',
          tags: ['tooling']
        }
      ]
    }

    const html = renderToStaticMarkup(createElement(AgentsSettingsSection, { ctx }))

    expect(html).toContain('Legalwork diagnostics')
    expect(html).toContain('MCP')
    expect(html).toContain('available')
    expect(html).toContain('2/2')
    expect(html).toContain('brave-search')
    expect(html).toContain('Providers')
    expect(html).toContain('MCP servers')
    expect(html).toContain('Discovered Skills')
    expect(html).toContain('Prefer pnpm for this workspace')
    expect(html).toContain('mem_1')
    expect(html).toContain('Disable memory')
    expect(html).toContain('Delete memory')
  })

  it('describes MCP config as an external-tool JSON file instead of model credentials', () => {
    const html = renderToStaticMarkup(createElement(AgentsSettingsSection, { ctx: baseCtx() }))

    expect(html).toContain('External tool config path')
    expect(html).toContain('/tmp/project/.legalwork/mcp.json')
    expect(html).toContain('Model and API credentials do not live in this MCP file')
    expect(html).not.toContain('DeepSeek auth')
    expect(html).not.toContain('Base URL are stored in this file')
    expect(html).not.toContain('config.toml')
  })
})
