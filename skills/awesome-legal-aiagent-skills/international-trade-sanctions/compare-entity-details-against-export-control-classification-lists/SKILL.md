---
name: its-compare-entity-details-export-control
task_id: international-trade-sanctions/compare-entity-details-against-export-control-classification-lists
description: Produces a per-transaction export control compliance assessment that identifies applicable license exceptions, restricted-party screening issues, re-export chain analysis, and military end-use obligations for each transaction in the review set.
activates_for: [planner, solver, checker]
---

# Skill: Compare Entity Details Against Export Control Classification Lists

## 1. Subject-matter triage

- Treat the assignment as a transaction-by-transaction EAR screening and authorization exercise, not a generic sanctions summary.
- First determine how many distinct transactions, parties, destinations, and shipment legs are actually in scope; if the record is singular on any axis, say so and explain why.
- Identify whether the review set includes direct exports, re-exports, in-country transfers, intermediate-country transshipments, or mixed-use items that require separate analysis paths.
- Surface verbatim quotes from internal documents only when needed to preserve the precise factual trigger for a control analysis.

## 2. Failure modes the skill is correcting

- Analyzing only the direct export leg without recognizing that movement through an intermediate country can create a separate re-export that needs its own authorization analysis.
- Treating party-screening as a binary hit/no-hit exercise without tying the status of the party to the specific item, destination, and transaction role.
- Misapplying license exceptions without checking whether the item classification, destination, end user, or end use makes the exception unavailable.
- Overlooking military-end-use or military-end-user triggers when item descriptions, purchase-order language, or technical specs suggest defense relevance.
- Collapsing multiple transactions into one generalized answer instead of issuing a distinct conclusion for each transaction.
- Stating that a transaction is “permitted” or “restricted” without naming the governing EAR provision or exception rule that supports that conclusion.
- Concluding on risk without stating the operational or regulatory consequence for the client.

## 3. Legal frameworks / domain conventions that apply

- Export Control Reform Act and EAR framework: evaluate controlled items, destinations, end users, and end uses under the governing EAR parts and supplement structure.
- Restricted-party screening: apply the relevant party-based restriction rule for each listed or flagged entity and identify whether a license or other authorization is required before proceeding.
- License exceptions: verify eligibility element by element; do not assume availability where the exception is limited by control reason, destination, end user, or transaction structure.
- Re-export analysis: a transfer from one foreign country to another may be a separate controlled event that must be reviewed on its own facts.
- Military end-use and military end-user controls: where item specifications or purchase-order language indicate dual-use, defense-adjacent, or military application, treat that language as a trigger for further review.
- Unverified-party or assurance requirements: where the framework requires a statement, certification, or assurance before proceeding, identify it as a precondition rather than an afterthought.
- General authority citation discipline: every compliance conclusion should be anchored to the relevant EAR provision, license-exception rule, or other controlling authority named in the source set or in standard practice.

## 4. Analytical scaffolds

1. Build the transaction inventory first: list each shipment, leg, party, destination, item, and stated end use before analyzing any one transaction.
2. For each transaction, identify the item classification and control drivers, then map the destination and party status to the applicable EAR restriction or exception framework.
3. If a party appears on a restricted list or otherwise triggers screening concerns, state the governing restriction rule, the authorization path if any, and the practical consequence of proceeding without clearance.
4. If the record suggests a license exception, test every eligibility condition against the facts rather than relying on a label in the documents.
5. If goods move through an intermediate country or are onward-shipped, analyze that leg separately as a distinct re-export or transfer issue.
6. If the item description, technical specs, or purchase-order language suggests military use or dual-use sensitivity, treat that language as an issue trigger even if the stated commercial purpose is benign.
7. For each issue, write the conclusion in issue-closed form: identify the factual scale or transaction feature, tie it to another document or transaction term that affects the analysis, and state the downstream consequence for the client.
8. Assign an explicit ordinal severity to each issue using a consistent scale defined once at the top of the memo, and use the same scale for every transaction.
9. End each transaction row or subsection with a concrete recommendation that tells the reader what action is needed before shipment, who should take it, and when it should happen relative to the transaction.

## 5. Vertical / structural / temporal relationships

- Track the order of events: classification, screening, end-use review, exception check, licensing decision, shipment, re-export, and post-shipment restrictions may not occur in the same sequence for every transaction.
- Distinguish direct export from onward movement, and distinguish destination-country controls from party-based controls; both may apply at once and one does not subsume the other.
- Where one document supplies the item description and another supplies the destination or end-use statement, reconcile them before stating a final risk rating.
- If the source set reflects multiple counterparties or shipment legs, keep each on its own line or subsection so that the reader can see which fact drives which conclusion.
- Where a later document narrows, expands, or conflicts with an earlier description, note the timing and explain which fact set governs the final risk view.

## 6. Output structure conventions

- Write a compliance assessment memo organized by transaction, using conventional memo headings rather than a rubric-style checklist.
- At the top, define the ordinal severity scale once and use it consistently for all issues.
- For each transaction, include: the parties, item classification and control drivers, destination and shipment path, screening or exception issues, risk rating, and recommendation.
- For each flagged issue, state the governing EAR rule or other controlling authority, the factual trigger, the cross-document or cross-clause interaction, and the downstream consequence.
- When multiple transactions are in scope, number them and keep the analysis parallel so the reader can compare them easily.
- Close the memo with a concise Recommended Actions section that directs the relevant business owner, compliance officer, or counsel to the next step and ties that step to the shipment or authorization milestone.
- Use precise compliance language; avoid vague descriptors that do not state whether the problem is a licensing issue, a screening issue, an end-use issue, or a chain-of-transaction issue.
