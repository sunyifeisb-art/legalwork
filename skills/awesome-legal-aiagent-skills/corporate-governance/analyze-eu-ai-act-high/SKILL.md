---
name: eu-ai-act-high-risk-gap-analysis
task_id: corporate-governance/analyze-eu-ai-act-high
description: Gap analysis of AI systems operated by an autonomous vehicle provider against the EU AI Act high-risk classification framework, technical obligations, and conformity assessment pathways.
activates_for: [planner, solver, checker]
---

# Skill: EU AI Act High-Risk Requirements Gap Analysis

## 1. Subject-matter triage

- Treat the work as a system-by-system legal classification and obligations review, not a generic AI compliance summary.
- First determine whether the source set describes one AI system or several; if several, analyze each system separately and do not merge distinct deployment models, model versions, or customer use cases.
- Separate provider obligations from deployer obligations at the outset; identify who built, placed on the market, integrated, or operates each system.
- Confirm whether any entity in scope is established outside the EU and therefore may require an EU authorized representative.
- Flag immediately if the sources suggest a prohibited practice, because that changes the urgency and remediation posture.

## 2. Failure modes the skill is correcting

- Treating the EU AI Act as a single checklist instead of a portfolio-level classification exercise with system-specific consequences.
- Misstating whether the client is acting as provider, deployer, importer, distributor, or authorized representative.
- Conflating formal human-oversight design with informal operator discretion.
- Overlooking that the conformity assessment route can differ by high-risk category and by the system’s role in the value chain.
- Missing the distinction between technical compliance gaps and enforcement-risk indicators such as internal awareness of harmful, biased, or unsafe outputs.
- Collapsing logging, data governance, cybersecurity, and quality-management obligations into one generic “AI governance” bucket.
- Treating timing as uniform when the AI Act phases obligations by category and commencement date.
- Failing to convert the legal analysis into a remediation plan tied to owners and milestone dates.

## 3. Legal frameworks / domain conventions that apply

- High-risk classification must be analyzed under the AI Act’s risk-based structure, including Annex-based use cases and any system-specific role analysis.
- Prohibited practices must be checked separately from high-risk status; a system can be non-high-risk and still raise prohibition risk.
- High-risk provider obligations commonly include: risk management, data governance, technical documentation, logging, transparency to deployers, human oversight, accuracy, robustness, cybersecurity, quality management, post-market monitoring, and incident reporting.
- Deployer-facing duties should be distinguished from provider-facing technical design obligations.
- Conformity assessment analysis must identify whether the relevant pathway is self-assessment/internal control or an external review route where the Act requires it.
- Registration and database obligations must be considered for any system that qualifies as high-risk.
- If the source set discusses GPAI or foundation-model components, separate those obligations from the high-risk system analysis and identify where they overlap.
- Use the AI Act text, recitals only when they illuminate interpretation, and any source-specific legal citations appearing in the materials; do not generalize beyond the relevant provision.
- Where the source set identifies a specific article, annex, or regulatory pathway, anchor the conclusion to that authority rather than to a vague compliance principle.

## 4. Analytical scaffolds

- **Classification pass:** For each system, state whether it is high-risk, potentially high-risk, non-high-risk, or prohibited-risk based on the actual use case, intended purpose, and deployment context.
- **Obligation mapping pass:** For each high-risk system, map the applicable provider obligations one by one and identify what the evidence shows, what is missing, and what is only partially documented.
- **Conformity route pass:** Determine the applicable conformity assessment route for each system and identify any implications for documentation, testing, procurement, and launch sequencing.
- **Oversight design pass:** Assess whether human oversight is formally built into the system architecture, operating procedures, and documentation, not merely available in theory.
- **Data and logging pass:** Review dataset provenance, representativeness, labeling, validation, test separation, record retention, and logging adequacy against the Act’s technical expectations.
- **Robustness pass:** Evaluate whether the sources show adversarial testing, cybersecurity controls, fallback behavior, and error-handling sufficient for the system’s risk profile.
- **Enforcement-risk pass:** Treat internal evidence of known bias, unsafe behavior, or recurring incidents as aggravating facts that raise urgency even where the legal classification is unsettled.
- **Remediation pass:** Convert each gap into a concrete corrective action with a responsible role and timing anchor.

## 5. Vertical / structural / temporal relationships

- Analyze systems in the order that best reflects legal exposure: prohibited-practice risk first, then high-risk classification, then other compliance gaps.
- Where third-party assessments, engineering documents, and internal communications conflict, resolve the discrepancy by reference to the AI Act’s requirements and explain which source is legally more persuasive and why.
- Where a system is integrated into a vehicle or broader operational stack, trace obligations across the model, the software layer, the vehicle-level control environment, and the operator workflow.
- Treat timing as obligation-specific: note when a rule is already effective, when it applies at market placement, when it applies at deployment, and when transitional timing may matter.
- If the client operates through partners or customers, test whether the contractual allocation of responsibilities matches the AI Act’s legal allocation; contract labels do not control if the statute assigns duties elsewhere.
- Any evidence of repeated incidents, complaint patterns, or internally recognized bias should be escalated in severity and carried into the remediation plan as a priority item.

## 6. Output structure conventions

- Open with a short executive summary stating overall posture, main legal risks, and the most material remediation themes.
- Define a uniform severity scale once near the top and apply it consistently to every issue or gap.
- Organize the body by individual AI system, and within each system use a stable pattern: classification, applicable obligations, evidence reviewed, gaps, severity, and corrective action.
- Include a separate cross-cutting section for enterprise-wide issues such as quality management, logging architecture, representative designation, governance documentation, and testing standards.
- For every issue, state the controlling authority by name and provision when available, and avoid conclusory statements that are not anchored in a cited rule.
- If the source set supports only one system, say so affirmatively rather than implying multiple systems.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role, and gives a timing anchor tied to launch, filing, certification, or another regulatory milestone.
- Use industry-conventional memo headings; do not mirror any hidden checklist structure.
- Write the final deliverable as a memo suitable for conversion into `eu-ai-act-gap-analysis-memo.docx`, with concise issue statements and operational remediation language.
