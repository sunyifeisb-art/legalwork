---
name: extract-privacy-compliance-obligations-from-multi
task_id: data-privacy-cybersecurity/extract-privacy-compliance-obligations-from-multi
description: Multi-jurisdictional compliance obligation matrices for health-tech platforms fail when the agent does not assess each statute's applicability to the company's current and planned data architecture and does not use prior incidents as evidence of existing compliance gaps.
activates_for: [planner, solver, checker]
---

# Skill: Extract Privacy Compliance Obligations from Multi-Jurisdictional Statutes for Health-Tech Platform — Compliance Obligation Matrix

## 1. Subject-matter triage

This task centers on statutory excerpts, a product data architecture document, a prior incident report, a current privacy policy, a DPA summary, and an assignment email. Treat the statutes as the primary legal authority and the company documents as the factual record for current operations, planned operations, and existing controls.

Read the assignment email first to lock scope: which jurisdictions and statutes matter, whether current and planned operations must be assessed separately, and whether the matrix must be comparative or gap-focused. Then map the data architecture to the legal sources before drafting any matrix rows.

## 2. Failure modes the skill is correcting

- The agent extracts obligations from the statutes without testing whether the company actually processes the relevant data, uses the relevant vendors, or performs the relevant activities.
- The agent treats the current privacy policy as proof of compliance without checking whether it matches the actual processing described in the architecture document.
- The agent misses that planned features can newly trigger obligations even where current operations do not.
- The agent ignores the prior incident report as evidence of a known compliance failure, leaving an existing gap unflagged.
- The agent collapses distinct jurisdictional duties into a generic “privacy compliance” summary instead of separating obligations by controlling statute and processing context.
- The agent states that an obligation applies or does not apply without naming the statutory provision or other controlling authority that supports the conclusion.
- The agent produces observations without a severity assessment, making it impossible to prioritize remediation.
- The agent lists problems without tying each one to a concrete action, owner, and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- Multi-jurisdictional health-tech reviews commonly implicate federal health privacy and security rules, general data protection regimes, state consumer privacy laws, state health privacy statutes, breach-notification duties, and sector-specific provisions tied to the type of data processed.
- Sensitive health data often changes the threshold for notice, consent, security, minimization, retention, and secondary-use restrictions; classify the data category carefully before deciding whether an obligation is triggered.
- Applicability depends on both the legal text and the factual architecture: collection method, purpose, disclosure path, processor/vendor role, de-identification method, retention, and cross-border transfer.
- Current and planned operations must be evaluated separately when the business model or product roadmap changes the data flow, the data category, or the recipient universe.
- Prior incidents can function as proof of an existing control gap if the report identifies a specific failure and there is no documented remediation in the source set.
- Compliance analysis should distinguish mandatory obligations, conditional obligations, and control enhancements suggested by the sources but not expressly required.
- For every legal conclusion, cite the controlling authority by name and section or other precise identifier as the source set permits.

## 4. Analytical scaffolds

- Start by enumerating the applicable statutes and guidance sources from the assignment and statutory excerpts; if multiple jurisdictions or regimes are in scope, list them explicitly before analysis.
- Build a data-map from the architecture document: data types, collection points, processing purposes, disclosures, storage, retention, vendor roles, and planned changes.
- Read the prior incident report for specific operational failures, then test whether the same failure is reflected in current controls or remains unremediated.
- Read the privacy policy and DPA summary as evidence of stated controls only; compare them to the actual architecture and note any mismatch.
- For each statute, extract the operative obligation categories and test them against the mapped facts.
- Where an obligation is conditional, state the triggering fact, the controlling provision, and whether that trigger is present for current operations, planned operations, or both.
- For each issue or obligation gap, tie the legal rule to the factual trigger, identify the interacting document or clause in the source set, and state the consequence for the client.
- Assign an ordinal severity label to each entry using a consistent scale defined once at the top of the matrix or accompanying narrative.
- End with a recommendations section that translates each material gap into an action, responsible role, and timing anchor tied to the project or regulatory milestone.

## 5. Vertical / structural / temporal relationships

Use the relationship between current operations and planned operations as a core organizing axis. If a planned feature changes data type, purpose, recipient, geography, retention, or security posture, flag it separately rather than folding it into the current-state row.

Use the prior incident as a temporal marker: identify whether it predates the current policy, overlaps with the present architecture, or indicates a still-open deficiency. If the incident maps to a statutory obligation, note that the same gap may be both compliance and remediation risk.

When a statute interacts with another source document, record that interaction directly in the matrix so the reader can see how the legal rule, privacy policy, DPA summary, and architecture document align or diverge.

## 6. Output structure conventions

- Use a matrix format with one row per obligation category or obligation trigger, and separate columns for controlling authority, factual trigger, current operations posture, planned operations posture, gap, severity, consequence, and recommended action.
- Define the severity scale once, then apply it uniformly to every row.
- Name the controlling statute, regulation, or other authority in each row; do not state a legal conclusion without the citation that supports it.
- Include a brief executive summary that identifies the main applicable frameworks, the posture for current versus planned operations, and the highest-priority gaps tied to the prior incident.
- Keep the matrix factual and action-oriented: obligation, trigger, support, gap, consequence, recommendation.
- Use conventional privacy-review headings rather than a verbatim copy of any rubric or checklist language.
- The deliverable filename must match the instruction exactly: `privacy-compliance-obligation-matrix.docx`.
- Before finishing, verify that the primary deliverable is complete, non-empty, and contains operative analysis rather than a summary of what should be done.
