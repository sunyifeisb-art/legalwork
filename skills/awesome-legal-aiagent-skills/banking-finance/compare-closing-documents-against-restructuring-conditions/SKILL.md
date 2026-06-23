---
name: compare-closing-documents-against-restructuring-conditions
task_id: banking-finance/compare-closing-documents-against-restructuring-conditions
description: Reviews restructuring closing documents against closing conditions from the relevant restructuring support and related transaction documents from an ad hoc lender’s perspective, flagging discrepancies with severity calibration and recommended remedial actions.
activates_for: [planner, solver, checker]
---

# Skill: Restructuring Closing Documents Gap Report

## 2. Failure modes the skill is correcting

- Checking the package against deal expectations in the abstract instead of matching each closing condition to the executed documents, certificates, and exhibits actually delivered
- Missing a mismatch because the closing package is internally consistent on its face but inconsistent with the RSA, term sheet, or operative definitions elsewhere in the source set
- Treating borrower-favorable drift as acceptable when the lender group did not authorize the change
- Failing to separate true closing blockers from lesser administrative gaps and economic deviations
- Ignoring the scale of the deviation, the related document interaction, and the consequence for the lender group
- Reporting issues without a concrete cure, responsible party, and urgency tie-back

## 3. Legal frameworks / domain conventions that apply

- Restructuring closing conditions must be tested against the operative condition language, not a summary of the transaction
- Ad hoc lender perspective requires strict comparison to the lender group’s bargained-for economics, control rights, and deliverables
- Any required deliverable should be checked for existence, form, and conformity to the stated condition or exhibit list
- Economic terms must be compared across the RSA, term sheet, draft closing documents, schedules, definitions, and any side letters or certificates in the source set
- If a condition turns on priority, intercreditor, or related protections, verify both execution status and whether the deliverable is referenced where the documents require
- If the package includes maturity, interest, liquidity, or proceeds conditions, check the operative figure, date, formula, or threshold against the controlling document language
- If the source set contains legal opinions or officer certificates, confirm each required topic or assertion is covered and not contradicted elsewhere
- Use a uniform ordinal severity scale across all issues, and define it once at the outset
- Cite the controlling provision or authority for every legal or transactional proposition relied on
- When the source documents identify roles or deadlines, carry those through into remedial guidance

## 4. Analytical scaffolds

1. Identify the governing closing conditions, defined terms, and any document hierarchy language before checking the package.
2. Compare each closing document to the specific condition it is meant to satisfy; do not infer satisfaction from general deal alignment.
3. For each monetary, date-based, percentage-based, or formula-based condition, use the actual source values and check for deviations, however small.
4. For any issue involving multiple documents, reconcile the closing package against the RSA, term sheet, draft operative documents, schedules, and certificates together.
5. When an economic or structural term appears in more than one place, treat inconsistency itself as a discrete issue even if no single provision is facially broken.
6. For any proceeds, liquidity, or similar threshold, calculate the relevant closing metric from the transaction documents and compare it to the stated requirement.
7. For any required deliverable, verify both that it exists and that it matches the required content, signatory, form, or attachment status.
8. For any interest, maturity, priority, or covenant term, compare the executed formulation to the agreed formulation and flag unauthorized drift in either direction.
9. For every issue, state: the controlling provision, the closing document reviewed, the specific deviation, the scale of the deviation, the cross-document interaction, the consequence to the lender group, the severity, and a recommended cure.
10. Calibrate severity using an explicit ordinal scale, with the most serious items reserved for conditions that block closing or fundamentally alter lender economics or control.
11. Where the record is unclear, say so and identify the missing document or fact needed to complete the comparison rather than assuming compliance.
12. Tie the recommendation to the role that should act and, where available, to the milestone or timing trigger in the source documents.

## 5. Vertical / structural / temporal relationships

- Compare the RSA, term sheet, and closing package in a document-hierarchy-aware sequence so later operative documents are not read in isolation from earlier deal constraints
- Track whether a condition precedent is satisfied as of signing, funding, or effectiveness, since timing can control whether a deviation is curable or already a breach
- Distinguish terms that are required to be identical across documents from terms that may vary by drafting convention but still must preserve the same economic effect
- If a deliverable depends on another deliverable, note the dependency and whether the failure cascades into a broader closing failure
- If a mismatch affects ongoing post-closing rights, flag the downstream governance, economic, or enforcement consequence separately from the closing defect itself

## 6. Output structure conventions

- Produce a compliance gap report organized by issue number
- Open with a brief executive summary that identifies the most serious gaps first
- State the ordinal severity scale once at the top and apply it consistently to every issue
- For each issue, include:
  - severity
  - controlling provision or authority
  - closing document reviewed
  - specific deviation
  - scale or metric, if applicable
  - cross-reference to the interacting clause, schedule, or document
  - downstream consequence to the lender group
  - recommended remedial action
- Use plain, lender-facing language; do not narrate your process or hedge with internal deliberation
- Close with a Recommended Actions section that lists the immediate steps, the responsible role, and the urgency or deadline anchor drawn from the source documents
- If no discrepancy is found on a given condition, say so affirmatively rather than omitting the condition
- Keep the report self-contained and suitable for conversion directly into `compliance-gap-report.docx`
