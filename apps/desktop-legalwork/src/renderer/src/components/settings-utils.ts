import {
  DEFAULT_MODEL_PROVIDER_ID,
  DEFAULT_GUI_UPDATE_CHANNEL,
  DEFAULT_UI_FONT_SCALE,
  getBuiltinModelProviderPreset,
  getModelProviderProfile,
  getModelProviderSettings,
  inferEndpointFormatFromBaseUrl,
  legalworkSettingsPatch,
  defaultLegalworkRuntimeSettings,
  applyLegalworkRuntimePatch,
  computeLegalworkRuntimeCredentialPatch,
  getLegalworkRuntimeSettings,
  legalworkSettingsEnvelope,
  mergeLegalworkRuntimeSettings,
  mergeClawSettings,
  mergeModelProviderSettings,
  mergeScheduleSettings,
  mergeLearningIterationSettings,
  mergeWriteSettings,
  normalizeAppBehaviorSettings,
  normalizeClawSettings,
  normalizeGuiUpdateChannel,
  normalizeKeyboardShortcuts,
  normalizeModelProviderSettings,
  normalizeScheduleSettings,
  normalizeLearningIterationSettings,
  normalizeWriteSettings,
  type AppSettingsPatch,
  type AppSettingsV1,
  type ModelProviderProfileV1
} from '@shared/app-settings'
import type { GuiUpdateInfo } from '@shared/gui-update'

type RendererSettingsShape = AppSettingsPatch
type SettingsPatch = AppSettingsPatch

export const DEFAULT_WORKSPACE_ROOT = '~/Desktop'

export function getCodexQuotaRemainingPercent(usedPercent: number): number {
  const clampedUsedPercent = Math.min(100, Math.max(0, usedPercent))
  return Math.round((100 - clampedUsedPercent) * 100) / 100
}

export function splitSettingsList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function listSettingsText(values: string[]): string {
  return values.join('\n')
}

export function hasValidPort(settings: AppSettingsV1): boolean {
  const port = getLegalworkRuntimeSettings(settings).port
  return Number.isFinite(port) && port >= 1 && port <= 65535
}

export function mergeSettings(current: AppSettingsV1, patch: SettingsPatch): AppSettingsV1 {
  const safeCurrent = coerceRendererSettings(current)
  const { agents: agentsPatch, provider: providerPatch, ...restPatch } = patch
  const agentsPatchWithCredentials = computeLegalworkRuntimeCredentialPatch(safeCurrent, {
    agents: agentsPatch,
    provider: providerPatch
  })
  return {
    ...applyLegalworkRuntimePatch(safeCurrent, agentsPatchWithCredentials.legalwork),
    ...restPatch,
    provider: mergeModelProviderSettings(safeCurrent.provider, providerPatch),
    log: {
      ...safeCurrent.log,
      ...(patch.log ?? {})
    },
    notifications: {
      ...safeCurrent.notifications,
      ...(patch.notifications ?? {})
    },
    appBehavior: normalizeAppBehaviorSettings({
      ...safeCurrent.appBehavior,
      ...(patch.appBehavior ?? {})
    }),
    keyboardShortcuts: normalizeKeyboardShortcuts({
      bindings: {
        ...safeCurrent.keyboardShortcuts.bindings,
        ...(patch.keyboardShortcuts?.bindings ?? {})
      }
    }),
    write: mergeWriteSettings(safeCurrent.write, patch.write),
    claw: mergeClawSettings(safeCurrent.claw, patch.claw),
    schedule: mergeScheduleSettings(safeCurrent.schedule, patch.schedule),
    learningIteration: mergeLearningIterationSettings(
      safeCurrent.learningIteration,
      patch.learningIteration
    ),
    guiUpdate: {
      ...safeCurrent.guiUpdate,
      ...(patch.guiUpdate ?? {})
    }
  }
}

export function modelProviderProfilePatch(
  settings: AppSettingsV1,
  nextProvider: ModelProviderProfileV1
): AppSettingsPatch {
  const provider = getModelProviderSettings(settings)
  const providers = provider.providers.some((item) => item.id === nextProvider.id)
    ? provider.providers.map((item) => item.id === nextProvider.id ? nextProvider : item)
    : [...provider.providers, nextProvider]

  return {
    provider: nextProvider.id === DEFAULT_MODEL_PROVIDER_ID
      ? {
          apiKey: nextProvider.apiKey,
          baseUrl: nextProvider.baseUrl,
          providers
        }
      : { providers }
  }
}

export function updateModelProviderProfilePatch(
  settings: AppSettingsV1,
  providerId: string,
  patch: Partial<ModelProviderProfileV1>
): AppSettingsPatch {
  const activeProvider = getModelProviderProfile(settings, providerId)
  return modelProviderProfilePatch(settings, { ...activeProvider, ...patch })
}

