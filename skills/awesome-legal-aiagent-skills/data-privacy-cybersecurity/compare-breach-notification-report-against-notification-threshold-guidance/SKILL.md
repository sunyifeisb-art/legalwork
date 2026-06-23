---
name: compare-breach-notification-report-against-notification-threshold-guidance
task_id: data-privacy-cybersecurity/compare-breach-notification-report-against-notification-threshold-guidance
description: Gap analyses for breach notification matters should use the internal threshold guidance as the primary benchmark, compare the draft report against the underlying forensic findings and incident timeline, and identify any omissions or inconsistencies affecting notification thresholds, timing, and content.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis Memorandum: Breach Notification Report vs. Internal Threshold Guidance for Healthcare Data Breach

## 2. Failure modes the skill is correcting

- The draft report is treated as the factual record without testing it against the forensic findings, incident chronology, and any supporting references.
- Internal threshold guidance is treated as background instead of the operative benchmark for whether notice is required, when it must go out, and what content is mandatory.
- The analysis stays at the level of general breach-notification law and misses tighter internal standards, healthcare-specific overlays, and any business-associate notice chain.
- Timeline analysis is omitted, so deadlines are not mapped against the actual incident dates, discovery date, escalation date, and notice window.
- The memo lists issues without ranking them or connecting each gap to the threshold it misses and the practical consequence of the omission.
- Recommendations are stated abstractly rather than as concrete remedial steps tied to a role and timing trigger.

## 3. Legal frameworks / domain conventions that apply

- Apply the governing breach-notification regime identified in the source set, including the rules for trigger, content, recipients, and timing of notice.
- Use the internal threshold guidance as the primary comparison standard where it is more specific or more protective than the baseline legal rule.
- Apply any healthcare-specific privacy or security overlays for protected health information, medical records, or similarly sensitive data.
- If a vendor, processor, or other upstream service provider is involved, evaluate the notice obligations in the contract or policy chain and how upstream delay affects downstream deadlines.
- Use the forensic report as the factual foundation for data types affected, access or exfiltration mechanism, scope, duration, mitigation, and likelihood of misuse.
- Cite the controlling legal or policy authority for each substantive proposition relied on; do not state conclusions without naming the rule, section, or policy basis.

## 4. Analytical scaffolds

- Read the internal threshold guidance first and extract each operative requirement, threshold, deadline, and content element.
- Read the forensic findings second and isolate the facts that bear on threshold, including data categories, sensitivity, volume, affected population, access path, containment, and likelihood of misuse.
- Read the draft report last and compare it point by point against the guidance and forensic record.
- For each issue, answer three questions:
  - What threshold, deadline, or content requirement is implicated?
  - What source fact, timeline point, or cross-reference shows the mismatch?
  - What operational, regulatory, or litigation consequence follows if the gap remains?
- Where multiple affected groups, reporting triggers, or notice deadlines exist, enumerate them explicitly and analyze each one separately rather than collapsing them into a single pass.
- Distinguish between a missing fact, an unsupported inference, and a statement that conflicts with the source record; treat each as a separate drafting defect.
- Assign a uniform ordinal severity rating to every finding and calibrate it to the practical effect of the gap.
- End each issue with a concrete fix that identifies who should act and when the action should occur.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Map the incident timeline against each notice deadline, including discovery, confirmation, escalation, internal review, external notice, and any regulator or consumer notice windows.
- If the matter involves more than one affected entity, compare their notice obligations in sequence and note any dependency between upstream and downstream notice.
- If multiple jurisdictions are implicated, treat each jurisdictional rule set as a separate branch of analysis and do not merge different deadlines or content requirements.
- Track how a later forensic development changes the earlier risk assessment, threshold determination, or drafting position.
- Where the draft report cites a conclusion unsupported by the chronology, flag the mismatch as a temporal defect rather than only a content defect.

## 6. Output structure conventions

- Prepare a prioritized gap analysis memorandum in conventional legal-memo form, with a short executive summary followed by issue-by-issue analysis.
- Define the severity scale once at the outset and apply it consistently to every issue.
- Organize the body by practical categories: risk assessment sufficiency, deadline compliance, required notice content, upstream or vendor notice, and jurisdiction-specific overlays.
- For each issue, include: controlling authority or guidance point, the gap, the severity rating, the source cross-reference, the consequence of the gap, and the recommended remediation.
- Keep recommendations imperative, assign them to the relevant role reflected in the source materials, and tie them to a concrete deadline or urgency trigger.
- When source documents support it, distinguish between outright omission, partial compliance, and affirmative inconsistency.
- Use the filename exactly as instructed: `gap-analysis-memorandum.docx`.
