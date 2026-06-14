#!/usr/bin/env python3
from __future__ import annotations

"""
数据合规智能审查系统 - Web界面（过渡保留）。
核心工作流已迁移到 worker_core.py / compliance_worker.py。
"""
import html as html_lib
import json
import os
import re
import shutil
import sys
import time
import uuid
from datetime import datetime
from pathlib import Path
from threading import Thread

from flask import Flask, render_template, request, jsonify, Response, send_file, send_from_directory

import worker_core as core
from desensitize_engine import (
    IMAGE_EXTENSIONS,
)

app = Flask(__name__)

# 配置
core.set_worker_paths(
    base_dir=Path(__file__).parent,
    upload_folder=Path(__file__).parent / 'uploads',
    output_folder=Path(__file__).parent / 'output',
    scripts_dir=Path(__file__).parent / 'scripts',
    project_root=Path(__file__).resolve().parent.parent / 'projects' / 'data-compliance-ai-project-kit',
)
core.ensure_directories()

BASE_DIR = core.BASE_DIR
UPLOAD_FOLDER = core.UPLOAD_FOLDER
OUTPUT_FOLDER = core.OUTPUT_FOLDER
SCRIPTS_DIR = core.SCRIPTS_DIR
LOCAL_REGULATION_DB = core.LOCAL_REGULATION_DB
REVIEW_IMAGE_EXTENSIONS = {ext.lstrip('.') for ext in IMAGE_EXTENSIONS}
ALLOWED_EXTENSIONS = core.ALLOWED_EXTENSIONS
DESENSITIZE_EXTENSIONS = core.DESENSITIZE_EXTENSIONS
CODE_EXTENSIONS = core.CODE_EXTENSIONS
PYTHON_BIN = core.PYTHON_BIN

# 与 worker_core 共享内存任务缓存
tasks = core.tasks

# 便捷别名
save_task_state = core.save_task_state
load_task_state = core.load_task_state
ensure_task_loaded = core.ensure_task_loaded
allowed_file = core.allowed_file
allowed_desensitize_file = core.allowed_desensitize_file
safe_upload_filename = core.safe_upload_filename
safe_download_filename = core.safe_download_filename
infer_review_type = core.infer_review_type
derive_document_name = core.derive_document_name
list_review_history = core.list_review_history
safe_task_output_dir = core.safe_task_output_dir
validate_output_dir = core.validate_output_dir
read_text_best_effort = core.read_text_best_effort
get_risk_level_color = core.get_risk_level_color
get_risk_level_order = core.get_risk_level_order
load_json_if_exists = core.load_json_if_exists
enrich_code_report_for_display = core.enrich_code_report_for_display
refresh_code_suggestions_file = core.refresh_code_suggestions_file
run_review_pipeline = core.run_review_pipeline
run_code_review_pipeline = core.run_code_review_pipeline
run_desensitize_pipeline = core.run_desensitize_pipeline
line_snippet = core.line_snippet


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

        target = run_code_review_pipeline if review_type == 'code' else run_review_pipeline
        thread = Thread(target=target, args=(task_id, temp_file, document_name, True))
        thread.start()

        return jsonify({'task_id': task_id})

    elif uploaded_file is not None:
        file = uploaded_file
        if file.filename == '':
            return jsonify({'error': '请选择文件'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': '不支持的文件类型'}), 400

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

    report_path = Path(task['result']['report'])
    if not report_path.exists():
        return '报告文件不存在', 404

    report = enrich_code_report_for_display(json.loads(report_path.read_text(encoding='utf-8')))

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

    report_path = demo_dir / 'report.json'
    report = json.loads(report_path.read_text(encoding='utf-8')) if report_path.exists() else {}

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

    import webbrowser
    webbrowser.open(f'http://127.0.0.1:{PORT}')

    app.run(debug=True, port=PORT)
