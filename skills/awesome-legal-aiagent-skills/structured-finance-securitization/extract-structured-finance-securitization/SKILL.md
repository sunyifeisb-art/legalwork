---
name: extract-key-terms-auto-loan-abs-term-sheet
task_id: structured-finance-securitization/extract-structured-finance-securitization
description: Extract and cross-check material terms from an asset-backed securities term sheet and supporting documents, verify internal arithmetic where relevant, and identify structural or disclosure inconsistencies by comparing the term sheet against other transaction materials.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Auto Loan ABS Term Sheet and Flag Inconsistencies

## 1. Subject-matter triage

- Treat the term sheet as the primary extraction source, but do not stop there; compare it against every supporting transaction document that can change economics, structure, eligibility, timing, or disclosure.
- If the file set contains multiple tranches, periods, fees, maturities, or percentage formulations, enumerate them first and then analyze each one separately.
- If the deliverable is a memo, the work product is the memo itself; do not invent a separate artifact unless the task expressly requires one.
- Keep the memo focused on material ABS terms, internal consistency, and open issues that need resolution before closing or filing.

## 2. Failure modes the skill is correcting

- Extracting terms from one document in isolation and missing mismatches with related transaction materials.
- Repeating stated numbers without checking whether they reconcile to the cited balances, formulas, or defined terms.
- Collapsing class-by-class or fee-by-fee analysis into a single generic pass.
- Treating ambiguous drafting as harmless when it affects cash flow timing, investor eligibility, disclosure, or tax characterization.
- Reporting issues as bare descriptions without tying them to source figures, cross-references, and practical consequences.

## 3. Legal frameworks / domain conventions that apply

- For each note class, extract principal, rate or spread, expected maturity, legal final maturity, and any class-specific structural feature that changes payment timing or risk.
- Verify enhancement metrics by recomputing them from the stated base figures used in the documents; if documents use different bases, identify both methodologies and the resulting discrepancy.
- Compare stated enhancement, fee, and waterfall mechanics across the full source set; if one document uses a different definition, flag the mismatch rather than harmonizing it silently.
- Where senior classes may pay sequentially or pro rata, treat any ambiguity as a structural issue because it changes subordination, timing, and liquidity risk.
- If any class lacks a stated coupon, spread, or other pricing term, treat that omission as an extraction gap.
- If backup servicing is deferred until after closing, note the unprotected interval and the operational risk created by the delay.
- If any tranche is restricted from benefit-plan investors, note the investor-base limitation and any marketability consequence.
- Compare servicing fee and trustee fee language across documents for mechanical compatibility, including whether caps, bases, or time periods are stated differently.
- Assess whether legal final maturity leaves a meaningful cushion beyond the expected payoff profile described in the materials.
- Review borrower-pool stratification and concentration disclosures for Reg AB-style disclosure implications where the source set highlights concentration or segment risk.
- Note any tax characterization of the issuing vehicle or notes that is unclear or internally inconsistent, because ambiguity may undermine the intended tax analysis.

## 4. Analytical scaffolds

1. Extract all material economics by class: balance, rate or spread, expected maturity, legal final maturity, and any class-specific feature.
2. Extract all enhancement and subordination terms: target overcollateralization, reserve mechanics, triggers, and waterfall order.
3. Extract eligibility, tax, and disclosure terms: ERISA status, tax characterization, and any pool concentration points.
4. Extract all fees and expense mechanics: servicing, trustee, backup servicing, and transaction fees.
5. Extract the representations, warranties, breach remedy, reviewer, repurchase price method, and repurchase timing if the source set includes them.
6. Recompute any stated enhancement or other ratio from the underlying figures actually used in the documents.
7. Compare each extracted term against every other source that touches the same subject; do not rely on a single document when another document may control or qualify the term.
8. For each inconsistency or omission, state: what is wrong, where the conflict appears, and why it matters for the transaction.
9. For each issue, include the source figures or scale that show materiality, the interacting clause or document, and the downstream consequence.
10. When multiple tranches or fee periods exist, present them in a class-by-class or period-by-period format so the reader can see divergences directly.

## 5. Vertical / structural / temporal relationships

- Track vertical payment priority among classes, including whether any senior classes share payments pro rata or pay sequentially.
- Track temporal sequencing for funding, servicing, backup servicing, maturity, and any deferred appointments or delayed protections.
- Track how a change in one term affects another term elsewhere in the stack, such as how a fee definition changes available excess spread or how a maturity cushion affects extension risk.
- If a figure is stated on one basis in one document and on another basis elsewhere, preserve both and explain the relationship rather than forcing a reconciliation that the documents do not support.

## 6. Output structure conventions

- Begin with a concise source-set summary identifying the document types reviewed.
- Use a term-by-term extraction section organized by category, typically:
  - economics by class
  - enhancement and waterfall
  - eligibility and tax
  - fees and expenses
  - servicing / R&W / operational terms
- For each extracted item, include the source document reference in-line so the reader can trace the term back to the source set.
- Follow with an issues section in numbered form.
- Define a simple ordinal severity scale once and apply it uniformly to every issue entry.
- For each issue entry, include:
  - severity
  - description of the inconsistency, omission, or ambiguity
  - the cross-reference to the interacting clause or document
  - the scale or figure showing why it matters
  - the practical consequence
  - a concise resolution or follow-up question
- Close with a short recommended actions section that states the next steps in imperative form and assigns them to the relevant deal function or reviewer role.
- Keep the tone transactional and precise; avoid narrative explanation that does not advance extraction, reconciliation, or issue spotting.
