---
name: extract-key-terms-reservation-of-rights-letter
task_id: insurance/extract-key-terms-from-reservation-of-rights-letter
description: Agents extracting terms from a reservation of rights letter should identify coverage defenses, policy provisions, implicated exclusions or endorsements, any state-law standards that affect how those provisions operate, and any limits or reservation gaps that may matter to the coverage analysis.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Reservation of Rights Letter — Structured Term Sheet

## 1. Subject-matter triage

- Confirm the governing insurance relationship, the claim posture, and the jurisdiction before extracting terms.
- Treat the reservation letter as the primary source for defenses and cited provisions, then cross-check the complaint, demand, policy declarations, and email for factual predicates, limits, and timing.
- If the materials implicate multiple policies, insureds, claimants, or policy periods, enumerate them first and analyze each separately rather than collapsing them into one coverage picture.

## 2. Failure modes the skill is correcting

- Different coverage defenses are merged together instead of being identified separately, even when they arise from distinct policy language or from a policy provision versus a common-law or statutory doctrine.
- An exclusion or reservation is extracted with policy text alone, without noting the governing legal standard that affects how the provision is applied under the relevant law.
- Limitations language in the reservation is recited incompletely, leaving out related policy limits or sublimits that may need to be tracked in the coverage summary.
- The analysis stops at description and does not connect each issue to the related factual predicate, other policy term, and practical coverage consequence.
- The output omits a severity or priority signal, making it harder to separate major coverage defects from minor reservation gaps.
- The output names a conclusion without identifying the authority, policy provision, or doctrine that supports it.

## 3. Legal frameworks / domain conventions that apply

- Distinguish between policy-based defenses and extra-contractual doctrines: identify each separately, and note whether the reservation relies on contract language, common law, or both.
- Exclusion standards under governing law: if the applicable law supplies a substantive standard for applying an exclusion or reservation, capture that standard at a high level and apply it to the extracted term.
- Worker-status exclusions: if the reservation turns on whether an injured person was provided, borrowed, leased, temporary, or otherwise furnished to an employer, extract the status characterization and the related policy language.
- Punitive-damages coverage: if punitive damages are addressed, identify the reservation and note whether the analysis depends on whether the governing law permits coverage for punitive damages and whether a distinction is drawn between direct and vicarious liability.
- Contractual indemnity language: if only part of an indemnification or assumption-of-liability clause is quoted, extract the quoted portion, flag the omission, and identify that the full provision should be checked.
- Limits recitation: if the reservation mentions some limits but not others that are part of the same coverage tower or policy structure, flag the omission and track the missing limits as unresolved items.
- Excess exposure: if claimed damages may exceed the limits referenced in the reservation, calculate the gap from the materials provided and note the potential coverage significance.
- For every legal proposition relied on, cite the controlling authority by name and section if the source documents identify it, or by the recognized governing rule, statute, regulation, or leading case if not.

## 4. Analytical scaffolds

1. Identify each distinct reservation, defense, exclusion, endorsement, or coverage issue in the letter.
2. For each item, extract the exact policy provision reference, the category of defense, and the factual premise the insurer invokes.
3. State the governing-law standard only at the category level, unless the source materials require a more specific rule to understand the reservation.
4. Cross-check the complaint, demand, declarations, and email for any facts that confirm, undermine, or broaden the stated reservation.
5. Identify any limits, sublimits, aggregates, deductibles, retentions, or defense-cost treatment mentioned in the materials, and flag any missing companion limits that should be tracked.
6. If the letter addresses worker status, punitive damages, or contractual liability, extract the relevant policy language and the insurer’s stated theory of why the provision matters.
7. If defense counsel appointment appears in the materials, capture the appointment status and date.
8. Translate each issue into a term-sheet entry that includes the policy hook, factual basis, legal standard, completeness check, and coverage consequence.
9. Apply an ordinal severity label to each issue and use the same scale consistently across the term sheet.
10. End each issue entry with a concise follow-up action tied to the next coverage step.

## 5. Vertical / structural / temporal relationships

- Track how the reservation letter sits relative to the underlying claim timeline: policy inception, loss date, notice date, reservation date, and any counsel-appointment date.
- If the materials span multiple policy periods or layered limits, map the relationship between them before analyzing adequacy of the reservation.
- If one provision modifies another, note the hierarchy or interaction rather than listing provisions as if they operate independently.
- If a factual allegation in the complaint or demand is mirrored or disputed in the email or reservation letter, identify that relationship explicitly because it may affect the breadth of the reservation.

## 6. Output structure conventions

- Produce a structured coverage term sheet, not a narrative memo.
- Begin with a brief scope line identifying the documents reviewed and the governing jurisdiction if available.
- Include a legend for severity, using a simple ordinal scale such as Critical / High / Medium / Low.
- Organize the body by coverage issue or policy provision, with one row or subsection per distinct defense or reservation.
- For each entry, include: severity; policy provision or doctrine; extracted term or reservation; factual basis; governing-law note; completeness / omission check; and coverage significance.
- Include a separate limits section that lists the referenced limits and any absent companion limits, sublimits, or aggregates that should be verified.
- Include a separate issues / gaps section for missing reservations, ambiguities, or incomplete quotations.
- Where multiple insureds, claimants, policies, or periods are involved, present each as a distinct entry rather than a merged summary.
- End with a short recommended actions block naming the next step, the responsible role, and the timing anchor if one is available from the source materials.
