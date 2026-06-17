import { readFile } from 'node:fs/promises'
import { basename, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { LocalToolHost, type LocalTool } from './local-tool-host.js'
import { withToolBoundary } from './builtin-tool-utils.js'
import type { DataComplianceTask, DataComplianceTaskService } from '../../services/data-compliance-task-service.js'

const POLL_INTERVAL_MS = 1_000
const MAX_POLL_MS = 120_000

function mimeTypeFromPath(filePath: string): string {
  const ext = extname(filePath).toLowerCase()
  switch (ext) {
    case '.pdf':
      return 'application/pdf'
    case '.docx':
    case '.doc':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case '.txt':
      return 'text/plain'
    case '.md':
      return 'text/markdown'
    default:
      return 'application/octet-stream'
  }
}

function actionLabel(action: string): string {
  return action === 'desensitize' ? '脱敏' : '合规审查'
}

function formatTaskResult(task: DataComplianceTask | null): unknown {
  if (!task) {
    return { error: '任务不存在' }
  }
  const base = {
    task_id: task.id,
    status: task.status,
    document_name: task.document_name,
    product_type: task.product_type,
    review_type: task.review_type,
    progress: task.progress,
    error: task.error
  }
  if (task.status === 'completed') {
    return {
      ...base,
      message:
        task.product_type === 'desensitize'
          ? '脱敏完成。可下载脱敏文件、脱敏报告和主体映射表。'
          : '审查完成。可下载报告、整改包和证据清单。',
      downloadable_file_keys:
        task.product_type === 'desensitize'
          ? ['desensitized_output', 'desensitization_report', 'desensitization_report_md', 'subject_mapping_md', 'subject_mapping_json']
          : ['report', 'report_md', 'remediation', 'evidence', 'code_suggestions']
    }
  }
  if (task.status === 'failed') {
    return { ...base, message: `任务失败: ${task.error || '未知错误'}` }
  }
  return { ...base, message: '任务仍在处理中，可使用 action=poll 查询最新状态。' }
}

async function pollTaskUntilDone(
  service: DataComplianceTaskService,
  taskId: string,
  abortSignal: AbortSignal
): Promise<DataComplianceTask> {
  const start = Date.now()
  while (true) {
    if (abortSignal.aborted) {
      throw new Error('任务轮询被中断')
    }
    const task = await service.getTask(taskId)
    if (!task) {
      throw new Error('任务不存在')
    }
    if (task.status === 'completed' || task.status === 'failed') {
      return task
    }
    if (Date.now() - start > MAX_POLL_MS) {
      return task
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
}

export type DataComplianceLocalToolOptions = {
  service?: DataComplianceTaskService
}

export function createDataComplianceLocalTool(options: DataComplianceLocalToolOptions): LocalTool {
  const service = options.service
  if (!service) {
    return LocalToolHost.defineTool({
      name: 'data_compliance',
      description: 'Data compliance review and desensitization (currently unavailable).',
      inputSchema: { type: 'object', additionalProperties: false },
      policy: 'never',
      toolKind: 'tool_call',
      execute: async () => ({ output: { error: 'data_compliance tool is not configured' }, isError: true })
    })
  }
  return LocalToolHost.defineTool({
    name: 'data_compliance',
    description:
      'Submit a data compliance review or desensitization task. ' +
      'Use action="review" for compliance checks on documents or code. ' +
      'Use action="desensitize" to remove personal/sensitive information. ' +
      'Use action="poll" with task_id to check an existing task. ' +
      'When you detect sensitive personal information in the user message and the user has not explicitly asked for desensitization, ' +
      'call this tool with action="desensitize", auto_confirm=false, and mode="text" to ask the user whether they want to desensitize it.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['review', 'desensitize', 'poll'],
          description: 'review=合规审查, desensitize=脱敏, poll=查询已有任务状态'
        },
        mode: {
          type: 'string',
          enum: ['text', 'file'],
          description: '输入方式：text 直接传文本，file 通过文件路径读取'
        },
        text: {
          type: 'string',
          description: '待审查/脱敏的文本，mode=text 时必填'
        },
        file_path: {
          type: 'string',
          description: '待审查/脱敏的文件绝对路径，mode=file 时必填'
        },
        document_name: {
          type: 'string',
          description: '任务名称，可选'
        },
        review_type: {
          type: 'string',
          enum: ['document', 'code'],
          description: '审查类型，仅 action=review 时有效，默认 document'
        },
        output_dir: {
          type: 'string',
          description: '脱敏输出目录，仅 action=desensitize 且 mode=file 时可选'
        },
        output_format: {
          type: 'string',
          enum: ['md', 'docx', 'txt'],
          description: '脱敏输出格式，仅 action=desensitize 且 mode=file 时可选'
        },
        task_id: {
          type: 'string',
          description: '已有任务编号，仅 action=poll 时必填'
        },
        auto_confirm: {
          type: 'boolean',
          description: '是否跳过用户确认（默认 false）。用户明确要求时仍建议询问确认。'
        }
      },
      required: ['action'],
      additionalProperties: false
    },
    policy: 'auto',
    toolKind: 'tool_call',
    execute: async (args, context) =>
      withToolBoundary(async () => {
        const action = typeof args.action === 'string' ? args.action : ''

        if (action === 'poll') {
          const taskId = String(args.task_id ?? '')
          if (!taskId.trim()) {
            return { output: { error: 'action=poll 时需要提供 task_id' }, isError: true }
          }
          const task = await service.getTask(taskId.trim())
          return { output: formatTaskResult(task) }
        }

        if (action !== 'review' && action !== 'desensitize') {
          return { output: { error: `不支持的 action: ${action}` }, isError: true }
        }

        const mode = typeof args.mode === 'string' ? args.mode : 'text'
        const documentName = typeof args.document_name === 'string' && args.document_name.trim()
          ? args.document_name.trim()
          : `agent-${action}-${new Date().toISOString()}`

        let inputText: string | undefined
        let file: { name: string; type?: string; dataBase64: string } | undefined

        if (mode === 'file') {
          const filePath = typeof args.file_path === 'string' ? args.file_path : ''
          if (!filePath.trim()) {
            return { output: { error: 'mode=file 时需要提供 file_path' }, isError: true }
          }
          try {
            const buffer = await readFile(filePath.trim())
            file = {
              name: basename(filePath.trim()) || 'upload',
              type: mimeTypeFromPath(filePath.trim()),
              dataBase64: buffer.toString('base64')
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            return { output: { error: `读取文件失败: ${message}` }, isError: true }
          }
        } else {
          const text = typeof args.text === 'string' ? args.text : ''
          if (!text.trim()) {
            return { output: { error: 'mode=text 时需要提供非空 text' }, isError: true }
          }
          inputText = text.trim()
        }

        // Ask for user confirmation unless auto_confirm is true.
        const autoConfirm = args.auto_confirm === true
        if (!autoConfirm) {
          if (!context.awaitUserInput) {
            return {
              output: {
                error:
                  '当前环境不支持用户确认。如需直接执行，请设置 auto_confirm=true。'
              },
              isError: true
            }
          }
          const resolution = await context.awaitUserInput({
            id: randomUUID(),
            itemId: randomUUID(),
            prompt: `即将对 "${documentName}" 执行${actionLabel(action)}。是否继续？`,
            questions: [
              {
                header: '确认',
                id: 'confirm',
                question: '请选择操作',
                options: [
                  { label: '执行', description: `开始${actionLabel(action)}` },
                  { label: '取消', description: '取消操作' }
                ]
              }
            ]
          })
          const confirmed =
            resolution.status === 'submitted' &&
            resolution.answers.some((a) => a.id === 'confirm' && a.value === '执行')
          if (!confirmed) {
            return { output: { cancelled: true, message: '用户取消了操作' } }
          }
        }

        const taskInput = {
          mode: action as 'review' | 'desensitize',
          documentName,
          inputText,
          reviewType:
            action === 'review' && args.review_type === 'code' ? ('code' as const) : ('document' as const),
          outputDir:
            action === 'desensitize' && typeof args.output_dir === 'string'
              ? args.output_dir.trim() || undefined
              : undefined,
          outputFormat:
            action === 'desensitize' &&
            (args.output_format === 'md' || args.output_format === 'docx' || args.output_format === 'txt')
              ? (args.output_format as 'md' | 'docx' | 'txt')
              : undefined,
          file
        }

        const { taskId } = await service.createTask(taskInput)
        const task = await pollTaskUntilDone(service, taskId, context.abortSignal)
        const result = formatTaskResult(task)
        return { output: { ...(result as Record<string, unknown>), task_id: taskId } }
      })
  })
}
