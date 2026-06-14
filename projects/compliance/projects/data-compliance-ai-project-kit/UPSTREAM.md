# 默认同步源（仅限数据合规项目）

本项目后续默认同步源已固定为：

- GitHub：`https://github.com/AiYuSherry/data-compliance-review`
- Branch：`main`
- 作用域：**仅限数据合规项目**，不影响整个 workspace 的其他项目。

## 配置文件

- `config/default-sync-source.json`

## 一键同步脚本

- `scripts/sync_default_upstream.sh`

## 安全上传脚本

- `scripts/safe_upload_default_upstream.sh`

## 团队是否可共用

可以。只要团队成员也在使用这个 GitHub 仓库并把这些脚本文件同步下来，就可以直接共用这套检查与安全上传流程。
建议每位成员各自运行一次 `init`，建立自己的本地基线状态文件，再开始使用。
这个基线状态文件现在默认保存在本地 `.openclaw/data-compliance-review/default-sync-state.json`，**不会上传到 GitHub**，因此不会互相污染。

这个脚本会按配置同步以下内容：

- `API_CONTRACT.md`
- `TEAM_STATUS.md`
- `data-compliance-web/`
- `projects/data-compliance-ai-project-kit/`
- `skills/data-compliance-ai-rd/`
- 若干数据合规项目相关示例输出

## 使用方式

```bash
bash projects/data-compliance-ai-project-kit/scripts/sync_default_upstream.sh
```

## 安全上传使用方式

先初始化一次基线状态：

```bash
python3 projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.py init
```

每次开发前先检查本地是否已追上 GitHub 最新：

```bash
python3 projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.py check
```

- 返回 `status: UP-TO-DATE` 或 `status: AHEAD-LOCAL`：可以继续开发。
- 返回 `status: BEHIND`：说明 GitHub 有新内容，本地还没跟上，应先同步。
- 返回 `status: CONFLICT`：说明你和远端都改过同一文件，应先处理冲突，再继续开发。

上传前先看计划：

```bash
python3 projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.py plan
```

确认后执行安全上传：

```bash
python3 projects/data-compliance-ai-project-kit/scripts/safe_upload_default_upstream.py upload --message "chore: your message"
```

## 安全上传规则

- 只要是**你改了、远端没改**的文件，就自动上传。
- 只要是**远端改了、你没改**的文件，就自动同步回本地，避免你继续在旧版本上工作。
- 只要是**你和远端都改了同一文件**，脚本就停止并列出冲突文件，不会强行覆盖。
- 默认**不自动处理删除冲突**；涉及删除时会停下，避免误删你或同事的重要内容。

## 说明

- 这是**项目级默认同步源**，不是整个 OpenClaw workspace 的全局上游。
- 若后续团队更换仓库或分支，只需改 `config/default-sync-source.json`。
- 安全上传的基线状态默认保存在本地 `.openclaw/data-compliance-review/default-sync-state.json`，不进入 GitHub 仓库。
- 本项目约定：**每次开发前，先跑 `check`，确认本地没有落后于 GitHub 最新版本。**
