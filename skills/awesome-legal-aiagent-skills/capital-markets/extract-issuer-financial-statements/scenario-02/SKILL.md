---
name: extract-issuer-financial-statements-scenario-02
task_id: capital-markets/extract-issuer-financial-statements/scenario-02
description: Financial statement extraction for a debt offering — use the same analytical framework as the base scenario, and extend it to extract and verify the proposed offering terms stated in the offering memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Extract Issuer Financial Statements — Scenario 02 (Including Offering Terms)

## 1. Subject-matter triage

Identify the most recent audited annual period as the anchor, use interim periods only as support for trailing-period and current-period checks, and treat the offering memorandum as the disclosure source to be reconciled against the financial statements and any financing term sheet. If the materials include multiple periods, entities, tranches, or capitalization columns, enumerate them first and then analyze each on its own terms rather than collapsing them into a single pass.

Treat the offering-specific sections of the offering memorandum as extraction targets, not just background. Separate what is stated in narrative form from what appears in tables, footnotes, and definitions, because mismatches often arise at those boundaries.

## 2. Failure modes the skill is correcting

- Treating financial statement extraction as the whole task and missing the offered debt terms, use-of-proceeds mechanics, and pro forma presentation.
- Reading the offering memorandum in isolation and failing to reconcile it to the financial statements, term sheet, and any internal definitions that control the numbers.
- Accepting stated figures without testing whether they are arithmetically derivable from the source documents and the described transaction mechanics.
- Missing inconsistencies in debt presentation, proceeds allocation, redemption language, or capitalization table treatment.
- Failing to state the practical consequence of a discrepancy: whether it affects investor disclosure, covenant compliance, closing readiness, or post-closing reporting.

## 3. Legal frameworks / domain conventions that apply

Use the standard capital-markets extraction conventions for debt offerings:

- Anchor all historical financial extraction to the latest audited annual statements, then test any interim or pro forma amounts against that baseline.
- Read the offering memorandum as the primary disclosure record for the transaction, but verify it against the financial statements and the financing terms.
- Treat covenant definitions, leverage mechanics, and other ratio calculations as term-sheet-driven unless the offering memorandum clearly overrides them.
- For any use-of-proceeds statement, trace each category of application to the balance sheet, cash flow statement, debt notes, or pro forma capitalization presentation.
- For any actual/pro forma capitalization table, confirm that the pro forma column follows from the actual column and the stated offering mechanics without unexplained plugs or sign errors.
- If a legal or accounting convention is required to interpret a figure, cite the controlling source as stated in the materials; do not infer a conclusion where the source documents define the term differently.

## 4. Analytical scaffolds

Proceed in the following order:

1. Extract the issuer financial statement baseline: reporting periods, balance sheet, income statement, cash flow data, liquidity, debt, and equity items relevant to the offering.
2. Extract the proposed offering terms: principal size, pricing economics, maturity, redemption or repayment features, ranking or security position if stated, and use of proceeds by category.
3. Reconcile the offering memorandum against the financial statements and the term sheet for conflicts, omissions, and definitional drift.
4. Test any stated covenant or leverage calculation against the source figures and the defined terms used in the materials.
5. Test any actual/pro forma capitalization presentation for internal consistency and transaction mechanics.
6. Distinguish hard numbers stated in the materials from computed amounts, and identify any computed amount that cannot be reproduced from the disclosed inputs.

When a discrepancy is found, do not stop at description. State:
- the size or scale of the mismatch using the relevant source figure,
- the document or clause it conflicts with,
- and the transactional consequence for disclosure quality, covenant headroom, or closing mechanics.

## 5. Vertical / structural / temporal relationships

Track the relationship between:

- annual versus interim periods,
- historical versus pro forma figures,
- issuer-level statements versus subsidiary or segment disclosures if they affect the offering,
- debt outstanding before the offering versus after application of proceeds,
- covenant tests versus capitalization presentation.

If the transaction contemplates repayment, refinancing, repurchase, or debt layering, map the sequence of funds from issuance through application and into the resulting balance-sheet or leverage presentation. Where the source materials present a before/after comparison, use that comparison as the controlling structure and verify the bridge.

## 6. Output structure conventions

Produce a concise extraction report that uses conventional diligence headings, such as:

- Executive summary
- Source materials reviewed
- Financial statement baseline
- Offering terms extracted
- Use of proceeds and transaction mechanics
- Covenant / ratio verification
- Capitalization or leverage reconciliation
- Discrepancies and open points
- Recommended actions

For every issue or discrepancy, include a severity label using a consistent ordinal scale defined once at the top of the report, and keep the label uniform across all entries. Each entry should state the affected figure, the interacting source document or provision, and the downstream consequence.

End with a Recommended Actions section that gives imperative next steps, identifies the responsible role from the materials where possible, and ties the timing to the signing, pricing, closing, or filing milestone. If a recommendation depends on a missing calculation or unresolved definition, say so expressly.

Do not reproduce long quoted passages from the source documents; summarize the operative terms instead unless a verbatim phrase is needed to resolve a defined term.
