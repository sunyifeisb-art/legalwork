#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--classification', required=True)
    parser.add_argument('--planned-paths', required=True)
    parser.add_argument('--checkpoints-config', default=str(Path(__file__).resolve().parent.parent / 'config' / 'review-checkpoints.json'))
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    classification = load_json(Path(args.classification))
    planned = load_json(Path(args.planned_paths))
    checkpoints = load_json(Path(args.checkpoints_config))['paths']

    tasks = []
    for idx, path_item in enumerate(planned.get('selected_paths', []), start=1):
        pid = path_item['id']
        cp = checkpoints.get(pid, {}).get('checkpoints', [])
        tasks.append({
            'task_id': f'task_{idx:02d}',
            'path_id': pid,
            'path_name': path_item.get('name', pid),
            'goal': path_item.get('goal', ''),
            'focus': path_item.get('focus', []),
            'checkpoints': cp,
            'status': 'pending'
        })

    result = {
        'document_type': classification.get('type'),
        'document_name': classification.get('name'),
        'matched_keywords': classification.get('matched_keywords', []),
        'task_count': len(tasks),
        'tasks': tasks
    }
    Path(args.output).write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(args.output)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
