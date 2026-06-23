---
name: identify-compliance-issues-in-employee-i9
task_id: immigration/identify-compliance-issues-in-employee-i
description: Audit employee I-9 forms against the applicable completion, document, and consistency requirements, using roster or intake data as needed to verify timing and form-level accuracy at the individual employee level.
activates_for: [planner, solver, checker]
---

# Skill: Identify Compliance Issues in Employee I-9 Forms

## 1. Subject-matter triage

Treat each I-9 as an employee-specific compliance record, not as a generic form exercise. Match each form to the roster or intake record before drawing conclusions, because timing, eligibility, and reverification analysis depend on the employee’s hire or start date and any later status-change information. If the source set contains an ICE notice or engagement letter, use them to anchor the audit’s purpose, scope, and response posture.

## 2. Failure modes the skill is correcting

- Reviewers spot missing fields but fail to tie the form to the employee record, so timing errors and mismatches are missed.
- Section 1 is treated as a checkbox exercise without checking whether the selected attestation, signature, and date are complete and internally consistent.
- Section 2 is reviewed only for presence of a document, not for document title, authority, number, expiration, or whether the document was acceptable when presented.
- Inconsistencies between Section 1 and Section 2 are folded into a single finding instead of being isolated as distinct compliance issues.
- Reverification obligations are overlooked for employees whose authorization has a limited duration.
- Findings are summarized in the aggregate before the individual employee issues are fully developed, making corrective action and agency response harder.
- The report describes defects without identifying severity or practical next steps.

## 3. Legal frameworks / domain conventions that apply

- Section 1 must be completed by the employee on or before the first day of employment for pay; Section 2 must be completed by the employer within the applicable post-hire business-day window under the I-9 rules.
- Business-day timing must be measured against the ordinary workplace calendar, excluding weekends and applicable holidays.
- The citizenship or work-authorization attestation in Section 1 has multiple options; a narrower status selection requires careful consistency review against the available record.
- Section 1 and Section 2 must align: the attestation, document category, document details, and expiration dates should fit together coherently.
- A document expired before Section 2 completion is a Section 2 problem; a document that was valid when examined is not defective merely because it later expired.
- Reverification analysis turns on whether work authorization expires and whether the employer timely documented continuation of authorization.
- When relying on legal propositions, identify the governing Form I-9 rule or practice authority by name rather than stating conclusions in the abstract.

## 4. Analytical scaffolds

1. Build the employee map: list each employee, tie the I-9 to the roster/intake record, and capture hire or start date, job start date if different, and any later status information relevant to reverification.
2. Confirm Section 1 completion: verify the correct attestation box, signature, date, and any required fields are present.
3. Check timing: calculate the elapsed business days from hire or start date to Section 2 completion and flag late completion.
4. Review Section 2 document data: verify the document title, issuing authority, document number, and expiration date are recorded with enough precision to support audit review.
5. Test document validity at presentation: determine whether the document was acceptable and unexpired when completed, using the completion date and recorded expiration date.
6. Check Section 1/Section 2 consistency: assess whether the selected attestation matches the document type and any other record information.
7. Assess reverification: identify employees whose authorization expires or has expired and determine whether a follow-up action is required.
8. Separate issues by type: timing, missing information, document defect, internal inconsistency, and reverification should be reported as distinct findings unless the source facts truly overlap.

## 5. Vertical / structural / temporal relationships

Work from the employee level upward: form, employee record, then aggregate themes. Preserve the date sequence for each employee because I-9 compliance is temporal; a form that looks complete on its face may still be defective if the required event occurred too late or after expiration. Where the source set contains multiple time anchors, state which one controls the analysis and why. If only one employee or one form is in scope, say so expressly and explain the basis for that scope.

## 6. Output structure conventions

- Draft a client-ready audit report, not a checklist dump.
- Start with a brief scope note identifying the source materials reviewed and the overall audit objective.
- Include a defined ordinal severity scale at the top and apply it uniformly to every issue entry.
- For each employee, provide: employee identifier, relevant dates, the specific issue, severity, concise analysis, and a practical corrective action.
- Keep employee-level findings before any aggregate summary.
- After the individual entries, provide an aggregate theme summary grouped by deficiency type and a short priority-action section for response preparation.
- End with a recommended actions block that assigns each step to a role named in or implied by the source materials and ties it to a deadline or immediate urgency.
- Use conventional audit language and enough detail to support correction, escalation, and follow-up, but do not copy internal source wording verbatim.
