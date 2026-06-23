---
name: state-privacy-law-compliance-timeline
task_id: corporate-governance/assess-compliance-timeline-for-newly-enacted-state-privacy-law
description: Compliance gap analysis and remediation timeline for a newly enacted state consumer data privacy statute, identifying gaps in consumer rights procedures, sensitive data handling, data processor agreements, and enforcement risk analysis.
activates_for: [planner, solver, checker]
---

# Skill: State Consumer Data Privacy Law Compliance Timeline

## 1. Subject-matter triage (only if applicable)

- Confirm the statute’s applicability triggers before assessing controls: business scope, data volume, revenue, and any statutory carveouts.
- Map the privacy program documents against the statute’s operative definitions, with special attention to data inventory, processing purposes, and any representations in the privacy notice.
- Identify whether the statute is in force, whether any compliance grace period applies, and whether the remediation timeline must be staged before or after the effective date.
- If the source set includes multiple internal documents, first inventory them by function: notice, policy, rights workflow, vendor management, data inventory, and risk assessment materials.

## 2. Failure modes the skill is correcting

- Failing to test threshold applicability before analyzing controls, which can produce a false compliance roadmap.
- Misclassifying encoded, hashed, or pseudonymized biometric identifiers as outside the biometric category because of format rather than underlying substance.
- Collapsing all consumer-rights requests into one deadline and omitting the statute’s notice, extension, or response mechanics.
- Missing the distinction between mandatory cure language and discretionary cure language in enforcement provisions, which changes the risk timeline.
- Treating sensitive-data handling, consumer-rights operations, and vendor-contract controls as a single general privacy issue instead of distinct compliance workstreams.
- Omitting a severity rating, which makes the gap analysis hard to triage.
- Stating a problem without tying it to the controlling statutory section, the affected document, and the operational consequence.
- Providing diagnosis without a concrete remediation plan, owner, and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- Start with the statute’s definitions and scope provisions; the analysis should track the statutory text section-by-section rather than rely on generic state-privacy assumptions.
- Consumer rights analysis should follow the statute’s specific rights architecture: access, correction, deletion, portability if recognized, and opt-out rights for targeted advertising, sale, or profiling if covered.
- Response timing must be read from the statute’s consumer-request procedure section, including any extension mechanics and notice obligations.
- Sensitive-data treatment must follow the statute’s definition and consent mechanics, including special rules for biometric, health, precise-location, and children’s data where applicable.
- Biometric classification should be based on the nature of the identifier or measurement, not on whether it is stored, transmitted, or hashed in a particular format.
- Data protection assessment obligations, if present, should be analyzed by processing purpose and risk profile, not merely by the label of the dataset.
- Processor or vendor agreements should be reviewed against the statute’s required contractual terms, including processing instructions, confidentiality, audit or inspection rights, subprocessors, and deletion/return obligations.
- If the statute contains a cure provision, determine whether the attorney general “must” offer the cure period or “may” offer it, and identify the point at which the enforcement posture changes.
- Enforcement analysis should cite the statute’s civil-penalty provision and any express exclusions or limits on private enforcement.

## 4. Analytical scaffolds

- Begin with a scope gate:
  - identify the statute section establishing applicability;
  - confirm whether Meridian falls within the covered entity definition;
  - note any uncertainty and state what additional fact would resolve it.
- Build the gap analysis by control family:
  - consumer notice and disclosures;
  - consumer-rights intake and response workflow;
  - sensitive-data and biometric handling;
  - data minimization and retention governance;
  - assessment or DPIA-style review;
  - vendor/processor contracting;
  - internal escalation and recordkeeping.
- For each gap, apply a consistent triage frame:
  - identify the governing statutory section;
  - compare the statute’s requirement to the current program artifact;
  - state whether the control is absent, partial, or misaligned;
  - explain the practical consequence if not remediated.
- For biometric or sensitive-data issues, trace the issue through the data lifecycle:
  - collection;
  - use;
  - sharing/disclosure;
  - storage and retention;
  - deletion or de-identification.
- For consumer-rights procedures, test each request type separately rather than using a generic “privacy requests” process.
- For vendor controls, review each processor relationship independently where the source materials show different scopes or purposes.
- For enforcement risk, separate legal exposure from operational exposure:
  - statutory violations;
  - response-time failures;
  - contracting deficiencies;
  - documentation gaps that undermine good-faith defense.
- When the statute includes multiple timing regimes, lay them out chronologically:
  - effective date;
  - any pre-enforcement period;
  - cure window;
  - post-cure enforcement phase;
  - internal target dates for remediation.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If any product or workflow processes biometric or other sensitive data, that issue should be treated as upstream and cross-cutting because it can trigger notice, consent, assessment, and vendor-flowdown obligations at once.
- If the privacy program lacks a written minimization or retention rule, that omission may amplify multiple downstream failures, including request handling, deletion, and vendor oversight.
- If the source documents show that request intake, approvals, and fulfillment are split across teams, the timeline should reflect handoffs and escalation dependencies, not just a final due date.
- If the statute’s cure language changes from mandatory to discretionary after a trigger point, remediation completed before that transition deserves priority because it can materially reduce enforcement exposure.
- If vendor agreements are deficient, remediation should be sequenced early because contract amendments often depend on procurement, legal, and business-owner signoff.
- If the company’s data inventory is incomplete, treat inventory completion as a prerequisite to finalizing the rest of the roadmap.

## 6. Output structure conventions

- Write the memorandum as a professional advisory document with a brief executive summary, followed by a structured gap analysis and a dated remediation roadmap.
- Define one ordinal severity scale at the outset and apply it uniformly to every issue entry.
- Organize the body by compliance theme rather than by document name, but cite the specific source artifact reviewed for each issue.
- For each issue entry, include:
  - severity;
  - statutory authority;
  - source document(s) reviewed;
  - the gap;
  - why it matters;
  - recommended remediation;
  - responsible owner or function;
  - timing anchor or deadline;
  - any cross-reference to related controls or disclosures.
- If a control appears partially compliant, say what is already in place and what is still missing.
- Include a separate enforcement-risk section that explains the statute’s penalty mechanics and the practical enforcement posture, using the controlling statutory provisions.
- Include a remediation roadmap section that orders actions by urgency and dependency, with near-term, intermediate, and longer-term milestones.
- End with an explicit Recommended Actions block using imperative verbs, named owners, and timing anchors tied to the statute’s effective date, cure period, or other regulatory milestone.
- Preserve document-drafting discipline: conclusions should be tied to the source materials and the statute, not to general privacy-policy aspirations.
