---
name: identify-regulatory-and-operational-deficiencies-in-fund-manager-compliance-manual
task_id: funds-asset-management/identify-regulatory-and-operational-deficiencies-in-fund-manager-compliance-manual
description: Review a registered investment adviser's compliance manual against applicable regulatory requirements and supporting materials, then produce an issues memo identifying regulatory and operational deficiencies, with severity ratings and remediation recommendations for each issue identified.
activates_for: [planner, solver, checker]
---

# Skill: Compliance Manual Regulatory Deficiency Review

## 1. Subject-matter triage

- Treat the compliance manual as the primary artifact and the supporting materials as the comparator set.
- Identify which regulatory regimes are actually implicated by the manual and the source documents; do not assume every fund-advisory rule is in scope.
- If multiple product types, entities, or control regimes appear in the record, enumerate them before analysis and assess each on its own terms.
- Flag whether the manual is meant to govern only policies, or also procedures, escalation paths, and governance reporting.

## 2. Failure modes the skill is correcting

- Reviewer audits the manual against a generic compliance checklist without cross-referencing the specific rules and recent amendments or enforcement priorities, missing significant deficiencies.
- Reviewer does not identify structural independence deficiencies in compliance leadership or governance access that require organizational changes beyond policy text amendments.
- Reviewer does not compare the manual's stated political contribution thresholds against the applicable de minimis amounts, missing a quantitative error.
- Reviewer fails to reconcile the manual with supporting documents, leaving conflicts between procedures, disclosures, and governance materials unflagged.
- Issues memo does not assign severity ratings or provide remediation timelines, leaving the compliance function without a prioritized action plan.
- Reviewer states conclusions without tying them to the controlling rule, regulation, or recognized authority.

## 3. Legal frameworks / domain conventions that apply

- Use the controlling authority actually implicated by the record and cite it by name and section or part when stating a legal proposition.
- For adviser compliance programs, assess baseline written policies and procedures, annual review, and chief compliance officer administration under the Investment Advisers Act framework and related SEC rules and guidance.
- For political contributions, evaluate pay-to-play controls under the applicable investment adviser rule, including contribution tracking, pre-clearance, household-member treatment, and affiliated political activity controls.
- For marketing, assess testimonial, endorsement, performance-advertising, substantiation, and prominence requirements under the applicable marketing rule and related interpretive guidance.
- For personal trading, MNPI, off-channel communications, valuation oversight, cybersecurity, and recordkeeping, compare the manual to the operative regulatory standard and to the operational control environment described in the source materials.
- If the manual references exemptions, elections, or status-dependent regimes, verify continuing eligibility and escalation triggers rather than treating the initial qualification as sufficient.
- If side letters, allocation arrangements, or disclosure commitments appear in the source set, check consistency across governing documents, policies, and disclosures.
- If a reporting obligation is described, identify the recipient by role or function and assess whether the recipient can actually receive, review, and act on the report.

## 4. Analytical scaffolds

### Rule-by-rule audit
- Build a working checklist of each implicated rule and the specific control features the manual should contain.
- For each rule, test whether the manual addresses: scope, ownership, escalation, documentation, supervision, exceptions, and monitoring.
- Distinguish between a missing policy, a vague policy, and an implemented policy that conflicts with another document.

### Cross-document reconciliation
- Compare the manual against supporting documents, disclosures, committee charters, reporting templates, and any other governance materials in the record.
- Identify inconsistencies in thresholds, role descriptions, approval rights, monitoring cadence, or remediation obligations.
- Where one document narrows or broadens another, assess which text governs operationally and whether the conflict creates legal or supervisory risk.

### Structural independence review
- Assess the compliance officer’s reporting line, authority, access to senior management, and access to governance bodies relevant to valuation, risk, or audit oversight.
- Flag any design in which compliance is subordinated to business judgment in a way that could impair escalation or remediation.
- Separate a drafting defect from a structural defect; if governance access is missing, recommend an organizational fix, not just a policy edit.

### Quantification and consequence analysis
- When the source documents provide a threshold, term, count, amount, exposure, or similar figure, use it to scale the issue.
- Tie each issue to the downstream consequence: regulatory breach, monitoring failure, disclosure mismatch, recordkeeping gap, or operational weakness.
- If the record contains no usable figure for a point, say so and explain why the issue remains material anyway.

### Issue memo construction
- For each issue, identify the applicable authority, describe the deficiency, explain why it matters, and state how to fix it.
- Assign a severity rating using a single ordinal scale defined once at the top.
- End each issue with a concrete remediation step and implementation timing anchored to the compliance cycle, regulatory deadline, or other source-document milestone.

## 5. Vertical / structural / temporal relationships

- Track whether the manual addresses both policy design and day-to-day operations; a policy without procedures is incomplete.
- Track whether supervision runs vertically from staff to compliance to senior management and, where applicable, to the board or equivalent oversight body.
- Track whether the manual is current as of the operative date of the source materials or whether later amendments, enforcement developments, or business changes make it stale.
- If the record spans multiple periods, identify whether controls must be assessed as of inception, at the time of amendment, or on an ongoing basis.
- If a reporting or review cycle exists, verify that escalation, exception handling, and annual review fit within that cycle.

## 6. Output structure conventions

- Produce a single issues memo suitable for saving as `compliance-review-memo.docx`.
- Open with a short scope statement and define the severity scale once, using an explicit ordinal format such as Critical / High / Medium / Low.
- Organize the body by numbered issue, with each issue containing:
  - Issue title
  - Applicable authority
  - Severity
  - Deficiency description
  - Why it matters
  - Cross-reference to the conflicting or related source material
  - Remediation recommendation
  - Timing or priority anchor
- Keep each issue self-contained and avoid bundling unrelated deficiencies into one entry.
- Close with a Recommended Actions section that lists concrete next steps in imperative form, names the responsible role, and ties each action to a deadline, review cycle, or regulatory milestone.
- Use clear, conventional legal memo prose; do not reproduce source-document text verbatim except when the task instructions expressly require surface quotation.
