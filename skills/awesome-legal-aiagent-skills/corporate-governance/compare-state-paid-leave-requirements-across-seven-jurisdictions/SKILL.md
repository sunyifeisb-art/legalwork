---
name: multi-state-paid-leave-compliance-matrix
task_id: corporate-governance/compare-state-paid-leave-requirements-across-seven-jurisdictions
description: Multi-state paid leave compliance analysis comparing a universal leave policy against current jurisdictional requirements across all applicable jurisdictions, identifying potential over-withholding issues, carryover issues, and incident-specific retroactive correction obligations.
activates_for: [planner, solver, checker]
---

# Skill: Multi-State Paid Leave Requirements Compliance Analysis

## 2. Failure modes the skill is correcting

- Analyzing each jurisdiction in isolation instead of testing one universal leave policy against every applicable jurisdictional rule set, which can miss conflicts created by a single provision across multiple states
- Missing payroll configuration drift by assuming stated withholding rates are current, which can mask over-withholding and correction obligations
- Treating denial logs and exception trackers as background material rather than as evidence of retroactive remediation duties for specific employees or time periods
- Failing to separate policy gaps, payroll issues, and incident-level remediation, which blurs what must be fixed now versus what must be amended prospectively
- Stating that a policy is “non-compliant” without identifying the controlling authority, the affected scope, and the operational consequence

## 3. Legal frameworks / domain conventions that apply

- Paid family and medical leave programs are jurisdiction-specific and often include different contribution structures, eligibility rules, benefit durations, and family-member definitions; each governing statute, regulation, or agency guidance must be checked as current
- State sick leave and safe leave laws may impose independent accrual, carryover, notice, and permitted-use requirements that a universal policy must satisfy separately
- Employer and employee contribution rules can change by year; payroll rates, caps, and administrative assumptions must be verified against current published sources before assessing compliance
- A policy that applies a federal-style eligibility screen, waiting period, or family definition may be inconsistent with a state program that is broader or faster-vesting
- Front-loading, accrual, usage caps, and carryover provisions interact; a permitted feature in one jurisdiction may be prohibited or conditioned in another
- Domestic violence, sexual assault, stalking, or similar protected-purpose leave may be required in some jurisdictions even if absent from the company policy
- Where the source set includes a denial log, each denial should be tested against the governing law for that employee and time period, because a denial can create back-pay, reinstatement, record-correction, or interest exposure
- Any legal conclusion should name the authority relied on, using the statute, regulation, or other controlling source identified in the materials or current legal research

## 4. Analytical scaffolds

- Start by enumerating every jurisdiction in scope and, for each one, identify the applicable paid leave, paid sick leave, and protected-purpose leave requirements before comparing the policy
- For each policy provision, test it against each jurisdiction that regulates that subject; do not analyze a provision only once if the same language affects multiple jurisdictions differently
- For each jurisdictional rule, record the controlling authority, the policy language that conflicts or aligns, the affected employee population, and the practical effect on administration or payroll
- For payroll rates, compare the configured rate to the current published rate and then assess whether any mismatch creates under-collection or over-withholding; if the source set contains period data, tie the analysis to the affected payroll cycle
- For any incident or denial, identify the employee event, the governing rule, the reason the denial may fail, and the remedy that would be required if the denial was improper
- When evaluating duration, carryover, or eligibility, distinguish between initial access to leave, continuing accrual, and year-end retention; these are separate compliance questions
- Use a severity scale that is fixed once at the top of the memo and apply it consistently to every issue so the reader can distinguish systemic program defects from localized gaps
- Close each issue with three elements: the size of the affected population or other scale from the source set, the document or rule that interacts with the issue, and the downstream consequence for the employer or employees
- Where the materials present multiple jurisdictions, incidents, or payroll settings, analyze each one separately rather than collapsing them into a representative sample
- If a point depends on current statutory or agency authority, state the authority expressly instead of leaving the conclusion unsupported
- End with practical next steps that assign responsibility and timing, not just diagnosis

## 5. Vertical / structural / temporal relationships

- A single policy clause can create simultaneous noncompliance across all covered jurisdictions, so the highest-value fix may be a global policy amendment rather than state-by-state edits
- Payroll errors recur every pay cycle until corrected, so rate mismatches and contribution setup errors should be treated as ongoing operational exposure rather than one-time drafting defects
- Registration or setup prerequisites, if missing, can prevent proper benefit administration and magnify later denial and payroll errors
- Retroactive remediation may require both employee-level correction and system-level cleanup; the analysis should separate immediate relief from forward-looking policy or payroll changes
- Year-bound rules such as carryover and annual caps should be checked against the relevant accrual period, not treated as static evergreen terms

## 6. Output structure conventions

- Open with a short methods note identifying the jurisdictions reviewed, the source materials used, and the severity scale applied
- Present a jurisdiction-by-jurisdiction compliance matrix with columns for governing authority, relevant rule, policy treatment, compliance status, and comment
- Follow with a policy-gap section organized by topic such as eligibility, family definition, accrual, carryover, waiting period, front-loading, protected-purpose leave, and payroll contributions
- Include a separate incident or denial analysis section for any documented leave denials, with the applicable authority, issue, remedial obligation, and expected downstream effect
- Include a prioritized issue list that ranks systemic issues ahead of localized or low-impact issues and explains why each item is ranked as it is
- Conclude with a remediation roadmap that assigns each action to a responsible business role or legal reviewer and ties it to an immediate, near-term, or longer-term timing anchor
- Use conventional memo form rather than a checklist-only format, but preserve enough structure that each jurisdiction and each issue can be traced independently
