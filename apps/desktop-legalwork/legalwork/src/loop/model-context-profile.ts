import type {
  ModelCapabilityMetadata,
  ModelInputModality,
  ModelMessagePartSupport,
  ModelReasoningCapabilityMetadata
} from '../contracts/capabilities.js'

export type ModelContextThresholds = {
  softThreshold: number
  hardThreshold: number
}

export type ModelContextCompactionProfileConfig = {
  softRatio?: number
  hardRatio?: number
  softThreshold?: number
  hardThreshold?: number
}

export type ModelContextProfile = ModelContextThresholds & {
  canonicalModel: string
  modelIds: readonly string[]
  contextWindowTokens: number
  inputModalities: readonly ModelInputModality[]
  outputModalities: readonly ModelInputModality[]
  supportsToolCalling: boolean
  messageParts: readonly ModelMessagePartSupport[]
  reasoning?: ModelReasoningCapabilityMetadata
}

export type ModelContextProfileConfig = {
  aliases?: readonly string[]
  contextWindowTokens?: number
  contextCompaction?: ModelContextCompactionProfileConfig
  /** @deprecated Use contextCompaction.softRatio. */
  softRatio?: number
  /** @deprecated Use contextCompaction.hardRatio. */
  hardRatio?: number
  /** @deprecated Use contextCompaction.softThreshold. */
  softThreshold?: number
  /** @deprecated Use contextCompaction.hardThreshold. */
  hardThreshold?: number
  inputModalities?: readonly ModelInputModality[]
  outputModalities?: readonly ModelInputModality[]
  supportsToolCalling?: boolean
  messageParts?: readonly ModelMessagePartSupport[]
  reasoning?: ModelReasoningCapabilityMetadata
}

export type ModelConfig = {
  profiles?: Record<string, ModelContextProfileConfig>
}

export type ContextCompactionConfig = {
  defaultSoftThreshold?: number
  defaultHardThreshold?: number
  summaryMode?: 'heuristic' | 'model'
  summaryTimeoutMs?: number
  summaryMaxTokens?: number
  summaryInputMaxBytes?: number
  /**
   * @deprecated Model-specific context windows and compaction thresholds belong
   * in top-level models.profiles. This field is still read for compatibility.
   */
  modelProfiles?: Record<string, ModelContextProfileConfig>
}

export type ModelProfileConfigSource = {
  models?: ModelConfig
  contextCompaction?: ContextCompactionConfig
}

export const DEFAULT_CONTEXT_THRESHOLDS: ModelContextThresholds = {
  softThreshold: 16_000,
  hardThreshold: 24_000
}

const DEEPSEEK_V4_CONTEXT_WINDOW_TOKENS = 1_000_000
// Generic default compaction ratio used by other profiles (MIMO, LongCat)
// and as a fallback when a profile does not specify thresholds.
const DEFAULT_SOFT_THRESHOLD_RATIO = 0.98
const DEFAULT_HARD_THRESHOLD_RATIO = 0.99
// Keep a deliberate output/tool-call reserve, but use the advertised 1M
// context as an actual long-context window. The old 100k/130k thresholds made
// DeepSeek discard working state after using only 10-13% of its context and
// caused repeated read -> compact -> forget -> re-read loops.
const DEEPSEEK_V4_SOFT_THRESHOLD = 900_000
const DEEPSEEK_V4_HARD_THRESHOLD = 950_000
const DEFAULT_MODEL_INPUT_MODALITIES: readonly ModelInputModality[] = ['text']
const DEFAULT_MODEL_OUTPUT_MODALITIES: readonly ModelInputModality[] = ['text']
const DEFAULT_MODEL_MESSAGE_PARTS: readonly ModelMessagePartSupport[] = ['text']
const KIMI_CODE_CONTEXT_WINDOW_TOKENS = 262_144
const MIMO_V25_CONTEXT_WINDOW_TOKENS = 128_000
const LONGCAT_2_CONTEXT_WINDOW_TOKENS = 1_000_000

