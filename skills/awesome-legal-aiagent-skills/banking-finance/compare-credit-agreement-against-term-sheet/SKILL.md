---
name: compare-credit-agreement-against-term-sheet
task_id: banking-finance/compare-credit-agreement-against-term-sheet
description: Compares a draft credit agreement against the executed term sheet from the borrower’s perspective and produces a prioritized deviation report with economic impact analysis and recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Credit Agreement vs. Term Sheet Deviation Report

## 1. Subject-matter triage
- Treat the term sheet as the baseline economic and structural bargain, and the draft credit agreement as the operative document to test against it.
- Read the full package before comparing: term sheet, draft agreement, related schedules/exhibits, transmittal or markup notes, and any side letters or summary emails if included in the source set.
- If the source set contains more than one draft, compare each against the same term sheet and separate true revisions from unchanged carryovers.
- If only one draft exists, state that the analysis is single-draft and do not infer missing alternates.

## 2. Failure modes the skill is correcting
- Spotting a change in pricing, covenant mechanics, conditions, or remedies without translating it into borrower-side consequences.
- Missing borrower-protective concepts that were in the term sheet but were narrowed, deleted, or omitted in the draft.
- Treating drafting changes as harmless when they alter economics, headroom, control rights, or refinancing flexibility.
- Failing to separate material deviations from stylistic edits, conforming cleanups, and defined-term housekeeping.
- Overstating or understating the significance of a change without tying it back to the transaction’s size, leverage, tenor, or cash flow profile.
- Ignoring whether a cover note or transmittal characterizes substantive revisions as non-substantive.

## 3. Legal frameworks / domain conventions that apply
- Use the term sheet as the business baseline, but evaluate the draft credit agreement as the controlling operative document.
- Compare pricing terms, including reference-rate mechanics, margins, floors, upfront or ticking fees, and default-rate structures.
- Compare repayment and prepayment architecture, including mandatory prepayment triggers, sweep mechanics, and basket or threshold protections.
- Compare leverage and covenant mechanics, including debt definitions, cash netting, EBITDA adjustments, baskets, and cure or reset concepts.
- Compare collateral, guaranty, and release mechanics where the term sheet addressed them, because omission or narrowing can change risk allocation.
- Compare change-of-control, mandatory prepayment, and event-of-default triggers for expansion beyond the bargain reflected in the term sheet.
- Compare borrower-favorable carve-outs in broad risk definitions and restrictive covenants, especially where the draft adds qualifiers, exceptions, or cross-default hooks.
- Compare timing mechanics for reinvestment, cure, consent, notice, and amendment rights because shorter windows often carry practical borrower cost.
- If a legal proposition is stated, tie it to the governing document text in the source set or to the standard credit-agreement convention being applied; do not state a conclusion without identifying the clause logic that supports it.

## 4. Analytical scaffolds
1. Baseline the bargain
   - Identify the principal economic and structural terms reflected in the term sheet.
   - Separate firm terms from indications, summaries, and open items.
2. Compare provision by provision
   - Test each material term in the draft against the term sheet.
   - Capture additions, deletions, narrowing edits, and changes in defined terms or cross-references that alter operation.
3. Measure borrower impact
   - For each deviation, assess whether it changes price, cash flow, headroom, optionality, control, or enforcement leverage.
   - Where the source set contains usable figures, tie the issue to the transaction size, facility capacity, covenant level, tenor, or other relevant scale.
4. Trace interactions
   - Cross-reference the issue to any other clause, schedule, exhibit, or definition that changes the practical effect of the revision.
   - Flag cascading effects where one edit tightens several related provisions.
5. Classify severity
   - Distinguish economic, structural, and technical deviations.
   - Use an explicit ordinal severity scale and apply it consistently across all issues.
6. Prioritize negotiation points
   - Rank the issues that most affect borrower economics, liquidity, flexibility, or closing certainty.
   - Distinguish items that are execution blockers from items that are clean-up points.
7. Assess transmittal characterization
   - Compare any cover note or markup summary with the actual scope of revisions.
   - Flag any mismatch between the stated and actual significance of changes.
8. Convert findings into action
   - End each issue with a practical borrower-side recommendation that identifies who should act and when the issue should be addressed.

## 5. Vertical / structural / temporal relationships
- Track whether a change in one section alters another section’s operation, especially where definitions feed covenants, remedies, or conditions.
- Track whether a later-declared “administrative” edit actually changes the timing, sequencing, or priority of borrower obligations.
- Track whether the draft tightens rights at the facility level, the tranche level, or the collateral level in a way the term sheet did not contemplate.
- Track whether a new condition, notice period, or reinvestment window shortens the borrower’s practical response time.
- Track whether a revision compounds across the life of the facility, such as through recurring fees, reset mechanics, or repeated compliance measurements.

## 6. Output structure conventions
- Produce a borrower-side deviation report organized by issue, not a narrative summary.
- Open with a short executive overview that identifies the most consequential deviations and states the overall negotiation posture.
- Define the severity scale once at the top, then apply it uniformly to every issue entry.
- For each issue, include:
  - term sheet baseline
  - draft agreement text or clause reference
  - deviation identified
  - borrower impact
  - severity
  - recommendation
- For every issue, make the impact analysis explicit and complete: quantify or scale the issue against a relevant source-document figure or threshold when available, cross-reference the interacting clause or document, and state the downstream consequence for the borrower.
- Group the highest-severity deviations first.
- Separate economic deviations from structural deviations, and keep drafting cleanups in a lower-priority section.
- Include a distinct section for transmittal or cover-note characterization if one exists.
- End with a Recommended Actions section that gives imperative borrower-side steps, identifies the responsible role, and includes a timing anchor tied to signing, execution, or another transaction milestone.
- Keep the report concise but decision-useful; omit repetition and avoid describing issues that do not change the bargain.
