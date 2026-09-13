import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ChatBlock } from '../../agent/types'
import {
  findKnowledgeFileForChatContext,
  knowledgeChatHistoryFromBlocks,
  markKnowledgeSourceReferences,
  stripKnowledgeDsmlProtocol,
  stripRepeatedKnowledgeQuestionLead
} from './knowledge-chat-history'
import { KnowledgeChatComposer, KnowledgeChatMessage } from './KnowledgeChatUI'

describe('knowledgeChatHistoryFromBlocks', () => {
  it('restores the visible user question from a stored global RAG prompt', () => {
    const blocks: ChatBlock[] = [
      {
        kind: 'user',
        id: 'user-1',
        text: `你是一个专业的法律知识助手。请基于以下从知识库中检索到的相关内容回答用户的问题。

## RAG 检索上下文
内部检索内容

## 可引用来源
[来源 1] 文档

## 用户问题
这份材料的核心结论是什么？

请基于检索到的内容给出准确、专业的回答。`
      },
      {
        kind: 'assistant',
        id: 'assistant-1',
        text: '## 结论\n\n核心结论如下。'
      }
    ]

    const history = knowledgeChatHistoryFromBlocks(blocks)

    expect(history.context).toEqual({ kind: 'global' })
    expect(history.messages[0]).toMatchObject({
      role: 'user',
      content: '这份材料的核心结论是什么？'
    })
    expect(history.messages[1]).toMatchObject({
      role: 'assistant',
      content: '## 结论\n\n核心结论如下。'
    })
  })

  it('restores the selected folder scope from a stored knowledge prompt', () => {
    const blocks: ChatBlock[] = [{
      kind: 'user',
      id: 'user-folder',
      text: `## 当前知识库范围
文件夹：论文
路径：研究资料/论文

## 用户问题
这些是什么？`
    }]

    expect(knowledgeChatHistoryFromBlocks(blocks).context).toEqual({
      kind: 'folder',
      folderPath: '研究资料/论文',
      folderName: '论文'
    })
  })

  it('restores a PDF selection as a quote separate from user input', () => {
    const blocks: ChatBlock[] = [{
      kind: 'user',
      id: 'user-pdf-quote',
      text: `## 当前文件
行政法论文.pdf（PDF）

## PDF 划选引用
来源：行政法论文.pdf
页码：第 2 页
正文：
行政机关处理个人信息应当遵循合法、正当、必要原则。

## 用户问题
这段话的规范依据是什么？`
    }]

    expect(knowledgeChatHistoryFromBlocks(blocks).messages[0]).toMatchObject({
      role: 'user',
      content: '这段话的规范依据是什么？',
      quote: {
        label: '行政法论文.pdf · 第 2 页',
        text: '行政机关处理个人信息应当遵循合法、正当、必要原则。'
      }
    })
  })

  it('uses a safe in-app anchor when marking source references', () => {
    expect(markKnowledgeSourceReferences('依据[来源 3]，并参见[来源 4]。')).toBe(
      '依据[来源 3](#knowledge-source-3)，并参见[来源 4](#knowledge-source-4)。'
    )
    expect(markKnowledgeSourceReferences('[来源 3](#knowledge-source-3)')).toBe(
      '[来源 3](#knowledge-source-3)'
    )
  })

  it('renders a PDF quote separately from the user-authored composer text', () => {
    const html = renderToStaticMarkup(createElement(KnowledgeChatComposer, {
      value: '这段话的法律依据是什么？',
      placeholder: '输入关于文件的问题...',
      disabled: false,
      quote: {
        label: '行政法论文.pdf · 第 2 页',
        text: '行政机关处理个人信息应当遵循合法、正当、必要原则。'
      },
      onRemoveQuote: () => undefined,
      onChange: () => undefined,
      onKeyDown: () => undefined,
      onSend: () => undefined
    }))

    expect(html).toContain('行政法论文.pdf · 第 2 页')
    expect(html).toContain('行政机关处理个人信息应当遵循合法、正当、必要原则。')
    expect(html).toContain('value="这段话的法律依据是什么？"')
    expect(html).toContain('移除引用')
  })

  it('uses the main conversation answer typography for knowledge assistant messages', () => {
    const html = renderToStaticMarkup(createElement(KnowledgeChatMessage, {
      role: 'assistant',
      children: '知识库回答'
    }))

    expect(html).toContain('ds-chat-answer')
  })

  it('extracts the file context from a stored file chat prompt', () => {
    const blocks: ChatBlock[] = [
      {
        kind: 'user',
        id: 'user-1',
        text: `你是一个专业的法律知识助手。请基于当前打开文件的内容回答用户的问题。

## 当前文件
党员、党权与党争（社科文献学术文库·文史哲研究系列）.md（MD）

## 当前打开文件的正文（优先依据）
# 《党员、党权与党争》

## 用户问题
总结一下划线内容。

请基于当前文件给出回答。`
      }
    ]

    const history = knowledgeChatHistoryFromBlocks(blocks)

    expect(history.context).toEqual({
      kind: 'file',
      fileName: '党员、党权与党争（社科文献学术文库·文史哲研究系列）.md'
    })
    expect(history.messages[0]).toMatchObject({
      role: 'user',
      content: '总结一下划线内容。'
    })
  })

  it('extracts a durable file path from newer file chat prompts', () => {
    const blocks: ChatBlock[] = [{
      kind: 'user',
      id: 'user-1',
      text: `## 当前文件
合同审查.md（MD）

## 当前文件路径
案件/甲公司/合同审查.md

## 用户问题
有哪些主要风险？`
    }]

    expect(knowledgeChatHistoryFromBlocks(blocks).context).toEqual({
      kind: 'file',
      fileName: '合同审查.md',
      filePath: '案件/甲公司/合同审查.md'
    })
  })

  it('does not expose legacy file-chat instructions in the restored user message', () => {
    const blocks: ChatBlock[] = [{
      kind: 'user',
      id: 'user-1',
      text: `你是一个专业的法律知识助手。

## 当前文件
第一次跟委托人见面要不要主动递名片或加微信.md（MD）

## 用户问题
?

请优先依据“当前打开文件的正文”回答；知识库补充检索结果只能用于交叉参考或补充背景，不能把其他文件内容误认为当前文件内容。如果当前文件正文不足以回答问题，请明确说明缺口。`
    }]

    expect(knowledgeChatHistoryFromBlocks(blocks).messages[0]).toMatchObject({
      role: 'user',
      content: '?'
    })
  })

  it('restores only the user question from prompts with a separate answer-requirements section', () => {
    const blocks: ChatBlock[] = [{
      kind: 'user',
      id: 'user-1',
      text: `你是一个专业的法律知识助手。

## 用户问题
请比较这两份材料。

需要分别说明共同点和差异。

## 回答要求
请基于检索到的内容给出准确、专业的回答。`
    }]

    expect(knowledgeChatHistoryFromBlocks(blocks).messages[0]).toMatchObject({
      role: 'user',
      content: '请比较这两份材料。\n\n需要分别说明共同点和差异。'
    })
  })

  it('attaches a stored reasoning block to its assistant answer', () => {
    const blocks: ChatBlock[] = [
      {
        kind: 'reasoning',
        id: 'reasoning-1',
        text: '先读取当前文件，再提取关键信息。'
      },
      {
        kind: 'assistant',
        id: 'assistant-1',
        text: '## 结论\n\n这是最终回答。'
      }
    ]

    expect(knowledgeChatHistoryFromBlocks(blocks).messages[0]).toMatchObject({
      role: 'assistant',
      reasoning: '先读取当前文件，再提取关键信息。',
      content: '## 结论\n\n这是最终回答。'
    })
  })

  it('removes a repeated user question used as the answer heading', () => {
    expect(stripRepeatedKnowledgeQuestionLead(
      '# 这是什么\n\n这是一个实务经验分享文档。',
      '这是什么'
    )).toBe('这是一个实务经验分享文档。')
  })

  it('removes a repeated user question used as bold lead text', () => {
    expect(stripRepeatedKnowledgeQuestionLead(
      '**问题：这是什么？**\n\n这是一个实务经验分享文档。',
      '这是什么'
    )).toBe('这是一个实务经验分享文档。')
  })

  it('preserves a useful answer heading that is not the user question', () => {
    const answer = '## 核心内容\n\n这是一份实务经验分享文档。'
    expect(stripRepeatedKnowledgeQuestionLead(answer, '这是什么')).toBe(answer)
  })

  it('cleans repeated question headings when restoring stored answers', () => {
    const blocks: ChatBlock[] = [
      {
        kind: 'user',
        id: 'user-1',
        text: '这是什么'
      },
      {
        kind: 'assistant',
        id: 'assistant-1',
        text: '# 这是什么\n\n这是一个实务经验分享文档。'
      }
    ]

    expect(knowledgeChatHistoryFromBlocks(blocks).messages[1]).toMatchObject({
      role: 'assistant',
      content: '这是一个实务经验分享文档。'
    })
  })

  it('removes leaked DeepSeek DSML calls frames from current and stored knowledge answers', () => {
    const leaked = [
      '知识库回答正文。',
      '<| |DSML| | calls>',
      '<| |DSML| | invoke name="document_skill_execute">',
      '<| |DSML| | parameter name="kind" string="true">docx</| |DSML| | parameter>',
      '</| |DSML| | invoke>',
      '</| |DSML| | calls>',
      '回答结束。'
    ].join('\n')

    expect(stripKnowledgeDsmlProtocol(leaked)).toBe('知识库回答正文。\n\n回答结束。')
    expect(knowledgeChatHistoryFromBlocks([{
      kind: 'assistant',
      id: 'assistant-dsml',
      text: leaked
    }]).messages[0]).toMatchObject({
      role: 'assistant',
      content: '知识库回答正文。\n\n回答结束。'
    })
  })

  it('finds the linked file by path and falls back to a unique file name for old chats', () => {
    const nodes = [{
      name: '案件',
      path: '案件',
      kind: 'folder' as const,
      children: [
        { name: '合同审查.md', path: '案件/甲公司/合同审查.md', kind: 'file' as const },
        { name: '合同审查.md', path: '案件/乙公司/合同审查.md', kind: 'file' as const },
        { name: '庭审笔记.md', path: '案件/庭审笔记.md', kind: 'file' as const }
      ]
    }]

    expect(findKnowledgeFileForChatContext(nodes, {
      kind: 'file',
      fileName: '合同审查.md',
      filePath: '案件/乙公司/合同审查.md'
    })?.path).toBe('案件/乙公司/合同审查.md')
    expect(findKnowledgeFileForChatContext(nodes, {
      kind: 'file',
      fileName: '庭审笔记.md'
    })?.path).toBe('案件/庭审笔记.md')
    expect(findKnowledgeFileForChatContext(nodes, {
      kind: 'file',
      fileName: '合同审查.md'
    })).toBeNull()
  })
})
