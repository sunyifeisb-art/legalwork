---
name: draft-markup-counterparty-msa
task_id: intellectual-property/draft-markup-of-counterparty-master-services-agreement
description: Redlined master services agreement with bracketed commentary and a cover memo summarizing key issues and negotiation strategy, evaluated against the applicable contracting playbook and available vendor security documentation.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Counterparty Master Services Agreement

## 1. Subject-matter triage

- Treat the vendor MSA as a negotiated risk-allocation document, not a generic form; the markup must be anchored in the customer’s contracting playbook and any defined fallback positions.
- If security exhibits, certifications, policies, or audit materials are provided, read them before editing the security, privacy, incident-response, audit, and subcontracting provisions.
- If more than one agreement version, exhibit set, or policy source is in scope, enumerate the source set first and reconcile them against the markup plan before drafting changes.

## 2. Failure modes the skill is correcting

- Marking up the vendor agreement from general instincts alone instead of the applicable playbook positions and fallback hierarchy.
- Making changes without explaining why each change is needed, what playbook position it reflects, and what negotiation response it anticipates.
- Treating liability, indemnity, damages, and cap provisions as isolated edits instead of a connected risk-allocation package.
- Ignoring vendor security documentation when assessing security and breach terms, or over-accepting contractual promises that the vendor’s operational posture does not support.
- Omitting customer-owned data return, transition support, audit access, and post-termination survival mechanics.
- Preparing only the memo or only the redline, rather than producing both deliverables in full.

## 3. Legal frameworks / domain conventions that apply

- Master services agreements typically allocate operational, confidentiality, IP, privacy, security, warranty, indemnity, and termination risk through integrated provisions; edits should preserve internal consistency across those clauses.
- Liability provisions should be reviewed as a set: cap, exclusions, carve-outs, indemnities, and insurance language must align rather than conflict.
- Deliverables, work product, modifications, and customer materials should be tested for customer ownership, license scope, derivative rights, and reuse restrictions.
- Data-processing, confidentiality, security incident, and audit clauses should be conformed to the governing privacy and security regime reflected in the source documents and playbook.
- Termination, transition assistance, and data return clauses should be calibrated to preserve continuity of service, portability, and retrieval of customer data and records.
- Any legal proposition stated in the redline commentary or cover memo should be tied to a controlling authority or governing contract source identified in the materials, rather than stated as a bare conclusion.

## 4. Analytical scaffolds

- Playbook mapping: for each disputed clause, identify the playbook-required position, the preferred position, and any acceptable fallback before drafting the markup.
- Priority sorting: classify each change by commercial importance and negotiation sensitivity so the memo distinguishes must-have positions from negotiable refinements.
- Risk-package review: analyze cap, damages exclusion, indemnity, insurance, and remedy limitations together to avoid offsetting edits that create hidden gaps.
- Security cross-check: compare the agreement’s security obligations, incident notice, subcontractor controls, and audit rights against the vendor’s actual security materials.
- IP and data-rights review: test whether the customer receives sufficient ownership, license rights, export rights, and post-termination access to deliverables and customer data.
- Termination and transition review: confirm cause and convenience termination rights, wind-down obligations, and a workable transition path.
- Commentary discipline: each bracketed comment should state the contractual reason for the change, the playbook basis, and the expected counterparty objection or fallback.
- Memo framing: organize the cover memo around overall risk posture, open issues, tradeoffs, and negotiation sequence rather than clause-by-clause restatement.

## 5. Vertical / structural / temporal relationships

- Follow the agreement’s clause order unless a restructuring is necessary to make an integrated risk package readable; keep linked concepts synchronized across definitions, operative clauses, exhibits, and order forms.
- When a clause depends on another provision elsewhere in the agreement or in an exhibit, flag that relationship in the commentary so the reader sees the interaction.
- Sequence drafting so the operative redline exists first, then the memo reflects the final state of the markup; do not let the memo become a substitute for the redline.
- Where the agreement contains survival, transition, or post-termination obligations, make the timing relationship explicit in commentary and in the memo.

## 6. Output structure conventions

- Redlined agreement: produce a .docx redline that is readable from the text alone, using explicit markup conventions for every substantive change such as [DELETED: ...], [INSERTED: ...], or [REPLACED: old → new], even if visual track changes are also used.
- Commentary: attach a short bracketed rationale to each substantive change; include the playbook basis, the business/legal reason for the change, and any fallback position if the change is contested.
- Severity tagging: where commentary discusses issues or negotiation points, include a uniform ordinal severity label for each entry using a defined scale stated once in the document.
- Cover memo: provide an executive summary, a prioritized issue list, negotiation strategy, vendor-security context, and recommended next steps.
- Recommendations: end the memo with explicit recommended actions, naming the responsible role and the timing anchor for each action.
- File integrity: ensure the redline file is complete and non-empty before producing the memo, and ensure both named outputs are actually written.
- Final check: confirm the deliverables exist as `triton-msa-redline-with-commentary.docx` and `redline-cover-memo.docx`, and that each contains the operative markup or memo content rather than a placeholder description.
