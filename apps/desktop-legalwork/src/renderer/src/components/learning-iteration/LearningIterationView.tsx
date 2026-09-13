import { useEffect, type ReactElement, type ReactNode } from 'react'
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  BookOpenCheck,
  Check,
  ChevronDown,
  Circle,
  Clock3,
  Database,
  FileCheck2,
  History,
  Lightbulb,
  LoaderCircle,
  LockKeyhole,
  MemoryStick,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type {
  LearningIterationCounts,
  LearningIterationRecordDetail,
  LearningIterationStatus
} from '@shared/ds-gui-api'
import { AssistantMarkdown } from '../chat/AssistantMarkdown'
import { SidebarTitlebarToggleButton } from '../sidebar/SidebarPrimitives'
import { useLearningIterationStore } from '../../learning-iteration/learning-iteration-store'

const STAGES = [
  'learningStageCollect',
  'learningStageUnderstand',
  'learningStageExtract',
  'learningStageValidate',
  'learningStageConstruct',
  'learningStageTest',
  'learningStagePublish'
] as const

function formatDate(value: string): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function statusTone(status: LearningIterationStatus): string {
  if (status === 'failed') return 'border-red-500/25 bg-red-500/8 text-red-600 dark:text-red-300'
  if (status === 'running') return 'border-blue-500/25 bg-blue-500/8 text-blue-600 dark:text-blue-300'
  if (status === 'waiting') return 'border-amber-500/25 bg-amber-500/8 text-amber-600 dark:text-amber-300'
  if (status === 'disabled') return 'border-ds-border bg-ds-subtle text-ds-faint'
  return 'border-emerald-500/25 bg-emerald-500/8 text-emerald-600 dark:text-emerald-300'
}

function MetricCard({
  icon,
  label,
  value,
  detail
}: {
  icon: ReactNode
  label: string
  value: string | number
  detail?: string
}): ReactElement {
  return (
    <div className="rounded-[14px] border border-ds-border bg-ds-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[12px] text-ds-muted">
        <span className="text-accent">{icon}</span>
        {label}
      </div>
      <div className="mt-3 text-[23px] font-semibold tracking-tight text-ds-ink">{value}</div>
      {detail ? <div className="mt-1 text-[11.5px] text-ds-faint">{detail}</div> : null}
    </div>
  )
}

function CountSummary({ counts }: { counts: LearningIterationCounts }): ReactElement {
  const { t } = useTranslation('common')
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <MetricCard icon={<Database className="h-4 w-4" />} label={t('learningSources')} value={counts.sources} />
      <MetricCard
        icon={<MemoryStick className="h-4 w-4" />}
        label={t('learningMemoryChanges')}
        value={counts.memoriesCreated + counts.memoriesUpdated + counts.memoriesDisabled}
        detail={`+${counts.memoriesCreated} · ↻${counts.memoriesUpdated} · −${counts.memoriesDisabled}`}
      />
      <MetricCard
        icon={<Sparkles className="h-4 w-4" />}
        label={t('learningSkillChanges')}
        value={counts.skillsCreated + counts.skillsUpdated}
        detail={`+${counts.skillsCreated} · ↻${counts.skillsUpdated}`}
      />
      <MetricCard
        icon={<BookOpenCheck className="h-4 w-4" />}
        label={t('learningKnowledgeNotes')}
        value={counts.knowledgeNotesCreated + counts.knowledgeNotesUpdated}
        detail={`+${counts.knowledgeNotesCreated} · ↻${counts.knowledgeNotesUpdated}`}
      />
      <MetricCard icon={<ShieldCheck className="h-4 w-4" />} label={t('learningRejected')} value={counts.rejected} />
    </div>
  )
}

function learningChangeCount(counts: LearningIterationCounts): number {
  return counts.memoriesCreated + counts.memoriesUpdated + counts.memoriesDisabled
}

function skillChangeCount(counts: LearningIterationCounts): number {
  return counts.skillsCreated + counts.skillsUpdated
}

function knowledgeNoteChangeCount(counts: LearningIterationCounts): number {
  return counts.knowledgeNotesCreated + counts.knowledgeNotesUpdated
}

function OutcomeBar({
  label,
  value,
  max,
  tone
}: {
  label: string
  value: number
  max: number
  tone: string
}): ReactElement {
  const width = value === 0 ? 0 : Math.max(10, Math.round((value / Math.max(1, max)) * 100))
  return (
    <div className="grid grid-cols-[minmax(112px,0.85fr)_minmax(160px,2fr)_32px] items-center gap-3">
      <span className="truncate text-[12px] text-ds-muted">{label}</span>
      <div className="h-2 overflow-hidden rounded-full bg-ds-subtle">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${tone}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-right text-[12px] font-semibold tabular-nums text-ds-ink">{value}</span>
    </div>
  )
}

