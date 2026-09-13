/**
 * Startup self-check and in-place repair for the bundled Office Python runtime.
 *
 * Windows overwrite-installs cannot replace `python.exe` while it is still
 * running, so an upgrade over a live LegalWork leaves the runtime half-old and
 * half-new. `skill_runner.py` then reports "Bundled Office Python is incomplete
 * or incompatible … Reinstall LegalWork" — and reinstalling is the very
 * overwrite-install that produced the state, so the user is stuck in a loop.
 *
 * electron-builder's NSIS process check closes processes whose executable lives
 * under the install directory before replacing files, which stops new machines
 * entering that state. It cannot help a machine that is already broken, so this
 * module import-checks the bundled runtime at startup and, when only packages are
 * missing, reinstalls them in place (mirror-first, via python-install-sources)
 * instead of sending the user back to the installer.
 *
 * A stale interpreter cannot be repaired from here — the correct python.exe
 * simply is not on disk — so that case is reported with instructions that
 * actually work (quit fully, then install) rather than the old dead-end advice.
 */

import { execFile } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, posix as posixPath, win32 as win32Path } from 'node:path'
import {
  describePipIndexes,
  pipIndexArgs,
  resolvePipIndexCandidates,
  runPipInstallWithFallback,
  selectReachablePipIndexes,
  type PipIndexCandidate
} from '../../legalwork/src/shared/python-install-sources.js'

export type OfficeRuntimeStatus =
  /** Runtime is present and every required module imports. */
  | 'ok'
  /** No bundled runtime on this build (development, or unsupported platform). */
  | 'absent'
  /** python.exe will not run, or is not the version the packages were built for. */
  | 'interpreter-broken'
  /** Interpreter is fine; some site-packages are missing or truncated. */
  | 'packages-missing'

export interface OfficeRuntimeReport {
  status: OfficeRuntimeStatus
  python?: string
  runtimeRoot?: string
  expectedImports: string[]
  missingImports: string[]
  detail?: string
}

export interface OfficeRuntimeRepairResult {
  attempted: boolean
  repaired: boolean
  detail: string
  before: OfficeRuntimeReport
  after?: OfficeRuntimeReport
}

const PROBE_TIMEOUT_MS = 30_000
const PIP_TIMEOUT_MS = 900_000

/** Imports every packaged runtime is expected to satisfy. */
const FALLBACK_IMPORTS = ['docx', 'openpyxl', 'pptx', 'lxml', 'PIL', 'reportlab']

const PROBE_SCRIPT = [
  'import json,sys',
  'missing=[]',
  'for n in sys.argv[1:]:',
  '    try: __import__(n)',
  '    except Exception: missing.append(n)',
  'print(json.dumps({"version":"%d.%d"%(sys.version_info[0],sys.version_info[1]),"missing":missing}))'
].join('\n')

interface RunResult {
  code: number | null
  stdout: string
  stderr: string
}

function run(
  command: string,
  args: string[],
  options: { env?: NodeJS.ProcessEnv; cwd?: string; timeout: number }
): Promise<RunResult> {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      { env: options.env, cwd: options.cwd, timeout: options.timeout, windowsHide: true, maxBuffer: 8 * 1024 * 1024 },
      (error, stdout, stderr) => {
        const code = error && typeof (error as { code?: unknown }).code === 'number'
          ? ((error as { code: number }).code)
          : error
            ? 1
            : 0
        resolve({ code, stdout: String(stdout || ''), stderr: String(stderr || '') })
      }
    )
  })
}

/**
 * python-build-standalone hard-codes sys.prefix at build time, so the packaged
 * tree only resolves its own stdlib/site-packages when PYTHONHOME re-anchors
 * it. This mirrors `bundled_office_python_env` in skill_runner.py — the two
 * must agree or the self-check would disagree with the thing it is checking.
 */
export function bundledOfficePythonEnv(
  python: string,
  platform: NodeJS.Platform = process.platform
): NodeJS.ProcessEnv {
  return {
    ...process.env,
    PYTHONHOME: officeRuntimePythonHome(python, platform),
    // The bundled interpreter lives inside the signed macOS app bundle.
    // Refreshing __pycache__ there mutates sealed resources after first launch.
    PYTHONDONTWRITEBYTECODE: '1'
  }
}

