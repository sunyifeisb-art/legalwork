---
name: extract-post-closing-obligations
task_id: corporate-ma/extract-post-closing-obligations
description: Guides systematic extraction of post-closing obligations from a stock purchase agreement and related transaction documents into a compliance tracker, with cross-document consistency review.
activates_for: [planner, solver, checker]
---

# Skill: Post-Closing Obligation Extraction and Compliance Tracker

## 1. Subject-matter triage (only if applicable)

- Treat the stock purchase agreement as the anchor document, but review the full transaction package for any post-closing duty stated anywhere in the documents.
- Build the tracker from operative obligations, not from generic recital language, background statements, or rights that do not require follow-on action.
- If the package contains multiple obligation-bearing documents, enumerate them first and extract each document once before comparing overlaps.
- If only one document controls a topic, state that explicitly and do not fabricate a cross-document comparison.

## 2. Failure modes the skill is correcting

- The extraction stays inside the principal agreement and misses obligations imposed in ancillary documents that still require post-closing performance.
- The review identifies obligations but fails to connect them to a source document, owner, deadline, and practical consequence, leaving the tracker unusable for follow-up.
- Cross-document discrepancies in timing, responsible party, scope, or payment mechanics are left unresolved instead of being flagged for attention.
- Escrow, indemnification, working-capital, and transition obligations are treated as boilerplate rather than active post-closing items requiring monitoring.
- The output summarizes obligations abstractly instead of producing a usable compliance tracker and a separate memo explaining methodology and conflicts.

## 3. Legal frameworks / domain conventions that apply

- Post-closing obligations in acquisition documentation commonly include purchase price adjustments, escrow administration, indemnity claim procedures, closing deliverables, regulatory filings, notices, transition services, access rights, and surviving covenants.
- Escrow and indemnification provisions often create continuing procedural duties under the escrow agreement and the purchase agreement; capture the claims process, notice mechanics, release conditions, and dispute steps.
- Working-capital and other post-closing adjustments are time-sensitive and usually depend on delivery of statements, objection windows, and dispute-resolution mechanics; treat each step as a distinct obligation.
- Ancillary agreements may restate, narrow, or expand the principal agreement’s post-closing duties; consistency across documents matters as much as the standalone clause text.
- When a duty depends on a defined term, deadline, notice method, or survival period, record the controlling definition or timing trigger rather than paraphrasing loosely.
- Where the source documents identify a governing statute, regulation, rule, or contractual mechanism, cite that authority in the tracker or memo when explaining why an item is treated as an active obligation.

## 4. Analytical scaffolds

- Enumerate the relevant documents and the obligation categories before analysis so each source is reviewed intentionally and none is skipped.
- For each obligation, extract:
  - source document and section reference,
  - exact operative requirement in neutral paraphrase,
  - responsible party,
  - deadline or trigger,
  - dependency or notice requirement,
  - consequence or risk if missed,
  - status for the tracker.
- If an obligation appears in more than one document, compare the provisions side by side and flag any difference in timing, amount, process, scope, or party responsibility.
- Treat any apparent inconsistency as a review item, even if one provision may later be read as supplemental or controlling.
- For each issue identified, tie it to the relevant source language, the interacting provision or document, and the practical effect on closing administration or post-closing risk.
- Separate pure extraction from judgment: first capture all obligations, then evaluate conflicts, then draft the memo and recommended follow-up.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Organize the tracker by obligation type and then by due date or trigger so the earliest follow-up items are visible first.
- Preserve vertical links between a master obligation and its implementing steps; a single covenant may generate multiple entries with different dates or actors.
- When a document creates a sequence of actions, record the sequence in order rather than collapsing it into one row.
- If the same obligation matures in stages across closing, post-closing notice, objection, cure, and release periods, track each stage separately.

## 6. Output structure conventions

- Primary deliverable comes first: the completed `post-closing-obligations-tracker.docx` must contain the operative tracker, not a placeholder or descriptive outline.
- Follow the tracker with a concise summary memo only after the tracker content is fully populated.
- Use an industry-standard tracker format with columns for:
  - category,
  - source document,
  - section or provision,
  - obligation description,
  - responsible party,
  - deadline or trigger,
  - related document or cross-reference,
  - consequence / monitoring note,
  - status or resolution flag.
- Use a clear severity or priority field for items that need follow-up, and apply it consistently across all flagged inconsistencies.
- In the summary memo, explain the review method, list the cross-document conflicts or ambiguities, and identify any items that need clarification or resolution.
- End with a short Recommended Actions section that assigns each follow-up step to a role and a timing anchor tied to the transaction timeline or the stated deadline.
- Before finishing, confirm that the primary file is non-empty and contains the tracker itself, with the memo as secondary support rather than a substitute.
