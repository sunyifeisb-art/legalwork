import { describe, expect, it } from 'vitest'
import { shouldRunAttachmentOcr } from '../src/attachments/attachment-ocr.js'
import { estimateDeepseekCost } from '../src/adapters/model/deepseek-pricing.js'
import { modelCapabilitiesForModel } from '../src/loop/model-context-profile.js'

describe('deepseek-v4-flash-vision-exp 视觉模型识别', () => {
  it('被识别为支持图片输入的模型（图片直接传，不再走 OCR 文本 fallback）', () => {
    const caps = modelCapabilitiesForModel('deepseek-v4-flash-vision-exp')
    expect(caps.inputModalities).toContain('image')
    expect(caps.messageParts).toContain('image_url')
  })

  it('普通 deepseek-v4-flash 仍为纯文本模型（回归：不受 vision-exp 影响）', () => {
    const caps = modelCapabilitiesForModel('deepseek-v4-flash')
    expect(caps.inputModalities).not.toContain('image')
  })

  it('vision-exp 不跑 OCR；普通 deepseek 模型仍跑 OCR（回归）', () => {
    expect(shouldRunAttachmentOcr('deepseek-v4-flash-vision-exp')).toBe(false)
    expect(shouldRunAttachmentOcr('deepseek-v4-flash')).toBe(true)
    expect(shouldRunAttachmentOcr('deepseek-v4-pro')).toBe(true)
    expect(shouldRunAttachmentOcr('DeepSeek-Chat')).toBe(true)
  })

  it('vision-exp 定价归 flash 档（与 v4-flash 计费一致）', () => {
    const vision = estimateDeepseekCost({
      model: 'deepseek-v4-flash-vision-exp',
      cacheHitTokens: 0,
      cacheMissTokens: 1_000_000,
      outputTokens: 100_000
    })
    const flash = estimateDeepseekCost({
      model: 'deepseek-v4-flash',
      cacheHitTokens: 0,
      cacheMissTokens: 1_000_000,
      outputTokens: 100_000
    })
    expect(vision).not.toBeNull()
    expect(vision).toEqual(flash)
  })
})
