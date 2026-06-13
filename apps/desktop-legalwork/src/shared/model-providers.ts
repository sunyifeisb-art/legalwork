export type ModelProviderBrand =
  | 'deepseek'
  | 'kimi'
  | 'kimi-code'
  | 'openai'
  | 'claude'
  | 'glm'
  | 'minimax'
  | 'qwen'
  | 'doubao'
  | 'custom'

export type BuiltinModelProviderPreset = {
  id: ModelProviderBrand
  name: string
  region: 'cn' | 'global'
  baseUrl: string
  models: string[]
  apiKeyPlaceholder: string
  /** Compatible request/response protocol. Auto-detected per provider. */
  endpointFormat?: 'chat_completions' | 'responses' | 'messages'
}

export const BUILTIN_MODEL_PROVIDER_PRESETS: BuiltinModelProviderPreset[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    region: 'cn',
    baseUrl: 'https://api.deepseek.com',
    models: ['deepseek-v4-pro', 'deepseek-v4-flash', 'deepseek-chat', 'deepseek-reasoner'],
    apiKeyPlaceholder: 'sk-...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'kimi',
    name: 'Kimi',
    region: 'cn',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: ['kimi-k2.7-code', 'kimi-k2.6', 'kimi-k2.5', 'kimi-k2', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
    apiKeyPlaceholder: 'sk-...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'kimi-code',
    name: 'Kimi Code',
    region: 'cn',
    baseUrl: 'https://api.kimi.com/coding/',
    models: ['kimi-for-coding'],
    apiKeyPlaceholder: 'sk-kimi-...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'qwen',
    name: 'Qwen',
    region: 'cn',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen-plus', 'qwen-turbo', 'qwen-max', 'qwen-long'],
    apiKeyPlaceholder: 'sk-...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'glm',
    name: 'GLM',
    region: 'cn',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4.5', 'glm-4-plus', 'glm-4-air'],
    apiKeyPlaceholder: '...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    region: 'cn',
    baseUrl: 'https://api.minimax.chat/v1',
    models: ['MiniMax-Text-01', 'abab6.5s-chat', 'abab6.5g-chat'],
    apiKeyPlaceholder: '...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'doubao',
    name: 'Doubao',
    region: 'cn',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: ['doubao-seed-1-6', 'doubao-1-5-pro-32k', 'doubao-1-5-lite-32k'],
    apiKeyPlaceholder: '...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'openai',
    name: 'GPT / OpenAI',
    region: 'global',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4.1', 'gpt-4o', 'gpt-4o-mini', 'o3-mini'],
    apiKeyPlaceholder: 'sk-...',
    endpointFormat: 'chat_completions'
  },
  {
    id: 'claude',
    name: 'Claude',
    region: 'global',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-sonnet-4-20250514', 'claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022'],
    apiKeyPlaceholder: 'sk-ant-...',
    endpointFormat: 'messages'
  }
]

export const BUILTIN_MODEL_PROVIDER_IDS = BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) => preset.id)

export function getBuiltinModelProviderPreset(id: string | undefined): BuiltinModelProviderPreset | null {
  const normalized = normalizeModelProviderId(id)
  return BUILTIN_MODEL_PROVIDER_PRESETS.find((preset) => preset.id === normalized) ?? null
}

export function inferModelProviderBrand(providerId: string | undefined, modelId: string | undefined): ModelProviderBrand {
  const provider = normalizeModelProviderId(providerId)
  if (BUILTIN_MODEL_PROVIDER_IDS.includes(provider as ModelProviderBrand)) {
    return provider as ModelProviderBrand
  }
  const model = (modelId ?? '').trim().toLowerCase()
  if (model === 'kimi-for-coding') return 'kimi-code'
  if (model.includes('kimi') || model.includes('moonshot')) return 'kimi'
  if (model.includes('deepseek') || model === 'auto' || model === '') return 'deepseek'
  if (model.includes('gpt') || model.includes('o3') || model.includes('o4') || model.includes('openai')) return 'openai'
  if (model.includes('claude') || model.includes('anthropic')) return 'claude'
  if (model.includes('glm') || model.includes('chatglm')) return 'glm'
  if (model.includes('minimax') || model.includes('abab')) return 'minimax'
  if (model.includes('qwen') || model.includes('qwq')) return 'qwen'
  if (model.includes('doubao') || model.includes('volc')) return 'doubao'
  return 'custom'
}

export function modelProviderBrandLabel(brand: ModelProviderBrand): string {
  return getBuiltinModelProviderPreset(brand)?.name ?? 'Custom'
}

export function normalizeModelProviderId(value: unknown): string {
  return typeof value === 'string'
    ? value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64)
    : ''
}
