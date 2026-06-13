#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sqlite3
import subprocess
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable

import fitz
from pypdf import PdfReader

SKIP_FILENAMES = {".DS_Store"}
PDF_SUFFIXES = {".pdf"}
REGION_TOKENS = [
    "北京市",
    "天津市",
    "上海市",
    "重庆市",
    "河北省",
    "山西省",
    "辽宁省",
    "吉林省",
    "黑龙江省",
    "江苏省",
    "浙江省",
    "安徽省",
    "福建省",
    "江西省",
    "山东省",
    "河南省",
    "湖北省",
    "湖南省",
    "广东省",
    "海南省",
    "四川省",
    "贵州省",
    "云南省",
    "陕西省",
    "甘肃省",
    "青海省",
    "台湾省",
    "内蒙古自治区",
    "广西壮族自治区",
    "西藏自治区",
    "宁夏回族自治区",
    "新疆维吾尔自治区",
    "香港特别行政区",
    "澳门特别行政区",
    "石景山区",
    "杭州市",
    "东莞市",
    "武汉市",
    "西安市",
    "长春市",
    "深圳市",
]
STANDARD_CODE_PATTERNS = [
    re.compile(
        r"(?i)\b("
        r"GB(?:[\\/_\s∕T-]*T)?"
        r"|GBT"
        r"|YD(?:[\\/_\s-]*T)?"
        r"|YDT"
        r"|DB[0-9A-Z/_:：．.＋+\-－]*"
        r"|WS(?:[\\/_\s-]*T)?"
        r"|MH(?:[\\/_\s:：-]*T)?"
        r"|MHT"
        r"|TC260"
        r")"
        r"[\s:：/_\-－]*[0-9A-Z.]+(?:[\-－—][0-9]{4})?"
    )
]


@dataclass
class ExtractResult:
    text: str
    method: str
    page_count: int
    error: str | None = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Ingest a regulation corpus into a local SQLite FTS database."
    )
    parser.add_argument("source_dir", help="Directory containing regulation PDFs")
    parser.add_argument(
        "--db",
        default="knowledge-base/local-regulations.sqlite3",
        help="Output SQLite database path",
    )
    parser.add_argument(
        "--include-ext",
        nargs="+",
        default=[".pdf"],
        help="File extensions to include; defaults to .pdf only",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Optional limit for dry-runs or debugging",
    )
    parser.add_argument(
        "--rebuild",
        action="store_true",
        help="Drop existing records before import",
    )
    parser.add_argument(
        "--stats-json",
        default="knowledge-base/local-regulations-import-stats.json",
        help="Where to write import stats JSON",
    )
    parser.add_argument(
        "--markdown-dir",
        default="knowledge-base/regulations-md",
        help="Directory where normalized Markdown files will be exported",
    )
    return parser.parse_args()


def sha256_for_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalize_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    cleaned: list[str] = []
    blank_count = 0
    for line in lines:
        if not line:
            blank_count += 1
            if blank_count <= 2:
                cleaned.append("")
            continue
        blank_count = 0
        cleaned.append(line)
    return "\n".join(cleaned).strip()


def infer_standard_code(name: str) -> str | None:
    for pattern in STANDARD_CODE_PATTERNS:
        match = pattern.search(name)
        if match:
            return match.group(0).replace("＋", "+").strip()
    return None


def infer_region(name: str, relative_path: str) -> str | None:
    haystack = f"{relative_path} {name}"
    for token in REGION_TOKENS:
        if token in haystack:
            return token
    return None


def infer_doc_category(top_level_bucket: str, name: str) -> str:
    if "国家法律" in top_level_bucket or "法律" in top_level_bucket:
        return "national_law"
    if "地方" in top_level_bucket:
        return "local_policy"
    if "国家规范" in top_level_bucket or "政策要求" in top_level_bucket:
        return "national_policy"
    if "标准" in top_level_bucket or "行业" in top_level_bucket:
        return "standard_or_guideline"
    if "征求意见稿" in name:
        return "draft"
    return "other"


def infer_effect_level(top_level_bucket: str, name: str) -> str:
    if "征求意见稿" in name or "草案" in name:
        return "征求意见稿/草案"
    if "国家法律" in top_level_bucket or "法律" in top_level_bucket:
        return "法律"
    if "地方" in top_level_bucket:
        return "地方政策/地方标准"
    if "标准" in top_level_bucket or "行业" in top_level_bucket:
        return "国家标准/行业标准/技术指南"
    if "国家规范" in top_level_bucket or "政策要求" in top_level_bucket:
        return "国家政策/规范"
    return "待识别"


