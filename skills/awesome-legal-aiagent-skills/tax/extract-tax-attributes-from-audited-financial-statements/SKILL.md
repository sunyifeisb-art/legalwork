---
name: extract-tax-attributes-from-audited-financial-statements
task_id: tax/extract-tax-attributes-from-audited-financial-statements
description: Extracting tax attributes from audited financial statements requires cross-checking each attribute across the available disclosure sources because inconsistencies between sources can be material due diligence findings.
activates_for: [planner, solver, checker]
---

# Skill: Extract Tax Attributes from Audited Financial Statements

## 1. Subject-matter triage
- Treat the task as a source-extraction and comparison exercise, not a tax opinion.
- Start by inventorying every tax-related disclosure source in the packet and grouping them by period, jurisdiction, and attribute type.
- If a tax attribute appears in only one place, flag it as unverified rather than assuming completeness.
- If multiple periods are present, separate current, prior, and carryforward balances before analysis.

## 2. Failure modes the skill is correcting
- Extracting a headline tax-attribute amount from one disclosure source without reconciling it to the other available sources.
- Missing an annual-usage limitation, expiration profile, or ownership-change restriction embedded in a broader tax disclosure.
- Overlooking a deferred tax asset that is described indirectly or embedded within an aggregate line item.
- Treating an aggregate valuation allowance as sufficient without identifying what attributes it covers.
- Failing to distinguish generation, utilization, and ending balance for tax credits.
- Accepting an uncertain tax position roll-forward without checking whether the narrative and tables align.
- Ignoring state filing or nexus disclosures that may affect post-close compliance or reserve modeling.
- Stopping at extraction without stating the buyer-facing consequence of each inconsistency or gap.

## 3. Legal frameworks / domain conventions that apply
- **Multi-source tax disclosure reconciliation:** Audited financial statements may disclose tax attributes across the income tax footnote, deferred tax asset schedules, MD&A, reserve tables, and separate tax schedules. The controlling convention is to reconcile all disclosed amounts against each other before relying on any one figure.
- **Limitation regimes on carryforwards:** A total net operating loss balance may include amounts subject to special annual limitations after a change in ownership. If the disclosure indicates a limitation regime, separate the unrestricted and restricted components for diligence purposes.
- **Embedded deferred tax assets:** Some tax assets are not labeled as standalone items and must be inferred from line-item descriptions, note context, or reconciliation entries. If inference is necessary, identify the basis and mark any residual uncertainty.
- **Valuation allowance allocation:** An aggregate valuation allowance is not enough for transaction modeling if the underlying attribute categories are not allocated or inferable. Identify whether the note allocates the allowance by attribute class and, if not, treat the allocation as a diligence request.
- **Credit carryforward mechanics:** Where tax credits are generated and used in the same period, the relevant convention is to reconcile beginning balance, current-year generation, current-year usage, and ending carryforward.
- **Uncertain tax position roll-forward:** The roll-forward should reconcile beginning balance, additions, settlements, lapses, and ending balance, and the narrative should be consistent with the table.
- **State nexus and filing footprint:** Disclosed filing jurisdictions should be compared with the business footprint in the source set to identify possible unstated filing obligations or reserve needs.

## 4. Analytical scaffolds
- Build the work product in three passes: extraction, discrepancy analysis, and deal-impact assessment.
- First, enumerate each distinct attribute category in scope and extract every disclosed amount, date, jurisdiction, and restriction.
- For each category, capture both the face amount and any qualification attached to it, such as limitation, expiration, allocation, or uncertainty.
- Then compare all sources side by side and identify conflicts, omissions, and partial disclosures.
- For each discrepancy, state:
  - the competing source disclosures,
  - the nature of the inconsistency or gap,
  - the diligence significance for the buyer,
  - the follow-up request needed to close the gap.
- When a figure is derived rather than directly stated, show the logical path briefly and label it as derived.
- Do not collapse multiple attributes into a single pooled balance if the sources distinguish them.
- If a category is not present in the packet, say so expressly rather than inferring silence means zero.
- If only one item exists within a category, say that the record reflects a single disclosed item and note whether that is supported by the packet or merely by absence of contrary disclosure.

## 5. Vertical / structural / temporal relationships
- Distinguish current-period activity from carryforward balances and from long-term tax attributes.
- Separate federal, state, and foreign attributes if the disclosure set does so.
- Track attributes by limitation status, expiration period, and utilization period where the source materials allow.
- Tie uncertain tax positions to the underlying issue type, then reconcile that issue-type discussion to the reserve roll-forward.
- Compare filing jurisdictions to operational footprint only when the source set gives enough facts to do so; otherwise flag the comparison as incomplete.
- Preserve source chronology where it matters: opening balance, additions, dispositions, and ending balance should be reported in temporal order.

## 6. Output structure conventions
- Use an industry-conventional workbook-style memo with clear headings for extraction, discrepancies, and implications.
- Begin with a short scope note identifying the source set reviewed and any obvious limitations in the packet.
- Present an attribute inventory that lists each tax attribute category separately and captures all disclosed source amounts and qualifiers.
- Follow with a reconciliation or discrepancy section that pairs each mismatch or gap with the conflicting disclosures and a concise explanation of why it matters.
- End with a deal-impact section that translates each issue into buyer consequences such as reduced expected tax benefits, requested diligence, reserve modeling, or purchase-agreement protection.
- Use tables where they improve clarity, but keep each row focused on one attribute category or one discrepancy.
- For every inconsistency, include the specific source references from the packet and the transaction implication.
- For every missing or ambiguous disclosure, include a targeted information request that would resolve it.
- Keep the tone factual, cautious, and diligence-oriented; do not overstate conclusions where the packet does not support them.
