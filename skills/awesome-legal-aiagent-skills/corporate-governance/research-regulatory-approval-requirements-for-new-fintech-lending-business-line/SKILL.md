---
name: research-regulatory-approval-requirements-for-new-fintech-lending-business-line
task_id: corporate-governance/research-regulatory-approval-requirements-for-new-fintech-lending-business-line
description: Agents identify the applicable state licensing and federal consumer-finance approval requirements for a new fintech lending business line, analyze product economics against any applicable rate limits where needed, assess fair-lending and model-governance obligations for credit decisioning tools, and determine whether any holding-company or supervisory approvals must be obtained before launch.
activates_for: [planner, solver, checker]
---

# Skill: Regulatory Approval Memo for a New Fintech Direct-to-Consumer Lending Subsidiary

## 1. Subject-matter triage (only if applicable)

- Confirm the proposed business line is a direct-to-consumer lending product, the launch entity is a non-bank subsidiary, and the analysis must cover both entity-level approvals and product-level constraints.
- Identify every launch jurisdiction, every product variant, and every decisioning tool or vendor in scope before analyzing approvals.
- If the source set includes multiple states, product terms, or launch paths, treat each as a separate lane and analyze them separately; do not blend jurisdictions or product designs into one generic conclusion.
- If the documents show only one launch state or one product configuration, say so expressly and explain why broader comparison is unnecessary.

## 2. Failure modes the skill is correcting

- Identifying licensing obligations without first testing whether the product economics trigger a rate-limit or usury analysis.
- Treating state authorization as a single issue when each target jurisdiction may use a different license, notice, registration, or pre-approval pathway.
- Addressing fair-lending in general terms without separately analyzing the lender’s responsibility for model governance, adverse action explainability, and third-party vendor oversight.
- Assuming a vendor or bank partner absorbs compliance risk that remains with the lending entity.
- Overlooking parent-level or holding-company approval requirements before a new non-bank financial activity begins.
- Treating consumer-finance supervisory authority as optional or deferred rather than checking whether launch thresholds or market-participation triggers are met.
- Presenting legal conclusions without tying them to the governing statute, regulation, rule, or supervisory framework.
- Reaching a memo conclusion without sequencing the approvals needed before operations can start.

## 3. Legal frameworks / domain conventions that apply

- **State lending authorization:** Direct-to-consumer lending commonly requires state-by-state licensing, registration, notice, or comparable authorization. Use the controlling state consumer-lending statute, banking code, or licensing rule for each jurisdiction and distinguish pre-approval from post-filing regimes.
- **Rate-limit and usury analysis:** Where product fees, short terms, deferred interest, or installment structure could affect the effective cost of credit, analyze the pricing under the applicable legal methodology and compare it to the controlling state usury or rate-limit rule.
- **Lender identity and rate responsibility:** A direct lender is responsible for its own compliance posture unless a controlling statute or valid regulatory structure shifts the analysis. Do not assume rate exportation, bank partnership doctrines, or true-lender principles apply unless the source facts support them.
- **Fair lending and credit decisioning:** ECOA, 15 U.S.C. §§ 1691–1691f, and Regulation B, 12 C.F.R. pt. 1002, govern discrimination, adverse action, and notice obligations. If an AI/ML model is used, assess proxy risk, disparate-impact risk, explanation quality, and how adverse action reasons will be generated and documented.
- **Model governance and vendor oversight:** Outsourcing scoring or underwriting does not transfer legal responsibility. Review validation, monitoring, change control, documentation, data governance, and escalation procedures under the lender’s own compliance program.
- **Parent or holding-company approvals:** A parent company may need prior approval, notice, or a no-objection process before engaging in or funding a new financial activity through a subsidiary, depending on the applicable supervisory regime and the entity’s existing permissions.
- **Consumer-finance supervisory authority:** Check whether the proposed lender falls within a federal or state consumer-finance supervisor’s examination authority based on size, product type, charter status, or market participation, and note any resulting examination or reporting expectations.
- **State regulator notifications:** Some states require advance notice or filing with a banking or consumer-finance regulator when a non-bank lending affiliate is formed, acquired, or begins operating in-state.
- **Authority citation discipline:** Every legal proposition should be anchored to the controlling authority named in the source materials or, if absent, the most directly applicable statute, regulation, rule, or established supervisory standard.

## 4. Analytical scaffolds

- **Launch map:** Identify the entity that will originate, underwrite, service, and collect; the jurisdictions where offers, marketing, underwriting, or booking occur; and the approvals needed at each step.
- **State-by-state authorization matrix:** For each state in scope, specify the authorization type, agency, filing or approval mechanics, timing, recurring obligations, and any product-specific limitations.
- **Pricing and usury check:** For each product configuration in scope, determine whether the pricing structure could implicate a state rate cap, fee cap, or method-of-computation issue; then compare the structure to the governing rule.
- **Fair-lending and model-review analysis:** Assess whether the underwriting model, alternative data, or vendor inputs create discrimination or explainability risk; review adverse action content, testing cadence, exception handling, and documentation.
- **Supervisory threshold analysis:** Check whether the subsidiary likely crosses any consumer-finance supervisory trigger and, if so, identify the examination or reporting consequences.
- **Parent-approval sequencing:** Determine whether parent-level consent, notice, or internal approval must precede state filings, and map the critical path accordingly.
- **Open-items discipline:** Where source documents omit a required fact, flag the gap, state why it matters, and identify the minimum fact needed to complete the approval analysis.

## 5. Vertical / structural / temporal relationships (only if applicable)

- **Sequencing before launch:** Parent-level approvals, state filings, and consumer-finance supervisory checks may have to be completed before marketing, underwriting, or first origination. Sequence the steps in the order they must be satisfied.
- **Entity-to-product linkage:** If the lending subsidiary will rely on a parent platform, vendor model, or shared services arrangement, identify which obligations attach to the subsidiary, which remain at the parent, and which flow through the vendor relationship.
- **Jurisdictional layering:** A product can be compliant in one state and blocked or restructured in another. Keep state conclusions separate and do not average them across markets.
- **Capital and governance dependencies:** If the approval path turns on capital, control, or governance conditions, review the source documents for the relevant capitalization and approval authority before concluding launch readiness.

## 6. Output structure conventions

- Draft a regulatory approval memorandum in conventional legal-memo form with an executive summary, product overview, jurisdictional analysis, entity-level approval analysis, fair-lending/model-governance section, supervisory-jurisdiction section, sequencing/timeline, and open items.
- Use a separate state-by-state matrix or exhibit when more than one jurisdiction is in scope.
- Present pricing, licensing, and approval mechanics in concise tables where that improves readability.
- State conclusions by jurisdiction and by approval type, and distinguish required, likely required, and fact-dependent items.
- End with a practical launch-oriented recommendation set that identifies the responsible business or legal owner and the timing anchor for each action.
