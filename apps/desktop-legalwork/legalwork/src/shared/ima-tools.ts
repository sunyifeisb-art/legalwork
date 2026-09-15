/**
 * IMA 知识库 MCP server 的稳定标识。
 *
 * IMA 工具不参与 web-first 收窄、MCP 工具搜索折叠和技能白名单收窄：只要 IMA
 * server 连上，它的工具就必须出现在 Agent 的工具清单里，模型才能随时自主调用。
 * 否则模型会看到"用 research_ima"的指令却找不到对应工具，转而用 bash/curl 去
 * 探测本地端口自证，既浪费回合也拿不到知识库内容。
 */
export const IMA_KNOWLEDGE_BASE_SERVER_ID = 'ima-knowledge-base'

/** IMA 工具在工具清单里的名称前缀，形如 `mcp_<server>_<tool>`。 */
export const IMA_KNOWLEDGE_BASE_TOOL_PREFIX = 'mcp_ima_knowledge_base_'

export function isImaKnowledgeBaseTool(toolName: string): boolean {
  return toolName.startsWith(IMA_KNOWLEDGE_BASE_TOOL_PREFIX)
}

/** MCP 直连 provider 的 id 形如 `mcp:<serverId>`。 */
export function isImaKnowledgeBaseProvider(providerId: string): boolean {
  return providerId === `mcp:${IMA_KNOWLEDGE_BASE_SERVER_ID}`
}
