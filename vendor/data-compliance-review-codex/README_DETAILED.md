# 数据合规智能审查系统

> 基于规则引擎与大语言模型的智能化数据合规审查工具

---

## 项目简介

**数据合规智能审查系统**是一款面向律师、法务人员及企业合规部门的智能化数据合规审查平台。系统采用"规则引擎 + AI增强"的双引擎架构，自动化识别隐私政策、数据处理协议、代码等文件中的合规风险，确保数据处理活动符合《中华人民共和国个人信息保护法》《数据安全法》《网络安全法》等法律法规要求。

### 核心价值

| 维度 | 说明 |
|------|------|
| **效率提升** | 将传统人工审查时间从数天缩短至数分钟 |
| **准确性保障** | 规则引擎确保法律要求的全面覆盖，LLM增强提供专业分析 |
| **可操作性** | 生成具体的整改建议和可直接替换的合规条款 |
| **多场景支持** | 覆盖文档审查、代码审查、数据脱敏等多个场景 |

---

## 功能特性

### 1. 文档合规审查
- **11项核心检查维度**：披露充分性、数据出境、第三方共享、合法性基础、敏感个人信息处理等
- **智能风险判定**：自动判定高、中、低风险等级
- **精准证据定位**：定位风险条款在文档中的具体位置
- **法规依据关联**：自动关联相关法律法规条款

### 2. 代码合规审查
- **静态代码扫描**：检测代码中的数据合规风险
- **风险类型覆盖**：密钥硬编码、明文传输、敏感数据日志输出、个人信息采集缺少授权等
- **修复建议生成**：提供具体的修复代码示例

### 3. 数据脱敏处理
- **多格式支持**：文本、文档、表格、JSON、图片等
- **保留格式打码**：采用掩码技术（如 `138****5678`）
- **OCR识别能力**：支持图片与扫描件的文字识别与脱敏

### 4. AI增强建议
- **专业风险分析**：基于DeepSeek大模型生成专业分析报告
- **条款改写建议**：提供可直接替换的合规条款文本
- **上下文感知**：根据具体条款内容生成个性化建议

### 5. 专项审查包生成
- SDK合作方审查包
- 数据出境审查包
- 隐私整改审查包
- 证据清单生成

---

## 技术架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户输入层                               │
│   文件上传 • 文本输入 • 格式识别                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                        预处理层                                 │
│   文本提取 • OCR识别 • 结构化解析                               │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                        分析引擎层                               │
│   规则引擎 • 风险判定 • 证据定位                               │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                        增强层                                   │
│   LLM增强 • 建议生成 • 条款改写                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                        输出层                                   │
│   报告生成 • 整改任务 • 专项审查包                               │
└─────────────────────────────────────────────────────────────────┘
```

### 核心技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 后端框架 | Flask | Web应用框架 |
| 规则引擎 | Python + 正则 | 合规规则匹配与风险判定 |
| 大语言模型 | DeepSeek API | AI增强建议生成 |
| 文档处理 | PyPDF、python-docx | PDF/Word文本提取 |
| OCR识别 | Tesseract | 图片文字识别 |
| 敏感信息检测 | Presidio Analyzer | 结构化数据脱敏 |

---

## 快速开始

### 环境要求

- Python 3.10+
- 依赖库：见 `requirements.txt`

### 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd data-compliance-review-main

# 安装依赖
cd data-compliance-web
pip install -r requirements.txt

# 配置环境变量（可选）
export DEEPSEEK_API_KEY=your-api-key-here
```

### 运行方式

#### 方式一：Web应用（推荐）

```bash
cd data-compliance-web
python app.py
```

访问 http://localhost:5000 即可使用系统。

#### 方式二：命令行工具

```bash
# 运行合规审查
python scripts/run_review_pipeline.py \
  --input-file privacy_policy.pdf \
  --output-dir output/

# 运行数据脱敏
python -c "from desensitize_engine import process_desensitization; process_desensitization(...)")
```

---

## 使用指南

