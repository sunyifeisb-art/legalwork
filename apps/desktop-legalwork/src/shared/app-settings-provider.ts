import {
  DEFAULT_DEEPSEEK_BASE_URL,
  DEFAULT_MODEL_PROVIDER_ID,
  type AppSettingsV1,
  type LegalworkRuntimeSettingsV1,
  type ModelProviderProfilePatchV1,
  type ModelProviderProfileV1,
  type ModelProviderSettingsPatchV1,
  type ModelProviderSettingsV1
} from './app-settings-types'
import { getLegalworkRuntimeSettings } from './app-settings-legalwork'
import { normalizeDeepseekBaseUrl } from './app-settings-normalizers'
import { DEFAULT_COMPOSER_MODEL_IDS } from './default-composer-models'
import {
  BUILTIN_MODEL_PROVIDER_PRESETS,
  getBuiltinModelProviderPreset,
  normalizeModelProviderId
} from './model-providers'

const DEFAULT_MODEL_PROVIDER_NAME = 'DeepSeek'

export function defaultModelProviderSettings(): ModelProviderSettingsV1 {
  const defaultProvider = defaultModelProviderProfile('', DEFAULT_DEEPSEEK_BASE_URL)
  return {
    apiKey: defaultProvider.apiKey,
    baseUrl: defaultProvider.baseUrl,
    providers: BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) =>
      preset.id === DEFAULT_MODEL_PROVIDER_ID
        ? defaultProvider
        : defaultModelProviderProfile('', preset.baseUrl, preset.id, preset.name, preset.models)
    )
  }
}

export function normalizeModelProviderSettings(
  input: ModelProviderSettingsPatchV1 | undefined
): ModelProviderSettingsV1 {
  const defaults = defaultModelProviderSettings()
  const apiKey = typeof input?.apiKey === 'string' ? input.apiKey.trim() : defaults.apiKey
  const baseUrl =
    typeof input?.baseUrl === 'string' && input.baseUrl.trim()
      ? normalizeDeepseekBaseUrl(input.baseUrl)
      : defaults.baseUrl
  const rawProviders = Array.isArray(input?.providers) ? input.providers : []
  const providersById = new Map<string, ModelProviderProfileV1>()
  const defaultProvider = defaultModelProviderProfile(apiKey, baseUrl)
  for (const preset of BUILTIN_MODEL_PROVIDER_PRESETS) {
    providersById.set(
      preset.id,
      preset.id === DEFAULT_MODEL_PROVIDER_ID
        ? defaultProvider
        : defaultModelProviderProfile('', preset.baseUrl, preset.id, preset.name, preset.models)
    )
  }
  for (const rawProvider of rawProviders) {
    const provider = normalizeModelProviderProfile(rawProvider)
    if (!provider) continue
    providersById.set(provider.id, provider.id === DEFAULT_MODEL_PROVIDER_ID
      ? {
          ...defaultProvider,
          ...provider,
          apiKey,
          baseUrl
        }
      : provider)
  }
  const providers = [...providersById.values()]
  return {
    apiKey,
    baseUrl,
    providers
  }
}

export function mergeModelProviderSettings(
  current: ModelProviderSettingsV1,
  patch: ModelProviderSettingsPatchV1 | undefined
): ModelProviderSettingsV1 {
  return normalizeModelProviderSettings({
    ...current,
    ...(patch ?? {})
  })
}

export function getModelProviderSettings(settings: AppSettingsV1): ModelProviderSettingsV1 {
  return normalizeModelProviderSettings((settings as { provider?: ModelProviderSettingsPatchV1 }).provider)
}

export function modelProviderSettingsPatch(
  provider: ModelProviderSettingsPatchV1 | undefined
): ModelProviderSettingsPatchV1 {
  return provider ? { ...provider } : {}
}

export function resolveModelProviderApiKey(settings: AppSettingsV1): string {
  return getDefaultModelProviderProfile(settings).apiKey.trim()
}

export function resolveModelProviderBaseUrl(settings: AppSettingsV1): string {
  return normalizeDeepseekBaseUrl(getDefaultModelProviderProfile(settings).baseUrl)
}

