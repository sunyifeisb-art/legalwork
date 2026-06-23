---
name: compare-employee-handbook-against-state-requirements
task_id: employment-labor/compare-employee-handbook-against-state-requirements
description: Guides the analyst through a jurisdiction-specific handbook compliance gap analysis that compares each handbook policy against the applicable state statutory requirements and assigns severity ratings.
activates_for: [planner, solver, checker]
---

# Skill: Compare Employee Handbook Against State Employment Law Requirements

## 1. Subject-matter triage

- Identify every jurisdiction implicated by the handbook and census data before comparing policy language.
- Treat each state as a separate compliance lens; do not assume a federal baseline answers the state question.
- If the sources show only one relevant state, state that expressly and analyze only that state.
- Map each handbook policy to the operative state rule, then test whether the handbook’s wording, coverage, exceptions, and implementation guidance are complete.

## 2. Failure modes the skill is correcting

- Analyst identifies that a policy area exists in the handbook without verifying that the handbook’s specific terms satisfy the applicable state requirement.
- Analyst applies federal law standards to a state that has enacted stricter or supplemental requirements, failing to identify the delta between federal and state obligations.
- Analyst treats final pay timing as a single rule rather than recognizing that many states impose differentiated requirements depending on the separation type; each separation type must be checked against the applicable state rule.
- Analyst omits the enforceability analysis for restrictive covenant provisions even though the handbook's applicability to the employee population may exceed statutory thresholds for enforceability.
- Analyst spots a deficiency but does not tie it to the relevant headcount, eligibility class, separation category, training cadence, benefit period, or other source-derived threshold.
- Analyst summarizes a gap without identifying the controlling statute, regulation, or other authority that makes the gap legally material.
- Analyst produces recommendations without specifying who should own the fix or when the fix must be completed.
- Analyst collapses multiple state-specific or employee-class-specific rules into one generic statement, hiding the actual compliance delta.

## 3. Legal frameworks / domain conventions that apply

- Use the controlling Colorado authority for each issue, including the relevant statute, regulation, agency rule, or other recognized authority identified in the source set or known by practice.
- State minimum wage analysis should test the handbook against Colorado’s operative wage rule, not a generic federal floor.
- Final pay analysis should distinguish separation categories and check each category against the applicable Colorado timing rule.
- Leave analysis should distinguish state-created leave entitlements, eligibility triggers, duration, job-protection features, and any coordination with federal leave concepts.
- Harassment, discrimination, retaliation, and training provisions should be checked against Colorado’s protected categories, training expectations, and notice practices.
- Restrictive covenant provisions should be checked for Colorado enforceability limits, including any employee-class or compensation-based restrictions that affect whether the policy can be enforced as written.
- Payroll, wage statement, meal/rest break, expense reimbursement, lactation, accommodation, cannabis, confidentiality, and records-retention provisions should be tested against any Colorado-specific requirement that supplements general employment-law practice.
- If the handbook uses internal policy language that is narrower than the legal rule, treat the omission as a drafting gap even if the policy is operationally workable.

## 4. Analytical scaffolds

- Jurisdiction identification: list the state in scope, the employee populations covered by the census data, and any policy areas whose applicability varies by location or classification.
- Policy-by-policy gap analysis: for each handbook section, identify the controlling rule, summarize the handbook language, compare the two, and state the gap.
- Threshold and scope check: whenever the rule turns on headcount, earnings, hours, service, exempt status, position type, location, or separation type, measure the handbook against that threshold before calling it compliant.
- State-by-state sub-analysis: if more than one state appears in the record, organize the discussion by policy area and then by state within that policy area.
- Severity assignment: rate each gap using a stated ordinal scale and apply that scale consistently across the analysis.
- Consequence framing: for each gap, explain the operational, regulatory, wage, leave, or litigation consequence that follows from the mismatch.
- Recommended fix: propose concise corrective language or implementation steps that would align the handbook with the governing Colorado rule.

## 5. Vertical / structural / temporal relationships

- For final pay, analyze the relationship between separation type and payment deadline; do not treat resignation, discharge, and other separation events as interchangeable.
- For leave and benefit policies, distinguish eligibility date, notice period, certification step, leave duration, and reinstatement or continuation consequences.
- For wage and hour policies, distinguish regular pay practices, overtime handling, deductions, reimbursements, and statement content; a fix in one area does not cure defects in another.
- For covenant and confidentiality provisions, distinguish current employees, former employees, low-wage employees, and other protected or excluded groups where Colorado law draws different lines.
- For training and notice provisions, distinguish initial onboarding, annual cadence, and event-triggered notice obligations.
- Where a policy’s legality depends on employee count or census composition, tie the analysis to the relevant population and explain the coverage effect.

## 6. Output structure conventions

- Deliver the work as a compliance gap analysis, not a narrative memo.
- Start with a short executive summary that identifies the most serious themes and the overall compliance posture.
- Include a legend for the severity scale at the top, using an ordinal set such as Critical / High / Medium / Low.
- Present the analysis in a comparison format for each issue:
  - State Requirement
  - Current Handbook Language
  - Gap Description
  - Severity
  - Recommended Fix
  - Authority
  - Consequence
- Prioritize the highest-severity gaps first.
- When multiple states are relevant, keep the main organization by policy area and use state-specific sub-entries rather than separate full reports by state.
- Include explicit citations to the controlling authority for each legal proposition relied upon.
- End with a Recommended Actions block that assigns each fix to a role and a timing anchor drawn from the source set or, if none exists, a practical urgency milestone.
- Keep the wording precise and implementation-oriented; avoid generalities that do not tell the reviewer what must change.
