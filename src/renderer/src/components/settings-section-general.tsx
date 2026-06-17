import type { ReactElement } from 'react'
import type { ApprovalPolicy, AppSettingsV1, SandboxMode } from '@shared/app-settings'
import {
  BUILTIN_MODEL_PROVIDER_PRESETS,
  DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL,
  DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS,
  DEFAULT_WRITE_INLINE_COMPLETION_MODEL,
  DEFAULT_WRITE_INLINE_LONG_COMPLETION_MAX_TOKENS,
  DEFAULT_LEGALWORK_DATA_DIR,
  DEFAULT_MODEL_PROVIDER_ID,
  WRITE_INLINE_COMPLETION_MODEL_IDS,
  getBuiltinModelProviderPreset,
  getModelProviderProfile,
  isLegalworkRuntimeInsecure,
  legalworkSettingsPatch
} from '@shared/app-settings'
import type { SkillRootId } from '../lib/skill-root-preference'
import { FolderOpen, Loader2, PencilLine, RefreshCw, Settings } from 'lucide-react'
import {
  InlineNoticeView,
  SecretInput,
  SectionJumpButton,
  SettingsCard,
  SettingRow,
  Toggle
} from './settings-controls'

export function GeneralSettingsSection({ ctx }: { ctx: Record<string, any> }): ReactElement {
  const {
    t,
    tCommon,
    form,
    provider,
    legalwork,
    activeApiKey,
    update,
    updateLegalwork,
    updateSharedCredential,
    sharedApiKey,
    sharedBaseUrl,
    showApiKey,
    setShowApiKey,
    showRuntimeToken,
    setShowRuntimeToken,
    portError,
    selectControlClass,
    openOnboardingPreview,
    pickWorkspace,
    resetWorkspaceToDefault,
    workspacePickerError,
    
    
    
    
    
    
    
    
    
    
    logPath,
    logDirOpenError,
    setLogDirOpenError,
    pickWriteWorkspace,
    resetWriteWorkspaceToDefault,
    writeWorkspacePickerError,
    writeInlineBaseUrlInherited,
    effectiveWriteInlineBaseUrl,
    writeInlineModelInherited,
    effectiveWriteInlineModel,
    setWriteDebugModalOpen,
    loadWriteDebugEntries,
    scrollToAgentSection,
    agentsSectionRef,
    skillSectionRef,
    mcpSectionRef,
    permissionsSectionRef,
    selectedSkillRoot,
    skillRootOptions,
    skillRootId,
    setSkillRootId,
    skillNotice,
    openSkillRoot,
    openPlugins,
    mcpConfigPath,
    mcpConfigExists,
    mcpConfigText,
    setMcpConfigText,
    mcpLoading,
    mcpBusy,
    mcpNotice,
    saveMcpConfig,
    loadMcpConfig,
    openMcpConfigDir,
    pickClawWorkspace,
    resetClawWorkspaceToDefault,
    clawWorkspacePickerError,
    splitSettingsList,
    listSettingsText
  } = ctx
  const platform = typeof window !== 'undefined' ? window.dsGui?.platform ?? '' : ''
  const openAtLoginSupported = platform === 'win32' || platform === 'darwin'
  const startMinimizedSupported = platform === 'win32'
  const desktopBehavior = form.appBehavior
  const activeProviderId = legalwork.providerId || DEFAULT_MODEL_PROVIDER_ID
  const activeProvider = getModelProviderProfile(form, activeProviderId)
  const activeProviderPreset = getBuiltinModelProviderPreset(activeProvider.id)
  const buildProviderProfiles = (nextProvider: typeof activeProvider): typeof provider.providers => (
    provider.providers.some((item: typeof activeProvider) => item.id === nextProvider.id)
      ? provider.providers.map((item: typeof activeProvider) => item.id === nextProvider.id ? nextProvider : item)
      : [...provider.providers, nextProvider]
  )
  const updateProviderProfiles = (nextProvider: typeof activeProvider): void => {
    const nextProfiles = buildProviderProfiles(nextProvider)
    update({
      provider: nextProvider.id === DEFAULT_MODEL_PROVIDER_ID
        ? {
            apiKey: nextProvider.apiKey,
            baseUrl: nextProvider.baseUrl,
            providers: nextProfiles
          }
        : { providers: nextProfiles }
    })
  }
  const updateActiveProviderProfile = (patch: Partial<typeof activeProvider>): void => {
    updateProviderProfiles({ ...activeProvider, ...patch })
  }
  const selectModelProvider = (providerId: string): void => {
    const preset = getBuiltinModelProviderPreset(providerId)
    const current = getModelProviderProfile(form, providerId)
    const nextProvider = {
      ...current,
      id: preset?.id ?? current.id,
      name: preset?.name ?? current.name,
      baseUrl: current.baseUrl || preset?.baseUrl || '',
      models: current.models.length > 0 ? current.models : preset?.models ?? []
    }
    update({
      provider: nextProvider.id === DEFAULT_MODEL_PROVIDER_ID
        ? {
            apiKey: nextProvider.apiKey,
            baseUrl: nextProvider.baseUrl,
            providers: buildProviderProfiles(nextProvider)
          }
        : { providers: buildProviderProfiles(nextProvider) },
      agents: legalworkSettingsPatch({
        providerId: nextProvider.id,
        model: nextProvider.models[0] || legalwork.model
      })
    })
  }

  return (
            <>
              <SettingsCard title={t('sectionGeneral')}>
                <SettingRow
                  title={t('modelProvider')}
                  description={t('modelProviderDesc')}
                  control={
                    <div className="w-full min-w-0 md:max-w-md">
                      <select
                        className={selectControlClass}
                        value={activeProvider.id}
                        onChange={(e) => selectModelProvider(e.target.value)}
                      >
                        {BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name} · {preset.region === 'cn' ? t('modelProviderRegionCn') : t('modelProviderRegionGlobal')}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => selectModelProvider(preset.id)}
                            className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition ${
                              activeProvider.id === preset.id
                                ? 'border-accent/35 bg-accent/10 text-accent'
                                : 'border-ds-border bg-ds-card text-ds-muted hover:bg-ds-hover hover:text-ds-ink'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  }
                />
                <SettingRow
                  title={t('apiKey')}
                  description={t('apiKeySharedDesc')}
                  control={
                    <SecretInput
                      value={activeProvider.apiKey}
                      onChange={(value) => updateActiveProviderProfile({ apiKey: value })}
                      visible={showApiKey}
                      onToggleVisibility={() => setShowApiKey((value: boolean) => !value)}
                      placeholder={activeProviderPreset?.apiKeyPlaceholder ?? 'sk-...'}
                      autoComplete="off"
                      invalid={!activeApiKey.trim()}
                      showLabel={t('showSecret')}
                      hideLabel={t('hideSecret')}
                      className="md:max-w-md"
                    />
                  }
                />
                <SettingRow
                  title={t('baseUrl')}
                  description={t('baseUrlSharedDesc')}
                  control={
                    <input
                      className="w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md"
                      placeholder={t('baseUrlPlaceholder')}
                      value={activeProvider.baseUrl}
                      onChange={(e) => updateActiveProviderProfile({ baseUrl: e.target.value })}
                    />
                  }
                />
                <SettingRow
                  title={t('modelProviderModels')}
                  description={t('modelProviderModelsDesc')}
                  control={
                    <textarea
                      rows={4}
                      className="w-full min-w-0 resize-none rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] leading-5 text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md"
                      value={activeProvider.models.join('\n')}
                      onChange={(e) =>
                        updateActiveProviderProfile({
                          models: e.target.value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean)
                        })
                      }
                    />
                  }
                />
                <SettingRow
                  title={t('language')}
                  description={t('languageDesc')}
                  control={
                    <select
                      className={selectControlClass}
                      value={form.locale}
                      onChange={(e) => update({ locale: e.target.value as 'en' | 'zh' })}
                    >
                      <option value="en">English</option>
                      <option value="zh">简体中文</option>
                    </select>
                  }
                />
                <SettingRow
                  title={t('theme')}
                  description={t('themeDesc')}
                  control={
                    <select
                      className={selectControlClass}
                      value={form.theme}
                      onChange={(e) => update({ theme: e.target.value as AppSettingsV1['theme'] })}
                    >
                      <option value="system">{t('themeSystem')}</option>
                      <option value="light">{t('themeLight')}</option>
                      <option value="dark">{t('themeDark')}</option>
                    </select>
                  }
                />
                <SettingRow
                  title={t('onboardingPreview')}
                  description={t('onboardingPreviewDesc')}
                  control={
                    <button
                      type="button"
                      onClick={openOnboardingPreview}
                      className="w-full rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover"
                    >
                      {t('onboardingPreviewOpen')}
                    </button>
                  }
                />
                <SettingRow
                  title={t('fontScale')}
                  description={t('fontScaleDesc')}
                  control={
                    <select
                      className={selectControlClass}
                      value={form.uiFontScale}
                      onChange={(e) =>
                        update({
                          uiFontScale: e.target.value as AppSettingsV1['uiFontScale']
                        })
                      }
                    >
                      <option value="small">{t('fontScaleSmall')}</option>
                      <option value="medium">{t('fontScaleMedium')}</option>
                      <option value="large">{t('fontScaleLarge')}</option>
                    </select>
                  }
                />
                <SettingRow
                  title={t('turnCompleteNotification')}
                  description={t('turnCompleteNotificationDesc')}
                  control={
                    <Toggle
                      checked={form.notifications.turnComplete}
                      onChange={(v) => update({ notifications: { turnComplete: v } })}
                    />
                  }
                />
                <SettingRow
                  title={t('workspaceRoot')}
                  description={t('workspaceRootDesc')}
                  control={
                    <div className="w-full min-w-[200px] md:max-w-xl">
                      <div className="flex items-center gap-2">
                        <input
                          className="w-full rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                          value={form.workspaceRoot}
                          onChange={(e) => update({ workspaceRoot: e.target.value })}
                          placeholder={t('workspaceRootPlaceholder')}
                        />
                        <button
                          type="button"
                          onClick={resetWorkspaceToDefault}
                          className="shrink-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover"
                        >
                          {t('restoreWorkspaceDefault')}
                        </button>
                        <button
                          type="button"
                          onClick={() => void pickWorkspace()}
                          className="shrink-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover"
                        >
                          {t('browse')}
                        </button>
                      </div>
                      {workspacePickerError ? (
                        <p className="mt-2 text-[13px] leading-5 text-amber-700 dark:text-amber-300">
                          {workspacePickerError}
                        </p>
                      ) : null}
                    </div>
                  }
                />
              </SettingsCard>

              <SettingsCard title={t('desktopBehavior')} className="mt-6">
                <SettingRow
                  title={t('desktopOpenAtLogin')}
                  description={
                    openAtLoginSupported
                      ? t('desktopOpenAtLoginDesc')
                      : t('desktopOpenAtLoginUnsupportedDesc')
                  }
                  control={
                    <Toggle
                      checked={desktopBehavior.openAtLogin}
                      disabled={!openAtLoginSupported}
                      onChange={(v) =>
                        update({
                          appBehavior: {
                            openAtLogin: v,
                            startMinimized: v ? desktopBehavior.startMinimized : false
                          }
                        })
                      }
                    />
                  }
                />
                <SettingRow
                  title={t('desktopStartMinimized')}
                  description={
                    desktopBehavior.openAtLogin && startMinimizedSupported
                      ? t('desktopStartMinimizedDesc')
                      : t('desktopStartMinimizedDisabledDesc')
                  }
                  control={
                    <Toggle
                      checked={desktopBehavior.startMinimized}
                      disabled={!desktopBehavior.openAtLogin || !startMinimizedSupported}
                      onChange={(v) => update({ appBehavior: { startMinimized: v } })}
                    />
                  }
                />
                <SettingRow
                  title={t('desktopCloseToTray')}
                  description={t('desktopCloseToTrayDesc')}
                  control={
                    <Toggle
                      checked={desktopBehavior.closeToTray}
                      onChange={(v) => update({ appBehavior: { closeToTray: v } })}
                    />
                  }
                />
              </SettingsCard>

              <SettingsCard title={t('logTitle')} className="mt-6">
                <SettingRow
                  title={t('logEnabled')}
                  description={t('logEnabledDesc')}
                  control={
                    <Toggle
                      checked={form.log.enabled}
                      onChange={(v) => update({ log: { enabled: v } })}
                    />
                  }
                />
                <SettingRow
                  title={t('logRetention')}
                  description={t('logRetentionDesc')}
                  control={
                    <select
                      className={selectControlClass}
                      value={form.log.retentionDays}
                      onChange={(e) =>
                        update({ log: { retentionDays: Number(e.target.value) } })
                      }
                    >
                      <option value={1}>{t('logRetentionOne')}</option>
                      <option value={2}>{t('logRetentionTwo')}</option>
                      <option value={3}>{t('logRetentionThree')}</option>
                      <option value={5}>{t('logRetentionFive')}</option>
                      <option value={7}>{t('logRetentionSeven')}</option>
                    </select>
                  }
                />
                <SettingRow
                  title={t('logDir')}
                  description={t('logDirDesc')}
                  wideControl
                  control={
                    <div className="flex w-full min-w-0 flex-col items-start gap-2">
                      {logPath ? (
                        <code className="block w-full max-w-full break-all rounded-xl bg-ds-main/70 px-3 py-2 font-mono text-[12px] text-ds-muted shadow-sm">
                          {logPath}
                        </code>
                      ) : (
                        <span className="text-[13px] text-ds-faint">…</span>
                      )}
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-1.5 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover disabled:opacity-50"
                        disabled={typeof window.dsGui?.openLogDir !== 'function'}
                        onClick={async () => {
                          if (typeof window.dsGui?.openLogDir !== 'function') return
                          setLogDirOpenError(null)
                          try {
                            const result = await window.dsGui.openLogDir()
                            if (!result.ok) setLogDirOpenError(result.message ?? 'Unknown error')
                          } catch (e) {
                            setLogDirOpenError(e instanceof Error ? e.message : String(e))
                          }
                        }}
                      >
                        <FolderOpen className="h-4 w-4" />
                        {t('logDirOpen')}
                      </button>
                      {logDirOpenError ? (
                        <p className="text-[12px] text-red-700 dark:text-red-300">
                          {logDirOpenError}
                        </p>
                      ) : null}
                    </div>
                  }
                />
              </SettingsCard>
            </>
  )
}
