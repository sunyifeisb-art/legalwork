#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


def render(data: dict) -> str:
    lines = ["# 风险审查报告", "", "## 基本信息"]
    lines.append(f"- 文本名称：{data.get('document_name', '')}")
    lines.append(f"- 审查范围：{data.get('review_scope', '')}")
    if data.get('document_type'):
        lines.append(f"- 文档类型：{data.get('document_type', '')}")
    lines.append(f"- 是否触发自动复核：{'是' if data.get('auto_recheck_triggered') else '否'}")
    if data.get('auto_recheck_summary'):
        lines.append(f"- 自动复核摘要：{data.get('auto_recheck_summary')}")
    if data.get('auto_recheck_stats'):
        stats = data.get('auto_recheck_stats', {})
        lines.append(f"- 自动复核统计：触发 {stats.get('triggered', 0)} 项，维持判断 {stats.get('maintained', 0)} 项，仍需补充支持信息 {stats.get('need_more_support', 0)} 项")
    lines.append("")

    stats = data.get('stats', {})
    if stats:
        lines.append("## 风险统计")
        lines.append(f"- 总项数：{stats.get('total', 0)}")
        lines.append(f"- 高风险：{stats.get('high_risk', 0)}")
        lines.append(f"- 中风险：{stats.get('medium_risk', 0)}")
        lines.append(f"- 建议优化：{stats.get('advisory', 0)}")
        lines.append("")

    lines.append("## 审查结论摘要")
    lines.append(data.get("summary", ""))
    lines.append("")

    if data.get('local_regulation_db'):
        regdb = data.get('local_regulation_db', {})
        lines.append("## 法规库增强")
        lines.append(f"- 状态：{'已启用' if regdb.get('enabled') else '未启用'}")
        lines.append(f"- 命中项数：{regdb.get('matched_items', 0)}")
        lines.append(f"- 未命中项数：{regdb.get('unmatched_items', 0)}")
        lines.append(f"- 可检索规范数：{regdb.get('searchable_documents', 0)} / {regdb.get('total_documents', 0)}")
        lines.append("")

    lines.append("## 风险明细")
    for item in data.get("items", []):
        lines.append(f"### [{item.get('risk_level', '')}] {item.get('risk_point', '')}")
        if item.get("theme_name"):
            lines.append(f"- 风险主题：{item.get('theme_name')}")
        lines.append(f"- 主法规依据：{item.get('legal_basis', '')}")
        if item.get("legal_basis_detail"):
            lines.append(f"- 条款要点：{item.get('legal_basis_detail')}")
        if item.get("source_sections"):
            refs = [
                f"{'第' + str(section.get('page')) + '页 · ' if section.get('page') else ''}{section.get('label', '')}（第{section.get('segment_index')}段）"
                for section in item.get("source_sections", [])
            ]
            lines.append(f"- 文档定位：{'；'.join(refs)}")
        if item.get("missing_groups"):
            lines.append(f"- 主要风险：该处未明确 {', '.join(item.get('missing_groups', []))}。")
        elif item.get("ambiguity_hits"):
            lines.append(f"- 主要风险：该处存在“{', '.join(item.get('ambiguity_hits', []))}”等模糊表述。")
        else:
            lines.append(f"- 主要风险：存在 {item.get('risk_point', '')}。")
        lines.append(f"- 修改建议：{item.get('suggestion', '')}")
        if item.get("rewritten_clause"):
            lines.append(f"- 改写后条款：{item.get('rewritten_clause')}")
        if item.get("source_sections"):
            lines.append("- 问题内容：")
            for section in item.get("source_sections", [])[:2]:
                lines.append(f"  - {section.get('snippet', '')}")
        elif item.get("evidence"):
            lines.append("- 问题内容：")
            for ev in item.get("evidence", [])[:2]:
                lines.append(f"  - {ev}")
        if item.get("supporting_regulations"):
            lines.append("- 补充规范索引：")
            for reg in item.get("supporting_regulations", []):
                title = reg.get("title", "")
                code = reg.get("standard_code", "")
                clause_refs = "、".join(reg.get("clause_references", []) or [])
                header = f"{code} {title}".strip()
                if clause_refs:
                    header += f"（{clause_refs}）"
                lines.append(f"  - {header}")
                if reg.get("snippet"):
                    lines.append(f"    - 片段：{reg.get('snippet')}")
        lines.append(f"- 自动复核：{item.get('auto_recheck_status', '未触发')} / {item.get('auto_recheck_decision', '未触发')}")
        lines.append("")
    if data.get('notes'):
        lines.append("")
        lines.append("## 过程备注")
        for note in data.get('notes', []):
            lines.append(f"- {note}")
    if data.get('risk_clusters'):
        lines.append("")
        lines.append("## 风险主题聚类")
        lines.append("| 风险主题 | 总项数 | 高风险 | 中风险 | 建议优化 | 关联风险点 |")
        lines.append("|---|---|---|---|---|---|")
        for cluster in data.get('risk_clusters', []):
            lines.append(
                "| {theme} | {count} | {high} | {medium} | {advisory} | {points} |".format(
                    theme=cluster.get('theme_name', ''),
                    count=cluster.get('item_count', 0),
                    high=cluster.get('high_risk_count', 0),
                    medium=cluster.get('medium_risk_count', 0),
                    advisory=cluster.get('advisory_count', 0),
                    points='；'.join(cluster.get('risk_points', [])),
                )
            )
    lines.append("")
    lines.append("## 说明")
    lines.append("- 本报告用于辅助合规审查，不替代律师或法务最终判断。")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_json")
    parser.add_argument("output_md")
    args = parser.parse_args()

    data = json.loads(Path(args.input_json).read_text(encoding="utf-8"))
    Path(args.output_md).write_text(render(data), encoding="utf-8")
    print(args.output_md)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
