#!/usr/bin/env python3
from __future__ import annotations

"""
数据合规智能审查系统 - Web界面
"""
import json
import html as html_lib
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import uuid
from datetime import datetime
from pathlib import Path
from threading import Thread

from flask import Flask, render_template, request, jsonify, Response, send_file, send_from_directory

from desensitize_engine import (
    IMAGE_EXTENSIONS,
    JSON_EXTENSIONS,
    PRESENTATION_EXTENSIONS,
    TABLE_EXTENSIONS,
    TEXT_EXTENSIONS,
    process_desensitization,
)

app = Flask(__name__)

# 配置
BASE_DIR = Path(__file__).parent
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
PROJECT_ROOT = WORKSPACE_ROOT / 'projects' / 'data-compliance-ai-project-kit'
UPLOAD_FOLDER = BASE_DIR / 'uploads'
OUTPUT_FOLDER = BASE_DIR / 'output'
SCRIPTS_DIR = BASE_DIR / 'scripts'
LOCAL_REGULATION_DB = PROJECT_ROOT / 'knowledge-base' / 'local-regulations.sqlite3'
REVIEW_IMAGE_EXTENSIONS = {ext.lstrip('.') for ext in IMAGE_EXTENSIONS}
ALLOWED_EXTENSIONS = {'txt', 'md', 'doc', 'docx', 'pdf'} | REVIEW_IMAGE_EXTENSIONS
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

# 确保目录存在
UPLOAD_FOLDER.mkdir(exist_ok=True)
OUTPUT_FOLDER.mkdir(exist_ok=True)

# 存储任务状态
tasks = {}


def _task_state_path(task_id: str) -> Path:
    return OUTPUT_FOLDER / task_id / 'task_state.json'


def save_task_state(task_id: str):
    if task_id in tasks:
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


def allowed_file(filename):
    safe_name = Path(filename or '').name
    return '.' in safe_name and safe_name.rsplit('.', 1)[1].lower() in (ALLOWED_EXTENSIONS | CODE_EXTENSIONS)


def allowed_desensitize_file(filename):
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


def list_review_history(limit: int = 20) -> list[dict]:
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
    # 禁止指向服务内部目录
    internal_roots = {
        BASE_DIR.resolve(),
        OUTPUT_FOLDER.resolve(),
        UPLOAD_FOLDER.resolve(),
        Path(tempfile.gettempdir()).resolve(),
    }
    for root in internal_roots:
        if path == root or root in path.parents:
            return None
    # 允许指向现有目录，或父目录存在且可创建
    if path.exists() and not path.is_dir():
        return None
    parent = path.parent
    if not parent.exists() or not parent.is_dir():
        return None
    return path


def read_text_best_effort(path: Path) -> str:
    data = path.read_bytes()
    for encoding in ('utf-8', 'utf-8-sig', 'gb18030', 'latin-1'):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode('utf-8', errors='replace')


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


def get_risk_level_color(level):
    """获取风险等级对应的颜色"""
    color_map = {
        '高风险': 'red',
        '中风险': 'yellow',
        '建议优化': 'blue',
        '无': 'green'
    }
    return color_map.get(level, 'gray')


def get_risk_level_order(level):
    """获取风险等级排序值"""
    order_map = {
        '无': 0,
        '建议优化': 1,
        '中风险': 2,
        '高风险': 3
    }
    return order_map.get(level, 0)


def load_json_if_exists(path_str):
    if not path_str:
        return None
    path = Path(path_str)
    if not path.exists():
        return None
    return json.loads(path.read_text(encoding='utf-8'))


def derive_document_name(raw_name: str, input_text: str, uploaded_file) -> str:
    name = (raw_name or '').strip()
    if name:
        return name

    if uploaded_file and getattr(uploaded_file, 'filename', ''):
        return Path(uploaded_file.filename).stem.strip() or '未命名文档'

    text = (input_text or '').strip()
    if text:
        compact = ' '.join(text.split())
        return (compact[:20] + '...') if len(compact) > 20 else compact

    return '未命名文档'


