---
name: hls-extract-pharma-data-privacy-compliance
task_id: healthcare-life-sciences/extract-pharmaceutical-data-privacy-compliance
description: Compiles a regulatory obligation register for a pharmaceutical digital health platform launch covering healthcare privacy and security, consumer communications consent, anti-kickback and patient-assistance-program structure, substance-use-disorder confidentiality, multi-jurisdiction breach notification, professional licensure, and consumer health-data notification obligations.
activates_for: [planner, solver, checker]
---

# Skill: Extract Pharmaceutical Digital Health Platform Data Privacy Compliance Obligations

## 1. Subject-matter triage
- Treat the source set as a compliance-mapping exercise for a launch-ready digital health platform, not as a generic privacy memo.
- First identify the jurisdictions, data types, communication channels, and operational entities implicated by the documents.
- Separate healthcare-regulated data flows from consumer-facing data flows, and separate platform operations from any product, marketing, assistance, or clinical workflows.
- If the documents are internally inconsistent on scope, status, ownership, or compliance readiness, flag the inconsistency rather than harmonizing it.

## 2. Failure modes the skill is correcting
- Physician licensing obligations across the jurisdictions where the platform facilitates physician-patient interactions are systematically overlooked even though unauthorized practice of medicine risk is material for any multi-jurisdiction telehealth or digital health platform.
- Compliance documentation that optimistically characterizes the entity's status is accepted without scrutiny rather than tested against the actual source documents; conflicting evidence must be identified and the optimistic claim flagged as unverified.
- Obligations are summarized at a high level without being tied to a specific source document, governing rule, operational owner, and practical remediation path.
- Parallel regimes are collapsed into one bucket, causing healthcare privacy, consumer communications, breach notification, substance-use-disorder confidentiality, and consumer health-data obligations to be treated as interchangeable when they are not.
- Platform launch materials are read for strategy but not for compliance mechanics, leaving consent, notice, security, and licensure gaps undiscovered.
- Issues are described without a uniform severity assessment, which makes prioritization impossible.
- Findings are stated without naming the controlling legal authority or framework that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply
- Healthcare privacy marketing analysis: communications that use protected health information to encourage patients to purchase or use branded products may require written authorization; assess purpose, audience, content, and any remuneration, sponsorship, or product tie-in.
- Healthcare security risk assessment: the applicable privacy/security framework requires a current, comprehensive risk analysis covering the systems that process electronic protected health information; a new platform needs platform-specific coverage unless an existing analysis clearly extends to it.
- Consumer text and call consent requirements: automated texts and prerecorded voice calls generally require prior express written consent; enrollment mechanisms must be tested for specificity, disclosure, and scope, and branded product messages may be marketing.
- Anti-kickback and patient-assistance-program structure: patient-assistance programs that automatically enroll patients into marketing communications may create inducement or steering risk when tied to the company's own products or services.
- Substance-use-disorder confidentiality: records of substance-use-disorder treatment have confidentiality requirements beyond baseline healthcare privacy rules; consent, redisclosure, and court-order requirements may differ and should be mapped separately if such data flows are present.
- Multi-jurisdiction breach notification: breach notice rules differ by jurisdiction on timing, recipients, and content; a single incident affecting multiple jurisdictions requires a jurisdiction-by-jurisdiction notice map.
- Professional licensure across jurisdictions: a physician generally must be licensed where the patient is located; platform-facilitated interactions should be tested against each operational jurisdiction for unauthorized-practice risk.
- Consumer health-data notification: if the platform has a consumer-facing component outside healthcare-privacy coverage, consumer health-data notification and related notice obligations may apply alongside healthcare rules.
- Use the authority that appears in the source documents when present; otherwise cite the generally recognized statute, regulation, rule, or framework supporting each obligation.

## 4. Analytical scaffolds
1. For each identified obligation, capture: controlling authority or framework reference → obligation description → current compliance status → severity → responsible business function → remediation timing.
2. Build the register from the source documents by reading for operational triggers: who is acting, what data is used, which channel is used, where the patient or user is located, and whether the conduct is marketing, treatment, assistance, or security-related.
3. For healthcare privacy marketing, test each communication type against the marketing definition and identify any branded communications using protected health information that require authorization.
4. For healthcare security, confirm whether the new platform has its own risk analysis or whether an existing analysis clearly covers the new systems, data flows, and vendors.
5. For consumer consent, analyze the mechanism for automated communications and determine whether the disclosure and opt-in mechanics are sufficient for the channel and message type.
6. For anti-kickback and patient-assistance structures, evaluate whether enrollment, incentives, or messaging create a steering concern or product-linked benefit.
7. For substance-use-disorder data, identify whether any such treatment data is in scope; if yes, map the separate confidentiality, authorization, and redisclosure requirements distinctly from general privacy rules.
8. For breach notification, enumerate each jurisdiction implicated by the source documents and test notice timing, recipient, and content requirements separately for each one.
9. For professional licensure, identify the jurisdictions of operation and confirm whether each clinician is licensed where the patient is located.
10. Challenge optimistic compliance statements against the underlying documents; where the documents contradict a claimed state of compliance, mark the claim as unverified and cite the conflict.
11. Do not collapse distinct obligations into one row unless they truly share the same governing authority, trigger, owner, and remediation path.

## 5. Vertical / structural / temporal relationships
- Start with the platform structure: entity, product line, patient or user populations, data categories, and communication channels.
- Then map the vertical flow of regulated information from collection to use, disclosure, storage, messaging, and incident response.
- Track temporal dependencies where launch readiness depends on prior completion of policies, notices, consent configuration, security review, or licensing coverage.
- Where a jurisdiction-specific rule depends on user location, communication timing, or discovery of an incident, make the timing anchor explicit in the register.
- If multiple jurisdictions, communication types, or data categories are implicated, enumerate them explicitly before analysis and produce a row for each applicable obligation.

## 6. Output structure conventions
- Produce a regulatory obligation register, not a narrative memo.
- Use a conventional table format with columns that include: jurisdiction or framework, controlling authority, obligation, source-document basis, compliance status, severity, responsible function, and remediation deadline or timing anchor.
- Define the severity scale once and apply it uniformly across all entries.
- Group entries by framework in a practical order: healthcare privacy/security, consumer communications, anti-kickback and assistance programs, substance-use-disorder confidentiality, breach notification, professional licensure, and consumer health-data notification.
- Each entry should state the obligation plainly, note whether the source documents confirm compliance, and identify any gap, ambiguity, or contradiction.
- Where a legal conclusion depends on a rule, cite the rule or framework by name and section or comparable pinpoint reference.
- End with a short recommended actions section that assigns the next steps to the relevant business owner or counsel and ties them to launch timing.
