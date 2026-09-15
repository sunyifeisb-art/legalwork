import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { appendFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { InMemoryEventBus } from '../src/adapters/in-memory-event-bus.js'
import { LocalToolHost, buildDefaultLocalTools } from '../src/adapters/tool/local-tool-host.js'
import { CREATE_PLAN_TOOL_NAME } from '../src/adapters/tool/create-plan-tool.js'
import { GET_GOAL_TOOL_NAME, UPDATE_GOAL_TOOL_NAME } from '../src/adapters/tool/goal-tools.js'
import { FileThreadStore, FileSessionStore } from '../src/adapters/file/index.js'
import { RuntimeEventRecorder } from '../src/services/runtime-event-recorder.js'
import { ContextCompactor } from '../src/loop/context-compactor.js'
import {
  DEFAULT_MAX_AGENT_LOOP_STEPS,
  MAX_AGENT_LOOP_STEPS_ENV,
  MAX_AGENT_LOOP_STEPS_ENV_CAP,
  allowedToolNamesWithGuiStateTools,
  assistantAnnouncesPendingToolWork,
  attachResolvedAttachmentContextToHistory,
  deliveredWordLocationAnswer,
  isBareResearchTopicPrompt,
  attachmentIdsForTurn,
  isContextWindowExceededError,
  knowledgeShellBypassError,
  requestedDocumentArtifacts,
  requestsLocalKnowledgeRetrieval,
  requestsDocumentMutation,
  requestsAcademicCitationVerification,
  resolveMaxAgentLoopSteps,
  isStalledTurnProgress,
  shouldReportToolError,
  shouldHideRetrievalToolFailure,
  skillRoutingPrompt,
  turnProgressSnapshot,
  turnBudgetCompletionToolSpecs
} from '../src/loop/agent-loop.js'
import { resolveModelContextProfile } from '../src/loop/model-context-profile.js'
import {
  buildWebSearchQuery,
  requiresFreshWebSearch,
  requiresWebSearch
} from '../src/loop/fact-verification.js'
import { makeAssistantTextItem, makeToolCallItem, makeToolResultItem, makeUserItem } from '../src/domain/item.js'
import { createThreadRecord } from '../src/domain/thread.js'
import { createImmutablePrefix, setSystemPrompt } from '../src/cache/immutable-prefix.js'
import type { TurnItem } from '../src/contracts/items.js'
import type { ModelRequest, ModelStreamChunk } from '../src/ports/model-client.js'
import type { AttachmentStore } from '../src/attachments/attachment-store.js'
import type { AttachmentMetadata } from '../src/contracts/attachments.js'
import { plainTextToDocxBuffer } from '../src/adapters/tool/plain-text-docx.js'
import {
  bootstrapThread,
  makeFakeModel,
  makeHarness,
  makeSilentModel,
  resolveNextUserInput
} from './loop-test-harness.js'

/** 最小内存 AttachmentStore：写文件返回 localFilePath，供附件文档地图路径使用 */
function makeFakeAttachmentStore(rootDir: string): AttachmentStore {
  const entries = new Map<string, { meta: AttachmentMetadata; data: Buffer; filePath: string }>()
  let seq = 0
  const now = (): string => '2026-06-03T00:00:00.000Z'
  return {
    async create(input) {
      seq += 1
      const id = `att_a1b2c3d4e5f60718293a4b${String(seq).padStart(2, '0')}`
      const ext = input.name.includes('.') ? input.name.slice(input.name.lastIndexOf('.')) : ''
      const filePath = join(rootDir, `att_${seq}${ext}`)
      await writeFile(filePath, input.data)
      const meta: AttachmentMetadata = {
        id,
        name: input.name,
        mimeType: input.mimeType ?? 'application/octet-stream',
        byteSize: input.data.length,
        hash: `fake-hash-${seq}`,
        threadIds: input.threadId ? [input.threadId] : [],
        workspaces: input.workspace ? [input.workspace] : [],
        createdAt: now(),
        updatedAt: now()
      }
      entries.set(id, { meta, data: input.data, filePath })
      return meta
    },
    async get(id) {
      return entries.get(id)?.meta ?? null
    },
    async resolveContent(id) {
      const entry = entries.get(id)
      if (!entry) throw new Error(`attachment not found: ${id}`)
      return { ...entry.meta, data: entry.data, localFilePath: entry.filePath }
    },
    textFallbackPolicy() {
      return {
        textFallbackMaxBase64Bytes: 1_000_000,
        textFallbackMaxImageDimension: 4096,
        textFallbackPreferredMimeType: 'image/png'
      }
    },
    async diagnostics() {
      return {
        enabled: true,
        rootDir,
        count: entries.size,
        totalBytes: [...entries.values()].reduce((acc, entry) => acc + entry.data.length, 0)
      }
    }
  }
}

describe('AgentLoop', () => {
  it('distinguishes document creation requests from formatting questions', () => {
    expect(requestsDocumentMutation('写一篇文献综述 Word 给我')).toBe(true)
    expect(requestsDocumentMutation('把这份 .docx 按论文格式排版')).toBe(true)
    expect(requestsDocumentMutation('请问可以帮我生成一份 Word 吗？')).toBe(true)
    expect(requestsDocumentMutation('如何设置 Word 的页边距？')).toBe(false)
    expect(requestsDocumentMutation('为什么 Word 正文通常使用宋体？')).toBe(false)
    expect(requestsDocumentMutation('Word 文档有哪些常用格式？')).toBe(false)
    expect(requestsDocumentMutation('读取这个 Word，只告诉我主标题，不要生成新文件。')).toBe(false)
    expect(requestsDocumentMutation('分析附件内容，不用导出 PDF。')).toBe(false)
    expect(requestsDocumentMutation('修改这个 Word，但不要另外生成 PDF。')).toBe(true)
    expect(requestsDocumentMutation(
      '读取这个 Word，只告诉我主标题，不要生成新文件。当前追问：根据这个 Word 重新生成一份总结 Word。'
    )).toBe(true)
    expect(requestsDocumentMutation('修订')).toBe(true)
    expect(requestsDocumentMutation('把这篇文章按新框架重构，并补充最新文献')).toBe(true)
    expect(requestsDocumentMutation('我他妈让你扩充论文而已')).toBe(true)
    expect(requestsDocumentMutation('把这篇稿件续写并增补案例')).toBe(true)
  })

  it('tracks every explicitly requested deliverable format', () => {
    const request = '请完成研究并交付 Word、PDF、PPT 三份完整文件'
    expect(requestedDocumentArtifacts(request)).toEqual(['docx', 'pdf', 'pptx'])
    expect(requestedDocumentArtifacts('请生成一份研究报告')).toEqual([])
    expect(requestedDocumentArtifacts(
      '<inline_document_response>请撰写意见书，模板原来用于 DOCX。</inline_document_response>'
    )).toEqual([])
    expect(requestsLocalKnowledgeRetrieval('先检索本地知识库，再生成报告')).toBe(true)
    expect(requestsLocalKnowledgeRetrieval(
      '查一下食药犯罪中的宽严相济案例。后续要求：撰写这篇论文。当前追问：文献应该尽可能参考多的'
    )).toBe(true)
  })

  it('does not turn an ordinary report bibliography into a forced citation-verification loop', () => {
    expect(requestsAcademicCitationVerification(
      '请撰写算法行政研究报告，正文不少于15000字，附参考文献不少于20条，并交付 Word、PDF、PPT。'
    )).toBe(false)
    expect(requestsAcademicCitationVerification(
      '请撰写算法行政文献综述，正文引用需标注出处，并附参考文献。'
    )).toBe(true)
    expect(requestsAcademicCitationVerification(
      '请生成研究报告，并逐条核验正文引用与参考文献来源。'
    )).toBe(true)
    expect(requestsAcademicCitationVerification(
      '查一下食药犯罪中的宽严相济案例。后续要求：撰写这篇论文。当前追问：文献应该尽可能参考多的。'
    )).toBe(true)
  })

  it('does not force citation verification when expanding an existing paper', () => {
    expect(requestsAcademicCitationVerification(
      '请把上传的论文复制一份，生成新的word文档，在新的副本上扩充论文内容，新增引用用GFM真脚注。'
    )).toBe(false)
    expect(requestsAcademicCitationVerification(
      '帮我扩充下论文内容，复制一份生成新的word，在新的基础上改'
    )).toBe(false)
    // 明确要求核验引用的扩充任务仍应触发
    expect(requestsAcademicCitationVerification(
      '请扩充这篇论文，并把新增引注逐条核验来源'
    )).toBe(true)
  })

  it('does not treat a bare academic title as authorization for paid research', () => {
    expect(isBareResearchTopicPrompt('行政程序与人工智能的媾和')).toBe(true)
    expect(isBareResearchTopicPrompt('自动化/半自动化行政行为的程序要件如何重构')).toBe(false)
    expect(isBareResearchTopicPrompt('检索知识库')).toBe(false)
    expect(isBareResearchTopicPrompt('写一篇文献综述word')).toBe(false)
    expect(isBareResearchTopicPrompt('我他妈让你扩充论文而已')).toBe(false)
    expect(isBareResearchTopicPrompt('你他妈倒是干活啊')).toBe(false)
    expect(isBareResearchTopicPrompt('这个案子的具体内容')).toBe(false)
  })

  it('does not treat a document-operation prompt as a bare research topic', () => {
    // 文档生成/整理类 prompt 必须保留 document_skill_execute 工具，
    // 不能被“裸研究话题”逻辑收窄成空工具列表（否则模型想调工具却没有工具）。
    expect(isBareResearchTopicPrompt('把上传文档里所有引注整理到一个word文档里')).toBe(false)
    expect(isBareResearchTopicPrompt('整理引注到word')).toBe(false)
    expect(isBareResearchTopicPrompt('把这个文档排版一下')).toBe(false)
    expect(isBareResearchTopicPrompt('把附件整理成docx文件')).toBe(false)
  })

  it('inherits the previous substantive Skill context for terse follow-ups', () => {
    const items: TurnItem[] = [
      makeUserItem({
        id: 'u_word',
        turnId: 'turn_word',
        threadId: 'thr_1',
        text: '写一篇文献综述word'
      }),
      makeUserItem({
        id: 'u_question',
        turnId: 'turn_question',
        threadId: 'thr_1',
        text: '？'
      })
    ]

    expect(skillRoutingPrompt('？', items, 'turn_question')).toContain('写一篇文献综述word')
    expect(skillRoutingPrompt('重新分析合同', items, 'turn_new')).toBe('重新分析合同')
    expect(skillRoutingPrompt('把本文所有引注都整理到word里', items, 'turn_citations'))
      .toContain('写一篇文献综述word')
  })

  it('keeps every uploaded attachment available for every later turn in the thread', () => {
    const items: TurnItem[] = [
      makeUserItem({
        id: 'u_file',
        turnId: 'turn_file',
        threadId: 'thr_1',
        text: '修复这个 Word',
        attachmentIds: ['att_word']
      }),
      makeUserItem({
        id: 'u_followup',
        turnId: 'turn_followup',
        threadId: 'thr_1',
        text: '出了什么问题？'
      })
    ]

    expect(attachmentIdsForTurn({
      prompt: '出了什么问题？',
      turnId: 'turn_followup',
      items
    })).toEqual(['att_word'])
    expect(attachmentIdsForTurn({
      prompt: '重新分析另一个案件',
      turnId: 'turn_new_topic',
      items
    })).toEqual(['att_word'])
    expect(attachmentIdsForTurn({
      prompt: '当前消息',
      turnId: 'turn_current',
      turnAttachmentIds: ['att_current', 'att_current'],
      items
    })).toEqual(['att_word', 'att_current'])
    expect(attachmentIdsForTurn({
      prompt: '扩充这篇论文并生成新的 Word',
      turnId: 'turn_expand',
      items
    })).toEqual(['att_word'])
    expect(attachmentIdsForTurn({
      prompt: '脱敏',
      turnId: 'turn_redact',
      items
    })).toEqual(['att_word'])
    expect(attachmentIdsForTurn({
      prompt: '审核呀',
      turnId: 'turn_review',
      items
    })).toEqual(['att_word'])
    expect(attachmentIdsForTurn({
      prompt: '脱敏啊！',
      turnId: 'turn_redact_particle',
      items
    })).toEqual(['att_word'])
    expect(attachmentIdsForTurn({
      prompt: '你他妈倒是干活啊',
      turnId: 'turn_resume',
      items
    })).toEqual(['att_word'])
    expect(attachmentIdsForTurn({
      prompt: '任意后续消息',
      turnId: 'turn_after_multiple_uploads',
      items: [
        ...items,
        makeUserItem({
          id: 'u_pdf',
          turnId: 'turn_pdf',
          threadId: 'thr_1',
          text: '再补充一份材料',
          attachmentIds: ['att_pdf']
        })
      ]
    })).toEqual(['att_word', 'att_pdf'])
  })

  it('appends new attachment context without rewriting an earlier user-message prefix', () => {
    const first = makeUserItem({
      id: 'u_a',
      turnId: 'turn_a',
      threadId: 'thr_1',
      text: '审查 A',
      attachmentIds: ['att_a']
    })
    const second = makeUserItem({
      id: 'u_b',
      turnId: 'turn_b',
      threadId: 'thr_1',
      text: '审查 B',
      attachmentIds: ['att_b']
    })
    const reference = (id: string) => ({
      id,
      name: `${id}.txt`,
      mimeType: 'text/plain',
      localFilePath: `/tmp/${id}.txt`
    })
    const withA = attachResolvedAttachmentContextToHistory([first], {
      fileReferences: [reference('att_a')],
      documentMaps: [],
      ocrResults: []
    })
    const withAB = attachResolvedAttachmentContextToHistory([first, second], {
      fileReferences: [reference('att_a'), reference('att_b')],
      documentMaps: [],
      ocrResults: []
    })

    expect(withAB[0]).toEqual(withA[0])
    expect(withAB[0]?.kind === 'user_message' ? withAB[0].text : '').not.toContain('att_b')
    expect(withAB[1]?.kind === 'user_message' ? withAB[1].text : '').toContain('att_b')
  })

  it('detects assistant prose that announces unfinished tool work', () => {
    expect(assistantAnnouncesPendingToolWork('我按现有规则重新生成一份干净的脱敏版。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('开始。先读原文。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork(`${'分析。'.repeat(1_000)}开始。先读原文。`)).toBe(true)
    expect(assistantAnnouncesPendingToolWork('文件已生成并验证通过。')).toBe(false)
  })

  it('detects common spoken Chinese verification announcements (strike-loop repro)', () => {
    // "罢工"复现：agent 说"我这就检查"后回合被提前终止，从未发出核对工具调用。
    expect(assistantAnnouncesPendingToolWork('我这就检查:')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('我这就确认一下:稍等，我实际检查一下文件夹内容确认结果:')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('让我检查一下这个文件夹')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('稍等，我先确认一下文件夹内容')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('我来验证一下输出文件是否存在')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('我去检查一下桌面文件夹')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('查一下最新法考政策动态。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('现在去把详细报道抓出来。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('我先联网核实最新考纲内容，再给你完整梳理。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('查看过程记录文件与原稿完整标题结构，确认重组方案：')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('补充检索国家库宽严相济意见记录。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('直接用脚本生成 JSONL 文件（避免手工转义错误）。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('表格被 CSV 解析拆分成了多余行，正文编号重复。先合并表格单元格内容、删除多余行，再修正正文编号文本。')).toBe(true)
    expect(assistantAnnouncesPendingToolWork('平台可能先给高价、验机后压价，务必先确认验机标准，并检查屏幕和电池。')).toBe(false)
    expect(assistantAnnouncesPendingToolWork('购买前先检查电池，再确认屏幕和序列号。')).toBe(false)
    expect(assistantAnnouncesPendingToolWork('检查结果如下：文件内容完整，编号连续。')).toBe(false)
    expect(assistantAnnouncesPendingToolWork('建议直接用脚本生成 JSONL 文件，避免手工转义错误。')).toBe(false)
    // 不误伤已经完成事实陈述的普通回答
    expect(assistantAnnouncesPendingToolWork('文件已经生成好了，放在桌面的执行和解协议文件夹里。')).toBe(false)
    expect(assistantAnnouncesPendingToolWork('已核对无误，文件夹内容与交付一致。')).toBe(false)
  })

  it('answers a follow-up location question by reusing the delivered DOCX path', () => {
    const docxResult = makeToolResultItem({
      id: 'item_tool_result_1',
      turnId: 'turn_1',
      threadId: 'thread_1',
      callId: 'call_1',
      toolName: 'document_skill_execute',
      output: {
        status: 'ok',
        operation: 'from-markdown',
        kind: 'docx',
        output: 'C:\\Users\\lenoo\\Desktop\\执行和解协议.docx'
      }
    })
    // "放在哪了"追问直接复用上一回合交付路径，不再触发目录核对
    expect(deliveredWordLocationAnswer([docxResult], '放在哪了')).toContain('执行和解协议.docx')
    expect(deliveredWordLocationAnswer([docxResult], '文件在哪，我找不到')).toContain('执行和解协议.docx')
    // 非位置追问不应短路
    expect(deliveredWordLocationAnswer([docxResult], '帮我修改一下这个文档')).toBeUndefined()
    // "随便放哪都行"是授权自选位置，不是追问路径
    expect(deliveredWordLocationAnswer([docxResult], '重新生成一个，随便放哪都行')).toBeUndefined()
    // 失败/inspect 的交付不应被当作已交付
    const failedResult = makeToolResultItem({
      id: 'item_tool_result_2',
      turnId: 'turn_1',
      threadId: 'thread_1',
      callId: 'call_2',
      toolName: 'document_skill_execute',
      isError: true,
      output: { status: 'error', operation: 'from-markdown', kind: 'docx', output: '' }
    })
    expect(deliveredWordLocationAnswer([failedResult], '放在哪了')).toBeUndefined()
  })

  it('keeps completion tools while removing research tools at budget wrap-up', () => {
    const tools = [
      { name: 'web_search' },
      { name: 'mcp_ima_research' },
      { name: 'read' },
      { name: 'bash' },
      { name: 'data_compliance' },
      { name: 'document_skill_execute' }
    ]
    expect(turnBudgetCompletionToolSpecs(tools).map((tool) => tool.name)).toEqual([
      'data_compliance',
      'document_skill_execute'
    ])
  })

  it('keeps the original legal topic across referential artifact follow-ups', () => {
    const messages = [
      ['u1', 'turn_1', '查一下食药领域犯罪里，宽严相济刑事政策贯彻的案例，越多越好。'],
      ['u2', 'turn_2', '宽严相济刑事政策贯彻，核心'],
      ['u3', 'turn_3', '我纯纯想知道有没有该领域的案例，里面体现了宽严相济的刑事政策'],
      ['u4', 'turn_4', '把这几个案例主要内容导出来做成excel'],
      ['u5', 'turn_5', '他妈的原文呢？？'],
      ['u6', 'turn_6', '撰写这篇论文']
    ] as const
    const items: TurnItem[] = messages.map(([id, turnId, text]) => makeUserItem({
      id,
      turnId,
      threadId: 'thr_topic',
      text
    }))

    const routed = skillRoutingPrompt('文献应该尽可能参考多的', items, 'turn_7')
    expect(routed).toContain('食药领域犯罪')
    expect(routed).toContain('宽严相济刑事政策贯彻')
    expect(routed).toContain('撰写这篇论文')
    expect(routed).toContain('文献应该尽可能参考多的')
    expect(routed).not.toContain('他妈的原文呢')
  })

  it('keeps a concrete task even when the user expresses it angrily', () => {
    const items: TurnItem[] = [
      makeUserItem({
        id: 'u_expand',
        turnId: 'turn_expand',
        threadId: 'thr_angry',
        text: '我他妈让你扩充论文而已'
      })
    ]
    expect(skillRoutingPrompt('怎么不动了', items, 'turn_followup'))
      .toContain('扩充论文')
  })

  it('blocks shell scripts that bulk-parse the managed knowledge PDF store', () => {
    const blocked = knowledgeShellBypassError({
      callId: 'bulk-pdf',
      toolName: 'bash',
      arguments: {
        command: "python3 -c \"import glob,fitz; [fitz.open(p) for p in glob.glob('/Users/me/.legalwork/legalwork/knowledge/files/**/*.pdf', recursive=True)]\""
      }
    })
    expect(blocked).toContain('knowledge_search')
    expect(knowledgeShellBypassError({
      callId: 'single-attachment',
      toolName: 'bash',
      arguments: { command: "pdftotext '/tmp/attachment.pdf' -" }
    })).toBeUndefined()
  })

  it('resolves a configurable agent loop step limit', () => {
    expect(resolveMaxAgentLoopSteps({} as NodeJS.ProcessEnv)).toBe(DEFAULT_MAX_AGENT_LOOP_STEPS)
    expect(resolveMaxAgentLoopSteps({ [MAX_AGENT_LOOP_STEPS_ENV]: '1024' } as NodeJS.ProcessEnv)).toBe(1024)
    expect(resolveMaxAgentLoopSteps({ [MAX_AGENT_LOOP_STEPS_ENV]: '0' } as NodeJS.ProcessEnv))
      .toBe(DEFAULT_MAX_AGENT_LOOP_STEPS)
    expect(resolveMaxAgentLoopSteps({ [MAX_AGENT_LOOP_STEPS_ENV]: '999999' } as NodeJS.ProcessEnv))
      .toBe(MAX_AGENT_LOOP_STEPS_ENV_CAP)
  })

  it('distinguishes a stalled threshold window from a complex turn making tool progress', () => {
    const items: TurnItem[] = [
      makeToolCallItem({
        id: 'call-item',
        turnId: 'turn-progress',
        threadId: 'thread-progress',
        callId: 'call-1',
        toolName: 'read',
        arguments: { path: 'brief.txt' }
      }),
      makeToolResultItem({
        id: 'result-item',
        turnId: 'turn-progress',
        threadId: 'thread-progress',
        callId: 'call-1',
        toolName: 'read',
        output: { text: 'evidence' }
      })
    ]
    const current = turnProgressSnapshot(items, 'turn-progress')

    expect(current).toEqual({ toolCalls: 1, successfulToolResults: 1 })
    expect(isStalledTurnProgress({ toolCalls: 0, successfulToolResults: 0 }, current)).toBe(false)
    expect(isStalledTurnProgress(current, current)).toBe(true)
  })

  it('does not upload recoverable model tool-policy misses as product incidents', () => {
    expect(shouldReportToolError('read', {
      error: 'tool read is not advertised by active tool policy'
    })).toBe(false)
    expect(shouldReportToolError('mcp_search', {
      error: 'tool mcp_search is not advertised in this turn context'
    })).toBe(false)
    expect(shouldReportToolError('web_fetch', { error: 'HTTP 503' })).toBe(false)
    expect(shouldReportToolError('web_search', {
      error: { code: 'search_failed', message: 'provider returned no results' }
    })).toBe(false)
    expect(shouldReportToolError('mcp_pkulaw_law_keyword_get_law_list', {
      error: '90001 remaining points exhausted'
    })).toBe(false)
    expect(shouldReportToolError('document_skill_execute', {
      error: 'expected .doc, .xls, or .ppt input, got .txt'
    })).toBe(false)
    expect(shouldReportToolError('mcp_node_repl_js', { error: 'native pipe startup failed' })).toBe(false)
    expect(shouldReportToolError('read', { error: "ENOENT: no such file or directory, stat '/missing'" })).toBe(false)
    expect(shouldReportToolError('ls', { error: 'permission denied while listing: /secret' })).toBe(false)
    expect(shouldReportToolError('read', { error: "EACCES: permission denied, open '/secret/brief.md'" })).toBe(false)
    expect(shouldReportToolError('update_goal', {
      error: 'cannot update goal because this thread does not have a goal'
    })).toBe(false)
    expect(shouldReportToolError('create_goal', {
      error: 'cannot create a new goal because this thread already has a goal'
    })).toBe(false)
    expect(shouldReportToolError('mcp_yuandian_case_search', {
      error: 'MCP arguments do not match the schema'
    })).toBe(false)
    expect(shouldReportToolError('edit', {
      error: 'read-before-edit guard blocked edit for brief.md. Read the current file contents in this turn.'
    })).toBe(false)
    expect(shouldReportToolError('bash', {
      error: 'bash session expired or the runtime restarted; rerun the original command with action="run"',
      code: 'bash_session_not_found'
    })).toBe(false)
  })

  it('keeps required web tools advertised through a restrictive Skill allowlist', () => {
    const allowed = allowedToolNamesWithGuiStateTools(
      ['read'],
      false,
      '帮我网上搜索一下最新规定',
      ['restrictive-test-skill']
    )

    expect(allowed).toEqual(expect.arrayContaining(['read', 'web_search', 'web_fetch']))
    expect(shouldHideRetrievalToolFailure('web_search')).toBe(true)
    expect(shouldHideRetrievalToolFailure('web_fetch')).toBe(true)
    expect(shouldHideRetrievalToolFailure('read')).toBe(false)
  })

  it('keeps create_plan advertised through a restrictive Skill allowlist in Plan mode', () => {
    const allowed = allowedToolNamesWithGuiStateTools(
      ['bash', 'write', 'document_skill_execute'],
      false,
      '为案件材料制定审查计划',
      ['ocr-extraction', 'litigation-prep'],
      undefined,
      '案件审查计划',
      true
    )

    expect(allowed).toContain(CREATE_PLAN_TOOL_NAME)
  })

  it('builds a bounded search query without routed follow-up control text', () => {
    const prompt = [
      '2026年法考报名政策和考试时间',
      '',
      '后续要求：不执行，并总结这个报告有什么作用',
      '',
      '当前追问：全部删去吧'
    ].join('\n')

    expect(buildWebSearchQuery(prompt)).toBe('2026年法考报名政策和考试时间')
    expect(buildWebSearchQuery(`最新政策 ${'很长'.repeat(200)}`).length).toBeLessThanOrEqual(240)
  })

  it('falls back to a bounded visible notice at the loop step limit', async () => {
    const previous = process.env[MAX_AGENT_LOOP_STEPS_ENV]
    process.env[MAX_AGENT_LOOP_STEPS_ENV] = '2'
    try {
      let calls = 0
      const h = makeHarness({
        provider: 'step-limit-fallback',
        model: 'step-limit-fallback',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          yield {
            kind: 'tool_call_complete',
            callId: `call_step_limit_${calls}`,
            toolName: 'ls',
            arguments: { path: '.' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
        }
      }, { tools: buildDefaultLocalTools(), toolStorm: { enabled: false } })
      await bootstrapThread(h)

      expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
      const items = await h.sessionStore.loadItems(h.threadId)
      const visibleText = items
        .filter((item) => item.kind === 'assistant_text')
        .map((item) => item.text)
        .join('\n')
      expect(visibleText).toContain('已停止继续调用工具')
    } finally {
      if (previous === undefined) delete process.env[MAX_AGENT_LOOP_STEPS_ENV]
      else process.env[MAX_AGENT_LOOP_STEPS_ENV] = previous
    }
  })

  it('finishes a silent model run as completed', async () => {
    const h = makeHarness(makeSilentModel())
    await bootstrapThread(h)
    const status = await h.loop.runTurn(h.threadId, h.turnId)
    expect(status).toBe('completed')
    expect(h.inflight.size()).toBe(0)
  })

  it('injects the current shell runtime when bash is available', async () => {
    let observedRequest: ModelRequest | null = null
    const h = makeHarness({
      provider: 'shell-context',
      model: 'shell-context',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        observedRequest = request
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h)

    await h.loop.runTurn(h.threadId, h.turnId)

    const request = observedRequest as ModelRequest | null
    if (!request) throw new Error('expected model request')
    expect(request.tools.map((tool) => tool.name)).toContain('bash')
    expect(request.prefixInstructions?.join('\n')).toContain('Shell runtime:')
    expect(request.prefixInstructions?.join('\n')).toContain('shell commands appropriate for the host platform')
  })

  it('injects the primary legal research source instruction when configured', async () => {
    let observedRequest: ModelRequest | null = null
    const h = makeHarness({
      provider: 'primary-source',
      model: 'primary-source',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        observedRequest = request
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { primaryLegalSource: 'pkulaw' })
    await bootstrapThread(h, { title: '法律调研:测试' })
    await h.loop.runTurn(h.threadId, h.turnId)

    const request = observedRequest as ModelRequest | null
    if (!request) throw new Error('expected model request')
    const instructions = request.prefixInstructions?.join('\n') ?? ''
    expect(instructions).toContain('北大法宝(PKULaw)')
    expect(instructions).toContain('元典(Yuandian)')
    expect(instructions).toContain('优先使用')
  })

  it('does not inject the primary source instruction when unset', async () => {
    let observedRequest: ModelRequest | null = null
    const h = makeHarness({
      provider: 'no-primary-source',
      model: 'no-primary-source',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        observedRequest = request
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h)
    await h.loop.runTurn(h.threadId, h.turnId)

    const request = observedRequest as ModelRequest | null
    if (!request) throw new Error('expected model request')
    const instructions = request.contextInstructions?.join('\n') ?? ''
    expect(instructions).not.toContain('首要来源')
  })

  it('injects a compact document map instead of full attachment text (map default)', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'legalwork-map-'))
    try {
      const store = makeFakeAttachmentStore(dir)
      const judgment = [
        '第 1 页',
        '民 事 判 决 书',
        '（2025）内25民终813号',
        '上诉人（原审原告）：河南联洋建筑工程有限公司。',
        '事实和理由：',
        '一、关于利息，双方合同第八条明确约定付款时间。',
        '二、关于 343, 350 元款项，该笔款项并非蓝尚宝公司收取。',
        ...Array.from({ length: 60 }, (_, i) => `双方就第 ${i + 3} 项争议进行了充分举证质证，一审法院对此予以查明。`),
        '本院认为：',
        '本案争议焦点为利息计算标准。',
        '判决如下：',
        '一、驳回上诉，维持原判。',
        '第 2 页'
      ].join('\n')
      const attachment = await store.create({
        name: '判决书.docx',
        data: plainTextToDocxBuffer(judgment, { title: '判决书' }),
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        threadId: 'thr_map',
        workspace: '/tmp/ws'
      })
      let observedRequest: ModelRequest | null = null
      const h = makeHarness({
        provider: 'map-test',
        model: 'map-test',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          observedRequest = request
          yield { kind: 'completed', stopReason: 'stop' }
        }
      }, { attachmentStore: store })
      await bootstrapThread(h, {
        workspace: '/tmp/ws',
        request: { prompt: '请分析这份判决书', attachmentIds: [attachment.id], model: 'map-test' }
      })
      await h.loop.runTurn(h.threadId, h.turnId)

      const request = observedRequest as ModelRequest | null
      if (!request) throw new Error('expected model request')
      const attachmentHistory = request.history
        .flatMap((item) => item.kind === 'user_message'
          ? [item.text]
          : item.kind === 'compaction'
            ? [item.summary]
            : [])
        .join('\n')
      expect(request.prefixInstructions?.join('\n') ?? '').not.toContain('<uploaded_document_map>')
      expect(attachmentHistory).toContain('<uploaded_document_map>')
      expect(attachmentHistory).toContain('结构索引')
      expect(attachmentHistory).not.toContain('<uploaded_document_text>')
      expect(attachmentHistory).not.toContain('--- DOCUMENT BEGIN')
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  it('restores full-text injection under LEGALWORK_ATTACHMENT_READ_STRATEGY=full', async () => {
    const previous = process.env.LEGALWORK_ATTACHMENT_READ_STRATEGY
    process.env.LEGALWORK_ATTACHMENT_READ_STRATEGY = 'full'
    const dir = await mkdtemp(join(tmpdir(), 'legalwork-full-'))
    try {
      const store = makeFakeAttachmentStore(dir)
      const judgment = '民 事 判 决 书\n（2025）内25民终813号\n上诉人（原审原告）：河南联洋建筑工程有限公司。\n判决如下：\n一、驳回上诉，维持原判。'
      const attachment = await store.create({
        name: '判决书.docx',
        data: plainTextToDocxBuffer(judgment, { title: '判决书' }),
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        threadId: 'thr_full',
        workspace: '/tmp/ws'
      })
      let observedRequest: ModelRequest | null = null
      const h = makeHarness({
        provider: 'full-test',
        model: 'full-test',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          observedRequest = request
          yield { kind: 'completed', stopReason: 'stop' }
        }
      }, { attachmentStore: store })
      await bootstrapThread(h, {
        workspace: '/tmp/ws',
        request: { prompt: '请分析这份判决书', attachmentIds: [attachment.id], model: 'full-test' }
      })
      await h.loop.runTurn(h.threadId, h.turnId)

      const request = observedRequest as ModelRequest | null
      if (!request) throw new Error('expected model request')
      const attachmentHistory = request.history
        .flatMap((item) => item.kind === 'user_message'
          ? [item.text]
          : item.kind === 'compaction'
            ? [item.summary]
            : [])
        .join('\n')
      expect(request.prefixInstructions?.join('\n') ?? '').not.toContain('<uploaded_document_text>')
      expect(attachmentHistory).toContain('<uploaded_document_text>')
      expect(attachmentHistory).toContain('--- DOCUMENT BEGIN')
      expect(attachmentHistory).not.toContain('<uploaded_document_map>')
    } finally {
      await rm(dir, { recursive: true, force: true })
      if (previous === undefined) delete process.env.LEGALWORK_ATTACHMENT_READ_STRATEGY
      else process.env.LEGALWORK_ATTACHMENT_READ_STRATEGY = previous
    }
  })

  it('does not force knowledge retrieval on learning-iteration threads', async () => {
    const executed: string[] = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('knowledge_auto_retrieve', async () => {
        executed.push('knowledge_auto_retrieve')
        return { output: { sources: [], contextText: '' } }
      }),
      define('knowledge_search', async () => {
        executed.push('knowledge_search')
        return { output: { sources: [] } }
      })
    ]
    const corpus = [
      '# 用户交互语料',
      '用户提到了知识库检索和来源核验，并研究多源法律依据。',
      '材料来源：thread:xxx，包含引用与文献。'
    ].join('\n')
    const prompt = [
      'Use $legalwork-learning-iteration to analyze the bounded corpus below.',
      'Do not call any tools — analyze the corpus purely in text.',
      'Return exactly one JSON object between the marker lines.',
      'BEGIN_LEARNING_RESULT',
      '{}',
      'END_LEARNING_RESULT',
      corpus
    ].join('\n')
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'learning-iteration',
      model: 'learning-iteration',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        yield {
          kind: 'assistant_text_delta',
          text: '本轮学习检查已完成。这次完成了学习检查，但没有发现足够稳定的新规律。'
        }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools })
    await bootstrapThread(h, { request: { prompt } })
    await h.threadStore.upsert(
      createThreadRecord({
        id: h.threadId,
        title: '[Learning iteration] 2026-08-12-0002-test',
        workspace: '/tmp',
        model: 'fake'
      })
    )

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed).toEqual([])
    expect(requests).toHaveLength(1)
    expect(requests[0]?.requiredToolName).toBeUndefined()
    expect(requests[0]?.tools ?? []).toHaveLength(0)
  })

  it('records elapsed seconds for active goals after a turn finishes', async () => {
    let nowMs = 1_000
    const h = makeHarness(
      {
        provider: 'goal-timer',
        model: 'goal-timer',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          nowMs = 4_700
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { nowMs: () => nowMs }
    )
    await bootstrapThread(h)
    await h.threads.setGoal(h.threadId, { objective: 'ship the feature' })

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const goal = await h.threads.getGoal(h.threadId)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)

    expect(status).toBe('completed')
    expect(goal?.timeUsedSeconds).toBe(3)
    expect(events.some((event) =>
      event.kind === 'goal_updated' && event.goal?.timeUsedSeconds === 3
    )).toBe(true)
  })

  it('includes the failure reason on turn_failed events', async () => {
    const h = makeHarness({
      provider: 'throwing',
      model: 'throwing',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        const chunks: ModelStreamChunk[] = []
        for (const chunk of chunks) yield chunk
        throw new Error('model stream exploded')
      }
    })
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    const failed = events.find((event) => event.kind === 'turn_failed')

    expect(status).toBe('failed')
    expect(failed).toMatchObject({
      kind: 'turn_failed',
      message: 'model stream exploded'
    })
  })

  it('fails the turn when the model stream yields an error chunk', async () => {
    const h = makeHarness({
      provider: 'error-chunk',
      model: 'error-chunk',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        yield { kind: 'error', message: 'model request failed with status 400', code: 'http_400' }
      }
    })
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)

    expect(status).toBe('failed')
    expect(events.some((event) =>
      event.kind === 'error' &&
      event.message === 'model request failed with status 400' &&
      event.code === 'http_400'
    )).toBe(true)
    expect(events.some((event) => event.kind === 'turn_failed')).toBe(true)
  })

  it('preserves partial model text when the stream ends with an error chunk', async () => {
    const h = makeHarness({
      provider: 'partial-error-chunk',
      model: 'partial-error-chunk',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        yield { kind: 'assistant_text_delta', text: '这是已经生成的可交付正文。' }
        yield { kind: 'error', message: 'connection reset after response', code: 'stream_reset' }
      }
    })
    await bootstrapThread(h)

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    const items = await h.sessionStore.loadItems(h.threadId)
    expect(items.some((item) =>
      item.kind === 'assistant_text' && item.text === '这是已经生成的可交付正文。'
    )).toBe(true)
  })

  it('emits named pipeline lifecycle stages for a model request', async () => {
    const h = makeHarness(makeSilentModel())
    await bootstrapThread(h)

    await h.loop.runTurn(h.threadId, h.turnId)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    const stages = events
      .filter((event) => event.kind === 'pipeline_stage')
      .map((event) => event.kind === 'pipeline_stage' ? event.stage : '')

    expect(stages).toEqual([
      'setup',
      'pre_start',
      'post_start',
      'input_received',
      'input_cached',
      'input_routed',
      'input_compressed',
      'input_remembered',
      'pre_send',
      'post_send',
      'response_received'
    ])
  })

  it('aborts the turn when the abort signal fires', async () => {
    const h = makeHarness({
      provider: 'blocker',
      model: 'blocker',
      async *stream({ abortSignal }): AsyncIterable<ModelStreamChunk> {
        await new Promise<void>((resolve) => {
          if (abortSignal.aborted) return resolve()
          abortSignal.addEventListener('abort', () => resolve(), { once: true })
        })
        yield { kind: 'error', message: 'aborted' }
      }
    })
    await bootstrapThread(h)
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 5)
    h.turns['inflightTurns'].set(h.turnId, controller)
    const status = await h.loop.runTurn(h.threadId, h.turnId)
    expect(status === 'aborted' || status === 'failed').toBe(true)
    expect(h.inflight.size()).toBe(0)
  })

  it('can discard generated items when interrupting a foreground turn', async () => {
    const h = makeHarness(makeSilentModel())
    await bootstrapThread(h)
    await h.turns.applyItem(
      h.threadId,
      makeAssistantTextItem({
        id: 'partial_answer',
        turnId: h.turnId,
        threadId: h.threadId,
        text: 'partial',
        status: 'running'
      })
    )

    await h.turns.interruptTurn({ threadId: h.threadId, turnId: h.turnId, discard: true })
    const sessionItems = await h.sessionStore.loadItems(h.threadId)
    const thread = await h.threadStore.get(h.threadId)
    const turnItems = thread?.turns.find((turn) => turn.id === h.turnId)?.items ?? []

    expect(sessionItems.filter((item) => item.turnId === h.turnId).map((item) => item.kind))
      .toEqual(['user_message'])
    expect(turnItems.map((item) => item.kind)).toEqual(['user_message'])
  })

  it('runs a tool call and surfaces its result item', async () => {
    let calls = 0
    const h = makeHarness({
      provider: 'fake',
      model: 'fake',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        calls += 1
        if (calls === 1) {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_echo',
            toolName: 'echo',
            arguments: { text: 'hi' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h)
    const status = await h.loop.runTurn(h.threadId, h.turnId)
    expect(status).toBe('completed')
    const items = await h.sessionStore.loadItems(h.threadId)
    const result = items.find((item) => item.kind === 'tool_result')
    expect(result).toBeDefined()
    if (result?.kind === 'tool_result') {
      expect(result.toolName).toBe('echo')
    }
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    expect(events.some((event) => event.kind === 'tool_call_ready' && event.readyCount === 1)).toBe(true)
    expect(events.some((event) =>
      event.kind === 'tool_result_upload_wait' && event.toolResultCount === 1
    )).toBe(true)
    const thread = await h.threadStore.get(h.threadId)
    const toolCall = thread?.turns
      .flatMap((turn) => turn.items)
      .find((item) => item.kind === 'tool_call' && item.callId === 'call_echo')
    expect(toolCall).toMatchObject({ kind: 'tool_call', status: 'completed' })
  })

  it('finishes a Word-only delivery from the successful tool result without a second model request', async () => {
    let modelCalls = 0
    const documentTool = LocalToolHost.defineTool({
      name: 'document_skill_execute',
      description: 'Generate Word documents',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      async execute() {
        return {
          output: {
            status: 'ok',
            kind: 'docx',
            operation: 'from-markdown',
            output: '/tmp/律师审核意见.docx'
          }
        }
      }
    })
    const h = makeHarness({
      provider: 'word-delivery-fast-finish',
      model: 'word-delivery-fast-finish',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        modelCalls += 1
        expect(request.requiredToolName).toBe('document_skill_execute')
        yield {
          kind: 'tool_call_complete',
          callId: 'call_word_delivery',
          toolName: 'document_skill_execute',
          arguments: { kind: 'docx', operation: 'from-markdown' }
        }
        yield { kind: 'completed', stopReason: 'tool_calls' }
      }
    }, { tools: [documentTool] })
    await bootstrapThread(h, {
      request: { prompt: '审核合同并在 Word 里提出修改建议' }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(modelCalls).toBe(1)
    expect(items.at(-1)).toMatchObject({
      kind: 'assistant_text',
      text: 'Word 文档已生成：\n\n/tmp/律师审核意见.docx',
      status: 'completed'
    })
  })

  it('continues when the model announces pending work but stops before calling the tool', async () => {
    let calls = 0
    const h = makeHarness({
      provider: 'unfinished-announcement',
      model: 'unfinished-announcement',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        calls += 1
        if (calls === 1) {
          yield { kind: 'assistant_text_delta', text: '我先联网核实最新考纲内容，再给你完整梳理。' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        if (calls === 2) {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_echo_after_announcement',
            toolName: 'echo',
            arguments: { text: 'done' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '处理已完成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(calls).toBe(3)
    expect(items.some((item) => item.kind === 'tool_result' && item.toolName === 'echo')).toBe(true)
  })

  it('does not replace a substantive answer when ordinary advice contains repeated 先 phrases', async () => {
    let calls = 0
    const answer = [
      '以下是 iPad Pro 二手行情完整汇总。',
      '平台可能先给高价、验机后压价，务必先确认验机标准，并检查屏幕和电池。',
      '购买前还应核对序列号、容量、成色和维修记录。'
    ].join('\n\n')
    const h = makeHarness({
      provider: 'completed-advice-with-first-phrases',
      model: 'completed-advice-with-first-phrases',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        calls += 1
        yield { kind: 'assistant_text_delta', text: answer }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h, { request: { prompt: 'ipadpro二手价格' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(calls).toBe(1)
    const items = await h.sessionStore.loadItems(h.threadId)
    expect(items.filter((item) => item.kind === 'assistant_text')).toHaveLength(1)
    expect(items.some((item) => item.kind === 'assistant_text' && item.text === answer)).toBe(true)
  })

  it('keeps the visible partial response after bounded repeated work announcements', async () => {
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'repeated-unfinished-announcement',
      model: 'repeated-unfinished-announcement',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        yield { kind: 'assistant_text_delta', text: '接下来我会调用工具并完成正文。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h)

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(requests).toHaveLength(3)
    expect(requests[1]?.contextInstructions?.join('\n')).toContain('不要再预告步骤')
  })

  it('removes research tools after the cumulative turn input budget is exhausted', async () => {
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'budget-guard',
      model: 'budget-guard',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        if (requests.length === 1) {
          yield {
            kind: 'usage',
            usage: {
              promptTokens: 100,
              completionTokens: 1,
              totalTokens: 101,
              cachedTokens: 0,
              cacheHitTokens: 0,
              cacheMissTokens: 100,
              cacheHitRate: 0,
              turns: 1
            }
          }
          yield {
            kind: 'tool_call_complete',
            callId: 'call_echo',
            toolName: 'echo',
            arguments: { text: 'one last search' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { turnTokenBudget: 50 })
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(requests).toHaveLength(2)
    expect(requests[0]?.tools.map((tool) => tool.name)).toContain('echo')
    // 预算耗尽后研究、读取和 shell 工具都被移除，防止模型把
    // “收尾”解释成新一轮调查；文档交付等有界工具仍可用。
    expect(requests[1]?.tools.map((tool) => tool.name)).not.toContain('echo')
    expect(requests[1]?.tools.map((tool) => tool.name)).not.toContain('read')
    expect(requests[1]?.contextInstructions?.join('\n')).toContain('成本预算提醒')
  })

  it('keeps IMA research advisory for knowledge-heavy legal work when the model skips the tool', async () => {
    const requests: ModelRequest[] = []
    let executions = 0
    const imaResearchTool = LocalToolHost.defineTool({
      name: 'mcp_ima_knowledge_base_research_ima',
      description: 'Automatically route and research IMA knowledge bases.',
      inputSchema: {
        type: 'object',
        properties: { question: { type: 'string' } },
        required: ['question']
      },
      policy: 'auto',
      execute: async (args) => {
        executions += 1
        return { output: { answer: 'IMA 返回了可用于分析劳动合同解除风险的知识库证据。', question: args.question } }
      }
    })
    const h = makeHarness(
      {
        provider: 'ima-route',
        model: 'ima-route',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          requests.push(request)
          yield { kind: 'assistant_text_delta', text: '已结合 IMA 回答。' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [imaResearchTool] }
    )
    const question = '请分析企业解除劳动合同的合规风险和法律依据'
    await bootstrapThread(h, { request: { prompt: question } })

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(executions).toBe(0)
    expect(requests).toHaveLength(1)
    expect(requests[0]?.requiredToolName).toBeUndefined()
    expect(requests[0]?.contextInstructions?.join('\n') ?? '').not.toContain('<ima_auto_route>')
    expect(requests[0]?.history.some((item) =>
      item.kind === 'tool_result' && item.toolName === 'mcp_ima_knowledge_base_research_ima'
    )).toBe(false)
    expect(items.some((item) =>
      item.kind === 'tool_result' &&
      item.toolName === 'mcp_ima_knowledge_base_research_ima' &&
      item.isError !== true
    )).toBe(false)
  })

  it('does not force IMA discovery and calls in progressive MCP mode', async () => {
    const executed: Array<{ name: string; args: Record<string, unknown> }> = []
    const mcpSearch = LocalToolHost.defineTool({
      name: 'mcp_search',
      description: 'Search MCP catalog.',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async (args) => {
        executed.push({ name: 'mcp_search', args })
        return {
          output: {
            results: [{ toolId: 'ima-knowledge-base/research_ima' }]
          }
        }
      }
    })
    const mcpCall = LocalToolHost.defineTool({
      name: 'mcp_call',
      description: 'Call MCP tool.',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async (args) => {
        executed.push({ name: 'mcp_call', args })
        return {
          output: {
            serverId: 'ima-knowledge-base',
            toolName: 'research_ima',
            result: 'IMA 返回了可用于研究人工智能生成内容监管的知识库证据。'
          }
        }
      }
    })
    let requests = 0
    const h = makeHarness(
      {
        provider: 'ima-progressive-route',
        model: 'ima-progressive-route',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          requests += 1
          yield { kind: 'assistant_text_delta', text: '已使用渐进发现的 IMA 工具。' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [mcpSearch, mcpCall] }
    )
    const question = '请研究人工智能生成内容的法律监管问题'
    await bootstrapThread(h, { request: { prompt: question } })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(requests).toBe(1)
    expect(executed).toEqual([])
  })

  it('lets the model answer without a forced progressive IMA call', async () => {
    const executed: string[] = []
    const mcpSearch = LocalToolHost.defineTool({
      name: 'mcp_search',
      description: 'Search MCP catalog.',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => {
        executed.push('mcp_search')
        return {
          output: {
            results: [{ toolId: 'ima-knowledge-base/research_ima' }]
          }
        }
      }
    })
    const mcpCall = LocalToolHost.defineTool({
      name: 'mcp_call',
      description: 'Call MCP tool.',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => {
        executed.push('mcp_call')
        return {
          output: { error: 'MCP error -32001: Request timed out' },
          isError: true
        }
      }
    })
    const requests: ModelRequest[] = []
    const h = makeHarness(
      {
        provider: 'ima-progressive-failure',
        model: 'ima-progressive-failure',
        async *stream(request): AsyncIterable<ModelStreamChunk> {
          requests.push(request)
          yield { kind: 'assistant_text_delta', text: 'IMA 超时，已基于现有材料继续。' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [mcpSearch, mcpCall] }
    )
    await bootstrapThread(h, {
      request: { prompt: '请研究人工智能生成内容的法律监管问题' }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed).toEqual([])
    expect(requests).toHaveLength(1)
    expect(requests[0]?.history.some((item) =>
      item.kind === 'tool_result' &&
      item.toolName === 'mcp_call' &&
      item.isError === true
    )).toBe(false)
  })

  it('completes every requested file format without forced research gates', async () => {
    const executed: Array<{ name: string; args: Record<string, unknown> }> = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('knowledge_auto_retrieve', async (args) => {
        executed.push({ name: 'knowledge_auto_retrieve', args })
        return {
          output: {
            sources: [{ path: '行政处罚法研究.pdf' }],
            contextText: '本地知识库文献指出，自动化行政处罚仍需满足法定程序、说明理由与责任可追溯要求。'
          }
        }
      }),
      define('mcp_search', async (args) => {
        executed.push({ name: 'mcp_search', args })
        return { output: { results: [{ toolId: 'ima-knowledge-base/research_ima' }] } }
      }),
      define('mcp_call', async (args) => {
        executed.push({ name: 'mcp_call', args })
        return {
          output: {
            serverId: 'ima-knowledge-base',
            toolName: 'research_ima',
            result: 'IMA 返回了自动化行政处罚责任界定的相关论文观点与来源证据。'
          }
        }
      }),
      define('document_skill_execute', async (args) => {
        executed.push({ name: 'document_skill_execute', args })
        const kind = String(args.kind ?? '')
        const operation = String(args.operation ?? '')
        return {
          output: {
            status: 'ok',
            kind,
            operation,
            output: `/tmp/report.${kind}`
          }
        }
      }),
      define('bash', async (args) => {
        executed.push({ name: 'bash', args })
        return {
          output: {
            exit_code: 0,
            output: JSON.stringify({
              status: 'ok',
              operation: 'export',
              engine: 'open-kimi-ppt',
              exporter: 'local-python-pptx',
              styleValidated: true,
              scenario: 'academic-research',
              slides: 16,
              bytes: 72_000,
              output: '/tmp/report.pptx'
            })
          }
        }
      })
    ]
    let callIndex = 0
    const twentyReferences = [
      '自动化行政处罚责任界定研究正文。',
      '# 参考文献',
      ...Array.from({ length: 20 }, (_, index) =>
        `[${index + 1}] 作者${index + 1}. 自动化行政处罚研究${index + 1}[J]. 法学期刊, ${2000 + index}.`
      )
    ].join('\n')
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'compound-delivery',
      model: 'compound-delivery',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        if (request.requiredToolName === 'knowledge_auto_retrieve') {
          yield {
            kind: 'tool_call_complete',
            callId: `call_compound_${++callIndex}`,
            toolName: 'knowledge_auto_retrieve',
            arguments: { question: '自动化行政处罚责任界定' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (request.requiredToolName === 'document_skill_execute') {
          const progress = request.contextInstructions?.join('\n') ?? ''
          const kind = progress.includes('本步仍需生成：DOCX')
            ? 'docx'
            : 'pdf'
          const operation = kind === 'docx'
            ? 'from-markdown'
            : 'from-docx'
          yield {
            kind: 'tool_call_complete',
            callId: `call_compound_${++callIndex}`,
            toolName: 'document_skill_execute',
            arguments: {
              kind,
              operation,
              ...(kind === 'docx' ? { content: twentyReferences } : {})
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (request.requiredToolName === 'bash') {
          yield {
            kind: 'tool_call_complete',
            callId: `call_compound_${++callIndex}`,
            toolName: 'bash',
            arguments: {
              command: 'python3 /opt/legalwork/skills/open-kimi-ppt/scripts/skill_runner.py export /tmp/report/deck.pptd --scenario academic-research --output /tmp/report.pptx'
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '三份文件均已生成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools,
      skillRuntime: {
        resolveTurn: () => ({
          activeSkillIds: ['open-kimi-ppt'],
          activations: [],
          instructions: ['Use the unified open-kimi-ppt skill_runner.py workflow.'],
          injectedBytes: 100
        })
      } as never
    })
    await bootstrapThread(h, {
      request: {
        prompt: '请先检索本地知识库，再检索 IMA，研究自动化行政处罚责任界定，报告附参考文献不少于20条，并交付 Word、PDF、PPT 三份完整文件。'
      }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const documentKinds = executed
      .filter((entry) => entry.name === 'document_skill_execute')
      .map((entry) => entry.args.kind)

    expect(status).toBe('completed')
    expect(executed.map((entry) => entry.name)).toEqual([
      'document_skill_execute',
      'document_skill_execute',
      'bash'
    ])
    expect(documentKinds).toEqual(['docx', 'pdf'])
    expect(requests.at(-1)?.requiredToolName).toBeUndefined()
  })

  it('answers renderer-grounded knowledge QA without forcing a second retrieval tool', async () => {
    const requests: ModelRequest[] = []
    let skillResolutionCalls = 0
    const knowledgeTool = LocalToolHost.defineTool({
      name: 'knowledge_auto_retrieve',
      description: 'retrieve local knowledge',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => ({ output: { sources: [], contextText: '' } })
    })
    const documentTool = LocalToolHost.defineTool({
      name: 'document_skill_execute',
      description: 'generate a document',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => ({ output: '/tmp/should-not-be-created.docx' })
    })
    const h = makeHarness({
      provider: 'knowledge-direct-answer',
      model: 'knowledge-direct-answer',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        yield { kind: 'assistant_text_delta', text: '知识库中共有十二个文件。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools: [knowledgeTool, documentTool],
      skillRuntime: {
        resolveTurn: () => {
          skillResolutionCalls += 1
          return {
            activeSkillIds: ['legal-document-formatting'],
            activations: [],
            instructions: ['Call document_skill_execute and generate a Word file.'],
            injectedBytes: 64
          }
        }
      } as never
    })
    await h.threadStore.upsert(createThreadRecord({
      id: h.threadId,
      title: '知识库全局对话 · 有什么文件',
      workspace: '/tmp',
      model: 'fake'
    }))
    const { turnId } = await h.turns.startTurn({
      threadId: h.threadId,
      request: {
        prompt: '请基于以下从知识库中检索到的相关内容回答：知识库有什么文件？\n\nRAG 检索上下文：来源包括《互联网平台企业涉税信息报送规定.pdf》，正文提到生成 Word 报告。'
      }
    })

    const status = await h.loop.runTurn(h.threadId, turnId)

    expect(status).toBe('completed')
    expect(skillResolutionCalls).toBe(0)
    expect(requests).toHaveLength(1)
    expect(requests[0]?.tools).toEqual([])
    expect(requests[0]?.requiredToolName).toBeUndefined()
    expect(requests[0]?.contextInstructions?.join('\n') ?? '').not.toContain('document_skill_execute')
  })

  it('does not force local retrieval or block the model response when evidence is unavailable', async () => {
    const executed: string[] = []
    const define = (
      name: string,
      output: unknown
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => {
        executed.push(name)
        return { output }
      }
    })
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'local-evidence-barrier',
      model: 'local-evidence-barrier',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        if (request.requiredToolName === 'knowledge_auto_retrieve') {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_local_auto_empty',
            toolName: 'knowledge_auto_retrieve',
            arguments: { query: '行政法研究' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (request.requiredToolName === 'knowledge_search') {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_local_search_empty',
            toolName: 'knowledge_search',
            arguments: { query: '行政法研究' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '本地知识库没有返回可用证据，未生成文件。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools: [
        define('knowledge_auto_retrieve', { sources: [], contextText: '' }),
        define('knowledge_search', { sources: [] }),
        define('document_skill_execute', { status: 'ok', output: '/tmp/should-not-exist.docx' })
      ]
    })
    await bootstrapThread(h, {
      request: { prompt: '请先检索本地知识库，再生成 Word 报告。' }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed).toEqual([])
    expect(requests.at(-1)?.contextInstructions?.join('\n') ?? '').not.toContain('知识库证据门禁未通过')
  })

  it('generates an explicitly requested Word file without forcing research or citation verification', async () => {
    const executed: string[] = []
    const requests: ModelRequest[] = []
    const define = (
      name: string,
      output: unknown
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => {
        executed.push(name)
        return { output }
      }
    })
    let callIndex = 0
    const h = makeHarness({
      provider: 'citation-evidence-barrier',
      model: 'citation-evidence-barrier',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        const required = request.requiredToolName
        if (required) {
          yield {
            kind: 'tool_call_complete',
            callId: `call_citation_gate_${++callIndex}`,
            toolName: required,
            arguments: required === 'knowledge_citation_verify'
              ? { draft: '正文引用[1]\n参考文献\n[1] 张三. 算法行政研究[J]. 法学研究, 2025.' }
              : required === 'document_skill_execute'
                ? {
                    kind: 'docx',
                    operation: 'from-markdown',
                    content: '正文引用[1]\n参考文献\n[1] 张三. 算法行政研究[J]. 法学研究, 2025.'
                  }
                : { query: '算法行政 文献综述' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '已基于核验来源生成综述。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools: [
        define('knowledge_auto_retrieve', {
          sources: [{ path: '算法行政研究.pdf' }],
          contextText: '本地论文系统讨论了算法行政的权力属性、正当程序、透明度与司法审查问题。'
        }),
        define('mcp_ima_knowledge_base_research_ima', {
          answer: 'IMA 返回了算法行政、自动化行政行为和算法正当程序方面的论文与来源证据。'
        }),
        define('knowledge_citation_verify', { verificationPassed: true }),
        define('document_skill_execute', {
          status: 'ok',
          kind: 'docx',
          operation: 'from-markdown',
          output: '/tmp/verified-review.docx'
        })
      ]
    })
    await bootstrapThread(h, {
      request: {
        prompt: '请先检索本地知识库和 IMA，撰写算法行政文献综述并生成 Word，引用需标注出处。'
      }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed).toEqual(['document_skill_execute'])
    expect(requests[0]?.contextInstructions?.join('\n')).toContain('只能把用户明确提供')
    expect(requests[0]?.contextInstructions?.join('\n')).toContain('不得自行补写用户未提供的案件事实')
  })

  it('does not inject forced retrieval batches when the model answers directly', async () => {
    const executed: string[] = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const h = makeHarness({
      provider: 'forced-retrieval-cardinality',
      model: 'forced-retrieval-cardinality',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        if (request.requiredToolName === 'knowledge_auto_retrieve') {
          for (const suffix of ['主检索', '模型擅自追加检索']) {
            yield {
              kind: 'tool_call_complete',
              callId: `call_auto_${suffix}`,
              toolName: 'knowledge_auto_retrieve',
              arguments: { query: suffix }
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (request.requiredToolName === 'knowledge_read_file') {
          for (let index = 1; index <= 5; index += 1) {
            yield {
              kind: 'tool_call_complete',
              callId: `call_pdf_${index}`,
              toolName: 'knowledge_read_file',
              arguments: { path: `论文${index}.pdf` }
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '检索与三篇 PDF 阅读完成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools: [
        define('knowledge_auto_retrieve', async (args) => {
          executed.push(`auto:${String(args.query)}`)
          return {
            output: {
              sources: [{ path: '论文1.pdf' }, { path: '论文2.pdf' }, { path: '论文3.pdf' }],
              contextText: '知识库返回了足够长的算法行政论文证据，可供后续逐篇研读与综合回答。'
            }
          }
        }),
        define('knowledge_read_file', async (args) => {
          executed.push(`read:${String(args.path)}`)
          return {
            output: {
              path: args.path,
              content: `这是 ${String(args.path)} 的有效正文内容，包含算法行政的规范分析和程序保障。`
            }
          }
        })
      ]
    })
    await bootstrapThread(h, {
      request: { prompt: '请检索本地知识库并执行 OCR，提取至少 3 篇 PDF 的正文，然后回答。' }
    })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(executed).toEqual([])
  })

  it('enforces a complex report contract before citation verification and Word/PDF delivery', async () => {
    const executed: string[] = []
    const documentInputs: Record<string, unknown>[] = []
    const fullDraft = [
      '# 一、问题的提出',
      '# 二、规范体系',
      '脱敏处理采用去标识化、替换直接标识符并保留受控主体映射。',
      '典型案例包括（2019）鲁13行终415号与（2021）京01行终88号。',
      '完整论证内容。'.repeat(140),
      '# 参考文献',
      '[1] 本地知识库论文一。'
    ].join('\n')
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('knowledge_auto_retrieve', async (args) => {
        executed.push('knowledge_auto_retrieve')
        if (String(args.query).includes('典型案例')) {
          return {
            output: {
              sources: [
                { path: '案例/行政处罚案例一.md' },
                { path: '案例/行政处罚案例二.md' }
              ],
              contextText: '案例材料包含（2019）鲁13行终415号与（2021）京01行终88号的法院、裁判要旨和争议焦点。'
            }
          }
        }
        return {
          output: {
            sources: [
              { path: '论文一.pdf' },
              { path: '论文二.pdf' },
              { path: '论文三.pdf' }
            ],
            contextText: '本地知识库返回了数字行政、自动化决策、算法治理与非现场监管论文的正文证据。'
          }
        }
      }),
      define('knowledge_read_file', async (args) => {
        executed.push(`knowledge_read_file:${String(args.path)}`)
        return {
          output: {
            path: args.path,
            content: `这是 ${String(args.path)} 经提取/OCR 后的完整论证摘要，包含规范基础、程序控制与责任分配。`
          }
        }
      }),
      define('data_compliance', async () => {
        executed.push('data_compliance')
        return {
          output: {
            status: 'completed',
            product_type: 'desensitize',
            message: '脱敏完成'
          }
        }
      }),
      define('knowledge_citation_verify', async () => {
        executed.push('knowledge_citation_verify')
        return { output: { verificationPassed: true } }
      }),
      define('document_skill_execute', async (args) => {
        documentInputs.push(args)
        const kind = String(args.kind)
        executed.push(`document_skill_execute:${kind}`)
        return {
          output: {
            status: 'ok',
            kind,
            operation: args.operation,
            output: kind === 'docx'
              ? '/tmp/数字行政法体系建构研究报告.docx'
              : '/tmp/数字行政法体系建构研究报告.pdf'
          }
        }
      })
    ]
    let callIndex = 0
    let citationAttempts = 0
    let readAttempts = 0
    let modelDocxRequests = 0
    const h = makeHarness({
      provider: 'complex-contract-regression',
      model: 'complex-contract-regression',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        const required = request.requiredToolName
        if (required === 'knowledge_auto_retrieve') {
          yield {
            kind: 'tool_call_complete',
            callId: `call_complex_${++callIndex}`,
            toolName: required,
            arguments: { query: '数字行政 算法治理 非现场监管' }
          }
        } else if (required === 'knowledge_read_file') {
          const nextPath = ['论文一.pdf', '论文二.pdf', '论文三.pdf'][readAttempts] ?? '论文三.pdf'
          readAttempts += 1
          yield {
            kind: 'tool_call_complete',
            callId: `call_complex_${++callIndex}`,
            toolName: required,
            arguments: { path: nextPath }
          }
        } else if (required === 'data_compliance') {
          yield {
            kind: 'tool_call_complete',
            callId: `call_complex_${++callIndex}`,
            toolName: required,
            arguments: {
              action: 'desensitize',
              mode: 'text',
              text: '张某，身份证号 110101199001011234，手机号 13800138000。'
            }
          }
        } else if (required === 'knowledge_citation_verify') {
          citationAttempts += 1
          yield {
            kind: 'tool_call_complete',
            callId: `call_complex_${++callIndex}`,
            toolName: required,
            arguments: { draft: citationAttempts === 1 ? '# 一、问题的提出\n内容待补充……' : fullDraft }
          }
        } else if (required === 'document_skill_execute') {
          const progress = request.contextInstructions?.join('\n') ?? ''
          const kind = progress.includes('本步仍需生成：DOCX') ? 'docx' : 'pdf'
          if (kind === 'docx') modelDocxRequests += 1
          yield {
            kind: 'tool_call_complete',
            callId: `call_complex_${++callIndex}`,
            toolName: required,
            arguments: kind === 'docx'
              ? {
                  kind,
                  operation: 'from-markdown',
                  content: fullDraft,
                  outputPath: '数字行政法体系建构研究报告.docx'
                }
              : {
                  kind,
                  operation: 'from-docx',
                  args: [
                    '--input',
                    '数字行政法体系建构研究报告.docx',
                    '--output',
                    '数字行政法体系建构研究报告.pdf'
                  ]
                }
          }
        } else {
          yield { kind: 'assistant_text_delta', text: '全部强制阶段与 Word、PDF 交付均已完成。' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        yield { kind: 'completed', stopReason: 'tool_calls' }
      }
    }, { tools })
    await bootstrapThread(h, {
      request: {
        prompt: [
          '请先检索本地知识库并对至少 3 篇 PDF 执行 OCR/逐篇研读。',
          '执行脱敏处理演示，分析 2-3 个典型案例。',
          '撰写不少于 600 字的文献综述并交付 Word 与 PDF：',
          '- 一、问题的提出',
          '- 二、规范体系',
          '- 参考文献（标注真实来源）',
          '文件名含「数字行政法体系建构研究报告」，禁止省略号和占位符。'
        ].join('\n')
      }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)
    const finishedThread = await h.threadStore.get(h.threadId)

    expect(status).toBe('completed')
    expect(executed).toEqual([
      'data_compliance',
      'document_skill_execute:docx',
      'document_skill_execute:pdf'
    ])
    expect(citationAttempts).toBe(0)
    expect(modelDocxRequests).toBe(1)
    expect(documentInputs[0]).toMatchObject({
      kind: 'docx',
      operation: 'from-markdown',
      content: fullDraft,
      outputPath: '数字行政法体系建构研究报告.docx'
    })
    expect(finishedThread?.todos?.items.length).toBeGreaterThan(3)
    expect(finishedThread?.todos?.items.every((item) => item.status === 'completed')).toBe(true)
    expect(items.some((item) =>
      item.kind === 'tool_result' &&
      item.isError === true &&
      JSON.stringify(item.output).includes('explicit_task_contract_failed')
    )).toBe(false)
  })

  it('delivers contract-review output without forcing the legacy research pipeline', async () => {
    const executed: string[] = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('bash', async () => {
        executed.push('bash')
        return { output: { ok: true } }
      }),
      define('read', async () => ({ output: { ok: true } })),
      define('write', async () => ({ output: { ok: true } })),
      define('edit', async () => ({ output: { ok: true } })),
      define('knowledge_auto_retrieve', async () => {
        executed.push('knowledge_auto_retrieve')
        return {
          output: {
            sources: [{ path: '合同审查思维体系.md' }],
            contextText: '本地合同审查材料涵盖违约责任、知识产权归属、验收标准与争议解决条款的审查方法。'
          }
        }
      }),
      define('knowledge_search', async () => ({ output: { results: [] } })),
      define('knowledge_read_file', async () => ({ output: { content: '本地材料' } })),
      define('mcp_search', async () => {
        executed.push('mcp_search')
        return { output: { results: [{ toolId: 'ima-knowledge-base/research_ima' }] } }
      }),
      define('mcp_call', async () => {
        executed.push('mcp_call')
        return {
          output: {
            serverId: 'ima-knowledge-base',
            toolName: 'research_ima',
            result: 'IMA 返回了软件开发合同审查、违约责任和知识产权归属的知识库证据。'
          }
        }
      }),
      define('document_skill_execute', async (args) => {
        executed.push('document_skill_execute')
        return {
          output: {
            status: 'ok',
            kind: 'docx',
            operation: 'from-markdown',
            output: '/tmp/软件开发合同审查意见书.docx',
            contentBytes: String(args.content ?? '').length
          }
        }
      })
    ]
    const requests: ModelRequest[] = []
    let callIndex = 0
    const h = makeHarness({
      provider: 'contract-review-regression',
      model: 'contract-review-regression',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        if (request.requiredToolName === 'knowledge_auto_retrieve') {
          yield {
            kind: 'tool_call_complete',
            callId: `call_contract_${++callIndex}`,
            toolName: 'knowledge_auto_retrieve',
            arguments: { question: '软件开发合同审查、违约责任、知识产权归属' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (request.requiredToolName === 'document_skill_execute') {
          yield {
            kind: 'tool_call_complete',
            callId: `call_contract_${++callIndex}`,
            toolName: 'document_skill_execute',
            arguments: {
              kind: 'docx',
              operation: 'from-markdown',
              content: '# 软件开发合同审查意见书\n\n'.concat('完整审查意见。'.repeat(1_000)),
              outputPath: '软件开发合同审查意见书.docx'
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '合同审查意见书 Word 已交付。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools,
      skillRuntime: {
        resolveTurn: () => ({
          activeSkillIds: ['contract-risk-review'],
          activations: [],
          instructions: ['执行合同风险审查。'],
          // This reproduces the allowlist shipped in the failed trajectories.
          allowedToolNames: ['read', 'write', 'edit', 'bash'],
          injectedBytes: 100
        })
      } as never
    })
    await bootstrapThread(h, {
      request: {
        prompt: [
          '【合同审查任务】请完成一份「软件开发委托合同」的审查意见书，并交付为 Word 文档。',
          '请先检索知识库（本地知识库/IMA）中关于合同审查、软件开发合同、违约责任、知识产权归属的相关材料和法条。',
          '生成 Word 文档（.docx），文件名含「软件开发合同审查意见书」。'
        ].join('\n')
      }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed).toEqual(['document_skill_execute'])
    expect(requests.some((request) => request.requiredToolName === 'document_skill_execute')).toBe(true)
    expect(executed).not.toContain('bash')
  })

  it('hands an exact PPT task to the specialist workflow without forced research gates', async () => {
    const executed: string[] = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('read', async () => ({ output: { ok: true } })),
      define('write', async () => ({ output: { ok: true } })),
      define('edit', async () => ({ output: { ok: true } })),
      define('bash', async (args) => {
        executed.push('bash')
        expect(String(args.command)).toContain('skill_runner.py export')
        return {
          output: {
            exit_code: 0,
            output: JSON.stringify({
              engine: 'open-kimi-ppt',
              exporter: 'local-python-pptx',
              styleValidated: true,
              scenario: 'education-training',
              slides: 15,
              fadeTransitions: 15,
              bytes: 64_000,
              output: '/tmp/民法典解读/民法典解读.pptx'
            })
          }
        }
      }),
      define('knowledge_auto_retrieve', async () => {
        executed.push('knowledge_auto_retrieve')
        return {
          output: {
            sources: [{ path: '民法典合同编通则司法解释材料.md' }],
            contextText: '本地材料梳理了合同成立、合同效力、履行、解除及违约责任的司法解释要点。'
          }
        }
      }),
      define('mcp_search', async () => {
        executed.push('mcp_search')
        return { output: { results: [{ toolId: 'ima-knowledge-base/research_ima' }] } }
      }),
      define('mcp_call', async () => {
        executed.push('mcp_call')
        return {
          output: {
            serverId: 'ima-knowledge-base',
            toolName: 'research_ima',
            result: 'IMA 返回了民法典合同编通则司法解释的知识库资料与可引用来源。'
          }
        }
      }),
      define('document_skill_execute', async () => {
        executed.push('document_skill_execute')
        return { output: { status: 'ok', kind: 'pptx', operation: 'from-json' } }
      })
    ]
    const requests: ModelRequest[] = []
    let bashCalled = false
    const h = makeHarness({
      provider: 'specialist-ppt-regression',
      model: 'specialist-ppt-regression',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        if (request.requiredToolName === 'knowledge_auto_retrieve') {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_ppt_local',
            toolName: 'knowledge_auto_retrieve',
            arguments: { question: '民法典合同编通则司法解释要点' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (!bashCalled) {
          bashCalled = true
          yield {
            kind: 'tool_call_complete',
            callId: 'call_pptd_export',
            toolName: 'bash',
            arguments: {
              command: 'python3 /opt/legalwork/skills/open-kimi-ppt/scripts/skill_runner.py export /tmp/民法典解读/deck.pptd --scenario education-training --output /tmp/民法典解读/民法典解读.pptx'
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: 'PPTD 项目和 PPTX 已交付。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools,
      skillRuntime: {
        resolveTurn: () => ({
          activeSkillIds: ['open-kimi-ppt'],
          activations: [],
          instructions: ['执行 open-kimi-ppt 的 PPTD 设计、导出和视觉检查流程。'],
          // Simulate another active Skill contributing an overly narrow list.
          allowedToolNames: ['document_skill_execute'],
          injectedBytes: 100
        })
      } as never
    })
    await bootstrapThread(h, {
      request: {
        prompt: [
          '【演示文稿任务】请制作一份 PPT 演示文稿，主题：「民法典合同编通则司法解释要点解读」。',
          '请先检索知识库（本地知识库/IMA）中的相关材料，再基于检索结果制作 PPT。',
          '生成 PPT 演示文稿（.pptx），内容必须完整真实。'
        ].join('\n')
      }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed).toEqual(['bash'])
    const specialistRequests = requests.filter((request) => request.requiredToolName === 'bash')
    expect(specialistRequests).toHaveLength(1)
    expect(specialistRequests[0]?.tools.map((tool) => tool.name)).toEqual(expect.arrayContaining(['bash']))
    expect(specialistRequests[0]?.contextInstructions?.join('\n')).toContain('open-kimi-ppt / PPTD')
    expect(specialistRequests[0]?.contextInstructions?.join('\n')).toContain('scripts/skill_runner.py')
    expect(requests.every((request) =>
      !request.tools.some((tool) => tool.name === 'document_skill_execute')
    )).toBe(true)
    expect(requests.at(-1)?.tools).toEqual([])
  })

  it('recovers an advertised tool call emitted as DeepSeek DSML text', async () => {
    let executions = 0
    const documentTool = LocalToolHost.defineTool({
      name: 'document_skill_execute',
      description: 'create document',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async (args) => {
        executions += 1
        return {
          output: {
            status: 'ok',
            kind: args.kind,
            operation: args.operation,
            output: '/tmp/report.docx'
          }
        }
      }
    })
    let requests = 0
    const h = makeHarness({
      provider: 'dsml-recovery',
      model: 'dsml-recovery',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests += 1
        if (request.requiredToolName) {
          yield {
            kind: 'assistant_text_delta',
            text: [
              '正在生成 Word。',
              '<｜｜DSML｜｜tool_calls>',
              '<｜｜DSML｜｜invoke name="document_skill_execute">',
              '<｜｜DSML｜｜parameter name="kind" string="true">docx</｜｜DSML｜｜parameter>',
              '<｜｜DSML｜｜parameter name="operation" string="true">from-markdown</｜｜DSML｜｜parameter>',
              '</｜｜DSML｜｜invoke>',
              '</｜｜DSML｜｜tool_calls>'
            ].join('\n')
          }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        yield { kind: 'assistant_text_delta', text: 'Word 已生成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [documentTool] })
    await bootstrapThread(h, { request: { prompt: '请生成一份 Word 报告给我' } })

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(executions).toBe(1)
    expect(requests).toBe(1)
    const visibleText = items
      .filter((item) => item.kind === 'assistant_text')
      .map((item) => item.text)
      .join('\n')
    expect(visibleText).toContain('/tmp/report.docx')
    expect(visibleText).not.toContain('DSML')
  })

  it('does not execute a tool call emitted only on the reasoning channel', async () => {
    let executions = 0
    let modelCalls = 0
    const templateTool = LocalToolHost.defineTool({
      name: 'resolve_legal_document_template',
      description: 'resolve template',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async (args) => {
        executions += 1
        expect(args).toMatchObject({
          documentType: '民事起诉状',
          query: '买卖合同纠纷'
        })
        expect(args).not.toHaveProperty('caseCause')
        return { output: { matched: true, args, template: '# 民事起诉状' } }
      }
    })
    const h = makeHarness({
      provider: 'reasoning-dsml-recovery',
      model: 'reasoning-dsml-recovery',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        modelCalls += 1
        if (modelCalls === 1) {
          for (const text of [
            '<',
            '| |DSML| | tool_calls>\n',
            '<| |DSML| | invoke name="resolve_legal_document_template">\n',
            '<| |DSML| | parameter name="documentType" string="true">民事起诉状</| |DSML| | parameter>\n',
            '<| |DSML| | parameter name="caseCause" string="true">买卖合同纠纷</| |DSML| | parameter>\n',
            '</| |DSML| | invoke>\n',
            '</| |DSML| | tool_calls>'
          ]) yield { kind: 'assistant_reasoning_delta', text }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '# 民事起诉状\n\n原告：甲公司\n\n诉讼请求：判令被告支付货款。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [templateTool] })
    await bootstrapThread(h, { request: { prompt: '写一份买卖合同纠纷民事起诉状' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    // Reasoning-channel DSML is not recovered into tool executions (GitHub behavior).
    expect(executions).toBe(0)
    expect(modelCalls).toBe(2)
    const items = await h.sessionStore.loadItems(h.threadId)
    const visible = items
      .filter((item) => item.kind === 'assistant_text')
      .map((item) => item.text)
      .join('\n')
    expect(visible).toContain('# 民事起诉状')
    expect(visible).not.toContain('DSML')
  })

  it('executes a new Word mutation for a referential follow-up instead of reusing the previous artifact', async () => {
    let documentExecutions = 0
    const requiredTools: Array<string | undefined> = []
    const documentTool = LocalToolHost.defineTool({
      name: 'document_skill_execute',
      description: 'create document',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async (args) => {
        documentExecutions += 1
        return {
          output: {
            status: 'ok',
            kind: 'docx',
            operation: 'from-markdown',
            output: `/tmp/report-${documentExecutions}.docx`,
            args
          }
        }
      }
    })
    const h = makeHarness({
      provider: 'referential-document-follow-up',
      model: 'referential-document-follow-up',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requiredTools.push(request.requiredToolName)
        if (request.requiredToolName === 'document_skill_execute') {
          yield {
            kind: 'tool_call_complete',
            callId: `call_document_${requiredTools.length}`,
            toolName: 'document_skill_execute',
            arguments: {
              kind: 'docx',
              operation: 'from-markdown',
              content: '# 文档',
              outputPath: `report-${requiredTools.length}.docx`
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: 'Word 已生成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [documentTool] })
    await bootstrapThread(h, { request: { prompt: '写一个word，总结这个论文' } })
    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')

    const followUp = await h.turns.startTurn({
      threadId: h.threadId,
      request: { prompt: '把本文所有引注都整理到word里' }
    })
    h.turnId = followUp.turnId
    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')

    expect(documentExecutions).toBe(2)
    expect(requiredTools.filter((name) => name === 'document_skill_execute')).toHaveLength(2)
  })

  it('converts a chunked EOF-truncated DSML frame into a real tool call without visible leakage', async () => {
    let bashExecutions = 0
    let modelCalls = 0
    const advertisedTools: string[][] = []
    const bashTool = LocalToolHost.defineTool({
      name: 'bash',
      description: 'run command',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => {
        bashExecutions += 1
        return { output: { exit_code: 0, output: 'done' } }
      }
    })
    const h = makeHarness({
      provider: 'truncated-dsml-stream',
      model: 'truncated-dsml-stream',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        modelCalls += 1
        advertisedTools.push(request.tools.map((tool) => tool.name))
        if (modelCalls === 1) {
          for (const text of [
            '<',
            '｜｜DSML｜｜',
            'tool_calls>\n',
            '<｜｜DSML｜｜invoke name="bash">\n',
            '<｜｜DSML｜｜parameter name="command" string="true">echo done</｜｜DSML｜｜parameter>\n',
            '</｜｜DSML｜｜invoke>\n',
            '</｜｜DSML｜｜tool_calls'
          ]) yield { kind: 'assistant_text_delta', text }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '命令执行完成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [bashTool] })
    await bootstrapThread(h, { request: { prompt: '请帮我运行命令查看当前环境并告诉我结果' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    const visibleText = events
      .filter((event) => event.kind === 'assistant_text_delta')
      .map((event) => event.kind === 'assistant_text_delta' && 'text' in event.item ? event.item.text : '')
      .join('')
    expect(advertisedTools[0]).toContain('bash')
    expect(bashExecutions).toBe(1)
    expect(visibleText).toBe('命令执行完成。')
    expect(visibleText).not.toContain('DSML')
  })

  it('does not discard a visible response when an optional delivery tool is skipped', async () => {
    let requests = 0
    const documentTool = LocalToolHost.defineTool({
      name: 'document_skill_execute',
      description: 'create document',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => ({ output: { status: 'ok' } })
    })
    const h = makeHarness({
      provider: 'required-tool-prose',
      model: 'required-tool-prose',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        requests += 1
        yield { kind: 'assistant_reasoning_delta', text: '准备完成任务。' }
        yield { kind: 'assistant_text_delta', text: 'Word 已经生成并交付成功。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [documentTool] })
    await bootstrapThread(h, { request: { prompt: '请生成一份 Word 报告给我' } })

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)

    expect(status).toBe('completed')
    expect(requests).toBeGreaterThanOrEqual(1)
    expect(items.some((item) =>
      item.kind === 'assistant_text' && item.text.includes('交付成功')
    )).toBe(true)
    expect(events.some((event) =>
      event.kind === 'assistant_text_delta' || event.kind === 'assistant_reasoning_delta'
    )).toBe(false)
    expect(items.some((item) =>
      item.kind === 'error' && item.code === 'required_tool_missing'
    )).toBe(false)
  })

  it('returns a fallback after bounded document worker errors instead of failing or looping', async () => {
    let executions = 0
    const documentTool = LocalToolHost.defineTool({
      name: 'document_skill_execute',
      description: 'create document',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => {
        executions += 1
        return { output: { status: 'error', error: 'converter unavailable' }, isError: true }
      }
    })
    let calls = 0
    const h = makeHarness({
      provider: 'document-failure-cap',
      model: 'document-failure-cap',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        calls += 1
        yield {
          kind: 'tool_call_complete',
          callId: `call_document_failure_${calls}`,
          toolName: 'document_skill_execute',
          arguments: {
            kind: 'docx',
            operation: 'from-markdown',
            content: '# 报告',
            outputPath: '报告.docx'
          }
        }
        yield { kind: 'completed', stopReason: 'tool_calls' }
      }
    }, { tools: [documentTool] })
    await bootstrapThread(h, { request: { prompt: '请生成一份 Word 报告给我' } })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    // The repeat-loop guard suppresses the third identical dispatch; the
    // document state machine then treats that suppression as the third failure.
    expect(executions).toBe(2)
    expect(calls).toBe(3)
  })

  it('returns a fallback after the bounded presentation export budget', async () => {
    let executions = 0
    const bashTool = LocalToolHost.defineTool({
      name: 'bash',
      description: 'run the active presentation skill',
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute: async () => {
        executions += 1
        return { output: { exit_code: 1, output: 'local exporter failed' }, isError: true }
      }
    })
    let calls = 0
    const h = makeHarness({
      provider: 'presentation-failure-cap',
      model: 'presentation-failure-cap',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        calls += 1
        yield {
          kind: 'tool_call_complete',
          callId: `call_presentation_failure_${calls}`,
          toolName: 'bash',
          arguments: {
            command: 'python3 /opt/legalwork/skills/open-kimi-ppt/scripts/skill_runner.py export /tmp/deck.pptd --scenario analysis-decision --output /tmp/deck.pptx'
          }
        }
        yield { kind: 'completed', stopReason: 'tool_calls' }
      }
    }, {
      tools: [bashTool],
      skillRuntime: {
        resolveTurn: () => ({
          activeSkillIds: ['open-kimi-ppt'],
          activations: [],
          instructions: ['Use the unified local open-kimi-ppt export workflow.'],
          injectedBytes: 80
        })
      } as never
    })
    await bootstrapThread(h, { request: { prompt: '请制作并交付一份 PPT 演示文稿' } })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executions).toBe(2)
    expect(calls).toBe(3)
  })

  it('does not block document delivery on an explicit IMA request', async () => {
    const executed: string[] = []
    const define = (
      name: string,
      execute: () => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('mcp_search', async () => {
        executed.push('mcp_search')
        return { output: { results: [{ toolId: 'ima-knowledge-base/research_ima' }] } }
      }),
      define('mcp_call', async () => {
        executed.push('mcp_call')
        return { output: { error: 'MCP error -32001: Request timed out' }, isError: true }
      }),
      define('document_skill_execute', async () => {
        executed.push('document_skill_execute')
        return {
          output: {
            status: 'ok',
            kind: 'docx',
            operation: 'from-markdown',
            output: '/tmp/ima-timeout-report.docx'
          }
        }
      })
    ]
    let recoveryRequests = 0
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'ima-bounded-recovery',
      model: 'ima-bounded-recovery',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        if (request.requiredToolName === 'document_skill_execute') {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_after_ima_timeout',
            toolName: 'document_skill_execute',
            arguments: { kind: 'docx', operation: 'from-markdown' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        const alreadyDelivered = request.history.some((item) =>
          item.kind === 'tool_result' && item.toolName === 'document_skill_execute' && !item.isError
        )
        if (alreadyDelivered) {
          yield { kind: 'assistant_text_delta', text: 'Word 已交付。' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        recoveryRequests += 1
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools })
    await bootstrapThread(h, {
      request: { prompt: '请检索 IMA 研究行政处罚并生成 Word 报告' }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(recoveryRequests).toBe(0)
    expect(executed).toEqual(['document_skill_execute'])
    expect(requests.at(-1)?.requiredToolName).toBe('document_skill_execute')
    expect(requests.at(-1)?.contextInstructions?.join('\n') ?? '').not.toContain('知识库证据门禁未通过')
  })

  it('keeps the tool catalog after MCP discovery in legal research turns', async () => {
    const executed: Array<{ name: string; args: Record<string, unknown> }> = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('mcp_search', async (args) => {
        executed.push({ name: 'mcp_search', args })
        return {
          output: {
            results: [{
              toolId: 'yuandian-law/yuandian_law_vector_search',
              serverId: 'yuandian-law',
              title: '法律法规语义检索接口',
              description: '元典：按自然语言查询法条级语义检索，返回 fatiao 法条内容。'
            }, {
              toolId: 'pkulaw-case-number-recognition/anhao_recognition',
              serverId: 'pkulaw-case-number-recognition',
              title: '案号识别与标准化',
              description: '北大法宝：识别并标准化案号，返回案例标题与链接。'
            }]
          }
        }
      }),
      define('mcp_call', async (args) => {
        executed.push({ name: 'mcp_call', args })
        const toolName = String(args.toolName ?? '')
        if (toolName.includes('case') || toolName.includes('qwal')) {
          return {
            output: {
              serverId: 'yuandian-case',
              toolName,
              result: { content: [{ type: 'text', text: '（2022）京02刑终376号裁判要旨及基本案情。'.repeat(10) }] }
            }
          }
        }
        return {
          output: {
            serverId: 'yuandian-law',
            toolName,
            result: { content: [{ type: 'text', text: '《中华人民共和国民法典》第一千一百六十五条现行条文及人工智能侵权责任相关规范。'.repeat(10) }] }
          }
        }
      }),
      define('knowledge_auto_retrieve', async (args) => {
        executed.push({ name: 'knowledge_auto_retrieve', args })
        return {
          output: {
            contextText: '本地知识库论文摘要：生成式人工智能侵权责任规则研究。',
            sources: [{ path: '论文/人工智能侵权责任研究.pdf' }]
          }
        }
      })
    ]
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'legal-research-discovery',
      model: 'legal-research-discovery',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        const searchCount = executed.filter((item) => item.name === 'mcp_search').length
        const legalCallCount = executed.filter((item) => item.name === 'mcp_call').length
        if (searchCount === 0) {
          yield { kind: 'tool_call_complete', callId: 'call_discover_1', toolName: 'mcp_search', arguments: { query: '元典 法律法规 案例 检索' } }
          yield { kind: 'tool_call_complete', callId: 'call_discover_2', toolName: 'mcp_search', arguments: { query: '北大法宝 法规 案例' } }
          yield { kind: 'tool_call_complete', callId: 'call_kb_1', toolName: 'knowledge_auto_retrieve', arguments: { query: '人工智能侵权责任' } }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (legalCallCount === 0) {
          yield { kind: 'tool_call_complete', callId: 'call_law_1', toolName: 'mcp_call', arguments: { serverId: 'yuandian-law', toolName: 'yuandian_law_vector_search', query: '人工智能侵权责任' } }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (legalCallCount === 1) {
          yield { kind: 'tool_call_complete', callId: 'call_case_1', toolName: 'mcp_call', arguments: { serverId: 'yuandian-case', toolName: 'yuandian_rh_qwal_search', query: '人工智能侵权责任典型案例' } }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: [
          '# 人工智能侵权责任多源调研报告',
          '## 一、结论',
          '结论正文。'.repeat(30),
          '## 二、法律依据',
          '依据正文。'.repeat(20),
          '## 三、相关案例',
          '案例正文。'.repeat(20),
          '## 四、分析与风险提示',
          '分析正文。'.repeat(20),
          '## 五、来源',
          '来源正文。'.repeat(10)
        ].join('\n\n') }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools, primaryLegalSource: 'yuandian' })
    await bootstrapThread(h, {
      title: '法律调研:测试',
      request: { prompt: '请对以下法律问题进行多源调研：「人工智能的侵权责任」。最终报告必须作为最后一条独立回复。' }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed.filter((item) => item.name === 'mcp_call').length).toBe(2)
    // The second model step must still see the research tools. Treating the
    // mcp_search discovery listing as primary evidence used to strip the whole
    // catalog, so the turn ended with a plan and nothing else.
    expect(requests.length).toBeGreaterThanOrEqual(3)
    for (const request of requests.slice(0, 3)) {
      expect(request.tools.length).toBeGreaterThan(0)
    }
  })

  it('continues a legal research turn after a stage broadcast instead of ending it', async () => {
    const executed: Array<{ name: string; args: Record<string, unknown> }> = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('mcp_search', async (args) => {
        executed.push({ name: 'mcp_search', args })
        return {
          output: {
            results: [{
              toolId: 'yuandian-law/yuandian_law_vector_search',
              serverId: 'yuandian-law',
              title: '法律法规语义检索接口',
              description: '元典：法条级语义检索。'
            }]
          }
        }
      }),
      define('mcp_call', async (args) => {
        executed.push({ name: 'mcp_call', args })
        const toolName = String(args.toolName ?? '')
        if (toolName.includes('qwal') || toolName.includes('case')) {
          return {
            output: {
              serverId: 'yuandian-case',
              toolName,
              result: { content: [{ type: 'text', text: '（2022）京02刑终376号裁判要旨。'.repeat(10) }] }
            }
          }
        }
        return {
          output: {
            serverId: 'yuandian-law',
            toolName,
            result: { content: [{ type: 'text', text: '《中华人民共和国民法典》第一千一百六十五条及人工智能侵权责任相关规范条文。'.repeat(10) }] }
          }
        }
      }),
      define('knowledge_auto_retrieve', async () => {
        return { output: { contextText: '本地知识库检索结果。', sources: [{ path: '论文/人工智能侵权责任.pdf' }] } }
      })
    ]
    const requests: ModelRequest[] = []
    let broadcastSent = false
    const h = makeHarness({
      provider: 'legal-research-broadcast',
      model: 'legal-research-broadcast',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        const searchCount = executed.filter((item) => item.name === 'mcp_search').length
        const legalCallCount = executed.filter((item) => item.name === 'mcp_call').length
        if (searchCount === 0) {
          yield { kind: 'tool_call_complete', callId: 'call_discover_1', toolName: 'mcp_search', arguments: { query: '元典 法规 案例' } }
          yield { kind: 'tool_call_complete', callId: 'call_kb_1', toolName: 'knowledge_auto_retrieve', arguments: { query: '人工智能侵权责任' } }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (legalCallCount === 0) {
          yield { kind: 'tool_call_complete', callId: 'call_law_1', toolName: 'mcp_call', arguments: { serverId: 'yuandian-law', toolName: 'yuandian_law_vector_search', query: '人工智能侵权责任' } }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (legalCallCount === 1) {
          yield { kind: 'tool_call_complete', callId: 'call_case_1', toolName: 'mcp_call', arguments: { serverId: 'yuandian-case', toolName: 'yuandian_rh_qwal_search', query: '人工智能侵权责任典型案例' } }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (legalCallCount === 2 && !broadcastSent) {
          broadcastSent = true
          yield { kind: 'assistant_text_delta', text: '已有充足材料。继续补充获取民法典关键条文与北大法宝补充。' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        if (legalCallCount === 2 && broadcastSent) {
          yield { kind: 'tool_call_complete', callId: 'call_supplement_1', toolName: 'mcp_call', arguments: { serverId: 'yuandian-law', toolName: 'yuandian_law_vector_search', query: '民法典第一千一百六十五条' } }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: [
          '# 人工智能侵权责任多源调研报告',
          '## 一、结论',
          '结论正文。'.repeat(30),
          '## 二、法律依据',
          '依据正文。'.repeat(20),
          '## 三、相关案例',
          '案例正文。'.repeat(20),
          '## 四、分析与风险提示',
          '分析正文。'.repeat(20),
          '## 五、来源',
          '来源正文。'.repeat(10)
        ].join('\n\n') }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools, primaryLegalSource: 'yuandian' })
    await bootstrapThread(h, {
      title: '法律调研:测试',
      request: { prompt: '请对以下法律问题进行多源调研：「人工智能侵权责任」。最终报告必须作为最后一条独立回复。' }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(executed.filter((item) => item.name === 'mcp_call').length).toBe(3)
    expect(broadcastSent).toBe(true)
    expect(requests.length).toBeGreaterThanOrEqual(4)
    // The request following the stage broadcast must still carry the tools.
    for (const request of requests) {
      expect(request.tools.length).toBeGreaterThan(0)
    }
  })

  it('keeps the legal template resolver in document-writing tool catalogs', async () => {
    const executed: string[] = []
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown; isError?: boolean }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const tools = [
      define('mcp_call', async () => {
        executed.push('mcp_call')
        return { output: { ok: true } }
      }),
      define('resolve_legal_document_template', async () => {
        executed.push('resolve_legal_document_template')
        return { output: { matched: false } }
      }),
      define('todo_list', async () => {
        executed.push('todo_list')
        return { output: { items: [] } }
      }),
      define('todo_write', async () => {
        executed.push('todo_write')
        return { output: { ok: true } }
      })
    ]
    const requests: ModelRequest[] = []
    const h = makeHarness({
      provider: 'doc-writing-tools',
      model: 'doc-writing-tools',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        requests.push(request)
        yield { kind: 'assistant_text_delta', text: '# 民事上诉状\n\n正文' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools,
      skillRuntime: {
        resolveTurn: () => ({
          activeSkillIds: ['restrictive-skill'],
          activations: [],
          instructions: [],
          injectedBytes: 0,
          allowedToolNames: ['mcp_call']
        })
      } as never
    })
    await bootstrapThread(h, {
      request: {
        prompt: [
          '<inline_document_response>',
          '你正在执行 LegalWork 文书写作任务。',
          '起草民事起诉状或民事答辩状时，可优先调用 resolve_legal_document_template。',
          '</inline_document_response>'
        ].join('\n')
      }
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    const toolNames = (requests[0]?.tools ?? []).map((tool) => tool.name)
    expect(toolNames).toContain('resolve_legal_document_template')
    expect(toolNames).toContain('mcp_call')
    expect(toolNames).toContain('todo_list')
  })

  it('keeps running past the legacy eight-step ceiling until the model stops', async () => {
    let calls = 0
    const h = makeHarness(
      {
        provider: 'long-runner',
        model: 'long-runner',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls <= 9) {
            yield {
              kind: 'tool_call_complete',
              callId: `call_ls_${calls}`,
              toolName: 'ls',
              arguments: { path: '.' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'assistant_text_delta', text: 'done' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: buildDefaultLocalTools(), toolStorm: { enabled: false } }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(calls).toBe(10)
    expect(items.some((item) => item.kind === 'assistant_text' && item.text === 'done')).toBe(true)
  })

  it('replaces live partial tool results with final tool results in the thread snapshot', async () => {
    const partialTool = LocalToolHost.defineTool({
      name: 'partial_bash',
      description: 'Emit a partial update then a final result',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false
      },
      policy: 'auto',
      execute: async (_args, _context, onUpdate) => {
        await onUpdate?.({ output: { partial: true }, isError: false })
        return { output: { exit_code: 127 }, isError: true }
      }
    })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'fake',
        model: 'fake',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_partial',
              toolName: 'partial_bash',
              arguments: {}
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [partialTool] }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const thread = await h.threadStore.get(h.threadId)
    const result = thread?.turns
      .flatMap((turn) => turn.items)
      .find((item) => item.kind === 'tool_result' && item.callId === 'call_partial')

    expect(status).toBe('completed')
    expect(result).toMatchObject({
      kind: 'tool_result',
      status: 'completed',
      isError: true,
      output: { exit_code: 127 }
    })
  })

  it('surfaces tool catalog drift to the UI and next model request', async () => {
    const seenInstructions: string[][] = []
    let modelCalls = 0
    let advertiseExtra = false
    const echoTool = LocalToolHost.defineTool({
      name: 'echo',
      description: 'Echo text',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text']
      },
      policy: 'auto',
      execute: async () => {
        advertiseExtra = true
        return { output: { ok: true } }
      }
    })
    const extraTool = LocalToolHost.defineTool({
      name: 'extra_tool',
      description: 'Appears after the first tool call',
      inputSchema: { type: 'object', properties: {}, required: [] },
      policy: 'auto',
      shouldAdvertise: () => advertiseExtra,
      execute: async () => ({ output: { ok: true } })
    })
    const h = makeHarness(
      {
        provider: 'catalog-drift',
        model: 'catalog-drift',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          seenInstructions.push([
            ...(request.prefixInstructions ?? []),
            ...(request.contextInstructions ?? [])
          ])
          modelCalls += 1
          if (modelCalls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_echo',
              toolName: 'echo',
              arguments: { text: 'hi' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [echoTool, extraTool] }
    )
    await bootstrapThread(h)

    await h.loop.runTurn(h.threadId, h.turnId)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    const items = await h.sessionStore.loadItems(h.threadId)

	    expect(events.some((event) => event.kind === 'tool_catalog_changed')).toBe(true)
	    expect(events.find((event) => event.kind === 'tool_catalog_changed')).toMatchObject({
	      kind: 'tool_catalog_changed',
	      changeKind: 'additive'
	    })
	    // Catalog growth is informational, not a turn failure: it must not be
	    // persisted as an error item (clients treat error items as failures).
	    expect(items.some((item) => item.kind === 'error' && item.code === 'tool_catalog_changed')).toBe(false)
	    expect(seenInstructions[1]?.some((text) => text.includes('Tool catalog changed'))).toBe(true)
	  })

	  it('records an in-place tool schema mutation and continues delivery', async () => {
	    let modelCalls = 0
	    const inputSchema: Record<string, unknown> = {
	      type: 'object',
	      properties: { text: { type: 'string' } },
	      required: ['text']
	    }
	    const echoTool = LocalToolHost.defineTool({
	      name: 'echo',
	      description: 'Echo text.',
	      inputSchema,
	      policy: 'auto',
	      execute: async () => {
	        inputSchema.properties = {
	          text: { type: 'string' },
	          unexpected: { type: 'boolean' }
	        }
	        return { output: { ok: true } }
	      }
	    })
	    const h = makeHarness(
	      {
	        provider: 'catalog-breaking-drift',
	        model: 'catalog-breaking-drift',
	        async *stream(): AsyncIterable<ModelStreamChunk> {
	          modelCalls += 1
	          if (modelCalls > 1) {
	            yield { kind: 'assistant_text_delta', text: '工具目录已刷新，继续完成回答。' }
	            yield { kind: 'completed', stopReason: 'stop' }
	            return
	          }
	          yield {
	            kind: 'tool_call_complete',
	            callId: 'call_echo',
	            toolName: 'echo',
	            arguments: { text: 'hi' }
	          }
	          yield { kind: 'completed', stopReason: 'tool_calls' }
	        }
	      },
	      { tools: [echoTool] }
	    )
	    await bootstrapThread(h)

	    const status = await h.loop.runTurn(h.threadId, h.turnId)
	    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
	    const items = await h.sessionStore.loadItems(h.threadId)

	    expect(status).toBe('completed')
	    expect(modelCalls).toBe(2)
	    expect(events.find((event) => event.kind === 'tool_catalog_changed')).toMatchObject({
	      kind: 'tool_catalog_changed',
	      changeKind: 'breaking'
	    })
	    expect(items.some((item) => item.kind === 'error' && item.code === 'tool_catalog_changed')).toBe(false)
	    expect(items.some((item) =>
	      item.kind === 'assistant_text' && item.text.includes('继续完成回答')
	    )).toBe(true)
	  })

	  it('runs consecutive built-in read-only tool calls in a deterministic parallel batch', async () => {
    const started: string[] = []
    let resolveBothStarted!: () => void
    let releaseTools!: () => void
    const bothStarted = new Promise<void>((resolve) => {
      resolveBothStarted = resolve
    })
    const release = new Promise<void>((resolve) => {
      releaseTools = resolve
    })
    const makeReadOnlyTool = (name: 'read' | 'grep') =>
      LocalToolHost.defineTool({
        name,
        description: `${name} test tool`,
        inputSchema: {
          type: 'object',
          properties: {}
        },
        policy: 'auto',
        execute: async () => {
          started.push(name)
          if (started.length === 2) resolveBothStarted()
          await release
          return { output: { name } }
        }
      })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'parallel-model',
        model: 'parallel-model',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_read',
              toolName: 'read',
              arguments: {}
            }
            yield {
              kind: 'tool_call_complete',
              callId: 'call_grep',
              toolName: 'grep',
              arguments: {}
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [makeReadOnlyTool('read'), makeReadOnlyTool('grep')] }
    )
    await bootstrapThread(h)

    const run = h.loop.runTurn(h.threadId, h.turnId)
    let startupError: Error | undefined
    try {
      await Promise.race([
        bothStarted,
        new Promise<void>((_resolve, reject) => {
          setTimeout(() => reject(new Error(`only started ${started.join(',') || 'none'}`)), 100)
        })
      ])
    } catch (error) {
      startupError = error instanceof Error ? error : new Error(String(error))
    } finally {
      releaseTools()
    }
    const status = await run
    if (startupError) throw startupError

    const resultCallIds = (await h.sessionStore.loadItems(h.threadId))
      .filter((item) => item.kind === 'tool_result')
      .map((item) => item.kind === 'tool_result' ? item.callId : '')

    expect(status).toBe('completed')
    expect(started).toEqual(['read', 'grep'])
    expect(resultCallIds).toEqual(['call_read', 'call_grep'])
  })

	  it('repairs wrapped tool arguments before persisting and dispatching calls', async () => {
	    let observedArguments: Record<string, unknown> | null = null
	    let calls = 0
	    const h = makeHarness(
	      {
	        provider: 'wrapped-tool-args',
	        model: 'wrapped-tool-args',
	        async *stream(): AsyncIterable<ModelStreamChunk> {
	          calls += 1
	          if (calls > 1) {
	            yield { kind: 'completed', stopReason: 'stop' }
	            return
	          }
	          yield {
	            kind: 'tool_call_complete',
            callId: 'call_wrapped',
            toolName: 'capture_args',
            arguments: {
              tool_name: 'capture_args',
              arguments: '{"path":"src/main.ts"}'
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
        }
      },
      {
        tools: [
          LocalToolHost.defineTool({
            name: 'capture_args',
            description: 'Capture repaired args.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: true },
            policy: 'auto',
            execute: async (args) => {
              observedArguments = { ...args }
              return { output: { ok: true } }
            }
          })
        ]
      }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(observedArguments).toEqual({ path: 'src/main.ts' })
    const items = await h.sessionStore.loadItems(h.threadId)
    const toolCall = items.find((item) => item.kind === 'tool_call' && item.callId === 'call_wrapped')
    expect(toolCall).toMatchObject({
      arguments: { path: 'src/main.ts' },
      summary: expect.stringContaining('flattened arguments wrapper')
    })
  })

	  it('suppresses an immediately repeated successful tool call within a turn', async () => {
	    let executions = 0
    const echoTool = LocalToolHost.defineTool({
      name: 'echo',
      description: 'Echo text',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text']
      },
      policy: 'auto',
      execute: async () => {
        executions += 1
        return { output: { ok: executions } }
      }
    })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'storm-model',
        model: 'storm-model',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls <= 3) {
            yield {
              kind: 'tool_call_complete',
              callId: `call_echo_${calls}`,
              toolName: 'echo',
              arguments: { text: 'repeat me' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [echoTool] }
    )
    await bootstrapThread(h)

	    const status = await h.loop.runTurn(h.threadId, h.turnId)
	    const items = await h.sessionStore.loadItems(h.threadId)
	    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
	    const stormResult = items.find(
	      (item) => item.kind === 'tool_result' && item.callId === 'call_echo_2'
	    )
    const duplicateCall = items.find(
      (item) => item.kind === 'tool_call' && item.callId === 'call_echo_2'
    )

    expect(status).toBe('completed')
    expect(executions).toBe(1)
    expect(duplicateCall).toMatchObject({ kind: 'tool_call', status: 'failed' })
	    expect(stormResult?.kind === 'tool_result' ? stormResult.isError : false).toBe(true)
	    expect(stormResult?.kind === 'tool_result' ? JSON.stringify(stormResult.output) : '')
	      .toContain('repeat-loop guard suppressed')
	    expect(events.find((event) => event.kind === 'tool_storm_suppressed')).toMatchObject({
	      kind: 'tool_storm_suppressed',
	      callId: 'call_echo_2',
	      toolName: 'echo'
	    })
	  })

	  it('can disable the storm breaker through loop config', async () => {
	    let executions = 0
	    const echoTool = LocalToolHost.defineTool({
	      name: 'echo',
	      description: 'Echo text',
	      inputSchema: {
	        type: 'object',
	        properties: { text: { type: 'string' } },
	        required: ['text']
	      },
	      policy: 'auto',
	      execute: async () => {
	        executions += 1
	        return { output: { ok: executions } }
	      }
	    })
	    let calls = 0
	    const h = makeHarness(
	      {
	        provider: 'storm-disabled-model',
	        model: 'storm-disabled-model',
	        async *stream(): AsyncIterable<ModelStreamChunk> {
	          calls += 1
	          if (calls <= 3) {
	            yield {
	              kind: 'tool_call_complete',
	              callId: `call_echo_${calls}`,
	              toolName: 'echo',
	              arguments: { text: 'repeat me' }
	            }
	            yield { kind: 'completed', stopReason: 'tool_calls' }
	            return
	          }
	          yield { kind: 'completed', stopReason: 'stop' }
	        }
	      },
	      { tools: [echoTool], toolStorm: { enabled: false } }
	    )
	    await bootstrapThread(h)

	    const status = await h.loop.runTurn(h.threadId, h.turnId)
	    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)

	    expect(status).toBe('completed')
	    expect(executions).toBe(3)
	    expect(events.some((event) => event.kind === 'tool_storm_suppressed')).toBe(false)
	  })

	  it('uses compact tool history for model requests without mutating persisted results', async () => {
    const longOutput = Array.from({ length: 600 }, (_, index) =>
      index === 320 ? 'ERROR auth middleware failed hard' : `plain output line ${index}`
    ).join('\n')
    const observedRequests: ModelRequest[] = []
    const bashTool = LocalToolHost.defineTool({
      name: 'bash',
      description: 'Execute command',
      inputSchema: {
        type: 'object',
        properties: { command: { type: 'string' } },
        required: ['command']
      },
      policy: 'auto',
      execute: async () => ({
        output: {
          command: 'npm test',
          cwd: '/tmp',
          exit_code: 1,
          output: longOutput,
          full_output_path: '/tmp/full-output.log'
        },
        isError: true
      })
    })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'capture',
        model: 'capture',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          observedRequests.push(request)
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_bash',
              toolName: 'bash',
              arguments: { command: 'npm test' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      {
        tools: [bashTool],
        compactor: new ContextCompactor({ softThreshold: 1_000_000, hardThreshold: 1_100_000 }),
        tokenEconomy: { enabled: true }
      }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const persisted = (await h.sessionStore.loadItems(h.threadId)).find((item) => item.kind === 'tool_result')
    const secondRequestResult = observedRequests[1]?.history.find((item) => item.kind === 'tool_result')
    const usageEvents = (await h.sessionStore.loadEventsSince(h.threadId, 0))
      .filter((event) => event.kind === 'usage')

    expect(status).toBe('completed')
    expect(persisted?.kind === 'tool_result' ? JSON.stringify(persisted.output) : '').toContain('plain output line 599')
    expect(secondRequestResult?.kind === 'tool_result' ? JSON.stringify(secondRequestResult.output) : '').not.toContain('plain output line 300')
    expect(secondRequestResult?.kind === 'tool_result' ? JSON.stringify(secondRequestResult.output).length : 0)
      .toBeLessThan(JSON.stringify(persisted?.kind === 'tool_result' ? persisted.output : '').length)
    expect(secondRequestResult?.kind === 'tool_result' ? JSON.stringify(secondRequestResult.output) : '').toContain('token economy')
    expect(usageEvents.some((event) =>
      event.kind === 'usage' && (event.usage.tokenEconomySavingsTokens ?? 0) > 0
    )).toBe(true)
  })

  it('bounds tool history for model requests even when token economy is disabled', async () => {
    const longOutput = Array.from({ length: 700 }, (_, index) =>
      index === 350 ? 'ERROR default history hygiene caught this line' : `verbose output line ${index}`
    ).join('\n')
    const observedRequests: ModelRequest[] = []
    const bashTool = LocalToolHost.defineTool({
      name: 'bash',
      description: 'Execute command',
      inputSchema: {
        type: 'object',
        properties: { command: { type: 'string' } },
        required: ['command']
      },
      policy: 'auto',
      execute: async () => ({
        output: {
          command: 'npm test',
          output: longOutput
        },
        isError: true
      })
    })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'capture',
        model: 'capture',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          observedRequests.push(request)
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_bash',
              toolName: 'bash',
              arguments: { command: 'npm test', transcript: 'x'.repeat(12_000) }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      {
        tools: [bashTool],
        compactor: new ContextCompactor({ softThreshold: 1_000_000, hardThreshold: 1_100_000 })
      }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const persisted = (await h.sessionStore.loadItems(h.threadId)).find((item) => item.kind === 'tool_result')
    const secondRequestCall = observedRequests[1]?.history.find((item) => item.kind === 'tool_call')
    const secondRequestResult = observedRequests[1]?.history.find((item) => item.kind === 'tool_result')

    expect(status).toBe('completed')
    expect(persisted?.kind === 'tool_result' ? JSON.stringify(persisted.output) : '').toContain('verbose output line 699')
    expect(secondRequestCall?.kind === 'tool_call' ? String(secondRequestCall.arguments.transcript) : '')
      .toContain('cache hygiene')
    expect(secondRequestResult?.kind === 'tool_result' ? JSON.stringify(secondRequestResult.output) : '')
      .toContain('ERROR default history hygiene caught this line')
    expect(secondRequestResult?.kind === 'tool_result' ? JSON.stringify(secondRequestResult.output) : '')
      .toContain('verbose output line 699')
    expect(secondRequestResult?.kind === 'tool_result' ? JSON.stringify(secondRequestResult.output) : '')
      .toContain('cache hygiene')
    expect(secondRequestResult?.kind === 'tool_result' ? JSON.stringify(secondRequestResult.output).length : 0)
      .toBeLessThan(JSON.stringify(persisted?.kind === 'tool_result' ? persisted.output : '').length)
  })

  it('uses per-turn model from startTurn request', async () => {
    let seenModel = ''
    const h = makeHarness({
      provider: 'selector',
      model: 'fallback',
      async *stream({ model }: ModelRequest): AsyncIterable<ModelStreamChunk> {
        seenModel = model
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await h.threadStore.upsert(
      createThreadRecord({
        id: h.threadId,
        title: 'demo',
        workspace: '/tmp',
        model: 'thread-model'
      })
    )
    const { turnId } = await h.turns.startTurn({
      threadId: h.threadId,
      request: { prompt: 'hello', model: 'deepseek-v4-pro' }
    })
    const status = await h.loop.runTurn(h.threadId, turnId)
    const thread = await h.threadStore.get(h.threadId)
    expect(status).toBe('completed')
    expect(seenModel).toBe('deepseek-v4-pro')
    expect(thread?.turns.find((turn) => turn.id === turnId)?.model).toBe('deepseek-v4-pro')
  })

  it('propagates partial tool updates through item_updated before final completion', async () => {
    const streamingTool = LocalToolHost.defineTool({
      name: 'streamer',
      description: 'stream',
      inputSchema: { type: 'object', properties: {}, required: [] },
      policy: 'auto',
      execute: async (_args, _context, onUpdate) => {
        await onUpdate?.({ output: { partial: 'hello' } })
        return { output: { done: true } }
      }
    })
    let calls = 0
    const h = makeHarness({
      provider: 'partial-update',
      model: 'partial-update',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        calls += 1
        if (calls === 1) {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_streamer',
            toolName: 'streamer',
            arguments: {}
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [streamingTool] })
    await bootstrapThread(h)
    const status = await h.loop.runTurn(h.threadId, h.turnId)
    expect(status).toBe('completed')
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    const partialUpdate = events.find(
      (event) =>
        (event.kind === 'item_created' || event.kind === 'item_updated') &&
        event.item.kind === 'tool_result' &&
        (event.item.output as { partial?: string }).partial === 'hello'
    )
    expect(partialUpdate).toBeDefined()
    const result = (await h.sessionStore.loadItems(h.threadId)).find(
      (item) => item.kind === 'tool_result' && item.callId === 'call_streamer'
    )
    expect(result).toMatchObject({
      kind: 'tool_result',
      status: 'completed',
      output: { done: true }
    })
  })

  it('waits for GUI user input tool responses and resumes the turn', async () => {
    let calls = 0
    const h = makeHarness({
      provider: 'input-model',
      model: 'input-model',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        calls += 1
        if (calls === 1) {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_input',
            toolName: 'request_user_input',
            arguments: {
              prompt: 'Pick one',
              questions: [
                {
                  header: 'Decision',
                  id: 'choice',
                  question: 'Pick one',
                  options: [
                    { label: 'Yes', description: 'Continue' },
                    { label: 'No', description: 'Stop' }
                  ]
                }
              ]
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h)
    const resolver = resolveNextUserInput(h, [
      { id: 'choice', label: 'Yes', value: 'yes' }
    ])

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    await resolver

    expect(status).toBe('completed')
    const thread = await h.threadStore.get(h.threadId)
    const inputItem = thread?.turns
      .flatMap((turn) => turn.items)
      .find((item) => item.kind === 'user_input')
    expect(inputItem).toMatchObject({
      kind: 'user_input',
      status: 'submitted',
      questions: [
        {
          header: 'Decision',
          id: 'choice',
          question: 'Pick one',
          options: [
            { label: 'Yes', description: 'Continue' },
            { label: 'No', description: 'Stop' }
          ]
        }
      ]
    })
    const result = (await h.sessionStore.loadItems(h.threadId)).find((item) => item.kind === 'tool_result')
    expect(result).toMatchObject({
      kind: 'tool_result',
      toolName: 'request_user_input',
      isError: false
    })
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    expect(events.some((event) => event.kind === 'user_input_requested')).toBe(true)
    expect(events.some((event) => event.kind === 'user_input_resolved')).toBe(true)
  })

  it('uses the thread approval policy when executing auto tools', async () => {
    const approvalDecisions: string[] = []
    const tool = LocalToolHost.defineTool({
      name: 'dangerous_auto',
      description: 'Auto tool that should still prompt in untrusted mode.',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text']
      },
      policy: 'auto',
      execute: async (args) => ({ output: { echoed: args.text ?? '' } })
    })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'approval-check',
        model: 'approval-check',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_danger',
              toolName: 'dangerous_auto',
              arguments: { text: 'hi' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [tool] }
    )
    await h.threadStore.upsert(
      createThreadRecord({
        id: h.threadId,
        title: 'demo',
        workspace: '/tmp',
        model: 'fake',
        approvalPolicy: 'untrusted'
      })
    )
    const response = await h.turns.startTurn({
      threadId: h.threadId,
      request: { prompt: 'hello' }
    })
    h.turnId = response.turnId
    h.approvalGate.request = async (approval) => {
      approvalDecisions.push(approval.toolName)
      return 'allow'
    }

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(approvalDecisions).toEqual(['dangerous_auto'])
  })

  it('persists toolKind from the advertised tool metadata', async () => {
    const tool = LocalToolHost.defineTool({
      name: 'write_file',
      description: 'Write a file.',
      toolKind: 'file_change',
      inputSchema: {
        type: 'object',
        properties: { path: { type: 'string' } },
        required: ['path']
      },
      policy: 'auto',
      execute: async () => ({ output: { path: '/tmp/demo.ts' } })
    })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'file-tool',
        model: 'file-tool',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_file',
              toolName: 'write_file',
              arguments: { path: '/tmp/demo.ts' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [tool] }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)
    const toolCall = items.find((item) => item.kind === 'tool_call')
    const toolResult = items.find((item) => item.kind === 'tool_result')

    expect(status).toBe('completed')
    expect(toolCall).toMatchObject({ kind: 'tool_call', toolKind: 'file_change' })
    expect(toolResult).toMatchObject({ kind: 'tool_result', toolKind: 'file_change' })
  })

  it('records non-advertised tool calls as recoverable tool errors', async () => {
    let calls = 0
    const h = makeHarness(
      {
        provider: 'policy-recovery',
        model: 'policy-recovery',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_read',
              toolName: 'read',
              arguments: { path: 'draft.md' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'assistant_text_delta', text: '继续使用已开放工具。' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      {
        tools: buildDefaultLocalTools(),
        skillRuntime: {
          resolveTurn: () => ({
            activeSkillIds: ['knowledge-only'],
            activations: [],
            instructions: [],
            allowedToolNames: ['bash'],
            injectedBytes: 0
          })
        } as never
      }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(calls).toBe(2)
    const result = (await h.sessionStore.loadItems(h.threadId)).find(
      (item) => item.kind === 'tool_result' && item.callId === 'call_read'
    )
    expect(result).toMatchObject({ kind: 'tool_result', isError: true, toolName: 'read' })
    expect(result?.kind === 'tool_result' ? JSON.stringify(result.output) : '')
      .toContain('not advertised by active tool policy')
  })

  it('does not let a provider bypass a forced document step by calling bash', async () => {
    let modelCalls = 0
    let bashExecutions = 0
    let documentExecutions = 0
    const define = (
      name: string,
      execute: (args: Record<string, unknown>) => Promise<{ output: unknown }>
    ) => LocalToolHost.defineTool({
      name,
      description: name,
      inputSchema: { type: 'object', properties: {} },
      policy: 'auto',
      execute
    })
    const h = makeHarness({
      provider: 'request-tool-policy',
      model: 'request-tool-policy',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        modelCalls += 1
        if (modelCalls === 1) {
          expect(request.requiredToolName).toBe('document_skill_execute')
          expect(request.tools.map((tool) => tool.name)).toEqual(['document_skill_execute'])
          yield {
            kind: 'tool_call_complete',
            callId: 'call_forbidden_bash',
            toolName: 'bash',
            arguments: { command: 'python3 handwritten_docx.py' }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        if (modelCalls === 2) {
          yield {
            kind: 'tool_call_complete',
            callId: 'call_required_document',
            toolName: 'document_skill_execute',
            arguments: {
              kind: 'docx',
              operation: 'from-markdown',
              content: '# 算法行政报告\n\n完整正文。',
              outputPath: '算法行政报告.docx'
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: 'Word 已由文档主路径生成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      tools: [
        define('bash', async () => {
          bashExecutions += 1
          return { output: { exit_code: 0 } }
        }),
        define('document_skill_execute', async () => {
          documentExecutions += 1
          return {
            output: {
              status: 'ok',
              kind: 'docx',
              operation: 'from-markdown',
              output: '/tmp/算法行政报告.docx'
            }
          }
        })
      ]
    })
    await bootstrapThread(h, {
      request: { prompt: '请生成一份算法行政 Word 报告。' }
    })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(bashExecutions).toBe(0)
    expect(documentExecutions).toBe(1)
    const forbiddenResult = (await h.sessionStore.loadItems(h.threadId)).find(
      (item) => item.kind === 'tool_result' && item.callId === 'call_forbidden_bash'
    )
    expect(forbiddenResult).toMatchObject({ kind: 'tool_result', isError: true })
    expect(forbiddenResult?.kind === 'tool_result' ? JSON.stringify(forbiddenResult.output) : '')
      .toContain('not advertised by active tool policy')
  })

  it('omits create_plan from normal agent model requests', async () => {
    const observedTools: string[] = []
    const h = makeHarness(
      {
        provider: 'capture',
        model: 'capture',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          observedTools.push(...request.tools.map((tool) => tool.name))
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: buildDefaultLocalTools() }
    )
    await bootstrapThread(h)
    await h.loop.runTurn(h.threadId, h.turnId)
    expect(observedTools).not.toContain(CREATE_PLAN_TOOL_NAME)
  })

  it('injects active goal guidance and goal status tools into model requests', async () => {
    const observedRequests: ModelRequest[] = []
    const goalTools = [GET_GOAL_TOOL_NAME, UPDATE_GOAL_TOOL_NAME].map((name) =>
      LocalToolHost.defineTool({
        name,
        description: name,
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        policy: 'auto',
        execute: async () => ({ output: { ok: true } })
      })
    )
    const h = makeHarness(
      {
        provider: 'capture-goal',
        model: 'capture-goal',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          observedRequests.push(request)
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [...buildDefaultLocalTools(), ...goalTools] }
    )
    await bootstrapThread(h, { request: { prompt: 'check current memory usage' } })
    await h.threads.setGoal(h.threadId, {
      objective: 'check current memory usage',
      status: 'active'
    })

    await h.loop.runTurn(h.threadId, h.turnId)

    const [request] = observedRequests
    if (!request) throw new Error('expected model request')
    expect(request.contextInstructions?.join('\n')).toContain('继续推进当前任务目标。')
    expect(request.contextInstructions?.join('\n')).toContain('内部思考、工具决策和进度说明均默认使用简体中文。')
    expect(request.contextInstructions?.join('\n')).toContain('check current memory usage')
    expect(request.tools.map((tool) => tool.name)).toContain(GET_GOAL_TOOL_NAME)
    expect(request.tools.map((tool) => tool.name)).toContain(UPDATE_GOAL_TOOL_NAME)
  })

  it('continues an active goal after no-tool model turns until update_goal completes it', async () => {
    let h: ReturnType<typeof makeHarness>
    const goalTools = [
      LocalToolHost.defineTool({
        name: GET_GOAL_TOOL_NAME,
        description: 'Get goal',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (_args, context) => ({ output: { goal: await h.threads.getGoal(context.threadId) } })
      }),
      LocalToolHost.defineTool({
        name: UPDATE_GOAL_TOOL_NAME,
        description: 'Update goal',
        inputSchema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['complete', 'blocked'] }
          },
          required: ['status'],
          additionalProperties: false
        },
        policy: 'auto',
        execute: async (args, context) => {
          const status = args.status
          if (status !== 'complete' && status !== 'blocked') {
            return { output: { error: 'invalid status' }, isError: true }
          }
          const goal = await h.threads.setGoal(context.threadId, { status })
          return { output: { goal } }
        }
      })
    ]
    let calls = 0
    h = makeHarness(
      {
        provider: 'goal-continuation',
        model: 'goal-continuation',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          calls += 1
          if (calls === 1) {
            yield { kind: 'assistant_text_delta', text: 'Draft ready.' }
            yield { kind: 'completed', stopReason: 'stop' }
            return
          }
          if (calls === 2) {
            yield { kind: 'assistant_text_delta', text: 'Still working.' }
            yield { kind: 'completed', stopReason: 'stop' }
            return
          }
          if (calls === 3) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_complete_goal',
              toolName: UPDATE_GOAL_TOOL_NAME,
              arguments: { status: 'complete' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'assistant_text_delta', text: 'Goal complete.' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [...buildDefaultLocalTools(), ...goalTools] }
    )
    await bootstrapThread(h, { request: { prompt: 'write a benchmark note' } })
    await h.threads.setGoal(h.threadId, {
      objective: 'write a benchmark note',
      status: 'active'
    })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(calls).toBe(4)
    expect((await h.threads.getGoal(h.threadId))?.status).toBe('complete')
    const texts = (await h.sessionStore.loadItems(h.threadId))
      .filter((item) => item.kind === 'assistant_text')
      .map((item) => item.kind === 'assistant_text' ? item.text : '')
    expect(texts).toEqual(['Draft ready.', 'Still working.', 'Goal complete.'])
  })

  it('persists the canonical tool catalog fingerprint on each turn', async () => {
    const h = makeHarness(makeSilentModel(), { tools: buildDefaultLocalTools() })
    await bootstrapThread(h)

    await h.loop.runTurn(h.threadId, h.turnId)

    const turn = await h.turns.getTurn(h.threadId, h.turnId)
    expect(turn?.toolCatalogFingerprint).toMatch(/^[0-9a-f]{16}$/)
    expect(turn?.toolCatalogToolCount).toBeGreaterThan(0)
    expect(turn?.toolCatalogDrift).toBe(false)
  })

  it('uses persisted GUI plan context to advertise and execute create_plan', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-loop-plan-'))
    const observedToolLists: string[][] = []
    const observedRequiredToolNames: Array<string | undefined> = []
    try {
      const h = makeHarness(
        {
          provider: 'planner',
          model: 'planner',
          async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
            observedToolLists.push(request.tools.map((tool) => tool.name))
            observedRequiredToolNames.push(request.requiredToolName)
            if (observedToolLists.length === 1) {
              yield {
                kind: 'tool_call_complete',
                callId: 'call_plan',
                toolName: CREATE_PLAN_TOOL_NAME,
                arguments: {
                  markdown: '# Generated plan',
                  operation: 'draft',
                  source_request: 'Add auth'
                }
              }
              yield { kind: 'completed', stopReason: 'tool_calls' }
              return
            }
            yield { kind: 'completed', stopReason: 'stop' }
          }
        },
        { tools: buildDefaultLocalTools() }
      )
      await bootstrapThread(h, {
        workspace,
        request: {
          prompt: 'Plan auth',
          guiPlan: {
            operation: 'draft',
            workspaceRoot: workspace,
            relativePath: '.legalworksdd/plan/auth.md',
            planId: `${workspace}:.legalworksdd/plan/auth.md`,
            sourceRequest: 'Add auth',
            title: 'Auth'
          }
        }
      })
      const status = await h.loop.runTurn(h.threadId, h.turnId)
      expect(status).toBe('completed')
      expect(observedToolLists[0]).toContain(CREATE_PLAN_TOOL_NAME)
      expect(observedRequiredToolNames).toEqual([CREATE_PLAN_TOOL_NAME, undefined])
      await expect(readFile(join(workspace, '.legalworksdd/plan/auth.md'), 'utf8')).resolves.toBe('# Generated plan')
      const turn = await h.turns.getTurn(h.threadId, h.turnId)
      expect(turn?.guiPlan?.relativePath).toBe('.legalworksdd/plan/auth.md')
      const items = await h.sessionStore.loadItems(h.threadId)
      const result = items.find((item) => item.kind === 'tool_result' && item.callId === 'call_plan')
      expect(result).toBeDefined()
      if (result?.kind === 'tool_result') {
        expect(result.toolName).toBe(CREATE_PLAN_TOOL_NAME)
        expect(result.output).toMatchObject({
          relative_path: '.legalworksdd/plan/auth.md',
          workspace_root: workspace,
          operation: 'draft'
        })
      }
    } finally {
      await rm(workspace, { recursive: true, force: true })
    }
  })

  it('does not let an activated Skill hide create_plan from a GUI plan turn', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-loop-plan-skill-allowlist-'))
    const observedToolLists: string[][] = []
    try {
      const h = makeHarness(
        {
          provider: 'planner',
          model: 'planner',
          async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
            observedToolLists.push(request.tools.map((tool) => tool.name))
            if (request.requiredToolName === CREATE_PLAN_TOOL_NAME) {
              yield {
                kind: 'tool_call_complete',
                callId: 'call_plan_restricted',
                toolName: CREATE_PLAN_TOOL_NAME,
                arguments: {
                  markdown: '# Restricted skill plan',
                  operation: 'draft',
                  source_request: '审核案件材料'
                }
              }
              yield { kind: 'completed', stopReason: 'tool_calls' }
              return
            }
            yield { kind: 'assistant_text_delta', text: '计划已保存。' }
            yield { kind: 'completed', stopReason: 'stop' }
          }
        },
        {
          tools: buildDefaultLocalTools(),
          skillRuntime: {
            resolveTurn: () => ({
              activeSkillIds: ['ocr-extraction', 'litigation-prep'],
              activations: [],
              instructions: [],
              allowedToolNames: ['bash', 'write', 'document_skill_execute'],
              injectedBytes: 0
            })
          } as never
        }
      )
      await bootstrapThread(h, {
        workspace,
        request: {
          prompt: '为案件材料制定审查计划',
          mode: 'plan',
          guiPlan: {
            operation: 'draft',
            workspaceRoot: workspace,
            relativePath: '.legalworksdd/plan/restricted.md',
            planId: 'restricted-plan',
            sourceRequest: '审核案件材料'
          }
        }
      })

      const status = await h.loop.runTurn(h.threadId, h.turnId)

      expect(status).toBe('completed')
      expect(observedToolLists[0]).toEqual([CREATE_PLAN_TOOL_NAME])
      await expect(readFile(join(workspace, '.legalworksdd/plan/restricted.md'), 'utf8'))
        .resolves.toBe('# Restricted skill plan')
    } finally {
      await rm(workspace, { recursive: true, force: true })
    }
  })

  it('materializes assistant plan text when a GUI plan turn misses create_plan', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-loop-plan-missing-tool-'))
    try {
      const h = makeHarness(
        {
          provider: 'planner',
          model: 'planner',
          async *stream(): AsyncIterable<ModelStreamChunk> {
            yield { kind: 'assistant_text_delta', text: '## Plan\nImplement auth.\n' }
            yield { kind: 'completed', stopReason: 'stop' }
          }
        },
        { tools: buildDefaultLocalTools() }
      )
      await bootstrapThread(h, {
        workspace,
        request: {
          prompt: 'Plan auth',
          guiPlan: {
            operation: 'draft',
            workspaceRoot: workspace,
            relativePath: '.legalworksdd/plan/auth.md',
            planId: `${workspace}:.legalworksdd/plan/auth.md`,
            sourceRequest: 'Add auth'
          }
        }
      })

      const status = await h.loop.runTurn(h.threadId, h.turnId)
      const items = await h.sessionStore.loadItems(h.threadId)

      expect(status).toBe('completed')
      await expect(readFile(join(workspace, '.legalworksdd/plan/auth.md'), 'utf8')).resolves.toBe(
        '## Plan\nImplement auth.'
      )
      expect(items.some((item) =>
        item.kind === 'tool_result' &&
        item.toolName === CREATE_PLAN_TOOL_NAME &&
        item.isError !== true
      )).toBe(true)
    } finally {
      await rm(workspace, { recursive: true, force: true })
    }
  })

  it('materializes assistant plan text for plan-mode turns without a reserved context', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-loop-plan-free-form-text-'))
    try {
      const h = makeHarness(
        {
          provider: 'planner',
          model: 'planner',
          async *stream(): AsyncIterable<ModelStreamChunk> {
            yield { kind: 'assistant_text_delta', text: '## Plan\nPolish the sidebar footer.\n' }
            yield { kind: 'completed', stopReason: 'stop' }
          }
        },
        { tools: buildDefaultLocalTools() }
      )
      await bootstrapThread(h, {
        workspace,
        request: {
          prompt: 'Plan sidebar footer polish',
          mode: 'plan'
        }
      })

      const status = await h.loop.runTurn(h.threadId, h.turnId)
      const items = await h.sessionStore.loadItems(h.threadId)
      const planResult = items.find((item) =>
        item.kind === 'tool_result' && item.toolName === CREATE_PLAN_TOOL_NAME
      )

      expect(status).toBe('completed')
      expect(planResult?.kind === 'tool_result' && planResult.isError).not.toBe(true)
      expect(
        planResult?.kind === 'tool_result' &&
        (planResult.output as { relative_path?: string }).relative_path
      ).toBe('.legalworksdd/plan/plan-sidebar-footer-polish.md')
      await expect(readFile(join(workspace, '.legalworksdd/plan/plan-sidebar-footer-polish.md'), 'utf8')).resolves.toBe(
        '## Plan\nPolish the sidebar footer.'
      )
    } finally {
      await rm(workspace, { recursive: true, force: true })
    }
  })

  it('fails GUI plan turns only when neither create_plan nor plan text is returned', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-loop-plan-empty-'))
    try {
      const h = makeHarness(
        {
          provider: 'planner',
          model: 'planner',
          async *stream(): AsyncIterable<ModelStreamChunk> {
            yield { kind: 'completed', stopReason: 'stop' }
          }
        },
        { tools: buildDefaultLocalTools() }
      )
      await bootstrapThread(h, {
        workspace,
        request: {
          prompt: 'Plan auth',
          guiPlan: {
            operation: 'draft',
            workspaceRoot: workspace,
            relativePath: '.legalworksdd/plan/auth.md',
            planId: `${workspace}:.legalworksdd/plan/auth.md`,
            sourceRequest: 'Add auth'
          }
        }
      })

      const status = await h.loop.runTurn(h.threadId, h.turnId)
      const items = await h.sessionStore.loadItems(h.threadId)
      const events = await h.sessionStore.loadEventsSince(h.threadId, 0)

      expect(status).toBe('failed')
      expect(items.some((item) =>
        item.kind === 'error' && item.code === 'required_tool_missing'
      )).toBe(true)
      expect(events.some((event) =>
        event.kind === 'error' && event.code === 'required_tool_missing'
      )).toBe(true)
    } finally {
      await rm(workspace, { recursive: true, force: true })
    }
  })

  it('keeps requiring create_plan after unrelated tool calls in a GUI plan turn', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-loop-plan-other-tool-'))
    const observedRequiredToolNames: Array<string | undefined> = []
    let calls = 0
    try {
      const h = makeHarness(
        {
          provider: 'planner',
          model: 'planner',
          async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
            observedRequiredToolNames.push(request.requiredToolName)
            calls += 1
            if (calls === 1) {
              yield {
                kind: 'tool_call_complete',
                callId: 'call_echo',
                toolName: 'echo',
                arguments: { text: 'not a plan' }
              }
              yield { kind: 'completed', stopReason: 'tool_calls' }
              return
            }
            yield { kind: 'assistant_text_delta', text: '## Plan\nImplement auth after checking context.\n' }
            yield { kind: 'completed', stopReason: 'stop' }
          }
        },
        { tools: buildDefaultLocalTools() }
      )
      await bootstrapThread(h, {
        workspace,
        request: {
          prompt: 'Plan auth',
          guiPlan: {
            operation: 'draft',
            workspaceRoot: workspace,
            relativePath: '.legalworksdd/plan/auth.md',
            planId: `${workspace}:.legalworksdd/plan/auth.md`,
            sourceRequest: 'Add auth'
          }
        }
      })

      const status = await h.loop.runTurn(h.threadId, h.turnId)

      expect(status).toBe('completed')
      expect(observedRequiredToolNames).toEqual([CREATE_PLAN_TOOL_NAME, CREATE_PLAN_TOOL_NAME, undefined])
      await expect(readFile(join(workspace, '.legalworksdd/plan/auth.md'), 'utf8')).resolves.toBe(
        '## Plan\nImplement auth after checking context.'
      )
    } finally {
      await rm(workspace, { recursive: true, force: true })
    }
  })

  it('steers the turn and injects user messages', async () => {
    const h = makeHarness(makeSilentModel())
    await bootstrapThread(h)
    h.steering.enqueue(h.turnId, 'follow up')
    await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)
    const user = items.find((item) => item.kind === 'user_message' && item.text === 'follow up')
    expect(user).toBeDefined()
  })

  it('cleans up inflight ids after success and error', async () => {
    const h = makeHarness({
      provider: 'flaky',
      model: 'flaky',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        yield { kind: 'error', message: 'boom' }
        yield { kind: 'completed', stopReason: 'error' }
      }
    })
    await bootstrapThread(h)
    await h.loop.runTurn(h.threadId, h.turnId)
    expect(h.inflight.size()).toBe(0)
  })

  it('keeps the prefix stable when the system prompt does not change', () => {
    const a = createImmutablePrefix({ systemPrompt: 'be brief' })
    const b = createImmutablePrefix({ systemPrompt: 'be brief' })
    expect(a.fingerprint).toBe(b.fingerprint)
    const drifted = setSystemPrompt(a, 'be thorough')
    expect(drifted.fingerprint).not.toBe(a.fingerprint)
  })

  it('keeps DeepSeek history intact until the 1M window is genuinely near capacity', () => {
    const compactor = new ContextCompactor()
    const smallItems = [
      makeUserItem({
        id: 'small_history',
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: 'short'
      })
    ]

    expect(resolveModelContextProfile('deepseek-v4-pro')?.contextWindowTokens).toBe(1_000_000)
    expect(resolveModelContextProfile('provider/deepseek-v4-flash')?.contextWindowTokens).toBe(1_000_000)
    expect(resolveModelContextProfile('deepseek-chat')?.canonicalModel).toBe('deepseek-flash')
    expect(resolveModelContextProfile('deepseek-reasoner')?.canonicalModel).toBe('deepseek-flash')
    expect(compactor.shouldCompact(smallItems, {
      model: 'deepseek-v4-flash', promptTokens: 899_999
    })).toBe(false)
    expect(compactor.shouldCompact(smallItems, {
      model: 'deepseek-v4-pro', promptTokens: 900_000
    })).toBe(true)
    expect(compactor.hardCap('deepseek-v4-flash')).toBe(950_000)
  })

  it('does not compact merely because a history contains many short items', () => {
    const compactor = new ContextCompactor({ softThreshold: 1_000_000, hardThreshold: 1_100_000 })
    const items = Array.from({ length: 300 }, (_, index) => makeUserItem({
      id: `short_${index}`,
      turnId: 'turn_1',
      threadId: 'thr_1',
      text: 'ok'
    }))

    expect(compactor.shouldCompact(items)).toBe(false)
  })

  it('uses reported prompt tokens as a compaction pressure signal', () => {
    const compactor = new ContextCompactor({ softThreshold: 100, hardThreshold: 200 })
    const tinyHistory = [
      makeUserItem({
        id: 'tiny_history',
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: 'short'
      })
    ]

    expect(compactor.shouldCompact(tinyHistory)).toBe(false)
    expect(compactor.shouldCompact(tinyHistory, { promptTokens: 120 })).toBe(true)
  })

  it('estimates Chinese history conservatively enough to trigger compaction', () => {
    const compactor = new ContextCompactor({ softThreshold: 100, hardThreshold: 200 })
    const chineseHistory = [
      makeUserItem({
        id: 'chinese_history',
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: '这是需要完整保留的关键案件事实和用户要求。'.repeat(6)
      })
    ]

    expect(compactor.estimate(chineseHistory)).toBeGreaterThanOrEqual(100)
    expect(compactor.shouldCompact(chineseHistory)).toBe(true)
  })

  it('recognizes provider context-window errors without treating ordinary 400s as overflow', () => {
    expect(isContextWindowExceededError(
      "This model's maximum context length is 1048576 tokens. However, you requested 1057631 tokens."
    )).toBe(true)
    expect(isContextWindowExceededError('invalid API key (status 400)')).toBe(false)
  })

  it('plans normal, aggressive, and force compaction levels', () => {
    const compactor = new ContextCompactor({ softThreshold: 100, hardThreshold: 200 })
    const tinyHistory = [
      makeUserItem({
        id: 'tiny_history',
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: 'short'
      })
    ]

    expect(compactor.planCompaction(tinyHistory, { promptTokens: 120 })).toMatchObject({
      mode: 'normal',
      keepRecent: 4
    })
    expect(compactor.planCompaction(tinyHistory, { promptTokens: 160 })).toMatchObject({
      mode: 'aggressive',
      keepRecent: 2
    })
    expect(compactor.planCompaction(tinyHistory, { promptTokens: 220 })).toMatchObject({
      mode: 'force',
      keepRecent: 0
    })
  })

  it('trims trailing tool calls and preserves skill pins in compaction summaries', () => {
    const compactor = new ContextCompactor({ softThreshold: 1, hardThreshold: 2 })
    const prefix = createImmutablePrefix({ systemPrompt: 'system' })
    const result = compactor.compact({
      threadId: 'thr_1',
      turnId: 'turn_1',
      prefix,
      keepRecent: 1,
      history: [
        makeUserItem({ id: 'u1', turnId: 'turn_1', threadId: 'thr_1', text: 'first request' }),
        makeAssistantTextItem({
          id: 'a1',
          turnId: 'turn_1',
          threadId: 'thr_1',
          text: 'Active Skill: documents (documents)',
          status: 'completed'
        }),
        makeToolCallItem({
          id: 'call_trailing',
          turnId: 'turn_1',
          threadId: 'thr_1',
          callId: 'call_trailing',
          toolName: 'read',
          arguments: { path: 'a.txt' }
        })
      ]
    })

    expect(result.next.some((item) => item.kind === 'tool_call')).toBe(false)
    expect(result.summaryItem.kind === 'compaction' ? result.summaryItem.summary : '')
      .toContain('Active Skill: documents (documents)')
  })

  it('retains substantive user requirements even when they are buried in long tool history', () => {
    const compactor = new ContextCompactor({ softThreshold: 1, hardThreshold: 2 })
    const prefix = createImmutablePrefix({ systemPrompt: 'system' })
    const history: TurnItem[] = [
      ...Array.from({ length: 50 }, (_, index) => makeAssistantTextItem({
        id: `before_${index}`,
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: `transient research ${index}`,
        status: 'completed'
      })),
      makeUserItem({
        id: 'durable_framework',
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: '按我的新框架重构全文，保留原文可用案例，并补充最新参考文献。'
      }),
      ...Array.from({ length: 50 }, (_, index) => makeAssistantTextItem({
        id: `after_${index}`,
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: `more transient research ${index}`,
        status: 'completed'
      }))
    ]

    const result = compactor.compact({
      threadId: 'thr_1',
      turnId: 'turn_1',
      prefix,
      keepRecent: 1,
      history
    })
    const summary = result.summaryItem.kind === 'compaction' ? result.summaryItem.summary : ''

    expect(summary).toContain('按我的新框架重构全文')
    expect(summary).toContain('Durable user requests')
  })

  it('keeps every uploaded file id in the durable compaction summary', () => {
    const compactor = new ContextCompactor({ softThreshold: 1, hardThreshold: 2 })
    const prefix = createImmutablePrefix({ systemPrompt: 'system' })
    const history: TurnItem[] = [
      makeUserItem({
        id: 'attachment_request',
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: '请以附件合同为准完成审查，并保留全部关键事实。',
        attachmentIds: ['att_1234567890abcdef12345678', 'att_abcdef1234567890abcdef12']
      }),
      makeAssistantTextItem({
        id: 'transient_reply',
        turnId: 'turn_1',
        threadId: 'thr_1',
        text: '正在处理。',
        status: 'completed'
      }),
      makeUserItem({ id: 'recent', turnId: 'turn_1', threadId: 'thr_1', text: '继续' })
    ]

    const result = compactor.compact({
      threadId: 'thr_1',
      turnId: 'turn_1',
      prefix,
      keepRecent: 1,
      history
    })
    const summary = result.summaryItem.kind === 'compaction' ? result.summaryItem.summary : ''

    expect(summary).toContain('请以附件合同为准完成审查')
    expect(summary).toContain('att_1234567890abcdef12345678')
    expect(summary).toContain('att_abcdef1234567890abcdef12')
    expect(summary).toContain('Uploaded file registry')
  })

  it('carries durable user facts through repeated compactions', () => {
    const compactor = new ContextCompactor({ softThreshold: 1, hardThreshold: 2 })
    const prefix = createImmutablePrefix({ systemPrompt: 'system' })
    const first = compactor.compact({
      threadId: 'thr_1',
      turnId: 'turn_1',
      prefix,
      keepRecent: 0,
      history: [
        makeUserItem({
          id: 'original_fact',
          turnId: 'turn_1',
          threadId: 'thr_1',
          text: '关键事实：付款日期是2026年8月8日，争议金额是88万元。',
          attachmentIds: ['att_1234567890abcdef12345678']
        })
      ]
    })
    const second = compactor.compact({
      threadId: 'thr_1',
      turnId: 'turn_2',
      prefix,
      keepRecent: 0,
      history: [
        first.summaryItem,
        makeUserItem({ id: 'follow_up', turnId: 'turn_2', threadId: 'thr_1', text: '继续分析违约责任。' })
      ]
    })
    const summary = second.summaryItem.kind === 'compaction' ? second.summaryItem.summary : ''

    expect(summary).toContain('付款日期是2026年8月8日')
    expect(summary).toContain('争议金额是88万元')
    expect(summary).toContain('att_1234567890abcdef12345678')
  })

  it('automatically compacts and retries after a provider context overflow', async () => {
    let calls = 0
    const requests: ModelRequest[] = []
    const h = makeHarness(
      {
        provider: 'overflow-test',
        model: 'fake',
        async *stream(request): AsyncIterable<ModelStreamChunk> {
          calls += 1
          requests.push(request)
          if (calls === 1) {
            yield {
              kind: 'error',
              message: "This model's maximum context length is 200 tokens. However, you requested 260 tokens.",
              code: 'invalid_request_error'
            }
            yield { kind: 'completed', stopReason: 'error' }
            return
          }
          yield { kind: 'assistant_text_delta', text: '压缩后已恢复。' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { compactor: new ContextCompactor({ softThreshold: 100, hardThreshold: 200 }) }
    )
    await bootstrapThread(h)
    for (let index = 0; index < 8; index += 1) {
      await h.sessionStore.appendItem(
        h.threadId,
        makeUserItem({
          id: `overflow_history_${index}`,
          turnId: h.turnId,
          threadId: h.threadId,
          text: `关键事实${index}：` + '案情材料'.repeat(8)
        })
      )
    }

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const persisted = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(calls).toBe(2)
    expect(requests[1]?.history.some((item) => item.kind === 'compaction')).toBe(true)
    expect(persisted.some((item) => item.kind === 'compaction')).toBe(true)
    expect(persisted.some((item) => item.kind === 'error' && item.code === 'invalid_request_error')).toBe(false)
  })

  it('embeds a digest marker and skips frozen messages when compacting history', () => {
    const compactor = new ContextCompactor({ softThreshold: 1, hardThreshold: 2 })
    const prefix = createImmutablePrefix({ systemPrompt: 'system' })
    const result = compactor.compact({
      threadId: 'thr_1',
      turnId: 'turn_1',
      prefix,
      keepRecent: 1,
      frozenMessageCount: 1,
      history: [
        makeUserItem({ id: 'frozen', turnId: 'turn_1', threadId: 'thr_1', text: 'already processed upstream' }),
        makeUserItem({ id: 'u1', turnId: 'turn_1', threadId: 'thr_1', text: 'fold alpha' }),
        makeAssistantTextItem({
          id: 'a1',
          turnId: 'turn_1',
          threadId: 'thr_1',
          text: 'fold beta',
          status: 'completed'
        }),
        makeUserItem({ id: 'u2', turnId: 'turn_1', threadId: 'thr_1', text: 'keep gamma' })
      ]
    })
    const summary = result.summaryItem.kind === 'compaction' ? result.summaryItem.summary : ''

    expect(result.next.map((item) => item.id)).toEqual(['frozen', result.summaryItem.id, 'u2'])
    expect(summary).toContain('fold alpha')
    expect(summary).not.toContain('already processed upstream')
    expect(result.summaryItem.kind === 'compaction' ? result.summaryItem.sourceDigest : '')
      .toMatch(/^[0-9a-f]{16}$/)
    expect(result.summaryItem.kind === 'compaction' ? result.summaryItem.digestMarker : '')
      .toBe(`<legalwork:tool_digest sha256="${result.summaryItem.kind === 'compaction' ? result.summaryItem.sourceDigest : ''}">`)
    expect(result.summaryItem.kind === 'compaction' ? result.summaryItem.sourceItemIds : [])
      .toEqual(['u1', 'a1'])
    expect(summary).toContain(result.summaryItem.kind === 'compaction' ? result.summaryItem.digestMarker : '')
  })

  it('accepts configured context compaction thresholds and model profiles', () => {
    const compactor = new ContextCompactor({
      contextCompaction: {
        defaultSoftThreshold: 123,
        defaultHardThreshold: 456,
        modelProfiles: {
          'custom-model': {
            aliases: ['vendor/custom-model'],
            softThreshold: 1_000,
            hardThreshold: 2_000
          }
        }
      }
    })

    expect(compactor.thresholds()).toEqual({ softThreshold: 123, hardThreshold: 456 })
    expect(compactor.thresholds('vendor/custom-model')).toEqual({
      softThreshold: 1_000,
      hardThreshold: 2_000
    })
  })

  it('compacts the history when the soft threshold is reached', async () => {
    const h = makeHarness(makeSilentModel(), {
      compactor: new ContextCompactor({ softThreshold: 8, hardThreshold: 16 })
    })
    await bootstrapThread(h)
    for (let i = 0; i < 10; i += 1) {
      await h.sessionStore.appendItem(
        h.threadId,
        makeUserItem({ id: `hist_${i}`, turnId: h.turnId, threadId: h.threadId, text: 'x'.repeat(20) })
      )
    }
    await h.loop.runTurn(h.threadId, h.turnId)
    const items = await h.sessionStore.loadItems(h.threadId)
    expect(items.some((item) => item.kind === 'compaction')).toBe(true)
  })

  it('can use a model summary for history compaction while reusing the main prefix', async () => {
    const requests: ModelRequest[] = []
    const h = makeHarness(
      {
        provider: 'fold-summary',
        model: 'fold-summary',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          requests.push(request)
          const isSummaryRequest = request.tools.length === 0 &&
            request.contextInstructions?.some((text) => text.includes('history fold'))
          if (isSummaryRequest) {
            yield {
              kind: 'usage',
              usage: {
                promptTokens: 22,
                completionTokens: 7,
                totalTokens: 29,
                cachedTokens: 0,
                cacheHitTokens: 0,
                cacheMissTokens: 22,
                cacheHitRate: 0,
                turns: 1
              }
            }
            yield {
              kind: 'assistant_text_delta',
              text: 'Model summary: preserve alpha.txt and continue with beta.'
            }
            yield { kind: 'completed', stopReason: 'stop' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      {
        compactor: new ContextCompactor({ softThreshold: 8, hardThreshold: 16 }),
        contextCompaction: {
          summaryMode: 'model',
          summaryTimeoutMs: 5_000,
          summaryMaxTokens: 333,
          summaryInputMaxBytes: 4_096
        }
      }
    )
    await bootstrapThread(h)
    for (let i = 0; i < 10; i += 1) {
      await h.sessionStore.appendItem(
        h.threadId,
        makeUserItem({
          id: `model_summary_hist_${i}`,
          turnId: h.turnId,
          threadId: h.threadId,
          text: `alpha.txt observation ${i}; next step beta ${'x'.repeat(24)}`
        })
      )
    }

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const [summaryRequest, mainRequest] = requests
    if (!summaryRequest || !mainRequest) throw new Error('expected summary and main model requests')
    const summaryPromptItem = summaryRequest.history[0]
    const persisted = await h.sessionStore.loadItems(h.threadId)
    const persistedSummary = persisted.find((item) => item.kind === 'compaction')
    const mainSummary = mainRequest.history.find((item) => item.kind === 'compaction')

    expect(status).toBe('completed')
    expect(requests).toHaveLength(2)
    expect(summaryRequest.systemPrompt).toBe('be brief')
    expect(summaryRequest.prefix).toBe(h.prefix.fewShots)
    expect(summaryRequest.tools).toEqual([])
    expect(summaryRequest.maxTokens).toBe(333)
    expect(summaryRequest.temperature).toBe(0)
    expect(summaryRequest.reasoningEffort).toBe('off')
    expect(summaryRequest.contextInstructions?.join('\n')).toContain('history fold')
    expect(summaryPromptItem?.kind).toBe('user_message')
    expect(summaryPromptItem?.kind === 'user_message' ? summaryPromptItem.text : '')
      .toContain('需要折叠的历史摘录')
    expect(mainSummary?.kind === 'compaction' ? mainSummary.summary : '')
      .toContain('Model summary: preserve alpha.txt')
    expect(persistedSummary?.kind === 'compaction' ? persistedSummary.summary : '')
      .toContain('Model summary: preserve alpha.txt')
  })

  it('records a visible fallback event when configured model compaction summaries fail', async () => {
    const requests: ModelRequest[] = []
    const h = makeHarness(
      {
        provider: 'fold-summary-fails',
        model: 'fold-summary-fails',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          requests.push(request)
          const isSummaryRequest = request.tools.length === 0 &&
            request.contextInstructions?.some((text) => text.includes('history fold'))
          if (isSummaryRequest) {
            yield { kind: 'error', message: 'summary model unavailable', code: 'summary_down' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      {
        compactor: new ContextCompactor({ softThreshold: 8, hardThreshold: 16 }),
        contextCompaction: {
          summaryMode: 'model',
          summaryTimeoutMs: 5_000
        }
      }
    )
    await bootstrapThread(h)
    for (let i = 0; i < 10; i += 1) {
      await h.sessionStore.appendItem(
        h.threadId,
        makeUserItem({
          id: `fallback_hist_${i}`,
          turnId: h.turnId,
          threadId: h.threadId,
          text: `fallback observation ${i} ${'x'.repeat(24)}`
        })
      )
    }

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    const fallback = events.find(
      (event) => event.kind === 'error' && event.code === 'compaction_summary_fallback'
    )
    const persisted = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(requests).toHaveLength(2)
    expect(fallback?.kind === 'error' ? fallback.message : '').toContain('summary model unavailable')
    expect(persisted.some((item) =>
      item.kind === 'compaction' &&
      item.summary.includes('Conversation and work summary:') &&
      item.summary.includes('<legalwork:tool_digest sha256=')
    )).toBe(true)
  })

  it('compacts on the next step when provider usage reports high prompt tokens', async () => {
    const seenHistory: TurnItem[][] = []
    const echoTool = LocalToolHost.defineTool({
      name: 'echo',
      description: 'Echo text',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text']
      },
      policy: 'auto',
      execute: async () => ({ output: 'tool result from high usage turn' })
    })
    let calls = 0
    const h = makeHarness(
      {
        provider: 'usage-pressure',
        model: 'usage-pressure',
        async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
          seenHistory.push(request.history)
          calls += 1
          if (calls === 1) {
            yield {
              kind: 'usage',
              usage: {
                promptTokens: 12,
                completionTokens: 1,
                totalTokens: 13,
                cachedTokens: 0,
                cacheHitTokens: 0,
                cacheMissTokens: 12,
                cacheHitRate: 0,
                turns: 1
              }
            }
            yield {
              kind: 'tool_call_complete',
              callId: 'call_echo',
              toolName: 'echo',
              arguments: { text: 'hi' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      {
        tools: [echoTool],
        compactor: new ContextCompactor({ softThreshold: 10, hardThreshold: 20 })
      }
    )
    await bootstrapThread(h)

    const status = await h.loop.runTurn(h.threadId, h.turnId)
    const secondHistory = seenHistory[1] ?? []
    const persisted = await h.sessionStore.loadItems(h.threadId)

    expect(status).toBe('completed')
    expect(seenHistory[0]?.some((item) => item.kind === 'compaction')).toBe(false)
    expect(secondHistory[0]?.kind).toBe('compaction')
    expect(secondHistory.some((item) => item.kind === 'tool_result')).toBe(true)
    expect(
      secondHistory.some((item) =>
        item.kind === 'compaction' && item.summary.includes('compaction threshold')
      )
    ).toBe(true)
    expect(persisted.some((item) => item.kind === 'compaction')).toBe(true)
  })

  it('warns once near the thread cost budget and blocks when exhausted', async () => {
    let modelCalls = 0
    const h = makeHarness({
      provider: 'budget',
      model: 'budget',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        modelCalls += 1
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h)
    const thread = await h.threadStore.get(h.threadId)
    await h.threadStore.upsert({ ...thread!, costBudgetUsd: 10 })
    h.usage.record(h.threadId, {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cacheHitRate: null,
      turns: 0,
      costUsd: 8
    })

    await h.loop.runTurn(h.threadId, h.turnId)
    const warnedThread = await h.threadStore.get(h.threadId)
    expect(modelCalls).toBe(1)
    expect(warnedThread?.costBudgetWarningSent).toBe(true)
    expect((await h.sessionStore.loadItems(h.threadId)).some((item) =>
      item.kind === 'error' && item.code === 'budget_warning'
    )).toBe(true)

    const second = await h.turns.startTurn({ threadId: h.threadId, request: { prompt: 'again' } })
    h.turnId = second.turnId
    h.usage.record(h.threadId, {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      cacheHitRate: null,
      turns: 0,
      costUsd: 2
    })
    await h.loop.runTurn(h.threadId, h.turnId)
    expect(modelCalls).toBe(1)
    expect((await h.sessionStore.loadItems(h.threadId)).some((item) =>
      item.kind === 'error' && item.code === 'budget_limited'
    )).toBe(true)
  })

  it('does not auto-compact DeepSeek v4 turns at the legacy threshold', async () => {
    const h = makeHarness(makeSilentModel(), {
      compactor: new ContextCompactor()
    })
    await bootstrapThread(h, { request: { prompt: 'hello', model: 'deepseek-v4-flash' } })
    await h.sessionStore.appendItem(
      h.threadId,
      makeUserItem({
        id: 'legacy_threshold_sized_history',
        turnId: h.turnId,
        threadId: h.threadId,
        text: 'x'.repeat(80_000)
      })
    )

    await h.loop.runTurn(h.threadId, h.turnId)

    const items = await h.sessionStore.loadItems(h.threadId)
    expect(items.some((item) => item.kind === 'compaction')).toBe(false)
  })

  it('routes turn model auto before sending the real model request', async () => {
    const seenModels: string[] = []
    const h = makeHarness({
      provider: 'router-recorder',
      model: 'fallback',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        seenModels.push(request.model)
        if (request.turnId.endsWith('_auto_router')) {
          expect(request.stream).toBe(false)
          expect(request.maxTokens).toBe(96)
          yield { kind: 'assistant_text_delta', text: '{"model":"deepseek-v4-pro","thinking":"max"}' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        expect(request.reasoningEffort).toBe('max')
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await h.threadStore.upsert(
      createThreadRecord({
        id: h.threadId,
        title: 'demo',
        workspace: '/tmp',
        model: 'deepseek-v4-flash'
      })
    )
    const { turnId } = await h.turns.startTurn({
      threadId: h.threadId,
      request: { prompt: 'hello', model: 'auto' }
    })

    await h.loop.runTurn(h.threadId, turnId)

    expect(seenModels).toEqual(['deepseek-flash', 'deepseek-v4-pro'])
  })

  it('keeps explicit turn reasoning effort when auto routing chooses the model', async () => {
    const seenModels: string[] = []
    const h = makeHarness({
      provider: 'router-reasoning-override',
      model: 'fallback',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        seenModels.push(request.model)
        if (request.turnId.endsWith('_auto_router')) {
          yield { kind: 'assistant_text_delta', text: '{"model":"deepseek-v4-pro","thinking":"max"}' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        expect(request.reasoningEffort).toBe('low')
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await h.threadStore.upsert(
      createThreadRecord({
        id: h.threadId,
        title: 'demo',
        workspace: '/tmp',
        model: 'auto'
      })
    )
    const { turnId } = await h.turns.startTurn({
      threadId: h.threadId,
      request: { prompt: 'hello', model: 'auto', reasoningEffort: 'low' }
    })

    await h.loop.runTurn(h.threadId, turnId)

    expect(seenModels).toEqual(['deepseek-flash', 'deepseek-v4-pro'])
  })

  it('falls back to a concrete heuristic model when auto router fails', async () => {
    let realRequestModel = ''
    const h = makeHarness({
      provider: 'router-failure',
      model: 'auto',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        if (request.turnId.endsWith('_auto_router')) {
          yield { kind: 'error', message: 'router unavailable' }
          return
        }
        realRequestModel = request.model
        expect(request.reasoningEffort).toBe('high')
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await h.threadStore.upsert(
      createThreadRecord({
        id: h.threadId,
        title: 'demo',
        workspace: '/tmp',
        model: 'auto'
      })
    )
    const { turnId } = await h.turns.startTurn({
      threadId: h.threadId,
      request: { prompt: 'hello' }
    })

    await h.loop.runTurn(h.threadId, turnId)

    expect(realRequestModel).toBe('deepseek-flash')
  })

  it('uses the latest compaction item as the effective history boundary', async () => {
    const seenHistory: ModelRequest['history'][] = []
    const h = makeHarness({
      provider: 'recorder',
      model: 'recorder',
      async *stream(request: ModelRequest): AsyncIterable<ModelStreamChunk> {
        seenHistory.push(request.history)
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, {
      compactor: new ContextCompactor({ softThreshold: 100_000, hardThreshold: 120_000 })
    })
    await bootstrapThread(h)
    await h.turns.finishTurn({ threadId: h.threadId, turnId: h.turnId, status: 'completed' })
    for (let i = 0; i < 8; i += 1) {
      await h.sessionStore.appendItem(
        h.threadId,
        makeUserItem({
          id: `manual_hist_${i}`,
          turnId: h.turnId,
          threadId: h.threadId,
          text: i === 0 ? 'original requirement alpha' : `old detail ${i}`
        })
      )
    }

    const compacted = await h.turns.compact({
      threadId: h.threadId,
      request: { reason: 'manual test' }
    })
    expect(compacted.summary).toContain('original requirement alpha')

    const next = await h.turns.startTurn({
      threadId: h.threadId,
      request: { prompt: 'continue after compact' }
    })
    h.turnId = next.turnId
    await h.loop.runTurn(h.threadId, h.turnId)

    const history = seenHistory[0] ?? []
    expect(history[0]?.kind).toBe('compaction')
    expect(
      history.some((item) => item.kind === 'user_message' && item.text === 'original requirement alpha')
    ).toBe(false)
    expect(
      history.some((item) => item.kind === 'user_message' && item.text === 'continue after compact')
    ).toBe(true)
    expect(
      history.some((item) => item.kind === 'compaction' && item.summary.includes('original requirement alpha'))
    ).toBe(true)
  })

  it('records usage and emits a usage event', async () => {
    const h = makeHarness(
      makeFakeModel([
        {
          kind: 'usage',
          usage: {
            promptTokens: 12,
            completionTokens: 4,
            totalTokens: 16,
            cachedTokens: 6,
            cacheHitTokens: 6,
            cacheMissTokens: 6,
            cacheHitRate: 0.5,
            turns: 1
          }
        },
        { kind: 'completed', stopReason: 'stop' }
      ])
    )
    await bootstrapThread(h)
    const seen: number[] = []
    h.bus.subscribe(h.threadId, (event) => {
      if (event.kind === 'usage') seen.push(event.seq)
    })
    await h.loop.runTurn(h.threadId, h.turnId)
    expect(seen.length).toBeGreaterThan(0)
    const replay = await h.sessionStore.loadEventsSince(h.threadId, 0)
    expect(replay.some((event) => event.kind === 'usage')).toBe(true)
  })

  it('persists assistant text deltas for SSE replay before the final item', async () => {
    const h = makeHarness(
      makeFakeModel([
        { kind: 'assistant_text_delta', text: 'he' },
        { kind: 'assistant_text_delta', text: 'llo' },
        { kind: 'completed', stopReason: 'stop' }
      ])
    )
    await bootstrapThread(h)
    await h.loop.runTurn(h.threadId, h.turnId)
    const replay = await h.sessionStore.loadEventsSince(h.threadId, 0)
    const deltas = replay.filter((event) => event.kind === 'assistant_text_delta')
    expect(deltas).toHaveLength(2)
    const items = await h.sessionStore.loadItems(h.threadId)
    expect(items.some((item) => item.kind === 'assistant_text' && item.text === 'hello')).toBe(true)
  })

  it('persists completed reasoning before completed assistant text', async () => {
    const h = makeHarness(
      makeFakeModel([
        { kind: 'assistant_reasoning_delta', text: 'thinking' },
        { kind: 'assistant_text_delta', text: 'answer' },
        { kind: 'completed', stopReason: 'stop' }
      ])
    )
    await bootstrapThread(h)
    await h.loop.runTurn(h.threadId, h.turnId)

    const itemKinds = (await h.sessionStore.loadItems(h.threadId))
      .filter((item) => item.kind === 'assistant_reasoning' || item.kind === 'assistant_text')
      .map((item) => item.kind)

    expect(itemKinds).toEqual(['assistant_reasoning', 'assistant_text'])
  })
})

describe('FileSessionStore', () => {
  let dataDir = ''
  beforeEach(async () => {
    dataDir = await mkdtemp(join(tmpdir(), 'legalwork-test-'))
    await mkdir(dataDir, { recursive: true })
  })
  afterEach(async () => {
    await rm(dataDir, { recursive: true, force: true })
  })

  it('persists events and items as JSONL with atomic index writes', async () => {
    const threadStore = new FileThreadStore({ dataDir })
    const sessionStore = new FileSessionStore({ dataDir })
    await threadStore.upsert(
      createThreadRecord({ id: 'thr_x', title: 'demo', workspace: '/tmp', model: 'm' })
    )
    await sessionStore.appendEvent('thr_x', {
      kind: 'heartbeat',
      seq: 1,
      timestamp: new Date().toISOString(),
      threadId: 'thr_x'
    })
    const events = await sessionStore.loadEventsSince('thr_x', 0)
    expect(events).toHaveLength(1)
    const content = await readFile(join(dataDir, 'threads', 'thr_x', 'events.jsonl'), 'utf-8')
    expect(content.endsWith('\n')).toBe(true)
    const index = JSON.parse(
      await readFile(join(dataDir, 'threads', 'index.json'), 'utf-8')
    ) as { order: string[] }
    expect(index.order).toContain('thr_x')
  })

  it('handles concurrent file thread index writes in the same millisecond', async () => {
    const spy = vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
    try {
      const threadStore = new FileThreadStore({
        dataDir,
        now: () => new Date('2026-06-03T00:00:00.000Z')
      })
      const threads = Array.from({ length: 20 }, (_, index) =>
        createThreadRecord({
          id: `thr_concurrent_${index}`,
          title: `demo ${index}`,
          workspace: '/tmp',
          model: 'm'
        })
      )

      await expect(Promise.all(threads.map((thread) => threadStore.upsert(thread))))
        .resolves.toHaveLength(20)
      const index = JSON.parse(
        await readFile(join(dataDir, 'threads', 'index.json'), 'utf-8')
      ) as { order: string[] }

      expect(index.order).toEqual(expect.arrayContaining(threads.map((thread) => thread.id)))
    } finally {
      spy.mockRestore()
    }
  })

  it('continues event sequence numbers after a file-backed restart', async () => {
    const sessionStore = new FileSessionStore({ dataDir })
    await sessionStore.appendEvent('thr_seq', {
      kind: 'heartbeat',
      seq: 7,
      timestamp: new Date().toISOString(),
      threadId: 'thr_seq'
    })
    const bus = new InMemoryEventBus()
    const recorder = new RuntimeEventRecorder({
      eventBus: bus,
      sessionStore,
      allocateSeq: (threadId) => bus.allocateSeq(threadId),
      nowIso: () => new Date().toISOString()
    })
    const event = await recorder.record({ kind: 'heartbeat', threadId: 'thr_seq' })
    expect(event.seq).toBe(8)
  })

  it('survives a malformed JSONL line', async () => {
    const sessionStore = new FileSessionStore({ dataDir })
    await mkdir(join(dataDir, 'threads', 'thr_y'), { recursive: true })
    await appendFile(
      join(dataDir, 'threads', 'thr_y', 'events.jsonl'),
      '{"kind":"heartbeat","seq":1,"timestamp":"t","threadId":"thr_y"}\n',
      'utf-8'
    )
    const events = await sessionStore.loadEventsSince('thr_y', 0)
    expect(events).toHaveLength(1)
  })

  it('compacts usage events by retention window while preserving a carryover baseline', async () => {
    const sessionStore = new FileSessionStore({
      dataDir,
      usageEventCompaction: {
        maxBytes: 1,
        retentionDays: 365,
        nowIso: () => '2026-06-03T00:00:00.000Z'
      }
    })
    const usage = (tokens: number) => ({
      promptTokens: tokens,
      completionTokens: 0,
      totalTokens: tokens,
      cacheHitRate: null,
      turns: tokens
    })
    await sessionStore.appendEvent('thr_usage_compact', {
      kind: 'heartbeat',
      seq: 1,
      timestamp: '2024-01-01T00:00:00.000Z',
      threadId: 'thr_usage_compact'
    })
    await sessionStore.appendEvent('thr_usage_compact', {
      kind: 'usage',
      seq: 2,
      timestamp: '2024-01-01T00:00:00.000Z',
      threadId: 'thr_usage_compact',
      model: 'deepseek-chat',
      usage: usage(2)
    })
    await sessionStore.appendEvent('thr_usage_compact', {
      kind: 'usage',
      seq: 3,
      timestamp: '2025-06-02T23:59:59.000Z',
      threadId: 'thr_usage_compact',
      model: 'deepseek-chat',
      usage: usage(3)
    })
    await sessionStore.appendEvent('thr_usage_compact', {
      kind: 'usage',
      seq: 4,
      timestamp: '2025-06-04T00:00:00.000Z',
      threadId: 'thr_usage_compact',
      model: 'deepseek-chat',
      usage: usage(4)
    })
    await sessionStore.appendEvent('thr_usage_compact', {
      kind: 'usage',
      seq: 5,
      timestamp: '2025-06-04T01:00:00.000Z',
      threadId: 'thr_usage_compact',
      model: 'deepseek-chat',
      usage: usage(5)
    })
    await sessionStore.appendEvent('thr_usage_compact', {
      kind: 'usage',
      seq: 6,
      timestamp: '2025-06-04T02:00:00.000Z',
      threadId: 'thr_usage_compact',
      model: 'deepseek-reasoner',
      usage: usage(6)
    })
    await sessionStore.appendEvent('thr_usage_compact', {
      kind: 'usage',
      seq: 7,
      timestamp: '2026-06-02T00:00:00.000Z',
      threadId: 'thr_usage_compact',
      model: 'deepseek-reasoner',
      usage: usage(7)
    })

    const events = await sessionStore.loadEventsSince('thr_usage_compact', 0)
    expect(events.map((event) => event.seq)).toEqual([1, 3, 5, 6, 7])
    expect(await sessionStore.highestSeq('thr_usage_compact')).toBe(7)
  })

  it('retries once when a model stops after reasoning without a visible answer', async () => {
    let requests = 0
    const h = makeHarness({
      provider: 'reasoning-only-recovery',
      model: 'reasoning-only-recovery',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        requests += 1
        if (requests === 1) {
          yield { kind: 'assistant_reasoning_delta', text: '我需要先继续规划。' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '# 最终正文\n\n已基于现有材料完成。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h, { request: { prompt: '请直接输出文书正文。' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(requests).toBe(2)
    const items = await h.sessionStore.loadItems(h.threadId)
    expect(items.some((item) =>
      item.kind === 'assistant_text' && item.text.includes('最终正文')
    )).toBe(true)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    expect(events.some((event) => event.kind === 'tool_result_upload_wait')).toBe(false)
  })

  it('fails instead of marking a reasoning-only turn as completed', async () => {
    let requests = 0
    const h = makeHarness({
      provider: 'reasoning-only-failure',
      model: 'reasoning-only-failure',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        requests += 1
        yield { kind: 'assistant_reasoning_delta', text: '我还需要继续规划。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    })
    await bootstrapThread(h, { request: { prompt: '请直接输出结果。' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('failed')
    expect(requests).toBe(3)
    const thread = await h.threadStore.get(h.threadId)
    expect(thread?.turns.find((turn) => turn.id === h.turnId)?.status).toBe('failed')
  })

  it.each([
    '最新法考政策',
    '法考最新政策',
    '最新的公考考纲',
    '生态环境法典第一案',
    '法考政策',
    '公考考纲',
    '公务员具体的考察要素',
    '帮我查一下司法部发布的法考公告'
  ])('runtime-prefetches web_search before answering a fresh topic: %s', async (prompt) => {
    const executedQueries: string[] = []
    let modelRequests = 0
    let modelSawSearchResult = false
    const webSearch = LocalToolHost.defineTool({
      name: 'web_search',
      description: 'Search current web information.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' }, limit: { type: 'number' } },
        required: ['query'],
        additionalProperties: false
      },
      policy: 'auto',
      execute: async (args) => {
        executedQueries.push(String(args.query ?? ''))
        return {
          output: {
            results: [{
              title: '司法部官方通知',
              url: 'https://example.test/current-policy',
              snippet: '这是本年度发布的政策正文摘要。'
            }]
          }
        }
      }
    })
    const h = makeHarness({
      provider: 'fresh-web-prefetch',
      model: 'fresh-web-prefetch',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        modelRequests += 1
        modelSawSearchResult = request.history.some((item) =>
          item.kind === 'tool_result' && item.toolName === 'web_search'
        )
        yield { kind: 'assistant_text_delta', text: '已根据刚刚检索到的来源给出完整回答。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [webSearch] })
    await bootstrapThread(h, { request: { prompt } })

    expect(requiresWebSearch(prompt)).toBe(true)
    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(executedQueries).toEqual([prompt])
    expect(modelRequests).toBe(1)
    expect(modelSawSearchResult).toBe(true)
    const items = await h.sessionStore.loadItems(h.threadId)
    expect(items.some((item) =>
      item.kind === 'tool_result' && item.toolName === 'web_search'
    )).toBe(true)
  })

  it('continues without a user-visible error when required web_search is not registered', async () => {
    let modelRequests = 0
    const h = makeHarness({
      provider: 'missing-web-search-fallback',
      model: 'missing-web-search-fallback',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        modelRequests += 1
        expect(request.contextInstructions?.join('\n')).toContain('不得因此吞掉其余可交付结果')
        yield { kind: 'assistant_text_delta', text: '先根据现有材料完成分析；实时变化部分标记为待核验。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [] })
    await bootstrapThread(h, { request: { prompt: '帮我网上搜索一下最新司法解释并分析案件' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(modelRequests).toBe(1)
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    expect(events.some((event) => event.kind === 'turn_failed')).toBe(false)
    expect(events.some((event) =>
      event.kind === 'pipeline_stage' &&
      event.details?.label === 'Web search unavailable; continuing best-effort'
    )).toBe(true)
  })

  it('keeps failed web_search attempts out of the visible error count and still answers', async () => {
    let searchAttempts = 0
    const webSearch = LocalToolHost.defineTool({
      name: 'web_search',
      description: 'Search current web information.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' }, limit: { type: 'number' } },
        required: ['query'],
        additionalProperties: false
      },
      policy: 'auto',
      execute: async () => {
        searchAttempts += 1
        return {
          output: { error: { code: 'search_failed', message: 'HTTP 404 NOT_FOUND' } },
          isError: true
        }
      }
    })
    const h = makeHarness({
      provider: 'failed-web-search-fallback',
      model: 'failed-web-search-fallback',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        expect(request.contextInstructions?.join('\n')).toContain('待实时核验')
        yield { kind: 'assistant_text_delta', text: '已完成不依赖实时检索的部分。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [webSearch] })
    await bootstrapThread(h, { request: { prompt: '查询最新法考政策并给出准备建议' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    // 检索是辅助预取而非必要条件：失败只自动尝试一次即放行模型回答，绝不重试死等。
    expect(searchAttempts).toBe(1)
    const items = await h.sessionStore.loadItems(h.threadId)
    const searchResults = items.filter((item) =>
      item.kind === 'tool_result' && item.toolName === 'web_search'
    )
    expect(searchResults.length).toBeGreaterThan(0)
    expect(searchResults.every((item) => item.kind === 'tool_result' && item.isError !== true)).toBe(true)
  })

  it('keeps mandatory searches isolated across three concurrent conversations', async () => {
    const searchedThreads: string[] = []
    const webSearch = LocalToolHost.defineTool({
      name: 'web_search',
      description: 'Search current web information.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' }, limit: { type: 'number' } },
        required: ['query'],
        additionalProperties: false
      },
      policy: 'auto',
      execute: async (_args, context) => {
        searchedThreads.push(context.threadId)
        return {
          output: {
            results: [{ title: '最新考纲', url: 'https://example.test/exam-outline' }]
          }
        }
      }
    })
    const h = makeHarness({
      provider: 'concurrent-fresh-search',
      model: 'concurrent-fresh-search',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        const hasSearchResult = request.history.some((item) =>
          item.kind === 'tool_result' && item.toolName === 'web_search'
        )
        if (!hasSearchResult) throw new Error('model request arrived before mandatory search')
        yield { kind: 'assistant_text_delta', text: '已根据最新搜索结果作答。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [webSearch] })
    const threadIds = ['thr_concurrent_1', 'thr_concurrent_2', 'thr_concurrent_3']
    const turnIds: string[] = []
    for (const threadId of threadIds) {
      await h.threadStore.upsert(createThreadRecord({
        id: threadId,
        title: '最新的公考考纲',
        workspace: '/tmp',
        model: 'concurrent-fresh-search'
      }))
      const started = await h.turns.startTurn({
        threadId,
        request: { prompt: '最新的公考考纲' }
      })
      turnIds.push(started.turnId)
    }

    const statuses = await Promise.all(threadIds.map((threadId, index) =>
      h.loop.runTurn(threadId, turnIds[index] ?? '')
    ))

    expect(statuses).toEqual(['completed', 'completed', 'completed'])
    expect(searchedThreads.sort()).toEqual([...threadIds].sort())
  })

  it('keeps broad fact-audit tools advisory instead of blocking the final answer', async () => {
    const executed: string[] = []
    const fetchedUrls = [
      'https://news.example.test/a',
      'https://agency.example.test/b',
      'https://journal.example.test/c'
    ]
    const legalUrl = 'https://flk.npc.gov.cn/detail?id=law-1'
    const define = (name: string, output: (args: Record<string, unknown>) => unknown) =>
      LocalToolHost.defineTool({
        name,
        description: name,
        inputSchema: { type: 'object', properties: {} },
        policy: 'auto',
        execute: async (args) => {
          executed.push(name)
          return { output: output(args) }
        }
      })
    let fetchIndex = 0
    let callIndex = 0
    const requiredSeen: Array<string | undefined> = []
    const h = makeHarness({
      provider: 'fact-verification-gate',
      model: 'fact-verification-gate',
      async *stream(request): AsyncIterable<ModelStreamChunk> {
        const required = request.requiredToolName
        requiredSeen.push(required)
        if (!required) {
          yield { kind: 'assistant_text_delta', text: '逐项核验完成并列出来源。' }
          yield { kind: 'completed', stopReason: 'stop' }
          return
        }
        let args: Record<string, unknown> = { query: '食药犯罪事实与规范核验' }
        if (required === 'web_fetch') args = { url: fetchedUrls[fetchIndex++] }
        if (required === 'fact_verification_finalize') {
          const evidence = [
            { title: '新闻来源', url: fetchedUrls[0] },
            { title: '主管机关来源', url: fetchedUrls[1] },
            { title: '学术来源', url: fetchedUrls[2] },
            { title: '国家法律法规数据库', url: legalUrl }
          ]
          args = {
            claims: Array.from({ length: 5 }, (_, index) => ({
              statement: `待核实陈述 ${index + 1}：涉及食药犯罪事实或规范`,
              verdict: 'verified',
              rationale: '已读取的网页正文与权威法律记录能够交叉支持该项结论。',
              evidence: [evidence[index % evidence.length]]
            }))
          }
        }
        yield {
          kind: 'tool_call_complete',
          callId: `call_fact_${++callIndex}`,
          toolName: required,
          arguments: args
        }
        yield { kind: 'completed', stopReason: 'tool_calls' }
      }
    }, {
      tools: [
        define('web_search', () => ({ results: fetchedUrls.map((url) => ({ url })) })),
        define('knowledge_legal_external_sources', () => ({
          records: [{
            title: '中华人民共和国刑法',
            path: legalUrl,
            excerpt: '制定机关：全国人民代表大会；公布日期与施行日期已经核对；状态：现行有效；第一百四十一条规定生产、销售、提供假药罪及其法定刑。'
          }]
        })),
        define('web_fetch', (args) => ({
          url: args.url,
          finalUrl: args.url,
          text: '这是已经实际读取的来源正文，包含可供核实的事实、日期、发布主体和具体数据。'.repeat(3)
        })),
        define('fact_verification_finalize', (args) => ({
          verificationPassed: true,
          claimCount: Array.isArray(args.claims) ? args.claims.length : 0
        }))
      ]
    })
    await bootstrapThread(h, {
      request: { prompt: '核实下里面提到的事实、规范、新闻什么的，准确性、真实度。' }
    })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(requiredSeen).toEqual([undefined])
    expect(executed).toEqual([])
  })
})

describe('read continuation with offset is not deduplicated', () => {
  it('allows a same-path read with a different offset after a truncated first read', async () => {
    const longLine = '食药安全刑事政策研究'.repeat(60)
    const allLines: string[] = []
    for (let i = 0; i < 283; i += 1) allLines.push(`第${i + 1}行 ${longLine}`)
    const fileText = `${allLines.join('\n')}\n`

    const readCalls: Array<{ path: string; offset?: number; limit?: number }> = []
    const readTool = LocalToolHost.defineTool({
      name: 'read',
      description: 'Read a file with optional offset.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          offset: { type: 'number' },
          limit: { type: 'number' }
        },
        required: ['path'],
        additionalProperties: false
      },
      policy: 'auto',
      execute: async (args: { path?: string; offset?: number; limit?: number }) => {
        const offset = Math.max(1, Math.floor(args.offset ?? 1))
        readCalls.push({ path: args.path ?? '', offset, limit: args.limit })
        // 模拟 builtin-read 的 50KB 截断：offset=1 只返回前 186 行并提示续读，
        // offset=187 返回剩余部分。
        const lineStart = offset
        const maxLinesPerRead = 186
        const end = Math.min(offset + maxLinesPerRead - 1, allLines.length)
        const slice = allLines.slice(offset - 1, end)
        const truncated = end < allLines.length
        const content = truncated
          ? `${slice.join('\n')}\n\n[showing lines ${lineStart}-${end} of ${allLines.length} (50.0KB limit). Use offset=${end + 1} to continue.]`
          : slice.join('\n')
        return {
          output: {
            path: args.path ?? '',
            content,
            kind: 'text',
            start_line: offset,
            end_line: end,
            total_lines: allLines.length,
            truncated,
            truncation_by: truncated ? 'bytes' : null,
            first_line_exceeds_limit: false
          }
        }
      }
    })

    let requests = 0
    const h = makeHarness(
      {
        provider: 'read-offset-continuation',
        model: 'read-offset-continuation',
        async *stream(): AsyncIterable<ModelStreamChunk> {
          requests += 1
          if (requests === 1) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_read_first',
              toolName: 'read',
              arguments: { path: '/tmp/paper.txt' }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          if (requests === 2) {
            yield {
              kind: 'tool_call_complete',
              callId: 'call_read_second',
              toolName: 'read',
              arguments: { path: '/tmp/paper.txt', offset: 187 }
            }
            yield { kind: 'completed', stopReason: 'tool_calls' }
            return
          }
          yield { kind: 'assistant_text_delta', text: '已读完全文。' }
          yield { kind: 'completed', stopReason: 'stop' }
        }
      },
      { tools: [readTool] }
    )
    await bootstrapThread(h, { request: { prompt: '读取论文全文' } })

    const status = await h.loop.runTurn(h.threadId, h.turnId)

    expect(status).toBe('completed')
    expect(requests).toBe(3)
    expect(readCalls).toHaveLength(2)
    const items = await h.sessionStore.loadItems(h.threadId)
    const dedupHits = items.filter((item) =>
      item.kind === 'tool_result' &&
      typeof item.output === 'object' &&
      item.output !== null &&
      (item.output as { _dedup?: boolean })._dedup === true
    )
    expect(dedupHits).toHaveLength(0)
  })

  it('allows distinct character ranges on the same OCR line', async () => {
    const readCalls: Array<{ charStart?: number; charLen?: number }> = []
    const readTool = LocalToolHost.defineTool({
      name: 'read',
      description: 'Read a character range.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          offset: { type: 'number' },
          charStart: { type: 'number' },
          charLen: { type: 'number' }
        },
        required: ['path'],
        additionalProperties: false
      },
      policy: 'auto',
      execute: async (args: { charStart?: number; charLen?: number }) => {
        readCalls.push(args)
        return { output: { content: `range-${args.charStart}` } }
      }
    })
    let requests = 0
    const h = makeHarness({
      provider: 'read-char-continuation',
      model: 'read-char-continuation',
      async *stream(): AsyncIterable<ModelStreamChunk> {
        requests += 1
        if (requests <= 2) {
          yield {
            kind: 'tool_call_complete',
            callId: `call_char_${requests}`,
            toolName: 'read',
            arguments: {
              path: '/tmp/ocr.txt',
              offset: 31,
              charStart: requests === 1 ? 1 : 2_001,
              charLen: 2_000
            }
          }
          yield { kind: 'completed', stopReason: 'tool_calls' }
          return
        }
        yield { kind: 'assistant_text_delta', text: '已读完 OCR 长行。' }
        yield { kind: 'completed', stopReason: 'stop' }
      }
    }, { tools: [readTool] })
    await bootstrapThread(h, { request: { prompt: '读取 OCR 长行' } })

    expect(await h.loop.runTurn(h.threadId, h.turnId)).toBe('completed')
    expect(readCalls).toEqual([
      expect.objectContaining({ charStart: 1, charLen: 2_000 }),
      expect.objectContaining({ charStart: 2_001, charLen: 2_000 })
    ])
    const events = await h.sessionStore.loadEventsSince(h.threadId, 0)
    expect(events.some((event) =>
      event.kind === 'pipeline_stage' && event.stage === 'prefix_stability_warning'
    )).toBe(false)
  })
})
