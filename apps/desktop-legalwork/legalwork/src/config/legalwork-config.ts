import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { z } from 'zod'
import {
  ApprovalPolicySchema,
  DEFAULT_APPROVAL_POLICY,
  DEFAULT_SANDBOX_MODE,
  SandboxModeSchema
} from '../contracts/policy.js'
import {
  MODEL_ENDPOINT_FORMATS,
  DEFAULT_MODEL_ENDPOINT_FORMAT,
  normalizeModelEndpointFormat
} from '../contracts/model-endpoint-format.js'
import {
  DEFAULT_LEGALWORK_CAPABILITIES_CONFIG,
  LegalworkCapabilitiesConfig,
  ModelInputModality,
  ModelMessagePartSupport,
  ModelReasoningCapabilityMetadata
} from '../contracts/capabilities.js'

export const LEGALWORK_CONFIG_FILENAME = 'config.json'
export const DEFAULT_LEGALWORK_MODEL = 'deepseek-v4-pro'

const PositiveInt = z.number().int().positive()
const PositiveRatio = z.number().positive().max(1)

export const ModelContextCompactionProfileConfigSchema = z
  .object({
    softRatio: PositiveRatio.optional(),
    hardRatio: PositiveRatio.optional(),
    softThreshold: PositiveInt.optional(),
    hardThreshold: PositiveInt.optional()
  })
  .strict()
  .superRefine((profile, ctx) => {
    if (
      profile.softThreshold !== undefined &&
      profile.hardThreshold !== undefined &&
      profile.hardThreshold < profile.softThreshold
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'hardThreshold must be greater than or equal to softThreshold'
      })
    }
  })

export const ModelContextProfileConfigSchema = z
  .object({
    aliases: z.array(z.string().min(1)).optional(),
    contextWindowTokens: PositiveInt.optional(),
    contextCompaction: ModelContextCompactionProfileConfigSchema.optional(),
    softRatio: PositiveRatio.optional(),
    hardRatio: PositiveRatio.optional(),
    softThreshold: PositiveInt.optional(),
    hardThreshold: PositiveInt.optional(),
    inputModalities: z.array(ModelInputModality).optional(),
    outputModalities: z.array(ModelInputModality).optional(),
    supportsToolCalling: z.boolean().optional(),
    messageParts: z.array(ModelMessagePartSupport).optional(),
    reasoning: ModelReasoningCapabilityMetadata.optional()
  })
  .strict()
  .superRefine((profile, ctx) => {
    const hasRatio =
      profile.softRatio !== undefined ||
      profile.hardRatio !== undefined ||
      profile.contextCompaction?.softRatio !== undefined ||
      profile.contextCompaction?.hardRatio !== undefined
    if (hasRatio && profile.contextWindowTokens === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'softRatio and hardRatio require contextWindowTokens'
      })
    }
    const softThreshold = profile.contextCompaction?.softThreshold ?? profile.softThreshold
    const hardThreshold = profile.contextCompaction?.hardThreshold ?? profile.hardThreshold
    if (softThreshold !== undefined && hardThreshold !== undefined && hardThreshold < softThreshold) {
      ctx.addIssue({
        code: 'custom',
        message: 'hardThreshold must be greater than or equal to softThreshold'
      })
    }
  })

export const ModelConfigSchema = z
  .object({
    profiles: z.record(z.string().min(1), ModelContextProfileConfigSchema).optional()
  })
  .strict()

export const ContextCompactionConfigSchema = z
  .object({
    defaultSoftThreshold: PositiveInt.optional(),
    defaultHardThreshold: PositiveInt.optional(),
    summaryMode: z.enum(['heuristic', 'model']).optional(),
    summaryTimeoutMs: PositiveInt.optional(),
    summaryMaxTokens: PositiveInt.optional(),
    summaryInputMaxBytes: PositiveInt.optional(),
    modelProfiles: z.record(z.string().min(1), ModelContextProfileConfigSchema).optional()
  })
  .strict()
  .superRefine((config, ctx) => {
    if (
      config.defaultSoftThreshold !== undefined &&
      config.defaultHardThreshold !== undefined &&
      config.defaultHardThreshold < config.defaultSoftThreshold
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'defaultHardThreshold must be greater than or equal to defaultSoftThreshold'
      })
    }
  })

export const RuntimeTuningConfigSchema = z
  .object({
    toolStorm: z
      .object({
        enabled: z.boolean().optional(),
        windowSize: PositiveInt.optional(),
        threshold: z.number().int().min(2).optional()
      })
      .strict()
      .optional(),
    toolArgumentRepair: z
      .object({
        maxStringBytes: PositiveInt.optional()
      })
      .strict()
      .optional()
  })
  .strict()

export const RequestHistoryHygieneConfigSchema = z
  .object({
    maxToolResultLines: PositiveInt.optional(),
    maxToolResultBytes: PositiveInt.optional(),
    maxToolResultTokens: PositiveInt.optional(),
    maxToolArgumentStringBytes: PositiveInt.optional(),
    maxToolArgumentStringTokens: PositiveInt.optional(),
    maxArrayItems: PositiveInt.optional()
  })
  .strict()

