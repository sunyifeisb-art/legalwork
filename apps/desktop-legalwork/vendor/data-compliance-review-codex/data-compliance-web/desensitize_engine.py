from __future__ import annotations

import csv
import importlib.util
import json
import re
import shutil
import subprocess
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from docx import Document

try:
    from scripts.ocr_text import (
        OcrUnavailable,
        ensure_ocr_available,
        extract_pdf_ocr_text,
        ocr_image_to_data,
    )
except ModuleNotFoundError:  # Allows importing as web.desensitize_engine in checks.
    from web.scripts.ocr_text import (
        OcrUnavailable,
        ensure_ocr_available,
        extract_pdf_ocr_text,
        ocr_image_to_data,
    )

try:
    from pptx import Presentation
except Exception:  # pragma: no cover - optional dependency
    Presentation = None

try:
    import fitz  # PyMuPDF
except Exception:  # pragma: no cover - optional dependency
    fitz = None

try:
    import pandas as pd
except Exception:  # pragma: no cover - optional dependency
    pd = None

try:
    from PIL import Image, ImageDraw
except Exception:  # pragma: no cover - optional dependency
    Image = None
    ImageDraw = None

try:
    from presidio_analyzer import AnalyzerEngine
except Exception:  # pragma: no cover - optional dependency
    AnalyzerEngine = None


def _ensure_redaction_in_path() -> None:
    """将 legalwork 根目录加入 sys.path，以便导入 redaction 包。"""
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / 'redaction' / '__init__.py').exists():
            parent_str = str(parent)
            if parent_str not in sys.path:
                sys.path.insert(0, parent_str)
            break


_ensure_redaction_in_path()

try:
    from redaction.detector import RedactionDetector

    REDACTION_AVAILABLE = True
except Exception as _redaction_import_error:  # pragma: no cover - optional dependency
    RedactionDetector = None  # type: ignore[misc, assignment]
    REDACTION_AVAILABLE = False

LEGAL_SUBJECT_TYPES = ['person_name', 'company_name']


@dataclass(frozen=True)
class SubjectMapping:
    entity_type: str
    original: str
    redacted: str
    location: str
    confidence: float

    def to_dict(self) -> dict[str, Any]:
        return {
            'entity_type': self.entity_type,
            'original': self.original,
            'redacted': self.redacted,
            'location': self.location,
            'confidence': round(self.confidence, 3),
        }


TEXT_EXTENSIONS = {
    '.txt',
    '.md',
    '.markdown',
    '.log',
    '.rtf',
    '.html',
    '.htm',
    '.xml',
    '.yaml',
    '.yml',
    '.toml',
    '.ini',
    '.cfg',
    '.conf',
    '.env',
}
DOC_EXTENSIONS = {'.docx', '.doc'}
PDF_EXTENSIONS = {'.pdf'}
TABLE_EXTENSIONS = {'.csv', '.tsv', '.xlsx', '.xls', '.ods'}
JSON_EXTENSIONS = {'.json', '.jsonl', '.ndjson'}
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff'}
PRESENTATION_EXTENSIONS = {'.pptx'}


@dataclass(frozen=True)
class Finding:
    entity_type: str
    start: int
    end: int
    score: float
    replacement: str
    surface: str
    locator: str
    preview: str

    def to_dict(self) -> dict[str, Any]:
        return {
            'entity_type': self.entity_type,
            'start': self.start,
            'end': self.end,
            'score': round(self.score, 3),
            'replacement': self.replacement,
            'surface': self.surface,
            'locator': self.locator,
            'preview': self.preview,
        }


