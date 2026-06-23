---
name: ecvc-draft-ira
task_id: emerging-companies-venture-capital/draft-investors-rights-agreement
description: Drafting an amended and restated investors’ rights agreement for a preferred stock financing requires calibrating investor-status thresholds to the post-financing cap table, sequencing piggyback cutbacks explicitly, addressing MFN interaction with side letters to avoid circularity, and resolving over-subscription when multiple participation rights coexist.
activates_for: [planner, solver, checker]
---

# Skill: Draft Investors' Rights Agreement

## 1. Subject-matter triage
- Confirm the primary deliverable is the amended and restated investors’ rights agreement; draft that first and treat the issues memorandum as secondary.
- Read the term sheet, purchase agreement, charter, side letters, and any registration-rights exhibits together before drafting.
- Identify whether the transaction actually includes demand, piggyback, S-3, participation, MFN, ESOP top-up, or pay-to-play concepts; do not import provisions that are not in the deal set.
- Calibrate any investor-status gate to the actual post-closing cap table, not to an earlier financing baseline.
- If multiple investors or side-letter variants exist, treat each affected group separately rather than assuming one uniform rule set.

## 2. Failure modes the skill is correcting
- Investor-status thresholds are copied from prior forms without re-checking the current capitalization, causing the wrong holders to qualify.
- Piggyback rights are drafted without a clear cutback hierarchy, so underwriter reductions are left ambiguous.
- MFN language is written as an automatic ratchet and can conflict with side-letter MFNs, creating circular or self-referential upgrades.
- Participation rights are not reconciled when enhanced and standard rights compete for the same allocation.
- ESOP top-up mechanics are left open-ended, creating an uncapped dilution obligation.
- Pay-to-play is added or omitted inconsistently with the actual agreed term sheet and organizational documents.
- Cross-references to governing documents, side letters, and purchase documents are left stale or internally inconsistent.
- The companion memo states problems but does not turn them into concrete drafting or diligence actions.

## 3. Legal frameworks / domain conventions that apply
- Use the conventional venture-capital registration rights architecture: demand rights, piggyback rights, S-3 rights, and termination mechanics, each keyed to the actual financing.
- State the investor-status threshold as a function of the post-financing ownership and fully diluted capitalization reflected in the source documents.
- In piggyback provisions, specify who gets cut first, how reductions are allocated, and how residual shares are shared after the underwriter’s cap.
- Draft participation rights with an explicit allocation formula and an explicit tie-break rule if total requested participation exceeds availability.
- Draft MFN, if included, as a request-and-accept process rather than an automatic self-executing upgrade unless the source documents clearly require otherwise.
- When side letters also contain MFN concepts, define the comparison universe so that the clause does not loop back through other investors’ side-letter rights.
- If an ESOP top-up is required, cap the obligation to a stated pool ceiling and tie the mechanic to the post-closing capitalization.
- If pay-to-play appears in the agreed package, align it with the charter, voting agreements, and any shadow-series mechanics; otherwise omit it.
- Use the governing law, defined terms, notice mechanics, and amendment standard from the deal documents consistently across the draft.
- For every legal proposition used in the memorandum or drafting rationale, identify the controlling contractual provision, statutory rule, or standard market convention that supports it.

## 4. Analytical scaffolds
- Build the agreement clause by clause from the source package: definitions, registration rights, information rights if included, observer or inspection rights if included, MFN, ancillary covenants, and boilerplate.
- For each registration right, confirm the holder class, triggering threshold, initiation mechanics, deferral periods, and sunset/termination triggers.
- For each piggyback right, confirm the offering type, issuer and holder cutbacks, underwriter discretion, and allocation order among holders.
- For each participation right, identify the eligible pool, the baseline pro rata allocation, any enhanced rights, and the over-subscription solution.
- For each MFN issue, compare the operative clause, any side letters, and any parallel rights in related transaction documents to eliminate circularity.
- For any ESOP or similar pool adjustment, test the mechanic against the closing capitalization and the maximum pool size specified in the deal.
- For any pay-to-play concept, verify that the operative terms match the term sheet and the organizational documents before carrying them into the draft.
- Prepare the issues memorandum as an implementation roadmap: what is inconsistent, where the inconsistency appears, and how to resolve it in the final documents.
- Where the source package contains more than one investor group, side letter, or rights variant, analyze each separately before synthesizing the final drafting position.

## 5. Vertical / structural / temporal relationships
- Draft the agreement to track the transaction timeline: pre-closing capitalization, closing, post-closing registration rights eligibility, and any later termination or sunset event.
- Preserve vertical consistency between the investors’ rights agreement, charter provisions, purchase agreement, and side letters so that a later document does not silently override an earlier one.
- Sequence cutback mechanics from issuer-level limits to holder-level allocations, then to any residual sharing rule, so the hierarchy is readable on its face.
- Where a later financing or side letter changes a rights package, state whether it supersedes, supplements, or is merely parallel to the base agreement.
- If there are multiple investor cohorts, separate their rights by cohort, then state any cross-cohort coordination rule only after the cohort-specific rights are fixed.

## 6. Output structure conventions
- Deliver the amended and restated investors’ rights agreement in standard venture-capital form with operative clauses, not commentary.
- Use the actual transaction inputs, defined terms, and threshold data from the source documents; do not leave placeholders where the deal package provides a number or condition.
- Keep cross-references internally consistent across all deal documents and side letters.
- The issues memorandum should be concise, practical, and organized by issue, with each item stating the discrepancy, the implicated documents, and the recommended drafting or diligence fix.
- End the memorandum with a clear Recommended Actions section that assigns each action to a role and ties it to the transaction timing.
- Ensure both files are complete, non-empty, and ready for production as `investors-rights-agreement.docx` and `issues-memorandum.docx`.
