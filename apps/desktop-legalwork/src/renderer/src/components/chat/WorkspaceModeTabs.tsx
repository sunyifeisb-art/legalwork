import type { ReactElement } from 'react'
import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { BookOpen, Eye, ShieldCheck } from 'lucide-react'

export interface WorkspaceModeTabsProps {
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
}: WorkspaceModeTabsProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  const tabs = [
    { key: 'chat', label: '工作', icon: BookOpen, onClick: onCodeOpen, show: true },
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

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="work / 脱敏 / 合规"
      className="relative mb-2 flex flex-row rounded-[10px] bg-[#f1f5f9] p-1 dark:bg-white/[0.06]"
    >
      {/* 滑动背景指示器 — 纯白 pill，完全在 padding 内 */}
      <div
        className="absolute top-1 h-[calc(100%-8px)] rounded-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] dark:bg-white/[0.12] dark:shadow-[0_1px_4px_rgba(0,0,0,0.2)]"
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
            className={`group relative z-10 inline-flex min-h-[32px] min-w-fit flex-1 items-center justify-center gap-1.5 rounded-[8px] px-3 text-left text-[14px] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black/10 dark:focus-visible:ring-white/20 ${
              isActive
                ? 'font-semibold text-[#1f2937] dark:text-white'
                : 'font-medium text-[#6b7280] hover:text-[#374151] dark:text-white/55 dark:hover:text-white/80'
            }`}
          >
            <span className="shrink-0">
              <Icon
                className="h-4 w-4"
                strokeWidth={isActive ? 2 : 1.7}
              />
            </span>
            <span className="truncate">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
