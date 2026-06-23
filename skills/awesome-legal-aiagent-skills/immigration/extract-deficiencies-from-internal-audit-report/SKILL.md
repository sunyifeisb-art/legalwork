---
name: extract-deficiencies-from-internal-audit-report
task_id: immigration/extract-deficiencies-from-internal-audit-report
description: Structured deficiency matrix extracted from a structured immigration compliance audit report, where the analysis must classify each deficiency by regulatory type and severity and separately flag any potential anti-discrimination exposure for further review.
activates_for: [planner, solver, checker]
---

# Skill: Extract Deficiencies from Internal Audit Report

## 2. Failure modes the skill is correcting

- Agents restate the audit narrative instead of converting it into a remediation-ready deficiency matrix with a clear regulatory basis, affected population, and severity for each item.
- I-9 issues are flattened into one bucket, obscuring the difference between substantive verification failures and technical paperwork errors that may be correctable.
- Document examination or re-verification conduct is treated as a routine form defect rather than separately flagged as potential anti-discrimination exposure.
- The analysis stays inside the auditor’s conclusions and does not independently inspect the underlying source materials for additional deficiencies, missing records, or mismatches.
- Deficiencies are listed without tying them to the controlling immigration rule, the size of the affected set, or the operational consequence of leaving them unremediated.
- Advisory output omits concrete next steps, leaving remediation priorities and responsibility assignments ambiguous.

## 3. Legal frameworks / domain conventions that apply

- Employment eligibility verification issues generally split between substantive verification failures and technical form-completion errors; the distinction matters for remediation and penalty framing.
- The governing framework for employment verification is the Form I-9 statutory and regulatory scheme, including the employer’s completion, retention, and reverification obligations.
- Worker-verification system defects are distinct from form defects and should be analyzed separately where the source package includes electronic verification logs or case-management records.
- Temporary worker compliance materials, where present, create a separate compliance track from ordinary form completion and should not be merged into I-9 paperwork defects.
- Conduct that appears to demand specific documents, reject valid documents, or re-verify in an unauthorized way may implicate anti-discrimination rules and should be flagged apart from ordinary compliance errors.
- Penalty exposure is shaped by the nature of the violation, the breadth of the affected population, the employer’s history, and whether the conduct suggests broader compliance-system failure.
- Every legal conclusion should be anchored to the controlling rule, regulation, or other authority rather than stated as a bare label.

## 4. Analytical scaffolds

1. Source-set inventory: review the audit narrative and every underlying attachment, log, spreadsheet, roster, form sample, or support file; do not rely on the summary alone.
2. Population identification: identify each distinct employee cohort, record set, process stream, or compliance track implicated by the materials; if the package contains only one cohort, state that expressly.
3. Defect extraction: convert each observed problem into a discrete deficiency entry, splitting separate legal wrongs into separate rows rather than rolling them together.
4. Regulatory classification: assign each deficiency to the correct compliance category, such as substantive form defect, technical form defect, verification-system issue, temporary worker compliance issue, or other immigration compliance issue.
5. Severity calibration: assign every entry an ordinal severity level on one consistent scale, with a brief rationale tied to the nature of the defect and its remediation posture.
6. Authority mapping: identify the specific statutory, regulatory, or other controlling authority for each deficiency and avoid unsupported legal shorthand.
7. Population sizing: count the affected employees, forms, cases, notices, or records for each deficiency, using the source materials as the unit of measure.
8. Cross-document interaction: note where one defect interacts with another record, system, or document set, especially where a later correction, mismatch resolution, or reverification step changes the compliance analysis.
9. Anti-discrimination screen: separately flag any document abuse, citizenship-status, or national-origin concern for follow-up review and do not treat it as a mere paperwork issue.
10. Remediation mapping: identify the general corrective path for each category and distinguish what can be corrected administratively from what requires policy, training, or process changes.

## 5. Vertical / structural / temporal relationships

- When the source package contains multiple compliance tracks, keep them vertically separated in the analysis: form completion, verification-system activity, temporary worker materials, and anti-discrimination concerns should not be merged.
- When a deficiency affects multiple records or time periods, preserve the hierarchy from system-wide issue to affected subset to individual record, so the matrix reflects both breadth and specificity.
- If the materials show a sequence of creation, mismatch, notice, response, or closure events, analyze the timing relationship because late or improper sequencing can convert an otherwise technical issue into a more serious defect.
- Where a later document or log entry appears to cure an earlier issue, confirm whether the cure is legally effective before treating the deficiency as resolved.

## 6. Output structure conventions

- Produce a structured deficiency matrix first, then a concise cover memo.
- The matrix should use an industry-conventional table with columns that include: deficiency type, regulatory basis, number affected, severity, issue summary, and corrective action.
- Order rows from higher severity to lower severity, and keep like issues grouped together rather than mixing categories.
- Define the severity scale once and apply it uniformly across all entries.
- Each row should be self-contained: identify the defect, the rule implicated, the affected population, and the immediate remediation path.
- The cover memo should summarize the main findings, highlight the highest-risk categories, and call out any anti-discrimination concerns in a separate section.
- The memo should end with explicit recommended actions that assign an owner and a timing anchor tied to the remediation or compliance timeline.
- Use controlling authority names and section references where available; do not leave legal propositions uncited.
- If the audit package reveals only one cohort or one compliance track, state that affirmatively rather than implying broader scope.
