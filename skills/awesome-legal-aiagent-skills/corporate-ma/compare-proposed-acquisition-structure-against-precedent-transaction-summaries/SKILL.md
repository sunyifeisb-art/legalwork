---
name: compare-acquisition-structure-precedent
task_id: corporate-ma/compare-proposed-acquisition-structure-against-precedent-transaction-summaries
description: Guides tax structure analysis for a proposed acquisition by comparing the proposed structure against precedent transaction summaries, working through the basis step-up economics, and identifying entity-specific tax considerations such as accumulated earnings and profits.
activates_for: [planner, solver, checker]
---

# Skill: Compare Proposed Acquisition Structure Against Precedent Transaction Summaries

## 1. Subject-matter triage

- Identify the target’s tax status first, then test whether the proposed acquisition path produces an asset-step-up result or leaves the buyer with carryover basis.
- Compare the proposed structure against each precedent transaction separately; do not blend unlike structures into a single generalized conclusion.
- If the source set includes multiple acquisition paths, elections, or closing mechanics, treat each as a distinct scenario and analyze them one by one before recommending a preferred structure.
- If the target has any prior corporate history, flag accumulated earnings and profits as a separate issue before discussing seller proceeds.

## 2. Failure modes the skill is correcting

- Comparing deal structures at a high level without building a structured precedent table that shows, for each comparable transaction, the target entity type, deal structure, whether a step-up was obtained, and the allocation of purchase price to amortizable assets.
- Failing to identify accumulated earnings and profits issues that may apply to an S-corporation target with a prior C-corporation history.
- Omitting the present value computation of the amortization benefit, which is the quantitative measure used to evaluate structure selection.
- Collapsing distinct seller-side and buyer-side tax consequences into a single “tax efficient” label.
- Discussing precedent deals without tying each comparison back to the proposed structure’s tax result and downstream economics.

## 3. Legal frameworks / domain conventions that apply

- Entity classification matters: analyze the target as an S corporation, C corporation, LLC, or partnership before assessing whether the transaction can be taxed as an asset deal, stock deal, or deemed asset acquisition.
- Basis step-up analysis: compare consideration paid against the target’s existing tax basis in the acquired business assets, and adjust for liabilities where tax rules require it; the economic point is the incremental basis available for depreciation or amortization.
- Section 197 and related depreciation rules: intangible assets commonly associated with acquisitions, including goodwill and similar amortizable intangibles, are generally amortized over the statutory period; tangible assets follow their own recovery periods under the depreciation rules.
- S corporation acquisition analysis: where the structure supports a tax-efficient deemed asset acquisition, evaluate whether the buyer can obtain inside basis step-up without a literal asset transfer, and identify any election or reclassification mechanism that produces that result.
- C corporation target analysis: if the target is, or was, a C corporation, assess whether the structure triggers corporate-level gain in addition to shareholder-level tax, and weigh that tax cost against any basis benefit.
- Partnership or LLC target analysis: a direct asset purchase normally produces inside basis step-up; where the structure is not a straight asset acquisition, evaluate any adjustment election or analogous mechanism that affects inside basis.
- Accumulated earnings and profits: for an S corporation with C corporation history, distributions can be dividend-like rather than basis recovery; evaluate whether a pre-closing distribution creates dividend risk or planning opportunity.
- Present value of tax benefits: the value of basis step-up is measured by the discounted value of the future tax shield, not by the nominal amount of the step-up alone.
- Controlling authorities should be cited for each tax proposition relied on, using the applicable Code provisions, Treasury regulations, or recognized authorities reflected in the source materials or standard tax practice.

## 4. Analytical scaffolds

1. Target entity type and history
   - Identify the legal entity type, any prior elections, and any prior corporate history that changes the tax profile.

2. Proposed acquisition structure
   - Describe the transaction mechanics and determine whether the structure is intended to produce a stock result, an asset result, or a deemed asset result for tax purposes.

3. Precedent-by-precedent comparison
   - For each precedent, note the target entity type, transaction form, whether step-up was achieved, how purchase price was allocated, and any structural feature that drove the tax outcome.
   - Keep each precedent separate; if the source materials contain more than one comparable, create one comparison row per deal.

4. Basis step-up economics
   - Determine the amount of incremental basis available from the proposed structure.
   - Separate the analysis by asset class so the amortization and depreciation consequences are visible.

5. Allocation and amortization analysis
   - Allocate consideration across relevant asset categories commonly used in tax allocations.
   - Identify the recovery period or amortization treatment for each category and explain which classes produce the largest tax shield.

6. Present value analysis
   - Discount the future tax shield from amortization and depreciation to present value.
   - Use the comparison to determine whether the proposed structure economically outperforms the precedents.

7. Seller-side tax cost
   - Analyze shareholder or seller-level gain recognition under the chosen structure.
   - If the target is a C corporation or has C corporation history, account for layered tax cost where relevant.

8. Accumulated E&P analysis
   - Determine whether any accumulated earnings and profits remain relevant.
   - Evaluate whether distributions before closing are tax-efficient or instead create dividend treatment risk.

9. Recommendation synthesis
   - State whether the proposed structure is tax-superior, tax-neutral, or tax-inferior relative to the precedents, and explain why.
   - Identify the principal tax risks, the structural lever that matters most, and the practical closing recommendation.

## 5. Vertical / structural / temporal relationships

- Distinguish buyer-side economics from seller-side tax cost; a structure that maximizes step-up may still be unattractive if it creates excessive seller-level tax.
- Tie each precedent to the proposed structure on the same axes: entity type, closing form, basis result, and amortization profile.
- If there are multiple time-sensitive items in the source set, evaluate them in closing order: pre-closing distributions, election timing, signing-to-closing mechanics, and post-closing tax reporting.
- When a prior entity history changes the current tax analysis, treat the historical period as vertically relevant to the current acquisition, not as background only.

## 6. Output structure conventions

- Write a tax structure comparison memo in conventional memo form with:
  - short issue summary
  - proposed structure description
  - precedent comparison table
  - basis step-up and allocation analysis
  - present value of tax benefit analysis
  - seller-side tax analysis
  - accumulated earnings and profits analysis
  - recommendation and risk summary
- Use a table for the precedent comparisons; one row per precedent, with columns for entity type, transaction form, step-up result, allocation / amortization profile, and distinguishing tax feature.
- State any tax conclusion with the authority supporting it, not as a bare conclusion.
- If the source set contains more than one scenario, present them in separate subsections or rows rather than averaging them.
- End with a concise recommendation that identifies the preferred structure and the reason it is preferred.
- If the deliverable is a memo, the file should be drafted as the operative work product, not as a placeholder outline.
