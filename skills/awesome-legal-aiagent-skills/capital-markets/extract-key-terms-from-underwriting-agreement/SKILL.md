---
name: extract-key-terms-from-underwriting-agreement
task_id: capital-markets/extract-key-terms-from-underwriting-agreement
description: Underwriting agreement term extraction where the baseline captures core economics but may miss cross-document discrepancies, non-standard provisions, and exhibit completeness gaps.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Underwriting Agreement — Term Sheet Summary

## 1. Subject-matter triage

- Treat the underwriting agreement as the primary source, but read the checklist, pricing email, and allocation spreadsheet as controlling cross-checks for conformed economics and closing deliverables.
- If the source set contains more than one tranche, class, underwriter group, or closing condition set, enumerate each explicitly before synthesis; do not collapse distinct items into a single average or representative pass.
- If only one offering class or one underwriting group is actually in scope, say so affirmatively and explain why the record supports that narrowing.

## 2. Failure modes the skill is correcting

- The baseline extracts core economics from the underwriting agreement but does not reconcile them to related pricing and allocation materials, so mismatches in price, size, allocation, or fees go unflagged.
- The baseline identifies the lead underwriter but does not isolate who has representative authority over waivers, pricing confirmation, or similar action points, leaving ambiguity about who can bind the syndicate.
- The baseline lists standard terms but misses provisions that are non-standard or drafting-sensitive, including unusual indemnity survival, atypical closing conditions, and market-adverse-change language that departs from customary carve-outs.
- The baseline summarizes exhibits and closing items without checking whether the required deliverables are actually present and aligned across the agreement and checklist.
- The baseline states issues descriptively but stops short of explaining why the mismatch matters for the transaction or what operational correction is needed.

## 3. Legal frameworks / domain conventions that apply

- Economic terms in an underwriting agreement should be extracted as a complete deal grid: offering size, split by component if applicable, public offering price, underwriting discount or concession, overallotment mechanics, and expected proceeds where stated.
- Cross-document consistency matters because the pricing email and allocation spreadsheet often memorialize the final economics; any discrepancy can indicate an unformed, stale, or unreconciled document set.
- The overallotment option should be parsed for quantity, exercise period, source of shares, and exercise price mechanics, then checked against the pricing record and any allocation schedule.
- Closing conditions should be extracted as deliverables tied to specific obligations, not as a narrative; each condition should be matched against the checklist and exhibit index.
- Representative authority should be identified from the agreement’s designation language and any related instructions on waivers, syndicate action, or pricing confirmation.
- Non-standard provisions should be flagged by reference to market convention for IPO underwriting agreements, including unusual indemnity survival periods, unusually broad termination rights, and conditions that are more burdensome than customary for the offering type.
- Any filing or listing reference should be checked for internal consistency with the exchange, class, and offering structure described elsewhere in the source set.

## 4. Analytical scaffolds

- Extract all economic terms first, then verify each against the pricing email and allocation spreadsheet.
- Identify all underwriters and any stated allocation percentages or allocations by share count, then compare those allocations to the spreadsheet.
- Extract the overallotment option and separate its size, timing, source, and pricing mechanics.
- Extract each closing condition and map it to the corresponding checklist item or exhibit entry.
- Identify the representative underwriter and its stated authorities, especially waiver-related authority and any pricing or syndicate-control role.
- Review the agreement for provisions that are non-standard, unusually one-sided, or otherwise drafting-sensitive, and note the clause location.
- Review the exhibit index against the checklist to identify missing, extra, or mismatched deliverables.
- For each discrepancy or drafting issue, state the source documents involved, the specific mismatch, the transaction consequence, and the corrective action needed.

## 5. Vertical / structural / temporal relationships

- Organize the summary in transaction order: parties and role structure, offering economics, underwriting mechanics, closing conditions, exhibits, then issues.
- Distinguish between pre-closing obligations, closing deliverables, and post-closing or survival provisions.
- Where the agreement uses a defined term in one clause and a different label in the checklist or pricing materials, treat the difference as a possible inconsistency and resolve it by context before summarizing.
- When an item is time-bound, keep the temporal anchor attached to the term itself so that the reader can see when the right, obligation, or survival period operates.

## 6. Output structure conventions

- Produce a structured term sheet summary in a clean, market-style format, using conventional tables rather than a checklist replica.
- Use a deal overview section, an economics table, an underwriting / allocation table, a closing conditions table, an exhibits / deliverables table, and an issues / observations section.
- If multiple underwriter groups, tranches, or conditional delivery sets exist, give each its own row or subtable; do not merge them into a single line.
- For each issue, include the severity on a uniform ordinal scale defined once at the top of the issues section.
- Each issue entry should state: what differs, where it appears, what other document it conflicts with, why the difference matters for the offering, and what should be corrected.
- End with a concise recommended actions block that assigns each action to the appropriate role and ties it to the relevant transaction milestone.
- Keep the writing extractive and transactional; do not add legal conclusions unless they are anchored in the governing agreement language and the supporting source documents.
