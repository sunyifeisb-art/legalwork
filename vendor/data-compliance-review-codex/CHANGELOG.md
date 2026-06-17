# 更新日志

格式参考：`YYYY-MM-DD HH:MM CST` — 修改人 — 一句话总结

---

[2026-05-29 22:14] — 你 — 修复原文定位预览并更新发布包

- 结果页“定位原文”改为文件级预览：PDF 以原始 PDF 页面渲染，Word 以文档页样式渲染，不再只展示截断摘录或高亮片段。
- PDF 定位改为按引用段锚定并在对应页面局部连续高亮，避免同类短语在全文其他位置误高亮。
- Word 定位支持在文档正文内自动高亮多个引用片段，保留完整文档上下文。
- 扩展端同步构建最新审查结果页与任务存储逻辑，发布包将同步刷新 GitHub Release 资产。
- **文件改动**：`data-compliance-web/app.py`、`data-compliance-web/templates/result.html`、`data-compliance-web/scripts/preprocess_input.py`、`extension/`、`TEAM_STATUS.md`

[2026-05-09 21:58] — 你 — 封装数律通 macOS 原生应用

- 更新 macOS App 打包脚本：支持直接使用 PNG/JPG/SVG 图标源，并将图标等比居中封装为 macOS 圆角正方形 `.icns`。
- 桌面壳切换为更原生的 full-size content view，隐藏标题文字并使用透明标题栏，避免呈现浏览器面板感。
- App 显示名改为「数律通」，菜单与启动失败提示同步改为中文。
- 打包流程优先复用项目现有 venv 依赖，避免系统 Python 3.9 拉取 `spacy/thinc` 依赖失败。
- 已生成本机 Apple Silicon 版本：`~/Desktop/数律通.app` 与 `~/Desktop/数律通.dmg`。
- **文件改动**：`data-compliance-web/scripts/build_macos_app.sh`、`CHANGELOG.md`

[2026-05-09 21:37] — 你 — 扩充产品首页并加入 GitHub 直达入口

- 首页从单屏封面扩展为可向下滚动的产品介绍页，新增产品优势、覆盖场景、工作流和开源仓库说明区块。
- 首屏和底部开源区均新增 GitHub 按钮，直达 `https://github.com/AiYuSherry/data-compliance-review`。
- 新增响应式、暗色模式和滚动动效，确保首页扩展内容在桌面和移动端都能顺畅浏览。
- **文件改动**：`data-compliance-web/templates/index.html`、`TEAM_STATUS.md`、`CHANGELOG.md`

[2026-05-09 19:50] — 你 — 脱敏结果页重构：系统字体、黑白极简、暗色模式

- 脱敏结果页全面重构：移除 Google Fonts 依赖，改用系统原生字体栈（SF Pro / PingFang SC）；配色从 SaaS 蓝白（`#4f46e5`）改为黑白极简（`#111111`）；新增完整暗色模式支持
- 默认端口从 5566 改为 5577（5566 被其他进程占用）
- 脱敏结果页 `document_name` 以任务中的用户上传文件名为准，不再显示任务 ID 占位
- 删除 `DESENSITIZATION_CONTRACT.md`，接口契约已整合到主文档
- 替换产品 Logo：新增 `data-compliance-web/static/` 目录，改用新品牌标识文件替代原有内联 Logo
- **文件改动**：`data-compliance-web/app.py`、`data-compliance-web/templates/desensitize_result.html`、`data-compliance-web/templates/index.html`、`data-compliance-web/templates/result.html`、`DESENSITIZATION_CONTRACT.md`

[2026-05-04 00:40] — 你 — 收掉工作区里的新建任务按钮，只保留业务入口

- 工作区侧边栏去掉“+新建任务”按钮，进一步压缩成只剩“脱敏 / 审查”两项，避免把入口和编辑动作混在一起。
- 主页继续承担新任务发起入口，工作区只负责进入对应任务类型，边界更清楚。
- **文件改动**：`data-compliance-web/templates/index.html`

[2026-05-04 00:38] — 你 — 把首页文案和结果页导出入口按产品逻辑重排

