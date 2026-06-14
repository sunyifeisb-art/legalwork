#!/usr/bin/env python3
"""将手动修正的 MD 文件内容同步回 SQLite 数据库。

用法：
  python3 scripts/sync_md_to_sqlite.py
"""
from __future__ import annotations

import sqlite3
import sys
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
DB = BASE / "knowledge-base" / "local-regulations.sqlite3"
MD_DIR = BASE / "knowledge-base" / "regulations-md"

# ---- 所有手动修正过的文件（相对于 MD_DIR） ----
CORRECTED = [
    # P0: 3个核心法律（web_fetch 替换 pypdf）
    "一、国家法律、法规、规范文件/中华人民共和国个人信息保护法-eba47ff909.md",
    "一、国家法律、法规、规范文件/中华人民共和国数据安全法-2eb6dc9817.md",
    "一、国家法律、法规、规范文件/中华人民共和国网络安全法-2025修正-9b8e6275ff.md",
    # P0: 8个空文件补充正文
    "一、国家法律、法规、规范文件/全国人民代表大会常务委员会工作报告-2025-3d671ffbf9.md",
    "一、国家法律、法规、规范文件/最高人民检察院工作报告-1c7adb5617.md",
    "一、国家法律、法规、规范文件/2025年数字经济工作要点-b01611ac89.md",
    "一、国家法律、法规、规范文件/关于建立公共数据资源授权运营价格形成机制的通知-d9ddb09a18.md",
    "一、国家法律、法规、规范文件/国家秘密定密管理规定-90437ff954.md",
    "一、国家法律、法规、规范文件/涉及国家安全事项的建设项目许可管理规定-cc7bee5a1b.md",
    "一、国家法律、法规、规范文件/中华人民共和国网络安全法-修正草案再次征求意见稿-3f499b74ab.md",
    "一、国家法律、法规、规范文件/中共中央办公厅-国务院办公厅关于健全资源环境要素市场化配置体系的意见_最新政策_中国政府网-27266acfb7.md",
    # P2: 乱码替换
    "二、国家标准、行业标准合集/可信数据空间标准体系建设指南-2025年版-正式版-7680591b43.md",
    "三、地方规范性文件/山东省数字经济促进条例-59809ba0ec.md",
]

# 已删除的空重复文件（SHA256 标识，用于从 DB 中清除）
DELETED_SHA256 = [
    "f5c4beda02bdcdbc835bd2c06641a1002947a70ac6f788c44dc3ed18c64b032e",  # 国家网络身份认证管理办法(空)
    "89b31bda5a54b43b790812e09a63bdb87e8fd40ece746060ff9ac35473d2b179",  # 个人信息保护合规审计管理办法(空)
    "eee525c11967a53478d6fe618de070abe1200eee41b3b5b8d4b4637eef40a2e9",  # 《公共数据资源登记管理暂行办法》(空)
    "63c3490a8a69ead4dcd6752fd92a1b8ea76b478a1ad75866e07cb1fa26365620",  # 《公共数据资源授权运营实施规范（试行）》(空)
    "af97b59ed1de0b978e1434b6e8a3fc63b69848db3fbe521a1c86fcd2cc0eb60a",  # 《政务数据共享条例》(重复)
]


def parse_md(filepath: Path) -> dict:
    """解析 MD 文件，返回 frontmatter + body"""
    text = filepath.read_text(encoding="utf-8")
    parts = text.split("\n---\n", 2)
    if len(parts) < 2:
        return {}
    raw = parts[0].splitlines()[1:]  # skip first ---
    # body = everything after frontmatter (merge parts[1..n] in case body has --- dividers)
    rest_body = "\n".join(parts[1:]) if len(parts) > 2 else parts[1]
    frontmatter: dict[str, str] = {}
    for line in raw:
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        frontmatter[k.strip()] = v.strip()

    # body: everything after frontmatter (skip # title / ## 说明 / ## 正文)
    body = ""
    if len(parts) >= 2:
        rest = rest_body.strip()
        # Remove the # title line if present
        body = re.sub(r"^# .*\n?", "", rest, count=1).strip()
        # Remove ## 说明 if present (text between ## 说明 and next ## heading or end)
        body = re.sub(r"## 说明\s*\n.*?(?=\n## |\Z)", "", body, count=1, flags=re.DOTALL).strip()
        # Remove ## 正文 heading if present
        body = re.sub(r"^## 正文\s*\n?", "", body).strip()

    page_str = frontmatter.get("页数", "0").strip()
    try:
        page_count = int(page_str) if page_str else 0
    except ValueError:
        page_count = 0

    return {
        "sha256": frontmatter.get("文件SHA256", ""),
        "relative_path": frontmatter.get("来源相对路径", ""),
        "extract_method": frontmatter.get("提取方式", ""),
        "title": frontmatter.get("法规名称", ""),
        "standard_code": frontmatter.get("标准编号", ""),
        "doc_category": frontmatter.get("文档分类", ""),
        "effect_level": frontmatter.get("效力层级", ""),
        "region": frontmatter.get("地区", ""),
        "is_draft": 1 if frontmatter.get("是否征求意见稿", "").lower() == "true" else 0,
        "page_count": page_count,
        "body": body,
    }


