---
name: compare-current-year-filing-positions-against-prior-year-returns
task_id: tax/compare-current-year-filing-positions-against-prior-year-returns
description: A year-over-year tax position deviation analysis must identify not only numerical differences but the legal consequences of each deviation, including downstream effects on losses, classification disputes, and documentation requirements, before filing.
activates_for: [planner, solver, checker]
---

# Skill: Compare Current-Year Filing Positions Against Prior-Year Returns

## 1. Subject-matter triage
- Treat the work as a comparative filing-position review, not a generic return prep exercise.
- Separate true position changes from drafting noise, carryforward rollovers, formatting differences, and source-document omissions.
- If only one return period or one filing position is actually in scope, say so explicitly and explain why; do not analyze hypothetical periods.

## 2. Failure modes the skill is correcting
- Flagging a deviation without tracing its downstream consequences across the return and any later periods.
- Treating property classification as an accounting question rather than a tax characterization question with depreciation and recapture consequences.
- Missing a year-over-year increase in a related-party charge that may require arm's-length support and transfer-pricing documentation.
- Identifying charitable contribution deductions without checking the applicable limitation, carryforward treatment, and appraisal or substantiation requirements for large noncash contributions.
- Collapsing multiple deviations into one generalized risk statement instead of analyzing each position on its own facts, authority, and effect.
- Describing a tax issue without tying it to the governing Code, regulation, or other controlling authority.
- Stopping at variance identification without stating the filing consequence, follow-on exposure, or pre-filing fix.

## 3. Legal frameworks / domain conventions that apply
- **Meals and entertainment limitations:** When reviewing expense deductions, verify whether any category is subject to partial disallowance or special substantiation rules, and compare the current-year treatment to the prior-year return under the applicable Code and regulations.
- **Property classification:** Distinguish tangible personal property from building components and other real property using the applicable tax characterization rules. Review whether the current-year filing changes depreciation eligibility, recovery period, and potential recapture character under the relevant depreciation provisions and regulations.
- **Related-party charges and transfer-pricing support:** When fees charged between related parties change materially year-over-year, assess whether the increase is supported by contemporaneous documentation, benchmarking, or another arm's-length analysis under the transfer-pricing rules.
- **Research and development credits:** Verify whether claimed research expenditures are supported by contemporaneous documentation created at or near the time the activities were performed, including records linking personnel, projects, and qualified activities under the applicable credit provisions.
- **Charitable contribution limitations and carryforwards:** For corporate charitable deductions, apply the applicable annual limitation, track any excess amount for carryforward, and verify any required appraisal or other substantiation for noncash contributions under the governing deduction rules.
- **Bonus depreciation schedule:** Verify that any bonus depreciation rate used in the current-year filing matches the applicable phase-down for the tax year at issue rather than a prior-year rate under the bonus depreciation statute and related guidance.
- Use the source documents' terminology where it maps cleanly to tax concepts, but anchor every legal conclusion in the controlling tax authority rather than in bookkeeping labels.

## 4. Analytical scaffolds
- Start by enumerating all material filing positions, schedules, elections, and supporting assumptions that appear to have changed or may have changed year over year.
- Compare each current-year position to the prior-year return and supporting schedules on a position-by-position basis; do not rely on a single aggregate variance view.
- For each deviation, identify:
  - the position changed;
  - the prior-year treatment;
  - the current-year treatment;
  - the controlling tax authority;
  - the factual predicate supporting or undermining the change;
  - the tax effect in the current year;
  - the downstream effect on carryforwards, basis, depreciation, recapture, credits, or future-year filing positions;
  - the documentation still needed before filing, if any.
- Quantify each issue against the source record using the relevant amount, period, limit, threshold, term, or other scale reflected in the documents; do not leave an issue at a purely qualitative level.
- Cross-check each deviation against interacting schedules, elections, workpapers, and referenced support to make sure the position is internally consistent across the return package.
- When a change affects a deduction, credit, classification, or timing item, trace both the immediate tax return effect and the downstream consequence for later periods.
- For legal support, identify the governing authority for the proposition being applied; do not state a conclusion without naming the rule that supports it.
- Rank issues by practical filing risk, then discuss the highest-risk items first.

## 5. Vertical / structural / temporal relationships
- Treat the prior-year return as the baseline and the TY2023 draft positions as the proposed change set.
- Distinguish between a one-year timing shift, a permanent characterization change, and a recurring methodology change; each has different filing consequences.
- Where a current-year line item depends on a prior-year carryforward, opening balance, basis schedule, or accumulated limitation, confirm the vertical tie-out before analyzing the deviation.
- If a position change flows from a schedule into the main return, explain the path of the effect from support schedule to return line to downstream carryover.
- If the source set contains multiple periods of support, compare the operative period that governs the filing position rather than mixing periods indiscriminately.

## 6. Output structure conventions
- Produce a tax deviation and risk analysis memorandum organized by issue and sequenced from highest to lowest risk.
- Define one ordinal severity scale at the outset and apply it uniformly to every issue.
- For each issue, include:
  - issue description;
  - severity;
  - prior-year position;
  - current-year position;
  - deviation type;
  - controlling authority;
  - source-document support or gap;
  - current-year tax effect;
  - downstream effect;
  - cross-reference to the interacting schedule or workpaper;
  - recommended filing action.
- Use a concise summary table up front that lists every deviation, its severity, and its principal tax consequence.
- End with a Recommended Actions block that assigns each action to the appropriate role and ties timing to the filing deadline or other relevant milestone.
- Keep the memo practical: emphasize what should change before filing, what must be documented, and what remains a defensible position if left unchanged.
