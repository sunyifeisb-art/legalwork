#!/bin/bash
set -euo pipefail

WEB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE_ROOT="$(cd "$WEB_DIR/.." && pwd)"
PROJECT_DIR="$WORKSPACE_ROOT/projects/data-compliance-ai-project-kit"
HOST_PYTHON="$(command -v python3)"
RUNTIME_PYTHON="${COMPLIANCEAI_RUNTIME_PYTHON:-$HOST_PYTHON}"

APP_NAME="ComplianceAI"
APP_DISPLAY_NAME="数律通"
ICON_SOURCE="${2:-$WEB_DIR/static/logo.svg}"
TARGET_ARCH="${3:-arm64}"
BUILD_ID="$(date +%Y%m%d%H%M%S)"

case "$TARGET_ARCH" in
  arm64)
    ARCH_LABEL="AppleSilicon"
    TARGET_TRIPLE="arm64-apple-macos12.0"
    ;;
  x86_64)
    ARCH_LABEL="Intel"
    TARGET_TRIPLE="x86_64-apple-macos12.0"
    ;;
  *)
    echo "不支持的架构: $TARGET_ARCH" >&2
    echo "可选值: arm64 | x86_64" >&2
    exit 1
    ;;
esac

APP_BUNDLE="${1:-$HOME/Desktop/${APP_NAME}-${ARCH_LABEL}.app}"
ICON_BASENAME="AppIcon-${BUILD_ID}"

TMP_DIR="$(mktemp -d)"
ICONSET_DIR="$TMP_DIR/${APP_NAME}.iconset"
PNG_BASE="$TMP_DIR/${APP_NAME}.png"
STYLED_PNG="$TMP_DIR/${APP_NAME}-styled.png"
TMP_PYTHON_LIB="$TMP_DIR/python-lib"
VENV_SITE_PACKAGES="$(find "$WEB_DIR/venv/lib" -maxdepth 3 -type d -name site-packages 2>/dev/null | head -n 1 || true)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [ ! -f "$ICON_SOURCE" ]; then
  echo "未找到图标文件: $ICON_SOURCE" >&2
  exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
  echo "未找到项目目录: $PROJECT_DIR" >&2
  exit 1
fi

mkdir -p "$ICONSET_DIR" "$TMP_PYTHON_LIB"

case "${ICON_SOURCE##*.}" in
  png|PNG|jpg|JPG|jpeg|JPEG)
    cp "$ICON_SOURCE" "$PNG_BASE"
    ;;
  *)
    qlmanage -t -s 1024 -o "$TMP_DIR" "$ICON_SOURCE" >/dev/null 2>&1
    GENERATED_PNG="$(find "$TMP_DIR" -maxdepth 1 -name '*.png' | head -n 1)"
    if [ -z "$GENERATED_PNG" ]; then
      echo "图标转 PNG 失败" >&2
      exit 1
    fi
    mv "$GENERATED_PNG" "$PNG_BASE"
    ;;
esac

"$HOST_PYTHON" - <<'PY' "$PNG_BASE" "$STYLED_PNG"
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import sys

src = Path(sys.argv[1])
dst = Path(sys.argv[2])

base = Image.open(src).convert("RGBA")
canvas_size = 1024
tile_size = 900
logo_max_size = 690
corner_radius = 196
shadow_blur = 26
shadow_offset = 12
tile_left = (canvas_size - tile_size) // 2
tile_top = (canvas_size - tile_size) // 2
tile_right = tile_left + tile_size
tile_bottom = tile_top + tile_size

pixels = base.load()
min_x = base.width
min_y = base.height
max_x = -1
max_y = -1
for y in range(base.height):
    for x in range(base.width):
        r, g, b, a = pixels[x, y]
        if a > 10 and not (r > 248 and g > 248 and b > 248):
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

if max_x >= min_x and max_y >= min_y:
    pad = 16
    base = base.crop((
        max(0, min_x - pad),
        max(0, min_y - pad),
        min(base.width, max_x + pad + 1),
        min(base.height, max_y + pad + 1),
    ))

canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
shadow_layer = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
shadow_mask = Image.new("L", (canvas_size, canvas_size), 0)
shadow_draw = ImageDraw.Draw(shadow_mask)

shadow_draw.rounded_rectangle(
    [tile_left, tile_top + shadow_offset, tile_right, tile_bottom + shadow_offset],
    radius=corner_radius,
    fill=135,
)
shadow_layer.putalpha(shadow_mask.filter(ImageFilter.GaussianBlur(shadow_blur)))
canvas.alpha_composite(shadow_layer)

tile = Image.new("RGBA", (tile_size, tile_size), (255, 255, 255, 255))
tile_draw = ImageDraw.Draw(tile)
tile_draw.rounded_rectangle(
    [0, 0, tile_size - 1, tile_size - 1],
    radius=corner_radius,
    outline=(224, 224, 219, 255),
    width=2,
)

