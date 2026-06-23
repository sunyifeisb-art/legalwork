---
name: review-dpa-company-data-protection-playbook
task_id: intellectual-property/review-data-processing-agreement-against-company-data-protection-playbook
description: Reviewing a vendor data processing agreement against an internal data protection playbook and related technical due diligence materials to produce a deviation report with risk ratings and remediation recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Review Data Processing Agreement Against Company Data Protection Playbook

## 1. Subject-matter triage
- Treat the playbook as the internal benchmark, then test the DPA against baseline privacy-law requirements and the technical due diligence materials as the operational reality check.
- Identify whether the counterparty uses processors, cross-border hosting, security controls, incident response workflows, retention mechanics, or audit limitations; these determine which provisions need deeper review.
- Separate provisions that are merely suboptimal from those that create a true compliance, operational, or negotiation risk.
- If the source set contains multiple DPAs, addenda, regional schedules, or technical appendices, evaluate each separately before comparing them.

## 2. Failure modes the skill is correcting
- Reviewing the DPA against the playbook without cross-checking the technical due diligence summary, which misses gaps between contractual promises and actual practices.
- Missing provisions that are more favorable than the playbook and should be recorded as acceptable rather than flagged.
- Treating security language as sufficient without testing whether the specific commitments are consistent with the technical description of systems and controls.
- Failing to distinguish controller-facing obligations from processor-facing commitments, especially for notices, assistance, audits, deletion, and subprocessors.
- Stopping at issue description without stating severity, practical consequence, and a concrete remediation path.
- Overlooking cross-document inconsistencies, including where the email chain narrows, expands, or clarifies the DPA terms.

## 3. Legal frameworks / domain conventions that apply
- Use the applicable privacy regime as the external floor, then compare the agreement to the company playbook as the stricter internal standard.
- Security measures should be assessed under the applicable controller-processor framework and the agreement’s own operational commitments, with technical and organizational measures described at a level that can be checked against the due diligence record.
- Subprocessor terms should be reviewed for approval mechanics, notice, objection rights, and flow-down obligations consistent with the source set.
- Cross-border transfer or localization language should be tested for binding commitments, permitted locations, and any exceptions or fallback mechanisms.
- Incident notification provisions should be measured against the controller’s need to meet its own legal notification deadlines.
- Audit, inspection, and assurance rights should be read in light of whether the controller receives a meaningful verification right or only paper assurances.
- Termination assistance, return, and deletion clauses should cover scope, timing, format, certification, and retained-copy handling.
- Where the source materials identify a governing rule or standard, cite that authority directly in the report rather than stating the conclusion bare.

## 4. Analytical scaffolds
1. Extract the playbook rule for each subject area and compare it to the corresponding DPA clause.
2. Cross-reference the DPA with the email chain and technical due diligence summary to verify whether the contractual language matches the factual operating model.
3. For each deviation, determine whether it is adverse, neutral, or favorable relative to the playbook.
4. Assign an ordinal severity rating using a single defined scale and apply it consistently to each issue.
5. For each issue, tie the finding to the relevant clause or source document, the conflicting playbook position, the technical or factual gap, and the downstream risk.
6. Where multiple vendors, regions, systems, or processing contexts are in play, evaluate each one separately rather than collapsing them into a generic finding.
7. Record any provision that meets or exceeds the playbook as a no-issue confirmation.
8. Convert each adverse deviation into a concrete remediation recommendation that can be inserted into the agreement or tracked as a follow-up action.

## 5. Vertical / structural / temporal relationships
- Compare the DPA’s hierarchy of documents, annexes, and incorporated policies to determine which text controls if terms conflict.
- Check whether technical due diligence descriptions are current, because outdated infrastructure descriptions can make a clause appear compliant when it is not.
- Identify whether notice periods, cure periods, retention windows, and deletion deadlines operate before or after a triggering event, and whether that timing is compatible with the controller’s obligations.
- Where the email chain reflects side assurances or negotiated concessions, treat them as context that may narrow or expand the written clause, but do not assume they override the executed text unless the source set supports that reading.

## 6. Output structure conventions
- Produce a deviation report grouped by severity, with a short severity legend defined once at the top.
- Use one entry per deviation, and within each entry include: clause or section reference, playbook position, deviation description, technical due diligence linkage if relevant, severity, consequence, and recommended remediation.
- Include a separate section for provisions that meet or exceed the playbook standard.
- Include a concise recommendations section at the end that converts the highest-priority deviations into action items assigned to a responsible role and tied to the relevant timing milestone.
- Use clear, conventional legal drafting language; do not mimic the rubric’s internal labels or section names.
