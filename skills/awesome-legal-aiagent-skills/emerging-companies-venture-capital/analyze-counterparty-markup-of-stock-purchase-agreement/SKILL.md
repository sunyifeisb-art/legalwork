---
name: ecvc-analyze-counterparty-markup-spa
task_id: emerging-companies-venture-capital/analyze-counterparty-markup-of-stock-purchase-agreement
description: Purchase agreement markup analysis should detect economically important changes hidden in definitions, schedules, and exhibits; assess the impact of preference, conversion, redemption, and control mechanics across scenarios; and cross-check representation changes against diligence materials rather than only listing revised provisions.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Stock Purchase Agreement

## 2. Failure modes the skill is correcting

- Treating the markup as a line-edit exercise instead of a deal-risk review, so economically meaningful shifts in preference, conversion, redemption, voting, or closing conditions are missed
- Reading the operative body but not the definitions, schedules, exhibits, or disclosure materials that may quietly override or expand the bargain
- Failing to compare the markup against the term sheet, so deviations are not classified by whether they are economic, control-related, drafting-only, or a new substantive ask
- Checking representations in the abstract instead of testing them against diligence materials, disclosed exceptions, and known business facts
- Calling out a clause change without identifying the scale of exposure, the interacting provision, and the practical consequence for the company or investor
- Giving generic commentary without a concrete counterproposal, making the memo useful for diagnosis but not for negotiation

## 3. Legal frameworks / domain conventions that apply

- Compare the markup against the original SPA draft and the term sheet as the baseline deal architecture; the term sheet controls the expectation of agreed economics and governance, while the SPA captures the operative legal form
- Read body text, definitions, schedules, exhibits, and disclosure schedules together; a definition in one place can expand or narrow a right stated elsewhere
- Preference and conversion mechanics should be assessed across exit scenarios, not only on a binary win/loss basis, because the investor’s economics may change materially at different liquidity outcomes
- Redemption rights must be tested for practical enforceability in light of the company’s stage, capitalization, and any legal limitation to available funds or surplus under the issuer’s governing law
- Control provisions require separate attention to class votes, veto rights, protective provisions, drag-along mechanics, board composition, and transfer restrictions, since one clause may neutralize another
- Representation and warranty changes should be cross-checked against diligence materials, disclosure schedules, and known encumbrances to determine whether the statement is accurate, incomplete, or only partially cured by disclosure
- Any legal conclusion should be tied to the governing rule or doctrine that supports it, including the relevant contract interpretation principle, corporate law rule, or disclosure standard reflected in the source materials or recognized practice

## 4. Analytical scaffolds

- Start by enumerating the documents and the moving parts to be compared: original SPA draft, investor markup, term sheet, and supporting diligence or disclosure materials
- For each material deviation, identify:
  - the exact change in the markup
  - the term sheet position, if any
  - whether the change is economic, control-related, drafting cleanup, or a substantive new ask
  - the severity of the issue on a Critical / High / Medium / Low scale
  - the affected party
  - the downstream consequence
- For provisions that alter investor economics, test the change at representative outcomes rather than at a single point in time; explain where the revised language shifts value, leverage, or timing
- For redemption, conversion, anti-dilution, and similar mechanics, read related definitions and exhibits together and reconcile any apparent inconsistency before assigning risk
- For representation changes, cross-check the statement against diligence facts and disclosed exceptions; if the statement is inaccurate or overbroad, explain whether the problem is disclosure, scope, or remedy
- For each identified issue, close the analysis with three elements:
  - a scale or threshold drawn from the source documents
  - the clause, schedule, exhibit, or document that interacts with it
  - the concrete consequence for the client
- For every Critical or High issue, propose a specific counterresponse rather than a generic reservation
- If only one relevant scale, scenario, or counterpart position exists for a topic, say so affirmatively and explain why; otherwise analyze each item separately and do not collapse distinct issues into one
- Where the source materials supply a controlling authority, cite it by name and section or equivalent; do not state a legal proposition without identifying the governing basis

## 5. Vertical / structural / temporal relationships

- Read vertically from defined term to operative clause to exhibit or schedule to disclosure schedule, because the legal effect often depends on all four layers together
- Read horizontally across related provisions that operate in sequence, such as closing conditions, investor rights, post-closing governance, transfer restrictions, and exit mechanics
- Track temporal effects: signing, closing, post-closing obligations, milestone-based rights, redemption dates, and later financing or exit events
- Treat amendments that look minor in drafting but change timing, consent thresholds, survival periods, or trigger dates as substantive if they alter future leverage or enforcement posture
- When a provision references a threshold, cap, approval level, or milestone, compare it to the corresponding term sheet or supporting document figure rather than reading it in isolation

## 6. Output structure conventions

- Produce a prioritized redline analysis memo in a conventional advisory format, not a clause-by-clause transcription
- State the severity scale once at the top and apply it uniformly to every issue
- Use an issue table or equivalent structured format with columns that capture: issue, markup change, term sheet deviation, legal consequence, severity, and recommended response
- Include a separate section for material economic issues and another for control / governance / reps-and-warranties issues when that separation improves readability
- For any redline comment or change note, make the change unmistakable in plain text using a robust textual convention, not styling alone; pair the change with a short rationale
- Include a concise term-sheet deviation summary organized by severity so the most important departures are visible first
- End with an explicit Recommended Actions section that assigns each recommendation to a role and an urgency or timing anchor tied to the transaction
- Keep the memo decision-oriented: the reader should be able to use it to negotiate edits without reconstructing the issue from scratch
