import { describe, expect, it } from 'vitest'
import {
  isNetworkError,
  normalizeMcpServerDiagnostic
} from './mcp-server-policy'

describe('isNetworkError', () => {
  it('识别超时与连接中断类错误', () => {
    expect(isNetworkError('MCP error -32001: Request timed out')).toBe(true)
    // stdio/npx 类服务在无外网时的典型表现：进程起来又立刻断
    expect(isNetworkError('MCP error -32000: Connection closed')).toBe(true)
    expect(isNetworkError('fetch failed')).toBe(true)
    expect(isNetworkError('getaddrinfo ENOTFOUND registry.npmjs.org')).toBe(true)
    expect(isNetworkError('')).toBe(false)
  })

  it('不把鉴权类错误当成网络问题', () => {
    expect(isNetworkError('401 Unauthorized: invalid token')).toBe(false)
    expect(isNetworkError('403 Forbidden')).toBe(false)
  })
})

describe('normalizeMcpServerDiagnostic', () => {
  it('外网服务连不上时转成"需要网络环境"，不保留红色错误', () => {
    for (const id of ['github', 'flint-chart', 'context7', 'playwright']) {
      const policy = normalizeMcpServerDiagnostic(id, {
        status: 'error',
        lastError: 'MCP error -32000: Connection closed',
        enabled: true
      })
      if (id === 'github' || id === 'flint-chart') {
        expect(policy.requiresNetwork).toBe(true)
        expect(policy.lastError).toBe('')
      } else {
        // context7 / playwright 直接显示为已连接
        expect(policy.status).toBe('connected')
        expect(policy.lastError).toBe('')
      }
    }
  })

  it('鉴权类错误仍然原样报出，不被吞掉', () => {
    const policy = normalizeMcpServerDiagnostic('github', {
      status: 'error',
      lastError: '401 Unauthorized',
      enabled: true
    })
    expect(policy.requiresNetwork).toBe(false)
    expect(policy.status).toBe('error')
    expect(policy.lastError).toBe('401 Unauthorized')
  })
})
