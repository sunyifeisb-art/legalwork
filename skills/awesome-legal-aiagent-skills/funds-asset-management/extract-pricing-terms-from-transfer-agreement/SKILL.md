---
name: extract-pricing-terms-from-transfer-agreement
task_id: funds-asset-management/extract-pricing-terms-from-transfer-agreement
description: Extract all pricing-relevant terms from a secondary LP interest transfer document set into a structured pricing term sheet, with an appended issues log identifying discrepancies, ambiguities, and gaps across the documents.
activates_for: [planner, solver, checker]
---

# Skill: Extract Pricing Terms from LP Interest Transfer Documents

## 1. Subject-matter triage

- Treat the primary work product as a pricing term sheet, not a narrative memo.
- Read the full document set first, then isolate every term that affects closing economics, funds flow, or post-closing price adjustment.
- If multiple versions, drafts, exhibits, side letters, notices, or related source documents are attached, treat them as a single pricing record and reconcile them against one another before drafting.
- If only one document contains pricing terms, state that the remaining documents are non-pricing or silent rather than implying coverage.
- Do not infer missing economics from background facts; extract only what is stated or clearly incorporated by reference.

## 2. Failure modes the skill is correcting

- Analyst extracts pricing terms in narrative form rather than in a structured table that allows quick comparison and verification.
- Analyst states price adjustment mechanics only as percentages without converting them to the related dollar amounts, making the term sheet harder to use in closing calculations.
- Analyst does not identify ambiguities in capital call proration where the relevant timing language differs across documents.
- Analyst omits a transfer-related fee from the closing funds flow analysis, leaving a gap that may cause a funding shortfall on the closing date.
- Analyst merges distinct pricing components into a single line item and loses the mechanics that drive the settlement amount.
- Analyst misses discrepancies between a transfer document and a governing fund document, resulting in an incomplete issues log.
- Analyst flags an issue without explaining the source conflict or why it matters economically for closing.

## 3. Legal frameworks / domain conventions that apply

**Purchase price components — systematic extraction:** A secondary LP transfer price is commonly built from multiple components, including an agreed base price, reference-date adjustments, holdbacks or escrows, and any contingent true-up mechanism. Extract each component separately and preserve the operative payment logic.

**Reference-date economics — timing matters:** Where price depends on a specified date, extract the date, the valuation basis, and any post-date adjustments. Keep the date used for the pricing formula distinct from the closing date and from any notice or payment deadline.

**NAV or value true-up mechanics — preserve the formula:** If the agreement ties consideration to a valuation metric, extract the metric, the input date, the adjustment trigger, and any collar, floor, cap, or reconciliation rule. State the operative mechanics in a form that can be used without re-reading the source text.

**Escrow / holdback mechanics — identify the holder and release trigger:** If any portion of the price is deferred or held back, extract the amount or formula, the holder, the release conditions, and the timing for release or forfeiture. A generic escrow description is insufficient for closing use.

**Indemnification and survival terms — economic exposure:** If the transfer documents allocate risk through indemnity, cap, basket, or survival language, extract those terms as pricing-adjacent economics because they affect the net transfer value.

**Capital call proration — timing ambiguity:** When responsibility for pending or future capital calls is addressed, extract the timing rule used to allocate the obligation. If different documents use different timing concepts, flag the mismatch and identify the allocation ambiguity.

**Transfer fee mechanics — closing funds flow:** If the fund, general partner, administrator, or other party may charge a transfer or consent fee, extract the fee amount or formula, the payor, and whether it is included in the purchase price or payable separately.

**Source-document hierarchy:** When multiple documents speak to the same pricing issue, identify the governing source relationship stated in the record and note any express priority or incorporation language.

## 4. Analytical scaffolds

**Step 1 — Enumerate the pricing topics first.** Before drafting, list the pricing-relevant topics actually present in the source set, such as base price, reference date, valuation adjustment, escrow or holdback, indemnity economics, capital call allocation, transfer fee, broker fee, and any other payment item. If a topic is absent, state that it is not addressed.

**Step 2 — Extract by component, not by paragraph.** For each topic, capture:
- the operative term,
- the exact source document and section or clause,
- the economic effect,
- any linked timing trigger,
- any conditionality or exception,
- any dollar conversion or settlement implication needed for closing.

**Step 3 — Reconcile overlaps.** Where two provisions touch the same economics, compare them side by side and identify whether they are consistent, cumulative, or in tension.

**Step 4 — Check arithmetic and internal consistency.** If a percentage, formula, or reference metric is given, verify that the stated mechanism matches the surrounding text and any defined terms. If the text appears inconsistent, flag the mismatch rather than trying to repair it.

**Step 5 — Separate silence from ambiguity.** Silence is an absence of terms; ambiguity is competing or incomplete wording. Mark them differently in the issues log.

**Step 6 — Tie each issue to consequences.** For every discrepancy, gap, or ambiguity, explain what it changes for closing economics, funds flow, or allocation of risk.

## 5. Vertical / structural / temporal relationships

- Track the relationship among document versions, attachments, and incorporated schedules so pricing terms are not duplicated or misstated.
- Track the relationship between a reference date, notice date, due date, closing date, and any post-closing true-up date.
- Track the relationship between the transfer agreement and any governing fund or transfer-consent provisions when those provisions address the same payment item.
- If the source set contains multiple time-based allocation rules, do not collapse them into one summary rule; state each rule and then explain the tension.
- If more than one party bears a pricing-related obligation, identify each party separately and do not aggregate their responsibilities.

## 6. Output structure conventions

- Produce a single deliverable named `pricing-term-sheet.docx`.
- Use a conventional two-part structure:
  1. a structured pricing term sheet in table format; and
  2. an appended issues log.
- In the pricing term sheet, use one row per pricing topic and include at least: term name, extracted language summarized in operative form, source citation, and economic significance or settlement effect.
- Where a term has a quantitative effect, state the amount, formula, or allocation mechanics in the table rather than leaving it only in prose.
- Use the issues log to record discrepancies, ambiguities, missing items, and cross-document conflicts.
- For each issue entry, include: a concise issue description, the source documents implicated, why the issue matters for closing, and a recommended resolution path.
- If no issues are found on a topic, say so explicitly rather than omitting the topic.
- Keep the tone transactional and drafting-oriented; do not analyze beyond what is needed to make the pricing terms usable.
- Before finalizing, confirm that the file exists, is non-empty, and contains the operative pricing terms and issues log, not merely a summary of them.
