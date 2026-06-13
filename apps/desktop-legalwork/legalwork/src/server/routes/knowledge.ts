import { z } from 'zod'
import type { KnowledgeStore } from '../../knowledge/knowledge-store.js'
import { KnowledgeCreateFolderRequest, KnowledgeFileContent, KnowledgeMoveRequest, KnowledgeSyncRequest } from '../../contracts/knowledge.js'
import { jsonResponse, type JsonResponse } from '../response.js'
import { readJsonBody } from '../read-json-body.js'
import { ERRORS } from './runtime-error.js'

const KnowledgeSearchQuery = z.object({
  q: z.string().trim().min(1),
  top_k: z.coerce.number().int().positive().max(20).default(8),
  include_content: z.coerce.boolean().default(false)
}).strict()

export async function syncKnowledge(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const body = await readJsonBody(request)
  if (!body.ok) return body.response
  const parsed = KnowledgeSyncRequest.safeParse(body.value)
  if (!parsed.success) return ERRORS.validation('invalid knowledge sync body', parsed.error.issues)
  return jsonResponse(await store.sync(parsed.data))
}

export async function searchKnowledge(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const url = new URL(request.url)
  const parsed = KnowledgeSearchQuery.safeParse({
    q: url.searchParams.get('q') ?? '',
    top_k: url.searchParams.get('top_k') ?? undefined,
    include_content: url.searchParams.get('include_content') ?? undefined
  })
  if (!parsed.success) return ERRORS.validation('invalid knowledge search query', parsed.error.issues)
  const hits = await store.search({
    query: parsed.data.q,
    limit: parsed.data.top_k,
    includeContent: parsed.data.include_content
  })
  return jsonResponse({ query: parsed.data.q, hits })
}

export async function agentKnowledgeSources(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const url = new URL(request.url)
  const parsed = KnowledgeSearchQuery.safeParse({
    q: url.searchParams.get('q') ?? '',
    top_k: url.searchParams.get('top_k') ?? 6,
    include_content: 'true'
  })
  if (!parsed.success) return ERRORS.validation('invalid knowledge source query', parsed.error.issues)
  const sources = await store.search({
    query: parsed.data.q,
    limit: parsed.data.top_k,
    includeContent: true
  })
  return jsonResponse({ query: parsed.data.q, sources })
}

export async function knowledgeDiagnostics(store: KnowledgeStore | undefined): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  return jsonResponse({ knowledge: await store.diagnostics() })
}

/** GET /v1/knowledge/tree — list managed file/folder tree */
export async function knowledgeTree(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const url = new URL(request.url)
  const prefix = url.searchParams.get('prefix') ?? undefined
  return jsonResponse({ nodes: await store.tree(prefix) })
}

/** POST /v1/knowledge/folder — create a folder */
export async function knowledgeCreateFolder(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const body = await readJsonBody(request)
  if (!body.ok) return body.response
  const parsed = KnowledgeCreateFolderRequest.safeParse(body.value)
  if (!parsed.success) return ERRORS.validation('invalid create folder request', parsed.error.issues)
  return jsonResponse(await store.createFolder(parsed.data))
}

/** POST /v1/knowledge/file — upload / write a file */
export async function knowledgeWriteFile(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const body = await readJsonBody(request)
  if (!body.ok) return body.response
  const parsed = KnowledgeFileContent.safeParse(body.value)
  if (!parsed.success) return ERRORS.validation('invalid file write request', parsed.error.issues)
  return jsonResponse(await store.writeFile(parsed.data))
}

/** GET /v1/knowledge/file/absolute-path — resolve absolute path for opening with system app */
export async function knowledgeAbsolutePath(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const url = new URL(request.url)
  const path = url.searchParams.get('path')
  if (!path) return ERRORS.validation('path query parameter is required')
  const result = await store.absolutePath(path)
  return jsonResponse({ path: result.path, absolute: result.absolute })
}

/** GET /v1/knowledge/file — read file content */
export async function knowledgeReadFile(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const url = new URL(request.url)
  const path = url.searchParams.get('path')
  if (!path) return ERRORS.validation('path query parameter is required')
  const encoding = url.searchParams.get('encoding') === 'base64' ? 'base64' : 'utf8'
  return jsonResponse(await store.readFile(path, encoding))
}

/** POST /v1/knowledge/move — move / rename a file or folder */
export async function knowledgeMove(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const body = await readJsonBody(request)
  if (!body.ok) return body.response
  const parsed = KnowledgeMoveRequest.safeParse(body.value)
  if (!parsed.success) return ERRORS.validation('invalid move request', parsed.error.issues)
  return jsonResponse(await store.move(parsed.data))
}

/** DELETE /v1/knowledge/file — delete a file or folder */
export async function knowledgeDelete(store: KnowledgeStore | undefined, request: Request): Promise<JsonResponse> {
  if (!store) return ERRORS.unavailable('knowledge store is unavailable')
  const url = new URL(request.url)
  const path = url.searchParams.get('path')
  if (!path) return ERRORS.validation('path query parameter is required')
  return jsonResponse(await store.delete(path))
}
