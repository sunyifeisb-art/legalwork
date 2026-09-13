import { describe, expect, it } from 'vitest'
import { resolveAgentTaskModel } from './agent-task-model'

describe('resolveAgentTaskModel', () => {
  it('inherits the main Agent model and falls back to DeepSeek Flash', () => {
    expect(resolveAgentTaskModel('gpt-5.6-sol', 'deepseek-flash')).toBe('gpt-5.6-sol')
    expect(resolveAgentTaskModel(' deepseek-v4-pro ', 'deepseek-flash')).toBe('deepseek-v4-pro')
    expect(resolveAgentTaskModel('auto', 'kimi-for-coding')).toBe('kimi-for-coding')
    expect(resolveAgentTaskModel('', 'deepseek-flash')).toBe('deepseek-flash')
    expect(resolveAgentTaskModel('auto', 'auto')).toBe('deepseek-flash')
    expect(resolveAgentTaskModel(undefined, undefined)).toBe('deepseek-flash')
  })
})
