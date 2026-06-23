---
name: review-counterpartys-proposed-jury-instructions
task_id: litigation-dispute-resolution/review-counterpartys-proposed-jury-instructions
description: Reviewing a counterparty's proposed jury instructions in a trade secrets trial requires identifying instructions that misstate the applicable legal standard, conflict with prior court orders, or unfairly shift the burden of proof, and recommending specific objections and counter-instructions.
activates_for: [planner, solver, checker]
---

# Skill: Review Counterparty's Proposed Jury Instructions — Issue Memorandum for Trade Secrets Trial

## 1. Subject-matter triage

- Determine the governing instruction set before analysis: the court’s standing orders, pretrial rulings, dispositive orders, sanctions orders, the operative complaint and defenses, the parties’ proposed instruction submissions, and any jurisdictional pattern instructions.
- Identify whether the court has already resolved any element, defense, evidentiary issue, or sanctions consequence that the jury instructions must reflect.
- Treat the defense proposal as a comparison exercise against the operative record, not as a standalone draft to be commented on in the abstract.

## 2. Failure modes the skill is correcting

- Reviewing instructions without first reading the operative pretrial and dispositive orders, which may resolve legal issues that must be reflected in the instructions; any instruction that relitigates a decided issue or conflicts with a prior ruling is objectionable.
- Flagging instructions as incorrect without specifying the correct legal standard and supporting authority, which leaves the reviewing attorney without the basis to draft a counter-instruction.
- Overlooking burden-shifting dimensions of trade secret and employment agreement claims, where the defense may propose instructions that improperly shift burdens or omit the plaintiff's burden allocation.
- Missing the implications of sanctions or other case-management orders on the instructions, including circumstances in which the court may require an adverse-inference or similar corrective instruction.
- Collapsing multiple instructions, claims, defenses, or theories into a single comment instead of analyzing each instruction separately.
- Identifying an error without tying it to its practical effect on the verdict form, proof structure, or remedy presentation.

## 3. Legal frameworks / domain conventions that apply

- Jury instructions must accurately state the law applicable to each claim and defense; a party may object to any instruction that misstates the law and propose a correct alternative. Cite the governing statute, rule, or leading case for each proposition.
- Pattern jury instructions for the relevant jurisdiction are the baseline for trade secret claims; departures from the pattern should be justified by case-specific facts or binding authority.
- Trade secret instruction elements typically include: the existence of a trade secret, reasonable measures to protect it, independent economic value from secrecy, and misappropriation; instructions that omit elements or water down definitions are objectionable. Cite the applicable trade secret statute and any controlling local authority.
- Sanctions orders may require adverse-inference instructions or other corrective language if the court found willful spoliation or similar misconduct; review any such order to determine whether the defense's proposed instructions omit required language. Cite the governing evidence rule or spoliation authority.
- Prior dispositive rulings may resolve certain issues of fact and law; instructions that attempt to reopen resolved issues or submit already-decided questions to the jury are improper. Cite the specific order or ruling that controls.
- Employment agreement claims commonly require the jury to find the agreement's elements, breach, and causation; instructions that overstate enforceability requirements or understate the burden of proof are objectionable. Cite the governing contract doctrine or statute.
- If the source set contains multiple overlapping authorities, identify which one governs the instruction dispute and which merely informs it.

## 4. Analytical scaffolds

- Read the operative pretrial and dispositive orders first to establish what has already been decided; these create the boundaries of what the jury may decide and what instructions are required.
- Enumerate the instruction set before analysis: list each proposed instruction number, then analyze each one separately.
- For each proposed instruction, test in sequence:
  - whether it accurately states the applicable legal standard,
  - whether it conflicts with a prior court ruling,
  - whether it correctly allocates the burden of proof,
  - whether it is appropriately tailored to the facts of the case,
  - whether it matches the governing pattern instruction or needs a justified deviation,
  - whether it affects related verdict form language, damages framing, or adverse-inference treatment.
- When an instruction is objectionable, pair the objection with the correct standard and a proposed substitute phrasing that is legally safer and fact-specific.
- For every identified issue, include: the scale or significance of the issue as reflected in the source documents, the cross-reference to the controlling order, claim element, or related instruction, and the downstream consequence if the instruction is given as proposed.
- If the source set addresses only one claim or one disputed instruction theme, say so expressly before analyzing; do not assume additional issues.
- Do not rely on generic criticism. Anchor each issue to a concrete defect in wording, structure, burden allocation, or inconsistency with the record.
- If the record supports it, distinguish between instructions that should be objected to, instructions that require modification, and instructions that should be added to cure an omission.

## 5. Vertical / structural / temporal relationships

- Map each instruction against the case sequence: what was decided at the pleading stage, what was narrowed at summary judgment or in limine rulings, what was addressed in sanctions, and what remains for the jury.
- Track dependencies between instructions: definitions feed liability instructions, liability feeds damages instructions, and sanctions findings may alter the permissible credibility or spoliation instruction.
- Check whether one instruction silently rewrites another by narrowing a definition, shifting a burden, or importing a defense into a liability charge.
- Where timing matters, confirm that any instruction tied to conduct, notice, preservation, or misappropriation reflects the correct temporal point in the record.

## 6. Output structure conventions

- Use an issue-memo format with a short governing-law summary, followed by an issue-by-issue table or numbered list.
- Define an ordinal severity scale once at the top, then assign a severity to every issue entry consistently.
- For each issue entry, include:
  - Instruction number or title
  - Severity
  - Issue description
  - Controlling authority
  - Prior order or source-document conflict, if any
  - Recommended counter-instruction or objection language
  - Practical consequence if left uncorrected
- Keep the memo organized by objection type where helpful: misstatement of legal standard, conflict with prior ruling, burden misallocation, omitted required instruction, and proposed counter-instruction.
- End with a concise Recommended Actions block that gives the next drafting or filing steps, names the responsible role, and ties each action to the relevant court deadline or upcoming instruction conference if one exists.
- Follow the requested delivery format exactly; do not include unsupported filler or a generic case recap.
