---
name: draft-structural-overview-memorandum-auto-abs
task_id: structured-finance-securitization/draft-structural-overview-memorandum
description: Drafting a structural overview memorandum for an auto loan ABS transaction, with attention to independently verifying key calculations, cross-checking performance triggers across source documents for consistency, and including an issues table as a required output section.
activates_for: [planner, solver, checker]
---

# Skill: Draft Structural Overview Memorandum for Auto Loan Securitization

## 1. Subject-matter triage

- Confirm the memo is for a securitization structural overview, not a diligence summary, legal opinion, or pricing deck.
- Identify the deal’s core architecture first: issuer, collateral, note classes, enhancement stack, waterfall, trigger regime, and servicing backstop.
- If more than one document states a term, treat the set as potentially inconsistent until reconciled against the governing hierarchy.

## 2. Failure modes the skill is correcting

- Accepting stated spread or yield figures without independently verifying the underlying calculation from class-level data and pool-level performance data.
- Omitting an assessment of whether the backup servicer arrangement satisfies the applicable operational-readiness standard.
- Failing to include an issues table in the memorandum when the output format calls for one.
- Describing a problem without tying it to the relevant transaction size, threshold, or stated pool metric.
- Flagging an issue without checking the clause, schedule, or exhibit that modifies or qualifies it.
- Giving conclusions without a recommendation that assigns responsibility and timing.
- Treating a discrepancy as harmless without stating the downstream economic, operational, regulatory, or transactional consequence.

## 3. Legal frameworks / domain conventions that apply

- Excess spread is the difference between the pool's weighted-average coupon and the sum of note interest, servicing fee, trustee fee, and other senior expenses; it is the first loss protection layer for noteholders.
- Blended note coupon should be computed from class-level note balances and coupons; do not rely on a single stated figure if source data permits independent verification.
- Performance triggers may appear in multiple transaction documents; where threshold language differs, the discrepancy must be identified and reconciled before pricing because the waterfall and investor modeling depend on the operative trigger level.
- Clean-up call mechanics turn on the remaining pool balance threshold and may create negative carry if trust expenses exceed income at low balances.
- Backup servicer readiness should be characterized against the transaction’s stated operational standard, including whether the arrangement is warm, cold, or otherwise contingent.
- Asset-level disclosure review should be tied to the loan stratification and any concentration of lower-credit-score borrowers that may require enhanced disclosure.
- When legal or transactional conclusions depend on a governing clause, cite the relevant document section, exhibit, or defined term rather than stating the result bare.

## 4. Analytical scaffolds

1. Transaction overview: summarize structure, parties, note class configuration, collateral, closing mechanics, and stated maturity profile.
2. Credit enhancement: describe overcollateralization, reserve account, subordination, excess spread, and any dynamic or target-based mechanics.
3. Excess spread check: recompute the blended note coupon from class-level data; compare it to the pool weighted-average coupon from stratification data; identify any stale rate assumption and explain the effect on protection.
4. Waterfall: explain the payment priorities in plain language, including fees, interest, principal, reserve movements, and any sequential or pro rata feature.
5. Trigger review: extract each cumulative net loss and delinquency trigger from the source set; compare thresholds and activation effects; note any inconsistency or ambiguity.
6. Clean-up call review: state the call threshold and assess whether low-balance economics create negative carry or servicing inefficiency.
7. Asset characteristics: review borrower credit-score distribution, concentration trends, seasoning, geography, vehicle type, and other pool features that bear on risk.
8. Backup servicer review: assess whether the arrangement meets the transaction’s operational-readiness standard and whether transition timing is credible.
9. Issues table: list each issue with severity, status, source basis, interaction points, consequence, and recommended action.

## 5. Vertical / structural / temporal relationships

- Excess spread and performance triggers interact: if excess spread is overstated, the buffer before trigger activation is narrower than modeled.
- Trigger activation can alter payment priorities, servicing behavior, and investor cash flows; always explain the waterfall effect, not just the threshold.
- Clean-up call timing and backup servicer readiness interact because a longer-than-expected run-off period extends the period in which continuity planning must remain effective.
- Pool seasoning, delinquency migration, and trigger testing dates should be read together rather than as isolated datapoints.
- When multiple documents state the same operational concept at different levels of specificity, identify the controlling formulation and note any practical consequence of the divergence.

## 6. Output structure conventions

- Use an industry-conventional memorandum structure with clear headings such as: Transaction Overview, Capital Structure and Credit Enhancement, Cash Flow Waterfall, Pool and Collateral Profile, Trigger Regime, Servicing and Backup Servicing, Clean-Up Call and Termination, Open Issues, and Recommended Actions.
- Include an issues table near the end or as an exhibit.
- Define a uniform ordinal severity scale once at the top of the issues section and apply it consistently across entries.
- For each issue entry, include: severity, issue statement, source basis, cross-reference to the interacting provision or document, quantitative anchor or threshold, consequence, current status, and recommended action.
- When multiple scales, periods, or trigger tests are present, enumerate them explicitly before analysis and then address each one in the memo rather than collapsing them into a generic summary.
- End with a concise Recommended Actions block that assigns each action to a responsible role and a timing anchor tied to closing, pricing, final documentation, or another relevant milestone.
- If the memo relies on a transaction-specific legal or structural proposition, cite the controlling authority in the source documents by section, defined term, or exhibit reference.
