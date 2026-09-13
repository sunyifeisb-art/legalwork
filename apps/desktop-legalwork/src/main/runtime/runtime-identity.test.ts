import { describe, expect, it } from 'vitest'
import { parseRuntimeIdentity, runtimeModelMatches } from './runtime-identity'

describe('runtime identity', () => {
  it('accepts the legacy v4 flash id as the same runtime model', () => {
    expect(runtimeModelMatches('deepseek-flash', 'deepseek-v4-flash')).toBe(true)
  })

  it('rejects a healthy runtime that is serving another model', () => {
    expect(runtimeModelMatches('deepseek-flash', 'gpt-5.6-sol')).toBe(false)
  })

  it('parses the model from runtime info', () => {
    expect(parseRuntimeIdentity({ model: 'deepseek-flash', pid: 123 })).toEqual({
      model: 'deepseek-flash'
    })
    expect(parseRuntimeIdentity({ pid: 123 })).toBeNull()
  })
})
