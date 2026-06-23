---
name: draft-intercreditor-agreement-first-second-lien
task_id: structured-finance-securitization/draft-intercreditor-agreement
description: Draft an intercreditor agreement governing the relationship between first-lien and second-lien lenders, addressing standstill mechanics, automatic lien release scope, adequate protection waivers, refinancing treatment, amendment consent rights, and consistency of defined terms across related financing documents.
activates_for: [planner, solver, checker]
---

# Skill: Draft First Lien / Second Lien Intercreditor Agreement

## 1. Subject-matter triage (only if applicable)

- Treat the source set as a transaction-document drafting problem, not a pure issue-spotting exercise.
- Identify which provisions are being imported from the credit excerpts, which are being modified by partner instructions, and which must be added to make the intercreditor package internally coherent.
- If only one first-lien / second-lien stack is in scope, state that expressly; if multiple facilities, collateral pools, or tranche variants appear, separate them before drafting.
- Draft the agreement itself first; prepare the closing issues memo only after the operative document is complete and non-empty.

## 2. Failure modes the skill is correcting

- Drafting standstill and remedies provisions without tying the trigger, duration, renewal limits, and termination mechanics together.
- Letting the lien-release concept drift from the enforcement or disposition mechanics that actually justify it.
- Using adequate-protection language that unintentionally collapses lien subordination into payment subordination, or vice versa.
- Failing to coordinate revolver, term loan, and protective-advance priority language in the enforcement waterfall.
- Leaving refinancing treatment ambiguous so a replacement senior facility is not clearly captured.
- Missing category-by-category amendment consent rules for the senior documents.
- Allowing defined terms, financial metrics, or covenant concepts to vary across the source documents without stating which definition governs each operative purpose.
- Omitting after-acquired collateral, subsidiary pledge, or special-asset treatment where the collateral package depends on later-acquired property.
- Producing a memo of issues without connecting each issue to the operative clause that must be revised.

## 3. Legal frameworks / domain conventions that apply

- Standstill provisions should identify the prohibited actions, the notice or demand mechanics that start the clock, the waiting period, any reset or repeat-demand limits, and the events that end the standstill.
- Lien subordination and payment subordination should be drafted separately; each should state its own scope, exceptions, and enforcement consequences.
- Automatic lien release should track the intended release event, whether sale, casualty, foreclosure, or other disposition mechanics, and should not create unintended priority consequences for remaining collateral.
- Adequate protection waivers in insolvency should distinguish replacement liens, cash payments, and other forms of protection; the waiver should align with the agreed priority structure and any preserved exceptions.
- Revolving credit and term loan treatment should address parity, waterfall placement, and any express superpriority for protective advances, fees, or expenses.
- Purchase-option mechanics should specify trigger, exercise window, purchase price methodology, closing timeline, deliverables, and remedies if the purchase does not close.
- Refinancing language should define when a replacement first-lien facility counts as senior debt for intercreditor purposes and what conditions must be satisfied for continuity.
- Amendment consent rights should be stated by amendment category, with clear exceptions for administrative, collateral-release, or conforming changes.
- After-acquired collateral and special-asset provisions should be handled expressly so later-acquired assets, subsidiary equity, and restricted collateral classes follow the intended priority rules.
- The drafting must remain consistent with controlling authorities supplied in the source set; where a source-documented rule, statute, regulation, or case is referenced, cite it by name and section as reflected in the materials.

## 4. Analytical scaffolds

1. Map the parties, facilities, collateral, and operative dates before drafting any substantive clause.
2. For each core topic, identify the controlling source-document language, then draft first-lien-favorable language that is consistent with the partner instructions.
3. Draft standstill, lien subordination, payment subordination, lien release, purchase option, DIP, refinancing, and amendment restrictions as separate operative blocks.
4. Reconcile each operative block against the others so the remedy timing, release mechanics, and insolvency rights do not undercut one another.
5. For every defined term or metric that matters to an operative clause, specify which document’s definition controls for that clause.
6. For every clause that may be affected by multiple facilities, dates, or collateral categories, resolve each category explicitly rather than using a generic catch-all.
7. Flag every place where the source documents conflict or leave room for client instruction with bracketed notes in the draft.
8. Treat bracketed notes as decision points: priority, threshold, carve-out, timing, and form of remedy should all be identified where unresolved.
9. Build the closing issues memo from the same set of unresolved points, grouped by clause family and importance.
10. Keep the draft self-contained enough that a senior drafter can see the intended intercreditor economics, remedy sequencing, and enforcement hierarchy from the text alone.

## 5. Vertical / structural / temporal relationships

- Read standstill timing together with lien-release mechanics so the elapsed-period rules and release events do not conflict.
- Read adequate-protection waivers together with payment subordination so any preserved insolvency right does not defeat the agreed priority stack.
- Read refinancing treatment together with amendment consent rights so a replacement facility cannot bypass the consent architecture.
- Read after-acquired collateral and subsidiary-pledge rules together with the collateral definition so later property is not accidentally excluded or over-included.
- Read enforcement waterfall provisions together with protective-advance language so expense reimbursement, fees, and priority payments are sequenced consistently.

## 6. Output structure conventions

- Draft the intercreditor agreement as the primary deliverable and ensure the file contains operative clauses, not commentary alone.
- Use a conventional contract organization with definitions, lien and payment subordination, standstill, enforcement limits, lien release, purchase option, DIP financing, refinancing, amendment restrictions, and insolvency treatment.
- Keep bracketed notes inline at each unresolved conflict or client-choice point; each note should identify the issue, the competing reading, and the point needing instruction.
- Preserve first-lien-favorable drafting where the source materials permit it, but do not silently resolve a source conflict without flagging it.
- Use concise, contract-style prose; avoid explanatory essays inside the agreement.
- Prepare a closing issues memo only after the agreement is drafted, using an advisory tone that states the open point, the source tension, and the drafting consequence.
- In the closing issues memo, include a short recommended-actions section that assigns the next step to the relevant deal participant and ties it to the signing or closing timeline.
- Before finishing, confirm that the agreement file exists, is non-empty, and contains operative language sufficient for execution review.
