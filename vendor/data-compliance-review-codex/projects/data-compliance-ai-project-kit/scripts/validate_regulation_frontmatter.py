#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED = ["法规名称", "发布机关", "效力层级", "适用场景", "相关条款", "来源", "更新时间"]


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        raise ValueError("missing frontmatter start")
    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        raise ValueError("missing frontmatter end")
    raw = parts[0].splitlines()[1:]
    data: dict[str, str] = {}
    for line in raw:
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        data[k.strip()] = v.strip()
    return data


def validate(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    data = parse_frontmatter(text)
    errors = []
    for key in REQUIRED:
        value = data.get(key, "")
        if not value:
            errors.append(f"{path}: missing {key}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="+")
    args = parser.parse_args()

    errors: list[str] = []
    for raw in args.paths:
        path = Path(raw)
        if path.is_dir():
            for md in path.rglob("*.md"):
                if "templates" in md.parts:
                    continue
                try:
                    errors.extend(validate(md))
                except Exception as e:
                    errors.append(f"{md}: {e}")
        else:
            try:
                errors.extend(validate(path))
            except Exception as e:
                errors.append(f"{path}: {e}")
    if errors:
        print("\n".join(errors))
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