- 主页改成产品宣传封面，主标题切到“让合规审查和呼吸一样简单。”并补上英文副标题，两个快速开始按钮按“数据脱敏 / 合规审查”顺序展示。
- 工作区侧边栏删除“主页”项，只保留“脱敏 / 审查”，符合用户对任务入口的预期。
- 结果页把“导出”区提前到侧边栏顶部，增强长页面里的下载可达性，同时保留概览/风险/聚类/整改/证据/专项包的锚点导航。
- **文件改动**：`data-compliance-web/templates/index.html`、`data-compliance-web/templates/result.html`

[2026-05-04 00:30] — 你 — 把主页彻底切成无侧边栏入口页

- 主页默认改为全屏封面态，首次进入不再显示侧边栏或工作区外壳，避免把首页做成“带导航的说明页”。
- 主页内容进一步压缩，只保留一个主标题、两个快速开始按钮和一块纯视觉展示，不再塞解释性长句。
- 点击“合规审查 / 数据脱敏”后才切回工作区壳子与侧边栏，首页和任务页的边界更清楚。
- **文件改动**：`data-compliance-web/templates/index.html`

[2026-05-04 00:26] — 你 — 把主页重做成封面式主界面

- 主页从“说明型工作台”改成“封面式主界面”：去掉任务概览、解释卡和多余文案，只保留一个大标题、一块强视觉和两个快速开始入口。
- 视觉上改为更空、更克制的编辑式布局，使用浅色背景、单一重黑强调和大面积留白，让主界面更像真正的入口页。
- 历史任务继续只保留在左侧栏，不再往主页里塞结果和状态信息，避免把当前任务与历史内容混在一起。
- 验证结果：主页结构已收紧，前端代码已同步更新；待浏览器刷新后查看最新效果。
- **文件改动**：`data-compliance-web/templates/index.html`

[2026-05-04 00:11] — 你 — 调整侧边栏工作区逻辑并简化最近任务操作

- 侧边栏工作区统一为“审查 / 脱敏 / 结果”，移除与工作区重复的“工具”分组，并取消“结果样例”外跳入口。
- 首页新增内嵌“结果”工作区，用卡片集中展示最近审查结果、脱敏结果与任务状态；审查或脱敏完成后进入同页结果区，不再自动跳转第二页。
- 最近任务标题栏仅保留小字号“隐藏/显示”；移除“刷新”；单条任务只保留“删”操作。
- 新增 `DELETE /api/history/<task_id>` 接口，删除任务时移除对应本地输出目录并从内存任务表清理。
- 验证结果：`py_compile app.py` 通过；首页 DOM 已呈现“审查 / 脱敏 / 结果”、最近任务“隐藏”与单条“删”；结果工作区切换正常；浏览器 console 无错误。
- **文件改动**：`data-compliance-web/app.py`、`data-compliance-web/templates/index.html`

[2026-05-04 00:18] — 你 — 拆分主界面、当前任务与历史结果边界

- 新增默认“主页”主界面，展示任务概览、快速开始和工作流说明，风格延续左侧工作台的黑白米色卡片体系。
- 根据界面反馈进一步压缩主页文案，移除解释型工作流卡片，只保留任务概览与“合规审查 / 数据脱敏”两个主入口。
- 侧边栏工作区调整为“主页 / 审查 / 脱敏”，移除把历史结果作为主工作区的“结果”入口。
- 最近任务恢复为历史入口：点击进入对应审查/脱敏结果详情页；任务完成后也打开独立结果详情页，避免把当前任务和历史结果混在主页里。
- 验证结果：首页 DOM 仅展示主页、审查、脱敏工作区；主页不再展示历史结果长列表；浏览器 console 无错误。
- **文件改动**：`data-compliance-web/templates/index.html`

[2026-05-03 23:54] — 你 — 备份旧前端并将首页改为侧边栏工作台风格

