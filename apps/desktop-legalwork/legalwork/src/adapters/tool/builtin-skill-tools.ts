import { existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import { LocalToolHost, type LocalTool } from './local-tool-host.js'
import { withToolBoundary } from './builtin-tool-utils.js'
import type { SkillRuntime } from '../../skills/skill-runtime.js'

export type SkillToolsOptions = {
  skillRuntime?: SkillRuntime
}

async function isSkillDirectory(path: string): Promise<boolean> {
  try {
    const s = await stat(path)
    if (!s.isDirectory()) return false
    return existsSync(join(path, 'SKILL.md')) || existsSync(join(path, 'skill.json'))
  } catch {
    return false
  }
}

export function createRefreshSkillsTool(options: SkillToolsOptions = {}): LocalTool {
  return LocalToolHost.defineTool({
    name: 'refresh_skills',
    description:
      'Rescan all configured skill roots and refresh the available skills list. Use after installing or modifying skills manually.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
    policy: 'auto',
    execute: async (_args, _context) =>
      withToolBoundary(async () => {
        if (!options.skillRuntime) {
          return { output: { error: 'Skill runtime is not available' }, isError: true }
        }
        await options.skillRuntime.refresh()
        const diagnostics = options.skillRuntime.diagnostics()
        return {
          output: {
            refreshed: true,
            enabled: diagnostics.enabled,
            roots: diagnostics.roots,
            discoveredSkills: diagnostics.skills.length,
            skillNames: diagnostics.skills.map((skill) => skill.name),
            validationErrors: diagnostics.validationErrors
          }
        }
      })
  })
}

export function createSearchSkillsTool(options: SkillToolsOptions = {}): LocalTool {
  return LocalToolHost.defineTool({
    name: 'search_skills',
    description:
      'Search available LegalWork skills by task description before choosing a workflow. Returns concise candidates only; use load_skill to read one selected skill.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Short description of the current legal or office task.'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of candidate skills to return. Defaults to 20, maximum 100.'
        }
      },
      additionalProperties: false
    },
    policy: 'auto',
    execute: async (args, _context) =>
      withToolBoundary(async () => {
        if (!options.skillRuntime) {
          return { output: { error: 'Skill runtime is not available' }, isError: true }
        }
        const query = typeof args.query === 'string' ? args.query : ''
        const limit = typeof args.limit === 'number' ? args.limit : undefined
        const diagnostics = options.skillRuntime.diagnostics()
        return {
          output: {
            enabled: diagnostics.enabled,
            discoveredSkills: diagnostics.skills.length,
            matches: options.skillRuntime.search({ query, limit }).map((skill) => ({
              id: skill.id,
              name: skill.name,
              ...(skill.description ? { description: skill.description } : {}),
              legacy: skill.legacy,
              score: skill.score,
              reason: skill.reason,
              triggers: skill.triggers
            })),
            validationErrors: diagnostics.validationErrors
          }
        }
      })
  })
}

export function createLoadSkillTool(options: SkillToolsOptions = {}): LocalTool {
  return LocalToolHost.defineTool({
    name: 'load_skill',
    description:
      'Load the full instructions for exactly one selected LegalWork skill. Use after search_skills or when the user explicitly names a skill.',
    inputSchema: {
      type: 'object',
      properties: {
        skill_id: {
          type: 'string',
          description: 'Exact skill id returned by search_skills.'
        }
      },
      required: ['skill_id'],
      additionalProperties: false
    },
    policy: 'auto',
    execute: async (args, _context) =>
      withToolBoundary(async () => {
        if (!options.skillRuntime) {
          return { output: { error: 'Skill runtime is not available' }, isError: true }
        }
        const skillId = typeof args.skill_id === 'string' ? args.skill_id.trim() : ''
        if (!skillId) {
          return { output: { error: 'skill_id is required' }, isError: true }
        }
        const skill = options.skillRuntime.load(skillId)
        if (!skill) {
          return { output: { error: `Skill not found: ${skillId}` }, isError: true }
        }
        return {
          output: {
            id: skill.id,
            name: skill.name,
            ...(skill.description ? { description: skill.description } : {}),
            legacy: skill.legacy,
            allowedTools: skill.allowedTools,
            instructions: skill.instructions
          }
        }
      })
  })
}

export function createInstallSkillTool(options: SkillToolsOptions = {}): LocalTool {
  return LocalToolHost.defineTool({
    name: 'install_skill',
    description:
      'Install a skill from a local directory into the LegalWork user skills folder (~/.legalwork/skills) and make it available immediately. The source directory must contain a SKILL.md or skill.json file.',
    inputSchema: {
      type: 'object',
      properties: {
        source_path: {
          type: 'string',
          description:
            'Absolute path to a directory containing a skill package (with SKILL.md or skill.json).'
        },
        overwrite: {
          type: 'boolean',
          description: 'If true, overwrite an existing skill with the same name.'
        }
      },
      required: ['source_path'],
      additionalProperties: false
    },
    policy: 'on-request',
    execute: async (args, _context) =>
      withToolBoundary(async () => {
        if (!options.skillRuntime) {
          return { output: { error: 'Skill runtime is not available' }, isError: true }
        }

        const rawPath = typeof args.source_path === 'string' ? args.source_path.trim() : ''
        if (!rawPath) {
          return { output: { error: 'source_path is required' }, isError: true }
        }
        const sourcePath = resolve(rawPath)
        if (!(await isSkillDirectory(sourcePath))) {
          return {
            output: { error: `Source path is not a valid skill directory: ${sourcePath}` },
            isError: true
          }
        }

        const result = await options.skillRuntime.installFromPath(
          sourcePath,
          args.overwrite === true
        )
        const diagnostics = options.skillRuntime.diagnostics()
        return {
          output: {
            installed: true,
            skillName: result.skillName,
            sourcePath: result.sourcePath,
            targetPath: result.targetPath,
            userSkillRoot: result.userSkillRoot,
            discoveredSkills: diagnostics.skills.length,
            roots: diagnostics.roots
          }
        }
      })
  })
}