def run_review_pipeline(task_id, input_path, document_name, is_text=False):
    """
    运行审查流水线，并通过SSE推送进度
    """
    task = tasks[task_id]
    work_dir = OUTPUT_FOLDER / task_id
    work_dir.mkdir(parents=True, exist_ok=True)

    # 更新进度
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

    def update_progress(step, message, status='running', detail=None):
        task['progress'] = {
            'step': step,
            'total_steps': len(checkpoints),
            'message': message,
            'status': status,
            'detail': detail
        }
        save_task_state(task_id)

    try:
        # 步骤1: 预处理
        update_progress(1, '正在预处理输入文件...')
        time.sleep(0.5)  # 给用户看到进度

        preprocessed = work_dir / '01_preprocessed.json'
        cmd = [PYTHON_BIN, str(SCRIPTS_DIR / 'preprocess_input.py'), '--output', str(preprocessed)]
        if is_text:
            cmd.extend(['--text', input_path.read_text(encoding='utf-8')])
        else:
            cmd.extend(['--file', str(input_path)])
        subprocess.run(cmd, check=True, capture_output=True)

        # 步骤2: 文档类型识别
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

        # 步骤3: 规划审查路径
        update_progress(3, '正在规划审查路径...')
        time.sleep(0.3)

        planned = work_dir / '03_paths.json'
        result = subprocess.run(
            [PYTHON_BIN, str(SCRIPTS_DIR / 'plan_review_paths.py'), '--classification', str(classification)],
            capture_output=True, text=True, check=True
        )
        planned.write_text(result.stdout, encoding='utf-8')

        # 步骤4: 生成审查任务
        update_progress(4, '正在生成审查任务...')
        time.sleep(0.3)

        tasks_file = work_dir / '04_tasks.json'
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'generate_review_tasks.py'),
            '--classification', str(classification),
            '--planned-paths', str(planned),
            '--output', str(tasks_file)
        ], check=True, capture_output=True)

        # 步骤5: 执行规则化审查（逐个检查点更新进度）
        planned_data = json.loads(planned.read_text(encoding='utf-8'))
        selected_paths = planned_data.get('selected_paths', [])

        findings_dir = work_dir / '06_findings'
        findings_dir.mkdir(parents=True, exist_ok=True)

        for i, path_obj in enumerate(selected_paths):
            path_id = path_obj.get('id') if isinstance(path_obj, dict) else path_obj
            path_name = {
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
            }.get(path_id, path_id)

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
        # findings 是文件路径列表
        findings_files = findings_data.get('findings', [])

        # 步骤6: 汇总结果
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

        # 构建命令参数
        cmd = [
            PYTHON_BIN, str(SCRIPTS_DIR / 'aggregate_review_findings.py'),
            '--skeleton', str(skeleton),
            '--output', str(final_report)
        ]
        # 添加 findings 文件路径
        if findings_files:
            cmd.extend(['--findings'] + findings_files)
        else:
            # 如果没有 findings，从目录中读取所有 json 文件
            findings_files = [str(f) for f in findings_dir.glob('*.json')]
            if findings_files:
                cmd.extend(['--findings'] + findings_files)

        subprocess.run(cmd, check=True, capture_output=True)

        # 步骤7: 应用法规映射与法规库增强（可选）
        update_progress(7, '正在应用法规映射与法规库增强...')
        time.sleep(0.3)

        norm_mapping = BASE_DIR / 'config' / 'default-norm-mappings.json'
        mapped_report = work_dir / '07_report_mapped.json'
        enriched_report = work_dir / '07_report_enriched.json'
        if norm_mapping.exists():
            subprocess.run([
                PYTHON_BIN, str(SCRIPTS_DIR / 'apply_external_norm_mapping.py'),
                '--report', str(final_report),
                '--mapping', str(norm_mapping),
                '--output', str(mapped_report)
            ], check=True, capture_output=True)
            report_for_bundle = mapped_report
        else:
            report_for_bundle = final_report

        if LOCAL_REGULATION_DB.exists():
            subprocess.run([
                PYTHON_BIN, str(PROJECT_ROOT / 'scripts' / 'enrich_report_with_regulation_db.py'),
                '--report', str(report_for_bundle),
                '--db', str(LOCAL_REGULATION_DB),
                '--output', str(enriched_report)
            ], check=True, capture_output=True)
            report_for_bundle = enriched_report

        # 步骤8: 自动复核
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

        # 步骤8+1: LLM 增强建议与改写示例
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
            raise RuntimeError(
                f"LLM 增强失败 (exit {llm_result.returncode}): {llm_result.stderr or llm_result.stdout}"
            )
        report_for_bundle = llm_enhanced_report

        bundle_result = subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'render_report_bundle.py'),
            str(report_for_bundle),
            '--out-dir', str(bundle_dir)
        ], capture_output=True, text=True, check=True)
        bundle = json.loads(bundle_result.stdout)

        # 步骤9: 风险聚类
        update_progress(9, '正在分析风险聚类...')
        time.sleep(0.3)

        # 步骤10: 生成专项审查包
        update_progress(10, '正在生成专项审查包...')
        time.sleep(0.3)

        application_plan = work_dir / '09_application_plan.json'
        evidence_checklist = work_dir / '10_evidence_checklist.json'
        sdk_partner_pack = work_dir / '11_sdk_partner_review_pack.json'
        cross_border_pack = work_dir / '12_cross_border_review_pack.json'
        privacy_remediation_pack = work_dir / '13_privacy_remediation_pack.json'

        # 应用层场景计划
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_application_scenario_plan.py'),
            '--report', str(report_for_bundle),
            '--classification', str(classification),
            '--output', str(application_plan)
        ], check=True, capture_output=True)

        # 证据清单
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_evidence_checklist.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--output', str(evidence_checklist)
        ], check=True, capture_output=True)

        # SDK合作方审查包
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_sdk_partner_review_pack.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--evidence-checklist', str(evidence_checklist),
            '--output', str(sdk_partner_pack)
        ], check=True, capture_output=True)

        # 数据出境审查包
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_cross_border_review_pack.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--evidence-checklist', str(evidence_checklist),
            '--output', str(cross_border_pack)
        ], check=True, capture_output=True)

        # 隐私整改审查包
        subprocess.run([
            PYTHON_BIN, str(SCRIPTS_DIR / 'build_privacy_remediation_pack.py'),
            '--report', str(report_for_bundle),
            '--application-plan', str(application_plan),
            '--evidence-checklist', str(evidence_checklist),
            '--output', str(privacy_remediation_pack)
        ], check=True, capture_output=True)

        # 步骤11: 生成整改任务
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

        # 完成任务
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
            'status': 'completed'
        }
        save_task_state(task_id)

    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        print(f"ERROR in task {task_id}: {error_detail}")
        task['status'] = 'failed'
        task['error'] = str(e)
        task['error_detail'] = error_detail
        task['progress'] = {
            'step': task.get('progress', {}).get('step', 0),
            'total_steps': len(checkpoints),
            'message': f'出错了: {str(e)}',
            'status': 'error'
        }
        save_task_state(task_id)


def run_code_review_pipeline(task_id, input_path, document_name, is_text=False):
    task = tasks[task_id]
    work_dir = OUTPUT_FOLDER / task_id
    work_dir.mkdir(parents=True, exist_ok=True)

    def update_progress(step, message, status='running'):
        task['progress'] = {
            'step': step,
            'total_steps': 4,
            'message': message,
            'status': status,
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
        }
        save_task_state(task_id)
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        print(f"ERROR in code task {task_id}: {error_detail}")
        task['status'] = 'failed'
        task['error'] = str(e)
        task['error_detail'] = error_detail
        task['progress'] = {
            'step': task.get('progress', {}).get('step', 0),
            'total_steps': 4,
            'message': f'出错了: {str(e)}',
            'status': 'error',
        }
        save_task_state(task_id)


def run_desensitize_pipeline(task_id, input_path, document_name, is_text=False, output_dir=None):
    task = tasks[task_id]
    work_dir = OUTPUT_FOLDER / task_id
    work_dir.mkdir(parents=True, exist_ok=True)

    def update_progress(step, message, status='running', detail=None):
        task['progress'] = {
            'step': step,
            'total_steps': 4,
            'message': message,
            'status': status,
            'detail': detail or {},
        }
        save_task_state(task_id)

    try:
        update_progress(1, '正在读取待脱敏数据...')
        time.sleep(0.2)
        update_progress(2, '正在识别敏感信息并执行保留格式打码...')
        result = process_desensitization(
            task_id=task_id,
            input_path=Path(input_path),
            document_name=document_name,
            work_dir=work_dir,
            is_text=is_text,
            output_dir=output_dir,
        )

        update_progress(3, '正在生成脱敏报告与主体映射表...')
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
        }
        save_task_state(task_id)
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        print(f"ERROR in desensitize task {task_id}: {error_detail}")
        task['status'] = 'failed'
        task['error'] = str(e)
        task['error_detail'] = error_detail
        task['progress'] = {
            'step': task.get('progress', {}).get('step', 0),
            'total_steps': 4,
            'message': f'脱敏失败: {str(e)}',
            'status': 'error',
        }
        save_task_state(task_id)


