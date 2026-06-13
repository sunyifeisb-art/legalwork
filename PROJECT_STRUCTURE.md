# Project Structure

整理日期：2026-06-12

## 哪个是软件

真正的桌面软件项目是：

- `apps/desktop-legalwork/`

这个目录里的 `package.json` 是桌面端工程入口，应用名称为 `legalwork`。当前开发、测试、修改界面和主进程逻辑，都以它为准。

根目录本身还保留 LegalWork OCR / 脱敏能力包，主要代码包括：

- `document/`：文档 intake、OCR、LDIR、语义处理流水线
- `redaction/`：敏感信息识别与脱敏流水线
- `skills/`：法律任务相关技能包
- `ocr_agent.py`：OCR CLI 入口
- `redact_agent.py`：脱敏 CLI / Agent 入口

## Active Work

- `apps/desktop-legalwork/`
  - 当前桌面端主项目，也就是 legalwork 软件本体。
  - 原目录名：`主项目`
  - 这是已经改成 legalwork 集成版的应用，包含 `legalwork/` 运行包。

- `projects/compliance/`
  - 独立的数据合规项目。
  - 原目录名：`合规`
  - 保留为独立 Git 仓库。

## Notes

- DeepSeek-GUI 上游/旧命名副本已删除。
- 为兼容整理前已经启动的本地开发进程，根目录保留了一个软链接：
  - `主项目` -> `apps/desktop-legalwork`
  这不是重复副本，只是旧路径入口。
- 如需恢复整理前的位置，可以运行 `undo-organization-20260612.sh`。
