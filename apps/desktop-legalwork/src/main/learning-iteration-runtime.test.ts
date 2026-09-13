import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  defaultClawSettings,
  defaultKeyboardShortcuts,
  defaultLearningIterationSettings,
  defaultLegalworkRuntimeSettings,
  defaultModelProviderSettings,
  defaultScheduleSettings,
  defaultWriteSettings,
  type AppSettingsV1
} from '../shared/app-settings'

vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    getAppPath: () => '/tmp/legalwork-learning-test-app',
    getPath: () => '/tmp/legalwork-learning-test-user-data'
  }
}))

vi.mock('./services/skill-service', () => ({
  USER_INSTALLED_SKILL_ROOT: '/tmp/legalwork-learning-test-skills',
  listGuiSkills: vi.fn(async () => ({ ok: true, skills: [], validationErrors: [] })),
  readGuiSkillFile: vi.fn()
}))

import {
  createLearningIterationRuntime,
  extractLearningAttachmentIds,
  extractLearningProcessText,
  extractLearningThreadText,
  learningTurnFailureDetail,
  normalizeLearningKnowledgePath,
  parseLearningModelResult,
  repairLearningModelJson,
  resolveLearningGeneratedPaths,
  shouldReportLearningIterationError
} from './learning-iteration-runtime'

const tempRoots: string[] = []

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
  vi.restoreAllMocks()
})

function settings(dataDir: string): AppSettingsV1 {
  return {
    version: 1,
    locale: 'zh',
    theme: 'system',
    uiFontScale: 'small',
    provider: defaultModelProviderSettings(),
    agents: {
      legalwork: {
        ...defaultLegalworkRuntimeSettings(),
        dataDir
      }
    },
    workspaceRoot: dataDir,
    log: { enabled: false, retentionDays: 2 },
    notifications: { turnComplete: true },
    appBehavior: { openAtLogin: false, startMinimized: false, closeToTray: false },
    keyboardShortcuts: defaultKeyboardShortcuts(),
    write: defaultWriteSettings(),
    claw: defaultClawSettings(),
    schedule: defaultScheduleSettings(),
    learningIteration: {
      ...defaultLearningIterationSettings(),
      idleMinutes: 5
    },
    guiUpdate: { channel: 'stable' }
  }
}

function emptyRuntimeRequest() {
  return vi.fn(async (_settings: AppSettingsV1, path: string) => {
    if (path.startsWith('/v1/threads')) {
      return { ok: true, status: 200, body: JSON.stringify({ threads: [] }) }
    }
    if (path.startsWith('/v1/memory')) {
      return { ok: true, status: 200, body: JSON.stringify({ memories: [] }) }
    }
    if (path === '/v1/knowledge/tree') {
      return { ok: true, status: 200, body: JSON.stringify({ nodes: [] }) }
    }
    return { ok: false, status: 404, body: 'not found' }
  })
}

