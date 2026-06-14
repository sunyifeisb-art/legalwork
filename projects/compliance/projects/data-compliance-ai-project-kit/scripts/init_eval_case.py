#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

TEMPLATE = """# 评测样本：{name}

## 输入文本

## 期望风险点
- 

## 对应法规依据
- 

## 期望风险等级
- 

## 备注
- 
"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("name")
    parser.add_argument("--out-dir", default=".")
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{args.name}.md"
    path.write_text(TEMPLATE.format(name=args.name), encoding="utf-8")
    print(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
