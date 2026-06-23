---
name: draft-supervisory-authority-breach-notification
task_id: data-privacy-cybersecurity/draft-supervisory-authority-breach-notification
description: Draft a supervisory-authority breach notification and a privileged internal memo by identifying the correct controller role, the applicable notification deadline, the required factual content, and the strategic disclosure risks created by the incident record.
activates_for: [planner, solver, checker]
---

# Skill: Draft GDPR Article 33 Breach Notification to Bavarian Data Protection Authority (BayLDA) for Ransomware Incident Involving Health Data

## 1. Subject-matter triage
- Identify the notifying entity, the competent authority, and whether the matter is a personal data breach, not merely an IT outage.
- Confirm whether the incident involves special-category health data and whether any processors, joint controllers, or affiliated entities affect the notification posture.
- Establish the awareness date first; all deadline analysis runs from that date, not from the later completion of forensics.

## 2. Failure modes the skill is correcting
- Drafting the notification before determining who is legally responsible to notify and on what basis.
- Treating the incident as purely technical and omitting the GDPR harm analysis tied to encrypted, accessed, or exfiltrated data.
- Overstating certainty about source, scope, or exfiltration when the forensic record is incomplete.
- Failing to align the external notice with the internal timeline, security findings, and prior risk assessments.
- Omitting a privileged memo that separately evaluates disclosure strategy, regulatory timing, and data-subject notification.
- Using casual or defensive language that creates avoidable admissions, speculation, or inconsistency across the two deliverables.

## 3. Legal frameworks / domain conventions that apply
- GDPR Article 33 governs notification of a personal data breach to the competent supervisory authority without undue delay and, where feasible, within the short-form deadline measured from awareness.
- GDPR Article 33(3) controls the minimum contents of the notification: nature of the breach, categories and approximate volume of data and individuals, likely consequences, measures taken or proposed, and later supplementation if not all facts are yet known.
- GDPR Article 33(4) permits phased supplementation where the initial notice is incomplete; identify unknowns expressly and commit to follow-up once verified.
- GDPR Article 34 governs separate data-subject notification analysis; health data, encryption status, and exfiltration indicators must be weighed in assessing whether the breach is likely to result in a high risk to rights and freedoms.
- GDPR Article 5(2), Article 24, and Article 32 frame accountability, controller responsibility, and security safeguards; use them to describe the incident response and remediation posture without conceding negligence unless the record supports it.
- GDPR Article 26 governs joint-controller arrangements; the notifying controller must be identified consistently with the allocation of responsibilities in the arrangement.
- Where special-category health data is involved, the notification should reflect the heightened sensitivity in the consequence analysis while staying factual and measured.
- Privileged internal memoranda should be drafted as candid legal advice, separate from the external filing, and should analyze regulatory risk, timing risk, and disclosure risk.

## 4. Analytical scaffolds
- Read the engagement instructions and source set first; do not draft until the documentary record is mapped.
- Build a short incident chronology: first detection, escalation, containment, forensic milestones, and the awareness date for Article 33 timing.
- Extract the incident facts in order: attack vector, systems affected, categories of data, special-category indicators, whether data was encrypted, whether exfiltration is evidenced or only suspected, and what has been restored.
- Identify the responsible controller and any joint-controller or processor relationship before deciding who signs and submits.
- Separate verified facts from inference; use measured language for what is known, probable, and still under investigation.
- Assess likely consequences using the actual data types and access indicators, not generic ransomware language.
- Describe measures taken and proposed in a way that shows active containment, remediation, and cooperation, but avoids promising outcomes that are not yet assured.
- If facts are incomplete, draft the notice as a phased filing: include current facts, flag missing items, and specify what will be supplemented.
- In the privileged memo, evaluate: notification timing, content-risk tradeoffs, data-subject notification, joint-controller implications, and whether any pre-existing security findings change the legal risk profile.
- When prior assessments or audits exist, use them to calibrate the risk narrative; do not convert them into blanket admissions.

## 5. Vertical / structural / temporal relationships
- Controller allocation comes before drafting: who is responsible under Article 26 or Article 24 affects the entire filing posture.
- Awareness date governs the notification clock; if the deadline may be tight or missed, the memo should address that timing risk directly.
- Incident chronology should be internally consistent across the authority notice, the memo, and any supporting appendices.
- Prior risk-assessment findings, if any, should be tied to the incident only to the extent the record supports a connection between the documented risk and the realized event.
- Health data heightens sensitivity; if multiple data classes are involved, distinguish the special-category portion from other affected data rather than blending them.

## 6. Output structure conventions
- Produce two distinct deliverables in the specified filenames: the external Article 33 notification and a privileged cover memo.
- Draft the notification in the style expected by the competent authority: clear heading, controller identity, contact point, incident summary, timing, data categories, likely consequences, measures taken or proposed, and follow-up items if needed.
- Keep the notification factual, concise, and non-argumentative; avoid speculation, advocacy, or legal analysis beyond what is necessary to explain the filing.
- The privileged memo should be candid and practical, and should end with a short recommended-actions section that assigns next steps to named roles and ties them to the immediate regulatory timeline.
- Cite the governing legal basis when stating legal propositions, using GDPR article references rather than conclusory shorthand.
- Do not preload scenario-specific figures; use approximate volumes only where the record supports them and leave unresolved counts for supplementation.
- Before finalizing, confirm that the notification file is the primary deliverable, is non-empty, and contains operative filing text rather than a summary of it.
