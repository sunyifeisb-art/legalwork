---
name: identify-prior-art-deficiencies-patent-defense
task_id: intellectual-property/identify-prior-art-deficiencies-in-patent-infringement-defense
description: Reviewing invalidity contentions in a patent infringement defense to identify weaknesses in the prior art analysis and strategic gaps in the invalidity defense, using claim-by-claim comparison, reference-date checking, and analysis of obviousness support.
activates_for: [planner, solver, checker]
---

# Skill: Identify Prior Art Deficiencies in Patent Infringement Defense

## 1. Subject-matter triage

- Treat the package as an invalidity-contentions review, not a merits opinion on infringement or validity.
- Separate anticipation, obviousness, date/prior-art eligibility, and claim-chart sufficiency before synthesizing overall risk.
- If multiple asserted claims, references, or combinations are in play, enumerate them first and analyze each independently before cross-claim synthesis.
- Focus on whether the contentions are supportable as served and whether they can be cured in time under the applicable amendment schedule.

## 2. Failure modes the skill is correcting

- Reviewing invalidity contentions without verifying that each claim element is actually disclosed in the cited prior art at the location cited in the claim chart.
- Treating partial disclosures, preferred embodiments, or generic statements as though they satisfy all claim limitations.
- Missing obviousness-combination weaknesses, including conclusory motivation-to-combine theories or unsupported expectation-of-success assertions.
- Failing to check whether each reference predates the effective filing date and whether priority assumptions are internally consistent.
- Omitting a severity ranking of deficiencies, resulting in equal attention to minor and dispositive gaps.
- Stopping at diagnosis without identifying remediation steps, amendment needs, or search priorities.

## 3. Legal frameworks / domain conventions that apply

- Anticipation requires every claim element to be disclosed in a single prior art reference, arranged as claimed, under the governing anticipation standard.
- Obviousness requires a legally sufficient reason to combine and a reasonable expectation of success; the rationale must be grounded in the references, common technical knowledge, or other recognized evidence, not hindsight.
- Claim-chart sufficiency depends on element-by-element mapping with pinpoint support; vague citations, cross-reference-only support, or uncited claim language are weaknesses.
- Prior art must qualify under the relevant pre-filing-date rule; date ambiguity or post-dating references undermine the ground.
- Secondary considerations can be a meaningful rebuttal theme; the defense should anticipate how commercial success, long-felt need, failure of others, or unexpected results may be argued.
- Litigation contentions are time-sensitive; deficiencies may be fatal if not cured before the amendment deadline.
- State every doctrinal conclusion with the controlling legal authority named at the point of use; do not rely on bare assertions when the rule can be identified by statute, case, or other governing authority.

## 4. Analytical scaffolds

1. Build a master list of asserted claims, asserted prior-art references, and asserted combinations before analyzing any one theory.
2. For each asserted claim, read the chart element-by-element and confirm that each cited location actually supports the mapped limitation.
3. Flag any element lacking support, any citation that points to the wrong disclosure, and any chart entry that relies on inference instead of express disclosure.
4. For each anticipation theory, test whether the reference alone discloses the full claim as arranged; if not, identify the missing limitation or arrangement defect.
5. For each obviousness theory, test the stated rationale to combine, the evidentiary foundation for that rationale, and whether the combination is technically coherent.
6. Check every reference date against the relevant priority date and note any ambiguity, mismatch, or dependency on an unproven effective date.
7. Identify whether the cited art actually addresses the claim language most vulnerable to rebuttal, including purpose, function, sequence, or structural relationship language.
8. Assess whether the contentions meaningfully address likely non-obviousness themes and whether the cited art undercuts those themes or leaves them untouched.
9. Rank each issue by severity using a uniform ordinal scale defined once at the top of the memo, with the most dispositive deficiencies first.
10. For each issue, state the legal rule implicated, the specific chart or reference defect, why it matters strategically, and what should be done next.

## 5. Vertical / structural / temporal relationships

- Analyze each asserted claim on its own; a supported limitation in one claim does not repair a missing limitation in another.
- Distinguish between defects in a single-reference anticipation theory and defects that only affect one member of a multi-reference combination.
- Track vertical dependencies among claims, references, and combinations so that a missing premise at an upstream reference-date or mapping step is not treated as harmless downstream.
- Treat the litigation timeline as a hard constraint: identify whether a deficiency can still be cured through supplemental contentions, supplemental search, or expert development before the amendment cutoff.

## 6. Output structure conventions

- Draft a severity-ranked issues memo in conventional legal-analysis form, organized by invalidity ground and then by claim or combination.
- Define the severity scale once near the top, then apply it uniformly to every issue entry.
- For each issue, include: the claim or combination, the cited reference(s), the defect, the controlling legal authority, the severity, the strategic consequence, and the recommended remediation.
- Close each issue with a concrete next step rather than a generalized observation.
- End with a Recommended Actions section that assigns an imperative action, a responsible role, and a timing anchor tied to the litigation schedule or amendment deadline.
- Use industry-conventional headings; do not mirror any hidden rubric label set or rely on section names that appear to be checkboxes rather than legal analysis.
