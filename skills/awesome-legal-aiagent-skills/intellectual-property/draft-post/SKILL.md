---
name: draft-post-trial-brief-patent
task_id: intellectual-property/draft-post
description: Post-trial brief in a patent infringement action, presented as proposed findings of fact and conclusions of law on infringement, validity, and damages, based on the trial record and exhibits.
activates_for: [planner, solver, checker]
---

# Skill: Draft Post-Trial Brief (Proposed Findings of Fact and Conclusions of Law)

## 1. Subject-matter triage

This task is a bench-trial submission in proposed-findings format, not a conventional advocacy brief. Draft it as a court-ready document that lets the judge adopt or edit language directly. Anchor every proposed finding in the record, and separate factual determinations from legal conclusions. If the trial record reflects multiple asserted claims, multiple defenses, or multiple damages theories, treat each as a distinct analytical pass rather than blending them into a general narrative.

Before drafting, confirm the governing order, page limits, filing format, and any chambers preferences reflected in the record or instructions. If the record contains competing versions of claim construction, damages inputs, or invalidity theories, enumerate the live items first and address each one in turn.

## 2. Failure modes the skill is correcting

- Writing a narrative brief instead of proposed findings that the court can adopt with minimal editing
- Stating infringement, validity, or damages conclusions without tying them to specific witness testimony, admitted exhibits, or transcript pages
- Collapsing multiple asserted claims, invalidity grounds, or damages theories into one generalized analysis
- Omitting the governing legal standard for a proposition and assuming the court will supply it
- Mixing facts, argument, and law in a way that obscures what is proposed as a finding and what is proposed as a conclusion
- Failing to align each conclusion of law with the factual findings that support it
- Treating exhibit and transcript citations as optional rather than the mechanism that makes the proposal usable by the court
- Overstating certainty where the record contains competing inferences or partial proof; the draft should resolve the dispute, but only on the basis of the trial record

## 3. Legal frameworks / domain conventions that apply

- Proposed findings of fact and conclusions of law should be drafted in the format required by the court’s scheduling order and local rules, with numbered findings and corresponding legal conclusions
- Infringement findings should track claim elements under the court’s claim construction and should be organized claim by claim, element by element
- Literal infringement and, if actually tried, infringement under the doctrine of equivalents are distinct analyses and should not be conflated
- Validity findings should address each invalidity theory actually litigated, including anticipation, obviousness, written description, enablement, indefiniteness, and any other live defense supported by the record
- Damages findings should establish the damages theory, the evidentiary basis for the royalty or other measure, and the factual predicates necessary for the court’s calculation
- Willfulness, enhanced damages, attorney-fee issues, permanent relief, prejudgment interest, and ongoing royalties should be addressed only if the trial record puts them in issue
- Every legal proposition should be stated with its controlling authority, such as the governing statute, rule, regulation, or leading case, rather than as an unsupported conclusion

## 4. Analytical scaffolds

- Start from the final issue map: identify the asserted claims, defenses, remedies, and any contested periods or categories of conduct reflected in the record
- For each claim or defense, enumerate the elements or sub-elements that must be found, then map the trial evidence to each item
- Draft proposed findings in short, discrete propositions that are each supported by record citations to transcript pages and exhibit numbers
- When multiple factual predicates matter to one legal conclusion, state the predicates separately before the conclusion so the court can adopt them independently
- For damages, separate the liability predicate from the monetary predicate, and separate the theory of damages from the arithmetic the court must adopt from the record
- For validity, address each defense theory on its own terms and explain why the proof does or does not carry the required burden under the governing standard
- For each legal conclusion, identify the rule or doctrine that governs the result and connect it to the findings already proposed
- If a factual issue turns on witness credibility, state the credibility basis from the record rather than leaving the court to infer it
- If the record is sparse on a point, do not fill gaps with generic patent language; draft only what the evidence can support

## 5. Vertical / structural / temporal relationships

Patent trial issues often depend on layered relationships that should be made explicit. A claim element may depend on a construction issue, a product feature may map to multiple claim limitations, and a damages theory may depend on a particular period of infringement or a defined royalty base. Preserve those relationships in the draft.

Where the proof depends on sequence, state the timing relationship expressly: conception, reduction to practice, filing, priority, notice, first infringement, post-notice conduct, and any relevant period for damages or enhanced damages. When one record item controls another, identify that hierarchy rather than narrating the evidence in chronological prose alone.

If the case involves multiple accused products, embodiments, or market periods, treat them separately unless the record and theory truly permit a unified finding. Do not assume a single finding will fit all products or all time periods.

## 6. Output structure conventions

- Write the document as proposed findings of fact and conclusions of law, not as a persuasive memo
- Use numbered findings, with record citations embedded in each proposed finding
- Organize by issue in a court-friendly sequence, typically: introductory matters, claim construction context if needed, infringement, validity, damages, willfulness or enhanced remedies if applicable, and requested relief if applicable
- Keep findings factual and conclusions legal; do not bury factual propositions inside legal argument
- Make each conclusion of law correspond to the findings immediately preceding it or clearly identified elsewhere in the document
- Cite the trial record specifically, including transcript page/line references and exhibit numbers, so each finding is verifiable
- Use ordinary patent-litigation terminology familiar to the court, but avoid unnecessary doctrinal recitations unrelated to the issues actually tried
- Draft the final product as the operative filing for `post-trial-brief.docx`, ensuring the document itself contains the full proposed findings and conclusions rather than a summary or outline
