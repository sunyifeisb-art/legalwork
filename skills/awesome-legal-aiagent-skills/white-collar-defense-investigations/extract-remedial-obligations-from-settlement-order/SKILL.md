---
name: extract-remedial-obligations-from-fcpa-settlement
task_id: white-collar-defense-investigations/extract-remedial-obligations-from-settlement-order
description: Compliance obligation matrix extracting remedial obligations from a multi-agency anti-corruption settlement, distinguishing obligations by resolving authority, capturing financial terms and any offset or credit mechanism, mapping certification and reporting deadlines, and flagging gaps or conflicts between external commitments and internal implementation documents.
activates_for: [planner, solver, checker]
---

# Skill: Extract Remedial Obligations from FCPA Settlement — Compliance Obligation Matrix

## 1. Subject-matter triage
- Treat the settlement papers and implementation materials as a single obligation set, but first separate them by resolving authority and by document type.
- Identify whether the sources contain one resolution or multiple parallel resolutions; if multiple, keep each obligation stream distinct until the offset/credit analysis stage.
- Extract only discrete, action-bearing obligations, deadlines, reporting duties, certifications, financial terms, approvals, and implementation controls; do not collapse them into narrative summaries.
- If an obligation appears only in internal materials and not in the external settlement documents, flag it as an internal implementation item, not a settlement commitment.

## 2. Failure modes the skill is correcting
- Settlement obligations are merged across authorities, causing the matrix to misstate who is owed performance, when performance is due, and whether a term is recurring or one-time.
- Financial components are mixed together without preserving the distinct remedy categories or any credit/offset mechanism, leading to incorrect exposure tracking.
- Recurrent certification and reporting duties are omitted, even though they are binding compliance obligations with breach consequences.
- Internal policies, board actions, or implementation memos are treated as if they satisfy external commitments without checking for exact alignment.
- Gaps are identified descriptively but not tied to the downstream compliance risk or operational fix.
- Obligations are stated without the controlling source language or authority structure that makes the obligation enforceable.

## 3. Legal frameworks / domain conventions that apply
- Anti-corruption settlements commonly impose parallel remedial tracks: one track may address criminal or administrative compliance obligations, while another may impose civil remedies, penalties, disgorgement, interest, or injunctive conditions.
- Each source document must be read on its own terms before cross-document reconciliation; obligations are not interchangeable unless the settlement expressly provides for credit, offset, or satisfaction.
- Financial remedy components should be tracked separately by category and source, then reconciled only after identifying any express credit mechanism.
- Recurrent compliance duties, including annual certifications, periodic reports, testing obligations, and attestations, should be treated as ongoing obligations with explicit cadence and recipient.
- If the settlement contemplates a monitor or independent reviewer, the matrix should capture scope, appointment method, reporting cadence, term, and cost responsibility.
- If funds are required to be reserved, escrowed, or otherwise segregated, capture the trigger, release condition, and timing constraints.
- Gap analysis should compare the external commitment to the internal implementation materials and identify whether the internal documents omit, narrow, broaden, or conflict with the external duty.

## 4. Analytical scaffolds
1. **Document segmentation**: List each external resolution and each internal implementation document separately before analysis.
2. **Obligation extraction**: For each source, extract every discrete obligation with its actor, act, deadline, recipient, recurrence, and condition precedent or condition subsequent.
3. **Authority mapping**: Tie each obligation to the specific source document and clause, and preserve the resolving authority or internal owner where identifiable.
4. **Financial term isolation**: Extract each financial remedy component separately before any reconciliation or netting analysis.
5. **Offset / credit review**: Determine whether any payment or performance under one resolution reduces or satisfies another obligation, then state the remaining exposure after applying the express mechanism only.
6. **Recurring-duty review**: Capture any annual, periodic, or event-driven certification/reporting obligation with its cadence and submission path.
7. **Implementation-control review**: Identify payment approvals, sign-off thresholds, escalation rules, monitoring steps, and ownership assignments in internal documents.
8. **Gap and conflict analysis**: Compare the external commitments against internal documents and label each divergence as missing, inconsistent, incomplete, or overbroad.
9. **Remedy recommendation**: For each gap or conflict, propose a targeted fix that aligns the internal materials to the external commitment.

## 5. Vertical / structural / temporal relationships
- Maintain a vertical hierarchy from source document → obligation category → discrete obligation → implementation owner → deadline/status.
- Preserve temporal sequencing: first the settlement-imposed deadline, then any internal implementation milestone, then any reporting or certification cycle.
- Where one obligation depends on completion of another step, record the dependency explicitly rather than merging the steps.
- If a duty repeats, separate the initial trigger from the recurring cadence and do not treat the first performance date as the whole obligation.
- When multiple counterparties or recipients are involved, assign each obligation to the correct recipient rather than using a generic “government counterpart” label.

## 6. Output structure conventions
- Deliver as a compliance obligation matrix in a conventional table format.
- Use columns that capture: obligation ID, obligation text, source document, source clause or section, authority / recipient, responsible internal role, timing, recurrence, status, and notes.
- Include a financial obligations section that lists each remedy component separately and then states any express credit or offset mechanism.
- Include a recurring obligations section for certifications, reports, monitoring, testing, and attestations.
- Include a gap / conflict section that identifies the mismatch, the affected document, the compliance consequence, and the recommended fix.
- Use an ordinal severity label for each gap or conflict and define the scale once at the top of the gap section.
- Keep the recommendations operational: name the responsible role and the timing anchor for each fix.
- Do not rely on formatting alone to signal additions, deletions, or conflicts; the plain-text matrix must make each obligation and each discrepancy intelligible on its own.
- Cite the controlling source authority for each legal or compliance proposition using the document’s own citation style where available.
