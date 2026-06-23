---
name: identify-issues-counterparty-msa
task_id: intellectual-property/identify-issues-in-counterparty-master-services-agreement
description: Reviewing a counterparty-form master services agreement against a contracting playbook and deal materials to produce a redline recommendation memo with prioritized risk ratings.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Counterparty Master Services Agreement

## 1. Subject-matter triage (only if applicable)

- Treat the vendor MSA as the primary source document, then compare it against the contracting playbook and any related deal materials before forming conclusions.
- Identify all playbook-driven deviations first; then identify additional vendor terms not addressed by the playbook that nonetheless change the risk profile.
- If multiple versions, exhibits, orders, policies, or incorporated terms exist, treat them as one integrated contract set and check for conflicts across the full set before commenting.

## 2. Failure modes the skill is correcting

- Reviewing the agreement without anchoring every issue to the playbook position, which turns the exercise into generic contract commentary instead of client-specific issue spotting
- Failing to use the deal materials as context for priority, so materially important deviations are buried under low-signal drafting points
- Stopping at issue description and omitting a concrete redline position, which leaves the memo non-actionable
- Treating stylistic markup as sufficient when the deliverable is a redline recommendation, which makes the proposed change hard to execute after export
- Collapsing distinct provisions into a single generic objection, which hides the actual contract path that must be changed
- Ignoring cross-document interplay, such as an exhibit, policy, order form, or security schedule that narrows or expands the main text
- Leaving blanks, elections, fallback choices, or open business terms unflagged even though they require client input before signature

## 3. Legal frameworks / domain conventions that apply

- Liability allocation in vendor MSAs commonly turns on cap structure, carve-outs, and exclusions from indirect or consequential damages; evaluate each against the playbook’s preferred risk allocation and the governing contract doctrine for enforceability and interpretation.
- Intellectual property ownership for custom work, pre-existing materials, and deliverables often differs between vendor paper and buyer paper; assess ownership, assignment, and license scope using the agreement’s defined terms and any incorporated development or services terms.
- Data protection and security provisions in technology services contracts typically include confidentiality, incident notice, cooperation, return or deletion, and audit or verification rights; vague drafting should be tested against the playbook and any referenced security obligations.
- Indemnification clauses in vendor paper often narrow the scope to third-party IP claims or exclude key categories; assess whether the contract language matches the client’s indemnity baseline and related limitation-of-liability terms.
- Termination and transition support provisions frequently determine operational continuity; review convenience termination, cause termination, wind-down duties, and data handoff obligations together rather than in isolation.
- Service levels, credits, measurement windows, service exclusions, and cure mechanics often sit in schedules that can override the main body; compare those mechanics to the playbook and to any order-specific commitments.
- Governing law, venue, dispute resolution, and injunctive relief provisions should be checked against the client’s standard risk posture and any deal-specific leverage reflected in the materials.
- Audit, inspection, compliance, and record-retention rights should be reconciled with confidentiality and security restrictions so the resulting package is internally consistent.

## 4. Analytical scaffolds

1. Read the playbook as the primary negotiating baseline, then map each relevant agreement clause to the corresponding playbook position.
2. For every deviation, identify the precise contract language that creates the divergence and state the client-preferred replacement position.
3. Rate each issue on a single ordinal scale: Critical, High, Medium, or Low.
4. Support each issue with the deal-context scale that makes it material, such as contract size, term, service criticality, data sensitivity, operational dependence, or implementation timing.
5. Cross-check each issue against any related clause, schedule, policy, exhibit, or incorporated document that changes its effect.
6. State the downstream consequence for the client in practical terms: cost exposure, service interruption, IP loss, compliance burden, bargaining leverage, or dispute risk.
7. Draft redline language that is executable in the contract text, not a paraphrase of the business point.
8. If a provision is novel and not covered by the playbook, assess it on first principles and explain why it matters in this deal.
9. If the agreement contains options, blanks, bracketed alternatives, or election points, flag them as decision items rather than leaving them implicit.
10. Do not analyze multiple counterparties, term buckets, or alternative scenarios as one blended issue set; separate them if they are separately addressed in the source documents.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Review the agreement as a hierarchy: body text first, then schedules, exhibits, order forms, policies, statements of work, and any incorporated guidelines.
- Check whether a defined term in one document silently narrows a promise in another document.
- Check whether an exhibit changes the operative standard in the main agreement by adding exclusions, notice mechanics, service-credit triggers, or remedy limitations.
- Track timing-sensitive obligations separately, including notice periods, cure periods, transition periods, audit windows, retention periods, and post-termination survival.
- When a clause depends on another clause for operation, state the dependency explicitly so the reader can see the contractual chain.
- If one document conflicts with another, identify which provision should control under the agreement’s order-of-precedence logic and recommend the fix.

## 6. Output structure conventions

- Produce a redline recommendation memo in a conventional issue-spotting format, organized by severity from Critical to Low.
- Include a short severity legend at the top so the ordinal scale is explicit and uniform.
- For each issue, include:
  - the agreement section or document location
  - the playbook position
  - the deviation from that position
  - the severity rating
  - the deal-context basis for why the issue matters
  - the cross-referenced clause or document
  - the downstream consequence to the client
  - proposed replacement language
- Use robust textual markup for the proposed changes so the redline remains readable in plain text as well as in formatted output, and pair each substantive change with a short rationale.
- Where the memo identifies a deletion, addition, or substitution, make the change explicit in text rather than relying only on styling.
- Include a distinct section for provisions not addressed by the playbook that require independent assessment.
- End with a Recommended Actions block that assigns each follow-up to a responsible role and ties it to a transaction milestone, signing deadline, or other concrete timing anchor drawn from the deal context.
