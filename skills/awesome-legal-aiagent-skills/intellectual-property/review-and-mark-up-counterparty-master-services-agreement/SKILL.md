---
name: review-markup-counterparty-msa
task_id: intellectual-property/review-and-mark-up-counterparty-master-services-agreement
description: Reviewing and marking up a counterparty master services agreement and related data-processing exhibit against a contract playbook and deal context, producing a redline and a tiered issues summary memo.
activates_for: [planner, solver, checker]
---

# Skill: Review and Mark Up Counterparty Master Services Agreement

## 1. Subject-matter triage

- Treat the MSA as the primary document and the BAA, DPA, or similar privacy exhibit as a coordinated but independently reviewable attachment.
- Identify whether the source set includes any internal deal email or playbook excerpts that change negotiation posture, fallback positions, or client-specific must-haves.
- If multiple versions, exhibits, or signature forms are present, reconcile them before redrafting so the redline does not introduce cross-document conflict.

## 2. Failure modes the skill is correcting

- Issuing a redline without a companion issues summary memo that tiers issues and explains the basis for each position.
- Reviewing the core agreement while ignoring the data-processing or privacy exhibit, or missing conflicts between the two.
- Applying generic vendor-favorable or customer-favorable edits without anchoring them to the playbook and deal context.
- Failing to make each markup legible in plain text after export, leaving the operative change dependent on formatting.
- Stating concerns descriptively without tying them to the affected section, the cross-document interaction, and the practical consequence for the client.
- Omitting a clear recommendation, fallback, or decision point where client approval is needed.
- Drafting a summary that is not prioritized by severity and therefore does not separate blockers from negotiable points.

## 3. Legal frameworks / domain conventions that apply

- Review the services scope, fees, term, renewal, ordering mechanics, acceptance, change control, and termination provisions as a commercial risk allocation package rather than as isolated clauses.
- In the privacy exhibit, confirm data-use limits, security safeguards, subprocessors or flow-downs, incident notice, return or deletion, assistance with rights requests, and compliance with applicable privacy and security law.
- Resolve conflicts between the main agreement and any privacy exhibit through an express hierarchy clause; for data-handling matters, the more protective customer-data position should control unless the playbook says otherwise.
- Liability cap analysis should account for cap structure, exclusions, super-cap concepts, and whether data incidents, indemnity, confidentiality, or IP claims are carved out or aggregated.
- Indemnity review should cover third-party claims, IP infringement, data/security events, bodily injury or property damage if relevant, and whether defense control and settlement consent are properly allocated.
- IP provisions should be tested for ownership of deliverables, pre-existing materials, feedback, and any license-back needed for operational use.
- Audit and compliance rights should be matched to the sensitivity of the data and any regulatory environment implicated by the services.
- Termination, suspension, and transition assistance should be reviewed together so exit rights are not hollow.
- Use controlling authority where applicable to support any legal proposition, including generally recognized authorities such as the California Consumer Privacy Act, Cal. Civ. Code § 1798.100 et seq., the EU GDPR, Regulation (EU) 2016/679, and common-law contract interpretation principles reflected in the relevant governing law.

## 4. Analytical scaffolds

1. Map each playbook requirement to the corresponding section in the MSA, exhibit, and any incorporated policies; mark deviations with a redline position.
2. Read the internal email thread for commercial intent, negotiation leverage, and any client-side non-negotiables before deciding how hard to press each edit.
3. Review the privacy exhibit as a standalone operative instrument, then compare it back to the MSA to catch conflicts, gaps, or missing hierarchy language.
4. For each identified issue, state the affected section, the playbook basis or governing rule, the proposed redline, the fallback if any, and the business or legal consequence.
5. Apply a severity scale consistently across the memo: Critical, High, Medium, and Low.
6. Where the source set contains multiple parallel provisions on the same topic, enumerate them first and analyze each one separately rather than collapsing them into a single blended answer.
7. If the source materials resolve a point only by implication, surface that uncertainty and mark it for client decision rather than silently choosing a position.
8. Where a legal proposition is relied on, identify the authority or rule supporting it rather than stating the conclusion bare.

## 5. Vertical / structural / temporal relationships

- Give priority to the primary agreement, then test exhibit language, then test incorporation and hierarchy language, then test practical performance obligations.
- Track upstream and downstream dependencies: a change in the MSA may require matching edits in the exhibit, order form, security appendix, or privacy notice.
- Watch for temporal sequencing issues: effective date, service commencement, notice periods, cure periods, incident reporting windows, deletion deadlines, renewal notices, and post-termination assistance.
- When a provision is conditional on a future event or customer election, make that dependency explicit so the memo reflects when the obligation actually arises.

## 6. Output structure conventions

- Produce two deliverables: a redlined agreement and an issues summary memo.
- Write the redlined agreement first and make it self-sufficient in plain text as well as in tracked-change formatting.
- Mark every substantive change with a robust textual convention that survives export, such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], and add a short [Rationale: …] note for each change.
- Use bracketed comments in the redline to explain why the edit is being made, and indicate whether the position is mandatory, preferred, or fallback.
- Keep comments tied to the actual clause being changed; do not gather all rationale into a separate narrative that cannot be mapped back to the markup.
- In the issues memo, define the severity scale once at the top and use it uniformly for every entry.
- Organize the memo by severity, then by agreement section, and for each issue include: the section reference, the issue, the playbook or rule basis, the proposed redline position, any acceptable fallback, and the rationale.
- For each issue entry, include the scale or scope implicated by the issue, the related clause or exhibit interaction, and the downstream consequence for the client.
- End the memo with a concise Recommended Actions block that assigns each action to a responsible role and ties it to a deadline or transaction milestone.
- Before finishing, verify that both deliverables exist, are non-empty, and that the redline contains operative clause changes rather than commentary alone.
