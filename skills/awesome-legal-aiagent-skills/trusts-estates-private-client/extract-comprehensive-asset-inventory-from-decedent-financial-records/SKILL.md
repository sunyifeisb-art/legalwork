---
name: extract-comprehensive-asset-inventory-from-decedent-financial-records
task_id: trusts-estates-private-client/extract-comprehensive-asset-inventory-from-decedent-financial-records
description: Produces a comprehensive estate asset schedule that classifies each asset by disposition pathway, reconciles values across source materials, identifies unresolved value or title questions, and flags planning or reporting issues for retirement accounts and closely held business interests.
activates_for: [planner, solver, checker]
---

# Skill: Extract Comprehensive Asset Inventory from Decedent Financial Records

## 1. Subject-matter triage

- Confirm the deliverable is an estate asset schedule, not a narrative memo.
- Identify every source that may bear on asset existence, title, beneficiary designation, value, or liability: statements, account summaries, trust materials, will materials, business records, plan documents, tax documents, and advisor correspondence.
- Separate assets that pass by title or designation from assets that pass through probate administration.
- Treat any missing beneficiary designation, unclear title, or conflicting statement as a live follow-up item, not a silent omission.

## 2. Failure modes the skill is correcting

- Listing assets without classifying each one by its actual disposition pathway — probate, revocable trust, non-probate beneficiary designation, joint tenancy right of survivorship, or disposition-uncertain.
- Accepting values from one source document without cross-checking other available records; when sources differ, both values, dates, and the discrepancy must be surfaced.
- Failing to flag retirement-account distribution implications when a minor child or grandchild is a named beneficiary.
- Treating book value or balance sheet value of an entity interest as fair market value without noting that an appraisal may be required.
- Omitting liabilities that reduce estate value or failing to distinguish liabilities tied to a specific asset from general estate liabilities.
- Collapsing assets into one list without showing how they aggregate by class, title, or transfer mechanism.
- Leaving title, beneficiary, or valuation uncertainties unresolved in the final schedule.
- Using conclusory legal statements without identifying the governing estate-administration or valuation principle supporting the classification.

## 3. Legal frameworks / domain conventions that apply

- Estate classification convention: separate probate assets, trust assets, non-probate transfer assets, jointly held survivorship assets, and disposition-uncertain assets.
- Fiduciary administration convention: title and beneficiary designation control disposition; personal notes or planning summaries do not override the governing account record or instrument.
- Beneficiary-designation convention: for retirement and employer-plan accounts, the recordholder’s designation controls unless a superior governing document or administrator record says otherwise.
- Retirement-benefit convention: identify whether a non-spouse beneficiary may be subject to special distribution timing rules; if a minor beneficiary is involved, flag the transition issue that arises when the beneficiary reaches majority.
- Valuation convention: estate reporting generally uses date-of-death fair market value; later or earlier statements are used only to reconcile and explain changes.
- Business-interest convention: closely held interests often require separate valuation, including consideration of transfer restrictions, minority status, and marketability issues.
- Liability convention: list secured and unsecured obligations, and note whether they are tied to a specific asset, account, or the general estate administration.
- Authority citation convention: where a proposition depends on a governing rule, instrument, plan term, statute, regulation, or standard practice, name the controlling authority or document basis rather than leaving the point implicit.

## 4. Analytical scaffolds

1. Build a master inventory of all assets and liabilities mentioned anywhere in the source set.
2. For each item, record:
   - description,
   - account or property type,
   - titling or ownership form,
   - beneficiary designation if any,
   - source document(s),
   - statement date or other valuation date,
   - stated value,
   - disposition pathway,
   - flags or uncertainties.
3. Sort each item into the most defensible classification based on title, governing instrument, and beneficiary record.
4. When the same item appears in multiple sources, compare the values and dates, identify the most current or otherwise more reliable figure, and preserve the discrepancy in the schedule.
5. For retirement or plan accounts with a non-spouse beneficiary, identify distribution implications that should be reviewed before administration proceeds.
6. For any minor beneficiary designation, flag the change in treatment that may occur when the beneficiary reaches majority and note the need to confirm the applicable account or plan rules.
7. For closely held entity interests, use the stated ownership percentage and book or balance-sheet value as a starting point only; mark the need for a qualified valuation and any discount methodology issues.
8. Separate liabilities from assets, identify any offsetting relationship, and carry the obligation into the net-estate computation.
9. Reconcile subtotals by disposition category and then combine them into a gross estate figure, total liabilities, and net estate value.

## 5. Vertical / structural / temporal relationships

- Review trust materials together with asset records to determine whether an item is trust-titled or merely referenced in planning documents.
- Treat advisor summaries as directional, not controlling, unless they are the only source identifying an asset and nothing better exists.
- When records span multiple dates, use the date-of-death snapshot as the anchor and explain any intervening movement only if it affects the reported figure.
- If a plan document, account statement, and beneficiary record do not align, note the hierarchy problem and flag the item for follow-up rather than forcing a guess.
- Where an asset is referenced in one document but absent from another, do not assume it was omitted intentionally; note the inconsistency.

## 6. Output structure conventions

- Single deliverable: estate asset schedule.
- Begin with a brief classification key that explains the disposition categories used.
- Present a table or grouped tables organized by classification category.
- For each asset entry include: description, source document, titling, beneficiary designation if applicable, value, statement date, classification, and flags.
- Include a separate liabilities section with the same discipline of source, date, amount, and any secured/unsecured note.
- Include subtotals for each classification category, then total gross estate, total liabilities, and net estate.
- Add an issues section that groups unresolved title, valuation, beneficiary, retirement-distribution, and appraisal items, with a short explanation of why each matters and what follow-up is needed.
- For each flagged issue, state the governing basis or document source supporting the flag and the consequence for administration, reporting, or valuation.
- End with a concise Recommended Actions block listing the next steps, the responsible role if identifiable from the records, and the timing anchor tied to estate administration or filing.
