#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import sqlite3
import sys
import textwrap
import zipfile
from datetime import datetime
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / "references" / "knowledge-base" / "local-regulations.sqlite3"

CODE_EXTENSIONS = {
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".go", ".php", ".rb", ".swift",
    ".kt", ".kts", ".c", ".cc", ".cpp", ".h", ".hpp", ".cs", ".rs", ".sh",
    ".bash", ".zsh", ".sql", ".html", ".css", ".json", ".yaml", ".yml", ".toml", ".env",
}

RISK_PRIORITY = {"高风险": "P1", "中风险": "P2", "建议优化": "P3", "无": "P3"}

REGULATION_HINTS = {
    "doc_disclosure": ["个人信息", "处理规则", "告知", "个人信息保护"],
    "doc_vague_scope": ["最小必要", "APP", "个人信息", "处理规则"],
    "doc_sensitive_pi": ["敏感个人信息", "单独同意", "儿童", "生物识别"],
    "doc_third_party": ["第三方", "共享", "委托处理", "SDK", "个人信息"],
    "doc_cross_border": ["出境", "跨境", "境外接收方", "标准合同", "安全认证"],
    "doc_retention": ["保存期限", "删除", "注销", "匿名化"],
    "doc_automated_decision": ["自动化决策", "画像", "个性化推荐", "营销推荐"],
    "doc_security": ["安全措施", "应急处置", "数据安全", "个人信息保护"],
    "code_secret_exposure": ["数据安全", "密钥", "访问控制", "安全管理"],
    "code_plain_http": ["数据传输", "加密", "数据接口", "安全要求"],
    "code_personal_info_notice": ["个人信息", "同意", "最小必要", "移动互联网应用"],
    "code_sensitive_logging": ["个人信息", "日志", "安全审计", "脱敏"],
    "code_local_retention": ["保存期限", "删除", "本地存储", "个人信息"],
    "code_injection_surface": ["网络安全", "注入", "访问控制", "数据泄露"],
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run offline data-compliance review and write JSON/Markdown reports.")
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--file", help="Input file path. Supports text/code/docx and PDF when pypdf is installed.")
    source.add_argument("--text", help="Raw input text.")
    source.add_argument("--text-file", help="Text file whose contents are reviewed.")
    parser.add_argument("--name", default="", help="Document/project name used in the report.")
    parser.add_argument("--review-type", choices=["auto", "document", "code"], default="auto")
    parser.add_argument("--output-dir", default="", help="Directory for report.json/report.md/remediation_tasks.json.")
    parser.add_argument("--db", default=str(DEFAULT_DB), help="Bundled or custom local regulation SQLite database.")
    parser.add_argument("--max-regulations", type=int, default=3, help="Supporting regulations per finding.")
    return parser.parse_args()


def read_text_best_effort(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".docx":
        return read_docx_text(path)
    if suffix == ".pdf":
        return read_pdf_text(path)
    data = path.read_bytes()
    for encoding in ("utf-8", "utf-8-sig", "gb18030", "latin-1"):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


def read_docx_text(path: Path) -> str:
    try:
        with zipfile.ZipFile(path) as zf:
            xml = zf.read("word/document.xml")
    except Exception as exc:
        raise SystemExit(f"Cannot read DOCX: {path} ({exc})")
    root = ElementTree.fromstring(xml)
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs: list[str] = []
    for para in root.findall(".//w:p", ns):
        texts = [node.text or "" for node in para.findall(".//w:t", ns)]
        text = "".join(texts).strip()
        if text:
            paragraphs.append(text)
    return "\n".join(paragraphs)


def read_pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader  # type: ignore
    except Exception as exc:
        raise SystemExit(f"PDF input requires pypdf. Install pypdf or provide extracted text. ({exc})")
    reader = PdfReader(str(path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def infer_review_type(path: Path | None, requested: str, text: str) -> str:
    if requested != "auto":
        return requested
    if path and path.suffix.lower() in CODE_EXTENSIONS:
        return "code"
    if re.search(r"\b(function|class|interface|const|let|var|import|def|public static|SELECT|INSERT|fetch\()\b", text):
        if re.search(r"[{};=]|\bconsole\.log\b|\blocalStorage\b", text):
            return "code"
    return "document"


def split_segments(text: str) -> list[dict]:
    raw_parts = re.split(r"\n\s*\n|(?<=[。！？；;])\s*", text)
    segments: list[dict] = []
    for idx, part in enumerate(raw_parts, start=1):
        cleaned = re.sub(r"\s+", " ", part).strip()
        if len(cleaned) < 8:
            continue
        segments.append({"index": len(segments) + 1, "text": cleaned[:1200], "source_index": idx})
    if not segments and text.strip():
        segments.append({"index": 1, "text": re.sub(r"\s+", " ", text.strip())[:1200], "source_index": 1})
    return segments


def evidence_for_lines(lines: list[str], line_no: int, radius: int = 1) -> str:
    start = max(1, line_no - radius)
    end = min(len(lines), line_no + radius)
    return "\n".join(f"{idx}: {lines[idx - 1]}" for idx in range(start, end + 1))


def add_item(items: list[dict], *, risk_point: str, risk_level: str, legal_basis: str, reason: str,
             suggestion: str, evidence: str, path_id: str, label: str, snippet: str,
             rewritten_clause: str = "", fix_snippet: str = "", segment_index: int = 0) -> None:
    items.append({
        "risk_point": risk_point,
        "risk_level": risk_level,
        "legal_basis": legal_basis,
        "reason": reason,
        "suggestion": suggestion,
        "rewritten_clause": rewritten_clause,
        "fix_snippet": fix_snippet,
        "evidence": [evidence] if evidence else [],
        "source_sections": [{
            "page": 1,
            "segment_index": segment_index,
            "label": label,
            "snippet": snippet,
        }],
        "path_ids": [path_id],
        "theme_name": "代码合规" if path_id.startswith("code_") else "数据合规",
    })


def code_fix_snippet(path_id: str) -> str:
    snippets = {
        "code_secret_exposure": """// Server side only
const serviceKey = mustGetEnv('SERVICE_API_KEY');

app.post('/api/short-lived-token', requireLogin, async (req, res) => {
  const token = await issueShortLivedToken({
    userId: req.user.id,
    scope: 'personal-data:write',
    ttlSeconds: 600,
  });
  res.json({ token });
});""",
        "code_plain_http": """const endpoint = new URL('/v1/profile', config.apiBaseUrl);
if (endpoint.protocol !== 'https:' && endpoint.hostname !== 'localhost') {
  throw new Error('Personal data endpoints must use HTTPS');
}
await fetch(endpoint, { method: 'POST', credentials: 'include', body: JSON.stringify(payload) });""",
        "code_personal_info_notice": """const allowed = await consentStore.hasConsent(userId, 'account_verification');
if (!allowed) {
  return { mode: 'basic', message: 'Skip personal-data collection until consent is granted' };
}
const payload = pickRequiredFields(formData, ['phone', 'identityVerified']);""",
        "code_sensitive_logging": """logger.info('profile_submit', {
  requestId,
  userId: hashId(userId),
  phoneLast4: maskLast4(profile.phone),
  hasIdCard: Boolean(profile.idCard),
});""",
        "code_local_retention": """await secureStore.set('session_ref', sessionRef, { ttlSeconds: 3600, encrypt: true });
async function clearPersonalDataOnLogout(userId) {
  await secureStore.removeMany([`profile:${userId}`, `contacts:${userId}`, `location:${userId}`]);
}""",
        "code_injection_surface": """const actionHandlers = { openProfile: renderProfile, exportReport: exportReportSafely };
const handler = actionHandlers[userInput.action];
if (!handler) throw new Error('Unsupported action');
container.textContent = sanitizeDisplayText(userProvidedText);""",
    }
    return snippets.get(path_id, "")


def analyze_code(text: str) -> list[dict]:
    lines = text.splitlines() or [""]
    items: list[dict] = []
    personal_terms = ("phone", "mobile", "手机号", "身份证", "idcard", "location", "gps", "lat", "lng",
                      "address", "email", "联系人", "contacts", "camera", "microphone", "face", "人脸")
    consent_terms = ("consent", "authorize", "permission", "privacy", "opt-in", "同意", "授权", "隐私")
    secret_patterns = [
        r"(?i)(api[_-]?key|secret|token|password|passwd|access[_-]?key)\s*[:=]\s*['\"][^'\"]{8,}['\"]",
        r"-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----",
    ]
    joined_lower = text.lower()
    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            continue
        for pattern in secret_patterns:
            if re.search(pattern, line):
                add_item(
                    items,
                    risk_point="疑似硬编码密钥或敏感凭证",
                    risk_level="高风险",
                    legal_basis="《数据安全法》第27条；《网络安全法》第21条",
                    reason="代码中出现疑似 API Key、Token、密码或私钥，进入客户端、仓库或日志后可能导致数据接口被越权调用。",
                    suggestion="将密钥迁移到服务端环境变量或安全密钥管理服务；客户端只调用后端代理接口；立即轮换已暴露凭证，并在 CI 中加入密钥扫描。",
                    rewritten_clause="改为从服务端环境变量读取，并通过后端授权接口下发短期令牌。",
                    fix_snippet=code_fix_snippet("code_secret_exposure"),
                    evidence=evidence_for_lines(lines, idx),
                    path_id="code_secret_exposure",
                    label=f"代码第 {idx} 行",
                    snippet=evidence_for_lines(lines, idx),
                    segment_index=idx,
                )
                break
        if "http://" in line and "localhost" not in line and "127.0.0.1" not in line:
            add_item(
                items,
                risk_point="接口或资源使用明文 HTTP",
                risk_level="中风险",
                legal_basis="《网络安全法》第21条；GB/T 35273 个人信息安全规范",
                reason="明文 HTTP 传输可能暴露个人信息、鉴权参数或业务数据。",
                suggestion="统一改为 HTTPS；对历史接口做跳转或拒绝；增加明文流量拦截策略。",
                rewritten_clause="将 URL 改为 https://，并在网络层拒绝非本地调试场景下的 http:// 请求。",
                fix_snippet=code_fix_snippet("code_plain_http"),
                evidence=evidence_for_lines(lines, idx),
                path_id="code_plain_http",
                label=f"代码第 {idx} 行",
                snippet=evidence_for_lines(lines, idx),
                segment_index=idx,
            )
        if any(term in stripped.lower() for term in personal_terms):
            window = "\n".join(lines[max(0, idx - 4): min(len(lines), idx + 4)]).lower()
            if not any(term in window or term in joined_lower[:1000] for term in consent_terms):
                add_item(
                    items,
                    risk_point="个人信息采集缺少就近授权或告知痕迹",
                    risk_level="中风险",
                    legal_basis="《个人信息保护法》第6条、第13条、第17条",
                    reason="代码疑似处理手机号、位置、设备、联系人、相机、麦克风、人脸等个人信息，但附近没有看到授权、告知或最小必要校验。",
                    suggestion="在调用采集能力前增加用途说明、授权状态检查和拒绝后的替代路径；仅在业务必要时采集。",
                    rewritten_clause="在调用前加入 consent/permission 检查；未授权时返回基础功能路径。",
                    fix_snippet=code_fix_snippet("code_personal_info_notice"),
                    evidence=evidence_for_lines(lines, idx),
                    path_id="code_personal_info_notice",
                    label=f"代码第 {idx} 行",
                    snippet=evidence_for_lines(lines, idx),
                    segment_index=idx,
                )
        if re.search(r"(?i)(console\.log|print\(|logger\.|log\.)", line) and any(term in stripped.lower() for term in personal_terms + ("token", "password", "secret")):
            add_item(
                items,
                risk_point="日志可能输出个人信息或敏感凭证",
                risk_level="高风险",
                legal_basis="《个人信息保护法》第51条；《数据安全法》第27条",
                reason="调试日志中出现个人信息或敏感凭证字段，可能进入本地日志、云日志或第三方监控系统。",
                suggestion="删除敏感字段日志；只保留脱敏后的最后四位、哈希或枚举状态；生产环境默认关闭调试日志。",
                rewritten_clause="使用 maskSensitive(value) 后再输出，或仅记录 request_id、状态码、字段是否存在。",
                fix_snippet=code_fix_snippet("code_sensitive_logging"),
                evidence=evidence_for_lines(lines, idx),
                path_id="code_sensitive_logging",
                label=f"代码第 {idx} 行",
                snippet=evidence_for_lines(lines, idx),
                segment_index=idx,
            )
        if re.search(r"(?i)(localStorage|UserDefaults|SharedPreferences|NSUserDefaults|sqlite|writeFile|fs\.writeFile)", line) and any(term in stripped.lower() for term in personal_terms + ("token", "password", "secret")):
            add_item(
                items,
                risk_point="本地持久化可能保存敏感数据",
                risk_level="中风险",
                legal_basis="《个人信息保护法》第51条；GB/T 35273 个人信息安全规范",
                reason="代码疑似把个人信息或令牌写入本地存储，若未加密、未设置过期或未提供删除机制，会扩大泄露面。",
                suggestion="改用系统安全存储或加密数据库；设置最短保存期限；退出登录、撤回授权或账号注销时同步清理。",
                rewritten_clause="敏感字段只存短期会话标识；必要持久化数据使用 Keychain/Keystore 或加密存储。",
                fix_snippet=code_fix_snippet("code_local_retention"),
                evidence=evidence_for_lines(lines, idx),
                path_id="code_local_retention",
                label=f"代码第 {idx} 行",
                snippet=evidence_for_lines(lines, idx),
                segment_index=idx,
            )
        if re.search(r"(?i)(eval\(|exec\(|new Function|innerHTML\s*=|dangerouslySetInnerHTML)", line):
            add_item(
                items,
                risk_point="动态执行或不安全渲染可能放大数据泄露风险",
                risk_level="中风险",
                legal_basis="《网络安全法》第21条；《数据安全法》第27条",
                reason="动态执行代码或直接渲染未净化内容可能造成脚本注入，进而读取页面中的个人信息或会话令牌。",
                suggestion="移除动态执行；对富文本使用可信白名单净化；避免把敏感数据放在可被脚本读取的上下文。",
                rewritten_clause="改为显式函数映射或安全模板渲染；渲染前使用 sanitizeHtml 白名单处理。",
                fix_snippet=code_fix_snippet("code_injection_surface"),
                evidence=evidence_for_lines(lines, idx),
                path_id="code_injection_surface",
                label=f"代码第 {idx} 行",
                snippet=evidence_for_lines(lines, idx),
                segment_index=idx,
            )
    return dedupe_items(items)


def analyze_document(text: str) -> list[dict]:
    segments = split_segments(text)
    items: list[dict] = []
    whole = text
    has_personal = any(k in whole for k in ("个人信息", "个人数据", "手机号", "身份证", "位置", "设备信息", "通讯录"))

    for seg in segments:
        s = seg["text"]
        idx = seg["index"]
        label = f"第 {idx} 段"
        if has_personal and any(k in s for k in ("收集", "使用", "处理", "提供")) and not all(k in s for k in ("目的", "方式")):
            add_item(
                items,
                risk_point="个人信息处理规则告知不完整",
                risk_level="高风险",
                legal_basis="《个人信息保护法》第17条",
                reason="涉及个人信息处理，但未同时清晰说明处理目的、处理方式、个人信息种类或保存期限等核心告知要素。",
                suggestion="补充处理目的、处理方式、个人信息种类、保存期限、处理者名称和联系方式，并保持与实际数据流一致。",
                rewritten_clause="建议改为：我们为实现明确列明的业务目的处理必要个人信息，并在本政策中逐项说明信息种类、使用方式、保存期限和权利行使渠道。",
                evidence=s,
                path_id="doc_disclosure",
                label=label,
                snippet=s,
                segment_index=idx,
            )
        if re.search(r"(包括但不限于|等信息|相关信息|必要时|可能会|业务需要)", s):
            add_item(
                items,
                risk_point="个人信息范围或处理目的表述过宽",
                risk_level="中风险",
                legal_basis="《个人信息保护法》第6条",
                reason="存在兜底或模糊表述，可能无法证明处理个人信息的最小必要性和目的限定。",
                suggestion="删除兜底词，改为列举具体字段、触发场景、使用目的和拒绝后的影响。",
                rewritten_clause="建议改为：仅在用户使用具体功能时收集列明字段；未列明字段不作采集。",
                evidence=s,
                path_id="doc_vague_scope",
                label=label,
                snippet=s,
                segment_index=idx,
            )
        if any(k in s for k in ("身份证", "精确位置", "行踪轨迹", "生物识别", "人脸", "儿童", "未成年人", "通讯录", "录音", "摄像头")) and "单独同意" not in s:
            add_item(
                items,
                risk_point="敏感个人信息处理缺少单独同意或必要性说明",
                risk_level="高风险",
                legal_basis="《个人信息保护法》第28条、第29条、第30条",
                reason="文本涉及敏感个人信息，但未明确处理必要性、对个人权益影响或单独同意机制。",
                suggestion="逐项说明敏感个人信息的必要性、影响、保存期限和单独同意入口；非必要时提供替代方案。",
                rewritten_clause="建议改为：仅在用户主动使用相关功能并单独同意后处理该类敏感个人信息。",
                evidence=s,
                path_id="doc_sensitive_pi",
                label=label,
                snippet=s,
                segment_index=idx,
            )
        if any(k in s for k in ("第三方", "合作伙伴", "SDK", "共享", "委托处理", "对外提供")) and not any(k in s for k in ("名称", "联系方式", "处理目的", "信息种类")):
            add_item(
                items,
                risk_point="第三方共享或委托处理告知不足",
                risk_level="高风险",
                legal_basis="《个人信息保护法》第23条、第21条",
                reason="涉及第三方、SDK、共享或委托处理，但缺少接收方名称、联系方式、处理目的、处理方式或个人信息种类。",
                suggestion="列出第三方清单、SDK 名称、共享字段、使用目的、处理方式和退出路径；对外提供个人信息时取得单独同意。",
                rewritten_clause="建议改为：我们仅向清单列明的接收方提供完成该功能所必需的字段，并展示接收方名称、联系方式和处理目的。",
                evidence=s,
                path_id="doc_third_party",
                label=label,
                snippet=s,
                segment_index=idx,
            )
        if any(k in s for k in ("境外", "跨境", "出境", "海外", "境外接收方")) and not any(k in s for k in ("境外接收方", "联系方式", "标准合同", "安全评估", "安全认证")):
            add_item(
                items,
                risk_point="个人信息出境告知或合规路径不足",
                risk_level="高风险",
                legal_basis="《个人信息保护法》第38条、第39条",
                reason="涉及跨境或境外接收方，但缺少接收方、联系方式、处理目的、处理方式、个人信息种类或出境合规路径。",
                suggestion="补充境外接收方信息、出境字段、处理目的、权利行使方式，并说明安全评估、标准合同或认证路径。",
                rewritten_clause="建议改为：仅在满足法定出境条件并向用户单独告知后，向列明的境外接收方提供必要信息。",
                evidence=s,
                path_id="doc_cross_border",
                label=label,
                snippet=s,
                segment_index=idx,
            )
        if any(k in s for k in ("保存", "留存", "删除", "注销", "匿名化")) and not any(k in s for k in ("期限", "最短", "到期", "立即")):
            add_item(
                items,
                risk_point="保存期限或删除机制不明确",
                risk_level="中风险",
                legal_basis="《个人信息保护法》第19条、第47条",
                reason="涉及保存、删除或注销，但未明确具体保存期限、到期处理方式或删除条件。",
                suggestion="按数据类型列出保存期限和删除触发条件；账号注销、撤回同意或目的达成后及时删除或匿名化。",
                rewritten_clause="建议改为：各类个人信息仅保存至实现处理目的所必需的最短期间；到期后删除或匿名化。",
                evidence=s,
                path_id="doc_retention",
                label=label,
                snippet=s,
                segment_index=idx,
            )
        if any(k in s for k in ("自动化决策", "画像", "个性化推荐", "精准营销", "算法推荐")) and not any(k in s for k in ("关闭", "拒绝", "便捷", "不针对")):
            add_item(
                items,
                risk_point="自动化决策或画像缺少退出机制",
                risk_level="中风险",
                legal_basis="《个人信息保护法》第24条",
                reason="涉及画像、个性化推荐或自动化决策，但未明确提供便捷拒绝、关闭或不针对个人特征推送的机制。",
                suggestion="提供显著、便捷的关闭入口；说明自动化决策逻辑概要和对用户权益的影响。",
                rewritten_clause="建议改为：用户可在设置中关闭个性化推荐，关闭后我们不再基于个人特征进行定向推送。",
                evidence=s,
                path_id="doc_automated_decision",
                label=label,
                snippet=s,
                segment_index=idx,
            )
        if any(k in s for k in ("安全措施", "加密", "访问控制", "泄露", "安全事件")) and not any(k in s for k in ("应急", "通知", "补救", "负责人")):
            add_item(
                items,
                risk_point="安全措施或事件响应描述不足",
                risk_level="建议优化",
                legal_basis="《个人信息保护法》第51条、第57条；《数据安全法》第27条",
                reason="文本提到安全措施或安全事件，但未说明事件响应、通知、补救或责任机制。",
                suggestion="补充访问控制、加密、审计、最小权限、事件响应、用户通知和补救措施。",
                rewritten_clause="建议改为：发生或可能发生个人信息泄露、篡改、丢失时，我们将立即采取补救措施并依法通知用户和主管部门。",
                evidence=s,
                path_id="doc_security",
                label=label,
                snippet=s,
                segment_index=idx,
            )
    return dedupe_items(items)


def dedupe_items(items: list[dict]) -> list[dict]:
    seen: set[tuple[str, int]] = set()
    result: list[dict] = []
    for item in items:
        section = (item.get("source_sections") or [{}])[0]
        key = (item.get("risk_point", ""), int(section.get("segment_index") or 0))
        if key in seen:
            continue
        seen.add(key)
        result.append(item)
    return result


def derive_keywords(item: dict) -> list[str]:
    keywords: list[str] = []
    for path_id in item.get("path_ids", []) or []:
        keywords.extend(REGULATION_HINTS.get(path_id, []))
    combined = " ".join([
        item.get("risk_point", ""),
        item.get("legal_basis", ""),
        item.get("reason", ""),
        item.get("suggestion", ""),
        " ".join(item.get("evidence", []) or []),
    ])
    for keyword in ("个人信息", "敏感个人信息", "跨境", "出境", "第三方", "SDK", "最小必要", "自动化决策", "保存期限", "删除", "数据安全", "APP"):
        if keyword in combined:
            keywords.append(keyword)
    result: list[str] = []
    seen: set[str] = set()
    for keyword in keywords:
        if keyword and keyword not in seen:
            seen.add(keyword)
            result.append(keyword)
    return result[:8]


def extract_clause_refs(text: str) -> list[str]:
    return list(dict.fromkeys(re.findall(r"第[一二三四五六七八九十百千万零两0-9]+条(?:第[一二三四五六七八九十百千万零两0-9]+款)?", text or "")))[:3]


def search_supporting_regulations(db_path: Path, item: dict, limit: int) -> list[dict]:
    if not db_path.exists():
        return []
    keywords = derive_keywords(item)
    if not keywords:
        return []
    clauses = []
    params: list[str] = []
    for kw in keywords:
        like = f"%{kw}%"
        clauses.append("(r.title LIKE ? OR r.standard_code LIKE ? OR c.chunk_text LIKE ?)")
        params.extend([like, like, like])
    query = f"""
        SELECT r.title, r.standard_code, r.doc_category, r.effect_level, r.region,
               r.relative_path, r.is_draft, c.chunk_text
        FROM regulation_chunks c
        JOIN regulations r ON r.id = c.regulation_id
        WHERE {" OR ".join(clauses)}
        LIMIT 120
    """
    try:
        conn = sqlite3.connect(str(db_path))
        rows = conn.execute(query, params).fetchall()
        total_docs = conn.execute("SELECT COUNT(*) FROM regulations").fetchone()[0]
        conn.close()
    except sqlite3.Error:
        return []

    scored: list[tuple[int, tuple]] = []
    for row in rows:
        title, code, category, effect, region, rel_path, is_draft, chunk = row
        score = 0
        matched = []
        haystacks = [title or "", code or "", chunk or ""]
        for kw in keywords:
            if any(kw in h for h in haystacks):
                matched.append(kw)
                score += 8 if kw in (title or "") else 4
                if kw in (code or ""):
                    score += 8
        if category == "standard_or_guideline":
            score += 4
        elif category == "national_policy":
            score += 3
        if is_draft:
            score -= 3
        if code:
            score += 2
        if score > 0:
            scored.append((score, row + (tuple(dict.fromkeys(matched)), total_docs)))
    scored.sort(key=lambda pair: pair[0], reverse=True)

    results: list[dict] = []
    used_titles: set[str] = set()
    for _, row in scored:
        title, code, category, effect, region, rel_path, is_draft, chunk, matched, total_docs = row
        if title in used_titles:
            continue
        used_titles.add(title)
        snippet = build_regulation_snippet(chunk or "", list(matched))
        results.append({
            "title": title,
            "standard_code": code,
            "doc_category": category,
            "effect_level": effect,
            "region": region,
            "relative_path": rel_path,
            "is_draft": bool(is_draft),
            "match_keywords": list(matched),
            "clause_references": extract_clause_refs(snippet),
            "snippet": snippet,
            "database_total_documents": total_docs,
        })
        if len(results) >= limit:
            break
    return results


def build_regulation_snippet(chunk: str, keywords: list[str], max_chars: int = 180) -> str:
    text = re.sub(r"\s+", " ", chunk or "").strip()
    if not text:
        return ""
    for kw in keywords:
        pos = text.find(kw)
        if pos >= 0:
            start = max(0, pos - 50)
            end = min(len(text), pos + max_chars)
            return text[start:end]
    return text[:max_chars]


def enrich_items(items: list[dict], db_path: Path, max_regs: int) -> tuple[list[dict], dict]:
    matched = 0
    for item in items:
        regs = search_supporting_regulations(db_path, item, max_regs)
        item["supporting_regulations"] = regs
        if regs:
            matched += 1
    total = 0
    if db_path.exists():
        try:
            conn = sqlite3.connect(str(db_path))
            total = conn.execute("SELECT COUNT(*) FROM regulations").fetchone()[0]
            conn.close()
        except sqlite3.Error:
            total = 0
    return items, {
        "enabled": db_path.exists(),
        "db_path": str(db_path),
        "matched_items": matched,
        "unmatched_items": max(0, len(items) - matched),
        "total_documents": total,
    }


def build_report(name: str, review_type: str, text: str, items: list[dict], db_status: dict) -> dict:
    stats = {"total": len(items), "high_risk": 0, "medium_risk": 0, "advisory": 0, "none": 0}
    for item in items:
        level = item.get("risk_level")
        if level == "高风险":
            stats["high_risk"] += 1
        elif level == "中风险":
            stats["medium_risk"] += 1
        elif level == "建议优化":
            stats["advisory"] += 1
        else:
            stats["none"] += 1
    if not items:
        items = [{
            "risk_point": "未发现明显合规风险",
            "risk_level": "无",
            "legal_basis": "规则审查未命中高风险项",
            "reason": "本次输入未触发内置规则。仍建议结合真实数据流、权限申请、接口文档和业务场景人工复核。",
            "suggestion": "保留审查记录，并在上线前补充数据流图、权限清单、第三方 SDK 清单和保留期限说明。",
            "evidence": [],
            "source_sections": [],
            "path_ids": ["no_obvious_risk"],
            "theme_name": "数据合规",
            "supporting_regulations": [],
        }]
        stats = {"total": 1, "high_risk": 0, "medium_risk": 0, "advisory": 0, "none": 1}
    summary = f"共发现 {stats['total']} 项合规关注点，其中高风险 {stats['high_risk']} 项、中风险 {stats['medium_risk']} 项、建议优化 {stats['advisory']} 项。"
    return {
        "schema_version": "data-compliance-reviewer.skill.v1",
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "document_name": name,
        "review_type": review_type,
        "review_scope": "代码层数据合规风险审查" if review_type == "code" else "个人信息与数据合规文本审查",
        "input_sha256": hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest(),
        "input_length": len(text),
        "summary": summary,
        "stats": stats,
        "local_regulation_db": db_status,
        "items": items,
        "disclaimer": "本报告用于辅助合规审查，不替代律师或法务最终判断。",
    }


def build_remediation_tasks(report: dict) -> dict:
    counts = {"P1": 0, "P2": 0, "P3": 0}
    tasks = []
    for item in report.get("items", []):
        if item.get("risk_level") == "无":
            continue
        priority = RISK_PRIORITY.get(item.get("risk_level"), "P3")
        counts[priority] += 1
        section = (item.get("source_sections") or [{}])[0]
        tasks.append({
            "priority": priority,
            "title": item.get("risk_point"),
            "owner_hint": section.get("label", ""),
            "objective": item.get("suggestion"),
            "implementation_hint": item.get("fix_snippet") or item.get("rewritten_clause", ""),
            "legal_basis": item.get("legal_basis", ""),
        })
    return {"document_name": report.get("document_name"), "priority_counts": counts, "tasks": tasks}


def render_markdown(report: dict, remediation: dict) -> str:
    lines = [
        f"# {report.get('document_name')} 合规审查报告",
        "",
        "## 基本信息",
        f"- 生成时间：{report.get('generated_at')}",
        f"- 审查类型：{report.get('review_type')}",
        f"- 审查范围：{report.get('review_scope')}",
        f"- 输入 SHA256：`{report.get('input_sha256')}`",
        "",
        "## 审查结论摘要",
        report.get("summary", ""),
        "",
    ]
    stats = report.get("stats", {})
    lines.extend([
        "## 风险统计",
        f"- 总项数：{stats.get('total', 0)}",
        f"- 高风险：{stats.get('high_risk', 0)}",
        f"- 中风险：{stats.get('medium_risk', 0)}",
        f"- 建议优化：{stats.get('advisory', 0)}",
        "",
    ])
    db = report.get("local_regulation_db", {})
    lines.extend([
        "## 法规库增强",
        f"- 状态：{'已启用' if db.get('enabled') else '未启用'}",
        f"- 命中项数：{db.get('matched_items', 0)}",
        f"- 未命中项数：{db.get('unmatched_items', 0)}",
        f"- 可检索规范数：{db.get('total_documents', 0)}",
        "",
        "## 风险明细",
    ])
    for idx, item in enumerate(report.get("items", []), start=1):
        lines.extend([
            f"### {idx}. [{item.get('risk_level')}] {item.get('risk_point')}",
            f"- 风险主题：{item.get('theme_name', '')}",
            f"- 法规依据：{item.get('legal_basis', '')}",
            f"- 风险原因：{item.get('reason', '')}",
            f"- 修改建议：{item.get('suggestion', '')}",
        ])
        if item.get("rewritten_clause"):
            lines.append(f"- 建议表述/实现：{item.get('rewritten_clause')}")
        if item.get("fix_snippet"):
            lines.extend(["", "```ts", item.get("fix_snippet", ""), "```"])
        sections = item.get("source_sections") or []
        if sections:
            lines.append("- 定位证据：")
            for section in sections[:2]:
                lines.append(f"  - {section.get('label', '')}：{section.get('snippet', '')}")
        regs = item.get("supporting_regulations") or []
        if regs:
            lines.append("- 补充规范索引：")
            for reg in regs:
                header = " ".join(x for x in [reg.get("standard_code") or "", reg.get("title") or ""] if x).strip()
                clauses = "、".join(reg.get("clause_references") or [])
                suffix = f"（{clauses}）" if clauses else ""
                lines.append(f"  - {header}{suffix}")
                if reg.get("snippet"):
                    lines.append(f"    - 片段：{reg.get('snippet')}")
        lines.append("")
    lines.extend([
        "## 整改任务",
        f"- P1：{remediation.get('priority_counts', {}).get('P1', 0)}",
        f"- P2：{remediation.get('priority_counts', {}).get('P2', 0)}",
        f"- P3：{remediation.get('priority_counts', {}).get('P3', 0)}",
        "",
    ])
    for task in remediation.get("tasks", []):
        lines.extend([
            f"### [{task.get('priority')}] {task.get('title')}",
            f"- 定位：{task.get('owner_hint', '')}",
            f"- 目标：{task.get('objective', '')}",
            f"- 实现提示：{task.get('implementation_hint', '')}",
            "",
        ])
    lines.extend(["## 说明", f"- {report.get('disclaimer')}"])
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    args = parse_args()
    input_path: Path | None = None
    if args.file:
        input_path = Path(args.file).expanduser().resolve()
        text = read_text_best_effort(input_path)
        default_name = input_path.stem
    elif args.text_file:
        input_path = Path(args.text_file).expanduser().resolve()
        text = read_text_best_effort(input_path)
        default_name = input_path.stem
    else:
        text = args.text or ""
        default_name = "未命名输入"
    text = text.strip()
    if not text:
        raise SystemExit("Input is empty.")

    review_type = infer_review_type(input_path, args.review_type, text)
    name = args.name.strip() or default_name
    out_dir = Path(args.output_dir).expanduser().resolve() if args.output_dir else Path.cwd() / f"compliance-review-output-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    out_dir.mkdir(parents=True, exist_ok=True)
    db_path = Path(args.db).expanduser().resolve()

    items = analyze_code(text) if review_type == "code" else analyze_document(text)
    items, db_status = enrich_items(items, db_path, args.max_regulations)
    report = build_report(name, review_type, text, items, db_status)
    remediation = build_remediation_tasks(report)

    report_json = out_dir / "report.json"
    report_md = out_dir / "report.md"
    remediation_json = out_dir / "remediation_tasks.json"
    report_json.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    remediation_json.write_text(json.dumps(remediation, ensure_ascii=False, indent=2), encoding="utf-8")
    report_md.write_text(render_markdown(report, remediation), encoding="utf-8")

    print(json.dumps({
        "ok": True,
        "review_type": review_type,
        "output_dir": str(out_dir),
        "report_json": str(report_json),
        "report_markdown": str(report_md),
        "remediation_tasks": str(remediation_json),
        "risk_count": report["stats"]["total"],
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
