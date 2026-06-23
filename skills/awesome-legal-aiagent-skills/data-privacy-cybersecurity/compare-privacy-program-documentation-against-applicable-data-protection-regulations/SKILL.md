---
name: compare-privacy-program-documentation-against-applicable-data-protection-regulations
task_id: data-privacy-cybersecurity/compare-privacy-program-documentation-against-applicable-data-protection-regulations
description: Enterprise privacy program gap analyses fail when the agent reviews documents serially rather than building a cross-document picture of the program and reconciling it against applicable data-protection obligations simultaneously.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis Report: Privacy Program Documentation vs. Applicable Data Protection Regulations

## 1. Subject-matter triage

Confirm the engagement scope first, then map the document set to the applicable frameworks before analyzing gaps. This is a multi-framework comparison task, so identify which regimes are actually in play from the materials and do not assume every privacy regime applies to every business line or data flow.

Organize the source set into functional buckets:
- governance and program oversight
- privacy notices and disclosures
- data inventory, records of processing, and data-flow maps
- rights-request and complaint handling
- vendor / processor / service-provider contracting
- security safeguards and incident response
- training, attestations, and audit evidence
- prior incidents, investigations, or regulator correspondence

Treat the data inventory and any records-of-processing materials as the factual anchor, then test the remaining documents against that baseline.

## 2. Failure modes the skill is correcting

- The agent summarizes documents one by one instead of reconciling them into a single compliance picture.
- The agent misses that a policy, notice, contract, or SOP may be inconsistent with the actual data flows reflected elsewhere in the file set.
- The agent fails to test whether the privacy program evidence actually matches the duties triggered by the relevant legal regime.
- The agent overlooks incident materials or prior exposure, leaving a material gap unflagged.
- The agent treats questionnaire answers or diligence responses as self-proving instead of verifying them against underlying documents.
- The agent writes descriptive observations without tying them to a legal obligation, source document interaction, and practical consequence.
- The agent omits a clear severity label, making prioritization difficult for diligence users.

## 3. Legal frameworks / domain conventions that apply

Apply only the regimes supported by the source materials and scope instructions.

- GDPR: controller and processor governance, lawful basis, transparency, data subject rights, records of processing, processor contracting, transfers, security, DPIAs, breach notification, and accountability.
- HIPAA: privacy and security program requirements, permitted uses and disclosures, business associate contracting, safeguards, breach response, and notice-related obligations where relevant.
- CCPA/CPRA: notice at collection, privacy policy disclosures, consumer rights handling, vendor / contractor / service-provider arrangements, sensitive personal information limits, and cross-context behavioral considerations where implicated.
- General privacy-program conventions: documented policies, assigned ownership, escalation paths, training, retention, and periodic review.
- Due diligence convention: compare representations against the underlying documents and treat inconsistencies as findings, not drafting nuisances.

For each proposition, cite the controlling authority by name and section where possible, using the authority reflected in the source set or the generally recognized regulatory provision that governs the point.

## 4. Analytical scaffolds

Start by listing the applicable framework(s) and the document categories that will be used to test them. If more than one framework or processing stream is in scope, enumerate them explicitly before analyzing.

For each framework, test the program by element:
- governance and accountability
- data inventory / records
- lawful basis / permitted use / disclosure theory
- notice and transparency
- rights handling and escalation
- vendor and third-party controls
- security safeguards
- incident response and breach notification
- training and monitoring
- international transfers, if implicated
- special-category / sensitive-data handling, if implicated

For each issue:
- identify the source document(s) that establish the factual baseline;
- identify the governing legal requirement or regulatory convention;
- state the mismatch or omission;
- note any cross-document inconsistency that deepens the gap;
- explain the downstream consequence for the diligence client;
- assign a severity level from the stated scale.

Use the data inventory or equivalent record as the control document for testing whether notices, contracts, SOPs, and security measures are aligned to real processing activities. Where a third-party relationship appears in the data map, verify that the corresponding contract or addendum exists and covers the relevant processing role and obligations. Where a prior incident appears, test whether it was handled, remediated, and documented in a way consistent with the applicable regime.

## 5. Vertical / structural / temporal relationships

Use the hierarchy of documents to resolve conflicts:
- if the privacy manual conflicts with the rights-request SOP, test the more operational document against the recorded workflow and evidence of actual handling;
- if the notice conflicts with the inventory, treat the inventory as the factual trigger and the notice as the disclosure instrument to be corrected;
- if the contract conflicts with the data map, determine whether the counterparty role was misclassified or whether the contract is missing required terms;
- if training or audit evidence predates a significant program change, assess whether the material is stale rather than current.

Time matters. Distinguish between current controls, legacy controls, and remediation items that should have been implemented after an incident, program change, or regulatory trigger. If a document is dated but superseded, state that the older version cannot carry current compliance weight.

## 6. Output structure conventions

Produce a due-diligence-ready gap analysis report suitable for insertion into `privacy-gap-analysis-report.docx`.

Begin with a concise executive summary that includes:
- the applicable framework(s),
- an overall risk assessment,
- the most material gaps requiring prompt remediation,
- and a brief note on whether the program appears internally consistent.

Define the severity scale once at the top and apply it uniformly, such as:
- Critical
- High
- Medium
- Low

Then provide findings organized by framework and program element. Each finding must include:
- regulation / authority
- program element
- severity
- gap description
- source document(s) reviewed
- why the issue matters for compliance or diligence
- recommended remediation
- any cross-document inconsistency

Where multiple frameworks apply to the same issue, either separate the analysis by framework or make the overlap explicit in the entry.

Include a dedicated cross-cutting section for inconsistencies between policies, notices, inventories, contracts, questionnaires, and evidence files.

End with a Recommended Actions block. Each action must:
- state the required action in the imperative,
- name the responsible role or owner if the documents identify one,
- and include a timing anchor tied to the diligence process, regulatory deadline, or immediate remediation need.

Keep the report factual, source-tethered, and verification-oriented. Do not write generic privacy commentary; each conclusion should be traceable to a legal source and a document mismatch or omission.
