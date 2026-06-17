import { describe, expect, it } from 'vitest'
import { isLegalworkHealthResponseBody } from './legalwork-health'

describe('isLegalworkHealthResponseBody', () => {
  it('accepts Legalwork serve health responses', () => {
    expect(isLegalworkHealthResponseBody(JSON.stringify({
      status: 'ok',
      service: 'legalwork',
      mode: 'serve'
    }))).toBe(true)
  })

  it('rejects generic or legacy runtime health responses', () => {
    expect(isLegalworkHealthResponseBody(JSON.stringify({ status: 'ok' }))).toBe(false)
    expect(isLegalworkHealthResponseBody(JSON.stringify({
      status: 'ok',
      service: 'codewhale',
      mode: 'serve'
    }))).toBe(false)
  })
})