- 备份当前首页、审查结果页、脱敏结果页到 `backups/frontend-20260503-2347/`。
- 参考本地 `http://127.0.0.1:5555/` 的左侧导航工作台布局，重构首页为固定侧边栏 + 主任务卡片结构。
- 字体同步为乌鸦写作台同款系统字体栈（SF Pro / PingFang SC），移除首页 Google 字体依赖。
- 审查结果页同步改为左侧固定工作台结构，把返回、文档名、结果导航和下载报告归入同一侧栏，避免顶部栏与侧栏并存造成逻辑割裂。
- 保留原有合规审查、代码审查、数据脱敏、历史记录、上传/粘贴、进度弹窗与错误弹窗功能。
- **文件改动**：`data-compliance-web/templates/index.html`、`data-compliance-web/templates/result.html`、`TEAM_STATUS.md`

## 2026-04-29

### 21:56 CST — Codex — 同步数据脱敏处理、OCR、法规库与浏览器扩展更新
- 新增独立「数据脱敏处理」产品线：在首页与合规审查分开，后端新增独立脱敏任务流与结果页，不混入原 `/api/upload` 审查任务。
- 脱敏默认策略从纯类型替换升级为「保留格式打码」：手机号、邮箱、身份证、银行卡、IP、地址等保持可读结构，密钥类仍使用安全标签替换。
- 新增 `DESENSITIZATION_CONTRACT.md`，记录脱敏接口、输入格式、输出文件、报告 JSON/Markdown、下载接口与错误码。
- 新增 OCR 支持：`ocr_text.py` 被接入 Web 端与项目 kit 的输入预处理流程，图片与扫描型 PDF 在本机具备 Tesseract 时可进入识别链路；缺失环境时输出明确错误。
- 新增 `check_desensitization_policy.py`，防止脱敏策略回退到纯 `[PHONE_NUMBER]` 这类占位符。
- 重整并扩充法规库：更新 `regulations-md` 分类，新增国家法律法规、地方规范性文件、境外法规 Markdown、境外法规种子、全文来源与构建脚本。
- 新增浏览器扩展交付形态：同步 `extension/` 源码、测试、构建脚本、dist 产物和法规索引；修复扩展内对项目配置与法规库路径的真实仓库引用。
- 新增 `skills/data-compliance-reviewer/`，将审查工作流、法规参考资料与运行脚本整理为可复用 skill 包。
- 补充 `.gitignore`：排除 `node_modules/`、SQLite wal/shm、pycache、上传输出等本地运行产物，避免推送依赖缓存和临时文件。
- 验证结果：Python 编译通过；脱敏策略回归通过；项目 smoke check 通过；法规搜索可用；扩展 `npm test -- --run` 通过；扩展 `npm run build` 通过；`git diff --check` 通过。
- **文件改动范围**：`data-compliance-web/`、`projects/data-compliance-ai-project-kit/`、`extension/`、`skills/data-compliance-reviewer/`、`README.md`、`DESENSITIZATION_CONTRACT.md`、`DESIGN.md`、`.gitignore`

## 2026-04-13

### 17:21 CST — 你 — 将 DeepSeek API Key 与 .gitignore 纳入仓库，实现开箱即用
- 将 `data-compliance-web/.deepseek_key` 提交到仓库，朋友下载后无需额外配置即可使用 DeepSeek LLM 增强功能。
- 新增项目根目录 `.gitignore`，排除 `output/`、`uploads/`、`venv/`、`__pycache__` 等本地运行文件，保持仓库整洁。
- **安全提示**：当前仓库为小范围使用，API Key 已随代码分发，请勿将仓库公开分享至不可信第三方。

### 17:02 CST — 你 — 优化风险卡片布局、改写示例精度与前端细节
- 风险卡片左右分栏重新调整：左侧放置「原文摘录 + 风险分析」，右侧放置「修改建议 + 改写后条款」，优化法务阅读动线。
- 风险分析区块新增柠檬黄浅色边框（`--yellow-bg: #fefce8` / `--yellow-border: #fde047`），与修改建议、改写后条款形成更清晰的语义区分。
- 前端进度弹窗新增 checkpoint 去重逻辑，解决 LLM 增强阶段「正在生成 AI 优化建议与改写示例，请稍候…」重复堆叠的问题。
- 优化 `enhance_suggestions_with_llm.py` 的 System Prompt：
  - `optimized_suggestion` 明确禁止 Markdown 表格、列表，要求输出连贯叙述文字；
  - `rewritten_clause` 明确要求基于原文证据进行「针对性改写」，生成可直接替换原文的条款，而非通用模板。
