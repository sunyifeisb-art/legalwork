import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
import { inflateRawSync } from 'node:zlib'
import { ensurePdfDomGeometry } from './pdf-dom-geometry.js'

const execFileAsync = promisify(execFile)
const MIN_TEXT_BEFORE_OCR = 40
const OCR_OUTPUT_BUFFER_BYTES = 64 * 1024 * 1024
const OCR_TIMEOUT_MS = 120_000

export const EXTRACTABLE_EXTENSIONS = new Set([
  '.pdf',
  '.docx',
  '.doc',
  '.pptx',
  '.ppt',
  '.xlsx',
  '.xls',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.bmp',
  '.tiff',
  '.tif'
])

export type DocumentTextResult = {
  text: string
  /** Formatted HTML for docx files; undefined for other formats. */
  html?: string
}

/**
 * Extract plain text from common binary document formats.
 * Falls back to empty string when extraction fails or the format is unsupported.
 */
export async function extractDocumentText(filePath: string): Promise<DocumentTextResult> {
  const extension = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
  try {
    if (extension === '.pdf') {
      const text = await extractPdfText(filePath)
      return { text }
    }
    if (extension === '.docx' || extension === '.doc') {
      const text = await extractDocxText(filePath)
      let html: string | undefined
      if (extension === '.docx') {
        html = await extractDocxHtml(filePath).catch(() => undefined)
      }
      return { text, html }
    }
    if (extension === '.pptx') {
      const text = await extractPptxText(filePath)
      return { text }
    }
    if (extension === '.ppt') {
      const text = await extractTextutilText(filePath)
      return { text }
    }
    if (extension === '.xlsx' || extension === '.xls') {
      const text = await extractXlsxText(filePath)
      return { text }
    }
    if (isOcrImageExtension(extension)) {
      const text = await extractOcrText(filePath)
      return { text }
    }
  } catch {
    // Extraction failures are treated as unindexable content.
  }
  return { text: '' }
}

async function extractPdfText(filePath: string): Promise<string> {
  ensurePdfDomGeometry()
  const { PDFParse } = await import('pdf-parse')
  const buffer = await readFile(filePath)
  const parser = new PDFParse({ data: buffer })
  try {
    const result = await parser.getText()
    const text = normalizeExtractedText(result.text)
    if (isUsableExtractedText(text)) return text
    const ocrText = await extractOcrText(filePath)
    return isUsableExtractedText(ocrText) ? ocrText : text
  } finally {
    await parser.destroy()
  }
}

/**
 * Length alone is not enough for PDF extraction: broken font maps often yield
 * hundreds of punctuation marks, page numbers and private-use glyphs. Such
 * output must fall through to OCR instead of polluting the index.
 */
export function isUsableExtractedText(text: string): boolean {
  const compact = text.replace(/\s+/g, '')
  if (compact.length < MIN_TEXT_BEFORE_OCR) return false
  const privateOrReplacement = compact.match(/[\uE000-\uF8FF\uFFFD]/g)?.length ?? 0
  if (privateOrReplacement > Math.max(2, compact.length * 0.02)) return false
  const semantic = compact.match(/[\p{L}\p{N}]/gu)?.length ?? 0
  if (semantic < 20 || semantic / compact.length < 0.35) return false
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.length >= 4) {
    const informativeLines = lines.filter((line) => (
      (line.match(/[\p{L}\p{N}]/gu)?.length ?? 0) >= 2
    )).length
    if (informativeLines / lines.length < 0.5) return false
  }
  return true
}

async function extractDocxText(filePath: string): Promise<string> {
  if (filePath.toLowerCase().endsWith('.doc')) {
    const converted = await extractTextutilText(filePath)
    if (converted) return converted
  }
  const { default: mammoth } = await import('mammoth')
  const buffer = await readFile(filePath)
  const result = await mammoth.extractRawText({ buffer })
  return normalizeExtractedText(result.value)
}

/**
 * Extract formatted HTML from a .docx file, preserving fonts, sizes,
 * bold/italic, paragraphs, headings, and basic structure.
 */
export async function extractDocxHtml(filePath: string): Promise<string> {
  const { default: mammoth } = await import('mammoth')
  const buffer = await readFile(filePath)
  const result = await mammoth.convertToHtml({ buffer }, {
    styleMap: [
      'p[style-name=\'Title\'] => h1:fresh',
      'p[style-name=\'Subtitle\'] => h2:fresh',
      'p[style-name=\'Heading 1\'] => h1:fresh',
      'p[style-name=\'Heading 2\'] => h2:fresh',
      'p[style-name=\'Heading 3\'] => h3:fresh',
      'p[style-name=\'Heading 4\'] => h4:fresh',
      'r[style-name=\'Strong\'] => strong',
      'r[style-name=\'Emphasis\'] => em'
    ]
  })
  return result.value || ''
}

