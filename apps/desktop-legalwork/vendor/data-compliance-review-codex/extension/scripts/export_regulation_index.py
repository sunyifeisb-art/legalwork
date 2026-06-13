#!/usr/bin/env python3
from __future__ import annotations

import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / "projects" / "data-compliance-ai-project-kit" / "knowledge-base" / "local-regulations.sqlite3"
OUTPUT_PATH = ROOT / "extension" / "public" / "assets" / "regulation-index.json"


def main() -> int:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row

    regulations = conn.execute(
        """
        SELECT id, title, standard_code, doc_category, effect_level, relative_path, is_draft
        FROM regulations
        WHERE import_status = 'ok'
        ORDER BY id
        """
    ).fetchall()

    chunks_by_regulation: dict[int, list[dict]] = {}
    for row in conn.execute(
        """
        SELECT regulation_id, chunk_index, chunk_text
        FROM regulation_chunks
        ORDER BY regulation_id, chunk_index
        """
    ):
        chunks_by_regulation.setdefault(row["regulation_id"], []).append(
            {
                "chunk_index": row["chunk_index"],
                "chunk_text": row["chunk_text"],
            }
        )

    payload = {
        "db_name": DB_PATH.name,
        "total_documents": len(regulations),
        "regulations": [
            {
                "id": row["id"],
                "title": row["title"],
                "standard_code": row["standard_code"] or "",
                "doc_category": row["doc_category"] or "",
                "effect_level": row["effect_level"] or "",
                "relative_path": row["relative_path"] or "",
                "is_draft": bool(row["is_draft"]),
                "chunks": chunks_by_regulation.get(row["id"], []),
            }
            for row in regulations
        ],
    }

    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    print(OUTPUT_PATH)
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
