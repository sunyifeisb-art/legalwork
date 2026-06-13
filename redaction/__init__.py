"""
LegalWork 文件脱敏功能模块 (Redaction)

从 LegalClaw 项目独立出来的文件脱敏能力包。
功能：敏感实体识别 → 脱敏策略 → 脱敏渲染输出

⚠️ 当前为独立复制版本，与原项目解耦。
   导入方式：from redaction.pipeline import RedactionPipeline
"""
from .detector import RedactionDetector, SensitiveEntity
from .policy import RedactionPolicyEngine, RedactionMode, RedactionMapping, RedactionRule
from .renderer import RedactionRenderer
from .renderer_pdf import PDFRedactionRenderer
from .pipeline import RedactionPipeline

__all__ = [
    "RedactionDetector",
    "SensitiveEntity",
    "RedactionPolicyEngine",
    "RedactionMode",
    "RedactionMapping",
    "RedactionRule",
    "RedactionRenderer",
    "PDFRedactionRenderer",
    "RedactionPipeline",
]
