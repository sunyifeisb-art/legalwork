import { describe, expect, it } from 'vitest'
import {
  isPotentialDsmlToolCallStream,
  looksLikeDsmlToolCalls,
  recoverDsmlToolCall,
  recoverDsmlToolCalls,
  recoverJsonToolCalls,
  stripDsmlToolCalls
} from './dsml-tool-call-recovery.js'

describe('DSML tool-call recovery', () => {
  it('recovers the DeepSeek text form while preserving user-facing text', () => {
    const text = [
      'Word 已生成。现在生成 PDF。',
      '<|DSML|| tool_calls>',
      '<|DSML|| invoke name="mcp_search">',
      '<|DSML|| parameter name="query" string="true">PDF 转换</|DSML|| parameter>',
      '<|DSML|| parameter name="topK" string="false">5</|DSML|| parameter>',
      '</|DSML|| invoke>',
      '</|DSML|| tool_calls>'
    ].join('\n')

    expect(recoverDsmlToolCall(text, new Set(['mcp_search']))).toEqual({
      toolName: 'mcp_search',
      arguments: { query: 'PDF 转换', topK: 5 },
      visibleText: 'Word 已生成。现在生成 PDF。'
    })
  })

  it('never recovers a tool that was not advertised in the request', () => {
    const text = '<|DSML|| invoke name="bash"></|DSML|| invoke>'
    expect(recoverDsmlToolCall(text, new Set(['mcp_search']))).toBeNull()
  })

  it('recovers every advertised invocation from one DeepSeek DSML block', () => {
    const text = [
      '<|DSML|| tool_calls>',
      '<|DSML|| invoke name="bash">',
      '<|DSML|| parameter name="command" string="true">node --version</|DSML|| parameter>',
      '</|DSML|| invoke>',
      '<|DSML|| invoke name="bash">',
      '<|DSML|| parameter name="command" string="true">python3 --version</|DSML|| parameter>',
      '</|DSML|| invoke>',
      '</|DSML|| tool_calls>'
    ].join('\n')

    expect(recoverDsmlToolCalls(text, new Set(['bash']))).toEqual({
      calls: [
        { toolName: 'bash', arguments: { command: 'node --version' } },
        { toolName: 'bash', arguments: { command: 'python3 --version' } }
      ],
      visibleText: ''
    })
  })

  it('detects a raw DSML block even when the tool is not advertised', () => {
    // 典型泄漏场景：模型在 wrap-up 阶段工具列表被剥离后仍输出 DSML 调用。
    const text = [
      '<|DSML|| tool_calls>',
      '<|DSML|| invoke name="mcp_call">',
      '<|DSML|| parameter name="arguments" string="false">{"query":"生产销售假药罪"}</|DSML|| parameter>',
      '<|DSML|| parameter name="toolId" string="true">yuandian-law/yuandian_law_vector_search</|DSML|| parameter>',
      '</|DSML|| invoke>',
      '</|DSML|| tool_calls>'
    ].join('\n')

    expect(recoverDsmlToolCalls(text, new Set([]))).toBeNull()
    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    // 剥离后应无任何残留 XML，也不会把工具调用当可见正文。
    expect(stripDsmlToolCalls(text)).toBe('')
  })

  it('strips DSML blocks but keeps real prose before them', () => {
    const text = [
      '第一阶段完成，现在进入案例检索。',
      '<|DSML|| tool_calls>',
      '<|DSML|| invoke name="yuandian-case/yuandian_case_vector_search">',
      '<|DSML|| parameter name="query" string="false">假药</|DSML|| parameter>',
      '</|DSML|| invoke>',
      '</|DSML|| tool_calls>'
    ].join('\n')

    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    expect(stripDsmlToolCalls(text)).toBe('第一阶段完成，现在进入案例检索。')
  })
})

