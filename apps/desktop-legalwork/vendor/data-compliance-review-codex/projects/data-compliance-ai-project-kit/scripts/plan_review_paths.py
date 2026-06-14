#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def plan(doc_type_result: dict, paths_config: dict) -> dict:
    path_map = {p['id']: p for p in paths_config['paths']}
    selected = []
    for pid in doc_type_result.get('default_review_paths', []):
        if pid in path_map:
            selected.append(path_map[pid])
    return {
        'document_type': doc_type_result.get('type'),
        'document_name': doc_type_result.get('name'),
        'selected_paths': selected,
        'reason': f"根据文档类型 {doc_type_result.get('type')} 选择默认审查路径",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--classification', required=True, help='classify_document_type.py 输出的 json 文件')
    parser.add_argument('--paths-config', default=str(Path(__file__).resolve().parent.parent / 'config' / 'review-paths.json'))
    args = parser.parse_args()

    doc_type_result = load_json(Path(args.classification))
    paths_config = load_json(Path(args.paths_config))
    result = plan(doc_type_result, paths_config)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
