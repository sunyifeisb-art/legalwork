import { describe, expect, it } from 'vitest'
import { LEGALWORK_SYSTEM_PROMPT } from '../src/prompt/legalwork-system-prompt.js'

describe('LEGALWORK_SYSTEM_PROMPT', () => {
  it('defaults visible reasoning and answers to Chinese', () => {
    expect(LEGALWORK_SYSTEM_PROMPT).toContain('visible process/reasoning text')
    expect(LEGALWORK_SYSTEM_PROMPT).toContain('Default to Simplified Chinese')
    expect(LEGALWORK_SYSTEM_PROMPT).toContain('short English greetings')
    expect(LEGALWORK_SYSTEM_PROMPT).toContain('默认使用简体中文回答')
    expect(LEGALWORK_SYSTEM_PROMPT).toContain('只有当用户明确要求英文输出')
  })
})
