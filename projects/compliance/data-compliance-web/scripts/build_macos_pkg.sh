#!/bin/bash
set -euo pipefail

APP_PATH="${1:?请传入 .app 路径}"
PKG_PATH="${2:?请传入 .pkg 输出路径}"
IDENTIFIER="${3:-com.complianceai.desktop}"
VERSION="${4:-1.2.0}"

if [ ! -d "$APP_PATH" ]; then
  echo "未找到应用包: $APP_PATH" >&2
  exit 1
fi

rm -f "$PKG_PATH"
pkgbuild \
  --component "$APP_PATH" \
  --install-location /Applications \
  --identifier "$IDENTIFIER" \
  --version "$VERSION" \
  "$PKG_PATH"

echo "已生成: $PKG_PATH"
