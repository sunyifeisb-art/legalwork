---
name: draft-claim-construction-brief
task_id: intellectual-property/draft-claim-construction-brief
description: Opening claim construction brief for a patent infringement action, arguing the client's proposed constructions for disputed patent terms based on the intrinsic evidence hierarchy and rebutting the opposing party's expert declaration. Focus on the patent record, the governing claim-construction framework, and any court-specific filing requirements without hard-coding scenario-specific details.
activates_for: [planner, solver, checker]
---

# Skill: Draft Claim Construction Brief

## 1. Subject-matter triage (only if applicable)

- Treat this as a court-facing patent-claim briefing task centered on disputed claim terms, not a general patent summary.
- Before drafting, enumerate the disputed terms, the asserted claims they affect, and any terms that are expressly absent from the specification or prosecution record.
- Check the forum’s local patent rules first so the brief matches required sequencing, charting, page limits, citation style, exhibit handling, and filing mechanics.
- Draft the primary brief as the operative deliverable first; only then assemble any supporting chart, appendix, or filing cover material the court requires.

## 2. Failure modes the skill is correcting

- Arguing constructions without pinning them to the claim language, specification, and prosecution history in that order.
- Treating expert declarations as if they can displace the patent record rather than only illuminate it.
- Failing to confront terms that are not used in the specification and therefore need an ordinary-meaning analysis grounded in the relevant art.
- Omitting prosecution-history context where it narrows, confirms, or disclaims a proposed meaning.
- Presenting constructions term-by-term without stating the governing legal standard that ties each argument to controlling authority.
- Ignoring local patent-rule requirements on claim charts, appendices, page limits, exhibit references, or citation format.
- Writing a brief that summarizes the dispute instead of advancing a court-ready construction position with pinpoint support.

## 3. Legal frameworks / domain conventions that apply

- Claim construction is a question of law for the court; write for judicial resolution, not for a factfinder.
- Use the intrinsic-evidence hierarchy: claim language first, specification second, prosecution history third, and extrinsic evidence only as subordinate confirmation.
- Read claim terms in context of the entire patent, giving effect to the specification’s definitions, repeated usage, and any express disavowal or disclaimer.
- If a term does not appear in the specification, say so expressly and analyze ordinary meaning in the relevant technical field, using expert testimony, dictionaries, and industry usage only to confirm—not replace—the intrinsic record.
- If the record contains lexicography, disclaimer, or prosecution-history estoppel, treat those as controlling constraints on the ordinary meaning analysis.
- Expert declarations are evidence of technical understanding, not an independent source of claim meaning; use them to test consistency with the record and to expose unsupported glosses.
- Cite the governing claim-construction authorities by name when stating legal propositions, including the controlling federal precedent and any applicable local patent rules.
- For any proposition about prosecution history, identify the specific office action, amendment, response, or interview statement that supports the point.

## 4. Analytical scaffolds

- Start with a concise introduction identifying the asserted patent, the disputed terms, and the client’s overall construction theme.
- State the legal standard in a way that explains the hierarchy of sources and the limited role of extrinsic evidence.
- For each disputed term, use the same internal sequence:
  - the proposed construction;
  - the claim-language context;
  - the specification support with pinpoint citations;
  - the prosecution-history support or limits, if any;
  - the rebuttal to the opposing expert declaration;
  - the resulting construction the court should adopt.
- Where the intrinsic record uses the term consistently, emphasize that consistency; where it uses different terminology, explain the distinction rather than collapsing it.
- Where a term is functional, relational, or outcome-oriented, separate what the claim actually recites from what the opposing side tries to import.
- Where the opposition proposes a limitation untethered to the written description, identify the missing anchor in the record and explain why the proposed gloss should be rejected.
- If multiple disputed terms share the same definitional theme, draft each subsection separately but reuse the controlling record only where the record truly overlaps.
- Use prior art only as a secondary check on how a skilled artisan would understand the term, unless the intrinsic record itself makes prior art relevant to the dispute.
- Keep the argument oriented around what the patent actually says, not around generalized technology background.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Trace how the disputed term operates across the asserted claims, dependent claims, and any related claim sets so the court can see whether a proposed meaning would render surrounding language redundant or inconsistent.
- If the patent family contains continuations, amendments, or related prosecution events, use them to show chronological evolution only when they illuminate the meaning of the disputed wording.
- If a term’s meaning changes across different claim contexts, distinguish those contexts expressly rather than assuming one construction must fit all appearances.
- Where the prosecution history shows a narrowing move, connect the timing of that change to the claim language it affects.
- If the term is used in a system, method, or apparatus claim with different grammatical roles, explain any structural or temporal differences that matter to construction.

## 6. Output structure conventions

- Draft in court-standard brief form with a conventional sequence: introduction, background, legal standard, argument by term, and conclusion.
- Use one subsection per disputed term, with the construction stated before the evidence discussion.
- Keep all patent citations pinpointed to the governing record format used in the filing venue.
- Integrate rebuttal of the opposing expert declaration inside each term subsection rather than as a detached afterthought.
- Include any claim-construction chart, appendix, or exhibit list required by the local rules in the form the court expects.
- Make the filing self-sufficient: a judge should be able to see the construction sought, the controlling authority, and the record basis without cross-referencing a separate summary.
- Before finalizing, confirm that the brief and every required attachment are complete, internally consistent, and ready for filing under the applicable local rules.
