---
name: its-draft-markup-cfius-nsa
task_id: international-trade-sanctions/draft-markup-of-cfius-mitigation-agreement
description: Produces a redline markup memorandum for a CFIUS national security agreement that narrows overbroad provisions, proposes sunset mechanisms for indefinite monitoring obligations, addresses foreign-investment nexus separation requirements, and harmonizes the agreement with overlapping industrial-security mitigation obligations.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of CFIUS National Security Agreement

## 1. Subject-matter triage

- Treat the deal documents, security posture materials, and any prior mitigation history as the governing frame for proportionality.
- Identify whether the draft agreement is addressing control rights, information access, board/governance constraints, monitoring, affiliate separation, or overlapping security obligations.
- If multiple entities, facilities, or mitigation layers are implicated, enumerate them first and analyze each separately before drafting any replacement language.
- Preserve the transaction’s closing path while narrowing only those provisions that exceed the stated national-security purpose.

## 2. Failure modes the skill is correcting

- Rewriting individual provisions without checking whether adjacent definitions, exceptions, or schedules make the change ineffective.
- Leaving an indefinite monitoring obligation intact without a practical end-point, step-down, or review mechanism tied to demonstrated compliance.
- Accepting overbroad control, veto, reporting, or inspection rights that are not limited to security-relevant conduct.
- Missing an affiliate or related-party nexus that requires separation covenants, information barriers, or clean-room constraints.
- Failing to reconcile the agreement with parallel industrial-security obligations, resulting in duplicated or inconsistent compliance burdens.
- Producing markup that only shows visual edits, so the change set is not recoverable in plain text or export.
- Drafting critique without a clear severity ranking, targeted recommendation, or authority for the proposed revision.

## 3. Legal frameworks / domain conventions that apply

- CFIUS mitigation agreements are proportionality instruments: the clause should be tied to the specific foreign-control or access risk identified in the deal record, not to ordinary business operations.
- Control-right definitions should be limited to national-security-relevant decisions, such as access to sensitive technology, classified information, critical systems, protected facilities, or other security-bearing assets.
- Transaction veto rights should be confined to transactions that would create the relevant access or transfer risk; blanket vetoes over ordinary commercial dealing are generally overinclusive.
- Waivers of challenge or review should be read narrowly; preserve procedural and constitutional claims unless the governing foreign-investment review statute expressly permits broader waiver.
- Monitoring obligations should include a review date, sunset, step-down, or termination pathway, with objective compliance criteria where possible.
- Where an acquiror has a direct or indirect relationship to a restricted-party affiliate, the agreement may require structural separation, restricted communications, personnel controls, and technology/data barriers.
- If industrial-security mitigation already governs the same asset, personnel, or information set, the NSA should state whether it supplements, incorporates, or supersedes overlapping obligations so the parties are not subject to duplicative regimes.
- Cite the controlling statutory or regulatory authority for each legal proposition relied on, including the governing federal foreign-investment review statute, implementing regulations, and any expressly referenced agency guidance.

## 4. Analytical scaffolds

1. Identify each provision to be marked up and state its function in the risk allocation architecture.
2. Test the clause against its security purpose: ask whether the current wording is broader than necessary to address the identified risk.
3. For each overbroad or ambiguous provision, draft replacement language that narrows scope, preserves operational feasibility, and maintains regulatory defensibility.
4. For each proposed deletion, addition, or substitution, use a plain-text redline convention that survives export, and attach a short rationale immediately adjacent to the change.
5. Where waiver language appears, separate procedural challenge waivers from non-waivable constitutional or statutory rights and draft the carve-outs explicitly.
6. Where monitoring is open-ended, add a sunset, review, or step-down trigger tied to compliance evidence, passage of time, or completion of specified milestones.
7. Where an affiliate nexus exists, propose separation covenants, restricted-access protocols, and exception handling for legally required disclosures.
8. Where parallel industrial-security requirements exist, add a harmonization clause stating how the regimes interact and which obligation controls in the event of overlap.
9. For every issue, state its severity on a fixed ordinal scale, the source-document anchor that makes it material, the clause or schedule it interacts with, and the practical consequence if left unchanged.

## 5. Vertical / structural / temporal relationships

- The transaction documents establish who acquires what, when closing occurs, and which assets, personnel, and data are within the risk perimeter.
- The security documents identify the facilities, programs, and information regimes that drive the need for mitigation and define the scope of any monitoring or separation.
- If the agreement cross-references schedules, appendices, security plans, or certification procedures, read them together; a fix in one section may require conforming edits elsewhere.
- Temporal sequencing matters: obligations that begin at signing, close, certification, post-close review, or an anniversary date should be reconciled so the agreement does not impose conflicting timing duties.
- If more than one monitored party or protected site exists, analyze each separately before drafting global language; do not assume a single clause fits all.

## 6. Output structure conventions

- Produce a markup memorandum that is usable by outside CFIUS counsel and that contains the operative proposed language, not merely issue descriptions.
- Use an explicit ordinal severity field for every item, with a single legend defined once at the top.
- For each item, include: issue summary, severity, cited authority, interacting clause or document, proposed replacement language in robust redline form, and a concise rationale.
- Use robust textual markup for every substantive edit, such as [DELETED: …], [INSERTED: …], and [REPLACED: old → new], so the change survives plain-text review.
- Include a short [Rationale: …] note for each change explaining why the proposed edit is narrower, clearer, or more workable.
- End with a Recommended Actions section that tells counsel what to revise, who should own the follow-up, and the timing anchor tied to signing, filing, or closing.
- Keep the memorandum internally consistent with the deal package; if a proposed edit touches another provision, identify the conforming change needed rather than leaving the cross-reference unresolved.