function LearningOutcomeReport({ detail }: { detail: LearningIterationRecordDetail }): ReactElement {
  const { t } = useTranslation('common')
  const { counts } = detail.summary
  const learnedCount = learningChangeCount(counts)
  const methodCount = skillChangeCount(counts)
  const knowledgeCount = knowledgeNoteChangeCount(counts)
  const acceptedCount = learnedCount + methodCount + knowledgeCount
  const chartMax = Math.max(counts.sources, learnedCount, methodCount, knowledgeCount, 1)

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[18px] border border-accent/15 bg-ds-card shadow-sm">
        <div className="relative bg-accent/[0.055] px-6 py-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11.5px] font-semibold text-accent">
                <Sparkles className="h-4 w-4" />
                {t('learningReportEyebrow')}
              </div>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.45px] text-ds-ink">
                {acceptedCount > 0 ? t('learningReportImprovedTitle') : t('learningReportCheckedTitle')}
              </h2>
              <p className="mt-2 max-w-[720px] text-[13.5px] leading-6 text-ds-muted">
                {detail.userReport.overview}
              </p>
            </div>
            <div className="hidden h-[82px] w-[82px] shrink-0 flex-col items-center justify-center rounded-full border-[7px] border-accent/15 bg-ds-card sm:flex">
              <span className="text-[23px] font-semibold tracking-tight text-ds-ink">{acceptedCount}</span>
              <span className="text-[10px] text-ds-faint">{t('learningReportGains')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-y divide-ds-border-muted border-t border-ds-border-muted md:grid-cols-5 md:divide-y-0">
          {[
            { label: t('learningReviewedContent'), value: counts.sources, detail: t('learningReviewedContentHint') },
            { label: t('learningUnderstandsYou'), value: learnedCount, detail: t('learningUnderstandsYouHint') },
            { label: t('learningNewMethods'), value: methodCount, detail: t('learningNewMethodsHint') },
            { label: t('learningKnowledgeNotes'), value: knowledgeCount, detail: t('learningKnowledgeNotesHint') },
            { label: t('learningCarefulFiltering'), value: counts.rejected, detail: t('learningCarefulFilteringHint') }
          ].map((item) => (
            <div key={item.label} className="px-5 py-4">
              <div className="text-[11.5px] text-ds-faint">{item.label}</div>
              <div className="mt-1.5 text-[21px] font-semibold tracking-tight text-ds-ink">{item.value}</div>
              <div className="mt-0.5 text-[10.5px] text-ds-faint">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <h3 className="text-[14px] font-semibold text-ds-ink">{t('learningOutcomeChart')}</h3>
          </div>
          <div
            className="mt-5 space-y-4"
            role="img"
            aria-label={t('learningOutcomeChartAria', {
              sources: counts.sources,
              learned: learnedCount,
              methods: methodCount,
              knowledge: knowledgeCount
            })}
          >
            <OutcomeBar label={t('learningReviewedContent')} value={counts.sources} max={chartMax} tone="bg-accent" />
            <OutcomeBar label={t('learningUnderstandsYou')} value={learnedCount} max={chartMax} tone="bg-emerald-500" />
            <OutcomeBar label={t('learningNewMethods')} value={methodCount} max={chartMax} tone="bg-violet-500" />
            <OutcomeBar label={t('learningKnowledgeNotes')} value={knowledgeCount} max={chartMax} tone="bg-amber-500" />
          </div>
          <p className="mt-5 text-[11px] leading-5 text-ds-faint">{t('learningOutcomeChartHint')}</p>
        </div>

        <div className="rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[14px] font-semibold text-ds-ink">{t('learningSafeTitle')}</h3>
          </div>
          <p className="mt-3 text-[12.5px] leading-6 text-ds-muted">{t('learningSafeDescription')}</p>
          <div className="mt-4 rounded-[10px] bg-emerald-500/[0.07] px-3 py-2.5 text-[11.5px] leading-5 text-emerald-700 dark:text-emerald-300">
            {counts.rejected > 0
              ? t('learningSafeRejected', { count: counts.rejected })
              : t('learningSafeNoRejected')}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4 text-accent" />
            <h3 className="text-[14px] font-semibold text-ds-ink">{t('learningWhatLearned')}</h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {detail.userReport.learned.length > 0 ? detail.userReport.learned.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-[11px] bg-ds-subtle px-3.5 py-3">
                <div className="text-[12.5px] font-semibold text-ds-ink">{item.title}</div>
                <p className="mt-1 text-[11.5px] leading-5 text-ds-muted">{item.detail}</p>
              </div>
            )) : (
              <p className="rounded-[11px] bg-ds-subtle px-3.5 py-3 text-[12px] leading-5 text-ds-muted">
                {t('learningNoStableFinding')}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h3 className="text-[14px] font-semibold text-ds-ink">{t('learningWhatImproves')}</h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {detail.userReport.improvements.length > 0 ? detail.userReport.improvements.map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex gap-3 rounded-[11px] bg-ds-subtle px-3.5 py-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <ArrowRight className="h-3 w-3" />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-ds-ink">{item.title}</div>
                  <p className="mt-1 text-[11.5px] leading-5 text-ds-muted">{item.detail}</p>
                </div>
              </div>
            )) : (
              <p className="rounded-[11px] bg-ds-subtle px-3.5 py-3 text-[12px] leading-5 text-ds-muted">
                {t('learningNoMethodChange')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
        <h3 className="text-[14px] font-semibold text-ds-ink">{t('learningNextTimeTitle')}</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {detail.userReport.nextTime.map((item, index) => (
            <div key={`${item}-${index}`} className="flex gap-2.5 rounded-[10px] bg-ds-subtle px-3 py-2.5">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span className="text-[11.5px] leading-5 text-ds-muted">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <details className="group rounded-[14px] border border-ds-border-muted bg-ds-card">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[12px] font-medium text-ds-muted hover:text-ds-ink">
          <span>{t('learningTechnicalRecord')}</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </summary>
        <article className="border-t border-ds-border-muted px-5 py-4">
          <AssistantMarkdown
            text={detail.reportMarkdown}
            streaming={false}
            className="min-w-0 text-[12.5px] leading-6 text-ds-muted"
          />
        </article>
      </details>
    </div>
  )
}

export function LearningIterationView({
  leftSidebarCollapsed,
  onToggleLeftSidebar
}: {
  leftSidebarCollapsed: boolean
  onToggleLeftSidebar: () => void
}): ReactElement {
  const { t } = useTranslation('common')
  const status = useLearningIterationStore((state) => state.status)
  const records = useLearningIterationStore((state) => state.records)
  const selectedId = useLearningIterationStore((state) => state.selectedId)
  const detail = useLearningIterationStore((state) => state.detail)
  const loading = useLearningIterationStore((state) => state.loading)
  const actionPending = useLearningIterationStore((state) => state.actionPending)
  const notice = useLearningIterationStore((state) => state.notice)
  const refresh = useLearningIterationStore((state) => state.refresh)
  const queue = useLearningIterationStore((state) => state.queue)
  const cancel = useLearningIterationStore((state) => state.cancel)
  const rollback = useLearningIterationStore((state) => state.rollback)

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => void refresh(), 5_000)
    return () => window.clearInterval(timer)
  }, [refresh])

  const current = detail?.summary ?? records.find((record) => record.id === selectedId) ?? null

  return (
    <div className="ds-no-drag flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex min-h-[66px] shrink-0 items-center border-b border-ds-border-muted px-6">
        {leftSidebarCollapsed ? (
          <SidebarTitlebarToggleButton
            onClick={onToggleLeftSidebar}
            title={t('sidebarExpand')}
            ariaLabel={t('sidebarExpand')}
            className="mr-3"
          />
        ) : null}
        <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-accent/10 text-accent">
          <BrainCircuit className="h-5 w-5" strokeWidth={1.7} />
        </div>
        <div className="ml-3 min-w-0">
          <h1 className="truncate text-[16px] font-semibold text-ds-ink">
            {selectedId ? t('learningReportTitle') : t('learningIterationOverview')}
          </h1>
          <p className="mt-0.5 truncate text-[11.5px] text-ds-faint">
            {selectedId && current
              ? `${formatDate(current.finishedAt)} · ${t('learningIterationRecordSubtitle')}`
              : selectedId
                ? t('learningIterationRecordSubtitle')
                : t('learningIterationSubtitle')}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {selectedId ? (
          <div className="mx-auto w-full max-w-[980px] px-6 py-7">
            {current ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold ${statusTone(current.status)}`}>
                  {t(`learningStatus_${current.status}`)}
                </div>
                {current.canRollback ? (
                  <button
                    type="button"
                    disabled={actionPending}
                    onClick={() => void rollback(current.id)}
                    className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-ds-border bg-ds-card px-3 text-[12px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t('learningRollback')}
                  </button>
                ) : null}
              </div>
            ) : null}
            {loading && !detail ? (
              <div className="flex min-h-[240px] items-center justify-center text-ds-faint">
                <LoaderCircle className="h-5 w-5 animate-spin" />
              </div>
            ) : detail ? (
              <LearningOutcomeReport detail={detail} />
            ) : (
              <div className="rounded-[14px] border border-ds-border bg-ds-card p-6 text-[13px] text-ds-muted">
                {notice || t('learningIterationLoadFailed')}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1080px] px-6 py-7">
            <section className="rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-accent" />
                    <h2 className="text-[14px] font-semibold text-ds-ink">{t('learningCurrentStatus')}</h2>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[11.5px] font-semibold ${statusTone(status?.status ?? 'idle')}`}>
                      {t(`learningStatus_${status?.status ?? 'idle'}`)}
                    </span>
                    <span className="text-[12.5px] text-ds-muted">{status?.message ?? t('learningIterationLoading')}</span>
                  </div>
                </div>
                <div data-control-hover-root className="flex gap-2">
                  {status?.running || status?.queued ? (
                    <button
                      type="button"
                      disabled={actionPending}
                      onClick={() => void cancel()}
                      className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-ds-border bg-ds-card px-3.5 text-[12.5px] font-semibold text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      {t('learningCancel')}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={!status?.enabled || actionPending || status?.running || status?.queued}
                    onClick={() => void queue()}
                    className="inline-flex h-9 items-center gap-2 rounded-[9px] bg-accent px-3.5 text-[12.5px] font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {actionPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    {t('learningCheckNow')}
                  </button>
                </div>
              </div>
              {notice ? (
                <div className="mt-4 rounded-[9px] border border-ds-border-muted bg-ds-subtle px-3 py-2 text-[12px] text-ds-muted">
                  {notice}
                </div>
              ) : null}
            </section>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MetricCard
                icon={<Clock3 className="h-4 w-4" />}
                label={t('learningLastSuccess')}
                value={status?.lastSuccessfulAt ? formatDate(status.lastSuccessfulAt) : '—'}
              />
              <MetricCard
                icon={<FileCheck2 className="h-4 w-4" />}
                label={t('learningTodayEligibility')}
                value={!status?.enabled
                  ? t('learningDisabledShort')
                  : status.running || status.queued
                    ? t('learningQueuedShort')
                    : status.eligibleToday
                      ? t('learningEligibleShort')
                      : t('learningUsedTodayShort')}
              />
              <MetricCard
                icon={<History className="h-4 w-4" />}
                label={t('learningBaselineProgress')}
                value={`${Math.round((status?.baselineProgress ?? 0) * 100)}%`}
                detail={status?.baselineComplete ? t('learningBaselineComplete') : t('learningBaselineContinuing')}
              />
              <MetricCard
                icon={<Database className="h-4 w-4" />}
                label={t('learningNextBatch')}
                value={status?.pendingSourceCount ?? 0}
                detail={t('learningNextBatchUnit')}
              />
            </div>

            {status?.latest ? (
              <div className="mt-4">
                <CountSummary counts={status.latest.counts} />
              </div>
            ) : null}

            <section className="mt-4 rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
              <h2 className="text-[14px] font-semibold text-ds-ink">{t('learningPipeline')}</h2>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
                {STAGES.map((stage, index) => {
                  const completed = status?.latest?.status === 'completed' || status?.latest?.status === 'rolled_back'
                  const runningIndex = status?.running ? 2 : -1
                  return (
                    <div key={stage} className="relative rounded-[10px] border border-ds-border-muted bg-ds-subtle px-3 py-3">
                      <div className="flex items-center gap-2">
                        {completed || index < runningIndex ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : index === runningIndex ? (
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-500" />
                        ) : (
                          <Circle className="h-3 w-3 text-ds-faint" />
                        )}
                        <span className="text-[11.5px] font-medium text-ds-muted">{t(stage)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="mt-4 rounded-[16px] border border-ds-border bg-ds-card p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[14px] font-semibold text-ds-ink">{t('learningLatestSummary')}</h2>
                {status?.latest?.canRollback ? (
                  <button
                    type="button"
                    disabled={actionPending}
                    onClick={() => void rollback(status.latest!.id)}
                    className="inline-flex h-8 items-center gap-2 rounded-[8px] border border-ds-border bg-ds-card px-3 text-[12px] font-medium text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t('learningRollbackLatest')}
                  </button>
                ) : null}
              </div>
              <p className="mt-3 text-[13px] leading-6 text-ds-muted">
                {status?.latest
                  ? `${status.latest.displayName} · ${formatDate(status.latest.finishedAt)}`
                  : t('learningNoSummary')}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
