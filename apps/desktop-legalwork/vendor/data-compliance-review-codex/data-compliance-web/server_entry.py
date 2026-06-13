#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import sys
import traceback
from pathlib import Path


WEB_DIR = Path(__file__).resolve().parent
os.chdir(WEB_DIR)
os.environ.setdefault("COMPLIANCEAI_PYTHON", sys.executable)
if str(WEB_DIR) not in sys.path:
    sys.path.insert(0, str(WEB_DIR))

import app as compliance_app


def log(message: str) -> None:
    log_path = os.environ.get("COMPLIANCEAI_LOG_PATH", "").strip()
    if not log_path:
        return
    try:
        path = Path(log_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("a", encoding="utf-8") as handle:
            handle.write(message.rstrip() + "\n")
    except Exception:
        pass


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=5100)
    args = parser.parse_args()

    try:
        log(f"server_entry start cwd={WEB_DIR} port={args.port} python={sys.executable}")
        compliance_app.app.run(
            host="127.0.0.1",
            port=args.port,
            debug=False,
            use_reloader=False,
            threaded=True,
        )
        return 0
    except Exception:
        log("server_entry crashed:\n" + traceback.format_exc())
        raise


if __name__ == "__main__":
    raise SystemExit(main())
