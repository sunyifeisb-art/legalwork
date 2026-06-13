"""
Clause Hierarchy Parser - 条款层级解析

解析法律文档的条款层级结构：
  第一章 / 第一节（可选）
    └─ 第X条（Article）
         ├─ 第X款（Clause）
         │     └─ 第X项（Item）
         │           └─ 第X目（Subitem）
         └─ 第X款

输出：ClauseNode 树结构，支持：
- 按路径查找条款（如 "第5条第2款"）
- 提取特定条款的全文
- 比较两个文档的条款结构差异

适用场景：
- 合同条款定位与引用
- 法规条文检索
- 判决书中的"本院认为"段落定位
"""

import re
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class ClauseNode:
    """条款节点"""
    node_id: str
    type: str  # chapter / section / article / clause / item / subitem / root
    number: str  # 编号，如 "5"、"二"
    title: str  # 完整标题，如 "第五条"
    text: str  # 节点文本（不含子节点）
    full_text: str = ""  # 包含所有子节点的完整文本
    children: List["ClauseNode"] = field(default_factory=list)
    parent: Optional["ClauseNode"] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def path(self) -> str:
        """返回条款路径，如 '第5条第2款'"""
        parts = []
        node = self
        while node and node.type != "root":
            parts.append(node.title)
            node = node.parent
        return "".join(reversed(parts))

    def find_by_path(self, path: str) -> Optional["ClauseNode"]:
        """按路径查找子节点"""
        # 简化实现：按 title 匹配
        for child in self.children:
            if path.startswith(child.title):
                remaining = path[len(child.title):]
                if not remaining:
                    return child
                return child.find_by_path(remaining)
            # 模糊匹配
            if child.title in path or path in child.title:
                return child
        return None

    def find_by_type(self, node_type: str) -> List["ClauseNode"]:
        """查找所有指定类型的后代节点"""
        results = []
        for child in self.children:
            if child.type == node_type:
                results.append(child)
            results.extend(child.find_by_type(node_type))
        return results

    def to_dict(self) -> Dict[str, Any]:
        """序列化为字典"""
        return {
            "node_id": self.node_id,
            "type": self.type,
            "number": self.number,
            "title": self.title,
            "text": self.text,
            "full_text": self.full_text or self.text,
            "path": self.path(),
            "children": [c.to_dict() for c in self.children],
            "metadata": self.metadata,
        }


