import type { KnowledgeStore } from './knowledge-store.js'

export type KnowledgeCitationSourceRef = {
  citationNumber: number
  chunkId: string
  provenanceId: string
}

export type KnowledgeCitationCheck = {
  citationNumber: number
  status: 'verified' | 'missing_source_mapping' | 'missing_chunk' | 'provenance_mismatch'
  chunkId?: string
  provenanceId?: string
  currentProvenanceId?: string
}

export type KnowledgeCitationVerification = {
  valid: boolean
  citationCount: number
  verifiedCount: number
  checks: KnowledgeCitationCheck[]
}

export async function verifyKnowledgeCitationProvenance(
  store: KnowledgeStore,
  draft: string,
  sources: KnowledgeCitationSourceRef[]
): Promise<KnowledgeCitationVerification> {
  const referencedNumbers = extractNumericCitationNumbers(draft)
  const sourceMap = new Map<number, KnowledgeCitationSourceRef>()
  for (const source of sources) {
    if (!Number.isInteger(source.citationNumber) || source.citationNumber <= 0) continue
    if (!source.chunkId || !source.provenanceId) continue
    sourceMap.set(source.citationNumber, source)
  }

  const chunkIds = referencedNumbers
    .map((number) => sourceMap.get(number)?.chunkId)
    .filter((value): value is string => Boolean(value))
  const storedChunks = await store.lookupChunks(chunkIds)
  const storedById = new Map(storedChunks.map((hit) => [hit.chunkId, hit]))

  const checks: KnowledgeCitationCheck[] = referencedNumbers.map((citationNumber) => {
    const source = sourceMap.get(citationNumber)
    if (!source) {
      return { citationNumber, status: 'missing_source_mapping' }
    }
    const current = storedById.get(source.chunkId)
    if (!current) {
      return {
        citationNumber,
        status: 'missing_chunk',
        chunkId: source.chunkId,
        provenanceId: source.provenanceId
      }
    }
    if (!current.provenanceId || current.provenanceId !== source.provenanceId) {
      return {
        citationNumber,
        status: 'provenance_mismatch',
        chunkId: source.chunkId,
        provenanceId: source.provenanceId,
        currentProvenanceId: current.provenanceId
      }
    }
    return {
      citationNumber,
      status: 'verified',
      chunkId: source.chunkId,
      provenanceId: source.provenanceId,
      currentProvenanceId: current.provenanceId
    }
  })

  const verifiedCount = checks.filter((check) => check.status === 'verified').length
  return {
    valid: checks.length > 0 && verifiedCount === checks.length,
    citationCount: checks.length,
    verifiedCount,
    checks
  }
}

export function extractNumericCitationNumbers(draft: string): number[] {
  const numbers = new Set<number>()
  for (const match of draft.matchAll(/\[([\d,，\-–—\s]+)\]/g)) {
    const body = match[1]
    for (const token of body.split(/[,，]/).map((value) => value.trim()).filter(Boolean)) {
      const range = /^(\d+)\s*[-–—]\s*(\d+)$/.exec(token)
      if (range) {
        const start = Number(range[1])
        const end = Number(range[2])
        if (!Number.isInteger(start) || !Number.isInteger(end)) continue
        const low = Math.min(start, end)
        const high = Math.max(start, end)
        if (high - low > 100) continue
        for (let current = low; current <= high; current += 1) {
          if (current > 0) numbers.add(current)
        }
        continue
      }
      const value = Number(token)
      if (Number.isInteger(value) && value > 0) numbers.add(value)
    }
  }
  return [...numbers].sort((left, right) => left - right)
}
