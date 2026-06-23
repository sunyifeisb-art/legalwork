---
name: eu-ai-act-portfolio-impact
task_id: corporate-governance/assess-impact-of-eu-ai-act-on-company-ai-product-portfolio
description: Regulatory impact assessment of an AI product portfolio against applicable AI governance classification requirements, identifying prohibited practices, high-risk system obligations, general-purpose AI model obligations, and systemic governance gaps.
activates_for: [planner, solver, checker]
---

# Skill: AI Regulatory Impact on AI Product Portfolio

## 1. Subject-matter triage
- Treat the assignment as a portfolio-level regulatory classification exercise, but analyze each AI offering separately before drawing any cross-portfolio conclusions.
- If the source pack contains multiple products, models, deployments, or business lines, enumerate them up front and analyze each one on its own facts.
- Distinguish whether the entity is acting as provider, deployer, importer, distributor, or downstream integrator for each item, because obligations attach differently by role.
- Flag immediately whether any item appears to fall into a barred use, a high-risk use, or a general-purpose model track; these are distinct inquiries and may overlap.

## 2. Failure modes the skill is correcting
- Accepting third-party assessments or internal labels without independently testing the actual functionality, deployment context, and legal category.
- Collapsing all AI Act obligations into one compliance bucket instead of separating prohibited uses, high-risk systems, general-purpose model duties, and governance requirements.
- Missing that one product may trigger more than one regime at once, so the analysis must not stop after the first match.
- Treating documentation, oversight, logging, and risk management as optional or generic privacy-style controls rather than category-specific statutory obligations.
- Overlooking provider-establishment issues that can trigger a representative-designation requirement for non-EU actors.
- Failing to connect evidence of known harms, bias, or unsafe outputs to the enforcement-risk and governance-defect analysis.
- Writing conclusions without anchoring them to the controlling AI Act provision or other applicable authority.
- Delivering descriptions of issues without converting them into a severity-ranked memorandum and concrete action plan.

## 3. Legal frameworks / domain conventions that apply
- Use the EU AI Act as the primary framework, and map each product to the correct legal bucket before discussing controls.
- For prohibited practices, test whether the functionality fits a banned or narrowly excepted use, including manipulation, exploitation of vulnerabilities, certain biometric or emotion-related uses, and public-authority uses that fall within a prohibition.
- For high-risk systems, assess the actual intended purpose and context against the Act’s listed categories and Annex-based use cases, not the marketing label.
- For general-purpose AI models, analyze the separate provider duties that apply regardless of downstream deployment, including technical documentation, transparency support, copyright-policy expectations, and, where relevant, systemic-risk controls.
- For high-risk systems, evaluate the continuous risk-management lifecycle, data governance, logging, technical documentation, human oversight, transparency, robustness, accuracy, and cybersecurity requirements.
- For conformity assessment and market-access steps, determine whether the system can rely on internal controls or needs an external route, and whether registration or other pre-market steps apply.
- For non-EU providers, assess whether a written representative in the Union is required before placing the system on the market.
- Use the Act’s enforcement and penalty structure to map each identified breach to the correct tier of exposure.
- When the source materials invoke sectoral or internal standards, treat them as supplements unless they conflict with the AI Act, in which case the statute controls.

## 4. Analytical scaffolds
- Per-product classification: for each item, identify the function, user, deployment setting, provider role, and data flow; then test sequentially for prohibited-use status, high-risk status, and general-purpose model status.
- Functional over label-based review: ignore product names and marketing claims unless they match the actual operation shown in the documents.
- Biometric distinction: separate one-to-one verification from one-to-many identification, and test whether the deployment setting changes the outcome.
- Emotion- and vulnerability-based review: assess whether the system is used in a context where sensitive inferences or exploitation concerns elevate the classification.
- Employment, education, credit, insurance, access-to-services, law-enforcement, migration, and justice review: test whether the product’s actual decision-support or scoring function places it in a regulated high-risk category.
- General-purpose model review: if the product is a foundation or general-purpose model, analyze its own obligations first; then determine whether downstream uses add a second layer of duties.
- Governance review: test whether risk, ethics, or compliance committees have real decision authority, whether escalation works, and whether known issues are tracked to closure.
- Documentation review: verify that technical files, instructions, testing evidence, logging design, and quality-management materials exist and are coherent, not fragmented or purely aspirational.
- Remediation framing: convert each issue into a concrete compliance gap, then pair it with the legal consequence and the operational fix.

## 5. Vertical / structural / temporal relationships
- Analyze obligations on the correct temporal plane: pre-market, placement-on-market, deployment, post-market monitoring, and incident response are not interchangeable.
- Where the same product triggers multiple regimes, stack the duties rather than choosing one; a general-purpose model used in a high-risk application must satisfy both tracks.
- Cross-check internal communications about bias, failures, unsafe outputs, or ignored recommendations against the formal governance record; informal awareness can aggravate the compliance picture.
- If the documents include third-party classifications, compare them to the statutory criteria and explain any discrepancy rather than repeating the external conclusion.
- Treat established-outside-the-Union status as a structural issue that can affect the representative analysis, enforcement posture, and implementation sequencing.
- Where the source set contains multiple products or deployments, preserve product-by-product findings and then synthesize only after the individual analyses are complete.

## 6. Output structure conventions
- Use a memorandum format with an executive summary, scope and assumptions, product-by-product analysis, portfolio-wide governance findings, risk ranking, and action plan.
- Start with a short severity legend using a fixed ordinal scale, and apply that scale consistently to every issue.
- For each product, state: what it is, who acts as provider/deployer, the legal classification, the controlling authority, the identified gap, the practical consequence, and the severity.
- Separate per-product findings from cross-cutting governance findings so the reader can see which issues are system-specific and which are portfolio-wide.
- Include a concise table or matrix that maps each product to its classification track, principal obligations, and current compliance status.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role or function, and ties each action to a timing anchor or regulatory milestone.
- If the documents support multiple interpretations, present the alternative reading briefly, then state which interpretation is more defensible and why.
- Keep the memorandum written for a business audience, but preserve legal precision and cite the controlling AI Act provisions or other applicable authority for each legal conclusion.
