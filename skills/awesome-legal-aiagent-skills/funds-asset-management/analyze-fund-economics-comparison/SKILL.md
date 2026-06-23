---
name: analyze-fund-economics-comparison
task_id: funds-asset-management/analyze-fund-economics-comparison
description: Review fund formation materials including governing fund documents, offering materials, side letters, a fee workbook, a waterfall model, a prior-fund term sheet, and an investor commitment schedule to produce a full fund economics analysis covering consistency checks, side-letter economics, MFN cascade impact modeling, prior-fund comparison, and model error identification.
activates_for: [planner, solver, checker]
---

# Skill: Fund Economics Comparison Analysis

## 1. Subject-matter triage
- Treat the governing fund documents as the controlling economics source; read the offering materials, side letters, model, and prior-fund materials against that baseline.
- Enumerate every investor, side letter, economic concession, MFN tier, and prior-fund change before analysis; do not rely on a representative sample.
- If the source set contains only one item in any of those categories, say so affirmatively and explain why no broader pass is needed.

## 2. Failure modes the skill is correcting
- Producing an incomplete discrepancy review by missing a fee, carry, waterfall, preferred-return, recycling, or expense-cap conflict between disclosure and governing documents.
- Omitting investors from the side-letter matrix, leaving economic fields blank, or failing to tie each investor to MFN eligibility.
- Modeling MFN impact only in qualitative terms, or failing to separate worst-case from expected-case election behavior.
- Missing arithmetic or logic defects in the waterfall, including catch-up overpayment, preferred-return compounding errors, or inconsistent treatment of fee timing.
- Failing to compare the current fund against the prior fund term sheet term-by-term, or failing to state whether each change is GP-favorable or LP-favorable.
- Treating side letters, MFN elections, waterfall mechanics, and prior-fund changes as isolated when the interaction among them changes the economics.

## 3. Legal frameworks / domain conventions that apply
- The offering materials should track the governing fund documents on all material economic terms; any inconsistency is a disclosure and documentation risk that should be resolved before the next closing or investor update cycle.
- Review economics by category: management fee, carried interest, preferred return, waterfall structure, recycling, organizational expenses, offsets, and termination mechanics.
- Side letters modify fund terms at the investor level and must be read together with the MFN framework; an election right can amplify a concession beyond the originally named investor.
- MFN rights are typically tiered by commitment size or similar eligibility criteria; the analysis should identify who can elect, what can be elected, and the resulting economic effect.
- Preferred-return compounding frequency changes the effective economic hurdle; if compounding differs across investors, the waterfall must track those accruals separately.
- Fee-in-arrears changes timing and termination economics because the fund finances the service period before payment.
- A whole-fund waterfall with multiple hurdle rates increases administrative complexity because each investor’s accrual path must be tracked separately.
- Catch-up mechanics should be checked against the target carry percentage and bounded to avoid overpayment.
- Organizational expenses should be compared against the stated cap, and any excess should be identified as a GP cost if the governing terms so provide.
- Recycling language should be compared across documents because mismatches are economically material even where the headline fee terms are aligned.
- For every legal proposition or document-construction statement, name the controlling document, section, schedule, or clause category that supports it; do not state the conclusion without anchoring it to the source language.

## 4. Analytical scaffolds
1. Start with the governing fund documents and build a term map of all economic provisions that drive the analysis.
2. Compare offering materials against that term map and log each mismatch with the affected provision, the corresponding governing provision, the materiality, and the likely remediation path.
3. Build the side-letter matrix for every investor, using one row per investor and one column per economic feature or election right.
4. Mark the base fund term as the reference point, then identify every investor-specific deviation and the MFN eligibility that could replicate it across the investor base.
5. For each side-letter concession, test both a worst-case election scenario and a realistic election scenario, and translate each into fee and carry effects.
6. Check the waterfall model for formula logic, timing assumptions, preferred-return accrual, catch-up design, and any investor-specific hurdle tracking.
7. Compare the current fund to the prior fund term-by-term, and classify each change as economically GP-favorable, LP-favorable, or neutral.
8. Assess interactions: a side-letter concession that changes timing, compounding, or eligibility may alter the waterfall, MFN, or expense treatment elsewhere.
9. For each identified issue, include the source basis, the scale of the effect, the interacting document or clause, and the downstream consequence for the fund, sponsor, or investors.
10. Close with practical remediation and sequencing so the output supports execution, not just issue spotting.

## 5. Vertical / structural / temporal relationships
- The governing documents control the economics; the offering materials are disclosure and should match them.
- Side letters sit below the fund documents in form but can override economics for the named investor, subject to MFN elections that may spread the benefit.
- The waterfall model is the computational layer that should reconcile the documents’ economics into a coherent operating structure.
- The prior-fund materials are the historical comparator and should be used to identify shifts in sponsor economics, investor protections, and administrative complexity over time.
- Timing matters: fee accrual, preferred-return compounding, election windows, and closing sequence can all change the outcome even where headline economics appear unchanged.

## 6. Output structure conventions
- Produce five work products using conventional labels: a fund economics comparison memo, a discrepancy log, a side-letter economics matrix, an MFN impact model, and a prior-fund comparison table.
- The memo should read as an advisory deliverable and end with a Recommended Actions section that assigns each action to a role and ties it to a milestone or urgency point.
- Use an ordinal severity scale for issue tracking and apply it consistently across discrepancy and model-error entries.
- Each issue entry should include: the affected provision, the source basis, the scale or magnitude of the issue, the interacting provision or document, the consequence, and the severity.
- In the side-letter matrix, include every investor and all core economics fields, plus an MFN eligibility indicator and any special economics or election rights.
- In the MFN model, separate worst-case from expected-case outcomes and show both fee and carry consequences in dollar terms without collapsing them into one blended result.
- In the prior-fund comparison table, identify each change in plain terms and state whether it is sponsor-favorable or investor-favorable.
- Keep the deliverables operational: use tables for systematic comparison, narrative for synthesis, and explicit action items for remediation.
