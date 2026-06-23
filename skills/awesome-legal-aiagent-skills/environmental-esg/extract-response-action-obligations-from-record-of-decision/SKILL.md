---
name: extract-response-action-obligations-from-record-of-decision
task_id: environmental-esg/extract-response-action-obligations-from-record-of-decision
description: Guides construction of a response action obligation matrix by extracting all remedial actions required by a decision document, distinguishing who is bound by each obligation and by what theory of obligation, and identifying conflicts with planned redevelopment.
activates_for: [planner, solver, checker]
---

# Skill: Extract Response Action Obligations from Record of Decision — Compliance Obligation Matrix

## 1. Subject-matter triage
- Treat the record of decision and any incorporated or accompanying materials as the primary sources of obligation.
- If more than one decision document, order, transmittal, or prior agreement is in the file, inventory each first and analyze them in sequence rather than merging them implicitly.
- Separate obligations that run with the site from obligations that arise only from a prior party status, successor position, or earlier administrative commitment.
- If redevelopment is proposed, treat land-use, excavation, construction phasing, and long-term property use as distinct from cleanup obligations until each is matched against the remedy.

## 2. Failure modes the skill is correcting
- Extracting remedy terms without identifying which provisions are actually binding obligations versus background findings or assumptions.
- Collapsing direct owner obligations, inherited obligations, and obligations imposed by earlier orders into one bucket.
- Missing monitoring, reporting, deed restriction, and operation-and-maintenance duties because they are not framed as one-time cleanup work.
- Overlooking that redevelopment can conflict with cleanup assumptions, activity-and-use limitations, or institutional controls.
- Reading the decision document in isolation when a prior order, consent agreement, or transmittal letter may add, preserve, or clarify duties.
- Failing to map obligations to timing, trigger, recurrence, or duration, which makes compliance planning incomplete.

## 3. Legal frameworks / domain conventions that apply
- Use the remedial decision framework in the source materials: remedy selection, cleanup objectives, performance standards, institutional controls, monitoring, and long-term protectiveness.
- Distinguish direct liability from successor or transferee liability, and distinguish both from obligations created by a prior order or agreement.
- Treat institutional controls as enforceable land-use or access restrictions that may outlast active construction.
- Treat operation-and-maintenance, monitoring, reporting, and certification duties as continuing compliance obligations, not merely implementation details.
- Treat redevelopment conflicts as a compatibility question: whether the planned use, grading, excavation, utilities, or occupancy is consistent with the assumed land use and restrictions in the cleanup record.
- Cite the controlling authority as identified in the source set; where the source set uses statutory or regulatory labels, preserve those citations in the matrix.

## 4. Analytical scaffolds
- Read the decision document, then any prior order, consent agreement, transmittal letter, or supporting exhibit; identify the site area, operable unit, remedy components, and any stated cleanup standards.
- Extract every sentence or clause that imposes a duty, condition, prohibition, deadline, reporting step, approval requirement, or maintenance obligation.
- For each extracted obligation, determine:
  - whether it is a construction, operational, monitoring, reporting, institutional-control, or approval obligation;
  - whether it binds the current owner directly, indirectly through successor/transferee status, or through a prior agreement;
  - whether it is one-time, recurring, condition-triggered, or continuing.
- Do not stop at the remedy description; separate the obligation from the background explanation, and separate mandatory language from aspirational or illustrative language.
- If the source materials contain multiple obligations tied to different phases, evaluate each phase separately and preserve sequencing.
- For each obligation, test the redevelopment plan against the restriction or performance assumption it depends on:
  - Does the plan require excavation, demolition, dewatering, grading, occupancy, or use inconsistent with the remedy?
  - Does it interfere with monitoring wells, treatment systems, access rights, deed restrictions, or long-term inspections?
  - Does it require agency approval, amendment, reanalysis, or an alternative control before proceeding?
- For each conflict found, state the conflict, the governing requirement, the path to resolution, and any sequencing constraint created by the remedy.
- Surface any obligation that appears to predate the decision document and note whether it survives, is superseded, or operates in parallel.

## 5. Vertical / structural / temporal relationships
- Track the sequence of prior order → investigation/feasibility work → decision document → implementation → operation and maintenance.
- Track remedy timing against redevelopment timing, especially where construction or occupancy may have to wait for completion of active remediation or agency approval.
- Track long-term controls separately from active construction tasks so that permanent restrictions are not lost in the implementation phase.
- If a transmittal or explanatory letter modifies the practical reading of the decision document, extract those clarifications separately and tie them back to the affected obligation.

## 6. Output structure conventions
- Produce a compliance obligation matrix with one row per obligation.
- Use conventional columns such as: obligation category, obligation text summary, source document and section, binding party basis, liability theory, timing/frequency, responsible role, redevelopment conflict, and resolution path.
- Group rows by obligation type, then by phase or recurrence where helpful.
- Include a separate redevelopment-conflicts section that identifies each conflict, the governing restriction, and the required approval or amendment path.
- Include a concise assumptions-and-exclusions note if the source set is incomplete or if a provision is ambiguous.
- Keep the language operative and extractive: summarize what must be done, who must do it, when it must be done, and what prevents or conditions redevelopment.
