import { createRequire } from 'node:module'

type ZipFile = {
  async(type: 'string'): Promise<string>
}

type JSZipInstance = {
  file(path: string): ZipFile | null
  file(path: string, content: string): JSZipInstance
  generateAsync(options: { type: 'nodebuffer'; compression: 'DEFLATE' }): Promise<Buffer>
}

type JSZipConstructor = {
  loadAsync(data: Buffer): Promise<JSZipInstance>
}

const require = createRequire(import.meta.url)
const JSZip = require('jszip') as JSZipConstructor

export type TemplateDocxFillResult = {
  buffer: Buffer
  sourceSlotCount: number
  generatedBlockCount: number
}

type TemplateBlockKind =
  | 'title'
  | 'section'
  | 'subsection'
  | 'item-heading'
  | 'addressee'
  | 'subject'
  | 'signature'
  | 'enumerated'
  | 'body'

type TemplateBlock = {
  kind: TemplateBlockKind
  text: string
}

type ParagraphTemplate = {
  xml: string
  text: string
  styleId?: string
  kind: TemplateBlockKind
}

function decodeXmlText(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function escapeXmlText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function splitMarkdownTableRow(line: string): string[] {
  const source = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells: string[] = []
  let current = ''
  let escaped = false
  for (const character of source) {
    if (escaped) {
      current += character
      escaped = false
    } else if (character === '\\') {
      escaped = true
    } else if (character === '|') {
      cells.push(current.trim())
      current = ''
    } else {
      current += character
    }
  }
  cells.push(current.trim())
  return cells
}

function isTableSeparator(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

function plainMarkdownText(value: string): string {
  return value
    .replace(/^#{1,6}\s+/, '')
    .replace(/^\s*>\s?/, '')
    .replace(/^\s*[-*+]\s+/, '')
    .replace(/^\s*\d+[.)]\s+/, '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Keep the visible citation/case label. Expanding the href inline made legal documents unreadable.
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(?:p|div|span|strong|em|u|b|i|table|thead|tbody|tr|th|td|ul|ol|li|blockquote|h[1-6])\b[^>]*>/gi, '')
    .trim()
}

function classifyPlainText(text: string): TemplateBlockKind {
  if (/^(致|致送)[：:]/.test(text)) return 'addressee'
  if (/^(关于|事由|案由|编号)[：:]/.test(text)) return 'subject'
  if (/^(律师事务所|某.+律师事务所|经办律师|律师|日期|签署日期|申请人|具状人|答辩人|上诉人|委托人|立遗嘱人)[：:]?/.test(text)) {
    return 'signature'
  }
  if (/^(?:[（(][一二三四五六七八九十百\d]+[）)]|\d+[.、．])\s*/.test(text)) return 'enumerated'
  return 'body'
}

function parseMarkdownBlocks(markdown: string): TemplateBlock[] {
  const blocks: TemplateBlock[] = []
  let inFence = false

  for (const rawLine of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const line = rawLine.trim()
    if (/^(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) {
      if (line) blocks.push({ kind: 'body', text: line })
      continue
    }
    if (!line || /^-{3,}$/.test(line)) continue

    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = splitMarkdownTableRow(line)
      if (!isTableSeparator(cells)) {
        const text = cells.map(plainMarkdownText).filter(Boolean).join('　')
        if (text) blocks.push({ kind: 'body', text })
      }
      continue
    }

    const heading = /^(#{1,6})\s+(.+?)\s*$/.exec(line)
    if (heading) {
      const level = heading[1]?.length ?? 1
      const text = plainMarkdownText(heading[2] ?? '')
      if (!text) continue
      blocks.push({
        kind: level === 1
          ? 'title'
          : level === 2
            ? 'section'
            : level === 3
              ? 'subsection'
              : 'item-heading',
        text
      })
      continue
    }

    const ordered = /^\s*(\d+)[.)、]\s+(.+)$/.exec(line)
    if (ordered) {
      const text = `${ordered[1]}、${plainMarkdownText(ordered[2] ?? '')}`
      if (text) blocks.push({ kind: 'enumerated', text })
      continue
    }

    const text = plainMarkdownText(line)
    if (text) blocks.push({ kind: classifyPlainText(text), text })
  }

  return blocks
}

export function markdownToTemplateBlocks(markdown: string): string[] {
  return parseMarkdownBlocks(markdown).map((block) => block.text)
}

function paragraphText(paragraphXml: string): string {
  return [...paragraphXml.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)]
    .map((match) => decodeXmlText(match[1] ?? ''))
    .join('')
}

function isEditableParagraph(paragraphXml: string): boolean {
  if (!paragraphText(paragraphXml).trim()) return false
  return !/<w:(?:fldChar|instrText|drawing|pict|object)\b/.test(paragraphXml)
}

function paragraphStyleId(paragraphXml: string): string | undefined {
  return paragraphXml.match(/<w:pStyle\s+w:val="([^"]+)"\s*\/>/)?.[1]
}