describe('LearningIterationRuntime scheduling', () => {
  it('does not create an empty report when no source changed', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'legalwork-learning-empty-'))
    tempRoots.push(dataDir)
    const appSettings = settings(dataDir)
    const runtime = createLearningIterationRuntime({
      store: { load: vi.fn(async () => appSettings) } as never,
      runtimeRequest: emptyRuntimeRequest(),
      getSystemIdleSeconds: () => 60 * 60,
      getExternalBusy: async () => false,
      logError: vi.fn()
    })
    runtime.sync(appSettings)
    await vi.waitFor(async () => {
      expect((await runtime.status()).message).toBe('本周期没有可学习的新数据')
    })
    expect((await runtime.list()).ok).toBe(true)
    const list = await runtime.list()
    if (list.ok) expect(list.records).toEqual([])
    runtime.stop()
  })

  it('does not let a manual check bypass a successful local-day quota', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'legalwork-learning-daily-'))
    tempRoots.push(dataDir)
    const now = new Date('2026-07-23T08:00:00.000Z')
    const localDay = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('-')
    const stateRoot = join(dataDir, 'learning-iterations')
    await mkdir(stateRoot, { recursive: true })
    await writeFile(join(stateRoot, 'state.json'), JSON.stringify({
      version: 1,
      sourceHashes: {},
      lastSuccessfulAt: now.toISOString(),
      lastCheckedAt: now.toISOString(),
      lastLocalDay: localDay,
      lastRetryAt: '',
      retryCount: 0,
      baselineComplete: true
    }), 'utf8')
    const appSettings = settings(dataDir)
    const runtime = createLearningIterationRuntime({
      store: { load: vi.fn(async () => appSettings) } as never,
      runtimeRequest: emptyRuntimeRequest(),
      getSystemIdleSeconds: () => 60 * 60,
      getExternalBusy: async () => false,
      logError: vi.fn(),
      now: () => now
    })
    runtime.sync(appSettings)
    await runtime.queue()
    await vi.waitFor(async () => {
      expect((await runtime.status()).message).toBe('今日已有成功记录，请在下一个自然日再检查')
    })
    runtime.stop()
  })

  it('starts a manual check immediately while other tasks are pending', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'legalwork-learning-compliance-busy-'))
    tempRoots.push(dataDir)
    const appSettings = settings(dataDir)
    const runtimeRequest = emptyRuntimeRequest()
    runtimeRequest.mockImplementation(async (_settings: AppSettingsV1, path: string) => {
      if (path === '/data-compliance/tasks') {
        return {
          ok: true,
          status: 200,
          body: JSON.stringify({ items: [{ id: 'compliance-1', status: 'pending' }] })
        }
      }
      if (path.startsWith('/v1/threads')) {
        return { ok: true, status: 200, body: JSON.stringify({ threads: [] }) }
      }
      if (path.startsWith('/v1/memory')) {
        return { ok: true, status: 200, body: JSON.stringify({ memories: [] }) }
      }
      if (path === '/v1/knowledge/tree') {
        return { ok: true, status: 200, body: JSON.stringify({ nodes: [] }) }
      }
      return { ok: false, status: 404, body: 'not found' }
    })
    const getSystemIdleSeconds = vi.fn(() => 0)
    const getExternalBusy = vi.fn(async () => true)
    const runtime = createLearningIterationRuntime({
      store: { load: vi.fn(async () => appSettings) } as never,
      runtimeRequest,
      getSystemIdleSeconds,
      getExternalBusy,
      logError: vi.fn()
    })
    await runtime.queue()
    await vi.waitFor(async () => {
      const status = await runtime.status()
      expect(status.status).not.toBe('waiting')
      expect(status.message).toBe('本周期没有可学习的新数据')
    })
    expect(getSystemIdleSeconds).not.toHaveBeenCalled()
    expect(getExternalBusy).not.toHaveBeenCalled()
    expect(runtimeRequest).not.toHaveBeenCalledWith(
      expect.anything(),
      '/data-compliance/tasks',
      expect.anything()
    )
    runtime.stop()
  })

  it('keeps a transient runtime disconnect queued instead of recording a failed learning iteration', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'legalwork-learning-transient-runtime-'))
    tempRoots.push(dataDir)
    const appSettings = settings(dataDir)
    const runtimeRequest = vi.fn(async (_settings: AppSettingsV1, path: string) => {
      if (path.startsWith('/v1/threads')) {
        return {
          ok: false,
          status: 0,
          body: JSON.stringify({ code: 'fetch_failed', message: 'fetch failed' })
        }
      }
      return { ok: true, status: 200, body: '{}' }
    })
    const logError = vi.fn()
    const runtime = createLearningIterationRuntime({
      store: { load: vi.fn(async () => appSettings) } as never,
      runtimeRequest,
      getSystemIdleSeconds: () => 60 * 60,
      getExternalBusy: async () => false,
      logError
    })

    await runtime.queue()
    await vi.waitFor(async () => {
      const status = await runtime.status()
      expect(status.status).toBe('waiting')
      expect(status.message).toContain('运行时连接暂时中断')
    })
    const records = await runtime.list()
    if (records.ok) expect(records.records).toEqual([])
    expect(logError).not.toHaveBeenCalledWith(
      'learning-iteration',
      expect.stringContaining('fetch failed')
    )
    runtime.stop()
  })
})

