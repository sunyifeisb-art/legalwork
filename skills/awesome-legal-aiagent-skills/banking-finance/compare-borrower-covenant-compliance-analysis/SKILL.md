---
name: compare-borrower-covenant-compliance-analysis
task_id: banking-finance/compare-borrower-covenant-compliance-analysis
description: Independently recalculates covenant compliance from source documents, flags deviations from the borrower’s compliance certificate, and produces a default-oriented analysis with next-step triage.
activates_for: [planner, solver, checker]
---

# Skill: Covenant Deviation Report — Independent Recalculation

## 2. Failure modes the skill is correcting

- Accepting the borrower’s reported financial inputs without independently checking the relevant addbacks, exclusions, and adjustments against the governing credit documents
- Omitting non-recurring or extraordinary gains or other required exclusions from the EBITDA analysis, resulting in overstated EBITDA
- Computing available revolving capacity without deducting outstanding letters of credit or other required utilization items
- Identifying deviations without classifying them by type, severity, and cure availability, which is necessary for prioritized response
- Treating the borrower’s compliance certificate as dispositive instead of reconciling it line-by-line to the credit agreement, financial statements, and any defined terms that change the math

## 3. Legal frameworks / domain conventions that apply

- Covenant analysis is controlled by the credit agreement’s defined terms, calculation mechanics, and any exhibit or schedule that modifies the base definitions; use the agreement’s definitions, not accounting shorthand, when they differ
- EBITDA-based covenants often require independent treatment of addbacks, exclusions, extraordinary items, non-recurring charges, realized cost savings, gains on dispositions, and other adjustments; each adjustment must be tested against the contract text
- Leverage, interest coverage, and fixed-charge-style tests must be recomputed from corrected inputs rather than borrower-reported outputs, and each threshold must be compared to the governing covenant level
- Revolving availability must be tested from the commitment side and the utilization side together, including all mandatory deductions that reduce availability under the agreement
- Default analysis must separate a mathematical covenant breach from any separate notice, grace period, or cure concept in the credit documents; a deviation is not fully analyzed until its enforcement consequence is identified
- If the source documents supply authority for a calculation rule, quote or cite that rule in substance rather than paraphrasing it loosely; if multiple provisions interact, cite each one that affects the result

## 4. Analytical scaffolds

1. Inventory the governing inputs: identify every covenant, definition, period, and financial statement used in the certificate; if multiple periods or tests are present, enumerate them first and analyze each separately
2. Rebuild the denominator and numerator: start from the underlying financial statements, then apply each contractual adjustment in the order the agreement requires
3. Test each addback or exclusion: verify qualification, timing, caps, realization limits, and any category-specific restrictions before including it
4. Recompute each covenant independently: calculate the corrected ratio, amount, or headroom and compare it to the borrower-reported figure and the stated threshold
5. Reconcile line items to source support: trace each disputed or unusual line item back to the financials, certificate, and agreement-defined mechanics
6. Analyze availability and utilization: recompute revolving availability, deduct all required utilization items, and check whether the borrower’s certificate omitted any reduction
7. Classify the deviation: identify whether the issue is a miscalculation, definition mismatch, unsupported addback, threshold breach, or separate default trigger
8. Tie the issue to consequences: state whether the issue creates a technical breach, an event of default risk, a reporting defect, or a remedy/cure question, and explain the practical impact
9. Prioritize next steps: separate immediate notice and reservation actions from follow-up diligence and corrective documentation

## 5. Vertical / structural / temporal relationships

- Analyze by covenant first, then by reporting period; do not blend different tests or periods into one narrative if the agreement measures them separately
- If the certificate presents multiple borrower entities, guarantors, or facilities, map each item to the covenant or definition that governs it before comparing figures
- When a ratio depends on rolling-period data, verify the correct measurement window, the inclusion date of each adjustment, and any trailing- or forward-looking component before concluding on compliance
- Where the agreement contains notice, grace, or cure mechanics, place the accounting result in temporal context: breach date, notice deadline, and any remediation window
- If one calculation feeds another, show the dependency chain so the reader can see which error propagates through the remaining covenants

## 6. Output structure conventions

- Write the report as an issue-by-issue deviation analysis, not as a narrative summary alone
- Begin with a concise table or matrix showing, for each covenant: borrower-reported result, independently recalculated result, governing threshold, and compliance status
- For each issue entry, include:
  - the covenant or calculation at issue
  - the borrower’s stated figure
  - the independently recalculated figure
  - the source of the discrepancy
  - the controlling agreement language or defined term
  - the quantified impact on headroom, compliance, or availability
  - the downstream consequence for default or remedy analysis
  - an explicit severity label using a uniform ordinal scale defined once at the top
- Each issue must close with: quantified impact, cross-reference to the interacting provision or document, and the consequence for the client
- If any item is uncertain, flag the uncertainty and specify what document or calculation would resolve it
- End with a Recommended Actions section that gives imperative next steps, assigns the responsible role, and includes a timing anchor tied to the reporting, notice, or remedy context
- Keep the tone forensic and non-advocacy; separate computation from legal consequence