describe('DSML full-width and mixed-format stripping', () => {
  it('detects and strips the real leaked format with double vertical bars around DSML', () => {
    const text = [
      '我需要读取原文档剩余部分。',
      '<||DSML||tool_calls>',
      '<||DSML||invoke name="document_skill_execute">',
      '<||DSML||parameter name="kind" string="true">docx</||DSML||parameter>',
      '</||DSML||invoke>',
      '</||DSML||tool_calls>'
    ].join('\n')
    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    expect(stripDsmlToolCalls(text)).toBe('我需要读取原文档剩余部分。')
  })

  it('detects and strips full-width vertical-bar variants', () => {
    const text = [
      '开始生成。',
      '<｜DSML｜｜tool_calls>',
      '<｜DSML｜｜invoke name="bash">',
      '<｜DSML｜｜parameter name="command" string="true">ls</｜DSML｜｜parameter>',
      '</｜DSML｜｜invoke>',
      '</｜DSML｜｜tool_calls>'
    ].join('\n')
    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    expect(stripDsmlToolCalls(text)).toBe('开始生成。')
  })

  it('detects, recovers, and strips whitespace-split DSML delimiters from the live provider', () => {
    const text = [
      '<| |DSML| | tool_calls>',
      '<| |DSML| | invoke name="bash">',
      '<| |DSML| | parameter name="action" string="true">poll</| |DSML| | parameter>',
      '<| |DSML| | parameter name="session_id" string="true">bash_123</| |DSML| | parameter>',
      '</| |DSML| | invoke>',
      '</| |DSML| | tool_calls>'
    ].join('\n')

    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    expect(recoverDsmlToolCalls(text, new Set(['bash']))).toEqual({
      calls: [{ toolName: 'bash', arguments: { action: 'poll', session_id: 'bash_123' } }],
      visibleText: ''
    })
    expect(stripDsmlToolCalls(text)).toBe('')
  })

  it('handles the live DeepSeek `calls` wrapper without leaking protocol text', () => {
    const text = [
      '知识库概览如下。',
      '<| |DSML| | calls>',
      '<| |DSML| | invoke name="document_skill_execute">',
      '<| |DSML| | parameter name="kind" string="true">docx</| |DSML| | parameter>',
      '<| |DSML| | parameter name="operation" string="true">from-markdown</| |DSML| | parameter>',
      '<| |DSML| | parameter name="outputPath" string="true">知识库内容概览.docx</| |DSML| | parameter>',
      '</| |DSML| | invoke>',
      '</| |DSML| | calls>',
      '以上为当前知识库内容。'
    ].join('\n')

    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    expect(recoverDsmlToolCalls(text, new Set(['document_skill_execute']))).toEqual({
      calls: [{
        toolName: 'document_skill_execute',
        arguments: {
          kind: 'docx',
          operation: 'from-markdown',
          outputPath: '知识库内容概览.docx'
        }
      }],
      visibleText: '知识库概览如下。\n\n以上为当前知识库内容。'
    })
    expect(stripDsmlToolCalls(text)).toBe('知识库概览如下。\n\n以上为当前知识库内容。')
  })

  it('recovers and strips the exact live frame whose final closing bracket is missing', () => {
    const text = [
      '<｜｜DSML｜｜tool_calls>',
      '<｜｜DSML｜｜invoke name="document_skill_execute">',
      '<｜｜DSML｜｜parameter name="kind" string="true">docx</｜｜DSML｜｜parameter>',
      '<｜｜DSML｜｜parameter name="operation" string="true">from-markdown</｜｜DSML｜｜parameter>',
      '</｜｜DSML｜｜invoke>',
      '</｜｜DSML｜｜tool_calls'
    ].join('\n')

    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    expect(recoverDsmlToolCalls(text, new Set(['document_skill_execute']))).toEqual({
      calls: [{
        toolName: 'document_skill_execute',
        arguments: { kind: 'docx', operation: 'from-markdown' }
      }],
      visibleText: ''
    })
    expect(stripDsmlToolCalls(text)).toBe('')
  })

  it('holds token-by-token DSML prefixes before a complete closing tag exists', () => {
    const chunks = [
      '<',
      '<｜｜DSML｜｜',
      '<｜｜DSML｜｜tool_calls>\n<｜｜DSML｜｜invoke name="bash">',
      '<｜｜DSML｜｜tool_calls>\n<｜｜DSML｜｜invoke name="bash"></｜｜DSML｜｜invoke>\n</｜｜DSML｜｜tool_calls'
    ]
    for (const value of chunks) expect(isPotentialDsmlToolCallStream(value)).toBe(true)
    expect(isPotentialDsmlToolCallStream('<| |DSML| | calls>\n<| |DSML| | inv')).toBe(true)
    expect(isPotentialDsmlToolCallStream('< 5 是一个普通数学表达式')).toBe(false)
  })

  it('does not strip ordinary prose that merely mentions DSML', () => {
    const text = 'DSML 是一种序列化格式。'
    expect(looksLikeDsmlToolCalls(text)).toBe(false)
    expect(stripDsmlToolCalls(text)).toBe('DSML 是一种序列化格式。')
  })

  it('strips an EOF-truncated DSML frame instead of leaking it', () => {
    const text = '可见正文\n<｜｜DSML｜｜tool_calls>\n<｜｜DSML｜｜invoke name="bash">'
    expect(looksLikeDsmlToolCalls(text)).toBe(true)
    expect(stripDsmlToolCalls(text)).toBe('可见正文')
  })
})

describe('JSON tool-call recovery', () => {
  it('recovers a document_skill_execute call from a fenced JSON block', () => {
    const text = [
      '我来从论文中提取全部引注，生成 Word 文档。',
      '```json',
      '{',
      '  "kind": "docx",',
      '  "operation": "from-markdown",',
      '  "content": "# 引注整理：\\"宽严相济\\"视域下资格刑的价值新探",',
      '  "outputPath": "引注整理-资格刑论文.docx",',
      '  "profile": "academic"',
      '}',
      '```',
      '已生成，文件在桌面。'
    ].join('\n')

    const recovered = recoverJsonToolCalls(text, new Set(['document_skill_execute']))
    expect(recovered).not.toBeNull()
    expect(recovered?.calls).toEqual([{
      toolName: 'document_skill_execute',
      arguments: {
        kind: 'docx',
        operation: 'from-markdown',
        content: '# 引注整理："宽严相济"视域下资格刑的价值新探',
        outputPath: '引注整理-资格刑论文.docx',
        profile: 'academic'
      }
    }])
    // 剥离 JSON 块，保留正文
    expect(recovered?.visibleText).toContain('我来从论文中提取全部引注')
    expect(recovered?.visibleText).toContain('已生成，文件在桌面。')
    expect(recovered?.visibleText).not.toContain('from-markdown')
  })

  it('ignores a JSON block whose object lacks kind/operation (not a doc skill call)', () => {
    const text = '```json\n{ "a": 1, "b": 2 }\n```'
    expect(recoverJsonToolCalls(text, new Set(['document_skill_execute']))).toBeNull()
  })

  it('never recovers when document_skill_execute is not advertised', () => {
    const text = '```json\n{ "kind": "docx", "operation": "from-markdown" }\n```'
    expect(recoverJsonToolCalls(text, new Set(['bash']))).toBeNull()
  })

  it('ignores malformed JSON blocks', () => {
    const text = '```json\n{ this is not valid json\n```'
    expect(recoverJsonToolCalls(text, new Set(['document_skill_execute']))).toBeNull()
  })
})
