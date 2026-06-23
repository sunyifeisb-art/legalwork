---
name: analyze-arbitration-award-for-new-york-convention-enforcement-defenses
task_id: arbitration-international-dispute-resolution/analyze-arbitration-award-for-new-york-convention-enforcement-defenses
description: Ensures analysis of an arbitral award for enforcement resistance covers the relevant Convention defenses, verifies the award's arithmetic independently, and addresses the applicable enforcement procedure in the forum.
activates_for: [planner, solver, checker]
---

# Skill: New York Convention Enforcement Defense Analysis

## 1. Subject-matter triage

- Treat the award, underlying arbitration agreement, procedural orders, and any seat or enforcement-court materials as a single source set.
- Determine at the outset whether the dispute concerns one award or multiple awards, and whether any separate dispositive component, costs award, or fee award must be analyzed independently.
- Identify the enforcement forum first, because the available defenses, venue, motion vehicle, and timing rules depend on the forum’s implementing legislation and procedure.
- If the source set contains a dissent, treat it as a strategic input only after identifying the governing Convention defenses and the procedural posture at the seat.

## 2. Failure modes the skill is correcting

- Accepts the award’s stated monetary figures without recomputing them from the award’s own components, so arithmetic errors or internal inconsistencies are missed.
- Analyzes Convention defenses in the abstract without first identifying the law governing the arbitration agreement’s validity.
- Collapses the enforcement analysis into merits dissatisfaction, despite the Convention’s bar on merits review.
- Omits the enforcement forum’s implementing statute, venue, and procedural vehicle for resisting recognition or enforcement.
- Treats a dissent as either irrelevant or dispositive rather than assessing whether it corroborates a specific defense.
- Fails to separate the award’s principal relief from any fee or cost award and to test authorization for each.
- Ignores the possibility of a stay pending annulment or set-aside proceedings at the seat, or fails to account for delay and procedural history.

## 3. Legal frameworks / domain conventions that apply

- New York Convention article V defenses: incapacity or invalidity of the arbitration agreement; lack of proper notice or inability to present the case; excess of scope; irregular composition or procedure; award not yet binding, set aside, or suspended at the seat; non-arbitrability; and public policy.
- Enforcement courts generally do not conduct révision au fond; error correction is not a Convention defense unless it fits within a recognized ground under the Convention or the forum’s implementing law.
- The law governing the arbitration agreement must be identified separately from the substantive law of the main contract; validity is assessed under the law governing the arbitration agreement or the applicable conflict rule used by the forum.
- Fee and cost awards require a distinct authorization analysis under the applicable institutional rules, the arbitration agreement, and any relevant statutory or procedural constraints.
- A stay pending annulment or set-aside proceedings is a discretionary enforcement question that turns on the seat proceedings, the stage of those proceedings, prejudice, and the forum’s stay standards.
- The forum’s implementing legislation and civil procedure rules control the method for recognition, enforcement resistance, and any request for stay, vacatur, or adjournment.
- A dissenting opinion is not itself a defense, but it may corroborate a notice, procedure, authority, or excess-of-power argument if it ties to a recognized legal ground.
- Every legal proposition should be tied to controlling authority: the Convention article, the forum statute, the applicable arbitration statute, the institutional rule, or the leading case that governs the point in the relevant forum.

## 4. Analytical scaffolds

- Recompute every amount in the award independently from the underlying components stated in the award or attached calculations.
- Separate principal, interest, fees, costs, and any post-award accruals into distinct buckets before drawing any enforcement conclusion.
- For each asserted defense, test:
  - the applicable Convention article or local analogue;
  - the governing facts in the record;
  - the evidentiary support needed;
  - the strength of the defense as a practical enforcement objection;
  - the downstream consequence for enforcement, settlement leverage, or stay strategy.
- For validity objections, identify:
  - whether the arbitration clause has an express governing law;
  - if not, which law governs the clause’s validity under the forum’s conflict approach;
  - whether that law supports or undermines consent to arbitrate.
- For scope and procedure objections, compare the award with the submission, pleadings, procedural orders, and any limitations in the arbitration agreement.
- For notice and due-process objections, isolate the factual timing, service method, hearing opportunity, and prejudice shown in the record.
- For public policy objections, distinguish true enforcement-policy conflicts from disguised merits complaints.
- For any fee or cost component, test whether the tribunal had authority under the institutional rules and the arbitration agreement to shift those amounts.
- For any dissent, ask whether it maps onto a specific Convention defense, whether it addresses a procedural irregularity, and whether it strengthens or merely echoes the losing party’s grievance.
- For any stay request, analyze whether the seat proceeding is pending, whether the award has been challenged, and whether timing or delay weakens the request.

## 5. Vertical / structural / temporal relationships

- Track the relationship between the arbitration agreement, the main contract, and any later amendments or side letters that may affect consent, scope, or governing law.
- Track the relationship between the seat proceedings and the enforcement forum proceedings, including whether the award has been annulled, suspended, or merely challenged.
- Track the relationship between the tribunal’s dispositive findings and the enforcement court’s limited role; do not convert disagreement with findings into a merits attack.
- Track the relationship between principal relief and ancillary relief, especially where a fee award or cost order depends on separate authority.
- Track the relationship between any procedural irregularity and actual prejudice; a defect without prejudice is usually weak, while a defect tied to exclusion from the process is stronger.
- If there are multiple awards or multiple respondent entities, analyze each separately unless the record affirmatively shows they are legally inseparable.

## 6. Output structure conventions

- Write a strategic enforcement memorandum in conventional legal-memo form, not as a checklist.
- Open with an executive recommendation that states the enforcement posture and overall resistance risk.
- Include a figure-by-figure analysis that shows the independently recomputed amounts, identifies discrepancies, and states the amount that would be sought or resisted.
- Follow with a defense-by-defense section that addresses each potentially available Convention ground, using a consistent severity or strength characterization across the analysis.
- For each defense, identify the controlling authority, the key facts, and the evidentiary basis needed to advance or defeat it.
- Include a separate enforcement-procedure section covering the forum’s implementing statute, venue, and procedural vehicle.
- Include a strategic considerations section addressing dissenting opinions, fee authorization, and stay prospects.
- End with a recommended actions section that uses imperative verbs, identifies the responsible actor from the record where possible, and ties each step to a timing anchor or procedural milestone.
- Keep the memo focused on enforcement resistance; do not draft a merits appeal or relitigate the arbitration outcome.
