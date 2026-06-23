---
name: identify-issues-proposed-contract-amendment
task_id: intellectual-property/identify-issues-in-proposed-contract-amendment
description: Reviewing a proposed contract amendment against the operative agreement, prior amendments, and internal guidance to identify conflicts, unintended consequences, and missing provisions.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Proposed Contract Amendment

## 1. Subject-matter triage

Treat the task as a layered comparison exercise, not a standalone markup of the draft amendment. Reconstruct the current operative deal by reading the master agreement together with all prior amendments before assessing the proposed amendment.

First, determine whether the source set contains multiple operative dates, multiple pricing periods, multiple products, multiple facilities, or multiple counterparties. If so, enumerate each relevant bucket explicitly before analysis and test the amendment against each bucket separately. If only one is in scope, say so and explain why.

For amendment review in supply and IP-heavy commercial contracts, confirm whether the draft changes:
- operative definitions,
- pricing or volume mechanics,
- IP ownership, license, or background rights,
- exclusivity, most-favored treatment, or customer parity,
- force majeure or excuse language,
- term, termination, renewal, or survival,
- integration, precedence, or amendment mechanics.

## 2. Failure modes the skill is correcting

- Reading the proposed amendment against the original agreement instead of the current operative version after prior amendments
- Treating a facially narrow amendment as isolated when it creates spillover effects in defined terms, order mechanics, remedies, or survival language
- Missing deviations from internal guidance, playbooks, or email-confirmed deal points
- Accepting ambiguous amendment wording that leaves retroactivity, effective date, or scope of supersession unresolved
- Overlooking volume data or commercial history that makes a proposed commitment change inconsistent with the actual relationship
- Failing to tie each issue to the governing clause and the practical consequence for the client

## 3. Legal frameworks / domain conventions that apply

- Under common contract interpretation principles, an amendment should clearly identify the provisions modified, the revised text, and the effective date; ambiguity increases interpretation risk and can create disputes over which version controls
- Under standard amendment and integration clauses, later amendments control only to the extent they are intended to modify earlier terms; confirm the scope of supersession and whether any provisions remain untouched
- Under basic supply contract drafting conventions, pricing changes should state whether they are retroactive, prospective, or tied to future orders, invoices, or shipments
- Under volume commitment and forecast conventions, any modified minimum purchase obligation should be reconciled against historical volume, current run-rate, and forward commitments reflected in the source data
- Under most-favored or parity-style clauses, a pricing concession to one customer may trigger comparison rights or commercial pressure elsewhere if the clause is broad enough
- Under force majeure doctrine and common commercial practice, expanded excusal language that shifts ordinary business risk can materially alter performance obligations
- Under intellectual property allocation principles, any amendment touching ownership, assignment, improvements, background IP, or license scope must be checked against any related rights, restrictions, or financing or sublicensing constraints disclosed in the source set
- Under standard issue-spotting practice, every legal conclusion should be tied to the governing provision or recognized doctrine supporting it, not stated as a bare assertion

## 4. Analytical scaffolds

1. Reconstruct the operative baseline
   - Layer prior amendments onto the master agreement in sequence.
   - Identify the current text of every provision the draft amendment touches.
   - Note any incorporated schedules, exhibits, order forms, or referenced policies that also change the operative deal.

2. Compare provision by provision
   - For each modified clause, compare proposed language to the current operative language.
   - Confirm whether the change actually accomplishes the stated commercial objective.
   - Flag drafting mismatches, partial edits, and cross-reference breakage.

3. Test for spillover and inconsistency
   - Ask what else changes if this clause changes.
   - Check defined terms, remedies, pricing mechanics, delivery obligations, IP rights, and survival provisions for downstream effects.
   - Identify any non-amended clause that becomes inconsistent with the new language.

4. Check against internal guidance and deal context
   - Compare the draft against playbook positions, red-flag guidance, and email-confirmed commercial points.
   - Treat a departure from internal guidance as a separate issue even if the draft is otherwise internally coherent.
   - Use the source documents to infer the intended business deal where the draft is ambiguous.

5. Test against volume data and commercial history
   - Where the amendment changes commitments, rebates, thresholds, or pricing tiers, compare the change to historical volume and projected volume.
   - Note whether the draft aligns with the economics implied by the data or introduces an unintended benefit or burden.

6. Prioritize the issues
   - Rank by enforceability risk, economic impact, operational disruption, and negotiation significance.
   - Distinguish between issues that could invalidate or narrow the amendment and issues that mainly require clarification or cleanup.

7. Close each issue completely
   - State the quantitative or scale context from the source materials.
   - Cross-reference the other clause, schedule, or document that interacts with the issue.
   - State the downstream consequence for the client in practical terms.

## 5. Vertical / structural / temporal relationships

Use the agreement hierarchy to track which text controls if the draft conflicts with earlier documents. In particular:
- Master agreement provisions may be modified by later amendments only to the stated extent.
- Defined terms often carry through multiple clauses and can alter the meaning of an apparently narrow edit.
- Pricing, volume, and rebate terms may operate across multiple periods; check whether the proposed change is tied to a term, quarter, year, or order date.
- IP ownership and license provisions may have vertical dependencies with confidentiality, invention assignment, indemnity, and survival language.
- If the draft says it replaces or supersedes prior terms, confirm whether that language is too broad or too narrow for the intended change.

## 6. Output structure conventions

Produce a risk-prioritized issue memorandum in conventional legal-memo form. Organize the discussion by issue type, such as:
- operative language conflicts,
- unintended consequences,
- deviations from internal guidance,
- scope or timing ambiguities,
- missing or incomplete provisions.

For each issue entry, include:
- a severity label using a consistent ordinal scale defined once at the top,
- the amendment section and the controlling current agreement section,
- a concise description of the issue,
- the source-document basis, including the relevant clause, email, playbook point, or data point,
- the controlling authority or contract principle supporting the concern,
- the commercial or legal consequence,
- the recommended fix or fallback wording.

Keep the memorandum self-contained and decision-oriented. End with a brief Recommended Actions block that assigns the next step to the appropriate role and anchors timing to the deal process or any deadline stated in the source materials.
