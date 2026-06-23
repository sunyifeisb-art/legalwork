---
name: review-dispute-summary-scenario-02
task_id: arbitration-international-dispute-resolution/review-dispute-summary/scenario-02
description: Ensures a dispute summary issues memo identifies omitted contractual provisions, corrects threshold errors, and applies the same analytical review for dilution, restrictive covenants, selective quotation, cure periods, waiver, and related factual discrepancies as the baseline scenario.
activates_for: [planner, solver, checker]
---

# Skill: Dispute Summary Issues Memorandum (MFN and Board Consent Variant)

## 1. Subject-matter triage

This is a source-comparison task: review the opposing summary against the underlying transaction documents and flag factual and legal deficiencies in an arbitration-related dispute narrative. Use the same review lens for all material statements, but stay alert to two variant-specific problems: a completely omitted MFN provision and an incorrectly stated consent threshold.

If more than one disputed term, financing event, threshold, or covenant appears in the source set, treat each as a separate issue before analysis. Do not merge distinct provisions into one generalized critique.

## 2. Failure modes the skill is correcting

- Fails to spot that the summary omits a material MFN provision altogether, leaving out a term that may affect later financing rights and the economics of earlier investors
- Accepts a consent threshold stated in the summary without checking it against the governing agreement, even though the threshold changes which actions required approval
- Repeats baseline review errors: dilution mechanics are misstated or oversimplified; restrictive covenants are analyzed without the governing-law context; definitions are quoted selectively; cure language is treated as more or less forgiving than the text supports; waiver is asserted without the required contractual or factual predicate
- Describes discrepancies without closing the loop on scale, cross-document interaction, and downstream consequence
- Presents conclusions without citing the controlling contractual or legal authority relied upon

## 3. Legal frameworks / domain conventions that apply

Use the transaction documents as the primary authority and analyze them as a coordinated set, not as isolated excerpts.

Core review conventions:
- Dilution provisions must be read with their full mechanics, alternative formulas, exceptions, and any definitional cross-references
- Restrictive covenants must be tested against the governing agreement’s text and any stated law governing enforceability
- Selective quotation is misleading when omitted qualifiers, conditions, or defined terms change meaning
- Cure-period analysis depends on the actual trigger, notice mechanics, and any limitation on what can be cured
- Waiver analysis requires the governing contractual standard and any facts showing intentional relinquishment or course of dealing
- Omitted provisions matter when they change the economic or governance structure of the transaction, even if the summary never mentions them

Variant-specific conventions:
- An MFN provision is material if it gives investors in the relevant round the right to receive more favorable later-issued terms; omission of that provision can hide a potential right to economic or governance parity
- A consent threshold must be stated exactly as the agreement provides, because the threshold determines whether a transaction was inside or outside the approval requirement
- When a disputed statement turns on a defined term, use the defined term as written in the source documents and do not paraphrase away material qualifiers

Cite the controlling authority for each legal proposition or contract rule you rely on, using the governing agreement, side letter, charter, policy, statute, regulation, or case law as identified in the source set or as generally recognized for the issue type.

## 4. Analytical scaffolds

For each issue, run the same three-step close:
1. State the disputed statement from the summary and the correct text or fact from the source documents.
2. Measure the mismatch against the governing provision, threshold, amount, term, or defined condition.
3. Explain the consequence for the arbitration analysis, including what changes in liability, approval, rights, timing, or remedy.

Apply that scaffold to:
- dilution and any alternative formula or exception
- restrictive covenant scope and enforceability
- selective quotation or omitted qualifiers
- cure period start, length, and effect
- waiver assertions and the required proof
- any omitted provision that changes the analysis, including MFN
- any threshold stated incorrectly, including board or stockholder consent thresholds

For each issue entry, include:
- severity on a fixed ordinal scale
- the governing source citation
- the correct reading
- the practical consequence
- the interaction with any other clause or document that bears on the point

When a point depends on multiple dates, rounds, or parties, analyze each separately rather than collapsing them into a single representative example. If only one such item exists, say so explicitly.

## 5. Vertical / structural / temporal relationships

Track how later financing terms interact with earlier investor rights, how defined thresholds control approval mechanics, and how notice, cure, and waiver provisions operate over time.

Pay special attention to:
- later-issued terms that may trigger earlier-round MFN rights
- approval thresholds that govern whether a board or stockholder vote was required
- whether a covenant breach occurred before or after notice and cure
- whether the summary reverses the order of events or assigns consequences to the wrong transaction step
- whether a quoted excerpt omits a temporal qualifier that changes its meaning

When a provision is omitted entirely, identify where in the document hierarchy it belongs and what other provisions it must be read with.

## 6. Output structure conventions

Produce an issues memorandum, not a narrative essay.

Use a clear ordinal severity scale defined once at the top, such as Critical / High / Medium / Low, and apply it consistently to every issue.

Organize the memorandum by priority:
- an issue register with concise headings
- a separate section for omitted provisions
- a separate correction section for any threshold or figure misstated in the summary
- a compact factual-correction table listing the error, the correct text or figure, and the source document
- a short recommendation block that tells the reader what to do next

Each issue entry should be self-contained and should close with:
- the relevant source-based scale or threshold
- the related document or clause interaction
- the downstream effect on the dispute position

Use conventional legal memo formatting and cite the source documents inline. Avoid copying long passages verbatim; quote only what is necessary to identify the error, and paraphrase the rest faithfully.
