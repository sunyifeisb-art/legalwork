---
name: review-insurance-policy
task_id: real-estate/review-insurance-policy
description: Guides gap analysis of a construction project's insurance program against the governing financing documents by reviewing each policy line by line against the applicable insurance requirements and the project's risk profile, and flagging material coverage gaps.
activates_for: [planner, solver, checker]
---

# Skill: Construction Project Insurance Gap Analysis — Issue Identification Memorandum

## 1. Subject-matter triage

- Identify the governing financing documents, the insurance section, the policy schedule, broker materials, and any project-risk or environmental summaries before evaluating coverage.
- Determine whether the program is a single-project tower or a broader portfolio program; analyze every in-scope policy form that could satisfy a lender requirement, not just the declared primary policy.
- If the source set contains multiple periods, counterparties, project phases, or policy layers, enumerate them first and review each on its own terms before synthesizing gaps.

## 2. Failure modes the skill is correcting

- Comparing the insurance program to generic construction norms instead of the specific lender requirements actually controlling the transaction.
- Treating coverage as present once a line item exists, without checking limits, endorsements, exclusions, deductibles, notice terms, and other lender-driven conditions.
- Reviewing policies in isolation and missing how primary, umbrella, excess, and ancillary coverages interact as a tower.
- Ignoring time-sensitive features such as policy inception, retroactive dates, completion periods, renewal mechanics, and cancellation notice windows.
- Failing to connect site-specific environmental risk to whether the standard construction program is enough for the project.
- Stopping at description of a gap without stating severity, cross-document interaction, and practical consequence.
- Issuing recommendations that do not specify who must act and when the action should occur.

## 3. Legal frameworks / domain conventions that apply

- The financing documents control the required insurance package; the lender may require particular coverages, minimum limits, deductible caps, and administrative deliverables, and non-compliance can trigger a contractual default.
- Standard construction program components may include commercial general liability, builder’s risk, workers’ compensation, employer’s liability, professional liability, umbrella or excess liability, and environmental or pollution coverage where project risk warrants it.
- Additional insured status, waiver of subrogation, and notice of cancellation are common lender protections and must be confirmed in the policy form itself, not inferred from a certificate.
- Builder’s risk is generally evaluated on an all-risk, completed-value basis, with attention to soft costs, flood, earthquake, equipment breakdown, and on-site equipment where the lender or project location makes them relevant.
- Professional liability is especially important for design-assist or design-build scope; claims-made coverage depends on a retroactive date that predates the services and may require extended reporting after completion.
- Umbrella or excess coverage must be checked for follow-form alignment with underlying liability policies and for whether the combined tower satisfies the required total limit.
- Environmental or pollution liability may be required where the site history, excavation profile, or project documentation signals contamination, remediation, or similar exposure.
- Use controlling authority from the governing documents, the policy forms, and any cited broker commentary when stating why a feature is deficient or sufficient.

## 4. Analytical scaffolds

- Start by extracting every insurance requirement from the financing documents and grouping them by coverage type, limit, endorsement, deductible, notice, and administrative obligation.
- For each required coverage type, confirm whether there is a corresponding in-force policy, identify the form, carrier, effective dates, and stated limit, and then compare those terms to the lender requirement.
- For each gap, state:
  - the lender requirement,
  - the policy term or omission that falls short,
  - the scale of the issue using the source documents’ own figures or thresholds,
  - the document or policy provision that interacts with the gap,
  - and the downstream consequence for the borrower, owner, or lender.
- Evaluate the tower as a whole, including whether umbrella or excess coverage actually fills the shortfall created by the primary layer and whether any drop-down or follow-form limitation undermines that assumption.
- Review endorsement language for additional insured, waiver-of-subrogation, and cancellation-notice protections; treat a missing endorsement as a substantive gap even if the policy summary suggests the protection is intended.
- Assess exclusions and sub-limits for features that can nullify otherwise adequate coverage, especially where the lender’s requirement is expressed as a minimum program feature rather than a bare limit.
- Compare policy periods to the project timetable; confirm the insurance remains continuous through the construction period and any extension or wind-down period required by the financing documents.
- Use the environmental or project-risk materials to test whether the standard insurance package leaves an uncovered exposure that the lender would reasonably expect to be addressed.
- Assign each issue a uniform ordinal severity level defined once at the top of the memo, and use that same scale consistently for every entry.
- Close each issue with a recommendation that can be implemented by amendment, endorsement, replacement coverage, waiver request, or lender consent, as appropriate.

## 5. Vertical / structural / temporal relationships

- Primary and excess layers: confirm the underlying policy is valid, the umbrella truly follows form, and the combined tower meets the required level before treating total protection as adequate.
- Policy form and endorsements: an endorsement can override general policy language; where the two conflict, check the endorsement first and the certificate last.
- Coverage and exclusions: a nominally required line of insurance may still fail lender expectations if exclusions, carve-outs, or sub-limits remove the project’s real exposure.
- Retroactivity and project start: for claims-made coverage, a retroactive date after the relevant professional services began creates an uncovered gap at the front end of the project.
- Construction period and renewals: builder’s risk and other time-bound policies must stay in force through the full construction timeline, including any extension period contemplated by the financing documents.
- Risk documentation and coverage fit: if the project record indicates contamination, excavation, or other site-specific hazards, standard forms may need augmentation rather than simple confirmation.

## 6. Output structure conventions

- Draft a memorandum in conventional issue-spotting form with a brief executive summary, a body organized by coverage line, and a closing recommendations section.
- Define the severity scale once near the start, using clear ordinal labels such as Critical, High, Medium, and Low, and apply it uniformly to every issue.
- For each issue entry, include the requirement, the in-force policy position, the gap, the severity, the source interaction that makes it material, and the practical consequence.
- Organize the body by coverage category first, then by subtopic such as limits, endorsements, exclusions, notices, deductibles, or timing.
- Include a dedicated section for action items that states the next step, the responsible role, and the timing anchor from the source documents or, if none exists, the urgency tied to closing or funding.
- Keep the filename exactly as instructed: `insurance-gap-memorandum.docx`.
