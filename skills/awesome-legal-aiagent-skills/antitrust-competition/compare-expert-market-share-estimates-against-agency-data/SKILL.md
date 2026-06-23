---
name: compare-expert-market-share-estimates-against-agency-data
task_id: antitrust-competition/compare-expert-market-share-estimates-against-agency-data
description: Closes gaps in independent arithmetic verification of concentration calculations, identification of methodology differences that explain divergent results, and cross-examination vulnerability assessment.
activates_for: [planner, solver, checker]
---

# Skill: Expert Market Share Discrepancy Analysis

## 1. Subject-matter triage
- This skill applies when the source set contains two market-share analyses that must be compared against agency-derived data in a merger-review context.
- First identify the market(s) and analysis period(s) actually in scope; if more than one market, expert, or time slice is present, enumerate them explicitly before comparing results.
- If the source materials do not contain enough data to recompute a figure, say so and isolate the missing inputs rather than filling gaps by inference.

## 2. Failure modes the skill is correcting
- Baseline accepts reported concentration figures at face value rather than recomputing them independently; arithmetic errors in share-based calculations are common and create avoidable impeachment risk.
- Baseline fails to isolate the specific reason two experts diverge; product scope, geographic scope, transaction timing, pricing basis, customer versus shipment data, and treatment of fringe firms often drive different outputs.
- Baseline does not surface hidden assumptions; undisclosed market-definition choices, boundary selections, and measurement bases are vulnerable on cross-examination.
- Baseline collapses agency data and party-retained analyses into one narrative; the source, granularity, and coding conventions must be separated to explain divergence correctly.
- Baseline describes discrepancies without showing practical consequence; the memo must tie each issue to whether the concentration conclusion is overstated, understated, or directionally unchanged.

## 3. Legal frameworks / domain conventions that apply
- Use the accepted concentration framework for merger review: independently verify pre-transaction concentration, post-transaction concentration, and the change in concentration from the underlying shares.
- Assess concentration against the relevant agency or case-law thresholds used in the record, and identify whether the figures place the market in a zone of potential structural concern.
- Treat geographic market definition, product market definition, and data basis as separate axes; a mismatch on any one can explain materially different results even if arithmetic is correct.
- Recognize the standard sources of divergence in agency versus expert work: public data, coded industry data, compulsory productions, shipment records, revenue records, and customer-level data may not be comparable.
- For impeachment purposes, arithmetic defects are generally more damaging than defensible methodology choices; undisclosed assumptions sit between the two.
- A legal conclusion about concentration significance must be tied to the governing threshold or agency framework used in the source set, not to a naked assertion of “high” or “low” concentration.

## 4. Analytical scaffolds
1. Build a comparison set for each market and analysis period:
   - Expert A’s reported figures
   - Expert B’s reported figures
   - Agency or staff figures
   - Independently recomputed figures from the source data
2. Recompute each concentration metric from the underlying shares and verify that all subtotals, totals, and percentages reconcile.
3. For every discrepancy, classify the root cause as:
   - arithmetic error,
   - methodology difference,
   - data source difference, or
   - undisclosed assumption.
4. Test each discrepancy for directionality:
   - whether it raises or lowers concentration,
   - whether it affects the pre/post/change figures equally or differently,
   - whether it alters the threshold assessment.
5. Separate defensible analytical judgment from avoidable error:
   - a reasonable market-definition choice should be labeled as a methodology dispute,
   - a misadded total or mismatched share set should be labeled as an arithmetic defect.
6. Where the record permits, infer the downstream effect on the merger narrative:
   - does the discrepancy strengthen structural-concern arguments,
   - weaken them,
   - or leave them unchanged.
7. Rank issues by cross-examination vulnerability:
   - face-of-the-page arithmetic defects first,
   - then undisclosed assumptions,
   - then bona fide methodology disputes that can be defended if disclosed.
8. End each issue with three closing moves:
   - scale it against the relevant figure or threshold in the record,
   - identify the interacting source material or assumption,
   - state the consequence for the client’s litigation or review position.

## 5. Vertical / structural / temporal relationships
- Compare the analyses market-by-market, not as a blended portfolio, unless the source materials themselves aggregate them.
- Compare the same time frame across experts; if one uses a different period, explain the temporal mismatch and its effect on comparability.
- Preserve the hierarchy between raw data, adjusted data, calculated shares, and concentration outputs; an error at any lower layer propagates upward.
- Treat agency data as a separate vertical layer from expert assumptions; note whether the agency relied on public information, produced data, or internal coding conventions.
- If one expert uses a broader or narrower universe than the other, explain whether the difference is upstream of the calculation or only affects the final concentration result.

## 6. Output structure conventions
- Open with a short executive summary stating the overall comparison result and the highest-risk discrepancies.
- Include a comparison table for each market with columns for:
  - source / expert,
  - reported concentration figures,
  - independently verified figures,
  - threshold or benchmark used in the record,
  - whether the result indicates a structural concern.
- Include an issue register with one entry per discrepancy.
- For each issue, state:
  - identifier,
  - severity on a defined ordinal scale,
  - nature of discrepancy,
  - root cause category,
  - direction of impact,
  - cross-examination vulnerability,
  - related source material or assumption,
  - consequence for the client,
  - recommendation.
- Define the severity scale once at the top and apply it consistently; reserve the highest severity for issues that are both easily provable and outcome-altering.
- Add a concise data-sources section identifying which agency materials support the government analysis and how those materials differ from the parties’ expert inputs.
- End with a Recommended Actions block in imperative form, assigning each action to the appropriate role and tying it to the memo’s filing or review timeline.
- Keep recommendations operational: correct arithmetic errors, disclose assumptions, reconcile source bases, and rerun affected calculations.
