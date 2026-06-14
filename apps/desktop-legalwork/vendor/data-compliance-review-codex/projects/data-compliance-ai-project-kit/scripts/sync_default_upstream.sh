#!/bin/zsh
set -euo pipefail

WORKSPACE="/Users/xiangyang/.openclaw/workspace"
PROJECT_DIR="$WORKSPACE/projects/data-compliance-ai-project-kit"
CONFIG_PATH="$PROJECT_DIR/config/default-sync-source.json"

if [ ! -f "$CONFIG_PATH" ]; then
  echo "Missing config: $CONFIG_PATH" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required" >&2
  exit 1
fi

mapfile_output=$(python3 - "$CONFIG_PATH" <<'PY'
import json, sys
p = sys.argv[1]
obj = json.load(open(p, 'r', encoding='utf-8'))
print(obj['url'])
print(obj.get('branch', 'main'))
for item in obj.get('paths', []):
    print(item)
PY
)

URL=$(printf '%s\n' "$mapfile_output" | sed -n '1p')
BRANCH=$(printf '%s\n' "$mapfile_output" | sed -n '2p')
PATHS=$(printf '%s\n' "$mapfile_output" | sed -n '3,$p')

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT INT TERM
REPO_DIR="$TMPDIR/repo"

echo "Cloning $URL#$BRANCH ..."
git clone --depth 1 --branch "$BRANCH" "$URL" "$REPO_DIR" >/dev/null

while IFS= read -r rel; do
  [ -z "$rel" ] && continue
  src="$REPO_DIR/$rel"
  dst="$WORKSPACE/$rel"
  if [ ! -e "$src" ]; then
    echo "Skip missing upstream path: $rel"
    continue
  fi
  mkdir -p "$(dirname "$dst")"
  if [ -d "$src" ]; then
    rsync -a "$src"/ "$dst"/
  else
    rsync -a "$src" "$dst"
  fi
  echo "Synced: $rel"
done <<< "$PATHS"

echo "Done. Default upstream synced for data compliance project only."
