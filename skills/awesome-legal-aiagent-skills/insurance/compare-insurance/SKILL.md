---
name: compare-manufacturing-claim-property-policy-exclusions
task_id: insurance/compare-insurance
description: Agents analyzing a complex property claim against a commercial policy should compare the claimed loss categories against the operative coverage grants, exclusions, endorsements, valuation provisions, deductibles, and mitigation-related clauses; address causation doctrines where relevant; and test the claim timeline and arithmetic against the policy terms.
activates_for: [planner, solver, checker]
---

# Skill: Compare Manufacturing Facility Claim Against Property Policy Exclusions — Coverage Analysis Memorandum

## 2. Failure modes the skill is correcting

- The analysis names exclusions or endorsements but does not tie each one to the specific claimed loss category, causing an uncoupled coverage conclusion.
- Causation is treated as a generic concept instead of being tested against the policy wording and the governing causation doctrine in the relevant jurisdiction.
- Timeline-sensitive provisions are missed, especially waiting periods, notice-related sequencing, remediation timing, and the restoration period used for business interruption.
- Claimed losses are accepted at face value without reconciling them to the proof of loss, forensic accounting, environmental findings, maintenance history, fire response records, broker communications, and any compliance order.
- Business interruption, extra expense, mitigation, remediation, and repair costs are collapsed into one bucket instead of being analyzed under separate policy provisions.
- Valuation is applied without checking whether the policy uses replacement cost, actual cash value, depreciation, or a separate deductible for a particular endorsement.
- Arithmetic is presented without showing how the policy terms change the gross claim into covered and uncovered amounts.
- Conclusions are stated without identifying the controlling authority for the coverage rule being applied.

## 3. Legal frameworks / domain conventions that apply

- Coverage grant comparison: match each claimed category to the insuring agreement first, then test exclusions, exceptions, conditions, and endorsements in that order.
- Exclusion analysis: identify the operative exclusionary language, test the factual trigger, and then test any express exception, carveback, or conflicting grant.
- Causation doctrine: where loss may involve multiple causes, analyze the policy’s causation wording together with the jurisdiction’s controlling causation rule, including any anti-concurrent causation language or efficient proximate cause doctrine if applicable.
- Business interruption measurement: apply the policy’s waiting period, restoration period, and expense-offset mechanics before accepting any claimed income loss.
- Mitigation / sue-and-labor provisions: separate reasonable loss-prevention or emergency-response costs from ordinary repair cost; determine whether the policy treats them as reimbursable and whether insurer consent or notice is required.
- Remediation and repair conditions: treat consent, notice, cooperation, and sequencing requirements as coverage conditions when the policy makes them part of the recovery path.
- Valuation conventions: apply the valuation standard the policy actually uses for each category of property or equipment, and distinguish replacement cost from actual cash value where depreciation matters.
- Deductible conventions: apply the base deductible and any endorsement-specific deductible to the loss category to which they attach, then aggregate only after those adjustments.
- Controlling authority requirement: cite the policy provision, governing statute, regulation, or leading case supporting each legal conclusion rather than stating the result in bare conclusory form.

## 4. Analytical scaffolds

1. Inventory the claimed loss categories and sort them by coverage type: direct physical loss, business interruption, extra expense, mitigation, remediation, repair, cleanup, or valuation-based property loss.
2. For each category, identify the governing policy text: insuring agreement, exclusion, exception, endorsement, deductible, condition, valuation clause, or measurement clause.
3. For each issue, state the scale of the dispute using the source record itself: the affected property, the affected time period, the claimed amount or operational impact, and any threshold that the policy makes relevant.
4. Cross-reference each issue against the other documents in the record that bear on it, such as forensic findings, environmental observations, maintenance history, fire response information, broker communications, or compliance directives.
5. If multiple causes of loss appear in the record, analyze them one by one and then evaluate how the policy’s causation language allocates the loss.
6. For business interruption, determine the operative start and end points, apply any waiting period, identify offsets for avoided expenses, and test whether the reported figures are internally consistent with the operational facts.
7. For mitigation, remediation, or repair work, determine whether the policy treats those costs as recoverable, whether consent or notice was required, and whether the work was reasonably undertaken to prevent further covered damage.
8. For valuation issues, apply the policy’s stated valuation basis to the specific item or category and then test whether any deductible or depreciation adjustment changes the payable amount.
9. Conclude each issue by stating the coverage consequence for the insured: covered, partially covered, excluded, or conditionally covered, with the policy basis and the practical effect.
10. Organize the memo issue-by-issue so the reader can see the governing provision, the factual trigger, the interacting document, and the resulting coverage position in one pass.

## 6. Output structure conventions

- Coverage analysis memorandum, not a narrative summary.
- Use an issue-by-issue format grouped by policy provision or loss category.
- Begin with a short scope section identifying the source materials reviewed and the principal coverage questions raised by them.
- For each issue, include:
  - the governing policy text or provision category;
  - the relevant factual record from the supporting documents;
  - the controlling authority for the coverage proposition;
  - the policy interaction or cross-document conflict;
  - the consequence for coverage and the practical effect on recovery.
- Where more than one loss category or time period is in play, enumerate them first and then analyze them separately; do not blend distinct categories into one conclusion.
- Use ordinal severity labels only if the analysis is being presented as a prioritized issue list; if used, define the scale once and apply it consistently.
- End with a Recommended Actions section that gives concrete next steps, assigns each to a responsible role, and ties each step to the nearest policy, claim, or regulatory timing anchor.
- Keep arithmetic transparent but limited to the adjustments that the policy requires; show how exclusions, waiting periods, offsets, deductibles, and valuation rules change the result.
