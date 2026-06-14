#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

SKIP_DIR_NAMES = {".git", "__pycache__", "venv", ".venv"}
SKIP_FILE_NAMES = {".DS_Store"}
SKIP_SUFFIXES = {".pyc", ".pyo"}


def run(cmd: list[str], cwd: Path | None = None, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else None,
        check=check,
        text=True,
        capture_output=True,
    )


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def file_sha256(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


def should_skip_path(rel_path: str) -> bool:
    path = Path(rel_path)
    if any(part in SKIP_DIR_NAMES for part in path.parts):
        return True
    if path.name in SKIP_FILE_NAMES:
        return True
    if path.suffix in SKIP_SUFFIXES:
        return True
    return False


def workspace_root() -> Path:
    return Path(__file__).resolve().parents[3]


def project_root() -> Path:
    return Path(__file__).resolve().parent.parent


def default_config_path() -> Path:
    return project_root() / "config/default-sync-source.json"


def load_config(config_path: Path) -> tuple[dict, Path]:
    config = json.loads(config_path.read_text(encoding="utf-8"))
    state_rel = config.get("state_path", "projects/data-compliance-ai-project-kit/config/default-sync-state.json")
    state_path = workspace_root() / state_rel
    return config, state_path


def iter_managed_files(root: Path, managed_paths: list[str], exclude_paths: set[str] | None = None) -> list[str]:
    exclude_paths = exclude_paths or set()
    files: set[str] = set()
    for rel in managed_paths:
        target = root / rel
        if not target.exists():
            continue
        if target.is_file():
            repo_rel = target.relative_to(root).as_posix()
            if repo_rel in exclude_paths:
                continue
            if not should_skip_path(repo_rel):
                files.add(repo_rel)
            continue
        for child in target.rglob("*"):
            if not child.is_file():
                continue
            repo_rel = child.relative_to(root).as_posix()
            if repo_rel in exclude_paths:
                continue
            if should_skip_path(repo_rel):
                continue
            files.add(repo_rel)
    return sorted(files)


def build_hash_map(root: Path, managed_paths: list[str], exclude_paths: set[str] | None = None) -> dict[str, str]:
    return {rel: file_sha256(root / rel) for rel in iter_managed_files(root, managed_paths, exclude_paths=exclude_paths)}


def classify_file_state(local_hash: str | None, remote_hash: str | None, base_hash: str | None) -> tuple[str, str]:
    if local_hash is not None and remote_hash is not None:
        if base_hash is None:
            if local_hash == remote_hash:
                return "noop", "both-same-without-baseline"
            return "conflict", "both-present-but-no-baseline-and-content-differs"
        if local_hash == remote_hash:
            return "noop", "already-in-sync"
        if local_hash == base_hash:
            return "sync_remote", "remote-only-update"
        if remote_hash == base_hash:
            return "upload_local", "local-only-update"
        return "conflict", "both-changed-same-file"

    if local_hash is not None and remote_hash is None:
        if base_hash is None:
            return "upload_local", "new-local-file"
        return "conflict", "remote-file-deleted-or-missing"

    if local_hash is None and remote_hash is not None:
        if base_hash is None:
            return "sync_remote", "new-remote-file"
        if remote_hash == base_hash:
            return "sync_remote", "local-file-missing-restore-from-remote"
        return "conflict", "local-file-missing-while-remote-changed"

    return "noop", "both-missing"


def load_state(state_path: Path) -> dict:
    if not state_path.exists():
        return {"baseline": {}}
    return json.loads(state_path.read_text(encoding="utf-8"))


def save_state(state_path: Path, config: dict, remote_head: str, baseline: dict[str, str]) -> None:
    payload = {
        "name": config.get("name"),
        "repo": config.get("repo"),
        "branch": config.get("branch", "main"),
        "remote_head": remote_head,
        "managed_paths": config.get("paths", []),
        "baseline": baseline,
    }
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def clone_remote(url: str, branch: str) -> tuple[Path, Path]:
    tmpdir = Path(tempfile.mkdtemp(prefix="data-compliance-upload."))
    repo_dir = tmpdir / "repo"
    run(["git", "clone", "--depth", "1", "--branch", branch, url, str(repo_dir)])
    return tmpdir, repo_dir


def copy_file(src_root: Path, dst_root: Path, rel: str) -> None:
    src = src_root / rel
    dst = dst_root / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)


def plan_actions(local_map: dict[str, str], remote_map: dict[str, str], base_map: dict[str, str]) -> dict[str, list[tuple[str, str]]]:
    actions: dict[str, list[tuple[str, str]]] = {
        "upload_local": [],
        "sync_remote": [],
        "conflict": [],
        "noop": [],
    }
    for rel in sorted(set(local_map) | set(remote_map) | set(base_map)):
        action, reason = classify_file_state(local_map.get(rel), remote_map.get(rel), base_map.get(rel))
        actions[action].append((rel, reason))
    return actions


def print_plan(actions: dict[str, list[tuple[str, str]]]) -> None:
    print(f"upload_local: {len(actions['upload_local'])}")
    for rel, reason in actions["upload_local"]:
        print(f"  + {rel} [{reason}]")
    print(f"sync_remote: {len(actions['sync_remote'])}")
    for rel, reason in actions["sync_remote"]:
        print(f"  < {rel} [{reason}]")
    print(f"conflict: {len(actions['conflict'])}")
    for rel, reason in actions["conflict"]:
        print(f"  ! {rel} [{reason}]")


