import { beforeEach, describe, expect, it, vi } from 'vitest'

const clearStorageData = vi.fn(async () => undefined)
const clearCache = vi.fn(async () => undefined)
const onHeadersReceived = vi.fn()
const fromPartition = vi.fn(() => ({
  clearStorageData,
  clearCache,
  webRequest: { onHeadersReceived }
}))

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/tmp/legalwork-ima-auth-test')
  },
  BrowserWindow: class {},
  session: {
    fromPartition
  }
}))

describe('IMA authentication session', () => {
  beforeEach(() => {
    clearStorageData.mockClear()
    clearCache.mockClear()
    fromPartition.mockClear()
  })

  it('clears persistent cookies and local storage before re-login', async () => {
    const { clearImaLoginSession } = await import('./ima-auth-manager')

    await clearImaLoginSession()

    expect(fromPartition).toHaveBeenCalledWith('persist:ima-persistent', { cache: true })
    expect(clearStorageData).toHaveBeenCalledWith({
      storages: ['cookies', 'localstorage']
    })
    expect(clearCache).toHaveBeenCalledOnce()
  })

  it('extracts personal and shared knowledge bases from nested wikis responses', async () => {
    const { extractImaKnowledgeBases } = await import('./ima-auth-manager')

    expect(extractImaKnowledgeBases({
      data: {
        owned: [{ knowledge_base_id: '7305806844290061', knowledge_base_name: '个人库' }],
        joined: [{ kbId: 'shared_kb_12345', name: '共享库' }]
      }
    })).toEqual([
      { id: '7305806844290061', name: '个人库' },
      { id: 'shared_kb_12345', name: '共享库' }
    ])
  })

  it('verifies credentials through the token refresh endpoint and updates IMA-TOKEN', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      code: 0,
      msg: 'ok',
      token: 'fresh-token'
    }), { status: 200 }))
    const { verifyImaAuth } = await import('./ima-auth-manager')

    const result = await verifyImaAuth({
      cookie: 'IMA-UID=user-1; IMA-REFRESH-TOKEN=refresh-token; IMA-TOKEN=old-token',
      bkn: 'bkn',
      capturedAt: '2026-07-31T00:00:00.000Z'
    }, { fetch: fetchMock } as never)

    expect(result.status).toBe('valid')
    if (result.status !== 'valid') throw new Error('expected valid result')
    expect(result.auth.cookie).toContain('IMA-TOKEN=fresh-token')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://ima.qq.com/cgi-bin/auth_login/refresh',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('rejects incomplete standard cookies instead of saving them as IMA auth', async () => {
    const fetchMock = vi.fn()
    const { verifyImaAuth } = await import('./ima-auth-manager')

    const result = await verifyImaAuth({
      cookie: 'uin=123; p_skey=anonymous',
      bkn: 'bkn',
      capturedAt: '2026-07-31T00:00:00.000Z'
    }, { fetch: fetchMock } as never)

    expect(result.status).toBe('expired')
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
