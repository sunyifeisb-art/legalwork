#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# 对齐实际 MD 文件使用的字段（而非 schema 旧版定义）
REQUIRED = ["法规名称", "文档分类", "效力层级", "来源文件", "来源相对路径", "来源分组"]

# 推荐字段（按文档分类有则更好）
RECOMMENDED: dict[str, list[str]] = {
    "standard_or_guideline": ["标准编号"],
    "local_policy": ["地区"],
}


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
            errors.append(f"{path}: missing required field: {key}")

    doc_category = data.get("文档分类", "")
    for cat, fields in RECOMMENDED.items():
        if cat == doc_category:
            for field in fields:
                if not data.get(field, ""):
                    errors.append(f"{path}: recommended for {cat} but missing: {field}")

    # OCR 文件应该有 OCR来源文件
    if data.get("提取方式") == "ocr:pypdf" and not data.get("OCR来源文件"):
        errors.append(f"{path}: ocr:pypdf extraction but missing OCR来源文件")

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
