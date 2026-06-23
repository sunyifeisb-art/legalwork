---
name: review-counterparty-redlines-nda-template
task_id: intellectual-property/review-counterparty-redlines-to-standard-nda-template
description: Reviewing multiple counterparties' redlined NDAs against a clean template and playbook to produce a deviation analysis with risk assessments and recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Review Counterparty Redlines to Standard NDA Template

## 1. Subject-matter triage

When the source set includes multiple redlined NDAs, enumerate each counterparty first and analyze each redline on its own terms before comparing across counterparties. Treat the clean template and playbook as the baseline for every pass. If a provision is missing, renumbered, or rephrased, test whether the change is substantive rather than relying on markup appearance alone.

For each NDA, separate:
- tracked changes that are visible in the markup,
- silent changes that affect meaning without obvious formatting cues,
- provisions added from elsewhere,
- provisions deleted entirely,
- and provisions whose placement or renumbering obscures the deviation.

If only one NDA is actually in scope, say so explicitly and explain why cross-counterparty comparison is not needed.

## 2. Failure modes the skill is correcting

- Collapsing multiple counterparties into one blended review and losing counterparty-specific leverage, context, or market position
- Missing silent edits, deleted clauses, or numbering changes that alter substance without obvious markup
- Listing deviations without classifying their risk, playbook position, or recommended response
- Treating all deviations as equally material instead of assigning a uniform severity level
- Stopping at diagnosis instead of closing each issue with an action recommendation
- Ignoring recurring market asks across counterparties that may justify template or playbook refinement
- Failing to surface whether the NDA is being shifted from unilateral to mutual, or whether a nonstandard residual-knowledge concept is being introduced
- Relying on visual redline styling alone instead of making every substantive change legible in plain text

## 3. Legal frameworks / domain conventions that apply

- Focus on the core NDA provisions that commonly drive risk: definition of confidential information, exclusions, permitted use, disclosure standards, term, return or destruction, remedies, residual knowledge, assignment, compelled disclosure, governing law, and mutuality
- Treat expansions of protected information and narrowing of standard exclusions as higher-risk changes; the same is true for expanded use rights, longer retention of copies, weaker return/destruction mechanics, or liability-limiting remedy language
- Treat a unilateral-to-mutual shift as a structural issue, not a cosmetic one; analyze whether disclosure obligations, permitted recipients, and remedy symmetry remain coherent
- Treat residual-knowledge language as a distinct concept requiring separate assessment because it can materially weaken protection even where the rest of the NDA appears standard
- Preserve the playbook position for each issue: acceptable, negotiable, or unacceptable, and explain the reason in business terms
- Where the source documents identify a governing law or specific rule, use that authority as the reference point for legal framing; do not state a conclusion without tying it to the operative contract language and the controlling source

## 4. Analytical scaffolds

1. Identify the counterparty and isolate its redline from the others.
2. Compare the redline to the clean template clause by clause, then verify whether any omitted, moved, or reworded text creates a silent deviation.
3. For each deviation, classify the change as an expansion, narrowing, deletion, addition, substitution, or structural shift.
4. State the playbook position, then the practical risk, then the recommended response.
5. If a deviation appears in multiple counterparty versions, note the pattern and assess whether it looks like a market ask or a one-off negotiation point.
6. Check whether the deviation interacts with another clause, defined term, or schedule elsewhere in the NDA.
7. Close each issue with a severity assessment on a fixed ordinal scale defined once at the top of the report, and keep that scale consistent across all entries.
8. When the issue matters in context, anchor the analysis to the size, duration, or operational scope disclosed in the source documents rather than speaking abstractly.
9. End each issue with an explicit recommendation that names the responsible internal role and the timing pressure created by the transaction or review cycle.
10. For any change you describe, make the text legible in plain language and, where reproducing altered language is needed, use a robust textual change marker so the deviation can be identified even outside formatting.

## 5. Vertical / structural / temporal relationships

Review each counterparty independently first, then compare laterally across counterparties for recurring asks, asymmetries, or market-standard pressure points. Within each NDA, read provisions vertically: defined terms feed operative clauses, operative clauses feed exceptions, and exceptions feed remedies and post-termination mechanics.

Pay special attention to temporal relationships, including:
- survival of confidentiality obligations,
- duration of the term versus duration of use restrictions,
- post-termination return or destruction obligations,
- and any time-limited carveouts that continue past termination.

Where a clause references another provision, confirm whether the cross-reference preserves the intended scope or accidentally widens or narrows it.

## 6. Output structure conventions

- Produce a deviation report organized by counterparty, then by provision.
- Open with a short severity legend using a uniform ordinal scale such as Critical / High / Medium / Low, and apply it consistently.
- For each entry, include: provision name, baseline template position, counterparty change, deviation type, playbook position, severity, risk assessment, and recommended response.
- Include both tracked and silent deviations where they have substantive effect.
- Where useful, note the related clause or defined term that changes the analysis and the downstream business consequence.
- Add a cross-counterparty patterns section identifying repeated asks, likely market positions, and whether a template or playbook revision should be considered.
- End with a Recommended Actions section that assigns concrete next steps to the appropriate internal role and ties them to the review or signing timeline.
- If reproducing altered language in the report, use an explicit textual convention that survives export and makes deletions, insertions, and substitutions clear in plain text.
