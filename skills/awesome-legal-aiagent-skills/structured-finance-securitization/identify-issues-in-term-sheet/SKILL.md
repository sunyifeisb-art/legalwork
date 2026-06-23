---
name: identify-issues-in-consumer-abs-term-sheet
task_id: structured-finance-securitization/identify-issues-in-term-sheet
description: Identifying issues in a consumer loan asset-backed securitization term sheet by cross-referencing collateral data, servicing agreement terms, and structuring materials to surface pool balance discrepancies, commingling exposure, independent review gaps, retention sizing issues, step-down structural risks, and state law compliance concerns that require resolution before pricing.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in ABS Term Sheet — Issue Memorandum for Consumer Loan Securitization

## 1. Subject-matter triage
- Treat the request as an issue-spotting and client-advisory exercise, not a drafting task for transaction documents.
- Confirm the source set includes the term sheet, collateral tape or pool data, servicing material, and any structuring or compliance exhibits.
- If the source set covers multiple loan strata, originations, or trigger dates, enumerate each relevant category before analyzing; do not analyze a blended sample as if it were the whole pool.

## 2. Failure modes the skill is correcting
- Missing the collateral reconciliation issue because the term sheet balance is read in isolation from the loan-level tape.
- Overlooking commingling exposure where sweep timing or reserve mechanics leave collections exposed to servicer credit risk.
- Failing to test whether any designated breach reviewer is truly independent under market practice.
- Treating retention language as boilerplate without checking whether the described retained interest satisfies the governing securitization retention rule.
- Missing the structural consequence of a step-down test that reallocates principal in a way that changes the economics of subordinate classes.
- Ignoring cap agreement waterfall placement, which can neutralize the hedge if payments are subordinated to expenses or note interest.
- Neglecting state licensing and usury compliance where the pool has materially higher-coupon loans in capped jurisdictions.
- Failing to compare servicer-transfer timing against early-amortization timing, which can leave a stressed pool managed by the wrong party.
- Describing issues without grading severity, tying them to other documents, or stating a concrete fix.

## 3. Legal frameworks / domain conventions that apply
- Pool balance consistency: the stated pool amount should reconcile to the collateral tape total; any mismatch affects percentage-based deal metrics, credit enhancement, and retention sizing. Cross-check the term sheet against the tape and any reconciliation schedule before pricing.
- Commingling risk: collections held before sweep remain exposed to servicer insolvency risk during the holding period; the longer the interval, the greater the bankruptcy-remote concern. Compare the sweep language in the term sheet with the servicing arrangement and cash-management provisions.
- Independent review of breaches: market-standard securitizations often designate a third party or similarly independent process to evaluate breach claims; a seller-controlled process creates an apparent conflict. Compare the review mechanism in the term sheet with the repurchase or enforcement provisions.
- Retention requirement: the sponsor must retain the minimum net economic interest required by the applicable securitization retention regime, commonly implemented by a vertical, horizontal, or permitted combination structure. Test the description of the retained interest against the governing retention rule and any definitions of eligible retained interest.
- Step-down mechanics: principal redirection based on performance tests can alter subordination levels and shift risk among classes; the analysis must identify who benefits and who is diluted. Compare the trigger test, waterfall, and class hierarchy together.
- Interest-rate hedge waterfall priority: hedge receipts and related payments should sit high enough in the waterfall to preserve the hedge’s function. Compare cap payment placement with expense priority and note interest priorities.
- State consumer-credit compliance: loans in the pool must comply with applicable origination-state rate limits and licensing requirements. Review the state distribution of the pool against the originator’s licensing disclosures and any express compliance reps.
- Servicer-transfer / early-amortization sequencing: replacement of the servicer and the start of amortization should be coordinated so that a stressed pool is not accelerated while still managed by an impaired servicer. Compare trigger thresholds across all relevant transaction documents.
- Repurchase timing: the breach-to-repurchase period should be tested for how long investors remain exposed to a non-conforming asset. Compare the cure/repurchase timetable with the breach process and any seller response obligations.

## 4. Analytical scaffolds
1. Reconcile the stated collateral balance to the tape total; identify the difference, explain which deal metrics it touches, and state why pricing should not proceed until resolved.
2. For each collection-holding mechanism, identify the sweep interval and any reserve or lockbox protections; assess whether collections sit with the servicer for multiple business days and whether that creates avoidable exposure.
3. Identify the breach reviewer, if any; test whether the reviewer is independent in substance and process; flag any seller-determined review path.
4. Identify the retention structure, the retained interest description, and the governing rule invoked or implied; assess whether the sizing is clear and compliant or whether the structure leaves ambiguity.
5. Identify the performance tests that trigger principal step-down; assess how the trigger changes subordination and which class bears the economic shift.
6. Locate cap-related cash flows in the waterfall; determine whether their priority preserves the hedge; flag any subordination that could cause failure of intended protection.
7. Review collateral geography and pricing distribution together; identify states with express rate caps or licensing sensitivity; test whether the transaction materials expressly address origination compliance.
8. Compare servicer-replacement triggers with early-amortization triggers and note which event occurs first under each scenario; assess whether the sequence creates an operational mismatch.
9. Review the breach remedy timetable; identify the time from discovery to repurchase; assess whether the period is commercially long enough to leave investors exposed.
10. For each issue, include: severity, source cross-reference, quantified or scaled reference point from the documents, interacting provision or document, downstream consequence, and a specific fix.

## 5. Vertical / structural / temporal relationships
- Pool balance and retention sizing must be read together: an incorrect asset base distorts both enhancement metrics and the retained-interest analysis.
- Step-down mechanics can interact with early amortization and repurchase timing: a faster principal release can coincide with slower remediation, increasing pressure on junior classes.
- Servicer transfer timing and early amortization timing are temporal, not just substantive, and must be sequenced as they would operate in a stress case.
- Hedge waterfall priority should be evaluated against expense priority and note interest together, because a hedge can be nominally present yet functionally ineffective.
- State compliance risk is pool-wide but often concentrated by coupon band and jurisdiction; identify the subset driving the issue rather than referring to the pool generically.

## 6. Output structure conventions
- Write an issue memorandum in a professional client-circulation style.
- Begin with a short severity legend using a uniform ordinal scale such as Critical / High / Medium / Low.
- Organize the body by severity, with the most urgent issues first.
- For each issue, use a consistent block: issue statement, source cross-reference, quantified or scaled reference point, interaction with another document or clause, practical consequence, and recommended resolution.
- State the governing legal or market-standard authority for each proposition you rely on, using the relevant statute, regulation, rule, or recognized market convention.
- End with a concise Recommended Actions block that assigns an imperative action to the relevant role and ties it to the pricing or signing milestone.
- If a source document does not supply a needed data point, say so expressly and mark the issue for follow-up rather than assuming the missing term.
