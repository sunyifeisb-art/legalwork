---
name: hls-compare-closing-certificate-covenants
task_id: healthcare-life-sciences/compare-closing-certificate-against-agreement-covenants
description: Compares a closing certificate against merger agreement pre-closing covenants and supporting documents to identify false certifications, unauthorized actions, and timing failures through a structured closing-analysis workflow.
activates_for: [planner, solver, checker]
---

# Skill: Compare Closing Certificate Against Agreement Covenants

## 2. Failure modes the skill is correcting

- Major covenant breaches may be spotted while smaller certificate inaccuracies are missed, including schedule-based certifications, notice mechanics, and discrete interim-restriction items that can still create exposure.
- Timing errors are often underanalyzed; the controlling question is not just whether an action occurred, but whether it occurred before the required cut-off and under the correct counting convention.
- False “no breach / no change / all schedules complete” certifications can mask undisclosed interim actions; the analysis must test the certificate against the supporting record, not against itself.
- Unauthorized elections, amendments, side letters, waivers, or unilateral acts can look routine but may violate interim operating covenants if they required board approval or the other party’s consent.
- Severity can be flattened; representation-level inaccuracies, consent failures, and closing-condition impacts should be distinguished from technical deviations with limited transactional consequence.
- A memo that describes discrepancies without tying them to the affected covenant text, corroborating documents, and client consequence is incomplete.

## 3. Legal frameworks / domain conventions that apply

- Closing certificate as operative certification: treat the certificate as a formal statement that pre-closing covenants and related schedule assertions remain true as of closing; test each statement against the agreement, the interim-events record, and the attachments.
- Interim operating covenants: analyze actions during the interim period against restrictions on ordinary-course operations, no-amendment provisions, no new liabilities, capital expenditures, financing, litigation settlements, employee matters, and similar pre-closing controls.
- Consent and approval mechanics: if the agreement requires board approval, committee approval, or counterparty consent for a step, the absence of that authorization is a covenant issue even if the business rationale is sound.
- Schedule completeness and accuracy: if the certificate incorporates schedules or attached lists, any omitted action, contract, election, or event must be tested as a possible falsity in the completeness certification.
- Notice and timing conventions: compute deadlines using the agreement’s defined business-day, calendar-day, notice-delivery, and trigger-date conventions; do not infer timing from ordinary calendar intuition.
- Materiality and threshold tests: where the agreement uses materiality qualifiers, size thresholds, duration thresholds, or “would reasonably be expected to” formulations, measure the event against the stated contractual benchmark rather than a generic standard.
- Consequence analysis: covenant deviations may affect closing conditions, bring-down accuracy, indemnity exposure, disclosure sufficiency, or post-closing dispute posture; the memo should identify the likely transactional effect.
- Controlling authority: when relying on a legal proposition, cite the controlling contractual provision and any referenced statutory, regulatory, or common-law authority only where the source set supplies or clearly invokes it.

## 4. Analytical scaffolds

1. Identify the full set of certificate assertions that purport to cover pre-closing covenants, schedules, approvals, notices, and interim conduct; if only one certificate is in scope, state that expressly.
2. Map each assertion to the specific covenant, condition, schedule, or attached support document it tracks.
3. For each asserted compliance point, compare the certificate statement against the supporting materials and the interim-events record.
4. Calculate timing against the agreement’s stated convention, including the correct trigger date and counting method.
5. Test whether any action required authorization or consent; if so, determine whether the source documents show it.
6. If a schedule or attachment is referenced, verify both omission and internal consistency with the underlying event record.
7. For each discrepancy, record: the implicated covenant, the statement or omission in the certificate, the supporting contrary facts, the size or timing of the deviation, the related document or clause, and the downstream consequence.
8. Calibrate severity uniformly on an ordinal scale and apply it consistently across all issues.
9. Separate true breaches from drafting noise, but do not ignore technical inaccuracies that undermine certification reliability.
10. End with concrete next steps tied to the responsible deal team role and the relevant transaction milestone.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Temporal sequence matters: pre-closing actions are assessed as of the signing-to-closing interim period, not by later remediation.
- Cross-document dependency matters: the certificate, merger agreement, schedules, and supporting attachments should be read as one record; an item absent from one document may be confirmed or contradicted by another.
- Hierarchy matters: specific covenant language controls over generalized certificate wording, and express exceptions control over blanket compliance statements.
- If multiple periods, events, or covenant buckets are present, analyze each one separately rather than collapsing them into a single pass.

## 6. Output structure conventions

- Use a memo format titled as a compliance-gap analysis.
- Begin with a short issue summary and a legend for the ordinal severity scale used throughout.
- Include a compact table or bullet summary of all issues, sorted by severity.
- For each issue, use a repeatable issue block:
  - Severity
  - Covenant / document reference
  - Certificate statement or omission
  - Supporting facts and cross-reference
  - Timing / authorization / threshold analysis
  - Consequence for the client
- Each issue should close with the contractual or legal authority that supports the conclusion, cited by provision name and section where available.
- Where relevant, note whether the issue appears to be a corrective disclosure, waiver request, closing-condition problem, or indemnity item.
- End with an explicit Recommended Actions section that assigns an imperative action to the responsible role and anchors it to the current transaction milestone or an identified deadline.
- Conclude with a closing assessment stating whether closing can proceed as-is, only with conditions, or only after remediation.
