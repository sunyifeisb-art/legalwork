"""
Document Intake Router - 文档入口路由器

职责：
1. 判断文件类型
2. 判断是否已有文本层（原生PDF vs 扫描PDF）
3. 判断是否需版面解析
4. 判断是否需脱敏
5. 判断是否需人工复核

路由策略来自开发文档第4.2.2节。
"""

import mimetypes
from pathlib import Path
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from enum import Enum


class FileType(str, Enum):
    PDF = "pdf"
    SCANNED_PDF = "scanned_pdf"
    DOCX = "docx"
    XLSX = "xlsx"
    IMAGE = "image"
    EMAIL = "email"
    HTML = "html"
    TXT = "txt"
    ZIP = "zip"
    UNKNOWN = "unknown"


class LayoutNeed(str, Enum):
    REQUIRED = "required"
    RECOMMENDED = "recommended"
    NONE = "none"


@dataclass
class IntakeDecision:
    """Intake 路由决策结果"""
    file_path: str
    detected_type: FileType
    has_text_layer: bool = False
    ocr_required: bool = False
    layout_required: LayoutNeed = LayoutNeed.NONE
    redaction_required: bool = False
    human_review_recommended: bool = False
    warnings: List[str] = field(default_factory=list)
    suggested_profile: str = ""  # OCR/解析建议使用的 profile
    reason: str = ""