export const MODEL_CONTEXT_PROFILES: readonly ModelContextProfile[] = [
  deepseekV4Profile('deepseek-v4-pro', ['deepseek-v4-pro']),
  deepseekV4Profile('deepseek-v4-flash', [
    'deepseek-v4-flash',
    // Back-compat aliases currently routed by DeepSeek to v4-flash modes.
    'deepseek-chat',
    'deepseek-reasoner'
  ]),
  // 多模态视觉理解实验模型：文本能力与 v4-flash 持平、计费一致，但支持图像输入，
  // 图片作为 image 直接传给模型，不再走 OCR 提取文字。
  deepseekV4Profile('deepseek-v4-flash-vision-exp', ['deepseek-v4-flash-vision-exp'], true),
  kimiCodeProfile(),
  mimoV25Profile('mimo-v2.5-pro', ['mimo-v2.5-pro'], false),
  mimoV25Profile('mimo-v2.5', ['mimo-v2.5'], true),
  longCatProfile()
]

export function resolveModelContextProfile(
  model: string | undefined,
  profiles: readonly ModelContextProfile[] = MODEL_CONTEXT_PROFILES
): ModelContextProfile | null {
  const normalized = normalizeModelId(model)
  if (!normalized) return null
  return profiles.find((profile) =>
    profile.modelIds.some((modelId) => normalized === modelId || normalized.endsWith(`/${modelId}`))
  ) ?? null
}

export function contextThresholdsForModel(
  model: string | undefined,
  fallback: ModelContextThresholds = DEFAULT_CONTEXT_THRESHOLDS,
  profiles: readonly ModelContextProfile[] = MODEL_CONTEXT_PROFILES
): ModelContextThresholds {
  const profile = resolveModelContextProfile(model, profiles)
  if (!profile) return fallback
  return {
    softThreshold: profile.softThreshold,
    hardThreshold: profile.hardThreshold
  }
}

export function modelCapabilitiesForModel(
  model: string | undefined,
  profiles: readonly ModelContextProfile[] = MODEL_CONTEXT_PROFILES
): ModelCapabilityMetadata {
  const profile = resolveModelContextProfile(model, profiles)
  return {
    id: model?.trim() || profile?.canonicalModel || 'auto',
    inputModalities: [...(profile?.inputModalities ?? DEFAULT_MODEL_INPUT_MODALITIES)],
    outputModalities: [...(profile?.outputModalities ?? DEFAULT_MODEL_OUTPUT_MODALITIES)],
    supportsToolCalling: profile?.supportsToolCalling ?? true,
    contextWindowTokens: profile?.contextWindowTokens,
    messageParts: [...(profile?.messageParts ?? DEFAULT_MODEL_MESSAGE_PARTS)],
    ...(profile?.reasoning ? { reasoning: profile.reasoning } : {})
  }
}

export function modelContextProfilesFromConfig(
  config?: ContextCompactionConfig | ModelConfig | ModelProfileConfigSource
): readonly ModelContextProfile[] {
  const byCanonical = new Map<string, ModelContextProfile>()
  for (const profile of MODEL_CONTEXT_PROFILES) {
    byCanonical.set(normalizeModelId(profile.canonicalModel), profile)
  }
  const profileGroups = modelProfileGroupsFromConfig(config)
  if (profileGroups.length === 0) return [...byCanonical.values()]
  for (const profiles of profileGroups) {
    for (const [modelId, rawProfile] of Object.entries(profiles)) {
      const canonicalModel = normalizeModelId(modelId)
      if (!canonicalModel) continue
      const current = byCanonical.get(canonicalModel)
      const next = mergeModelContextProfile(canonicalModel, current, rawProfile)
      byCanonical.set(canonicalModel, next)
    }
  }
  return [...byCanonical.values()]
}

