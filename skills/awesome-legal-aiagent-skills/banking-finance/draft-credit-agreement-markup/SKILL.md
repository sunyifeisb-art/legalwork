---
name: draft-credit-agreement-markup
task_id: banking-finance/draft-credit-agreement-markup
description: Produces a borrower-side markup memo identifying deviations between a draft credit agreement and the operative financing summary materials, with proposed redlines and priority classification.
activates_for: [planner, solver, checker]
---

# Skill: Borrower's Counsel Credit Agreement Markup Memo (LBO Financing)

## 1. Subject-matter triage (only if applicable)

- Treat the draft credit agreement as the primary work product and the memo as a secondary advisory attachment.
- First confirm the operative source set: executed term sheet, commitment letter, partner instructions, and the draft agreement.
- If the source materials address multiple tranches, baskets, currencies, maturity paths, or borrower entities, enumerate them before analysis and review each separately.
- If only one facility or one borrower group is in scope, state that explicitly and proceed on that basis.

## 2. Failure modes the skill is correcting

- Failing to cross-check each financial covenant level against the operative financing summary materials; even small numeric differences can create a more restrictive covenant than intended.
- Missing the absence of a replacement lender or comparable transfer mechanism, which is a common borrower protection against holdout lenders blocking amendments or waivers.
- Stating restricted payment basket components imprecisely, without separating any fixed-capacity and ratio-based components that both need to be checked.
- Specifying the equity cure rolling cap without stating both the per-period dimension and the lifetime dimension.
- Collapsing distinct deviations into a generic “market” comment instead of isolating each operative difference, its source, and its consequence.
- Marking issues narratively without a durable plain-text redline convention that survives export.

## 3. Legal frameworks / domain conventions that apply

- Compare the draft credit agreement against the operative financing summary materials provision by provision; the deal documents control commercial intent, and the markup should reflect that hierarchy.
- Financial covenant levels must be checked line by line against the agreed summary; any divergence should be treated as a borrower-side point requiring explicit confirmation or correction.
- Borrower-transfer protection should be verified for a workable replacement lender or transfer-out mechanism where a lender refuses a routine amendment, waiver, or consent.
- Restricted payment capacity should be parsed by component, including any fixed basket, ratio basket, builder basket, carve-outs, and carryforward logic.
- Equity cure mechanics should be checked for both frequency and lifetime constraints, including any rolling-window formulation.
- Defined terms, basket mechanics, lien permissions, debt incurrence, investments, junior debt, prepayment rights, mandatory prepayments, and amendment mechanics should be checked for internal cross-references and consistency.
- For any proposition presented as controlling, cite the governing source in the work product by name or section where available; do not state a conclusion without tying it to the operative document language or a recognized drafting convention.

## 4. Analytical scaffolds

1. Build an issue inventory by provision family, not by document order.
2. For each provision family, compare:
   - the operative financing summary language,
   - the draft agreement language,
   - the borrower-side proposed correction.
3. For each issue, capture:
   - the precise deviation,
   - the source of the intended position,
   - the practical effect on borrower economics, flexibility, or risk.
4. Assign every issue a severity level from a stated ordinal scale:
   - Critical: must be corrected before execution or borrower economics/control are materially impaired.
   - High: likely inconsistent with the agreed deal or materially borrower-unfriendly.
   - Medium: drafting mismatch, missing clarification, or scope ambiguity with limited immediate impact.
   - Low: cleanup, consistency, or style point.
5. Close each issue with three elements:
   - the scale of the deviation as reflected in the source materials,
   - the related provision or document that interacts with it,
   - the downstream consequence for the borrower.
6. Where a term appears in multiple places, trace the cross-reference chain and confirm the defined term is used consistently everywhere it matters.
7. Where the draft is silent on a borrower-protective concept, propose affirmative replacement language rather than only noting the absence.
8. For redlines, use text that remains readable outside formatting:
   - [DELETED: …]
   - [INSERTED: …]
   - [REPLACED: old → new]
   - add a short [Rationale: …] note for each substantive change.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Check whether a covenant, basket, or cure right applies at signing, at closing, upon a leverage test date, or only after a specified delivery trigger.
- Verify whether temporal windows roll forward, reset, or accumulate; do not assume a one-time cap where the draft uses a rolling concept.
- If a mechanic references a historical period, confirm the period length, measurement date, and any lifetime ceiling are all stated.
- If a provision depends on another document, schedule, or definition, trace that dependency and ensure the dependency is not broken by a draft change.
- If multiple borrower or guarantor tiers exist, confirm the obligation applies at the correct vertical level and does not inadvertently capture a narrower or broader set than intended.

## 6. Output structure conventions

- Produce a borrower-side markup memo organized by issue family with a short executive summary up front.
- State the severity scale once, then apply it uniformly to every issue.
- For each issue, include:
  - issue title,
  - severity,
  - operative source position,
  - draft agreement position,
  - proposed redline,
  - concise rationale,
  - borrower consequence.
- Use explicit plain-text redline markup for every substantive change so the result is intelligible without track changes.
- Where an issue turns on a comparison to a specific source clause, cite that source in the memo.
- End with a Recommended Actions block that assigns the next step to counsel or the appropriate business contact and ties it to the signing or execution timeline.
- Before finishing, confirm the memo is complete, internally consistent, and ready to be exported as `credit-agreement-markup-memo.docx`.
