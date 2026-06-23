---
name: compare-privacy-notice-against-statutory-disclosure-requirements
task_id: data-privacy-cybersecurity/compare-privacy-notice-against-statutory-disclosure-requirements
description: Multi-regime privacy notice gap analyses improve when the agent uses the data processing inventory as the factual baseline, cross-checks current and planned processing against applicable disclosure requirements, and distinguishes present gaps from prospective ones.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis Report: Privacy Notice vs. CCPA/CPRA, HIPAA, and GDPR Disclosure Requirements for Digital Health Company

## 1. Subject-matter triage

- Start by identifying the governing notice set and the supporting materials that describe actual and planned data practices.
- Treat the data processing inventory as the factual baseline; use it to test whether the notice is complete, accurate, and current.
- Separate current disclosures from prospective disclosures tied to roadmap features, pilots, integrations, or policy changes.
- Treat a HIPAA Notice of Privacy Practices as a distinct required document, not a substitute for a general consumer privacy notice.
- If multiple notices, products, regions, or processing contexts are in scope, enumerate them first and analyze each against the applicable regime rather than merging them into one pass.

## 2. Failure modes the skill is correcting

- The analysis compares the notice to legal requirements without anchoring to the actual processing inventory, so the report misses mismatches between stated and real practices.
- The analysis reviews only the present notice and ignores planned processing, leaving prospective disclosure gaps unflagged.
- The analysis conflates general consumer privacy disclosures with the separate content requirements for a HIPAA Notice of Privacy Practices.
- The analysis omits roadmap, security, transfer, or governance materials that reveal categories of data, recipients, or transfers the notice does not disclose.
- The analysis states that a disclosure is missing or incomplete without tying the issue to the governing authority and the consequence of the omission.
- The analysis lists issues without a uniform severity label or without distinguishing immediate remediation from future update work.

## 3. Legal frameworks / domain conventions that apply

- CCPA/CPRA notice requirements: categories of personal information, sources, purposes, disclosures to third parties, consumer rights notice, opt-out mechanics where applicable, sensitive personal information limitations, and retention disclosure concepts under Cal. Civ. Code §§ 1798.100, 1798.110, 1798.115, 1798.121, 1798.130, and related CPRA regulations.
- GDPR transparency requirements: controller identity, contact details, purposes, lawful bases, recipients, transfers, retention, data subject rights, complaint rights, consent withdrawal where relevant, and automated decision-making disclosures under GDPR Arts. 12–14, 15–22, 30, and 44–49, as applicable.
- HIPAA NPP requirements: permitted uses and disclosures of protected health information, individual rights, covered entity duties, and complaint process under 45 C.F.R. §§ 164.520 and 164.520(b), read with the relevant HIPAA Privacy Rule provisions.
- Practical cross-checking conventions: privacy notices should be tested against the actual processing map, not assumed business model descriptions.
- Transfer and vendor documentation: international transfer mechanics, subprocessor relationships, hosting locations, and sharing pathways may create disclosure obligations or expose omissions.
- Governance and security materials: privacy policies, incident-response materials, retention standards, and data-sharing terms may reveal practices that the notice should reflect.
- Product roadmap materials: planned feature launches, new datasets, monetization paths, and analytics uses may create advance-update obligations.
- Metrics and operations materials: DSAR, opt-out, complaint, or inquiry patterns can indicate notice comprehension or rights-mechanism weakness, though they are supporting indicators rather than standalone legal conclusions.

## 4. Analytical scaffolds

- Build the analysis from the source set in this order: processing inventory, current privacy notice, HIPAA NPP if separate, roadmap, then transfer/security/governance materials.
- For each regime, compare the required disclosure elements against what the source set shows the company actually does.
- For each notice element, determine whether the issue is missing, inaccurate, incomplete, or inconsistent with another source document.
- Distinguish present gaps from prospective gaps by tying each finding to current processing or to a documented planned change.
- For each finding, include the governing authority by name and section or rule, the interacting source document or practice document, and the downstream consequence for the company.
- If a disclosure is theoretically relevant but no source document indicates the practice exists, say so and avoid overstating the gap.
- Use the source documents to identify scale where available: volume, category breadth, number of jurisdictions, number of systems, or similar contextual measures.
- Where the record supports it, note whether a gap affects consumer-facing transparency, regulatory alignment, or downstream operational implementation.

## 5. Vertical / structural / temporal relationships

- Analyze vertical relationships in this order: actual processing practice → supporting governance or vendor documents → notice language → required legal disclosure.
- Analyze horizontal relationships across regimes when one practice triggers more than one disclosure framework, such as the same data flow raising CCPA, GDPR, and HIPAA issues.
- Track temporal status separately: current practice, planned practice, and transition state.
- Flag whether a fix requires immediate notice correction, a coordinated document refresh, or a pre-launch update before the planned change goes live.
- When a roadmap item would change a disclosure materially, mark the issue as prospective even if the current notice is technically accurate today.
- When a separate HIPAA NPP is required, verify that its content stands on its own and is not merely cross-referenced to the general privacy notice.

## 6. Output structure conventions

- Produce a gap analysis report in a conventional advisory format with a short executive summary, followed by regime-by-regime findings.
- Define one ordinal severity scale at the top and apply it uniformly to every finding.
- For each entry, include at least: regime, notice element, severity, status, source basis, governing authority, gap description, current vs. prospective, consequence, and recommended fix.
- Keep findings organized by legal regime and then by disclosure topic so the reader can quickly locate each obligation.
- Make the current/prospective distinction explicit in every finding, not only in the summary.
- Cite controlling authority for each legal proposition by statute, regulation, or rule section; do not state a conclusion without naming the rule that supports it.
- End with a concise Recommended Actions block that assigns the action to a role and ties it to a deadline, milestone, or urgency anchored in the source set.
- Use the requested filename exactly: `privacy-notice-gap-analysis.docx`.
