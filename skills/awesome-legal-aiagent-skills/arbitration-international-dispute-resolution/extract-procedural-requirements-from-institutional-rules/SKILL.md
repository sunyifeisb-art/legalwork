---
name: extract-procedural-requirements-from-institutional-rules
task_id: arbitration-international-dispute-resolution/extract-procedural-requirements-from-institutional-rules
description: Ensures a procedural compliance checklist computes each deadline from its trigger event, identifies overlapping deadlines, flags forfeiture and waiver risks, and addresses emergency-order enforceability at the seat.
activates_for: [planner, solver, checker]
---

# Skill: Arbitration Procedural Compliance Checklist

## 1. Subject-matter triage

- Identify the governing arbitration regime first: institutional rules, any party-agreed procedural order, the arbitration agreement, and the seat’s arbitration statute.
- If multiple rule sets or amendments appear in the source record, enumerate them before analysis and treat later-in-time instruments as potentially modifying earlier default timelines.
- Separate respondent obligations from claimant obligations and from tribunal or institution actions; do not merge them into one generic timetable.
- If the record includes emergency relief, counterclaims, cost advances, or nomination steps, treat each as a distinct procedural lane with its own trigger and consequence.

## 2. Failure modes the skill is correcting

- Lists procedural requirements without computing the deadline from the triggering event, leaving the client without actionable dates.
- Treats deadlines as standalone items without spotting when several fall in the same short window and require parallel management.
- Fails to flag missed arbitrator-nomination or similar selection deadlines as a forfeiture risk that can shift control of the appointment process.
- Omits waiver or forfeiture consequences tied to not raising counterclaims or objections at the correct stage.
- Ignores whether emergency-order relief is directly enforceable at the seat under the arbitration statute or whether court enforcement steps are still needed.
- Overlooks payment deadlines for advances on costs and the sanctions tied to nonpayment.
- States legal conclusions without naming the rule, article, or statutory provision that supports them.
- Produces a checklist of issues without giving each item an operational severity level and a concrete next step.

## 3. Legal frameworks / domain conventions that apply

- Deadline computation: procedural deadlines run from a defined trigger event and must be calculated by reference to the applicable counting method in the governing rules, including whether the period is calendar days, business days, or another unit.
- Trigger specificity: each entry should identify the exact event that starts time running, such as service, receipt, appointment, constitution of the tribunal, or notice by the institution.
- Appointment and nomination rules: institutional rules commonly set a nomination period; missing it may authorize the institution or tribunal to appoint without the party’s input under the controlling rules.
- Pleading and waiver rules: counterclaims, set-offs, jurisdictional objections, and document-production objections may be waived if not raised in the prescribed submission or within an allowed extension.
- Cost-shifting and advances: institutional provisions may require deposits, advances, or equal shares of anticipated costs, with suspension or procedural consequences for nonpayment.
- Emergency relief: the effect and enforceability of emergency decisions depend on the institutional framework and the seat’s arbitration law, including any court-assistance mechanism for recognition or interim relief.
- Confidentiality and preservation: institutional confidentiality obligations do not eliminate a party’s duty to preserve potentially relevant materials when a litigation hold is required.
- Controlling authority should be cited by name and section, article, rule number, or statutory provision wherever a proposition depends on a specific source.

## 4. Analytical scaffolds

- Build a line-by-line compliance table for every respondent-facing obligation found in the materials.
- For each obligation, capture: governing authority, trigger event, counting method, computed deadline, responsible actor, and consequence if missed.
- Where the source record provides dates, compute deadlines directly from those dates; where a date is not supplied, state the missing input needed to finalize the deadline.
- For each submission deadline, note whether extensions are available and whether the request for extension must be made before expiry.
- For nomination, response, objection, counterclaim, and payment steps, state the default rule first and then any exception or extension.
- For emergency relief, identify the date of appointment or referral, the response deadline, the decision deadline, and the seat-law enforcement question.
- For counterclaims, test whether they must be included in the answer, a reply, or a separately permitted later filing, and flag any waiver risk if omitted.
- For cost advances, identify the payment recipient, amount basis if disclosed, payment timing, and sanction for default.
- Where a deadline depends on service method, verify whether the governing rules deem email, courier, or portal filing to count as service or receipt.
- Apply a severity label to each item using a uniform ordinal scale such as Critical / High / Medium / Low, and use the same scale throughout.
- When a single factual record creates multiple deadlines or parties, enumerate them first and then analyze each one separately; do not collapse distinct obligations into one generic row.
- Identify all deadlines that cluster tightly enough to require parallel management, and mark them as simultaneous-action items.
- For every legal proposition, pair the conclusion with the controlling rule, article, or statute that authorizes it.

## 5. Vertical / structural / temporal relationships

- Map the chronology from the first procedural trigger through the last deadline so the respondent can see what must happen before what.
- Distinguish immediate, near-term, and later-stage obligations; a later right may depend on preserving an earlier objection or nomination step.
- Flag dependencies where one filing affects another, such as an answer deadline affecting counterclaims or a tribunal constitution affecting emergency relief timing.
- Identify any deadline that, if missed, permanently changes procedural rights rather than merely causing delay.
- Treat overlapping deadlines as a management problem requiring simultaneous drafting, internal review, and approval.

## 6. Output structure conventions

- Produce a procedural compliance checklist in a practical table or numbered checklist format suitable for transfer into a word-processing document.
- Begin with a short key defining the severity scale used in the checklist.
- For each entry include: severity, governing authority, obligation, trigger, computed deadline or required timing, responsible party, and consequence/risk if missed.
- Include a separate section for overlapping or clustered deadlines and a separate section for critical procedural risks.
- Include a separate section for emergency relief enforceability if the source materials raise that issue.
- End with a concise Recommended Actions section that gives the respondent’s next steps, each in imperative form, tied to a responsible role and timing anchor drawn from the record.
- Keep the checklist operational, not narrative: every entry should be actionable without rereading the source documents.
