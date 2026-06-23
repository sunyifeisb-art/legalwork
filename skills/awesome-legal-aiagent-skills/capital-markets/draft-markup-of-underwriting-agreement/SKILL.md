---
name: draft-markup-of-underwriting-agreement-issuer
task_id: capital-markets/draft-markup-of-underwriting-agreement
description: Issuer-perspective underwriting agreement markup where the baseline redlines identify deviations from the playbook and document the basis for each change without converting the skill into an answer key.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Underwriting Agreement — Issuer's Perspective

## 2. Failure modes the skill is correcting

- The markup only flags obvious issuer-unfriendly language and misses protective provisions that should be added from the playbook, term sheet, board approvals, prior deal, or GC instructions.
- The markup changes language without tying each change to the governing source, leaving the reviewer unable to distinguish playbook-driven edits from judgment calls.
- The markup handles a clause in isolation and fails to check whether the edit must be coordinated with defined terms, indemnity mechanics, fee provisions, closing conditions, or the rest of the agreement.
- The markup relies on visual redlines alone, which can be lost or distorted in export; the substantive change must remain legible from the text itself.
- The markup produces edits without a concise change summary, making negotiation review slower and increasing the risk that material deviations are overlooked.
- The markup assumes one negotiation posture everywhere, rather than distinguishing provisions that are mandatory, preferred, or subject to fallback based on the source materials.

## 3. Legal frameworks / domain conventions that apply

- Underwriting agreements are reviewed clause-by-clause against the issuer’s negotiated position, with special attention to termination rights, indemnification, contribution, lock-up mechanics, offering mechanics, and closing deliverables.
- Issuer-side review should test whether underwriter discretion is appropriately cabined, whether issuer protections are preserved, and whether any underwriter-favoring wording should be narrowed or made reciprocal where market practice permits.
- Definitions that feed indemnity, disclosure, and allocation mechanics should be read across the agreement as a whole, not in isolation, because a single definition can shift risk throughout multiple clauses.
- If the source materials supply a specific company instruction, board-approved position, or prior-deal precedent, that instruction governs the markup basis for the corresponding edit.
- If the source materials and market practice point in different directions, the markup should reflect the client-specific instruction first and note the market or risk rationale second.
- Legal propositions embedded in annotations should be tied to the controlling source used for the edit, whether that source is the playbook, term sheet, board resolutions, prior deal materials, or GC email instructions.

## 4. Analytical scaffolds

- Read the playbook, term sheet, board resolutions, prior deal, and GC email before touching the draft; treat them as a hierarchy of drafting constraints and note when one source overrides another.
- Identify all sources of possible markup direction up front, then apply them provision by provision so that each edit has one clear basis and one clear negotiation purpose.
- For every substantive change, use a robust plain-text marker in addition to any tracked-change styling, so the edit survives export and can be reviewed outside Word.
- Use a bracketed rationale immediately adjacent to the edit, and make the rationale concise enough to show basis, not advocacy.
- When a clause is changed, check related definitions, cross-references, schedules, and signature/closing mechanics to ensure the edit does not create an internal mismatch.
- Add missing issuer-protective language where the source materials require it, even if the draft is silent; omission can be as important as express overreach.
- If a provision is uncertain, mark the preferred issuer position and note the fallback basis rather than leaving the issue unmarked.
- Keep the markup oriented to negotiation: the document should show what changed, why it changed, and which source supports the change.

## 5. Vertical / structural / temporal relationships

- Read the agreement vertically: definitions, operative covenants, indemnity, contribution, termination, conditions, and closing documents often depend on one another, so a change in one section may require a conforming edit elsewhere.
- Read the agreement temporally: pre-signing drafting positions, signing deliverables, closing conditions, post-closing obligations, and survival periods can each carry different issuer risk and may require different markup.
- Read the agreement by relationship among parties: issuer, underwriters, selling holders if any, and any guarantor or affiliate roles may shift obligations and should be reconciled consistently across the document.
- If the draft contains multiple parallel concepts for the same risk allocation, harmonize them so the issuer position is not diluted by inconsistent formulations in different sections.

## 6. Output structure conventions

- Primary deliverable is the marked-up underwriting agreement; create that file first and ensure it is complete and non-empty before treating any summary text as finished.
- Use a summary block at the beginning of the document that states the overall markup posture, the governing source hierarchy, and the main categories of changes.
- Each substantive edit must be visible in plain text with a robust convention such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], supplemented by a short [Rationale: …] comment.
- Every rationale should identify the source basis for the change, using the playbook, term sheet, board resolutions, prior deal, or GC email as applicable.
- Keep annotations local to the edit; do not rely on a separate legend that forces the reader to cross-search the document.
- When multiple source documents point to the same edit, cite the most controlling source first and the supporting source second.
- Preserve the agreement’s transactional form and drafting style; the goal is issuer-side markup, not a rewrite into an explanatory memorandum.
- Before finishing, confirm that the marked-up agreement file exists, is non-empty, and contains operative marked-up text rather than a description of the edits.
