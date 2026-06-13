#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--document-name', required=True)
    parser.add_argument('--review-scope', default='数据合规相关文件审查')
    parser.add_argument('--doc-type', default='unknown')
    parser.add_argument('--paths-file', default='')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    selected_paths = []
    if args.paths_file:
        payload = json.loads(Path(args.paths_file).read_text(encoding='utf-8'))
        for item in payload.get('selected_paths', []):
            selected_paths.append(item.get('id'))

    skeleton = {
        'document_name': args.document_name,
        'review_scope': args.review_scope,
        'document_type': args.doc_type,
        'selected_review_paths': selected_paths,
        'summary': '',
        'auto_recheck_triggered': False,
        'items': [],
        'notes': [
            '本报告用于辅助合规审查，不替代律师或法务最终判断。',
            '当命中高风险、依据不足或判断存在不确定性时，系统会自动触发二次复核。'
        ]
    }
    Path(args.output).write_text(json.dumps(skeleton, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
