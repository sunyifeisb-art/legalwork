---
name: identify-issues-in-servicer-compliance-certificate
task_id: structured-finance-securitization/identify-issues-in-servicer-compliance-certificate
description: Reviewing a servicer compliance certificate and supporting materials from the trustee's perspective to identify numerical discrepancies across reported figures, verify that required non-recoverability determination documentation exists, assess proximity to any applicable modification cap, and explain the waterfall consequence of each identified error.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Servicer Compliance Certificate — Issue Memorandum for RMBS Trustee

## 2. Failure modes the skill is correcting

- Treating the compliance certificate as self-proving instead of reconciling each reported figure to the underlying loan-level and account-level support.
- Missing loan-specific advance stoppages and failing to tie each stoppage to the required written non-recoverability support.
- Identifying a modification problem without scaling it against the applicable pool-level cap or remaining headroom.
- Failing to connect an error to the specific waterfall or distribution consequence for noteholders and the trustee.
- Collapsing multiple periods, buckets, or data sources into one blended conclusion instead of isolating each discrepancy.
- Omitting a severity designation or a concrete remediation path for each issue.

## 3. Legal frameworks / domain conventions that apply

- Trustee review of periodic servicer certifications is a documented compliance function; discrepancies should be tested against the PSA and the supporting statements, tapes, and reconciliations, not against the certificate alone.
- Numerical fields in the certificate must be independently reconciled to the corresponding source record: pool balance, delinquency buckets, REO counts, advances, modifications, reserve balances, and any sub-servicer rollups.
- Aggregate pool balance differences matter because they affect enhancement mechanics and current-period distribution calculations.
- Delinquency bucket mismatches matter because they can alter trigger testing and the timing of enforcement or reporting consequences.
- REO classification must be checked for consistency because misclassification can shift loss recognition timing and distort performance reporting.
- Before advances are discontinued on a delinquent asset, verify the PSA’s non-recoverability standard and the existence of written support for that determination; the issue is both a documentation problem and a servicing-compliance problem.
- Modification activity should be tested against any transaction cap or lifetime limitation using the governing PSA definition of the numerator and denominator, including whether approvals, consummations, or other milestones count.
- Where sub-servicers or other downstream administrators feed the certificate, aggregate totals should be reconcilable to their confirmations or rollups; unexplained deltas can indicate data-handling error.
- Reserve account and insurance disclosures should be checked against the account statement and insurance evidence to confirm the stated credit support is actually in place.
- Any legal conclusion about an inconsistency should be tied to the governing PSA provision or other controlling source cited in the materials; do not state a compliance breach without naming the operative contractual basis.

## 4. Analytical scaffolds

1. Identify every source document to be reconciled and map each certificate line item to its supporting exhibit before analysis begins.
2. For each reported figure, compare the certificate value to the corresponding support value and record the exact discrepancy.
3. For each discrepancy, scale it against the relevant benchmark in the file set, such as pool size, bucket count, advance balance, modification cap, or reserve balance.
4. For each discrepancy, identify the interacting PSA provision, schedule, or supporting document that governs the figure.
5. For each discrepancy, explain the downstream effect on distributions, triggers, enhancement, reporting accuracy, or servicing compliance.
6. For advance stoppages, isolate each affected loan, confirm whether the required written non-recoverability determination exists, and identify the contractual basis that makes the documentation relevant.
7. For modification activity, compare the reported count or status to the underlying activity report and then test the reported level against any remaining cap capacity.
8. For reserve and insurance items, compare the certified status to the relevant statement or certificate and note any shortfall, inconsistency, or missing support.
9. If multiple periods, loans, buckets, or reporting categories are involved, analyze them item by item rather than as a single blended population.
10. Close each issue with a concise remediation step that matches the problem identified.

## 5. Vertical / structural / temporal relationships

- Discrepancies may be cumulative across periods, so a current mismatch should be considered in light of prior-period reporting if the source set permits.
- Advance stoppages and modification activity can interact economically: a servicer that is reducing advances while also understating modifications may be masking a broader servicing trend.
- Cap proximity changes the significance of any understatement in reported modification activity; a small reporting error may conceal exhaustion of remaining capacity.
- Bucket migration, REO movement, and advance cessation can occur on different reporting dates, so the analysis should preserve the timing of each event and not treat them as simultaneous unless the source documents show that they are.

## 6. Output structure conventions

- Write the result as an issue memorandum for the trustee, not as a purely narrative summary.
- Define a uniform ordinal severity scale once at the outset and apply it to every issue entry consistently.
- Begin with a short executive summary, then a reconciled issues section, then a concise recommendations section.
- For each issue, include: the discrepancy with both values, the governing PSA or source-document basis, the amount or scope of exposure relative to the relevant benchmark, the downstream consequence, the severity rating, and the corrective action.
- Where an issue involves more than one loan, bucket, or period, present the affected items in a compact enumerated or tabular form before the analysis.
- Use governing-document citations only; do not rely on unexplained shorthand or implied authority.
- End with a Recommended Actions block that assigns the next step to the relevant trustee, servicer, or administrator role and ties it to an immediate or milestone-based timeline.
- Keep the memo self-contained and operational: each identified issue should be understandable without cross-referencing the certificate by page number alone.
