---
name: extract-key-terms-technical-patent-specs
task_id: intellectual-property/extract-key-terms-from-technical-patent-specifications
description: Preparing a claim construction chart for a patent specification and related technical materials, requiring intrinsic record analysis, identification of functional claiming issues, and linkage between construction choices and infringement analysis.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Technical Patent Specifications

## 1. Subject-matter triage

- Identify the asserted claims, the disputed terms, and the source set before drafting.
- Separate intrinsic record materials from extrinsic technical materials; use the latter to test, not replace, claim meaning.
- If multiple claims or terms are in play, enumerate the full set first and analyze each term on its own record.
- Prioritize terms that drive infringement, validity, or dispositive claim-scope disputes; do not spend equal time on neutral or purely cosmetic terms.

## 2. Failure modes the skill is correcting

- Reading claim language in isolation and missing how the specification, prosecution history, and claim context control meaning.
- Treating accused-product documents as if they define claim scope rather than as a comparison tool.
- Missing disclaimer, lexicography, or prosecution-driven narrowing that changes the ordinary meaning analysis.
- Overlooking functional-claiming exposure when a term is framed by what it does rather than what it is.
- Failing to connect a proposed construction to a concrete infringement consequence for the accused product.
- Collapsing distinct disputed terms into one generic analysis instead of analyzing each term separately.
- Stating a construction without citing the legal source that supports it.

## 3. Legal frameworks / domain conventions that apply

- Claim construction follows the ordinary-meaning framework from the perspective of a person of ordinary skill in the art, with the intrinsic record as the primary guide.
- The specification is central to construction; definitional language, repeated usage, preferred embodiments, and express exclusions matter.
- Prosecution history can narrow scope through amendment or argument-based estoppel and should be read chronologically.
- Clear disclaimer in the specification can limit otherwise broad claim language.
- Functional-claiming analysis applies when a claim term recites function without sufficient structure; assess whether the governing patent statute and the specification require corresponding structure.
- Nonce or generic placeholder terms deserve scrutiny when they are used as stand-ins for structure.
- Construction should be tied to the infringement record: the same term may map differently depending on the accused product’s technical features.
- Every legal proposition in the chart should be supported by a named authority from the source materials or a recognized patent-construction authority.

## 4. Analytical scaffolds

1. List the disputed terms in a numbered sequence and keep the numbering stable across the chart.
2. For each term, identify the claims where it appears and whether the claim is independent or dependent.
3. For each term, extract any express definitional language, limiting language, or disavowal from the specification.
4. For each term, review prosecution history for amendments, distinguishing remarks, and argument-based narrowing.
5. For each term, test whether the term is functional, nonce-like, or otherwise structure-light, and note any corresponding structure or algorithm disclosed in the specification.
6. For each term, compare the accused product materials to the proposed construction and state whether the accused feature appears to fall inside or outside the scope.
7. For each term, state the recommended construction in a form usable by a court or chart reader, not as a narrative gloss.
8. If competing constructions exist, present them side by side and explain why one is stronger under the intrinsic record.
9. Close each term analysis by tying the construction choice to the infringement theory or non-infringement defense it supports.

## 5. Vertical / structural / temporal relationships

- Read the patent record hierarchically: claim text first, then specification, then prosecution history, with technical comparison used to test the result.
- Treat dependent claims as context for how the patent uses a term, but do not rewrite the independent claim unless the record requires it.
- Read prosecution history in sequence, because later amendments and arguments may narrow or clarify earlier positions.
- Treat accused-product materials as time- and implementation-specific evidence of how the contested technology operates, not as a source of claim meaning.
- Where multiple documents describe the same feature differently, reconcile them by function, structure, and chronology rather than by isolated wording.

## 6. Output structure conventions

- Produce a claim-construction chart organized by strategic priority: the terms most likely to affect scope and infringement first.
- For each entry, include the term, the claims in which it appears, the competing constructions if any, the intrinsic-record support, the prosecution-history effect, the functional-claiming assessment where relevant, the recommended construction, and the infringement significance.
- Use court-usable, concise language for constructions; avoid explanatory prose where a chart row can carry the point.
- Include a separate technical comparison section that maps accused-product features to the disputed terms and flags the practical consequence of each construction choice.
- Use legal authority labels consistently and cite the controlling patent-construction rule or doctrine alongside each doctrinal point.
- If the record does not support a confident construction, say so expressly and identify what is missing rather than forcing a guess.
