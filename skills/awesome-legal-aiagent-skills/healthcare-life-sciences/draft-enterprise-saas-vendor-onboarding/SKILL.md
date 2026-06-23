---
name: hls-draft-enterprise-saas-vendor-onboarding
task_id: healthcare-life-sciences/draft-enterprise-saas-vendor-onboarding
description: Drafts a tailored healthcare SaaS vendor onboarding questionnaire and internal cover memo that addresses AI/ML governance, security and incident-response enhancements, applicable consumer health-data privacy considerations, and cross-border data handling.
activates_for: [planner, solver, checker]
---

# Skill: Draft Healthcare SaaS Vendor Onboarding Questionnaire

## 1. Subject-matter triage
- Treat the vendor questionnaire as the primary deliverable and the internal cover memo as a secondary explanatory deliverable.
- Build the questionnaire for an enterprise SaaS healthcare analytics vendor that may touch PHI and related health data, and tailor the asks to the specific risk profile signaled by the engagement.
- If the fact pattern indicates AI/ML use, offshore processing, consumer-health-data exposure, or heightened confidentiality categories, expand the questionnaire rather than relying on a generic security template.

## 2. Failure modes the skill is correcting
- The questionnaire stays generic and misses the specific controls that matter for healthcare analytics, especially around data handling, subcontractors, incident response, and governance of automated or model-assisted functionality.
- The cover memo lists enhancements without tying each added section to a concrete risk driver, so internal reviewers cannot see why the template changed.
- Cross-border data handling, data residency, and fourth-party flow-downs are underdeveloped even when the vendor’s operating model suggests offshore support or hosting.
- Consumer-health-data privacy obligations are treated as interchangeable with HIPAA, leaving state-specific consent, access, deletion, and notice issues unaddressed.
- Technical security asks remain high-level instead of eliciting operationally useful detail on encryption, logging, access control, backup, recovery, and escalation.
- Breach notification language is too vague to support vendor management, because it does not force the vendor to identify its detection-to-escalation process and designated notice path.
- If substance use disorder data could be implicated, the questionnaire overlooks heightened confidentiality, consent, and re-disclosure restrictions.

## 3. Legal frameworks / domain conventions that apply
- HIPAA and its implementing rules: use the Privacy Rule, Security Rule, and Breach Notification Rule as the baseline for PHI-related diligence, and ask questions that surface the vendor’s administrative, physical, and technical safeguards.
- State consumer-health-data regimes: when the data set extends beyond HIPAA-covered PHI, ask about state-law consent, notice, access, deletion, and data-use limitations that may apply to consumer health information.
- Cross-border transfer and data residency controls: ask where data is hosted, accessed, backed up, and administered, and what transfer mechanisms and approvals govern movement outside the required geography.
- AI/ML governance norms in healthcare: if the vendor uses models, ask about purpose, transparency, training-data provenance, bias testing, monitoring, human oversight, and rollback or disablement procedures.
- Third-party risk management conventions: probe for a complete subprocessor inventory, security diligence cadence, contractual security obligations, and change-notice practices for new downstream processors.
- Incident response conventions: ask for detection, triage, containment, and external notice timelines, plus the identity and availability of the person or team receiving notice.
- Audit and assurance norms: ask whether the vendor will permit security, privacy, or compliance audits, what notice is required, and what scope or frequency limits apply.
- If substance use disorder data may be involved, include heightened confidentiality and consent prompts consistent with the stricter treatment-record privacy framework.

## 4. Analytical scaffolds
1. Start with the data map: what data is collected, where it comes from, how it is used, who can access it, where it is stored, and where it is transferred.
2. Layer the compliance matrix: for each data type and processing activity, identify the baseline law or control regime that applies and draft questions that reveal how the vendor complies.
3. Expand risk sections only where the fact pattern supports them: AI/ML, offshore processing, state privacy law, incident response, and heightened record categories should appear as targeted modules, not boilerplate.
4. Convert each risk concern into a vendor-supplied fact request, not a legal conclusion: ask for policies, logs, certifications, procedures, ownership, and exception handling.
5. In the cover memo, explain each enhanced section in terms of the specific vulnerability or compliance driver it is meant to surface, so the business and legal reviewers can defend the added diligence.
6. If one risk area is not implicated by the engagement facts, state that it is not included or is limited, rather than forcing a generic question set.
7. Use the questionnaire to drive complete intake: each section should solicit enough detail for follow-up diligence, contract drafting, and security review.

## 5. Vertical / structural / temporal relationships
- Order the questionnaire from foundational intake to specialized overlays: vendor profile, data and use-case description, security, privacy, AI/ML, subcontractors, incident response, audit, then any heightened-data module.
- Tie each enhanced section to the relevant data flow or operational dependency it regulates, so reviewers can see whether the issue is upstream collection, internal use, downstream sharing, or cross-border administration.
- Ask temporal questions where timing matters: retention periods, notification windows, review cadence, assessment frequency, patching cadence, and update cycles for subprocessors or models.
- If multiple jurisdictions, data categories, or processing locations are in scope, enumerate them separately before drafting the questions that apply to each.

## 6. Output structure conventions
- Draft the vendor onboarding questionnaire as a polished intake document with a clear title, short instructions, a submission deadline, and sectioned prompts organized by risk category.
- Use direct questions that elicit specific operational facts; avoid explanatory prose inside the questionnaire except for brief instructions.
- Include a short internal cover memo that tracks the same section order and explains, in concise business/legal terms, why each enhanced module was added.
- Make the memo action-oriented: identify the risk area, the control concern, and the review purpose, without drifting into generic summaries.
- Keep the questionnaire comprehensive but readable, with enough granularity to support downstream contract drafting and diligence follow-up.
- Do not substitute a checklist of labels for actual questions; every section should contain substantive vendor prompts.
- Ensure the primary questionnaire file is fully drafted before the memo is treated as complete.
