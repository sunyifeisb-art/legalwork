import type { ChatBlock } from '../../agent/types'
import type { KnowledgeTreeNode } from './types'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning?: string
  quote?: KnowledgeChatQuote
  timestamp: number
}

export type KnowledgeChatQuote = {
  text: string
  label: string
}

export type KnowledgeChatContext =
  | { kind: 'global' }
  | { kind: 'folder'; folderPath: string; folderName: string }
  | { kind: 'file'; fileName: string; filePath?: string }

export type KnowledgeChatHistory = {
  messages: ChatMessage[]
  context: KnowledgeChatContext
}

export const KNOWLEDGE_DIRECT_ANSWER_INSTRUCTION =
  '直接回答用户问题，不要在回答开头重复、改写或概括用户问题；不要把用户问题作为 Markdown 标题、加粗文本或引言单独输出。'

// Defensive UI guard for already-persisted DeepSeek protocol frames. Runtime
// recovery is the primary protection, but older turns may already contain the
// serialized DSML `calls` / `tool_calls` wrapper in assistant text.
export function stripKnowledgeDsmlProtocol(answer: string): string {
  if (!answer.includes('DSML')) return answer
  const normalized = answer.replace(/｜/g, '|')
  const bar = '\\|\\s*'
  const delim = `(?:${bar}${bar}|${bar})?`
  const callsTag = '(?:tool_calls|calls)'
  const complete = new RegExp(
    `<${delim}DSML${delim}\\s*${callsTag}\\s*>[\\s\\S]*?` +
    `<\\/${delim}DSML${delim}\\s*${callsTag}\\s*(?:>|$)`,
    'gi'
  )
  const unclosed = new RegExp(
    `<${delim}DSML${delim}\\s*${callsTag}\\s*>[\\s\\S]*$`,
    'gi'
  )
  return normalized.replace(complete, '').replace(unclosed, '').trim()
}

