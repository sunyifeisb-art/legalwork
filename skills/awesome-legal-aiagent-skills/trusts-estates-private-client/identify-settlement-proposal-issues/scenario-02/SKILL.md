---
name: identify-settlement-proposal-issues-divorce-scenario-02
task_id: trusts-estates-private-client/identify-settlement-proposal-issues/scenario-02
description: Generalizes the settlement-issue spotting workflow for a contested divorce proposal, with emphasis on checking support-duration assumptions against the marriage-length context, verifying whether equity-compensation division uses a coverture-style fraction for each vesting tranche, and noting when one asset allocation is being used to justify trade-offs in another area.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Divorce Settlement Proposal (Variant)

## 2. Failure modes the skill is correcting
- Missing the main bargaining distortions: a proposal may look balanced in the aggregate while hiding a weak point in support, deferred compensation, or property allocation.
- Treating compensation that vests over time as if it were a single present asset, which can erase the timing risk and distort the division analysis.
- Accepting a support term at face value without testing it against the marriage-length context and the benchmark used in the governing jurisdiction.
- Failing to spot offset logic, where a favorable allocation in one bucket is used to pressure acceptance of a disadvantage in another.
- Describing issues without tying them to the source record, the interacting documents, and the practical consequence for the client.
- Writing a generic memo that does not force priority ordering, severity, or a concrete follow-up path.

## 3. Legal frameworks / domain conventions that apply
- Use the governing domestic-relations framework in the case materials, together with the jurisdiction’s support and property-division rules identified in the record.
- For deferred compensation, analyze vesting, separation date, and any marital fraction or similar allocation method the source materials use for future vesting.
- For support, compare the proposed duration to the marriage-length benchmark and any stated statutory or guideline framework referenced in the materials.
- For property offsets, evaluate the settlement as a package, not as isolated line items, and identify whether a stronger term in one category is being traded for a weaker term in another.
- Where the record identifies a controlling statute, rule, guideline, or case, cite it in the memo; do not state a legal conclusion without naming the authority that supports it.
- Keep the analysis grounded in the document set; do not import extra assumptions about value, duration, or allocation structure that are not supported by the source materials.

## 4. Analytical scaffolds
- Start by identifying the distinct settlement issues actually presented in the materials; if multiple assets, periods, or claims are in play, separate them before analysis rather than collapsing them into one pass.
- For each issue, state:
  1. what term the proposal uses,
  2. what the supporting documents show,
  3. how the term deviates from the relevant benchmark or allocation method,
  4. why the deviation matters to the client.
- For support:
  - compare duration, structure, and termination triggers against the marriage-length context;
  - explain any shortfall in categorical terms tied to the record’s benchmark;
  - note any interaction with property division or liquidity terms.
- For deferred compensation:
  - check whether the proposal preserves a marital-fraction or tranche-by-tranche approach for future vesting;
  - distinguish vested, unvested, and post-separation accrual features;
  - note whether valuation assumptions are being substituted for allocation rules.
- For asset trade-offs:
  - identify the asset or right that is allegedly more favorable;
  - state the concession it is being used to support;
  - explain whether the trade is economically real or only apparent.
- Rank issues by practical importance to settlement leverage, client economics, and litigation risk.

## 5. Vertical / structural / temporal relationships
- Track each asset or obligation through time: separation, valuation date, vesting periods, payment periods, and termination events.
- Where a right accrues in tranches, analyze each tranche as a separate temporal unit rather than as a single lumped interest.
- Where support interacts with property division, flag whether one term is being used to justify a compromise on the other.
- Preserve the direction of the trade-off: note who gives up value now, who receives value later, and whether the exchange is symmetric or only facially so.
- If the proposal compares present-value concepts to forward-looking rights, keep the analysis from mixing valuation logic with allocation logic.
- If a document set includes more than one proposal version or disclosure snapshot, compare them in sequence and identify the moving parts.

## 6. Output structure conventions
- Produce a prioritized issue-spotting memo in conventional legal-memo form, not a checklist dump.
- Begin with a short executive summary that identifies the most consequential settlement pressure points.
- Use a severity label for each issue, with a consistent ordinal scale defined once at the top.
- For each issue, include:
  - a concise issue heading,
  - severity,
  - source-based description of the proposal term,
  - controlling authority or governing convention if identified in the record,
  - the cross-document interaction that matters,
  - the client consequence,
  - a short recommendation or negotiation question.
- Keep the memo issue-oriented and action-oriented; avoid long exposition that does not change settlement strategy.
- End with a Recommended Actions section that assigns each step to a role named in the source materials and ties it to the next procedural milestone or deadline reflected in the record.
- Use neutral, professional language and do not include unsupported arithmetic or speculative values.
