---
name: identify-weaknesses-counterparty-sjm-brief
task_id: intellectual-property/identify-weaknesses-in-counterpartys-summary-judgment-brief
description: Reviewing an opposing party's summary judgment motion in a patent dispute to identify legal and factual weaknesses for the opposition brief.
activates_for: [planner, solver, checker]
---

# Skill: Identify Weaknesses in Counterparty's Summary Judgment Brief

## 1. Subject-matter triage

When source documents include a summary judgment motion, prosecution history, patent claims, an expert report, a claim construction order, and assignment records, first sort issues by what they actually turn on: claim scope, record evidence, or ownership/standing. Use the court’s adopted claim construction as the baseline for all scope-dependent analysis. Treat prosecution history and assignment records as distinct inputs; do not merge them into a single validity narrative.

If multiple patents, products, or theories are in play, enumerate them before analyzing weaknesses so each theory is tested on its own record. If only one is genuinely in scope, say so affirmatively and explain why.

## 2. Failure modes the skill is correcting

- Reviewing the motion without tying each factual assertion to the cited record evidence
- Letting the movant smuggle in claim-scope assumptions that differ from the adopted construction
- Missing genuine disputes of material fact that defeat summary judgment under the governing standard
- Overlooking ownership, standing, or chain-of-title defects that undermine the movant’s position
- Discounting expert testimony without checking whether the movant has a proper procedural basis to do so
- Failing to surface rebuttal themes that are supported by the record but not foregrounded by the motion
- Writing issue notes that describe a problem but do not state why it matters to the summary judgment outcome

## 3. Legal frameworks / domain conventions that apply

- Summary judgment standard: Fed. R. Civ. P. 56; the movant must show no genuine dispute of material fact and entitlement to judgment as a matter of law
- Evidentiary support: factual assertions must be anchored in the cited record; unsupported characterizations are attackable
- Claim construction: infringement and invalidity arguments must be measured against the court’s adopted constructions, not against a party’s preferred gloss
- Non-infringement: the movant must show, element by element, that the accused product or process cannot satisfy the claim under the governing construction
- Invalidity: the movant must establish the asserted theory on an undisputed record; disputes about what a reference teaches, what a skilled artisan would understand, or what combinations are permissible can create triable issues
- Standing and ownership: chain-of-title arguments depend on the governing assignment and transfer documents, together with any retained-rights language
- Expert testimony: evaluate whether the movant is attacking admissibility, methodology, or weight; distinguish those paths from mere disagreement with the opinion
- Prosecution history: compare any prosecution-history-based argument against the same technical record to expose selective reading or overreach

## 4. Analytical scaffolds

1. Map each factual assertion in the motion to the cited record material; flag unsupported statements, overstatements, selective quotations, and mischaracterizations.
2. For every argument that depends on claim scope, test it against the adopted construction; flag any assumption that adds, narrows, or redefines a term without support.
3. For each non-infringement theory, break the analysis into claim elements and ask whether the record contains evidence creating a genuine dispute on any element.
4. For each invalidity theory, isolate the reference, combination, or doctrine invoked and assess whether the cited record leaves room for competing factual or expert interpretations.
5. For ownership or standing issues, trace the chain of title through the transfer documents and identify any gap, reservation, inconsistency, or unresolved factual question.
6. For expert evidence, assess whether the motion actually defeats the opinion or merely disagrees with it; identify admissibility defects separately from triable factual disputes.
7. Surface rebuttal themes that the nonmovant can use in opposition, including record-supported alternative inferences, credibility disputes, and any secondary considerations or contextual facts that cut against the motion.
8. Rank each weakness by how strongly it undermines summary judgment, and separate dispositive weaknesses from merely helpful ones.
9. For each issue, connect the weakness to the controlling rule or doctrine, the interacting record source, and the practical consequence for the opposition posture.

## 5. Vertical / structural / temporal relationships

Track how the motion’s arguments depend on one another. A claim-scope error may infect multiple infringement and invalidity points; an ownership defect may undercut standing across the entire case; an expert weakness may matter only if the motion relies on that expert for a material element. Note when one document supersedes, clarifies, or conflicts with another, and identify whether the relevant event is pre-suit, during prosecution, during claim construction, or after the asserted transfer. Use that sequence to explain why a weakness is isolated or systemic.

## 6. Output structure conventions

- Produce a memorandum organized by weakness category, using conventional headings such as claim-construction inconsistencies, factual disputes, evidentiary gaps, ownership/standing issues, expert-testimony issues, and rebuttal themes.
- For each entry, state the motion section or page reference, summarize the movant’s point, identify the defect, cite the supporting record material, and explain the recommended opposition angle.
- Include an explicit ordinal severity field for every entry, using one defined scale applied consistently across the memorandum.
- When an issue spans several theories or documents, separate the sub-issues rather than collapsing them into one general critique.
- Keep each issue note analytical rather than conclusory: identify the legal rule, the conflicting record source, and why the conflict matters under Rule 56 or the applicable patent doctrine.
- End with a concise overall vulnerability assessment and an explicit Recommended Actions block that assigns the next step to the relevant role and ties it to the briefing or motion deadline, or to the nearest litigation milestone if no deadline is stated.
- Do not rely on a bare description of weakness; every entry should identify the operative authority, the key record conflict, and the downstream consequence for the opposition strategy.
