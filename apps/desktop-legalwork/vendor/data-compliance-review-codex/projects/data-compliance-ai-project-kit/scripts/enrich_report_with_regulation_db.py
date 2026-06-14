#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sqlite3
from datetime import datetime
from pathlib import Path
import re

PLACEHOLDER = "待外部规范数据库补充具体依据"
MAX_RESULTS = 3

PATH_QUERY_HINTS = {
    "disclosure_check": ["个人信息", "处理规则", "个人信息处理规则", "个人信息保护"],
    "third_party_sharing_check": ["第三方", "共享", "委托处理", "SDK", "个人信息"],
    "outbound_transfer_check": ["跨境", "出境", "境外接收方", "安全认证", "标准合同"],
    "lawful_basis_check": ["个人信息", "同意", "最小必要", "处理规则"],
    "purpose_scope_check": ["最小必要", "个人信息", "互联网平台", "APP"],
    "sensitive_personal_info_check": ["敏感个人信息", "未成年人", "儿童", "个人信息保护"],
    "consent_feature_coupling_check": ["同意", "个性化推荐", "营销推荐", "APP"],
    "retention_deletion_check": ["保存期限", "删除", "匿名化", "个人信息"],
    "consistency_check": ["个人信息", "处理规则", "合规审计"],
    "field_purpose_legal_basis_check": ["个人信息", "最小必要", "处理规则", "自动化决策"],
    "contract_obligation_check": ["委托处理", "第三方", "数据交易", "个人信息"],
}

