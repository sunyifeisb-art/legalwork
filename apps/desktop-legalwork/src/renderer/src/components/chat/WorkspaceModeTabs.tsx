import type { ReactElement } from 'react'
import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { BookOpen, Eye, ShieldCheck } from 'lucide-react'

type Props = {
  activeView: 'chat' | 'dataCompliance' | 'desensitize' | 'claw' | 'schedule' | 'documentWriting' | 'write' | 'legalResearch'
  onCodeOpen: () => void
  onDataComplianceOpen: () => void
  onDesensitizeOpen?: () => void
  onWriteOpen?: () => void
}

export function WorkspaceModeTabs({
  activeView,
  onCodeOpen,
  onDataComplianceOpen,
  onDesensitizeOpen
}: Props): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  const tabs = [
    { key: 'chat', label: 'work', icon: BookOpen, onClick: onCodeOpen, show: true },
    { key: 'desensitize', label: '脱敏', icon: Eye, onClick: onDesensitizeOpen, show: !!onDesensitizeOpen },
    { key: 'dataCompliance', label: '合规', icon: ShieldCheck, onClick: onDataComplianceOpen, show: true },
  ] as const

  const visibleTabs = tabs.filter(t => t.show)
  const activeIndex = visibleTabs.findIndex(t => t.key === activeView)

  const updateIndicator = useCallback(() => {
    const container = containerRef.current
    if (!container || activeIndex < 0) {
      setIndicatorStyle({ left: 0, width: 0 })
      return
    }
    const buttons = container.querySelectorAll('button[data-tab]')
    const activeBtn = buttons[activeIndex] as HTMLElement | undefined
    if (!activeBtn) {
      setIndicatorStyle({ left: 0, width: 0 })
      return
    }
    setIndicatorStyle({
      left: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
    })
  }, [activeIndex])

  useLayoutEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(updateIndicator)
    observer.observe(container)
    window.addEventListener('resize', updateIndicator)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateIndicator)
    }
  }, [updateIndicator])

  const tabClass = (active: boolean): string =>
    `group relative inline-flex min-h-[32px] flex-1 min-w-fit items-center justify-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[15px] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20 ${
      active
        ? 'font-medium text-[#182230] dark:text-white'
        : 'font-normal text-[#5c6675] hover:text-[#1f2733] dark:text-white/58 dark:hover:text-white/88'
    }`

  const iconClass = (active: boolean): string =>
    `flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-[7px] transition-colors duration-200 ${
      active
        ? 'bg-[var(--ds-accent-soft)] text-[var(--ds-accent)] shadow-[inset_0_0_0_1px_rgba(0,136,255,0.12)] dark:bg-[rgba(51,156,255,0.2)] dark:text-[#78bdff] dark:shadow-[inset_0_0_0_1px_rgba(51,156,255,0.16)]'
        : 'text-[#6f7a89] group-hover:bg-white/55 group-hover:text-[#344055] dark:text-white/48 dark:group-hover:bg-white/[0.06] dark:group-hover:text-white/78'
    }`

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="work / 脱敏 / 合规"
      className="relative mb-2 flex flex-row gap-1 rounded-[8px] border border-[var(--ds-sidebar-row-ring)] bg-[color-mix(in_srgb,var(--ds-sidebar-field-bg)_84%,transparent)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] dark:bg-white/[0.035] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
    >
      {/* 滑动背景指示器 */}
      <div
        className="absolute top-1 h-[calc(100%-8px)] rounded-[8px] bg-[var(--ds-sidebar-field-focus)] shadow-[0_1px_3px_rgba(15,23,42,0.07),inset_0_0_0_1px_var(--ds-sidebar-row-ring),inset_0_1px_0_rgba(255,255,255,0.78)] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] dark:bg-white/[0.09] dark:shadow-[0_1px_5px_rgba(0,0,0,0.24),inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
      {visibleTabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeView === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            data-tab={tab.key}
            aria-selected={isActive}
            onClick={tab.onClick}
            className={tabClass(isActive)}
          >
            <span className={iconClass(isActive)}>
              <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
            </span>
            <span className="truncate">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