@app.route('/')
def index():
    """首页 - 上传页面"""
    return render_template('index.html', history=list_review_history())


@app.route('/preview/a')
def preview_a():
    return render_template('preview_A_dark.html')

@app.route('/preview/b')
def preview_b():
    return render_template('preview_B_modern.html')

@app.route('/preview/c')
def preview_c():
    return render_template('preview_C_warm.html')

@app.route('/preview')
def preview_selector():
    return render_template('preview_selector.html')


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """处理文件上传或文本输入"""
    input_text = request.form.get('input_text', '').strip()
    uploaded_file = request.files.get('file')
    requested_review_type = request.form.get('review_type', '').strip()
    document_name = derive_document_name(
        request.form.get('document_name', ''),
        input_text,
        uploaded_file,
    )

    task_id = str(uuid.uuid4())[:8]

    if input_text:
        review_type = infer_review_type('', requested_review_type)
        # 文本输入
        temp_file = UPLOAD_FOLDER / f'{task_id}.{"code.txt" if review_type == "code" else "txt"}'
        temp_file.write_text(input_text, encoding='utf-8')

        tasks[task_id] = {
            'id': task_id,
            'document_name': document_name,
            'input_type': 'code_text' if review_type == 'code' else 'text',
            'review_type': review_type,
            'input_path': str(temp_file),
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        }

        # 启动后台线程执行审查
        target = run_code_review_pipeline if review_type == 'code' else run_review_pipeline
        thread = Thread(target=target, args=(task_id, temp_file, document_name, True))
        thread.start()

        return jsonify({'task_id': task_id})

    elif uploaded_file is not None:
        # 文件上传
        file = uploaded_file
        if file.filename == '':
            return jsonify({'error': '请选择文件'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': '不支持的文件类型'}), 400

        # 保存上传的文件
        safe_filename = safe_upload_filename(file.filename)
        file_path = UPLOAD_FOLDER / f'{task_id}_{safe_filename}'
        file.save(file_path)
        review_type = infer_review_type(file.filename, requested_review_type)

        tasks[task_id] = {
            'id': task_id,
            'document_name': document_name,
            'input_type': 'code_file' if review_type == 'code' else 'file',
            'review_type': review_type,
            'input_path': str(file_path),
            'original_filename': file.filename,
            'stored_filename': safe_filename,
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        }

        # 启动后台线程执行审查
        target = run_code_review_pipeline if review_type == 'code' else run_review_pipeline
        thread = Thread(target=target, args=(task_id, file_path, document_name, False))
        thread.start()

        return jsonify({'task_id': task_id})

    else:
        return jsonify({'error': '请上传文件或输入文本'}), 400


@app.route('/api/desensitize', methods=['POST'])
def desensitize_upload():
    """处理数据脱敏任务，独立于合规审查流水线。"""
    input_text = request.form.get('input_text', '').strip()
    uploaded_file = request.files.get('file')
    document_name = derive_document_name(
        request.form.get('document_name', ''),
        input_text,
        uploaded_file,
    )
    output_dir_raw = request.form.get('output_dir', '').strip()
    output_dir = validate_output_dir(output_dir_raw)
    task_id = str(uuid.uuid4())[:8]

    if input_text:
        temp_file = UPLOAD_FOLDER / f'{task_id}_desensitize.txt'
        temp_file.write_text(input_text, encoding='utf-8')
        tasks[task_id] = {
            'id': task_id,
            'document_name': document_name,
            'product_type': 'desensitize',
            'input_type': 'text',
            'input_path': str(temp_file),
            'output_dir': str(output_dir) if output_dir else None,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
        }
        thread = Thread(target=run_desensitize_pipeline, args=(task_id, temp_file, document_name, True, output_dir))
        thread.start()
        return jsonify({'task_id': task_id})

    if uploaded_file is not None:
        if uploaded_file.filename == '':
            return jsonify({'error': '请选择文件'}), 400
        if not allowed_desensitize_file(uploaded_file.filename):
            return jsonify({'error': '不支持的脱敏文件类型'}), 400

        safe_filename = safe_upload_filename(uploaded_file.filename)
        file_path = UPLOAD_FOLDER / f'{task_id}_{safe_filename}'
        uploaded_file.save(file_path)
        tasks[task_id] = {
            'id': task_id,
            'document_name': document_name,
            'product_type': 'desensitize',
            'input_type': 'file',
            'input_path': str(file_path),
            'original_filename': uploaded_file.filename,
            'stored_filename': safe_filename,
            'output_dir': str(output_dir) if output_dir else None,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
        }
        thread = Thread(target=run_desensitize_pipeline, args=(task_id, file_path, document_name, False, output_dir))
        thread.start()
        return jsonify({'task_id': task_id})

    return jsonify({'error': '请上传文件或输入文本'}), 400


@app.route('/api/progress/<task_id>')
def get_progress(task_id):
    """SSE推送进度"""
    if not ensure_task_loaded(task_id):
        def generate():
            yield f'data: {json.dumps({"error": "任务不存在"})}\n\n'
        return Response(generate(), mimetype='text/event-stream')

    def generate():
        while True:
            if task_id not in tasks:
                yield f'data: {json.dumps({"error": "任务不存在"})}\n\n'
                break

            task = tasks[task_id]
            progress = task.get('progress', {})

            data = {
                'status': task['status'],
                'progress': progress
            }

            yield f'data: {json.dumps(data, ensure_ascii=False)}\n\n'

            if task['status'] in ['completed', 'failed']:
                break

            time.sleep(0.5)

    return Response(generate(), mimetype='text/event-stream')


@app.route('/api/history')
def get_history():
    return jsonify({'items': list_review_history()})


@app.route('/api/history/<task_id>', methods=['DELETE'])
def delete_history_item(task_id):
    task_dir = safe_task_output_dir(task_id)
    if task_dir is None:
        return jsonify({'error': '任务 ID 不合法'}), 400
    if not task_dir.exists():
        tasks.pop(task_id, None)
        return jsonify({'ok': True})
    shutil.rmtree(task_dir)
    tasks.pop(task_id, None)
    return jsonify({'ok': True})


@app.route('/result/<task_id>')
def result_page(task_id):
    """结果展示页面"""
    if not ensure_task_loaded(task_id):
        return '任务不存在', 404

    task = tasks[task_id]
    if task.get('product_type') == 'desensitize':
        return render_desensitize_result(task_id)

    if task['status'] != 'completed':
        return render_template('result.html', task=task, report=None)

    # 读取报告
    report_path = Path(task['result']['report'])
    if not report_path.exists():
        return '报告文件不存在', 404

    report = enrich_code_report_for_display(json.loads(report_path.read_text(encoding='utf-8')))

    # 统计风险数量
    risk_stats = {'高风险': 0, '中风险': 0, '建议优化': 0, '无': 0}
    for item in report.get('items', []):
        level = item.get('risk_level', '无')
        if level in risk_stats:
            risk_stats[level] += 1

    # 按风险等级排序
    sorted_items = sorted(
        report.get('items', []),
        key=lambda x: get_risk_level_order(x.get('risk_level', '无')),
        reverse=True
    )

    extra = {
        'remediation': load_json_if_exists(task['result'].get('remediation')),
        'evidence': load_json_if_exists(task['result'].get('evidence')),
        'sdk_pack': load_json_if_exists(task['result'].get('sdk_pack')),
        'cross_border_pack': load_json_if_exists(task['result'].get('cross_border_pack')),
        'privacy_pack': load_json_if_exists(task['result'].get('privacy_pack')),
    }

    return render_template('result.html', task=task, report=report,
                          risk_stats=risk_stats, items=sorted_items, **extra)


@app.route('/desensitize/result/<task_id>')
def desensitize_result_page(task_id):
    return render_desensitize_result(task_id)


def render_desensitize_result(task_id):
    if not ensure_task_loaded(task_id):
        return '任务不存在', 404
    task = tasks[task_id]
    report = None
    if task['status'] == 'completed':
        report_path = Path(task.get('result', {}).get('desensitization_report', ''))
        if not report_path.exists():
            return '脱敏报告不存在', 404
        report = json.loads(report_path.read_text(encoding='utf-8'))
        # 以任务中的 document_name 为准（来自前端自动填入的文件原名）
        if task.get('document_name'):
            report['document_name'] = task['document_name']
    return render_template('desensitize_result.html', task=task, report=report)


@app.route('/api/result/<task_id>')
def get_result(task_id):
    """API获取结果"""
    if not ensure_task_loaded(task_id):
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]

    if task['status'] != 'completed':
        return jsonify({
            'task_id': task_id,
            'status': task['status'],
            'progress': task.get('progress', {})
        })

    if task.get('product_type') == 'desensitize':
        report_path = Path(task['result']['desensitization_report'])
        return jsonify({
            'task_id': task_id,
            'status': task['status'],
            'product_type': 'desensitize',
            'document_name': task['document_name'],
            'report': json.loads(report_path.read_text(encoding='utf-8')),
        })

    report_path = Path(task['result']['report'])
    report = enrich_code_report_for_display(json.loads(report_path.read_text(encoding='utf-8')))

    return jsonify({
        'task_id': task_id,
        'status': task['status'],
        'document_name': task['document_name'],
        'report': report,
        'remediation': load_json_if_exists(task['result'].get('remediation')),
        'evidence': load_json_if_exists(task['result'].get('evidence')),
        'sdk_pack': load_json_if_exists(task['result'].get('sdk_pack')),
        'cross_border_pack': load_json_if_exists(task['result'].get('cross_border_pack')),
        'privacy_pack': load_json_if_exists(task['result'].get('privacy_pack')),
    })


@app.route('/api/download/<task_id>/<file_type>')
def download_file(task_id, file_type):
    """下载报告文件"""
    if not ensure_task_loaded(task_id):
        return '任务不存在', 404

    task = tasks[task_id]

    if task['status'] != 'completed':
        return '审查尚未完成', 400

    if task.get('product_type') == 'desensitize':
        file_mapping = {
            'desensitized_output': ('desensitized_output', ''),
            'desensitization_report': ('desensitization_report', '.json'),
            'desensitization_report_md': ('desensitization_report_md', '.md'),
            'retention_note': ('retention_note', '.txt'),
            'subject_mapping_md': ('subject_mapping_md', '.md'),
            'subject_mapping_json': ('subject_mapping_json', '.json'),
        }
        if file_type not in file_mapping:
            return '不支持的文件类型', 400
        key, ext = file_mapping[file_type]
        if key not in task.get('result', {}):
            return '文件不存在', 404
        file_path = Path(task['result'][key])
        if not file_path.exists():
            return '文件不存在', 404
        download_ext = file_path.suffix or ext
        return send_file(
            file_path,
            as_attachment=True,
            download_name=f'{task["document_name"]}_{file_type}{download_ext}'
        )

    file_mapping = {
        'report': ('report', '.json'),
        'report_md': ('report_markdown', '.md'),
        'remediation': ('remediation', '.json'),
        'evidence': ('evidence', '.json'),
        'sdk_pack': ('sdk_pack', '.json'),
        'cross_border_pack': ('cross_border_pack', '.json'),
        'privacy_pack': ('privacy_pack', '.json'),
        'code_suggestions': ('code_suggestions', '.md'),
    }

    if file_type not in file_mapping:
        return '不支持的文件类型', 400

    key, ext = file_mapping[file_type]
    if key not in task.get('result', {}):
        return '文件不存在', 404
    if file_type == 'code_suggestions':
        refresh_code_suggestions_file(task)
    file_path = Path(task['result'][key])

    if not file_path.exists():
        return '文件不存在', 404

    return send_file(
        file_path,
        as_attachment=True,
        download_name=f'{task["document_name"]}_{file_type}{ext}'
    )


@app.route('/api/desensitize/download/<task_id>/<file_type>')
def download_desensitize_file(task_id, file_type):
    return download_file(task_id, file_type)


@app.route('/api/save-download/<task_id>/<file_type>', methods=['POST'])
def save_download_file(task_id, file_type):
    """下载文件：直接发送文件内容给浏览器下载，不使用服务器端路径。"""
    if not ensure_task_loaded(task_id):
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]
    if task['status'] != 'completed':
        return jsonify({'error': '审查尚未完成'}), 400

    if task.get('product_type') == 'desensitize':
        file_mapping = {
            'desensitized_output': ('desensitized_output', ''),
            'desensitization_report': ('desensitization_report', '.json'),
            'desensitization_report_md': ('desensitization_report_md', '.md'),
            'retention_note': ('retention_note', '.txt'),
            'subject_mapping_md': ('subject_mapping_md', '.md'),
            'subject_mapping_json': ('subject_mapping_json', '.json'),
        }
        if file_type not in file_mapping:
            return jsonify({'error': '不支持的文件类型'}), 400
        key, ext = file_mapping[file_type]
        if key not in task.get('result', {}):
            return jsonify({'error': '文件不存在'}), 404
        source = Path(task['result'][key])
        if not source.exists():
            return jsonify({'error': '文件不存在'}), 404

        download_ext = source.suffix or ext
        return send_file(
            source,
            as_attachment=True,
            download_name=f'{task["document_name"]}_{file_type}{download_ext}',
        )

    file_mapping = {
        'report': ('report', '.json'),
        'report_md': ('report_markdown', '.md'),
        'remediation': ('remediation', '.json'),
        'evidence': ('evidence', '.json'),
        'sdk_pack': ('sdk_pack', '.json'),
        'cross_border_pack': ('cross_border_pack', '.json'),
        'privacy_pack': ('privacy_pack', '.json'),
        'code_suggestions': ('code_suggestions', '.md'),
    }
    if file_type not in file_mapping:
        return jsonify({'error': '不支持的文件类型'}), 400

    key, ext = file_mapping[file_type]
    if key not in task.get('result', {}):
        return jsonify({'error': '文件不存在'}), 404
    if file_type == 'code_suggestions':
        refresh_code_suggestions_file(task)
    source = Path(task['result'][key])
    if not source.exists():
        return jsonify({'error': '文件不存在'}), 404

    download_ext = source.suffix or ext
    return send_file(
        source,
        as_attachment=True,
        download_name=f'{task["document_name"]}_{file_type}{download_ext}',
    )