describe('LearningIterationRuntime knowledge publishing', () => {
  it('publishes a topic-named Markdown note and rolls it back without touching user files', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'legalwork-learning-knowledge-'))
    tempRoots.push(dataDir)
    const appSettings = settings(dataDir)
    const knowledge = new Map<string, string>()
    const notePath = '学习沉淀/资料摘要/劳动合同解除审查要点.md'
    const modelOutput = JSON.stringify({
      title: '劳动合同解除要点沉淀',
      summary: '已将劳动合同解除的审查要点沉淀到本地知识库。',
      reportMarkdown: '',
      memories: [],
      skills: [],
      knowledgeNotes: [{
        action: 'create',
        path: notePath,
        title: '劳动合同解除审查要点',
        summary: '用于后续快速核对劳动合同解除的合法性与程序。',
        content: `# 劳动合同解除审查要点\n\n${'审查解除事由、证据链、通知程序与补偿计算。'.repeat(10)}`,
        evidence: [{ sourceKey: 'thread:thr_source' }]
      }],
      rejected: []
    })
    const runtimeRequest = vi.fn(async (_settings: AppSettingsV1, path: string, init?: { method?: string; body?: string }) => {
      if (path.startsWith('/v1/threads?')) {
        return {
          ok: true,
          status: 200,
          body: JSON.stringify({
            threads: [{ id: 'thr_source', title: '劳动合同审查', status: 'idle', updatedAt: '2026-09-13T01:00:00.000Z' }]
          })
        }
      }
      if (path === '/v1/threads/thr_source') {
        return {
          ok: true,
          status: 200,
          body: JSON.stringify({
            turns: [{ items: [{ kind: 'user_message', text: '请整理劳动合同解除的审查要点，以后还会用到。' }] }]
          })
        }
      }
      if (path === '/v1/threads' && init?.method === 'POST') {
        return { ok: true, status: 201, body: JSON.stringify({ id: 'thr_learning' }) }
      }
      if (path === '/v1/threads/thr_learning/turns' && init?.method === 'POST') {
        return { ok: true, status: 201, body: JSON.stringify({ turnId: 'turn_learning' }) }
      }
      if (path === '/v1/threads/thr_learning') {
        return {
          ok: true,
          status: 200,
          body: JSON.stringify({
            turns: [{
              id: 'turn_learning',
              status: 'completed',
              items: [{ kind: 'assistant_text', turnId: 'turn_learning', text: modelOutput }]
            }]
          })
        }
      }
      if (path.startsWith('/v1/memory')) {
        return { ok: true, status: 200, body: JSON.stringify({ memories: [] }) }
      }
      if (path === '/v1/knowledge/tree') {
        return { ok: true, status: 200, body: JSON.stringify({ nodes: [] }) }
      }
      if (path.startsWith('/v1/knowledge/file?') && init?.method === 'GET') {
        const requestedPath = new URL(`http://local${path}`).searchParams.get('path') ?? ''
        const content = knowledge.get(requestedPath)
        return content === undefined
          ? { ok: false, status: 404, body: 'not found' }
          : { ok: true, status: 200, body: JSON.stringify({ path: requestedPath, content, encoding: 'utf8' }) }
      }
      if (path === '/v1/knowledge/file' && init?.method === 'POST') {
        const body = JSON.parse(init.body ?? '{}') as { path: string; content: string }
        knowledge.set(body.path, body.content)
        return { ok: true, status: 200, body: JSON.stringify({ path: body.path, sizeBytes: body.content.length }) }
      }
      if (path.startsWith('/v1/knowledge/file?') && init?.method === 'DELETE') {
        const requestedPath = new URL(`http://local${path}`).searchParams.get('path') ?? ''
        knowledge.delete(requestedPath)
        return { ok: true, status: 200, body: JSON.stringify({ path: requestedPath }) }
      }
      if (path === '/v1/knowledge/sync' && init?.method === 'POST') {
        return { ok: true, status: 200, body: '{}' }
      }
      return { ok: false, status: 404, body: 'not found' }
    })
    const runtime = createLearningIterationRuntime({
      store: { load: vi.fn(async () => appSettings) } as never,
      runtimeRequest,
      getSystemIdleSeconds: () => 60 * 60,
      getExternalBusy: async () => false,
      logError: vi.fn()
    })

    await runtime.queue()
    await vi.waitFor(async () => {
      expect((await runtime.status()).message).toBe('学习迭代已完成并自动应用')
    }, { timeout: 5_000 })

    expect(knowledge.get(notePath)).toContain('# 劳动合同解除审查要点')
    expect(knowledge.get(notePath)).toContain('legalwork-learning-artifact')
    const records = await runtime.list()
    expect(records.ok).toBe(true)
    if (!records.ok) return
    expect(records.records[0].counts.knowledgeNotesCreated).toBe(1)

    const rollback = await runtime.rollback(records.records[0].id)
    expect(rollback.ok).toBe(true)
    expect(knowledge.has(notePath)).toBe(false)
    runtime.stop()
  })
})

