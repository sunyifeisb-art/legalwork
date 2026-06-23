---
name: compare-site-lease-market-terms-solar
task_id: energy-natural-resources/compare-site-lease-against-market-terms
description: Guides a ground lease deviation review by benchmarking each provision against a market playbook and lender requirements, assessing the financial impact of escalation terms over the full lease term, and identifying provisions whose absence may create financing risk.
activates_for: [planner, solver, checker]
---

# Skill: Compare Site Lease Against Market Terms — Deviation Report for Renewable Energy Ground Lease

## 2. Failure modes the skill is correcting

- Baseline identifies individual lease provisions as above or below market without assessing the cumulative financial impact of escalation terms over the full lease term.
- Baseline does not separately flag deviations from lender requirements versus deviations from market playbook terms, obscuring which deviations may affect financing.
- Baseline collapses multiple lease issues into one summary pass instead of evaluating each provision, party-facing obligation, and timing period separately.
- Baseline describes a deviation but does not close the issue with scale, interacting clause, and downstream consequence.
- Baseline lists concerns without assigning a uniform severity level or an actionable remedy tied to the responsible role and milestone.
- Baseline relies on general characterization of risk without citing the governing lease-market or financing convention that supports the comparison.

## 3. Legal frameworks / domain conventions that apply

- Security deposit market range: ground leases for renewable energy projects typically require a security deposit within a recognized market range; a deposit above this range ties up excess capital during development and construction; market practice also typically provides for a step-down in the deposit amount after commercial operation, when the project is generating revenue; absence of a step-down mechanism is a deviation from market practice.
- Estoppel certificate obligation and lender requirements: lenders financing a renewable energy project commonly require periodic estoppel certificates from the landowner confirming that the lease is in full force and effect, no defaults exist, and no modifications have been made; without a contractual obligation to deliver estoppels on request, the landowner may refuse at a critical time; flag the absence or limitation of an estoppel obligation as a lender requirement issue, not merely a commercial preference.
- Cure period standards: ground leases for renewable energy projects typically provide a cure period for monetary defaults and a longer cure period for non-monetary defaults, with an extension mechanism for defaults that genuinely require additional time to cure; a cure period shorter than the market benchmark increases the risk that a technical default triggers termination before the tenant has a reasonable opportunity to cure; compare the draft against the market-standard benchmarks for monetary and non-monetary defaults separately.
- Access and safety in an operating energy facility: if the landowner retains a right to access the project site without advance notice, this creates safety risks in a high-voltage operating environment, operational risks from interference with generation, and security risks from unsupervised access to equipment; industry practice requires advance notice (except for genuine emergencies) to allow the operator to escort visitors safely.
- Extension rent determination mechanism: if the extension term rent is set by the landlord's appraiser alone rather than through a neutral third-party process or a formula with a cap, the landlord controls the renewal economics and the tenant cannot predict or rely on the extension rent for long-term project valuation and debt underwriting; market practice uses either a formula with a ceiling or a neutral third-party appraisal process with defined parameters.
- Rent escalation and long-term financial impact: the compounding of a rent escalation rate over a project life of several decades can produce a total rent obligation substantially larger than the base rent would suggest; compute the cumulative rent obligation under the draft's escalation schedule and compare it to a market-standard escalation rate to show the financial impact of any above-market escalation.
- Missing exhibits and scope of development rights: if the lease references an exhibit defining the scope of the improvement area or the development footprint, and the exhibit is blank or missing, the tenant's construction rights are undefined; the landowner could dispute whether a specific structure falls within the permitted improvement area; flag any missing exhibit as a gap that must be completed before execution.
- Rent abatement during force majeure or operational interruption: market practice for ground leases typically provides rent abatement during periods when the site is rendered unusable by force majeure or events outside the tenant's control; if the draft does not include an abatement provision, the tenant pays full rent during periods when the site generates no revenue.
- Non-contiguous parcel access: if the lease covers multiple parcels that are not physically connected, access between parcels may require crossing third-party property; assess whether the lease grants access easements across intervening parcels adequate to support construction and operations.
- Lender requirement hierarchy: deviations from lender requirements are more severe than deviations from the market playbook because lender requirements must be satisfied as conditions of financing; present lender-requirement deviations separately and with higher priority.

## 4. Analytical scaffolds

- Start by identifying the full set of provisions in scope: rent, escalations, security deposit, term and extensions, default and cure, access, use rights, casualty/force majeure, exhibits, and lender-facing deliverables. If only one issue category is present, state that expressly; otherwise analyze each issue separately.
- For each lease provision: (a) identify the draft term; (b) compare against the market playbook and any comparable transaction; (c) compare against lender requirements; (d) classify the deviation and its severity; (e) recommend a specific corrective action.
- Separate analysis streams: deviations from lender requirements (financing-blocking risk) and deviations from market playbook (commercial negotiating issues).
- Rent escalation financial analysis: state the escalation mechanism; compare cumulative rent over the lease term under the draft against a market-standard benchmark; present the differential in understandable terms without overloading the reader with arithmetic.
- Missing provisions: identify any provision that market practice requires but the draft omits (estoppel certificate, rent abatement, advance-notice requirement for access); recommend language to add.
- Issue-closing triad: every issue entry must state the applicable scale or threshold, identify the clause or exhibit that interacts with it, and explain the client consequence.
- Use cited authority where a proposition depends on a recognized market or financing rule; do not state a conclusion as a bare assertion.
- If the source materials present multiple periods, parties, or scenarios, compare them one by one rather than collapsing them into a representative sample.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Where the lease contains multiple parcels, analyze whether the access and development rights work across all parcels and across any intervening land that is not part of the leased premises.
- Where the lease contains an initial term and extension terms, separate the economics and controls that apply in each period; do not mix base-term rent, renewal rent, and post-extension mechanics.
- Where a security deposit steps down after commercial operation, distinguish pre-COD and post-COD exposure because the financing and cash-flow consequences differ.
- Where cure periods vary by default type, analyze monetary defaults and non-monetary defaults separately because the timing, notice, and termination consequences are different.
- Where lender requirements are tied to financing or closing milestones, flag whether the deviation must be cured before execution, before funding, or before COD.

## 6. Output structure conventions

- Use a deviation report organized by issue category, with a short opening summary of the review scope and source set.
- Begin with a severity legend using a uniform ordinal scale such as Critical, High, Medium, and Low, defined once and applied consistently.
- For each issue entry, include: the draft term; the market-playbook or comparable-leases benchmark; any lender requirement conflict; severity; scale or threshold; interacting clause/exhibit; downstream consequence; and a specific recommended fix.
- Split lender-facing conflicts into a distinct subsection or clearly label them within each issue so financing risk is immediately visible.
- Include a rent-escalation economics section that compares the draft schedule to a market-standard benchmark over the full lease horizon.
- Flag missing exhibits, missing notices, and missing deliverables as execution risks, not merely drafting comments.
- End with a concise summary table covering provision, benchmark, draft term, deviation characterization, lender conflict if any, severity, consequence, and recommended action.
- Finish with a Recommended Actions block that assigns each action to a responsible role and a timing anchor tied to signing, financing, or COD.
- Keep the artifact ready for direct use as the contents of `lease-deviation-report.docx`; do not substitute a narrative about the report.
