---
name: compare-trust-distributions-against-trust-instrument
task_id: trusts-estates-private-client/compare-trust-distributions-against-trust-instrument
description: A trust distribution compliance review requires reading the governing instrument against every ledger entry, confirming required co-trustee execution, verifying loan authority and repayment terms, and assessing whether any charitable distribution limits were respected in each period.
activates_for: [planner, solver, checker]
---

# Skill: Compare Trust Distributions against Trust Instrument — Compliance Memorandum

## 1. Subject-matter triage
- Read the governing instrument before evaluating any ledger entry, meeting minute, or support file.
- Build the universe of review items first: each distribution, each alleged loan, each period with charitable activity, and each transaction requiring co-trustee action.
- If the record set contains multiple periods, multiple beneficiaries, or multiple transaction types, enumerate them explicitly before analysis and apply the same test to each item.
- If the review concerns only one period or one transaction class, state that affirmatively and explain why no broader grouping is needed.

## 2. Failure modes the skill is correcting
- Reviewing distributions without extracting the instrument’s distribution standards, procedural conditions, and any express limits.
- Accepting ledger labels at face value where a payment is described as a loan but the supporting record does not match that characterization.
- Missing required co-trustee authorization or treating informal assent as equivalent to the instrument’s required form of approval.
- Failing to aggregate charitable distributions by the relevant accounting period before testing any cap or ceiling.
- Treating missing paperwork as a mere clerical issue when it may also evidence an unauthorized or noncompliant distribution.
- Collapsing distinct findings into one generic comment instead of classifying each distribution separately.
- Describing a problem without tying it to the governing authority, the relevant record, and the practical consequence for the trust administration.

## 3. Legal frameworks / domain conventions that apply
- Trustee compliance: administration must follow the trust instrument and fiduciary duties applicable to the trustee’s exercise of discretion.
- Governing-instrument hierarchy: the instrument controls distribution authority, procedural prerequisites, and any special limits before generalized practice assumptions.
- Discretionary distribution standards: if the instrument uses standards tied to beneficiary welfare or similar criteria, each distribution should be matched to the stated standard and its factual support.
- Co-trustee authority: where the instrument requires joint action, written approval, countersignature, or other formal concurrence, the record must show compliance in the manner required by the instrument.
- Loan authority: a transfer labeled as a loan must be tested against any express lending authority, repayment terms, maturity, interest, security, and actual repayment performance.
- Accounting characterization: mislabeling a distribution as a loan, or vice versa, can distort the trust account and mask whether the transaction was authorized.
- Charitable caps: if the instrument limits charitable giving over a period, aggregate all charitable transfers in that period before judging compliance.
- Documentation sufficiency: contemporaneous records should support the nature, amount, purpose, and authorization for each material distribution.
- Authority citation: when stating a legal proposition, identify the controlling rule, statute, regulation, or governing-instrument provision that supports it.

## 4. Analytical scaffolds
1. Extract the governing rules from the instrument: distribution authority, any purpose-based standards, co-trustee requirements, loan authority, charitable limits, timing rules, and documentation prerequisites.
2. Create an itemized list of all transactions within scope, grouped by period and by transaction type where relevant.
3. For each item, identify:
   - the amount and date,
   - the stated purpose or label,
   - the governing provision that applies,
   - whether the support record shows compliance,
   - whether any missing fact changes the classification.
4. For each loan-labeled item, test separately for authority to lend, documentation of loan terms, and repayment performance.
5. For each charitable transfer, aggregate all charitable items within the relevant period and compare the total to the applicable limit.
6. For each item requiring co-trustee action, verify the specific form of approval demanded by the instrument.
7. Distinguish three different problems: lack of substantive authority, failure of required procedure, and incomplete support documentation.
8. Classify each finding by severity on a defined ordinal scale and explain the severity in one line.
9. For each issue, close the analysis by tying together the scale of the item, the related source documents, and the consequence for trust administration or exposure.
10. End with concrete corrective steps assigned to the relevant fiduciary role and tied to the nearest practical deadline or next administration milestone.

## 5. Vertical / structural / temporal relationships
- Trace each distribution to the specific clause or provision that authorizes it, and then to the ledger and minutes that purport to memorialize it.
- Compare later supporting records against earlier authorizations to see whether the approval was timely and whether the transaction was implemented as approved.
- When a transaction spans more than one period, evaluate authorization at the time of the transfer and repayment or performance in each later period separately.
- When charitable activity is spread across a review period, use the relevant period boundary from the instrument or the accounting record, not an assumed annual cycle.
- When a loan is repaid in installments or modified after origination, treat the origination, each repayment, and each modification as linked but distinct points of review.

## 6. Output structure conventions
- Write a court-ready compliance memorandum in a conventional legal style.
- Begin with a short executive summary that states the overall compliance posture.
- Include a defined severity scale at the start and use it consistently for every finding.
- Provide an item-by-item analysis for each distribution or transaction class, with one row or subsection per item.
- For each finding, state the governing provision, the record reviewed, the compliance conclusion, the severity level, and the practical consequence.
- Include a separate charitable-distributions section that shows the period-based aggregation and the cap comparison.
- Include a separate loans section if any item is characterized as a loan or repayment.
- Include a separate section for missing or inadequate support documentation.
- End with a concise recommended actions section that tells the fiduciary what to do next, by role and by urgency.
- If a record does not support a clear conclusion, say so explicitly and explain what additional document or fact is needed before the item can be classified.
