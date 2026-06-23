---
name: compare-closing-docs
task_id: corporate-ma/compare-closing-docs
description: Guides substantive verification of closing deliverables against transaction-document requirements, including arithmetic checks, definition cross-checks, and conformity of certificates and ancillary documents to their stated conditions.
activates_for: [planner, solver, checker]
---

# Skill: Compare Closing Documents Against Transaction Requirements

## 2. Failure modes the skill is correcting

- Confirming deliverable presence without verifying substantive accuracy; a closing package can be complete on paper yet contain misdated, mismatched, or incorrectly executed items.
- Treating a conditions-to-closing item as satisfied because a document exists, without checking whether the document matches the specific party, form, timing, or wording required by the agreement.
- Missing cross-document inconsistencies, such as names, capacities, dates, exhibits, defined-term usage, or signature blocks that do not align across the binder.
- Failing to test whether schedules, certificates, and ancillary documents actually satisfy the governing requirement rather than merely resembling a standard form.
- Overlooking whether a missing or non-conforming item is cured elsewhere in the source set, or whether the defect leaves the closing condition unfulfilled.
- Stopping at issue identification without stating how material the mismatch is, what other provision it interacts with, and what transaction consequence follows.

## 3. Legal frameworks / domain conventions that apply

- Transaction-document hierarchy: the SPA controls closing deliverables, and any ancillary form must be read against the specific closing condition or schedule it is meant to satisfy.
- Conditions-to-closing doctrine in practice: a closing deliverable is satisfied only when the required document is delivered in the required form, by the required signatory, at the required time, and with the required content.
- Defined-term conformity: where the SPA uses a defined term or exhibit-based requirement, the deliverable must track that definition, not a generic market form.
- Execution conventions: signature authority, entity names, titles, dating, notary or witness requirements, and counterpart/comparable copies must match the SPA’s specified execution mechanics.
- Ancillary-document dependency: certificates, opinions, payoff letters, releases, bring-downs, and consents often depend on one another; compliance must be checked as a package, not in isolation.
- Contract interpretation: read the closing-deliverable requirement together with any definitions, exhibits, disclosure schedules, and bring-down mechanics that modify it.
- If the source documents identify a governing authority for a deliverable requirement, cite that authority by name and section in the report; do not state compliance conclusions without tying them to the controlling text.

## 4. Analytical scaffolds

- First, identify every closing deliverable category the SPA requires at signing or closing, including any item triggered by a condition, schedule, exhibit, bring-down, or officer action.
- If more than one deliverable, party, signing date, form version, or condition applies, enumerate the full set before analysis and assess each item separately.
- For each required item, verify:
  1. Presence in the binder;
  2. Correct counterparty / obligor / beneficiary / signatory;
  3. Required form, substance, and attachments;
  4. Proper date, effective time, and delivery timing;
  5. Any cross-reference to a defined term, exhibit, schedule, or related document;
  6. Whether any defect is cured elsewhere or remains open.
- Treat a document as non-conforming if it is unsigned, undated, misnamed, executed by the wrong entity, missing required annexes, or uses language that departs from the SPA’s required formulation in a way that changes legal effect.
- When assessing an issue, close the analysis in three steps:
  1. State the scale or severity of the mismatch using a source-document fact such as the number of deliverables affected, the closing condition involved, the amount or exposure at stake if stated, or the transaction step it blocks;
  2. Cross-reference the clause, schedule, exhibit, or related deliverable that the issue depends on or conflicts with;
  3. State the downstream consequence for the client, including whether closing is delayed, a condition remains unsatisfied, a cure is needed, or a post-closing dispute risk is created.
- For certificates and bring-down items, test substantive accuracy against the diligence record available in the source set; do not treat boilerplate recitations as self-proving.
- For payoff, release, lien, consent, or similar third-party documents, confirm that the named debtor, collateral, agreement, and discharge scope match the SPA requirement.
- For any numeric or date-based comparison in the source documents, verify the figures or dates only against the text provided; do not infer missing amounts or reconstruct deal math beyond the record supplied.
- Where the SPA allows a form that is “reasonably satisfactory” or similar, assess whether the delivered document plausibly satisfies that standard in context and explain any residual risk.
- Each identified issue should be stated with an explicit ordinal severity label defined once at the top of the report and applied consistently.
- End the report with concrete recommendations that assign the next step to the relevant role and tie it to the closing timetable or other transaction milestone in the source documents.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Match each deliverable to the specific condition, exhibit, schedule, or covenant it is meant to satisfy.
- Distinguish signing deliverables from closing deliverables and post-closing undertakings; a document may be valid but not timely for the condition being tested.
- Track dependencies between related items, such as a certificate that relies on an officer’s representation, a release that depends on a payoff amount, or a consent that depends on entity identifiers or transaction structure.
- If the source set contains multiple versions or amended drafts, compare the delivered version to the latest controlling text and flag stale or superseded language.
- Where the agreement uses a chain of documents to complete one condition, identify the weakest link and note whether any missing component prevents the whole condition from being satisfied.

## 6. Output structure conventions

- Use a report format titled as a closing-deliverable verification report.
- Open with a brief severity legend using an ordinal scale such as Critical / High / Medium / Low.
- Provide one section per deliverable category or condition bucket, using industry-conventional headings rather than the rubric’s internal labels.
- For each item, include: deliverable name, presence status, conformity assessment, severity, issue description, controlling authority or source reference if available, and recommended action.
- When there are multiple related documents, include a short dependency view showing how they interact and which item, if any, prevents satisfaction of the condition.
- Make each issue entry self-contained: it should identify the defect, the governing requirement, the practical impact, and the fix.
- Conclude with a Recommended Actions section that uses imperative verbs, names the responsible role from the source set when available, and ties each action to the closing milestone or deadline stated in the documents.
- Keep the report focused on missing, incomplete, or non-conforming items; if no defects are found for a category, say so affirmatively and briefly.
- Do not reproduce source text verbatim unless necessary to identify a discrepancy; paraphrase the requirement and the defect.
