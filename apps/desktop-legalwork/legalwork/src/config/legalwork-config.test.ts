import { homedir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { expandHomePath, interpolateEnvVars } from './legalwork-config.js'

describe('expandHomePath', () => {
  it('expands Windows-style home-relative paths', () => {
    expect(expandHomePath('~\\legalwork\\config.json')).toBe(join(homedir(), 'legalwork', 'config.json'))
  })

  it('leaves non-home tilde prefixes untouched', () => {
    expect(expandHomePath('~other/config.json')).toBe('~other/config.json')
  })
})

describe('interpolateEnvVars', () => {
  const originalEnv = process.env

  it('substitutes environment variables in strings', () => {
    process.env = { ...originalEnv, LW_TEST_TOKEN: 'secret123' }
    expect(interpolateEnvVars('Bearer ${LW_TEST_TOKEN}')).toBe('Bearer secret123')
  })

  it('uses fallback defaults when environment variable is missing', () => {
    process.env = { ...originalEnv }
    delete process.env.LW_TEST_MISSING
    expect(interpolateEnvVars('${LW_TEST_MISSING:-default}')).toBe('default')
  })

  it('leaves placeholder unchanged when variable is missing and no fallback', () => {
    process.env = { ...originalEnv }
    delete process.env.LW_TEST_MISSING
    expect(interpolateEnvVars('${LW_TEST_MISSING}')).toBe('${LW_TEST_MISSING}')
  })

  it('recursively interpolates nested objects and arrays', () => {
    process.env = { ...originalEnv, LW_TEST_HOST: 'example.com', LW_TEST_PORT: '8080' }
    const input = {
      servers: [
        { url: 'https://${LW_TEST_HOST}:${LW_TEST_PORT}/mcp' }
      ]
    }
    expect(interpolateEnvVars(input)).toEqual({
      servers: [
        { url: 'https://example.com:8080/mcp' }
      ]
    })
  })

  it('returns non-string primitives unchanged', () => {
    expect(interpolateEnvVars(42)).toBe(42)
    expect(interpolateEnvVars(true)).toBe(true)
    expect(interpolateEnvVars(null)).toBe(null)
  })
})
