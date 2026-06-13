import type {
  CoreMemoryRecordJson,
  CoreRuntimeInfoJson,
  CoreRuntimeToolDiagnosticsJson
} from '../agent/legalwork-contract'
import type { AgentProvider } from '../agent/types'
import { describeRuntimeError } from './format-runtime-error'

type DiagnosticsProvider = Pick<AgentProvider, 'getRuntimeInfo' | 'getToolDiagnostics' | 'listMemories'>

export type LoadedLegalworkDiagnostics = {
  runtimeInfo?: CoreRuntimeInfoJson | null
  toolDiagnostics?: CoreRuntimeToolDiagnosticsJson | null
  memoryRecords?: CoreMemoryRecordJson[]
  errors: string[]
}

export async function loadLegalworkDiagnostics(
  provider: DiagnosticsProvider,
  options: { workspace?: string } = {}
): Promise<LoadedLegalworkDiagnostics> {
  const [runtimeInfo, toolDiagnostics, memoryRecords] = await Promise.allSettled([
    provider.getRuntimeInfo ? provider.getRuntimeInfo() : Promise.resolve(null),
    provider.getToolDiagnostics ? provider.getToolDiagnostics() : Promise.resolve(null),
    provider.listMemories
      ? provider.listMemories({ workspace: options.workspace, includeDeleted: false })
      : Promise.resolve([])
  ])

  const loaded: LoadedLegalworkDiagnostics = { errors: [] }

  if (runtimeInfo.status === 'fulfilled') {
    loaded.runtimeInfo = runtimeInfo.value ?? null
  } else {
    loaded.errors.push(`Runtime: ${errorMessage(runtimeInfo.reason)}`)
  }

  if (toolDiagnostics.status === 'fulfilled') {
    loaded.toolDiagnostics = toolDiagnostics.value ?? null
  } else {
    loaded.errors.push(`Tools: ${errorMessage(toolDiagnostics.reason)}`)
  }

  if (memoryRecords.status === 'fulfilled') {
    loaded.memoryRecords = memoryRecords.value ?? []
  } else {
    loaded.errors.push(`Memory: ${errorMessage(memoryRecords.reason)}`)
  }

  loaded.errors = [...new Set(loaded.errors)]
  return loaded
}

function errorMessage(error: unknown): string {
  return describeRuntimeError(error).summary
}