- `render_risk_report.py` 与结果页标签统一从「改写示例」改为「改写后条款」，语义更贴近实际用途。
- **文件改动**：`data-compliance-web/templates/result.html`、`data-compliance-web/templates/index.html`、`data-compliance-web/scripts/enhance_suggestions_with_llm.py`、`data-compliance-web/scripts/render_risk_report.py`

### 16:39 CST — 你 — 修复 Flask 重载导致任务状态丢失与 LLM 增强可用性
- 新增任务状态持久化机制：`app.py` 在每次进度更新、任务完成或失败时将 `tasks[task_id]` 写入 `output/<task_id>/task_state.json`。
- 所有查询路由（`/api/progress`、`/result`、`/api/result`、`/api/download`）优先从磁盘恢复任务状态，解决 `debug=True` 热重载后内存字典丢失导致的「自动复核卡住」和「任务不存在」问题。
- LLM 增强步骤增加独立进度提示「正在生成 AI 优化建议与改写示例」，并支持从 `.deepseek_key` 文件读取 API Key；失败时抛出明确错误信息。
- **文件改动**：`data-compliance-web/app.py`、`CHANGELOG.md`

### 14:26 CST — 你 — 前端输出页重构与首页体验优化
- 将结果页 `result.html` 重构为与首页一致的 Plus Jakarta Sans + Inter 设计系统，统一配色与卡片质感。
- 调整风险卡片两栏布局：左侧仅保留原文摘录，右侧放置「风险分析」与「修改建议」，解决修改建议框过度撑大问题。
- 放大审查结论、优先行动、风险分析、修改建议等区块标题字号，提升可读性。
- 删除结果页中的「审查路径」展示块，减少信息噪音。
- 修复证据清单中风险等级标签换行问题。
- 首页 `index.html` 新增上传文件后自动填充文档名称功能。
- 补充 `requirements.txt` 中缺失的 `pypdf` 依赖，修复 PDF 上传预处理报错。
- **文件改动**：`data-compliance-web/templates/result.html`、`data-compliance-web/templates/index.html`、`data-compliance-web/requirements.txt`

### 14:39 CST — 你 — 同步更新 README 与 Web 端说明文档
- 更新根目录 `README.md`：补充 2026-04-13 前端与体验优化说明，包括设计系统统一、风险卡片分栏、字号优化、自动填充、依赖修复等。
- 更新 `data-compliance-web/README.md`：修正使用步骤、输出内容、功能特点、注意事项和技术说明，增加 PDF 支持、自动填充文档名、自定义 CSS 字体体系等描述。
- **文件改动**：`README.md`、`data-compliance-web/README.md`

### 15:02 CST — 你 — 接入 DeepSeek API，生成非模板化优化建议与改写示例
- 新增 `data-compliance-web/scripts/enhance_suggestions_with_llm.py`：在审查流水线中调用 DeepSeek 大模型，对每个风险项生成更自然、贴合上下文的优化建议，并给出可直接参考的「改写示例」条款。
- 直接替换原有 `suggestion` 为模型生成的优化建议，失败或无 API Key 时自动回退到规则模板建议，保证可用性。
- 更新 `finding.schema.json` 与 `report.schema.json`：新增 `rewritten_clause`（改写示例）与 `llm_enhanced`（是否已成功增强）字段。
- 更新 `run_review_pipeline.py`：在 `auto_recheck_report.py` 之后插入 LLM 增强步骤，输出 `07_report_llm_enhanced.json`。
- 更新 `result.html`：右侧风险卡片新增绿色「改写示例」区块；更新 `render_risk_report.py`：Markdown 报告同步输出改写示例。
- 补充 `requirements.txt`：新增 `openai>=1.30.0`（DeepSeek 兼容 OpenAI SDK）。
- **文件改动**：`data-compliance-web/scripts/enhance_suggestions_with_llm.py`、`data-compliance-web/scripts/run_review_pipeline.py`、`data-compliance-web/scripts/render_risk_report.py`、`data-compliance-web/templates/result.html`、`data-compliance-web/requirements.txt`、`projects/data-compliance-ai-project-kit/config/finding.schema.json`、`projects/data-compliance-ai-project-kit/config/report.schema.json`

