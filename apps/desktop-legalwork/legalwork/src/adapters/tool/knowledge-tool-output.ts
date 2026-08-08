import type { KnowledgeSearchHit } from '../../contracts/knowledge.js'
import type { KnowledgeContextRecord, KnowledgeRetrievalResult } from '../../contracts/knowledge-retrieval.js'

/**
 * Model-facing knowledge results must stay materially smaller than the full
 * retrieval objects kept inside the knowledge layer. DeepSeek bills every new
 * tool-result token once as cache-miss input, so returning the same evidence as
 * contextText + excerpt + content + bibliography is pure duplication.
 */
export const KNOWLEDGE_TOOL_MAX_SERIALIZED_CHARS = 8_000
export const KNOWLEDGE_SEARCH_MAX_SOURCES = 5
export const KNOWLEDGE_SEARCH_SNIPPET_CHARS = 500
export const KNOWLEDGE_AUTO_MAX_SOURCES = 6
export const KNOWLEDGE_AUTO_CONTEXT_CHARS = 5_000

const TITLE_CHARS = 180
const PATH_CHARS = 260
const CITATION_CHARS = 420
const TAG_CHARS = 80
const MAX_TAGS = 8
const MAX_AUTHORS = 4
const TRUNCATION_MARKER = '…[截断]'

export type KnowledgeToolPayloadMeta = {
  originalSourceCount: number
  returnedSourceCount: number
  serializedChars: number
  truncated: boolean
}

export function compactKnowledgeSearchToolOutput(input: {
  query: string
  layer: string
  sources: KnowledgeSearchHit[]
}): {
  query: string
  layer: string
  sources: Array<Record<string, unknown>>
  _meta: KnowledgeToolPayloadMeta
} {
  const sources = input.sources.slice(0, KNOWLEDGE_SEARCH_MAX_SOURCES).map((source) => ({
    title: clip(source.title, TITLE_CHARS),
    relativePath: clip(source.relativePath, PATH_CHARS),
    ...(source.category ? { category: clip(source.category, TITLE_CHARS) } : {}),
    ...(source.layer ? { layer: source.layer } : {}),
    ...(source.tags?.length ? { tags: compactStrings(source.tags, MAX_TAGS, TAG_CHARS) } : {}),
    ...(source.keywords?.length ? { keywords: compactStrings(source.keywords, MAX_TAGS, TAG_CHARS) } : {}),
    score: Number(source.score.toFixed(3)),
    ...(source.rankReason ? { rankReason: clip(source.rankReason, 220) } : {}),
    snippet: clip(source.snippet, KNOWLEDGE_SEARCH_SNIPPET_CHARS)
  }))

  const output = {
    query: input.query,
    layer: input.layer,
    sources,
    _meta: {
      originalSourceCount: input.sources.length,
      returnedSourceCount: sources.length,
      serializedChars: 0,
      truncated: input.sources.length > sources.length || input.sources.some((source) =>
        source.snippet.length > KNOWLEDGE_SEARCH_SNIPPET_CHARS || Boolean(source.content)
      )
    }
  }
  output._meta.serializedChars = serializedChars(output)
  return output
}

export function compactKnowledgeAutoRetrieveToolOutput(
  result: KnowledgeRetrievalResult
): {
  contextText: string
  sources: Array<Record<string, unknown>>
  consultedExternal: boolean
  latencyMs: number
  citations: string[]
  _meta: KnowledgeToolPayloadMeta & {
    originalContextChars: number
    returnedContextChars: number
  }
} {
  const sources = result.sources
    .slice(0, KNOWLEDGE_AUTO_MAX_SOURCES)
    .map(compactContextSource)
  const citations = result.citations
    .slice(0, KNOWLEDGE_AUTO_MAX_SOURCES)
    .map((citation) => clip(citation, CITATION_CHARS))

  // Reserve room for source references, citations and telemetry first. The
  // remaining budget belongs to contextText, which is the only representation
  // that carries answerable excerpts. Full content/excerpt fields are omitted
  // here; the model can explicitly call knowledge_read_file for a full source.
  const fixed = {
    sources,
    consultedExternal: result.consultedExternal,
    latencyMs: result.latencyMs,
    citations
  }
  const fixedChars = serializedChars(fixed)
  const reservedForEnvelope = 420
  const contextBudget = Math.max(
    800,
    Math.min(
      KNOWLEDGE_AUTO_CONTEXT_CHARS,
      KNOWLEDGE_TOOL_MAX_SERIALIZED_CHARS - fixedChars - reservedForEnvelope
    )
  )
  const contextText = clip(result.contextText, contextBudget)
  const output = {
    contextText,
    ...fixed,
    _meta: {
      originalSourceCount: result.sources.length,
      returnedSourceCount: sources.length,
      originalContextChars: result.contextText.length,
      returnedContextChars: contextText.length,
      serializedChars: 0,
      truncated:
        result.sources.length > sources.length ||
        result.contextText.length > contextText.length ||
        result.sources.some((source) => Boolean(source.content) || source.excerpt.length > 0) ||
        result.bibliography.length > 0
    }
  }

  // A very metadata-heavy result can still exceed the nominal budget. Trim the
  // only large free-form field once more against the actual serialized size.
  let size = serializedChars(output)
  if (size > KNOWLEDGE_TOOL_MAX_SERIALIZED_CHARS) {
    const overflow = size - KNOWLEDGE_TOOL_MAX_SERIALIZED_CHARS
    output.contextText = clip(output.contextText, Math.max(400, output.contextText.length - overflow - 64))
    output._meta.returnedContextChars = output.contextText.length
    output._meta.truncated = true
    size = serializedChars(output)
  }
  output._meta.serializedChars = size
  return output
}

function compactContextSource(source: KnowledgeContextRecord): Record<string, unknown> {
  return {
    path: clip(source.path, PATH_CHARS),
    title: clip(source.title, TITLE_CHARS),
    relevanceScore: Number(source.relevanceScore.toFixed(3)),
    ...(source.citation ? { citation: clip(source.citation, CITATION_CHARS) } : {}),
    ...(source.gbt7714Citation ? { gbt7714Citation: clip(source.gbt7714Citation, CITATION_CHARS) } : {}),
    ...(source.layer ? { layer: source.layer } : {}),
    ...(source.tags.length ? { tags: compactStrings(source.tags, MAX_TAGS, TAG_CHARS) } : {}),
    ...(source.authors.length ? { authors: compactStrings(source.authors, MAX_AUTHORS, TAG_CHARS) } : {}),
    ...(source.publicationYear ? { publicationYear: source.publicationYear } : {}),
    ...(source.publicationName ? { publicationName: clip(source.publicationName, TITLE_CHARS) } : {}),
    ...(source.doi ? { doi: clip(source.doi, TITLE_CHARS) } : {})
  }
}

function compactStrings(values: readonly string[], limit: number, maxChars: number): string[] {
  return values.slice(0, limit).map((value) => clip(value, maxChars))
}

function clip(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  if (maxChars <= TRUNCATION_MARKER.length) return text.slice(0, maxChars)
  return `${text.slice(0, maxChars - TRUNCATION_MARKER.length)}${TRUNCATION_MARKER}`
}

function serializedChars(value: unknown): number {
  try {
    return JSON.stringify(value).length
  } catch {
    return 0
  }
}
