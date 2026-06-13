#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = ROOT / 'config' / 'privacy-remediation-pack.json'


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', required=True)
    parser.add_argument('--application-plan', required=True)
    parser.add_argument('--evidence-checklist', required=True)
    parser.add_argument('--config', default=str(DEFAULT_CONFIG))
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    application_plan = load_json(Path(args.application_plan))
    evidence = load_json(Path(args.evidence_checklist))
    config = load_json(Path(args.config))

    target = None
    for scenario in application_plan.get('scenarios', []):
        if scenario.get('id') == 'privacy_document_remediation':
            target = scenario
            break

    payload = {
        'enabled': bool(target),
        'scenario_name': target.get('name') if target else '隐私文档整改',
        'matched_risk_points': target.get('matched_risk_points', []) if target else [],
        'sections': [],
    }

    if not target:
        Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
        print(args.output)
        return 0

    evidence_map = {item['risk_point']: item for item in evidence.get('checklist', [])}

    for section in config['pack']['sections']:
        section_payload = {
            'id': section['id'],
            'title': section['title'],
            'required_items': section['required_items'],
            'related_evidence': [],
        }
        if section['id'] in {'clause_gap_inventory', 'rewrite_priorities'}:
            for rp in [
                '重要处理事项披露可能不充分',
                '合法性基础与必要性表达可能不足',
                '保存期限或删除机制表达可能不足'
            ]:
                if rp in evidence_map:
                    section_payload['related_evidence'].append(evidence_map[rp])
        elif section['id'] == 'third_party_alignment':
            for rp in ['第三方共享或委托处理披露可能不足', '文本前后关于数据处理边界的表述可能存在冲突']:
                if rp in evidence_map:
                    section_payload['related_evidence'].append(evidence_map[rp])
        elif section['id'] == 'redraft_outputs':
            section_payload['related_evidence'] = [evidence_map[rp] for rp in target.get('matched_risk_points', []) if rp in evidence_map]
        payload['sections'].append(section_payload)

    Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
