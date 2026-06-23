---
name: identify-issues-in-employer-support-documentation-for-h1b
task_id: immigration/identify-issues-in-employer-support-documentation-for-h
description: Pre-filing issues memo for an H-1B petition package where deficiencies in the labor condition application, support letter, organizational documentation, and financial records must each be identified with an explanation of why the deficiency creates a filing risk.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Employer Support Documentation for H-1B Petition

## 1. Subject-matter triage

- Treat the package as a pre-filing compliance review, not an approval prediction.
- Separate defects in the petition narrative from defects in the supporting evidence.
- Identify whether the record is thin, inconsistent, outdated, or internally contradictory.
- Determine whether any issue is a filing blocker, an RFE risk, or a lower-priority cleanup item.
- If the package contains multiple employment scenarios, worksites, or classifications, enumerate each distinct scenario first and analyze them separately.

## 2. Failure modes the skill is correcting

- Agents spot factual mismatches but do not explain why each mismatch matters under H-1B filing standards.
- The labor condition application is accepted at face value without checking whether the occupational classification, worksite, wage, and duties line up across the packet.
- The analysis stops at the support letter and ignores corporate, organizational, and financial materials that often determine whether the petition survives scrutiny.
- The employer-employee control showing is assumed rather than tested against the actual engagement structure.
- Public access file obligations are omitted from the review even though they are routinely implicated by H-1B filings.
- Issues are described in generalities without a severity assessment or a concrete fix.

## 3. Legal frameworks / domain conventions that apply

- The H-1B filing must support specialty occupation eligibility under INA § 214(i) and 8 C.F.R. § 214.2(h).
- The labor condition application must be certified and consistent with the offered position under 20 C.F.R. Part 655, Subparts H and I.
- The position description must align with the claimed occupational classification; title alone is not controlling.
- The employer must show the ability to pay the offered wage through the relevant filing period using the financial record in the package and other competent evidence.
- The petition must support a bona fide employer-employee relationship, especially where third-party worksites, staffing, or consulting structures are involved.
- Public access file content and maintenance are governed by the H-1B LCA regulations in 20 C.F.R. § 655.760 and related provisions.
- Any legal conclusion in the memo should be tied to the governing statutory or regulatory rule, not stated as a bare assertion.

## 4. Analytical scaffolds

1. Labor condition application review: verify certification status, occupation code, worksite, wage level, prevailing wage, and employer identity against the rest of the package.
2. Classification-to-duties alignment: compare the claimed occupation to the actual job duties, percentage allocations, reporting lines, and required degree/experience.
3. Specialty-occupation sufficiency check: test whether the evidence supports the occupation under the regulatory criteria, not just the employer’s characterization.
4. Employer-employee relationship check: assess who controls work assignment, supervision, evaluation, discipline, and termination.
5. Ability-to-pay check: review payroll, tax, financial statements, and any supplemental evidence for support of the offered wage.
6. Organizational consistency check: compare org charts, offer letters, internal approvals, and corporate records for alignment on title, reporting structure, and worksite.
7. Public access file check: confirm the presence of the certified LCA and other required file components, and flag any missing or incomplete items.
8. Cross-document inconsistency check: identify mismatches in title, wage, duties, dates, entity names, locations, or employment terms and explain the filing risk created by each mismatch.

## 5. Vertical / structural / temporal relationships

- Trace each issue from the source document to the conflicting document, then to the legal consequence.
- Where a single problem affects multiple H-1B requirements, note each affected requirement separately.
- For time-sensitive items, distinguish pre-filing defects from post-filing maintenance obligations.
- If a document refers to a future worksite, a future project, or a future start date, assess whether the support currently available is enough to justify filing now.
- If the record contains more than one beneficiary, role, or placement arrangement, keep the analysis separate for each and do not merge them into a single generalized finding.

## 6. Output structure conventions

- Write a pre-filing issues memo organized by document category, then by issue.
- Define a simple ordinal severity scale once at the top and use it consistently, such as Critical, High, Medium, and Low.
- For each issue, include:
  - issue summary,
  - source document(s),
  - governing rule or authority,
  - why the issue matters,
  - severity,
  - recommended correction.
- Every issue entry should connect the defect to a concrete filing consequence, such as specialty-occupation weakness, wage inconsistency, RFE exposure, or audit risk.
- Where numbers, dates, titles, or locations differ across documents, call out the inconsistency explicitly and identify the documents that conflict.
- End with a prioritized Recommended Actions section that assigns each fix to the responsible role and ties it to the filing deadline or immediate pre-filing timing.
- Use a concise issue table if helpful, but keep the memo readable as an action document.
