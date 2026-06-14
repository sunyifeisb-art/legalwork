#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sqlite3
import subprocess
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "knowledge-base" / "foreign-regulations-seed" / "foreign-regulations-fulltext-sources.json"
DEFAULT_LIBRARY_DIR = ROOT / "knowledge-base" / "foreign-regulations"
DEFAULT_DOC_DIR = ROOT / "knowledge-base" / "foreign-regulations-source-docs"
DEFAULT_MARKDOWN_DIR = ROOT / "knowledge-base" / "foreign-regulations-md"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Download and ingest official foreign regulation full texts.")
    parser.add_argument("--source", default=str(DEFAULT_SOURCE), help="Full-text source JSON path")
    parser.add_argument("--library-dir", default=str(DEFAULT_LIBRARY_DIR), help="Jurisdiction DB library directory")
    parser.add_argument("--doc-dir", default=str(DEFAULT_DOC_DIR), help="Downloaded source document directory")
    parser.add_argument("--markdown-dir", default=str(DEFAULT_MARKDOWN_DIR), help="Markdown export directory")
    parser.add_argument("--refresh-downloads", action="store_true", help="Download sources again even when cached files exist")
    return parser.parse_args()


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalize_text(text: str) -> str:
    text = text.replace("\x00", " ").replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    lines: list[str] = []
    blank_count = 0
    for line in text.split("\n"):
        cleaned = line.strip()
        if not cleaned:
            blank_count += 1
            if blank_count <= 1:
                lines.append("")
            continue
        blank_count = 0
        lines.append(cleaned)
    return "\n".join(lines).strip()


