---
name: compare-msa-playbook-deviation-review
task_id: intellectual-property/compare-msa-playbook-deviation-review
description: Deviation review of an MSA against a contracting playbook, organized by provision type and informed by vendor diligence context.
activates_for: [planner, solver, checker]
---

# Skill: MSA Playbook Deviation Review

## 1. Subject-matter triage
- Treat the playbook as the governing baseline for each provision type, then compare the draft MSA against that baseline and the diligence materials together.
- If the source set contains multiple drafts, playbooks, emails, or diligence summaries, enumerate them first and review each against the same provision map before synthesizing.
- Separate true deviations from missing provisions, internal inconsistencies, and items that are merely less favorable than the preferred position.

## 2. Failure modes the skill is correcting
- Applying a generic contract review lens instead of the specific playbook position that governs each clause family.
- Treating every deviation as equal rather than distinguishing mandatory, preferred, and negotiable positions.
- Ignoring procurement or diligence context when it changes the risk significance of warranty, compliance, security, indemnity, or liability language.
- Overlooking omitted provisions that the playbook expects to be included and must be proposed as additions rather than redlines.
- Ending an issue with description alone instead of stating why it matters, what other source text it interacts with, and what consequence follows for the client.
- Writing recommendations without a concrete action, accountable role, and timing anchor.

## 3. Legal frameworks / domain conventions that apply
- Contracting playbooks function as the negotiated floor by clause family; classify each point by the playbook’s priority and do not re-rank it by intuition.
- MSA reviews for IT services commonly turn on scope control, acceptance, service levels, data security, incident response, confidentiality, IP ownership in deliverables and custom work, subcontracting, audit rights, business continuity, termination assistance, indemnity, warranty, and limitation of liability.
- Due diligence on vendor financial condition, security controls, delivery capacity, and subcontractor practices informs how aggressively to press deviations in assurance, remedy, and risk-allocation language.
- Missing provisions are deviations. Track them as gap items with proposed insertion language, not as redlines to nonexistent text.
- When a legal proposition is stated, anchor it to the applicable source authority named in the materials or to the controlling contractual section, policy, rule, statute, regulation, or doctrine as applicable.

## 4. Analytical scaffolds
- Build a provision inventory from the playbook first, then map the draft MSA and source emails/diligence notes to that inventory.
- For each clause family, determine: what the playbook expects, what the draft provides, what the deviation is, whether the item is omitted entirely, and whether diligence changes the risk assessment.
- Classify every issue on a uniform ordinal scale stated once at the outset of the report; use that same scale consistently across all entries.
- Close each issue with three moves: the size or scope of the point as shown in the sources, the related clause or document it interacts with, and the client consequence if left unresolved.
- Where the playbook supplies a required formulation, state the needed language; where it supplies a preferred position, state the preferred wording and a fallback; where it is negotiable, identify the acceptable range and the trade-offs.
- Order recommendations by leverage: hold firm on mandatory deviations, press harder where diligence heightens risk, and reserve lower-priority items for negotiation trades.

## 5. Vertical / structural / temporal relationships
- Compare the draft, playbook, procurement communications, and diligence summary along the same provision axis so related points are not analyzed in isolation.
- Note vertical dependencies, such as an indemnity clause that shifts risk while liability caps, insurance, audit, or termination rights determine whether the shift is actually meaningful.
- Note temporal dependencies, such as pre-signing diligence concerns, go-live obligations, cure periods, notification windows, renewal timing, and termination assistance deadlines.
- If the source set contains multiple counterparties, projects, service lines, or time periods, enumerate them before analysis and produce a distinct issue row for each rather than collapsing them into one representative item.

## 6. Output structure conventions
- Produce a classified deviation report in conventional business-legal form: concise overview, issue table or equivalent by priority and clause family, gap list for omitted provisions, diligence cross-references, and negotiation recommendations.
- Define the severity scale once near the start, then apply it uniformly to every issue entry.
- For each issue entry, include the playbook position, the draft position, the deviation type, the why-it-matters point, the related source cross-reference, and the recommended negotiating stance.
- Distinguish clearly between “redline needed” and “new clause needed” so omissions are not buried inside clause commentary.
- End with a Recommended Actions section that gives each action in imperative form, identifies the responsible internal role, and ties the timing to the signing process, response deadline, or implementation milestone.
- If the task requires a file output, ensure the primary deliverable is completed first and is non-empty before any secondary summary is prepared.
