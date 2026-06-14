"""
LDIR Builder - Legal Document IR 生成器

职责：
1. 将 OCR 结果或解析结果统一转化为 LDIR（Legal Document IR）
2. 保存文本内容、页码、坐标、OCR 置信度
3. 支持回溯原始文件

LDIR v0.1 Schema（开发文档第5.2节）：
- doc_id, source_file, source_hash
- parser 信息（引擎、版本）
- pages[]: page_number, width, height, blocks[]
- blocks[]: block_id, type, text, bbox, confidence, spans[]
- spans[]: span_id, text, start, end, bbox, entity_type, confidence
"""

import json
import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class LDIRSpan:
    """LDIR 文本片段"""
    span_id: str
    text: str
    start: int
    end: int
    bbox: List[float] = field(default_factory=list)
    entity_type: str = ""
    confidence: float = 0.0


@dataclass
class LDIRBlock:
    """LDIR 内容块"""
    block_id: str
    type: str  # paragraph | heading | table | image | list | other
    text: str
    bbox: List[float] = field(default_factory=list)
    confidence: float = 0.0
    spans: List[LDIRSpan] = field(default_factory=list)


@dataclass
class LDIRPage:
    """LDIR 页面"""
    page_number: int
    width: float = 0.0
    height: float = 0.0
    blocks: List[LDIRBlock] = field(default_factory=list)


@dataclass
class LDIRDocument:
    """LDIR 文档"""
    doc_id: str
    source_file: str
    source_hash: str
    created_at: str
    parser: Dict[str, str] = field(default_factory=dict)
    pages: List[LDIRPage] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


class LDIRBuilder:
    """LDIR 生成器"""

    def __init__(self):
        pass

    def from_ocr(self, ocr_output: Any, source_file: str,
                 doc_id: str, parser_info: Optional[Dict] = None) -> LDIRDocument:
        """
        从 OCR 输出构建 LDIR。

        ocr_output: OCROutput 对象
        source_file: 原始文件路径
        doc_id: 文档 ID
        """
        source_hash = self._compute_hash(source_file)

        pages = []
        if hasattr(ocr_output, 'pages') and ocr_output.pages:
            for page_data in ocr_output.pages:
                page = self._build_page_from_ocr(page_data)
                pages.append(page)
        elif hasattr(ocr_output, 'blocks') and ocr_output.blocks:
            # 单页结果
            blocks = self._build_blocks_from_ocr(ocr_output.blocks)
            pages.append(LDIRPage(
                page_number=1,
                blocks=blocks,
            ))

        return LDIRDocument(
            doc_id=doc_id,
            source_file=source_file,
            source_hash=source_hash,
            created_at=datetime.now().isoformat(),
            parser=parser_info or {
                "engine": getattr(ocr_output, 'engine', 'unknown'),
                "version": getattr(ocr_output, 'engine_version', 'unknown'),
            },
            pages=pages,
            metadata={
                "ocr_confidence": getattr(ocr_output, 'confidence', 0.0),
                "processing_time_ms": getattr(ocr_output, 'processing_time_ms', 0),
            },
        )

    def from_parser(self, parser_output: Any, source_file: str,
                    doc_id: str, parser_info: Optional[Dict] = None) -> LDIRDocument:
        """
        从解析器输出构建 LDIR。

        parser_output: MinerUOutput 或类似对象
        """
        source_hash = self._compute_hash(source_file)
        pages = []

        if hasattr(parser_output, 'pages') and parser_output.pages:
            for page_data in parser_output.pages:
                page = self._build_page_from_parser(page_data)
                pages.append(page)

        return LDIRDocument(
            doc_id=doc_id,
            source_file=source_file,
            source_hash=source_hash,
            created_at=datetime.now().isoformat(),
            parser=parser_info or {
                "engine": getattr(parser_output, 'name', 'unknown'),
                "version": getattr(parser_output, 'version', 'unknown'),
            },
            pages=pages,
        )

    def to_json(self, ldir_doc: LDIRDocument) -> str:
        """序列化为 JSON 字符串"""
        data = {
            "doc_id": ldir_doc.doc_id,
            "source_file": ldir_doc.source_file,
            "source_hash": ldir_doc.source_hash,
            "created_at": ldir_doc.created_at,
            "parser": ldir_doc.parser,
            "pages": [
                {
                    "page_number": p.page_number,
                    "width": p.width,
                    "height": p.height,
                    "blocks": [
                        {
                            "block_id": b.block_id,
                            "type": b.type,
                            "text": b.text,
                            "bbox": b.bbox,
                            "confidence": b.confidence,
                            "spans": [
                                {
                                    "span_id": s.span_id,
                                    "text": s.text,
                                    "start": s.start,
                                    "end": s.end,
                                    "bbox": s.bbox,
                                    "entity_type": s.entity_type,
                                    "confidence": s.confidence,
                                }
                                for s in b.spans
                            ],
                        }
                        for b in p.blocks
                    ],
                }
                for p in ldir_doc.pages
            ],
            "metadata": ldir_doc.metadata,
        }
        return json.dumps(data, ensure_ascii=False, indent=2)

    def save(self, ldir_doc: LDIRDocument, output_path: str) -> str:
        """保存 LDIR 到文件"""
        json_str = self.to_json(ldir_doc)
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json_str, encoding="utf-8")
        return str(path)

    def _build_page_from_ocr(self, page_data: Dict) -> LDIRPage:
        """从 OCR page 数据构建 LDIRPage"""
        blocks = self._build_blocks_from_ocr(page_data.get("blocks", []))
        return LDIRPage(
            page_number=page_data.get("page_number", 1),
            width=page_data.get("width", 0),
            height=page_data.get("height", 0),
            blocks=blocks,
        )

    def _build_blocks_from_ocr(self, blocks_data: List[Dict]) -> List[LDIRBlock]:
        """从 OCR block 数据构建 LDIRBlock 列表"""
        blocks = []
        for i, block_data in enumerate(blocks_data):
            block = LDIRBlock(
                block_id=block_data.get("block_id", f"b{i:03d}"),
                type="paragraph",
                text=block_data.get("text", ""),
                bbox=block_data.get("bbox", []),
                confidence=block_data.get("confidence", 0.0),
            )
            blocks.append(block)
        return blocks

    def _build_page_from_parser(self, page_data: Dict) -> LDIRPage:
        """从解析器 page 数据构建 LDIRPage"""
        blocks = []
        for i, block_data in enumerate(page_data.get("blocks", [])):
            block = LDIRBlock(
                block_id=block_data.get("block_id", f"b{i:03d}"),
                type=block_data.get("type", "paragraph"),
                text=block_data.get("text", ""),
                bbox=block_data.get("bbox", []),
                confidence=block_data.get("confidence", 0.0),
            )
            blocks.append(block)

        return LDIRPage(
            page_number=page_data.get("page_number", 1),
            width=page_data.get("width", 0),
            height=page_data.get("height", 0),
            blocks=blocks,
        )

    def _compute_hash(self, file_path: str) -> str:
        """计算文件 SHA256"""
        h = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                h.update(chunk)
        return f"sha256:{h.hexdigest()}"
