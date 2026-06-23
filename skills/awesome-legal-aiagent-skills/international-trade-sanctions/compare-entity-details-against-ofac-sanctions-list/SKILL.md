---
name: its-compare-entity-details-ofac-sanctions
task_id: international-trade-sanctions/compare-entity-details-against-ofac-sanctions-list
description: Produces a sanctions screening report that compares entity details against a sanctions reference list, traces beneficial ownership through intermediate entities where relevant, applies the applicable ownership-aggregation analysis, distinguishes between full blocking and narrower transactional restrictions, and assigns match confidence levels with analysis-based next steps.
activates_for: [planner, solver, checker]
---

# Skill: Compare Entity Details Against OFAC Sanctions List

## 2. Failure modes the skill is correcting

- Limiting screening to direct name matches without tracing beneficial ownership chains when ownership analysis is required
- Failing to aggregate interests of multiple restricted-party-linked owners when assessing whether an ownership threshold is collectively met
- Treating all sanctions-list matches as equivalent without distinguishing full blocking requirements from narrower transactional restrictions applicable to sectoral or activity-based restrictions
- Clearing a party on the basis of superficial name variation when other identifiers, ownership links, or location data keep the match unresolved
- Summarizing a match without stating the governing rule, the factual basis, and the downstream compliance consequence

## 3. Legal frameworks / domain conventions that apply

- Use the controlling sanctions framework named in the source materials, and cite the relevant rule, regulation, executive order, program guidance, or policy section for each substantive conclusion.
- Ownership-aggregation analysis: where sanctions rules treat an entity as blocked or otherwise restricted based on ownership, trace direct and indirect ownership through intermediate holding vehicles and aggregate relevant interests as required by the applicable rule set.
- Match confidence classification: sanctions screening commonly classifies each potential match as an exact match, a strong potential match, or a no match; for each classification, state the factual basis and the next analytical step rather than assuming identity from a single data point.
- Blocking versus narrower restrictions: distinguish parties subject to full asset-blocking treatment from parties subject only to narrower transactional prohibitions or limitations; identify the category of restriction that applies to each match and note any transactions that may remain permissible under the applicable rule set.
- Non-distinguishing name variations: common transliteration differences, prefixes, suffixes, abbreviations, and missing patronymics may not be enough to resolve a match; treat such differences as part of the overall identity analysis rather than a standalone clearance factor.
- Name-variation analysis: compare all available identifiers, including legal name, aliases, address, registration or incorporation details, nationality or place of formation, and ownership connections, to determine whether a potential match remains unresolved.

## 4. Analytical scaffolds

1. Identify every prospective counterparty in scope before analyzing; if there is only one, say so expressly and explain why no additional party is in scope.
2. For each counterparty, compare name, aliases, jurisdictional data, registration data, and ownership links against the sanctions reference list, then trace through intermediate entities where ownership-based restrictions may apply.
3. When ownership information is available, test whether direct and indirect interests must be aggregated under the controlling rule before concluding that a restriction threshold is or is not met.
4. For each potential match, classify the result as exact match, strong potential match, or no match, and pair the classification with the factual basis and the next step needed to close the screen.
5. For any party subject to narrower sanctions restrictions, identify the restriction type in procedural terms and state the practical compliance consequence for onboarding, payment flow, trading, or other intended activity.
6. Treat naming differences, transliteration issues, suffixes, and missing middle names as part of the identity analysis only; do not use them as sole clearance grounds.
7. When reviewing a prior screening attempt, identify the point of mismatch, restate the governing identifiers, and correct the analysis from the source facts rather than the earlier conclusion.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare counterparties one by one, then reconcile the results in a final summary so that each entity’s status is visible on its own and in the aggregate.
- If a counterparty sits in a chain of ownership, analyze the chain from the ultimate owner downward and from the named entity upward to confirm whether any restriction attaches at an intermediate level.
- Where multiple restricted-party-linked owners exist, assess their interests together under the applicable rule before deciding whether the threshold outcome changes.
- If the source set reflects prior screening, refresh the analysis against the latest identifiers and ownership facts rather than inheriting the prior label.

## 6. Output structure conventions

- Write a sanctions screening report organized by counterparty.
- Begin with a short scope note and a brief methodology note identifying the sanctions framework and the identity-matching approach used.
- For each counterparty, include: identification details; the sanctions-list comparison; match classification with the factual basis; ownership analysis where relevant; restriction type, if any; and next-step guidance.
- Use a uniform ordinal confidence or severity scale for all counterparties, defined once at the top of the report and applied consistently.
- Include a final summary table or list that shows every counterparty and its classification at a glance.
- End with a concise Recommended Actions section that assigns each action to the responsible business, legal, or compliance role and ties timing to the onboarding or transaction milestone.
- Do not rely on formatting alone to convey the analysis; the plain-text report should be understandable on its own and should clearly surface the governing authority, the match basis, and the consequence for each decision.
