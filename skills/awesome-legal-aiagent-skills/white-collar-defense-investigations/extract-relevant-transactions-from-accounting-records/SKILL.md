---
name: extract-relevant-transactions-from-accounting-records
task_id: white-collar-defense-investigations/extract-relevant-transactions-from-accounting-records
description: Transaction summary memorandum extracting and aggregating potentially relevant transactions from accounting records for an investigation, tracing ownership connections between vendors and company insiders, and analyzing fee structures for evidence of possible diversion.
activates_for: [planner, solver, checker]
---

# Skill: Extract Relevant Transactions from Accounting Records — Forensic Transaction Summary

## 1. Subject-matter triage
- Treat the source set as an accounting-to-evidence extraction exercise, not a narrative summary.
- First identify all apparent counterparties, then separate ordinary operating spend from items that may implicate related-party payments, personal benefit, fee diversion, or disclosure issues.
- When multiple vendors, accounts, periods, or payment channels appear, enumerate them before analysis and work vendor-by-vendor so no entity is collapsed into a generic bucket.
- If only one counterparty is truly in scope, state that affirmatively and explain why the remaining records are not separately material.

## 2. Failure modes the skill is correcting
- Transactions are listed in isolation instead of being grouped by counterparty and explained in terms of why the pattern matters.
- Payments to the same entity are not aggregated across bank activity, wires, cards, reimbursements, or expense submissions.
- Ownership or control links between vendors and insiders are asserted without identifying the source document that proves the link.
- Fee arrangements are described without testing whether they have scope, deliverables, milestones, or another arms-length basis.
- Corporate-card or expense activity is not tested for personal benefit, insider benefit, or payments to insider-controlled entities.
- Disclosure issues are overlooked even when the transaction analysis suggests an undisclosed related-party relationship.
- The memo stops at description and does not tie each flagged item to scale, source interaction, and downstream significance.

## 3. Legal frameworks / domain conventions that apply
- Related-party analysis turns on ownership, control, or other insider connection between the company and the recipient entity.
- Forensic tracing may rely on internal emails, vendor onboarding materials, operating documents, state filings, bank records, invoices, expense reports, or other source documents that identify the connection.
- Aggregate exposure is measured across all payment paths to the same recipient, not by isolated line item.
- Consulting, advisory, and success-fee arrangements warrant scrutiny when the record does not show defined work, deliverables, milestone triggers, or a commercial basis for the charge.
- Corporate-card and reimbursement activity is suspicious when the stated business purpose does not match the apparent beneficiary or when the beneficiary is an insider or insider-controlled entity.
- If public or regulatory filings omit a relationship that the transaction record suggests should have been disclosed, note the possible disclosure gap as a separate issue.
- State legal propositions only with the governing authority or practice principle that supports them; do not present a conclusion without identifying the rule or convention on which it rests.

## 4. Analytical scaffolds
1. **Build the counterparty list**
   - Identify each vendor, payee, card beneficiary, reimbursed person, or intermediate entity.
   - Group affiliated names that appear to function as the same economic recipient.

2. **Trace the ownership connection**
   - For each potentially related counterparty, identify the source document that links the entity to an insider.
   - Distinguish direct ownership, indirect ownership, control, nominee relationships, and intermediary entities.

3. **Aggregate the payments**
   - Combine all payments to the same economic recipient across accounts, dates, channels, and transaction types.
   - Itemize the underlying transactions by date, amount, source account, and payment method before stating the aggregate.

4. **Test the business rationale**
   - Compare the payment pattern to the stated role of the vendor and the documentation supporting the charge.
   - Flag missing contracts, vague scopes, unexplained invoices, round-number billing, repeat payments without milestones, or fees that appear untethered to deliverables.

5. **Review card and expense activity**
   - Identify charges that appear personal, mixed-use, or directed to a related entity.
   - Note any cash-like advances, reimbursements lacking support, or charges inconsistent with ordinary business use.

6. **Check disclosure consistency**
   - Compare the transaction findings against any disclosure materials in the source set.
   - Flag omissions, inconsistencies, or incomplete descriptions that suggest a separate reporting issue.

7. **Close each flagged item**
   - For every flagged transaction group, state the scale of the payment pattern, the source documents that interact with it, and the practical consequence for the investigation or the company.

## 5. Vertical / structural / temporal relationships
- Trace the path from funding source to ultimate recipient when an intermediate entity or layered payment structure appears.
- Note whether payments cluster around a transaction, event, filing period, quarter-end, year-end, or other timing marker.
- Treat repeated payments, sequential invoicing, split payments, or transfers through multiple accounts as potentially meaningful structure, not administrative noise.
- When a vendor appears connected to another vendor or to the same insider through an intermediate entity, describe the chain in the order the money and control move through it.

## 6. Output structure conventions
- Deliver a transaction summary memorandum organized by counterparty, with a short executive overview first.
- Include a table or equivalent compact list that identifies each flagged counterparty, the insider connection source, and the aggregate payment picture.
- For each counterparty, provide:
  - identity and role in the records;
  - the source document establishing any ownership or control connection;
  - the underlying transactions with dates, amounts, accounts, and channels;
  - the aggregated total across the source set;
  - the suspicious features that make the payments noteworthy;
  - the related business, fee, or disclosure concern, if any.
- Include a separate discussion for card activity and expense reimbursements that appear personal, insider-related, or unsupported.
- Use a clear severity label for each flagged item, applied consistently across the memo, with a brief rationale tied to the record.
- End with a concise recommended-actions section that uses imperative verbs, assigns the responsible business or legal role, and ties the timing to the investigation or filing milestone.
- Keep the memorandum evidence-driven and source-specific; avoid unsupported inference, but do not omit a flagged item simply because the source record is incomplete.
