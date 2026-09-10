import { describe, expect, it, vi } from 'vitest'

vi.mock('electron', () => ({}))
vi.mock('./logger', () => ({ logWarn: vi.fn() }))

import {
  installNonLatin1ResponseHeaderGuard,
  isNonLatin1ResponseHeaderError,
  stripNonLatin1ResponseHeaders
} from './non-latin1-headers'

describe('stripNonLatin1ResponseHeaders', () => {
  it('drops the header IMA uses to report an expired login', () => {
    const { headers, dropped } = stripNonLatin1ResponseHeaders({
      'content-type': ['application/json'],
      'trpc-error-msg': ['登录失败，请重新登录'],
      'trpc-func-ret': ['41']
    })

    expect(dropped).toEqual(['trpc-error-msg'])
    expect(headers).toEqual({
      'content-type': ['application/json'],
      'trpc-func-ret': ['41']
    })
  })

  it('keeps latin-1 headers, including accented ones', () => {
    const { headers, dropped } = stripNonLatin1ResponseHeaders({
      'x-note': ['café'],
      'x-plain': ['ok']
    })

    expect(dropped).toEqual([])
    expect(headers).toEqual({ 'x-note': ['café'], 'x-plain': ['ok'] })
  })

  it('drops a header when any one of its values is non-latin-1', () => {
    const { dropped } = stripNonLatin1ResponseHeaders({ 'x-mixed': ['ok', '登录失败'] })

    expect(dropped).toEqual(['x-mixed'])
  })
})

describe('installNonLatin1ResponseHeaderGuard', () => {
  it('installs a listener that strips the offending header before it reaches fetch', () => {
    let listener: ((details: unknown, callback: (response: unknown) => void) => void) | undefined
    const session = {
      webRequest: {
        onHeadersReceived: vi.fn((_filter: unknown, fn: typeof listener) => {
          listener = fn
        })
      }
    }

    installNonLatin1ResponseHeaderGuard(session as never, ['https://ima.qq.com/*'])

    expect(session.webRequest.onHeadersReceived).toHaveBeenCalledWith(
      { urls: ['https://ima.qq.com/*'] },
      expect.any(Function)
    )

    const callback = vi.fn()
    listener!(
      {
        url: 'https://ima.qq.com/cgi-bin/auth_login/refresh',
        responseHeaders: {
          'trpc-error-msg': ['登录失败，请重新登录'],
          'content-type': ['application/json']
        }
      },
      callback
    )

    expect(callback).toHaveBeenCalledWith({
      responseHeaders: { 'content-type': ['application/json'] }
    })
  })
})

describe('isNonLatin1ResponseHeaderError', () => {
  it('recognises the error Electron throws for non-latin-1 response headers', () => {
    const error = new TypeError(
      'Cannot convert argument to a ByteString because the character at index 0 has a value of 30331 which is greater than 255.'
    )

    expect(isNonLatin1ResponseHeaderError(error)).toBe(true)
  })

  it('does not treat unrelated failures as non-fatal', () => {
    expect(isNonLatin1ResponseHeaderError(new Error('listen EADDRINUSE: address already in use'))).toBe(false)
    expect(isNonLatin1ResponseHeaderError(undefined)).toBe(false)
  })
})
