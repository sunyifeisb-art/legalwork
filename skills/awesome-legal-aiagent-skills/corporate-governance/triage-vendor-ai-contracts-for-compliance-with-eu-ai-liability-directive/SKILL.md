---
name: triage-vendor-ai-contracts-for-compliance-with-eu-ai-liability-directive
task_id: corporate-governance/triage-vendor-ai-contracts-for-compliance-with-eu-ai-liability-directive
description: Agents triage AI contracts without overlooking whether a non-EU-governed agreement needs separate EU-specific compliance analysis, without treating a force-majeure or change-in-law clause as a substitute for tailored AI-regulatory drafting, and without limiting review to vendor obligations while ignoring the company's own exposure as a deployer of high-risk AI systems.
activates_for: [planner, solver, checker]
---

# Skill: Vendor AI Contracts Triage — EU AI Liability Directive Compliance Gap Analysis

## 1. Subject-matter triage

- Treat the assignment as a contract-by-contract regulatory gap analysis, not a generic legal memo.
- First identify the full set of contracts in scope and whether each covers an AI system deployed, made available, or used in the EU; if only one contract is actually in scope for a given issue, say so explicitly and explain why.
- Separate contracts governed by EU law from those governed by non-EU law, but do not stop there: deployment in the EU can still trigger EU-facing compliance analysis.
- Distinguish provider, deployer, distributor, importer, and downstream user roles where the source materials support those distinctions.

## 2. Failure modes the skill is correcting

- Treating governing law as dispositive of EU regulatory relevance, instead of testing deployment location and role-based obligations.
- Reading vendor compliance promises as a substitute for independent assessment of the company’s own deployer exposure under the EU AI Act and related liability framework.
- Assuming boilerplate force-majeure, limitation-of-liability, or change-in-law language adequately covers AI-regulatory change.
- Reviewing logs, records, and retention terms without asking whether they preserve the evidence needed for post-incident access, disclosure, or defense.
- Collapsing multiple contracts into one blended assessment instead of analyzing each agreement on its own facts and risk posture.
- Stating that a clause is “non-compliant” or “insufficient” without identifying the governing authority that makes it so.
- Recommending remediation without tying it to a responsible role and timing anchor.

## 3. Legal frameworks / domain conventions that apply

- **EU AI Act:** Use the Act’s role-based structure to assess provider and deployer obligations, especially for high-risk AI systems, including conformity, technical documentation, transparency, human oversight, incident handling, and cooperation duties.
- **EU AI liability framework:** Assess whether the contract preserves evidence, logs, and access rights relevant to damages claims and disclosure mechanisms tied to AI-caused harm.
- **Evidence preservation doctrine:** Review retention, deletion, audit, and notice terms against the need to preserve operational records long enough for likely claims and regulatory inquiries.
- **Change-in-law and force-majeure drafting:** Treat these clauses as risk-allocation tools, not compliance shields; narrow them if they could excuse foreseeable AI-regulatory obligations.
- **Governing law and dispute resolution:** Check whether forum and law clauses create friction with EU compliance, regulator access, evidence production, or cross-border enforcement.
- **Use recognized authority names and sections when stating propositions:** cite the controlling statute, regulation, rule, or generally recognized doctrine relied on in the analysis; do not state a legal conclusion without naming its source.

## 4. Analytical scaffolds

- **Contract-by-contract triage:** For each agreement, identify the AI system, deployment geography, governing law, role allocation, and the specific compliance gaps that follow.
- **Role-and-duty mapping:** Map each contract term to the applicable provider/deployer duty, then note whether the contract allocates the duty, leaves it unaddressed, or allocates it inconsistently with the statutory framework.
- **Evidence-readiness test:** Ask whether logs, model outputs, incident records, configuration data, and related documentation are retained, accessible, and producible for as long as needed.
- **Regulatory-change stress test:** Test whether any clause lets the vendor suspend, reprice, restrict, or dilute AI obligations after legal change; if so, recommend narrowing the trigger and carving out mandatory compliance.
- **Deployer exposure check:** Independently assess the company’s own operational controls, oversight procedures, and internal escalation paths; contract language is only one part of the answer.
- **Prioritization logic:** Rank issues by legal exposure, operational dependence, and speed of remediation; distinguish immediate amendment needs from items that can be scheduled for the next papering cycle.
- **Issue-closing discipline:** For each issue, state the scale of the problem using the contract facts available, cross-reference any interacting clause or document, and explain the downstream consequence if left unremedied.

## 5. Vertical / structural / temporal relationships

- **Provider versus deployer:** Explain how obligations shift depending on whether the company receives the system as a service, deploys it internally, or integrates it into a customer-facing workflow.
- **Framework layering:** Treat ex ante compliance under the EU AI Act and ex post liability/evidence issues as distinct but connected layers; a contract should address both.
- **Temporal sequencing:** Align remediation timing with the relevant regulatory commencement, transition, or implementation milestone, and flag any term that expires before the evidence or compliance risk does.
- **Cross-document interaction:** Where the AI contract incorporates policy schedules, order forms, data-processing terms, support terms, or audit appendices, read them together and resolve inconsistencies.

## 6. Output structure conventions

- Prepare a prioritized memorandum organized by risk tier, with a short executive summary up front and a concise conclusion at the end.
- Include a summary table listing each contract, governing law, EU deployment nexus, primary gap themes, severity rating, and recommended action.
- Use a uniform ordinal severity scale defined once near the top, and apply it consistently across all issues.
- For each contract, include:
  - deployment and role assessment,
  - key contract terms affecting EU AI compliance,
  - identified gaps,
  - consequence if unchanged,
  - recommended remediation.
- When multiple contracts are in scope, analyze them one by one and keep the rows or subsections parallel so the comparison is easy to follow.
- End with a standalone Recommended Actions block that assigns each action to a responsible role and a timing anchor tied to the regulatory or transaction timeline.
- If a legal proposition depends on a specific authority, cite that authority in the analysis and in the recommended fix where relevant.
