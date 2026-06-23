---
name: hipaa-compliance-program-gap-analysis
task_id: corporate-governance/analyze-compliance-program-gaps
description: Gap analysis of a healthcare organization’s privacy and security compliance program, identifying deficiencies in administrative safeguards, breach notification procedures, and vendor oversight against applicable healthcare privacy and security requirements.
activates_for: [planner, solver, checker]
---

# Skill: Healthcare Data Privacy Compliance Program Gap Analysis

## 2. Failure modes the skill is correcting

- Treating a privacy-and-security gap analysis as a broad checklist rather than a document-by-document comparison against the governing requirements and the organization’s own policies
- Missing how one deficiency can cascade into others, especially where incident handling, vendor oversight, and prior audit findings overlap
- Conflating an incomplete process artifact with a legally sufficient determination, approval, or exception
- Overlooking governance weaknesses in compliance reporting lines, committee cadence, and independence from operational incentives
- Identifying gaps without tying each one to source citations, legal authority, downstream risk, and a concrete fix
- Collapsing multiple vendors, incidents, findings, or time periods into a single pass instead of analyzing each separately

## 3. Legal frameworks / domain conventions that apply

- HIPAA Privacy Rule: permitted uses and disclosures, minimum necessary, patient rights in limited circumstances, business associate oversight, and documentation expectations
- HIPAA Security Rule: administrative safeguards, workforce role designation, sanctions, access controls, risk analysis and risk management, and documentation for addressable implementation decisions
- Breach Notification Rule: discovery-based timing, notice thresholds, media notice where applicable, and the presumption of breach absent a documented risk assessment using the required factors
- De-identification and data-use concepts: distinguish de-identified data from a limited data set, and distinguish the agreement type required for each
- Compliance program guidance for healthcare entities: independent compliance function, appropriate reporting lines, board or committee oversight, and compensation structures that do not incentivize non-compliance
- Enforcement posture: evaluate inquiry response readiness, cooperation obligations, and exposure based on the organization’s documented posture and responsiveness
- Any legal conclusion in the memo should be anchored to the specific provision, regulation, or recognized authority supporting it

## 4. Analytical scaffolds

- Start by identifying the universe of materials in scope: policies, procedures, vendor trackers, incident logs, audit reports, governance documents, and inquiry correspondence; then analyze each category against the applicable framework
- Vendor oversight: for each vendor in the tracker, verify agreement existence, execution status, expiration, scope of services, and whether the vendor handles protected information requiring the correct agreement form
- Breach notification: for each incident, establish the discovery date, measure elapsed time to internal and external notice, assess whether notice thresholds are triggered, and confirm whether a documented risk assessment supports any non-reportable determination
- Open findings: for each unresolved audit issue, trace remediation status, supporting evidence, and any linkage to later incidents or inquiries
- Governance: review reporting structure, compensation, escalation path, and oversight cadence for the compliance function and compare them to the governing expectations
- Workforce controls: confirm that roles, sanctions, training, access authorization, and device-use policies are actually documented and operationalized
- Technology/privacy coverage: check whether policies address remote access, bring-your-own-device, tracking technologies, and other operational channels that can create compliance exposure
- Inquiry response: identify the scope of the request, deadlines, document categories sought, and coordination obligations across functions
- For each issue, state the governing authority, the document support, the practical consequence, and the recommended fix
- Assign a uniform severity label to every issue using a stated ordinal scale; reserve the highest severity for items with immediate regulatory, litigation, or operational exposure

## 5. Vertical / structural / temporal relationships

- Use a separate pass for each incident, each vendor, each unresolved finding, and each governance issue; do not blend them into a single representative example
- Where a prior audit finding overlaps with an incident or inquiry topic, treat the overlap as compounding risk because it may evidence prior knowledge and weak remediation
- Where a policy template predates current requirements, note the temporal mismatch and assess whether the template fails to capture newer obligations
- Treat discovery, notice, remediation, and oversight as a sequence: earlier failures can amplify later breach, enforcement, and governance consequences
- If only one item exists in a category, state that explicitly and explain why the analysis is limited to that item

## 6. Output structure conventions

- Draft the memorandum as an issue-based advisory memo in descending severity order, not as a generic summary
- Begin with a concise executive overview identifying the compliance posture, the most time-sensitive obligations, and the highest-risk gaps
- Define the severity scale once near the top and apply it consistently to every issue
- For each issue, include: a short title; document citation(s); controlling authority; severity; why the issue matters; related materials that interact with it; and a concrete remediation recommendation
- When the source set contains multiple vendors, incidents, or findings, present them as separate numbered issues or sub-issues rather than aggregating them
- Close with a prioritized Recommended Actions section that separates immediate, near-term, and longer-term remediation steps and assigns an owner or responsible role to each action
- If the memo references a deadline or milestone, tie the recommendation timing to that anchor; otherwise use a clearly stated urgency level linked to the compliance risk
- Use conventional memorandum formatting with headings and short analytical paragraphs; avoid bare conclusory bullet points without legal support
