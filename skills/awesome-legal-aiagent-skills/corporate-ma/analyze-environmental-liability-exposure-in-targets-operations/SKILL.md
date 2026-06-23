---
name: analyze-environmental-liability-exposure
task_id: corporate-ma/analyze-environmental-liability-exposure-in-targets-operations
description: Guides facility-by-facility environmental liability analysis for an acquisition, evaluating accrual adequacy, undisclosed contingent exposures, regulatory escalation risk, and SPA protection adequacy.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Environmental Liability Exposure in Target's Operations

## 1. Subject-matter triage
- Treat this as an acquisition diligence memo for a chemical business where environmental liabilities may transfer with the target.
- Identify whether the package covers one facility or multiple sites; if multiple, analyze each site separately before synthesizing the portfolio risk.
- Separate currently disclosed liabilities from latent, off-balance-sheet, and schedule-omitted exposures.
- If the materials are sparse, say what is missing and analyze only what can be supported by the file set.

## 2. Failure modes the skill is correcting
- Summarizing disclosed environmental liabilities without testing whether the reserve plausibly covers the remediation range reflected in site studies, consultant reports, or agency correspondence.
- Missing contingent exposures such as demand letters, notices of violation, consent decrees, or draft agency comments that are not reflected in the disclosure schedules.
- Treating a clean current compliance posture as proof of low risk, while ignoring migration risk, reopened remedies, or future standards that can expand cleanup scope.
- Failing to test whether transaction protections actually match the timing and uncertainty profile of environmental claims.
- Collapsing distinct facilities, media, or regulatory matters into one blended conclusion.
- Stating a liability conclusion without tying it to the governing environmental regime or the specific source document that supports it.
- Presenting diagnostics without an action path for the buyer’s deal team.

## 3. Legal frameworks / domain conventions that apply
- In a stock acquisition, the buyer typically acquires the target entity with its existing liabilities, including environmental obligations, so diligence must focus on identification, quantification, and allocation rather than selection of assumed liabilities.
- Environmental cleanup exposure commonly arises under federal and analogous state cleanup statutes, including strict-liability regimes for owners, operators, arrangers, and transporters; assess whether the facts implicate potentially responsible party status, successor exposure, or contribution claims.
- Reserve analysis should compare the booked accrual against the cost range in the underlying technical materials, not against the final claim number alone.
- A disclosed reserve may be directionally adequate yet still understate exposure if it omits off-site migration, third-party claims, natural resource damage, agency reopening, or inflationary escalation.
- Environmental risk often matures over longer horizons than ordinary indemnity survival periods; survival, escrow, cap, and basket mechanics should be tested against the expected timing of investigation, remediation, and enforcement.
- Use ordinary environmental diligence conventions: distinguish regulatory noncompliance, known contamination, suspected contamination, and purely contingent or theoretical exposure; do not treat them as interchangeable.
- When citing the legal basis for a conclusion, identify the controlling authority by name and section or part where available; do not state a legal proposition as a bare conclusion.

## 4. Analytical scaffolds
1. **Inventory the universe of sites and matters.** List each facility, parcel, operating unit, off-site disposal location, and pending agency matter before analyzing any one item. If only one site is in scope, state that explicitly.
2. **For each facility, map the regulatory posture.** Note permits, notices of violation, consent orders, agency correspondence, reporting obligations, and any unresolved enforcement history.
3. **For each facility, map the technical findings.** Capture recognized environmental conditions, confirmed releases, affected media, remedial alternatives, and estimated cost range or remedy scope.
4. **Compare reserve to exposure.** Measure the booked accrual against the relevant technical range and note whether the reserve appears to sit at the low end, within the range, or outside it.
5. **Surface non-disclosed items.** Identify items appearing in engineering memoranda, consultant reports, emails, board materials, or correspondence that do not appear in the disclosure schedule or summarized liabilities.
6. **Test migration and third-party exposure.** Evaluate whether contamination may extend to neighboring property, groundwater, surface water, wells, or other off-site receptors.
7. **Assess escalation risk.** Flag sites where regulatory change, reopened investigations, evolving cleanup standards, or changed remedial assumptions could materially expand scope or cost.
8. **Assess transaction protection.** Test whether survival, escrow, indemnity cap, basket, special indemnity, or insurance allocates risk effectively for the expected liability horizon.
9. **Close each issue with consequence.** For every material issue, state the factual scale, the cross-linked document or clause, and the downstream economic, regulatory, or transactional effect.
10. **Rank severity.** Assign a uniform ordinal severity to each issue and use the same scale throughout.

## 5. Vertical / structural / temporal relationships
- Analyze each issue at three levels: site-specific facts, portfolio-level significance, and deal-level protection.
- Distinguish present compliance status from future liability trajectory; a site can be compliant today and still carry substantial remediation exposure.
- Align the remedy timeline with the SPA protection timeline; if environmental loss is expected to emerge after ordinary survival expires, call that mismatch out.
- Where multiple documents speak to the same issue, reconcile them in temporal order so later agency or consultant materials supersede earlier assumptions unless the record shows otherwise.

## 6. Output structure conventions
- Use an executive summary that states the overall environmental risk tier and a qualitative exposure range across all facilities.
- Define a severity scale once at the top of the memo and apply it consistently to each issue.
- Follow with a site-by-site analysis table that includes: site, regulatory posture, technical findings, reserve position, unbooked exposure, and severity.
- Include a separate section for undisclosed or under-disclosed contingent liabilities, with one entry per item.
- Include a transaction-protection section assessing survival, escrow, cap, basket, and any special indemnity or insurance feature against the liability horizon.
- End with a Recommended Actions block. Each recommendation should use an imperative verb, name the responsible deal role or business function, and include a timing anchor tied to signing, diligence close, or closing.
- Keep the memo analytic, not narrative; every material conclusion should be supported by a cited source document or controlling legal authority.
- If the source set does not support a point, say so plainly rather than filling the gap with assumption.
