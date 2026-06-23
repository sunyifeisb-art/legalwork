---
name: compare-claim-constructions-patent-spec
task_id: intellectual-property/compare-proposed-claim-constructions-against-patent-specification
description: Claim construction analysis memorandum evaluating proposed constructions for disputed patent terms against the patent specification, prosecution history, and opposing brief, prepared from the client's perspective.
activates_for: [planner, solver, checker]
---

# Skill: Compare Proposed Claim Constructions Against Patent Specification

## 1. Subject-matter triage

- Treat this as a term-by-term claim-construction comparison memo, not a generic patent summary.
- Identify every disputed term surfaced in the claim materials and opposing brief before analyzing any single term.
- If the materials implicate more than one claim, limitation, embodiment, or prosecution event, separate them by term and by claim context so scope arguments do not bleed across limitations.
- If a term appears only once in the intrinsic record, say so; if it appears in multiple claims or related passages, analyze each usage before choosing a recommended construction.

## 2. Failure modes the skill is correcting

- Reading the opposing proposal in isolation instead of anchoring the analysis in the claim language and intrinsic record.
- Treating the patent specification as background only, rather than the primary guide to meaning.
- Accepting an expert declaration as though it were controlling, instead of using it only to the extent it aligns with intrinsic evidence.
- Overlooking prosecution statements that narrow, clarify, or disclaim scope.
- Missing claim-differentiation arguments where one proposed construction would collapse distinctions among claims.
- Failing to test whether the competing construction would make words redundant, superfluous, or inconsistent across related claims.
- Using conclusory assertion instead of showing how the intrinsic record supports the client’s construction and defeats the opponent’s.

## 3. Legal frameworks / domain conventions that apply

- Apply the governing claim-construction framework for the forum: start with the claim text, then read the surrounding claims, then the specification, then the prosecution history, and only then consider extrinsic materials such as expert testimony or dictionaries.
- Give the specification primary interpretive weight; use quoted or paraphrased passages from the intrinsic record to show how the term is used in context.
- Use claim differentiation as a default inference, while checking whether the specification or prosecution history rebuts that inference.
- Treat prosecution history as intrinsic evidence that can limit scope when the patentee distinguished prior art, amended claims, or otherwise surrendered meaning.
- Treat expert declarations, treatises, and dictionaries as confirmatory, not controlling, where they conflict with intrinsic sources.
- When the term is a familiar art term, explain ordinary meaning in context, but test that meaning against the patent’s own definitional or exemplary usage.
- Cite the controlling authority for each legal proposition you rely on, including the claim-construction framework, the role of intrinsic evidence, claim differentiation, prosecution disclaimer, and the limited role of extrinsic evidence.

## 4. Analytical scaffolds

- Begin with a disputed-term inventory. Number each term and preserve the order in which it appears in the claim-construction materials.
- For each term, run the same sequence:
  - State the client’s proposed construction and the opposing proposed construction.
  - Identify the controlling claim language and the exact claim context in which the term appears.
  - Compare the term against related claim language to test consistency and differentiation.
  - Walk the specification for passages that define, exemplify, or limit the term.
  - Review prosecution history for amendments, arguments, or disclaimers that bear on scope.
  - Address the opposing expert’s position only after the intrinsic record has been analyzed.
  - Conclude with the construction the court should adopt and the shortest reason that supports it.
- If a term is not expressly defined in the specification, note that fact and explain whether ordinary meaning, contextual usage, or intrinsic inferential limits control.
- If the record contains competing embodiments or examples, explain whether the term should be read broadly enough to cover each embodiment or narrowly enough to preserve the patent’s stated distinction.
- If a proposed construction would introduce surplusage, contradictions, or internal inconsistency, say where that occurs and why it matters.
- For every issue, close the analysis by tying the construction dispute to the concrete source text, the cross-referenced claim or prosecution material, and the practical effect on infringement, validity, or claim scope.

## 5. Vertical / structural / temporal relationships

- Track relationships among independent claims, dependent claims, and alternative claim groups; use those relationships to test whether one proposed construction improperly imports a limitation or erases a narrowing clause.
- Track relationships among specification passages, embodiments, and definitional statements; do not elevate a preferred embodiment unless the record compels it.
- Track relationships across prosecution events over time; later amendments or arguments may confirm earlier meaning or narrow previously broader language.
- When one term is reused across claims, assume consistent meaning unless the record shows a reason to depart.
- When two terms are paired in the claim language, analyze whether the opponent’s construction breaks that pairing or makes one term do no work.

## 6. Output structure conventions

- Write a legal memorandum with a concise standard-of-construction section, a term-by-term analysis section, and a short conclusion.
- Organize the body by disputed term, not by source document.
- For each term, include:
  - disputed term
  - client position
  - opponent position
  - intrinsic record analysis
  - prosecution history analysis
  - treatment of any expert declaration
  - recommended construction
- Use brief citations to the patent record and governing authority in-line where each point is made.
- Keep the tone client-forward but analytically disciplined; advocate for the client’s construction without overstating what the intrinsic record supports.
- If a term requires reliance on ordinary meaning, say so expressly and explain why the intrinsic record does not supply a narrower or broader meaning.
- End with a short recommendation section that identifies the constructions most defensible on the present record and any terms that warrant further factual development.
