---
name: draft-markup-of-counterparty-construction-contract
task_id: real-estate/draft-markup-of-counterparty-construction-contract
description: Guides owner-side markup of a contractor's guaranteed maximum price contract draft by calibrating each redline position against the owner's playbook, lender requirements, insurer requirements, and other deal-specific guidance, and producing both a full redline and a prioritized issues memo.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Counterparty Construction Contract — Redlined GMP Agreement

## 1. Subject-matter triage

- Confirm the draft is the contractor’s governing form for a GMP project and identify whether the source set includes an owner playbook, financing materials, insurance requirements, and client instructions.
- Enumerate the governing source documents once, then compare the contract against each source in a single pass; if a source is absent, say so and do not infer its terms.
- Treat the redline as the primary deliverable and the issues memo as secondary; the memo should summarize the operative markup, not replace it.
- If only one contractor draft is in scope, state that affirmatively before analyzing article-by-article changes.

## 2. Failure modes the skill is correcting

- Marking up against generic market positions instead of the owner’s stated playbook, which misses negotiated deal priorities and accepted concessions.
- Treating lender requirements as optional drafting preferences rather than conditions that can control funding.
- Missing insurer-driven coverage language that affects additional-insured status, waiver of subrogation, primary/noncontributory wording, notice obligations, or limits.
- Failing to sequence issues by severity, leaving the client without a practical negotiation order.
- Issuing a memo that lists problems but does not pair each issue with the exact contract location, benchmark, and proposed counter-language.
- Producing a visually redlined file that cannot be audited from plain text because the substantive change is not explicitly labeled.
- Ignoring compounding risk where multiple provisions jointly shift schedule, price, indemnity, or insurance risk.
- Forgetting to confirm the final files are actually created and contain operative drafting, not just commentary.

## 3. Legal frameworks / domain conventions that apply

- Construction agreements are typically read article-by-article, but owner-side markup should preserve the contractor’s structure where possible so negotiation changes remain traceable.
- GMP provisions should be tested together with scope definitions, allowances, contingency, change-order mechanics, and savings provisions because those clauses determine whether the price cap is real or illusory.
- Delay-risk provisions should be analyzed together: liquidated damages, excusable delay, concurrent delay, no-damages-for-delay language, and limitation-of-liability clauses can either reinforce or undercut one another.
- Payment protection, bonding, and completion security often appear in financing materials as funding conditions; if the draft diverges, restore the required language unless the client has approved a concession.
- Insurance provisions must be read against the insurance summary as an independent floor, including coverage type, limits, additional-insured scope, primary and noncontributory treatment, and waiver language.
- Indemnity should be checked alongside insurance because a narrowed indemnity paired with narrower coverage creates a compounded coverage gap.
- Subcontractor approval, key-person rights, assignment, dispute resolution, and termination rights often carry lender or owner-control implications even when they appear as boilerplate.
- Any legal proposition or risk conclusion should be tied to the governing contract clause, the related source document, or the recognized doctrine or rule the position relies on.

## 4. Analytical scaffolds

- For each article, identify the contractor’s baseline position, compare it to the playbook or other controlling source, and change every material deviation.
- Classify each issue on a uniform ordinal severity scale defined once at the top of the memo, such as: Critical, High, Medium, Low.
- For every issue in the memo, include:
  - the clause reference,
  - the contractor language or concept at issue,
  - the controlling benchmark,
  - the specific consequence to the client,
  - the recommended counter-position.
- Close each issue with three moves:
  - identify the relevant scale, threshold, term, or exposure level from the source materials,
  - cross-reference the related clause or document that interacts with it,
  - state the downstream economic, operational, transactional, or coverage consequence.
- Treat financing requirements as a non-negotiable floor unless the client instruction expressly approves a deviation.
- Treat insurance deviations as mandatory fixes when they reduce coverage below the stated requirements.
- Treat provisions that jointly erode schedule protection and economic remedies as a single compounded risk, not as isolated edits.
- Use a priority hierarchy that supports negotiation sequencing; do not blend must-fix items with items that are merely market points.
- When the client instruction email flags an item for escalation, preserve that flag in the memo and reflect it in the markup comment.
- In the redline, make every substantive edit auditable in plain text with explicit textual markup such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], followed by a short rationale note.
- Keep comments tied to the governing benchmark; do not leave a naked edit without a reason.

## 5. Vertical / structural / temporal relationships

- Read GMP, contingency, allowances, and savings provisions together because a change in one can alter the practical price ceiling.
- Read delay-damages, excusable-delay, no-damages-for-delay, and consequential-damages waiver provisions together because the remedy architecture must be internally consistent.
- Read indemnity, insurance, defense obligations, and additional-insured language together because the same hazard can be shifted, excluded, or duplicated across clauses.
- Read payment timing, retainage, conditions precedent to payment, and lien-waiver mechanics together because the timing of cash flow and leverage can change across project phases.
- Read subcontractor approval, assignment, termination, and step-in provisions together because control rights can transfer over time and across counterparties.
- Read schedule milestones, substantial completion, and final completion together because milestone language often affects both payment and delay exposure.

## 6. Output structure conventions

- Produce `contract-redline.docx` as the primary artifact and confirm it is non-empty and contains the operative redline text.
- Produce `markup-issues-memo.docx` after the redline exists, using the redline as the source of truth.
- Use industry-conventional memo organization rather than any rubric-specific section list.
- The memo should start with the severity scale, then group issues by severity and contract article, with each entry including the clause reference, benchmark, consequence, and recommended counter-position.
- End the memo with a short Recommended Actions block that assigns an imperative action, responsible role, and timing anchor drawn from the transaction posture or a stated deadline.
- The redline should preserve the contract’s numbering where possible and include bracketed rationale comments adjacent to each substantive change.
- Before finishing, verify by filename that both deliverables exist, are non-empty, and contain operative drafting rather than a summary of drafting.
