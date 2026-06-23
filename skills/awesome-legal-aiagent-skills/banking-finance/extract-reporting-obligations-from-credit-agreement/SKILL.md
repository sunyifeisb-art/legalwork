---
name: extract-reporting-obligations-from-credit-agreement
task_id: banking-finance/extract-reporting-obligations-from-credit-agreement
description: Extract all reporting, notice, and certificate obligations from a credit facility's loan documents into a structured matrix with a compliance calendar and an inconsistencies log.
activates_for: [planner, solver, checker]
---

# Skill: Reporting Obligations Matrix and Compliance Calendar

## 1. Subject-matter triage (only if applicable)

- Treat the source set as a document family, not a single agreement: identify the operative credit agreement first, then pull in amendments, exhibits, schedules, certificates, notices, and any referenced definitions that affect timing or signatory status.
- Build the obligation set by obligation type and trigger first, then calendarize it. If the document family contains multiple deliverables for the same trigger, separate them before comparing deadlines.
- If only one periodic or event-driven obligation category exists, say so explicitly and note why no broader set is present.
- When multiple periods, dates, counterparties, or triggering events are present, enumerate them before analysis and assign one row per distinct obligation.

## 2. Failure modes the skill is correcting

- Recording every signer as a generic officer when the document requires a specific officer qualification or named role.
- Missing recurring compliance items because they are scattered across covenant, definitions, conditions precedent, and miscellaneous sections.
- Collapsing distinct deliverables into one row when the agreement uses different timing, different triggers, or different recipients.
- Overlooking a drafting anomaly where the reporting obligation does not fit the facility structure or the related covenant text.
- Ignoring an inconsistency between an original obligation and later amendment language, especially where the current template no longer matches the operative provision.
- Failing to compare duplicate or overlapping notice provisions and therefore calendaring the wrong deadline.
- Treating a default notice as settled without checking whether the cited obligation still exists, has changed, or is conditioned differently in the current document set.
- Missing whether a deadline uses business days, calendar days, or a quarter-end-specific rule.

## 3. Legal frameworks / domain conventions that apply

- Periodic-reporting extraction: capture financial statements, compliance certificates, borrowing-base or usage certificates, tax and insurance notices, and any other recurring deliverables as separate obligations where timing or signatory requirements differ.
- Event-driven notice analysis: capture acquisition, litigation, casualty, environmental, ERISA, default, material adverse change, lien, and similar notices only when the source documents actually impose them, and preserve the exact trigger language.
- Signatory analysis: identify the signer qualification exactly as drafted, including responsible officer, financial officer, senior officer, or other specified role, rather than flattening to a generic authorized officer label.
- Deadline preservation: retain business-day versus calendar-day wording, notice-after-occurrence timing, quarter-end timing, and any “promptly” or “as soon as practicable” formulation as the document uses it.
- Duplicate-obligation comparison: when the same subject appears in multiple places, compare the provisions, note the operative source, and calendar the tighter or earlier requirement where the document set supports that reading.
- Amendment consistency: if later text modifies a reporting or certification obligation, carry forward the current operative language and flag any obsolete cross-reference, template language, or certification statement.
- Facility-consistency check: if a reporting item appears to belong to a different facility format or collateral structure than the one at issue, flag it as an anomaly for follow-up.
- Default-notice review: if a default notice is in the source set, compare the cited obligation and timing against the current agreement and amendments before stating whether the notice appears defensible.
- Cited-authority discipline: for any legal conclusion stated in the matrix or issues log, identify the controlling document section or other authority on which that conclusion rests.

## 4. Analytical scaffolds

1. Document map: identify the operative agreement, then list amendments and referenced exhibits or certificates that affect reporting obligations.
2. Periodic obligation pass: extract each recurring reporting or certification item, with trigger, frequency, deadline, recipient, signer requirement, and source citation.
3. Event-notice pass: extract each event-triggered notice or certificate, with trigger language, timing, recipient, signer requirement, and source citation.
4. Signatory review: preserve the exact signer standard for each obligation and note deviations from the agreement’s usual officer formulation.
5. Timing review: preserve day-count conventions, quarter-end rules, grace periods, and any “promptly” language without converting them to an assumed date.
6. Conflict review: compare overlapping or repeated obligations to identify inconsistencies in deadline, trigger, recipient, or certification content.
7. Amendment review: identify obsolete or inconsistent certification language, stale cross-references, or obligations that appear removed, narrowed, or expanded by later documents.
8. Default analysis: if a default notice or similar enforcement communication appears, test it against the current operative provisions and amendment trail, and identify any challenge points or follow-up items.
9. Issue classification: for each anomaly or inconsistency, state what is inconsistent, where it appears, why it matters, and what operational or legal consequence follows.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Keep periodic obligations separate from event-driven obligations, and keep notice obligations separate from certificate obligations when the document treats them differently.
- Preserve the document hierarchy: if a schedule, exhibit, or certificate form controls the wording, note that it controls over a generic section summary.
- Where an obligation depends on quarter-end or fiscal-year-end timing, state whether the same rule applies to interim periods and whether any special fourth-quarter treatment appears.
- If multiple deadlines attach to the same event, record them as separate timing layers rather than merging them into one estimated date.
- If a later amendment modifies a certificate form or reporting deadline, treat the amendment as the temporal anchor for the current operative obligation.

## 6. Output structure conventions

- Use a matrix format organized first by periodic obligations and then by event-driven obligations, with one row per distinct obligation.
- For each row, include: obligation type, trigger or frequency, exact deadline mechanics, recipient, signer requirement, source reference, and any related document cross-reference.
- Include an inconsistencies or issues log that identifies anomalies, conflicting deadlines, obsolete language, missing cross-references, and facility mismatches.
- Include a compliance calendar that lists upcoming deadlines in chronological order, preserving business-day, calendar-day, and quarter-end conventions.
- Include a default-analysis section if any default notice or enforcement communication is in the source set, including the cited basis, current-document comparison, and any challenge points.
- When an issue is identified, state the source basis, the interacting provision or document, and the practical consequence for compliance, enforcement, or calendaring.
- Use terse but complete drafting: every obligation should be specific enough to calendar without guesswork, and every ambiguity should be flagged rather than resolved by assumption.
