---
name: review-board-resolutions-certifications
task_id: corporate-ma/review-board-resolutions-certifications
description: Guides review of a merger closing document set to identify defects in board resolutions, closing certifications, and merger authorizations, with corrected document drafting and a correspondence letter to opposing counsel.
activates_for: [planner, solver, checker]
---

# Skill: Merger Closing Document Review and Correction

## 1. Subject-matter triage (only if applicable)

- Treat the work as a closing-set review for a forward triangular merger: first confirm the transaction structure, then test each authorization, certification, and closing document against that structure.
- If multiple entities or closing dates appear in the source set, enumerate them before analysis and review each against the same merger path.
- Separate purely clerical defects from defects that affect authority, validity, or closing deliverability; the latter drive drafting and correspondence.

## 2. Failure modes the skill is correcting

- Individual document defects are flagged without determining whether the same defect recurs across the closing set and signals a systemic drafting or authorization problem.
- Resolutions are checked for substance but not for process, leaving quorum, notice, waiver, and vote mechanics untested.
- Certifications are accepted at face value without cross-checking the certified facts against the underlying organizational record and executed closing papers.
- Stockholder approval is treated in isolation instead of being reconciled with the charter, bylaws, merger agreement, and any required consent mechanics.
- The merger subsidiary’s authority is overlooked, even though the forward triangular structure depends on its valid approval of the transaction.
- Defects are described without tying them to the downstream closing consequence, so the user cannot tell which issues block closing, require amendment, or merely merit cleanup.
- Document fixes are suggested without indicating the exact corrective action for each instrument or how the correction propagates to related documents.

## 3. Legal frameworks / domain conventions that apply

- Forward triangular merger mechanics require the merger subsidiary to merge into the target, with the target surviving as a subsidiary of the acquirer; all closing authorizations must match that structure.
- Corporate authorization must be tested under the applicable corporate statute and the governing organizational documents, including board approval authority, stockholder approval thresholds, and any class-vote or consent requirements.
- Board action should reflect the applicable statutory rules for board meetings, written consents, quorum, and approval formalities under the governing corporate law.
- Stockholder written consent must comply with the applicable corporate statute and the entity’s certificate or charter provisions governing action by consent.
- Officers’ certificates should certify only facts that can be verified from the organizational record, good standing evidence, and executed transaction documents.
- Secretary’s certificates should attach the currently effective governing documents and the correct resolutions or consents, without stale or incomplete exhibits.
- Incumbency certificates should identify authorized signatories and specimen signatures that match the signatories actually used on the closing set.
- Closing checklists should reflect deliverable ownership, status, dependencies, and any defect-driven rework needed before close.
- The correspondence letter to opposing counsel should be professional, precise, and limited to the document issues requiring correction.

## 4. Analytical scaffolds

- Start by listing the documents in scope and classifying each as authorization, certification, checklist item, or correspondence input.
- For each document, test in order: correct party names, correct transaction structure, correct authority source, correct execution mechanics, and correct exhibit / attachment set.
- Review board resolutions for: correct approval of the merger structure, correct identification of the parties, proper delegation to officers, and evidence of quorum and vote or written consent.
- Review the stockholder written consent for: correct approving holders, correct approval threshold, proper dating, and consistency with the merger documents and governing law.
- Review the officers’ certificate for each certified fact: match it to the source document or record that supports it; if unsupported, mark it defective.
- Review the secretary’s certificate for document currency, completeness of attachments, and consistency between the attached versions and the operative versions in the closing set.
- Review the incumbency certificate for signatory authority, title accuracy, and signature matching across the closing documents.
- Review any merger-sub authorizing document for complete authority to approve the merger and any related closing action.
- For each identified defect, draft the corrected language or corrected document using the same transactional posture but with the defect cured.
- Where a defect appears in more than one document, note the interaction so the user can correct the entire set consistently.
- For every legal proposition relied on, cite the controlling authority by name and section or comparable authority form used in the source materials or standard corporate practice.
- For the issues memo, include a defined ordinal severity scale and apply it consistently to each issue; tie the severity to closing impact.
- End the issues memo with a short Recommended Actions block that assigns each action to counsel, an officer, or other responsible role and ties it to the closing timeline.
- For the correspondence letter, identify the defect, the requested correction, and the next step needed to clear signing or closing.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track relationships vertically from governing law to charter/bylaws to board action to officer execution to filing or closing deliverable.
- Track relationships horizontally across documents so that the same defined term, party name, effective date, and transaction description remain consistent throughout the set.
- Track temporal sequence carefully: authorization must precede execution; certifications must reflect the state of affairs as of the certification date; attachments must be current as of closing; and the checklist should distinguish pre-close, signing, and post-close items.
- If one document depends on another, treat the dependency as a correction issue when the upstream defect would undermine the downstream instrument.
- If a certificate refers to an exhibit or attached version, verify that the exhibit matches the operative document in the package, not an earlier draft.

## 6. Output structure conventions

- Produce the issues memo as the primary analytical deliverable, then the corrected transaction documents, then the annotated closing checklist, then the correspondence letter.
- Write each corrected document as a standalone, operative closing document; do not leave it as commentary only or as a summary of intended changes.
- For any corrected or annotated text, make the correction identifiable in plain text as well as in formatted output, so the change survives conversion to .docx.
- Keep the issues memo organized by document, with each issue stated as: defect, why it matters, the controlling authority or governing document basis, the related document interaction, and the closing consequence.
- Use a uniform severity label for each issue and a one-line rationale for that label.
- Include a concise correction note in each corrected document showing what was fixed and why.
- Make the annotated closing checklist operational: show each deliverable, owner, dependency, and status, and reflect any defect-driven follow-up.
- Keep the correspondence letter firm but cooperative; request specific revised documents and identify the needed response path.
- Before finishing, confirm that each named deliverable is actually drafted, internally consistent, and contains operative text rather than only commentary.
