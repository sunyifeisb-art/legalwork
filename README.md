# legalwork 项目说明

## 桌面软件在哪里

真正的 legalwork 桌面软件在：

```text
apps/desktop-legalwork/
```

这个目录才是桌面端工程入口。打开、开发、测试软件时，以 `apps/desktop-legalwork/package.json` 为准。根目录下的 OCR、脱敏、技能文件是能力包，不是桌面软件入口。

更详细的目录说明见 `软件入口说明.md` 和 `PROJECT_STRUCTURE.md`。

---

# LegalWork OCR Agent 能力包

> 从 LegalClaw 项目独立出来的 OCR Agent 能力模块。
> 内置为 Agent 本身的能力，有需要时自动调用。

## 目录结构

```
legalwork/
├── __init__.py                 # 包入口
├── ocr_agent.py                # ★ 独立 OCR Agent 脚本（入口）
├── README.md                   # 本文件
└── document/
    ├── __init__.py
    ├── pipeline.py             # 文档处理流水线（intake→OCR→LDIR）
    ├── intake/
    │   └── router.py           # 文档入口路由（自动判断是否需要OCR）
    ├── ocr/
    │   └── router.py           # OCR 引擎路由（PaddleOCR→Tesseract降级）
    ├── ldir/
    │   ├── builder.py          # Legal Document IR 结构化输出
    │   └── schema.json         # LDIR 格式定义
    ├── parser/
    │   └── mineru_adapter.py   # MinerU PDF 解析（降级）
    └── semantic/
        ├── semantic_layer.py   # 语义增强层
        ├── entity_extractor.py # 法律实体提取
        ├── chunker.py          # 语义分块
        └── clause_parser.py    # 条款层级解析
```

## 作为 Agent 能力自动调用

### 方式 1：自动 OCR（推荐）

Agent 的 `read_file` 工具已内置 OCR 自动检测：

- 读取 **原生 PDF**（有文本层）→ 直接提取文字
- 读取 **扫描 PDF**（无文本层）→ 自动触发 OCR
- 读取 **图片**（jpg/png/bmp/tiff）→ 自动触发 OCR
- 读取 **Word/Excel** → 直接提取内容

无需手动调用，扫描件自动识别。

### 方式 2：手动调用 OCR 工具

Agent 提供 `run_ocr` 工具，当需要获取详细的 OCR 结果（置信度、分块信息等）时使用：

```
run_ocr(file_path="扫描合同.pdf", profile="legal_pdf_parser")
```

profile 参数：
- `fast_local_ocr`（默认）：快速中文 OCR
- `legal_pdf_parser`：法律文档解析（更适合判决书、合同等）
- `complex_document`：复杂版面文档
- `browser_local`：浏览器端快速识别

## 独立 CLI 用法

```bash
# 对单文件执行 OCR
python3 ocr_agent.py scan 扫描合同.pdf

# 批处理目录下所有文件
python3 ocr_agent.py batch ./证据材料/

# 完整文档处理流水线（intake→OCR→LDIR）
python3 ocr_agent.py pipeline 判决书.pdf

# 自动判断是否需要 OCR
python3 ocr_agent.py auto 文件.docx

# 列出当前可用的 OCR 引擎
python3 ocr_agent.py engines
```

## 能力说明

| 能力 | 说明 |
|------|------|
| 自动文件类型检测 | PDF vs 扫描PDF vs 图片 vs Word vs Excel |
| 双引擎 OCR | PaddleOCR（默认）→ Tesseract（兜底） |
| 扫描 PDF 逐页 OCR | PyMuPDF 转图片 → OCR |
| 坐标级输出 | 返回文本块坐标（bbox） |
| 置信度报告 | 每个文本块的识别置信度 |
| 批量处理 | 目录批量 OCR |
| LDIR 结构化 | 统一的法律文档中间表示 |
| 语义增强 | 实体提取、条款解析、语义分块 |
| Pipeline 整合 | intake→OCR→LDIR→Semantic 全自动 |

## 依赖安装

```bash
pip install paddleocr      # 中文 OCR 引擎
pip install pytesseract     # 兜底 OCR 引擎（需安装 tesseract-ocr）
pip install pymupdf         # PDF 处理
pip install Pillow          # 图片处理
```

---

# 文件脱敏功能 (Redaction)

> ⚠️ **当前状态：已复制，可独立测试，但尚未集成到 Agent 工具列表。**
> 下一步：将其注册为 Agent 的 `run_redaction` 工具。

## 目录结构

```
legalwork/
└── redaction/
    ├── __init__.py           # 模块入口，导出所有 public 类
    ├── detector.py           # 敏感实体检测（身份证、手机号、邮箱、银行卡、案号等）
    ├── policy.py             # 脱敏策略引擎（3种策略、5种脱敏模式）
    ├── pipeline.py           # 脱敏处理流水线（detect→policy→render）
    ├── renderer.py           # 脱敏渲染器（Markdown/HTML/映射表）
    └── renderer_pdf.py       # PDF 坐标级涂黑渲染器
skills/redaction/
    ├── __init__.py           # Skill 入口
    └── manifest.yaml         # Skill 声明文件
```

## 核心能力

### 敏感实体识别 (`detector.py`)
- 身份证号（支持15/18位，含校验位）
- 手机号
- 邮箱地址
- 银行卡号
- 车牌号
- 公司名
- 地址
- 案号
- 姓名（NER 预留）
- 金额（正则 + 上下文）

### 脱敏策略 (`policy.py`)

| 策略 | 适用场景 |
|------|----------|
| `external_client` | 对外发送，Mask 敏感信息 |
| `internal_legal_analysis` | 内部法律分析，Tokenize 后保留可读性 |
| `public_release` | 公开发布，Full Mask |

### 脱敏模式

| 模式 | 示例 (13800138000) |
|------|-------------------|
| MASK | 138****8000 |
| REPLACE | [手机号] |
| TOKENIZE | {PHONE:1} |
| FULL_MASK | **** |
| PARTIAL_MASK | 138****8000 |

### 输出产物

- `.redacted.md` — 脱敏后的文档
- `.mapping.enc` — 脱敏映射表（一致性映射，跨实体跟踪）
- `.redaction_report.html` — 脱敏报告（含置信度、复核项）

### PDF 坐标级脱敏 (`renderer_pdf.py`)
- 基于 LDIR 坐标定位敏感区域
- PyMuPDF 像素级涂黑（矩形覆盖）
- 底层文本层删除（可选）
- Metadata 清理

## 使用示例

```python
from redaction.pipeline import RedactionPipeline

pipeline = RedactionPipeline()
result = pipeline.process_text(
    text="身份证号：110101199001011234，手机号：13800138000",
    policy_name="external_client",
)
print(result["redacted_text"])
# 输出：身份证号：110101**********1234，手机号：138****8000
```
