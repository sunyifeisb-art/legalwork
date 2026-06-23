---
name: draft-open-source-compliance-policy
task_id: intellectual-property/draft-open-source-compliance-policy
description: Board-ready open source software compliance policy for a technology company, incorporating audit findings, customer contract obligations, engineering practices, and a pending relicensing development.
activates_for: [planner, solver, checker]
---

# Skill: Draft Open Source Software Compliance Policy

## 1. Subject-matter triage (only if applicable)

- Treat the task as a policy-drafting exercise, not a memo: produce an operative compliance policy that can be approved, implemented, and audited.
- Read the audit, customer agreements, term sheet, engineering memo, and any relicensing materials as one integrated record; reconcile them before drafting.
- Identify the company’s product and deployment context, including whether software is distributed, embedded, or accessed over a network, because the compliance triggers differ by mode of use.
- If multiple product lines, codebases, business units, or transaction contexts appear in the source set, enumerate them first and draft the policy to cover each explicitly rather than using a single generic rule.
- If the source materials disclose a live relicensing or license-change event, treat it as an active governance issue that the policy must address immediately.

## 2. Failure modes the skill is correcting

- Drafting a generic open source policy that ignores the specific license mix, usage patterns, and findings in the audit or software composition analysis.
- Failing to connect open source compliance rules to customer-facing contractual representations, ownership covenants, exclusivity commitments, or other IP promises.
- Treating copyleft, network-triggered obligations, or distribution mechanics as abstract concepts rather than product-specific compliance triggers.
- Omitting approval gates, escalation paths, owner assignments, recordkeeping, and enforcement steps, leaving the policy aspirational instead of operational.
- Failing to address pending relicensing, license migration, or removal decisions as part of the policy’s change-control and exception process.
- Drafting a policy that describes what should happen without stating who does it, when it happens, and what artifact proves completion.
- Using vague legal conclusions without naming the controlling source of the obligation or the policy basis for the rule.

## 3. Legal frameworks / domain conventions that apply

- Classify open source licenses by obligation profile: permissive, weak copyleft, and strong copyleft, and tie each class to the practical compliance steps it requires.
- Treat network-access triggers as distinct from distribution triggers where the relevant license or product model makes that distinction legally meaningful.
- Incorporate customer agreement obligations as a parallel constraint set; where open source use may affect ownership, non-infringement, disclosure, source-availability, or assignment representations, the policy must route review through legal and commercial approvals.
- Use software composition analysis, dependency tracking, notice preservation, source-availability review, and release gating as core compliance controls.
- Recognize that disclosure schedules, diligence questionnaires, and similar transaction materials may need contemporaneous updates when open source usage changes.
- Anchor legal propositions to controlling authority identified in the source materials or, if absent, to the relevant license text, contract provision, statute, regulation, or established compliance practice.
- Treat board-facing policies as governance documents: they should define authority, responsibility, escalation, auditability, and exception handling, not merely aspirational principles.

## 4. Analytical scaffolds

- License inventory mapping: identify every license category or special licensing event referenced in the materials, then map each to its required approval, notice, disclosure, or release-step implications.
- Obligation-by-trigger analysis: for each license category, ask what happens on inclusion, modification, distribution, internal deployment, or external network access.
- Contract consistency check: compare the policy against customer agreement representations and operational commitments, and identify where open source compliance controls must prevent inconsistency.
- Relicensing response logic: define how the company evaluates, approves, documents, and communicates a license change affecting existing or future code.
- Governance design: specify owners, approvers, escalation thresholds, review cadence, exception authority, training obligations, and record retention.
- Release-control design: specify when engineering must obtain clearance, what artifacts must be attached, and what blocks a release absent approval.
- Disclosure-maintenance logic: specify how the policy keeps diligence materials, disclosure schedules, and internal inventories synchronized with the current codebase.
- Board-readiness check: ensure the policy states purpose, scope, authority, controls, reporting lines, and implementation milestones in a form suitable for leadership approval.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If the source set contains more than one product, business line, or deployment model, address each in separate policy provisions or subparts so the compliance trigger is not diluted.
- If the record contains both current-state findings and future-state commitments, separate baseline controls from remediation commitments and adoption milestones.
- If a relicensing or code migration decision is pending, place the decision path, interim controls, and post-change update obligations in chronological order.
- If customer contracts and engineering practices point in different directions, make the policy state the higher standard and route deviations through formal exception approval.
- If a transaction or diligence process is underway, place disclosure update obligations on a continuing basis through signing, closing, and post-closing transition as applicable.

## 6. Output structure conventions

- Draft as a board-ready policy with a clear title, purpose statement, scope, definitions, roles and responsibilities, license-class rules, review and approval workflow, release controls, recordkeeping, training, escalation, exception handling, relicensing procedure, and governance/reporting.
- Use conventional policy language that is operative and enforceable: “must,” “may only with approval,” “shall retain,” “shall escalate,” and similar verbs.
- Include a concise executive summary or preface if helpful, but keep it subordinate to the policy itself.
- Tie each rule to the underlying compliance rationale in the body of the policy, especially where the rule responds to a specific audit finding, contract risk, or relicensing event.
- Define the approval chain and the responsible functions in a way that an engineering organization can actually follow.
- Include a section on monitoring, periodic review, and version control so the policy can evolve with the codebase and legal landscape.
- Ensure the final document reads as an implementable internal control document, not a legal memorandum or an issue list.
