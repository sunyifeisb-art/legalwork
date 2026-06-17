#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from render_risk_report import render


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('input_json')
    parser.add_argument('--out-dir', required=True)
    args = parser.parse_args()

    data = json.loads(Path(args.input_json).read_text(encoding='utf-8'))
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    base = Path(args.input_json).stem
    json_out = out_dir / f'{base}.json'
    md_out = out_dir / f'{base}.md'
    json_out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    md_out.write_text(render(data), encoding='utf-8')
    print(json.dumps({'json': str(json_out), 'markdown': str(md_out)}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
