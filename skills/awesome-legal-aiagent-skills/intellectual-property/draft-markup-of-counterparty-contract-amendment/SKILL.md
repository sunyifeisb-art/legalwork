---
name: draft-markup-counterparty-contract-amendment
task_id: intellectual-property/draft-markup-of-counterparty-contract-amendment
description: Annotated redline of a proposed contract amendment with marginal commentary and a cover memo, evaluated against the operative agreement history and internal contracting guidance.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Counterparty Contract Amendment

## 1. Subject-matter triage

- Confirm the operative baseline before editing: the current agreement, all prior amendments, incorporated exhibits or schedules, and any side letters or referenced policies that modify the live text.
- Read the supplier’s proposed amendment together with the business-context email and procurement playbook before drafting any markup.
- If the source set contains multiple amendments, versions, or related attachments, enumerate them first and map which document controls each disputed provision.
- Identify whether any business instruction overrides the default playbook position; if so, note the override and its source before redlining.

## 2. Failure modes the skill is correcting

- Marking up the amendment against the wrong baseline because earlier amendments or incorporated documents were not folded into the operative text.
- Applying generic playbook positions without reconciling the specific business context, which can produce edits that conflict with deal priorities.
- Drafting a redline that is only visually marked up and cannot be reconstructed from plain text after export.
- Omitting marginal comments, or using comments that state a change without explaining its legal or commercial basis.
- Failing to separate must-have positions from preferred asks and items needing further review.
- Delivering a cover memo that summarizes the deal but does not actually steer the negotiation.
- Stating conclusions about enforceability, ownership, liability, pricing, confidentiality, data use, termination, or similar terms without tying the position to a controlling authority or governing contract language.

## 3. Legal frameworks / domain conventions that apply

- Treat the amendment as an exercise in contract interpretation and contract drafting: the operative text is read as a whole, with amendments and incorporated documents construed together.
- Apply the procurement playbook as the company’s internal drafting authority for standard and fallback positions; use the business email for transaction-specific deviations.
- For each substantive edit, identify the governing source of the position: the agreement history, playbook, business instruction, or the amendment’s own drafting logic.
- Where a legal proposition is invoked, identify the controlling authority by name and section or comparable citation form used in the source materials or standard practice authority.
- Use amendment-appropriate conventions for defined terms, conforming edits, hierarchy clauses, survival language, precedence, and express preservation of unchanged terms.
- Treat legal and commercial provisions as distinct: legal risk positions may warrant different treatment from pricing or operational changes.
- For recurring contracting topics, check consistency across related clauses rather than editing one provision in isolation, especially where liability, IP, confidentiality, data handling, indemnity, termination, audit, or payment mechanics interact.

## 4. Analytical scaffolds

- Baseline reconstruction:
  - Rebuild the operative contract from the full agreement stack before evaluating any proposed change.
  - Identify the provisions the amendment purports to change and any adjacent provisions that must be conformed.
- Provision-by-provision comparison:
  - Compare each proposed edit against the operative baseline, the playbook, and the business context.
  - Mark only the changes that are necessary to secure the client’s position; preserve acceptable language where possible.
- Change typing:
  - Use explicit textual markup that survives format conversion: [DELETED: …], [INSERTED: …], and [REPLACED: old → new].
  - Attach a short [Rationale: …] comment to each substantive change so the reader can understand the legal or commercial reason for the edit.
- Priority classification:
  - Label each issue or comment with a uniform ordinal severity scale defined once at the outset, such as Critical / High / Medium / Low.
  - Use the same severity labels throughout the markup commentary and cover memo.
- Cross-document checking:
  - For each issue, note the related clause, schedule, exhibit, amendment, or policy that affects the same topic.
  - If a provision depends on a defined term or cross-reference, confirm the defined term still works after the amendment.
- Negotiation posture:
  - Distinguish mandatory positions, preferred positions, and items flagged for further review.
  - Draft comments so they can be used directly in negotiation, not merely as internal notes.
- Issue closure:
  - For each commented issue, explain the practical consequence if the counterparty’s language is accepted as written.
  - Where relevant, include the scope or magnitude of the concern using figures or thresholds from the source set, without inventing new arithmetic.

## 5. Vertical / structural / temporal relationships

- Preserve amendment hierarchy: the new amendment should state clearly what it changes, what survives, and whether prior inconsistent language is superseded.
- Check temporal sequencing: make sure effective dates, notice periods, payment timing, transition periods, and survival provisions do not conflict with earlier documents.
- If the amendment is part of a series, distinguish provisions that apply only prospectively from provisions intended to confirm past conduct or cure prior defaults.
- Where multiple source documents address the same subject, reconcile them in control order rather than averaging them.
- Ensure that conforming changes are made to defined terms, exhibits, and referenced policies so the amendment does not create internal inconsistency.

## 6. Output structure conventions

- Primary deliverable first: produce the markup document as the operative output, and ensure it is complete before drafting the cover memo.
- Redline markup:
  - Present the amendment in a form that is visibly annotated and textually recoverable in plain text.
  - Include margin-style comments or inline notes for each substantive edit, each with a brief rationale and an explicit severity label.
  - Keep comments tied to the exact provision being changed; do not consolidate unrelated issues into one note.
- Cover memo:
  - Follow the markup with a concise memo that identifies the main issues, the overall risk posture, and the recommended negotiation approach.
  - End with a Recommended Actions section that uses imperative verbs, names the responsible role from the source materials where available, and includes a timing anchor tied to the deal timeline or a stated deadline.
- Final sanity check:
  - Confirm the markup file is non-empty and contains the operative revised language, not just a summary of proposed edits.
  - Confirm the memo does not replace the redline and does not omit the priority issues needed for negotiation.
