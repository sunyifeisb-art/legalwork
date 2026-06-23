---
name: extract-encumbrances-from-title-survey
task_id: real-estate/extract-encumbrances-from-title-survey
description: Guides preparation of an encumbrance summary report by systematically cataloguing title exceptions and survey-disclosed encumbrances, assessing project compatibility, and outlining resolution steps for each material item.
activates_for: [planner, solver, checker]
---

# Skill: Extract Encumbrances from Title Survey — Encumbrance Summary Report for Wind Farm Acquisition

## 1. Subject-matter triage
- Treat this as a multi-source title-and-survey extraction exercise, not a pure title rundown.
- Build the encumbrance set from the title commitment, survey notes, surface lease schedule, seller affidavit, and surveyor cover letter together.
- If the source set contains multiple parcels, leases, exceptions, or disclosures, enumerate them all before analysis and keep the same item list through the report.
- If a source document is absent or incomplete, flag the gap as a reporting limitation and identify the affected items rather than guessing.

## 2. Failure modes the skill is correcting
- Cataloging only title exceptions and missing survey-disclosed or affidavit-disclosed matters.
- Describing encumbrances without tying each one to the wind project’s siting, access, construction, operations, or financing needs.
- Treating every item as equally important instead of sorting by severity, curability, and project impact.
- Failing to cross-check one document against another, which leaves hidden conflicts between title, survey, lease terms, and seller disclosures.
- Omitting a concrete next step for matters that need payoff, release, amendment, endorsement, waiver, redesign, or schedule management.
- Summarizing issues in narrative form without a consistent entry structure that can be reviewed, tracked, and actioned.

## 3. Legal frameworks / domain conventions that apply
- Read title commitment exceptions as legal title limitations, not as a complete list of project risks.
- Use ALTA/NSPS survey conventions to identify boundary issues, encroachments, easements, setbacks, access constraints, possession conflicts, and acreage or location discrepancies.
- Treat conservation restrictions as likely durable land-use limitations; analyze whether the project can be redesigned, consented, or otherwise cured.
- Treat tax liens, judgment liens, mechanic’s liens, and similar monetary liens as potential clouds on title; identify the likely real-property or equity-level cure path.
- Treat agricultural valuation or similar special assessment regimes as potential rollback-tax exposure when land use changes.
- Treat surface lease terms as operative project controls for parcel scope, permitted use, assignment, transfer, access, maintenance, and term mismatch.
- Treat aviation-related determinations or surveyor comments as timing-sensitive; confirm current status before construction or turbine installation.
- Treat long-standing use patterns or visible access routes as potential unrecorded easement exposure even if not expressly listed in title materials.
- Use standard real-estate diligence conventions: record the source, identify the affected parcel or area, state the restriction, explain project impact, classify severity, and state the cure path.

## 4. Analytical scaffolds
- First, inventory every encumbrance or issue by source document: title commitment, survey, lease schedule, seller affidavit, and surveyor cover letter.
- Then consolidate duplicates across sources so each distinct encumbrance appears once, with all supporting references attached.
- For each item, capture the legal nature of the burden, the affected parcel or area, the recording or document reference if available, and any spatial or operational detail from the survey.
- For each item, assess whether it affects:
  - title ownership or insurability,
  - construction footprint or turbine placement,
  - access, ingress/egress, or maintenance routes,
  - operational use, height, setback, or setback-like constraints,
  - financing, transfer, or closing deliverability.
- For every issue, close the analysis with three moves:
  - measure the issue against the source record where a scale exists,
  - cross-reference the other document(s) that interact with it,
  - state the downstream consequence for the transaction or project.
- Assign every item an ordinal severity label using one consistent scale defined at the top of the report, and use that same scale for all entries.
- Distinguish between blocking items, items that require curative action, items that can be accepted or insured over, and informational items.
- For any item requiring follow-up, specify the likely cure or management step: payoff, release, subordination, amendment, endorsement, waiver, redesign, escrow, indemnity, or timing control.
- If a source document indicates a deadline, expiration, renewal date, or closing condition, carry that timing into the recommended action.

## 5. Vertical / structural / temporal relationships
- Compare survey geometry to title and lease rights: if the survey shows improvements, access routes, or easements outside the rights described in the title or lease materials, flag the mismatch.
- Compare lease term and project schedule: if lease duration, renewal rights, or assignment restrictions do not align with construction or operating horizon, flag the mismatch as a transaction risk.
- Compare restrictions to turbine layout and construction sequence: if a restriction affects height, setback, disturbance, or access, assess whether redesign or phased cure is required.
- Compare current status to future milestones: if an approval, determination, consent, or renewal may lapse before closing or construction, identify the lead-time risk.
- Compare seller disclosures to title coverage: if the affidavit discloses an encumbrance or defect not shown elsewhere, treat it as a separate diligence item until resolved.

## 6. Output structure conventions
- Draft a true encumbrance summary report, not a source-by-source note dump.
- Use a conventional structure: brief executive summary, defined severity legend, organized issue table or equivalent, then concise item-by-item analysis, then recommended actions.
- For each entry, include:
  - severity,
  - source document(s),
  - parcel or affected area,
  - concise description of the encumbrance,
  - project compatibility assessment,
  - cross-referenced source interactions,
  - recommended resolution or management step.
- Keep the report action-oriented: every material issue should end with a clear disposition and next step.
- If an item is likely curable only after closing, say so and identify the mechanism that would bridge the gap.
- End with a Recommended Actions section that assigns action verbs, the responsible role, and the timing anchor tied to closing, construction start, or another document-based milestone.
- Follow the task instructions exactly for the output filename: `encumbrance-summary-report.docx`.
