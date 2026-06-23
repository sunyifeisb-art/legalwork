---
name: draft-vendor-onboarding-questionnaire
task_id: intellectual-property/draft-vendor-onboarding-questionnaire
description: Drafting a risk-tiered vendor onboarding questionnaire from vendor management policies and internal directives, requiring identification of cross-document inconsistencies and healthcare compliance questions.
activates_for: [planner, solver, checker]
---

# Skill: Draft Vendor Onboarding Questionnaire

## 1. Subject-matter triage

Identify the governing vendor framework first, then map each source document to the control area it governs: onboarding, privacy, security, finance, insurance, business continuity, subcontracting, sanctions, and ethics. Treat the most formal policy as the baseline, then reconcile more specific or more protective requirements from other documents by issue-spotting, not by averaging. If a document is silent on a control but another document addresses it, flag the gap and decide whether the questionnaire should ask for evidence, a certification, or escalation to legal/compliance.

Separate vendors by risk tier before drafting tiered questions. Use the source materials’ own criteria for tier assignment where available; if multiple criteria exist, enumerate them and assign each questionnaire section to the tiers it actually applies to. If only one tiering logic is supported by the documents, state that explicitly and avoid inventing a parallel scheme.

## 2. Failure modes the skill is correcting

- Producing a generic questionnaire that ignores healthcare-specific privacy and security questions tied to regulated health data, breach handling, and access controls
- Failing to organize the questionnaire by risk tier, which causes over-questioning of low-risk vendors and under-questioning of high-risk vendors
- Omitting an issues memo that identifies cross-document conflicts, gaps, and drafting inconsistencies
- Treating attestations as sufficient where the source materials call for documentary proof, reports, policies, certificates, or logs
- Drafting questions that do not distinguish between baseline onboarding information and heightened diligence for critical vendors
- Missing the downstream operational consequence of unresolved inconsistencies, such as delayed onboarding, heightened monitoring, or escalation to compliance review

## 3. Legal frameworks / domain conventions that apply

- Vendor onboarding questionnaires are typically built around risk-based diligence: data access, operational criticality, spend, geography, and subcontracting intensity drive the scope of review
- If a vendor will handle protected health information or comparable regulated health data, the questionnaire should test whether a business associate-style arrangement is required, whether permitted uses and disclosures are constrained, how breach notice is handled, and whether audit/access rights exist
- Privacy questions should track applicable data protection obligations for the jurisdictions implicated by the source documents and ask for cross-border transfer mechanisms where data may leave the relevant jurisdiction
- Security diligence commonly relies on recognized control frameworks, third-party certifications, pen-test evidence, vulnerability management procedures, and incident response capabilities; where multiple standards are referenced, ask for the actual report or equivalent evidence, not a summary alone
- Subcontracting diligence should require disclosure of material subcontractors, consent/notice obligations, and flow-down of privacy, security, and confidentiality commitments
- Sanctions and restricted-party screening are ongoing controls, not one-time onboarding checks; questionnaire language should reflect continuous monitoring expectations where the source materials require them
- Anti-corruption and conflicts questions are typically calibrated to the vendor’s geographic footprint, access to public-sector touchpoints, and use of intermediaries
- Business continuity and disaster recovery diligence should request the plan, recovery objectives by tier, and testing evidence for critical or high-risk vendors
- Financial stability questions should be tier-sensitive and may include audited financials, credit references, and other objective indicators of solvency or going-concern risk
- Where insurance requirements appear in more than one document, the questionnaire should apply the stricter requirement to the higher-risk tier and identify the discrepancy in the memo
- Every legal or compliance question in the draft should be tied to an identifiable governing source or generally recognized control standard; do not state a rule or obligation without naming the authority or source basis

## 4. Analytical scaffolds

1. Define the vendor-risk tiers using the source documents’ own criteria, then state which questionnaire sections apply to each tier
2. Build the questionnaire from general onboarding information outward to tier-specific diligence, so the draft can be reused across different vendor classes without rewriting the core
3. For each tier, specify insurance, security, privacy, business continuity, and financial questions at the level of evidence requested, not merely policy existence
4. Draft a healthcare privacy section that asks whether regulated health data is involved, whether the required data-processing or business associate arrangement is triggered, what breach notice timeline applies, and whether audit or access rights are available
5. Draft a data privacy section that asks what laws or frameworks apply, what transfer mechanism supports any cross-border data flow, and what retention/deletion practices govern the vendor’s handling of data
6. Draft a security section that asks for certifications, recent assessment reports, pen-test results, vulnerability remediation practices, access controls, logging, and incident response procedures
7. Draft a subcontracting section that requires disclosure of subcontractors, the basis for any consent or notice requirement, and confirmation that obligations flow down contractually
8. Draft a business continuity / disaster recovery section that asks for recovery commitments aligned to tier, last-test date, test scope, and remediation of test findings
9. Draft a financial stability section that asks for current and historical financial evidence appropriate to tier and for any known liquidity, insolvency, or audit concerns
10. Draft sanctions, restricted-party, and anti-corruption questions so they are framed as ongoing controls and not merely onboarding certifications
11. Draft an incident-response section that asks for notification capability, escalation contacts, forensic cooperation, preservation duties, and coordination obligations
12. For the issues memo, identify each inconsistency or gap, explain the practical consequence of the mismatch, and state the questionnaire language that resolves it

## 5. Vertical / structural / temporal relationships

Use the formal policy framework as the baseline, then layer function-specific controls on top of it in this order: legal/privacy, security, finance, operations, and ethics. If a more specific document conflicts with a general one, prefer the more specific requirement for the affected topic and note the reconciliation in the memo.

Where timing matters, ask for the triggering event, the notice window, the review cadence, or the renewal/recertification interval rather than a bare commitment. For ongoing obligations, draft the question to capture whether the vendor has a process, monitor, or calendarized control that persists after onboarding.

Where the source set contains more than one vendor class or more than one diligence threshold, preserve the distinctions in the questionnaire instead of collapsing them into one generic form. If a threshold is not stated, do not invent a number; ask for the vendor’s own policy, the customer’s standard, or escalation to the appropriate owner.

## 6. Output structure conventions

- Produce two deliverables: a vendor onboarding questionnaire and an issues-and-resolutions memo
- Draft the questionnaire in conventional diligence sections such as company information, risk tiering, privacy, security, healthcare data handling, insurance, subcontractors, financial stability, business continuity, sanctions, anti-corruption, and incident response
- Make tier applicability visible at the section or question level so a reviewer can tell which questions are universal and which are conditional
- Prefer questions that solicit named documents, reports, certificates, policies, test results, or contact details over narrative assurances
- In the issues memo, define a simple ordinal severity scale at the top and apply it consistently to each issue
- For each issue entry, state the source conflict or gap, why it matters operationally or legally, and the proposed questionnaire language that resolves it
- End the memo with a concise Recommended Actions block that assigns each action to a role and a timing anchor
- Keep the questionnaire usable as a standalone onboarding tool; do not turn it into a commentary on the documents
