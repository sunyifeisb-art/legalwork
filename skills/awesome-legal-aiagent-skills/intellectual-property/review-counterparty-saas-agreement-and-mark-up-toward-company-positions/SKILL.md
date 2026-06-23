---
name: review-markup-counterparty-saas-agreement
task_id: intellectual-property/review-counterparty-saas-agreement-and-mark-up-toward-company-positions
description: Reviewing a vendor SaaS agreement and related attachments against an internal contracting playbook to produce a prioritized issues list and redline markup.
activates_for: [planner, solver, checker]
---

# Skill: Review Counterparty SaaS Agreement and Mark Up Toward Company Positions

## 1. Subject-matter triage

Treat the agreement package as one integrated contract set: master terms, order forms, exhibits, data-processing terms, security schedules, service levels, pricing schedules, and any referenced policies. Identify which document controls in the event of inconsistency, then review each attachment against that hierarchy rather than in isolation.

If multiple versions, counterparties, pricing options, term choices, or data-processing variants appear in the source set, enumerate them first and analyze each variant separately. Do not compress distinct commercial paths into one generalized assessment.

## 2. Failure modes the skill is correcting

- Reviewing only the master form and missing conflicts, carve-outs, or silent overrides in attachments
- Treating non-binding deal context as background instead of using it to rank issues and markups
- Issuing a redline without a companion issues list that explains the business and legal rationale
- Missing how one clause changes the effect of another clause elsewhere in the package
- Using visual track-changes only, so the requested edits are not recoverable after export
- Stating conclusions without tying them to the governing legal or contractual rule
- Writing issue notes that describe the clause but do not state severity, impact, and action

## 3. Legal frameworks / domain conventions that apply

- Customer-side SaaS review typically centers on data ownership, data use restrictions, portability, confidentiality, security, uptime, support, suspension, termination, fees, renewal, liability, indemnity, audit rights, and subcontracting
- Priority should track both legal risk and operational dependency; a clause affecting production use, data access, or exit rights generally outranks a purely stylistic deviation
- Specific data-protection attachments should control over general boilerplate when they address privacy, security, retention, or regulated-data handling
- Service-level provisions should be tested for meaningful credits, credit process mechanics, exclusion of sole-remedy language, and whether repeated failures create exit rights or service escalation
- Pricing language should be reviewed for usage-based fees, renewal uplifts, auto-renewal mechanics, overage exposure, and any vendor discretion to re-price
- Data rights should favor express customer ownership of customer content, limited vendor use, no training or benchmarking use without consent, and workable export obligations on termination
- Limitation-of-liability and indemnity provisions should be read together; a narrow indemnity plus a low cap can shift disproportionate risk to the customer
- Publicly recognized contract doctrines such as incorporation by reference, specific-over-general construction, precedence clauses, and express carve-outs govern how conflicts among documents are resolved

## 4. Analytical scaffolds

1. Map the document set and determine the governing order of precedence
2. Compare the master agreement to every attachment for internal inconsistency, missing terms, and vendor-favorable deviations from the playbook
3. Assess each key risk bucket: data rights, privacy/security, service levels, fees, term/renewal, termination/exit, liability, indemnity, audit, subcontracting, suspension, and dispute mechanics
4. Use the deal context to rank issues by business urgency, leverage, and likely operational impact
5. For each issue, identify the clause, the conflicting or missing provision, the playbook position, and the proposed company-side language direction
6. Where a concession is acceptable, state a fallback position that preserves the core protection
7. For each redline, make the change recoverable in plain text and pair it with a short rationale comment
8. Where a clause depends on another attachment or policy, cross-check that cross-reference and note any mismatch

## 5. Vertical / structural / temporal relationships

If the package includes a flow of obligations over time, check how the later-stage provisions depend on the earlier-stage ones: onboarding, implementation, live use, renewal, suspension, termination, transition assistance, and post-termination retention/deletion. Confirm that later-stage rights are not undermined by earlier-stage carve-outs.

If the agreement allocates responsibilities across business, IT, security, privacy, procurement, or finance functions, identify who must act, what event triggers action, and whether the clause gives enough lead time for internal compliance.

If a specific schedule or policy is incorporated by reference, verify that the attachment is actually included, that it matches the body text, and that no hidden vendor policy is being elevated above negotiated terms.

## 6. Output structure conventions

- Produce two deliverables: a prioritized issues list and a redline markup
- Use an ordinal severity scale defined once at the top of the issues list, and apply it consistently to every entry
- For each issue, include the clause reference, the problem, the controlling contract or legal principle, the business consequence, and the recommended company position
- When source documents support a numeric exposure, threshold, term, renewal trigger, or other measurable input, use that figure to calibrate the issue without inventing missing numbers
- Surface each issue with its interaction points: identify the related clause, exhibit, schedule, or policy that changes the analysis
- End the issues list with concrete recommended actions, each phrased as an imperative, assigned to the relevant role, and tied to a practical timing anchor
- In the redline markup, mark every substantive edit in plain-text-recoverable form in addition to any track-changes styling, and attach a short rationale to each edit
- Keep the redline aligned to company positions rather than merely annotating vendor text; the markup should show the proposed replacement language where feasible
- Preserve document hierarchy and defined terms unless a change is needed to fix a substantive risk or inconsistency
