#!/bin/bash
set -euo pipefail

APP_PATH="${1:?请传入 .app 路径}"
DMG_PATH="${2:?请传入 .dmg 输出路径}"
VOL_NAME="${3:-ComplianceAI}"

if [ ! -d "$APP_PATH" ]; then
  echo "未找到应用包: $APP_PATH" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d /tmp/complianceai-dmg.XXXXXX)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

cp -R "$APP_PATH" "$TMP_DIR/ComplianceAI.app"
ln -s /Applications "$TMP_DIR/Applications"

rm -f "$DMG_PATH"
hdiutil create \
  -volname "$VOL_NAME" \
  -srcfolder "$TMP_DIR" \
  -format UDZO \
  -imagekey zlib-level=9 \
  "$DMG_PATH"

echo "已生成: $DMG_PATH"
