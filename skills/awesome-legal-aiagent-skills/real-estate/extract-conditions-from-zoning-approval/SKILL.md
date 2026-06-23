---
name: extract-conditions-from-zoning-approval
task_id: real-estate/extract-conditions-from-zoning-approval
description: Guides construction of a compliance tracking matrix from a conditional use approval by systematically extracting each condition, cross-referencing against supporting materials for inconsistencies, and flagging critical-path and binary-approval risks.
activates_for: [planner, solver, checker]
---

# Skill: Extract Conditions from Zoning Approval into Compliance Tracking Matrix

## 1. Subject-matter triage

- Treat the approval packet as a document set, not a single decision: the operative conditions may be in the decision and order, incorporated by reference, clarified in correspondence, or repeated in technical submissions.
- First identify the controlling approval instrument, then gather every attached or referenced material that could alter timing, responsibility, scope, or enforceability.
- Separate true approval conditions from background recitals, applicant commitments, staff recommendations, and informational notes unless the decision expressly adopts them.
- If the packet contains more than one project phase, permit, parcel, or approval layer, enumerate each scope item first and analyze each one separately before combining them in one matrix.

## 2. Failure modes the skill is correcting

- Baseline extracts conditions from the decision without cross-referencing supporting correspondence, technical submissions, or ordinance excerpts, missing conditions imposed by reference, clarified elsewhere, or inconsistent across documents.
- Baseline presents conditions in document order rather than by compliance timing, responsible party, and risk, making the matrix unusable as a project-management tool.
- Baseline misses sequencing, seasonal, or agency-review dependencies that can make an otherwise valid condition a schedule blocker.
- Baseline omits conditions appearing only in supporting materials even when they appear to carry independent legal or administrative force.
- Baseline treats approval-threatening contingencies as ordinary conditions, obscuring binary risk.
- Baseline fails to distinguish what is expressly required from what is merely recommended, assumed, or operationally convenient.

## 3. Legal frameworks / domain conventions that apply

- Conditional use and zoning approval practice: conditions in a board, commission, or hearing officer decision are typically binding to the extent adopted in the approval record and enforceable through zoning administration.
- Incorporation by reference: language that adopts plans, exhibits, studies, or agency letters can make those materials part of the operative compliance set.
- Municipal and county zoning ordinances: the approval must be checked against the enabling ordinance and any standards governing conditions, timing, bonding, setbacks, screening, utilities, stormwater, traffic, and decommissioning.
- Renewable-energy project approvals often involve pre-construction permits, construction compliance, operational monitoring, and end-of-life obligations; extract each separately.
- Environmental and natural resources conditions may hinge on agency consultation, survey windows, permit issuance, or report submission deadlines.
- Financial assurance and decommissioning requirements must be tracked by form, amount, trigger, renewal, and release condition; if the source documents specify a formula or basis, preserve it exactly and avoid unstated arithmetic.
- Conditions tied to seasonally constrained surveys or migratory windows should be treated as schedule-sensitive and mapped to the next available compliance window.
- Historic or cultural resource triggers can function as approval contingencies; if a condition requires further clearance before work may proceed, treat that as a gating risk rather than a routine task.
- Use the authority stated in the source set where available; do not state a legal conclusion about enforceability or validity without tying it to the ordinance, approval language, or other controlling authority identified in the packet.

## 4. Analytical scaffolds

- Build the matrix one condition at a time from the controlling approval and any incorporated materials.
- For each condition, capture: condition number or identifier, source document, verbatim or faithful paraphrase, compliance category, responsible party, trigger, deadline or milestone, dependencies, current status, and risk level.
- Classify each item by phase: pre-construction, construction, operational, or post-closure/post-construction.
- If a condition appears in one source but is absent, narrower, broader, or differently worded in another, flag the discrepancy and state which version appears controlling.
- If the ordinance sets a baseline requirement that the approval adds to or departs from, flag the relationship and note whether the condition appears cumulative, clarifying, or potentially conflicting.
- Identify items that require outside action before work may begin, including agency approvals, filings, surveys, bonds, easements, permits, or certifications.
- Track status using a consistent ordinal scale defined once at the top of the deliverable, such as Critical / High / Medium / Low, and apply it uniformly.
- For each issue or inconsistency, close the analysis by stating:
  - the scale of the issue as reflected in the source set,
  - the related document or condition it interacts with,
  - the downstream consequence for schedule, cost, approval validity, or operations.
- Do not collapse multiple conditions into a single summary row unless the source clearly treats them as one obligation; if in doubt, split them.
- Preserve exact dates, deadlines, agency names, filing triggers, and condition cross-references as stated in the source materials; do not infer missing timing where the record is silent.
- If a deadline is not stated, identify the milestone or event that triggers compliance and mark timing as event-driven rather than date-driven.
- If the packet contains a binary approval trigger or if noncompliance would likely void or stall the approval, mark it as Critical.

## 5. Vertical / structural / temporal relationships

- Map prerequisites before downstream tasks: what must be submitted, approved, installed, posted, or certified before the next step can begin.
- Identify whether a condition runs from approval issuance, permit issuance, start of construction, substantial completion, or operation.
- Surface seasonal windows, agency review periods, and inspection lead times as temporal constraints, not just descriptive notes.
- When a supporting document narrows or expands the condition, record whether the relationship is additive, clarifying, or inconsistent.
- If applicant representations differ from the adopted condition, flag that mismatch and note the risk that the representation is not itself controlling.

## 6. Output structure conventions

- Open with a short executive summary stating the total number of extracted conditions, the number by phase, the number with deadline-sensitive or seasonally constrained obligations, and the count of Critical items.
- State the severity scale once near the top and use it consistently throughout.
- Present a compliance tracking matrix with one row per condition and conventional columns such as:
  - Condition / identifier
  - Source
  - Phase
  - Obligation
  - Responsible party
  - Trigger / deadline
  - Dependencies
  - Status
  - Severity
  - Cross-reference / notes
- Follow the matrix with a cross-reference analysis that identifies inconsistencies, missing conditions, overlapping requirements, and any apparent conflicts with the ordinance or supporting materials.
- Include a brief recommendations section that gives concrete next steps, assigned to the relevant role or function and tied to the operative milestone or deadline where one is stated.
- Use clear, industry-conventional labeling rather than the rubric’s internal section names.
- The deliverable filename should be `compliance-tracking-matrix.docx`.
