---
name: extract-and-categorize-assets-from-financial-disclosure-schedules
task_id: trusts-estates-private-client/extract-and-categorize-assets-from-financial-disclosure-schedules
description: Closes the gap where agents rely exclusively on the filed financial disclosure without cross-referencing source documents to identify omitted assets, stale or unsupported valuations, inappropriate depreciation on non-depreciable personal property, and contested valuation methodologies.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Categorize Assets from Financial Disclosure Schedules

## 1. Subject-matter triage

- Treat the disclosure packet as a comparison exercise, not a standalone source of truth.
- Build the asset universe from every available source document before judging completeness of the disclosure.
- Separate existence, classification, valuation, and support issues; do not merge them into one finding.
- If a value cannot be verified from the materials, say so and identify what additional document would resolve it.

## 2. Failure modes the skill is correcting

- Accepting the financial disclosure at face value instead of cross-checking against tax returns, account statements, equity materials, business records, and intake notes
- Missing asset categories that appear in source documents but are absent from the disclosure
- Treating all equity compensation as a single bucket rather than distinguishing vested and unvested components and the method used for each
- Applying depreciation to personal-use items where fair market value analysis is the proper frame
- Failing to flag stale dates, unsupported assumptions, or valuation methods that appear contestable on the record
- Overstating certainty where the documents support only a provisional or discovery-dependent estimate
- Collapsing marital vs. separate classification, support status, and valuation quality into a single label

## 3. Legal frameworks / domain conventions that apply

- Asset extraction is a document-comparison exercise: compare each disclosed item against source records and classify it as supported, disputed, or omitted.
- For valuation disputes, identify the methodology used, the date used, and whether the date and method are consistent across the source set.
- Equity compensation requires separate treatment of vested and unvested interests; if the unvested portion is not directly realizable, document the allocation approach used to estimate value.
- Retirement and pass-through records may reveal assets or income streams not listed on the disclosure and should be reconciled against the disclosure schedule.
- Personal property used for personal enjoyment is generally analyzed at fair market value, not depreciated book value.
- Closely held business interests may require scrutiny of marketability, minority, or other discounts; where the record is thin, flag the issue and recommend expert review rather than overcommitting to a number.
- Digital assets should be flagged wherever their existence is supported but current value is not reliably established in the record.
- Business operating accounts and similar cash resources tied to an owned enterprise may be relevant assets even if not separately listed.

## 4. Analytical scaffolds

1. Compile a master asset inventory from all source materials before reviewing the disclosure.
2. Enumerate the asset universe by category first, then compare the disclosure against that inventory item by item.
3. For each item, determine whether it is:
   - disclosed and adequately supported,
   - disclosed but deficient in valuation, classification, or support, or
   - omitted from the disclosure.
4. For each omitted item, tie the item to the source document showing existence, then give the best available value estimate or mark the value as undetermined.
5. For each disclosed item with a valuation issue, identify the issue type: stale date, wrong method, unsupported discount, depreciation problem, or other mismatch.
6. For equity compensation, separate vested from unvested components and state the method used to handle each component.
7. For each conclusion that rests on a legal or valuation proposition, identify the authority, rule, or accepted convention supporting it.
8. End each issue entry with a practical consequence and a next-step recommendation.

## 5. Vertical / structural / temporal relationships

- Later-period tax returns may capture assets, income, or transfers that earlier disclosure forms omit.
- Supporting schedules and attachments often explain a line item that appears unsupported on the face of the disclosure.
- Vesting schedules govern timing and realizability for equity awards; the relevant date matters as much as the nominal grant.
- Business records, K-1s, and account statements may reveal the existence of assets even where ownership labels differ across documents.
- Value questions are time-sensitive; always identify the valuation date used in the source record and note any mismatch with the disclosure date.

## 6. Output structure conventions

- Produce a single asset extraction and categorization report.
- Use an industry-conventional structure:
  - brief executive summary
  - classification key or severity legend
  - asset inventory table grouped by asset class
  - issue-by-issue findings section
  - discovery or follow-up recommendations
- Define a simple ordinal severity scale at the outset and apply it consistently to every issue entry.
- For each asset entry, include:
  - asset description
  - source document basis
  - disclosure status
  - disclosed value and date, if shown
  - corrected or best-supported value, if available
  - marital or separate classification, if support exists
  - issue flags
- For each issue entry, include:
  - severity
  - source basis
  - nature of the discrepancy
  - supporting comparison documents
  - downstream consequence
  - recommended next step
- Group assets by conventional categories such as real property, financial accounts, retirement, equity compensation, business interests, vehicles, and personal property.
- Where the record does not support a reliable number, say “value undetermined pending discovery” rather than inventing precision.
- End with a concise recommended actions block that tells the reader what to obtain, review, or reconcile next.
