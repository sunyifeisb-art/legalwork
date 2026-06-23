---
name: extract-contested-divorce-asset-extraction
task_id: trusts-estates-private-client/extract-contested-divorce-asset-extraction
description: Focuses the analysis on reconciling a sworn financial disclosure against supporting financial records to identify omitted assets, suspicious transfers suggesting dissipation, and unsupported valuation positions — and on computing a corrected total that reflects the identified adjustments.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Reconcile Assets from Contested Divorce Financial Affidavit

## 1. Subject-matter triage
- Treat the sworn financial affidavit as the anchor document, but never as self-proving.
- First determine whether the source set contains enough records to support reconciliation by account, entity, and date; if not, identify the missing records that block a reliable extraction.
- When multiple spouses, entities, accounts, periods, or transfer events appear, enumerate them explicitly before analysis and keep a separate row for each throughout.
- If only one relevant asset category or one disputed valuation exists, say so and explain why the scope is singular.

## 2. Failure modes the skill is correcting
- Accepting affidavit figures without systematically comparing each line item against bank statements, tax returns, brokerage statements, business records, and other source documents.
- Missing assets that appear in source materials but are absent from the affidavit, including operating cash, ownership interests, digital assets, retirement accounts, personal property, and contingent or off-balance-sheet holdings.
- Overlooking transfers, withdrawals, or unusual cash movements near separation that may indicate dissipation, concealment, or reclassification of marital assets.
- Failing to test whether a stated valuation rests on unsupported assumptions, aggressive discounts, stale statements, or context-inappropriate methodology.
- Collapsing all discrepancies into a narrative summary without a line-by-line reconciliation, quantified adjustments, or source-by-source attribution.
- Omitting a clear recommended discovery path for each gap, omission, or suspicious transaction.
- Stating legal conclusions without identifying the rule, statute, or doctrinal basis that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply
- Reconciliation in contested divorce is document-driven: compare the affidavit against each source document, then classify each item as disclosed and supported, disclosed but unsupported or inconsistent, or omitted.
- Marital-property discovery conventions require testing whether a listed asset is complete, accurately titled, correctly valued, and fully traced to current records.
- Business ownership interests must be assessed together with the underlying operating accounts, cash flows, and financial statements when control or access suggests the affidavit may understate the economic interest.
- Digital assets should be flagged when tax filings, account records, transfers, or wallet-related references suggest ownership even if the affidavit is silent.
- Suspicious transfers should be evaluated for timing, recipient identity, supporting documentation, and whether they coincide with separation, litigation, or changed access to funds.
- Valuation disputes should identify the methodology used, the assumptions embedded in the valuation, and whether the record supports or undermines those assumptions in the dissolution context.
- For each legal proposition or disclosure principle invoked, identify the controlling authority available in the source materials or in generally recognized divorce-discovery practice, and cite it by name, rule, statute, or doctrine rather than by conclusion alone.

## 4. Analytical scaffolds
1. Build a master reconciliation table from all source documents before drafting conclusions.
2. For each asset or account found in any source, record:
   - description
   - owner or titleholder
   - source document
   - date
   - stated value or balance
   - affidavit treatment
   - discrepancy type
   - supporting citation
3. Compare the affidavit line by line against the master table and mark each item as supported, under-supported, overstated, understated, or omitted.
4. Review cash accounts and transfers chronologically around the separation period to identify large movements, unusual counterparties, or unexplained withdrawals.
5. Review business records for omitted operating accounts, retained earnings, intercompany movements, and any valuation inputs that affect the stated interest value.
6. Review tax returns and ancillary filings for references to assets or interests not carried into the affidavit.
7. For each discrepancy, state:
   - the source evidence
   - the applicable disclosure or valuation principle
   - the quantitative significance if the record permits it
   - the downstream consequence for distribution, tracing, or credibility
   - the discovery step that best targets the issue
8. Compute a corrected total by starting with the affidavit’s stated total, then applying identified additions, subtractions, and valuation adjustments only to the extent the record supports them.
9. If the record does not support a precise adjustment, state the issue as unresolved and give the best-supported range or qualitative risk description rather than inventing arithmetic.

## 5. Vertical / structural / temporal relationships
- Use bank statements as the primary chronology for cash flow, transfers, and possible dissipation; tie each flagged movement to date, amount, and recipient where available.
- Use tax returns as a cross-check for hidden ownership, business income, digital asset indicators, and account activity not reflected in the affidavit.
- Use business statements, general ledgers, and valuation reports together; no single document should be treated as complete where the others suggest missing context.
- Treat separation date, filing date, and statement dates as distinct temporal anchors; discrepancies often arise from mixing periods that should not be conflated.
- Where an asset appears in one document but not another, note whether the omission is likely clerical, timing-related, or substantively suspicious.
- If multiple documents conflict, favor contemporaneous primary records over summaries or self-prepared statements unless the source set compels a different conclusion.

## 6. Output structure conventions
- Produce a single asset extraction and discrepancy report as the deliverable.
- Start with a concise executive summary that states the affidavit’s reported total, the principal adjustments identified, and the corrected total or best-supported corrected range.
- Include a reconciliation table organized by category, with separate rows for disclosed-and-supported items, disclosed-but-questioned items, and omitted items.
- Include an issues section that gives, for each discrepancy:
  - severity on a uniform ordinal scale defined once at the top
  - description of the issue
  - source basis
  - governing rule, statute, or disclosure principle
  - quantified significance or the best available scale of impact
  - related document cross-reference
  - downstream consequence
  - recommended discovery or follow-up action
- Define severity once and use it consistently across all entries.
- End with a Recommended Actions section that gives imperative next steps, identifies the responsible role, and ties timing to the litigation or disclosure timeline.
- Keep the document operational: avoid abstract commentary where a concrete reconciliation, citation, or next step can be stated.
