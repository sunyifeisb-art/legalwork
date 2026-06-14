#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

SCRIPT_PATH = Path(__file__).resolve().parent.parent / "scripts/safe_upload_default_upstream.py"
SPEC = importlib.util.spec_from_file_location("safe_upload_default_upstream", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)


class SafeUploadClassifierTest(unittest.TestCase):
    def test_local_only_change_uploads(self) -> None:
        action, reason = MODULE.classify_file_state("local", "base", "base")
        self.assertEqual(("upload_local", "local-only-update"), (action, reason))

    def test_remote_only_change_syncs(self) -> None:
        action, reason = MODULE.classify_file_state("base", "remote", "base")
        self.assertEqual(("sync_remote", "remote-only-update"), (action, reason))

    def test_both_changed_same_file_conflicts(self) -> None:
        action, reason = MODULE.classify_file_state("local", "remote", "base")
        self.assertEqual(("conflict", "both-changed-same-file"), (action, reason))

    def test_new_local_file_uploads(self) -> None:
        action, reason = MODULE.classify_file_state("local", None, None)
        self.assertEqual(("upload_local", "new-local-file"), (action, reason))

    def test_new_remote_file_syncs(self) -> None:
        action, reason = MODULE.classify_file_state(None, "remote", None)
        self.assertEqual(("sync_remote", "new-remote-file"), (action, reason))

    def test_remote_delete_becomes_conflict(self) -> None:
        action, reason = MODULE.classify_file_state("base", None, "base")
        self.assertEqual(("conflict", "remote-file-deleted-or-missing"), (action, reason))

    def test_check_return_code_is_behind_when_remote_only_exists(self) -> None:
        code = MODULE.print_check(
            {
                "upload_local": [],
                "sync_remote": [("CHANGELOG.md", "remote-only-update")],
                "conflict": [],
                "noop": [],
            }
        )
        self.assertEqual(3, code)

    def test_check_return_code_is_up_to_date_without_remote_or_conflict(self) -> None:
        code = MODULE.print_check(
            {
                "upload_local": [("CHANGELOG.md", "local-only-update")],
                "sync_remote": [],
                "conflict": [],
                "noop": [],
            }
        )
        self.assertEqual(0, code)


if __name__ == "__main__":
    unittest.main()
