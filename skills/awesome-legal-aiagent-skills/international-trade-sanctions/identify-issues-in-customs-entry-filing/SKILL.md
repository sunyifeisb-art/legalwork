---
name: its-identify-issues-customs-entry-filing
task_id: international-trade-sanctions/identify-issues-in-customs-entry-filing
description: Produces a compliance review memorandum for a customs entry package that identifies layered duty omissions, admissibility and filing deficiencies, classification issues, and potential refund opportunities on a line-by-line basis, calculates net duty exposure using the documents provided, and outlines disclosure and protest pathways at a high level.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in a Customs Entry Filing

## 1. Subject-matter triage (only if applicable)

- Treat the package as a line-by-line customs filing review, not a single-issue classification exercise.
- Separate issue-spotting into distinct buckets: classification, ordinary duty, layered/additional duty, trade remedy deposit exposure, admissibility or procedural defects, and refund/protest opportunities.
- If the package contains multiple entry lines, enumerated products, or multiple filing events, analyze each one separately and do not collapse them into a representative sample.
- If only one line or one filing event is present, state that it is the only in-scope item before analyzing it.

## 2. Failure modes the skill is correcting

- Reviewing classification in isolation while missing additional duty layers that may apply on top of the base rate.
- Identifying underpayments without separately identifying offsetting overpayments that may support a refund or protest.
- Treating procedural defects as minor even when they independently affect admissibility, filing validity, or mitigation posture.
- Failing to connect each issue to the relevant source document and the practical consequence for the importer.
- Stating a defect without quantifying its scale, relating it to another document or entry term, and tying it to downstream exposure.
- Giving conclusions without identifying the authority or rule that supports them.
- Omitting a concrete action plan at the end of the memorandum.

## 3. Legal frameworks / domain conventions that apply

- Classification is an entry-line determination under the Harmonized Tariff Schedule and any applicable interpretive rules; compare the declared line to the likely correct line using the product description and source documents.
- Ordinary duty, special duties, and additional duties can be cumulative; assess each applicable layer separately rather than assuming the base rate is exclusive.
- Trade remedy exposure depends on the product’s description, origin, and any applicable order or scope language reflected in the package; if the product is covered, the entry should reflect the related deposit or estimated duty obligation.
- Overclassification can create a refund opportunity through the applicable administrative correction, protest, or equivalent challenge process, subject to the relevant liquidation or finality deadline.
- Net exposure analysis should distinguish gross underpayments, gross overpayments, and the resulting net figure for disclosure or reserve analysis; do not merge categories until the underlying line items are identified.
- Customs power of attorney authority must be valid and current at the time of filing; an expired, revoked, or unauthorized signatory is an independent procedural issue.
- Any product-specific certification, statement, permit, or entry declaration required by the filing should be checked against the product line that triggers it.
- If filing timing matters, compare the filing timestamp to the transport or departure record and flag late, premature, or missing submissions.
- Voluntary disclosure or equivalent mitigation should be assessed when underpayments or procedural noncompliance are identified, with attention to writing, completeness, and tender requirements.
- Protest, correction, and disclosure concepts should be tied to the governing customs statute and regulations or other controlling authority identified in the package or standard practice.

## 4. Analytical scaffolds

1. Enumerate every entry line, product, filing event, and authority holder appearing in the package before analysis.
2. For each line, identify the declared classification, the likely correct classification, and whether the discrepancy creates an underpayment or overpayment.
3. For each line, test whether any additional duty layer applies, then assess whether the source documents support inclusion or omission of that layer.
4. For each line, test trade remedy coverage or other special duty exposure, then determine whether the entry reflects the proper deposit or estimated amount.
5. For each overclassification or duplicate charge, identify the likely refund pathway and the relevant timing constraint from the documents.
6. For each procedural issue, test power of attorney validity, required certifications or permits, and filing timing against the related source record.
7. For each issue, state: the scale of the issue using a document-based figure or threshold, the cross-reference that controls or conflicts with it, and the downstream consequence for the importer.
8. Calculate gross underpayment, gross overpayment, and net exposure using only the amounts supportable from the documents; if arithmetic is not fully supportable, flag the range and the missing inputs rather than inventing a number.
9. Assess whether disclosure, correction, protest, or refund action is appropriate, and tie that recommendation to the specific defect identified.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Line-level issues may interact with document-level authority issues; treat a defective authorization as affecting all lines it purports to cover.
- A trade remedy or layered duty issue may depend on both product description and origin; if either element is unclear, flag the uncertainty rather than assuming coverage or exclusion.
- Timing issues should be analyzed against the relevant event sequence: filing, departure, arrival, liquidation, and any correction window.
- If the package contains amendments, replacement entries, or duplicate submissions, compare the chronology to identify whether the later document cures the earlier defect or creates a second exposure.
- If multiple documents conflict, prioritize the filing document, then supporting commercial documents, then any later correction or explanatory material, and note the inconsistency.
- If only one relevant date exists, state that the timing review is limited by the available record.

## 6. Output structure conventions

- Draft a compliance review memorandum with an executive summary, issue log, exposure summary, and recommended actions.
- Use an ordinal severity scale defined once at the top of the memorandum, and apply it uniformly to every issue.
- For each issue, include:
  - severity
  - affected line or filing item
  - issue statement
  - supporting source document reference
  - controlling authority or rule relied on
  - scale or exposure indicator drawn from the documents
  - cross-reference to the interacting document or filing term
  - consequence to the importer
  - recommended fix or mitigation step
- Organize the issue discussion by severity, then by entry line or filing item within each severity tier.
- Include a financial exposure summary that separates underpayments, overpayments, and net exposure, and note any uncertainty in the input data.
- Include a procedural deficiencies section covering authority, certifications, permits, and filing timing.
- End with a Recommended Actions block that assigns each action to a role and anchors it to an urgent timing milestone or the nearest applicable deadline.
- If a refund, protest, correction, or disclosure pathway is implicated, state the pathway at a high level and identify the controlling authority by name and section or part when available.
