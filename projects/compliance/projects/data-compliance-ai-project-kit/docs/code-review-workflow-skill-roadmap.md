# 代码审核与工作流 skill 扩展路线

## 定位

在现有“文件/文本数据合规审查”能力之外，新增“项目代码交付物合规审查”能力：法务或合规同学可以直接接收技术部门交付的代码目录、压缩包或变更 diff，识别代码实现层面的个人信息处理、第三方 SDK、跨境传输、日志留存、权限与同意机制风险，并输出可交给研发整改的代码层建议。

该能力仍定位为辅助合规效率工具，不替代最终法律判断。输出必须保留法规依据、代码证据、文件位置、风险等级和整改任务。

## 推荐产品形态

1. Web 端：支持上传代码压缩包或粘贴关键文件，输出法务报告与技术整改单。
2. 浏览器插件：继续服务网页/PDF/政策文本审查，不作为代码目录审查主入口。
3. 工作流 skill：新增面向 Codex/OpenClaw 的代码合规审查 skill，可在本地项目目录直接运行，读取代码、生成报告和整改任务。

## 输入范围

第一版先支持：
- 前端项目：JavaScript、TypeScript、React/Vue 常见代码。
- 后端项目：Python、Node.js 常见接口与配置。
- 配置文件：`.env.example`、`package.json`、SDK 配置、埋点配置、网络请求配置。
- 输入形式：本地目录、zip 包、git diff、指定文件清单。

第一版暂不做：
- 全语言深度静态分析。
- 二进制反编译。
- 完整污点分析。
- 自动替开发者改代码并提交。

## 审查路径

建议新增代码专用审查路径：

- `code_personal_info_collection_check`：识别手机号、身份证号、位置、设备标识、生物识别等个人信息收集点。
- `code_third_party_sdk_check`：识别第三方 SDK、埋点、广告、统计、推送、地图、支付等集成。
- `code_cross_border_endpoint_check`：识别境外域名、跨境接口、外部云服务 endpoint。
- `code_consent_gate_check`：检查敏感权限、SDK 初始化、个性化推荐等是否存在同意/拒绝前置逻辑。
- `code_logging_storage_check`：检查日志、缓存、本地存储、数据库字段中是否记录敏感个人信息。
- `code_retention_delete_check`：检查注销、删除、更正、撤回同意等接口或流程支撑。

## 输出字段

在现有报告 item 基础上，代码审查项建议补充：

- `source_kind`: `code`
- `file_path`: 命中文件路径
- `line_start` / `line_end`: 命中代码行
- `code_symbol`: 函数、接口、组件、变量或配置键
- `data_category`: 个人信息类别
- `processing_activity`: 收集、存储、共享、出境、删除、日志记录等处理活动
- `technical_owner_hint`: 建议整改责任方，如前端、后端、客户端、数据平台
- `code_evidence`: 代码片段或结构化证据
- `remediation_pattern`: 推荐整改模式，如延迟 SDK 初始化、增加同意校验、脱敏日志、补充删除接口

## 技术接入点

沿用当前文件型流水线，不改成任务数据库：

1. 新增 `preprocess_codebase.py`：遍历目录、识别语言、抽取文件摘要、函数/接口/依赖/endpoint/权限/SDK 信号。
2. 扩展 `document-types.json`：新增 `source_code_project` 或 `code_delivery` 类型。
3. 扩展 `review-paths.json` 与 `review-checkpoints.json`：加入代码审查路径与检查点。
4. 新增 `run_code_rule_based_review.py`：先用规则和轻量 AST/正则信号生成发现项。
5. 新增 `build_code_remediation_pack.py`：把法务风险转成研发可执行整改单。
6. 更新 `API_CONTRACT.md` 与 Web mock：新增代码审查输出字段和样例。
7. 新增工作流 skill：封装本地目录读取、忽略规则、流水线执行、报告导出。

## 工作流 skill 形态

建议新建独立 skill，而不是把它混进当前项目管理 skill：

- skill 名称：`data-compliance-code-review`
- 输入：项目目录、代码压缩包、git diff 或指定文件列表
- 默认忽略：`node_modules`、`.git`、`dist`、`build`、缓存文件、二进制文件
- 执行：调用项目内代码审查流水线
- 输出：
  - `code-compliance-report.json`
  - `code-remediation-tasks.json`
  - `code-review-summary.md`
  - 可选 HTML 报告

## 第一版验收

第一版只需证明一个窄闭环可行：

1. 给一个小型前端/后端项目目录。
2. 能识别至少 3 类代码证据：个人信息字段、第三方 SDK、外部 endpoint。
3. 每个发现项都有文件路径、代码证据、法规/规范依据和整改建议。
4. 能生成法务可读报告和研发可执行任务。
5. 不上传源码到外部服务，默认本地分析。