function deepseekV4Profile(
  canonicalModel: string,
  modelIds: readonly string[],
  imageInput = false
): ModelContextProfile {
  return {
    canonicalModel,
    modelIds,
    contextWindowTokens: DEEPSEEK_V4_CONTEXT_WINDOW_TOKENS,
    softThreshold: DEEPSEEK_V4_SOFT_THRESHOLD,
    hardThreshold: DEEPSEEK_V4_HARD_THRESHOLD,
    inputModalities: imageInput ? ['text', 'image'] : DEFAULT_MODEL_INPUT_MODALITIES,
    outputModalities: DEFAULT_MODEL_OUTPUT_MODALITIES,
    supportsToolCalling: true,
    messageParts: imageInput ? ['text', 'image_url'] : DEFAULT_MODEL_MESSAGE_PARTS
  }
}

function kimiCodeProfile(): ModelContextProfile {
  return {
    canonicalModel: 'kimi-for-coding',
    modelIds: ['kimi-for-coding'],
    contextWindowTokens: KIMI_CODE_CONTEXT_WINDOW_TOKENS,
    softThreshold: 245_760,
    hardThreshold: 258_048,
    inputModalities: ['text', 'image'],
    outputModalities: DEFAULT_MODEL_OUTPUT_MODALITIES,
    supportsToolCalling: true,
    messageParts: ['text', 'image_url'],
    reasoning: {
      supportedEfforts: ['off', 'low', 'medium', 'high'],
      defaultEffort: 'medium',
      requestProtocol: 'openai-chat-completions'
    }
  }
}

function mimoV25Profile(
  canonicalModel: string,
  modelIds: readonly string[],
  imageInput: boolean
): ModelContextProfile {
  return {
    canonicalModel,
    modelIds,
    contextWindowTokens: MIMO_V25_CONTEXT_WINDOW_TOKENS,
    softThreshold: Math.floor(MIMO_V25_CONTEXT_WINDOW_TOKENS * DEFAULT_SOFT_THRESHOLD_RATIO),
    hardThreshold: Math.floor(MIMO_V25_CONTEXT_WINDOW_TOKENS * DEFAULT_HARD_THRESHOLD_RATIO),
    inputModalities: imageInput ? ['text', 'image'] : DEFAULT_MODEL_INPUT_MODALITIES,
    outputModalities: DEFAULT_MODEL_OUTPUT_MODALITIES,
    supportsToolCalling: true,
    messageParts: imageInput ? ['text', 'image_url'] : DEFAULT_MODEL_MESSAGE_PARTS,
    reasoning: {
      supportedEfforts: ['off', 'low', 'medium', 'high'],
      defaultEffort: 'medium',
      requestProtocol: 'mimo-chat-completions'
    }
  }
}

function longCatProfile(): ModelContextProfile {
  return {
    canonicalModel: 'LongCat-2.0',
    modelIds: ['longcat-2.0'],
    contextWindowTokens: LONGCAT_2_CONTEXT_WINDOW_TOKENS,
    softThreshold: Math.floor(LONGCAT_2_CONTEXT_WINDOW_TOKENS * DEFAULT_SOFT_THRESHOLD_RATIO),
    hardThreshold: Math.floor(LONGCAT_2_CONTEXT_WINDOW_TOKENS * DEFAULT_HARD_THRESHOLD_RATIO),
    inputModalities: DEFAULT_MODEL_INPUT_MODALITIES,
    outputModalities: DEFAULT_MODEL_OUTPUT_MODALITIES,
    supportsToolCalling: true,
    messageParts: DEFAULT_MODEL_MESSAGE_PARTS
  }
}

