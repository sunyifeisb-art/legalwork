---
name: extract-incident-details-from-breach-notification-report
task_id: data-privacy-cybersecurity/extract-incident-details-from-breach-notification-report
description: Incident summary memos fail when the agent does not reconcile conflicting accounts across multiple incident-related documents into a single authoritative incident narrative with discrepancies explicitly flagged.
activates_for: [planner, solver, checker]
---

# Skill: Extract Incident Details from Breach Notification Report into Structured Incident Summary Memorandum

## 1. Subject-matter triage (only if applicable)

- Treat the seven-document set as a single incident record; do not draft from the breach notice alone.
- Identify each document’s role in the record: technical findings, internal chronology, draft notice, correction or update, external alert or threat context, insurance summary, and any privilege-sensitive legal communication.
- If more than one incident date, scope statement, affected population estimate, or response milestone appears, enumerate them before analysis and resolve them by source hierarchy rather than averaging.
- If the materials support privilege or work-product treatment, mark the memorandum accordingly and keep the tone factual and operational.

## 2. Failure modes the skill is correcting

- Synthesising the incident narrative from only one source instead of cross-checking all incident-related documents for conflicts on timing, scope, affected data, impacted persons, containment, and notice status.
- Treating a later clarification as a mere footnote rather than a formal update that may supersede earlier statements in the authoritative incident record.
- Ignoring external threat or alert material that may change the apparent detection date, exposure window, or control environment.
- Writing a prose narrative that buries key facts instead of a structured memo with discrete incident fields and a clear discrepancy log.
- Failing to separate confirmed facts from estimates, assumptions, and unresolved items.
- Omitting the downstream operational uses of the memo, including notification, insurance notice, litigation hold, and internal remediation tracking.

## 3. Legal frameworks / domain conventions that apply

- Incident summary memoranda should function as the authoritative internal fact record for a breach, suitable for use in regulatory notice, insurer communications, and litigation support.
- Source hierarchy matters: technical or forensic findings generally control attack vector, data access, and exfiltration facts; internal response documents control company actions and timing; draft notices are provisional; formal corrections update prior statements.
- Corrections and superseding communications should be treated as record updates, not parallel narratives.
- External threat intelligence may bear on detection timing, exposure window, and control adequacy, and should be compared with internal accounts rather than appended.
- Insurance summaries should be mined for notice obligations, reporting triggers, and deadline-sensitive fields relevant to the incident memo.
- Where the source set supports counsel-directed preparation in anticipation of litigation, note privilege status in the memorandum header.

## 4. Analytical scaffolds

- Read every document before drafting; build a source-by-source extraction table for: incident type, discovery or detection date, earliest known access date, data categories affected, estimated person count, geographic or jurisdictional spread, root cause or attack vector, containment date, remediation steps, and notice status.
- For each extracted fact, distinguish confirmed, estimated, and disputed items.
- When documents conflict, do not collapse the conflict; identify the competing versions, explain which source is more authoritative on that point, and state why.
- Treat a later correction or update as controlling over an earlier draft notice unless the source set indicates otherwise.
- Compare any external alert or threat reference against the internal timeline; if the external source predates internal detection, state the implications for the incident chronology and any notice analysis.
- Review insurance materials for reporting triggers, covered event descriptions, notice deadlines, and information needed for claim intake.
- Capture open items that remain unresolved after review, including any fact requiring follow-up from technical, privacy, security, or business stakeholders.
- If only one version of a fact appears across the record, state that affirmatively and indicate the absence of contrary source material.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Order the memo temporally from incident onset through discovery, containment, remediation, notice, and any correction or update.
- Present source conflicts immediately after the affected field so the reader can see the operative fact and the discrepancy together.
- If the incident affects multiple jurisdictions or business units, list them separately rather than blending them into one generalized scope statement.
- Keep the authoritative fact and its update in the same section where possible, using a concise “current record” formulation followed by a note on what changed.
- Distinguish between the event timeline, the notification timeline, and the remediation timeline.

## 6. Output structure conventions

- Produce a structured incident summary memorandum, not a narrative report.
- Use a conventional memo header with privilege status if applicable, date, subject or matter reference, and document purpose.
- Include discrete sections for: incident overview, source summary, chronology, confirmed facts, disputed or corrected facts, affected data and population, containment and remediation, notification and reporting posture, insurance/claims relevance, and open issues.
- Include a separate discrepancy log or conflict table identifying each material inconsistency, the competing source statements, and the operative record status.
- Separate confirmed findings from assumptions, estimates, and unknowns.
- Conclude with a concise recommended actions section that assigns next steps to the relevant role and ties each step to an urgency or deadline reflected in the source materials.
- Keep the deliverable usable as a standalone working memorandum for incident response counsel and privacy/security stakeholders.
- Name the output file exactly as instructed: `incident-summary-memo.docx`.
