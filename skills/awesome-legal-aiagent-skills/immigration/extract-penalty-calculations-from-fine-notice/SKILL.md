---
name: extract-penalty-calculations-from-fine-notice
task_id: immigration/extract-penalty-calculations-from-fine-notice
description: Structured audit of a civil penalty notice where the analysis must reconstruct the penalty calculation arithmetic from the notice's components, verify each step against the underlying findings, and identify contestable errors in violation count, rate application, or adjustment factor direction.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Analyze Penalty Calculations from Fine Notice

## 1. Subject-matter triage

- Treat the notice as a calculation audit, not a narrative summary.
- First identify whether the source set contains one penalty instance or multiple penalty instances, categories, periods, or respondent entities; enumerate them explicitly before analysis.
- If only one penalty stream exists, say so and explain why no further partition is needed.
- Separate the notice’s stated computation from the underlying factual findings, because contestable issues often arise where those two diverge.

## 2. Failure modes the skill is correcting

- Agents describe the penalty structure in general terms without decomposing the notice into its component inputs and formula steps, making arithmetic defects invisible.
- Adjustment factors are extracted without recording whether each one increases or decreases the rate, so a directional error is missed.
- The stated violation count is accepted without checking the supporting findings or inspection record.
- The analysis stays at the total-amount level and fails to isolate which component is wrong, weakening any challenge.
- Distinct penalty categories, time periods, or violation buckets are collapsed into one pass, masking category-specific errors.
- Legal conclusions are stated without naming the governing statutory or regulatory authority that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply

- Civil money penalties are usually determined by a governing statute or regulation that sets the violation category and the permissible penalty range; the applicable authority should be identified by name and section from the source set or training.
- The calculation commonly follows a layered structure: count of violations, selected base rate within the authorized range, applied adjustments or multipliers, resulting per-violation rate, and subtotal by category.
- Each factor must be treated with its stated direction; a mitigating factor cannot be applied as an enhancement, and an aggravating factor cannot be applied as a reduction without creating a contestable error.
- Violation-tier selection depends on the underlying violation history and the particular regulatory category; a higher tier must be justified by the record.
- Category subtotals roll up to the grand total; an error in any line item contaminates the final amount.
- The challenge analysis should connect each discrepancy to the governing rule, the affected source document, and the practical consequence for the respondent.

## 4. Analytical scaffolds

1. Source inventory: list every notice, exhibit, audit finding, inspection record, and attachment that bears on the calculation.
2. Scope enumeration: list each penalty category, time period, or respondent/entity separately before calculating anything.
3. Per-item deconstruction: for each item, extract the stated violation count, the applicable tier or rate source, each factor with direction and percentage or equivalent, the notice’s intermediate figures, and the stated subtotal.
4. Independent recomputation: recalculate each step from the extracted inputs and compare the result to the notice.
5. Factual cross-check: compare the notice’s count and classification to the underlying findings, then note any mismatch.
6. Authority check: identify the governing statute, regulation, or administrative standard that supports the rate choice, tier choice, or factor application.
7. Consistency review: look for internal inconsistencies within the notice, including mismatched counts, duplicated items, shifted categories, or conflicting subtotals.
8. Impact assessment: for every discrepancy, state the monetary effect, the source document interaction, and the downstream consequence for contestability.
9. Final roll-up: verify that verified subtotals sum to the verified grand total, and separate any arithmetic error from any judgmental or evidentiary dispute.

## 5. Vertical / structural / temporal relationships

- Track how each violation item maps from the underlying finding to the notice’s category, then to the rate selection, then to the subtotal.
- Preserve temporal distinctions when the notice spans more than one inspection date, violation date, or calculation period.
- If the notice applies different tiers, periods, or categories, do not average them; analyze each one on its own terms.
- When the notice references prior conduct or history, verify that the time sequence actually supports the escalated treatment.
- If the source set contains multiple calculations for the same conduct, identify whether they are alternative theories, duplicated charges, or inconsistent drafts.

## 6. Output structure conventions

- Produce a structured workbook-oriented analysis, not prose alone.
- Use a calculation-verification table with columns for:
  - Item / Category
  - Notice Violation Count
  - Verified Violation Count
  - Governing Authority
  - Rate or Tier Applied
  - Adjustment Factors with Direction
  - Notice Intermediate Figures
  - Independently Verified Figures
  - Notice Subtotal
  - Verified Subtotal
  - Discrepancy
  - Challenge Assessment
- Include a separate summary row for the grand total.
- Include a separate register of contestable items, with one row per issue and an ordinal severity label defined once at the top of the workbook.
- For each contestable item, state: the figure or threshold at issue, the related source document(s), the governing authority, the consequence of the error, and whether the issue is arithmetic, classification, evidentiary, or tier-selection related.
- Keep the workbook internally consistent; every issue listed in the register should trace to a row in the calculation table.
- If the source set supports a recommended next step, add a brief actions section identifying the action, the responsible role, and the timing anchor tied to the notice or response deadline.
