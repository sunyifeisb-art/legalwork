import { describe, expect, it } from 'vitest'
import type { ChatBlock } from '../../agent/types'
import {
  getProcessAttentionLevel,
  processBlockNeedsAttention,
  summarizeProcessBlocks
} from './message-timeline-process-summary'

const labels: Record<string, string> = {
  processStepCount: '{{count}} steps',
  groupEditedFile: 'Edited 1 file',
  groupEditedFiles: 'Edited {{count}} files',
  groupRanCommand: 'Ran 1 command',
  groupRanCommands: 'Ran {{count}} commands',
  groupUsedTool: 'Used 1 tool',
  groupUsedTools: 'Used {{count}} tools',
  groupApproval: '1 approval',
  groupApprovals: '{{count}} approvals',
  groupInputRequest: '1 input request',
  groupInputRequests: '{{count}} input requests',
  groupError: '1 issue',
  groupErrors: '{{count}} issues',
  groupWarning: '1 warning',
  groupWarnings: '{{count}} warnings',
  processSteps: 'Work process ({{count}} steps)'
}

function t(key: string, opts?: Record<string, unknown>): string {
  const template = labels[key] ?? key
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(opts?.[name] ?? ''))
}

describe('message timeline process summary', () => {
  it('summarizes execution work into a compact result-first label', () => {
    const blocks: ChatBlock[] = [
      {
        kind: 'tool',
        id: 'edit',
        summary: 'edit',
        status: 'success',
        toolKind: 'file_change'
      },
      {
        kind: 'tool',
        id: 'cmd',
        summary: 'npm test',
        status: 'success',
        toolKind: 'command_execution'
      },
      {
        kind: 'tool',
        id: 'search',
        summary: 'grep',
        status: 'success',
        toolKind: 'tool_call'
      }
    ]

    expect(summarizeProcessBlocks(blocks, t)).toBe(
      '3 steps · Edited 1 file · Ran 1 command · Used 1 tool'
    )
  })

  it('marks pending action requests and failures as attention blocks', () => {
    const approval: ChatBlock = {
      kind: 'approval',
      id: 'approval',
      approvalId: 'ap_1',
      summary: 'Allow command',
      status: 'pending'
    }
    const input: ChatBlock = {
      kind: 'user_input',
      id: 'input',
      requestId: 'req_1',
      questions: [],
      status: 'pending'
    }
    const error: ChatBlock = {
      kind: 'tool',
      id: 'error',
      summary: 'failed',
      status: 'error'
    }

    expect(getProcessAttentionLevel(approval)).toBe('action')
    expect(getProcessAttentionLevel(input)).toBe('action')
    expect(getProcessAttentionLevel(error)).toBe('error')
    expect([approval, input, error].every(processBlockNeedsAttention)).toBe(true)
  })

  it('does not force ordinary reasoning or successful tools into the collapsed view', () => {
    const ordinary: ChatBlock[] = [
      { kind: 'reasoning', id: 'think', text: 'private notes' },
      { kind: 'tool', id: 'tool', summary: 'read', status: 'success' }
    ]

    expect(ordinary.some(processBlockNeedsAttention)).toBe(false)
  })
})
