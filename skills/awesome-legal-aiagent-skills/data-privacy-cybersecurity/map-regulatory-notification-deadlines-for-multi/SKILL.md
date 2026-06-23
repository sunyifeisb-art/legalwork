---
name: map-regulatory-notification-deadlines-for-multi
task_id: data-privacy-cybersecurity/map-regulatory-notification-deadlines-for-multi
description: Multi-jurisdiction breach notification deadline matrices fail when the agent does not use the jurisdiction map as the authoritative source for identifying which jurisdictions have affected individuals and does not separate overdue notifications from pending notifications.
activates_for: [planner, solver, checker]
---

# Skill: Map Regulatory Notification Deadlines for Multi-Jurisdiction Data Breach — Deadline Matrix and Action Plan

## 1. Subject-matter triage

This task is a breach-response analysis across a document set that may include a jurisdiction map, forensic materials, incident logs, privacy or processing agreements, response policies, insurer notices, and draft or sent communications. Treat the jurisdiction map as the source of truth for which jurisdictions are actually in scope, and use the forensic record to anchor discovery timing, incident scope, and affected data categories.

First enumerate the affected jurisdictions and any recipients that can be independently triggered by statute, contract, regulator guidance, or policy. If only one jurisdiction is truly in scope, state that affirmatively and explain why. Do not assume every document in the bundle creates a notice obligation.

## 2. Failure modes the skill is correcting

- The analysis imports a generic breach-notification checklist without tying each jurisdiction to the affected-person footprint shown on the jurisdiction map.
- The output mixes overdue notices with future notices and hides late items inside the general plan instead of isolating them for triage.
- The analysis treats contractual notice provisions as optional or subordinate even when the agreement creates a separate notification chain or shorter timing requirement.
- The analysis ignores the communications log or incident timeline and repeats notices that were already sent, initiated, or escalated.
- The analysis states that notice is required or late without naming the governing authority for that obligation.
- The analysis stops at diagnosis and does not convert the result into a ranked action plan with accountable roles and timing.

## 3. Legal frameworks / domain conventions that apply

- Statutory breach-notification rules: identify the governing statute, regulation, or regulator guidance that sets the trigger, recipient, content, and timing for each jurisdiction.
- Contractual notice obligations: each privacy, processing, vendor, or incident-response agreement may impose its own deadline and escalation path; map those independently from statute.
- Discovery-based timing: deadlines usually run from discovery, determination, or awareness of a breach, so the operative start date must be anchored to the best-supported event in the record.
- Missed-deadline triage: where a deadline has passed, the analysis should separate legal exposure from operational next steps and identify whether prompt late notice, explanation, remediation, or regulator engagement is warranted.
- Insurance reporting: if the policy or related notice language applies, confirm whether any reporting deadline or cooperation duty has been triggered.
- Content-specific notice rules: some regimes require special content, recipient sequencing, or follow-on notices; capture those requirements in the matrix rather than burying them in narrative.

## 4. Analytical scaffolds

- Build the scope set first: jurisdictions with affected individuals, recipient categories, contractual counterparties, insurer or broker if implicated, and any internal escalation owners.
- For each scope item, identify the controlling authority by name and section where available, and pair it with the operative deadline rule.
- Determine the discovery date from the forensic materials and reconcile it against the incident log; if the log shows an earlier awareness date, address that expressly.
- Compare each deadline against the current date and classify the item as overdue, imminent, or future.
- Review the communications log to determine whether notice has already been sent, drafted, queued, or only discussed; reflect that status in the matrix and omit completed items from the action list unless follow-up remains.
- Review agreements for any separate notice chain or downstream notification duty, and identify whether the chain was activated or missed.
- For each identified issue or missed notice, close the analysis with: the scale or timing metric from the record, the related authority or document interaction, and the practical consequence for the client.
- Assign a uniform ordinal severity to each overdue or deficient item so the reader can triage by urgency without ambiguity.

## 5. Vertical / structural / temporal relationships

Use a vertical structure that distinguishes what has happened, what must happen now, and what remains contingent.

- Past: discovery date, awareness date, any notice already sent, and any contractual or insurer reporting already initiated.
- Present: overdue notices, immediate escalation items, and triage decisions needed now.
- Future: pending statutory, contractual, or policy notices arranged by deadline order.

Where multiple jurisdictions or recipients are in play, do not collapse them into one row; each distinct deadline-trigger-recipient combination should stand on its own so timing, status, and responsibility remain visible. If one notice satisfies multiple obligations, say so only when the authority or contract chain supports that conclusion.

## 6. Output structure conventions

- Write the deliverable as a deadline matrix and action plan document, not as a generic memo.
- Open with a short executive summary that states the incident posture, whether any deadlines are already missed, and the overall escalation posture.
- Include a deadline matrix with one row per jurisdiction, regulator, recipient, or contractual notice obligation. Use conventional columns such as scope item, governing authority, trigger date, deadline, current status, required content or escalation, and responsible owner.
- Include a separate missed-deadline triage section for overdue items. For each overdue item, state the severity, the governing authority, why the notice is late, and the recommended remediation approach.
- Include a prioritized action plan for pending items in deadline order, with accountable role and timing anchor for each action.
- Include a policy gap analysis that identifies deficiencies in the incident response plan, escalation protocol, communication workflow, or recordkeeping process exposed by the incident.
- End with a Recommended Actions block. Each recommendation should use an imperative verb, identify the responsible role, and tie the action to a deadline or immediate regulatory milestone.
- Cite the controlling authority for every legal proposition relied on in the analysis, using the statute, regulation, rule, guidance, or other authority name and section when available.
- Keep the wording operational and exact; do not pad with generic discussion.
