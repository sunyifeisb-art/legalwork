---
name: draft-stock-purchase-agreement-insurance-company
task_id: insurance/draft-insurance-acquisition-agreement
description: Agents drafting a stock purchase agreement for a property and casualty insurer acquisition should use insurance-specific provisions addressing reserve indemnity escrow timing, defined-benefit pension obligations, reinsurance commutation fallbacks, and intercompany services transition terms.
activates_for: [planner, solver, checker]
---

# Skill: Draft Stock Purchase Agreement for Acquisition of Property and Casualty Insurer

## 1. Subject-matter triage

- Confirm the primary deliverable is the executed-style stock purchase agreement, not notes or a summary.
- Treat all drafting notes as subordinate support for resolving cross-document gaps and inconsistencies.
- If the source set contains multiple deal variants, identify which terms are fixed, which are open, and which require bracketed alternatives.
- Verify financial and regulatory figures against the source deal documents before carrying any number into the draft.

## 2. Failure modes the skill is correcting

- The reserve indemnity structure is drafted without testing whether the escrow release schedule outlasts the relevant reserve-development horizon for long-tail claims.
- ERISA language is left at generic template level instead of being tailored to a defined benefit pension plan’s funding, premiums, prohibited transactions, and minimum funding compliance.
- Open regulatory examination findings are not tied to a clear status statement or closing covenant, leaving corrective actions ambiguous.
- Reinsurance commutation language assumes completion at closing and omits a fallback if the commutation is delayed or fails.
- Surplus note treatment is left inconsistent with the acquisition structure, including circular ownership or obligor/holder confusion.
- Intercompany services are not preserved with enough specificity to keep critical functions operating through transition.
- Statutory surplus movement between reference date and closing is ignored, creating an unaddressed value leakage or windfall risk.
- Pending tax reviews are not allocated to the correct pre-closing period or control holder.
- Cross-document drafting notes are not converted into operative text or clean issue flags for partner review.

## 3. Legal frameworks / domain conventions that apply

- Reserve indemnity: tie seller indemnity and escrow release mechanics to the expected time for reserve deficiencies to emerge and claims to be noticed.
- ERISA / pension plan representations: cover funding status, premium obligations, reportable events, prohibited transactions, and minimum funding compliance for any defined benefit plan.
- Insurance regulatory diligence: address open examinations, remediation status, and any ongoing supervisory action affecting the target insurer.
- Reinsurance transaction mechanics: if a stop-loss or similar treaty is being commuted, state the closing-condition treatment and a fallback if commutation is incomplete.
- Surplus notes: specify whether the note is redeemed, remains outstanding, or is transferred; avoid circularity if the buyer would become both obligor and holder.
- Transitional services: preserve continuity of critical back-office, claims, finance, and compliance functions with clear duration, notice, and termination mechanics.
- Statutory surplus true-up: include a post-closing adjustment mechanism where surplus may shift between the reference balance sheet and closing.
- Tax reviews and audits: allocate pre-closing liability and reserve the buyer’s control over resolution of open periods, subject to any required seller consent.
- Governing-law drafting: state the controlling law, but ensure any insurance-regulatory covenants remain subject to applicable regulatory authority and approval requirements.

## 4. Analytical scaffolds

1. Read the deal documents as an integrated package; identify the operative transaction terms, the insurer-specific risks, and any internal inconsistencies.
2. Draft the core SPA provisions first: purchase mechanics, closing conditions, representations and warranties, covenants, indemnification, and termination.
3. For each insurance-specific risk, translate the source note into a contractual mechanism rather than a recital or background statement.
4. Where the source materials mention multiple timing points, pick one defined trigger for each clause family and keep it consistent across the agreement.
5. When the source documents leave a gap, resolve it in the draft with the least disruptive commercially sensible rule and note the open point separately.
6. If a provision depends on a document-defined figure, cross-check the figure against the source financial statements, schedules, or regulatory filings before using it.
7. Draft representations narrowly enough to match the diligence record, but broad enough to capture the regulatory and operational risks unique to an insurer.
8. Build indemnity, escrow, and true-up mechanics so they work together; avoid duplicative recovery or an unintended timing mismatch.
9. For any open item that cannot be fully resolved from the record, use bracketed drafting and a drafting note explaining the proposed resolution.
10. Surface every cross-document inconsistency as a drafting note with a concrete recommendation for cleanup or partner decision.

## 5. Vertical / structural / temporal relationships

- Align the reference date, signing date, closing date, and any post-closing adjustment period so the economics match the legal mechanics.
- Match escrow release timing to the reserve-development and claims-reporting window referenced in the deal materials.
- Tie transitional services duration to the period required to stand up standalone operations, not to an arbitrary fixed term unless the documents require it.
- Make sure any regulatory covenant survives long enough to cover post-closing remediation obligations that were identified before signing.
- Sequence conditions precedent before closing deliverables, and closing deliverables before post-closing covenants, true-ups, and indemnity claims.
- If the acquisition structure creates circular ownership or payment flow issues, resolve them expressly in the operative clauses rather than in a note.

## 6. Output structure conventions

- Produce a complete stock purchase agreement in conventional transactional form with insurer-specific clauses integrated into the body.
- Use defined terms consistently and keep insurance-specific concepts defined where they recur.
- Include closing conditions, representations and warranties, covenants, indemnification, escrow, adjustment, and miscellaneous sections.
- Insert bracketed alternatives only where the source record does not support a single final position.
- Add a drafting notes section that flags unresolved cross-document gaps, identifies the proposed resolution, and notes any dependency on verification of source figures.
- If multiple source documents conflict, flag the inconsistency in plain language and indicate which term should govern absent further instruction.
- Keep the final output oriented to a signable draft, not an analysis memorandum.
