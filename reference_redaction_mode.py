"""
[参考] RedactionMode — 脱敏模式（原 LegalClaw 集成层）

⚠️ 本文件为原项目中 core/modes/redaction_mode.py 的参考副本。
   在原项目中它作为 Agent 运行模式使用，依赖于 BaseMode 框架。
   这里仅作功能参考，不可直接运行。

核心逻辑：
   RedactionMode 调用 RedactionPipeline 完成：
   1. 遍历输入文件列表
   2. 对每个文件执行脱敏（调用 pipeline.process_text）
   3. 保存脱敏结果到 redacted/ 工作区
   4. 生成脱敏报告（mapping + report）
   5. 记录审计日志

原文件位置：legalclaw/core/modes/redaction_mode.py
"""
