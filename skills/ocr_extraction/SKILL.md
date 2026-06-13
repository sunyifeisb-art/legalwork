---
id: ocr-extraction
name: ocr-extraction
description: OCR 文字提取：对扫描件、图片、无文字层的 PDF 进行 OCR，提取可编辑文本
version: 0.1.0
---

# OCR 文字提取

## 何时使用

当用户上传或引用的文档符合以下任一情况时，必须执行 OCR，不能直接判定“无法提取”：

- 扫描件 PDF（页面本质是图片，没有可选中文字）
- 照片、截图、扫描图片（PNG / JPG / TIFF / BMP / WebP）
- `read` 返回乱码、空白或提示是二进制的 PDF
- 用户提到“扫描件”“图片文字”“无法提取”“识别文字”等

## 提取流程

1. **先判断文件位置**：使用 `ls` 或 `bash` 确认文件在用户工作区中的绝对路径。
2. **优先调用 `ocr_agent.py`**：如果工作区根目录存在 `ocr_agent.py`，直接运行：
   ```bash
   python3 ocr_agent.py auto <file_path>
   ```
   - `auto` 模式会自动判断是否需要 OCR，并返回结构化 JSON（含 `text`、`markdown`、`confidence`、`pages_count` 等）。
   - 若需更高精度，可换用 `python3 ocr_agent.py scan <file_path> --profile complex_document`。
3. **没有 `ocr_agent.py` 时的兜底**：使用 `bash` 内联 Python 脚本：
   ```bash
   python3 << 'PYEOF'
   import fitz, pytesseract, io
   from PIL import Image
   path = "<file_path>"
   doc = fitz.open(path)
   texts = []
   for page in doc:
       pix = page.get_pixmap(dpi=300)
       img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
       text = pytesseract.image_to_string(img, lang="chi_sim+eng")
       if text.strip():
           texts.append(text)
   print("\n---PAGE_BREAK---\n".join(texts))
   PYEOF
   ```
4. **验证结果**：如果 OCR 结果为空或明显残缺，尝试：
   - 提高分辨率（`dpi=300` 或 `dpi=400`）
   - 指定中文语言包（`lang="chi_sim"`）
   - 对图片做预处理（灰度、二值化）
5. **继续后续任务**：提取到文本后，立即用于用户要求的分析、摘要、起草、审查等，不要把 OCR 结果甩给用户就结束。

## 输出格式

- 直接返回提取到的文本内容，并简要说明识别到的页数/置信度。
- 如果文本较长，先给出关键片段，再告诉用户完整内容已保存到哪个文件（可用 `write` 保存到工作区）。

## 注意事项

- **不要在没有尝试 OCR 的情况下告诉用户“这是扫描件，无法处理”**。
- 如果 OCR 依赖的 Python 包未安装，先尝试 `pip install pymupdf pytesseract pillow`。
- 如果系统中没有 Tesseract，使用 `brew install tesseract tesseract-lang`（macOS）或 `apt install tesseract-ocr tesseract-ocr-chi-sim`（Linux）。
