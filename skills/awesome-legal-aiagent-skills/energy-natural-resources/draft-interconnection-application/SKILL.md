---
name: draft-interconnection-application-hybrid-solar-storage
task_id: energy-natural-resources/draft-interconnection-application
description: Guides completion of a large generator interconnection application for a hybrid solar-plus-storage facility by populating required fields from source documents, flagging regulatory, site-control, technical, and credit-support issues in an internal issues memo, and analyzing available interconnection service options.
activates_for: [planner, solver, checker]
---

# Skill: Draft Large Generator Interconnection Application for Hybrid Solar-Plus-Storage Facility

## 1. Subject-matter triage
- Confirm the governing form, tariff attachment procedures, and any instructions for hybrid resources before filling anything in.
- Determine whether the storage component is grid-charging, generation-only charging, or mixed; treat that as a threshold fact because it can change study treatment, fee treatment, and disclosure obligations.
- Identify whether the project is a single-site filing or spans multiple parcels, and whether any prior filing, withdrawn filing, or prior study exists for the same point of interconnection.
- Separate filing-ready facts from open items that require client confirmation, transmission-provider clarification, or supplemental documentation.

## 2. Failure modes the skill is correcting
- Completing the form from project summaries without checking the tariff-specific instructions for hybrid facilities, causing missing disclosures or misclassified technical inputs.
- Treating the storage block as administratively incidental instead of analyzing whether its charging configuration triggers different queue, study, or fee consequences.
- Overlooking site-control inconsistencies across parcels, especially where lease terms do not align with the interconnection service horizon.
- Omitting a credit-support check or assuming the applicant entity itself satisfies financial qualification without support from the source documents.
- Failing to surface whether prior study data, re-filing history, or affected-system coordination changes the application posture.
- Drafting the issues memo as a general narrative rather than a decision tool that identifies each open point, its basis, impact, and next step.
- Writing the transmittal letter as a summary only, without clearly listing the filing package and any items submitted subject to confirmation.

## 3. Legal frameworks / domain conventions that apply
- FERC large generator interconnection procedures govern queue entry, study processing, and service selection for the project; apply the tariff and related form instructions as the primary authority for each field.
- Hybrid-facility treatment depends on how the storage resource is configured and charged; disclose charging assumptions and flag any need for supplemental study, separate treatment, or provider clarification under the applicable interconnection procedures.
- Site control must be sufficient for the relevant project term; any lease or easement that expires earlier than the expected service period creates a filing risk that should be identified against the form and supporting site documents.
- Creditworthiness and security requirements depend on the applicable tariff standard; if the applicant’s own financial profile is not enough, the filing package should identify the missing support and the likely security mechanism.
- Prior-filing and prior-study provisions may allow limited carryover or disclosure obligations; the source documents should be checked for queue history, withdrawal history, and any study-data reuse conditions.
- Environmental and species consultation status should be disclosed when relevant; pending consultation is not merely background and may affect timing, permitting sequence, and interconnection schedule.
- Generator step-up transformer sizing should be tested against the total project output at full operating mode, including storage discharge if the design contemplates it; undersizing can constrain operations or require redesign.
- Service-type selection should be analyzed in light of project commercialization, financing, and delivery needs, with the tariff text and source documents providing the basis for the recommendation.
- Application fee treatment for hybrid resources may depend on tariff-specific methodology; any ambiguity should be flagged for confirmation rather than assumed.

## 4. Analytical scaffolds
- Read the form, instructions, tariff attachment, and source documents together; do not populate a field until the controlling source for that field is identified.
- For each form field:
  - identify the controlling source document;
  - extract the exact fact or range required;
  - check for internal consistency across documents;
  - note any missing, conflicting, or qualification-dependent information.
- For each parcel or site-control item:
  - identify the parcel;
  - identify the controlling term;
  - compare it to the project’s expected interconnection/service horizon;
  - flag any mismatch or gap.
- For each credit-support item:
  - identify the applicant entity;
  - identify the stated financial qualification or support instrument;
  - compare it to the tariff requirement;
  - flag any shortfall or ambiguity.
- For each technical item:
  - confirm whether the project description, one-line, transformer sizing, charging mode, and operating assumptions are mutually consistent;
  - flag any point where the storage block changes the answer.
- For each open issue in the memo:
  - state the issue;
  - cite the controlling tariff provision, form instruction, or source-document basis;
  - explain the filing or project consequence;
  - recommend the next step.
- Where more than one service option, filing posture, parcel, or history item exists, enumerate the alternatives first, then analyze each one separately rather than collapsing them into a single pass.

## 5. Vertical / structural / temporal relationships
- Map the project structure vertically: parent applicant, project entity, site-control package, technical package, and any security support should align with each other and with the form.
- Map the project temporally: development status, permitting status, consultation status, filing date, study history, and expected commercial operation date should be internally consistent.
- Treat the storage component as temporally and operationally distinct from the generation component where the source documents do so; do not assume identical charging rights, operating limits, or fee treatment.
- If multiple parcels or documents have different end dates or assumptions, identify the earliest expiring or most restrictive item as the practical constraint.

## 6. Output structure conventions
- Produce the completed Form 1-LG as a standalone filing document populated from the source documents, with any supplemental sections needed to make the filing coherent and complete.
- Draft a transmittal cover letter that identifies the filing package, the applicant, the project, the requested interconnection posture, and any enclosed supporting materials.
- Draft a separate internal issues memo clearly marked as internal and not for filing.
- In the issues memo, use a uniform severity scale defined once at the top, and apply it consistently to each issue.
- For each issue entry, include the controlling authority or source basis, the practical impact, and a concrete recommended action.
- Address the comparative service-selection analysis explicitly, including the financing and offtake implications that support the recommendation.
- Close the memo with a Recommended Actions section that assigns the next step to the relevant role and ties it to a filing, consultation, or milestone deadline.
- Before finalizing, verify that the primary filing document is complete and non-empty, and that the cover letter and memo are secondary to the completed application rather than substitutes for it.
