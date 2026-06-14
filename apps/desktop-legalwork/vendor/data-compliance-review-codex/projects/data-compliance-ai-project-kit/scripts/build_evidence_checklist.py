#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = ROOT / 'config' / 'evidence-requirements.json'


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', required=True)
    parser.add_argument('--application-plan', required=True)
    parser.add_argument('--config', default=str(DEFAULT_CONFIG))
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    report = load_json(Path(args.report))
    application_plan = load_json(Path(args.application_plan))
    config = load_json(Path(args.config))
    requirement_map = {item['risk_point']: item for item in config.get('requirements', [])}

    checklist = []
    for item in report.get('items', []):
        risk_point = item.get('risk_point', '')
        requirement = requirement_map.get(risk_point, {})
        checklist.append({
            'risk_point': risk_point,
            'risk_level': item.get('risk_level', ''),
            'owner_hint': requirement.get('owner_hint', '待指派'),
            'evidence_items': requirement.get('evidence_items', ['待补充对应证据材料']),
            'why_needed': requirement.get('why_needed', '用于支撑风险判断、自动复核与整改留痕。'),
            'related_scenarios': [
                scenario['name']
                for scenario in application_plan.get('scenarios', [])
                if risk_point in scenario.get('matched_risk_points', [])
            ],
        })

    payload = {
        'document_name': report.get('document_name', ''),
        'checklist_count': len(checklist),
        'checklist': checklist,
    }
    Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
