#!/usr/bin/env python3
import sys

with open('apps/desktop-legalwork/legalwork/src/loop/agent-loop.ts', 'r') as f:
    content = f.read()

# 1. Plan mode instruction update + resolvePlanModeToolSpecs
old1 = """export const PLAN_MODE_INSTRUCTION = [
  'You are in Plan mode.',
  'Investigate the task first using read-only tools and commands: prefer `read`, `grep`, `find`, `ls`, and safe read-only shell commands appropriate for the host platform via `bash` to gather the facts you need.',
  'Do NOT modify project files, apply edits, or run mutating commands in this mode.',
  'When you understand the task well enough, call the `create_plan` tool to save a complete implementation plan as Markdown.',
  'Use `operation: \\"draft\\"` for the first plan, and `operation: \\"refine\\"` when revising an existing plan; you may call `create_plan` multiple times as the plan evolves.',
  'Write concrete, actionable steps (summary, implementation steps, tests, risks) rather than vague intentions.',
  'After saving, give the user a short summary of the plan and what to review.'
].join('\\n')"""

new1 = """export const PLAN_MODE_INSTRUCTION = [
  'You are in Plan mode.',
  'Investigate the task first using read-only tools: prefer `read`, `grep`, `find`, and `ls` to gather the facts you need.',
  'Do NOT modify project files, apply edits, run shell commands, or run mutating commands in this mode.',
  'When you understand the task well enough, call the `create_plan` tool to save a complete implementation plan as Markdown.',
  'Use `operation: \\"draft\\"` for the first plan, and `operation: \\"refine\\"` when refining an existing plan; you may call `create_plan` multiple times as the plan evolves.',
  'Write concrete, actionable steps (summary, implementation steps, tests, risks) rather than vague intentions.',
  'After saving, give the user a short summary of the plan and what to review.'
].join('\\n')

/** Read-only tools allowed during the investigation phase of a Plan-mode
 * turn (step 0, before `create_plan` has been called). Matches the
 * PLAN_MODE_INSTRUCTION guidance. `bash` is intentionally excluded \u2014
 * it can execute arbitrary commands and its policy is `on-request` which
 * auto-approves under `approvalPolicy: auto`. */
const PLAN_READ_ONLY_TOOL_NAMES = new Set([
  'read',
  'ls',
  'find',
  'grep',
  'web_search',
  'web_fetch'
])

/**
 * Resolve the tool list for a Plan-mode turn step. Extracted as a pure
 * function so the behaviour can be unit-tested without spinning up the
 * full agent loop.
 *
 * - Not plan-active or plan already satisfied \u2192 pass through unchanged.
 * - Step 0 (investigation): read-only tools + create_plan.
 * - Step > 0 (must produce plan): only create_plan.
 */
export function resolvePlanModeToolSpecs(
  toolSpecs: ModelToolSpec[],
  options: {
    planTurnActive: boolean
    createPlanSatisfied: boolean
    stepIndex: number
    readOnlyToolNames?: ReadonlySet<string>
    planToolName?: string
  }
): ModelToolSpec[] {
  if (!options.planTurnActive || options.createPlanSatisfied) return toolSpecs
  const readOnly = options.readOnlyToolNames ?? PLAN_READ_ONLY_TOOL_NAMES
  const planTool = options.planToolName ?? CREATE_PLAN_TOOL_NAME
  return options.stepIndex === 0
    ? toolSpecs.filter((tool) => tool.name === planTool || readOnly.has(tool.name))
    : toolSpecs.filter((tool) => tool.name === planTool)
}"""

if old1 in content:
    content = content.replace(old1, new1, 1)
    print("Insert 1 (plan mode tools) done")
else:
    print("ERROR: insert 1 not found")
    # Try to find a portion of it
    idx = content.find("export const PLAN_MODE_INSTRUCTION")
    if idx >= 0:
        print(f"  Found at offset {idx}")
        print(f"  Next 150 chars: {repr(content[idx:idx+150])}")

