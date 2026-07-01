#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: bash scripts/legalwork-update-workflow.sh v0.2.3 [branch]"
  exit 1
fi

release_tag="$1"
branch="${2:-$(git rev-parse --abbrev-ref HEAD)}"

git push origin "$branch"
gh workflow run legalwork-update.yml \
  --ref "$branch" \
  -f version_tag="$release_tag" \
  -f run_release=true

echo "Triggered legalwork更新工作流 for $release_tag on $branch."
