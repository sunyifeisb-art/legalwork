---
name: hls-draft-enterprise-saas-vendor-dd
task_id: healthcare-life-sciences/draft-enterprise-saas-vendor-onboarding-due-diligence
description: Drafts a tailored enterprise SaaS vendor onboarding questionnaire and internal cover memo for a healthcare system, with the cover memo linking each questionnaire section to prior internal review themes in general terms and the questionnaire including a response deadline.
activates_for: [planner, solver, checker]
---

# Skill: Draft Enterprise SaaS Vendor Onboarding Due Diligence Questionnaire (Healthcare)

## 1. Subject-matter triage
- Treat the packet as a vendor-onboarding diligence request for an enterprise SaaS provider handling healthcare-system data.
- Separate what must go in the questionnaire from what belongs in the internal cover memo: the questionnaire should elicit facts and documents; the memo should explain why each section was added.
- If the source set includes multiple prior review themes, organize them before drafting so each theme maps to one or more questionnaire sections.
- If the sources are thin on vendor details, preserve breadth in the questionnaire and keep the memo anchored to the review themes actually present.

## 2. Failure modes the skill is correcting
- The cover memo stays generic and fails to connect enhanced sections to the internal review themes that justify them.
- The questionnaire lacks a concrete submission deadline or makes the timing too vague to manage vendor follow-up.
- The draft ignores vendor maturity risk, even where size, staffing, or security program maturity may affect healthcare readiness.
- The draft asks for assurances without requesting the documents, inventories, test evidence, or governance artifacts needed to verify them.
- The draft omits downstream-risk questions for subcontractors, analytics components, and any data shared outside the primary platform.
- The draft treats security and privacy as a single bucket instead of distinguishing subprocessor flowdown, insurance, BC/DR, AI/ML governance, and operational controls.

## 3. Legal frameworks / domain conventions that apply
- Healthcare vendor diligence should reflect privacy, security, and business-continuity expectations appropriate to protected health information and enterprise clinical operations.
- Third-party risk review conventionally requests substantiating documents, not just attestations, for security controls, continuity plans, incident handling, and oversight structure.
- Subprocessor governance should cover inventory, approval/notice practices, security obligations, and flowdown of contract terms to fourth parties where applicable.
- Cyber insurance review conventionally asks for evidence of coverage type, limits, exclusions, and effective dates relevant to data-breach and cyber events.
- AI/ML governance should probe explainability, training-data provenance, bias testing, validation cadence, human oversight, and any restrictions on clinical or operational use.
- BC/DR review conventionally requires both the existence of a plan and proof that it has been tested within a recent, stated period.
- Data handling questions should distinguish where de-identification occurs relative to downstream transmission or analytics processing, not only within the vendor’s core environment.
- Vendor maturity review should ask about security certifications, staffing depth, governance, and escalation structure to gauge whether the vendor can support enterprise healthcare requirements.

## 4. Analytical scaffolds
- Build the internal cover memo around each prior internal review theme: identify the issue category, state its relative priority in plain business terms, and explain the operational risk it presents.
- For each theme, identify the questionnaire section that addresses it and describe the factual or documentary proof that section seeks.
- Include a clear submission deadline in the questionnaire header or opening instructions, plus any return-format guidance needed for tracking.
- Include a vendor maturity section that asks about organizational structure, security leadership, staff roles, certification history, and governance cadence.
- Include a subprocessor section that requests the current inventory, assessment frequency, contractual flowdowns, and any approval or notification process.
- Include a data-flows section that asks where data is de-identified, where it is transmitted, and whether any third-party analytics or hosting components receive identifiable data.
- Include AI/ML questions only if the vendor uses such features; if so, ask for the use case, oversight, validation, bias testing, and training-data sources.
- Include a BC/DR section that asks for the plan, the most recent test date, and the corrective actions taken from any test.
- Include a cyber-insurance section that asks for proof of coverage and the categories of coverage relevant to cyber and privacy events.
- If the packet references a prior internal review, do not summarize it in legalese; translate it into practical diligence questions the reviewer can use.
- End the memo with a concise recommendation for next steps and responsibility allocation, tied to the vendor-response timeline.

## 5. Vertical / structural / temporal relationships
- Map each enhanced questionnaire section to the internal review theme it serves, then order the sections so higher-risk operational items appear before lower-risk administrative items.
- Distinguish present-state controls from future commitments: what exists now, what has been tested, what is pending, and what will change on onboarding.
- Where a control depends on another party, capture the relationship explicitly: primary vendor, subprocessors, hosting providers, analytics components, and any downstream recipients.
- Where timing matters, ask for dates, recency windows, renewal dates, last test dates, and planned remediation completion dates rather than open-ended descriptions.
- Where vendor maturity is in question, connect organizational size, staffing, and governance cadence to the ability to meet the requested control level.

## 6. Output structure conventions
- Produce a polished internal cover memo followed by the vendor questionnaire in one document.
- Use conventional memo formatting: subject, purpose, brief background, why the questionnaire is broader than standard, and a short closing recommendation.
- Use conventional questionnaire formatting: clear instructions, a stated response deadline, section headings, numbered questions, and document-request prompts where needed.
- Write questions so they are answerable by a vendor and directly useful to internal reviewers; avoid narrative prompts that do not yield verifiable facts.
- Keep the cover memo explanatory and concise; it should justify the added sections without repeating the entire questionnaire.
- Make the questionnaire comprehensive enough to support onboarding review, but do not overstate legal obligations or insert unnecessary legal citations.
- Ensure the final document is operationally usable as a standalone onboarding packet, with the memo explaining the rationale and the questionnaire collecting the diligence record.