describe('learning model result parsing', () => {
  it('accepts topic-named Markdown knowledge notes and rejects generic filenames', () => {
    const result = parseLearningModelResult(JSON.stringify({
      title: '劳动合同学习沉淀',
      summary: '形成可检索的主题笔记',
      reportMarkdown: '',
      memories: [],
      skills: [],
      knowledgeNotes: [{
        action: 'create',
        path: '学习沉淀/资料摘要/劳动合同解除审查要点.md',
        title: '劳动合同解除审查要点',
        summary: '用于以后快速检索解除审查的关键步骤',
        content: `# 劳动合同解除审查要点\n\n${'具体审查内容。'.repeat(20)}`,
        evidence: [{ sourceKey: 'thread:thr_1' }]
      }],
      rejected: []
    }))

    expect(result.knowledgeNotes).toHaveLength(1)
    expect(normalizeLearningKnowledgePath('庭前材料核对清单.md')).toBe(
      '学习沉淀/资料摘要/庭前材料核对清单.md'
    )
    expect(normalizeLearningKnowledgePath('学习沉淀/学习笔记2.md')).toBe('')
    expect(normalizeLearningKnowledgePath('迭代记录1.md')).toBe('')
  })

  it('does not upload recoverable model/configuration failures', () => {
    expect(shouldReportLearningIterationError(new Error('Insufficient Balance (HTTP 402)'))).toBe(false)
    expect(shouldReportLearningIterationError(new Error('Memory confidence must be at least 0.8 for automatic capture.'))).toBe(false)
    expect(shouldReportLearningIterationError(new Error('学习结果不是有效 JSON。'))).toBe(false)
    expect(shouldReportLearningIterationError(new Error('Unexpected non-whitespace character after JSON at position 493'))).toBe(false)
    expect(shouldReportLearningIterationError(new Error('fetch failed'))).toBe(false)
    expect(shouldReportLearningIterationError(new Error('Runtime restarted before this turn completed.'))).toBe(false)
    expect(shouldReportLearningIterationError(new Error('Learning iteration failed: The operation was aborted due to timeout'))).toBe(false)
    expect(shouldReportLearningIterationError(new Error('Legalwork did not report ready within 12000ms'))).toBe(true)
  })

  it('repairs unescaped double quotes inside long Markdown string values', () => {
    const response = [
      'BEGIN_LEARNING_RESULT',
      '{',
      '  "title": "法律多源调研工作流",',
      '  "summary": "识别出稳定工作流",',
      '  "reportMarkdown": "# 报告\\\\n\\\\n用户要求"多源调研"，并询问"这个论文讲了什么"。",',
      '  "memories": [],',
      '  "skills": [],',
      '  "rejected": []',
      '}',
      'END_LEARNING_RESULT'
    ].join('\n')

    expect(parseLearningModelResult(response)).toMatchObject({
      title: '法律多源调研工作流',
      reportMarkdown: '# 报告\n\n用户要求"多源调研"，并询问"这个论文讲了什么"。'
    })
  })

  it('repairs raw line breaks and invalid backslash escapes inside strings', () => {
    const invalid = `{
  "title": "测试",
  "summary": "路径 C:\\legal\\quote
第二行",
  "reportMarkdown": "",
  "memories": [],
  "skills": [],
  "rejected": []
}`
    const repaired = repairLearningModelJson(invalid)
    const parsed = JSON.parse(repaired) as { summary: string }

    expect(parsed.summary).toBe('路径 C:\\legal\\quote\n第二行')
  })

  it('accepts the first complete learning JSON object when the model appends duplicate output', () => {
    const first = JSON.stringify({
      title: '第一次有效结果',
      summary: '应保留第一个完整对象',
      reportMarkdown: '',
      memories: [],
      skills: [],
      rejected: []
    })
    const response = [
      'BEGIN_LEARNING_RESULT',
      first,
      '{"title":"重复输出","memories":[],"skills":[],"rejected":[]}',
      'END_LEARNING_RESULT'
    ].join('\n')

    expect(parseLearningModelResult(response)).toMatchObject({
      title: '第一次有效结果',
      summary: '应保留第一个完整对象'
    })
  })

  it('does not alter already valid learning JSON', () => {
    const valid = JSON.stringify({
      title: '测试',
      summary: '用户要求"多源调研"',
      reportMarkdown: '# 报告\n\n内容',
      memories: [],
      skills: [],
      rejected: []
    })

    expect(repairLearningModelJson(valid)).toBe(valid)
    expect(parseLearningModelResult(valid).summary).toBe('用户要求"多源调研"')
  })
})

