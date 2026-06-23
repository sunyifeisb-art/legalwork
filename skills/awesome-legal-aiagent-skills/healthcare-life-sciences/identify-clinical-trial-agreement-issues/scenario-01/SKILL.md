---
name: hls-identify-cta-issues-scenario-01
task_id: healthcare-life-sciences/identify-clinical-trial-agreement-issues/scenario-01
description: Reviews a proposed clinical trial agreement against an institutional research playbook to identify recurring compliance and drafting gaps involving screening practices, cross-border data transfer obligations, reimbursement controls, side-letter authority issues, allocation of responsibility for protocol deviations, and governing-law considerations.
activates_for: [planner, solver, checker]
---

# Skill: Clinical Trial Agreement Issue Identification — Scenario 01

## 1. Subject-matter triage

- Treat the CTA, side letter, and supporting materials as a single contract package; analyze each document separately and then for cross-document conflicts.
- If multiple sites, parties, study periods, data flows, reimbursement streams, or governing-law options appear, enumerate them first and analyze each on its own before drawing conclusions.
- If a point is absent or ambiguous, flag the omission as an issue rather than inferring sponsor-favorable terms.

## 2. Failure modes the skill is correcting

- Screening obligations are analyzed only at onboarding, missing whether the agreement requires ongoing periodic screening throughout the life of the arrangement.
- Data protection obligations are not assessed even when the sponsor location, data destination, or subject population creates a cross-border transfer problem.
- Reimbursement language permits pass-through costs without a defined cap, approval gate, or documentation standard, creating uncontrolled spend exposure.
- Side-letter terms are treated as informal when they may override institutional workflow, create unauthorized access rights, or bypass research-office review.
- Protocol-deviation provisions are read in isolation, obscuring how responsibility is split for reporting, remediation, cure, suspension, or termination.
- Governing-law language is accepted without checking whether it is consistent with institutional contracting requirements and enforcement needs.
- Issues are described but not closed with severity, legal basis, cross-document interaction, and practical consequence.
- Recommendations are stated generally rather than as specific, role-assigned next steps.

## 3. Legal frameworks / domain conventions that apply

- Screening obligations: compare any one-time screening or enrollment-only language against the institution’s policy and applicable research compliance expectations for continuing screening during the engagement.
- Cross-border data transfers: where personal data may move to a foreign recipient or foreign processing environment, assess whether the draft addresses the applicable transfer mechanism or equivalent safeguards for the relevant data-protection regime.
- Reimbursement controls: evaluate whether direct-cost reimbursement, pass-through charges, investigator payments, and out-of-pocket expenses are subject to caps, preapproval, and documentation requirements consistent with institutional policy.
- Side-letter authority: test side-letter rights against the institution’s normal review and approval workflow, especially where the letter grants direct sponsor access, operational control, or exceptions to standard contracting channels.
- Protocol deviations: identify how the agreement allocates regulatory response, reporting, remediation, suspension, and termination rights among the institution, investigator, and sponsor; use the governing research-compliance framework reflected in the source materials.
- Governing law: assess whether the chosen law and forum are compatible with the institution’s contracting posture, indemnity enforcement, IP allocation, and dispute-resolution needs.
- When citing a legal or policy proposition, name the controlling authority, rule, statute, regulation, policy, or contract provision relied on; do not state conclusions without a cited basis.

## 4. Analytical scaffolds

1. Build a document map: identify the CTA, side letter, and any supporting materials that modify obligations, then note which provisions are superseded, supplemented, or left untouched.
2. For each issue, state the exact clause or omission, the controlling authority or institutional policy it implicates, the severity on a uniform ordinal scale, and the operational or regulatory consequence.
3. Test screening language for whether it is one-time only or continuing; if the document package contains more than one screening trigger or population, assess each separately.
4. Test data-transfer language for whether a foreign sponsor, foreign affiliate, cloud host, or non-domestic processing path is involved; if so, identify the missing safeguard, approval, or transfer mechanism.
5. Test reimbursement language for caps, approvals, documentation, and auditability; if multiple cost categories appear, analyze each category separately.
6. Read the side letter for any exception, direct-access right, or workflow bypass; cross-reference the CTA to determine whether the side letter conflicts with the base agreement.
7. Read deviation, termination, and notice provisions together; identify who must act, who bears cost, and what events trigger escalation.
8. Check governing-law and dispute provisions against indemnity, IP, confidentiality, and enforcement clauses to identify any internal inconsistency or practical mismatch.

## 5. Vertical / structural / temporal relationships

- Cross-reference the CTA against the side letter and supporting materials whenever a term is modified, narrowed, or expanded.
- Distinguish baseline obligations from exception language, and note whether an exception is temporary, study-specific, or open-ended.
- Track timing language carefully: pre-study, enrollment, ongoing, periodic, upon request, immediately, within a stated number of days, and post-termination obligations can create different compliance burdens.
- Where the agreement allocates duties between institution and investigator, identify whether responsibility is parallel, sequential, or exclusive.
- If a provision depends on another clause for implementation, state the dependency and the consequence of nonalignment.

## 6. Output structure conventions

- Produce a concise but comprehensive issues memorandum with prioritized findings.
- Define a single ordinal severity scale near the top and apply it uniformly to every issue entry.
- For each issue, use a consistent one-line or short-paragraph format containing:
  - issue heading
  - affected provision or omission
  - controlling authority or policy basis
  - severity
  - why it matters
  - recommended revision
- Each issue should close with: the specific provision or document conflict, the governing authority or policy, the likely consequence if uncorrected, and a concrete fix.
- Include cross-document conflicts explicitly when the CTA and side letter do not align.
- End with a Recommended Actions block that assigns each next step to a role and ties it to a timing anchor or transactional milestone.
- If the source documents support it, group related issues by topic, but do not merge distinct compliance problems into one entry.
- Use conventional memorandum headings; do not mirror any hidden checklist or rubric phrasing.
