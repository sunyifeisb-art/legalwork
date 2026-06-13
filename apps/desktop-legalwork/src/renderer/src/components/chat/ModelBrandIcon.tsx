import type { ReactElement } from 'react'
import deepseekLogo from '../../../../asset/img/deepseek.svg'
import alibabaLogo from '../../../../asset/img/model-logos/alibabacloud.svg'
import anthropicLogo from '../../../../asset/img/model-logos/anthropic.svg'
import byteDanceLogo from '../../../../asset/img/model-logos/bytedance.svg'
import customLogo from '../../../../asset/img/model-logos/custom.svg'
import glmLogo from '../../../../asset/img/model-logos/glm.png'
import kimiLogo from '../../../../asset/img/model-logos/kimi.png'
import minimaxLogo from '../../../../asset/img/model-logos/minimax.svg'
import openaiLogo from '../../../../asset/img/model-logos/openai.svg'
import type { ModelBrand } from '../../lib/model-brand'

const MODEL_BRAND_LOGOS: Record<ModelBrand, string> = {
  deepseek: deepseekLogo,
  kimi: kimiLogo,
  'kimi-code': kimiLogo,
  openai: openaiLogo,
  claude: anthropicLogo,
  glm: glmLogo,
  minimax: minimaxLogo,
  qwen: alibabaLogo,
  doubao: byteDanceLogo,
  custom: customLogo
}

export function modelBrandLogoSrc(brand: ModelBrand): string {
  return MODEL_BRAND_LOGOS[brand] ?? customLogo
}

export function ModelBrandIcon({
  brand,
  className = ''
}: {
  brand: ModelBrand
  className?: string
}): ReactElement {
  return (
    <img
      className={className}
      src={modelBrandLogoSrc(brand)}
      alt=""
      draggable={false}
      decoding="async"
    />
  )
}
