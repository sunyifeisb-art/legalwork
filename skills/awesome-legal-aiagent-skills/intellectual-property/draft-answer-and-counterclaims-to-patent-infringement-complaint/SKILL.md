---
name: draft-answer-counterclaims-patent
task_id: intellectual-property/draft-answer-and-counterclaims-to-patent-infringement-complaint
description: Complete responsive pleading for a patent infringement defendant, comprising answer, affirmative defenses, and counterclaims, grounded in technical facts, prior art analysis, and the pleadings record.
activates_for: [planner, solver, checker]
---

# Skill: Draft Answer and Counterclaims to Patent Infringement Complaint

## 1. Subject-matter triage (only if applicable)

- Confirm the pleaded case is a patent infringement action and identify the asserted patents, accused products, challenged claims, venue, and any jurisdictional or ownership allegations that affect the responsive pleading.
- Separate allegations that can be admitted from technical allegations that should be denied or denied on information and belief after reasonable inquiry.
- Identify whether the record supports affirmative counterclaims, including declaratory judgment claims, or whether the pleading should stay within defenses only.
- If multiple patents, products, or claim sets are implicated, treat each as a distinct pleading target and do not assume a single response fits all.

## 2. Failure modes the skill is correcting

- Admitting complaint allegations that should be denied, especially technical assertions about product operation, claim scope, infringement, inducement, or notice.
- Using blanket denials without paragraph-by-paragraph precision or failing to state lack of sufficient information where appropriate.
- Pleading affirmative defenses as labels without a factual bridge to the pleadings record, technical materials, licensing history, or prosecution history.
- Treating invalidity as a generic defense without tying it to claim-specific prior art theories or a declaratory counterclaim.
- Omitting non-infringement or invalidity counterclaims where the record supports independent adjudication and jurisdiction.
- Failing to preserve defenses rooted in license, exhaustion, estoppel, unenforceability, or claim construction positions when the facts support them.
- Drafting the pleading in a way that is not internally consistent with the complaint, the accused technology, or the prior art analysis.

## 3. Legal frameworks / domain conventions that apply

- Federal Rule of Civil Procedure 8(b) governs responses to allegations; each allegation should be admitted, denied, or denied for lack of knowledge after reasonable inquiry.
- Federal Rule of Civil Procedure 8(c) governs affirmative defenses; defenses should be stated clearly enough to give fair notice.
- Federal Rule of Civil Procedure 11 requires a factual and legal basis for denials, defenses, and counterclaims after reasonable inquiry.
- Declaratory judgment counterclaims are commonly pleaded under 28 U.S.C. §§ 2201–2202 when there is an actual controversy over infringement or validity.
- Patent invalidity theories generally arise under 35 U.S.C. §§ 102, 103, 112, and related doctrines such as lack of written description, indefiniteness, and lack of enablement.
- Patent unenforceability may arise from inequitable conduct, which is governed by the pleading and intent requirements recognized in Federal Circuit precedent.
- Infringement defenses often include non-infringement, claim construction limits, exhaustion, license, waiver, laches, estoppel, and failure to mark or provide proper notice where relevant.
- Counterclaims should track the live controversy and seek declaratory relief that is independent, justiciable, and supported by the pleadings record.
- Prior art analysis should be claim-by-claim and element-by-element, with anticipation and obviousness treated as distinct theories under 35 U.S.C. §§ 102 and 103.
- Licensing history, settlement communications, or course of dealing may support license, exhaustion, waiver, or estoppel, but only if the factual record supports pleading them.
- Follow the governing pleading standard in the forum for patent invalidity and inequitable conduct allegations, including any heightened particularity requirement when fraud-based theories are asserted.

## 4. Analytical scaffolds

- Complaint-by-complaint response:
  - Read every numbered paragraph.
  - Classify each allegation as admit, deny, or deny for lack of knowledge after reasonable inquiry.
  - Keep admissions narrow and avoid volunteering facts that expand liability.
  - If the complaint alleges technical operation, knowledge, intent, market impact, or claim interpretation, verify before admitting.
- Defense inventory:
  - Build defenses from four source streams: technical non-infringement, invalidity, unenforceability, and transactional history.
  - Convert each supported theory into a concise, legally recognized affirmative defense rather than a narrative summary.
  - Do not plead defenses that lack a factual anchor in the record.
- Prior art mapping:
  - For each relevant reference or combination, map claim elements to the record and separate anticipation from obviousness.
  - Identify whether a reference supports all elements as arranged or whether a combination is needed.
  - Tie each theory to the asserted claims and to the declaratory invalidity counterclaim.
- Counterclaim drafting:
  - Plead declaratory judgment of non-infringement where the controversy is live and the defendant needs an adjudication that the accused product does not infringe.
  - Plead declaratory judgment of invalidity where prior art or statutory defects support it, using the specific invalidity theories supported by the record.
  - Add any additional counterclaim only if the facts and governing law independently support it.
- Jurisdiction and justiciability check:
  - State the basis for subject matter jurisdiction and the case-or-controversy supporting counterclaims.
  - Ensure the counterclaims are not redundant, inconsistent, or jurisdictionally fragile.
- Drafting discipline:
  - Use short, direct allegations.
  - Avoid conclusory embellishment.
  - Maintain consistency between the answer, defenses, and counterclaims.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If the complaint pleads multiple patents, each patent may require separate non-infringement and invalidity treatment.
- If the accused products or versions changed over time, distinguish pre- and post-change conduct and do not collapse them into one factual position.
- If the record contains a licensing or settlement timeline, align defenses such as license, exhaustion, waiver, estoppel, or laches to the relevant dates and transactions.
- If prior art or prosecution history arose at different times, preserve the chronology so the pleading does not conflate anticipation, obviousness, and inequitable conduct.
- If different corporate entities, business units, or product lines are involved, verify which entity is the proper party for each allegation and counterclaim.

## 6. Output structure conventions

- Draft in conventional responsive pleading form:
  - caption and case information
  - introduction or general response, if used in the forum
  - paragraph-by-paragraph responses to the complaint
  - affirmative defenses, separately labeled and numbered
  - counterclaims, with factual allegations and counts stated separately
  - demand for jury trial if supported and strategically appropriate
  - prayer for relief
  - signature block and service language as required by the filing context
- Keep responses to complaint paragraphs aligned with the complaint’s numbering and terminology.
- State affirmative defenses as recognized defenses, not as argument sections.
- In counterclaims, plead the jurisdictional basis, the existence of an actual controversy, the defendant’s non-infringement and/or invalidity theories, and the requested declarations.
- Use patent-pleading language that is precise but not overinclusive; do not overstate invalidity beyond the theories actually supported.
- When facts support it, incorporate a tailored preservation clause for all defenses not waived by the pleading.
- Ensure the final document is a complete operative pleading, not a summary, checklist, or memo.
