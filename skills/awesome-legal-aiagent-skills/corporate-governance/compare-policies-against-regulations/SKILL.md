---
name: hipaa-security-rule-policy-gap-analysis
task_id: corporate-governance/compare-policies-against-regulations
description: HIPAA Security Rule gap analysis comparing each security policy against the applicable regulatory requirements, organized by safeguard category, with remediation recommendations aligned to an upcoming regulatory audit.
activates_for: [planner, solver, checker]
---

# Skill: HIPAA Security Rule Gap Analysis — Policy vs. Regulation

## 1. Subject-matter triage (only if applicable)

- Treat the assignment as a comparative compliance review of policies, procedures, logs, and supporting materials against the HIPAA Security Rule.
- First identify the universe of policy documents, systems, workforce groups, vendors, and incidents in scope; if more than one appears, enumerate them before analyzing gaps.
- Separate pre-audit items from longer-horizon remediation, because an audit notice creates an immediate priority window that controls sequencing.
- If the materials describe an incident, assess whether the incident triggers a breach-risk review and whether that analysis was documented.

## 2. Failure modes the skill is correcting

- Flattening the analysis into an unsorted issue list instead of grouping findings by safeguard category and applicable implementation specification.
- Stating that a policy is “generally compliant” without tying each gap to the controlling regulatory subsection and the omitted requirement.
- Treating training, access, vendor, or log issues as binary pass/fail without counting affected people, accounts, systems, or relationships.
- Failing to distinguish formal written designation from informal job performance where the rule expects a named role or documented procedure.
- Omitting the downstream consequence of each gap for audit readiness, regulatory exposure, incident response, or operational continuity.
- Conflating current-state weaknesses with future-state remediation, which obscures what must be fixed before the audit window closes.
- Ignoring that a gap may exist in multiple places at once, such as a policy omission plus an implementation failure.

## 3. Legal frameworks / domain conventions that apply

- Analyze against the HIPAA Security Rule by safeguard family and cited subsection, including administrative, physical, and technical requirements, plus documentation expectations.
- Cite the controlling regulation for each proposition by name and section; do not state a compliance conclusion without the rule that supports it.
- Confirm formal designation where the rule contemplates a responsible officer or defined security function.
- Treat workforce security, authorization, access management, incident procedures, contingency planning, evaluation, physical safeguards, and device/media control as distinct compliance lanes.
- Evaluate vendor relationships for business associate coverage wherever a vendor creates, receives, maintains, or transmits ePHI.
- Examine access controls for unique user identification, emergency access, automatic logoff, encryption/decryption mechanisms, and any legacy access path that bypasses strong authentication.
- Review audit controls for logging coverage, review capability, and retention practices sufficient for compliance and audit defense.
- Review workforce termination procedures for timely credential deactivation and removal of dormant or residual access.
- Review contingency planning for backup, recovery, emergency operations, testing, revision, and criticality analysis.
- Review physical safeguards for facility access, workstation use, workstation security, and device/media disposal or destruction.
- Treat personal-device access to ePHI as a policy issue unless governed by device-management or equivalent controls.
- If an incident is described, analyze whether a documented, multi-factor breach-risk assessment was completed and whether the result is defensible.

## 4. Analytical scaffolds

- Safeguard-by-safeguard pass: for each safeguard family, identify the governing requirement, compare the policy text and supporting materials, and then record the gap.
- Finding construction: each issue should state the omitted or deficient control, the applicable subsection, the affected population or asset set, and the practical consequence of the gap.
- Quantification: where the materials permit it, quantify affected employees, accounts, systems, vendors, devices, or incidents; if only one item is in scope, say so expressly.
- Cross-reference: link each issue to any related policy, register, incident record, system list, or supporting document that confirms or contradicts the stated control.
- Severity: assign every finding an ordinal severity level using one uniform scale defined once at the top of the report.
- Remediation logic: distinguish immediate audit-critical fixes from medium-term policy or tooling upgrades, and tie each recommendation to the role that should own it.
- Vendor analysis: build a register of all ePHI-touching vendors and test whether each has current, compliant agreement coverage.
- Access analysis: identify any systems, interfaces, or cohorts that permit ePHI access without required controls; do not collapse distinct systems into a single finding.
- Training analysis: identify the affected workforce groups and onboarding cohorts, and state the extent of non-completion when the source materials support it.
- Incident analysis: if a no-breach or non-reportable conclusion appears, verify the presence of a documented risk assessment that supports that position.

## 5. Vertical / structural / temporal relationships (only if applicable)

- The audit notification date controls priority: issues inside the audit scope should be surfaced ahead of background hardening work.
- If a breach-risk assessment is missing for a recent incident, that gap may affect both reporting posture and audit defensibility, so treat it as time-sensitive.
- Where a control depends on another control, identify the dependency explicitly, such as training relying on onboarding completion or deprovisioning relying on HR termination notice.
- If the materials show a chain from policy to procedure to implementation, test the chain end-to-end rather than evaluating the policy in isolation.

## 6. Output structure conventions

- Use a report format suited to a compliance deviation memorandum or gap analysis, not a contractual redline.
- Begin with a brief scope and method summary, then define the severity scale used in the report.
- Organize findings by safeguard category, with numbered findings under each category and a regulatory citation for each finding.
- For each finding include: issue summary, governing citation, affected scope, severity, evidence or document reference, consequence, and remediation recommendation.
- Keep remediation recommendations specific and operational, using imperative verbs and naming the responsible role or function.
- End with a prioritized remediation roadmap that separates pre-audit actions from longer-term remediation and reflects the audit timeline.
- If a deliverable file is requested, ensure the primary report is produced as the operative work product and that any secondary summary does not replace it.
