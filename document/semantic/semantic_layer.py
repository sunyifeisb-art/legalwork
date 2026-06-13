"""
Semantic Layer - 法律语义层入口

整合 Chunker、EntityExtractor、ClauseParser，
为 LDIRDocument 添加语义信息，输出 EnhancedLDIR。

使用方式：
    from legalclaw.document.semantic import SemanticLayer
    layer = SemanticLayer(model_router=router)
    enhanced = layer.enrich(ldir_doc)
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

from document.ldir.builder import LDIRDocument
from .chunker import SemanticChunker, Chunk
from .entity_extractor import LegalEntityExtractor, LegalEntity
from .clause_parser import ClauseHierarchyParser, ClauseNode


@dataclass
class EnhancedLDIR:
    """增强版 LDIR，包含语义信息"""
    # 原始 LDIR
    ldir: LDIRDocument

    # 语义层信息
    chunks: List[Chunk] = field(default_factory=list)
    entities: List[LegalEntity] = field(default_factory=list)
    clause_tree: Optional[ClauseNode] = None

    # 聚合信息
    party_summary: List[Dict[str, Any]] = field(default_factory=list)
    key_dates: List[Dict[str, Any]] = field(default_factory=list)
    key_amounts: List[Dict[str, Any]] = field(default_factory=list)
    key_terms: List[Dict[str, Any]] = field(default_factory=list)

    # 文档类型推断
    doc_type: str = ""  # contract / judgment / statute / evidence / other
    doc_subtype: str = ""  # sales_contract / lease_contract / loan_contract / etc.

    def to_dict(self) -> Dict[str, Any]:
        """序列化为字典"""
        return {
            "doc_id": self.ldir.doc_id if self.ldir else "",
            "source_file": self.ldir.source_file if self.ldir else "",
            "doc_type": self.doc_type,
            "doc_subtype": self.doc_subtype,
            "semantic": {
                "chunks_count": len(self.chunks),
                "entities_count": len(self.entities),
                "has_clause_tree": self.clause_tree is not None,
            },
            "parties": self.party_summary,
            "key_dates": self.key_dates,
            "key_amounts": self.key_amounts,
            "key_terms": self.key_terms,
            "chunks": [
                {
                    "id": c.chunk_id,
                    "type": c.type,
                    "level": c.level,
                    "title": c.title,
                    "text": c.text[:500] + "..." if len(c.text) > 500 else c.text,
                }
                for c in self.chunks
            ],
            "entities": [
                {
                    "id": e.entity_id,
                    "type": e.type,
                    "text": e.text,
                    "normalized": e.normalized,
                    "unit": e.unit,
                    "confidence": e.confidence,
                    "attributes": e.attributes,
                }
                for e in self.entities
            ],
            "clause_tree": self.clause_tree.to_dict() if self.clause_tree else None,
        }


class SemanticLayer:
    """法律语义层"""

    def __init__(self, model_router: Optional[Any] = None):
        self.chunker = SemanticChunker()
        self.entity_extractor = LegalEntityExtractor(model_router)
        self.clause_parser = ClauseHierarchyParser()
        self.model_router = model_router

    def enrich(self, ldir_doc: LDIRDocument, use_llm: bool = True) -> EnhancedLDIR:
        """
        为 LDIRDocument 添加语义信息。

        Args:
            ldir_doc: 原始 LDIR 文档
            use_llm: 是否使用 LLM 增强

        Returns:
            EnhancedLDIR
        """
        # 1. 从 LDIR 中提取完整文本
        full_text = self._extract_text(ldir_doc)

        # 2. 智能分块
        source_blocks = []
        for page in ldir_doc.pages:
            for block in page.blocks:
                source_blocks.append({
                    "block_id": block.block_id,
                    "text": block.text,
                    "type": block.type,
                })

        chunks = self.chunker.chunk(full_text, source_blocks)

        # 3. 条款层级解析
        clause_tree = self.clause_parser.parse(full_text)

        # 4. 实体提取（按 chunk 提取，提高精度）
        entities = []
        for chunk in chunks:
            chunk_entities = self.entity_extractor.extract(
                chunk.text, chunk_id=chunk.chunk_id, use_llm=use_llm
            )
            entities.extend(chunk_entities)

        # 如果 chunk 提取为空，尝试全文提取
        if not entities and full_text:
            entities = self.entity_extractor.extract(
                full_text, chunk_id="full", use_llm=use_llm
            )

        # 5. 构建 EnhancedLDIR
        enhanced = EnhancedLDIR(
            ldir=ldir_doc,
            chunks=chunks,
            entities=entities,
            clause_tree=clause_tree,
        )

        # 6. 聚合摘要
        enhanced.party_summary = self._summarize_parties(entities)
        enhanced.key_dates = self._summarize_entities(entities, "date")
        enhanced.key_amounts = self._summarize_entities(entities, "amount")
        enhanced.key_terms = self._summarize_entities(entities, "term")

        # 7. 文档类型推断
        enhanced.doc_type, enhanced.doc_subtype = self._infer_doc_type(
            full_text, chunks, entities
        )

        return enhanced

    def _extract_text(self, ldir_doc: LDIRDocument) -> str:
        """从 LDIR 中提取完整文本"""
        parts = []
        for page in ldir_doc.pages:
            for block in page.blocks:
                if block.text:
                    parts.append(block.text)
        return "\n".join(parts)

    def _summarize_parties(self, entities: List[LegalEntity]) -> List[Dict[str, Any]]:
        """汇总当事人信息"""
        parties = [e for e in entities if e.type == "party"]
        summary = []
        seen = set()
        for p in parties:
            key = (p.normalized, p.attributes.get("role", ""))
            if key not in seen:
                seen.add(key)
                summary.append({
                    "name": p.normalized,
                    "role": p.attributes.get("role", ""),
                    "confidence": p.confidence,
                })
        return summary

    def _summarize_entities(self, entities: List[LegalEntity],
                            entity_type: str) -> List[Dict[str, Any]]:
        """汇总指定类型的实体"""
        filtered = [e for e in entities if e.type == entity_type]
        summary = []
        seen = set()
        for e in filtered:
            key = e.normalized
            if key not in seen:
                seen.add(key)
                item = {
                    "text": e.text,
                    "normalized": e.normalized,
                    "unit": e.unit,
                    "confidence": e.confidence,
                }
                # 添加类型信息
                type_key = f"{entity_type}_type"
                if type_key in e.attributes:
                    item["type"] = e.attributes[type_key]
                summary.append(item)
        return summary

    def _infer_doc_type(self, text: str, chunks: List[Chunk],
                        entities: List[LegalEntity]) -> tuple:
        """推断文档类型"""
        text_lower = text.lower()

        # 合同特征
        contract_keywords = ["合同", "协议", "甲方", "乙方", "签订", "盖章", "生效"]
        if any(kw in text_lower for kw in contract_keywords):
            # 进一步判断合同子类型
            if "买卖" in text_lower or "购销" in text_lower:
                return "contract", "sales_contract"
            elif "租赁" in text_lower:
                return "contract", "lease_contract"
            elif "借款" in text_lower or "贷款" in text_lower:
                return "contract", "loan_contract"
            elif "劳动" in text_lower:
                return "contract", "employment_contract"
            elif "股权转让" in text_lower or "股权" in text_lower:
                return "contract", "equity_transfer"
            elif "建设工程" in text_lower or "施工" in text_lower:
                return "contract", "construction_contract"
            elif "知识产权" in text_lower or "专利" in text_lower or "商标" in text_lower:
                return "contract", "ip_contract"
            elif "保密" in text_lower or "竞业" in text_lower:
                return "contract", "nda"
            return "contract", "general_contract"

        # 判决书特征
        judgment_keywords = ["判决书", "裁定书", "本院认为", "审判长", "书记员", "原告", "被告"]
        if any(kw in text_lower for kw in judgment_keywords):
            return "judgment", "civil_judgment"

        # 法规特征
        statute_keywords = ["法", "条例", "规定", "办法", "细则", "第.*条"]
        if "中华人民共和国" in text and "条" in text:
            return "statute", "national_law"

        # 起诉状/答辩状
        if "起诉状" in text or "诉讼请求" in text:
            return "pleading", "complaint"
        if "答辩状" in text or "答辩意见" in text:
            return "pleading", "answer"

        # 证据
        if "证据" in text and ("清单" in text or "目录" in text):
            return "evidence", "evidence_list"

        return "other", ""
