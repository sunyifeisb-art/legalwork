# LegalWork — Claude Code 项目指南

> 本文件是 `LegalWork` 仓库的 **项目级** Claude Code 行为指南。
> 用户全局最高行为准则仍由 `~/.claude/CLAUDE.md` 规定，本文件在其框架下补充项目专属约定。

---

## 1. 项目身份与范围

**LegalWork** 是一个面向法律专业人士与文档密集型工作流的本地桌面 AI 工作台。

本仓库是 **monorepo 形态**，但当前活跃的开发主体非常明确：

| 目录 | 说明 | 是否当前主力 |
|------|------|--------------|
| `apps/desktop-legalwork/` | Electron + React + TypeScript 桌面应用，封装 Legalwork 本地运行时 | ✅ 当前主战场 |
| `apps/desktop-legalwork/legalwork/` | 本地 HTTP/SSE Agent 运行时（TypeScript 包，六边形架构） | ✅ 当前主战场 |
| `document/` / `redaction/` / `ocr_agent.py` / `redact_agent.py` | Python 侧 OCR、脱敏、文档处理流水线 | 维护/按需迭代 |
| `skills/` | 法律任务相关技能包 | 维护/按需迭代 |
| `projects/compliance/` | 独立数据合规矩阵（含法规知识库），保留为独立 Git 仓库 | 独立维护 |
| `case_system/` / `knowledge-base/` / `evals/` | 轻量模块与评估框架 | 按需使用 |

> 根目录软链接 `主项目` 指向 `apps/desktop-legalwork/`，仅为兼容旧路径；新建代码不要依赖它。

---

## 2. 最高优先级约束（来自全局 CLAUDE.md）

- **禁止未经用户明确允许，以任何形式删除任何文件。**
- **禁止在脚本/代码中内置未经单独许可的删除功能。**
- 删除文件前必须获得用户明确批准（`rm`、`rmdir`、`unlink`、移至废纸篓、`git rm`、`git clean`、脚本批量清理等均需批准）。

---

## 3. 活跃项目入口与常用命令

### 3.1 桌面端（Electron）

```bash
cd apps/desktop-legalwork

npm install
npm run dev              # 开发模式
npm run typecheck        # TypeScript 校验
npm run build            # 生产构建
npm run test             # 运行测试
npm run lint             # ESLint
npm run dist:mac         # macOS 安装包
```

### 3.2 Legalwork 运行时（子包）

```bash
cd apps/desktop-legalwork/legalwork

npm install
npm run build            # tsc 构建
npm run typecheck        # 类型检查
npm run test             # 单元测试
npm run serve            # 启动本地 HTTP/SSE 服务
```

### 3.3 Python 侧能力（OCR / 脱敏 / 技能）

```bash
# 根目录
pip install -r requirements.txt

python3 ocr_agent.py auto 文档.pdf
python3 redact_agent.py 文档.docx
python3 run_skill.py legal-case-analysis 案件材料.pdf
```

---

## 4. 架构约定

### 4.1 桌面端分层

```text
Renderer (React + Zustand)
  → preload (ipc expose)
  → main (Electron 主进程)
  → LocalHttpRuntimeAdapter
  → legalwork serve (HTTP + SSE)
  → cache-first AgentLoop
```

- **Renderer** 只通过 `dsGui.runtimeRequest` / `startSse` 与主进程通信。
- **main** 负责窗口、运行时生命周期、设置持久化、文件系统代理。
- **Legalwork** 是唯一的 Agent 运行时，不再维护其他旧运行时。

### 4.2 Legalwork 运行时：六边形架构

`apps/desktop-legalwork/legalwork/src/` 严格按层组织，依赖方向不可逆：

```text
contracts/    → zod schema + 派生类型，不依赖任何其他层
domain/       → 纯函数、不可变数据、工厂
ports/        → 抽象接口
cache/        → 缓存原语
telemetry/    → 用量/缓存遥测
adapters/     → ports 的具体实现
services/     → 用例编排
loop/         → AgentLoop、ContextCompactor、SteeringQueue 等核心行为
server/       → HTTP/SSE 路由
cli/          → 命令行入口
```

**关键纪律**：

- 加新事件/实体/错误类型时，先从 `contracts/` 写 zod schema，再逐层向下实现。
- `domain/` 不能引用 `ports/`、`services/`、`adapters/`。
- `contracts/` 不能引用 `node:fs`、数据库驱动等外部依赖。
- 新增 adapter 必须实现对应 port；新增 loop 行为应只依赖 ports + domain + services。

---

## 5. 开发工作流

### 5.1 分支策略

- `develop`：日常协作与集成分支。
- `master`：稳定发布分支，由维护者从 `develop` 合入。
- 新功能/修复从最新 `develop` 拉出短期功能分支，命名建议：
  - `feat/runtime-settings`
  - `fix/connection-probe`
  - `docs/bilingual-readme`
  - `refactor/chat-store`

### 5.2 提交前必须执行

在 `apps/desktop-legalwork/` 下：

```bash
npm run typecheck
npm run build
npm run test
```

如果改动影响运行时或 UI，额外运行：

