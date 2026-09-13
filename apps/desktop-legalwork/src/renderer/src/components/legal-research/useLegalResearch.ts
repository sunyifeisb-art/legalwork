import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { resolveAgentTaskModel } from '../../agent/agent-task-model'
import { getProvider } from '../../agent/registry'
import { rendererRuntimeClient } from '../../agent/runtime-client'
import type { ChatBlock, ThreadDeltaEvent, ThreadEventSink, ToolEventPayload } from '../../agent/types'
import { useChatStore } from '../../store/chat-store'
import { applyLegalResearchSummaryEdit } from './legal-research-records'
import { buildImmediateResearchPlan } from './legal-research-plan'
import {
  bestAvailableLegalResearchText,
  splitLegalResearchMessage
} from './legal-research-message'

type ResearchStepStatus = 'pending' | 'running' | 'done' | 'error'

export interface ResearchStep {
  id: string
  tool: string
  icon: string
  status: ResearchStepStatus
  input: string
  output?: string
  detail?: string
  meta?: Record<string, unknown>
}

export interface ResearchUpdate {
  id: string
  text: string
  createdAt: string
  completed?: boolean
}

export interface ResearchRecord {
  id: string
  query: string
  timestamp: string
  updatedAt?: number
  status: 'running' | 'done' | 'error'
  blocks: ChatBlock[]
  steps: ResearchStep[]
  updates: ResearchUpdate[]
  summary: string
  editedSummary?: string
  reportRevision?: number
  reasoning: string
  planning?: string
  threadId: string
  turnId?: string
  error?: string
}

const STORAGE_KEY = 'legalwork.legal-research.records'
const RECORDS_PERSIST_DELAY_MS = 240

function mapToolStatus(status: ToolEventPayload['status']): ResearchStepStatus {
  if (status === 'success') return 'done'
  return status
}

function iconForTool(toolName?: string, summary?: string): string {
  const text = `${toolName ?? ''} ${summary ?? ''}`.toLowerCase()
  if (text.includes('search') || text.includes('搜索')) return 'search'
  if (text.includes('case') || text.includes('案例') || text.includes('判例')) return 'case'
  if (text.includes('paper') || text.includes('文献') || text.includes('cnki')) return 'literature'
  if (text.includes('regulation') || text.includes('law') || text.includes('法规') || text.includes('条文')) return 'regulation'
  if (text.includes('synthesis') || text.includes('summar') || text.includes('总结') || text.includes('综述')) return 'summary'
  if (text.includes('web') || text.includes('fetch') || text.includes('提取')) return 'web'
  return 'tool'
}

function loadRecords(): ResearchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ResearchRecord[]
    return Array.isArray(parsed)
      ? parsed.map((record) => ({
          ...record,
          blocks: record.blocks ?? [],
          steps: record.steps ?? [],
          updates: record.updates ?? []
        }))
      : []
  } catch {
    return []
  }
}

