---
name: extract-closing-conditions
task_id: corporate-ma/extract-closing-conditions
description: Guides extraction and mapping of all closing conditions from an acquisition agreement into a comprehensive matrix cross-referenced against the current status of each condition.
activates_for: [planner, solver, checker]
---

# Skill: Closing Conditions Extraction and Status Matrix

## 1. Subject-matter triage
- Use this skill for a closing-conditions extraction task where the source set includes an MIPA and related transaction documents.
- Treat Article VII as the primary source of closing conditions, then map each condition against the disclosure schedules, ESA summary, financing commitment letter, and seller counsel status update.
- If the agreement contains multiple closing-condition regimes, separate them before analysis: mutual conditions, buyer-only conditions, and seller-only conditions.
- If the source set is missing a referenced document, flag the gap instead of inferring satisfaction.

## 2. Failure modes the skill is correcting
- The condition is copied from the agreement but not mapped to the supporting documents that bear on current status.
- Mutual conditions are blended with unilateral conditions, obscuring who may refuse to close.
- Embedded qualifiers, carve-outs, and knowledge/materiality standards are left unexplained.
- A condition that is satisfied, partially satisfied, outstanding, or at risk is not distinguished with enough precision for a closing decision.
- Cross-document conflicts are not surfaced, especially where the disclosure schedules, financing materials, or counsel update point in different directions.
- Timing-sensitive items are described without noting whether they are already delivered, still open, or contingent on later action.

## 3. Legal frameworks / domain conventions that apply
- Read the closing conditions article as a contractual allocation of closing risk, not as a generic checklist.
- Treat defined terms, bring-down standards, MAE qualifiers, and “to the extent applicable” carve-outs as controlling interpretation aids.
- Distinguish:
  - mutual conditions that apply to both parties’ obligation to close,
  - buyer conditions to the buyer’s obligation to close, and
  - seller conditions to the seller’s obligation to close.
- Treat regulatory approvals, third-party consents, and deliverables as separate categories even if the agreement groups them together.
- Treat financing-related conditions by reference to the commitment letter and any conditions precedent contained there, but do not import financing assumptions that are not stated in the source set.
- Where a condition depends on a factual state of affairs, the matrix should say what document supports that state and what remains unresolved.

## 4. Analytical scaffolds
- Start by enumerating every closing condition in Article VII, including nested subparts and any “except as” or “subject to” language that changes the standard.
- For each condition, identify:
  - the obligor or affected party,
  - the required fact, act, or deliverable,
  - the controlling qualifier or threshold,
  - the source document(s) that speak to current status,
  - whether the condition appears satisfied, partially satisfied, outstanding, or at risk,
  - the action, if any, needed to bridge the gap.
- If one condition depends on several documents, reconcile them explicitly rather than collapsing them into one conclusion.
- When a supporting document is silent, say “not addressed” rather than treating silence as satisfaction.
- Where the condition is time-bound, note whether performance is complete, scheduled, or still pending as of the latest source update.
- If the condition is operationally important but not clearly a legal closing condition, separate it as a related closing deliverable rather than forcing it into the conditions list.

## 5. Vertical / structural / temporal relationships
- Preserve the Article VII structure in the matrix so the hierarchy of conditions remains visible.
- Link each condition back to the exact article, section, or subpart that creates it.
- Track temporal sequence where relevant: signing, interim period, closing, post-closing deliverables, and any outside-date pressure.
- If the documents reveal a condition that is functionally a pre-closing covenant or deliverable rather than a true closing condition, note that distinction.
- Where seller counsel status update conflicts with the agreement or disclosure materials, identify the later-developing issue and its likely closing impact.

## 6. Output structure conventions
- Produce a single closing-conditions matrix as the operative deliverable.
- Use conventional matrix columns that make the condition readable at a glance, including:
  - Article / section reference,
  - condition category,
  - condition text or concise paraphrase,
  - controlling qualifier or carve-out,
  - supporting document(s),
  - current status,
  - open point or discrepancy,
  - next step / responsible party.
- Keep each row tied to one condition or subcondition; do not merge distinct conditions merely because they appear adjacent in Article VII.
- Use a consistent status vocabulary across the matrix.
- Make the matrix suitable for direct placement into a document file without needing explanatory prose around it.
- If a condition is only partially supported, say what is confirmed and what remains unresolved.
- If the task asks for a closing-conditions matrix in a file, ensure the matrix content is the primary deliverable and contains the operative rows, not a summary of what the rows would be.
