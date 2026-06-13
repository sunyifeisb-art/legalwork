# 项目协作规则

## 1. 更新日志格式
每次写入或修改 `CHANGELOG.md` 时，条目头部必须采用以下格式：

```
[YYYY-MM-DD HH:MM] — 修改人 — 一句话总结
```

- **时间**：精确到小时分钟。
- **修改人**：写具体称呼，如 `你`（前端）、`朋友`（后端/规则），不要使用模糊的"更新"。

## 2. 工作流约定
- **开发前必须确认同步**：开始改代码前，先 `git status` / `git log` 检查本地是否为 GitHub 最新版。若落后，先 `git pull` 并解决冲突后再动手。
- 每天早上开工前 `git pull`，收工时 `git commit + push`。
- 推送代码时必须同时推送两个 GitHub 远端：`origin`（AiYuSherry/data-compliance-review）与 `sunyi`（sunyifeisb-art/data-compliance-review）。
- 不要通过微信传文件改代码。
- 后端改了 JSON 格式 → 必须同步更新 `test_output/demo_data/`。
- 前端改了页面布局 → 在 `TEAM_STATUS.md` 里 `@` 一下后端提醒检查展示效果。


<claude-mem-context>
# Memory Context

# claude-mem status

This project has no memory yet. The current session will seed it; subsequent sessions will receive auto-injected context for relevant past work.

Memory injection starts on your second session in a project.

`/learn-codebase` is available if the user wants to front-load the entire repo into memory in a single pass (~5 minutes on a typical repo, optional). Otherwise memory builds passively as work happens.

Live activity: http://localhost:37701
How it works: `/how-it-works`

This message disappears once the first observation lands.
</claude-mem-context>