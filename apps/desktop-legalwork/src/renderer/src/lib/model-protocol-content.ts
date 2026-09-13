const DSML_BAR = '\\|\\s*'
const DSML_DELIM = `(?:${DSML_BAR}${DSML_BAR}|${DSML_BAR})?`
const DSML_CALLS_TAG = '(?:tool_calls|calls)'
const DSML_TOOL_CALLS_BLOCK = new RegExp(
  `<${DSML_DELIM}DSML${DSML_DELIM}\\s*${DSML_CALLS_TAG}\\s*>[\\s\\S]*?` +
  `<\\/${DSML_DELIM}DSML${DSML_DELIM}\\s*${DSML_CALLS_TAG}\\s*(?:>|$)`,
  'gi'
)
const DSML_TOOL_CALLS_UNCLOSED = new RegExp(
  `<${DSML_DELIM}DSML${DSML_DELIM}\\s*${DSML_CALLS_TAG}\\s*>[\\s\\S]*$`,
  'gi'
)
const INLINE_DOCUMENT_RESPONSE_BLOCK =
  /<inline_document_response>[\s\S]*?<\/inline_document_response>/gi
const INLINE_DOCUMENT_RESPONSE_UNCLOSED = /<inline_document_response>[\s\S]*$/gi

/** Remove model-provider protocol frames before content can become a deliverable. */
export function stripModelProtocolContent(value: string): string {
  const normalized = value.replace(/｜/g, '|')
  if (
    !normalized.includes('DSML') &&
    !normalized.includes('<invoke') &&
    !normalized.includes('inline_document_response')
  ) return value.trim()
  DSML_TOOL_CALLS_BLOCK.lastIndex = 0
  let stripped = normalized.replace(DSML_TOOL_CALLS_BLOCK, '')
  DSML_TOOL_CALLS_UNCLOSED.lastIndex = 0
  stripped = stripped.replace(DSML_TOOL_CALLS_UNCLOSED, '')
  INLINE_DOCUMENT_RESPONSE_BLOCK.lastIndex = 0
  stripped = stripped.replace(INLINE_DOCUMENT_RESPONSE_BLOCK, '')
  INLINE_DOCUMENT_RESPONSE_UNCLOSED.lastIndex = 0
  return stripped.replace(INLINE_DOCUMENT_RESPONSE_UNCLOSED, '').trim()
}
