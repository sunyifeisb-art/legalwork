"""
Document Pipeline - 文档处理流水线

整合 v0.1 文档处理全流程：
1. Intake Router: 判断文件类型、是否需 OCR、是否需版面解析
2. OCR Router / Parser: 执行 OCR 或结构化解析
3. LDIR Builder: 生成统一文档表示
4. Output: 保存到 Working Workspace

输出：
- working/{filename}.md         Markdown 文本
- working/{filename}.ldir.json  LDIR 结构化数据
- working/{filename}_ocr_report.json  OCR 置信度报告
"""

import shutil
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

from .intake.router import DocumentIntakeRouter, IntakeDecision
from .ocr.router import OCRRouter, OCROutput
from .parser.mineru_adapter import MinerUAdapter
from .ldir.builder import LDIRBuilder
from .semantic import SemanticLayer, EnhancedLDIR


class DocumentPipeline:
    """文档处理流水线"""

    def __init__(self, model_router=None):
        self.intake_router = DocumentIntakeRouter()
        self.ocr_router = OCRRouter()
        self.mineru = MinerUAdapter()
        self.ldir_builder = LDIRBuilder()
        self.semantic_layer = SemanticLayer(model_router)

    def process(self, file_path: str, matter_id: str,
                matter_dir: Path, context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        处理单个文件，输出到 Working Workspace。

        Returns:
            {
                "success": bool,
                "file_path": str,
                "outputs": {
                    "markdown": str,
                    "ldir": str,
                    "ocr_report": str,
                },
                "intake_decision": IntakeDecision,
                "ldir_doc_id": str,
            }
        """
        context = context or {}
        path = Path(file_path)
        if not path.exists():
            return {"success": False, "error": f"文件不存在: {file_path}"}

        # --- Step 1: Intake Router ---
        print(f"[Pipeline] Step 1/4: Intake 路由...")
        decision = self.intake_router.route(file_path, context)
        print(f"[Pipeline]   类型: {decision.detected_type.value}, OCR: {decision.ocr_required}, Profile: {decision.suggested_profile}")

        # --- Step 2: 复制到 Raw Vault ---
        raw_dir = matter_dir / "raw"
        raw_dir.mkdir(parents=True, exist_ok=True)
        raw_path = raw_dir / path.name
        if path.resolve() != raw_path.resolve():
            shutil.copy2(path, raw_path)

        # --- Step 3: OCR / Parser ---
        print(f"[Pipeline] Step 2/4: 文档解析...")
        ocr_result: Optional[OCROutput] = None
        parser_result = None

        if decision.ocr_required:
            ocr_result = self.ocr_router.process(
                str(raw_path),
                profile_name=decision.suggested_profile or "fast_local_ocr",
            )
            print(f"[Pipeline]   OCR 引擎: {ocr_result.engine}, 置信度: {ocr_result.confidence}")
        elif decision.detected_type.value == "pdf":
            parser_result = self.mineru.parse_pdf(str(raw_path))
            print(f"[Pipeline]   解析器: {parser_result.name if hasattr(parser_result, 'name') else 'unknown'}")
        elif decision.detected_type.value == "docx":
            # DOCX 使用 python-docx 提取文本
            try:
                from docx import Document
                doc = Document(str(raw_path))
                paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
                text = "\n".join(paragraphs)
                ocr_result = OCROutput(text=text, markdown=text, engine="python-docx", confidence=0.95)
                print("[Pipeline]   解析器: python-docx")
            except Exception as e:
                return {"success": False, "error": f"DOCX 解析失败: {e}"}
        else:
            # 纯文本直接读取
            text = raw_path.read_text(encoding="utf-8")
            ocr_result = OCROutput(text=text, markdown=text, engine="direct_read", confidence=1.0)

        # --- Step 4: LDIR Builder ---
        print(f"[Pipeline] Step 3/5: 生成 LDIR...")
        doc_id = f"{matter_id}_doc_{path.stem}"

        if ocr_result:
            ldir_doc = self.ldir_builder.from_ocr(
                ocr_result,
                source_file=str(raw_path),
                doc_id=doc_id,
            )
            markdown_text = ocr_result.markdown or ocr_result.text
        elif parser_result and parser_result.success:
            ldir_doc = self.ldir_builder.from_parser(
                parser_result,
                source_file=str(raw_path),
                doc_id=doc_id,
            )
            markdown_text = parser_result.markdown
        else:
            return {"success": False, "error": "解析失败，无法生成 LDIR"}

        # --- Step 5: Legal Semantic Layer ---
        print(f"[Pipeline] Step 4/5: 法律语义解析...")
        enhanced = self.semantic_layer.enrich(ldir_doc, use_llm=True)
        print(f"[Pipeline]   文档类型: {enhanced.doc_type}/{enhanced.doc_subtype}")
        print(f"[Pipeline]   语义块: {len(enhanced.chunks)}, 实体: {len(enhanced.entities)}")
        if enhanced.party_summary:
            parties = ", ".join([p["name"] for p in enhanced.party_summary[:3]])
            print(f"[Pipeline]   当事人: {parties}")

        # --- Step 6: 保存到 Working Workspace ---
        print(f"[Pipeline] Step 5/5: 保存到 Working...")
        working_dir = matter_dir / "working"
        working_dir.mkdir(parents=True, exist_ok=True)

        base_name = path.stem
        md_path = working_dir / f"{base_name}.md"
        ldir_path = working_dir / f"{base_name}.ldir.json"
        semantic_path = working_dir / f"{base_name}.semantic.json"
        report_path = working_dir / f"{base_name}_ocr_report.json"

        # 保存 Markdown
        md_path.write_text(markdown_text, encoding="utf-8")

        # 保存 LDIR
        self.ldir_builder.save(ldir_doc, str(ldir_path))

        # 保存语义解析结果
        semantic_path.write_text(
            json.dumps(enhanced.to_dict(), ensure_ascii=False, indent=2),
            encoding="utf-8"
        )

        # 保存 OCR 报告
        report = {
            "file_name": path.name,
            "doc_id": doc_id,
            "processed_at": datetime.now().isoformat(),
            "intake_decision": {
                "detected_type": decision.detected_type.value,
                "has_text_layer": decision.has_text_layer,
                "ocr_required": decision.ocr_required,
                "layout_required": decision.layout_required.value,
                "human_review_recommended": decision.human_review_recommended,
                "warnings": decision.warnings,
            },
            "ocr_result": {
                "engine": getattr(ocr_result, 'engine', 'unknown') if ocr_result else 'none',
                "confidence": getattr(ocr_result, 'confidence', 0.0) if ocr_result else 0.0,
                "processing_time_ms": getattr(ocr_result, 'processing_time_ms', 0) if ocr_result else 0,
            },
            "semantic": {
                "doc_type": enhanced.doc_type,
                "doc_subtype": enhanced.doc_subtype,
                "chunks_count": len(enhanced.chunks),
                "entities_count": len(enhanced.entities),
                "parties": enhanced.party_summary,
                "key_dates": enhanced.key_dates,
                "key_amounts": enhanced.key_amounts,
                "key_terms": enhanced.key_terms,
            },
            "page_count": len(ldir_doc.pages),
            "block_count": sum(len(p.blocks) for p in ldir_doc.pages),
        }
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

        print(f"[Pipeline] ✅ 完成: {path.name}")
        print(f"[Pipeline]    Markdown: {md_path.name}")
        print(f"[Pipeline]    LDIR: {ldir_path.name}")
        print(f"[Pipeline]    Semantic: {semantic_path.name}")
        print(f"[Pipeline]    Report: {report_path.name}")

        return {
            "success": True,
            "file_path": str(raw_path),
            "outputs": {
                "markdown": str(md_path),
                "ldir": str(ldir_path),
                "semantic": str(semantic_path),
                "ocr_report": str(report_path),
            },
            "intake_decision": decision,
            "ldir_doc_id": doc_id,
            "semantic": enhanced.to_dict(),
        }
