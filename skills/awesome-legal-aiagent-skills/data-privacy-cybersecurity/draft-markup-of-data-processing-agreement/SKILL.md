---
name: draft-markup-of-data-processing-agreement
task_id: data-privacy-cybersecurity/draft-markup-of-data-processing-agreement
description: DPA markups with commentary memos fail when the analysis does not distinguish mandatory legal requirements from policy-driven positions and commercial preferences, and when the commentary does not connect security-history concerns to the relevant privacy and security provisions.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Data Processing Agreement with Redline and Commentary Memorandum for Pharma Controller

## 1. Subject-matter triage

- Start by reading the playbook, the processor form DPA, the security-history materials, the commercial term sheet, and any client instructions together; do not draft from the form alone.
- Determine whether the processing involves regulated, sensitive, clinical, or otherwise high-risk data, and whether cross-border transfers, subprocessors, audit rights, or incident-response obligations are in scope.
- Separate mandatory legal requirements from negotiated policy positions and pure commercial preferences before editing any clause.
- Identify whether there is a single processor form or multiple variants; if more than one form, compare each variant separately and do not merge their terms into one assumed baseline.

## 2. Failure modes the skill is correcting

- Treating every departure from the playbook as equal instead of classifying each point as mandatory, policy-driven, or commercial.
- Ignoring prior security-history materials when assessing security controls, breach notification, audit rights, and related escalation provisions.
- Redlining liability, indemnity, governing law, or dispute terms in a way that conflicts with the broader commercial deal.
- Producing a memo that summarizes issues without risk ratings, practical negotiation posture, or client-facing actionability.
- Omitting the redline file or relying on commentary alone instead of delivering the markup first.
- Using styling alone for edits so that changes are unclear once the document is exported or reviewed outside the editing interface.

## 3. Legal frameworks / domain conventions that apply

- Applicable data protection law controls the minimum DPA content; missing mandatory processor terms is a non-negotiable gap.
- Controller/processor allocation should be checked against the required lawful-basis, purpose-limitation, instruction, confidentiality, security, subprocessors, assistance, deletion/return, and audit/inspection framework.
- For sensitive or regulated processing, heightened safeguards may be appropriate for access control, encryption, segregation, logging, retention, and personnel restrictions.
- Where the processing profile or incident history indicates elevated risk, breach notification timing, cooperation duties, and forensic access rights should be tightened.
- International transfer provisions must match the actual data flow and the applicable transfer mechanism, including any required supplemental terms.
- Liability, indemnification, and governing-law provisions must remain consistent with the commercial envelope reflected in the term sheet and related deal documents.

## 4. Analytical scaffolds

- Build a clause-by-clause matrix: playbook position | DPA position | gap | classification | preferred edit.
- For each clause, decide whether the change is mandatory, policy-based, or commercial, and use that classification to set the negotiation posture.
- Use security-history materials to identify which DPA provisions are directly implicated by the prior incident pattern; elevate the security-related risk where the history supports it.
- Cross-check all economic and risk-allocation language against the commercial term sheet before drafting a replacement clause.
- When a clause is acceptable in principle but needs narrowing, draft a fallback that preserves the business objective while reducing legal exposure.
- When a clause is unacceptable, replace it with a controller-favorable formulation that is consistent with the playbook and the source materials.
- For each substantive edit, attach a short rationale comment that states the reason for the change and the expected fallback position.
- If multiple issues appear in one clause, treat each issue separately so the memo can assign distinct risk ratings and negotiation paths.

## 5. Vertical / structural / temporal relationships

- The commercial envelope governs liability and related risk allocation; the DPA should not create a materially broader exposure than the deal permits.
- Security-history materials can change the practical severity of otherwise standard processor language, especially around incident response, audit, and subprocessor governance.
- If the source documents impose sequencing or timing, preserve it: notice before disclosure, approval before use, deletion after termination, and assistance through the transition window.
- If multiple data flows or processing purposes exist, analyze them in their actual order of operation rather than as a single abstract process.
- Where a clause depends on another provision elsewhere in the DPA, keep the internal references aligned so the operative obligations are not left dangling.

## 6. Output structure conventions

- Deliver the redlined DPA first and ensure it is complete, non-empty, and contains the operative markup, not a narrative summary.
- Use a robust textual redline convention in addition to any visual markup so edits remain legible after conversion: mark deletions, insertions, and substitutions explicitly, and attach a short rationale comment to each substantive change.
- In the markup commentary memo, define a single severity scale at the outset and apply it consistently to every issue.
- For each issue in the memo, state the severity, identify the clause or topic, explain the legal or policy basis, note any interaction with other provisions or source documents, and give the downstream consequence for the client.
- The memo must be client-facing, written for in-house counsel, and organized by clause or theme rather than as a free-form narrative.
- End the memo with a concise Recommended Actions block that uses imperative verbs, identifies the responsible internal role, and gives a practical timing anchor tied to the deal or regulatory timeline.
- Before finishing, confirm that both required filenames exist and are populated: `redlined-dpa.docx` and `markup-commentary-memo.docx`.
