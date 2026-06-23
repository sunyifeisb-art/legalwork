---
name: scenario-01
task_id: real-estate/extract-psa-key-terms/scenario-01
description: Guides extraction of key terms from a commercial property purchase and sale agreement into a topic-organized term sheet by reading the agreement as a whole, cross-referencing any related diligence materials and client instructions, and flagging issues with source section references.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Commercial Property Purchase and Sale Agreement

## 1. Subject-matter triage

- Treat the PSA as the primary source, but read all attached diligence materials and instruction emails before finalizing the term sheet.
- Identify whether there is more than one property, seller, buyer, closing track, diligence report, amendment, or exhibit set in scope; if so, separate them before extraction and keep each track distinct.
- If only one transaction is actually in scope, say so implicitly through the structure; do not force parallel treatment.

## 2. Failure modes the skill is correcting

- Extraction is done from the PSA alone, so related diligence materials and client instructions that affect risk allocation are missed.
- Terms are listed in article order or as a flat dump instead of a topic-organized term sheet that a real estate lawyer can use quickly.
- Section references are omitted, generalized, or not tied to the controlling provision and any linked exhibit or schedule.
- Potentially problematic provisions are restated without being flagged as unusual, seller-favorable, ambiguous, internally inconsistent, or inconsistent with diligence findings.
- Cross-document interactions are not surfaced, so a term that looks ordinary in isolation is not evaluated against reports, schedules, or instruction notes.
- The output reads like a summary rather than a working term sheet with issue flags and source citations.

## 3. Legal frameworks / domain conventions that apply

- Extract commercial real estate PSA terms by topic, typically covering parties and property, purchase price, deposit mechanics, diligence rights, title and survey, representations and warranties, covenants, closing conditions, prorations and adjustments, defaults and remedies, casualty/condemnation, closing deliverables, and post-closing obligations.
- Use the PSA’s defined terms as written, but restate them in plain English where that makes the term sheet more usable.
- Cite the controlling article, section, exhibit, schedule, or addendum for each term; if a term is split across multiple provisions, cite each relevant source.
- If diligence materials identify environmental, title, survey, leasing, zoning, or operational issues, cross-reference those findings to the provision that allocates the related risk, disclosure, cure right, termination right, or indemnity.
- Treat client instruction communications as part of the working record; if they identify priorities, negotiation sensitivities, or items to surface, carry those into the term sheet.
- When flagging issues, anchor the concern in the source language and, where applicable, the related document that creates the tension or risk.

## 4. Analytical scaffolds

- Read the PSA end to end before drafting any term entries so the deal structure is understood in context.
- Read all supporting documents before finalizing issue flags; reconcile them against the PSA and any amendments or schedules.
- Enumerate the transaction components that need separate treatment if there are multiple parties, properties, deposits, diligence reports, or closing paths.
- Extract by topic rather than by article sequence; group related provisions that are spread across multiple sections into one entry.
- For each topic entry, capture:
  - the operative business term in plain language,
  - the controlling source reference,
  - any linked exhibit, schedule, or incorporated document,
  - any issue flag, if the provision is unusual, unclear, one-sided, or inconsistent with the support set.
- When a provision depends on a definition, condition precedent, remedy, or exception elsewhere, include the cross-reference rather than restating it as standalone.
- When a diligence item or instruction note changes the significance of a PSA term, state the interaction directly in the entry.
- Organize the term sheet in the sequence a real estate deal lawyer would review it: economics first, then diligence and risk allocation, then closing mechanics, then post-closing and remedies.
- Keep issue flags concise but complete: identify the concern, the source of the concern, and why it matters for the transaction.

## 5. Vertical / structural / temporal relationships

- Track how pre-closing rights flow into closing conditions, then into post-closing survival, indemnity, or remedy provisions.
- Note temporal mechanics such as inspection windows, objection periods, cure periods, outside dates, extension rights, and survival periods as part of the topic they modify.
- Where a topic changes depending on a date, condition, notice, or election, preserve that sequence so the reader can see when the obligation becomes active.
- If a supporting document reveals a condition that predates the PSA, distinguish historical background from current contractual effect.

## 6. Output structure conventions

- Deliver a term sheet organized by topic, not a narrative summary.
- Each topic should contain a plain-language statement of the operative term, followed by the controlling section reference and any linked exhibit or schedule reference.
- Use a clear visual cue for issue flags, such as a bolded label or separate sub-bullet, so the concern is easy to spot.
- Preserve source fidelity: do not paraphrase away key qualifiers, exclusions, elections, or conditions.
- Keep the language practical and deal-facing, not academic.
- The filename must be `psa-term-sheet.docx`.
- Before finishing, ensure the primary deliverable exists, is non-empty, and contains the operative term sheet rather than a description of what would be included.
