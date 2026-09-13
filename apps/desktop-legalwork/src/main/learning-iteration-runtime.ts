import { createHash, randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import {
  cp,
  mkdir,
  readFile,
  realpath,
  readdir,
  rename,
  rm,
  stat,
  writeFile
} from 'node:fs/promises'
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import {
  containsSecret,
  containsSensitiveIdentifier
} from '../../legalwork/src/memory/memory-policy.js'
import { atomicWriteFile } from '../../legalwork/src/adapters/file/atomic-write.js'
import type { AppSettingsV1 } from '../shared/app-settings'
import { getLegalworkRuntimeSettings } from '../shared/app-settings'
import type {
  LearningIterationActionResult,
  LearningIterationCounts,
  LearningIterationDetailResult,
  LearningIterationListResult,
  LearningIterationRecordSummary,
  LearningIterationUserReport,
  LearningIterationRuntimeStatus
} from '../shared/ds-gui-api'
import type { JsonSettingsStore } from './settings-store'
import { resolveLegalworkDataDir } from './legalwork-process'
import { extractDocumentMaterial } from './services/document-material-service'
import {
  latestAssistantText,
  parseJsonObject,
  runtimeErrorMessage,
  sleep,
  type RuntimeRequestFn,
  type RuntimeRequestResult,
  type ThreadDetailJson
} from './schedule-runtime-helpers'
import {
  listGuiSkills,
  readGuiSkillFile,
  USER_INSTALLED_SKILL_ROOT
} from './services/skill-service'

const POLL_INTERVAL_MS = 5 * 60_000
const TURN_TIMEOUT_MS = 4 * 60 * 60_000
const MAX_MODEL_RESULT_ATTEMPTS = 2
const MAX_SOURCE_CHARS = 120_000
const MAX_THREADS = 40
const MAX_KNOWLEDGE_FILES = 12
const MAX_THREAD_FILES = 16
const MAX_MEMORY_AND_SKILLS = 60
const MAX_SINGLE_SOURCE_CHARS = 20_000
const MAX_USER_MESSAGE_CHARS = 6_000
const MAX_REPORT_MARKDOWN_CHARS = 8_000
const MAX_MEMORY_PROPOSALS = 20
const MAX_SKILL_PROPOSALS = 5
const MAX_KNOWLEDGE_NOTE_PROPOSALS = 8
const MAX_REJECTED_PROPOSALS = 30
const MAX_LEARNING_NOTE_CHARS = 30_000
const MAX_LOCAL_FILE_BYTES = 25 * 1024 * 1024
const LEARNING_EXTRACTABLE_EXTENSIONS = new Set(['.pdf', '.docx', '.doc'])
const LEARNING_THREAD_TITLE_PREFIX = '[Learning iteration]'
const LEARNING_KNOWLEDGE_ROOT = '学习沉淀'
const LEARNING_KNOWLEDGE_MARKER = '<!-- legalwork-learning-artifact -->'
const RESULT_BEGIN = 'BEGIN_LEARNING_RESULT'
const RESULT_END = 'END_LEARNING_RESULT'
const AUTOMATIC_MEMORY_CATEGORIES = new Set([
  'profile',
  'preference',
  'workflow',
  'project'
])
const EMPTY_COUNTS: LearningIterationCounts = {
  sources: 0,
  threads: 0,
  knowledgeFiles: 0,
  uploadedFiles: 0,
  generatedFiles: 0,
  memoriesCreated: 0,
  memoriesUpdated: 0,
  memoriesDisabled: 0,
  skillsCreated: 0,
  skillsUpdated: 0,
  knowledgeNotesCreated: 0,
  knowledgeNotesUpdated: 0,
  rejected: 0
}

export function isRecoverableLearningRuntimeError(error: unknown): boolean {
  const message = errorMessage(error)
  return /(?:fetch failed|Runtime restarted before this turn completed|ECONNRESET|ECONNREFUSED|socket hang up|network (?:error|failure|failed)|connection (?:reset|refused)|aborted due to timeout|timed? ?out)/i.test(message)
}

export function shouldReportLearningIterationError(error: unknown): boolean {
  const message = errorMessage(error)
  return !(
    /(?:insufficient balance|余额不足|配额.*耗尽|HTTP\s*402)/i.test(message) ||
    /configure a model API key|sign in to ChatGPT/i.test(message) ||
    /memory confidence must be at least/i.test(message) ||
    /学习结果不是有效 JSON|not valid JSON|Unexpected token|Unexpected non-whitespace character after JSON/i.test(message) ||
    isRecoverableLearningRuntimeError(error)
  )
}

type SourceKind =
  | 'thread'
  | 'memory'
  | 'knowledge'
  | 'skill'
  | 'uploaded-file'
  | 'generated-file'
  | 'process'

const SOURCE_CHAR_RESERVES: Record<SourceKind, number> = {
  thread: 45_000,
  memory: 8_000,
  knowledge: 24_000,
  skill: 8_000,
  'uploaded-file': 16_000,
  'generated-file': 16_000,
  process: 8_000
}

type LearningSource = {
  key: string
  kind: SourceKind
  title: string
  fingerprint: string
  content: string
  metadata?: Record<string, unknown>
}

type LearningState = {
  version: 1
  sourceHashes: Record<string, string>
  lastSuccessfulAt: string
  lastCheckedAt: string
  lastLocalDay: string
  lastRetryAt: string
  retryCount: number
  baselineComplete: boolean
  baselineProcessed: number
  baselineRemaining: number
  pendingRunId: string
}

type EvidenceRef = {
  sourceKey: string
  note?: string
}

type MemoryProposal = {
  action: 'create' | 'update' | 'disable'
  id?: string
  content?: string
  scope?: 'user' | 'workspace' | 'project'
  category?: 'profile' | 'preference' | 'workflow' | 'project' | 'interest' | 'matter' | 'other'
  recallPolicy?: 'always' | 'relevant'
  tags?: string[]
  confidence?: number
  explicitCorrection?: boolean
  evidence?: EvidenceRef[]
}

type SkillProposal = {
  action: 'create' | 'update'
  id: string
  name: string
  description: string
  skillMarkdown: string
  tests: Array<{
    prompt: string
    expected: 'should-trigger' | 'should-not-trigger' | 'ambiguous' | 'sibling-confusion'
    reason?: string
    passed?: boolean
  }>
  evidence?: EvidenceRef[]
}

type KnowledgeNoteProposal = {
  action: 'create' | 'update'
  path: string
  title: string
  summary: string
  content: string
  evidence?: EvidenceRef[]
}

type LearningModelResult = {
  title: string
  summary: string
  reportMarkdown: string
  memories: MemoryProposal[]
  skills: SkillProposal[]
  knowledgeNotes: KnowledgeNoteProposal[]
  rejected: Array<{ title: string; reason: string }>
}

type MemorySnapshot = {
  id: string
  content: string
  scope: 'user' | 'workspace' | 'project'
  category?: string
  recallPolicy?: string
  tags?: string[]
  confidence?: number
  origin?: string
  sourceIterationId?: string
  evidence?: EvidenceRef[]
  disabledAt?: string
  deletedAt?: string
  updatedAt?: string
}

type RollbackMemoryOperation = {
  action: 'delete-created' | 'restore'
  id: string
  before?: MemorySnapshot
  afterHash: string
}

type RollbackSkillOperation = {
  action: 'delete-created' | 'restore'
  id: string
  targetPath: string
  backupPath?: string
  afterHash: string
}

type RollbackKnowledgeOperation = {
  action: 'delete-created' | 'restore'
  path: string
  beforeContent?: string
  afterHash: string
}

type LearningManifest = {
  version: 1
  summary: LearningIterationRecordSummary
  sourceHashes: Record<string, string>
  rollback: {
    memories: RollbackMemoryOperation[]
    skills: RollbackSkillOperation[]
    knowledge: RollbackKnowledgeOperation[]
  }
  modelResult?: LearningModelResult
}

type RuntimeDeps = {
  store: JsonSettingsStore
  runtimeRequest: RuntimeRequestFn
  getSystemIdleSeconds: () => number
  getExternalBusy: () => Promise<boolean>
  logError: (category: string, message: string, detail?: unknown) => void
  now?: () => Date
}

type ThreadSummaryJson = {
  id: string
  title?: string
  updatedAt?: string
  status?: string
  relation?: string
}

type KnowledgeNodeJson = {
  name?: string
  path?: string
  kind?: string
  extension?: string
  sizeBytes?: number
  updatedAt?: string
  children?: KnowledgeNodeJson[]
}

class LearningPausedError extends Error {
  constructor() {
    super('检测到新的用户活动，学习迭代已暂停。')
    this.name = 'LearningPausedError'
  }
}

class LearningCancelledError extends Error {
  constructor() {
    super('学习迭代已取消。')
    this.name = 'LearningCancelledError'
  }
}

export class LearningIterationRuntime {
  private timer: ReturnType<typeof setInterval> | null = null
  private queued = false
  private running = false
  private cancelRequested = false
  private manualQueue = false
  private forceRun = false
  private activeRunId = ''
  private activeRunStartedAt = ''
  private activeLearningThreadId = ''
  private activeSourceCounts: LearningIterationCounts = { ...EMPTY_COUNTS }
  private message = ''
  private lastPendingSourceCount = 0

  constructor(private readonly deps: RuntimeDeps) {}

  sync(settings: AppSettingsV1): void {
    if (!this.timer) {
      this.timer = setInterval(() => {
        void this.tick()
      }, POLL_INTERVAL_MS)
      this.timer.unref?.()
    }
    if (!settings.learningIteration.enabled) {
      this.queued = false
      this.cancelRequested = true
      this.message = '学习迭代已关闭'
      return
    }
    if (!this.running && !this.message) this.message = '正在监听新的交互数据'
    void this.tick()
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    this.cancelRequested = true
    this.queued = false
  }

  async status(): Promise<LearningIterationRuntimeStatus> {
    const settings = await this.deps.store.load()
    const state = await this.readState(settings)
    const records = await this.readRecordSummaries(settings)
    const latest = records[0]
    const enabled = settings.learningIteration.enabled
    const eligibleToday = state.lastLocalDay !== localDay(this.now())
    const nextEligibleAt = state.lastSuccessfulAt
      ? eligibleToday
        ? this.now().toISOString()
        : nextLocalDayStart(this.now()).toISOString()
      : ''
    return {
      status: !enabled
        ? 'disabled'
        : this.running
          ? 'running'
          : this.queued
            ? 'waiting'
            : latest?.status === 'failed'
              ? 'failed'
              : latest?.status === 'completed'
                ? 'completed'
                : 'idle',
      enabled,
      eligibleToday,
      queued: this.queued,
      running: this.running,
      message: this.message || (enabled ? '正在监听新的交互数据' : '学习迭代已关闭'),
      lastSuccessfulAt: state.lastSuccessfulAt,
      lastCheckedAt: state.lastCheckedAt,
      nextEligibleAt,
      baselineComplete: state.baselineComplete,
      baselineProgress: state.baselineComplete
        ? 1
        : state.baselineProcessed / Math.max(1, state.baselineProcessed + state.baselineRemaining),
      pendingSourceCount: this.lastPendingSourceCount,
      ...(this.activeRunId ? { activeRunId: this.activeRunId } : {}),
      ...(latest ? { latest } : {})
    }
  }

  async list(): Promise<LearningIterationListResult> {
    try {
      const settings = await this.deps.store.load()
      return { ok: true, records: await this.readRecordSummaries(settings) }
    } catch (error) {
      return { ok: false, message: errorMessage(error) }
    }
  }

  async get(id: string): Promise<LearningIterationDetailResult> {
    try {
      const settings = await this.deps.store.load()
      const runDir = this.runDir(settings, validateRunId(id))
      const manifest = await this.readManifest(runDir)
      const reportMarkdown = await readFile(join(runDir, 'REPORT.md'), 'utf8')
      return {
        ok: true,
        detail: {
          summary: manifest.summary,
          reportMarkdown,
          userReport: buildUserReport(manifest.modelResult, manifest.summary)
        }
      }
    } catch (error) {
      return { ok: false, message: errorMessage(error) }
    }
  }

  async queue(): Promise<LearningIterationActionResult> {
    const settings = await this.deps.store.load()
    if (!settings.learningIteration.enabled) {
      return { ok: false, message: '请先在设置中开启学习迭代。' }
    }
    if (this.running || this.queued) {
      return { ok: true, message: this.running ? '学习迭代正在运行。' : '已在等待空闲时段。' }
    }
    this.queued = true
    this.cancelRequested = false
    this.manualQueue = true
    this.forceRun = true
    this.message = '正在准备学习'
    void this.tick()
    return { ok: true, message: this.message }
  }

  async cancel(): Promise<LearningIterationActionResult> {
    if (!this.running && !this.queued) {
      return { ok: true, message: '当前没有等待或运行中的学习迭代。' }
    }
    this.cancelRequested = true
    this.queued = false
    this.manualQueue = false
    this.message = this.running ? '将在当前阶段结束后停止' : '已取消等待'
    return { ok: true, message: this.message }
  }

  async rollback(id: string): Promise<LearningIterationActionResult> {
    try {
      if (this.running) return { ok: false, message: '学习迭代运行时不能回滚。' }
      const settings = await this.deps.store.load()
      const runDir = this.runDir(settings, validateRunId(id))
      const manifest = await this.readManifest(runDir)
      if (!manifest.summary.canRollback) {
        return { ok: false, message: '该记录不可回滚或已经回滚。' }
      }

      const currentMemories = await this.fetchMemories(settings)
      const memoryById = new Map(currentMemories.map((item) => [item.id, item]))
      for (const operation of manifest.rollback.memories) {
        const current = memoryById.get(operation.id)
        if (!current || hashJson(memoryComparable(current)) !== operation.afterHash) {
          return { ok: false, message: `记忆 ${operation.id} 已在后续发生变化，回滚已停止。` }
        }
      }
      for (const operation of manifest.rollback.skills) {
        if (!existsSync(operation.targetPath) || await hashDirectory(operation.targetPath) !== operation.afterHash) {
          return { ok: false, message: `Skill ${operation.id} 已在后续发生变化，回滚已停止。` }
        }
      }
      for (const operation of manifest.rollback.knowledge) {
        const current = await this.readKnowledgeFileOptional(settings, operation.path)
        if (current === null || hashText(current) !== operation.afterHash) {
          return { ok: false, message: `知识库文件 ${operation.path} 已在后续发生变化，回滚已停止。` }
        }
      }

      for (const operation of [...manifest.rollback.knowledge].reverse()) {
        if (operation.action === 'delete-created') {
          await this.request(settings, `/v1/knowledge/file?path=${encodeURIComponent(operation.path)}`, 'DELETE')
        } else if (operation.beforeContent !== undefined) {
          await this.request(settings, '/v1/knowledge/file', 'POST', JSON.stringify({
            path: operation.path,
            content: operation.beforeContent,
            encoding: 'utf8'
          }))
        }
      }
      for (const operation of [...manifest.rollback.skills].reverse()) {
        await rm(operation.targetPath, { recursive: true, force: true })
        if (operation.action === 'restore' && operation.backupPath) {
          await cp(operation.backupPath, operation.targetPath, { recursive: true })
        }
      }
      for (const operation of [...manifest.rollback.memories].reverse()) {
        if (operation.action === 'delete-created') {
          await this.request(settings, `/v1/memory/${encodeURIComponent(operation.id)}`, 'DELETE')
        } else if (operation.before) {
          await this.request(
            settings,
            `/v1/memory/${encodeURIComponent(operation.id)}`,
            'PATCH',
            JSON.stringify(memoryRestorePatch(operation.before))
          )
        }
      }
      if (manifest.rollback.knowledge.length > 0) {
        await this.request(settings, '/v1/knowledge/sync', 'POST', '{}')
      }

      const rolledBackAt = this.now().toISOString()
      manifest.summary = {
        ...manifest.summary,
        status: 'rolled_back',
        canRollback: false,
        rolledBackAt
      }
      await this.writeManifest(runDir, manifest)
      const report = await readFile(join(runDir, 'REPORT.md'), 'utf8')
      await writeFile(
        join(runDir, 'REPORT.md'),
        `${report.trimEnd()}\n\n## 回滚\n\n已于 ${formatDateTime(rolledBackAt)} 完成整轮回滚。\n`,
        'utf8'
      )
      return { ok: true, message: '学习迭代已回滚。', record: manifest.summary }
    } catch (error) {
      return { ok: false, message: errorMessage(error) }
    }
  }

  private async tick(): Promise<void> {
    if (this.running) return
    const settings = await this.deps.store.load()
    if (!settings.learningIteration.enabled) {
      this.forceRun = false
      this.manualQueue = false
      return
    }
    const state = await this.readState(settings)
    const today = localDay(this.now())
    const automaticEligible = state.lastLocalDay !== today
    if (!automaticEligible) {
      if (this.queued) {
        this.queued = false
        this.message = '今日已有成功记录，请在下一个自然日再检查'
      }
      // Clear any pending manual run so it cannot leak into the next day and
      // bypass the isBusy gate on the first automatic tick.
      this.forceRun = false
      this.manualQueue = false
      return
    }
    if (!this.forceRun && state.lastRetryAt && !retryIsDue(state, this.now())) {
      return
    }
    // A manual "learn now" request is explicit user intent and must start even
    // when the app, compliance runtime, or another thread is currently busy.
    // Automatic background iterations still wait for the configured idle window.
    if (!this.forceRun && await this.isBusy(settings)) {
      if (this.queued) this.message = '正在等待所有任务结束并达到空闲条件'
      return
    }
    this.manualQueue = false

    this.running = true
    this.queued = false
    this.cancelRequested = false
    this.message = '正在采集新增交互数据'
    try {
      await this.run(settings, state)
    } catch (error) {
      if (isRecoverableLearningRuntimeError(error)) {
        await this.writeState(settings, {
          ...state,
          lastCheckedAt: this.now().toISOString(),
          pendingRunId: this.activeRunId || state.pendingRunId
        })
        this.queued = true
        this.message = '运行时连接暂时中断，已保留本轮并等待恢复'
        return
      }
      if (error instanceof LearningPausedError) {
        await this.writeState(settings, {
          ...state,
          lastCheckedAt: this.now().toISOString(),
          pendingRunId: this.activeRunId || state.pendingRunId
        })
        this.queued = true
        this.message = '检测到新的任务，已暂停并等待下一段空闲时间'
        return
      }
      if (error instanceof LearningCancelledError) {
        await this.writeState(settings, {
          ...state,
          lastCheckedAt: this.now().toISOString(),
          pendingRunId: ''
        })
        this.message = '学习迭代已取消'
        return
      }
      const failedAt = this.now().toISOString()
      const nextState: LearningState = {
        ...state,
        lastCheckedAt: failedAt,
        lastRetryAt: failedAt,
        retryCount: Math.min(2, state.retryCount + 1),
        pendingRunId: ''
      }
      await this.writeState(settings, nextState)
      await this.writeFailureRecord(settings, error).catch((recordError) => {
        this.deps.logError('learning-iteration', 'Failed to write learning failure report', {
          message: errorMessage(recordError)
        })
      })
      this.message = `学习迭代失败：${errorMessage(error)}`
      if (shouldReportLearningIterationError(error)) {
        this.deps.logError('learning-iteration', `Learning iteration failed: ${errorMessage(error)}`, {
          runId: this.activeRunId
        })
      }
    } finally {
      this.running = false
      this.forceRun = false
      this.activeRunId = ''
      this.activeRunStartedAt = ''
      this.activeLearningThreadId = ''
      this.activeSourceCounts = { ...EMPTY_COUNTS }
    }
  }

  private async run(settings: AppSettingsV1, state: LearningState): Promise<void> {
    const inventory = await this.collectSources(settings, state)
    this.lastPendingSourceCount = inventory.pendingCount
    const checkedAt = this.now().toISOString()
    if (inventory.sources.length === 0) {
      await this.writeState(settings, {
        ...state,
        lastCheckedAt: checkedAt,
        baselineComplete: inventory.pendingCount === 0,
        baselineRemaining: inventory.pendingCount,
        pendingRunId: ''
      })
      this.message = '本周期没有可学习的新数据'
      return
    }
    if (this.cancelRequested) {
      throw new LearningCancelledError()
    }

    const runId = state.pendingRunId || buildRunId(this.now())
    this.activeRunId = runId
    const runDir = this.runDir(settings, runId)
    await mkdir(join(runDir, 'rollback', 'skills'), { recursive: true })
    const startedAt = this.now().toISOString()
    this.activeRunStartedAt = startedAt
    this.activeSourceCounts = {
      ...EMPTY_COUNTS,
      sources: inventory.sources.length,
      threads: inventory.sources.filter((source) => source.kind === 'thread').length,
      knowledgeFiles: inventory.sources.filter((source) => source.kind === 'knowledge').length,
      uploadedFiles: inventory.sources.filter((source) => source.kind === 'uploaded-file').length,
      generatedFiles: inventory.sources.filter((source) => source.kind === 'generated-file').length
    }
    this.message = '正在理解、验证并构造候选记忆与 Skill'
    const corpus = renderCorpus(inventory.sources)
    await writeFile(join(runDir, 'INPUT.md'), corpus, 'utf8')
    await this.writeState(settings, {
      ...state,
      lastCheckedAt: startedAt,
      pendingRunId: runId
    })
    const result = await this.analyzeWithLegalwork(settings, runDir, corpus)
    if (this.cancelRequested) {
      throw new LearningCancelledError()
    }

    this.message = '正在验证并发布学习结果'
    const sourceByKey = new Map(inventory.sources.map((source) => [source.key, source]))
    const validated = validateModelResult(
      result,
      sourceByKey,
      new Map(inventory.memories.map((memory) => [memory.id, memory]))
    )
    const protectedSkillCandidates = validated.result.skills.filter((proposal) =>
      inventory.protectedSkillIds.includes(proposal.id)
    )
    if (protectedSkillCandidates.length > 0) {
      validated.result.skills = validated.result.skills.filter((proposal) =>
        !inventory.protectedSkillIds.includes(proposal.id)
      )
      validated.rejectedCount += protectedSkillCandidates.length
      validated.rejectionReasons.push(
        ...protectedSkillCandidates.map((proposal) =>
          `Skill 候选“${proposal.name || proposal.id}”与内置或项目级 Skill 重名，后台不会覆盖。`
        )
      )
    }
    const counts: LearningIterationCounts = {
      ...EMPTY_COUNTS,
      sources: inventory.sources.length,
      threads: inventory.sources.filter((source) => source.kind === 'thread').length,
      knowledgeFiles: inventory.sources.filter((source) => source.kind === 'knowledge').length,
      uploadedFiles: inventory.sources.filter((source) => source.kind === 'uploaded-file').length,
      generatedFiles: inventory.sources.filter((source) => source.kind === 'generated-file').length,
      rejected: result.rejected.length + validated.rejectedCount
    }
    const rollback = await this.applyResult(settings, runDir, validated.result, inventory, counts)
    const finishedAt = this.now().toISOString()
    const title = normalizeTitle(result.title)
    const summary: LearningIterationRecordSummary = {
      id: runId,
      title,
      displayName: `${localDay(this.now())} · ${title}`,
      status: 'completed',
      startedAt,
      finishedAt,
      reportPath: join(runDir, 'REPORT.md'),
      canRollback:
        rollback.memories.length > 0 ||
        rollback.skills.length > 0 ||
        rollback.knowledge.length > 0,
      counts
    }
    const reportMarkdown = buildReport(validated.result, summary, inventory.sources, validated.rejectionReasons)
    await writeFile(join(runDir, 'REPORT.md'), reportMarkdown, 'utf8')
    const manifest: LearningManifest = {
      version: 1,
      summary,
      sourceHashes: inventory.processedHashes,
      rollback,
      modelResult: validated.result
    }
    await this.writeManifest(runDir, manifest)
    await this.writeState(settings, {
      version: 1,
      sourceHashes: {
        ...state.sourceHashes,
        ...manifest.sourceHashes
      },
      lastSuccessfulAt: finishedAt,
      lastCheckedAt: finishedAt,
      lastLocalDay: localDay(this.now()),
      lastRetryAt: '',
      retryCount: 0,
      baselineComplete: inventory.pendingCount <= inventory.sources.length,
      baselineProcessed: state.baselineProcessed + inventory.sources.length,
      baselineRemaining: Math.max(0, inventory.pendingCount - inventory.sources.length),
      pendingRunId: ''
    })
    this.lastPendingSourceCount = Math.max(0, inventory.pendingCount - inventory.sources.length)
    this.message = '学习迭代已完成并自动应用'
  }

  private async isBusy(settings: AppSettingsV1): Promise<boolean> {
    if (this.deps.getSystemIdleSeconds() < settings.learningIteration.idleMinutes * 60) return true
    if (await this.deps.getExternalBusy()) return true
    const complianceResponse = await this.deps.runtimeRequest(
      settings,
      '/data-compliance/tasks',
      { method: 'GET' }
    )
    if (complianceResponse.ok) {
      const compliance = parseJsonObject(complianceResponse.body)
      const tasks = Array.isArray(compliance?.items)
        ? compliance.items as Array<{ status?: string }>
        : []
      if (tasks.some((task) => task.status === 'pending' || task.status === 'running')) return true
    }
    const response = await this.deps.runtimeRequest(
      settings,
      '/v1/threads?include=side&include_archived=true&limit=500',
      { method: 'GET' }
    )
    if (!response.ok) return true
    const parsed = parseJsonObject(response.body)
    const threads = Array.isArray(parsed?.threads) ? parsed.threads as ThreadSummaryJson[] : []
    return threads.some((thread) =>
      thread.status === 'running' &&
      thread.id !== this.activeLearningThreadId &&
      !String(thread.title ?? '').startsWith(LEARNING_THREAD_TITLE_PREFIX)
    )
  }

  private async collectSources(
    settings: AppSettingsV1,
    state: LearningState
  ): Promise<{
    sources: LearningSource[]
    pendingCount: number
    memories: MemorySnapshot[]
    processedHashes: Record<string, string>
    protectedSkillIds: string[]
  }> {
    const candidates: LearningSource[] = []
    const threadResponse = await this.request(
      settings,
      '/v1/threads?include=side&include_archived=true&limit=500',
      'GET'
    )
    const threadObject = parseJsonObject(threadResponse.body)
    const threads = Array.isArray(threadObject?.threads)
      ? (threadObject.threads as ThreadSummaryJson[])
      : []
    const selectedThreads = threads
      .filter((thread) => thread.id && !String(thread.title ?? '').startsWith(LEARNING_THREAD_TITLE_PREFIX))
      .filter((thread) => state.sourceHashes[`thread-meta:${thread.id}`] !== hashJson({
        updatedAt: thread.updatedAt,
        title: thread.title,
        status: thread.status
      }))
      .slice(0, MAX_THREADS)
    for (const thread of selectedThreads) {
      const detail = await this.request(settings, `/v1/threads/${encodeURIComponent(thread.id)}`, 'GET')
      const detailObject = parseJsonObject(detail.body)
      const content = extractLearningThreadText(detailObject)
      const cursorFingerprint = hashJson({
        updatedAt: thread.updatedAt,
        title: thread.title,
        status: thread.status
      })
      const commonMetadata = {
        id: thread.id,
        updatedAt: thread.updatedAt,
        relation: thread.relation,
        cursorKey: `thread-meta:${thread.id}`,
        cursorFingerprint,
        cursorGroup: `thread-batch:${thread.id}`
      }
      if (content.trim()) {
        addChangedChunks(candidates, state, {
          baseKey: `thread:${thread.id}`,
          kind: 'thread',
          title: thread.title?.trim() || thread.id,
          baseFingerprint: cursorFingerprint,
          content,
          metadata: commonMetadata
        })
      }

      const processText = extractLearningProcessText(detailObject)
      if (processText.trim()) {
        addChangedChunks(candidates, state, {
          baseKey: `process:${thread.id}`,
          kind: 'process',
          title: `${thread.title?.trim() || thread.id}·过程记录`,
          baseFingerprint: cursorFingerprint,
          content: processText,
          metadata: commonMetadata
        })
      }
      await this.collectThreadFileSources({
        settings,
        state,
        candidates,
        threadId: thread.id,
        threadTitle: thread.title?.trim() || thread.id,
        detail: detailObject,
        commonMetadata
      })
    }

    const memories = await this.fetchMemories(settings)
    let changedDefinitionCount = 0
    for (const memory of memories.filter((item) => !item.deletedAt)) {
      const key = `memory:${memory.id}`
      const fingerprint = hashJson(memoryComparable(memory))
      if (state.sourceHashes[key] === fingerprint) continue
      if (changedDefinitionCount >= MAX_MEMORY_AND_SKILLS) break
      changedDefinitionCount += 1
      candidates.push({
        key,
        kind: 'memory',
        title: memory.content.slice(0, 48),
        fingerprint,
        content: clipSource(JSON.stringify(memory, null, 2)),
        metadata: { id: memory.id, updatedAt: memory.updatedAt }
      })
    }

    const knowledgeResponse = await this.request(settings, '/v1/knowledge/tree', 'GET')
    const knowledgeObject = parseJsonObject(knowledgeResponse.body)
    const knowledgeFiles = flattenKnowledgeNodes(
      Array.isArray(knowledgeObject?.nodes) ? knowledgeObject.nodes as KnowledgeNodeJson[] : []
    )
      .filter((node) => node.path)
      .filter((node) => state.sourceHashes[`knowledge-meta:${node.path}`] !== hashJson({
        updatedAt: node.updatedAt,
        sizeBytes: node.sizeBytes
      }))
      .slice(0, MAX_KNOWLEDGE_FILES)
    for (const file of knowledgeFiles) {
      const path = file.path!
      const endpoint = isPlainTextExtension(file.extension)
        ? `/v1/knowledge/file?path=${encodeURIComponent(path)}`
        : `/v1/knowledge/file/extract-text?path=${encodeURIComponent(path)}`
      const response = await this.deps.runtimeRequest(settings, endpoint, { method: 'GET' })
      if (!response.ok) continue
      const object = parseJsonObject(response.body)
      const content = typeof object?.content === 'string'
        ? object.content
        : typeof object?.text === 'string'
          ? object.text
          : ''
      if (!content.trim()) continue
      addChangedChunks(candidates, state, {
        baseKey: `knowledge:${path}`,
        kind: 'knowledge',
        title: file.name || basename(path),
        baseFingerprint: hashJson({ updatedAt: file.updatedAt, sizeBytes: file.sizeBytes }),
        content,
        metadata: {
          path,
          updatedAt: file.updatedAt,
          extension: file.extension,
          cursorKey: `knowledge-meta:${path}`,
          cursorFingerprint: hashJson({ updatedAt: file.updatedAt, sizeBytes: file.sizeBytes })
        }
      })
    }

    const skillList = await listGuiSkills(settings, settings.workspaceRoot)
    const protectedSkillIds = skillList.ok
      ? [...new Set(skillList.skills
          .filter((skill) => skill.scope === 'builtin' || skill.scope === 'project')
          .map((skill) => skill.id))]
      : []
    if (skillList.ok) {
      for (const skill of skillList.skills) {
        if (changedDefinitionCount >= MAX_MEMORY_AND_SKILLS) break
        const key = `skill:${skill.id}:${skill.root}`
        const read = await readGuiSkillFile(skill.root, skill.entryPath)
        if (!read.ok) continue
        const fingerprint = hashText(read.content)
        if (state.sourceHashes[key] === fingerprint) continue
        changedDefinitionCount += 1
        candidates.push({
          key,
          kind: 'skill',
          title: skill.name,
          fingerprint,
          content: clipSource(read.content),
          metadata: { id: skill.id, scope: skill.scope, root: skill.root }
        })
      }
    }

    const pendingCount = candidates.length
    const sources = selectLearningSources(candidates)
    const processedHashes: Record<string, string> = Object.fromEntries(
      sources.map((source) => [source.key, source.fingerprint])
    )
    const selectedCountByBase = countSourcesByBase(sources)
    const candidateCountByBase = countSourcesByBase(candidates)
    const selectedCountByCursorGroup = countSourcesByMetadata(sources, 'cursorGroup')
    const candidateCountByCursorGroup = countSourcesByMetadata(candidates, 'cursorGroup')
    for (const source of sources) {
      const cursorGroup = source.metadata?.cursorGroup
      if (typeof cursorGroup === 'string') {
        if (selectedCountByCursorGroup.get(cursorGroup) !== candidateCountByCursorGroup.get(cursorGroup)) continue
      } else {
      const baseKey = typeof source.metadata?.baseKey === 'string' ? source.metadata.baseKey : source.key
      if (selectedCountByBase.get(baseKey) !== candidateCountByBase.get(baseKey)) continue
      }
      const cursorKey = source.metadata?.cursorKey
      const cursorFingerprint = source.metadata?.cursorFingerprint
      if (typeof cursorKey === 'string' && typeof cursorFingerprint === 'string') {
        processedHashes[cursorKey] = cursorFingerprint
      }
    }
    return { sources, pendingCount, memories, processedHashes, protectedSkillIds }
  }

  private async collectThreadFileSources(input: {
    settings: AppSettingsV1
    state: LearningState
    candidates: LearningSource[]
    threadId: string
    threadTitle: string
    detail: Record<string, unknown> | null
    commonMetadata: Record<string, unknown>
  }): Promise<void> {
    const attachmentIds = extractLearningAttachmentIds(input.detail).slice(0, MAX_THREAD_FILES)
    for (const attachmentId of attachmentIds) {
      const response = await this.deps.runtimeRequest(
        input.settings,
        `/v1/attachments/${encodeURIComponent(attachmentId)}/content?thread_id=${encodeURIComponent(input.threadId)}`,
        { method: 'GET' }
      )
      if (!response.ok) continue
      const object = parseJsonObject(response.body)
      const attachment = isRecord(object?.attachment) ? object.attachment : null
      const localFilePath = typeof attachment?.localFilePath === 'string' ? attachment.localFilePath : ''
      const name = typeof attachment?.name === 'string' ? attachment.name : attachmentId
      const content = await readLearningFileText(localFilePath)
      if (!content.trim()) continue
      const fingerprint = typeof attachment?.hash === 'string'
        ? attachment.hash
        : hashText(content)
      addChangedChunks(input.candidates, input.state, {
        baseKey: `uploaded-file:${attachmentId}`,
        kind: 'uploaded-file',
        title: `${input.threadTitle}·用户上传·${name}`,
        baseFingerprint: fingerprint,
        content,
        metadata: {
          ...input.commonMetadata,
          attachmentId,
          fileName: name,
          sourceOrigin: 'user-upload'
        }
      })
    }

    const generatedPaths = await resolveLearningGeneratedPaths(
      input.detail,
      input.settings.workspaceRoot
    )
    for (const filePath of generatedPaths.slice(0, MAX_THREAD_FILES)) {
      const info = await stat(filePath).catch(() => null)
      if (!info?.isFile() || info.size > MAX_LOCAL_FILE_BYTES) continue
      const content = await readLearningFileText(filePath)
      if (!content.trim()) continue
      const relativePath = relative(resolve(input.settings.workspaceRoot), filePath).split(sep).join('/')
      addChangedChunks(input.candidates, input.state, {
        baseKey: `generated-file:${hashText(filePath)}`,
        kind: 'generated-file',
        title: `${input.threadTitle}·Agent 产出·${basename(filePath)}`,
        baseFingerprint: hashJson({ path: relativePath, size: info.size, updatedAt: info.mtime.toISOString() }),
        content,
        metadata: {
          ...input.commonMetadata,
          path: relativePath,
          fileName: basename(filePath),
          sourceOrigin: 'agent-output'
        }
      })
    }
  }

  private async analyzeWithLegalwork(
    settings: AppSettingsV1,
    runDir: string,
    corpus: string
  ): Promise<LearningModelResult> {
    const runtime = getLegalworkRuntimeSettings(settings)
    const create = await this.request(settings, '/v1/threads', 'POST', JSON.stringify({
      workspace: runDir,
      model: runtime.model,
      mode: 'agent',
      relation: 'side',
      title: `${LEARNING_THREAD_TITLE_PREFIX} ${basename(runDir)}`,
      approvalPolicy: 'never',
      sandboxMode: 'read-only'
    }))
    const thread = parseJsonObject(create.body)
    const threadId = typeof thread?.id === 'string' ? thread.id : ''
    if (!threadId) throw new Error('学习线程创建失败：缺少 thread id。')
    this.activeLearningThreadId = threadId
    let prompt = buildLearningPrompt(corpus)
    let parseError: unknown
    for (let attempt = 0; attempt < MAX_MODEL_RESULT_ATTEMPTS; attempt += 1) {
      const lastText = await this.runLearningTurn(settings, threadId, prompt)
      const outputName = attempt === 0 ? 'MODEL_OUTPUT.txt' : `MODEL_OUTPUT_RETRY_${attempt}.txt`
      await writeFile(join(runDir, outputName), lastText, 'utf8')
      try {
        return parseLearningModelResult(lastText)
      } catch (error) {
        parseError = error
        if (attempt + 1 >= MAX_MODEL_RESULT_ATTEMPTS) break
        this.message = '学习结果格式异常，正在自动修复并重试'
        prompt = buildLearningRepairPrompt(error)
      }
    }
    throw parseError instanceof Error ? parseError : new Error(errorMessage(parseError))
  }

  private async runLearningTurn(
    settings: AppSettingsV1,
    threadId: string,
    prompt: string
  ): Promise<string> {
    const runtime = getLegalworkRuntimeSettings(settings)
    const turnResponse = await this.request(
      settings,
      `/v1/threads/${encodeURIComponent(threadId)}/turns`,
      'POST',
      JSON.stringify({
        prompt,
        mode: 'agent',
        model: runtime.model,
        reasoningEffort: 'high',
        approvalPolicy: 'never'
      })
    )
    const turnObject = parseJsonObject(turnResponse.body)
    const turnId = typeof turnObject?.turnId === 'string'
      ? turnObject.turnId
      : typeof (turnObject?.turn as Record<string, unknown> | undefined)?.id === 'string'
        ? String((turnObject!.turn as Record<string, unknown>).id)
        : ''
    if (!turnId) throw new Error('学习线程启动失败：缺少 turn id。')

    const deadline = Date.now() + TURN_TIMEOUT_MS
    let lastText = ''
    let consecutiveTransientPollFailures = 0
    while (Date.now() < deadline) {
      if (this.cancelRequested) {
        await this.interruptLearningTurn(settings, threadId, turnId)
        throw new LearningCancelledError()
      }
      await sleep(1_500)
      // Always poll the thread status — isBusy() should not prevent us from
      // seeing that the AI has finished, otherwise the loop can time out even
      // though the turn completed successfully.
      let detailResponse: RuntimeRequestResult
      try {
        detailResponse = await this.request(
          settings,
          `/v1/threads/${encodeURIComponent(threadId)}`,
          'GET'
        )
        consecutiveTransientPollFailures = 0
      } catch (error) {
        if (isRecoverableLearningRuntimeError(error)) {
          consecutiveTransientPollFailures += 1
          if (consecutiveTransientPollFailures <= 5) {
            this.message = '运行时连接恢复中，正在继续等待本轮学习'
            continue
          }
        }
        throw error
      }
      const detail = JSON.parse(detailResponse.body) as ThreadDetailJson
      lastText = latestAssistantText(detail, { turnId }) || lastText
      const turn = detail.turns?.find((item) => item.id === turnId)
      if (!turn || turn.status === 'queued' || turn.status === 'running') {
        // Turn still running. Just sleep and poll again, regardless of whether
        // the system is busy — we never kill an in-flight LLM turn.
        continue
      }
      if (turn.status !== 'completed') {
        throw new Error(
          turn.error?.trim() || learningTurnFailureDetail(detail, turnId, turn.status ?? 'failed', lastText)
        )
      }
      if (!lastText) throw new Error('学习线程没有返回分析结果。')
      return lastText
    }
    await this.interruptLearningTurn(settings, threadId, turnId)
    throw new Error('学习线程执行超时。')
  }

  private async interruptLearningTurn(
    settings: AppSettingsV1,
    threadId: string,
    turnId: string
  ): Promise<void> {
    await this.deps.runtimeRequest(
      settings,
      `/v1/threads/${encodeURIComponent(threadId)}/turns/${encodeURIComponent(turnId)}/interrupt`,
      { method: 'POST', body: '{}' }
    ).catch(() => undefined)
  }

  private async applyResult(
    settings: AppSettingsV1,
    runDir: string,
    result: LearningModelResult,
    inventory: { memories: MemorySnapshot[] },
    counts: LearningIterationCounts
  ): Promise<LearningManifest['rollback']> {
    const rollback: LearningManifest['rollback'] = { memories: [], skills: [], knowledge: [] }
    const memoryById = new Map(inventory.memories.map((item) => [item.id, item]))
    try {
      for (const proposal of result.memories) {
        if (proposal.action === 'create') {
          const response = await this.request(settings, '/v1/memory', 'POST', JSON.stringify({
            content: proposal.content,
            scope: proposal.scope ?? 'user',
            ...((proposal.scope === 'workspace' || proposal.scope === 'project')
              ? { workspace: settings.workspaceRoot }
              : {}),
            ...(proposal.scope === 'project' ? { project: settings.workspaceRoot } : {}),
            category: proposal.category ?? 'preference',
            recallPolicy: proposal.recallPolicy ?? 'relevant',
            captureSource: 'automatic',
            tags: [...new Set([...(proposal.tags ?? []), 'learning-iteration'])],
            confidence: Math.max(proposal.confidence ?? 0.8, 0.8),
            origin: 'learning-iteration',
            sourceIterationId: this.activeRunId,
            evidence: proposal.evidence ?? []
          }))
          const object = parseJsonObject(response.body)
          const memory = (object?.memory ?? object) as MemorySnapshot
          if (!memory?.id) throw new Error('创建学习记忆后未返回 id。')
          rollback.memories.push({
            action: 'delete-created',
            id: memory.id,
            afterHash: hashJson(memoryComparable(memory))
          })
          counts.memoriesCreated += 1
          continue
        }
        const id = proposal.id?.trim()
        const before = id ? memoryById.get(id) : undefined
        if (!id || !before) continue
        const patch = proposal.action === 'disable'
          ? { disabled: true }
          : {
              ...(proposal.content ? { content: proposal.content } : {}),
              ...(proposal.scope ? { scope: proposal.scope } : {}),
              ...(proposal.category ? { category: proposal.category } : {}),
              ...(proposal.recallPolicy ? { recallPolicy: proposal.recallPolicy } : {}),
              ...(proposal.tags ? { tags: [...new Set([...proposal.tags, 'learning-iteration'])] } : {}),
              ...(proposal.confidence !== undefined ? { confidence: proposal.confidence } : {})
            }
        const response = await this.request(
          settings,
          `/v1/memory/${encodeURIComponent(id)}`,
          'PATCH',
          JSON.stringify(patch)
        )
        const object = parseJsonObject(response.body)
        const memory = (object?.memory ?? object) as MemorySnapshot
        rollback.memories.push({
          action: 'restore',
          id,
          before,
          afterHash: hashJson(memoryComparable(memory))
        })
        if (proposal.action === 'disable') counts.memoriesDisabled += 1
        else counts.memoriesUpdated += 1
      }

      for (const proposal of result.skills) {
        const targetPath = join(USER_INSTALLED_SKILL_ROOT, proposal.id)
        const existed = existsSync(targetPath)
        const backupPath = join(runDir, 'rollback', 'skills', proposal.id)
        if (existed) {
          await cp(targetPath, backupPath, { recursive: true })
        }
        await installGeneratedSkill(targetPath, proposal, this.activeRunId)
        rollback.skills.push({
          action: existed ? 'restore' : 'delete-created',
          id: proposal.id,
          targetPath,
          ...(existed ? { backupPath } : {}),
          afterHash: await hashDirectory(targetPath)
        })
        if (existed) counts.skillsUpdated += 1
        else counts.skillsCreated += 1
      }
      const appliedKnowledgeNotes: KnowledgeNoteProposal[] = []
      for (const proposal of result.knowledgeNotes) {
        const beforeContent = await this.readKnowledgeFileOptional(settings, proposal.path)
        if (proposal.action === 'create' && beforeContent !== null) {
          counts.rejected += 1
          continue
        }
        if (proposal.action === 'update' && (
          beforeContent === null || !beforeContent.includes(LEARNING_KNOWLEDGE_MARKER)
        )) {
          counts.rejected += 1
          continue
        }
        const content = renderLearningKnowledgeNote(proposal, this.activeRunId, this.now())
        await this.request(settings, '/v1/knowledge/file', 'POST', JSON.stringify({
          path: proposal.path,
          content,
          encoding: 'utf8'
        }))
        rollback.knowledge.push({
          action: beforeContent === null ? 'delete-created' : 'restore',
          path: proposal.path,
          ...(beforeContent !== null ? { beforeContent } : {}),
          afterHash: hashText(content)
        })
        if (beforeContent === null) counts.knowledgeNotesCreated += 1
        else counts.knowledgeNotesUpdated += 1
        appliedKnowledgeNotes.push(proposal)
      }
      result.knowledgeNotes = appliedKnowledgeNotes
      if (rollback.knowledge.length > 0) {
        await this.request(settings, '/v1/knowledge/sync', 'POST', '{}')
      }
      return rollback
    } catch (error) {
      await this.rollbackApplied(settings, rollback).catch((rollbackError) => {
        this.deps.logError('learning-iteration', 'Failed to rollback partial publish', {
          message: errorMessage(rollbackError)
        })
      })
      throw error
    }
  }

  private async rollbackApplied(
    settings: AppSettingsV1,
    rollback: LearningManifest['rollback']
  ): Promise<void> {
    for (const operation of [...rollback.knowledge].reverse()) {
      if (operation.action === 'delete-created') {
        await this.request(settings, `/v1/knowledge/file?path=${encodeURIComponent(operation.path)}`, 'DELETE')
      } else if (operation.beforeContent !== undefined) {
        await this.request(settings, '/v1/knowledge/file', 'POST', JSON.stringify({
          path: operation.path,
          content: operation.beforeContent,
          encoding: 'utf8'
        }))
      }
    }
    if (rollback.knowledge.length > 0) {
      await this.request(settings, '/v1/knowledge/sync', 'POST', '{}')
    }
    for (const operation of [...rollback.skills].reverse()) {
      await rm(operation.targetPath, { recursive: true, force: true })
      if (operation.action === 'restore' && operation.backupPath) {
        await cp(operation.backupPath, operation.targetPath, { recursive: true })
      }
    }
    for (const operation of [...rollback.memories].reverse()) {
      if (operation.action === 'delete-created') {
        await this.request(settings, `/v1/memory/${encodeURIComponent(operation.id)}`, 'DELETE')
      } else if (operation.before) {
        await this.request(
          settings,
          `/v1/memory/${encodeURIComponent(operation.id)}`,
          'PATCH',
          JSON.stringify(memoryRestorePatch(operation.before))
        )
      }
    }
  }

  private async readKnowledgeFileOptional(
    settings: AppSettingsV1,
    path: string
  ): Promise<string | null> {
    const response = await this.deps.runtimeRequest(
      settings,
      `/v1/knowledge/file?path=${encodeURIComponent(path)}`,
      { method: 'GET' }
    )
    if (response.status === 404) return null
    if (!response.ok) throw new Error(runtimeErrorMessage(response, `GET knowledge file failed: ${path}`))
    const object = parseJsonObject(response.body)
    return typeof object?.content === 'string' ? object.content : null
  }

  private async fetchMemories(settings: AppSettingsV1): Promise<MemorySnapshot[]> {
    const response = await this.deps.runtimeRequest(
      settings,
      '/v1/memory?include_deleted=true&limit=500',
      { method: 'GET' }
    )
    if (!response.ok) return []
    const object = parseJsonObject(response.body)
    return Array.isArray(object?.memories) ? object.memories as MemorySnapshot[] : []
  }

  private async request(
    settings: AppSettingsV1,
    path: string,
    method = 'GET',
    body?: string
  ): Promise<{ ok: boolean; status: number; body: string }> {
    const response = await this.deps.runtimeRequest(settings, path, {
      method,
      ...(body !== undefined ? { body } : {})
    })
    if (!response.ok) {
      throw new Error(runtimeErrorMessage(response, `${method} ${path} failed.`))
    }
    return response
  }

  private learningRoot(settings: AppSettingsV1): string {
    return join(resolveLegalworkDataDir(getLegalworkRuntimeSettings(settings)), 'learning-iterations')
  }

  private runDir(settings: AppSettingsV1, id: string): string {
    return join(this.learningRoot(settings), 'runs', id)
  }

  private async readState(settings: AppSettingsV1): Promise<LearningState> {
    try {
      const parsed = JSON.parse(await readFile(join(this.learningRoot(settings), 'state.json'), 'utf8')) as Partial<LearningState>
      return {
        version: 1,
        sourceHashes: parsed.sourceHashes ?? {},
        lastSuccessfulAt: parsed.lastSuccessfulAt ?? '',
        lastCheckedAt: parsed.lastCheckedAt ?? '',
        lastLocalDay: parsed.lastLocalDay ?? '',
        lastRetryAt: parsed.lastRetryAt ?? '',
        retryCount: parsed.retryCount ?? 0,
        baselineComplete: parsed.baselineComplete === true,
        baselineProcessed: parsed.baselineProcessed ?? 0,
        baselineRemaining: parsed.baselineRemaining ?? 0,
        pendingRunId: parsed.pendingRunId ?? ''
      }
    } catch {
      return defaultState()
    }
  }

  private async writeState(settings: AppSettingsV1, state: LearningState): Promise<void> {
    const root = this.learningRoot(settings)
    await mkdir(root, { recursive: true })
    await atomicJsonWrite(join(root, 'state.json'), state)
  }

  private async readRecordSummaries(settings: AppSettingsV1): Promise<LearningIterationRecordSummary[]> {
    const runsRoot = join(this.learningRoot(settings), 'runs')
    const entries = await readdir(runsRoot, { withFileTypes: true }).catch(() => [])
    const summaries = await Promise.all(entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => this.readManifest(join(runsRoot, entry.name))
        .then((manifest) => manifest.summary)
        .catch(() => null)))
    return summaries
      .filter((summary): summary is LearningIterationRecordSummary => Boolean(summary))
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
  }

  private async readManifest(runDir: string): Promise<LearningManifest> {
    const manifest = JSON.parse(await readFile(join(runDir, 'manifest.json'), 'utf8')) as LearningManifest
    return {
      ...manifest,
      summary: {
        ...manifest.summary,
        counts: normalizeLearningCounts(manifest.summary.counts)
      },
      rollback: {
        memories: manifest.rollback?.memories ?? [],
        skills: manifest.rollback?.skills ?? [],
        knowledge: manifest.rollback?.knowledge ?? []
      },
      ...(manifest.modelResult
        ? {
            modelResult: {
              ...manifest.modelResult,
              memories: manifest.modelResult.memories ?? [],
              skills: manifest.modelResult.skills ?? [],
              knowledgeNotes: manifest.modelResult.knowledgeNotes ?? [],
              rejected: manifest.modelResult.rejected ?? []
            }
          }
        : {})
    }
  }

  private async writeManifest(runDir: string, manifest: LearningManifest): Promise<void> {
    await mkdir(runDir, { recursive: true })
    await atomicJsonWrite(join(runDir, 'manifest.json'), manifest)
  }

  private async writeFailureRecord(settings: AppSettingsV1, error: unknown): Promise<void> {
    if (!this.activeRunId) return
    const runDir = this.runDir(settings, this.activeRunId)
    const failedAt = this.now().toISOString()
    const summary: LearningIterationRecordSummary = {
      id: this.activeRunId,
      title: '学习迭代失败',
      displayName: `${localDay(this.now())} · 学习迭代失败`,
      status: 'failed',
      startedAt: this.activeRunStartedAt || failedAt,
      finishedAt: failedAt,
      reportPath: join(runDir, 'REPORT.md'),
      canRollback: false,
      counts: { ...this.activeSourceCounts }
    }
    const message = errorMessage(error)
    await mkdir(runDir, { recursive: true })
    await writeFile(
      join(runDir, 'REPORT.md'),
      `# 学习迭代失败\n\n> 本轮没有成功发布，不占用今日额度。\n\n## 错误\n\n${message}\n\n## 后续处理\n\n系统会按退避策略重新检查；不存在部分发布。\n`,
      'utf8'
    )
    await this.writeManifest(runDir, {
      version: 1,
      summary,
      sourceHashes: {},
      rollback: { memories: [], skills: [], knowledge: [] }
    })
  }

  private now(): Date {
    return this.deps.now?.() ?? new Date()
  }
}

