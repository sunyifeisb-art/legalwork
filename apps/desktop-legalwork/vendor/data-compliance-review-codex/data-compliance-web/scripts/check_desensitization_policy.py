#!/usr/bin/env python3
from __future__ import annotations

import csv
import json
import shutil
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE_ROOT = ROOT.parent
if str(WORKSPACE_ROOT) not in sys.path:
    sys.path.insert(0, str(WORKSPACE_ROOT))
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from desensitize_engine import Desensitizer, process_desensitization  # noqa: E402


PLACEHOLDER_TOKENS = {
    '[PHONE_NUMBER]',
    '[EMAIL_ADDRESS]',
    '[ID_CARD]',
    '[ID_NUMBER]',
    '[BANK_CARD]',
    '[IP_ADDRESS]',
    '[ADDRESS]',
}


def assert_no_placeholder(text: str, label: str) -> None:
    leaked = sorted(token for token in PLACEHOLDER_TOKENS if token in text)
    if leaked:
        raise AssertionError(f'{label} still uses type placeholders: {", ".join(leaked)}')


def assert_contains(text: str, expected: str, label: str) -> None:
    if expected not in text:
        raise AssertionError(f'{label} expected {expected!r}, got {text!r}')


def main() -> int:
    work = Path(tempfile.mkdtemp(prefix='complianceai-mask-policy-'))
    try:
        engine = Desensitizer()
        masked, _ = engine.sanitize_text(
            'phone 13812345678 email test@example.com id 110101199003074512 card 6222021234567890123 ip 192.168.1.9',
            surface='test',
            locator='inline',
        )
        assert_no_placeholder(masked, 'plain text')
        for expected in ['138****5678', 'te***@example.com', '110***********4512', '622202*********0123', '192.***.***.9']:
            assert_contains(masked, expected, 'plain text')

        csv_path = work / 'sample.csv'
        with csv_path.open('w', encoding='utf-8', newline='') as handle:
            writer = csv.writer(handle)
            writer.writerow(['phone', 'email'])
            writer.writerow(['13900001111', 'alpha@example.com'])
        csv_result = process_desensitization(
            task_id='csv',
            input_path=csv_path,
            document_name='csv',
            work_dir=work / 'csv-out',
        )
        csv_text = Path(csv_result['output_file']).read_text(encoding='utf-8-sig')
        assert_no_placeholder(csv_text, 'csv')
        assert_contains(csv_text, '139****1111', 'csv')
        assert_contains(csv_text, 'al***@example.com', 'csv')

        jsonl_path = work / 'sample.jsonl'
        jsonl_path.write_text(json.dumps({'phone': '13700002222'}, ensure_ascii=False) + '\n', encoding='utf-8')
        jsonl_result = process_desensitization(
            task_id='jsonl',
            input_path=jsonl_path,
            document_name='jsonl',
            work_dir=work / 'jsonl-out',
        )
        jsonl_text = Path(jsonl_result['output_file']).read_text(encoding='utf-8')
        assert_no_placeholder(jsonl_text, 'jsonl')
        assert_contains(jsonl_text, '137****2222', 'jsonl')

        report = json.loads(Path(jsonl_result['report_json']).read_text(encoding='utf-8'))
        if report.get('strategy') != 'format_preserving_mask':
            raise AssertionError(f'unexpected strategy: {report.get("strategy")}')

        print('OK')
        return 0
    finally:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == '__main__':
    raise SystemExit(main())
