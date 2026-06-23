---
name: compare-pa-vs-commitment-letter
task_id: corporate-ma/compare-pa-vs-commitment-letter
description: Guides cross-document comparison of a purchase agreement against a debt commitment letter, identifying mismatches in specified representations, financing conditions, timeline alignment, financial statement requirements, and fund-level change-of-control implications.
activates_for: [planner, solver, checker]
---

# Skill: Compare Purchase Agreement vs. Commitment Letter

## 2. Failure modes the skill is correcting

- Comparing documents at a high level without tracing whether a mismatch actually changes a closing condition, funding condition, timing covenant, or practical closing path
- Missing that a financing condition can be embedded in one document while the other assumes unconditional closing mechanics
- Overlooking deadline drift between the purchase agreement, commitment letter, financial summary, and deal emails, especially where one date governs delivery and another governs funding availability
- Failing to compare representation qualifiers, bring-down standards, and “specified representation” concepts across the document set
- Missing fund-level ownership effects from rollover equity, management equity, or similar equity participation that may shift control percentages or trigger credit-agreement consequences
- Treating a document conflict as purely legal when the real issue is transaction execution risk, leverage availability, or seller remedy exposure

## 3. Legal frameworks / domain conventions that apply

- Specified representations: in leveraged acquisition financings, lenders often limit funding conditions to a subset of purchase agreement representations; if the commitment letter makes a representation a funding condition but the purchase agreement does not make it a closing condition, the lender may have a separate basis to refuse funding even if the buyer can close under the acquisition agreement
- Financing as a closing condition: market practice in many acquisition agreements is to avoid a standalone financing-out for the buyer; instead, the agreement may rely on reverse termination fee mechanics, limited specific performance, or a separately negotiated financing failure regime
- Outside date and commitment availability: if financing commitments expire before the acquisition outside date or before the contemplated closing window, the transaction may lack committed funding at the moment it needs to close unless an extension or evergreen mechanic exists
- Financial statement delivery and audit requirements: acquisition agreements and commitment letters often impose different delivery standards, fiscal periods, review levels, or audit requirements; any mismatch can create a technical default under one document while the other is satisfied
- Qualifier alignment: the same representation may be narrowed differently across documents by materiality, knowledge, disclosure schedule, MAE, or customary qualifier language, changing the practical scope of the bring-down standard
- Fund-level change-of-control: where the buyer fund’s ownership profile changes because of rollover equity or management equity, the relevant threshold must be checked against the governing credit or partnership arrangements; if the post-transaction ownership mix crosses the threshold, a control trigger risk may arise
- Governing authority should be named for each legal proposition relied on; where the source documents specify the governing standard, use that formulation, and where they do not, use the generally recognized transaction-law convention that supports the comparison

## 4. Analytical scaffolds

1. **Enumerate the comparison set before analyzing**
   - Identify each document and the operative timeline it supplies: acquisition agreement, commitment letter, financial summary, and deal-team emails.
   - If a point turns on a specific representation, date, financial statement period, or ownership threshold, isolate that item first; do not collapse multiple items into one pass.

2. **Specified representations and funding conditions**
   - List the commitment-letter conditions tied to representations or certificates.
   - Compare each to the purchase agreement’s closing conditions and bring-down mechanics.
   - Flag any representation that is a funding condition but not a closing condition, or is qualified more narrowly in one document than the other.
   - State the source-documented threshold or period, the cross-document interaction, and the closing or funding consequence.

3. **Financing condition / no-financing-out analysis**
   - Identify whether the purchase agreement makes financing a standalone closing condition or otherwise gives the buyer a walkaway right tied to financing failure.
   - Compare that structure to market norms for leveraged buyouts and note whether the seller bears a non-market financing risk.
   - Tie the issue to the transaction’s remedy scheme and closing mechanics.

4. **Outside date and commitment expiration**
   - Compare the purchase agreement outside date, any extension rights, and any commitment-letter expiration or termination date.
   - Analyze whether the financing commitment remains live through the latest plausible closing date.
   - If the documents diverge, explain the practical gap and the likely need for a parallel extension, amendment, or conditioning fix.

5. **Financial statement obligations**
   - Compare required financial statements, audit/review standards, delivery deadlines, and any interim-period requirements.
   - Analyze each period separately when multiple fiscal years, quarters, or interim periods are implicated.
   - Identify the most demanding standard and note any mismatch that could create a technical default or closing-delay risk.

6. **Fund-level change-of-control**
   - Identify the governing threshold in the relevant fund-level or credit arrangement if one is provided.
   - Compare the pre- and post-transaction ownership profile using the transaction’s rollover and management equity mechanics.
   - State whether the ownership mix approaches, meets, or breaches the threshold and the operational consequence if it does.

7. **Representation qualifier consistency**
   - Compare the same representation across documents for knowledge, materiality, MAE, schedule, or customary qualifiers.
   - Note whether the difference narrows or broadens the practical standard.
   - State the resulting effect on funding risk, closing risk, or disclosure burden.

8. **Issue closure discipline**
   - Every identified deviation should be written as a complete issue: severity, what the documents say, why they differ, how they interact, and what happens if the gap is not fixed.
   - If a quantitative threshold appears in the source set, use it to anchor the analysis; if not, identify the controlling date, trigger, or condition.
   - Cite the governing legal or transactional convention supporting the conclusion rather than stating the conclusion bare.

## 5. Vertical / structural / temporal relationships

- Track the hierarchy among the acquisition agreement, commitment letter, financial summary, and deal emails; later or more specific instructions may clarify drafting intent, but they do not automatically override executed terms
- Distinguish closing conditions from funding conditions, and distinguish both from covenant-style delivery obligations
- Treat timing as transactional, not merely calendaring: a date mismatch can create a live funding gap even if the legal language is otherwise consistent
- When multiple fiscal years, interim periods, or deliverable dates exist, analyze each separately and preserve the sequence in which the obligations mature
- Where equity rollover or management participation changes the ownership profile over time, assess whether the threshold is tested at signing, closing, or after issuance, and use that timing point consistently
- If emails evidence drafting intent that differs from the executed text, note the discrepancy as an execution risk but do not treat email language as controlling absent an amendment or incorporated instruction

## 6. Output structure conventions

- Produce a deviation report organized by risk level using a clear ordinal scale defined up front, such as Critical / High / Medium / Low
- For each deviation, include: severity; purchase agreement provision; commitment letter provision; gap description; practical consequence; recommended resolution
- Make each entry self-contained and complete enough for a deal team to act on without rereading the source stack
- Separate structural mismatches, timeline conflicts, financial statement issues, and economic or condition provisions into distinct groupings
- Include a concise summary of the issues by category before the detailed entries
- End with a practical recommendations section that assigns an action, a responsible role, and a timing anchor tied to the transaction milestone or document deadline
- When the analysis depends on a legal or market-practice proposition, name the governing authority or convention that supports it
- Do not use a rigid section template that mirrors any hidden checklist; use conventional deal-issue-report headings instead
