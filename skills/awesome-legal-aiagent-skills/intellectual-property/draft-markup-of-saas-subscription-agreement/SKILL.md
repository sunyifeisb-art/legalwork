---
name: draft-markup-saas-subscription-healthcare
task_id: intellectual-property/draft-markup-of-saas-subscription-agreement
description: Section-by-section markup commentary memo with proposed redlines and priority classifications for a vendor-form SaaS agreement reviewed against a company playbook in a regulated healthcare procurement context.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of SaaS Subscription Agreement with Commentary

## 1. Subject-matter triage

- Treat the vendor-form SaaS agreement as a negotiated risk-allocation document, not a pure procurement form.
- Confirm whether the customer will process regulated health information or other sensitive data; if so, privacy, security, breach, subcontractor, audit, and data-return provisions are in scope from the outset.
- Identify any internal playbook overrides, business constraints, or deal-specific exceptions before drafting comments so the markup reflects the actual negotiation posture rather than generic SaaS norms.
- If multiple source documents exist, enumerate the governing sources and review the agreement against each before writing recommendations.

## 2. Failure modes the skill is correcting

- Producing generic SaaS comments that ignore the healthcare operating context, especially privacy, security, breach response, data integrity, retention, and access controls.
- Missing deal-specific instructions from internal communications and therefore assigning the wrong negotiating posture to provisions that are actually fixed, preferred, or off-limits.
- Issuing a markup commentary without explicit priority classifications, leaving the reader unable to distinguish non-negotiable items from tradeable asks.
- Treating liability cap, damages exclusion, indemnity, and security-breach remedies as isolated clauses rather than a linked risk-allocation package.
- Using only visual redlines that may not survive export; the change set must remain legible in plain text.
- Delivering issue descriptions that stop at identification without stating the legal basis, contract interaction, and operational consequence.
- Omitting concrete next-step guidance for counsel and business stakeholders.

## 3. Legal frameworks / domain conventions that apply

- Vendor-form SaaS agreements commonly favor the provider on limitation of liability, exclusion of indirect damages, unilateral updates, auto-renewal, usage-based expansion, and broad data-use rights.
- Healthcare-facing SaaS arrangements require heightened attention to privacy and security architecture, including a data processing or business associate style addendum when regulated information is involved.
- Security and breach obligations should be evaluated together with indemnity, liability cap, and damages carve-outs so the customer’s remedy set is coherent.
- Customer data ownership, export rights, deletion obligations, and restricted vendor use of de-identified or aggregated data are core operational issues.
- Service-level commitments, support response, uptime credits, and termination rights should be reviewed as a package with remedies and transition assistance.
- Where the agreement incorporates outside policies, order forms, schedules, or addenda, those documents should be read as part of the same allocation of risk and responsibility.

## 4. Analytical scaffolds

- Start by identifying every section that affects data handling, security, business continuity, pricing, renewal, liability, indemnity, termination, and audit rights.
- For each issue, write a short comment that includes:
  - the section or concept being revised,
  - the proposed redline in robust text form,
  - the reason for the change,
  - the priority classification.
- Use plain-text redline conventions that survive format conversion, such as [DELETED: …], [INSERTED: …], and [REPLACED: old → new], with a short rationale attached to each substantive change.
- Classify each comment using a single ordinal severity scale defined once at the top of the memo, and apply that scale consistently across all entries.
- When a provision depends on another clause, call out the interaction directly instead of commenting on the clause in isolation.
- When a legal position is stated, anchor it to the controlling legal or regulatory rule relied on, or to the specific contractual allocation principle being applied.
- If only one governing form or one operative version of the agreement is in scope, say so explicitly; otherwise, review each version separately and do not collapse differences into one generalized pass.

## 5. Vertical / structural / temporal relationships

- Read the agreement vertically: main agreement, order form, exhibits, security terms, privacy terms, acceptable use, support policy, and any data-processing supplement must be reconciled as a single package.
- Read it structurally: a narrow promise in one section may be undermined by an exception elsewhere, so cross-reference related clauses in each comment.
- Read it temporally: onboarding, live use, incident response, renewal, suspension, termination, wind-down, data return, and deletion obligations should be sequenced so obligations are workable in practice.
- If remedies depend on notice windows, cure periods, reporting deadlines, or export timing, identify the timing effect and whether the customer can practically comply.
- Where a clause creates a future right or obligation, state whether it survives expiration or termination and whether any transition period is needed.

## 6. Output structure conventions

- Produce a section-by-section markup commentary memo for the SaaS agreement, not a standalone abstract or generic playbook summary.
- Open with a brief severity key, then present comments in conventional contract-review order.
- For each entry, include:
  - the section or topic,
  - the issue summary,
  - the proposed redline language in robust plain-text form,
  - a short rationale,
  - the severity classification,
  - the commercial or legal consequence if left unchanged.
- Keep the comments tied to the actual contract language and deal context; do not invent issues that are not implicated by the source materials.
- When multiple comments apply to the same section, separate them clearly rather than combining unrelated revisions into one note.
- End with a concise Recommended Actions block that assigns the next step to counsel or the relevant business owner and ties it to the current drafting milestone.
- Use industry-conventional section names and memo organization; do not mirror an internal rubric or checklist verbatim.
- Ensure the final document is suitable for direct conversion into `saas-agreement-markup-commentary.docx` and that the operative redlines are visible from the text alone.