export function createLearningIterationRuntime(deps: RuntimeDeps): LearningIterationRuntime {
  return new LearningIterationRuntime(deps)
}

/**
 * Builds a diagnostic message for a failed learning turn when the turn object
 * itself carries no `error` field. Extracts the most actionable signal from the
 * thread's items — the last error item, else a failed tool result, else the
 * final assistant text — so the reported issue is not just
 * "学习线程状态异常：failed".
 */
export function learningTurnFailureDetail(
  detail: ThreadDetailJson,
  turnId: string,
  status: string,
  lastText: string
): string {
  const fallback = `学习线程状态异常：${status}`
  const turn = Array.isArray(detail.turns) ? detail.turns.find((item) => item.id === turnId) : undefined
  const items = Array.isArray(turn?.items) ? turn.items : []
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index]
    if (item.kind === 'error') {
      const message = (item.message ?? item.detail ?? item.text ?? item.summary ?? '').trim()
      if (message) return `${fallback}（${truncateDiagnostic(message)}）`
    }
  }
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index]
    if (item.kind === 'tool_result' && item.isError) {
      const message = (item.detail ?? item.text ?? item.summary ?? '').trim()
      if (message) return `${fallback}（工具执行失败：${truncateDiagnostic(message)}）`
    }
  }
  const last = lastText.trim()
  if (last) return `${fallback}（最后输出：${truncateDiagnostic(last)}）`
  return fallback
}

