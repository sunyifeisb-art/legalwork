---
name: draft-capital-call-distribution
task_id: funds-asset-management/draft-capital-call-distribution
description: Prepare capital call notices, distribution notices, allocation schedules, waterfall calculations, capital account statements, and a GP advisory memo from fund administration materials, applying the relevant fund governing documents, including mechanics for excused LPs, preferred-return accrual, credit-facility interest, tax considerations for exempt investors, and distribution sequencing.
activates_for: [planner, solver, checker]
---

# Skill: Draft Capital Call and Distribution Notices

## 1. Subject-matter triage
- Confirm the governing document hierarchy before calculating anything: fund agreement, side letters, credit facility terms, administrator reports, and any notice instructions.
- Identify whether the work is a single capital call, a single distribution, or a paired call/distribution cycle; if multiple periods or parties are involved, segregate them before drafting.
- Draft the operative notice/workbook files first; treat the GP memo as secondary and dependent on the completed mechanics.

## 2. Failure modes the skill is correcting
- Computing preferred return from fund inception instead of from each funded tranche, or blending tranches with different call dates and balances.
- Using the wrong day-count convention for preferred return or credit-facility interest, or applying one convention to both when the documents distinguish them.
- Failing to reallocate excused or excluded investor shares correctly across the remaining eligible investors.
- Omitting the fee-paying / fee-exempt distinction when a combined capital call includes management-fee funding.
- Treating a recapitalization distribution as a profits distribution instead of a return of capital for waterfall purposes.
- Failing to separate GP capacity distributions from carry distributions.
- Ignoring leverage-related tax exposure for exempt investors.
- Missing side-letter mechanics that change call timing, allocation, distribution priority, or notice obligations.
- Producing a memo without the underlying schedules, or a schedule without a clear reconciliation to the notices and capital accounts.

## 3. Legal frameworks / domain conventions that apply
- Capital calls follow the fund’s pro rata commitment mechanics unless a governing document or side letter modifies the allocation for excused, excluded, or fee-exempt investors.
- Notice amounts should reflect any credit-facility offset and any interest accrued under the facility agreement’s stated rate and day-count convention.
- Preferred return accrues on unreturned capital contributions from the date each contribution is funded, using the governing accrual method and compounding rule, if any.
- Distribution waterfalls typically proceed in sequence: return of capital, preferred return, catch-up if applicable, then residual profit split according to the carry structure.
- Recapitalization or refinancing proceeds may be treated differently from sale proceeds; classify each source before applying the waterfall.
- Tax-exempt investors may have exposure to debt-financed or operating income generated through a partnership structure; leverage can create reportable tax consequences even when the investor is otherwise exempt.
- Side letters can override default call, distribution, MFN, or reporting mechanics for a specific investor and must be applied on an investor-by-investor basis.
- Legal propositions in the memo should be anchored to the controlling fund documents and, where relevant, the governing tax or partnership framework cited in those documents.

## 4. Analytical scaffolds
1. Read the governing documents in order of priority and extract the operative mechanics for calls, distributions, waterfalls, fees, leverage, and notice requirements.
2. Enumerate every investor or investor class affected by the transaction before calculating allocations; if there is only one affected cohort, state that explicitly.
3. For each capital call component, separate the economic purpose of the draw, apply any exclusions or reallocations, and reconcile the total against the administrator or sponsor input.
4. For each funded tranche, compute preferred return separately from its funding date through the relevant cut-off date, then aggregate by investor.
5. If a credit facility is involved, calculate the net call amount after any offset and include accrued interest under the facility’s own methodology.
6. For each distribution source, classify the proceeds first, then apply the waterfall in order, preserving the distinction between return of capital, preferred return, catch-up, carry, and GP-capacity amounts.
7. Reconcile each capital account statement to prior calls, distributions, and any reclassifications so the ending balance ties to the transaction history.
8. Review side letters and MFN provisions for any investor-specific deviations that affect notice language, allocation, timing, or reporting.
9. Test the tax memo section for leverage-related exposure only after the economic waterfall is complete, so the tax discussion matches the actual economics.
10. Cross-check all deliverables against each other so the notices, schedules, waterfall workbook, capital accounts, and memo tell a single consistent story.

## 5. Vertical / structural / temporal relationships
- Capital-call timing governs when capital becomes unreturned and therefore when preferred return begins to accrue.
- Distribution timing governs what remains outstanding at the relevant cut-off date and whether a payment is return of capital or profit.
- Side letters operate investor-by-investor and may supersede default mechanics without changing the underlying fund-wide waterfall.
- Credit-facility economics can change the call amount and investor-level allocations without changing the fund’s ultimate capital-account treatment.
- Capital account statements must reflect the chronological sequence of calls, fees, distributions, and reclassifications, not just the transaction total.

## 6. Output structure conventions
- Produce the named files as operative work product, not narrative descriptions of them.
- Capital-call notices should state the amount due, due date, purpose, allocation method, and any investor-specific adjustments.
- Distribution notices should identify the distribution source, the waterfall step reached, and the amount payable to each recipient class.
- The allocation schedule should show investor-level allocations, exclusions, reallocations, and any fee or facility offsets in a row-based format that can be reviewed independently.
- The waterfall workbook should show the sequencing logic, tranche-by-tranche preferred return, and all class-level and investor-level outcomes.
- Capital account statements should tie opening balance, activity during the period, and closing balance for each investor or class.
- The GP advisory memo should be concise and practical, and should end with a Recommended Actions section stating the action, responsible role, and timing anchor.
- In the memo, cite the controlling document section or other authority for each material conclusion, and flag any tax-exempt investor exposure and any side-letter or MFN implications.
