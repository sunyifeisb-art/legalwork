import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '../../i18n'
import { MessageTimelineEmptyHero } from './message-timeline-empty'

function renderHero(options: {
  route?: 'chat' | 'claw'
  ready?: boolean
  hasWorkspace?: boolean
  runtimeError?: string | null
} = {}): string {
  return renderToStaticMarkup(
    createElement(MessageTimelineEmptyHero, {
      route: options.route ?? 'chat',
      ready: options.ready ?? true,
      hasWorkspace: options.hasWorkspace ?? true,
      runtimeError: options.runtimeError ?? null,
      activeClawChannel: null,
      onPickWorkspace: () => undefined,
      onRetry: () => undefined,
      onOpenSettings: () => undefined,
      onSelectSuggestion: () => undefined
    })
  )
}

describe('MessageTimeline empty hero routing', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('does not show the usage heatmap for initial chat states', () => {
    const html = renderHero()

    expect(html).not.toContain('Legalwork usage')
    expect(html).not.toContain('ds-initial-usage-heatmap')
  })

  it('keeps offline, missing-workspace, and Claw empty states intact', () => {
    const offlineHtml = renderHero({ ready: false })
    expect(offlineHtml).toContain('legalwork is waking the local agent')
    expect(offlineHtml).toContain('ds-runtime-wake-logo')
    expect(offlineHtml).toContain('ds-work-logo')
    expect(renderHero({ hasWorkspace: false })).toContain('Choose working directory')
    const clawHtml = renderHero({ route: 'claw' })
    expect(clawHtml).toContain('Start a conversation with this assistant')
    expect(clawHtml).toContain('ds-claw-empty-whale-logo')
    expect(clawHtml).toContain('ds-work-logo')
    expect(clawHtml).not.toContain('Legalwork usage')
  })

  it('shows the runtime error in the offline hero when one is available', () => {
    const html = renderHero({
      ready: false,
      runtimeError: i18n.t('common:runtimePortConflict')
    })

    expect(html).toContain('The runtime port is already in use.')
  })
})
