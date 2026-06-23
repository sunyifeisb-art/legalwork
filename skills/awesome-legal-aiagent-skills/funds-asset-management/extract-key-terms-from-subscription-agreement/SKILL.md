---
name: extract-key-terms-from-subscription-agreement
task_id: funds-asset-management/extract-key-terms-from-subscription-agreement
description: Extract and cross-reference key terms from subscription documents and a related summary into a standardized term extraction report, flagging inconsistencies across documents and capturing the operative language and regulatory characterization required for each investor representation.
activates_for: [planner, solver, checker]
---

# Skill: Key Term Extraction from Subscription Documents

## 2. Failure modes the skill is correcting

- Analyst extracts only economics and misses governance, transfer, consent, dispute-resolution, and investor-representation terms.
- Analyst paraphrases operative provisions instead of preserving the exact language needed to detect legal differences.
- Analyst treats the subscription packet as standalone and fails to reconcile it against the related summary or LPA summary.
- Analyst notes a mismatch but does not explain why it matters or which source is likely controlling.
- Analyst collapses multiple investors, elections, or side-letter-like variations into a single pass instead of isolating each applicable version.
- Analyst omits source citations, making it impossible to verify the extracted term against the underlying document set.

## 3. Legal frameworks / domain conventions that apply

**Precision-first extraction.** Capture the operative language of each key term as written, especially where the wording turns on thresholds, defined terms, discretionary standards, eligibility, or investor status.

**Fund subscription conventions.** Typical extractable terms include commitment/economic mechanics, capital-call and funding mechanics, transfer and assignment limits, default remedies, withdrawal/redemption restrictions, consent rights, reporting rights, confidentiality, indemnity, dispute resolution, tax and withholding, ERISA/benefit-plan or other status representations, anti-money-laundering / sanctions / beneficial ownership statements, and formation/authority details for relevant entities.

**Regulatory characterization.** Where an investor representation tracks a defined category, preserve both the category name and the stated basis or qualifier used in the documents.

**Document hierarchy and reconciliation.** Compare the subscription documents against the related summary term by term. If the same concept is stated differently, record both versions and identify the likely controlling source using the governing-document language in the source set, if provided, or ordinary contract-reading conventions if not.

**Materiality lens.** Flag whether each discrepancy is likely immaterial, potentially material, or material based on its effect on economics, governance, transferability, investor eligibility, or enforcement mechanics.

**Authority-aware issue framing.** When the source documents invoke a defined standard, rule, or clause-based condition, cite it as written and do not reduce it to a generic label that could hide a substantive difference.

## 4. Analytical scaffolds

**Step 1 — Build the term inventory.** Enumerate the full set of terms to be captured from the source set before extracting. Separate core economics, governance, investor status, transfer/exit mechanics, dispute resolution, tax/regulatory, and entity/authority items so no category is skipped.

**Step 2 — Extract each term verbatim or near-verbatim.** For each item, capture the exact provision language, the source document, and the section or page reference. If the document uses defined terms, preserve them.

**Step 3 — Reconcile term-by-term.** Match each extracted term against the corresponding statement in the related summary. If a term appears only in one document, note that absence explicitly.

**Step 4 — Classify the discrepancy.** For each mismatch, state the type of difference, whether it changes rights or obligations, and whether it is likely to matter at signing, funding, transfer, enforcement, or reporting.

**Step 5 — Identify the controlling reading.** Where the source set suggests hierarchy, incorporation, or precedence, identify the controlling document or clause. If the source set is silent, state that the controlling reading cannot be confirmed from the materials alone.

**Step 6 — Keep the report audit-ready.** Use a uniform table format so the reader can verify each term, source, reconciliation point, and issue status without prose searching.

## 5. Vertical / structural / temporal relationships

- Distinguish master-level terms from investor-specific elections or deviations.
- Distinguish entity formation/authority facts from investor-facing representations.
- Distinguish initial subscription provisions from ongoing obligations after admission, funding, or closing.
- Distinguish document language that governs only if a condition is met from language that applies immediately.
- Where multiple source documents speak to the same term, note whether one appears to amend, summarize, supplement, or restate the other.

## 6. Output structure conventions

- Produce a standardized term-sheet style report suitable for `.docx` export.
- Organize the report as a table with at least: term name, extracted language, source document and location, corresponding language in the related summary, discrepancy flag, materiality assessment, and controlling-reading note.
- Group related items by category so the reader can scan economics, governance, representations, dispute resolution, and entity/authority terms separately.
- Include a concise issue summary for each flagged discrepancy; a bare yes/no flag is not enough.
- Preserve the source language where precision matters; use paraphrase only for connective explanation.
- If a term is absent from one document, mark that absence explicitly rather than leaving the field blank.
- End with a short reconciliation note identifying the most significant open inconsistencies and any items requiring follow-up before execution or reliance.