async function extractPptxText(filePath: string): Promise<string> {
  const buffer = await readFile(filePath)
  const entries = readZipEntries(buffer)
  const slideEntries = entries
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/i.test(entry.name))
    .sort((a, b) => naturalNameCompare(a.name, b.name))
  const noteEntries = entries
    .filter((entry) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/i.test(entry.name))
    .sort((a, b) => naturalNameCompare(a.name, b.name))
  const lines: string[] = []
  for (const entry of [...slideEntries, ...noteEntries]) {
    const text = extractOfficeXmlText(entry.data.toString('utf8'))
    if (text) lines.push(text)
  }
  return normalizeExtractedText(lines.join('\n\n'))
}

async function extractXlsxText(filePath: string): Promise<string> {
  // `xlsx` is CommonJS. Node's native ESM loader exposes it through `default`,
  // so destructuring named exports from `await import('xlsx')` throws before
  // any workbook is read. Load it through createRequire to keep extraction
  // identical in tests, the local runtime, and the packaged Electron app.
  const { readFile: readXlsx, utils } = createRequire(import.meta.url)('xlsx') as typeof import('xlsx')
  const workbook = readXlsx(filePath)
  const lines: string[] = []
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) continue
    const json = utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
    for (const row of json) {
      const cells = row.filter((cell): cell is string | number => cell !== undefined && cell !== null)
      if (cells.length > 0) lines.push(cells.join(' '))
    }
  }
  return normalizeExtractedText(lines.join('\n'))
}

async function extractTextutilText(filePath: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync('textutil', ['-convert', 'txt', '-stdout', filePath], {
      maxBuffer: OCR_OUTPUT_BUFFER_BYTES,
      windowsHide: true
    })
    return normalizeExtractedText(stdout)
  } catch {
    return ''
  }
}

type ZipEntry = {
  name: string
  data: Buffer
}

function readZipEntries(buffer: Buffer): ZipEntry[] {
  const eocdOffset = findEndOfCentralDirectory(buffer)
  if (eocdOffset < 0) return []
  const entryCount = buffer.readUInt16LE(eocdOffset + 10)
  let offset = buffer.readUInt32LE(eocdOffset + 16)
  const entries: ZipEntry[] = []
  for (let i = 0; i < entryCount; i += 1) {
    if (offset + 46 > buffer.length || buffer.readUInt32LE(offset) !== 0x02014b50) break
    const method = buffer.readUInt16LE(offset + 10)
    const compressedSize = buffer.readUInt32LE(offset + 20)
    const fileNameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const localHeaderOffset = buffer.readUInt32LE(offset + 42)
    const nameStart = offset + 46
    const name = buffer.subarray(nameStart, nameStart + fileNameLength).toString('utf8')
    const data = readZipEntryData(buffer, localHeaderOffset, compressedSize, method)
    if (data) entries.push({ name, data })
    offset = nameStart + fileNameLength + extraLength + commentLength
  }
  return entries
}

function readZipEntryData(
  buffer: Buffer,
  localHeaderOffset: number,
  compressedSize: number,
  method: number
): Buffer | null {
  if (localHeaderOffset + 30 > buffer.length || buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
    return null
  }
  const fileNameLength = buffer.readUInt16LE(localHeaderOffset + 26)
  const extraLength = buffer.readUInt16LE(localHeaderOffset + 28)
  const dataStart = localHeaderOffset + 30 + fileNameLength + extraLength
  const dataEnd = dataStart + compressedSize
  if (dataEnd > buffer.length) return null
  const compressed = buffer.subarray(dataStart, dataEnd)
  if (method === 0) return Buffer.from(compressed)
  if (method === 8) return inflateRawSync(compressed)
  return null
}

function findEndOfCentralDirectory(buffer: Buffer): number {
  const minOffset = Math.max(0, buffer.length - 65557)
  for (let offset = buffer.length - 22; offset >= minOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset
  }
  return -1
}

function extractOfficeXmlText(xml: string): string {
  const values: string[] = []
  const textRegex = /<(?:a:)?t\b[^>]*>([\s\S]*?)<\/(?:a:)?t>/g
  for (const match of xml.matchAll(textRegex)) {
    const value = decodeXmlText(match[1] ?? '').trim()
    if (value) values.push(value)
  }
  return values.join('\n')
}

