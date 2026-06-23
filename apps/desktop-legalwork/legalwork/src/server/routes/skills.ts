import { jsonResponse, type JsonResponse } from '../response.js'
import type { ServerRuntime } from './server-runtime.js'

export async function listSkills(runtime: ServerRuntime): Promise<JsonResponse> {
  const diagnostics = runtime.skills
    ? await runtime.skills()
    : {
        enabled: false,
        roots: [],
        skills: [],
        validationErrors: [],
        lastActivations: []
      }
  return jsonResponse({
    enabled: diagnostics.enabled,
    roots: diagnostics.roots,
    skills: diagnostics.skills,
    validationErrors: diagnostics.validationErrors
  })
}

export async function refreshSkills(runtime: ServerRuntime): Promise<JsonResponse> {
  if (!runtime.refreshSkills) {
    return jsonResponse({ error: 'Skill refresh is not available' }, 503)
  }
  await runtime.refreshSkills()
  return listSkills(runtime)
}

export async function installSkill(runtime: ServerRuntime, request: Request): Promise<JsonResponse> {
  if (!runtime.installSkillRoot) {
    return jsonResponse({ error: 'Skill installation is not available' }, 503)
  }
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }
  const sourcePath = typeof body.source_path === 'string' ? body.source_path.trim() : ''
  if (!sourcePath) {
    return jsonResponse({ error: 'source_path is required' }, 400)
  }
  const overwrite = body.overwrite === true
  await runtime.installSkillRoot(sourcePath, overwrite)
  return listSkills(runtime)
}
