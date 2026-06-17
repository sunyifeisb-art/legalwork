import type { ModelProviderModelGroup } from '@shared/ds-gui-api'
import {
  inferModelProviderBrand,
  modelProviderBrandLabel,
  type ModelProviderBrand
} from '@shared/app-settings'

export type ModelBrand = ModelProviderBrand

export function brandForModel(
  modelId: string | undefined,
  groups: readonly ModelProviderModelGroup[] = []
): ModelBrand {
  const model = (modelId ?? '').trim()
  const group = groups.find((item) => item.modelIds.some((id) => id.trim() === model))
  return inferModelProviderBrand(group?.providerId, model)
}

export function modelBrandLabel(brand: ModelBrand): string {
  return modelProviderBrandLabel(brand)
}

export function modelBrandGlyph(brand: ModelBrand): string {
  switch (brand) {
    case 'deepseek':
      return 'DS'
    case 'kimi':
      return 'K'
    case 'kimi-code':
      return 'K'
    case 'openai':
      return 'GPT'
    case 'claude':
      return 'C'
    case 'glm':
      return 'GLM'
    case 'minimax':
      return 'M'
    case 'qwen':
      return 'Q'
    case 'doubao':
      return 'D'
    case 'custom':
      return 'AI'
  }
}
