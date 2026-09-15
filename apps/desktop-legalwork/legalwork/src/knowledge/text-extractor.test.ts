import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import {
  EXTRACTABLE_EXTENSIONS,
  extractDocumentText,
  isUsableExtractedText
} from './text-extractor.js'

describe('text extractor', () => {
  it('extracts text from pptx slide XML', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-pptx-'))
    try {
      const pptxPath = join(root, 'deck.pptx')
      await writeFile(pptxPath, buildStoredZip({
        'ppt/slides/slide1.xml': [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">',
          '<a:t>第一页标题</a:t><a:t>合同解除条件</a:t>',
          '</p:sld>'
        ].join(''),
        'ppt/slides/slide2.xml': [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">',
          '<a:t>第二页</a:t><a:t>违约责任 &amp; 赔偿</a:t>',
          '</p:sld>'
        ].join('')
      }))

      const result = await extractDocumentText(pptxPath)
      expect(result.text).toContain('第一页标题')
      expect(result.text).toContain('合同解除条件')
      expect(result.text).toContain('违约责任 & 赔偿')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('marks PowerPoint formats as extractable', () => {
    expect(EXTRACTABLE_EXTENSIONS.has('.pptx')).toBe(true)
    expect(EXTRACTABLE_EXTENSIONS.has('.ppt')).toBe(true)
  })

  it('extracts rows from a real xlsx workbook through CommonJS interop', async () => {
    const root = await mkdtemp(join(tmpdir(), 'legalwork-xlsx-'))
    try {
      const xlsxPath = join(root, '案件时间轴.xlsx')
      const xlsx = createRequire(import.meta.url)('xlsx') as typeof import('xlsx')
      const workbook = xlsx.utils.book_new()
      xlsx.utils.book_append_sheet(workbook, xlsx.utils.aoa_to_sheet([
        ['日期', '事项', '证据'],
        ['2026-01-15', '签订保证合同', '合同原件'],
        ['2026-03-20', '发出催告函', '送达回证']
      ]), '时间轴')
      xlsx.writeFile(workbook, xlsxPath)

      const result = await extractDocumentText(xlsxPath)

      expect(result.text).toContain('签订保证合同')
      expect(result.text).toContain('发出催告函')
      expect(result.text).toContain('送达回证')
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('rejects long but garbled PDF text so OCR can take over', () => {
    expect(isUsableExtractedText('。 \t、 \t。\n“ \t” 22BFX167\n。\n*\n。\n。 \t。\n'.repeat(8))).toBe(false)
    expect(isUsableExtractedText(
      '数字政府时代，自动化行政决定应当遵守正当程序，并保障当事人的知情权、陈述申辩权和人工复核权。'.repeat(3)
    )).toBe(true)
    expect(isUsableExtractedText(`有效正文${''.repeat(20)}有效正文`.repeat(10))).toBe(false)
  })
})

function buildStoredZip(files: Record<string, string>): Buffer {
  const chunks: Buffer[] = []
  const centralDirectory: Buffer[] = []
  let offset = 0
  for (const [name, content] of Object.entries(files)) {
    const nameBuffer = Buffer.from(name)
    const data = Buffer.from(content)
    const localHeader = Buffer.alloc(30)
    localHeader.writeUInt32LE(0x04034b50, 0)
    localHeader.writeUInt16LE(20, 4)
    localHeader.writeUInt16LE(0, 6)
    localHeader.writeUInt16LE(0, 8)
    localHeader.writeUInt32LE(0, 14)
    localHeader.writeUInt32LE(data.length, 18)
    localHeader.writeUInt32LE(data.length, 22)
    localHeader.writeUInt16LE(nameBuffer.length, 26)
    localHeader.writeUInt16LE(0, 28)
    chunks.push(localHeader, nameBuffer, data)

    const centralHeader = Buffer.alloc(46)
    centralHeader.writeUInt32LE(0x02014b50, 0)
    centralHeader.writeUInt16LE(20, 4)
    centralHeader.writeUInt16LE(20, 6)
    centralHeader.writeUInt16LE(0, 8)
    centralHeader.writeUInt16LE(0, 10)
    centralHeader.writeUInt32LE(0, 16)
    centralHeader.writeUInt32LE(data.length, 20)
    centralHeader.writeUInt32LE(data.length, 24)
    centralHeader.writeUInt16LE(nameBuffer.length, 28)
    centralHeader.writeUInt16LE(0, 30)
    centralHeader.writeUInt16LE(0, 32)
    centralHeader.writeUInt32LE(offset, 42)
    centralDirectory.push(centralHeader, nameBuffer)
    offset += localHeader.length + nameBuffer.length + data.length
  }

  const centralOffset = offset
  const centralSize = centralDirectory.reduce((sum, chunk) => sum + chunk.length, 0)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(Object.keys(files).length, 8)
  end.writeUInt16LE(Object.keys(files).length, 10)
  end.writeUInt32LE(centralSize, 12)
  end.writeUInt32LE(centralOffset, 16)
  return Buffer.concat([...chunks, ...centralDirectory, end])
}
