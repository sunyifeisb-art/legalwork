---
name: draft-labor-condition-application
task_id: immigration/draft-labor-condition-application
description: LCA preparation package for multiple beneficiaries where workforce composition determines dependent-employer status and the LCA attestation obligations, and where per-beneficiary data must be verified against source documents rather than assumed from prior filings.
activates_for: [planner, solver, checker]
---

# Skill: Draft Labor Condition Application Preparation Package

## 1. Subject-matter triage

This is a multi-beneficiary extraction-and-compliance task. Treat each beneficiary as a separate workstream, but compile workforce-level facts once and reuse them consistently. Verify every field against the current source set; do not carry forward data from prior filings, templates, or intake narratives unless the source documents confirm it.

Enumerate the beneficiaries first, then process each one in turn. If the source set contains only one beneficiary, state that expressly and explain why no broader enumeration is needed.

## 2. Failure modes the skill is correcting

- H-1B dependency is calculated using an incorrect workforce numerator by including non-H-1B nonimmigrant workers, which can distort dependent-employer status under the governing wage-and-hour framework.
- Worksite-specific wage analysis is completed for a primary location but omitted for secondary or alternate locations, leaving part of the intended placement without a wage basis.
- Per-beneficiary data sheets are populated from prior petitions, draft notes, or assumptions instead of the current source documents, causing internal inconsistencies.
- Compensation is treated as a single flat amount without analyzing which components count toward the required wage under LCA rules.
- Cross-document mismatches between the position description, worksite list, compensation details, and email or memo instructions are not resolved before drafting.
- Compliance flags are stated generically rather than tied to a specific beneficiary, specific document conflict, and specific filing consequence.
- Advice is given without naming the rule, regulation, or statutory basis that governs the conclusion.

## 3. Legal frameworks / domain conventions that apply

- The LCA must be certified before the related H-1B petition is filed; an uncertaified or missing LCA makes the petition package incomplete under the governing DOL/USCIS process.
- The four core LCA attestations are: payment of the required wage, no adverse effect on working conditions of similarly employed U.S. workers, no strike or lockout, and proper notice to the bargaining representative or posting where required.
- Wage analysis must match the occupational classification and geographic area of each worksite, and each work location used for the placement must have a documented prevailing wage basis under the applicable DOL framework.
- Employer dependency analysis turns on the ratio of H-1B workers to total full-time equivalent employees under the applicable statutory thresholds; only H-1B workers count in the H-1B numerator.
- If the employer is H-1B dependent, additional statutory attestations may be required, including displacement and recruitment-related commitments under the applicable provisions.
- Notice posting must be completed on or before filing and maintained for the required period; electronic notice is permissible only when the regulations allow it.
- The data sheet should capture, at minimum, beneficiary name, title, occupational classification, worksite address(es), offered wage, prevailing wage basis for each worksite, and any compliance issue.
- When a legal conclusion is drawn, identify the authority by statute, regulation, or other recognized rule source rather than stating the conclusion nakedly.

## 4. Analytical scaffolds

1. Workforce compilation: extract total FTEs and H-1B headcount from the current source set; exclude non-H-1B nonimmigrant workers from the H-1B numerator.
2. Dependency analysis: apply the applicable threshold for the employer’s workforce size and determine whether dependent-employer obligations are triggered.
3. Beneficiary-by-beneficiary extraction: for each beneficiary, pull title, role description, classification, worksite(s), and offered wage from the source record.
4. Worksite wage verification: for each listed worksite, confirm a prevailing wage basis exists for the correct occupation and geography; flag any missing or stale basis.
5. Required wage check: compare the offered wage to the higher of the required wage and any actual-wage benchmark reflected in the source materials.
6. Compensation-component review: identify salary, bonus, allowance, stipend, or other elements and classify whether each is properly treated as wage under the governing rules.
7. Cross-document consistency review: compare the LCA draft data against the source documents for naming, title, location, compensation, and timing consistency.
8. Filing-readiness review: confirm that all prerequisites for a complete LCA package are satisfied or flagged for resolution before filing.

## 5. Vertical / structural / temporal relationships

Use a top-down structure: employer-level workforce and dependency analysis first, then one beneficiary section per person, then a consolidated compliance section. Within each beneficiary section, move from identity and role to worksite, then wage basis, then notice/compliance items.

Respect temporal ordering. Filing cannot precede certification; notice timing must be tested against the planned filing date; any worksite-specific wage analysis must reflect the location where the beneficiary will actually work during the relevant period. If the source set reflects multiple dates or placement periods, analyze them separately rather than blending them.

When one fact depends on another, make the dependency explicit. For example, dependency status affects whether extra attestations are needed; worksite location affects the prevailing wage basis; compensation characterization affects whether the offered wage satisfies the required wage.

## 6. Output structure conventions

- Begin with a short memo header identifying the source set reviewed and the beneficiaries covered.
- Include a workforce/dependency section with the calculation shown plainly.
- Provide a separate beneficiary data sheet for each beneficiary.
- Include a compliance checklist or issue log keyed to each beneficiary and to any employer-level filing condition.
- State each issue with:
  - an ordinal severity label chosen from a defined scale at the top;
  - the specific source conflict or missing fact;
  - the controlling authority or rule basis;
  - the practical filing consequence if unresolved.
- End with a Recommended Actions section that assigns each next step to a responsible role and ties it to the filing timeline or regulatory milestone.
- Use clear, fillable, office-ready language suitable for a Word memo; do not use bracketed placeholders except where the source record is genuinely missing.
- Keep the deliverable grounded in the source documents. If a point cannot be confirmed, say so and flag it rather than assuming the answer.