@app.route('/api/desensitize/save-download/<task_id>/<file_type>', methods=['POST'])
def save_desensitize_file(task_id, file_type):
    return save_download_file(task_id, file_type)


@app.route('/api/task/<task_id>/preview-file')
def preview_file(task_id):
    """获取原始上传文件的预览 URL 和类型"""
    if not ensure_task_loaded(task_id):
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]
    input_path = task.get('input_path', '')
    if not input_path:
        return jsonify({'error': '无上传文件'}), 404

    file_path = Path(input_path)
    if not file_path.exists():
        return jsonify({'error': '文件不存在'}), 404

    file_ext = file_path.suffix.lower().lstrip('.')
    file_type = 'pdf' if file_ext == 'pdf' else 'docx' if file_ext in ('docx', 'doc') else 'text'

    return jsonify({
        'url': f'/uploads/{file_path.name}',
        'type': file_type,
        'filename': task.get('original_filename', file_path.name)
    })


@app.route('/api/task/<task_id>/locations')
def task_locations(task_id):
    """获取审查结果中所有风险点的位置映射数据"""
    if not ensure_task_loaded(task_id):
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]
    if task['status'] != 'completed':
        return jsonify({'error': '审查尚未完成'}), 400

    report_path = task.get('result', {}).get('report')
    if not report_path:
        return jsonify({'error': '报告不存在'}), 404

    report_path = Path(report_path)
    if not report_path.exists():
        return jsonify({'error': '报告不存在'}), 404

    try:
        report = json.loads(report_path.read_text(encoding='utf-8'))
    except Exception:
        return jsonify({'error': '报告解析失败'}), 500

    input_path = task.get('input_path', '')
    file_path = Path(input_path) if input_path else None
    file_ext = file_path.suffix.lower().lstrip('.') if file_path and file_path.exists() else ''
    file_type = 'pdf' if file_ext == 'pdf' else 'docx' if file_ext in ('docx', 'doc') else 'text'

    locations = []
    for idx, item in enumerate(report.get('items', []), start=1):
        source_sections = item.get('source_sections', [])
        if not source_sections:
            continue

        section = source_sections[0]
        locations.append({
            'risk_id': f'risk-{idx}',
            'risk_point': item.get('risk_point', ''),
            'risk_level': item.get('risk_level', '无'),
            'page': section.get('page'),
            'segment_index': section.get('segment_index'),
            'label': section.get('label', ''),
            'snippet': section.get('snippet', ''),
        })

    return jsonify({
        'file_url': f'/uploads/{file_path.name}' if file_path and file_path.exists() else None,
        'file_type': file_type,
        'locations': locations
    })


