import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import type { ToolHostContext } from '../../ports/tool-host.js'
import type {
  DataComplianceCreateTaskInput,
  DataComplianceTask,
  DataComplianceTaskService
} from '../../services/data-compliance-task-service.js'
import { createDataComplianceLocalTool } from './builtin-data-compliance-tool.js'

const cleanup: string[] = []

afterEach(async () => {
  await Promise.all(cleanup.splice(0).map((path) => rm(path, { recursive: true, force: true })))
})

function context(workspace: string): ToolHostContext {
  return {
    threadId: 'thread-1',
    turnId: 'turn-1',
    workspace,
    approvalPolicy: 'auto',
    abortSignal: new AbortController().signal,
    awaitApproval: async () => 'allow'
  }
}

describe('createDataComplianceLocalTool', () => {
  it('resolves relative input and output paths against the active workspace', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'legalwork-data-compliance-tool-'))
    cleanup.push(workspace)
    const sourcePath = join(workspace, 'materials', 'case.txt')
    await mkdir(join(workspace, 'materials'))
    await writeFile(sourcePath, '张三与某公司合同纠纷', { encoding: 'utf8', flag: 'wx' })

    const created: DataComplianceCreateTaskInput[] = []
    const completedTask: DataComplianceTask = {
      id: 'task-1',
      document_name: 'case-redacted',
      product_type: 'desensitize',
      input_type: 'file',
      input_path: sourcePath,
      output_dir: join(workspace, 'artifacts'),
      status: 'completed',
      created_at: '2026-09-15T00:00:00.000Z',
      result: { desensitized_output: '/internal/case-redacted.txt' }
    }
    const service = {
      createTask: async (input: DataComplianceCreateTaskInput) => {
        created.push(input)
        return { taskId: completedTask.id }
      },
      getTask: async () => completedTask
    } as unknown as DataComplianceTaskService

    const result = await createDataComplianceLocalTool({ service }).execute({
      action: 'desensitize',
      mode: 'file',
      file_path: 'materials/case.txt',
      output_dir: 'artifacts',
      output_format: 'txt',
      document_name: 'case-redacted'
    }, context(workspace))

    expect(result.isError).not.toBe(true)
    expect(created).toHaveLength(1)
    expect(created[0]?.file).toMatchObject({
      name: 'case.txt',
      type: 'text/plain',
      dataBase64: Buffer.from('张三与某公司合同纠纷').toString('base64')
    })
    expect(created[0]?.outputDir).toBe(join(workspace, 'artifacts'))
  })
})