function truncateDiagnostic(text: string, maxLength = 200): string {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}…`
}

function defaultState(): LearningState {
  return {
    version: 1,
    sourceHashes: {},
    lastSuccessfulAt: '',
    lastCheckedAt: '',
    lastLocalDay: '',
    lastRetryAt: '',
    retryCount: 0,
    baselineComplete: false,
    baselineProcessed: 0,
    baselineRemaining: 0,
    pendingRunId: ''
  }
}

function normalizeLearningCounts(
  counts: Partial<LearningIterationCounts> | undefined
): LearningIterationCounts {
  return {
    ...EMPTY_COUNTS,
    ...(counts ?? {})
  }
}

function retryIsDue(state: LearningState, now: Date): boolean {
  const last = Date.parse(state.lastRetryAt)
  if (!Number.isFinite(last)) return true
  const delay = state.retryCount <= 1 ? 30 * 60_000 : 2 * 60 * 60_000
  return now.getTime() - last >= delay
}

function localDay(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function nextLocalDayStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
}

function buildRunId(date: Date): string {
  return `${localDay(date)}-${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}-${randomUUID().slice(0, 8)}`
}

function validateRunId(id: string): string {
  const value = id.trim()
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(value)) throw new Error('无效的学习迭代记录 id。')
  return value
}

function normalizeTitle(value: string): string {
  const title = value
    .replace(/^#+\s*/, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, 40)
  return title || '学习迭代报告'
}

function renderCorpus(sources: LearningSource[]): string {
  return [
    '# Legalwork 学习迭代输入',
    '',
    '以下内容只用于提取稳定、可复用且可审计的记忆、工作方法和知识库 Markdown。',
    '',
    ...sources.flatMap((source) => [
      `## ${source.kind} · ${source.key} · ${source.title}`,
      '',
      source.content,
      ''
    ])
  ].join('\n')
}