def clean_title(name: str) -> str:
    title = re.sub(r"\.(pdf|docx|doc)$", "", name, flags=re.IGNORECASE)
    title = title.replace("（高清版）", "").replace("(高清版)", "")
    title = re.sub(r"\s+", " ", title)
    return title.strip()


def slugify(text: str) -> str:
    safe: list[str] = []
    for ch in text.strip():
        if ch.isalnum() or ch in "-_":
            safe.append(ch)
        elif ch.isspace() or ch in "/|:：，,（）()[]【】":
            safe.append("-")
        else:
            safe.append(ch)
    name = "".join(safe).strip("-")
    while "--" in name:
        name = name.replace("--", "-")
    return name or "regulation"


def iter_documents(root: Path, suffixes: set[str], limit: int) -> Iterable[Path]:
    count = 0
    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if path.name in SKIP_FILENAMES:
            continue
        if path.suffix.lower() not in suffixes:
            continue
        yield path
        count += 1
        if limit and count >= limit:
            return


def extract_with_pdftotext(path: Path) -> ExtractResult:
    cmd = ["pdftotext", "-layout", "-enc", "UTF-8", str(path), "-"]
    run = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if run.returncode == 0:
        text = normalize_text(run.stdout)
        if text:
            return ExtractResult(text=text, method="pdftotext", page_count=0)
        return ExtractResult(
            text="",
            method="pdftotext",
            page_count=0,
            error="pdftotext returned empty text",
        )
    return ExtractResult(
        text="",
        method="pdftotext",
        page_count=0,
        error=run.stderr.strip() or f"pdftotext exited with {run.returncode}",
    )


def extract_with_pypdf(path: Path) -> ExtractResult:
    try:
        with path.open("rb") as handle:
            reader = PdfReader(handle)
            parts = [(page.extract_text() or "") for page in reader.pages]
            text = normalize_text("\n\n".join(parts))
            if text:
                return ExtractResult(
                    text=text,
                    method="pypdf",
                    page_count=len(reader.pages),
                )
            return ExtractResult(
                text="",
                method="pypdf",
                page_count=len(reader.pages),
                error="pypdf returned empty text",
            )
    except Exception as exc:
        return ExtractResult(text="", method="pypdf", page_count=0, error=str(exc))


def extract_with_fitz(path: Path) -> ExtractResult:
    try:
        document = fitz.open(path)
        parts = [page.get_text("text") for page in document]
        text = normalize_text("\n\n".join(parts))
        page_count = document.page_count
        document.close()
        if text:
            return ExtractResult(text=text, method="fitz", page_count=page_count)
        return ExtractResult(
            text="",
            method="fitz",
            page_count=page_count,
            error="fitz returned empty text",
        )
    except Exception as exc:
        return ExtractResult(text="", method="fitz", page_count=0, error=str(exc))


def extract_pdf_text(path: Path) -> ExtractResult:
    primary = extract_with_pdftotext(path)
    fallback = extract_with_pypdf(path)
    third = extract_with_fitz(path)

    candidates = [primary, fallback, third]
    success = [result for result in candidates if result.text]
    if success:
        best = max(success, key=lambda result: len(result.text))
        page_count = max(result.page_count for result in candidates)
        return ExtractResult(
            text=best.text,
            method=best.method,
            page_count=page_count,
        )

    page_count = max(result.page_count for result in candidates)
    errors = [result.error for result in candidates if result.error]
    error = "; ".join(errors) if errors else "unknown extraction error"
    return ExtractResult(text="", method="failed", page_count=page_count, error=error)


def chunk_text(text: str, chunk_size: int = 1200, overlap: int = 120) -> list[str]:
    if not text:
        return []
    paragraphs = [part.strip() for part in re.split(r"\n{2,}", text) if part.strip()]
    chunks: list[str] = []
    current = ""
    for paragraph in paragraphs:
        if not current:
            current = paragraph
            continue
        if len(current) + 2 + len(paragraph) <= chunk_size:
            current = f"{current}\n\n{paragraph}"
            continue
        chunks.append(current)
        tail = current[-overlap:] if overlap else ""
        current = f"{tail}\n\n{paragraph}".strip()
    if current:
        chunks.append(current)
    if not chunks:
        return [text[:chunk_size]]
    return chunks


