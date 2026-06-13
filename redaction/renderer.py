"""
Redaction Renderer - 脱敏渲染器

职责：
1. 根据映射表将原始文本渲染为脱敏文本
2. 生成 redacted.md
3. 生成 mapping.enc（加密映射表）
4. 生成 redaction_report.html

渲染策略：
- 按位置替换（从后往前，避免偏移）
- 保留原文格式和结构
"""

import json
import base64
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime


def _get_attr(obj: Any, name: str, default: Any = None) -> Any:
    """安全获取对象属性（支持 dataclass 和 dict）"""
    if hasattr(obj, name):
        return getattr(obj, name)
    if isinstance(obj, dict):
        return obj.get(name, default)
    return default


class RedactionRenderer:
    """脱敏渲染器"""

    def __init__(self):
        pass

    def render_markdown(self, original_text: str,
                        mappings: List[Any]) -> str:
        """
        渲染脱敏后的 Markdown 文本。

        策略：从后往前替换，避免位置偏移。
        """
        if not mappings:
            return original_text

        # 按起始位置降序排序（从后往前替换）
        sorted_mappings = sorted(
            mappings,
            key=lambda m: _get_attr(m, 'start', 0),
            reverse=True
        )

        result = original_text
        for mapping in sorted_mappings:
            start = _get_attr(mapping, 'start', 0)
            end = _get_attr(mapping, 'end', 0)
            redacted = _get_attr(mapping, 'redacted', '[REDACTED]')

            # 检查边界
            if 0 <= start < end <= len(result):
                result = result[:start] + redacted + result[end:]

        return result

    def render_ldir(self, ldir_doc: Dict[str, Any],
                    mappings: List[Any]) -> Dict[str, Any]:
        """
        渲染脱敏后的 LDIR 文档。

        在 LDIR 的 block text 中替换敏感实体。
        """
        import copy
        redacted_ldir = copy.deepcopy(ldir_doc)

        # 构建按页/块分组的映射
        for page in redacted_ldir.get("pages", []):
            page_num = page.get("page_number", 1)
            page_mappings = [
                m for m in mappings
                if _get_attr(m, 'page_number') == page_num
            ]

            for block in page.get("blocks", []):
                block_text = block.get("text", "")
                # 找到属于该 block 的映射
                block_mappings = [
                    m for m in page_mappings
                    if _get_attr(m, 'start', 0) < len(block_text)
                ]
                if block_mappings:
                    block["text"] = self.render_markdown(block_text, block_mappings)
                    block["redacted"] = True

        return redacted_ldir

    def generate_mapping_file(self, mappings: List[Any],
                              output_path: str,
                              encrypt: bool = False,
                              cluster_table: Optional[List[Dict[str, Any]]] = None) -> str:
        """
        生成映射文件。

        encrypt: 是否加密（v0.2 简化：base64编码）
        cluster_table: 实体聚类表（用于还原同一主体的多称谓）
        """
        mapping_data = []
        for m in mappings:
            mapping_data.append({
                "entity_id": _get_attr(m, 'entity_id', ''),
                "entity_type": _get_attr(m, 'entity_type', ''),
                "original": _get_attr(m, 'original', ''),
                "redacted": _get_attr(m, 'redacted', ''),
                "mode": str(_get_attr(m, 'mode', '')),
                "page_number": _get_attr(m, 'page_number'),
                "confidence": _get_attr(m, 'confidence', 0.0),
                "cluster_id": _get_attr(m, 'cluster_id', None),
                "alias_of": _get_attr(m, 'alias_of', None),
            })

        payload = {
            "version": "0.3",
            "mappings": mapping_data,
            "clusters": cluster_table or [],
        }

        content = json.dumps(payload, ensure_ascii=False, indent=2)

        if encrypt:
            # v0.2 简化加密：base64
            content = base64.b64encode(content.encode("utf-8")).decode("utf-8")

        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return str(path)

    def generate_report(self, mappings: List[Any],
                        policy_name: str,
                        source_file: str,
                        output_path: str) -> str:
        """
        生成 HTML 脱敏报告。

        包含：
        - 脱敏统计
        - 实体列表
        - 需要人工复核的项
        - 策略说明
        """
        # 统计
        type_counts = {}
        review_items = []
        for m in mappings:
            etype = _get_attr(m, 'entity_type', 'unknown')
            type_counts[etype] = type_counts.get(etype, 0) + 1

            mode = _get_attr(m, 'mode', '')
            if str(mode) == "configurable":
                review_items.append(m)

        # 生成 HTML
        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>脱敏报告 - {Path(source_file).name}</title>
