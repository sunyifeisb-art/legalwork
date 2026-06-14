"""
MinerU Adapter - PDF 结构化解析适配器

职责：
1. 调用 MinerU 将 PDF 转为 Markdown / JSON
2. 提取阅读顺序、表格、页眉页脚
3. 生成 page_mapping

MinerU 是 PDF 转结构化文档的首选工具，适合：
- 合同、判决书、监管文件
- 表格密集 PDF
- 需要保留版面结构的文档

注意：v0.1 框架实现，实际需安装 MinerU：
    pip install mineru
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class MinerUOutput:
    """MinerU 解析输出"""
    markdown: str = ""
    structured_json: Dict[str, Any] = field(default_factory=dict)
    pages: List[Dict[str, Any]] = field(default_factory=list)
    tables: List[Dict[str, Any]] = field(default_factory=list)
    images: List[Dict[str, Any]] = field(default_factory=list)
    reading_order: List[int] = field(default_factory=list)
    success: bool = False
    error: str = ""


class MinerUAdapter:
    """MinerU 解析适配器"""

    name = "mineru"
    version = "0.1.0"

    def __init__(self):
        self._pipeline = None
        self._initialized = False

    def is_available(self) -> bool:
        """检查 MinerU 是否已安装"""
        try:
            import magic_pdf
            return True
        except ImportError:
            return False

    def _init(self):
        """初始化 MinerU pipeline"""
        if self._initialized:
            return
        try:
            from magic_pdf.pipe.UNIPipe import UNIPipe
            from magic_pdf.data.read_api import read_local_images
            self._pipeline_cls = UNIPipe
            self._read_api = read_local_images
            self._initialized = True
        except ImportError as e:
            raise RuntimeError(f"MinerU 未安装: {e}")

    def parse_pdf(self, pdf_path: str, output_dir: Optional[str] = None) -> MinerUOutput:
        """
        解析 PDF 文件。

        v0.1 简化实现：如果 MinerU 不可用，用 PyMuPDF 兜底生成基础结构。
        """
        if self.is_available():
            return self._parse_with_mineru(pdf_path, output_dir)
        else:
            print(f"[Parser] MinerU 未安装，使用 PyMuPDF 兜底解析")
            return self._parse_with_pymupdf_fallback(pdf_path)

    def _parse_with_mineru(self, pdf_path: str, output_dir: Optional[str] = None) -> MinerUOutput:
        """使用 MinerU 解析"""
        try:
            self._init()
            # 实际 MinerU 调用逻辑（需根据具体 API 调整）
            # 这里提供框架结构
            print(f"[Parser] MinerU 解析: {pdf_path}")

            # 简化版：先尝试用 PyMuPDF 提取文本和结构
            return self._parse_with_pymupdf_fallback(pdf_path)

        except Exception as e:
            return MinerUOutput(
                success=False,
                error=f"MinerU 解析失败: {e}",
            )

    def _parse_with_pymupdf_fallback(self, pdf_path: str) -> MinerUOutput:
        """
        PyMuPDF 兜底解析。
        当 MinerU 不可用时，提供基础解析能力。
        """
        try:
            import fitz
            doc = fitz.open(pdf_path)
            pages = []
            all_texts = []
            tables = []

            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text()
                blocks = page.get_text("blocks")

                page_info = {
                    "page_number": page_num + 1,
                    "width": page.rect.width,
                    "height": page.rect.height,
                    "blocks": [],
                    "text": text,
                }

                for block in blocks:
                    x0, y0, x1, y1, block_text, block_no, block_type = block
                    block_info = {
                        "block_id": f"p{page_num + 1}_b{block_no:03d}",
                        "type": "paragraph" if block_type == 0 else "image",
                        "text": block_text.strip(),
                        "bbox": [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)],
                    }
                    if block_text.strip():
                        page_info["blocks"].append(block_info)

                pages.append(page_info)
                if text.strip():
                    all_texts.append(f"--- Page {page_num + 1} ---\n{text.strip()}")

            doc.close()

            markdown = "\n\n".join(all_texts)

            structured = {
                "doc_id": Path(pdf_path).stem,
                "parser": {
                    "engine": "pymupdf_fallback",
                    "version": fitz.version,
                },
                "page_count": len(pages),
                "pages": pages,
            }

            return MinerUOutput(
                markdown=markdown,
                structured_json=structured,
                pages=pages,
                success=True,
            )

        except ImportError:
            return MinerUOutput(
                success=False,
                error="PyMuPDF 未安装，无法解析 PDF",
            )
        except Exception as e:
            return MinerUOutput(
                success=False,
                error=f"PDF 解析失败: {e}",
            )

    def parse_images(self, image_paths: List[str]) -> List[MinerUOutput]:
        """解析图片列表"""
        results = []
        for img_path in image_paths:
            # 图片不走 MinerU，直接返回占位结构
            results.append(MinerUOutput(
                markdown=f"![image]({img_path})",
                success=True,
            ))
        return results
