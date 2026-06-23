---
name: analyze-counterparty-markup-of-psa
task_id: structured-finance-securitization/analyze-counterparty-markup-of-pooling-and-servicing-agreement
description: Reviewing a counterparty redline of a pooling and servicing agreement where deletions of required backup servicer provisions, fee structure changes, and waterfall modifications must be assessed against an internal playbook and deal economics.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Pooling and Servicing Agreement — Redline Analysis Memorandum

## 2. Failure modes the skill is correcting

- Reviewing only what was added or changed and missing provisions that were deleted outright; deletions must be identified, their functional role stated, and the loss assessed.
- Treating servicing economics as static and missing that fee base, minimums, and timing can shift value materially at closing and over amortization.
- Evaluating a change in isolation rather than tracing how it alters economics, operational readiness, and investor protection across the structure.
- Ignoring rating-agency sensitivity where backup servicing, transition mechanics, or appointment rights deviate from accepted securitization norms.
- Failing to distinguish playbook breaches from playbook silence; silent points must be escalated, not treated as approved.
- Drafting commentary that cannot survive export because the change is visible only through formatting rather than explicit text.
- Omitting an explicit recommendation path, which leaves the memo descriptive rather than negotiable.

## 3. Legal frameworks / domain conventions that apply

- Pooling and servicing agreements allocate collections through a contractual waterfall; priority changes can shift cash away from credit support and into fees or other senior claims.
- Servicing fee constructs must be assessed against the pool balance, note balance, and expected amortization path because the same nominal rate can have different economic effects over time.
- Backup servicer provisions are both continuity mechanisms and credit-support mechanisms; appointment mechanics, readiness obligations, and conversion triggers should be read as a package.
- Successor servicing compensation must be tested against marketability and transition feasibility; an overly generous rate can impair replacement economics and reduce recoveries.
- Operational readiness language matters as much as fee language: a standby provider that is not required to stay current may not be able to assume servicing when needed.
- Rating-agency expectations are a practical constraint in securitization documentation; deviations in backup servicing, fee priority, or transfer mechanics can affect surveillance and ratings stability.
- Indemnity caps, eligibility criteria, and maturity limits should be measured against the transaction’s credit profile and the portion of the pool affected.
- Contract interpretation in this setting should be anchored in the agreement text, the redline, and the internal playbook, with cross-document consistency treated as part of the analysis.

## 4. Analytical scaffolds

1. Start by inventorying the full change set: provisions added, provisions modified, and provisions deleted. Treat deletions as first-class issues.
2. For each issue, state the old language or position, the new language or position, the governing playbook position, and whether the item is acceptable, silent, or a breach.
3. Assign every issue an ordinal severity label using a single scale stated once at the top of the memo, and keep the scale consistent throughout.
4. For every issue, close the analysis with three moves: quantify the issue using a figure or threshold from the deal documents, cross-reference the clause or schedule it interacts with, and state the practical consequence for the client.
5. For waterfall or priority changes, trace the effect through the affected claims in order and explain which constituency is helped or harmed.
6. For fee and compensation changes, assess both closing economics and life-of-deal economics, not one or the other.
7. For deleted provisions, explain what operational or legal function is lost, whether the playbook expects reinstatement, and why the omission matters in practice.
8. For backup-servicer provisions, evaluate readiness, appointment mechanics, conversion triggers, and compensation together rather than as separate, unrelated edits.
9. Compare the counterparty’s cover email or transmittal summary against the actual redline to identify any understatement, overstatement, or omission of change scope.
10. If a point turns on a legal or market norm, cite the controlling agreement section, playbook provision, or recognized securitization convention supporting the conclusion.

## 5. Vertical / structural / temporal relationships

- Waterfall elevation of a backup-servicer or successor fee interacts with all junior cash claims because it reduces amounts available for credit support, not just the fee line item itself.
- Removing active-readiness or conversion language interacts with any increased compensation for standby roles because the structure pays more for a less capable backstop.
- A minimum fee can be more burdensome at closing than a flat fee if the pool is still large or amortizes slowly; the analysis should account for the expected trajectory of the collateral.
- Eligibility restrictions on receivables interact with pool composition and can alter the economics of every note class simultaneously.
- Liability caps and indemnity baskets interact with loss allocation provisions; a cap that seems acceptable in isolation may be inadequate when read against the loss types the provision is meant to cover.
- Any change to servicing transition mechanics should be tested against timing pressure, since transition costs and operational gaps increase as performance deteriorates.

## 6. Output structure conventions

- Use an issue-by-issue redline memo format, not a narrative summary alone.
- Define a severity legend at the top and apply it to every entry.
- For each issue, include: section reference, source of change, old position, new position, playbook status, severity, economic or operational impact, and recommendation.
- Make the plain-text content self-sufficient: mark deletions, insertions, and substitutions explicitly in the memo body so the change is readable even without formatting.
- Where helpful, include short rationale tags after each change callout to explain why the point matters.
- Group related issues under conventional headings such as economics, servicing mechanics, waterfall priority, eligibility, and transfer/termination mechanics.
- Prioritize the memo so the most consequential or cross-cutting issues appear first, followed by lower-impact points.
- End with a concise Recommended Actions block that assigns each next step to the appropriate role and ties it to the negotiation call or other transactional milestone.
- If the source set contains only one relevant transaction or one redline version, state that expressly; otherwise treat each distinct version or document as a separate comparison item.
