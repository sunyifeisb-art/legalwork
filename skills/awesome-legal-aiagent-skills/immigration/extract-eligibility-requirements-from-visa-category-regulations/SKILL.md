---
name: extract-eligibility-requirements-from-visa-category-regulations
task_id: immigration/extract-eligibility-requirements-from-visa-category-regulations
description: Structured eligibility matrix for multiple visa categories extracted from regulatory summaries and policy guidance, where the matrix must preserve the disjunctive or layered structure of each standard and the discrepancy report must flag inconsistencies between source documents.
activates_for: [planner, solver, checker]
---

# Skill: Extract Eligibility Requirements from Visa Category Regulations

## 1. Subject-matter triage

- Identify every visa category covered by the source set before extracting any requirement.
- Treat each category as its own analytical unit, and preserve distinctions among principal criteria, alternative pathways, exceptions, and conditional add-ons.
- If the source set contains multiple documents describing the same category, treat that as a comparison exercise across sources, not a single consolidated summary.
- Keep the matrix and discrepancy report separate; do not merge conflict analysis into the eligibility table.

## 2. Failure modes the skill is correcting

- Agents collapse alternative eligibility pathways into one “best read” requirement, overstating what must be shown.
- Multi-part standards are compressed into a single label, losing prongs, sub-elements, or qualifying language.
- Conditions that apply only in defined circumstances are omitted because the trigger is not carried forward with the requirement.
- Source-level differences are treated as harmless paraphrase when they are actually omissions, errors, or substantive conflicts.
- The comparison step is skipped or informally embedded in the matrix, leaving no dedicated discrepancy report.
- Multiple categories are handled as if they were one unified standard, which obscures category-specific rules and exceptions.
- Citations are asserted loosely or not tied to the operative source type, making it hard to trace the basis for each extracted requirement.

## 3. Legal frameworks / domain conventions that apply

- Extract the governing eligibility standard for each category from the source materials as written, and preserve any disjunctive, conjunctive, or layered structure.
- Treat alternative pathways as alternatives; do not merge them into a single composite requirement unless the source clearly does so.
- Where a rule has a general standard plus a narrower exception, record both and state the condition that activates the exception.
- Distinguish statutory, regulatory, and guidance-level statements when the source set provides them, and identify the source type for each extracted requirement.
- Use the controlling authority named in the source documents when available; otherwise use the most specific authority available from the source set and keep the provenance clear.
- Read internal summaries and guidance excerpts as secondary descriptions of the operative rule; discrepancies between summaries and operative text, or among multiple summaries, must be flagged rather than harmonized by assumption.

## 4. Analytical scaffolds

1. Build the category inventory from the full document set.
2. For each category, extract every eligibility element, preserving the original logical structure.
3. Separate core criteria from optional, conditional, or exception-based criteria.
4. Tag each requirement with its source basis and source type.
5. Compare descriptions across documents for the same category and requirement.
6. Classify each divergence as omission, substantive inconsistency, ambiguity, or apparent error.
7. Record the likely impact of each divergence on eligibility analysis.
8. Compile the matrix with one row per category-requirement unit.
9. Compile a separate discrepancy report grouped by category and issue type.
10. Check that the final outputs cover the full category set and all source documents.

## 5. Vertical / structural / temporal relationships

- For each category, keep the hierarchy intact: general rule, sub-rule, exception, and condition-triggered overlay.
- Where a requirement applies only after, before, or in response to another condition, state the sequencing or trigger explicitly.
- Where a standard turns on a factual status, note the status first and the consequence second.
- If a document uses different language for the same concept across sections, preserve the local wording in extraction and note the relationship in the discrepancy report.
- If multiple documents discuss the same issue at different levels of specificity, do not average them; identify which source is broader, narrower, older, or more detailed if that is clear from the materials.

## 6. Output structure conventions

- Produce two separate deliverables: an eligibility matrix and a discrepancy report.
- In the matrix, organize by visa category, then by requirement unit, with fields for the requirement, source basis, source type, and notes on conditional or disjunctive structure.
- Keep alternative eligibility pathways separate in the matrix rather than folding them into one line.
- In the discrepancy report, list each cross-document issue with the affected category, the nature of the discrepancy, the source documents involved, and a concise resolution note or follow-up point.
- Use a conventional issue-report format with a defined severity scale at the top, and apply the same severity labels consistently across all discrepancy entries.
- Cover every category and every source document in the comparison pass before concluding.
- End with a short actions section that identifies what should be checked, reconciled, or confirmed next, with the responsible role and timing anchor if the source materials provide one.
