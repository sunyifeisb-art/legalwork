---
name: extract-loan-agreement-terms-scenario-02
task_id: bankruptcy-restructuring/extract-loan-agreement-terms/scenario-02
description: Ensures a loan term extraction memo analyzes borrowing base availability separately from commitment, addresses any make-whole premium or prepayment economics using the applicable formula, tracks cross-default and judgment default concepts across facilities, and evaluates how environmental claims may affect insurance- and misrepresentation-related default provisions.
activates_for: [planner, solver, checker]
---

# Skill: Extract Loan Agreement Terms — Restructuring Strategy Purposes (Scenario 02)

## 1. Subject-matter triage

- Treat the task as a source-document extraction and restructuring memo, not a drafting exercise: pull terms from the credit documents and intercreditor agreement, then synthesize only the terms that matter for strategy.
- Identify each facility, tranche, lien group, and document set before analysis; if only one is in scope, say so affirmatively.
- Separate liquidity concepts that are often conflated: commitment, borrowing base availability, reserves, and actual borrowing capacity.
- Read the intercreditor agreement alongside the loan documents whenever default, payment blockage, cash collateral, or consent dynamics are implicated.

## 2. Failure modes the skill is correcting

- Availability is overstated because the analysis treats nominal commitment as usable liquidity instead of applying the borrowing-base formula and reserve mechanics.
- Premium economics are missed because the memo notes a make-whole or prepayment charge exists but does not trace the operative formula, timing, and practical cost impact.
- Cross-default analysis is incomplete because it fails to compare the same event across all facilities and related documents.
- Judgment-default risk is underread because the memo does not test whether a pending judgment reaches the relevant threshold and cascades through related triggers.
- Environmental liability is analyzed in isolation instead of being tied to insurance-default, misrepresentation, or adverse-event language.
- Intercreditor constraints are missed because the memo does not extract consent rights, cash-collateral controls, or administrative-agent mechanics relevant to restructuring planning.
- The memo becomes descriptive only and omits strategic consequences, deadlines, and action points.

## 3. Legal frameworks / domain conventions that apply

- Borrowing base analysis: identify eligible assets, advance rates, reserves, concentration limits, and any administrative-agent discretion affecting availability; distinguish formula availability from stated commitment.
- Prepayment premium / make-whole economics: identify the trigger, the applicable period, and the contractual pricing mechanism; if the document uses a present-value style construct or redemption formula, apply that structure rather than paraphrasing it.
- Cross-default and related-default provisions: identify the triggering debt, the threshold concept, any grace period, and whether a default under one facility ripens into another.
- Judgment default framework: test the size, finality, and enforcement posture of any judgment against the document’s default trigger language.
- MAC / MAE clauses: treat subjective adverse-condition language as disputed and note any lender discretion, notice, or carveout structure.
- Environmental and insurance-related defaults: evaluate whether an uninsured environmental claim, adverse remediation exposure, or loss of coverage maps to a misrepresentation, covenant, or default trigger.
- Intercreditor controls: extract cash-collateral, standstill, turnover, release, and consent provisions that can constrain lender action or debtor strategy in a workout.
- Successor-agent mechanics: if agency has shifted, identify the successor role and any effects on notice, direction, or consent administration.

## 4. Analytical scaffolds

- For each facility, use the same pass order: economics, collateral/availability, default triggers, remedies, and intercreditor overlay.
- For each issue, do not stop at description; state the scale of the issue using a figure, threshold, date, term, or exposure measure from the documents; compare it to the interacting clause or related document; then state the consequence for liquidity, leverage, enforcement, or restructuring leverage.
- When multiple facilities or trigger dates are present, enumerate them first and then analyze each one separately rather than collapsing them into a single summary.
- If the documents provide enough detail, include a borrowing-base table showing collateral class, eligibility, advance rate, reserve or haircut, and resulting availability.
- If the documents provide enough detail, include a premium or prepayment economics table showing the trigger, pricing mechanic, measurement date, and practical cost implication.
- Compare any judgment, environmental claim, or other adverse event against every relevant default and cross-default provision in the source set.
- Note any sweep, cash-flow waterfall, or mandatory prepayment tier and explain how it affects restructuring flexibility.
- End the analysis with concrete strategic observations and near-term deadlines, not just a list of extracted terms.

## 5. Vertical / structural / temporal relationships

- Track how a default or adverse event moves vertically across documents: credit agreement to guaranty to intercreditor agreement to any related amendment or agency notice.
- Track how an event moves laterally across facilities: one tranche, another tranche, and any shared collateral or shared-agent arrangement.
- Track timing windows carefully: notice periods, grace periods, cure periods, maturity dates, springing events, consent windows, and any post-judgment or post-default timing.
- When a provision depends on a later document, amendment, or determination by an administrative agent, state that dependency explicitly.
- If a successor administrative agent exists, map who receives notices, who can direct remedies, and whether lender communications must be rerouted.

## 6. Output structure conventions

- Use a conventional memo structure with an executive summary, facility-by-facility extraction, cross-facility implications, timing/deadline observations, and strategic takeaways.
- Within each facility section, present the core economics, collateral or availability, default mechanics, and remedy constraints in that order.
- Use tables when they improve clarity, especially for borrowing base, premium economics, and default-trigger comparison.
- Where a legal proposition is stated, identify the governing contractual provision or other controlling authority by section, clause, schedule, or comparable citation from the source documents.
- Close with a Recommended Actions section that uses imperative verbs, names the responsible role or party from the documents, and ties each action to a deadline, milestone, or immediate urgency.
- Make the memo usable for restructuring counsel: concise, document-grounded, and oriented to negotiation leverage, enforcement risk, and liquidity planning.