describe('learningTurnFailureDetail', () => {
  const turnId = 'turn_1'

  it('falls back to the bare status when the turn carries no diagnostic item', () => {
    const detail = {
      id: 'thread_1',
      turns: [{ id: turnId, status: 'failed', items: [{ kind: 'assistant_text', turnId, text: '继续' }] }]
    }
    expect(learningTurnFailureDetail(detail, turnId, 'failed', '')).toBe('学习线程状态异常：failed')
  })

  it('prefers the last error item over other items', () => {
    const detail = {
      id: 'thread_1',
      turns: [{
        id: turnId,
        status: 'failed',
        items: [
          { kind: 'tool_call', turnId, toolName: 'ls', callId: 'c1', toolKind: 'tool_call' },
          { kind: 'tool_result', turnId, toolName: 'ls', callId: 'c1', toolKind: 'tool_call', output: {}, isError: true },
          { kind: 'error', turnId, message: 'query failed: ECONNRESET' }
        ]
      }]
    }
    expect(learningTurnFailureDetail(detail, turnId, 'failed', '')).toBe(
      '学习线程状态异常：failed（query failed: ECONNRESET）'
    )
  })

  it('uses a failed tool result when no error item exists', () => {
    const detail = {
      id: 'thread_1',
      turns: [{
        id: turnId,
        status: 'failed',
        items: [
          { kind: 'tool_result', turnId, toolName: 'ls', callId: 'c1', toolKind: 'tool_call', output: {}, isError: true, detail: 'ENOENT' }
        ]
      }]
    }
    expect(learningTurnFailureDetail(detail, turnId, 'failed', '')).toBe(
      '学习线程状态异常：failed（工具执行失败：ENOENT）'
    )
  })

  it('falls back to the final assistant text when available', () => {
    const detail = {
      id: 'thread_1',
      turns: [{ id: turnId, status: 'failed', items: [{ kind: 'assistant_text', turnId, text: '我准备调用工具' }] }]
    }
    expect(learningTurnFailureDetail(detail, turnId, 'failed', '我准备调用工具')).toBe(
      '学习线程状态异常：failed（最后输出：我准备调用工具）'
    )
  })

  it('truncates overly long diagnostic text', () => {
    const longText = 'x'.repeat(500)
    const result = learningTurnFailureDetail(
      { id: 'thread_1', turns: [{ id: turnId, status: 'failed', items: [{ kind: 'error', turnId, message: longText }] }] },
      turnId,
      'failed',
      ''
    )
    expect(result.length).toBeLessThan('学习线程状态异常：failed（'.length + 200 + 3)
    expect(result).toContain('…')
  })
})

