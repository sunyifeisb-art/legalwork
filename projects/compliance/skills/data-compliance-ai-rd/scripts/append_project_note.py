#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import pathlib
import sys
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

DEFAULT_NOTE_ID = "7445858295506106"
API_URL = "https://ima.qq.com/openapi/note/v1/append_doc"


def read_credentials() -> tuple[str, str]:
    client_id = os.environ.get("IMA_OPENAPI_CLIENTID", "").strip()
    api_key = os.environ.get("IMA_OPENAPI_APIKEY", "").strip()
    if not client_id:
        p = pathlib.Path.home() / ".config/ima/client_id"
        if p.exists():
            client_id = p.read_text().strip()
    if not api_key:
        p = pathlib.Path.home() / ".config/ima/api_key"
        if p.exists():
            api_key = p.read_text().strip()
    if not client_id or not api_key:
        raise SystemExit("Missing IMA credentials")
    return client_id, api_key


def build_content(raw: str, title: str | None) -> str:
    ts = datetime.now(ZoneInfo("Asia/Shanghai")).strftime("%Y-%m-%d %H:%M")
    raw = raw.strip()
    if not raw:
        raise SystemExit("Empty content")
    if title:
        return f"\n\n## {title}（{ts}）\n\n{raw}\n"
    return f"\n\n{raw}\n"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--note-id", default=DEFAULT_NOTE_ID)
    parser.add_argument("--title", default="")
    parser.add_argument("--file", default="")
    parser.add_argument("--text", default="")
    args = parser.parse_args()

    if args.file:
        raw = pathlib.Path(args.file).read_text()
    elif args.text:
        raw = args.text
    else:
        raw = sys.stdin.read()

    client_id, api_key = read_credentials()
    content = build_content(raw, args.title or None)
    payload = json.dumps({"doc_id": args.note_id, "content_format": 1, "content": content}).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={
            "ima-openapi-clientid": client_id,
            "ima-openapi-apikey": api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    print(json.dumps(data, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
