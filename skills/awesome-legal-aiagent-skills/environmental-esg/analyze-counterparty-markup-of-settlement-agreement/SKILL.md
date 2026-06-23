---
name: analyze-counterparty-markup-of-settlement-agreement
task_id: environmental-esg/analyze-counterparty-markup-of-settlement-agreement
description: Guides section-by-section redline review of a settlement agreement by anchoring each markup to response-cost allocation, contribution protection scope, and applicable agency policy constraints on liability structure.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Settlement Agreement — Redline Review Memorandum

## 2. Failure modes the skill is correcting

- Treating the counterparty’s markup as generic contract polish instead of identifying how each deletion, insertion, or substitution changes settlement economics, liability allocation, or enforceability
- Describing issues without tying them to the specific provision, the governing policy or legal constraint, the amount or scope of exposure implicated, and the practical consequence for the client
- Missing conflicts between the redline and the supporting documents, including cost summaries, remedy materials, allocation inputs, and agency-position constraints
- Failing to distinguish acceptable cleanup edits from changes that narrow covenants, weaken contribution protection, expand reopener exposure, or shift orphan-share risk
- Collapsing multiple provisions, parties, time periods, or liability structures into one generalized pass instead of analyzing each affected item separately
- Omitting a clear recommended position, responsible decision-maker, and timing sensitivity for each material issue
- Relying on formatting alone to show redlines, which can disappear in export and obscure the actual markup

## 3. Legal frameworks / domain conventions that apply

- Joint and several liability is the default baseline unless the settlement text and governing policy support a narrower structure
- Contribution protection must be coextensive with the settlement scope and the performance obligations that justify it
- Covenant-not-to-sue language should track the specific covered sites, operable units, claims, and performance milestones addressed in the record
- Reopener language generally preserves agency rights for unknown conditions, remedy failure, changed circumstances, and other reserved events
- Past-cost and future-cost provisions should be tested against the source materials for documentation support, reasonableness, and scope
- Allocation concepts commonly include volume, toxicity, waste-stream contribution, time on site, and other factors reflected in the record
- Liability caps, several-only structures, and similar counterparty proposals should be checked against the agency’s settlement authority and policy constraints
- Reservation-of-rights language should remain consistent with the remedy, the decree or settlement framework, and any preserved third-party claims
- Any legal conclusion in the memo should be tied to a cited authority from the record or to a generally recognized environmental settlement principle by name

## 4. Analytical scaffolds

- Begin by enumerating each materially different redlined provision, grouped by section, party obligation, or liability topic, and then analyze each item in turn
- For every markup, identify the change type separately: addition, deletion, substitution, or conforming edit
- For every issue, close the analysis by stating: the scale of the affected exposure or obligation, the document or clause that interacts with it, and the downstream consequence for the client
- For allocation or payment changes, compare the original draft to the redline using the numbers and allocation data in the record; do not infer amounts that are not supported by the source documents
- For liability-structure proposals, assess whether the requested change is likely to fit within the governing settlement framework and agency practice
- For covenant and release changes, test whether the revised scope remains tied to the covered matter and does not unintentionally broaden protection beyond the intended performance package
- For reopener changes, flag any deletion or narrowing that would cut against mandatory preserved rights, remedy certainty, or changed-circumstance protection
- For contribution protection changes, identify who is shielded, from what claims, and whether the shield is too broad, too narrow, or misaligned with the settlement scope
- For timing changes, trace cascading effects across milestones, notice obligations, performance deadlines, and any dependent approval steps
- For each issue, state a practical recommended position rather than only a diagnostic label

## 5. Vertical / structural / temporal relationships

- Compare the counterparty’s markup against the original draft, then against the supporting materials that justify the settlement structure
- Track how edits to one clause affect linked clauses elsewhere in the agreement, including release, contribution protection, reservation, indemnity, performance, and default provisions
- Identify whether a change shifts liability among settling parties, non-settling parties, or reserved third parties
- Check whether a time extension, deadline deletion, or sequencing change pushes obligations into later milestones or undermines compliance leverage
- If multiple parties, amounts, sites, units, or phases are in scope, treat each separately unless the record affirmatively shows they are identical for purposes of the issue being analyzed

## 6. Output structure conventions

- Produce a formal redline review memorandum with a short executive summary, followed by a section-by-section analysis, then a consolidated issues table, and then a recommendations section
- State the overall risk profile up front and identify the provisions most likely to require negotiation
- Use an explicit ordinal severity field for every issue, defined once and applied consistently: Critical, Significant, Minor
- In each section-by-section entry, include the provision reference, what changed, why it matters legally or practically, the client impact, and the recommended response
- In every issue entry, include the governing authority, policy, or settlement principle being relied on by name and, where available from the materials, by section or analogous citation
- Do not rely only on visual markup; make every substantive change visible in text with a robust convention such as [DELETED: …], [INSERTED: …], or [REPLACED: old → new], with a short rationale immediately tied to the change
- Use a concise, conventional table for the consolidated issues list with columns for provision, issue type, severity, impact, and recommended action
- End with an explicit Recommended Actions block that assigns the action, the responsible role, and the timing anchor tied to the transaction or approval process
- The deliverable filename must match the task instructions exactly: `redline-review-memo.docx`