function saveRecords(records: ResearchRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export function useLegalResearch() {
  const { t } = useTranslation('common')
  const composerModel = useChatStore((state) => state.composerModel)
  const [records, setRecords] = useState<ResearchRecord[]>(loadRecords)
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null)
  const [isResearching, setIsResearching] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const recordsRef = useRef(records)
  const persistTimerRef = useRef<number | null>(null)

  const activeRecord = records.find((r) => r.id === activeRecordId) ?? null

  useEffect(() => {
    recordsRef.current = records
    if (persistTimerRef.current !== null) return
    persistTimerRef.current = window.setTimeout(() => {
      persistTimerRef.current = null
      saveRecords(recordsRef.current)
    }, RECORDS_PERSIST_DELAY_MS)
  }, [records])

  useEffect(() => () => {
    if (persistTimerRef.current !== null) {
      window.clearTimeout(persistTimerRef.current)
      persistTimerRef.current = null
    }
    saveRecords(recordsRef.current)
  }, [])

  const persist = useCallback((next: ResearchRecord[] | ((prev: ResearchRecord[]) => ResearchRecord[])) => {
    setRecords((prev) => typeof next === 'function' ? next(prev) : next)
  }, [])

  const buildResearchPrompt = useCallback(
    (query: string) =>
      t('legalResearchAgentPrompt', {
        query,
        defaultValue:
          '请对以下法律问题进行多源调研：「{{query}}」。\n\n【重要要求】\n1. 所有可见内容使用中文，并在本轮直接交付最佳可用报告。\n2. 可在内部简要规划，但不要把单独规划或阶段播报作为唯一输出，也不要等待全部检索完成后才开始组织报告。\n3. 由 Agent 根据具体问题自主决定是否调用工具、调用次数和检索路径，不要求机械地调用任何来源。北大法宝或元典可作为法规与案例主来源；任一主来源已有可用内容后，不再为链接装饰或重复核验扩张检索。\n4. 只有在主要法律数据库均实际失败/无结果、存在重大效力冲突，或用户明确指定网页核验时，才按需使用一个权威网页替代来源。\n5. 某个来源或工具失败时停止反复重试，直接基于现有材料继续；资料无法核验时如实标注，不得阻塞或吞掉报告。\n6. 报告建议以 Markdown 分级标题区分结论、法律依据、相关案例、分析与风险提示、来源；保留真实 URL，没有 URL 时按数据库名称、法规名称和案号标注，不得猜测。'
      }),
    [t]
  )

  const runResearch = useCallback(
    async (query: string) => {
      if (!query.trim() || isResearching) return

      const trimmedQuery = query.trim()
      const recordId = `research-${Date.now()}`

      abortRef.current?.abort()
      abortRef.current = new AbortController()
      const signal = abortRef.current.signal

      setIsResearching(true)

      let threadId = ''
      let turnId = ''
      let bestAvailableDuringResearch = (): string => ''

      // Publish a query-specific plan immediately, before thread creation or
      // any network/model round-trip. The runtime will replace this draft with
      // the model's streamed plan as soon as it arrives.
      const immediatePlanning = buildImmediateResearchPlan(trimmedQuery)
      const initialRecord: ResearchRecord = {
        id: recordId,
        query: trimmedQuery,
        timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
        updatedAt: Date.now(),
        status: 'running',
        blocks: [],
        steps: [],
        updates: [],
        summary: '',
        reasoning: '',
        planning: immediatePlanning,
        threadId
      }

      persist((prev) => [initialRecord, ...prev])
      setActiveRecordId(recordId)

      try {
        const provider = getProvider()
        const settings = await rendererRuntimeClient.getSettings()
        const researchModel = resolveAgentTaskModel(
          composerModel,
          settings.agents.legalwork.model
        )
        // Research runs in a dedicated internal workspace so its threads are
        // excluded from the home agent's code-thread list (isCodeThread) and
        // never surface in the main conversation view.
        const workspaceRoot = '~/.legalwork/research-workspace'

        const thread = await provider.createThread({
          workspace: workspaceRoot,
          title: `${t('legalResearch')}: ${trimmedQuery.slice(0, 60)}`,
          mode: 'agent',
          model: researchModel
        })
        threadId = thread.id
        persist((prev) => prev.map((record) =>
          record.id === recordId ? { ...record, threadId } : record
        ))

        const sendResult = await provider.sendUserMessage(threadId, buildResearchPrompt(trimmedQuery), {
          mode: 'agent',
          model: researchModel
        })
        turnId = sendResult.turnId

        persist((prev) =>
          prev.map((r) => (r.id === recordId ? { ...r, turnId } : r))
        )

        const assistantSegments = new Map<string, ResearchUpdate>()
        const assistantSegmentOrder: string[] = []
        let reasoningText = ''
        let capturePlanningReasoning = true
        // 调研规划可能以正文播报形式输出（“收到，开始多源调研。以下是调研规划：
        // 1. …2. …”），而 flushUpdates 会把这些规划消息从阶段播报里过滤掉，导致
        // 规划卡片永远空白。单独累积规划播报文本，供规划卡片从中提取编号列表。
        let planningText = immediatePlanning
        const toolSteps = new Map<string, ResearchStep>()
        const blockMap = new Map<string, ChatBlock>()

        function upsertBlock(block: ChatBlock): void {
          blockMap.set(block.id, block)
        }

        function flushBlocks(): ChatBlock[] {
          return [...blockMap.values()]
        }

        function flushUpdates(): ResearchUpdate[] {
          return assistantSegmentOrder
            .map((id) => assistantSegments.get(id))
            .filter((update): update is ResearchUpdate => Boolean(update?.text.trim()))
            .map((update) => ({
              ...update,
              text: splitLegalResearchMessage(update.text).update
            }))
            .filter((update) => Boolean(update.text.trim()))
        }

        function latestReportText(): string {
          for (let index = assistantSegmentOrder.length - 1; index >= 0; index -= 1) {
            const id = assistantSegmentOrder[index]
            const text = id ? assistantSegments.get(id)?.text ?? '' : ''
            const report = splitLegalResearchMessage(text).report
            if (report) return report
          }
          return ''
        }

        function bestAvailableResearchText(): string {
          return bestAvailableLegalResearchText(
            assistantSegmentOrder.map((id) => assistantSegments.get(id)?.text ?? ''),
            reasoningText
          )
        }
        bestAvailableDuringResearch = bestAvailableResearchText

        function completeAssistantUpdates(): void {
          for (const [id, update] of assistantSegments) {
            assistantSegments.set(id, { ...update, completed: true })
          }
        }

        // Batch the high-frequency delta updates (planning reasoning can
        // stream thousands of deltas) into at most one state commit per
        // animation frame. Otherwise every SSE flush forces a full record
        // rewrite (blocks array + reasoning reparse in the panel) and the
        // renderer starves, dropping subsequent SSE events — leaving the UI
        // stuck on "planning" long after the runtime finished the turn.
        let pendingRecordPatch: Partial<ResearchRecord> | null = null
        let recordFlushFrame = 0
        const flushRecord = (): void => {
          recordFlushFrame = 0
          const patch = pendingRecordPatch
          pendingRecordPatch = null
          if (!patch) return
          persist((prev) =>
            prev.map((r) =>
              r.id === recordId
                ? { ...r, ...patch, updatedAt: Date.now(), blocks: flushBlocks() }
                : r
            )
          )
        }
        const scheduleRecordUpdate = (next: Partial<ResearchRecord>): void => {
          pendingRecordPatch = { ...pendingRecordPatch, ...next }
          if (recordFlushFrame) return
          recordFlushFrame = window.requestAnimationFrame(flushRecord)
        }
        const commitRecordUpdate = (next: Partial<ResearchRecord>): void => {
          scheduleRecordUpdate(next)
          if (recordFlushFrame) {
            window.cancelAnimationFrame(recordFlushFrame)
            recordFlushFrame = 0
          }
          flushRecord()
        }

        let terminalEventReceived = false
        let surfacedError = ''
        const sink: ThreadEventSink = {
          onSeq: () => {},
          onDeltas: (deltas: ThreadDeltaEvent[]) => {
            let planningReasoningChanged = false
            for (const delta of deltas) {
              if (delta.kind === 'agent_message') {
                const segmentId = delta.itemId || 'assistant-current'
                const existing = assistantSegments.get(segmentId)
                if (!existing) {
                  completeAssistantUpdates()
                  assistantSegmentOrder.push(segmentId)
                }
                const segmentText = `${existing?.text ?? ''}${delta.text}`
                assistantSegments.set(segmentId, {
                  id: segmentId,
                  text: segmentText,
                  createdAt: existing?.createdAt ?? new Date().toISOString(),
                  completed: false
                })
                // 规划播报在流式过程中可能先不满足完整匹配，累积到完整后再判断。
                // 除了标准“调研规划”标题外，模型也可能直接输出带编号的可执行规划列表
                // 而无标题，此时依据提取到的规划项数量兜底识别，避免规划卡片空白。
                const parts = splitLegalResearchMessage(segmentText)
                if (parts.planning) planningText = parts.planning
                upsertBlock({
                  kind: 'assistant',
                  id: segmentId,
                  createdAt: assistantSegments.get(segmentId)?.createdAt,
                  text: assistantSegments.get(segmentId)?.text.trim() ?? ''
                })
              } else if (delta.kind === 'agent_reasoning' && capturePlanningReasoning) {
                reasoningText += delta.text
                planningReasoningChanged = true
              }
            }
            if (planningReasoningChanged && reasoningText.trim()) {
              upsertBlock({
                kind: 'reasoning',
                id: 'reasoning',
                createdAt: new Date().toISOString(),
                text: reasoningText.trim()
              })
            }
            scheduleRecordUpdate({
              updates: flushUpdates(),
              summary: latestReportText(),
              planning: planningText,
              ...(planningReasoningChanged ? { reasoning: reasoningText.trim() } : {})
            })
          },
          onUserMessage: (ev) => {
            upsertBlock({
              kind: 'user',
              id: ev.itemId || 'user',
              createdAt: ev.createdAt || new Date().toISOString(),
              text: ev.text,
              modelLabel: ev.modelLabel
            })
            scheduleRecordUpdate({})
          },
          onTool: (ev: ToolEventPayload) => {
            capturePlanningReasoning = false
            completeAssistantUpdates()
            const existing = toolSteps.get(ev.itemId)
            const isError = ev.status === 'error'
            
            if (!existing) {
              const step: ResearchStep = {
                id: ev.itemId,
                tool: ev.summary || t('legalResearchToolUnknown'),
                icon: isError ? 'error' : iconForTool(ev.meta?.toolName as string | undefined, ev.summary),
                status: isError ? 'error' : mapToolStatus(ev.status),
                input: trimmedQuery,
                output: isError ? `调用失败：${ev.detail || '未知错误'}，将尝试其他方法...` : ev.detail,
                detail: ev.detail,
                meta: ev.meta
              }
              toolSteps.set(ev.itemId, step)
            } else {
              const updated: ResearchStep = {
                ...existing,
                status: isError ? 'error' : mapToolStatus(ev.status),
                output: isError ? `调用失败：${ev.detail || '未知错误'}，将尝试其他方法...` : ev.detail,
                detail: ev.detail,
                meta: ev.meta
              }
              toolSteps.set(ev.itemId, updated)
            }
            upsertBlock({
              kind: 'tool',
              id: ev.itemId,
              createdAt: new Date().toISOString(),
              summary: ev.summary || t('legalResearchToolUnknown'),
              status: ev.status,
              toolKind: ev.toolKind,
              detail: ev.detail,
              filePath: ev.filePath,
              meta: ev.meta
            })
            scheduleRecordUpdate({
              steps: [...toolSteps.values()],
              updates: flushUpdates()
            })
          },
          onCompaction: () => {},
          onApproval: () => {},
          onUserInput: () => {},
          onUserInputStatus: () => {},
          onGoal: () => {},
          onTurnComplete: () => {
            terminalEventReceived = true
            completeAssistantUpdates()
            const finalReport = bestAvailableResearchText()
            if (!finalReport) {
              commitRecordUpdate({
                status: 'error',
                updates: flushUpdates(),
                summary: '',
                planning: planningText,
                error: t('legalResearchIncompleteReport', {
                  defaultValue: '调研已结束，但没有收到可展示内容。'
                })
              })
              setIsResearching(false)
              return
            }
            commitRecordUpdate({
              status: 'done',
              updates: flushUpdates(),
              summary: finalReport,
              planning: planningText,
              error: undefined // 清除之前的错误
            })
            setIsResearching(false)
          },
          onError: (err: Error) => {
            terminalEventReceived = true
            completeAssistantUpdates()
            const rawMessage = err.message?.trim() || ''
            // 保留首个具体错误，避免后续兜底/空消息覆盖真实失败原因
            if (!surfacedError && rawMessage && !/legalwork turn failed/i.test(rawMessage)) {
              surfacedError = rawMessage
            }
            const partial = bestAvailableResearchText()
            commitRecordUpdate({
              status: partial ? 'done' : 'error',
              error: partial
                ? undefined
                : surfacedError
                  ? `${t('legalResearchTurnFailed')}${surfacedError}`
                  : t('legalResearchTurnFailed'),
              updates: flushUpdates(),
              summary: partial,
              planning: planningText
            })
            setIsResearching(false)
          }
        }

        await provider.subscribeThreadEvents(threadId, 0, sink, signal)
        // The runtime SSE stream is a long-lived connection that only closes
        // when the client stops it, so subscribeThreadEvents returns when the
        // stream ends (end/error/abort) rather than when the turn completes.
        // If the turn is actually done but we never saw the terminal event —
        // e.g. events were dropped while the renderer was saturated by the
        // planning-reasoning delta burst — reconcile from the persisted thread
        // so the finished stages and report surface instead of hanging forever
        // on "waiting for next update".
        if (!signal.aborted && !terminalEventReceived) {
          try {
            const detail = await provider.getThreadDetail(threadId)
            if (detail?.latestTurnId && detail.threadStatus !== 'running') {
              const recovered: ResearchUpdate[] = []
              let recoveredPlanning = planningText
              const recoveredAssistantTexts: string[] = []
              for (const block of detail.blocks ?? []) {
                if (
                  block.kind === 'assistant' &&
                  typeof block.text === 'string' &&
                  block.text.trim()
                  ) {
                  recoveredAssistantTexts.push(block.text)
                  const parts = splitLegalResearchMessage(block.text)
                  if (parts.planning) recoveredPlanning = parts.planning
                  if (parts.update) {
                    recovered.push({
                      id: block.id,
                      text: parts.update,
                      createdAt: block.createdAt ?? new Date().toISOString(),
                      completed: true
                    })
                  }
                }
              }
              const recoveredReasoning = detail.blocks
                ?.filter((b) => b.kind === 'reasoning')
                .map((b) => (typeof b.text === 'string' ? b.text : ''))
                .join('\n')
                .trim()
              const recoveredBest = bestAvailableLegalResearchText(
                recoveredAssistantTexts,
                recoveredReasoning
              )
              if (recovered.length > 0 || recoveredReasoning || recoveredBest) {
                assistantSegmentOrder.length = 0
                assistantSegments.clear()
                for (const update of recovered) {
                  assistantSegments.set(update.id, update)
                  assistantSegmentOrder.push(update.id)
                }
                if (recoveredReasoning) {
                  reasoningText = recoveredReasoning
                  upsertBlock({ kind: 'reasoning', id: 'reasoning', createdAt: new Date().toISOString(), text: recoveredReasoning })
                }
                commitRecordUpdate({
                  status: recoveredBest ? 'done' : 'error',
                  updates: flushUpdates(),
                  summary: recoveredBest,
                  planning: recoveredPlanning || planningText,
                  ...(recoveredReasoning ? { reasoning: recoveredReasoning } : {}),
                  error: recoveredBest ? undefined : t('legalResearchIncompleteReport', {
                    defaultValue: '调研已结束，但没有收到可展示内容。'
                  })
                })
                setIsResearching(false)
                return
              }
            }
          } catch {
            // Reconcile is best-effort; fall through to the error state below.
          }
          const partial = bestAvailableResearchText()
          commitRecordUpdate({
            status: partial ? 'done' : 'error',
            error: partial ? undefined : t('legalResearchStreamEnded'),
            updates: flushUpdates(),
            summary: partial
          })
          setIsResearching(false)
        }
        // Abort path (user stopped): the last throttled deltas may still sit in
        // a pending rAF. Commit them so the record keeps its final text even if
        // the component unmounts before the animation frame fires. stopResearch
        // already set status=error; do not overwrite it here.
        if (signal.aborted && !terminalEventReceived) {
          commitRecordUpdate({})
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err ?? 'unknown error')
        const partial = bestAvailableDuringResearch()
        persist((prev) => {
          const existing = prev.find((r) => r.id === recordId)
          if (existing) {
            return prev.map((r) => (r.id === recordId
              ? {
                  ...r,
                  status: partial ? 'done' : 'error',
                  updatedAt: Date.now(),
                  summary: partial || r.summary,
                  error: partial ? undefined : `调研启动失败：${message}`
                }
              : r))
          }
          return [
            {
              id: recordId,
              query: trimmedQuery,
              timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
              updatedAt: Date.now(),
              status: 'error',
              blocks: [],
              steps: [],
              updates: [],
              summary: '',
              reasoning: '',
              threadId,
              turnId,
              error: `初始化遇到问题：${message}`
            },
            ...prev
          ]
        })
        setActiveRecordId(recordId)
        setIsResearching(false)
      }
    },
    [isResearching, t, buildResearchPrompt, composerModel, persist]
  )

  const stopResearch = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsResearching(false)
    persist((prev) =>
      prev.map((r) =>
        r.id === activeRecordId && r.status === 'running' ? { ...r, status: 'error', updatedAt: Date.now(), error: t('legalResearchStopped') } : r
      )
    )
  }, [activeRecordId, t, persist])

  const deleteRecord = useCallback(
    (id: string) => {
      persist((prev) => prev.filter((r) => r.id !== id))
      if (activeRecordId === id) setActiveRecordId(null)
    },
    [activeRecordId, persist]
  )

  const clearHistory = useCallback(() => {
    if (window.confirm(t('legalResearchClearConfirm'))) {
      persist([])
      setActiveRecordId(null)
    }
  }, [t, persist])

  const saveEditedSummary = useCallback(
    (id: string, editedSummary: string) => {
      persist((prev) => applyLegalResearchSummaryEdit(prev, id, editedSummary))
    },
    [persist]
  )

  return {
    records,
    activeRecord,
    activeRecordId,
    setActiveRecordId,
    isResearching,
    runResearch,
    stopResearch,
    saveEditedSummary,
    deleteRecord,
    clearHistory
  }
}

export type ReturnUseLegalResearch = ReturnType<typeof useLegalResearch>
