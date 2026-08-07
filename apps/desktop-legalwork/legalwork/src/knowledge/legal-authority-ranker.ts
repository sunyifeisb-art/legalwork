export type LegalSourceKind =
  | 'statute'
  | 'judicial_interpretation'
  | 'judgment'
  | 'guideline'
  | 'academic'
  | 'template'
  | 'unknown'

export interface LegalAuthorityMeta {
  sourceKind?: LegalSourceKind
  court?: string
  effectiveDate?: string
  deprecated?: boolean
}

export function legalAuthorityScore(meta: LegalAuthorityMeta): number {
  if (meta.deprecated) return 0

  let score = 0
  switch (meta.sourceKind) {
    case 'statute':
      score += 1
      break
    case 'judicial_interpretation':
      score += 0.95
      break
    case 'judgment':
      score += 0.8
      break
    case 'guideline':
      score += 0.6
      break
    case 'academic':
      score += 0.4
      break
    case 'template':
      score += 0.2
      break
    default:
      score += 0.3
  }

  if (meta.court?.includes('最高')) score += 0.05

  return Math.min(1, score)
}

export function combineLegalRetrievalScore(input: {
  semanticScore: number
  keywordScore: number
  authorityScore: number
  freshnessScore: number
}): number {
  return (
    input.semanticScore * 0.4 +
    input.keywordScore * 0.25 +
    input.authorityScore * 0.25 +
    input.freshnessScore * 0.1
  )
}