class DocumentIntakeRouter:
    """文档入口路由器"""

    def __init__(self, policy: Optional[Dict[str, Any]] = None):
        self.policy = policy or self._default_policy()

    def _default_policy(self) -> Dict[str, Any]:
        """默认 intake 策略"""
        return {
            "default_redaction": False,
            "default_workspace": "working",
            "ocr_required_when": ["scanned_pdf", "image", "pdf_without_text_layer"],
            "layout_required_when": [
                "contract", "judgment", "regulatory_document",
                "table_heavy_pdf", "evidence_bundle"
            ],
            "redaction_required_when": [
                "user_requests_redaction", "export_to_external_party",
                "publish_case_summary", "build_training_dataset"
            ],
            "warn_when": [
                "contains_id_number", "contains_phone_number",
                "contains_minor_info", "contains_medical_info",
                "contains_bank_account", "contains_trade_secret_keywords"
            ],
        }

    def route(self, file_path: str, context: Optional[Dict] = None) -> IntakeDecision:
        """
        对单个文件进行 intake 路由决策。

        file_path: 文件路径
        context: 可选上下文（用户是否要求脱敏、项目策略等）
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"文件不存在: {file_path}")

        context = context or {}
        detected_type = self._detect_file_type(path)
        has_text_layer = False
        ocr_required = False
        layout_required = LayoutNeed.NONE
        redaction_required = False
        warnings = []
        suggested_profile = ""

        # --- 1. 判断是否已有文本层 ---
        if detected_type == FileType.PDF:
            has_text_layer = self._check_pdf_text_layer(path)
            if not has_text_layer:
                detected_type = FileType.SCANNED_PDF
                ocr_required = True
                suggested_profile = "legal_pdf_parser"
            else:
                suggested_profile = "legal_pdf_parser"

        # --- 2. 判断是否需要 OCR ---
        if detected_type in (FileType.SCANNED_PDF, FileType.IMAGE):
            ocr_required = True
            if detected_type == FileType.IMAGE:
                suggested_profile = "fast_local_ocr"

        # --- 3. 判断是否需要版面解析 ---
        layout_required = self._check_layout_need(path, detected_type, context)
        if layout_required == LayoutNeed.REQUIRED:
            if not suggested_profile:
                suggested_profile = "legal_pdf_parser"

        # --- 4. 判断是否需要脱敏 ---
        redaction_required = self._check_redaction_need(context)

        # --- 5. 判断是否需要人工复核 ---
        human_review = self._check_human_review(path, detected_type, context, warnings)

        # --- 6. 生成原因说明 ---
        reason_parts = []
        if detected_type == FileType.SCANNED_PDF:
            reason_parts.append("扫描件/无文本层，需要 OCR")
        elif detected_type == FileType.IMAGE:
            reason_parts.append("图片格式，需要 OCR")
        if layout_required == LayoutNeed.REQUIRED:
            reason_parts.append("需要版面解析")
        if redaction_required:
            reason_parts.append("需要脱敏")

        return IntakeDecision(
            file_path=str(path),
            detected_type=detected_type,
            has_text_layer=has_text_layer,
            ocr_required=ocr_required,
            layout_required=layout_required,
            redaction_required=redaction_required,
            human_review_recommended=human_review,
            warnings=warnings,
            suggested_profile=suggested_profile or "default",
            reason="；".join(reason_parts) if reason_parts else "原生电子文档，直接解析",
        )

    def _detect_file_type(self, path: Path) -> FileType:
        """检测文件类型"""
        suffix = path.suffix.lower()
        mime, _ = mimetypes.guess_type(str(path))
        mime = mime or ""

        if suffix == ".pdf" or mime == "application/pdf":
            return FileType.PDF
        if suffix in (".docx", ".doc") or mime in (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ):
            return FileType.DOCX
        if suffix in (".xlsx", ".xls") or mime in (
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ):
            return FileType.XLSX
        if suffix in (".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".gif", ".webp") or mime.startswith("image/"):
            return FileType.IMAGE
        if suffix in (".eml", ".msg") or mime in ("message/rfc822",):
            return FileType.EMAIL
        if suffix in (".html", ".htm") or mime in ("text/html",):
            return FileType.HTML
        if suffix in (".txt", ".md", ".csv", ".json") or mime.startswith("text/"):
            return FileType.TXT
        if suffix in (".zip", ".rar", ".7z", ".tar", ".gz") or mime in (
            "application/zip", "application/x-rar-compressed"
        ):
            return FileType.ZIP

        return FileType.UNKNOWN

    def _check_pdf_text_layer(self, path: Path) -> bool:
        """
        检查 PDF 是否有文本层。
        v0.1 简化实现：尝试用 PyMuPDF 读取前3页文本。
        """
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(str(path))
            text_found = False
            for page_num in range(min(3, len(doc))):
                page = doc.load_page(page_num)
                text = page.get_text().strip()
                if text and len(text) > 20:  # 有有意义文本
                    text_found = True
                    break
            doc.close()
            return text_found
        except ImportError:
            # PyMuPDF 未安装，保守判断为扫描件
            return False
        except Exception:
            return False

    def _check_layout_need(self, path: Path, file_type: FileType,
                          context: Dict) -> LayoutNeed:
        """判断是否需要版面解析"""
        # 如果文件被标记为合同、判决书等，需要版面解析
        file_tags = context.get("file_tags", [])
        matter_type = context.get("matter_type", "")

        layout_triggers = ["contract", "judgment", "regulatory", "evidence"]
        for tag in file_tags:
            if any(trigger in tag.lower() for trigger in layout_triggers):
                return LayoutNeed.REQUIRED

        if file_type in (FileType.PDF, FileType.SCANNED_PDF):
            return LayoutNeed.RECOMMENDED

        return LayoutNeed.NONE

    def _check_redaction_need(self, context: Dict) -> bool:
        """判断是否需要脱敏"""
        # 用户显式要求
        if context.get("user_requests_redaction", False):
            return True
        # 外发场景
        if context.get("export_to_external_party", False):
            return True
        # 项目策略
        if context.get("matter_policy", {}).get("default_redaction", False):
            return True
        return False

    def _check_human_review(self, path: Path, file_type: FileType,
                           context: Dict, warnings: List[str]) -> bool:
        """判断是否需要人工复核"""
        review_needed = False

        # 扫描件建议人工复核
        if file_type == FileType.SCANNED_PDF:
            review_needed = True
            warnings.append("扫描件建议人工复核 OCR 质量")

        # 图片建议复核
        if file_type == FileType.IMAGE:
            review_needed = True
            warnings.append("图片证据建议人工复核内容")

        # 文件大小异常（太大或太小）
        size = path.stat().st_size
        if size > 100 * 1024 * 1024:  # 100MB
            review_needed = True
            warnings.append(f"文件过大 ({size / 1024 / 1024:.1f} MB)，可能影响处理速度")

        return review_needed

    def batch_route(self, file_paths: List[str],
                    context: Optional[Dict] = None) -> List[IntakeDecision]:
        """批量路由"""
        return [self.route(fp, context) for fp in file_paths]
