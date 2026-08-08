import type { ToolHostContext } from '../ports/tool-host.js'
import { LEGAL_DOCUMENT_FORMATTING_SKILL_ID } from '../adapters/tool/office-fallback-policy.js'
import { DOCUMENT_SKILL_EXECUTE_TOOL_NAME } from '../adapters/tool/builtin-document-skill-tool.js'

const OFFICE_ARTIFACT_EXTENSIONS = /\.(?:docx?|xlsx?|pptx?)\b/i
const OFFICE_ARTIFACT_WORDS = /(?:Word|DOCX|Excel|XLSX|PPT|PPTX|文档|表格|工作簿|演示文稿|幻灯片)/i
const OFFICE_DELIVERY_WORDS = /(?:生成|创建|新建|制作|产出|导出|交付|排版|格式化|套用模板|转成|转换|修改|编辑)/i

export function isOfficeArtifactTurn(input: {
  prompt: string
  filePaths?: readonly string[]
  activeSkillIds?: readonly string[]
}): boolean {
  if (input.activeSkillIds?.includes(LEGAL_DOCUMENT_FORMATTING_SKILL_ID)) return true
  if (input.filePaths?.some((path) => OFFICE_ARTIFACT_EXTENSIONS.test(path))) return true
  const prompt = input.prompt ?? ''
  return OFFICE_ARTIFACT_EXTENSIONS.test(prompt) ||
    (OFFICE_ARTIFACT_WORDS.test(prompt) && OFFICE_DELIVERY_WORDS.test(prompt))
}

/**
 * Office artifact turns must not fall back to shell-level pandoc/python/pip/soffice
 * exploration. Keep normal research/read tools available, but remove bash and
 * always expose the trusted coarse-grained document executor when a skill
 * allowlist is active.
 */
export function officeArtifactAllowedToolNames(
  allowedToolNames: readonly string[] | undefined,
  isOfficeArtifact: boolean
): readonly string[] | undefined {
  if (!isOfficeArtifact) return allowedToolNames
  if (!allowedToolNames) return undefined
  const next = new Set(allowedToolNames)
  next.delete('bash')
  next.add(DOCUMENT_SKILL_EXECUTE_TOOL_NAME)
  return [...next].sort()
}

export function officeArtifactToolBlocked(
  toolName: string,
  context: Pick<ToolHostContext, 'activeSkillIds'> | undefined
): boolean {
  return toolName === 'bash' &&
    Boolean(context?.activeSkillIds?.includes(LEGAL_DOCUMENT_FORMATTING_SKILL_ID))
}

export const OFFICE_ARTIFACT_EXECUTION_INSTRUCTION = [
  '【Office 交付硬规则】当前任务要求生成或修改 Word/Excel/PPT 文件。',
  '不要探测 pandoc、python-docx、openpyxl、python-pptx、pip、soffice 或系统 Python，也不要通过 bash 自己拼 Office 文件。',
  '内容研究完成后，最终 Office 文件必须调用 document_skill_execute 生成/修改；普通成功后直接交付文件。',
  '只有 document_skill_execute 明确返回 fallback_available:true 时，才允许申请 OfficeMCP 兜底。'
].join('\n')
