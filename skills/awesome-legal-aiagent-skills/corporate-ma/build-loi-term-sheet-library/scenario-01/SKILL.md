---
name: build-loi-term-sheet-library-s01
task_id: corporate-ma/build-loi-term-sheet-library/scenario-01
description: Guides construction of a structured LOI and term sheet precedent database from a set of transaction documents, with consistent field population across required terms for benchmarking and negotiation support.
activates_for: [planner, solver, checker]
---

# Skill: Build LOI / Term Sheet Precedent Library

## 1. Subject-matter triage
- Treat the assignment as a two-part extraction-and-analysis workflow: first build the database row set, then draft the memo from the completed dataset.
- Expect multiple LOIs/term sheets and process each one as a separate transaction record before any cross-deal comparison.
- If a document is not an LOI or term sheet but is part of the same transaction package, use it only to complete or verify fields in the corresponding record.

## 2. Failure modes the skill is correcting
- Omitting required database fields needed for benchmarking and side-by-side comparison.
- Mixing the structured dataset and narrative memo into one merged product instead of keeping two distinct deliverables.
- Leaving fields blank instead of using a consistent placeholder for items not addressed, which makes gap analysis impossible.
- Collapsing distinct deal terms into a general summary instead of preserving term-level granularity.
- Recording terms inconsistently across transactions, which breaks searchability and comparative analysis.
- Failing to distinguish expressly stated terms from terms that are silent, deferred, or left for definitive documentation.

## 3. Legal frameworks / domain conventions that apply
- LOI and term sheet precedent libraries are benchmarking tools; they depend on uniform field definitions, consistent terminology, and stable placeholders for missing items.
- A term that is absent from a document should be recorded as absent or not addressed, not inferred from market practice.
- Where a term is present, capture it in the form most useful for later filtering: binary presence, duration, amount, trigger, measurement period, election right, or other standardized descriptor as applicable.
- Economic terms should be recorded in a way that preserves comparability across transactions, even when the underlying documents use different drafting styles.
- If a term appears in multiple places across the source set, reconcile them into one record and preserve the most operative formulation in the database fields.
- Use a consistent taxonomy for deal structure, pricing mechanism, exclusivity, financing conditions, break protections, earnouts, closing conditions, and governing law.

## 4. Analytical scaffolds
For each transaction, first enumerate the full set of documents and then create one record per transaction. Do not combine multiple deals into a single pass.

For each record, extract and normalize the following:
1. Transaction identifier
2. Document date
3. Buyer or other acquiring party
4. Target or counterparty
5. Sector or industry
6. Deal structure
7. Pricing mechanism
8. Stated value or headline price
9. Separate equity value or enterprise value if the document distinguishes them
10. Earnout: present/absent; if present, capture trigger metric, threshold, maximum amount, and measurement period
11. Exclusivity: presence, duration, and whether extension is expressly permitted
12. Break fee or similar deal-protection payment: presence, amount, and any related comparative metric if stated
13. Financing contingency or equivalent condition: present or absent
14. Governing law
15. Material closing conditions or post-signing obligations
16. Any unusual allocation of risk, optionality, or timing not captured above

Normalize each field so that comparable concepts are captured the same way across records:
- Use consistent yes/no or present/absent coding where the field is binary.
- Use a single placeholder for silence or non-applicability rather than leaving empty cells.
- Preserve exact commercial concepts, but do not preserve idiosyncratic drafting phrasing unless needed to clarify the term.
- If a term has both qualitative and quantitative components, capture both in separate fields rather than folding them together.
- If the document contains ambiguity, note the ambiguity in the memo and encode the database conservatively.

When building the memo, analyze the completed set for:
- recurring drafting patterns,
- outlier terms,
- negotiation leverage points,
- market-standard vs. deal-specific provisions,
- missing or inconsistent terms across the sample,
- implications for future term-sheet drafting and precedent selection.

## 5. Vertical / structural / temporal relationships
- Preserve transaction-level separation first, then analyze vertical relationships within each deal such as headline price, contingent value, exclusivity, and closing protection.
- Track temporal sequencing where relevant: signing date, exclusivity period, measurement period, outside date, closing conditions, and any post-signing milestone.
- If one document amends, supersedes, or clarifies another, reflect that hierarchy in the transaction record rather than treating the documents as independent precedents.
- If multiple documents within the same transaction address the same term, prefer the most specific or later operative formulation and note the source hierarchy in the memo.

## 6. Output structure conventions
- Produce two separate deliverables: a searchable database file and a narrative memo.
- The database should be organized as one row per transaction and one column per normalized field, with consistent placeholders for silent or inapplicable items.
- The memo should be analytical rather than descriptive: summarize trends, compare outliers, explain drafting patterns, and identify practical implications for future deals.
- Keep the database and memo internally consistent; every observation in the memo should be supportable by the completed records.
- Use conventional M&A term-sheet vocabulary, but avoid inventing facts or filling gaps from market assumptions.
- Before finishing, verify that both deliverables exist, are non-empty, and correspond to the same transaction set.
