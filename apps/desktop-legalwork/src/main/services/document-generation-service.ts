/**
 * Main-process service for AI-powered legal document generation.
 *
 * Uses the same provider credentials as the main agent (or write inline
 * completion overrides) to call the LLM with a well-crafted legal
 * drafting prompt, then returns the generated document content.
 */

import type { AppSettingsV1 } from '../../shared/app-settings-types'
import {
  resolveWriteInlineCompletionApiKey,
  resolveWriteInlineCompletionBaseUrl,
  resolveWriteInlineCompletionModel
} from '../../shared/app-settings-write'
import { upstreamOpenAiChatCompletionsUrl } from '../../shared/openai-compat-url'
import type {
  DocumentGenerationRequest,
  DocumentGenerationResult
} from '../../shared/document-generation'

const DOCUMENT_GENERATION_TIMEOUT_MS = 60_000
const DOCUMENT_GENERATION_MAX_TOKENS = 8_192

type ChatCompletionMessage = {
  role: 'system' | 'user'
  content: string
}

function buildDocumentGenerationPrompt(request: DocumentGenerationRequest): {
  systemPrompt: string
  userPrompt: string
} {
  const fieldDescriptions = request.fields
    .map((f) => {
      const required = f.required ? '（必填）' : ''
      const value = f.value || '（待填写）'
      return `- ${f.label}${required}：${value}`
    })
    .join('\n')

  const legalBasisText =
    request.legalBasis && request.legalBasis.length > 0
      ? `\n法律依据：\n${request.legalBasis.map((b) => `- ${b}`).join('\n')}`
      : ''

  const systemPrompt = `你是一名资深法律文书撰写专家。你的任务是根据用户提供的模板和填写的信息，生成一份格式规范、内容严谨、说理充分的法律文书。

要求：
1. 严格遵循中国法律文书的格式规范和用语习惯
2. 文书结构完整，逻辑清晰，事实陈述准确
3. 法律引用准确，说理充分
4. 按照用户选择的模板类型生成相应的文书内容
5. 使用专业、规范的法律语言
6. 将用户填写的信息自然地融入文书中，不简单罗列
7. 对于用户未填写的可选字段，根据上下文合理推断补充；缺失必填字段时给出合理占位

生成完整的法律文书，包含标题、当事人信息、案由、诉讼请求/申请事项、事实与理由、此致、落款等必要部分。`

  const userPrompt = `请根据以下信息生成一份${request.templateName}。

模板说明：${request.templateDescription}
${legalBasisText}

填写的信息：
${fieldDescriptions}

模板结构参考：
${request.templateContent.slice(0, 2000)}

请生成完整、规范的法律文书。`

  return { systemPrompt, userPrompt }
}

export async function generateDocument(
  settings: AppSettingsV1,
  request: DocumentGenerationRequest
): Promise<DocumentGenerationResult> {
  const startedAt = Date.now()
  const apiKey = resolveWriteInlineCompletionApiKey(settings)
  const baseUrl = resolveWriteInlineCompletionBaseUrl(settings)
  const model = resolveWriteInlineCompletionModel(settings)

  if (!apiKey) {
    return { ok: false, message: '未配置 API Key，请在设置中填写 API 密钥。' }
  }

  const url = upstreamOpenAiChatCompletionsUrl(baseUrl)
  const { systemPrompt, userPrompt } = buildDocumentGenerationPrompt(request)

  const messages: ChatCompletionMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

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
        messages,
        max_tokens: DOCUMENT_GENERATION_MAX_TOKENS,
        temperature: 0.7,
        stream: false
      }),
      signal: AbortSignal.timeout(DOCUMENT_GENERATION_TIMEOUT_MS)
    })

    const text = await response.text()

    if (!response.ok) {
      return {
        ok: false,
        message: `AI 生成请求失败 (${response.status}): ${text.slice(0, 300)}`
      }
    }

    let parsed: { choices?: Array<{ message?: { content?: string } }> }
    try {
      parsed = JSON.parse(text) as { choices?: Array<{ message?: { content?: string } }> }
    } catch {
      return { ok: false, message: 'AI 返回了非 JSON 数据，请重试。' }
    }

    const content = parsed?.choices?.[0]?.message?.content
    if (!content) {
      return { ok: false, message: 'AI 返回内容为空，请重试。' }
    }

    return { ok: true, content, model }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, message: `AI 生成失败: ${message}` }
  }
}
