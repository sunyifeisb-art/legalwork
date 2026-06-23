---
name: compare-uscis-filing-receipt-against-original-petition-submission
task_id: immigration/compare-uscis-filing-receipt-against-original-petition-submission
description: Discrepancy review comparing a USCIS filing receipt against the original petition submission, focusing on field-by-field mismatches, their potential effect on case linkage and identity verification, and the appropriate correction path based on the source and materiality of each error.
activates_for: [planner, solver, checker]
---

# Skill: Compare USCIS Filing Receipt Against Original Petition Submission

## 1. Subject-matter triage

- Treat the receipt notice as a processing record, not a merits decision.
- Compare the receipt against the petition packet field by field, then separately check the petition packet for internal inconsistencies that may explain the receipt-level error.
- Distinguish between:
  - data-entry or transcription errors introduced by the agency,
  - source-document errors originating in the petition submission,
  - formatting-only variations that do not change substance,
  - discrepancies that affect case linkage, identity verification, or downstream filings.
- Where multiple receipts, petitions, beneficiaries, or filing events are present, enumerate them first and analyze each one separately rather than merging them into a single comparison.

## 2. Failure modes the skill is correcting

- Agents list mismatches without separating material errors from minor formatting differences.
- Agents identify a discrepancy but do not say whether it likely arose in the submission or in agency processing.
- Agents fail to tie each issue to its operational consequence, especially where a case identifier or name mismatch can disrupt later filings or status tracking.
- Agents describe the problem without stating the proper correction path or escalation route.
- Agents overlook internal inconsistencies within the original petition package that may be the true source of the receipt error.
- Agents collapse distinct fields into a single narrative instead of producing a field-level comparison.

## 3. Legal frameworks / domain conventions that apply

- A USCIS receipt notice is a generated record; its contents are only as reliable as the source data and subsequent data entry.
- Identity fields matter differently from tracking fields: name variations typically implicate verification, while receipt/case-number errors primarily implicate linkage and correspondence.
- Priority-date and classification errors can affect downstream eligibility analysis and should be treated as legally consequential if later filings depend on them.
- Correction pathways differ by error type: some minor corrections may be handled through ordinary agency service channels, while substantive identifier or record corrections generally require a documented written request to the processing office.
- The controlling authority for a correction analysis is the relevant USCIS filing and correction procedure for the form/type at issue, together with the agency’s case-tracking conventions; cite the governing form instructions, USCIS policy guidance, or other identified source authority when the source set provides it.
- Do not state that an item is “correctable” or “non-correctable” without linking that conclusion to the relevant agency procedure or source authority.

## 4. Analytical scaffolds

1. Build a field inventory: list every receipt field that can be compared to the petition submission, including identity, case-tracking, filing/classification, date, and address/contact fields if present.
2. Match source to receipt: for each field, identify the exact submitted value and the exact receipt value.
3. Classify the discrepancy: determine whether it is a substantive mismatch, a transcription error, a formatting variant, an omission, or an internal inconsistency.
4. Attribute likely cause: assess whether the mismatch appears to stem from the petition package or from USCIS processing, using the source documents themselves.
5. Assign severity: use a uniform ordinal scale, defined once at the top of the report, based on effect on case linkage, identity verification, downstream filing risk, or administrative clarity.
6. Cross-check interactions: see whether the discrepancy interacts with any other source document, cover letter, supporting exhibit, prior filing, or later filing that references the same matter.
7. State consequence and remedy: for each issue, identify the downstream effect and the most appropriate correction path, including what evidence should accompany the request.
8. Review internal consistency: separately test whether the petition packet contains conflicting names, dates, numbers, or classifications that could explain the receipt error.

## 5. Vertical / structural / temporal relationships

- Track how a discrepancy propagates over time: an error on the receipt may be harmless at intake but become material when later filings, notices, or status checks rely on it.
- Evaluate linkage hierarchy:
  - case number and receipt number for tracking,
  - beneficiary and petitioner identity for record association,
  - classification and filing basis for matter categorization,
  - dates and priority dates for downstream eligibility analysis.
- If the source set contains multiple versions of the same field, identify the sequence of occurrence and note which version appears controlling.
- If one field depends on another, analyze the dependency explicitly; do not treat them as isolated entries.

## 6. Output structure conventions

- Use a categorized discrepancy report in a table with, at minimum, these columns:
  - Field
  - Submitted Value
  - Receipt Value
  - Discrepancy Type
  - Likely Cause
  - Severity
  - Downstream Effect
  - Corrective Action
  - Priority
- Define the severity scale once at the top of the report and apply it consistently to every entry.
- Group entries by category, such as identity, case tracking, filing/classification, dates, and other administrative fields.
- Include a short narrative summary that highlights the most material discrepancies first and explains why they matter.
- End with a Recommended Actions section that states:
  - the action to take,
  - the responsible role,
  - and the timing/urgency tied to the filing timeline or downstream use.
- Keep the report focused on discrepancies and consequences; do not add background unrelated to the comparison.
