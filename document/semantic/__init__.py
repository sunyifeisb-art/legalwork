"""
Legal Semantic Layer - 法律语义解析层

在物理层（LDIR）之上构建法律语义理解能力：
1. SemanticChunker: 按条款/段落智能分块
2. LegalEntityExtractor: 提取当事人、金额、期限等法律实体
3. ClauseHierarchyParser: 解析条款层级结构（条→款→项→目）

集成方式:
    DocumentPipeline 在 LDIR Builder 之后调用 SemanticLayer.enrich(ldir_doc)
    输出 EnhancedLDIR，skills 可直接消费语义信息。
"""

from .chunker import SemanticChunker, Chunk
from .entity_extractor import LegalEntityExtractor, LegalEntity
from .clause_parser import ClauseHierarchyParser, ClauseNode
from .semantic_layer import SemanticLayer, EnhancedLDIR

__all__ = [
    "SemanticChunker",
    "Chunk",
    "LegalEntityExtractor",
    "LegalEntity",
    "ClauseHierarchyParser",
    "ClauseNode",
    "SemanticLayer",
    "EnhancedLDIR",
]