### 1. 文档合规审查

**输入**：隐私政策、数据处理协议、用户协议等文档（支持PDF、DOCX、DOC、TXT等格式）

**输出**：
- 合规风险报告（JSON/Markdown格式）
- 整改任务清单
- 证据收集清单
- 专项审查包

**使用示例**：

```python
from scripts.run_review_pipeline import run_review_pipeline

# 执行审查
result = run_review_pipeline(
    task_id="review_001",
    input_path="privacy_policy.pdf",
    document_name="用户隐私政策",
    is_text=False
)

# 获取结果
print(f"报告路径: {result['report']}")
print(f"整改任务: {result['remediation']}")
```

### 2. 代码合规审查

**输入**：源代码文件（支持Python、JavaScript、TypeScript等多种语言）

**输出**：
- 代码层合规风险报告
- 修改建议文档
- 修复代码示例

**使用示例**：

```python
from app import analyze_code_compliance

# 分析代码合规性
code = """
const apiKey = "sk-xxxxxxxxxxxxxxxx";
fetch("http://api.example.com/data", { method: "POST" });
"""

report = analyze_code_compliance(code, "api_service.ts")
print(f"发现风险: {report['summary']}")
```

### 3. 数据脱敏处理

**输入**：待脱敏的数据文件（支持文本、表格、JSON、图片等格式）

**输出**：
- 脱敏后文件
- 脱敏报告（JSON/Markdown）
- 处理留痕说明

**使用示例**：

```python
from desensitize_engine import process_desensitization

# 处理数据脱敏
result = process_desensitization(
    task_id="desensitize_001",
    input_path="user_data.xlsx",
    document_name="用户数据",
    work_dir="output/desensitize_001",
    is_text=False
)

print(f"脱敏文件: {result['output_file']}")
print(f"脱敏报告: {result['report_json']}")
```

---

## 代码结构

```
data-compliance-review-main/
├── data-compliance-web/                    # Web应用主模块
│   ├── app.py                              # Flask应用入口
│   ├── desensitize_engine.py               # 数据脱敏引擎
│   ├── config/                             # 配置文件目录
│   │   ├── review-checkpoints.json         # 检查点配置
│   │   ├── default-norm-mappings.json      # 法规映射配置
│   │   ├── risk-themes.json                # 风险主题定义
│   │   └── ...
│   ├── scripts/                            # 核心处理脚本
│   │   ├── run_rule_based_review.py        # 规则引擎执行
│   │   ├── enhance_suggestions_with_llm.py # LLM增强建议
│   │   ├── aggregate_review_findings.py    # 结果汇总
│   │   ├── build_report_skeleton.py        # 报告框架构建
│   │   ├── auto_recheck_report.py          # 自动复核
│   │   ├── build_remediation_task_plan.py  # 整改任务生成
│   │   └── ...
│   ├── templates/                          # 前端模板
│   └── requirements.txt                    # 依赖清单
├── desktop/                                # 桌面应用封装
├── extension/                              # 浏览器扩展
└── output/                                 # 输出文件目录
```

### 核心文件职责

| 文件 | 职责 | 关键功能 |
|------|------|----------|
| `app.py` | HTTP请求处理 | RESTful API、任务管理、进度推送 |
| `desensitize_engine.py` | 数据脱敏 | 敏感信息识别、保留格式打码、多格式支持 |
| `scripts/run_rule_based_review.py` | 规则引擎 | 11项合规检查规则、风险判定、证据定位 |
| `scripts/enhance_suggestions_with_llm.py` | LLM增强 | DeepSeek API调用、专业建议生成、条款改写 |
| `scripts/build_remediation_task_plan.py` | 整改任务 | 优先级排序、任务分配、跟踪清单 |

---

## 检查规则详解

系统内置11项核心合规检查规则：

