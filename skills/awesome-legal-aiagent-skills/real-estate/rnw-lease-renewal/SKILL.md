---
name: rnw-lease-renewal
task_id: real-estate/rnw-lease-renewal
description: Guides location-by-location deviation analysis of lease renewal proposals against market comparables, existing lease abstracts, the applicable lease policy framework, and the financial summary, producing a structured deviation report with economic quantification and response options.
activates_for: [planner, solver, checker]
---

# Skill: Commercial Lease Renewal Assessment — Market Rate Deviation Report

## 1. Subject-matter triage

This is a multi-location comparison task. Start by mapping each renewal proposal to the correct existing lease abstract, market comp set, and financial summary line item before evaluating substance.

First enumerate the locations in scope and keep them separate throughout. If the source set clearly contains only one location, say so and explain why no multi-location split is needed.

For each location, identify:
- the current lease baseline,
- the renewal proposal baseline,
- the applicable market context,
- the policy position that governs the decision,
- the financial-model entry that should reconcile to the analysis.

Do not mix terms, economics, or dates across locations.

## 2. Failure modes the skill is correcting

- The analysis compares a renewal proposal to market in the abstract, rather than to the correct submarket, term, and size band for that specific location.
- The analysis ignores the existing lease abstract, so it cannot tell whether the proposal improves, worsens, or preserves in-place economics.
- The analysis treats policy as background context instead of a governing screen, so it misses exception thresholds, approval gates, and walk-away triggers.
- The analysis reports base rent but omits other occupancy-cost drivers, such as operating expense treatment, concessions, or embedded structural changes.
- The analysis gives location-level observations without reconciling them to the financial summary, so portfolio impact and model consistency are lost.
- The analysis describes issues without closing them with scale, interaction, and consequence, so the report is readable but not decision-useful.
- The analysis states conclusions without anchoring them to the governing authority in the source set or the applicable lease-policy rule.

## 3. Legal frameworks / domain conventions that apply

- Lease renewal mechanics: evaluate the proposal against the current lease terms, any renewal option mechanics, and any landlord-proposed replacement terms.
- Market comp analysis: use the relevant submarket, deal size, term length, timing, and rent structure; a generic citywide comparison is insufficient.
- Lease policy framework: apply the company’s renewal rules as the controlling internal standard for acceptable rent movement, concessions, expense treatment, and approval routing.
- Operating-cost analysis: base rent is only one component; changes to expense pass-throughs, escalations, free rent, credits, or fit-out support can materially alter total occupancy cost.
- Financial summary consistency: the report must align to the modeled assumptions in the financial summary; if the analysis deviates, the difference should be identified and explained.
- Approval logic: when a proposal falls outside policy, identify whether the proper response is proceed, counter, seek exception approval, or exit/decline.
- Timing context: renewal urgency matters; lease expiration proximity affects leverage and should inform the response recommendation.

## 4. Analytical scaffolds

For each location, run the same sequence:
1. Extract the existing lease terms.
2. Extract the renewal proposal terms.
3. Extract the relevant market range and any directional market trend.
4. Identify the policy rule or threshold that controls the issue.
5. Compare proposal vs. existing lease, proposal vs. market, and proposal vs. policy.
6. Quantify the economic deviation using the scenario assumptions provided.
7. Reconcile the analysis to the financial summary and flag any mismatch.
8. State the business consequence of the deviation.
9. Recommend the response path.

When writing each issue entry, close it with three elements:
- scale or magnitude,
- the other document term or schedule it interacts with,
- the downstream effect on cost, leverage, approval, or execution.

Treat structural changes as first-class issues, even if base rent appears acceptable. A change in expense allocation, escalation mechanics, term length, or concession package can create a material deviation without changing headline rent.

Where the source set provides a controlling lease-policy rule or document authority, cite it in the report by the name or section used in the materials. Do not offer uncited conclusions when a governing rule is available.

If the report identifies a policy miss, explain whether it is within policy, outside policy but approvable, or outside policy and not recommended.

## 5. Vertical / structural / temporal relationships

Analyze each location on its own terms, then roll the results up:
- location-level deviations,
- aggregate economic effect,
- portfolio-level approval posture,
- any location that creates a walk-away or escalation condition.

Track relationships across time:
- current lease versus proposed renewal,
- proposed term versus expiration date,
- immediate economics versus term-long economics.

If expiration is near, note the negotiation pressure it creates and whether that should change the response posture.

If the financial summary assumes a different counterposition than the one supported by the analysis, flag that mismatch and identify the affected line item or scenario.

## 6. Output structure conventions

Use a conventional report shape rather than a rubric-shaped checklist.

Open with a short executive summary covering:
- the number of locations reviewed,
- the overall market posture,
- the principal policy exceptions,
- the locations requiring escalation or refusal,
- any material financial-model variance.

Then present one section per location with a consistent internal order:
- current lease baseline,
- renewal proposal summary,
- market comparison,
- policy comparison,
- quantified deviation,
- severity assessment,
- recommended response.

Include an ordinal severity label for every location issue, using one consistent scale defined once near the front of the report.

Keep the writing decision-oriented. Each location entry should make clear whether the proposal is acceptable, requires negotiation, requires exception approval, or should be declined.

End with a concise Recommended Actions section that assigns the next step to the responsible business role and ties it to the relevant renewal milestone or deadline in the source materials.

The deliverable filename must be `lease-renewal-deviation-report.docx`.