export function updateModelProviderBaseUrlPatch(
  settings: AppSettingsV1,
  providerId: string,
  nextBaseUrl: string
): AppSettingsPatch {
  const activeProvider = getModelProviderProfile(settings, providerId)
  const inferredFromPrevious = inferEndpointFormatFromBaseUrl(
    activeProvider.baseUrl,
    activeProvider.id
  )
  const userPickedManually = Boolean(
    activeProvider.endpointFormat &&
    activeProvider.endpointFormat !== inferredFromPrevious
  )

  return updateModelProviderProfilePatch(settings, providerId, {
    baseUrl: nextBaseUrl,
    ...(userPickedManually ? {} : {
      endpointFormat: inferEndpointFormatFromBaseUrl(nextBaseUrl, activeProvider.id)
    })
  })
}

export function selectModelProviderPatch(
  settings: AppSettingsV1,
  providerId: string
): AppSettingsPatch {
  const legalwork = getLegalworkRuntimeSettings(settings)
  const preset = getBuiltinModelProviderPreset(providerId)
  const current = getModelProviderProfile(settings, providerId)
  const nextProvider: ModelProviderProfileV1 = {
    ...current,
    id: preset?.id ?? current.id,
    name: preset?.name ?? current.name,
    baseUrl: current.baseUrl || preset?.baseUrl || '',
    endpointFormat: current.endpointFormat || preset?.endpointFormat || 'chat_completions',
    models: current.models.length > 0 ? current.models : preset?.models ?? []
  }

  const providerPatch = modelProviderProfilePatch(settings, nextProvider)
  return {
    ...providerPatch,
    agents: legalworkSettingsPatch({
      providerId: nextProvider.id,
      model: nextProvider.models[0] || legalwork.model,
      endpointFormat: nextProvider.endpointFormat ?? ''
    })
  }
}

export function coerceRendererSettings(settings: AppSettingsV1): AppSettingsV1 {
  const raw = settings as RendererSettingsShape
  const theme =
    raw.theme === 'system' || raw.theme === 'light' || raw.theme === 'dark'
      ? raw.theme
      : 'system'
  const uiFontScale =
    raw.uiFontScale === 'small' || raw.uiFontScale === 'medium' || raw.uiFontScale === 'large'
      ? raw.uiFontScale
      : DEFAULT_UI_FONT_SCALE
  return {
    version: 1,
    locale: raw.locale === 'zh' ? 'zh' : 'en',
    theme,
    uiFontScale,
    provider: normalizeModelProviderSettings(raw.provider),
    agents: legalworkSettingsEnvelope(mergeLegalworkRuntimeSettings(defaultLegalworkRuntimeSettings(), getLegalworkRuntimeSettings(settings))),
    workspaceRoot: typeof raw.workspaceRoot === 'string' ? raw.workspaceRoot : DEFAULT_WORKSPACE_ROOT,
    log: {
      enabled: raw.log?.enabled !== false,
      retentionDays: typeof raw.log?.retentionDays === 'number' ? raw.log.retentionDays : 2
    },
    notifications: {
      turnComplete: raw.notifications?.turnComplete !== false
    },
    appBehavior: normalizeAppBehaviorSettings(raw.appBehavior),
    keyboardShortcuts: normalizeKeyboardShortcuts(raw.keyboardShortcuts),
    write: normalizeWriteSettings(raw.write),
    claw: normalizeClawSettings(raw.claw),
    schedule: normalizeScheduleSettings(raw.schedule),
    learningIteration: normalizeLearningIterationSettings(raw.learningIteration),
    guiUpdate: {
      channel: normalizeGuiUpdateChannel(raw.guiUpdate?.channel ?? DEFAULT_GUI_UPDATE_CHANNEL)
    }
  }
}

export function guiUpdateFailureMessage(
  info: Extract<GuiUpdateInfo, { ok: false }>,
  t: (key: string, values?: Record<string, unknown>) => string
): string {
  switch (info.code) {
    case 'not_configured':
      return t('guiUpdateErrNotConfigured')
    case 'unsupported':
      return t('guiUpdateErrUnsupported')
    case 'download_failed':
      return t('guiUpdateErrDownloadFailed', { message: info.message.trim() })
    case 'install_failed':
      return t('guiUpdateErrInstallFailed', { message: info.message.trim() })
    case 'github_repo_not_found':
      return t('guiUpdateErrRepoNotFound', { repo: info.repo?.trim() || 'owner/repo' })
    case 'github_forbidden':
      return t('guiUpdateErrForbidden')
    case 'github_rate_limited':
      return t('guiUpdateErrRateLimit')
    case 'no_stable_version':
      return t('guiUpdateErrNoStableVersion', { repo: info.repo?.trim() || '—' })
    default:
      return info.message.trim() || t('guiUpdateCheckFailed')
  }
}