scale = min(logo_max_size / base.width, logo_max_size / base.height)
logo_size = (
    max(1, int(base.width * scale)),
    max(1, int(base.height * scale)),
)
logo = base.resize(logo_size, Image.LANCZOS)
logo_x = (tile_size - logo.width) // 2
logo_y = (tile_size - logo.height) // 2 - 8
tile.alpha_composite(logo, (logo_x, logo_y))

tile_mask = Image.new("L", (tile_size, tile_size), 0)
ImageDraw.Draw(tile_mask).rounded_rectangle(
    [0, 0, tile_size, tile_size],
    radius=corner_radius,
    fill=255,
)
rounded_tile = Image.new("RGBA", (tile_size, tile_size), (0, 0, 0, 0))
rounded_tile.paste(tile, (0, 0), tile_mask)

canvas.alpha_composite(rounded_tile, (tile_left, tile_top))
canvas.save(dst)
PY

for size in 16 32 128 256 512; do
  sips -z "$size" "$size" "$STYLED_PNG" --out "$ICONSET_DIR/icon_${size}x${size}.png" >/dev/null
  retina=$((size * 2))
  sips -z "$retina" "$retina" "$STYLED_PNG" --out "$ICONSET_DIR/icon_${size}x${size}@2x.png" >/dev/null
done

if [ -n "$VENV_SITE_PACKAGES" ] && [ -d "$VENV_SITE_PACKAGES/flask" ]; then
  rsync -a "$VENV_SITE_PACKAGES/" "$TMP_PYTHON_LIB/"
else
  "$RUNTIME_PYTHON" -m pip install --quiet --upgrade --no-compile --target "$TMP_PYTHON_LIB" -r "$WEB_DIR/requirements.txt"
fi

rm -rf "$APP_BUNDLE"
mkdir -p "$APP_BUNDLE/Contents/MacOS" "$APP_BUNDLE/Contents/Resources"

PAYLOAD_ROOT="$APP_BUNDLE/Contents/Resources/payload"
WEB_PAYLOAD="$PAYLOAD_ROOT/web"
PROJECT_PAYLOAD="$PAYLOAD_ROOT/projects/data-compliance-ai-project-kit"
PYTHON_LIB_PAYLOAD="$APP_BUNDLE/Contents/Resources/python-lib"

mkdir -p "$WEB_PAYLOAD" "$PROJECT_PAYLOAD" "$PYTHON_LIB_PAYLOAD"

rsync -a \
  --exclude 'venv' \
  --exclude 'output' \
  --exclude 'uploads' \
  --exclude '__pycache__' \
  --exclude '.git' \
  --exclude '*.pyc' \
  "$WEB_DIR/" "$WEB_PAYLOAD/"

rsync -a \
  --exclude 'tests' \
  --exclude 'docs' \
  --exclude 'references' \
  --exclude 'workflows' \
  --exclude 'skill' \
  --exclude 'samples' \
  --exclude '__pycache__' \
  --exclude '.git' \
  --exclude '*.pyc' \
  "$PROJECT_DIR/" "$PROJECT_PAYLOAD/"

rsync -a "$TMP_PYTHON_LIB/" "$PYTHON_LIB_PAYLOAD/"

iconutil -c icns "$ICONSET_DIR" -o "$APP_BUNDLE/Contents/Resources/${ICON_BASENAME}.icns"

cat >"$APP_BUNDLE/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>
  <string>${APP_NAME}</string>
  <key>CFBundleDisplayName</key>
  <string>${APP_DISPLAY_NAME}</string>
  <key>CFBundleExecutable</key>
  <string>${APP_NAME}</string>
  <key>CFBundleIdentifier</key>
  <string>com.complianceai.desktop</string>
  <key>CFBundleVersion</key>
  <string>${BUILD_ID}</string>
  <key>CFBundleShortVersionString</key>
  <string>1.2</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleIconFile</key>
  <string>${ICON_BASENAME}</string>
  <key>LSMinimumSystemVersion</key>
  <string>12.0</string>
  <key>LSApplicationCategoryType</key>
  <string>public.app-category.business</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>NSAppTransportSecurity</key>
  <dict>
    <key>NSExceptionDomains</key>
    <dict>
      <key>localhost</key>
      <dict>
        <key>NSExceptionAllowsInsecureHTTPLoads</key>
        <true/>
      </dict>
      <key>127.0.0.1</key>
      <dict>
        <key>NSExceptionAllowsInsecureHTTPLoads</key>
        <true/>
      </dict>
    </dict>
  </dict>
</dict>
</plist>
PLIST

SWIFT_SOURCE="$TMP_DIR/${APP_NAME}.swift"
cat >"$SWIFT_SOURCE" <<SWIFT
import Cocoa
import Foundation
import WebKit

