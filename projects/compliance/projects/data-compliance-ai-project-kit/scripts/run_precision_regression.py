#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

from run_rule_based_review import assess_one, highest_risk_level

ROOT = Path(__file__).resolve().parent.parent
CASES_PATH = ROOT / 'samples' / 'eval-set' / 'precision_cases.json'


def main() -> int:
    cases = json.loads(CASES_PATH.read_text(encoding='utf-8'))
    failures: list[str] = []
    outputs = []

    for case in cases:
        result = assess_one(case['path_id'], case['text'], [case['text']])
        level = highest_risk_level(result.get('items', []))
        outputs.append({
            'name': case['name'],
            'path_id': case['path_id'],
            'level': level,
            'summary': result.get('summary', ''),
        })
        if level not in case['expected_levels']:
            failures.append(
                f"{case['name']}: expected one of {case['expected_levels']}, got {level}"
            )

    payload = {
        'ok': not failures,
        'case_count': len(cases),
        'results': outputs,
        'failures': failures,
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 1 if failures else 0


if __name__ == '__main__':
    raise SystemExit(main())
