import type { ReactElement } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Scale, Square, ChevronDown, ChevronRight, FileDown } from 'lucide-react'
import { MessageBubble } from '../chat/message-timeline-bubbles'
import { AssistantMarkdown } from '../chat/AssistantMarkdown'
import type { ChatBlock } from '../../agent/types'
import type { ReturnUseLegalResearch } from './useLegalResearch'

export type LegalResearchPanelProps = {
  legalResearch: ReturnUseLegalResearch
}

export function LegalResearchPanel({ legalResearch }: LegalResearchPanelProps): ReactElement {
  const { t } = useTranslation('common')
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const stickToBottomRef = useRef(true)
  const [reasoningExpanded, setReasoningExpanded] = useState(false)
  const [clockNow, setClockNow] = useState(Date.now())
  const {
    activeRecord,
    isResearching,
    runResearch,
    stopResearch
  } = legalResearch

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isResearching || activeRecord?.status !== 'running') return
    setClockNow(Date.now())
    const timer = window.setInterval(() => setClockNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [activeRecord?.id, activeRecord?.status, isResearching])

  useLayoutEffect(() => {
    stickToBottomRef.current = true
    const frame = window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ block: 'end' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activeRecord?.id])

  useEffect(() => {
    if (!isResearching || !stickToBottomRef.current) return
    const frame = window.requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ block: 'end' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [activeRecord?.steps, activeRecord?.reasoning, activeRecord?.summary, activeRecord?.error, clockNow, isResearching])

  const handleResultsScroll = useCallback(() => {
    const element = scrollRef.current
    if (!element) return
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight
    stickToBottomRef.current = distanceFromBottom < 140
  }, [])

  const handleStart = useCallback(() => {
    if (!query.trim() || isResearching) return
    void runResearch(query.trim())
    setQuery('')
  }, [query, isResearching, runResearch])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleStart()
    },
    [handleStart]
  )

  const handleExportWord = useCallback(() => {
    if (!activeRecord?.summary) return

    const { query, summary, reasoning, steps, timestamp } = activeRecord

    // Build a complete HTML document for Word export
    const summaryHtml = summary
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => {
        if (match.includes('<ul>')) return match
        return `<ol>${match}</ol>`
      })
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/\n{2,}/g, '\n')
      .split('\n')
      .map((line) => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        if (/^<[holeu]/.test(trimmed) || /^<\/(ul|ol)>/.test(trimmed)) return line
        return `<p>${trimmed}</p>`
      })
      .join('\n')

    const reasoningHtml = reasoning
      ? reasoning
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .split('\n')
          .map((l) => `<p>${l.trim()}</p>`)
          .join('\n')
      : ''

    const stepsHtml = steps
      .map(
        (s) =>
          `<tr><td>${s.icon}</td><td>${s.tool}</td><td>${s.status}</td><td>${s.output ?? ''}</td></tr>`
      )
      .join('\n')

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>法律调研报告 - ${query}</title>
  <style>
    body { font-family: SimSun, serif; font-size: 12pt; line-height: 1.8; color: #222; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 22pt; text-align: center; border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 8px; }
    h2 { font-size: 16pt; margin-top: 28px; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    h3 { font-size: 14pt; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #bbb; padding: 6px 10px; text-align: left; }
    th { background: #f0f0f0; font-weight: bold; }
    code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; font-size: 11pt; }
    pre { background: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 16px; color: #666; }
    ul, ol { margin: 6px 0; padding-left: 24px; }
    li { margin: 2px 0; }
    .meta { text-align: center; color: #888; font-size: 10pt; margin-bottom: 30px; }
    .step-table { margin-top: 16px; }
  </style>
</head>
<body>
  <h1>📋 ${t('legalResearch')}报告</h1>
  <div class="meta">${t('legalResearchQuestion')}：${query}<br>${timestamp}</div>

  <h2>🔍 ${t('legalResearchQuestion')}</h2>
  <p>${query}</p>

  <h2>📄 ${t('legalResearchSummaryTitle')}</h2>
  ${summaryHtml}

  ${reasoning ? `<h2>🧠 ${t('legalResearchReasoning')}</h2>\n  ${reasoningHtml}` : ''}

  ${steps.length > 0 ? `<h2>🛠 调研步骤</h2>\n  <table class="step-table">\n    <tr><th></th><th>工具</th><th>状态</th><th>输出</th></tr>\n${stepsHtml}\n  </table>` : ''}
</body>
</html>`

    const defaultName = `法律调研_${query.slice(0, 30)}`.replace(/[<>:"/\\|?*]/g, '_')
    window.dsGui?.exportLegalResearchToWord?.({ html, defaultName }).then((result) => {
      if (!result.ok && !result.canceled) {
        console.error('导出 Word 失败:', (result as { message?: string }).message)
      }
    }).catch(console.error)
  }, [activeRecord, t])

  const renderBlock = (block: ChatBlock): ReactElement | null => {
    if (block.kind === 'user') {
      return (
        <div key={block.id} className="flex justify-end">
          <div className="max-w-[80%] rounded-[20px] bg-[var(--ds-userbubble)] px-4 py-2.5 text-[13px] text-[var(--ds-userbubbleFg)]">
            {block.text}
          </div>
        </div>
      )
    }
    return (
      <div key={block.id} className={block.kind === 'assistant' ? 'pl-0' : 'pl-0'}>
        <MessageBubble block={block} />
      </div>
    )
  }

  // Extract key actions from reasoning text
  const extractKeyActions = (reasoning: string): string[] => {
    const actions: string[] = []
    const lines = reasoning.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      
      // Match patterns like "1. Search for...", "Let me...", "I'll...", "I need to..."
      if (
        /^\d+\./.test(trimmed) ||
        /^(Let me|I'll|I need to|I should|Now I|Next I|First|Then|Finally|I will|I am going to)/i.test(trimmed) ||
        /^(搜索|查找|检索|调用|使用|开始|现在|接下来|首先|然后|最后)/i.test(trimmed)
      ) {
        // Truncate long lines
        const short = trimmed.length > 120 ? trimmed.slice(0, 120) + '...' : trimmed
        actions.push(short)
      }
    }
    
    return actions.slice(0, 8) // Limit to 8 key actions
  }

  // Split reasoning text into sentences for readable multi-line display
  const splitSentences = (text: string): string[] => {
    if (!text.trim()) return []
    // Split by Chinese/English sentence terminators, keeping the delimiter
    const raw = text.split(/(?<=[。！？.!?])\s*/).filter(Boolean)
    // Merge very short fragments (< 6 chars) with the previous sentence
    const merged: string[] = []
    for (const part of raw) {
      const trimmed = part.trim()
      if (!trimmed) continue
      if (merged.length > 0 && trimmed.length < 6) {
        merged[merged.length - 1] += ' ' + trimmed
      } else {
        merged.push(trimmed)
      }
    }
    return merged
  }

  // Preprocess summary text to handle non-standard table/flowchart formatting from AI
  const preprocessSummary = (text: string): string => {
    if (!text) return ''
    return text
      .replace(/\|\|\|/g, '\n  - ')
      .replace(/\|\|/g, '\n  - ')
      .replace(/^\|(?![-\s])/gm, '')
      .replace(/(?<!\|)\|(?!\||[\s\-:])/g, '')
      .replace(/\n{4,}/g, '\n\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
  }

  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.max(0, Math.floor(milliseconds / 1000))
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainder = seconds % 60
    if (minutes < 60) return `${minutes}m ${remainder}s`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  const updatedAt = activeRecord?.updatedAt ?? Date.now()
  const runningSteps = activeRecord?.steps.filter((step) => step.status === 'running') ?? []
  const lastRunningStep = runningSteps[runningSteps.length - 1]
  const runningSince = activeRecord?.status === 'running' ? clockNow - updatedAt : 0

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[var(--ds-main)]">
        {/* Search header */}
        <div className="border-b border-[var(--ds-border)] px-6 py-5">
          <h2 className="mb-3 flex items-center gap-2 text-base font-medium text-[var(--ds-ink)]">
            <Scale className="h-5 w-5" strokeWidth={1.75} />
            {t('legalResearch')}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-faint)]" strokeWidth={1.75} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('legalResearchPlaceholder')}
                disabled={isResearching}
                className="w-full rounded-[8px] border border-[var(--ds-border)] bg-[var(--ds-sidebar-field-bg)] py-2.5 pl-9 pr-4 text-[13px] text-[var(--ds-ink)] placeholder:text-[var(--ds-faint)] outline-none transition-colors focus:border-[var(--ds-accent)] disabled:opacity-60"
              />
            </div>
            {isResearching ? (
              <button
                type="button"
                onClick={stopResearch}
                className="flex items-center gap-1.5 rounded-[8px] border border-[var(--ds-border)] bg-[var(--ds-card-soft)] px-4 py-2.5 text-[13px] font-medium text-[var(--ds-ink)] shadow-sm transition hover:brightness-95"
              >
                <Square className="h-3.5 w-3.5 fill-current" strokeWidth={1.75} />
                {t('legalResearchStop')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                disabled={!query.trim()}
                className="rounded-[8px] bg-[var(--ds-accent)] px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('legalResearchStart')}
              </button>
            )}
          </div>
          <p className="mt-2 text-[11px] text-[var(--ds-faint)]">{t('legalResearchHint')}</p>
        </div>

        {/* Export button row */}
        {activeRecord?.summary && (
          <div className="flex items-center justify-end border-b border-[var(--ds-border)] px-6 py-2">
            <button
              type="button"
              onClick={handleExportWord}
              className="flex items-center gap-1.5 rounded-[6px] border border-[var(--ds-border)] bg-[var(--ds-sidebar-field-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--ds-ink)] transition-colors hover:bg-[var(--ds-sidebar-row-hover)]"
            >
              <FileDown className="h-3.5 w-3.5" strokeWidth={1.75} />
              {t('legalResearchExportWord')}
            </button>
          </div>
        )}

        {/* Results area */}
        <div
          ref={scrollRef}
          onScroll={handleResultsScroll}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-5"
        >
          {!activeRecord ? (
            <div className="flex h-full flex-col items-center justify-center text-[var(--ds-faint)]">
              <div className="mb-4 text-4xl">⚖</div>
              <p className="text-[15px]">{t('legalResearchEmptyState')}</p>
              <p className="mt-1 text-[11px]">{t('legalResearchEmptyStateHint')}</p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              <div className="mb-5">
                <h3 className="text-[13px] font-medium text-[var(--ds-ink)]">{t('legalResearchQuestion')}</h3>
                <p className="mt-1 text-[15px] text-[var(--ds-ink)]">{activeRecord.query}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-[var(--ds-faint)]">{activeRecord.timestamp}</span>
                  {activeRecord.status === 'running' && (
                    <span className="text-[11px] text-[var(--ds-accent)]">{t('legalResearchInProgress')}</span>
                  )}
                </div>
              </div>

              {activeRecord.status === 'running' && (
                <div className="sticky top-0 z-10 mb-3 rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-card-strong)] px-4 py-3 shadow-sm backdrop-blur">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--ds-text-muted)]">
                    <span className="flex items-center gap-2 font-medium text-[var(--ds-ink)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--ds-accent)] animate-pulse" />
                      {t('legalResearchLiveStatus')}
                    </span>
                    <span>{t('legalResearchLastUpdate', { time: formatDuration(runningSince) })}</span>
                    <span className="text-[var(--ds-faint)]">
                      {lastRunningStep?.tool || t('legalResearchWaitingForUpdate')}
                    </span>
                  </div>
                </div>
              )}

              {activeRecord.steps.length > 0 && (
                <div className="mb-3 space-y-3">
                  {activeRecord.steps.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-sidebar)] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{step.icon}</span>
                        <span className="text-[13px] font-medium text-[var(--ds-ink)]">{step.tool}</span>
                        <span className="ml-auto text-[11px]">
                          {step.status === 'running' && (
                            <span className="text-[var(--ds-accent)]">{t('legalResearchStepRunning')}</span>
                          )}
                          {step.status === 'done' && (
                            <span className="text-green-500">{t('legalResearchStepDone')}</span>
                          )}
                          {step.status === 'error' && (
                            <span className="text-red-400">{t('legalResearchStepError')}</span>
                          )}
                        </span>
                      </div>
                      {step.output && (
                        <div className="mt-2 pl-8 text-[13px] leading-relaxed text-[var(--ds-ink)]">
                          {step.output}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeRecord.reasoning && (
                <div className="mb-3 rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-sidebar)] p-4">
                  <button
                    type="button"
                    onClick={() => setReasoningExpanded(!reasoningExpanded)}
                    className="flex w-full items-center gap-2 mb-2 text-left"
                  >
                    <span>🧠</span>
                    <span className="text-[13px] font-medium text-[var(--ds-ink)]">{t('legalResearchReasoning')}</span>
                    <span className="ml-auto text-[11px] text-[var(--ds-faint)]">
                      {reasoningExpanded ? t('legalResearchCollapse') : t('legalResearchExpand')}
                    </span>
                    {reasoningExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-[var(--ds-faint)]" strokeWidth={1.75} />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-[var(--ds-faint)]" strokeWidth={1.75} />
                    )}
                  </button>
                  
                  {!reasoningExpanded ? (
                    // Compressed view: show only key actions
                    <div className="pl-6 space-y-1">
                      {extractKeyActions(activeRecord.reasoning).map((action, i) => (
                        <div key={i} className="flex items-start gap-2 text-[12px] text-[var(--ds-ink)]">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ds-accent)]" />
                          <span className="leading-relaxed">{action}</span>
                        </div>
                      ))}
                      {extractKeyActions(activeRecord.reasoning).length === 0 && (
                        <p className="text-[12px] text-[var(--ds-faint)] italic">
                          {t('legalResearchReasoningProcessing')}
                        </p>
                      )}
                    </div>
                  ) : (
                    // Expanded view: full reasoning split into sentences
                    <div className="space-y-1.5">
                      {splitSentences(activeRecord.reasoning).map((sentence, i) => (
                        <p key={i} className="text-[13px] leading-relaxed text-[var(--ds-ink)]">{sentence}</p>
                      ))}
                      {!activeRecord.reasoning.trim() && (
                        <p className="text-[12px] text-[var(--ds-faint)] italic">
                          {t('legalResearchReasoningProcessing')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeRecord.summary && (
                <div className="rounded-[10px] border border-[var(--ds-border)] bg-[var(--ds-sidebar)] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span>📋</span>
                    <span className="text-[13px] font-medium text-[var(--ds-ink)]">
                      {t('legalResearchSummaryTitle')}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-[13px] leading-relaxed text-[var(--ds-ink)] [overflow-wrap:anywhere]">
                    <AssistantMarkdown text={preprocessSummary(activeRecord.summary)} streaming={false} />
                  </div>
                </div>
              )}

              {activeRecord.error && (
                <div className="mt-3 rounded-[10px] border border-red-400/30 bg-red-400/10 p-4">
                  <p className="text-[13px] text-red-400">{activeRecord.error}</p>
                </div>
              )}
              <div ref={bottomRef} aria-hidden="true" />
            </div>
          )}
        </div>
    </div>
  )
}