def main() -> int:
    if not DB.exists():
        print(f"ERROR: database not found: {DB}")
        return 1

    conn = sqlite3.connect(str(DB))
    conn.execute("PRAGMA journal_mode=WAL")
    updated = 0
    deleted = 0

    # === Step 1: 删除空重复文件对应的记录 ===
    for sha in DELETED_SHA256:
        cur = conn.execute("SELECT id, title, relative_path FROM regulations WHERE sha256 = ?", (sha,))
        row = cur.fetchone()
        if row:
            rid, title, rpath = row
            conn.execute("DELETE FROM regulation_fts WHERE regulation_id = ?", (rid,))
            conn.execute("DELETE FROM regulations WHERE id = ?", (rid,))
            print(f"  DELETE: [{rid}] {title} ({rpath})")
            deleted += 1
        else:
            print(f"  SKIP (not in DB): SHA256={sha[:16]}...")

    # === Step 2: 更新修正过的文件 ===
    for relpath in CORRECTED:
        md_path = MD_DIR / relpath
        if not md_path.exists():
            print(f"  SKIP (file gone): {relpath}")
            deleted += 1  # actually already counted above via SHA
            continue

        info = parse_md(md_path)
        if not info["sha256"]:
            print(f"  SKIP (no SHA256): {relpath}")
            continue

        sha = info["sha256"]
        cur = conn.execute("SELECT id, title, raw_text FROM regulations WHERE sha256 = ?", (sha,))
        row = cur.fetchone()

        if not row:
            # Try matching by relative_path
            cur2 = conn.execute("SELECT id, title, raw_text FROM regulations WHERE relative_path = ?", (info["relative_path"],))
            row = cur2.fetchone()

        if not row:
            # Try matching by title (for files whose SHA/path changed)
            cur3 = conn.execute("SELECT id, title, raw_text FROM regulations WHERE title LIKE ?", (f'%{info["title"][:20]}%',))
            row = cur3.fetchone()

        if not row:
            print(f"  SKIP (not in DB by SHA or path): {info['title']} ({sha[:16]}...)")
            continue

        rid, old_title, old_text = row
        old_len = len(old_text or "")
        new_len = len(info["body"])

        conn.execute("""
            UPDATE regulations SET
                title = ?,
                standard_code = ?,
                doc_category = ?,
                effect_level = ?,
                region = ?,
                is_draft = ?,
                page_count = ?,
                extract_method = ?,
                text_length = ?,
                raw_text = ?
            WHERE id = ?
        """, (
            info["title"],
            info["standard_code"],
            info["doc_category"],
            info["effect_level"],
            info["region"],
            info["is_draft"],
            info["page_count"],
            info["extract_method"],
            new_len,
            info["body"],
            rid,
        ))

        # Update FTS
        conn.execute("""
            UPDATE regulation_fts SET
                title = ?,
                standard_code = ?,
                doc_category = ?,
                effect_level = ?,
                region = ?,
                raw_text = ?
            WHERE regulation_id = ?
        """, (
            info["title"],
            info["standard_code"],
            info["doc_category"],
            info["effect_level"],
            info["region"],
            info["body"],
            rid,
        ))

        print(f"  UPDATE: [{rid}] {info['title']} ({old_len} -> {new_len} chars)")
        updated += 1

    conn.commit()
    conn.close()

    print(f"\nDone: {updated} updated, {deleted} deleted")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