def redact_legal_subjects(
    text: str,
    locator: str = '',
    *,
    cluster_counters: dict[str, int] | None = None,
) -> tuple[str, list[SubjectMapping]]:
    """识别并替换法律主体（自然人、公司），返回替换后文本与可逆映射表。"""
    if not REDACTION_AVAILABLE or not text or not text.strip():
        return text, []

    detector = RedactionDetector()
    entities = detector.detect(text, entity_types=LEGAL_SUBJECT_TYPES)
    if not entities:
        return text, []

    # Filter out low-confidence company/organization matches where the text only
    # ends with a broad suffix like "区" / "中心" without a concrete institution word.
    concrete_institution_words = {
        '公司', '集团', '企业', '事务所', '银行', '政府', '委员会',
        '协会', '学会', '研究院', '管理局', '监管局', '人民法院',
        '人民检察院', '仲裁委员会', '公证处', '公安局',
    }
    filtered_entities: list[Any] = []
    for entity in entities:
        entity_type = getattr(entity, 'entity_type', '')
        original = getattr(entity, 'text', '')
        if entity_type == 'company_name' and not any(word in original for word in concrete_institution_words):
            continue
        filtered_entities.append(entity)
    entities = filtered_entities

    # 按实体文本聚类，保证同一主体对应同一 token
    clusters: dict[str, dict[str, Any]] = {}
    counters = cluster_counters if cluster_counters is not None else {'person_name': 0, 'company_name': 0}
    token_labels = {
        'person_name': ['当事人甲', '当事人乙', '当事人丙', '当事人丁', '当事人戊', '当事人己', '当事人庚', '当事人辛', '当事人壬', '当事人癸'],
        'company_name': ['A公司', 'B公司', 'C公司', 'D公司', 'E公司', 'F公司', 'G公司', 'H公司', 'I公司', 'J公司'],
    }

    for entity in entities:
        entity_type = getattr(entity, 'entity_type', '')
        original = getattr(entity, 'text', '')
        if entity_type not in token_labels or not original:
            continue
        if original not in clusters:
            counters[entity_type] = counters.get(entity_type, 0) + 1
            label_index = counters[entity_type] - 1
            if label_index < len(token_labels[entity_type]):
                token = token_labels[entity_type][label_index]
            else:
                token = f'{token_labels[entity_type][-1].replace("公司", "").replace("当事人", "")}_{counters[entity_type]}'
                if entity_type == 'company_name':
                    token = f'{token}公司'
                else:
                    token = f'当事人{token}'
            clusters[original] = {
                'entity_type': entity_type,
                'token': token,
            }

    if not clusters:
        return text, []

    # 从后向前替换，避免位置偏移
    sorted_entities = sorted(
        entities,
        key=lambda e: (getattr(e, 'start', 0), getattr(e, 'end', 0)),
        reverse=True,
    )
    redacted_text = text
    subject_mappings: list[SubjectMapping] = []
    seen: set[tuple[int, int]] = set()

    for entity in sorted_entities:
        start = getattr(entity, 'start', 0)
        end = getattr(entity, 'end', 0)
        original = getattr(entity, 'text', '')
        entity_type = getattr(entity, 'entity_type', '')
        if start < 0 or end > len(text) or end <= start:
            continue
        if (start, end) in seen:
            continue
        # 跳过与已处理区域重叠的项
        if any((start < existing_end and end > existing_start) for existing_start, existing_end in seen):
            continue
        seen.add((start, end))
        if original not in clusters:
            continue
        token = clusters[original]['token']
        redacted_text = redacted_text[:start] + token + redacted_text[end:]
        subject_mappings.append(SubjectMapping(
            entity_type=entity_type,
            original=original,
            redacted=token,
            location=locator,
            confidence=float(getattr(entity, 'confidence', 0.0)),
        ))

    return redacted_text, subject_mappings


def sanitize_text_and_subjects(
    text: str,
    engine: Desensitizer,
    *,
    surface: str = 'text',
    locator: str = '',
) -> tuple[str, list[Finding], list[SubjectMapping]]:
    """先执行隐私信息脱敏，再对法律主体进行可逆替换。"""
    sanitized, findings = engine.sanitize_text(text, surface=surface, locator=locator)
    redacted, subject_mappings = redact_legal_subjects(sanitized, locator=locator)
    return redacted, findings, subject_mappings


REGEX_RULES: list[tuple[str, re.Pattern[str], float]] = [
    (
        'EMAIL_ADDRESS',
        re.compile(r'(?<![\w.+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?![\w.-])'),
        0.95,
    ),
    (
        'PHONE_NUMBER',
        re.compile(r'(?<!\d)(?:\+?86[-\s]?)?1[3-9]\d[-\s]?\d{4}[-\s]?\d{4}(?!\d)'),
        0.96,
    ),
    (
        'ID_CARD',
        re.compile(r'(?<![0-9A-Za-z])\d{6}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx](?![0-9A-Za-z])'),
        0.96,
    ),
    (
        'BANK_CARD',
        re.compile(r'(?<!\d)\d(?:[ -]?\d){14,18}(?!\d)'),
        0.8,
    ),
    (
        'IP_ADDRESS',
        re.compile(r'(?<!\d)(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}(?!\d)'),
        0.9,
    ),
    (
        'API_KEY',
        re.compile(r'(?i)\b(?:api[_-]?key|secret|token|password|passwd|access[_-]?key)\s*[:=]\s*[\'"][^\'"]{8,}[\'"]'),
        0.9,
    ),
    (
        'PRIVATE_KEY',
        re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH |)?PRIVATE KEY-----[\s\S]+?-----END (?:RSA |EC |OPENSSH |)?PRIVATE KEY-----'),
        0.99,
    ),
    (
        'ADDRESS',
        re.compile(r'(?:[\u4e00-\u9fa5]{2,}(?:省|自治区|市|区|县|镇|乡|街道)[\u4e00-\u9fa5A-Za-z0-9\-]{0,24})|(?:[\u4e00-\u9fa5]{2,}(?:路|街|巷|弄)\d*号?[\u4e00-\u9fa5A-Za-z0-9\-]{0,12})'),
        0.72,
    ),
]

PRESIDIO_ENTITY_MAP = {
    'EMAIL_ADDRESS': 'EMAIL_ADDRESS',
    'PHONE_NUMBER': 'PHONE_NUMBER',
    'CREDIT_CARD': 'BANK_CARD',
    'IP_ADDRESS': 'IP_ADDRESS',
    'PERSON': 'PERSON',
    'LOCATION': 'ADDRESS',
    'US_SSN': 'ID_NUMBER',
    'IBAN_CODE': 'BANK_CARD',
    'CRYPTO': 'API_KEY',
}


