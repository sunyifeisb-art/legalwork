---
name: complete-form-check-on-registration-statement
task_id: capital-markets/complete-form-check-on-registration-statement
description: S-1 form check for a registration statement where the baseline identifies surface-level omissions but does not fully test internal consistency of financial tables, ownership disclosures, dilution computations, and other structure-dependent disclosures against the supporting record.
activates_for: [planner, solver, checker]
---

# Skill: Form Check on SEC Form S-1 Registration Statement

## 1. Subject-matter triage
- Treat the draft registration statement as a section-by-section compliance and consistency review, not a generic proofreading exercise.
- Start by mapping the issuer’s structure, capital stack, governance, tax arrangements, and financing history from the source materials; those facts determine which disclosures are triggered.
- If the source set includes multiple versions of financials, cap tables, ownership tables, or pro forma presentations, enumerate them first and identify the controlling version before analyzing inconsistencies.
- If only one version is in scope, say so expressly and explain why the record supports that limitation.

## 2. Failure modes the skill is correcting
- The review flags missing headings but does not test whether the disclosed numbers reconcile across the prospectus, financial statements, and supporting schedules.
- The review identifies isolated drafting gaps but misses regulator-comment risks created by inconsistent share counts, ownership percentages, dilution math, or capitalization tables.
- The review treats governance, tax, and financing disclosures as boilerplate rather than structure-dependent items that can trigger additional disclosure duties.
- The review describes an issue without tying it to the governing rule, the related disclosure elsewhere in the filing, and the practical consequence for the issuer.
- The review spots problems but does not translate them into a prioritized memorandum the deal team can act on quickly.

## 3. Legal frameworks / domain conventions that apply
- Form S-1 disclosure must be assessed against the Securities Act of 1933 and the SEC’s registration-statement rules and instructions applicable to the issuer’s fact pattern.
- Financial statement presentation should be checked for consistency with Regulation S-X, including the age, form, and comparability of the included financials.
- Non-GAAP measures, if used, should be reconciled to the most directly comparable GAAP measure, and each adjustment should be supportable from the record.
- Dilution disclosure should be internally coherent: pre-offering net tangible book value, pro forma adjustments, post-offering share counts, and resulting per-share dilution must all line up.
- Ownership and capitalization disclosures should use the same share base, footnote assumptions, and post-offering denominator where the form calls for it.
- Governance disclosures should reflect the applicable exchange listing and corporate-governance rules if a control person, board composition, or committee structure creates special treatment or exemptions.
- Related-party, restructuring, or contingent payment arrangements should be disclosed where they bear on control, liquidity, conflicts, or future cash obligations.
- Director-independence statements should identify the standard being applied and apply it consistently across all directors and committee members.
- Disclosure should be tested against the filing date and expected effectiveness date to catch staleness issues that may require updated statements or amendment.

## 4. Analytical scaffolds
- Review the draft by S-1 section and then by disclosure theme: business, risk factors, use of proceeds, capitalization, dilution, selected financial data, management’s discussion and analysis, related-party transactions, directors and officers, principal stockholders, and financial statements.
- For each identified issue, state the governing authority by name and section or rule, not just the conclusion.
- For each numerical disclosure, trace the figure back to the source document, then check for arithmetic consistency across linked tables and footnotes.
- For each non-GAAP measure, reconcile the adjustment chain to the GAAP base and verify that the final disclosed metric matches the underlying calculations.
- For each ownership or dilution item, verify the share base, denominator, and post-offering treatment against the capitalization table and related notes.
- For each structure-specific obligation, ask whether the issuer’s governance, tax, or financing arrangements create disclosure duties in more than one part of the filing.
- For each issue, assess severity based on regulator-comment risk and transaction sensitivity, then state the likely downstream consequence if left uncorrected.

## 5. Vertical / structural / temporal relationships
- Check whether a disclosure in one section depends on a figure, assumption, or classification used elsewhere in the filing; if so, confirm the cross-reference is consistent in both places.
- Test vertical consistency from source record to financial statement to prospectus narrative to tables and footnotes.
- Check temporal consistency for interim statements, pro forma data, and any post-period events that may affect the filing’s accuracy as of the expected effectiveness date.
- If there are multiple classes of equity, multiple holders, or multiple offerings, analyze each separately before synthesizing the combined effect.

## 6. Output structure conventions
- Produce a memorandum organized by S-1 section and disclosure topic, using conventional capital-markets issue headings rather than a rubric-like checklist.
- Precede the findings with a brief legend defining the ordinal severity scale used throughout the memorandum.
- For each finding, include: section reference, concise issue statement, governing authority, severity, comment-risk assessment, the cross-linked disclosure or source document that interacts with it, the practical consequence, and a recommended correction.
- Keep issue statements specific and action-oriented; do not leave them as generic “verify” notes.
- Close with a prioritized summary of the issues most likely to draw SEC comments or delay effectiveness.
- End with a Recommended Actions block that assigns an imperative action, the responsible role, and a timing anchor tied to filing or effectiveness.
