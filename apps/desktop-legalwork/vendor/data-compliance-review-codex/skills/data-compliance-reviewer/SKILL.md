---
name: data-compliance-reviewer
description: Offline product-form skill for ComplianceAI. Use when the user wants to run data-compliance, privacy-policy, data-processing agreement, SDK/third-party sharing, cross-border transfer, or source-code compliance review without the web frontend. The skill outputs JSON and Markdown reports and uses its bundled Chinese data-compliance regulation knowledge base.
---

# Data Compliance Reviewer

Use this skill as the no-frontend form of the ComplianceAI product. It runs locally, reads an input file or text, applies rule-based compliance review, enriches findings with the bundled regulation knowledge base, and writes report files.

## Run

```bash
python3 skills/data-compliance-reviewer/scripts/run_review.py \
  --file /path/to/input.txt \
  --output-dir /path/to/output
```

For pasted text:

```bash
python3 skills/data-compliance-reviewer/scripts/run_review.py \
  --text-file /path/to/input.txt \
  --name "某 App 隐私政策" \
  --output-dir /path/to/output
```

For code review:

```bash
python3 skills/data-compliance-reviewer/scripts/run_review.py \
  --file /path/to/source.ts \
  --review-type code \
  --output-dir /path/to/output
```

## Outputs

The script always writes:

- `report.json`: structured risk report with statistics, findings, evidence, suggestions, and supporting regulations.
- `report.md`: human-readable Markdown report.
- `remediation_tasks.json`: prioritized engineering/legal remediation tasks.

The script prints a small JSON object containing the output paths.

## Bundled Resources

- `references/knowledge-base/local-regulations.sqlite3`: local searchable regulation database.
- `references/knowledge-base/regulations-md/`: Markdown regulation corpus for traceability and later maintenance.

Do not call the web app or desktop app for this workflow. This skill is a separate product form, not a packaging/release step.

## Review Scope

Default document review covers:

- notice and disclosure completeness
- purpose/scope/minimum necessity
- consent and separate consent
- sensitive personal information
- third-party sharing, SDK, entrusted processing
- cross-border transfer
- retention, deletion, account cancellation
- automated decision-making and profiling
- security measures and incident response

Default code review covers:

- hardcoded secrets or credentials
- plaintext HTTP endpoints
- personal-information collection without nearby consent/permission traces
- sensitive logging
- local persistence of personal or credential data
- dynamic execution or unsafe rendering surfaces

The report is an auxiliary compliance review artifact and does not replace legal advice or final legal judgment.
