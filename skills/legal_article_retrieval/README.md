# 法规检索工具接入说明

本技能描述的是法规检索的方法论与质量控制流程，实际的数据库查询通过 **LegalWork 运行时 MCP 服务**完成。

## 默认官方来源

当用户没有明确指定北大法宝、元典 MCP 或其他商业数据库时，法条和法规原文检索默认优先使用**国家法律法规数据库**：

- 官方入口：`https://flk.npc.gov.cn`
- 适用对象：法律、行政法规、地方性法规、自治条例和单行条例、司法解释、部门规章、地方政府规章、法律解释、决定、命令等中国大陆规范性法律文件
- 默认目标：优先检索并引用 `现行有效` 版本；需要历史沿革时再检索 `已修改`、`已废止`、`尚未生效`
- 必须保留字段：法规名称、制定机关、效力层级、公布日期、施行日期、时效性、条文原文、来源链接或详情页

推荐执行顺序：

1. 优先调用 LegalWork 运行时 `knowledge_legal_external_sources`，让系统直接执行国家法律法规数据库结构化检索。
2. 同一查询自动组合标题精确、标题模糊、正文模糊，并按法规唯一 ID 去重。
3. 结果按现行有效、标题精确命中、多策略命中、法源位阶和制定机关权威性排序。
4. 已知法规名称时，先做标题精确检索；无结果或名称不确定时，再做标题模糊检索。
5. 只知道主题关键词时，先做标题模糊检索，再做正文检索。
6. 查询具体法条时，先定位法规详情，再下载官方 DOCX 抽取具体条、款、项；不得凭记忆补写条文。
7. 运行时返回 `条文原文` 时可优先使用，并保留“按条号抽取/按关键词抽取”的来源说明；只返回目录命中时，应继续逐字核验。
8. 批量或跨法规检索时，分页、缓存、失败重试；禁止把第三方 skill 的限速策略作为 LegalWork 默认动作，不主动设置人为限速或等待降速。
9. 如果国家法律法规数据库没有覆盖目标材料，再补充司法部、国务院部门官网、地方人大/政府官网、最高法/最高检官网等官方来源。

国家法律法规数据库常用公开接口形态：

- 搜索列表：`POST https://flk.npc.gov.cn/law-search/search/list`
- 详情信息：`GET https://flk.npc.gov.cn/law-search/search/flfgDetails?bbbs={id}`
- 下载入口：`GET https://flk.npc.gov.cn/law-search/download/pc?format=docx|pdf&bbbs={id}`

时效性字段 `sxx` 常用映射：

| sxx | 含义 |
|-----|------|
| 1 | 已废止 |
| 2 | 已修改 |
| 3 | 现行有效 |
| 4 | 尚未生效 |

> 以上规则参考 `ZongziForu/npc-law-db` 的国家法律法规数据库检索 workflow。LegalWork 不直接依赖该仓库脚本；它将 `flk.npc.gov.cn` 作为未指定商业库时的默认官方检索动作。

## 商业库 MCP

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

技能执行时，如用户指定或运行时已明确选择上述 MCP 工具，应将设计好的检索式交给 MCP 工具，以其返回的真实法条信息作为报告数据来源，禁止凭记忆生成法条。未指定商业库时，按上文默认官方来源执行。
