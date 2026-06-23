---
name: its-identify-issues-end-use-certificate
task_id: international-trade-sanctions/identify-issues-in-end
description: Produces a risk assessment memorandum for an end-user certificate and supporting transaction documents that identifies regulatory basis errors, document-to-document discrepancies, transit route disclosure gaps, entity-list proliferation basis implications, catch-all end-use control triggers, and government authentication requirements for the destination country.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in an End-Use Certificate

## 1. Subject-matter triage (only if applicable)

- Treat the end-user certificate as one component of a broader export-control record, not as a standalone compliance proof.
- Identify each product, party, destination, routing point, and end use that appears in the source set before evaluating risk.
- If multiple items, counterparties, destinations, or transaction tranches appear, analyze each separately rather than collapsing them into one representative review.
- If only one item or one transaction is in scope, say so explicitly and anchor the analysis to that single record.

## 2. Failure modes the skill is correcting

- Reviewing the certificate for facial completeness without testing whether the cited regulatory basis matches the item’s control status and licensing framework.
- Treating a matching signature or form as sufficient while ignoring discrepancies across the certificate, invoice, purchase order, letter of credit, shipping papers, and related transaction documents.
- Missing diversion indicators created by undeclared transshipment points, intermediary consignees, unusually routed shipments, or destination-to-route mismatches.
- Failing to separate ordinary item-control analysis from restricted-party analysis, especially where a listing basis can extend controls to otherwise low-control items.
- Missing catch-all end-use restrictions when the stated or inferable end use suggests prohibited programs, military, nuclear, chemical, biological, or other sensitive applications.
- Overlooking destination-country authentication or legalization requirements that can make an otherwise complete certificate procedurally insufficient.
- Describing a concern without tying it to the operative authority, the conflicting document, and the practical consequence for the transaction.

## 3. Legal frameworks / domain conventions that apply

- Match the certificate’s regulatory basis to the item’s classification and destination-specific licensing regime; the cited basis must support the control status actually implicated by the goods.
- Compare disclosed value, quantity, description, consignee, end user, and dates across the full document set; inconsistencies may indicate a different transaction, an incomplete record, or a diversion risk.
- Treat routing omissions as substantive when goods will pass through a third country, especially where the route increases enforcement or diversion risk.
- Analyze restricted-party status by listing basis, not merely by presence on a list; a proliferation-related or similarly enhanced basis may impose controls that an end-user certificate does not cure.
- Apply catch-all controls where the exporter knows or has reason to know of prohibited or sensitive end use, regardless of the item’s ordinary classification.
- Check destination-country rules for government authentication, consular certification, notarization, legalization, or other formal acceptance requirements for end-user certificates.
- Use the controlling authority stated in the source documents where provided; otherwise cite the applicable statute, regulation, or generally recognized export-control authority by name and section or part.
- Keep the memo focused on risk assessment: identify the issue, cite the governing rule, explain the conflict in the source set, and state the consequence for clearance, licensing, or shipment release.

## 4. Analytical scaffolds

1. Build an issue inventory of all products, parties, destinations, routing points, and end uses appearing in the source documents.
2. For each product, test whether the certificate’s stated regulatory basis fits the item’s classification and intended destination.
3. Compare the certificate against the invoice, purchase order, letter of credit, packing list, transport documents, and any side letters for inconsistencies in description, quantity, value, consignee, or timing.
4. Identify every transshipment point, intermediate consignee, freight forwarder, or hub country and check whether it is disclosed in the certificate and consistent with the route.
5. For each listed party, determine the basis for any restricted-party concern and assess whether that basis changes the licensing analysis for the transaction.
6. Read the stated end use for any catch-all trigger or prohibited-program indicator and assess whether the certificate understates or omits a sensitive use.
7. Check whether the destination jurisdiction imposes authentication, legalization, or comparable formalities on end-user certificates and whether the submitted document satisfies them.
8. Assess whether document inconsistencies, route gaps, or party-screening issues create diversion risk or undermine the reliability of the certificate as a compliance support.
9. For every issue, state: the rule implicated, the source-document conflict, the operational or regulatory consequence, and the corrective step needed before shipment.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track the transaction from origin to final destination, including any intermediate stops, because compliance risk often turns on the path rather than the endpoint alone.
- Distinguish document hierarchy: purchase terms, invoice, transport documents, and banking documents may each reveal a different version of the deal.
- Give priority to the most recent or operative document only when the source set makes clear that later documents supersede earlier ones; otherwise treat inconsistencies as unresolved.
- If the certificate is date-sensitive, assess whether it predates, matches, or postdates the commercial documents in a way that affects reliability or authenticity.
- If the letter of credit or payment terms diverge from the stated transaction value or quantity, treat that as a separate diversion or mismatch indicator.

## 6. Output structure conventions

- Draft a risk assessment memorandum in a conventional legal memo shape with a concise issue summary, analysis by issue, and closing recommendations.
- State the severity scale once near the top and apply it uniformly to every issue using ordinal labels such as Critical, High, Medium, and Low.
- Lead with the most consequential issues first.
- For each issue, include:
  - a short issue heading,
  - severity,
  - the governing authority,
  - the document mismatch or risk indicator,
  - why it matters for export-control or sanctions compliance,
  - the practical consequence for the transaction.
- Where multiple documents are relevant, compare them directly in the discussion rather than burying the discrepancy in narrative.
- Close each issue with a concrete consequence and a correction needed before the transaction proceeds.
- End with a Recommended Actions section that uses imperative verbs, assigns responsibility to a role reflected in the source materials where possible, and ties each action to the next transactional or regulatory step.
