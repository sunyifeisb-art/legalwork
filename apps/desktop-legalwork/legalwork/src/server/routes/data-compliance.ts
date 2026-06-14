import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { Readable } from 'node:stream'
import { DataComplianceTaskService } from '../../services/data-compliance-task-service.js'
import { jsonResponse } from '../response.js'
import type { JsonResponse } from '../response.js'

export type DataComplianceRouteContext = {
  service: DataComplianceTaskService
}

async function readJsonBody(request: Request): Promise<unknown> {
  const text = await request.text()
  if (!text) return {}
  return JSON.parse(text)
}

async function readMultipartBody(
  request: Request
): Promise<{
  fields: Record<string, string>
  file?: { name: string; type: string; data: Buffer }
}> {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    const json = (await readJsonBody(request)) as Record<string, unknown>
    const fields: Record<string, string> = {}
    for (const [key, value] of Object.entries(json)) {
      if (typeof value === 'string') fields[key] = value
    }
    return { fields }
  }

  const formData = await request.formData()
  const fields: Record<string, string> = {}
  let file: { name: string; type: string; data: Buffer } | undefined

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      file = {
        name: value.name,
        type: value.type || 'application/octet-stream',
        data: Buffer.from(await value.arrayBuffer())
      }
    } else {
      fields[key] = String(value)
    }
  }
  return { fields, file }
}

type JsonCreateTaskBody = {
  mode?: 'review' | 'desensitize'
  documentName?: string
  inputText?: string
  reviewType?: 'document' | 'code'
  outputDir?: string
  file?: { name: string; type?: string; dataBase64: string }
}

function normalizeCreateTaskInput(
  mode: 'review' | 'desensitize',
  body: JsonCreateTaskBody
): Parameters<DataComplianceTaskService['createTask']>[0] {
  return {
    mode,
    documentName: body.documentName,
    inputText: body.inputText,
    reviewType: body.reviewType === 'code' ? 'code' : 'document',
    outputDir: body.outputDir,
    file: body.file
      ? {
          name: body.file.name,
          type: body.file.type,
          dataBase64: body.file.dataBase64
        }
      : undefined
  }
}

export async function createDataComplianceTask(
  service: DataComplianceTaskService,
  request: Request
): Promise<JsonResponse | Response> {
  try {
    const contentType = request.headers.get('content-type') || ''
    let mode: 'review' | 'desensitize'
    let input: Parameters<DataComplianceTaskService['createTask']>[0]

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as JsonCreateTaskBody
      mode = body.mode === 'desensitize' ? 'desensitize' : 'review'
      input = normalizeCreateTaskInput(mode, body)
    } else {
      const { fields, file } = await readMultipartBody(request)
      mode = fields.mode === 'desensitize' ? 'desensitize' : 'review'
      input = {
        mode,
        documentName: fields.document_name,
        inputText: fields.input_text,
        reviewType: fields.review_type === 'code' ? 'code' : 'document',
        outputDir: fields.output_dir,
        file: file
          ? {
              name: file.name,
              type: file.type,
              dataBase64: file.data.toString('base64')
            }
          : undefined
      }
    }

    const result = await service.createTask(input)
    return jsonResponse({ task_id: result.taskId }, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return jsonResponse({ error: message }, 400)
  }
}

export async function listDataComplianceTasks(
  service: DataComplianceTaskService
): Promise<JsonResponse | Response> {
  const tasks = await service.listTasks()
  return jsonResponse({
    items: tasks.map((task) => ({
      id: task.id,
      task_id: task.id,
      document_name: task.document_name,
      status: task.status,
      product_type: task.product_type,
      review_type: task.review_type,
      created_at: task.created_at,
      completed_at: task.completed_at,
      message: task.progress?.message || ''
    }))
  })
}

export async function getDataComplianceTask(
  service: DataComplianceTaskService,
  taskId: string
): Promise<JsonResponse | Response> {
  const task = await service.getTask(taskId)
  if (!task) {
    return jsonResponse({ error: '任务不存在' }, 404)
  }
  return jsonResponse(service.createResultResponse(task))
}

