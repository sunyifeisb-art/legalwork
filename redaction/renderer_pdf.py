"""
Redaction PDF Renderer - 坐标级 PDF 脱敏渲染器

职责：
1. 读取 LDIR 中的敏感实体坐标
2. 在 PDF 页面上绘制黑色矩形覆盖敏感区域
3. 清理底层文本层（可选）
4. 清理 PDF metadata
5. 输出 redacted.pdf

技术实现：
- 使用 PyMuPDF (fitz) 在 PDF 上绘制涂黑矩形
- 支持逐页、逐 block、逐 span 级别的坐标涂黑
- 支持不可逆脱敏（删除底层文本）

开发文档第7.4节：Irreversible Redaction
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime


class PDFRedactionRenderer:
    """PDF 坐标级脱敏渲染器"""

    def __init__(self):
        self.redaction_color = (0, 0, 0)  # 黑色

    def redact(self, pdf_path: str, ldir_path: str,
               output_path: str,
               remove_text_layer: bool = False,
               clean_metadata: bool = True) -> Dict[str, Any]:
        """
        对 PDF 执行坐标级脱敏。

        Args:
            pdf_path: 原始 PDF 路径
            ldir_path: LDIR 文件路径（包含敏感实体坐标）
            output_path: 输出 redacted.pdf 路径
            remove_text_layer: 是否删除底层文本层
            clean_metadata: 是否清理 metadata

        Returns:
            {
                "success": bool,
                "output_path": str,
                "pages_redacted": int,
                "blocks_redacted": int,
                "spans_redacted": int,
            }
        """
        try:
            import fitz  # PyMuPDF
        except ImportError:
            return {"success": False, "error": "PyMuPDF 未安装"}

        # 读取 LDIR
        try:
            with open(ldir_path, "r", encoding="utf-8") as f:
                ldir_doc = json.load(f)
        except Exception as e:
            return {"success": False, "error": f"读取 LDIR 失败: {e}"}

        # 打开 PDF
        try:
            doc = fitz.open(pdf_path)
        except Exception as e:
            return {"success": False, "error": f"打开 PDF 失败: {e}"}

        pages_redacted = 0
        blocks_redacted = 0
        spans_redacted = 0

        # 遍历 LDIR 中的敏感实体坐标
        for page_data in ldir_doc.get("pages", []):
            page_num = page_data.get("page_number", 1)
            page_idx = page_num - 1

            if page_idx >= len(doc):
                continue

            page = doc.load_page(page_idx)
            page_modified = False

            # 遍历 blocks
            for block in page_data.get("blocks", []):
                if block.get("redacted"):
                    # 涂黑整个 block
                    bbox = block.get("bbox")
                    if bbox and len(bbox) == 4:
                        self._draw_redaction_rect(page, bbox)
                        blocks_redacted += 1
                        page_modified = True

                    # 如果要求删除文本层，删除 block 对应的文本
                    if remove_text_layer:
                        self._remove_text_in_area(page, bbox)

                # 遍历 spans（更细粒度）
                for span in block.get("spans", []):
                    if span.get("entity_type") or span.get("redacted"):
                        bbox = span.get("bbox")
                        if bbox and len(bbox) == 4:
                            self._draw_redaction_rect(page, bbox)
                            spans_redacted += 1
                            page_modified = True

                        if remove_text_layer:
                            self._remove_text_in_area(page, bbox)

            if page_modified:
                pages_redacted += 1

        # 清理 metadata
        if clean_metadata:
            self._clean_metadata(doc)

        # 保存
        try:
            doc.save(output_path, garbage=4, deflate=True)
            doc.close()
        except Exception as e:
            return {"success": False, "error": f"保存 PDF 失败: {e}"}

        return {
            "success": True,
            "output_path": output_path,
            "pages_redacted": pages_redacted,
            "blocks_redacted": blocks_redacted,
            "spans_redacted": spans_redacted,
        }

    def redact_from_mappings(self, pdf_path: str,
                             mappings: List[Dict[str, Any]],
                             output_path: str,
                             remove_text_layer: bool = False) -> Dict[str, Any]:
        """
        从映射表中的 bbox 信息对 PDF 涂黑。

        mappings 中每个条目应包含 page_number 和 bbox。
        """
        try:
            import fitz
        except ImportError:
            return {"success": False, "error": "PyMuPDF 未安装"}

        try:
            doc = fitz.open(pdf_path)
        except Exception as e:
            return {"success": False, "error": f"打开 PDF 失败: {e}"}

        pages_redacted = set()

        for mapping in mappings:
            page_num = mapping.get("page_number")
            bbox = mapping.get("bbox")

            if page_num is None or not bbox or len(bbox) != 4:
                continue

            page_idx = page_num - 1
            if page_idx < 0 or page_idx >= len(doc):
                continue

            page = doc.load_page(page_idx)
            self._draw_redaction_rect(page, bbox)
            pages_redacted.add(page_idx)

            if remove_text_layer:
                self._remove_text_in_area(page, bbox)

        # 清理 metadata
        self._clean_metadata(doc)

        try:
            doc.save(output_path, garbage=4, deflate=True)
            doc.close()
        except Exception as e:
            return {"success": False, "error": f"保存 PDF 失败: {e}"}

        return {
            "success": True,
            "output_path": output_path,
            "pages_redacted": len(pages_redacted),
        }

    def _draw_redaction_rect(self, page, bbox: List[float]) -> None:
        """在 PDF 页面上绘制涂黑矩形"""
        import fitz
        rect = fitz.Rect(bbox[0], bbox[1], bbox[2], bbox[3])
        # 绘制填充矩形（黑色）
        shape = page.new_shape()
        shape.draw_rect(rect)
        shape.finish(color=self.redaction_color, fill=self.redaction_color)
        shape.commit()

    def _remove_text_in_area(self, page, bbox: List[float]) -> None:
        """删除指定区域内的文本层"""
        import fitz
        rect = fitz.Rect(bbox[0], bbox[1], bbox[2], bbox[3])
        # 添加 redaction annotation，永久删除底层文本
        page.add_redact_annot(rect, fill=(0, 0, 0))
        page.apply_redactions()

    def _clean_metadata(self, doc) -> None:
        """清理 PDF metadata"""
        # 清空敏感 metadata
        doc.set_metadata({
            "producer": "LegalClaw Redaction",
            "creationDate": datetime.now().strftime("D:%Y%m%d%H%M%S"),
            "modDate": datetime.now().strftime("D:%Y%m%d%H%M%S"),
        })
