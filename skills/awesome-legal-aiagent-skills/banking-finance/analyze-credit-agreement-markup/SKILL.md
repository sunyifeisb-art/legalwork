---
name: analyze-credit-agreement-markup
task_id: banking-finance/analyze-credit-agreement-markup
description: Produces a change analysis memo comparing a borrower-marked credit agreement against the prior draft and any governing commitment materials, with issue-by-issue risk classification and procedural recommendations on each deviation.
activates_for: [planner, solver, checker]
---

# Skill: Borrower Markup Change Analysis Memo (Senior Secured Credit Agreement)

## 1. Subject-matter triage
- This is a compare-and-assess task, not a clean drafting task: trace each borrower edit against the base agreement and any governing commitment materials before forming a view.
- Treat the arranger template as the organizing frame, but do not let the template obscure unauthorized deviations or missed carryovers from the commitment package.
- Separate changes that are expressly permitted by the commitment materials from changes that appear borrower-favorable but exceed the agreed term sheet.

## 2. Failure modes the skill is correcting
- Cataloguing edits without tying them to covenant, collateral, priority, liquidity, or enforcement consequences under the deal record.
- Missing lender-rights impairment structures, especially collateral leakage, priming, subordination, or transfer mechanics that weaken the creditor position.
- Treating all borrower changes as equally important instead of grading severity by scope, reversibility, and impact on lender protections.
- Failing to cross-check the markup against commitment materials, which can cause unauthorized concessions to be treated as accepted drafting.
- Describing changes in isolation without stating the related clause interaction and the client consequence.

## 3. Legal frameworks / domain conventions that apply
- Compare every material edit against the governing commitment letter and credit memo to determine whether the change is within the contemplated deal perimeter.
- For covenant mechanics, assess whether the edit loosens leverage, interest coverage, basket capacity, or springing-test discipline, and whether it alters testing frequency or cure availability.
- For EBITDA and addback drafting, assess whether the revision expands covenant EBITDA or broadens non-recurring, restructuring, or synergies-based adjustments.
- For mandatory prepayment and cash-sweep mechanics, assess whether the change reduces excess cash flow capture, changes netting, or weakens prepayment cadence.
- For collateral and priority provisions, assess whether the revision creates asset leakage, junior lien risk, priming capacity, or other creditor impairment.
- For transfer and lender-list provisions, assess whether the revised language preserves disqualified-lender protections and does not broaden transferable or holdable parties inadvertently.
- For basket provisions, assess whether the capacity is capped, leverage-linked, or effectively uncapped, and whether the revision materially expands secured-debt or investment flexibility.
- Apply the controlling authority embedded in the source documents first; where a proposition turns on market convention rather than a cited source authority, identify the relevant agreement section or generally recognized credit-document convention by name.

## 4. Analytical scaffolds
1. Enumerate the changed provisions first, then analyze each one separately; do not combine distinct edits into a single general comment.
2. For each change, identify: the original text, the borrower markup, the corresponding commitment-material position, and whether the edit is authorized, partially authorized, or unauthorized.
3. Assess each change for direction of effect: tighter for lenders, looser for borrowers, or neutral only if the drafting truly leaves the economic or legal effect unchanged.
4. Close each issue with three moves: anchor the significance to a source-document figure, threshold, term, or defined-mechanic reference; cross-reference any interacting clause or document; and state the downstream consequence for the lender or borrower.
5. Use an ordinal severity scale defined once at the top of the memo and apply it consistently across all issues.
6. Classify the procedural response for each item as reject, counter-propose, or accept, and make the recommendation match the severity and authorization analysis.
7. If a change affects multiple provisions or operates through a linked mechanic, analyze the full interaction rather than the isolated sentence.

## 5. Vertical / structural / temporal relationships
- Check whether a borrower edit in one section requires conforming edits elsewhere in the agreement, schedules, or defined terms.
- Check whether a covenant or basket change ripples into related sections on prepayments, exceptions, guarantees, collateral, voting, or amendment standards.
- Check whether a timing change alters notice windows, cure periods, springing-test dates, maturity-linked mechanics, or consent deadlines.
- Check whether a priority or transfer change affects downstream enforcement rights, affiliate transfers, or lender voting architecture.

## 6. Output structure conventions
- Write a change analysis memo organized by issue, using conventional credit-agreement headings rather than a template dump.
- Define the severity scale once near the top, then apply it uniformly to every issue entry.
- For each issue, include: provision at issue, original draft treatment, borrower markup treatment, commitment-materials position, severity, analysis, and procedural recommendation.
- Make the recommendation explicit and operational: reject, counter-propose, or accept, with a short reason tied to the analysis.
- Include a priority section that separates must-restore provisions from preferred improvements or acceptable edits.
- End with a Recommended Actions block that tells the relevant lawyer or deal team member what to do next and when relative to the signing or execution timeline.
- Keep the memo self-contained and readable in plain text export; do not rely on formatting alone to convey the existence of a change.
