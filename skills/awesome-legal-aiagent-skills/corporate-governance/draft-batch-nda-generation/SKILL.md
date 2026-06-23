---
name: batch-nda-generation-multi-party
task_id: corporate-governance/draft-batch-nda-generation
description: Generation of a batch of individualized NDAs from a master template, with counterparty-specific modifications for entity type, directionality, governing law, and existing agreement conflicts, accompanied by a cover memorandum flagging all issues at a categorical level.
activates_for: [planner, solver, checker]
---

# Skill: Batch NDA Generation from Master Template

## 1. Subject-matter triage (only if applicable)

- Treat the onboarding list as a multi-counterparty drafting exercise, not a single-form cleanup.
- First determine whether each counterparty needs an individualized NDA, a mutual NDA, or a unilateral NDA, and whether any name or entity-status cleanup is required before drafting.
- Check whether the template can be used as-is for each counterparty or whether local-law, authority, or prior-agreement issues require clause-level changes.
- Draft the agreements and the cover memorandum together, but complete the NDAs first and use the memorandum to surface the modifications and risks across the batch.

## 2. Failure modes the skill is correcting

- Applying the template uniformly across all counterparties without tailoring for entity type, disclosure direction, governing law, or authority to sign.
- Producing the NDAs without a companion memorandum that identifies the issues raised by each draft and gives a usable next step.
- Missing overlap with an existing NDA for the same relationship, creating inconsistent or duplicative confidentiality obligations.
- Using a mutual structure where only one side will receive information, or leaving mutual obligations in place after the disclosure pattern shows they are unnecessary.
- Failing to correct legal name / trade name discrepancies, signature-block authority, or other execution mechanics that determine whether the NDA is properly tied to the right party.
- Ignoring special risk categories that should be flagged in the memo, including minority capacity, outside restrictive obligations, and jurisdiction-specific restrictions on solicitation-style language.
- Describing modifications in the memo without pairing each issue with a practical recommendation.

## 3. Legal frameworks / domain conventions that apply

- Capacity to contract: verify whether any counterparty may lack full capacity and, if so, consider guardian or parent execution, deferral, or another legally effective signing path.
- Authority and entity form: use the correct legal name, capacity, and signing authority for individuals, corporations, partnerships, and other entity forms; tie the signature block to the actual signatory capacity.
- Trade name accuracy: if a counterparty operates under a DBA or similar name, identify the legal entity and the trade name together so the contract attaches to the correct party.
- Mutual versus unilateral confidentiality structure: align the obligation structure with the actual information flow rather than defaulting to reciprocity.
- Governing law and forum selection: choose and review governing law with the counterparty’s location and the draft’s restrictive provisions in mind.
- Restrictive-covenant sensitivity: where the draft includes solicitation or related employee-protection language, ensure the clause is consistent with the selected law and its limits.
- Existing agreement conflict analysis: compare any prior NDA with the same counterparty for differences in scope, term, survival, confidentiality definition, and termination mechanics.
- Outside-obligation risk: if a counterparty may be bound by a separate non-compete or similar restriction, add a representation that execution and performance do not breach outside obligations.
- General legal propositions in the memo should be tied to the governing source or recognized practice authority used for the drafting point; avoid unexplained conclusions.

## 4. Analytical scaffolds

- For each counterparty, run the same checklist:
  1. identify the legal name, entity type, and required signer;
  2. determine whether the NDA should be mutual or unilateral;
  3. confirm governing law and any clause changes required by that law;
  4. check for an existing NDA with the same counterparty;
  5. test capacity, authority, and any trade-name issue;
  6. flag any outside restrictive-obligation risk.
- Where a state-law restriction may affect solicitation-style language, remove or narrow the affected language and add any needed saving or carve-out language.
- Where the disclosure pattern is one-way, convert the form to unilateral rather than preserving unused reciprocity.
- Where a prior NDA exists, compare the key operative terms and decide whether the new draft should supersede, amend, or coexist only if the terms do not conflict.
- For partnerships or similar entities, ensure the signature block and authority language match the entity’s execution mechanics.
- For a DBA situation, reflect both the underlying legal entity and the trade name in the party identification section.
- For any possible outside restriction, add a representation that the NDA does not breach existing commitments and note whether access limits or timing changes should be considered.
- In the cover memorandum, do not merely restate edits; identify each issue, state the practical consequence, and give a recommendation.

## 5. Vertical / structural / temporal relationships (only if applicable)

- The batch should be drafted counterparty by counterparty, with each NDA tied to the corresponding onboarding entry and file name.
- The memorandum should track the same numbering as the drafted NDAs so the client can cross-reference issues quickly.
- Existing NDA conflicts should be resolved before circulation of the new draft; if they cannot be reconciled cleanly, the memorandum should explain why the relationship cannot safely proceed under both documents without clarification.
- Execution mechanics matter before delivery: authority, entity identification, and governing law should be settled in the draft before the package is sent out.
- The memorandum is secondary to the NDA package, but it must be completed contemporaneously so the client receives a usable issue-spotting record with the drafts.

## 6. Output structure conventions

- Produce one finished NDA for each listed counterparty, customized in the body and signature block as needed.
- Use a conventional NDA structure with the tailoring embedded where it matters; do not rely on a generic cover note to fix contract text.
- Provide a separate cover memorandum that is organized by NDA number and describes, for each draft, the modifications made, the issues flagged, and the recommended next step.
- The memorandum should be practical and concise: identify the issue, the governing drafting concern, and the action to take.
- Before finishing, confirm that every named NDA file and the memorandum file are complete, non-empty, and contain operative drafting rather than a description of what should be drafted.
