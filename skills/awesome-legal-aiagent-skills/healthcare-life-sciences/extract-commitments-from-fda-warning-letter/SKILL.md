---
name: hls-extract-fda-warning-letter-obligations
task_id: healthcare-life-sciences/extract-commitments-from-fda-warning-letter
description: Extract compliance obligations from a warning letter and supporting inspection materials into a structured spreadsheet register with required columns, categorized obligations, phased timeline, and a summary/risk assessment tab.
activates_for: [planner, solver, checker]
---

# Skill: Extract Commitments and Compliance Obligations from FDA Warning Materials

## 1. Subject-matter triage (only if applicable)

- Treat the warning letter as the anchor document and every supporting FDA or company document as a source for additional obligations, timing, mitigation, or risk context.
- Separate obligations that are expressly stated from those that are implied by the cited deficiencies, remediation needs, or follow-on regulatory consequences.
- If multiple products, facilities, operations, or inspection themes are present, enumerate each distinct scope item first and extract obligations for each without collapsing them into a single generic row.

## 2. Failure modes the skill is correcting

- The deliverable is treated as a narrative summary instead of a spreadsheet register with one obligation per row and a separate summary/risk tab.
- Distinct regulatory observations are merged together, which obscures the source, deadline, and remediation path for each obligation.
- Implicit duties created by a cited deficiency are missed, including retrospective review, escalation, validation, verification, remediation tracking, and communication obligations.
- Priority is described loosely instead of using a uniform ordinal severity scale that is applied to every obligation.
- The analysis stops at identification and does not translate each obligation into an owner, timing anchor, dependency, and risk consequence.
- Required fields are left blank or generalized, making the register unusable for compliance follow-up.

## 3. Legal frameworks / domain conventions that apply

- Treat each numbered deficiency or observation in the FDA warning materials as a separate compliance event with its own extraction entry unless the document clearly ties multiple items to the same operative obligation.
- Extract both explicit commitments and regulatory obligations, including actions the company states it will take, actions FDA requires or expects, and actions that are necessary consequences of the cited deficiency.
- Where the source materials reference quality-system, complaint-handling, adverse-event, labeling, reporting, manufacturing, or supplier-control problems, identify the governing regulatory hook from the documents and carry it into the register.
- If the materials implicate products already in commerce or use, assess whether field correction, removal, recall, or other customer-facing action is an extracted obligation.
- If the materials implicate pending regulatory submissions, responses, or reviews, capture any obligation to notify, clarify, or manage the status impact.
- If remediation relies on a third party, include the resulting diligence, independence, qualification, or oversight obligation as a separate row when it is materially distinct.
- Use the citation format that best matches the source documents and preserve the document’s own regulatory references when stated.

## 4. Analytical scaffolds

1. Build the register as the primary work product, not the summary. One obligation, one row, one owner, one timing anchor.
2. For every extracted item, capture: source document and location, regulatory citation, plain-language obligation, category, priority, deadline or timeline, responsible party, and dependencies or risks.
3. Apply a uniform severity scale to every row: Critical, High, Medium, Low.
4. Determine severity by enforcement or safety urgency, temporal proximity, and whether the obligation is a gating step for broader remediation.
5. Classify each obligation into an industry-conventional category such as Regulatory Submissions, Corrective Action, Quality System, Supplier Management, Reporting, Labeling, or Field Safety.
6. Extract implicit obligations separately from explicit ones, including retrospective review of affected records, impact assessment for pending submissions, and evaluation of field action needs.
7. In the summary/risk tab, group obligations into immediate, near-term, and later-phase workstreams, then flag the highest-risk items and the main operational bottlenecks.
8. Do not infer unsupported dates or arithmetic; if the source gives no exact deadline, use the closest stated milestone or a relative timing anchor tied to the regulatory response cycle.
9. When multiple documents touch the same issue, cross-link them so the register shows how the obligation flows across the source set and where it is reinforced or expanded.
10. For every row, connect the obligation to a downstream consequence: enforcement exposure, product risk, submission impact, remediation burden, or follow-on review.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If the source set contains both company commitments and FDA directives, place the company’s promised action and the corresponding regulatory obligation in the same issue family but keep them as separate rows when their timing, owner, or scope differs.
- If a remediation path has a logical sequence, reflect that sequence in the timeline fields so the register shows prerequisite actions before validation, validation before closure, and closure before sustained monitoring.
- If an obligation depends on sampling, testing, investigation, or retrospective review, record that dependency explicitly and indicate the risk of delay or incomplete scope.
- If multiple operating sites, product lines, or record sets are implicated, preserve the vertical separation so each affected area can be tracked independently.

## 6. Output structure conventions

- Produce `compliance-obligation-register.xlsx` as the primary deliverable.
- Include a register tab with one fully populated obligation per row and all required columns completed.
- Include a summary and risk assessment tab that states the overall obligation universe, the phased timeline, and the highest-risk obligations.
- Use clear, conventional spreadsheet headers that support compliance tracking and follow-up.
- Every obligation row should be self-contained and understandable without reading the summary tab.
- Do not leave required fields blank; if a field is not stated in the source, use a tightly bounded, source-faithful inference rather than an empty cell.
- Keep the summary concise but operational: identify immediate actions, near-term remediation, later-stage system improvements, and any material third-party or submission-related concerns.
