---
name: extract-credit-agreement-covenants
task_id: corporate-ma/extract-credit-agreement-covenants
description: Guides extraction and analysis of the covenant package in a credit agreement for acquisition diligence, cross-referenced against current compliance data to identify constraints and risks.
activates_for: [planner, solver, checker]
---

# Skill: Credit Agreement Covenant Extraction for Acquisition Diligence

## 1. Subject-matter triage

- Determine the document set in scope before analysis: the credit agreement, amendments or joinders, the latest compliance certificate or officer certificate, and the Q3 compliance data referenced by the request.
- If multiple reporting periods, borrowers, guarantors, facilities, or tranches are present, enumerate them first and analyze each separately rather than collapsing them into a single pass.
- Treat the acquisition as the organizing fact pattern: identify whether it is a direct or indirect ownership change, whether control shifts at parent or sponsor level, and whether the transaction changes any covenant metric or consent condition.

## 2. Failure modes the skill is correcting

- The extraction lists covenant provisions without tying them to current financial data, leaving the buyer without a view of present covenant risk.
- Negative covenants are captured without their carve-outs, baskets, builder mechanics, or exceptions, producing an incomplete picture of permitted conduct.
- Financial maintenance covenants are identified but not tested against current compliance data, so headroom, breach risk, and cure mechanics remain unclear.
- Change-of-control and mandatory prepayment mechanics are extracted in isolation and not tested against the proposed acquisition, leaving the transactional consequence unanalyzed.
- The memo describes restrictions but does not translate them into deal-structuring implications, waiver needs, or diligence follow-up.

## 3. Legal frameworks / domain conventions that apply

- Credit agreements are typically organized into financial maintenance covenants, affirmative covenants, negative covenants, and change-of-control / event-of-default provisions.
- Financial maintenance covenants must be read with their test date, measurement period, applicable add-backs, cure rights, and any equity cure provisions; the operative rule is the agreement’s defined covenant text, not a shorthand label.
- Negative covenants must be analyzed together with exceptions, baskets, ratios, grower features, permitted acquisitions, permitted liens, permitted debt, and other defined carve-outs.
- Change-of-control provisions often trigger mandatory prepayment, lender consent, or an event of default; the operative consequence is controlled by the agreement’s express remedy language.
- The deal analysis should be anchored to the agreement’s defined terms and to any attached compliance materials; where a financial ratio is stated, the governing comparison is the agreement’s own methodology and the disclosed current compliance data.
- For legal propositions tied to interpretation, rely on the agreement’s definitions and operative provisions as the controlling authority; where a standard market concept is used, state it by its conventional name and tie it to the text that invokes it.

## 4. Analytical scaffolds

- Start with a covenant inventory:
  - identify each financial maintenance covenant;
  - identify each affirmative covenant that imposes ongoing reporting, delivery, insurance, tax, litigation, or maintenance obligations;
  - identify each negative covenant and every material exception;
  - identify any change-of-control, mandatory prepayment, or default provision implicated by ownership change.
- For each financial maintenance covenant, extract:
  - metric;
  - threshold;
  - testing frequency and measurement date;
  - whether the test is incurrence-based or maintenance-based;
  - cure right, if any, and its conditions;
  - whether the latest compliance data shows compliance, cushion, or stress.
- For each negative covenant, extract:
  - the base prohibition;
  - all material exceptions;
  - any basket, carve-out, or permitted transaction;
  - any grower or builder mechanic;
  - whether the acquisition falls within or outside the permitted scope.
- For each acquisition-sensitive provision, test the transaction against the definition and then the remedy:
  - does the transaction fit the definition;
  - if yes, what consequence follows;
  - if no, what factual assumption keeps it outside.
- Where several covenants interact, resolve the interaction explicitly rather than listing them separately; for example, note when a transaction could be permitted under a negative covenant but still fail a change-of-control test.
- Close each issue by stating the scale of the constraint using the source documents’ own figures or thresholds, the relevant cross-reference, and the downstream deal consequence.

## 5. Vertical / structural / temporal relationships

- Track hierarchy from defined term to covenant to exception to remedy; do not analyze an exception before identifying the prohibition it modifies.
- Track time from signing to closing to post-closing reporting dates; a covenant that is compliant at signing may still be stressed by the next test date or by closing mechanics.
- Track entity structure: parent, borrower, subsidiaries, guarantors, and restricted versus unrestricted entities may be treated differently, so state which entity is burdened or benefited.
- Track causation: covenant text controls conduct, compliance data tests current status, and the acquisition tests whether the transaction itself triggers a separate consequence.

## 6. Output structure conventions

- Produce a single memorandum in conventional diligence form, not a bare extraction table.
- Use a short executive summary up front, then a covenant-by-covenant analysis organized by category.
- For each issue or constraint, include an explicit severity label using a consistent ordinal scale stated once at the top of the memo.
- Each issue entry should state: the covenant, the operative text or defined concept in paraphrase, the current compliance status if applicable, the cross-reference that matters, the transaction consequence, and any diligence follow-up.
- End with a concise Recommended Actions section that assigns each action to a responsible role and ties it to the relevant transactional milestone or deadline.
- Keep the memo analytical and operative; do not merely restate document language, and do not omit the practical implication for acquisition diligence.
