#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / 'scripts'
RISK_ORDER = {'无': 0, '建议优化': 1, '中风险': 2, '高风险': 3}


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, text=True).strip()


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def build_run_command(text: str, file_path: str, document_name: str, work_dir: Path, norm_mapping: str) -> list[str]:
    cmd = [
        'python3', str(SCRIPTS / 'run_review_pipeline.py'),
        '--document-name', document_name,
        '--work-dir', str(work_dir),
    ]
    if norm_mapping:
        cmd += ['--norm-mapping', norm_mapping]
    if file_path:
        cmd += ['--file', file_path]
    else:
        cmd += ['--text', text]
    return cmd


def stat_block(report: dict) -> dict:
    stats = report.get('stats', {})
    return {
        'total': stats.get('total', len(report.get('items', []))),
        'high_risk': stats.get('high_risk', 0),
        'medium_risk': stats.get('medium_risk', 0),
        'advisory': stats.get('advisory', 0),
    }


def compare_reports(before: dict, after: dict) -> dict:
    before_map = {item['risk_point']: item for item in before.get('items', [])}
    after_map = {item['risk_point']: item for item in after.get('items', [])}

    improved = []
    regressed = []
    unresolved = []
    resolved = []

    for risk_point, before_item in before_map.items():
        before_level = before_item.get('risk_level', '无')
        after_item = after_map.get(risk_point)
        if not after_item:
            resolved.append({
                'risk_point': risk_point,
                'before_level': before_level,
                'after_level': '无',
                'result': '已消失',
            })
            continue

        after_level = after_item.get('risk_level', '无')
        before_score = RISK_ORDER.get(before_level, 0)
        after_score = RISK_ORDER.get(after_level, 0)
        if after_score < before_score:
            improved.append({
                'risk_point': risk_point,
                'before_level': before_level,
                'after_level': after_level,
                'result': '风险下降',
            })
        elif after_score > before_score:
            regressed.append({
                'risk_point': risk_point,
                'before_level': before_level,
                'after_level': after_level,
                'result': '风险上升',
            })
        else:
            unresolved.append({
                'risk_point': risk_point,
                'before_level': before_level,
                'after_level': after_level,
                'result': '风险未下降',
            })

    for risk_point, after_item in after_map.items():
        if risk_point not in before_map:
            regressed.append({
                'risk_point': risk_point,
                'before_level': '无',
                'after_level': after_item.get('risk_level', '无'),
                'result': '新增风险',
            })

    return {
        'improved': improved,
        'regressed': regressed,
        'unresolved': unresolved,
        'resolved': resolved,
    }


def build_queue_stats(task_plan: dict) -> dict:
    return task_plan.get('priority_counts', {'P1': 0, 'P2': 0, 'P3': 0})


