#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "knowledge-base" / "foreign-regulations-seed" / "foreign-regulations.json"
DEFAULT_OUTPUT_DIR = ROOT / "knowledge-base" / "foreign-regulations"
DEFAULT_MARKDOWN_DIR = ROOT / "knowledge-base" / "foreign-regulations-md"


SCHEMA = """
CREATE TABLE regulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_path TEXT NOT NULL UNIQUE,
    relative_path TEXT NOT NULL,
    top_level_bucket TEXT,
    file_name TEXT NOT NULL,
    title TEXT NOT NULL,
    standard_code TEXT,
    doc_category TEXT,
    effect_level TEXT,
    region TEXT,
    is_draft INTEGER NOT NULL DEFAULT 0,
    year_hint INTEGER,
    file_size INTEGER NOT NULL,
    sha256 TEXT NOT NULL,
    source_mtime TEXT NOT NULL,
    page_count INTEGER NOT NULL DEFAULT 0,
    extract_method TEXT NOT NULL,
    text_length INTEGER NOT NULL DEFAULT 0,
    raw_text TEXT,
    import_status TEXT NOT NULL,
    import_error TEXT,
    imported_at TEXT NOT NULL
);
CREATE INDEX idx_regulations_standard_code ON regulations(standard_code);
CREATE INDEX idx_regulations_doc_category ON regulations(doc_category);
CREATE INDEX idx_regulations_region ON regulations(region);
CREATE INDEX idx_regulations_sha256 ON regulations(sha256);
CREATE VIRTUAL TABLE regulation_fts USING fts5(
    regulation_id UNINDEXED,
    title,
    standard_code,
    doc_category,
    effect_level,
    region,
    raw_text
);
CREATE TABLE regulation_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regulation_id INTEGER NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    FOREIGN KEY(regulation_id) REFERENCES regulations(id) ON DELETE CASCADE
);
CREATE INDEX idx_regulation_chunks_regulation_id ON regulation_chunks(regulation_id);
CREATE TABLE foreign_regulation_sources (
    regulation_id INTEGER PRIMARY KEY,
    jurisdiction TEXT NOT NULL,
    jurisdiction_slug TEXT NOT NULL,
    authority TEXT,
    source_url TEXT,
    official_citation TEXT,
    topics_json TEXT NOT NULL,
    keywords_json TEXT NOT NULL,
    FOREIGN KEY(regulation_id) REFERENCES regulations(id) ON DELETE CASCADE
);
"""


JURISDICTION_NAMES: dict[str, str] = {
    "EU": "European Union / EEA",
    "UK": "United Kingdom",
    "US-CA": "United States - California",
    "US-CO": "United States - Colorado",
    "US-VA": "United States - Virginia",
    "US-CT": "United States - Connecticut",
    "US-UT": "United States - Utah",
    "US-TX": "United States - Texas",
    "CA": "Canada",
    "BR": "Brazil",
    "IN": "India",
    "SG": "Singapore",
    "JP": "Japan",
    "KR": "South Korea",
    "TH": "Thailand",
    "ID": "Indonesia",
    "AU": "Australia",
    "NZ": "New Zealand",
    "ZA": "South Africa",
    "CH": "Switzerland",
    "TR": "Türkiye",
    "AE": "United Arab Emirates",
    "SA": "Saudi Arabia",
    "AR": "Argentina",
    "MX": "Mexico",
    "NG": "Nigeria",
    "KE": "Kenya",
    "GLOBAL": "Global Reference",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build separated foreign regulation SQLite libraries.")
    parser.add_argument("--source", default=str(DEFAULT_SOURCE), help="Seed JSON path")
    parser.add_argument("--out-dir", default=str(DEFAULT_OUTPUT_DIR), help="Output directory for jurisdiction DBs")
    parser.add_argument("--markdown-dir", default=str(DEFAULT_MARKDOWN_DIR), help="Output directory for markdown exports")
    parser.add_argument("--rebuild", action="store_true", help="Remove existing generated outputs first")
    return parser.parse_args()


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = value.replace("ü", "u")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "jurisdiction"


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def build_raw_text(record: dict[str, Any]) -> str:
    obligations = "\n".join(f"- {item}" for item in record.get("key_obligations", []))
    keywords = ", ".join(record.get("keywords", []))
    topics = ", ".join(record.get("topics", []))
    return "\n".join(
        [
            f"# {record['title']}",
            "",
            f"Jurisdiction: {record['jurisdiction']}",
            f"Region: {record['region']}",
            f"Citation: {record.get('official_citation') or record.get('standard_code') or ''}",
            f"Authority: {record.get('authority', '')}",
            f"Source URL: {record.get('source_url', '')}",
            f"Topics: {topics}",
            f"Keywords: {keywords}",
            "",
            "## Summary",
            record.get("summary", ""),
            "",
            "## Key compliance obligations",
            obligations,
        ]
    ).strip()


def split_chunks(text: str, max_chars: int = 900) -> list[str]:
    paragraphs = [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]
    chunks: list[str] = []
    current = ""
    for paragraph in paragraphs:
        candidate = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(candidate) <= max_chars:
            current = candidate
            continue
        if current:
            chunks.append(current)
        current = paragraph
    if current:
        chunks.append(current)
    return chunks or [text]


def create_db(path: Path) -> sqlite3.Connection:
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path))
    conn.executescript(SCHEMA)
    return conn


def write_markdown(record: dict[str, Any], raw_text: str, markdown_dir: Path, jurisdiction_slug: str) -> str:
    relative = Path(jurisdiction_slug) / f"{record['id']}.md"
    output_path = markdown_dir / relative
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(raw_text + "\n", encoding="utf-8")
    return relative.as_posix()