function buildLearningPrompt(corpus: string): string {
  return [
    'Use $legalwork-learning-iteration to analyze the bounded Legalwork interaction corpus below.',
    'Do not call any tools — analyze the corpus purely in text. The host is authorized to publish your validated Markdown knowledge-note proposals into the local knowledge base with rollback protection. Do not write outside the response.',
    'Treat client facts as confidential source material. Prefer distilled research notes, reusable checklists, templates, drafting guidance, and process lessons. Minimize personal identifiers and never copy credentials or secrets.',
    'Only propose automatic memories in profile, preference, workflow, or project. Never propose interest, matter, other, client identity, account identifiers, secrets, passwords, tokens, verification codes, or case facts for automatic storage.',
    'Thread sources contain only user-authored messages. Only thread sources may support memory candidates; knowledge and Skill sources may support reusable Skill candidates but never user memories.',
    'Uploaded-file, generated-file, process, thread, and knowledge sources may support knowledgeNotes. A useful fact, synthesis, checklist, template, or process lesson may be proposed from one direct source when it is likely to help later.',
    `knowledgeNotes must be Markdown files under “${LEARNING_KNOWLEDGE_ROOT}/”. Name every .md file after its concrete subject, such as “劳动合同解除审查要点.md” or “庭前材料核对清单.md”. Never use generic numbered names such as “迭代记录1.md”, “学习笔记2.md”, “未命名.md”, or date-only filenames.`,
    'Create a knowledge note only when it adds retrieval value beyond the source: synthesize, structure, cross-reference, or turn process experience into a reusable guide. Do not duplicate a complete source file verbatim. Use update only for an existing learning note when new evidence materially improves it.',
    'Do not infer the user profession, expertise, identity, preference, or workflow from an assistant response, task topic, retrieved document, file name, or generated artifact. A profile/project candidate needs explicit first-person user statements from at least three independent threads.',
    'Apply the RIA-TV++-inspired workflow and triple verification. Preference/workflow memories need at least two independent thread sources; one thread is allowed only for an explicit user correction. Chunks from one base source count as one source.',
    `Keep reportMarkdown under ${MAX_REPORT_MARKDOWN_CHARS} characters, propose at most ${MAX_MEMORY_PROPOSALS} memories, ${MAX_SKILL_PROPOSALS} Skills, and ${MAX_KNOWLEDGE_NOTE_PROPOSALS} Markdown knowledge notes, and keep the report concise.`,
    'Write title, summary, and reportMarkdown for the end user, not for developers. Use plain, friendly Chinese and focus on what the product learned, how the experience will improve, and what it will do differently next time.',
    'In reportMarkdown, use the sections “这次学到了什么”, “会带来哪些提升”, and “以后会怎样帮你”. Do not expose raw source keys, thread IDs, memory IDs, JSON field names, internal workflow names, validation framework names, test categories, or developer implementation details.',
    'Write every Skill name and description in clear Chinese as well; only its machine-readable id stays in lowercase English.',
    'Do not claim final applied/rejected counts because the host validates candidates and computes authoritative counts after your response.',
    'Return exactly one JSON object between the marker lines shown below. Do not use Markdown fences around the JSON.',
    RESULT_BEGIN,
    JSON.stringify({
      title: '10-24 character Chinese title describing the user-visible learning theme',
      summary: 'one plain-language sentence explaining the user-visible outcome',
      reportMarkdown: '## 这次学到了什么\\n\\n...\\n\\n## 会带来哪些提升\\n\\n...\\n\\n## 以后会怎样帮你\\n\\n...',
      memories: [{
        action: 'create | update | disable',
        id: 'required for update or disable',
        content: 'required for create/update',
        scope: 'user | workspace | project',
        category: 'profile | preference | workflow | project | interest | matter | other',
        recallPolicy: 'always | relevant',
        tags: ['tag'],
        confidence: 0.8,
        explicitCorrection: false,
        evidence: [{ sourceKey: 'thread:...', note: 'why this supports the candidate' }]
      }],
      skills: [{
        action: 'create | update',
        id: 'lowercase-hyphen-skill-id',
        name: 'Human title',
        description: 'Clear trigger conditions',
        skillMarkdown: 'Complete SKILL.md with only name and description in frontmatter',
        tests: [{
          prompt: 'test prompt',
          expected: 'should-trigger | should-not-trigger | ambiguous | sibling-confusion',
          reason: 'expected behavior',
          passed: true
        }],
        evidence: [{ sourceKey: 'thread:...' }]
      }],
      knowledgeNotes: [{
        action: 'create | update',
        path: '学习沉淀/资料摘要/劳动合同解除审查要点.md',
        title: '劳动合同解除审查要点',
        summary: '一句话说明为什么以后值得检索',
        content: '# 劳动合同解除审查要点\\n\\n经结构化的 Markdown 正文',
        evidence: [{ sourceKey: 'uploaded-file:...' }]
      }],
      rejected: [{ title: 'candidate', reason: 'why it failed validation' }]
    }, null, 2),
    RESULT_END,
    '',
    corpus
  ].join('\n')
}

