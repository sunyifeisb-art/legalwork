import type { AgentProvider } from './types'
import { LegalworkRuntimeProvider } from './legalwork-runtime'

let cachedProvider: AgentProvider | null = null

export function getProvider(): AgentProvider {
  if (cachedProvider) return cachedProvider
  cachedProvider = new LegalworkRuntimeProvider()
  return cachedProvider
}

export function resetProviderCacheForTests(): void {
  cachedProvider = null
}