def ensure_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        PRAGMA journal_mode=WAL;
        PRAGMA foreign_keys=ON;

        CREATE TABLE IF NOT EXISTS regulations (
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

        CREATE INDEX IF NOT EXISTS idx_regulations_standard_code ON regulations(standard_code);
        CREATE INDEX IF NOT EXISTS idx_regulations_doc_category ON regulations(doc_category);
        CREATE INDEX IF NOT EXISTS idx_regulations_region ON regulations(region);
        CREATE INDEX IF NOT EXISTS idx_regulations_sha256 ON regulations(sha256);

        CREATE VIRTUAL TABLE IF NOT EXISTS regulation_fts USING fts5(
            regulation_id UNINDEXED,
            title,
            standard_code,
            doc_category,
            effect_level,
            region,
            raw_text
        );

        CREATE TABLE IF NOT EXISTS regulation_chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            regulation_id INTEGER NOT NULL,
            chunk_index INTEGER NOT NULL,
            chunk_text TEXT NOT NULL,
            FOREIGN KEY(regulation_id) REFERENCES regulations(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_regulation_chunks_regulation_id ON regulation_chunks(regulation_id);

        CREATE VIRTUAL TABLE IF NOT EXISTS regulation_chunks_fts USING fts5(
            regulation_id UNINDEXED,
            chunk_id UNINDEXED,
            chunk_text
        );
        """
    )


def export_markdown(
    markdown_root: Path,
    path: Path,
    root: Path,
    extracted: ExtractResult,
) -> Path:
    relative_path = path.relative_to(root)
    file_name = path.name
    title = clean_title(file_name)
    top_level_bucket = relative_path.parts[0] if relative_path.parts else ""
    standard_code = infer_standard_code(file_name) or ""
    doc_category = infer_doc_category(top_level_bucket, file_name)
    effect_level = infer_effect_level(top_level_bucket, file_name)
    region = infer_region(file_name, str(relative_path)) or ""
    sha256 = sha256_for_file(path)
    source_mtime = datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="seconds")

    target_dir = markdown_root / relative_path.parent
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / f"{slugify(title)}-{sha256[:10]}.md"

    frontmatter = [
        "---",
        f"法规名称: {title}",
        f"标准编号: {standard_code}",
        f"文档分类: {doc_category}",
        f"效力层级: {effect_level}",
        f"地区: {region}",
        f"是否征求意见稿: {'true' if ('征求意见稿' in title or '草案' in title) else 'false'}",
        f"来源文件: {path}",
        f"来源相对路径: {relative_path}",
        f"来源分组: {top_level_bucket}",
        f"页数: {extracted.page_count}",
        f"提取方式: {extracted.method}",
        f"文件SHA256: {sha256}",
        f"源文件更新时间: {source_mtime}",
        "---",
        "",
        f"# {title}",
        "",
        "## 说明",
        "",
        "本文件由导入脚本自动从原始 PDF 提取，仅用于检索、审查和后续人工精修。",
        "",
        "## 正文",
        "",
        extracted.text or "（当前未成功提取到正文，请回看原始文件）",
        "",
    ]
    target_path.write_text("\n".join(frontmatter), encoding="utf-8")
    return target_path


def rebuild_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        DROP TABLE IF EXISTS regulation_chunks_fts;
        DROP TABLE IF EXISTS regulation_chunks;
        DROP TABLE IF EXISTS regulation_fts;
        DROP TABLE IF EXISTS regulations;
        """
    )
    ensure_schema(conn)


def upsert_document(
    conn: sqlite3.Connection,
    path: Path,
    root: Path,
    extracted: ExtractResult,
) -> int:
    relative_path = str(path.relative_to(root))
    parts = Path(relative_path).parts
    top_level_bucket = parts[0] if parts else ""
    file_name = path.name
    title = clean_title(file_name)
    standard_code = infer_standard_code(file_name)
    doc_category = infer_doc_category(top_level_bucket, file_name)
    effect_level = infer_effect_level(top_level_bucket, file_name)
    region = infer_region(file_name, relative_path)
    imported_at = datetime.now().isoformat(timespec="seconds")
    file_size = path.stat().st_size
    year_match = re.search(r"(20\d{2})", file_name)
    year_hint = int(year_match.group(1)) if year_match else None
    sha256 = sha256_for_file(path)
    source_mtime = datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="seconds")
    status = "ok" if extracted.text else "empty_text"

    conn.execute(
        """
        INSERT INTO regulations (
            source_path,
            relative_path,
            top_level_bucket,
            file_name,
            title,
            standard_code,
            doc_category,
            effect_level,
            region,
            is_draft,
            year_hint,
            file_size,
            sha256,
            source_mtime,
            page_count,
            extract_method,
            text_length,
            raw_text,
            import_status,
            import_error,
            imported_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(source_path) DO UPDATE SET
            relative_path=excluded.relative_path,
            top_level_bucket=excluded.top_level_bucket,
            file_name=excluded.file_name,
            title=excluded.title,
            standard_code=excluded.standard_code,
            doc_category=excluded.doc_category,
            effect_level=excluded.effect_level,
            region=excluded.region,
            is_draft=excluded.is_draft,
            year_hint=excluded.year_hint,
            file_size=excluded.file_size,
            sha256=excluded.sha256,
            source_mtime=excluded.source_mtime,
            page_count=excluded.page_count,
            extract_method=excluded.extract_method,
            text_length=excluded.text_length,
            raw_text=excluded.raw_text,
            import_status=excluded.import_status,
            import_error=excluded.import_error,
            imported_at=excluded.imported_at
        """,
        (
            str(path),
            relative_path,
            top_level_bucket,
            file_name,
            title,
            standard_code,
            doc_category,
            effect_level,
            region,
            int("征求意见稿" in title or "草案" in title),
            year_hint,
            file_size,
            sha256,
            source_mtime,
            extracted.page_count,
            extracted.method,
            len(extracted.text),
            extracted.text,
            status,
            extracted.error,
            imported_at,
        ),
    )

    regulation_id = conn.execute(
        "SELECT id FROM regulations WHERE source_path = ?", (str(path),)
    ).fetchone()[0]

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
            title,
            standard_code or "",
            doc_category or "",
            effect_level or "",
            region or "",
            extracted.text,
        ),
    )

    conn.execute("DELETE FROM regulation_chunks_fts WHERE regulation_id = ?", (regulation_id,))
    conn.execute("DELETE FROM regulation_chunks WHERE regulation_id = ?", (regulation_id,))

    for chunk_index, chunk in enumerate(chunk_text(extracted.text), start=1):
        cursor = conn.execute(
            """
            INSERT INTO regulation_chunks (regulation_id, chunk_index, chunk_text)
            VALUES (?, ?, ?)
            """,
            (regulation_id, chunk_index, chunk),
        )
        chunk_id = cursor.lastrowid
        conn.execute(
            """
            INSERT INTO regulation_chunks_fts (regulation_id, chunk_id, chunk_text)
            VALUES (?, ?, ?)
            """,
            (regulation_id, chunk_id, chunk),
        )

    return regulation_id


