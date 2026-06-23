---
name: draft-standard-contractual-clauses-addendum
task_id: data-privacy-cybersecurity/draft-standard-contractual-clauses-addendum
description: SCC addendum drafts fail when the agent selects the wrong SCC module for the controller-processor relationship, does not populate the Annexes from the engagement documents, and omits any separate UK transfer instrument when both EU and UK personal data are in scope.
activates_for: [planner, solver, checker]
---

# Skill: Draft Standard Contractual Clauses Addendum for Cross-Border Data Processing Agreement

## 1. Subject-matter triage
- Confirm the deliverable is a drafting task, not a pure review: produce the SCC addendum first, then the client cover memo.
- Identify whether the engagement includes EU/EEA data, UK data, or both; if both are in scope, plan for a separate UK transfer instrument in addition to the SCC addendum.
- Determine the legal role alignment from the DPA, MSA, and related engagement materials before selecting any clause set.

## 2. Failure modes the skill is correcting
- Drafting the wrong SCC module because the party roles were not confirmed from the source agreements.
- Leaving Annexes as generic placeholders instead of translating the engagement record into populated transfer terms.
- Treating security language as descriptive rather than contractual, so the final annexes do not bind specific safeguards.
- Omitting a UK transfer addendum when UK personal data is also transferred.
- Failing to reconcile the SCC package with the DPA, leaving duplication, inconsistency, or silent conflict.
- Ignoring transfer-risk findings and therefore omitting supplementary contractual commitments where needed.
- Writing the cover memo as a narrative summary only, without explaining the drafting choices, alternatives considered, and remaining open items.

## 3. Legal frameworks / domain conventions that apply
- Use the applicable SCC structure for cross-border personal data transfers under the EU transfer framework, with the module determined by the exporter/importer relationship.
- If the data transfer assessment indicates non-adequate destination law or access-risk concerns, incorporate supplementary contractual and technical commitments consistent with the transfer framework and the assessment findings.
- If UK personal data is in scope, use the applicable UK transfer addendum or equivalent UK transfer mechanism as a separate instrument alongside the SCCs.
- Treat the DPA as the baseline processing agreement; the SCC addendum supplements it and should avoid inconsistency with the DPA’s scope, definitions, and operational terms.
- Populate Annex I with the parties, roles, transfer description, categories of data, data subjects, purposes, frequency, processing period, and supervisory authority information drawn from the engagement documents.
- Populate Annex II with concrete technical and organizational measures, stated as obligations rather than generic security aspirations.
- Populate Annex III with the authorized subprocessors, their locations, the work they perform, and any associated safeguards or transfer mechanism.
- Use the governing transfer text and the DPA together as the legal frame; where the addendum addresses the same topic more specifically, ensure the documents are coordinated rather than duplicative.

## 4. Analytical scaffolds
- Start by mapping the processing chain: exporter, importer, controller/processor roles, transfer direction, and the data sets covered.
- Read the DPA, MSA, SOW, security summary, subprocessor list, and transfer-impact assessment as a single package; do not draft from one document in isolation.
- Confirm whether the SCC package needs one module or more than one transfer instrument based on the documented role structure; if only one relationship applies, say so in the memo and explain why.
- Translate security controls into enforceable drafting: specify access controls, encryption, incident handling, logging, segregation, backup, and onward-transfer constraints as applicable to the record.
- Translate the transfer-impact analysis into drafting choices: if supplementary measures are needed, state them as commitments, restrictions, or operational conditions in the addendum package.
- Populate every annex from the source record; if a requested item is missing, flag it as an open item rather than inventing a placeholder.
- For the cover memo, explain the module selection, the basis for any optional or supplemental clauses, how UK data is handled, how transfer-risk findings are reflected, and what remains to be confirmed.

## 5. Vertical / structural / temporal relationships
- The SCC addendum supplements the DPA and should be drafted to sit downstream of, and consistent with, the existing processing framework.
- If the SCC addendum and the DPA overlap, the addendum should control only for the transfer-specific terms within its scope; the DPA should continue to govern the broader processing relationship.
- A UK transfer addendum is a separate instrument that cross-references the SCC package; it does not replace the EU/EEA transfer clauses.
- Annex content should track the actual processing lifecycle: what data is transferred, for what purposes, for how long, by whom, and under what safeguards.

## 6. Output structure conventions
- Prepare two deliverables: an SCC addendum package and a client cover memo.
- Draft the SCC addendum as an operative contract form with the selected transfer clause set, any required supplemental provisions, and fully populated annexes.
- If UK personal data is in scope, include the UK transfer addendum as a distinct document or distinct attachment within the package, clearly tied to the main SCC addendum.
- Write the cover memo as an advisory document that explains: why the clause set was selected, what assumptions were made, what optional provisions were included or omitted, how the transfer-risk analysis was addressed, and which items still need client confirmation.
- Use conventional legal drafting headings and annex structure; do not copy an internal checklist or placeholder-heavy format.
- Deliverable filenames must match the instructions exactly: `scc-addendum.docx` and `client-cover-memo.docx`.
- Before finishing, confirm that `scc-addendum.docx` exists and contains operative contractual text, and that `client-cover-memo.docx` exists and contains substantive drafting guidance.