class ClauseHierarchyParser:
    """条款层级解析器"""

    # 章节模式
    CHAPTER_PATTERN = re.compile(r'(第[一二三四五六七八九十百千零\d]+章)\s*[,，、.．]?\s*(.*)')
    SECTION_PATTERN = re.compile(r'(第[一二三四五六七八九十百千零\d]+节)\s*[,，、.．]?\s*(.*)')

    # 条模式
    ARTICLE_PATTERN = re.compile(r'(第[一二三四五六七八九十百千零\d]+条)')

    # 款模式：中文括号数字 或 阿拉伯数字括号
    CLAUSE_PATTERN = re.compile(r'(?:^|\n)\s*（([一二三四五六七八九十\d]+)）')
    CLAUSE_PATTERN2 = re.compile(r'(?:^|\n)\s*\(([\d]+)\)')

    # 项模式
    ITEM_PATTERN = re.compile(r'(?:^|\n)\s*([\d]+)[\.、]\s*(?!\d)')

    # 目模式
    SUBITEM_PATTERN = re.compile(r'(?:^|\n)\s*\(([\d]+)\)\s*(?![\d])')

    def __init__(self):
        pass

    def parse(self, text: str) -> ClauseNode:
        """
        解析文本的条款层级结构。

        Args:
            text: 法律文档完整文本

        Returns:
            ClauseNode 树根节点
        """
        root = ClauseNode(
            node_id="root",
            type="root",
            number="",
            title="文档",
            text="",
        )

        if not text:
            return root

        # 先识别所有层级的分割点
        split_points = self._find_split_points(text)
        if not split_points:
            # 没有层级结构，作为单个根节点文本
            root.text = text
            root.full_text = text
            return root

        # 构建树
        self._build_tree(root, text, split_points)

        # 填充 full_text
        self._fill_full_text(root)

        return root

    def _find_split_points(self, text: str) -> List[Dict]:
        """找到所有层级分割点"""
        points = []

        # 章
        for m in self.CHAPTER_PATTERN.finditer(text):
            points.append({
                "pos": m.start(),
                "end": m.end(),
                "type": "chapter",
                "number": self._extract_number(m.group(1)),
                "title": m.group(1),
                "heading": m.group(2).strip(),
            })

        # 节
        for m in self.SECTION_PATTERN.finditer(text):
            points.append({
                "pos": m.start(),
                "end": m.end(),
                "type": "section",
                "number": self._extract_number(m.group(1)),
                "title": m.group(1),
                "heading": m.group(2).strip(),
            })

        # 条
        for m in self.ARTICLE_PATTERN.finditer(text):
            points.append({
                "pos": m.start(),
                "end": m.end(),
                "type": "article",
                "number": self._extract_number(m.group(1)),
                "title": m.group(1),
                "heading": "",
            })

        # 款
        for m in self.CLAUSE_PATTERN.finditer(text):
            points.append({
                "pos": m.start(),
                "end": m.end(),
                "type": "clause",
                "number": m.group(1),
                "title": f"（{m.group(1)}）",
                "heading": "",
            })
        for m in self.CLAUSE_PATTERN2.finditer(text):
            points.append({
                "pos": m.start(),
                "end": m.end(),
                "type": "clause",
                "number": m.group(1),
                "title": f"({m.group(1)})",
                "heading": "",
            })

        # 项
        for m in self.ITEM_PATTERN.finditer(text):
            if not self._is_date_like(m.group(0)):
                points.append({
                    "pos": m.start(),
                    "end": m.end(),
                    "type": "item",
                    "number": m.group(1),
                    "title": f"{m.group(1)}.",
                    "heading": "",
                })

        # 目
        for m in self.SUBITEM_PATTERN.finditer(text):
            points.append({
                "pos": m.start(),
                "end": m.end(),
                "type": "subitem",
                "number": m.group(1),
                "title": f"({m.group(1)})",
                "heading": "",
            })

        # 按位置排序
        points.sort(key=lambda x: x["pos"])

        # 去重：同一位置保留层级最高的
        filtered = []
        seen_pos = set()
        for p in points:
            # 允许小范围重叠（±5字符）
            is_dup = any(abs(p["pos"] - sp) < 5 for sp in seen_pos)
            if not is_dup:
                filtered.append(p)
                seen_pos.add(p["pos"])

        return filtered

    def _build_tree(self, root: ClauseNode, text: str,
                    split_points: List[Dict]) -> None:
        """根据分割点构建条款树"""
        if not split_points:
            root.text = text
            return

        # 层级映射
        level_map = {
            "chapter": 1, "section": 2, "article": 3,
            "clause": 4, "item": 5, "subitem": 6,
        }

        stack = [(0, root)]  # (level, node)

        for i, point in enumerate(split_points):
            level = level_map.get(point["type"], 99)
            end_pos = split_points[i + 1]["pos"] if i + 1 < len(split_points) else len(text)

            node_text = text[point["pos"]:end_pos].strip()
            # 分离标题和正文
            heading = point.get("heading", "")
            body = node_text[len(point["title"]):].strip() if node_text.startswith(point["title"]) else node_text
            body = body.lstrip("，,、.． \n")

            node = ClauseNode(
                node_id=f"{point['type']}_{point['number']}",
                type=point["type"],
                number=point["number"],
                title=point["title"],
                text=body,
                metadata={"heading": heading} if heading else {},
            )

            # 找到合适的父节点
            while stack and stack[-1][0] >= level:
                stack.pop()

            if stack:
                parent = stack[-1][1]
                node.parent = parent
                parent.children.append(node)
            else:
                node.parent = root
                root.children.append(node)

            stack.append((level, node))

    def _fill_full_text(self, node: ClauseNode) -> str:
        """递归填充 full_text"""
        if not node.children:
            node.full_text = node.text
            return node.text

        parts = [node.text] if node.text else []
        for child in node.children:
            child_text = self._fill_full_text(child)
            if child_text:
                parts.append(f"{child.title}{child_text}" if child.title else child_text)

        node.full_text = "\n".join(parts)
        return node.full_text

    def _extract_number(self, text: str) -> str:
        """从标题中提取数字"""
        match = re.search(r'[一二三四五六七八九十百千零\d]+', text)
        return match.group(0) if match else ""

    def _is_date_like(self, text: str) -> bool:
        """检查是否像日期"""
        return bool(re.search(r'\d{4}[\.年]', text))

    def compare_trees(self, tree_a: ClauseNode, tree_b: ClauseNode) -> Dict[str, Any]:
        """
        比较两棵条款树的差异。

        Returns:
            {
                "added": [ClauseNode],      # B 有但 A 没有
                "removed": [ClauseNode],    # A 有但 B 没有
                "modified": [{"a": ClauseNode, "b": ClauseNode, "diff": str}],
                "unchanged": [ClauseNode],
            }
        """
        result = {
            "added": [],
            "removed": [],
            "modified": [],
            "unchanged": [],
        }

        # 按 title 索引
        a_nodes = {c.title: c for c in tree_a.children}
        b_nodes = {c.title: c for c in tree_b.children}

        all_titles = set(a_nodes.keys()) | set(b_nodes.keys())

        for title in sorted(all_titles):
            if title in a_nodes and title not in b_nodes:
                result["removed"].append(a_nodes[title])
            elif title not in a_nodes and title in b_nodes:
                result["added"].append(b_nodes[title])
            else:
                # 都存在，比较文本
                a_node = a_nodes[title]
                b_node = b_nodes[title]
                if a_node.text.strip() != b_node.text.strip():
                    result["modified"].append({
                        "a": a_node,
                        "b": b_node,
                        "path": a_node.path(),
                    })
                else:
                    result["unchanged"].append(a_node)

                # 递归比较子节点
                child_diff = self.compare_trees(a_node, b_node)
                result["added"].extend(child_diff["added"])
                result["removed"].extend(child_diff["removed"])
                result["modified"].extend(child_diff["modified"])
                result["unchanged"].extend(child_diff["unchanged"])

        return result
