---
name: draft-daubert-motion-exclude-damages-expert
task_id: intellectual-property/draft-daubert-motion-to-exclude-plaintiffs-damages-expert
description: Daubert motion to exclude or limit opposing damages expert testimony in a patent infringement case, grounded in methodology challenges supported by the rebuttal expert report and case record.
activates_for: [planner, solver, checker]
---

# Skill: Draft Daubert Motion to Exclude Plaintiff's Damages Expert

## 2. Failure modes the skill is correcting

- Attacking the expert’s bottom-line damages number instead of the admissibility of the method, data inputs, and application under Daubert and Federal Rule of Evidence 702
- Making generic reliability complaints without tying each one to a quoted report passage, cited record support, and the specific step where the analysis breaks
- Failing to separate defects in factual foundation, defects in methodology, and defects in application of a methodology
- Ignoring patent-damages doctrine and treating all royalty opinions as if they fail on the same ground
- Overlooking whether the better remedy is exclusion of only a subset of opinions, assumptions, or damages bases rather than wholesale exclusion
- Drafting a motion that reads like a damages rebuttal rather than a gatekeeping brief focused on admissibility

## 3. Legal frameworks / domain conventions that apply

- Federal Rule of Evidence 702 controls expert admissibility: the testimony must help the trier of fact, rest on sufficient facts or data, use reliable principles and methods, and reflect reliable application of those methods
- Daubert and its progeny frame the court’s gatekeeping role as methodology-focused, not persuasion-focused
- Patent damages must comply with the governing reasonable-royalty framework and any applicable apportionment principles
- If the opinion relies on the entire market value rule, the record must support that the patented feature drives demand for the accused product as a whole
- If the opinion relies on comparable licenses, the opinion must explain comparability in technology, economic context, scope, timing, and negotiation posture, and must address any needed adjustments
- If the opinion invokes Georgia-Pacific factors or other accepted royalty tools, the analysis must show a reasoned bridge between those factors and the final opinion
- If the opinion uses profit, cost, or lump-sum constructs as proxies, the motion should test whether the proxy is accepted for the stated purpose and whether the expert actually applied it reliably
- All legal propositions in the motion should be anchored to controlling authority by name, rule, or section, not stated as bare conclusions

## 4. Analytical scaffolds

- Build a report map first: identify every damages theory, every data source, every adjustment, and every assumption the expert says supports the opinion
- For each challenged point, classify the defect as one of the following:
  - insufficient facts or data
  - unreliable principle or method
  - unreliable application of an otherwise accepted method
  - failure to fit the legal damages standard
- Use the rebuttal report as the roadmap for defect selection, but do not merely repeat it; convert each rebuttal criticism into a Daubert ground tied to the record
- Test the royalty base, royalty rate, apportionment step, and comparability analysis separately rather than collapsing them into one critique
- Where multiple products, time periods, license agreements, accused features, or revenue streams are implicated, enumerate them before analysis and address each one separately unless the record clearly shows only one is in scope
- For each major defect, ask whether the motion should seek:
  - full exclusion of the opinion
  - exclusion of a defined subset of opinions or assumptions
  - limitation to a narrower factual premise
- Use record citations throughout: expert report, rebuttal report, deposition excerpts if available, relevant technical or financial documents, and operative case materials
- Structure each argument so it states the challenged proposition, the governing rule, the factual mismatch, and the admissibility consequence

## 5. Vertical / structural / temporal relationships

- Damages opinions often build vertically: accused revenue or royalty base feeds the royalty rate, which feeds the final damages number; if one layer fails, later layers may also fail
- Comparable-license opinions often depend on a chain of assumptions about technical similarity, economic comparability, and negotiated scope; a defect at any link may undercut the opinion’s reliability
- Entire-market and apportionment issues are temporal and transactional as well as structural: the motion should test whether the expert relied on conditions that existed at the right time and in the right bargaining context
- If the record contains more than one accused product line, license, sales period, or damages theory, treat each as a distinct analytic unit and do not assume a single flaw defeats them all
- If the expert offers a fallback or alternative calculation, address its relationship to the primary theory and whether the same admissibility defect carries over

## 6. Output structure conventions

- Draft a motion with an integrated memorandum of law, not a standalone essay: caption, introduction, legal standard, argument, and conclusion
- Lead with the strongest gatekeeping points, then move to narrower limitations on specific opinions or assumptions
- Organize the argument by methodological defect, not by rhetorical theme
- For each section, include:
  - the specific challenged opinion or assumption
  - the controlling legal standard
  - the record support showing why the opinion fails that standard
  - the relief requested for that defect
- If the motion can credibly seek partial relief, include it explicitly as alternative relief rather than burying it
- End with a clear conclusion requesting exclusion, or in the alternative limitation, of identified opinions or bases under Federal Rule of Evidence 702 and Daubert
- Keep the drafting aligned to the requested file output, and ensure the operative motion text is ready to be saved as `daubert-motion.docx`