export function getDefaultModelProviderProfile(settings: AppSettingsV1): ModelProviderProfileV1 {
  return getModelProviderProfile(settings, DEFAULT_MODEL_PROVIDER_ID)
}

export function getModelProviderProfile(
  settings: AppSettingsV1,
  providerId: string | undefined
): ModelProviderProfileV1 {
  const provider = getModelProviderSettings(settings)
  const id = normalizeProviderId(providerId || DEFAULT_MODEL_PROVIDER_ID)
  return provider.providers.find((profile) => profile.id === id) ?? provider.providers[0] ?? defaultModelProviderProfile(provider.apiKey, provider.baseUrl)
}

export function listModelProviderModelIds(settings: AppSettingsV1): string[] {
  const ids = new Set<string>()
  for (const provider of getModelProviderSettings(settings).providers) {
    for (const model of provider.models) {
      const trimmed = model.trim()
      if (trimmed) ids.add(trimmed)
    }
  }
  return [...ids].sort((a, b) => a.localeCompare(b))
}

export function resolveLegalworkRuntimeSettings(settings: AppSettingsV1): LegalworkRuntimeSettingsV1 {
  const runtime = getLegalworkRuntimeSettings(settings)
  const provider = getModelProviderProfile(settings, runtime.providerId)
  const runtimeApiKey = runtime.apiKey?.trim() ?? ''
  const runtimeBaseUrl = runtime.baseUrl?.trim() ?? ''
  const providerBaseUrl = provider.baseUrl.trim() || DEFAULT_DEEPSEEK_BASE_URL
  const preset = getBuiltinModelProviderPreset(runtime.providerId || provider.id)

  return {
    ...runtime,
    apiKey: runtimeApiKey || provider.apiKey.trim(),
    baseUrl:
      runtimeBaseUrl && runtimeBaseUrl !== DEFAULT_DEEPSEEK_BASE_URL
        ? normalizeDeepseekBaseUrl(runtimeBaseUrl)
        : normalizeDeepseekBaseUrl(providerBaseUrl),
    endpointFormat: runtime.endpointFormat?.trim() || preset?.endpointFormat || 'chat_completions'
  }
}

function defaultModelProviderProfile(
  apiKey: string,
  baseUrl: string,
  id = DEFAULT_MODEL_PROVIDER_ID,
  name = getBuiltinModelProviderPreset(DEFAULT_MODEL_PROVIDER_ID)?.name ?? DEFAULT_MODEL_PROVIDER_NAME,
  models: readonly string[] = getBuiltinModelProviderPreset(DEFAULT_MODEL_PROVIDER_ID)?.models
    ?? DEFAULT_COMPOSER_MODEL_IDS.filter((modelId) => modelId !== 'auto')
): ModelProviderProfileV1 {
  return {
    id,
    name,
    apiKey: apiKey.trim(),
    baseUrl: normalizeDeepseekBaseUrl(baseUrl),
    models: [...models]
  }
}

function normalizeModelProviderProfile(
  input: ModelProviderProfilePatchV1 | undefined
): ModelProviderProfileV1 | null {
  const id = normalizeProviderId(input?.id)
  if (!id) return null
  const preset = getBuiltinModelProviderPreset(id)
  const name = typeof input?.name === 'string' && input.name.trim() ? input.name.trim() : preset?.name ?? id
  const baseUrl =
    typeof input?.baseUrl === 'string' && input.baseUrl.trim()
      ? normalizeDeepseekBaseUrl(input.baseUrl)
      : preset?.baseUrl ?? DEFAULT_DEEPSEEK_BASE_URL
  const models = normalizeProviderModels(input?.models, preset?.models)
  return {
    id,
    name,
    apiKey: typeof input?.apiKey === 'string' ? input.apiKey.trim() : '',
    baseUrl,
    models
  }
}

function normalizeProviderModels(models: unknown, fallback: readonly string[] = []): string[] {
  if (!Array.isArray(models)) return [...fallback]
  const ids = new Set<string>()
  for (const model of models) {
    if (typeof model !== 'string') continue
    const trimmed = model.trim()
    if (trimmed) ids.add(trimmed)
  }
  return [...ids].sort((a, b) => a.localeCompare(b))
}

function normalizeProviderId(value: unknown): string {
  return normalizeModelProviderId(value)
}
