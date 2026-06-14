#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
import importlib.util


def load_preprocess_module():
    module_path = Path(__file__).resolve().parent / 'preprocess_input.py'
    spec = importlib.util.spec_from_file_location('preprocess_input_for_classify', module_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def load_config(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def read_input(file_path: str, text: str) -> str:
    if file_path:
        preprocess = load_preprocess_module()
        return preprocess.read_text(file_path, text)
    return text


def classify(text: str, config: dict) -> dict:
    lowered = text.lower()
    results = []
    for item in config['types']:
        hits = []
        score = 0
        keyword_weights = item.get('keyword_weights', {})
        for kw in item['keywords']:
            if kw.lower() in lowered:
                hits.append(kw)
                score += keyword_weights.get(kw, 1)
        results.append({
            'type': item['id'],
            'name': item['name'],
            'score': score,
            'matched_keywords': hits,
            'default_review_paths': item['default_review_paths'],
        })
    results.sort(key=lambda x: x['score'], reverse=True)
    best = results[0] if results else None
    if not best or best['score'] == 0:
        return {
            'type': config['fallback_type'],
            'name': '未知',
            'score': 0,
            'matched_keywords': [],
            'default_review_paths': config['fallback_review_paths'],
            'candidates': results,
        }
    return {**best, 'candidates': results}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', default='')
    parser.add_argument('--text', default='')
    parser.add_argument('--config', default=str(Path(__file__).resolve().parent.parent / 'config' / 'document-types.json'))
    args = parser.parse_args()

    text = read_input(args.file, args.text)
    if not text.strip():
        raise SystemExit('empty input')
    config = load_config(Path(args.config))
    result = classify(text, config)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
