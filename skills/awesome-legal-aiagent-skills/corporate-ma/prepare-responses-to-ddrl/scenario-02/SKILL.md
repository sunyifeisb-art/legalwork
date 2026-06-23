---
name: prepare-responses-to-ddrl-scenario-02
task_id: corporate-ma/prepare-responses-to-ddrl/scenario-02
description: Guides preparation of a sell-side diligence response matrix that maps buyer requests to the seller's available diligence materials, identifies coverage gaps, and flags sensitive information for deal-team review before disclosure.
activates_for: [planner, solver, checker]
---

# Skill: Sell-Side Due Diligence Response Matrix

## 1. Subject-matter triage
- Treat the buyer request list and the VDR index as separate source sets that must be reconciled item by item.
- Confirm the request universe up front and preserve the request numbering in the response matrix.
- If the request list, VDR index, and deal-team notes are all present, use all three; if one is missing, note the limitation and proceed only with what exists.
- This is a comparison-and-gap task, not a substantive legal memo; the output should show coverage, exceptions, and escalation points.

## 2. Failure modes the skill is correcting
- Requests are matched to VDR materials without confirming that the material actually covers the requested entity, period, topic, or transaction scope.
- Items that are missing, incomplete, or only partially responsive are treated as satisfied instead of being flagged as gaps.
- Sensitive, privileged, confidential, or deal-sensitive materials are surfaced in the matrix without a clear hold/review flag.
- The matrix collapses distinct outcomes into one bucket instead of separating: fully responsive, partially responsive, non-responsive, needs follow-up, and needs legal/deal-team approval.
- The response set is not tied back to the VDR indexing system, making it hard for reviewers to locate the source materials.
- The deliverable omits next-step ownership, so open items are not assigned to the right business, legal, or deal-team participant.

## 3. Legal frameworks / domain conventions that apply
- Sell-side diligence response matrices are working tools for disclosure management; they must track what is responsive, what is not, and what cannot be released yet.
- VDR referencing should use the room’s own file names, folder paths, document IDs, or equivalent index references so a reviewer can find the source quickly.
- Responsiveness is a coverage question: a document may exist but still fail the request if it misses the relevant period, subsidiary, contract set, or subject matter.
- Sensitive-item handling should reflect privilege, confidentiality, strategic sensitivity, third-party restrictions, or disclosure controls that require approval before release.
- Because this is a disclosure-management deliverable, the matrix should support internal triage and not imply authorization to produce any item marked sensitive.
- When the source set suggests a legal or regulatory overlay, name the governing concept or authority only if it is actually implicated by the materials; do not generalize beyond the record.

## 4. Analytical scaffolds
- First enumerate the full request set in request order and preserve each request’s identifier.
- Then enumerate the VDR contents by the indexing scheme used in the room.
- For each request, locate all potentially responsive materials, then test each candidate for coverage of:
  - time period,
  - entity or business line,
  - contract/document type,
  - subject matter specificity,
  - completeness.
- Classify each request into one of the working outcomes:
  - responsive,
  - partially responsive,
  - no responsive material located,
  - responsive material exists but is not yet uploaded,
  - needs clarification,
  - sensitive/hold for review.
- If more than one material addresses a request, keep all references that matter and explain how they fit together rather than naming only one representative file.
- Review deal-team notes separately for items that should be held back, redacted, or escalated before disclosure.
- Where a request cannot be answered from existing materials, state the concrete follow-up: locate, upload, obtain, draft, redraft, or escalate.
- Use a consistent severity scale for action items:
  - Critical,
  - High,
  - Medium,
  - Low.
- Apply the severity label to every gap or sensitivity issue and keep the label tied to the recommended action.

## 5. Vertical / structural / temporal relationships
- Track whether the request is aimed at the parent company, a subsidiary, a business unit, a plant, a product line, or a historical period, and ensure the VDR reference matches that level.
- Distinguish current-state materials from historical materials; a current policy or contract often does not satisfy a request aimed at a prior period, and vice versa.
- If the same topic appears across multiple folders or versions, show the relationship between the documents rather than flattening them into one entry.
- When a request touches multiple subject areas, keep the response keyed to the primary request while cross-referencing the supporting materials that sit in adjacent folders.
- For sensitive materials, distinguish “present in VDR but blocked,” “not yet uploaded,” and “available only after approval,” because those statuses drive different deal-team actions.

## 6. Output structure conventions
- Produce one consolidated diligence response matrix as the sole deliverable.
- Organize rows by buyer request number and preserve the original request order.
- Use conventional columns such as:
  - request number,
  - request description,
  - responsive VDR reference(s),
  - response status,
  - response summary,
  - gap / follow-up,
  - sensitivity flag,
  - severity,
  - owner / action.
- Make the status field explicit; do not force the reader to infer whether a request is satisfied.
- Distinguish partial responses from complete responses with plain-language labels.
- For every open item, include a short action note that identifies what must happen next and who should handle it.
- For every sensitive item, mark the need for deal-team approval, legal review, or redaction before any external disclosure.
- Keep references precise enough that another reviewer can locate the underlying document without additional context.
- End the matrix only after every request has a row and every gap or sensitivity issue has a corresponding action entry.
