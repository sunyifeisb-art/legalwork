#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = ROOT / 'config' / 'application-scenarios.json'


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def choose_scenarios(document_type: str, items: list[dict], config: dict) -> list[dict]:
    risk_points = {item.get('risk_point', '') for item in items}
    picked = []
    for scenario in config.get('scenarios', []):
        applies = document_type in scenario.get('applies_to', [])
        triggered = bool(risk_points.intersection(set(scenario.get('trigger_risk_points', []))))
        if applies or triggered:
            picked.append({
                'id': scenario['id'],
                'name': scenario['name'],
                'matched_by_document_type': applies,
                'matched_risk_points': [rp for rp in scenario.get('trigger_risk_points', []) if rp in risk_points],
                'deliverables': scenario.get('deliverables', []),
                'next_actions': scenario.get('next_actions', []),
            })
    return picked


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', required=True)
    parser.add_argument('--classification', required=True)
    parser.add_argument('--config', default=str(DEFAULT_CONFIG))
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    report = load_json(Path(args.report))
    classification = load_json(Path(args.classification))
    config = load_json(Path(args.config))

    scenarios = choose_scenarios(classification.get('type', 'unknown'), report.get('items', []), config)
    payload = {
        'document_type': classification.get('type', 'unknown'),
        'document_name': report.get('document_name', ''),
        'scenario_count': len(scenarios),
        'scenarios': scenarios,
    }
    Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
