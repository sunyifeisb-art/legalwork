#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [ -L "DeepSeek-GUI" ]; then
  rm "DeepSeek-GUI"
fi

if [ -L "主项目" ]; then
  rm "主项目"
fi

if [ -d "archive/legalwork-runtime-tmp-20260612" ]; then
  mkdir -p "apps/desktop-legalwork"
  mv "archive/legalwork-runtime-tmp-20260612" "apps/desktop-legalwork/legalwork_tmp"
fi

if [ -d "apps/desktop-legalwork" ]; then
  mv "apps/desktop-legalwork" "主项目"
fi

if [ -d "projects/compliance" ]; then
  mv "projects/compliance" "合规"
fi

rmdir apps projects archive 2>/dev/null || true

echo "Organization has been undone."
