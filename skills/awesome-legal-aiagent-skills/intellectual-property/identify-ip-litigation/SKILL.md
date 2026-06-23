---
name: identify-ip-litigation-ipr-defense
task_id: intellectual-property/identify-ip-litigation
description: Preparing a defensive prior art analysis memo and strategic recommendations for an inter partes review preliminary response, requiring claim chart verification, prior art combination analysis, and prosecution history assessment.
activates_for: [planner, solver, checker]
---

# Skill: Identify IP Litigation Issues in IPR Defense

## 2. Failure modes the skill is correcting

- Treating the petition as a set of isolated references rather than testing each ground as a combined theory with element-by-element support
- Missing gaps in the cited passages, figure citations, or mappings for specific claim limitations
- Accepting conclusory motivations to combine without testing whether the cited art itself supplies the rationale and expectation of success
- Overlooking prosecution history distinctions, claim amendments, and applicant arguments that narrow the claims against the cited art
- Failing to separate strong grounds from weak grounds, which leads to an unfocused preliminary response strategy
- Omitting procedural defenses or institution-stage arguments that may narrow or defeat institution
- Writing a merits analysis without turning it into concrete recommendations for what the patent owner should do next

## 3. Legal frameworks / domain conventions that apply

- Inter partes review is an institution-stage proceeding under 35 U.S.C. §§ 311–319; the relevant question is whether the petition demonstrates a reasonable likelihood of prevailing on at least one challenged claim, not whether invalidity is proved outright
- Apply anticipation under 35 U.S.C. § 102 by testing whether a single reference discloses every claim limitation, expressly or inherently, as arranged in the claim
- Apply obviousness under 35 U.S.C. § 103 by testing whether the petition identifies a legally sufficient reason to combine references and a reasonable expectation of success, not merely a hindsight reconstruction
- Use the controlling claim-construction standard applicable in the proceeding and test whether the petitioner’s construction is broader than the claim language, specification, and prosecution record support
- Treat prosecution history as evidence of how a skilled artisan and the tribunal should read the claims; amendments and arguments can create distinctions that matter at institution
- Evaluate secondary considerations of non-obviousness where the record supports them, including long-felt need, industry praise, commercial success, failure of others, and unexpected results
- Read dependent claims separately; even if the independent claim is mapped, the added limitations may remain unmet or unsupported
- Consider discretionary denial only if the record presents a real procedural basis; analyze parallel litigation, overlap in grounds and claims, and timing rather than assuming denial is available

## 4. Analytical scaffolds

1. Group the petition by ground and claim set, then test each ground on its own terms before comparing grounds
2. For anticipation, verify limitation-by-limitation disclosure in the cited reference; identify missing elements, wrong order, or unsupported inherency
3. For obviousness, test the combination theory in three steps: what each reference actually teaches, what the petition says to combine, and why the combination would have been made with a reasonable expectation of success
4. Review whether the petition relies on generalized statements, litigation-driven rationale, or expert conclusions that are not tethered to the cited art
5. Examine the prosecution history for narrowing amendments, express distinctions, disclaimers, or argument-based estoppel that can be deployed in the preliminary response
6. Identify claim-construction points that affect institution; flag petition constructions that read out claim language, ignore modifiers, or expand the claim beyond the specification
7. Collect any record support for non-obviousness, including objective indicia and evidence tying them to the claimed features
8. Rank grounds by institution risk: strongest, intermediate, and weakest; explain which defects are dispositive versus cumulative
9. Convert the merits analysis into a response strategy: which grounds to contest first, which issues to preserve, and whether oral argument would add value

## 5. Vertical / structural / temporal relationships

- IPR work is time-sensitive; the preliminary response window is short, so prioritize grounds that most directly affect institution and do not spend equal space on every minor discrepancy
- A weakness in one reference may not defeat a ground if the petition’s combination theory plausibly fills the gap; test the entire ground, not just the first cited reference
- Prosecution arguments made earlier in the patent’s life can constrain later claim scope and should be aligned with the petition’s cited disclosures
- Procedural posture matters: parallel litigation, scheduling, and overlap in asserted art can materially affect the institution strategy and should be assessed alongside the merits

## 6. Output structure conventions

- Write the memo as a litigation analysis, not a generic patent summary
- Organize the body by challenged ground, then by challenged claim group, then by limitation-level analysis
- For each ground, include: the petitioner’s theory, the key prior art references, the claim-chart gaps, the combination or inherency weaknesses, prosecution-history distinctions, and any objective indicia or claim-construction points that help the patent owner
- Use a clear ordinal severity convention for issues, applied consistently across the memo:
  - Critical: likely dispositive at institution or central to the best defense
  - High: substantial weakness affecting a major ground or claim group
  - Medium: meaningful but potentially curable or secondary
  - Low: useful context or preservable point
- For each identified issue, state the severity, explain the legal basis, and tie it to the practical institution consequence
- When multiple grounds, claim groups, references, or prosecution events are in play, list them explicitly before analysis and then analyze each in turn; do not collapse distinct items into one generic discussion
- End with a Recommended Actions block that gives concrete next steps for the preliminary response, including the action, the responsible role, and the timing relative to the institution deadline
- Include a concise institution-likelihood assessment and a short section identifying which grounds should be attacked first and which should be preserved for reply or later proceedings
