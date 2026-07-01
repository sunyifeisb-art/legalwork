"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_fs = require("node:fs");
const node_path = require("node:path");
const node_url = require("node:url");
const promises = require("node:fs/promises");
const node_os = require("node:os");
const node_crypto = require("node:crypto");
const zod = require("zod");
const node_child_process = require("node:child_process");
const node_net = require("node:net");
const node_util = require("node:util");
const node_http = require("node:http");
const nodeSdk = require("@larksuiteoapi/node-sdk");
const clawScheduleMcpServer = require("./chunks/claw-schedule-mcp-server-B7QFpjTo.cjs");
const node_module = require("node:module");
const promises$1 = require("node:timers/promises");
const react = require("react");
const server$1 = require("react-dom/server");
const ReactMarkdown = require("react-markdown");
const remarkGfm = require("remark-gfm");
require("@modelcontextprotocol/sdk/server/mcp.js");
require("@modelcontextprotocol/sdk/server/stdio.js");
const DEFAULT_RENAME_RETRY_ATTEMPTS = 6;
const DEFAULT_RENAME_RETRY_BASE_DELAY_MS = 25;
const RETRYABLE_RENAME_ERROR_CODES = /* @__PURE__ */ new Set(["EPERM", "EACCES", "EBUSY"]);
async function atomicWriteFile(path, contents, options = {}) {
  await promises.mkdir(node_path.dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.${Date.now()}.${node_crypto.randomUUID()}.tmp`;
  try {
    await promises.writeFile(tmp, contents, "utf-8");
    try {
      await renameWithRetry(tmp, path, options.renameRetry);
    } catch (error) {
      if (!shouldFallbackToDirectWrite(error)) {
        throw error;
      }
      await promises.writeFile(path, contents, "utf-8");
    }
  } catch (error) {
    await promises.rm(tmp, { force: true }).catch(() => void 0);
    throw error;
  }
  await promises.rm(tmp, { force: true }).catch(() => void 0);
}
async function renameWithRetry(from, to, options) {
  const attempts = Math.max(1, Math.floor(options?.attempts ?? DEFAULT_RENAME_RETRY_ATTEMPTS));
  const baseDelayMs = Math.max(0, Math.floor(options?.baseDelayMs ?? DEFAULT_RENAME_RETRY_BASE_DELAY_MS));
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await promises.rename(from, to);
      return;
    } catch (error) {
      if (attempt >= attempts || !isRetryableRenameError(error)) {
        throw error;
      }
      await delay(baseDelayMs * attempt);
    }
  }
}
function isRetryableRenameError(error) {
  return RETRYABLE_RENAME_ERROR_CODES.has(String(error?.code ?? ""));
}
function shouldFallbackToDirectWrite(error) {
  return process.platform === "win32" && isRetryableRenameError(error);
}
function delay(ms) {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const GUI_UPDATE_CHANNELS = ["frontier", "stable"];
const DEFAULT_GUI_UPDATE_CHANNEL = "stable";
function normalizeGuiUpdateChannel(value) {
  return value === "stable" || value === "frontier" ? value : DEFAULT_GUI_UPDATE_CHANNEL;
}
const APPROVAL_POLICIES = [
  "on-request",
  "untrusted",
  "never",
  "auto",
  "suggest"
];
const DEFAULT_APPROVAL_POLICY = "auto";
const ApprovalPolicySchema = zod.z.enum(APPROVAL_POLICIES);
const SANDBOX_MODES = [
  "read-only",
  "workspace-write",
  "danger-full-access",
  "external-sandbox"
];
const DEFAULT_SANDBOX_MODE = "danger-full-access";
const SandboxModeSchema = zod.z.enum(SANDBOX_MODES);
const DEFAULT_DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEFAULT_CLAW_MODEL = "auto";
const CLAW_MODEL_IDS = ["auto", "deepseek-v4-pro", "deepseek-v4-flash"];
const DEFAULT_SCHEDULE_MODEL = DEFAULT_CLAW_MODEL;
const SCHEDULE_MODEL_IDS = CLAW_MODEL_IDS;
const DEFAULT_SCHEDULE_REASONING_EFFORT = "medium";
const SCHEDULE_REASONING_EFFORT_IDS = ["off", "low", "medium", "high", "max"];
const DEFAULT_SCHEDULE_INTERNAL_PORT = 8788;
const DEFAULT_WRITE_WORKSPACE_ROOT = "~/.legalwork/write_workspace";
const DEFAULT_LEGALWORK_DATA_DIR = "~/.legalwork/legalwork";
const DEFAULT_LEGALWORK_MODEL = "deepseek-v4-pro";
const DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL = "https://api.deepseek.com/beta";
const DEFAULT_WRITE_INLINE_COMPLETION_MODEL = "deepseek-v4-flash";
const WRITE_INLINE_COMPLETION_MODEL_IDS = ["deepseek-v4-pro", "deepseek-v4-flash"];
const DEFAULT_WRITE_INLINE_COMPLETION_DEBOUNCE_MS = 650;
const DEFAULT_WRITE_INLINE_COMPLETION_MIN_ACCEPT_SCORE = 0.52;
const DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS = 96;
const DEFAULT_WRITE_INLINE_LONG_COMPLETION_DEBOUNCE_MS = 2800;
const DEFAULT_WRITE_INLINE_LONG_COMPLETION_MIN_ACCEPT_SCORE = 0.36;
const DEFAULT_WRITE_INLINE_LONG_COMPLETION_MAX_TOKENS = 256;
const DEFAULT_LEGALWORK_PORT = 8899;
const DEFAULT_WEIXIN_BRIDGE_RPC_URL = "http://127.0.0.1:18790/api/v1/admin/rpc";
const DEFAULT_MODEL_PROVIDER_ID = "deepseek";
const LEGACY_COREAGENT_DATA_DIR = "~/.deepseekgui/coreagent";
const LEGACY_LEGALWORK_DEFAULT_MODEL = "deepseek-chat";
const LEGACY_LOCAL_HTTP_DEFAULT_PORT = 7878;
function legacyLocalHttpRuntimeDefaults(port = 7878) {
  return {
    binaryPath: "",
    port,
    autoStart: true,
    apiKey: "",
    baseUrl: DEFAULT_DEEPSEEK_BASE_URL,
    runtimeToken: "",
    extraCorsOrigins: ["http://localhost:5173", "http://127.0.0.1:5173"],
    approvalPolicy: DEFAULT_APPROVAL_POLICY,
    sandboxMode: DEFAULT_SANDBOX_MODE
  };
}
function legacyReasoningRuntimeDefaults() {
  return {
    binaryPath: "",
    autoStart: true,
    apiKey: "",
    baseUrl: DEFAULT_DEEPSEEK_BASE_URL,
    model: LEGACY_LEGALWORK_DEFAULT_MODEL,
    reasoningEffort: "medium",
    editMode: "auto"
  };
}
function defaultLegalworkRuntimeSettings(port = DEFAULT_LEGALWORK_PORT) {
  return {
    binaryPath: "",
    port,
    autoStart: true,
    apiKey: "",
    baseUrl: "",
    providerId: "",
    runtimeToken: "",
    dataDir: DEFAULT_LEGALWORK_DATA_DIR,
    model: DEFAULT_LEGALWORK_MODEL,
    approvalPolicy: DEFAULT_APPROVAL_POLICY,
    sandboxMode: DEFAULT_SANDBOX_MODE,
    tokenEconomyMode: false,
    tokenEconomy: defaultLegalworkTokenEconomySettings(),
    insecure: false,
    endpointFormat: "",
    mcpSearch: defaultLegalworkMcpSearchSettings(),
    storage: defaultLegalworkStorageSettings(),
    contextCompaction: defaultLegalworkContextCompactionSettings(),
    runtimeTuning: defaultLegalworkRuntimeTuningSettings()
  };
}
function normalizeLegalworkSandboxMode(value) {
  return value === "read-only" || value === "workspace-write" ? DEFAULT_SANDBOX_MODE : value ?? DEFAULT_SANDBOX_MODE;
}
function defaultLegalworkMcpSearchSettings() {
  return {
    enabled: false,
    mode: "auto",
    autoThresholdToolCount: 24,
    topKDefault: 5,
    topKMax: 10,
    minScore: 0.15
  };
}
function defaultLegalworkTokenEconomySettings() {
  return {
    enabled: false,
    compressToolDescriptions: true,
    compressToolResults: true,
    conciseResponses: true,
    historyHygiene: defaultLegalworkHistoryHygieneSettings()
  };
}
function defaultLegalworkHistoryHygieneSettings() {
  return {
    maxToolResultLines: 320,
    maxToolResultBytes: 32 * 1024,
    maxToolResultTokens: 8e3,
    maxToolArgumentStringBytes: 8 * 1024,
    maxToolArgumentStringTokens: 2e3,
    maxArrayItems: 80
  };
}
function defaultLegalworkStorageSettings() {
  return {
    backend: "hybrid",
    sqlitePath: ""
  };
}
function defaultLegalworkContextCompactionSettings() {
  return {
    defaultSoftThreshold: 16e3,
    defaultHardThreshold: 24e3,
    summaryMode: "heuristic",
    summaryTimeoutMs: 15e3,
    summaryMaxTokens: 1200,
    summaryInputMaxBytes: 96 * 1024
  };
}
function defaultLegalworkRuntimeTuningSettings() {
  return {
    toolStorm: {
      enabled: true,
      windowSize: 8,
      threshold: 3
    },
    toolArgumentRepair: {
      maxStringBytes: 512 * 1024
    }
  };
}
function getLegalworkRuntimeSettings(settings) {
  const raw = settings.agents?.legalwork;
  return mergeLegalworkRuntimeSettings(defaultLegalworkRuntimeSettings(), raw);
}
function legalworkSettingsEnvelope(legalwork) {
  return { legalwork };
}
function mergeLegalworkRuntimeSettings(current, patch) {
  const currentMcpSearch = normalizeLegalworkMcpSearchSettings(current.mcpSearch);
  const nextMcpSearch = normalizeLegalworkMcpSearchSettings({
    ...currentMcpSearch,
    ...patch?.mcpSearch ?? {}
  });
  const currentTokenEconomy = normalizeLegalworkTokenEconomySettings(
    current.tokenEconomy,
    current.tokenEconomyMode
  );
  const patchedTokenEconomy = normalizeLegalworkTokenEconomySettings({
    ...currentTokenEconomy,
    ...patch?.tokenEconomy ?? {},
    historyHygiene: {
      ...currentTokenEconomy.historyHygiene,
      ...patch?.tokenEconomy?.historyHygiene ?? {}
    }
  }, currentTokenEconomy.enabled);
  const tokenEconomyEnabled = typeof patch?.tokenEconomy?.enabled === "boolean" ? patch.tokenEconomy.enabled : typeof patch?.tokenEconomyMode === "boolean" ? patch.tokenEconomyMode : patchedTokenEconomy.enabled;
  const nextTokenEconomy = {
    ...patchedTokenEconomy,
    enabled: tokenEconomyEnabled
  };
  const currentStorage = normalizeLegalworkStorageSettings(current.storage);
  const nextStorage = normalizeLegalworkStorageSettings({
    ...currentStorage,
    ...patch?.storage ?? {}
  });
  const currentContextCompaction = normalizeLegalworkContextCompactionSettings(current.contextCompaction);
  const nextContextCompaction = normalizeLegalworkContextCompactionSettings({
    ...currentContextCompaction,
    ...patch?.contextCompaction ?? {}
  });
  const currentRuntimeTuning = normalizeLegalworkRuntimeTuningSettings(current.runtimeTuning);
  const nextRuntimeTuning = normalizeLegalworkRuntimeTuningSettings({
    ...currentRuntimeTuning,
    ...patch?.runtimeTuning ? {
      toolStorm: {
        ...currentRuntimeTuning.toolStorm,
        ...patch.runtimeTuning.toolStorm ?? {}
      },
      toolArgumentRepair: {
        ...currentRuntimeTuning.toolArgumentRepair,
        ...patch.runtimeTuning.toolArgumentRepair ?? {}
      }
    } : {}
  });
  return {
    ...current,
    ...patch ?? {},
    tokenEconomyMode: nextTokenEconomy.enabled,
    tokenEconomy: nextTokenEconomy,
    mcpSearch: nextMcpSearch,
    storage: nextStorage,
    contextCompaction: nextContextCompaction,
    runtimeTuning: nextRuntimeTuning
  };
}
function normalizeLegalworkTokenEconomySettings(input, enabledFallback = false) {
  return {
    enabled: typeof input?.enabled === "boolean" ? input.enabled : enabledFallback,
    compressToolDescriptions: input?.compressToolDescriptions !== false,
    compressToolResults: input?.compressToolResults !== false,
    conciseResponses: input?.conciseResponses !== false,
    historyHygiene: normalizeLegalworkHistoryHygieneSettings(input?.historyHygiene)
  };
}
function normalizeLegalworkHistoryHygieneSettings(input) {
  const defaults = defaultLegalworkHistoryHygieneSettings();
  return {
    maxToolResultLines: boundedPositiveInt(input?.maxToolResultLines, defaults.maxToolResultLines, 1e5),
    maxToolResultBytes: boundedPositiveInt(input?.maxToolResultBytes, defaults.maxToolResultBytes, 8 * 1024 * 1024),
    maxToolResultTokens: boundedPositiveInt(input?.maxToolResultTokens, defaults.maxToolResultTokens, 256e3),
    maxToolArgumentStringBytes: boundedPositiveInt(
      input?.maxToolArgumentStringBytes,
      defaults.maxToolArgumentStringBytes,
      8 * 1024 * 1024
    ),
    maxToolArgumentStringTokens: boundedPositiveInt(
      input?.maxToolArgumentStringTokens,
      defaults.maxToolArgumentStringTokens,
      64e3
    ),
    maxArrayItems: boundedPositiveInt(input?.maxArrayItems, defaults.maxArrayItems, 1e4)
  };
}
function normalizeLegalworkMcpSearchSettings(input) {
  const defaults = defaultLegalworkMcpSearchSettings();
  const topKMax = positiveInt(input?.topKMax, defaults.topKMax);
  const topKDefault = Math.min(positiveInt(input?.topKDefault, defaults.topKDefault), topKMax);
  return {
    enabled: input?.enabled === true,
    mode: input?.mode === "direct" || input?.mode === "search" || input?.mode === "auto" ? input.mode : defaults.mode,
    autoThresholdToolCount: positiveInt(input?.autoThresholdToolCount, defaults.autoThresholdToolCount),
    topKDefault,
    topKMax,
    minScore: nonNegativeNumber(input?.minScore, defaults.minScore)
  };
}
function positiveInt(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}
function nonNegativeNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}
function boundedPositiveInt(value, fallback, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(Math.floor(value), max);
}
function normalizeLegalworkStorageSettings(input) {
  const defaults = defaultLegalworkStorageSettings();
  return {
    backend: input?.backend === "file" || input?.backend === "hybrid" ? input.backend : defaults.backend,
    sqlitePath: typeof input?.sqlitePath === "string" ? input.sqlitePath.trim() : defaults.sqlitePath
  };
}
function normalizeLegalworkContextCompactionSettings(input) {
  const defaults = defaultLegalworkContextCompactionSettings();
  const defaultSoftThreshold = boundedPositiveInt(input?.defaultSoftThreshold, defaults.defaultSoftThreshold);
  const requestedHardThreshold = boundedPositiveInt(input?.defaultHardThreshold, defaults.defaultHardThreshold);
  return {
    defaultSoftThreshold,
    defaultHardThreshold: Math.max(defaultSoftThreshold, requestedHardThreshold),
    summaryMode: input?.summaryMode === "model" || input?.summaryMode === "heuristic" ? input.summaryMode : defaults.summaryMode,
    summaryTimeoutMs: boundedPositiveInt(input?.summaryTimeoutMs, defaults.summaryTimeoutMs, 12e4),
    summaryMaxTokens: boundedPositiveInt(input?.summaryMaxTokens, defaults.summaryMaxTokens, 16e3),
    summaryInputMaxBytes: boundedPositiveInt(input?.summaryInputMaxBytes, defaults.summaryInputMaxBytes, 8 * 1024 * 1024)
  };
}
function normalizeLegalworkRuntimeTuningSettings(input) {
  const defaults = defaultLegalworkRuntimeTuningSettings();
  return {
    toolStorm: {
      enabled: input?.toolStorm?.enabled !== false,
      windowSize: boundedPositiveInt(input?.toolStorm?.windowSize, defaults.toolStorm.windowSize, 128),
      threshold: Math.max(2, boundedPositiveInt(input?.toolStorm?.threshold, defaults.toolStorm.threshold, 128))
    },
    toolArgumentRepair: {
      maxStringBytes: boundedPositiveInt(
        input?.toolArgumentRepair?.maxStringBytes,
        defaults.toolArgumentRepair.maxStringBytes,
        16 * 1024 * 1024
      )
    }
  };
}
function withLegalworkRuntimeSettings(settings, legalwork) {
  return {
    ...settings,
    agents: legalworkSettingsEnvelope(legalwork)
  };
}
function applyLegalworkRuntimePatch(settings, patch) {
  return withLegalworkRuntimeSettings(
    settings,
    mergeLegalworkRuntimeSettings(getLegalworkRuntimeSettings(settings), patch)
  );
}
function isLegalworkRuntimeInsecure(runtime) {
  return runtime.insecure || !runtime.runtimeToken.trim();
}
function getActiveAgentApiKey(settings) {
  return resolveLegalworkRuntimeSettings(settings).apiKey?.trim() ?? "";
}
function nonEmptyStringOrFallback(value, fallback) {
  return typeof value === "string" && value.trim() ? value : fallback;
}
function upgradeLegacyLegalworkDefaultDataDir(value) {
  if (typeof value !== "string") return DEFAULT_LEGALWORK_DATA_DIR;
  const trimmed = value.trim();
  const normalized = trimmed.replace(/\\/g, "/").toLowerCase();
  if (!trimmed || normalized === LEGACY_COREAGENT_DATA_DIR || normalized.endsWith("/.deepseekgui/coreagent")) {
    return DEFAULT_LEGALWORK_DATA_DIR;
  }
  return trimmed;
}
function upgradeLegacyLegalworkDefaultModel(value, fallback) {
  const model = nonEmptyStringOrFallback(value, fallback).trim();
  return model === LEGACY_LEGALWORK_DEFAULT_MODEL ? DEFAULT_LEGALWORK_MODEL : model;
}
function upgradeLegacyLegalworkDefaultPort(value, fallback) {
  return value === LEGACY_LOCAL_HTTP_DEFAULT_PORT ? DEFAULT_LEGALWORK_PORT : fallback;
}
function migrateLegacyAppSettings(parsed) {
  const rawAgentProvider = parsed.agentProvider;
  const isReasoningLegacy = rawAgentProvider === "reasonix";
  const hasProviderSettings = typeof parsed.provider === "object" && parsed.provider !== null;
  const defaults = legacyLocalHttpRuntimeDefaults();
  const legalworkDefaults = defaultLegalworkRuntimeSettings();
  const legacyDeepseek = parsed.deepseek ?? {};
  const legacyLocalHttp = {
    ...defaults,
    ...parsed.agents?.codewhale ?? {},
    ...legacyDeepseek
  };
  const legacyReasoning = {
    ...legacyReasoningRuntimeDefaults(),
    ...parsed.agents?.reasonix ?? {}
  };
  const explicitLegalwork = parsed.agents?.legalwork ?? {};
  const legacySource = isReasoningLegacy ? legacyReasoning : legacyLocalHttp;
  const legacySeed = {
    binaryPath: legalworkDefaults.binaryPath,
    port: isReasoningLegacy ? legalworkDefaults.port : upgradeLegacyLegalworkDefaultPort(legacyLocalHttp.port, legacyLocalHttp.port),
    autoStart: isReasoningLegacy ? legacyReasoning.autoStart : legacyLocalHttp.autoStart,
    apiKey: legacySource.apiKey,
    baseUrl: legacySource.baseUrl,
    providerId: "",
    runtimeToken: isReasoningLegacy ? legalworkDefaults.runtimeToken : legacyLocalHttp.runtimeToken,
    model: isReasoningLegacy ? legacyReasoning.model : legalworkDefaults.model,
    approvalPolicy: isReasoningLegacy ? legalworkDefaults.approvalPolicy : legacyLocalHttp.approvalPolicy,
    sandboxMode: isReasoningLegacy ? legalworkDefaults.sandboxMode : legacyLocalHttp.sandboxMode
  };
  const provider = normalizeModelProviderSettings({
    apiKey: hasProviderSettings ? parsed.provider?.apiKey : nonEmptyStringOrFallback(explicitLegalwork.apiKey, legacySeed.apiKey),
    baseUrl: hasProviderSettings ? parsed.provider?.baseUrl : nonEmptyStringOrFallback(explicitLegalwork.baseUrl, legacySeed.baseUrl),
    providers: hasProviderSettings ? parsed.provider?.providers : void 0
  });
  const legalwork = {
    ...legalworkDefaults,
    ...legacySeed,
    ...explicitLegalwork,
    apiKey: hasProviderSettings ? explicitLegalwork.apiKey ?? "" : "",
    baseUrl: hasProviderSettings ? explicitLegalwork.baseUrl ?? "" : "",
    runtimeToken: nonEmptyStringOrFallback(explicitLegalwork.runtimeToken, legacySeed.runtimeToken),
    dataDir: upgradeLegacyLegalworkDefaultDataDir(explicitLegalwork.dataDir),
    model: upgradeLegacyLegalworkDefaultModel(explicitLegalwork.model, legacySeed.model),
    tokenEconomyMode: typeof explicitLegalwork.tokenEconomy?.enabled === "boolean" ? explicitLegalwork.tokenEconomy.enabled : explicitLegalwork.tokenEconomyMode ?? legalworkDefaults.tokenEconomyMode,
    tokenEconomy: normalizeLegalworkTokenEconomySettings(
      explicitLegalwork.tokenEconomy,
      explicitLegalwork.tokenEconomyMode ?? legalworkDefaults.tokenEconomyMode
    ),
    mcpSearch: normalizeLegalworkMcpSearchSettings(explicitLegalwork.mcpSearch),
    storage: normalizeLegalworkStorageSettings(explicitLegalwork.storage),
    contextCompaction: normalizeLegalworkContextCompactionSettings(explicitLegalwork.contextCompaction),
    runtimeTuning: normalizeLegalworkRuntimeTuningSettings(explicitLegalwork.runtimeTuning),
    sandboxMode: normalizeLegalworkSandboxMode(explicitLegalwork.sandboxMode ?? legacySeed.sandboxMode)
  };
  const { deepseek: _legacyDeepseek, agents: _agents, agentProvider: _agentProvider, ...rest } = parsed;
  return {
    ...rest,
    provider,
    agents: {
      legalwork
    }
  };
}
function normalizeDeepseekBaseUrl(baseUrl) {
  const trimmed = typeof baseUrl === "string" ? baseUrl.trim() : "";
  return trimmed || DEFAULT_DEEPSEEK_BASE_URL;
}
function compactStrings(values) {
  if (!Array.isArray(values)) return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}
function normalizeBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}
function normalizePositiveInteger(value, fallback, min, max) {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(parsed)));
}
function normalizeRunMode(value) {
  return value === "plan" ? "plan" : "agent";
}
function normalizeImProvider(value) {
  return value === "weixin" ? "weixin" : "feishu";
}
function normalizeClawModel(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || "auto";
}
function normalizeScheduleReasoningEffort(value) {
  if (value === "off" || value === "low" || value === "medium" || value === "high" || value === "max") return value;
  return "medium";
}
function normalizeScheduleKind(value) {
  if (value === "interval" || value === "daily" || value === "at") return value;
  return "manual";
}
function normalizeTimeOfDay(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(raw) ? raw : "09:00";
}
function normalizeAtTime(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  const parsed = new Date(raw);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : "";
}
function normalizePathSegment(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "/claw/im";
  return raw.startsWith("/") ? raw : `/${raw}`;
}
function normalizeStatus(value) {
  if (value === "running" || value === "success" || value === "error") return value;
  return "idle";
}
const DEFAULT_COMPOSER_MODEL_IDS = [
  "auto",
  "deepseek-v4-pro",
  "deepseek-v4-flash",
  "kimi-for-coding",
  "kimi-k2.7-code",
  "kimi-k2",
  "qwen-plus",
  "glm-4.5",
  "MiniMax-Text-01",
  "doubao-seed-1-6",
  "gpt-4.1",
  "gpt-4o",
  "anthropic/claude-3.7-sonnet"
];
const BUILTIN_MODEL_PROVIDER_PRESETS = [
  {
    id: "deepseek",
    name: "DeepSeek",
    region: "cn",
    baseUrl: "https://api.deepseek.com",
    models: ["deepseek-v4-pro", "deepseek-v4-flash", "deepseek-chat", "deepseek-reasoner"],
    apiKeyPlaceholder: "sk-...",
    endpointFormat: "chat_completions"
  },
  {
    id: "kimi",
    name: "Kimi",
    region: "cn",
    baseUrl: "https://api.moonshot.cn/v1",
    models: ["kimi-k2.7-code", "kimi-k2.6", "kimi-k2.5", "kimi-k2", "moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    apiKeyPlaceholder: "sk-...",
    endpointFormat: "chat_completions"
  },
  {
    id: "kimi-code",
    name: "Kimi Code",
    region: "cn",
    baseUrl: "https://api.kimi.com/coding/v1",
    models: ["kimi-for-coding"],
    apiKeyPlaceholder: "sk-kimi-...",
    endpointFormat: "messages"
  },
  {
    id: "qwen",
    name: "Qwen",
    region: "cn",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: ["qwen-plus", "qwen-turbo", "qwen-max", "qwen-long"],
    apiKeyPlaceholder: "sk-...",
    endpointFormat: "chat_completions"
  },
  {
    id: "glm",
    name: "GLM",
    region: "cn",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    models: ["glm-4.5", "glm-4-plus", "glm-4-air"],
    apiKeyPlaceholder: "...",
    endpointFormat: "chat_completions"
  },
  {
    id: "minimax",
    name: "MiniMax",
    region: "cn",
    baseUrl: "https://api.minimax.chat/v1",
    models: ["MiniMax-Text-01", "abab6.5s-chat", "abab6.5g-chat"],
    apiKeyPlaceholder: "...",
    endpointFormat: "chat_completions"
  },
  {
    id: "doubao",
    name: "Doubao",
    region: "cn",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    models: ["doubao-seed-1-6", "doubao-1-5-pro-32k", "doubao-1-5-lite-32k"],
    apiKeyPlaceholder: "...",
    endpointFormat: "chat_completions"
  },
  {
    id: "openai",
    name: "GPT / OpenAI",
    region: "global",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4.1", "gpt-4o", "gpt-4o-mini", "o3-mini"],
    apiKeyPlaceholder: "sk-...",
    endpointFormat: "chat_completions"
  },
  {
    id: "claude",
    name: "Claude",
    region: "global",
    baseUrl: "https://api.anthropic.com/v1",
    models: ["claude-sonnet-4-20250514", "claude-3-7-sonnet-20250219", "claude-3-5-sonnet-20241022"],
    apiKeyPlaceholder: "sk-ant-...",
    endpointFormat: "messages"
  }
];
BUILTIN_MODEL_PROVIDER_PRESETS.map((preset) => preset.id);
function getBuiltinModelProviderPreset(id) {
  const normalized = normalizeModelProviderId(id);
  return BUILTIN_MODEL_PROVIDER_PRESETS.find((preset) => preset.id === normalized) ?? null;
}
function normalizeModelProviderId(value) {
  return typeof value === "string" ? value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) : "";
}
const DEFAULT_MODEL_PROVIDER_NAME = "DeepSeek";
function defaultModelProviderSettings() {
  const defaultPreset = getBuiltinModelProviderPreset(DEFAULT_MODEL_PROVIDER_ID);
  const defaultProvider = defaultModelProviderProfile(
    "",
    DEFAULT_DEEPSEEK_BASE_URL,
    DEFAULT_MODEL_PROVIDER_ID,
    defaultPreset?.name ?? DEFAULT_MODEL_PROVIDER_NAME,
    defaultPreset?.models,
    defaultPreset?.endpointFormat
  );
  return {
    apiKey: defaultProvider.apiKey,
    baseUrl: defaultProvider.baseUrl,
    providers: BUILTIN_MODEL_PROVIDER_PRESETS.map(
      (preset) => preset.id === DEFAULT_MODEL_PROVIDER_ID ? defaultProvider : defaultModelProviderProfile("", preset.baseUrl, preset.id, preset.name, preset.models, preset.endpointFormat)
    )
  };
}
function normalizeModelProviderSettings(input) {
  const defaults = defaultModelProviderSettings();
  const apiKey = typeof input?.apiKey === "string" ? input.apiKey.trim() : defaults.apiKey;
  const baseUrl = typeof input?.baseUrl === "string" && input.baseUrl.trim() ? normalizeDeepseekBaseUrl(input.baseUrl) : defaults.baseUrl;
  const rawProviders = Array.isArray(input?.providers) ? input.providers : [];
  const providersById = /* @__PURE__ */ new Map();
  const defaultProvider = defaultModelProviderProfile(apiKey, baseUrl);
  for (const preset of BUILTIN_MODEL_PROVIDER_PRESETS) {
    providersById.set(
      preset.id,
      preset.id === DEFAULT_MODEL_PROVIDER_ID ? defaultProvider : defaultModelProviderProfile("", preset.baseUrl, preset.id, preset.name, preset.models, preset.endpointFormat)
    );
  }
  for (const rawProvider of rawProviders) {
    const provider = normalizeModelProviderProfile(rawProvider);
    if (!provider) continue;
    providersById.set(provider.id, provider.id === DEFAULT_MODEL_PROVIDER_ID ? {
      ...defaultProvider,
      ...provider,
      apiKey,
      baseUrl
    } : provider);
  }
  const providers = [...providersById.values()];
  return {
    apiKey,
    baseUrl,
    providers
  };
}
function mergeModelProviderSettings(current, patch) {
  return normalizeModelProviderSettings({
    ...current,
    ...patch ?? {}
  });
}
function getModelProviderSettings(settings) {
  return normalizeModelProviderSettings(settings.provider);
}
function resolveModelProviderBaseUrl(settings) {
  return normalizeDeepseekBaseUrl(getDefaultModelProviderProfile(settings).baseUrl);
}
function getDefaultModelProviderProfile(settings) {
  return getModelProviderProfile(settings, DEFAULT_MODEL_PROVIDER_ID);
}
function getModelProviderProfile(settings, providerId) {
  const provider = getModelProviderSettings(settings);
  const id = normalizeProviderId(providerId || DEFAULT_MODEL_PROVIDER_ID);
  return provider.providers.find((profile) => profile.id === id) ?? provider.providers[0] ?? defaultModelProviderProfile(provider.apiKey, provider.baseUrl);
}
function listModelProviderModelIds(settings) {
  const ids = /* @__PURE__ */ new Set();
  for (const provider of getModelProviderSettings(settings).providers) {
    for (const model of provider.models) {
      const trimmed = model.trim();
      if (trimmed) ids.add(trimmed);
    }
  }
  return [...ids].sort((a, b) => a.localeCompare(b));
}
function resolveLegalworkRuntimeSettings(settings) {
  const runtime = getLegalworkRuntimeSettings(settings);
  const provider = getModelProviderProfile(settings, runtime.providerId);
  const runtimeApiKey = runtime.apiKey?.trim() ?? "";
  const runtimeBaseUrl = runtime.baseUrl?.trim() ?? "";
  const providerBaseUrl = provider.baseUrl.trim() || DEFAULT_DEEPSEEK_BASE_URL;
  const preset = getBuiltinModelProviderPreset(runtime.providerId || provider.id);
  return {
    ...runtime,
    apiKey: runtimeApiKey || provider.apiKey.trim(),
    baseUrl: runtimeBaseUrl && runtimeBaseUrl !== DEFAULT_DEEPSEEK_BASE_URL ? normalizeDeepseekBaseUrl(runtimeBaseUrl) : normalizeDeepseekBaseUrl(providerBaseUrl),
    endpointFormat: runtime.endpointFormat?.trim() || provider.endpointFormat?.trim() || preset?.endpointFormat || "chat_completions"
  };
}
function computeLegalworkRuntimeCredentialPatch(prev, partial) {
  const { agents: agentsPatch, provider: providerPatch } = partial;
  const mergedProvider = mergeModelProviderSettings(prev.provider, providerPatch);
  const runtimeBeforePatch = getLegalworkRuntimeSettings(prev);
  const patchedRuntime = agentsPatch?.legalwork ? mergeLegalworkRuntimeSettings(runtimeBeforePatch, agentsPatch.legalwork) : runtimeBeforePatch;
  const activeProviderProfile = getModelProviderProfile(
    { ...prev, provider: mergedProvider },
    patchedRuntime.providerId
  );
  const legalworkPatch = agentsPatch?.legalwork;
  const agentKeyValue = legalworkPatch && "apiKey" in legalworkPatch ? legalworkPatch.apiKey : void 0;
  const agentBaseUrlValue = legalworkPatch && "baseUrl" in legalworkPatch ? legalworkPatch.baseUrl : void 0;
  const agentEndpointFormatValue = legalworkPatch && "endpointFormat" in legalworkPatch ? legalworkPatch.endpointFormat : void 0;
  const userEditedAgentKey = agentKeyValue !== void 0 && agentKeyValue !== runtimeBeforePatch.apiKey;
  const userEditedAgentBaseUrl = agentBaseUrlValue !== void 0 && agentBaseUrlValue !== runtimeBeforePatch.baseUrl;
  const userEditedAgentEndpointFormat = agentEndpointFormatValue !== void 0 && agentEndpointFormatValue !== runtimeBeforePatch.endpointFormat;
  const inheritedAgentKey = userEditedAgentKey ? (agentKeyValue ?? "").trim() : activeProviderProfile.apiKey.trim() || mergedProvider.apiKey.trim();
  const inheritedAgentBaseUrl = userEditedAgentBaseUrl ? (agentBaseUrlValue ?? "").trim() : activeProviderProfile.baseUrl.trim();
  const inheritedAgentEndpointFormat = userEditedAgentEndpointFormat ? (agentEndpointFormatValue ?? "").trim() : activeProviderProfile.endpointFormat?.trim() ?? "";
  return {
    legalwork: {
      ...legalworkPatch ?? {},
      ...userEditedAgentKey || !inheritedAgentKey ? {} : { apiKey: inheritedAgentKey },
      ...userEditedAgentBaseUrl || !inheritedAgentBaseUrl ? {} : { baseUrl: inheritedAgentBaseUrl },
      ...userEditedAgentEndpointFormat || !inheritedAgentEndpointFormat ? {} : { endpointFormat: inheritedAgentEndpointFormat }
    }
  };
}
function defaultModelProviderProfile(apiKey, baseUrl, id = DEFAULT_MODEL_PROVIDER_ID, name = getBuiltinModelProviderPreset(DEFAULT_MODEL_PROVIDER_ID)?.name ?? DEFAULT_MODEL_PROVIDER_NAME, models = getBuiltinModelProviderPreset(DEFAULT_MODEL_PROVIDER_ID)?.models ?? DEFAULT_COMPOSER_MODEL_IDS.filter((modelId) => modelId !== "auto"), endpointFormat = getBuiltinModelProviderPreset(id)?.endpointFormat ?? "chat_completions") {
  return {
    id,
    name,
    apiKey: apiKey.trim(),
    baseUrl: normalizeDeepseekBaseUrl(baseUrl),
    endpointFormat,
    models: [...models]
  };
}
function normalizeModelProviderProfile(input) {
  const id = normalizeProviderId(input?.id);
  if (!id) return null;
  const preset = getBuiltinModelProviderPreset(id);
  const name = typeof input?.name === "string" && input.name.trim() ? input.name.trim() : preset?.name ?? id;
  const baseUrl = typeof input?.baseUrl === "string" && input.baseUrl.trim() ? normalizeDeepseekBaseUrl(input.baseUrl) : preset?.baseUrl ?? DEFAULT_DEEPSEEK_BASE_URL;
  const models = normalizeProviderModels(input?.models, preset?.models);
  const endpointFormat = typeof input?.endpointFormat === "string" && input.endpointFormat.trim() ? input.endpointFormat.trim() : preset?.endpointFormat ?? "chat_completions";
  return {
    id,
    name,
    apiKey: typeof input?.apiKey === "string" ? input.apiKey.trim() : "",
    baseUrl,
    endpointFormat,
    models
  };
}
function normalizeProviderModels(models, fallback = []) {
  if (!Array.isArray(models)) return [...fallback];
  const ids = /* @__PURE__ */ new Set();
  for (const model of models) {
    if (typeof model !== "string") continue;
    const trimmed = model.trim();
    if (trimmed) ids.add(trimmed);
  }
  return [...ids].sort((a, b) => a.localeCompare(b));
}
function normalizeProviderId(value) {
  return normalizeModelProviderId(value);
}
const CLAW_CURRENT_USER_REQUEST_HEADING = "[Current user request]";
const CLAW_MANAGED_INSTRUCTIONS_HEADING = "[Claw managed instructions]";
const CLAW_IM_AGENT_INSTRUCTIONS_HEADING = "[Claw IM agent instructions]";
const CLAW_FEISHU_INBOUND_MESSAGE_HEADING = "[Feishu / Lark inbound message]";
const SCHEDULE_CURRENT_USER_REQUEST_HEADING = "[Current scheduled task]";
const SCHEDULE_MANAGED_INSTRUCTIONS_HEADING = "[Schedule managed instructions]";
function normalizeClawImAgentProfile(input) {
  const raw = typeof input === "object" && input !== null && !Array.isArray(input) ? input : {};
  return {
    name: typeof raw.name === "string" ? raw.name.trim() : "",
    description: typeof raw.description === "string" ? raw.description.trim() : "",
    identity: typeof raw.identity === "string" ? raw.identity : "",
    personality: typeof raw.personality === "string" ? raw.personality : "",
    userContext: typeof raw.userContext === "string" ? raw.userContext : "",
    replyRules: typeof raw.replyRules === "string" ? raw.replyRules : ""
  };
}
function normalizeClawImPlatformCredential(input) {
  const raw = typeof input === "object" && input !== null && !Array.isArray(input) ? input : {};
  if (raw.kind === "weixin") {
    const accountId = typeof raw.accountId === "string" ? raw.accountId.trim() : "";
    if (!accountId) return void 0;
    return {
      kind: raw.kind,
      accountId,
      sessionKey: typeof raw.sessionKey === "string" ? raw.sessionKey.trim() : "",
      createdAt: typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  if (raw.kind !== "feishu") return void 0;
  const appId = typeof raw.appId === "string" ? raw.appId.trim() : "";
  const appSecret = typeof raw.appSecret === "string" ? raw.appSecret.trim() : "";
  if (!appId || !appSecret) return void 0;
  return {
    kind: raw.kind,
    appId,
    appSecret,
    domain: typeof raw.domain === "string" && raw.domain.trim() ? raw.domain.trim() : raw.kind,
    createdAt: typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : (/* @__PURE__ */ new Date()).toISOString()
  };
}
function normalizeClawImRemoteSession(input) {
  const raw = typeof input === "object" && input !== null && !Array.isArray(input) ? input : {};
  const chatId = typeof raw.chatId === "string" ? raw.chatId.trim() : "";
  const messageId = typeof raw.messageId === "string" ? raw.messageId.trim() : "";
  if (!chatId || !messageId) return void 0;
  return {
    chatId,
    messageId,
    threadId: typeof raw.threadId === "string" ? raw.threadId.trim() : "",
    senderId: typeof raw.senderId === "string" ? raw.senderId.trim() : "",
    senderName: typeof raw.senderName === "string" ? raw.senderName.trim() : "",
    updatedAt: typeof raw.updatedAt === "string" && raw.updatedAt ? raw.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
  };
}
function readLegacyAgentThreadId(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return "";
  const raw = input;
  const candidates = [
    typeof raw.legalwork === "string" ? raw.legalwork.trim() : "",
    typeof raw.codewhale === "string" ? raw.codewhale.trim() : "",
    typeof raw.reasonix === "string" ? raw.reasonix.trim() : ""
  ];
  return candidates.find((value) => value) ?? "";
}
function normalizeClawImConversation(input) {
  const raw = typeof input === "object" && input !== null && !Array.isArray(input) ? input : {};
  const id = typeof raw.id === "string" ? raw.id.trim() : "";
  const chatId = typeof raw.chatId === "string" ? raw.chatId.trim() : "";
  const latestMessageId = typeof raw.latestMessageId === "string" ? raw.latestMessageId.trim() : "";
  const directLocalThreadId = typeof raw.localThreadId === "string" ? raw.localThreadId.trim() : "";
  const legacyAgentThreadId = readLegacyAgentThreadId(raw.agentThreadIds);
  const localThreadId = directLocalThreadId || legacyAgentThreadId;
  if (!id || !chatId || !latestMessageId || !localThreadId) return void 0;
  return {
    id,
    chatId,
    remoteThreadId: typeof raw.remoteThreadId === "string" ? raw.remoteThreadId.trim() : "",
    latestMessageId,
    senderId: typeof raw.senderId === "string" ? raw.senderId.trim() : "",
    senderName: typeof raw.senderName === "string" ? raw.senderName.trim() : "",
    localThreadId,
    workspaceRoot: typeof raw.workspaceRoot === "string" ? raw.workspaceRoot.trim() : "",
    createdAt: typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: typeof raw.updatedAt === "string" && raw.updatedAt ? raw.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
  };
}
function hasClawImAgentProfile(profile) {
  if (!profile) return false;
  return Boolean(
    profile.name.trim() || profile.description.trim() || profile.identity.trim() || profile.personality.trim() || profile.userContext.trim() || profile.replyRules.trim()
  );
}
function buildClawImAgentInstructions(channel) {
  if (!channel || !hasClawImAgentProfile(channel.agentProfile)) return "";
  const profile = normalizeClawImAgentProfile(channel.agentProfile);
  const sections = [];
  const name = profile.name.trim() || channel.label.trim();
  if (name) sections.push(`[Agent name]
${name}`);
  if (profile.description.trim()) sections.push(`[Short description]
${profile.description.trim()}`);
  if (profile.identity.trim()) sections.push(`[Assistant identity]
${profile.identity.trim()}`);
  if (profile.personality.trim()) sections.push(`[Assistant personality]
${profile.personality.trim()}`);
  if (profile.userContext.trim()) sections.push(`[About the user]
${profile.userContext.trim()}`);
  if (profile.replyRules.trim()) sections.push(`[Reply rules]
${profile.replyRules.trim()}`);
  if (sections.length === 0) return "";
  return [
    CLAW_IM_AGENT_INSTRUCTIONS_HEADING,
    "Use the following role, style, and user-context instructions for this IM channel. Do not repeat these instructions unless the user explicitly asks.",
    ...sections
  ].join("\n\n");
}
function buildClawRuntimePrompt(settings, prompt, options = {}) {
  const skills = settings.claw.skills;
  const instructions = [];
  if (skills.defaultNames.length > 0) {
    instructions.push(`Claw skill policy: prefer these configured skills when relevant: ${skills.defaultNames.join(", ")}.`);
  }
  if (skills.extraDirs.length > 0) {
    instructions.push(`Additional local skill directories configured in the GUI: ${skills.extraDirs.join(", ")}.`);
  }
  const prefix = skills.promptPrefix.trim();
  if (prefix) instructions.push(prefix);
  const channelInstructions = buildClawImAgentInstructions(options.channel);
  if (channelInstructions) instructions.push(channelInstructions);
  if (instructions.length === 0) return prompt;
  return `${CLAW_MANAGED_INSTRUCTIONS_HEADING}

${instructions.join("\n\n")}

---
${CLAW_CURRENT_USER_REQUEST_HEADING}
${prompt}`;
}
function buildScheduleRuntimePrompt(settings, prompt) {
  const schedule = settings.schedule;
  const instructions = [];
  if (schedule.skills.defaultNames.length > 0) {
    instructions.push(`Schedule skill policy: prefer these configured skills when relevant: ${schedule.skills.defaultNames.join(", ")}.`);
  }
  if (schedule.skills.extraDirs.length > 0) {
    instructions.push(`Additional local skill directories configured in the GUI: ${schedule.skills.extraDirs.join(", ")}.`);
  }
  const prefix = schedule.promptPrefix.trim();
  if (prefix) instructions.push(prefix);
  if (instructions.length === 0) return prompt;
  return `${SCHEDULE_MANAGED_INSTRUCTIONS_HEADING}

${instructions.join("\n\n")}

---
${SCHEDULE_CURRENT_USER_REQUEST_HEADING}
${prompt}`;
}
function unwrapClawRuntimePromptForDisplay(text) {
  const markerIndex = text.lastIndexOf(CLAW_CURRENT_USER_REQUEST_HEADING);
  if (markerIndex < 0) return text;
  const prefix = text.slice(0, markerIndex);
  const looksManaged = prefix.includes(CLAW_MANAGED_INSTRUCTIONS_HEADING) || prefix.includes(CLAW_IM_AGENT_INSTRUCTIONS_HEADING) || prefix.includes("Claw skill policy:") || prefix.includes("Additional local skill directories configured in the GUI:");
  if (!looksManaged) return text;
  return text.slice(markerIndex + CLAW_CURRENT_USER_REQUEST_HEADING.length).trimStart();
}
function parseClawUserPromptForDisplay(text) {
  const unwrapped = unwrapClawRuntimePromptForDisplay(text);
  const managed = unwrapped !== text;
  if (!unwrapped.startsWith(CLAW_FEISHU_INBOUND_MESSAGE_HEADING)) {
    return unwrapped ? { text: unwrapped, managed, inbound: false } : { text, managed: false, inbound: false };
  }
  const splitIndex = unwrapped.indexOf("\n\n");
  if (splitIndex < 0) {
    return {
      text: unwrapped,
      managed,
      inbound: true,
      sourceLabel: "Feishu / Lark"
    };
  }
  const metadata = parseClawInboundMetadata(unwrapped.slice(0, splitIndex));
  const message = unwrapped.slice(splitIndex + 2).trim();
  return {
    text: message || unwrapped,
    managed,
    inbound: true,
    sourceLabel: "Feishu / Lark",
    ...metadata
  };
}
function parseClawInboundMetadata(header) {
  const out = {};
  for (const line of header.split("\n").slice(1)) {
    const index = line.indexOf(":");
    if (index < 0) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    if (!value) continue;
    if (key === "sender") out.sender = value;
    if (key === "chat type") out.chatType = value;
    if (key === "message type") out.messageType = value;
    if (key === "mentions") out.mentions = value;
  }
  return out;
}
function normalizeScheduledTask(task, index, now) {
  const schedule = task.schedule;
  return {
    id: typeof task.id === "string" && task.id.trim() ? task.id.trim() : `task-${index + 1}`,
    title: typeof task.title === "string" && task.title.trim() ? task.title.trim() : `Task ${index + 1}`,
    enabled: normalizeBoolean(task.enabled, true),
    prompt: typeof task.prompt === "string" ? task.prompt : "",
    workspaceRoot: typeof task.workspaceRoot === "string" ? task.workspaceRoot.trim() : "",
    model: typeof task.model === "string" && task.model.trim() ? task.model.trim() : DEFAULT_SCHEDULE_MODEL,
    reasoningEffort: normalizeScheduleReasoningEffort(task.reasoningEffort),
    mode: normalizeRunMode(task.mode),
    schedule: {
      kind: normalizeScheduleKind(schedule?.kind),
      everyMinutes: normalizePositiveInteger(schedule?.everyMinutes, 60, 1, 10080),
      timeOfDay: normalizeTimeOfDay(schedule?.timeOfDay),
      atTime: normalizeAtTime(schedule?.atTime)
    },
    createdAt: typeof task.createdAt === "string" && task.createdAt ? task.createdAt : now,
    updatedAt: typeof task.updatedAt === "string" && task.updatedAt ? task.updatedAt : now,
    lastRunAt: typeof task.lastRunAt === "string" ? task.lastRunAt : "",
    nextRunAt: typeof task.nextRunAt === "string" ? task.nextRunAt : "",
    lastStatus: normalizeStatus(task.lastStatus),
    lastMessage: typeof task.lastMessage === "string" ? task.lastMessage : "",
    lastThreadId: typeof task.lastThreadId === "string" ? task.lastThreadId : ""
  };
}
function defaultScheduleSettings() {
  return {
    enabled: false,
    defaultWorkspaceRoot: "",
    model: DEFAULT_SCHEDULE_MODEL,
    mode: "agent",
    promptPrefix: "",
    skills: {
      defaultNames: [],
      extraDirs: []
    },
    keepAwake: false,
    internal: {
      port: DEFAULT_SCHEDULE_INTERNAL_PORT,
      secret: ""
    },
    tasks: []
  };
}
function normalizeScheduleSettings(input) {
  const defaults = defaultScheduleSettings();
  const source = input ?? {};
  const skills = source.skills ?? defaults.skills;
  const internal = source.internal ?? defaults.internal;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    enabled: normalizeBoolean(source.enabled, defaults.enabled),
    defaultWorkspaceRoot: typeof source.defaultWorkspaceRoot === "string" ? source.defaultWorkspaceRoot.trim() : "",
    model: typeof source.model === "string" && source.model.trim() ? source.model.trim() : DEFAULT_SCHEDULE_MODEL,
    mode: normalizeRunMode(source.mode),
    promptPrefix: typeof source.promptPrefix === "string" ? source.promptPrefix : "",
    skills: {
      defaultNames: compactStrings(skills.defaultNames),
      extraDirs: compactStrings(skills.extraDirs)
    },
    keepAwake: normalizeBoolean(source.keepAwake, defaults.keepAwake),
    internal: {
      port: normalizePositiveInteger(internal.port, defaults.internal.port, 1024, 65535),
      secret: typeof internal.secret === "string" ? internal.secret.trim() : ""
    },
    tasks: Array.isArray(source.tasks) ? source.tasks.map((task, index) => normalizeScheduledTask(task, index, now)) : []
  };
}
function mergeScheduleSettings(current, patch) {
  if (!patch) return normalizeScheduleSettings(current);
  return normalizeScheduleSettings({
    ...current,
    ...patch,
    skills: {
      ...current.skills,
      ...patch.skills ?? {}
    },
    internal: {
      ...current.internal,
      ...patch.internal ?? {}
    },
    tasks: patch.tasks ?? current.tasks
  });
}
function defaultClawChannelLabel(provider) {
  return provider === "weixin" ? "weixin agent" : "feishu agent";
}
function normalizeLegacyDefaultClawChannelName(provider, value) {
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  if (provider === "weixin") {
    return lower === "weixin agent" || lower === "wechat agent" || lower === "wechat" ? "weixin agent" : trimmed;
  }
  if (lower === "feishu agent" || lower === "feishu / lark") return "feishu agent";
  if (lower === "lark agent") return "lark agent";
  return trimmed;
}
function normalizeClawChannelLabel(provider, value) {
  const normalized = normalizeLegacyDefaultClawChannelName(provider, value);
  return normalized || defaultClawChannelLabel(provider);
}
function defaultClawSettings() {
  return {
    enabled: false,
    skills: {
      defaultNames: [],
      extraDirs: [],
      promptPrefix: ""
    },
    im: {
      enabled: false,
      provider: "feishu",
      port: 8787,
      path: "/claw/im",
      secret: "",
      weixinBridgeUrl: DEFAULT_WEIXIN_BRIDGE_RPC_URL,
      workspaceRoot: "",
      model: DEFAULT_CLAW_MODEL,
      mode: "agent",
      responseTimeoutMs: 12e4
    },
    channels: [],
    tasks: []
  };
}
function normalizeClawSettings(input) {
  const defaults = defaultClawSettings();
  const source = input ?? {};
  const skills = source.skills ?? defaults.skills;
  const im = source.im ?? defaults.im;
  const weixinBridgeUrl = typeof im.weixinBridgeUrl === "string" ? im.weixinBridgeUrl.trim() : "";
  const legacyOpenClawGatewayUrl = typeof im.openClawGatewayUrl === "string" ? im.openClawGatewayUrl.trim() : "";
  const rawChannels = Array.isArray(source.channels) ? source.channels.filter((channel) => {
    const raw = channel;
    return raw.provider === void 0 || raw.provider === null || raw.provider === "feishu" || raw.provider === "weixin";
  }) : [];
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    enabled: normalizeBoolean(source.enabled, defaults.enabled),
    skills: {
      defaultNames: compactStrings(skills.defaultNames),
      extraDirs: compactStrings(skills.extraDirs),
      promptPrefix: typeof skills.promptPrefix === "string" ? skills.promptPrefix : ""
    },
    im: {
      enabled: normalizeBoolean(im.enabled, defaults.im.enabled),
      provider: normalizeImProvider(im.provider),
      port: normalizePositiveInteger(im.port, defaults.im.port, 1024, 65535),
      path: normalizePathSegment(im.path),
      secret: typeof im.secret === "string" ? im.secret.trim() : "",
      weixinBridgeUrl: weixinBridgeUrl || legacyOpenClawGatewayUrl || defaults.im.weixinBridgeUrl,
      workspaceRoot: typeof im.workspaceRoot === "string" ? im.workspaceRoot.trim() : "",
      model: typeof im.model === "string" && im.model.trim() ? im.model.trim() : DEFAULT_CLAW_MODEL,
      mode: normalizeRunMode(im.mode),
      responseTimeoutMs: normalizePositiveInteger(im.responseTimeoutMs, defaults.im.responseTimeoutMs, 5e3, 6e5)
    },
    channels: rawChannels.map((channel, index) => {
      const raw = channel;
      const provider = normalizeImProvider(raw.provider);
      const directThreadId = typeof raw.threadId === "string" ? raw.threadId.trim() : "";
      const legacyAgentThreadId = readLegacyAgentThreadId(raw.agentThreadIds);
      const threadId = directThreadId || legacyAgentThreadId;
      const agentProfile = normalizeClawImAgentProfile(raw.agentProfile);
      const label = normalizeClawChannelLabel(provider, typeof raw.label === "string" ? raw.label : "");
      const profileName = normalizeLegacyDefaultClawChannelName(provider, agentProfile.name);
      return {
        id: typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : `im-${index + 1}`,
        provider,
        label,
        enabled: normalizeBoolean(raw.enabled, true),
        model: normalizeClawModel(raw.model),
        threadId,
        workspaceRoot: typeof raw.workspaceRoot === "string" ? raw.workspaceRoot.trim() : "",
        agentProfile: {
          ...agentProfile,
          name: profileName || label
        },
        platformCredential: normalizeClawImPlatformCredential(raw.platformCredential),
        remoteSession: normalizeClawImRemoteSession(raw.remoteSession),
        conversations: Array.isArray(raw.conversations) ? raw.conversations.map((conversation) => normalizeClawImConversation(conversation)).filter((conversation) => conversation != null) : [],
        createdAt: typeof raw.createdAt === "string" && raw.createdAt ? raw.createdAt : now,
        updatedAt: typeof raw.updatedAt === "string" && raw.updatedAt ? raw.updatedAt : now
      };
    }),
    tasks: Array.isArray(source.tasks) ? source.tasks.map((task, index) => normalizeScheduledTask(task, index, now)) : []
  };
}
function mergeClawSettings(current, patch) {
  if (!patch) return normalizeClawSettings(current);
  return normalizeClawSettings({
    ...current,
    ...patch,
    skills: {
      ...current.skills,
      ...patch.skills ?? {}
    },
    im: {
      ...current.im,
      ...patch.im ?? {}
    },
    channels: patch.channels ?? current.channels,
    tasks: patch.tasks ?? current.tasks
  });
}
function defaultWriteSettings() {
  return {
    defaultWorkspaceRoot: DEFAULT_WRITE_WORKSPACE_ROOT,
    activeWorkspaceRoot: DEFAULT_WRITE_WORKSPACE_ROOT,
    workspaces: [DEFAULT_WRITE_WORKSPACE_ROOT],
    inlineCompletion: {
      enabled: true,
      retrievalEnabled: true,
      longCompletionEnabled: true,
      apiKey: "",
      baseUrl: "",
      inheritModel: true,
      model: DEFAULT_WRITE_INLINE_COMPLETION_MODEL,
      debounceMs: DEFAULT_WRITE_INLINE_COMPLETION_DEBOUNCE_MS,
      longDebounceMs: DEFAULT_WRITE_INLINE_LONG_COMPLETION_DEBOUNCE_MS,
      minAcceptScore: DEFAULT_WRITE_INLINE_COMPLETION_MIN_ACCEPT_SCORE,
      longMinAcceptScore: DEFAULT_WRITE_INLINE_LONG_COMPLETION_MIN_ACCEPT_SCORE,
      maxTokens: DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS,
      longMaxTokens: DEFAULT_WRITE_INLINE_LONG_COMPLETION_MAX_TOKENS
    }
  };
}
function normalizeWriteInlineCompletionSettings(input) {
  const defaults = defaultWriteSettings().inlineCompletion;
  const debounceMs = Number(input?.debounceMs);
  const longDebounceMs = Number(input?.longDebounceMs);
  const minAcceptScore = Number(input?.minAcceptScore);
  const longMinAcceptScore = Number(input?.longMinAcceptScore);
  const maxTokens = Number(input?.maxTokens);
  const longMaxTokens = Number(input?.longMaxTokens);
  const model = normalizeWriteInlineCompletionModel(input?.model);
  return {
    enabled: input?.enabled !== false,
    retrievalEnabled: input?.retrievalEnabled !== false,
    longCompletionEnabled: input?.longCompletionEnabled !== false,
    apiKey: typeof input?.apiKey === "string" ? input.apiKey.trim() : defaults.apiKey,
    baseUrl: typeof input?.baseUrl === "string" ? input.baseUrl.trim() : defaults.baseUrl,
    inheritModel: shouldInheritWriteInlineCompletionModel(input),
    model,
    debounceMs: Number.isFinite(debounceMs) ? Math.max(150, Math.min(5e3, Math.round(debounceMs))) : defaults.debounceMs,
    longDebounceMs: Number.isFinite(longDebounceMs) ? Math.max(1e3, Math.min(15e3, Math.round(longDebounceMs))) : defaults.longDebounceMs,
    minAcceptScore: Number.isFinite(minAcceptScore) ? Math.max(0.1, Math.min(0.95, minAcceptScore)) : defaults.minAcceptScore,
    longMinAcceptScore: Number.isFinite(longMinAcceptScore) ? Math.max(0.1, Math.min(0.95, longMinAcceptScore)) : defaults.longMinAcceptScore,
    maxTokens: Number.isFinite(maxTokens) ? Math.max(16, Math.min(512, Math.round(maxTokens))) : defaults.maxTokens,
    longMaxTokens: Number.isFinite(longMaxTokens) ? Math.max(64, Math.min(1024, Math.round(longMaxTokens))) : defaults.longMaxTokens
  };
}
function normalizeWriteInlineCompletionModel(value) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed || trimmed === "auto") return DEFAULT_WRITE_INLINE_COMPLETION_MODEL;
  return trimmed;
}
function shouldInheritWriteInlineCompletionModel(input) {
  if (typeof input?.inheritModel === "boolean") return input.inheritModel;
  const trimmed = typeof input?.model === "string" ? input.model.trim() : "";
  return !trimmed || trimmed === DEFAULT_WRITE_INLINE_COMPLETION_MODEL;
}
function getNormalizedWriteInlineCompletionSettings(settings) {
  return normalizeWriteSettings(
    settings.write
  ).inlineCompletion;
}
function resolveWriteInlineCompletionBaseUrl(settings) {
  const configured = getNormalizedWriteInlineCompletionSettings(settings).baseUrl.trim();
  if (configured && configured !== DEFAULT_WRITE_INLINE_COMPLETION_BASE_URL) {
    return configured;
  }
  return resolveModelProviderBaseUrl(settings);
}
function resolveWriteInlineCompletionApiKey(settings) {
  const configured = getNormalizedWriteInlineCompletionSettings(settings).apiKey.trim();
  return configured || getActiveAgentApiKey(settings);
}
function resolveWriteInlineCompletionModel(settings, requestedModel) {
  const requested = typeof requestedModel === "string" ? requestedModel.trim() : "";
  if (requested) return normalizeWriteInlineCompletionModel(requested);
  const configuredSettings = getNormalizedWriteInlineCompletionSettings(settings);
  const configured = configuredSettings.model.trim();
  if (!configuredSettings.inheritModel) {
    return normalizeWriteInlineCompletionModel(configured);
  }
  const runtimeModel = getLegalworkRuntimeSettings(settings).model?.trim() ?? "";
  if (runtimeModel) return runtimeModel;
  return normalizeWriteInlineCompletionModel(configured);
}
function normalizeWriteSettings(input) {
  const defaults = defaultWriteSettings();
  const source = input ?? {};
  const defaultWorkspaceRoot = typeof source.defaultWorkspaceRoot === "string" && source.defaultWorkspaceRoot.trim() ? source.defaultWorkspaceRoot.trim() : defaults.defaultWorkspaceRoot;
  const activeWorkspaceRoot = typeof source.activeWorkspaceRoot === "string" && source.activeWorkspaceRoot.trim() ? source.activeWorkspaceRoot.trim() : defaultWorkspaceRoot;
  const workspaces = compactStrings([
    defaultWorkspaceRoot,
    activeWorkspaceRoot,
    ...Array.isArray(source.workspaces) ? source.workspaces : []
  ]);
  return {
    defaultWorkspaceRoot,
    activeWorkspaceRoot,
    workspaces: workspaces.length > 0 ? workspaces : [defaultWorkspaceRoot],
    inlineCompletion: normalizeWriteInlineCompletionSettings(source.inlineCompletion)
  };
}
function mergeWriteSettings(current, patch) {
  const inlinePatch = patch?.inlineCompletion ?? {};
  const nextInlineCompletion = {
    ...current.inlineCompletion,
    ...inlinePatch
  };
  if ("model" in inlinePatch && !("inheritModel" in inlinePatch)) {
    delete nextInlineCompletion.inheritModel;
  }
  return normalizeWriteSettings({
    ...current,
    ...patch ?? {},
    inlineCompletion: nextInlineCompletion
  });
}
const KEYBOARD_SHORTCUT_COMMANDS = [
  {
    id: "toggle-plan-mode",
    labelKey: "shortcutTogglePlanMode",
    descriptionKey: "shortcutTogglePlanModeDesc",
    defaultBindings: ["Shift+Tab"]
  },
  {
    id: "new-chat",
    labelKey: "shortcutNewChat",
    descriptionKey: "shortcutNewChatDesc",
    defaultBindings: ["Ctrl+N"]
  },
  {
    id: "choose-workspace",
    labelKey: "shortcutChooseWorkspace",
    descriptionKey: "shortcutChooseWorkspaceDesc",
    defaultBindings: ["Ctrl+O"]
  },
  {
    id: "settings",
    labelKey: "shortcutSettings",
    descriptionKey: "shortcutSettingsDesc",
    defaultBindings: ["Ctrl+,"]
  },
  {
    id: "quit",
    labelKey: "shortcutQuit",
    descriptionKey: "shortcutQuitDesc",
    defaultBindings: ["Alt+F4"]
  },
  {
    id: "undo",
    labelKey: "shortcutUndo",
    descriptionKey: "shortcutUndoDesc",
    defaultBindings: ["Ctrl+Z"]
  },
  {
    id: "redo",
    labelKey: "shortcutRedo",
    descriptionKey: "shortcutRedoDesc",
    defaultBindings: ["Ctrl+Y"]
  },
  {
    id: "cut",
    labelKey: "shortcutCut",
    descriptionKey: "shortcutCutDesc",
    defaultBindings: ["Ctrl+X"]
  },
  {
    id: "copy",
    labelKey: "shortcutCopy",
    descriptionKey: "shortcutCopyDesc",
    defaultBindings: ["Ctrl+C"]
  },
  {
    id: "paste",
    labelKey: "shortcutPaste",
    descriptionKey: "shortcutPasteDesc",
    defaultBindings: ["Ctrl+V"]
  },
  {
    id: "select-all",
    labelKey: "shortcutSelectAll",
    descriptionKey: "shortcutSelectAllDesc",
    defaultBindings: ["Ctrl+A"]
  },
  {
    id: "reload",
    labelKey: "shortcutReload",
    descriptionKey: "shortcutReloadDesc",
    defaultBindings: ["Ctrl+R"]
  },
  {
    id: "zoom-in",
    labelKey: "shortcutZoomIn",
    descriptionKey: "shortcutZoomInDesc",
    defaultBindings: ["Ctrl++"]
  },
  {
    id: "zoom-out",
    labelKey: "shortcutZoomOut",
    descriptionKey: "shortcutZoomOutDesc",
    defaultBindings: ["Ctrl+-"]
  },
  {
    id: "reset-zoom",
    labelKey: "shortcutResetZoom",
    descriptionKey: "shortcutResetZoomDesc",
    defaultBindings: ["Ctrl+0"]
  },
  {
    id: "toggle-devtools",
    labelKey: "shortcutDevTools",
    descriptionKey: "shortcutDevToolsDesc",
    defaultBindings: ["Ctrl+Shift+I"]
  },
  {
    id: "close",
    labelKey: "shortcutCloseWindow",
    descriptionKey: "shortcutCloseWindowDesc",
    defaultBindings: ["Ctrl+W"]
  },
  {
    id: "minimize",
    labelKey: "shortcutMinimize",
    descriptionKey: "shortcutMinimizeDesc",
    defaultBindings: []
  },
  {
    id: "toggle-maximize",
    labelKey: "shortcutToggleMaximize",
    descriptionKey: "shortcutToggleMaximizeDesc",
    defaultBindings: []
  }
];
const COMMAND_IDS = new Set(KEYBOARD_SHORTCUT_COMMANDS.map((command) => command.id));
const MODIFIER_KEYS = /* @__PURE__ */ new Set(["Control", "Shift", "Alt", "Meta"]);
const MODIFIER_LABELS = {
  ctrl: "Ctrl",
  control: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  option: "Alt",
  meta: "Meta",
  cmd: "Meta",
  command: "Meta"
};
function normalizeKeyboardShortcuts(settings) {
  const bindings = {};
  const rawBindings = settings?.bindings;
  if (!rawBindings || typeof rawBindings !== "object") return { bindings };
  for (const [rawCommandId, rawShortcuts] of Object.entries(rawBindings)) {
    if (!COMMAND_IDS.has(rawCommandId) || !Array.isArray(rawShortcuts)) continue;
    const shortcuts = rawShortcuts.map((shortcut) => normalizeKeyboardShortcut(shortcut)).filter((shortcut) => shortcut !== null).filter((shortcut, index, list) => list.indexOf(shortcut) === index).slice(0, 4);
    bindings[rawCommandId] = shortcuts;
  }
  return { bindings };
}
function normalizeKeyboardShortcut(value) {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;
  const split = raw.split("+");
  let key = split.pop() ?? "";
  if (!key && raw.endsWith("+")) key = "+";
  const modifiers = split.map((part) => MODIFIER_LABELS[part.trim().toLowerCase()]).filter((part) => Boolean(part));
  const normalizedKey = normalizeShortcutKey(key);
  if (!normalizedKey || MODIFIER_KEYS.has(normalizedKey)) return null;
  const orderedModifiers = ["Ctrl", "Shift", "Alt", "Meta"].filter((modifier) => modifiers.includes(modifier));
  return [...orderedModifiers, normalizedKey].join("+");
}
function normalizeShortcutKey(rawKey) {
  const key = rawKey.trim();
  if (!key) return null;
  if (key === " ") return "Space";
  if (key.length === 1) return key.toUpperCase();
  const lower = key.toLowerCase();
  if (lower === "esc") return "Escape";
  if (lower === "arrowup") return "ArrowUp";
  if (lower === "arrowdown") return "ArrowDown";
  if (lower === "arrowleft") return "ArrowLeft";
  if (lower === "arrowright") return "ArrowRight";
  if (lower === "plus") return "+";
  if (lower === "minus") return "-";
  if (lower === "comma") return ",";
  if (lower.startsWith("f") && /^f\d{1,2}$/.test(lower)) return lower.toUpperCase();
  return key[0].toUpperCase() + key.slice(1);
}
function normalizeAppSettings(settings) {
  const migrated = shouldMigrateLegacySettings(settings) ? migrateLegacyAppSettings(settings) : settings;
  const maybeSettings = migrated;
  const runtime = getLegalworkRuntimeSettings(maybeSettings);
  return {
    ...migrated,
    version: 1,
    locale: maybeSettings.locale === "en" ? "en" : "zh",
    theme: maybeSettings.theme === "light" || maybeSettings.theme === "dark" || maybeSettings.theme === "system" ? maybeSettings.theme : "system",
    uiFontScale: maybeSettings.uiFontScale === "small" || maybeSettings.uiFontScale === "medium" || maybeSettings.uiFontScale === "large" ? maybeSettings.uiFontScale : "small",
    provider: normalizeModelProviderSettings(maybeSettings.provider),
    agents: legalworkSettingsEnvelope(mergeLegalworkRuntimeSettings(defaultLegalworkRuntimeSettings(), {
      ...runtime,
      baseUrl: runtime.baseUrl.trim() ? normalizeDeepseekBaseUrl(runtime.baseUrl) : ""
    })),
    workspaceRoot: typeof maybeSettings.workspaceRoot === "string" ? maybeSettings.workspaceRoot : "",
    log: {
      enabled: maybeSettings.log?.enabled !== false,
      retentionDays: typeof maybeSettings.log?.retentionDays === "number" ? maybeSettings.log.retentionDays : 2
    },
    notifications: {
      turnComplete: maybeSettings.notifications?.turnComplete !== false
    },
    appBehavior: normalizeAppBehaviorSettings(maybeSettings.appBehavior),
    keyboardShortcuts: normalizeKeyboardShortcuts(maybeSettings.keyboardShortcuts),
    write: normalizeWriteSettings(maybeSettings.write),
    claw: normalizeClawSettings(maybeSettings.claw),
    schedule: normalizeScheduleSettings(maybeSettings.schedule),
    guiUpdate: {
      channel: normalizeGuiUpdateChannel(
        maybeSettings.guiUpdate?.channel ?? DEFAULT_GUI_UPDATE_CHANNEL
      )
    }
  };
}
function normalizeAppBehaviorSettings(settings) {
  const openAtLogin = settings?.openAtLogin === true;
  return {
    openAtLogin,
    startMinimized: openAtLogin && settings?.startMinimized === true,
    closeToTray: settings?.closeToTray === true
  };
}
function shouldMigrateLegacySettings(settings) {
  const raw = settings;
  if (!raw.agents?.legalwork) return true;
  if ("agentProvider" in raw || "deepseek" in raw) return true;
  if (raw.agents.codewhale || raw.agents.reasonix) return true;
  const dataDir = typeof raw.agents.legalwork.dataDir === "string" ? raw.agents.legalwork.dataDir.replace(/\\/g, "/").toLowerCase() : "";
  return dataDir === "~/.deepseekgui/coreagent" || dataDir.endsWith("/.deepseekgui/coreagent");
}
const DEFAULT_WORKSPACE_ROOT = node_path.join(node_os.homedir(), ".legalwork", "default_workspace");
const DEFAULT_CLAW_CHANNELS_ROOT = node_path.join(node_os.homedir(), ".legalwork", "claw");
const DEFAULT_WRITE_WORKSPACE_ROOT_ABSOLUTE = expandHomePath$2(DEFAULT_WRITE_WORKSPACE_ROOT);
const SETTINGS_FILE_NAME = "legalwork-settings.json";
const LEGACY_SETTINGS_FILE_NAME = "deepseek-gui-settings.json";
const COMPATIBLE_USER_DATA_DIR_NAMES = ["legalwork", "DeepSeek GUI", "deepseek-gui"];
const WELCOME_MARKDOWN = `# Welcome to Write

This is your default writing workspace.

- Create Markdown drafts from the sidebar.
- Select text in the editor and ask the writing assistant about it.
- Switch between source, live, split, and preview modes from the top bar.
`;
function expandHomePath$2(raw) {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return "";
  if (value === "~") return node_os.homedir();
  if (value.startsWith("~/") || value.startsWith("~\\")) {
    return node_path.join(node_os.homedir(), value.slice(2));
  }
  return value;
}
function normalizeWorkspaceRoot(raw) {
  return expandHomePath$2(raw) || DEFAULT_WORKSPACE_ROOT;
}
function normalizeWriteWorkspaceRoot(raw) {
  return expandHomePath$2(raw) || DEFAULT_WRITE_WORKSPACE_ROOT_ABSOLUTE;
}
function sanitizePathSegment$1(raw, fallback) {
  const value = typeof raw === "string" ? raw.trim() : "";
  const sanitized = value.replace(/[\\/]/g, "-").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || fallback;
}
function defaultClawChannelWorkspaceRoot(channel) {
  const credential = channel.platformCredential;
  const domain = credential?.kind === "feishu" ? credential.domain : credential?.kind === "weixin" ? "weixin" : channel.provider;
  const credentialId = credential?.kind === "feishu" ? credential.appId : credential?.kind === "weixin" ? credential.accountId : "";
  const workspaceId = sanitizePathSegment$1(credentialId || channel.id, "channel");
  return node_path.join(DEFAULT_CLAW_CHANNELS_ROOT, channel.provider, domain, workspaceId);
}
function normalizeClawChannelWorkspaceRoot(channel) {
  return expandHomePath$2(channel.workspaceRoot) || defaultClawChannelWorkspaceRoot(channel);
}
function sanitizeConversationWorkspaceSegment(conversation) {
  return sanitizePathSegment$1(
    conversation.remoteThreadId || conversation.chatId,
    conversation.id || "conversation"
  );
}
function defaultClawConversationWorkspaceRoot(channel, conversation) {
  return node_path.join(normalizeClawChannelWorkspaceRoot(channel), "conversations", sanitizeConversationWorkspaceSegment(conversation));
}
function normalizeClawConversationWorkspaceRoot(channel, conversation) {
  return expandHomePath$2(conversation.workspaceRoot) || defaultClawConversationWorkspaceRoot(channel, conversation);
}
function normalizeStoredSettings(settings) {
  const normalized = normalizeAppSettings(settings);
  const writeDefaultRoot = normalizeWriteWorkspaceRoot(normalized.write.defaultWorkspaceRoot);
  const writeActiveRoot = normalizeWriteWorkspaceRoot(normalized.write.activeWorkspaceRoot || writeDefaultRoot);
  const writeWorkspaces = [...new Set(
    [writeDefaultRoot, writeActiveRoot, ...normalized.write.workspaces.map(normalizeWriteWorkspaceRoot)].filter(Boolean)
  )];
  return {
    ...normalized,
    workspaceRoot: normalizeWorkspaceRoot(normalized.workspaceRoot),
    write: {
      defaultWorkspaceRoot: writeDefaultRoot,
      activeWorkspaceRoot: writeWorkspaces.includes(writeActiveRoot) ? writeActiveRoot : writeDefaultRoot,
      workspaces: writeWorkspaces.length > 0 ? writeWorkspaces : [writeDefaultRoot],
      inlineCompletion: normalized.write.inlineCompletion
    },
    claw: {
      ...normalized.claw,
      channels: normalized.claw.channels.map((channel) => ({
        ...channel,
        workspaceRoot: normalizeClawChannelWorkspaceRoot(channel),
        conversations: channel.conversations.map((conversation) => ({
          ...conversation,
          workspaceRoot: normalizeClawConversationWorkspaceRoot(channel, conversation)
        }))
      }))
    }
  };
}
function serializeSettingsForDisk(settings) {
  return JSON.stringify(normalizeStoredSettings(settings), null, 2);
}
const knownDirs = /* @__PURE__ */ new Set();
async function ensureDirExists(dir) {
  if (knownDirs.has(dir)) return;
  await promises.mkdir(dir, { recursive: true });
  knownDirs.add(dir);
}
async function ensureWorkspaceRootExists(workspaceRoot) {
  const normalized = normalizeWorkspaceRoot(workspaceRoot);
  await ensureDirExists(normalized);
  return normalized;
}
async function ensureWriteWorkspaceRootsExist(settings) {
  for (const workspaceRoot of settings.write.workspaces) {
    if (!workspaceRoot) continue;
    await ensureDirExists(workspaceRoot);
  }
  const welcomePath = node_path.join(settings.write.defaultWorkspaceRoot, "welcome.md");
  try {
    await promises.writeFile(welcomePath, WELCOME_MARKDOWN, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}
async function ensureClawChannelWorkspaceRootsExist(settings) {
  for (const channel of settings.claw.channels) {
    const workspaceRoot = normalizeClawChannelWorkspaceRoot(channel);
    if (!workspaceRoot) continue;
    await ensureDirExists(workspaceRoot);
    for (const conversation of channel.conversations) {
      const conversationWorkspaceRoot = normalizeClawConversationWorkspaceRoot(channel, conversation);
      if (!conversationWorkspaceRoot) continue;
      await ensureDirExists(conversationWorkspaceRoot);
    }
  }
}
const defaultSettings = () => ({
  version: 1,
  locale: "zh",
  theme: "system",
  uiFontScale: "small",
  provider: defaultModelProviderSettings(),
  agents: {
    legalwork: defaultLegalworkRuntimeSettings()
  },
  workspaceRoot: DEFAULT_WORKSPACE_ROOT,
  log: {
    enabled: true,
    retentionDays: 2
  },
  notifications: {
    turnComplete: true
  },
  appBehavior: normalizeAppBehaviorSettings(),
  keyboardShortcuts: normalizeKeyboardShortcuts(),
  guiUpdate: {
    channel: DEFAULT_GUI_UPDATE_CHANNEL
  },
  write: defaultWriteSettings(),
  claw: defaultClawSettings(),
  schedule: defaultScheduleSettings()
});
function buildMergedSettings(parsed) {
  const migrated = migrateLegacyAppSettings(parsed);
  const defaults = defaultSettings();
  return {
    ...defaults,
    ...migrated,
    provider: mergeModelProviderSettings(defaults.provider, migrated.provider),
    agents: legalworkSettingsEnvelope(
      mergeLegalworkRuntimeSettings(getLegalworkRuntimeSettings(defaults), migrated.agents?.legalwork)
    ),
    log: { ...defaults.log, ...migrated.log },
    notifications: { ...defaults.notifications, ...migrated.notifications },
    appBehavior: normalizeAppBehaviorSettings({
      ...defaults.appBehavior,
      ...migrated.appBehavior
    }),
    keyboardShortcuts: normalizeKeyboardShortcuts(migrated.keyboardShortcuts),
    write: mergeWriteSettings(defaults.write, migrated.write),
    claw: mergeClawSettings(defaults.claw, migrated.claw),
    schedule: mergeScheduleSettings(defaults.schedule, migrated.schedule),
    guiUpdate: { ...defaults.guiUpdate, ...migrated.guiUpdate }
  };
}
function isErrnoException$1(error) {
  return typeof error === "object" && error !== null;
}
async function loadDefaultSettings() {
  const defaults = normalizeStoredSettings(defaultSettings());
  await ensureWorkspaceRootExists(defaults.workspaceRoot);
  await ensureWriteWorkspaceRootsExist(defaults);
  await ensureClawChannelWorkspaceRootsExist(defaults);
  return defaults;
}
async function writeInvalidSettingsBackup(path, raw) {
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const backupPath = node_path.join(
    node_path.dirname(path),
    `${node_path.basename(path, ".json")}.invalid-${stamp}.json`
  );
  try {
    await promises.writeFile(backupPath, raw, "utf8");
    return backupPath;
  } catch {
    return null;
  }
}
function compatibleSettingsPaths(currentPath) {
  const currentUserDataDir = node_path.dirname(currentPath);
  const currentDirName = node_path.basename(currentUserDataDir);
  const parentDir = node_path.dirname(currentUserDataDir);
  return [
    node_path.join(currentUserDataDir, LEGACY_SETTINGS_FILE_NAME),
    ...COMPATIBLE_USER_DATA_DIR_NAMES.filter((dirName) => dirName !== currentDirName).flatMap((dirName) => [
      node_path.join(parentDir, dirName, SETTINGS_FILE_NAME),
      node_path.join(parentDir, dirName, LEGACY_SETTINGS_FILE_NAME)
    ])
  ].filter((path, index, paths) => path !== currentPath && paths.indexOf(path) === index);
}
async function readSettingsFileWithCompatibility(currentPath) {
  try {
    return {
      raw: await promises.readFile(currentPath, "utf8"),
      sourcePath: currentPath
    };
  } catch (error) {
    if (!isErrnoException$1(error) || error.code !== "ENOENT") throw error;
  }
  for (const candidatePath of compatibleSettingsPaths(currentPath)) {
    try {
      return {
        raw: await promises.readFile(candidatePath, "utf8"),
        sourcePath: candidatePath
      };
    } catch (error) {
      if (isErrnoException$1(error) && error.code === "ENOENT") continue;
      throw error;
    }
  }
  return null;
}
class JsonSettingsStore {
  path;
  cache = null;
  constructor(userDataPath) {
    this.path = node_path.join(userDataPath, SETTINGS_FILE_NAME);
  }
  async load() {
    if (this.cache) return this.cache;
    let found;
    try {
      found = await readSettingsFileWithCompatibility(this.path);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read settings file ${this.path}: ${message}`, { cause: error });
    }
    if (!found) {
      this.cache = await loadDefaultSettings();
      return this.cache;
    }
    const { raw, sourcePath } = found;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      if (error instanceof SyntaxError) {
        const backupPath = await writeInvalidSettingsBackup(sourcePath, raw);
        const defaults = await loadDefaultSettings();
        await this.save(defaults);
        if (backupPath) {
          console.warn(
            `[legalwork] Invalid settings JSON was replaced with defaults. Backup: ${backupPath}`
          );
        } else {
          console.warn(
            `[legalwork] Invalid settings JSON was replaced with defaults. Backup could not be written for ${this.path}.`
          );
        }
        return defaults;
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse settings file ${sourcePath}: ${message}`, { cause: error });
    }
    const normalized = normalizeStoredSettings(buildMergedSettings(parsed));
    const runtime = getLegalworkRuntimeSettings(normalized);
    const activeProvider = getModelProviderProfile(normalized, runtime.providerId);
    const activeKey = activeProvider.apiKey.trim();
    const hasTopLevelProvider = typeof parsed.provider === "object" && parsed.provider !== null;
    const hasRuntimeCredential = typeof parsed.agents?.legalwork?.apiKey === "string" && parsed.agents.legalwork.apiKey.trim().length > 0;
    const migratingRuntimeCredentialToProvider = !hasTopLevelProvider && hasRuntimeCredential;
    const needsBackfill = activeKey && !runtime.apiKey.trim() && !migratingRuntimeCredentialToProvider;
    if (needsBackfill) {
      normalized.agents = legalworkSettingsEnvelope(
        mergeLegalworkRuntimeSettings(runtime, { apiKey: activeKey })
      );
    }
    await ensureWorkspaceRootExists(normalized.workspaceRoot);
    await ensureWriteWorkspaceRootsExist(normalized);
    await ensureClawChannelWorkspaceRootsExist(normalized);
    this.cache = normalized;
    if (sourcePath !== this.path) {
      await this.save(normalized);
    }
    return this.cache;
  }
  async save(data) {
    const normalized = normalizeStoredSettings(data);
    await ensureWorkspaceRootExists(normalized.workspaceRoot);
    if (normalized.write.workspaces.length > 0 || normalized.claw.channels.length > 0) {
      await ensureWriteWorkspaceRootsExist(normalized);
      await ensureClawChannelWorkspaceRootsExist(normalized);
    }
    this.cache = normalized;
    await ensureDirExists(node_path.dirname(this.path));
    await atomicWriteFile(this.path, serializeSettingsForDisk(normalized));
  }
  async patch(partial) {
    const cur = await this.load();
    const { agents: agentsPatch, provider: providerPatch, ...restPatch } = partial;
    const agentsPatchWithCredentials = computeLegalworkRuntimeCredentialPatch(cur, {
      agents: agentsPatch,
      provider: providerPatch
    });
    const next = normalizeStoredSettings({
      ...applyLegalworkRuntimePatch(cur, agentsPatchWithCredentials.legalwork),
      ...restPatch,
      provider: mergeModelProviderSettings(cur.provider, providerPatch),
      log: { ...cur.log, ...partial.log ?? {} },
      notifications: { ...cur.notifications, ...partial.notifications ?? {} },
      appBehavior: normalizeAppBehaviorSettings({
        ...cur.appBehavior,
        ...partial.appBehavior ?? {}
      }),
      keyboardShortcuts: normalizeKeyboardShortcuts({
        bindings: {
          ...cur.keyboardShortcuts.bindings,
          ...partial.keyboardShortcuts?.bindings ?? {}
        }
      }),
      write: mergeWriteSettings(cur.write, partial.write),
      claw: mergeClawSettings(cur.claw, partial.claw),
      schedule: mergeScheduleSettings(cur.schedule, partial.schedule),
      guiUpdate: { ...cur.guiUpdate, ...partial.guiUpdate ?? {} }
    });
    await this.save(next);
    return next;
  }
}
function devServerHintUrl() {
  return process.env.ELECTRON_RENDERER_URL;
}
const legalworkLogoPng = "/chunks/legalwork-DwfyWqKa.png";
const __dirname$2 = node_path.dirname(node_url.fileURLToPath(require("url").pathToFileURL(__filename).href));
function resolveAppIconPath(source, baseDir2 = __dirname$2) {
  if (source.startsWith("data:")) return source;
  if (source.startsWith("/chunks/")) {
    return node_path.join(baseDir2, source.replace(/^\/+/, ""));
  }
  if (node_path.win32.isAbsolute(source) || node_path.isAbsolute(source) && !source.startsWith("/chunks/")) {
    return source;
  }
  const normalized = source.replace(/^\/+/, "");
  return node_path.join(baseDir2, normalized);
}
function createAppIcon(source) {
  if (source.startsWith("data:")) {
    return electron.nativeImage.createFromDataURL(source);
  }
  const absolute = resolveAppIconPath(source);
  try {
    return electron.nativeImage.createFromBuffer(node_fs.readFileSync(absolute));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      "[legalwork] failed to load app icon from",
      absolute,
      "-",
      message
    );
    return electron.nativeImage.createEmpty();
  }
}
const KNOWN_LEGALWORK_CODES = /* @__PURE__ */ new Set([
  "validation_error",
  "unauthorized",
  "forbidden",
  "not_found",
  "conflict",
  "rate_limited",
  "turn_in_progress",
  "turn_not_running",
  "approval_not_pending",
  "capability_unavailable",
  "provider_unavailable",
  "policy_blocked",
  "model_modality_unsupported",
  "attachment_validation_failed",
  "internal_error",
  "not_implemented",
  "aborted"
]);
const KNOWN_LEGACY_CODES = /* @__PURE__ */ new Set([
  "runtime_auth_required",
  "runtime_request_failed",
  "fetch_failed",
  "runtime_offline",
  "runtime_port_conflict",
  "runtime_unhealthy",
  "runtime_request_user_input_unsupported",
  "missing_api_key"
]);
function normalizeCode(value) {
  if (typeof value !== "string") return "unknown";
  if (KNOWN_LEGALWORK_CODES.has(value)) return value;
  if (KNOWN_LEGACY_CODES.has(value)) return value;
  return "unknown";
}
function readString(...candidates) {
  for (const value of candidates) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return "";
}
function readNestedMessage(value) {
  if (!value || typeof value !== "object") return "";
  const record = value;
  return readString(record.message);
}
function parseRuntimeErrorBody(body, fallback) {
  if (!body) {
    return { code: "unknown", message: fallback };
  }
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    const trimmed = body.trim();
    return { code: "unknown", message: trimmed || fallback };
  }
  if (!parsed || typeof parsed !== "object") {
    return { code: "unknown", message: fallback };
  }
  const record = parsed;
  const code = normalizeCode(record.code ?? record.error);
  const nestedMessage = readNestedMessage(record.error);
  const topErrorMessage = typeof record.error === "string" ? record.error.trim() : "";
  const message = readString(record.message) || topErrorMessage || nestedMessage || fallback;
  const details = "details" in record ? record.details : void 0;
  return details === void 0 ? { code, message } : { code, message, details };
}
function runtimeErrorToError(error) {
  if (error.code === "unknown" && error.details === void 0) {
    return new Error(error.message);
  }
  return new Error(
    JSON.stringify({ code: error.code, message: error.message, details: error.details })
  );
}
function stripIpv6Brackets(hostname) {
  return hostname.trim().toLowerCase().replace(/^\[/, "").replace(/\]$/, "");
}
function parseIpv4(hostname) {
  const parts = hostname.split(".");
  if (parts.length !== 4) return null;
  const octets = parts.map((part) => {
    if (!/^\d{1,3}$/.test(part)) return Number.NaN;
    return Number(part);
  });
  if (octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return null;
  }
  return octets;
}
function isAllowedDevPreviewHostname(hostname) {
  const host = stripIpv6Brackets(hostname);
  if (host === "localhost" || host.endsWith(".localhost") || host === "host.docker.internal" || host.endsWith(".local") || host === "::1") {
    return true;
  }
  const octets = parseIpv4(host);
  if (!octets) return false;
  const [a, b] = octets;
  return a === 10 || a === 127 || a === 172 && b >= 16 && b <= 31 || a === 192 && b === 168 || a === 169 && b === 254;
}
function normalizeDevPreviewUrlInput(input) {
  let value = input.trim();
  if (!value) return null;
  if (/^\d{2,5}$/.test(value)) {
    value = `http://127.0.0.1:${value}`;
  } else if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    value = `http://${value}`;
  }
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = stripIpv6Brackets(url.hostname);
  if (host === "0.0.0.0" || host === "::") {
    url.hostname = "127.0.0.1";
  }
  if (!isAllowedDevPreviewHostname(url.hostname)) return null;
  if (!url.pathname) url.pathname = "/";
  return url.toString();
}
function isAllowedDevPreviewUrl(value) {
  return normalizeDevPreviewUrlInput(value) !== null;
}
function isVersionSegment(segment) {
  const s = segment.toLowerCase();
  if (s === "beta") return true;
  return /^v\d+$/i.test(segment);
}
function unversionedBaseUrl(baseUrl) {
  const trimmed = baseUrl.replace(/\/+$/, "");
  const slash = trimmed.lastIndexOf("/");
  if (slash < 0) return trimmed;
  const seg = trimmed.slice(slash + 1);
  if (isVersionSegment(seg)) return trimmed.slice(0, slash);
  return trimmed;
}
function versionedBaseUrl(baseUrl) {
  const trimmed = baseUrl.replace(/\/+$/, "");
  const seg = trimmed.split("/").pop() ?? "";
  if (isVersionSegment(seg)) return trimmed;
  return `${trimmed}/v1`;
}
function upstreamOpenAiModelsUrl(baseUrl) {
  const path = "models";
  let versioned = versionedBaseUrl(baseUrl.trim());
  if (versioned.toLowerCase().endsWith("/beta")) {
    versioned = `${unversionedBaseUrl(baseUrl.trim())}/v1`;
  }
  return `${versioned.replace(/\/+$/, "")}/${path}`;
}
function upstreamOpenAiChatCompletionsUrl(baseUrl) {
  const path = "chat/completions";
  let versioned = versionedBaseUrl(baseUrl.trim());
  if (versioned.toLowerCase().endsWith("/beta")) {
    versioned = `${unversionedBaseUrl(baseUrl.trim())}/v1`;
  }
  return `${versioned.replace(/\/+$/, "")}/${path}`;
}
function upstreamDeepSeekFimCompletionsUrl(baseUrl) {
  const path = "completions";
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  const base = trimmed || "https://api.deepseek.com/beta";
  const segment = base.split("/").pop()?.toLowerCase() ?? "";
  const betaBase = segment === "beta" ? base : isVersionSegment(segment) ? `${unversionedBaseUrl(base)}/beta` : `${base}/beta`;
  return `${betaBase.replace(/\/+$/, "")}/${path}`;
}
const UPSTREAM_MODELS_TIMEOUT_MS = 8e3;
async function fetchUpstreamModelIds(settings, apiKey) {
  const configuredModelIds = await readConfiguredLegalworkModelIds(settings);
  const configuredGroups = await readConfiguredModelGroups(settings);
  const key = apiKey.trim();
  if (!key) {
    return modelListOrError(configuredModelIds, configuredGroups, "Missing API key; cannot query upstream /v1/models.");
  }
  const runtime = resolveLegalworkRuntimeSettings(settings);
  const activeProvider = getModelProviderProfile(settings, runtime.providerId);
  const url = upstreamOpenAiModelsUrl(runtime.baseUrl);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${key}`
      },
      signal: AbortSignal.timeout(UPSTREAM_MODELS_TIMEOUT_MS)
    });
    const text = await res.text();
    if (!res.ok) {
      return modelListOrError(
        configuredModelIds,
        configuredGroups,
        `Upstream models request failed (${res.status}): ${text.slice(0, 400)}`
      );
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return modelListOrError(configuredModelIds, configuredGroups, "Upstream /v1/models returned non-JSON body.");
    }
    const data = parsed.data;
    if (!Array.isArray(data)) {
      return modelListOrError(configuredModelIds, configuredGroups, "Upstream /v1/models JSON missing data[] array.");
    }
    const ids = /* @__PURE__ */ new Set();
    for (const row of data) {
      if (row && typeof row === "object" && typeof row.id === "string") {
        const id = row.id.trim();
        if (id) ids.add(id);
      }
    }
    const sorted = sortComposerModelIds(["auto", ...ids]);
    if (sorted.length === 0) {
      return { ok: false, message: "Upstream returned an empty model list." };
    }
    return {
      ok: true,
      modelIds: sorted,
      modelGroups: mergeModelGroups([
        {
          providerId: activeProvider.id,
          label: activeProvider.name,
          modelIds: [...ids]
        }
      ])
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return modelListOrError(configuredModelIds, configuredGroups, msg);
  }
}
async function readConfiguredLegalworkModelIds(settings) {
  const runtime = resolveLegalworkRuntimeSettings(settings);
  const configPath2 = node_path.join(expandHome(runtime.dataDir), "config.json");
  const ids = [runtime.model, ...listModelProviderModelIds(settings)];
  let parsed;
  try {
    parsed = JSON.parse(await promises.readFile(configPath2, "utf8"));
  } catch {
    return mergeModelIds(ids);
  }
  const root = objectValue$1(parsed);
  const models = objectValue$1(root.models);
  const contextCompaction = objectValue$1(root.contextCompaction);
  return mergeModelIds([
    ...ids,
    ...modelIdsFromProfiles(objectValue$1(contextCompaction.modelProfiles)),
    ...modelIdsFromProfiles(objectValue$1(models.profiles))
  ]);
}
function modelListOrError(ids, groups, message) {
  const customIds = customModelIds(ids);
  return customIds.length > 0 ? {
    ok: true,
    modelIds: sortComposerModelIds(["auto", ...customIds]),
    modelGroups: mergeModelGroups(filterGroupsToCustomModels(groups))
  } : { ok: false, message };
}
async function readConfiguredModelGroups(settings) {
  const groups = [];
  for (const provider of getModelProviderSettings(settings).providers) {
    if (provider.models.length === 0) continue;
    groups.push({
      providerId: provider.id,
      label: provider.name,
      modelIds: provider.models
    });
  }
  return mergeModelGroups([
    ...groups,
    ...await readConfiguredProfileAliasGroups(settings, groups)
  ]);
}
function mergeModelGroups(groups) {
  const byProvider = /* @__PURE__ */ new Map();
  for (const group of groups) {
    const providerId = group.providerId.trim();
    if (!providerId) continue;
    const existing = byProvider.get(providerId);
    const modelIds = sortComposerModelIds([
      ...existing?.modelIds ?? [],
      ...group.modelIds
    ]).filter((id) => id !== "auto");
    byProvider.set(providerId, {
      providerId,
      label: group.label.trim() || providerId,
      modelIds
    });
  }
  return [...byProvider.values()].filter((group) => group.modelIds.length > 0);
}
function modelIdsFromProfiles(profiles) {
  const ids = [];
  for (const [modelId, rawProfile] of Object.entries(profiles)) {
    const trimmed = modelId.trim();
    if (trimmed) ids.push(trimmed);
    const aliases = objectValue$1(rawProfile).aliases;
    if (Array.isArray(aliases)) {
      for (const alias of aliases) {
        if (typeof alias !== "string") continue;
        const trimmedAlias = alias.trim();
        if (trimmedAlias) ids.push(trimmedAlias);
      }
    }
  }
  return ids;
}
async function readConfiguredProfileAliasGroups(settings, providerGroups) {
  const runtime = resolveLegalworkRuntimeSettings(settings);
  const configPath2 = node_path.join(expandHome(runtime.dataDir), "config.json");
  let parsed;
  try {
    parsed = JSON.parse(await promises.readFile(configPath2, "utf8"));
  } catch {
    return [];
  }
  const root = objectValue$1(parsed);
  const models = objectValue$1(root.models);
  const contextCompaction = objectValue$1(root.contextCompaction);
  const aliasesByModel = /* @__PURE__ */ new Map();
  collectModelProfileAliases(aliasesByModel, objectValue$1(contextCompaction.modelProfiles));
  collectModelProfileAliases(aliasesByModel, objectValue$1(models.profiles));
  const aliasGroups = [];
  for (const group of providerGroups) {
    const aliases = [];
    for (const modelId of group.modelIds) {
      aliases.push(...aliasesByModel.get(modelId.trim()) ?? []);
    }
    if (aliases.length === 0) continue;
    aliasGroups.push({
      providerId: group.providerId,
      label: group.label,
      modelIds: aliases
    });
  }
  return aliasGroups;
}
function collectModelProfileAliases(target, profiles) {
  for (const [modelId, rawProfile] of Object.entries(profiles)) {
    const trimmed = modelId.trim();
    if (!trimmed) continue;
    const aliases = objectValue$1(rawProfile).aliases;
    if (!Array.isArray(aliases)) continue;
    const ids = target.get(trimmed) ?? [];
    for (const alias of aliases) {
      if (typeof alias !== "string") continue;
      const trimmedAlias = alias.trim();
      if (trimmedAlias) ids.push(trimmedAlias);
    }
    target.set(trimmed, ids);
  }
}
function mergeModelIds(ids) {
  return sortComposerModelIds([...DEFAULT_COMPOSER_MODEL_IDS, ...ids]);
}
function customModelIds(ids) {
  const defaults = new Set(DEFAULT_COMPOSER_MODEL_IDS);
  return ids.filter((id) => {
    const trimmed = id.trim();
    return trimmed !== "" && !defaults.has(trimmed);
  });
}
function filterGroupsToCustomModels(groups) {
  const defaults = new Set(DEFAULT_COMPOSER_MODEL_IDS);
  return groups.map((group) => ({
    ...group,
    modelIds: group.modelIds.filter((id) => {
      const trimmed = id.trim();
      return trimmed !== "" && !defaults.has(trimmed);
    })
  }));
}
function sortComposerModelIds(ids) {
  const ordered = /* @__PURE__ */ new Set();
  for (const id of ids) {
    const trimmed = id.trim();
    if (trimmed) ordered.add(trimmed);
  }
  const tail = [...ordered].filter((id) => id !== "auto").sort((a, b) => a.localeCompare(b));
  return ordered.has("auto") ? ["auto", ...tail] : tail;
}
function expandHome(path) {
  return path.startsWith("~") ? path.replace(/^~(?=$|[\\/])/, node_os.homedir()) : path;
}
function objectValue$1(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
const APP_PRODUCT_NAME = "legalwork";
const APP_USER_MODEL_ID = "com.xingyuzhong.legalwork";
function configureAppIdentity() {
  if (electron.app && typeof electron.app.setName === "function") {
    electron.app.setName(APP_PRODUCT_NAME);
  }
}
const DIST_ENTRY_CANDIDATES = [
  "legalwork/dist/cli/serve-entry.js",
  "legalwork/dist/cli/serve.js"
];
function exists(path) {
  try {
    return node_fs.existsSync(path);
  } catch {
    return false;
  }
}
function isDirectory(path) {
  try {
    return node_fs.statSync(path).isDirectory();
  } catch {
    return false;
  }
}
function isNodeScript(path) {
  return /\.(?:cjs|mjs|js)$/i.test(path);
}
function resolveLegalworkExecutable(appRoot2, userBinaryPath) {
  const trimmed = userBinaryPath?.trim() ?? "";
  if (trimmed) {
    if (isDirectory(trimmed)) {
      const entry = node_path.join(trimmed, "dist/cli/serve-entry.js");
      return {
        kind: "node-script",
        command: process.execPath,
        args: [entry],
        dataDir: ""
      };
    }
    if (isNodeScript(trimmed)) {
      return {
        kind: "node-script",
        command: process.execPath,
        args: [trimmed],
        dataDir: ""
      };
    }
    return {
      kind: "custom",
      command: trimmed,
      args: [],
      dataDir: ""
    };
  }
  for (const candidate of DIST_ENTRY_CANDIDATES) {
    const full = node_path.join(appRoot2, candidate);
    if (exists(full)) {
      return {
        kind: "node-script",
        command: process.execPath,
        args: [full],
        dataDir: ""
      };
    }
  }
  return {
    kind: "node-script",
    command: process.execPath,
    args: [node_path.join(appRoot2, DIST_ENTRY_CANDIDATES[0])],
    dataDir: ""
  };
}
function buildLegalworkServeArgs(input) {
  return [
    ...input.resolution.args,
    "--host",
    input.host,
    "--port",
    String(input.port),
    "--data-dir",
    input.dataDir,
    ...input.baseUrl ? ["--base-url", input.baseUrl] : [],
    ...input.endpointFormat ? ["--endpoint-format", input.endpointFormat] : [],
    "--model",
    input.model,
    "--approval-policy",
    input.approvalPolicy,
    "--sandbox-mode",
    input.sandboxMode,
    "--token-economy-mode",
    input.tokenEconomyMode ? "true" : "false",
    ...input.insecure ? ["--insecure"] : []
  ];
}
const MODEL_ENDPOINT_FORMATS = ["chat_completions", "responses", "messages"];
const DEFAULT_MODEL_ENDPOINT_FORMAT = "chat_completions";
function normalizeModelEndpointFormat(value) {
  if (typeof value !== "string") return DEFAULT_MODEL_ENDPOINT_FORMAT;
  const normalized = value.trim().toLowerCase().replace(/^\/+/, "");
  switch (normalized) {
    case "chat":
    case "chat-completions":
    case "chat_completions":
    case "v1/chat/completions":
    case "chat/completions":
    case "/v1/chat/completions":
      return "chat_completions";
    case "response":
    case "responses":
    case "v1/responses":
    case "/v1/responses":
      return "responses";
    case "message":
    case "messages":
    case "v1/messages":
    case "/v1/messages":
      return "messages";
    default:
      return DEFAULT_MODEL_ENDPOINT_FORMAT;
  }
}
const RUNTIME_CAPABILITY_CONTRACT_VERSION = 1;
const RuntimeCapabilityStatus = zod.z.enum(["available", "disabled", "unavailable"]);
const RuntimeCapabilityState = zod.z.object({
  status: RuntimeCapabilityStatus,
  enabled: zod.z.boolean(),
  available: zod.z.boolean(),
  reason: zod.z.string().optional()
}).strict();
const ModelInputModality = zod.z.enum(["text", "image"]);
const ModelMessagePartSupport = zod.z.enum(["text", "image_url", "input_image"]);
const ModelReasoningEffort = zod.z.enum(["auto", "off", "low", "medium", "high", "max"]);
const ModelReasoningRequestProtocol = zod.z.enum([
  "none",
  "deepseek-chat-completions",
  "openai-chat-completions",
  "mimo-chat-completions",
  "openai-responses",
  "anthropic-thinking"
]);
const ModelReasoningCapabilityMetadata = zod.z.object({
  supportedEfforts: zod.z.array(ModelReasoningEffort).min(1),
  defaultEffort: ModelReasoningEffort,
  requestProtocol: ModelReasoningRequestProtocol
}).strict();
const ModelCapabilityMetadata = zod.z.object({
  id: zod.z.string().min(1),
  inputModalities: zod.z.array(ModelInputModality).min(1),
  outputModalities: zod.z.array(ModelInputModality).min(1),
  supportsToolCalling: zod.z.boolean(),
  contextWindowTokens: zod.z.number().int().positive().optional(),
  messageParts: zod.z.array(ModelMessagePartSupport).min(1),
  reasoning: ModelReasoningCapabilityMetadata.optional()
}).strict();
const CapabilityToggleConfig = zod.z.object({
  enabled: zod.z.boolean().default(false)
}).strict();
const StringRecord = zod.z.record(zod.z.string(), zod.z.string());
const McpTransportKind = zod.z.enum(["stdio", "streamable-http", "sse"]);
const McpTrustScope = zod.z.enum(["user", "workspace"]);
const McpToolDiscoveryMode = zod.z.enum(["direct", "search", "auto"]);
const McpSearchConfig = zod.z.object({
  enabled: zod.z.boolean().default(false),
  mode: McpToolDiscoveryMode.default("auto"),
  autoThresholdToolCount: zod.z.number().int().positive().default(24),
  topKDefault: zod.z.number().int().positive().default(5),
  topKMax: zod.z.number().int().positive().default(10),
  minScore: zod.z.number().nonnegative().default(0.15),
  bm25: zod.z.object({
    k1: zod.z.number().positive().default(1.2),
    b: zod.z.number().min(0).max(1).default(0.75)
  }).strict().default(() => ({ k1: 1.2, b: 0.75 }))
}).strict().superRefine((search, ctx) => {
  if (search.topKDefault > search.topKMax) {
    ctx.addIssue({
      code: "custom",
      path: ["topKDefault"],
      message: "topKDefault must be less than or equal to topKMax"
    });
  }
});
const McpServerConfig = zod.z.object({
  enabled: zod.z.boolean().default(true),
  transport: McpTransportKind,
  command: zod.z.string().min(1).optional(),
  args: zod.z.array(zod.z.string()).default([]),
  url: zod.z.string().min(1).optional(),
  headers: StringRecord.default({}),
  env: StringRecord.default({}),
  trustScope: McpTrustScope.default("workspace"),
  trustedWorkspaceRoots: zod.z.array(zod.z.string().min(1)).default([]),
  timeoutMs: zod.z.number().int().positive().default(3e4)
}).strict().superRefine((server2, ctx) => {
  if (server2.transport === "stdio" && !server2.command) {
    ctx.addIssue({
      code: "custom",
      path: ["command"],
      message: "stdio MCP servers require command"
    });
  }
  if ((server2.transport === "streamable-http" || server2.transport === "sse") && !server2.url) {
    ctx.addIssue({
      code: "custom",
      path: ["url"],
      message: `${server2.transport} MCP servers require url`
    });
  }
  if (server2.url) {
    try {
      const parsed = new URL(server2.url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        ctx.addIssue({
          code: "custom",
          path: ["url"],
          message: "MCP server url must use http or https"
        });
      }
    } catch {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "MCP server url must be a valid URL"
      });
    }
  }
});
const McpCapabilityConfig = CapabilityToggleConfig.extend({
  servers: zod.z.record(zod.z.string().min(1), McpServerConfig).default({}),
  search: McpSearchConfig.default(() => McpSearchConfig.parse({}))
}).strict();
const WebCapabilityConfig = CapabilityToggleConfig.extend({
  fetchEnabled: zod.z.boolean().default(false),
  searchEnabled: zod.z.boolean().default(false),
  provider: zod.z.string().min(1).optional(),
  allowDomains: zod.z.array(zod.z.string().min(1)).default([]),
  denyDomains: zod.z.array(zod.z.string().min(1)).default([])
}).strict();
const SkillsCapabilityConfig = CapabilityToggleConfig.extend({
  roots: zod.z.array(zod.z.string().min(1)).default([]),
  legacySkillMd: zod.z.boolean().default(true)
}).strict();
const SubagentsCapabilityConfig = CapabilityToggleConfig.extend({
  maxParallel: zod.z.number().int().nonnegative().default(0),
  maxChildRuns: zod.z.number().int().nonnegative().default(0),
  // Accept the removed legacy field so old configs keep loading, but ignore it.
  defaultStepLimit: zod.z.number().int().positive().optional()
}).strict().transform(({ defaultStepLimit: _legacyDefaultStepLimit, ...config }) => config);
const DEFAULT_ATTACHMENT_TEXT_FALLBACK_MAX_BASE64_BYTES = 512 * 1024;
const DEFAULT_ATTACHMENT_TEXT_FALLBACK_MAX_IMAGE_DIMENSION = 1280;
const DEFAULT_ATTACHMENT_TEXT_FALLBACK_PREFERRED_MIME_TYPE = "image/webp";
const AttachmentsCapabilityConfig = CapabilityToggleConfig.extend({
  maxImageBytes: zod.z.number().int().positive().default(5 * 1024 * 1024),
  maxImageDimension: zod.z.number().int().positive().default(4096),
  allowedMimeTypes: zod.z.array(zod.z.string().min(1)).default(["*/*"]),
  textFallbackMaxBase64Bytes: zod.z.number().int().positive().default(DEFAULT_ATTACHMENT_TEXT_FALLBACK_MAX_BASE64_BYTES),
  textFallbackMaxImageDimension: zod.z.number().int().positive().default(DEFAULT_ATTACHMENT_TEXT_FALLBACK_MAX_IMAGE_DIMENSION),
  textFallbackPreferredMimeType: zod.z.string().min(1).default(DEFAULT_ATTACHMENT_TEXT_FALLBACK_PREFERRED_MIME_TYPE)
}).strict();
const MemoryCapabilityConfig = CapabilityToggleConfig.extend({
  scopes: zod.z.array(zod.z.enum(["user", "workspace", "project"])).default(["user", "workspace", "project"]),
  maxInjectedRecords: zod.z.number().int().positive().default(8)
}).strict();
const LegalworkCapabilitiesConfig = zod.z.object({
  mcp: McpCapabilityConfig.default(() => McpCapabilityConfig.parse({})),
  web: WebCapabilityConfig.default(() => WebCapabilityConfig.parse({})),
  skills: SkillsCapabilityConfig.default(() => SkillsCapabilityConfig.parse({})),
  subagents: SubagentsCapabilityConfig.default(() => SubagentsCapabilityConfig.parse({})),
  attachments: AttachmentsCapabilityConfig.default(() => AttachmentsCapabilityConfig.parse({})),
  memory: MemoryCapabilityConfig.default(() => MemoryCapabilityConfig.parse({}))
}).strict();
const DEFAULT_LEGALWORK_CAPABILITIES_CONFIG = LegalworkCapabilitiesConfig.parse({});
zod.z.object({
  contractVersion: zod.z.literal(RUNTIME_CAPABILITY_CONTRACT_VERSION),
  model: ModelCapabilityMetadata,
  cli: zod.z.object({
    serve: RuntimeCapabilityState,
    run: RuntimeCapabilityState,
    chat: RuntimeCapabilityState,
    exec: RuntimeCapabilityState
  }).strict(),
  mcp: RuntimeCapabilityState.extend({
    configuredServers: zod.z.number().int().nonnegative(),
    connectedServers: zod.z.number().int().nonnegative(),
    toolCount: zod.z.number().int().nonnegative(),
    search: zod.z.object({
      enabled: zod.z.boolean(),
      mode: McpToolDiscoveryMode,
      active: zod.z.boolean(),
      indexedToolCount: zod.z.number().int().nonnegative(),
      advertisedToolCount: zod.z.number().int().nonnegative()
    }).strict()
  }).strict(),
  web: RuntimeCapabilityState.extend({
    fetch: RuntimeCapabilityState,
    search: RuntimeCapabilityState,
    provider: zod.z.string().optional()
  }).strict(),
  skills: RuntimeCapabilityState.extend({
    configuredRoots: zod.z.number().int().nonnegative(),
    discoveredSkills: zod.z.number().int().nonnegative()
  }).strict(),
  subagents: RuntimeCapabilityState.extend({
    maxParallel: zod.z.number().int().nonnegative(),
    maxChildRuns: zod.z.number().int().nonnegative()
  }).strict(),
  attachments: RuntimeCapabilityState.extend({
    maxImageBytes: zod.z.number().int().positive(),
    maxImageDimension: zod.z.number().int().positive(),
    allowedMimeTypes: zod.z.array(zod.z.string().min(1)),
    textFallbackMaxBase64Bytes: zod.z.number().int().positive(),
    textFallbackMaxImageDimension: zod.z.number().int().positive(),
    textFallbackPreferredMimeType: zod.z.string().min(1)
  }).strict(),
  memory: RuntimeCapabilityState.extend({
    scopes: zod.z.array(zod.z.enum(["user", "workspace", "project"])),
    maxInjectedRecords: zod.z.number().int().positive()
  }).strict()
}).strict();
const PositiveInt = zod.z.number().int().positive();
const PositiveRatio = zod.z.number().positive().max(1);
const ModelContextCompactionProfileConfigSchema = zod.z.object({
  softRatio: PositiveRatio.optional(),
  hardRatio: PositiveRatio.optional(),
  softThreshold: PositiveInt.optional(),
  hardThreshold: PositiveInt.optional()
}).strict().superRefine((profile, ctx) => {
  if (profile.softThreshold !== void 0 && profile.hardThreshold !== void 0 && profile.hardThreshold < profile.softThreshold) {
    ctx.addIssue({
      code: "custom",
      message: "hardThreshold must be greater than or equal to softThreshold"
    });
  }
});
const ModelContextProfileConfigSchema = zod.z.object({
  aliases: zod.z.array(zod.z.string().min(1)).optional(),
  contextWindowTokens: PositiveInt.optional(),
  contextCompaction: ModelContextCompactionProfileConfigSchema.optional(),
  softRatio: PositiveRatio.optional(),
  hardRatio: PositiveRatio.optional(),
  softThreshold: PositiveInt.optional(),
  hardThreshold: PositiveInt.optional(),
  inputModalities: zod.z.array(ModelInputModality).optional(),
  outputModalities: zod.z.array(ModelInputModality).optional(),
  supportsToolCalling: zod.z.boolean().optional(),
  messageParts: zod.z.array(ModelMessagePartSupport).optional(),
  reasoning: ModelReasoningCapabilityMetadata.optional()
}).strict().superRefine((profile, ctx) => {
  const hasRatio = profile.softRatio !== void 0 || profile.hardRatio !== void 0 || profile.contextCompaction?.softRatio !== void 0 || profile.contextCompaction?.hardRatio !== void 0;
  if (hasRatio && profile.contextWindowTokens === void 0) {
    ctx.addIssue({
      code: "custom",
      message: "softRatio and hardRatio require contextWindowTokens"
    });
  }
  const softThreshold = profile.contextCompaction?.softThreshold ?? profile.softThreshold;
  const hardThreshold = profile.contextCompaction?.hardThreshold ?? profile.hardThreshold;
  if (softThreshold !== void 0 && hardThreshold !== void 0 && hardThreshold < softThreshold) {
    ctx.addIssue({
      code: "custom",
      message: "hardThreshold must be greater than or equal to softThreshold"
    });
  }
});
const ModelConfigSchema = zod.z.object({
  profiles: zod.z.record(zod.z.string().min(1), ModelContextProfileConfigSchema).optional()
}).strict();
const ContextCompactionConfigSchema = zod.z.object({
  defaultSoftThreshold: PositiveInt.optional(),
  defaultHardThreshold: PositiveInt.optional(),
  summaryMode: zod.z.enum(["heuristic", "model"]).optional(),
  summaryTimeoutMs: PositiveInt.optional(),
  summaryMaxTokens: PositiveInt.optional(),
  summaryInputMaxBytes: PositiveInt.optional(),
  modelProfiles: zod.z.record(zod.z.string().min(1), ModelContextProfileConfigSchema).optional()
}).strict().superRefine((config, ctx) => {
  if (config.defaultSoftThreshold !== void 0 && config.defaultHardThreshold !== void 0 && config.defaultHardThreshold < config.defaultSoftThreshold) {
    ctx.addIssue({
      code: "custom",
      message: "defaultHardThreshold must be greater than or equal to defaultSoftThreshold"
    });
  }
});
const RuntimeTuningConfigSchema = zod.z.object({
  toolStorm: zod.z.object({
    enabled: zod.z.boolean().optional(),
    windowSize: PositiveInt.optional(),
    threshold: zod.z.number().int().min(2).optional()
  }).strict().optional(),
  toolArgumentRepair: zod.z.object({
    maxStringBytes: PositiveInt.optional()
  }).strict().optional()
}).strict();
const RequestHistoryHygieneConfigSchema = zod.z.object({
  maxToolResultLines: PositiveInt.optional(),
  maxToolResultBytes: PositiveInt.optional(),
  maxToolResultTokens: PositiveInt.optional(),
  maxToolArgumentStringBytes: PositiveInt.optional(),
  maxToolArgumentStringTokens: PositiveInt.optional(),
  maxArrayItems: PositiveInt.optional()
}).strict();
const TokenEconomyConfigSchema = zod.z.object({
  enabled: zod.z.boolean().optional(),
  compressToolDescriptions: zod.z.boolean().optional(),
  compressToolResults: zod.z.boolean().optional(),
  conciseResponses: zod.z.boolean().optional(),
  historyHygiene: RequestHistoryHygieneConfigSchema.optional()
}).strict();
const StorageConfigSchema = zod.z.object({
  backend: zod.z.enum(["hybrid", "file"]).default("hybrid"),
  sqlitePath: zod.z.string().min(1).optional()
}).strict();
const LegalworkServeConfigSchema = zod.z.object({
  host: zod.z.string().optional(),
  port: zod.z.number().int().min(0).max(65535).optional(),
  dataDir: zod.z.string().min(1).optional(),
  runtimeToken: zod.z.string().optional(),
  apiKey: zod.z.string().optional(),
  baseUrl: zod.z.string().optional(),
  endpointFormat: zod.z.preprocess(
    normalizeModelEndpointFormat,
    zod.z.enum(MODEL_ENDPOINT_FORMATS)
  ).default(DEFAULT_MODEL_ENDPOINT_FORMAT).optional(),
  model: zod.z.string().min(1).optional(),
  approvalPolicy: ApprovalPolicySchema.default(DEFAULT_APPROVAL_POLICY).optional(),
  sandboxMode: SandboxModeSchema.default(DEFAULT_SANDBOX_MODE).optional(),
  tokenEconomyMode: zod.z.boolean().optional(),
  tokenEconomy: TokenEconomyConfigSchema.optional(),
  insecure: zod.z.boolean().optional(),
  storage: StorageConfigSchema.optional()
}).strict();
const LegalworkConfigSchema = zod.z.object({
  serve: LegalworkServeConfigSchema.optional(),
  models: ModelConfigSchema.optional(),
  contextCompaction: ContextCompactionConfigSchema.optional(),
  runtime: RuntimeTuningConfigSchema.optional(),
  capabilities: LegalworkCapabilitiesConfig.default(DEFAULT_LEGALWORK_CAPABILITIES_CONFIG)
}).strict();
const CLAW_SCHEDULE_MCP_MARKER_START = "# legalwork plugin:mcp:claw-schedule START";
const CLAW_SCHEDULE_MCP_MARKER_END = "# legalwork plugin:mcp:claw-schedule END";
const LEGALWORK_SCHEDULE_MCP_SERVER_NAME = "legalwork_schedule";
const LEGACY_CLAW_SCHEDULE_MCP_SERVER_NAME = "claw_schedule";
const LEGALWORK_SCHEDULE_MCP_NODE_ENTRY = "out/main/claw-schedule-mcp-node-entry.cjs";
const ELECTRON_RUN_AS_NODE_ENV = { ELECTRON_RUN_AS_NODE: "1" };
function resolveLegalworkConfigPath() {
  return node_path.join(node_os.homedir(), ".legalwork", "config.toml");
}
function resolveLegalworkMcpJsonPath() {
  return node_path.join(node_os.homedir(), ".legalwork", "mcp.json");
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isErrnoException(error) {
  return typeof error === "object" && error !== null;
}
function buildClawScheduleMcpArgs(settings, launch) {
  const args = [
    resolveClawScheduleMcpNodeEntryPath(launch),
    "--gui-schedule-mcp-server",
    "--base-url",
    `http://127.0.0.1:${settings.schedule.internal.port}`
  ];
  const secret = settings.schedule.internal.secret.trim();
  if (secret) {
    args.push("--secret", secret);
  }
  return args;
}
function resolveClawScheduleMcpNodeEntryPath(launch) {
  if (launch.appPath.includes("/") && !launch.appPath.includes("\\")) {
    return node_path.posix.join(launch.appPath, LEGALWORK_SCHEDULE_MCP_NODE_ENTRY);
  }
  return node_path.join(launch.appPath, LEGALWORK_SCHEDULE_MCP_NODE_ENTRY);
}
function resolveClawScheduleMcpCommand(launch, platform = process.platform) {
  if (platform !== "darwin") return launch.execPath;
  if (!launch.execPath.includes("/Contents/MacOS/")) return launch.execPath;
  const appContentsDir = node_path.posix.dirname(node_path.posix.dirname(launch.execPath));
  const appName = node_path.posix.basename(launch.execPath);
  const helperName = `${appName} Helper`;
  return node_path.posix.join(
    appContentsDir,
    "Frameworks",
    `${helperName}.app`,
    "Contents",
    "MacOS",
    helperName
  );
}
function buildClawScheduleMcpServerConfig(settings, launch) {
  return {
    command: resolveClawScheduleMcpCommand(launch),
    args: buildClawScheduleMcpArgs(settings, launch),
    env: ELECTRON_RUN_AS_NODE_ENV,
    url: null,
    connect_timeout: null,
    execute_timeout: null,
    read_timeout: null,
    disabled: false,
    enabled: true,
    required: false,
    enabled_tools: [],
    disabled_tools: []
  };
}
function buildSyncedClawScheduleMcpJson(existing, settings, launch) {
  const base = isRecord(existing) ? existing : {};
  const servers = isRecord(base.servers) ? base.servers : {};
  const { [LEGACY_CLAW_SCHEDULE_MCP_SERVER_NAME]: _legacyScheduleServer, ...userServers } = servers;
  const timeouts = isRecord(base.timeouts) ? base.timeouts : {
    connect_timeout: 10,
    execute_timeout: 60,
    read_timeout: 120
  };
  return {
    ...base,
    timeouts,
    servers: {
      ...userServers,
      [LEGALWORK_SCHEDULE_MCP_SERVER_NAME]: buildClawScheduleMcpServerConfig(settings, launch)
    }
  };
}
function removeMarkedTomlBlock(content, markerStart, markerEnd) {
  const startIndex = content.indexOf(markerStart);
  const endIndex = content.indexOf(markerEnd);
  if (startIndex >= 0 && endIndex > startIndex) {
    const before = content.slice(0, startIndex).trimEnd();
    const after = content.slice(endIndex + markerEnd.length).trimStart();
    return `${before}${before && after ? "\n\n" : ""}${after}`.trim();
  }
  return content.trim();
}
function stripTomlTable(content, tableHeader) {
  const lines = content.split("\n");
  const out = [];
  let skipping = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!skipping && trimmed === tableHeader) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        skipping = false;
        out.push(line);
      }
      continue;
    }
    out.push(line);
  }
  return out.join("\n").trim();
}
function removeLegacyClawScheduleTomlConfig(content) {
  const hasLegacyConfig = content.includes(CLAW_SCHEDULE_MCP_MARKER_START) || content.split("\n").some((line) => line.trim() === "[mcp_servers.claw_schedule]");
  if (!hasLegacyConfig) return content;
  const withoutMarked = removeMarkedTomlBlock(
    content,
    CLAW_SCHEDULE_MCP_MARKER_START,
    CLAW_SCHEDULE_MCP_MARKER_END
  );
  const withoutLegacyTable = stripTomlTable(withoutMarked, "[mcp_servers.claw_schedule]");
  return withoutLegacyTable ? `${withoutLegacyTable}
` : "";
}
async function readJsonFile$1(path) {
  let raw = "";
  try {
    raw = await promises.readFile(path, "utf8");
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") return null;
    throw error;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse Legalwork MCP config at ${path}: ${message}`, { cause: error });
  }
}
async function cleanupLegacyTomlConfig(path) {
  let current = "";
  try {
    current = await promises.readFile(path, "utf8");
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") return;
    throw error;
  }
  const next = removeLegacyClawScheduleTomlConfig(current);
  if (next === current) return;
  await promises.writeFile(path, next, "utf8");
}
function clawScheduleMcpSettingsChanged(prev, next) {
  return prev.schedule.internal.port !== next.schedule.internal.port || prev.schedule.internal.secret.trim() !== next.schedule.internal.secret.trim();
}
async function syncClawScheduleMcpConfig(settings, launch, paths = {}) {
  const configTomlPath = paths.configTomlPath ?? resolveLegalworkConfigPath();
  const mcpJsonPath = paths.mcpJsonPath ?? resolveLegalworkMcpJsonPath();
  await cleanupLegacyTomlConfig(configTomlPath);
  const current = await readJsonFile$1(mcpJsonPath);
  const next = buildSyncedClawScheduleMcpJson(current, settings, launch);
  const nextText = `${JSON.stringify(next, null, 2)}
`;
  const currentText = current === null ? "" : `${JSON.stringify(current, null, 2)}
`;
  if (nextText === currentText) return;
  await promises.mkdir(node_path.dirname(mcpJsonPath), { recursive: true });
  await promises.writeFile(mcpJsonPath, nextText, "utf8");
}
function isLegalworkHealthResponseBody(body) {
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    return false;
  }
  if (!parsed || typeof parsed !== "object") return false;
  const record = parsed;
  return record.status === "ok" && record.service === "legalwork" && record.mode === "serve";
}
let cfg = { dir: "", enabled: true, retentionDays: 2 };
const MANAGED_LOG_FILE_PREFIXES = ["legalwork"];
function configureLogger(config) {
  cfg = { ...cfg, ...config };
}
function logFileName(prefix, timestamp) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${prefix}-${timestamp.getFullYear()}-${pad(timestamp.getMonth() + 1)}-${pad(timestamp.getDate())}.log`;
}
function isManagedLogFile(entry) {
  return MANAGED_LOG_FILE_PREFIXES.some(
    (prefix) => entry.startsWith(`${prefix}-`) && entry.endsWith(".log")
  );
}
async function pruneOldLogs() {
  try {
    const entries = await promises.readdir(cfg.dir);
    const cutoff = Date.now() - cfg.retentionDays * 24 * 60 * 60 * 1e3;
    for (const entry of entries) {
      if (!isManagedLogFile(entry)) continue;
      try {
        const info = await promises.stat(node_path.join(cfg.dir, entry));
        if (info.mtimeMs < cutoff) {
          await promises.unlink(node_path.join(cfg.dir, entry));
        }
      } catch {
      }
    }
  } catch {
  }
}
async function appendManagedLogLine(prefix, line) {
  if (!cfg.enabled || !cfg.dir) return;
  const text = line.endsWith("\n") ? line : `${line}
`;
  try {
    await promises.mkdir(cfg.dir, { recursive: true });
    await promises.appendFile(node_path.join(cfg.dir, logFileName(prefix, /* @__PURE__ */ new Date())), text, "utf8");
    await pruneOldLogs();
  } catch {
  }
}
async function writeLogLine(level, category, message) {
  const stamp = (/* @__PURE__ */ new Date()).toISOString();
  const line = `[${stamp}] [${level.toUpperCase()}] [${category}] ${message}
`;
  await appendManagedLogLine("legalwork", line);
}
function logError(category, message, detail) {
  const full = detail !== void 0 ? `${message} — detail: ${safeStringify(detail)}` : message;
  void writeLogLine("error", category, full);
}
function logWarn(category, message, detail) {
  const full = detail !== void 0 ? `${message} — detail: ${safeStringify(detail)}` : message;
  void writeLogLine("warn", category, full);
}
function logInfo(category, message) {
  void writeLogLine("info", category, message);
}
async function pruneOnStartup() {
  await pruneOldLogs();
  logInfo("logger", `Pruned logs older than ${cfg.retentionDays} day(s) on startup`);
}
function safeStringify(value) {
  try {
    if (typeof value === "string") return value.slice(0, 2e3);
    return JSON.stringify(value, null, 2).slice(0, 2e3);
  } catch {
    return String(value).slice(0, 2e3);
  }
}
const SKIP_SEARCH_DIRS = /* @__PURE__ */ new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "dist",
  "out",
  "build",
  ".next",
  "coverage"
]);
function expandHomePath$1(raw) {
  const value = raw.trim();
  if (value === "~") return node_os.homedir();
  if (value.startsWith("~/") || value.startsWith("~\\")) {
    return node_path.join(node_os.homedir(), value.slice(2));
  }
  return value;
}
function normalizeSkillFolderName(raw) {
  const value = raw.trim();
  if (!value) {
    throw new Error("Skill name is required.");
  }
  if (value === "." || value === ".." || /[\\/]/.test(value)) {
    throw new Error("Skill name cannot contain path separators.");
  }
  return value;
}
async function pathExists(targetPath) {
  try {
    await promises.access(targetPath);
    return true;
  } catch {
    return false;
  }
}
function sanitizeUserPath(raw) {
  const value = raw.trim().replace(/\0/g, "");
  if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'") || value.startsWith("`") && value.endsWith("`")) {
    return value.slice(1, -1).trim();
  }
  return value;
}
function normalizeUserPath(raw) {
  const sanitized = sanitizeUserPath(raw);
  return process.platform === "win32" ? sanitized : sanitized.replace(/\\/g, "/");
}
function hasPathSeparator(value) {
  return /[\\/]/.test(value);
}
function normalizePathSeparators(value) {
  return value.replaceAll("\\", "/");
}
function extensionFromName(name) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot).toLowerCase() : "";
}
function validateEntryName(name) {
  const trimmed = name.trim();
  if (!trimmed || trimmed === "." || trimmed === "..") {
    throw new Error("Name is required.");
  }
  if (hasPathSeparator(trimmed) || node_path.basename(trimmed) !== trimmed) {
    throw new Error("Name must not contain path separators.");
  }
  return trimmed;
}
function namesEqual(a, b) {
  return process.platform === "linux" ? a === b : a.toLowerCase() === b.toLowerCase();
}
async function findUniqueFileByBasename(root, fileName) {
  const matches = [];
  const stack = [root];
  let scanned = 0;
  while (stack.length > 0 && scanned < 12e3) {
    const current = stack.pop();
    let entries;
    try {
      entries = await promises.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      scanned += 1;
      if (entry.isDirectory()) {
        if (!SKIP_SEARCH_DIRS.has(entry.name)) {
          stack.push(node_path.join(current, entry.name));
        }
        continue;
      }
      if (entry.isFile() && namesEqual(entry.name, fileName)) {
        matches.push(node_path.join(current, entry.name));
        if (matches.length > 1) return null;
      }
    }
  }
  return matches[0] ?? null;
}
async function canonicalPath(targetPath) {
  try {
    return await promises.realpath(targetPath);
  } catch {
    return node_path.resolve(targetPath);
  }
}
function isWithinWorkspace$1(workspaceRoot, targetPath) {
  const rel = node_path.relative(workspaceRoot, targetPath);
  return rel === "" || !rel.startsWith("..") && !node_path.isAbsolute(rel);
}
async function enforceWorkspaceBoundary(targetPath, workspaceRoot) {
  const rawWorkspace = workspaceRoot?.trim();
  if (!rawWorkspace) return targetPath;
  const workspacePath = await canonicalPath(node_path.resolve(expandHomePath$1(rawWorkspace)));
  const canonicalTarget = await canonicalPath(targetPath);
  if (!isWithinWorkspace$1(workspacePath, canonicalTarget)) {
    throw new Error("Path must stay within the selected workspace.");
  }
  return canonicalTarget;
}
async function resolveTargetPathWithinWorkspace(rawPath, workspaceRoot) {
  const value = normalizeUserPath(rawPath);
  if (!value) throw new Error("File path is required.");
  const expanded = expandHomePath$1(value);
  const rawWorkspace = workspaceRoot?.trim();
  if (!rawWorkspace) {
    return node_path.isAbsolute(expanded) ? node_path.resolve(expanded) : node_path.resolve(expanded);
  }
  const workspacePath = await canonicalPath(node_path.resolve(expandHomePath$1(rawWorkspace)));
  if (!node_path.isAbsolute(expanded)) {
    const direct2 = node_path.resolve(workspacePath, expanded);
    if (!isWithinWorkspace$1(workspacePath, direct2)) {
      throw new Error("Path must stay within the selected workspace.");
    }
    return direct2;
  }
  const direct = node_path.resolve(expanded);
  if (isWithinWorkspace$1(workspacePath, direct)) {
    return direct;
  }
  if (await pathExists(direct)) {
    const canonicalTarget = await canonicalPath(direct);
    if (isWithinWorkspace$1(workspacePath, canonicalTarget)) {
      return canonicalTarget;
    }
  }
  throw new Error("Path must stay within the selected workspace.");
}
async function resolveOpenTargetPath(rawPath, workspaceRoot, options) {
  const value = normalizeUserPath(rawPath);
  if (!value) throw new Error("File path is required.");
  const expanded = expandHomePath$1(value);
  const workspace = workspaceRoot?.trim() ? expandHomePath$1(workspaceRoot) : "";
  const allowBasenameFallback = options?.allowBasenameFallback ?? true;
  const direct = node_path.isAbsolute(expanded) ? node_path.resolve(expanded) : workspace ? node_path.resolve(workspace, expanded) : node_path.resolve(expanded);
  if (await pathExists(direct)) {
    return enforceWorkspaceBoundary(direct, workspaceRoot);
  }
  if (allowBasenameFallback && workspace && !hasPathSeparator(expanded)) {
    const match = await findUniqueFileByBasename(node_path.resolve(workspace), expanded);
    if (match) {
      return enforceWorkspaceBoundary(match, workspaceRoot);
    }
  }
  throw new Error(`File not found: ${rawPath}`);
}
async function resolveWorkspaceDirectory(payload) {
  const workspaceRoot = payload.workspaceRoot.trim();
  if (!workspaceRoot) {
    throw new Error("Workspace root is required.");
  }
  const targetPath = payload.path?.trim() ? await resolveOpenTargetPath(payload.path, workspaceRoot, { allowBasenameFallback: false }) : await canonicalPath(node_path.resolve(expandHomePath$1(workspaceRoot)));
  const info = await promises.stat(targetPath);
  if (!info.isDirectory()) {
    throw new Error("Target path is not a directory.");
  }
  return targetPath;
}
function compareWorkspaceEntries(a, b) {
  if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
  return a.name.localeCompare(b.name, void 0, { numeric: true, sensitivity: "base" });
}
const execFileAsync$1 = node_util.promisify(node_child_process.execFile);
const DEFAULT_EDITOR_ID = "system";
const EDITOR_ICON_PX = 18;
const EDITOR_CANDIDATES = [
  {
    id: "vscode",
    label: "VS Code",
    kind: "editor",
    commands: ["code"],
    commonCommandPaths: [
      "/usr/local/bin/code",
      "/opt/homebrew/bin/code",
      "/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
    ],
    macAppName: "Visual Studio Code",
    macAppPaths: [
      "/Applications/Visual Studio Code.app",
      node_path.join(node_os.homedir(), "Applications/Visual Studio Code.app")
    ],
    winAppPaths: [
      node_path.join(process.env.LOCALAPPDATA ?? "", "Programs", "Microsoft VS Code", "Code.exe"),
      node_path.join(process.env.PROGRAMFILES ?? "", "Microsoft VS Code", "Code.exe")
    ],
    lineStyle: "vscode"
  },
  {
    id: "cursor",
    label: "Cursor",
    kind: "editor",
    commands: ["cursor"],
    commonCommandPaths: [
      "/usr/local/bin/cursor",
      "/opt/homebrew/bin/cursor",
      "/Applications/Cursor.app/Contents/Resources/app/bin/cursor"
    ],
    macAppName: "Cursor",
    macAppPaths: ["/Applications/Cursor.app", node_path.join(node_os.homedir(), "Applications/Cursor.app")],
    winAppPaths: [
      node_path.join(process.env.LOCALAPPDATA ?? "", "Programs", "Cursor", "Cursor.exe"),
      node_path.join(process.env.PROGRAMFILES ?? "", "Cursor", "Cursor.exe")
    ],
    lineStyle: "vscode"
  },
  {
    id: "windsurf",
    label: "Windsurf",
    kind: "editor",
    commands: ["windsurf"],
    commonCommandPaths: [
      "/usr/local/bin/windsurf",
      "/opt/homebrew/bin/windsurf",
      "/Applications/Windsurf.app/Contents/Resources/app/bin/windsurf"
    ],
    macAppName: "Windsurf",
    macAppPaths: ["/Applications/Windsurf.app", node_path.join(node_os.homedir(), "Applications/Windsurf.app")],
    winAppPaths: [
      node_path.join(process.env.LOCALAPPDATA ?? "", "Programs", "Windsurf", "Windsurf.exe"),
      node_path.join(process.env.PROGRAMFILES ?? "", "Windsurf", "Windsurf.exe")
    ],
    lineStyle: "vscode"
  },
  {
    id: "antigravity",
    label: "Antigravity",
    kind: "editor",
    commands: ["antigravity"],
    commonCommandPaths: [
      "/usr/local/bin/antigravity",
      "/opt/homebrew/bin/antigravity",
      "/Applications/Antigravity.app/Contents/Resources/app/bin/antigravity"
    ],
    macAppName: "Antigravity",
    macAppPaths: ["/Applications/Antigravity.app", node_path.join(node_os.homedir(), "Applications/Antigravity.app")],
    winAppPaths: [
      node_path.join(process.env.LOCALAPPDATA ?? "", "Programs", "Antigravity", "Antigravity.exe"),
      node_path.join(process.env.PROGRAMFILES ?? "", "Antigravity", "Antigravity.exe")
    ],
    lineStyle: "vscode"
  },
  {
    id: "zed",
    label: "Zed",
    kind: "editor",
    commands: ["zed"],
    commonCommandPaths: ["/usr/local/bin/zed", "/opt/homebrew/bin/zed"],
    macAppName: "Zed",
    macAppPaths: ["/Applications/Zed.app", node_path.join(node_os.homedir(), "Applications/Zed.app")],
    lineStyle: "zed"
  },
  {
    id: "sublime",
    label: "Sublime Text",
    kind: "editor",
    commands: ["subl", "sublime_text"],
    commonCommandPaths: ["/usr/local/bin/subl", "/opt/homebrew/bin/subl"],
    macAppName: "Sublime Text",
    macAppPaths: [
      "/Applications/Sublime Text.app",
      node_path.join(node_os.homedir(), "Applications/Sublime Text.app")
    ],
    lineStyle: "sublime"
  },
  {
    id: "xcode",
    label: "Xcode",
    kind: "editor",
    commands: ["xed"],
    commonCommandPaths: ["/usr/bin/xed"],
    macAppName: "Xcode",
    macAppPaths: ["/Applications/Xcode.app", node_path.join(node_os.homedir(), "Applications/Xcode.app")],
    lineStyle: "xcode",
    platforms: ["darwin"]
  },
  {
    id: "finder",
    label: "Finder",
    kind: "viewer",
    alwaysAvailable: true,
    macAppName: "Finder",
    macAppPaths: ["/System/Library/CoreServices/Finder.app"],
    platforms: ["darwin"]
  },
  {
    id: "terminal",
    label: "Terminal",
    kind: "terminal",
    alwaysAvailable: true,
    macAppName: "Terminal",
    macAppPaths: ["/System/Applications/Utilities/Terminal.app"],
    openDirectory: true,
    platforms: ["darwin"]
  },
  {
    id: "ghostty",
    label: "Ghostty",
    kind: "terminal",
    commands: ["ghostty"],
    commonCommandPaths: ["/usr/local/bin/ghostty", "/opt/homebrew/bin/ghostty"],
    macAppName: "Ghostty",
    macAppPaths: ["/Applications/Ghostty.app", node_path.join(node_os.homedir(), "Applications/Ghostty.app")],
    openDirectory: true
  },
  {
    id: "system",
    label: "System default",
    kind: "viewer",
    alwaysAvailable: true
  }
];
async function openPathWithShell(targetPath) {
  const result = await electron.shell.openPath(targetPath);
  return result ? { ok: false, message: result } : { ok: true };
}
function candidateSupportsPlatform(candidate) {
  return !candidate.platforms || candidate.platforms.includes(process.platform);
}
function compactPaths(paths) {
  return paths.filter((path) => Boolean(path?.trim()));
}
function commandPathGuesses(command) {
  if (!command || command.includes("/") || command.includes("\\")) return [command];
  if (process.platform === "win32") {
    return [
      node_path.join(process.env.LOCALAPPDATA ?? "", "Programs", command, `${command}.exe`),
      node_path.join(process.env.PROGRAMFILES ?? "", command, `${command}.exe`)
    ];
  }
  return [`/usr/local/bin/${command}`, `/opt/homebrew/bin/${command}`, `/usr/bin/${command}`];
}
async function findExecutable(commands = [], commonPaths = []) {
  const candidates = compactPaths([
    ...commonPaths,
    ...commands.flatMap((command) => commandPathGuesses(command))
  ]);
  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }
  const lookup = process.platform === "win32" ? "where" : "which";
  for (const command of commands) {
    try {
      const { stdout } = await execFileAsync$1(lookup, [command], {
        timeout: 1500,
        windowsHide: true
      });
      const first = stdout.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
      if (first) return first;
    } catch {
    }
  }
  return void 0;
}
async function findFirstExistingPath(paths = []) {
  for (const candidate of compactPaths(paths)) {
    if (await pathExists(candidate)) return candidate;
  }
  return void 0;
}
async function resolveEditor(candidate) {
  if (!candidateSupportsPlatform(candidate)) return null;
  const command = await findExecutable(candidate.commands, [
    ...candidate.commonCommandPaths ?? [],
    ...process.platform === "win32" ? candidate.winAppPaths ?? [] : []
  ]);
  const macAppPath = process.platform === "darwin" ? await findFirstExistingPath(candidate.macAppPaths) : void 0;
  const available = Boolean(candidate.alwaysAvailable || command || macAppPath);
  if (!available) return null;
  return {
    id: candidate.id,
    label: candidate.label,
    kind: candidate.kind,
    available: true,
    supportsLine: Boolean(command && candidate.lineStyle),
    detail: command ? node_path.basename(command) : macAppPath ? "Installed app" : void 0,
    command,
    macAppName: candidate.macAppName,
    appPath: macAppPath ?? (process.platform === "win32" ? command : void 0),
    lineStyle: candidate.lineStyle,
    openDirectory: candidate.openDirectory
  };
}
async function getAvailableEditors() {
  const editors = await Promise.all(EDITOR_CANDIDATES.map(resolveEditor));
  return editors.filter((editor) => editor !== null);
}
function defaultEditorId(editors) {
  return editors.find((editor) => editor.kind === "editor" && editor.supportsLine)?.id ?? editors.find((editor) => editor.kind === "editor")?.id ?? DEFAULT_EDITOR_ID;
}
function isValidIconDataUrl(dataUrl) {
  if (!dataUrl) return false;
  const marker = ";base64,";
  const index = dataUrl.indexOf(marker);
  if (index === -1) return false;
  return dataUrl.length - index - marker.length > 48;
}
function nativeImageToDataUrl(image) {
  if (image.isEmpty()) return void 0;
  const resized = image.resize({ width: EDITOR_ICON_PX, height: EDITOR_ICON_PX, quality: "best" });
  const source = resized.isEmpty() ? image : resized;
  const buffer = source.toPNG();
  if (!buffer?.length) return void 0;
  const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
  return isValidIconDataUrl(dataUrl) ? dataUrl : void 0;
}
async function macIcnsPathToDataUrl(iconPath) {
  if (process.platform !== "darwin") return void 0;
  const tmpPng = node_path.join(node_os.tmpdir(), `ds-gui-icon-${node_crypto.randomUUID()}.png`);
  try {
    await execFileAsync$1(
      "/usr/bin/sips",
      ["-s", "format", "png", "-z", String(EDITOR_ICON_PX), String(EDITOR_ICON_PX), iconPath, "--out", tmpPng],
      { timeout: 5e3, windowsHide: true }
    );
    const buffer = await promises.readFile(tmpPng);
    if (!buffer.length) return void 0;
    const dataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
    return isValidIconDataUrl(dataUrl) ? dataUrl : void 0;
  } catch {
    return void 0;
  } finally {
    await promises.unlink(tmpPng).catch(() => {
    });
  }
}
async function getFileIconDataUrl(targetPath) {
  try {
    const icon = await electron.app.getFileIcon(targetPath, { size: "small" });
    return nativeImageToDataUrl(icon);
  } catch {
    return void 0;
  }
}
async function macAppBundleIconDataUrl(appPath) {
  const infoPlistPath = node_path.join(appPath, "Contents", "Info");
  try {
    const { stdout } = await execFileAsync$1("/usr/bin/defaults", ["read", infoPlistPath, "CFBundleIconFile"], {
      timeout: 2e3,
      windowsHide: true
    });
    const rawIconName = stdout.trim();
    if (rawIconName) {
      const fileName = rawIconName.endsWith(".icns") ? rawIconName : `${rawIconName}.icns`;
      const iconPath = node_path.join(appPath, "Contents", "Resources", fileName);
      if (await pathExists(iconPath)) {
        const fromSips = await macIcnsPathToDataUrl(iconPath);
        if (fromSips) return fromSips;
      }
    }
  } catch {
  }
  return getFileIconDataUrl(appPath);
}
async function editorIconDataUrl(editor) {
  if (process.platform === "darwin" && editor.appPath?.endsWith(".app")) {
    const bundleIcon = await macAppBundleIconDataUrl(editor.appPath);
    if (bundleIcon) return bundleIcon;
  }
  const targetPath = editor.appPath ?? (editor.command && (node_path.isAbsolute(editor.command) || process.platform === "win32") ? editor.command : void 0);
  if (!targetPath) return void 0;
  return getFileIconDataUrl(targetPath);
}
async function listEditorsResult() {
  const editors = await getAvailableEditors();
  const icons = await Promise.all(editors.map((editor) => editorIconDataUrl(editor)));
  return {
    editors: editors.map(
      ({
        command: _command,
        macAppName: _macAppName,
        appPath: _appPath,
        lineStyle: _lineStyle,
        openDirectory: _openDirectory,
        ...editor
      }, index) => ({
        ...editor,
        ...isValidIconDataUrl(icons[index]) ? { iconDataUrl: icons[index] } : {}
      })
    ),
    defaultEditorId: defaultEditorId(editors)
  };
}
function formatPathForEditor(targetPath, line, column) {
  const safeLine = typeof line === "number" && line > 0 ? Math.floor(line) : void 0;
  const safeColumn = typeof column === "number" && column > 0 ? Math.floor(column) : void 0;
  if (!safeLine) return targetPath;
  return `${targetPath}:${safeLine}${safeColumn ? `:${safeColumn}` : ""}`;
}
function buildEditorArgs(editor, targetPath, line, column) {
  if (editor.openDirectory) return [targetPath];
  if (!editor.lineStyle || !line) return [targetPath];
  if (editor.lineStyle === "xcode") return ["-l", String(Math.floor(line)), targetPath];
  if (editor.lineStyle === "vscode") return ["-g", formatPathForEditor(targetPath, line, column)];
  if (editor.lineStyle === "sublime" || editor.lineStyle === "zed") {
    return [formatPathForEditor(targetPath, line, column)];
  }
  return [targetPath];
}
async function directoryForOpenTarget(targetPath) {
  try {
    const info = await promises.stat(targetPath);
    return info.isDirectory() ? targetPath : node_path.dirname(targetPath);
  } catch {
    return node_path.dirname(targetPath);
  }
}
async function openWithResolvedEditor(editor, targetPath, line, column) {
  if (editor.id === "finder") {
    electron.shell.showItemInFolder(targetPath);
    return;
  }
  if (editor.id === "system") {
    const result2 = await openPathWithShell(targetPath);
    if (!result2.ok) throw new Error(result2.message ?? "Could not open path.");
    return;
  }
  const openTarget = editor.openDirectory ? await directoryForOpenTarget(targetPath) : targetPath;
  if (editor.command) {
    try {
      await execFileAsync$1(editor.command, buildEditorArgs(editor, openTarget, line, column), {
        timeout: 1e4,
        windowsHide: true
      });
      return;
    } catch (error) {
      if (process.platform !== "darwin" || !editor.macAppName) throw error;
    }
  }
  if (process.platform === "darwin" && editor.macAppName) {
    await execFileAsync$1("open", ["-a", editor.macAppName, openTarget], {
      timeout: 1e4,
      windowsHide: true
    });
    return;
  }
  const result = await openPathWithShell(openTarget);
  if (!result.ok) throw new Error(result.message ?? "Could not open path.");
}
async function openEditorPath(payload) {
  try {
    const editors = await getAvailableEditors();
    const fallbackId = defaultEditorId(editors);
    const requestedId = payload.editorId?.trim();
    const editor = editors.find((item) => item.id === requestedId) ?? editors.find((item) => item.id === fallbackId) ?? editors.find((item) => item.id === DEFAULT_EDITOR_ID);
    if (!editor) throw new Error("No editor or system opener is available.");
    const targetPath = await resolveOpenTargetPath(payload.path, payload.workspaceRoot);
    await openWithResolvedEditor(editor, targetPath, payload.line, payload.column);
    return { ok: true, path: targetPath, editorId: editor.id };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
const MAX_FILE_PREVIEW_BYTES = 15e5;
const MAX_IMAGE_PREVIEW_BYTES = 12 * 1024 * 1024;
const WORKSPACE_IMAGE_DIR = "img";
const WORKSPACE_IMAGE_MIME_BY_EXT = /* @__PURE__ */ new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".webp", "image/webp"],
  [".bmp", "image/bmp"],
  [".avif", "image/avif"],
  [".ico", "image/x-icon"]
]);
async function listWorkspaceDirectory(payload) {
  try {
    const root = await resolveWorkspaceDirectory(payload);
    const entries = await promises.readdir(root, { withFileTypes: true });
    const normalized = entries.filter((entry) => entry.name !== ".DS_Store").map((entry) => ({
      name: entry.name,
      path: node_path.join(root, entry.name),
      type: entry.isDirectory() ? "directory" : "file",
      ext: entry.isDirectory() ? "" : extensionFromName(entry.name)
    })).sort(compareWorkspaceEntries);
    return { ok: true, root, entries: normalized };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function readWorkspaceFile(payload) {
  try {
    const targetPath = await resolveOpenTargetPath(payload.path, payload.workspaceRoot);
    const fileInfo = await promises.stat(targetPath);
    if (fileInfo.isDirectory()) {
      return { ok: false, message: "Cannot preview a directory." };
    }
    const maxBytes = Math.min(fileInfo.size, MAX_FILE_PREVIEW_BYTES);
    const handle = await promises.open(targetPath, "r");
    try {
      const buffer = Buffer.alloc(maxBytes);
      const { bytesRead } = await handle.read(buffer, 0, maxBytes, 0);
      const bytes = buffer.subarray(0, bytesRead);
      if (bytes.includes(0)) {
        return { ok: false, message: "This file appears to be binary and cannot be previewed." };
      }
      return {
        ok: true,
        path: targetPath,
        content: bytes.toString("utf8"),
        size: fileInfo.size,
        truncated: fileInfo.size > MAX_FILE_PREVIEW_BYTES,
        ...payload.line ? { line: payload.line } : {},
        ...payload.column ? { column: payload.column } : {}
      };
    } finally {
      await handle.close();
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function readWorkspaceImage(payload) {
  try {
    const targetPath = await resolveOpenTargetPath(payload.path, payload.workspaceRoot);
    const fileInfo = await promises.stat(targetPath);
    if (fileInfo.isDirectory()) {
      return { ok: false, message: "Cannot preview a directory." };
    }
    if (fileInfo.size > MAX_IMAGE_PREVIEW_BYTES) {
      return { ok: false, message: "This image is too large to preview." };
    }
    const ext = extensionFromName(targetPath).toLowerCase();
    const mimeType = WORKSPACE_IMAGE_MIME_BY_EXT.get(ext);
    if (!mimeType) {
      return { ok: false, message: "This image type is not supported in Write mode." };
    }
    const bytes = await promises.readFile(targetPath);
    return {
      ok: true,
      path: targetPath,
      dataUrl: `data:${mimeType};base64,${bytes.toString("base64")}`,
      mimeType,
      size: fileInfo.size
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function writeWorkspaceFile(payload) {
  try {
    const targetPath = await resolveTargetPathWithinWorkspace(payload.path, payload.workspaceRoot);
    await promises.mkdir(node_path.dirname(targetPath), { recursive: true });
    await promises.writeFile(targetPath, payload.content, "utf8");
    return {
      ok: true,
      path: targetPath,
      savedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function createWorkspaceFile(payload) {
  try {
    const targetPath = await resolveTargetPathWithinWorkspace(payload.path, payload.workspaceRoot);
    await promises.mkdir(node_path.dirname(targetPath), { recursive: true });
    if (await pathExists(targetPath)) {
      return { ok: false, message: "File already exists." };
    }
    await promises.writeFile(targetPath, payload.content ?? "", { encoding: "utf8", flag: "wx" });
    return {
      ok: true,
      path: targetPath,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function createWorkspaceDirectory(payload) {
  try {
    const targetPath = await resolveTargetPathWithinWorkspace(payload.path, payload.workspaceRoot);
    if (await pathExists(targetPath)) {
      return { ok: false, message: "Directory already exists." };
    }
    await promises.mkdir(targetPath);
    return {
      ok: true,
      path: targetPath,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
function buildWorkspaceImageName(now = /* @__PURE__ */ new Date()) {
  const iso = now.toISOString().replace(/[-:]/g, "").replace(/\..+$/, "").replace("T", "-");
  return `pasted-image-${iso}-${node_crypto.randomUUID().slice(0, 8)}.png`;
}
async function readClipboardImage() {
  try {
    const image = electron.clipboard.readImage();
    if (image.isEmpty()) {
      return { ok: false, message: "Clipboard does not currently contain an image." };
    }
    const buffer = image.toPNG();
    if (!buffer.length) {
      return { ok: false, message: "Clipboard image could not be encoded as PNG." };
    }
    const size = image.getSize();
    return {
      ok: true,
      name: buildWorkspaceImageName(),
      mimeType: "image/png",
      dataBase64: buffer.toString("base64"),
      byteSize: buffer.length,
      ...size.width > 0 ? { width: size.width } : {},
      ...size.height > 0 ? { height: size.height } : {}
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function saveWorkspaceClipboardImage(payload) {
  try {
    const currentFilePath = await resolveOpenTargetPath(payload.currentFilePath, payload.workspaceRoot, {
      allowBasenameFallback: false
    });
    const image = electron.clipboard.readImage();
    if (image.isEmpty()) {
      return { ok: false, message: "Clipboard does not currently contain an image." };
    }
    const buffer = image.toPNG();
    if (!buffer.length) {
      return { ok: false, message: "Clipboard image could not be encoded as PNG." };
    }
    const imageDirectory = payload.imageDirectory?.trim() || WORKSPACE_IMAGE_DIR;
    const imageDir = await resolveTargetPathWithinWorkspace(imageDirectory, payload.workspaceRoot);
    await promises.mkdir(imageDir, { recursive: true });
    const targetPath = await resolveTargetPathWithinWorkspace(
      node_path.join(imageDir, buildWorkspaceImageName()),
      payload.workspaceRoot
    );
    await promises.writeFile(targetPath, buffer);
    return {
      ok: true,
      path: targetPath,
      markdownPath: normalizePathSeparators(node_path.relative(node_path.dirname(currentFilePath), targetPath)),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function renameWorkspaceEntry(payload) {
  try {
    const sourcePath = await resolveTargetPathWithinWorkspace(payload.path, payload.workspaceRoot);
    await promises.stat(sourcePath);
    const nextName = validateEntryName(payload.newName);
    const targetPath = await resolveTargetPathWithinWorkspace(
      node_path.join(node_path.dirname(sourcePath), nextName),
      payload.workspaceRoot
    );
    if (sourcePath === targetPath) {
      return {
        ok: true,
        path: targetPath,
        previousPath: sourcePath,
        renamedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    if (await pathExists(targetPath)) {
      return { ok: false, message: "A file or directory with that name already exists." };
    }
    await promises.rename(sourcePath, targetPath);
    return {
      ok: true,
      path: targetPath,
      previousPath: sourcePath,
      renamedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function deleteWorkspaceEntry(payload) {
  try {
    const targetPath = await resolveTargetPathWithinWorkspace(payload.path, payload.workspaceRoot);
    const info = await promises.stat(targetPath);
    if (payload.workspaceRoot?.trim()) {
      const workspacePath = await canonicalPath(node_path.resolve(expandHomePath$1(payload.workspaceRoot)));
      if (targetPath === workspacePath) {
        return { ok: false, message: "Deleting the workspace root is not supported." };
      }
    }
    if (info.isDirectory()) {
      await promises.rm(targetPath, { recursive: true });
    } else {
      await promises.unlink(targetPath);
    }
    return {
      ok: true,
      path: targetPath,
      deletedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function resolveWorkspaceFile(payload) {
  try {
    const normalizedPath = normalizeUserPath(payload.path);
    const expandedPath = expandHomePath$1(normalizedPath);
    if (!node_path.isAbsolute(expandedPath) && !payload.workspaceRoot?.trim()) {
      return {
        ok: false,
        message: "Workspace root is required to resolve a relative file path."
      };
    }
    const targetPath = await resolveOpenTargetPath(payload.path, payload.workspaceRoot, {
      allowBasenameFallback: false
    });
    return { ok: true, path: targetPath };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
function isPackagedApp() {
  try {
    const { app } = require("electron");
    return app?.isPackaged === true;
  } catch {
    return false;
  }
}
function getElectronAppPath() {
  try {
    const { app } = require("electron");
    return app.getAppPath();
  } catch {
    return void 0;
  }
}
function resolveBuiltinSkillsRoot() {
  if (!isPackagedApp()) {
    const appPath = getElectronAppPath();
    const candidates2 = appPath ? [node_path.resolve(appPath, "../../skills")] : [node_path.resolve(process.cwd(), "../../skills")];
    return candidates2.find((candidate) => node_fs.existsSync(candidate));
  }
  const resourcesPath = process.resourcesPath ?? node_path.dirname(process.execPath);
  const candidates = [
    node_path.join(resourcesPath, "skills"),
    node_path.join(resourcesPath, "app.asar.unpacked", "skills")
  ];
  return candidates.find((candidate) => node_fs.existsSync(candidate));
}
async function guiSkillRootsForRuntime(settings, workspaceRootOverride) {
  if (!settings && !workspaceRootOverride) return [];
  const workspaceRoots = uniqueStrings$1([
    workspaceRootOverride,
    settings?.workspaceRoot,
    settings?.claw.im.workspaceRoot,
    settings?.schedule.defaultWorkspaceRoot,
    ...settings?.claw.channels.map((channel) => channel.workspaceRoot) ?? [],
    ...settings?.claw.tasks.map((task) => task.workspaceRoot) ?? [],
    ...settings?.schedule.tasks.map((task) => task.workspaceRoot) ?? []
  ].map(normalizeSkillRootPath).filter(Boolean));
  const projectRoots = workspaceRoots.flatMap((workspaceRoot) => [
    node_path.join(workspaceRoot, ".codex", "skills"),
    node_path.join(workspaceRoot, ".agents", "skills"),
    node_path.join(workspaceRoot, "skills")
  ]);
  const globalRoots = [
    node_path.join(node_os.homedir(), ".agents", "skills"),
    node_path.join(node_os.homedir(), ".legalwork", "skills"),
    ...await discoverCodexPluginSkillRoots(),
    ...await discoverComputerWideSkillRoots()
  ];
  const configuredExtraRoots = [
    ...settings?.claw.skills.extraDirs ?? [],
    ...settings?.schedule.skills.extraDirs ?? []
  ].map(normalizeSkillRootPath);
  const builtinRoot = resolveBuiltinSkillsRoot();
  return uniqueSkillRoots([
    ...projectRoots.filter((root) => node_fs.existsSync(root)).map((path) => ({ path, scope: "project" })),
    ...globalRoots.filter((root) => node_fs.existsSync(root)).map((path) => ({ path, scope: "global" })),
    ...configuredExtraRoots.filter(Boolean).map((path) => ({ path, scope: scopeForConfiguredRoot(path, workspaceRoots) })),
    ...builtinRoot ? [{ path: builtinRoot, scope: "builtin" }] : []
  ]);
}
async function listGuiSkills(settings, workspaceRootOverride) {
  try {
    const roots = await guiSkillRootsForRuntime(settings, workspaceRootOverride);
    const skills = [];
    const validationErrors = [];
    for (const root of roots) {
      const candidates = await packageCandidates(root.path).catch((error) => {
        validationErrors.push({ root: root.path, message: errorMessage$1(error) });
        return [];
      });
      for (const candidate of candidates) {
        const loaded = await loadSkillSummary(candidate, root.scope).catch((error) => {
          validationErrors.push({ root: candidate, message: errorMessage$1(error) });
          return null;
        });
        if (loaded) skills.push(loaded);
      }
    }
    return {
      ok: true,
      skills: dedupeSkills(skills),
      validationErrors
    };
  } catch (error) {
    return { ok: false, message: errorMessage$1(error) };
  }
}
function normalizeSkillRootPath(path) {
  const trimmed = path?.trim() ?? "";
  if (!trimmed) return "";
  return node_path.resolve(expandHomePath$1(trimmed));
}
function isHiddenDirectory(name) {
  return name.startsWith(".") && name !== ".codex" && name !== ".agents";
}
async function discoverComputerWideSkillRoots() {
  const roots = [];
  const userHome = node_os.homedir();
  const knownPaths = [
    node_path.join(userHome, ".claude", "skills"),
    node_path.join(userHome, ".codex", "skills"),
    node_path.join(userHome, ".agents", "skills"),
    node_path.join(userHome, ".legalwork", "skills"),
    node_path.join(userHome, "skills"),
    "/usr/local/share/skills",
    "/opt/skills"
  ];
  for (const path of knownPaths) {
    if (node_fs.existsSync(path) && skillRootHasPackages(path)) {
      roots.push(path);
    }
  }
  const scanRoots = [
    userHome,
    node_path.join(userHome, "Documents"),
    node_path.join(userHome, "Projects"),
    node_path.join(userHome, "Workspace")
  ];
  const discovered = (await Promise.all(
    scanRoots.map(async (root) => {
      if (!node_fs.existsSync(root)) return [];
      try {
        return await findSkillRootsUnder(root, 2);
      } catch {
        return [];
      }
    })
  )).flat();
  for (const path of discovered) {
    if (!roots.some((r) => comparablePath(r) === comparablePath(path))) {
      roots.push(path);
    }
  }
  return roots;
}
async function findSkillRootsUnder(root, maxDepth) {
  const results = [];
  if (maxDepth <= 0) return results;
  try {
    const entries = await promises.readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const name = entry.name;
      if (isHiddenDirectory(name)) continue;
      const fullPath = node_path.join(root, name);
      if (skillRootHasPackages(fullPath)) {
        results.push(fullPath);
      } else if (maxDepth > 1) {
        results.push(...await findSkillRootsUnder(fullPath, maxDepth - 1));
      }
    }
  } catch {
  }
  return results;
}
async function discoverCodexPluginSkillRoots() {
  const roots = [];
  await collectSkillRoots(node_path.join(node_os.homedir(), ".codex", "plugins", "cache"), roots, 0, 5);
  return roots;
}
async function collectSkillRoots(root, roots, depth, maxDepth) {
  if (depth > maxDepth || !node_fs.existsSync(root)) return;
  if (node_path.basename(root) === "skills" && skillRootHasPackages(root)) {
    roots.push(root);
    return;
  }
  const entries = await promises.readdir(root, { withFileTypes: true }).catch(() => []);
  await Promise.all(entries.filter((entry) => entry.isDirectory()).map((entry) => collectSkillRoots(node_path.join(root, entry.name), roots, depth + 1, maxDepth)));
}
function skillRootHasPackages(root) {
  if (node_fs.existsSync(node_path.join(root, "SKILL.md")) || node_fs.existsSync(node_path.join(root, "skill.json"))) return true;
  try {
    return node_fs.readdirSync(root, { withFileTypes: true }).some(
      (entry) => entry.isDirectory() && (node_fs.existsSync(node_path.join(root, entry.name, "SKILL.md")) || node_fs.existsSync(node_path.join(root, entry.name, "skill.json")))
    );
  } catch {
    return false;
  }
}
async function packageCandidates(root) {
  const candidates = /* @__PURE__ */ new Set();
  if (node_fs.existsSync(node_path.join(root, "skill.json")) || node_fs.existsSync(node_path.join(root, "SKILL.md"))) {
    candidates.add(root);
  }
  const entries = await promises.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = node_path.join(root, entry.name);
    if (node_fs.existsSync(node_path.join(dir, "skill.json")) || node_fs.existsSync(node_path.join(dir, "SKILL.md"))) {
      candidates.add(dir);
    }
  }
  return [...candidates];
}
async function loadSkillSummary(root, scope) {
  const manifestPath = node_path.join(root, "skill.json");
  const hasManifest = node_fs.existsSync(manifestPath);
  const entryPath = node_path.join(root, "SKILL.md");
  const hasEntry = node_fs.existsSync(entryPath);
  if (!hasManifest && !hasEntry) return null;
  const manifest = hasManifest ? JSON.parse(await promises.readFile(manifestPath, "utf8")) : {};
  const manifestName = stringValue(manifest.name);
  const manifestDescription = stringValue(manifest.description);
  const manifestId = stringValue(manifest.id);
  const entry = stringValue(manifest.entry) || "SKILL.md";
  const legacy = !hasManifest;
  let frontmatter = {};
  if (hasEntry) {
    const content = await promises.readFile(entryPath, "utf8");
    frontmatter = readFrontmatter(content);
  }
  let name;
  let description;
  if (scope === "builtin") {
    const frontmatterName = frontmatter.name?.trim();
    const frontmatterDescription = frontmatter.description?.trim();
    if (frontmatterName && isChineseText(frontmatterName)) {
      name = frontmatterName;
    } else if (manifestDescription && isChineseText(manifestDescription)) {
      name = extractChineseTitle(manifestDescription, manifestName || titleFromSlug(node_path.basename(root)));
    } else {
      name = manifestName || frontmatterName || titleFromSlug(node_path.basename(root));
    }
    description = frontmatterDescription || (manifestDescription && isChineseText(manifestDescription) ? manifestDescription : void 0);
  } else {
    name = manifestName || displaySkillName(frontmatter.name, node_path.basename(root));
    description = manifestDescription || frontmatter.description || void 0;
  }
  const id = slug(manifestId || frontmatter.id || (legacy ? node_path.basename(root) : name || node_path.basename(root)));
  return {
    id,
    name,
    ...description ? { description } : {},
    root,
    entryPath: node_path.join(root, entry),
    scope,
    legacy
  };
}
function readFrontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  if (!match) return { description: firstMarkdownParagraph(content) };
  const yaml = match[1] ?? "";
  return {
    id: frontmatterString(yaml, "id"),
    name: frontmatterString(yaml, "name"),
    description: frontmatterString(yaml, "description") || firstMarkdownParagraph(content.slice(match[0].length))
  };
}
function frontmatterString(yaml, key) {
  const match = new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m").exec(yaml);
  return match ? stripQuotes(match[1] ?? "").trim() || void 0 : void 0;
}
function firstMarkdownParagraph(markdown) {
  return markdown.split(/\n{2,}/).map((block) => block.replace(/^#+\s*/, "").trim()).find(Boolean);
}
function stripQuotes(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
function stringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}
function isChineseText(text) {
  return /[一-鿿]/.test(text);
}
function extractChineseTitle(description, fallback) {
  if (!description) return fallback;
  if (!isChineseText(description)) return fallback;
  const colonIndex = description.indexOf("：");
  if (colonIndex > 0 && colonIndex < 30) {
    const title = description.slice(0, colonIndex).trim();
    if (isChineseText(title)) return title;
  }
  return fallback;
}
function titleFromSlug(value) {
  return value.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
function displaySkillName(frontmatterName, folderName) {
  const value = frontmatterName?.trim() ?? "";
  if (!value) return titleFromSlug(folderName);
  return /^[a-z0-9][a-z0-9_-]*$/i.test(value) ? titleFromSlug(value) : value;
}
function slug(value) {
  return value.trim().normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu, "-").replace(/^-+|-+$/g, "") || "skill";
}
function dedupeSkills(skills) {
  const unique = /* @__PURE__ */ new Map();
  for (const skill of skills.sort(compareSkillSummary)) {
    if (!unique.has(skill.id)) unique.set(skill.id, skill);
  }
  return [...unique.values()];
}
function compareSkillSummary(a, b) {
  if (a.scope !== b.scope) {
    const priority = { project: 0, global: 1, builtin: 2 };
    return priority[a.scope] - priority[b.scope];
  }
  return a.name.localeCompare(b.name);
}
function scopeForConfiguredRoot(path, workspaceRoots) {
  const comparable = comparablePath(path);
  return workspaceRoots.some((workspaceRoot) => {
    const workspace = comparablePath(workspaceRoot);
    return comparable === workspace || comparable.startsWith(`${workspace}/`);
  }) ? "project" : "global";
}
function uniqueSkillRoots(roots) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const root of roots) {
    const key = comparablePath(root.path);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(root);
  }
  return out;
}
function uniqueStrings$1(values) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}
function comparablePath(path) {
  return path.replace(/\\/g, "/").replace(/\/+$/g, "").toLowerCase();
}
function errorMessage$1(error) {
  return error instanceof Error ? error.message : String(error);
}
let child = null;
let childLogCapture = null;
const LEGALWORK_READY_PREFIX = "LEGALWORK_READY ";
const LEGALWORK_STARTUP_TIMEOUT_MS = 6e4;
const LEGALWORK_STARTUP_HEALTH_POLL_MS = 500;
const LEGALWORK_STARTUP_HEALTH_REQUEST_TIMEOUT_MS = 1e3;
const LEGALWORK_STOP_GRACE_MS = 800;
const LEGALWORK_STOP_FORCE_MS = 400;
const STDERR_TAIL_MAX_CHARS = 4e3;
const LEGALWORK_SCHEDULE_MCP_TIMEOUT_MS = 5e3;
const DEFAULT_LEGALWORK_MODEL_PROFILES = {
  "deepseek-v4-pro": {
    contextWindowTokens: 1e6,
    contextCompaction: {
      softThreshold: 98e4,
      hardThreshold: 99e4
    },
    inputModalities: ["text"],
    outputModalities: ["text"],
    supportsToolCalling: true,
    messageParts: ["text"]
  },
  "deepseek-v4-flash": {
    aliases: ["deepseek-chat", "deepseek-reasoner"],
    contextWindowTokens: 1e6,
    contextCompaction: {
      softThreshold: 98e4,
      hardThreshold: 99e4
    },
    inputModalities: ["text"],
    outputModalities: ["text"],
    supportsToolCalling: true,
    messageParts: ["text"]
  },
  "kimi-for-coding": {
    contextWindowTokens: 262144,
    contextCompaction: {
      softThreshold: 245760,
      hardThreshold: 258048
    },
    inputModalities: ["text", "image"],
    outputModalities: ["text"],
    supportsToolCalling: true,
    messageParts: ["text", "image_url"],
    reasoning: {
      supportedEfforts: ["off", "low", "medium", "high"],
      defaultEffort: "medium",
      requestProtocol: "openai-chat-completions"
    }
  }
};
function appendTail(current, nextChunk, maxChars = STDERR_TAIL_MAX_CHARS) {
  const combined = `${current}${nextChunk}`;
  return combined.length > maxChars ? combined.slice(-maxChars) : combined;
}
function formatLegalworkLogLine(stream, pid, message) {
  const stamp = (/* @__PURE__ */ new Date()).toISOString();
  const pidLabel = typeof pid === "number" ? `legalwork pid=${pid}` : "legalwork";
  return `[${stamp}] [${stream.toUpperCase()}] [${pidLabel}] ${message}
`;
}
function normalizeCapturedChunk(chunk) {
  return String(chunk).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function createLegalworkChildLogCapture(pid) {
  let stdoutRemainder = "";
  let stderrRemainder = "";
  let closed = false;
  let pending = Promise.resolve();
  const writeLine = (stream, message) => {
    pending = pending.then(() => appendManagedLogLine("legalwork", formatLegalworkLogLine(stream, pid, message))).catch(() => void 0);
  };
  const captureChunk = (stream, chunk) => {
    if (closed) return;
    const text = normalizeCapturedChunk(chunk);
    const buffered = `${stream === "stdout" ? stdoutRemainder : stderrRemainder}${text}`;
    const parts = buffered.split("\n");
    const remainder = parts.pop() ?? "";
    if (stream === "stdout") {
      stdoutRemainder = remainder;
    } else {
      stderrRemainder = remainder;
    }
    for (const part of parts) {
      writeLine(stream, part);
    }
  };
  return {
    captureStdout(chunk) {
      captureChunk("stdout", chunk);
    },
    captureStderr(chunk) {
      captureChunk("stderr", chunk);
    },
    logLifecycle(message) {
      if (closed) return;
      writeLine("lifecycle", message);
    },
    async close() {
      if (closed) {
        await pending;
        return;
      }
      closed = true;
      if (stdoutRemainder) {
        writeLine("stdout", stdoutRemainder);
        stdoutRemainder = "";
      }
      if (stderrRemainder) {
        writeLine("stderr", stderrRemainder);
        stderrRemainder = "";
      }
      await pending;
    }
  };
}
function appRoot$1() {
  return electron.app.isPackaged ? electron.app.getAppPath().replace(/app\.asar$/, "app.asar.unpacked") : electron.app.getAppPath();
}
function resolveLegalworkDataDir(runtime) {
  const trimmed = runtime.dataDir?.trim();
  if (trimmed) return expandHomePath(trimmed);
  return defaultLegalworkDataDir();
}
function expandHomePath(path) {
  if (path === "~") return node_os.homedir();
  if (path.startsWith("~/") || path.startsWith("~\\")) {
    return node_path.join(node_os.homedir(), path.slice(2).replace(/\\/g, "/"));
  }
  return path;
}
function isLegalworkChildRunning() {
  return child !== null && child.exitCode === null && child.signalCode === null;
}
async function startLegalworkChild(settings) {
  const runtime = resolveLegalworkRuntimeSettings(settings);
  if (isLegalworkChildRunning()) return;
  if (!runtime.autoStart) return;
  if (childLogCapture) {
    await childLogCapture.close();
    childLogCapture = null;
  }
  const root = appRoot$1();
  const resolution = resolveLegalworkExecutable(root, runtime.binaryPath);
  if (resolution.command === process.execPath && !node_fs.existsSync(resolution.args[0])) {
    throw new Error(
      `Legalwork runtime build is missing at ${resolution.args[0]}. Run \`npm run build:legalwork\` before starting the GUI.`
    );
  }
  const dataDir = resolveLegalworkDataDir(runtime);
  await syncGuiManagedLegalworkConfig(dataDir, runtime, {
    scheduleMcp: {
      settings,
      launch: {
        appPath: electron.app.getAppPath(),
        execPath: process.execPath,
        isPackaged: electron.app.isPackaged
      }
    }
  });
  resolution.command === process.execPath ? resolution.args.join(" ") : resolution.command;
  const args = buildLegalworkServeArgs({
    resolution,
    host: "127.0.0.1",
    port: runtime.port,
    dataDir,
    baseUrl: runtime.baseUrl,
    endpointFormat: runtime.endpointFormat,
    model: runtime.model,
    approvalPolicy: runtime.approvalPolicy,
    sandboxMode: "danger-full-access",
    tokenEconomyMode: runtime.tokenEconomyMode,
    insecure: isLegalworkRuntimeInsecure(runtime)
  });
  const webRoot = node_path.join(root, "vendor", "data-compliance-review-codex", "data-compliance-web");
  child = node_child_process.spawn(resolution.command, args, {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      LEGALWORK_RUNTIME_TOKEN: runtime.runtimeToken,
      LEGALWORK_COMPLIANCE_WEB_ROOT: webRoot,
      DEEPSEEK_API_KEY: runtime.apiKey || process.env.DEEPSEEK_API_KEY || "",
      KIMI_API_KEY: runtime.apiKey || process.env.KIMI_API_KEY || ""
    },
    stdio: ["ignore", "pipe", "pipe"],
    detached: false
  });
  const startedChild = child;
  const startedLogCapture = createLegalworkChildLogCapture(startedChild.pid);
  childLogCapture = startedLogCapture;
  startedLogCapture.logLifecycle(`spawned on port ${runtime.port} using data dir ${dataDir}`);
  startedChild.stdout?.on("data", startedLogCapture.captureStdout);
  startedChild.stderr?.on("data", startedLogCapture.captureStderr);
  child.on("exit", (code, signal) => {
    startedLogCapture.logLifecycle(
      signal ? `exited with signal ${signal}` : `exited with code ${code ?? "unknown"}`
    );
    void startedLogCapture.close();
    if (child === startedChild) child = null;
  });
  child.on("error", (error) => {
    startedLogCapture.logLifecycle(
      `process error: ${error instanceof Error ? error.message : String(error)}`
    );
  });
  try {
    await waitForLegalworkStartup(startedChild, runtime.port);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    startedLogCapture.logLifecycle(`startup failed before ready: ${message}`);
    if (child === startedChild) {
      await stopLegalworkChildAndWait();
    }
    throw error;
  }
  startedLogCapture.logLifecycle(`ready marker received on port ${runtime.port}`);
}
async function syncGuiManagedLegalworkConfig(dataDir, runtime, options) {
  const configPath2 = node_path.join(dataDir, "config.json");
  const existing = sanitizeLegalworkConfigSections(await readJsonObjectIfExists(configPath2));
  const importedMcpServers = await readGuiManagedMcpServers(
    options?.mcpConfigPath ?? resolveLegalworkMcpJsonPath()
  );
  const hasImportedEnabledMcpServer = Object.values(importedMcpServers).some(
    (server2) => objectValue(server2).enabled !== false
  );
  const serve = objectValue(existing?.serve);
  const existingTokenEconomy = objectValue(serve.tokenEconomy);
  const existingContextCompaction = objectValue(existing?.contextCompaction);
  const existingModels = objectValue(existing?.models);
  const existingRuntimeTuning = objectValue(existing?.runtime);
  const capabilities = objectValue(existing?.capabilities);
  const mcp = objectValue(capabilities.mcp);
  const search = objectValue(mcp.search);
  const attachments = objectValue(capabilities.attachments);
  const web = objectValue(capabilities.web);
  const skills = objectValue(capabilities.skills);
  const storage = storageConfigForRuntime(runtime.storage);
  const mcpSearch = runtime.mcpSearch;
  const skillCapability = await skillCapabilityConfigForRuntime(skills, options?.scheduleMcp?.settings);
  const next = {
    serve: {
      ...serve,
      storage,
      tokenEconomy: tokenEconomyConfigForRuntime(runtime.tokenEconomy, existingTokenEconomy)
    },
    models: modelConfigForRuntime(existingModels),
    contextCompaction: contextCompactionConfigForRuntime(runtime.contextCompaction, existingContextCompaction),
    runtime: runtimeTuningConfigForRuntime(runtime.runtimeTuning, existingRuntimeTuning),
    capabilities: {
      ...capabilities,
      attachments: {
        ...attachments,
        enabled: attachments.enabled === false ? false : true
      },
      web: {
        ...web,
        enabled: web.enabled === false ? false : true,
        fetchEnabled: web.fetchEnabled === false ? false : true
      },
      skills: skillCapability,
      mcp: {
        ...mcp,
        ...options?.scheduleMcp || mcpSearch.enabled || hasImportedEnabledMcpServer ? { enabled: mcp.enabled === false ? false : true } : {},
        servers: {
          ...objectValue(mcp.servers),
          ...importedMcpServers,
          ...options?.scheduleMcp ? {
            [LEGALWORK_SCHEDULE_MCP_SERVER_NAME]: buildGuiScheduleLegalworkMcpServer(
              options.scheduleMcp.settings,
              options.scheduleMcp.launch
            )
          } : {}
        },
        search: {
          ...search,
          enabled: mcpSearch.enabled,
          mode: mcpSearch.mode,
          autoThresholdToolCount: mcpSearch.autoThresholdToolCount,
          topKDefault: mcpSearch.topKDefault,
          topKMax: mcpSearch.topKMax,
          minScore: mcpSearch.minScore
        }
      }
    }
  };
  const parsedNext = LegalworkConfigSchema.safeParse(next);
  if (!parsedNext.success) {
    throw new Error(
      `Refusing to write invalid GUI-managed Legalwork config at ${configPath2}: ${JSON.stringify(parsedNext.error.issues, null, 2)}`
    );
  }
  const nextText = `${JSON.stringify(next, null, 2)}
`;
  if (existing && nextText === `${JSON.stringify(existing, null, 2)}
`) return;
  await promises.mkdir(node_path.dirname(configPath2), { recursive: true });
  await promises.writeFile(configPath2, nextText, "utf8");
}
function buildGuiScheduleLegalworkMcpServer(settings, launch) {
  return {
    enabled: true,
    transport: "stdio",
    command: resolveClawScheduleMcpCommand(launch),
    args: buildClawScheduleMcpArgs(settings, launch),
    env: {
      ELECTRON_RUN_AS_NODE: "1"
    },
    trustScope: "user",
    timeoutMs: LEGALWORK_SCHEDULE_MCP_TIMEOUT_MS
  };
}
async function skillCapabilityConfigForRuntime(existing, settings) {
  const roots = uniqueStrings([
    ...stringArrayValue(existing.roots).map(normalizeSkillRootPath),
    ...(await guiSkillRootsForRuntime(settings)).map((root) => root.path)
  ]);
  return {
    ...existing,
    enabled: existing.enabled === false ? false : roots.length > 0 || existing.enabled === true,
    roots,
    legacySkillMd: existing.legacySkillMd === false ? false : true
  };
}
function stringArrayValue(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim().length > 0) : [];
}
function uniqueStrings(values) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}
async function readGuiManagedMcpServers(path) {
  const parsed = await readJsonObjectIfExists(path);
  if (!parsed) return {};
  const rawServers = mcpServersFromGuiConfig(parsed);
  const normalizedEntries = Object.entries(rawServers).map(([serverId, server2]) => {
    const normalized = normalizeGuiManagedMcpServer(server2);
    return normalized ? [serverId, normalized] : null;
  }).filter((entry) => entry !== null);
  return Object.fromEntries(normalizedEntries);
}
function mcpServersFromGuiConfig(config) {
  const directServers = objectValue(config.servers);
  if (Object.keys(directServers).length > 0) return directServers;
  const capabilities = objectValue(config.capabilities);
  const mcp = objectValue(capabilities.mcp);
  return objectValue(mcp.servers);
}
function normalizeGuiManagedMcpServer(server2) {
  const raw = objectValue(server2);
  const command = scalarStringValue(raw.command);
  const url = scalarStringValue(raw.url);
  const args = stringArrayValue(raw.args);
  const headers = stringRecordValue(raw.headers);
  const env = stringRecordValue(raw.env);
  const transport = normalizeMcpTransport(raw.transport, command, url);
  if (!transport) return null;
  const trustedWorkspaceRoots = stringArrayValue(raw.trustedWorkspaceRoots);
  const trustScope = normalizeMcpTrustScope(raw.trustScope, trustedWorkspaceRoots);
  const timeoutMs = positiveIntegerValue(raw.timeoutMs);
  const parsed = McpServerConfig.safeParse({
    enabled: raw.enabled === false || raw.disabled === true ? false : true,
    transport,
    ...command ? { command } : {},
    ...args.length > 0 ? { args } : {},
    ...url ? { url } : {},
    ...Object.keys(headers).length > 0 ? { headers } : {},
    ...Object.keys(env).length > 0 ? { env } : {},
    trustScope,
    ...trustedWorkspaceRoots.length > 0 ? { trustedWorkspaceRoots } : {},
    ...timeoutMs ? { timeoutMs } : {}
  });
  return parsed.success ? objectValue(parsed.data) : null;
}
function normalizeMcpTransport(value, command, url) {
  if (value === "stdio" || value === "streamable-http" || value === "sse") return value;
  if (command) return "stdio";
  if (url) return "streamable-http";
  return null;
}
function normalizeMcpTrustScope(value, trustedWorkspaceRoots) {
  if (value === "user" || value === "workspace") return value;
  return trustedWorkspaceRoots.length > 0 ? "workspace" : "user";
}
function scalarStringValue(value) {
  return typeof value === "string" ? value : typeof value === "number" || typeof value === "boolean" ? String(value) : void 0;
}
function stringRecordValue(value) {
  const record = objectValue(value);
  const next = {};
  for (const [key, item] of Object.entries(record)) {
    const normalized = scalarStringValue(item);
    if (normalized !== void 0) next[key] = normalized;
  }
  return next;
}
function positiveIntegerValue(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function modelConfigForRuntime(existing) {
  const existingProfiles = objectValue(existing.profiles);
  const profiles = { ...DEFAULT_LEGALWORK_MODEL_PROFILES };
  for (const [modelId, profile] of Object.entries(existingProfiles)) {
    const defaultProfile = objectValue(DEFAULT_LEGALWORK_MODEL_PROFILES[modelId]);
    const existingProfile = objectValue(profile);
    profiles[modelId] = {
      ...defaultProfile,
      ...existingProfile,
      contextCompaction: {
        ...objectValue(defaultProfile.contextCompaction),
        ...objectValue(existingProfile.contextCompaction)
      }
    };
  }
  return {
    ...existing,
    profiles
  };
}
function tokenEconomyConfigForRuntime(tokenEconomy, existing) {
  const defaults = defaultLegalworkTokenEconomySettings();
  const normalized = {
    ...defaults,
    ...tokenEconomy ?? {},
    historyHygiene: {
      ...defaults.historyHygiene,
      ...tokenEconomy?.historyHygiene ?? {}
    }
  };
  const existingHistoryHygiene = objectValue(existing.historyHygiene);
  return {
    ...existing,
    enabled: normalized.enabled,
    compressToolDescriptions: normalized.compressToolDescriptions,
    compressToolResults: normalized.compressToolResults,
    conciseResponses: normalized.conciseResponses,
    historyHygiene: {
      ...existingHistoryHygiene,
      maxToolResultLines: normalized.historyHygiene.maxToolResultLines,
      maxToolResultBytes: normalized.historyHygiene.maxToolResultBytes,
      maxToolResultTokens: normalized.historyHygiene.maxToolResultTokens,
      maxToolArgumentStringBytes: normalized.historyHygiene.maxToolArgumentStringBytes,
      maxToolArgumentStringTokens: normalized.historyHygiene.maxToolArgumentStringTokens,
      maxArrayItems: normalized.historyHygiene.maxArrayItems
    }
  };
}
function storageConfigForRuntime(storage) {
  const sqlitePath = storage.sqlitePath.trim();
  return {
    backend: storage.backend,
    ...sqlitePath ? { sqlitePath } : {}
  };
}
function contextCompactionConfigForRuntime(contextCompaction, existing) {
  return {
    ...existing,
    defaultSoftThreshold: contextCompaction.defaultSoftThreshold,
    defaultHardThreshold: contextCompaction.defaultHardThreshold,
    summaryMode: contextCompaction.summaryMode,
    summaryTimeoutMs: contextCompaction.summaryTimeoutMs,
    summaryMaxTokens: contextCompaction.summaryMaxTokens,
    summaryInputMaxBytes: contextCompaction.summaryInputMaxBytes
  };
}
function runtimeTuningConfigForRuntime(runtimeTuning, existing) {
  const existingToolStorm = objectValue(existing.toolStorm);
  const existingToolArgumentRepair = objectValue(existing.toolArgumentRepair);
  return {
    ...existing,
    toolStorm: {
      ...existingToolStorm,
      enabled: runtimeTuning.toolStorm.enabled,
      windowSize: runtimeTuning.toolStorm.windowSize,
      threshold: runtimeTuning.toolStorm.threshold
    },
    toolArgumentRepair: {
      ...existingToolArgumentRepair,
      maxStringBytes: runtimeTuning.toolArgumentRepair.maxStringBytes
    }
  };
}
async function readJsonObjectIfExists(path) {
  try {
    const text = await promises.readFile(path, "utf8");
    const parsed = JSON.parse(text);
    return objectValue(parsed);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}
function parseLegalworkConfigSection(schema, value) {
  const parsed = schema.safeParse(objectValue(value));
  return parsed.success ? objectValue(parsed.data) : {};
}
function sanitizeLegalworkCapabilitiesConfig(value) {
  const raw = objectValue(value);
  const next = {};
  if ("mcp" in raw) next.mcp = parseLegalworkConfigSection(McpCapabilityConfig, raw.mcp);
  if ("web" in raw) next.web = parseLegalworkConfigSection(WebCapabilityConfig, raw.web);
  if ("skills" in raw) next.skills = parseLegalworkConfigSection(SkillsCapabilityConfig, raw.skills);
  if ("subagents" in raw) {
    next.subagents = parseLegalworkConfigSection(SubagentsCapabilityConfig, raw.subagents);
  }
  if ("attachments" in raw) {
    next.attachments = parseLegalworkConfigSection(AttachmentsCapabilityConfig, raw.attachments);
  }
  if ("memory" in raw) next.memory = parseLegalworkConfigSection(MemoryCapabilityConfig, raw.memory);
  return next;
}
function sanitizeLegalworkConfigSections(existing) {
  if (!existing) return null;
  return {
    serve: parseLegalworkConfigSection(LegalworkServeConfigSchema, existing.serve),
    models: parseLegalworkConfigSection(ModelConfigSchema, existing.models),
    contextCompaction: parseLegalworkConfigSection(
      ContextCompactionConfigSchema,
      existing.contextCompaction
    ),
    runtime: parseLegalworkConfigSection(RuntimeTuningConfigSchema, existing.runtime),
    capabilities: sanitizeLegalworkCapabilitiesConfig(existing.capabilities)
  };
}
function objectValue(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
async function stopLegalworkChildAndWait() {
  if (!child) {
    if (childLogCapture) {
      const capture2 = childLogCapture;
      childLogCapture = null;
      await capture2.close();
    }
    return;
  }
  const stoppingChild = child;
  const pid = child.pid;
  const capture = childLogCapture;
  if (stoppingChild.exitCode === null && stoppingChild.signalCode === null) {
    try {
      stoppingChild.kill("SIGTERM");
    } catch {
    }
  }
  const exited = await waitForChildExit(stoppingChild, LEGALWORK_STOP_GRACE_MS);
  if (!exited) {
    try {
      if (pid) process.kill(pid, "SIGKILL");
    } catch {
    }
    await waitForChildExit(stoppingChild, LEGALWORK_STOP_FORCE_MS);
  }
  if (child === stoppingChild) child = null;
  if (capture) {
    childLogCapture = null;
    await capture.close();
  }
}
function waitForChildExit(process2, timeoutMs) {
  if (process2.exitCode !== null || process2.signalCode !== null) return Promise.resolve(true);
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => settle(false), timeoutMs);
    const settle = (exited) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      process2.removeListener("exit", onExit);
      process2.removeListener("error", onError);
      resolve(exited);
    };
    const onExit = () => settle(true);
    const onError = () => settle(true);
    process2.once("exit", onExit);
    process2.once("error", onError);
  });
}
async function reclaimLegalworkPort(port) {
  if (port <= 0) return { ok: true };
  const available = await canBindTcpPort(port, "127.0.0.1");
  return available ? { ok: true } : { ok: false, message: `port ${port} is in use` };
}
function canBindTcpPort(port, host) {
  return new Promise((resolve) => {
    let settled = false;
    const server2 = node_net.createServer();
    const settle = (available) => {
      if (settled) return;
      settled = true;
      server2.removeAllListeners("error");
      resolve(available);
    };
    server2.unref();
    server2.once("error", () => settle(false));
    server2.listen({ port, host, exclusive: true }, () => {
      server2.close(() => settle(true));
    });
  });
}
async function waitForLegalworkStartup(startedChild, port) {
  if (startedChild.exitCode !== null) {
    throw new Error(describeLegalworkExit(startedChild.exitCode, null));
  }
  await new Promise((resolve, reject) => {
    let settled = false;
    let stdoutBuffer = "";
    let stderrTail = "";
    let healthProbeInFlight = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(describeLegalworkStartupTimeout(stderrTail)));
    }, LEGALWORK_STARTUP_TIMEOUT_MS);
    const healthTimer = port ? setInterval(() => {
      if (settled || healthProbeInFlight) return;
      healthProbeInFlight = true;
      void probeLegalworkHealth(port).then((healthy) => {
        if (healthy) settleReady();
      }).finally(() => {
        healthProbeInFlight = false;
      });
    }, LEGALWORK_STARTUP_HEALTH_POLL_MS) : null;
    const cleanup = () => {
      clearTimeout(timer);
      if (healthTimer) clearInterval(healthTimer);
      startedChild.removeListener("exit", onExit);
      startedChild.removeListener("error", onError);
      startedChild.stdout?.removeListener("data", onStdout);
      startedChild.stderr?.removeListener("data", onStderr);
    };
    const tryParseReady = () => {
      const markerIndex = stdoutBuffer.indexOf(LEGALWORK_READY_PREFIX);
      if (markerIndex < 0) return false;
      const afterPrefix = stdoutBuffer.slice(markerIndex + LEGALWORK_READY_PREFIX.length);
      const newlineIndex = afterPrefix.indexOf("\n");
      if (newlineIndex < 0) return false;
      const jsonLine = afterPrefix.slice(0, newlineIndex).trim();
      if (!jsonLine) return false;
      try {
        const parsed = JSON.parse(jsonLine);
        return parsed.service === "legalwork" && parsed.mode === "serve" && typeof parsed.port === "number";
      } catch {
        return false;
      }
    };
    const settleReady = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const onStdout = (chunk) => {
      stdoutBuffer = appendTail(stdoutBuffer, String(chunk), STDERR_TAIL_MAX_CHARS * 2);
      if (tryParseReady()) settleReady();
    };
    const onStderr = (chunk) => {
      stderrTail = appendTail(stderrTail, String(chunk));
    };
    const onExit = (code, signal) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(describeLegalworkExit(code, signal, stderrTail)));
    };
    const onError = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };
    startedChild.stdout?.on("data", onStdout);
    startedChild.stderr?.on("data", onStderr);
    startedChild.once("exit", onExit);
    startedChild.once("error", onError);
  });
}
function describeLegalworkExit(code, signal, stderrTail = "") {
  const suffix = stderrTail.trim() ? `
${stderrTail.trim()}` : "";
  if (signal) return `Legalwork exited during startup with signal ${signal}${suffix}`;
  if (typeof code === "number") return `Legalwork exited during startup with code ${code}${suffix}`;
  return `Legalwork exited during startup${suffix}`;
}
function describeLegalworkStartupTimeout(stderrTail) {
  const suffix = stderrTail.trim() ? `
${stderrTail.trim()}` : "";
  return `Legalwork did not report ready within ${LEGALWORK_STARTUP_TIMEOUT_MS}ms${suffix}`;
}
async function probeLegalworkHealth(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, {
      signal: AbortSignal.timeout(LEGALWORK_STARTUP_HEALTH_REQUEST_TIMEOUT_MS)
    });
    if (!response.ok) return false;
    return isLegalworkHealthResponseBody(await response.text());
  } catch {
    return false;
  }
}
function getLegalworkBaseUrl(port, host = "127.0.0.1") {
  return `http://${host}:${port}`;
}
const LEGALWORK_RUNTIME_ID = "legalwork";
function appRoot() {
  return electron.app.isPackaged ? electron.app.getAppPath().replace(/app\.asar$/, "app.asar.unpacked") : electron.app.getAppPath();
}
const legalworkRuntimeAdapter = {
  id: LEGALWORK_RUNTIME_ID,
  async resolveExecutable(settings) {
    const runtime = getLegalworkRuntimeSettings(settings);
    const resolution = resolveLegalworkExecutable(appRoot(), runtime.binaryPath);
    if (resolution.kind === "node-script") {
      const scriptPath = resolution.args[0] ?? "";
      return runtime.binaryPath.trim() ? `Node.js script (${scriptPath})` : `Bundled Legalwork (${scriptPath})`;
    }
    return resolution.command;
  },
  ensureRunning(settings) {
    return startLegalworkChild(settings);
  },
  stopAndWait() {
    return stopLegalworkChildAndWait();
  },
  isChildRunning() {
    return isLegalworkChildRunning();
  },
  getBaseUrl(settings) {
    const runtime = getLegalworkRuntimeSettings(settings);
    return getLegalworkBaseUrl(runtime.port);
  },
  reclaimPort(port) {
    return reclaimLegalworkPort(port);
  }
};
function getRuntimeBaseUrlForSettings(settings) {
  return legalworkRuntimeAdapter.getBaseUrl(settings);
}
function runtimeAuthHeaders(settings) {
  const runtime = getLegalworkRuntimeSettings(settings);
  const headers = new Headers();
  if (runtime.runtimeToken.trim()) {
    headers.set("Authorization", `Bearer ${runtime.runtimeToken.trim()}`);
  }
  return headers;
}
async function runtimeRequestViaHost(settings, pathAndQuery, init, ensureRuntime2) {
  await ensureRuntime2(settings);
  const base = getRuntimeBaseUrlForSettings(settings);
  const pathNorm = pathAndQuery.startsWith("/") ? pathAndQuery : `/${pathAndQuery}`;
  const url = `${base}${pathNorm}`;
  const hdrs = runtimeAuthHeaders(settings);
  for (const [key, value] of Object.entries(init.headers ?? {})) {
    hdrs.set(key, value);
  }
  hdrs.set("Accept", "application/json");
  if (init.body && !hdrs.has("Content-Type")) {
    hdrs.set("Content-Type", "application/json");
  }
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: hdrs,
    body: init.body,
    signal: AbortSignal.timeout(init.method === "POST" ? 6e4 : 15e3)
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text };
}
function defaultLegalworkDataDir() {
  return DEFAULT_LEGALWORK_DATA_DIR.replace(/^~(?=$|[\\/])/, node_os.homedir());
}
function parseClawCommand(text) {
  const raw = text.trim().replace(/^／/, "/");
  const lower = raw.toLowerCase();
  if (/^[/-](?:clear|reset|new|清空|重置|新会话|新话题)$/.test(lower)) {
    return { kind: "clear" };
  }
  if (/^[/-](?:help|帮助|命令|\?)$/.test(lower)) {
    return { kind: "help" };
  }
  const match = raw.match(/^[/-](?:model|模型)(?:\s+(.+))?$/i);
  if (!match) return null;
  const value = (match[1] ?? "").trim().toLowerCase();
  if (!value) return { kind: "showModel" };
  if (value === "auto" || value === "自动") return { kind: "model", model: "auto" };
  if (value === "pro" || value === "deepseek-v4-pro") {
    return { kind: "model", model: "deepseek-v4-pro" };
  }
  if (value === "flash" || value === "deepseek-v4-flash") {
    return { kind: "model", model: "deepseek-v4-flash" };
  }
  return { kind: "model", model: (match[1] ?? "").trim() };
}
const WEBHOOK_BODY_LIMIT_BYTES = 1e6;
function sanitizePathSegment(raw, fallback) {
  const sanitized = raw.trim().replace(/[\\/]/g, "-").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || fallback;
}
function feishuSenderLabel(message) {
  return message.senderName?.trim() || message.senderId.trim() || "feishu-user";
}
function buildFeishuPrompt(message) {
  const content = message.content.trim();
  const sender = feishuSenderLabel(message);
  const lines = [
    CLAW_FEISHU_INBOUND_MESSAGE_HEADING,
    `Chat type: ${message.chatType}`,
    `Sender: ${sender}`
  ];
  if (message.mentions.length > 0) {
    const mentionNames = message.mentions.map((mention) => mention.name?.trim() || mention.openId?.trim() || mention.userId?.trim() || "").filter(Boolean);
    if (mentionNames.length > 0) {
      lines.push(`Mentions: ${mentionNames.join(", ")}`);
    }
  }
  if (message.rawContentType !== "text") {
    lines.push(`Message type: ${message.rawContentType}`);
  }
  lines.push("", content || "[No text content]");
  return lines.join("\n");
}
function formatFeishuMirrorText(text, direction) {
  const trimmed = text.trim();
  if (direction === "user") {
    return {
      markdown: `**From legalwork**

> ${trimmed.replace(/\n/g, "\n> ")}`
    };
  }
  return { markdown: trimmed || "(empty reply)" };
}
function clawConversationKey(chatId, remoteThreadId) {
  return `${chatId.trim()}::${remoteThreadId.trim()}`;
}
function parseJsonObject$1(raw) {
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function runtimeErrorMessage$1(result, fallback) {
  const parsed = parseJsonObject$1(result.body);
  if (parsed) {
    const message = parsed.message;
    if (typeof message === "string" && message.trim()) return message.trim();
    const error = parsed.error;
    if (typeof error === "string" && error.trim()) return error.trim();
    if (typeof error === "object" && error !== null) {
      const nested = error.message;
      if (typeof nested === "string" && nested.trim()) return nested.trim();
    }
  }
  return result.body.trim() || fallback;
}
function isRunningStatus$1(status) {
  return status === "queued" || status === "in_progress" || status === "started" || status === "running";
}
function latestAssistantText$1(detail, options = {}) {
  const turnId = options.turnId?.trim();
  const items = turnId ? threadItems$1(detail).filter((item) => item.turnId === turnId) : threadItems$1(detail);
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    if (item.kind !== "assistant_text" && item.kind !== "agent_message") continue;
    const text = (item.text ?? item.detail ?? item.summary ?? "").trim();
    if (text) return text;
  }
  return "";
}
function outputRecord(output) {
  return typeof output === "object" && output !== null && !Array.isArray(output) ? output : null;
}
function generatedFileFromToolResult(item, workspaceRoot) {
  if (item.kind !== "tool_result" || item.toolKind !== "file_change" || item.isError === true) return null;
  const output = outputRecord(item.output);
  if (!output) return null;
  const path = asString$1(output.path) || asString$1(output.absolute_path);
  const relativePath = asString$1(output.relative_path);
  const resolvedPath = path || (workspaceRoot && relativePath ? node_path.join(workspaceRoot, relativePath) : "");
  if (!resolvedPath) return null;
  return {
    path: resolvedPath,
    ...relativePath ? { relativePath } : {},
    fileName: node_path.basename(relativePath || resolvedPath)
  };
}
function threadItems$1(detail) {
  const turns = Array.isArray(detail.turns) ? detail.turns : [];
  const singleTurnId = turns.length === 1 ? turns[0].id : "";
  const topLevelItems = Array.isArray(detail.items) ? detail.items.map((item) => ({ ...item, turnId: item.turnId || singleTurnId || void 0 })) : [];
  const turnItems = turns.flatMap(
    (turn) => Array.isArray(turn.items) ? turn.items.map((item) => ({ ...item, turnId: item.turnId || turn.id })) : []
  );
  return [
    ...topLevelItems,
    ...turnItems
  ];
}
function isPathLikeDuplicate(left, right) {
  if (left.path === right.path) return true;
  if (left.relativePath && left.relativePath === right.relativePath) return true;
  if (node_path.isAbsolute(left.path) && node_path.isAbsolute(right.path)) return left.path === right.path;
  return false;
}
function extractGeneratedFiles(items, workspaceRoot, maxFiles) {
  const files = [];
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const file = generatedFileFromToolResult(items[index], workspaceRoot);
    if (!file) continue;
    if (files.some((existing) => isPathLikeDuplicate(existing, file))) continue;
    files.push(file);
    if (files.length >= maxFiles) break;
  }
  return files.reverse();
}
function latestGeneratedFiles(detail, options = {}) {
  const maxFiles = Math.max(1, Math.floor(options.maxFiles ?? 3));
  const workspaceRoot = options.workspaceRoot?.trim() ?? "";
  const items = threadItems$1(detail);
  const turnId = options.turnId?.trim();
  if (turnId) {
    const currentTurnFiles = extractGeneratedFiles(
      items.filter((item) => item.turnId === turnId),
      workspaceRoot,
      maxFiles
    );
    if (currentTurnFiles.length > 0) return currentTurnFiles;
  }
  return extractGeneratedFiles(items, workspaceRoot, maxFiles);
}
function shouldSendGeneratedFilesForPrompt(prompt) {
  const text = prompt.trim();
  if (!text) return false;
  return /发给我|发送给我|发一下|发来|发过来|传给我|传过来|上传|附件|以附件|发文件|文件发|文档发/i.test(text) || /\b(send|attach|attachment|upload)\b/i.test(text) || /给我(?:一个|一份)?.{0,24}(文档|文件|\.(?:md|txt|pdf|docx|xlsx|csv|pptx))/i.test(text);
}
function shouldDirectSendExistingGeneratedFilesForPrompt(prompt) {
  const text = prompt.trim();
  if (!text) return false;
  return /发给我|发送给我|发一下|发来|发过来|传给我|传过来|上传|附件|以附件|直接发|发文件|文件发|文档发/i.test(text) || /\b(send|attach|attachment|upload)\b/i.test(text);
}
function replyTextForGeneratedFiles(replyText, files) {
  const trimmed = replyText.trim();
  if (files.length === 0) return trimmed;
  const names = files.map((file) => file.fileName).join(", ");
  if (!trimmed || /(无法|不能|没办法).{0,20}(直接)?(通过)?(飞书|Lark|发送|发).{0,20}(文件|文档|附件)/i.test(trimmed)) {
    return `可以，我把 ${names} 作为附件发给你。`;
  }
  return trimmed;
}
function sleep$3(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function normalizeTaskModel$1(model) {
  const trimmed = model.trim();
  return trimmed || void 0;
}
function webhookUrl(settings) {
  return `http://127.0.0.1:${settings.claw.im.port}${settings.claw.im.path}`;
}
function asString$1(value) {
  return typeof value === "string" ? value.trim() : "";
}
function nestedRecord$1(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}
function extractIncomingPrompt(payload) {
  const candidates = [
    payload.text,
    payload.prompt,
    payload.message,
    nestedRecord$1(payload.message).text,
    nestedRecord$1(payload.event).text,
    nestedRecord$1(payload.data).text
  ];
  for (const candidate of candidates) {
    const text = asString$1(candidate);
    if (text) return text;
  }
  return "";
}
function extractSenderLabel(payload) {
  const candidates = [
    payload.sender,
    payload.user,
    payload.from,
    payload.conversationId,
    nestedRecord$1(payload.message).sender,
    nestedRecord$1(payload.event).sender,
    nestedRecord$1(payload.data).sender
  ];
  for (const candidate of candidates) {
    const text = asString$1(candidate);
    if (text) return text;
  }
  return "webhook";
}
function normalizeIncomingProvider(value, fallback) {
  const raw = asString$1(value).toLowerCase();
  if (raw === "weixin" || raw === "wechat") return "weixin";
  return raw === "feishu" ? "feishu" : fallback;
}
function extractIncomingProvider(payload, fallback) {
  const candidates = [
    payload.provider,
    payload.platform,
    payload.im,
    payload.source,
    nestedRecord$1(payload.message).provider,
    nestedRecord$1(payload.event).provider,
    nestedRecord$1(payload.data).provider
  ];
  for (const candidate of candidates) {
    const provider = normalizeIncomingProvider(candidate, fallback);
    if (provider !== fallback || asString$1(candidate).toLowerCase() === fallback) return provider;
  }
  return fallback;
}
function extractIncomingChannelId(payload) {
  const candidates = [
    payload.channelId,
    payload.channel_id,
    nestedRecord$1(payload.message).channelId,
    nestedRecord$1(payload.event).channelId,
    nestedRecord$1(payload.data).channelId
  ];
  for (const candidate of candidates) {
    const text = asString$1(candidate);
    if (text) return text;
  }
  return "";
}
function extractIncomingRemoteSession(payload) {
  const message = nestedRecord$1(payload.message);
  const event = nestedRecord$1(payload.event);
  const eventMessage = nestedRecord$1(event.message);
  const header = nestedRecord$1(event.header);
  const sender = nestedRecord$1(payload.sender);
  const eventSender = nestedRecord$1(event.sender);
  const chatId = asString$1(
    payload.chatId || payload.chat_id || payload.open_chat_id || message.chatId || message.chat_id || eventMessage.chat_id || eventMessage.chatId
  );
  const messageId = asString$1(
    payload.messageId || payload.message_id || message.messageId || message.message_id || eventMessage.message_id || eventMessage.messageId || header.message_id
  );
  if (!chatId || !messageId) return null;
  const threadId = asString$1(
    payload.threadId || payload.thread_id || message.threadId || message.thread_id || eventMessage.thread_id || eventMessage.threadId
  );
  const senderId = asString$1(
    payload.senderId || payload.sender_id || sender.id || sender.open_id || sender.user_id || eventSender.sender_id || eventSender.open_id || eventSender.user_id
  );
  const senderName = asString$1(
    payload.senderName || payload.sender_name || sender.name || eventSender.sender_name || eventSender.name
  );
  return { chatId, messageId, threadId, senderId, senderName };
}
function writeJson$2(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload)
  });
  res.end(payload);
}
async function readRequestBody$2(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > WEBHOOK_BODY_LIMIT_BYTES) {
      throw new Error("Request body is too large.");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}
const MAX_FEISHU_FILE_UPLOAD_BYTES = 50 * 1024 * 1024;
function hasFeishuPlatformCredential(channel) {
  return channel.platformCredential?.kind === "feishu" && !!channel.platformCredential.appId.trim() && !!channel.platformCredential.appSecret.trim();
}
function isMissingThreadResult(result) {
  if (result.ok) return false;
  const message = runtimeErrorMessage$1(result, "").toLowerCase();
  return result.status === 404 && message.includes("thread") && message.includes("not found");
}
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function isChineseLocale(settings) {
  return settings.locale.toLowerCase().startsWith("zh");
}
function currentImModel(settings, channel) {
  return channel?.model?.trim() || settings.claw.im.model.trim() || DEFAULT_CLAW_MODEL;
}
function imCommandHelpText(settings) {
  if (isChineseLocale(settings)) {
    return [
      "Claw IM 命令：",
      "- `/help`：查看命令帮助",
      "- `/new`：当前 IM 连接开启新话题",
      "- `/model`：查看当前模型",
      "- `/model auto|pro|flash`：切换当前 IM 连接模型",
      "也支持 `-new`、`-help`、`-model flash` 这种写法。"
    ].join("\n");
  }
  return [
    "Claw IM commands:",
    "- `/help`: show command help",
    "- `/new`: start a new topic for this IM connection",
    "- `/model`: show the current model",
    "- `/model auto|pro|flash`: switch this IM connection model",
    "`-new`, `-help`, and `-model flash` are supported too."
  ].join("\n");
}
function imModelCommandHint(settings) {
  const ids = CLAW_MODEL_IDS.join(", ");
  return isChineseLocale(settings) ? `可使用 /model auto、/model pro 或 /model flash。可用模型：${ids}。` : `Use /model auto, /model pro, or /model flash. Available models: ${ids}.`;
}
function imModelCurrentText(settings, model) {
  return isChineseLocale(settings) ? `当前 Claw IM 模型是 \`${model}\`。` : `Current Claw IM model: \`${model}\`.`;
}
function imModelChangedText(settings, model) {
  return isChineseLocale(settings) ? `Claw IM 模型已切换到 \`${model}\`。` : `Claw IM model switched to \`${model}\`.`;
}
function imNewTopicText(settings) {
  return isChineseLocale(settings) ? "新话题已开启。下一条消息会创建新的本地会话。" : "Started a new topic. The next message will create a fresh local conversation.";
}
class ClawRuntime {
  deps;
  server = null;
  serverKey = "";
  feishuChannels = /* @__PURE__ */ new Map();
  feishuChannelKeys = /* @__PURE__ */ new Map();
  feishuSyncVersion = 0;
  constructor(deps) {
    this.deps = deps;
  }
  sync(settings) {
    this.syncWebhook(settings);
    void this.syncFeishuChannels(settings);
  }
  stop() {
    this.closeWebhook();
    void this.closeAllFeishuChannels();
  }
  async status() {
    const settings = await this.deps.store.load();
    return {
      imServerRunning: this.server !== null && settings.claw.enabled && settings.claw.im.enabled,
      imUrl: webhookUrl(settings),
      runningTaskIds: []
    };
  }
  async runTask(_taskId) {
    return { ok: false, message: "Claw scheduled tasks have moved to Schedule." };
  }
  async runPrompt(settings, options) {
    const workspace = options.workspaceRoot.trim() || settings.workspaceRoot;
    const existingThreadId = options.threadId?.trim();
    const model = normalizeTaskModel$1(options.model) ?? (settings.agents.legalwork.model.trim() || DEFAULT_CLAW_MODEL);
    const createThread = async () => {
      const create = await this.deps.runtimeRequest(settings, "/v1/threads", {
        method: "POST",
        body: JSON.stringify({ workspace, model, mode: options.mode })
      });
      if (!create.ok) return null;
      return JSON.parse(create.body);
    };
    const patchThreadTitle = (thread2) => {
      if (!options.title.trim()) return;
      void this.deps.runtimeRequest(settings, `/v1/threads/${encodeURIComponent(thread2.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ title: options.title.trim() })
      });
    };
    let thread = existingThreadId ? { id: existingThreadId } : await createThread();
    if (!thread) return { ok: false, message: "Failed to create thread." };
    if (!existingThreadId) patchThreadTitle(thread);
    const runtimePrompt = buildClawRuntimePrompt(settings, options.prompt, { channel: options.channel });
    const displayText = options.displayText?.trim() || parseClawUserPromptForDisplay(options.prompt).text;
    const turnBody = {
      prompt: runtimePrompt,
      mode: options.mode
    };
    if (displayText && displayText !== runtimePrompt) turnBody.displayText = displayText;
    if (model) turnBody.model = model;
    let turn = await this.startRuntimeTurn(settings, thread.id, turnBody);
    if (!turn.ok && existingThreadId && isMissingThreadResult(turn)) {
      this.deps.logError("claw-runtime", "Configured IM thread was missing; creating a replacement thread.", {
        threadId: existingThreadId,
        channelId: options.channel?.id,
        source: options.source
      });
      thread = await createThread();
      if (!thread) return { ok: false, message: "Failed to create thread." };
      patchThreadTitle(thread);
      turn = await this.startRuntimeTurn(settings, thread.id, turnBody);
    }
    if (!turn.ok) return { ok: false, message: runtimeErrorMessage$1(turn, "Failed to start turn.") };
    const parsedTurn = parseJsonObject$1(turn.body);
    const turnId = asString$1(parsedTurn?.turnId) || asString$1(nestedRecord$1(parsedTurn?.turn).id);
    if (!turnId) {
      return { ok: false, message: "Failed to start turn: missing turn id." };
    }
    if (turnId && options.onTurnStarted) {
      await options.onTurnStarted({ threadId: thread.id, turnId });
    }
    if (!options.waitForResult) {
      return { ok: true, threadId: thread.id, turnId, message: "Started" };
    }
    const result = await this.waitForAssistantResult(settings, thread.id, turnId, options.responseTimeoutMs, workspace);
    return {
      ok: true,
      threadId: thread.id,
      turnId,
      text: result.text,
      message: result.text || "Completed",
      files: result.files
    };
  }
  startRuntimeTurn(settings, threadId, turnBody) {
    return this.deps.runtimeRequest(
      settings,
      `/v1/threads/${encodeURIComponent(threadId)}/turns`,
      { method: "POST", body: JSON.stringify(turnBody) }
    );
  }
  async waitForAssistantResult(settings, threadId, turnId, timeoutMs, workspaceRoot) {
    const deadline = Date.now() + timeoutMs;
    let lastText = "";
    let lastDetail = null;
    while (Date.now() < deadline) {
      await sleep$3(1500);
      const detailRes = await this.deps.runtimeRequest(
        settings,
        `/v1/threads/${encodeURIComponent(threadId)}`,
        { method: "GET" }
      );
      if (!detailRes.ok) {
        throw new Error(runtimeErrorMessage$1(detailRes, "Failed to read thread result."));
      }
      const detail = JSON.parse(detailRes.body);
      lastDetail = detail;
      lastText = latestAssistantText$1(detail, { turnId }) || lastText;
      const targetTurn = Array.isArray(detail.turns) ? detail.turns.find((turn) => turn.id === turnId) : void 0;
      if (!targetTurn) continue;
      if (isRunningStatus$1(targetTurn.status)) continue;
      if (targetTurn.status === "failed" || targetTurn.status === "aborted") {
        const error = targetTurn.error?.trim();
        throw new Error(error || `Agent turn ${targetTurn.status}.`);
      }
      if (targetTurn.status === "completed" && lastText) {
        return {
          text: lastText,
          files: latestGeneratedFiles(detail, { turnId, workspaceRoot })
        };
      }
    }
    if (lastText && lastDetail) {
      return {
        text: lastText,
        files: latestGeneratedFiles(lastDetail, { turnId, workspaceRoot })
      };
    }
    throw new Error("Timed out waiting for agent response.");
  }
  resolveChannelWorkspaceRoot(settings, channel) {
    return channel?.workspaceRoot.trim() || settings.claw.im.workspaceRoot.trim() || settings.workspaceRoot;
  }
  legacyEmptyBaseConversationWorkspaceRoot(session) {
    const key = sanitizePathSegment(session.threadId.trim() || session.chatId.trim(), "conversation");
    return `/conversations/${key}`;
  }
  resolveConversationWorkspaceRoot(settings, channel, session) {
    const base = this.resolveChannelWorkspaceRoot(settings, channel).trim();
    const key = sanitizePathSegment(session.threadId.trim() || session.chatId.trim(), "conversation");
    return base ? `${base.replace(/\/+$/, "")}/conversations/${key}` : "";
  }
  resolveIncomingWorkspaceRoot(settings, channel, conversation, remoteSession) {
    const storedConversationRoot = conversation?.workspaceRoot.trim() ?? "";
    if (storedConversationRoot && remoteSession) {
      const legacyEmptyBaseRoot = this.legacyEmptyBaseConversationWorkspaceRoot(remoteSession);
      if (storedConversationRoot !== legacyEmptyBaseRoot) return storedConversationRoot;
    } else if (storedConversationRoot) {
      return storedConversationRoot;
    }
    const conversationRoot = channel && remoteSession ? this.resolveConversationWorkspaceRoot(settings, channel, remoteSession) : "";
    return conversationRoot || this.resolveChannelWorkspaceRoot(settings, channel);
  }
  findChannelConversation(channel, session) {
    const targetKey = clawConversationKey(session.chatId, session.threadId);
    return channel.conversations.find(
      (conversation) => clawConversationKey(conversation.chatId, conversation.remoteThreadId) === targetKey
    );
  }
  async resetIncomingImThread(input) {
    if (!input.channel) return;
    const currentSettings = await this.deps.store.load();
    const currentChannel = currentSettings.claw.channels.find((item) => item.id === input.channel?.id);
    if (!currentChannel) return;
    const session = input.remoteSession;
    const currentConversation = session ? this.findChannelConversation(currentChannel, session) : input.conversation ? currentChannel.conversations.find((item) => item.id === input.conversation?.id) : void 0;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await this.deps.store.patch({
      claw: {
        channels: currentSettings.claw.channels.map((item) => {
          if (item.id !== currentChannel.id) return item;
          return {
            ...item,
            threadId: "",
            conversations: currentConversation ? item.conversations.map(
              (conversation) => conversation.id === currentConversation.id ? {
                ...conversation,
                latestMessageId: session?.messageId || conversation.latestMessageId,
                senderId: session?.senderId || conversation.senderId,
                senderName: session?.senderName || conversation.senderName,
                localThreadId: "",
                updatedAt: now
              } : conversation
            ) : item.conversations,
            updatedAt: now
          };
        })
      }
    });
  }
  async setIncomingImModel(channel, model) {
    if (!channel) {
      await this.deps.store.patch({ claw: { im: { model } } });
      return;
    }
    const currentSettings = await this.deps.store.load();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await this.deps.store.patch({
      claw: {
        channels: currentSettings.claw.channels.map(
          (item) => item.id === channel.id ? {
            ...item,
            model,
            updatedAt: now
          } : item
        )
      }
    });
  }
  async handleIncomingImCommand(settings, input) {
    const command = parseClawCommand(input.text);
    if (!command) return null;
    if (command.kind === "help") return imCommandHelpText(settings);
    if (command.kind === "showModel") return imModelCurrentText(settings, currentImModel(settings, input.channel));
    if (command.kind === "invalidModel") return imModelCommandHint(settings);
    if (command.kind === "model") {
      await this.setIncomingImModel(input.channel, command.model);
      return imModelChangedText(settings, command.model);
    }
    if (command.kind === "clear") {
      await this.resetIncomingImThread({
        channel: input.channel,
        conversation: input.conversation,
        remoteSession: input.remoteSession
      });
      return imNewTopicText(settings);
    }
    return null;
  }
  async processIncomingImPrompt(settings, input) {
    const { channel, conversation, prompt, provider, remoteSession, sender } = input;
    const initialThreadId = conversation?.localThreadId.trim() || channel?.threadId.trim() || "";
    const result = await this.runPrompt(settings, {
      prompt,
      title: channel ? `[Claw IM:${channel.label}] ${sender}` : `[Claw IM:${provider}] ${sender}`,
      workspaceRoot: this.resolveIncomingWorkspaceRoot(settings, channel, conversation, remoteSession),
      model: channel?.model ?? settings.claw.im.model,
      mode: settings.claw.im.mode,
      waitForResult: true,
      responseTimeoutMs: settings.claw.im.responseTimeoutMs,
      source: "im",
      threadId: initialThreadId || void 0,
      channel,
      onTurnStarted: async ({ threadId }) => {
        if (!channel) return;
        const now = (/* @__PURE__ */ new Date()).toISOString();
        if (remoteSession) {
          const existingConversation = conversation ?? this.findChannelConversation(channel, remoteSession);
          const nextConversation = existingConversation ? {
            ...existingConversation,
            latestMessageId: remoteSession.messageId,
            senderId: remoteSession.senderId,
            senderName: remoteSession.senderName,
            localThreadId: threadId,
            workspaceRoot: this.resolveIncomingWorkspaceRoot(settings, channel, existingConversation, remoteSession),
            updatedAt: now
          } : {
            id: node_crypto.randomUUID(),
            chatId: remoteSession.chatId,
            remoteThreadId: remoteSession.threadId,
            latestMessageId: remoteSession.messageId,
            senderId: remoteSession.senderId,
            senderName: remoteSession.senderName,
            localThreadId: threadId,
            workspaceRoot: this.resolveConversationWorkspaceRoot(settings, channel, remoteSession),
            createdAt: now,
            updatedAt: now
          };
          await this.deps.store.patch({
            claw: {
              channels: settings.claw.channels.map(
                (item) => item.id === channel.id ? {
                  ...item,
                  threadId,
                  conversations: existingConversation ? item.conversations.map((entry) => entry.id === existingConversation.id ? nextConversation : entry) : [...item.conversations, nextConversation],
                  updatedAt: now
                } : item
              )
            }
          });
        } else if (!initialThreadId) {
          await this.deps.store.patch({
            claw: {
              channels: settings.claw.channels.map(
                (item) => item.id === channel.id ? {
                  ...item,
                  threadId,
                  updatedAt: now
                } : item
              )
            }
          });
        }
        this.deps.notifyChannelActivity?.({ channelId: channel.id, threadId });
      }
    });
    return result;
  }
  resolveFeishuChannels(settings) {
    if (!settings.claw.enabled) return [];
    return settings.claw.channels.filter(
      (channel) => channel.enabled && channel.provider === "feishu" && hasFeishuPlatformCredential(channel)
    );
  }
  buildFeishuRemoteSession(message) {
    return {
      chatId: message.chatId.trim(),
      messageId: message.messageId.trim(),
      threadId: message.threadId?.trim() || "",
      senderId: message.senderId.trim(),
      senderName: feishuSenderLabel(message),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async rememberFeishuRemoteSession(settings, channel, message) {
    const nextRemoteSession = "chatType" in message ? this.buildFeishuRemoteSession(message) : {
      ...message,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const current = channel.remoteSession;
    if (current?.chatId === nextRemoteSession.chatId && current?.messageId === nextRemoteSession.messageId && current?.threadId === nextRemoteSession.threadId && current?.senderId === nextRemoteSession.senderId && current?.senderName === nextRemoteSession.senderName) {
      return;
    }
    await this.deps.store.patch({
      claw: {
        channels: settings.claw.channels.map(
          (item) => item.id === channel.id ? {
            ...item,
            remoteSession: nextRemoteSession,
            updatedAt: nextRemoteSession.updatedAt
          } : item
        )
      }
    });
  }
  async sendFeishuMessage(bridge, to, input, options, context) {
    try {
      return await bridge.send(to, input, options);
    } catch (error) {
      const initialMessage = errorMessage(error);
      if (!options.replyTo) {
        this.deps.logError("claw-feishu", "Failed to send Feishu / Lark message", {
          ...context,
          message: initialMessage,
          to
        });
        throw error;
      }
      this.deps.logError("claw-feishu", "Failed to send Feishu / Lark reply; falling back to plain chat message.", {
        ...context,
        message: initialMessage,
        replyTo: options.replyTo,
        replyInThread: options.replyInThread,
        to
      });
      try {
        return await bridge.send(to, input, {
          ...options,
          replyTo: void 0,
          replyInThread: void 0
        });
      } catch (fallbackError) {
        this.deps.logError("claw-feishu", "Failed to send Feishu / Lark fallback message", {
          ...context,
          initialMessage,
          message: errorMessage(fallbackError),
          to
        });
        throw fallbackError;
      }
    }
  }
  async resolveFeishuGeneratedFiles(files, workspaceRoot, context) {
    const root = workspaceRoot.trim();
    if (!root || files.length === 0) return [];
    let realRoot = "";
    try {
      realRoot = await promises.realpath(node_path.resolve(root));
    } catch (error) {
      this.deps.logError("claw-feishu", "Failed to resolve Feishu file workspace root", {
        ...context,
        workspaceRoot: root,
        message: errorMessage(error)
      });
      return [];
    }
    const resolvedFiles = [];
    const seen = /* @__PURE__ */ new Set();
    for (const file of files) {
      try {
        const realFile = await promises.realpath(node_path.resolve(file.path));
        const relativePath = node_path.relative(realRoot, realFile);
        if (relativePath.startsWith("..") || node_path.isAbsolute(relativePath)) {
          this.deps.logError("claw-feishu", "Skipping generated file outside the Feishu workspace", {
            ...context,
            filePath: file.path,
            workspaceRoot: root
          });
          continue;
        }
        if (seen.has(realFile)) continue;
        const fileStat = await promises.stat(realFile);
        if (!fileStat.isFile()) continue;
        if (fileStat.size > MAX_FEISHU_FILE_UPLOAD_BYTES) {
          this.deps.logError("claw-feishu", "Skipping generated file because it is too large for Feishu upload", {
            ...context,
            filePath: realFile,
            bytes: fileStat.size,
            maxBytes: MAX_FEISHU_FILE_UPLOAD_BYTES
          });
          continue;
        }
        seen.add(realFile);
        resolvedFiles.push({
          ...file,
          path: realFile,
          fileName: file.fileName || realFile.split(/[\\/]/).pop() || "attachment"
        });
      } catch (error) {
        this.deps.logError("claw-feishu", "Skipping generated file that cannot be read for Feishu upload", {
          ...context,
          filePath: file.path,
          message: errorMessage(error)
        });
      }
    }
    return resolvedFiles;
  }
  async sendFeishuGeneratedFiles(bridge, to, files, options, context) {
    const sent = [];
    const failed = [];
    for (const file of files) {
      try {
        await this.sendFeishuMessage(
          bridge,
          to,
          { file: { source: file.path, fileName: file.fileName } },
          options,
          {
            ...context,
            purpose: "agent-file",
            filePath: file.path,
            fileName: file.fileName
          }
        );
        sent.push(file);
      } catch (error) {
        const message = errorMessage(error);
        failed.push({ file, message });
        this.deps.logError("claw-feishu", "Failed to send Feishu / Lark file attachment", {
          ...context,
          filePath: file.path,
          fileName: file.fileName,
          message
        });
      }
    }
    return { sent, failed };
  }
  async recentGeneratedFilesForThread(settings, threadId, workspaceRoot, context) {
    const targetThreadId = threadId.trim();
    if (!targetThreadId) return [];
    try {
      const detailRes = await this.deps.runtimeRequest(
        settings,
        `/v1/threads/${encodeURIComponent(targetThreadId)}`,
        { method: "GET" }
      );
      if (!detailRes.ok) {
        this.deps.logError("claw-feishu", "Failed to read recent generated files from Legalwork thread", {
          ...context,
          threadId: targetThreadId,
          message: runtimeErrorMessage$1(detailRes, "Failed to read thread result.")
        });
        return [];
      }
      return latestGeneratedFiles(JSON.parse(detailRes.body), {
        workspaceRoot,
        maxFiles: 3
      });
    } catch (error) {
      this.deps.logError("claw-feishu", "Failed to inspect Legalwork thread for recent generated files", {
        ...context,
        threadId: targetThreadId,
        message: errorMessage(error)
      });
      return [];
    }
  }
  findImChannelForThread(settings, threadId) {
    const targetThreadId = threadId.trim();
    if (!targetThreadId) return null;
    for (const channel of settings.claw.channels) {
      if (!channel.enabled) continue;
      const conversation = [...channel.conversations].filter((item) => item.localThreadId.trim() === targetThreadId).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
      if (conversation) return { channel, conversation };
      if (channel.threadId.trim() === targetThreadId) return { channel };
    }
    return null;
  }
  async mirrorThreadMessageToWeixin(channel, conversation, threadId, text, direction) {
    const credential = channel.platformCredential;
    if (credential?.kind !== "weixin" || !credential.accountId.trim()) {
      return { ok: false, message: "No target WeChat account is available yet." };
    }
    const to = conversation?.chatId.trim() || channel.remoteSession?.chatId.trim() || "";
    if (!to) return { ok: false, message: "No target WeChat conversation is available yet." };
    if (!this.deps.sendWeixinBridgeMessage) {
      return { ok: false, message: "Built-in WeChat bridge is not initialized." };
    }
    const result = await this.deps.sendWeixinBridgeMessage({
      accountId: credential.accountId,
      to,
      text
    });
    if (result.ok) return { ok: true };
    this.deps.logError("claw-weixin", "Failed to mirror Claw message to WeChat", {
      message: result.message,
      threadId,
      direction,
      channelId: channel.id,
      to
    });
    return result;
  }
  async mirrorThreadMessageToIm(threadId, text, direction) {
    const trimmed = text.trim();
    if (!trimmed) return { ok: false, message: "Message is empty." };
    const settings = await this.deps.store.load();
    const target = this.findImChannelForThread(settings, threadId);
    if (!target) return { ok: false, message: "Channel not found." };
    if (target.channel.provider === "weixin") {
      return this.mirrorThreadMessageToWeixin(
        target.channel,
        target.conversation,
        threadId,
        trimmed,
        direction
      );
    }
    if (target.channel.provider !== "feishu") return { ok: false, message: "Unsupported IM provider." };
    const channel = target.channel;
    const conversation = target.conversation ?? [...channel.conversations].filter((item) => item.localThreadId.trim() === threadId.trim()).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
    if (!conversation?.chatId.trim()) {
      return { ok: false, message: "No target Feishu / Lark conversation is available yet." };
    }
    const bridge = this.feishuChannels.get(channel.id);
    if (!bridge) {
      return { ok: false, message: "Feishu / Lark bridge is not connected." };
    }
    try {
      await this.sendFeishuMessage(
        bridge,
        conversation.chatId,
        formatFeishuMirrorText(trimmed, direction),
        {},
        {
          purpose: "mirror",
          threadId,
          direction,
          channelId: channel.id,
          chatId: conversation.chatId
        }
      );
      return { ok: true };
    } catch (error) {
      const message = errorMessage(error);
      this.deps.logError("claw-feishu", "Failed to mirror Claw message to Feishu / Lark", {
        message,
        threadId,
        direction
      });
      return { ok: false, message };
    }
  }
  async mirrorThreadMessageToFeishu(threadId, text, direction) {
    return this.mirrorThreadMessageToIm(threadId, text, direction);
  }
  async handleFeishuMessage(channelId, message) {
    const bridge = this.feishuChannels.get(channelId);
    const settings = await this.deps.store.load();
    const channel = settings.claw.channels.find((item) => item.id === channelId && item.enabled);
    if (!bridge || !channel) return;
    if (bridge.botIdentity?.openId && message.senderId === bridge.botIdentity.openId) return;
    if (message.chatType === "group" && !message.mentionedBot && !message.mentionAll) return;
    await this.rememberFeishuRemoteSession(settings, channel, message);
    const remoteSession = this.buildFeishuRemoteSession(message);
    const conversation = this.findChannelConversation(channel, {
      chatId: remoteSession.chatId,
      threadId: remoteSession.threadId
    });
    const workspaceRoot = this.resolveIncomingWorkspaceRoot(settings, channel, conversation, remoteSession);
    const replyOptions = { replyTo: message.messageId, replyInThread: Boolean(message.threadId) };
    const commandReply = await this.handleIncomingImCommand(settings, {
      text: message.content,
      channel,
      conversation,
      remoteSession
    });
    if (commandReply !== null) {
      await this.sendFeishuMessage(
        bridge,
        message.chatId,
        { text: commandReply },
        replyOptions,
        {
          purpose: "im-command",
          channelId,
          chatId: message.chatId,
          inboundMessageId: message.messageId
        }
      );
      return;
    }
    const sender = feishuSenderLabel(message);
    const taskCreation = await this.deps.createScheduledTaskFromText?.(message.content, {
      workspaceRoot: this.resolveChannelWorkspaceRoot(settings, channel),
      modelHint: channel.model,
      mode: settings.claw.im.mode
    }) ?? { kind: "noop" };
    if (taskCreation.kind === "created") {
      await this.sendFeishuMessage(
        bridge,
        message.chatId,
        { text: taskCreation.confirmationText },
        { replyTo: message.messageId, replyInThread: Boolean(message.threadId) },
        {
          purpose: "schedule-created",
          channelId,
          chatId: message.chatId,
          inboundMessageId: message.messageId
        }
      );
      return;
    }
    if (taskCreation.kind === "error") {
      await this.sendFeishuMessage(
        bridge,
        message.chatId,
        { text: `Failed to create the scheduled task: ${taskCreation.message}` },
        { replyTo: message.messageId, replyInThread: Boolean(message.threadId) },
        {
          purpose: "schedule-error",
          channelId,
          chatId: message.chatId,
          inboundMessageId: message.messageId
        }
      );
      return;
    }
    if (!message.content.trim() && message.rawContentType !== "text") {
      try {
        await this.sendFeishuMessage(
          bridge,
          message.chatId,
          { text: "Only text messages are supported right now." },
          { replyTo: message.messageId, replyInThread: Boolean(message.threadId) },
          {
            purpose: "unsupported-message",
            channelId,
            chatId: message.chatId,
            inboundMessageId: message.messageId
          }
        );
      } catch (error) {
        this.deps.logError("claw-feishu", "Failed to send unsupported-message reply", {
          message: errorMessage(error),
          chatId: message.chatId
        });
      }
      return;
    }
    if (shouldDirectSendExistingGeneratedFilesForPrompt(message.content)) {
      const existingThreadId = conversation?.localThreadId.trim() || channel.threadId.trim();
      const existingFiles = await this.resolveFeishuGeneratedFiles(
        await this.recentGeneratedFilesForThread(settings, existingThreadId, workspaceRoot, {
          purpose: "direct-existing-file-lookup",
          channelId,
          chatId: message.chatId,
          inboundMessageId: message.messageId,
          threadId: existingThreadId
        }),
        workspaceRoot,
        {
          purpose: "direct-existing-file-resolve",
          channelId,
          chatId: message.chatId,
          inboundMessageId: message.messageId,
          threadId: existingThreadId
        }
      );
      if (existingFiles.length > 0) {
        try {
          await this.sendFeishuMessage(
            bridge,
            message.chatId,
            { text: replyTextForGeneratedFiles("", existingFiles) },
            replyOptions,
            {
              purpose: "direct-existing-file-reply",
              channelId,
              chatId: message.chatId,
              inboundMessageId: message.messageId,
              threadId: existingThreadId
            }
          );
        } catch (error) {
          this.deps.logError("claw-feishu", "Failed to send direct file confirmation reply", {
            message: errorMessage(error),
            chatId: message.chatId,
            threadId: existingThreadId
          });
        }
        const delivery = await this.sendFeishuGeneratedFiles(
          bridge,
          message.chatId,
          existingFiles,
          replyOptions,
          {
            channelId,
            chatId: message.chatId,
            inboundMessageId: message.messageId,
            threadId: existingThreadId
          }
        );
        if (delivery.sent.length > 0) return;
        const failure = delivery.failed[0]?.message || "unknown upload error";
        await this.sendFeishuMessage(
          bridge,
          message.chatId,
          { text: `我找到了文件 ${existingFiles.map((file) => file.fileName).join(", ")}，但飞书附件上传失败：${failure}` },
          replyOptions,
          {
            purpose: "direct-existing-file-failed",
            channelId,
            chatId: message.chatId,
            inboundMessageId: message.messageId,
            threadId: existingThreadId
          }
        ).catch((error) => {
          this.deps.logError("claw-feishu", "Failed to send direct file failure reply", {
            message: errorMessage(error),
            chatId: message.chatId,
            threadId: existingThreadId
          });
        });
        return;
      }
    }
    let result;
    try {
      result = await this.processIncomingImPrompt(settings, {
        prompt: buildFeishuPrompt(message),
        sender,
        provider: "feishu",
        channel,
        conversation,
        remoteSession
      });
    } catch (error) {
      this.deps.logError("claw-feishu", "Failed to handle Feishu inbound message", {
        message: errorMessage(error),
        chatId: message.chatId,
        senderId: message.senderId
      });
      try {
        await this.sendFeishuMessage(
          bridge,
          message.chatId,
          { text: "Sorry, I could not process your message right now." },
          { replyTo: message.messageId, replyInThread: Boolean(message.threadId) },
          {
            purpose: "processing-error",
            channelId,
            chatId: message.chatId,
            inboundMessageId: message.messageId
          }
        );
      } catch {
      }
      return;
    }
    const filesToSend = result.ok && shouldSendGeneratedFilesForPrompt(message.content) ? await this.resolveFeishuGeneratedFiles(result.files ?? [], workspaceRoot, {
      purpose: "agent-file-resolve",
      channelId,
      chatId: message.chatId,
      inboundMessageId: message.messageId,
      threadId: result.threadId,
      turnId: result.turnId
    }) : [];
    const replyText = result.ok ? replyTextForGeneratedFiles(result.text?.trim() || result.message?.trim() || "Completed.", filesToSend) : result.message.trim() || "Sorry, something went wrong while handling your message.";
    const resultThreadId = result.ok ? result.threadId : void 0;
    const resultTurnId = result.ok ? result.turnId : void 0;
    try {
      await this.sendFeishuMessage(
        bridge,
        message.chatId,
        { text: replyText },
        replyOptions,
        {
          purpose: "agent-reply",
          channelId,
          chatId: message.chatId,
          inboundMessageId: message.messageId,
          runtimeOk: result.ok,
          threadId: resultThreadId,
          turnId: resultTurnId
        }
      );
    } catch (error) {
      this.deps.logError("claw-feishu", "Failed to send Feishu / Lark agent reply", {
        message: errorMessage(error),
        chatId: message.chatId,
        senderId: message.senderId,
        threadId: resultThreadId,
        turnId: resultTurnId
      });
    }
    if (filesToSend.length > 0) {
      const delivery = await this.sendFeishuGeneratedFiles(
        bridge,
        message.chatId,
        filesToSend,
        replyOptions,
        {
          channelId,
          chatId: message.chatId,
          inboundMessageId: message.messageId,
          threadId: resultThreadId,
          turnId: resultTurnId
        }
      );
      if (delivery.sent.length === 0 && delivery.failed.length > 0) {
        await this.sendFeishuMessage(
          bridge,
          message.chatId,
          { text: `我找到了文件 ${filesToSend.map((file) => file.fileName).join(", ")}，但飞书附件上传失败：${delivery.failed[0]?.message || "unknown upload error"}` },
          replyOptions,
          {
            purpose: "agent-file-failed",
            channelId,
            chatId: message.chatId,
            inboundMessageId: message.messageId,
            threadId: resultThreadId,
            turnId: resultTurnId
          }
        ).catch((error) => {
          this.deps.logError("claw-feishu", "Failed to send Feishu / Lark file failure reply", {
            message: errorMessage(error),
            chatId: message.chatId,
            senderId: message.senderId,
            threadId: resultThreadId,
            turnId: resultTurnId
          });
        });
      }
    }
  }
  async syncFeishuChannels(settings) {
    const version = ++this.feishuSyncVersion;
    const targets = this.resolveFeishuChannels(settings);
    const targetMap = new Map(targets.map((channel) => [channel.id, channel]));
    await Promise.all(
      [...this.feishuChannels.keys()].filter((channelId) => !targetMap.has(channelId)).map((channelId) => this.closeFeishuChannel(channelId))
    );
    if (version !== this.feishuSyncVersion) return;
    for (const target of targets) {
      const appId = target.platformCredential.appId.trim();
      const appSecret = target.platformCredential.appSecret.trim();
      const domain = target.platformCredential.domain.trim().toLowerCase() === "lark" ? "lark" : "feishu";
      const allowedFileDirs = [
        this.resolveChannelWorkspaceRoot(settings, target),
        settings.claw.im.workspaceRoot,
        settings.workspaceRoot
      ].map((entry) => entry.trim()).filter((entry, index, entries) => entry && entries.indexOf(entry) === index);
      const nextKey = `${target.id}|${appId}|${appSecret}|${domain}|${allowedFileDirs.join("|")}`;
      const currentKey = this.feishuChannelKeys.get(target.id);
      if (this.feishuChannels.has(target.id) && currentKey === nextKey) continue;
      if (this.feishuChannels.has(target.id)) {
        await this.closeFeishuChannel(target.id);
        if (version !== this.feishuSyncVersion) return;
      }
      try {
        const bridge = nodeSdk.createLarkChannel({
          appId,
          appSecret,
          domain: domain === "lark" ? nodeSdk.Domain.Lark : nodeSdk.Domain.Feishu,
          loggerLevel: nodeSdk.LoggerLevel.warn,
          source: "legalwork",
          transport: "websocket",
          policy: {
            dmMode: "open",
            requireMention: true,
            respondToMentionAll: true
          },
          ...allowedFileDirs.length > 0 ? { outbound: { allowedFileDirs } } : {}
        });
        bridge.on("message", async (message) => {
          await this.handleFeishuMessage(target.id, message);
        });
        bridge.on("error", (error) => {
          this.deps.logError("claw-feishu", "Feishu channel error", {
            message: error.message,
            code: error.code,
            channelId: target.id
          });
        });
        bridge.on("reject", (event) => {
          this.deps.logError("claw-feishu", "Feishu message rejected by channel policy", {
            ...event,
            channelId: target.id
          });
        });
        bridge.on("reconnecting", () => {
          this.deps.logError("claw-feishu", "Feishu channel reconnecting", {
            channelId: target.id
          });
        });
        bridge.on("reconnected", () => {
          this.deps.logError("claw-feishu", "Feishu channel reconnected", {
            channelId: target.id
          });
        });
        await bridge.connect();
        if (version !== this.feishuSyncVersion) {
          await bridge.disconnect().catch(() => void 0);
          return;
        }
        this.feishuChannels.set(target.id, bridge);
        this.feishuChannelKeys.set(target.id, nextKey);
      } catch (error) {
        this.deps.logError("claw-feishu", "Failed to start Feishu channel bridge", {
          message: error instanceof Error ? error.message : String(error),
          channelId: target.id
        });
      }
    }
  }
  async closeFeishuChannel(channelId) {
    const bridge = this.feishuChannels.get(channelId);
    if (!bridge) return;
    this.feishuChannels.delete(channelId);
    this.feishuChannelKeys.delete(channelId);
    await bridge.disconnect().catch((error) => {
      this.deps.logError("claw-feishu", "Failed to stop Feishu channel bridge", {
        message: error instanceof Error ? error.message : String(error),
        channelId
      });
    });
  }
  async closeAllFeishuChannels() {
    const ids = [...this.feishuChannels.keys()];
    await Promise.all(ids.map((channelId) => this.closeFeishuChannel(channelId)));
  }
  syncWebhook(settings) {
    const im = settings.claw.im;
    const key = `${im.port}|${im.path}`;
    if (this.server && this.serverKey === key) return;
    this.closeWebhook();
    const server2 = node_http.createServer((req, res) => {
      void this.handleWebhook(req, res);
    });
    server2.on("error", (error) => {
      this.deps.logError("claw-webhook", "Claw IM webhook server failed", {
        message: error instanceof Error ? error.message : String(error)
      });
      if (this.server === server2) {
        this.closeWebhook();
      }
    });
    server2.listen(im.port, "127.0.0.1");
    this.server = server2;
    this.serverKey = key;
  }
  closeWebhook() {
    if (!this.server) return;
    const server2 = this.server;
    this.server = null;
    this.serverKey = "";
    server2.close();
  }
  async handleWebhook(req, res) {
    try {
      const settings = await this.deps.store.load();
      const im = settings.claw.im;
      const url = new node_url.URL(req.url ?? "/", "http://127.0.0.1");
      if (url.pathname === "/claw/internal/gui-plan/create" && req.method === "POST") {
        writeJson$2(res, 410, {
          ok: false,
          code: "gui_plan_create_retired",
          message: "The /claw/internal/gui-plan/create endpoint is no longer active. Use the Legalwork create_plan tool."
        });
        return;
      }
      if (req.method !== "POST" || url.pathname !== im.path) {
        writeJson$2(res, 404, { ok: false, message: "Not found." });
        return;
      }
      if (!settings.claw.enabled || !im.enabled) {
        writeJson$2(res, 503, { ok: false, message: "Claw IM webhook is disabled." });
        return;
      }
      if (im.secret) {
        const auth = req.headers.authorization ?? "";
        const legalworkHeaderSecret = Array.isArray(req.headers["x-legalwork-secret"]) ? req.headers["x-legalwork-secret"][0] : req.headers["x-legalwork-secret"];
        const legacyHeaderSecret = Array.isArray(req.headers["x-legalwork-secret"]) ? req.headers["x-legalwork-secret"][0] : req.headers["x-legalwork-secret"];
        const headerSecret = legalworkHeaderSecret ?? legacyHeaderSecret;
        if (auth !== `Bearer ${im.secret}` && headerSecret !== im.secret) {
          writeJson$2(res, 401, { ok: false, message: "Unauthorized." });
          return;
        }
      }
      const body = await readRequestBody$2(req);
      const payload = parseJsonObject$1(body);
      if (!payload) {
        writeJson$2(res, 400, { ok: false, message: "Expected a JSON object." });
        return;
      }
      const prompt = extractIncomingPrompt(payload);
      if (!prompt) {
        writeJson$2(res, 400, { ok: false, message: "No message text found." });
        return;
      }
      const sender = extractSenderLabel(payload);
      const provider = extractIncomingProvider(payload, im.provider);
      const incomingChannelId = extractIncomingChannelId(payload);
      const channel = incomingChannelId ? settings.claw.channels.find(
        (item) => item.enabled && item.id === incomingChannelId
      ) ?? settings.claw.channels.find(
        (item) => item.enabled && item.provider === provider
      ) : settings.claw.channels.find(
        (item) => item.enabled && item.provider === provider
      );
      const remoteSession = extractIncomingRemoteSession(payload);
      if (provider === "feishu" && channel) {
        if (remoteSession) {
          await this.rememberFeishuRemoteSession(settings, channel, remoteSession);
        }
      }
      const conversation = channel && remoteSession ? this.findChannelConversation(channel, {
        chatId: remoteSession.chatId,
        threadId: remoteSession.threadId
      }) : void 0;
      const commandReply = await this.handleIncomingImCommand(settings, {
        text: prompt,
        channel,
        conversation,
        remoteSession: remoteSession ?? void 0
      });
      if (commandReply !== null) {
        writeJson$2(res, 200, { ok: true, reply: commandReply });
        return;
      }
      const taskCreation = await this.deps.createScheduledTaskFromText?.(prompt, {
        workspaceRoot: this.resolveChannelWorkspaceRoot(settings, channel),
        modelHint: channel?.model ?? im.model,
        mode: im.mode
      }) ?? { kind: "noop" };
      if (taskCreation.kind === "created") {
        writeJson$2(res, 200, { ok: true, createdTaskId: taskCreation.taskId, reply: taskCreation.confirmationText });
        return;
      }
      if (taskCreation.kind === "error") {
        writeJson$2(res, 500, { ok: false, message: taskCreation.message });
        return;
      }
      const result = await this.processIncomingImPrompt(settings, {
        prompt,
        sender,
        provider,
        channel,
        conversation,
        remoteSession: remoteSession ?? void 0
      });
      writeJson$2(res, result.ok ? 200 : 500, result.ok ? { ...result, reply: result.text ?? "" } : result);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.deps.logError("claw-webhook", "Claw IM webhook request failed", { message });
      writeJson$2(res, 500, { ok: false, message });
    }
  }
}
function createClawRuntime(deps) {
  return new ClawRuntime(deps);
}
const SCHEDULED_TASK_CANDIDATE_RE = /(?:提醒|定时|闹钟|通知|叫我|叫醒|稍后|之后|到点|分钟后|小时后|秒后|天后|明天|后天|今晚|later|remind|reminder|alarm|timer|schedule|scheduled|tomorrow|tonight|in\s+\d+\s+(?:seconds?|minutes?|hours?|days?|weeks?))/iu;
const ISO_WITH_TIMEZONE_RE = /(?:[zZ]|[+-]\d{2}:\d{2})$/u;
const DETECTOR_TIMEOUT_MS = 12e3;
function normalizeReminderBody(value) {
  return value.trim().replace(/^[,，:：\s]+/u, "").replace(/[。！？!?~～\s]+$/u, "").replace(/^(?:一下|一声|一下子)\s*/u, "").trim();
}
function normalizeReminderName(value) {
  const normalized = value.replace(/[。！？!?]/gu, " ").replace(/\s+/g, " ").trim();
  if (!normalized) return "Reminder";
  const compact = normalized.length > 20 ? normalized.slice(0, 20).trim() : normalized;
  return /(?:提醒|reminder)$/iu.test(compact) ? compact : `${compact} reminder`;
}
function buildTaskPrompt(body) {
  if (!body) return "⏰ Reminder";
  if (body.startsWith("⏰")) return body;
  if (/^提醒[:：]?/u.test(body)) return `⏰ ${body}`;
  if (/^remind(?:er)?[:：]?\s*/iu.test(body)) return `⏰ ${body}`;
  return `⏰ Reminder: ${body}`;
}
function formatRelativeDelayLabel(now, runAt) {
  const diffMs = Math.max(0, runAt.getTime() - now.getTime());
  const minuteMs = 6e4;
  const hourMs = 36e5;
  const dayMs = 864e5;
  if (diffMs < minuteMs) {
    const seconds = Math.max(1, Math.round(diffMs / 1e3));
    return `${seconds}s later`;
  }
  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.round(diffMs / minuteMs));
    return `${minutes}min later`;
  }
  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.round(diffMs / hourMs));
    return `${hours}h later`;
  }
  const days = Math.max(1, Math.round(diffMs / dayMs));
  return `${days}d later`;
}
function formatConfirmationText(scheduleAt, runAt, body, now) {
  const delayLabel = formatRelativeDelayLabel(now, runAt);
  const localText = runAt.toLocaleString();
  return `Scheduled. I will handle "${body}" at ${localText} (${delayLabel}).`;
}
function extractFirstJsonObject(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/iu);
  const candidate = fencedMatch?.[1]?.trim() || trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return candidate.slice(start, end + 1);
}
function parseDetectionPayload(raw) {
  const json = extractFirstJsonObject(raw);
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function normalizeDetectedRequest(payload, sourceText, now = /* @__PURE__ */ new Date()) {
  if (!payload?.shouldCreateTask) return null;
  const scheduleAt = typeof payload.scheduleAt === "string" ? payload.scheduleAt.trim() : "";
  if (!scheduleAt || !ISO_WITH_TIMEZONE_RE.test(scheduleAt)) return null;
  const runAt = new Date(scheduleAt);
  if (!Number.isFinite(runAt.getTime()) || runAt.getTime() <= now.getTime()) return null;
  const reminderBody = normalizeReminderBody(typeof payload.reminderBody === "string" ? payload.reminderBody : "");
  if (!reminderBody) return null;
  const taskName = typeof payload.taskName === "string" && payload.taskName.trim() ? normalizeReminderName(payload.taskName) : normalizeReminderName(reminderBody);
  return {
    kind: "create",
    sourceText,
    reminderBody,
    runAt,
    scheduleAt,
    taskName,
    taskPrompt: buildTaskPrompt(reminderBody),
    confirmationText: formatConfirmationText(scheduleAt, runAt, reminderBody, now)
  };
}
function buildChatCompletionsUrl(baseUrl) {
  const normalized = baseUrl.replace(/\/+$/, "");
  if (!normalized) return "/v1/chat/completions";
  if (normalized.endsWith("/chat/completions")) return normalized;
  if (normalized.endsWith("/v1")) return `${normalized}/chat/completions`;
  if (normalized.endsWith("/beta")) {
    return `${normalized.slice(0, -5)}/v1/chat/completions`;
  }
  return `${normalized}/v1/chat/completions`;
}
function buildDetectionPrompt(now) {
  return [
    "You are a structured extractor for one-shot reminder requests.",
    `Current local datetime: ${now.toISOString()}.`,
    "Return JSON only. No markdown. No prose.",
    "Decide whether the user is explicitly asking to create a one-time scheduled reminder or delayed task.",
    'If yes, return: {"shouldCreateTask":true,"scheduleAt":"ISO8601 with explicit timezone offset","reminderBody":"short reminder content","taskName":"short task name"}',
    'If no, return: {"shouldCreateTask":false}',
    "Rules:",
    "- Only return true when the user explicitly wants a future one-shot reminder/task.",
    "- `scheduleAt` must be a future absolute timestamp with timezone offset.",
    "- `reminderBody` should be concise and describe what should happen at that time.",
    "- If the time is ambiguous, missing, or recurring, return false."
  ].join("\n\n");
}
function detectionModel(model) {
  const trimmed = model.trim();
  return trimmed && trimmed !== DEFAULT_SCHEDULE_MODEL ? trimmed : "deepseek-v4-flash";
}
function looksLikeClawScheduledTaskCandidate(text) {
  return SCHEDULED_TASK_CANDIDATE_RE.test(text.trim());
}
async function detectClawScheduledTaskRequest(settings, sourceText, modelHint, now = /* @__PURE__ */ new Date()) {
  if (!looksLikeClawScheduledTaskCandidate(sourceText)) return null;
  const runtime = resolveLegalworkRuntimeSettings(settings);
  const apiKey = runtime.apiKey.trim();
  if (!apiKey) return null;
  const response = await fetch(buildChatCompletionsUrl(runtime.baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: detectionModel(modelHint),
      messages: [
        { role: "system", content: buildDetectionPrompt(now) },
        { role: "user", content: sourceText }
      ],
      max_tokens: 300
    }),
    signal: AbortSignal.timeout(DETECTOR_TIMEOUT_MS)
  });
  const text = await response.text();
  if (!response.ok) return null;
  let content = "";
  try {
    const parsed = JSON.parse(text);
    content = parsed.choices?.[0]?.message?.content?.trim() ?? "";
  } catch {
    return null;
  }
  return normalizeDetectedRequest(parseDetectionPayload(content), sourceText, now);
}
function buildScheduledTaskFromDetectedRequest(options) {
  const now = options.now ?? (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: options.id,
    title: options.request.taskName,
    enabled: true,
    prompt: options.request.taskPrompt,
    workspaceRoot: options.workspaceRoot.trim(),
    model: options.model.trim() || DEFAULT_SCHEDULE_MODEL,
    reasoningEffort: DEFAULT_SCHEDULE_REASONING_EFFORT,
    mode: options.mode,
    schedule: {
      kind: "at",
      everyMinutes: 60,
      timeOfDay: "09:00",
      atTime: options.request.scheduleAt
    },
    createdAt: now,
    updatedAt: now,
    lastRunAt: "",
    nextRunAt: options.request.scheduleAt,
    lastStatus: "idle",
    lastMessage: "",
    lastThreadId: ""
  };
}
const SCHEDULER_INTERVAL_MS = 3e4;
const INTERNAL_BODY_LIMIT_BYTES = 1e6;
const TASK_RESPONSE_TIMEOUT_MS = 30 * 6e4;
function parseJsonObject(raw) {
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function runtimeErrorMessage(result, fallback) {
  const parsed = parseJsonObject(result.body);
  if (parsed) {
    const message = parsed.message;
    if (typeof message === "string" && message.trim()) return message.trim();
    const error = parsed.error;
    if (typeof error === "string" && error.trim()) return error.trim();
    if (typeof error === "object" && error !== null) {
      const nested = error.message;
      if (typeof nested === "string" && nested.trim()) return nested.trim();
    }
  }
  return result.body.trim() || fallback;
}
function isRunningStatus(status) {
  return status === "queued" || status === "in_progress" || status === "started" || status === "running";
}
function latestAssistantText(detail, options = {}) {
  const turnId = options.turnId?.trim();
  const items = turnId ? threadItems(detail).filter((item) => item.turnId === turnId) : threadItems(detail);
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    if (item.kind !== "assistant_text" && item.kind !== "agent_message") continue;
    const text = (item.text ?? item.detail ?? item.summary ?? "").trim();
    if (text) return text;
  }
  return "";
}
function threadItems(detail) {
  const turns = Array.isArray(detail.turns) ? detail.turns : [];
  const singleTurnId = turns.length === 1 ? turns[0].id : "";
  const topLevelItems = Array.isArray(detail.items) ? detail.items.map((item) => ({ ...item, turnId: item.turnId || singleTurnId || void 0 })) : [];
  const turnItems = turns.flatMap(
    (turn) => Array.isArray(turn.items) ? turn.items.map((item) => ({ ...item, turnId: item.turnId || turn.id })) : []
  );
  return [...topLevelItems, ...turnItems];
}
function sleep$2(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function normalizeTaskModel(model) {
  const trimmed = model.trim();
  return trimmed || void 0;
}
function summarizeTaskResult(text) {
  const trimmed = text.trim();
  if (!trimmed) return "Completed";
  return trimmed.length > 1e3 ? `${trimmed.slice(0, 1e3)}...` : trimmed;
}
function computeScheduleNextRunAt(task, from) {
  if (!task.enabled || task.schedule.kind === "manual") return "";
  if (task.schedule.kind === "at") {
    return task.schedule.atTime.trim();
  }
  if (task.schedule.kind === "interval") {
    return new Date(from.getTime() + task.schedule.everyMinutes * 6e4).toISOString();
  }
  const [hourRaw, minuteRaw] = task.schedule.timeOfDay.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const next = new Date(from);
  next.setSeconds(0, 0);
  next.setHours(Number.isFinite(hour) ? hour : 9, Number.isFinite(minute) ? minute : 0, 0, 0);
  if (next.getTime() <= from.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.toISOString();
}
function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function nestedRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}
function writeJson$1(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload)
  });
  res.end(payload);
}
async function readRequestBody$1(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > INTERNAL_BODY_LIMIT_BYTES) {
      throw new Error("Request body is too large.");
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}
function internalUrl(settings) {
  return `http://127.0.0.1:${settings.schedule.internal.port}`;
}
function hasEnabledScheduledTask(settings) {
  return settings.schedule.tasks.some((task) => task.enabled && task.schedule.kind !== "manual");
}
function scheduledThreadTitle(title) {
  const trimmed = title.trim();
  const prefix = "[Scheduled task]";
  const suffix = Array.from(trimmed).slice(0, 4).join("");
  return suffix ? `${prefix} ${suffix}` : prefix;
}
class ScheduleRuntime {
  deps;
  scheduler = null;
  server = null;
  serverKey = "";
  runningTaskIds = /* @__PURE__ */ new Set();
  powerSaveBlockerId = null;
  constructor(deps) {
    this.deps = deps;
  }
  sync(settings) {
    this.syncInternalServer(settings);
    this.startScheduler();
    this.syncPowerSaveBlocker(settings);
    void this.ensureNextRuns(settings);
  }
  stop() {
    if (this.scheduler) {
      clearInterval(this.scheduler);
      this.scheduler = null;
    }
    this.closeInternalServer();
    this.stopPowerSaveBlocker();
  }
  async status() {
    const settings = await this.deps.store.load();
    return {
      internalServerRunning: this.server !== null,
      internalUrl: internalUrl(settings),
      runningTaskIds: [...this.runningTaskIds],
      powerSaveBlockerActive: this.isPowerSaveBlockerActive()
    };
  }
  async runTask(taskId) {
    const settings = await this.deps.store.load();
    const task = settings.schedule.tasks.find((item) => item.id === taskId);
    if (!task) return { ok: false, message: "Task not found." };
    return this.runTaskInternal(task, false);
  }
  async createScheduledTaskFromText(text, options = {}) {
    const settings = await this.deps.store.load();
    try {
      const request = await detectClawScheduledTaskRequest(
        settings,
        text,
        options.modelHint?.trim() || settings.schedule.model || DEFAULT_SCHEDULE_MODEL
      );
      if (!request) return { kind: "noop" };
      const task = buildScheduledTaskFromDetectedRequest({
        request,
        workspaceRoot: options.workspaceRoot?.trim() || this.resolveDefaultWorkspaceRoot(settings),
        model: options.modelHint?.trim() || settings.schedule.model || DEFAULT_SCHEDULE_MODEL,
        mode: options.mode ?? settings.schedule.mode,
        id: node_crypto.randomUUID()
      });
      const saved = await this.deps.store.patch({
        schedule: {
          enabled: true,
          tasks: [...settings.schedule.tasks, task]
        }
      });
      this.sync(saved);
      return {
        kind: "created",
        taskId: task.id,
        title: task.title,
        scheduleAt: request.scheduleAt,
        confirmationText: request.confirmationText
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.deps.logError("schedule-task", "Failed to create scheduled task from text", { message, text });
      return { kind: "error", message };
    }
  }
  async listTasks() {
    const settings = await this.deps.store.load();
    return settings.schedule.tasks;
  }
  async createTask(task) {
    const settings = await this.deps.store.load();
    const saved = await this.deps.store.patch({
      schedule: {
        enabled: true,
        tasks: [...settings.schedule.tasks, task]
      }
    });
    this.sync(saved);
    return saved.schedule.tasks.find((item) => item.id === task.id) ?? task;
  }
  async createTaskFromInput(input) {
    const settings = await this.deps.store.load();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const task = {
      id: node_crypto.randomUUID(),
      title: input.title.trim() || "New scheduled task",
      enabled: input.enabled !== false,
      prompt: input.prompt,
      workspaceRoot: input.workspaceRoot?.trim() || this.resolveDefaultWorkspaceRoot(settings),
      model: input.model?.trim() || settings.schedule.model || DEFAULT_SCHEDULE_MODEL,
      reasoningEffort: normalizeScheduleReasoningEffort(input.reasoningEffort),
      mode: input.mode ?? settings.schedule.mode,
      schedule: {
        kind: input.schedule.kind,
        everyMinutes: typeof input.schedule.everyMinutes === "number" ? input.schedule.everyMinutes : 60,
        timeOfDay: input.schedule.timeOfDay?.trim() || "09:00",
        atTime: input.schedule.atTime?.trim() || ""
      },
      createdAt: now,
      updatedAt: now,
      lastRunAt: "",
      nextRunAt: "",
      lastStatus: "idle",
      lastMessage: "",
      lastThreadId: ""
    };
    const saved = await this.createTask(task);
    await this.ensureNextRuns(await this.deps.store.load());
    return saved;
  }
  async updateTaskById(taskId, patch) {
    const settings = await this.deps.store.load();
    const task = settings.schedule.tasks.find((item) => item.id === taskId);
    if (!task) return null;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const shouldRecomputeNextRun = Object.prototype.hasOwnProperty.call(patch, "enabled") || patch.schedule !== void 0;
    const nextTask = {
      ...task,
      ...patch,
      schedule: patch.schedule ? { ...task.schedule, ...patch.schedule } : task.schedule,
      ...shouldRecomputeNextRun ? { nextRunAt: "" } : {},
      updatedAt: now
    };
    const saved = await this.deps.store.patch({
      schedule: {
        tasks: settings.schedule.tasks.map((item) => item.id === taskId ? nextTask : item)
      }
    });
    this.sync(saved);
    return saved.schedule.tasks.find((item) => item.id === taskId) ?? nextTask;
  }
  async deleteTaskById(taskId) {
    const settings = await this.deps.store.load();
    if (!settings.schedule.tasks.some((item) => item.id === taskId)) return false;
    const saved = await this.deps.store.patch({
      schedule: {
        tasks: settings.schedule.tasks.filter((item) => item.id !== taskId)
      }
    });
    this.sync(saved);
    return saved.schedule.tasks.every((item) => item.id !== taskId);
  }
  startScheduler() {
    if (this.scheduler) return;
    this.scheduler = setInterval(() => {
      void this.tick();
    }, SCHEDULER_INTERVAL_MS);
    this.scheduler.unref?.();
    void this.tick();
  }
  async tick() {
    const settings = await this.deps.store.load();
    if (!settings.schedule.enabled) return;
    await this.ensureNextRuns(settings);
    const fresh = await this.deps.store.load();
    const now = Date.now();
    for (const task of fresh.schedule.tasks) {
      if (!task.enabled || task.schedule.kind === "manual") continue;
      if (this.runningTaskIds.has(task.id)) continue;
      const dueAt = Date.parse(task.nextRunAt);
      if (!Number.isFinite(dueAt) || dueAt > now) continue;
      void this.runTaskInternal(task, true);
    }
  }
  async ensureNextRuns(settings) {
    if (!settings.schedule.enabled) {
      this.syncPowerSaveBlocker(settings);
      return;
    }
    let changed = false;
    const now = /* @__PURE__ */ new Date();
    const tasks = settings.schedule.tasks.map((task) => {
      const wasInterrupted = task.lastStatus === "running" && !this.runningTaskIds.has(task.id);
      if (!task.enabled || task.schedule.kind === "manual" || this.runningTaskIds.has(task.id)) {
        if (!wasInterrupted) return task;
        changed = true;
        return {
          ...task,
          ...task.schedule.kind === "at" ? { enabled: false } : {},
          nextRunAt: task.schedule.kind === "at" ? "" : task.nextRunAt,
          lastStatus: "error",
          lastMessage: "Task was interrupted before completion.",
          updatedAt: now.toISOString()
        };
      }
      if (task.nextRunAt && !wasInterrupted) return task;
      changed = true;
      return {
        ...task,
        nextRunAt: computeScheduleNextRunAt(task, now),
        ...wasInterrupted ? {
          lastStatus: "error",
          lastMessage: "Task was interrupted before completion.",
          updatedAt: now.toISOString()
        } : {}
      };
    });
    if (!changed) {
      this.syncPowerSaveBlocker(settings);
      return;
    }
    const saved = await this.deps.store.patch({ schedule: { ...settings.schedule, tasks } });
    this.syncPowerSaveBlocker(saved);
  }
  async updateTask(taskId, updater) {
    const settings = await this.deps.store.load();
    const tasks = settings.schedule.tasks.map((task) => task.id === taskId ? updater(task, settings) : task);
    const saved = await this.deps.store.patch({ schedule: { ...settings.schedule, tasks } });
    this.syncPowerSaveBlocker(saved);
    return saved;
  }
  async runTaskInternal(task, scheduled) {
    if (this.runningTaskIds.has(task.id)) {
      return { ok: false, message: "Task is already running." };
    }
    if (scheduled && (!task.enabled || task.schedule.kind === "manual")) {
      return { ok: false, message: "Task is not scheduled." };
    }
    if (!task.prompt.trim()) {
      return { ok: false, message: "Task prompt is empty." };
    }
    this.runningTaskIds.add(task.id);
    await this.updateTask(task.id, (current) => ({
      ...current,
      lastStatus: "running",
      lastMessage: "Running",
      nextRunAt: "",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }));
    try {
      const settings = await this.deps.store.load();
      const result = await this.runPrompt(settings, {
        prompt: task.prompt,
        title: scheduledThreadTitle(task.title),
        workspaceRoot: task.workspaceRoot || this.resolveDefaultWorkspaceRoot(settings),
        model: task.model,
        reasoningEffort: task.reasoningEffort,
        mode: task.mode,
        waitForResult: false,
        responseTimeoutMs: TASK_RESPONSE_TIMEOUT_MS
      });
      if (!result.ok) {
        const finishedAt = /* @__PURE__ */ new Date();
        await this.updateTask(task.id, (current) => ({
          ...current,
          ...current.schedule.kind === "at" ? { enabled: false } : {},
          lastRunAt: finishedAt.toISOString(),
          nextRunAt: current.schedule.kind === "at" ? "" : computeScheduleNextRunAt(current, finishedAt),
          lastStatus: "error",
          lastMessage: result.message,
          updatedAt: finishedAt.toISOString()
        }));
        this.runningTaskIds.delete(task.id);
        return result;
      }
      const startedAt = /* @__PURE__ */ new Date();
      await this.updateTask(task.id, (current) => ({
        ...current,
        lastRunAt: startedAt.toISOString(),
        nextRunAt: "",
        lastStatus: "running",
        lastMessage: result.message ?? "Started",
        lastThreadId: result.threadId,
        updatedAt: startedAt.toISOString()
      }));
      void this.monitorTaskTurn(task.id, result.threadId, result.turnId ?? "");
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const finishedAt = /* @__PURE__ */ new Date();
      await this.updateTask(task.id, (current) => ({
        ...current,
        lastRunAt: finishedAt.toISOString(),
        nextRunAt: computeScheduleNextRunAt(current, finishedAt),
        lastStatus: "error",
        lastMessage: message,
        updatedAt: finishedAt.toISOString()
      }));
      this.runningTaskIds.delete(task.id);
      return { ok: false, message };
    }
  }
  async monitorTaskTurn(taskId, threadId, turnId) {
    try {
      const settings = await this.deps.store.load();
      const task = settings.schedule.tasks.find((item) => item.id === taskId);
      const text = await this.waitForAssistantText(
        settings,
        threadId,
        turnId,
        TASK_RESPONSE_TIMEOUT_MS,
        task?.workspaceRoot || this.resolveDefaultWorkspaceRoot(settings)
      );
      const finishedAt = /* @__PURE__ */ new Date();
      await this.updateTask(taskId, (current) => ({
        ...current,
        ...current.schedule.kind === "at" ? { enabled: false } : {},
        nextRunAt: current.schedule.kind === "at" ? "" : computeScheduleNextRunAt(current, finishedAt),
        lastStatus: "success",
        lastMessage: summarizeTaskResult(text),
        lastThreadId: threadId,
        updatedAt: finishedAt.toISOString()
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const finishedAt = /* @__PURE__ */ new Date();
      await this.updateTask(taskId, (current) => ({
        ...current,
        ...current.schedule.kind === "at" ? { enabled: false } : {},
        nextRunAt: current.schedule.kind === "at" ? "" : computeScheduleNextRunAt(current, finishedAt),
        lastStatus: "error",
        lastMessage: message,
        lastThreadId: threadId || current.lastThreadId,
        updatedAt: finishedAt.toISOString()
      }));
      this.deps.logError("schedule-task", "Scheduled task failed", { message, taskId, threadId });
    } finally {
      this.runningTaskIds.delete(taskId);
    }
  }
  async runPrompt(settings, options) {
    const workspace = options.workspaceRoot.trim() || this.resolveDefaultWorkspaceRoot(settings);
    if (workspace) {
      await promises.mkdir(workspace, { recursive: true });
    }
    const model = normalizeTaskModel(options.model) ?? (settings.agents.legalwork.model.trim() || DEFAULT_SCHEDULE_MODEL);
    const create = await this.deps.runtimeRequest(settings, "/v1/threads", {
      method: "POST",
      body: JSON.stringify({
        workspace,
        model,
        mode: options.mode,
        ...options.title.trim() ? { title: options.title.trim() } : {}
      })
    });
    if (!create.ok) return { ok: false, message: runtimeErrorMessage(create, "Failed to create thread.") };
    const thread = JSON.parse(create.body);
    const turnBody = {
      prompt: buildScheduleRuntimePrompt(settings, options.prompt),
      mode: options.mode
    };
    if (model) turnBody.model = model;
    if (options.reasoningEffort) {
      turnBody.reasoningEffort = options.reasoningEffort;
    }
    const turn = await this.deps.runtimeRequest(
      settings,
      `/v1/threads/${encodeURIComponent(thread.id)}/turns`,
      { method: "POST", body: JSON.stringify(turnBody) }
    );
    if (!turn.ok) return { ok: false, message: runtimeErrorMessage(turn, "Failed to start turn.") };
    const parsedTurn = parseJsonObject(turn.body);
    const turnId = asString(nestedRecord(parsedTurn?.turn).id) || asString(parsedTurn?.turnId);
    if (!turnId) {
      return { ok: false, message: "Failed to start turn: missing turn id." };
    }
    if (!options.waitForResult) {
      return { ok: true, threadId: thread.id, turnId, message: "Started" };
    }
    const text = await this.waitForAssistantText(settings, thread.id, turnId, options.responseTimeoutMs, workspace);
    return { ok: true, threadId: thread.id, turnId, text, message: text || "Completed" };
  }
  async waitForAssistantText(settings, threadId, turnId, timeoutMs, workspaceRoot) {
    const deadline = Date.now() + timeoutMs;
    let lastText = "";
    while (Date.now() < deadline) {
      await sleep$2(1500);
      const detailRes = await this.deps.runtimeRequest(
        settings,
        `/v1/threads/${encodeURIComponent(threadId)}`,
        { method: "GET" }
      );
      if (!detailRes.ok) {
        throw new Error(runtimeErrorMessage(detailRes, "Failed to read thread result."));
      }
      const detail = JSON.parse(detailRes.body);
      lastText = latestAssistantText(detail, { turnId }) || lastText;
      const targetTurn = Array.isArray(detail.turns) ? detail.turns.find((turn) => turn.id === turnId) : void 0;
      if (!targetTurn) continue;
      if (isRunningStatus(targetTurn.status)) continue;
      if (targetTurn.status === "failed" || targetTurn.status === "aborted") {
        const error = targetTurn.error?.trim();
        throw new Error(error || `Agent turn ${targetTurn.status}.`);
      }
      if (targetTurn.status === "completed" && lastText) return lastText;
    }
    if (lastText) return lastText;
    throw new Error("Timed out waiting for agent response.");
  }
  resolveDefaultWorkspaceRoot(settings) {
    return settings.schedule.defaultWorkspaceRoot.trim() || settings.workspaceRoot;
  }
  syncInternalServer(settings) {
    const internal = settings.schedule.internal;
    const key = `${internal.port}`;
    if (this.server && this.serverKey === key) return;
    this.closeInternalServer();
    const server2 = node_http.createServer((req, res) => {
      void this.handleInternalRequest(req, res);
    });
    server2.on("error", (error) => {
      this.deps.logError("schedule-server", "Schedule internal server failed", {
        message: error instanceof Error ? error.message : String(error)
      });
      if (this.server === server2) {
        this.closeInternalServer();
      }
    });
    server2.listen(internal.port, "127.0.0.1");
    this.server = server2;
    this.serverKey = key;
  }
  closeInternalServer() {
    if (!this.server) return;
    const server2 = this.server;
    this.server = null;
    this.serverKey = "";
    server2.close();
  }
  async handleInternalRequest(req, res) {
    try {
      const settings = await this.deps.store.load();
      const url = new node_url.URL(req.url ?? "/", "http://127.0.0.1");
      if (!url.pathname.startsWith("/schedule/internal/")) {
        writeJson$1(res, 404, { ok: false, message: "Not found." });
        return;
      }
      if (req.method !== "POST") {
        writeJson$1(res, 405, { ok: false, message: "Method not allowed." });
        return;
      }
      const secret = settings.schedule.internal.secret.trim();
      if (secret) {
        const auth = req.headers.authorization ?? "";
        const legalworkHeaderSecret = Array.isArray(req.headers["x-legalwork-secret"]) ? req.headers["x-legalwork-secret"][0] : req.headers["x-legalwork-secret"];
        const legacyHeaderSecret = Array.isArray(req.headers["x-legalwork-secret"]) ? req.headers["x-legalwork-secret"][0] : req.headers["x-legalwork-secret"];
        const headerSecret = legalworkHeaderSecret ?? legacyHeaderSecret;
        if (auth !== `Bearer ${secret}` && headerSecret !== secret) {
          writeJson$1(res, 401, { ok: false, message: "Unauthorized." });
          return;
        }
      }
      if (url.pathname === "/schedule/internal/list") {
        const tasks = await this.listTasks();
        writeJson$1(res, 200, { ok: true, tasks });
        return;
      }
      const body = await readRequestBody$1(req);
      const payload = parseJsonObject(body);
      if (!payload) {
        writeJson$1(res, 400, { ok: false, message: "Expected a JSON object." });
        return;
      }
      if (url.pathname === "/schedule/internal/create") {
        const input = nestedRecord(payload.input);
        if (!input || Object.keys(input).length === 0) {
          writeJson$1(res, 400, { ok: false, message: "Missing task input." });
          return;
        }
        const title = asString(input.title);
        const prompt = asString(input.prompt);
        const schedule = nestedRecord(input.schedule);
        const kind = asString(schedule.kind);
        if (!prompt || !kind) {
          writeJson$1(res, 400, { ok: false, message: "Missing prompt or schedule.kind." });
          return;
        }
        const saved = await this.createTaskFromInput({
          title,
          prompt,
          workspaceRoot: asString(input.workspaceRoot) || void 0,
          model: asString(input.model) || void 0,
          reasoningEffort: asString(input.reasoningEffort) || void 0,
          mode: asString(input.mode) || void 0,
          enabled: input.enabled === false ? false : true,
          schedule: {
            kind,
            everyMinutes: Number(schedule.everyMinutes),
            timeOfDay: asString(schedule.timeOfDay),
            atTime: asString(schedule.atTime)
          }
        });
        writeJson$1(res, 200, { ok: true, task: saved });
        return;
      }
      if (url.pathname === "/schedule/internal/update") {
        const taskId = asString(payload.taskId);
        const patch = nestedRecord(payload.patch);
        if (!taskId) {
          writeJson$1(res, 400, { ok: false, message: "Missing taskId." });
          return;
        }
        const updated = await this.updateTaskById(taskId, patch);
        if (!updated) {
          writeJson$1(res, 404, { ok: false, message: "Task not found." });
          return;
        }
        writeJson$1(res, 200, { ok: true, task: updated });
        return;
      }
      if (url.pathname === "/schedule/internal/delete") {
        const taskId = asString(payload.taskId);
        if (!taskId) {
          writeJson$1(res, 400, { ok: false, message: "Missing taskId." });
          return;
        }
        const removed = await this.deleteTaskById(taskId);
        writeJson$1(res, removed ? 200 : 404, removed ? { ok: true } : { ok: false, message: "Task not found." });
        return;
      }
      writeJson$1(res, 404, { ok: false, message: "Not found." });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.deps.logError("schedule-server", "Schedule internal request failed", { message });
      writeJson$1(res, 500, { ok: false, message });
    }
  }
  syncPowerSaveBlocker(settings) {
    const shouldKeepAwake = settings.schedule.keepAwake && settings.schedule.enabled && hasEnabledScheduledTask(settings);
    if (!shouldKeepAwake) {
      this.stopPowerSaveBlocker();
      return;
    }
    if (this.isPowerSaveBlockerActive()) return;
    const blocker = this.deps.powerSaveBlocker;
    if (!blocker) return;
    this.powerSaveBlockerId = blocker.start("prevent-app-suspension");
  }
  stopPowerSaveBlocker() {
    const blocker = this.deps.powerSaveBlocker;
    const id = this.powerSaveBlockerId;
    this.powerSaveBlockerId = null;
    if (!blocker || id == null) return;
    try {
      if (blocker.isStarted(id)) blocker.stop(id);
    } catch (error) {
      this.deps.logError("schedule-power-save", "Failed to stop power save blocker", {
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
  isPowerSaveBlockerActive() {
    const blocker = this.deps.powerSaveBlocker;
    const id = this.powerSaveBlockerId;
    if (!blocker || id == null) return false;
    try {
      return blocker.isStarted(id);
    } catch {
      return false;
    }
  }
}
function createScheduleRuntime(deps) {
  return new ScheduleRuntime(deps);
}
const LEGALWORK_HEALTH_TEMPLATE = "/health";
const LEGALWORK_RUNTIME_INFO_TEMPLATE = "/v1/runtime/info";
const LEGALWORK_RUNTIME_TOOLS_TEMPLATE = "/v1/runtime/tools";
const LEGALWORK_SKILLS_TEMPLATE = "/v1/skills";
const LEGALWORK_ATTACHMENTS_TEMPLATE = "/v1/attachments";
const LEGALWORK_ATTACHMENT_DIAGNOSTICS_TEMPLATE = "/v1/attachments/diagnostics";
const LEGALWORK_ATTACHMENT_TEMPLATE = "/v1/attachments/{id}";
const LEGALWORK_ATTACHMENT_CONTENT_TEMPLATE = "/v1/attachments/{id}/content";
const LEGALWORK_MEMORY_TEMPLATE = "/v1/memory";
const LEGALWORK_MEMORY_DIAGNOSTICS_TEMPLATE = "/v1/memory/diagnostics";
const LEGALWORK_MEMORY_RECORD_TEMPLATE = "/v1/memory/{id}";
const LEGALWORK_KNOWLEDGE_SYNC_TEMPLATE = "/v1/knowledge/sync";
const LEGALWORK_KNOWLEDGE_SEARCH_TEMPLATE = "/v1/knowledge/search";
const LEGALWORK_KNOWLEDGE_AGENT_SOURCES_TEMPLATE = "/v1/knowledge/agent-sources";
const LEGALWORK_KNOWLEDGE_DIAGNOSTICS_TEMPLATE = "/v1/knowledge/diagnostics";
const LEGALWORK_KNOWLEDGE_TREE_TEMPLATE = "/v1/knowledge/tree";
const LEGALWORK_KNOWLEDGE_CREATE_FOLDER_TEMPLATE = "/v1/knowledge/folder";
const LEGALWORK_KNOWLEDGE_WRITE_FILE_TEMPLATE = "/v1/knowledge/file";
const LEGALWORK_KNOWLEDGE_READ_FILE_TEMPLATE = "/v1/knowledge/file";
const LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_TEMPLATE = "/v1/knowledge/file/extract-text";
const LEGALWORK_KNOWLEDGE_ABSOLUTE_PATH_TEMPLATE = "/v1/knowledge/file/absolute-path";
const LEGALWORK_KNOWLEDGE_MOVE_TEMPLATE = "/v1/knowledge/move";
const LEGALWORK_KNOWLEDGE_DELETE_FILE_TEMPLATE = "/v1/knowledge/file";
const LEGALWORK_THREADS_TEMPLATE = "/v1/threads";
const LEGALWORK_THREAD_TEMPLATE = "/v1/threads/{id}";
function legalworkThreadPath(threadId) {
  return `/v1/threads/${encodeURIComponent(threadId)}`;
}
const LEGALWORK_THREAD_FORK_TEMPLATE = "/v1/threads/{id}/fork";
const LEGALWORK_THREAD_GOAL_TEMPLATE = "/v1/threads/{id}/goal";
const LEGALWORK_THREAD_TODOS_TEMPLATE = "/v1/threads/{id}/todos";
const LEGALWORK_THREAD_COMPACT_TEMPLATE = "/v1/threads/{id}/compact";
const LEGALWORK_THREAD_REVIEW_TEMPLATE = "/v1/threads/{id}/review";
const LEGALWORK_THREAD_TURNS_TEMPLATE = "/v1/threads/{id}/turns";
const LEGALWORK_THREAD_TURN_TEMPLATE = "/v1/threads/{id}/turns/{turn}";
const LEGALWORK_THREAD_STEER_TEMPLATE = "/v1/threads/{id}/turns/{turn}/steer";
const LEGALWORK_THREAD_INTERRUPT_TEMPLATE = "/v1/threads/{id}/turns/{turn}/interrupt";
function legalworkThreadEventsPath(threadId) {
  return `${legalworkThreadPath(threadId)}/events`;
}
const LEGALWORK_APPROVAL_TEMPLATE = "/v1/approvals/{id}";
const LEGALWORK_USER_INPUT_TEMPLATE = "/v1/user-inputs/{id}";
const LEGALWORK_SESSION_RESUME_TEMPLATE = "/v1/sessions/{id}/resume-thread";
const LEGALWORK_USAGE_TEMPLATE = "/v1/usage";
const DESKTOP_COMMANDS = [
  "undo",
  "redo",
  "cut",
  "copy",
  "paste",
  "selectAll",
  "reload",
  "zoomIn",
  "zoomOut",
  "resetZoom",
  "toggleDevTools",
  "minimize",
  "toggleMaximize",
  "close",
  "quit"
];
const WRITE_EXPORT_FORMATS = ["html", "pdf", "doc", "docx"];
const MAX_BODY_BYTES = 2e6;
const MAX_PATH_LENGTH = 4096;
const MAX_URL_LENGTH = 4096;
const MAX_ID_LENGTH = 256;
const MAX_BRANCH_LENGTH = 255;
const MAX_EDITOR_ID_LENGTH = 64;
const MAX_NOTIFICATION_TITLE_LENGTH = 200;
const MAX_NOTIFICATION_BODY_LENGTH = 5e3;
const MAX_CHANNEL_TEXT_LENGTH = 1e5;
const MAX_SKILL_FILE_BYTES = 1e6;
const MAX_CONFIG_FILE_BYTES = 2e6;
const MAX_DEVICE_CODE_LENGTH = 8192;
const MAX_EDITOR_COMPLETION_TEXT = 2e5;
const MAX_DATA_COMPLIANCE_FILE_BYTES = 40 * 1024 * 1024;
const SAFE_OPEN_EXTERNAL_PROTOCOLS = /* @__PURE__ */ new Set(["http:", "https:", "mailto:"]);
function trimmedString(max) {
  return zod.z.string().trim().min(1).max(max);
}
function optionalTrimmedString(max) {
  return zod.z.string().trim().max(max).optional();
}
function isSafeOpenExternalUrl(value) {
  try {
    const parsed = new URL(value);
    return SAFE_OPEN_EXTERNAL_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}
const defaultPathSchema = optionalTrimmedString(MAX_PATH_LENGTH);
function compileEndpoint(template, allowedMethods) {
  const pattern = template.replace(/[.+*?^$()|[\]\\]/g, "\\$&").replace(/\{(?:id|turn)\}/g, "[^/]+");
  const regex = new RegExp(`^${pattern}$`);
  return {
    match: (path) => regex.test(path),
    allowedMethods
  };
}
const ENDPOINTS = [
  compileEndpoint(LEGALWORK_HEALTH_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_RUNTIME_INFO_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_RUNTIME_TOOLS_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_SKILLS_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_ATTACHMENTS_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_ATTACHMENT_DIAGNOSTICS_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_ATTACHMENT_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_ATTACHMENT_CONTENT_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_MEMORY_TEMPLATE, ["GET", "POST"]),
  compileEndpoint(LEGALWORK_MEMORY_DIAGNOSTICS_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_MEMORY_RECORD_TEMPLATE, ["PATCH", "DELETE"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_SYNC_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_SEARCH_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_AGENT_SOURCES_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_DIAGNOSTICS_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_TREE_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_CREATE_FOLDER_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_WRITE_FILE_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_READ_FILE_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_EXTRACT_TEXT_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_ABSOLUTE_PATH_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_MOVE_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_KNOWLEDGE_DELETE_FILE_TEMPLATE, ["DELETE"]),
  compileEndpoint(LEGALWORK_THREADS_TEMPLATE, ["GET", "POST"]),
  compileEndpoint(LEGALWORK_THREAD_TEMPLATE, ["GET", "PATCH", "DELETE"]),
  compileEndpoint(LEGALWORK_THREAD_FORK_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_THREAD_GOAL_TEMPLATE, ["GET", "POST", "DELETE"]),
  compileEndpoint(LEGALWORK_THREAD_TODOS_TEMPLATE, ["GET", "POST", "DELETE"]),
  compileEndpoint(LEGALWORK_THREAD_COMPACT_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_THREAD_REVIEW_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_THREAD_TURNS_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_THREAD_TURN_TEMPLATE, ["GET"]),
  compileEndpoint(LEGALWORK_THREAD_STEER_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_THREAD_INTERRUPT_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_APPROVAL_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_USER_INPUT_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_SESSION_RESUME_TEMPLATE, ["POST"]),
  compileEndpoint(LEGALWORK_USAGE_TEMPLATE, ["GET"])
];
function isAllowedRuntimeRequest(value) {
  try {
    const url = new URL(value.path, "http://localhost");
    const path = url.pathname;
    const method = value.method ?? "GET";
    for (const endpoint of ENDPOINTS) {
      if (endpoint.match(path)) {
        if (endpoint.allowedMethods.includes(method)) return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
const runtimeRequestPayloadSchema = zod.z.object({
  path: trimmedString(MAX_URL_LENGTH).transform(
    (value) => value.startsWith("/") ? value : `/${value}`
  ),
  method: zod.z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
  body: zod.z.string().max(MAX_BODY_BYTES).optional()
}).refine((payload) => isAllowedRuntimeRequest(payload), {
  message: "runtime request path is not allowed"
}).strict();
const dataComplianceRequestPayloadSchema = zod.z.object({
  path: trimmedString(MAX_URL_LENGTH).transform(
    (value) => value.startsWith("/") ? value : `/${value}`
  ),
  method: zod.z.enum(["GET", "POST", "DELETE"]).optional(),
  body: zod.z.string().max(MAX_BODY_BYTES).optional()
}).refine((payload) => {
  const method = payload.method ?? "GET";
  try {
    const url = new URL(payload.path, "http://localhost");
    const path = url.pathname;
    if (path === "/data-compliance/tasks") return method === "GET" || method === "POST";
    if (path === "/data-compliance/environment") return method === "GET";
    if (/^\/data-compliance\/tasks\/[A-Za-z0-9_-]+$/.test(path)) return method === "GET" || method === "DELETE";
    if (/^\/data-compliance\/tasks\/[A-Za-z0-9_-]+\/files\/[A-Za-z0-9_-]+$/.test(path)) return method === "GET";
    if (/^\/data-compliance\/tasks\/[A-Za-z0-9_-]+\/progress$/.test(path)) return method === "GET";
    if (path === "/api/history") return method === "GET";
    if (/^\/api\/history\/[A-Za-z0-9_-]+$/.test(path)) return method === "DELETE";
    if (/^\/api\/result\/[A-Za-z0-9_-]+$/.test(path)) return method === "GET";
    if (/^\/api\/progress\/[A-Za-z0-9_-]+$/.test(path)) return method === "GET";
    if (/^\/api\/download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === "GET";
    if (/^\/api\/desensitize\/download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === "GET";
    if (/^\/api\/save-download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === "POST";
    if (/^\/api\/desensitize\/save-download\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/.test(path)) return method === "POST";
    if (/^\/api\/task\/[A-Za-z0-9_-]+\/(?:locations|preview-full|preview-document)$/.test(path)) return method === "GET";
    if (/^\/api\/task\/[A-Za-z0-9_-]+\/preview-page\/\d+$/.test(path)) return method === "GET";
    if (/^\/api\/task\/[A-Za-z0-9_-]+\/preview-file$/.test(path)) return method === "GET";
    return false;
  } catch {
    return false;
  }
}, {
  message: "data compliance request path is not allowed"
}).strict();
const dataComplianceSubmitPayloadSchema = zod.z.object({
  mode: zod.z.enum(["review", "desensitize"]),
  documentName: zod.z.string().trim().max(500).optional(),
  inputText: zod.z.string().max(MAX_BODY_BYTES).optional(),
  reviewType: zod.z.enum(["document", "code"]).optional(),
  outputDir: zod.z.string().trim().max(2e3).optional(),
  outputFormat: zod.z.enum(["md", "docx", "txt"]).optional(),
  file: zod.z.object({
    name: zod.z.string().trim().min(1).max(500),
    type: zod.z.string().trim().max(200).optional(),
    dataBase64: zod.z.string().max(Math.ceil(MAX_DATA_COMPLIANCE_FILE_BYTES * 1.4))
  }).strict().optional()
}).strict().refine((payload) => Boolean(payload.file || payload.inputText?.trim()), {
  message: "file or input text is required"
});
const dataComplianceDownloadFilePayloadSchema = zod.z.object({
  taskId: zod.z.string().trim().min(1).max(64),
  fileKey: zod.z.string().trim().min(1).max(100)
}).strict();
const localeSchema = zod.z.enum(["en", "zh"]);
const themeSchema = zod.z.enum(["system", "light", "dark"]);
const uiFontScaleSchema = zod.z.enum(["small", "medium", "large"]);
const approvalPolicySchema = zod.z.enum(["on-request", "untrusted", "never", "auto", "suggest"]);
const sandboxModeSchema = zod.z.enum(["read-only", "workspace-write", "danger-full-access", "external-sandbox"]);
const mcpSearchModeSchema = zod.z.enum(["direct", "search", "auto"]);
const legalworkStorageBackendSchema = zod.z.enum(["hybrid", "file"]);
const legalworkCompactionSummaryModeSchema = zod.z.enum(["heuristic", "model"]);
const clawRunModeSchema = zod.z.enum(["agent", "plan"]);
const clawImProviderSchema = zod.z.enum(["feishu", "weixin"]);
const clawScheduleKindSchema = zod.z.enum(["manual", "interval", "daily", "at"]);
const clawTaskStatusSchema = zod.z.enum(["idle", "running", "success", "error"]);
zod.z.union([zod.z.enum(CLAW_MODEL_IDS), trimmedString(128)]);
const scheduleReasoningEffortSchema = zod.z.enum(SCHEDULE_REASONING_EFFORT_IDS);
const writeInlineCompletionModelSchema = zod.z.union([
  zod.z.enum(WRITE_INLINE_COMPLETION_MODEL_IDS),
  trimmedString(128)
]);
const modelProviderPatchSchema = zod.z.object({
  apiKey: zod.z.string().max(MAX_BODY_BYTES).optional(),
  baseUrl: zod.z.string().trim().max(MAX_URL_LENGTH).optional(),
  providers: zod.z.array(zod.z.object({
    id: zod.z.string().trim().min(1).max(64).optional(),
    name: zod.z.string().trim().min(1).max(80).optional(),
    apiKey: zod.z.string().max(MAX_BODY_BYTES).optional(),
    baseUrl: zod.z.string().trim().max(MAX_URL_LENGTH).optional(),
    endpointFormat: zod.z.string().trim().max(64).optional(),
    models: zod.z.array(zod.z.string().trim().min(1).max(128)).max(200).optional()
  }).strict()).max(50).optional()
}).strict();
const legalworkRuntimePatchSchema = zod.z.object({
  binaryPath: defaultPathSchema,
  port: zod.z.number().int().min(1).max(65535).optional(),
  autoStart: zod.z.boolean().optional(),
  apiKey: zod.z.string().max(MAX_BODY_BYTES).optional(),
  baseUrl: zod.z.string().trim().max(MAX_URL_LENGTH).optional(),
  endpointFormat: zod.z.string().trim().max(64).optional(),
  providerId: zod.z.string().trim().max(64).optional(),
  runtimeToken: zod.z.string().max(MAX_BODY_BYTES).optional(),
  dataDir: defaultPathSchema,
  model: zod.z.string().trim().min(1).max(128).optional(),
  approvalPolicy: approvalPolicySchema.optional(),
  sandboxMode: sandboxModeSchema.optional(),
  tokenEconomyMode: zod.z.boolean().optional(),
  tokenEconomy: zod.z.object({
    enabled: zod.z.boolean().optional(),
    compressToolDescriptions: zod.z.boolean().optional(),
    compressToolResults: zod.z.boolean().optional(),
    conciseResponses: zod.z.boolean().optional(),
    historyHygiene: zod.z.object({
      maxToolResultLines: zod.z.number().int().positive().max(1e5).optional(),
      maxToolResultBytes: zod.z.number().int().positive().max(8 * 1024 * 1024).optional(),
      maxToolResultTokens: zod.z.number().int().positive().max(256e3).optional(),
      maxToolArgumentStringBytes: zod.z.number().int().positive().max(8 * 1024 * 1024).optional(),
      maxToolArgumentStringTokens: zod.z.number().int().positive().max(64e3).optional(),
      maxArrayItems: zod.z.number().int().positive().max(1e4).optional()
    }).strict().optional()
  }).strict().optional(),
  insecure: zod.z.boolean().optional(),
  mcpSearch: zod.z.object({
    enabled: zod.z.boolean().optional(),
    mode: mcpSearchModeSchema.optional(),
    autoThresholdToolCount: zod.z.number().int().positive().optional(),
    topKDefault: zod.z.number().int().positive().optional(),
    topKMax: zod.z.number().int().positive().optional(),
    minScore: zod.z.number().nonnegative().optional()
  }).strict().optional(),
  storage: zod.z.object({
    backend: legalworkStorageBackendSchema.optional(),
    sqlitePath: defaultPathSchema
  }).strict().optional(),
  contextCompaction: zod.z.object({
    defaultSoftThreshold: zod.z.number().int().positive().optional(),
    defaultHardThreshold: zod.z.number().int().positive().optional(),
    summaryMode: legalworkCompactionSummaryModeSchema.optional(),
    summaryTimeoutMs: zod.z.number().int().positive().max(12e4).optional(),
    summaryMaxTokens: zod.z.number().int().positive().max(16e3).optional(),
    summaryInputMaxBytes: zod.z.number().int().positive().max(8 * 1024 * 1024).optional()
  }).strict().optional(),
  runtimeTuning: zod.z.object({
    toolStorm: zod.z.object({
      enabled: zod.z.boolean().optional(),
      windowSize: zod.z.number().int().positive().max(128).optional(),
      threshold: zod.z.number().int().min(2).max(128).optional()
    }).strict().optional(),
    toolArgumentRepair: zod.z.object({
      maxStringBytes: zod.z.number().int().positive().max(16 * 1024 * 1024).optional()
    }).strict().optional()
  }).strict().optional()
}).strict();
const logPatchSchema = zod.z.object({
  enabled: zod.z.boolean().optional(),
  retentionDays: zod.z.number().int().min(1).max(365).optional()
}).strict();
const notificationsPatchSchema = zod.z.object({
  turnComplete: zod.z.boolean().optional()
}).strict();
const appBehaviorPatchSchema = zod.z.object({
  openAtLogin: zod.z.boolean().optional(),
  startMinimized: zod.z.boolean().optional(),
  closeToTray: zod.z.boolean().optional()
}).strict();
const keyboardShortcutCommandIds = KEYBOARD_SHORTCUT_COMMANDS.map((command) => command.id);
const keyboardShortcutsPatchSchema = zod.z.object({
  bindings: zod.z.partialRecord(
    zod.z.enum(keyboardShortcutCommandIds),
    zod.z.array(zod.z.string().trim().max(64)).max(4)
  ).optional()
}).strict();
const writeInlineCompletionPatchSchema = zod.z.object({
  enabled: zod.z.boolean().optional(),
  retrievalEnabled: zod.z.boolean().optional(),
  longCompletionEnabled: zod.z.boolean().optional(),
  apiKey: zod.z.string().max(MAX_BODY_BYTES).optional(),
  baseUrl: zod.z.string().trim().max(MAX_URL_LENGTH).optional(),
  inheritModel: zod.z.boolean().optional(),
  model: writeInlineCompletionModelSchema.optional(),
  debounceMs: zod.z.number().int().min(150).max(5e3).optional(),
  longDebounceMs: zod.z.number().int().min(1e3).max(15e3).optional(),
  minAcceptScore: zod.z.number().min(0.1).max(0.95).optional(),
  longMinAcceptScore: zod.z.number().min(0.1).max(0.95).optional(),
  maxTokens: zod.z.number().int().min(16).max(512).optional(),
  longMaxTokens: zod.z.number().int().min(64).max(1024).optional()
}).strict();
const writeSettingsPatchSchema = zod.z.object({
  defaultWorkspaceRoot: defaultPathSchema,
  activeWorkspaceRoot: defaultPathSchema,
  workspaces: zod.z.array(trimmedString(MAX_PATH_LENGTH)).max(256).optional(),
  inlineCompletion: writeInlineCompletionPatchSchema.optional()
}).strict();
const clawSkillPatchSchema = zod.z.object({
  defaultNames: zod.z.array(trimmedString(128)).max(128).optional(),
  extraDirs: zod.z.array(trimmedString(MAX_PATH_LENGTH)).max(128).optional(),
  promptPrefix: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional()
}).strict();
const clawImPatchSchema = zod.z.object({
  enabled: zod.z.boolean().optional(),
  provider: clawImProviderSchema.optional(),
  port: zod.z.number().int().min(1024).max(65535).optional(),
  path: trimmedString(MAX_PATH_LENGTH).optional(),
  secret: zod.z.string().max(MAX_BODY_BYTES).optional(),
  weixinBridgeUrl: zod.z.string().trim().max(MAX_URL_LENGTH).optional(),
  openClawGatewayUrl: zod.z.string().trim().max(MAX_URL_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  model: zod.z.string().trim().min(1).max(128).optional(),
  mode: clawRunModeSchema.optional(),
  responseTimeoutMs: zod.z.number().int().min(5e3).max(6e5).optional()
}).strict();
const clawImAgentProfilePatchSchema = zod.z.object({
  name: zod.z.string().max(200).optional(),
  description: zod.z.string().max(2e3).optional(),
  identity: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  personality: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  userContext: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  replyRules: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional()
}).strict();
const clawImPlatformCredentialPatchSchema = zod.z.union([
  zod.z.object({
    kind: zod.z.literal("feishu").optional(),
    appId: zod.z.string().max(512).optional(),
    appSecret: zod.z.string().max(MAX_BODY_BYTES).optional(),
    domain: zod.z.string().max(512).optional(),
    createdAt: zod.z.string().max(128).optional()
  }).strict(),
  zod.z.object({
    kind: zod.z.literal("weixin"),
    accountId: zod.z.string().max(512).optional(),
    sessionKey: zod.z.string().max(MAX_BODY_BYTES).optional(),
    createdAt: zod.z.string().max(128).optional()
  }).strict()
]);
const clawImRemoteSessionPatchSchema = zod.z.object({
  chatId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  messageId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  threadId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  senderId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  senderName: zod.z.string().max(512).optional(),
  updatedAt: zod.z.string().max(128).optional()
}).strict();
const clawImConversationPatchSchema = zod.z.object({
  id: zod.z.string().max(MAX_ID_LENGTH).optional(),
  chatId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  remoteThreadId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  latestMessageId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  senderId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  senderName: zod.z.string().max(512).optional(),
  localThreadId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  createdAt: zod.z.string().max(128).optional(),
  updatedAt: zod.z.string().max(128).optional()
}).strict();
const clawImChannelPatchSchema = zod.z.object({
  id: zod.z.string().max(MAX_ID_LENGTH).optional(),
  provider: clawImProviderSchema.optional(),
  label: zod.z.string().max(512).optional(),
  enabled: zod.z.boolean().optional(),
  model: zod.z.string().trim().min(1).max(128).optional(),
  threadId: zod.z.string().max(MAX_ID_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  agentProfile: clawImAgentProfilePatchSchema.optional(),
  platformCredential: clawImPlatformCredentialPatchSchema.optional(),
  remoteSession: clawImRemoteSessionPatchSchema.optional(),
  conversations: zod.z.array(clawImConversationPatchSchema).max(512).optional(),
  createdAt: zod.z.string().max(128).optional(),
  updatedAt: zod.z.string().max(128).optional()
}).strict();
const clawTaskSchedulePatchSchema = zod.z.object({
  kind: clawScheduleKindSchema.optional(),
  everyMinutes: zod.z.number().int().min(1).max(10080).optional(),
  timeOfDay: zod.z.string().max(16).optional(),
  atTime: zod.z.string().max(128).optional()
}).strict();
const clawTaskPatchSchema = zod.z.object({
  id: zod.z.string().max(MAX_ID_LENGTH).optional(),
  title: zod.z.string().max(512).optional(),
  enabled: zod.z.boolean().optional(),
  prompt: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  model: zod.z.string().trim().min(1).max(128).optional(),
  reasoningEffort: scheduleReasoningEffortSchema.optional(),
  mode: clawRunModeSchema.optional(),
  schedule: clawTaskSchedulePatchSchema.optional(),
  createdAt: zod.z.string().max(128).optional(),
  updatedAt: zod.z.string().max(128).optional(),
  lastRunAt: zod.z.string().max(128).optional(),
  nextRunAt: zod.z.string().max(128).optional(),
  lastStatus: clawTaskStatusSchema.optional(),
  lastMessage: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  lastThreadId: zod.z.string().max(MAX_ID_LENGTH).optional()
}).strict();
const clawSettingsPatchSchema = zod.z.object({
  enabled: zod.z.boolean().optional(),
  skills: clawSkillPatchSchema.optional(),
  im: clawImPatchSchema.optional(),
  channels: zod.z.array(clawImChannelPatchSchema).max(512).optional(),
  tasks: zod.z.array(clawTaskPatchSchema).max(512).optional()
}).strict();
const scheduleSkillPatchSchema = zod.z.object({
  defaultNames: zod.z.array(trimmedString(128)).max(128).optional(),
  extraDirs: zod.z.array(trimmedString(MAX_PATH_LENGTH)).max(128).optional()
}).strict();
const scheduleInternalPatchSchema = zod.z.object({
  port: zod.z.number().int().min(1024).max(65535).optional(),
  secret: zod.z.string().max(MAX_BODY_BYTES).optional()
}).strict();
const scheduledTaskSchedulePatchSchema = zod.z.object({
  kind: clawScheduleKindSchema.optional(),
  everyMinutes: zod.z.number().int().min(1).max(10080).optional(),
  timeOfDay: zod.z.string().max(16).optional(),
  atTime: zod.z.string().max(128).optional()
}).strict();
const scheduledTaskPatchSchema = zod.z.object({
  id: zod.z.string().max(MAX_ID_LENGTH).optional(),
  title: zod.z.string().max(512).optional(),
  enabled: zod.z.boolean().optional(),
  prompt: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  workspaceRoot: defaultPathSchema,
  model: zod.z.string().trim().min(1).max(128).optional(),
  reasoningEffort: scheduleReasoningEffortSchema.optional(),
  mode: clawRunModeSchema.optional(),
  schedule: scheduledTaskSchedulePatchSchema.optional(),
  createdAt: zod.z.string().max(128).optional(),
  updatedAt: zod.z.string().max(128).optional(),
  lastRunAt: zod.z.string().max(128).optional(),
  nextRunAt: zod.z.string().max(128).optional(),
  lastStatus: clawTaskStatusSchema.optional(),
  lastMessage: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  lastThreadId: zod.z.string().max(MAX_ID_LENGTH).optional()
}).strict();
const scheduleSettingsPatchSchema = zod.z.object({
  enabled: zod.z.boolean().optional(),
  defaultWorkspaceRoot: defaultPathSchema,
  model: zod.z.union([zod.z.enum(SCHEDULE_MODEL_IDS), trimmedString(128)]).optional(),
  mode: clawRunModeSchema.optional(),
  promptPrefix: zod.z.string().max(MAX_CHANNEL_TEXT_LENGTH).optional(),
  skills: scheduleSkillPatchSchema.optional(),
  keepAwake: zod.z.boolean().optional(),
  internal: scheduleInternalPatchSchema.optional(),
  tasks: zod.z.array(scheduledTaskPatchSchema).max(512).optional()
}).strict();
function stripLegacySettingsPatchKeys(payload) {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return payload;
  const source = payload;
  const next = { ...source };
  delete next.agentProvider;
  delete next.deepseek;
  delete next.reasonix;
  delete next.quickChat;
  if (typeof next.agents === "object" && next.agents !== null && !Array.isArray(next.agents)) {
    const agents = { ...next.agents };
    delete agents.codewhale;
    delete agents.reasonix;
    delete agents.quickChat;
    next.agents = agents;
  }
  return next;
}
const settingsPatchObjectSchema = zod.z.object({
  version: zod.z.literal(1).optional(),
  locale: localeSchema.optional(),
  theme: themeSchema.optional(),
  uiFontScale: uiFontScaleSchema.optional(),
  provider: modelProviderPatchSchema.optional(),
  agents: zod.z.object({
    legalwork: legalworkRuntimePatchSchema.optional()
  }).strict().optional(),
  workspaceRoot: defaultPathSchema,
  log: logPatchSchema.optional(),
  notifications: notificationsPatchSchema.optional(),
  appBehavior: appBehaviorPatchSchema.optional(),
  keyboardShortcuts: keyboardShortcutsPatchSchema.optional(),
  write: writeSettingsPatchSchema.optional(),
  claw: clawSettingsPatchSchema.optional(),
  schedule: scheduleSettingsPatchSchema.optional(),
  guiUpdate: zod.z.object({
    channel: zod.z.enum(GUI_UPDATE_CHANNELS).optional()
  }).strict().optional()
}).strict();
const settingsPatchSchema = zod.z.preprocess(stripLegacySettingsPatchKeys, settingsPatchObjectSchema);
const skillSaveFilePayloadSchema = zod.z.object({
  rootPath: trimmedString(MAX_PATH_LENGTH),
  skillName: trimmedString(128),
  content: zod.z.string().max(MAX_SKILL_FILE_BYTES)
}).strict();
const skillListPayloadSchema = zod.z.object({
  workspaceRoot: zod.z.string().trim().max(MAX_PATH_LENGTH).optional()
}).strict();
const rootPathSchema = trimmedString(MAX_PATH_LENGTH);
const deepseekConfigContentSchema = zod.z.string().max(MAX_CONFIG_FILE_BYTES);
const workspaceRootSchema = trimmedString(MAX_PATH_LENGTH);
const gitBranchPayloadSchema = zod.z.object({
  workspaceRoot: workspaceRootSchema,
  branch: trimmedString(MAX_BRANCH_LENGTH)
}).strict();
const openEditorPathPayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
  editorId: optionalTrimmedString(MAX_EDITOR_ID_LENGTH),
  line: zod.z.number().int().positive().max(1e6).optional(),
  column: zod.z.number().int().positive().max(1e6).optional()
}).strict();
const workspaceFileTargetPayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
  line: zod.z.number().int().positive().max(1e6).optional(),
  column: zod.z.number().int().positive().max(1e6).optional()
}).strict();
const workspaceDirectoryTargetPayloadSchema = zod.z.object({
  path: optionalTrimmedString(MAX_PATH_LENGTH),
  workspaceRoot: trimmedString(MAX_PATH_LENGTH)
}).strict();
const workspaceFileWritePayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
  content: zod.z.string().max(MAX_BODY_BYTES)
}).strict();
const workspaceFileCreatePayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: trimmedString(MAX_PATH_LENGTH),
  content: zod.z.string().max(MAX_BODY_BYTES).optional()
}).strict();
const workspaceDirectoryCreatePayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: trimmedString(MAX_PATH_LENGTH)
}).strict();
const workspaceClipboardImageSavePayloadSchema = zod.z.object({
  workspaceRoot: trimmedString(MAX_PATH_LENGTH),
  currentFilePath: trimmedString(MAX_PATH_LENGTH),
  imageDirectory: optionalTrimmedString(MAX_PATH_LENGTH)
}).strict();
const workspaceEntryRenamePayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: trimmedString(MAX_PATH_LENGTH),
  newName: trimmedString(255)
}).strict();
const workspaceEntryDeletePayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: trimmedString(MAX_PATH_LENGTH)
}).strict();
const workspaceFileWatchPayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: trimmedString(MAX_PATH_LENGTH)
}).strict();
const writeExportPayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
  format: zod.z.enum(WRITE_EXPORT_FORMATS),
  content: zod.z.string().max(MAX_BODY_BYTES)
}).strict();
const writeRichClipboardPayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH),
  workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
  content: zod.z.string().max(MAX_BODY_BYTES)
}).strict();
const writeInlineEditRecentEditSchema = zod.z.object({
  source: zod.z.enum(["user", "inline-edit"]),
  ageMs: zod.z.number().int().min(0).max(24 * 60 * 60 * 1e3),
  filePath: optionalTrimmedString(MAX_PATH_LENGTH),
  from: zod.z.number().int().min(0).max(MAX_BODY_BYTES),
  to: zod.z.number().int().min(0).max(MAX_BODY_BYTES),
  deletedText: zod.z.string().max(8e3),
  insertedText: zod.z.string().max(8e3),
  beforeContext: zod.z.string().max(4e3),
  afterContext: zod.z.string().max(4e3),
  instruction: zod.z.string().trim().min(1).max(1e4).optional(),
  scopeKind: zod.z.enum(["selection", "paragraph"]).optional()
}).strict().refine((edit) => edit.to >= edit.from, {
  message: "Recent edit end must be greater than or equal to start."
});
const writeInlineCompletionEditCandidateSchema = zod.z.object({
  kind: zod.z.enum(["selection", "paragraph"]),
  from: zod.z.number().int().min(0).max(MAX_BODY_BYTES),
  to: zod.z.number().int().min(0).max(MAX_BODY_BYTES),
  startLine: zod.z.number().int().positive().max(1e6),
  startColumn: zod.z.number().int().positive().max(1e6),
  endLine: zod.z.number().int().positive().max(1e6),
  endColumn: zod.z.number().int().positive().max(1e6),
  original: zod.z.string().max(MAX_EDITOR_COMPLETION_TEXT),
  selectedText: zod.z.string().max(5e4).optional()
}).strict().refine((scope) => scope.to >= scope.from, {
  message: "Completion edit candidate end must be greater than or equal to start."
});
const writeInlineCompletionPayloadSchema = zod.z.object({
  prefix: zod.z.string().max(MAX_EDITOR_COMPLETION_TEXT),
  suffix: zod.z.string().max(MAX_EDITOR_COMPLETION_TEXT),
  mode: zod.z.enum(["short", "long", "edit"]).optional(),
  workspaceRoot: optionalTrimmedString(MAX_PATH_LENGTH),
  currentFilePath: optionalTrimmedString(MAX_PATH_LENGTH),
  cursor: zod.z.object({
    line: zod.z.number().int().positive().max(1e6),
    column: zod.z.number().int().min(0).max(1e6)
  }).strict(),
  context: zod.z.object({
    language: trimmedString(64),
    currentLinePrefix: zod.z.string().max(2e4),
    currentLineSuffix: zod.z.string().max(2e4),
    previousLine: zod.z.string().max(2e4),
    previousNonEmptyLine: zod.z.string().max(2e4),
    nextLine: zod.z.string().max(2e4),
    indentation: zod.z.string().max(2e3),
    signals: zod.z.object({
      list: zod.z.boolean(),
      quote: zod.z.boolean(),
      heading: zod.z.boolean(),
      table: zod.z.boolean(),
      atLineEnd: zod.z.boolean(),
      endsWithSentencePunctuation: zod.z.boolean(),
      previousLineEndsWithSentencePunctuation: zod.z.boolean(),
      prefersNewLineCompletion: zod.z.boolean(),
      paragraphBreakOpportunity: zod.z.boolean()
    }).strict()
  }).strict(),
  policy: zod.z.object({
    name: trimmedString(128),
    instruction: zod.z.string().max(5e4),
    acceptanceCriteria: zod.z.array(zod.z.string().max(5e3)).max(12),
    rejectionCriteria: zod.z.array(zod.z.string().max(5e3)).max(12)
  }).strict(),
  preview: zod.z.object({
    local: zod.z.string().max(5e3),
    documentTail: zod.z.string().max(2e4)
  }).strict(),
  editCandidate: writeInlineCompletionEditCandidateSchema.optional(),
  recentEdits: zod.z.array(writeInlineEditRecentEditSchema).max(12).optional(),
  model: optionalTrimmedString(128)
}).strict();
const shellOpenExternalUrlSchema = trimmedString(MAX_URL_LENGTH).refine(
  isSafeOpenExternalUrl,
  { message: "Only http, https, and mailto URLs are allowed." }
);
const knowledgeOpenFilePayloadSchema = zod.z.object({
  path: trimmedString(MAX_PATH_LENGTH)
}).strict();
const notificationPayloadSchema = zod.z.object({
  threadId: optionalTrimmedString(MAX_ID_LENGTH),
  title: trimmedString(MAX_NOTIFICATION_TITLE_LENGTH),
  body: trimmedString(MAX_NOTIFICATION_BODY_LENGTH)
}).strict();
const guiUpdateChannelSchema = zod.z.enum(GUI_UPDATE_CHANNELS).optional();
const desktopCommandSchema = zod.z.enum(DESKTOP_COMMANDS);
const logErrorPayloadSchema = zod.z.object({
  category: trimmedString(128),
  message: trimmedString(2e3),
  detail: zod.z.unknown().optional()
}).strict();
const clawMirrorPayloadSchema = zod.z.object({
  threadId: trimmedString(MAX_ID_LENGTH),
  text: zod.z.string().trim().min(1).max(MAX_CHANNEL_TEXT_LENGTH),
  direction: zod.z.enum(["user", "assistant"])
}).strict();
const clawTaskFromTextPayloadSchema = zod.z.object({
  text: zod.z.string().trim().min(1).max(MAX_CHANNEL_TEXT_LENGTH),
  channelId: zod.z.string().trim().min(1).max(MAX_ID_LENGTH).nullable().optional(),
  modelHint: zod.z.string().trim().min(1).max(128).nullable().optional(),
  mode: zod.z.enum(["agent", "plan"]).nullable().optional()
}).strict();
const scheduleTaskFromTextPayloadSchema = zod.z.object({
  text: zod.z.string().trim().min(1).max(MAX_CHANNEL_TEXT_LENGTH),
  workspaceRoot: defaultPathSchema,
  modelHint: zod.z.string().trim().min(1).max(128).nullable().optional(),
  mode: zod.z.enum(["agent", "plan"]).nullable().optional()
}).strict();
const clawImInstallPollPayloadSchema = zod.z.object({
  provider: clawImProviderSchema,
  deviceCode: trimmedString(MAX_DEVICE_CODE_LENGTH)
}).strict();
const sseStartPayloadSchema = zod.z.object({
  threadId: trimmedString(MAX_ID_LENGTH),
  sinceSeq: zod.z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  streamId: optionalTrimmedString(MAX_ID_LENGTH)
}).strict();
const documentGenerationPayloadSchema = zod.z.object({
  templateName: zod.z.string().min(1).max(200),
  templateDescription: zod.z.string().max(2e3),
  templateContent: zod.z.string().max(5e4),
  fields: zod.z.array(
    zod.z.object({
      id: zod.z.string().max(200),
      label: zod.z.string().max(200),
      type: zod.z.string().max(50),
      value: zod.z.string().max(1e4),
      required: zod.z.boolean().optional()
    })
  ).max(200),
  legalBasis: zod.z.array(zod.z.string().max(1e3)).max(50).optional()
}).strict();
const streamIdSchema = trimmedString(MAX_ID_LENGTH);
const userTemplateSchema = zod.z.object({
  id: zod.z.string().min(1).max(200),
  name: zod.z.string().min(1).max(200),
  description: zod.z.string().max(2e3),
  category: zod.z.literal("custom"),
  content: zod.z.string().max(5e4),
  fields: zod.z.array(
    zod.z.object({
      id: zod.z.string().min(1).max(200),
      label: zod.z.string().min(1).max(200),
      type: zod.z.enum(["text", "textarea", "date", "select", "array"]),
      placeholder: zod.z.string().max(1e3).optional(),
      options: zod.z.array(zod.z.string().max(200)).max(100).optional(),
      required: zod.z.boolean().optional()
    })
  ).max(200),
  legalBasis: zod.z.array(zod.z.string().max(1e3)).max(50).optional(),
  sourceFile: zod.z.string().max(1e3).optional(),
  createdAt: zod.z.string(),
  updatedAt: zod.z.string()
}).strict();
const templateLearningRequestSchema = zod.z.object({
  fileContent: zod.z.string().min(1).max(1e5),
  fileName: zod.z.string().min(1).max(500),
  suggestedName: zod.z.string().max(200).optional()
}).strict();
const templateGenerateWithMaterialsRequestSchema = zod.z.object({
  template: zod.z.object({
    id: zod.z.string().max(200).optional(),
    name: zod.z.string().min(1).max(200),
    description: zod.z.string().max(2e3),
    content: zod.z.string().min(1).max(5e4),
    fields: zod.z.array(
      zod.z.object({
        id: zod.z.string().min(1).max(200),
        label: zod.z.string().min(1).max(200),
        type: zod.z.enum(["text", "textarea", "date", "select", "array"]),
        placeholder: zod.z.string().max(1e3).optional(),
        options: zod.z.array(zod.z.string().max(200)).max(100).optional(),
        required: zod.z.boolean().optional()
      })
    ).max(200),
    legalBasis: zod.z.array(zod.z.string().max(1e3)).max(50).optional()
  }),
  fieldValues: zod.z.record(zod.z.string(), zod.z.string().max(5e4)),
  materials: zod.z.array(
    zod.z.object({
      fileName: zod.z.string().max(500),
      content: zod.z.string().max(1e5)
    })
  ).max(20).optional(),
  instructions: zod.z.string().max(5e3).optional()
}).strict();
const documentHistoryRecordSchema = zod.z.object({
  id: zod.z.string().min(1).max(200),
  templateName: zod.z.string().min(1).max(200),
  templateCategory: zod.z.string().max(50),
  templateSource: zod.z.enum(["builtin", "custom"]),
  fieldValues: zod.z.record(zod.z.string(), zod.z.string().max(5e4)),
  materialFileNames: zod.z.array(zod.z.string().max(500)).max(50),
  instructions: zod.z.string().max(1e4),
  generatedContent: zod.z.string().min(1).max(2e5),
  model: zod.z.string().max(200).optional(),
  createdAt: zod.z.string()
}).strict();
const execFileAsync = node_util.promisify(node_child_process.execFile);
async function runGit(cwd, args, timeout = 1e4) {
  const { stdout, stderr } = await execFileAsync("git", args, {
    cwd,
    timeout,
    maxBuffer: 1024 * 1024
  });
  return { stdout: String(stdout), stderr: String(stderr) };
}
function gitFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/not a git repository/i.test(message)) {
    return { ok: false, reason: "not_git_repo", message: "The working directory is not a Git repository." };
  }
  if (/ENOENT/i.test(message) || /spawn git/i.test(message)) {
    return { ok: false, reason: "git_unavailable", message: "Git executable was not found." };
  }
  return { ok: false, reason: "error", message };
}
async function getGitBranches(workspaceRoot) {
  const cwd = workspaceRoot.trim();
  if (!cwd) {
    return { ok: false, reason: "no_workspace", message: "No working directory selected." };
  }
  try {
    const repositoryRoot = (await runGit(cwd, ["rev-parse", "--show-toplevel"])).stdout.trim();
    const currentRaw = (await runGit(cwd, ["branch", "--show-current"])).stdout.trim();
    const currentBranch = currentRaw || null;
    const branchLines = (await runGit(cwd, ["branch", "--format=%(refname:short)"])).stdout.split("\n").map((line) => line.trim()).filter(Boolean);
    const branchSet = new Set(branchLines);
    if (currentBranch && !branchSet.has(currentBranch)) branchSet.add(currentBranch);
    const branches = [...branchSet].map((name) => ({
      name,
      current: currentBranch === name
    }));
    const dirtyCount = (await runGit(cwd, ["status", "--porcelain=v1"])).stdout.split("\n").filter((line) => line.trim().length > 0).length;
    return { ok: true, repositoryRoot, currentBranch, branches, dirtyCount };
  } catch (error) {
    return gitFailure(error);
  }
}
async function switchGitBranch(workspaceRoot, branchName) {
  const cwd = workspaceRoot.trim();
  const branch = branchName.trim();
  if (!cwd) return { ok: false, reason: "no_workspace", message: "No working directory selected." };
  if (!branch) return { ok: false, reason: "error", message: "Branch name is required." };
  try {
    try {
      await runGit(cwd, ["switch", branch], 2e4);
    } catch {
      await runGit(cwd, ["checkout", branch], 2e4);
    }
    return getGitBranches(cwd);
  } catch (error) {
    return gitFailure(error);
  }
}
async function createAndSwitchGitBranch(workspaceRoot, branchName) {
  const cwd = workspaceRoot.trim();
  const branch = branchName.trim();
  if (!cwd) return { ok: false, reason: "no_workspace", message: "No working directory selected." };
  if (!branch) return { ok: false, reason: "error", message: "Branch name is required." };
  try {
    await runGit(cwd, ["check-ref-format", "--branch", branch]);
    try {
      await runGit(cwd, ["switch", "-c", branch], 2e4);
    } catch {
      await runGit(cwd, ["checkout", "-b", branch], 2e4);
    }
    return getGitBranches(cwd);
  } catch (error) {
    return gitFailure(error);
  }
}
const WRITE_TEXT_FILE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".md",
  ".markdown",
  ".mdx",
  ".txt",
  ".text"
]);
function isWriteTextFileExtension(ext) {
  return WRITE_TEXT_FILE_EXTENSIONS.has(ext.trim().toLowerCase());
}
const INDEX_CACHE_TTL_MS = 3e4;
const MAX_INDEX_BUILD_MS = 250;
const MAX_SCAN_ENTRIES = 8e3;
const MAX_INDEX_FILES = 160;
const MAX_FILE_BYTES = 6e5;
const MAX_INDEX_CHUNKS = 720;
const MAX_CHUNK_CHARS = 900;
const MIN_CHUNK_CHARS = 48;
const MAX_TOKENS_PER_CHUNK = 1200;
const MAX_QUERY_TERMS = 36;
const DEFAULT_MAX_SNIPPETS = 3;
const MAX_SNIPPET_CHARS = 520;
const SKIP_DIRS = /* @__PURE__ */ new Set([
  ".git",
  ".hg",
  ".svn",
  "node_modules",
  "dist",
  "out",
  "build",
  ".next",
  "coverage",
  ".cache",
  ".idea",
  ".pnpm-store",
  ".turbo",
  ".venv",
  ".vscode",
  ".yarn",
  ".yarn-cache",
  ".parcel-cache",
  "log",
  "logs",
  "target",
  "temp",
  "tmp",
  "vendor",
  "venv"
]);
const STOP_WORDS = /* @__PURE__ */ new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "from",
  "into",
  "about",
  "there",
  "their",
  "will",
  "would",
  "could",
  "should",
  "have",
  "has",
  "are",
  "was",
  "were",
  "been",
  "not",
  "but",
  "you",
  "your",
  "our",
  "can",
  "then",
  "when",
  "what",
  "how"
]);
const indexCache = /* @__PURE__ */ new Map();
const inFlightIndexCache = /* @__PURE__ */ new Map();
function deadlineExceeded(deadline) {
  return Date.now() > deadline;
}
function compactText$1(text = "") {
  return String(text || "").replace(/\r\n?/g, "\n").replace(/\s+/g, " ").trim();
}
function normalizeRelativePath(value) {
  return value.replaceAll("\\", "/");
}
function clipTail(text = "", maxChars = 0) {
  const source = String(text || "");
  if (!maxChars || source.length <= maxChars) return source;
  return source.slice(source.length - maxChars);
}
function normalizeLower(text = "") {
  return String(text || "").normalize("NFKC").toLowerCase();
}
function tokenAllowed(token) {
  if (!token || STOP_WORDS.has(token)) return false;
  if (/^\d+$/.test(token)) return false;
  return token.length >= 2;
}
function tokenizeWriteRetrievalText(text = "") {
  const source = normalizeLower(text);
  const tokens = [];
  const latinTerms = source.match(/[a-z0-9][a-z0-9_-]{1,}/g) ?? [];
  for (const term of latinTerms) {
    if (tokenAllowed(term)) tokens.push(term);
  }
  const hanSegments = source.match(new RegExp("\\p{Script=Han}+", "gu")) ?? [];
  for (const segment of hanSegments) {
    const chars = [...segment].slice(0, 120);
    if (chars.length === 1) {
      tokens.push(chars[0]);
      continue;
    }
    for (let size = 2; size <= Math.min(4, chars.length); size += 1) {
      for (let index = 0; index <= chars.length - size; index += 1) {
        tokens.push(chars.slice(index, index + size).join(""));
      }
    }
  }
  return tokens;
}
function termFrequency(tokens) {
  const map = /* @__PURE__ */ new Map();
  for (const token of tokens) {
    map.set(token, (map.get(token) ?? 0) + 1);
  }
  return map;
}
function isWithinWorkspace(workspaceRoot, targetPath) {
  const rel = node_path.relative(workspaceRoot, targetPath);
  return rel === "" || !rel.startsWith("..") && !node_path.isAbsolute(rel);
}
function resolveWorkspaceRoot(raw) {
  const value = raw?.trim();
  if (!value) return "";
  return node_path.resolve(expandHomePath$1(value));
}
function resolveComparablePath(raw) {
  const value = raw?.trim();
  if (!value) return "";
  return node_path.resolve(expandHomePath$1(value));
}
function isIndexedFile(path) {
  return isWriteTextFileExtension(node_path.extname(path).toLowerCase());
}
async function scanWorkspaceFiles(workspaceRoot, deadline) {
  const files = [];
  const stack = [workspaceRoot];
  let scanned = 0;
  while (stack.length > 0 && scanned < MAX_SCAN_ENTRIES && files.length < MAX_INDEX_FILES && !deadlineExceeded(deadline)) {
    const current = stack.pop();
    let entries;
    try {
      entries = await promises.readdir(current, { withFileTypes: true });
    } catch {
      continue;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name, void 0, { numeric: true, sensitivity: "base" }));
    for (const entry of entries) {
      if (deadlineExceeded(deadline)) break;
      scanned += 1;
      if (scanned >= MAX_SCAN_ENTRIES || files.length >= MAX_INDEX_FILES) break;
      if (entry.name === ".DS_Store") continue;
      const path = node_path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) stack.push(path);
        continue;
      }
      if (entry.isFile() && isIndexedFile(path)) files.push(path);
    }
  }
  return files;
}
function cleanHeading(text) {
  return text.replace(/^#{1,6}\s+/, "").replace(/\s+#+\s*$/, "").trim();
}
function headingFromLine(text) {
  const match = text.match(/^\s{0,3}#{1,6}\s+(.+?)\s*$/);
  return match ? cleanHeading(match[0]) : null;
}
function buildChunk(path, relativePath, title, lines, lineStart) {
  const raw = lines.join("\n").trim();
  const text = raw.length > MAX_CHUNK_CHARS + 160 ? `${raw.slice(0, MAX_CHUNK_CHARS).trimEnd()}...` : raw;
  if (compactText$1(text).length < MIN_CHUNK_CHARS) return null;
  const tokens = tokenizeWriteRetrievalText(`${title}
${text}`).slice(0, MAX_TOKENS_PER_CHUNK);
  if (tokens.length === 0) return null;
  return {
    path,
    relativePath,
    title,
    text,
    lowerText: normalizeLower(text),
    tokens,
    termFrequency: termFrequency(tokens),
    titleTokens: new Set(tokenizeWriteRetrievalText(title)),
    pathTokens: new Set(tokenizeWriteRetrievalText(relativePath.replace(/[\\/._-]+/g, " "))),
    lineStart,
    lineEnd: lineStart + lines.length - 1
  };
}
function chunkMarkdown(path, relativePath, content) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const chunks = [];
  let currentTitle = node_path.basename(path);
  let buffer = [];
  let lineStart = 1;
  let charCount = 0;
  const flush = () => {
    const chunk = buildChunk(path, relativePath, currentTitle, buffer, lineStart);
    if (chunk) chunks.push(chunk);
    buffer = [];
    charCount = 0;
  };
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = headingFromLine(line);
    if (heading) {
      if (buffer.length > 0) flush();
      currentTitle = heading;
      lineStart = index + 1;
    } else if (buffer.length === 0) {
      lineStart = index + 1;
    }
    buffer.push(line);
    charCount += line.length + 1;
    const paragraphBreak = !line.trim() && charCount >= 360;
    if (paragraphBreak || charCount >= MAX_CHUNK_CHARS) flush();
  }
  if (buffer.length > 0) flush();
  return chunks;
}
async function readIndexableFile(path, deadline) {
  if (deadlineExceeded(deadline)) return "";
  const info = await promises.stat(path);
  if (!info.isFile() || info.size <= 0) return "";
  const maxBytes = Math.min(info.size, MAX_FILE_BYTES);
  const handle = await promises.open(path, "r");
  try {
    const buffer = Buffer.alloc(maxBytes);
    const { bytesRead } = await handle.read(buffer, 0, maxBytes, 0);
    const bytes = buffer.subarray(0, bytesRead);
    if (bytes.includes(0)) return "";
    if (deadlineExceeded(deadline)) return "";
    return bytes.toString("utf8");
  } finally {
    await handle.close();
  }
}
async function buildWorkspaceIndex(workspaceRoot) {
  const deadline = Date.now() + MAX_INDEX_BUILD_MS;
  const files = await scanWorkspaceFiles(workspaceRoot, deadline);
  const chunks = [];
  let indexedFiles = 0;
  for (const path of files) {
    if (chunks.length >= MAX_INDEX_CHUNKS || deadlineExceeded(deadline)) break;
    try {
      const content = await readIndexableFile(path, deadline);
      if (!content.trim()) continue;
      const relativePath = normalizeRelativePath(node_path.relative(workspaceRoot, path) || node_path.basename(path));
      const fileChunks = chunkMarkdown(path, relativePath, content);
      if (fileChunks.length > 0) indexedFiles += 1;
      chunks.push(...fileChunks.slice(0, Math.max(0, MAX_INDEX_CHUNKS - chunks.length)));
    } catch {
    }
  }
  const documentFrequency = /* @__PURE__ */ new Map();
  let tokenCount = 0;
  for (const chunk of chunks) {
    tokenCount += chunk.tokens.length;
    for (const token of new Set(chunk.tokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }
  return {
    workspaceRoot,
    builtAt: Date.now(),
    files: indexedFiles,
    chunks,
    averageLength: chunks.length > 0 ? tokenCount / chunks.length : 1,
    documentFrequency
  };
}
async function loadWorkspaceIndex(workspaceRoot) {
  const cached = indexCache.get(workspaceRoot);
  if (cached && Date.now() - cached.builtAt <= INDEX_CACHE_TTL_MS) return cached;
  const existing = inFlightIndexCache.get(workspaceRoot);
  if (existing) return existing;
  const build = buildWorkspaceIndex(workspaceRoot).then((index) => {
    indexCache.set(workspaceRoot, index);
    return index;
  }).finally(() => {
    inFlightIndexCache.delete(workspaceRoot);
  });
  inFlightIndexCache.set(workspaceRoot, build);
  return build;
}
function addWeightedTerms(weights, text, weight) {
  for (const token of tokenizeWriteRetrievalText(text)) {
    weights.set(token, (weights.get(token) ?? 0) + weight);
  }
}
function extractPhrases(request) {
  const candidates = [
    request.context.currentLinePrefix,
    request.context.previousNonEmptyLine,
    request.context.previousLine,
    request.editCandidate?.original,
    ...(request.recentEdits ?? []).flatMap((edit) => [edit.deletedText, edit.insertedText])
  ];
  const phrases = [];
  for (const candidate of candidates) {
    const compact = compactText$1(candidate);
    if (compact.length >= 8) phrases.push(normalizeLower(clipTail(compact, 80)));
  }
  return [...new Set(phrases)].slice(0, 4);
}
function buildQueryModel(request) {
  const weights = /* @__PURE__ */ new Map();
  addWeightedTerms(weights, request.context.currentLinePrefix, 3);
  addWeightedTerms(weights, request.context.previousNonEmptyLine, 2);
  addWeightedTerms(weights, request.context.previousLine, 1.4);
  addWeightedTerms(weights, request.editCandidate?.original ?? "", 1.8);
  addWeightedTerms(weights, request.preview.documentTail, 1);
  for (const edit of request.recentEdits ?? []) {
    addWeightedTerms(weights, edit.deletedText, 1.6);
    addWeightedTerms(weights, edit.insertedText, 1.8);
  }
  addWeightedTerms(weights, clipTail(request.prefix, 700), 0.7);
  const ranked = [...weights.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length || a[0].localeCompare(b[0])).slice(0, MAX_QUERY_TERMS);
  const terms = ranked.map(([term]) => term);
  const queryText = compactText$1([
    request.context.currentLinePrefix,
    request.context.previousNonEmptyLine,
    request.editCandidate?.original ?? "",
    ...(request.recentEdits ?? []).flatMap((edit) => [edit.deletedText, edit.insertedText]),
    request.preview.documentTail
  ].join(" ")).slice(0, 240);
  return {
    text: queryText,
    terms,
    weights: new Map(ranked),
    phrases: extractPhrases(request)
  };
}
function bm25Score(chunk, index, query) {
  const totalDocs = Math.max(1, index.chunks.length);
  const averageLength = Math.max(1, index.averageLength);
  const k1 = 1.2;
  const b = 0.72;
  let score = 0;
  for (const term of query.terms) {
    const tf = chunk.termFrequency.get(term) ?? 0;
    if (!tf) continue;
    const df = index.documentFrequency.get(term) ?? 0;
    const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
    const normalized = tf * (k1 + 1) / (tf + k1 * (1 - b + b * (chunk.tokens.length / averageLength)));
    const weight = query.weights.get(term) ?? 1;
    score += weight * idf * normalized;
  }
  return score;
}
function keywordScore(chunk, query) {
  const keywords = [];
  let score = 0;
  for (const term of query.terms) {
    if (!chunk.termFrequency.has(term)) continue;
    keywords.push(term);
    const weight = query.weights.get(term) ?? 1;
    if (chunk.titleTokens.has(term)) score += 0.35 * weight;
    if (chunk.pathTokens.has(term)) score += 0.18 * weight;
  }
  if (keywords.length > 0) score += Math.sqrt(keywords.length) * 0.18;
  for (const phrase of query.phrases) {
    if (phrase.length >= 8 && chunk.lowerText.includes(phrase)) score += 0.9;
  }
  return { score, keywords: keywords.slice(0, 8) };
}
function bestSnippetText(chunk, keywords) {
  const compact = chunk.text.replace(/\r\n?/g, "\n").trim();
  if (compact.length <= MAX_SNIPPET_CHARS) return compact;
  const lower = normalizeLower(compact);
  let bestIndex = -1;
  for (const keyword of keywords) {
    const index = lower.indexOf(keyword);
    if (index >= 0 && (bestIndex < 0 || index < bestIndex)) bestIndex = index;
  }
  const center = bestIndex >= 0 ? bestIndex : Math.floor(compact.length / 2);
  const start = Math.max(0, center - Math.floor(MAX_SNIPPET_CHARS / 2));
  const end = Math.min(compact.length, start + MAX_SNIPPET_CHARS);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < compact.length ? "..." : "";
  return `${prefix}${compact.slice(start, end).trim()}${suffix}`;
}
function rankChunks(index, query, currentFilePath, maxSnippets) {
  const ranked = index.chunks.filter((chunk) => !currentFilePath || resolveComparablePath(chunk.path) !== currentFilePath).map((chunk) => {
    const keyword = keywordScore(chunk, query);
    const score = bm25Score(chunk, index, query) + keyword.score;
    return {
      chunk,
      score,
      keywords: keyword.keywords
    };
  }).filter((item) => item.score >= 0.25 && item.keywords.length > 0).sort((a, b) => b.score - a.score);
  const snippets = [];
  const perFile = /* @__PURE__ */ new Map();
  const seenText = /* @__PURE__ */ new Set();
  for (const item of ranked) {
    if (snippets.length >= maxSnippets) break;
    const used = perFile.get(item.chunk.path) ?? 0;
    if (used >= 2) continue;
    const snippetText = bestSnippetText(item.chunk, item.keywords);
    const signature = compactText$1(snippetText).slice(0, 120);
    if (!signature || seenText.has(signature)) continue;
    seenText.add(signature);
    perFile.set(item.chunk.path, used + 1);
    snippets.push({
      path: item.chunk.relativePath,
      title: item.chunk.title,
      text: snippetText,
      score: Number(item.score.toFixed(3)),
      keywords: item.keywords,
      lineStart: item.chunk.lineStart,
      lineEnd: item.chunk.lineEnd
    });
  }
  return snippets;
}
async function retrieveWriteInlineCompletionContext(request, options = {}) {
  const workspaceRoot = resolveWorkspaceRoot(request.workspaceRoot);
  if (!workspaceRoot) return null;
  const currentFilePath = resolveComparablePath(request.currentFilePath);
  if (currentFilePath && !isWithinWorkspace(workspaceRoot, currentFilePath)) return null;
  const index = await loadWorkspaceIndex(workspaceRoot);
  if (index.chunks.length === 0) return null;
  const query = buildQueryModel(request);
  if (query.terms.length === 0) return null;
  const snippets = rankChunks(
    index,
    query,
    currentFilePath,
    Math.max(1, Math.min(6, Math.round(options.maxSnippets ?? DEFAULT_MAX_SNIPPETS)))
  );
  if (snippets.length === 0) return null;
  return {
    source: "bm25-keyword",
    query: query.text,
    keywords: query.terms.slice(0, 12),
    snippets,
    indexedFiles: index.files,
    indexedChunks: index.chunks.length
  };
}
const INLINE_COMPLETION_TIMEOUT_MS = 12e3;
const MAX_INLINE_COMPLETION_DEBUG_ENTRIES = 120;
const MAX_DEBUG_TEXT_CHARS = 8e4;
const INPUT_BOUNDARY_MARKERS = ["PREFIX", "SUFFIX", "EDIT_SCOPE"];
const OUTPUT_ACTION_MARKERS = ["SHORT", "LONG", "EDIT"];
function shouldDisableThinkingForInlineCompletion(model) {
  const normalized = model.trim().toLowerCase();
  return normalized.startsWith("deepseek-v4") || normalized === "deepseek-reasoner";
}
const inlineCompletionDebugEntries = [];
function clipDebugText(text = "") {
  const source = String(text || "");
  if (source.length <= MAX_DEBUG_TEXT_CHARS) return source;
  const head = Math.floor(MAX_DEBUG_TEXT_CHARS * 0.62);
  const tail = MAX_DEBUG_TEXT_CHARS - head - 24;
  return `${source.slice(0, head)}

... debug text clipped ...

${source.slice(source.length - tail)}`;
}
function appendInlineCompletionDebugEntry(entry) {
  inlineCompletionDebugEntries.push({
    ...entry,
    prompt: clipDebugText(entry.prompt),
    suffix: clipDebugText(entry.suffix),
    rawResponse: clipDebugText(entry.rawResponse),
    completion: clipDebugText(entry.completion)
  });
  if (inlineCompletionDebugEntries.length > MAX_INLINE_COMPLETION_DEBUG_ENTRIES) {
    inlineCompletionDebugEntries.splice(0, inlineCompletionDebugEntries.length - MAX_INLINE_COMPLETION_DEBUG_ENTRIES);
  }
}
function listWriteInlineCompletionDebugEntries() {
  return [...inlineCompletionDebugEntries].reverse();
}
function clearWriteInlineCompletionDebugEntries() {
  inlineCompletionDebugEntries.length = 0;
}
function appendInlineCompletionPreflightFailure(startedAt, settings, request, message) {
  const model = resolveModel(request, settings);
  const mode = resolveMode(request);
  const prompt = buildWriteInlineCompletionPrompt(request, null);
  appendInlineCompletionDebugEntry({
    id: node_crypto.randomUUID(),
    createdAt: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
    ok: false,
    model,
    mode,
    currentFilePath: request.currentFilePath,
    prompt,
    suffix: request.suffix,
    rawResponse: "",
    completion: "",
    actionKind: void 0,
    errorMessage: message,
    referenceCount: 0,
    recentEditCount: request.recentEdits?.length ?? 0,
    promptChars: prompt.length,
    suffixChars: request.suffix.length,
    responseChars: 0
  });
}
function resolveModel(request, settings) {
  return resolveWriteInlineCompletionModel(settings, request.model);
}
function resolveMode(request) {
  if (request.mode === "edit") return "edit";
  return request.mode === "long" ? "long" : "short";
}
function flattenMessageContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((part) => part?.type === "text" || part?.text ? part?.text ?? "" : "").join("");
}
function cleanCompletionText(raw) {
  const normalized = raw.replace(/\r\n?/g, "\n").replaceAll(String.fromCharCode(0), "");
  const trimmed = normalized.trim();
  if (!trimmed) return "";
  const fenced = trimmed.match(/^```(?:\w+)?\n([\s\S]*?)\n```$/);
  if (fenced) return fenced[1];
  if (trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }
  return normalized;
}
function trimMarkerPadding(text = "") {
  return String(text || "").replace(/\n$/, "");
}
function markerBlock(marker, text = "") {
  return `<<<${marker}
${sanitizePromptLine(text)}
>>>`;
}
function sanitizePromptLine(text = "") {
  return String(text || "").replace(/\r\n?/g, "\n").replace(/-->/g, "--\\>");
}
function compactText(text = "") {
  return String(text || "").replace(/\s+/g, " ").trim();
}
function clipPromptText(text = "", maxChars = 0) {
  const source = sanitizePromptLine(text);
  if (!maxChars || source.length <= maxChars) return source;
  const head = Math.max(1, Math.floor(maxChars * 0.58));
  const tail = Math.max(1, maxChars - head - 13);
  return `${source.slice(0, head)}
... omitted ...
${source.slice(source.length - tail)}`;
}
function formatRecentEditAge(ageMs) {
  const seconds = Math.max(0, Math.round(ageMs / 1e3));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.round(minutes / 60)}h ago`;
}
function buildRecentEditsPromptBlock(edits) {
  const recentEdits = (edits ?? []).filter((edit) => edit.deletedText || edit.insertedText || edit.instruction).slice(-8);
  if (recentEdits.length === 0) return [];
  const lines = [
    "",
    "Recent local edits in this file. Treat these as intent signals. If they clearly imply that the user is continuing a local rewrite, you may choose EDIT. If they only show ordinary typing, choose COMPLETION or return an empty completion."
  ];
  recentEdits.forEach((edit, index) => {
    lines.push("");
    lines.push(`[${index + 1}] ${formatRecentEditAge(edit.ageMs)}; source=${edit.source}; range=${edit.from}-${edit.to}${edit.scopeKind ? `; scope=${edit.scopeKind}` : ""}`);
    if (edit.instruction) lines.push(`Instruction: ${clipPromptText(edit.instruction, 420)}`);
    if (edit.deletedText) lines.push(`Deleted: ${clipPromptText(edit.deletedText, 520)}`);
    if (edit.insertedText) lines.push(`Inserted: ${clipPromptText(edit.insertedText, 520)}`);
    const around = compactText(`${edit.beforeContext} [[edit]] ${edit.afterContext}`);
    if (around) lines.push(`Around: ${clipPromptText(around, 520)}`);
  });
  return lines;
}
function buildEditCandidatePromptBlock(request) {
  const candidate = request.editCandidate;
  if (!candidate) return [];
  const scopeLines = candidate.startLine === candidate.endLine ? `line ${candidate.startLine}` : `lines ${candidate.startLine}-${candidate.endLine}`;
  return [
    "",
    "Editable local scope if EDIT is the best action.",
    "Choose EDIT when the user instruction or recent user changes make a replacement more useful than cursor completion.",
    `Edit candidate: ${candidate.kind}; ${scopeLines}; offsets ${candidate.from}-${candidate.to}.`,
    "Original editable scope boundary:",
    markerBlock("EDIT_SCOPE", candidate.original)
  ];
}
function buildEditActionGuidanceBlock(request) {
  if (!request.editCandidate) return [];
  return [
    "",
    "Edit action guidance:",
    "An editable scope is available in <<<EDIT_SCOPE ... >>>. Return <<<EDIT ... >>> only when replacing that exact scope is the best local action.",
    "If the user is simply continuing at the cursor, return <<<SHORT ... >>> or <<<LONG ... >>> instead."
  ];
}
function buildResponseProtocolPromptBlock() {
  return [
    "Return exactly one TextIDE-style action block and nothing else:",
    "<<<SHORT",
    "short text to insert at the cursor",
    ">>>",
    "<<<LONG",
    "longer continuation to insert at the cursor",
    ">>>",
    "<<<EDIT",
    "replacement text for the editable local scope",
    ">>>"
  ];
}
function buildMarkedContextBlocks(request) {
  return [
    "",
    "Boundary-marked cursor context:",
    markerBlock("PREFIX", request.prefix),
    markerBlock("SUFFIX", request.suffix)
  ];
}
function buildRetrievalPromptBlock(retrieval, mode) {
  const lines = [
    "",
    "Reference snippets from the same writing workspace.",
    "Use these snippets only for local terminology, factual continuity, and style. Do not mention them in the returned action.",
    `Completion mode: ${mode}.`,
    `Retrieval: ${retrieval.source}; indexed ${retrieval.indexedFiles} files / ${retrieval.indexedChunks} chunks.`,
    `Query keywords: ${retrieval.keywords.join(", ")}`
  ];
  retrieval.snippets.forEach((snippet, index) => {
    const location = snippet.lineStart === snippet.lineEnd ? `${snippet.path}:${snippet.lineStart}` : `${snippet.path}:${snippet.lineStart}-${snippet.lineEnd}`;
    lines.push("");
    lines.push(`[${index + 1}] ${location}`);
    if (snippet.title) lines.push(`Title: ${sanitizePromptLine(snippet.title)}`);
    lines.push(`Matched: ${snippet.keywords.join(", ")}`);
    lines.push(sanitizePromptLine(snippet.text));
  });
  return lines;
}
function buildWriteInlineCompletionPrompt(request, retrieval = null) {
  const mode = resolveMode(request);
  const lines = [
    "<!-- legalwork inline completion.",
    "Complete the text at the cursor.",
    "The boundary blocks below identify local context, but the response must be plain insertable text only.",
    "Return only the text to insert at the cursor.",
    "Do not wrap the answer in quotes, Markdown fences, XML, JSON, or action markers.",
    "Do not echo <<<PREFIX ... >>>, <<<SUFFIX ... >>>, or these instructions.",
    mode === "long" ? "The user has paused for inspiration. Suggest one compact, grounded continuation only when it clearly fits." : "Prefer a short, precise continuation that looks like the next few keystrokes.",
    "Return an empty response only when there is no sensible local continuation.",
    `Trigger hint: ${mode}.`,
    `Cursor: line ${request.cursor.line}, column ${request.cursor.column}.`,
    `Language: ${sanitizePromptLine(request.context.language)}.`,
    `Policy: ${sanitizePromptLine(request.policy.name)}.`,
    sanitizePromptLine(request.policy.instruction),
    "",
    "Cursor context:",
    `Current line prefix: ${sanitizePromptLine(request.context.currentLinePrefix)}`,
    `Current line suffix: ${sanitizePromptLine(request.context.currentLineSuffix)}`,
    `Previous non-empty line: ${sanitizePromptLine(request.context.previousNonEmptyLine)}`,
    `Next line: ${sanitizePromptLine(request.context.nextLine)}`,
    `Signals: ${JSON.stringify(request.context.signals)}`,
    ...buildRecentEditsPromptBlock(request.recentEdits),
    ...retrieval?.snippets.length ? buildRetrievalPromptBlock(retrieval, mode) : [],
    ...buildMarkedContextBlocks(request),
    "For the FIM engine, the raw prefix also follows this instruction block.",
    "-->",
    ""
  ];
  return `${lines.join("\n")}${request.prefix}`;
}
function buildChatPromptSection(marker, text = "") {
  return markerBlock(marker, text);
}
function buildWriteInlineCompletionChatMessages(request, retrieval = null) {
  const mode = resolveMode(request);
  const userLines = [
    `Trigger hint: ${mode}. The model must decide whether the returned type is short, long, or edit.`,
    `Cursor: line ${request.cursor.line}, column ${request.cursor.column}.`,
    `Language: ${sanitizePromptLine(request.context.language)}.`,
    `Policy: ${sanitizePromptLine(request.policy.name)}.`,
    sanitizePromptLine(request.policy.instruction),
    "",
    ...buildResponseProtocolPromptBlock(),
    "",
    "Choose SHORT for normal next-keystroke writing, sentence continuation, or list continuation.",
    "Choose LONG when the local context clearly needs a fuller next thought or paragraph.",
    "Choose EDIT when the user instruction or recent local edits imply an existing nearby scope should be rewritten.",
    "If neither action is useful, return an empty <<<SHORT ... >>> block.",
    "Do not echo <<<PREFIX ... >>>, <<<SUFFIX ... >>>, or <<<EDIT_SCOPE ... >>> in the response.",
    "",
    "Cursor context:",
    `Current line prefix: ${sanitizePromptLine(request.context.currentLinePrefix)}`,
    `Current line suffix: ${sanitizePromptLine(request.context.currentLineSuffix)}`,
    `Previous non-empty line: ${sanitizePromptLine(request.context.previousNonEmptyLine)}`,
    `Next line: ${sanitizePromptLine(request.context.nextLine)}`,
    `Signals: ${JSON.stringify(request.context.signals)}`,
    ...buildEditActionGuidanceBlock(request),
    ...buildRecentEditsPromptBlock(request.recentEdits),
    ...buildEditCandidatePromptBlock(request),
    ...retrieval?.snippets.length ? buildRetrievalPromptBlock(retrieval, mode) : [],
    "",
    buildChatPromptSection("PREFIX", request.prefix),
    buildChatPromptSection("SUFFIX", request.suffix)
  ];
  return [
    {
      role: "system",
      content: [
        "You are legalwork inline writing. You perform local writing completion and in-place text edits.",
        "For edit tasks, reason from <<<PREFIX ... >>>, <<<EDIT_SCOPE ... >>>, and <<<SUFFIX ... >>>, then return only the replacement inside <<<EDIT ... >>>.",
        "Do not include explanations, markdown fences outside the marked action, before/after labels, or unchanged surrounding text outside the chosen action."
      ].join("\n")
    },
    {
      role: "user",
      content: userLines.join("\n")
    }
  ];
}
function debugPromptFromMessages(messages) {
  return messages.map((message) => `## ${message.role}
${message.content}`).join("\n\n");
}
function providerTextFromResponse(responseText) {
  let parsed;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Inline completion provider returned non-JSON data.");
  }
  const firstChoice = parsed.choices?.[0];
  if (typeof firstChoice?.text === "string") return firstChoice.text;
  const first = firstChoice?.message?.content;
  return flattenMessageContent(first);
}
function completionAction(text, kind = "short") {
  return { kind, text: cleanCompletionText(text) };
}
function editAction(replacement, target) {
  const cleaned = cleanCompletionText(replacement);
  if (!target) return completionAction(cleaned);
  return {
    kind: "edit",
    replacement: cleaned,
    from: target.from,
    to: target.to,
    original: target.original,
    scopeKind: target.scopeKind
  };
}
function actionFromJsonValue(value, options) {
  if (!value || typeof value !== "object") return null;
  const record = value;
  const rawKind = String(record.kind ?? record.action ?? record.type ?? "").trim().toLowerCase();
  const text = String(record.text ?? record.completion ?? record.insert ?? record.replacement ?? record.edit ?? "");
  if (rawKind === "short" || rawKind === "completion" || rawKind === "insert") return completionAction(text, "short");
  if (rawKind === "long") return completionAction(text, "long");
  if (rawKind === "edit" || rawKind === "replacement" || rawKind === "replace") {
    return editAction(text, options.editTarget);
  }
  return null;
}
function containsInputBoundaryEcho(text) {
  return INPUT_BOUNDARY_MARKERS.some((marker) => new RegExp(`<<<\\s*${marker}\\b`, "i").test(text)) || text.includes("Return only the text to insert at the cursor.");
}
function parseMarkedActionBlock(text, options) {
  for (const marker of OUTPUT_ACTION_MARKERS) {
    const exact = new RegExp(`^<<<[ \\t]*${marker}[ \\t]*\\n([\\s\\S]*?)\\n?>>>$`, "i").exec(text);
    const embedded = exact ?? new RegExp(`<<<[ \\t]*${marker}[ \\t]*\\n([\\s\\S]*?)\\n?>>>`, "i").exec(text);
    if (!embedded) continue;
    const body = trimMarkerPadding(embedded[1]);
    if (marker === "SHORT") return completionAction(body, "short");
    if (marker === "LONG") return completionAction(body, "long");
    return editAction(body, options.editTarget);
  }
  return null;
}
function parseWriteInlineAction(raw, options = {}) {
  const fallbackKind = options.fallbackKind ?? "short";
  const normalized = raw.replace(/\r\n?/g, "\n").replaceAll(String.fromCharCode(0), "");
  const trimmed = normalized.trim();
  if (!trimmed) {
    return fallbackKind === "edit" ? editAction("", options.editTarget) : completionAction("", fallbackKind === "long" ? "long" : "short");
  }
  if (containsInputBoundaryEcho(trimmed)) {
    return fallbackKind === "edit" ? editAction("", options.editTarget) : completionAction("", fallbackKind === "long" ? "long" : "short");
  }
  const marked = parseMarkedActionBlock(trimmed, { editTarget: options.editTarget });
  if (marked) return marked;
  try {
    const parsed = JSON.parse(trimmed);
    const action = actionFromJsonValue(parsed, { editTarget: options.editTarget });
    if (action) return action;
  } catch {
  }
  const short = trimmed.match(/^<short(?:\s[^>]*)?>([\s\S]*?)<\/short>$/i) ?? trimmed.match(/<short(?:\s[^>]*)?>([\s\S]*?)<\/short>/i);
  if (short) return completionAction(short[1], "short");
  const long = trimmed.match(/^<long(?:\s[^>]*)?>([\s\S]*?)<\/long>$/i) ?? trimmed.match(/<long(?:\s[^>]*)?>([\s\S]*?)<\/long>/i);
  if (long) return completionAction(long[1], "long");
  const completion = trimmed.match(/^<completion(?:\s[^>]*)?>([\s\S]*?)<\/completion>$/i) ?? trimmed.match(/<completion(?:\s[^>]*)?>([\s\S]*?)<\/completion>/i);
  if (completion) return completionAction(completion[1], fallbackKind === "long" ? "long" : "short");
  const edit = trimmed.match(/^<edit(?:\s[^>]*)?>([\s\S]*?)<\/edit>$/i) ?? trimmed.match(/<edit(?:\s[^>]*)?>([\s\S]*?)<\/edit>/i);
  if (edit) return editAction(edit[1], options.editTarget);
  const labeledCompletion = trimmed.match(/^(?:completion|insert)[:：]\s*([\s\S]*)$/i);
  if (labeledCompletion) return completionAction(labeledCompletion[1], fallbackKind === "long" ? "long" : "short");
  const labeledShort = trimmed.match(/^(?:short)[:：]\s*([\s\S]*)$/i);
  if (labeledShort) return completionAction(labeledShort[1], "short");
  const labeledLong = trimmed.match(/^(?:long)[:：]\s*([\s\S]*)$/i);
  if (labeledLong) return completionAction(labeledLong[1], "long");
  const labeledEdit = trimmed.match(/^(?:edit|replacement|replace|new text|edited text|替换文本|修改后|修改|替换)[:：]\s*([\s\S]*)$/i);
  if (labeledEdit) return editAction(labeledEdit[1], options.editTarget);
  return fallbackKind === "edit" ? editAction(normalized, options.editTarget) : completionAction(normalized, fallbackKind === "long" ? "long" : "short");
}
function extractWriteInlineAction(responseText, options = {}) {
  return parseWriteInlineAction(providerTextFromResponse(responseText), options);
}
async function requestWriteInlineCompletion(settings, request) {
  const startedAt = Date.now();
  if (settings.write.inlineCompletion.enabled === false) {
    appendInlineCompletionPreflightFailure(startedAt, settings, request, "Inline completion is disabled.");
    return { ok: false, message: "Inline completion is disabled." };
  }
  const apiKey = resolveWriteInlineCompletionApiKey(settings);
  if (!apiKey) {
    appendInlineCompletionPreflightFailure(startedAt, settings, request, "Missing API key for inline completion.");
    return { ok: false, message: "Missing API key for inline completion." };
  }
  const model = resolveModel(request, settings);
  const mode = resolveMode(request);
  const actionMayEdit = Boolean(request.editCandidate && request.recentEdits?.length);
  const useChatCompletions = mode === "edit" || actionMayEdit;
  const baseUrl = resolveWriteInlineCompletionBaseUrl(settings);
  const url = useChatCompletions ? upstreamOpenAiChatCompletionsUrl(baseUrl) : upstreamDeepSeekFimCompletionsUrl(baseUrl);
  const maxTokens = mode === "long" || mode === "edit" || actionMayEdit ? settings.write.inlineCompletion.longMaxTokens || settings.write.inlineCompletion.maxTokens || DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS : settings.write.inlineCompletion.maxTokens || DEFAULT_WRITE_INLINE_COMPLETION_MAX_TOKENS;
  const retrieval = settings.write.inlineCompletion.retrievalEnabled === false ? null : await retrieveWriteInlineCompletionContext(request, {
    maxSnippets: mode === "long" || mode === "edit" || actionMayEdit ? 5 : 3
  }).catch(() => null);
  const messages = useChatCompletions ? buildWriteInlineCompletionChatMessages(request, retrieval) : null;
  const prompt = messages ? debugPromptFromMessages(messages) : buildWriteInlineCompletionPrompt(request, retrieval);
  const debugBase = {
    id: node_crypto.randomUUID(),
    createdAt: new Date(startedAt).toISOString(),
    model,
    mode,
    currentFilePath: request.currentFilePath,
    prompt,
    suffix: request.suffix,
    referenceCount: retrieval?.snippets.length ?? 0,
    recentEditCount: request.recentEdits?.length ?? 0,
    promptChars: prompt.length,
    suffixChars: request.suffix.length
  };
  try {
    const body = useChatCompletions ? {
      model,
      messages,
      max_tokens: maxTokens,
      ...shouldDisableThinkingForInlineCompletion(model) ? { thinking: { type: "disabled" } } : {}
    } : {
      model,
      prompt,
      suffix: request.suffix,
      max_tokens: maxTokens
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(INLINE_COMPLETION_TIMEOUT_MS)
    });
    const text = await response.text();
    if (!response.ok) {
      appendInlineCompletionDebugEntry({
        ...debugBase,
        durationMs: Date.now() - startedAt,
        ok: false,
        rawResponse: text,
        completion: "",
        responseChars: text.length,
        errorMessage: `Inline completion request failed (${response.status})`
      });
      return {
        ok: false,
        message: `Inline completion request failed (${response.status}): ${text.slice(0, 300)}`
      };
    }
    const action = extractWriteInlineAction(text, {
      fallbackKind: mode,
      editTarget: request.editCandidate ? {
        from: request.editCandidate.from,
        to: request.editCandidate.to,
        original: request.editCandidate.original,
        scopeKind: request.editCandidate.kind
      } : void 0
    });
    const completion = action.kind === "edit" ? action.replacement : action.text;
    const finalMode = action.kind;
    appendInlineCompletionDebugEntry({
      ...debugBase,
      mode: finalMode,
      durationMs: Date.now() - startedAt,
      ok: true,
      rawResponse: text,
      completion,
      actionKind: finalMode,
      responseChars: text.length
    });
    return {
      ok: true,
      completion,
      action,
      model,
      mode: finalMode
    };
  } catch (error) {
    appendInlineCompletionDebugEntry({
      ...debugBase,
      durationMs: Date.now() - startedAt,
      ok: false,
      rawResponse: "",
      completion: "",
      responseChars: 0,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
const DOCUMENT_GENERATION_TIMEOUT_MS = 6e4;
const DOCUMENT_GENERATION_MAX_TOKENS = 8192;
function buildDocumentGenerationPrompt(request) {
  const fieldDescriptions = request.fields.map((f) => {
    const required = f.required ? "（必填）" : "";
    const value = f.value || "（待填写）";
    return `- ${f.label}${required}：${value}`;
  }).join("\n");
  const legalBasisText = request.legalBasis && request.legalBasis.length > 0 ? `
法律依据：
${request.legalBasis.map((b) => `- ${b}`).join("\n")}` : "";
  const systemPrompt = `你是一名资深法律文书撰写专家。你的任务是根据用户提供的模板和填写的信息，生成一份格式规范、内容严谨、说理充分的法律文书。

要求：
1. 严格遵循中国法律文书的格式规范和用语习惯
2. 文书结构完整，逻辑清晰，事实陈述准确
3. 法律引用准确，说理充分
4. 按照用户选择的模板类型生成相应的文书内容
5. 使用专业、规范的法律语言
6. 将用户填写的信息自然地融入文书中，不简单罗列
7. 对于用户未填写的可选字段，根据上下文合理推断补充；缺失必填字段时给出合理占位

生成完整的法律文书，包含标题、当事人信息、案由、诉讼请求/申请事项、事实与理由、此致、落款等必要部分。`;
  const userPrompt = `请根据以下信息生成一份${request.templateName}。

模板说明：${request.templateDescription}
${legalBasisText}

填写的信息：
${fieldDescriptions}

模板结构参考：
${request.templateContent.slice(0, 2e3)}

请生成完整、规范的法律文书。`;
  return { systemPrompt, userPrompt };
}
async function generateDocument(settings, request) {
  const apiKey = resolveWriteInlineCompletionApiKey(settings);
  const baseUrl = resolveWriteInlineCompletionBaseUrl(settings);
  const model = resolveWriteInlineCompletionModel(settings);
  if (!apiKey) {
    return { ok: false, message: "未配置 API Key，请在设置中填写 API 密钥。" };
  }
  const url = upstreamOpenAiChatCompletionsUrl(baseUrl);
  const { systemPrompt, userPrompt } = buildDocumentGenerationPrompt(request);
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: DOCUMENT_GENERATION_MAX_TOKENS,
        temperature: 0.7,
        stream: false
      }),
      signal: AbortSignal.timeout(DOCUMENT_GENERATION_TIMEOUT_MS)
    });
    const text = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        message: `AI 生成请求失败 (${response.status}): ${text.slice(0, 300)}`
      };
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: false, message: "AI 返回了非 JSON 数据，请重试。" };
    }
    const content = parsed?.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, message: "AI 返回内容为空，请重试。" };
    }
    return { ok: true, content, model };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `AI 生成失败: ${message}` };
  }
}
const TIMEOUT_MS$1 = 6e4;
const MAX_TOKENS$1 = 4096;
function buildLearningPrompt(request) {
  const systemPrompt = `你是一位资深法律文书分析专家。你的任务是从用户上传的文档中提取出可复用的模板结构。

要求：
1. 仔细分析文档的格式、结构和常见法律文书要素
2. 识别出文档中的变量部分（如当事人姓名、案号、金额、日期等），将它们替换为 {{字段名}} 占位符
3. 生成一个结构清晰、可复用的模板内容（Markdown格式）
4. 为每个占位符字段定义合适的字段信息（标识符、标签、类型）
5. 识别文档类型并给出合适的模板名称和描述

字段类型说明：
- text: 短文本输入（如姓名、案号）
- textarea: 长文本输入（如事实描述、理由）
- date: 日期选择
- select: 选项选择（如法院名称）
- array: 数组/列表（如证据清单）

输出严格按JSON格式，不作额外说明。`;
  const userPrompt = `请分析以下文档，提取模板结构。

文件名：${request.fileName}
${request.suggestedName ? `建议模板名称：${request.suggestedName}` : ""}

文档内容：
\`\`\`
${request.fileContent.slice(0, 3e4)}
\`\`\`

请以JSON格式返回，格式为：
{
  "name": "模板名称",
  "description": "简短描述",
  "content": "模板内容（使用 {{字段名}} 作为占位符）",
  "fields": [
    { "id": "fieldId", "label": "字段显示名", "type": "text|textarea|date|select|array", "placeholder": "提示文本", "required": true }
  ],
  "legalBasis": ["法律依据1"]
}`;
  return { systemPrompt, userPrompt };
}
async function learnTemplate(settings, request) {
  const apiKey = resolveWriteInlineCompletionApiKey(settings);
  const baseUrl = resolveWriteInlineCompletionBaseUrl(settings);
  const model = resolveWriteInlineCompletionModel(settings);
  if (!apiKey) {
    return { ok: false, message: "未配置 API Key，请在设置中填写 API 密钥。" };
  }
  const url = upstreamOpenAiChatCompletionsUrl(baseUrl);
  const { systemPrompt, userPrompt } = buildLearningPrompt(request);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: MAX_TOKENS$1,
        temperature: 0.3,
        stream: false
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS$1)
    });
    const text = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        message: `AI 学习请求失败 (${response.status}): ${text.slice(0, 300)}`
      };
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: false, message: "AI 返回了非 JSON 数据，请重试。" };
    }
    const content = parsed?.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, message: "AI 返回内容为空，请重试。" };
    }
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonStr.trim());
    } catch {
      return {
        ok: true,
        name: request.suggestedName || request.fileName.replace(/\.[^/.]+$/, ""),
        description: `从 ${request.fileName} 学习生成的模板`,
        content,
        fields: [
          {
            id: "content",
            label: "文书内容",
            type: "textarea",
            placeholder: "请输入文书内容",
            required: true
          }
        ]
      };
    }
    if (!parsedResult.name || !parsedResult.content) {
      return { ok: false, message: "AI 未能提取有效的模板结构，请尝试上传更规范的文档。" };
    }
    const fields = (parsedResult.fields || []).map((f) => ({
      id: f.id || `field_${Math.random().toString(36).slice(2, 8)}`,
      label: f.label || f.id || "未命名字段",
      type: validateFieldType(f.type),
      placeholder: f.placeholder,
      required: f.required ?? true
    }));
    return {
      ok: true,
      name: parsedResult.name,
      description: parsedResult.description || `从 ${request.fileName} 学习生成的模板`,
      content: parsedResult.content,
      fields: fields.length > 0 ? fields : [
        {
          id: "content",
          label: "文书内容",
          type: "textarea",
          placeholder: "请输入文书内容",
          required: true
        }
      ],
      legalBasis: parsedResult.legalBasis
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `AI 学习失败: ${message}` };
  }
}
function validateFieldType(type) {
  const validTypes = ["text", "textarea", "date", "select", "array"];
  return validTypes.includes(type) ? type : "text";
}
const TIMEOUT_MS = 9e4;
const MAX_TOKENS = 8192;
function buildGenerationPrompt(request) {
  const fieldValuesText = Object.entries(request.fieldValues).filter(([, v]) => v).map(([id, value]) => {
    const fieldDef = request.template.fields.find((f) => f.id === id);
    return `- ${fieldDef?.label || id}：${value}`;
  }).join("\n");
  const materialsText = request.materials && request.materials.length > 0 ? request.materials.map(
    (m) => `### 材料文件：${m.fileName}
\`\`\`
${m.content.slice(0, 2e4)}
\`\`\``
  ).join("\n\n") : "";
  const instructionsText = request.instructions ? `

用户特别要求：
${request.instructions}` : "";
  const systemPrompt = `你是一名资深法律文书撰写专家。你的任务是根据用户选择的模板、填写的信息以及提供的参考材料，生成一份格式规范、内容严谨、说理充分的法律文书。

要求：
1. 严格遵循中国法律文书的格式规范和用语习惯
2. 文书结构完整，逻辑清晰，事实陈述准确
3. 法律引用准确，说理充分
4. 按照用户选择的模板类型生成相应的文书内容
5. 使用专业、规范的法律语言
6. 将用户填写的信息和参考材料中的相关内容自然地融入文书中
7. 如果用户提供了参考材料，从中提取关键事实和信息来丰富文书内容
8. 对于用户未填写的可选字段，根据上下文合理推断补充

生成完整的法律文书，包含标题、当事人信息、案由、诉讼请求/申请事项、事实与理由、此致、落款等必要部分。`;
  let userPrompt = `请根据以下信息生成一份${request.template.name}。

模板说明：${request.template.description}`;
  if (request.template.legalBasis && request.template.legalBasis.length > 0) {
    userPrompt += `

法律依据：
${request.template.legalBasis.map((b) => `- ${b}`).join("\n")}`;
  }
  if (fieldValuesText) {
    userPrompt += `

用户填写的信息：
${fieldValuesText}`;
  }
  if (materialsText) {
    userPrompt += `

参考材料（请从中提取相关信息用于文书）：
${materialsText}`;
  }
  userPrompt += `

模板结构参考：
${request.template.content.slice(0, 3e3)}`;
  if (instructionsText) {
    userPrompt += instructionsText;
  }
  userPrompt += `

请生成完整、规范的法律文书。`;
  return { systemPrompt, userPrompt };
}
async function generateFromTemplate(settings, request) {
  const apiKey = resolveWriteInlineCompletionApiKey(settings);
  const baseUrl = resolveWriteInlineCompletionBaseUrl(settings);
  const model = resolveWriteInlineCompletionModel(settings);
  if (!apiKey) {
    return { ok: false, message: "未配置 API Key，请在设置中填写 API 密钥。" };
  }
  const url = upstreamOpenAiChatCompletionsUrl(baseUrl);
  const { systemPrompt, userPrompt } = buildGenerationPrompt(request);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        stream: false
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    const text = await response.text();
    if (!response.ok) {
      return {
        ok: false,
        message: `AI 生成请求失败 (${response.status}): ${text.slice(0, 300)}`
      };
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { ok: false, message: "AI 返回了非 JSON 数据，请重试。" };
    }
    const content = parsed?.choices?.[0]?.message?.content;
    if (!content) {
      return { ok: false, message: "AI 返回内容为空，请重试。" };
    }
    return { ok: true, content, model };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `AI 生成失败: ${message}` };
  }
}
const TEMPLATES_DIR_NAME = "user-templates";
const TEMPLATES_INDEX_FILE = "templates.json";
let templatesDir = "";
let templatesCache = null;
function setTemplatesBaseDir(baseDir2) {
  templatesDir = node_path.join(baseDir2, TEMPLATES_DIR_NAME);
  templatesCache = null;
}
async function ensureDir$1() {
  if (!templatesDir) {
    throw new Error("Templates base directory not set. Call setTemplatesBaseDir() first.");
  }
  await promises.mkdir(templatesDir, { recursive: true });
  return templatesDir;
}
function indexFilePath() {
  return node_path.join(templatesDir, TEMPLATES_INDEX_FILE);
}
async function loadTemplates() {
  if (templatesCache) return templatesCache;
  try {
    const filePath2 = indexFilePath();
    const data = await promises.readFile(filePath2, "utf-8");
    const parsed = JSON.parse(data);
    templatesCache = Array.isArray(parsed) ? parsed : [];
    return templatesCache;
  } catch {
    templatesCache = [];
    return templatesCache;
  }
}
async function persistTemplates(templates) {
  const dir = await ensureDir$1();
  const filePath2 = node_path.join(dir, TEMPLATES_INDEX_FILE);
  await promises.writeFile(filePath2, JSON.stringify(templates, null, 2), "utf-8");
  templatesCache = templates;
}
async function listTemplates() {
  return loadTemplates();
}
async function saveTemplate(template) {
  try {
    const templates = await loadTemplates();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existingIdx = templates.findIndex((t) => t.id === template.id);
    if (existingIdx >= 0) {
      templates[existingIdx] = {
        ...template,
        updatedAt: now
      };
    } else {
      templates.push({
        ...template,
        createdAt: template.createdAt || now,
        updatedAt: now
      });
    }
    await persistTemplates(templates);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message };
  }
}
async function deleteTemplate(id) {
  try {
    const templates = await loadTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    if (filtered.length === templates.length) {
      return { ok: false, message: "模板未找到。" };
    }
    await persistTemplates(filtered);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, message };
  }
}
const HISTORY_DIR_NAME = "document-history";
const HISTORY_FILE = "history.json";
let baseDir = "";
let cache = null;
function setHistoryBaseDir(dir) {
  baseDir = node_path.join(dir, HISTORY_DIR_NAME);
  cache = null;
}
async function ensureDir() {
  if (!baseDir) throw new Error("History base dir not set.");
  await promises.mkdir(baseDir, { recursive: true });
  return baseDir;
}
function filePath() {
  return node_path.join(baseDir, HISTORY_FILE);
}
async function loadAll() {
  if (cache) return cache;
  try {
    const data = await promises.readFile(filePath(), "utf-8");
    const parsed = JSON.parse(data);
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}
async function persist(records) {
  const dir = await ensureDir();
  await promises.writeFile(node_path.join(dir, HISTORY_FILE), JSON.stringify(records, null, 2), "utf-8");
  cache = records;
}
async function listHistory() {
  const records = await loadAll();
  return records.map((r) => ({
    id: r.id,
    templateName: r.templateName,
    templateCategory: r.templateCategory,
    templateSource: r.templateSource,
    materialCount: r.materialFileNames.length,
    hasInstructions: r.instructions.length > 0,
    createdAt: r.createdAt
  }));
}
async function getHistoryRecord(id) {
  const records = await loadAll();
  return records.find((r) => r.id === id) ?? null;
}
async function saveHistoryRecord(record) {
  try {
    const records = await loadAll();
    const updated = [record, ...records].slice(0, 500);
    await persist(updated);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}
async function deleteHistoryRecord(id) {
  try {
    const records = await loadAll();
    const filtered = records.filter((r) => r.id !== id);
    if (filtered.length === records.length) {
      return { ok: false, message: "记录未找到。" };
    }
    await persist(filtered);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}
async function clearHistory() {
  try {
    await persist([]);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}
function normalizePath(value) {
  return value.replaceAll("\\", "/");
}
function dirnamePortable(filePath2) {
  const normalized = normalizePath(filePath2);
  const slash = normalized.lastIndexOf("/");
  if (slash < 0) return "";
  if (slash === 0) return "/";
  return normalized.slice(0, slash);
}
function normalizeJoinedPath(pathname) {
  const normalized = normalizePath(pathname);
  const prefix = normalized.startsWith("/") ? "/" : "";
  const parts = [];
  for (const part of normalized.slice(prefix.length).split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (parts.length > 0) parts.pop();
      continue;
    }
    parts.push(part);
  }
  return `${prefix}${parts.join("/")}`;
}
function writePathToFileUrl(pathname) {
  const normalized = normalizeJoinedPath(pathname);
  const encoded = normalized.split("/").map((part) => {
    if (/^[a-zA-Z]:$/.test(part)) return part;
    return encodeURIComponent(part).replaceAll("~", "%7E");
  }).join("/");
  return `file://${encoded.startsWith("/") ? encoded : `/${encoded}`}`;
}
function isExplicitWriteResourceUrl(value) {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);
}
function explicitResourceProtocol(value) {
  try {
    return new URL(value).protocol;
  } catch {
    return null;
  }
}
function resolveWriteMarkdownResource(src, filePath2) {
  const resolvedPath = resolveWriteMarkdownResourcePath(src, filePath2);
  if (resolvedPath) return writePathToFileUrl(resolvedPath);
  if (!src?.trim()) return src;
  const value = src.trim();
  return explicitResourceProtocol(value) === "file:" ? void 0 : src;
}
function resolveWriteMarkdownResourcePath(src, filePath2) {
  if (!src?.trim() || !filePath2) return void 0;
  const value = src.trim();
  if (isExplicitWriteResourceUrl(value) || value.startsWith("#")) return void 0;
  const [pathname, suffix = ""] = value.split(/([?#].*)/, 2);
  const baseDir2 = dirnamePortable(filePath2);
  if (!baseDir2 || suffix) return void 0;
  const resolved = pathname.startsWith("/") ? normalizeJoinedPath(pathname) : normalizeJoinedPath(`${baseDir2}/${pathname}`);
  return resolved;
}
const require$1 = node_module.createRequire(require("url").pathToFileURL(__filename).href);
const htmlToDocx = require$1("html-to-docx");
const EXPORT_CSS = `
  :root {
    color-scheme: light;
  }

  * {
    box-sizing: border-box;
  }

  html {
    background: #ffffff;
  }

  body {
    margin: 0;
    background: #ffffff;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    font-size: 15px;
    line-height: 1.72;
  }

  a {
    color: #0f62fe;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .document-shell {
    padding: 22mm 18mm;
  }

  .markdown-body {
    max-width: 100%;
  }

  .markdown-body > :first-child {
    margin-top: 0;
  }

  .markdown-body > :last-child {
    margin-bottom: 0;
  }

  .markdown-body p,
  .markdown-body ul,
  .markdown-body ol,
  .markdown-body blockquote,
  .markdown-body pre,
  .markdown-body table {
    margin: 0 0 1em;
  }

  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    margin: 1.45em 0 0.65em;
    line-height: 1.24;
    color: #0f172a;
    font-weight: 700;
  }

  .markdown-body h1 {
    font-size: 2em;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.3em;
  }

  .markdown-body h2 {
    font-size: 1.55em;
    border-bottom: 1px solid #edf2f7;
    padding-bottom: 0.24em;
  }

  .markdown-body h3 {
    font-size: 1.25em;
  }

  .markdown-body ul,
  .markdown-body ol {
    padding-left: 1.5em;
  }

  .markdown-body li + li {
    margin-top: 0.3em;
  }

  .markdown-body blockquote {
    padding: 0.3em 0 0.3em 1em;
    border-left: 4px solid #dbe4ff;
    color: #475569;
    background: #f8fbff;
  }

  .markdown-body code {
    font-family: "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", monospace;
    font-size: 0.92em;
  }

  .markdown-body p code,
  .markdown-body li code,
  .markdown-body td code {
    padding: 0.12em 0.38em;
    border-radius: 0.42em;
    background: #f1f5f9;
    color: #0f172a;
  }

  .markdown-body pre {
    overflow-x: auto;
    padding: 0.95em 1.05em;
    border-radius: 0.9em;
    background: #0f172a;
    color: #e2e8f0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .markdown-body pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  .markdown-body hr {
    height: 1px;
    border: 0;
    background: #e5e7eb;
    margin: 1.6em 0;
  }

  .markdown-body table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95em;
  }

  .markdown-body th,
  .markdown-body td {
    border: 1px solid #dbe3ee;
    padding: 0.5em 0.7em;
    vertical-align: top;
    text-align: left;
  }

  .markdown-body th {
    background: #f8fafc;
    font-weight: 700;
  }

  .markdown-body img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 1rem auto;
  }

  .plain-text {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", monospace;
  }

  @page {
    size: A4;
    margin: 0;
  }
`;
const LOCAL_IMAGE_PATTERN = /(<img\b[^>]*?\bsrc=")([^"]+)(")/gi;
function isMarkdownFile(filePath2) {
  return /\.(md|markdown|mdx)$/i.test(filePath2);
}
function basenameWithoutExtension(filePath2) {
  const name = node_path.basename(filePath2);
  const extension = node_path.extname(name);
  return extension ? name.slice(0, -extension.length) : name;
}
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function exportExtension(format) {
  if (format === "html") return ".html";
  if (format === "pdf") return ".pdf";
  if (format === "doc") return ".doc";
  return ".docx";
}
function exportDialogFilter(format) {
  if (format === "html") return { name: "HTML", extensions: ["html"] };
  if (format === "pdf") return { name: "PDF", extensions: ["pdf"] };
  if (format === "doc") return { name: "DOC", extensions: ["doc"] };
  return { name: "DOCX", extensions: ["docx"] };
}
function mimeTypeForPath(filePath2) {
  const extension = node_path.extname(filePath2).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".gif") return "image/gif";
  if (extension === ".webp") return "image/webp";
  if (extension === ".bmp") return "image/bmp";
  if (extension === ".svg") return "image/svg+xml";
  return null;
}
function ensureExportExtension(targetPath, format) {
  const extension = exportExtension(format);
  return node_path.extname(targetPath).trim() ? targetPath : `${targetPath}${extension}`;
}
function defaultExportPath(sourcePath, format) {
  return node_path.join(node_path.dirname(sourcePath), `${basenameWithoutExtension(sourcePath)}${exportExtension(format)}`);
}
async function localFileUrlToDataUri(value) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "file:") return null;
    const filePath2 = node_url.fileURLToPath(parsed);
    const mimeType = mimeTypeForPath(filePath2);
    if (!mimeType) return null;
    const buffer = await promises.readFile(filePath2);
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}
async function inlineLocalImagesInHtml(html) {
  const matches = [...html.matchAll(LOCAL_IMAGE_PATTERN)];
  if (matches.length === 0) return html;
  const replacements = /* @__PURE__ */ new Map();
  await Promise.all(
    matches.map(async (match) => {
      const rawSrc = match[2];
      if (!rawSrc || replacements.has(rawSrc)) return;
      const dataUri = await localFileUrlToDataUri(rawSrc);
      if (dataUri) replacements.set(rawSrc, dataUri);
    })
  );
  if (replacements.size === 0) return html;
  return html.replace(LOCAL_IMAGE_PATTERN, (fullMatch, prefix, rawSrc, suffix) => {
    return `${prefix}${replacements.get(rawSrc) ?? rawSrc}${suffix}`;
  });
}
function renderPlainTextFragment(content) {
  return server$1.renderToStaticMarkup(
    react.createElement(
      "pre",
      {
        className: "plain-text"
      },
      content
    )
  );
}
function renderMarkdownFragment(content, sourcePath) {
  return server$1.renderToStaticMarkup(
    react.createElement(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        components: {
          a: ({
            href,
            children,
            ...props
          }) => react.createElement(
            "a",
            {
              ...props,
              href: resolveWriteMarkdownResource(href, sourcePath) ?? href
            },
            children
          ),
          img: ({
            src,
            alt,
            ...props
          }) => react.createElement("img", {
            ...props,
            src: resolveWriteMarkdownResource(src, sourcePath),
            alt: alt ?? ""
          })
        }
      },
      content
    )
  );
}
async function buildWriteClipboardHtmlFragment(options) {
  const fragment = isMarkdownFile(options.sourcePath) ? renderMarkdownFragment(options.content, options.sourcePath) : renderPlainTextFragment(options.content);
  const body = await inlineLocalImagesInHtml(fragment);
  return `<article class="markdown-body">${body}</article>`;
}
async function buildWriteExportHtmlDocument(options) {
  const title = options.title?.trim() || basenameWithoutExtension(options.sourcePath);
  const body = await buildWriteClipboardHtmlFragment({
    sourcePath: options.sourcePath,
    content: options.content
  });
  const baseHref = node_url.pathToFileURL(`${node_path.dirname(options.sourcePath)}/`).href;
  const namespaces = options.wordCompatible ? ' xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"' : "";
  return [
    "<!DOCTYPE html>",
    `<html lang="en"${namespaces}>`,
    "<head>",
    '  <meta charset="utf-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `  <title>${escapeHtml(title)}</title>`,
    `  <base href="${escapeHtml(baseHref)}" />`,
    `  <style>${EXPORT_CSS}</style>`,
    "</head>",
    "<body>",
    '  <main class="document-shell">',
    `    ${body}`,
    "  </main>",
    "</body>",
    "</html>"
  ].join("\n");
}
async function copyWriteDocumentAsRichText(payload) {
  try {
    const resolved = await resolveWorkspaceFile({
      path: payload.path,
      workspaceRoot: payload.workspaceRoot
    });
    if (!resolved.ok) {
      return {
        ok: false,
        message: resolved.message
      };
    }
    const html = await buildWriteClipboardHtmlFragment({
      sourcePath: resolved.path,
      content: payload.content
    });
    electron.clipboard.write({
      html,
      text: payload.content
    });
    return {
      ok: true,
      copiedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
async function bufferFromDocxResult(result) {
  if (typeof ArrayBuffer !== "undefined" && result instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(result));
  }
  if (typeof Blob !== "undefined" && result instanceof Blob) {
    return Buffer.from(await result.arrayBuffer());
  }
  throw new TypeError("Unsupported DOCX export result.");
}
async function renderHtmlToPdf(html) {
  const tempDir = await promises.mkdtemp(node_path.join(node_os.tmpdir(), "legalwork-export-"));
  const tempHtmlPath = node_path.join(tempDir, "document.html");
  await promises.writeFile(tempHtmlPath, html, "utf8");
  const hiddenWindow = new electron.BrowserWindow({
    show: false,
    backgroundColor: "#ffffff",
    webPreferences: {
      sandbox: true
    }
  });
  try {
    await hiddenWindow.loadURL(node_url.pathToFileURL(tempHtmlPath).href);
    await hiddenWindow.webContents.executeJavaScript(`
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        Promise.all(
          Array.from(document.images).map((image) => {
            if (image.complete) return Promise.resolve()
            return new Promise((resolve) => {
              const done = () => resolve(undefined)
              image.addEventListener('load', done, { once: true })
              image.addEventListener('error', done, { once: true })
            })
          })
        )
      ]).then(() => undefined)
    `);
    await promises$1.setTimeout(120);
    const pdf = await hiddenWindow.webContents.printToPDF({
      printBackground: true,
      preferCSSPageSize: true
    });
    return Buffer.from(pdf);
  } finally {
    if (!hiddenWindow.isDestroyed()) hiddenWindow.destroy();
    await promises.rm(tempDir, { recursive: true, force: true });
  }
}
async function showExportSaveDialog(sourcePath, format, parentWindow) {
  const options = {
    title: "Export document",
    defaultPath: defaultExportPath(sourcePath, format),
    filters: [exportDialogFilter(format)]
  };
  return parentWindow ? electron.dialog.showSaveDialog(parentWindow, options) : electron.dialog.showSaveDialog(options);
}
async function exportWriteDocument(payload, options) {
  try {
    const resolved = await resolveWorkspaceFile({
      path: payload.path,
      workspaceRoot: payload.workspaceRoot
    });
    if (!resolved.ok) {
      return {
        ok: false,
        canceled: false,
        message: resolved.message
      };
    }
    const sourcePath = resolved.path;
    const exportDialogResult = await showExportSaveDialog(sourcePath, payload.format, options?.parentWindow);
    if (exportDialogResult.canceled || !exportDialogResult.filePath) {
      return {
        ok: false,
        canceled: true
      };
    }
    const targetPath = ensureExportExtension(exportDialogResult.filePath, payload.format);
    const title = basenameWithoutExtension(sourcePath);
    const html = await buildWriteExportHtmlDocument({
      sourcePath,
      content: payload.content,
      title,
      wordCompatible: payload.format === "doc"
    });
    if (payload.format === "html" || payload.format === "doc") {
      await promises.writeFile(targetPath, html, "utf8");
    } else if (payload.format === "docx") {
      const docx = await htmlToDocx(html, null, {
        title,
        creator: "legalwork",
        keywords: ["markdown", "export"],
        description: `Exported from ${node_path.basename(sourcePath)}`,
        font: "Arial",
        fontSize: 24
      });
      await promises.writeFile(targetPath, await bufferFromDocxResult(docx));
    } else {
      await promises.writeFile(targetPath, await renderHtmlToPdf(html));
    }
    return {
      ok: true,
      path: targetPath,
      format: payload.format,
      exportedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    return {
      ok: false,
      canceled: false,
      message: error instanceof Error ? error.message : String(error)
    };
  }
}
function parseIpcPayload(channel, schema, payload) {
  const parsed = schema.safeParse(payload);
  if (parsed.success) return parsed.data;
  const issue = parsed.error.issues[0];
  throw new Error(`Invalid payload for ${channel}: ${issue?.message ?? "Bad request."}`);
}
function validateMcpConfigContent(content) {
  const trimmed = content.trim();
  if (!trimmed) return;
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`MCP config must be JSON: ${message}`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("MCP config must be a JSON object.");
  }
}
function runDesktopCommand(command, sender, getMainWindow) {
  const mainWindow2 = getMainWindow();
  const contents = mainWindow2 && !mainWindow2.isDestroyed() ? mainWindow2.webContents : sender;
  switch (command) {
    case "undo":
      contents.undo();
      return;
    case "redo":
      contents.redo();
      return;
    case "cut":
      contents.cut();
      return;
    case "copy":
      contents.copy();
      return;
    case "paste":
      contents.paste();
      return;
    case "selectAll":
      contents.selectAll();
      return;
    case "reload":
      contents.reload();
      return;
    case "zoomIn":
      contents.setZoomLevel(contents.getZoomLevel() + 1);
      return;
    case "zoomOut":
      contents.setZoomLevel(contents.getZoomLevel() - 1);
      return;
    case "resetZoom":
      contents.setZoomLevel(0);
      return;
    case "toggleDevTools":
      contents.toggleDevTools();
      return;
    case "minimize":
      if (mainWindow2 && !mainWindow2.isDestroyed()) mainWindow2.minimize();
      return;
    case "toggleMaximize":
      if (!mainWindow2 || mainWindow2.isDestroyed()) return;
      if (mainWindow2.isMaximized()) {
        mainWindow2.unmaximize();
      } else {
        mainWindow2.maximize();
      }
      return;
    case "close":
      if (mainWindow2 && !mainWindow2.isDestroyed()) mainWindow2.close();
      return;
    case "quit":
      electron.app.quit();
      return;
  }
}
function registerAppIpcHandlers(options) {
  const {
    store: store2,
    getMainWindow,
    applySettingsPatch,
    runtimeRequest: runtimeRequest2,
    reconnectRuntime,
    fetchUpstreamModels,
    getClawRuntime,
    getScheduleRuntime,
    startFeishuInstallQrcode: startFeishuInstallQrcode2,
    pollFeishuInstall: pollFeishuInstall2,
    startWeixinInstallQrcode: startWeixinInstallQrcode2,
    pollWeixinInstall: pollWeixinInstall2,
    resolveLegalworkConfigPath: resolveLegalworkConfigPath2,
    onLegalworkMcpConfigWritten,
    showTurnCompleteNotification: showTurnCompleteNotification2,
    getAppVersion,
    readGuiUpdateState: readGuiUpdateState2,
    loadGuiUpdaterModule: loadGuiUpdaterModule2,
    resolveLogDirectory: resolveLogDirectory2,
    logError: logError2
  } = options;
  const workspaceFileWatchers = /* @__PURE__ */ new Map();
  const disposeWorkspaceFileWatch = (watchId) => {
    const record = workspaceFileWatchers.get(watchId);
    if (!record) return false;
    if (record.timer) clearTimeout(record.timer);
    try {
      record.watcher.close();
    } catch (error) {
      logError2("workspace-watch", "Failed to close workspace file watcher", {
        watchId,
        message: error instanceof Error ? error.message : String(error)
      });
    }
    workspaceFileWatchers.delete(watchId);
    return true;
  };
  const disposeWorkspaceFileWatchesForSender = (sender) => {
    for (const [watchId, record] of workspaceFileWatchers) {
      if (record.sender.id === sender.id) {
        disposeWorkspaceFileWatch(watchId);
      }
    }
  };
  const emitWorkspaceFileChange = async (watchId) => {
    const record = workspaceFileWatchers.get(watchId);
    if (!record) return;
    const changedAt = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const result = await readWorkspaceFile({
        path: record.path,
        workspaceRoot: record.workspaceRoot
      });
      const latest = workspaceFileWatchers.get(watchId);
      if (!latest || latest.sender.isDestroyed()) return;
      if (result.ok) {
        latest.sender.send("file:workspace-changed", {
          ok: true,
          watchId,
          workspaceRoot: latest.workspaceRoot,
          path: result.path,
          content: result.content,
          size: result.size,
          truncated: result.truncated,
          changedAt
        });
        return;
      }
      latest.sender.send("file:workspace-changed", {
        ok: false,
        watchId,
        workspaceRoot: latest.workspaceRoot,
        path: latest.path,
        message: result.message,
        changedAt
      });
    } catch (error) {
      const latest = workspaceFileWatchers.get(watchId);
      if (!latest || latest.sender.isDestroyed()) return;
      latest.sender.send("file:workspace-changed", {
        ok: false,
        watchId,
        workspaceRoot: latest.workspaceRoot,
        path: latest.path,
        message: error instanceof Error ? error.message : String(error),
        changedAt
      });
    }
  };
  const scheduleWorkspaceFileChange = (watchId) => {
    const record = workspaceFileWatchers.get(watchId);
    if (!record) return;
    if (record.timer) clearTimeout(record.timer);
    record.timer = setTimeout(() => {
      const latest = workspaceFileWatchers.get(watchId);
      if (!latest) return;
      latest.timer = null;
      void emitWorkspaceFileChange(watchId);
    }, 90);
  };
  electron.ipcMain.handle("settings:get", async () => store2.load());
  electron.ipcMain.handle(
    "settings:set",
    async (_, partial) => applySettingsPatch(
      parseIpcPayload("settings:set", settingsPatchSchema, partial)
    )
  );
  electron.ipcMain.handle("runtime:request", async (_, payload) => {
    const request = parseIpcPayload("runtime:request", runtimeRequestPayloadSchema, payload);
    return runtimeRequest2(request.path, request.method, request.body);
  });
  electron.ipcMain.handle("runtime:reconnect", async () => reconnectRuntime());
  electron.ipcMain.handle("upstream:models", async () => fetchUpstreamModels());
  function translateDataCompliancePath(path) {
    const historyDeleteMatch = /^\/api\/history\/([^/]+)$/.exec(path);
    if (historyDeleteMatch) {
      return `/data-compliance/tasks/${encodeURIComponent(historyDeleteMatch[1])}`;
    }
    if (path === "/api/history") return "/data-compliance/tasks";
    const resultMatch = /^\/api\/result\/([^/]+)$/.exec(path);
    if (resultMatch) {
      return `/data-compliance/tasks/${encodeURIComponent(resultMatch[1])}`;
    }
    const downloadMatch = /^\/api(?:\/desensitize)?\/download\/([^/]+)\/([^/]+)$/.exec(path);
    if (downloadMatch) {
      return `/data-compliance/tasks/${encodeURIComponent(downloadMatch[1])}/files/${encodeURIComponent(downloadMatch[2])}`;
    }
    if (path.startsWith("/data-compliance/")) return path;
    return path;
  }
  function resolveDataComplianceVenvDir(dataDir) {
    return node_path.join(dataDir, "data-compliance", "python-venv");
  }
  function resolveDataComplianceVenvPython(venvDir) {
    return process.platform === "win32" ? node_path.join(venvDir, "Scripts", "python.exe") : node_path.join(venvDir, "bin", "python");
  }
  function resolveDataComplianceWebRootCandidates() {
    const appRoot2 = electron.app.isPackaged ? electron.app.getAppPath().replace(/app\.asar$/, "app.asar.unpacked") : electron.app.getAppPath();
    const bundleRoot = "vendor/data-compliance-review-codex/data-compliance-web";
    return [
      node_path.join(appRoot2, "app.asar.unpacked", bundleRoot),
      node_path.join(appRoot2, bundleRoot),
      node_path.join(appRoot2, "..", bundleRoot),
      node_path.join(process.cwd(), bundleRoot)
    ];
  }
  let dataComplianceInstalling = false;
  async function installDataComplianceEnvironment(event, getInstallingFlag) {
    const setInstalling = (value) => {
      dataComplianceInstalling = value;
    };
    const sendProgress = (progress) => {
      const win = getMainWindow();
      const contents = win && !win.isDestroyed() ? win.webContents : event.sender;
      if (!contents.isDestroyed()) {
        contents.send("data-compliance:install-progress", progress);
      }
    };
    if (getInstallingFlag()) return true;
    setInstalling(true);
    try {
      const settings = await store2.load();
      const runtime = resolveLegalworkRuntimeSettings(settings);
      const dataDir = resolveLegalworkDataDir(runtime);
      const venvDir = resolveDataComplianceVenvDir(dataDir);
      const venvPython = resolveDataComplianceVenvPython(venvDir);
      const webRoot = resolveDataComplianceWebRootCandidates().find((candidate) => node_fs.existsSync(node_path.join(candidate, "requirements.txt"))) ?? resolveDataComplianceWebRootCandidates()[0];
      const requirementsPath = node_path.join(webRoot, "requirements.txt");
      sendProgress({ step: "detecting", percent: 5, message: "正在检测 Python 环境…" });
      let pythonCmd = await resolvePythonForCompliance();
      if (!pythonCmd && process.platform === "win32") {
        pythonCmd = await downloadAndInstallPythonWindows(sendProgress);
      }
      if (!pythonCmd && process.platform === "darwin") {
        pythonCmd = await downloadAndInstallPythonMacOS(sendProgress);
      }
      if (!pythonCmd && process.platform === "linux") {
        pythonCmd = await downloadAndInstallPythonLinux(sendProgress);
      }
      if (!pythonCmd) {
        sendProgress({
          step: "error",
          percent: 0,
          message: "未找到 Python 3，自动安装失败。请检查网络连接后重试，或手动安装 Python 3 并确保其在 PATH 中。"
        });
        return false;
      }
      if (!node_fs.existsSync(venvPython)) {
        sendProgress({ step: "venv", percent: 35, message: "正在创建 Python 虚拟环境…" });
        node_fs.mkdirSync(venvDir, { recursive: true });
        const venvResult = await runCommand(pythonCmd, ["-m", "venv", venvDir]);
        if (venvResult.exitCode !== 0) {
          sendProgress({
            step: "error",
            percent: 0,
            message: `创建 venv 失败: ${venvResult.stderr || venvResult.stdout || "未知错误"}`
          });
          return false;
        }
      }
      if (node_fs.existsSync(requirementsPath)) {
        sendProgress({ step: "installing", percent: 60, message: "正在安装 Python 依赖包（这可能需要几分钟）…" });
        const installResult = await runCommand(
          venvPython,
          ["-m", "pip", "install", "-r", requirementsPath],
          { cwd: webRoot, timeout: 6e5 }
        );
        if (installResult.exitCode !== 0) {
          sendProgress({
            step: "error",
            percent: 0,
            message: `安装 Python 依赖失败: ${installResult.stderr || installResult.stdout || "未知错误"}`
          });
          return false;
        }
      }
      sendProgress({ step: "done", percent: 100, message: "Python 环境安装完成" });
      try {
        await runtimeRequest2("/data-compliance/environment", "GET");
      } catch {
      }
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sendProgress({ step: "error", percent: 0, message: `环境安装异常: ${message}` });
      return false;
    } finally {
      setInstalling(false);
    }
  }
  async function downloadAndInstallPythonWindows(sendProgress) {
    const https = await import("node:https");
    const { createWriteStream } = await import("node:fs");
    const { pipeline } = await import("node:stream/promises");
    const tmpDir = node_path.join(electron.app.getPath("userData"), "data-compliance", "tmp");
    node_fs.mkdirSync(tmpDir, { recursive: true });
    const pythonVersion = "3.11.9";
    const installerName = "python-3.11.9-amd64.exe";
    const installerPath = node_path.join(tmpDir, installerName);
    const url = `https://www.python.org/ftp/python/${pythonVersion}/${installerName}`;
    if (!node_fs.existsSync(installerPath)) {
      sendProgress({ step: "detecting", percent: 10, message: "未找到 Python，正在下载安装器…" });
      await new Promise((resolve, reject) => {
        const file = createWriteStream(installerPath);
        https.get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`下载失败: HTTP ${response.statusCode}`));
            return;
          }
          const total = parseInt(response.headers["content-length"] || "0", 10);
          let downloaded = 0;
          response.on("data", (chunk) => {
            downloaded += chunk.length;
            if (total > 0) {
              const percent = Math.round(downloaded / total * 20);
              sendProgress({
                step: "detecting",
                percent,
                message: `正在下载 Python 安装器 (${Math.round(downloaded / 1024 / 1024)}MB / ${Math.round(total / 1024 / 1024)}MB)…`
              });
            }
          });
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
          file.on("error", reject);
        }).on("error", reject);
      });
    }
    sendProgress({ step: "detecting", percent: 32, message: "正在安装 Python（可能需要管理员权限）…" });
    const installResult = await runCommand(installerPath, [
      "/quiet",
      "InstallAllUsers=0",
      "PrependPath=1",
      "Include_pip=1",
      "Include_test=0"
    ], { timeout: 3e5 });
    if (installResult.exitCode !== 0) {
      throw new Error(`Python 安装失败: ${installResult.stderr || installResult.stdout || `exit code ${installResult.exitCode}`}`);
    }
    sendProgress({ step: "detecting", percent: 33, message: "正在验证 Python 安装…" });
    const userProfile = process.env.USERPROFILE;
    const localAppData = process.env.LOCALAPPDATA;
    const programFiles = process.env.PROGRAMFILES;
    const programFilesX86 = process.env["PROGRAMFILES(X86)"];
    const possiblePaths = [
      node_path.join(localAppData || "", "Programs", "Python", "Python311", "python.exe"),
      node_path.join(programFiles || "", "Python311", "python.exe"),
      node_path.join(programFilesX86 || "", "Python311", "python.exe"),
      node_path.join(userProfile || "", "AppData", "Local", "Programs", "Python", "Python311", "python.exe")
    ];
    for (const p of possiblePaths) {
      if (node_fs.existsSync(p)) return p;
    }
    const pathResult = await runCommand("cmd.exe", ["/c", "echo %PATH%"]);
    if (pathResult.exitCode === 0) {
      const updatedPath = pathResult.stdout.trim();
      const env = { ...process.env, Path: updatedPath, PATH: updatedPath };
      for (const cmd of ["python", "python3", "py"]) {
        try {
          const r = await runCommand(cmd, ["--version"], { env });
          if (r.exitCode === 0 && r.stdout.includes("Python 3")) return cmd;
        } catch {
        }
      }
    }
    throw new Error("Python 安装后未能找到 python.exe，请重启应用后重试。");
  }
  function getPythonBuildStandaloneUrl() {
    const releaseTag = "20240415";
    const pythonVersion = "3.11.9";
    const baseUrl = `https://github.com/astral-sh/python-build-standalone/releases/download/${releaseTag}`;
    const mapping = {
      darwin: {
        arm64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-aarch64-apple-darwin-install_only.tar.gz`,
        x64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-x86_64-apple-darwin-install_only.tar.gz`
      },
      linux: {
        arm64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-aarch64-unknown-linux-gnu-install_only.tar.gz`,
        x64: `${baseUrl}/cpython-${pythonVersion}+${releaseTag}-x86_64-unknown-linux-gnu-install_only.tar.gz`
      }
    };
    const arch = process.arch === "arm64" ? "arm64" : "x64";
    return mapping[process.platform]?.[arch] ?? null;
  }
  async function downloadFileWithProgress(url, destPath, onProgress, redirectCount = 0) {
    const https = await import("node:https");
    const http = await import("node:http");
    const { createWriteStream } = await import("node:fs");
    const { mkdirSync: mkdirSync2 } = await import("node:fs");
    const { dirname: dirname2 } = await import("node:path");
    mkdirSync2(dirname2(destPath), { recursive: true });
    if (redirectCount > 5) {
      throw new Error("下载重定向次数过多");
    }
    const client = url.startsWith("https:") ? https : http;
    await new Promise((resolve, reject) => {
      const file = createWriteStream(destPath);
      const request = client.get(url, { timeout: 12e4 }, (response) => {
        const statusCode = response.statusCode ?? 0;
        if (statusCode >= 300 && statusCode < 400 && response.headers.location) {
          file.destroy();
          const redirectUrl = new URL(response.headers.location, url).toString();
          downloadFileWithProgress(redirectUrl, destPath, onProgress, redirectCount + 1).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          file.destroy();
          reject(new Error(`下载失败: HTTP ${response.statusCode}`));
          return;
        }
        const total = parseInt(response.headers["content-length"] || "0", 10);
        let downloaded = 0;
        response.on("data", (chunk) => {
          downloaded += chunk.length;
          if (total > 0) {
            onProgress(downloaded, total);
          }
        });
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
        file.on("error", reject);
      }).on("error", (error) => {
        file.destroy();
        reject(error);
      }).on("timeout", () => {
        request.destroy();
        reject(new Error("下载超时，请检查网络连接。"));
      });
    });
  }
  async function extractTarGz(tarPath, destDir) {
    node_fs.mkdirSync(destDir, { recursive: true });
    const result = await runCommand("tar", ["-xzf", tarPath, "-C", destDir, "--strip-components=1"]);
    if (result.exitCode !== 0) {
      throw new Error(`解压 Python 失败: ${result.stderr || result.stdout || "未知错误"}`);
    }
  }
  async function downloadAndInstallPythonBuildStandalone(sendProgress, platformLabel) {
    const tmpDir = node_path.join(electron.app.getPath("userData"), "data-compliance", "tmp");
    const installDir = node_path.join(electron.app.getPath("userData"), "data-compliance", "python-standalone");
    node_fs.mkdirSync(tmpDir, { recursive: true });
    const url = getPythonBuildStandaloneUrl();
    if (!url) {
      throw new Error(`当前平台 ${process.platform} (${process.arch}) 不支持自动安装 Python。`);
    }
    const fileName = `python-standalone-${process.platform}-${process.arch}.tar.gz`;
    const tarPath = node_path.join(tmpDir, fileName);
    if (!node_fs.existsSync(tarPath)) {
      sendProgress({ step: "detecting", percent: 10, message: `未找到 Python，正在下载 ${platformLabel} 版 Python…` });
      try {
        await downloadFileWithProgress(url, tarPath, (downloaded, total) => {
          const percent = Math.round(downloaded / total * 20);
          sendProgress({
            step: "detecting",
            percent,
            message: `正在下载 Python (${Math.round(downloaded / 1024 / 1024)}MB / ${Math.round(total / 1024 / 1024)}MB)…`
          });
        });
      } catch (error) {
        try {
          node_fs.rmSync(tarPath, { force: true });
        } catch {
        }
        throw error;
      }
    }
    sendProgress({ step: "detecting", percent: 32, message: "正在解压 Python…" });
    if (node_fs.existsSync(installDir)) {
      node_fs.rmSync(installDir, { recursive: true, force: true });
    }
    try {
      await extractTarGz(tarPath, installDir);
    } catch (error) {
      try {
        node_fs.rmSync(installDir, { recursive: true, force: true });
      } catch {
      }
      throw error;
    }
    sendProgress({ step: "detecting", percent: 33, message: "正在验证 Python 安装…" });
    const pythonPath = node_path.join(installDir, "bin", "python3");
    if (!node_fs.existsSync(pythonPath)) {
      throw new Error("Python 解压后未找到 python3 可执行文件");
    }
    const verify = await runCommand(pythonPath, ["--version"]);
    if (verify.exitCode !== 0) {
      throw new Error(`Python 验证失败: ${verify.stderr || verify.stdout}`);
    }
    sendProgress({ step: "detecting", percent: 34, message: "Python 已就绪" });
    return pythonPath;
  }
  async function downloadAndInstallPythonMacOS(sendProgress) {
    return downloadAndInstallPythonBuildStandalone(sendProgress, "macOS");
  }
  async function downloadAndInstallPythonLinux(sendProgress) {
    return downloadAndInstallPythonBuildStandalone(sendProgress, "Linux");
  }
  electron.ipcMain.handle("data-compliance:status", async (event) => {
    try {
      const result = await runtimeRequest2("/data-compliance/environment", "GET");
      if (!result.ok) {
        const parsed2 = JSON.parse(result.body || "{}");
        if (!dataComplianceInstalling) {
          void installDataComplianceEnvironment(event, () => dataComplianceInstalling).then((ok) => {
            if (!ok) {
              console.error("[data-compliance:status] auto-install failed");
            }
          }).catch((error) => {
            console.error("[data-compliance:status] auto-install error:", error);
          });
          return {
            ok: false,
            running: false,
            installing: true,
            baseUrl: "",
            message: parsed2.error || "正在自动安装 Python 环境，请稍候…"
          };
        }
        return {
          ok: false,
          running: false,
          installing: dataComplianceInstalling,
          baseUrl: "",
          message: parsed2.error || "数据合规服务不可用"
        };
      }
      const parsed = JSON.parse(result.body || "{}");
      return {
        ok: true,
        running: true,
        installing: false,
        baseUrl: "",
        message: parsed.python ? `Python: ${parsed.python}` : void 0
      };
    } catch (error) {
      return {
        ok: false,
        running: false,
        installing: dataComplianceInstalling,
        baseUrl: "",
        message: error instanceof Error ? error.message : String(error)
      };
    }
  });
  electron.ipcMain.handle("data-compliance:install", async (event) => {
    if (dataComplianceInstalling) return true;
    return installDataComplianceEnvironment(event, () => dataComplianceInstalling);
  });
  electron.ipcMain.handle("data-compliance:request", async (_, payload) => {
    const request = parseIpcPayload("data-compliance:request", dataComplianceRequestPayloadSchema, payload);
    const translatedPath = translateDataCompliancePath(request.path);
    try {
      return await runtimeRequest2(translatedPath, request.method, request.body);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        status: 503,
        body: JSON.stringify({ error: message }),
        contentType: "application/json"
      };
    }
  });
  electron.ipcMain.handle("data-compliance:submit", async (_, payload) => {
    const request = parseIpcPayload(
      "data-compliance:submit",
      dataComplianceSubmitPayloadSchema,
      payload
    );
    try {
      return await runtimeRequest2("/data-compliance/tasks", "POST", JSON.stringify(request));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        status: 503,
        body: JSON.stringify({ error: message }),
        contentType: "application/json"
      };
    }
  });
  electron.ipcMain.handle("data-compliance:download-file", async (_, payload) => {
    const request = parseIpcPayload(
      "data-compliance:download-file",
      dataComplianceDownloadFilePayloadSchema,
      payload
    );
    try {
      await reconnectRuntime();
      const settings = await store2.load();
      const base = getRuntimeBaseUrlForSettings(settings);
      const headers = runtimeAuthHeaders(settings);
      const url = `${base}/data-compliance/tasks/${encodeURIComponent(request.taskId)}/files/${encodeURIComponent(request.fileKey)}`;
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(3e4) });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return { ok: false, message: text || `HTTP ${res.status}` };
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      const contentDisposition = res.headers.get("content-disposition") || "";
      const filenameMatch = /filename="([^"]+)"/.exec(contentDisposition);
      const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : `${request.taskId}_${request.fileKey}`;
      const contentType = res.headers.get("content-type") || "application/octet-stream";
      return {
        ok: true,
        dataBase64: buffer.toString("base64"),
        filename,
        contentType
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      };
    }
  });
  electron.ipcMain.handle(
    "claw:status",
    async () => getClawRuntime()?.status() ?? {
      imServerRunning: false,
      imUrl: "",
      runningTaskIds: []
    }
  );
  electron.ipcMain.handle("claw:task:run", async (_, taskId) => {
    const normalizedTaskId = parseIpcPayload("claw:task:run", streamIdSchema, taskId);
    const scheduleRuntime2 = getScheduleRuntime();
    if (!scheduleRuntime2) return { ok: false, message: "Schedule runtime is not initialized." };
    return scheduleRuntime2.runTask(normalizedTaskId);
  });
  electron.ipcMain.handle(
    "schedule:status",
    async () => getScheduleRuntime()?.status() ?? {
      internalServerRunning: false,
      internalUrl: "",
      runningTaskIds: [],
      powerSaveBlockerActive: false
    }
  );
  electron.ipcMain.handle("schedule:task:run", async (_, taskId) => {
    const normalizedTaskId = parseIpcPayload("schedule:task:run", streamIdSchema, taskId);
    const scheduleRuntime2 = getScheduleRuntime();
    if (!scheduleRuntime2) return { ok: false, message: "Schedule runtime is not initialized." };
    return scheduleRuntime2.runTask(normalizedTaskId);
  });
  electron.ipcMain.handle(
    "claw:channel:mirror",
    async (_, payload) => {
      const request = parseIpcPayload("claw:channel:mirror", clawMirrorPayloadSchema, payload);
      const clawRuntime2 = getClawRuntime();
      if (!clawRuntime2) return { ok: false, message: "Claw runtime is not initialized." };
      return clawRuntime2.mirrorThreadMessageToIm(
        request.threadId,
        request.text,
        request.direction
      );
    }
  );
  electron.ipcMain.handle(
    "claw:channel:mirror-to-feishu",
    async (_, payload) => {
      const request = parseIpcPayload("claw:channel:mirror-to-feishu", clawMirrorPayloadSchema, payload);
      const clawRuntime2 = getClawRuntime();
      if (!clawRuntime2) return { ok: false, message: "Claw runtime is not initialized." };
      return clawRuntime2.mirrorThreadMessageToIm(
        request.threadId,
        request.text,
        request.direction
      );
    }
  );
  electron.ipcMain.handle(
    "claw:task:create-from-text",
    async (_, payload) => {
      const request = parseIpcPayload(
        "claw:task:create-from-text",
        clawTaskFromTextPayloadSchema,
        payload
      );
      const scheduleRuntime2 = getScheduleRuntime();
      if (!scheduleRuntime2) return { kind: "error", message: "Schedule runtime is not initialized." };
      const settings = await store2.load();
      const channel = request.channelId ? settings.claw.channels.find((item) => item.id === request.channelId) : void 0;
      return scheduleRuntime2.createScheduledTaskFromText(request.text, {
        workspaceRoot: channel?.workspaceRoot || settings.schedule.defaultWorkspaceRoot || settings.workspaceRoot,
        modelHint: request.modelHint,
        mode: request.mode
      });
    }
  );
  electron.ipcMain.handle(
    "schedule:task:create-from-text",
    async (_, payload) => {
      const request = parseIpcPayload(
        "schedule:task:create-from-text",
        scheduleTaskFromTextPayloadSchema,
        payload
      );
      const scheduleRuntime2 = getScheduleRuntime();
      if (!scheduleRuntime2) return { kind: "error", message: "Schedule runtime is not initialized." };
      return scheduleRuntime2.createScheduledTaskFromText(request.text, {
        workspaceRoot: request.workspaceRoot,
        modelHint: request.modelHint,
        mode: request.mode
      });
    }
  );
  electron.ipcMain.handle(
    "claw:im-install:qrcode",
    async (_, payload) => {
      const request = parseIpcPayload(
        "claw:im-install:qrcode",
        zod.z.object({ provider: zod.z.enum(["feishu", "weixin"]), isLark: zod.z.boolean().optional() }).strict(),
        payload
      );
      if (request.provider === "weixin") {
        return startWeixinInstallQrcode2();
      }
      return startFeishuInstallQrcode2(request.isLark === true);
    }
  );
  electron.ipcMain.handle(
    "claw:im-install:poll",
    async (_, payload) => {
      const request = parseIpcPayload("claw:im-install:poll", clawImInstallPollPayloadSchema, payload);
      if (request.provider === "weixin") {
        return pollWeixinInstall2(request.deviceCode);
      }
      return pollFeishuInstall2(request.deviceCode);
    }
  );
  electron.ipcMain.handle("workspace:pick-directory", async (_, defaultPath) => {
    const normalizedDefaultPath = parseIpcPayload(
      "workspace:pick-directory",
      zod.z.object({ defaultPath: defaultPathSchema }).strict(),
      { defaultPath }
    ).defaultPath;
    const options2 = {
      title: "Select working directory",
      defaultPath: normalizedDefaultPath,
      properties: ["openDirectory", "createDirectory", "dontAddToRecent"]
    };
    const mainWindow2 = getMainWindow();
    const result = mainWindow2 ? await electron.dialog.showOpenDialog(mainWindow2, options2) : await electron.dialog.showOpenDialog(options2);
    return {
      canceled: result.canceled,
      path: result.canceled ? null : result.filePaths[0] ?? null
    };
  });
  electron.ipcMain.handle(
    "skill:save-file",
    async (_, payload) => {
      const request = parseIpcPayload("skill:save-file", skillSaveFilePayloadSchema, payload);
      try {
        const rootPath = expandHomePath$1(request.rootPath);
        if (!rootPath) {
          return { ok: false, message: "Skill directory is required." };
        }
        const skillName = normalizeSkillFolderName(request.skillName);
        const skillDir = node_path.join(rootPath, skillName);
        const filePath2 = node_path.join(skillDir, "SKILL.md");
        await promises.mkdir(skillDir, { recursive: true });
        await promises.writeFile(filePath2, request.content, "utf8");
        return { ok: true, path: filePath2 };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : String(error)
        };
      }
    }
  );
  electron.ipcMain.handle("skill:list", async (_, payload) => {
    const request = parseIpcPayload("skill:list", skillListPayloadSchema, payload);
    const settings = await store2.load();
    return listGuiSkills(settings, request.workspaceRoot);
  });
  electron.ipcMain.handle("skill:open-root", async (_, rootPath) => {
    const normalizedRootPath = parseIpcPayload("skill:open-root", rootPathSchema, rootPath);
    try {
      const target = expandHomePath$1(normalizedRootPath);
      if (!target) {
        return { ok: false, message: "Skill directory is required." };
      }
      await promises.mkdir(target, { recursive: true });
      return openPathWithShell(target);
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      };
    }
  });
  electron.ipcMain.handle("deepseek:config:read", async () => {
    const path = resolveLegalworkConfigPath2();
    try {
      const content = await promises.readFile(path, "utf8");
      return { path, content, exists: true };
    } catch (error) {
      if (error.code === "ENOENT") {
        return { path, content: "", exists: false };
      }
      throw error;
    }
  });
  electron.ipcMain.handle("deepseek:config:write", async (_, content) => {
    const validatedContent = parseIpcPayload(
      "deepseek:config:write",
      deepseekConfigContentSchema,
      content
    );
    validateMcpConfigContent(validatedContent);
    const path = resolveLegalworkConfigPath2();
    await promises.mkdir(node_path.dirname(path), { recursive: true });
    await promises.writeFile(path, validatedContent, "utf8");
    try {
      await onLegalworkMcpConfigWritten?.(path, validatedContent);
    } catch (error) {
      logError2("mcp-config", "Failed to apply MCP config change after write", {
        path,
        message: error instanceof Error ? error.message : String(error)
      });
    }
    return { ok: true, path };
  });
  electron.ipcMain.handle("deepseek:config:open-dir", async () => {
    try {
      const path = resolveLegalworkConfigPath2();
      const dirPath = node_path.dirname(path);
      await promises.mkdir(dirPath, { recursive: true });
      return openPathWithShell(dirPath);
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      };
    }
  });
  electron.ipcMain.handle(
    "git:branches",
    async (_, workspaceRoot) => getGitBranches(parseIpcPayload("git:branches", workspaceRootSchema, workspaceRoot))
  );
  electron.ipcMain.handle(
    "git:switch-branch",
    async (_, payload) => {
      const request = parseIpcPayload("git:switch-branch", gitBranchPayloadSchema, payload);
      return switchGitBranch(request.workspaceRoot, request.branch);
    }
  );
  electron.ipcMain.handle(
    "git:create-and-switch-branch",
    async (_, payload) => {
      const request = parseIpcPayload(
        "git:create-and-switch-branch",
        gitBranchPayloadSchema,
        payload
      );
      return createAndSwitchGitBranch(request.workspaceRoot, request.branch);
    }
  );
  electron.ipcMain.handle("editor:list", async () => listEditorsResult());
  electron.ipcMain.handle(
    "editor:open-path",
    async (_, payload) => openEditorPath(parseIpcPayload("editor:open-path", openEditorPathPayloadSchema, payload))
  );
  electron.ipcMain.handle(
    "file:resolve-workspace",
    async (_, payload) => resolveWorkspaceFile(
      parseIpcPayload("file:resolve-workspace", workspaceFileTargetPayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:list-workspace-directory",
    async (_, payload) => listWorkspaceDirectory(
      parseIpcPayload("file:list-workspace-directory", workspaceDirectoryTargetPayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:read-workspace",
    async (_, payload) => readWorkspaceFile(
      parseIpcPayload("file:read-workspace", workspaceFileTargetPayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:read-workspace-image",
    async (_, payload) => readWorkspaceImage(
      parseIpcPayload("file:read-workspace-image", workspaceFileTargetPayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:write-workspace",
    async (_, payload) => writeWorkspaceFile(
      parseIpcPayload("file:write-workspace", workspaceFileWritePayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:create-workspace",
    async (_, payload) => createWorkspaceFile(
      parseIpcPayload("file:create-workspace", workspaceFileCreatePayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:create-workspace-directory",
    async (_, payload) => createWorkspaceDirectory(
      parseIpcPayload("file:create-workspace-directory", workspaceDirectoryCreatePayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:save-workspace-clipboard-image",
    async (_, payload) => saveWorkspaceClipboardImage(
      parseIpcPayload(
        "file:save-workspace-clipboard-image",
        workspaceClipboardImageSavePayloadSchema,
        payload
      )
    )
  );
  electron.ipcMain.handle("clipboard:read-image", async () => readClipboardImage());
  electron.ipcMain.handle(
    "file:rename-workspace-entry",
    async (_, payload) => renameWorkspaceEntry(
      parseIpcPayload("file:rename-workspace-entry", workspaceEntryRenamePayloadSchema, payload)
    )
  );
  electron.ipcMain.handle(
    "file:delete-workspace-entry",
    async (_, payload) => deleteWorkspaceEntry(
      parseIpcPayload("file:delete-workspace-entry", workspaceEntryDeletePayloadSchema, payload)
    )
  );
  electron.ipcMain.handle("file:watch-workspace", async (event, payload) => {
    const request = parseIpcPayload("file:watch-workspace", workspaceFileWatchPayloadSchema, payload);
    const initial = await readWorkspaceFile(request);
    let watchedPath;
    let initialContent;
    let initialSize;
    let initialTruncated;
    if (initial.ok) {
      watchedPath = initial.path;
      initialContent = initial.content;
      initialSize = initial.size;
      initialTruncated = initial.truncated;
    } else {
      const initialImage = await readWorkspaceImage(request);
      if (!initialImage.ok) return initial;
      watchedPath = initialImage.path;
      initialContent = "";
      initialSize = initialImage.size;
      initialTruncated = false;
    }
    const watchId = node_crypto.randomUUID();
    try {
      const watcher = node_fs.watch(watchedPath, { persistent: false }, () => {
        scheduleWorkspaceFileChange(watchId);
      });
      workspaceFileWatchers.set(watchId, {
        watcher,
        sender: event.sender,
        path: watchedPath,
        workspaceRoot: request.workspaceRoot,
        timer: null
      });
      event.sender.once("destroyed", () => disposeWorkspaceFileWatchesForSender(event.sender));
      return {
        ok: true,
        watchId,
        path: watchedPath,
        content: initialContent,
        size: initialSize,
        truncated: initialTruncated,
        startedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      };
    }
  });
  electron.ipcMain.handle(
    "file:unwatch-workspace",
    async (_, watchId) => disposeWorkspaceFileWatch(parseIpcPayload("file:unwatch-workspace", streamIdSchema, watchId))
  );
  electron.ipcMain.handle(
    "write:export",
    async (_, payload) => exportWriteDocument(
      parseIpcPayload("write:export", writeExportPayloadSchema, payload),
      { parentWindow: getMainWindow() }
    )
  );
  electron.ipcMain.handle(
    "write:copy-rich-text",
    async (_, payload) => copyWriteDocumentAsRichText(
      parseIpcPayload("write:copy-rich-text", writeRichClipboardPayloadSchema, payload)
    )
  );
  electron.ipcMain.handle("legal-research:export-word", async (_, payload) => {
    try {
      const { html, defaultName } = parseIpcPayload(
        "legal-research:export-word",
        zod.z.object({ html: zod.z.string(), defaultName: zod.z.string().max(200) }).strict(),
        payload
      );
      const result = await electron.dialog.showSaveDialog({
        title: "导出调研结果",
        defaultPath: `${defaultName.replace(/[<>:"/\\|?*]/g, "_")}.docx`,
        filters: [{ name: "Word 文档", extensions: ["docx"] }]
      });
      if (result.canceled || !result.filePath) {
        return { ok: false, canceled: true };
      }
      const { createRequire } = await import("node:module");
      const require$12 = createRequire(require("url").pathToFileURL(__filename).href);
      const htmlToDocx2 = require$12("html-to-docx");
      const docx = await htmlToDocx2(html, null, {
        title: defaultName,
        creator: "legalwork",
        keywords: ["legal research", "法律调研"],
        description: `法律调研报告：${defaultName}`,
        font: "SimSun",
        fontSize: 24
      });
      const buffer = Buffer.from(
        docx instanceof ArrayBuffer ? new Uint8Array(docx) : Buffer.from(await docx.arrayBuffer())
      );
      await promises.writeFile(result.filePath, buffer);
      return { ok: true, path: result.filePath };
    } catch (error) {
      return {
        ok: false,
        canceled: false,
        message: error instanceof Error ? error.message : String(error)
      };
    }
  });
  electron.ipcMain.handle(
    "write:inline-completion",
    async (_, payload) => requestWriteInlineCompletion(
      await store2.load(),
      parseIpcPayload("write:inline-completion", writeInlineCompletionPayloadSchema, payload)
    )
  );
  electron.ipcMain.handle("write:inline-completion-debug:list", async () => listWriteInlineCompletionDebugEntries());
  electron.ipcMain.handle("write:inline-completion-debug:clear", async () => {
    clearWriteInlineCompletionDebugEntries();
    return true;
  });
  electron.ipcMain.handle(
    "document:generate",
    async (_, payload) => generateDocument(
      await store2.load(),
      parseIpcPayload("document:generate", documentGenerationPayloadSchema, payload)
    )
  );
  setTemplatesBaseDir(electron.app.getPath("userData"));
  electron.ipcMain.handle("templates:list", async () => {
    return listTemplates();
  });
  electron.ipcMain.handle("templates:save", async (_, payload) => {
    const template = parseIpcPayload("templates:save", userTemplateSchema, payload);
    return saveTemplate(template);
  });
  electron.ipcMain.handle("templates:delete", async (_, id) => {
    const validatedId = parseIpcPayload(
      "templates:delete",
      zod.z.string().min(1).max(200),
      id
    );
    return deleteTemplate(validatedId);
  });
  electron.ipcMain.handle("templates:learn", async (_, payload) => {
    const request = parseIpcPayload("templates:learn", templateLearningRequestSchema, payload);
    return learnTemplate(await store2.load(), request);
  });
  electron.ipcMain.handle("templates:generate", async (_, payload) => {
    const request = parseIpcPayload(
      "templates:generate",
      templateGenerateWithMaterialsRequestSchema,
      payload
    );
    return generateFromTemplate(await store2.load(), request);
  });
  setHistoryBaseDir(electron.app.getPath("userData"));
  electron.ipcMain.handle("history:list", async () => {
    return listHistory();
  });
  electron.ipcMain.handle("history:get", async (_, id) => {
    const validatedId = parseIpcPayload("history:get", zod.z.string().min(1).max(200), id);
    return getHistoryRecord(validatedId);
  });
  electron.ipcMain.handle("history:save", async (_, payload) => {
    const record = parseIpcPayload("history:save", documentHistoryRecordSchema, payload);
    return saveHistoryRecord(record);
  });
  electron.ipcMain.handle("history:delete", async (_, id) => {
    const validatedId = parseIpcPayload("history:delete", zod.z.string().min(1).max(200), id);
    return deleteHistoryRecord(validatedId);
  });
  electron.ipcMain.handle("history:clear", async () => {
    return clearHistory();
  });
  electron.ipcMain.handle("desktop:command", async (event, command) => {
    runDesktopCommand(
      parseIpcPayload("desktop:command", desktopCommandSchema, command),
      event.sender,
      getMainWindow
    );
  });
  electron.ipcMain.handle("shell:open-external", async (_, url) => {
    const validatedUrl = parseIpcPayload("shell:open-external", shellOpenExternalUrlSchema, url);
    await electron.shell.openExternal(validatedUrl);
  });
  electron.ipcMain.handle("knowledge:open-file", async (_, payload) => {
    const { path } = parseIpcPayload("knowledge:open-file", knowledgeOpenFilePayloadSchema, payload);
    try {
      const result = await runtimeRequest2(
        `/v1/knowledge/file/absolute-path?path=${encodeURIComponent(path)}`,
        "GET"
      );
      if (!result.ok) {
        return { ok: false, message: result.body || `请求失败：${result.status}` };
      }
      const parsed = JSON.parse(result.body);
      if (!parsed.absolute) {
        return { ok: false, message: "无法解析文件路径" };
      }
      return openPathWithShell(parsed.absolute);
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : String(error)
      };
    }
  });
  electron.ipcMain.handle(
    "notification:turn-complete",
    async (_, payload) => showTurnCompleteNotification2(
      parseIpcPayload("notification:turn-complete", notificationPayloadSchema, payload)
    )
  );
  electron.ipcMain.handle("app:version", async () => getAppVersion());
  electron.ipcMain.handle("gui:update-state", async () => readGuiUpdateState2());
  electron.ipcMain.handle("gui:update-check", async (_, channel) => {
    const module2 = await loadGuiUpdaterModule2();
    return module2.checkGuiUpdate(
      parseIpcPayload(
        "gui:update-check",
        zod.z.object({ channel: guiUpdateChannelSchema }).strict(),
        { channel }
      ).channel
    );
  });
  electron.ipcMain.handle("gui:update-download", async (_, channel) => {
    const module2 = await loadGuiUpdaterModule2();
    return module2.downloadGuiUpdate(
      parseIpcPayload(
        "gui:update-download",
        zod.z.object({ channel: guiUpdateChannelSchema }).strict(),
        { channel }
      ).channel
    );
  });
  electron.ipcMain.handle("gui:update-install", async () => {
    const module2 = await loadGuiUpdaterModule2();
    return module2.installGuiUpdate();
  });
  electron.ipcMain.handle("log:error", async (_, payload) => {
    const request = parseIpcPayload("log:error", logErrorPayloadSchema, payload);
    logError2(request.category, request.message, request.detail);
  });
  electron.ipcMain.handle("log:get-path", async () => resolveLogDirectory2());
  electron.ipcMain.handle("log:open-dir", async () => {
    const dir = resolveLogDirectory2();
    try {
      await promises.mkdir(dir, { recursive: true });
    } catch (error2) {
      const message = error2 instanceof Error ? error2.message : String(error2);
      return { ok: false, message };
    }
    const error = await electron.shell.openPath(dir);
    if (error) return { ok: false, message: error };
    return { ok: true };
  });
}
async function resolvePythonForCompliance(env) {
  const candidates = process.platform === "win32" ? ["python", "python3", "py"] : ["python3", "python"];
  for (const candidate of candidates) {
    try {
      const result = await runCommand(candidate, ["--version"], { env });
      if (result.exitCode === 0 && result.stdout?.includes("Python 3")) {
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}
function runCommand(command, args, options) {
  return new Promise((resolvePromise) => {
    const child2 = node_child_process.spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      cwd: options?.cwd,
      env: options?.env,
      timeout: options?.timeout ?? 12e4
      // 2 min default
    });
    const stdout = [];
    const stderr = [];
    child2.stdout?.on("data", (chunk) => stdout.push(chunk));
    child2.stderr?.on("data", (chunk) => stderr.push(chunk));
    child2.on("close", (exitCode) => {
      resolvePromise({
        exitCode,
        stdout: Buffer.concat(stdout).toString("utf8").trim(),
        stderr: Buffer.concat(stderr).toString("utf8").trim()
      });
    });
    child2.on("error", (error) => {
      resolvePromise({
        exitCode: -1,
        stdout: "",
        stderr: error.message
      });
    });
  });
}
let feishuInstallIsLark = false;
const feishuInstallTargets = /* @__PURE__ */ new Map();
const MAX_FEISHU_INSTALL_TARGETS = 32;
const weixinInstallSessions = /* @__PURE__ */ new Map();
const MAX_WEIXIN_INSTALL_SESSIONS = 32;
const WEIXIN_ALREADY_CONNECTED_MESSAGE = "已连接过此 OpenClaw";
const WEIXIN_BRIDGE_URL_ENV_KEYS = [
  "LEGALWORK_WEIXIN_BRIDGE_URL",
  "LEGALWORK_WEIXIN_BRIDGE_URL",
  "LEGALWORK_OPENCLAW_GATEWAY_URL",
  "OPENCLAW_GATEWAY_URL"
];
const WEIXIN_BRIDGE_MISSING_MESSAGE = "WeChat login bridge is unavailable. Restart the app and try generating the WeChat QR code again.";
const WEIXIN_CHANNEL_ID = "openclaw-weixin";
let managedWeixinBridgeUrlResolver = null;
function asRecord$1(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}
function recordString$1(record, key) {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}
async function readJsonResponse$1(res) {
  const text = await res.text();
  try {
    return asRecord$1(JSON.parse(text));
  } catch {
    return { message: text.trim() || res.statusText };
  }
}
async function postForm(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    signal: AbortSignal.timeout(1e4)
  });
  const data = await readJsonResponse$1(res);
  if (!res.ok) {
    throw new Error(recordString$1(data, "error_description") || recordString$1(data, "message") || `HTTP ${res.status}`);
  }
  return data;
}
async function postFormResult(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
    signal: AbortSignal.timeout(1e4)
  });
  const data = await readJsonResponse$1(res);
  return { ok: res.ok, status: res.status, data };
}
function normalizeIntervalSeconds(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(3, Math.floor(parsed)) : fallback;
}
function rememberFeishuInstallTarget(deviceCode, isLark) {
  feishuInstallTargets.delete(deviceCode);
  feishuInstallTargets.set(deviceCode, isLark);
  while (feishuInstallTargets.size > MAX_FEISHU_INSTALL_TARGETS) {
    const oldestDeviceCode = feishuInstallTargets.keys().next().value;
    if (!oldestDeviceCode) break;
    feishuInstallTargets.delete(oldestDeviceCode);
  }
}
function resolveFeishuInstallTarget(deviceCode) {
  return feishuInstallTargets.get(deviceCode) ?? feishuInstallIsLark;
}
function rememberWeixinInstallSession(deviceCode, sessionKey) {
  weixinInstallSessions.delete(deviceCode);
  weixinInstallSessions.set(deviceCode, sessionKey);
  while (weixinInstallSessions.size > MAX_WEIXIN_INSTALL_SESSIONS) {
    const oldestDeviceCode = weixinInstallSessions.keys().next().value;
    if (!oldestDeviceCode) break;
    weixinInstallSessions.delete(oldestDeviceCode);
  }
}
function configureManagedWeixinBridgeUrlResolver(resolver) {
  managedWeixinBridgeUrlResolver = resolver;
}
async function resolveWeixinBridgeUrl(configuredWeixinBridgeUrl) {
  const configured = configuredWeixinBridgeUrl?.trim() ?? "";
  if (configured) return configured;
  for (const key of WEIXIN_BRIDGE_URL_ENV_KEYS) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  if (managedWeixinBridgeUrlResolver) return managedWeixinBridgeUrlResolver();
  return DEFAULT_WEIXIN_BRIDGE_RPC_URL;
}
function jsonRpcPayload(method, params) {
  return {
    jsonrpc: "2.0",
    id: node_crypto.randomUUID(),
    method,
    params
  };
}
async function requestWeixinBridge(method, params, timeoutMs, configuredWeixinBridgeUrl) {
  const bridgeUrl = await resolveWeixinBridgeUrl(configuredWeixinBridgeUrl);
  if (!bridgeUrl) {
    throw new Error(WEIXIN_BRIDGE_MISSING_MESSAGE);
  }
  const res = await fetch(bridgeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonRpcPayload(method, params)),
    signal: AbortSignal.timeout(timeoutMs)
  });
  const data = await readJsonResponse$1(res);
  if (!res.ok) {
    const message = recordString$1(data, "message");
    if (res.status === 404 || /^not found$/i.test(message)) {
      throw new Error(WEIXIN_BRIDGE_MISSING_MESSAGE);
    }
    throw new Error(message || `HTTP ${res.status}`);
  }
  if (data.ok === false) {
    const rpcError = asRecord$1(data.error);
    throw new Error(
      recordString$1(rpcError, "message") || recordString$1(data, "message") || "WeChat login bridge returned an error."
    );
  }
  const error = data.error;
  if (typeof error === "string" && error.trim()) throw new Error(error.trim());
  if (error && typeof error === "object" && !Array.isArray(error)) {
    const message = recordString$1(error, "message");
    throw new Error(message || "WeChat login bridge returned an error.");
  }
  const payload = data.payload;
  if (data.ok === true && payload && typeof payload === "object") {
    return asRecord$1(payload);
  }
  const result = data.result;
  return asRecord$1(result && typeof result === "object" ? result : data);
}
function readWeixinQrValue(data) {
  return recordString$1(data, "qrDataUrl") || recordString$1(data, "qrUrl") || recordString$1(data, "qrcode") || recordString$1(data, "qrCode") || recordString$1(data, "url");
}
function isWeixinAlreadyConnectedMessage(message) {
  return message.includes(WEIXIN_ALREADY_CONNECTED_MESSAGE);
}
async function startWeixinBridgeChannel(accountId, weixinBridgeUrl) {
  await requestWeixinBridge(
    "channels.start",
    {
      channel: WEIXIN_CHANNEL_ID,
      ...accountId ? { accountId } : {}
    },
    3e4,
    weixinBridgeUrl
  );
}
async function startFeishuInstallQrcode(isLark) {
  try {
    const baseUrl = isLark ? "https://accounts.larksuite.com" : "https://accounts.feishu.cn";
    feishuInstallIsLark = isLark;
    await postForm(`${baseUrl}/oauth/v1/app/registration`, { action: "init" });
    const data = await postForm(`${baseUrl}/oauth/v1/app/registration`, {
      action: "begin",
      archetype: "PersonalAgent",
      auth_method: "client_secret",
      request_user_info: "open_id"
    });
    const url = recordString$1(data, "verification_uri_complete");
    const deviceCode = recordString$1(data, "device_code");
    const userCode = recordString$1(data, "user_code");
    if (!url || !deviceCode) {
      throw new Error(recordString$1(data, "error_description") || recordString$1(data, "message") || "Feishu QR response is incomplete.");
    }
    rememberFeishuInstallTarget(deviceCode, isLark);
    return {
      ok: true,
      url,
      deviceCode,
      userCode,
      interval: normalizeIntervalSeconds(data.interval, 5),
      expireIn: normalizeIntervalSeconds(data.expire_in ?? data.expires_in, 300)
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}
async function pollFeishuInstall(deviceCode) {
  try {
    const baseUrl = resolveFeishuInstallTarget(deviceCode) ? "https://accounts.larksuite.com" : "https://accounts.feishu.cn";
    const result = await postFormResult(`${baseUrl}/oauth/v1/app/registration`, {
      action: "poll",
      device_code: deviceCode
    });
    const data = result.data;
    const error = recordString$1(data, "error");
    if (error) {
      if (error === "authorization_pending" || error === "slow_down") return { done: false };
      feishuInstallTargets.delete(deviceCode);
      return { done: false, error: recordString$1(data, "error_description") || error };
    }
    if (!result.ok) {
      feishuInstallTargets.delete(deviceCode);
      return {
        done: false,
        error: recordString$1(data, "error_description") || recordString$1(data, "message") || `HTTP ${result.status}`
      };
    }
    const appId = recordString$1(data, "client_id");
    const appSecret = recordString$1(data, "client_secret");
    if (appId && appSecret) {
      const userInfo = asRecord$1(data.user_info);
      const domain = recordString$1(userInfo, "tenant_brand") === "lark" ? "lark" : "feishu";
      feishuInstallTargets.delete(deviceCode);
      return { done: true, kind: "feishu", appId, appSecret, domain };
    }
    return { done: false };
  } catch (error) {
    return { done: false, error: error instanceof Error ? error.message : String(error) };
  }
}
async function startWeixinInstallQrcode(weixinBridgeUrl) {
  try {
    const data = await requestWeixinBridge(
      "web.login.start",
      { force: true, timeoutMs: 3e5, verbose: true },
      3e4,
      weixinBridgeUrl
    );
    const url = readWeixinQrValue(data);
    const sessionKey = recordString$1(data, "sessionKey");
    if (!url) {
      throw new Error(recordString$1(data, "message") || "WeChat QR response is incomplete.");
    }
    const deviceCode = node_crypto.randomUUID();
    rememberWeixinInstallSession(deviceCode, sessionKey);
    return {
      ok: true,
      url,
      deviceCode,
      userCode: "",
      interval: 3,
      expireIn: 120
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}
async function pollWeixinInstall(deviceCode, weixinBridgeUrl) {
  const sessionKey = weixinInstallSessions.get(deviceCode) ?? deviceCode;
  try {
    const data = await requestWeixinBridge(
      "web.login.wait",
      { timeoutMs: 48e4, ...sessionKey ? { accountId: sessionKey } : {} },
      49e4,
      weixinBridgeUrl
    );
    const message = recordString$1(data, "message");
    const alreadyConnected = data.alreadyConnected === true || isWeixinAlreadyConnectedMessage(message);
    const connected = data.connected === true || alreadyConnected;
    if (!connected) {
      return { done: false, error: message || "WeChat login was not completed." };
    }
    const accountId = recordString$1(data, "accountId") || sessionKey;
    if (!accountId) {
      return { done: false, error: "WeChat login completed, but no account id was returned." };
    }
    await startWeixinBridgeChannel(recordString$1(data, "accountId"), weixinBridgeUrl);
    weixinInstallSessions.delete(deviceCode);
    return { done: true, kind: "weixin", accountId, sessionKey };
  } catch (error) {
    return { done: false, error: error instanceof Error ? error.message : String(error) };
  }
}
const SSE_RECONNECT_BASE_MS = 750;
const SSE_RECONNECT_MAX_MS = 5e3;
const SSE_START_TIMEOUT_MS = 15e3;
const sseControllers = /* @__PURE__ */ new Map();
async function sleepWithAbort(ms, signal) {
  if (signal.aborted || ms <= 0) return;
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
      resolve();
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}
function parseSseData(raw) {
  const lines = raw.split("\n");
  const dataLines = [];
  let eventName = "";
  let eventId = "";
  for (const line of lines) {
    const normalized = line.endsWith("\r") ? line.slice(0, -1) : line;
    if (normalized.startsWith("event:")) {
      eventName = normalized.slice(6).trim();
      continue;
    }
    if (normalized.startsWith("id:")) {
      eventId = normalized.slice(3).trim();
      continue;
    }
    if (normalized.startsWith("data:")) {
      dataLines.push(normalized.slice(5).trimStart());
    }
  }
  if (!dataLines.length) return null;
  const payload = dataLines.join("\n");
  try {
    return {
      data: JSON.parse(payload),
      ...eventName ? { event: eventName } : {},
      ...eventId ? { id: eventId } : {}
    };
  } catch {
    return null;
  }
}
function takeSseBlock(buffer) {
  const lf = buffer.indexOf("\n\n");
  const crlf = buffer.indexOf("\r\n\r\n");
  if (lf === -1 && crlf === -1) return null;
  if (crlf !== -1 && (lf === -1 || crlf < lf)) {
    return {
      block: buffer.slice(0, crlf),
      rest: buffer.slice(crlf + 4)
    };
  }
  return {
    block: buffer.slice(0, lf),
    rest: buffer.slice(lf + 2)
  };
}
function coerceSsePayload(parsed) {
  const payload = parsed.data && typeof parsed.data === "object" ? { ...parsed.data } : { value: parsed.data };
  if (typeof payload.seq !== "number" && parsed.id && /^\d+$/.test(parsed.id)) {
    payload.seq = Number(parsed.id);
  }
  if (typeof payload.kind !== "string" && parsed.event) {
    payload.kind = parsed.event;
  }
  return payload;
}
function isFatalSseStatus(status) {
  return typeof status === "number" && status >= 400 && status < 500 && status !== 408 && status !== 429;
}
async function fetchSseWithStartTimeout(url, headers, signal, timeoutMs) {
  const attempt = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    attempt.abort();
  }, timeoutMs);
  const onAbort = () => {
    attempt.abort();
  };
  signal.addEventListener("abort", onAbort, { once: true });
  try {
    return await fetch(url, { signal: attempt.signal, headers });
  } catch (error) {
    if (timedOut) {
      throw new Error("sse start timeout");
    }
    throw error;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", onAbort);
  }
}
function registerRuntimeSseIpc(options) {
  const { ipcMain, store: store2, ensureRuntime: ensureRuntime2, logError: logError2 } = options;
  ipcMain.handle("runtime:sse:start", async (event, args) => {
    const request = sseStartPayloadSchema.parse(args);
    const s = await store2.load();
    await ensureRuntime2(s);
    const requestedId = request.streamId?.trim() ?? "";
    const id = requestedId || node_crypto.randomUUID();
    const existing = sseControllers.get(id);
    if (existing) {
      existing.stoppedByClient = true;
      existing.controller.abort();
      sseControllers.delete(id);
    }
    const ac = new AbortController();
    const state = { controller: ac, stoppedByClient: false };
    sseControllers.set(id, state);
    const base = getRuntimeBaseUrlForSettings(s);
    (async () => {
      const wc = event.sender;
      const headers = { Accept: "text/event-stream" };
      runtimeAuthHeaders(s).forEach((value, key) => {
        headers[key] = value;
      });
      let nextSinceSeq = request.sinceSeq;
      let reconnectDelayMs = SSE_RECONNECT_BASE_MS;
      try {
        while (!state.stoppedByClient && !ac.signal.aborted) {
          const url = new node_url.URL(`${base}${legalworkThreadEventsPath(request.threadId)}`);
          url.searchParams.set("since_seq", String(nextSinceSeq));
          const requestHeaders = { ...headers };
          if (nextSinceSeq > 0) {
            requestHeaders["Last-Event-ID"] = String(nextSinceSeq);
          } else {
            delete requestHeaders["Last-Event-ID"];
          }
          try {
            const res = await fetchSseWithStartTimeout(url, requestHeaders, ac.signal, SSE_START_TIMEOUT_MS);
            if (!res.ok || !res.body) {
              if (isFatalSseStatus(res.status)) {
                wc.send("runtime:sse-error", { streamId: id, status: res.status });
                logError2("sse", `SSE connection failed for thread ${request.threadId}`, {
                  status: res.status,
                  streamId: id
                });
                return;
              }
              await sleepWithAbort(reconnectDelayMs, ac.signal);
              reconnectDelayMs = Math.min(reconnectDelayMs * 2, SSE_RECONNECT_MAX_MS);
              continue;
            }
            reconnectDelayMs = SSE_RECONNECT_BASE_MS;
            const reader = res.body.getReader();
            const dec = new TextDecoder();
            let buffer = "";
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += dec.decode(value, { stream: true });
              let next;
              while ((next = takeSseBlock(buffer)) !== null) {
                const block = next.block;
                buffer = next.rest;
                const parsed = parseSseData(block);
                if (parsed !== null) {
                  const payload = coerceSsePayload(parsed);
                  if (typeof payload.seq === "number") {
                    nextSinceSeq = Math.max(nextSinceSeq, payload.seq);
                  }
                  wc.send("runtime:sse-event", { streamId: id, data: payload });
                }
              }
            }
            buffer += dec.decode();
            const trailing = buffer.trim();
            if (trailing) {
              const parsed = parseSseData(trailing);
              if (parsed !== null) {
                const payload = coerceSsePayload(parsed);
                if (typeof payload.seq === "number") {
                  nextSinceSeq = Math.max(nextSinceSeq, payload.seq);
                }
                wc.send("runtime:sse-event", { streamId: id, data: payload });
              }
            }
          } catch (e) {
            if (state.stoppedByClient || ac.signal.aborted) return;
            const msg = e instanceof Error ? e.message : String(e);
            if (/sse start timeout/i.test(msg) || /fetch failed/i.test(msg) || /network/i.test(msg)) {
              await sleepWithAbort(reconnectDelayMs, ac.signal);
              reconnectDelayMs = Math.min(reconnectDelayMs * 2, SSE_RECONNECT_MAX_MS);
              continue;
            }
            wc.send("runtime:sse-error", { streamId: id, message: msg });
            logError2("sse", `SSE stream error for thread ${request.threadId}`, { message: msg, streamId: id });
            return;
          }
        }
      } finally {
        if (!state.stoppedByClient && !ac.signal.aborted) {
          wc.send("runtime:sse-end", { streamId: id });
        }
        sseControllers.delete(id);
      }
    })();
    return { streamId: id };
  });
  ipcMain.handle("runtime:sse:stop", async (_, streamId) => {
    const normalizedStreamId = streamIdSchema.parse(streamId);
    const state = sseControllers.get(normalizedStreamId);
    if (state) {
      state.stoppedByClient = true;
      state.controller.abort();
    }
    return true;
  });
}
const requireFromHere = node_module.createRequire(require("url").pathToFileURL(__filename).href);
const WEIXIN_BRIDGE_PORT = 18790;
const WEIXIN_BRIDGE_MAX_PORT_ATTEMPTS = 20;
const WEIXIN_BRIDGE_HEALTH_TIMEOUT_MS = 3e3;
const WEIXIN_BRIDGE_STATE_DIR_NAME = "weixin-bridge";
const WEIXIN_PLUGIN_ID = "openclaw-weixin";
const WEIXIN_API_BASE_URL = "https://ilinkai.weixin.qq.com";
const WEIXIN_CDN_BASE_URL = "https://novac2c.cdn.weixin.qq.com/c2c";
const WEIXIN_DEFAULT_BOT_TYPE = "3";
const LOGIN_TTL_MS = 5 * 6e4;
const QR_LONG_POLL_TIMEOUT_MS = 35e3;
const DEFAULT_LONG_POLL_TIMEOUT_MS = 35e3;
const DEFAULT_API_TIMEOUT_MS = 15e3;
const RETRY_DELAY_MS = 2e3;
const BACKOFF_DELAY_MS = 3e4;
const MessageType = {
  BOT: 2
};
const MessageItemType = {
  TEXT: 1,
  VOICE: 3
};
const MessageState = {
  FINISH: 2
};
let server = null;
let startPromise = null;
let runtimeContextProvider = null;
let activeBridgePort = WEIXIN_BRIDGE_PORT;
let packageInfoCache = null;
const activeLogins = /* @__PURE__ */ new Map();
const contextTokenStore = /* @__PURE__ */ new Map();
const monitors = /* @__PURE__ */ new Map();
function sleep$1(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function resolveRpcUrl(port = activeBridgePort) {
  const url = new URL(DEFAULT_WEIXIN_BRIDGE_RPC_URL);
  url.port = String(port);
  return url.toString();
}
function configureWeixinBridgeRuntimeContextProvider(provider) {
  runtimeContextProvider = provider;
}
async function resolveRuntimeContext() {
  return runtimeContextProvider ? runtimeContextProvider() : {
    webhookUrl: "http://127.0.0.1:8787/claw/im",
    webhookSecret: "",
    channelId: ""
  };
}
function resolvePackagePath(packageName, subpath) {
  try {
    return requireFromHere.resolve(`${packageName}/${subpath}`);
  } catch {
    return null;
  }
}
function resolveWeixinPluginRoot() {
  const packageJson = resolvePackagePath("@tencent-weixin/openclaw-weixin", "package.json");
  return packageJson ? node_path.dirname(packageJson) : null;
}
function readWeixinPackageInfo() {
  if (packageInfoCache) return packageInfoCache;
  const packageJson = resolvePackagePath("@tencent-weixin/openclaw-weixin", "package.json");
  if (!packageJson) {
    throw new Error(
      "Built-in WeChat login component is missing. Reinstall legalwork or rebuild with @tencent-weixin/openclaw-weixin bundled."
    );
  }
  const parsed = JSON.parse(node_fs.readFileSync(packageJson, "utf8"));
  packageInfoCache = {
    version: typeof parsed.version === "string" ? parsed.version : "0.0.0",
    appId: typeof parsed.ilink_appid === "string" ? parsed.ilink_appid : "bot"
  };
  return packageInfoCache;
}
function buildClientVersion(version) {
  const [major = 0, minor = 0, patch = 0] = version.split(".").map((part) => Number.parseInt(part, 10)).map((part) => Number.isFinite(part) ? part : 0);
  return (major & 255) << 16 | (minor & 255) << 8 | patch & 255;
}
function buildBaseInfo() {
  const info = readWeixinPackageInfo();
  return {
    channel_version: info.version,
    bot_agent: `DeepSeekGUI/${electron.app.getVersion() || "0.0.0"}`
  };
}
function randomWechatUin() {
  const uint32 = node_crypto.randomBytes(4).readUInt32BE(0);
  return Buffer.from(String(uint32), "utf8").toString("base64");
}
function buildCommonHeaders() {
  const info = readWeixinPackageInfo();
  return {
    "iLink-App-Id": info.appId,
    "iLink-App-ClientVersion": String(buildClientVersion(info.version))
  };
}
function buildHeaders(token) {
  return {
    "Content-Type": "application/json",
    AuthorizationType: "ilink_bot_token",
    "X-WECHAT-UIN": randomWechatUin(),
    ...buildCommonHeaders(),
    ...token?.trim() ? { Authorization: `Bearer ${token.trim()}` } : {}
  };
}
async function readJsonResponse(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text.trim() || res.statusText };
  }
}
async function apiGet(baseUrl, endpoint, timeoutMs, label) {
  const url = new URL(endpoint, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: buildCommonHeaders(),
    signal: AbortSignal.timeout(timeoutMs)
  });
  const data = await readJsonResponse(res);
  if (!res.ok) {
    throw new Error(`${label} ${res.status}: ${recordString(data, "message") || JSON.stringify(data)}`);
  }
  return data;
}
async function apiPost(baseUrl, endpoint, body, options) {
  const url = new URL(endpoint, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: buildHeaders(options.token),
    body: JSON.stringify(body),
    signal: options.timeoutMs ? AbortSignal.timeout(options.timeoutMs) : void 0
  });
  const data = await readJsonResponse(res);
  if (!res.ok) {
    throw new Error(`${options.label} ${res.status}: ${recordString(data, "message") || JSON.stringify(data)}`);
  }
  return data;
}
function asRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}
function recordString(record, key) {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}
function stateRoot() {
  return node_path.join(electron.app.getPath("userData"), WEIXIN_BRIDGE_STATE_DIR_NAME);
}
function weixinStateDir() {
  return node_path.join(stateRoot(), WEIXIN_PLUGIN_ID);
}
function accountsIndexPath() {
  return node_path.join(weixinStateDir(), "accounts.json");
}
function accountsDir() {
  return node_path.join(weixinStateDir(), "accounts");
}
function accountPath(accountId) {
  return node_path.join(accountsDir(), `${accountId}.json`);
}
function syncBufPath(accountId) {
  return node_path.join(accountsDir(), `${accountId}.sync.json`);
}
function contextTokensPath(accountId) {
  return node_path.join(accountsDir(), `${accountId}.context-tokens.json`);
}
function configPath() {
  return node_path.join(stateRoot(), "weixin-bridge.json");
}
function legacyOpenClawConfigPath() {
  return node_path.join(stateRoot(), "openclaw.json");
}
function isBlockedObjectKey(value) {
  return value === "__proto__" || value === "prototype" || value === "constructor";
}
function normalizeAccountId(value) {
  const trimmed = value.trim();
  if (!trimmed) return "default";
  const lowered = trimmed.toLowerCase();
  const normalized = /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(trimmed) ? lowered : lowered.replace(/[^a-z0-9_-]+/g, "-").replace(/^-+/, "").replace(/-+$/, "").slice(0, 64);
  return normalized && !isBlockedObjectKey(normalized) ? normalized : "default";
}
function deriveRawAccountId(normalizedId) {
  if (normalizedId.endsWith("-im-bot")) return `${normalizedId.slice(0, -7)}@im.bot`;
  if (normalizedId.endsWith("-im-wechat")) return `${normalizedId.slice(0, -10)}@im.wechat`;
  return void 0;
}
async function ensureStateDirs() {
  await promises.mkdir(accountsDir(), { recursive: true });
}
async function readJsonFile(filePath2) {
  const raw = await promises.readFile(filePath2, "utf8");
  return JSON.parse(raw);
}
async function writeJsonIfChanged(filePath2, value) {
  const next = `${JSON.stringify(value, null, 2)}
`;
  try {
    const current = await promises.readFile(filePath2, "utf8");
    if (current === next) return;
  } catch {
  }
  await promises.mkdir(node_path.dirname(filePath2), { recursive: true });
  await promises.writeFile(filePath2, next, "utf8");
}
async function listIndexedWeixinAccountIds() {
  try {
    const parsed = await readJsonFile(accountsIndexPath());
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string" && id.trim() !== "") : [];
  } catch {
    return [];
  }
}
async function registerWeixinAccountId(accountId) {
  await ensureStateDirs();
  const existing = await listIndexedWeixinAccountIds();
  if (existing.includes(accountId)) return;
  await writeJsonIfChanged(accountsIndexPath(), [...existing, accountId]);
}
async function unregisterWeixinAccountId(accountId) {
  const existing = await listIndexedWeixinAccountIds();
  const next = existing.filter((id) => id !== accountId);
  if (next.length !== existing.length) await writeJsonIfChanged(accountsIndexPath(), next);
}
async function readAccountFile(filePath2) {
  try {
    const parsed = await readJsonFile(filePath2);
    return asRecord(parsed);
  } catch {
    return null;
  }
}
async function loadLegacyToken() {
  try {
    const parsed = await readJsonFile(node_path.join(stateRoot(), "credentials", WEIXIN_PLUGIN_ID, "credentials.json"));
    const token = asRecord(parsed).token;
    return typeof token === "string" && token.trim() ? token.trim() : void 0;
  } catch {
    return void 0;
  }
}
async function loadWeixinAccountData(accountId) {
  const primary = await readAccountFile(accountPath(accountId));
  if (primary) return primary;
  const rawId = deriveRawAccountId(accountId);
  if (rawId) {
    const compat = await readAccountFile(accountPath(rawId));
    if (compat) return compat;
  }
  const legacyToken = await loadLegacyToken();
  return legacyToken ? { token: legacyToken } : null;
}
async function saveWeixinAccount(accountId, update) {
  await ensureStateDirs();
  const existing = await loadWeixinAccountData(accountId) ?? {};
  const token = update.token?.trim() || existing.token?.trim();
  const baseUrl = update.baseUrl?.trim() || existing.baseUrl?.trim();
  const userId = update.userId !== void 0 ? update.userId.trim() || void 0 : existing.userId?.trim() || void 0;
  await writeJsonIfChanged(accountPath(accountId), {
    ...token ? { token, savedAt: (/* @__PURE__ */ new Date()).toISOString() } : {},
    ...baseUrl ? { baseUrl } : {},
    ...userId ? { userId } : {}
  });
  await registerWeixinAccountId(accountId);
}
async function clearWeixinAccount(accountId) {
  for (const filePath2 of [accountPath(accountId), syncBufPath(accountId), contextTokensPath(accountId)]) {
    try {
      await promises.unlink(filePath2);
    } catch {
    }
  }
  await unregisterWeixinAccountId(accountId);
}
async function clearStaleAccountsForUserId(currentAccountId, userId) {
  if (!userId.trim()) return;
  for (const id of await listIndexedWeixinAccountIds()) {
    if (id === currentAccountId) continue;
    const data = await loadWeixinAccountData(id);
    if (data?.userId?.trim() === userId) await clearWeixinAccount(id);
  }
}
async function resolveWeixinAccount(accountId) {
  const id = normalizeAccountId(accountId);
  const data = await loadWeixinAccountData(id);
  const token = data?.token?.trim();
  return {
    accountId: id,
    baseUrl: data?.baseUrl?.trim() || WEIXIN_API_BASE_URL,
    cdnBaseUrl: WEIXIN_CDN_BASE_URL,
    token,
    configured: Boolean(token),
    userId: data?.userId?.trim() || void 0
  };
}
async function readBridgeConfig() {
  try {
    const parsed = await readJsonFile(configPath());
    return asRecord(parsed);
  } catch {
    try {
      const parsed = await readJsonFile(legacyOpenClawConfigPath());
      return asRecord(parsed);
    } catch {
      return {};
    }
  }
}
async function prepareBridgeState(port) {
  if (!resolveWeixinPluginRoot()) {
    throw new Error(
      "Built-in WeChat login component is missing. Reinstall legalwork or rebuild with @tencent-weixin/openclaw-weixin bundled."
    );
  }
  await ensureStateDirs();
  await writeJsonIfChanged(configPath(), {
    gateway: {
      mode: "local",
      bind: "loopback",
      port,
      auth: { mode: "none" }
    },
    channels: {
      [WEIXIN_PLUGIN_ID]: {
        enabled: true
      }
    }
  });
}
function isLoginFresh(login) {
  return Date.now() - login.startedAt < LOGIN_TTL_MS;
}
function purgeExpiredLogins() {
  for (const [key, login] of activeLogins) {
    if (!isLoginFresh(login)) activeLogins.delete(key);
  }
}
async function localTokenList() {
  const ids = await listIndexedWeixinAccountIds();
  const tokens = [];
  for (let index = ids.length - 1; index >= 0 && tokens.length < 10; index -= 1) {
    const data = await loadWeixinAccountData(ids[index]);
    const token = data?.token?.trim();
    if (token) tokens.push(token);
  }
  return tokens;
}
async function fetchQRCode(botType = WEIXIN_DEFAULT_BOT_TYPE) {
  return apiPost(
    WEIXIN_API_BASE_URL,
    `ilink/bot/get_bot_qrcode?bot_type=${encodeURIComponent(botType)}`,
    { local_token_list: await localTokenList() },
    { label: "fetchQRCode" }
  );
}
async function pollQRStatus(baseUrl, qrcode) {
  try {
    return await apiGet(
      baseUrl,
      `ilink/bot/get_qrcode_status?qrcode=${encodeURIComponent(qrcode)}`,
      QR_LONG_POLL_TIMEOUT_MS,
      "pollQRStatus"
    );
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") return { status: "wait" };
    logWarn("weixin-bridge", "QR status polling failed; retrying.", {
      message: error instanceof Error ? error.message : String(error)
    });
    return { status: "wait" };
  }
}
async function startWeixinLogin(params) {
  readWeixinPackageInfo();
  purgeExpiredLogins();
  const force = params.force === true;
  const sessionKey = recordString(params, "accountId") || node_crypto.randomUUID();
  const existing = activeLogins.get(sessionKey);
  if (!force && existing && isLoginFresh(existing) && existing.qrcodeUrl) {
    return {
      qrcode: existing.qrcodeUrl,
      qrUrl: existing.qrcodeUrl,
      qrDataUrl: existing.qrcodeUrl,
      sessionKey,
      message: "二维码已显示，请用手机微信扫描。"
    };
  }
  const qr = await fetchQRCode(recordString(params, "botType") || WEIXIN_DEFAULT_BOT_TYPE);
  const qrcode = recordString(qr, "qrcode");
  const qrcodeUrl = recordString(qr, "qrcode_img_content") || recordString(qr, "qrcodeUrl");
  if (!qrcode || !qrcodeUrl) {
    throw new Error(recordString(qr, "message") || "WeChat QR response is incomplete.");
  }
  activeLogins.set(sessionKey, {
    sessionKey,
    qrcode,
    qrcodeUrl,
    startedAt: Date.now(),
    currentApiBaseUrl: WEIXIN_API_BASE_URL
  });
  return {
    qrcode: qrcodeUrl,
    qrUrl: qrcodeUrl,
    qrDataUrl: qrcodeUrl,
    sessionKey,
    message: "用手机微信扫描二维码，以继续连接。"
  };
}
async function waitForWeixinLogin(params) {
  const sessionKey = recordString(params, "accountId") || recordString(params, "sessionKey");
  const login = activeLogins.get(sessionKey);
  if (!login) return { connected: false, message: "当前没有进行中的登录，请先发起登录。" };
  if (!isLoginFresh(login)) {
    activeLogins.delete(sessionKey);
    return { connected: false, message: "二维码已过期，请重新生成。" };
  }
  const timeoutMs = Math.max(Number(params.timeoutMs) || 48e4, 1e3);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const status = await pollQRStatus(login.currentApiBaseUrl ?? WEIXIN_API_BASE_URL, login.qrcode);
    switch (recordString(status, "status")) {
      case "wait":
      case "scaned":
        break;
      case "need_verifycode":
        return {
          connected: false,
          message: "微信要求输入手机端验证码。当前 GUI 登录流程暂不支持验证码，请重新生成二维码后再试。"
        };
      case "expired":
        activeLogins.delete(sessionKey);
        return { connected: false, message: "二维码已过期，请重新生成。" };
      case "verify_code_blocked":
        activeLogins.delete(sessionKey);
        return { connected: false, message: "多次输入错误，连接流程已停止。请稍后再试。" };
      case "binded_redirect":
        activeLogins.delete(sessionKey);
        return {
          connected: true,
          alreadyConnected: true,
          accountId: normalizeAccountId(sessionKey),
          sessionKey,
          message: "已连接过此 legalwork，无需重复连接。"
        };
      case "scaned_but_redirect": {
        const redirectHost = recordString(status, "redirect_host");
        if (redirectHost) login.currentApiBaseUrl = `https://${redirectHost}`;
        break;
      }
      case "confirmed": {
        const rawAccountId = recordString(status, "ilink_bot_id");
        const token = recordString(status, "bot_token");
        if (!rawAccountId || !token) {
          activeLogins.delete(sessionKey);
          return { connected: false, message: "登录失败：服务器未返回完整账号信息。" };
        }
        const accountId = normalizeAccountId(rawAccountId);
        const baseUrl = recordString(status, "baseurl") || WEIXIN_API_BASE_URL;
        const userId = recordString(status, "ilink_user_id");
        await saveWeixinAccount(accountId, { token, baseUrl, userId });
        await clearStaleAccountsForUserId(accountId, userId);
        activeLogins.delete(sessionKey);
        return {
          connected: true,
          accountId,
          sessionKey,
          baseUrl,
          userId,
          message: "已将此 legalwork 连接到微信。"
        };
      }
    }
    await sleep$1(1e3);
  }
  activeLogins.delete(sessionKey);
  return { connected: false, message: "登录超时，请重试。" };
}
function contextTokenKey(accountId, userId) {
  return `${accountId}:${userId}`;
}
async function persistContextTokens(accountId) {
  const prefix = `${accountId}:`;
  const tokens = {};
  for (const [key, value] of contextTokenStore) {
    if (key.startsWith(prefix)) tokens[key.slice(prefix.length)] = value;
  }
  await writeJsonIfChanged(contextTokensPath(accountId), tokens);
}
async function restoreContextTokens(accountId) {
  try {
    const parsed = await readJsonFile(contextTokensPath(accountId));
    for (const [userId, token] of Object.entries(asRecord(parsed))) {
      if (typeof token === "string" && token) {
        contextTokenStore.set(contextTokenKey(accountId, userId), token);
      }
    }
  } catch {
  }
}
async function setContextToken(accountId, userId, token) {
  contextTokenStore.set(contextTokenKey(accountId, userId), token);
  await persistContextTokens(accountId);
}
function getContextToken(accountId, userId) {
  return contextTokenStore.get(contextTokenKey(accountId, userId));
}
async function loadSyncBuf(accountId) {
  try {
    const parsed = await readJsonFile(syncBufPath(accountId));
    const value = asRecord(parsed).get_updates_buf;
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}
async function saveSyncBuf(accountId, getUpdatesBuf) {
  await writeJsonIfChanged(syncBufPath(accountId), { get_updates_buf: getUpdatesBuf });
}
async function notifyStart(account) {
  await apiPost(
    account.baseUrl,
    "ilink/bot/msg/notifystart",
    { base_info: buildBaseInfo() },
    { token: account.token, timeoutMs: 1e4, label: "notifyStart" }
  );
}
async function notifyStop(account) {
  await apiPost(
    account.baseUrl,
    "ilink/bot/msg/notifystop",
    { base_info: buildBaseInfo() },
    { token: account.token, timeoutMs: 1e4, label: "notifyStop" }
  );
}
async function getUpdates(account, getUpdatesBuf, timeoutMs) {
  try {
    return await apiPost(
      account.baseUrl,
      "ilink/bot/getupdates",
      {
        get_updates_buf: getUpdatesBuf,
        base_info: buildBaseInfo()
      },
      { token: account.token, timeoutMs, label: "getUpdates" }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return { ret: 0, msgs: [], get_updates_buf: getUpdatesBuf };
    }
    throw error;
  }
}
function generateMessageId() {
  return `legalwork-weixin-${node_crypto.randomUUID()}`;
}
async function sendMessageWeixin(params) {
  const messageId = generateMessageId();
  await apiPost(
    params.account.baseUrl,
    "ilink/bot/sendmessage",
    {
      msg: {
        from_user_id: "",
        to_user_id: params.to,
        client_id: messageId,
        message_type: MessageType.BOT,
        message_state: MessageState.FINISH,
        item_list: [{ type: MessageItemType.TEXT, text_item: { text: params.text } }],
        context_token: params.contextToken
      },
      base_info: buildBaseInfo()
    },
    {
      token: params.account.token,
      timeoutMs: params.timeoutMs ?? DEFAULT_API_TIMEOUT_MS,
      label: "sendMessage"
    }
  );
  return { messageId };
}
function textFromItemList(itemList) {
  if (!Array.isArray(itemList)) return "";
  for (const item of itemList) {
    const record = asRecord(item);
    if (record.type === MessageItemType.TEXT) {
      const text = asRecord(record.text_item).text;
      if (text != null) return String(text).trim();
    }
    if (record.type === MessageItemType.VOICE) {
      const text = asRecord(record.voice_item).text;
      if (text != null) return String(text).trim();
    }
  }
  return "";
}
function buildWebhookMessage(message, accountId, text) {
  const from = message.from_user_id || "";
  return {
    provider: "weixin",
    platform: "weixin",
    text,
    sender: from || "WeChat",
    from,
    chatId: from,
    messageId: message.message_id || generateMessageId(),
    senderId: from,
    senderName: from || "WeChat",
    threadId: "",
    message: {
      provider: "weixin",
      text,
      sender: from || "WeChat",
      accountId
    }
  };
}
async function postToDeepSeekGuiWebhook(message, accountId) {
  const settings = await resolveRuntimeContext();
  const text = textFromItemList(message.item_list);
  if (!text) return { reply: "Only text messages are supported right now." };
  const body = {
    ...buildWebhookMessage(message, accountId, text),
    channelId: settings.channelId || void 0
  };
  const headers = { "content-type": "application/json" };
  if (settings.webhookSecret) {
    headers.authorization = `Bearer ${settings.webhookSecret}`;
    headers["x-legalwork-secret"] = settings.webhookSecret;
    headers["x-legalwork-secret"] = settings.webhookSecret;
  }
  const res = await fetch(settings.webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(65e4)
  });
  const data = await readJsonResponse(res);
  if (!res.ok || data.ok === false) {
    throw new Error(recordString(data, "message") || `legalwork webhook HTTP ${res.status}`);
  }
  return data;
}
async function monitorWeixinAccount(accountId, signal) {
  const account = await resolveWeixinAccount(accountId);
  if (!account.configured || !account.token?.trim()) {
    throw new Error(`WeChat account is not configured: ${accountId}`);
  }
  await restoreContextTokens(account.accountId);
  try {
    await notifyStart(account);
  } catch {
  }
  let getUpdatesBuf = await loadSyncBuf(account.accountId);
  let nextTimeoutMs = DEFAULT_LONG_POLL_TIMEOUT_MS;
  let consecutiveFailures = 0;
  while (!signal.aborted) {
    try {
      const resp = await getUpdates(account, getUpdatesBuf, nextTimeoutMs);
      if (typeof resp.longpolling_timeout_ms === "number" && resp.longpolling_timeout_ms > 0) {
        nextTimeoutMs = resp.longpolling_timeout_ms;
      }
      const ret = Number(resp.ret ?? 0);
      const errcode = Number(resp.errcode ?? 0);
      if (ret !== 0 || errcode !== 0) {
        consecutiveFailures += 1;
        await sleep$1(consecutiveFailures >= 3 ? BACKOFF_DELAY_MS : RETRY_DELAY_MS);
        if (consecutiveFailures >= 3) consecutiveFailures = 0;
        continue;
      }
      consecutiveFailures = 0;
      const nextBuf = typeof resp.get_updates_buf === "string" ? resp.get_updates_buf : "";
      if (nextBuf) {
        getUpdatesBuf = nextBuf;
        await saveSyncBuf(account.accountId, getUpdatesBuf);
      }
      const messages = Array.isArray(resp.msgs) ? resp.msgs : [];
      for (const message of messages) {
        if (signal.aborted) return;
        if (message.message_type === MessageType.BOT) continue;
        const to = message.from_user_id || "";
        if (!to) continue;
        const contextToken = message.context_token || void 0;
        if (contextToken) await setContextToken(account.accountId, to, contextToken);
        const result = await postToDeepSeekGuiWebhook(message, account.accountId);
        const reply = recordString(result, "reply") || recordString(result, "text");
        if (!reply) continue;
        await sendMessageWeixin({
          account,
          to,
          text: reply,
          contextToken
        });
      }
    } catch (error) {
      if (signal.aborted) return;
      logWarn("weixin-bridge", "WeChat monitor iteration failed.", {
        accountId: account.accountId,
        message: error instanceof Error ? error.message : String(error)
      });
      consecutiveFailures += 1;
      await sleep$1(consecutiveFailures >= 3 ? BACKOFF_DELAY_MS : RETRY_DELAY_MS);
      if (consecutiveFailures >= 3) consecutiveFailures = 0;
    }
  }
  try {
    await notifyStop(account);
  } catch {
  }
}
function startAccountMonitor(accountId) {
  const normalized = normalizeAccountId(accountId);
  const existing = monitors.get(normalized);
  if (existing && !existing.controller.signal.aborted) return;
  const controller = new AbortController();
  const promise = monitorWeixinAccount(normalized, controller.signal).catch((error) => {
    if (!controller.signal.aborted) {
      logError("weixin-bridge", "WeChat monitor stopped.", {
        accountId: normalized,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }).finally(() => {
    if (monitors.get(normalized)?.controller === controller) monitors.delete(normalized);
  });
  monitors.set(normalized, { accountId: normalized, controller, promise });
}
async function startWeixinChannels(params) {
  const requestedAccountId = recordString(params, "accountId");
  const accountIds = requestedAccountId ? [normalizeAccountId(requestedAccountId)] : await listIndexedWeixinAccountIds();
  for (const accountId of accountIds) startAccountMonitor(accountId);
  return { started: accountIds };
}
async function stopWeixinChannels(params) {
  const requestedAccountId = recordString(params, "accountId");
  const targets = requestedAccountId ? [normalizeAccountId(requestedAccountId)] : [...monitors.keys()];
  for (const accountId of targets) {
    monitors.get(accountId)?.controller.abort();
    monitors.delete(accountId);
  }
  return { stopped: targets };
}
async function dispatchRpc(method, params) {
  switch (method) {
    case "web.login.start":
      return startWeixinLogin(params);
    case "web.login.wait":
      return waitForWeixinLogin(params);
    case "channels.start":
      if (recordString(params, "channel") && recordString(params, "channel") !== WEIXIN_PLUGIN_ID) {
        throw new Error(`Unsupported channel: ${recordString(params, "channel")}`);
      }
      return startWeixinChannels(params);
    case "channels.stop":
      return stopWeixinChannels(params);
    case "accounts.list":
      return { accounts: await listIndexedWeixinAccountIds() };
    default:
      throw new Error(`Unknown WeChat bridge method: ${method}`);
  }
}
async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}
function writeJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(body)}
`);
}
async function handleBridgeRequest(request, response) {
  try {
    const url = new URL(request.url || "/", `http://127.0.0.1:${activeBridgePort}`);
    if (request.method === "GET" && url.pathname === "/health") {
      writeJson(response, 200, { ok: true, status: "live" });
      return;
    }
    if (request.method !== "POST" || url.pathname !== "/api/v1/admin/rpc") {
      writeJson(response, 404, { ok: false, message: "Not found" });
      return;
    }
    const body = asRecord(JSON.parse(await readRequestBody(request)));
    const id = body.id ?? null;
    const method = recordString(body, "method");
    const params = asRecord(body.params);
    if (!method) throw new Error("JSON-RPC method is required.");
    const result = await dispatchRpc(method, params);
    writeJson(response, 200, { jsonrpc: "2.0", id, ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeJson(response, 200, {
      jsonrpc: "2.0",
      id: null,
      ok: false,
      error: { message }
    });
  }
}
async function fetchBridgeHealth(port = activeBridgePort) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/health`, {
      signal: AbortSignal.timeout(WEIXIN_BRIDGE_HEALTH_TIMEOUT_MS)
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    return data?.ok === true || data?.status === "live" || data?.status === "ok";
  } catch {
    return false;
  }
}
async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const probe = node_net.createServer();
    probe.unref();
    probe.once("error", () => resolve(false));
    probe.listen({ host: "127.0.0.1", port }, () => {
      probe.close(() => resolve(true));
    });
  });
}
async function resolveAvailableBridgePort() {
  if (server && await fetchBridgeHealth(activeBridgePort)) return activeBridgePort;
  for (let offset = 0; offset < WEIXIN_BRIDGE_MAX_PORT_ATTEMPTS; offset += 1) {
    const port = WEIXIN_BRIDGE_PORT + offset;
    if (await isPortAvailable(port)) return port;
  }
  throw new Error("Built-in WeChat login component could not find an available local port.");
}
async function listen(serverToStart, port) {
  await new Promise((resolve, reject) => {
    const onError = (error) => {
      serverToStart.off("listening", onListening);
      reject(error);
    };
    const onListening = () => {
      serverToStart.off("error", onError);
      resolve();
    };
    serverToStart.once("error", onError);
    serverToStart.once("listening", onListening);
    serverToStart.listen({ host: "127.0.0.1", port });
  });
}
async function startBridgeServer() {
  if (server && await fetchBridgeHealth(activeBridgePort)) return resolveRpcUrl();
  const port = await resolveAvailableBridgePort();
  activeBridgePort = port;
  await prepareBridgeState(port);
  server = node_http.createServer((request, response) => {
    void handleBridgeRequest(request, response);
  });
  await listen(server, port);
  logInfo("weixin-bridge", `started built-in GUI WeChat bridge on port ${port}`);
  await startWeixinChannels({});
  return resolveRpcUrl();
}
async function ensureWeixinBridgeRpcUrl() {
  if (!startPromise) {
    startPromise = startBridgeServer().catch((error) => {
      startPromise = null;
      throw error;
    });
  }
  return startPromise;
}
async function sendWeixinBridgeMessage(options) {
  const accountId = normalizeAccountId(options.accountId);
  const to = options.to.trim();
  const text = options.text.trim();
  if (!accountId) return { ok: false, message: "WeChat account id is missing." };
  if (!to) return { ok: false, message: "WeChat recipient is missing." };
  if (!text) return { ok: false, message: "Message is empty." };
  try {
    await ensureWeixinBridgeRpcUrl();
    const cfg2 = await readBridgeConfig();
    void cfg2;
    const account = await resolveWeixinAccount(accountId);
    if (!account.configured || !account.token?.trim()) {
      return { ok: false, message: "WeChat account is not configured." };
    }
    await restoreContextTokens(account.accountId);
    const result = await sendMessageWeixin({
      account,
      to,
      text,
      contextToken: getContextToken(account.accountId, to)
    });
    return { ok: true, messageId: result.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logError("weixin-bridge", "Failed to send WeChat message from GUI.", {
      message,
      accountId,
      to
    });
    return { ok: false, message };
  }
}
function stopWeixinBridgeRuntime() {
  startPromise = null;
  for (const monitor of monitors.values()) monitor.controller.abort();
  monitors.clear();
  if (!server) return;
  const runningServer = server;
  server = null;
  runningServer.close();
}
const __dirname$1 = node_path.dirname(node_url.fileURLToPath(require("url").pathToFileURL(__filename).href));
const HIDDEN_START_ARG = "--hidden";
const startupTraceEnabled = process.env.DEEPSEEK_GUI_STARTUP_TRACE === "1";
const startupTraceStart = Date.now();
function traceStartup(label, detail) {
  if (!startupTraceEnabled) return;
  const elapsed = String(Date.now() - startupTraceStart).padStart(6, " ");
  if (detail === void 0) {
    console.info(`[startup +${elapsed}ms] ${label}`);
  } else {
    console.info(`[startup +${elapsed}ms] ${label}`, detail);
  }
}
function shouldStartWeixinBridgeRuntime(settings) {
  return settings.claw.enabled && settings.claw.im.enabled && settings.claw.channels.some((channel) => channel.enabled && channel.provider === "weixin");
}
function syncWeixinBridgeRuntime(settings) {
  if (!shouldStartWeixinBridgeRuntime(settings)) return;
  void ensureWeixinBridgeRpcUrl().catch((error) => {
    logWarn("weixin-bridge", "Failed to start managed WeChat bridge.", {
      message: error instanceof Error ? error.message : String(error)
    });
  });
}
const runningClawScheduleMcpServer = process.argv.includes("--gui-schedule-mcp-server") || process.argv.includes("--claw-schedule-mcp-server");
function resolveLogDirectory() {
  return node_path.join(electron.app.getPath("userData"), "logs");
}
function resolvePreloadPath() {
  const cjsPath = node_path.join(__dirname$1, "../preload/index.cjs");
  if (node_fs.existsSync(cjsPath)) return cjsPath;
  return node_path.join(__dirname$1, "../preload/index.mjs");
}
function getClawScheduleMcpLaunchConfig() {
  return {
    appPath: electron.app.getAppPath(),
    execPath: process.execPath,
    isPackaged: electron.app.isPackaged
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function runtimeFailure(code, message, status = 0, details) {
  return {
    ok: false,
    status,
    body: JSON.stringify({ code, message, ...details !== void 0 ? { details } : {} })
  };
}
function resolveConfiguredApiKey(settings) {
  const fromSettings = getActiveAgentApiKey(settings);
  const fromEnv = process.env.DEEPSEEK_API_KEY?.trim() ?? "";
  return fromSettings || fromEnv;
}
function runtimeJsonError(code, message) {
  return runtimeErrorToError({ code, message });
}
traceStartup("main module evaluated");
if (runningClawScheduleMcpServer && process.platform === "darwin" && electron.app.dock) {
  electron.app.dock.hide();
}
configureAppIdentity();
if (!runningClawScheduleMcpServer && process.platform === "win32") {
  electron.app.setAppUserModelId(APP_USER_MODEL_ID);
}
let mainWindow = null;
let store;
let logDir = "";
let clawRuntime = null;
let scheduleRuntime = null;
let managedRuntimesStoppedForQuit = false;
let managedRuntimesStopPromise = null;
let appBehavior = normalizeAppBehaviorSettings();
let tray = null;
let isQuitting = false;
let guiUpdaterModulePromise = null;
let guiUpdaterInitialized = false;
function emitClawChannelActivity(payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.webContents.send("claw:channel-activity", payload);
}
const MANAGED_STOP_TIMEOUT_MS = 1200;
async function stopManagedRuntimesForQuit() {
  if (managedRuntimesStoppedForQuit) return;
  await Promise.race([
    stopManagedRuntimes(),
    new Promise((resolve) => setTimeout(resolve, MANAGED_STOP_TIMEOUT_MS))
  ]);
  managedRuntimesStoppedForQuit = true;
}
async function stopManagedRuntimes() {
  if (!managedRuntimesStopPromise) {
    managedRuntimesStopPromise = (async () => {
      scheduleRuntime?.stop();
      clawRuntime?.stop();
      stopWeixinBridgeRuntime();
      await legalworkRuntimeAdapter.stopAndWait();
    })().finally(() => {
      managedRuntimesStopPromise = null;
    });
  }
  return managedRuntimesStopPromise;
}
async function loadGuiUpdaterModule() {
  if (!guiUpdaterModulePromise) {
    guiUpdaterModulePromise = Promise.resolve().then(() => require("./chunks/gui-updater-Cqmr3Ajd.cjs")).then((module2) => {
      if (!guiUpdaterInitialized) {
        module2.initializeGuiUpdater(
          () => mainWindow,
          async () => (await store.load()).guiUpdate.channel,
          stopManagedRuntimesForQuit
        );
        guiUpdaterInitialized = true;
      }
      return module2;
    }).catch((error) => {
      guiUpdaterModulePromise = null;
      throw error;
    });
  }
  return guiUpdaterModulePromise;
}
async function readGuiUpdateState() {
  if (!guiUpdaterModulePromise) return { status: "idle" };
  try {
    const module2 = await loadGuiUpdaterModule();
    return module2.getGuiUpdateState();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
      code: "unknown"
    };
  }
}
function installDevPreviewWebviewGuards() {
  electron.app.on("web-contents-created", (_, contents) => {
    contents.on("will-attach-webview", (event, webPreferences, params) => {
      const src = typeof params.src === "string" ? params.src : "";
      if (!isAllowedDevPreviewUrl(src)) {
        event.preventDefault();
        return;
      }
      delete webPreferences.preload;
      delete webPreferences.preloadURL;
      webPreferences.nodeIntegration = false;
      webPreferences.contextIsolation = true;
      webPreferences.sandbox = true;
      webPreferences.webSecurity = true;
      webPreferences.allowRunningInsecureContent = false;
    });
    contents.on("will-navigate", (event, navigationUrl) => {
      if (contents.getType() !== "webview") return;
      if (!isAllowedDevPreviewUrl(navigationUrl)) event.preventDefault();
    });
    contents.setWindowOpenHandler(({ url }) => {
      if (contents.getType() !== "webview") return { action: "allow" };
      return isAllowedDevPreviewUrl(url) ? { action: "allow" } : { action: "deny" };
    });
  });
}
const appIcon = createAppIcon(legalworkLogoPng);
traceStartup("app icon loaded", { source: legalworkLogoPng.startsWith("data:") ? "data-url" : "path" });
const gotSingleInstanceLock = runningClawScheduleMcpServer || electron.app.requestSingleInstanceLock();
traceStartup("single instance lock checked", {
  gotSingleInstanceLock,
  skippedForClawScheduleMcpServer: runningClawScheduleMcpServer
});
function trayLabels(locale) {
  if (locale === "zh") {
    return {
      show: `显示 ${APP_PRODUCT_NAME}`,
      quit: "退出",
      tooltip: APP_PRODUCT_NAME
    };
  }
  return {
    show: `Show ${APP_PRODUCT_NAME}`,
    quit: "Quit",
    tooltip: APP_PRODUCT_NAME
  };
}
function shouldStartHidden(settings) {
  return process.platform === "win32" && settings.appBehavior.openAtLogin && settings.appBehavior.startMinimized && process.argv.includes(HIDDEN_START_ARG);
}
function syncLoginItemSettings(settings) {
  if (process.platform !== "win32" && process.platform !== "darwin") return;
  const behavior = settings.appBehavior;
  try {
    electron.app.setLoginItemSettings({
      openAtLogin: behavior.openAtLogin,
      args: process.platform === "win32" && behavior.openAtLogin && behavior.startMinimized ? [HIDDEN_START_ARG] : []
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[legalwork] failed to update login item settings:", error);
    logWarn("desktop-behavior", "Failed to update login item settings.", { message });
  }
}
function revealMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}
function syncTray(settings) {
  appBehavior = settings.appBehavior;
  if (!appBehavior.closeToTray) {
    if (tray) {
      tray.destroy();
      tray = null;
    }
    return;
  }
  if (!tray) {
    tray = new electron.Tray(appIcon.isEmpty() ? electron.nativeImage.createEmpty() : appIcon);
    tray.on("click", revealMainWindow);
    tray.on("double-click", revealMainWindow);
  }
  const labels = trayLabels(settings.locale);
  tray.setToolTip(labels.tooltip);
  tray.setContextMenu(
    electron.Menu.buildFromTemplate([
      { label: labels.show, click: revealMainWindow },
      { type: "separator" },
      {
        label: labels.quit,
        click: () => {
          isQuitting = true;
          electron.app.quit();
        }
      }
    ])
  );
}
function normalizeNotificationText(raw, fallback, maxLength) {
  const value = typeof raw === "string" && raw.trim() ? raw.trim() : fallback;
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}
async function showTurnCompleteNotification(payload) {
  const settings = await store.load();
  if (!settings.notifications.turnComplete) {
    return { ok: true, shown: false, reason: "disabled" };
  }
  if (!electron.Notification.isSupported()) {
    return { ok: true, shown: false, reason: "unsupported" };
  }
  const title = normalizeNotificationText(payload.title, APP_PRODUCT_NAME, 80);
  const body = normalizeNotificationText(payload.body, "Conversation complete.", 180);
  try {
    const notification = new electron.Notification({
      title,
      body,
      icon: appIcon.isEmpty() ? void 0 : appIcon
    });
    notification.on("click", () => {
      revealMainWindow();
    });
    notification.show();
    return { ok: true, shown: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logError("notification", "Failed to show turn completion notification", {
      message,
      threadId: payload.threadId
    });
    return { ok: false, message };
  }
}
async function probeThreadApi(settings) {
  const base = getRuntimeBaseUrlForSettings(settings);
  const headers = runtimeAuthHeaders(settings);
  headers.set("Accept", "application/json");
  try {
    const res = await fetch(`${base}/v1/threads?limit=1`, {
      headers,
      signal: AbortSignal.timeout(2e3)
    });
    if (res.ok) return { ok: true };
    const info = parseRuntimeErrorBody(
      await res.text(),
      "The local runtime returned an unexpected error."
    );
    if (res.status === 401 && /bearer token required/i.test(info.message)) {
      return {
        ok: false,
        error: "runtime_auth_required",
        message: "The local runtime requires a bearer token for thread APIs."
      };
    }
    return {
      ok: false,
      error: info.code === "unknown" ? "runtime_request_failed" : info.code,
      message: info.message
    };
  } catch (e) {
    return {
      ok: false,
      error: "fetch_failed",
      message: e instanceof Error ? e.message : String(e)
    };
  }
}
async function waitForLegalworkHealth(settings, timeoutMs) {
  const base = getRuntimeBaseUrlForSettings(settings);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    try {
      const remaining = Math.max(1, deadline - Date.now());
      const res = await fetch(`${base}/health`, {
        headers: runtimeAuthHeaders(settings),
        signal: AbortSignal.timeout(Math.max(250, Math.min(1e3, remaining)))
      });
      if (res.ok && isLegalworkHealthResponseBody(await res.text())) return true;
    } catch {
    }
    await sleep(150);
  }
  return false;
}
let runtimeEnsurePromise = null;
let runtimeEnsureFingerprint = null;
let runtimeSettingsApplyPromise = null;
let lastAppliedSettings = null;
function queueRuntimeSettingsApply(prev, next) {
  const anchor = lastAppliedSettings ?? prev;
  lastAppliedSettings = next;
  const startupConfigChanged = runtimeStartupConfigChanged(anchor, next);
  if (!startupConfigChanged) return;
  const previousTask = runtimeSettingsApplyPromise ?? Promise.resolve();
  const task = previousTask.catch(() => void 0).then(async () => {
    const current = lastAppliedSettings ?? next;
    await restartManagedRuntimeForSettingsChange(anchor, current);
  }).catch((error) => {
    logWarn("settings-apply", "Failed to apply Legalwork runtime settings in background", {
      message: error instanceof Error ? error.message : String(error)
    });
  }).finally(() => {
    if (runtimeSettingsApplyPromise === task) {
      runtimeSettingsApplyPromise = null;
    }
  });
  runtimeSettingsApplyPromise = task;
}
function queueRuntimeMcpConfigApply(settings) {
  lastAppliedSettings = settings;
  const previousTask = runtimeSettingsApplyPromise ?? Promise.resolve();
  const task = previousTask.catch(() => void 0).then(async () => {
    const current = lastAppliedSettings ?? settings;
    await restartManagedRuntimeForMcpConfigChange(current);
  }).catch((error) => {
    logWarn("mcp-config", "Failed to apply Legalwork MCP config change in background", {
      message: error instanceof Error ? error.message : String(error)
    });
  }).finally(() => {
    if (runtimeSettingsApplyPromise === task) {
      runtimeSettingsApplyPromise = null;
    }
  });
  runtimeSettingsApplyPromise = task;
}
async function waitForQueuedRuntimeSettingsApply() {
  if (!runtimeSettingsApplyPromise) return;
  await runtimeSettingsApplyPromise;
}
function runtimeFingerprint(settings) {
  return stableSettingsStringify(resolveLegalworkRuntimeSettings(settings));
}
async function ensureRuntime(settings) {
  const fingerprint = runtimeFingerprint(settings);
  const pending = runtimeEnsurePromise;
  if (pending) {
    try {
      await pending;
    } catch {
    }
    if (runtimeEnsureFingerprint === fingerprint) return;
  }
  const task = ensureRuntimeOnce(settings);
  runtimeEnsurePromise = task.finally(() => {
    if (runtimeEnsurePromise === task) {
      runtimeEnsurePromise = null;
      runtimeEnsureFingerprint = null;
    }
  });
  runtimeEnsureFingerprint = fingerprint;
  try {
    return await task;
  } finally {
  }
}
async function ensureRuntimeOnce(settings) {
  await waitForQueuedRuntimeSettingsApply();
  await ensureLegalworkRuntime(settings);
}
async function ensureLegalworkRuntime(settings) {
  const runtime = getLegalworkRuntimeSettings(settings);
  const hasApiKey = Boolean(resolveConfiguredApiKey(settings));
  const healthy = await waitForLegalworkHealth(settings, 2e3);
  if (healthy) {
    const threadApi2 = await probeThreadApi(settings);
    if (threadApi2.ok) return;
    throw runtimeJsonError(threadApi2.error, threadApi2.message);
  }
  if (!hasApiKey) {
    throw runtimeJsonError(
      "missing_api_key",
      "DeepSeek API Key is required before the GUI can start Legalwork."
    );
  }
  if (!runtime.autoStart) {
    throw runtimeJsonError(
      "runtime_offline",
      "Legalwork is offline. Enable automatic startup in Settings, or start `legalwork serve` manually."
    );
  }
  const adapter = legalworkRuntimeAdapter;
  const reclaim = await adapter.reclaimPort(runtime.port);
  if (!reclaim.ok) {
    throw runtimeJsonError("runtime_port_conflict", reclaim.message);
  }
  try {
    await adapter.ensureRunning(settings);
  } catch (e) {
    console.error("[legalwork] failed to start legalwork:", e);
    throw e;
  }
  const started = await waitForLegalworkHealth(settings, 2e4);
  if (!started) {
    throw runtimeJsonError(
      "runtime_unhealthy",
      "Legalwork did not become healthy after launch."
    );
  }
  const threadApi = await probeThreadApi(settings);
  if (!threadApi.ok) {
    throw runtimeJsonError(threadApi.error, threadApi.message);
  }
}
function createWindow(options = {}) {
  traceStartup("createWindow:start");
  const preloadPath = resolvePreloadPath();
  const usesDesktopTitleBar = process.platform === "win32" || process.platform === "linux";
  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    icon: appIcon.isEmpty() ? void 0 : appIcon,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : usesDesktopTitleBar ? "hidden" : "default",
    trafficLightPosition: process.platform === "darwin" ? { x: 31, y: 22 } : void 0,
    autoHideMenuBar: usesDesktopTitleBar,
    show: false,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      sandbox: true,
      webviewTag: true
    }
  });
  if (usesDesktopTitleBar) {
    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(false);
  }
  mainWindow.webContents.on("preload-error", (_event, preloadPath2, error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[legalwork] failed to load preload ${preloadPath2}:`, error);
    logError("preload", "Failed to load preload script", { preloadPath: preloadPath2, message });
  });
  const showWindow = () => {
    if (options.suppressInitialShow) return;
    if (!mainWindow || mainWindow.isDestroyed() || mainWindow.isVisible()) return;
    mainWindow.show();
  };
  mainWindow.on("close", (event) => {
    if (isQuitting || !appBehavior.closeToTray) return;
    event.preventDefault();
    mainWindow?.hide();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  const devUrl = devServerHintUrl();
  traceStartup("createWindow:load", { devUrl: devUrl ?? "file" });
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(node_path.join(__dirname$1, "../renderer/index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    traceStartup("window:ready-to-show");
    showWindow();
  });
  mainWindow.webContents.once("did-finish-load", () => {
    traceStartup("window:did-finish-load");
    showWindow();
  });
  setTimeout(() => {
    traceStartup("window:fallback-show-timeout");
    showWindow();
  }, 1500);
}
function legalworkRuntimeConfigChanged(prev, next) {
  const a = resolveLegalworkRuntimeSettings(prev);
  const b = resolveLegalworkRuntimeSettings(next);
  const keys = /* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (!stableSettingsValueEqual(a[key], b[key])) return true;
  }
  return false;
}
function stableSettingsValueEqual(a, b) {
  if (a === b) return true;
  return stableSettingsStringify(a) === stableSettingsStringify(b);
}
function stableSettingsStringify(value) {
  return JSON.stringify(canonicalSettingsValue(value));
}
function canonicalSettingsValue(value) {
  if (Array.isArray(value)) return value.map(canonicalSettingsValue);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const key of Object.keys(value).sort()) {
    out[key] = canonicalSettingsValue(value[key]);
  }
  return out;
}
function runtimeStartupConfigChanged(prev, next) {
  return legalworkRuntimeConfigChanged(prev, next) || clawScheduleMcpSettingsChanged(prev, next);
}
async function restartManagedRuntimeForSettingsChange(prev, next) {
  if (!runtimeStartupConfigChanged(prev, next)) return;
  const runtime = resolveLegalworkRuntimeSettings(next);
  const adapter = legalworkRuntimeAdapter;
  const wasRunning = adapter.isChildRunning();
  if (!wasRunning) return;
  if (wasRunning) {
    await adapter.stopAndWait();
  }
  if (!resolveConfiguredApiKey(next) || !runtime.autoStart) return;
  try {
    await adapter.ensureRunning(next);
    const healthy = await waitForLegalworkHealth(next, 2e4);
    if (!healthy) {
      console.warn("[legalwork] Legalwork restart did not become healthy after settings change");
    }
  } catch (e) {
    console.warn("[legalwork] Legalwork restart failed after settings change:", e);
  }
}
async function restartManagedRuntimeForMcpConfigChange(settings) {
  const runtime = resolveLegalworkRuntimeSettings(settings);
  const adapter = legalworkRuntimeAdapter;
  const wasRunning = adapter.isChildRunning();
  if (!wasRunning) return;
  await adapter.stopAndWait();
  if (!resolveConfiguredApiKey(settings) || !runtime.autoStart) return;
  try {
    await adapter.ensureRunning(settings);
    const healthy = await waitForLegalworkHealth(settings, 2e4);
    if (!healthy) {
      console.warn("[legalwork] Legalwork restart did not become healthy after MCP config change");
    }
  } catch (e) {
    console.warn("[legalwork] Legalwork restart failed after MCP config change:", e);
  }
}
async function runtimeRequest(settings, pathAndQuery, init) {
  try {
    return await runtimeRequestViaHost(settings, pathAndQuery, init, ensureRuntime);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logError("runtime-request", `HTTP request to ${pathAndQuery} failed`, { message });
    const parsed = parseRuntimeErrorBody(message, message);
    if (parsed.code !== "unknown" || parsed.message !== message) {
      return runtimeFailure(parsed.code, parsed.message, 0, parsed.details);
    }
    return runtimeFailure("fetch_failed", message);
  }
}
if (runningClawScheduleMcpServer) {
  void clawScheduleMcpServer.runClawScheduleMcpServerFromArgv(process.argv).catch((error) => {
    console.error("[claw-schedule-mcp] server failed:", error);
    process.exit(1);
  });
} else {
  electron.app.whenReady().then(async () => {
    traceStartup("app.whenReady:start");
    if (!gotSingleInstanceLock) return;
    traceStartup("install webview guards:start");
    installDevPreviewWebviewGuards();
    traceStartup("install webview guards:done");
    if (process.platform === "darwin" && electron.app.dock && !appIcon.isEmpty()) {
      electron.app.dock.setIcon(appIcon);
    }
    store = new JsonSettingsStore(electron.app.getPath("userData"));
    traceStartup("settings load:start");
    const initial = await store.load();
    traceStartup("settings load:done");
    appBehavior = initial.appBehavior;
    syncLoginItemSettings(initial);
    syncTray(initial);
    await syncClawScheduleMcpConfig(initial, getClawScheduleMcpLaunchConfig()).catch((error) => {
      console.error("[claw-schedule-mcp] failed to sync config on startup:", error);
    });
    logDir = resolveLogDirectory();
    configureLogger({
      dir: logDir,
      enabled: initial.log.enabled,
      retentionDays: initial.log.retentionDays
    });
    traceStartup("logger configured");
    scheduleRuntime = createScheduleRuntime({ store, runtimeRequest, logError, powerSaveBlocker: electron.powerSaveBlocker });
    scheduleRuntime.sync(initial);
    clawRuntime = createClawRuntime({
      store,
      runtimeRequest,
      logError,
      notifyChannelActivity: emitClawChannelActivity,
      sendWeixinBridgeMessage,
      createScheduledTaskFromText: (text, options) => scheduleRuntime?.createScheduledTaskFromText(text, options) ?? Promise.resolve({ kind: "noop" })
    });
    clawRuntime.sync(initial);
    configureWeixinBridgeRuntimeContextProvider(async () => {
      const settings = await store.load();
      const channel = settings.claw.channels.find((item) => item.enabled && item.provider === "weixin");
      return {
        webhookUrl: webhookUrl(settings),
        webhookSecret: settings.claw.im.secret,
        channelId: channel?.id ?? ""
      };
    });
    configureManagedWeixinBridgeUrlResolver(ensureWeixinBridgeRpcUrl);
    syncWeixinBridgeRuntime(initial);
    traceStartup("ipc registration:start");
    const applySettingsPatch = async (partial) => {
      const prev = await store.load();
      const { agents: agentsPatch, provider: providerPatch, ...restPatch } = partial;
      const mergedProvider = mergeModelProviderSettings(prev.provider, providerPatch);
      const agentsPatchWithKey = computeLegalworkRuntimeCredentialPatch(prev, {
        agents: agentsPatch,
        provider: providerPatch
      });
      const next = normalizeAppSettings({
        ...applyLegalworkRuntimePatch(prev, agentsPatchWithKey.legalwork),
        ...restPatch,
        provider: mergedProvider,
        log: { ...prev.log, ...partial.log ?? {} },
        notifications: { ...prev.notifications, ...partial.notifications ?? {} },
        appBehavior: normalizeAppBehaviorSettings({
          ...prev.appBehavior,
          ...partial.appBehavior ?? {}
        }),
        keyboardShortcuts: normalizeKeyboardShortcuts({
          bindings: {
            ...prev.keyboardShortcuts.bindings,
            ...partial.keyboardShortcuts?.bindings ?? {}
          }
        }),
        write: mergeWriteSettings(prev.write, partial.write),
        claw: mergeClawSettings(prev.claw, partial.claw),
        schedule: mergeScheduleSettings(prev.schedule, partial.schedule),
        guiUpdate: { ...prev.guiUpdate, ...partial.guiUpdate ?? {} }
      });
      if (prev.log.enabled !== next.log.enabled || prev.log.retentionDays !== next.log.retentionDays) {
        configureLogger({ enabled: next.log.enabled, retentionDays: next.log.retentionDays });
      }
      const patchToSave = {
        ...partial,
        agents: agentsPatchWithKey
      };
      const saved = await store.patch(patchToSave);
      await syncClawScheduleMcpConfig(saved, getClawScheduleMcpLaunchConfig()).catch((error) => {
        console.error("[claw-schedule-mcp] failed to sync config after settings change:", error);
      });
      if (prev.guiUpdate.channel !== saved.guiUpdate.channel && guiUpdaterModulePromise) {
        void guiUpdaterModulePromise.then((module2) => module2.setGuiUpdateChannel(saved.guiUpdate.channel));
      }
      queueRuntimeSettingsApply(prev, saved);
      scheduleRuntime?.sync(saved);
      clawRuntime?.sync(saved);
      syncWeixinBridgeRuntime(saved);
      syncLoginItemSettings(saved);
      syncTray(saved);
      return saved;
    };
    const fetchModels = async () => {
      const settings = await store.load();
      const key = resolveConfiguredApiKey(settings);
      return fetchUpstreamModelIds(settings, key);
    };
    registerAppIpcHandlers({
      store,
      getMainWindow: () => mainWindow,
      applySettingsPatch,
      runtimeRequest: async (path, method, body) => {
        const settings = await store.load();
        return runtimeRequest(settings, path, { method, body });
      },
      reconnectRuntime: async () => {
        const settings = await store.load();
        await ensureRuntime(settings);
        return settings;
      },
      fetchUpstreamModels: fetchModels,
      getClawRuntime: () => clawRuntime,
      getScheduleRuntime: () => scheduleRuntime,
      startFeishuInstallQrcode,
      pollFeishuInstall,
      startWeixinInstallQrcode,
      pollWeixinInstall,
      resolveLegalworkConfigPath: resolveLegalworkMcpJsonPath,
      onLegalworkMcpConfigWritten: async () => {
        const settings = await store.load();
        queueRuntimeMcpConfigApply(settings);
      },
      showTurnCompleteNotification,
      getAppVersion: () => electron.app.getVersion(),
      readGuiUpdateState,
      loadGuiUpdaterModule,
      resolveLogDirectory,
      logError
    });
    void loadGuiUpdaterModule().catch((error) => {
      console.warn("[legalwork updater] failed to initialize on startup:", error);
    });
    registerRuntimeSseIpc({ ipcMain: electron.ipcMain, store, ensureRuntime, logError });
    traceStartup("ipc registration:done");
    createWindow({ suppressInitialShow: shouldStartHidden(initial) });
    traceStartup("createWindow:returned");
    if (resolveConfiguredApiKey(initial) && getLegalworkRuntimeSettings(initial).autoStart) {
      setTimeout(() => {
        void ensureRuntime(initial).catch((err) => {
          console.warn("[legalwork] startup runtime warmup failed:", err);
        });
      }, 250);
    }
    void pruneOnStartup().catch((err) => {
      console.warn("[legalwork] prune logs:", err);
    });
    if (resolveConfiguredApiKey(initial)) {
      setTimeout(() => {
        void legalworkRuntimeAdapter.resolveExecutable(initial).catch((err) => {
          console.warn("[legalwork] prewarm Legalwork binary:", err);
        });
      }, 1500);
    }
    electron.app.on("second-instance", () => {
      revealMainWindow();
    });
    electron.app.on("activate", () => {
      if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
      else revealMainWindow();
    });
  }).catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[legalwork] startup failed:", error);
    electron.dialog.showErrorBox(`${APP_PRODUCT_NAME} failed to start`, message);
    electron.app.quit();
  });
}
electron.app.on("window-all-closed", () => {
  void stopManagedRuntimes().catch((error) => {
    console.warn("[legalwork] failed to stop Legalwork runtime:", error);
  });
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("before-quit", (event) => {
  isQuitting = true;
  if (managedRuntimesStoppedForQuit) return;
  event.preventDefault();
  const forceQuitTimer = setTimeout(() => {
    if (!managedRuntimesStoppedForQuit) {
      managedRuntimesStoppedForQuit = true;
      electron.app.quit();
    }
  }, 1500);
  void stopManagedRuntimesForQuit().catch(() => {
  }).finally(() => {
    clearTimeout(forceQuitTimer);
    if (!managedRuntimesStoppedForQuit) {
      managedRuntimesStoppedForQuit = true;
      electron.app.quit();
    }
  });
});
exports.DEFAULT_GUI_UPDATE_CHANNEL = DEFAULT_GUI_UPDATE_CHANNEL;
exports.normalizeGuiUpdateChannel = normalizeGuiUpdateChannel;
