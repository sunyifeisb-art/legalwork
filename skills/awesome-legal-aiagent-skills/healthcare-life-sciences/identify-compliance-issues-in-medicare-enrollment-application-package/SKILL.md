---
name: hls-identify-medicare-enrollment-issues
task_id: healthcare-life-sciences/identify-compliance-issues-in-medicare-enrollment-application-package
description: Reviews a Medicare enrollment application package for compliance deficiencies by checking disclosure completeness, authority of signatories, accuracy of status certifications, lease and compensation arrangements, screening of required individuals, accreditation assertions, and consistency across related application materials.
activates_for: [planner, solver, checker]
---

# Skill: Identify Compliance Issues in Medicare Enrollment Application Package

## 1. Subject-matter triage

- Confirm the package is an enrollment/application review, not an operations audit or reimbursement appeal.
- Identify the provider type, enrollment pathway, and any related ownership/control disclosures before analyzing defects.
- If multiple application forms, addenda, certifications, leases, or supporting exhibits are included, treat them as one integrated record and map each issue to the exact document location.

## 2. Failure modes the skill is correcting

- Disclosure gaps are often missed where owners, managing officials, controlling persons, or other required individuals appear in supporting materials but not in the application itself.
- Signatory authority defects are frequently overlooked even when the executing person lacks documented authority under the entity’s governance documents or enrollment rules.
- Status certifications can be accepted at face value even when other materials undermine the assertion or create timing inconsistency.
- Lease and compensation terms are often reviewed superficially, missing provisions that may create referral-relationship or fair-market-value concerns.
- Screening and exclusion checks are often incomplete where one or more required individuals are omitted, outdated, or unclearly resolved.
- Accreditation statements can be inconsistent with the underlying certificate, effective dates, or scope.
- Cross-form inconsistencies in addresses, names, roles, dates, identifiers, and program-status statements can indicate processing risk even when each isolated form seems facially complete.
- Execution defects, including signature chronology and notarization sequence, can undermine the reliability of the package.

## 3. Legal frameworks / domain conventions that apply

- Managing control disclosure: apply the applicable definition of managing control, ownership, and control persons under the Medicare enrollment rules and compare it against the organizational documents and disclosures in the package.
- Enrollment authority: confirm the signatory has the authority required under the Medicare enrollment regulations and the entity’s governing documents to execute certifications on the organization’s behalf.
- Material misstatement risk: if the package contains an unsupported certification or inconsistent factual representation, treat it as a potential material enrollment defect under the Medicare enrollment framework.
- Referral-relationship and compensation review: assess lease, management, and compensation provisions for terms that may implicate anti-kickback or similar referral-relationship concerns under the federal healthcare fraud and abuse framework.
- Screening obligations: verify that all required persons were screened against the relevant exclusion, sanction, and enrollment integrity sources, and that any hits were addressed as required by the package and supporting records.
- Accreditation accuracy: compare any accreditation claim against the underlying accreditation record, scope, and effective dates, and flag unsupported or overbroad assertions.
- Cross-program consistency: compare references to other government program enrollments, certifications, or participation statuses for internal consistency across the package.
- Execution chronology: review dates, signatures, acknowledgments, and notarizations for sequencing defects that suggest improper execution or clerical error.

## 4. Analytical scaffolds

1. Map the application universe: list every form, exhibit, certification, attachment, and referenced agreement before assessing defects.
2. Ownership and control pass: identify all persons or entities that may qualify as owners, managing officials, or controlling persons under the applicable enrollment definition, then compare that universe to what the package discloses.
3. Authority pass: verify the executing person’s authority against the governing documents and any signature authorization materials.
4. Status-certificate pass: test each statement of current operational, licensure, accreditation, or program status against the underlying records and dates.
5. Compensation and lease pass: inspect payment, space, equipment, and services terms for inconsistencies with commercially reasonable, fixed, and non-volume-based arrangements.
6. Screening pass: confirm all required individuals were screened, that results are documented, and that any adverse findings were resolved or escalated as required.
7. Consistency pass: compare names, dates, addresses, roles, identifiers, and program references across the full package for internal alignment.
8. Severity pass: assign a uniform ordinal severity to each issue and rank issues by likely enrollment impact, remediation burden, and processing risk.

## 5. Vertical / structural / temporal relationships

- Track whether disclosures in one document expand, qualify, or contradict statements in another.
- Compare execution dates to the dates of supporting authority, certifications, lease execution, accreditation status, and screening checks.
- Note whether omissions are isolated clerical defects or repeated across the package, which may indicate a broader control or governance problem.
- Where multiple entities or individuals are referenced, analyze each separately before drawing any package-level conclusion.

## 6. Output structure conventions

- Prepare a prioritized issues memorandum with a short severity legend defined once at the top, using an ordinal scale such as Critical, High, Medium, and Low.
- For each issue, include: document or form reference, issue description, controlling legal or regulatory basis, severity, practical consequence, and recommended corrective action.
- Every issue should be self-contained and should state why the defect matters for enrollment processing, compliance exposure, or downstream operational risk.
- Include a brief section confirming the materials or representations that appear complete or internally consistent, where applicable.
- Close with a Recommended Actions block that sequences remediation steps by priority and assigns each action to the relevant responsible role and timing anchor from the package or, if none exists, to the nearest enrollment milestone.
- When multiple deficiencies are present, order them from the most consequential enrollment defect to the least consequential technical error.