## 2026-04-11

### 21:10 CST — 向阳 — 修复下载整改清单失败，并继续压缩报告噪音
- 修复 `/dev/result` 场景下点击下载整改清单返回“任务不存在”的问题：将 `dev-mock` 结果注册到运行时任务表，确保下载链路与正式任务一致。
- 上传链继续补齐二进制文档处理：`preprocess_input.py` 与 `classify_document_type.py` 均已支持 PDF / DOCX / DOC，不再把二进制文件当 UTF-8 文本硬读。
- 结果页继续调整为更贴近法务阅读的顺序：弱化“问题位置”展示，优先突出问题内容、风险说明、主法规依据与条款要点，并将补充规范索引与系统判断详情后置。
- 报告下载补齐 Markdown 输出，方便用户直接阅读或转存。
- 新增仓库根 `README.md`，仅保留本轮最新更新内容与当前状态说明。
- **文件改动**：`data-compliance-web/app.py`、`data-compliance-web/scripts/preprocess_input.py`、`data-compliance-web/scripts/classify_document_type.py`、`data-compliance-web/scripts/run_rule_based_review.py`、`data-compliance-web/scripts/aggregate_review_findings.py`、`data-compliance-web/scripts/render_risk_report.py`、`data-compliance-web/scripts/apply_external_norm_mapping.py`、`data-compliance-web/templates/result.html`、`projects/data-compliance-ai-project-kit/scripts/preprocess_input.py`、`projects/data-compliance-ai-project-kit/scripts/classify_document_type.py`、`projects/data-compliance-ai-project-kit/scripts/apply_external_norm_mapping.py`、`projects/data-compliance-ai-project-kit/scripts/enrich_report_with_regulation_db.py`、`README.md`、`CHANGELOG.md`

## 2026-04-09

### 20:24 CST — 向阳 — 调整更新日志策略：旧日志只追加，不覆盖
- 将 `CHANGELOG.md` 设为安全上传中的特殊合并文件：若本地与远端都新增了日志内容，上传时会自动合并双方日志。
- 合并逻辑保留旧日志与历史日期分组，并优先保留本地新增条目，再补入远端新增条目，避免覆盖旧日志。
- 新增测试覆盖 `CHANGELOG.md` 双边更新场景，并更新 `UPSTREAM.md` 说明 `CHANGELOG-MERGE` 状态与日志追加规则。
- **文件改动**：`projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.py`、`projects/data-compliance-ai-project-kit/tests/test_safe_upload_default_upstream.py`、`projects/data-compliance-ai-project-kit/UPSTREAM.md`、`CHANGELOG.md`
### 20:19 CST — 向阳 — 将同步基线改为本地专用，避免团队互相污染状态
- 将安全上传基线状态文件位置从项目目录内改为本地 `.openclaw/data-compliance-review/default-sync-state.json`，不再进入 GitHub 仓库。
- 更新 `UPSTREAM.md`：明确团队成员同步最新代码后即可共用脚本，但各自需先运行一次 `init` 建立本地基线。
- 重新执行真实 `check` 与 `plan`，当前结果均为无冲突，可安全上传。
- **文件改动**：`projects/data-compliance-ai-project-kit/config/default-sync-source.json`、`projects/data-compliance-ai-project-kit/UPSTREAM.md`、`CHANGELOG.md`

