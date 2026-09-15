import type i18next from 'i18next'
import { DEFAULT_LEGALWORK_MODEL } from '@shared/app-settings'
import type { AppSettingsV1 } from '@shared/app-settings'
import type { ModelProviderModelGroup } from '@shared/ds-gui-api'
import { rendererRuntimeClient } from '../agent/runtime-client'
import type { ChatState, ChatStoreGet, ChatStoreSet, InitialSetupMode, PluginHostRoute, SettingsRouteSection } from './chat-store-types'

type CreateAppActionsOptions = {
  set: ChatStoreSet
  get: ChatStoreGet
  i18n: typeof i18next
  persistComposerModel: (model: string) => void
  readStoredComposerModel: (allowedIds: readonly string[]) => string
  mergeComposerPickList: (upstreamOk: boolean, upstreamIds: string[]) => string[]
  getComposerModelLoadPromise: () => Promise<void> | null
  setComposerModelLoadPromise: (promise: Promise<void> | null) => void
  applyTheme: (theme: AppSettingsV1['theme']) => void
  applyUiFontScale: (scale: AppSettingsV1['uiFontScale']) => void
  applyDocumentLocale: (locale: AppSettingsV1['locale']) => void
  workspaceLabelFromPath: (workspaceRoot: string) => string
  normalizeWorkspaceRoot: (workspaceRoot?: string | null) => string
}

export function createAppActions(options: CreateAppActionsOptions): Pick<
  ChatState,
  | 'setError'
  | 'setComposerModel'
  | 'loadComposerModels'
  | 'setRoute'
  | 'openSettings'
  | 'openPlugins'
  | 'openClaw'
  | 'openSchedule'
  | 'openDocumentWriting'
  | 'openLegalResearch'
  | 'openKnowledgeBase'
  | 'openLearningIteration'
  | 'openInitialSetup'
  | 'closeInitialSetup'
  | 'selectInspectorItem'
  | 'applyI18nFromSettings'
  | 'reloadUiSettings'
