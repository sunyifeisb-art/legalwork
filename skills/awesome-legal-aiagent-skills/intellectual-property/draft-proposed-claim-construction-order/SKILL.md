---
name: draft-proposed-claim-construction-order
task_id: intellectual-property/draft-proposed-claim-construction-order
description: Proposed Markman order for disputed patent claim terms based on the claim construction briefs, hearing transcript, patent claims, and chambers instructions.
activates_for: [planner, solver, checker]
---

# Skill: Draft Proposed Claim Construction Order (Markman Order)

## 1. Subject-matter triage
- Treat the chambers instructions as controlling on format, depth, citation style, and whether the court wants a short order or a more detailed opinion.
- Identify the patent family, asserted claims, and every disputed term in the source set before drafting.
- If the record includes multiple candidate constructions, carry each one through term-by-term analysis rather than collapsing them into a generic summary.
- If the hearing transcript signals a judicial preference, address it directly in the rationale for that term.

## 2. Failure modes the skill is correcting
- Drafting as partisan advocacy instead of a court-ready proposed order that accurately presents the record for each disputed term.
- Ignoring chambers instructions on layout, tone, or citation conventions.
- Treating the claim construction briefs as complete while omitting the hearing transcript, which may contain the court’s most recent guidance.
- Failing to connect constructions to the case posture, including infringement and invalidity consequences.
- Using conclusory claim-construction statements without tying them to the governing authority and intrinsic evidence.
- Reusing the parties’ preferred phrasing without testing it against claim language, specification, and prosecution history.
- Overlooking dependent-claim context, definitional statements, or disclaimers that bear on the disputed term.

## 3. Legal frameworks / domain conventions that apply
- Apply the governing claim-construction framework: claims are read in light of the intrinsic record, including claim language, specification, and prosecution history.
- Use ordinary and customary meaning from the perspective of a person of ordinary skill in the art unless the patentee acted as its own lexicographer or clearly disclaimed scope.
- Treat the specification as the primary guide for meaning, but avoid importing limitations from embodiments unless the intrinsic record compels it.
- Consider prosecution history, including amendments and argument-based disclaimers, when it sheds light on what the applicant surrendered.
- If the source materials cite a controlling Federal Circuit or Supreme Court claim-construction case, use that authority and section/citation as stated; do not state a legal conclusion without naming the rule or doctrine supporting it.
- Preserve neutral judicial tone: describe the parties’ positions accurately, then explain why the court should adopt the proposed construction.

## 4. Analytical scaffolds
- Chambers-instruction compliance first: confirm the requested structure, level of detail, and citation form before drafting.
- Build a term-by-term table or section sequence that repeats a consistent method for each disputed term:
  1. identify the term;
  2. state each party’s proposed construction;
  3. summarize the controlling intrinsic evidence;
  4. note any relevant hearing remarks;
  5. explain the recommended construction and why.
- For each term, test whether the dispute is about plain meaning, lexicography, disclaimer, scope limitation, or functional language; frame the analysis accordingly.
- If a term appears in related claims or dependent claims, compare claim usage across the claim set to confirm scope.
- Use the hearing transcript to refine or qualify the reasoning where the court asked about a specific phrase, embodiment, or exclusion.
- Keep the proposed order ready for judicial adoption: concise findings, clear conclusions, and citations that support each construction.

## 5. Vertical / structural / temporal relationships
- Read disputed terms vertically within the claim set: claim language in one claim may inform the meaning of the same phrase elsewhere, and dependent claims may narrow an independent claim’s scope.
- Read horizontally across the specification: definitions, repeated terminology, and disclosed alternatives may resolve ambiguity.
- Read temporally across the prosecution history: pre-amendment arguments, amendments, and allowance remarks may confirm or narrow meaning.
- If the hearing transcript post-dates the briefs, treat it as the most current indicator of the court’s concerns and integrate it into the final draft.
- When a construction affects noninfringement or invalidity positions, note the downstream litigation consequence in a restrained, court-facing way.

## 6. Output structure conventions
- Draft as a proposed court order in conventional form: caption, introduction, governing standard, term-by-term construction sections, and conclusion.
- Match the chambers-required format exactly where specified; if the judge prefers a shorter order, do not expand it into a full opinion.
- For each disputed term, include the term, the competing constructions, the court’s analysis, and the adopted construction.
- Use specification citations with column and line numbers when available; otherwise use the source set’s citation convention consistently.
- Keep language neutral and judicial, not argumentative or sales-oriented.
- Ensure the final document reads as an operative proposed order, not a memorandum about what the order should say.
