---
name: review-incident-response-plan-against-regulatory-requirements-and-industry-standards
task_id: data-privacy-cybersecurity/review-incident-response-plan-against-regulatory-requirements-and-industry-standards
description: IRP review memos fail when the agent assesses the updated plan against general regulatory standards without using prior incident materials as evidence of specific gaps the new plan must close, and without assessing whether governance materials and audit findings impose additional requirements the plan must satisfy.
activates_for: [planner, solver, checker]
---

# Skill: Review Incident Response Plan Against Regulatory Requirements and Industry Standards — Issue Identification Memorandum

## 2. Failure modes the skill is correcting

- The review stays abstract and misses the concrete deficiencies documented in prior incident materials; the updated plan must be tested against the earlier failure pattern, not just against generic best practice.
- The review ignores governance materials that impose specific escalation, classification, reporting, or approval steps; those materials can create binding operational requirements even if the plan is otherwise industry-conforming.
- The review treats audit findings as unrelated to incident response; deficiencies in logging, detection, access control, change control, or monitoring can make the plan unworkable or delay response.
- The review fails to calibrate notification, classification, and response obligations to the actual data processed and the actual incident pathways reflected in the source set.
- The output describes gaps without closing them into a severity-ranked issue list with a concrete remediation path.

## 3. Legal frameworks / domain conventions that apply

- Privacy and security incident response requirements govern how the organization detects, contains, investigates, remediates, and documents security events involving personal or regulated data.
- Applicable notification rules may impose timing, content, decision-making, and escalation obligations for authority notice and affected-person notice.
- Industry incident-handling guidance provides the baseline structure for a defensible incident response program.
- Governance requirements in board, management, or policy materials may mandate incident classification thresholds, escalation triggers, committee reporting, or executive approval steps.
- Cyber-insurance obligations may require prompt notice, insurer coordination, vendor restrictions, or pre-approval of certain response actions.
- Prior incident materials are the factual benchmark for whether the updated plan actually closes the known gaps from the earlier event.
- Audit findings are relevant where they expose operational weaknesses that would interfere with detection, containment, preservation, recovery, or reporting.
- Cited legal and regulatory propositions should be anchored to the controlling authority named in the source set; if the source set does not specify a citation, use the governing statute, regulation, rule, or recognized standards framework applicable to the data and incident type.

## 4. Analytical scaffolds

- Read the prior incident materials first and extract each documented failure, delay, omission, or misstep that the updated plan is supposed to fix.
- Read the governance materials second and extract every incident-response requirement that is imposed from above the operational plan.
- Review the data-processing materials to identify the relevant data categories, business functions, and incident pathways that affect classification and notice obligations.
- Review the audit findings to determine whether the plan assumes controls or capabilities that the organization does not yet have.
- Then test the updated plan against, in sequence: the prior incident record, the governance requirements, the data-processing profile, the audit findings, and the applicable privacy/security and notification frameworks.
- Treat each distinct source-derived requirement as a separate check; do not collapse multiple obligations into one generic adequacy statement.
- For each issue, state: the plan provision or omission, the controlling requirement, why the source set shows a mismatch, the operational or regulatory consequence, and the remedy needed to close the gap.
- Assign a uniform ordinal severity label to every issue and keep the scale consistent throughout the memo.

## 5. Vertical / structural / temporal relationships (only if applicable)

- When the source set contains more than one incident, event, business line, data flow, regulator notice trigger, or response owner, enumerate the full set before analyzing so each item is reviewed separately.
- Distinguish present-state controls from future-state commitments in the plan; a promise to “improve” is not equivalent to an implemented capability.
- Track escalation and notification timing in relation to the triggering event, internal triage, preservation steps, insurer notice, and external reporting windows.
- Where the same process is addressed in multiple documents, identify which requirement is controlling and whether the plan harmonizes or conflicts across sources.
- If the materials suggest only one incident or one relevant pathway, state that expressly and explain why no parallel track is being analyzed.

## 6. Output structure conventions

- Produce a severity-ranked issue identification memorandum, ordered from highest to lowest severity.
- Define the severity scale once at the top, using an ordinal set such as Critical / High / Medium / Low, and apply it consistently to every issue.
- Open with a short executive summary covering overall adequacy, whether the plan closes the prior incident gaps, and the likely compliance posture.
- For each issue, include the incident response plan section or topic, the controlling authority or source requirement, the gap, the severity, and the recommended fix.
- Each issue should close with three elements: the relevant source-based scale or trigger, the interaction with another document or requirement, and the downstream consequence if the gap remains.
- Include a final Recommended Actions block with imperative steps, the responsible role identified from the source set, and a timing anchor tied to the relevant incident-response or regulatory milestone.
- Use industry-conventional memo headings rather than reproducing any hidden checklist or rubric language.
- Name the deliverable file exactly as instructed in the task.
