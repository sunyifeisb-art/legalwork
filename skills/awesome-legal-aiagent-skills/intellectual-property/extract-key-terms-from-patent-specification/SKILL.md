---
name: extract-key-terms-patent-specification
task_id: intellectual-property/extract-key-terms-from-patent-specification
description: Preparing a claim construction chart from a patent specification and prosecution history, using intrinsic-record hierarchy analysis and connecting each construction to downstream infringement and validity analysis.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Patent Specification for Claim Construction

## 1. Subject-matter triage (only if applicable)

- Confirm the claim terms at issue, the patent family materials available, and whether the task involves one patent, multiple related patents, or multiple asserted claims with overlapping language.
- Enumerate the terms to be construed before analysis begins, and separate truly disputed terms from background terms that do not warrant full treatment.
- For each term, identify the claims where it appears, whether the term is repeated across claims, and whether any term is central to infringement, validity, or Markman strategy.
- If the record includes prosecution history, identify the key prosecution events that may narrow scope before drafting any construction.

## 2. Failure modes the skill is correcting

- Producing a claim construction chart without first isolating the highest-priority disputed terms and their strategic importance
- Failing to connect each proposed construction to its downstream effect on infringement, validity, or both
- Missing discrepancies between claim language and specification language that affect scope
- Treating embodiments as automatically limiting or, conversely, ignoring definitional language, disavowal, or express restriction
- Overstating extrinsic materials when the intrinsic record controls
- Failing to identify functional claiming issues or means-plus-function risk
- Giving a construction without addressing the likely adverse construction
- Forgetting that a construction applied to an independent claim term ordinarily carries into dependent claims using the same term

## 3. Legal frameworks / domain conventions that apply

- Ordinary-meaning analysis: construe terms as a person of ordinary skill in the art would understand them in light of the intrinsic record, with the specification as the primary guide to meaning
- Intrinsic-record hierarchy: claim language first, then specification, then prosecution history; extrinsic evidence is secondary and cannot override the intrinsic record
- Specification lexicography: if the patentee clearly sets a special definition, use that definition rather than the ordinary meaning
- Specification disavowal: clear and unmistakable disclaimer in the specification can narrow otherwise broader claim language
- Claim-specification mismatch: broad claim language may still be narrowed by repeated definitional language, consistent description, or unmistakable limitation in the specification
- Means-plus-function analysis: assess whether functional language invokes statutory treatment and, if so, identify corresponding structure disclosed in the specification and equivalents under the governing patent statute
- Prosecution-history estoppel: identify narrowing amendments and argument-based surrender under the applicable prosecution-history doctrine
- Extrinsic evidence: technical dictionaries, expert declarations, and treatises are helpful only as secondary aids and should be weighed against the intrinsic record
- Claim differentiation: dependent claim language can inform scope, but it does not overcome clear intrinsic evidence narrowing the broader term
- Adverse-construction analysis: every high-priority term should be tested against the strongest opposing construction before finalizing the recommendation

## 4. Analytical scaffolds

1. Begin with a concise executive summary identifying the highest-priority disputed terms and why they matter to the hearing strategy.
2. Enumerate the terms to be construed in priority order, then analyze each term on the same framework so the chart is internally consistent.
3. For each term, identify the precise claim language, the claim(s) in which it appears, and whether it is independent or dependent claim language.
4. For each term, analyze the intrinsic record in hierarchy order: claim text, then specification, then prosecution history.
5. For each term, look for express definitions, repeated descriptive language, limiting examples, disclaimer language, and any mismatch between the claim wording and the written description.
6. For each term, flag functional wording and assess whether means-plus-function treatment may apply; if it does, identify the corresponding disclosed structure and any relevant equivalents.
7. For each term, identify narrowing amendments, examiner-cited issues, applicant arguments, and any statements that may later limit scope.
8. For each term, state the recommended construction in litigation-ready language and tie that construction to its effect on infringement and/or validity.
9. For each high-priority term, state the anticipated adverse construction and explain why the preferred construction better fits the intrinsic record.
10. Note any extrinsic materials relied on by either side, but only after the intrinsic analysis is complete and only to the extent they help illuminate, not expand, the meaning.
11. If multiple claims use the same disputed term, analyze the term once and then note how the construction carries across those claims unless the record requires a different result.
12. If a term’s construction depends on another term, cross-reference the dependency explicitly so the chart reads as a coherent interpretive map.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Independent claim constructions ordinarily control the same term in dependent claims absent a claim-specific modifier or intrinsic-record reason to diverge.
- Prosecution history affecting a shared term can affect all claims containing that term, subject to the governing doctrine and any claim-specific distinctions.
- Where one term defines the scope of another term, treat the relationship as hierarchical and avoid inconsistent standalone constructions.
- If the materials include multiple prosecution phases or related continuations, assess whether later statements confirm, narrow, or materially differ from earlier ones.

## 6. Output structure conventions

- Open with a short executive summary that identifies the most important disputed terms and the strategic reason they matter.
- Then provide a claim construction chart ordered from highest to lower priority.
- Use industry-conventional columns such as: term; claim(s); disputed constructions; intrinsic-record analysis; prosecution-history analysis; functional-language/means-plus-function flag; recommended construction; and downstream impact.
- Include a short note when the term is governed by a clear intrinsic definition, disclaimer, or prosecution-based narrowing.
- Include a cross-term dependency section for terms whose meanings are linked or whose constructions should move together.
- Keep the constructions concise, litigation-ready, and anchored to the record rather than generalized paraphrase.
- If a term appears in more than one claim, make clear whether the same construction applies across those claims.
- If the task asks for a document file, ensure the operative chart content is prepared for that deliverable rather than merely describing what should be drafted.