### 20:17 CST — 向阳 — 补充团队共用说明，并新增开发前检查命令
- 为安全上传脚本新增 `check` 命令，用于每次开发前检查本地是否已经追上 GitHub 最新版本。
- 明确团队成员也可共用这套脚本；建议每位成员先执行一次 `init` 建立自己的本地基线状态。
- 更新 `UPSTREAM.md`：补充“团队是否可共用”“开发前检查”“状态解释”等说明。
- 当前真实检查结果为 `AHEAD-LOCAL`：本地存在未上传更新，但未落后于 GitHub 远端。
- **文件改动**：`projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.py`、`projects/data-compliance-ai-project-kit/tests/test_safe_upload_default_upstream.py`、`projects/data-compliance-ai-project-kit/UPSTREAM.md`、`CHANGELOG.md`

### 20:14 CST — 向阳 — 新增安全上传工作流，避免覆盖远端新内容
- 新增 `safe_upload_default_upstream.py` 与 `safe_upload_default_upstream.sh`，用于上传前执行“三方比较”：只自动上传本地单边变更、自动回补远端单边变更、遇到双方同改同一文件时停止。
- 将 `.gitignore`、`CHANGELOG.md` 纳入数据合规项目默认同步范围，并新增 `default-sync-state.json` 作为上传基线状态文件。
- 补充 `UPSTREAM.md` 使用说明，并新增 `test_safe_upload_default_upstream.py` 覆盖核心判定逻辑。
- 已初始化当前基线状态，当前 `plan` 结果显示无冲突，可安全识别本地待上传文件。
- **文件改动**：`projects/data-compliance-ai-project-kit/config/default-sync-source.json`、`projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.py`、`projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.sh`、`projects/data-compliance-ai-project-kit/tests/test_safe_upload_default_upstream.py`、`projects/data-compliance-ai-project-kit/UPSTREAM.md`、`projects/data-compliance-ai-project-kit/config/default-sync-state.json`、`CHANGELOG.md`

### 20:01 CST — 向阳 — 同步远端最新内容并补齐日志规则
- 将远端最新 `CHANGELOG.md` 与 `data-compliance-web/templates/result.html` 同步到本地 workspace。
- 合并更新根目录 `.gitignore`：保留本地 workspace 既有忽略规则，同时补入数据合规仓库所需忽略项。
- 明确后续更新日志书写口径：每次改动都写入 `CHANGELOG.md`，标注**修改人**与**具体更新时间（精确到小时分钟，CST）**。
- **文件改动**：`.gitignore`、`CHANGELOG.md`、`data-compliance-web/templates/result.html`

### 前端改为蓝白 SaaS 风格（你）
- 将 `index.html` 与 `result.html` 整体色调改回蓝白 SaaS 风格（Inter + Noto Sans SC、primary-500 `#3b66f5`）
- 保留优化后的结果页结构：Executive Summary、Sticky 侧边导航、风险详情卡片左右分栏、法规/证据折叠
- **文件改动**：`data-compliance-web/templates/index.html`、`data-compliance-web/templates/result.html`

### 前端样式回滚 + 功能保留（你）
- 将 SaaS 蓝白风格回滚为 original editorial 风格（衬线体、金棕装饰线、灰褐主色）
- 保留并优化了全部功能模块展示：风险聚类、整改任务、证据清单、专项审查包
- 中风险/P2/自动复核 统一从金黄色替换为深灰褐（`#635a4d`），解决视觉疲劳问题
- **文件改动**：`data-compliance-web/templates/index.html`、`data-compliance-web/templates/result.html`

### GitHub 仓库初始化 + 协作文档
- 初始化 Git 仓库，推送到 `https://github.com/AiYuSherry/data-compliance-review`
- 新增 `.gitignore`、`API_CONTRACT.md`、`TEAM_STATUS.md`、`CHANGELOG.md`

### Bug 修复
- 修复 `app.py` 因 `selected_paths` 后端输出为 `dict` 列表导致的 `TypeError: unhashable type: 'dict'`
- 新增 `/dev/result` mock 路由，方便前端独立开发

---

> 提示：你的朋友可以在 GitHub 仓库页面点右上角 **Watch → All activity**，这样每次 push 都会收到邮件通知，实现自动同步。
