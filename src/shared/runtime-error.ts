/**
 * Shared parser for Legalwork runtime error bodies.
 *
 * Legalwork's contract (`legalwork/src/contracts/errors.ts`) returns
 * `{ code, message, details? }`. Older code paths may also surface
 * `{ error: string | { message }, message? }` where `error` is a
 * legacy machine-readable code (e.g. `runtime_auth_required`).
 *
 * This module normalises both shapes so the renderer and main
 * process agree on a single `RuntimeError` view. The `code` field
 * always carries either a Legalwork contract code or one of the
 * `LEGACY_MAIN_GUARD_CODES` (main-process guard codes that aren't
 * part of the Legalwork schema). `details` carries the original
 * payload untouched so callers that need more context can read it.
 */
export type LegalworkErrorCode =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'turn_in_progress'
  | 'turn_not_running'
  | 'approval_not_pending'
  | 'capability_unavailable'
  | 'provider_unavailable'
  | 'policy_blocked'
  | 'model_modality_unsupported'
  | 'attachment_validation_failed'
  | 'internal_error'
  | 'not_implemented'
  | 'aborted'
  | 'unknown'

export type LegacyMainGuardCode =
  | 'runtime_auth_required'
  | 'runtime_request_failed'
  | 'fetch_failed'
  | 'runtime_offline'
  | 'runtime_port_conflict'
  | 'runtime_unhealthy'
  | 'runtime_request_user_input_unsupported'
  | 'missing_api_key'

export type RuntimeErrorCode = LegalworkErrorCode | LegacyMainGuardCode

export type RuntimeError = {
  code: RuntimeErrorCode
  message: string
  details?: unknown
}

const KNOWN_LEGALWORK_CODES: ReadonlySet<LegalworkErrorCode> = new Set<LegalworkErrorCode>([
  'validation_error',
  'unauthorized',
  'forbidden',
  'not_found',
  'conflict',
  'rate_limited',
  'turn_in_progress',
  'turn_not_running',
  'approval_not_pending',
  'capability_unavailable',
  'provider_unavailable',
  'policy_blocked',
  'model_modality_unsupported',
  'attachment_validation_failed',
  'internal_error',
  'not_implemented',
  'aborted'
])

const KNOWN_LEGACY_CODES: ReadonlySet<LegacyMainGuardCode> = new Set<LegacyMainGuardCode>([
  'runtime_auth_required',
  'runtime_request_failed',
  'fetch_failed',
  'runtime_offline',
  'runtime_port_conflict',
  'runtime_unhealthy',
  'runtime_request_user_input_unsupported',
  'missing_api_key'
])

function normalizeCode(value: unknown): RuntimeErrorCode {
  if (typeof value !== 'string') return 'unknown'
  if ((KNOWN_LEGALWORK_CODES as Set<string>).has(value)) return value as LegalworkErrorCode
  if ((KNOWN_LEGACY_CODES as Set<string>).has(value)) return value as LegacyMainGuardCode
  return 'unknown'
}

function readString(...candidates: Array<unknown>): string {
  for (const value of candidates) {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) return trimmed
    }
  }
  return ''
}

function readNestedMessage(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const record = value as Record<string, unknown>
  return readString(record.message)
}

/**
 * Parse a Legalwork runtime error body. Falls back to the supplied
 * fallback message when the body is empty, not JSON, or carries no
 * recognisable fields. The returned object always has `code` and
 * `message`; `details` is only present when the body carried one.
 */
export function parseRuntimeErrorBody(body: string, fallback: string): RuntimeError {
  if (!body) {
    return { code: 'unknown', message: fallback }
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch {
    const trimmed = body.trim()
    return { code: 'unknown', message: trimmed || fallback }
  }
  if (!parsed || typeof parsed !== 'object') {
    return { code: 'unknown', message: fallback }
  }
  const record = parsed as Record<string, unknown>
  const code = normalizeCode(record.code ?? record.error)
  const nestedMessage = readNestedMessage(record.error)
  const topErrorMessage = typeof record.error === 'string' ? record.error.trim() : ''
  const message =
    readString(record.message) || topErrorMessage || nestedMessage || fallback
  const details = 'details' in record ? record.details : undefined
  return details === undefined ? { code, message } : { code, message, details }
}

/**
 * Convert a parsed runtime error into a JS `Error` instance. The
 * `message` carries the human-readable string; the `code` and any
 * `details` are embedded as a JSON envelope so consumers that need
 * structured access can still parse it back out via
 * `parseRuntimeErrorBody`.
 */
export function runtimeErrorToError(error: RuntimeError): Error {
  if (error.code === 'unknown' && error.details === undefined) {
    return new Error(error.message)
  }
  return new Error(
    JSON.stringify({ code: error.code, message: error.message, details: error.details })
  )
}

export function isKnownLegalworkErrorCode(value: unknown): value is LegalworkErrorCode {
  return typeof value === 'string' && (KNOWN_LEGALWORK_CODES as Set<string>).has(value)
}

export function isLegacyMainGuardCode(value: unknown): value is LegacyMainGuardCode {
  return typeof value === 'string' && (KNOWN_LEGACY_CODES as Set<string>).has(value)
}
