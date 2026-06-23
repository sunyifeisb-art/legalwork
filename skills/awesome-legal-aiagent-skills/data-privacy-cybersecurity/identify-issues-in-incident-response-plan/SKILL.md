---
name: identify-issues-in-incident-response-plan
task_id: data-privacy-cybersecurity/identify-issues-in-incident-response-plan
description: Incident response plan issue memos for healthcare organisations fail when the agent does not cross-reference the incident response plan against supporting materials such as audit findings, insurance terms, vendor agreements, and compliance memoranda to identify structural gaps between the plan's written requirements and the organisation's actual capabilities.
activates_for: [planner, solver, checker]
---

# Skill: Identify Legal, Regulatory, and Operational Deficiencies in Healthcare Organization's Data Breach Incident Response Plan

## 2. Failure modes the skill is correcting

- Agent reviews the incident response plan in the abstract instead of testing it against the full document set, so the memo misses gaps that are already exposed by the organization's own audit, compliance, insurance, and vendor materials.
- Agent treats a documented audit deficiency as merely suggestive; if the audit has already identified a plan failure, the memo must treat it as a confirmed issue and place it near the top of the severity stack.
- Agent fails to reconcile the plan's response steps with external notification, preservation, cooperation, escalation, and reporting obligations found in supporting materials.
- Agent overlooks role and authority mismatches: the plan may assign duties to titles that do not exist, to teams that are under-resourced, or to personnel who cannot lawfully or practically perform the assigned function.
- Agent writes a descriptive summary instead of an issue memorandum, omitting severity, source, consequence, and remediation for each deficiency.
- Agent gives generalized privacy/security observations without anchoring each issue in the controlling legal or contractual standard that makes it a deficiency.

## 3. Legal frameworks / domain conventions that apply

- Healthcare privacy and security requirements: assess whether the plan implements incident identification, containment, escalation, investigation, documentation, and remediation processes expected under healthcare privacy/security rules.
- Breach-notification framework: assess whether the plan includes a workable decision path for determining reportability, including the required risk-assessment logic and notification timing.
- Incident-response best practices: assess completeness across preparation, detection, analysis, containment, eradication, recovery, and post-incident review.
- Contractual incident-response duties: vendor, service-provider, and other operational agreements may require prompt notice, cooperation, forensic support, evidence preservation, or coordination; the plan must mirror those duties.
- Cyber-insurance coordination: insurance terms may require notice to the carrier, use of approved responders, pre-approval for spending, and claim-ready documentation; the plan should integrate those steps.
- Organizational governance: the plan must map cleanly to the actual chain of command, escalation authority, and available operational resources described in the organizational materials.
- If the source set identifies a specific statute, regulation, rule, or contractual clause, cite that authority by name and section in the memo and do not generalize it away.

## 4. Analytical scaffolds

- Read the incident response plan end-to-end and map it to the standard incident lifecycle: preparation, detection, triage, classification, containment, notification, recovery, and post-incident review.
- Read every supporting document as a constraint on the plan, not as background. An audit finding, policy memo, insurance term, or vendor clause that imposes a response obligation must be tested against the plan.
- Enumerate the source materials first: incident response plan, audit findings, compliance memoranda, insurance terms, vendor or service agreements, organizational chart, role descriptions, and any incident-specific addenda. If only one document category exists, say so expressly.
- For each deficiency, identify: the applicable standard or obligation; the exact plan gap; the evidentiary source; the severity; the operational, regulatory, or contractual consequence; and the remediation step.
- Treat documents as potentially interacting. Where one source imposes a shorter timeline, stricter notice trigger, different approval path, or special preservation duty, flag the mismatch as a deficiency rather than harmonizing it silently.
- Do not rely on generic percentages, counts, or arithmetic unless they are expressly supplied in the source materials and are needed to describe scale.

## 5. Vertical / structural / temporal relationships

- Highest-authority sources control lower-authority ones: a documented audit finding and a specific contractual or regulatory requirement should outrank a generalized policy statement.
- Time-sensitive obligations matter: if one source requires notice, escalation, preservation, or carrier contact before another step, the plan must reflect that sequence.
- Role architecture matters: if the plan assigns tasks vertically across security, legal, clinical, compliance, and operations teams, verify that each handoff is feasible and that no role is duplicated, omitted, or left without an owner.
- Where the plan spans multiple business units or locations, test whether escalation, local response, and enterprise-level governance are aligned rather than assuming a single flat response path.
- If the materials include multiple incident types or multiple categories of data, analyze each relevant category separately before combining them into enterprise conclusions.

## 6. Output structure conventions

- Produce a formal issue memorandum, not a narrative summary.
- Define an explicit ordinal severity scale at the top and apply it consistently to every issue, such as Critical, High, Medium, and Low.
- Organize the memorandum by deficiency category in conventional legal form, such as legal/regulatory, operational/procedural, and structural/organizational, with items ordered by severity within each category.
- For each issue, include: severity; controlling authority or requirement; concise description of the plan gap; source document(s); why the gap matters; and a targeted remediation recommendation.
- Close each issue by stating the downstream consequence for the organization, such as regulatory exposure, delayed containment, impaired notice, contract breach risk, claim prejudice, or operational disruption.
- Every recommendation should use an imperative verb, identify the responsible role or owner if the source materials provide one, and tie the action to a near-term implementation point or regulatory/operational milestone.
- Include a remediation roadmap that separates immediate fixes for the highest-severity items from next-cycle policy and governance updates for lower-severity items.
- Use document names and authority names as they appear in the source materials when available; do not invent specific subsidiaries, agreements, counterparties, or outside advisors.
- Keep the filename and deliverable instruction exact: `irp-issue-memorandum.docx`.
