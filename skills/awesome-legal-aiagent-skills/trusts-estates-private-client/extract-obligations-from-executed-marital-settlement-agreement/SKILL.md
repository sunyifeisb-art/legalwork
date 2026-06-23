---
name: extract-obligations-from-executed-marital-settlement-agreement
task_id: trusts-estates-private-client/extract-obligations-from-executed-marital-settlement-agreement
description: Closes the gap where agents list settlement-agreement provisions without cross-referencing the agreement text against attached exhibits for numerical discrepancies, identifying ambiguous support-termination conditions, flagging post-decree filing deadline risk created by a phased engagement, and noting enforcement gaps in ongoing reporting and contribution obligations.
activates_for: [planner, solver, checker]
---

# Skill: Extract Obligations from Executed Marital Settlement Agreement

## 1. Subject-matter triage

- Treat the decree, settlement agreement, exhibits, parenting provisions, support provisions, property schedules, beneficiary forms, and any related correspondence as one integrated document set.
- Start by identifying every operative obligation, then separate them by party, subject matter, trigger, deadline, condition, and enforcement consequence.
- Where the source set contains multiple instruments, identify which document controls each term before drawing conclusions.

## 2. Failure modes the skill is correcting

- Listing obligations from the agreement body without checking attached exhibits or schedules for conflicting figures, dates, or allocation terms.
- Missing obligations that are triggered by an event rather than a calendar date, especially where the trigger depends on age, school completion, remarriage, cohabitation, retirement eligibility, or account processing.
- Treating an unclear termination trigger as self-executing when the defined standard is incomplete or internally inconsistent.
- Failing to flag reporting, notice, cooperation, or documentation obligations that lack a deadline, recipient, delivery method, or remedy.
- Overlooking post-decree filing or implementation steps that may fall outside the drafting or implementation scope reflected elsewhere in the source set.
- Collapsing separate obligations into one narrative paragraph instead of cataloging each independently.
- Identifying issues without tying each one to the controlling text, the interacting provision, and the practical consequence for compliance or enforcement.
- Assuming a legal conclusion without naming the governing authority, rule, or statutory concept that supports it.

## 3. Legal frameworks / domain conventions that apply

- Settlement agreements in divorce matters are read as integrated instruments; a decree may incorporate, modify, or supersede agreement language depending on the court’s order and the instrument text.
- Specific schedules and exhibits often control numeric allocations, asset lists, account identifiers, or implementation mechanics, while the body of the agreement controls the operative obligation structure.
- Support-termination provisions should be assessed for self-executing clarity: undefined phrases, subjective standards, or missing factual predicates create enforcement ambiguity.
- Age- and status-triggered obligations require calendarization from the triggering event, with attention to the governing jurisdiction’s family-law rules on majority, emancipation, or school-completion endpoints.
- Ongoing reporting, contribution, reimbursement, and transfer obligations should be checked for deadline, delivery mechanics, recipient, and any remedy or enforcement path.
- Post-decree implementation obligations may require separate filings, account instructions, beneficiary updates, or administrative forms; scope limits and timing gaps can create compliance risk.
- Beneficiary and account-designation obligations should be checked for name consistency, account specificity, and any requirement to update titles or election forms.
- Where the source set invokes mediation, pre-suit conference, or similar prerequisites, note whether the prerequisite may delay urgent relief or conflict with a time-sensitive obligation.
- Any legal proposition stated in the report should be anchored to the controlling authority identified in the source set or, if absent, to the governing statutory or doctrinal rule the analysis relies on.

## 4. Analytical scaffolds

1. Build an obligation register from every source document.
   - For each entry, capture: responsible party, obligation type, exact action required, timing trigger or deadline, conditions, source document, and any identified ambiguity or conflict.
2. Enumerate all distinct obligations before analysis.
   - Separate obligations by party and by category rather than by paragraph order.
   - If only one item of a category exists, say so explicitly; do not imply a broader set.
3. Reconcile all potentially conflicting terms.
   - Compare the agreement body against every exhibit, schedule, addendum, and decree provision that addresses the same subject.
   - Record the controlling text and note any discrepancy, inconsistency, or missing cross-reference.
4. Calendarize every deadline and event-triggered obligation.
   - Convert event-based triggers into a practical monitoring entry using the source facts and any governing family-law timing rule.
   - Flag any item that depends on an unknown future date, external administrator action, or a condition that is not fully defined.
5. Test each support-termination or modification clause for precision.
   - Identify the operative trigger, the definitional elements, and any subjective or missing component.
   - Flag ambiguity where the clause cannot be administered without further agreement or judicial interpretation.
6. Check every reporting, disclosure, or delivery duty for enforceability.
   - Confirm whether the obligation states who receives the item, when it is due, how it must be delivered, and what happens if it is not delivered.
7. Check post-decree implementation steps for scope gaps.
   - If the source set implies work after entry of judgment, separate the legal obligation from the practical implementation task and flag any mismatch in scope, responsibility, or timing.
8. For each issue, include the legal basis, the cross-referenced source text, and the downstream effect on compliance, enforcement, timing, or rights.

## 5. Vertical / structural / temporal relationships

- Compare the decree with the settlement agreement first; then compare any exhibit or schedule that refines the same subject matter.
- Treat the more specific implementation document as controlling for mechanics and the more general agreement as controlling for structure unless the source set says otherwise.
- If an obligation spans future events, note the monitoring sequence in time order: present duty, upcoming trigger, future deadline, and post-trigger consequence.
- If an obligation depends on a third-party administrator, plan administrator, school, insurer, or similar external actor, record that dependency separately from the parties’ own duties.
- When the source set contains a phased or limited representation scope, isolate any obligation that requires later implementation so the report can flag the resulting gap clearly.

## 6. Output structure conventions

- Produce a single obligation-extraction report as a polished work product.
- Use conventional report sections rather than a rubric-shaped checklist:
  - executive snapshot
  - obligation register
  - conflicts and ambiguities
  - prioritized issues
  - recommended actions
- In the executive snapshot, define the severity scale once and use it consistently for every issue entry.
- In the obligation register, organize entries by subject area such as financial obligations, property transfers, parenting obligations, insurance obligations, tax obligations, reporting obligations, and filing/implementation obligations.
- Each obligation entry should include: party, obligation summary, timing trigger or deadline, source reference, and notes on conditions or dependencies.
- In the conflicts and ambiguities section, state the controlling text, the conflicting text or missing element, the legal or practical significance, and the consequence of leaving it unresolved.
- In the prioritized issues section, give each issue an ordinal severity label, a short reason, the controlling authority or doctrinal basis if applicable, the interacting document or clause, and the practical consequence.
- End with a recommended actions section that assigns the next step to a responsible role and ties it to a timing anchor taken from the source set or, if none exists, to the nearest compliance milestone.
- Keep the report self-contained, precise, and operational; do not provide abstract commentary unmoored from the source documents.
