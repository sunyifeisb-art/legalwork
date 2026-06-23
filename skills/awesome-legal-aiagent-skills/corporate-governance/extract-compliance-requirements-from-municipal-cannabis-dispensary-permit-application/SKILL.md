---
name: extract-compliance-requirements-from-municipal-cannabis-dispensary-permit-application
task_id: corporate-governance/extract-compliance-requirements-from-municipal-cannabis-dispensary-permit-application
description: Agents extract permit requirements by reconciling the application form against the governing municipal ordinance, identifying sequencing risks from any separate state licensing process, distinguishing scoring criteria from ongoing permit conditions, and checking document-completeness requirements such as bonding documentation and professional certifications.
activates_for: [planner, solver, checker]
---

# Skill: Cannabis Dispensary Permit Compliance Requirements Matrix

## 2. Failure modes the skill is correcting

- Treating the application packet as self-contained and missing requirements imposed only by the municipal code or submission guide.
- Following the form when it conflicts with the ordinance instead of treating the ordinance as controlling authority.
- Collapsing scoring criteria, eligibility criteria, completeness items, and post-issuance conditions into one undifferentiated list.
- Missing sequencing risk where a separate approval, license, or renewal date can lapse before the municipal process is complete.
- Failing to identify technical-document defects, including missing professional certifications, bonding support, or required calculations.
- Omitting ongoing obligations that are conditions of maintaining the permit after issuance.
- Describing deficiencies without assigning priority, remedy, and timing.

## 3. Legal frameworks / domain conventions that apply

- The municipal code is the controlling source for substantive requirements; the submission guide and form are procedural aids unless they conflict with the code, in which case the code controls.
- Where the form and code diverge, identify the conflict expressly and treat the code-based rule as the operative requirement for compliance analysis.
- Requirements may arise from multiple sources: ordinance, submission guide, application form, referenced attachments, and cross-referenced municipal or state standards.
- Distinguish:
  - eligibility or threshold requirements,
  - submission-completeness requirements,
  - evaluation or scoring criteria,
  - and ongoing permit conditions.
- Ongoing conditions are not merely application items; they continue after issuance and may create enforcement, suspension, or revocation exposure if not maintained.
- Technical site, occupancy, or plan requirements should be checked against the cited municipal and fire/building methodology, not against a shorthand figure in the application.
- If a requirement depends on a professional seal, license, or certification, treat the absence of that credential as a document defect, not a substantive disagreement.
- If the packet references a separate license, registration, or authorization with its own expiration or renewal process, treat that as a distinct timeline that can affect municipal readiness.
- If the packet includes equity, mentorship, or program participation commitments, treat their timing as potentially overlapping with renewal or continued-operation obligations.

## 4. Analytical scaffolds

1. Enumerate the requirements universe before analysis:
   - form-based requirements,
   - ordinance-based requirements,
   - submission-guide requirements,
   - cross-referenced attachment requirements,
   - and ongoing post-issuance obligations.
   If only one source category is in scope, state that expressly.

2. For each requirement, capture:
   - requirement description,
   - source authority and citation,
   - whether the source is the form, the code, the guide, or a combination,
   - current status,
   - supporting document or omission,
   - remediation step,
   - timing or sequencing note.

3. Apply a uniform status scale:
   - Complete
   - In Progress
   - Gap
   - Conflict

4. Apply a uniform severity scale for each entry:
   - Critical
   - High
   - Medium
   - Low
   Use severity to indicate whether the item blocks filing, threatens eligibility, affects scoring, or creates post-issuance exposure.

5. For every legal proposition relied on, cite the controlling authority by name and section as reflected in the source set or generally recognized municipal/permitting authority.

6. For each Gap or Conflict, identify:
   - the operative rule,
   - the interacting document or requirement,
   - the consequence if not cured,
   - and the concrete remediation path.

7. Separate the matrix into at least these functional buckets:
   - filing completeness,
   - substantive eligibility,
   - evaluation/scoring considerations,
   - and continuing compliance conditions.

## 5. Vertical / structural / temporal relationships

- Map any separate approval, license, or registration against the municipal application timeline and flag lapse risk where one process may expire before the other finishes.
- Flag any renewal deadline that intersects with mentorship, equity-program, or operational compliance commitments.
- Identify whether a requirement must be satisfied before submission, before scoring, before issuance, or continuously after issuance.
- Where the packet contains a calculation-dependent item, verify that the application uses the governing methodology rather than a proxy or shorthand figure.
- Where a technical exhibit or plan is referenced, check whether a seal, signature, or certification is required at the time of filing or only upon final approval.

## 6. Output structure conventions

- Produce a requirements matrix in a conventional table format with columns for:
  - requirement,
  - governing source,
  - source type,
  - status,
  - severity,
  - evidence in packet,
  - deficiency or conflict,
  - remediation action,
  - deadline or trigger.
- Precede the matrix with a short executive summary highlighting:
  - filing blockers,
  - code/form conflicts,
  - ongoing obligations,
  - and sequencing risks.
- Include a separate section for authorities and source mapping so the reader can trace each requirement to the municipal code, submission guide, or form.
- Include a dedicated remediation section that lists actions in imperative form, assigns them to the responsible role identified in the packet where possible, and ties each action to a filing, issuance, renewal, or compliance milestone.
- If a requirement is satisfied, say why and cite the supporting exhibit or packet location; if not, state the exact missing element rather than a generic deficiency.
- Keep the matrix comprehensive but avoid duplicating the same requirement under multiple labels unless the source imposes distinct filing, evaluation, and continuing-compliance obligations.