class Desensitizer:
    def __init__(self) -> None:
        self._analyzer: Any | None = None
        self.presidio_available = False
        if AnalyzerEngine is not None and importlib.util.find_spec('en_core_web_sm') is not None:
            try:
                self._analyzer = AnalyzerEngine()
                self.presidio_available = True
            except Exception:
                self._analyzer = None

    def sanitize_text(self, text: str, *, surface: str = 'text', locator: str = '') -> tuple[str, list[Finding]]:
        findings = self._detect(text, surface=surface, locator=locator)
        sanitized = replace_spans(text, findings)
        return sanitized, findings

    def _detect(self, text: str, *, surface: str, locator: str) -> list[Finding]:
        findings: list[Finding] = []
        for entity_type, pattern, score in REGEX_RULES:
            for match in pattern.finditer(text):
                value = match.group(0)
                if entity_type == 'BANK_CARD' and len(re.sub(r'\D', '', value)) < 15:
                    continue
                if entity_type == 'BANK_CARD' and looks_like_id_card(value):
                    continue
                findings.append(make_finding(entity_type, match.start(), match.end(), score, surface, locator, value))

        if self._analyzer is not None and text.strip():
            try:
                for result in self._analyzer.analyze(text=text[:100_000], language='en'):
                    entity_type = PRESIDIO_ENTITY_MAP.get(result.entity_type, result.entity_type)
                    value = text[result.start:result.end]
                    findings.append(
                        make_finding(
                            entity_type,
                            result.start,
                            result.end,
                            float(result.score),
                            surface,
                            locator,
                            value,
                        )
                    )
            except Exception:
                pass

        return dedupe_findings(findings)


def make_finding(
    entity_type: str,
    start: int,
    end: int,
    score: float,
    surface: str,
    locator: str,
    value: str,
) -> Finding:
    return Finding(
        entity_type=entity_type,
        start=start,
        end=end,
        score=score,
        replacement=desensitize_value(entity_type, value),
        surface=surface,
        locator=locator,
        preview=mask_preview(value),
    )


def dedupe_findings(findings: list[Finding]) -> list[Finding]:
    ordered = sorted(findings, key=lambda item: (item.start, -(item.end - item.start), -item.score))
    kept: list[Finding] = []
    for finding in ordered:
        if any(not (finding.end <= current.start or finding.start >= current.end) for current in kept):
            continue
        kept.append(finding)
    return sorted(kept, key=lambda item: item.start)


def replace_spans(text: str, findings: list[Finding]) -> str:
    output: list[str] = []
    cursor = 0
    for finding in sorted(findings, key=lambda item: item.start):
        if finding.start < cursor:
            continue
        output.append(text[cursor:finding.start])
        output.append(finding.replacement)
        cursor = finding.end
    output.append(text[cursor:])
    return ''.join(output)


def desensitize_value(entity_type: str, value: str) -> str:
    compact = re.sub(r'\s+', '', value)
    if entity_type == 'PHONE_NUMBER':
        digits = re.sub(r'\D', '', value)
        if digits.startswith('86') and len(digits) == 13:
            digits = digits[2:]
        if len(digits) >= 7:
            return f'{digits[:3]}****{digits[-4:]}'
        return mask_middle(compact, left=2, right=2)

    if entity_type == 'EMAIL_ADDRESS' and '@' in value:
        local, domain = value.split('@', 1)
        visible = local[:2] if len(local) > 2 else local[:1]
        return f'{visible}***@{domain}'

    if entity_type in {'ID_CARD', 'ID_NUMBER'}:
        return mask_middle(compact, left=3, right=4)

    if entity_type == 'BANK_CARD':
        digits = re.sub(r'\D', '', value)
        return mask_middle(digits, left=6, right=4)

    if entity_type == 'IP_ADDRESS':
        parts = value.split('.')
        if len(parts) == 4:
            return f'{parts[0]}.***.***.{parts[-1]}'
        return mask_middle(compact, left=2, right=2)

    if entity_type == 'ADDRESS':
        return mask_middle(value.strip(), left=3, right=3)

    if entity_type == 'PERSON':
        return value[:1] + '*' * max(1, len(value) - 1)

    if entity_type in {'API_KEY', 'PRIVATE_KEY'}:
        return f'[{entity_type}]'

    return mask_middle(compact, left=2, right=2)


def mask_middle(value: str, *, left: int, right: int) -> str:
    if not value:
        return ''
    if len(value) <= left + right:
        if len(value) <= 2:
            return value[:1] + '*'
        return value[:1] + '*' * (len(value) - 2) + value[-1:]
    return value[:left] + '*' * (len(value) - left - right) + value[-right:]


def mask_preview(value: str) -> str:
    compact = re.sub(r'\s+', ' ', value).strip()
    if not compact:
        return ''
    if len(compact) <= 4:
        return '*' * len(compact)
    return f'{compact[:2]}***{compact[-2:]}'


def looks_like_id_card(value: str) -> bool:
    compact = re.sub(r'\s+', '', value)
    return bool(re.fullmatch(r'\d{6}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]', compact))


def read_text_file(path: Path) -> str:
    if path.suffix.lower() in {'.rtf', '.doc'} and shutil.which('textutil'):
        run = subprocess.run(
            ['textutil', '-convert', 'txt', '-stdout', str(path)],
            capture_output=True,
            text=True,
            check=False,
        )
        if run.returncode == 0 and run.stdout.strip():
            return run.stdout

    data = path.read_bytes()
    for encoding in ('utf-8', 'utf-8-sig', 'gb18030', 'latin-1'):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode('utf-8', errors='replace')


