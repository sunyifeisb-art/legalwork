---
name: hls-draft-data-privacy-compliance-manual
task_id: healthcare-life-sciences/draft-data-privacy-compliance-policy-manual
description: Drafts a comprehensive data privacy compliance policy manual and gap analysis for a digital health company operating under overlapping healthcare-privacy obligations, addressing biometric privacy laws, consumer health data statutes, advertising SDK data sharing, and implementation deadlines.
activates_for: [planner, solver, checker]
---

# Skill: Draft Comprehensive Data Privacy Compliance Policy Manual for Digital Health Company

## 1. Subject-matter triage
- Separate the company’s regulated healthcare functions from any other privacy-regulated processing before drafting controls.
- Identify whether the source set reflects a single operating model or multiple business lines with distinct data flows, user populations, or regulatory regimes.
- If the documents implicate more than one jurisdiction, product, or data category, enumerate them first and analyze each on its own footing.

## 2. Failure modes the skill is correcting
- The policy manual is drafted as a generic privacy template and does not map controls to the actual data flows, products, or legal regimes in the source record.
- The gap analysis is omitted, embedded only as narrative, or lacks a standalone remediation view.
- Advertising SDK handling, employee offboarding access revocation, biometric retention/destruction, and consumer health data handling are treated as operational trivia rather than compliance obligations.
- Distinct healthcare-privacy obligations are collapsed into one section even when different activities trigger different rules.
- Deadlines embedded in transaction, financing, or implementation materials are ignored.
- Conclusions are stated without identifying the governing authority that supports them.

## 3. Legal frameworks / domain conventions that apply
- Overlapping healthcare privacy status: map each activity to the applicable privacy and security regime, and keep regulated healthcare processing separate from non-healthcare processing where the source facts require it.
- Biometric data: address notice, consent, retention, destruction, and publication requirements under each implicated state biometric regime.
- Consumer health data: draft a distinct section for consumer health data statutes, including scope, notice, consent, sharing restrictions, and consumer-rights handling.
- De-identification: do not treat shared data as outside privacy regulation unless the manual explains the recognized de-identification method being used and its limitations.
- Advertising SDKs: treat mobile advertising integrations as a distinct risk area because third-party transmission can occur without user awareness or authorization.
- Access revocation: build a documented offboarding workflow for timely removal of access, with verification and accountability.
- Leadership designation: formally assign privacy and security responsibility, even if one person holds multiple roles.
- Deadlines: align the implementation plan with any external milestone in governing commercial, financing, or regulatory documents.
- Controlling authority: when stating a legal proposition, name the statute, regulation, or other authority that supports it instead of relying on bare conclusions.

## 4. Analytical scaffolds
- Start with a data-map: source, collection point, purpose, storage location, sharing path, retention rule, deletion trigger, and responsible owner.
- Separate the analysis by function: regulated healthcare operations, consumer-facing privacy obligations, employee/access controls, technical integrations, and governance.
- For each applicable law or regime, identify: scope, covered data, required notice, consent or authorization trigger, rights-handling process, retention/destruction requirement, and enforcement exposure.
- For each identified gap, state: what the source documents show, what should exist, who owns remediation, what must change, and why the gap matters.
- If more than one product, entity, jurisdiction, or data category is implicated, list them explicitly first and then run the same analytical sequence for each.
- For statutory or regulatory claims, cite the controlling authority by name and section, and tie the conclusion to the text of that authority.
- When deadlines appear in the record, anchor recommendations to those deadlines rather than generic “ASAP” language.

## 5. Vertical / structural / temporal relationships
- Show how company-level privacy governance sits above product-level notices, technical controls, and workforce procedures.
- Distinguish upstream collection, in-process use, downstream disclosure, and end-of-life retention/destruction.
- Track temporal controls separately: onboarding authorization, ongoing access review, offboarding revocation, retention expiration, and destruction.
- Where a control depends on another document or process, state the dependency so the manual reads as an operational system rather than a standalone memo.
- If the source record contains multiple time-sensitive obligations, order them by due date or implementation sequence.

## 6. Output structure conventions
- Produce two distinct documents: a comprehensive compliance policy manual and a separate gap analysis summary.
- The manual should be organized by functional area and should read like a usable policy document, not a project plan or legal memo.
- Include clear policy statements, responsible roles, procedures, escalation paths, recordkeeping expectations, and review cadence.
- Include any required public-facing retention or destruction statements in the relevant policy section where the source law requires publication.
- The gap analysis summary should use a consistent ordinal severity scale stated once at the top, then apply it uniformly to each gap.
- Each gap entry should identify the affected control, the risk or exposure, the responsible party, the remediation deadline or milestone, and the operational or regulatory consequence.
- Close the gap analysis with explicit recommended actions that assign an owner and a timing anchor.
- Keep the deliverables separate in substance as well as format; the summary should not replace the manual, and the manual should not absorb the gap matrix.
