---
name: assess-cpra-regulatory-impact-on-data-broker-relationships
task_id: data-privacy-cybersecurity/assess-cpra-regulatory-impact-on-data-broker-relationships
description: Assess privacy-regulatory impact on counterparty relationships by classifying each relationship under the applicable privacy framework, checking whether the actual data flows and contract terms match that classification, and identifying any missing contractual, disclosure, registration, or consumer-rights steps.
activates_for: [planner, solver, checker]
---

# Skill: Assess CPRA Regulatory Impact on Data Broker Relationships — Regulatory Impact Memorandum

## 1. Subject-matter triage

Identify every counterparty relationship in scope and separate them by agreement and data flow before analyzing risk. If the materials include multiple counterparties, process each one individually and then synthesize only at the end. If there is only one relationship, state that explicitly and explain why no broader comparison is needed.

Distinguish the sources of truth: contract terms, transaction or processing inventory, privacy notices, registration materials, and any regulator correspondence. Do not treat a contractual label as dispositive if the actual flow of data, consideration, or downstream use points to a different legal classification.

## 2. Failure modes the skill is correcting

- Treating every data recipient as a service provider or contractor without testing the statutory criteria against actual processing.
- Missing that a relationship may be a sale, sharing arrangement, or data-broker relationship even if the agreement uses benign labels.
- Reviewing privacy-policy disclosures in isolation instead of checking whether they match the active relationships, data categories, and purposes in the source set.
- Ignoring regulator correspondence, inquiry letters, or advisory materials that signal the issues most likely to draw enforcement attention.
- Failing to connect contract drafting gaps to consumer-rights consequences, registration obligations, or operational remediation.
- Describing a gap without stating its severity, legal basis, and downstream effect on compliance posture.
- Stating conclusions without anchoring them to the controlling CPRA/CCPA rule or other governing authority.

## 3. Legal frameworks / domain conventions that apply

- Relationship classification under the CPRA/CCPA framework: service provider, contractor, third party, and data broker.
- Contract requirements for restricted-use relationships: limits on retention, use, disclosure, sale, sharing, and onward transfer, plus required cooperation and audit-related terms where applicable.
- Sale and sharing analysis: disclosure of personal information for consideration or for cross-context behavioral advertising may trigger opt-out rights and related disclosures.
- Data broker registration and consumer-rights framework: if a counterparty meets the statutory definition of a data broker, evaluate registration and consumer-request obligations.
- Sensitive personal information and enrichment/analytics uses: assess whether heightened rules are implicated by the data categories or inferred attributes.
- Privacy notices and operational disclosures: confirm that public-facing disclosures track actual practices and relationship types.
- Privacy risk assessment obligations: determine whether the processing activity triggers an assessment requirement under the applicable regulations.
- Regulator correspondence and enforcement themes: use any correspondence to prioritize issues, identify likely scrutiny, and shape the remediation sequence.

## 4. Analytical scaffolds

- For each counterparty, classify the relationship by applying the statutory test to both contract language and actual data handling.
- For each classification, test the contract against the mandatory provisions for that role and identify any missing, weakened, or inconsistent terms.
- For each relationship that appears to involve sale or sharing, confirm the associated disclosure, opt-out, and downstream-use controls.
- For each counterparty that may be a data broker, test the statutory definition, then confirm registration status and consumer-facing mechanisms.
- For each issue, state the controlling authority by name and section or part, then explain how the facts fit or fail that rule.
- For each finding, include the severity level, the affected relationship or process, the gap, the compliance consequence, and a concrete remediation step.
- When the source set includes both contract and inventory materials, cross-check them line by line for mismatches in parties, purposes, categories of data, and permitted uses.
- When regulator materials exist, map each cited concern to the company practice it implicates and elevate the severity of any matching gap.

## 5. Vertical / structural / temporal relationships

- If the materials identify a response deadline, remediation date, or regulatory milestone, organize recommendations to fit that timing and note any privilege or response-coordination implications.
- If one agreement feeds multiple downstream uses, analyze each use separately before synthesizing the overall risk posture.
- If a joint analytics or multi-purpose arrangement blurs role boundaries, test each data flow independently; the same relationship may support different classifications for different processing steps.
- If a public notice, internal workflow, and contract conflict, treat the operational mismatch as a distinct issue, not merely a drafting error.

## 6. Output structure conventions

- Write a board-ready regulatory impact memorandum with a concise executive summary, overall risk posture, and the highest-priority remediation themes first.
- Define a simple ordinal severity scale once near the top and apply it consistently to every issue.
- Use a counterparty-by-counterparty findings section with one row or sub-entry per relationship, covering: classification, governing authority, gap, severity, consequence, and recommendation.
- Include a separate section for registration, notice, consumer-rights, and contract-remediation items if those issues arise.
- End with an explicit Recommended Actions section that states the action, the responsible role, and the timing anchor tied to the regulatory or business milestone in the materials.
- Keep the memo self-contained and decision-useful; avoid descriptive repetition and prefer actionable conclusions.
- The deliverable filename must match the instruction exactly: `cpra-data-broker-impact-memo.docx`.
