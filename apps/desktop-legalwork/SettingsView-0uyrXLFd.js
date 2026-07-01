import { j as jsxRuntimeExports, r as reactExports } from "./index-B4j9Op60.js";
import { B as normalizeKeyboardShortcuts, C as legalworkSettingsEnvelope, E as mergeLegalworkRuntimeSettings, A as getLegalworkRuntimeSettings, G as defaultLegalworkRuntimeSettings, H as normalizeModelProviderSettings, ae as computeLegalworkRuntimeCredentialPatch, af as mergeModelProviderSettings, ag as applyLegalworkRuntimePatch, ah as describeRuntimeError, ai as DEFAULT_MODEL_PROVIDER_ID, M as getModelProviderProfile, aj as getBuiltinModelProviderPreset, ak as BUILTIN_MODEL_PROVIDER_PRESETS, al as legalworkSettingsPatch, am as defaultModelProviderSettings, an as DEFAULT_LEGALWORK_DATA_DIR, ao as isLegalworkRuntimeInsecure, ap as CLAW_MODEL_IDS, aq as resolveKeyboardShortcutBindings, ar as KEYBOARD_SHORTCUT_COMMANDS, as as keyboardEventToShortcut, at as findKeyboardShortcutConflict, u as useTranslation, a as useChatStore, J as rendererRuntimeClient, K as applyTheme, au as applyUiFontScale, L as getActiveAgentApiKey, O as normalizeWorkspaceRoot, I as getModelProviderSettings, P as getProvider, R as formatWorkspacePickerError, av as emitRendererSettingsChanged } from "./AppShell-v55ftZWO.js";
import { l as loadPreferredSkillRootId, j as joinFsPath, s as savePreferredSkillRootId } from "./skill-root-preference-DwpyJf0D.js";
import { c as createLucideIcon, n as normalizeGuiUpdateChannel, D as DEFAULT_GUI_UPDATE_CHANNEL, a as normalizeWriteSettings, m as mergeWriteSettings, E as EyeOff, b as Eye } from "./eye-CYroo_7J.js";
import { B as Bot } from "./bot-RRSshz5G.js";
import { d as Smartphone, R as RefreshCw, b as Settings, F as FolderOpen, P as Plus, T as Trash2, f as formatCost, e as formatCompactNumber, L as LoaderCircle, p as parseUsageResponse, a as ChevronDown, S as Search, g as RotateCcw, c as CircleAlert, C as CircleCheck, D as Download } from "./use-thread-usage-WlzQOMbI.js";
import { a as normalizeScheduleSettings, m as mergeScheduleSettings } from "./app-settings-schedule-CkgCjLm0.js";
import { a as normalizeClawSettings, b as normalizeAppBehaviorSettings, m as mergeClawSettings } from "./app-settings-normalize-DJIur5zQ.js";
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M4.929 4.929 19.07 19.071", key: "196cmz" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Ban = createLucideIcon("ban", __iconNode$3);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$2);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode$1);
/**
 * @license lucide-react v0.544.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 8h.01", key: "1r9ogq" }],
  ["path", { d: "M12 12h.01", key: "1mp3jc" }],
  ["path", { d: "M14 8h.01", key: "1primd" }],
  ["path", { d: "M16 12h.01", key: "1l6xoz" }],
  ["path", { d: "M18 8h.01", key: "emo2bl" }],
  ["path", { d: "M6 8h.01", key: "x9i8wu" }],
  ["path", { d: "M7 16h10", key: "wp8him" }],
  ["path", { d: "M8 12h.01", key: "czm47f" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }]
];
const Keyboard = createLucideIcon("keyboard", __iconNode);
function SettingsSidebar({
  category,
  goBack,
  setCategory,
  t
}) {
  const catCls = (c) => `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition ${category === c ? "bg-ds-subtle text-ds-ink shadow-sm ring-1 ring-ds-border-muted" : "text-ds-muted hover:bg-ds-hover"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "ds-drag flex w-[248px] shrink-0 flex-col border-r border-ds-border bg-ds-sidebar backdrop-blur-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-3 pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "ds-titlebar-safe-block" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: goBack,
          className: "ds-no-drag flex items-center gap-2 rounded-xl px-2 py-2 text-[14px] text-ds-muted hover:bg-ds-hover hover:text-ds-ink",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4", strokeWidth: 1.75 }),
            t("back")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "ds-no-drag flex flex-col gap-0.5 px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: catCls("general"), onClick: () => setCategory("general"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 shrink-0 opacity-70", strokeWidth: 1.75 }),
        t("general")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: catCls("agents"), onClick: () => setCategory("agents"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-4 w-4 shrink-0 opacity-70", strokeWidth: 1.75 }),
        t("agents")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: catCls("shortcuts"), onClick: () => setCategory("shortcuts"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4 shrink-0 opacity-70", strokeWidth: 1.75 }),
        t("keyboardShortcuts")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: catCls("claw"), onClick: () => setCategory("claw"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 shrink-0 opacity-70", strokeWidth: 1.75 }),
        t("claw")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: catCls("guiUpdate"), onClick: () => setCategory("guiUpdate"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 shrink-0 opacity-70", strokeWidth: 1.75 }),
        t("guiUpdate")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ds-no-drag mt-auto border-t border-ds-border p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl px-2 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-ds-subtle text-ds-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4", strokeWidth: 1.75 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-[12px] text-ds-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-medium text-ds-ink", children: "legalwork" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: t("settingsFooter") })
      ] })
    ] }) })
  ] });
}
const DEFAULT_WORKSPACE_ROOT = "~/.legalwork/default_workspace";
function splitSettingsList(raw) {
  return raw.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
}
function listSettingsText(values) {
  return values.join("\n");
}
function hasValidPort(settings) {
  const port = getLegalworkRuntimeSettings(settings).port;
  return Number.isFinite(port) && port >= 1 && port <= 65535;
}
function mergeSettings(current, patch) {
  const safeCurrent = coerceRendererSettings(current);
  const { agents: agentsPatch, provider: providerPatch, ...restPatch } = patch;
  const agentsPatchWithCredentials = computeLegalworkRuntimeCredentialPatch(safeCurrent, {
    agents: agentsPatch,
    provider: providerPatch
  });
  return {
    ...applyLegalworkRuntimePatch(safeCurrent, agentsPatchWithCredentials.legalwork),
    ...restPatch,
    provider: mergeModelProviderSettings(safeCurrent.provider, providerPatch),
    log: {
      ...safeCurrent.log,
      ...patch.log ?? {}
    },
    notifications: {
      ...safeCurrent.notifications,
      ...patch.notifications ?? {}
    },
    appBehavior: normalizeAppBehaviorSettings({
      ...safeCurrent.appBehavior,
      ...patch.appBehavior ?? {}
    }),
    keyboardShortcuts: normalizeKeyboardShortcuts({
      bindings: {
        ...safeCurrent.keyboardShortcuts.bindings,
        ...patch.keyboardShortcuts?.bindings ?? {}
      }
    }),
    write: mergeWriteSettings(safeCurrent.write, patch.write),
    claw: mergeClawSettings(safeCurrent.claw, patch.claw),
    schedule: mergeScheduleSettings(safeCurrent.schedule, patch.schedule),
    guiUpdate: {
      ...safeCurrent.guiUpdate,
      ...patch.guiUpdate ?? {}
    }
  };
}
function coerceRendererSettings(settings) {
  const raw = settings;
  const theme = raw.theme === "system" || raw.theme === "light" || raw.theme === "dark" ? raw.theme : "system";
  const uiFontScale = raw.uiFontScale === "small" || raw.uiFontScale === "medium" || raw.uiFontScale === "large" ? raw.uiFontScale : "medium";
  return {
    version: 1,
    locale: raw.locale === "zh" ? "zh" : "en",
    theme,
    uiFontScale,
    provider: normalizeModelProviderSettings(raw.provider),
    agents: legalworkSettingsEnvelope(mergeLegalworkRuntimeSettings(defaultLegalworkRuntimeSettings(), getLegalworkRuntimeSettings(settings))),
    workspaceRoot: typeof raw.workspaceRoot === "string" ? raw.workspaceRoot : DEFAULT_WORKSPACE_ROOT,
    log: {
      enabled: raw.log?.enabled !== false,
      retentionDays: typeof raw.log?.retentionDays === "number" ? raw.log.retentionDays : 2
    },
    notifications: {
      turnComplete: raw.notifications?.turnComplete !== false
    },
    appBehavior: normalizeAppBehaviorSettings(raw.appBehavior),
    keyboardShortcuts: normalizeKeyboardShortcuts(raw.keyboardShortcuts),
    write: normalizeWriteSettings(raw.write),
    claw: normalizeClawSettings(raw.claw),
    schedule: normalizeScheduleSettings(raw.schedule),
    guiUpdate: {
      channel: normalizeGuiUpdateChannel(raw.guiUpdate?.channel ?? DEFAULT_GUI_UPDATE_CHANNEL)
    }
  };
}
function guiUpdateFailureMessage(info, t) {
  switch (info.code) {
    case "not_configured":
      return t("guiUpdateErrNotConfigured");
    case "unsupported":
      return t("guiUpdateErrUnsupported");
    case "download_failed":
      return t("guiUpdateErrDownloadFailed", { message: info.message.trim() });
    case "install_failed":
      return t("guiUpdateErrInstallFailed", { message: info.message.trim() });
    case "github_repo_not_found":
      return t("guiUpdateErrRepoNotFound", { repo: info.repo?.trim() || "owner/repo" });
    case "github_forbidden":
      return t("guiUpdateErrForbidden");
    case "github_rate_limited":
      return t("guiUpdateErrRateLimit");
    case "no_stable_version":
      return t("guiUpdateErrNoStableVersion", { repo: info.repo?.trim() || "—" });
    default:
      return info.message.trim() || t("guiUpdateCheckFailed");
  }
}
function useSettingsGuiUpdate({
  category,
  channel,
  form,
  t
}) {
  const [guiUpdateInfo, setGuiUpdateInfo] = reactExports.useState(null);
  const [checkingGuiUpdate, setCheckingGuiUpdate] = reactExports.useState(false);
  const [downloadingGuiUpdate, setDownloadingGuiUpdate] = reactExports.useState(false);
  const [installingGuiUpdate, setInstallingGuiUpdate] = reactExports.useState(false);
  const [guiUpdateDownloaded, setGuiUpdateDownloaded] = reactExports.useState(false);
  const [guiUpdateProgress, setGuiUpdateProgress] = reactExports.useState(null);
  const [guiUpdateError, setGuiUpdateError] = reactExports.useState(null);
  const checkedGuiUpdateChannel = reactExports.useRef(null);
  const resetGuiUpdateState = reactExports.useCallback(() => {
    setGuiUpdateInfo(null);
    setGuiUpdateError(null);
    setGuiUpdateDownloaded(false);
    setGuiUpdateProgress(null);
  }, []);
  const applyGuiUpdateState = reactExports.useCallback((state) => {
    if ("info" in state && state.info) {
      setGuiUpdateInfo(state.info);
    }
    if (state.status === "checking") {
      setCheckingGuiUpdate(true);
      setGuiUpdateError(null);
      return;
    }
    if (state.status === "available" || state.status === "not_available") {
      setCheckingGuiUpdate(false);
      setDownloadingGuiUpdate(false);
      setInstallingGuiUpdate(false);
      setGuiUpdateProgress(null);
      setGuiUpdateDownloaded(Boolean(state.info.downloaded));
      setGuiUpdateError(null);
      return;
    }
    if (state.status === "downloading") {
      setCheckingGuiUpdate(false);
      setDownloadingGuiUpdate(true);
      setInstallingGuiUpdate(false);
      setGuiUpdateProgress(state.progress);
      setGuiUpdateError(null);
      return;
    }
    if (state.status === "downloaded") {
      setCheckingGuiUpdate(false);
      setDownloadingGuiUpdate(false);
      setGuiUpdateProgress(null);
      setGuiUpdateDownloaded(true);
      setGuiUpdateError(null);
      return;
    }
    if (state.status === "installing") {
      setCheckingGuiUpdate(false);
      setDownloadingGuiUpdate(false);
      setInstallingGuiUpdate(true);
      setGuiUpdateProgress(null);
      setGuiUpdateError(null);
      return;
    }
    if (state.status === "error") {
      setCheckingGuiUpdate(false);
      setDownloadingGuiUpdate(false);
      setInstallingGuiUpdate(false);
      setGuiUpdateProgress(null);
      setGuiUpdateError(state.message);
    }
  }, []);
  const checkGuiUpdate = reactExports.useCallback(async () => {
    if (typeof window.dsGui?.checkGuiUpdate !== "function") return;
    setCheckingGuiUpdate(true);
    setGuiUpdateError(null);
    try {
      const info = await window.dsGui.checkGuiUpdate(channel);
      setGuiUpdateInfo(info);
      if (!info.ok) {
        setGuiUpdateError(info.code === "not_configured" ? null : guiUpdateFailureMessage(info, t));
      }
    } catch (e) {
      setGuiUpdateError(e instanceof Error ? e.message : String(e));
    } finally {
      setCheckingGuiUpdate(false);
    }
  }, [channel, t]);
  const downloadGuiUpdate = async () => {
    if (typeof window.dsGui?.downloadGuiUpdate !== "function") return;
    setDownloadingGuiUpdate(true);
    setGuiUpdateProgress(null);
    setGuiUpdateError(null);
    try {
      const result = await window.dsGui.downloadGuiUpdate(form?.guiUpdate?.channel);
      if (!result.ok) {
        setGuiUpdateError(result.message);
        return;
      }
      setGuiUpdateDownloaded(true);
    } catch (e) {
      setGuiUpdateError(e instanceof Error ? e.message : String(e));
    } finally {
      setDownloadingGuiUpdate(false);
    }
  };
  const installGuiUpdate = async () => {
    if (typeof window.dsGui?.installGuiUpdate !== "function") return;
    setInstallingGuiUpdate(true);
    setGuiUpdateError(null);
    try {
      const result = await window.dsGui.installGuiUpdate();
      if (!result.ok) {
        setGuiUpdateError(result.message);
        setInstallingGuiUpdate(false);
      }
    } catch (e) {
      setGuiUpdateError(e instanceof Error ? e.message : String(e));
      setInstallingGuiUpdate(false);
    }
  };
  reactExports.useEffect(() => {
    if (typeof window.dsGui?.onGuiUpdateState !== "function") return;
    const unsubscribe = window.dsGui.onGuiUpdateState(applyGuiUpdateState);
    if (typeof window.dsGui?.getGuiUpdateState === "function") {
      void window.dsGui.getGuiUpdateState().then(applyGuiUpdateState).catch(() => void 0);
    }
    return unsubscribe;
  }, [applyGuiUpdateState]);
  reactExports.useEffect(() => {
    if (!form || category !== "general") return;
    if (checkedGuiUpdateChannel.current === (channel ?? null)) return;
    checkedGuiUpdateChannel.current = channel ?? null;
    void checkGuiUpdate();
  }, [category, checkGuiUpdate, channel, form]);
  return {
    checkingGuiUpdate,
    checkGuiUpdate,
    downloadingGuiUpdate,
    downloadGuiUpdate,
    guiUpdateDownloaded,
    guiUpdateError,
    guiUpdateInfo,
    guiUpdateProgress,
    installingGuiUpdate,
    installGuiUpdate,
    resetGuiUpdateState
  };
}
async function loadLegalworkDiagnostics(provider, options = {}) {
  const [runtimeInfo, toolDiagnostics, memoryRecords] = await Promise.allSettled([
    provider.getRuntimeInfo ? provider.getRuntimeInfo() : Promise.resolve(null),
    provider.getToolDiagnostics ? provider.getToolDiagnostics() : Promise.resolve(null),
    provider.listMemories ? provider.listMemories({ workspace: options.workspace, includeDeleted: false }) : Promise.resolve([])
  ]);
  const loaded = { errors: [] };
  if (runtimeInfo.status === "fulfilled") {
    loaded.runtimeInfo = runtimeInfo.value ?? null;
  } else {
    loaded.errors.push(`Runtime: ${errorMessage(runtimeInfo.reason)}`);
  }
  if (toolDiagnostics.status === "fulfilled") {
    loaded.toolDiagnostics = toolDiagnostics.value ?? null;
  } else {
    loaded.errors.push(`Tools: ${errorMessage(toolDiagnostics.reason)}`);
  }
  if (memoryRecords.status === "fulfilled") {
    loaded.memoryRecords = memoryRecords.value ?? [];
  } else {
    loaded.errors.push(`Memory: ${errorMessage(memoryRecords.reason)}`);
  }
  loaded.errors = [...new Set(loaded.errors)];
  return loaded;
}
function errorMessage(error) {
  return describeRuntimeError(error).summary;
}
function SecretInput({
  value,
  onChange,
  visible,
  onToggleVisibility,
  placeholder,
  autoComplete,
  invalid = false,
  showLabel,
  hideLabel,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex w-full min-w-0 items-stretch overflow-hidden rounded-xl bg-ds-card shadow-sm ${className} ${invalid ? "border border-amber-300 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-200" : "border border-ds-border focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/30"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: visible ? "text" : "password",
            autoComplete,
            placeholder,
            className: "min-w-0 flex-1 bg-transparent px-3 py-2 text-[14px] text-ds-ink focus:outline-none",
            value,
            onChange: (e) => onChange(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": visible ? hideLabel : showLabel,
            title: visible ? hideLabel : showLabel,
            onClick: onToggleVisibility,
            className: "shrink-0 border-l border-ds-border-muted px-3 text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink",
            children: visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4", strokeWidth: 1.75 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4", strokeWidth: 1.75 })
          }
        )
      ]
    }
  );
}
function SectionJumpButton({
  label,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: "rounded-full border border-ds-border bg-ds-card px-3 py-1.5 text-[12px] font-medium text-ds-muted shadow-sm transition hover:bg-ds-hover hover:text-ds-ink",
      children: label
    }
  );
}
function InlineNoticeView({
  notice
}) {
  const className = notice.tone === "error" ? "border-red-300/80 bg-red-50 text-red-800 dark:border-red-800/70 dark:bg-red-950/25 dark:text-red-200" : notice.tone === "success" ? "border-emerald-300/80 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-950/25 dark:text-emerald-200" : "border-ds-border bg-ds-main/50 text-ds-muted";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-xl border px-3 py-2 text-[12.5px] leading-5 ${className}`, children: notice.message });
}
function SettingsCard({
  title,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: `rounded-2xl border border-ds-border bg-ds-card/95 shadow-sm shadow-black/5 dark:shadow-black/25 ${className}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-ds-border-muted px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[16px] font-semibold text-ds-ink", children: title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-ds-border-muted px-2 py-1", children })
      ]
    }
  );
}
function SettingRow({
  title,
  description,
  control,
  wideControl = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex gap-3 px-3 py-4 ${wideControl ? "flex-col sm:gap-3.5" : "flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-8"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-w-0 ${wideControl ? "w-full max-w-none shrink-0" : "flex-1"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[14px] font-semibold text-ds-ink", children: title }),
          description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[13px] leading-relaxed text-ds-muted", children: description }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full min-w-0 ${wideControl ? "" : "sm:max-w-[420px]"}`, children: control })
      ]
    }
  );
}
function Toggle({
  checked,
  onChange,
  disabled = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      "aria-disabled": disabled,
      disabled,
      onClick: () => {
        if (!disabled) onChange(!checked);
      },
      className: `relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-emerald-500" : "bg-ds-faint"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-0.5"}`
        }
      )
    }
  );
}
function GeneralSettingsSection({ ctx }) {
  const {
    t,
    tCommon,
    form,
    provider,
    legalwork,
    activeApiKey,
    update,
    updateLegalwork,
    updateSharedCredential,
    sharedApiKey,
    sharedBaseUrl,
    showApiKey,
    setShowApiKey,
    showRuntimeToken,
    setShowRuntimeToken,
    portError,
    selectControlClass,
    openOnboardingPreview,
    pickWorkspace,
    resetWorkspaceToDefault,
    workspacePickerError,
    logPath,
    logDirOpenError,
    setLogDirOpenError,
    pickWriteWorkspace,
    resetWriteWorkspaceToDefault,
    writeWorkspacePickerError,
    writeInlineBaseUrlInherited,
    effectiveWriteInlineBaseUrl,
    writeInlineModelInherited,
    effectiveWriteInlineModel,
    setWriteDebugModalOpen,
    loadWriteDebugEntries,
    scrollToAgentSection,
    agentsSectionRef,
    skillSectionRef,
    mcpSectionRef,
    permissionsSectionRef,
    selectedSkillRoot,
    skillRootOptions,
    skillRootId,
    setSkillRootId,
    skillNotice,
    openSkillRoot,
    openPlugins,
    mcpConfigPath,
    mcpConfigExists,
    mcpConfigText,
    setMcpConfigText,
    mcpLoading,
    mcpBusy,
    mcpNotice,
    saveMcpConfig,
    loadMcpConfig,
    openMcpConfigDir,
    pickClawWorkspace,
    resetClawWorkspaceToDefault,
    clawWorkspacePickerError,
    splitSettingsList: splitSettingsList2,
    listSettingsText: listSettingsText2
  } = ctx;
  const platform = typeof window !== "undefined" ? window.dsGui?.platform ?? "" : "";
  const openAtLoginSupported = platform === "win32" || platform === "darwin";
  const startMinimizedSupported = platform === "win32";
  const desktopBehavior = form.appBehavior;
  const activeProviderId = legalwork.providerId || DEFAULT_MODEL_PROVIDER_ID;
  const activeProvider = getModelProviderProfile(form, activeProviderId);
  const activeProviderPreset = getBuiltinModelProviderPreset(activeProvider.id);
  const buildProviderProfiles = (nextProvider) => provider.providers.some((item) => item.id === nextProvider.id) ? provider.providers.map((item) => item.id === nextProvider.id ? nextProvider : item) : [...provider.providers, nextProvider];
  const updateProviderProfiles = (nextProvider) => {
    const nextProfiles = buildProviderProfiles(nextProvider);
    update({
      provider: nextProvider.id === DEFAULT_MODEL_PROVIDER_ID ? {
        apiKey: nextProvider.apiKey,
        baseUrl: nextProvider.baseUrl,
        providers: nextProfiles
      } : { providers: nextProfiles }
    });
  };
  const updateActiveProviderProfile = (patch) => {
    updateProviderProfiles({ ...activeProvider, ...patch });
  };
  const selectModelProvider = (providerId) => {
    const preset = getBuiltinModelProviderPreset(providerId);
    const current = getModelProviderProfile(form, providerId);
    const nextProvider = {
      ...current,
      id: preset?.id ?? current.id,
      name: preset?.name ?? current.name,
      baseUrl: current.baseUrl || preset?.baseUrl || "",
      endpointFormat: current.endpointFormat || preset?.endpointFormat || "chat_completions",
      models: current.models.length > 0 ? current.models : preset?.models ?? []
    };
    update({
      provider: nextProvider.id === DEFAULT_MODEL_PROVIDER_ID ? {
        apiKey: nextProvider.apiKey,
        baseUrl: nextProvider.baseUrl,
        providers: buildProviderProfiles(nextProvider)
      } : { providers: buildProviderProfiles(nextProvider) },
      agents: legalworkSettingsPatch({
        providerId: nextProvider.id,
        model: nextProvider.models[0] || legalwork.model,
        endpointFormat: nextProvider.endpointFormat
      })
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("sectionGeneral"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("modelProvider"),
          description: t("modelProviderDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full min-w-0 md:max-w-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: selectControlClass,
                value: activeProvider.id,
                onChange: (e) => selectModelProvider(e.target.value),
                children: BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: preset.id, children: [
                  preset.name,
                  " · ",
                  preset.region === "cn" ? t("modelProviderRegionCn") : t("modelProviderRegionGlobal")
                ] }, preset.id))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => selectModelProvider(preset.id),
                className: `rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition ${activeProvider.id === preset.id ? "border-accent/35 bg-accent/10 text-accent" : "border-ds-border bg-ds-card text-ds-muted hover:bg-ds-hover hover:text-ds-ink"}`,
                children: preset.name
              },
              preset.id
            )) })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("apiKey"),
          description: t("apiKeySharedDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            SecretInput,
            {
              value: activeProvider.apiKey,
              onChange: (value) => updateActiveProviderProfile({ apiKey: value }),
              visible: showApiKey,
              onToggleVisibility: () => setShowApiKey((value) => !value),
              placeholder: activeProviderPreset?.apiKeyPlaceholder ?? "sk-...",
              autoComplete: "off",
              invalid: !activeApiKey.trim(),
              showLabel: t("showSecret"),
              hideLabel: t("hideSecret"),
              className: "md:max-w-md"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("baseUrl"),
          description: t("baseUrlSharedDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md",
              placeholder: t("baseUrlPlaceholder"),
              value: activeProvider.baseUrl,
              onChange: (e) => updateActiveProviderProfile({ baseUrl: e.target.value })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("modelProviderModels"),
          description: t("modelProviderModelsDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              rows: 4,
              className: "w-full min-w-0 resize-none rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] leading-5 text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md",
              value: activeProvider.models.join("\n"),
              onChange: (e) => updateActiveProviderProfile({
                models: e.target.value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean)
              })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("language"),
          description: t("languageDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: selectControlClass,
              value: form.locale,
              onChange: (e) => update({ locale: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "English" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "zh", children: "简体中文" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("theme"),
          description: t("themeDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: selectControlClass,
              value: form.theme,
              onChange: (e) => update({ theme: e.target.value }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "system", children: t("themeSystem") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "light", children: t("themeLight") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dark", children: t("themeDark") })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("onboardingPreview"),
          description: t("onboardingPreviewDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: openOnboardingPreview,
              className: "w-full rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover",
              children: t("onboardingPreviewOpen")
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("fontScale"),
          description: t("fontScaleDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: selectControlClass,
              value: form.uiFontScale,
              onChange: (e) => update({
                uiFontScale: e.target.value
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "small", children: t("fontScaleSmall") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: t("fontScaleMedium") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "large", children: t("fontScaleLarge") })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("turnCompleteNotification"),
          description: t("turnCompleteNotificationDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: form.notifications.turnComplete,
              onChange: (v) => update({ notifications: { turnComplete: v } })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("workspaceRoot"),
          description: t("workspaceRootDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full min-w-[200px] md:max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "w-full rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                  value: form.workspaceRoot,
                  onChange: (e) => update({ workspaceRoot: e.target.value }),
                  placeholder: t("workspaceRootPlaceholder")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: resetWorkspaceToDefault,
                  className: "shrink-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover",
                  children: t("restoreWorkspaceDefault")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => void pickWorkspace(),
                  className: "shrink-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover",
                  children: t("browse")
                }
              )
            ] }),
            workspacePickerError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px] leading-5 text-amber-700 dark:text-amber-300", children: workspacePickerError }) : null
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("desktopBehavior"), className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("desktopOpenAtLogin"),
          description: openAtLoginSupported ? t("desktopOpenAtLoginDesc") : t("desktopOpenAtLoginUnsupportedDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: desktopBehavior.openAtLogin,
              disabled: !openAtLoginSupported,
              onChange: (v) => update({
                appBehavior: {
                  openAtLogin: v,
                  startMinimized: v ? desktopBehavior.startMinimized : false
                }
              })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("desktopStartMinimized"),
          description: desktopBehavior.openAtLogin && startMinimizedSupported ? t("desktopStartMinimizedDesc") : t("desktopStartMinimizedDisabledDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: desktopBehavior.startMinimized,
              disabled: !desktopBehavior.openAtLogin || !startMinimizedSupported,
              onChange: (v) => update({ appBehavior: { startMinimized: v } })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("desktopCloseToTray"),
          description: t("desktopCloseToTrayDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: desktopBehavior.closeToTray,
              onChange: (v) => update({ appBehavior: { closeToTray: v } })
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("logTitle"), className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("logEnabled"),
          description: t("logEnabledDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: form.log.enabled,
              onChange: (v) => update({ log: { enabled: v } })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("logRetention"),
          description: t("logRetentionDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: selectControlClass,
              value: form.log.retentionDays,
              onChange: (e) => update({ log: { retentionDays: Number(e.target.value) } }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1, children: t("logRetentionOne") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 2, children: t("logRetentionTwo") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 3, children: t("logRetentionThree") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 5, children: t("logRetentionFive") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 7, children: t("logRetentionSeven") })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("logDir"),
          description: t("logDirDesc"),
          wideControl: true,
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full min-w-0 flex-col items-start gap-2", children: [
            logPath ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "block w-full max-w-full break-all rounded-xl bg-ds-main/70 px-3 py-2 font-mono text-[12px] text-ds-muted shadow-sm", children: logPath }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] text-ds-faint", children: "…" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-1.5 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover disabled:opacity-50",
                disabled: typeof window.dsGui?.openLogDir !== "function",
                onClick: async () => {
                  if (typeof window.dsGui?.openLogDir !== "function") return;
                  setLogDirOpenError(null);
                  try {
                    const result = await window.dsGui.openLogDir();
                    if (!result.ok) setLogDirOpenError(result.message ?? "Unknown error");
                  } catch (e) {
                    setLogDirOpenError(e instanceof Error ? e.message : String(e));
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-4 w-4" }),
                  t("logDirOpen")
                ]
              }
            ),
            logDirOpenError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-red-700 dark:text-red-300", children: logDirOpenError }) : null
          ] })
        }
      )
    ] })
  ] });
}
function statusPill(status) {
  if (status === "available") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200";
  if (status === "disabled") return "border-ds-border-muted bg-ds-card text-ds-faint";
  return "border-red-300/50 bg-red-500/10 text-red-700 dark:text-red-200";
}
function compactList(values, empty) {
  if (!Array.isArray(values) || values.length === 0) return empty;
  return values.map((value) => typeof value === "string" ? value : JSON.stringify(value)).slice(0, 4).join(", ");
}
const EMPTY_TOKEN_ECONOMY_SAVINGS_STATE = {
  loading: false,
  loaded: false,
  summary: null
};
const DEEPSEEK_V4_CONTEXT_PROFILE = {
  contextWindowTokens: 1e6,
  softThreshold: 98e4,
  hardThreshold: 99e4
};
function formatTokenNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}
function normalizeModelId(model) {
  const normalized = model?.trim().toLowerCase() ?? "";
  return normalized === "auto" ? "" : normalized;
}
function knownModelContextProfile(input) {
  const normalized = normalizeModelId(input);
  if (!normalized) return null;
  const match = ["deepseek-v4-pro", "deepseek-v4-flash", "deepseek-chat", "deepseek-reasoner"].find((modelId) => normalized === modelId || normalized.endsWith(`/${modelId}`));
  return match ? { modelLabel: match } : null;
}
function modelContextProfileSummary(input) {
  const known = knownModelContextProfile(input.model);
  if (known) {
    return {
      modelLabel: known.modelLabel,
      contextWindowLabel: formatTokenNumber(DEEPSEEK_V4_CONTEXT_PROFILE.contextWindowTokens),
      softThresholdLabel: formatTokenNumber(DEEPSEEK_V4_CONTEXT_PROFILE.softThreshold),
      hardThresholdLabel: formatTokenNumber(DEEPSEEK_V4_CONTEXT_PROFILE.hardThreshold),
      sourceLabelKey: "legalworkModelContextSourceBuiltIn"
    };
  }
  const model = input.model?.trim() || "auto";
  return {
    modelLabel: model,
    contextWindowLabel: "models.profiles",
    softThresholdLabel: formatTokenNumber(input.fallbackSoftThreshold),
    hardThresholdLabel: formatTokenNumber(input.fallbackHardThreshold),
    sourceLabelKey: "legalworkModelContextSourceFallback"
  };
}
function usageNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
async function loadTokenEconomySavingsSummary() {
  if (typeof window === "undefined" || typeof window.dsGui?.runtimeRequest !== "function") return null;
  const response = await window.dsGui.runtimeRequest("/v1/usage?group_by=thread", "GET");
  if (!response.ok || !response.body.trim()) return null;
  const parsed = parseUsageResponse(response.body, "token economy usage");
  const totals = parsed.totals ?? {};
  const tokens = usageNumber(totals.token_economy_savings_tokens);
  const costUsd = usageNumber(totals.token_economy_savings_usd);
  const costCny = typeof totals.token_economy_savings_cny === "number" && Number.isFinite(totals.token_economy_savings_cny) ? totals.token_economy_savings_cny : null;
  if (tokens <= 0 && costUsd <= 0 && (costCny ?? 0) <= 0) return null;
  return { tokens, costUsd, costCny };
}
function AdvancedSettingsDisclosure({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group overflow-hidden rounded-xl border border-ds-border-muted bg-ds-main/35", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-ds-hover/70 [&::-webkit-details-marker]:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[13px] font-semibold text-ds-ink", children: title }),
        description ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-[12.5px] leading-5 text-ds-faint", children: description }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-ds-faint transition group-open:rotate-180", strokeWidth: 1.9 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-ds-border-muted bg-ds-card/45", children })
  ] });
}
function AgentsSettingsSection({ ctx }) {
  const {
    t,
    tCommon,
    form,
    provider: providerFromContext,
    legalwork,
    activeApiKey,
    update,
    updateLegalwork,
    updateSharedCredential,
    sharedApiKey,
    sharedBaseUrl,
    showApiKey,
    setShowApiKey,
    showRuntimeToken,
    setShowRuntimeToken,
    portError,
    selectControlClass,
    openOnboardingPreview,
    pickWorkspace,
    resetWorkspaceToDefault,
    workspacePickerError,
    guiUpdateInfo,
    checkingGuiUpdate,
    downloadingGuiUpdate,
    installingGuiUpdate,
    guiUpdateDownloaded,
    guiUpdateProgress,
    guiUpdateError,
    checkGuiUpdate,
    downloadGuiUpdate,
    installGuiUpdate,
    logPath,
    logDirOpenError,
    setLogDirOpenError,
    pickWriteWorkspace,
    resetWriteWorkspaceToDefault,
    writeWorkspacePickerError,
    writeInlineBaseUrlInherited,
    effectiveWriteInlineBaseUrl,
    writeInlineModelInherited,
    effectiveWriteInlineModel,
    setWriteDebugModalOpen,
    loadWriteDebugEntries,
    scrollToAgentSection,
    agentsSectionRef,
    skillSectionRef,
    mcpSectionRef,
    permissionsSectionRef,
    selectedSkillRoot,
    skillRootOptions,
    skillRootId,
    setSkillRootId,
    skillNotice,
    openSkillRoot,
    openPlugins,
    mcpConfigPath,
    mcpConfigExists,
    mcpConfigText,
    setMcpConfigText,
    mcpLoading,
    mcpBusy,
    mcpNotice,
    saveMcpConfig,
    loadMcpConfig,
    openMcpConfigDir,
    runtimeInfo,
    toolDiagnostics,
    memoryRecords,
    runtimeDiagnosticsBusy,
    runtimeDiagnosticsNotice,
    refreshLegalworkDiagnostics,
    disableMemoryRecord,
    deleteMemoryRecord,
    pickClawWorkspace,
    resetClawWorkspaceToDefault,
    clawWorkspacePickerError,
    splitSettingsList: splitSettingsList2,
    listSettingsText: listSettingsText2
  } = ctx;
  const mcpSearch = legalwork.mcpSearch ?? {
    enabled: false,
    mode: "auto",
    autoThresholdToolCount: 24,
    topKDefault: 5,
    topKMax: 10,
    minScore: 0.15
  };
  const tokenEconomyDefaults = {
    enabled: false,
    compressToolDescriptions: true,
    compressToolResults: true,
    conciseResponses: true,
    historyHygiene: {
      maxToolResultLines: 320,
      maxToolResultBytes: 32768,
      maxToolResultTokens: 8e3,
      maxToolArgumentStringBytes: 8192,
      maxToolArgumentStringTokens: 2e3,
      maxArrayItems: 80
    }
  };
  const tokenEconomy = {
    ...tokenEconomyDefaults,
    ...legalwork.tokenEconomy ?? {},
    enabled: legalwork.tokenEconomy?.enabled ?? legalwork.tokenEconomyMode ?? false,
    historyHygiene: {
      ...tokenEconomyDefaults.historyHygiene,
      ...legalwork.tokenEconomy?.historyHygiene ?? {}
    }
  };
  const [tokenEconomySavingsState, setTokenEconomySavingsState] = reactExports.useState(EMPTY_TOKEN_ECONOMY_SAVINGS_STATE);
  reactExports.useEffect(() => {
    let cancelled = false;
    if (!tokenEconomy.enabled) {
      setTokenEconomySavingsState(EMPTY_TOKEN_ECONOMY_SAVINGS_STATE);
      return;
    }
    setTokenEconomySavingsState((current) => ({ ...current, loading: true }));
    void loadTokenEconomySavingsSummary().then((summary) => {
      if (!cancelled) setTokenEconomySavingsState({ loading: false, loaded: true, summary });
    }).catch(() => {
      if (!cancelled) setTokenEconomySavingsState({ loading: false, loaded: true, summary: null });
    });
    return () => {
      cancelled = true;
    };
  }, [tokenEconomy.enabled]);
  const tokenEconomySavings = tokenEconomySavingsState.summary;
  const settingsLocale = typeof form?.locale === "string" ? form.locale : void 0;
  const storage = legalwork.storage ?? {
    backend: "hybrid",
    sqlitePath: ""
  };
  const contextCompaction = legalwork.contextCompaction ?? {
    defaultSoftThreshold: 16e3,
    defaultHardThreshold: 24e3,
    summaryMode: "heuristic",
    summaryTimeoutMs: 15e3,
    summaryMaxTokens: 1200,
    summaryInputMaxBytes: 98304
  };
  const modelContext = modelContextProfileSummary({
    model: legalwork.model,
    fallbackSoftThreshold: contextCompaction.defaultSoftThreshold,
    fallbackHardThreshold: contextCompaction.defaultHardThreshold
  });
  const runtimeTuning = legalwork.runtimeTuning ?? {
    toolStorm: {
      enabled: true,
      windowSize: 8,
      threshold: 3
    },
    toolArgumentRepair: {
      maxStringBytes: 524288
    }
  };
  const updateMcpSearch = (patch) => {
    updateLegalwork({
      mcpSearch: {
        ...mcpSearch,
        ...patch
      }
    });
  };
  const updateTokenEconomy = (patch) => {
    const enabled = typeof patch.enabled === "boolean" ? patch.enabled : tokenEconomy.enabled;
    updateLegalwork({
      tokenEconomyMode: enabled,
      tokenEconomy: {
        ...tokenEconomy,
        ...patch,
        enabled
      }
    });
  };
  const updateHistoryHygiene = (patch) => {
    updateTokenEconomy({
      historyHygiene: {
        ...tokenEconomy.historyHygiene,
        ...patch
      }
    });
  };
  const updateStorage = (patch) => {
    updateLegalwork({
      storage: {
        ...storage,
        ...patch
      }
    });
  };
  const updateContextCompaction = (patch) => {
    updateLegalwork({
      contextCompaction: {
        ...contextCompaction,
        ...patch
      }
    });
  };
  const updateRuntimeTuning = (patch) => {
    updateLegalwork({
      runtimeTuning: {
        ...runtimeTuning,
        ...patch
      }
    });
  };
  const updateToolStorm = (patch) => {
    updateRuntimeTuning({
      toolStorm: {
        ...runtimeTuning.toolStorm,
        ...patch
      }
    });
  };
  const updateToolArgumentRepair = (patch) => {
    updateRuntimeTuning({
      toolArgumentRepair: {
        ...runtimeTuning.toolArgumentRepair,
        ...patch
      }
    });
  };
  const provider = providerFromContext ?? form.provider ?? defaultModelProviderSettings();
  const modelProviders = provider.providers;
  const activeProviderId = legalwork.providerId?.trim() || DEFAULT_MODEL_PROVIDER_ID;
  const activeProvider = modelProviders.find((item) => item.id === activeProviderId) ?? modelProviders[0];
  const updateModelProviders = (providers) => {
    const defaultProvider = providers.find((item) => item.id === DEFAULT_MODEL_PROVIDER_ID);
    update({
      provider: {
        apiKey: defaultProvider?.apiKey ?? provider.apiKey,
        baseUrl: defaultProvider?.baseUrl ?? provider.baseUrl,
        providers
      }
    });
  };
  const updateModelProvider = (id, patch) => {
    updateModelProviders(modelProviders.map((item) => item.id === id ? { ...item, ...patch } : item));
  };
  const addModelProvider = () => {
    const baseId = "custom-provider";
    let index = modelProviders.length + 1;
    let id = `${baseId}-${index}`;
    const used = new Set(modelProviders.map((item) => item.id));
    while (used.has(id)) {
      index += 1;
      id = `${baseId}-${index}`;
    }
    const nextProvider = {
      id,
      name: t("modelProviderNewName", { index }),
      apiKey: "",
      baseUrl: "https://api.example.com/v1",
      models: []
    };
    updateModelProviders([...modelProviders, nextProvider]);
    updateLegalwork({ providerId: id });
  };
  const removeModelProvider = (id) => {
    if (id === DEFAULT_MODEL_PROVIDER_ID) return;
    const nextProviders = modelProviders.filter((item) => item.id !== id);
    updateModelProviders(nextProviders);
    if (activeProviderId === id) {
      updateLegalwork({ providerId: DEFAULT_MODEL_PROVIDER_ID });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionJumpButton, { label: t("agentsQuickBase"), onClick: () => scrollToAgentSection("agents") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionJumpButton, { label: t("agentsQuickSkill"), onClick: () => scrollToAgentSection("skill") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionJumpButton, { label: t("agentsQuickMcp"), onClick: () => scrollToAgentSection("mcp") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SectionJumpButton,
        {
          label: t("agentsQuickPermissions"),
          onClick: () => scrollToAgentSection("permissions")
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: agentsSectionRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("agents"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("autoStart"),
          description: t("autoStartDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: legalwork.autoStart,
              onChange: (v) => updateLegalwork({ autoStart: v })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdvancedSettingsDisclosure,
        {
          title: t("legalworkAssistantAdvanced"),
          description: t("legalworkAssistantAdvancedDesc"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-ds-border-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkProvider"),
                description: t("legalworkProviderDesc"),
                wideControl: true,
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        className: selectControlClass,
                        value: activeProvider?.id ?? DEFAULT_MODEL_PROVIDER_ID,
                        onChange: (e) => updateLegalwork({ providerId: e.target.value }),
                        children: modelProviders.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.id, children: item.name }, item.id))
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: addModelProvider,
                        className: "inline-flex h-9 items-center gap-2 rounded-full border border-ds-border bg-ds-card px-3 text-[12.5px] font-medium text-ds-muted shadow-sm transition hover:bg-ds-hover hover:text-ds-ink",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5", strokeWidth: 1.9 }),
                          t("modelProviderAdd")
                        ]
                      }
                    )
                  ] }),
                  activeProvider ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 rounded-xl border border-ds-border-muted bg-ds-main/35 p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1.5 text-[12px] font-semibold text-ds-muted", children: [
                        t("modelProviderName"),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] font-normal text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                            value: activeProvider.name,
                            onChange: (e) => updateModelProvider(activeProvider.id, { name: e.target.value })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1.5 text-[12px] font-semibold text-ds-muted", children: [
                        t("modelProviderId"),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] font-normal text-ds-faint shadow-sm",
                            value: activeProvider.id,
                            readOnly: true
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1.5 text-[12px] font-semibold text-ds-muted", children: [
                      t("modelProviderApiKey"),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SecretInput,
                        {
                          value: activeProvider.apiKey,
                          onChange: (value) => updateModelProvider(activeProvider.id, { apiKey: value }),
                          visible: showApiKey,
                          onToggleVisibility: () => setShowApiKey((value) => !value),
                          placeholder: t("legalworkApiKeyPlaceholder"),
                          autoComplete: "off",
                          showLabel: t("showSecret"),
                          hideLabel: t("hideSecret")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1.5 text-[12px] font-semibold text-ds-muted", children: [
                      t("modelProviderBaseUrl"),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] font-normal text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                          value: activeProvider.baseUrl,
                          placeholder: t("baseUrlPlaceholder"),
                          onChange: (e) => updateModelProvider(activeProvider.id, { baseUrl: e.target.value })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1.5 text-[12px] font-semibold text-ds-muted", children: [
                      t("modelProviderModels"),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "textarea",
                        {
                          className: "min-h-24 w-full min-w-0 resize-y rounded-xl border border-ds-border bg-ds-card px-3 py-2 font-mono text-[12.5px] font-normal text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                          value: activeProvider.models.join("\n"),
                          placeholder: "deepseek-v4-pro\ndeepseek-v4-flash",
                          onChange: (e) => updateModelProvider(activeProvider.id, {
                            models: e.target.value.split("\n").map((item) => item.trim()).filter(Boolean)
                          })
                        }
                      )
                    ] }),
                    activeProvider.id !== DEFAULT_MODEL_PROVIDER_ID ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => removeModelProvider(activeProvider.id),
                        className: "inline-flex h-9 w-fit items-center gap-2 rounded-full border border-red-200/70 bg-red-50 px-3 text-[12.5px] font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/70 dark:bg-red-950/25 dark:text-red-200 dark:hover:bg-red-950/40",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5", strokeWidth: 1.9 }),
                          t("modelProviderRemove")
                        ]
                      }
                    ) : null
                  ] }) : null
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkApiKey"),
                description: t("legalworkApiKeyDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full min-w-0 md:max-w-md", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SecretInput,
                    {
                      value: legalwork.apiKey,
                      onChange: (value) => updateLegalwork({ apiKey: value }),
                      visible: showApiKey,
                      onToggleVisibility: () => setShowApiKey((value) => !value),
                      placeholder: t("legalworkApiKeyPlaceholder"),
                      autoComplete: "off",
                      showLabel: t("showSecret"),
                      hideLabel: t("hideSecret")
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[12px] text-ds-muted", children: legalwork.apiKey.trim() ? t("legalworkApiKeyOverride") : sharedApiKey.trim() ? t("legalworkApiKeyInherited") : t("legalworkApiKeyMissing") })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkBaseUrl"),
                description: t("legalworkBaseUrlDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full min-w-0 md:max-w-md", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: legalwork.baseUrl,
                      placeholder: t("legalworkBaseUrlPlaceholder"),
                      onChange: (e) => updateLegalwork({ baseUrl: e.target.value })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[12px] text-ds-muted", children: legalwork.baseUrl.trim() ? t("legalworkBaseUrlOverride", { value: legalwork.baseUrl.trim() }) : t("legalworkBaseUrlInherited", { value: sharedBaseUrl.trim() || t("legalworkBaseUrlOfficial") }) })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("port"),
                description: t("portDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1,
                      max: 65535,
                      className: `w-28 rounded-xl border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:outline-none focus:ring-1 ${portError ? "border-red-400 focus:ring-red-300" : "border-ds-border focus:border-accent/40 focus:ring-accent/30"}`,
                      value: legalwork.port,
                      onChange: (e) => updateLegalwork({ port: Number(e.target.value) })
                    }
                  ),
                  portError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[12px] text-red-700 dark:text-red-300", children: portError }) : null
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkBinary"),
                description: t("legalworkBinaryDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md",
                    placeholder: t("legalworkBinaryPlaceholder"),
                    value: legalwork.binaryPath,
                    onChange: (e) => updateLegalwork({ binaryPath: e.target.value })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkDataDir"),
                description: t("legalworkDataDirDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md",
                    placeholder: DEFAULT_LEGALWORK_DATA_DIR,
                    value: legalwork.dataDir,
                    onChange: (e) => updateLegalwork({ dataDir: e.target.value })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkModel"),
                description: t("legalworkModelDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md",
                    value: legalwork.model,
                    onChange: (e) => updateLegalwork({ model: e.target.value })
                  }
                )
              }
            )
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("legalworkTokenEconomy"),
          description: t("legalworkTokenEconomyDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-col items-start gap-2 sm:items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Toggle,
              {
                checked: tokenEconomy.enabled,
                onChange: (enabled) => updateTokenEconomy({ enabled })
              }
            ),
            tokenEconomy.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-full rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1.5 text-[12px] font-medium leading-5 text-emerald-700 dark:text-emerald-200", children: tokenEconomySavings ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("legalworkTokenEconomySavings", {
              tokens: formatCompactNumber(tokenEconomySavings.tokens),
              cost: formatCost(
                tokenEconomySavings.costUsd,
                settingsLocale,
                tokenEconomySavings.costCny
              )
            }) }) : tokenEconomySavingsState.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("legalworkTokenEconomySavingsLoading") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("legalworkTokenEconomySavingsEmpty") }) }) : null
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdvancedSettingsDisclosure,
        {
          title: t("legalworkTokenEconomyAdvanced"),
          description: t("legalworkTokenEconomyAdvancedDesc"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-ds-border-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkTokenEconomyOptions"),
                description: t("legalworkTokenEconomyOptionsDesc"),
                wideControl: true,
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 items-center justify-between gap-3 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-muted", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("legalworkCompressToolDescriptions") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Toggle,
                      {
                        checked: tokenEconomy.compressToolDescriptions,
                        disabled: !tokenEconomy.enabled,
                        onChange: (compressToolDescriptions) => updateTokenEconomy({ compressToolDescriptions })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 items-center justify-between gap-3 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-muted", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("legalworkCompressToolResults") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Toggle,
                      {
                        checked: tokenEconomy.compressToolResults,
                        disabled: !tokenEconomy.enabled,
                        onChange: (compressToolResults) => updateTokenEconomy({ compressToolResults })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 items-center justify-between gap-3 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-muted", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("legalworkConciseResponses") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Toggle,
                      {
                        checked: tokenEconomy.conciseResponses,
                        disabled: !tokenEconomy.enabled,
                        onChange: (conciseResponses) => updateTokenEconomy({ conciseResponses })
                      }
                    )
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkHistoryHygiene"),
                description: t("legalworkHistoryHygieneDesc"),
                wideControl: true,
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("legalworkHistoryMaxResultLines"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        max: 1e5,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: tokenEconomy.historyHygiene.maxToolResultLines,
                        onChange: (e) => updateHistoryHygiene({ maxToolResultLines: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("legalworkHistoryMaxResultBytes"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 512,
                        max: 8388608,
                        step: 1024,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: tokenEconomy.historyHygiene.maxToolResultBytes,
                        onChange: (e) => updateHistoryHygiene({ maxToolResultBytes: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("legalworkHistoryMaxResultTokens"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 128,
                        max: 256e3,
                        step: 128,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: tokenEconomy.historyHygiene.maxToolResultTokens,
                        onChange: (e) => updateHistoryHygiene({ maxToolResultTokens: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("legalworkHistoryMaxArgumentBytes"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 512,
                        max: 8388608,
                        step: 1024,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: tokenEconomy.historyHygiene.maxToolArgumentStringBytes,
                        onChange: (e) => updateHistoryHygiene({ maxToolArgumentStringBytes: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("legalworkHistoryMaxArgumentTokens"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 128,
                        max: 64e3,
                        step: 128,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: tokenEconomy.historyHygiene.maxToolArgumentStringTokens,
                        onChange: (e) => updateHistoryHygiene({ maxToolArgumentStringTokens: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("legalworkHistoryMaxArrayItems"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        max: 1e4,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: tokenEconomy.historyHygiene.maxArrayItems,
                        onChange: (e) => updateHistoryHygiene({ maxArrayItems: Number(e.target.value) })
                      }
                    )
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("runtimeToken"),
                description: t("runtimeTokenDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SecretInput,
                  {
                    value: legalwork.runtimeToken,
                    onChange: (value) => updateLegalwork({ runtimeToken: value }),
                    visible: showRuntimeToken,
                    onToggleVisibility: () => setShowRuntimeToken((value) => !value),
                    showLabel: t("showSecret"),
                    hideLabel: t("hideSecret"),
                    className: "md:max-w-md"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("legalworkInsecure"),
                description: legalwork.runtimeToken.trim() ? t("legalworkInsecureDesc") : t("legalworkInsecureForcedDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Toggle,
                  {
                    checked: isLegalworkRuntimeInsecure(legalwork),
                    disabled: !legalwork.runtimeToken.trim(),
                    onChange: (v) => updateLegalwork({ insecure: v })
                  }
                )
              }
            )
          ] })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsCard, { title: t("legalworkAdvanced"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdvancedSettingsDisclosure,
      {
        title: t("legalworkAdvancedDetails"),
        description: t("legalworkAdvancedDetailsDesc"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-ds-border-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkModelContextProfile"),
              description: t("legalworkModelContextProfileDesc"),
              wideControl: true,
              control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 rounded-xl border border-ds-border-muted bg-ds-card px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase text-ds-faint", children: t("legalworkModelContextModel") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-[13px] font-semibold text-ds-ink", children: modelContext.modelLabel }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px] leading-4 text-ds-muted", children: t(modelContext.sourceLabelKey) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 rounded-xl border border-ds-border-muted bg-ds-card px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase text-ds-faint", children: t("legalworkModelContextWindow") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-[13px] font-semibold text-ds-ink", children: modelContext.contextWindowLabel })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 rounded-xl border border-ds-border-muted bg-ds-card px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase text-ds-faint", children: t("legalworkModelContextSoft") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-[13px] font-semibold text-ds-ink", children: modelContext.softThresholdLabel })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 rounded-xl border border-ds-border-muted bg-ds-card px-3 py-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium uppercase text-ds-faint", children: t("legalworkModelContextHard") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-[13px] font-semibold text-ds-ink", children: modelContext.hardThresholdLabel })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkStorageBackend"),
              description: t("legalworkStorageBackendDesc"),
              control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: selectControlClass,
                  value: storage.backend,
                  onChange: (e) => updateStorage({ backend: e.target.value }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hybrid", children: t("legalworkStorageHybrid") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "file", children: t("legalworkStorageFile") })
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkStorageSqlitePath"),
              description: t("legalworkStorageSqlitePathDesc"),
              control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 md:max-w-md",
                  value: storage.sqlitePath,
                  disabled: storage.backend !== "hybrid",
                  placeholder: t("legalworkStorageSqlitePathPlaceholder"),
                  onChange: (e) => updateStorage({ sqlitePath: e.target.value })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkCompactionThresholds"),
              description: t("legalworkCompactionThresholdsDesc"),
              wideControl: true,
              control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkCompactionSoftThreshold"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1024,
                      step: 1024,
                      className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: contextCompaction.defaultSoftThreshold,
                      onChange: (e) => updateContextCompaction({ defaultSoftThreshold: Number(e.target.value) })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkCompactionHardThreshold"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1024,
                      step: 1024,
                      className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: contextCompaction.defaultHardThreshold,
                      onChange: (e) => updateContextCompaction({ defaultHardThreshold: Number(e.target.value) })
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkCompactionSummary"),
              description: t("legalworkCompactionSummaryDesc"),
              wideControl: true,
              control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkCompactionSummaryMode"),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      className: selectControlClass,
                      value: contextCompaction.summaryMode,
                      onChange: (e) => updateContextCompaction({ summaryMode: e.target.value }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "heuristic", children: t("legalworkCompactionSummaryHeuristic") }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "model", children: t("legalworkCompactionSummaryModel") })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkCompactionSummaryTimeout"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1e3,
                      max: 12e4,
                      step: 1e3,
                      className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: contextCompaction.summaryTimeoutMs,
                      onChange: (e) => updateContextCompaction({ summaryTimeoutMs: Number(e.target.value) })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkCompactionSummaryMaxTokens"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 64,
                      max: 16e3,
                      step: 64,
                      className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: contextCompaction.summaryMaxTokens,
                      onChange: (e) => updateContextCompaction({ summaryMaxTokens: Number(e.target.value) })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkCompactionSummaryInputBytes"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1024,
                      max: 8388608,
                      step: 1024,
                      className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: contextCompaction.summaryInputMaxBytes,
                      onChange: (e) => updateContextCompaction({ summaryInputMaxBytes: Number(e.target.value) })
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkToolStorm"),
              description: t("legalworkToolStormDesc"),
              control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Toggle,
                {
                  checked: runtimeTuning.toolStorm.enabled,
                  onChange: (enabled) => updateToolStorm({ enabled })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkToolStormLimits"),
              description: t("legalworkToolStormLimitsDesc"),
              wideControl: true,
              control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkToolStormWindowSize"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 1,
                      max: 128,
                      className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: runtimeTuning.toolStorm.windowSize,
                      disabled: !runtimeTuning.toolStorm.enabled,
                      onChange: (e) => updateToolStorm({ windowSize: Number(e.target.value) })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                  t("legalworkToolStormThreshold"),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "number",
                      min: 2,
                      max: 128,
                      className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                      value: runtimeTuning.toolStorm.threshold,
                      disabled: !runtimeTuning.toolStorm.enabled,
                      onChange: (e) => updateToolStorm({ threshold: Number(e.target.value) })
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkToolArgumentRepair"),
              description: t("legalworkToolArgumentRepairDesc"),
              control: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: 1024,
                  max: 16777216,
                  step: 1024,
                  className: "w-40 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                  value: runtimeTuning.toolArgumentRepair.maxStringBytes,
                  onChange: (e) => updateToolArgumentRepair({ maxStringBytes: Number(e.target.value) })
                }
              )
            }
          )
        ] })
      }
    ) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsCard, { title: t("legalworkDiagnostics"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      AdvancedSettingsDisclosure,
      {
        title: t("legalworkDiagnosticsAdvanced"),
        description: t("legalworkDiagnosticsAdvancedDesc"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-ds-border-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkRuntimeCapabilities"),
              description: t("legalworkRuntimeCapabilitiesDesc"),
              wideControl: true,
              control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
                  ["MCP", runtimeInfo?.capabilities?.mcp?.status],
                  ["Web", runtimeInfo?.capabilities?.web?.status],
                  ["Skills", runtimeInfo?.capabilities?.skills?.status],
                  ["Subagents", runtimeInfo?.capabilities?.subagents?.status],
                  ["Files", runtimeInfo?.capabilities?.attachments?.status],
                  ["Memory", runtimeInfo?.capabilities?.memory?.status]
                ].map(([label, status]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[12px] font-semibold ${statusPill(status)}`,
                    children: [
                      label,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] opacity-75", children: status || "unknown" })
                    ]
                  },
                  label
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 text-[12.5px] text-ds-muted sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                    t("legalworkRuntimeModel"),
                    ": ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: runtimeInfo?.capabilities?.model?.id ?? "unknown" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                    t("legalworkRuntimePid"),
                    ": ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: runtimeInfo?.pid ?? "unknown" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                    "MCP: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-ds-ink", children: [
                      runtimeInfo?.capabilities?.mcp?.connectedServers ?? 0,
                      "/",
                      runtimeInfo?.capabilities?.mcp?.configuredServers ?? 0
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                    "Web: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: runtimeInfo?.capabilities?.web?.provider ?? "none" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => void refreshLegalworkDiagnostics(),
                      disabled: runtimeDiagnosticsBusy,
                      className: "inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover disabled:cursor-not-allowed disabled:opacity-55",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3.5 w-3.5 ${runtimeDiagnosticsBusy ? "animate-spin" : ""}`, strokeWidth: 1.75 }),
                        t("legalworkDiagnosticsRefresh")
                      ]
                    }
                  ),
                  runtimeDiagnosticsNotice ? /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNoticeView, { notice: runtimeDiagnosticsNotice }) : null
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkToolDiagnostics"),
              description: t("legalworkToolDiagnosticsDesc"),
              wideControl: true,
              control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 text-[12.5px] text-ds-muted sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                  t("legalworkDiagnosticsProviders"),
                  ": ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: toolDiagnostics?.providers?.length ?? 0 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                  t("legalworkDiagnosticsMcpServers"),
                  ": ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: toolDiagnostics?.mcpServers?.length ?? 0 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                  t("legalworkDiagnosticsSkills"),
                  ": ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: toolDiagnostics?.skills?.skills?.length ?? 0 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                  t("legalworkDiagnosticsAttachments"),
                  ": ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: toolDiagnostics?.attachments?.count ?? 0 })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SettingRow,
            {
              title: t("legalworkMemoryRecords"),
              description: t("legalworkMemoryRecordsDesc"),
              wideControl: true,
              control: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: memoryRecords.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-3 text-[13px] text-ds-faint", children: t("legalworkMemoryEmpty") }) : memoryRecords.slice(0, 8).map((memory) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[13px] font-semibold text-ds-ink", children: memory.content }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap gap-1.5 text-[11px] text-ds-faint", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: memory.scope }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: memory.id }),
                    memory.disabledAt ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("legalworkMemoryDisabled") }) : null,
                    memory.tags?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: compactList(memory.tags, "") }) : null
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: Boolean(memory.disabledAt),
                      onClick: () => void disableMemoryRecord(memory.id),
                      className: "rounded-lg p-1.5 text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink disabled:cursor-not-allowed disabled:opacity-45",
                      "aria-label": t("legalworkMemoryDisable"),
                      title: t("legalworkMemoryDisable"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-3.5 w-3.5", strokeWidth: 1.8 })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => void deleteMemoryRecord(memory.id),
                      className: "rounded-lg p-1.5 text-ds-muted transition hover:bg-red-500/10 hover:text-red-600",
                      "aria-label": t("legalworkMemoryDelete"),
                      title: t("legalworkMemoryDelete"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5", strokeWidth: 1.8 })
                    }
                  )
                ] })
              ] }) }, memory.id)) })
            }
          )
        ] })
      }
    ) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: skillSectionRef, className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("skill"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("skillsLocation"),
          description: t("skillsLocationDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              className: selectControlClass,
              value: selectedSkillRoot?.id ?? skillRootId,
              onChange: (event) => setSkillRootId(event.target.value),
              children: skillRootOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option.id, disabled: !option.available, children: option.available ? option.label : `${option.label} · ${tCommon("pluginSkillRootNeedsWorkspace")}` }, option.id))
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("skillsPath"),
          description: t("skillsPathDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] text-ds-muted shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "block break-all rounded-lg bg-ds-main/70 px-2 py-1 font-mono text-[12px] text-ds-ink", children: selectedSkillRoot?.path || t("skillsRootUnavailable") }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("skillsScanDirs"),
          description: t("skillsScanDirsDesc"),
          wideControl: true,
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: listSettingsText2(form.claw.skills.extraDirs),
              onChange: (event) => update({
                claw: {
                  skills: {
                    extraDirs: splitSettingsList2(event.target.value)
                  }
                }
              }),
              spellCheck: false,
              placeholder: selectedSkillRoot?.path || "~/.agents/skills",
              className: "min-h-24 w-full rounded-2xl border border-ds-border bg-ds-card px-4 py-3 font-mono text-[13px] leading-6 text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("skillsActions"),
          description: t("skillsActionsDesc"),
          wideControl: true,
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => void openSkillRoot(),
                  className: "inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-4 w-4" }),
                    t("skillsOpenRoot")
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openPlugins(),
                  className: "inline-flex items-center gap-1.5 rounded-xl bg-ds-userbubble px-3 py-2 text-[13px] font-medium text-ds-userbubbleFg shadow-sm transition hover:opacity-90",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
                    t("skillsOpenPlugins")
                  ]
                }
              )
            ] }),
            skillNotice ? /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNoticeView, { notice: skillNotice }) : null
          ] })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: mcpSectionRef, className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("mcp"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("mcpSearchEnabled"),
          description: t("mcpSearchEnabledDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: mcpSearch.enabled,
              onChange: (v) => updateMcpSearch({ enabled: v })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AdvancedSettingsDisclosure,
        {
          title: t("mcpAdvanced"),
          description: t("mcpAdvancedDesc"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-ds-border-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("mcpSearchMode"),
                description: t("mcpSearchModeDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    className: selectControlClass,
                    value: mcpSearch.mode,
                    disabled: !mcpSearch.enabled,
                    onChange: (e) => updateMcpSearch({ mode: e.target.value }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", children: t("mcpSearchModeAuto") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "search", children: t("mcpSearchModeSearch") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "direct", children: t("mcpSearchModeDirect") })
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("mcpSearchLimits"),
                description: t("mcpSearchLimitsDesc"),
                wideControl: true,
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("mcpSearchAutoThreshold"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: mcpSearch.autoThresholdToolCount,
                        disabled: !mcpSearch.enabled,
                        onChange: (e) => updateMcpSearch({ autoThresholdToolCount: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("mcpSearchTopKDefault"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: mcpSearch.topKDefault,
                        disabled: !mcpSearch.enabled,
                        onChange: (e) => updateMcpSearch({ topKDefault: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("mcpSearchTopKMax"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 1,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: mcpSearch.topKMax,
                        disabled: !mcpSearch.enabled,
                        onChange: (e) => updateMcpSearch({ topKMax: Number(e.target.value) })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex min-w-0 flex-col gap-1.5 text-[12px] font-medium text-ds-muted", children: [
                    t("mcpSearchMinScore"),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        max: 1,
                        step: 0.01,
                        className: "rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30",
                        value: mcpSearch.minScore,
                        disabled: !mcpSearch.enabled,
                        onChange: (e) => updateMcpSearch({ minScore: Number(e.target.value) })
                      }
                    )
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("mcpSearchDiagnostics"),
                description: t("mcpSearchDiagnosticsDesc"),
                wideControl: true,
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 text-[12.5px] text-ds-muted sm:grid-cols-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                    t("mcpSearchStatus"),
                    ": ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: toolDiagnostics?.mcpSearch?.active ? t("mcpSearchActive") : t("mcpSearchInactive") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                    t("mcpSearchIndexed"),
                    ": ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: toolDiagnostics?.mcpSearch?.indexedToolCount ?? runtimeInfo?.capabilities?.mcp?.search?.indexedToolCount ?? 0 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-ds-border-muted bg-ds-main/40 px-3 py-2", children: [
                    t("mcpSearchAdvertised"),
                    ": ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-ds-ink", children: toolDiagnostics?.mcpSearch?.advertisedToolCount ?? runtimeInfo?.capabilities?.mcp?.search?.advertisedToolCount ?? 0 })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("configFilePath"),
                description: t("mcpPathDesc"),
                control: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] text-ds-muted shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "block break-all rounded-lg bg-ds-main/70 px-2 py-1 font-mono text-[12px] text-ds-ink", children: mcpConfigPath }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("mcpEditor"),
                description: t("mcpEditorDesc"),
                wideControl: true,
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-ds-border bg-ds-main/50 px-3 py-2 text-[12px] leading-5 text-ds-muted", children: mcpConfigExists ? t("mcpFileStatusReady") : t("mcpFileStatusMissing") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: mcpConfigText,
                      onChange: (e) => setMcpConfigText(e.target.value),
                      spellCheck: false,
                      placeholder: mcpLoading ? t("loading") : "",
                      className: "min-h-[320px] w-full rounded-2xl border border-ds-border bg-ds-card px-4 py-3 font-mono text-[13px] leading-6 text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                    }
                  )
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                title: t("mcpActions"),
                description: t("mcpRuntimeHint"),
                wideControl: true,
                control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => void saveMcpConfig(),
                        disabled: mcpBusy || mcpLoading,
                        className: "inline-flex items-center gap-1.5 rounded-xl bg-ds-userbubble px-3 py-2 text-[13px] font-medium text-ds-userbubbleFg shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55",
                        children: [
                          mcpBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin", strokeWidth: 2 }) : null,
                          t("mcpSave")
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => void loadMcpConfig(),
                        disabled: mcpBusy || mcpLoading,
                        className: "inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover disabled:cursor-not-allowed disabled:opacity-55",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3.5 w-3.5 ${mcpLoading ? "animate-spin" : ""}`, strokeWidth: 1.75 }),
                          t("mcpReload")
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => void openMcpConfigDir(),
                        className: "inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-4 w-4" }),
                          t("mcpOpenDir")
                        ]
                      }
                    )
                  ] }),
                  mcpNotice ? /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNoticeView, { notice: mcpNotice }) : null
                ] })
              }
            )
          ] })
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: permissionsSectionRef, className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("permissions"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("approvalPolicy"),
          description: t("approvalPolicyDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: selectControlClass,
              value: legalwork.approvalPolicy,
              onChange: (e) => updateLegalwork({
                approvalPolicy: e.target.value
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", children: t("approvalAuto") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "on-request", children: t("approvalOnRequest") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "untrusted", children: t("approvalUntrusted") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suggest", children: t("approvalSuggest") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "never", children: t("approvalNever") })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("sandboxMode"),
          description: t("sandboxModeDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: selectControlClass,
              value: legalwork.sandboxMode,
              onChange: (e) => updateLegalwork({
                sandboxMode: e.target.value
              }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "workspace-write", children: t("sandboxWorkspaceWrite") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "read-only", children: t("sandboxReadOnly") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "danger-full-access", children: t("sandboxFullAccess") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "external-sandbox", children: t("sandboxExternal") })
              ]
            }
          )
        }
      )
    ] }) })
  ] });
}
const profileFields = [
  { key: "description", labelKey: "clawManageAgentDescription", placeholderKey: "clawManageAgentDescriptionPlaceholder", rows: 2 },
  { key: "identity", labelKey: "clawManageAgentIdentity", placeholderKey: "clawManageAgentIdentityPlaceholder", rows: 4 },
  { key: "personality", labelKey: "clawManageAgentPersonality", placeholderKey: "clawManageAgentPersonalityPlaceholder", rows: 3 },
  { key: "userContext", labelKey: "clawManageAgentUserContext", placeholderKey: "clawManageAgentUserContextPlaceholder", rows: 3 },
  { key: "replyRules", labelKey: "clawManageAgentReplyRules", placeholderKey: "clawManageAgentReplyRulesPlaceholder", rows: 4 }
];
function textInputClass(extra = "") {
  return `w-full rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 ${extra}`;
}
function updateChannels(form, update, mapper) {
  update({ claw: { channels: form.claw.channels.map(mapper) } });
}
function updateChannel(form, update, channelId, patch) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  updateChannels(
    form,
    update,
    (channel) => channel.id === channelId ? { ...channel, ...patch, updatedAt: now } : channel
  );
}
function updateChannelProfile(form, update, channel, patch) {
  const nextProfile = {
    ...channel.agentProfile,
    ...patch
  };
  updateChannel(form, update, channel.id, {
    label: nextProfile.name.trim() || channel.label,
    agentProfile: nextProfile
  });
}
function channelEffectiveWorkspace(form, channel) {
  return channel.workspaceRoot.trim() || form.claw.im.workspaceRoot.trim() || form.workspaceRoot;
}
function ClawSettingsSection({ ctx }) {
  const {
    t,
    form,
    update,
    selectControlClass,
    pickClawWorkspace,
    resetClawWorkspaceToDefault,
    clawWorkspacePickerError
  } = ctx;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("clawRuntime"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("clawEnabled"),
          description: t("clawEnabledDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              checked: form.claw.enabled,
              onChange: (value) => update({ claw: { enabled: value } })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SettingRow,
        {
          title: t("clawDefaultWorkspace"),
          description: t("clawDefaultWorkspaceDesc"),
          control: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full min-w-[200px] md:max-w-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: textInputClass(),
                  value: form.claw.im.workspaceRoot,
                  onChange: (e) => update({
                    claw: {
                      im: {
                        workspaceRoot: e.target.value
                      }
                    }
                  }),
                  placeholder: t("clawDefaultWorkspacePlaceholder", { path: form.workspaceRoot })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: resetClawWorkspaceToDefault,
                  className: "shrink-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover",
                  children: t("clawDefaultWorkspaceReset")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => void pickClawWorkspace(),
                  className: "shrink-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover",
                  children: t("browse")
                }
              )
            ] }),
            clawWorkspacePickerError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px] leading-5 text-amber-700 dark:text-amber-300", children: clawWorkspacePickerError }) : null
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsCard, { title: t("clawManageAgents"), className: "mt-6", children: form.claw.channels.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4 text-[13px] leading-6 text-ds-muted", children: t("clawManageAgentsEmpty") }) : form.claw.channels.map((channel) => {
      const name = channel.agentProfile.name.trim() || channel.label;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[14px] font-semibold text-ds-ink", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[12px] text-ds-faint", children: t("clawManageAgentMeta", {
              provider: "Feishu / Lark",
              model: channel.model,
              workspace: channelEffectiveWorkspace(form, channel)
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] font-medium text-ds-muted", children: channel.enabled ? t("clawManageAgentEnabled") : t("clawManageAgentDisabled") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Toggle,
              {
                checked: channel.enabled,
                onChange: (value) => updateChannel(form, update, channel.id, { enabled: value })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-[12px] font-semibold text-ds-muted", children: t("clawManageAgentName") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: textInputClass(),
                value: channel.agentProfile.name,
                onChange: (e) => updateChannelProfile(form, update, channel, { name: e.target.value }),
                placeholder: t("clawManageAgentNamePlaceholder")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-[12px] font-semibold text-ds-muted", children: t("clawModel") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: selectControlClass,
                value: channel.model,
                onChange: (e) => updateChannel(form, update, channel.id, { model: e.target.value }),
                children: CLAW_MODEL_IDS.map((model) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: model, children: model }, model))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block min-w-0 md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-[12px] font-semibold text-ds-muted", children: t("clawWorkspaceOverride") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: textInputClass(),
                value: channel.workspaceRoot,
                onChange: (e) => updateChannel(form, update, channel.id, { workspaceRoot: e.target.value }),
                placeholder: t("clawWorkspaceInherit", {
                  path: form.claw.im.workspaceRoot.trim() || form.workspaceRoot
                })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-3", children: profileFields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-[12px] font-semibold text-ds-muted", children: t(field.labelKey) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: textInputClass("resize-y leading-5"),
              rows: field.rows,
              value: channel.agentProfile[field.key],
              onChange: (e) => updateChannelProfile(form, update, channel, { [field.key]: e.target.value }),
              placeholder: t(field.placeholderKey)
            }
          )
        ] }, field.key)) })
      ] }, channel.id);
    }) })
  ] });
}
function KeyboardShortcutsSettingsSection({ ctx }) {
  const { t, form, update } = ctx;
  const [query, setQuery] = reactExports.useState("");
  const [capturingCommandId, setCapturingCommandId] = reactExports.useState(null);
  const [notice, setNotice] = reactExports.useState(null);
  const normalized = reactExports.useMemo(() => normalizeKeyboardShortcuts(form.keyboardShortcuts), [form.keyboardShortcuts]);
  const effectiveBindings = reactExports.useMemo(
    () => resolveKeyboardShortcutBindings(form.keyboardShortcuts),
    [form.keyboardShortcuts]
  );
  const commandLabel = reactExports.useCallback((commandId) => {
    const command = KEYBOARD_SHORTCUT_COMMANDS.find((item) => item.id === commandId);
    return command ? t(command.labelKey) : commandId;
  }, [t]);
  const filteredCommands = reactExports.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return KEYBOARD_SHORTCUT_COMMANDS;
    return KEYBOARD_SHORTCUT_COMMANDS.filter((command) => {
      const haystack = [
        command.id,
        t(command.labelKey),
        t(command.descriptionKey),
        ...effectiveBindings[command.id]
      ].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [effectiveBindings, query, t]);
  const updateBinding = reactExports.useCallback((commandId, shortcuts) => {
    update({
      keyboardShortcuts: {
        bindings: {
          ...normalized.bindings,
          [commandId]: shortcuts
        }
      }
    });
  }, [normalized.bindings, update]);
  reactExports.useEffect(() => {
    if (!capturingCommandId) return;
    const onKeyDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "Escape" && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        setCapturingCommandId(null);
        setNotice(null);
        return;
      }
      const shortcut = keyboardEventToShortcut(event);
      if (!shortcut) return;
      const conflictId = findKeyboardShortcutConflict(effectiveBindings, capturingCommandId, shortcut);
      if (conflictId) {
        setNotice({
          tone: "error",
          message: t("shortcutConflict", { command: commandLabel(conflictId) })
        });
        return;
      }
      updateBinding(capturingCommandId, [shortcut]);
      setCapturingCommandId(null);
      setNotice(null);
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [capturingCommandId, commandLabel, effectiveBindings, t, updateBinding]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2 rounded-xl border border-ds-border bg-ds-card px-3 py-2 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 shrink-0 text-ds-faint", strokeWidth: 1.75 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "min-w-0 flex-1 bg-transparent text-[14px] text-ds-ink placeholder:text-ds-faint focus:outline-none",
          value: query,
          placeholder: t("shortcutSearchPlaceholder"),
          onChange: (event) => setQuery(event.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Keyboard, { className: "h-4 w-4 shrink-0 text-ds-faint", strokeWidth: 1.75 })
    ] }),
    notice ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InlineNoticeView, { notice }) }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("keyboardShortcuts"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_minmax(180px,240px)_40px] gap-3 border-b border-ds-border-muted px-3 py-3 text-[12px] font-semibold text-ds-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: t("shortcutCommandColumn") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: t("shortcutBindingColumn") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-ds-border-muted", children: filteredCommands.map((command) => {
        const shortcuts = effectiveBindings[command.id];
        const capturing = capturingCommandId === command.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-[minmax(0,1fr)_minmax(180px,240px)_40px] items-center gap-3 px-3 py-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[14px] font-medium text-ds-ink", children: t(command.labelKey) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate text-[12px] text-ds-muted", children: t(command.descriptionKey) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setCapturingCommandId(command.id);
                    setNotice({ tone: "info", message: t("shortcutCaptureHint") });
                  },
                  className: `flex min-h-9 w-full items-center gap-1.5 rounded-xl border px-3 py-1.5 text-left transition ${capturing ? "border-accent/50 bg-accent/10 text-accent" : "border-ds-border bg-ds-card text-ds-muted hover:bg-ds-hover hover:text-ds-ink"}`,
                  children: capturing ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] font-medium", children: t("shortcutRecording") }) : shortcuts.length > 0 ? shortcuts.map((shortcut) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "rounded-full bg-ds-subtle px-2 py-0.5 text-[12px] font-medium text-ds-ink",
                      children: shortcut
                    },
                    shortcut
                  )) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px]", children: t("shortcutUnassigned") })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => updateBinding(command.id, []),
                  className: "flex h-9 w-9 items-center justify-center rounded-xl text-ds-muted transition hover:bg-ds-hover hover:text-ds-ink",
                  "aria-label": t("shortcutReset"),
                  title: t("shortcutReset"),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", strokeWidth: 1.75 })
                }
              )
            ]
          },
          command.id
        );
      }) })
    ] })
  ] });
}
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const fractionDigits = value >= 10 || unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(fractionDigits)} ${units[unitIndex]}`;
}
function GuiUpdateControl({
  info,
  checking,
  downloading,
  installing,
  downloaded,
  progress,
  error,
  onCheck,
  onDownload,
  onInstall,
  t
}) {
  const busy = checking || downloading || installing;
  let title = "";
  let detail = null;
  let tone = "neutral";
  if (downloading) {
    title = t("guiUpdateDownloading", { percent: Math.max(0, Math.round(progress?.percent ?? 0)) });
    detail = progress ? t("guiUpdateDownloadProgress", {
      transferred: formatBytes(progress.transferred),
      total: formatBytes(progress.total),
      speed: formatBytes(progress.bytesPerSecond)
    }) : null;
    tone = "warn";
  } else if (installing) {
    title = t("guiUpdateInstalling");
    tone = "warn";
  } else if (downloaded && info?.ok) {
    title = t("guiUpdateDownloaded", { version: info.latestVersion });
    detail = t("guiUpdateDownloadedDesc");
    tone = "warn";
  } else if (checking && !info) {
    title = t("guiUpdateChecking");
  } else if (error) {
    title = t("guiUpdateCheckFailed");
    detail = error;
    tone = "error";
  } else if (info && !info.ok && info.code === "not_configured") {
    title = t("guiUpdateNotConfiguredTitle");
    detail = t("guiUpdateErrNotConfigured");
    tone = "warn";
  } else if (info?.ok && info.hasUpdate) {
    title = info.manualOnly ? t("guiUpdateAvailableManual", { current: info.currentVersion, latest: info.latestVersion }) : t("guiUpdateAvailable", { current: info.currentVersion, latest: info.latestVersion });
    tone = "warn";
  } else if (info?.ok) {
    title = t("guiUpdateCurrent", { version: info.currentVersion });
    tone = "good";
  }
  const releaseUrl = info?.ok && info.hasUpdate && info.manualOnly ? info.releaseUrl : !info?.ok && info?.releaseUrl ? info.releaseUrl : null;
  const canDownload = Boolean(info?.ok && info.hasUpdate && !info.manualOnly && !downloaded);
  const canInstall = Boolean(info?.ok && downloaded);
  const panelClass = tone === "error" ? "border-red-300 bg-red-50 text-red-950 dark:border-red-800/70 dark:bg-red-950/25 dark:text-red-100" : tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-700/70 dark:bg-amber-950/30 dark:text-amber-100" : tone === "good" ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-700/70 dark:bg-emerald-950/30 dark:text-emerald-100" : "border-ds-border bg-ds-card text-ds-ink";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full min-w-0 md:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-xl border px-3 py-2.5 shadow-sm ${panelClass}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mt-0.5 h-4 w-4 shrink-0 animate-spin", strokeWidth: 2 }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0", strokeWidth: 1.75 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0", strokeWidth: 1.75 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "break-words text-[13px] font-semibold", children: title }),
        detail ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 break-words text-[12px] leading-5 opacity-75", children: detail }) : null
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => void onCheck(),
          disabled: busy,
          className: "inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover disabled:cursor-not-allowed disabled:opacity-55",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`, strokeWidth: 1.75 }),
            t("guiUpdateCheck")
          ]
        }
      ),
      canDownload || downloading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => void onDownload(),
          disabled: !canDownload || busy,
          className: "inline-flex items-center gap-1.5 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[13px] font-medium text-ds-ink shadow-sm transition hover:bg-ds-hover disabled:cursor-not-allowed disabled:opacity-55",
          children: [
            downloading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin", strokeWidth: 2 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5", strokeWidth: 1.75 }),
            t("guiUpdateDownload")
          ]
        }
      ) : null,
      canInstall || installing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => void onInstall(),
          disabled: !canInstall || installing,
          className: "inline-flex items-center gap-1.5 rounded-xl bg-ds-userbubble px-3 py-2 text-[13px] font-medium text-ds-userbubbleFg shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55",
          children: [
            installing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin", strokeWidth: 2 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5", strokeWidth: 1.75 }),
            t("guiUpdateInstall")
          ]
        }
      ) : null,
      releaseUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => void window.dsGui.openExternal(releaseUrl).catch(() => void 0),
          className: "inline-flex items-center gap-1.5 rounded-xl bg-ds-userbubble px-3 py-2 text-[13px] font-medium text-ds-userbubbleFg shadow-sm transition hover:opacity-90",
          children: t("guiUpdateOpenRelease")
        }
      ) : null
    ] })
  ] });
}
function GuiUpdateSettingsSection({ ctx }) {
  const {
    t,
    form,
    update,
    selectControlClass,
    guiUpdateInfo,
    checkingGuiUpdate,
    downloadingGuiUpdate,
    installingGuiUpdate,
    guiUpdateDownloaded,
    guiUpdateProgress,
    guiUpdateError,
    checkGuiUpdate,
    downloadGuiUpdate,
    installGuiUpdate
  } = ctx;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SettingsCard, { title: t("guiUpdate"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingRow,
      {
        title: t("guiUpdateChannel"),
        description: t("guiUpdateChannelDesc"),
        control: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: selectControlClass,
            value: form.guiUpdate.channel,
            onChange: (e) => update({
              guiUpdate: { channel: e.target.value }
            }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "frontier", children: t("guiUpdateChannelFrontier") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "stable", children: t("guiUpdateChannelStable") })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SettingRow,
      {
        title: t("guiUpdate"),
        description: t("guiUpdateDesc"),
        control: /* @__PURE__ */ jsxRuntimeExports.jsx(
          GuiUpdateControl,
          {
            info: guiUpdateInfo,
            checking: checkingGuiUpdate,
            downloading: downloadingGuiUpdate,
            installing: installingGuiUpdate,
            downloaded: guiUpdateDownloaded,
            progress: guiUpdateProgress,
            error: guiUpdateError,
            onCheck: checkGuiUpdate,
            onDownload: downloadGuiUpdate,
            onInstall: installGuiUpdate,
            t
          }
        )
      }
    )
  ] });
}
function SettingsView() {
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const setRoute = useChatStore((s) => s.setRoute);
  const settingsReturnRoute = useChatStore((s) => s.settingsReturnRoute);
  const settingsSection = useChatStore((s) => s.settingsSection);
  const openCode = useChatStore((s) => s.openCode);
  const openClaw = useChatStore((s) => s.openClaw);
  const openSchedule = useChatStore((s) => s.openSchedule);
  const openInitialSetup = useChatStore((s) => s.openInitialSetup);
  const openPlugins = useChatStore((s) => s.openPlugins);
  const applyI18n = useChatStore((s) => s.applyI18nFromSettings);
  const reloadUiSettings = useChatStore((s) => s.reloadUiSettings);
  const probeRuntime = useChatStore((s) => s.probeRuntime);
  const [category, setCategory] = reactExports.useState("general");
  const [form, setForm] = reactExports.useState(null);
  const [loadError, setLoadError] = reactExports.useState(null);
  const [workspacePickerError, setWorkspacePickerError] = reactExports.useState(null);
  const [clawWorkspacePickerError, setClawWorkspacePickerError] = reactExports.useState(null);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const [saveError, setSaveError] = reactExports.useState(null);
  const [showApiKey, setShowApiKey] = reactExports.useState(false);
  const [showRuntimeToken, setShowRuntimeToken] = reactExports.useState(false);
  const [logPath, setLogPath] = reactExports.useState("");
  const [logDirOpenError, setLogDirOpenError] = reactExports.useState(null);
  const [skillRootId, setSkillRootId] = reactExports.useState(() => loadPreferredSkillRootId());
  const [skillNotice, setSkillNotice] = reactExports.useState(null);
  const [mcpConfigPath, setMcpConfigPath] = reactExports.useState("~/.legalwork/mcp.json");
  const [mcpConfigText, setMcpConfigText] = reactExports.useState("");
  const [mcpConfigExists, setMcpConfigExists] = reactExports.useState(false);
  const [mcpLoading, setMcpLoading] = reactExports.useState(false);
  const [mcpLoaded, setMcpLoaded] = reactExports.useState(false);
  const [mcpBusy, setMcpBusy] = reactExports.useState(false);
  const [mcpNotice, setMcpNotice] = reactExports.useState(null);
  const [runtimeInfo, setRuntimeInfo] = reactExports.useState(null);
  const [toolDiagnostics, setToolDiagnostics] = reactExports.useState(null);
  const [memoryRecords, setMemoryRecords] = reactExports.useState([]);
  const [runtimeDiagnosticsBusy, setRuntimeDiagnosticsBusy] = reactExports.useState(false);
  const [runtimeDiagnosticsNotice, setRuntimeDiagnosticsNotice] = reactExports.useState(null);
  const initializedCategory = reactExports.useRef(false);
  const saveTimer = reactExports.useRef(null);
  const statusTimer = reactExports.useRef(null);
  const draftVersion = reactExports.useRef(0);
  const agentsSectionRef = reactExports.useRef(null);
  const skillSectionRef = reactExports.useRef(null);
  const mcpSectionRef = reactExports.useRef(null);
  const permissionsSectionRef = reactExports.useRef(null);
  const formTheme = form?.theme;
  const formUiFontScale = form?.uiFontScale;
  const formWorkspaceRoot = form?.workspaceRoot;
  const formLegalwork = form ? getLegalworkRuntimeSettings(form) : null;
  const formPort = formLegalwork?.port;
  const formGuiUpdateChannel = form?.guiUpdate?.channel;
  const {
    checkingGuiUpdate,
    checkGuiUpdate,
    downloadingGuiUpdate,
    downloadGuiUpdate,
    guiUpdateDownloaded,
    guiUpdateError,
    guiUpdateInfo,
    guiUpdateProgress,
    installingGuiUpdate,
    installGuiUpdate,
    resetGuiUpdateState
  } = useSettingsGuiUpdate({
    category,
    channel: formGuiUpdateChannel,
    form,
    t
  });
  reactExports.useEffect(() => {
    let cancelled = false;
    if (typeof window.dsGui === "undefined") {
      setLoadError("PRELOAD_BRIDGE");
      return;
    }
    void rendererRuntimeClient.getSettings({ forceRefresh: true }).then((s) => {
      if (!cancelled) setForm(coerceRendererSettings(s));
    }).catch((e) => {
      if (!cancelled) setLoadError(e instanceof Error ? e.message : String(e));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  reactExports.useEffect(() => {
    if (!formTheme || !formUiFontScale) return;
    applyTheme(formTheme);
    applyUiFontScale(formUiFontScale);
  }, [formTheme, formUiFontScale]);
  reactExports.useEffect(() => {
    if (typeof window.dsGui?.getLogPath !== "function") return;
    void window.dsGui.getLogPath().then((p) => setLogPath(p)).catch(() => void 0);
  }, [category]);
  reactExports.useEffect(() => {
    if (!form || initializedCategory.current) return;
    initializedCategory.current = true;
    if (!getActiveAgentApiKey(form).trim()) {
      setCategory("general");
    }
  }, [form]);
  reactExports.useEffect(() => {
    if (settingsSection === "general") {
      setCategory("general");
      return;
    }
    if (settingsSection === "claw") {
      setCategory("claw");
      return;
    }
    if (settingsSection === "shortcuts") {
      setCategory("shortcuts");
      return;
    }
    setCategory("agents");
  }, [settingsSection]);
  reactExports.useEffect(() => {
    if (!form) return;
    if (settingsSection === "general" || settingsSection === "claw" || settingsSection === "shortcuts" || settingsSection === "guiUpdate" || category !== "agents") {
      return;
    }
    const refs = {
      agents: agentsSectionRef.current,
      skill: skillSectionRef.current,
      mcp: mcpSectionRef.current
    };
    const target = refs[settingsSection];
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [category, form, settingsSection]);
  reactExports.useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);
  const portError = reactExports.useMemo(() => {
    if (!form || typeof formPort !== "number") return null;
    if (!hasValidPort(form)) return t("portInvalid");
    return null;
  }, [form, formPort, t]);
  const skillRootOptions = reactExports.useMemo(() => {
    const workspaceRoot = normalizeWorkspaceRoot(formWorkspaceRoot);
    const hasWorkspace = !!workspaceRoot;
    return [
      {
        id: "workspace-agents",
        label: tCommon("pluginSkillRootWorkspaceAgents"),
        path: workspaceRoot ? joinFsPath(workspaceRoot, ".agents/skills") : "",
        available: hasWorkspace
      },
      {
        id: "workspace-skills",
        label: tCommon("pluginSkillRootWorkspaceSkills"),
        path: workspaceRoot ? joinFsPath(workspaceRoot, "skills") : "",
        available: hasWorkspace
      },
      {
        id: "global-agents",
        label: tCommon("pluginSkillRootGlobalAgents"),
        path: "~/.agents/skills",
        available: true
      },
      {
        id: "global-deepseek",
        label: tCommon("pluginSkillRootGlobalDeepseek"),
        path: "~/.legalwork/skills",
        available: true
      }
    ];
  }, [formWorkspaceRoot, tCommon]);
  const selectedSkillRoot = skillRootOptions.find((option) => option.id === skillRootId && option.available) ?? skillRootOptions.find((option) => option.available);
  reactExports.useEffect(() => {
    const selectedOption = skillRootOptions.find((option) => option.id === skillRootId && option.available);
    if (selectedOption) {
      savePreferredSkillRootId(skillRootId);
      return;
    }
    const fallback = skillRootOptions.find((option) => option.available);
    if (fallback && fallback.id !== skillRootId) {
      setSkillRootId(fallback.id);
    }
  }, [skillRootId, skillRootOptions]);
  const loadMcpConfig = async () => {
    if (typeof window.dsGui?.getDeepseekConfigFile !== "function") return;
    setMcpLoading(true);
    setMcpNotice(null);
    try {
      const config = await window.dsGui.getDeepseekConfigFile();
      setMcpConfigPath(config.path);
      setMcpConfigText(config.content);
      setMcpConfigExists(config.exists);
      setMcpLoaded(true);
    } catch (e) {
      setMcpNotice({
        tone: "error",
        message: e instanceof Error ? e.message : String(e)
      });
    } finally {
      setMcpLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (category !== "agents" || mcpLoaded || mcpLoading) return;
    void loadMcpConfig();
  }, [category, mcpLoaded, mcpLoading]);
  const openSkillRoot = async () => {
    if (!selectedSkillRoot?.path || !selectedSkillRoot.available) {
      setSkillNotice({ tone: "error", message: t("skillsRootUnavailable") });
      return;
    }
    if (typeof window.dsGui?.openSkillRoot !== "function") return;
    setSkillNotice(null);
    const result = await window.dsGui.openSkillRoot(selectedSkillRoot.path);
    if (!result.ok) {
      setSkillNotice({ tone: "error", message: result.message ?? t("applyFailed") });
    }
  };
  const saveMcpConfig = async () => {
    if (typeof window.dsGui?.setDeepseekConfigFile !== "function") return;
    setMcpBusy(true);
    setMcpNotice(null);
    try {
      const result = await window.dsGui.setDeepseekConfigFile(mcpConfigText);
      setMcpConfigPath(result.path);
      setMcpConfigExists(true);
      setMcpNotice({
        tone: "success",
        message: t("mcpSaved", { path: result.path })
      });
    } catch (e) {
      setMcpNotice({
        tone: "error",
        message: e instanceof Error ? e.message : String(e)
      });
    } finally {
      setMcpBusy(false);
    }
  };
  const openMcpConfigDir = async () => {
    if (typeof window.dsGui?.openDeepseekConfigDir !== "function") return;
    const result = await window.dsGui.openDeepseekConfigDir();
    if (!result.ok) {
      setMcpNotice({ tone: "error", message: result.message ?? t("applyFailed") });
    }
  };
  const refreshLegalworkDiagnostics = reactExports.useCallback(async () => {
    const provider2 = getProvider();
    setRuntimeDiagnosticsBusy(true);
    setRuntimeDiagnosticsNotice(null);
    try {
      const loaded = await loadLegalworkDiagnostics(provider2, {
        workspace: normalizeWorkspaceRoot(formWorkspaceRoot)
      });
      if (loaded.runtimeInfo !== void 0) setRuntimeInfo(loaded.runtimeInfo);
      if (loaded.toolDiagnostics !== void 0) setToolDiagnostics(loaded.toolDiagnostics);
      if (loaded.memoryRecords !== void 0) setMemoryRecords(loaded.memoryRecords);
      if (loaded.errors.length > 0) {
        setRuntimeDiagnosticsNotice({
          tone: "error",
          message: loaded.errors.join(" | ")
        });
      }
    } catch (error) {
      setRuntimeDiagnosticsNotice({
        tone: "error",
        message: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setRuntimeDiagnosticsBusy(false);
    }
  }, [formWorkspaceRoot]);
  reactExports.useEffect(() => {
    if (category !== "agents") return;
    void refreshLegalworkDiagnostics();
  }, [category, refreshLegalworkDiagnostics]);
  const disableMemoryRecord = async (memoryId) => {
    const provider2 = getProvider();
    if (typeof provider2.updateMemory !== "function") return;
    try {
      const memory = await provider2.updateMemory(memoryId, { disabled: true });
      setMemoryRecords((records) => records.map((record) => record.id === memoryId ? memory : record));
    } catch (error) {
      setRuntimeDiagnosticsNotice({
        tone: "error",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  };
  const deleteMemoryRecord = async (memoryId) => {
    const provider2 = getProvider();
    if (typeof provider2.deleteMemory !== "function") return;
    try {
      await provider2.deleteMemory(memoryId);
      setMemoryRecords((records) => records.filter((record) => record.id !== memoryId));
    } catch (error) {
      setRuntimeDiagnosticsNotice({
        tone: "error",
        message: error instanceof Error ? error.message : String(error)
      });
    }
  };
  const scrollToAgentSection = (target) => {
    const refs = {
      agents: agentsSectionRef.current,
      skill: skillSectionRef.current,
      mcp: mcpSectionRef.current,
      permissions: permissionsSectionRef.current
    };
    refs[target]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const persistSettings = async (snapshot, version) => {
    if (!hasValidPort(snapshot)) return;
    setSaveStatus("saving");
    setSaveError(null);
    try {
      const next = coerceRendererSettings(await rendererRuntimeClient.setSettings(snapshot));
      if (version !== draftVersion.current) return;
      setForm(next);
      emitRendererSettingsChanged(next);
      await applyI18n(next.locale);
      void reloadUiSettings();
      void probeRuntime("background");
      if (version !== draftVersion.current) return;
      setSaveStatus("saved");
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
      statusTimer.current = window.setTimeout(() => {
        if (version === draftVersion.current) setSaveStatus("idle");
        statusTimer.current = null;
      }, 1500);
    } catch (e) {
      if (version !== draftVersion.current) return;
      setSaveError(e instanceof Error ? e.message : String(e));
      setSaveStatus("error");
    }
  };
  const scheduleSave = (next) => {
    draftVersion.current += 1;
    const version = draftVersion.current;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    statusTimer.current = null;
    setSaveError(null);
    if (!hasValidPort(next)) {
      setSaveStatus("idle");
      return;
    }
    setSaveStatus("saving");
    saveTimer.current = window.setTimeout(() => {
      saveTimer.current = null;
      void persistSettings(next, version);
    }, 450);
  };
  const flushPendingSave = async () => {
    if (!form || !hasValidPort(form)) return;
    draftVersion.current += 1;
    const version = draftVersion.current;
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (statusTimer.current) {
      window.clearTimeout(statusTimer.current);
      statusTimer.current = null;
    }
    await persistSettings(form, version);
  };
  const goBack = () => {
    void (async () => {
      await flushPendingSave();
      await reloadUiSettings();
      if (settingsReturnRoute === "claw") {
        openClaw();
        return;
      }
      if (settingsReturnRoute === "schedule") {
        openSchedule();
        return;
      }
      if (settingsReturnRoute === "plugins") {
        setRoute("plugins");
        return;
      }
      await openCode();
    })();
  };
  const openOnboardingPreview = () => {
    void (async () => {
      await flushPendingSave();
      openInitialSetup("preview");
    })();
  };
  if (loadError) {
    const msg = loadError === "PRELOAD_BRIDGE" ? t("preloadBridgeError") : t("loadFailed", { message: loadError });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-4 bg-ds-main p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-sm text-red-700 dark:text-red-300", children: msg }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "rounded-xl bg-ds-userbubble px-4 py-2 text-sm font-medium text-ds-userbubbleFg",
          onClick: goBack,
          children: t("back")
        }
      )
    ] });
  }
  if (!form) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center bg-ds-main text-ds-faint", children: t("loading") });
  }
  const legalwork = getLegalworkRuntimeSettings(form);
  const provider = getModelProviderSettings(form);
  const activeApiKey = getActiveAgentApiKey(form);
  const update = (partial) => {
    const next = mergeSettings(form, partial);
    setForm(next);
    if (partial.locale) void applyI18n(partial.locale);
    if (partial.guiUpdate?.channel && partial.guiUpdate.channel !== form.guiUpdate.channel) {
      resetGuiUpdateState();
    }
    scheduleSave(next);
  };
  const sharedApiKey = provider.apiKey;
  const sharedBaseUrl = provider.baseUrl;
  const updateSharedCredential = (patch) => {
    update({ provider: patch });
  };
  const updateLegalwork = (patch) => {
    update({ agents: legalworkSettingsPatch(patch) });
  };
  const pickWorkspace = async () => {
    try {
      setWorkspacePickerError(null);
      if (typeof window.dsGui?.pickWorkspaceDirectory !== "function") {
        throw new Error("workspace:pick-directory unavailable");
      }
      const picked = await window.dsGui.pickWorkspaceDirectory(form.workspaceRoot || void 0);
      if (!picked.canceled && picked.path) {
        update({ workspaceRoot: picked.path });
      }
    } catch (e) {
      setWorkspacePickerError(formatWorkspacePickerError(e));
    }
  };
  const resetWorkspaceToDefault = () => {
    setWorkspacePickerError(null);
    update({ workspaceRoot: DEFAULT_WORKSPACE_ROOT });
  };
  const pickClawWorkspace = async () => {
    try {
      setClawWorkspacePickerError(null);
      if (typeof window.dsGui?.pickWorkspaceDirectory !== "function") {
        throw new Error("workspace:pick-directory unavailable");
      }
      const picked = await window.dsGui.pickWorkspaceDirectory(
        form.claw.im.workspaceRoot || form.workspaceRoot || void 0
      );
      if (!picked.canceled && picked.path) {
        update({ claw: { im: { workspaceRoot: picked.path } } });
      }
    } catch (e) {
      setClawWorkspacePickerError(formatWorkspacePickerError(e));
    }
  };
  const resetClawWorkspaceToDefault = () => {
    setClawWorkspacePickerError(null);
    update({ claw: { im: { workspaceRoot: "" } } });
  };
  const selectControlClass = "w-full min-w-0 rounded-xl border border-ds-border bg-ds-card px-3 py-2 text-[14px] text-ds-ink shadow-sm focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30";
  const settingsSectionContext = {
    t,
    tCommon,
    form,
    provider,
    legalwork,
    activeApiKey,
    update,
    updateLegalwork,
    updateSharedCredential,
    sharedApiKey,
    sharedBaseUrl,
    showApiKey,
    setShowApiKey,
    showRuntimeToken,
    setShowRuntimeToken,
    portError,
    selectControlClass,
    openOnboardingPreview,
    pickWorkspace,
    resetWorkspaceToDefault,
    workspacePickerError,
    guiUpdateInfo,
    checkingGuiUpdate,
    downloadingGuiUpdate,
    installingGuiUpdate,
    guiUpdateDownloaded,
    guiUpdateProgress,
    guiUpdateError,
    checkGuiUpdate,
    downloadGuiUpdate,
    installGuiUpdate,
    logPath,
    logDirOpenError,
    setLogDirOpenError,
    scrollToAgentSection,
    agentsSectionRef,
    skillSectionRef,
    mcpSectionRef,
    permissionsSectionRef,
    selectedSkillRoot,
    skillRootOptions,
    skillRootId,
    setSkillRootId,
    skillNotice,
    openSkillRoot,
    openPlugins,
    mcpConfigPath,
    mcpConfigExists,
    mcpConfigText,
    setMcpConfigText,
    mcpLoading,
    mcpBusy,
    mcpNotice,
    saveMcpConfig,
    loadMcpConfig,
    openMcpConfigDir,
    runtimeInfo,
    toolDiagnostics,
    memoryRecords,
    runtimeDiagnosticsBusy,
    runtimeDiagnosticsNotice,
    refreshLegalworkDiagnostics,
    disableMemoryRecord,
    deleteMemoryRecord,
    pickClawWorkspace,
    resetClawWorkspaceToDefault,
    clawWorkspacePickerError,
    splitSettingsList,
    listSettingsText
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ds-drag flex h-full min-h-0 w-full min-w-0 bg-ds-main", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSidebar, { category, setCategory, goBack, t }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ds-no-drag min-h-0 min-w-0 flex-1 overflow-y-auto px-10 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl", children: [
      !activeApiKey.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-2xl border border-amber-300/80 bg-amber-50/95 px-5 py-4 text-amber-950 shadow-sm dark:border-amber-700/60 dark:bg-amber-950/35 dark:text-amber-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[15px] font-semibold", children: t("apiKeyRequiredTitle") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px] leading-6 text-amber-900/90 dark:text-amber-100/90", children: t("apiKeyRequiredBody") })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-ds-ink", children: t("title") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[14px] text-ds-muted", children: t("subtitle") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            title: saveStatus === "error" && saveError ? saveError : void 0,
            className: `shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${portError ? "bg-amber-500/15 text-amber-700 dark:text-amber-200" : saveStatus === "saved" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200" : saveStatus === "error" ? "bg-red-500/15 text-red-700 dark:text-red-200" : "bg-ds-subtle text-ds-muted"}`,
            children: portError ? t("autoApplyBlocked") : saveStatus === "saving" ? t("applying") : saveStatus === "saved" ? t("applied") : saveStatus === "error" ? t("applyFailed") : t("autoApplyHint")
          }
        )
      ] }),
      category === "general" ? /* @__PURE__ */ jsxRuntimeExports.jsx(GeneralSettingsSection, { ctx: settingsSectionContext }) : null,
      category === "agents" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AgentsSettingsSection, { ctx: settingsSectionContext }) : null,
      category === "shortcuts" ? /* @__PURE__ */ jsxRuntimeExports.jsx(KeyboardShortcutsSettingsSection, { ctx: settingsSectionContext }) : null,
      category === "claw" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClawSettingsSection, { ctx: settingsSectionContext }) : null,
      category === "guiUpdate" ? /* @__PURE__ */ jsxRuntimeExports.jsx(GuiUpdateSettingsSection, { ctx: settingsSectionContext }) : null
    ] }) })
  ] });
}
export {
  SettingsView
};
