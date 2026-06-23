---
name: compare-closing-documents-exit-agreement
task_id: corporate-ma/compare-closing-documents-against-exit-agreement-requirements
description: Guides comparison of a closing binder against agreement-based deliverable requirements, with substantive accuracy review of escrow mechanics, funds flow arithmetic, tax-related certificates, resignations, transition services terms, and other named deliverables.
activates_for: [planner, solver, checker]
---

# Skill: Compare Closing Documents Against Exit Agreement Requirements

## 1. Subject-matter triage
- Treat the SPA as the controlling checklist for closing deliverables, and the closing binder as the performance record to be tested against it.
- Separate two questions for each item: whether the deliverable exists, and whether the delivered version matches the contractual requirement.
- Where the agreement names multiple persons, entities, dates, certificates, schedules, or forms, test each one separately rather than assuming category-level compliance.
- If the binder contains a single document that appears to satisfy several requirements, verify each requirement independently before treating it as complete.
- If the source set does not include a required document or a relevant exhibit/schedule, mark the comparison as incomplete rather than inferring compliance.

## 2. Failure modes the skill is correcting
- Checking deliverable presence without verifying substantive accuracy, so an incorrect escrow term, release date, fee term, or signature block is treated as sufficient.
- Collapsing distinct party-specific deliverables into one generic compliance statement.
- Missing arithmetic defects in funds flow calculations or allocation tables.
- Treating a partial or unsigned document as equivalent to an executed closing deliverable.
- Overlooking mismatches between the SPA, any exhibit or schedule incorporated by reference, and the executed closing documents.
- Failing to connect a gap to its practical closing consequence, such as delayed funding, residual claim exposure, or documentation inconsistency.

## 3. Legal frameworks / domain conventions that apply
- The SPA controls the closing deliverable package; incorporated exhibits, schedules, and defined terms control the details of each required form.
- A closing deliverable is not compliant if it is present but materially inconsistent with the agreed economic, temporal, or party-specific requirement.
- Escrow documentation should be checked against the SPA’s governing formula, amount, mechanics, and release conditions, using the cited contractual section and any incorporated schedule.
- Funds flow materials should be checked for internal consistency and against the SPA’s economic terms; arithmetic accuracy matters because wire instructions and allocation tables are operationally binding.
- If the SPA requires certificates, resignations, officer authorizations, or similar person-specific deliverables, each named recipient or signatory requirement must be verified individually.
- If the SPA ties any deliverable to closing or post-closing milestones, confirm the timing is consistent with the governing deadline or condition.
- If a deliverable is conditioned on third-party or regulatory clearance, confirm the documentary evidence appears in the binder and matches the required form or status.
- Legal propositions in the report should be anchored to the controlling SPA section, exhibit, schedule, or applicable filing requirement rather than stated as bare conclusions.

## 4. Analytical scaffolds
- Build an issue register from the SPA: list every closing deliverable, then map each to the corresponding binder document.
- For each item, run a two-step test:
  1. Presence test — is the required document in the binder?
  2. Conformity test — does the document match the SPA’s required substance, form, parties, dates, amounts, and signatures?
- For multi-party or multi-document requirements, evaluate each party, instrument, and attachment separately.
- For monetary or allocation schedules, verify the stated figures, cross-check totals against the governing transaction amount, and flag any inconsistency that would affect closing wires or escrow funding.
- For escrow terms, compare the executed document against the SPA’s amount, release timing, claim mechanics, and any referenced survival period.
- For resignation, certification, authorization, or officer-delivery requirements, confirm the required person executed the document and that the correct capacity is stated.
- For transition or ancillary service terms, compare the executed instrument to the agreed exhibit or schedule and flag any mismatch in scope, fee, term, or effective date.
- For regulatory or third-party approvals, confirm the binder contains documentary evidence of satisfaction or clearance and that the evidence corresponds to the correct condition.
- When the analysis admits more than one party, period, deliverable, or instrument, enumerate them first and then assess them one by one; do not collapse multiple required items into a single representative review.

## 5. Vertical / structural / temporal relationships
- Distinguish pre-closing, closing, and post-closing deliverables, because a document may be valid but only for the wrong stage.
- Distinguish entity-level, seller-level, buyer-level, and individual signatory deliverables, because the same form can be required from different parties.
- Distinguish SPA-level requirements from exhibit- or schedule-level details, because the governing specificity often sits in the incorporated materials.
- Distinguish immediate closing conditions from post-closing deliverables, because the remediation urgency and consequence differ.
- Distinguish economic terms from documentary mechanics, because a form can be correctly executed yet still misstate the operative business deal.

## 6. Output structure conventions
- Prepare a closing compliance gap report organized by deliverable category and written in a way that lets the reader see both missing items and inaccurate items quickly.
- Define one ordinal severity scale at the top and apply it uniformly to every entry.
- For each issue, include:
  - the deliverable or clause reference,
  - the severity,
  - what is missing or incorrect,
  - the controlling SPA section, exhibit, schedule, or other authority,
  - the practical consequence of the gap.
- For each discrepancy, state the corrected figure, date, term, party name, or execution status where the source set permits it.
- For any issue involving quantities, dates, allocations, or fees, describe the mismatch in relation to the governing contract term without preloading unrelated arithmetic.
- End with a concise Recommended Actions block that assigns each action to a responsible role and ties it to the relevant closing milestone or deadline.
- If the binder appears compliant on a point, say so expressly only after the presence and conformity checks are complete.
- If source documents do not support a confident conclusion, label the item as unresolved and identify the missing source needed to complete the comparison.