/**
 * Windows keeps python.exe at `python/python.exe` while Unix uses
 * `python/bin/python3`, so the number of levels to walk up differs. The
 * separator must be resolved per target platform too: node's default `dirname`
 * is POSIX off Windows and would return "." for a backslash path.
 */
function dirnameFor(path: string, platform: NodeJS.Platform): string {
  return platform === 'win32' ? win32Path.dirname(path) : posixPath.dirname(path)
}

function officeRuntimePythonHome(python: string, platform: NodeJS.Platform): string {
  return platform === 'win32' ? dirnameFor(python, platform) : dirnameFor(dirnameFor(python, platform), platform)
}

/** Runtime root (the directory holding runtime.json) for a bundled interpreter. */
export function officeRuntimeRoot(python: string, platform: NodeJS.Platform): string {
  const home = officeRuntimePythonHome(python, platform)
  return dirnameFor(home, platform)
}

function readRuntimeManifest(runtimeRoot: string): { imports: string[]; pythonLine?: string } {
  try {
    const manifest = JSON.parse(readFileSync(join(runtimeRoot, 'runtime.json'), 'utf8')) as {
      imports?: unknown
      pythonLine?: unknown
    }
    const imports = Array.isArray(manifest.imports)
      ? manifest.imports.filter((name): name is string => typeof name === 'string' && name.length > 0)
      : []
    return {
      imports: imports.length > 0 ? imports : FALLBACK_IMPORTS,
      pythonLine: typeof manifest.pythonLine === 'string' ? manifest.pythonLine : undefined
    }
  } catch {
    return { imports: FALLBACK_IMPORTS }
  }
}

/** Import-check the bundled runtime with one short python invocation. */
export async function inspectOfficeRuntime(input: {
  python?: string
  platform?: NodeJS.Platform
  /** Overrides the manifest's import list. Tests only. */
  imports?: string[]
}): Promise<OfficeRuntimeReport> {
  const python = input.python
  const platform = input.platform ?? process.platform
  if (!python || !existsSync(python)) {
    return { status: 'absent', expectedImports: [], missingImports: [] }
  }

  const runtimeRoot = officeRuntimeRoot(python, platform)
  const manifest = readRuntimeManifest(runtimeRoot)
  const imports = input.imports ?? manifest.imports
  const pythonLine = manifest.pythonLine
  const result = await run(python, ['-c', PROBE_SCRIPT, ...imports], {
    env: bundledOfficePythonEnv(python, platform),
    timeout: PROBE_TIMEOUT_MS
  })

  if (result.code !== 0) {
    return {
      status: 'interpreter-broken',
      python,
      runtimeRoot,
      expectedImports: imports,
      missingImports: imports,
      detail: (result.stderr || result.stdout || '解释器无法启动').trim().slice(0, 600)
    }
  }

  let parsed: { version?: string; missing?: string[] }
  try {
    parsed = JSON.parse(result.stdout.trim().split('\n').pop() || '{}')
  } catch {
    return {
      status: 'interpreter-broken',
      python,
      runtimeRoot,
      expectedImports: imports,
      missingImports: imports,
      detail: `自检输出无法解析: ${result.stdout.trim().slice(0, 300)}`
    }
  }

  const missing = Array.isArray(parsed.missing) ? parsed.missing : []
  // A python.exe left behind by a blocked overwrite-install is typically a
  // different minor version than the site-packages beside it; no amount of
  // pip work fixes that, so it must not be misreported as "packages missing".
  if (pythonLine && parsed.version && parsed.version !== pythonLine) {
    return {
      status: 'interpreter-broken',
      python,
      runtimeRoot,
      expectedImports: imports,
      missingImports: missing,
      detail: `解释器版本 ${parsed.version} 与打包版本 ${pythonLine} 不一致（升级时 python.exe 被占用未能替换）。`
    }
  }

  if (missing.length === 0) {
    return { status: 'ok', python, runtimeRoot, expectedImports: imports, missingImports: [] }
  }

  return {
    status: 'packages-missing',
    python,
    runtimeRoot,
    expectedImports: imports,
    missingImports: missing,
    detail: `缺少模块: ${missing.join(', ')}`
  }
}

