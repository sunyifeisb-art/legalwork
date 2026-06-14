#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / 'scripts'
PYTHON = sys.executable or 'python3'


def run(cmd: list[str]) -> str:
    out = subprocess.check_output(cmd, text=True)
    return out.strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', default='')
    parser.add_argument('--text', default='')
    parser.add_argument('--document-name', required=True)
    parser.add_argument('--work-dir', required=True)
    parser.add_argument('--norm-mapping', default='')
    args = parser.parse_args()

    default_norm_mapping = ROOT / 'config' / 'default-norm-mappings.json'
    local_regulation_db = ROOT / 'knowledge-base' / 'local-regulations.sqlite3'

    work_dir = Path(args.work_dir)
    work_dir.mkdir(parents=True, exist_ok=True)

    preprocessed = work_dir / '01_preprocessed.json'
    classification = work_dir / '02_classification.json'
    planned = work_dir / '03_paths.json'
    tasks = work_dir / '04_tasks.json'
    skeleton = work_dir / '05_report_skeleton.json'
    findings_dir = work_dir / '06_findings'
    final_report = work_dir / '07_report_final.json'
    mapped_report = work_dir / '07_report_mapped.json'
    enriched_report = work_dir / '07_report_enriched.json'
    auto_rechecked_report = work_dir / '07_report_auto_rechecked.json'
    auto_recheck_queue = work_dir / '07_auto_recheck_queue.json'
    risk_clusters = work_dir / '07_risk_clusters.json'
    bundle_dir = work_dir / '08_bundle'
    application_plan = work_dir / '09_application_plan.json'
    evidence_checklist = work_dir / '10_evidence_checklist.json'
    sdk_partner_pack = work_dir / '11_sdk_partner_review_pack.json'
    cross_border_pack = work_dir / '12_cross_border_review_pack.json'
    privacy_remediation_pack = work_dir / '13_privacy_remediation_pack.json'
    remediation_tasks = work_dir / '14_remediation_tasks.json'

    preprocess_cmd = [PYTHON, str(SCRIPTS / 'preprocess_input.py'), '--output', str(preprocessed)]
    classify_cmd = [PYTHON, str(SCRIPTS / 'classify_document_type.py')]
    if args.file:
        preprocess_cmd += ['--file', args.file]
        classify_cmd += ['--file', args.file]
    else:
        preprocess_cmd += ['--text', args.text]
        classify_cmd += ['--text', args.text]

    run(preprocess_cmd)
    classification.write_text(run(classify_cmd), encoding='utf-8')
    planned.write_text(run([PYTHON, str(SCRIPTS / 'plan_review_paths.py'), '--classification', str(classification)]), encoding='utf-8')
    run([PYTHON, str(SCRIPTS / 'generate_review_tasks.py'), '--classification', str(classification), '--planned-paths', str(planned), '--output', str(tasks)])

    classification_data = json.loads(classification.read_text(encoding='utf-8'))
    run([
        PYTHON, str(SCRIPTS / 'build_report_skeleton.py'),
        '--document-name', args.document_name,
        '--doc-type', classification_data.get('type', 'unknown'),
        '--paths-file', str(planned),
        '--output', str(skeleton)
    ])

    findings_dir.mkdir(parents=True, exist_ok=True)
    findings_payload = run([
        PYTHON, str(SCRIPTS / 'run_rule_based_review.py'),
        '--preprocessed', str(preprocessed),
        '--tasks', str(tasks),
        '--out-dir', str(findings_dir)
    ])
    findings = json.loads(findings_payload)['findings']

    run([PYTHON, str(SCRIPTS / 'aggregate_review_findings.py'), '--skeleton', str(skeleton), '--findings', *findings, '--output', str(final_report)])

    report_for_bundle = final_report
    norm_mapping_path = args.norm_mapping.strip() or (str(default_norm_mapping) if default_norm_mapping.exists() else '')
    if norm_mapping_path:
        run([
            PYTHON, str(SCRIPTS / 'apply_external_norm_mapping.py'),
            '--report', str(final_report),
            '--mapping', norm_mapping_path,
            '--output', str(mapped_report)
        ])
        report_for_bundle = mapped_report

    if local_regulation_db.exists():
        run([
            PYTHON, str(SCRIPTS / 'enrich_report_with_regulation_db.py'),
            '--report', str(report_for_bundle),
            '--db', str(local_regulation_db),
            '--output', str(enriched_report)
        ])
        report_for_bundle = enriched_report

    run([
        PYTHON, str(SCRIPTS / 'auto_recheck_report.py'),
        '--report', str(report_for_bundle),
        '--output', str(auto_rechecked_report),
        '--queue-output', str(auto_recheck_queue),
        '--cluster-output', str(risk_clusters)
    ])
    report_for_bundle = auto_rechecked_report

    bundle = run([PYTHON, str(SCRIPTS / 'render_report_bundle.py'), str(report_for_bundle), '--out-dir', str(bundle_dir)])

    run([
        PYTHON, str(SCRIPTS / 'build_application_scenario_plan.py'),
        '--report', str(report_for_bundle),
        '--classification', str(classification),
        '--output', str(application_plan)
    ])

    run([
        PYTHON, str(SCRIPTS / 'build_evidence_checklist.py'),
        '--report', str(report_for_bundle),
        '--application-plan', str(application_plan),
        '--output', str(evidence_checklist)
    ])

    run([
        PYTHON, str(SCRIPTS / 'build_sdk_partner_review_pack.py'),
        '--report', str(report_for_bundle),
        '--application-plan', str(application_plan),
        '--evidence-checklist', str(evidence_checklist),
        '--output', str(sdk_partner_pack)
    ])

    run([
        PYTHON, str(SCRIPTS / 'build_cross_border_review_pack.py'),
        '--report', str(report_for_bundle),
        '--application-plan', str(application_plan),
        '--evidence-checklist', str(evidence_checklist),
        '--output', str(cross_border_pack)
    ])

    run([
        PYTHON, str(SCRIPTS / 'build_privacy_remediation_pack.py'),
        '--report', str(report_for_bundle),
        '--application-plan', str(application_plan),
        '--evidence-checklist', str(evidence_checklist),
        '--output', str(privacy_remediation_pack)
    ])

    run([
        PYTHON, str(SCRIPTS / 'build_remediation_task_plan.py'),
        '--report', str(report_for_bundle),
        '--queue', str(auto_recheck_queue),
        '--clusters', str(risk_clusters),
        '--evidence-checklist', str(evidence_checklist),
        '--application-plan', str(application_plan),
        '--output', str(remediation_tasks)
    ])

    result = {
        'work_dir': str(work_dir),
        'preprocessed': str(preprocessed),
        'classification': str(classification),
        'planned_paths': str(planned),
        'tasks': str(tasks),
        'final_report': str(final_report),
        'auto_rechecked_report': str(auto_rechecked_report),
        'auto_recheck_queue': str(auto_recheck_queue),
        'risk_clusters': str(risk_clusters),
        'report_for_bundle': str(report_for_bundle),
        'norm_mapping': norm_mapping_path,
        'local_regulation_db': str(local_regulation_db) if local_regulation_db.exists() else '',
        'application_plan': str(application_plan),
        'evidence_checklist': str(evidence_checklist),
        'sdk_partner_review_pack': str(sdk_partner_pack),
        'cross_border_review_pack': str(cross_border_pack),
        'privacy_remediation_pack': str(privacy_remediation_pack),
        'remediation_tasks': str(remediation_tasks),
        'bundle': json.loads(bundle)
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
