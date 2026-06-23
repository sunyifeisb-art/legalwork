---
name: ecvc-extract-key-terms-cap-table
task_id: emerging-companies-venture-capital/extract-key-terms-from-cap-table
description: A cap table analysis memo for a proposed financing must verify option pool arithmetic with the correct fully diluted denominator, estimate conversion shares for outstanding convertibles at relevant prices, cross-check anti-dilution mechanisms against governing formation and charter documents, and identify consent requirements that would be triggered by the proposed financing.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Cap Table

## 1. Subject-matter triage
- Treat the cap table, charter/formation documents, equity plan, investor rights materials, and convertible instruments as one integrated record.
- If the documents describe multiple securities, financing prices, or consent holders, enumerate each one before analyzing dilution or approval impact.
- If only one class, one instrument, or one approval path is in scope, say so explicitly and explain why.
- Separate stated ownership from inferred fully diluted ownership, and separate current capitalization from post-financing capitalization.

## 2. Failure modes the skill is correcting
- Reading the cap table at face value without reconciling it to the governing formation documents, equity plan, charter, and instrument terms.
- Calculating option pool percentage against the wrong denominator and understating the pool’s dilutive effect.
- Treating convertibles as if they are already outstanding shares instead of estimating their share impact under the applicable conversion formula and financing price.
- Accepting a cap table footnote on anti-dilution or preference mechanics when the controlling document says something different.
- Missing protective provisions, class votes, or series consents that the proposed financing would trigger.
- Collapsing different classes, series, or instruments into a single blended figure and losing the ranking, conversion, or consent analysis.
- Stating an issue without tying it to the relevant share base, the interacting document, and the closing consequence.

## 3. Legal frameworks / domain conventions that apply
- Fully diluted capitalization must be analyzed on the basis used by the governing documents and financing mechanics; where pool shares are included in the denominator, the pool percentage must be tested on the post-pool fully diluted base, not a pre-pool base.
- Convertible instruments must be analyzed under their own conversion provisions, including price-based conversion, cap-based conversion, discount-based conversion, and any accrued economics that affect share issuance.
- The controlling document governs conflicting descriptions of liquidation preference, conversion, anti-dilution, and class rights; cap table summaries are not controlling if inconsistent.
- Preferred stock rights are read by series and by class; seniority, conversion ratio, liquidation preference, participation, and protective provisions can differ across series.
- Protective provisions, charter amendments, issuance approvals, and preference changes often require separate holder consent thresholds; the proposed financing must be tested against each triggered approval right.
- If the source documents identify a statutory or charter-based approval standard, use that authority; otherwise apply the relevant charter, plan, or investor-rights provision as the controlling rule.
- Every conclusion should be traceable to a named document, section, schedule, or defined term, not merely to a summarized cap table line.

## 4. Analytical scaffolds
- Ownership summary:
  - List each class, series, and material holder group separately.
  - State shares on a basic basis and on a fully diluted basis.
  - Identify the denominator used and whether it includes pool shares, vested/unvested awards, and convertibles.
- Option pool analysis:
  - State the authorized pool, the available/unallocated pool, and the pool percentage.
  - Show the denominator used for the percentage and whether the calculation is pre-pool or post-pool.
  - Reconcile any mismatch between the cap table presentation and the equity plan or charter authorization.
- Convertible instrument analysis:
  - For each instrument, state the principal or purchase amount, conversion trigger, and key conversion terms.
  - Estimate share issuance at each relevant financing price or conversion scenario reflected in the documents.
  - Flag instruments that convert automatically, optionally, or only upon specific closing conditions.
- Anti-dilution and charter cross-check:
  - For each preferred series, compare the cap table’s description of anti-dilution, conversion, and preference mechanics to the controlling charter or analogous formation document.
  - Identify any divergence, ambiguity, or incomplete summary.
  - State which document controls and why.
- Consent and approval analysis:
  - Identify each protective provision or consent right implicated by the proposed financing.
  - State the approving holder group, threshold, and document source.
  - Note whether the current capitalization appears sufficient to satisfy the threshold or whether additional consents are needed.
- Economic term summary:
  - For each preferred series, capture liquidation preference, participation status, conversion ratio, and ranking in the waterfall.
  - Tie each term to the document section that establishes it.
- Issue framing:
  - For each discrepancy, quantify it against the relevant share base, threshold, or approval requirement.
  - Cross-reference the interacting document or provision.
  - State the downstream financing consequence: closing delay, pricing impact, dilution change, consent failure, or amendment need.

## 5. Vertical / structural / temporal relationships
- Distinguish present ownership, as-converted ownership, and post-closing ownership.
- Distinguish pre-money, closing, and post-closing mechanics when reviewing dilution and approval rights.
- Distinguish basic shares, fully diluted shares, reserved shares, and contingent shares.
- Distinguish senior, pari passu, and junior series when analyzing preference and consent rights.
- Distinguish instrument-specific conversion economics from company-level capitalization summaries.
- If a term depends on another document, analyze the controlling hierarchy first, then the cross-reference, then the practical effect.

## 6. Output structure conventions
- Prepare a concise but complete cap table analysis memo.
- Use conventional sections such as: capitalization summary, option pool analysis, convertibles analysis, preferred stock terms, anti-dilution / charter comparison, consent and approval analysis, and key takeaways.
- Include tables where they improve clarity, especially for ownership, pool arithmetic, instrument conversion, and approval rights.
- State any arithmetic assumptions openly and show the denominator used for each percentage.
- When documents conflict, present the conflict directly, identify the controlling source, and explain the closing impact.
- End with a short recommended actions section that lists the next steps, the responsible party, and the timing relative to the financing closing.
