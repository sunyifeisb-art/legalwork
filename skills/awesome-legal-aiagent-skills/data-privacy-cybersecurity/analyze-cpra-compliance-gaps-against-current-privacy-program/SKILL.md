---
name: analyze-cpra-compliance-gaps-against-current-privacy-program
task_id: data-privacy-cybersecurity/analyze-cpra-compliance-gaps-against-current-privacy-program
description: Gap analyses can fail when the agent treats privacy disclosures in isolation, misclassifies third-party data disclosures, omits sensitive-data limitation rights, or fails to reconcile policy statements against the actual processing inventory and vendor arrangements.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Privacy Law Compliance Gaps Against Current Privacy Program — Gap Analysis Memorandum

## 1. Subject-matter triage
- Treat this as a comparison-and-issue-spotting task: reconcile the privacy program documents against the operative CPRA framework, then translate each mismatch into a memo-ready gap finding.
- First inventory the source set and identify the document types in play: privacy notice, data map or processing inventory, vendor terms, consumer request procedures, security materials, risk assessment materials, and any governance artifacts that bear on disclosures or control design.
- If the source set contains only one privacy artifact, say so and analyze it as a standalone statement; otherwise compare the documents against one another before assessing CPRA compliance.

## 2. Failure modes the skill is correcting
- The analysis stays at the level of policy language and does not reconcile stated categories, purposes, recipients, retention concepts, and controls against the actual processing inventory.
- Third-party disclosures are treated generically, so the analysis misses when analytics, advertising, or similar disclosures may be sale/sharing or otherwise trigger opt-out and contract analysis.
- Sensitive personal information obligations are collapsed into ordinary privacy disclosure review, causing omission of the separate limitation right and related notice mechanics.
- Vendor review is skipped or underweighted, so the analysis fails to test whether written terms actually implement the required processing restrictions, downstream controls, and permitted-use limitations.
- Consumer request handling is described abstractly without testing intake, verification, timing, response, correction, deletion, and downstream fulfillment steps against the governing rules.
- Security and risk-assessment issues are treated as background rather than operational compliance gaps with distinct remediation paths.
- Findings are stated without clear severity, making prioritization and remediation sequencing unreliable.
- Recommendations are generic, untethered to a responsible role or near-term remediation plan.

## 3. Legal frameworks / domain conventions that apply
- Consumer rights under the CPRA framework include notice, access/know, correction, deletion, portability, opt out of sale or sharing, limit use and disclosure of sensitive personal information, and non-discrimination; anchor propositions to the CPRA and its implementing regulations.
- Disclosures of personal information must be classified by function, not label: sale, sharing, service-provider disclosure, contractor disclosure, or another permitted transfer category.
- Sensitive personal information must be identified and assessed separately for notice, limitation-right, and operational controls.
- Service provider and contractor arrangements must be tested against the statutory and regulatory contract requirements, including use limits, purpose limits, flow-down controls, and subcontracting constraints.
- Consumer request mechanics must be evaluated against the CPRA regulations governing intake, verification, timing, extension handling, and downstream implementation.
- Data security should be reviewed against the program’s stated controls and any applicable statutory or regulatory baseline, including whether the program matches the actual data environment.
- Risk assessment obligations should be checked where the processing presents heightened risk or where the source materials indicate assessment triggers, documentation, or approval workflows.
- Privacy notices and internal inventories must align with actual data practices; aspirational descriptions are not a substitute for disclosed operations.
- Cite the controlling authority for each proposition relied on, using the statute, regulation, or recognized authority that supports the point.

## 4. Analytical scaffolds
- Start with a full issue inventory: list each distinct processing activity, disclosure pathway, consumer right workflow, vendor relationship, sensitive-data category, and governance control that appears in the source set.
- For each item, compare: stated description in the notice or policy; actual description in the inventory or operational materials; contractual implementation in vendor terms; and any supporting procedure or control.
- For each disclosure pathway, determine the correct CPRA classification and then test whether the notice, opt-out logic, and contract terms match that classification.
- For each consumer right, test whether the program actually enables the right from intake through completion, including required disclosures, identity verification, deadlines, and downstream propagation to vendors or internal systems.
- For each sensitive-data category, test whether the notice, limitation-right mechanism, and operational handling are consistent with the data’s actual use.
- For each vendor or third-party arrangement, test whether the written terms and operating practice align with the intended role of the counterparty.
- For each identified gap, include the legal requirement, current state, required state, severity, and a concrete remediation step.
- Where the source documents supply dates, volumes, or operational scope, use them to calibrate materiality and timing; otherwise state the absence of quantified support and avoid inventing one.

## 5. Vertical / structural / temporal relationships
- Prioritize gaps that cascade across documents: a misclassified disclosure can affect the notice, opt-out mechanism, vendor terms, and downstream processing at once.
- Treat the privacy notice as a top-layer artifact, but validate it against the underlying inventory and agreements before assigning confidence.
- Sequence remediation by dependency: classify data flows first, align disclosures and notices second, then fix vendor terms and request workflows, and only then finalize monitoring, training, and audit documentation.
- If a control depends on another document being revised first, note that dependency explicitly in the roadmap.
- When the source set reflects multiple business lines, periods, or programs, keep the analysis segmented rather than averaging their compliance posture into a single conclusion.

## 6. Output structure conventions
- Use a memo format with: executive summary; methodology or scope; findings organized by compliance category; and a prioritized remediation roadmap.
- Define an ordinal severity scale once at the top and apply it uniformly to every finding.
- For each finding, use a compact legal-analysis row or paragraph containing: issue title; controlling authority; current state; required state; severity; downstream consequence; and specific remediation.
- Make each finding operational, not abstract: explain how the gap manifests in the current program and what it changes for the business, the regulator, or consumer requests.
- Include a concise prioritized roadmap that sequences near-term, mid-term, and longer-term remediation actions.
- End with a Recommended Actions block that uses imperative verbs, names the responsible role or function, and gives a timing anchor tied to a regulatory or operational milestone.
- The deliverable filename should be `cpra-gap-analysis-memo.docx`.
