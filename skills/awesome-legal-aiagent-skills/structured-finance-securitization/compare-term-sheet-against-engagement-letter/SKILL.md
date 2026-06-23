---
name: compare-term-sheet-against-engagement-letter
task_id: structured-finance-securitization/compare-term-sheet-against-engagement-letter
description: Comparing a transaction term sheet against an engagement letter to identify conflicts in collateral eligibility criteria, representations and warranties cure mechanics, repurchase price methodology, and ancillary provisions whose operational or legal consequences are not immediately apparent from the face of the documents.
activates_for: [planner, solver, checker]
---

# Skill: Compare Term Sheet Against Engagement Letter — Deviation Report for ABS Securitization

## 1. Subject-matter triage

- Treat the task as a multi-document comparison across the term sheet, engagement letter, prior deal summary, and fee emails.
- Start by listing every relevant commercial term, eligibility criterion, remedy mechanic, fee point, and ancillary covenant that appears in any source.
- If a term appears in only one source, flag it as a potential gap; if it appears in multiple sources with different wording, treat it as a deviation even if the economic consequence is not obvious.
- Pull fee-email positions into the same comparison set; do not leave agreed commercial points outside the deviation analysis simply because they are informal correspondence.
- Use the prior deal summary as a context check for whether the current documents depart from the previously understood transaction posture.

## 2. Failure modes the skill is correcting

- Reviewing headline economics without checking the operational machinery that determines how the transaction actually performs after closing.
- Missing conflicts in pool eligibility, cure timing, repurchase economics, or disclosure obligations because they are embedded in different document types.
- Treating ancillary provisions as boilerplate instead of identifying when they change enforcement, disclosure, or fee exposure.
- Collapsing several distinct deviations into one generalized comment and losing the exact point of conflict.
- Failing to tie each issue back to a source-specific scale, threshold, or transaction milestone.
- Describing a discrepancy without stating why it matters to the client in economic, operational, regulatory, litigation, or closing terms.
- Omitting a severity judgment, which makes the report hard to prioritize.

## 3. Legal frameworks / domain conventions that apply

- Collateral eligibility provisions govern what assets may enter the pool; conflicts in credit-score floors, seasoning, concentration limits, documentation standards, or similar tests can alter pool composition and risk profile.
- Repurchase and cure provisions determine the seller’s remedy burden after a breach; differences in cure timing, repurchase trigger, or repurchase price methodology change investor recovery and seller exposure.
- Pool composition assumptions matter because structural credit support, excess spread, reserve sizing, and rating analysis typically depend on the stated eligibility criteria.
- Governing law and forum provisions should be checked against the transaction’s expected enforcement baseline and any internal consistency across the source set.
- Confidentiality and disclosure provisions must be checked for compatibility with required sharing to investors, rating agencies, auditors, regulators, and financing parties.
- Indemnity provisions should be assessed for allocation of risk, scope, cap, and unilateral versus mutual framing.
- Tail or surviving-obligation language in engagement letters can extend fee exposure beyond the named transaction if drafted broadly.
- The comparison should use the controlling authority or market baseline as stated in the source set, or if absent, the generally recognized securitization practice governing that topic.
- When legal effect depends on a recognized rule or doctrine, name the authority supporting the proposition rather than stating the conclusion in the abstract.

## 4. Analytical scaffolds

1. Build an issue register from all documents before analysis: enumerate every candidate deviation, then analyze each separately.
2. For each issue, identify the exact old position and new position, then state whether the conflict is express, implicit, or a gap.
3. For each issue, anchor the comparison to a source figure or threshold from the documents where available, such as a qualification floor, cure period, transaction milestone, fee trigger, or survival period.
4. For each issue, cross-reference the other document, schedule, email, or summary provision that interacts with it.
5. For each issue, state the downstream consequence for the client: economics, pool quality, recovery rights, disclosure burden, closing risk, enforcement uncertainty, or fee exposure.
6. If one provision is broader than another, assess whether the broader language expands scope, liability, or disclosure obligations in a way that could override the narrower reading.
7. If the sources are silent on a point, distinguish silence from inconsistency; silence may still matter if the prior deal summary or fee emails show an agreed commercial expectation.
8. When terms overlap, compare the operative standard, timing mechanics, remedy mechanics, and exceptions before concluding whether the deviation is material.
9. Use a uniform severity scale defined once at the top of the report and apply it consistently across entries.
10. Prioritize issues that affect asset eligibility, breach remedies, or fee entitlement over purely stylistic drafting differences.

## 5. Vertical / structural / temporal relationships

- Eligibility criteria often work cumulatively; a deviation in one test can interact with another to change the effective pool universe.
- Timing provisions can cascade: a shorter or longer cure period may alter when repurchase rights ripen and when associated notices or payments must occur.
- Tail and survival language can operate after closing and may continue fee or indemnity exposure beyond the main transaction date.
- Confidentiality provisions may conflict with mandatory disclosure duties if they are not expressly carved out for process participants and post-closing compliance.
- Fee emails may reflect an agreed commercial position that should supersede stale draft language; identify that temporal relationship explicitly.
- A prior deal summary may describe the intended market position even where the current documents drift from it; note the drift and its practical effect.

## 6. Output structure conventions

- Produce a prioritized deviation report, not a narrative memo.
- Open with a short severity key using ordinal labels such as Critical, High, Medium, and Low, and define the scale in one line.
- Include a compact summary table first, grouped by severity and issue type.
- Then provide numbered issue entries; each entry should include:
  - issue title;
  - severity;
  - source positions side by side;
  - the quantified or threshold-based anchor from the documents;
  - the interacting clause, schedule, email, or summary reference;
  - the downstream consequence;
  - a short recommendation.
- Keep the language operational and comparison-driven; do not restate entire provisions unless necessary to show the deviation.
- Where fee emails confirm a position, note that confirmation explicitly and distinguish it from the text of the formal documents.
- End with a Recommended Actions section that assigns next steps to the relevant business, legal, or finance owner and ties them to the deal timeline or closing milestone.
- Use industry-conventional headings and do not mimic any hidden checklist structure.
