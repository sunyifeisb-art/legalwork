import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { RuntimeBanner } from './RuntimeBanner'

describe('RuntimeBanner', () => {
  it('renders a details affordance when technical details are available', () => {
    const html = renderToStaticMarkup(createElement(RuntimeBanner, {
      message: 'Runtime request failed.',
      detail: 'Code: provider_unavailable\n\nMessage:\nprovider failed',
      logPath: '/tmp/deepseek-gui/logs',
      runtimeReady: true,
      stageInsetClass: 'px-4',
      t: (key: string) => key,
      onOpenLogDir: vi.fn(),
      onOpenSettings: vi.fn(),
      onRetryConnection: vi.fn()
    }))

    expect(html).toContain('Runtime request failed.')
    expect(html).toContain('runtimeErrorDetails')
    expect(html).toContain('runtimeErrorLogPath')
    expect(html).toContain('/tmp/deepseek-gui/logs')
    expect(html).toContain('windowsMenuOpenLogDir')
  })
})
