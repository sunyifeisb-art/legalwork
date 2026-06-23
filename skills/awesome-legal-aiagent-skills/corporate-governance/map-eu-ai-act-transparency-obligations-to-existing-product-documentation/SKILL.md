---
name: map-eu-ai-act-transparency-obligations-to-existing-product-documentation
task_id: corporate-governance/map-eu-ai-act-transparency-obligations-to-existing-product-documentation
description: Agents produce a general EU AI Act overview by classifying the product under the relevant high-risk categories, identifying the applicable conformity assessment pathway, checking whether any existing risk assessment is adequate for AI-specific risk management, noting the EU database registration requirement, and addressing the practical tension between trade secret protection and mandatory transparency obligations.
activates_for: [planner, solver, checker]
---

# Skill: EU AI Act High-Risk System Gap Analysis — Product Documentation Review

## 1. Subject-matter triage
- Start by identifying what the product does, who uses it, and the decision or support function it serves. If the documentation suggests more than one possible high-risk use, enumerate each plausible use case before analyzing obligations.
- Determine whether the company is acting as provider, deployer, or both; the obligation set depends on that role split.
- Confirm the applicable compliance timing for the relevant AI Act category before recommending remediation steps.

## 2. Failure modes the skill is correcting
- The analysis states the EU AI Act framework in general terms but does not tie the product’s intended use to a specific high-risk category and compliance consequence.
- The memo identifies risks without identifying the conformity assessment route that follows from the classification.
- The review treats an existing privacy or data-protection assessment as if it were sufficient for AI-specific lifecycle risk management.
- The review misses documentation obligations for instructions for use, technical records, logging, and quality controls.
- The review fails to separate provider obligations from deployer obligations where the same group may be wearing both hats.
- The review overlooks the mandatory EU database registration step.
- The review acknowledges transparency duties but does not square them with confidentiality and trade-secret concerns.

## 3. Legal frameworks / domain conventions that apply
- **High-risk classification — Regulation (EU) 2024/1689 (EU AI Act), Article 6 and relevant Annex III category provisions.** Apply the intended-use analysis to decide whether the product falls within a listed high-risk use case.
- **Provider obligations — EU AI Act Chapter on high-risk AI system requirements, including Articles 9–15.** These cover risk management, data governance, technical documentation, record-keeping, transparency, human oversight, accuracy, robustness, and cybersecurity.
- **Conformity assessment — EU AI Act provisions governing self-assessment or third-party assessment for the relevant high-risk category.** Identify the route that corresponds to the product classification and the evidence needed to support it.
- **Instructions for use and transparency — EU AI Act Article 13 and related annexes.** The documentation should enable deployers to understand purpose, limitations, foreseeable failure modes, human oversight, and security-related use conditions.
- **Quality management system — EU AI Act Article 17.** The QMS should be documented and lifecycle-based, not ad hoc.
- **EU database registration — EU AI Act provisions requiring registration of high-risk AI systems before market placement or putting into service.** Treat registration as a separate obligation from conformity.
- **Trade secret and confidentiality tension — EU AI Act confidentiality provisions and applicable trade secret law, including Directive (EU) 2016/943 where relevant.** Identify what must be disclosed notwithstanding proprietary sensitivity and where confidentiality safeguards may be invoked.
- **Special category data and impact assessments — GDPR Article 35 where personal data processing is implicated.** A privacy impact assessment may inform the analysis but does not substitute for AI Act risk management.

## 4. Analytical scaffolds
- **Classification analysis:** State the intended use, map it to the relevant high-risk category, and state the resulting obligation set.
- **Conformity pathway analysis:** Identify the applicable assessment route, the evidence package required, and whether the current documentation supports it.
- **Risk-management comparison:** Compare the existing risk assessment against the AI Act lifecycle risk-management standard and flag what is missing.
- **Documentation coverage review:** Check whether the product materials include technical documentation, logs, instructions for use, human oversight material, performance limitations, and cybersecurity controls.
- **Registration review:** Confirm whether registration in the EU high-risk AI database is addressed and, if not, identify what information must be prepared for filing.
- **Confidentiality balancing:** Identify which required disclosures may implicate trade secrets and whether the materials suggest a lawful confidentiality approach.

## 5. Vertical / structural / temporal relationships
- **Provider vs. deployer:** If the company both builds and uses the system, analyze both obligation sets separately and then note overlap.
- **Upstream to downstream documentation flow:** Technical documentation supports conformity assessment; instructions for use support deployer understanding; registration follows conformity readiness. Do not reverse this sequence.
- **Lifecycle timing:** Distinguish pre-market evidence, pre-deployment registration, and ongoing monitoring or update obligations.
- **Documentation hierarchy:** Treat the AI Act as the primary compliance framework, with privacy assessments, internal policies, and product specs as supporting materials rather than substitutes.

## 6. Output structure conventions
- Draft a formal gap analysis memorandum in conventional legal-memo form with a short executive summary, followed by issue-by-issue analysis organized by EU AI Act requirement.
- Define an ordinal severity scale once at the outset and apply it consistently to each gap.
- For each issue, include: current documentation state, controlling legal basis, gap identified, downstream consequence, and recommended remediation.
- Where a point turns on a legal rule, cite the controlling authority by name and article, section, or equivalent pinpoint reference.
- If multiple product uses or multiple documentation sets are in scope, list them first and analyze them separately rather than collapsing them into one blended assessment.
- End with a concise Recommended Actions section that assigns each step to a role and ties it to the relevant regulatory milestone or internal deadline.
- Include a final compliance matrix or table as an exhibit if helpful, but keep the memo itself as the primary deliverable content.