describe('learning outcome report compatibility', () => {
  it('turns a legacy technical report into a plain-language user outcome', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'legalwork-learning-report-'))
    tempRoots.push(dataDir)
    const runId = '2026-07-30-0042-c31dde14'
    const runDir = join(dataDir, 'learning-iterations', 'runs', runId)
    await mkdir(runDir, { recursive: true })
    await writeFile(join(runDir, 'REPORT.md'), '# 模型分析说明\n\nRIA-TV++ 与 thread:abc', 'utf8')
    await writeFile(join(runDir, 'manifest.json'), JSON.stringify({
      version: 1,
      summary: {
        id: runId,
        title: '法律调研与知识库探索行为分析',
        displayName: '2026-07-30 · 法律调研与知识库探索行为分析',
        status: 'completed',
        startedAt: '2026-07-30T00:42:00.000Z',
        finishedAt: '2026-07-30T00:45:00.000Z',
        reportPath: join(runDir, 'REPORT.md'),
        canRollback: true,
        counts: {
          sources: 16,
          threads: 11,
          knowledgeFiles: 2,
          memoriesCreated: 1,
          memoriesUpdated: 0,
          memoriesDisabled: 0,
          skillsCreated: 0,
          skillsUpdated: 0,
          rejected: 3
        }
      },
      sourceHashes: {},
      rollback: { memories: [], skills: [] },
      modelResult: {
        title: '法律调研与知识库探索行为分析',
        summary: '本次迭代分析了 16 个独立线程，并使用 RIA-TV++ 完成三重验证。',
        reportMarkdown: '# 模型分析说明',
        memories: [{
          action: 'create',
          content: '进行法律调研时，偏好同时核对法规、裁判案例与学术资料。',
          category: 'workflow'
        }],
        skills: [],
        rejected: []
      }
    }), 'utf8')

    const runtime = createLearningIterationRuntime({
      store: { load: vi.fn(async () => settings(dataDir)) } as never,
      runtimeRequest: emptyRuntimeRequest(),
      getSystemIdleSeconds: () => 0,
      getExternalBusy: async () => false,
      logError: vi.fn()
    })
    const result = await runtime.get(runId)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.detail.userReport.overview).toBe(
        '这次形成了 1 项可复用的理解与方法，今后处理相似任务会更贴合你的需要。'
      )
      expect(result.detail.userReport.learned).toEqual([{
        title: '记住了你的工作方式',
        detail: '进行法律调研时，偏好同时核对法规、裁判案例与学术资料。'
      }])
      expect(result.detail.reportMarkdown).toContain('RIA-TV++')
    }
    runtime.stop()
  })
})

