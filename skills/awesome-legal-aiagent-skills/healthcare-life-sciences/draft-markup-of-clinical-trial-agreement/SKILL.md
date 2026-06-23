---
name: hls-draft-markup-cta
task_id: healthcare-life-sciences/draft-markup-of-clinical-trial-agreement
description: Produces a fully marked-up institutional redline of a sponsor-drafted clinical trial agreement, aligning the draft to the applicable institutional research position on indemnification causation, publication rights, adverse-event reporting, protocol amendment review, and government-funding / invention-ownership considerations.
activates_for: [planner, solver, checker]
---

# Skill: Draft Markup of Clinical Trial Agreement

## 1. Subject-matter triage

- Confirm the controlling inputs before drafting: the sponsor CTA, institutional playbook, engagement email, budget, and protocol synopsis.
- Treat the CTA as the primary deliverable; any commentary or cover note is secondary to the redlined agreement itself.
- Map the study type, funding posture, reporting regime, and amendment workflow before revising individual clauses.
- If more than one institutional position, study arm, reporting channel, or funding source is implicated, separate them explicitly before analysis rather than blending them into one pass.

## 2. Failure modes the skill is correcting

- A draft may identify the right issue but fail to convert it into an operative clause change.
- Indemnification may be narrowed by causation wording that is left untouched instead of aligned to the institution’s preferred formulation and sponsor-negligence qualifier.
- Publication may preserve a sponsor consent right when the playbook calls for review-and-comment, a defined review window, a dispute path, and a deemed-response fallback.
- Safety reporting may be left on sponsor-preferred timelines instead of tracking the applicable regulatory reporting framework for the study.
- Protocol amendment language may omit the required ethics committee / IRB review condition before implementation.
- Funding and invention language may ignore public-support implications, government interests, or required representations about the absence of such support.
- Commentary may describe the issue without tying it to a playbook position, a governing authority, and a practical consequence for the institution.
- A markup that depends only on formatting can fail in export; each substantive change must be legible from the text alone.

## 3. Legal frameworks / domain conventions that apply

- Indemnification: identify any narrow causation formulation and align it to the institution’s preferred causation standard, including the sponsor-negligence qualifier required by the playbook.
- Publication rights: where the sponsor holds approval or consent rights, convert the provision to a review-and-comment structure with a defined review period, dispute handling, and deemed approval or no-response treatment consistent with the playbook.
- Adverse-event reporting: align reporting obligations to the applicable research-safety framework, including expedited reporting windows for serious unexpected events and fatal or life-threatening events where those rules apply.
- Protocol amendments: require ethics committee / IRB review before implementation whenever the governing study category or institutional position calls for that sequencing.
- Government funding and invention ownership: if public support or other governmental funding is implicated, address statutory rights, confirm any needed representation regarding such support, and harmonize ownership language with the applicable funding regime.
- Research-contract conventions: revise only what the source documents and playbook support; do not import sponsor-favorable defaults where the institution position is more protective.
- Authority discipline: every substantive legal proposition should be anchored to the governing rule, regulation, or accepted research-contract authority reflected in the source materials or standard practice.

## 4. Analytical scaffolds

1. Indemnification review
   - Locate any causation qualifier, limitation, carve-out, or attribution standard.
   - Redline the text to the institutional position.
   - Add a concise rationale tied to the playbook and the practical risk allocation consequence.

2. Publication review
   - Identify any sponsor approval, veto, delay, or preclearance right.
   - Replace it with review-and-comment mechanics if required.
   - Include the review period, response mechanics, and fallback language.
   - Explain how the revised clause preserves academic publication rights while protecting confidential information.

3. Safety reporting review
   - Check whether each reporting obligation matches the study’s governing safety-reporting regime.
   - Harmonize internal reporting, sponsor reporting, and any expedited external reporting obligations.
   - Where multiple reporting channels exist, specify them separately so timing does not become ambiguous.

4. Protocol amendment review
   - Confirm whether amendments require prior ethics committee / IRB review or approval before implementation.
   - Ensure the clause distinguishes administrative changes from substantive protocol changes if the source documents do so.
   - State the operational consequence of noncompliance with the required sequencing.

5. Funding and invention-ownership review
   - Determine whether public funding or analogous support is implicated by the source materials.
   - If yes, add the needed representation and align ownership / government-interest language accordingly.
   - If no, preserve a clean representation without overcommitting beyond the record.

6. Commentary drafting
   - Assign each issue an ordinal severity label using a defined scale: Red, Yellow, or Green.
   - Use Red for provisions that materially conflict with the institutional position or regulatory framework, Yellow for negotiable but material points, and Green for nonmaterial cleanups or drafting polish.
   - For each entry, state the governing basis, the cross-referenced document or clause interaction, and the downstream consequence for the institution.

7. Redline execution
   - Make every substantive edit visible in the text itself using robust markup that survives export.
   - Pair each deletion, insertion, or substitution with a short rationale.
   - Keep comments targeted to the changed language; do not restate the full agreement.

## 5. Vertical / structural / temporal relationships

- Track the order in which obligations occur: protocol review before implementation, reporting after event identification, publication review before submission, and funding representation at contract formation.
- Distinguish sponsor obligations from institution obligations, and internal review steps from external regulatory steps.
- When one clause affects another, note the interaction explicitly so the revised text reads consistently across definitions, operational clauses, and exhibits.
- If the study synopsis, budget, or engagement email narrows the clause scope, conform the redline to that narrower record rather than the sponsor’s broader form.

## 6. Output structure conventions

- Deliver a fully marked-up redline of the CTA as the operative document, suitable for export to `marked-up-cta-vlx4190-301.docx`.
- Use explicit textual markup for every substantive change, such as [DELETED: ...], [INSERTED: ...], and [REPLACED: old → new], so the changes remain clear in plain text.
- Attach a short [Rationale: ...] note to each substantive change or cluster of related changes.
- Include commentary alongside the markup or in adjacent notes, with one entry per issue and a defined severity label from the ordinal scale stated above.
- Keep commentary concise but complete: identify the clause, state the basis, reference the interacting source document or related clause, and explain the practical consequence.
- End with a brief Recommended Actions section that states the next step, the responsible role, and the timing anchor tied to the study workflow or signature process.
- Preserve the agreement’s operative drafting style; do not substitute a memo or checklist for the redlined contract.
