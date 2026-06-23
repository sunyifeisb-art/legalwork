---
name: extract-findings-from-arbitral-award
task_id: arbitration-international-dispute-resolution/extract-findings-from-arbitral-award
description: Ensures a comprehensive arbitral award summary memo extracts each claim, each financial component, any expert-methodology findings, any interest analysis, and any open enforcement or compliance steps from a complex multi-claim final award.
activates_for: [planner, solver, checker]
---

# Skill: Arbitral Award Summary Memorandum

## 1. Subject-matter triage

- Treat the award as a post-decision extraction task: identify the tribunal’s final holdings, the monetary consequences, the reasoning that matters for future disputes, and the steps still needed to implement the award.
- If the record contains multiple claims, multiple currencies, multiple interest periods, or multiple award phases, enumerate them first and analyze each separately before synthesizing any net result.
- If the source set includes supporting expert materials, separate what the tribunal actually adopted from what it merely recited or rejected.

## 2. Failure modes the skill is correcting

- Summarizes the outcome of major claims without extracting each quantum component individually, missing adjustment mechanisms and component-level calculations needed for accurate financial reconciliation.
- Extracts the tribunal's financial conclusions without analyzing the interest terms stated in the award, leaving the payment obligation incompletely stated.
- Fails to assess the expert reliance record — which expert's methodology the tribunal accepted, partially accepted, or rejected — omitting findings that can matter in later disputes under the same or similar agreements.
- Does not identify outstanding enforcement or compliance steps that remain after the award, treating the award as the final step rather than as the trigger for further action.
- Collapses distinct holdings into a single narrative and omits the legal rule, contractual provision, or procedural basis supporting each conclusion.
- Repeats the award’s bottom line without reconstructing the reconciliation logic that links liability findings, offsets, costs, and interest into the final payable amount.

## 3. Legal frameworks / domain conventions that apply

- Final award structure: a final arbitral award typically includes procedural history, jurisdiction, applicable law, merits analysis by claim, quantum, costs, and interest; each element should be extracted in full.
- Claim-specific analysis: where the tribunal decides distinct liability theories, state the governing contractual clause, treaty provision, arbitral rule, or legal doctrine that supports each holding.
- Financial reconciliation: identify gross awards, offsets, deductions, credits, partial allowances, and any currency or timing conversion logic before stating the net obligation.
- Post-closing or other adjustment mechanics: disputes involving price adjustments or similar financial mechanisms often turn on thresholds, component-level calculations, and reconciliation steps; identify each component and verify the arithmetic against the award.
- Claim notice requirements: if the award addresses a contractual notice issue, extract the holding and the reasoning relevant to how similar notice provisions may be drafted and applied.
- Interest computation: extract the stated interest rate, the commencement date, the compounding method if any, and whether the award distinguishes pre-award from post-award interest; compute the implied amount only if the record supplies sufficient inputs.
- Costs and fees: separate the tribunal’s treatment of legal fees, arbitration costs, expert costs, and any allocation rationale.
- Expert reliance: tribunals may credit one expert's methodology over another's; extract the basis for acceptance, partial acceptance, or rejection and the practical significance of that finding.
- Enforcement and compliance: identify any payment deadline, document-production obligation, interest-triggering event, or other implementation step left open by the dispositive section.

## 4. Analytical scaffolds

State the case overview: identify the parties, the tribunal composition, the seat, the governing law, the institutional or administered case identifier if stated, and the award date.

If more than one claim, counterclaim, period, or monetary component appears in the award, list each one explicitly before analysis and keep the sequence aligned to the tribunal’s own organization.

For each claim:
- describe the claim;
- state the controlling basis the tribunal used to decide it;
- state the liability finding;
- state the quantum awarded, denied, reserved, or offset;
- extract the key holding that explains why the tribunal ruled that way.

For each quantum component:
- identify the amount, the calculation method, and any threshold, cap, deduction, or adjustment feature;
- note whether the tribunal accepted the claimant’s, respondent’s, or a blended methodology;
- verify arithmetic where the award provides the necessary inputs.

For any issue involving notice, condition precedent, limitation, waiver, set-off, mitigation, or burden of proof:
- extract the rule the tribunal applied;
- state the factual predicate it found decisive;
- state the downstream consequence for the award.

For each expert retained:
- state whether the tribunal accepted, partially accepted, or rejected that expert's methodology;
- summarize the stated reason for the tribunal’s treatment of the expert evidence;
- note any broader implication for the disputed valuation or causation question.

Analyze interest:
- extract the rate, the start date, the end date or judgment date if stated, and the compounding convention if any;
- identify whether the award distinguishes pre-award from post-award interest or uses different rates for different phases;
- calculate the implied total only where the award text and arithmetic inputs make that safe.

Extract the costs award:
- separate tribunal fees, institutional fees, legal costs, expert fees, and any allocation principles used.

Identify open items:
- payment mechanics;
- document delivery or return obligations;
- continuing interest triggers;
- any reserved issues;
- any condition that must occur before full satisfaction of the award.

## 5. Vertical / structural / temporal relationships

- Distinguish merits, quantum, interest, costs, and enforcement as separate layers; do not mix them in a single summary sentence.
- Preserve chronology where the award turns on sequence: contract formation, notice, breach, termination, hearing, post-hearing submissions, and award date.
- Where the award spans multiple periods or tranches, analyze each period separately and then synthesize only after the period-by-period extraction is complete.
- If the award references prior interim decisions, identify what was settled earlier and what remained live in the final award.

## 6. Output structure conventions

Prepare a summary memorandum in conventional legal-memo form, using these components:

- Case overview: parties, arbitrators, seat, governing law, case identifier, award date
- Procedural and merits snapshot: brief posture, issues decided, and the tribunal’s governing basis
- Claim-by-claim analysis: each claim with legal basis, liability finding, quantum, and key holding
- Financial reconciliation: gross amounts, offsets, deductions, credits, and the resulting net payment obligation where the award supports that synthesis
- Interest analysis: rate(s), commencement date(s), compounding convention, and computed result if available from the record
- Costs and fees: tribunal allocation and rationale
- Expert reliance record: who was accepted, limited, or rejected and why
- Open items / implementation steps: outstanding enforcement, compliance, or post-award actions

Write the memo so each conclusion is traceable to a stated authority in the award or supporting materials; do not state a legal proposition without identifying the governing rule, clause, provision, or doctrine the tribunal applied.

Use precise, neutral language. Distinguish what the tribunal held from what the source materials merely argued. Only synthesize a net figure when the award’s components can be reconciled without guessing.