describe('learning source hygiene', () => {
  it('accepts only successful generated files inside the workspace', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-learning-files-'))
    const outside = await mkdtemp(join(tmpdir(), 'legalwork-learning-outside-'))
    tempRoots.push(workspace, outside)
    const reportPath = join(workspace, '劳动合同审查报告.md')
    const outsidePath = join(outside, '不应采集.md')
    await writeFile(reportPath, '# 劳动合同审查报告', 'utf8')
    await writeFile(outsidePath, '# 不应采集', 'utf8')
    const detail = {
      turns: [{
        items: [
          {
            kind: 'tool_call',
            callId: 'ok',
            toolName: 'write_file',
            toolKind: 'file_change',
            arguments: { path: reportPath }
          },
          {
            kind: 'tool_result',
            callId: 'ok',
            toolName: 'write_file',
            toolKind: 'file_change',
            output: { path: reportPath },
            isError: false
          },
          {
            kind: 'tool_call',
            callId: 'outside',
            toolName: 'write_file',
            toolKind: 'file_change',
            arguments: { path: outsidePath }
          },
          {
            kind: 'tool_result',
            callId: 'outside',
            toolName: 'write_file',
            toolKind: 'file_change',
            output: { path: outsidePath },
            isError: false
          },
          {
            kind: 'tool_call',
            callId: 'failed',
            toolName: 'write_file',
            toolKind: 'file_change',
            arguments: { path: join(workspace, '失败文件.md') }
          },
          {
            kind: 'tool_result',
            callId: 'failed',
            toolName: 'write_file',
            toolKind: 'file_change',
            output: {},
            isError: true
          }
        ]
      }]
    }

    expect(await resolveLearningGeneratedPaths(detail, workspace)).toEqual([await realpath(reportPath)])
  })

  it('collects attachment ids and bounded process knowledge without treating it as user memory evidence', () => {
    const detail = {
      turns: [{
        attachmentIds: ['att_a'],
        items: [
          { kind: 'user_message', text: '请审查这份合同', attachmentIds: ['att_b'] },
          { kind: 'tool_call', toolName: 'write_file', summary: '生成了审查清单' },
          { kind: 'tool_result', toolName: 'write_file', isError: true },
          { kind: 'assistant_text', text: '已交付审查报告。' },
          { kind: 'assistant_reasoning', text: '不应采集的思维链。' }
        ]
      }]
    }

    expect(extractLearningAttachmentIds(detail)).toEqual(['att_a', 'att_b'])
    const process = extractLearningProcessText(detail)
    expect(process).toContain('过程步骤：write_file·生成了审查清单')
    expect(process).toContain('Agent 交付说明：已交付审查报告。')
    expect(process).not.toContain('思维链')
  })

  it('keeps the real knowledge-base question and excludes RAG context and assistant output', () => {
    const detail = {
      turns: [{
        items: [
          {
            kind: 'user_message',
            text: [
              '你是一个专业的法律知识助手。',
              '## RAG 检索上下文',
              '【知识库检索结果】',
              '[files › 实习简历]',
              '这里是大量不应进入学习语料的检索内容',
              '## 用户问题',
              '知识库里有什么？',
              '',
              '请基于检索到的内容给出准确回答。'
            ].join('\n')
          },
          {
            kind: 'assistant_text',
            text: '助手根据检索内容推断出的身份、偏好和履历不得作为用户证据。'
          },
          {
            kind: 'user_message',
            text: '在么'
          }
        ]
      }]
    }

    expect(extractLearningThreadText(detail)).toBe('用户：知识库里有什么？')
  })

  it('does not let a stale learning thread block future iterations', async () => {
    const dataDir = await mkdtemp(join(tmpdir(), 'legalwork-learning-stale-thread-'))
    tempRoots.push(dataDir)
    const appSettings = settings(dataDir)
    const runtimeRequest = emptyRuntimeRequest()
    runtimeRequest.mockImplementation(async (_settings: AppSettingsV1, path: string) => {
      if (path === '/data-compliance/tasks') {
        return { ok: true, status: 200, body: JSON.stringify({ items: [] }) }
      }
      if (path.startsWith('/v1/threads')) {
        return {
          ok: true,
          status: 200,
          body: JSON.stringify({
            threads: [{
              id: 'thr_stale',
              title: '[Learning iteration] stale-run',
              status: 'running'
            }]
          })
        }
      }
      if (path.startsWith('/v1/memory')) {
        return { ok: true, status: 200, body: JSON.stringify({ memories: [] }) }
      }
      if (path === '/v1/knowledge/tree') {
        return { ok: true, status: 200, body: JSON.stringify({ nodes: [] }) }
      }
      return { ok: false, status: 404, body: 'not found' }
    })
    const runtime = createLearningIterationRuntime({
      store: { load: vi.fn(async () => appSettings) } as never,
      runtimeRequest,
      getSystemIdleSeconds: () => 60 * 60,
      getExternalBusy: async () => false,
      logError: vi.fn()
    })

    runtime.sync(appSettings)
    await vi.waitFor(async () => {
      expect((await runtime.status()).message).toBe('本周期没有可学习的新数据')
    })
    runtime.stop()
  })
})
