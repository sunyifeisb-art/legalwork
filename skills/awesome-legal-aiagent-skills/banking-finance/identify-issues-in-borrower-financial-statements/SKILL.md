---
name: identify-issues-in-borrower-financial-statements
task_id: banking-finance/identify-issues-in-borrower-financial-statements
description: Reviews a borrower’s periodic reporting package against the applicable credit documentation and produces an issues memo with corrected covenant calculations and next-step analysis.
activates_for: [planner, solver, checker]
---

# Skill: Borrower Financial Statements Issues Memo — Compliance Certificate Verification

## 2. Failure modes the skill is correcting

- Accepting reported financial metrics without independently summing, reconciling, and sanity-checking stated components against the underlying statements and schedules
- Treating management-prepared compliance calculations as complete without testing addback caps, exclusions, definitions, and period-specific limitations
- Missing instrument-level risk from subordinated debt, seller financing, or other borrowings that may trigger cross-default, acceleration, or reporting consequences under the credit package
- Failing to restate corrected covenant metrics after finding an error, which leaves compliance status unresolved
- Collapsing distinct reporting dates, covenant tests, or debt instruments into one pass instead of analyzing each separately
- Stopping at description of the issue without stating the applicable threshold, interacting document, and downstream consequence
- Omitting a clear severity ranking and practical next step for each issue

## 3. Legal frameworks / domain conventions that apply

- Start with the controlling credit-document definitions, compliance certificate mechanics, and any schedule or exhibit that governs covenant calculations; use those definitions rather than informal accounting labels
- EBITDA verification: test whether each stated component sums to the reported subtotal, then restate EBITDA after correcting arithmetic errors or excluded items
- Addback and adjustment limits: verify restructuring, integration, and similar addbacks against any per-period, annual, basket, or aggregate cap in the credit documents
- Total debt and funded debt: confirm that all relevant debt categories are captured, including notes, purchase-money debt, seller financing, and any other indebtedness that falls within the defined basket
- Leverage and coverage ratios: recompute each covenant ratio using corrected inputs and compare the result to the applicable test level or minimum headroom requirement
- Minimum EBITDA or similar financial maintenance covenant: test corrected results against any standalone minimum performance covenant, not just leverage or coverage ratios
- Cross-default and event-of-default analysis: identify whether a separate instrument contains its own default trigger, missed-payment event, or acceleration right that could implicate the credit agreement’s cross-default provision
- Period-specific reporting obligations: if the package covers multiple periods or tests, analyze each period separately and avoid relying on a single representative calculation
- Controlling authority: cite the specific credit-agreement section, schedule, exhibit, or defined term supporting each conclusion; if the source set references another governing instrument, cite it as the source documents frame it

## 4. Analytical scaffolds

1. Scope the reporting package
   - Identify each reporting period, covenant test date, and debt instrument in scope
   - If only one period or one instrument is implicated, say so explicitly and explain why

2. Verify the reported numbers
   - Recalculate every reported subtotal from its stated components
   - Reconcile reported figures to the financial statements and supporting schedules
   - Flag any internal inconsistency, omission, or apparent misclassification

3. Test addbacks and exclusions
   - Compare each adjustment to the applicable contractual definition and cap
   - Separate permitted addbacks from disallowed excess amounts
   - Restate EBITDA or other adjusted metrics after corrections

4. Recompute debt and fixed charges
   - Verify funded debt inclusions and exclusions against the debt schedule and the balance sheet
   - Recompute any fixed charges or related inputs needed for covenant testing

5. Recalculate covenant compliance
   - Rebuild leverage, coverage, and any minimum performance tests using corrected inputs
   - Compare the corrected result to the covenant threshold and note any headroom or shortfall

6. Assess cross-default and related-transaction risk
   - Review subordinated, seller-financing, or acquisition-related instruments for independent defaults
   - Determine whether the source documents’ cross-default language is implicated

7. Close each issue fully
   - State the reported figure, corrected figure, controlling source provision, compliance impact, severity, and recommended next step
   - Quantify the issue against the relevant threshold, connect it to the interacting document or definition, and state the client consequence

8. Prioritize response
   - Rank issues by severity and urgency, with the most compliance-sensitive items first

## 5. Vertical / structural / temporal relationships

- Treat the credit agreement, compliance certificate, financial statements, and debt schedules as interlocking documents; a number in one may depend on a definition or cap in another
- Distinguish between quarterly, year-to-date, trailing, and point-in-time measurements; do not mix periods without a stated contractual basis
- Where one correction cascades into another calculation, update the downstream metric after each upstream correction
- If more than one covenant, instrument, or period is present, enumerate them before analysis and then analyze each separately
- Preserve the sequence: reported figure → corrected figure → covenant impact → default analysis → recommended response

## 6. Output structure conventions

- Produce an issues memo organized by issue, not by document
- Begin with a short methodology or scope note identifying the materials reviewed and any assumptions
- Include a severity legend at the top using a uniform ordinal scale such as Critical / High / Medium / Low, and apply it to every issue
- For each issue, include:
  - issue title
  - reported figure or position
  - corrected figure or position
  - controlling credit-document citation
  - cross-reference to any interacting definition, schedule, or related instrument
  - compliance impact or downstream consequence
  - severity
  - recommended next step
- Include a concise summary table comparing reported metrics, corrected metrics, and applicable covenant thresholds or tests
- If multiple periods or instruments are in scope, provide a separate row for each
- End with a clearly labeled Recommended Actions block that assigns each action to a responsible role and ties it to a deadline or urgency anchor from the source documents or the reporting cycle
- Use plain, decision-ready language; avoid conclusory default statements unless tied to a cited contractual basis
