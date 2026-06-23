---
name: draft-distribution-waterfall-memorandum
task_id: corporate-ma/draft-distribution-waterfall-memorandum
description: Guides step-by-step modeling and memorandum drafting for a private equity fund distribution waterfall, requiring application of the limited partnership agreement's fee offset provisions, the correct compounding convention, GP catch-up shortfall analysis, clawback assessment, and carried-interest holding-period analysis under the applicable tax rules.
activates_for: [planner, solver, checker]
---

# Skill: Draft Distribution Waterfall Memorandum

## 1. Subject-matter triage
- Confirm the governing fund documents, the disposition proceeds, and the relevant payment dates before modeling.
- Identify whether there is one disposition or multiple tranches of proceeds; if multiple, treat each as a separate waterfall pass and then aggregate only at the end.
- Separate fund-level economics from tax treatment: the memorandum should explain allocations under the partnership agreement first, then address carry and holding-period tax consequences as a distinct analysis.

## 2. Failure modes the skill is correcting
- Computing the waterfall using gross management fees without applying the agreement’s fee-offset provision, which overstates the amount allocated to return of capital and understates the LP preferred-return base.
- Applying a preferred-return convention by intuition rather than the exact compounding or simple-return instruction in the agreement.
- Treating GP catch-up as automatically complete even when the available proceeds only partially fund it, which leaves the residual shortfall untracked.
- Omitting prior portfolio-company distributions from the clawback review and therefore overstating the GP’s retained carry.
- Describing the result narratively without a usable waterfall table, running totals, and appendix calculations.
- Blending tax holding-period analysis into the distribution math without distinguishing the economic allocation from the carry character analysis.

## 3. Legal frameworks / domain conventions that apply
- Fee offset provision: many limited partnership agreements reduce management fees by specified categories of portfolio-company income or similar receipts; the waterfall must use the net fee after the contractual offset, not a gross-fee proxy.
- Return of capital and preferred return: the LPs are generally entitled to return of capital and any stated hurdle before the GP participates in residual profits; the agreement controls the priority, base, and accrual method.
- Preferred-return compounding convention: the agreement may require simple accrual, annual compounding, quarterly compounding, or another stated method; the selected convention governs the accumulated hurdle over the actual holding period.
- GP catch-up mechanism: once LPs receive capital and preferred return, the GP may receive a catch-up distribution until the cumulative split matches the carried-interest percentage specified in the agreement.
- Clawback framework: the GP’s prior carry must be tested against the whole-fund economics described by the agreement, not only the last transaction; the memorandum should state whether any excess carry is potentially returnable.
- Carried-interest holding period: tax characterization of carry depends on the applicable partnership-interest holding-period rules and the fund’s acquisition-to-disposition timeline for the sold investment.

## 4. Analytical scaffolds
- Start with a clean chronology: contribution date, acquisition date, fee accrual periods, preferred-return start date, disposition date, and distribution date.
- Build the waterfall in order:
  1. return of capital,
  2. preferred return,
  3. GP catch-up,
  4. residual carried-interest split.
- For each step, state the governing source clause, the base amount, the applicable rate or percentage, the accrual period, and the resulting allocation.
- If the agreement contains multiple allocation buckets, run the waterfall separately for each bucket and reconcile the totals to the full disposition proceeds.
- For catch-up, show whether the available proceeds fully fund the catch-up or leave a shortfall to be carried forward.
- For clawback, compare cumulative GP distributions against the GP’s whole-fund entitlement after taking account of all relevant portfolio-company realizations.
- For tax character, identify whether the holding period meets the required threshold and explain the consequence for carry character without mixing that issue into the fund-accounting allocation.

## 5. Vertical / structural / temporal relationships
- Distinguish among LP capital, GP capital, fund-level expenses, and management-fee offsets; each affects the return-of-capital base differently.
- Track the temporal sequence of accrual and payment; preferred return and catch-up are time-sensitive, and the end date for each accrual period matters.
- If proceeds are distributed in stages, preserve running cumulative totals across stages so later tranches reflect amounts already paid.
- Keep the economics and tax sections vertically separate: the distribution waterfall should come first, followed by clawback and holding-period analysis.

## 6. Output structure conventions
- Draft a formal memorandum in polished legal style with an introduction, assumptions, waterfall analysis, and conclusion.
- Include at least one waterfall table showing each step, amount distributed, recipient, and running cumulative total.
- Include supporting calculation tables in an appendix, with formulas or references to the governing input fields used in the model.
- Include a clawback analysis section that states the comparison being made, the conclusion, and any excess carry to date.
- Include a carried-interest holding-period section that states the relevant acquisition and disposition dates, the applicable holding-period rule, and the resulting tax characterization.
- If there is more than one affected period, scenario, or tranche, present separate rows for each before summarizing the aggregate result.
- End with practical recommendations or drafting notes only if the task requires them; otherwise keep the memorandum focused on the economic and tax analysis.
