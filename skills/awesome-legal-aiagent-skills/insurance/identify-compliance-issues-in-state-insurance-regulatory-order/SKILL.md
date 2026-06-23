---
name: identify-compliance-issues-regulatory-consent-order
task_id: insurance/identify-compliance-issues-in-state-insurance-regulatory-order
description: Agents reviewing a state insurance regulatory consent order summarize the findings by checking penalty calculations, testing whether any cited findings fall outside the relevant examination period or within an applicable exemption, analyzing the scope of any waiver language, and assessing whether the order creates broader regulatory exposure through information-sharing mechanisms.
activates_for: [planner, solver, checker]
---

# Skill: Identify Compliance Issues in State Insurance Regulatory Consent Order — Issue Memorandum

## 1. Subject-matter triage

- Start by identifying the order’s operative scope, the supporting internal documents, and any embedded deadlines, remedial obligations, audit/access requirements, waiver language, and information-sharing provisions.
- If the order addresses multiple findings, periods, jurisdictions, product lines, or remediation tracks, enumerate them before analysis and treat each as a separate issue row.
- Distinguish between findings the client wants to contest, findings to preserve for context, and findings to accept without challenge.

## 2. Failure modes the skill is correcting

- The stated penalty is accepted without checking whether it aligns with the order’s stated rate, count, and any excluded items.
- Findings are treated as coextensive with the order’s examination period even when the underlying support extends beyond that period or depends on later events.
- Statutory or regulatory exemptions are overlooked, causing potentially non-violative conduct to be counted as an admitted issue.
- Waiver language is read too broadly or too narrowly, obscuring what challenges remain available after execution.
- The operational context, including systems migration or remediation activity, is ignored when assessing characterization and repeat-conduct implications.
- Deadline clusters are summarized at a high level, but the deliverable fails to separate each obligation, due date, and consequence of noncompliance.
- Auditor access provisions are not tested for privilege or scope risk.
- Authority to execute the order is assumed without checking internal approval requirements.
- Broader multi-jurisdiction exposure is missed when the order’s findings may be shared or recycled by other regulators.

## 3. Legal frameworks / domain conventions that apply

- Penalty and count review: compare any stated monetary sanction to the order’s own violation count, rate, and excluded matters; reconcile the math against the text before treating the amount as settled.
- Examination-period linkage: a regulatory finding should be tied to conduct within the stated examination window; materials outside that period should be flagged if they are doing the work of the finding.
- Exemption analysis: if a cited practice may fall within a statutory or regulatory exception, analyze the exception by its governing authority and category rather than by general fairness alone.
- Waiver scope: analyze the waiver using the language of the order and the applicable administrative-law principles; distinguish waiver of hearing rights from waiver of arithmetic, scope, authority, or statutory challenges.
- Remediation context: if the cited issue arose during a migration, conversion, or other operational transition, evaluate whether that context affects the characterization, severity, or recurrence analysis.
- Information-sharing exposure: assess whether the order can trigger review, referral, reporting, or reciprocal action in other jurisdictions where the insurer operates.
- Deadline sequencing: where multiple compliance dates cluster close together, map each action to its own deadline and consequence.
- Auditor access and privilege: if an independent reviewer or auditor receives file access, test whether the access language could reach privileged material or work product and whether a narrower protocol is available.
- Executive authority: verify that the settlement signatory had authority under internal governance documents and that any required board or committee approval was obtained in the correct sequence.
- Controlling authority: every legal conclusion should be tied to the governing statute, regulation, order provision, or other authority actually supporting it.

## 4. Analytical scaffolds

1. Scope inventory: list each finding, the relevant period, the supporting source, and whether the finding is challenged.
2. Penalty check: test the stated amount against the order’s internal rate/count structure and any excluded items.
3. Period and exemption check: for each challenged finding, identify the governing period and any potentially applicable exemption or carve-out.
4. Waiver analysis: identify the waiver language, the rights actually waived, and the remaining avenues of challenge.
5. Remediation and timing review: separate each required action, due date, dependency, and consequence for nonperformance.
6. Operational context review: determine whether migration or other transition facts may mitigate characterization or repetition risk.
7. Cross-jurisdiction exposure review: identify where the order’s findings may be visible or portable beyond the issuing state.
8. Access and authority review: analyze auditor access provisions and signatory authority requirements.
9. Non-actionable items: identify matters intentionally not contested and explain why they are left out at a high level.

## 5. Vertical / structural / temporal relationships

- Treat the order, the internal supporting documents, and any governance records as interacting layers; an issue may arise from the mismatch among them rather than from any one document alone.
- Separate pre-order conduct, examination-period conduct, post-period materials, settlement execution, and post-execution remediation obligations.
- When the order references remediation milestones, note whether later steps depend on earlier attestations, reports, system changes, or approval actions.
- If a finding is used to support both an admission and a remediation duty, flag that dual use and assess the downstream exposure if the factual predicate is later narrowed.
- If information-sharing language can transmit the order’s findings to other regulators, analyze the downstream sequence: local order → reciprocal review → broader licensing or supervisory exposure.

## 6. Output structure conventions

- Produce an issue memorandum organized by priority, with each issue presented in an ordinal severity band defined once at the top.
- For each issue, include: the challenged point, the governing authority, the factual basis from the source materials, the scale or scope of the issue, the related document or provision, and the regulatory or operational consequence.
- For each issue, close the analysis by tying it to the source-record scale, the cross-referenced provision or document, and the downstream consequence for the client.
- Include a discrete section for items not being challenged, with a short reason for each exclusion.
- Include a deadline table or calendar that breaks out each obligation, date, owner, and consequence.
- Include a Recommended Actions block at the end with imperative steps, the responsible role, and the relevant deadline or urgency anchor.
- Where the source materials do not support a challenge, say so expressly rather than stretching the record.
