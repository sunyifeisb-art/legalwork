---
name: analyze-counterparty-markup-tech-license
task_id: intellectual-property/analyze-counterparty-markup-of-technology-license-agreement
description: Comprehensive deviation report for a counterparty-marked technology license agreement evaluated against the original draft and internal negotiation guidance.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Technology License Agreement

## 1. Subject-matter triage
- Treat the marked-up agreement, the original draft, and the internal negotiation playbook as a single comparison set; do not evaluate edits in a vacuum.
- First identify whether the markup changes scope, economics, control, risk allocation, or post-termination rights; those categories usually drive the materiality analysis.
- Enumerate the operative counterparties, transaction roles, and any alternative drafting paths before assessing deviations, so each analysis pass maps to a specific party or clause cluster.
- If only one agreement version or one business scenario is actually in scope, say so explicitly and explain why no broader comparison is needed.

## 2. Failure modes the skill is correcting
- Reading the license grant alone without tracing how field-of-use limits, territory, sublicensing, exclusivity, and reservation of rights combine to define the actual conveyed package.
- Treating royalties, audit mechanics, offset rights, and favored-nation language as unrelated edits instead of one economic system.
- Missing the interaction among ownership of improvements, grantback obligations, and restrictive covenants that can erode the licensor’s practical control over core technology.
- Failing to cross-check the counterparty markup against the baseline deal points and negotiation playbook, which causes silent drift from approved positions.
- Summarizing changes descriptively without stating the legal authority or drafting convention that supports why a change matters.
- Labeling an item as important without assigning a uniform severity level and a concrete recommendation.

## 3. Legal frameworks / domain conventions that apply
- Technology licenses are read as integrated allocation instruments: the grant, reserved rights, exclusivity, field of use, territory, and sublicensing language must be reconciled together.
- Exclusive, sole, and non-exclusive grants carry distinct legal effects; the drafting must be classified correctly before impact is assessed.
- Improvement ownership and grantback provisions determine whether the licensee’s development activity expands the licensor’s rights or the licensee’s control.
- Royalty provisions should be evaluated as a package under ordinary contract interpretation principles, with the royalty base, rate, audit rights, reimbursement of audit costs, offsets, and favored-nation treatment considered together.
- Assignment, change-of-control, and consent language can alter value and deal continuity even when no operational clause is otherwise changed.
- Warranty and indemnity provisions allocate infringement, validity, ownership, and performance risk; the analysis should anchor conclusions in the governing contract text and any referenced law or policy.
- Where a legal conclusion is stated, cite the controlling authority by name and section or other recognized authority stated in the source materials; do not state a conclusion without its support.

## 4. Analytical scaffolds
- Agreement comparison: for each material clause cluster, identify the original position, the counterparty edit, the playbook position, and the resulting deviation.
- Scope analysis: test whether edits expand or contract the practical license scope, including use restrictions, territory, channels, and sublicensing permissions.
- Economic package analysis: assess pricing and audit edits as a single structure and note any knock-on effects on leverage, recoverability, or pricing certainty.
- IP ownership analysis: trace improvements, derivative works, feedback rights, and grantbacks to determine who captures future value.
- Control and transfer analysis: review assignment, change of control, termination, and consent mechanics for transfer risk.
- Risk allocation analysis: compare indemnity, warranty, liability cap, exclusion, and remedy language against the negotiated baseline.
- Baseline cross-reference: verify that each approved negotiation position appears consistently across the marked-up text and any related schedules or exhibits.

## 5. Vertical / structural / temporal relationships
- Track clause-to-clause dependencies: a narrower grant can be offset by better economics, while a broader grant can be partially constrained by ownership, confidentiality, or post-termination restrictions.
- Track document hierarchy: operative definitions, schedules, exhibits, and incorporated policies can override or clarify main-text edits.
- Track temporal effects: commencement, term, renewal, survival, audit lookback, notice periods, and post-termination use rights may change the practical effect of the markup long after signature.
- When multiple counterparties, products, territories, or license layers exist, analyze each separately rather than collapsing them into a composite view.
- If the source set includes a single transaction path, state that affirmatively and avoid implying a broader matrix exists.

## 6. Output structure conventions
- Produce a deviation report in a conventional legal-issues format, not a clause-by-clause paraphrase.
- Define a single ordinal severity scale at the top and apply it uniformly to every entry, using the same labels throughout.
- For each issue, include: the clause or topic, the deviation from the original draft or playbook, the severity rating, the controlling authority or drafting principle relied on, the practical impact, and the recommended counter-position.
- Each issue discussion should close with three moves: quantify or bound the issue using a figure, threshold, term, or exposure from the source materials; tie it to an interacting clause or related document; and state the downstream consequence for the client.
- Use robust plain-text change marking for markup analysis so every substantive edit is identifiable even if formatting is stripped; label deletions, insertions, and substitutions in text where needed, and add a brief rationale for each marked change.
- Include a focused section on royalty and audit economics, and a separate section on IP ownership, improvements, and grantback effects when those topics are implicated.
- End with an explicit Recommended Actions block that states the action, the responsible role, and the timing anchor drawn from the transaction posture or source materials.
- Prioritize the primary deliverable: the deviation report should stand on its own as the operative work product.
