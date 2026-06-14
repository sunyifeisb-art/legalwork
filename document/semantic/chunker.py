"""
Semantic Chunker - 法律文档智能分块

问题：OCR/Parser 按物理块切分，一个条款可能被切成多个 block。
解决：基于法律文本特征（编号、缩进、关键词）重新组织为语义块。

分块策略：
- 按"条"切分：匹配"第[数字]条"、"第[中文数字]条"
- 按"款"切分：匹配"（[数字]）"、"([数字])"、"第[数字]款"
- 按"项"切分：匹配"[数字]."、"[数字]、"
- 兜底：按段落（空行分隔）

输出：Chunk 列表，每个 Chunk 包含完整条款文本 + 类型 + 层级信息
"""

import re
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class Chunk:
    """语义块"""
    chunk_id: str
    type: str  # article / clause / item / subitem / paragraph
    level: int  # 层级：1=条, 2=款, 3=项, 4=目, 0=未分类
    title: str  # 标题/编号，如"第五条"
    text: str   # 完整文本
    source_blocks: List[str] = field(default_factory=list)  # 来源 block_ids
    metadata: Dict[str, Any] = field(default_factory=dict)


class SemanticChunker:
    """法律文档智能分块器"""

    # 正则模式：条款编号
    ARTICLE_PATTERN = re.compile(
        r'(?:^|\n)\s*(第[一二三四五六七八九十百千零\d]+条)\s*[,，、.．]?'
    )
    CLAUSE_PATTERN = re.compile(
        r'(?:^|\n)\s*（([一二三四五六七八九十\d]+)）\s*'
    )
    CLAUSE_PATTERN2 = re.compile(
        r'(?:^|\n)\s*\(([\d]+)\)\s*'
    )
    ITEM_PATTERN = re.compile(
        r'(?:^|\n)\s*([\d]+)[\.、]\s*(?!\d)'
    )
    SUBITEM_PATTERN = re.compile(
        r'(?:^|\n)\s*\(([\d]+)\)\s*(?![\d])'
    )

    # 合同特有的结构化标记
    CONTRACT_TITLE_PATTERN = re.compile(
        r'(?:^|\n)\s*(甲方|乙方|丙方|丁方)[：:]\s*'
    )
    CONTRACT_SECTION_PATTERN = re.compile(
        r'(?:^|\n)\s*(一|二|三|四|五|六|七|八|九|十)[、.．]\s*'
    )

    def __init__(self):
        pass

    def chunk(self, text: str, source_blocks: Optional[List[Dict]] = None) -> List[Chunk]:
        """
        对文档文本进行智能分块。

        Args:
            text: 文档完整文本
            source_blocks: 可选，来源 block 信息

        Returns:
            Chunk 列表，按文档顺序排列
        """
        if not text or len(text.strip()) < 10:
            return []

        # 先尝试按法律条款结构分块
        chunks = self._chunk_by_hierarchy(text)

        # 如果没有识别出任何条款结构，退回到段落分块
        if not chunks:
            chunks = self._chunk_by_paragraph(text)

        # 关联来源 blocks
        if source_blocks:
            chunks = self._attach_source_blocks(chunks, source_blocks)

        return chunks

    def _chunk_by_hierarchy(self, text: str) -> List[Chunk]:
        """按法律层级结构分块"""
        chunks = []

        # 找到所有层级的分割点
        split_points = self._find_all_split_points(text)
        if not split_points:
            return []

        # 按位置排序
        split_points.sort(key=lambda x: x[0])

        # 生成 chunks
        for i, (pos, level, title, pattern_end) in enumerate(split_points):
            # 确定当前 chunk 的结束位置
            end_pos = split_points[i + 1][0] if i + 1 < len(split_points) else len(text)

            chunk_text = text[pos:end_pos].strip()
            if not chunk_text:
                continue

            chunk_type = {1: "article", 2: "clause", 3: "item", 4: "subitem"}.get(level, "paragraph")

            chunks.append(Chunk(
                chunk_id=f"c{len(chunks):04d}",
                type=chunk_type,
                level=level,
                title=title,
                text=chunk_text,
            ))

        return chunks

    def _find_all_split_points(self, text: str) -> List[tuple]:
        """
        找到文本中所有层级分割点。
        返回: [(position, level, title, pattern_end), ...]
        """
        points = []

        # 条 (level=1)
        for m in self.ARTICLE_PATTERN.finditer(text):
            points.append((m.start(), 1, m.group(1).strip(), m.end()))

        # 款 (level=2)
        for m in self.CLAUSE_PATTERN.finditer(text):
            points.append((m.start(), 2, f"（{m.group(1)}）", m.end()))
        for m in self.CLAUSE_PATTERN2.finditer(text):
            points.append((m.start(), 2, f"({m.group(1)})", m.end()))

        # 项 (level=3)
        for m in self.ITEM_PATTERN.finditer(text):
            # 避免把日期"2024."等误识别
            if not self._is_date_like(m.group(0)):
                points.append((m.start(), 3, f"{m.group(1)}.", m.end()))

        # 目 (level=4)
        for m in self.SUBITEM_PATTERN.finditer(text):
            points.append((m.start(), 4, f"({m.group(1)})", m.end()))

        # 合同甲方/乙方标记 (level=1，作为特殊 section)
        for m in self.CONTRACT_TITLE_PATTERN.finditer(text):
            points.append((m.start(), 1, m.group(1), m.end()))

        # 去重并排序
        seen = set()
        unique = []
        for p in sorted(points, key=lambda x: x[0]):
            key = (p[0], p[1])
            if key not in seen:
                seen.add(key)
                unique.append(p)

        return unique

    def _is_date_like(self, text: str) -> bool:
        """检查是否像日期格式，避免误识别"""
        # 简单启发：如果后面紧跟4位年份数字
        date_pattern = re.compile(r'\d{4}[\.年]')
        return bool(date_pattern.search(text))

    def _chunk_by_paragraph(self, text: str) -> List[Chunk]:
        """按段落分块（兜底策略）"""
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        chunks = []
        for i, para in enumerate(paragraphs):
            # 判断段落类型
            chunk_type = self._guess_paragraph_type(para)
            level = {"heading": 0, "paragraph": 0, "list_item": 3}.get(chunk_type, 0)

            chunks.append(Chunk(
                chunk_id=f"c{i:04d}",
                type=chunk_type,
                level=level,
                title=para[:30] + "..." if len(para) > 30 else para,
                text=para,
            ))
        return chunks

    def _guess_paragraph_type(self, text: str) -> str:
        """猜测段落类型"""
        text = text.strip()
        if not text:
            return "paragraph"

        # 标题特征
        if len(text) < 50 and not text.endswith('。') and not text.endswith('.'):
            if any(c in text for c in ['：', ':']) or text.endswith('条款'):
                return "heading"

        # 列表项特征
        if re.match(r'^\d+[\.、]', text):
            return "list_item"

        return "paragraph"

    def _attach_source_blocks(self, chunks: List[Chunk],
                              source_blocks: List[Dict]) -> List[Chunk]:
        """将 chunk 与原始 block 关联"""
        # 简化实现：通过文本包含关系匹配
        for chunk in chunks:
            matched = []
            for block in source_blocks:
                block_text = block.get("text", "")
                # 如果 block 文本在 chunk 中，或 chunk 文本在 block 中
                if block_text and (block_text in chunk.text or chunk.text in block_text):
                    block_id = block.get("block_id", "")
                    if block_id:
                        matched.append(block_id)
            chunk.source_blocks = matched
        return chunks

    def build_tree(self, chunks: List[Chunk]) -> List[Dict]:
        """
        将扁平的 chunk 列表构建为层级树。

        Returns:
            [{"chunk": Chunk, "children": [...]}, ...]
        """
        root = []
        stack = []  # (level, node)

        for chunk in chunks:
            node = {"chunk": chunk, "children": []}

            # 找到合适的父节点
            while stack and stack[-1][0] >= chunk.level:
                stack.pop()

            if stack:
                stack[-1][1]["children"].append(node)
            else:
                root.append(node)

            stack.append((chunk.level, node))

        return root
