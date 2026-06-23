---
name: its-analyze-cross-border-distribution-agreement
task_id: international-trade-sanctions/analyze-cross
description: Produces a risk memorandum for a cross-border distribution agreement that identifies competition law restrictions, regulatory authorization gaps, IP protection deficiencies, and data compliance obligations derived from the deal documents.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Cross-Border Distribution Agreement for Regulatory and Commercial Risks

## 1. Subject-matter triage

- Treat the agreement, term sheets, emails, side letters, drafts, schedules, product lists, and regulatory attachments as one integrated source set.
- First map the parties, territory, product lines, channels, and timing of contemplated launch; if multiple products, jurisdictions, or periods are implicated, enumerate them before analyzing each one.
- Separate issues that affect deal permissibility from issues that affect operating risk, enforcement risk, and brand control.
- If the documents point to multiple regulatory regimes, apply the regime tied to each product, territory, and data flow rather than assuming a single framework.

## 2. Failure modes the skill is correcting

- Parsing clause-by-clause issues without recognizing when a resale-pricing term can undermine vertical-exemption treatment for the whole arrangement.
- Missing product-specific market-entry approvals by failing to cross-check product identifiers, formulations, and intended destination markets against the relevant authorization rules.
- Overlooking disclosures in email chains and side documents that create obligations or reveal material risks not reflected in the agreement text.
- Treating data language as boilerplate instead of testing the actual customer, distributor, and support data flows the deal creates.
- Ignoring the interaction between governing law, dispute forum, and the risk that the distribution relationship may be recharacterized as an agency arrangement.
- Failing to connect liability allocation with product-regulatory, IP, and downstream-channel exposure.

## 3. Legal frameworks / domain conventions that apply

- Vertical restraints and resale-price maintenance: assess minimum or fixed resale-price provisions under the applicable competition-law regime, including whether the term removes safe-harbor treatment or heightens enforcement exposure.
- Post-term non-compete limits: compare any post-termination restraint to the relevant vertical-block-exemption duration and scope limits.
- Product authorization and market-entry approvals: test each product and variant against the applicable authorization, notification, labeling, or import requirements before sale in the destination market.
- Trademark and brand coverage: verify that the relevant marks, packaging rights, and product-line coverage support the planned territory and channel.
- Material disclosure obligations: treat pending investigations, enforcement contacts, or other known regulatory issues as facts that may need to be disclosed before signing under the applicable contract, misrepresentation, and good-faith doctrines.
- Sub-distribution and channel-control risk: assess consent rights, audit rights, and flow-down obligations where sub-distributors or resellers may be appointed.
- Commercial-agent reclassification: evaluate the economic reality of the relationship under the governing law, including pricing control, inventory risk, customer ownership, and termination structure.
- Data protection and transfer rules: analyze the specific personal-data flows created by order processing, customer support, analytics, and marketing, including controller/processor roles, lawful basis, transfer mechanism, retention, and rights-handling procedures.
- Product-liability and indemnity allocation: determine whether the contract aligns responsibility with the party best able to control manufacture, labeling, import, storage, and customer-facing representations.

## 4. Analytical scaffolds

1. Build a source map of all operative documents and identify which facts come from the agreement text versus emails, side documents, or attachments.
2. Create an issue inventory grouped by competition, regulatory authorization, IP/brand, data protection, channel control, agency risk, and liability allocation.
3. For each issue, state the governing rule by name and section or other controlling citation from the applicable authority, then apply it to the facts in the source set.
4. Where a rule turns on a threshold, duration, scope, or product-by-product test, compare the contract term or product entry against that threshold explicitly.
5. For each finding, identify the document source, the interacting clause or related document, and the downstream commercial, regulatory, or litigation consequence.
6. When the record contains multiple products, territories, or data-processing scenarios, run the analysis separately for each rather than collapsing them into one generic assessment.
7. Rank issues by severity using a single ordinal scale defined at the top of the memorandum and apply that scale consistently across the report.
8. End each issue with a concrete action recommendation tied to a responsible role and the transaction or launch milestone that makes the action timely.

## 5. Vertical / structural / temporal relationships

- Track how obligations shift across signing, pre-launch, launch, post-launch, and post-termination periods.
- Distinguish supplier obligations, distributor obligations, and joint obligations, especially where product approvals, notices, or consents must happen before shipment or market entry.
- Identify any clause that conditions rights on prior written approval, notice, certification, or audit, and compare that condition to the timing in the deal documents.
- Where the agreement references external policies, appendices, or side letters, verify whether they expand, narrow, or override the main form.
- If downstream appointments are permitted, map how obligations flow from the main distributor to sub-distributors and back to the supplier.

## 6. Output structure conventions

- Draft a risk memorandum in a conventional memo form with a short executive summary, a severity legend, a deal-critical issues section, and a concise closing action plan.
- Use one ordinal severity label set at the top, then apply it uniformly to each issue.
- For each issue include: severity, issue title, source document or clause, controlling legal authority, risk analysis, interaction with other documents or clauses, consequence, and recommendation.
- Where a legal proposition is stated, name the controlling statute, regulation, rule, treaty article, or leading case rather than stating the conclusion in bare form.
- When the source set includes multiple relevant dates, identify when the fact became known and note that timing in the issue analysis.
- Keep recommendations operational: use an imperative verb, identify the responsible role if the record gives one, and tie timing to signing, pre-launch, shipment, or another concrete milestone.
- If the memorandum must mention internal-document language, surface it verbatim only to the extent necessary to explain the issue and avoid unnecessary quotation.