final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate, WKUIDelegate {
    private var window: NSWindow!
    private var webView: WKWebView!
    private var serverTask: Process?

    private var resourceRoot: String {
        Bundle.main.resourceURL!.path
    }

    private var webDir: String {
        resourceRoot + "/payload/web"
    }

    private var pythonLib: String {
        resourceRoot + "/python-lib"
    }

    private let port = 5100

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.regular)
        installMenu()
        createWindow()
        startServer()
        pollServerReadiness()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }

    private func installMenu() {
        let mainMenu = NSMenu()

        let appMenuItem = NSMenuItem()
        mainMenu.addItem(appMenuItem)

        let appMenu = NSMenu()
        let aboutItem = NSMenuItem(title: "关于 数律通", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        appMenu.addItem(aboutItem)
        appMenu.addItem(NSMenuItem.separator())

        let hideItem = NSMenuItem(title: "隐藏 数律通", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        hideItem.keyEquivalentModifierMask = [.command]
        appMenu.addItem(hideItem)

        let hideOthersItem = NSMenuItem(title: "隐藏其他", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthersItem.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(hideOthersItem)

        let showAllItem = NSMenuItem(title: "显示全部", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(showAllItem)
        appMenu.addItem(NSMenuItem.separator())

        let quitItem = NSMenuItem(title: "退出 数律通", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        quitItem.keyEquivalentModifierMask = [.command]
        appMenu.addItem(quitItem)

        appMenuItem.submenu = appMenu
        NSApp.mainMenu = mainMenu
    }

    func applicationWillTerminate(_ notification: Notification) {
        if let task = serverTask, task.isRunning {
            task.terminate()
        }
    }

    private func createWindow() {
        let rect = NSRect(x: 0, y: 0, width: 1440, height: 960)
        window = NSWindow(
            contentRect: rect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        window.appearance = NSAppearance(named: .aqua)
        window.backgroundColor = .white
        window.title = ""
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.isMovableByWindowBackground = true
        if #available(macOS 11.0, *) {
            window.toolbarStyle = .unified
        }
        window.center()
        window.minSize = NSSize(width: 1200, height: 820)

        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: rect, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.autoresizingMask = [.width, .height]
        window.contentView = webView
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func webView(
        _ webView: WKWebView,
        runOpenPanelWith parameters: WKOpenPanelParameters,
        initiatedByFrame frame: WKFrameInfo,
        completionHandler: @escaping ([URL]?) -> Void
    ) {
        let panel = NSOpenPanel()
        panel.allowsMultipleSelection = parameters.allowsMultipleSelection
        panel.canChooseDirectories = false
        panel.canChooseFiles = true
        panel.resolvesAliases = true

        if panel.runModal() == .OK {
            completionHandler(panel.urls)
        } else {
            completionHandler(nil)
        }
    }

    private func startServer() {
        let process = Process()
        process.currentDirectoryURL = URL(fileURLWithPath: webDir)
        process.executableURL = URL(fileURLWithPath: "${RUNTIME_PYTHON}")
        process.arguments = [webDir + "/server_entry.py", "--port", String(port)]
        var env = ProcessInfo.processInfo.environment
        env["COMPLIANCEAI_PYTHON"] = "${RUNTIME_PYTHON}"
        env["PYTHONUNBUFFERED"] = "1"
        env["PYTHONPATH"] = pythonLib
        process.environment = env

        let pipe = Pipe()
        process.standardOutput = pipe
        process.standardError = pipe
        pipe.fileHandleForReading.readabilityHandler = { handle in
            let data = handle.availableData
            guard !data.isEmpty, let text = String(data: data, encoding: .utf8) else { return }
            fputs(text, stderr)
        }

        do {
            try process.run()
            serverTask = process
        } catch {
            showFatal("无法启动本地服务：\\(error.localizedDescription)")
        }
    }

    private func pollServerReadiness() {
        let url = URL(string: "http://127.0.0.1:\\(port)/")!
        let deadline = Date().addingTimeInterval(30)
        func tryLoad() {
            guard Date() < deadline else {
                showFatal("应用启动超时，请检查打包资源是否完整。")
            }
            let task = URLSession.shared.dataTask(with: url) { [weak self] _, response, _ in
                guard let self else { return }
                if let http = response as? HTTPURLResponse, http.statusCode == 200 {
                    DispatchQueue.main.async {
                        self.webView.load(URLRequest(url: url))
                    }
                    return
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                    tryLoad()
                }
            }
            task.resume()
        }
        tryLoad()
    }

    private func showFatal(_ message: String) -> Never {
        let alert = NSAlert()
        alert.alertStyle = .critical
        alert.messageText = "数律通启动失败"
        alert.informativeText = message
        alert.runModal()
        NSApp.terminate(nil)
        exit(1)
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
SWIFT

swiftc \
  -target "$TARGET_TRIPLE" \
  -framework Cocoa \
  -framework WebKit \
  "$SWIFT_SOURCE" \
  -o "$APP_BUNDLE/Contents/MacOS/${APP_NAME}"

chmod +x "$APP_BUNDLE/Contents/MacOS/${APP_NAME}"
codesign --force --deep -s - "$APP_BUNDLE"

echo "已生成: $APP_BUNDLE"