# 2. Goal continuation loop detection
old2 = """function goalContinuationInstruction(goal: ThreadGoal | undefined): string | null {
  if (!goal || goal.status !== 'active') return null
  const tokenBudget = goal.tokenBudget == null ? 'none' : String(goal.tokenBudget)
  return [
    `## Active Goal Continuation`,
    `The active goal is: ${goal.objective}`,
    tokenBudget !== 'none' ? `Token budget (soft): ${tokenBudget}` : null,
    '',
    'The active goal continues until the model marks the result with the `update_goal` tool.',
    '- When you are confident the goal has been achieved (all required work is complete), call update_goal with status "complete".',
    '- Only use status "blocked" when the same blocking condition has repeated for at least three consecutive goal turns and meaningful progress is impossible without user input or an external change.',
    '',
    'Preserve the existing goal; do not replace or create a new one unless the user explicitly asks.'
  ].filter(Boolean).join('\\n')
}"""

new2 = """function goalContinuationInstruction(goal: ThreadGoal | undefined, recoveryStep?: number): string | null {
  if (!goal || goal.status !== 'active') return null
  const tokenBudget = goal.tokenBudget == null ? 'none' : String(goal.tokenBudget)
  const lines = [
    `## Active Goal Continuation`,
    `The active goal is: ${goal.objective}`,
    tokenBudget !== 'none' ? `Token budget (soft): ${tokenBudget}` : null,
    '',
    'The active goal continues until the model marks the result with the `update_goal` tool.',
    '- When you are confident the goal has been achieved (all required work is complete), call update_goal with status "complete".',
    '- Only use status "blocked" when the same blocking condition has repeated for at least three consecutive goal turns and meaningful progress is impossible without user input or an external change.',
    '',
    'Preserve the existing goal; do not replace or create a new one unless the user explicitly asks.'
  ]
  if (recoveryStep !== undefined && recoveryStep > 0) {
    lines.push(
      '',
      `- The active goal continuation has produced near-identical no-tool replies ${recoveryStep} time(s).`,
      '- If you cannot make progress with the available tools, clearly explain what is blocking you and suggest what the user should do next.',
      '- Do NOT repeat the same plan or analysis that produced no action in previous turns.'
    )
  }
  return lines.filter(Boolean).join('\\n')
}

const GOAL_NO_TOOL_REPEAT_SIMILARITY = 0.85
const GOAL_NO_TOOL_REPEAT_MIN_LENGTH = 12
const GOAL_NO_TOOL_REPEAT_MAX_RECOVERY_STEPS = 3

/**
 * Goal continuation re-prompts the model whenever it stops without tool
 * calls, which can spin forever on "I will do X next" filler that never
 * acts. Exact-equality checks miss this: the filler usually varies in
 * punctuation, casing, or word order between rounds, so the guard
 * normalizes both texts and falls back to character-bigram similarity.
 */
function isRepeatedNoToolAssistantText(previous: string | undefined, current: string): boolean {
  if (previous === undefined) return false
  const a = normalizeNoToolAssistantText(previous)
  const b = normalizeNoToolAssistantText(current)
  if (a === b) return true
  if (a.length < GOAL_NO_TOOL_REPEAT_MIN_LENGTH || b.length < GOAL_NO_TOOL_REPEAT_MIN_LENGTH) {
    return false
  }
  return charBigramDiceSimilarity(a, b) >= GOAL_NO_TOOL_REPEAT_SIMILARITY
}

function normalizeNoToolAssistantText(text: string): string {
  return text.toLowerCase().replace(/[\\s\\p{P}\\p{S}]+/gu, '')
}

function charBigramDiceSimilarity(a: string, b: string): number {
  const bigramsA = charBigramCounts(a)
  const bigramsB = charBigramCounts(b)
  let shared = 0
  for (const [bigram, countA] of bigramsA) {
    const countB = bigramsB.get(bigram)
    if (countB) shared += Math.min(countA, countB)
  }
  return (2 * shared) / (a.length - 1 + b.length - 1)
}

function charBigramCounts(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (let index = 0; index < text.length - 1; index += 1) {
    const bigram = text.slice(index, index + 2)
    counts.set(bigram, (counts.get(bigram) ?? 0) + 1)
  }
  return counts
}"""

if old2 in content:
    content = content.replace(old2, new2, 1)
    print("Insert 2 (goal loop detection) done")
else:
    print("ERROR: insert 2 not found")
    idx = content.find("function goalContinuationInstruction")
    if idx >= 0:
        print(f"  Found at offset {idx}")
        # Show first 300 chars
        print(f"  Content: {repr(content[idx:idx+300])}")

with open('apps/desktop-legalwork/legalwork/src/loop/agent-loop.ts', 'w') as f:
    f.write(content)
print("agent-loop.ts done")
