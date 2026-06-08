import { createElement } from 'react'
import type { ErrorInfo } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppErrorBoundary } from './AppErrorBoundary'

describe('AppErrorBoundary', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders children when no error occurs', () => {
    const html = renderToStaticMarkup(
      createElement(AppErrorBoundary, null, createElement('div', { 'data-testid': 'child' }, 'hello'))
    )
    expect(html).toContain('hello')
    expect(html).not.toContain('appErrorTitle')
  })

  it('renders without throwing when given no children', () => {
    const result = renderToStaticMarkup(createElement(AppErrorBoundary, null, null))
    expect(typeof result).toBe('string')
  })

  it('writes render errors to the app log API when available', () => {
    const logError = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('window', { dsGui: { logError } })
    const boundary = new AppErrorBoundary({ children: null })
    const error = new Error('boom')

    boundary.componentDidCatch(error, { componentStack: '\n    at Child' } as ErrorInfo)

    expect(logError).toHaveBeenCalledWith('renderer', 'Uncaught render error', {
      name: 'Error',
      message: 'boom',
      stack: error.stack,
      componentStack: '\n    at Child'
    })
  })
})
