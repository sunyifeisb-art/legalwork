---
name: its-compare-cfius-mitigation-vs-nst
task_id: international-trade-sanctions/compare-mitigation-agreement-against-national-security-terms
description: Produces a structured gap analysis memo that maps each national-security-term requirement to the draft mitigation agreement, identifies deviations with side-by-side timing comparisons where relevant, distinguishes commercially motivated deviations from inadvertent gaps, and flags missing mandatory provisions when they appear in the source materials.
activates_for: [planner, solver, checker]
---

# Skill: Gap Analysis — Compare Draft CFIUS Mitigation Agreement Against National Security Terms

## 1. Subject-matter triage

- Treat the National Security Terms as the controlling authority and the draft mitigation agreement as the comparison document.
- If multiple term provisions or related exhibits are in scope, enumerate the full set of requirements first and analyze each one separately; do not collapse distinct obligations into a single pass.
- Separate mandatory provisions, timing commitments, operational controls, notice/reporting duties, remedies, and any effectiveness-trigger language before evaluating gaps.
- If comparison materials or negotiation notes are available, use them only to contextualize whether a deviation appears negotiated or inadvertent; they do not displace the controlling terms.

## 2. Failure modes the skill is correcting

- Reviewing the draft agreement before building a term-by-term checklist, which leads to missed requirements that never get tested against the draft.
- Treating a partial overlap as sufficient without identifying what is missing, narrowed, delayed, or made conditional.
- Identifying a timing deviation without stating the controlling deadline and the draft deadline side by side.
- Treating absent monitor-report deadlines or delayed effectiveness provisions as minor drafting issues rather than substantive control gaps.
- Failing to distinguish negotiated commercial concessions from drafting omissions that likely need follow-up.
- Stating a gap without tying it to the interacting provision, the governing term, and the practical consequence for oversight, enforcement, or compliance.
- Producing a memo that describes differences but does not recommend next steps or assign the issue to a responsible role.

## 3. Legal frameworks / domain conventions that apply

- Use a requirement-by-requirement mapping method: each controlling term requirement should be matched to the corresponding draft provision, then classified as fully addressed, partially addressed, or absent.
- For each timing term, compare the controlling timeframe and the draft timeframe explicitly; any extension, omission, or ambiguity should be assessed for its oversight effect.
- Confirm whether mandatory remedy language is preserved, narrowed, or omitted; if omitted, treat that as a substantive gap, not a stylistic variation.
- Confirm whether any technology-control or similar operational control becomes effective at the required trigger point; a later effectiveness date can create an uncovered interval.
- Confirm whether any monitor-report obligation has a specific delivery deadline; the absence of a deadline is itself a drafting gap.
- Where a deviation appears commercially motivated, identify the likely bargaining rationale; where it appears inadvertent, flag it as a drafting defect requiring correction.
- When the source documents identify authority by name, cite it as stated there; when applying generally recognized legal or regulatory concepts, identify the controlling authority with enough specificity to support the proposition.
- Measure the significance of each issue by its practical consequence to national-security oversight, reporting discipline, enforcement leverage, or operational control.

## 4. Analytical scaffolds

1. Extract every controlling term requirement into a numbered checklist before opening the draft agreement.
2. For each checklist item, locate the corresponding draft provision or confirm absence.
3. Classify each item as: satisfied, partially satisfied with deviation, or missing.
4. For timing-related items, state the controlling timeframe and the draft timeframe side by side in the same entry.
5. For each issue, identify any linked clause, schedule, exhibit, or implementation requirement that changes the analysis.
6. Assess whether the deviation looks commercially negotiated or more likely inadvertent, using any comparison materials or negotiation notes available.
7. State the downstream consequence of the deviation for the client, including compliance, enforcement, operational, or transactional impact.
8. End each issue entry with a concrete recommendation tied to the responsible role and a milestone or relative urgency.
9. Where the issue depends on a governing term or regulatory concept, cite the controlling authority by name and section or comparable identifier.

## 5. Vertical / structural / temporal relationships

- The controlling terms govern; the draft agreement is measured against them.
- Related exhibits, implementation plans, reporting protocols, and remedies clauses may modify the effect of a single requirement and must be cross-checked.
- Timing mismatches matter most when they create a period during which controls are not yet effective or reports are not yet due.
- A deviation that is acceptable in one context may be material if it affects a mandatory oversight function, remedy, or trigger date.

## 6. Output structure conventions

- Use a memo format organized by controlling term requirement.
- Start with a brief severity legend using a uniform ordinal scale such as Critical / High / Medium / Low.
- Include an issue table or sectioned entries with, for each requirement: the requirement, draft treatment, deviation or absence, severity, interaction with other provisions, consequence, and recommendation.
- When timing is involved, present the two timeframes in the same line or subentry.
- Distinguish clearly between negotiated deviations and apparent drafting gaps.
- Include a concise summary of the most material gaps at the beginning or end.
- End with a Recommended Actions section that assigns each action to a role and ties it to a deadline, milestone, or urgency level.
- Ensure the memo is written as an analysis, not as a mere redraft or narrative summary.
