---
name: extract-disclosure-requirements-from-environmental-reporting-framework
task_id: environmental-esg/extract-disclosure-requirements-from-environmental-reporting-framework
description: Guides extraction of disclosure requirements from an environmental reporting framework and preparation of a gap analysis comparing those requirements against a company's current reporting practices and data.
activates_for: [planner, solver, checker]
---

# Skill: Extract Disclosure Requirements and Prepare Compliance Gap Analysis Memorandum for Environmental Reporting Framework

## 1. Subject-matter triage
- Identify the governing environmental reporting framework, the reporting population, the reporting boundary, the covered periods, and any phased-in obligations before analyzing compliance.
- Separate framework requirements that are mandatory from aspirational guidance, and separate entity-level obligations from facility-, asset-, or project-level obligations.
- If the source set contains multiple reporting periods, entities, facilities, or disclosure regimes, enumerate them explicitly first and then analyze each against the applicable requirements.
- If the framework is not clearly applicable to the company or the company’s reporting perimeter, say so and explain the threshold or scoping issue.

## 2. Failure modes the skill is correcting
- Describing the framework at a high level without extracting each discrete disclosure obligation and testing it against current reporting.
- Treating principles, objectives, or narrative sustainability discussion as a substitute for itemized regulatory requirements.
- Missing boundary, methodology, or data-availability issues that prevent a required disclosure from being produced accurately or at the required granularity.
- Omitting assurance, verification, or attestation requirements where the framework requires them.
- Failing to distinguish present compliance from future compliance under phased implementation or transition periods.
- Stating that a gap exists without identifying the source requirement, the current state, the risk created, and the remediation path.

## 3. Legal frameworks / domain conventions that apply
- Use the framework’s own text as the primary authority for scope, disclosure categories, methodologies, timelines, verification, and exemption rules.
- Treat reporting thresholds, applicability criteria, boundary definitions, and measurement conventions as controlling before comparing current reporting documents.
- Where the framework references emissions, resource use, impact metrics, or other environmental indicators, follow the specified methodology rather than substituting generic sustainability practice.
- Distinguish between required disclosures, required calculations, required narrative explanation, and required recordkeeping or internal control processes.
- For assurance or verification obligations, identify the required assurance standard, the permitted provider qualifications, the engagement scope, and the timing of completion relative to submission.
- For phase-ins and transition relief, determine which obligations are live now and which are deferred, and analyze only the obligations applicable to the current reporting cycle unless future obligations are expressly requested.
- Where other reporting regimes appear in the source set, test overlap carefully; one framework may support another, but equivalence is not presumed unless the controlling text says so.

## 4. Analytical scaffolds
- Extract each disclosure requirement as a distinct obligation with its governing citation, then group obligations only after they have been individually identified.
- For each obligation, assess:
  - whether the current documents disclose it fully, partially, or not at all;
  - whether the underlying data exists at the required level of detail;
  - whether the methodology, boundary, or assumptions match the framework;
  - whether assurance, review, or verification arrangements satisfy the requirement;
  - whether timing and phase-in status make the obligation currently active.
- Use a uniform severity scale at the top of the memo and apply it consistently to every gap entry.
- For each issue, state the controlling framework provision, the current reporting position, the deficiency, the practical consequence, and the recommended fix.
- If the source documents do not provide enough information to determine compliance, flag the item as indeterminate rather than assuming compliance.
- When comparing against reporting documents, test the exact required disclosure elements, not just whether a topic is mentioned somewhere in narrative form.
- Where a requirement depends on multiple inputs, check each input separately and identify the weakest link causing the gap.
- Prioritize gaps that affect current compliance, external reporting deadlines, assurance readiness, or the ability to compile future-period disclosures.

## 5. Vertical / structural / temporal relationships
- Compare the reporting boundary in the framework to the company boundary used in the current documents; flag any mismatch between consolidated reporting and required facility- or operational-unit reporting.
- If the framework requires historical trend data or baseline-year comparison, confirm whether the current documents preserve the necessary prior-period data and whether it is consistent across periods.
- If the framework requires third-party assurance or verification before submission, assess whether the current engagement can be completed within the filing timetable.
- If multiple facilities, assets, or business units are in scope, analyze them as separate reporting units when the framework requires disaggregated disclosure.
- If current data is aggregated but the framework requires disaggregation, identify the missing source systems, control points, or allocation methods needed to bridge the gap.
- Where one reporting document feeds another, trace the dependency chain so the memo reflects the operational impact of any missing upstream data.

## 6. Output structure conventions
- Write a compliance gap analysis memorandum in conventional legal-advisory form, with an executive summary, a requirements matrix, category-by-category gap analysis, data and control assessment, assurance/verification assessment, and a remediation roadmap.
- Use a clear ordinal severity field for every gap entry, with the scale defined once at the outset.
- In the requirements matrix, include for each item: framework citation, requirement description, current status, gap summary, severity, and remediation priority.
- In the gap analysis sections, keep each entry tied to one requirement and avoid blending multiple deficiencies into a single undifferentiated paragraph.
- Conclude with a Recommended Actions block that assigns each action to a responsible role and ties it to a deadline, milestone, or urgency anchor drawn from the source materials or reporting calendar.
- Use the task-specified filename exactly for the final deliverable: `compliance-gap-analysis-memo.docx`.
