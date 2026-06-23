---
name: extract-asset-pool-characteristics-rmbs
task_id: structured-finance-securitization/extract-asset-pool-characteristics-from-collateral-tape
description: Extract characteristics from a collateral tape and prepare a stratification and compliance report by testing each loan against applicable eligibility criteria, verifying categorical pool representations against the data, and identifying loans that fail multiple criteria simultaneously as a distinct category.
activates_for: [planner, solver, checker]
---

# Skill: Extract Asset Pool Characteristics from Collateral Tape — RMBS Stratification Report

## 1. Subject-matter triage

- Treat the collateral tape as the primary source for pool composition, but verify it against the term sheet, R&W letter, and DD scope letter before drawing any pool-level conclusion.
- Separate the work into: pool stratification, loan-level eligibility testing, categorical representation checks, and remediation/readiness assessment.
- If a document limits the applicable test set or narrows review scope, follow that scope first; if documents conflict, surface the conflict rather than smoothing it over.

## 2. Failure modes the skill is correcting

- Testing each loan against each criterion independently and reporting violations in isolation, without identifying loans that simultaneously fail multiple eligibility criteria.
- Reviewing the tape without checking it against the categorical representations in the term sheet, which are the statements most likely to be repeated to investors and most damaging if incorrect.
- Completing the analysis without assessing whether the identified violations can realistically be remediated before the scheduled investor presentation.
- Collapsing distinct issue types into one generic “exceptions” bucket, which hides whether a problem is loan-level, pool-statistical, or disclosure-related.
- Reporting a pool characteristic as compliant without reconciling the underlying tape methodology, excluded records, and document-defined calculation basis.
- Treating a failure as a mere data quality note when the governing documents make it a substantive eligibility issue or a pool-coverage issue.

## 3. Legal frameworks / domain conventions that apply

- RMBS collateral stratification commonly requires tables by property type, FICO band, LTV band, origination channel, delinquency status, appraisal type, QM status, interest-only flag, and prepayment penalty flag; each table should present both loan count and UPB.
- Each eligibility criterion in the R&W letter should be treated as an independent basis for loan-level exclusion; the review should identify and quantify violations of each applicable criterion.
- Where the term sheet makes categorical statements about pool characteristics, any loan that contradicts that statement should be flagged both as a potential R&W issue and as a term sheet inconsistency.
- The Ability to Repay and Qualified Mortgage framework determines QM status; non-QM loans should be treated as carrying elevated regulatory and securitization risk and may be ineligible for standard RMBS treatment depending on the governing documents and program requirements.
- Manufactured housing has materially different risk characteristics from site-built residential properties and is often excluded from standard RMBS pools.
- Non-warrantable condominium eligibility depends on property-level characteristics such as HOA financial condition, investor concentration, and pending litigation; these characteristics often require loan-file review beyond the tape and should be flagged for follow-up.
- Delinquency representation consistency: if the R&W requires no loans delinquent beyond a specified threshold, any loan in a higher delinquency bucket should be tested against the lower-threshold representation as well.
- Pool-level weighted-average FICO calculation: the tape-calculated WA FICO and the term sheet stated WA FICO may differ due to rounding, excluded loans, or calculation methodology; any discrepancy should be identified and reconciled before investor use.
- When the governing documents supply a defined review scope, use that definition as the controlling authority for inclusion/exclusion of records and attribute testing; do not import extra assumptions into the pool test.
- When a report uses a statistic in investor-facing materials, the statistic should be traceable to a documented calculation method, not merely a visual match to the tape.

## 4. Analytical scaffolds

1. Start by enumerating the source documents and identifying which controls pool composition, which controls eligibility, and which controls due diligence scope.
2. Produce stratification tables for property type, FICO band, LTV band, origination channel, delinquency status, appraisal type, QM status, IO flag, and prepayment penalty flag; each table should aggregate to total pool UPB.
3. Test each loan against all applicable R&W eligibility criteria; record each violation by criterion and quantify the UPB affected.
4. For each categorical term sheet representation, verify against the tape; flag any representation that is contradicted by the tape data.
5. Identify loans failing multiple eligibility criteria simultaneously; list all applicable violations for those loans and treat them as a distinct category in the report.
6. Delinquency consistency: confirm that all loans in higher delinquency buckets are flagged as violating any applicable lower-bucket threshold as well.
7. WA FICO: compute from the tape; compare against the term sheet; note any discrepancy for correction or explanation.
8. Non-warrantable condominiums: flag by loan identifier where pool data permits; note the need for property-level follow-up.
9. Remediation: distinguish between violations requiring loan removal and violations potentially addressable by disclosure or correction of pool statistics.
10. Assess feasibility of completing remediation before the scheduled investor presentation; note any issues that cannot be resolved on that timeline.
11. End with a recommendation on pool readiness that ties the facts to the applicable document standard rather than to a bare impression of risk.

## 5. Vertical / structural / temporal relationships

- QM status and delinquency status may be correlated: non-QM loans may also have elevated delinquency rates; where both are present, the pool may have compounding eligibility issues that affect both regulatory risk and credit quality simultaneously.
- Manufactured housing and property type stratification are related but distinct: the property type table may reveal manufactured housing presence, and the R&W review should flag each manufactured housing loan as a separate eligibility issue; both should be reported.
- Loan-level defects can affect both compliance and pool statistics: a single excluded loan may change stratification, waiver calculations, or stated averages, so the analysis should track both the defect and its statistical effect.
- If the review scope letter narrows diligence to specified attributes or data sources, treat any uncovered attribute outside that scope as a follow-up item rather than a completed conclusion.
- Temporal issues matter where a representation is measured as of closing, cutoff, or tape date; state the relevant date basis whenever a statistic or eligibility test depends on timing.

## 6. Output structure conventions

- Begin with a short source-and-scope summary identifying the controlling documents and the review date basis.
- Include a methodology note explaining how the tape was read, what was calculated from the tape, and what was verified against the transaction documents.
- Provide a stratification section with separate tables for each required pool characteristic, showing loan count and UPB.
- Provide a compliance review section organized by issue type, with each entry stating the governing representation or criterion, the affected loans or pool slice, the quantitative impact, and the downstream consequence.
- Use an ordinal severity label for every issue, applied consistently across the report, and explain the scale once at the outset of the issue section.
- Include a multi-factor exceptions section listing each loan with simultaneous failures and the full set of applicable issues for that loan.
- Include a reconciliation section for any pool statistic that differs from the term sheet or other investor-facing disclosure.
- Include a remediation and readiness section that separates curable disclosure/statistical issues from loan-level ineligibility issues and states whether the file set appears ready for the scheduled presentation.
- End with a concise recommended actions block that assigns each next step to the relevant role and ties it to the presentation or closing milestone.
