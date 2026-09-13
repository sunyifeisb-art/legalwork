export type RecoveredDsmlToolCall = {
  toolName: string
  arguments: Record<string, unknown>
  visibleText: string
}

export type RecoveredDsmlToolCalls = {
  calls: Array<Omit<RecoveredDsmlToolCall, 'visibleText'>>
  visibleText: string
}

/**
 * Some DeepSeek-compatible gateways occasionally serialize their internal
 * DSML tool syntax into assistant text instead of returning structured
 * tool_calls. Recover every well-formed invocation whose name is in the tool
 * list advertised for this exact request. A single DSML block may contain
 * multiple invocations (for example, two independent bash checks), and
 * dropping all but the first can strand a required artifact workflow.
 */
export function recoverDsmlToolCalls(
  text: string,
  advertisedToolNames: ReadonlySet<string>
): RecoveredDsmlToolCalls | null {
  if (!text.includes('DSML') || !text.includes('invoke')) return null
  const invocation = /<[^<>]*invoke\s+name=["']([^"']+)["'][^<>]*>([\s\S]*?)<\/[^<>]*invoke\s*>/gi
  const calls: RecoveredDsmlToolCalls['calls'] = []
  let invocationMatch: RegExpExecArray | null
  while ((invocationMatch = invocation.exec(text)) !== null) {
    const toolName = invocationMatch[1]?.trim() ?? ''
    if (!toolName || !advertisedToolNames.has(toolName)) continue
    const body = invocationMatch[2] ?? ''
    const args: Record<string, unknown> = {}
    const parameter = /<[^<>]*parameter\s+name=["']([^"']+)["'](?:\s+string=["']([^"']+)["'])?[^<>]*>([\s\S]*?)<\/[^<>]*parameter\s*>/gi
    let parameterMatch: RegExpExecArray | null
    while ((parameterMatch = parameter.exec(body)) !== null) {
      const name = parameterMatch[1]?.trim()
      if (!name) continue
      const raw = decodeXmlEntities(parameterMatch[3] ?? '').trim()
      args[name] = parameterMatch[2]?.toLowerCase() === 'true' ? raw : parseJsonValue(raw)
    }
    calls.push({ toolName, arguments: args })
  }
  if (calls.length === 0) return null

  // Some streamed DeepSeek replies terminate immediately after the final
  // `tool_calls` name, omitting only the closing `>`. The invocations and
  // parameters are still complete and executable, so remove the protocol
  // frame through EOF after recovering them.
  const wholeBlock = /<[^<>]*(?:tool_calls|calls)[^<>]*>[\s\S]*?<\/[^<>]*(?:tool_calls|calls)\s*(?:>|$)/gi
  const visibleText = text.replace(wholeBlock, '').trim()
  return { calls, visibleText }
}

/** Backward-compatible single-call view for callers that only need one call. */
export function recoverDsmlToolCall(
  text: string,
  advertisedToolNames: ReadonlySet<string>
): RecoveredDsmlToolCall | null {
  const recovered = recoverDsmlToolCalls(text, advertisedToolNames)
  const first = recovered?.calls[0]
  if (!recovered || !first) return null
  return { ...first, visibleText: recovered.visibleText }
}

const JSON_TOOL_CALL_BLOCK =
  /```(?:json|JSON)\s*([\s\S]*?)```/g

/**
 * Recover a structured tool call the model emitted as a fenced JSON block
 * instead of a native tool_calls entry or DSML XML.
 *
 * DeepSeek occasionally serializes a tool invocation as ```json
 * { "kind": "docx", "operation": "from-markdown", ... } ``` when the argument
 * payload is large. The XML-based recoverDsmlToolCalls does not recognize this
 * shape, so the JSON would otherwise be left as visible text and the tool never
 * runs. We treat any fenced block whose object carries both `kind` and
 * `operation` as a document_skill_execute call (the only tool whose arguments
 * use that shape), stripping the fence from the visible text.
 */
export function recoverJsonToolCalls(
  text: string,
  advertisedToolNames: ReadonlySet<string>
): RecoveredDsmlToolCalls | null {
  const calls: RecoveredDsmlToolCalls['calls'] = []
  let match: RegExpExecArray | null
  while ((match = JSON_TOOL_CALL_BLOCK.exec(text)) !== null) {
    const raw = match[1]?.trim()
    if (!raw) continue
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      continue
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue
    const record = parsed as Record<string, unknown>
    // Only the document skill uses { kind, operation } in its argument shape.
    if (typeof record.kind !== 'string' || typeof record.operation !== 'string') continue
    const toolName = 'document_skill_execute'
    if (!advertisedToolNames.has(toolName)) continue
    calls.push({ toolName, arguments: record })
  }
  if (calls.length === 0) return null
  const visibleText = text.replace(JSON_TOOL_CALL_BLOCK, '').trim()
  return { calls, visibleText }
}

