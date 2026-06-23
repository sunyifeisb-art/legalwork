---
name: identify-issues-in-consular-processing-packet
task_id: immigration/identify-issues-in-consular-processing-packet
description: Pre-interview issue review of a consular processing packet where the analysis must assess document completeness, application consistency, inadmissibility-related concerns, and administrative processing risk factors using severity ratings.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Consular Processing Packet

## 1. Subject-matter triage

- Treat the packet as a pre-interview risk review for an approved employment-based immigrant visa case.
- Identify whether the file includes only the principal applicant or also derivative applicants, because each person may require separate forms, civil documents, and validity checks.
- If the source set contains multiple applicants, multiple document versions, or multiple chronology points, enumerate them first and analyze each separately rather than blending them into one generalized review.

## 2. Failure modes the skill is correcting

- Agents confirm that forms are present but do not cross-check disclosures against the rest of the packet, missing inconsistencies that can become interview issues.
- Agents read criminal, immigration, or other legally significant disclosures in isolation and fail to test whether other records in the packet suggest an undisclosed matter.
- Employment, education, and activity history are reviewed section-by-section instead of as a timeline, so unexplained gaps, overlaps, or contradictions go unnoticed.
- Administrative processing risk is treated as a single bucket instead of being broken into specific triggers that can be cured before the interview.
- Document validity issues are missed because the review checks existence, not currency, translation, signature, edition, or applicant-specific applicability.
- Derivative processing defects are overlooked when the principal’s packet is complete but a family member’s required filing, civil document, or identity document is missing or inconsistent.

## 3. Legal frameworks / domain conventions that apply

- Consular processing is an interview-centered adjudication in which packet deficiencies can lead to refusal, requests for evidence, or administrative processing.
- Material misrepresentation analysis turns on whether a misstatement or omission could affect the officer’s decision under the governing visa standards; the analysis is driven by the scope of the question asked, not the applicant’s subjective view of relevance.
- Disclosure questions on immigrant visa forms are commonly broader than an applicant expects; an arrest, charge, prior status issue, or other legally significant event may need to be disclosed even if later dismissed, expunged, or characterized as minor.
- Employment-based immigrant visa processing requires a consistent narrative across petition materials, civil documents, the visa application, and any supporting records that speak to the applicant’s identity, qualifications, work history, and admissibility.
- Administrative processing is a delay mechanism, not a merits conclusion; common triggers include unexplained history gaps, security/name-check issues, medical inadmissibility concerns, and incomplete or inconsistent supporting documentation.
- Civil-document conventions matter: passports, police certificates, birth and marriage records, translations, apostilles, and document expiration rules must be checked for each applicant and each jurisdictional requirement.
- If an affidavit of support or financial sponsorship document appears in the file, it must be reviewed for completeness, correct execution, and sufficient supporting evidence under the applicable form requirements.

## 4. Analytical scaffolds

1. Packet inventory check
   - List every document by applicant and by document type.
   - Mark each item as present, missing, expired, inconsistent, or needs correction.

2. Disclosure cross-reference
   - Compare application answers against the rest of the record for any potentially disclosable criminal, immigration, identity, or other legally significant matter.
   - Flag omissions, internal contradictions, and vague answers that do not square with the supporting documents.

3. Chronology build
   - Construct a chronology for the relevant lookback period covering employment, education, residence, travel, and other activity.
   - Identify gaps, overlaps, unaccounted-for periods, and mismatches between dates in different documents.

4. Admissibility and interview risk review
   - Assess whether any issue could trigger inadmissibility analysis, a document request, or administrative processing.
   - Separate the trigger, the supporting record, and the likely interview consequence.

5. Civil-document validity review
   - Verify identity, relationship, and status documents for currency, translation, certification, and jurisdictional sufficiency.
   - Confirm that derivative documents align with the principal’s family narrative and filing posture.

6. Financial / sponsorship review
   - If a sponsorship or financial support form appears, verify completeness, signature, version, and accompanying evidence.
   - Test whether the supporting evidence matches the required sponsor relationship and timing.

7. Visa-availability and case-posture check
   - Confirm that the case posture fits immigrant visa processing and that any required priority-date or category-related condition is satisfied from the materials provided.
   - Flag any mismatch between the petition posture and the consular packet contents.

## 5. Vertical / structural / temporal relationships

- Track issues vertically from petition materials to the immigrant visa application to civil documents to interview preparation notes; a problem in one layer often creates a downstream interview risk in another.
- Track issues temporally across the relevant lookback window, not just at the filing date, because older events can remain disclosable or explain current admissibility concerns.
- Track issues by person: principal applicant first, then each derivative applicant, then any shared family-document dependency that affects more than one applicant.
- When a document from one part of the packet supplies facts that conflict with another part, prioritize the conflict over the individual document’s facial completeness.

## 6. Output structure conventions

- Use an issue memo format organized by severity: Critical, High, Medium, Low.
- Define the severity scale once and apply it consistently to every issue.
- For each issue, state:
  - the severity level,
  - the source documents or record points that conflict,
  - the legal or procedural reason the issue matters,
  - the likely consular consequence,
  - the concrete pre-interview fix or follow-up.
- Every issue description should do more than identify the defect: connect the defect to the governing admissibility, disclosure, document-validity, or processing rule, and explain why it matters for the interview outcome.
- Include a dedicated administrative-processing risk discussion that breaks out each distinct trigger and the documentation needed to reduce delay risk.
- End with a Recommended Actions section that assigns each action to a responsible role and ties it to an interview-prep or filing deadline.
- Include a concise document checklist appendix showing status for required items as present, missing, expired, inconsistent, or needs correction for each applicant.
