---
name: build-deal-points-library-s02
task_id: corporate-ma/build-deal-points-library/scenario-02
description: Guides construction of a structured M&A deal points library from a set of executed agreements, capturing the key economic, indemnification, covenant, and closing terms needed for benchmarking and precedent research.
activates_for: [planner, solver, checker]
---

# Skill: Build Deal Points Library (Scenario 02)

## 1. Subject-matter triage

- Treat the seven executed agreements as a comparison set, not a single-document extraction.
- Enumerate each transaction first, then extract the same field set across all seven so the library is internally comparable.
- Keep each deal’s terms separate unless the source documents explicitly tie them together.
- For the partner memo, synthesize patterns only after the underlying rows are complete and checked for consistency.

## 2. Failure modes the skill is correcting

- Omitting core valuation inputs that are needed to benchmark the transaction, leaving the library without the standard valuation anchor.
- Collapsing distinct escrow buckets into one line item, which obscures purpose, duration, and economic risk allocation.
- Mixing precision with approximation in fields that are meant to support precedent research and quantitative comparison.
- Recording one party’s or one covenant’s terms as a proxy for all similarly situated persons, periods, or conditions.
- Drafting a summary before the library is complete, which produces a memo untethered to the precedent set.
- Failing to surface outliers as outliers, especially where the deal departs from the rest of the sample on price mechanics, risk allocation, or closing conditions.

## 3. Legal frameworks / domain conventions that apply

- Use standard M&A deal-points conventions: identify transaction type, governing law, closing date, and principal consideration mechanics before moving to protection provisions.
- Where the agreement supplies value inputs, present the valuation bridge in the conventional order used in precedent databases: equity value, debt, cash, then net debt and enterprise value as applicable.
- Separate each consideration type by legal and economic form: cash, notes, rollover, equity issuance, and contingent consideration are not interchangeable entries.
- Treat working-capital, locked-box, and other purchase-price adjustment regimes as distinct frameworks; record the actual mechanism and the operative benchmark or peg used.
- Distinguish general indemnity protections from special-purpose protections, because their purpose, duration, and practical significance differ.
- Record survival, basket, cap, escrow, and RWI terms as discrete risk-allocation tools rather than as a single “protection” category.
- When a term varies by covered person, subject matter, or period, capture the variation at that level of granularity rather than collapsing it into a single summary line.

## 4. Analytical scaffolds

1. **Enumerate the transactions.** List all seven deals by a stable identifier before analysis begins, and keep that identifier on every row and in every memo reference.
2. **Extract a uniform field set for each deal.** Use the same order and definitions for each transaction so the comparison is apples-to-apples.
3. **Build the valuation and consideration bridge.** Record the transaction’s stated pricing inputs, the components of consideration, and any contingent or deferred economics.
4. **Capture the risk-allocation package.** Record indemnity basket, cap, survival, escrow, special escrows, and any RWI or equivalent coverage.
5. **Capture closing and control mechanics.** Record closing conditions, special regulatory or consent requirements, tax elections, restrictive covenants, and any unusual post-closing obligations.
6. **Identify deviations from the sample.** Flag terms that are materially broader, narrower, longer, shorter, or otherwise atypical relative to the other six deals.
7. **Synthesize for the memo.** State observed trends, recurring market conventions, and outliers, with each observation tied back to one or more rows in the library.

For each transaction, extract and record the following fields precisely:
- Transaction identification: closing date, deal type identifier, industry sector
- Deal structure: stock purchase, asset purchase, or merger; governing jurisdiction; any tax elections as applicable
- Enterprise value: computed from equity value plus net debt where the source inputs permit
- Net debt bridge: debt outstanding; cash; net debt
- Consideration: cash at closing; seller note; rollover equity; stock consideration; contingent or deferred consideration
- Purchase price adjustment: mechanism and operative benchmark or peg
- Earnout: trigger metric, threshold, maximum, measurement period, acceleration triggers, operating covenant standard
- Indemnification basket: type and amount
- Indemnification cap — general representations: amount
- Indemnification cap — fundamental representations: amount
- Survival periods: general representations; fundamental representations; tax representations
- Escrow — general indemnification: amount, duration
- Escrow — special purpose: purpose, amount, duration
- Non-compete: for each covered person — geographic scope and duration
- RWI: present or absent; if present, retention and policy limit
- Governing law
- Unusual or deal-specific closing conditions
- Any other term that materially affects price, risk, or closing certainty

## 5. Vertical / structural / temporal relationships

- Preserve vertical hierarchy: agreement-level terms first, then schedule-specific or party-specific carveouts, then exception clauses that modify the baseline.
- Preserve temporal order where it matters: signing, closing, interim period covenants, survival periods, escrow release dates, and post-closing adjustment milestones.
- When a clause has a general rule and a carveout, record both, with the carveout linked to the rule it modifies.
- If the agreement contains multiple covered persons, multiple escrows, or multiple earnout tests, keep each as a separate entry rather than combining them into a composite description.
- If the source set contains a defined term that drives several provisions, use that term consistently in the library and memo.

## 6. Output structure conventions

- Draft the deal points library as a row-based comparison table or equivalent structured schedule with one row per transaction and one column per field.
- Use consistent field labels across all rows; do not rename the same concept from deal to deal.
- Keep general and special-purpose escrows in separate columns or subfields.
- Distinguish stated amounts from computed amounts, and label any computed bridge element so it is clear how it was derived from the source inputs.
- In the executive summary memo, lead with a short bottom-line synthesis, then organize the discussion by theme: pricing, consideration mix, protection package, closing mechanics, and outliers.
- Tie each trend statement to the comparison set rather than to a single agreement.
- Close the memo with practical takeaways for precedent use, including which terms appear market, which appear aggressive, and which appear deal-specific.
- Before finishing, verify that the primary library file is complete and non-empty, then prepare the memo as a secondary deliverable that summarizes, rather than substitutes for, the library.
