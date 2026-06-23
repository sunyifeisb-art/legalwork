---
name: identify-issues-interconnection-agreement-solar-storage
task_id: energy-natural-resources/identify-issues-in-interconnection-agreement
description: Guides issue identification in a large generator interconnection agreement by cross-referencing costs against the relevant study, comparing technical requirements against the generator's specifications, and flagging non-standard additions and subjective standards that create open-ended obligations.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Large Generator Interconnection Agreement — Issue Memorandum

## 1. Subject-matter triage (only if applicable)

- Treat the LGIA, facility study, cost allocation letter, technical specifications, and internal emails as a single source set for issue spotting.
- First determine whether there is one facility and one agreement package or multiple facilities, phases, or cost tracks; if there is more than one, enumerate each before analysis and keep the issue review separate by facility or track.
- Prioritize provisions that affect cost, technical feasibility, termination rights, liability allocation, or non-standard obligations.
- Distinguish true contract deviations from provisions that are merely operationally detailed or duplicated elsewhere in the source set.

## 2. Failure modes the skill is correcting

- Issue spotting stops at description and does not close the loop with cross-document comparison, materiality, and client consequence.
- Cost items are summarized from the agreement without checking them against the study or allocation letter for mismatches, duplicate charges, or reconciliation gaps.
- Technical obligations are read in isolation and not tested against the facility’s stated capabilities or the internal emails’ practical constraints.
- Non-standard additions are treated as routine because they appear in the near-final draft, even when they are absent from the standard form or shift burden to the generator.
- Subjective standards are accepted without flagging that they create open-ended discretion and difficult-to-police performance obligations.
- Inconsistencies across sections, schedules, or attachments are noted only once and not reconciled into a clear drafting fix.
- The memorandum identifies problems but does not translate them into prioritized action items with responsibility and timing.

## 3. Legal frameworks / domain conventions that apply

- Cross-document cost matching: compare each cost allocation, reimbursement, true-up, and upgrade payment term in the agreement against the study and allocation letter; flag any mismatch, duplicate charge, missing cap, or undefined reconciliation mechanism.
- Technical compliance review: compare interconnection performance requirements against the facility’s specifications and technical data; flag requirements that exceed documented capability or require redesign, retrofits, or vendor changes.
- Standard-form deviation review: assess whether a clause is a standard LGIA concept or a non-standard addition; identify added burdens, especially where the clause imposes ongoing obligations, security, or unilateral discretion on the provider.
- Open-ended standard review: subjective triggers such as “reasonable judgment” or similarly discretionary standards should be tested against objective reliability-oriented formulations; flag where the standard lacks verifiability or invites unilateral action.
- Liability allocation review: identify one-sided caps, carve-outs, indemnities, or tax gross-ups that shift disproportionate exposure to the generator; note whether the drafting is reciprocal or asymmetrical.
- Controlling authority: when the memorandum states a legal proposition, identify the governing source used in the materials or the generally recognized rule of contract interpretation, interconnection practice, tariff-based implementation, or regulatory approval framework that supports the point.
- Where the source set references tariff provisions, study language, permit conditions, or operating rules, cite those authorities by name or section in the issue discussion rather than stating conclusions abstractly.

## 4. Analytical scaffolds

- Cost reconciliation: extract each payment, reimbursement, and allocation amount from the agreement and compare it to the corresponding figure in the study and allocation letter; report any deviation, ambiguity, or missing reconciliation step.
- Technical cross-reference: compare each stated operating requirement, protection setting, metering requirement, and performance threshold against the facility specifications; identify any item the facility cannot presently meet or can meet only by modification.
- Standard-form comparison: for each substantive clause, ask whether it is a baseline LGIA concept or a non-standard addition; if it is added or expanded, state the incremental burden and whether it is duplicative of external obligations.
- Subjective-to-objective check: where the agreement gives the provider judgment or discretion, test whether the language can be replaced with objective criteria tied to reliability, good utility practice, or defined events.
- Consistency check: review the agreement, schedules, exhibits, and emails for conflicting timing, cost, cure, notice, or true-up language; resolve the conflict by identifying the provision that should be aligned or clarified.
- Issue write-up formula: for each issue, state the clause or term, the problem, the relevant source comparison, the downstream consequence, and a recommended fix or diligence question.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track how obligations flow from the study into the agreement, from the agreement into implementation, and from implementation into long-term operation.
- If a clause creates an upfront payment but also a later reconciliation or true-up, check whether the timeline is internally consistent across the main body and the schedules.
- If the agreement gives a consent right, termination right, or notice right, test whether the timing is actually usable before the related cost or operational action occurs.
- If a provision imposes a lifetime obligation, security deposit, or maintenance charge, assess whether the contract contains any cap, sunset, renewal trigger, or vendor-selection control.
- If the emails show a practical workaround, escalation, or objection, use that context to sharpen the issue but do not let informal correspondence override the written allocation unless the memorandum explains why it matters.

## 6. Output structure conventions

- Produce a prioritized issue memorandum, not a narrative summary.
- Define a single ordinal severity scale at the top and apply it consistently to every issue entry.
- Organize the body by severity or priority, and within each issue include:
  - severity,
  - clause or topic,
  - concise description of the problem,
  - cross-document comparison,
  - quantified or scaled impact drawn from the source set,
  - downstream consequence for the client,
  - recommended action.
- Include a dedicated section for non-standard deviations from the baseline form.
- Include a dedicated section for cost and technical mismatches only if those issues arise in the source set; do not fabricate them.
- End with a concise Recommended Actions block that assigns each action to a role or decision-maker identified in the source set and ties it to the signing, filing, study-finalization, or implementation milestone.
- Keep the memorandum suitable for direct conversion to `issue-memorandum.docx`, with clear headings and issue-level bullets that survive plain-text export.
