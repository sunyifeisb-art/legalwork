---
name: identify-issues-in-compliance-certificate
task_id: banking-finance/identify-issues-in-compliance-certificate
description: Reviews a compliance certificate against the governing credit documentation and financial data, independently recalculates covenant metrics, and identifies errors, omissions, and resulting defaults or notice issues with procedural next-step recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Compliance Certificate Issues Memo — Independent Verification

## 1. Subject-matter triage
- Treat the certificate, credit agreement, financial statements, and agent correspondence as one integrated record.
- Identify whether the task is a single-certificate review or whether multiple periods, entities, or tests are implicated; if multiple, evaluate each separately and do not collapse them into one pass.
- Determine whether the review is purely issue-spotting or also requires a corrected calculation, notice analysis, or default assessment.

## 2. Failure modes the skill is correcting
- Accepting reported covenant inputs without testing them against the governing definitions, caps, exclusions, or timing rules.
- Missing omitted items in ratios or coverage tests because the certificate uses shorthand rather than the full contractual definition.
- Treating a subsidiary, guarantor, or restricted entity as immaterial without checking the actual trigger, coverage threshold, and joinder timing.
- Overlooking disclosure or notice obligations tied to contingent liabilities, environmental matters, or other specified events.
- Failing to connect an apparent numerical error to the downstream covenant consequence, notice requirement, or default risk.
- Reporting issues descriptively without assigning severity, authority, and a concrete next step.

## 3. Legal frameworks / domain conventions that apply
- Start from the governing credit documents, then read the certificate through the operative definitions, calculation mechanics, and notice provisions in those documents.
- For each covenant metric, verify the contractual inputs, the applicable period, any addback or deduction limits, and any cross-referenced schedules or definitions that modify the formula.
- For coverage, leverage, liquidity, fixed-charge, and similar tests, test the reported figure against the exact contractual numerator and denominator, not a simplified accounting proxy.
- For entity-coverage and guaranty issues, check whether the trigger is based on ownership, asset size, revenue, or another contractual threshold, and then test whether the related joinder or supplemental deliverable deadline has run.
- For reporting and notice obligations, compare the event level, timing, recipient, and form against the document’s express requirements.
- For late delivery, missing signature, stale financials, or inconsistent certification language, assess whether the defect is merely clerical or whether it affects compliance or enforceability under the document package.
- Cite the controlling document provision for each legal or contractual proposition; do not state a covenant breach, notice failure, or default consequence without tying it to the governing text.

## 4. Analytical scaffolds
1. Identify the covenant or certification item at issue and the precise contractual source that governs it.
2. Enumerate every relevant period, entity, metric, threshold, and notice trigger before analyzing them.
3. Recalculate the reported metric from source inputs only, using the contract’s definitions and limitations.
4. Compare the borrower-reported figure to the corrected figure and to the applicable threshold or deadline.
5. Cross-check the result against other affected provisions, including related definitions, cross-default or notice language, and any certificate attestation language.
6. Classify the issue by severity using a single ordinal scale defined at the top of the memo.
7. State the downstream consequence in practical terms: corrected certificate, further reporting, reserve of rights, notice, or default evaluation.
8. If more than one issue exists, assess aggregate impact rather than treating each item as isolated if the same covenant or certificate section is affected.
9. Close each issue with the quantitative gap or timing miss, the interacting document provision, and the client consequence.

## 5. Vertical / structural / temporal relationships
- Map the relationship between the certificate date, the measurement period, the delivery deadline, and any post-period events that the certificate references.
- If a later correspondence or disclosure clarifies, amends, or contradicts the certificate, reconcile the chronology and identify which statement controls for each issue.
- If a calculation depends on a prior period, trailing period, or rolling test, identify the exact window and ensure the inputs match that window.
- For entity or guaranty analysis, distinguish parent, subsidiary, restricted, and guarantor status at the relevant measurement date, not as of a later date.
- Where timing matters, distinguish breach at measurement, breach at delivery, and breach after notice or cure period expiration.

## 6. Output structure conventions
- Use an issue memo format, not a narrative summary.
- Define a severity scale once at the top and apply it uniformly to every issue.
- For each issue, include:
  - Severity
  - Borrower-reported position or figure
  - Corrected figure or analysis
  - Governing-document reference
  - Why the issue matters, including the quantitative or timing impact
  - Related document or provision that interacts with the issue
  - Recommended action
- Include a compact table of reported versus corrected figures and the applicable threshold or deadline for each recalculated item.
- If no issue is found on a particular item, say so affirmatively after testing it.
- End with an explicit Recommended Actions block that assigns the action to the appropriate role and ties it to a deadline, notice window, reporting cycle, or other milestone in the record.
- Keep the memo suitable for direct conversion into `compliance-certificate-issue-memo.docx`.