// DeepSeek 的 DSML 序列化在流式/转义过程中可能混入全角字符：
// 半角 `<`（U+003C）、`>`（U+003E）通常保持 ASCII，但竖线 `|`（U+007C）
// 常被转成全角 `｜`（U+FF5C），tag 名（tool_calls、invoke、parameter、"/"）
// 仍为 ASCII。实测泄漏文本有两种变体：
//  - `<｜｜DSML｜｜ tool_calls>`（单竖线 + DSML + 双竖线）
//  - `<||DSML||tool_calls>`（双竖线 + DSML + 双竖线）
// 为稳健匹配，先把全角竖线归一化为半角，再用兼容两种前缀的正则匹配
// `<...DSML...tool_calls>` 的完整块。归一化只作用于分隔符竖线，不影响正文。
// Some gateways insert whitespace between the vertical bars while escaping
// the marker, e.g. `<| |DSML| | tool_calls>`. Accept that spelling too; the
// match still requires the DSML token plus a calls/tool_calls tag, so ordinary prose
// is unaffected.
const DSML_BAR = '\\|\\s*'
const DSML_DELIM = `(?:${DSML_BAR}${DSML_BAR}|${DSML_BAR})?`
const DSML_CALLS_TAG = '(?:tool_calls|calls)'
// 匹配 `<|DSML||tool_calls>` / `<|DSML||calls>` 及对应闭合标签的整块。
const DSML_TOOL_CALLS_BLOCK =
  new RegExp(
    `<${DSML_DELIM}DSML${DSML_DELIM}\\s*${DSML_CALLS_TAG}\\s*>[\\s\\S]*?` +
    `<\\/${DSML_DELIM}DSML${DSML_DELIM}\\s*${DSML_CALLS_TAG}\\s*(?:>|$)`,
    'gi'
  )
const DSML_TOOL_CALLS_UNCLOSED =
  new RegExp(`<${DSML_DELIM}DSML${DSML_DELIM}\\s*${DSML_CALLS_TAG}\\s*>[\\s\\S]*$`, 'gi')

function normalizeDsmlVerticalBars(text: string): string {
  // U+FF5C（｜ 全角竖线）→ U+007C（| 半角竖线）
  return text.replace(/｜/g, '|')
}

/**
 * Detect an incomplete DSML frame while provider text is still streaming.
 *
 * The live DeepSeek response arrives as tiny chunks ("<", then
 * "｜｜DSML｜｜", then "tool_calls"). Waiting for the closing tag before
 * recognizing the frame leaks every opening chunk into the visible assistant
 * message. This predicate deliberately recognizes only the protocol-shaped
 * suffix beginning at the latest `<`; ordinary prose is released as soon as
 * that suffix can no longer become a DSML tool_calls tag.
 */
export function isPotentialDsmlToolCallStream(text: string): boolean {
  const normalized = normalizeDsmlVerticalBars(text)
  if (looksLikeDsmlToolCalls(normalized)) return true

  const allCompact = normalized.replace(/\s+/g, '')
  if (/<\|{1,2}DSML\|{1,2}(?:tool_calls|calls)>/i.test(allCompact)) return true

  const start = normalized.lastIndexOf('<')
  if (start < 0) return false
  const compact = normalized.slice(start).replace(/\s+/g, '')
  const openTags = ['tool_calls', 'calls'].flatMap((tagName) => [
    `<|DSML|${tagName}>`,
    `<|DSML||${tagName}>`,
    `<||DSML|${tagName}>`,
    `<||DSML||${tagName}>`
  ])
  if (openTags.some((tag) => tag.startsWith(compact))) return true
  return false
}

/**
 * Whether the text contains a raw DSML tool-calls block. When recovery failed
 * (e.g. the requested tool is no longer advertised — cost-budget wrap-up or a
 * scoping change can strip the tool list mid-turn), this tells callers the
 * model serialized a tool invocation as visible text, which must never reach
 * the user as a final reply.
 */
export function looksLikeDsmlToolCalls(text: string): boolean {
  const normalized = normalizeDsmlVerticalBars(text)
  if (!normalized.includes('DSML') && !normalized.includes('<invoke')) return false
  DSML_TOOL_CALLS_BLOCK.lastIndex = 0
  if (DSML_TOOL_CALLS_BLOCK.test(normalized)) return true
  DSML_TOOL_CALLS_UNCLOSED.lastIndex = 0
  return DSML_TOOL_CALLS_UNCLOSED.test(normalized)
}

/**
 * Strip every DSML tool-calls block from the text, returning what remains for
 * the user. Callers use this as a last-resort guard after recovery failed: a
 * reply that is *only* DSML becomes an empty string and is dropped instead of
 * leaking raw XML into the summary or stage announcements.
 */
export function stripDsmlToolCalls(text: string): string {
  const normalized = normalizeDsmlVerticalBars(text)
  if (!normalized.includes('DSML') && !normalized.includes('<invoke')) return text
  const withoutCompleteFrames = normalized.replace(DSML_TOOL_CALLS_BLOCK, '')
  DSML_TOOL_CALLS_UNCLOSED.lastIndex = 0
  return withoutCompleteFrames.replace(DSML_TOOL_CALLS_UNCLOSED, '').trim()
}

function parseJsonValue(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}
