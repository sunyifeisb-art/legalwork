; Windows installer process handling for LegalWork.
;
; Never query Win32_Process through PowerShell/WMI here. On affected Windows
; machines that query can wait forever, leaving the assisted installer frozen
; at roughly 40% before any application files are extracted.
;
; taskkill is bounded by nsExec's timeout and is only called after nsProcess has
; confirmed that legalwork.exe is running. A clean installation therefore does
; not launch any process-management command at all.

!macro customCheckAppRunning
  StrCpy $R1 0

  legalwork_process_check:
    ${nsProcess::FindProcess} "${APP_EXECUTABLE_FILENAME}" $R0
    ${if} $R0 != 0
      Goto legalwork_process_closed
    ${endif}

    IntOp $R1 $R1 + 1
    ${if} $R1 > 3
      MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "$(appCannotBeClosed)" /SD IDCANCEL IDRETRY legalwork_process_retry
      Quit
    ${endif}

    DetailPrint "正在关闭正在运行的 legalwork（第 $R1 次）…"
    nsExec::ExecToLog /TIMEOUT=10000 '"$SYSDIR\taskkill.exe" /F /T /IM "${APP_EXECUTABLE_FILENAME}"'
    Pop $0
    Sleep 1000
    Goto legalwork_process_check

  legalwork_process_retry:
    StrCpy $R1 0
    Goto legalwork_process_check

  legalwork_process_closed:
!macroend

; electron-builder has already verified and signed these PE files. They use a
; temporary unique extension only so NSIS can write them directly instead of
; expanding them to $PLUGINSDIR and copying 400+ MB a second time.
!macro customInstall
  Rename "$INSTDIR\resources\codex-runtime\bin\codex.codexbin" "$INSTDIR\resources\codex-runtime\bin\codex.exe"
  Rename "$INSTDIR\resources\codex-runtime\bin\codex-code-mode-host.codexbin" "$INSTDIR\resources\codex-runtime\bin\codex-code-mode-host.exe"
  Rename "$INSTDIR\resources\codex-runtime\codex-path\rg.codexbin" "$INSTDIR\resources\codex-runtime\codex-path\rg.exe"
  Rename "$INSTDIR\resources\codex-runtime\codex-resources\codex-command-runner.codexbin" "$INSTDIR\resources\codex-runtime\codex-resources\codex-command-runner.exe"
  Rename "$INSTDIR\resources\codex-runtime\codex-resources\codex-windows-sandbox-setup.codexbin" "$INSTDIR\resources\codex-runtime\codex-resources\codex-windows-sandbox-setup.exe"
!macroend