function buildLearningRepairPrompt(error: unknown): string {
  return [
    'The previous learning result was not valid JSON.',
    `Parser error: ${errorMessage(error)}`,
    'Return the same proposed result again, changing only JSON syntax and escaping.',
    'Return exactly one JSON object between BEGIN_LEARNING_RESULT and END_LEARNING_RESULT.',
    'Do not use Markdown fences. Do not add commentary outside the marker lines.',
    'Every double quote, backslash, newline, tab, and control character inside a JSON string must be JSON-escaped.',
    'Preserve all candidate content, evidence, tests, and rejection reasons.'
  ].join('\n')
}

export function parseLearningModelResult(text: string): LearningModelResult {
  const start = text.indexOf(RESULT_BEGIN)
  const end = text.indexOf(RESULT_END, start + RESULT_BEGIN.length)
  const jsonText = start >= 0 && end > start
    ? text.slice(start + RESULT_BEGIN.length, end).trim()
    : extractJsonObject(text)
  const parsed = parseLearningModelJson(jsonText)
  const memories = Array.isArray(parsed.memories)
    ? parsed.memories.filter(isRecord).slice(0, MAX_MEMORY_PROPOSALS) as MemoryProposal[]
    : []
  const skills = Array.isArray(parsed.skills)
    ? parsed.skills.filter(isRecord).slice(0, MAX_SKILL_PROPOSALS) as SkillProposal[]
    : []
  const knowledgeNotes = Array.isArray(parsed.knowledgeNotes)
    ? parsed.knowledgeNotes.filter(isRecord).slice(0, MAX_KNOWLEDGE_NOTE_PROPOSALS) as KnowledgeNoteProposal[]
    : []
  const rejected = Array.isArray(parsed.rejected)
    ? parsed.rejected
        .filter((item): item is { title: string; reason: string } =>
          isRecord(item) && typeof item.title === 'string' && typeof item.reason === 'string'
        )
        .slice(0, MAX_REJECTED_PROPOSALS)
    : []
  return {
    title: typeof parsed.title === 'string' ? parsed.title : '学习迭代报告',
    summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 1_000) : '',
    reportMarkdown: typeof parsed.reportMarkdown === 'string'
      ? parsed.reportMarkdown.replace(/\\n/g, '\n').slice(0, MAX_REPORT_MARKDOWN_CHARS)
      : '',
    memories,
    skills,
    knowledgeNotes,
    rejected
  }
}

