---
name: compare-corporate-tax-positions-against-irs-revenue-rulings
task_id: tax/compare-corporate-tax-positions-against-irs-revenue-rulings
description: Assessing corporate tax positions against revenue rulings requires careful attribution of each ruling to the specific position it governs, recomputation of affected credits or deductions, and aggregation of the net exposure across all positions.
activates_for: [planner, solver, checker]
---

# Skill: Compare Corporate Tax Positions Against IRS Revenue Rulings

## 1. Subject-matter triage

- Treat the source memo as the master list of positions and analyze each position in the order presented.
- First identify what each position is trying to achieve: credit computation, deduction timing, capitalization versus current deduction, or other tax treatment.
- Before comparing authorities, enumerate the positions in scope so each ruling is matched to the correct item and no position is collapsed into a generic pass.
- If the facts show only one timing period, one transaction stream, or one category of expenditure, say so affirmatively and explain why; otherwise analyze each discrete item separately.
- Read the revenue rulings as fact-patterned authorities, not as broad labels; apply only the ruling whose facts and holding align with the transaction and legal question at issue.

## 2. Failure modes the skill is correcting

- Misattributing a revenue ruling to the wrong tax position, which produces a correct-sounding but inapplicable conclusion.
- Stopping at issue spotting without recomputing the affected credit, deduction, or timing adjustment from corrected inputs.
- Assessing positions one by one without a final aggregate exposure view that separates overstated from understated items before netting.
- Assuming all wage, supply, or similar cost categories in a credit base qualify without testing each category against the governing standard.
- Accepting a payment label at face value instead of asking whether the transaction’s substance requires capitalization, amortization, or different timing.
- Describing a tax issue without naming the authority that controls the conclusion.

## 3. Legal frameworks / domain conventions that apply

- **Research credit — qualified wages:** Wages count only to the extent they are paid for qualified research activities under **IRC § 41** and the applicable regulations; managerial, administrative, sales, and other nonqualified labor must be excluded even if tangentially connected to projects.
- **Research credit — qualified supplies:** Supplies are includable only to the extent used directly in qualified research under **IRC § 41** and the regulations; items used for production, quality control outside the research function, or other nonqualifying purposes must be removed.
- **Research credit computation:** Once exclusions are identified, the credit must be recomputed from corrected inputs under the regular credit method or other applicable method; a conclusion that the base is wrong is incomplete without the revised calculation.
- **Lease-like payments for intangible rights:** A stream labeled as rent may in substance be an acquisition of intangible rights requiring capitalization and amortization rather than current deduction; apply the controlling income tax capitalization and amortization rules and the governing revenue ruling if it matches the fact pattern.
- **Economic performance and accrual timing:** Under **IRC § 461** and the economic performance rules, an accrual-method taxpayer may deduct a liability only when the all-events test is met and economic performance has occurred; revenue rulings on timing must be matched to the type of liability and the event triggering performance.
- **Ruling hierarchy:** Use the revenue ruling that addresses the same transaction type and legal question; if no ruling fits, fall back to the controlling Code section, regulation, or other recognized authority.
- **Net exposure presentation:** Present overstated and understated positions separately before netting to show both directionality and total effect.

## 4. Analytical scaffolds

- For each position, state:
  - the taxpayer’s claimed treatment,
  - the controlling authority,
  - the correct treatment,
  - whether the position is overstated or understated,
  - the resulting tax effect.
- When a position depends on a ruling, compare the ruling’s facts, issue, and holding against the source documents before applying it.
- For credit positions, audit the components line by line: identify each included wage or supply category, exclude nonqualifying items, and recompute the credit from corrected inputs.
- For deduction timing positions, identify the governing timing rule, determine the proper year of deduction, and quantify the adjustment caused by moving the item between periods.
- For capitalization questions, determine whether the expenditure creates or secures a durable right or asset; if so, identify the capitalization or amortization consequence rather than assuming current expensing.
- For every issue, close the analysis by tying the quantified adjustment to the relevant document set and explaining the downstream consequence for the taxpayer’s return position, audit risk, or reporting exposure.
- After all positions are analyzed, prepare a single summary that separates favorable and unfavorable adjustments, then provides the net aggregate exposure.

## 5. Vertical / structural / temporal relationships

- Track whether each position turns on a single year, multiple periods, or a timing shift across years; do not blend different periods into one conclusion.
- Where one document controls the factual assumptions and another controls the tax treatment, identify the interaction explicitly so the reader can see which source supports which conclusion.
- If multiple positions rely on the same authority, explain the common rule once and then apply it separately to each affected position.
- If a position affects another position’s base, timing, or classification, note the cross-effect before computing the final aggregate view.

## 6. Output structure conventions

- Write a tax position assessment memorandum organized by position number in the order presented in the source memo.
- Use a conventional memo structure with a brief executive summary, position-by-position analysis, and a closing exposure summary.
- For each position, include:
  - claimed tax position,
  - applicable authority,
  - analysis and comparison to the source documents,
  - corrected treatment,
  - quantified tax effect,
  - practical consequence,
  - recommended corrective action.
- Use clear labels for whether each position is overstated, understated, or properly reported.
- End with a concise aggregate exposure table that lists each position, the direction of adjustment, and the total net effect.
- Close with a Recommended Actions section using imperative verbs, the responsible role, and a timing anchor tied to filing, audit response, or other relevant milestone.
