---
name: extract-key-findings-from-european-competition-authority-decision
task_id: antitrust-competition/extract-key-findings-from-european-competition-authority-decision
description: Closes gaps in per-defendant procedural history analysis, rights of defense violations from supplementary objection omissions, fine calculation verification, and appeal ground identification with legal authority.
activates_for: [planner, solver, checker]
---

# Skill: European Competition Decision Extraction and Appeal Analysis

## 1. Subject-matter triage

- Treat the decision, objection notice, any supplementary notice, hearing record, and annexed financial or economic material as one integrated record.
- Identify each defendant or addressee separately before comparing them; do not assume shared timing, participation, or defenses.
- If the record names more than one party, build a party-by-party extraction first, then a comparison layer only where the documents support it.
- Separate final-decision findings from notice-stage allegations and from evidence submitted in response; appeal issues often turn on what was, and was not, foreshadowed.

## 2. Failure modes the skill is correcting

- Collapsing all parties into one procedural timeline, which hides defendant-specific notice, hearing, or submission rights.
- Missing rights-of-defense arguments where the authority relied on materially new elements, new theory fragments, or materially harsher treatment without giving the party a fair chance to respond.
- Accepting the authority’s fine narrative without verifying each component and its internal consistency against the stated methodology.
- Treating reason-giving failures as generic dissatisfaction instead of tying them to a concrete omission, ignored submission, or unexplained rejection.
- Overstating appeal grounds without anchoring them to the governing procedural rule, standard of proof, or review principle.
- Ignoring ability-to-pay or equality arguments where the record shows divergent treatment or updated financial material.
- Compressing multiple issues into one summary paragraph instead of mapping them to the specific defendant and procedural event they affect.

## 3. Legal frameworks / domain conventions that apply

- European competition enforcement is typically framed by the notice-and-response sequence: statement of objections, any supplementary notice, written reply, oral hearing, and final decision.
- Rights of defense require that the addressee have a meaningful opportunity to respond to the case actually relied on in the final decision; materially new factual or legal bases ordinarily require prior disclosure.
- The duty to state reasons requires the authority to explain its reasoning with enough clarity to permit understanding and review; unaddressed evidence, expert material, or central arguments can support a challenge under that duty.
- Fine review should follow the authority’s own stated methodology and the governing competition rules; every uplift, reduction, and correction should be tied to the stated basis in the decision.
- Aggravating or mitigating circumstances should be tested against the standard of proof the reviewing court expects in competition matters.
- Equal treatment claims depend on identifying similarly situated parties and then testing whether differential treatment was justified by differences in conduct, role, duration, cooperation, or procedural posture.
- Ability-to-pay arguments depend on the record at the relevant time; stale or incomplete financial evidence can matter if the authority ignored later submissions.
- Appeal timing must be calculated from the notification date using the applicable EU court deadline rules and any procedural extensions that clearly apply.
- Cite the controlling rule, regulation, treaty provision, or case authority whenever stating a legal proposition; do not leave a proposition uncited.

## 4. Analytical scaffolds

1. **Enumerate the parties and documents**
   - List each defendant or addressee separately.
   - List each operative document separately: original notice, supplementary notice if any, hearing opportunity, final decision, and key submitted materials.

2. **Extract per-party factual findings**
   - For each party, record infringement start and end dates, role characterization, geographic scope, and any express findings affecting seriousness or duration.
   - Note whether the party received any supplementary notice, replied, attended a hearing, or submitted post-notice materials.
   - Keep each finding tied to the specific document in which it appears.

3. **Verify the fine methodology component by component**
   - For each party, extract the base amount, gravity assessment, duration treatment, deterrence element, aggravating or mitigating adjustments, cooperation effects, and any ability-to-pay or proportionality correction.
   - Reconcile the stated methodology against the final figure and flag any unexplained step, duplicated step, or mismatch between narrative and outcome.
   - If the decision contains multiple alternative formulations or scenarios, compare them side by side rather than averaging them.

4. **Test the procedural fairness story**
   - Ask whether the final decision relies on any materially new element not present in the original notice.
   - Ask whether any such element was covered by a supplementary notice or other timely disclosure.
   - Ask whether the party had a real opportunity to respond before the decision was adopted.
   - Ask whether the authority answered the party’s main points or instead used a conclusory rejection.

5. **Build appeal grounds as discrete, authority-based entries**
   - Rights of defense: new factual or legal basis in the final decision without adequate prior notice.
   - Duty to state reasons: failure to engage with evidence, submissions, or central objections.
   - Standard of proof: unsupported aggravating findings or unsupported causal links.
   - Equal treatment: different treatment of comparable parties without a reasoned distinction.
   - Ability to pay: failure to engage with current financial evidence or the request’s rationale.
   - Any additional ground should be included only if the source record and controlling authority support it.

6. **Rank the grounds**
   - Assess each ground by apparent strength, record support, and likely receptiveness on review.
   - Distinguish a strong procedural point from a weaker merits disagreement.
   - Prefer grounds that are document-backed and party-specific over generalized fairness complaints.

7. **Compute the deadline**
   - Identify the notification date, then calculate the appeal deadline using the applicable EU procedural rule and any clear extension rule.
   - State the calculation method used, not just the endpoint.

## 5. Vertical / structural / temporal relationships

- Map the timeline vertically: original notice → response → supplementary notice, if any → hearing → final decision → notification → appeal deadline.
- Keep party-specific procedural histories separate where they diverge, even if the final infringement narrative is shared.
- When comparing parties, note whether differences arise from role, duration, geography, cooperation, or notice-stage participation.
- If the decision uses a hierarchy of concepts, preserve that hierarchy: infringement findings first, methodology second, procedural rights third, then appeal grounds.
- Link each appeal ground to the exact stage where the problem arose; a defect at notice stage is not the same as a defect in the reasoning of the final decision.

## 6. Output structure conventions

- Start with a concise case overview naming the decision, parties, notification date, and computed appeal deadline.
- Then give a party-by-party extraction section with short subheads for procedural history, factual findings, and fine treatment.
- Then provide a fine-methodology verification section that tracks each component in the order used by the decision.
- Then provide an appeal-grounds section with one entry per ground, and for each entry include:
  - the legal basis with a controlling authority citation,
  - the supporting record points,
  - the practical consequence for appeal strategy.
- Include a comparison layer only where it illuminates different treatment or divergent procedure among parties.
- End with a recommended actions block that uses imperative verbs, identifies the responsible role, and anchors timing to the appeal deadline or another source-based milestone.
- Keep the memorandum written for counsel: concise, document-driven, and ready to be converted into `extraction-memorandum.docx`.
