---
name: compare-property-tax-records-against-seller-disclosure-statement
task_id: real-estate/compare-property-tax-records-against-seller-disclosure-statement
description: Guides property-by-property comparison of seller-disclosed tax information against official tax records for a multi-property portfolio, quantifying discrepancies and evaluating their underwriting and legal significance.
activates_for: [planner, solver, checker]
---

# Skill: Compare Property Tax Records against Seller Disclosure Statement — Discrepancy Report for Mixed-Use Portfolio Acquisition

## 1. Subject-matter triage

This is a document-comparison and issue-spotting task across multiple properties. First map each tax record, broker summary, and seller disclosure to the correct asset; do not assume document order or naming convention is reliable.

If the source set contains multiple tax years, jurisdictions, assessment types, or parcel-level records, enumerate them before analysis and verify which record governs each property. If only one record applies, say so expressly and explain why.

Separate property-level findings from portfolio-level implications. Analyze each asset on its own facts before aggregating any exposure or follow-up.

## 2. Failure modes the skill is correcting

- Comparing only headline tax amounts and missing parcel-specific mismatches in assessed value, tax levy, payment status, or delinquencies.
- Treating timing lag as a complete explanation without checking whether the disclosed year, tax cycle, or payment convention actually matches the record.
- Missing delinquent taxes, penalties, interest, or special assessments that create immediate closing exposure.
- Failing to connect tax discrepancies to area, use, or classification inconsistencies that affect underwriting.
- Stopping at description instead of stating magnitude, related document interaction, and transaction consequence for each issue.
- Describing legal risk without naming the governing tax, disclosure, or misrepresentation authority that supports the conclusion.

## 3. Legal frameworks / domain conventions that apply

- Real property taxes are typically governed by local assessment and collection law; confirm the jurisdictional tax year, assessment cycle, and payment-in-advance or payment-in-arrears convention before calling a difference immaterial.
- Tax liens and special assessments commonly have priority over junior encumbrances; delinquent amounts must be treated as closing exposure, not ordinary operating expense.
- Proration should follow the governing tax calendar and closing date; do not use one uniform convention across properties without confirming each jurisdiction.
- Seller disclosure obligations vary by jurisdiction and contract; material omissions or inaccurate tax disclosures may implicate contract remedies and, where recognized, fraud or negligent misrepresentation principles.
- Common legal authorities to anchor the analysis include the governing real property tax statute or ordinance, the applicable seller-disclosure statute or contract provision, and any jurisdictional misrepresentation rule the report relies on.
- If the record and the disclosure disagree on building area, use class, or occupancy category, the discrepancy may also distort per-square-foot metrics and underwriting assumptions.

## 4. Analytical scaffolds

- For each property, extract the seller-disclosed tax figure, the official record figure, the payment status, and any delinquent component.
- Compare disclosed and official figures in absolute terms and as a relative variance against the disclosed figure; distinguish rounding or timing differences from apparent misstatement.
- Identify whether the mismatch comes from assessed value, tax bill, special assessment, exemption status, reassessment timing, or a stale disclosure year.
- Cross-check the broker summary for inconsistencies in area, use, or classification that would affect tax analysis or per-square-foot underwriting.
- For each issue, state: the size of the discrepancy, the related source document or record that conflicts with it, and the downstream consequence for closing economics, diligence, or legal risk.
- Assign a severity level to every issue using a uniform ordinal scale defined once at the top of the report.
- Where a discrepancy is material, recommend the likely procedural response: seller cure, closing credit, escrow holdback, updated disclosure, indemnity, or price adjustment.
- If delinquent taxes, interest, or penalties appear in the record but not in the disclosure, treat them as a separate issue and not merely as part of the aggregate tax difference.
- Aggregate only after the property-level review, and preserve a property-by-property breakdown in any portfolio summary.

## 5. Vertical / structural / temporal relationships

- Verify whether each property is assessed and collected on the same cycle; a tax-year mismatch can create an apparent discrepancy that is actually timing-related.
- If an assessment is pending or recently changed, note the potential for post-closing retroactive adjustment and whether that creates an escrow or indemnity need.
- If the seller disclosure reflects a prior period while the record reflects the current roll, identify the temporal gap and state whether it changes the underwriting or closing allocation.
- When a discrepancy affects net rentable area, gross building area, or use classification, trace the effect through tax analysis and the broker summary together.

## 6. Output structure conventions

- Begin with a short executive summary stating the portfolio-wide takeaway, the most significant discrepancies, and whether any issue appears closing-critical.
- Define the severity scale once near the top and use it consistently for every issue entry.
- Organize the body property by property; for each property include the disclosed item, the official record item, the variance, the source conflict, the legal/transaction consequence, and severity.
- End with a concise portfolio-level reconciliation summary and a Recommended Actions section.
- Each recommendation must use an imperative verb, identify the responsible role if the source materials make that clear, and tie timing to the closing process or another concrete milestone.
- Keep the report in conventional discrepancy-report form suitable for conversion into `property-tax-discrepancy-report.docx`.
