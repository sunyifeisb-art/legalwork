import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '../../../i18n'
import { WorkspaceModeTabs } from '../WorkspaceModeTabs'

describe('WorkspaceModeTabs', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('renders two tab buttons', () => {
    const onCodeOpen = vi.fn()
    const onDataComplianceOpen = vi.fn()

    const html = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'chat',
        onCodeOpen,
        onDataComplianceOpen
      })
    )

    // Both buttons exist
    expect(html).toContain('work')
    expect(html).toContain('合规')
    // Both have role="tab"
    expect(html.match(/role="tab"/g)?.length).toBe(2)
  })

  it('uses horizontal row layout not vertical column', () => {
    const onCodeOpen = vi.fn()
    const onDataComplianceOpen = vi.fn()

    const html = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'chat',
        onCodeOpen,
        onDataComplianceOpen
      })
    )

    // Container should have flex-row, not flex-col
    expect(html).toContain('flex-row')
    expect(html).not.toContain('flex-col')
  })

  it('buttons use flex-1 for equal width instead of w-full', () => {
    const onCodeOpen = vi.fn()
    const onDataComplianceOpen = vi.fn()

    const html = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'chat',
        onCodeOpen,
        onDataComplianceOpen
      })
    )

    // Each button should have flex-1 to distribute space equally
    const flex1Matches = html.match(/flex-1/g)
    expect(flex1Matches?.length).toBe(2)
  })

  it('marks active button with aria-selected true', () => {
    const onCodeOpen = vi.fn()
    const onDataComplianceOpen = vi.fn()

    // work active
    const htmlCode = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'chat',
        onCodeOpen,
        onDataComplianceOpen
      })
    )
    // Exactly one button has aria-selected="true" and one has aria-selected="false"
    const selectedTrue = htmlCode.match(/aria-selected="true"/g)
    const selectedFalse = htmlCode.match(/aria-selected="false"/g)
    expect(selectedTrue?.length).toBe(1)
    expect(selectedFalse?.length).toBe(1)

    // Data compliance active
    const htmlDataCompliance = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'dataCompliance',
        onCodeOpen,
        onDataComplianceOpen
      })
    )
    const selectedTrueW = htmlDataCompliance.match(/aria-selected="true"/g)
    const selectedFalseW = htmlDataCompliance.match(/aria-selected="false"/g)
    expect(selectedTrueW?.length).toBe(1)
    expect(selectedFalseW?.length).toBe(1)
  })

  it('preserves truncate class on button text for narrow sidebars', () => {
    const onCodeOpen = vi.fn()
    const onDataComplianceOpen = vi.fn()

    const html = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'chat',
        onCodeOpen,
        onDataComplianceOpen
      })
    )

    // Both label spans should have truncate class
    const truncateMatches = html.match(/truncate/g)
    expect(truncateMatches?.length).toBe(2)
  })

  it('preserves min-w-fit on buttons for flex truncation', () => {
    const onCodeOpen = vi.fn()
    const onDataComplianceOpen = vi.fn()

    const html = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'chat',
        onCodeOpen,
        onDataComplianceOpen
      })
    )

    // min-w-fit prevents the flex children from collapsing too small while still allowing truncation
    expect(html).toContain('min-w-fit')
  })

  it('renders role="tablist" container with descriptive aria-label', () => {
    const onCodeOpen = vi.fn()
    const onDataComplianceOpen = vi.fn()

    const html = renderToStaticMarkup(
      createElement(WorkspaceModeTabs, {
        activeView: 'chat',
        onCodeOpen,
        onDataComplianceOpen
      })
    )

    expect(html).toContain('role="tablist"')
    expect(html).toContain('work / 脱敏 / 合规')
  })
})
