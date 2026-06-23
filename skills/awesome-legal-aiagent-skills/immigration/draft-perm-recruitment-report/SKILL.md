---
name: draft-perm-recruitment-report
task_id: immigration/draft-perm-recruitment-report
description: PERM recruitment report and companion compliance memo for a labor certification filing, where the report must document each mandatory and supplemental recruitment step in the required order and format, and the memo must separately identify compliance risks in the recruitment record.
activates_for: [planner, solver, checker]
---

# Skill: Draft PERM Recruitment Report

## 1. Subject-matter triage

- Treat this as a two-output filing support task: one audit-ready recruitment report and one separate compliance memo.
- Start by verifying the source packet contains the current job opportunity, wage support, recruitment evidence, applicant responses, and date trail; if a field is missing or inconsistent, flag it rather than filling from general knowledge.
- If more than one recruitment step, applicant, date window, or document version appears in the sources, enumerate the complete set before analysis and carry the same identifiers through both deliverables.
- If only one version of a core field exists, say so explicitly and rely only on that version.

## 2. Failure modes the skill is correcting

- Agents merge the recruitment report and compliance analysis into one hybrid narrative, causing the audit file and privileged memo to blur.
- Worksite, wage, or job-title details are copied from prior matter history or general assumptions instead of the current source packet.
- Recruitment steps are summarized loosely, with dates, publication channels, or posting durations omitted or reordered.
- Mandatory and supplemental recruitment are not checked against the governing sequence, timing windows, and required count.
- Applicant rejection reasons are stated without tying them to lawful, job-related criteria.
- The compliance memo fails to separate issue spotting from the underlying recruitment narrative, or omits severity and remediation.
- The draft does not distinguish between what belongs in the audit record and what belongs only in the internal memo.
- Legal conclusions are stated without naming the controlling PERM rule or recruitment authority.

## 3. Legal frameworks / domain conventions that apply

- PERM labor certification under 20 C.F.R. Part 656 requires the employer to complete the required recruitment steps, document them in a recruitment report, and retain support for audit.
- Professional occupation recruitment generally includes two Sunday newspaper advertisements and a state workforce agency job order, plus the applicable additional recruitment steps.
- Recruitment must be conducted within the governing filing window and before filing; the notice of filing must satisfy the required posting period under the PERM rules.
- Recruitment copy should track the minimum requirements stated for the offered position; material tightening or drift in qualifications can undermine the labor-market test.
- Rejection reasons must be lawful, specific, and job-related under the PERM framework; reasons such as overqualification, refusal to train on ordinary employer training, or preference for the sponsored worker are problematic.
- The offered wage must align with the current prevailing wage determination and the application materials; do not rely on stale wage support.
- The recruitment report is an audit-file document, not a cover letter, and the compliance memo is a separate internal advisory communication.
- Use the governing regulation or source document reference for each legal proposition rather than generalized immigration lore.

## 4. Analytical scaffolds

1. Separate-document plan: draft the recruitment report as the primary operative document, then draft the compliance memo after the report is complete.
2. Source inventory: list each recruitment medium, date, publication or posting channel, job order entry, and applicant response source before drafting.
3. Timing check: compare each recruitment event to the applicable PERM windows and flag anything outside the allowable period or not completed before filing.
4. Coverage check: confirm the mandatory recruitment pieces are present and that the supplemental steps satisfy the applicable rule set for the occupation.
5. Consistency check: compare the job title, duties, minimum requirements, worksite, and wage across all sources and flag any material mismatch.
6. Applicant review: for each U.S. worker applicant, record disposition, summarize the rejection basis, and test whether the reason is facially lawful and tied to the stated requirements.
7. Field verification: populate worksite, wage, and position fields only from the current application materials and prevailing wage documentation, not from inferred or prior-case values.
8. Memoization: translate every discrepancy or risk into a concise internal flag with severity and remediation, avoiding narrative duplication of the report.

## 5. Vertical / structural / temporal relationships

- Keep the audit report chronological within each recruitment category, but group by required step type so the record is easy to audit.
- Preserve the relationship between the application job description, the recruitment copy, and the applicant-disposition analysis; a mismatch in one place can invalidate the others.
- Where a posting or advertisement spans dates, note the full range and the effective duration rather than only the first or last day.
- If the same issue appears in multiple source documents, identify the primary source of the discrepancy and cross-reference the related documents in the memo.
- Distinguish completed steps from planned steps, draft steps, or incomplete evidence; only completed and supported steps belong in the report.

## 6. Output structure conventions

- Produce two separate files: an audit-ready recruitment report and a privileged compliance-flags memo.
- The recruitment report should read like a formal PERM support document with:
  - position and source-control summary,
  - worksite and wage information verified from the source packet,
  - a chronological account of each required recruitment step,
  - a concise applicant disposition table,
  - a closing statement on completion of the recruitment process.
- The compliance memo should read like an internal issue-spotting memo with:
  - a short executive summary,
  - a flags register organized by issue,
  - an explicit severity scale defined once and used consistently,
  - controlling authority or source basis for each issue,
  - a remediation recommendation for each issue with an owner and urgency.
- Do not combine the memo’s risk analysis into the recruitment report.
- Do not invent missing facts; use bracketed placeholders only when the source packet is genuinely incomplete and the omission itself is the issue.
- For every legal or compliance statement, name the applicable PERM rule, regulatory part, or source-document basis that supports it.
- End the compliance memo with a Recommended Actions section that assigns each action to a role and ties it to the filing timeline or audit risk.
