---
name: draft-vendor-due-diligence-memorandum
task_id: corporate-ma/draft-vendor-due-diligence-memorandum
description: Guides preparation of a vendor due diligence memorandum for a procurement committee where contractual, security, compliance, and reference findings must be synthesized into a structured recommendation.
activates_for: [planner, solver, checker]
---

# Skill: Vendor Due Diligence Memorandum (Procurement)

## 1. Subject-matter triage

- Treat the assignment as an integrated vendor-risk review, not a standalone contract mark-up or a pure security assessment.
- First identify the source set, the contemplated use case, the data types involved, and the decision the procurement committee must make.
- Separate vendor self-representations from independently sourced findings before synthesizing any recommendation.
- If the source materials cover multiple entities, products, agreements, time periods, or sites, enumerate them explicitly and analyze each separately rather than collapsing them into one blended assessment.

## 2. Failure modes the skill is correcting

- The memo summarizes the vendor's self-reported materials without cross-referencing them against independent risk assessments and reference checks, leaving uncorroborated claims unidentified.
- Data security and privacy compliance findings are reported without assessing their implications under applicable health-information privacy requirements and internal procurement policy requirements.
- Contractual risk in the draft agreement is evaluated in isolation from the vendor's security and compliance posture, rather than as part of an integrated risk assessment.
- The memo presents findings without a risk-rated recommendation that the procurement committee can act on.
- The memo describes issues without tying each one to the operative source language, the governing rule, and the practical consequence for the engagement.

## 3. Legal frameworks / domain conventions that apply

- Vendor due diligence scope: a comprehensive vendor DD memo covers contractual terms in the draft agreement, security and compliance posture, information-security testing, financial stability and reference checks, and operational capacity.
- Health-information privacy compliance: vendors who process, store, or transmit sensitive health data should be assessed for applicable privacy and security obligations, including required agreement terms and the vendor's compliance posture.
- Security attestation reports: assess the scope, period, control areas, and any exceptions or gaps in the report, and evaluate whether those issues matter for the contemplated use case.
- Draft agreement review: key contractual risks include limitation-of-liability clauses, service-level commitments, data ownership and return provisions, termination rights, audit rights, and compliance obligations; compare the draft agreement against internal procurement policy requirements.
- Internal procurement policy: the internal policy defines minimum acceptable terms for vendor contracts; deviations must be identified and tracked for approval, remediation, or escalation.
- Reference checks: vendor-provided references and independent assessments should be cross-referenced; any material discrepancies between vendor representations and reference findings must be noted.
- Risk-rated recommendation: the memo should conclude with a risk-rated assessment and the conditions or mitigations required before proceeding.
- Use the controlling authority actually applicable to each proposition, whether drawn from the source materials or from generally recognized privacy, security, contract, or procurement practice; do not state a conclusion without naming the rule, policy, standard, or section supporting it.

## 4. Analytical scaffolds

- Review the draft agreement against the internal procurement policy: identify each material deviation, state the policy requirement or baseline, and explain the practical effect of the deviation.
- Review the privacy and security agreement: confirm required privacy and security elements are present; flag any gaps or ambiguities.
- Review the security report: identify control failures, exceptions, or areas of concern; assess their impact on the contemplated use case.
- Review the vendor questionnaire and risk report: identify self-reported risks, unresolved items, and any claims that require corroboration.
- Cross-reference vendor representations against the independent risk report and reference check summaries; identify discrepancies and determine whether they are explained, minor, or material.
- For each issue, state its relative severity using a consistent ordinal scale defined once at the top of the memo, and keep that severity consistent across the document.
- For each issue, anchor the analysis in the operative source language or metric where available, connect it to any interacting clause, exhibit, control report, or policy requirement, and explain the downstream business, regulatory, operational, or litigation consequence.
- Organize the synthesis by risk category: contractual, security/privacy, operational, and financial.
- End each issue discussion with a concrete proposed fix, condition, or escalation path rather than leaving the point at diagnosis.
- If a category contains only one material issue, say so expressly; if it contains several, address each separately and avoid merging distinct risks into one generalized observation.

## 5. Vertical / structural / temporal relationships

- Track vertical dependencies from policy baseline to draft agreement to security posture to committee recommendation.
- Distinguish current-state findings from forward-looking remediation commitments and note whether a condition must be satisfied before signature, before go-live, or during the term.
- Where timing appears in the materials, tie each recommendation to the relevant milestone, approval gate, or remediation window.
- If controls or obligations are layered across documents, reconcile the hierarchy so that the memo explains which document governs and where the documents diverge.

## 6. Output structure conventions

- Produce one procurement-ready memorandum as the deliverable.
- Use a conventional memo structure: title and purpose, executive summary with a clear recommendation, issue analysis by risk category, integrated risk assessment, and recommended next steps.
- State a uniform severity scale near the top and apply it to every identified issue.
- Close with a Recommended Actions section that lists concrete steps in imperative form, assigns them to the relevant role or function, and ties them to the relevant deadline, milestone, or urgency.
- Keep the memo action-oriented: every legal or operational conclusion should be traceable to a source document, a governing standard, and a practical recommendation.
- Avoid a mere findings list; the final section should translate the analysis into a go / no-go / proceed with conditions decision the committee can use.
