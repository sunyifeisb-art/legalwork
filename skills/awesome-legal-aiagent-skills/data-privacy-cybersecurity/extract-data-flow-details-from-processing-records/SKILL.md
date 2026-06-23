---
name: extract-data-flow-details-from-processing-records
task_id: data-privacy-cybersecurity/extract-data-flow-details-from-processing-records
description: Data flow extraction from processing records fails when the agent does not systematically reconcile the primary record of processing against supporting agreements, transfer assessments, and technical architecture to surface discrepancies between the documented and actual data flows.
activates_for: [planner, solver, checker]
---

# Skill: Extract Data Flow Details from Processing Records — Data Mapping Report

## 1. Subject-matter triage

This task is a document-reconciliation exercise centered on the record of processing activities, related processing agreements, transfer assessment materials, and architecture diagrams or system maps.

Treat the record of processing activities as the anchor, but do not treat it as conclusive if the supporting documents show a different operational reality. Build the mapping from the record outward, then test each entry against the contractual and technical sources.

If a regulator-facing notice, audit request, or similar prompt is included, use it to prioritize the processing activities and data flows most likely to be scrutinized. Do not let that prompt displace the full cross-document review.

## 2. Failure modes the skill is correcting

- Extracting data flow details document-by-document instead of reconciling the record, agreements, transfer assessment, and architecture into one unified map.
- Omitting architecture or system-flow materials, even though they often reveal the actual path of personal data better than legal descriptions.
- Treating transfer assessment materials as optional background instead of a primary check on international transfer descriptions, transfer mechanisms, and safeguards.
- Failing to surface mismatches between what the record says and what the supporting documents or architecture show.
- Collapsing multiple processing activities or environments into one generic narrative instead of tracing each one separately.
- Reporting discrepancies without tying them back to the source document that creates the gap and the compliance consequence that follows.
- Ignoring the regulator-facing prompt when it identifies likely hot spots or priority processing activities.

## 3. Legal frameworks / domain conventions that apply

- The record of processing activities should capture, for each processing activity, the purpose, categories of data subjects, categories of personal data, categories of recipients, international transfers, transfer mechanism, retention period, and security measures.
- The record should be treated as a living compliance document; if the supporting materials show a different arrangement, that inconsistency is itself a gap.
- Controller-processor and processor-subprocessor documentation should align with the recorded processing scope, categories, locations, and onward disclosures.
- Where international transfers are described, the transfer mechanism and the assessment of supplementary measures should be consistent across the record, the relevant agreement, and the transfer assessment.
- Architecture documents are evidence of actual data movement, system access, hosting, vendor routing, and location, and should be reconciled with the legal record rather than assumed to be secondary.
- The governing legal basis, transfer basis, and security framework should be cited as reflected in the source set; do not state a compliance conclusion without identifying the provision, standard, or contractual clause the conclusion depends on.
- An issues register should capture every discrepancy, identify the source of the discrepancy, and state the operational or compliance effect.

## 4. Analytical scaffolds

- Start by enumerating each processing activity in the record as a separate item before analysis.
- For each item, extract the stated purpose, data categories, recipient categories, transfer details, retention, and security measures.
- Match each item to the corresponding agreement, addendum, annex, or sub-processor document; compare scope, data types, locations, and onward-sharing terms.
- Review the transfer assessment for the same item; compare the transfer route, mechanism, risk analysis, and supplementary measures against the record and agreement language.
- Review architecture documents for the same item; identify actual systems, vendors, interfaces, storage locations, or cross-border flows that are not reflected in the record.
- If multiple versions of a document exist, note the operative version and reconcile any later amendments or annexes against the base record.
- For every discrepancy, capture the document cross-reference, the nature of the mismatch, the compliance or operational consequence, and the correction needed.
- If the source set contains only one processing activity, state that explicitly and explain why no broader enumeration is required.

## 5. Vertical / structural / temporal relationships

Map each processing activity vertically across the source set: record entry → agreement terms → transfer assessment → technical architecture → any amendment or annex.

Also check temporal ordering. Later amendments, updated annexes, and revised architecture should supersede earlier descriptions where they govern the current operating state. If a document is dated later but does not appear to be implemented, flag that mismatch rather than assuming implementation.

Where one system feeds another, or where a processor passes data to a sub-processor or hosting environment, distinguish the first collection, internal processing, onward disclosure, storage, transfer, and deletion stages. Do not flatten the flow into a single endpoint.

## 6. Output structure conventions

- Write a data-flow extraction report, not a narrative memo alone.
- Include a short scope section identifying the document set reviewed and the processing activities mapped.
- Include a mapping section organized by processing activity, with each row showing the record entry, supporting documents, actual flow evidence, and any inconsistencies.
- Include an issues register with an explicit ordinal severity scale defined once at the top and applied consistently to every entry.
- For each issue, state: processing activity; discrepancy type; source document(s); severity; effect on compliance, operations, or transfer posture; and recommended correction.
- Use direct citations or document references wherever the source set allows it, but do not invent authorities not supported by the materials.
- End with a concise Recommended Actions section that assigns an action, the responsible business or legal owner, and a timing anchor tied to the review, remediation, or filing milestone.
- Deliver the file exactly as instructed: `data-flow-extraction-report.docx`.