def print_check(actions: dict[str, list[tuple[str, str]]]) -> int:
    local_only = len(actions["upload_local"])
    remote_only = len(actions["sync_remote"])
    conflicts = len(actions["conflict"])

    if conflicts:
        status = "CONFLICT"
    elif remote_only:
        status = "BEHIND"
    elif local_only:
        status = "AHEAD-LOCAL"
    else:
        status = "UP-TO-DATE"

    print(f"status: {status}")
    print(f"local_only: {local_only}")
    print(f"remote_only: {remote_only}")
    print(f"conflict: {conflicts}")

    if remote_only:
        print("remote updates not in local:")
        for rel, reason in actions["sync_remote"]:
            print(f"  < {rel} [{reason}]")
    if local_only:
        print("local changes not in remote:")
        for rel, reason in actions["upload_local"]:
            print(f"  + {rel} [{reason}]")
    if conflicts:
        print("conflict files:")
        for rel, reason in actions["conflict"]:
            print(f"  ! {rel} [{reason}]")

    if conflicts:
        return 2
    if remote_only:
        return 3
    return 0


def has_git_changes(repo_dir: Path) -> bool:
    result = run(["git", "status", "--porcelain"], cwd=repo_dir)
    return bool(result.stdout.strip())


def command_init(args: argparse.Namespace, config: dict, state_path: Path) -> int:
    tmpdir, repo_dir = clone_remote(config["url"], config.get("branch", "main"))
    try:
        state_rel = state_path.relative_to(workspace_root()).as_posix()
        baseline = build_hash_map(repo_dir, config.get("paths", []), exclude_paths={state_rel})
        remote_head = run(["git", "rev-parse", "HEAD"], cwd=repo_dir).stdout.strip()
        save_state(state_path, config, remote_head, baseline)
        print(f"Initialized state: {state_path}")
        print(f"Tracked files: {len(baseline)}")
        print(f"Remote head: {remote_head}")
        return 0
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def command_plan(args: argparse.Namespace, config: dict, state_path: Path) -> int:
    state = load_state(state_path)
    tmpdir, repo_dir = clone_remote(config["url"], config.get("branch", "main"))
    try:
        state_rel = state_path.relative_to(workspace_root()).as_posix()
        local_map = build_hash_map(workspace_root(), config.get("paths", []), exclude_paths={state_rel})
        remote_map = build_hash_map(repo_dir, config.get("paths", []), exclude_paths={state_rel})
        actions = plan_actions(local_map, remote_map, state.get("baseline", {}))
        print_plan(actions)
        return 2 if actions["conflict"] else 0
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def command_check(args: argparse.Namespace, config: dict, state_path: Path) -> int:
    state = load_state(state_path)
    tmpdir, repo_dir = clone_remote(config["url"], config.get("branch", "main"))
    try:
        state_rel = state_path.relative_to(workspace_root()).as_posix()
        local_map = build_hash_map(workspace_root(), config.get("paths", []), exclude_paths={state_rel})
        remote_map = build_hash_map(repo_dir, config.get("paths", []), exclude_paths={state_rel})
        actions = plan_actions(local_map, remote_map, state.get("baseline", {}))
        return print_check(actions)
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def command_upload(args: argparse.Namespace, config: dict, state_path: Path) -> int:
    state = load_state(state_path)
    tmpdir, repo_dir = clone_remote(config["url"], config.get("branch", "main"))
    try:
        base_map = state.get("baseline", {})
        managed_paths = config.get("paths", [])
        local_root = workspace_root()
        state_rel = state_path.relative_to(workspace_root()).as_posix()
        excluded = {state_rel}
        local_map = build_hash_map(local_root, managed_paths, exclude_paths=excluded)
        remote_map = build_hash_map(repo_dir, managed_paths, exclude_paths=excluded)
        actions = plan_actions(local_map, remote_map, base_map)
        print_plan(actions)

        if actions["conflict"]:
            print("Upload aborted because the same managed file changed in more than one place.")
            print("Please sync/resolve these conflict files before pushing.")
            return 2

        for rel, _reason in actions["sync_remote"]:
            copy_file(repo_dir, local_root, rel)

        for rel, _reason in actions["upload_local"]:
            copy_file(local_root, repo_dir, rel)

        if has_git_changes(repo_dir):
            run(["git", "add", "-A"], cwd=repo_dir)
            commit_message = args.message or "chore: sync local data compliance workspace"
            run(["git", "commit", "-m", commit_message], cwd=repo_dir)
            run(["git", "push", "origin", config.get("branch", "main")], cwd=repo_dir)
            remote_head = run(["git", "rev-parse", "HEAD"], cwd=repo_dir).stdout.strip()
            print(f"Pushed commit: {remote_head}")
        else:
            remote_head = run(["git", "rev-parse", "HEAD"], cwd=repo_dir).stdout.strip()
            print("No remote push needed; workspace was already aligned after safe sync.")

        baseline = build_hash_map(repo_dir, managed_paths, exclude_paths=excluded)
        save_state(state_path, config, remote_head, baseline)
        return 0
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Safely sync and upload the data compliance project without overwriting teammate updates.")
    parser.add_argument("command", choices=["init", "check", "plan", "upload"])
    parser.add_argument("--config", default=str(default_config_path()))
    parser.add_argument("--message", help="Commit message for upload mode.")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    config_path = Path(args.config).resolve()
    config, state_path = load_config(config_path)

    if args.command == "init":
        return command_init(args, config, state_path)
    if args.command == "plan":
        return command_plan(args, config, state_path)
    if args.command == "check":
        return command_check(args, config, state_path)
    if args.command == "upload":
        return command_upload(args, config, state_path)

    parser.error(f"Unknown command: {args.command}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
