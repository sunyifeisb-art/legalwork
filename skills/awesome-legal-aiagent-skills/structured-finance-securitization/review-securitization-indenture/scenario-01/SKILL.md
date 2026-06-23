---
name: review-equipment-lease-abs-indenture-scenario-01
task_id: structured-finance-securitization/review-securitization-indenture/scenario-01
description: Review a draft indenture for an equipment lease receivables securitization from the sponsor's perspective. Assess waterfall mechanics, trigger mechanics, optional redemption economics, servicing transition mechanics, bankruptcy-remoteness package completeness, and consistency between representations and pool data.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Draft Indenture for Equipment Lease Receivables Securitization (Scenario 01)

## 1. Subject-matter triage
- Treat this as a sponsor-side issue-spotting and comparison exercise across the draft indenture and the attached transaction documents.
- Focus on deviations from market-standard securitization drafting, internal inconsistencies, and closing-date mismatches that should be resolved before finalization.
- If only one tranche, trigger, or account appears in scope, say so expressly and analyze that item directly rather than assuming additional structures.

## 2. Failure modes the skill is correcting
- Missing a closing-date mismatch between delinquency representations and pool data; analyze it as a present drafting or disclosure problem, not a future performance contingency.
- Overlooking mismatches between tranche labels and the stated interest-rate structure, especially where the label signals money-market-style treatment.
- Treating an issue as complete after description alone, without tying it to document cross-references, scale, and client impact.
- Failing to distinguish between ordinary structural provisions and provisions that alter investor protection in stress.
- Missing non-standard servicing transition language or optional redemption mechanics that leave the sponsor with avoidable economics or operational risk.
- Failing to identify incomplete bankruptcy-remoteness protections or a weak servicer-advance standard.
- Relying on stylistic comparison only, instead of verifying whether the draft terms align with comparative deal materials and sponsor-side drafting norms.

## 3. Legal frameworks / domain conventions that apply
- Reserve account replenishment priority: confirm where replenishment sits in the waterfall relative to principal distributions; if replenishment is pushed too far down, the reserve may not rebuild when credit support is most needed.
- Subordinate interest deferral and paydown mechanics: if a trigger accelerates amortization, check whether subordinate interest and principal are also redirected away from lower-priority payments; if not, senior protection may be diluted during stress.
- Early amortization / rapid-paydown triggers: identify any cure period, its duration, and whether it is unusually permissive for the structure; prolonged cure mechanics can delay the intended shift into protection mode.
- Optional redemption economics: confirm whether any issuer-side redemption occurs at par, at a premium, or with a make-whole equivalent; if redemption is at par without investor compensation, analyze the negative-convexity and reinvestment-risk consequences.
- Clean-up call mechanics: ensure the call price is drafted to sweep principal, interest, fees, expenses, and any residual liabilities; omitted components can leave the transaction short of full discharge.
- Servicing transition mechanics: compare any replacement-servicer transition period to market expectations for transfer of collections, reporting, and account control; an extended transfer period can create an operational gap.
- Loss-trigger calibration: compare cumulative-loss or similar triggers to historical portfolio performance and the supplied pool data; a trigger set too near expected performance may fire prematurely and alter investor economics.
- Bankruptcy remoteness package: confirm the presence of the standard non-petition covenant, separateness covenants, and a non-consolidation opinion requirement; the controlling concepts are the customary bankruptcy-remoteness protections used in ABS structures.
- Servicer advance recoverability: check whether the stop-advance standard depends solely on the servicer’s own non-recoverability determination; a self-interested standard can create a conflict in deciding whether advances remain recoverable.
- Delinquency representation and pool-data consistency: compare any delinquency threshold in the reps to the pool schedule as of closing; an inconsistency is a closing-date issue requiring correction or disclosure adjustment.
- Successor trustee qualifications: if the draft conditions successor trustee appointment, confirm the standards are specific enough to be workable and protective rather than vague or circular.
- Applicable authority should be named when a legal conclusion depends on a governing rule, standard, or customary doctrine reflected in the source set or generally recognized in securitization practice.

## 4. Analytical scaffolds
1. Start with a document map: identify the relevant sections in the indenture, then cross-check them against the pool data, servicing provisions, call provisions, trigger provisions, and any ancillary transaction documents.
2. For each issue, anchor the analysis to a concrete threshold or scale from the source materials: transaction size, pool balance, delinquency bucket, trigger level, transition period, or redemption price.
3. Cross-reference the affected provision with any other clause that changes its operation, such as a waterfall term that interacts with a trigger or a call provision that interacts with residual obligations.
4. State the consequence in business terms: whether the issue affects credit support, investor economics, operational continuity, bankruptcy remoteness, or closing certainty.
5. If a drafting point is non-standard but intentional, say so and identify the evidence of intentionality from the transaction materials rather than treating the deviation as a defect.
6. For each issue, include a severity classification using a single ordinal scale stated once at the top of the memo and applied consistently.

## 5. Vertical / structural / temporal relationships
- Analyze waterfall and trigger provisions together, not separately, because a trigger can change the priority of distributions and a weak replenishment step can compound that effect.
- Analyze optional redemption and clean-up call language together, because multiple exit paths can create different economics for the sponsor and different reinvestment outcomes for investors.
- Analyze servicing transition language together with account-control and reporting provisions, because a delayed transfer can impair both collections and investor transparency.
- Analyze delinquency representations against the closing pool data as of the same measurement date, because the issue is temporal and should not be treated as forward-looking performance risk.

## 6. Output structure conventions
- Produce a sponsor-side issues memorandum in conventional legal-memo form, organized by topic area such as waterfall and triggers, structural economics, servicing mechanics, bankruptcy-remoteness package, and pool-data consistency.
- Define the severity scale once near the start, then apply it to every issue entry.
- For each issue, include: a concise issue statement, the indenture section reference, the cross-referenced source document or clause, the scale or threshold that makes the issue material, the downstream consequence for the sponsor or transaction, the severity label, and a recommended fix.
- Tie each issue to a practical resolution path: revise language, clarify economics, align the pool schedule, or confirm that the non-standard term is intentional and disclosed.
- End with a Recommended Actions block that assigns the action to the relevant deal role and gives a timing anchor tied to signing, closing, or final document circulation.
- Use controlling authority by name when a point depends on a legal rule or recognized securitization doctrine; do not state conclusions as bare assertions.
- Do not reproduce internal document quotes except where necessary for quotation-based comparison, and keep the memo focused on real issues rather than stylistic preferences.