def _load_preview_source(task_id: str, task: dict) -> tuple[str, list[dict], dict]:
    """Return text used by the review pipeline plus segment metadata for preview."""
    meta: dict = {
        'source': 'fallback',
        'filename': task.get('original_filename') or task.get('document_name') or '原文',
        'page_count': None,
    }
    preprocessed_path = OUTPUT_FOLDER / task_id / '01_preprocessed.json'
    if preprocessed_path.exists():
        try:
            preprocessed = json.loads(preprocessed_path.read_text(encoding='utf-8'))
            full_text = preprocessed.get('normalized_text') or ''
            contexts = preprocessed.get('segment_contexts') or []
            if full_text:
                meta['source'] = 'preprocessed'
                meta['page_count'] = preprocessed.get('page_count')
                return full_text, contexts, meta
        except Exception:
            pass

    input_path = task.get('input_path', '')
    if input_path and Path(input_path).exists():
        ext = Path(input_path).suffix.lower()
        if ext in ('.txt', '.md', '.markdown', '.py', '.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.json', '.csv', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf', '.env', '.sql', '.sh'):
            try:
                full_text = Path(input_path).read_text(encoding='utf-8', errors='replace')
                if full_text:
                    meta['source'] = 'input'
                    return full_text, [], meta
            except Exception:
                pass

    return '', [], meta


def _build_segment_offsets(full_text: str, contexts: list[dict]) -> dict[int, tuple[int, int]]:
    offsets: dict[int, tuple[int, int]] = {}
    cursor = 0
    for context in contexts:
        segment = context.get('text') or ''
        segment_index = context.get('segment_index')
        if not segment or segment_index is None:
            continue
        pos = full_text.find(segment, cursor)
        if pos < 0:
            pos = full_text.find(segment)
        if pos < 0:
            continue
        end = pos + len(segment)
        offsets[int(segment_index)] = (pos, end)
        cursor = end
    return offsets


def _find_text_range(haystack: str, needle: str, window: tuple[int, int] | None = None) -> tuple[int, int] | None:
    needle = (needle or '').strip()
    if not haystack or not needle:
        return None

    start_bound, end_bound = window or (0, len(haystack))
    start_bound = max(0, start_bound)
    end_bound = min(len(haystack), end_bound)
    area = haystack[start_bound:end_bound]

    pos = area.find(needle)
    if pos >= 0:
        start = start_bound + pos
        return start, start + len(needle)

    compact_needle = re.sub(r'\s+', ' ', needle)
    if len(compact_needle) < 10:
        return None

    pattern = r'\s+'.join(re.escape(part) for part in compact_needle.split())
    try:
        match = re.search(pattern, area)
    except re.error:
        match = None
    if match:
        return start_bound + match.start(), start_bound + match.end()

    first_piece = re.search(r'[^\s，。；、]{8,}', needle)
    if first_piece:
        piece = first_piece.group(0)
        pos = area.find(piece)
        if pos >= 0:
            start = start_bound + pos
            end = min(end_bound, start + max(len(piece), min(len(needle), 180)))
            return start, end

    return None


@app.route('/api/task/<task_id>/preview-full')
def preview_full_text(task_id):
    """获取完整原文及风险点位置映射（高亮用）"""
    if not ensure_task_loaded(task_id):
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]
    if task['status'] != 'completed':
        return jsonify({'error': '审查尚未完成'}), 400

    full_text, segment_contexts, meta = _load_preview_source(task_id, task)
    segment_offsets = _build_segment_offsets(full_text, segment_contexts)
    context_by_index = {
        int(context.get('segment_index')): context
        for context in segment_contexts
        if context.get('segment_index') is not None
    }

    # 读取报告
    report_path = task.get('result', {}).get('report')
    risks = []
    if report_path and Path(report_path).exists():
        try:
            report = json.loads(Path(report_path).read_text(encoding='utf-8'))
        except Exception:
            report = {'items': []}
    else:
        report = {'items': []}

    if full_text:
        for idx, item in enumerate(report.get('items', []), start=1):
            source_sections = item.get('source_sections', [])
            if not source_sections:
                continue
            section = source_sections[0]
            snippet = (section.get('snippet') or '').strip()
            if not snippet or len(snippet) < 10:
                continue

            segment_index = section.get('segment_index')
            segment_window = None
            if segment_index is not None:
                try:
                    segment_window = segment_offsets.get(int(segment_index))
                except (TypeError, ValueError):
                    segment_window = None

            found = _find_text_range(full_text, snippet, segment_window) or _find_text_range(full_text, snippet)
            if not found and segment_window:
                found = segment_window
            if not found:
                continue
            start_pos, end_pos = found
            context = context_by_index.get(int(segment_index)) if segment_index is not None and str(segment_index).isdigit() else {}

            risks.append({
                'risk_id': f'risk-{idx}',
                'index': idx,
                'risk_point': item.get('risk_point', ''),
                'risk_level': item.get('risk_level', '无'),
                'snippet': snippet,
                'start': start_pos,
                'end': end_pos,
                'page': section.get('page') or context.get('page'),
                'segment_index': segment_index,
                'label': section.get('label') or context.get('label') or '',
            })

    # 如果没有原文但有报告，降级为 snippet 拼接视图
    if not full_text:
        cursor = 0
        for idx, item in enumerate(report.get('items', []), start=1):
            source_sections = item.get('source_sections', [])
            if not source_sections:
                continue
            snippet = (source_sections[0].get('snippet') or '').strip()
            if not snippet or len(snippet) < 10:
                continue
            sep = '\n\n' if cursor > 0 else ''
            start_pos = cursor + len(sep)
            full_text += sep + snippet
            cursor = len(full_text)
            risks.append({
                'risk_id': f'risk-{idx}',
                'index': idx,
                'risk_point': item.get('risk_point', ''),
                'risk_level': item.get('risk_level', '无'),
                'snippet': snippet,
                'start': start_pos,
                'end': cursor,
                'page': source_sections[0].get('page'),
                'segment_index': source_sections[0].get('segment_index'),
                'label': source_sections[0].get('label', ''),
            })

    if not full_text:
        return jsonify({'error': '无可预览的内容'}), 404

    return jsonify({
        'full_text': full_text,
        'risks': risks,
        'total_risks': len(risks),
        'filename': meta.get('filename'),
        'page_count': meta.get('page_count'),
        'source': meta.get('source'),
    })


