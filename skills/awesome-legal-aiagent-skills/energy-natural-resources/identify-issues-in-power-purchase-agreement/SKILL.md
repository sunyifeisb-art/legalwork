---
name: identify-issues-in-ppa-solar-bess
task_id: energy-natural-resources/identify-issues-in-power-purchase-agreement
description: Guides issue identification in a solar-plus-storage power purchase agreement from the seller's perspective by comparing commercial terms against the project model, checking environmental permitting status against applicable species-protection requirements, and assessing interconnection cost exposure from co-developer withdrawal risk.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Power Purchase Agreement — Solar + BESS Project, Seller's Perspective

## 1. Subject-matter triage (only if applicable)

- Treat the PPA, project model, site control package, interconnection materials, environmental/permitting record, and lender-facing assumptions as one integrated record.
- If the source set includes multiple project phases, operating periods, counterparties, or scenario cases, enumerate them before analysis and keep each issue tied to the correct phase or case.
- If the project is a single-asset, single-buyer transaction, state that expressly and analyze on that basis.

## 2. Failure modes the skill is correcting

- Baseline under-analyzes environmental permitting risk by treating species-protection review status as background rather than as a project risk that can block construction or create stop-work exposure.
- Baseline characterizes interconnection cost-sharing provisions as standard without assessing the seller's unhedged exposure if a co-developer withdraws from the interconnection cluster.
- Baseline misses the seller-side impact of commercial assumptions that do not match the project model, especially where revenue timing, curtailment, tax-credit monetization, debt sizing, or operating costs are misaligned.
- Baseline identifies issues as generic comments instead of closing each one with seller impact, document cross-reference, and a practical mitigation.
- Baseline uses non-uniform severity language and omits an explicit priority scale.

## 3. Legal frameworks / domain conventions that apply

- PPA financial mechanics and debt coverage: project financings often include minimum debt service coverage expectations; if the project model shows coverage falling below the expected covenant minimum in any projected year — including the early years before the project reaches full generation — the PPA financial mechanics create bankability risk; assess whether tax-credit monetization timing assumptions are realistic and whether they align with the model's projected closing date.
- Curtailment compensation and uncompensated hours: a PPA typically allows the buyer to curtail generation for a defined number of hours per year without compensation; hours above this cap must be compensated; compare the contract's uncompensated curtailment cap against market practice and assess the revenue impact on the project model.
- Environmental attribute scope: the transfer of environmental attributes must be clearly defined; a definition broad enough to sweep unspecified future credits may inadvertently transfer credits the seller could otherwise sell independently; flag overbroad language and recommend precise definition.
- Tax indemnity structure: tax indemnity provisions that impose obligations on the seller for changes in the buyer's tax position are off-market; tax indemnity obligations should be bilateral or limited to events within the seller's control; also assess whether the project's property tax abatement agreement expires before the PPA term ends and, if so, whether the post-abatement burden is reflected in the model.
- Interconnection cost-sharing and co-developer withdrawal: if the project participates in a cluster interconnection study with other developers sharing upgrade costs, a co-developer withdrawal can shift stranded upgrade costs to the remaining projects; assess whether the PPA includes any mechanism to cap the seller's interconnection cost exposure or step-in rights if a co-developer withdraws.
- Species-protection review and authorization: if the project's biological assessment is incomplete or has identified a protected species for which no required authorization has been obtained, the project faces a stop-work risk and a potential violation; assess whether the required authorizations are in place.
- Buyer creditworthiness over a long PPA term: a long-term PPA creates material counterparty credit risk because the buyer's financial condition may change significantly over the term; assess whether the PPA includes credit enhancement provisions such as a parent guarantee, letter of credit, investment-grade rating covenant, or periodic reassessment.
- Site control and easement adequacy: the seller's ability to perform under the PPA depends on unencumbered site control; if any required easements are unrecorded, subject to priority encumbrances, or incomplete in scope, the seller may face operational restrictions that impair delivery.

## 4. Analytical scaffolds

- For each issue, identify the PPA provision, identify the source-document cross-reference, explain the seller-side risk, assign a severity rating, and recommend a specific mitigation.
- Use an ordinal severity scale defined once and apply it uniformly: Critical, High, Medium, Low.
- For each issue, close the analysis with three moves: tie the issue to a figure, threshold, term, or other source-document scale; cross-reference the clause, schedule, model assumption, or ancillary document that interacts with it; and state the downstream consequence for the seller.
- For financial issues, compare the PPA commercial terms against the project model and flag any model assumption that is inconsistent with the contract.
- For species-protection issues, identify the relevant habitat or species concern, whether the biological review is complete, whether required authorization exists, and whether any gap remains.
- For interconnection issues, identify the cost-sharing structure, note any withdrawal-risk transfer mechanism, and flag the absence of a seller cost cap or step-in right.
- For credit issues, compare the PPA credit support package against the transaction tenor and identify any missing enhancement.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Tax-credit timing, debt closing, and coverage interact: if the project model assumes tax-credit proceeds close simultaneously with debt, but actual monetization may be delayed, early-period coverage may be lower than modeled.
- The property tax abatement period is a temporal constraint: if the abatement expires before the PPA term, the post-abatement property tax burden must be modeled; an expiration not reflected in the project model understates cost.
- Environmental authorizations, construction start, and commercial operation are sequential dependencies: a missing permit or incomplete biological review can convert a contractual milestone into a stop-work or delay risk.
- Site control, easement perfection, and interconnection rights must be aligned with project timing; a gap in one can impair the ability to meet the delivery date or achieve COD.

## 6. Output structure conventions

- Produce a risk memorandum organized by numbered issues, not a generic narrative.
- Define the severity scale once near the top, then apply one severity label to each issue entry.
- For each issue, include: the affected provision or document, seller-side risk, severity, cross-document reference, and recommended mitigation.
- Include a cross-document consistency section comparing the PPA against the project model, permitting record, site control package, interconnection materials, and any lender-facing assumptions.
- Keep the seller's perspective explicit throughout and avoid buyer-neutral phrasing where the risk burden falls on the seller.
- End with a Recommended Actions block that uses imperative verbs, assigns responsibility to the relevant role named in the source set, and ties each action to a milestone or urgency anchor drawn from the transaction.
