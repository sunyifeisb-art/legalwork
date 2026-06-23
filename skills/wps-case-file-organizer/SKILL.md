---
id: wps-case-file-organizer

name: "wps-case-file-organizer"
description: Intelligently organize all WPS cloud files by analyzing file content. Opens and reads files to understand their topics, then creates topic-specific folders and organizes files automatically. Works with all file types including legal cases, work documents, and personal files.
model: opus
---


# WPS Intelligent File Organizer

Automatically organize WPS cloud files by analyzing file content and creating topic-specific folders. This skill reads file content to understand what each file is about, then intelligently groups related files together.

## When to Use

Use this skill when:
- WPS cloud root directory contains unorganized files
- Files cover multiple topics (legal cases, work documents, personal files, etc.)
- Need intelligent content-based organization (not just filename-based)
- Want fine-grained categorization (each specific topic gets its own folder)

## Prerequisites

**CRITICAL**: User must manually log in to WPS cloud (https://account.wps.cn/login) in their browser BEFORE running this skill.

**Why this approach**:
- ✅ Maximum security - no password handling
- ✅ Minimal login overhead - login once, use multiple times
- ✅ Universal - works for any WPS account
- ✅ Session persistence - browser maintains login state

## Core Capabilities

### 1. Content Analysis
- Opens and reads file content (not just filenames)
- Understands document topics and themes
- Identifies relationships between files
- Recognizes legal cases, work projects, personal documents

### 2. Intelligent Categorization
- Creates topic-specific folders automatically
- Groups related files together
- Uses descriptive folder names based on content
- Handles multiple file types

### 3. Complete File Coverage
- **Scrolls through entire file list** (not just visible files)
- Processes all file types (Word, Excel, PDF, images, etc.)
- No files are skipped or left behind
- Comprehensive organization

## Organization Strategy

### Fine-Grained Categorization (Approach B)

Each specific topic gets its own folder:

```
益阳公司案/
  - 法律意见书
  - 证据清单
  - 庭审记录

人格混同研究/
  - 检索案类分析报告
  - 透视分析表格

大数据研究/
  - 研究指令文档

团队工作簿/
  - 工作表格

学习资料/
  - 期末总结PDF
```

### Folder Naming Principles

1. **Descriptive**: Folder name clearly indicates content
2. **Specific**: Each distinct topic gets separate folder
3. **Concise**: Keep names short but meaningful
4. **Chinese-friendly**: Use natural Chinese naming

**Examples**:
- Legal case: `益阳公司案`, `张三诉李四劳动纠纷`
- Research: `人格混同法律研究`, `公司法理论分析`
- Work: `团队协作文档`, `财务数据分析`
- Personal: `学习资料`, `个人总结`

## Organizing Process

### Step 1: Verify Browser Login

Check if WPS cloud drive page is accessible.

If NOT logged in:
```
❌ ERROR: Not logged in to WPS cloud.

Please:
1. Open browser and navigate to: https://account.wps.cn/login
2. Log in with your WPS account
3. Verify you can access: https://drive.wps.cn
4. Re-run this skill
```

### Step 2: Comprehensive File Scanning

**CRITICAL**: Must scroll through entire file list to capture all files.

```
1. Navigate to WPS cloud root directory
2. Scroll to bottom of page to load all files
3. Collect complete file list including:
   - File names
   - File types
   - Modification dates
   - File sizes
4. Exclude system folders: "应用", "我的板模"
```

**Why scrolling is critical**:
- WPS cloud uses lazy loading (only shows visible files initially)
- Must scroll to trigger loading of all files
- Missing this step = incomplete organization

### Step 3: Content Analysis

For each file, analyze content to determine topic:

**For text-based files** (Word, Excel, PDF, WPS formats):
```
1. Click to open file in browser
2. Read file content (first page or summary)
3. Identify key topics, themes, keywords
4. Determine file category:
   - Legal case name (if applicable)
   - Work project name
   - Research topic
   - Personal category
5. Close file and move to next
```

**For non-text files** (images, archives, etc.):
```
1. Analyze filename for clues
2. Check file metadata if available
3. Make best-effort categorization
4. Group with related files if possible
```

### Step 4: Topic Grouping

Group files by identified topics:

```
Topic: 益阳公司案
  - 20260203_法律意见书_益阳公司案.docx
  - 20260204_证据清单_益阳公司案.xlsx
  - 20260205_庭审记录_益阳公司案.pdf

Topic: 人格混同研究
  - 子公司-母公司人格混同_检索案类分析报告.xlsx
  - 人格混同_一人公司_母公司_透视分析.xlsx

Topic: 大数据研究
  - 大数据研究指令.xcod

Topic: 工作文档
  - 工作簿.xlsx
  - 文字文稿.xcod

Topic: 学习资料
  - 期末总结【打印&复习版】.pdf
```

### Step 5: Folder Creation & Naming

For each topic:

1. **Generate folder name**:
   - Based on topic content
   - Descriptive and specific
   - Natural Chinese naming
   - Concise (ideally 2-6 characters)

2. **Check if folder exists**:
   - If exists: use existing folder
   - If not: create new folder

3. **Folder naming examples**:
   - Legal: `益阳公司案`, `劳动纠纷-张三`
   - Research: `人格混同研究`, `公司法分析`
   - Work: `团队文档`, `数据分析`
   - Personal: `学习资料`, `个人笔记`

### Step 6: File Organization

Move files to corresponding folders:

```
For each file:
1. Locate target folder
2. Move file from root to folder
3. Verify move succeeded
4. Log result
```

**Important**:
- ✅ Only MOVE files (preserve originals)
- ❌ NEVER delete files
- ✅ If move fails, leave in root and log error
- ✅ Continue processing other files

### Step 7: Generate Report

Provide comprehensive organization summary:

```markdown
## WPS 智能文件整理完成

### ✅ 整理统计
- 扫描文件总数: X 个
- 创建文件夹数: Y 个
- 成功移动文件: Z 个

### 📁 已创建的文件夹及内容

#### 1. 益阳公司案 (3个文件)
- 20260203_法律意见书_益阳公司案.docx
- 20260204_证据清单_益阳公司案.xlsx
- 20260205_庭审记录_益阳公司案.pdf

#### 2. 人格混同研究 (2个文件)
- 子公司-母公司人格混同_检索案类分析报告.xlsx
- 人格混同_一人公司_母公司_透视分析.xlsx

#### 3. 大数据研究 (1个文件)
- 大数据研究指令.xcod

#### 4. 工作文档 (2个文件)
- 工作簿.xlsx
- 文字文稿.xcod

#### 5. 学习资料 (1个文件)
- 期末总结【打印&复习版】.pdf

### ⚠️ 处理异常 (如有)
- [文件名]: [错误描述]

### 📊 整理前后对比
**整理前**: X 个文件散落在根目录
**整理后**: Y 个主题文件夹,文件分类清晰
```

## Content Analysis Guidelines

### For Legal Case Files

**Identify**:
- Case name (当事人、公司名)
- Case type (劳动纠纷、合同纠纷、公司法等)
- Document type (法律意见书、证据、判决书等)

**Folder naming**:
- Primary: Use case name (e.g., `益阳公司案`)
- Secondary: Add case type if needed (e.g., `劳动纠纷-张三诉李四`)

**Grouping logic**:
- All documents for same case → same folder
- Related legal research → separate folder (e.g., `人格混同研究`)

### For Work Documents

**Identify**:
- Project name
- Document purpose (会议记录、数据分析、报告等)
- Team or department

**Folder naming**:
- Project-based: `XX项目文档`
- Function-based: `团队会议记录`, `财务分析`
- Generic: `工作文档`, `团队协作`

**Grouping logic**:
- Same project → same folder
- Similar function → same folder
- Generic work files → `工作文档`

### For Personal/Study Files

**Identify**:
- Content type (学习资料、个人笔记、总结等)
- Subject area (if applicable)

**Folder naming**:
- `学习资料`
- `个人笔记`
- `课程总结`
- `阅读材料`

**Grouping logic**:
- By content type or subject

### For Research Documents

**Identify**:
- Research topic
- Research type (理论分析、数据研究、案例研究等)

**Folder naming**:
- Topic-based: `人格混同研究`, `公司法分析`
- Type-based: `法律理论研究`, `案例分析`

**Grouping logic**:
- Same research topic → same folder
- Related research → consider merging or separate folders

## Supported File Types

**All file types are processed**:
- Documents: `.doc`, `.docx`, `.xcod`, `.txt`, `.rtf`
- Spreadsheets: `.xls`, `.xlsx`, `.xslx`, `.csv`
- Presentations: `.ppt`, `.pptx`, `.xppt`
- PDFs: `.pdf`
- Images: `.jpg`, `.png`, `.gif`, `.bmp`
- Archives: `.zip`, `.rar`, `.7z`
- Others: Any file in root directory

## Error Handling

### Common Issues

**1. Cannot open file (permission/format issue)**
- Solution: Analyze filename and metadata instead
- Fallback: Group with similar files by name pattern
- Last resort: Place in `未分类文件` folder

**2. Ambiguous content (multiple possible topics)**
- Solution: Choose most specific/relevant topic
- Example: Legal case file mentioning research → prioritize case folder

**3. File move fails (network/permission error)**
- Solution: Leave file in root, log error, continue
- Do NOT stop entire process

**4. Browser session expired**
- Solution: Prompt user to re-login, then retry
- Error message: "Session expired. Please log in again"

**5. Lazy loading fails (files not loaded)**
- Solution: Scroll multiple times, wait for loading
- Verify file count matches expected

## Best Practices (Methodology Sources)

### 1. Content-Based Organization
- Don't rely solely on filenames
- Read actual content to understand context
- Group by semantic similarity, not just naming patterns

### 2. Fine-Grained Categorization
- Each distinct topic gets own folder
- Avoid overly broad categories
- Balance between specificity and manageability

### 3. Intelligent Folder Naming
- Descriptive and self-explanatory
- Consistent naming style
- Natural language (Chinese-friendly)

### 4. Complete Coverage
- Scroll to load all files (critical!)
- Process every file type
- No files left behind

### 5. Safe Operations
- Never delete files
- Only move (reversible operation)
- Log all actions for transparency

## Security & Privacy

- ✅ No password storage or transmission
- ✅ Uses user's existing browser session
- ✅ File content read only for categorization (not stored)
- ✅ Only file names and locations are modified
- ✅ All operations are reversible

## Limitations

**This skill does NOT**:
- ❌ Delete any files
- ❌ Rename files
- ❌ Modify file contents
- ❌ Process files in existing subfolders (only root directory)
- ❌ Create nested folder hierarchies (max 1 level)

## Testing Scenarios

### Test 1: Mixed File Types
**Input** (root directory):
```
20260203_法律意见书_益阳公司案.docx
工作簿.xlsx
期末总结.pdf
人格混同研究报告.xlsx
团队会议记录.xcod
```

**Expected Output**:
```
益阳公司案/
  - 20260203_法律意见书_益阳公司案.docx

人格混同研究/
  - 人格混同研究报告.xlsx

工作文档/
  - 工作簿.xlsx
  - 团队会议记录.xcod

学习资料/
  - 期末总结.pdf
```

### Test 2: Related Files Grouping
**Input**:
```
子公司-母公司人格混同_检索案类分析报告.xlsx
人格混同_一人公司_母公司_透视分析.xlsx
大数据研究指令.xcod
```

**Expected Output**:
```
人格混同研究/
  - 子公司-母公司人格混同_检索案类分析报告.xlsx
  - 人格混同_一人公司_母公司_透视分析.xlsx

大数据研究/
  - 大数据研究指令.xcod
```

### Test 3: Scroll Loading Test
**Precondition**: 50+ files in root directory (requires scrolling)

**Expected Behavior**:
1. Scroll to bottom to load all files
2. Process all 50+ files (not just first 20 visible)
3. Create appropriate folders for all files
4. Report shows all 50+ files processed

### Test 4: Content Analysis Accuracy
**Input**: Files with ambiguous names
```
文档1.docx (contains legal case content)
表格.xlsx (contains financial data)
资料.pdf (contains study materials)
```

**Expected Behavior**:
1. Open each file to read content
2. Categorize based on actual content (not filename)
3. Create appropriate folders:
   - 文档1.docx → Legal case folder (based on content)
   - 表格.xlsx → Financial analysis folder
   - 资料.pdf → Study materials folder

## Implementation Notes

### Critical: Scroll to Load All Files

```javascript
// Pseudocode for scrolling
1. Navigate to WPS cloud root directory
2. Get initial file count
3. Scroll to bottom of page
4. Wait for new files to load
5. Repeat until no new files appear
6. Verify total file count
7. Proceed with content analysis
```

### Content Analysis Workflow

```
For each file:
1. Click file to open preview/editor
2. Read visible content (first page or summary)
3. Extract key information:
   - Main topic/subject
   - Document type
   - Related entities (people, companies, projects)
4. Determine category and folder name
5. Close file
6. Move to next file

After all files analyzed:
1. Group files by category
2. Create folders
3. Move files
4. Generate report
```

## Version History

- v2.0 (2026-02-03): Major redesign
  - Content-based intelligent organization
  - All file types supported
  - Scroll loading for complete coverage
  - Fine-grained categorization
  - Automatic folder naming

## Usage Example

**User**: "整理我的 WPS 云端文件"

**Skill Actions**:
1. ✅ Verify WPS login session
2. ✅ Navigate to root directory
3. ✅ **Scroll to load all files** (CRITICAL)
4. ✅ Open and analyze each file's content
5. ✅ Group files by topic
6. ✅ Create topic-specific folders
7. ✅ Move files to folders
8. ✅ Generate comprehensive report

**Result**: All files organized into topic-specific folders with intelligent categorization.
## 六、文件组织方案设计

### 6.1 案卷分类体系

案件文件应当按照统一的分类体系进行组织。分类维度包括：文件类型（程序性文件、实体性文件、证据材料、通信记录），文件功能（授权委托文件、起诉应诉文件、证据文件、法律意见文件），文件时序（按时间顺序归档），文件来源（己方文件、对方文件、法院文件）。分类体系应当预先设计并在案件收案时即确定，避免后续归档混乱。

### 6.2 命名规范

案件文件的命名应当遵循统一的规范。建议的命名格式为：案件编号-文件序号-文件类型-文件名称-版本日期。例如：JD2024-001-01-起诉状-v1-20240115。命名规范应当避免使用特殊字符，确保在Windows、Mac和Linux系统间兼容。文件夹的命名应当与案件编号对应，便于检索。

### 6.3 版本管理

案件文件在诉讼过程中会经过多次修改和完善，版本管理至关重要。每次修改应当保存为新版本，并在文件名中标注版本号和修改日期。重要的定稿版本应当标记为最终版并上锁保护。应当建立版本对照表，记录各版本的修改内容和修改人。

### 6.4 电子化和备份

建议对纸质文件进行电子化扫描，建立电子档案。电子文件应当采用通用格式（如PDF/A）保存，确保长期可读。应当建立多重备份机制，定期备份案件文件到离线或云端存储。敏感文件应当进行加密存储。

## 七、WPS特定功能应用

### 7.1 文档模板

利用WPS的模板功能创建标准化的法律文书模板，包括起诉状、答辩状、代理词、法律意见书等。模板应当包含规范的格式设置（字体、字号、行距、页边距）、常用的条款和声明、案例引用格式等。使用模板可以提高文书的一致性和工作效率。

### 7.2 在线协作

利用WPS的在线协作功能，支持团队成员同时编辑同一文档。协作时应当注意版本控制，避免冲突。建议使用批注功能进行审阅和修改，保留修改痕迹。对于需要审批的文书，可以使用WPS的文档流转功能。

### 7.3 PDF转换与处理

WPS支持文档的PDF格式转换，便于提交法院和发送客户。PDF转换时应当注意格式的准确性和保密信息的处理。WPS还支持PDF的合并、拆分、加密等功能，方便案件文件的综合管理。

## 八、文件安全与保密

案件文件涉及当事人的隐私和商业秘密，文件安全管理至关重要。应当建立文件访问权限控制，按角色分配访问权限。对敏感文件进行加密存储和传输。处理完毕的案件文件应当按照归档要求保存或销毁。离职人员的文件访问权限应当及时撤销。

## 九、案件文件生命周期管理

### 9.1 收文阶段

收案阶段是案件文件的起点。应当建立收文登记制度，对收到的每份文件进行登记、编号和归档。收文登记应当包括文件来源、收到日期、文件名称和数量。对于法院送达的文件，应当特别注意签收日期和期限起算。

### 9.2 处理阶段

案件处理过程中会产生大量文件，包括己方出具的法律文书、对方送达的文件、法院的通知和裁定等。所有文件应当按照分类体系及时归档。对需要回应的文件，应当在期限内完成处理并将文件归档。对重要文件的修改版本应当保存完整的历史记录。

### 9.3 结案归档阶段

案件终结后应当对全部案件文件进行整理和归档。按照分类体系检查文件是否完整，是否存在遗漏。制作案件文件清单，列明全部文件的名称、编号和数量。按照归档要求进行装订和编号，标注案号和归档日期。将案件档案移交档案室或档案管理系统。

### 9.4 档案保管与销毁

案件档案应当按照规定的保管期限进行保管。超出保管期限的档案应当按照规定程序进行销毁。涉及重大案件或敏感信息的档案应当适当延长保管期限。档案的调阅和使用应当建立审批和登记制度。

## 十、文件模板示例

### 10.1 文件夹结构示例

```
JD2024-001-张三诉李四合同纠纷/
├── 01-授权委托/
│   ├── 授权委托书.pdf
│   └── 所函.pdf
├── 02-程序文件/
│   ├── 受理案件通知书.pdf
│   ├── 举证通知书.pdf
│   └── 开庭传票.pdf
├── 03-起诉文件/
│   ├── 民事起诉状-v1-20240115.docx
│   ├── 民事起诉状-v2-20240120.docx
│   └── 证据目录.pdf
├── 04-答辩文件/
│   └── 民事答辩状.pdf
├── 05-代理文件/
│   ├── 代理词-v1-20240301.docx
│   └── 代理词-定稿-20240305.docx
├── 06-裁判文书/
│   ├── 一审判决书.pdf
│   └── 二审判决书.pdf
└── 07-结案/
    ├── 结案报告.docx
    └── 案件总结.docx
```

### 10.2 文件命名示例

文件命名应当规范、清晰，便于检索和管理。建议的命名规则为：案件编号-流水号-文件类型-文件名称-版本标识。例如：JD2024-001-01-授权委托书-v1，JD2024-001-02-民事起诉状-v2。

## Legalwork 质量检查

- 是否先生成整理方案和映射表，再移动或改名文件？
- 是否保留原文件名、原路径和新路径的对应关系，便于撤回？
- 是否区分证据原件、工作稿、提交版、法院/对方来文？
- 是否避免覆盖同名文件，并对疑似重复文件标注待人工确认？
