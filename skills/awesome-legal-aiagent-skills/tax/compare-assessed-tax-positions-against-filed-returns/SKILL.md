---
name: compare-assessed-tax-positions-against-filed-returns
task_id: tax/compare-assessed-tax-positions-against-filed-returns
description: A pre-acquisition tax variance analysis should reconcile assessed positions against filed returns issue by issue, assess federal and state-specific errors, and translate each variance into an actionable indemnification analysis rather than merely listing differences.
activates_for: [planner, solver, checker]
---

# Skill: Compare Assessed Tax Positions Against Filed Returns

## 1. Subject-matter triage

- Treat the task as a tax diligence comparison, not a pure tie-out: the objective is to identify mismatches, measure their tax effect, and convert each into a transaction-protection recommendation.
- Enumerate the universe of periods, jurisdictions, entity types, and issue families before analysis begins; do not merge distinct federal, state, or year-specific positions into a single pass.
- If the source set includes a reserve or uncertain-tax-position schedule, treat disclosure coverage as a separate diligence question from the underlying substantive tax position.

## 2. Failure modes the skill is correcting

- Listing variances without quantifying the tax effect or explaining why the variance matters in a transaction context.
- Missing state-only technical errors by assuming federal treatment controls state treatment.
- Overlooking that a recorded reserve may exist while the related position is absent from the disclosure schedule.
- Collapsing multiple periods, jurisdictions, or return positions into one generic conclusion.
- Stopping at issue identification without recommending whether the exposure belongs in a tax indemnity, a broader representations package, an escrow, holdback, or purchase price adjustment.
- Failing to anchor conclusions to the governing tax rule, election requirement, or conformity rule that supports the comparison.

## 3. Legal frameworks / domain conventions that apply

- Research and experimental expenditure rules may require capitalization and amortization over a prescribed recovery period, and the applicable convention can affect the first-year deduction.
- Federal uncertain-tax-position disclosure is a separate diligence issue from reserve recognition; if a reserve is recorded, verify whether the corresponding position appears on the relevant disclosure schedule.
- State elections often depend on entity classification and may be ineffective if made by an ineligible taxpayer; state loss carryforward and limitation rules may also diverge from federal treatment.
- Federal and state comparisons should be analyzed jurisdiction by jurisdiction, because conformity, apportionment, and carryforward limitations can change the exposure even when the underlying book or federal position appears identical.
- Diligence recommendations should distinguish between tax-specific indemnities for known issues and broader transaction protections for residual or harder-to-quantify risk.
- For deduction overstatements, compute incremental tax liability using the relevant marginal rate or jurisdictional rate applicable to the excess amount, separately for each affected filing jurisdiction.
- Cite the controlling authority or source rule for each legal conclusion relied on; do not state a tax conclusion without naming the applicable statute, regulation, or other governing rule.

## 4. Analytical scaffolds

- Start by listing each return, workpaper, schedule, and jurisdiction to be compared.
- For each issue, compare: filed position, assessed or correct position, the size of the variance, and the resulting federal impact.
- Then test state consequences separately for each material jurisdiction, including conformity, apportionment, election validity, and carryforward limitations.
- If the issue involves research or experimental expenditures, check the amortization method and convention used, and compare it against the governing federal treatment for the year at issue.
- If the issue implicates a reserve, confirm whether the position is included on the uncertain-tax-position disclosure schedule; treat omission from the schedule as a distinct issue even if the underlying tax position is separately addressed.
- For every variance, assess penalty exposure and whether the issue is likely to be covered by tax-specific indemnity, general protections, or a negotiated purchase-price remedy.
- Close each issue by tying the variance to a source-document cross-reference and to the downstream consequence for the buyer or target.

## 5. Vertical / structural / temporal relationships

- Preserve the hierarchy: return line item → supporting workpaper → reserve or disclosure schedule → transaction-protection recommendation.
- Analyze federal first only when it is the controlling anchor for the issue; then map downstream state effects, since state conformity may diverge.
- Keep periods separate when a rule changed over time, when carryforwards roll through years, or when a convention changes the first-year effect.
- If one issue affects multiple jurisdictions, present one jurisdiction-specific finding per affected filing jurisdiction rather than a blended conclusion.
- Where a position on one schedule conflicts with another, flag the interaction explicitly and explain whether the inconsistency increases exposure, disclosure risk, or both.

## 6. Output structure conventions

- Draft a variance analysis memorandum organized by issue, not a narrative summary alone.
- Use an ordinal severity scale defined once at the top, and apply it uniformly to every issue.
- For each issue, include at minimum:
  - Issue title
  - Severity
  - Filed position
  - Assessed or correct position
  - Variance and tax impact
  - Federal analysis
  - State analysis by jurisdiction
  - Uncertain-tax-position disclosure status, if applicable
  - Penalty exposure
  - Transaction-protection recommendation
  - Controlling authority or source rule
  - Source cross-reference and downstream consequence
- Include a concise summary table that lists all variances, their severity, and the recommended protection mechanism for each.
- End with a Recommended Actions section that gives imperative next steps, identifies the responsible role where the source materials supply one, and anchors timing to the diligence or signing milestone.
