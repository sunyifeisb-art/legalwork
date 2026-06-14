# 文件预览与问题定位功能实施计划

## 一、Summary

为数据合规审查系统的结果页增加**文件预览与问题定位**功能：用户在查看审查结果时，可点击风险卡片上的"定位"按钮，右侧滑出文件预览侧边栏，高亮显示该风险点在原始文件中的具体位置（页码/段落）。

## 二、Current State Analysis

### 2.1 现有数据流
- 用户上传文件 → 保存到 `uploads/{task_id}_{filename}`
- 审查流程提取 `source_sections`，包含：`page`（页码）、`segment_index`（段落索引）、`label`（位置标签如"第3条"）、`snippet`（原文片段）
- 结果页 `result.html` 渲染风险卡片，展示风险点、原文摘录、风险分析、修改建议
- 当前问题位置信息仅在"原文摘录"区域弱展示，无交互功能

### 2.2 现有页面结构
- 左侧固定侧边栏（导航）
- 中间内容区（风险卡片等）
- 无右侧预览面板

### 2.3 技术栈
- 前端：纯 HTML + CSS + Vanilla JS（Jinja2 模板）
- 后端：Flask (Python)
- 文件类型：PDF、DOCX、DOC、TXT、代码文件

## 三、Proposed Changes

### 3.1 功能设计

#### 交互流程
```
用户查看审查结果
    │
    ├── 点击风险卡片上的"📍 定位"按钮
    │       │
    │       └── 右侧滑出预览侧边栏（宽度 50%，移动端全屏）
    │               │
    │               ├── 顶部：文件信息栏（文件名、页码导航、关闭按钮）
    │               │
    │               ├── 中部：PDF.js 渲染的文件内容
    │               │       └── 高亮显示问题所在段落/区域
    │               │
    │               └── 底部：风险摘要（风险点、等级、建议）
    │
    └── 点击"×"或遮罩层 → 侧边栏滑出关闭
```

#### 设计参考
- **Notion/Linear 风格**：深色侧边栏、圆角、微妙阴影
- **PDF 高亮**：琥珀色半透明背景 + 左侧竖线标记
- **动画**：300ms ease-out 滑入滑出

### 3.2 后端改动

#### 新增 API 路由

**1. 获取原始文件预览 URL**
```
GET /api/task/<task_id>/preview-file
Response: { "url": "/uploads/{task_id}_{filename}", "type": "pdf" }
```

**2. 获取问题位置映射数据**
```
GET /api/task/<task_id>/locations
Response: {
    "file_url": "/uploads/xxx.pdf",
    "file_type": "pdf",
    "locations": [
        {
            "risk_id": "risk-1",
            "risk_point": "第三方共享披露不足",
            "page": 3,
            "segment_index": 12,
            "label": "第3条",
            "snippet": "我们可能与第三方共享您的信息...",
            "bbox": null  // 后续可扩展为坐标
        }
    ]
}
```

#### 修改文件
- `app.py`：新增两个 API 路由

### 3.3 前端改动

#### 新增/修改文件

**1. `result.html` — 主要修改**

**A. 引入 PDF.js**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
</script>
```

**B. 风险卡片增加"定位"按钮**
```html
<!-- 在风险卡片 header 区域添加 -->
<button class="locate-btn" data-risk-id="{{ loop.index }}">
    <svg>...</svg>
    定位
</button>
```

**C. 右侧预览侧边栏 HTML 结构**
```html
<div id="previewSidebar" class="preview-sidebar">
    <div class="preview-sidebar-header">
        <div class="preview-file-info">
            <span class="preview-file-name">{{ task.original_filename }}</span>
            <span class="preview-page-indicator">第 <span id="currentPage">1</span> 页</span>
        </div>
        <button class="preview-close-btn">×</button>
    </div>
    <div class="preview-sidebar-body">
        <div id="pdfViewer" class="pdf-viewer"></div>
    </div>
    <div class="preview-sidebar-footer">
        <div class="preview-risk-summary">
            <span class="risk-badge">{{ risk_level }}</span>
            <p class="preview-risk-point">{{ risk_point }}</p>
        </div>
    </div>
