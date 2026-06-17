import { z } from 'zod'

/**
 * Structured API error codes returned by every Legalwork HTTP/SSE endpoint.
 *
 * The error contract mirrors what DeepSeek-GUI diagnostics can render:
 * the renderer needs a stable `code` to drive UI state and a human-readable
 * `message` to surface in toasts. `details` carries optional, JSON-encodable
 * per-endpoint information (for example a Zod issue list).
 */
export const LegalworkErrorCode = z.enum([
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
export type LegalworkErrorCode = z.infer<typeof LegalworkErrorCode>

export const LegalworkErrorBody = z.object({
  code: LegalworkErrorCode,
  message: z.string(),
  details: z.unknown().optional()
})
export type LegalworkErrorBody = z.infer<typeof LegalworkErrorBody>
