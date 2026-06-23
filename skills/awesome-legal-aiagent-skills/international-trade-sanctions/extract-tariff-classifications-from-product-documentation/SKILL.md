---
name: its-extract-tariff-classifications-product-documentation
task_id: international-trade-sanctions/extract-tariff-classifications-from-product-documentation
description: Produces a tariff-classification report and customs-audit response that applies the General Rules of Interpretation product by product, identifies both underpayment and overpayment exposure, evaluates whether any misclassification also affected export-control classification, and outlines separate disclosure or remedial pathways for customs and export-control issues as applicable.
activates_for: [planner, solver, checker]
---

# Skill: Extract Tariff Classifications from Product Documentation

## 1. Subject-matter triage

- Treat the assignment as a document-based customs compliance review, not a free-form opinion.
- Start by identifying the universe of products, the declared tariff codes, the source documents supporting each description, and any separate export-control or trade-compliance references.
- If multiple products, periods, entries, or jurisdictions are in scope, enumerate them before analysis and keep one row per product or line item.
- If only one item is in scope, state that affirmatively and explain why the analysis does not branch.
- Do not infer product composition, use, or origin beyond the documentary record; flag missing facts that block a defensible classification.

## 2. Failure modes the skill is correcting

- Reaching a classification conclusion without tracing the General Rules of Interpretation in order, including the relevant heading text and notes.
- Collapsing all misclassification harm into underpayment and missing overpayment lines that may support refund recovery.
- Treating customs classification as the end of the inquiry when the same factual error may also affect export-control classification or licensing.
- Reporting conclusions without tying them to the source documents, the governing tariff/legal authority, and the practical compliance consequence.
- Omitting the separate treatment of importer liability, broker reasonable-care issues, disclosure timing, and remedial filing paths.
- Presenting a flat summary instead of a product-by-product audit response that can be used in a CBP-facing file.

## 3. Legal frameworks / domain conventions that apply

- Apply the General Rules of Interpretation in sequence, beginning with the heading text, section notes, and chapter notes, and moving to later rules only if earlier rules do not resolve the classification; cite the operative tariff heading/subheading basis for each product.
- Use the explanatory notes, where relevant, as interpretive support, but do not substitute them for the tariff text and legal notes.
- Distinguish declared classification from correct classification and identify whether the difference creates underpayment exposure or overpayment/refund potential.
- For underpayment lines, identify the duty shortfall and the customs consequence; for overpayment lines, identify the refund opportunity and the applicable protest or equivalent remedial deadline under the governing customs procedure.
- Assess culpability under the applicable customs penalty framework based on the facts, including whether the record suggests negligence, gross negligence, or fraud-like conduct.
- If the facts support it, consider prior disclosure under the applicable customs rules as a penalty-mitigation path; timing, completeness, and tender requirements matter.
- If the misclassification also affected export-control classification, assess the separate export-control rule set and whether a distinct disclosure or remedial filing is warranted.
- If a broker participated, apply the reasonable-care standard for customs brokers and distinguish broker conduct from importer liability.
- When stating a legal conclusion, name the authority or rule that supports it rather than relying on conclusory phrasing.

## 4. Analytical scaffolds

1. Build a product inventory from the source set: product name or identifier, declared code, description, material/composition, function/use, and any cited support for the current classification.
2. For each product, walk the classification analysis in order: heading text, section notes, chapter notes, relevant legal notes, then later interpretive rules only if needed.
3. State the correct tariff classification and the duty rate basis for each product, with the specific source of the classification conclusion.
4. Compare the declared code to the correct code and characterize the variance as underpayment, overpayment, or no monetary delta.
5. For underpayment lines, quantify the shortfall from the taxable/dutiable value and the rate differential; for overpayment lines, quantify the refund opportunity and note the remedial deadline or filing path.
6. Identify whether any classification error also changes export-control treatment, and if so, state the distinct export issue and whether parallel disclosure analysis is required.
7. Assess culpability and penalty posture using the facts in the documents, including whether the record suggests a disclosure-eligible mistake or a more serious compliance breakdown.
8. Summarize the net customs exposure by separating underpayment and overpayment totals before netting, so the remediation path is transparent.
9. Recommend the appropriate remedial route for each issue category: prior disclosure, protest or equivalent refund claim, corrective internal controls, and any separate export-control filing.

## 5. Vertical / structural / temporal relationships

- Keep customs classification, penalty analysis, refund recovery, and export-control analysis as distinct tracks even when they arise from the same misclassification.
- If the documents show a sequence of entries, versions, or revisions, note whether the classification change is prospective only or whether earlier entries remain exposed.
- Where a broker, importer, or internal classifier each played a role, separate who made the determination from who bears the compliance consequence.
- If the source set includes both product specifications and a spreadsheet, resolve conflicts by preferring the more specific, dated, and internally consistent support, while flagging unresolved discrepancies.
- If the record contains both current and historical classifications, explain whether the historical code was superseded, reused, or simply repeated without updated analysis.

## 6. Output structure conventions

- Use a report format organized by product or line item.
- Begin with a short executive summary stating the overall classification posture, total underpayment, total overpayment, net exposure, and whether disclosure or refund actions are recommended.
- For each product, include: product identifier, declared code, correct code, brief GRI-based rationale, duty rate basis, exposure type, exposure amount, and any export-control implication.
- Include a summary table that separates underpayment exposure from overpayment/refund opportunity before showing any net figure.
- Include a compliance/risk section that states the applicable penalty framework, the disclosure posture, and whether broker reasonable-care concerns are implicated.
- End with a Recommended Actions block that assigns each action to the responsible role and gives a timing anchor tied to discovery, filing deadlines, or the next compliance milestone.
- Keep the language operational and audit-ready; do not describe what the report would contain—write the substantive analysis itself.
