---
name: extract-assets-from-financial-declaration
task_id: trusts-estates-private-client/extract-assets-from-financial-declaration
description: Focuses the agent on extracting asset, liability, and income data from a sworn financial declaration into a structured workbook, reconciling totals across schedules, computing equity where appropriate, and flagging stale, unsupported, or classification-sensitive entries for follow-up.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Reconcile Assets from Opposing Party's Financial Declaration

## 2. Failure modes the skill is correcting

- Producing a flat list of items instead of a structured workbook that mirrors the declaration’s own schedule logic
- Missing asset-by-asset reconciliation, especially where value depends on balance date, encumbrances, or cash-surrender treatment
- Treating stated face amounts, estimates, or ranges as if they were settled values without flagging the valuation basis
- Accepting business or professional interest figures without noting methodology gaps, discount treatment, or goodwill classification issues
- Omitting liability classification problems, including pre-existing debt, contingent debt, or unclear payor responsibility
- Failing to compare summary pages against detailed schedules, which leaves internal inconsistencies unflagged
- Overlooking stale statements, unsupported assertions, or missing backup that should be sent back for supplementation
- Drafting an issues memo that describes problems but does not tie each one to the relevant schedule, practical effect, and next step

## 3. Legal frameworks / domain conventions that apply

- Use the declaration’s own schedule architecture as the organizing framework for extraction, then normalize it into a workbook with consistent fields
- Distinguish marital, separate, exempt, or disputed classifications where the declaration or supporting materials provide a basis to do so
- For real property, record value, secured debt, and resulting equity; note any missing lien information, tax arrears, or assumed encumbrances
- For liquid accounts, prefer the most current statement date available in the source set and flag older balances as potentially stale
- For retirement assets, note plan type, vested balance if shown, and whether division may require a transfer order or other administrative step
- For life insurance, distinguish term coverage from permanent coverage and report cash value rather than face amount when a divisible value exists
- For business interests, record ownership percentage, valuation method, discounts, and any indication that personal versus enterprise goodwill matters
- For vehicles and tangible personal property, separate asserted value from evidence quality, source date, and any lien or finance balance
- For liabilities, capture creditor, amount, payment status, maturity, and whether the debt predates the relevant relationship period if that appears material
- For income, compare any summary figure to the underlying detailed schedule and flag discrepancies or omitted components
- Apply the governing family-law, property-classification, and disclosure principles recognized in the jurisdiction reflected by the source materials when the declaration itself invokes them

## 4. Analytical scaffolds

1. Enumerate each asset, liability, and income source from the declaration and attachments before analysis; do not merge distinct accounts, parcels, policies, or interests into a single row.
2. Build the workbook first as a schedule-aligned extraction, then add a reconciliation sheet that totals assets, liabilities, and net worth across categories.
3. For each item, capture at minimum: owner/name, category, description, stated value, statement or valuation date, source document, classification, and review flags.
4. For real property, compute or restate equity from the declared figures where possible; if debt or value inputs are incomplete, flag the calculation as provisional.
5. For business interests, extract the valuation narrative and identify whether the stated figure appears to rely on earnings, book value, market comparison, or another method.
6. For life insurance, record policy form and cash value treatment; if only face coverage is shown, flag that the declaration may not reflect an asset value.
7. For liabilities, note whether the debt is secured or unsecured, whether it appears current or delinquent, and whether the source documents show offsetting collateral.
8. Compare cover-page summaries, financial schedules, and supporting statements against one another; any mismatch should be preserved in the workbook and carried into the issues memo.
9. Treat unsupported estimates, missing backup, old statements, and internally inconsistent dates as separate review issues rather than collapsing them into one generic note.
10. When a figure is uncertain, preserve the declarant’s stated amount and separately mark the uncertainty, rather than substituting a guessed correction.
11. Organize the issues memo by issue, and for each issue include the affected item, the nature of the concern, the source location, the practical consequence, and a concrete follow-up step.
12. Assign each issue a uniform severity label using an ordinal scale defined at the top of the memo, and apply it consistently across all entries.
13. End the memo with a short action list that assigns next steps to the appropriate role and ties them to the discovery or case-management timeline.
14. Before finalizing, confirm that the workbook contains the operative extracted data and reconciliation outputs, and that the memo reflects only issues supported by the source set.

## 5. Vertical / structural / temporal relationships

- Map each schedule in the declaration to a corresponding workbook tab, but preserve cross-references when one item spans multiple schedules or attachments
- Prefer the latest available balance or statement date for each recurring account; where dates differ across documents, preserve the discrepancy rather than overwriting it
- If a supporting document updates or narrows a declaration entry, treat the support document as a temporal overlay and note the hierarchy explicitly in the workbook
- Where an asset or debt has changed over time, record the date-specific figure alongside the current figure so later review can track movement
- If the source materials contain both summary and detailed figures, the detailed figure governs extraction but the summary inconsistency should remain flagged
- If counsel’s notes or intake materials identify a disputed category, elevate that category in the issues memo and link it back to the underlying schedule

## 6. Output structure conventions

- Produce two deliverables: a multi-tab `asset-extraction-workbook.xlsx` and an `issues-memo.docx`
- Workbook structure should follow the declaration’s schedules, with standardized columns for description, value, date, source, classification, support quality, and flags
- Include a reconciliation tab that totals assets, liabilities, and net worth, and a separate exceptions or notes tab for unresolved questions
- Preserve source traceability in every row so a reviewer can trace each extracted figure back to the declaration or attachment that supports it
- Use separate rows for separate accounts, parcels, policies, interests, and liabilities; do not aggregate unlike items merely to simplify totals
- In the memo, define the severity scale once, then provide one entry per issue with the affected item, source basis, concern, impact, and recommended follow-up
- Frame recommendations as concrete next steps directed to the appropriate role and tied to the case workflow, discovery posture, or filing timeline