function decodeXmlText(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function naturalNameCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

async function extractOcrText(filePath: string): Promise<string> {
  const paddleText = await extractWithLegalworkOcrAgent(filePath)
  if (paddleText) return paddleText

  const nativeText = await extractWithTesseract(filePath)
  if (nativeText) return nativeText

  const script = String.raw`
import json
import os
import sys

path = sys.argv[1]
lang = os.environ.get("LEGALWORK_OCR_LANG", "chi_sim+eng")
texts = []

def ocr_image(image):
    import pytesseract
    try:
        return pytesseract.image_to_string(image, lang=lang)
    except Exception:
        return pytesseract.image_to_string(image, lang="eng")

try:
    suffix = os.path.splitext(path)[1].lower()
    if suffix == ".pdf":
        import fitz
        doc = fitz.open(path)
        for page in doc:
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
            try:
                from PIL import Image
                image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                text = ocr_image(image)
            finally:
                pix = None
            if text.strip():
                texts.append(text)
    else:
        from PIL import Image
        with Image.open(path) as image:
            texts.append(ocr_image(image))
    print(json.dumps({"ok": True, "text": "\n\n".join(texts)}, ensure_ascii=False))
except Exception as exc:
    print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False))
`
  try {
    const { stdout } = await execFileAsync(process.env.PYTHON || process.env.PYTHON3 || 'python3', ['-c', script, filePath], {
      maxBuffer: OCR_OUTPUT_BUFFER_BYTES,
      timeout: OCR_TIMEOUT_MS,
      windowsHide: true
    })
    const parsed = JSON.parse(stdout.trim() || '{}') as { ok?: boolean; text?: string }
    return parsed.ok && parsed.text ? normalizeExtractedText(parsed.text) : ''
  } catch {
    return ''
  }
}

async function extractWithLegalworkOcrAgent(filePath: string): Promise<string> {
  const agentPath = process.env.LEGALWORK_OCR_AGENT_PATH?.trim()
  if (!agentPath) return ''

  const pythonCandidates = [
    process.env.LEGALWORK_OCR_PYTHON,
    process.env.LEGALWORK_PYTHON,
    process.env.PYTHON,
    process.env.PYTHON3,
    'python3'
  ].filter((candidate, index, all): candidate is string =>
    Boolean(candidate?.trim()) && all.indexOf(candidate) === index
  )

  for (const python of pythonCandidates) {
    try {
      const { stdout } = await execFileAsync(
        python,
        [agentPath, 'scan', filePath, 'fast_local_ocr'],
        {
          maxBuffer: OCR_OUTPUT_BUFFER_BYTES,
          timeout: OCR_TIMEOUT_MS,
          env: process.env,
          windowsHide: true
        }
      )
      const parsed = parseOcrAgentResult(stdout)
      if (parsed?.success === true && typeof parsed.text === 'string') {
        const text = normalizeExtractedText(parsed.text)
        if (text) return text
      }
    } catch {
      // Try another Python runtime, then fall back to the native Tesseract path.
    }
  }
  return ''
}

function parseOcrAgentResult(stdout: string): { success?: boolean; text?: string } | null {
  const jsonStart = stdout.lastIndexOf('\n{')
  const jsonText = (jsonStart >= 0 ? stdout.slice(jsonStart + 1) : stdout.slice(stdout.indexOf('{'))).trim()
  if (!jsonText.startsWith('{')) return null
  try {
    return JSON.parse(jsonText) as { success?: boolean; text?: string }
  } catch {
    return null
  }
}

async function extractWithTesseract(filePath: string): Promise<string> {
  const command = process.env.LEGALWORK_TESSERACT_CMD || 'tesseract'
  const requestedLanguage = process.env.LEGALWORK_OCR_LANG || 'chi_sim+eng'
  for (const language of [...new Set([requestedLanguage, 'eng'])]) {
    try {
      const { stdout } = await execFileAsync(
        command,
        [filePath, 'stdout', '-l', language],
        {
          maxBuffer: OCR_OUTPUT_BUFFER_BYTES,
          timeout: OCR_TIMEOUT_MS,
          env: process.env,
          windowsHide: true
        }
      )
      const text = normalizeExtractedText(stdout)
      if (text) return text
    } catch {
      // Try the English fallback, then the Python/Pillow route below.
    }
  }
  return ''
}

function isOcrImageExtension(extension: string): boolean {
  return ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff', '.tif'].includes(extension)
}

function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(new RegExp(`[${String.fromCharCode(0)}\\u200B-\\u200D\\uFEFF]`, 'g'), '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