| 检查项 | 检查内容 | 风险场景 |
|--------|----------|----------|
| **披露充分性检查** | 处理目的、方式、信息类型、用户权利 | 信息披露不完整 |
| **数据出境检查** | 境外接收方、出境场景、保障机制 | 跨境传输合规风险 |
| **第三方共享检查** | 第三方身份、共享范围、目的 | 共享条款不明确 |
| **合法性基础检查** | 同意、授权、履行合同等合法依据 | 处理依据不足 |
| **目的匹配检查** | 信息类型与处理目的对应关系 | 过度收集风险 |
| **敏感信息检查** | 单独同意、保护措施、未成年人保护 | 敏感信息处理不合规 |
| **字段-目的-法律基础校验** | 三者对应关系 | 法律依据缺失 |
| **同意与功能绑定检查** | 可选功能独立同意机制 | 捆绑同意风险 |
| **合同义务检查** | 双方义务、保密责任、终止后处理 | 合同条款不完善 |
| **保存删除检查** | 保存期限、删除机制 | 无限期保存风险 |
| **一致性检查** | 文档前后表述一致性 | 表述矛盾 |

---

## 大模型集成说明

系统通过DeepSeek API实现大语言模型增强：

### 配置方式

1. **环境变量配置**：
   ```bash
   export DEEPSEEK_API_KEY=your-api-key-here
   ```

2. **文件配置**：
   ```bash
   echo "your-api-key-here" > .deepseek_key
   ```

### 调用流程

```
风险点数据 → 构建专业Prompt → DeepSeek API调用 → 响应解析 → 结构化输出
```

### 输出示例

对于检测到的风险点，LLM会生成：

```json
{
  "risk_point": "敏感个人信息处理缺少单独同意",
  "llm_analysis": "根据《个人信息保护法》第29条，处理敏感个人信息应当取得个人的单独同意。当前条款未明确提及单独同意机制，存在合规风险。",
  "llm_suggestion": "建议在收集面部信息前，设置单独的授权弹窗，明确告知用户收集目的、使用范围及拒绝后果。",
  "rewritten_clause": "我们仅在您单独同意后，为实现身份验证目的收集您的面部信息，并采取加密存储、访问控制等严格保护措施。您可随时撤回同意，撤回后我们将停止使用并删除相关信息。"
}
```

---

## 部署方式

### 本地部署

```bash
# 安装依赖
pip install -r requirements.txt

# 启动服务
python app.py --host 0.0.0.0 --port 5000
```

### Docker部署（待实现）

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "app.py"]
```

### 桌面应用

系统支持打包为原生桌面应用：

- **macOS**: 支持 `.app` 和 `.dmg` 格式
- **Windows**: 支持 `.exe` 安装包

---

## 应用场景

### 面向律师
- 隐私政策合规审查
- 数据处理协议审查
- 合规整改指导

### 面向法务
- 日常合规检查
- 新产品合规评估
- 数据跨境合规

### 面向企业
- 隐私合规自查
- 供应商合规评估
- 员工数据培训
- 数据脱敏处理

---

## 开发指南

### 目录结构规范

```
scripts/           # 核心处理脚本
├── *.py           # 每个文件对应一个独立功能
config/            # 配置文件
├── *.json         # JSON格式配置，便于维护
templates/         # 前端模板
├── *.html         # Jinja2模板
```

### 代码规范

- Python代码遵循PEP 8规范
- 使用类型提示（Type Hints）
- 函数和变量命名清晰
- 关键逻辑添加注释说明

### 测试

```bash
# 运行单元测试
cd extension
npm test

# 运行smoke测试
cd data-compliance-web
python scripts/smoke_check.py
```

---

## 贡献指南

欢迎贡献代码！请遵循以下流程：

1. Fork本仓库
2. 创建功能分支：`git checkout -b feature/xxx`
3. 提交代码：`git commit -m "feat: xxx"`
4. 推送分支：`git push origin feature/xxx`
5. 创建Pull Request

---

## 许可证

MIT License

---

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目主页：<repository-url>
- 问题反馈：<issues-url>

---

**版本**: v1.0.0  
**最后更新**: 2026年5月  
**维护团队**: 数据合规智能审查系统开发组