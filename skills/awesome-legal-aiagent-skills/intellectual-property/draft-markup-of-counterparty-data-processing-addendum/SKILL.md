---
name: draft-markup-counterparty-dpa
task_id: intellectual-property/draft-markup-of-counterparty-data-processing-addendum
description: Redlined DPA with bracketed commentary organized against the applicable negotiation playbook, with a risk-prioritized commentary memo covering negotiation strategy.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Counterparty Data Processing Addendum

## 1. Subject-matter triage
- Treat the DPA as the primary deliverable and the commentary memo as secondary.
- If there is more than one source document set, map the operative positions first: the DPA text, the negotiation playbook, deal context, and any security or sub-processor materials.
- Identify whether the DPA is being used as a controller-processor addendum, a standalone privacy exhibit, or a negotiated supplement; do not assume a generic form fits the deal.
- Confirm whether cross-border transfer language is implicated by the actual data flows or hosting structure before adding transfer mechanics.

## 2. Failure modes the skill is correcting
- Marking up against generic privacy principles instead of the deal-specific negotiation playbook positions.
- Failing to integrate the sub-processor schedule and security materials into the markup, leaving internal inconsistencies between the DPA and supporting exhibits.
- Treating certifications, audit reports, or external attestations as substitutes for substantive contractual security obligations.
- Omitting bracketed commentary and leaving the deal team without an explanation of why a clause was changed.
- Drafting a redline that cannot be recovered from plain text because the changes are only visual.
- Producing commentary that lists concerns without a severity ranking, recommended strategy, and next step.
- Making legal assertions about processor duties, transfers, or audit rights without tying them to the controlling contractual framework or cited authority.

## 3. Legal frameworks / domain conventions that apply
- The playbook is the operative negotiating standard; the markup should meet or exceed the playbook floor on each clause the playbook addresses.
- The DPA must preserve baseline processor obligations for notice, confidentiality, security, subprocessors, assistance, deletion/return, and compliance support, with deal-specific refinements layered on top.
- Sub-processor terms should address approval or objection rights, flow-down obligations, and a meaningful mechanism for updating the list.
- Security terms should be substantive and operational, not merely referential to a certificate or high-level policy statement.
- Audit and assessment rights should be workable in practice, including scope, cadence, access, and substitute reporting where appropriate.
- Assistance obligations should cover data subject requests, incident response, DPIAs or equivalent assessments, and regulatory inquiries where the deal calls for them.
- Transfer language should use the applicable legal mechanism for the jurisdictional pathway actually implicated by the transaction.
- Where legal propositions are stated in the memo, cite the controlling authority by name and section or comparable identifier.

## 4. Analytical scaffolds
- Playbook mapping: identify each DPA topic in the playbook, then align the counterparty language to the required position before editing for style.
- Clause-by-clause markup: for each substantive provision, decide whether to keep, tighten, delete, or replace; then express the change in a plain-text-safe redline convention.
- Sub-processor review: test whether the list is identifiable, current, and consistent with the approval and notice mechanics in the body of the DPA.
- Security review: compare the body of the DPA against the security exhibit and confirm the contract contains enforceable commitments, not only references.
- Transfer review: determine whether any processing, support, hosting, or sub-processing path triggers cross-border language; if yes, add the applicable mechanism rather than generic compliance language.
- Commentary memo: convert each issue into a risk item with a severity label, a short reason, the business consequence, and the recommended negotiation posture.
- Authority support: when the memo states a rule-based conclusion, cite the governing statute, regulation, rule, or recognized authority that supports it.

## 5. Vertical / structural / temporal relationships
- Read the DPA as a hierarchy: definitions control operative clauses, operative clauses control exhibits, and later or bespoke schedules control only where the document expressly makes them controlling.
- Track vertical consistency between the DPA, sub-processor list, and security materials so that an obligation stated in one place is not silently negated in another.
- Watch temporal mechanics for notice, approval, objection, response, remediation, deletion, retention, and update cycles; the markup should preserve workable timelines rather than abstract commitments.
- If multiple jurisdictions, data categories, or processing roles appear in the source set, assess each one separately before consolidating the final position.
- Where a provision depends on a future event, make the trigger and consequence explicit so the clause remains administrable after signing.

## 6. Output structure conventions
- Redlined DPA: use a plain-text-safe markup convention for every substantive change, such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], and attach a short [Rationale: …] note to each change.
- Commentary memo: define a simple ordinal severity scale once at the top, then give each issue a severity label, concise rationale, business impact, and negotiation stance.
- Commentary entries should be issue-based, not clause-reprint summaries; focus on what changed, why it matters, and what the team should do next.
- End the memo with a Recommended Actions block that gives an imperative action, the responsible role, and a timing anchor tied to the deal process.
- Preserve the DPA as the primary file and ensure the markup is complete before relying on the memo.
- Confirm the final deliverables are named exactly as requested: `axiom-dpa-v3.1-redline.docx` and `dpa-markup-commentary.docx`.