def text_output_suffix(input_path: Path) -> str:
    suffix = input_path.suffix.lower()
    if suffix in {'.rtf', '.doc'}:
        return '.txt'
    return suffix or '.txt'


def build_report(
    *,
    task_id: str,
    document_name: str,
    input_name: str,
    input_type: str,
    output_file: Path | None,
    findings: list[Finding],
    subject_mappings: list[SubjectMapping],
    warnings: list[str],
    engine: Desensitizer,
) -> dict[str, Any]:
    counts = Counter(item.entity_type for item in findings)
    surfaces = defaultdict(int)
    for item in findings:
        surfaces[item.surface] += 1

    # Convert legal subject mappings into report findings so they show up in the UI.
    subject_findings: list[Finding] = []
    for mapping in subject_mappings:
        preview = mapping.original
        subject_findings.append(
            Finding(
                entity_type=mapping.entity_type,
                start=0,
                end=len(preview),
                score=mapping.confidence,
                replacement=mapping.redacted,
                surface='subject',
                locator=mapping.location,
                preview=preview,
            )
        )
        counts[mapping.entity_type] += 1
        surfaces['subject'] += 1

    return {
        'task_id': task_id,
        'document_name': document_name,
        'input_name': input_name,
        'input_type': input_type,
        'status': 'completed',
        'strategy': 'format_preserving_mask',
        'engine': {
            'presidio_available': engine.presidio_available,
            'custom_chinese_rules_enabled': True,
        },
        'summary': {
            'total_findings': len(findings) + len(subject_findings),
            'entity_counts': dict(sorted(counts.items())),
            'surface_counts': dict(sorted(surfaces.items())),
        },
        'output': {
            'file_name': output_file.name if output_file else '',
            'relative_name': output_file.name if output_file else '',
        },
        'findings': [item.to_dict() for item in (findings + subject_findings)[:500]],
        'warnings': warnings,
        'residual_risk': '自动脱敏不能保证识别全部敏感信息，正式外发前仍建议抽样复核。',
    }


def render_report_markdown(report: dict[str, Any]) -> str:
    lines = [
        f'# {report.get("document_name", "数据脱敏处理")} 脱敏报告',
        '',
        f'- 输入文件：{report.get("input_name", "")}',
        f'- 输入类型：{report.get("input_type", "")}',
        '- 脱敏策略：保留格式打码',
        f'- 命中总数：{report.get("summary", {}).get("total_findings", 0)}',
        '',
        '## 命中类型统计',
    ]
    counts = report.get('summary', {}).get('entity_counts', {})
    if counts:
        for key, value in counts.items():
            lines.append(f'- {key}: {value}')
    else:
        lines.append('- 未命中敏感信息')
    lines.extend(['', '## 处理说明'])
    lines.append(report.get('residual_risk', ''))
    warnings = report.get('warnings') or []
    if warnings:
        lines.extend(['', '## 注意事项'])
        for warning in warnings:
            lines.append(f'- {warning}')
    return '\n'.join(lines).rstrip() + '\n'


def write_retention_note(path: Path) -> None:
    path.write_text(
        '\n'.join(
            [
                '原始文件仅保存在本地任务目录，用于完成本次数据脱敏处理。',
                '系统默认输出保留格式打码后的脱敏文件和处理报告。',
                '自动识别存在漏检和误检风险，正式外发前请对脱敏结果进行抽样复核。',
                '',
            ]
        ),
        encoding='utf-8',
    )


def render_subject_mapping_markdown(
    task_id: str,
    document_name: str,
    mappings: list[SubjectMapping],
) -> str:
    """生成主体逆向映射 Markdown 文档。"""
    lines = [
        '# 主体逆向映射表',
        '',
        f'- 任务编号：{task_id}',
        f'- 材料名称：{document_name or "未命名材料"}',
        f'- 生成时间：{datetime.now().isoformat()}',
        f'- 主体数量：{len(mappings)}',
        '',
        '## 说明',
        '',
        '本文件记录材料脱敏中影响案件法律主要事实的主体（自然人、公司等）的原始值与脱敏值的对应关系。',
        '手机号、身份证号、银行卡号、地址、邮箱等个人隐私信息已完全脱敏，不在本表中。',
        '',
        '## 主体映射',
        '',
        '| 原始值 | 脱敏值 | 实体类型 | 位置 | 置信度 |',
        '|--------|--------|----------|------|--------|',
    ]
    for m in mappings:
        entity_type_label = '人名' if m.entity_type == 'person_name' else '公司名称'
        lines.append(
            f'| {m.original} | {m.redacted} | {entity_type_label} | {m.location} | {m.confidence} |'
        )
    lines.extend([
        '',
        '## 还原说明',
        '',
        '如需还原原始文本，请将上表中的「脱敏值」替换回「原始值」。同一主体在原文中可能出现多次，均已统一替换。',
        '',
    ])
    return '\n'.join(lines)


def build_subject_mapping_json(
    task_id: str,
    document_name: str,
    mappings: list[SubjectMapping],
) -> dict[str, Any]:
    """生成主体逆向映射 JSON 数据。"""
    return {
        'task_id': task_id,
        'document_name': document_name or '未命名材料',
        'generated_at': datetime.now().isoformat(),
        'subject_count': len(mappings),
        'legal_subjects': [m.to_dict() for m in mappings],
        'notes': (
            '本文件记录影响案件法律主要事实的主体（自然人、公司等）的原始值与脱敏值对应关系。'
            '手机号、身份证号、银行卡号、地址、邮箱等个人隐私信息已完全脱敏，不在本表中。'
        ),
    }


