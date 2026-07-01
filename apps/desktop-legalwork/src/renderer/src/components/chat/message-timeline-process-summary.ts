import type { ChatBlock } from '../../agent/types'

export type ProcessAttentionLevel = 'none' | 'action' | 'warning' | 'error'

export function getProcessAttentionLevel(block: ChatBlock): ProcessAttentionLevel {
  if (block.kind === 'tool') return block.status === 'error' ? 'error' : 'none'
  if (block.kind === 'compaction') return block.status === 'error' ? 'error' : 'none'
  if (block.kind === 'approval') {
    if (block.status === 'error' || block.status === 'denied') return 'error'
    return block.status === 'pending' ? 'action' : 'none'
  }
  if (block.kind === 'user_input') {
    if (block.status === 'error') return 'error'
    return block.status === 'pending' ? 'action' : 'none'
  }
  if (block.kind === 'system') {
    if (block.severity === 'error') return 'error'
    if (block.severity === 'warning') return 'warning'
  }
  return 'none'
}

export function processBlockNeedsAttention(block: ChatBlock): boolean {
  return getProcessAttentionLevel(block) !== 'none'
}

export function summarizeProcessBlocks(
  blocks: ChatBlock[],
  t: (key: string, opts?: Record<string, unknown>) => string
): string {
  let fileCount = 0
  let commandCount = 0
  let toolCount = 0
  let approvalCount = 0
  let inputCount = 0
  let errorCount = 0
  let warningCount = 0

  for (const block of blocks) {
    const attention = getProcessAttentionLevel(block)
    if (attention === 'error') errorCount += 1
    if (attention === 'warning') warningCount += 1

    if (block.kind === 'approval') {
      approvalCount += 1
      continue
    }
    if (block.kind === 'user_input') {
      inputCount += 1
      continue
    }
    if (block.kind !== 'tool') continue

    if (block.toolKind === 'file_change') {
      fileCount += 1
    } else if (block.toolKind === 'command_execution') {
      commandCount += 1
    } else {
      toolCount += 1
    }
  }

  const parts: string[] = []
  if (blocks.length > 0) parts.push(t('processStepCount', { count: blocks.length }))
  if (fileCount > 0) {
    parts.push(fileCount === 1 ? t('groupEditedFile') : t('groupEditedFiles', { count: fileCount }))
  }
  if (commandCount > 0) {
    parts.push(commandCount === 1 ? t('groupRanCommand') : t('groupRanCommands', { count: commandCount }))
  }
  if (toolCount > 0) {
    parts.push(toolCount === 1 ? t('groupUsedTool') : t('groupUsedTools', { count: toolCount }))
  }
  if (approvalCount > 0) {
    parts.push(approvalCount === 1 ? t('groupApproval') : t('groupApprovals', { count: approvalCount }))
  }
  if (inputCount > 0) {
    parts.push(inputCount === 1 ? t('groupInputRequest') : t('groupInputRequests', { count: inputCount }))
  }
  if (errorCount > 0) {
    parts.push(errorCount === 1 ? t('groupError') : t('groupErrors', { count: errorCount }))
  }
  if (warningCount > 0) {
    parts.push(warningCount === 1 ? t('groupWarning') : t('groupWarnings', { count: warningCount }))
  }

  return parts.join(' · ') || t('processSteps', { count: blocks.length })
}

export function defaultWorkExpanded(): boolean {
  return false
}
