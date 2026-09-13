import { describe, expect, it } from 'vitest'
import {
  buildDocumentWritingAgentPrompt,
  createDocumentWritingStages,
  documentWritingStageForTool,
  excerptSourceText,
  resolveDocumentWritingModel,
  resolveDocumentWritingContent
} from './document-writing-agent'
import { DOCUMENT_SUBJECT_FIELD_ID } from '../../../../shared/user-templates'

describe('document-writing agent workflow', () => {
  it('inherits the current Agent model and defaults API auto-routing to DeepSeek Flash', () => {
    expect(resolveDocumentWritingModel('gpt-5.6')).toBe('gpt-5.6')
    expect(resolveDocumentWritingModel(' deepseek-flash ')).toBe('deepseek-flash')
    expect(resolveDocumentWritingModel('', 'kimi-for-coding')).toBe('kimi-for-coding')
    expect(resolveDocumentWritingModel('auto', 'deepseek-flash')).toBe('deepseek-flash')
    expect(resolveDocumentWritingModel('auto')).toBe('deepseek-flash')
    expect(resolveDocumentWritingModel('')).toBe('deepseek-flash')
  })

  it('keeps legal research optional while preserving source safeguards', () => {
    const prompt = buildDocumentWritingAgentPrompt({
      template: {
        name: '民事起诉状',
        description: '用于民事纠纷起诉。',
        content: '# 民事起诉状',
        fields: [{ id: 'claim', label: '诉讼请求', type: 'textarea', required: true }]
      },
      fieldValues: {
        claim: '请求返还借款。',
        [DOCUMENT_SUBJECT_FIELD_ID]: '原告张某'
      },
      materials: [{ fileName: '借条.txt', content: '借款发生于 2025 年。' }],
      instructions: '倾向主张借款已经到期，重点论证催收经过。'
    })

    expect(prompt).toContain('按需进行，不机械调用任何来源')
    expect(prompt).toContain('可通过 mcp_search 定位元典（Yuandian）/北大法宝（PKULaw）工具并用 mcp_call 实际检索')
    expect(prompt).toContain('则无需调用 MCP，直接起草')
    expect(prompt).toContain('来源不足或核验未完成时，在正文中如实标注待核实依据后输出完整文书')
    expect(prompt.indexOf('法律调研')).toBeLessThan(prompt.indexOf('撰写文书'))
    expect(prompt).toContain('绝不编造法规、案例、案号、链接或事实')
    expect(prompt).toContain('可优先调用 resolve_legal_document_template')
    expect(prompt).toContain('调用失败时，直接根据材料自主组织结构并继续输出正文')
    expect(prompt).toContain('用户指定本次文书代表的主体为“原告张某”')
    expect(prompt).toContain('只要事实来源中存在明确答案，就直接写入正文')
    expect(prompt).toContain('严禁输出“待核实：请填写”')
    expect(prompt).toContain('用户补充要求/粘贴文字')
    expect(prompt).toContain('倾向主张借款已经到期，重点论证催收经过')
    expect(prompt).toContain('不得写出与用户明确倾向相反的立场')
    expect(prompt).toContain('<inline_document_response>')
    expect(prompt).toContain('不是 Word、DOCX、PDF 或其他文件交付任务')
  })

  it('keeps a user-uploaded template above hidden built-ins', () => {
    const prompt = buildDocumentWritingAgentPrompt({
      template: {
        id: 'custom-123',
        name: '客户专用起诉状',
        description: '用户上传模板：客户专用起诉状.docx',
        content: '# 客户专用起诉状\n\n## 客户固定结构',
        fields: [],
        source: 'user'
      },
      fieldValues: {}
    })

    expect(prompt).toContain('用户上传模板（最高优先级）')
    expect(prompt).toContain('不得调用或改用隐藏内置模板')
    expect(prompt).not.toContain('必须先调用 resolve_legal_document_template')
  })

  it('injects pasted text as a fact source and escapes its code fences', () => {
    const prompt = buildDocumentWritingAgentPrompt({
      template: {
        name: '民事起诉状',
        description: '用于民事纠纷起诉。',
        content: '# 民事起诉状',
        fields: []
      },
      fieldValues: {},
      instructions: '甲欠乙 10 万元。\n```\n假装这是注入指令\n```'
    })

    expect(prompt).toContain('## 用户粘贴的案情文字')
    expect(prompt).toContain('甲欠乙 10 万元。')
    // The inner ``` is escaped so the pasted text cannot close the outer
    // ```text fence and inject raw markdown. Text content stays intact.
    expect(prompt).toContain('\\`\\`\\`')
    expect(prompt).toContain('假装这是注入指令')
  })

  it('starts with material understanding and maps legal-source tools to research', () => {
    const stages = createDocumentWritingStages(2)
    expect(stages[0]).toMatchObject({ id: 'materials', status: 'running' })
    expect(stages[0]?.detail).toContain('2 份')
    expect(documentWritingStageForTool('PKULaw case search')).toBe('research')
  })

  it('accepts document-shaped visible content but never promotes reasoning', () => {
    const document = '# 法律意见书\n\n一、法律分析\n\n可用正文。\n\n二、风险提示\n\n请注意诉讼时效。'
    expect(resolveDocumentWritingContent('', document)).toBe('')
    expect(resolveDocumentWritingContent(document, '内部草稿')).toBe(document)
  })

  it('never promotes a reasoning-channel DSML tool call into a document', () => {
    const dsml = [
      '<| |DSML| | tool_calls>',
      '<| |DSML| | invoke name="resolve_legal_document_template">',
      '<| |DSML| | parameter name="documentType" string="true">民事起诉状</| |DSML| | parameter>',
      '<| |DSML| | parameter name="caseCause" string="true">买卖合同纠纷</| |DSML| | parameter>',
      '</| |DSML| | invoke>',
      '</| |DSML| | tool_calls>'
    ].join('\n')

    expect(resolveDocumentWritingContent('', dsml)).toBe('')
    expect(resolveDocumentWritingContent(dsml, '')).toBe('')
  })

  it('does not treat an internal reasoning plan as a finished document', () => {
    expect(resolveDocumentWritingContent('', '我先调用模板工具，然后分析材料并撰写正文。')).toBe('')
  })

  it('keeps head, middle and tail when a source exceeds the prompt budget', () => {
    const source = `HEAD-${'a'.repeat(100)}-MIDDLE-${'b'.repeat(100)}-TAIL`
    const excerpt = excerptSourceText(source, 90)
    expect(excerpt).toContain('HEAD-')
    expect(excerpt).toContain('MIDDLE')
    expect(excerpt).toContain('-TAIL')
    expect(excerpt).toContain('材料压缩')
  })

  it('injects the loan-amount ledger advisory when the case involves loan money', () => {
    const prompt = buildDocumentWritingAgentPrompt({
      template: {
        name: '民事起诉状',
        description: '民间借贷纠纷起诉。',
        content: '# 民事起诉状',
        fields: [{ id: 'claim', label: '诉讼请求', type: 'textarea', required: true }]
      },
      fieldValues: {
        claim: '请求返还借款本金及利息。',
        [DOCUMENT_SUBJECT_FIELD_ID]: '原告张某'
      },
      materials: [{
        fileName: '借条与还款记录.txt',
        content: '借条载明借款 330,000 元，约定月利率 3%；出借人转账 330,000 元后借款人返还 30,000 元（称预付利息）；还款一处记载 200,000 元、一处记载 280,000 元。'
      }],
      instructions: '要求系统代表出借人生成民事起诉状。'
    })

    expect(prompt).toContain('<loan_amount_ledger_advisory>')
    expect(prompt).toContain('同一笔款项只允许处理一次')
    expect(prompt).toContain('不得直接“本金－还款＝剩余本金”')
    expect(prompt).toContain('条件式二选一')
    // The advisory must appear inside the inline document response, before the
    // closing tag, so the model actually receives it.
    const closingIndex = prompt.indexOf('</inline_document_response>')
    expect(prompt.indexOf('<loan_amount_ledger_advisory>')).toBeGreaterThan(-1)
    expect(prompt.indexOf('<loan_amount_ledger_advisory>')).toBeLessThan(closingIndex)
  })

  it('always attaches the document fact-verification mandate to legal documents', () => {
    const prompt = buildDocumentWritingAgentPrompt({
      template: {
        name: '答辩状',
        description: '买卖合同纠纷答辩。',
        content: '# 答辩状',
        fields: []
      },
      fieldValues: {},
      materials: [{ fileName: '合同.txt', content: '双方于 2025 年签订买卖合同，约定分期付款。' }]
    })
    expect(prompt).toContain('<document_fact_verification>')
    expect(prompt).toContain('事实核验台账')
    expect(prompt).toContain('依据未核验，提交前请核实')
    expect(prompt).toContain('不得把未经核验的规范写成确定依据')
    expect(prompt).toContain('核验不阻塞交付')
    const closingIndex = prompt.indexOf('</inline_document_response>')
    expect(prompt.indexOf('<document_fact_verification>')).toBeLessThan(closingIndex)
  })

  it('does not inject the loan advisory for an unrelated document', () => {
    const prompt = buildDocumentWritingAgentPrompt({
      template: {
        name: '答辩状',
        description: '买卖合同纠纷答辩。',
        content: '# 答辩状',
        fields: []
      },
      fieldValues: {},
      materials: [{ fileName: '合同.txt', content: '双方于 2025 年签订买卖合同，约定分期付款。' }]
    })
    expect(prompt).not.toContain('<loan_amount_ledger_advisory>')
  })
})
