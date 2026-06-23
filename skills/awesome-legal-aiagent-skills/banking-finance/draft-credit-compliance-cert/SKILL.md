---
name: draft-credit-compliance-cert
task_id: banking-finance/draft-credit-compliance-cert
description: Prepares a quarterly covenant compliance package consisting of a compliance memo, a calculation workbook, and an officer-certifiable certificate, including independent verification of the borrower's preliminary figures.
activates_for: [planner, solver, checker]
---

# Skill: Quarterly Compliance Certificate Preparation — Complete Covenant Package

## 1. Subject-matter triage
- Treat this as a quarterly compliance package with three coordinated outputs: a memo, a calculation workbook, and a certificate.
- Start by locating the operative credit-agreement definitions, covenant tests, reporting deadlines, and any specified calculation methodology.
- Determine whether the period is a full quarter, stub period, or otherwise non-standard; the annualization method must follow the agreement, not generic practice.
- Identify every covenant and certificate representation that is implicated by the quarter-end financials before drafting any narrative.
- If multiple borrower-prepared schedules or management worksheets are attached, enumerate them and reconcile each against source financials before using any figure.

## 2. Failure modes the skill is correcting
- Producing a narrative memo or simplified certificate without the required calculation workbook.
- Using the borrower’s preliminary numbers without independent recalculation from the source financials.
- Applying the wrong annualization method for a partial period or stub quarter.
- Omitting debt components that the agreement treats as debt, including contingent, accrued, or lease-related items.
- Ignoring covenant-specific addback caps, time limits, or cumulative trackers.
- Failing to surface the deadline for delivery or the consequences of late delivery.
- Certifying no default when the calculations disclose a breach, potential breach, or unresolved assumption.
- Treating exclusions or deductions as permissible without locating the specific contractual language that authorizes them.

## 3. Legal frameworks / domain conventions that apply
- Read the debt, EBITDA, fixed-charge, and coverage definitions as integrated contractual terms; each defined term may cross-reference other definitions, schedules, or exhibits.
- Use the agreement’s own accounting conventions, including any expressly required treatment of GAAP, lease accounting, accrued obligations, and contingent liabilities.
- Apply any express limitation periods, forward-looking windows, or trailing periods exactly as written.
- Test each covenant against the correct threshold and measurement date, using conservative assumptions where the agreement leaves room for interpretation.
- Verify whether the certificate must be delivered within a fixed post-quarter window and whether failure to do so is an independent default.
- If the certificate requires a no-default statement, tie that statement to the outcome of the covenant analysis and any known carve-outs or disclosure qualifiers.
- Where the agreement incorporates statutory or regulatory concepts by reference, cite them only if they are actually needed to explain the calculation methodology or reporting obligation; otherwise keep the analysis contract-specific.
- For New York law-governed credit documents, construe the agreement according to ordinary contractual principles, with each defined term controlling its own calculation field.

## 4. Analytical scaffolds
1. **Source inventory**
   - List the agreement excerpts, financial statements, management schedules, and any borrower worksheet that will be tested.
   - Identify which document controls each term, threshold, and deadline.
2. **Debt build**
   - Recalculate total debt from the balance sheet and footnotes.
   - Include all items the agreement treats as debt or debt-like obligations, and exclude only items clearly outside the definition.
   - Reconcile any debt rollforward, lease liability, or contingent exposure item separately.
3. **EBITDA build**
   - Start from the agreement’s base measure and rebuild the permitted adjustments.
   - Remove any item that is not affirmatively permitted by the definition.
   - Test each addback against its own conditions, carryforward rules, and any cumulative or annual cap.
4. **Periodization / annualization**
   - If the period is not a full fiscal year, apply the agreement’s required trailing or annualized methodology.
   - State the rationale for the methodology used and the effect on each covenant metric.
5. **Covenant tests**
   - Compute each leverage, coverage, or fixed-charge ratio using the corrected inputs.
   - Compare each result to the contractual threshold and identify headroom or shortfall using the agreement’s own measurement convention.
6. **Cap and usage tracking**
   - Track every capped adjustment in a separate ledger showing current-period usage, cumulative usage, and remaining capacity.
   - Tie each tracked amount back to the exact contractual cap it consumes.
7. **Worksheet audit**
   - Compare the borrower’s preliminary schedule line by line against the recalculated output.
   - Flag any unsupported inclusion, omission, formula error, sign error, or timing mismatch.
8. **Certificate consistency**
   - Ensure the certificate, memo, and workbook all state the same covenant outcome and assumptions.
   - If any assumption is judgmental, disclose it consistently across all deliverables.
9. **Downside check**
   - Run a conservative sensitivity view that shows the effect of disallowing disputed addbacks or reclassifying borderline items.
   - Use the downside view to test whether the certificate remains supportable.
10. **Deadline check**
   - Measure the delivery date from the quarter end using the agreement’s reporting window.
   - Flag any timing risk, including the need for lender notice if a late or corrective filing is anticipated.

## 5. Vertical / structural / temporal relationships
- Separate the analysis by reporting period, covenant type, and source document so each row traces to a single control term.
- Distinguish present-quarter items from cumulative amounts that roll across quarters or fiscal periods.
- Keep current-period addbacks distinct from lifetime or rolling caps; do not mix the periods in a single line.
- Where one definition feeds another, preserve the dependency chain explicitly so the workbook can be audited from input to final ratio.
- If the agreement uses multiple measurement dates or test points, analyze each one separately rather than averaging across periods.

## 6. Output structure conventions
- **Compliance memo (.docx):** concise narrative explaining the source documents reviewed, methodology used, assumptions made, calculation issues found, covenant outcomes, reporting deadline, and any certification caveats.
- **Calculation workbook (.xlsx):** include clear tabs for EBITDA reconciliation, debt calculation, each covenant test, sensitivity analysis, and capped-item tracking; formulas should trace from source inputs to final ratios.
- **Compliance certificate (.docx):** use an officer-certifiable form that states the tested period, the covenant results, the delivery basis, and any required qualification or reservation language.
- Present all calculations conservatively and label every assumption that affects covenant headroom.
- If more than one covenant, addback, or debt component is implicated, enumerate each item before analysis and carry each through to a discrete worksheet row.
- End the memo with specific recommended actions, each tied to a responsible role and a filing or delivery milestone.
- Before finalizing, confirm by name that the memo, workbook, and certificate are all complete, non-empty, and mutually consistent.
