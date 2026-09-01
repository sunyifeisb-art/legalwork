# Fully bundled Windows installer

The Windows x64 release is built as a complete installer. Release builds download and verify a relocatable CPython 3.11 runtime, install both the Office/document packages and `data-compliance-web/requirements.txt` into it, and place that runtime under `resources/office-runtime`.

End-user machines do not need a system Python installation and do not run `pip` on first launch. The data-compliance service selects the verified bundled interpreter directly when `runtime.json` declares `dataComplianceReady: true` and contains the Paddle/PaddleOCR imports.

## Build

From `apps/desktop-legalwork` on a Windows x64 build host:

```powershell
npm ci
npm run dist:win
```

The first release build downloads CPython and Python wheels into the build cache. Subsequent builds reuse the prepared runtime when both requirements-file hashes match.

## Release contract

- Windows output is x64-only because PaddlePaddle and the scientific Python stack do not provide a complete ia32 wheel set.
- `beforePack` prepares the target runtime and installs all required packages.
- `afterPack` rejects the artifact if Python, Office packages, or any core data-compliance import is missing.
- Runtime startup uses the packaged interpreter in place; user venv creation and first-run dependency downloads remain only as a recovery path for legacy/non-Windows packages.

The fully expanded Python runtime is approximately 1.2 GB before installer compression. Build and distribution infrastructure must allow for the resulting artifact size.
