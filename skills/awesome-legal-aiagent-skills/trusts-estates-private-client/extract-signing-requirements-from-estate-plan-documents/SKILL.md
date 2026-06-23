---
name: extract-signing-requirements-from-estate-plan-documents
task_id: trusts-estates-private-client/extract-signing-requirements-from-estate-plan-documents
description: Closes the gap where agents produce generic signing checklists without identifying signatories who cannot complete required steps at the ceremony, flagging document-specific formal requirements and applying witness disqualification rules to named witnesses.
activates_for: [planner, solver, checker]
---

# Skill: Extract Signing Requirements from Estate Plan Documents — Signing Ceremony Checklist

## 1. Subject-matter triage

- Treat the package as a document-by-document execution exercise, not a general estate-planning summary.
- Separate what can be signed at the ceremony from what must be completed beforehand or elsewhere.
- Identify every required signer, witness, notary, officer, agent, and institutional approver called for by the documents.
- If the package spans multiple governing jurisdictions, analyze each document under the law or formalities that control that document.

## 2. Failure modes the skill is correcting

- Listing signature requirements without identifying which signatories will not be physically present and therefore cannot complete required steps at the ceremony; remote or absent signatories need separate execution logistics.
- Treating notarization, signature authentication, or third-party certification as if it can always be handled at the table; some steps must be obtained from the correct outside provider before or after the ceremony.
- Missing that an institutional fiduciary, corporate signer, or similar entity may need internal authority confirmation before an officer can sign; confirm delegated authority in advance.
- Failing to apply witness disqualification rules to named witnesses; beneficiaries, relatives, healthcare providers, employees, and other disqualified persons may be ineligible depending on the instrument and governing law.
- Overlooking that a personal property memorandum must match the will’s incorporation language and formal requirements; an inconsistent memorandum may be ineffective.
- Collapsing all documents into one generic checklist instead of identifying document-specific execution steps and conflicts.

## 3. Legal frameworks / domain conventions that apply

- Will execution formalities: identify the testator’s signature requirement, witness count, presence requirements, self-proving affidavit steps, and any interested-witness concerns under the governing law cited in the documents or applicable practice.
- Revocable trust execution and trustee acceptance: distinguish settlor execution from trustee acceptance; determine whether each trustee must sign separately and whether notarization or officer authority evidence is required.
- Durable power of attorney execution: confirm principal signature requirements, any witness or notarization requirement, and whether agent acknowledgments or acceptance forms must be signed separately.
- Healthcare directive formalities: apply the document’s witness rules and any statutory disqualification rules governing who may witness; check for separate notary language if the directive uses it.
- Signature authentication and bank-style certification: if a form requires a signature guarantee, medallion-type authentication, or similar third-party certification, treat that as an outside logistics item, not a ceremony task.
- Life-insurance or beneficiary-change formalities: if the documents require identification copies, consent from an irrevocable beneficiary, or similar preconditions, flag them as pre-ceremony items.
- Deed and transfer formalities: identify the jurisdiction-specific recording or transfer requirements, including any parcel descriptions, transfer certificates, affidavits, or ancillary forms referenced in the package.
- Personal property memorandum incorporation: confirm the memorandum format, incorporation-by-reference language, and any limiting conditions in the will before treating the memorandum as operative.
- Governing authority should be cited where the source documents specify it; if the source is silent, use the controlling statutory or practice authority for the relevant execution requirement.

## 4. Analytical scaffolds

1. List each document in the package separately before analyzing it.
2. For each document, identify:
   - required signatories,
   - required witnesses,
   - notarization or acknowledgment requirements,
   - any officer or institutional approval condition,
   - any jurisdiction-specific or institution-specific execution step.
3. For each required signatory, determine whether the person is confirmed to attend in person, attend remotely, or be absent; flag any required signer who cannot complete the step at the ceremony.
4. For each witness named or contemplated by a will or healthcare directive, test the witness against the applicable disqualification rule set; flag any witness who is ineligible or questionable and note replacement needs if the document or law requires it.
5. For each requirement that cannot be completed at the ceremony by design, classify it as a pre-ceremony logistics item and identify what must be obtained, from whom, and before what event.
6. For each deed or transfer instrument, cross-check the document’s stated form requirements against the applicable recording or transfer formalities.
7. For any memorandum, schedule, consent form, or ancillary certificate, check whether it is incorporated, referenced, or required by the primary instrument and whether it is in the correct form.
8. Reduce each problem to a concrete issue entry with severity, impact, and action; avoid generic observations.

## 5. Vertical / structural / temporal relationships

- The attendance plan or ceremony logistics email is the key cross-reference for determining who can actually sign on the day.
- A signer’s role in one document may create downstream constraints in another document; keep trust, will, power of attorney, deed, and consent requirements separate unless the source links them.
- Institutional signers often need proof of authority that exists outside the signing room; treat that authority as a prerequisite, not a ceremonial formality.
- Remote execution, split execution, and delayed acknowledgment can be valid solutions, but only if the governing formalities permit them and the document does not require simultaneous presence.
- Where witness eligibility depends on family, beneficiary, provider, or agent status, those relationships control the analysis even if the person is otherwise available.

## 6. Output structure conventions

- Produce a single signing requirements checklist.
- Use a conventional structure: an attendance summary, a document-by-document execution matrix, an issues list, and a pre-ceremony action list.
- At the top of the issues list, define a simple ordinal severity scale and use it consistently for every flagged item.
- In the document-by-document matrix, give each document its own row or subsection with signatories, witnesses, notarization, and special conditions.
- In each issue entry, state the problem, the governing rule or authority relied on, the consequence for execution, and the recommended fix.
- End with a Recommended Actions section that assigns each action to a responsible role and ties it to a timing anchor such as before the ceremony, before recording, or before circulation to signers.
- If a document requirement depends on an external authority, identify that authority by name and section or equivalent citation when available.
- Keep the checklist operational: prioritize what must happen, who must do it, and what can block valid execution.
