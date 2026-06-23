---
name: extract-client-assets-from-financial-statements
task_id: trusts-estates-private-client/extract-client-assets-from-financial-statements
description: Closes the gap where agents compile flat asset lists without categorized subtotals, correct treatment of inherited retirement-account spousal rollover rights and distribution compliance, partnership-interest valuation discount notation, and installment-note tax and estate consequences.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Reconcile Client Assets from Financial Statements for Estate Planning

## 2. Failure modes the skill is correcting

- Producing a flat asset list instead of a categorized estate schedule with subtotals that roll into a reconciled gross estate, liabilities, and net estate
- Missing assets that appear only in non-obvious source materials, such as appraisals, tax schedules, insurance summaries, or supporting statements
- Treating all retirement accounts as identical and failing to flag inherited-account rollover and distribution-compliance questions that materially affect tax and timing
- Omitting probate vs. non-probate classification, which can distort whether an asset passes under testamentary control or by beneficiary designation
- Using book, tax, or statement values as though they were automatically fair market value without flagging valuation limitations
- Failing to note that partnership or minority interests may require discounting and independent valuation support
- Treating installment notes as ordinary receivables without flagging embedded deferred-gain and income-in-respect-of-a-decedent consequences
- Ignoring stale insurance values and failing to request a current in-force illustration when the source is outdated
- Listing issues without tying each one to the source figure, the related document, and the practical consequence for the client
- Writing analysis without an explicit severity ranking and without concrete next steps

## 3. Legal frameworks / domain conventions that apply

- Estate schedules should be organized by asset class, with each line item showing description, ownership or titling, statement date, value basis, and probate or non-probate treatment
- Real property should be listed parcel by parcel, with ownership form and estimated value stated clearly
- Financial accounts should distinguish bank, brokerage, and cash-equivalent holdings, and should note whether account ownership affects estate inclusion
- Retirement accounts may be includable for estate-tax analysis even when they pass outside probate; beneficiary designation and account form both matter
- Life insurance should distinguish permanent-policy cash surrender value from death benefit; cash surrender value is the countable asset value for a permanent policy, while death benefits generally pass by beneficiary designation
- Partnership and alternative-investment interests require careful valuation; the capital account or tax basis is a starting point, not necessarily fair market value
- Vehicles and personal property should rely on appraisal sources rather than rough estimates when such appraisals exist
- Notes receivable are included at outstanding principal, while interest and deferred-gain issues may require separate tax analysis
- Controlling authorities commonly implicated by the source set may include probate administration rules, beneficiary-designation principles, required-distribution rules for retirement accounts, valuation principles for closely held interests, and income-in-respect-of-a-decedent rules for installment obligations
- When a legal proposition is stated, identify the governing authority by name and section, rule, or doctrine when available from the source set or generally recognized in practice

## 4. Analytical scaffolds

1. Build a complete source inventory before drafting the schedule; do not rely on a single statement if the record set contains supporting schedules, appraisals, tax pages, insurance materials, or intake notes
2. Enumerate every asset candidate first, then assign each item to a category and determine whether it is probate or non-probate
3. For each asset entry, capture description, ownership or titling, value, date, source document, and any special valuation caveat
4. Sum each category before rolling up to the overall estate total; then subtract liabilities to derive net estate value
5. Check retirement accounts separately for inherited status, spouse-related rollover possibilities, and required-distribution compliance
6. Check partnership or similar interests for valuation discounts, control limitations, and marketability limitations; note when the stated value is not yet an estate-value conclusion
7. Check installment notes for principal balance, tax reporting implications, and post-death transfer consequences
8. Check insurance records for whether the figure is a current cash surrender value or an outdated placeholder that needs updating
9. For each issue found, connect the source figure to the affected document, explain the consequence, and identify the action needed to close the gap
10. Where the source documents are silent on a controlling point, flag the omission rather than filling it in with assumption

## 5. Vertical / structural / temporal relationships

- Some assets sit in the estate valuation universe even though they do not pass through probate; the schedule should show both classifications where relevant
- A retirement account may change character after death depending on beneficiary status and rollover timing; record the account as it exists at the source date, then flag the downstream election or compliance issue separately
- A partnership capital figure may precede the final estate value because appraisal discounts can operate after the tax or book figure is identified
- An installment note can be both a current asset and a source of future tax consequences; preserve that dual role in the schedule
- Insurance values may be time-sensitive; if the statement date appears stale, the schedule should call for refresh rather than silently adopting the old figure

## 6. Output structure conventions

- Write a consolidated estate-planning asset schedule as the primary deliverable
- Use an industry-standard layout: asset inventory by category, then category subtotals, then gross estate, liabilities, and net estate, followed by exclusions, caveats, and flagged issues
- Include an explicit severity legend at the top of the issues section, using a uniform ordinal scale such as Critical, High, Medium, and Low
- For each asset line, include: asset description, title or ownership, value, source date, probate or non-probate status, and short notes
- For each issue line, include: severity, source amount or figure, related document or cross-reference, governing authority or doctrine where applicable, consequence, and recommended next step
- If multiple assets or issues of the same type exist, list them separately rather than collapsing them into one generalized observation
- End with a concise Recommended Actions section that assigns each action to the relevant professional or decision-maker and anchors timing to the estate-scheduling process or any stated deadline
- If the source record set supports it, surface verbatim quotes from internal documents only when useful for identifying the source of a figure or the nature of a flagged issue; do not overquote or paraphrase away the operative term
