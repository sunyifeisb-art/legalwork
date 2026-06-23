---
name: extract-financial-covenants-from-existing-loan-documents
task_id: banking-finance/extract-financial-covenants-from-existing-loan-documents
description: Extract financial covenants from multiple commercial real estate loan documents, compare key covenant definitions across facilities, and produce a portfolio compliance summary with breach analysis and issue-spotting.
activates_for: [planner, solver, checker]
---

# Skill: Commercial Real Estate Loan Covenant Extraction — Portfolio Compliance Summary

## 1. Subject-matter triage
- Treat the three loan agreements, amendments, and compliance data as a single integrated covenant set, then separate by facility and reporting period before comparing outcomes.
- Identify whether the documents are one-off loans, amended facilities, or a multi-property portfolio; if the same borrower or property is covered by more than one covenant regime, analyze each regime separately before synthesizing.
- For each covenant, determine: the defined metric, the measurement date or period, the applicable threshold, the reporting source, and any amendment that changes the calculation basis.
- If a covenant is missing a defined term, a reporting date, or a measurement source, treat that as an extraction issue and not a compliance pass.

## 2. Failure modes the skill is correcting
- Extracting covenants without comparing key defined terms across all loan documents, which can make ratios derived from the same property cash flows non-comparable.
- Computing leverage or coverage metrics without checking whether multiple covenant tests are triggered at the same property or borrower group, which can compound the significance of any single issue.
- Accepting a compliance certificate's figures without verifying that the calculation basis matches the applicable loan document definitions.
- Missing guarantor financial covenant compliance, which is a separate obligation independent of property-level covenants.
- Collapsing multiple periods, borrowers, properties, or amendment states into a single pass, which obscures which document governs which test.
- Reporting a breach without identifying the governing threshold, the relevant source document, and the downstream effect on cure rights, default status, or notice obligations.
- Treating a near-breach as an absence of risk when the margin is thin under the governing document.
- Omitting timing-sensitive obligations, such as delivery deadlines, notices, or post-test reporting, even where the financial test itself is satisfied.

## 3. Legal frameworks / domain conventions that apply
- Net operating income definition variation in commercial real estate loans: different loan documents define operating income differently; common variations include whether reserves are deducted from gross revenues before the calculation and whether a management fee is imputed even if no external manager is actually charging that rate; compare definitions across all loans before comparing ratios.
- Debt service coverage definition inconsistency: coverage metrics are commonly based on operating income divided by annual debt service, but the numerator and denominator may be defined differently across loans; if the calculation basis varies, the resulting ratios are not directly comparable; flag the inconsistency.
- Stabilization conditions: construction and transitional loans often convert to permanent financing upon stabilization; stabilization conditions typically include multiple requirements that must all be satisfied simultaneously, such as physical completion, certificate of occupancy, minimum occupancy for a minimum period, and minimum coverage; if an amendment modifies one condition in a way that creates ambiguity about how the conditions interact, flag the ambiguity.
- Tenant concentration covenant: some commercial real estate loans limit exposure to a single tenant as a percentage of total revenues or operating income; compute the concentration precisely and compare it to the applicable covenant language.
- Leverage ratio: typically computed as outstanding principal divided by current appraised or otherwise determined property value; if the valuation is based on a limited valuation rather than a full appraisal, note the basis and compare the ratio to the applicable maximum.
- Compounding breaches: if a property has multiple simultaneous covenant issues, treat the combined effect as more significant than any single issue and flag the overlap.
- Guarantor covenants: many commercial real estate loans require the guarantor to maintain minimum net worth and minimum liquidity; assess compliance independently and note whether the margin is thin.
- Deferred financing costs: the classification of deferred financing costs as capitalized and amortized versus expensed can affect guarantor tangible net worth calculations; flag any classification issue.
- Budget overrun: construction loans typically include a budget covenant limiting cost overruns; track cumulative overruns against the permitted threshold.
- Use the controlling document hierarchy: note base agreement, then amendments, then schedules, then certificates or deliverables; if later language alters earlier text, the later language governs only to the extent it actually amends the earlier text.

## 4. Analytical scaffolds
1. Enumerate the full set of loans, amendments, properties, reporting periods, and guarantors before analysis; then run the extraction and testing once per item and preserve a row-by-row trail.
2. Compare defined terms across all loans: identify differences in operating income, debt service, and any other key calculation inputs.
3. Compare coverage metrics: flag when the ratio basis is inconsistent across facilities.
4. For any construction or transitional loan, identify all stabilization conditions and any amendment-driven ambiguity in how they operate together.
5. For each material tenant, compute concentration as a share of the relevant revenue base and compare it to any concentration covenant.
6. For each property, compute leverage using the available valuation data; compare it to the applicable maximum and note the valuation basis.
7. Flag properties or borrowers with multiple simultaneous covenant issues, and explain the compounding effect rather than listing the issues in isolation.
8. For each guarantor, compute compliance with net worth and liquidity covenants and note thin margin situations.
9. For construction budgets, compute cumulative overruns and compare them to the permitted threshold.
10. Identify reporting deadlines, notice triggers, delivery mechanics, and any cure or grace-period language that changes the compliance outcome.
11. For every identified issue, close the analysis by stating the governing threshold, the interacting provision or document, and the practical consequence for the client.

## 5. Vertical / structural / temporal relationships
- Keep the hierarchy clear: facility-level covenants, property-level tests, tenant-level concentrations, borrower-level reporting, and guarantor-level financial tests should not be blended.
- Track time carefully: covenant compliance may depend on quarter-end, trailing-period, or rolling-period data; an amendment effective date can change which definition applies to which period.
- Where a loan has multiple properties or borrowers, tie each metric to the correct obligor, collateral pool, and reporting period.
- If a test is measured by reference to a historical snapshot and a later amendment changes the method, distinguish original-period compliance from amended-period compliance.
- If more than one covenant is triggered by the same financial condition, present the overlap so the reader can see whether one failure causes another.

## 6. Output structure conventions
- Start with a concise executive summary that states overall compliance posture, principal exceptions, and the most material documentation or calculation issues.
- Provide a loan-by-loan covenant extraction section that lists each financial covenant, its definition, its threshold, the reporting basis, and the tested result.
- Include a definitions comparison table for key calculation inputs across the three agreements and amendments, highlighting any non-comparable terms.
- Include a compliance status table with covenant, relevant period, source basis, threshold, tested level, and status.
- Include an issues section that distinguishes breaches, near-breaches, ambiguities, and data gaps; give each entry an explicit ordinal severity label defined once at the top of the section.
- For each issue entry, state: the amount of headroom or shortfall relative to the governing threshold, the cross-reference to the interacting clause or document, and the client consequence.
- End with a Recommended Actions block that uses imperative verbs, assigns the responsible role drawn from the source documents or transaction context, and ties each step to a deadline, notice window, or immediate follow-up milestone.
- When the source documents supply a controlling legal or contractual citation, name it in the analysis; do not state a compliance conclusion without tying it to the operative language that supports it.
