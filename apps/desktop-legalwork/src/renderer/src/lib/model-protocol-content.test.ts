import { describe, expect, it } from 'vitest'
import { stripModelProtocolContent } from './model-protocol-content'

describe('stripModelProtocolContent', () => {
  it('leaves ordinary text untouched', () => {
    expect(stripModelProtocolContent('普通的中文回复内容。')).toBe('普通的中文回复内容。')
  })

  it('removes the inline_document_response frame but keeps surrounding text', () => {
    expect(stripModelProtocolContent(
      '前言\n<inline_document_response>\n这是文书正文。\n</inline_document_response>\n结尾'
    )).toBe('前言\n\n结尾')
  })

  it('removes an unclosed inline_document_response frame', () => {
    expect(stripModelProtocolContent(
      '<inline_document_response>这是未闭合的正文。'
    )).toBe('')
  })

  it('still strips DSML tool-call frames', () => {
    expect(stripModelProtocolContent(
      '答案正文。\n<DSML tool_calls>\n<invoke name="bash">\n</invoke>\n</DSML tool_calls>'
    )).toBe('答案正文。')
  })

  it('strips DeepSeek DSML calls frames used by the live provider', () => {
    expect(stripModelProtocolContent([
      '答案正文。',
      '<| |DSML| | calls>',
      '<| |DSML| | invoke name="document_skill_execute">',
      '<| |DSML| | parameter name="kind" string="true">docx</| |DSML| | parameter>',
      '</| |DSML| | invoke>',
      '</| |DSML| | calls>'
    ].join('\n'))).toBe('答案正文。')
  })
})
