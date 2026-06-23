---
name: prepare-responses-to-ddrl-scenario-01
task_id: corporate-ma/prepare-responses-to-ddrl/scenario-01
description: Guides preparation of a sell-side due diligence response matrix that maps each buyer request to available diligence materials, checks whether the materials actually address the request, and flags gaps or sensitive items for further review before disclosure.
activates_for: [planner, solver, checker]
---

# Skill: Sell-Side Due Diligence Response Matrix

## 1. Subject-matter triage

- Confirm the request list is the operative buyer DDRL, not a mixed set of follow-up asks, and preserve the buyer's numbering and category structure.
- Confirm the diligence repository index is current enough to support the matrix; if index, folders, or naming conventions are missing or inconsistent, flag that as a repository issue rather than silently filling it in.
- If only one request family is in scope, say so expressly; otherwise, enumerate the request set first and then work item-by-item.
- Treat the matrix as a working disclosure-control tool, not a substantive diligence memo: the goal is to map responsiveness, locate source materials, and surface exceptions for deal-team action.

## 2. Failure modes the skill is correcting

- A request is mapped to a folder or document title without checking whether the underlying material actually answers the requested topic.
- The matrix treats partial coverage, wrong entity coverage, stale periods, or tangential materials as fully responsive.
- Missing materials are left blank instead of being marked as gaps with a clear next step.
- Sensitive material is listed as if it were ordinary responsive content, without an internal-review or authorization flag.
- The matrix describes what the document is called but not where it lives in the VDR, making retrieval impossible.
- The matrix collapses separate ask types into one generic response and loses distinctions between: already responsive, responsive if produced, no responsive material located, and responsive only with redaction/approval.
- Recommendations are omitted, leaving the user with diagnosis but no action path.
- The output is organized as narrative prose instead of a request-by-request tracking table.

## 3. Legal frameworks / domain conventions that apply

- Sell-side due diligence response matrix practice: each buyer request is mapped to source materials, a drafting response, and any disclosure-control issue before materials are sent to the buyer.
- VDR convention: cite the exact repository location, folder path, document identifier, or load reference so the reviewer can retrieve the source quickly.
- Responsiveness analysis convention: a document is only responsive if it addresses the relevant topic, entity, period, and transaction context; mere subject-matter proximity is not enough.
- Gap handling convention: if no responsive material is located, the entry should say so, identify whether the gap is factual, repository, or production-related, and state the action needed.
- Sensitive-information handling convention: trade secrets, personal data, litigation strategy, regulatory correspondence, privilege-adjacent content, and other disclosure-sensitive materials should be flagged for review before release.
- Confidentiality and disclosure-control convention: if the source set suggests a disclosure limit or approval condition, the matrix should reflect that limit instead of assuming free circulation.
- Deal-team workflow convention: unresolved items should be routed to the appropriate business owner, counsel, or transaction lead with a short, practical instruction.

## 4. Analytical scaffolds

- Start with the request list, preserve its numbering, and create one row per request.
- For each request, identify all potentially responsive materials in the VDR and record each location precisely.
- Test responsiveness in this order: topic match, entity match, period match, and then completeness of coverage.
- Distinguish between full response, partial response, no response located, and response requiring redaction or approval.
- For each entry, write a concise response description that explains how the located material does or does not answer the request.
- If multiple materials address the same request, keep them grouped under the same request row or sub-row structure rather than splitting the request into disconnected fragments.
- If a request has no located material, state that explicitly and provide a recommended follow-up path.
- If a request implicates sensitive material, add a clear handling flag and identify the reason for review.
- Prefer short operative language over generic labels; the matrix should tell the reviewer what to do next, not merely describe the document.

## 5. Vertical / structural / temporal relationships

- Track vertical coverage: parent entity versus subsidiary, business unit versus site, and consolidated versus stand-alone reporting.
- Track structural coverage: request topic versus the actual document topic, including whether the repository item is only a supporting exhibit, summary deck, draft, or final version.
- Track temporal coverage: the date range requested versus the date range actually covered by the located material.
- Where a request spans multiple periods or entities, note the coverage limits directly so the reader can see what remains outstanding.
- Where the VDR contains iterative versions, prefer the version that best matches the request and note superseded drafts only if they create confusion or sensitivity.
- Where disclosure is contingent on a later event, board approval, or counterparty consent, reflect that dependency in the action field.

## 6. Output structure conventions

- Produce a single diligence response matrix as `ddrl-response-matrix.docx`.
- Use a table-based format with one row per request and columns that support at least: request number, request description, VDR location(s), response description, coverage assessment, gap flag, sensitivity flag, and action required.
- Use a simple ordinal severity field for any gap or sensitivity issue, applied consistently across the matrix, so the reviewer can see what needs attention first.
- Keep request numbering intact; do not renumber buyer asks.
- Make gap and sensitivity flags explicit and machine-readable where possible, using short standardized labels.
- Separate clearly between: fully responsive, partially responsive, not located, and located but not ready for disclosure.
- End the document with a short Recommended Actions section that assigns each follow-up to a role and ties it to the transaction timeline or a specific next step.
- Before finalizing, confirm the file exists, is non-empty, and contains the operative matrix rather than a description of how to build it.
