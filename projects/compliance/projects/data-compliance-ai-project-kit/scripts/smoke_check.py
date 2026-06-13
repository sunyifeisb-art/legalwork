#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

REQUIRED = [
    "README.md",
    "docs/project-overview.md",
    "docs/first-phase-scope.md",
    "docs/review-engine-architecture.md",
    "docs/multi-method-review-strategy.md",
    "docs/application-layer-scenarios.md",
    "references/review-checklists.md",
    "workflows/01-regulation-ingest/workflow.example.yaml",
    "workflows/02-policy-review/workflow.example.yaml",
    "workflows/03-human-review-feedback/workflow.example.yaml",
    "knowledge-base/templates/regulation-frontmatter-template.md",
    "templates/risk-report-template.md",
    "templates/review-decision-template.md",
    "tests/eval-metrics.md",
    "config/document-types.json",
    "config/application-scenarios.json",
    "config/evidence-requirements.json",
    "config/sdk-partner-review-pack.json",
    "config/cross-border-review-pack.json",
    "config/privacy-remediation-pack.json",
    "config/review-paths.json",
    "config/review-checkpoints.json",
    "config/review-methods.json",
    "config/finding.schema.json",
    "config/external-norm-adapter.example.json",
    "config/default-norm-mappings.json",
    "config/risk-themes.json",
    "config/priority-rules.json",
    "scripts/init_regulation_file.py",
    "scripts/init_eval_case.py",
    "scripts/validate_regulation_frontmatter.py",
    "scripts/render_risk_report.py",
    "scripts/classify_document_type.py",
    "scripts/plan_review_paths.py",
    "scripts/build_report_skeleton.py",
    "scripts/preprocess_input.py",
    "scripts/render_report_bundle.py",
    "scripts/generate_review_tasks.py",
    "scripts/aggregate_review_findings.py",
    "scripts/auto_recheck_report.py",
    "scripts/apply_external_norm_mapping.py",
    "scripts/enrich_report_with_regulation_db.py",
    "scripts/build_application_scenario_plan.py",
    "scripts/build_evidence_checklist.py",
    "scripts/build_sdk_partner_review_pack.py",
    "scripts/build_cross_border_review_pack.py",
    "scripts/build_privacy_remediation_pack.py",
    "scripts/build_remediation_task_plan.py",
    "scripts/build_regression_validation.py",
    "scripts/run_rule_based_review.py",
    "scripts/run_review_pipeline.py",
    "scripts/run_precision_regression.py",
    "samples/eval-set/precision_cases.json",
]


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    missing = [p for p in REQUIRED if not (root / p).exists()]
    if missing:
        print("MISSING")
        for item in missing:
            print(item)
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