def _load_task_report(task: dict) -> dict:
    report_path = task.get('result', {}).get('report')
    if report_path and Path(report_path).exists():
        try:
            return json.loads(Path(report_path).read_text(encoding='utf-8'))
        except Exception:
            return {'items': []}
    return {'items': []}


def _report_preview_risks(report: dict) -> list[dict]:
    risks: list[dict] = []
    for idx, item in enumerate(report.get('items', []), start=1):
        source_sections = item.get('source_sections') or []
        if not source_sections:
            continue
        sections = []
        for section in source_sections:
            snippet = (section.get('snippet') or '').strip()
            if not snippet:
                continue
            sections.append({
                'snippet': snippet,
                'page': section.get('page'),
                'segment_index': section.get('segment_index'),
                'label': section.get('label', ''),
            })
        if not sections:
            continue
        first_section = sections[0]
        risks.append({
            'risk_id': f'risk-{idx}',
            'index': idx,
            'risk_point': item.get('risk_point', ''),
            'risk_level': item.get('risk_level', '无'),
            'snippet': '\n\n'.join(section['snippet'] for section in sections),
            'sections': sections,
            'page': first_section.get('page'),
            'segment_index': first_section.get('segment_index'),
            'label': first_section.get('label', ''),
        })
    return risks


def _search_phrases(snippet: str) -> list[str]:
    cleaned = re.sub(r'\s+', ' ', (snippet or '').strip())
    phrases: list[str] = []
    if len(cleaned) >= 12:
        phrases.append(cleaned[:80])
    for part in re.split(r'[。；;.!?？]\s*', cleaned):
        part = part.strip()
        if len(part) < 8:
            continue
        if len(part) <= 80:
            phrases.append(part)
        else:
            for clause in re.split(r'[，,、]\s*', part):
                clause = clause.strip()
                if len(clause) >= 8:
                    phrases.append(clause[:80])
            for start in range(0, len(part), 60):
                chunk = part[start:start + 80].strip()
                if len(chunk) >= 12:
                    phrases.append(chunk)
    seen: set[str] = set()
    out: list[str] = []
    for phrase in phrases:
        if phrase and phrase not in seen:
            seen.add(phrase)
            out.append(phrase)
    return out


def _compact_pdf_text(value: str) -> str:
    return re.sub(r'\s+', '', (value or '').strip())


def _pdf_anchor_phrases(snippet: str) -> list[str]:
    compact = _compact_pdf_text(snippet)
    phrases = []
    for size in (36, 28, 20, 14):
        if len(compact) >= size:
            phrases.append(compact[:size])
    first_sentence = re.split(r'[。；;.!?？]', compact)[0].strip()
    if len(first_sentence) >= 14:
        phrases.append(first_sentence[:36])
    return list(dict.fromkeys(phrases))


def _pdf_section_phrases(snippet: str) -> list[str]:
    compact = _compact_pdf_text(snippet)
    phrases: list[str] = []
    for sentence in re.split(r'[。；;.!?？]', compact):
        sentence = sentence.strip()
        if len(sentence) < 10:
            continue
        for start in range(0, len(sentence), 30):
            chunk = sentence[start:start + 42]
            if len(chunk) >= 12:
                phrases.append(chunk)
    if not phrases:
        for start in range(0, len(compact), 30):
            chunk = compact[start:start + 42]
            if len(chunk) >= 12:
                phrases.append(chunk)
    return list(dict.fromkeys(phrases))


