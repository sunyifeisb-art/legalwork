---
name: identify-issues-counterparty-jury-instructions
task_id: intellectual-property/identify-issues-in-counterpartys-proposed-jury-instructions
description: Reviewing opposing party's proposed jury instructions against applicable court orders, model instructions, and prosecution history to prepare formal objections.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Counterparty's Proposed Jury Instructions

## 1. Subject-matter triage

- Confirm the controlling packet: court orders on claim construction and trial procedure, the forum’s model patent instructions, the opposing party’s proposed instructions, and any prosecution-history materials relevant to disputed claim scope.
- Identify whether the instructions are for liability only, damages, or both; apply the relevant review path to each instruction topic rather than treating the set as a single document.
- Verify whether the joint pretrial order or stipulations already resolve any instruction issue; do not object to a point the parties have already fixed unless the proposed language departs from that resolution.

## 2. Failure modes the skill is correcting

- Reviewing proposed jury instructions without anchoring them to the court’s adopted claim constructions, leading to missed objections where the proposal silently redefines a term.
- Treating model patent instructions as optional background rather than the baseline, which misses unjustified departures and subtle legal omissions.
- Missing prosecution-history arguments that narrow claim scope, support estoppel, or undermine an equivocal infringement theory.
- Failing to separate a true legal error from a style preference, which weakens the memo and obscures the strongest objections.
- Grouping multiple instruction problems into a single paragraph, which hides the exact source of error, the controlling authority, and the requested correction.
- Discussing infringement, invalidity, willfulness, and damages as if they share one standard; each topic has distinct elements and burdens.

## 3. Legal frameworks / domain conventions that apply

- Jury instructions in patent cases must conform to the court’s claim-construction order; an instruction that states or implies a different construction of a disputed term is objectionable on that ground.
- The court’s adopted claim construction is the highest-authority instruction source for term meaning; model instructions are the default baseline unless the forum or case-specific order requires a deviation.
- Literal infringement must be stated as a claim-by-claim comparison to every limitation of the asserted claim; an instruction that omits a limitation, shifts the comparison, or allows infringement by general impression is legally flawed.
- If the doctrine of equivalents is included, the instruction must state the correct function-way-result or insubstantial-differences framework as recognized in the governing authority, and it must respect prosecution-history estoppel.
- Anticipation requires disclosure of every claim element in a single prior-art reference under the governing law; obviousness requires the full legal test, including the Graham factors and any properly supported objective-indicia evidence.
- Willfulness and enhanced damages require the governing culpability standard under the controlling Supreme Court and Federal Circuit authorities; a negligence-like or mere notice standard is insufficient.
- Damages instructions must track the accepted framework for the theory used, including apportionment principles and any special requirements for royalty-base selection.
- Burden of proof must be stated accurately for each issue: infringement and damages on a preponderance standard, invalidity on clear and convincing evidence, and any other issue according to the controlling authority.
- Where prosecution history is used to limit scope, the instruction must not permit the jury to ignore those disclaimers, amendments, or arguments.
- Every legal proposition in the memo should be tied to a named authority: claim-construction order, model instruction, rule, statute, or controlling case.

## 4. Analytical scaffolds

1. Build an instruction-by-instruction inventory and group the proposals by topic: claim-construction, infringement, invalidity, willfulness, damages, and any special defenses or remedies.
2. For each instruction, compare the proposed text to the relevant model instruction and identify every deviation that affects meaning, burden, element, or burden allocation.
3. For each instruction touching a disputed term, compare the text against the claim-construction order and flag any inconsistency, embellishment, omission, or implied construction.
4. For each infringement instruction, check whether the proposal states the claim-comparison test, preserves all limitations, and handles equivalents and estoppel correctly.
5. For each invalidity instruction, test whether the legal standard is complete and whether the burden of proof is stated correctly for the asserted ground.
6. For each damages instruction, test whether the theory-specific framework is complete, legally current, and not expanded beyond the evidence or case posture.
7. For any instruction that draws from prosecution history, identify the limiting statement or amendment, then evaluate whether the proposed language respects that limit.
8. Frame each objection as: what the proposal says, why it is wrong, which authority controls, and what corrected language should replace it.

## 5. Vertical / structural / temporal relationships

- The claim-construction order controls over model instructions, which in turn control over party-drafted embellishments.
- A narrower prosecution-history disclaimer can further limit a term even where the model instruction is broader; treat the prosecution record as a vertical constraint on the final wording.
- If the proposed instruction conflicts with an agreed pretrial stipulation, the stipulation should be addressed before any broader doctrinal objection.
- Where one instruction references another, review them together so that an error in one does not get masked by a later definition or cross-reference.
- If the same legal concept appears in multiple instructions, check for internal consistency across the set and flag any conflicting formulations.

## 6. Output structure conventions

- Write a formal objections memo organized by instruction topic and then by individual instruction number or title.
- Define a simple ordinal severity scale once at the top and apply it uniformly to each objection entry.
- For each objection, include:
  - the instruction identifier and the challenged language or a close pinpoint paraphrase,
  - the severity rating,
  - the specific legal ground for objection,
  - the controlling authority supporting the objection,
  - the model-instruction or claim-construction comparison point,
  - the prosecution-history point if relevant,
  - the proposed corrected instruction language.
- Keep objections discrete; if one instruction contains several distinct defects, list each defect separately rather than compressing them into one paragraph.
- End with a concise Recommended Actions block that directs counsel to revise, strike, or replace the challenged language and to confirm consistency across the full set before filing.
- Use industry-conventional memo form; do not mirror any hidden checklist or internal rubric structure.
