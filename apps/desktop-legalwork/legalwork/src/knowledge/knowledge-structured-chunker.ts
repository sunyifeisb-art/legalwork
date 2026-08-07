import { createHash } from 'node:crypto'
import type { KnowledgeChunk, KnowledgeDocument } from '../contracts/knowledge.js'
import {
  KNOWLEDGE_CHUNKER_VERSION,
  knowledgeProvenanceId
} from './knowledge-index-version.js'

const TARGET_CHUNK_CHARS = 1_800
const MAX_CHUNK_CHARS = 2_400
const CHUNK_OVERLAP_CHARS = 160

type StructuredSection = {
  start: number
  end: number
  headingPath: string[]
  articleNumber?: string
}

type HeadingMarker = {
  level: number
  label: string
  articleNumber?: string
}

export function chunkKnowledgeDocument(
  document: KnowledgeDocument,
  content: string,
  documentHash: string
): KnowledgeChunk[] {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\u0000/g, '')
  const sections = splitStructuredSections(normalized)
  const chunks: KnowledgeChunk[] = []
  let chunkIndex = 0

  for (const section of sections) {
    for (const fragment of splitSection(normalized, section)) {
      const text = normalized.slice(fragment.start, fragment.end).trim()
      if (!text) continue
      const chunkHash = sha256(text)
      chunks.push({
        id: `${document.id}_${chunkIndex}`,
        documentId: document.id,
        title: document.title,
        path: document.path,
        relativePath: document.relativePath,
        category: document.category,
        tags: document.tags,
        keywords: document.keywords,
        content: text,
        layer: document.layer,
        chunkIndex,
        documentHash,
        chunkHash,
        provenanceId: knowledgeProvenanceId({ documentHash, chunkHash }),
        headingPath: section.headingPath,
        ...(section.articleNumber ? { articleNumber: section.articleNumber } : {}),
        charStart: fragment.start,
        charEnd: fragment.end,
        chunkerVersion: KNOWLEDGE_CHUNKER_VERSION
      })
      chunkIndex += 1
    }
  }

  return chunks
}

function splitStructuredSections(content: string): StructuredSection[] {
  const lines = content.split('\n')
  const sections: StructuredSection[] = []
  const headingStack: Array<{ level: number; label: string }> = []
  let offset = 0
  let sectionStart = 0
  let sectionHeadingPath: string[] = []
  let sectionArticleNumber: string | undefined

  const pushSection = (end: number): void => {
    if (end <= sectionStart) return
    sections.push({
      start: sectionStart,
      end,
      headingPath: sectionHeadingPath,
      ...(sectionArticleNumber ? { articleNumber: sectionArticleNumber } : {})
    })
  }

  for (const line of lines) {
    const marker = parseHeadingMarker(line)
    if (marker) {
      if (offset > sectionStart) pushSection(offset)
      while (headingStack.length && headingStack.at(-1)!.level >= marker.level) {
        headingStack.pop()
      }
      headingStack.push({ level: marker.level, label: marker.label })
      sectionStart = offset
      sectionHeadingPath = headingStack.map((entry) => entry.label)
      sectionArticleNumber = marker.articleNumber
    }
    offset += line.length + 1
  }

  pushSection(content.length)
  if (sections.length === 0 && content.trim()) {
    return [{ start: 0, end: content.length, headingPath: [] }]
  }
  return sections
}

function parseHeadingMarker(line: string): HeadingMarker | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  const markdown = /^(#{1,6})\s+(.+)$/.exec(trimmed)
  if (markdown) {
    return { level: markdown[1].length, label: markdown[2].trim() }
  }

  const chineseLegal = /^第([零〇一二三四五六七八九十百千万两\d]+)(编|章|节|条)(之[零〇一二三四五六七八九十百千万两\d]+)?\s*(.*)$/.exec(trimmed)
  if (chineseLegal) {
    const unit = chineseLegal[2]
    const baseLabel = `第${chineseLegal[1]}${unit}${chineseLegal[3] ?? ''}`
    const articleNumber = unit === '条' ? baseLabel : undefined
    const level = unit === '编' ? 1 : unit === '章' ? 2 : unit === '节' ? 3 : 4
    const suffix = chineseLegal[4]?.trim()
    return {
      level,
      // For legal articles the text after “第N条” is substantive rule text,
      // not a structural heading. Chapters/sections may legitimately carry a title.
      label: unit === '条'
        ? baseLabel
        : [baseLabel, suffix].filter(Boolean).join(' '),
      ...(articleNumber ? { articleNumber } : {})
    }
  }

  if (/^(本院认为|本院查明|经审理查明|诉讼请求|事实和理由|争议焦点|裁判理由|裁判结果|判决如下|裁定如下|判决结果|裁定结果)[：:]?$/.test(trimmed)) {
    return { level: 2, label: trimmed.replace(/[：:]$/, '') }
  }

  const chineseNumbered = /^([一二三四五六七八九十百]+)、\s*(.+)$/.exec(trimmed)
  if (chineseNumbered) {
    return { level: 2, label: `${chineseNumbered[1]}、${chineseNumbered[2]}` }
  }

  const arabicNumbered = /^(\d{1,3})[.、]\s*(.+)$/.exec(trimmed)
  if (arabicNumbered) {
    return { level: 2, label: `${arabicNumbered[1]}. ${arabicNumbered[2]}` }
  }

  return null
}

function splitSection(content: string, section: StructuredSection): Array<{ start: number; end: number }> {
  if (section.end - section.start <= MAX_CHUNK_CHARS) {
    return [{ start: section.start, end: section.end }]
  }

  const fragments: Array<{ start: number; end: number }> = []
  let start = section.start
  while (start < section.end) {
    const hardEnd = Math.min(section.end, start + MAX_CHUNK_CHARS)
    if (hardEnd >= section.end) {
      fragments.push({ start, end: section.end })
      break
    }

    const desired = Math.min(section.end, start + TARGET_CHUNK_CHARS)
    const splitAt = findBoundary(content, desired, hardEnd)
    const end = Math.max(start + 1, splitAt)
    fragments.push({ start, end })
    const next = Math.max(start + 1, end - CHUNK_OVERLAP_CHARS)
    start = next
  }
  return fragments
}

function findBoundary(content: string, desired: number, hardEnd: number): number {
  const window = content.slice(desired, hardEnd)
  const paragraph = window.indexOf('\n\n')
  if (paragraph >= 0) return desired + paragraph + 2

  const line = window.indexOf('\n')
  if (line >= 0) return desired + line + 1

  for (const punctuation of ['。', '；', ';', '！', '？', '. ']) {
    const at = window.indexOf(punctuation)
    if (at >= 0) return desired + at + punctuation.length
  }
  return hardEnd
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}
