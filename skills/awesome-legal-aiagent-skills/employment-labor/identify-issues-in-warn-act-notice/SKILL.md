---
name: identify-issues-in-warn-act-notice
task_id: employment-labor/identify-issues-in-warn-act-notice
description: Guides the analyst in producing a detailed compliance-issues memorandum for a worker-notice package, identifying procedural and substantive deficiencies across employee, union, and government notices, with citations to the applicable notice requirements and recommended corrections.
activates_for: [planner, solver, checker]
---

# Skill: Identify Compliance Issues in WARN Act Notice Package

## 1. Subject-matter triage

- Treat the packet as a notice-compliance review, not a merits memo.
- Separate the materials by audience and function: employee notice, union notice, government notice, closure documents, and any separation agreement or release.
- Identify the governing notice regime from the documents and facts before assessing adequacy; do not assume a single facility, a single layoff date, or a single notice recipient group.
- If multiple facilities, dates, or notice recipients appear, enumerate them first and analyze each separately.

## 2. Failure modes the skill is correcting

- Analyst reviews notices for general adequacy without verifying that each notice states a specific expected separation date as required by the applicable notice rules, rather than a general timeframe that may not satisfy the specificity requirement.
- Analyst checks that union notice was sent without verifying the delivery method, missing that email delivery alone may not satisfy the written-notice requirement for union representatives.
- Analyst counts employees from the HR roster without identifying that part-time employees who meet the applicable hours and tenure thresholds and employees on approved leave may also be entitled to notice.
- Analyst does not check whether a prior layoff within the aggregation window must be added to the current layoff count to determine whether the mass-layoff threshold is met.
- Analyst treats separation agreements as standalone forms without checking whether age-discrimination release disclosures and consideration periods are triggered by a group termination.
- Analyst overlooks collective-bargaining obligations, bumping rights, or required coordination with staffing agencies.
- Analyst lists a deficiency without stating the governing rule, the document-specific gap, the scale of the problem, or the operational and legal consequence.
- Analyst gives narrative comments without assigning a severity level or an action item that can be executed.

## 3. Legal frameworks / domain conventions that apply

- WARN Act notice duties arise under 29 U.S.C. §§ 2101-2109 and the implementing regulations at 20 C.F.R. Part 639.
- Notice adequacy turns on required content, proper recipients, and timely delivery; each notice type must be checked against its own rule set.
- Employee notices should identify the plant closing or mass layoff, the expected date of separation, and any available bumping rights and dislocated worker assistance information, as required by the WARN regulations.
- Union notices must be in writing and directed to the proper union representative under the governing notice rules; method of delivery matters, not just proof that some communication occurred.
- Government notices must include the employer identification details, nature of the action, expected timing, affected job categories, and a contact person, consistent with 20 C.F.R. § 639.7.
- Coverage and threshold questions require application of the WARN counting rules, including treatment of part-time employees, employees on leave with an expectation of return, and aggregated employment losses during the relevant period.
- Related reductions in force may require aggregation under the statutory and regulatory lookback rules, so a prior action cannot be ignored if it falls within the applicable window.
- If the separation package includes a release for workers age 40 or older in a group termination, analyze it under the Older Workers Benefit Protection Act, 29 U.S.C. § 626(f), and the group-disclosure requirements of the applicable regulations.
- If a collective bargaining agreement, policy, or plant practice creates bumping rights, those rights should be reflected in the employee notice and checked against the closure documents.
- If staffing agency workers are used at the facility, review whether the source documents allocate notice responsibilities and whether the worker population was counted or notified consistently.

## 4. Analytical scaffolds

- Notice-by-notice review: separately review the employee notice, union notice, government notice(s), closure documents, and separation agreement against the applicable requirements; for each, list every required element and confirm whether it is present.
- Enumerate all recipient groups and all notice dates before analysis; if the packet covers more than one audience or facility, analyze each as its own row of issues rather than collapsing them.
- For each issue, state: the governing rule, the document language or omission, the scale of the discrepancy against the source documents, the interaction with any other provision or document, the severity, and the downstream consequence.
- Employee eligibility count: from the headcount data, apply the hours threshold and tenure threshold to identify all eligible employees; include part-time employees meeting both thresholds and employees on approved leave.
- Delivery method assessment: for the union notice, verify the delivery method; flag any non-compliant method and note whether the source documents show proof of written delivery.
- Aggregation analysis: identify any prior layoffs within the relevant aggregation period of the current layoff; combine the counts; assess whether the combined total triggers the applicable threshold analysis.
- Staffing agency coordination: identify whether the employer uses staffing agency workers; assess whether they meet the applicable eligibility criteria; recommend coordination with the staffing agency.
- Group termination release compliance check: verify the consideration period applicable to group terminations; confirm the required demographic disclosure is included in the separation package; flag any mismatch with the notice package.
- Collective-bargaining agreement interaction: review the collective-bargaining agreement for bumping rights and union notification requirements; confirm the notice addresses both.
- If a required item is absent from the source set, say so expressly rather than inferring compliance from silence.

## 5. Vertical / structural / temporal relationships

- Distinguish among the employee notice, union notice, and government notice; do not treat a compliant government notice as curing a deficient employee notice.
- Track timing across the full sequence: notice date, anticipated separation date, any staggered termination dates, and any prior layoff date used for aggregation.
- Compare the closure documents and separation agreement against the notice package for inconsistencies in timing, affected population, or reason for separation.
- If the packet includes multiple rounds of notice, identify whether later notices supplement, replace, or conflict with earlier ones.
- If the documents reference staggered terminations, temporary shutdowns, or recall expectations, analyze whether the notice content matches that structure.

## 6. Output structure conventions

- Format the deliverable as a compliance issues memorandum organized by notice type and then by deficiency within each type.
- Define one ordinal severity scale at the top and apply it uniformly to every issue.
- For each issue, use a compact rule-to-gap format: governing authority → document language or omission → why it is deficient → consequence → severity → recommended correction.
- Every issue should be closed with three elements: the relevant scale or threshold from the source documents, the cross-document interaction, and the practical consequence for compliance or exposure.
- Include a summary table of all deficiencies with severity ratings before the detailed discussion.
- End with a Recommended Actions section that gives concrete next steps, assigns the responsible role when identifiable from the documents, and ties timing to the notice date, separation date, or other regulatory milestone.
- Use controlling legal citations for every legal proposition relied on, citing the statute, regulation, or other authority that supports the point.
