---
name: review-markup-counterparty-dpa
task_id: intellectual-property/review-counterparty-data-processing-agreement-and-mark-up-toward-company-positions
description: Reviewing a counterparty data processing agreement template against a company playbook and sub-processor register to produce a prioritized commentary memo with recommended markups.
activates_for: [planner, solver, checker]
---

# Skill: Review Counterparty DPA and Mark Up Toward Company Positions

## 1. Subject-matter triage
- Treat the assignment as a redline-plus-commentary exercise, not a generic contract summary.
- If the source set includes multiple versions, compare against the latest executable template first, then reconcile with the playbook and any operational registers.
- Identify whether the DPA is controller/processor, processor/sub-processor, or a hybrid arrangement before analyzing clause adequacy.
- If there is only one DPA and one playbook, say so affirmatively and analyze that single set; do not imply a multi-document comparison that is not present.

## 2. Failure modes the skill is correcting
- Reviewing the DPA in isolation and missing conflicts with the company’s operational data-processing posture.
- Treating all comments as equal and failing to separate legal blockers from drafting preferences.
- Accepting vague processor obligations that are not operationally usable for notice, assistance, security, or deletion.
- Missing mismatch between the template’s sub-processing model and the company’s actual use of sub-processors or vendors.
- Overlooking whether the counterparty’s proposed fallback language shifts risk in a way inconsistent with company positions.
- Drafting comments that identify the issue but do not state the consequence for compliance, operations, or allocation of risk.
- Relying only on styling changes in the redline, which can disappear on export or when pasted into text review.

## 3. Legal frameworks / domain conventions that apply
- Apply the governing data-processing regime’s baseline processor terms as the mandatory reference point; any omitted core term should be treated as a non-conformance.
- Sub-processing provisions should be measured against the company’s actual sub-processor posture and change-notification practice.
- Data subject rights assistance must be specific enough to operationalize the controller’s response obligations under the applicable regime.
- Breach notification language must allow the company to meet its own regulatory deadline; “without undue delay” alone is usually not enough as a drafting endpoint.
- International transfer provisions must identify the applicable transfer mechanism where cross-border processing is in play.
- Return and deletion language should specify timing, format, exceptions, and certification or confirmation.
- Security language should require appropriate technical and organizational measures rather than generic policy references alone.
- Audit and assurance language should preserve meaningful oversight, whether through direct audit, reports, certifications, or a combination consistent with the playbook.
- When citing a legal proposition, tie it to the controlling authority named in the source materials or a generally recognized authority for the relevant regime.

## 4. Analytical scaffolds
1. Read the playbook first and extract the company’s preferred positions, fallback positions, and non-negotiables.
2. Read the DPA against a mandatory-terms checklist: scope, instructions, confidentiality, security, sub-processing, assistance, breach notice, transfer mechanism, deletion/return, audit, and liability.
3. For each clause, compare the draft against the playbook position and flag any deviation.
4. For each issue, state severity on a uniform ordinal scale defined once at the top of the memo.
5. For each issue, include:
   - the clause or section reference,
   - the deviation or gap,
   - the governing rule or authority,
   - the concrete risk to the company,
   - the recommended markup language.
6. When the analysis touches a specific time period, response period, notice window, or operational sequence, state it explicitly rather than assuming it is obvious.
7. For any redline instruction, make the change readable in plain text as well as in tracked-change form.

## 5. Vertical / structural / temporal relationships
- Map obligations vertically: controller instructions, processor obligations, sub-processor obligations, and downstream flow-down terms should align.
- Check temporal sequencing for notice, assistance, return/deletion, cure, objection, and audit response periods; later obligations should not make earlier compliance impossible.
- Where a clause depends on a policy, register, or exhibit, confirm that the referenced document is actually incorporated and current.
- If the DPA uses a hierarchy or conflict clause, confirm it does not silently override the playbook on core risk items.
- If the company uses multiple operational roles, assign responsibility in the commentary to the right internal stakeholder category rather than using vague “team” language.

## 6. Output structure conventions
- The deliverable is a prioritized commentary memo with recommended markups; the redline language must be usable on its own.
- Use a defined severity scale at the top, then organize entries from highest to lowest severity.
- For every entry, include:
  - Severity
  - DPA section / clause reference
  - Issue summary
  - Why it matters
  - Recommended markup
  - Short rationale
- Mark every substantive change in the recommended markup with plain-text change markers that survive format conversion, such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new].
- Where helpful, add a short [Rationale: …] note immediately after the markup to explain the edit.
- Separate sub-processor consistency issues from general DPA issues so the operational mismatch is easy to spot.
- End with an explicit Recommended Actions block that assigns each action to a responsible role and ties it to a timing anchor or milestone.
- Before finishing, ensure the memo is written as the primary output and contains operative markup, not just commentary about markup.
