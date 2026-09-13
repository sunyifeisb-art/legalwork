import { DEFAULT_LEGALWORK_MODEL } from '@shared/app-settings'

/** Resolve the concrete model used by feature-owned Agent threads. */
export function resolveAgentTaskModel(
  composerModel: string | undefined,
  runtimeModel?: string
): string {
  const selected = composerModel?.trim() ?? ''
  if (selected && selected !== 'auto') return selected

  const runtimeSelected = runtimeModel?.trim() ?? ''
  if (runtimeSelected && runtimeSelected !== 'auto') return runtimeSelected

  return DEFAULT_LEGALWORK_MODEL
}
