---
name: compare-charitable-trust-structures-against-client-goals
task_id: trusts-estates-private-client/compare-charitable-trust-structures-against-client-goals
description: Comparing charitable remainder trust structures against client goals requires applying the relevant tax qualification rules, deduction limitation arithmetic, and identifying potentially disqualifying provisions in draft instruments before a recommendation can be made.
activates_for: [planner, solver, checker]
---

# Skill: Compare Charitable Trust Structures against Client Goals — Trust Structure Recommendation Memorandum

## 1. Subject-matter triage (only if applicable)

- Identify the two proposed charitable trust structures, the client’s stated goals, and any operative assumptions that affect qualification, valuation, or deduction timing.
- Separate matters that require legal qualification analysis from matters that are purely commercial preference, so the memo does not treat design choices as legal defects.
- If the source set contains more than one contribution, valuation date, beneficiary class, or funding scenario, enumerate each one before analysis and keep the comparison separate for each item.

## 2. Failure modes the skill is correcting

- Failing to identify provisions in draft instruments that may disqualify the trust from favorable tax treatment, such as non-charitable distribution authority or ambiguous payout terms.
- Omitting the deduction-limitation arithmetic and carryforward analysis that determines the actual achievable deduction, not just a headline present-value figure.
- Treating the two structures as interchangeable without identifying which client goals each does and does not satisfy.
- Ignoring mortgage or encumbrance on contributed property, which may create acquisition-indebtedness or unrelated-business-income risk under the applicable tax rules.
- Stopping at description of a defect without linking it to scale, document interaction, and client consequence.
- Giving recommendations without stating the legal rule or authority that supports them.

## 3. Legal frameworks / domain conventions that apply

- Charitable remainder annuity trust: pays a fixed annuity; no additional contributions after initial funding; minimum payout rate and actuarial remainder requirements must be satisfied under the governing tax rules.
- Charitable remainder unitrust: pays a percentage of trust assets revalued annually; additional contributions are permitted if the governing document and qualification rules allow them.
- The charitable remainder must satisfy the applicable minimum actuarial value test at the time of transfer, using the valuation rate in effect on the relevant date.
- Deduction limitations: gifts to different categories of charitable recipients may be subject to different percentage limits; unused deduction may carry forward for the applicable carryforward period.
- Disqualifying provisions: any distribution authority that is not purely charitable or not fixed by formula can jeopardize qualification.
- UBTI and acquisition indebtedness: property subject to a mortgage contributed to a charitable remainder trust may create debt-related tax issues and reporting consequences.
- Public charity versus private foundation distinction: affects the applicable deduction ceiling and related sub-limit analysis.
- Grantor trust rules: the trust should not be structured in a way that causes grantor trust status unless that result is affirmatively intended and analyzed.
- Cite the controlling authority for each proposition relied on, including the governing Internal Revenue Code provisions, Treasury Regulations, and any other recognized authority applicable to the issue.

## 4. Analytical scaffolds

1. For each proposed structure, review every distribution, payout, substitution, trustee, amendment, and funding provision and identify any term inconsistent with qualification requirements.
2. Identify the charitable remainder beneficiaries as public charities or private foundations, then apply the relevant deduction limitation framework for each class.
3. Compute the maximum achievable deduction by applying the applicable percentage limit, then test whether any carryforward is needed to reach the client’s objective.
4. Check the minimum-remainder test by applying the relevant valuation assumptions and confirm whether any feature pushes the remainder below the statutory floor.
5. Assess any mortgage, debt, or other encumbrance on proposed contributed assets and determine whether debt payoff, asset substitution, or different funding is required.
6. For annuity structures, confirm no additional contributions are contemplated after initial funding.
7. Evaluate trustee selection and administrative powers to confirm the structure does not inadvertently trigger grantor trust treatment.
8. For each structure, assess estate reduction and compare the extent to which the structure advances the client’s tax, cash-flow, family, and philanthropy goals.
9. Run the same analytical sequence for each structure rather than blending them into a single combined assessment.

## 5. Vertical / structural / temporal relationships

- Perform the deduction-limitation analysis chronologically: current-year deduction first, then any permitted carryforward in sequence.
- The valuation rate in effect on the contribution date governs the actuarial test and deduction computation; if multiple permissible valuation dates exist in the source set, analyze each separately.
- Where the source documents show multiple funding tranches or amendments over time, test each tranche against the governing rules at the time it is made.

## 6. Output structure conventions

- Use a goal-by-goal comparison: for each stated client goal, state whether each structure achieves, partially achieves, or fails the goal.
- Include an issue-by-issue analysis of problematic provisions, and for each issue state severity, governing rule or authority, scale or threshold, document interaction, and client consequence.
- Present deduction-limitation arithmetic and any carryforward analysis for each structure in a readable table or equivalent memorandum format.
- Include a comparison table that contrasts the two structures against each client goal and highlights tradeoffs.
- End with a recommendation that states which structure is preferred, why, and what drafting changes are required to cure identified deficiencies.
- Include a Recommended Actions section with imperative next steps, the responsible role, and a timing anchor tied to the transaction or filing milestone.
