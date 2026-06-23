---
name: compare-matter-plan-engagement-letter
task_id: corporate-ma/compare-matter-plan-against-engagement-letter
description: Guides field-by-field comparison of a matter plan against an engagement letter, identifying scope gaps, fee discrepancies, regulatory threshold implications of deal value differences, and professional responsibility concerns.
activates_for: [planner, solver, checker]
---

# Skill: Compare Matter Plan Against Engagement Letter

## 1. Subject-matter triage
- Treat the engagement letter as the external commitment set and the matter plan as the internal execution map; the task is to identify mismatches that create scope, fee, staffing, timing, conflicts, or regulatory risk.
- First determine whether the source set contains one or multiple deal values, parties, workstreams, rate tables, or timeline variants. If multiple appear, enumerate them before analysis and compare each on its own terms.
- If a source is missing a field entirely, say so expressly; absence itself is often the discrepancy.

## 2. Failure modes the skill is correcting
- Spotting a mismatch but not explaining why it matters for scope, billing, regulatory classification, or delivery accountability.
- Collapsing different deal values or workstreams into one blended comparison instead of testing each item separately.
- Ignoring that a workstream mentioned in the engagement letter but not operationalized in the matter plan is an unstaffed, unfunded commitment.
- Missing that inconsistent adverse-party naming may indicate a conflicts-clearance problem or stale intake data.
- Treating differences in estimated costs or disbursements as clerical when they may shift client economics or internal budget authority.
- Stating a legal implication without naming the governing rule, threshold, or professional-responsibility authority that supports it.

## 3. Legal frameworks / domain conventions that apply
- Engagement letters govern client-facing scope, commercial terms, and responsibility allocation; matter plans govern internal execution, so inconsistencies can create contractual and operational drift.
- Compare commercial terms field-by-field, including fee basis, rate structure, cost assumptions, disbursements, and any milestone-linked pricing.
- For transaction value, apply the relevant threshold framework for the matter type and test whether each document characterizes the deal consistently against that threshold.
- For scope and staffing, a workstream should be treated as fully planned only if the matter plan reflects staffing, timing, and budget discipline for the same service category.
- For conflicts, compare the adverse party naming against the conflicts-intake convention used in the source set and the applicable professional-conduct rule on conflict identification and screening, such as Model Rule of Professional Conduct 1.7, 1.9, or 1.10 where relevant.
- For ethics and professional responsibility implications, tie the observation to the governing rule rather than to a bare fairness or best-practices statement.

## 4. Analytical scaffolds
1. Deal value comparison
   - State the deal value in each document.
   - Assess whether the difference changes any threshold analysis, regulatory characterization, fee basis, or internal approval level.
   - Cross-reference any threshold language, filing trigger, or scope qualifier elsewhere in the source set.
   - State the client consequence: mispriced work, misclassified regulatory work, or mismanaged approvals.

2. Rate and fee comparison
   - Compare hourly rates, fee caps, alternative fee terms, or assumptions embedded in each document.
   - Identify whether the matter plan preserves the same economics or silently deviates.
   - Cross-reference budget, staffing mix, or disbursement assumptions.
   - State the consequence: margin leakage, invoicing dispute, or internal budget overrun.

3. Scope and workstream comparison
   - List every workstream in the engagement letter.
   - Check whether each is reflected in the matter plan with a realistic combination of owner, timing, and budget.
   - Flag any workstream present in one document but absent or materially narrowed in the other.
   - State the consequence: unassigned deliverables, missed deadlines, or scope dispute risk.

4. Threshold and regulatory characterization
   - For each relevant value or structural fact, test the applicable threshold framework independently.
   - Identify whether the two documents describe the transaction on opposite sides of a trigger.
   - Cross-reference the filing, consent, or review language that follows from the trigger.
   - State the consequence: wrong compliance path, delayed closing, or incomplete regulatory work.

5. Conflicts and party identity comparison
   - Compare the adverse party, affiliate, or counterparty naming exactly as presented.
   - If the naming differs, assess whether the discrepancy could reflect an incomplete conflicts check, entity-family confusion, or stale intake data.
   - Cross-reference the engagement letter’s client identification and any internal matter-opening details.
   - State the consequence: ethics exposure, screening failure, or avoidable waiver risk.

6. Costs, disbursements, and budget assumptions
   - Compare stated cost reserves, disbursement estimates, and any embedded assumptions.
   - Explain whether one figure appears to be a placeholder, estimate, or matured budget.
   - Cross-reference staffing and workstream scope.
   - State the consequence: budget variance, client billing friction, or approval mismatch.

7. Ambiguity and drafting drift
   - Identify terms that are used differently, more broadly, or more narrowly across the two documents.
   - Distinguish true inconsistency from benign drafting style only where the functional effect is unchanged.
   - State the consequence: interpretive ambiguity, execution error, or later dispute over inclusion.

## 5. Vertical / structural / temporal relationships
- Compare the documents vertically by topic, not just sequentially by paragraph order: deal value, fees, scope, staffing, timeline, conflicts, and costs should each be tested against the corresponding source text.
- If one document is earlier in time or appears superseded, note whether later language resolves or worsens the mismatch.
- Where a workstream depends on a prior milestone, make clear whether the matter plan includes that dependency and whether the engagement letter assumes it.
- When multiple parties or periods appear, preserve one row or issue per item so the comparison stays traceable.

## 6. Output structure conventions
- Produce a discrepancy analysis memo in issue-ordered form, using conventional legal memo headings rather than a mechanical checklist.
- Include an explicit severity label for each issue using one uniform ordinal scale defined once at the top.
- For each issue, include:
  - source language from the engagement letter
  - source language from the matter plan
  - description of the discrepancy
  - practical significance
  - controlling authority or governing convention, when the point depends on a legal or ethics proposition
  - recommended resolution
- Close each issue with: the scale of the difference or threshold implicated, the related source provision or related document term, and the downstream consequence to the client.
- End with a distinct Recommended Actions section that uses imperative verbs, identifies the responsible role, and ties each action to a deadline, milestone, or immediate next step.
- If the comparison reveals no material discrepancy on a topic, say so affirmatively and note why the apparent difference is immaterial.