def insert_record(
    conn: sqlite3.Connection,
    record: dict[str, Any],
    source_path: str,
    relative_path: str,
    jurisdiction_slug: str,
    raw_text: str,
    imported_at: str,
) -> None:
    digest = hashlib.sha256(raw_text.encode("utf-8")).hexdigest()
    file_name = Path(relative_path).name
    cursor = conn.execute(
        """
        INSERT INTO regulations (
            source_path, relative_path, top_level_bucket, file_name, title,
            standard_code, doc_category, effect_level, region, is_draft, year_hint,
            file_size, sha256, source_mtime, page_count, extract_method, text_length,
            raw_text, import_status, import_error, imported_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, 0, 'structured_seed', ?, ?, 'ok', NULL, ?)
        """,
        (
            source_path,
            relative_path,
            jurisdiction_slug,
            file_name,
            record["title"],
            record.get("standard_code", ""),
            record.get("doc_category", "foreign_privacy_law"),
            record.get("effect_level", ""),
            record.get("region", ""),
            record.get("year"),
            len(raw_text.encode("utf-8")),
            digest,
            imported_at,
            len(raw_text),
            raw_text,
            imported_at,
        ),
    )
    regulation_id = int(cursor.lastrowid)
    conn.execute(
        """
        INSERT INTO regulation_fts (
            regulation_id, title, standard_code, doc_category, effect_level, region, raw_text
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            regulation_id,
            record["title"],
            record.get("standard_code", ""),
            record.get("doc_category", "foreign_privacy_law"),
            record.get("effect_level", ""),
            record.get("region", ""),
            raw_text,
        ),
    )
    for chunk_index, chunk_text in enumerate(split_chunks(raw_text)):
        conn.execute(
            """
            INSERT INTO regulation_chunks (regulation_id, chunk_index, chunk_text)
            VALUES (?, ?, ?)
            """,
            (regulation_id, chunk_index, chunk_text),
        )
    conn.execute(
        """
        INSERT INTO foreign_regulation_sources (
            regulation_id, jurisdiction, jurisdiction_slug, authority, source_url,
            official_citation, topics_json, keywords_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            regulation_id,
            record.get("jurisdiction", ""),
            jurisdiction_slug,
            record.get("authority", ""),
            record.get("source_url", ""),
            record.get("official_citation", ""),
            json.dumps(record.get("topics", []), ensure_ascii=False),
            json.dumps(record.get("keywords", []), ensure_ascii=False),
        ),
    )


def main() -> int:
    args = parse_args()
    source_path = Path(args.source).expanduser().resolve()
    out_dir = Path(args.out_dir).expanduser().resolve()
    markdown_dir = Path(args.markdown_dir).expanduser().resolve()

    payload = json.loads(source_path.read_text(encoding="utf-8"))
    records = list(payload.get("records", []))
    for extra_path in sorted(source_path.parent.glob("foreign-regulations-*-records.json")):
        extra_payload = json.loads(extra_path.read_text(encoding="utf-8"))
        records.extend(extra_payload.get("records", []))
    if not isinstance(records, list) or not records:
        raise SystemExit(f"no records found in {source_path}")

    if args.rebuild:
        shutil.rmtree(out_dir, ignore_errors=True)
        shutil.rmtree(markdown_dir, ignore_errors=True)
    out_dir.mkdir(parents=True, exist_ok=True)
    markdown_dir.mkdir(parents=True, exist_ok=True)

    groups: dict[str, list[dict[str, Any]]] = {}
    for record in records:
        region = str(record.get("region") or "UNKNOWN")
        groups.setdefault(region, []).append(record)

    imported_at = now_iso()
    manifest = {
        "library_name": payload.get("library_name", "foreign-regulations"),
        "coverage_note": payload.get("coverage_note", ""),
        "built_at": imported_at,
        "jurisdiction_count": 0,
        "document_count": 0,
        "jurisdictions": [],
    }

    for region in sorted(groups):
        jurisdiction_slug = slugify(region)
        jurisdiction_name = JURISDICTION_NAMES.get(region, groups[region][0].get("jurisdiction", region))
        db_relative = Path(jurisdiction_slug) / "regulations.sqlite3"
        db_path = out_dir / db_relative
        if db_path.exists():
            db_path.unlink()
        conn = create_db(db_path)
        try:
            for record in sorted(groups[region], key=lambda item: item["id"]):
                raw_text = build_raw_text(record)
                markdown_relative = write_markdown(record, raw_text, markdown_dir, jurisdiction_slug)
                insert_record(
                    conn,
                    record,
                    f"{source_path.name}#{record['id']}",
                    markdown_relative,
                    jurisdiction_slug,
                    raw_text,
                    imported_at,
                )
            conn.commit()
            document_count = conn.execute("SELECT COUNT(*) FROM regulations").fetchone()[0]
            chunk_count = conn.execute("SELECT COUNT(*) FROM regulation_chunks").fetchone()[0]
        finally:
            conn.close()
        manifest["jurisdictions"].append(
            {
                "region": region,
                "slug": jurisdiction_slug,
                "name": jurisdiction_name,
                "db_path": db_relative.as_posix(),
                "index_path": f"{jurisdiction_slug}.json",
                "markdown_dir": jurisdiction_slug,
                "document_count": document_count,
                "chunk_count": chunk_count,
            }
        )
        manifest["document_count"] += document_count

    manifest["jurisdiction_count"] = len(manifest["jurisdictions"])
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(out_dir / "manifest.json")
    print(f"jurisdictions={manifest['jurisdiction_count']} documents={manifest['document_count']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
