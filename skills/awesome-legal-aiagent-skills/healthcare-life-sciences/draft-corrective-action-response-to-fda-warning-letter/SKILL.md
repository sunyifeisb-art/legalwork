---
name: hls-draft-fda-warning-letter-response
task_id: healthcare-life-sciences/draft-corrective-action-response-to-fda-warning-letter
description: Drafts a corrective action response to an FDA warning letter that addresses each cited observation, identifies the applicable device and facility identifiers, and lays out observation-sequenced remediation steps and timelines.
activates_for: [planner, solver, checker]
---

# Skill: Draft Corrective Action Response to FDA Warning Letter

## 1. Subject-matter triage

- Treat the warning letter as the organizing document and draft a response that tracks its observations in the same sequence and with the same issue boundaries.
- Confirm the agency office, recipient line, facility identifier, and device authorization identifiers before drafting; identifier errors weaken credibility even if the corrective narrative is sound.
- If the record includes earlier inspection correspondence or prior response drafts, treat them as part of the factual context and address any unresolved criticism directly.
- If supporting materials span CAPA records, audit plans, complaint reviews, validation documents, or management review materials, map each to the specific observation it supports before writing.

## 2. Failure modes the skill is correcting

- The response describes future improvement in general terms but does not admit the cited condition or its operational significance.
- The response fails to separate immediate containment from longer-term corrective and preventive action.
- Root cause analysis is asserted at a high level but does not identify the actual process breakdown, governance gap, or control failure that produced the cited observation.
- The letter omits remediation for adjacent quality-system functions that the agency will expect to see restored when the cited failure implicates them.
- CAPA, complaint handling, internal audit, validation, or management review references are included without dates, owners, or completion milestones.
- The response addresses some observations while skipping others, combining unrelated observations, or reordering them in a way that obscures issue-by-issue closure.
- The cover letter or body uses the wrong facility or product identifier, creating avoidable doubt about whether the response is targeted to the cited establishment and devices.
- The response narrates corrective intent but does not connect the actions to documentary support from the underlying record.
- Earlier inspection-response shortcomings are ignored even where they appear to have contributed to escalation.
- The submission reads like a summary of plans rather than a formal response that can be tracked against each cited observation.

## 3. Legal frameworks / domain conventions that apply

- Use the warning letter itself as the primary organizing authority; mirror its observation numbering, terminology, and sequence unless the letter clearly groups related points.
- For each observation, the response should: acknowledge the cited condition, identify the apparent root cause, describe immediate containment or correction, describe systemic corrective and preventive actions, and give a milestone date or schedule for completion.
- Distinguish between correction of the specific instance and correction of the underlying system so that the agency can see both short-term remediation and durable prevention.
- When a cited issue implicates complaint handling, include a retrospective review for reportability and document the scope of affected complaints and the completion target.
- When a cited issue implicates CAPA procedure adequacy, state whether the procedure is outdated or insufficient, then commit to revision, implementation, and validation or revalidation on a defined timetable.
- When a cited issue implicates internal audits, acknowledge any lapse and restore the audit program with a specific next audit date and a continuing cadence.
- When a cited issue implicates process validation, training, document control, supplier controls, or management oversight, tie the response to the governing quality-system expectation rather than using generic “improve compliance” language.
- The response should read as a regulator-facing factual submission, not as advocacy; precise acknowledgment is more persuasive than defensive language.
- If the supporting documents show a prior response was incomplete, explain what was missing and how the new submission remedies that gap.
- Cite the controlling legal and regulatory authorities for the response where you rely on them, including the relevant statutory provisions and quality-system regulations, and use the agency’s terminology consistently.
- Where the record contains a deadline triggered by receipt of the warning letter, calculate and state the response due date in the cover letter.
- If the response references corrective documents or exhibits, identify them in an attachment index so the agency can trace each action back to support.

## 4. Analytical scaffolds

1. Start by fixing the response metadata: date, recipient, subject line, establishment identifier, product or device identifiers, and response deadline.
2. Build a one-to-one map from warning-letter observation to response section; do not merge distinct findings unless the warning letter itself expressly combines them.
3. For each observation, run the same sequence:
   - acknowledge the cited finding in plain, specific terms
   - identify the proximate and underlying root cause
   - state immediate containment or correction already taken
   - state systemic corrective and preventive actions
   - assign ownership and a milestone date or schedule
   - identify documentary support or exhibit references
4. When the record implicates multiple affected records, complaints, batches, lots, devices, or periods, enumerate the affected universe before analysis and then apply the same corrective logic to each relevant subset.
5. Separate “completed,” “in progress,” and “planned” actions so the agency can tell what is already done versus what remains open.
6. If a root cause is not yet fully confirmed, say so and describe the interim containment plus the validation work needed to finalize the conclusion.
7. If CAPA, audit, complaint, validation, or training remediation is part of the response, include the specific procedure, workstream, or record type that will be revised, not just the general function.
8. If earlier correspondence was inadequate, explicitly identify the deficiency in the prior response and state how this submission corrects it.
9. End each observation section with a date-specific milestone so the agency can track closure.
10. If the source documents support it, include an attachment index keyed to the observation numbers and the corrective actions they substantiate.
11. Use controlling authority names and citation-style references for regulatory propositions rather than conclusory statements alone.

## 5. Vertical / structural / temporal relationships

- Sequence the response in the same order as the warning letter so the agency can compare the submission against its own findings without cross-referencing.
- Within each observation, preserve the vertical relationship between the specific cited violation and the broader quality-system function it reflects.
- Treat containment, correction, CAPA, and verification as temporally distinct steps; do not collapse them into a single promised fix.
- When a remediation depends on another remediation finishing first, state the dependency and the follow-on date.
- If multiple observations relate to the same system weakness, keep them in separate sections but cross-reference the shared remediation workstream so the response does not duplicate or contradict itself.
- If a supporting document addresses more than one observation, note that relationship so the agency can see how a single control change resolves multiple findings.
- Make clear whether a milestone is a completion date, implementation date, validation date, or review date.

## 6. Output structure conventions

- Draft a formal response letter with a date, address block, subject line, and reference to the warning letter.
- Include an opening paragraph that states the purpose of the response, confirms receipt, and anchors the deadline.
- Include a brief factual acknowledgment section if needed before the observation-by-observation body.
- Use separate numbered sections for each warning-letter observation, mirroring the original order.
- In each numbered section, use a consistent internal structure for acknowledgment, root cause, immediate action, systemic action, and timeline.
- Reference supporting exhibits or attachments inline where each action is discussed.
- Include a closing paragraph that reiterates commitment, summarizes the completion posture, and identifies the contact person for follow-up.
- If supporting documents are included, add an attachment index at the end keyed to exhibit names and observation numbers.
- Prepare the final deliverable as a single, polished letter suitable for export to `warning-letter-response.docx`; the letter itself is the primary deliverable and should contain the operative response text, not a mere outline or summary.
