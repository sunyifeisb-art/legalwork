/**
 * Template Learning Service
 *
 * Uses the LLM to analyze uploaded legal documents and extract
 * reusable template structures (content + field definitions).
 */

import {
  resolveWriteInlineCompletionApiKey,
  resolveWriteInlineCompletionBaseUrl,
  resolveWriteInlineCompletionModel
} from '../../shared/app-settings-write'
import { upstreamOpenAiChatCompletionsUrl } from '../../shared/openai-compat-url'
import type { AppSettingsV1 } from '../../shared/app-settings-types'
import type {
  TemplateLearningRequest,
  TemplateLearningResult,
  UserTemplateField
} from '../../shared/user-templates'

const TIMEOUT_MS = 60_000
const MAX_TOKENS = 4_096

function buildLearningPrompt(request: TemplateLearningRequest): {
  systemPrompt: string
  userPrompt: string
} {
  const systemPrompt = `你是一位资深法律文书分析专家。你的任务是从用户上传的文档中提取出可复用的模板结构。

要求：
1. 仔细分析文档的格式、结构和常见法律文书要素
2. 识别出文档中的变量部分（如当事人姓名、案号、金额、日期等），将它们替换为 {{字段名}} 占位符
3. 生成一个结构清晰、可复用的模板内容（Markdown格式）
4. 为每个占位符字段定义合适的字段信息（标识符、标签、类型）
5. 识别文档类型并给出合适的模板名称和描述

字段类型说明：
- text: 短文本输入（如姓名、案号）
- textarea: 长文本输入（如事实描述、理由）
- date: 日期选择
- select: 选项选择（如法院名称）
- array: 数组/列表（如证据清单）

输出严格按JSON格式，不作额外说明。`

  const userPrompt = `请分析以下文档，提取模板结构。

文件名：${request.fileName}
${request.suggestedName ? `建议模板名称：${request.suggestedName}` : ''}

文档内容：
\`\`\`
${request.fileContent.slice(0, 30_000)}
\`\`\`

请以JSON格式返回，格式为：
{
  "name": "模板名称",
  "description": "简短描述",
  "content": "模板内容（使用 {{字段名}} 作为占位符）",
  "fields": [
    { "id": "fieldId", "label": "字段显示名", "type": "text|textarea|date|select|array", "placeholder": "提示文本", "required": true }
  ],
  "legalBasis": ["法律依据1"]
}`

  return { systemPrompt, userPrompt }
}

export async function learnTemplate(
  settings: AppSettingsV1,
  request: TemplateLearningRequest
): Promise<TemplateLearningResult> {
  const apiKey = resolveWriteInlineCompletionApiKey(settings)
  const baseUrl = resolveWriteInlineCompletionBaseUrl(settings)
  const model = resolveWriteInlineCompletionModel(settings)

  if (!apiKey) {
    return { ok: false, message: '未配置 API Key，请在设置中填写 API 密钥。' }
  }

  const url = upstreamOpenAiChatCompletionsUrl(baseUrl)
  const { systemPrompt, userPrompt } = buildLearningPrompt(request)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
        stream: false
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })

    const text = await response.text()

    if (!response.ok) {
      return {
        ok: false,
        message: `AI 学习请求失败 (${response.status}): ${text.slice(0, 300)}`
      }
    }

    let parsed: { choices?: Array<{ message?: { content?: string } }> }
    try {
      parsed = JSON.parse(text)
    } catch {
      return { ok: false, message: 'AI 返回了非 JSON 数据，请重试。' }
    }

    const content = parsed?.choices?.[0]?.message?.content
    if (!content) {
      return { ok: false, message: 'AI 返回内容为空，请重试。' }
    }

    // Extract JSON from the response (the model might wrap in markdown code blocks)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content

    let parsedResult: {
      name?: string
      description?: string
      content?: string
      fields?: Array<{
        id: string
        label: string
        type: string
        placeholder?: string
        required?: boolean
      }>
      legalBasis?: string[]
    }

    try {
      parsedResult = JSON.parse(jsonStr.trim())
    } catch {
      // If parsing fails, treat the whole content as a simple template
      return {
        ok: true,
        name: request.suggestedName || request.fileName.replace(/\.[^/.]+$/, ''),
        description: `从 ${request.fileName} 学习生成的模板`,
        content: content,
        fields: [
          {
            id: 'content',
            label: '文书内容',
            type: 'textarea',
            placeholder: '请输入文书内容',
            required: true
          }
        ]
      }
    }

    if (!parsedResult.name || !parsedResult.content) {
      return { ok: false, message: 'AI 未能提取有效的模板结构，请尝试上传更规范的文档。' }
    }

    const fields: UserTemplateField[] = (parsedResult.fields || []).map((f) => ({
      id: f.id || `field_${Math.random().toString(36).slice(2, 8)}`,
      label: f.label || f.id || '未命名字段',
      type: validateFieldType(f.type),
      placeholder: f.placeholder,
      required: f.required ?? true
    }))

    return {
      ok: true,
      name: parsedResult.name,
      description: parsedResult.description || `从 ${request.fileName} 学习生成的模板`,
      content: parsedResult.content,
      fields: fields.length > 0 ? fields : [
        {
          id: 'content',
          label: '文书内容',
          type: 'textarea',
          placeholder: '请输入文书内容',
          required: true
        }
      ],
      legalBasis: parsedResult.legalBasis
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, message: `AI 学习失败: ${message}` }
  }
}

function validateFieldType(type: string): UserTemplateField['type'] {
  const validTypes: UserTemplateField['type'][] = ['text', 'textarea', 'date', 'select', 'array']
  return validTypes.includes(type as UserTemplateField['type'])
    ? (type as UserTemplateField['type'])
    : 'text'
}