def copy_outputs_to_directory(
    output_dir: Path,
    output_file: Path,
    subject_mapping_md: Path,
    subject_mapping_json: Path,
    document_name: str,
) -> None:
    """将脱敏产物复制到用户指定的输出目录，仅保留最终 Markdown 和主体映射 Markdown。"""
    output_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(output_file, output_dir / output_file.name)
    shutil.copy2(subject_mapping_md, output_dir / subject_mapping_md.name)


def process_desensitization(
    *,
    task_id: str,
    input_path: Path,
    document_name: str,
    work_dir: Path,
    is_text: bool = False,
    output_dir: Path | None = None,
) -> dict[str, Path | dict[str, Any]]:
    work_dir.mkdir(parents=True, exist_ok=True)
    engine = Desensitizer()
    findings: list[Finding] = []
    subject_mappings: list[SubjectMapping] = []
    warnings: list[str] = []
    suffix = '.txt' if is_text else input_path.suffix.lower()
    input_name = input_path.name

    if is_text or suffix in TEXT_EXTENSIONS:
        raw = read_text_file(input_path)
        redacted, text_findings, text_subjects = sanitize_text_and_subjects(
            raw, engine, surface='text', locator='全文'
        )
        findings.extend(text_findings)
        subject_mappings.extend(text_subjects)
        base_name = (document_name or Path(input_name).stem).rstrip('_').strip()
        output_stem = _safe_output_stem(f'{base_name}_脱敏')
        output_file = work_dir / f'{output_stem}.md'
        output_file.write_text(redacted, encoding='utf-8')
        input_type = 'text'
    elif suffix in DOC_EXTENSIONS:
        output_file, doc_findings, doc_subjects = process_docx(input_path, work_dir, engine, warnings)
        findings.extend(doc_findings)
        subject_mappings.extend(doc_subjects)
        input_type = 'document'
    elif suffix in PDF_EXTENSIONS:
        base_name = (document_name or Path(input_name).stem).rstrip('_').strip()
        output_stem = _safe_output_stem(base_name)
        output_file, pdf_findings, pdf_subjects, used_ocr = process_pdf(input_path, work_dir, engine, warnings, output_stem=output_stem)
        if used_ocr:
            # Rename to _OCR脱敏.md to indicate OCR source.
            ocr_stem = _safe_output_stem(f'{base_name}_OCR脱敏')
            ocr_output_file = work_dir / f'{ocr_stem}.md'
            output_file.rename(ocr_output_file)
            output_file = ocr_output_file
        findings.extend(pdf_findings)
        subject_mappings.extend(pdf_subjects)
        input_type = 'pdf'
    elif suffix in TABLE_EXTENSIONS:
        output_file, table_findings, table_subjects = process_table(input_path, work_dir, engine, warnings)
        findings.extend(table_findings)
        subject_mappings.extend(table_subjects)
        input_type = 'table'
    elif suffix in JSON_EXTENSIONS:
        output_file, json_findings, json_subjects = process_json(input_path, work_dir, engine, warnings)
        findings.extend(json_findings)
        subject_mappings.extend(json_subjects)
        input_type = 'json'
    elif suffix in PRESENTATION_EXTENSIONS:
        output_file, presentation_findings, presentation_subjects = process_pptx(input_path, work_dir, engine, warnings)
        findings.extend(presentation_findings)
        subject_mappings.extend(presentation_subjects)
        input_type = 'presentation'
    elif suffix in IMAGE_EXTENSIONS:
        output_file, image_findings, image_subjects = process_image(input_path, work_dir, engine, warnings)
        findings.extend(image_findings)
        subject_mappings.extend(image_subjects)
        input_type = 'image'
    else:
        raise ValueError(f'暂不支持该文件类型：{suffix or "无扩展名"}')

    report = build_report(
        task_id=task_id,
        document_name=document_name,
        input_name=input_name,
        input_type=input_type,
        output_file=output_file,
        findings=findings,
        subject_mappings=subject_mappings,
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
    subject_mapping_md.write_text(
        render_subject_mapping_markdown(task_id, document_name, subject_mappings),
        encoding='utf-8',
    )
    subject_mapping_json.write_text(
        json.dumps(build_subject_mapping_json(task_id, document_name, subject_mappings), ensure_ascii=False, indent=2),
        encoding='utf-8',
    )

    if output_dir is not None:
        copy_outputs_to_directory(
            output_dir,
            output_file,
            subject_mapping_md,
            subject_mapping_json,
            document_name,
        )

    return {
        'output_file': output_file,
        'report_json': report_json,
        'report_md': report_md,
        'retention_note': note,
        'subject_mapping_md': subject_mapping_md,
        'subject_mapping_json': subject_mapping_json,
        'report': report,
    }


def process_docx(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []

    if input_path.suffix.lower() == '.doc':
        text = read_text_file(input_path)
        redacted, findings, subjects = sanitize_text_and_subjects(
            text, engine, surface='doc', locator='全文'
        )
        all_findings.extend(findings)
        all_subjects.extend(subjects)
        output_file = work_dir / 'desensitized_output.txt'
        output_file.write_text(redacted, encoding='utf-8')
        warnings.append('.doc 文件按纯文本兜底解析，复杂格式可能无法保留。')
        return output_file, all_findings, all_subjects

    document = Document(str(input_path))
    for index, paragraph in enumerate(document.paragraphs, start=1):
        if not paragraph.text:
            continue
        redacted, findings, subjects = sanitize_text_and_subjects(
            paragraph.text, engine, surface='docx', locator=f'段落 {index}'
        )
        all_findings.extend(findings)
        all_subjects.extend(subjects)
        if findings or subjects:
            paragraph.text = redacted

    for table_index, table in enumerate(document.tables, start=1):
        for row_index, row in enumerate(table.rows, start=1):
            for col_index, cell in enumerate(row.cells, start=1):
                if not cell.text:
                    continue
                locator = f'表格 {table_index} 行 {row_index} 列 {col_index}'
                redacted, findings, subjects = sanitize_text_and_subjects(
                    cell.text, engine, surface='docx_table', locator=locator
                )
                all_findings.extend(findings)
                all_subjects.extend(subjects)
                if findings or subjects:
                    cell.text = redacted

    output_file = work_dir / 'desensitized_output.docx'
    document.save(str(output_file))
    return output_file, all_findings, all_subjects


def process_pdf(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
    output_stem: str = 'desensitized_output',
) -> tuple[Path, list[Finding], list[SubjectMapping], bool]:
    """对 PDF 执行脱敏：优先提取文本层，否则 OCR 提取，最终输出 Markdown。"""
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    text_parts: list[str] = []
    used_ocr = False

    if fitz is not None:
        pdf = fitz.open(str(input_path))
        for page_index, page in enumerate(pdf, start=1):
            page_text = page.get_text('text') or ''
            if page_text.strip():
                text_parts.append(f'--- 第 {page_index} 页 ---\n{page_text.strip()}')
        pdf.close()

    if not text_parts:
        warnings.append('PDF 未提取到可复制文本，使用 OCR 提取为 Markdown 后脱敏。')
        if fitz is None:
            raise RuntimeError('OCR 需要 PyMuPDF 才能渲染页面。')
        try:
            ensure_ocr_available(require_pdf=True)
        except OcrUnavailable as exc:
            raise RuntimeError(str(exc)) from exc
        ocr_text = extract_pdf_ocr_text(input_path)
        used_ocr = True
        # extract_pdf_ocr_text returns pages joined by form feed.
        for page_index, page_text in enumerate(ocr_text.split('\f'), start=1):
            body = '\n'.join(
                line for line in page_text.splitlines()
                if not line.strip().startswith('--- OCR 第')
            ).strip()
            if body:
                text_parts.append(f'--- 第 {page_index} 页 ---\n{body}')

    if not text_parts:
        raise RuntimeError('未能从 PDF 中提取到可脱敏文本。')

    full_text = '\n\n'.join(text_parts)
    redacted, findings, subjects = sanitize_text_and_subjects(
        full_text, engine, surface='pdf', locator='全文'
    )
    all_findings.extend(findings)
    all_subjects.extend(subjects)

    output_file = work_dir / f'{output_stem}.md'
    output_file.write_text(redacted, encoding='utf-8')
    if used_ocr:
        warnings.append('OCR 脱敏结果已保存为 Markdown，可复制编辑，但 OCR 识别可能存在误差。')
    return output_file, all_findings, all_subjects, used_ocr


def _safe_output_stem(name: str) -> str:
    """从材料名称生成安全的文件 stem。"""
    stem = re.sub(r'[\\/:*?"<>|]', '_', name or 'desensitized_output').strip()
    return stem or 'desensitized_output'


def process_table(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if input_path.suffix.lower() == '.csv':
        return process_csv(input_path, work_dir, engine, delimiter=',', output_suffix='.csv')
    if input_path.suffix.lower() == '.tsv':
        return process_csv(input_path, work_dir, engine, delimiter='\t', output_suffix='.tsv')
    if pd is None:
        raise RuntimeError('处理 xlsx/xls/ods 需要安装 pandas、openpyxl、xlrd 或 odfpy。')

    sheets = pd.read_excel(input_path, sheet_name=None, dtype=str)
    output_file = work_dir / 'desensitized_output.xlsx'
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        for sheet_name, frame in sheets.items():
            sanitized_frame = frame.copy()
            for row_index, row in sanitized_frame.iterrows():
                for column in sanitized_frame.columns:
                    value = '' if row[column] is None else str(row[column])
                    if not value or value == 'nan':
                        continue
                    locator = f'{sheet_name}!{column}{row_index + 2}'
                    redacted, findings, subjects = sanitize_text_and_subjects(
                        value, engine, surface='xlsx_cell', locator=locator
                    )
                    if findings or subjects:
                        sanitized_frame.at[row_index, column] = redacted
                        all_findings.extend(findings)
                        all_subjects.extend(subjects)
            sanitized_frame.to_excel(writer, sheet_name=str(sheet_name)[:31], index=False)
    return output_file, all_findings, all_subjects


def process_csv(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    *,
    delimiter: str,
    output_suffix: str,
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    output_file = work_dir / f'desensitized_output{output_suffix}'
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    with input_path.open('r', encoding='utf-8-sig', newline='') as source:
        reader = csv.reader(source, delimiter=delimiter)
        rows = list(reader)
    for row_index, row in enumerate(rows, start=1):
        for col_index, value in enumerate(row, start=1):
            redacted, findings, subjects = sanitize_text_and_subjects(
                value, engine, surface='csv_cell', locator=f'R{row_index}C{col_index}'
            )
            if findings or subjects:
                row[col_index - 1] = redacted
                all_findings.extend(findings)
                all_subjects.extend(subjects)
    with output_file.open('w', encoding='utf-8-sig', newline='') as target:
        writer = csv.writer(target, delimiter=delimiter)
        writer.writerows(rows)
    return output_file, all_findings, all_subjects


def process_json(input_path: Path, work_dir: Path, engine: Desensitizer, warnings: list[str]) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if input_path.suffix.lower() in {'.jsonl', '.ndjson'}:
        return process_json_lines(input_path, work_dir, engine, warnings)

    payload = json.loads(input_path.read_text(encoding='utf-8'))
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []

    def walk(value: Any, path: str) -> Any:
        if isinstance(value, str):
            redacted, findings, subjects = sanitize_text_and_subjects(
                value, engine, surface='json_value', locator=path
            )
            all_findings.extend(findings)
            all_subjects.extend(subjects)
            return redacted
        if isinstance(value, list):
            return [walk(item, f'{path}[{index}]') for index, item in enumerate(value)]
        if isinstance(value, dict):
            return {key: walk(item, f'{path}.{key}' if path else str(key)) for key, item in value.items()}
        return value

    sanitized_payload = walk(payload, '')
    output_file = work_dir / 'desensitized_output.json'
    output_file.write_text(json.dumps(sanitized_payload, ensure_ascii=False, indent=2), encoding='utf-8')
    return output_file, all_findings, all_subjects


def process_json_lines(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    output_lines: list[str] = []

    def walk(value: Any, path: str) -> Any:
        if isinstance(value, str):
            redacted, findings, subjects = sanitize_text_and_subjects(
                value, engine, surface='jsonl_value', locator=path
            )
            all_findings.extend(findings)
            all_subjects.extend(subjects)
            return redacted
        if isinstance(value, list):
            return [walk(item, f'{path}[{index}]') for index, item in enumerate(value)]
        if isinstance(value, dict):
            return {key: walk(item, f'{path}.{key}' if path else str(key)) for key, item in value.items()}
        return value

    for line_index, line in enumerate(input_path.read_text(encoding='utf-8').splitlines(), start=1):
        if not line.strip():
            output_lines.append(line)
            continue
        try:
            payload = json.loads(line)
        except json.JSONDecodeError:
            redacted, findings, subjects = sanitize_text_and_subjects(
                line, engine, surface='jsonl_line', locator=f'行 {line_index}'
            )
            all_findings.extend(findings)
            all_subjects.extend(subjects)
            output_lines.append(redacted)
            warnings.append(f'第 {line_index} 行不是合法 JSON，已按普通文本脱敏。')
            continue
        output_lines.append(json.dumps(walk(payload, f'行 {line_index}'), ensure_ascii=False))

    output_file = work_dir / f'desensitized_output{input_path.suffix.lower()}'
    output_file.write_text('\n'.join(output_lines) + ('\n' if output_lines else ''), encoding='utf-8')
    return output_file, all_findings, all_subjects


def process_pptx(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if Presentation is None:
        raise RuntimeError('处理 pptx 需要安装 python-pptx。')

    presentation = Presentation(str(input_path))
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []
    for slide_index, slide in enumerate(presentation.slides, start=1):
        for shape_index, shape in enumerate(slide.shapes, start=1):
            if getattr(shape, 'has_text_frame', False) and shape.text:
                locator = f'幻灯片 {slide_index} 文本框 {shape_index}'
                redacted, findings, subjects = sanitize_text_and_subjects(
                    shape.text, engine, surface='pptx_text', locator=locator
                )
                if findings or subjects:
                    shape.text = redacted
                    all_findings.extend(findings)
                    all_subjects.extend(subjects)
            if getattr(shape, 'has_table', False):
                for row_index, row in enumerate(shape.table.rows, start=1):
                    for col_index, cell in enumerate(row.cells, start=1):
                        if not cell.text:
                            continue
                        locator = f'幻灯片 {slide_index} 表格 {shape_index} 行 {row_index} 列 {col_index}'
                        redacted, findings, subjects = sanitize_text_and_subjects(
                            cell.text, engine, surface='pptx_table', locator=locator
                        )
                        if findings or subjects:
                            cell.text = redacted
                            all_findings.extend(findings)
                            all_subjects.extend(subjects)

    output_file = work_dir / 'desensitized_output.pptx'
    presentation.save(str(output_file))
    warnings.append('PPTX 脱敏会尽量保留结构，但命中文本框的局部字体样式可能被重置。')
    return output_file, all_findings, all_subjects


def process_image(
    input_path: Path,
    work_dir: Path,
    engine: Desensitizer,
    warnings: list[str],
) -> tuple[Path, list[Finding], list[SubjectMapping]]:
    if Image is None or ImageDraw is None:
        raise RuntimeError('图片脱敏需要安装 Pillow。')
    try:
        ensure_ocr_available()
    except OcrUnavailable as exc:
        raise RuntimeError(str(exc)) from exc
    output_file = work_dir / f'desensitized_output{input_path.suffix.lower()}'
    output_file, image_findings, image_subjects, _visible_words = redact_image(input_path, output_file, engine, '图片')
    return output_file, image_findings, image_subjects


def redact_image(input_path: Path, output_file: Path, engine: Desensitizer, locator_prefix: str) -> tuple[Path, list[Finding], list[SubjectMapping], list[dict[str, Any]]]:
    image = Image.open(input_path).convert('RGB')
    data = ocr_image_to_data(image)
    draw = ImageDraw.Draw(image)
    all_findings: list[Finding] = []
    all_subjects: list[SubjectMapping] = []

    # Group by (block, paragraph, line) because line_num alone is reset per block.
    words = [
        {
            'text': (data['text'][i] or '').strip(),
            'left': int(data['left'][i]),
            'top': int(data['top'][i]),
            'width': int(data['width'][i]),
            'height': int(data['height'][i]),
            'line': int(data['line_num'][i]),
            'word': int(data['word_num'][i]),
            'block': int(data['block_num'][i]),
            'par': int(data['par_num'][i]),
        }
        for i in range(len(data.get('text', [])))
    ]
    lines: dict[tuple[int, int, int], list[dict[str, Any]]] = {}
    for w in words:
        if not w['text']:
            continue
        key = (w['block'], w['par'], w['line'])
        lines.setdefault(key, []).append(w)

    blacked_out_word_keys: set[tuple[int, int, int, int]] = set()

    def _blackout_word_indices(indices: set[int], word_spans: list[tuple[int, int, dict[str, Any]]]) -> None:
        if not indices:
            return
        left = min(word_spans[i][2]['left'] for i in indices)
        top = min(word_spans[i][2]['top'] for i in indices)
        right = max(word_spans[i][2]['left'] + word_spans[i][2]['width'] for i in indices)
        bottom = max(word_spans[i][2]['top'] + word_spans[i][2]['height'] for i in indices)
        draw.rectangle([left, top, right, bottom], fill='black')
        for i in indices:
            w = word_spans[i][2]
            blacked_out_word_keys.add((w['block'], w['par'], w['line'], w['word']))

    # Share subject token counters across all lines so the same company/person gets
    # the same replacement label everywhere in the document.
    subject_counters: dict[str, int] = {'person_name': 0, 'company_name': 0}

    for line_key, line_words in sorted(lines.items()):
        line_words.sort(key=lambda w: (w['left'], w['top']))
        word_spans: list[tuple[int, int, dict[str, Any]]] = []
        compact_chunks: list[str] = []
        compact_to_line: list[int] = []
        line_pos = 0
        for w in line_words:
            word_start = line_pos
            word_end = line_pos + len(w['text'])
            word_spans.append((word_start, word_end, w))
            for offset, _ch in enumerate(w['text']):
                compact_to_line.append(word_start + offset)
            compact_chunks.append(w['text'])
            line_pos = word_end + 1  # +1 for the space between words
        compact_text = ''.join(compact_chunks)
        if not compact_text.strip():
            continue

        # Detect privacy entities (phone, id card, etc.) on compact text.
        compact_sanitized, findings = engine.sanitize_text(
            compact_text, surface='image_text', locator=f'{locator_prefix} 行 {line_key}'
        )
        # Detect legal subjects (person/company names) on the original compact text,
        # not on the privacy-redacted text, to avoid double-redaction artifacts.
        compact_redacted, subjects = redact_legal_subjects(
            compact_text, locator=f'{locator_prefix} 行 {line_key}', cluster_counters=subject_counters
        )

        all_findings.extend(findings)
        all_subjects.extend(subjects)

        # Collect compact character indices that need to be blacked out.
        covered_compact_chars: set[int] = set()

        # 1. Privacy findings.
        for finding in findings:
            for idx in range(finding.start, finding.end):
                covered_compact_chars.add(idx)

        # 2. Legal subject replacements.
        for subject in subjects:
            original = subject.original
            if not original:
                continue
            start = 0
            while True:
                pos = compact_text.find(original, start)
                if pos == -1:
                    break
                for idx in range(pos, pos + len(original)):
                    covered_compact_chars.add(idx)
                start = pos + len(original)

        # 3. Fallback: any compact character that changed after subject redaction.
        for idx, (orig, red) in enumerate(zip(compact_text, compact_redacted)):
            if orig != red:
                covered_compact_chars.add(idx)

        # Map compact character indices back to word indices.
        covered_word_indices: set[int] = set()
        for compact_idx in covered_compact_chars:
            if compact_idx >= len(compact_to_line):
                continue
            line_idx = compact_to_line[compact_idx]
            for word_idx, (start, end, _w) in enumerate(word_spans):
                if start <= line_idx < end:
                    covered_word_indices.add(word_idx)
                    break

        _blackout_word_indices(covered_word_indices, word_spans)

    image.save(output_file)
    visible_words = [
        {
            'text': w['text'],
            'left': w['left'],
            'top': w['top'],
            'width': w['width'],
            'height': w['height'],
        }
        for w in words
        if (w['block'], w['par'], w['line'], w['word']) not in blacked_out_word_keys
    ]
    return output_file, all_findings, all_subjects, visible_words
