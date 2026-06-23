---
name: analyze-property-damage-claim-commercial-policy
task_id: insurance/analyze-property-damage-claim-against-commercial-policy-exclusions
description: Agents reviewing a commercial property damage claim against policy exclusions should apply each exclusion to each claimed category, test any exception to an exclusion against the governing policy language and applicable law, and verify covered amounts after any sublimits or other policy caps are applied.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Property Damage Claim Against Commercial Policy Exclusions — Coverage Determination Memorandum

## 1. Subject-matter triage
- Read the policy first, then the proof of loss, forensic report, remediation invoice, adjuster notes, maintenance records, and broker emails in parallel.
- Break the claim into discrete damage categories before analyzing coverage; do not treat the loss as a single undifferentiated event.
- If the record raises multiple possible causes, exclusions, or policy periods, identify each one explicitly and analyze each separately.
- If business interruption, contingent loss, or ancillary structure damage is mentioned, treat those as separate coverage tracks unless the policy clearly collapses them.

## 2. Failure modes the skill is correcting
- Exclusions are identified in the abstract but not applied line by line to each category of claimed damage.
- An exception to an exclusion is discussed without testing whether the facts satisfy the policy language and governing law.
- Equipment maintenance history is noted but not connected to the relevant maintenance, neglect, misuse, or similar exclusion language and the evidentiary record.
- Sublimits are identified but coverage conclusions are stated without verifying the covered amount after policy caps are applied.
- Different loss categories are merged, causing the memo to miss which items are potentially covered, excluded, capped, or only partially covered.
- Legal conclusions are stated without naming the controlling policy language or authority that supports them.
- The memo ends with analysis but no bottom-line recommendation tied to the documented coverage posture.

## 3. Legal frameworks / domain conventions that apply
- Read exclusions according to the policy text and the governing jurisdiction’s rules of insurance contract interpretation; apply the plain language first and any ambiguity rules only if the language is genuinely uncertain.
- Pollution exclusion analysis should distinguish ordinary commercial releases from traditional environmental pollution where the governing law draws that line, and should track the policy’s defined terms rather than the colloquial label.
- Fire-related coverage or exceptions must be tested against the policy’s own definition of fire, direct physical loss requirements, and any narrowing language in the exclusion or exception.
- Faulty maintenance, wear and tear, deterioration, neglect, or similar exclusions require a causal link between the condition in the record and the claimed damage category.
- Misuse, overloading, or improper storage exclusions should be applied to rack, shelving, or load-bearing failures when the record shows operation beyond rated or intended limits.
- Mold, remediation, or fungi sublimits apply to the line items they govern even where the underlying initiating event may otherwise be covered.
- Ancillary structure or secondary damage must be analyzed separately for causation, scope, and any cap or sublimit.
- If the policy contains an appraisal, deductible, waiting period, period of restoration, reporting condition, or cooperation requirement, address it if the record makes it relevant to coverage.
- Every legal proposition should be tied to the controlling policy text and, where needed, the governing statute, regulation, or leading case by name and section or other conventional citation form.
- After applying exclusions and caps, reconcile the numbers from the ground up so the final covered amount matches the line-item analysis.

## 4. Analytical scaffolds
1. Identify each claimed item and classify it by damage type, cause asserted, and policy bucket.
2. For each item, quote or paraphrase the controlling policy language, then apply the governing legal rule to the facts in the record.
3. Pollution analysis: determine whether the triggering event or substance falls within the exclusion; address any exception only after the exclusion is otherwise implicated; state whether the alleged release is covered, excluded, or partially excluded.
4. Fire analysis: determine whether the loss fits the policy’s fire language and whether any exception restores coverage; distinguish flame damage, smoke damage, heat damage, and ensuing loss if the policy makes those distinctions.
5. Maintenance / neglect analysis: review service histories, inspection logs, repairs, and notice issues; connect any lapse to the specific damage category; do not infer causation without record support.
6. Misuse / overloading analysis: compare observed loading or operation against rated capacity, manufacturer guidance, or ordinary use; link the overload evidence to the damaged asset.
7. Mold / remediation analysis: isolate mold-related work, cleanup, testing, and replacement charges; apply any mold cap or similar sublimit to the covered line items only.
8. Ancillary damage analysis: test whether secondary damage flowed from a covered cause, an excluded cause, or a separate independent condition.
9. If business interruption or related time-element loss is claimed, analyze the separate insuring agreement, waiting period, restoration period, and any applicable cap before including it in the final number.
10. For each issue, state the scale of the disputed amount, identify the interaction with other policy provisions or source documents, and explain the consequence for coverage, reserve posture, or payment.
11. Resolve the claim category by category, then reconcile the totals against the proof of loss and supporting invoices.
12. End with a clear coverage determination that distinguishes covered, excluded, capped, and unresolved amounts.

## 5. Vertical / structural / temporal relationships
- Track causation vertically from the initiating event through direct damage, ensuing damage, cleanup, and replacement costs.
- Track limitations vertically from insuring agreement to exclusion to exception to sublimit to deductible so the hierarchy is explicit.
- Track temporal issues in sequence: pre-loss condition, loss date, discovery, notice, mitigation, remediation, and repair completion.
- If maintenance records show a pattern over time, relate the timing of service lapses to the asserted onset of damage.
- If the claim spans multiple sites, components, or time periods, analyze each separately instead of using one conclusion for all.
- If invoices cover mixed work, separate covered mitigation from excluded repair or improvement work where the record allows.

## 6. Output structure conventions
- Write a coverage determination memorandum, not a brief and not a summary list.
- Organize the memo by coverage issue or exclusion, then by claimed damage category.
- Include a claim table with one row per damage category showing: claimed item, applicable policy issue, controlling authority or policy provision, coverage conclusion, covered amount, and excluded or capped amount.
- Where numbers are available, show the arithmetic used to reach the final covered and unpaid amounts; do not leave the conclusion as a bare statement.
- Use conventional legal memo headings such as Issue, Facts, Analysis, and Conclusion, but adapt them to the insurance coverage context.
- If multiple exclusions or caps apply to the same item, explain their order of application.
- End with a Recommended Actions block that states what the insurer, broker, or insured-side responder should do next, using imperative verbs, the responsible role, and a timing anchor tied to the claim posture or any document deadline.
- Ensure the final document can stand alone as a coverage determination memo suitable for export to `coverage-determination-memo.docx`.