```bash
npm run dev
```

并手动验证受影响流程。

### 5.3 PR 质量标准

- 一个 PR 聚焦一个主题，减少无关格式化改动。
- 行为变更时同步更新文档（`README.md`、`README.en.md`、对应 `docs/` 文件）。
- UI 改动附视频或 GIF。
- 逻辑改动附对应单元测试。
- PR 描述包含：改了什么、为什么改、如何验证。

### 5.4 本地化

- 用户可见文案尽量同步更新中英文。
- 桌面端文案通过 `src/renderer/src/locales/` 管理。

---

## 6. 代码风格

- TypeScript 严格模式，优先显式类型，避免 `any`。
- React 组件使用函数组件 + Hooks；状态管理以 Zustand 为主。
- 样式使用 Tailwind CSS，遵循项目已有的 Vercel/Geist 设计系统（见根目录 `DESIGN.md`）。
- 关键约定：
  - 卡片/容器优先使用 `shadow-as-border`：`rgba(0,0,0,0.08) 0px 0px 0px 1px`
  - 标题使用 Geist 字体与负 letter-spacing
  - 交互色慎用工作流色彩（Ship Red / Preview Pink / Develop Blue）
- 命名：文件使用 kebab-case（测试文件 `.test.ts`），组件使用 PascalCase，工具函数 camelCase。

---

## 7. 测试约定

- 桌面端与 Legalwork 运行时均使用 **Vitest**。
- 测试文件与源码同名，后缀 `.test.ts`（如 `app-ipc-schemas.test.ts`）。
- 六边形架构中，优先为 `domain/`、`loop/`、`services/` 写纯单元测试；adapter 测试使用 in-memory 实现。
- 新增 zod schema 必须至少有一个解析/反解析测试。

---

## 8. 安全与合规

本项目处理法律文档、个人信息、合规数据，需特别注意：

- **默认不记录、不上传用户文档内容到外部服务**；模型调用使用用户自行配置的 API Key。
- 处理身份证号、手机号、地址、案号、金额等敏感信息时，优先复用 `redaction/` 或桌面端数据合规组件。
- 新增涉及文件系统、网络、剪贴板、后台任务的代码时，评估最小权限原则。
- 不要将 API Key、Token、私钥硬编码到源码或测试中。

---

## 9. Claude Code 工作偏好

### 9.1 工具与路由

- **微信公众号推送/文章正文提取** → 使用 `web-content-fetcher`。
- **浏览器自动化**（打开网页、填表单、截图、登录、多平台分发）→ 优先使用 `browser-act` 相关 skill。
- **项目内搜索/探索** → 优先使用 `Explore` agent 或 `claude-mem:smart-search`。
- **法律文书/案例研究** → 可使用 `legal-case-analysis`、`legal-research` 等 skill。

### 9.2 上下文缺失时

如果用户提到"刚才/之前/上次"、使用未识别的专有名词、或表达"你怎么忘了"，按全局规则**先搜索历史**再回复：

```bash
python3 ~/.claude/skills/context-search/scripts/search_history.py <关键词1> <关键词2> ...
```

### 9.3 多 Agent 工作流

- 处理 `nanobot` / `deepagents` / `goose` / `camel` / `ag2` 等五 Agent 横向测试时，优先使用 `five-agent-test-workflow`。
- 处理 `/Users/xiangyang/Desktop/openclaw测试` 相关任务时，优先使用 `openclaw-test-workflow`。

### 9.4 变更原则

- **Surgical Changes**：只改与请求直接相关的代码，不顺手重构无关模块。
- **Simplicity First**：最小代码解决问题，不为单次用途造抽象。
- 移除因本次改动而不再使用的导入/变量/函数，但不要删除 pre-existing 的死代码（除非用户要求）。

---

## 10. 关键文档地图

| 文档 | 内容 |
|------|------|
| `README.md` | 项目全景、69 项技能、快速开始 |
| `PROJECT_STRUCTURE.md` | 目录说明、活跃项目入口 |
| `DESIGN.md` | Vercel/Geist 设计系统参考 |
| `apps/desktop-legalwork/README.md` | 桌面端功能与使用说明 |
| `apps/desktop-legalwork/docs/DEVELOPMENT.zh-CN.md` | 开发流程与 PR 标准 |
| `apps/desktop-legalwork/docs/legalwork-architecture.md` | Legalwork 单运行时方案 |
| `apps/desktop-legalwork/docs/legalwork-cache-optimization.md` | 缓存优化与 Token Economy |
| `apps/desktop-legalwork/docs/legalwork-contributing.md` | Legalwork 贡献指南（六边形架构） |
| `apps/desktop-legalwork/legalwork/README.md` | Legalwork CLI、API、data dir 说明 |
| `projects/compliance/CLAUDE.md` | 独立合规子项目协作规则 |

---

## 11. 许可证

- 本仓库代码统一采用 **PolyForm Noncommercial License 1.0.0**，仅限非商业用途。
- 桌面端运行时基于 [Kun](https://github.com/KunAgent/Kun)，相关声明保留在 `apps/desktop-legalwork/LICENSE`。