function parseLearningModelJson(jsonText: string): Partial<LearningModelResult> {
  let originalError: unknown
  try {
    return JSON.parse(jsonText) as Partial<LearningModelResult>
  } catch (error) {
    originalError = error
  }

  const repaired = repairLearningModelJson(jsonText)
  const candidates = repaired === jsonText ? [jsonText] : [repaired, jsonText]
  for (const candidate of candidates) {
    if (candidate !== jsonText) {
      try {
        return JSON.parse(candidate) as Partial<LearningModelResult>
      } catch {
        // Fall through to prefix recovery below.
      }
    }
    const firstObject = extractFirstCompleteJsonObject(candidate)
    if (!firstObject || firstObject.trim() === candidate.trim()) continue
    try {
      return JSON.parse(firstObject) as Partial<LearningModelResult>
    } catch {
      // Keep the original parser error so the repair turn sees the real fault.
    }
  }
  throw originalError
}

function extractFirstCompleteJsonObject(text: string): string | undefined {
  const start = text.indexOf('{')
  if (start < 0) return undefined
  let depth = 0
  let inString = false
  let escaped = false
  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === '"') inString = false
      continue
    }
    if (char === '"') {
      inString = true
      continue
    }
    if (char === '{') {
      depth += 1
      continue
    }
    if (char === '}') {
      depth -= 1
      if (depth === 0) return text.slice(start, index + 1)
      if (depth < 0) return undefined
    }
  }
  return undefined
}

/**
 * Repairs the two common forms of invalid model-authored JSON without
 * changing object structure: unescaped characters inside string values
 * and invalid backslash escapes. Structural JSON errors are left for the
 * model retry so we do not guess at missing fields, commas, or braces.
 */
export function repairLearningModelJson(jsonText: string): string {
  let output = ''
  let inString = false

  for (let index = 0; index < jsonText.length; index += 1) {
    const char = jsonText[index]
    if (!inString) {
      output += char
      if (char === '"') inString = true
      continue
    }

    if (char === '\\') {
      const next = jsonText[index + 1]
      if (next && isValidJsonEscape(jsonText, index + 1)) {
        output += char + next
        index += 1
      } else {
        output += '\\\\'
      }
      continue
    }

    if (char === '"') {
      if (looksLikeJsonStringTerminator(jsonText, index + 1)) {
        output += char
        inString = false
      } else {
        output += '\\"'
      }
      continue
    }

    const code = char.charCodeAt(0)
    if (char === '\n') output += '\\n'
    else if (char === '\r') output += '\\r'
    else if (char === '\t') output += '\\t'
    else if (code < 0x20) output += `\\u${code.toString(16).padStart(4, '0')}`
    else output += char
  }

  return output
}

function isValidJsonEscape(text: string, escapeIndex: number): boolean {
  const char = text[escapeIndex]
  if ('"\\/bfnrt'.includes(char)) return true
  if (char !== 'u') return false
  return /^[0-9a-fA-F]{4}$/.test(text.slice(escapeIndex + 1, escapeIndex + 5))
}

function looksLikeJsonStringTerminator(text: string, fromIndex: number): boolean {
  let index = fromIndex
  while (index < text.length && /\s/.test(text[index])) index += 1
  return index >= text.length || ':,}]'.includes(text[index])
}

