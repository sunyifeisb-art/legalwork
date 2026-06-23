---
name: hls-compare-policies-hipaa-security-rule
task_id: healthcare-life-sciences/compare-policies-against-regulations
description: Compares security and privacy policies against the HIPAA Security Rule on a policy-by-policy basis, organizing gaps by applicable safeguard category and tailoring remediation sequencing to external compliance deadlines.
activates_for: [planner, solver, checker]
---

# Skill: HIPAA Security Rule Gap Analysis — Policy vs. Regulation

## 1. Subject-matter triage
- Treat the task as a compliance-gap comparison, not a narrative policy review.
- Identify each policy, procedure, supporting schedule, inventory, register, or other source that bears on HIPAA Security Rule compliance.
- If the materials cover multiple entities, systems, locations, or programs, analyze each separately before aggregating.
- If the materials show a single in-scope program, say so and avoid implying broader coverage.

## 2. Failure modes the skill is correcting
- Reviewers often stop at the policy text and miss mismatches between written controls, actual system coverage, and vendor/contract coverage.
- Required and addressable specifications are frequently blended together, leading to false negatives where an addressable safeguard is omitted without justification.
- Scope defects are commonly undercounted when the record contains multiple systems, users, vendors, or devices.
- Audit or reporting deadlines are often treated as background context rather than the anchor for remediation sequencing.
- Issue statements are often incomplete when they do not tie the gap to a specific provision, a measurable scope indicator, and a concrete consequence.

## 3. Legal frameworks / domain conventions that apply
- Use the HIPAA Security Rule safeguard structure: Administrative, Physical, and Technical safeguards.
- Distinguish required specifications from addressable specifications; addressable items must be implemented or documented as reasonably and appropriately not implemented.
- Anchor each gap to the most specific rule provision available from the source materials, using the regulation’s part and section where possible.
- Commonly implicated provisions include security management, workforce security, information access management, security awareness and training, security incident procedures, contingency planning, physical access controls, workstation/device controls, access control, audit controls, integrity, person/entity authentication, and transmission security.
- Confirm whether security officer designation, risk analysis currency, access termination procedures, audit logging, contingency coverage, encryption scope, workstation/mobile controls, media disposal, and vendor access controls are actually supported by the materials.
- If the source set references an external compliance, audit, or notification milestone, treat that milestone as the controlling timing anchor for remediation sequencing.

## 4. Analytical scaffolds
- Start by enumerating the in-scope policies, procedures, systems, vendors, and other distinct objects that can create separate gaps.
- For each policy or control family, test it against the applicable HIPAA safeguard category and then against the underlying required and addressable specifications.
- For every identified issue, close the analysis with:
  - the specific provision implicated,
  - a scope indicator drawn from the source materials where available,
  - the interaction with any related policy, system, inventory, register, or contract term,
  - the operational, regulatory, or litigation consequence if the gap remains open.
- Treat a missing justification for an addressable specification as a gap, even if the underlying control is not expressly mandated in absolute terms.
- When a vendor, system, or device population is implicated, identify the affected population from the record rather than using generalized language.
- When multiple gaps arise from one control family, separate them so the remediation action can be assigned cleanly.
- Do not infer facts not contained in the materials; where the record is silent, flag the silence as a gap in documentation or evidence.
- Use a severity judgment for every entry on a uniform ordinal scale defined once at the top of the report, and apply it consistently.
- Tie remediation sequencing to the external deadline or review milestone, then work backward from that date for priority ordering.
- End the report with direct recommendations that assign an action, a responsible role, and a timing anchor.

## 5. Vertical / structural / temporal relationships
- Compare policy language against related support materials, including inventories, logs, attestations, contracts, and implementation evidence.
- Cross-check whether coverage in one document is undermined by exclusions, exceptions, or stale references in another.
- Separate current-state controls from historical artifacts; an outdated assessment or superseded procedure should be treated as different from a live control.
- Where a control depends on another document or operational practice, note the dependency and whether the dependency is satisfied in practice.
- If the record shows multiple time periods or versions, analyze the most recent operative version first and then note legacy conflicts that affect compliance.

## 6. Output structure conventions
- Write the output as a gap analysis report suitable for a compliance audience.
- Open with a brief executive summary that states the overall posture, the severity scale used, and the distribution of gaps by severity.
- Organize the body by policy or control family, then by specific regulatory gap within each policy.
- For each gap, include:
  - policy or evidence reference,
  - HIPAA Security Rule provision,
  - concise gap description,
  - scope indicator if the record supports one,
  - severity,
  - consequence,
  - remediation action.
- Use precise regulatory citations where available rather than generic references to “HIPAA.”
- Keep the report analytical and action-oriented; do not repeat source text unless necessary to identify the provision or evidence.
- Close with a Recommended Actions section that uses imperative verbs, names the responsible role from the record where possible, and ties each action to a deadline or regulatory milestone.
- If the task asks for a document output, treat the report itself as the primary deliverable and ensure the final content is complete, self-contained, and ready to place into the requested file.
