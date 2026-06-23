---
name: compare-plan-feasibility-projections-vs-historical
task_id: bankruptcy-restructuring/compare-plan-feasibility-projections-against-historical-financials
description: Ensures a feasibility analysis memo tests each projection metric against historical actuals, verifies internal arithmetic, accounts for mandatory cash sweep obligations omitted from projections, and frames the analysis under the applicable plan-confirmation feasibility standard.
activates_for: [planner, solver, checker]
---

# Skill: Compare Plan Feasibility Projections Against Historical Financials

## 1. Subject-matter triage
- Treat the task as a comparison-and-advisory memo, not a generic summary.
- If the materials contain multiple forecast vintages, operating cases, or historical periods, enumerate them first and analyze each explicitly rather than blending them into one pass.
- If only one projection set or one historical baseline is provided, state that expressly and explain why no alternate comparison set is available.

## 2. Failure modes the skill is correcting
- Agent identifies headline revenue and EBITDA projections but does not test them line by line against historical actuals across multiple years.
- Agent misses arithmetic errors embedded in the projections — EBITDA build errors, free cash flow errors — that create an internally inconsistent picture.
- Agent fails to model the impact of mandatory excess cash flow sweep obligations that the projections omit, thereby overstating available cash.
- Agent does not apply the applicable plan-confirmation feasibility standard explicitly or frame a concrete recommendation in procedural terms.
- Agent discusses reasonableness in the abstract without tying each issue to a quantified historical comparator, the interacting covenant or assumption, and the practical consequence for feasibility.
- Agent gives a diagnosis without a clear action recommendation, timing anchor, or responsible owner.

## 3. Legal frameworks / domain conventions that apply
- Feasibility standard: the plan should not be likely to be followed by liquidation or further reorganization; projections must be reasonable, internally consistent, and supportable in light of the capital structure and operating history.
- Projection testing dimensions: revenue growth versus historical growth; gross margin trend versus historical best year; SG&A as a percentage of revenue versus historical actuals; EBITDA arithmetic verification; free cash flow calculation; depreciation and amortization trends relative to capex and any fresh-start accounting step-up; working capital cycle assumptions.
- Excess cash flow sweep: if the emergence financing or comparable debt package requires mandatory prepayments from excess cash flow, projected liquidity must reflect that burden rather than assume full retention of cash.
- Net operating loss limitations: if post-emergence tax attributes are used to reduce projected taxes, reflect any applicable limitation associated with an ownership change or similar restriction.
- Fresh-start accounting: post-emergence depreciation and amortization should align with stepped-up asset values and expected capital expenditure; declining D&A despite continuing capex warrants explanation.
- Sensitivity analysis: the absence of downside cases or margin-of-safety testing is itself relevant to the feasibility inquiry.
- Use controlling legal authorities for the feasibility proposition and any tax or financing limitation actually relied upon in the memo; do not state a legal conclusion without naming the supporting rule, statute, regulation, or case.

## 4. Analytical scaffolds
- Build a comparison matrix for each available period that pairs projected metric, historical actual, direction of change, and reasonableness assessment.
- Test each key projection metric against historical actuals for every available year of history.
- Verify EBITDA, free cash flow, and any other presented roll-forward arithmetic independently in each projected year.
- Trace every cash flow component to the assumptions that drive it, including debt service, capex, working capital, taxes, and any mandatory sweep or prepayment feature.
- Evaluate each major assumption as reasonable, aggressive, or unrealistic based on the actual operating track record and source materials.
- Quantify the impact of any omitted sweep, tax limitation, or accounting convention on liquidity and covenant headroom.
- Separate a projection that is merely optimistic from one that is internally inconsistent or arithmetically incorrect.
- Note the absence of sensitivity or downside analysis as a standalone feasibility vulnerability.
- Frame a clear feasibility conclusion and vote recommendation that follows from the issue-by-issue analysis.

## 5. Vertical / structural / temporal relationships
- Compare projected periods to the most recent historical periods first, then step back to longer-run trends if they are available.
- Where assumptions move in opposite directions across the forecast horizon, explain whether the trend is a temporary bridge or a sustained operating thesis.
- Distinguish pre-emergence history, emergence-period assumptions, and post-emergence steady-state projections when the materials span those stages.
- If the plan relies on a step-up, reset, refinancing, or other structural change, explain how that change affects the trajectory of margins, depreciation, taxes, and available cash over time.

## 6. Output structure conventions
- Produce a client-ready feasibility analysis memo with a short executive summary, a comparison table, numbered issue sections, and a closing recommendation.
- Define a simple ordinal severity scale once near the top and apply it consistently to each issue.
- For each issue, use the same internal logic: Projection Assumption → Historical Comparison → Severity → Assessment → Feasibility Impact.
- Each issue should close with three moves: quantify the divergence or exposure using figures from the source set; tie it to the interacting assumption, covenant, or document feature; and state the downstream consequence for feasibility, liquidity, or vote support.
- Include an explicit conclusion on whether the plan appears feasible under the governing standard and whether the vote recommendation is support, oppose, or reserve judgment.
- End with a Recommended Actions block that uses imperative verbs, names the responsible role, and includes a timing anchor tied to the confirmation or solicitation timeline.
- Keep the memo self-contained and commercially polished; use industry-conventional headings rather than the exact section labels from the rubric.