DOMAIN_KEYWORDS = [
    "个人信息",
    "个人信息保护",
    "敏感个人信息",
    "未成年人",
    "儿童",
    "跨境",
    "出境",
    "境外接收方",
    "标准合同",
    "安全认证",
    "第三方",
    "共享",
    "委托处理",
    "SDK",
    "自动化决策",
    "最小必要",
    "合法性基础",
    "保存期限",
    "删除",
    "匿名化",
    "同意",
    "单独同意",
    "营销推荐",
    "个性化推荐",
    "画像",
    "互联网平台",
    "APP",
    "合规审计",
    "数据交易",
    "政务数据",
    "数据接口",
    "大型互联网企业",
    "智能终端",
    "移动互联网应用",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", required=True)
    parser.add_argument("--db", required=True)
    parser.add_argument("--output", required=True)
    return parser.parse_args()


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def unique_keep_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        cleaned = value.strip()
        if not cleaned or cleaned in seen:
            continue
        seen.add(cleaned)
        result.append(cleaned)
    return result


def extract_clause_references(text: str) -> list[str]:
    matches = re.findall(
        r"第[一二三四五六七八九十百千万零两0-9]+条(?:第[一二三四五六七八九十百千万零两0-9]+款)?",
        text or "",
    )
    return unique_keep_order(matches)[:3]


def derive_keywords(item: dict) -> list[str]:
    combined = " ".join(
        [
            item.get("risk_point", ""),
            item.get("legal_basis", ""),
            item.get("reason", ""),
            item.get("suggestion", ""),
            item.get("theme_name", ""),
            " ".join(item.get("evidence", []) or []),
        ]
    )
    keywords: list[str] = []
    for path_id in item.get("path_ids", []) or []:
        keywords.extend(PATH_QUERY_HINTS.get(path_id, []))
    for keyword in DOMAIN_KEYWORDS:
        if keyword in combined:
            keywords.append(keyword)
    return unique_keep_order(keywords)[:8]


def extract_evidence_terms(item: dict) -> list[str]:
    terms: list[str] = []
    for evidence in item.get("evidence", []) or []:
        cleaned = re.sub(r"\s+", " ", evidence).strip()
        if len(cleaned) >= 6:
            terms.append(cleaned[:40])
    return unique_keep_order(terms)[:4]


def build_snippet(chunk_text: str, matched_keywords: list[str], max_chars: int = 140) -> str:
    if not chunk_text:
        return ""
    for keyword in matched_keywords:
        pos = chunk_text.find(keyword)
        if pos >= 0:
            start = max(0, pos - 40)
            end = min(len(chunk_text), pos + max_chars)
            return chunk_text[start:end].replace("\n", " ").strip()
    return chunk_text[:max_chars].replace("\n", " ").strip()


def score_row(row: sqlite3.Row, item: dict, keywords: list[str], fts_chunk_ids: set[int]) -> tuple[int, list[str]]:
    title = row["title"] or ""
    standard_code = row["standard_code"] or ""
    chunk_text = row["chunk_text"] or ""
    score = 0
    matched_keywords: list[str] = []

    for keyword in keywords:
        matched = False
        if keyword in standard_code:
            score += 10
            matched = True
        if keyword in title:
            score += 8
            matched = True
        if keyword in chunk_text:
            score += 4
            matched = True
        if matched:
            matched_keywords.append(keyword)

    for evidence_term in extract_evidence_terms(item):
        if evidence_term in chunk_text:
            score += 12
            matched_keywords.append(evidence_term)

    if row["chunk_id"] in fts_chunk_ids:
        score += 3

    effect_level = row["effect_level"] or ""
    doc_category = row["doc_category"] or ""
    if doc_category == "standard_or_guideline":
        score += 5
    elif doc_category == "national_policy":
        score += 4
    elif doc_category == "local_policy":
        score += 2

    if "征求意见稿" in effect_level or "草案" in effect_level or row["is_draft"]:
        score -= 4

    if standard_code:
        score += 2

    return score, unique_keep_order(matched_keywords)


def fetch_fts_chunk_ids(conn: sqlite3.Connection, keywords: list[str]) -> set[int]:
    candidates: set[int] = set()
    fts_terms = [keyword for keyword in keywords if re.search(r"[A-Za-z0-9]", keyword)]
    for keyword in fts_terms[:5]:
        try:
            rows = conn.execute(
                """
                SELECT chunk_id
                FROM regulation_chunks_fts
                WHERE regulation_chunks_fts MATCH ?
                LIMIT 50
                """,
                (keyword,),
            ).fetchall()
            candidates.update(row[0] for row in rows)
        except sqlite3.OperationalError:
            continue
    return candidates


def search_regulations(conn: sqlite3.Connection, item: dict, keywords: list[str]) -> list[dict]:
    if not keywords:
        return []

    clauses: list[str] = []
    params: list[str] = []
    for keyword in keywords:
        like = f"%{keyword}%"
        clauses.append("(r.title LIKE ? OR r.standard_code LIKE ? OR c.chunk_text LIKE ?)")
        params.extend([like, like, like])

    fts_chunk_ids = fetch_fts_chunk_ids(conn, keywords)
    rows = conn.execute(
        f"""
        SELECT
            r.id AS regulation_id,
            r.title,
            r.standard_code,
            r.doc_category,
            r.effect_level,
            r.relative_path,
            r.is_draft,
            c.id AS chunk_id,
            c.chunk_index,
            c.chunk_text
        FROM regulation_chunks c
        JOIN regulations r ON r.id = c.regulation_id
        WHERE r.import_status = 'ok' AND ({' OR '.join(clauses)})
        """,
        params,
    ).fetchall()

    ranked_by_regulation: dict[int, tuple[int, dict]] = {}
    for row in rows:
        score, matched_keywords = score_row(row, item, keywords, fts_chunk_ids)
        if score <= 0:
            continue
        entry = {
            "title": row["title"],
            "standard_code": row["standard_code"] or "",
            "doc_category": row["doc_category"] or "",
            "effect_level": row["effect_level"] or "",
            "relative_path": row["relative_path"],
            "clause_references": extract_clause_references(row["chunk_text"] or ""),
            "match_keywords": matched_keywords,
            "match_score": score,
            "snippet": build_snippet(row["chunk_text"] or "", matched_keywords),
        }
        current = ranked_by_regulation.get(row["regulation_id"])
        if current is None or score > current[0]:
            ranked_by_regulation[row["regulation_id"]] = (score, entry)

    ranked = sorted(
        ranked_by_regulation.values(),
        key=lambda pair: (-pair[0], pair[1]["title"]),
    )
    return [item for _, item in ranked[:MAX_RESULTS]]


def infer_legal_basis_source(item: dict) -> str:
    legal_basis = (item.get("legal_basis") or "").strip()
    if legal_basis and legal_basis != PLACEHOLDER:
        return "mapped_or_existing"
    return "placeholder"


def main() -> int:
    args = parse_args()
    report_path = Path(args.report)
    db_path = Path(args.db)
    output_path = Path(args.output)

    report = load_json(report_path)
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row

    db_total = conn.execute("SELECT COUNT(*) FROM regulations").fetchone()[0]
    db_ok = conn.execute(
        "SELECT COUNT(*) FROM regulations WHERE import_status = 'ok'"
    ).fetchone()[0]
    matched_items = 0

    for item in report.get("items", []):
        keywords = derive_keywords(item)
        regulations = search_regulations(conn, item, keywords)
        item["legal_basis_source"] = infer_legal_basis_source(item)
        item["supporting_regulations"] = regulations
        if regulations:
            matched_items += 1

    report["local_regulation_db"] = {
        "enabled": True,
        "db_name": db_path.name,
        "matched_items": matched_items,
        "unmatched_items": max(0, len(report.get("items", [])) - matched_items),
        "total_documents": db_total,
        "searchable_documents": db_ok,
        "updated_at": datetime.now().isoformat(timespec="seconds"),
    }

    output_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(output_path)
    conn.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
