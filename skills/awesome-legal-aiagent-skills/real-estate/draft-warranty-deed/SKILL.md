---
name: draft-warranty-deed
task_id: real-estate/draft-warranty-deed
description: Guides drafting of a general warranty deed for a commercial property conveyance by reconciling the legal description, permitted exceptions, grantor authority, and chain of title across source materials, and flagging open title issues in a companion cover memo.
activates_for: [planner, solver, checker]
---

# Skill: Draft General Warranty Deed for Commercial Property Conveyance

## 1. Subject-matter triage (only if applicable)

- Treat the deed as the primary deliverable and the cover memo as secondary; complete the deed first, then use the memo to capture unresolved issues and recommended next steps.
- If the source set contains multiple versions of a legal description, exception schedule, signature page, or vesting deed, reconcile them before drafting and do not guess.
- If the transaction materials do not give a single clear answer on grantor identity, authority, or permitted exceptions, flag the ambiguity rather than smoothing it over.

## 2. Failure modes the skill is correcting

- Baseline drafts the deed from a property description without confirming that the legal description in the operative source materials matches the survey and title materials; discrepancies in metes and bounds or lot references are a title defect that must be resolved before recording.
- Baseline does not fully reconcile the title commitment's exception schedule with the deed's subject-to clause, omitting permitted encumbrances or including exceptions that should have been resolved.
- Baseline does not verify the grantor's legal name and authority structure against the grantor's organizational documents, producing a deed that may be unacceptable to the title insurer.
- Baseline omits the companion cover memo, which must flag any open title issue, discrepancy between source materials, or pre-recording curative requirement.
- Baseline treats title drafting as a single-pass task; in practice, each material discrepancy must be checked against the closing package, the vesting chain, and any recorded instruments before execution.

## 3. Legal frameworks / domain conventions that apply

- General warranty deed: the grantor warrants title against claims arising by, through, or under the grantor and against claims of all persons generally; the warranty survives closing and binds the grantor's successors.
- Texas deed drafting: use the customary Texas statutory and recordable deed conventions, including a present conveyance, sufficient property description, and acknowledgment suitable for county recording.
- Legal description: the deed must contain a complete and accurate legal description, typically drawn from the current survey and the operative title materials; the description should be consistent across the drafting inputs.
- Subject-to clause: the deed conveys title subject to permitted exceptions listed in the title materials; the permitted exceptions in the deed must be consistent with those the buyer has agreed to accept in the transaction documents.
- Grantor identification and authority: the grantor must be identified by exact legal name, including entity type and jurisdiction of formation; an entity typically conveys through an authorized signatory whose capacity is reflected in the execution and acknowledgment.
- Chain of title reference: the deed should reference the prior instrument by which the grantor acquired title; this practice facilitates title search and may be required by local recording practice.
- Consideration recital: the deed must include a consideration recital; the stated consideration may be nominal, with the actual purchase price reflected elsewhere in the closing materials.
- Tax statement notice: many jurisdictions require the deed to state the grantee's address for tax notice purposes; verify the applicable jurisdiction's requirement.
- Acknowledgment and notarization: the deed must be acknowledged before a notary public in compliance with the applicable state's statutory form; the notary's commission expiration must be confirmed.
- Recording: the deed must be in recordable form under the applicable county's recording requirements; some counties impose size, margin, and font requirements.
- If local practice or the source documents identify a specific controlling form, recording instruction, or statutory deed language, follow that authority rather than a generic template.

## 4. Analytical scaffolds

- Confirm the grantor's and grantee's full legal names and addresses from the drafting instructions and transaction materials; confirm the grantor's legal name matches the vesting deed in the chain of title.
- Extract the legal description from the survey materials; confirm it matches the description in the title materials and the property description in the transaction documents; flag any discrepancy for curative action.
- Review the title materials' exception schedule; identify all exceptions that are to be included in the subject-to clause; confirm the buyer has agreed to accept each exception; flag any exception that requires curative action before recording.
- Confirm the grantor's authority structure: for an entity, confirm the authorized signatory's capacity from the organizational documents or the drafting instructions.
- Confirm the reference to the prior deed or other source of title in the chain of title materials.
- Confirm any state-specific requirements (tax notice address, specific warranty language, recording requirements) from the jurisdiction-specific materials.
- For the cover memo, organize unresolved matters by issue and track: the source mismatch or open item, the relevant closing or recording consequence, and the action needed before execution or recording.
- When multiple source documents address the same point, identify the controlling source and note any inconsistency rather than merging them silently.
- Where the source set is silent on a required drafting point, use the standard Texas commercial deed convention and flag the omission if it affects recordability or title approval.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Survey materials and title materials consistency: the legal description in the deed must match both the survey and the title materials; if the survey was prepared after the title materials were issued, confirm the title company has reviewed and approved the updated legal description.
- Prior deed and chain of title: the grantor's legal name in the deed must match the name reflected in the prior conveyance; any name discrepancy is a cloud on title requiring a correction instrument or affidavit.
- Execution and recording sequence matters: confirm the deed is signed, acknowledged, and in recordable form before delivery for closing, and do not treat later curative items as cured unless the source materials expressly say so.
- If the closing package contains updates after the title commitment date, check whether those updates affect exceptions, authority, or description before finalizing the deed.

## 6. Output structure conventions

- Warranty deed: draft a complete Texas general warranty deed in recordable form, including caption, grant clause, consideration recital, legal description, subject-to language for permitted exceptions, warranty clause, tax notice language if applicable, signature block, and notarial acknowledgment.
- Cover memo: provide a concise closing memo identifying each open title issue, the source documents that create or resolve it, the practical impact on execution or recording, and the next action needed.
- Use clear internal headings that reflect customary deed and closing-memo organization, not a checklist copied from the rubric.
- Keep the deed operative, not explanatory; keep the memo advisory, not argumentative.
- Confirm in the drafting workflow that the deed file is populated first and that the memo does not replace the deed as the primary deliverable.
- Before finalizing, ensure each deliverable is complete, internally consistent, and tailored to the Texas commercial closing materials provided.
