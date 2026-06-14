#!/usr/bin/env python3
from __future__ import annotations
from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def merge_text(a: str, b: str) -> str:
    a = (a or '').strip()
    b = (b or '').strip()
    if not a:
        return b
    if not b or b == a:
        return a
    if b in a:
        return a
    return a + '；' + b


def merge_list(a: list | None, b: list | None) -> list:
    out = []
    seen = set()
    for value in (a or []) + (b or []):
        key = json.dumps(value, ensure_ascii=False, sort_keys=True) if isinstance(value, (dict, list)) else str(value)
        if key in seen:
            continue
        seen.add(key)
        out.append(value)
    return out


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--skeleton', required=True)
    parser.add_argument('--findings', nargs='+', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--priority-rules', default=str(Path(__file__).resolve().parent.parent / 'config' / 'priority-rules.json'))
    args = parser.parse_args()

    report = load_json(Path(args.skeleton))
    priority_rules = load_json(Path(args.priority_rules))
    risk_order = priority_rules['risk_order']

    merged = {}
    notes = list(report.get('notes', []))
    auto_recheck_triggered = report.get('auto_recheck_triggered', False)

    for raw in args.findings:
        finding = load_json(Path(raw))
        path_id = finding.get('path_id', 'unknown')
        if finding.get('summary'):
            notes.append(f'[{path_id}] {finding["summary"]}')
        for item in finding.get('items', []):
            key = item.get('risk_point', '').strip() or f'unknown:{path_id}'
            current = merged.get(key)
            if not current:
                merged[key] = {
                    **item,
                    'path_ids': [path_id],
                }
            else:
                if risk_order.get(item.get('risk_level', ''), 0) > risk_order.get(current.get('risk_level', ''), 0):
                    current['risk_level'] = item.get('risk_level', current.get('risk_level', ''))
                current['legal_basis'] = merge_text(current.get('legal_basis', ''), item.get('legal_basis', ''))
                current['reason'] = merge_text(current.get('reason', ''), item.get('reason', ''))
                current['suggestion'] = merge_text(current.get('suggestion', ''), item.get('suggestion', ''))
                current['auto_recheck'] = current.get('auto_recheck', False) or item.get('auto_recheck', False)
                current['evidence'] = merge_list(current.get('evidence'), item.get('evidence'))
                current['trigger_hits'] = merge_list(current.get('trigger_hits'), item.get('trigger_hits'))
                current['missing_groups'] = merge_list(current.get('missing_groups'), item.get('missing_groups'))
                current['ambiguity_hits'] = merge_list(current.get('ambiguity_hits'), item.get('ambiguity_hits'))
                current['source_sections'] = merge_list(current.get('source_sections'), item.get('source_sections'))
                if path_id not in current['path_ids']:
                    current['path_ids'].append(path_id)
            if item.get('auto_recheck'):
                auto_recheck_triggered = True

    merged_items = list(merged.values())
    merged_items.sort(key=lambda x: risk_order.get(x.get('risk_level', ''), 0), reverse=True)

    high = sum(1 for x in merged_items if x.get('risk_level') == '高风险')
    medium = sum(1 for x in merged_items if x.get('risk_level') == '中风险')
    low = sum(1 for x in merged_items if x.get('risk_level') == '建议优化')

    report['items'] = merged_items
    report['auto_recheck_triggered'] = auto_recheck_triggered
    report['summary'] = priority_rules['summary_template'].format(count=len(merged_items), high=high, medium=medium, low=low)
    report['notes'] = notes
    report['stats'] = {
        'total': len(merged_items),
        'high_risk': high,
        'medium_risk': medium,
        'advisory': low,
    }

    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
