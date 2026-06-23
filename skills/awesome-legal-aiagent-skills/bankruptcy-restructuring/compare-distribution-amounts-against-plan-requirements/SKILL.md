---
name: compare-distribution-amounts-against-plan-requirements
task_id: bankruptcy-restructuring/compare-distribution-amounts-against-plan-requirements
description: Prepare a compliance analysis memorandum that checks distributions against governing plan requirements, tests the underlying arithmetic and allocation logic, reviews reserve mechanics, and identifies procedural follow-up items for the responsible estate personnel.
activates_for: [planner, solver, checker]
---

# Skill: Compare Distribution Amounts Against Plan Requirements

## 2. Failure modes the skill is correcting

- The analysis flags a mismatch with the governing distribution scheme but stops short of showing the operative calculation, the source of the mismatch, and the practical effect on the estate or claim holder.
- The analysis compares amounts without identifying the controlling plan provision, confirmation order, schedule, or later case document that changes the payment rule.
- The analysis treats reserve issues as bookkeeping only and misses segregation requirements, reserve methodology, post-resolution true-ups, or surplus handling.
- The analysis does not distinguish between class-level compliance and line-item or claimant-level exceptions.
- The analysis gives conclusions without naming the legal or plan authority that supports them.
- The analysis lists problems but does not close each one with a concrete next step for the responsible estate personnel.

## 3. Legal frameworks / domain conventions that apply

- Use the confirmed plan, confirmation order, distribution procedures, schedules, and any later orders as the hierarchy of authority; apply the operative document that controls the relevant payment event.
- Compare each distribution against the specific governing rule for that class or claimant group: fixed amount, pro rata formula, cap, reserve carveout, deferred-payment interest, priority sequencing, or other express allocation mechanics.
- If a distribution depends on claims allowance status, use the correct status category and the correct denominator; do not substitute a broader pool, a netted pool, or a post-resolution subset unless the source documents require it.
- Reserve mechanics must be tested against the governing segregation, accounting, and release instructions; assess whether disputed amounts were held, adjusted, or released in the manner required by the plan or order.
- Where deferred payments carry interest or another time-based adjustment, verify the governing rate, accrual start and end points, compounding rule if any, and payment timing.
- Compliance conclusions must be anchored in the source authority itself; do not state that a payment is compliant or non-compliant without identifying the controlling provision and the payment rule it imposes.

## 4. Analytical scaffolds

- Start by identifying the full universe of affected classes, claim groups, reserve buckets, and any special payment categories that the source documents actually place in play. If the materials show only one applicable category, state that expressly and explain why the others are out of scope.
- For each affected item, run the same sequence:
  - governing requirement;
  - actual amount or treatment reported;
  - amount implied by the controlling rule;
  - variance or reconciliation point;
  - compliance conclusion;
  - downstream effect on the estate or recipient;
  - procedural follow-up.
- For each issue, quantify the gap using the relevant source figure, time period, claim amount, reserve balance, or allocation base; then tie the issue to the interacting document or provision; then state the consequence if the reported treatment stands.
- Reconcile totals, subtotals, and roll-forwards within the report itself before comparing to the plan; flag any internal inconsistency even if the line item appears directionally correct.
- Separate class-wide issues from claimant-specific exceptions so the memo does not overgeneralize a localized discrepancy.
- If a reserve has been reduced, released, or reclassified, test whether the change matches the operative trigger in the governing documents and whether any residual balance was handled as required.
- End every identified issue with a concrete remedy or next step, such as recalculation, supplemental payment, reserve correction, amended report, notice to affected parties, or request for court direction.
- Assign a severity label to each issue using a simple ordinal scale defined once at the start of the memo, and apply it consistently across all entries.
- Present the analysis in a numbered sequence that mirrors the set of affected items or periods you are testing, so the reader can track one comparison pass per item without collapsing distinct issues together.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Distinguish among pre-confirmation, post-confirmation, and post-resolution payment events when the source documents use different rules for each.
- Track whether a reserve or payment obligation changes after claim allowance, objection resolution, plan effectiveness, or other stated milestones.
- If multiple distribution dates or reporting periods are implicated, compare each period separately rather than averaging across periods or treating later corrections as retroactive confirmation of earlier treatment.
- Where a waterfall or tiered priority applies, check the ordering relationship before checking the amount; a numerically correct payment can still be non-compliant if the sequence is wrong.

## 6. Output structure conventions

- Write a compliance analysis memo, not a narrative summary.
- Open with a short scope statement identifying the governing documents reviewed, the payment period or report reviewed, and the severity scale used.
- Include a compact table or bullet list up front that captures each issue, its severity, the affected class or reserve, the governing authority, the variance, and the recommended follow-up.
- Use one section per affected class, reserve bucket, or special payment category; within each section, keep the same order: authority, reported treatment, calculated treatment, variance, compliance conclusion, consequence, and next step.
- For reserve analysis, use a separate section and address methodology, segregation, post-resolution adjustments, and any required true-up or release.
- Cite the controlling plan provision, order, or related case document each time you state a legal or distribution rule.
- Conclude with a Recommended Actions block that assigns the next move to the responsible estate role and ties it to the relevant deadline, milestone, or reporting cycle.
- Keep the memo self-contained and operational; the reader should be able to implement the corrections without referring back to the analysis.
