---
name: triage-vendor-contracts-for-gdpr-cross
task_id: data-privacy-cybersecurity/triage-vendor-contracts-for-gdpr-cross
description: Cross-border vendor transfer triage fails when the agent does not use the inventory baseline provided in the task materials, does not verify claimed transfer mechanisms against independent confirmation materials, and does not assess each vendor relationship against the transfer destinations and data categories evidenced by the record.
activates_for: [planner, solver, checker]
---

# Skill: Triage Vendor Contracts for GDPR Cross-Border Transfer Exposure — Risk Assessment Memorandum

## 1. Subject-matter triage

This is a multi-vendor GDPR transfer-risk review. Start with the inventory baseline to identify the full vendor universe, then test each claimed transfer mechanism against independent confirmation materials, then read the vendor-specific contract/TIA materials, and only then draft the memo. Use any internal directive or status materials as prioritization inputs, not as substitutes for contractual or verification evidence.

Treat the analysis as vendor-by-vendor, not issue-by-issue in the abstract. If the materials show only one in-scope vendor, say so; otherwise enumerate the full in-scope set before analysis and keep the same order throughout.

## 2. Failure modes the skill is correcting

- The review starts from individual DPA excerpts and misses vendors that appear only in the inventory baseline.
- Claimed transfer status is accepted without checking the independent confirmation source, so expired, unverified, or mis-scoped status is treated as valid.
- The analysis collapses vendors with and without a documented transfer assessment into one bucket, obscuring the absence of any assessment for a non-adequate destination.
- The transfer destination, data category, and processing purpose are not matched to the actual vendor record, so a generic adequacy claim is overstated.
- UK-originating data is treated as though EU transfer language alone is enough, without checking the UK-specific transfer instrument where relevant.
- Sub-processor transfer chains are ignored, so the first-tier contract appears compliant while downstream transfers remain unaddressed.
- Internal directives are ignored or overused; they should inform prioritization, not replace source-based compliance review.

## 3. Legal frameworks / domain conventions that apply

- GDPR Chapter V governs transfers of personal data to third countries and international organisations; each transfer must have a valid mechanism for the specific destination and data flow.
- The principal transfer bases are adequacy decisions, appropriate safeguards such as standard contractual clauses or binding corporate rules, and limited derogations.
- Standard contractual clauses must match the parties’ roles and the transfer structure; annexes and transfer descriptions must be populated with substance, not placeholders.
- Where a transfer relies on contractual safeguards for a non-adequate destination, a transfer impact assessment should exist and its conclusions must support the selected mechanism.
- Claimed certifications or transfer-status indicators must be confirmed against an independent source and must cover the relevant scope of data, purpose, and geography.
- For UK-originating data, the relevant UK transfer framework must be checked alongside any EU transfer language.
- Use an ordinal risk scale consistently across all vendors, and define it once in the memo so the reader can see how urgency is calibrated.

## 4. Analytical scaffolds

- Build a complete vendor list from the inventory baseline before analyzing contracts.
- For each vendor, capture the claimed transfer mechanism, destination jurisdiction(s), data categories, and whether a transfer assessment exists.
- Verify every claimed mechanism or status against the independent confirmation materials; treat lack of confirmation, mismatch, or expiration as a compliance gap.
- For each vendor relying on contractual safeguards, test whether the legal instrument fits the relationship, whether the assessment exists, whether the assessment supports the transfer, and whether the contract reflects any required supplementary measures.
- Read the vendor-specific DPA/TIA excerpts for annex completeness, destination mapping, scope alignment, and downstream transfer coverage.
- Use the internal directive or status summary to prioritize remediation, not to dilute the legal analysis.
- Assign each vendor a risk tier and keep the assessment tied to the evidence actually present in the record.
- When a conclusion depends on a legal proposition, name the governing authority or convention that supports it rather than stating the conclusion in bare form.

## 5. Vertical / structural / temporal relationships

- Trace the transfer chain vertically: controller to processor, processor to sub-processor, and any onward transfer points that appear in the materials.
- Match the transfer mechanism to the specific direction of the transfer and the data origin; EU-origin and UK-origin data may require different instruments.
- Scope matters: a mechanism or status that covers one data class, country, or purpose does not automatically cover all vendor processing.
- Timing matters: a later verification source can invalidate an earlier claimed status, and a missing assessment at the time of contracting is itself a current gap.

## 6. Output structure conventions

- Draft a risk assessment memo, not a contract markup, and save it as `cross-border-transfer-risk-assessment.docx`.
- Open with a short executive summary stating the number of vendors reviewed, the vendors in the highest risk band, and the overall posture of the transfer program.
- State the risk scale once near the top and apply it uniformly to every vendor entry.
- Include a vendor-by-vendor assessment ordered from highest to lowest risk.
- For each vendor entry, include: transfer mechanism claimed, verification status, assessment status, risk tier, key legal basis, and a concise remediation recommendation.
- Close with a prioritized Recommended Actions section that uses imperative verbs, names the responsible role or owner if the source materials identify one, and ties each action to a practical timing anchor or regulatory milestone.
- Include a concise summary risk matrix that maps vendor, claimed mechanism, validity, assessment status, risk tier, and recommended action.
- Keep the memo evidence-led and avoid unsupported generalizations.