export const TokenEconomyConfigSchema = z
  .object({
    enabled: z.boolean().optional(),
    compressToolDescriptions: z.boolean().optional(),
    compressToolResults: z.boolean().optional(),
    conciseResponses: z.boolean().optional(),
    historyHygiene: RequestHistoryHygieneConfigSchema.optional()
  })
  .strict()

export const StorageConfigSchema = z
  .object({
    backend: z.enum(['hybrid', 'file']).default('hybrid'),
    sqlitePath: z.string().min(1).optional()
  })
  .strict()

export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  backend: 'hybrid'
}

export const LegalworkServeConfigSchema = z
  .object({
    host: z.string().optional(),
    port: z.number().int().min(0).max(65_535).optional(),
    dataDir: z.string().min(1).optional(),
    runtimeToken: z.string().optional(),
    apiKey: z.string().optional(),
    baseUrl: z.string().optional(),
    endpointFormat: z.preprocess(
      normalizeModelEndpointFormat,
      z.enum(MODEL_ENDPOINT_FORMATS)
    ).default(DEFAULT_MODEL_ENDPOINT_FORMAT).optional(),
    model: z.string().min(1).optional(),
    approvalPolicy: ApprovalPolicySchema.default(DEFAULT_APPROVAL_POLICY).optional(),
    sandboxMode: SandboxModeSchema.default(DEFAULT_SANDBOX_MODE).optional(),
    tokenEconomyMode: z.boolean().optional(),
    tokenEconomy: TokenEconomyConfigSchema.optional(),
    insecure: z.boolean().optional(),
    storage: StorageConfigSchema.optional()
  })
  .strict()

export const LegalworkConfigSchema = z
  .object({
    serve: LegalworkServeConfigSchema.optional(),
    models: ModelConfigSchema.optional(),
    contextCompaction: ContextCompactionConfigSchema.optional(),
    runtime: RuntimeTuningConfigSchema.optional(),
    capabilities: LegalworkCapabilitiesConfig.default(DEFAULT_LEGALWORK_CAPABILITIES_CONFIG)
  })
  .strict()

export type LegalworkConfig = z.infer<typeof LegalworkConfigSchema>
export type LegalworkServeConfig = z.infer<typeof LegalworkServeConfigSchema>
export type ModelConfig = z.infer<typeof ModelConfigSchema>
export type ContextCompactionConfig = z.infer<typeof ContextCompactionConfigSchema>
export type RuntimeTuningConfig = z.infer<typeof RuntimeTuningConfigSchema>
export type TokenEconomyConfig = z.infer<typeof TokenEconomyConfigSchema>
export type StorageConfig = z.infer<typeof StorageConfigSchema>

export type LoadedLegalworkConfig = {
  path: string
  config: LegalworkConfig
}

export function interpolateEnvVars(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)(?::-([^}]*))?\}/g, (match, name, fallback) => {
      const envValue = process.env[name]
      if (envValue !== undefined) return envValue
      if (fallback !== undefined) return fallback
      return match
    })
  }
  if (Array.isArray(value)) {
    return value.map((item) => interpolateEnvVars(item))
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      result[key] = interpolateEnvVars(val)
    }
    return result
  }
  return value
}

export function readLegalworkConfigFile(path: string): LoadedLegalworkConfig {
  const resolvedPath = expandHomePath(path)
  const text = readFileSync(resolvedPath, 'utf8')
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse Legalwork config JSON at ${resolvedPath}: ${message}`)
  }
  const interpolated = interpolateEnvVars(json)
  const parsed = LegalworkConfigSchema.safeParse(interpolated)
  if (!parsed.success) {
    throw new Error(
      `Invalid Legalwork config at ${resolvedPath}: ${JSON.stringify(parsed.error.issues, null, 2)}`
    )
  }
  return { path: resolvedPath, config: parsed.data }
}

export function readOptionalLegalworkConfigFile(path: string | undefined): LoadedLegalworkConfig | null {
  if (!path) return null
  const resolvedPath = expandHomePath(path)
  if (!existsSync(resolvedPath)) return null
  return readLegalworkConfigFile(resolvedPath)
}

export function writeLegalworkConfigFile(path: string, config: LegalworkConfig): void {
  const resolvedPath = expandHomePath(path)
  const text = `${JSON.stringify(config, null, 2)}\n`
  mkdirSync(dirname(resolvedPath), { recursive: true })
  writeFileSync(resolvedPath, text, 'utf8')
}

export function legalworkConfigPathForDataDir(dataDir: string | undefined): string | undefined {
  const trimmed = dataDir?.trim()
  if (!trimmed) return undefined
  return join(expandHomePath(trimmed), LEGALWORK_CONFIG_FILENAME)
}

export function expandHomePath(path: string): string {
  if (path === '~') return homedir()
  if (path.startsWith('~/') || path.startsWith('~\\')) {
    return join(homedir(), path.slice(2).replace(/\\/g, '/'))
  }
  return path
}