def download_source(source: dict[str, Any], doc_dir: Path, refresh_downloads: bool) -> Path:
    suffix = ".pdf" if source.get("format") == "pdf" else ".bin"
    output_path = doc_dir / source["jurisdiction_slug"] / f"{source['id']}{suffix}"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists() and not refresh_downloads:
        return output_path
    request = urllib.request.Request(
        source["source_url"],
        headers={
            "User-Agent": "data-compliance-review-codex/0.1 official-source-import",
            "Accept": "application/pdf,text/html,*/*",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        data = response.read()
    if len(data) < 2048:
        raise RuntimeError(f"download too small for {source['id']}: {len(data)} bytes")
    output_path.write_bytes(data)
    return output_path


def extract_pdf_text(path: Path) -> tuple[str, str]:
    run = subprocess.run(
        ["pdftotext", "-layout", "-enc", "UTF-8", str(path), "-"],
        capture_output=True,
        text=True,
        check=False,
    )
    if run.returncode != 0:
        raise RuntimeError(run.stderr.strip() or f"pdftotext exited with {run.returncode}")
    text = normalize_text(run.stdout)
    if not text:
        raise RuntimeError(f"empty extracted text: {path}")
    return text, "pdftotext"


ARTICLE_PATTERNS = [
    re.compile(r"(?m)^(Article\s+\d+[A-Za-z]?(?:\s*[-–:]\s*.*)?)$"),
    re.compile(r"(?m)^(Art\.\s*\d+[A-Za-z]?(?:\s*[-–:]\s*.*)?)$"),
    re.compile(r"(?m)^(\d+[A-Za-z]?\.\s+.*)$"),
    re.compile(r"(?m)^(Section\s+\d+[A-Za-z]?(?:\s*[-–:]\s*.*)?)$"),
    re.compile(r"(?m)^((?:§|Sec\.)\s*\d+(?:\.\d+)*(?:\s*[-–:]\s*.*)?)$"),
]


def split_into_legal_chunks(text: str, max_chars: int = 5000) -> list[dict[str, str]]:
    matches: list[tuple[int, str]] = []
    for pattern in ARTICLE_PATTERNS:
        matches.extend((match.start(), match.group(1).strip()) for match in pattern.finditer(text))
    matches = sorted(set(matches), key=lambda item: item[0])

    chunks: list[dict[str, str]] = []
    if len(matches) >= 3:
        if matches[0][0] > 0:
            preamble = text[: matches[0][0]].strip()
            if preamble:
                chunks.extend(split_large_chunk("Preamble", preamble, max_chars))
        for index, (start, heading) in enumerate(matches):
            end = matches[index + 1][0] if index + 1 < len(matches) else len(text)
            chunk_text = text[start:end].strip()
            if chunk_text:
                chunks.extend(split_large_chunk(heading, chunk_text, max_chars))
        return chunks

    paragraphs = [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]
    current = ""
    chunk_no = 1
    for paragraph in paragraphs:
        candidate = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(candidate) <= max_chars:
            current = candidate
            continue
        if current:
            chunks.append({"heading": f"Chunk {chunk_no}", "text": current})
            chunk_no += 1
        current = paragraph
    if current:
        chunks.append({"heading": f"Chunk {chunk_no}", "text": current})
    return chunks


def split_large_chunk(heading: str, chunk_text: str, max_chars: int) -> list[dict[str, str]]:
    if len(chunk_text) <= max_chars:
        return [{"heading": heading, "text": chunk_text}]
    paragraphs = [part.strip() for part in re.split(r"\n\s*\n", chunk_text) if part.strip()]
    parts: list[dict[str, str]] = []
    current = ""
    part_no = 1
    for paragraph in paragraphs:
        candidate = f"{current}\n\n{paragraph}".strip() if current else paragraph
        if len(candidate) <= max_chars:
            current = candidate
            continue
        if current:
            parts.append({"heading": f"{heading} / part {part_no}", "text": current})
            part_no += 1
        current = paragraph
    if current:
        parts.append({"heading": f"{heading} / part {part_no}" if part_no > 1 else heading, "text": current})
    return parts


def ensure_source_columns(conn: sqlite3.Connection) -> None:
    columns = {row[1] for row in conn.execute("PRAGMA table_info(foreign_regulation_sources)").fetchall()}
    for column, definition in {
        "language": "TEXT",
        "source_sha256": "TEXT",
        "source_file": "TEXT",
        "fulltext_imported_at": "TEXT",
    }.items():
        if column not in columns:
            conn.execute(f"ALTER TABLE foreign_regulation_sources ADD COLUMN {column} {definition}")


def source_exists(conn: sqlite3.Connection, source_path: str) -> bool:
    row = conn.execute("SELECT 1 FROM regulations WHERE source_path = ?", (source_path,)).fetchone()
    return bool(row)


def insert_fulltext(
    conn: sqlite3.Connection,
    source: dict[str, Any],
    source_file: Path,
    text: str,
    extract_method: str,
    markdown_dir: Path,
    imported_at: str,
) -> None:
    ensure_source_columns(conn)
    source_path = f"{source['source_url']}#{source['id']}"
    if source_exists(conn, source_path):
        return

    jurisdiction_slug = source["jurisdiction_slug"]
    markdown_relative = Path(jurisdiction_slug) / f"{source['id']}.md"
    markdown_output = markdown_dir / markdown_relative
    markdown_output.parent.mkdir(parents=True, exist_ok=True)
    markdown_output.write_text(f"# {source['title']}\n\n{text}\n", encoding="utf-8")

    data = source_file.read_bytes()
    source_digest = sha256_bytes(data)
    text_digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    chunks = split_into_legal_chunks(text)

    cursor = conn.execute(
        """
        INSERT INTO regulations (
            source_path, relative_path, top_level_bucket, file_name, title,
            standard_code, doc_category, effect_level, region, is_draft, year_hint,
            file_size, sha256, source_mtime, page_count, extract_method, text_length,
            raw_text, import_status, import_error, imported_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, 0, ?, ?, ?, 'ok', NULL, ?)
        """,
        (
            source_path,
            markdown_relative.as_posix(),
            jurisdiction_slug,
            markdown_relative.name,
            source["title"],
            source.get("standard_code", ""),
            source.get("doc_category", "foreign_privacy_law_fulltext"),
            source.get("effect_level", ""),
            source.get("region", ""),
            int(re.search(r"(19|20)\d{2}", source.get("official_citation", "") + " " + source.get("title", "")).group(0))
            if re.search(r"(19|20)\d{2}", source.get("official_citation", "") + " " + source.get("title", ""))
            else None,
            len(data),
            text_digest,
            imported_at,
            extract_method,
            len(text),
            text,
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
            source["title"],
            source.get("standard_code", ""),
            source.get("doc_category", "foreign_privacy_law_fulltext"),
            source.get("effect_level", ""),
            source.get("region", ""),
            text,
        ),
    )
    for chunk_index, chunk in enumerate(chunks):
        conn.execute(
            """
            INSERT INTO regulation_chunks (regulation_id, chunk_index, chunk_text)
            VALUES (?, ?, ?)
            """,
            (regulation_id, chunk_index, f"{chunk['heading']}\n\n{chunk['text']}"),
        )
    conn.execute(
        """
        INSERT OR REPLACE INTO foreign_regulation_sources (
            regulation_id, jurisdiction, jurisdiction_slug, authority, source_url,
            official_citation, topics_json, keywords_json, language, source_sha256,
            source_file, fulltext_imported_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            regulation_id,
            source.get("jurisdiction", ""),
            jurisdiction_slug,
            source.get("authority", ""),
            source.get("source_url", ""),
            source.get("official_citation", ""),
            json.dumps(["full_text"], ensure_ascii=False),
            json.dumps([source.get("standard_code", ""), source.get("title", "")], ensure_ascii=False),
            source.get("language", ""),
            source_digest,
            str(source_file),
            imported_at,
        ),
    )


def refresh_manifest(library_dir: Path) -> None:
    manifest_path = library_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    total = 0
    for jurisdiction in manifest.get("jurisdictions", []):
        db_path = library_dir / jurisdiction["db_path"]
        conn = sqlite3.connect(str(db_path))
        try:
            document_count = conn.execute("SELECT COUNT(*) FROM regulations WHERE import_status = 'ok'").fetchone()[0]
            chunk_count = conn.execute("SELECT COUNT(*) FROM regulation_chunks").fetchone()[0]
        finally:
            conn.close()
        jurisdiction["document_count"] = document_count
        jurisdiction["chunk_count"] = chunk_count
        total += document_count
    manifest["document_count"] = total
    manifest["built_at"] = now_iso()
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    source_config = Path(args.source).expanduser().resolve()
    library_dir = Path(args.library_dir).expanduser().resolve()
    doc_dir = Path(args.doc_dir).expanduser().resolve()
    markdown_dir = Path(args.markdown_dir).expanduser().resolve()
    payload = json.loads(source_config.read_text(encoding="utf-8"))
    imported_at = now_iso()
    successes = 0

    for source in payload.get("sources", []):
        db_path = library_dir / source["jurisdiction_slug"] / "regulations.sqlite3"
        if not db_path.exists():
            raise RuntimeError(f"jurisdiction database missing for {source['id']}: {db_path}")
        source_file = download_source(source, doc_dir, args.refresh_downloads)
        text, method = extract_pdf_text(source_file)
        conn = sqlite3.connect(str(db_path))
        try:
            insert_fulltext(conn, source, source_file, text, method, markdown_dir, imported_at)
            conn.commit()
            successes += 1
        finally:
            conn.close()
        print(f"{source['id']}: {len(text)} chars from {source_file}")

    refresh_manifest(library_dir)
    print(f"fulltext_sources={successes}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
