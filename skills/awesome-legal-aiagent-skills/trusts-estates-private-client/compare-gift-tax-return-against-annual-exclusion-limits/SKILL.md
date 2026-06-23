---
name: compare-gift-tax-return-against-annual-exclusion-limits
task_id: trusts-estates-private-client/compare-gift-tax-return-against-annual-exclusion-limits
description: Reviewing a filed gift tax return against the transaction ledger and supporting documents requires reconciling all transfers, verifying annual exclusion qualification conditions, distinguishing direct-payment exclusions from ordinary exclusion gifts, and tracing any election-driven filing obligations.
activates_for: [planner, solver, checker]
---

# Skill: Compare Gift Tax Return Against Annual Exclusion Limits — Deviation Report

## 1. Subject-matter triage

- Treat the filed return, transaction ledger, trust instruments, valuation materials, and any election/consent documents as a single reconciliation set.
- First determine whether the year involves one donor or multiple donors, one donee or multiple donees, and one reporting period or multiple transfer dates; enumerate the full set before analysis.
- If only one transfer category or one reporting pathway is present, say so affirmatively and explain why.
- Separate ordinary present-interest gifts, direct-payment exclusions, trust-based gifts, and any special-election transfers before applying limits.

## 2. Failure modes the skill is correcting

- Accepting the return preparer’s characterization of exclusion eligibility without independently testing each statutory condition.
- Collapsing different exclusion regimes into one analysis, especially direct tuition or medical payments versus ordinary annual exclusion gifts.
- Missing withdrawal-right, notice, valuation, or timing defects that defeat present-interest treatment for trust contributions.
- Failing to reconcile the ledger to the return line by line, including omitted transfers, duplicated entries, and misallocated amounts.
- Overlooking election-driven filing, consent, or carryover consequences that shift reporting obligations to another filer.
- Treating exemption usage as self-evident rather than reconciling current-year usage against prior filings and carryforward records.
- Stating a conclusion without tying it to the governing authority and the source-document cross-reference that supports it.

## 3. Legal frameworks / domain conventions that apply

- Annual exclusion: apply the per-donor, per-donee annual exclusion only to gifts of present interests under IRC § 2503(b) and the applicable annual inflation-adjusted amount for the relevant year.
- Present-interest requirement: a transfer to trust qualifies only if the beneficiary has a legally enforceable current right to the transferred property or a presently exercisable withdrawal right sufficient to create present-interest treatment.
- Crummey-type withdrawal rights: if the trust relies on withdrawal notices or lapsing powers, verify the notice mechanics, timing, amount, and beneficiary class against the trust terms and transfer dates.
- Direct-payment exclusions: tuition or medical payments qualify only when paid directly to the institution or provider under IRC § 2503(e); reimbursement through the donee or payment of nonqualifying expenses breaks the exclusion.
- Gift splitting and joint reporting: if spouses or other permitted parties elect to share treatment, confirm the election’s scope, timing, and whether all covered transfers for the period are included consistently under IRC § 2513 and related filing rules.
- Special-election transfers: if any special election framework applies to a savings or education vehicle, analyze it under its own statutory and regulatory rules, including any multi-year election, carryforward, or reporting consequence.
- Valuation: apply fair market value principles to noncash transfers using the valuation support in the record, and test whether the reported value matches the evidence and the transfer date.
- GST interaction: determine whether the structure causes automatic GST consequences or requires affirmative allocation/reporting under chapter 13 rules.
- Unified credit and prior exemption: reconcile lifetime exemption usage, prior-year carryforwards, and current-year taxable gifts against the filed return and prior returns.
- Filing obligations: if an election changes who must file or consent, identify every affected filer and the return or consent that must accompany the reporting position.

## 4. Analytical scaffolds

1. Reconcile the ledger against the filed return.
   - List every transfer in the period, then mark each as reported, omitted, recharacterized, or properly excluded.
   - Tie each item to the supporting document that proves the amount, date, recipient, and transfer method.

2. Test each claimed annual exclusion item.
   - Confirm the transfer type, donee, present-interest status, and per-donee limit under IRC § 2503(b).
   - Where a trust is involved, verify withdrawal rights, notice, timing, and any lapsing or delay feature that may defeat present-interest treatment.
   - Cross-check the trust instrument and any notice record against the return’s treatment.

3. Test each claimed direct-payment exclusion.
   - Verify direct payment to the qualifying institution or provider under IRC § 2503(e).
   - Confirm the payment was not routed through the beneficiary and did not include nonqualifying components.
   - Cross-check the invoice, payment record, and any correspondence describing the purpose of payment.

4. Test election-based or split-treatment reporting.
   - Identify the election, who made it, the covered period, and the reporting consequences under the governing authority.
   - Confirm whether any additional filer, spouse, or consenting person had to sign, report, or allocate gifts consistently.
   - Cross-reference the election document, return signature page, and any related consent or disclosure.

5. Test valuation and reported totals.
   - Compare reported fair market value to the valuation support and any appraisal assumptions.
   - Where values differ, state the source document that controls the corrected amount and the downstream effect on annual exclusion usage and taxable gifts.

6. Reconcile exemption usage and prior filings.
   - Compare current-year exemption claimed, prior-year exemption used, and any carryforward shown in the record.
   - Identify inconsistencies between the filed return, prior returns, and any internal schedules.
   - State the corrected cumulative total and its impact on remaining unified credit.

7. Test GST and related reporting hooks.
   - Determine whether the transfer class implicates automatic GST treatment or requires affirmative allocation or additional disclosure.
   - Cross-reference the trust class, beneficiary class, and any allocation election or omission.

8. Close each issue with consequence.
   - State the magnitude of the item by reference to the transfer amount, number of transfers, or reported exposure in the source set.
   - Cross-reference the interacting document or rule.
   - Explain the client consequence: corrected tax, amended filing, additional consent, or disclosure exposure.

## 5. Vertical / structural / temporal relationships

- Build the analysis by transfer date, then by recipient, then by reporting treatment so that timing defects are visible.
- Distinguish year-of-transfer issues from prior-year carryforwards and later election effects.
- Where a trust has multiple beneficiaries or staggered withdrawal windows, analyze each beneficiary-period combination separately.
- If the return aggregates multiple gifts into one schedule line, break the aggregation apart before assessing exclusion eligibility.
- If a transfer occurs near a filing deadline or election deadline, flag the timing relationship explicitly because it can change reporting validity.

## 6. Output structure conventions

- Issue-by-issue deviation report, not a narrative summary.
- Begin with a short scope statement identifying the source set reviewed and whether the analysis found one or multiple transfer pathways.
- Use a uniform severity scale defined once at the top, such as Critical / High / Medium / Low, and assign one severity to every issue.
- For each issue, include:
  - severity
  - transfer or line item identifier
  - source-document cross-reference
  - governing authority by name and section
  - corrected computation or corrected treatment
  - downstream consequence
- Show corrected totals for:
  - annual exclusion allowed
  - direct-payment exclusions
  - taxable gifts
  - exemption used
  - remaining exemption, if the record supports it
- Reconcile prior exemption usage explicitly when prior filings exist.
- End with a concise Recommended Actions block listing imperative next steps, the responsible role, and a timing anchor tied to the filing or amendment milestone.
- If the record supports corrective filing, identify the amended return or supplemental disclosure route without drafting the filing itself.
