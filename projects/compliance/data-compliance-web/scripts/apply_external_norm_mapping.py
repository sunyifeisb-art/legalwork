#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

PLACEHOLDER = '待外部规范数据库补充具体依据'


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', required=True)
    parser.add_argument('--mapping', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    report = load_json(Path(args.report))
    mapping = load_json(Path(args.mapping))

    mapping_items = mapping.get('mappings', [])
    for item in report.get('items', []):
        for ref in mapping_items:
            same_risk = ref.get('risk_point') == item.get('risk_point')
            same_path = (not ref.get('path_id')) or (ref.get('path_id') in item.get('path_ids', []))
            if same_risk and same_path:
                if item.get('legal_basis') == PLACEHOLDER or not item.get('legal_basis'):
                    item['legal_basis'] = ref.get('legal_basis', item.get('legal_basis', ''))
                note = ref.get('reference_note', '').strip()
                if note:
                    item['legal_basis_detail'] = note
                    item['primary_legal_source'] = {
                        'title': ref.get('legal_basis', item.get('legal_basis', '')),
                        'detail': note,
                        'source_id': ref.get('source_id', ''),
                    }
                if ref.get('source_id'):
                    item.setdefault('sources', [])
                    if ref['source_id'] not in item['sources']:
                        item['sources'].append(ref['source_id'])

    Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
