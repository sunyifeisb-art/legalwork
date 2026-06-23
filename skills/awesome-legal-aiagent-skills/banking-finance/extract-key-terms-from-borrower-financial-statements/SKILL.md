---
name: extract-key-terms-from-borrower-financial-statements
task_id: banking-finance/extract-key-terms-from-borrower-financial-statements
description: Reviews a borrower’s financial reporting package against the governing credit documentation and produces an extraction and reconciliation memo for the portfolio team, independently correcting covenant-calculation figures where supported by the documents.
activates_for: [planner, solver, checker]
---

# Skill: Borrower Financial Statement Extraction and Compliance Certificate Reconciliation

## 1. Subject-matter triage
- Treat the borrower package as a document-comparison and covenant-reconciliation task, not a freeform financial analysis.
- Identify the governing credit documents first, then the reporting package, then the specific compliance certificate or borrower calculation being tested.
- If multiple reporting periods, covenant tests, or definitions are in play, enumerate them before analysis and run the reconciliation separately for each.
- If only one period or one test is actually implicated, say so explicitly and explain why.

## 2. Failure modes the skill is correcting
- Accepting borrower-reported covenant metrics without rebuilding the calculation from the governing definitions
- Carrying excluded gains, restricted cash, or other non-permitted items into the adjusted metric
- Missing contractual caps, floors, add-backs, or denominator components that change the result
- Using the borrower’s stated accounting treatment when the credit documents freeze an earlier basis or otherwise override current accounting
- Collapsing separate issues into one blended reconciliation and obscuring which definition drives which correction
- Failing to connect each discrepancy to covenant headroom, compliance status, and follow-up action
- Stopping at description instead of stating the corrected figure, the source authority, and the downstream consequence

## 3. Legal frameworks / domain conventions that apply
- Read the credit agreement together with the compliance certificate, any defined terms, and any incorporated schedules; the controlling definition is the one that governs the metric being tested.
- When a definition excludes gains on asset sales from EBITDA or a similar earnings measure, remove those gains before ratio calculation if the document so requires.
- When cash is netted against debt, verify whether the definition permits only unrestricted cash, excludes escrowed or pledged amounts, or imposes a contractual cap on netting.
- When fixed charges or debt service include purchase-money debt or similar financing payments, include those amounts in the denominator before calculating coverage.
- When the documents contain a covenant step-down, test both the current level and any scheduled future level if the facts place the borrower near the transition.
- When lease treatment depends on a frozen GAAP basis or current accounting principles, follow the covenant language rather than the borrower’s presentation.
- When the certificate appears inaccurate, frame the work so it can support a corrected certificate request and any related remediation or notice.

## 4. Analytical scaffolds
1. Inventory the source set: agreement, definitions, schedules, certificate, financial statements, and any supporting calculations.
2. List the borrower-reported metric, the governing definition, and the precise source cite for each input item.
3. Rebuild EBITDA or analogous earnings measures from net income or the specified starting point, then apply each allowed add-back and each required exclusion.
4. Rebuild debt and cash inputs, distinguishing gross debt, permissible netting items, restricted cash, capped netting, and any excluded balances.
5. Recompute leverage or similar balance-sheet ratios using the corrected numerator and denominator, then compare to the borrower-reported figure and the applicable threshold.
6. Rebuild fixed-charge or debt-service denominators with every required component included, then recompute coverage and compare it to the reported result.
7. If a future covenant level exists, compare both current compliance and forward compliance at the stepped threshold.
8. If accounting methodology is implicated, test the metric under the covenant’s required accounting basis and note the effect on the result.
9. For each discrepancy, tie the corrected number back to the governing definition and the practical compliance consequence.

## 5. Vertical / structural / temporal relationships
- Distinguish definition-level inputs from ratio-level outputs; a single input error may affect multiple ratios.
- Track whether an item belongs in the numerator, denominator, netting basket, or exclusion bucket, and do not move it without textual authority.
- Where one provision narrows another, apply the narrower provision for the affected metric.
- Evaluate current-period compliance separately from any future period that is governed by a step-down or changed test.
- Preserve the chronological order of the reporting package so the reconciliation mirrors the borrower’s own presentation while correcting it where necessary.

## 6. Output structure conventions
- Use a short executive summary followed by an issue-by-issue reconciliation section.
- State each issue with: borrower-reported figure, corrected figure, governing-document reference, and compliance impact.
- Include an ordinal severity field for each issue using a defined scale stated once at the top of the memo.
- Quantify each issue against the relevant threshold or headroom, cross-reference the interacting definition or schedule, and state the practical consequence for the borrower and portfolio team.
- Include a summary table that compares borrower-reported ratios, corrected ratios, and the applicable covenant thresholds.
- End with a Recommended Actions block that uses imperative verbs, names the responsible role or party, and anchors timing to a document deadline, reporting date, or near-term covenant milestone.
- If the memo identifies a material calculation or definition error, say whether the certificate appears to require correction and what follow-up is warranted.
- Keep the prose document-ready and operational; avoid generic commentary that does not advance the reconciliation.
