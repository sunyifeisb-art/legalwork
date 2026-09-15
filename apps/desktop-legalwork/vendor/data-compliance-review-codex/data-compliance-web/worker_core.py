#!/usr/bin/env python3
from __future__ import annotations

"""
数据合规/脱敏核心工作流（无 Flask）。
供 compliance_worker.py CLI 与 app.py Flask 服务共享。
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import traceback
from datetime import datetime
from pathlib import Path
from threading import Thread

from desensitize_engine import (
    Desensitizer,
    IMAGE_EXTENSIONS,
    JSON_EXTENSIONS,
    PRESENTATION_EXTENSIONS,
    TABLE_EXTENSIONS,
    TEXT_EXTENSIONS,
    build_report,
    build_subject_mapping_json,
    process_desensitization,
    render_report_markdown,
    render_subject_mapping_markdown,
    sanitize_text_and_subjects,
    write_retention_note,
)

try:
    from scripts.preprocess_input import read_text as read_input_text
except ModuleNotFoundError:  # pragma: no cover - package import path
    from web.scripts.preprocess_input import read_text as read_input_text

# 可配置路径（由调用方设置）
BASE_DIR = Path(__file__).parent
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
PROJECT_ROOT = WORKSPACE_ROOT / 'projects' / 'data-compliance-ai-project-kit'
UPLOAD_FOLDER = BASE_DIR / 'uploads'
OUTPUT_FOLDER = BASE_DIR / 'output'
SCRIPTS_DIR = BASE_DIR / 'scripts'
LOCAL_REGULATION_DB = PROJECT_ROOT / 'knowledge-base' / 'local-regulations.sqlite3'

REVIEW_IMAGE_EXTENSIONS = {ext.lstrip('.') for ext in IMAGE_EXTENSIONS}
ALLOWED_EXTENSIONS = {'txt', 'md', 'markdown', 'doc', 'docx', 'pdf', 'csv', 'tsv', 'xlsx', 'xls', 'ods', 'pptx', 'json', 'jsonl', 'ndjson'} | REVIEW_IMAGE_EXTENSIONS
DESENSITIZE_EXTENSIONS = {'doc', 'docx', 'pdf'} | {
    ext.lstrip('.')
    for ext in (TEXT_EXTENSIONS | TABLE_EXTENSIONS | JSON_EXTENSIONS | IMAGE_EXTENSIONS | PRESENTATION_EXTENSIONS)
}
CODE_EXTENSIONS = {
    'py', 'js', 'jsx', 'ts', 'tsx', 'java', 'go', 'php', 'rb', 'swift', 'kt',
    'kts', 'c', 'cc', 'cpp', 'h', 'hpp', 'cs', 'rs', 'sh', 'bash', 'zsh',
    'sql', 'html', 'css', 'json', 'yaml', 'yml', 'toml', 'env'
}
PYTHON_BIN = os.environ.get('COMPLIANCEAI_PYTHON') or sys.executable or 'python3'

# 内存任务缓存（worker 进程内使用；Flask 也用它做 SSE 进度推送）
tasks: dict[str, dict] = {}


def set_worker_paths(
    *,
    base_dir: Path | None = None,
    upload_folder: Path | None = None,
    output_folder: Path | None = None,
    scripts_dir: Path | None = None,
    project_root: Path | None = None,
    local_regulation_db: Path | None = None,
) -> None:
    """允许 CLI/Flask 在启动前配置工作目录。"""
    global BASE_DIR, UPLOAD_FOLDER, OUTPUT_FOLDER, SCRIPTS_DIR, PROJECT_ROOT, LOCAL_REGULATION_DB
    if base_dir:
        BASE_DIR = base_dir
    if upload_folder:
        UPLOAD_FOLDER = upload_folder
    if output_folder:
        OUTPUT_FOLDER = output_folder
    if scripts_dir:
        SCRIPTS_DIR = scripts_dir
    if project_root:
        PROJECT_ROOT = project_root
    if local_regulation_db:
        LOCAL_REGULATION_DB = local_regulation_db


def ensure_directories() -> None:
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
    OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)


def _task_state_path(task_id: str) -> Path:
    return OUTPUT_FOLDER / task_id / 'task_state.json'


def save_task_state(task_id: str) -> None:
    if task_id not in tasks:
        return
    path = _task_state_path(task_id)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix('.json.tmp')
    tmp.write_text(json.dumps(tasks[task_id], ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)


def load_task_state(task_id: str) -> dict | None:
    path = _task_state_path(task_id)
    if path.exists():
        return json.loads(path.read_text(encoding='utf-8'))
    return None


def ensure_task_loaded(task_id: str) -> bool:
    if task_id in tasks:
        return True
    state = load_task_state(task_id)
    if state is not None:
        tasks[task_id] = state
        return True
    return False


def _safe_batch_stem(name: str, index: int) -> str:
    stem = Path(name or f'file_{index}').stem or f'file_{index}'
    stem = re.sub(r'[\\/:*?"<>|]', '_', stem).strip(' ._')
    return stem or f'file_{index}'


def _load_batch_input_files(task: dict, manifest_path: Path) -> list[dict]:
    files = task.get('input_files')
    if isinstance(files, list) and files:
        return [item for item in files if isinstance(item, dict)]
    if manifest_path.exists():
        payload = json.loads(manifest_path.read_text(encoding='utf-8'))
        manifest_files = payload.get('files')
        if isinstance(manifest_files, list):
            return [item for item in manifest_files if isinstance(item, dict)]
    return []


def _copy_batch_output(output_file: Path, output_dir: Path, stem: str) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    # 若 output_file 已以 stem 开头（如 process_desensitization 产出的
    # {stem}_脱敏.docx），直接用原名，避免 {stem}_{stem}_脱敏.docx 重复前缀。
    # 仅当输出名不含 stem（如 subject_mapping.md 这类固定名）才补前缀，用于区分文档。
    name = output_file.name
    if not name.startswith(stem):
        name = f'{stem}_{name}'
    target = output_dir / name
    counter = 2
    while target.exists():
        target = output_dir / f'{Path(name).stem}_{counter}{Path(name).suffix}'
        counter += 1
    shutil.copy2(output_file, target)
    return target


def allowed_file(filename: str | None) -> bool:
    safe_name = Path(filename or '').name
    return '.' in safe_name and safe_name.rsplit('.', 1)[1].lower() in (ALLOWED_EXTENSIONS | CODE_EXTENSIONS)


def allowed_desensitize_file(filename: str | None) -> bool:
    safe_name = Path(filename or '').name
    return '.' in safe_name and safe_name.rsplit('.', 1)[1].lower() in DESENSITIZE_EXTENSIONS


def safe_upload_filename(filename: str) -> str:
    name = Path(filename or '').name.strip() or 'upload.txt'
    stem = Path(name).stem.strip() or 'upload'
    suffix = Path(name).suffix.lower()
    stem = re.sub(r'[^\w.-]+', '_', stem, flags=re.UNICODE).strip('._') or 'upload'
    return f'{stem}{suffix}'


def safe_download_filename(name: str) -> str:
    stem = re.sub(r'[^\w.-]+', '_', (name or 'ComplianceAI').strip(), flags=re.UNICODE).strip('._')
    return stem or 'ComplianceAI'


def infer_review_type(filename: str, requested: str = '') -> str:
    if requested in {'document', 'code'}:
        return requested
    suffix = Path(filename or '').suffix.lower().lstrip('.')
    return 'code' if suffix in CODE_EXTENSIONS else 'document'


def list_review_history(limit: int = 200) -> list[dict]:
    history = []
    for state_path in OUTPUT_FOLDER.glob('*/task_state.json'):
        try:
            state = json.loads(state_path.read_text(encoding='utf-8'))
        except Exception:
            continue
        history.append({
            'id': state.get('id') or state_path.parent.name,
            'document_name': state.get('document_name') or '未命名任务',
            'status': state.get('status', 'unknown'),
            'product_type': state.get('product_type', 'review'),
            'review_type': state.get('review_type', 'document'),
            'created_at': state.get('created_at', ''),
            'completed_at': state.get('completed_at', ''),
            'message': state.get('progress', {}).get('message', ''),
        })
    history.sort(key=lambda item: item.get('created_at') or item.get('completed_at') or '', reverse=True)
    return history[:limit]


def safe_task_output_dir(task_id: str) -> Path | None:
    if not re.fullmatch(r'[A-Za-z0-9_-]+', task_id or ''):
        return None
    path = (OUTPUT_FOLDER / task_id).resolve()
    output_root = OUTPUT_FOLDER.resolve()
    if path == output_root or output_root not in path.parents:
        return None
    return path


def validate_output_dir(output_dir: str) -> Path | None:
    """校验用户指定的输出目录是否合法。"""
    if not output_dir:
        return None
    path = Path(output_dir).resolve()
    if not path.is_absolute():
        return None
    internal_roots = {
        BASE_DIR.resolve(),
        OUTPUT_FOLDER.resolve(),
        UPLOAD_FOLDER.resolve(),
        Path(tempfile.gettempdir()).resolve(),
    }
    for root in internal_roots:
        if path == root or root in path.parents:
            return None
    if path.exists() and not path.is_dir():
        return None
    parent = path.parent
    if not parent.exists() or not parent.is_dir():
        return None
    return path


def read_text_best_effort(path: Path) -> str:
    try:
        return read_input_text(str(path), '')
    except SystemExit as exc:
        raise RuntimeError(str(exc)) from exc


def line_snippet(lines: list[str], line_no: int, radius: int = 1) -> str:
    start = max(1, line_no - radius)
    end = min(len(lines), line_no + radius)
    return '\n'.join(f'{idx}: {lines[idx - 1]}' for idx in range(start, end + 1))


def code_fix_snippet_for_path(path_id: str) -> str:
    snippets = {
        'code_secret_exposure': '''// Server side only
const analyticsKey = mustGetEnv('ANALYTICS_API_KEY');

app.post('/api/analytics-token', requireLogin, async (req, res) => {
  const token = await issueShortLivedToken({
    userId: req.user.id,
    scope: 'analytics:write',
    ttlSeconds: 600,
  });
  res.json({ token });
});

// Client side
const { token } = await fetch('/api/analytics-token', {
  method: 'POST',
  credentials: 'include',
}).then(r => r.json());''',
        'code_plain_http': '''const endpoint = new URL('/v1/profile', config.apiBaseUrl);

if (endpoint.protocol !== 'https:' && endpoint.hostname !== 'localhost') {
  throw new Error('Personal data endpoints must use HTTPS');
}

await fetch(endpoint, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(minimizedPayload),
});''',
        'code_personal_info_notice': '''const purpose = 'account_verification';
const allowed = await consentStore.hasConsent(userId, purpose);

if (!allowed) {
  return {
    mode: 'basic',
    message: '用户未授权，跳过该个人信息采集',
  };
}

const payload = pickRequiredFields(formData, [
  'phone',
  'identityVerified',
]);''',
        'code_sensitive_logging': '''logger.info('profile_submit', {
  requestId,
  userId: hashId(userId),
  phoneLast4: maskLast4(profile.phone),
  hasIdCard: Boolean(profile.idCard),
});

// Never log raw phone, idCard, token, address, faceTemplate, contacts.''',
        'code_local_retention': '''await secureStore.set('session_ref', sessionRef, {
  ttlSeconds: 3600,
  encrypt: true,
});

async function clearPersonalDataOnLogout(userId) {
  await secureStore.removeMany([
    `profile:${userId}`,
    `contacts:${userId}`,
    `location:${userId}`,
  ]);
}''',
        'code_injection_surface': '''const actionHandlers = {
  openProfile: renderProfile,
  exportReport: exportReportSafely,
};

const handler = actionHandlers[userInput.action];
if (!handler) throw new Error('Unsupported action');

container.textContent = sanitizeDisplayText(userProvidedText);''',
    }
    return snippets.get(path_id, '')


def add_code_item(items: list[dict], *, risk_point: str, risk_level: str, legal_basis: str,
                  reason: str, suggestion: str, evidence: str, line_no: int,
                  path_id: str, rewritten_clause: str = '', fix_snippet: str = '') -> None:
    items.append({
        'risk_point': risk_point,
        'risk_level': risk_level,
        'legal_basis': legal_basis,
        'reason': reason,
        'suggestion': suggestion,
        'rewritten_clause': rewritten_clause,
        'fix_snippet': fix_snippet or code_fix_snippet_for_path(path_id),
        'evidence': [evidence],
        'source_sections': [{
            'page': 1,
            'segment_index': line_no,
            'label': f'代码第 {line_no} 行',
            'snippet': evidence,
        }],
        'path_ids': [path_id],
        'theme_name': '代码合规',
    })


def analyze_code_compliance(code: str, document_name: str) -> dict:
    lines = code.splitlines() or ['']
    items: list[dict] = []
    joined_lower = code.lower()

    secret_patterns = [
        r'(?i)(api[_-]?key|secret|token|password|passwd|access[_-]?key)\s*[:=]\s*[\'"][^\'"]{8,}[\'"]',
        r'-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----',
    ]
    personal_terms = ('phone', 'mobile', '手机号', '身份证', 'idcard', 'location', 'gps', 'lat', 'lng',
                      'address', 'email', '联系人', 'contacts', 'camera', 'microphone', 'face', '人脸')
    consent_terms = ('consent', 'authorize', 'permission', 'privacy', 'opt-in', '同意', '授权', '隐私')

    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            continue
        for pattern in secret_patterns:
            if re.search(pattern, line):
                add_code_item(
                    items,
                    risk_point='疑似硬编码密钥或敏感凭证',
                    risk_level='高风险',
                    legal_basis='《数据安全法》第27条；《网络安全法》第21条',
                    reason='代码中出现疑似 API Key、Token、密码或私钥。此类凭证进入客户端、仓库或日志后，可能导致数据接口被越权调用。',
                    suggestion='将密钥迁移到服务端环境变量或安全密钥管理服务；客户端只调用后端代理接口；立即轮换已暴露凭证，并在 CI 中加入密钥扫描。',
                    rewritten_clause='改为从服务端环境变量读取，并通过后端授权接口下发短期令牌；不要在前端、移动端或公开仓库中保存长期密钥。',
                    evidence=line_snippet(lines, idx),
                    line_no=idx,
                    path_id='code_secret_exposure',
                )
                break

        if 'http://' in line and 'localhost' not in line and '127.0.0.1' not in line:
            add_code_item(
                items,
                risk_point='接口或资源使用明文 HTTP',
                risk_level='中风险',
                legal_basis='《网络安全法》第21条；GB/T 35273 个人信息安全规范',
                reason='明文 HTTP 传输可能暴露个人信息、鉴权参数或业务数据，尤其不适合登录、支付、位置、设备标识等处理链路。',
                suggestion='统一改为 HTTPS；对历史接口做跳转或拒绝；移动端和桌面端增加明文流量拦截策略。',
                rewritten_clause='将 URL 改为 https://，并在网络层拒绝非本地调试场景下的 http:// 请求。',
                evidence=line_snippet(lines, idx),
                line_no=idx,
                path_id='code_plain_http',
            )

        if any(term in stripped.lower() for term in personal_terms):
            window = '\n'.join(lines[max(0, idx - 4): min(len(lines), idx + 4)]).lower()
            if not any(term in window or term in joined_lower[:1000] for term in consent_terms):
                add_code_item(
                    items,
                    risk_point='个人信息采集缺少就近授权或告知痕迹',
                    risk_level='中风险',
                    legal_basis='《个人信息保护法》第6条、第13条、第17条',
                    reason='代码疑似处理手机号、位置、设备、联系人、相机、麦克风、人脸等个人信息，但附近没有看到授权、告知、隐私开关或最小必要校验。',
                    suggestion='在调用采集能力前增加用途说明、授权状态检查和拒绝后的替代路径；仅在业务必要时采集，并记录字段与目的映射。',
                    rewritten_clause='在该调用前加入 consent/permission 检查；未授权时返回基础功能路径，不继续采集或上传该字段。',
                    evidence=line_snippet(lines, idx),
                    line_no=idx,
                    path_id='code_personal_info_notice',
                )

        if re.search(r'(?i)(console\.log|print\(|logger\.|log\.)', line) and any(term in stripped.lower() for term in personal_terms + ('token', 'password', 'secret')):
            add_code_item(
                items,
                risk_point='日志可能输出个人信息或敏感凭证',
                risk_level='高风险',
                legal_basis='《个人信息保护法》第51条；《数据安全法》第27条',
                reason='调试日志中出现个人信息或敏感凭证字段，可能进入本地日志、云日志或第三方监控系统。',
                suggestion='删除敏感字段日志；只保留脱敏后的最后四位、哈希或枚举状态；生产环境默认关闭调试日志。',
                rewritten_clause='使用 maskSensitive(value) 后再输出，或仅记录 request_id、状态码、字段是否存在。',
                evidence=line_snippet(lines, idx),
                line_no=idx,
                path_id='code_sensitive_logging',
            )

        if re.search(r'(?i)(localStorage|UserDefaults|SharedPreferences|NSUserDefaults|sqlite|writeFile|fs\.writeFile)', line) and any(term in stripped.lower() for term in personal_terms + ('token', 'password', 'secret')):
            add_code_item(
                items,
                risk_point='本地持久化可能保存敏感数据',
                risk_level='中风险',
                legal_basis='《个人信息保护法》第51条；GB/T 35273 个人信息安全规范',
                reason='代码疑似把个人信息或令牌写入本地存储。若未加密、未设置过期或未提供删除机制，会扩大泄露面。',
                suggestion='改用系统安全存储或加密数据库；设置最短保存期限；退出登录、撤回授权或账号注销时同步清理。',
                rewritten_clause='敏感字段只存短期会话标识；必要持久化数据使用 Keychain/Keystore 或加密存储，并添加清理函数。',
                evidence=line_snippet(lines, idx),
                line_no=idx,
                path_id='code_local_retention',
            )

        if re.search(r'(?i)(eval\(|exec\(|new Function|innerHTML\s*=|dangerouslySetInnerHTML)', line):
            add_code_item(
                items,
                risk_point='动态执行或不安全渲染可能放大数据泄露风险',
                risk_level='中风险',
                legal_basis='《网络安全法》第21条；《数据安全法》第27条',
                reason='动态执行代码或直接渲染未净化内容，可能造成脚本注入，进而读取页面中的个人信息或会话令牌。',
                suggestion='移除动态执行；对富文本使用可信白名单净化；避免把令牌、身份证号、手机号等敏感数据放在可被脚本读取的上下文。',
                rewritten_clause='改为显式函数映射或安全模板渲染；渲染前使用 sanitizeHtml 白名单处理。',
                evidence=line_snippet(lines, idx),
                line_no=idx,
                path_id='code_injection_surface',
            )

    seen = set()
    deduped = []
    for item in items:
        key = (item['risk_point'], item['source_sections'][0]['segment_index'])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(item)

    stats = {'高风险': 0, '中风险': 0, '建议优化': 0, '无': 0}
    for item in deduped:
        stats[item['risk_level']] = stats.get(item['risk_level'], 0) + 1

    if not deduped:
        deduped.append({
            'risk_point': '未发现明显代码层数据合规风险',
            'risk_level': '无',
            'legal_basis': '代码静态规则审查',
            'reason': '本次静态扫描未命中硬编码凭证、敏感日志、明文传输、个人信息采集缺少告知等规则。',
            'suggestion': '仍建议结合运行时权限申请、接口文档、隐私政策和数据流图进行人工复核。',
            'evidence': ['未命中高风险规则'],
            'source_sections': [],
            'path_ids': ['code_static_scan'],
            'theme_name': '代码合规',
        })
        stats['无'] = 1

    risk_total = sum(v for k, v in stats.items() if k != '无')
    return {
        'document_name': document_name,
        'review_scope': '代码层数据合规风险审查',
        'document_type': 'source_code',
        'selected_review_paths': [
            'code_secret_exposure',
            'code_personal_info_notice',
            'code_sensitive_logging',
            'code_plain_http',
            'code_local_retention',
            'code_injection_surface',
        ],
        'summary': f'共发现 {risk_total} 个代码层风险/优化项，其中高风险 {stats.get("高风险", 0)} 个、中风险 {stats.get("中风险", 0)} 个、建议优化 {stats.get("建议优化", 0)} 个。',
        'auto_recheck_triggered': False,
        'items': deduped,
    }


def render_code_suggestions(report: dict) -> str:
    lines = [
        f'# {report.get("document_name", "代码审查")} 代码层修改建议',
        '',
        f'> {report.get("summary", "")}',
        '',
    ]
    for idx, item in enumerate(report.get('items', []), start=1):
        if item.get('risk_level') == '无':
            continue
        source = item.get('source_sections') or [{}]
        label = source[0].get('label', '代码位置待确认')
        lines.extend([
            f'## {idx}. {item.get("risk_point", "风险项")}',
            '',
            f'- 风险等级：{item.get("risk_level", "")}',
            f'- 位置：{label}',
            f'- 修改建议：{item.get("suggestion", "")}',
        ])
        if item.get('rewritten_clause'):
            lines.append(f'- 建议实现：{item["rewritten_clause"]}')
        if item.get('fix_snippet'):
            lines.extend([
                '',
                '```ts',
                item['fix_snippet'],
                '```',
            ])
        lines.extend(['', ''])
    if len(lines) <= 4:
        lines.append('本次静态扫描未生成必须修改项。')
    return '\n'.join(lines).rstrip() + '\n'


def enrich_code_report_for_display(report: dict) -> dict:
    if report.get('document_type') != 'source_code':
        return report
    for item in report.get('items', []):
        if item.get('fix_snippet'):
            continue
        path_ids = item.get('path_ids') or []
        if path_ids:
            item['fix_snippet'] = code_fix_snippet_for_path(path_ids[0])
    return report


def refresh_code_suggestions_file(task: dict) -> None:
    result = task.get('result') or {}
    report_path = result.get('report')
    suggestions_path = result.get('code_suggestions')
    if not report_path or not suggestions_path:
        return
    report_file = Path(report_path)
    if not report_file.exists():
        return
    report = enrich_code_report_for_display(json.loads(report_file.read_text(encoding='utf-8')))
    Path(suggestions_path).write_text(render_code_suggestions(report), encoding='utf-8')


def get_risk_level_color(level: str) -> str:
    color_map = {
        '高风险': 'red',
        '中风险': 'yellow',
        '建议优化': 'blue',
        '无': 'green'
    }
    return color_map.get(level, 'gray')


def get_risk_level_order(level: str) -> int:
    order_map = {
        '无': 0,
        '建议优化': 1,
        '中风险': 2,
        '高风险': 3
    }
    return order_map.get(level, 0)


def load_json_if_exists(path_str: str | None) -> dict | None:
    if not path_str:
        return None
    path = Path(path_str)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding='utf-8'))


def derive_document_name(raw_name: str, input_text: str, uploaded_filename: str | None) -> str:
    name = (raw_name or '').strip()
    if name:
        return name

    if uploaded_filename:
        return Path(uploaded_filename).stem.strip() or '未命名文档'

    text = (input_text or '').strip()
    if text:
        compact = ' '.join(text.split())
        return (compact[:20] + '...') if len(compact) > 20 else compact

    return '未命名文档'


def complete_review_with_fallback(
    task_id: str,
    task: dict,
    work_dir: Path,
    input_path: Path,
    document_name: str,
    error: Exception,
    total_steps: int,
) -> None:
    """Complete a review task with a deterministic local report instead of failing."""
    work_dir.mkdir(parents=True, exist_ok=True)
    try:
        text = read_text_best_effort(input_path) if input_path.exists() else ''
    except Exception:
        text = ''
    excerpt = ' '.join(text.split())[:1200]
    findings = []
    if re.search(r'1[3-9]\d{9}', text):
        findings.append({
            'risk_point': '材料中包含手机号等个人信息',
            'risk_level': '中风险',
            'legal_basis': '《个人信息保护法》第6条、第17条',
            'reason': '兜底审查发现材料包含疑似个人信息字段，处理前应明确目的、范围、合法性基础和告知同意情况。',
            'suggestion': '补充个人信息处理目的、字段范围、保存期限、共享对象及用户权利响应机制；外发前先执行脱敏。',
            'evidence': ['命中手机号模式'],
            'source_sections': [],
            'path_ids': ['fallback_personal_info'],
            'theme_name': '兜底审查',
        })
    if re.search(r'\d{6}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]', text):
        findings.append({
            'risk_point': '材料中包含身份证号等敏感个人信息',
            'risk_level': '高风险',
            'legal_basis': '《个人信息保护法》第28条、第29条、第51条',
            'reason': '身份证号属于敏感个人信息，泄露或不当处理可能对个人权益造成重大影响。',
            'suggestion': '仅在充分必要且具备单独同意或其他合法基础时处理；存储、传输、共享和展示均应加密或脱敏。',
            'evidence': ['命中身份证号模式'],
            'source_sections': [],
            'path_ids': ['fallback_sensitive_personal_info'],
            'theme_name': '兜底审查',
        })
    if not findings:
        findings.append({
            'risk_point': '已完成兜底审查，未命中内置高频规则',
            'risk_level': '建议优化',
            'legal_basis': '本地兜底规则',
            'reason': '主审查流水线异常，系统已改用本地兜底规则读取材料并生成结果。',
            'suggestion': '建议在环境修复后重新运行完整审查；本次报告可先用于判断是否需要脱敏、补充告知或人工复核。',
            'evidence': [excerpt or '未能提取到可读文本'],
            'source_sections': [],
            'path_ids': ['fallback_review'],
            'theme_name': '兜底审查',
        })

    report = {
        'document_name': document_name,
        'review_scope': '数据合规兜底审查',
        'document_type': 'fallback',
        'selected_review_paths': ['fallback_review'],
        'summary': f'完整审查链路异常，已完成本地兜底审查并生成 {len(findings)} 项结果。',
        'auto_recheck_triggered': False,
        'items': findings,
        'warnings': [
            f'完整审查链路异常：{error}',
            '本报告由本地兜底规则生成，避免任务失败或卡住；环境修复后可重新运行完整审查。',
        ],
    }
    report_path = work_dir / 'fallback_compliance_report.json'
    markdown_path = work_dir / 'fallback_compliance_report.md'
    remediation_path = work_dir / 'fallback_remediation_tasks.json'
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    markdown_lines = [
        f'# {document_name} 数据合规兜底审查报告',
        '',
        report['summary'],
        '',
        '## 风险/建议',
    ]
    for index, item in enumerate(findings, start=1):
        markdown_lines.extend([
            f'### {index}. {item["risk_point"]}',
            f'- 风险等级：{item["risk_level"]}',
            f'- 法规依据：{item["legal_basis"]}',
            f'- 原因：{item["reason"]}',
            f'- 建议：{item["suggestion"]}',
            '',
        ])
    markdown_lines.extend(['## 处理说明', *[f'- {warning}' for warning in report['warnings']], ''])
    markdown_path.write_text('\n'.join(markdown_lines), encoding='utf-8')
    remediation_path.write_text(json.dumps({
        'document_name': document_name,
        'tasks': [
            {
                'title': item['risk_point'],
                'priority': 'P1' if item['risk_level'] == '高风险' else 'P2',
                'objective': item['suggestion'],
            }
            for item in findings
            if item['risk_level'] != '无'
        ],
    }, ensure_ascii=False, indent=2), encoding='utf-8')

    task['status'] = 'completed'
    task['completed_at'] = datetime.now().isoformat()
    task['error_detail'] = traceback.format_exc()
    task['result'] = {
        'report': str(report_path),
        'report_markdown': str(markdown_path),
        'remediation': str(remediation_path),
    }
    task['progress'] = {
        'step': total_steps,
        'total_steps': total_steps,
        'message': '完整审查异常，已生成本地兜底审查结果',
        'status': 'completed',
        'percent': 100,
    }
    save_task_state(task_id)


def complete_desensitize_with_fallback(
    task_id: str,
    task: dict,
    work_dir: Path,
    input_path: Path,
    document_name: str,
    error: Exception,
    output_dir: Path | None = None,
) -> None:
    """Complete a desensitization task with text fallback artifacts instead of failing."""
    work_dir.mkdir(parents=True, exist_ok=True)
    engine = Desensitizer()
    warnings = [
        f'标准脱敏链路异常：{error}',
        '系统已使用本地文本兜底脱敏生成可下载结果；如原文件为图片或扫描件，请在 PaddleOCR 环境修复后重新运行以获得版面级脱敏。',
    ]
    try:
        raw = read_text_best_effort(input_path) if input_path.exists() else ''
    except Exception:
        raw = ''
    if not raw.strip():
        raw = f'无法从 {input_path.name} 提取可读文本。标准脱敏链路异常：{error}'
    redacted, findings, subjects = sanitize_text_and_subjects(
        raw,
        engine,
        surface='fallback_text',
        locator='兜底全文',
    )
    output_file = work_dir / 'desensitized_output_fallback.md'
    output_file.write_text(redacted, encoding='utf-8')
    report = build_report(
        task_id=task_id,
        document_name=document_name,
        input_name=input_path.name,
        input_type='fallback_text',
        output_file=output_file,
        findings=findings,
        subject_mappings=subjects,
        warnings=warnings,
        engine=engine,
    )
    report_json = work_dir / 'desensitization_report.json'
    report_md = work_dir / 'desensitization_report.md'
    note = work_dir / 'original_retention_note.txt'
    subject_mapping_md = work_dir / 'subject_mapping.md'
    subject_mapping_json = work_dir / 'subject_mapping.json'
    report_json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    report_md.write_text(render_report_markdown(report), encoding='utf-8')
    write_retention_note(note)
    subject_mapping_md.write_text(render_subject_mapping_markdown(task_id, document_name, subjects), encoding='utf-8')
    subject_mapping_json.write_text(
        json.dumps(build_subject_mapping_json(task_id, document_name, subjects), ensure_ascii=False, indent=2),
        encoding='utf-8',
    )
    if output_dir:
        _copy_batch_output(output_file, output_dir, document_name or input_path.stem or task_id)
        _copy_batch_output(subject_mapping_md, output_dir, document_name or input_path.stem or task_id)

    task['status'] = 'completed'
    task['completed_at'] = datetime.now().isoformat()
    task['error_detail'] = traceback.format_exc()
    task['result'] = {
        'desensitized_output': str(output_file),
        'desensitization_report': str(report_json),
        'desensitization_report_md': str(report_md),
        'retention_note': str(note),
        'subject_mapping_md': str(subject_mapping_md),
        'subject_mapping_json': str(subject_mapping_json),
    }
    if output_dir:
        task['result']['output_dir'] = str(output_dir)
    task['progress'] = {
        'step': 4,
        'total_steps': 4,
        'message': f'标准脱敏异常，已生成兜底脱敏结果：命中 {report.get("summary", {}).get("total_findings", 0)} 处敏感信息',
        'status': 'completed',
        'percent': 100,
    }
    save_task_state(task_id)


def run_review_pipeline(task_id: str, input_path: Path, document_name: str, is_text: bool = False) -> None:
    """运行审查流水线，并通过 task_state.json 更新进度。"""
    task = tasks.setdefault(task_id, {
        'id': task_id,
        'document_name': document_name,
        'status': 'pending',
        'created_at': datetime.now().isoformat(),
    })
    work_dir = OUTPUT_FOLDER / task_id
    work_dir.mkdir(parents=True, exist_ok=True)

    checkpoints = [
        ('preprocess', '预处理输入'),
        ('classify', '识别文档类型'),
        ('plan_paths', '规划审查路径'),
        ('generate_tasks', '生成审查任务'),
        ('review', '执行规则化审查', [
            'disclosure_check',
            'purpose_scope_check',
            'lawful_basis_check',
            'sensitive_personal_info_check',
            'field_purpose_legal_basis_check',
            'consent_feature_coupling_check',
            'third_party_sharing_check',
            'outbound_transfer_check',
            'retention_deletion_check',
            'consistency_check'
        ]),
        ('aggregate', '汇总审查结果'),
        ('enrich', '应用法规映射与法规库增强'),
        ('recheck', '自动复核'),
        ('cluster', '风险聚类分析'),
        ('build_packs', '生成专项审查包'),
        ('remediation', '生成整改任务'),
    ]

    def update_progress(step: int, message: str, status: str = 'running', detail: dict | None = None) -> None:
        total_steps = len(checkpoints)
        task['status'] = 'running' if status == 'running' else status
        task['progress'] = {
            'step': step,
            'total_steps': total_steps,
            'message': message,
            'status': status,
            'detail': detail,
            'percent': min(95, max(3, round(step / total_steps * 100))),
        }
        save_task_state(task_id)

    try:
        update_progress(1, '正在预处理输入文件...')
        time.sleep(0.5)

        preprocessed = work_dir / '01_preprocessed.json'
        cmd = [PYTHON_BIN, str(SCRIPTS_DIR / 'preprocess_input.py'), '--output', str(preprocessed)]
        if is_text:
            cmd.extend(['--text', input_path.read_text(encoding='utf-8')])
        else:
            cmd.extend(['--file', str(input_path)])
        subprocess.run(cmd, check=True, capture_output=True)

        update_progress(2, '正在识别文档类型...')
        time.sleep(0.3)

        classification = work_dir / '02_classification.json'
        cmd = [PYTHON_BIN, str(SCRIPTS_DIR / 'classify_document_type.py')]
        if is_text:
            cmd.extend(['--text', input_path.read_text(encoding='utf-8')])
        else:
            cmd.extend(['--file', str(input_path)])
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        classification.write_text(result.stdout, encoding='utf-8')

        update_progress(3, '正在规划审查路径...')
        time.sleep(0.3)

        planned = work_dir / '03_paths.json'
        result = subprocess.run(
            [PYTHON_BIN, str(SCRIPTS_DIR / 'plan_review_paths.py'), '--classification', str(classification)],
            capture_output=True, text=True, check=True
        )
        planned.write_text(result.stdout, encoding='utf-8')

        update_progress(4, '正在生成审查任务...')
        time.sleep(0.3)

        tasks_file = work_dir / '04_tasks.json'
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'generate_review_tasks.py'),
            '--classification', str(classification),
            '--planned-paths', str(planned),
            '--output', str(tasks_file)
        ], check=True, capture_output=True)

        planned_data = json.loads(planned.read_text(encoding='utf-8'))
        selected_paths = planned_data.get('selected_paths', [])

        findings_dir = work_dir / '06_findings'
        findings_dir.mkdir(parents=True, exist_ok=True)

        path_name_map = {
            'disclosure_check': '披露完整性检查',
            'purpose_scope_check': '目的与范围检查',
            'lawful_basis_check': '合法性基础检查',
            'sensitive_personal_info_check': '敏感信息检查',
            'field_purpose_legal_basis_check': '字段-目的-法律基础校验',
            'consent_feature_coupling_check': '同意与功能绑定检查',
            'third_party_sharing_check': '第三方共享检查',
            'outbound_transfer_check': '数据出境检查',
            'retention_deletion_check': '保存与删除检查',
            'consistency_check': '一致性检查'
        }

        for i, path_obj in enumerate(selected_paths):
            path_id = path_obj.get('id') if isinstance(path_obj, dict) else path_obj
            path_name = path_name_map.get(path_id, path_id)
            update_progress(5, f'正在执行审查: {path_name}', detail={
                'current': i + 1,
                'total': len(selected_paths),
                'current_path': path_name
            })

        result = subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'run_rule_based_review.py'),
            '--preprocessed', str(preprocessed),
            '--tasks', str(tasks_file),
            '--out-dir', str(findings_dir)
        ], capture_output=True, text=True, check=True)
        findings_data = json.loads(result.stdout)
        findings_files = findings_data.get('findings', [])

        update_progress(6, '正在汇总审查结果...')
        time.sleep(0.3)

        skeleton = work_dir / '05_report_skeleton.json'
        classification_data = json.loads(classification.read_text(encoding='utf-8'))
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_report_skeleton.py'),
            '--document-name', document_name,
            '--doc-type', classification_data.get('type', 'unknown'),
            '--paths-file', str(planned),
            '--output', str(skeleton)
        ], check=True, capture_output=True)

        final_report = work_dir / '07_report_final.json'
        cmd = [
            PYTHON_BIN, str(SCRIPTS_DIR / 'aggregate_review_findings.py'),
            '--skeleton', str(skeleton),
            '--output', str(final_report)
        ]
        if findings_files:
            cmd.extend(['--findings'] + findings_files)
        else:
            findings_files = [str(f) for f in findings_dir.glob('*.json')]
            if findings_files:
                cmd.extend(['--findings'] + findings_files)
        subprocess.run(cmd, check=True, capture_output=True)

        update_progress(7, '正在应用法规映射与法规库增强...')
        time.sleep(0.3)

        norm_mapping = BASE_DIR / 'config' / 'default-norm-mappings.json'
        mapped_report = work_dir / '07_report_mapped.json'
        enriched_report = work_dir / '07_report_enriched.json'
        report_for_bundle = final_report
        if norm_mapping.exists():
            subprocess.run([
                PYTHON_BIN, str(SCRIPTS_DIR / 'apply_external_norm_mapping.py'),
                '--report', str(final_report),
                '--mapping', str(norm_mapping),
                '--output', str(mapped_report)
            ], check=True, capture_output=True)
            report_for_bundle = mapped_report

        if LOCAL_REGULATION_DB.exists():
            subprocess.run([
                PYTHON_BIN, str(PROJECT_ROOT / 'scripts' / 'enrich_report_with_regulation_db.py'),
                '--report', str(report_for_bundle),
                '--db', str(LOCAL_REGULATION_DB),
                '--output', str(enriched_report)
            ], check=True, capture_output=True)
            report_for_bundle = enriched_report

        update_progress(8, '正在执行自动复核...')
        time.sleep(0.3)

        auto_rechecked_report = work_dir / '07_report_auto_rechecked.json'
        auto_recheck_queue = work_dir / '07_auto_recheck_queue.json'
        risk_clusters = work_dir / '07_risk_clusters.json'
        bundle_dir = work_dir / '08_bundle'
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'auto_recheck_report.py'),
            '--report', str(report_for_bundle),
            '--output', str(auto_rechecked_report),
            '--queue-output', str(auto_recheck_queue),
            '--cluster-output', str(risk_clusters)
        ], check=True, capture_output=True)
        report_for_bundle = auto_rechecked_report

        update_progress(8, '正在生成 AI 优化建议与改写示例，请稍候...')
        llm_enhanced_report = work_dir / '07_report_llm_enhanced.json'
        api_key = os.environ.get('LEGALWORK_API_KEY', '').strip() or os.environ.get('DEEPSEEK_API_KEY', '').strip()
        key_file = BASE_DIR / '.deepseek_key'
        if not api_key and key_file.exists():
            api_key = key_file.read_text(encoding='utf-8').strip()
        llm_result = subprocess.run([
            sys.executable, str(SCRIPTS_DIR / 'enhance_suggestions_with_llm.py'),
            '--report', str(report_for_bundle),
            '--output', str(llm_enhanced_report),
            '--api-key', api_key,
        ], capture_output=True, text=True)
        if llm_result.returncode != 0:
            print(
                f"LLM enhancement skipped (exit {llm_result.returncode}): {llm_result.stderr or llm_result.stdout}",
                file=sys.stderr,
            )
        else:
            report_for_bundle = llm_enhanced_report

        bundle_result = subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'render_report_bundle.py'),
            str(report_for_bundle),
            '--out-dir', str(bundle_dir)
        ], capture_output=True, text=True, check=True)
        bundle = json.loads(bundle_result.stdout)

        update_progress(9, '正在分析风险聚类...')
        time.sleep(0.3)

        update_progress(10, '正在生成专项审查包...')
        time.sleep(0.3)

        application_plan = work_dir / '09_application_plan.json'
        evidence_checklist = work_dir / '10_evidence_checklist.json'
        sdk_partner_pack = work_dir / '11_sdk_partner_review_pack.json'
        cross_border_pack = work_dir / '12_cross_border_review_pack.json'
        privacy_remediation_pack = work_dir / '13_privacy_remediation_pack.json'

        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_application_scenario_plan.py'),
            '--report', str(report_for_bundle),
            '--classification', str(classification),
            '--output', str(application_plan)
        ], check=True, capture_output=True)

        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_evidence_checklist.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--output', str(evidence_checklist)
        ], check=True, capture_output=True)

        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_sdk_partner_review_pack.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--evidence-checklist', str(evidence_checklist),
            '--output', str(sdk_partner_pack)
        ], check=True, capture_output=True)

        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_cross_border_review_pack.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--evidence-checklist', str(evidence_checklist),
            '--output', str(cross_border_pack)
        ], check=True, capture_output=True)

        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_privacy_remediation_pack.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--evidence-checklist', str(evidence_checklist),
            '--output', str(privacy_remediation_pack)
        ], check=True, capture_output=True)

        update_progress(11, '正在生成整改任务清单...')
        time.sleep(0.3)

        remediation_tasks = work_dir / '14_remediation_tasks.json'
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_remediation_task_plan.py'),
            '--report', str(report_for_bundle),
            '--queue', str(auto_recheck_queue),
            '--clusters', str(risk_clusters),
            '--evidence-checklist', str(evidence_checklist),
            '--application-plan', str(application_plan),
            '--output', str(remediation_tasks)
        ], check=True, capture_output=True)

        task['status'] = 'completed'
        task['completed_at'] = datetime.now().isoformat()
        task['result'] = {
            'report': str(report_for_bundle),
            'report_markdown': bundle.get('markdown', ''),
            'remediation': str(remediation_tasks),
            'evidence': str(evidence_checklist),
            'sdk_pack': str(sdk_partner_pack),
            'cross_border_pack': str(cross_border_pack),
            'privacy_pack': str(privacy_remediation_pack)
        }
        task['progress'] = {
            'step': len(checkpoints),
            'total_steps': len(checkpoints),
            'message': '审查完成',
            'status': 'completed',
            'percent': 100,
        }
        save_task_state(task_id)

    except Exception as e:
        error_detail = traceback.format_exc()
        print(f"ERROR in task {task_id}: {error_detail}", file=sys.stderr)
        complete_review_with_fallback(task_id, task, work_dir, input_path, document_name, e, len(checkpoints))


def run_code_review_pipeline(task_id: str, input_path: Path, document_name: str, is_text: bool = False) -> None:
    task = tasks.setdefault(task_id, {
        'id': task_id,
        'document_name': document_name,
        'status': 'pending',
        'created_at': datetime.now().isoformat(),
    })
    work_dir = OUTPUT_FOLDER / task_id
    work_dir.mkdir(parents=True, exist_ok=True)

    def update_progress(step: int, message: str, status: str = 'running') -> None:
        total_steps = 4
        task['status'] = 'running' if status == 'running' else status
        task['progress'] = {
            'step': step,
            'total_steps': total_steps,
            'message': message,
            'status': status,
            'percent': min(95, max(3, round(step / total_steps * 100))),
        }
        save_task_state(task_id)

    try:
        update_progress(1, '正在读取代码输入...')
        code = input_path.read_text(encoding='utf-8') if is_text else read_text_best_effort(input_path)

        update_progress(2, '正在扫描代码层合规风险...')
        report = analyze_code_compliance(code, document_name)

        update_progress(3, '正在生成代码层修改建议...')
        report_path = work_dir / 'code_compliance_report.json'
        suggestions_path = work_dir / 'code_change_suggestions.md'
        remediation_path = work_dir / 'code_remediation_tasks.json'
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
        suggestions_path.write_text(render_code_suggestions(report), encoding='utf-8')
        priority_map = {'高风险': 'P1', '中风险': 'P2', '建议优化': 'P3'}
        remediation_tasks = []
        priority_counts = {'P1': 0, 'P2': 0, 'P3': 0}
        for item in report.get('items', []):
            if item.get('risk_level') == '无':
                continue
            priority = priority_map.get(item.get('risk_level'), 'P3')
            priority_counts[priority] += 1
            remediation_tasks.append({
                'title': item.get('risk_point'),
                'priority': priority,
                'owner_hint': (item.get('source_sections') or [{}])[0].get('label', ''),
                'objective': item.get('suggestion'),
                'implementation_hint': item.get('rewritten_clause', ''),
            })
        remediation_path.write_text(json.dumps({
            'document_name': document_name,
            'priority_counts': priority_counts,
            'tasks': remediation_tasks,
        }, ensure_ascii=False, indent=2), encoding='utf-8')

        task['status'] = 'completed'
        task['completed_at'] = datetime.now().isoformat()
        task['result'] = {
            'report': str(report_path),
            'report_markdown': str(suggestions_path),
            'remediation': str(remediation_path),
            'code_suggestions': str(suggestions_path),
        }
        task['progress'] = {
            'step': 4,
            'total_steps': 4,
            'message': '代码审查完成',
            'status': 'completed',
            'percent': 100,
        }
        save_task_state(task_id)
    except Exception as e:
        error_detail = traceback.format_exc()
        print(f"ERROR in code task {task_id}: {error_detail}", file=sys.stderr)
        complete_review_with_fallback(task_id, task, work_dir, input_path, document_name, e, 4)


def run_desensitize_pipeline(
    task_id: str,
    input_path: Path,
    document_name: str,
    is_text: bool = False,
    output_dir: Path | None = None,
    output_format: str | None = None,
    redaction_mode: str = 'standard',
) -> None:
    task = tasks.setdefault(task_id, {
        'id': task_id,
        'document_name': document_name,
        'status': 'pending',
        'created_at': datetime.now().isoformat(),
    })
    work_dir = OUTPUT_FOLDER / task_id
    work_dir.mkdir(parents=True, exist_ok=True)

    def update_progress(step: int, message: str, status: str = 'running', detail: dict | None = None) -> None:
        total_steps = 4
        task['status'] = 'running' if status == 'running' else status
        task['progress'] = {
            'step': step,
            'total_steps': total_steps,
            'message': message,
            'status': status,
            'detail': detail or {},
            'percent': min(95, max(3, round(step / total_steps * 100))),
        }
        save_task_state(task_id)

    try:
        if task.get('input_type') == 'batch':
            input_files = _load_batch_input_files(task, Path(input_path))
            if not input_files:
                raise ValueError('批量脱敏任务缺少输入文件清单。')

            batch_dir = work_dir / 'batch_outputs'
            batch_dir.mkdir(parents=True, exist_ok=True)
            batch_entries: list[dict] = []
            batch_failures: list[dict] = []
            total_findings = 0
            total_entity_counts: dict[str, int] = {}

            for index, file_info in enumerate(input_files, start=1):
                file_path = Path(str(file_info.get('path') or ''))
                original_name = str(file_info.get('name') or file_path.name or f'file_{index}')
                try:
                    if not file_path.exists():
                        raise FileNotFoundError(f'批量输入文件不存在：{original_name}')

                    stem = _safe_batch_stem(original_name, index)
                    item_dir = batch_dir / f'{index:03d}_{stem}'
                    update_progress(
                        1,
                        f'正在处理第 {index}/{len(input_files)} 份材料：{original_name}',
                        detail={'current': index, 'total': len(input_files), 'file': original_name},
                    )
                    try:
                        result = process_desensitization(
                            task_id=f'{task_id}_{index}',
                            input_path=file_path,
                            document_name=Path(original_name).stem or document_name,
                            work_dir=item_dir,
                            is_text=False,
                            output_dir=None,
                            output_format=output_format,
                            redaction_mode=redaction_mode,
                        )
                    except Exception as enhanced_error:
                        if redaction_mode != 'agent_enhanced':
                            raise
                        result = process_desensitization(
                            task_id=f'{task_id}_{index}',
                            input_path=file_path,
                            document_name=Path(original_name).stem or document_name,
                            work_dir=item_dir,
                            is_text=False,
                            output_dir=None,
                            output_format=output_format,
                            redaction_mode='standard',
                        )
                        fallback_report = result['report']
                        fallback_report.setdefault('warnings', []).append(
                            f'增强模型调用异常，已自动切换本地脱敏并完成输出：{enhanced_error}'
                        )
                        Path(result['report_json']).write_text(
                            json.dumps(fallback_report, ensure_ascii=False, indent=2),
                            encoding='utf-8',
                        )
                        Path(result['report_md']).write_text(
                            render_report_markdown(fallback_report),
                            encoding='utf-8',
                        )
                    report = result['report']
                    summary = report.get('summary', {}) if isinstance(report, dict) else {}
                    file_findings = int(summary.get('total_findings') or 0)
                    total_findings += file_findings
                    entity_counts = summary.get('entity_counts') if isinstance(summary, dict) else {}
                    if isinstance(entity_counts, dict):
                        for key, value in entity_counts.items():
                            total_entity_counts[str(key)] = total_entity_counts.get(str(key), 0) + int(value or 0)

                    output_file = Path(result['output_file'])
                    copied_output = _copy_batch_output(output_file, output_dir, stem) if output_dir else None
                    batch_entries.append({
                        'index': index,
                        'input_name': original_name,
                        'output_file': str(output_file),
                        'saved_output_file': str(copied_output) if copied_output else None,
                        'report_json': str(result['report_json']),
                        'report_md': str(result['report_md']),
                        'subject_mapping_md': str(result['subject_mapping_md']),
                        'summary': summary,
                    })
                except Exception as exc:
                    batch_failures.append({
                        'index': index,
                        'input_name': original_name,
                        'path': str(file_path),
                        'error': str(exc),
                    })

            if redaction_mode == 'agent_enhanced' and not batch_entries and batch_failures:
                raise RuntimeError(str(batch_failures[0].get('error') or '增强脱敏未能完成。'))

            update_progress(3, '正在生成批量脱敏汇总报告...')
            aggregate_report = {
                'task_id': task_id,
                'document_name': document_name,
                'input_name': f'{len(batch_entries)} files',
                'input_type': 'batch',
                'status': 'completed',
                'strategy': 'standardized_legal_document',
                'summary': {
                    'file_count': len(input_files),
                    'completed_file_count': len(batch_entries),
                    'failed_file_count': len(batch_failures),
                    'total_findings': total_findings,
                    'entity_counts': dict(sorted(total_entity_counts.items())),
                },
                'files': batch_entries,
                'failures': batch_failures,
                'warnings': ['批量任务逐文件脱敏，单文件详细报告保存在 batch_outputs 子目录。'],
                'residual_risk': '系统已完成规则识别、全文一致性处理与残留敏感信息自动复检。',
            }
            report_json = work_dir / 'desensitization_report.json'
            report_md = work_dir / 'desensitization_report.md'
            output_index = work_dir / 'batch_desensitized_outputs.md'
            note = work_dir / 'original_retention_note.txt'
            subject_mapping_md = work_dir / 'subject_mapping.md'
            subject_mapping_json = work_dir / 'subject_mapping.json'

            report_json.write_text(json.dumps(aggregate_report, ensure_ascii=False, indent=2), encoding='utf-8')
            report_lines = [
                f'# {document_name or "批量材料"} 脱敏汇总报告',
                '',
                f'- 文件数量：{len(input_files)}',
                f'- 成功处理：{len(batch_entries)}',
                f'- 处理失败：{len(batch_failures)}',
                f'- 命中总数：{total_findings}',
                '',
                '## 文件结果',
            ]
            output_lines = [
                '# 批量脱敏输出索引',
                '',
                f'- 任务编号：{task_id}',
                f'- 文件数量：{len(batch_entries)}',
                '',
                '| 序号 | 输入文件 | 命中数 | 输出文件 |',
                '|------|----------|--------|----------|',
            ]
            for entry in batch_entries:
                findings = entry.get('summary', {}).get('total_findings', 0)
                output_name = Path(str(entry.get('output_file') or '')).name
                report_lines.append(f'- {entry["index"]}. {entry["input_name"]}：命中 {findings} 处，输出 `{output_name}`')
                output_lines.append(f'| {entry["index"]} | {entry["input_name"]} | {findings} | {output_name} |')
            if batch_failures:
                report_lines.extend(['', '## 处理失败文件'])
                for failure in batch_failures:
                    report_lines.append(f'- {failure["index"]}. {failure["input_name"]}：{failure["error"]}')
            report_md.write_text('\n'.join(report_lines).rstrip() + '\n', encoding='utf-8')
            output_index.write_text('\n'.join(output_lines).rstrip() + '\n', encoding='utf-8')
            note.write_text(
                '原始文件仅保存在本地任务目录，用于完成本次批量数据脱敏处理。\n'
                '输出文件已按统一法律文档样式重新生成，并完成残留敏感信息自动复检。\n',
                encoding='utf-8',
            )
            subject_mapping_md.write_text('# 批量主体逆向映射表\n\n请查看 batch_outputs 下各文件的 subject_mapping.md。\n', encoding='utf-8')
            subject_mapping_json.write_text(json.dumps({'task_id': task_id, 'files': batch_entries}, ensure_ascii=False, indent=2), encoding='utf-8')

            task['status'] = 'completed'
            task['completed_at'] = datetime.now().isoformat()
            task['result'] = {
                'desensitized_output': str(output_index),
                'desensitization_report': str(report_json),
                'desensitization_report_md': str(report_md),
                'retention_note': str(note),
                'subject_mapping_md': str(subject_mapping_md),
                'subject_mapping_json': str(subject_mapping_json),
            }
            if output_dir:
                task['result']['output_dir'] = str(output_dir)
            task['progress'] = {
                'step': 4,
                'total_steps': 4,
                'message': f'批量脱敏完成：成功 {len(batch_entries)} 份，失败 {len(batch_failures)} 份，命中 {total_findings} 处敏感信息',
                'status': 'completed',
                'percent': 100,
            }
            save_task_state(task_id)
            return

        update_progress(1, '正在读取材料并执行文本提取或 OCR...')
        time.sleep(0.2)
        update_progress(2, '正在识别并统一处理敏感信息...')
        result = process_desensitization(
            task_id=task_id,
            input_path=Path(input_path),
            document_name=document_name,
            work_dir=work_dir,
            is_text=is_text,
            output_dir=output_dir,
            output_format=output_format,
            redaction_mode=redaction_mode,
        )

        update_progress(3, '正在生成规范化文档并执行安全复检...')
        report = result['report']
        task['status'] = 'completed'
        task['completed_at'] = datetime.now().isoformat()
        task['result'] = {
            'desensitized_output': str(result['output_file']),
            'desensitization_report': str(result['report_json']),
            'desensitization_report_md': str(result['report_md']),
            'retention_note': str(result['retention_note']),
            'subject_mapping_md': str(result['subject_mapping_md']),
            'subject_mapping_json': str(result['subject_mapping_json']),
        }
        if output_dir:
            task['result']['output_dir'] = str(output_dir)
        task['progress'] = {
            'step': 4,
            'total_steps': 4,
            'message': f'脱敏完成：命中 {report.get("summary", {}).get("total_findings", 0)} 处敏感信息',
            'status': 'completed',
            'percent': 100,
        }
        save_task_state(task_id)
    except Exception as e:
        error_detail = traceback.format_exc()
        print(f"ERROR in desensitize task {task_id}: {error_detail}", file=sys.stderr)
        if redaction_mode == 'agent_enhanced':
            # Enhanced mode is additive. A model/API failure must never prevent the
            # deterministic local engine from producing a usable redacted file.
            try:
                fallback_result = process_desensitization(
                    task_id=task_id,
                    input_path=Path(input_path),
                    document_name=document_name,
                    work_dir=work_dir,
                    is_text=is_text,
                    output_dir=output_dir,
                    output_format=output_format,
                    redaction_mode='standard',
                )
                fallback_report = fallback_result['report']
                warning = f'增强模型调用异常，已自动切换本地脱敏并完成输出：{e}'
                fallback_report.setdefault('warnings', []).append(warning)
                Path(fallback_result['report_json']).write_text(
                    json.dumps(fallback_report, ensure_ascii=False, indent=2),
                    encoding='utf-8',
                )
                Path(fallback_result['report_md']).write_text(
                    render_report_markdown(fallback_report),
                    encoding='utf-8',
                )
                task['status'] = 'completed'
                task['completed_at'] = datetime.now().isoformat()
                task['error_detail'] = error_detail
                task['result'] = {
                    'desensitized_output': str(fallback_result['output_file']),
                    'desensitization_report': str(fallback_result['report_json']),
                    'desensitization_report_md': str(fallback_result['report_md']),
                    'retention_note': str(fallback_result['retention_note']),
                    'subject_mapping_md': str(fallback_result['subject_mapping_md']),
                    'subject_mapping_json': str(fallback_result['subject_mapping_json']),
                }
                if output_dir:
                    task['result']['output_dir'] = str(output_dir)
                task['progress'] = {
                    'step': 4,
                    'total_steps': 4,
                    'message': f'增强模型不可用，已自动完成本地脱敏：命中 {fallback_report.get("summary", {}).get("total_findings", 0)} 处敏感信息',
                    'status': 'completed',
                    'percent': 100,
                }
                save_task_state(task_id)
            except Exception as fallback_error:
                complete_desensitize_with_fallback(
                    task_id,
                    task,
                    work_dir,
                    input_path,
                    document_name,
                    fallback_error,
                    output_dir,
                )
        else:
            complete_desensitize_with_fallback(task_id, task, work_dir, input_path, document_name, e, output_dir)
