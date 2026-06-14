#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

TEMPLATE = """---
法规名称: {title}
发布机关: 
效力层级: 
适用场景: []
相关条款: []
来源: 
更新时间: 
版本备注: 
---

# {title}

## 摘要

## 正文
"""


def slugify(text: str) -> str:
    safe = []
    for ch in text.strip():
        if ch.isalnum() or ch in "-_":
            safe.append(ch)
        elif ch.isspace() or ch in "/|:：，,（）()":
            safe.append("-")
        else:
            safe.append(ch)
    name = "".join(safe).strip("-")
    while "--" in name:
        name = name.replace("--", "-")
    return name or "regulation"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("title")
    parser.add_argument("--out-dir", default=".")
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{slugify(args.title)}.md"
    path.write_text(TEMPLATE.format(title=args.title), encoding="utf-8")
    print(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