</div>
<div id="previewOverlay" class="preview-overlay"></div>
```

**D. 新增 CSS（参考 Linear/Notion 风格）**
```css
.preview-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;
    background: #0f0f0f;
    color: #e0e0e0;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 40px rgba(0,0,0,0.3);
}
.preview-sidebar.open { transform: translateX(0); }

.preview-sidebar-header {
    padding: 16px 24px;
    border-bottom: 1px solid #222;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.preview-file-name {
    font-size: 14px;
    font-weight: 600;
    color: #f0f0f0;
}

.preview-page-indicator {
    font-size: 12px;
    color: #666;
    margin-left: 12px;
}

.preview-close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: #1a1a1a;
    color: #888;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
}
.preview-close-btn:hover { background: #2a2a2a; color: #fff; }

.preview-sidebar-body {
    flex: 1;
    overflow: auto;
    padding: 20px;
}

.pdf-viewer canvas {
    max-width: 100%;
    height: auto;
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

/* 高亮层 */
.pdf-highlight-layer {
    position: absolute;
    pointer-events: none;
}
.pdf-highlight {
    background: rgba(184, 104, 22, 0.25);
    border-left: 3px solid #b86816;
    border-radius: 0 4px 4px 0;
}

.preview-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
}
.preview-overlay.open { opacity: 1; visibility: visible; }

/* 定位按钮 */
.locate-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text-secondary);
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
}
.locate-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
}
```

**E. 新增 JavaScript**
```javascript
// PDF.js 渲染 + 高亮逻辑
class PDFPreviewManager {
    constructor() {
        this.sidebar = document.getElementById('previewSidebar');
        this.overlay = document.getElementById('previewOverlay');
        this.viewer = document.getElementById('pdfViewer');
        this.currentTaskId = '{{ task.id }}';
        this.locations = [];
        this.pdfDoc = null;
        this.currentPage = 1;
        this.scale = 1.5;
    }

