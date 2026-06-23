---
name: its-compare-product-specs-ccl
task_id: international-trade-sanctions/compare-product-specifications-against-commerce-control-list
description: Produces an export classification memorandum that compares product technical specifications against applicable export-control jurisdiction frameworks, checks for end-use inconsistencies, reviews re-export chain coverage, and recommends enhanced due diligence for ambiguous intermediaries.
activates_for: [planner, solver, checker]
---

# Skill: Compare Product Specifications Against Commerce Control List

## 1. Subject-matter triage
- Treat the work as a product-by-product export-classification review, not a generic compliance summary.
- Separate each product, destination, intermediary, and end-use assertion before analysis; do not blend distinct items or shipment legs.
- If the source set includes multiple products or multiple routing legs, enumerate them first and analyze each independently.
- If only one product or one route is in scope, state that affirmatively and explain why.

## 2. Failure modes the skill is correcting
- Accepting a preliminary classification memo at face value without independently testing whether the product’s technical specifications pull it into a more restrictive export-control jurisdiction than the commercial-control classification suggests.
- Treating the end-use certificate as conclusive without comparing its stated civil end use against the product’s actual technical capabilities.
- Missing re-export or transshipment issues by analyzing only the direct export leg and not the intermediate-country-to-final-destination leg.
- Overlooking ambiguous intermediaries that warrant enhanced due diligence before any shipment proceeds.
- Failing to tie each issue to the specific source document evidence, the applicable rule, and the practical consequence for the transaction.

## 3. Legal frameworks / domain conventions that apply
- Compare the item against the controlling export-control framework using the product’s technical attributes first, then test whether a commercial-control label is displaced by a more restrictive control regime.
- Treat capabilities suggesting anti-spoofing navigation, military-grade encryption, tactical data links, targeting functionality, electronic warfare processing, or similar sensitive performance features as classification-relevant.
- Compare the end-use certificate to the product specifications for internal consistency; a civil-use assertion does not resolve an inconsistency created by military-grade or otherwise incompatible capabilities.
- Apply military-end-use screening where the purchaser, user, destination, or stated program ties the transaction to defense or military development activity.
- Assess each shipping leg separately; an authorization for export to an intermediate country does not eliminate the need to verify onward transfer authority to the final destination.
- Treat ambiguous trading companies, freight intermediaries, or customer aggregators as due-diligence flags requiring follow-up before reliance.

## 4. Analytical scaffolds
1. Identify the product, its stated classification, and the technical characteristics that matter for export-control purposes.
2. Test whether any technical feature suggests a more restrictive jurisdiction or control category than the preliminary classification memo states.
3. Compare the purchase order, datasheets, and compliance memo against the end-use certificate for internal consistency and red flags.
4. Assess whether the destination, end user, or program description triggers military-end-use scrutiny or similar enhanced review.
5. Map the shipment route, identify every intermediate country, and verify whether each onward leg is separately authorized where required.
6. Evaluate intermediary parties for business-model opacity, customer ambiguity, or routing features that justify enhanced due diligence.
7. For every issue, state the governing rule or authority, the document evidence that triggers the issue, and the practical consequence for classification, authorization, or shipment timing.
8. If the source record does not support a firm classification outcome, recommend a formal jurisdictional determination or equivalent escalation rather than forcing certainty.

## 5. Vertical / structural / temporal relationships
- Distinguish the hierarchy of controls: technical specification analysis comes before reliance on a preliminary commercial classification.
- Distinguish the documents’ roles: the purchase order, datasheets, end-use certificate, screening report, compliance memo, and CCL excerpts may each support or undermine the others, but none should be treated as dispositive in isolation.
- Separate pre-shipment issues from transit issues and onward-transfer issues; a gap at any stage can independently affect permissibility.
- If the preliminary memo omits military-end-use screening or similar mandatory review, treat that omission as an independent compliance gap.
- If one document states a civilian use and another document implies sensitive capability, resolve the inconsistency explicitly rather than harmonizing it by assumption.

## 6. Output structure conventions
- Produce a formal export-classification memorandum in a conventional legal/compliance memo shape.
- State a severity scale once at the outset and apply it consistently to each issue identified.
- Use product-by-product headings, and under each product include: technical snapshot, classification comparison, end-use consistency check, routing / intermediary check, issues, and recommendation.
- For each issue, include:
  - severity,
  - the specific specification or statement at issue,
  - the controlling authority or rule in named form,
  - the cross-document conflict or support,
  - the consequence for the transaction.
- Do not give a bare conclusion without naming the rule or authority supporting it.
- End with a concise Recommended Actions section that assigns each action to a responsible role and ties it to a milestone or urgent timing anchor.
- If a jurisdictional conclusion is uncertain, recommend formal determination or further technical review rather than overcommitting.
- Keep the memorandum substantive and decision-oriented; do not merely restate the source documents.
