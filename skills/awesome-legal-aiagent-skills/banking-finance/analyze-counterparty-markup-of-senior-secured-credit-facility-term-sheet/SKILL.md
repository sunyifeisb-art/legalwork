---
name: analyze-counterparty-markup-of-senior-secured-credit-facility-term-sheet
task_id: banking-finance/analyze-counterparty-markup-of-senior-secured-credit-facility-term-sheet
description: Produces a deviation analysis memo comparing a lender's markup against the original term sheet, applying a negotiation playbook to classify and recommend a response to each change.
activates_for: [planner, solver, checker]
---

# Skill: Counterparty Markup Deviation Analysis (Senior Secured Credit Facility Term Sheet)

## 1. Subject-matter triage

- Treat the task as a side-by-side markup comparison of the lender version against the original term sheet, informed by the playbook, partner instructions, and financial data.
- Separate true deviations from formatting noise, consistent drafting, and terms that are already contemplated by the source package.
- Identify whether each change is economic, structural, covenant-related, definitional, or administrative before deciding how to respond.
- If the source set contains more than one counterpart provision, covenant bucket, pricing item, or scenario, enumerate them first and analyze each one separately; do not collapse distinct changes into a single pass.

## 2. Failure modes the skill is correcting

- Treating all deviations as equivalent instead of classifying each by playbook disposition.
- Conflating similar covenant concepts that serve distinct purposes and carry different risk profiles for the borrower.
- Identifying economic changes without tying them to the deal's own financial data or projections.
- Missing the legal significance of qualifier removal from material adverse effect definitions, which can materially expand lender termination rights under applicable doctrine.
- Skipping a change because it appears minor, when separate drafting moves can shift risk in different ways.
- Describing a deviation without stating why it matters operationally or economically for the client.
- Repeating the same response template across issues without checking whether the issue is actually reject, counter-propose, or accept.

## 3. Legal frameworks / domain conventions that apply

- Anti-layering vs. MFN distinction: anti-layering covenants restrict the borrower from issuing debt structurally senior to existing debt; MFN provisions give existing lenders pricing protection if new debt carries higher economics. Assess them separately because the borrower risk is different.
- Excess cash flow sweep: a mandatory prepayment provision requiring a percentage of excess cash flow to be applied to outstanding debt. Use the transaction's projections to gauge the cash impact rather than treating the provision abstractly.
- MAE qualifiers: phrases such as "taken as a whole" and "material" can narrow a termination right by requiring aggregate and substantial harm. Removing those qualifiers expands lender discretion and should be analyzed as a meaningful legal and negotiation change.
- Market practice on MAE: in major commercial financing practice, MAE findings generally require substantial, durationally significant harm; qualifier removal should be treated as a material deviation for analysis purposes.
- Credit agreement conventions: pricing, prepayment, collateral, negative covenant, event-of-default, and agency language often interact; a change in one clause can alter the operation of another even if the line edit is small.
- Apply the controlling authority or market convention that supports each legal proposition relied on; do not state a legal conclusion without identifying the doctrine or practice rule that supports it.

## 4. Analytical scaffolds

1. Read the original term sheet, lender markup, playbook, partner instructions, and financial data together before drafting conclusions.
2. Work through every substantive change against the original term sheet; do not skip provisions that look routine.
3. For each deviation, state:
   - what changed,
   - how it is classified,
   - how the playbook treats it,
   - why it matters for the borrower,
   - what response is recommended.
4. For every issue, close the analysis with three moves:
   - scale it against a figure, term, threshold, or other concrete measure from the source materials;
   - cross-reference any clause, schedule, covenant, or pricing mechanic that interacts with it;
   - state the downstream consequence for the client.
5. Keep anti-layering, MFN, sweep mechanics, MAE language, and other distinct concepts separate unless the source documents clearly tie them together.
6. If an issue depends on a legal proposition, name the governing doctrine, rule, statute, regulation, or recognized market practice that supports the analysis.
7. If an issue is economic, quantify the impact using the provided financial data rather than leaving the effect qualitative.
8. Assign a playbook disposition to each deviation and ensure the recommendation is consistent with that disposition.
9. If the same edit affects more than one risk channel, address each channel explicitly rather than choosing only the most obvious one.

## 5. Vertical / structural / temporal relationships

- Check how borrower-favorable and lender-favorable edits propagate across the document: a definitional change may alter covenant reach, default triggers, pricing protections, or reporting obligations elsewhere.
- Compare the timing of obligations, cure periods, notice windows, and funding mechanics; a shift in sequencing can be as important as a substantive change.
- Watch for cross-references that import standards from one section into another, especially where a definition or qualifier is reused.
- If the markup changes a threshold, percentage, cap, basket, or sweep rate, consider the resulting effect over the relevant projected period using the deal data.
- Distinguish between provisions that operate at closing, during the life of the facility, and at enforcement; the risk profile can change by stage.

## 6. Output structure conventions

- Produce a deviation analysis memo organized by issue number and written in conventional legal-memo style.
- Include a clear severity label for each issue using a consistent ordinal scale defined once at the top.
- For each issue, include the original term, the counterparty markup, the playbook position, the severity/risk rating, the recommended response, and a concise rationale.
- Make the rationale explicit enough that a reader can identify the change from the plain text alone; if quoting or paraphrasing source language, keep it limited and precise.
- Where the issue is economic, include the relevant financial impact or directional effect from the source materials; where it is legal, identify the supporting authority or market convention.
- End with a Recommended Actions section that converts the analysis into next-step instructions with a responsible role and timing anchor.
- Include a short summary table mapping issue to severity, disposition, and recommended action.
- Use a document structure suitable for export as `deviation-analysis-memo.docx`; the memo is the deliverable, not a description of one.