export async function deleteDataComplianceTask(
  service: DataComplianceTaskService,
  taskId: string
): Promise<JsonResponse | Response> {
  const ok = await service.deleteTask(taskId)
  if (!ok) {
    return jsonResponse({ error: '任务不存在或无法删除' }, 404)
  }
  return jsonResponse({ ok: true })
}

export async function getDataComplianceTaskProgress(
  service: DataComplianceTaskService,
  taskId: string
): Promise<JsonResponse | Response> {
  const stream = service.streamProgress(taskId)
  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive'
    }
  })
}

export async function downloadDataComplianceTaskFile(
  service: DataComplianceTaskService,
  taskId: string,
  fileKey: string
): Promise<JsonResponse | Response> {
  const mapping = service.resolveFilePath(taskId, fileKey as Parameters<typeof service.resolveFilePath>[1])
  if (!mapping) {
    return jsonResponse({ error: '文件不存在' }, 404)
  }

  const { createReadStream } = await import('node:fs')
  const { extname } = await import('node:path')
  const nodeStream = createReadStream(mapping.path)
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>
  const ext = extname(mapping.path).toLowerCase()
  const contentType =
    ext === '.json'
      ? 'application/json'
      : ext === '.md'
        ? 'text/markdown'
        : ext === '.txt'
          ? 'text/plain'
          : ext === '.pdf'
            ? 'application/pdf'
            : ext === '.docx'
              ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : 'application/octet-stream'

  const headers = new Headers({
    'content-type': contentType,
    'content-disposition': `attachment; filename="${encodeURIComponent(mapping.filename)}"`
  })

  return new Response(webStream, { headers })
}

export async function checkDataComplianceEnvironment(
  service: DataComplianceTaskService
): Promise<JsonResponse | Response> {
  const check = await service.checkEnvironment()
  if (check.ok) {
    return jsonResponse({ ok: true, python: check.python })
  }
  return jsonResponse({ ok: false, error: check.reason, fix: check.fix }, 503)
}

export async function getDataComplianceInputFile(
  service: DataComplianceTaskService,
  taskId: string
): Promise<JsonResponse | Response> {
  const info = service.getInputFileReadStream(taskId)
  if (!info) {
    return jsonResponse({ error: '文件不存在' }, 404)
  }
  const webStream = Readable.toWeb(info.stream) as ReadableStream<Uint8Array>
  const headers = new Headers({
    'content-type': info.contentType,
    'content-disposition': `inline; filename="${encodeURIComponent(info.filename)}"`
  })
  return new Response(webStream, { headers })
}

export function buildDataComplianceWebRoot(options: { appRoot: string; isPackaged: boolean; cwd?: string }): string {
  const candidates = [
    ...(options.isPackaged
      ? [join(options.appRoot, 'app.asar.unpacked', 'vendor', 'data-compliance-review-codex', 'data-compliance-web')]
      : []),
    join(options.appRoot, 'vendor', 'data-compliance-review-codex', 'data-compliance-web'),
    join(options.appRoot, '..', 'vendor', 'data-compliance-review-codex', 'data-compliance-web'),
    join(options.cwd ?? process.cwd(), 'vendor', 'data-compliance-review-codex', 'data-compliance-web')
  ]
  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'compliance_worker.py'))) {
      return candidate
    }
  }
  return candidates[0]
}

export async function ensureDataComplianceTaskService(input: {
  dataDir: string
  appRoot: string
  isPackaged: boolean
  logDir: string
}): Promise<DataComplianceTaskService> {
  const webRoot = buildDataComplianceWebRoot({ appRoot: input.appRoot, isPackaged: input.isPackaged })
  const tasksDir = join(input.dataDir, 'data-compliance', 'tasks')
  await mkdir(tasksDir, { recursive: true })
  return new DataComplianceTaskService({
    dataDir: input.dataDir,
    webRoot,
    logDir: input.logDir
  })
}
