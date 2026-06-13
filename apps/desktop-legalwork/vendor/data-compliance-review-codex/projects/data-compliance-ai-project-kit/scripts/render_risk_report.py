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
    lines.append("## 风险明细")
    lines.append("| 风险点 | 风险等级 | 法规依据 | 判断原因 | 修改建议 | 来源路径 | 自动复核状态 | 自动复核结论 |")
    lines.append("|---|---|---|---|---|---|---|---|")
    for item in data.get("items", []):
        lines.append(
            "| {risk_point} | {risk_level} | {legal_basis} | {reason} | {suggestion} | {path_ids} | {recheck} | {decision} |".format(
                risk_point=item.get("risk_point", ""),
                risk_level=item.get("risk_level", ""),
                legal_basis=item.get("legal_basis", ""),
                reason=item.get("reason", ""),
                suggestion=item.get("suggestion", ""),
                path_ids=", ".join(item.get("path_ids", [])),
                recheck=item.get("auto_recheck_status", "未触发"),
                decision=item.get("auto_recheck_decision", "未触发"),
            )
        )
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