def _find_pdf_section_anchor(doc, snippet: str):
    for phrase in _pdf_anchor_phrases(snippet):
        for page_index in range(doc.page_count):
            page = doc.load_page(page_index)
            rects = page.search_for(phrase)
            if rects:
                return page_index + 1, rects
    return None, []


def _pdf_section_line_rects(page, anchor_rects, snippet: str):
    import fitz

    if not anchor_rects:
        return []
    compact_len = len(_compact_pdf_text(snippet))
    line_count = max(1, min(10, (compact_len + 34) // 35))
    anchor_top = min(float(rect.y0) for rect in anchor_rects)
    clip_bottom = min(float(page.rect.height), max(float(rect.y1) for rect in anchor_rects) + 280)
    clip = fitz.Rect(0, max(0, anchor_top - 6), float(page.rect.width), clip_bottom)
    words = page.get_text('words', clip=clip)
    lines: dict[tuple[int, int], list[tuple]] = {}
    for word in words:
        key = (int(word[5]), int(word[6]))
        lines.setdefault(key, []).append(word)
    rects = []
    for line_words in lines.values():
        x0 = min(float(word[0]) for word in line_words)
        y0 = min(float(word[1]) for word in line_words)
        x1 = max(float(word[2]) for word in line_words)
        y1 = max(float(word[3]) for word in line_words)
        rects.append(fitz.Rect(x0, y0, x1, y1))
    rects.sort(key=lambda rect: (float(rect.y0), float(rect.x0)))
    start_idx = 0
    for idx, rect in enumerate(rects):
        if rect.y1 >= anchor_top - 2:
            start_idx = idx
            break
    return rects[start_idx:start_idx + line_count]


def _pdf_risk_highlights(pdf_path: Path, risks: list[dict]) -> tuple[list[dict], int]:
    import fitz

    doc = fitz.open(str(pdf_path))
    enriched: list[dict] = []
    for risk in risks:
        found_page = None
        found_rects: list[tuple[int, object]] = []
        seen_rects: set[tuple[int, int, int, int, int]] = set()
        sections = risk.get('sections') or [{'snippet': risk.get('snippet', '')}]
        for section in sections:
            snippet = section.get('snippet', '')
            anchor_page, anchor_rects = _find_pdf_section_anchor(doc, snippet)
            if not anchor_page or not anchor_rects:
                continue
            found_page = found_page or anchor_page
            page = doc.load_page(anchor_page - 1)
            rects = _pdf_section_line_rects(page, anchor_rects, snippet)
            if not rects:
                min_y = max(0, min(float(rect.y0) for rect in anchor_rects) - 6)
                max_y = min(float(page.rect.height), max(float(rect.y1) for rect in anchor_rects) + 260)
                clip = fitz.Rect(0, min_y, float(page.rect.width), max_y)
                for phrase in _pdf_section_phrases(snippet):
                    rects.extend(page.search_for(phrase, clip=clip))
            for rect in rects:
                key = (
                    anchor_page,
                    round(float(rect.x0) * 10),
                    round(float(rect.y0) * 10),
                    round(float(rect.x1) * 10),
                    round(float(rect.y1) * 10),
                )
                if key in seen_rects:
                    continue
                seen_rects.add(key)
                found_rects.append((anchor_page, rect))
                if len(found_rects) >= 160:
                    break
            if len(found_rects) >= 160:
                break

        if not found_rects:
            for phrase in _search_phrases(risk.get('snippet', '')):
                if found_rects:
                    break
                if len(phrase) > 50:
                    continue
                for page_index in range(doc.page_count):
                    page = doc.load_page(page_index)
                    rects = page.search_for(phrase)
                    if rects:
                        found_page = page_index + 1
                        found_rects.extend((page_index + 1, rect) for rect in rects[:24])
                        break

        item = dict(risk)
        item['page'] = found_page or risk.get('page') or 1
        item['highlights'] = []
        for page_number, rect in found_rects[:160]:
            page = doc.load_page(page_number - 1)
            width = float(page.rect.width)
            height = float(page.rect.height)
            item['highlights'].append({
                'page': page_number,
                'x': float(rect.x0) / width * 100,
                'y': float(rect.y0) / height * 100,
                'w': float(rect.width) / width * 100,
                'h': float(rect.height) / height * 100,
            })
        enriched.append(item)
    page_count = doc.page_count
    doc.close()
    return enriched, page_count


def _docx_block_html(parent) -> str:
    from docx.oxml.table import CT_Tbl
    from docx.oxml.text.paragraph import CT_P
    from docx.table import Table
    from docx.text.paragraph import Paragraph

    def block_parent(container):
        return container.element.body if hasattr(container, 'element') and hasattr(container.element, 'body') else container._tc

    def paragraph_html(paragraph: Paragraph) -> str:
        text = paragraph.text.strip()
        if not text:
            return ''
        style = (paragraph.style.name if paragraph.style else '').lower()
        tag = 'p'
        if 'heading 1' in style or '标题 1' in style:
            tag = 'h1'
        elif 'heading 2' in style or '标题 2' in style:
            tag = 'h2'
        elif 'heading 3' in style or '标题 3' in style:
            tag = 'h3'
        return f'<{tag}>{html_lib.escape(text)}</{tag}>'

    def table_html(table: Table) -> str:
        rows = []
        for row in table.rows:
            cells = []
            for cell in row.cells:
                inner = _docx_block_html(cell).strip()
                if not inner:
                    inner = html_lib.escape(cell.text.strip())
                cells.append(f'<td>{inner}</td>')
            rows.append('<tr>' + ''.join(cells) + '</tr>')
        if not rows:
            return ''
        return '<table>' + ''.join(rows) + '</table>'

    html_parts: list[str] = []
    for child in block_parent(parent).iterchildren():
        if isinstance(child, CT_P):
            rendered = paragraph_html(Paragraph(child, parent))
        elif isinstance(child, CT_Tbl):
            rendered = table_html(Table(child, parent))
        else:
            rendered = ''
        if rendered:
            html_parts.append(rendered)

    if hasattr(parent, 'sections'):
        for section in parent.sections:
            for area_name, area in (('header', section.header), ('footer', section.footer)):
                area_parts = []
                for paragraph in area.paragraphs:
                    rendered = paragraph_html(paragraph)
                    if rendered:
                        area_parts.append(rendered)
                for table in area.tables:
                    rendered = table_html(table)
                    if rendered:
                        area_parts.append(rendered)
                if area_parts:
                    html_parts.append(f'<section class="word-{area_name}">' + ''.join(area_parts) + '</section>')

    return ''.join(html_parts)


def _docx_preview_html(path: Path) -> str:
    from docx import Document

    document = Document(str(path))
    return '<article class="word-page">' + _docx_block_html(document) + '</article>'


def _doc_preview_html(path: Path) -> str:
    if path.suffix.lower() == '.docx':
        return _docx_preview_html(path)
    if not shutil.which('textutil'):
        raise RuntimeError('当前环境不支持 .doc 预览，请转换为 .docx 或 PDF')
    run = subprocess.run(
        ['textutil', '-convert', 'html', '-stdout', str(path)],
        capture_output=True,
        text=True,
        check=False,
    )
    if run.returncode != 0:
        raise RuntimeError(run.stderr.strip() or 'textutil 转换 Word 失败')
    body = re.search(r'<body[^>]*>(.*)</body>', run.stdout, re.I | re.S)
    html = body.group(1) if body else run.stdout
    return '<article class="word-page">' + html + '</article>'


@app.route('/api/task/<task_id>/preview-document')
def preview_document(task_id):
    """文件级预览：PDF 渲染 PDF 页，Word 渲染文档 HTML，普通文本走全文兜底。"""
    if not ensure_task_loaded(task_id):
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]
    if task['status'] != 'completed':
        return jsonify({'error': '审查尚未完成'}), 400

    input_path = task.get('input_path', '')
    file_path = Path(input_path) if input_path else None
    if not file_path or not file_path.exists():
        return preview_full_text(task_id)

    report = _load_task_report(task)
    risks = _report_preview_risks(report)
    ext = file_path.suffix.lower()
    filename = task.get('original_filename') or task.get('document_name') or file_path.name

    if ext == '.pdf':
        import fitz

        doc = fitz.open(str(file_path))
        pages = []
        for page_index in range(doc.page_count):
            page = doc.load_page(page_index)
            pages.append({
                'page': page_index + 1,
                'width': float(page.rect.width),
                'height': float(page.rect.height),
                'image_url': f'/api/task/{task_id}/preview-page/{page_index + 1}',
            })
        doc.close()
        risks, page_count = _pdf_risk_highlights(file_path, risks)
        return jsonify({
            'mode': 'pdf',
            'filename': filename,
            'file_url': f'/uploads/{file_path.name}',
            'pages': pages,
            'risks': risks,
            'total_risks': len(risks),
            'page_count': page_count,
        })

    if ext in ('.doc', '.docx'):
        try:
            html = _doc_preview_html(file_path)
        except Exception as exc:
            return jsonify({'error': f'Word 预览生成失败：{exc}'}), 500
        return jsonify({
            'mode': 'word',
            'filename': filename,
            'file_url': f'/uploads/{file_path.name}',
            'html': html,
            'risks': risks,
            'total_risks': len(risks),
            'page_count': 1,
        })

    return preview_full_text(task_id)


@app.route('/api/task/<task_id>/preview-page/<int:page_number>')
def preview_pdf_page(task_id, page_number):
    if not ensure_task_loaded(task_id):
        return jsonify({'error': '任务不存在'}), 404

    task = tasks[task_id]
    input_path = task.get('input_path', '')
    file_path = Path(input_path) if input_path else None
    if not file_path or not file_path.exists() or file_path.suffix.lower() != '.pdf':
        return jsonify({'error': 'PDF 文件不存在'}), 404

    import fitz

    doc = fitz.open(str(file_path))
    if page_number < 1 or page_number > doc.page_count:
        doc.close()
        return jsonify({'error': '页码超出范围'}), 404

    cache_dir = OUTPUT_FOLDER / task_id / 'preview_pages'
    cache_dir.mkdir(parents=True, exist_ok=True)
    image_path = cache_dir / f'page-{page_number:04d}.png'
    if not image_path.exists():
        page = doc.load_page(page_number - 1)
        pix = page.get_pixmap(matrix=fitz.Matrix(1.8, 1.8), alpha=False)
        pix.save(str(image_path))
    doc.close()
    return send_file(image_path, mimetype='image/png')


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    """提供上传文件的静态访问"""
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route('/dev/result')
def dev_mock_result():
    """开发模式：用 test_output/demo_data 中的样例数据直接渲染结果页"""
    demo_dir = BASE_DIR / 'test_output' / 'demo_data'

    # 读取主报告
    report_path = demo_dir / 'report.json'
    report = json.loads(report_path.read_text(encoding='utf-8')) if report_path.exists() else {}

    # 统计风险
    risk_stats = {'高风险': 0, '中风险': 0, '建议优化': 0, '无': 0}
    for item in report.get('items', []):
        level = item.get('risk_level', '无')
        if level in risk_stats:
            risk_stats[level] += 1
    sorted_items = sorted(
        report.get('items', []),
        key=lambda x: get_risk_level_order(x.get('risk_level', '无')),
        reverse=True
    )

    # 读取其他专项包（供前端扩展展示用）
    extra = {}
    for key, filename in [
        ('remediation', 'remediation.json'),
        ('evidence', 'evidence.json'),
        ('sdk_pack', 'sdk_partner.json'),
        ('cross_border_pack', 'cross_border.json'),
        ('privacy_pack', 'privacy.json'),
    ]:
        p = demo_dir / filename
        extra[key] = json.loads(p.read_text(encoding='utf-8')) if p.exists() else None

    task = {
        'id': 'dev-mock',
        'document_name': report.get('document_name', 'Demo 文档'),
        'status': 'completed',
        'created_at': datetime.now().isoformat(),
        'result': {
            'report': str(report_path),
            'report_markdown': str(demo_dir / 'report.md'),
            'remediation': str(demo_dir / 'remediation.json'),
            'evidence': str(demo_dir / 'evidence.json'),
            'sdk_pack': str(demo_dir / 'sdk_partner.json'),
            'cross_border_pack': str(demo_dir / 'cross_border.json'),
            'privacy_pack': str(demo_dir / 'privacy.json'),
        }
    }
    tasks['dev-mock'] = task

    return render_template('result.html', task=task, report=report,
                          risk_stats=risk_stats, items=sorted_items, **extra)


if __name__ == '__main__':
    print("=" * 60)
    print("数据合规智能审查系统")
    print("=" * 60)
    PORT = 5577
    print(f"访问地址: http://127.0.0.1:{PORT}")
    print("按 Ctrl+C 停止服务")
    print("=" * 60)

    # 自动打开浏览器
    import webbrowser
    webbrowser.open(f'http://127.0.0.1:{PORT}')

    app.run(debug=True, port=PORT)