def render_markdown(payload: dict) -> str:
    before = payload['before_stats']
    after = payload['after_stats']
    queue_before = payload['before_task_priority_counts']
    queue_after = payload['after_task_priority_counts']
    compare = payload['comparison']

    lines = [
        '# 整改回归验证报告',
        '',
        '## 整体验证结论',
        f"- 结论：{payload['verdict']}",
        f"- 说明：{payload['summary']}",
        '',
        '## 风险统计对比',
        '| 指标 | 整改前 | 整改后 | 变化 |',
        '|---|---:|---:|---:|',
        f"| 总项数 | {before['total']} | {after['total']} | {after['total'] - before['total']} |",
        f"| 高风险 | {before['high_risk']} | {after['high_risk']} | {after['high_risk'] - before['high_risk']} |",
        f"| 中风险 | {before['medium_risk']} | {after['medium_risk']} | {after['medium_risk'] - before['medium_risk']} |",
        f"| 建议优化 | {before['advisory']} | {after['advisory']} | {after['advisory'] - before['advisory']} |",
        '',
        '## 整改任务优先级对比',
        '| 优先级 | 整改前 | 整改后 | 变化 |',
        '|---|---:|---:|---:|',
        f"| P1 | {queue_before.get('P1', 0)} | {queue_after.get('P1', 0)} | {queue_after.get('P1', 0) - queue_before.get('P1', 0)} |",
        f"| P2 | {queue_before.get('P2', 0)} | {queue_after.get('P2', 0)} | {queue_after.get('P2', 0) - queue_before.get('P2', 0)} |",
        f"| P3 | {queue_before.get('P3', 0)} | {queue_after.get('P3', 0)} | {queue_after.get('P3', 0) - queue_before.get('P3', 0)} |",
        '',
        '## 风险变化明细',
    ]

    def add_section(title: str, rows: list[dict]):
        lines.append(f"### {title}")
        if not rows:
            lines.append('- 无')
            lines.append('')
            return
        for row in rows:
            lines.append(f"- {row['risk_point']}：{row['before_level']} → {row['after_level']}（{row['result']}）")
        lines.append('')

    add_section('风险下降', compare['improved'])
    add_section('风险消失', compare['resolved'])
    add_section('风险未下降', compare['unresolved'])
    add_section('风险上升 / 新增', compare['regressed'])

    return '\n'.join(lines) + '\n'


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--before-file', default='')
    parser.add_argument('--before-text', default='')
    parser.add_argument('--after-file', default='')
    parser.add_argument('--after-text', default='')
    parser.add_argument('--document-name', required=True)
    parser.add_argument('--work-dir', required=True)
    parser.add_argument('--norm-mapping', default='')
    args = parser.parse_args()

    if not (args.before_file or args.before_text):
        raise SystemExit('before 输入不能为空')
    if not (args.after_file or args.after_text):
        raise SystemExit('after 输入不能为空')

    work_dir = Path(args.work_dir)
    before_dir = work_dir / 'before'
    after_dir = work_dir / 'after'
    work_dir.mkdir(parents=True, exist_ok=True)

    run(build_run_command(args.before_text, args.before_file, args.document_name + '-before', before_dir, args.norm_mapping))
    run(build_run_command(args.after_text, args.after_file, args.document_name + '-after', after_dir, args.norm_mapping))

    before_report = load_json(before_dir / '07_report_auto_rechecked.json')
    after_report = load_json(after_dir / '07_report_auto_rechecked.json')
    before_tasks = load_json(before_dir / '14_remediation_tasks.json')
    after_tasks = load_json(after_dir / '14_remediation_tasks.json')

    comparison = compare_reports(before_report, after_report)
    before_stats = stat_block(before_report)
    after_stats = stat_block(after_report)
    before_queue = build_queue_stats(before_tasks)
    after_queue = build_queue_stats(after_tasks)

    high_reduced = after_stats['high_risk'] < before_stats['high_risk']
    medium_reduced = after_stats['medium_risk'] < before_stats['medium_risk']
    regression_count = len(comparison['regressed'])
    improvement_count = len(comparison['improved']) + len(comparison['resolved'])

    if regression_count == 0 and (high_reduced or medium_reduced or len(comparison['resolved']) > 0):
        verdict = '整改有效'
    elif regression_count > 0 and improvement_count > regression_count and (high_reduced or medium_reduced):
        verdict = '整改总体有效，但有新增问题'
    elif regression_count > 0:
        verdict = '整改后出现回退'
    else:
        verdict = '整改效果有限'

    summary = f"高风险 {before_stats['high_risk']}→{after_stats['high_risk']}，中风险 {before_stats['medium_risk']}→{after_stats['medium_risk']}，P1 任务 {before_queue.get('P1', 0)}→{after_queue.get('P1', 0)}。"

    payload = {
        'document_name': args.document_name,
        'before_work_dir': str(before_dir),
        'after_work_dir': str(after_dir),
        'verdict': verdict,
        'summary': summary,
        'before_stats': before_stats,
        'after_stats': after_stats,
        'before_task_priority_counts': before_queue,
        'after_task_priority_counts': after_queue,
        'comparison': comparison,
    }

    json_out = work_dir / '15_regression_validation.json'
    md_out = work_dir / '15_regression_validation.md'
    json_out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
    md_out.write_text(render_markdown(payload), encoding='utf-8')
    print(json.dumps({'json': str(json_out), 'markdown': str(md_out)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
