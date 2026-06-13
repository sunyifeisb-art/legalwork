#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path


def build_fts_query(query: str) -> str:
    terms = [term.strip().replace('"', '""') for term in query.split() if term.strip()]
    if not terms:
        return '""'
    return " ".join(f'"{term}"' for term in terms)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Search the local regulation SQLite database.")
    parser.add_argument("query", help="Title, standard code, or keyword query")
    parser.add_argument(
        "--db",
        default="knowledge-base/local-regulations.sqlite3",
        help="SQLite database path",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=10,
        help="Maximum number of rows to return",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    db_path = Path(args.db).expanduser().resolve()
    if not db_path.exists():
        raise SystemExit(f"database not found: {db_path}")

    conn = sqlite3.connect(str(db_path))
    rows = conn.execute(
        """
        SELECT
            r.id,
            r.title,
            r.standard_code,
            r.doc_category,
            r.effect_level,
            r.region,
            r.relative_path,
            snippet(
                regulation_fts,
                6,
                '[', ']',
                ' ... ',
                18
            ) AS snippet_text
        FROM regulation_fts
        JOIN regulations r ON r.id = regulation_fts.regulation_id
        WHERE regulation_fts MATCH ?
        LIMIT ?
        """,
        (build_fts_query(args.query), args.limit),
    ).fetchall()
    conn.close()

    if not rows:
        print("No results.")
        return 0

    for row in rows:
        print(f"[{row[0]}] {row[1]}")
        print(f"  标准号: {row[2] or '-'}")
        print(f"  分类: {row[3] or '-'} | 层级: {row[4] or '-'} | 区域: {row[5] or '-'}")
        print(f"  文件: {row[6]}")
        print(f"  摘要: {row[7] or '-'}")
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