    async init() {
        // 绑定定位按钮
        document.querySelectorAll('.locate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const riskId = btn.dataset.riskId;
                this.openPreview(riskId);
            });
        });

        // 绑定关闭
        document.querySelector('.preview-close-btn').addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());

        // 加载位置数据
        await this.loadLocations();
    }

    async loadLocations() {
        const res = await fetch(`/api/task/${this.currentTaskId}/locations`);
        const data = await res.json();
        this.locations = data.locations || [];
        this.fileUrl = data.file_url;
        this.fileType = data.file_type;
    }

    async openPreview(riskId) {
        const location = this.locations.find(l => l.risk_id === riskId);
        if (!location) return;

        this.sidebar.classList.add('open');
        this.overlay.classList.add('open');
        document.body.style.overflow = 'hidden';

        if (this.fileType === 'pdf') {
            await this.renderPDF(location.page, location.snippet);
        }

        // 更新底部风险摘要
        this.updateRiskSummary(location);
    }

    async renderPDF(targetPage, snippet) {
        if (!this.pdfDoc) {
            const loadingTask = pdfjsLib.getDocument(this.fileUrl);
            this.pdfDoc = await loadingTask.promise;
        }

        this.viewer.innerHTML = '';

        // 渲染目标页（及前后页作为上下文）
        const startPage = Math.max(1, targetPage - 1);
        const endPage = Math.min(this.pdfDoc.numPages, targetPage + 1);

        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: this.scale });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.marginBottom = '16px';

            await page.render({ canvasContext: ctx, viewport }).promise;

            // 如果是目标页，添加高亮层
            if (pageNum === targetPage && snippet) {
                const highlightLayer = await this.createHighlightLayer(page, viewport, snippet);
                const wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.appendChild(canvas);
                wrapper.appendChild(highlightLayer);
                this.viewer.appendChild(wrapper);
            } else {
                this.viewer.appendChild(canvas);
            }
        }

        // 滚动到目标页
        setTimeout(() => {
            const targetCanvas = this.viewer.children[targetPage - startPage];
            if (targetCanvas) targetCanvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    async createHighlightLayer(page, viewport, snippet) {
        const textContent = await page.getTextContent();
        const layer = document.createElement('div');
        layer.className = 'pdf-highlight-layer';
        layer.style.width = viewport.width + 'px';
        layer.style.height = viewport.height + 'px';

        // 查找 snippet 在文本中的位置
        const searchText = snippet.slice(0, 50); // 取前50字符匹配
        for (const item of textContent.items) {
            if (item.str.includes(searchText) || searchText.includes(item.str)) {
                const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
                const div = document.createElement('div');
                div.className = 'pdf-highlight';
                div.style.left = tx[4] + 'px';
                div.style.top = tx[5] + 'px';
                div.style.width = item.width * viewport.scale + 'px';
                div.style.height = item.height * viewport.scale + 'px';
                layer.appendChild(div);
            }
        }

        return layer;
    }

    updateRiskSummary(location) {
        const footer = document.querySelector('.preview-sidebar-footer');
        footer.innerHTML = `
            <div class="preview-risk-summary">
                <span class="risk-badge rb-${location.risk_level === '高风险' ? 'high' : location.risk_level === '中风险' ? 'medium' : 'low'}">${location.risk_level}</span>
                <p class="preview-risk-point">${location.risk_point}</p>
                <p class="preview-location-label">📍 ${location.label} · 第${location.page}页</p>
            </div>
        `;
    }

    close() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const previewManager = new PDFPreviewManager();
    previewManager.init();
});
```

### 3.4 移动端适配
```css
@media (max-width: 768px) {
    .preview-sidebar { width: 100%; }
    .preview-sidebar-header { padding: 12px 16px; }
    .preview-sidebar-body { padding: 12px; }
}
```

## 四、Assumptions & Decisions

| 决策 | 说明 |
|---|---|
| 使用 PDF.js CDN | 不增加本地依赖，加载快，功能完整 |
| 仅支持 PDF 预览（第一阶段） | DOCX 预览复杂度更高，后续可扩展 |
| 文本高亮基于 snippet 匹配 | 利用 PDF.js 的 getTextContent 查找文本位置，无需 OCR 坐标 |
| 侧边栏宽度 50% | 参考 Linear/Notion 的右侧面板比例 |
| 深色主题侧边栏 | 与当前页面的浅色主题形成对比，突出预览区域 |

## 五、Verification Steps

1. **功能验证**
   - [ ] 上传 PDF 文件进行审查
   - [ ] 在结果页点击风险卡片的"定位"按钮
   - [ ] 右侧滑出预览侧边栏
   - [ ] PDF 正确渲染，目标页高亮显示
   - [ ] 点击关闭按钮或遮罩层，侧边栏滑出
   - [ ] 移动端侧边栏全屏显示

2. **API 验证**
   - [ ] `GET /api/task/{task_id}/preview-file` 返回正确的文件 URL
   - [ ] `GET /api/task/{task_id}/locations` 返回完整的位置映射数据

3. **边界情况**
   - [ ] 无 source_sections 的风险点不显示定位按钮
   - [ ] 文件已删除时显示友好错误提示
   - [ ] 大文件（>50MB）预览性能测试

## 六、文件变更清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `data-compliance-web/app.py` | 修改 | 新增两个 API 路由 |
| `data-compliance-web/templates/result.html` | 修改 | 增加定位按钮、预览侧边栏、PDF.js 引入、JS 逻辑 |
| `data-compliance-web/static/css/result.css` | 可选 | 如 CSS 过多可拆出 |

## 七、后续扩展

1. **DOCX 预览**：使用 mammoth.js 将 DOCX 转为 HTML 预览
2. **坐标级高亮**：后端提取更精确的位置坐标（bbox）
3. **多页同时高亮**：一个风险点涉及多页时，全部高亮
4. **批注模式**：在预览侧边栏直接添加批注