export function markKnowledgeSourceReferences(answer: string): string {
  return answer.replace(
    /\[来源\s*(\d+)\](?!\()/g,
    (_match, sourceNumber: string) => `[来源 ${sourceNumber}](#knowledge-source-${sourceNumber})`
  )
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeRepeatedQuestionLine(value: string): string {
  let normalized = value.trim()
  normalized = normalized.replace(/^>\s*/, '')
  normalized = normalized.replace(/^#{1,6}\s*/, '')

  const boldMatch = normalized.match(/^(?:\*\*|__)([\s\S]*?)(?:\*\*|__)$/)
  if (boldMatch) normalized = boldMatch[1]

  return normalized
    .replace(/^(?:用户问题|问题|提问)\s*[:：]\s*/, '')
    .trim()
    .replace(/^[“”"'‘’《》「」『』]+|[“”"'‘’《》「」『』]+$/g, '')
    .replace(/[?？!！。.:：;；，,]+$/g, '')
    .replace(/\s+/g, '')
    .toLocaleLowerCase()
}

export function stripRepeatedKnowledgeQuestionLead(answer: string, question: string): string {
  const normalizedQuestion = normalizeRepeatedQuestionLine(question)
  if (!answer || !normalizedQuestion) return answer

  const firstLineMatch = answer.match(/^(?:[ \t]*\r?\n)*[ \t]*([^\r\n]+)(?:\r?\n|$)/)
  if (!firstLineMatch) return answer

  const normalizedFirstLine = normalizeRepeatedQuestionLine(firstLineMatch[1])
  if (normalizedFirstLine !== normalizedQuestion) return answer

  return answer
    .slice(firstLineMatch[0].length)
    .replace(/^(?:[ \t]*\r?\n)+/, '')
}

function extractMarkdownSection(text: string, heading: string): string | null {
  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`)
  const match = text.match(pattern)
  return match?.[1]?.trim() || null
}

function restoreKnowledgeUserQuestion(text: string): string {
  const userQuestion = extractMarkdownSection(text, '用户问题')
  if (!userQuestion) return text

  // New prompts put internal instructions under their own heading, so the
  // section extractor above returns only the visible question. Older stored
  // prompts appended the instructions to the same section; remove those exact
  // legacy suffixes when restoring chat history.
  const legacyInstructionPrefixes = [
    '请优先依据“当前打开文件的正文”回答',
    '请基于检索到的内容给出准确、专业的回答',
    '请基于当前文件给出回答'
  ]
  const instructionStart = legacyInstructionPrefixes
    .map((prefix) => userQuestion.indexOf(`\n\n${prefix}`))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0]

  return (instructionStart === undefined ? userQuestion : userQuestion.slice(0, instructionStart)).trim()
}

function normalizeKnowledgeFileName(value: string): string {
  return value
    .replace(/（[^）]*）\s*$/, '')
    .replace(/\([^)]*\)\s*$/, '')
    .trim()
}

function extractKnowledgeChatContext(text: string): KnowledgeChatContext | null {
  const currentFile = extractMarkdownSection(text, '当前文件')
  const firstLine = currentFile?.split('\n').map((line) => line.trim()).find(Boolean)
  if (firstLine) {
    const fileName = normalizeKnowledgeFileName(firstLine)
    if (fileName) {
      const filePath = extractMarkdownSection(text, '当前文件路径')?.split('\n')[0]?.trim()
      return filePath ? { kind: 'file', fileName, filePath } : { kind: 'file', fileName }
    }
  }

  const currentScope = extractMarkdownSection(text, '当前知识库范围')
  const folderPath = currentScope
    ?.split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('路径：'))
    ?.slice('路径：'.length)
    .trim()
  if (!folderPath) return null
  const folderName = folderPath.split('/').filter(Boolean).at(-1) ?? folderPath
  return { kind: 'folder', folderPath, folderName }
}

function extractKnowledgeQuote(text: string): KnowledgeChatQuote | undefined {
  const section = extractMarkdownSection(text, 'PDF 划选引用')
  if (!section) return undefined
  const lines = section.split('\n')
  const source = lines.find((line) => line.trim().startsWith('来源：'))?.trim().slice('来源：'.length).trim()
  const page = lines.find((line) => line.trim().startsWith('页码：'))?.trim().slice('页码：'.length).trim()
  const delimitedBody = text.match(/<<<PDF_SELECTION>>>\n([\s\S]*?)\n<<<END_PDF_SELECTION>>>/)
  const bodyStart = lines.findIndex((line) => line.trim() === '正文：')
  const quoteText = (delimitedBody?.[1] ?? (bodyStart >= 0 ? lines.slice(bodyStart + 1).join('\n') : section)).trim()
  if (!quoteText) return undefined
  return {
    text: quoteText,
    label: [source, page].filter(Boolean).join(' · ') || 'PDF 划选内容'
  }
}

function normalizedPath(value: string): string {
  return value.replaceAll('\\', '/').replace(/^\.\//, '').replace(/^\/+|\/+$/g, '')
}

function collectFiles(nodes: KnowledgeTreeNode[]): KnowledgeTreeNode[] {
  const files: KnowledgeTreeNode[] = []
  for (const node of nodes) {
    if (node.kind === 'file') {
      files.push(node)
    } else {
      files.push(...collectFiles(node.children ?? []))
    }
  }
  return files
}

export function findKnowledgeFileForChatContext(
  nodes: KnowledgeTreeNode[],
  context: KnowledgeChatContext
): KnowledgeTreeNode | null {
  if (context.kind !== 'file') return null
  const files = collectFiles(nodes)
  if (context.filePath) {
    const targetPath = normalizedPath(context.filePath)
    const pathMatch = files.find((node) => normalizedPath(node.path) === targetPath)
    if (pathMatch) return pathMatch
  }

  const nameMatches = files.filter((node) => node.name === context.fileName)
  return nameMatches.length === 1 ? nameMatches[0] : null
}

export function knowledgeChatHistoryFromBlocks(blocks: ChatBlock[]): KnowledgeChatHistory {
  const messages: ChatMessage[] = []
  let context: KnowledgeChatContext = { kind: 'global' }
  let pendingReasoning = ''
  let latestUserQuestion = ''
  for (const block of blocks) {
    if (block.kind === 'user') {
      pendingReasoning = ''
      context = extractKnowledgeChatContext(block.text) ?? context
      latestUserQuestion = restoreKnowledgeUserQuestion(block.text)
      const quote = extractKnowledgeQuote(block.text)
      messages.push({
        id: block.id,
        role: 'user',
        content: latestUserQuestion,
        ...(quote ? { quote } : {}),
        timestamp: block.createdAt ? new Date(block.createdAt).getTime() : Date.now()
      })
    } else if (block.kind === 'reasoning') {
      pendingReasoning = [pendingReasoning, block.text].filter(Boolean).join('\n\n')
    } else if (block.kind === 'assistant') {
      const visibleAnswer = stripKnowledgeDsmlProtocol(block.text)
      messages.push({
        id: block.id,
        role: 'assistant',
        content: stripRepeatedKnowledgeQuestionLead(visibleAnswer, latestUserQuestion),
        ...(pendingReasoning ? { reasoning: pendingReasoning } : {}),
        timestamp: block.createdAt ? new Date(block.createdAt).getTime() : Date.now()
      })
      pendingReasoning = ''
    }
  }
  return { messages, context }
}
