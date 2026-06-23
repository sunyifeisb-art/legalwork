---
name: draft-motion-to-dismiss-antitrust-claims
task_id: antitrust-competition/draft-motion-to-dismiss-antitrust-claims
description: Draft a Rule 12(b)(6) motion to dismiss antitrust claims by testing plausibility, pleading sufficiency, market definition, agreement allegations, and source discipline at the motion-to-dismiss stage.
activates_for: [planner, solver, checker]
---

# Skill: Motion to Dismiss Antitrust Claims

## 1. Subject-matter triage

- This is a pleading-stage antitrust defense task, not a merits brief.
- Keep the motion anchored to the complaint, incorporated exhibits, and judicially noticeable facts.
- Treat each count separately, but check whether the same pleading defect defeats multiple claims.
- If the complaint pleads multiple actors, markets, time periods, or restraint theories, identify them explicitly before analyzing each one.

## 2. Failure modes the skill is correcting

- The motion accepts the complaint’s market labels at face value instead of testing whether the alleged product and geographic market are plausibly supported.
- The motion recites antitrust elements without tying them to nonconclusory facts in the pleading.
- The motion treats parallel conduct, shared incentives, or ordinary business responses as if they were an agreement.
- The motion skips the threshold market-definition defect on the Section 2 theory and argues monopoly power too early.
- The motion does not separate unilateral conduct from concerted conduct.
- The motion relies on extra-record materials or argumentative factual assertions that cannot be used on Rule 12(b)(6).
- The motion fails to address exclusive dealing theory with the relevant foreclosure, duration, and entry-barrier considerations.
- The motion states conclusions without citing the governing pleading rule or antitrust authority supporting the proposition.

## 3. Legal frameworks / domain conventions that apply

- Rule 12(b)(6): accept well-pleaded factual allegations as true, disregard legal conclusions, and dismiss when the complaint does not state a plausible claim for relief under the governing plausibility standard.
- Antitrust pleading: a complaint must allege enough factual matter to make the existence of each element plausible, not merely possible.
- Sherman Act § 1: plead an agreement, an unreasonable restraint of trade, and a cognizable effect on commerce; plead concerted action with facts that do more than suggest parallel conduct.
- Sherman Act § 2: plead monopoly power in a relevant market plus acquisition or maintenance of that power through exclusionary conduct.
- Relevant market: test whether the alleged product and geographic market are plausible under the hypothetical monopolist framework and ordinary antitrust market-definition principles.
- Exclusive dealing: assess whether the pleadings support a substantial foreclosure theory in light of duration, coverage, practical foreclosure, and barriers to entry or expansion.
- Independent action: if the facts are equally consistent with lawful independent conduct, the complaint does not plausibly plead concerted action.
- Source discipline: stay within the complaint, materials incorporated by reference, and matters subject to judicial notice; do not import extra-record facts to cure pleading defects.

## 4. Analytical scaffolds

1. Open with a short introduction that identifies the motion, the challenged counts, and the central pleading defects.
2. Include a table of contents for the memorandum.
3. State the Rule 12(b)(6) standard with the governing plausibility authority and explain how that standard operates in antitrust cases.
4. For the Section 1 count, identify the alleged agreement, then test whether the pleaded facts plausibly support concerted action rather than parallel conduct or independent business judgment.
5. If the Section 1 theory includes exclusive dealing or other vertical restraint allegations, analyze the factual allegations bearing on duration, foreclosure, switching costs, and entry barriers.
6. For the Section 2 count, first test whether the complaint plausibly pleads a relevant market; only then address monopoly power and exclusionary conduct.
7. Where the complaint uses broad or self-serving market labels, explain why those labels are unsupported by cross-elasticity, substitutability, or geographic facts pleaded in the complaint.
8. Where the theory depends on third-party decisions, independent contracting, or routine commercial responses, explain why that weakens plausibility of the alleged restraint.
9. Use the complaint’s own allegations against it where they show lawful competition, unilateral decision-making, or alternative explanations as well as the alleged antitrust theory.
10. Conclude with dismissal of all challenged counts and address leave to amend only to the extent the pleading posture and governing law warrant.

## 5. Vertical / structural / temporal relationships

- Track who allegedly did what, to whom, and when; antitrust plausibility often turns on the sequence of negotiations, refusals, contracting, and alleged exclusion.
- Distinguish horizontal coordination from vertical contracting and unilateral business conduct.
- If the complaint spans multiple facilities, lines of business, or market segments, analyze whether the allegations actually connect them to the same restraint or market definition.
- If the alleged restraint changes over time, separate the time periods rather than treating them as one continuous theory.
- Where the complaint alleges foreclosure, analyze the restraint’s temporal length and practical reach against the market structure described in the pleading.
- If multiple defendants are alleged, specify whether the same conduct is pleaded against each or whether the allegations are individualized.

## 6. Output structure conventions

- Use a conventional memorandum format with:
  - caption/title if provided by the task context
  - table of contents
  - introduction
  - standard of review
  - argument by count
  - conclusion
- Organize the argument by legal theory, not by narrative summary.
- Use headings that make the Rule 12(b)(6) defect obvious from the structure.
- Cite controlling authority by name and section, rule, or case when stating legal propositions.
- Keep the tone litigation-ready and cite-focused, not explanatory or academic.
- Do not rely on unsupported factual embellishment; every factual assertion should trace to the permissible record.
- End with a clear request for dismissal of the challenged counts and any alternative relief that is appropriate on the pleadings.
