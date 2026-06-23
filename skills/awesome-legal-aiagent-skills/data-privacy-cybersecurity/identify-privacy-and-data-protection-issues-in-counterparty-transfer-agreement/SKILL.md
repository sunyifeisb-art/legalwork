---
name: identify-privacy-and-data-protection-issues-in-counterparty-transfer-agreement
task_id: data-privacy-cybersecurity/identify-privacy-and-data-protection-issues-in-counterparty-transfer-agreement
description: Data transfer agreement issue memoranda should be framed by the relevant supervisory communications and guidance, and should reconcile transfer-mechanism status, anonymisation analysis, and the actual data inventory against the agreement’s provisions.
activates_for: [planner, solver, checker]
---

# Skill: Identify Privacy and Data Protection Issues in Counterparty Data Transfer Agreement — Issue Memorandum

## 1. Subject-matter triage

This is a comparative issue-spotting task. Start by mapping the full source set: the draft agreement, supervisory communications or warning letters, transfer-status materials, anonymisation assessment, supervisory guidance, internal communications, and the data inventory. If more than one transfer flow, entity, jurisdiction, or data category is implicated, enumerate them first and analyze each separately before drafting the memorandum.

## 2. Failure modes the skill is correcting

- Agreement issues are assessed against generic privacy principles while ignoring the specific supervisory communication; any regulator-identified concern should be treated as a priority gap and matched to the draft clause that leaves it unresolved.
- Transfer provisions are read in isolation from the transfer-status materials; if the agreement depends on a transfer path that is unsupported, outdated, or incomplete, the memorandum should flag the mechanism as defective and explain why.
- The anonymisation assessment is not used to test carve-outs for anonymised or de-identified data; if the assessment shows the data remains within scope, the agreement’s exclusion is overstated.
- The data inventory is not reconciled to the agreement’s scope clause; under-inclusive scope, missing categories, or omitted processing purposes must be called out.
- The memorandum describes defects but stops short of consequence, cross-reference, or fix; each issue must connect the clause, the supporting source, and the client impact.
- Findings are stated as “high priority” or “urgent” without a uniform severity scale; every issue needs an ordinal severity label.
- Recommendations are generic; each should identify who should act and when, tied to the regulatory or transaction milestone.
- Legal conclusions are asserted without naming the controlling rule, regulation, or guidance that supports them.

## 3. Legal frameworks / domain conventions that apply

- Cross-border transfer frameworks: adequacy-style mechanisms, standard contractual clauses or equivalent instruments, binding internal rules, and derogations. The agreement should specify the operative mechanism for each relevant flow and align the drafting with the evidence of status or implementation.
- Supervisory communications: warning letters, investigation notices, and other formal regulatory communications identify concrete compliance concerns; issues reflecting those concerns should be escalated in severity and addressed expressly in the recommended fix.
- Supervisory guidance: use authority guidance as a benchmark for transfer structure, scope, and security expectations where it addresses the relevant scenario.
- Anonymisation standard: data falls outside the privacy regime only if it is irreversibly de-identified under the applicable standard; pseudonymised or otherwise re-identifiable data remains in scope unless the assessment shows otherwise.
- Data processing scope: the agreement’s data categories, purposes, recipients, retention, onward transfer, and security obligations should match the actual inventory and internal communications.
- Party-role characterization: the legal roles assigned in the agreement must match the real arrangement so the correct transfer tool, obligations, and safeguards are used.
- Core privacy obligations to test clause by clause: rights handling, security, subcontractor or onward-transfer controls, breach notification, governance, audit/cooperation, and dispute escalation.
- Where a proposition depends on authority, cite the controlling source by name and section or part when available in the source materials, or the generally recognized authority for the point.

## 4. Analytical scaffolds

- Read the supervisory communication first and extract each regulator concern, then compare it to the draft agreement provision that should respond to it.
- Read the transfer-status materials and determine whether the transfer mechanism stated in the agreement is actually supported, complete, and current.
- Read the anonymisation assessment and test whether any carve-out in the agreement is valid for the data at issue.
- Read the internal communications to identify the parties’ intended allocation of roles and any prior positions that the draft should reflect.
- Read the data inventory to confirm the agreement’s scope captures all relevant data flows, categories, and processing purposes.
- Read the supervisory guidance to identify any transfer-specific expectations on structure, security, or documentation.
- Review the agreement clause by clause against the source set:
  transfer mechanism and legal basis; scope of data covered; party roles; rights handling; security; subcontractors and onward transfers; breach notification; audit/cooperation; retention/return/deletion; governance and dispute resolution.
- For each issue, record:
  clause or topic | controlling authority or source reference | severity | cross-reference to the supporting document or related clause | consequence to the client | recommended fix.
- Where the source documents provide a threshold, timing marker, inventory category, or transfer status, use it to anchor the seriousness of the issue.
- If only one transfer flow or one data set is in scope, state that expressly; otherwise produce a separate entry for each distinct flow or category.

## 5. Vertical / structural / temporal relationships

- Treat supervisory findings as upstream signals: if the regulator has already identified the point, the agreement should expressly cure it rather than merely imply compliance.
- Treat the anonymisation assessment as a scope-control document: if it undermines an exclusion, broaden the agreement’s scope and associated obligations.
- Treat the data inventory as the control for completeness: if a category or use appears there but not in the agreement, the omission is a drafting gap.
- Treat transfer-status evidence as time-sensitive: if status is pending, expired, incomplete, or conditional, the memorandum should explain the temporal defect and the operational risk of relying on it now.
- Treat internal communications as interpretive context, not dispositive law: they can confirm intended allocation, but they do not override the regulatory framework.

## 6. Output structure conventions

- Produce a severity-ranked issues memorandum in conventional legal memo form, with the most serious regulatory or structural issues first.
- Define the severity scale once at the top and apply it consistently to every entry.
- Open with a brief executive summary of the regulatory context, the principal defects, and the overall risk posture.
- For each issue, use a compact but complete format: subject / clause or topic / severity / authority or source / issue / consequence / fix.
- Every issue should be closed with three elements: a concrete scale or status reference from the source set, a cross-reference to the related clause or document, and the downstream consequence for the client.
- End with a Recommended Actions block that assigns each action to a role named in the source materials and gives a timing anchor tied to the transaction or regulatory timeline.
- Use clear file naming consistent with the instruction set, and ensure the memorandum is written as the substantive deliverable rather than a placeholder summary.
