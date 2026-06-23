---
name: draft-data-breach-remediation-plan-memorandum
task_id: data-privacy-cybersecurity/draft-data-breach-remediation-plan-memorandum
description: Board-level breach remediation memos fail when the agent does not integrate the forensic investigation findings, prior risk assessment gaps, and applicable regulatory obligations into a sequenced remediation plan with specific owners, timelines, and evidence of completion.
activates_for: [planner, solver, checker]
---

# Skill: Draft Data Breach Remediation Plan Memorandum for Telehealth Platform

## 1. Subject-matter triage (only if applicable)

- Identify the incident perimeter first: affected systems, data categories, user populations, vendors, jurisdictions, and any payment-data or special-category data implications.
- Separate confirmed facts from assumptions; do not extrapolate beyond the forensic record when describing scope, root cause, or exposed data.
- If multiple regulatory regimes apply, enumerate them explicitly and assess each one on its own terms before synthesizing a board recommendation.
- If one framework is plainly out of scope, say so affirmatively and briefly explain why.

## 2. Failure modes the skill is correcting

- Generic remediation language that is not tied to the forensic findings, the prior risk assessment, or the security policy gap that enabled the incident.
- Failure to use the prior risk assessment as evidence of pre-existing known vulnerabilities and remediation delay.
- Omission of third-party, contract, or business-associate duties that affect notice, containment, remediation, or shared responsibility.
- Collapsing distinct privacy, security, and sector-specific obligations into one undifferentiated compliance response.
- Presenting a list of fixes without sequencing them into containment, stabilization, medium-term controls, and structural improvements.
- Stating that remediation will occur without assigning accountable owners, deadlines, and proof-of-completion artifacts.
- Writing for engineers only; the memorandum must be board-level, plain-English, and decision-oriented.

## 3. Legal frameworks / domain conventions that apply

- Post-breach remediation should be framed against the controlling privacy and security duties that were triggered by the incident, including notice, containment, mitigation, documentation, and ongoing safeguards.
- If a notification obligation is implicated, identify the governing statute, regulation, or guidance by name and section or part, and distinguish consumer notice, regulator notice, and any special sector filing.
- If payment-data controls are implicated, identify the relevant standard or assessment regime and the control area affected.
- If vendor or business-associate relationships are implicated, identify the contractual or regulatory source of the third party’s obligations and how the incident changes those duties.
- If internal policy or public-facing privacy disclosures promised stronger controls than were actually implemented, treat that gap as a remediation driver and a governance issue.
- Use recognized recovery and governance conventions to organize the plan: stabilize operations, close the root cause, harden controls, validate with testing, and document completion for auditability.
- Every legal or regulatory conclusion should be anchored to a named authority, source document, or policy provision rather than stated as a bare conclusion.

## 4. Analytical scaffolds

- Extract, in this order: confirmed incident summary, attack path, chronology, data categories involved, current containment status, root causes, and control failures.
- Read the prior risk assessment for any identified weaknesses that match the attack path; if a known gap was not remediated, treat that as an aggravating factor in the remediation narrative.
- Compare the incident facts against the information-security policy, privacy notice, incident-response plan, and vendor agreements to identify where practice diverged from stated obligations.
- Identify which actions are immediate containment, which are technical remediation, which are policy/program changes, and which are structural governance improvements.
- For each action, specify the accountable owner, deadline or milestone, implementation dependency, and evidence of completion.
- Use a board-friendly action table and keep each row outcome-oriented: what will change, who owns it, when it will happen, and how the board can verify it.
- If the source materials mention multiple affected entities, data sets, environments, or jurisdictions, list them before analysis and map each action to the relevant item rather than using one generalized plan.
- Include only facts supported by the source set; where information is missing, flag the gap and propose a verification step.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Reconcile the incident timeline with notice and remediation timing: what happened first, what has already been done, what must happen next, and what dependencies control the sequence.
- Distinguish vertical responsibility layers: board oversight, executive sponsorship, security operations, privacy/compliance, legal, vendor management, and any external forensic or technical support.
- If the breach touched multiple environments or business lines, state which remediation actions are global and which are environment-specific.
- If a third party contributed to the incident or holds relevant records, include the obligation to coordinate, demand assurances, or obtain attestations before closing an action.
- Treat completion evidence as a temporal endpoint: policy updates, logs, scan results, training records, signed attestations, testing results, or regulator filings should be matched to the action they prove.

## 6. Output structure conventions

- Write a board-level memorandum in conventional memorandum form with a brief executive summary, a concise incident background, a sequenced remediation plan, a regulatory/compliance status section, and a short closing recommendation.
- Organize the main plan as an action table with columns such as Action, Owner, Deadline, Status, Evidence of Completion, and Notes.
- Use clear, ordinal severity labels where discussing gaps or risks, and define the scale once if you use one.
- Make each action specific, measurable, and tied to the source materials; avoid vague verbs like “improve” or “enhance” unless paired with a concrete deliverable.
- Include a final Recommended Actions block that uses imperative verbs, names the responsible role, and ties each item to a deadline or regulatory milestone.
- Where the source materials identify controlling legal or regulatory authority, cite it by name and section or part in the body of the memorandum.
- Keep the deliverable focused on the memorandum itself; do not add unrelated analysis, and do not invent appendices unless they contain source-backed implementation detail.
- The filename must match the instruction exactly: `remediation-plan-memorandum.docx`.
