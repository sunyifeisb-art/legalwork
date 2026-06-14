# Agent Runtime Notes

DeepSeek GUI has one live agent runtime: **Legalwork**.

Do not add a second live provider, provider switcher, runtime diagnostics panel,
or legacy CodeWhale/Reasonix process path. Code, Write, and Connect phone all
enter the same Legalwork HTTP/SSE boundary. Connect phone still uses the internal
`claw` name in code for compatibility.

## Allowed Extension Path

1. Add protocol fields in `legalwork/src/contracts/`.
2. Add agent behavior in `legalwork/src/loop/`, `legalwork/src/services/`, or a
   new port/adapter under `legalwork/src/ports/` and `legalwork/src/adapters/`.
3. Add HTTP endpoints under `legalwork/src/server/routes/`.
4. Map the endpoint/event in `src/renderer/src/agent/legalwork-runtime.ts` and
   `src/renderer/src/agent/legalwork-mapper.ts`.
5. Add settings only under `agents.legalwork`.

## Forbidden Paths

- No `AgentSwitcher`.
- No `ConnectionStatusBar`.
- No `RuntimeDiagnosticsDialog` or runtime self-check UI.
- No CodeWhale/Reasonix adapter, process manager, RPC bridge, updater, or
  importer.
- No drawing/design starter card in the core workbench.
- No `/usage` or `/runtime` slash command that opens a runtime control panel.

## Legacy Data Rule

Old persisted keys may be read only inside settings migration:

- `agentProvider: codewhale | reasonix | deepseek-runtime` maps to `legalwork`.
- `agents.codewhale`, `agents.reasonix`, and legacy `deepseek` values seed
  `agents.legalwork` once.
- Saved settings must contain only `agents.legalwork`.
- Old Connect phone (internal Claw) `agentThreadIds.codewhale/reasonix` fold into
  `agentThreadIds.legalwork`.

## Verification

Run:

```bash
npm run typecheck
npm test
npm run build
```

Manual smoke:

- Code can create a Legalwork thread, stream a reply, approve/deny tools, and
  interrupt a turn.
- CodeWhale parity endpoints still work through Legalwork: thread search/archive
  filters, fork, session resume, request_user_input submit/cancel, and usage.
- Cache telemetry uses DeepSeek native `prompt_cache_hit_tokens` /
  `prompt_cache_miss_tokens`; hot Legalwork turns should stay above 90% cache
  hit after the stable prefix is warm.
- Immutable prefix drift and malformed tool-call/tool-result history must be
  caught before a request reaches DeepSeek.
- Write can open the workspace, request inline completion, and use selected-text
  assistant actions.
- Connect phone can save settings and run a manual task through a Legalwork thread.
- Settings -> Agents shows only Legalwork.

The full plan is in
[`docs/legalwork-architecture.md`](./legalwork-architecture.md).
