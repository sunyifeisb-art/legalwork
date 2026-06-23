---
name: extract-default-triggers-from-credit-agreement
task_id: banking-finance/extract-default-triggers-from-credit-agreement
description: Extract default triggers from a credit agreement and related amendments, cross-reference them against deal materials and compliance data, and produce a structured risk report with next steps.
activates_for: [planner, solver, checker]
---

# Skill: Default Trigger Extraction Report — Credit Agreement Risk Review

## 1. Subject-matter triage
- Treat the assignment as an extraction-and-issue-spotting task, not a summary.
- Identify every event of default, deemed default, acceleration trigger, mandatory prepayment trigger, consent trigger, and related notice or cure mechanic that could create client risk.
- Read the base credit agreement together with amendments, joinders, side letters, compliance certificates, and deal materials as one integrated source set.
- If multiple facilities, borrower groups, or amendment vintages exist, enumerate them first and analyze each separately rather than collapsing them into a single pass.
- If the record is incomplete, say so and separate confirmed triggers from provisional triggers that depend on missing materials.

## 2. Failure modes the skill is correcting
- Listing default triggers without tying each one to the specific operative language, amendment history, and any superseding provision.
- Missing interaction effects between the credit agreement and other deal documents that expand, waive, narrow, or condition a trigger.
- Treating a covenant breach as self-evidently material without checking whether the agreement uses a threshold, grace period, knowledge qualifier, or notice-and-cure structure.
- Failing to distinguish automatic default events from lender-election remedies, notice-based defaults, and cross-default mechanics.
- Overlooking that the same fact pattern can implicate more than one trigger category and should be reported separately.
- Summarizing risk qualitatively without anchoring it to the controlling clause, threshold, timing mechanic, or downstream consequence.
- Using broad labels like “high risk” without stating the specific severity scale used and why the entry sits at that level.

## 3. Legal frameworks / domain conventions that apply
- Credit agreements typically define defaults across payment, covenant, representation, bankruptcy, judgment, cross-default, change-of-control, ERISA, invalidity, and collateral/guaranty failure concepts; identify the applicable category before labeling the trigger.
- Amendments may override earlier text, so later-in-time language controls to the extent of conflict; compare each amendment against the base agreement and note any residual provisions that survive.
- Many triggers depend on defined terms such as material adverse effect, permitted debt, permitted liens, required lenders, and control definitions; cite the operative definition before drawing the risk conclusion.
- Cure periods, grace periods, basket capacity, and notice mechanics change whether a fact pattern is an immediate default or a future default risk; confirm the temporal mechanic before rating the issue.
- Cross-default and cross-acceleration provisions often require debt, not just obligations generally; identify the debt scope, dollar threshold, and any excluded debt or dispute carve-out.
- Financial covenant analysis depends on the measurement date, test period, addbacks, pro forma adjustments, and any holiday or step-down features; compare the covenant test to the correct reporting period.
- Guaranty and collateral covenants frequently turn on materiality tests, exclusions, and perfection mechanics; verify whether any omission is an actual trigger or a remediation item.
- For any proposition that depends on a defined legal standard in the source documents, cite the controlling contractual clause or defined term by section and subsection rather than stating the conclusion bare.

## 4. Analytical scaffolds
1. Build the universe: enumerate every agreement, amendment, and related deal document to be reviewed.
2. Extract the trigger set: list each default trigger by category and quote or paraphrase the operative standard at issue.
3. Normalize the mechanics: capture the threshold, cure period, notice requirement, knowledge qualifier, measurement date, and any exception or basket.
4. Cross-reference interactions: identify which other clause, schedule, or document changes, narrows, supersedes, or conditions the trigger.
5. Test the fact pattern: compare the disclosed facts and compliance data against the trigger mechanics, one trigger at a time.
6. Separate confirmed from contingent: distinguish present defaults, near-term risk, and non-issues that are expressly carved out.
7. Rank severity: assign each entry an ordinal severity level using a stated scale and one-line rationale.
8. State downstream consequences: explain the likely effect on borrowing availability, acceleration rights, mandatory prepayment, consent needs, collateral enforcement, or transaction timing.
9. Conclude with actions: tie each material issue to a concrete follow-up step and the responsible party.

## 5. Vertical / structural / temporal relationships
- Track how the base agreement, each amendment, and any waiver interact over time; later documents may partially supersede earlier defaults but leave other mechanics intact.
- If a trigger requires notice, default only ripens after the notice-and-cure sequence is complete; distinguish a breach from a matured event of default.
- If a covenant is tested on a periodic basis, separate the measurement date from the reporting date and from the cure deadline.
- If a cross-default depends on another document, identify the upstream instrument, the downstream consequence, and whether the other instrument itself contains a threshold or carve-out.
- If multiple related defaults arise from one fact pattern, report each trigger separately and note whether they stack or duplicate the same consequence.

## 6. Output structure conventions
- Produce a structured default-trigger extraction report in conventional issue-list form.
- Define a single ordinal severity scale at the top and use it uniformly for every entry.
- For each trigger, include:
  - Trigger category
  - Operative clause or defined term
  - Source document and amendment vintage
  - Relevant threshold, cure, notice, or timing mechanic
  - Cross-references to interacting provisions or deal materials
  - Risk assessment and severity
  - Downstream consequence
  - Recommended next step
- Keep confirmed triggers and contingent triggers in separate subsections.
- Include a short section for current compliance status only where a financial covenant or reporting metric is implicated.
- End with a Recommended Actions block that names the action, the responsible role, and the timing anchor tied to the source materials.
- Use precise citations to the agreement sections and related documents where available; do not cite a legal conclusion without identifying the contractual authority supporting it.
