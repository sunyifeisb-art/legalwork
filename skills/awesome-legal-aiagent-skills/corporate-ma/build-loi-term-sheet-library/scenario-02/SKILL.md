---
name: build-loi-term-sheet-library-s02
task_id: corporate-ma/build-loi-term-sheet-library/scenario-02
description: Guides construction of a structured LOI and term sheet precedent database from transaction documents, with complete field population across the required terms for benchmarking and negotiation support.
activates_for: [planner, solver, checker]
---

# Skill: Build LOI / Term Sheet Precedent Library (Scenario 02)

## 1. Subject-matter triage (only if applicable)

- Treat the packet as a set of separate transaction precedents, not a single combined matter.
- Enumerate each LOI or term sheet first, then extract one complete record per document.
- If a document contains amendments, side letters, or multiple dated versions, identify the operative version before populating the row.
- If a field is not stated, leave it blank or mark it with the standard missing-value placeholder used by the library; do not infer.
- Preserve the source document’s terminology where helpful, but normalize into consistent library labels for searchability.

## 2. Failure modes the skill is correcting

- Producing narrative summaries instead of structured database entries, which makes the output unsearchable and unsuitable for benchmarking.
- Omitting required fields, especially those commonly used to compare economics, process protection, and closing conditions.
- Collapsing multiple transactions into one composite analysis instead of creating a separate row for each document.
- Reconstructing missing economics, thresholds, or triggers from intuition rather than the text.
- Mixing raw source phrasing with normalized labels in a way that prevents consistent search and comparison.
- Failing to distinguish what is expressly stated from what is merely implied by market practice.

## 3. Legal frameworks / domain conventions that apply

- Use extraction discipline, not paraphrase: record the deal term as stated, then map it to the standard field name used in the database.
- Treat common LOI / term-sheet deal terms as discrete searchable variables: parties, date, structure, consideration, price mechanics, earnout, exclusivity, fee allocation, financing certainty, conditions, and governing law.
- For contingent consideration, capture only the stated mechanics: trigger, measurement standard, threshold, cap or maximum if stated, and measurement period.
- For exclusivity and related process terms, capture the duration and any extension, renewal, or termination right if stated.
- For breakup or termination fees, capture the stated amount and any stated percentage reference; if the basis for a percentage normalization is absent, do not calculate it.
- Treat financing contingency, if addressed, as a yes/no process variable and keep it distinct from ordinary closing conditions.
- Use the source document’s governing-law clause, forum selection, and dispute-resolution mechanics if present; do not import assumptions from the target jurisdiction.
- When a term is absent from the source, absence is itself a data point and should be reflected consistently across the library.

## 4. Analytical scaffolds

1. Build a transaction inventory first.
   - Assign one internal transaction identifier per document.
   - Record document type, date, and apparent operative status.
   - Identify buyer, target, and any other named principal parties relevant to the term extraction.

2. Populate the core deal terms for every record.
   - Industry or sector
   - Deal structure
   - Pricing mechanism
   - Transaction value or purchase price
   - Equity value if separately stated
   - Earnout present or absent
   - Exclusivity term
   - Break fee or termination fee
   - Financing contingency
   - Governing law
   - Notable bespoke terms

3. For contingent economics, extract the full stated mechanics.
   - If earnout exists, capture trigger metric, threshold, maximum, measurement period, and any payment calibration expressly stated.
   - If multiple earnout tranches or milestones exist, keep each one separately identifiable within the record.
   - If the document states only that an earnout exists, record existence and leave the missing mechanics blank rather than infer them.

4. For process terms, separate duration from rights.
   - Record the base exclusivity period.
   - Record whether renewal, extension, or re-run rights are addressed.
   - Record any termination carve-outs or matching rights only if they are expressly stated in the document.

5. For fee and closing-risk terms, preserve the form in which they appear.
   - Record fixed amounts as fixed amounts.
   - Record percentages as percentages only when the denominator is stated in the document.
   - If a fee is contingent on a regulatory or financing event, note the trigger in the notes field.

6. For the memo, synthesize across the set.
   - Identify recurring term patterns, outliers, and negotiation leverage points.
   - Compare how the documents allocate closing risk, process control, and post-signing flexibility.
   - Flag drafting variants that affect comparability, such as different terminology for the same commercial concept.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Respect the order of transaction stages: preliminary expression, exclusivity, diligence, signing, closing, and post-closing economics.
- Where the document addresses multiple time periods, keep each period distinct rather than averaging or merging them.
- If the same transaction appears in more than one version, the later dated or expressly operative version controls for the database row.
- If a provision is nested within another condition, capture both the parent condition and the nested term so the library remains searchable by either concept.

## 6. Output structure conventions

- Produce two deliverables: a structured database file and a memorandum file.
- The database should be one row per transaction and one column per field, using stable column names across all rows.
- Keep source language out of the main columns unless it is necessary to preserve a non-standard defined term; use a notes column for nuance.
- Use a standard missing-value placeholder consistently for unstated items.
- The memo should be analytical, not descriptive: summarize patterns, outliers, drafting choices, and benchmarking implications.
- Organize the memo with conventional deal-review headings rather than a rubric-style checklist.
- Before finishing, confirm that every transaction in the source set has a corresponding database row and that both deliverable files are complete and non-empty.
