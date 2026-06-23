---
name: identify-compliance-issues-commercial-property-filing
task_id: insurance/identify-compliance-issues-in-commercial-property-insurance-policy-form-filing
description: Agents reviewing a commercial property insurance policy form filing identify regulatory issues, verify calculations independently, and check for required disclosures and form consistency without assuming the filing is compliant.
activates_for: [planner, solver, checker]
---

# Skill: Identify Compliance Issues in Commercial Property Insurance Policy Form Filing — Regulatory Issue Memorandum

## 1. Subject-matter triage (only if applicable)

- Confirm the submission is a commercial property policy form filing, and separate the form, endorsements, transmittal materials, rate support, and any explanatory exhibits before analyzing compliance.
- If multiple forms, editions, jurisdictions, or effective dates are present, enumerate them first and analyze each independently; do not assume a single issue applies across the package.
- Treat the memorandum as an issue-spotting and compliance-review deliverable, not a coverage opinion: focus on filing objection risk, required disclosures, internal consistency, and regulator-facing clarity.

## 2. Failure modes the skill is correcting

- Compliance gaps are described abstractly instead of being tied to the specific filing provision, the governing requirement, the observed deviation, and a practical fix.
- Issues are analyzed without first identifying the relevant form, endorsement, rate support, or transmittal item, which obscures where the defect arises.
- Calculations and cross-document references are accepted at face value instead of being checked independently against the filing package.
- Regulatory concerns are stated without an explicit severity label, making it harder to prioritize edits before submission.
- The memorandum identifies a defect but stops short of a concrete corrective action, responsible owner, or timing recommendation.
- Legal conclusions are stated without naming the controlling statute, regulation, bulletin, or standard that supports the objection risk.

## 3. Legal frameworks / domain conventions that apply

- Suit limitations period: identify the policy language governing time to sue, compare it to the applicable insurance-law minimum in the relevant jurisdiction, and flag any shorter contractual period for correction under the governing statute or regulation.
- Anti-concurrent causation clause scrutiny: review broadly worded exclusion language that turns on multiple causes, compare it to any applicable regulator guidance, and assess whether clarification or narrowing is needed.
- Undefined communicable disease term: if an exclusion or limitation uses a material term that is not defined, treat the ambiguity as a filing issue and consider adding a definition or clarifying scope under ordinary insurance drafting conventions.
- Deductible consistency between form and rate filing: compare deductible structure stated in the policy form with the structure assumed in the rate filing, and flag any mismatch that could create filing inconsistency or actuarial support issues.
- Credibility weighting arithmetic: independently recalculate any credibility-weighted loss development or similar actuarial support and compare the result to the filing.
- Flood disclosure: check whether the form includes any required disclosure addressing flood coverage availability or related notice obligations for the relevant market, as required by applicable insurance law or regulator guidance.
- Terrorism disclosure: check whether the form includes any required disclosure addressing terrorism coverage, premium disclosure, and the policyholder’s right to reject that coverage where applicable.
- Appraisal umpire selection: review whether the appraisal provision provides a neutral mechanism for selecting an umpire when appraisers disagree, and whether the language is sufficiently balanced under accepted property-policy drafting practice.
- ACV versus replacement cost valuation: identify whether the form clearly distinguishes when actual cash value applies and when replacement cost applies, consistent with property insurance valuation conventions and any applicable filing standards.
- Cancellation and nonrenewal provisions: compare notice periods and permissible grounds in the form against the applicable insurance-law requirements in the governing jurisdiction and any approved-form constraints.
- Filing type characterization: verify that the transmittal or filing description accurately characterizes the submission so the regulator receives the package under the correct filing category.

## 4. Analytical scaffolds

1. Identify the governing jurisdiction, the filing type, and the document set; note any items missing from the package that are necessary to evaluate compliance.
2. For each form or endorsement, extract the exact provision at issue, the corresponding supporting document if any, and the effective date or edition reference.
3. Suit limitations period: identify the provision, cite the governing minimum or standard, compare them, and describe the nature of any conflict.
4. Anti-concurrent causation clause: identify the clause, cite the applicable guidance or accepted regulatory standard, and assess whether clarification is needed.
5. Undefined communicable disease term: identify any undefined material term and evaluate whether the form should define it.
6. Deductible consistency: compare the form against the rate filing and identify any inconsistency or unresolved drafting mismatch.
7. Credibility weighting arithmetic: extract the calculation, verify it independently, and note any discrepancy or unsupported assumption.
8. Flood disclosure: determine whether the required notice is present, and if not, specify the filing consequence risk.
9. Terrorism disclosure: determine whether the required notice is present, and if not, specify the filing consequence risk.
10. Appraisal umpire selection: identify the selection mechanism and assess whether it is neutral and workable.
11. ACV/replacement cost ambiguity: locate any ambiguous valuation language and assess whether clarification is needed.
12. Cancellation/nonrenewal: review notice and grounds provisions for compliance with the governing insurance-law requirements.
13. Filing type characterization: verify that the transmittal or filing description accurately characterizes the submission.
14. For every issue, state the provision, the governing authority, the observed gap, the downstream consequence, and a concrete corrective step.
15. Where more than one form version, endorsement, or jurisdiction is involved, produce a separate analysis line for each rather than collapsing them into one general statement.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare the base form to endorsements, declarations, and any rate support to ensure the same deductible, valuation method, exclusions, and notice mechanics are used consistently across the package.
- Compare filing-time statements to policy-effective-date language; a filing can be objectionable if the transmittal, form edition, or disclosure timing does not match the operative policy period.
- If a provision changes rights across renewal, cancellation, or claims timing, note the temporal trigger and whether the change is disclosed clearly enough for regulator review.
- If a disclosure is conditioned on a state-specific market or coverage election, tie the condition to the jurisdiction and the document location where the election is made.

## 6. Output structure conventions

- Write a regulatory issue memorandum organized by severity, using an explicit ordinal scale defined at the top of the memorandum and applied uniformly to every issue.
- Use conventional issue-memo headings rather than rigid rubric labels; each issue entry should include:
  - severity,
  - issue title,
  - filing provision or source document,
  - governing authority or convention,
  - observed gap,
  - why it matters to the regulator or insured,
  - recommended correction.
- Support each legal or regulatory proposition with the controlling authority by name and section, regulation part, bulletin, or other recognized authority.
- For each issue, include the relevant provision, the governing requirement or convention, the observed gap, any cross-document inconsistency, the filing consequence risk, and a concrete corrective action.
- When calculations appear in the package, verify them independently and flag any discrepancy before relying on them in the memorandum.
- End with a concise Recommended Actions section that assigns each action to a responsible role and ties it to a filing milestone or urgency level.
- If useful, include a short summary of issues by severity tier before the issue list.
