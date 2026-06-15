import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpCircle, Download, Loader2, RefreshCw } from 'lucide-react'
import type { GuiUpdateState } from '@shared/gui-update'
import { DEFAULT_GUI_UPDATE_CHANNEL } from '@shared/gui-update'

export function GuiUpdateBadge(): ReactElement | null {
  const { t } = useTranslation(['common', 'settings'])
  const [guiUpdateState, setGuiUpdateState] = useState<GuiUpdateState>({ status: 'idle' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (typeof window.dsGui?.onGuiUpdateState !== 'function') return
    const applyState = (state: GuiUpdateState): void => {
      setGuiUpdateState(state)
    }
    const unsubscribe = window.dsGui.onGuiUpdateState(applyState)
    if (typeof window.dsGui?.getGuiUpdateState === 'function') {
      void window.dsGui.getGuiUpdateState().then(applyState).catch(() => undefined)
    }
    return unsubscribe
  }, [])

  // Determine what to show
  const { status, info, message: errorMessage } = guiUpdateState

  // Only show when there's an actionable state
  const hasUpdate = info?.ok && info.hasUpdate
  const isDownloading = status === 'downloading' || busy
  const isInstalling = status === 'installing'
  const isChecking = status === 'checking' && !hasUpdate
  const isError = status === 'error'
  const isIdle = status === 'idle' || status === 'not_available'

  // If no actionable state, don't render anything
  if (isIdle || isChecking) {
    // Still render a subtle check button when idle
    if (isChecking) {
      return (
        <button
          type="button"
          disabled
          className="flex min-h-[34px] w-full items-center gap-2.5 rounded-[8px] px-3 py-1.5 text-[13px] text-[#888888] opacity-60"
          title={t('settings:guiUpdateChecking')}
        >
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
          <span className="truncate">{t('settings:guiUpdateChecking')}</span>
        </button>
      )
    }
    return null
  }

  // Error state
  if (isError && !hasUpdate) {
    return null
  }

  // Update available – show prominent badge
  const isManualOnly = info?.ok && info.manualOnly
  const isDownloaded = (info?.ok && info.downloaded) || status === 'downloaded'
  const canDownload = hasUpdate && !isManualOnly && !isDownloaded && !isDownloading
  const canInstall = hasUpdate && isDownloaded && !isInstalling

  const handleClick = async (): Promise<void> => {
    if (busy) return
    setBusy(true)
    try {
      if (isManualOnly && info?.ok) {
        await window.dsGui.openExternal(info.releaseUrl)
        return
      }
      if (canInstall) {
        await window.dsGui.installGuiUpdate()
        return
      }
      if (canDownload) {
        const channel = info?.ok ? info.channel : DEFAULT_GUI_UPDATE_CHANNEL
        const result = await window.dsGui.downloadGuiUpdate(channel)
        if (!result.ok) {
          console.warn('[gui-update-badge] download failed:', result.message)
        }
        return
      }
      // Fallback: check for updates
      await window.dsGui.checkGuiUpdate(DEFAULT_GUI_UPDATE_CHANNEL)
    } finally {
      setBusy(false)
    }
  }

  // Pick icon and label
  let icon: ReactElement
  let label: string
  let badgeClass: string

  if (isDownloading) {
    const percent = guiUpdateState.status === 'downloading'
      ? Math.max(0, Math.round(guiUpdateState.progress?.percent ?? 0))
      : 0
    icon = <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
    label = t('guiUpdateTopbarDownloading', { percent })
    badgeClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  } else if (isInstalling) {
    icon = <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
    label = t('settings:guiUpdateInstalling')
    badgeClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  } else if (isDownloaded || canInstall) {
    icon = <RefreshCw className="h-4 w-4" strokeWidth={2} />
    label = t('settings:guiUpdateInstall')
    badgeClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 animate-pulse'
  } else if (isManualOnly) {
    icon = <ExternalLinkIcon className="h-4 w-4" strokeWidth={1.75} />
    label = t('guiUpdateTopbarManual', { version: info?.latestVersion ?? '' })
    badgeClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
  } else if (hasUpdate) {
    icon = <ArrowUpCircle className="h-4 w-4" strokeWidth={2} />
    label = t('guiUpdateTopbarAvailable', { version: info?.latestVersion ?? '' })
    badgeClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse'
  } else {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={busy || isDownloading || isInstalling}
      className={`flex min-h-[34px] w-full items-center gap-2.5 rounded-[8px] border px-3 py-1.5 text-[13px] font-medium shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55 ${badgeClass}`}
      title={
        isManualOnly && info?.ok
          ? t('settings:guiUpdateAvailableManual', {
              current: info.currentVersion,
              latest: info.latestVersion
            })
          : label
      }
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {!isDownloading && !isInstalling && (
        <span className="shrink-0 text-[11px] opacity-70">
          {isManualOnly ? t('settings:guiUpdateOpenRelease') : t('settings:guiUpdateDownload')}
        </span>
      )}
    </button>
  )
}

/** Inline simple external-link icon to avoid importing the full lucide icon set twice */
function ExternalLinkIcon({ className, strokeWidth }: { className?: string; strokeWidth?: number }): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
