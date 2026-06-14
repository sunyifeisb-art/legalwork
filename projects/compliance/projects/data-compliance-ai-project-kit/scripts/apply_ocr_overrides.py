#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sqlite3
from datetime import datetime
from pathlib import Path

import ingest_regulation_corpus as ingest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Apply OCR-recovered PDFs to failed regulation extraction records."
    )
    parser.add_argument("ocr_dir", help="Directory containing OCR-recovered PDFs")
    parser.add_argument(
        "--db",
        default="knowledge-base/local-regulations.sqlite3",
        help="SQLite database path",
    )
    parser.add_argument(
        "--markdown-dir",
        default="knowledge-base/regulations-md",
        help="Markdown export directory",
    )
    parser.add_argument(
        "--stats-json",
        default="knowledge-base/local-regulations-import-stats.json",
        help="Stats JSON to refresh after OCR recovery",
    )
    return parser.parse_args()


def write_markdown(
    markdown_root: Path,
    row: sqlite3.Row,
    ocr_path: Path,
    extract: ingest.ExtractResult,
    old_sha: str,
) -> Path:
    relative_path = Path(row["relative_path"])
    title = row["title"]
    new_sha = ingest.sha256_for_file(ocr_path)
    old_path = markdown_root / relative_path.parent / f"{ingest.slugify(title)}-{old_sha[:10]}.md"
    new_path = markdown_root / relative_path.parent / f"{ingest.slugify(title)}-{new_sha[:10]}.md"
    new_path.parent.mkdir(parents=True, exist_ok=True)

    frontmatter = [
        "---",
        f"法规名称: {title}",
        f"标准编号: {row['standard_code'] or ''}",
        f"文档分类: {row['doc_category'] or ''}",
        f"效力层级: {row['effect_level'] or ''}",
        f"地区: {row['region'] or ''}",
        f"是否征求意见稿: {'true' if row['is_draft'] else 'false'}",
        f"来源文件: {row['source_path']}",
        f"来源相对路径: {row['relative_path']}",
        f"来源分组: {row['top_level_bucket'] or ''}",
        f"OCR来源文件: {ocr_path}",
        f"页数: {extract.page_count}",
        f"提取方式: ocr:{extract.method}",
        f"文件SHA256: {new_sha}",
        f"源文件更新时间: {datetime.fromtimestamp(ocr_path.stat().st_mtime).isoformat(timespec='seconds')}",
        "---",
        "",
        f"# {title}",
        "",
        "## 说明",
        "",
        "本文件由 OCR 回填脚本从 OCR 版 PDF 提取，仅用于检索、审查和后续人工精修。",
        "",
        "## 正文",
        "",
        extract.text or "（OCR 回填后仍未成功提取到正文，请回看原始文件）",
        "",
    ]
    new_path.write_text("\n".join(frontmatter), encoding="utf-8")
    if old_path.exists() and old_path != new_path:
        old_path.unlink()
    return new_path


def refresh_indexes(conn: sqlite3.Connection, row: sqlite3.Row, extract: ingest.ExtractResult) -> None:
    regulation_id = row["id"]
    conn.execute("DELETE FROM regulation_fts WHERE regulation_id = ?", (regulation_id,))
    conn.execute(
        """
        INSERT INTO regulation_fts (
            regulation_id,
            title,
            standard_code,
            doc_category,
            effect_level,
            region,
            raw_text
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            regulation_id,
            row["title"],
            row["standard_code"] or "",
            row["doc_category"] or "",
            row["effect_level"] or "",
            row["region"] or "",
            extract.text,
        ),
    )
    conn.execute("DELETE FROM regulation_chunks_fts WHERE regulation_id = ?", (regulation_id,))
    conn.execute("DELETE FROM regulation_chunks WHERE regulation_id = ?", (regulation_id,))
    for chunk_index, chunk in enumerate(ingest.chunk_text(extract.text), start=1):
        cursor = conn.execute(
            """
            INSERT INTO regulation_chunks (regulation_id, chunk_index, chunk_text)
            VALUES (?, ?, ?)
            """,
            (regulation_id, chunk_index, chunk),
        )
        conn.execute(
            """
            INSERT INTO regulation_chunks_fts (regulation_id, chunk_id, chunk_text)
            VALUES (?, ?, ?)
            """,
            (regulation_id, cursor.lastrowid, chunk),
        )


def main() -> int:
    args = parse_args()
    ocr_dir = Path(args.ocr_dir).expanduser().resolve()
    db_path = Path(args.db).expanduser().resolve()
    markdown_dir = Path(args.markdown_dir).expanduser().resolve()
    stats_path = Path(args.stats_json).expanduser().resolve()

    if not ocr_dir.exists():
        raise SystemExit(f"ocr directory not found: {ocr_dir}")
    if not db_path.exists():
        raise SystemExit(f"database not found: {db_path}")

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    source_dir = Path("/")
    if stats_path.exists():
        try:
            existing = json.loads(stats_path.read_text(encoding="utf-8"))
            if existing.get("source_dir"):
                source_dir = Path(existing["source_dir"])
        except Exception:
            pass
    failed_rows = conn.execute(
        """
        SELECT *
        FROM regulations
        WHERE import_status = 'empty_text'
        ORDER BY relative_path
        """
    ).fetchall()
    failed_by_name = {Path(row["source_path"]).name: row for row in failed_rows}

    matched = 0
    recovered = 0
    skipped: list[str] = []

    for ocr_path in sorted(ocr_dir.glob("*.pdf")):
        row = failed_by_name.get(ocr_path.name)
        if row is None:
            skipped.append(f"未匹配失败记录: {ocr_path.name}")
            continue
        matched += 1
        extract = ingest.extract_pdf_text(ocr_path)
        if not extract.text:
            skipped.append(f"OCR后仍无正文: {ocr_path.name}")
            continue

        new_sha = ingest.sha256_for_file(ocr_path)
        conn.execute(
            """
            UPDATE regulations
            SET
                file_size = ?,
                sha256 = ?,
                source_mtime = ?,
                page_count = ?,
                extract_method = ?,
                text_length = ?,
                raw_text = ?,
                import_status = 'ok',
                import_error = ?,
                imported_at = ?
            WHERE id = ?
            """,
            (
                ocr_path.stat().st_size,
                new_sha,
                datetime.fromtimestamp(ocr_path.stat().st_mtime).isoformat(timespec="seconds"),
                extract.page_count,
                f"ocr:{extract.method}",
                len(extract.text),
                extract.text,
                f"Recovered from OCR file: {ocr_path}",
                datetime.now().isoformat(timespec="seconds"),
                row["id"],
            ),
        )
        refresh_indexes(conn, row, extract)
        write_markdown(markdown_dir, row, ocr_path, extract, row["sha256"])
        recovered += 1

    conn.commit()
    stats = ingest.build_stats(conn, source_dir, db_path)
    stats["markdown_dir"] = str(markdown_dir)
    stats["ocr_recovery"] = {
        "ocr_dir": str(ocr_dir),
        "matched_failed_records": matched,
        "recovered": recovered,
        "skipped": skipped,
    }
    stats_path.write_text(json.dumps(stats, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
