import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { legalDocumentMarkdownToDocx } from './legal-document-export-service'
import {
  fillDocxTemplateWithMarkdown,
  markdownToTemplateBlocks
} from './template-docx-export-service'

const require = createRequire(import.meta.url)
const JSZip = require('jszip') as {
  loadAsync(data: Buffer): Promise<{
    file(path: string): { async(type: 'string'): Promise<string> } | null
  }>
}

function paragraphContaining(documentXml: string, text: string): string {
  return [...documentXml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)]
    .map((match) => match[0])
    .find((paragraph) => paragraph.includes(text)) ?? ''
}

function styleBlock(stylesXml: string, styleId: string): string {
  const pattern = new RegExp(
    `<w:style\\b[^>]*w:styleId="${styleId}"[^>]*>[\\s\\S]*?<\\/w:style>`
  )
  return stylesXml.match(pattern)?.[0] ?? ''
}

describe('format-preserving template DOCX export', () => {
  it('converts Markdown into clean Word text blocks without expanding long hrefs inline', () => {
    expect(markdownToTemplateBlocks([
      '# 法律意见书',
      '',
      '致：某公司',
      '',
      '[《民法典》第一百一十九条](https://example.com/statute/119)',
      '',
      '| 项目 | 内容 |',
      '| --- | --- |',
      '| 结论 | 合规 |'
    ].join('\n'))).toEqual([
      '法律意见书',
      '致：某公司',
      '《民法典》第一百一十九条',
      '项目　内容',
      '结论　合规'
    ])
  })

  it('preserves Chinese legal titles written with ASCII angle brackets', () => {
    expect(markdownToTemplateBlocks(
      '《最高人民法院关于适用<中华人民共和国民事诉讼法>的解释》第六十条'
    )).toEqual([
      '《最高人民法院关于适用<中华人民共和国民事诉讼法>的解释》第六十条'
    ])
  })

  it('maps generated paragraphs to semantic source styles instead of source paragraph positions', async () => {
    const source = await legalDocumentMarkdownToDocx({
      templateName: '客户模板',
      markdown: [
        '律师：原姓名',
        '',
        '# 原标题',
        '',
        '## 一、原章节',
        '',
        '原正文。',
        '',
        '### （一）原子标题',
        '',
        '1. 原编号项',
        '',
        '日期：2026年1月1日'
      ].join('\n')
    })
    const sourceZip = await JSZip.loadAsync(source)
    const sourceDocument = await sourceZip.file('word/document.xml')!.async('string')
    const sourceSection = sourceDocument.match(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/)?.[0]

    const result = await fillDocxTemplateWithMarkdown(
      source,
      [
        '# 法律意见书',
        '',
        '致：北京某公司',
        '',
        '关于：某特许经营协议纠纷的法律意见',
        '',
        '## 一、基本事实',
        '',
        '根据现有材料，本案基本事实如下。',
        '',
        '### （一）临时接管问题',
        '',
        '该问题应结合合同约定与行政规范分析。',
        '',
        '[《民法典》第五百八十四条](https://example.com/civil-code/584)',
        '',
        '律师：张律师',
        '',
        '日期：2026年8月8日'
      ].join('\n')
    )
    const outputZip = await JSZip.loadAsync(result.buffer)
    const outputDocument = await outputZip.file('word/document.xml')!.async('string')
    const outputSection = outputDocument.match(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/)?.[0]

    expect(outputSection).toBe(sourceSection)
    expect(paragraphContaining(outputDocument, '法律意见书')).toContain('w:val="Heading1"')
    expect(paragraphContaining(outputDocument, '一、基本事实')).toContain('w:val="Heading2"')
    expect(paragraphContaining(outputDocument, '（一）临时接管问题')).toContain('w:val="Heading3"')

    const bodyParagraph = paragraphContaining(outputDocument, '根据现有材料，本案基本事实如下。')
    expect(bodyParagraph).not.toContain('Heading1')
    expect(bodyParagraph).not.toContain('Heading2')
    expect(bodyParagraph).not.toContain('Heading3')
    expect(bodyParagraph).toContain('w:firstLineChars="200"')
    expect(bodyParagraph).not.toContain('<w:numPr>')

    expect(outputDocument).toContain('《民法典》第五百八十四条')
    expect(outputDocument).not.toContain('https://example.com/civil-code/584')
    expect(outputDocument).not.toContain('原姓名')
    expect(outputDocument).not.toContain('原标题')
    expect(result.generatedBlockCount).toBe(9)
    expect(result.sourceSlotCount).toBeGreaterThanOrEqual(7)
  })

  it('strips Word automatic numbering and heading outline levels from generated legal text', async () => {
    const source = await legalDocumentMarkdownToDocx({
      templateName: '客户模板',
      markdown: '# 原标题\n\n## 一、原章节\n\n1. 原编号项\n\n原正文。'
    })

    const result = await fillDocxTemplateWithMarkdown(
      source,
      '# 法律意见书\n\n## 一、基本事实\n\n（一）2015年9月30日，双方签订协议。\n\n正文说明。'
    )
    const outputZip = await JSZip.loadAsync(result.buffer)
    const outputDocument = await outputZip.file('word/document.xml')!.async('string')
    const outputStyles = await outputZip.file('word/styles.xml')!.async('string')

    const enumeratedParagraph = paragraphContaining(outputDocument, '（一）2015年9月30日')
    expect(enumeratedParagraph).not.toContain('<w:numPr>')
    expect(enumeratedParagraph).toContain('w:firstLine="0"')

    for (const styleId of ['Heading1', 'Heading2', 'Heading3']) {
      const style = styleBlock(outputStyles, styleId)
      if (style) expect(style).not.toContain('w:outlineLvl')
    }
  })
})