function extractJsonObject(text: string): string {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('学习结果不是有效 JSON。')
  return text.slice(start, end + 1)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateModelResult(
  result: LearningModelResult,
  sourceByKey: Map<string, LearningSource>,
  memoryById: Map<string, MemorySnapshot>
): {
  result: LearningModelResult
  rejectedCount: number
  rejectionReasons: string[]
} {
  const rejectionReasons: string[] = []
  const memories = result.memories.filter((proposal) => {
    if (!['create', 'update', 'disable'].includes(proposal.action)) {
      rejectionReasons.push('一个记忆候选缺少有效操作类型，已阻止发布。')
      return false
    }
    if (proposal.content !== undefined && typeof proposal.content !== 'string') {
      rejectionReasons.push('一个记忆候选的内容不是文本，已阻止发布。')
      return false
    }
    proposal.tags = Array.isArray(proposal.tags)
      ? proposal.tags.filter((tag): tag is string => typeof tag === 'string')
      : undefined
    const current = proposal.id ? memoryById.get(proposal.id) : undefined
    const category = proposal.category ?? current?.category ?? (proposal.action === 'create' ? 'preference' : 'other')
    // explicitCorrection bypasses category restriction (e.g. can be 'interest' or 'matter')
    if (!proposal.explicitCorrection && !AUTOMATIC_MEMORY_CATEGORIES.has(category)) {
      rejectionReasons.push(`记忆候选“${proposal.content?.slice(0, 36) || proposal.id || '未命名'}”需要用户确认，不能自动保存。`)
      return false
    }
    if (proposal.action === 'disable' && current?.origin !== 'learning-iteration') {
      rejectionReasons.push(`记忆候选“${proposal.id || '未命名'}”不是自动学习记录，不能由后台学习自动停用。`)
      return false
    }
    const evidence = validEvidence(proposal.evidence, sourceByKey, new Set(['thread']))
    const requiredEvidence = category === 'profile' || category === 'project' ? 3 : 2
    if (evidence.length < requiredEvidence && !(proposal.explicitCorrection && evidence.length >= 1)) {
      rejectionReasons.push(`记忆候选“${proposal.content?.slice(0, 36) || proposal.id || '未命名'}”缺少独立证据。`)
      return false
    }
    const requiredConfidence = category === 'profile' || category === 'project' ? 0.9 : 0.85
    if (!proposal.explicitCorrection && (proposal.confidence ?? 0) < requiredConfidence) {
      rejectionReasons.push(
        `记忆候选“${proposal.content?.slice(0, 36) || proposal.id || '未命名'}”置信度低于 ${requiredConfidence}。`
      )
      return false
    }
    if (proposal.content && proposal.content.length > 1_500) {
      rejectionReasons.push('一个记忆候选过长，不适合作为可复用记忆，已阻止发布。')
      return false
    }
    if (proposal.content && containsSecret(proposal.content)) {
      rejectionReasons.push('一个记忆候选疑似包含密钥或凭据，已阻止发布。')
      return false
    }
    if (!proposal.explicitCorrection && proposal.content && containsSensitiveIdentifier(proposal.content)) {
      rejectionReasons.push('一个记忆候选可能包含客户、案件或账号标识，需要用户确认，未自动发布。')
      return false
    }
    proposal.evidence = evidence
    return proposal.action === 'disable' || Boolean(proposal.content?.trim())
  })
  const skills = result.skills.filter((proposal) => {
    const evidence = validEvidence(proposal.evidence, sourceByKey, new Set(['thread', 'knowledge']))
    const tests = Array.isArray(proposal.tests)
      ? proposal.tests.filter((test): test is SkillProposal['tests'][number] =>
          isRecord(test) &&
          typeof test.prompt === 'string' &&
          typeof test.expected === 'string' &&
          ['should-trigger', 'should-not-trigger', 'ambiguous', 'sibling-confusion'].includes(test.expected) &&
          test.passed === true
        )
      : []
    const categories = new Set(tests.map((test) => test.expected))
    const valid =
      typeof proposal.id === 'string' &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(proposal.id) &&
      evidence.length >= 2 &&
      typeof proposal.description === 'string' &&
      proposal.description.trim().length >= 12 &&
      typeof proposal.skillMarkdown === 'string' &&
      proposal.skillMarkdown.length <= 30_000 &&
      proposal.skillMarkdown.includes('---') &&
      !containsSecret(proposal.skillMarkdown) &&
      tests.length >= 6 &&
      tests.length <= 10 &&
      tests.every((test) => test.passed === true) &&
      categories.has('should-trigger') &&
      categories.has('should-not-trigger') &&
      categories.has('ambiguous') &&
      categories.has('sibling-confusion')
    if (!valid) {
      rejectionReasons.push(`Skill 候选“${proposal.name || proposal.id}”未通过结构或压力测试门槛。`)
      return false
    }
    proposal.tests = tests
    proposal.evidence = evidence
    return valid
  })
  const seenKnowledgePaths = new Set<string>()
  const knowledgeNotes = result.knowledgeNotes.filter((proposal) => {
    const path = normalizeLearningKnowledgePath(proposal.path)
    const title = typeof proposal.title === 'string' ? singleLine(proposal.title).slice(0, 120) : ''
    const summary = typeof proposal.summary === 'string' ? singleLine(proposal.summary).slice(0, 500) : ''
    const content = typeof proposal.content === 'string' ? proposal.content.trim() : ''
    const evidence = validEvidence(
      proposal.evidence,
      sourceByKey,
      new Set(['thread', 'knowledge', 'uploaded-file', 'generated-file', 'process'])
    ).filter((item) => {
      const source = sourceByKey.get(item.sourceKey)
      return source?.kind !== 'knowledge' || !String(source.metadata?.path ?? '').startsWith(`${LEARNING_KNOWLEDGE_ROOT}/`)
    })
    const valid =
      (proposal.action === 'create' || proposal.action === 'update') &&
      Boolean(path) &&
      !seenKnowledgePaths.has(path) &&
      title.length >= 4 &&
      hasTopicSemantics(title) &&
      !isGenericLearningNoteName(title) &&
      summary.length >= 8 &&
      content.length >= 80 &&
      content.length <= MAX_LEARNING_NOTE_CHARS &&
      evidence.length >= 1 &&
      !containsSecret(content)
    if (!valid) {
      rejectionReasons.push(`知识库候选“${title || proposal.path || '未命名'}”未通过主题命名、内容或证据校验。`)
      return false
    }
    proposal.path = path
    proposal.title = title
    proposal.summary = summary
    proposal.content = content
    proposal.evidence = evidence
    seenKnowledgePaths.add(path)
    return true
  })
  return {
    result: { ...result, memories, skills, knowledgeNotes },
    rejectedCount:
      result.memories.length - memories.length +
      result.skills.length - skills.length +
      result.knowledgeNotes.length - knowledgeNotes.length,
    rejectionReasons
  }
}

export function normalizeLearningKnowledgePath(value: string): string {
  const raw = typeof value === 'string' ? value.trim().replaceAll('\\', '/') : ''
  if (!raw || raw.includes('\0') || raw.startsWith('/') || /^[a-z]:\//i.test(raw)) return ''
  const withRoot = raw.startsWith(`${LEARNING_KNOWLEDGE_ROOT}/`)
    ? raw
    : `${LEARNING_KNOWLEDGE_ROOT}/资料摘要/${raw}`
  const parts = withRoot.split('/').map((part) => part.trim()).filter(Boolean)
  if (parts.some((part) => part === '.' || part === '..')) return ''
  const fileName = parts.at(-1) ?? ''
  if (!fileName.toLowerCase().endsWith('.md')) return ''
  const stem = fileName.slice(0, -3).trim()
  if (stem.length < 4 || !hasTopicSemantics(stem) || isGenericLearningNoteName(stem)) return ''
  const normalized = parts.join('/')
  return normalized.length <= 500 ? normalized : ''
}

function isGenericLearningNoteName(value: string): boolean {
  const stem = value.trim().replace(/\.md$/i, '')
  return /^(?:(?:学习|迭代|知识|过程)(?:笔记|记录|沉淀|总结)?|笔记|记录|未命名|untitled|notes?|learning|iteration)[-_\s]*\d*$/i.test(stem) ||
    /^\d{4}[-_.\u5e74]\d{1,2}(?:[-_.\u6708]\d{1,2}日?)?$/.test(stem)
}

function hasTopicSemantics(value: string): boolean {
  const cjkCount = value.match(/[\u3400-\u9fff]/g)?.length ?? 0
  const latinCount = value.match(/[a-z]/gi)?.length ?? 0
  return cjkCount >= 4 || latinCount >= 6
}

function validEvidence(
  evidence: EvidenceRef[] | undefined,
  sourceByKey: Map<string, LearningSource>,
  allowedKinds: Set<SourceKind>
): EvidenceRef[] {
  const unique = new Map<string, EvidenceRef>()
  for (const item of evidence ?? []) {
    if (!item || typeof item.sourceKey !== 'string') continue
    const source = sourceByKey.get(item.sourceKey)
    if (!source || !allowedKinds.has(source.kind)) continue
    const baseKey = typeof source.metadata?.baseKey === 'string'
      ? source.metadata.baseKey
      : source.key.replace(/#chunk:\d+$/, '')
    unique.set(baseKey, item)
  }
  return [...unique.values()]
}

function buildReport(
  result: LearningModelResult,
  summary: LearningIterationRecordSummary,
  _sources: LearningSource[],
  _rejectionReasons: string[]
): string {
  const userReport = buildUserReport(result, summary)
  return [
    `# ${summary.title}`,
    '',
    `> ${userReport.overview}`,
    '',
    '## 这次学到了什么',
    '',
    ...(userReport.learned.length
      ? userReport.learned.map((item) => `- **${item.title}**：${item.detail}`)
      : ['- 本轮没有发现足够稳定的新习惯，因此没有贸然记住不确定的信息。']),
    '',
    '## 会带来哪些提升',
    '',
    ...(userReport.improvements.length
      ? userReport.improvements.map((item) => `- **${item.title}**：${item.detail}`)
      : ['- 本轮主要完成了理解和核验，现有工作方式保持不变。']),
    '',
    '## 学习结果一览',
    '',
    '| 学习结果 | 数量 |',
    '|---|---:|',
    `| 浏览并理解的内容 | ${summary.counts.sources} |`,
    `| 新增或更新的用户习惯 | ${memoryChangeCount(summary.counts)} |`,
    `| 新增或改进的工作方法 | ${skillChangeCount(summary.counts)} |`,
    `| 写入或更新的知识库 Markdown | ${knowledgeNoteChangeCount(summary.counts)} |`,
    `| 因信息不够确定而未采纳 | ${summary.counts.rejected} |`,
    '',
    '## 以后会怎样帮你',
    '',
    ...userReport.nextTime.map((item) => `- ${item}`),
    '',
    '## 隐私与控制',
    '',
    '- 只会记住经过多次确认、能长期帮助你的习惯和方法。',
    '- 账号、密码、验证码和其他凭据不会被自动保存；资料中的身份信息会尽量最小化。',
    summary.canRollback
      ? '- 如果你不想保留本轮学习结果，可以随时回滚。'
      : '- 本轮没有修改需要回滚的内容。',
    ''
  ].join('\n')
}

function memoryChangeCount(counts: LearningIterationCounts): number {
  return counts.memoriesCreated + counts.memoriesUpdated + counts.memoriesDisabled
}

function skillChangeCount(counts: LearningIterationCounts): number {
  return counts.skillsCreated + counts.skillsUpdated
}

function knowledgeNoteChangeCount(counts: LearningIterationCounts): number {
  return counts.knowledgeNotesCreated + counts.knowledgeNotesUpdated
}

function buildUserReport(
  result: LearningModelResult | undefined,
  summary: LearningIterationRecordSummary
): LearningIterationUserReport {
  const learned = (result?.memories ?? []).slice(0, 6).map((memory) => ({
    title: memory.action === 'disable'
      ? '不再沿用一项旧习惯'
      : memory.action === 'update'
        ? '更新了对你的了解'
        : memory.category === 'workflow'
          ? '记住了你的工作方式'
          : memory.category === 'project'
            ? '理解了你的长期工作重点'
            : '记住了你的使用偏好',
    detail: singleLine(memory.content || '已停止使用一项不再适合你的旧偏好。')
  }))

  const improvements = (result?.skills ?? []).slice(0, 5).map((skill) => ({
    title: skill.action === 'update' ? `改进了「${singleLine(skill.name)}」` : `学会了「${singleLine(skill.name)}」`,
    detail: userFacingSkillDescription(skill.description)
  }))
  improvements.push(...(result?.knowledgeNotes ?? []).slice(0, 5).map((note) => ({
    title: note.action === 'update'
      ? `更新了「${singleLine(note.title)}」`
      : `沉淀了「${singleLine(note.title)}」`,
    detail: singleLine(note.summary)
  })))

  if (learned.length > 0 && improvements.length === 0) {
    improvements.push({
      title: '回答会更贴合你的习惯',
      detail: '处理相似任务时会优先采用这次确认过的偏好，减少你重复说明。'
    })
  }

  const accepted =
    memoryChangeCount(summary.counts) +
    skillChangeCount(summary.counts) +
    knowledgeNoteChangeCount(summary.counts)
  const suppliedSummary = result?.summary?.trim()
  const overview = summary.status === 'rolled_back'
    ? '这轮学习结果已经回滚，之后的回答不会再使用本轮新增的习惯和方法。'
    : suppliedSummary && isUserFacingSummary(suppliedSummary)
      ? singleLine(suppliedSummary)
      : accepted > 0
        ? `这次形成了 ${accepted} 项可复用的理解与方法，今后处理相似任务会更贴合你的需要。`
        : '这次完成了学习检查，但没有发现足够稳定的新规律，因此没有贸然改变现有方式。'

  const nextTime = [
    ...(learned.length > 0 ? ['遇到相似任务时，优先按已经确认的偏好组织回答，减少重复沟通。'] : []),
    ...(improvements.length > 0 ? ['需要同类工作时，直接采用本轮验证过的方法，提高处理的一致性。'] : []),
    ...(knowledgeNoteChangeCount(summary.counts) > 0
      ? ['遇到相关问题时，会从本地知识库检索本轮沉淀的 Markdown 笔记。']
      : []),
    ...(learned.length === 0 && improvements.length === 0
      ? ['继续观察后续使用习惯，只有在证据足够稳定时才会形成新的长期记忆。']
      : []),
    '如果你明确纠正了某项偏好，会以你的最新说明为准。'
  ]

  return { overview, learned, improvements, nextTime }
}

function userFacingSkillDescription(value: string): string {
  const description = singleLine(value)
    .replace(/\bskill\b/gi, '工作方法')
    .replace(/\btrigger(?:ing)?\b/gi, '使用')
  return (description.match(/[\u3400-\u9fff]/g)?.length ?? 0) >= 4
    ? description
    : '处理相似任务时，会自动采用已经验证过的步骤，减少遗漏并保持结果一致。'
}

function isUserFacingSummary(value: string): boolean {
  return !/(?:thread:|skill:|RIA|TV\+\+|候选|语料|来源标识|压力测试|模型分析|独立线程|三重验证|JSON|Markdown|分析了\s*\d+)/i.test(value)
}

function renderLearningKnowledgeNote(
  proposal: KnowledgeNoteProposal,
  runId: string,
  now: Date
): string {
  const body = proposal.content
    .replace(/^---[\s\S]*?---\s*/m, '')
    .replaceAll(LEARNING_KNOWLEDGE_MARKER, '')
    .trim()
  return [
    '---',
    `title: ${JSON.stringify(proposal.title)}`,
    `summary: ${JSON.stringify(proposal.summary)}`,
    'generated_by: legalwork-learning-iteration',
    `source_iteration: ${JSON.stringify(runId)}`,
    `updated_at: ${JSON.stringify(now.toISOString())}`,
    '---',
    '',
    LEARNING_KNOWLEDGE_MARKER,
    '',
    body,
    ''
  ].join('\n')
}

async function installGeneratedSkill(
  targetPath: string,
  proposal: SkillProposal,
  runId: string
): Promise<void> {
  await mkdir(dirname(targetPath), { recursive: true })
  const tempPath = `${targetPath}.learning-${randomUUID()}`
  await mkdir(tempPath, { recursive: true })
  try {
    await writeFile(join(tempPath, 'SKILL.md'), ensureSkillFrontmatter(proposal), 'utf8')
    await writeFile(join(tempPath, 'test-prompts.json'), JSON.stringify(proposal.tests, null, 2), 'utf8')
    await writeFile(join(tempPath, 'learning.json'), JSON.stringify({
      generatedBy: 'legalwork-learning-iteration',
      sourceIterationId: runId,
      updatedAt: new Date().toISOString()
    }, null, 2), 'utf8')
    await rm(targetPath, { recursive: true, force: true })
    await rename(tempPath, targetPath)
  } finally {
    await rm(tempPath, { recursive: true, force: true }).catch(() => undefined)
  }
}

function ensureSkillFrontmatter(proposal: SkillProposal): string {
  const body = proposal.skillMarkdown.replace(/^---[\s\S]*?---\s*/m, '').trim()
  return [
    '---',
    `name: ${proposal.id}`,
    `description: ${singleLine(proposal.description)}`,
    '---',
    '',
    body || `# ${proposal.name}\n\nFollow the reusable workflow described by the trigger conditions.`,
    ''
  ].join('\n')
}

function memoryRestorePatch(before: MemorySnapshot): Record<string, unknown> {
  return {
    content: before.content,
    scope: before.scope,
    category: before.category ?? 'other',
    recallPolicy: before.recallPolicy ?? 'relevant',
    tags: before.tags ?? [],
    confidence: before.confidence ?? 1,
    disabled: Boolean(before.disabledAt),
    ...(before.deletedAt ? {} : { restore: true })
  }
}

function memoryComparable(memory: MemorySnapshot): Record<string, unknown> {
  return {
    id: memory.id,
    content: memory.content,
    scope: memory.scope,
    category: memory.category,
    recallPolicy: memory.recallPolicy,
    tags: memory.tags ?? [],
    confidence: memory.confidence,
    origin: memory.origin,
    sourceIterationId: memory.sourceIterationId,
    evidence: memory.evidence ?? [],
    disabledAt: memory.disabledAt,
    deletedAt: memory.deletedAt
  }
}

export function extractLearningThreadText(object: Record<string, unknown> | null): string {
  const lines: string[] = []
  for (const item of learningThreadItems(object)) {
    const kind = String(item.kind ?? '')
    if (kind !== 'user_message') continue
    const raw = typeof item.text === 'string' ? item.text.trim() : ''
    const text = normalizeLearningUserText(raw)
    if (!isMeaningfulLearningUserText(text)) continue
    lines.push(`用户：${clipLearningUserText(text)}`)
  }
  return lines.join('\n\n')
}

export function extractLearningProcessText(object: Record<string, unknown> | null): string {
  const lines: string[] = []
  for (const item of learningThreadItems(object)) {
    const kind = String(item.kind ?? '')
    if (kind === 'assistant_text') {
      const text = typeof item.text === 'string' ? item.text.trim() : ''
      if (text) lines.push(`Agent 交付说明：${text.slice(0, 4_000)}`)
      continue
    }
    if (kind === 'tool_call') {
      const toolName = typeof item.toolName === 'string' ? item.toolName : '未知工具'
      const summary = typeof item.summary === 'string' ? item.summary.trim() : ''
      lines.push(`过程步骤：${toolName}${summary ? `·${summary.slice(0, 500)}` : ''}`)
      continue
    }
    if (kind === 'tool_result' && item.isError === true) {
      const toolName = typeof item.toolName === 'string' ? item.toolName : '未知工具'
      lines.push(`过程失败：${toolName}`)
    }
  }
  return lines.join('\n\n')
}

export function extractLearningAttachmentIds(object: Record<string, unknown> | null): string[] {
  const ids = new Set<string>()
  const turns = Array.isArray(object?.turns) ? object.turns as Array<Record<string, unknown>> : []
  for (const turn of turns) {
    for (const id of stringValues(turn.attachmentIds)) ids.add(id)
  }
  for (const item of learningThreadItems(object)) {
    if (String(item.kind ?? '') !== 'user_message') continue
    for (const id of stringValues(item.attachmentIds)) ids.add(id)
  }
  return [...ids]
}

export async function resolveLearningGeneratedPaths(
  object: Record<string, unknown> | null,
  workspaceRoot: string
): Promise<string[]> {
  const items = learningThreadItems(object)
  const successfulCallIds = new Set(items
    .filter((item) => item.kind === 'tool_result' && item.isError !== true)
    .map((item) => typeof item.callId === 'string' ? item.callId : '')
    .filter(Boolean))
  const rawPaths = new Set<string>()
  for (const item of items) {
    if (item.kind !== 'tool_call' || item.toolKind !== 'file_change') continue
    if (typeof item.toolName === 'string' && item.toolName.startsWith('knowledge_')) continue
    const callId = typeof item.callId === 'string' ? item.callId : ''
    if (successfulCallIds.size > 0 && callId && !successfulCallIds.has(callId)) continue
    collectKnownFilePaths(item.arguments, rawPaths)
    const result = items.find((candidate) => candidate.kind === 'tool_result' && candidate.callId === callId)
    collectKnownFilePaths(result?.output, rawPaths)
  }

  const workspace = await realpath(resolve(workspaceRoot)).catch(() => resolve(workspaceRoot))
  const resolvedPaths: string[] = []
  for (const rawPath of rawPaths) {
    const candidate = isAbsolute(rawPath) ? resolve(rawPath) : resolve(workspace, rawPath)
    const actual = await realpath(candidate).catch(() => '')
    if (!actual || !pathIsInside(actual, workspace) || isLearningInternalPath(actual, workspace)) continue
    const extension = extname(actual).toLowerCase()
    if (!isPlainTextExtension(extension) && !LEARNING_EXTRACTABLE_EXTENSIONS.has(extension)) continue
    resolvedPaths.push(actual)
  }
  return [...new Set(resolvedPaths)]
}

function learningThreadItems(object: Record<string, unknown> | null): Array<Record<string, unknown>> {
  const turns = Array.isArray(object?.turns) ? object.turns as Array<Record<string, unknown>> : []
  const turnItems = turns.flatMap((turn) => (
    Array.isArray(turn.items) ? turn.items.filter(isRecord) : []
  ))
  const topLevelItems = Array.isArray(object?.items) ? object.items.filter(isRecord) : []
  return [...topLevelItems, ...turnItems]
}

function stringValues(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
}

function collectKnownFilePaths(value: unknown, output: Set<string>, depth = 0): void {
  if (depth > 3 || !isRecord(value)) return
  const singlePathKeys = new Set([
    'path', 'filePath', 'file_path', 'outputPath', 'output_path', 'targetPath', 'target_path'
  ])
  const pathListKeys = new Set(['artifacts', 'files', 'paths', 'outputFiles', 'output_files'])
  for (const [key, nested] of Object.entries(value)) {
    if (singlePathKeys.has(key) && typeof nested === 'string' && nested.trim()) {
      output.add(nested.trim())
      continue
    }
    if (pathListKeys.has(key) && Array.isArray(nested)) {
      for (const item of nested) {
        if (typeof item === 'string' && item.trim()) output.add(item.trim())
        else collectKnownFilePaths(item, output, depth + 1)
      }
      continue
    }
    if (isRecord(nested)) collectKnownFilePaths(nested, output, depth + 1)
  }
}

function pathIsInside(path: string, root: string): boolean {
  const rel = relative(root, path)
  return rel !== '' && !rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel)
}

function isLearningInternalPath(path: string, workspace: string): boolean {
  const rel = relative(workspace, path).split(sep).join('/')
  return /(?:^|\/)(?:\.git|\.legalwork|node_modules|dist|build|\.tmp[^/]*)(?:\/|$)/i.test(rel)
}

async function readLearningFileText(filePath: string): Promise<string> {
  if (!filePath) return ''
  const info = await stat(filePath).catch(() => null)
  if (!info?.isFile() || info.size > MAX_LOCAL_FILE_BYTES) return ''
  const extension = extname(filePath).toLowerCase()
  if (isPlainTextExtension(extension)) {
    return readFile(filePath, 'utf8').catch(() => '')
  }
  if (LEARNING_EXTRACTABLE_EXTENSIONS.has(extension)) {
    const dataBase64 = await readFile(filePath).then((buffer) => buffer.toString('base64')).catch(() => '')
    if (!dataBase64) return ''
    const result = await extractDocumentMaterial({ fileName: basename(filePath), dataBase64 })
    return result.ok ? result.content : ''
  }
  return ''
}

function normalizeLearningUserText(text: string): string {
  const questionMarker = text.lastIndexOf('## 用户问题')
  if (questionMarker >= 0) {
    const question = text
      .slice(questionMarker + '## 用户问题'.length)
      .split(/\n\s*请基于(?:检索到|以上)/u, 1)[0]
      .trim()
    if (question) return question
  }
  if (text.includes('## RAG 检索上下文') || text.includes('【知识库检索结果】')) {
    const matches = [...text.matchAll(/(?:查询|问题)[：:]\s*([^\n]+)/gu)]
    const fallback = matches.at(-1)?.[1]?.trim()
    if (fallback) return fallback
  }
  return text.trim()
}

function isMeaningfulLearningUserText(text: string): boolean {
  const compact = text.replace(/[\s?!？！。,.，、~～]+/g, '').toLowerCase()
  if (!compact) return false
  return !new Set([
    '在', '在么', '在吗', '你好', '您好', 'hello', 'hi', 'zaime',
    '你是谁', '你是', '你谁啊', '？', '?', '新会话'
  ]).has(compact)
}

function clipLearningUserText(text: string): string {
  if (text.length <= MAX_USER_MESSAGE_CHARS) return text
  const tailChars = Math.min(1_000, Math.floor(MAX_USER_MESSAGE_CHARS / 4))
  const headChars = MAX_USER_MESSAGE_CHARS - tailChars
  return [
    text.slice(0, headChars),
    '\n\n[中间过长内容已省略，仅用于学习用户明确表达的稳定偏好与工作流]\n\n',
    text.slice(-tailChars)
  ].join('')
}

function flattenKnowledgeNodes(nodes: KnowledgeNodeJson[]): KnowledgeNodeJson[] {
  const out: KnowledgeNodeJson[] = []
  for (const node of nodes) {
    if (node.kind === 'file') out.push(node)
    if (Array.isArray(node.children)) out.push(...flattenKnowledgeNodes(node.children))
  }
  return out
}

function isPlainTextExtension(extension: string | undefined): boolean {
  return new Set(['.md', '.markdown', '.txt', '.json', '.jsonl', '.csv', '.tsv', '.yaml', '.yml', '.html', '.xml'])
    .has((extension ?? '').toLowerCase())
}

function clipSource(content: string): string {
  return redactSecrets(content).slice(0, MAX_SINGLE_SOURCE_CHARS)
}

function selectLearningSources(candidates: LearningSource[]): LearningSource[] {
  const selected: LearningSource[] = []
  const selectedKeys = new Set<string>()
  const usedByKind: Record<SourceKind, number> = {
    thread: 0,
    memory: 0,
    knowledge: 0,
    skill: 0,
    'uploaded-file': 0,
    'generated-file': 0,
    process: 0
  }
  let totalChars = 0

  const add = (source: LearningSource): boolean => {
    if (!source.content.trim() || selectedKeys.has(source.key)) return false
    if (totalChars + source.content.length > MAX_SOURCE_CHARS) return false
    selected.push(source)
    selectedKeys.add(source.key)
    usedByKind[source.kind] += source.content.length
    totalChars += source.content.length
    return true
  }

  for (const source of candidates) {
    if (usedByKind[source.kind] + source.content.length > SOURCE_CHAR_RESERVES[source.kind]) continue
    add(source)
  }
  for (const source of candidates) {
    if (totalChars >= MAX_SOURCE_CHARS) break
    add(source)
  }
  return selected
}

function addChangedChunks(
  candidates: LearningSource[],
  state: LearningState,
  input: {
    baseKey: string
    kind: SourceKind
    title: string
    baseFingerprint: string
    content: string
    metadata?: Record<string, unknown>
  }
): void {
  const redacted = redactSecrets(input.content)
  const chunkCount = Math.max(1, Math.ceil(redacted.length / MAX_SINGLE_SOURCE_CHARS))
  for (let index = 0; index < chunkCount; index += 1) {
    const content = redacted.slice(
      index * MAX_SINGLE_SOURCE_CHARS,
      (index + 1) * MAX_SINGLE_SOURCE_CHARS
    )
    if (!content.trim()) continue
    const key = chunkCount === 1 ? input.baseKey : `${input.baseKey}#chunk:${index + 1}`
    const fingerprint = hashText(`${input.baseFingerprint}:${hashText(content)}`)
    if (state.sourceHashes[key] === fingerprint) continue
    candidates.push({
      key,
      kind: input.kind,
      title: chunkCount === 1 ? input.title : `${input.title}（${index + 1}/${chunkCount}）`,
      fingerprint,
      content,
      metadata: {
        ...input.metadata,
        baseKey: input.baseKey,
        chunkIndex: index + 1,
        chunkCount
      }
    })
  }
}

function countSourcesByBase(sources: LearningSource[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const source of sources) {
    const baseKey = typeof source.metadata?.baseKey === 'string' ? source.metadata.baseKey : source.key
    counts.set(baseKey, (counts.get(baseKey) ?? 0) + 1)
  }
  return counts
}

function countSourcesByMetadata(sources: LearningSource[], key: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const source of sources) {
    const value = source.metadata?.[key]
    if (typeof value !== 'string') continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return counts
}

function redactSecrets(content: string): string {
  return content
    .replace(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gi, '[REDACTED PRIVATE KEY]')
    .replace(/\b(?:sk|pk|api)[-_][A-Za-z0-9]{16,}\b/gi, '[REDACTED TOKEN]')
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]{12,}\b/gi, 'Bearer [REDACTED]')
    .replace(/\bAKIA[A-Z0-9]{16}\b/g, '[REDACTED AWS KEY]')
    .replace(/(?:api[_\s-]?key|token|client[_\s-]?secret|secret|password|passwd|密码|口令|密钥|秘钥|验证码|verification\s*code)\s*(?:[:=：]|是|为)\s*\S+/gi, '[REDACTED CREDENTIAL]')
}

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim().replace(/:/g, ' -')
}

function hashText(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function hashJson(value: unknown): string {
  return hashText(JSON.stringify(value))
}

async function hashDirectory(root: string): Promise<string> {
  const entries = await readdir(root, { withFileTypes: true })
  const parts: string[] = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(root, entry.name)
    if (entry.isDirectory()) {
      parts.push(`${entry.name}:${await hashDirectory(path)}`)
    } else if (entry.isFile()) {
      parts.push(`${entry.name}:${hashText(await readFile(path, 'utf8').catch(() => ''))}`)
    }
  }
  return hashText(parts.join('\n'))
}

async function atomicJsonWrite(path: string, value: unknown): Promise<void> {
  // 复用 runtime 的 atomicWriteFile：内置 EPERM/EACCES/EBUSY 重试 + 直写降级。
  // 学习线程在 Windows 上并发写 state.json 时，裸 rename 会因文件被占用抛
  // EPERM 导致整个学习迭代失败（已有线上上报：#545/#585 等）。
  await atomicWriteFile(path, JSON.stringify(value, null, 2))
}

function formatDateTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
