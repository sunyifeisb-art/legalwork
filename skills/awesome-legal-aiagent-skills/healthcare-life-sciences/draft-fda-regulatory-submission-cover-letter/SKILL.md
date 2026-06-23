---
name: hls-draft-fda-pas-cover-letter
task_id: healthcare-life-sciences/draft-fda-regulatory-submission-cover-letter
description: Drafts an FDA Prior Approval Supplement cover letter and a companion discrepancy memo that resolves cross-document conflicts on supplement classification, facility identifiers, regulatory authority citations, and user fee category.
activates_for: [planner, solver, checker]
---

# Skill: Draft FDA Prior Approval Supplement Cover Letter

## 1. Subject-matter triage
- Confirm the filing is a Prior Approval Supplement for an approved drug application and identify the exact change set being submitted.
- Separate the cover letter’s ministerial filing details from the discrepancy memo’s issue-resolution function; both are required, but they serve different purposes.
- If source documents reference more than one site, supplement, fee item, citation, or study, treat each as a distinct item and verify each against the others before drafting.

## 2. Failure modes the skill is correcting
- The cover letter is drafted without close review of source documents for specific identifiers or administrative details, leaving errors that signal to FDA that the submission was not carefully prepared.
- Cross-document discrepancies are not identified and resolved; the companion discrepancy memo is omitted or fails to state how each conflict was resolved.
- A filing is presented as complete while omitting required administrative details, citing the wrong regulatory authority, or mismatching facility information across documents.
- Supporting materials are summarized generically instead of being tied back to the internal document identifiers and the submission package structure.
- Advisory content identifies problems but does not close them with a clear resolution and next-step direction.

## 3. Legal frameworks / domain conventions that apply
- Prior approval supplement framework: a supplement to an approved drug application is required before implementing certain changes; use the governing change-control regulation for the application type and identify the submission implications it creates.
- Supplement classification conventions: different changes can require different supplement classification codes; when multiple change types are implicated, identify every applicable code and verify none are omitted.
- Biowaiver authority: if a waiver of in vivo bioequivalence testing is requested, cite the correct regulatory basis for the relevant biopharmaceutics framework and match the cited subsection to the requested relief.
- User-fee conventions: filing fees depend on the category of submission and the current fiscal-year schedule or confirmed agency correspondence; verify the amount and fee category before finalizing the letter.
- Environmental-exclusion conventions: manufacturing-change supplements may qualify for a categorical exclusion from environmental assessment requirements; cite the applicable categorical-exclusion provision expressly if relied on.
- Facility-identifier conventions: identifiers are site-specific and must be stated accurately for each referenced manufacturing location; treat any mismatch as a factual conflict to reconcile.
- Review-division conventions: address the submission to the correct FDA review division and use the application and supplement identifiers consistently throughout the package.
- Submission-organization conventions: the cover letter should orient the reviewer to the structure of the filing and its major contents, using the package’s internal organization rather than narrative freeform.

## 4. Analytical scaffolds
1. Start by listing the governing filing facts that must be fixed in the cover letter: application identifier, supplement sequence, supplement classification code(s), change description, facility identifiers, fee category and amount, environmental position, pending supplement disclosure, review division, and any waiver request basis.
2. Compare every source document against the others for conflicts on those facts; where a conflict exists, identify the documents in tension and select one resolved position for the filing.
3. For each legal proposition stated in the cover letter or memo, name the controlling rule, regulation, or other authority by section or comparable citation format.
4. Organize the filing summary by module or package component, and identify supporting studies, reports, or attachments by their internal identifiers and titles where available.
5. If a waiver request is included, summarize the supporting pharmacokinetic or comparative data in a neutral, procedural way, without argumentative excess.
6. Use the discrepancy memo to document each conflict, the source documents involved, the adopted resolution, and the reason the resolution is preferred for filing consistency.
7. Treat any unresolved mismatch as a drafting defect requiring explicit mention in the memo, not silent harmonization.

## 5. Vertical / structural / temporal relationships
- Where one document supplies the governing legal basis and another supplies the operational facts, the legal basis controls the framing and the operational facts must conform to it.
- Where source documents conflict on the same filing fact, prefer the document that is most directly tied to the final submission package, but document the basis for that choice.
- Where a change affects both the manufacturing narrative and the regulatory classification, align the cover letter’s summary, the cited authority, and the memo’s resolution so they do not contradict each other.
- Where multiple pending or related filings are referenced, distinguish current submission facts from historical or contemporaneous filings to avoid sequence confusion.

## 6. Output structure conventions
- Produce both deliverables: a complete FDA cover letter and a separate discrepancy memo.
- The cover letter should read as a finished regulatory transmittal addressed to the correct review division, with a concise package overview and all required administrative details embedded in the body.
- The discrepancy memo should be issue-focused: list each conflict, identify the source documents in conflict, state the resolution adopted, and note the filing consequence of that resolution.
- Keep the memo practical and concise; it is a resolution record, not a policy essay.
- If recommendations are appropriate, end the memo with a short Recommended Actions block that assigns an action, a responsible role, and a timing anchor tied to submission readiness.