function classifySourceParagraph(paragraphXml: string): TemplateBlockKind {
  const text = paragraphText(paragraphXml).trim()
  const styleId = paragraphStyleId(paragraphXml) ?? ''
  if (/Heading1/i.test(styleId)) return 'title'
  if (/Heading2/i.test(styleId)) return 'section'
  if (/Heading3/i.test(styleId)) return 'subsection'
  if (/Heading[4-6]/i.test(styleId)) return 'item-heading'
  if (/^(致|致送)[：:]/.test(text)) return 'addressee'
  if (/^(关于|事由|案由|编号)[：:]/.test(text)) return 'subject'
  if (/^(律师事务所|某.+律师事务所|经办律师|律师|日期|签署日期|申请人|具状人|答辩人|上诉人|委托人|立遗嘱人)[：:]?/.test(text)) {
    return 'signature'
  }
  if (/^[一二三四五六七八九十百]+[、.．]/.test(text)) return 'section'
  if (/^[（(][一二三四五六七八九十百\d]+[）)]/.test(text)) return 'subsection'
  if (/^\d+[.、．]/.test(text)) return 'enumerated'
  return 'body'
}

function paragraphStyleSignature(paragraphXml: string): string {
  return paragraphXml.match(/<w:pPr>[\s\S]*?<\/w:pPr>/)?.[0] ?? '<w:pPr/>'
}

function mostCommonParagraphTemplate(paragraphs: string[]): string {
  const counts = new Map<string, { count: number; paragraph: string }>()
  for (const paragraph of paragraphs) {
    const signature = paragraphStyleSignature(paragraph)
    const current = counts.get(signature)
    counts.set(signature, {
      count: (current?.count ?? 0) + 1,
      paragraph: current?.paragraph ?? paragraph
    })
  }
  return [...counts.values()].sort((a, b) => b.count - a.count)[0]?.paragraph ?? paragraphs[0]!
}

function buildTemplatePool(paragraphs: string[]): Map<TemplateBlockKind, ParagraphTemplate[]> {
  const pool = new Map<TemplateBlockKind, ParagraphTemplate[]>()
  for (const xml of paragraphs) {
    const template: ParagraphTemplate = {
      xml,
      text: paragraphText(xml).trim(),
      styleId: paragraphStyleId(xml),
      kind: classifySourceParagraph(xml)
    }
    const group = pool.get(template.kind) ?? []
    group.push(template)
    pool.set(template.kind, group)
  }
  return pool
}

function firstTemplate(
  pool: Map<TemplateBlockKind, ParagraphTemplate[]>,
  kind: TemplateBlockKind,
  fallback: ParagraphTemplate
): ParagraphTemplate {
  const preferred = pool.get(kind)?.[0]
  if (preferred) return preferred
  if (kind === 'enumerated') return pool.get('body')?.[0] ?? fallback
  if (kind === 'item-heading') {
    return pool.get('subsection')?.[0] ?? pool.get('section')?.[0] ?? fallback
  }
  if (kind === 'subsection') return pool.get('section')?.[0] ?? fallback
  if (kind === 'addressee' || kind === 'subject' || kind === 'signature') {
    return pool.get('body')?.[0] ?? fallback
  }
  return pool.get('body')?.[0] ?? fallback
}

function stripParagraphProperty(properties: string, tag: string): string {
  const pair = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'g')
  const singleton = new RegExp(`<${tag}\\b[^>]*/>`, 'g')
  return properties.replace(pair, '').replace(singleton, '')
}

function normalizedParagraphProperties(paragraphXml: string, kind: TemplateBlockKind): string {
  let properties = paragraphXml.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/)?.[1] ?? ''
  for (const tag of ['w:numPr', 'w:ind', 'w:spacing', 'w:jc', 'w:outlineLvl']) {
    properties = stripParagraphProperty(properties, tag)
  }

  const noIndent = kind !== 'body'
  const alignment = kind === 'title'
    ? 'center'
    : kind === 'signature'
      ? 'right'
      : kind === 'addressee' || kind === 'subject'
        ? 'left'
        : 'both'
  const spacing = kind === 'title'
    ? '<w:spacing w:before="0" w:after="240" w:line="540" w:lineRule="auto"/>'
    : '<w:spacing w:before="0" w:after="0" w:line="360" w:lineRule="auto"/>'
  const indent = noIndent
    ? '<w:ind w:left="0" w:right="0" w:firstLine="0" w:firstLineChars="0"/>'
    : '<w:ind w:left="0" w:right="0" w:firstLine="480" w:firstLineChars="200"/>'

  return `<w:pPr>${properties}${spacing}${indent}<w:jc w:val="${alignment}"/></w:pPr>`
}