> {
  const {
    set,
    get,
    i18n,
    persistComposerModel,
    readStoredComposerModel,
    mergeComposerPickList,
    getComposerModelLoadPromise,
    setComposerModelLoadPromise,
    applyTheme,
    applyUiFontScale,
    applyDocumentLocale,
    workspaceLabelFromPath,
    normalizeWorkspaceRoot
  } = options
  let modelSwitchSequence = 0

  return {
    setError: (message) => set({ error: message, runtimeErrorDetail: null }),

    setComposerModel: (modelId, requestedProviderId) => {
      const previousModel = get().composerModel
      const previousProviderId = get().composerProviderId
      const providerId = requestedProviderId?.trim()
        || get().composerModelGroups.find((group) => group.modelIds.includes(modelId))?.providerId
        || ''
      persistComposerModel(modelId)
      set({ composerModel: modelId, ...(providerId ? { composerProviderId: providerId } : {}) })
      if (!modelId.trim() || modelId.trim() === 'auto') return
      if (!providerId) return

      const sequence = ++modelSwitchSequence
      set({ runtimeConnection: 'checking', error: null, runtimeErrorDetail: null })
      void (async () => {
        try {
          const settings = await rendererRuntimeClient.getSettings({ forceRefresh: true })
          if (
            settings.agents.legalwork.providerId !== providerId
            || settings.agents.legalwork.model !== modelId
          ) {
            await rendererRuntimeClient.setSettings({
              agents: { legalwork: { providerId, model: modelId } }
            })
            await rendererRuntimeClient.reconnectRuntime()
          }
          if (sequence === modelSwitchSequence) {
            set({ runtimeConnection: 'ready', error: null, runtimeErrorDetail: null })
          }
        } catch (error) {
          if (sequence !== modelSwitchSequence) return
          const message = error instanceof Error ? error.message : String(error)
          persistComposerModel(previousModel)
          set({
            composerModel: previousModel,
            composerProviderId: previousProviderId,
            runtimeConnection: 'offline',
            error: i18n.t('common:modelProviderSwitchFailed', { message }),
            runtimeErrorDetail: message
          })
        }
      })()
    },

    loadComposerModels: async () => {
      if (getComposerModelLoadPromise()) return getComposerModelLoadPromise()!
      if (typeof window.dsGui === 'undefined') return
      const task = (async () => {
        const settings = await rendererRuntimeClient.getSettings()
        const legalworkRuntime = settings.agents.legalwork
        // ChatGPT-account auth mode: the composer should offer the models the
        // Codex/ChatGPT login actually provides, not the API-provider list.
        if (legalworkRuntime.authMode === 'chatgpt') {
          let model = ''
          let pick: string[] = []
          let groups: ModelProviderModelGroup[] = []
          try {
            if (typeof window.dsGui?.getCodexAuthStatus === 'function') {
              const status = await window.dsGui.getCodexAuthStatus(false)
              if (status?.loggedIn && Array.isArray(status.models)) {
                pick = status.models.map((m) => m.id)
                groups = [{ providerId: 'codex', label: 'ChatGPT', modelIds: pick }]
                const defaultModel = status.models.find((m) => m.isDefault)?.id
                const allowed = new Set(pick)
                model = [
                  legalworkRuntime.model,
                  readStoredComposerModel(pick),
                  defaultModel,
                  pick[0]
                ].find((candidate): candidate is string => Boolean(candidate && allowed.has(candidate))) ?? ''
              }
            }
          } catch {
            pick = []
          }
          if (model !== get().composerModel) persistComposerModel(model)
          set({
            composerPickList: pick,
            composerModel: model,
            composerProviderId: 'codex',
            composerModelGroups: groups
          })
          return
        }
        const res = await window.dsGui.fetchUpstreamModels()
        const pick = mergeComposerPickList(res.ok, res.ok ? res.modelIds : [])
        const groups = res.ok ? res.modelGroups ?? [] : []
        const allowed = new Set(pick)
        set((state) => {
          let model = state.composerModel
          if (model !== '' && !allowed.has(model)) {
            model = readStoredComposerModel(pick)
          }
          if (model !== '' && !allowed.has(model)) model = ''
          // 默认不再是"自动"：没存过、或存的已不可用时，落到明确的
          // deepseek-flash。'auto' 仍可在选择器里手动选。
          if (model === '' && allowed.has(DEFAULT_LEGALWORK_MODEL)) {
            model = DEFAULT_LEGALWORK_MODEL
          }
          if (model !== state.composerModel) persistComposerModel(model)
          return {
            composerPickList: pick,
            composerModel: model,
            composerProviderId: legalworkRuntime.providerId,
            composerModelGroups: groups
          }
        })
      })().finally(() => {
        setComposerModelLoadPromise(null)
      })
      setComposerModelLoadPromise(task)
      return task
    },

    setRoute: (route) => set({ route }),

    openSettings: (section: SettingsRouteSection = 'general') =>
      set((state) => ({
        route: 'settings',
        settingsSection: section,
        settingsReturnRoute: state.route === 'settings' ? state.settingsReturnRoute : state.route
      })),

    openPlugins: (host?: PluginHostRoute) =>
      set((state) => ({
        route: 'plugins',
        pluginHostRoute: host ?? (state.route === 'claw' ? 'claw' : 'chat')
      })),

    openClaw: () => {
      set({ route: 'claw' })
      void get().refreshClawChannels()
    },

    openSchedule: () => {
      set({ route: 'schedule' })
    },

    openDocumentWriting: () => {
      set({ route: 'documentWriting' })
    },

    openLegalResearch: () => {
      set({ route: 'legalResearch' })
    },

    openKnowledgeBase: () => {
      set({ route: 'knowledgeBase' })
    },

    openLearningIteration: () => {
      set({ route: 'learningIteration' })
    },

    openInitialSetup: (mode: InitialSetupMode = 'required') =>
      set({ initialSetupOpen: true, initialSetupMode: mode }),

    closeInitialSetup: () => set({ initialSetupOpen: false, initialSetupMode: 'required' }),

    selectInspectorItem: (id) => set({ inspectorSelectedId: id }),

    applyI18nFromSettings: async (locale) => {
      await i18n.changeLanguage(locale)
      applyDocumentLocale(locale)
    },

    reloadUiSettings: async () => {
      if (typeof window.dsGui === 'undefined') return
      const settings = await rendererRuntimeClient.getSettings({ forceRefresh: true })
      const workspaceRoot = normalizeWorkspaceRoot(settings.workspaceRoot)
      applyTheme(settings.theme)
      applyUiFontScale(settings.uiFontScale)
      set({
        workspaceRoot,
        workspaceLabel: workspaceLabelFromPath(workspaceRoot),
        clawChannels: settings.claw.channels,
        activeClawChannelId: settings.claw.channels.some(
          (channel) => channel.id === get().activeClawChannelId && channel.enabled
        )
          ? get().activeClawChannelId
          : settings.claw.channels.find((channel) => channel.enabled)?.id ?? ''
      })
      await get().applyI18nFromSettings(settings.locale)
      if (get().runtimeConnection === 'ready') {
        void get().refreshThreads()
      }
      void get().loadComposerModels()
    }
  }
}