def build_stats(conn: sqlite3.Connection, source_dir: Path, db_path: Path) -> dict[str, object]:
    total = conn.execute("SELECT COUNT(*) FROM regulations").fetchone()[0]
    ok = conn.execute(
        "SELECT COUNT(*) FROM regulations WHERE import_status = 'ok'"
    ).fetchone()[0]
    empty_text = conn.execute(
        "SELECT COUNT(*) FROM regulations WHERE import_status = 'empty_text'"
    ).fetchone()[0]
    by_category = {
        row[0] or "unknown": row[1]
        for row in conn.execute(
            """
            SELECT doc_category, COUNT(*)
            FROM regulations
            GROUP BY doc_category
            ORDER BY COUNT(*) DESC, doc_category
            """
        )
    }
    drafts = conn.execute("SELECT COUNT(*) FROM regulations WHERE is_draft = 1").fetchone()[0]
    with_standard_code = conn.execute(
        "SELECT COUNT(*) FROM regulations WHERE standard_code IS NOT NULL AND standard_code != ''"
    ).fetchone()[0]

    return {
        "source_dir": str(source_dir),
        "db_path": str(db_path),
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "totals": {
            "documents": total,
            "ok": ok,
            "empty_text": empty_text,
            "drafts": drafts,
            "with_standard_code": with_standard_code,
        },
        "by_category": by_category,
    }


def main() -> int:
    args = parse_args()
    source_dir = Path(args.source_dir).expanduser().resolve()
    db_path = Path(args.db).expanduser().resolve()
    stats_path = Path(args.stats_json).expanduser().resolve()
    markdown_dir = Path(args.markdown_dir).expanduser().resolve()
    suffixes = {suffix.lower() if suffix.startswith(".") else f".{suffix.lower()}" for suffix in args.include_ext}

    if not source_dir.exists():
        raise SystemExit(f"source directory not found: {source_dir}")

    db_path.parent.mkdir(parents=True, exist_ok=True)
    stats_path.parent.mkdir(parents=True, exist_ok=True)
    markdown_dir.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    ensure_schema(conn)
    if args.rebuild:
        rebuild_schema(conn)

    processed = 0
    for path in iter_documents(source_dir, suffixes, args.limit):
        extracted = extract_pdf_text(path)
        export_markdown(markdown_dir, path, source_dir, extracted)
        upsert_document(conn, path, source_dir, extracted)
        processed += 1
        if processed % 25 == 0:
            conn.commit()
            print(f"[ingest] processed {processed} files")

    conn.commit()
    stats = build_stats(conn, source_dir, db_path)
    stats["markdown_dir"] = str(markdown_dir)
    stats_path.write_text(
        json.dumps(stats, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(stats, ensure_ascii=False, indent=2))
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
