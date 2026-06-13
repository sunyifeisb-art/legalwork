# 法规检索工具接入说明

本技能描述的是法规检索的方法论与质量控制流程，实际的数据库查询通过 **LegalWork 运行时 MCP 服务**完成。

当前已预配置的法规/法条类 MCP 服务：

- `pkulaw-law-keyword` — 北大法宝法规关键词检索
- `pkulaw-law-semantic` — 北大法宝法规语义检索
- `pkulaw-fatiao` — 北大法条精准定位
- `pkulaw-law-recognition` — 北大法宝法条识别与溯源
- `pkulaw-citation-validator` — 北大法宝引用核验
- `pkulaw-semantic-nlsql` — 北大法宝跨库语义检索

配置位置：

- 运行时模板：`apps/desktop-legalwork/legalwork/config.example.json`
- 当前运行配置：`~/.legalwork/legalwork/config.json`
- 接入文档：`apps/desktop-legalwork/legalwork/docs/pkulaw-mcp.md`

启用前需要在运行 LegalWork 的环境中设置 `PKULAW_MCP_TOKEN`，并把对应服务的 `enabled` 改为 `true`。

技能执行时，应将设计好的检索式交给上述 MCP 工具，以其返回的真实法条信息作为报告唯一数据来源，禁止凭记忆生成法条。