function firstRunProperties(paragraphXml: string): string {
  return paragraphXml.match(/<w:rPr>[\s\S]*?<\/w:rPr>/)?.[0] ?? ''
}

function buildParagraphFromTemplate(template: ParagraphTemplate, block: TemplateBlock): string {
  const pPr = normalizedParagraphProperties(template.xml, block.kind)
  const rPr = firstRunProperties(template.xml)
  return `<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${escapeXmlText(block.text)}</w:t></w:r></w:p>`
}

function neutralizeHeadingOutlines(stylesXml: string): string {
  return stylesXml.replace(
    /<w:style\b[^>]*w:type="paragraph"[^>]*w:styleId="(Heading[1-6])"[^>]*>[\s\S]*?<\/w:style>/g,
    (style) => style
      .replace(/<w:outlineLvl\b[^>]*\/>/g, '')
      .replace(/<w:outlineLvl\b[^>]*>[\s\S]*?<\/w:outlineLvl>/g, '')
  )
}

/**
 * Fill an uploaded DOCX while treating the source document as a style/layout donor.
 * Generated Markdown blocks are mapped by semantic role (title, section, body, signature)
 * instead of by source paragraph position. This prevents body text from inheriting random
 * Heading/list styles when the generated document has a different structure than the source.
 *
 * Page setup, headers, footers, relationships, body tables/images and other package parts
 * remain source-derived. Unused editable source paragraphs are removed rather than left as
 * empty spacing. Automatic Word numbering is stripped from generated paragraphs because the
 * legal-document text already carries its own Chinese numbering.
 */
export async function fillDocxTemplateWithMarkdown(
  source: Buffer,
  markdown: string
): Promise<TemplateDocxFillResult> {
  const blocks = parseMarkdownBlocks(markdown)
  if (blocks.length === 0) {
    throw new Error('生成内容为空，无法写入原 Word 模板。')
  }

  const zip = await JSZip.loadAsync(source)
  const documentFile = zip.file('word/document.xml')
  if (!documentFile) {
    throw new Error('原 Word 模板缺少 word/document.xml，文件可能已损坏。')
  }
  const documentXml = await documentFile.async('string')
  const bodyMatch = documentXml.match(/<w:body>([\s\S]*?)<\/w:body>/)
  if (!bodyMatch) {
    throw new Error('原 Word 模板正文结构无效，无法保留版式导出。')
  }

  const sourceBody = bodyMatch[1] ?? ''
  const editableParagraphs = [...sourceBody.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)]
    .map((match) => match[0])
    .filter(isEditableParagraph)
  if (editableParagraphs.length === 0) {
    throw new Error('原 Word 模板没有可写入的正文段落。')
  }

  const pool = buildTemplatePool(editableParagraphs)
  const fallbackParagraph = mostCommonParagraphTemplate(editableParagraphs)
  const fallbackTemplate: ParagraphTemplate = {
    xml: fallbackParagraph,
    text: paragraphText(fallbackParagraph).trim(),
    styleId: paragraphStyleId(fallbackParagraph),
    kind: classifySourceParagraph(fallbackParagraph)
  }

  let blockIndex = 0
  let filledBody = sourceBody.replace(/<w:p\b[\s\S]*?<\/w:p>/g, (paragraph) => {
    if (!isEditableParagraph(paragraph)) return paragraph
    const block = blocks[blockIndex]
    blockIndex += 1
    if (!block) return ''
    const template = firstTemplate(pool, block.kind, fallbackTemplate)
    return buildParagraphFromTemplate(template, block)
  })

  if (blocks.length > editableParagraphs.length) {
    const appended = blocks
      .slice(editableParagraphs.length)
      .map((block) => (
        buildParagraphFromTemplate(firstTemplate(pool, block.kind, fallbackTemplate), block)
      ))
      .join('')
    const sectionIndex = filledBody.lastIndexOf('<w:sectPr')
    filledBody = sectionIndex >= 0
      ? `${filledBody.slice(0, sectionIndex)}${appended}${filledBody.slice(sectionIndex)}`
      : `${filledBody}${appended}`
  }

  const filledDocumentXml = documentXml.replace(
    /<w:body>[\s\S]*?<\/w:body>/,
    `<w:body>${filledBody}</w:body>`
  )
  zip.file('word/document.xml', filledDocumentXml)

  const stylesFile = zip.file('word/styles.xml')
  if (stylesFile) {
    const stylesXml = await stylesFile.async('string')
    zip.file('word/styles.xml', neutralizeHeadingOutlines(stylesXml))
  }

  return {
    buffer: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }),
    sourceSlotCount: editableParagraphs.length,
    generatedBlockCount: blocks.length
  }
}
