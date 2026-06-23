---
name: analyze-term-sheet-markup-s02
task_id: corporate-ma/analyze-term-sheet-markup/scenario-02
description: Guides buyer-side analysis of a seller's term sheet markup, requiring arithmetic verification, assessment of deleted representations against R&W insurance coverage, and evaluation of non-market operational covenants before the negotiation session.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Term Sheet Markup (Scenario 02)

## 2. Failure modes the skill is correcting

- Missing arithmetic errors in the original term sheet or markup that create independent negotiation issues unrelated to the seller's stated positions
- Analyzing basket type and basket threshold changes separately rather than assessing their combined economic impact
- Failing to connect deleted representations to R&W insurance coverage gaps and to any known deal-specific background facts that make a particular deletion especially consequential
- Characterizing non-market operational covenants as minor business points rather than as deviations from market requiring pushback
- Treating a seller markup as a pure comparison exercise instead of a negotiation memo that must rank issues, tie each one to the deal record, and end in action

## 3. Legal frameworks / domain conventions that apply

- Financial arithmetic verification: figures referenced in different contexts must be internally consistent; stated fees, ownership percentages, thresholds, or valuation-related calculations must be checked against the transaction economics
- MAE/MAC definition: a carve-out excluding performance decline measured against the seller's own projections is non-market; it removes from the MAE definition the underperformance scenario most likely to affect deal economics
- Basket type and threshold combined analysis: changing both the basket type and the threshold amount produces a compounded economic effect; the two changes must be assessed together, not independently
- R&W insurance and deleted representations: R&W insurance follows the representations in the SPA; deleting a representation removes the policy anchor for that category of risk; the severity of a deletion must be assessed in light of any known diligence risk in that category
- Known risk and deleted representation interaction: where a specific regulatory or compliance risk is known to exist at the time of term sheet negotiation, deletion of the representation most likely to capture that risk is especially consequential because there is no longer a contractual basis for recovery
- Non-market employee and operational provisions: post-closing headcount restrictions, broad consent rights, unusual vetoes, and expansive good-reason concepts are non-standard in private-company PE acquisitions and constrain operational flexibility
- Governance and closing mechanics: changes to board rights, approval thresholds, exclusivity, fiduciary out, and governing law alter leverage, exit optionality, and enforcement posture and must be evaluated as deal-control terms, not housekeeping
- Common transaction-document authority: use the governing agreement hierarchy in the source set; where the memo relies on legal propositions, anchor them to the governing contract language, applicable insurance policy terms, or any cited statutory or regulatory framework in the deal materials

## 4. Analytical scaffolds

1. Triage the source set: identify the original term sheet, the seller markup, and any supporting diligence or deal documents that bear on risk, economics, insurance, control, or closing mechanics
2. Enumerate the issues before analyzing them: list each distinct change or omission that matters, then analyze each one on its own terms rather than collapsing multiple edits into one bucket
3. Arithmetic verification: verify all stated calculations and implied economics; flag errors as stand-alone negotiation issues
4. EBITDA consistency: verify the EBITDA figure is used consistently across all financial references and downstream calculations
5. MAE/MAC definition: identify all carve-outs added or deleted; flag non-standard carve-outs as seller-favorable
6. Basket and indemnity economics: assess basket type conversions and threshold changes together; explain how the combined structure shifts recovery value and leverage
7. Representations deleted: for each deleted representation, state the category of risk, whether R&W insurance will cover it without the representation, and whether any deal-specific diligence fact makes the deletion more consequential
8. Employee and operational provisions: enumerate non-market covenants; assess post-closing operational impact and practical constraints on the buyer
9. Governance provisions: analyze changes affecting board composition, consent rights, approval thresholds, exclusivity, and fiduciary out
10. Governing law and enforcement posture: identify any change and its practical implications for leverage, remedies, and forum
11. Severity grading: assign an ordinal severity label to each issue and use the same scale consistently across the memo
12. Recommendation discipline: convert each diagnosis into a concrete ask, concession, or fallback position tied to the negotiation session

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track each provision across the source documents that touch it: the term sheet, markup, insurance assumptions, diligence summaries, and any side letters or drafts that modify the same risk allocation
- Where a change interacts with another clause, state the cross-effect explicitly; do not analyze a deletion, covenant, or threshold in isolation if another document or provision changes its practical meaning
- Distinguish between pre-signing leverage points and post-closing operating constraints; a term may be tolerable at signing but costly in execution
- When timing matters, note whether the issue affects signing, closing, interim operations, or post-closing recovery
- If the analysis implicates more than one party, period, or scenario, handle each separately and avoid averaging across them

## 6. Output structure conventions

- Draft a negotiation analysis memo, not a redline; the memo should be organized by issue, with each issue presented in a uniform format
- Open with a short executive summary that states the overall buyer posture and the highest-priority negotiation points
- Include an issue list using an explicit ordinal severity scale defined once at the top of the memo, such as Critical / High / Medium / Low
- For each issue, include:
  - original position
  - seller's change
  - severity
  - analysis
  - deal-document or diligence cross-reference
  - client consequence
  - buyer recommendation
- Include a dedicated arithmetic verification section for any numerical inconsistencies, even if the seller did not highlight them
- Include a dedicated R&W insurance coverage gap section for deleted representations, linked to any known diligence facts that heighten the risk
- Include a combined economics section for basket or similar recovery-structure changes
- End with a Recommended Actions block that uses imperative verbs, assigns the responsible role, and ties each step to the next negotiation milestone or deadline in the source materials
- Keep the memo self-contained and practical: state the operative point, the reason it matters, and the proposed ask in a way that a deal lawyer or investor can use immediately
