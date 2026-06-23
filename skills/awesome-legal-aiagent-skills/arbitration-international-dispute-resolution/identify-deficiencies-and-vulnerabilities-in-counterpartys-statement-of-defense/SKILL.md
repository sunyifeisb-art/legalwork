---
name: identify-deficiencies-in-counterpartys-statement-of-defense
task_id: arbitration-international-dispute-resolution/identify-deficiencies-and-vulnerabilities-in-counterpartys-statement-of-defense
description: Ensures a claimant-side defense analysis flags potential late filing, verifies force majeure notice timeliness, identifies the wrong contractual mechanism, and checks the defense's causation arithmetic for inconsistencies.
activates_for: [planner, solver, checker]
---

# Skill: Claimant-Side Defense Analysis Memorandum

## 2. Failure modes the skill is correcting

- Treats the Statement of Defense as a merits narrative only, without first testing whether it was filed on time under the applicable arbitral rules and any tribunal directions
- Assumes a force majeure defense is viable without checking whether the contract required written notice within a specified period after the trigger and whether the notice was timely
- Misses that a separate contractual mechanism for change in law or regulatory action may govern the event, making force majeure the wrong doctrinal lane
- Accepts causal explanations that do not numerically account for the claimed shortfall, leaving internal inconsistencies unexposed
- Raises contributory fault as if it were self-proving, instead of testing whether it is pleaded with factual specificity and tied to a concrete act or omission

## 3. Legal frameworks / domain conventions that apply

- Defense filing timeliness: arbitral rules and any procedural timetable control the filing deadline; compare the actual submission date to the deadline and treat lateness as a procedural vulnerability under the governing rules
- Force majeure notice requirement: many clauses require written notice within a stated period after the event; untimely notice can bar reliance even if the event itself is otherwise within the clause
- Maintenance exclusion: where the alleged event stems from deferred or inadequate maintenance, the maintenance carve-out may defeat the defense on its own terms
- Change of law versus force majeure: if the contract contains a dedicated regulatory-change or change-of-law clause, analyze that clause first and assess whether force majeure is displaced or subordinated by the more specific mechanism
- Causation and quantum consistency: where multiple events are said to explain a shortfall, the attributions should coherently map onto the total shortfall and the relevant time periods; unexplained gaps weaken causation
- Specificity of contributory negligence: a bare assertion is weak if the pleading does not identify the particular conduct, actor, or omission and connect it to the alleged loss
- Governing authority discipline: each legal proposition should be anchored to the controlling rule, clause, treaty article, arbitral rule, or other named authority rather than stated as an unsupported conclusion

## 4. Analytical scaffolds

1. Identify the governing procedural timetable and the defense submission date; compare them before reaching the merits.
2. For each asserted force majeure event, extract the trigger date, the notice date, and the contractual notice window; determine whether notice was timely.
3. Check whether the claimed event implicates a maintenance exclusion, and if so, whether the defense addresses that exclusion with facts rather than labels.
4. For each government order or regulatory action, test whether a dedicated change-of-law or regulatory-change provision is the more specific mechanism and whether the defense used the wrong one.
5. Trace every causation assertion to a discrete event, period, or quantity; then compare the attributed effects against the overall shortfall to find mismatches or gaps.
6. Test any contributory negligence allegation for factual particularity and causal linkage; flag generic or formulaic pleading.
7. For each issue, state the controlling authority that supports the legal significance of the defect and tie the defect to the practical consequence for the claimant.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Use a timeline for filing, trigger, notice, and response dates so that procedural and contractual timing defects are visible in sequence
- If several events are relied upon, analyze them separately first and then check whether the defense wrongly aggregates them into a single explanation
- Distinguish clause hierarchy: a specific contractual regime for regulatory change ordinarily takes priority over a broader catch-all force majeure theory when both cover the same event
- Distinguish chronology from causation: a timely event does not cure an untimely notice, and a timely notice does not cure a weak causal fit

## 6. Output structure conventions

- Write a claimant-side issues memorandum in ordinary legal memo form, not as a transcript of the defense
- Begin with a short executive summary that identifies the most material vulnerabilities and the recommended reply posture
- Include an issue register with an explicit severity scale defined once at the top and applied consistently to every issue, using ordinal labels such as Critical / High / Medium / Low
- For each issue, include:
  - a concise issue heading
  - the governing authority or contractual basis
  - the pertinent facts with cross-references to the claim materials and the defense
  - the severity rating
  - the scale or threshold implicated, where the source materials provide one
  - the cross-reference to the related clause, schedule, rule, or document
  - the downstream consequence for the claimant-side strategy
  - a reply strategy recommendation
- When multiple events, notices, periods, or causes are in play, list them first and then analyze each in a separate row or sub-entry
- Include a timeline section for filing, event triggers, notices, and response deadlines
- Include a causation table when the defense attributes loss or shortfall to more than one event; show the asserted attribution, the total explanation offered, and any mismatch with the claimed shortfall
- End with an explicit Recommended Actions section that assigns each action to a role or function and ties it to a deadline, milestone, or relative urgency
- Use cross-references throughout so the memo can be navigated from issue to source material without rereading the full record
