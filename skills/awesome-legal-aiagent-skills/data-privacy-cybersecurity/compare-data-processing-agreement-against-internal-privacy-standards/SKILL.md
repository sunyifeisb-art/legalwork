---
name: compare-data-processing-agreement-against-internal-privacy-standards
task_id: data-privacy-cybersecurity/compare-data-processing-agreement-against-internal-privacy-standards
description: Vendor DPA deviation reports are strongest when the agent benchmarks the agreement against the relevant internal privacy standards and any applicable external requirements, then converts each gap into a structured deviation analysis with practical negotiation guidance.
activates_for: [planner, solver, checker]
---

# Skill: Compare Vendor Data Processing Agreement Against Internal Privacy Standards — Deviation Report

## 1. Subject-matter triage
- Identify the governing benchmark set before comparing text: the internal privacy playbook, the HIPAA checklist, and any supporting privacy or security documents included in the review packet.
- Distinguish mandatory legal or regulatory requirements from internal policy preferences, and treat the stricter applicable standard as controlling where benchmarks overlap.
- Confirm the deliverable is an issue/deviation report, not a redline; preserve comparison and negotiation guidance rather than drafting substitute contract language unless a proposed alternative is requested.
- If the packet includes a transmittal email or similar context, use it to gauge deal sensitivity, timing pressure, and realistic negotiation posture.

## 2. Failure modes the skill is correcting
- Benchmarking the DPA against only one standard and missing separate obligations in the other review materials.
- Treating all gaps as equal and failing to classify whether a deviation is legally required, policy-driven, or a negotiable preference.
- Reviewing sub-processor provisions in the abstract without checking the actual disclosed sub-processor list and any stated locations or transfer paths.
- Ignoring email or deal context that affects which deviations should be escalated, narrowed, or accepted.
- Stating that a clause is noncompliant without tying the conclusion to the controlling legal or policy authority.
- Listing issues without giving a practical next step or negotiating position for each one.

## 3. Legal frameworks / domain conventions that apply
- Apply the governing privacy and data-processing rules implicated by the DPA, including the basic controller/processor or service-provider allocation reflected in the source documents.
- Apply HIPAA-oriented checklist requirements where the processing involves protected health information or a healthcare context; verify the agreement contains the required contractual protections and flow-down obligations.
- Apply the internal privacy playbook as an independent benchmark, recognizing that internal standards may exceed baseline legal requirements.
- Apply standard vendor DPA conventions for confidentiality, security controls, breach notice timing, audit rights, subprocessors, deletion/return, assistance obligations, international transfers, and liability allocation.
- Where the source set identifies a specific authority, follow that authority as framed in the documents; where it does not, cite the generally recognized rule or practice supporting the conclusion.

## 4. Analytical scaffolds
- Read all benchmark documents in parallel and create a single comparison map of required, preferred, and prohibited positions.
- Review the DPA clause by clause and, for each provision, record:
  - what the vendor paper says,
  - what the internal privacy playbook requires,
  - what the HIPAA checklist requires,
  - what any supporting document adds,
  - and the resulting deviation.
- For each deviation, assess:
  - whether the gap is absolute or conditional,
  - whether it is cured elsewhere in the packet,
  - whether the issue is driven by the text, the sub-processor list, or the transmittal context,
  - and what business or regulatory consequence follows if it is left unresolved.
- Classify each deviation on a uniform ordinal severity scale defined once at the top of the report, and use that scale consistently across all entries.
- Close each issue with three elements: the scale or magnitude of the gap using figures or thresholds supplied in the source materials when available; the cross-reference to the related clause, schedule, list, or document; and the practical consequence for the client.
- When multiple vendors, entities, data flows, or processing locations are in scope, enumerate them first and analyze each separately rather than collapsing them into one pass.

## 5. Vertical / structural / temporal relationships
- Read the DPA together with the sub-processor list, not in isolation; a generic authorization clause may be insufficient once the specific listed processors and locations are considered.
- Read security, audit, breach, deletion, and assistance clauses as an integrated control set; weakness in one often changes the risk rating of the others.
- Use the transmittal email and negotiation history, if provided, to distinguish hard stops from points that can be deferred, narrowed, or accepted.
- Where internal standards and external requirements diverge, explain both and apply the more protective requirement unless the source documents expressly permit a lesser standard.
- Consider timing relationships: notice periods, cure windows, renewal or go-live timing, and response deadlines can change the severity of an otherwise ordinary deviation.

## 6. Output structure conventions
- Produce a deviation report with an executive summary followed by a table of issues.
- Define the severity scale once near the top, using ordinal labels such as Critical, High, Medium, and Low, and apply it uniformly.
- For each row, include a clear clause reference, the vendor position, the benchmark requirement, the classification, the severity, and a negotiation position or fallback drafting suggestion.
- Include a brief assessment of overall vendor posture and a short set of recommended actions that assigns responsibility and urgency.
- Surface verbatim quotes from internal documents only when necessary for precision; do not copy unnecessary text from the source packet.
- Keep the deliverable file name exactly as instructed: `dpa-deviation-report.docx`.
