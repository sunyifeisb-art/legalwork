---
name: review-dpa-template-eu-us-requirements
task_id: intellectual-property/review-data-processing-agreement-template-against-eu-and-us-requirements
description: Reviewing a data processing agreement template against EU and US data protection requirements to produce a conformance memorandum identifying required changes and pre-launch actions.
activates_for: [planner, solver, checker]
---

# Skill: Review DPA Template Against EU and US Requirements

## 1. Subject-matter triage (only if applicable)

- Confirm the governing privacy perimeter before analyzing the template: EU controller-processor terms, applicable US state privacy or data-protection vendor terms, any international transfer path, and any sector-specific overlay.
- Separate mandatory contract terms from operational follow-through; some deficiencies require redrafting, while others require implementation, notices, or internal controls.
- If more than one data flow, jurisdiction, data category, or vendor role is in scope, enumerate each one first and analyze them separately rather than treating the template as a single generic arrangement.
- Where the template is paired with commercial terms, data-flow summaries, or negotiation emails, treat those materials as controlling context for scope, roles, and practical feasibility.

## 2. Failure modes the skill is correcting

- Reviewing only for EU-style processor language while missing U.S. vendor, service-provider, or processor restrictions that may require different drafting.
- Treating a clause as acceptable because it satisfies one regime even though it is inconsistent with another regime or the commercial data flow.
- Missing required distinctions between launch-blocking contract gaps and ongoing compliance obligations.
- Failing to tie each gap to the actual role allocation, processing purpose, and transfer path reflected in the source materials.
- Producing a memo that states problems but does not give prioritized, actionable redline guidance.

## 3. Legal frameworks / domain conventions that apply

- EU controller-processor agreement requirements: assess whether the DPA includes the mandatory processor commitments recognized under the applicable EU data protection framework, including documented instructions, confidentiality, security, subprocessors, assistance with data-subject rights, breach handling, deletion or return, audit cooperation, and allocation of responsibilities.
- Cross-border transfer safeguards: if personal data may move outside the relevant European transfer perimeter, assess whether the contract incorporates or cross-references an approved transfer mechanism or equivalent safeguard under the applicable transfer rules.
- U.S. state privacy and data-protection vendor terms: evaluate whether the template satisfies processor, service-provider, contractor, or equivalent vendor restrictions, including use limitations, prohibition on incompatible secondary use, assistance obligations, and required flow-downs.
- Status-preservation drafting: if the business wants to preserve a processor, service-provider, or equivalent status, test whether the template contains the restrictions and operational guardrails that status requires.
- Sector-specific overlays: if regulated health data or another specially regulated data type is in scope, determine whether a separate agreement or supplemental terms are required in addition to the baseline DPA.
- Data localization and residency commitments: if the commercial model, public-sector terms, or customer policy restricts storage or processing location, confirm the agreement addresses those constraints.
- Breach-notification allocation: compare the contract’s incident notice mechanics with the applicable legal allocation of notification duties and ensure the drafting is internally consistent.

## 4. Analytical scaffolds

1. Identify the governing regime set and the vendor’s role under each regime from the playbook, commercial terms, data-flow materials, and negotiation emails.
2. Review the template against the mandatory EU contract terms and flag each missing, diluted, or internally inconsistent clause.
3. Review the template against the applicable U.S. privacy contract requirements and flag each missing, diluted, or internally inconsistent clause.
4. Test any cross-border transfer language against the actual data flow and the transfer safeguard, if any, referenced in the source set.
5. If a sector-specific regime applies, assess whether the baseline DPA is sufficient or whether supplemental documentation is required.
6. Compare clauses that are acceptable in one framework but problematic in another, and identify the drafting conflict that must be resolved.
7. Classify each issue as pre-launch required, pre-launch recommended, or ongoing compliance, and pair it with a concrete drafting or operational fix.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Where EU and U.S. regimes point in different directions, prefer the formulation that preserves the intended commercial role while meeting the stricter operational control, then note the tradeoff.
- Distinguish template defects that must be cured before signature or go-live from obligations that can be satisfied after launch through policy, process, or recordkeeping.
- If the source set shows phased deployment, limited pilot processing, or staggered data transfers, align the memo’s recommendations to those temporal milestones.

## 6. Output structure conventions

- Produce a compliance-gap memorandum, organized by framework and then by issue, using conventional section headings rather than a rubric-shaped checklist.
- Include a short issue legend at the top with an ordinal severity scale defined once and used consistently for every finding.
- For each finding, state: the clause or concept at issue, why it is deficient, the applicable authority or contractual control point, the consequence for the client, and the recommended fix.
- When citing legal propositions, name the controlling authority, regulation, statute, or recognized doctrine supporting the point; do not state conclusions in bare form.
- For each issue, tie the analysis to the relevant source materials, including the commercial terms, data flows, or negotiation positions that create the drafting risk.
- Quantify or otherwise scale the issue where the source materials provide a relevant figure, threshold, volume, term, or other concrete measure; do not invent numbers.
- End with a concise Recommended Actions section that assigns each action to the responsible role and ties timing to signing, launch, or another concrete milestone from the source set.
- If redline recommendations are included, make them plain-text durable so the proposed edits remain intelligible after export and can be translated directly into markup.