function officeRequirementsPath(resourcesPath: string): string | undefined {
  const candidate = join(resourcesPath, 'skills', 'legal_document_formatting', 'requirements.txt')
  return existsSync(candidate) ? candidate : undefined
}

/**
 * Reinstall the Office packages into the bundled runtime. Only ever called for
 * `packages-missing`: the interpreter itself is known good, so pip writing into
 * its site-packages is enough to make the runtime whole again.
 */
export async function repairOfficeRuntime(input: {
  report: OfficeRuntimeReport
  resourcesPath: string
  platform?: NodeJS.Platform
  log?: (message: string) => void
}): Promise<OfficeRuntimeRepairResult> {
  const { report } = input
  const log = input.log ?? (() => {})
  const platform = input.platform ?? process.platform

  if (report.status !== 'packages-missing' || !report.python) {
    return { attempted: false, repaired: false, detail: '无需修复或无法就地修复。', before: report }
  }

  const requirements = officeRequirementsPath(input.resourcesPath)
  if (!requirements) {
    return {
      attempted: false,
      repaired: false,
      detail: '找不到打包的 Office 依赖清单，无法就地修复。',
      before: report
    }
  }

  const candidates = await selectReachablePipIndexes(resolvePipIndexCandidates())
  log(`[office-runtime] repairing ${report.missingImports.join(', ')} via ${describePipIndexes(candidates)}`)

  const attemptInstall = async (candidate: PipIndexCandidate): Promise<RunResult> =>
    run(
      report.python as string,
      [
        '-m', 'pip', 'install',
        '--disable-pip-version-check', '--no-input',
        '-r', requirements,
        ...pipIndexArgs(candidate)
      ],
      {
        env: bundledOfficePythonEnv(report.python as string, platform),
        cwd: input.resourcesPath,
        timeout: PIP_TIMEOUT_MS
      }
    )

  const outcome = await runPipInstallWithFallback({
    candidates,
    attempt: attemptInstall,
    succeeded: (result) => result.code === 0,
    onSwitch: (next) => log(`[office-runtime] switching to ${next.label}`)
  })

  if (!outcome.succeededWith) {
    return {
      attempted: true,
      repaired: false,
      detail:
        `就地修复失败：已依次尝试 ${describePipIndexes(outcome.attempted)}。` +
        (outcome.result?.stderr || '').trim().slice(0, 400),
      before: report
    }
  }

  const after = await inspectOfficeRuntime({ python: report.python, platform })
  return {
    attempted: true,
    repaired: after.status === 'ok',
    detail:
      after.status === 'ok'
        ? `已从 ${outcome.succeededWith.label} 就地修复 Office 运行时。`
        : `修复后仍不完整：${after.detail ?? after.status}`,
    before: report,
    after
  }
}

/**
 * Startup entry point: check, and repair in place when that can work. Never
 * throws and never blocks startup — the worst case is the same error the user
 * would have seen anyway, but now with advice that is not a loop.
 */
export async function ensureOfficeRuntimeHealthy(input: {
  python?: string
  resourcesPath: string
  platform?: NodeJS.Platform
  log?: (message: string) => void
}): Promise<OfficeRuntimeRepairResult | OfficeRuntimeReport> {
  const log = input.log ?? (() => {})
  const report = await inspectOfficeRuntime({ python: input.python, platform: input.platform })

  if (report.status === 'ok' || report.status === 'absent') return report

  if (report.status === 'interpreter-broken') {
    log(
      `[office-runtime] interpreter unusable (${report.detail ?? 'unknown'}). ` +
      '就地修复无法处理解释器本身，请完全退出 LegalWork（含托盘图标）后重新安装；' +
      '新版安装器会在安装前强制结束进程树，不会再卡在同一个循环里。'
    )
    return report
  }

  const result = await repairOfficeRuntime({
    report,
    resourcesPath: input.resourcesPath,
    platform: input.platform,
    log
  })
  log(`[office-runtime] ${result.detail}`)
  return result
}
