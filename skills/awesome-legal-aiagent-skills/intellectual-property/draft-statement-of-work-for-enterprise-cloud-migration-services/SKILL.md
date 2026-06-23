---
name: draft-sow-cloud-migration
task_id: intellectual-property/draft-statement-of-work-for-enterprise-cloud-migration-services
description: Drafting a technology services statement of work for a regulated enterprise cloud migration engagement that requires reconciling conflicting specifications across multiple source documents while incorporating applicable healthcare data-compliance obligations.
activates_for: [planner, solver, checker]
---

# Skill: Draft Statement of Work for Enterprise Cloud Migration Services

## 1. Subject-matter triage

When the source set includes an MSA excerpt, proposal, charter, prior SOW, privacy or BAA summary, and pricing correspondence, treat the MSA as the governing baseline, the charter as the operative scope source, and the privacy/BAA materials as controlling for data-handling obligations. Reconcile conflicts before drafting; do not average competing numbers or carry forward inconsistent terms. Where multiple parties, phases, rates, dates, or service levels appear, enumerate them first and then map each one to the controlling source and drafting consequence.

## 2. Failure modes the skill is correcting

- Drafting a thin SOW that reproduces commercial scope but omits the regulated-data handling terms that must be embedded in the SOW itself
- Carrying forward conflicting performance, timing, or fee terms without identifying which source governs
- Missing the operational relationship between earlier-phase acceptance and later-phase billing, launch, or dependency gates
- Treating service credits as a complete remedy and omitting escalation, cure, or termination consequences for repeated failure
- Leaving key personnel, change-control, rollback, and acceptance mechanics too open-ended for execution
- Failing to flag additions that are not in the source set but are normally required for a healthcare enterprise migration
- Issuing a memo that lists issues without ranking them, explaining their impact, or tying each to a decision point

## 3. Legal frameworks / domain conventions that apply

- The SOW must be read as a transaction document under the MSA; the MSA governs unless the SOW expressly and specifically overrides a provision
- Healthcare privacy and security obligations applicable to regulated health information must be stated with enough specificity to bind implementation, breach response, access controls, retention, and destruction
- If the source materials reference a privacy or business-associate framework, the SOW should align with that framework and avoid conflicting notice, audit, or subcontracting language
- Acceptance testing should define objective criteria, test windows, rejection rights, remediation windows, and deemed acceptance mechanics
- Service levels should address uptime, incident classification, response and resolution timing, credits, non-exclusive remedies, and a chronic-failure exit path
- Payment terms should resolve milestone billing, retainage or holdback, invoice timing, and termination settlement
- Change governance should distinguish scope changes from routine tasking and require formal approval where cost or schedule impact exceeds the agreed threshold
- Intellectual property provisions should allocate ownership of custom work product, migration artifacts, scripts, interfaces, and adaptations built on the vendor’s platform
- Insurance, indemnity, confidentiality, subcontractor controls, and data-destruction obligations should track the compliance profile of a healthcare migration

## 4. Analytical scaffolds

1. Build a source hierarchy table and resolve each conflict by reference to that hierarchy before drafting any operative clause
2. Identify every phase or workstream in the charter, then draft each phase with deliverables, assumptions, dependencies, acceptance criteria, and fee treatment
3. For every numeric term that appears in more than one source, compare the values, select the controlling value, and flag the rejected value in the cover memo
4. Draft service levels with a complete operating model: measured metric, measurement window, incident tier, response time, restoration target, credit mechanics, cap, and chronic-failure consequence
5. Draft payment mechanics so that milestone triggers, invoice timing, any holdback, and termination payments fit together without ambiguity
6. Draft the compliance section so that healthcare-data obligations, confidentiality, access restrictions, logging, breach notice, backup, retention, and destruction all operate as a single integrated set
7. Draft acceptance and rollback provisions together so failed deployment, failed validation, and fallback execution are addressed in one sequence
8. Draft change-order governance with approval authority, pricing basis, and schedule-impact trigger; separate requested enhancements from corrective work
9. Draft IP ownership so the client receives the intended operational rights in deliverables, while vendor background tools remain properly reserved
10. Draft the cover memo as a decision aid: each issue should identify the conflict or gap, the source documents involved, the practical consequence, and the recommended drafting resolution

## 5. Vertical / structural / temporal relationships

The SOW should follow the project lifecycle: planning, design, build, migration, testing, cutover, stabilization, and closeout. Earlier-phase signoff conditions later-phase starts, and later-phase payment should not outrun the acceptance condition that triggers it. Compliance obligations operate continuously across all phases, not only during production cutover. Any fallback or rollback right should sit alongside cutover obligations, not in a separate appendix that can be overlooked.

## 6. Output structure conventions

- Produce two files: the SOW first, then the cover memo
- The SOW should use a conventional contract structure: title/cover page, background, scope, phases, deliverables, acceptance, service levels, personnel, compliance, security, data handling, IP, change control, pricing and invoicing, dependencies, assumptions, warranties or disclaimers if supported by the source set, termination effects, and signature blocks
- The cover memo should be concise but decision-oriented, with sections for source conflicts, gaps, additions that should be inserted, open issues needing instruction, and compliance considerations requiring review
- For each memo issue, state severity using a simple ordinal scale defined at the top, then explain the business or regulatory consequence and the drafting recommendation
- End the memo with a short Recommended Actions block that assigns the next step to the relevant lawyer, business owner, or compliance lead and ties it to the execution timeline
- Use controlling legal authority or governing source references when stating compliance propositions; do not assert obligations or risk conclusions without naming the source or rule supporting them
- Before finalizing, confirm that the primary SOW file is complete and operative, not a summary of the SOW, and that the memo is secondary to it
