export type LegalworkRuntimeIdentity = {
  model: string
}

export function normalizeRuntimeModelId(value: unknown): string {
  const model = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (model === 'deepseek-v4-flash') return 'deepseek-flash'
  return model
}

export function runtimeModelMatches(expected: unknown, actual: unknown): boolean {
  const expectedModel = normalizeRuntimeModelId(expected)
  const actualModel = normalizeRuntimeModelId(actual)
  return Boolean(expectedModel && actualModel && expectedModel === actualModel)
}

export function parseRuntimeIdentity(value: unknown): LegalworkRuntimeIdentity | null {
  if (!value || typeof value !== 'object') return null
  const model = normalizeRuntimeModelId((value as { model?: unknown }).model)
  return model ? { model } : null
}
