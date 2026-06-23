---
name: identify-issues-in-credit-agreement
task_id: banking-finance/identify-issues-in-credit-agreement
description: Compares a final credit agreement against the governing deal materials and internal instructions from the borrower’s side, and produces a prioritized issue-spotting memorandum with severity classifications and recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Credit Agreement Issue-Spotting Memo — LBO Financing (Borrower Side)

## 1. Subject-matter triage
- Treat the final credit agreement, commitment letter, term sheet, and partner email as a single comparison set.
- Identify whether the task is a true issue-spotting exercise, not a summary; the output should isolate borrower-unfavorable deviations and negotiation targets.
- If multiple governing materials conflict, note the hierarchy implied by the deal record and flag the ambiguity as an issue.

## 2. Failure modes the skill is correcting
- Spotting deviations without separating a governing-material breach from an ordinary market deviation, which changes the borrower’s leverage in negotiations.
- Missing provisions that are not facially dramatic but create outsized operational risk because of the borrower’s scale, structure, or business profile.
- Overlooking acquisition covenant changes that tighten the standard, add hidden defaults, or substitute a more restrictive metric.
- Failing to elevate internal borrower priorities that are expressly called out in the partner email.
- Describing a problem without closing it against the relevant scale, cross-reference, and consequence.
- Listing issues without an ordinal severity judgment, which makes the memo unusable for negotiation triage.
- Stating complaints without a concrete recommended next step, owner, and timing.

## 3. Legal frameworks / domain conventions that apply
- Cross-default provisions: identify the trigger and threshold; assess whether the formulation is proportionate and borrower-unfriendly relative to the transaction profile.
- MFN pricing protection: identify the protection period and any sunset; compare the final form against the deal materials and flag any contraction.
- Permitted acquisition covenant: identify the condition precedent and default carve-out structure; compare it to the deal materials and flag any added restriction.
- Acquisition leverage metric: identify the ratio or reference point used for acquisition tests; assess whether the final draft substitutes a tighter measure than the materials contemplated.
- Netting for leverage calculations: identify any cap or limitation on cash netting; compare it to market practice for a transaction of comparable size and flag borrower-unfavorable tightening.
- Equity cure mechanics: identify limits on frequency, timing, use, and application; compare against the deal materials and treat any added restriction as high significance.
- Priority instructions from the partner email: surface each issue expressly and track it to the memo.
- General credit-agreement drafting conventions: compare final form against the negotiated record, then translate the delta into borrower-side risk and leverage.

## 4. Analytical scaffolds
1. Inventory the source set: enumerate the final agreement, commitment letter, term sheet, and internal instruction set before analyzing deviations.
2. For each issue, identify the precise provision in the final agreement and the corresponding language in the governing materials.
3. State the deviation in plain English, then classify whether it is a governing-material mismatch, a market-practice concern, or both.
4. For each issue, close the analysis by:
   - tying the issue to a concrete scale, threshold, term, or other transaction metric in the source documents;
   - cross-referencing the clause, schedule, or provision that interacts with it;
   - stating the downstream consequence for the borrower.
5. Apply a uniform ordinal severity scale:
   - Critical: direct departure from governing materials or a highly prejudicial control term;
   - High: materially borrower-unfavorable term that merits immediate negotiation;
   - Medium: meaningful but narrower issue;
   - Low: cleanup or drafting issue with limited substantive impact.
6. When more than one issue category is present, analyze each separately rather than collapsing them into a single combined concern.
7. Treat internal partner priorities as mandatory to address even if the final agreement is otherwise market.

## 5. Vertical / structural / temporal relationships
- Compare the final credit agreement to the commitment letter and term sheet clause-by-clause where the issue is structural, not merely definitional.
- Track temporal changes carefully, especially sunsets, cure periods, testing windows, notice periods, and compliance dates.
- For restrictions that depend on size or exposure, explain how the borrower’s scale magnifies or reduces the practical risk.
- If a provision interacts with another covenant, default, basket, or ratio, identify the interaction explicitly rather than implying it.

## 6. Output structure conventions
- Produce a borrower-side issue-spotting memorandum, not a redline and not a deal summary.
- Use a conventional issue-by-issue format with a short opening priority summary followed by numbered issues.
- For each issue include:
  - Issue title
  - Severity
  - Final-agreement formulation
  - Governing-deal-material formulation, if applicable
  - Deviation analysis
  - Why it matters to the borrower
  - Recommended ask or fallback position
- Keep the severity label explicit and consistent across all issues.
- Prioritize the most deal-relevant issues first, especially express partner priorities and direct departures from the governing materials.
- End with a Recommended Actions section that assigns the next step to the relevant deal role and ties it to the financing timetable or next negotiation milestone.
- Use only issue language that can be supported by the source documents and recognized credit-agreement conventions; do not assert a legal conclusion without identifying the governing provision or market rule that supports it.
