export function isLegalworkHealthResponseBody(body: string): boolean {
  let parsed: unknown
  try {
    parsed = JSON.parse(body) as unknown
  } catch {
    return false
  }
  if (!parsed || typeof parsed !== 'object') return false
  const record = parsed as Record<string, unknown>
  return record.status === 'ok' && record.service === 'legalwork' && record.mode === 'serve'
}
