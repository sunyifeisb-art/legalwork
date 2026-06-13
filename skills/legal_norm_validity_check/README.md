# 法律规范效力检查工具接入说明

本技能描述的是法律规范效力核验的方法论，具体法条的时效、层级、冲突校验需要依赖 **LegalWork 运行时 MCP 服务**返回的真实数据。

当前已预配置的相关 MCP 服务：

- `pkulaw-law-keyword` / `pkulaw-law-semantic` — 检索法条原文与效力信息
- `pkulaw-fatiao` — 精准定位法条
- `pkulaw-law-recognition` — 法条识别与溯源
- `pkulaw-citation-validator` — 引用核验 / 反幻觉
- `pkulaw-semantic-nlsql` — 跨库语义检索

配置位置：

- 运行时模板：`apps/desktop-legalwork/legalwork/config.example.json`
- 当前运行配置：`~/.legalwork/legalwork/config.json`
- 接入文档：`apps/desktop-legalwork/legalwork/docs/pkulaw-mcp.md`

启用前需要在运行 LegalWork 的环境中设置 `PKULAW_MCP_TOKEN`，并把对应服务的 `enabled` 改为 `true`。

执行效力检查时，应将待核验的法条标识交给上述 MCP 工具，以其返回的现行有效状态、修订沿革、效力层级作为判定依据。
