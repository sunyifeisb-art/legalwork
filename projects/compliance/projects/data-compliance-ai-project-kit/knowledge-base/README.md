# 外部规范数据库与本地法规库说明

这一目录原本只用于未来对接外部规范数据库的占位。当前为了让研发能稳定消费一批真实法规原文，补充了一套**不影响主审查链路**的本地法规库方案。

## 当前定位
- `templates/`：法规 Markdown frontmatter 模板，便于后续做人工整理或高质量结构化沉淀。
- `data-outbound/`：数据出境方向的对接口径说明占位。
- `local-regulations.sqlite3`：本地法规检索库，保存原始文件元数据、提取后的全文和全文检索索引。
- `regulations-md/`：从 PDF 提取出的规范化 Markdown 文本库，适合后续审查、比对、精修和版本管理。

## 推荐存储策略
- **原件保留层**：继续保留 PDF / DOCX / DOC 原始文件，作为审计和回溯依据。
- **标准化文本层**：项目内最适合长期维护的格式仍然是 `Markdown + YAML frontmatter`，因为它可 diff、可审阅、可手工修订，也和现有模板、脚本口径一致。
- **检索加速层**：为了让脚本快速查法规标题、标准号、条文关键词，使用 `SQLite + FTS5` 建本地全文索引库。

## 为什么不是直接把 PDF 当“数据库”
- PDF 适合留档，不适合做稳定比对和检索。
- 审查引擎后续真正需要消费的是“可检索文本 + 元数据”，而不是版式文件本身。
- Markdown 适合精修和版本管理，SQLite 适合检索和批量查询，这两层结合比单独保留 PDF 更实用。

## 配套脚本
- `scripts/ingest_regulation_corpus.py`
  - 扫描目录中的 PDF。
  - 提取标题、标准号、分类、全文、页数等信息。
  - 写入 `knowledge-base/local-regulations.sqlite3`。
  - 同时导出 `knowledge-base/regulations-md/` 下的 Markdown 文件。
  - 自动构建 `FTS5` 全文检索索引和分块索引。
- `scripts/search_regulation_db.py`
  - 用标题、标准号或关键词搜索本地法规库。
- `scripts/apply_ocr_overrides.py`
  - 对已入库但正文提取失败的法规，按文件名匹配 OCR 版 PDF。
  - 用 OCR 版文本回填数据库记录与 Markdown 文本库。
- `scripts/enrich_report_with_regulation_db.py`
  - 在审查报告生成后，按风险项主题、证据片段与关键词回查本地法规库分块。
  - 为风险项补充 `supporting_regulations`，把命中的标准/政策条款级片段挂回报告。

## 当前原则
- 不改现有上传 / 输出主链路。
- 本地法规库作为**研发辅助层**存在，不强行塞进 Web 接口契约。
- 先保证“可检索、可回溯、可增量导入”，再考虑更细的条款级结构化。
