---
name: compare-closing-documents-against-purchase-and-sale-agreement
task_id: real-estate/compare-closing-documents-against-purchase-and-sale-agreement
description: Guides document-by-document comparison of closing deliverables against the executed purchase and sale agreement to surface deviations, assess their significance, and identify potential corrective steps before or after closing.
activates_for: [planner, solver, checker]
---

# Skill: Compare Closing Documents against Purchase and Sale Agreement — Deviation Report

## 2. Failure modes the skill is correcting

- Baseline compares closing documents in isolation rather than anchoring each document to the specific PSA obligation it is meant to satisfy, leaving silent gaps in coverage.
- Baseline identifies mismatches descriptively without rating severity, which makes the output hard to use for closing decisions and escalation.
- Baseline stops at describing the deviation instead of connecting it to the governing provision, the interacting closing document, and the practical consequence for the client.
- Baseline misses inconsistencies inside schedules, settlement mechanics, title materials, and certificates where the operative deviation is numerical, definitional, or conditional rather than facial.
- Baseline overlooks compound issues created when multiple documents point in the same wrong direction, such as a conveyance mismatch reinforced by a title exception or a closing statement that implements the wrong economic assumption.
- Baseline omits next-step remediation, leaving the reader with issues but no action path.

## 3. Legal frameworks / domain conventions that apply

- The executed PSA is the controlling baseline for the closing package: it sets the required documents, the required form of those documents, and any closing conditions tied to delivery or content.
- Deed and conveyance documents must match the PSA’s transfer covenant, including parties, estate conveyed, legal description, reservations, and permitted exceptions.
- Assignment and assumption instruments must capture the full intended bundle of leases, contracts, permits, warranties, and related rights unless the PSA narrows that scope.
- Seller certificates and affidavits must not shrink, qualify, or re-cut the surviving representations, covenants, or disclosure mechanics set by the PSA.
- Settlement and closing statements must implement the PSA’s economic mechanics, including prorations, credits, deposits, holds, and fee allocations.
- Title materials must reflect the PSA’s title standard, approved exceptions, and any bring-down or gap-coverage requirements.
- Estoppels, consents, notices, payoff letters, withholding forms, and similar deliverables must be checked against any PSA threshold, form, timing, and condition precedent.
- When a legal proposition is stated, anchor it to the governing PSA language and any incorporated standard, statute, regulation, or customary conveyancing rule that controls the document type.

## 4. Analytical scaffolds

- Start by enumerating the closing documents and the PSA provisions each document is supposed to satisfy; if only one document type is in scope, state that expressly.
- Compare each closing document to the corresponding PSA provision on four axes: parties, scope, form, and timing.
- For each issue, state: the deviation, the PSA provision or other controlling authority, the relevant scale or threshold if the documents provide one, the interacting document or clause, and the downstream consequence.
- Treat missing documents, missing signatures, missing exhibits, and missing schedules as distinct issues, not as a general “incomplete package” observation.
- Review all numerical and formula-based statements in settlement materials against the PSA mechanics before drawing any conclusion; if the source documents supply a calculation basis, use it consistently and flag any mismatch.
- Compare title and conveyance documents together so a description mismatch, exception mismatch, or carve-out mismatch is evaluated as a combined risk rather than an isolated drafting point.
- Classify each issue by severity on a uniform ordinal scale and use the same scale throughout the report.
- If a deviation could be cured, specify the most practical cure path: amendment, corrected execution, supplemental delivery, escrow adjustment, waiver, post-closing covenant, or other targeted fix.

## 5. Vertical / structural / temporal relationships

- The PSA is the upstream control document; closing deliverables are downstream implementations and may not silently expand, narrow, or reprice the deal.
- A closing statement usually operationalizes PSA economics, so any difference in proration date, credit treatment, holdback, or fee allocation should be treated as a structural mismatch, not a clerical issue.
- A deed, title commitment, and survey should be read together where they define the conveyed estate; a mismatch in one often changes the meaning of the others.
- Where the PSA imposes a closing condition tied to delivery of a document set, missing or nonconforming delivery can be a condition failure rather than a mere drafting deviation.
- Temporal issues matter: pre-closing certifications, bring-down updates, and post-closing undertakings should be tested against the date they speak as of and the date performance is due.
- If a deliverable uses a threshold, coverage percentage, or schedule count, compare the document against that threshold before assessing any downstream waiver or cure path.

## 6. Output structure conventions

- Open with a short executive summary that states the overall risk picture, the highest-severity issues, and whether any deviation appears capable of affecting closing, pricing, title, or enforceability.
- Define the severity scale once at the top and apply it uniformly to every issue entry.
- Organize the body by closing document, then by issue within that document; if one issue depends on another document, cross-reference both.
- For every issue entry, include:
  - the closing document and section or exhibit reference,
  - the PSA provision or other controlling authority,
  - the deviation description,
  - the severity rating,
  - the relevant scale, threshold, or amount if one appears in the source materials,
  - the related document or clause that interacts with the deviation,
  - the practical consequence for the client,
  - the recommended corrective action.
- Keep the report decision-oriented; do not stop at identification when a specific remedy or escalation path is apparent.
- End with a concise action list that groups recommended fixes by responsible role and urgency tied to the transaction timeline.
- Use the requested filename exactly: `closing-document-deviation-report.docx`.
