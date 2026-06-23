---
name: hls-extract-icf-terms
task_id: healthcare-life-sciences/extract-key-terms-from-informed-consent-form
description: Reviews an informed consent form against applicable informed-consent requirements, any required privacy authorization, institutional review board contact requirements, conflict-of-interest disclosure expectations, and cross-document consistency to identify missing elements, omissions, and discrepancies.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Terms from Informed Consent Form — FDA Regulatory Compliance

## 1. Subject-matter triage (only if applicable)

- Treat this as a document-comparison and compliance-review task: extract the operative consent terms, test them against the governing consent rule set, and compare them with the protocol synopsis, IRB approval letter, and inspection checklist for inconsistencies.
- If the source set contains only one consent form, say so explicitly and proceed with single-document review; if multiple companion documents exist, review each against the consent form separately before drawing combined conclusions.
- Preserve a clean split between pure extraction, regulatory adequacy, and cross-document discrepancy analysis.

## 2. Failure modes the skill is correcting

- Required consent elements are summarized too loosely, causing missing disclosures, incomplete voluntariness language, or weak descriptions of risks, benefits, alternatives, confidentiality, and contact information to be treated as acceptable.
- Privacy authorization is missed or mischaracterized when protected health information is used or disclosed in the research record.
- Discrepancies across the informed consent form and companion study documents are not surfaced, especially where they change participant expectations about procedures, visits, compensation, injury coverage, or data use.
- IRB contact details and participant-rights contact information are treated as boilerplate instead of being checked for completeness and usability.
- Conflict-of-interest disclosures are overlooked even when the study materials imply a sponsor relationship or other financial tie that should be disclosed.
- Issue writeups stop at identification and do not state why the discrepancy matters operationally or regulatorily.
- Findings are presented without a clear severity hierarchy, making it hard to separate critical gaps from lower-risk drafting defects.

## 3. Legal frameworks / domain conventions that apply

- Review the consent package element by element against the informed-consent content requirements in 21 CFR 50.25, including any additional elements that are triggered by the study design or disclosure topics in the source set.
- Where protected health information is used or disclosed, assess the presence and adequacy of a HIPAA authorization or an equivalent standalone authorization document if one is required by the study’s privacy workflow.
- Verify that the consent language states voluntariness, no penalty for refusal, and the right to discontinue participation, consistent with the baseline informed-consent standard in 21 CFR 50.20 and 21 CFR 50.25.
- Confirm that the form provides a usable contact route for questions about the research and for questions about participant rights, consistent with institutional and IRB expectations reflected in the source documents.
- If the source documents address conflicts of interest or sponsor relationships, test whether the disclosure is included and not contradicted elsewhere in the packet.
- Compare injury-compensation and treatment language across the consent form and companion materials for internal consistency; if the study has multiple descriptions of the same topic, the most protective reading should be tested against each version.
- Treat document inconsistency as a substantive compliance issue when it changes the participant-facing understanding of visits, procedures, compensation, withdrawal rights, data sharing, or injury coverage.
- Cite the controlling authority for each legal proposition relied on, using the source documents’ terminology where they identify the governing rule, and otherwise using the applicable regulation or standard by name and section.

## 4. Analytical scaffolds

1. Build an element-by-element extraction table for the consent form:
   - study purpose
   - procedures and duration
   - foreseeable risks or discomforts
   - expected benefits
   - alternative procedures or treatments
   - confidentiality and data use
   - injury compensation/treatment
   - contacts for questions and rights
   - voluntary participation and withdrawal
   - any additional required elements triggered by the packet
2. For each element, mark it present, partially present, absent, or inconsistent with the companion documents; do not collapse distinct deficiencies into one general note.
3. For each gap or discrepancy, state:
   - the controlling rule or policy basis
   - the specific source text or companion document that creates the conflict
   - the practical consequence for enrollment, subject understanding, privacy compliance, or IRB acceptability
4. When more than one companion document addresses the same topic, compare them separately to the consent form before synthesizing the discrepancy.
5. Where a term appears in the consent form but is missing in the protocol synopsis, IRB approval letter, or inspection checklist, flag whether the omission is likely a drafting defect, a process defect, or both.
6. For privacy-related language, distinguish between disclosure of confidentiality protections and a true authorization to use or disclose protected information.
7. For participant-rights or IRB contact information, verify usability, not merely presence; incomplete names, missing numbers, or vague office references are defects.
8. Apply an explicit severity rating to every finding using a simple ordinal scale defined once at the top of the report, and keep the scale consistent across all issues.
9. End each finding with a concrete remediation step tied to the responsible study role and a timing anchor drawn from the review context.

## 5. Vertical / structural / temporal relationships (only if applicable)

- If the protocol synopsis, IRB approval letter, and inspection checklist differ on the same term, treat the discrepancy as a vertical control issue: protocol-level description, IRB authorization, and subject-facing consent language must align.
- Check whether the consent form uses a different temporal frame than the protocol or checklist for visits, procedures, follow-up, injury reporting, withdrawal, or data retention; even small timing shifts can change the regulatory reading.
- If the source set contains multiple versions or revisions, identify which version is operative and whether later documents supersede earlier phrasing.
- When compensation, visit burden, or injury language changes across documents, assess the downstream effect on subject expectations, site operations, and review-body acceptance.
- If there is a mismatch between what the participant is told and what the protocol describes, treat the participant-facing text as needing correction unless the source set clearly resolves the inconsistency.

## 6. Output structure conventions

- Produce a formal compliance report suitable for conversion to `.docx`, with a clear title, source list, and a short methodology note stating that the review is based on the provided document set.
- Use a defined severity legend near the top, such as Critical / High / Medium / Low, and apply it uniformly to every issue entry.
- Organize the body into conventional sections:
  - Consent element extraction
  - Compliance review against 21 CFR 50.25 and related requirements
  - Cross-document discrepancy review
  - Risk-ranked findings
  - Recommended actions
- For each finding, use a compact issue format:
  - Severity
  - Issue
  - Governing authority
  - Source comparison
  - Impact
  - Recommended correction
- Keep the extraction and the compliance findings separate; do not bury discrepancies inside a narrative summary.
- Include a closing Recommended Actions section with imperative steps assigned to the relevant study owner, IRB contact, sponsor-side reviewer, or regulatory lead, and tie each step to the review milestone or resubmission point.
- Do not quote source text at length; surface only the minimum verbatim language needed to anchor a discrepancy or missing element.
