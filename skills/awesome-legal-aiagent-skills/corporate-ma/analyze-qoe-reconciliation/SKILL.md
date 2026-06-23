---
name: analyze-qoe-reconciliation
task_id: corporate-ma/analyze-qoe-reconciliation
description: Guides line-by-line reconciliation of competing quality-of-earnings reports and a preliminary purchase price allocation, producing structured workbooks and a deal-team memo that quantifies the enterprise value impact of EBITDA differences.
activates_for: [planner, solver, checker]
---

# Skill: Analyze QoE Reconciliation and PPA

## 1. Subject-matter triage
- Identify the source set first: both QoE reports, the purchase agreement definitions that govern EBITDA and working capital, closing schedules, and the preliminary PPA support.
- If a concept appears in only one source, flag it as a definitional mismatch rather than harmonizing it by assumption.
- If there is only one relevant party, period, or valuation scenario in scope, say so affirmatively before analyzing; if there are multiple, separate them and analyze each on its own row.
- Keep the work product transaction-focused: the goal is not a generic diligence summary, but a reconciliation that can be used to pressure-test purchase price, adjustment mechanics, and financial reporting allocation.

## 2. Failure modes the skill is correcting
- Accepting one side’s EBITDA figure without reconciling the buyer’s and seller’s positions item by item and translating the difference into enterprise value impact.
- Collapsing distinct add-backs, normalization items, or accounting adjustments into a single “net adjustment” that obscures the economics.
- Treating working capital as a pure accounting exercise and missing how definitional choices change the post-closing adjustment.
- Carrying forward the preliminary PPA without checking whether changes in consideration, net assets, or assumptions flow through to goodwill and identifiable intangibles.
- Producing narrative notes without the supporting workbooks that let the deal team audit the math and trace each conclusion.
- Failing to distinguish supportable normalization from management preference, especially for owner compensation, non-recurring items, and technical accounting classifications.

## 3. Legal frameworks / domain conventions that apply
- QoE reconciliation: reconcile disputed add-backs using the source documents, accounting conventions, and any available benchmarking support; do not treat either report as controlling without testing the underlying rationale.
- Owner compensation normalization: benchmark replacement compensation to a market rate for a comparable role at a similarly situated business, not to historical draws or distributions.
- Working capital peg: compare closing net working capital to the agreed target using the transaction’s defined methodology; test which balance-sheet items are included, excluded, or reclassified.
- Purchase price allocation: allocate consideration across identifiable intangible assets and goodwill consistent with business-combination accounting; assess customer relationships, technology, non-compete, trade names, backlog, or similar assets only if supportable on the record.
- Goodwill math: goodwill is the residual after fair value allocation to identifiable net assets; any adjustment to consideration or fair values must flow through the residual calculation.
- Evidence hierarchy: where the source set contains competing schedules or definitions, prioritize the transaction documents and reconciled schedules over narrative assertions.

## 4. Analytical scaffolds
- Start by listing every disputed EBITDA item, working-capital line item, and PPA component as a separate row before drawing conclusions.
- For each disputed item, record: the buyer position, the seller position, the source support, the recommended position, and a short rationale tied to the documents.
- Close each issue with three moves: state the scale or economic size of the item from the source set, cross-reference the other provision or schedule it interacts with, and state the downstream consequence for price, adjustment, financing, or reporting.
- Where multiple periods, categories, or assumptions exist, analyze them one by one rather than using a representative sample.
- For EBITDA:
  - build a bridge from unadjusted EBITDA to recommended adjusted EBITDA;
  - isolate each add-back or subtraction;
  - compute the implied enterprise value under the agreed multiple for each competing position;
  - explain the value difference in transaction terms.
- For working capital:
  - reconcile each current asset and current liability category;
  - compare closing net working capital to the peg;
  - identify any definitional issue that changes the adjustment outcome.
- For PPA:
  - list each identifiable intangible asset category separately;
  - state the useful life and valuation premise for each category;
  - recompute goodwill after any correction to consideration or net asset values.
- Keep the recommended position explicit; do not leave disputed items unresolved or buried in prose.
- If the source set contains a governing definition or methodology, cite it by name and section in the workbook or memo so the reader can trace the conclusion.

## 5. Vertical / structural / temporal relationships
- Treat the three workstreams as linked, not siloed: EBITDA reconciliation informs enterprise value, enterprise value affects consideration, and consideration feeds the PPA and goodwill.
- Check whether the working-capital adjustment or any other purchase-price adjustment changes the amount available for allocation in the PPA.
- If closing balance-sheet timing differs from the QoE reference period, note the temporal mismatch and explain whether it changes the comparison baseline.
- Preserve the sequence of effects: operating adjustments first, price mechanics second, accounting allocation third.
- When a conclusion depends on an earlier conclusion, make that dependency explicit rather than restating the same assumption in multiple places.

## 6. Output structure conventions
- Produce the memo and three workbooks as separate, fully populated deliverables; do not substitute a summary for any workbook.
- The memo should open with the headline economic takeaway from the EBITDA reconciliation, then synthesize the working-capital and PPA implications.
- Cross-reference workbook tabs, rows, or line items for every material conclusion so the deal team can trace the source of each recommendation.
- Use conventional workbook tabs or sections for: EBITDA reconciliation, enterprise value bridge, working capital reconciliation, purchase price allocation, and goodwill sensitivity or roll-forward if needed.
- Each workbook row should be a self-contained analysis unit, with the disputed amount, the source positions, the recommended treatment, and the consequence.
- End the memo with an explicit Recommended Actions section that assigns an action, a responsible role, and a timing anchor tied to the deal timeline or closing process.
- Keep the writing operative and audit-ready: every conclusion should be traceable to a source document, a calculation, and a downstream effect.
