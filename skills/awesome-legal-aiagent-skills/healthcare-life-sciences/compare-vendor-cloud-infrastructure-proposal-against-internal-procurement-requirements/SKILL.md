---
name: hls-compare-vendor-cloud-proposal-procurement
task_id: healthcare-life-sciences/compare-vendor-cloud-infrastructure-proposal-against-internal-procurement-requirements
description: Compares a vendor cloud infrastructure proposal against internal procurement requirements and related security or compliance addenda to identify financial, technical, legal, and regulatory gaps, then organizes the differences into a negotiation-focused gap analysis.
activates_for: [planner, solver, checker]
---

# Skill: Vendor Cloud Infrastructure Proposal vs. Internal Procurement Requirements

## 1. Subject-matter triage (only if applicable)

- Treat the procurement requirements, security addendum, CIO assessment, and scoring matrix as a single comparison set unless the documents expressly create separate governing tiers.
- Identify the governing baseline for each topic before analyzing differences: commercial terms, service levels, security controls, data protection, incident handling, transition support, and approval or exception criteria.
- If a topic appears in multiple source documents, reconcile the documents before flagging a gap; note whether the vendor is noncompliant with one source, all sources, or only the highest-priority source.
- Where the documents provide a threshold, target, cap, or window, anchor the analysis to that value rather than a generalized description.
- If the record does not supply enough data to quantify a gap, state that the comparison is qualitative only and explain what would be needed to measure it.

## 2. Failure modes the skill is correcting

- Technical, commercial, and legal gaps are described in isolation rather than tied to the governing procurement baseline, making negotiation priorities unclear.
- Severity is implied rather than stated, so readers cannot distinguish deal-breakers from refinements.
- Issues stop at mismatch identification and do not state the business, regulatory, or operational consequence of the variance.
- Reviewers miss cross-document interactions, especially where the security addendum, CIO assessment, and scoring matrix tighten or override the proposal.
- Remediation is left abstract, so the memo fails to translate gaps into practical negotiating asks.
- Conclusory legal statements are made without tying them to the controlling contractual or regulatory rule.

## 3. Legal frameworks / domain conventions that apply

- Recovery and resilience terms: compare recovery objectives, backup expectations, continuity commitments, and restoration timing using the same metric system as the procurement materials.
- Incident notification: evaluate the trigger, timing, content, and escalation path for notice, including whether notice is tied to detection, reasonable determination, or a later internal milestone.
- Data security and privacy obligations: compare encryption, access controls, logging, vulnerability management, breach response, and subcontractor controls against the required baseline and any referenced health-data or privacy requirements.
- Work-product and ownership protections: review whether custom functionality, configurations, deliverables, and derived materials are assigned, licensed, or retained in a way that matches the procurement position.
- Change of control and assignment: assess whether transfer, delegation, or assignment rights preserve customer consent rights and approval leverage.
- Force majeure and performance suspension: evaluate scope, duration, mitigation duties, and resumption obligations against the procurement expectation.
- Indemnity and liability allocation: compare exclusions, caps, carveouts, defense obligations, and covered claims against the required risk allocation.
- Transition and exit assistance: compare the proposed wind-down support, data return, and transition period to the required support window and scope.
- For any legal proposition stated in the memo, name the controlling contractual clause, statutory provision, regulation, or generally recognized authority that supports it; do not state the conclusion alone.

## 4. Analytical scaffolds

1. Start by mapping each source document to the topic it governs, then use the most restrictive applicable term as the baseline for that topic.
2. For each issue, state: governing requirement → vendor position → mismatch → consequence → recommended fix.
3. Where figures, service levels, time periods, caps, or thresholds are available, compare them directly and explain the practical effect of the delta.
4. For each legal or compliance gap, cross-check the proposal against any connected requirement elsewhere in the source set before assigning severity.
5. Evaluate whether the vendor’s subcontractor, fourth-party, audit, testing, or remediation structure leaves the customer with insufficient visibility or enforcement rights.
6. Treat the CIO assessment and scoring matrix as evidence of internal priority: if they downgrade or condition acceptance, identify the condition and whether the proposal satisfies it.
7. If a provision may be acceptable only with a rider, reservation, or alternative control, say so explicitly and identify the needed contractual adjustment.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare upward and downward dependencies: if one requirement is a prerequisite for another, note whether the proposal breaks the chain.
- Distinguish pre-signature commitments from post-signature operating obligations, especially for security, audit, reporting, and remediation.
- Track timing-sensitive obligations in sequence: notice, cure, remediation, reporting, transition, and termination support.
- If the vendor’s obligation is triggered by customer request, internal approval, or a later determination, identify the timing consequence and whether it weakens enforcement.
- If the source documents contain multiple periods or phases, analyze each phase separately rather than blending them into one pass.

## 6. Output structure conventions

- Produce a gap analysis memorandum organized in conventional issue categories: commercial/financial, technical/operational, legal/contractual, and compliance/risk.
- Define one ordinal severity scale at the top and apply it uniformly to every issue entry.
- For each issue, include: severity, governing requirement, vendor position, gap, consequence, and recommended resolution.
- Each issue should be written so the reader can see the scale of the problem, the linked source document interaction, and the downstream impact in one place.
- Use concise, decision-oriented prose; avoid generic summaries that do not change the negotiation posture.
- Include a prioritized remediation and negotiation section that turns the issues into concrete asks, with the relevant internal owner or function and a timing anchor if the record supplies one.
- Where the source set supports it, include a short commercial comparison table for cost, risk allocation, and service-level differences.
- If the memo references any authority or rule, cite it by name and section or other controlling identifier in the body text.