function mergeModelContextProfile(
  canonicalModel: string,
  current: ModelContextProfile | undefined,
  input: ModelContextProfileConfig
): ModelContextProfile {
  const compaction = input.contextCompaction ?? {}
  const configuredContextWindowTokens = input.contextWindowTokens ?? current?.contextWindowTokens
  const softThreshold = compaction.softThreshold ?? input.softThreshold ?? thresholdFromWindow({
    contextWindowTokens: configuredContextWindowTokens,
    ratio: compaction.softRatio ?? input.softRatio,
    fallbackRatio: current
      ? current.softThreshold / current.contextWindowTokens
      : DEFAULT_SOFT_THRESHOLD_RATIO,
    fallbackThreshold: current?.softThreshold
  })
  const hardThreshold = compaction.hardThreshold ?? input.hardThreshold ?? thresholdFromWindow({
    contextWindowTokens: configuredContextWindowTokens,
    ratio: compaction.hardRatio ?? input.hardRatio,
    fallbackRatio: current
      ? current.hardThreshold / current.contextWindowTokens
      : DEFAULT_HARD_THRESHOLD_RATIO,
    fallbackThreshold: current?.hardThreshold
  })
  const contextWindowTokens =
    configuredContextWindowTokens ?? Math.max(softThreshold ?? 0, hardThreshold ?? 0)
  if (!contextWindowTokens || !softThreshold || !hardThreshold) {
    throw new Error(`model context profile "${canonicalModel}" needs a context window or thresholds`)
  }
  // Guard against a user-supplied softThreshold that exceeds the default hard
  // threshold: hard must always be >= soft. When hard was not explicitly set
  // (it fell back to the default) and the resulting hard < soft, lift hard to
  // just above soft so the profile stays valid.
  const hardThresholdEffective =
    hardThreshold < softThreshold ? softThreshold + 1 : hardThreshold
  const modelIds = uniqueModelIds([
    canonicalModel,
    ...(current?.modelIds ?? []),
    ...(input.aliases ?? [])
  ])
  return {
    canonicalModel,
    modelIds,
    contextWindowTokens,
    softThreshold,
    hardThreshold: hardThresholdEffective,
    inputModalities: uniqueModelCapabilityValues(input.inputModalities ?? current?.inputModalities ?? DEFAULT_MODEL_INPUT_MODALITIES),
    outputModalities: uniqueModelCapabilityValues(input.outputModalities ?? current?.outputModalities ?? DEFAULT_MODEL_OUTPUT_MODALITIES),
    supportsToolCalling: input.supportsToolCalling ?? current?.supportsToolCalling ?? true,
    messageParts: uniqueModelCapabilityValues(input.messageParts ?? current?.messageParts ?? DEFAULT_MODEL_MESSAGE_PARTS),
    reasoning: input.reasoning ?? current?.reasoning
  }
}

function thresholdFromWindow(input: {
  contextWindowTokens: number | undefined
  ratio: number | undefined
  fallbackRatio: number
  fallbackThreshold: number | undefined
}): number | undefined {
  if (!input.contextWindowTokens) return input.fallbackThreshold
  return Math.floor(input.contextWindowTokens * (input.ratio ?? input.fallbackRatio))
}

function modelProfileGroupsFromConfig(
  config: ContextCompactionConfig | ModelConfig | ModelProfileConfigSource | undefined
): Array<Record<string, ModelContextProfileConfig>> {
  if (!config) return []
  if ('models' in config || 'contextCompaction' in config) {
    return [
      ...(config.contextCompaction?.modelProfiles ? [config.contextCompaction.modelProfiles] : []),
      ...(config.models?.profiles ? [config.models.profiles] : [])
    ]
  }
  if ('profiles' in config) {
    return config.profiles ? [config.profiles] : []
  }
  if ('modelProfiles' in config) {
    return config.modelProfiles ? [config.modelProfiles] : []
  }
  return []
}

function uniqueModelIds(values: readonly string[]): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const value of values) {
    const normalized = normalizeModelId(value)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    out.push(normalized)
  }
  return out
}

function uniqueModelCapabilityValues<T extends string>(values: readonly T[]): T[] {
  const out: T[] = []
  const seen = new Set<T>()
  for (const value of values) {
    if (seen.has(value)) continue
    seen.add(value)
    out.push(value)
  }
  return out
}

function normalizeModelId(model: string | undefined): string {
  const normalized = model?.trim().toLowerCase() ?? ''
  return normalized === 'auto' ? '' : normalized
}
