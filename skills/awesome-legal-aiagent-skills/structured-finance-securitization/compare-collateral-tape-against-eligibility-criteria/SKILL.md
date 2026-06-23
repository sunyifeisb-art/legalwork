---
name: compare-collateral-tape-against-eligibility-criteria
task_id: structured-finance-securitization/compare-collateral-tape-against-eligibility-criteria
description: Reviewing a CLO collateral tape against governing eligibility criteria in the applicable transaction documents to identify loan-level failures, portfolio concentration breaches, and the appropriate remediation path for each category of deficiency.
activates_for: [planner, solver, checker]
---

# Skill: Compare CLO Collateral Tape Against Eligibility Criteria and Prepare Deviation Report

## 1. Subject-matter triage
- Determine whether the instruction asks for loan-level eligibility testing, portfolio concentration testing, or both; if both, treat them as separate analyses and do not merge the outputs.
- Identify every governing source that can impose eligibility constraints, including the indenture, warehouse agreement, and any incorporated schedules or definitions.
- Confirm whether the tape is static or includes multiple dates, testing points, or scenarios; if multiple, enumerate them first and analyze each on its own track.

## 2. Failure modes the skill is correcting
- Reviewing each loan against only one source of eligibility criteria and missing additional or stricter criteria in another governing document.
- Testing a loan for one failure while omitting other independent failures that apply to the same loan.
- Treating fixed-rate loans as if floating-rate spread tests apply, or otherwise using the wrong eligibility lens for the asset type.
- Identifying concentration issues without showing the aggregate measure, the applicable limit, and the loans that drive the breach.
- Failing to distinguish loan-level ineligibility from portfolio-level concentration breaches, even though the remediation path differs.
- Reporting a deficiency without tying it to the governing authority, the measured deviation from threshold, and the practical consequence for closing or funding.

## 3. Legal frameworks / domain conventions that apply
- Eligibility analysis follows the express criteria in the governing documents and any cross-referenced definitions, schedules, or exhibits; apply the most specific applicable provision.
- Where multiple documents govern, test each criterion against its own source and note when a secondary document is more restrictive than the primary one.
- Common CLO eligibility concepts include leverage, spread, floating-rate status, domicile, lien position, maturity, minimum par, permitted borrower profile, sponsor restrictions, and other asset-quality screens.
- Industry or obligor concentration limits are aggregate tests; they are not satisfied by showing that individual loans are eligible in isolation.
- Rating bucket or credit-quality buckets must be analyzed by category because adjacent buckets may carry different limits or weighting consequences.
- If the source documents define a term or measurement methodology, use that definition rather than a market shorthand.
- For every issue, state the controlling document and provision, the measured failure versus the threshold, and the transaction consequence of the defect.

## 4. Analytical scaffolds
1. Build a governing-criteria inventory before reviewing the tape: list each eligibility test, its source, and whether it applies at the loan level or portfolio level.
2. Enumerate the population to be tested. If there is more than one tape date, portfolio slice, or scenario, list each explicitly before analysis and run the same framework separately for each.
3. For each loan, compare the tape fields to every applicable criterion in every governing document.
4. Record each failure as a discrete issue with: loan identifier, violated criterion, actual input, threshold or permitted range, governing source, and whether the failure is independent or coexists with other failures on the same loan.
5. For fixed-rate assets, do not force-fit floating-rate spread criteria; instead test the fixed-rate classification against any express prohibition or condition in the governing documents.
6. Where a loan fails multiple tests, state each failure separately and identify the combined effect on eligibility.
7. Aggregate portfolio-level concentrations by the category required in the source documents, then compare each aggregate to the applicable cap.
8. For each concentration breach, identify the breaching category, the aggregate measure, the applicable limit, the excess, and the contributing loans.
9. State the practical consequence of each issue: ineligibility, need for substitution or removal, closing condition failure, or other transaction impact.
10. Close every issue with the three required moves: quantify it, connect it to the interacting source provision if any, and state the downstream consequence.

## 5. Vertical / structural / temporal relationships
- Loan-level defects and portfolio-level breaches are distinct. A loan may be individually eligible yet still contribute to a portfolio breach, and an ineligible loan may have no concentration effect.
- Multi-factor violators can create overlapping remedial paths; if the same loan triggers more than one breach, state all applicable grounds.
- If the governing documents create a hierarchy among documents, apply the more restrictive or more specific rule where the documents overlap.
- If the tape reflects multiple measurement dates or funding stages, preserve the sequence of testing so the report shows when each issue arises.

## 6. Output structure conventions
- Use a conventional deviation-report format with a short definitions/key section, followed by loan-level findings, portfolio-level findings, impact summary, and recommended actions.
- Include a severity field for every finding using a consistent ordinal scale stated once at the top of the report.
- For each loan-level entry, show: asset identifier, governing source, criterion breached, actual vs. required metric, severity, and concise consequence.
- For each portfolio-level entry, show: category, aggregate metric, applicable limit, excess, contributing loans, severity, and concise consequence.
- Group duplicate issues only if the report still preserves each distinct breached criterion and each distinct governing source.
- End with a Recommended Actions section that assigns each action to a responsible role and ties it to the relevant closing or funding milestone.
- The final deliverable should read as an operative deviation report, not as a narrative summary of review steps.