<style>
body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; line-height: 1.6; color: #333; }}
h1 {{ color: #1a1a1a; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; }}
h2 {{ color: #333; margin-top: 30px; }}
table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
th, td {{ border: 1px solid #ddd; padding: 10px; text-align: left; }}
th {{ background: #f5f5f5; font-weight: 600; }}
tr:nth-child(even) {{ background: #fafafa; }}
.stats {{ display: flex; gap: 20px; margin: 20px 0; }}
.stat-box {{ background: #f0f7ff; border-radius: 8px; padding: 15px 20px; min-width: 120px; }}
.stat-number {{ font-size: 28px; font-weight: bold; color: #0066cc; }}
.stat-label {{ font-size: 13px; color: #666; }}
.review {{ background: #fff8e6; border-left: 4px solid #f5a623; padding: 15px; margin: 20px 0; }}
.warning {{ background: #ffebeb; border-left: 4px solid #e53935; padding: 15px; margin: 20px 0; }}
.success {{ background: #e8f5e9; border-left: 4px solid #43a047; padding: 15px; margin: 20px 0; }}
</style>
</head>
<body>
<h1>脱敏报告</h1>
<p><strong>源文件：</strong>{source_file}</p>
<p><strong>处理时间：</strong>{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
<p><strong>策略：</strong>{policy_name}</p>

<div class="stats">
<div class="stat-box">
<div class="stat-number">{len(mappings)}</div>
<div class="stat-label">脱敏实体总数</div>
</div>
<div class="stat-box">
<div class="stat-number">{len(type_counts)}</div>
<div class="stat-label">实体类型数</div>
</div>
<div class="stat-box">
<div class="stat-number">{len(review_items)}</div>
<div class="stat-label">需人工复核</div>
</div>
</div>

<h2>脱敏统计</h2>
<table>
<tr><th>实体类型</th><th>数量</th></tr>
"""
        for etype, count in sorted(type_counts.items()):
            html += f"<tr><td>{etype}</td><td>{count}</td></tr>\n"

        html += """</table>

<h2>脱敏详情</h2>
<table>
<tr>
<th>实体ID</th>
<th>类型</th>
<th>原文</th>
<th>脱敏后</th>
<th>模式</th>
<th>页码</th>
<th>置信度</th>
</tr>
"""
        for m in mappings:
            eid = _get_attr(m, 'entity_id', '')
            etype = _get_attr(m, 'entity_type', '')
            orig = _get_attr(m, 'original', '')
            red = _get_attr(m, 'redacted', '')
            mode = str(_get_attr(m, 'mode', ''))
            page = _get_attr(m, 'page_number', '-')
            conf = _get_attr(m, 'confidence', 0.0)

            html += f"""<tr>
<td>{eid}</td>
<td>{etype}</td>
<td>{orig}</td>
<td>{red}</td>
<td>{mode}</td>
<td>{page}</td>
<td>{conf:.2f}</td>
</tr>
"""

        html += "</table>\n"

        if review_items:
            html += f"""
<div class="review">
<h3>⚠️ 需要人工复核的项（{len(review_items)} 个）</h3>
<p>以下实体类型被标记为 "configurable"，请根据具体场景决定脱敏方式：</p>
<ul>
"""
            for item in review_items:
                etype = _get_attr(item, 'entity_type', '')
                orig = _get_attr(item, 'original', '')
                html += f"<li>{etype}: {orig}</li>\n"
            html += "</ul></div>\n"
        else:
            html += """
<div class="success">
<h3>✅ 自动脱敏完成</h3>
<p>所有实体已按策略自动脱敏，未发现需要人工复核的项。</p>
</div>
"""

        html += """
</body>
</html>
"""

        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html, encoding="utf-8")
        return str(path)
