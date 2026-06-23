---
name: draft-tenant-notification-letter
task_id: real-estate/draft-tenant-notification-letter
description: Guides drafting of a tenant notification letter for an ownership and management transition by integrating closing documents, lease provisions, and renovation plans, while separately identifying legal risks and cross-document discrepancies in a companion advisory memo.
activates_for: [planner, solver, checker]
---

# Skill: Draft Tenant Notification Letter for Building Ownership Change, Renovation, and Lease Modifications

## 2. Failure modes the skill is correcting

- Drafts a generic ownership-change notice without verifying the new owner’s legal identity, transfer date, and payment instructions against the closing documents, creating avoidable payment-diversion and notice defects.
- Fails to reconcile the lease, amendments, rent roll, and transition materials, so the letter misstates what changed, who is responsible, or when the change becomes effective.
- Omits a separate risk memo and instead overloads the tenant letter with internal issues that should remain internal, including lease-issue screening and document discrepancies.
- Treats all tenants as interchangeable and misses tenant-specific premises, deposit, consent, renewal, or access issues that vary by lease.
- Repeats source-document inconsistencies instead of flagging them for counsel review with a proposed resolution.
- Describes renovation plans at a high level without matching the notice language to the actual scope, timing, and access impacts.
- Leaves unresolved discrepancies in deposit or payment records, increasing exposure when tenants later dispute balances or misdirect payments.

## 3. Legal frameworks / domain conventions that apply

- Ownership-transfer notice: the successor landlord should provide accurate notice of the change in ownership and any revised notice and payment details; the notice should track the governing lease notice provisions and applicable landlord-tenant law.
- Security-deposit transfer: the seller generally must transfer deposits and related records to the buyer at or by closing, and the buyer typically assumes responsibility for return at lease end; the tenant-facing letter should acknowledge the transfer only if supported by the source documents.
- Rent-redirection risk: payment instructions must be verified against the closing and banking records; any ambiguity in payee name, address, lockbox, or wire details should be treated as a fraud risk and not normalized in the letter.
- Lease amendment effect: amendments may change rent, term, renewal rights, maintenance, access, consent, or operating provisions; the letter should describe only what is actually changed and should not paraphrase beyond the document text.
- Quiet enjoyment and access: renovation or building work may implicate quiet enjoyment, access, utility continuity, and temporary relocation obligations; the letter should reflect the notice standard in the lease and not overpromise uninterrupted service.
- Co-tenancy and occupancy conditions: if a lease contains occupancy-based or named-tenant conditions, a transfer or renovation may affect compliance; this belongs in the advisory memo, not the tenant letter.
- Rights of first offer/refusal and similar preemptive rights: any space-availability or expansion rights should be screened across the leases and flagged internally where relevant.
- Estoppel and information-right management: the letter may preserve the owner’s ability to request estoppels or confirmations, but should not waive rights or imply facts not yet verified.
- Authority-driven drafting: each legal statement in the memo should be tied to the controlling lease provision, amendment, statute, regulation, or other identified source authority rather than stated as a bare conclusion.

## 4. Analytical scaffolds

- Identify the tenant population and determine whether one form letter can be used or whether tenant-specific variants are needed based on lease terms, premises, or deposit status.
- Confirm the successor owner’s exact legal name, the effective transfer date, and the party authorized to receive rent and notices; align the letter with the closing record and any banking confirmation.
- Review the lease package and all amendments to isolate the provisions that actually changed and the provisions that remain unchanged; avoid importing assumptions from deal summaries.
- Check the rent roll, deposit schedule, and any transfer confirmation for tenant name, premises description, monthly rent, additional charges, and deposit balances; reconcile any mismatch before drafting.
- Review renovation and construction materials for scope, phases, timing, access restrictions, and service interruptions; draft notice language that is specific enough to be useful but no broader than the source documents support.
- Separate tenant-facing content from internal risk analysis: the letter should communicate only operationally necessary facts, while the memo should capture discrepancies, legal risks, and items requiring follow-up.
- For every internal issue, identify the governing source document, the exact conflict or gap, the practical impact on the ownership transition, and the follow-up needed to cure or confirm.
- When a source set contains conflicting statements, treat the conflict itself as a finding; do not resolve it by guesswork or by choosing the more convenient version without support.
- Where a legal proposition is used in the memo, tie it to the applicable lease clause, statute, rule, or other controlling authority identified in the source set or standard practice authority.
- Before finalizing, verify that the tenant letter contains only operative notification content and that the memo contains the analytical findings, recommendations, and issue-specific urgency.

## 5. Vertical / structural / temporal relationships

- Match the notice effective date to the transfer date unless the source documents clearly require a different timing structure.
- If rent responsibility, notices, or deposit custody change at closing, make sure the letter’s dates and payment instructions do not create overlap or ambiguity.
- If renovation starts after transfer, align the notice to the sequencing in the source documents so the tenant is not misled about when disruptions may begin.
- If an amendment is effective on a different date from the transfer, distinguish the two dates clearly in both drafting and analysis.
- If multiple tenants are affected differently by the same building event, preserve those differences instead of collapsing them into a single generic statement.

## 6. Output structure conventions

- Produce the tenant notification letter as a clean tenant-facing document with a professional subject line, addressee, opening statement of the ownership change, effective date, payment instructions, deposit acknowledgment if supported, renovation notice if applicable, and a closing with contact information.
- Produce the attorney advisory memo as a separate internal document organized by issue category, with each issue labeled by severity, supported by the governing source document or authority, and followed by a concise recommendation.
- For the memo, include for each issue: what the discrepancy or risk is, where it appears in the source set, why it matters, and what should happen next.
- End the memo with a dedicated Recommended Actions section that assigns each step to a role and anchors timing to a milestone, deadline, or immediate follow-up need.
- Use the task-specified filenames exactly: `tenant-notification-letter.docx` and `attorney-advisory-memo.docx`.
- Draft the primary tenant letter first, then the advisory memo after the letter content is complete and internally consistent.
