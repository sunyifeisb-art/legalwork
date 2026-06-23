---
name: draft-markup-of-counterparty-loan-agreement
task_id: real-estate/draft-markup-of-counterparty-loan-agreement
description: Guides borrower-side markup of a lender's draft loan agreement by anchoring each redline position to the governing deal documents and client instructions, and producing both a redlined agreement and a cover letter summarizing key changes.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Counterparty Loan Agreement — Borrower-Side Redline

## 2. Failure modes the skill is correcting

- Baseline redlines the lender's draft against generic borrower-favorable positions rather than against the governing deal terms, producing markup that departs from the agreed economics without justification.
- Baseline does not use the markup playbook as a structured guide, missing playbook-specified walk-away terms and negotiating positions that the client has pre-authorized.
- Baseline omits the cover letter as a separate deliverable, leaving the client without a structured summary of the changes made and the rationale for each.
- Baseline treats each redlined provision independently, missing the interaction between related provisions; review related provisions together when they can compound borrower exposure.
- Baseline fails to preserve a plain-text-readable record of every redline, relying only on styling that may not survive document conversion.
- Baseline under-specifies issue significance, making it harder to distinguish deal-critical edits from routine drafting clean-up.
- Baseline gives analysis without next-step guidance, leaving the borrower-side client without a clear negotiation path.

## 3. Legal frameworks / domain conventions that apply

- Governing deal documents as baseline: use the applicable transaction documents as the benchmark for the definitive agreement, and flag any adverse deviation from those documents as a markup issue.
- Loan economic terms: interest rate, maturity, amortization schedule, prepayment provisions, and extension option conditions should be checked against the governing deal economics.
- Non-recourse and carve-outs: the loan is non-recourse except for specified carve-outs; narrow carve-outs to the extent consistent with the governing deal documents and negotiated positions.
- Cash management and cash sweep: cash-management trigger events that allow the lender to sweep rents into a controlled account are commercially sensitive; review trigger thresholds, cure periods, and remedial mechanics together.
- Transfer and assignment restrictions: qualified-transferee standards and related transfer restrictions affect the ability to sell or recapitalize the property; assess whether the standards are commercially workable for the transaction.
- Covenant basket: operating covenants affect day-to-day operations; check whether approval thresholds, expense controls, and material-contract restrictions are appropriately calibrated.
- Environmental indemnity: scope, survival, and carve-outs for existing conditions are standard negotiation points.
- Benchmark fallback: confirm fallback mechanics for any floating-rate benchmark are internally consistent and aligned with market practice.
- Appraisal and leverage compliance: ongoing leverage maintenance covenants, cure mechanisms, and appraisal-triggering standards can affect capital obligations; verify consistency across the documents.
- Interpretive hierarchy: where the governing deal documents, appraisal input, and client instructions point in different directions, follow the controlling deal terms first, then the negotiated playbook, then market-standard borrower protections.
- Legal support for any cited proposition should be stated by reference to the controlling document, stated market convention, or the identified governing authority in the source set.

## 4. Analytical scaffolds

- Start by confirming the deliverables and sequence: produce the redlined loan agreement first, then the cover letter after the markup exists and is complete.
- Extract all economic and operational terms from the governing deal documents; compare each against the lender's draft loan agreement; mark up every deviation, citing the source provision.
- Review the markup playbook article by article; for each playbook position, identify whether the lender's draft satisfies the position; mark up any provision that does not, inserting a comment citing the playbook.
- Review client instructions for any deal-specific guidance, pre-agreed concessions, or items flagged for escalation; reflect those instructions in the markup.
- Review any appraisal summary or similar valuation input for the property's appraised value; confirm that any leverage covenant in the draft is consistent with the valuation inputs and the governing deal documents.
- Identify compounding provisions: where two or more borrower-unfavorable changes interact to create a materially larger exposure, identify the interaction explicitly and propose a combined fix.
- For each substantive change, capture the issue in a way that survives plain-text export: use an explicit textual marker for deleted, added, or replaced language, and attach a short rationale.
- Assign each marked-up issue a priority tier: Walk-Away, Must-Fix, Negotiate, or Accept; use the same tier consistently across the markup and cover letter.
- For each issue, include the scale or deal metric implicated, the related clause or source document, and the borrower-side consequence of leaving the language unchanged.
- If more than one provision, party, period, or trigger is in scope, enumerate the set before analyzing it so no relevant item is collapsed into a representative example.
- For the cover letter, organize the summary by topic; provide a brief rationale for each substantive change and a concrete next step for the borrower-side team.

## 5. Vertical / structural / temporal relationships

- Governing deal document hierarchy: where the governing deal documents and the playbook conflict, the governing deal documents control; the playbook may supplement but not override them.
- Cash management and covenant interaction: a covenant breach that triggers cash management should also be reviewed for consistency with any cure period or related remedial rights before additional remedies are exercised.
- Extension option and loan maturity: extension option conditions must be evaluated for operational achievability given the property's projected stabilized performance; if conditions are not achievable, the effective maturity is shorter than the stated term.
- Related provisions should be read as a system: financial covenants, default remedies, transfer restrictions, and reporting obligations often amplify one another, so check the downstream effect before finalizing any single redline.
- Temporal sequencing matters: where a cure, notice, springing default, benchmark transition, or appraisal re-test occurs in a defined order, confirm the draft preserves that order and does not accelerate lender remedies prematurely.

## 6. Output structure conventions

- Redlined loan agreement: full mark-up with track changes and explicit textual markers that make every substantive edit legible in plain text; add bracketed comments on each substantive change citing the governing deal documents, playbook position, or client instruction.
- Each marked issue should carry a severity label and a short rationale; the label should be consistent with the significance of the deviation and the borrower-side negotiating posture.
- The markup should be written as a borrower-side redline, not a negotiation memo; preserve operative drafting wherever possible and revise only the provisions that need to move.
- Markup cover letter: organized by topic; for each substantive change, provide a brief description of the change, the basis for it (governing deal document deviation, playbook position, client instruction, or market convention), the practical impact if the lender does not accept it, and the recommended next negotiation step.
- Conclude the cover letter with a concise action list that tells the borrower-side team what to review, what to escalate, and what to send back to the lender.
- Both deliverable filenames must match the task instructions exactly, and the redlined loan agreement must be complete before the cover letter is finalized.
