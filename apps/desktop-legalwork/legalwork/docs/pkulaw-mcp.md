# 北大法宝 MCP 接入说明

LegalWork 运行时已通过 MCP 协议接入北大法宝法律数据库。配置位于：

- 模板：`apps/desktop-legalwork/legalwork/config.example.json`
- 当前运行配置：`~/.legalwork/legalwork/config.json`

## 已配置的 MCP 服务

| serverId | 服务 | 端点 |
| --- | --- | --- |
| `pkulaw-law-keyword` | 法规关键词检索 | `https://apim-gw.pkulaw.com/law-keyword/mcp` |
| `pkulaw-law-semantic` | 法规语义检索 | `https://apim-gw.pkulaw.com/law-semantic/mcp` |
| `pkulaw-case-keyword` | 案例关键词检索 | `https://apim-gw.pkulaw.com/case-keyword/mcp` |
| `pkulaw-case-semantic` | 案例语义检索 | `https://apim-gw.pkulaw.com/case-semantic/mcp` |
| `pkulaw-fatiao` | 法条精准定位 | `https://apim-gw.pkulaw.com/fatiao/mcp` |
| `pkulaw-law-recognition` | 法条识别与溯源 | `https://apim-gw.pkulaw.com/law-recognition/mcp` |
| `pkulaw-case-number` | 案号识别与核验 | `https://apim-gw.pkulaw.com/case-number/mcp` |
| `pkulaw-citation-validator` | 引用核验 / 反幻觉 | `https://apim-gw.pkulaw.com/citation-validator/mcp` |
| `pkulaw-doc-link` | 法宝链接增强 | `https://apim-gw.pkulaw.com/doc-link/mcp` |
| `pkulaw-semantic-nlsql` | 跨库语义检索 | `https://apim-gw.pkulaw.com/semantic-nlsql/mcp` |

## 获取 Token

1. 访问 [北大法宝 MCP 平台](https://mcp.pkulaw.com/)。
2. 注册/登录后，在控制台创建应用，获取 `Access Token`。
3. 同一 Token 同时适用于 MCP 与 CLI（`@pkulaw/mcp-cli`）。

## 配置 Token

配置支持环境变量注入，避免把 Token 直接写入配置文件：

```bash
export PKULAW_MCP_TOKEN="你的Token"
```

LegalWork 启动时会自动把 `Authorization` 头中的 `${PKULAW_MCP_TOKEN}` 替换为实际值。

如果习惯直接写 Token，也可以把配置文件里的 `"Bearer ${PKULAW_MCP_TOKEN}"` 替换为 `"Bearer 你的Token"`。

## 启用服务

当前 10 个北大法宝 MCP 服务默认处于 `enabled: false` 状态。启用方式：

1. 设置 `PKULAW_MCP_TOKEN` 环境变量。
2. 编辑 `~/.legalwork/legalwork/config.json`。
3. 把需要使用的服务 `enabled` 改为 `true`。
4. 重启 LegalWork 运行时。

启用全部服务示例：

```json
{
  "capabilities": {
    "mcp": {
      "enabled": true,
      "servers": {
        "pkulaw-law-semantic": {
          "enabled": true,
          "transport": "streamable-http",
          "url": "https://apim-gw.pkulaw.com/law-semantic/mcp",
          "headers": { "Authorization": "Bearer ${PKULAW_MCP_TOKEN}" },
          "trustScope": "user",
          "timeoutMs": 30000
        }
      }
    }
  }
}
```

## 工具发现

当前配置启用了 MCP 搜索模式（`search.enabled: true, mode: auto`）。当工具总数超过 24 个时，运行时会自动把工具集折叠为 `mcp_search` / `mcp_describe` / `mcp_call` / `mcp_refresh_catalog` 四个元工具，减少上下文占用。

如需直接暴露每个北大法宝工具，可把 `capabilities.mcp.search.mode` 改为 `direct`，或提高 `autoThresholdToolCount`。

## 与法律技能的协作

`skills/legal_article_retrieval/SKILL.md`、`skills/case_retrieval/SKILL.md`、`skills/legal_norm_validity_check/SKILL.md` 等检索/核验类技能已经约定：当运行环境中存在法规/案例检索工具时，必须将检索式交给该工具，并以返回的真实结果作为报告唯一数据来源。

接入北大法宝 MCP 后，这些技能即可直接调用法宝数据库，避免 AI 凭空生成法条或案例。

## 验证连接

设置 Token 并启用服务后，启动 LegalWork 并查看运行时能力清单，确认 `mcp.connectedServers` 和 `mcp.toolCount` 不为 0。也可使用 `@pkulaw/mcp-cli` 单独测试：

```bash
npm install -g @pkulaw/mcp-cli
pkulaw-mcp init --authorization "Bearer 你的Token"
pkulaw-mcp check
pkulaw-mcp tools
```

## 安全提示

- 不要把 Token 提交到 Git。
- 运行时的 MCP 诊断日志会自动脱敏 `Authorization` 等敏感头。
- 配置文件中的 `${PKULAW_MCP_TOKEN}` 在未设置环境变量时会保持原样，连接会失败，不会泄露旧 Token。
