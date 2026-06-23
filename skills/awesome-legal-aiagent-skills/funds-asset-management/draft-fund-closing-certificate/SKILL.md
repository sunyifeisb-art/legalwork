---
name: draft-fund-closing-certificate
task_id: funds-asset-management/draft-fund-closing-certificate
description: Draft a GP closing certificate for a private equity fund's final closing certifying each closing condition precedent and prepare a companion issues memo that flags discrepancies and unresolved items identified across the source documents.
activates_for: [planner, solver, checker]
---

# Skill: Draft GP Closing Certificate

## 1. Subject-matter triage (only if applicable)

- This task has two outputs: a formal final-closing certificate and a companion issues memo.
- The certificate is the primary deliverable; draft it first, then draft the issues memo after the certificate content is complete and internally consistent.
- Treat the closing date, the governing fund documents, the closing checklist, subscription materials, and AML/KYC materials as the factual record. If a required fact is not confirmed, do not overstate it in the certificate.

## 2. Failure modes the skill is correcting

- Drafting a generic certificate that does not track each closing condition precedent in the governing fund documents.
- Certifying a condition as satisfied when the source record is incomplete, inconsistent, or silent.
- Missing discrepancies in the commitment schedule, investor eligibility materials, or closing checklist.
- Failing to reconcile equalization-interest mechanics or other economics adjustments used for late closings.
- Confirming regulatory or factual compliance without tying the statement to the controlling fund document or source support.
- Producing only the memo or only the certificate instead of both deliverables.
- Presenting issues descriptively without stating consequence, source conflict, and a concrete remediation path.

## 3. Legal frameworks / domain conventions that apply

- The governing fund documents control the closing conditions, certifications, and any closing mechanics. Track the exact conditions precedent rather than paraphrasing them into a generic “customary conditions” statement.
- A GP closing certificate is a formal dated representation as of the final closing date; statements should be framed “as of” that date.
- Address each closing condition individually, using the terminology used in the fund documents where possible.
- If the source set supports a condition only partially, certify only the supported portion and move the uncertainty to the issues memo.
- If AML/KYC completion, investor eligibility, or transfer/subscription approvals are incomplete, that gap belongs in the issues memo and should not be papered over in the certificate.
- If the fund documents require investor qualification, commitment cap compliance, key-person status, or similar closing confirmations, state each one separately and only if supported by the source record.
- Any calculation referenced in the certificate should be reproducible from the source materials; if the inputs or methodology are unclear, flag the issue rather than inferring a result.
- For any legal proposition or formal certification premise, name the controlling document or authority the statement rests on, using the document’s own title or section reference when available.

## 4. Analytical scaffolds

1. Start by enumerating every closing condition precedent appearing in the governing fund documents, together with any related definitions or exceptions that affect how the condition should be read.
2. Assemble the factual record for each condition from the closing checklist, subscription materials, investor diligence files, commitment schedule, and any closing memorandum or officer confirmations.
3. Test each condition one by one against the source record. If the condition is fully supported, certify it. If the record is partial, inconsistent, or missing, do not certify it as satisfied.
4. Compare the commitment schedule against the final closing materials to identify mismatches in investor names, commitment amounts, status labels, or aggregation totals. Any unresolved discrepancy should be isolated in the issues memo.
5. Review any late-closing economics, equalization adjustments, or similar closing true-ups for methodology consistency, including the base amount used, the applicable time period, and the convention selected in the source documents.
6. Confirm whether any investor-percentage, concentration, or similar threshold test is required by the fund documents; if so, state the inputs and the result only if the record supports them cleanly.
7. Build the certificate from the supported conditions only, and route every unsupported, ambiguous, or conflicting point to the issues memo with a concrete explanation of why it cannot be certified.
8. Before finalizing, reconcile the certificate narrative against the closing checklist so no required condition is omitted and no unsupported condition is inserted.

## 5. Vertical / structural / temporal relationships (only if applicable)

- The certificate must follow the order of the controlling closing conditions, not the order of convenience in the source packet.
- The closing date controls the timing of every certification; avoid drafting language that suggests the condition was satisfied earlier unless the source materials expressly support that timing.
- Use the closing checklist as an index of evidence, but use the governing fund documents as the source of truth for what must be certified.
- Where later-dated materials correct earlier discrepancies, reflect that chronology in the issues memo so the reader can see what was cured, what remains open, and what still needs confirmation.

## 6. Output structure conventions

- Produce two deliverables in separate files: the closing certificate and the closing issues memo.
- The certificate should have a brief opening identifying the fund, the GP, and the final closing date, followed by discrete certifications for each closing condition precedent, then the execution block.
- Each certification should be specific, condition-based, and dated as of the final closing date; avoid omnibus “all things considered” language.
- The issues memo should begin with a short status summary, then analyze each discrepancy or unresolved item in a separate entry.
- For each issue entry, state the condition or document at issue, describe the inconsistency or gap, identify the consequence of the issue for closing or post-closing administration, and give a concrete recommended fix.
- Use an explicit severity label for each issue entry, with a consistent ordinal scale stated once at the top of the memo.
- End the memo with a standalone Recommended Actions section that assigns the action, the responsible role, and the timing anchor for each item.
- Keep the certificate and memo internally aligned: any point not confidently supported in the certificate should appear in the memo as an issue, not as a hidden assumption.
