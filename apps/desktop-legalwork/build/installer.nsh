; ─────────────────────────────────────────────────────────────────────────────
; Custom NSIS hooks for the legalwork Windows installer.
;
; Why this exists:
;   legalwork is an Electron app that spawns child processes — the renderer/GPU/
;   utility processes share the legalwork.exe image, and it also launches the
;   agent backend, the data-compliance Python service, and MCP (node) helpers.
;   electron-builder's default app-running check kills only "legalwork.exe" by
;   image name WITHOUT /T, so those children survive, keep files under the install
;   directory locked, and the installer falls into the
;   "应用程序无法关闭，请手动关闭它，然后单击重试" retry loop.
;
; Fix:
;   Override customCheckAppRunning to force-kill the whole legalwork process tree
;   plus anything still running from $INSTDIR, then continue without prompting.
; ─────────────────────────────────────────────────────────────────────────────

!macro customCheckAppRunning
  DetailPrint "正在关闭正在运行的 legalwork…"

  ; 1) Force-kill the entire process tree by image name: the main window plus all
  ;    Electron child processes (all named legalwork.exe) and anything they
  ;    spawned (/T = whole tree, /F = force).
  nsExec::Exec 'taskkill /F /T /IM "${APP_EXECUTABLE_FILENAME}"'
  Pop $0

  ; 2) Kill any orphaned child whose executable lives under the install directory
  ;    (helpers/agents whose image name is not legalwork.exe). Best-effort: if
  ;    PowerShell is unavailable or blocked, step 1 already handled the tree.
  nsExec::Exec `"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $$_.Path -and $$_.Path.StartsWith('$INSTDIR', 'CurrentCultureIgnoreCase') } | ForEach-Object { Stop-Process -Id $$_.ProcessId -Force -ErrorAction SilentlyContinue }"`
  Pop $0

  ; 3) Give Windows a moment to release file handles before files are overwritten.
  Sleep 1500
!macroend
