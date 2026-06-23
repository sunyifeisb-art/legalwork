---
name: identify-issues-in-sale-and-contribution-agreement
task_id: structured-finance-securitization/identify-issues-in-sale-and-contribution-agreement
description: Identifying issues in a draft sale and contribution agreement for an auto loan securitization where true sale characterization, SPE separateness, early amortization linkage to servicer default, and alignment between governing law and the applicable perfection framework each require cross-document analysis.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Draft Sale and Contribution Agreement for Auto Loan Securitization

## 1. Subject-matter triage

- Treat the sale and contribution agreement as one node in a multi-document securitization package; review it together with the structure memo, SPE organizational documents, investor-side comments, and pool data before calling anything a defect.
- Confirm whether the assignment is singular or whether multiple classes, pools, closing dates, or transfer steps are in scope; if more than one, enumerate them first and analyze each separately.
- Focus on real transaction risk, not drafting preferences: flag only deficiencies that affect true sale, bankruptcy remoteness, perfection, priority, investor protection, or disclosure compliance.

## 2. Failure modes the skill is correcting

- Reading the transfer agreement in isolation and missing that a covenant or trigger appears in a related document but not here, or vice versa.
- Treating a broad repurchase or substitution feature as benign when it can signal retained control and true-sale recharacterization risk.
- Overlooking gaps between servicer default remedies and early amortization mechanics.
- Ignoring timing gaps between execution and filing/perfection steps.
- Assuming a governing-law clause resolves all perfection and priority questions.
- Missing asymmetry in assignment restrictions or cooperation obligations.
- Drafting issues as abstract commentary without severity, cross-document linkage, quantified scope, or concrete remediation.

## 3. Legal frameworks / domain conventions that apply

- True sale analysis turns on whether the transferor has effectively relinquished control and economic interest; authorities commonly analyze retained repurchase, substitution, and recourse features under the governing state commercial law and bankruptcy principles, including UCC Article 9 and Bankruptcy Code avoidance concepts.
- A seller’s unrestricted put-back or substitution power can indicate financing rather than sale, especially where the transferor can alter pool composition at will or reclaim assets without a narrow objective trigger.
- Perfection and priority are distinct from contract interpretation; the agreement’s governing-law clause controls contractual construction, while perfection typically follows the applicable Article 9 choice-of-law rules, filing location, and related transition provisions.
- Bankruptcy remoteness depends on both transactional covenants and organizational separateness provisions; review the sale document and entity governing documents together because a covenant missing from one may still matter.
- Early amortization is ordinarily used to protect investors from servicer deterioration; if a servicer termination event does not feed into amortization, the transaction may leave collections exposed under a failed administrator.
- Repurchase mechanics should restore the trust to the position it would have occupied absent the breach, using the document’s defined remedy structure and any linked cure, indemnity, or replacement mechanics.
- Assignment restrictions should be symmetrical enough to prevent one side from shifting obligations to a weaker counterparty while the other remains constrained.
- Post-closing reporting and cooperation provisions support trustee, servicer, and investor reporting obligations; absence of access and certification mechanics can impair compliance.
- Use the controlling authority framework that governs the issue raised; cite the relevant statute, code section, regulation, rule, or recognized doctrine when identifying the defect.

## 4. Analytical scaffolds

- Identify the clause at issue, quote or paraphrase only enough to locate it, then state the exact deficiency.
- Cross-check the clause against at least one related document or transaction exhibit that should align with it.
- Tie each defect to the transaction’s actual scale or exposure using the source materials, such as the affected pool, the closing transfer, the relevant covenant basket, or the timing window; do not invent numbers.
- State the practical consequence in transaction terms: true-sale risk, avoidance risk, investor underprotection, delayed perfection, enforcement uncertainty, or reporting failure.
- When a feature appears benign in isolation, test it against adjacent mechanics:
  - seller repurchase or substitution rights against eligibility and pool transfer provisions;
  - separateness covenants against LLC/operating agreement restrictions;
  - servicer default against amortization and termination mechanics;
  - governing law against the perfection regime used for the collateral type;
  - assignment restrictions against servicing, administration, or transfer obligations.
- For each issue, provide a concrete fix in drafting terms rather than a general observation; specify whether the cure is to narrow, add, align, condition, mirror, or cross-reference.
- Assign an ordinal severity level using a stated scale and apply it consistently across all issues.
- End each issue with the three closing moves: scope or scale, related-document interaction, and downstream consequence.

## 5. Vertical / structural / temporal relationships

- Read the agreement vertically: definition, operative transfer language, reps and warranties, covenants, remedies, and boilerplate may interact to create or cure risk.
- Read temporally: identify what happens at signing, at closing, upon discovery of a defect, upon servicer default, and after any filing or perfection step.
- If a provision only becomes harmful when paired with another clause, state the interaction explicitly rather than flagging the clause in isolation.
- If the document depends on a future filing, certificate, or notice, identify whether the obligation is immediate, concurrent, or delayed, and whether any gap leaves the transfer unperfected or the investor unprotected.
- If more than one transfer date, pool segment, or closing condition exists, separate the analysis by item and avoid collapsing them into a single representative review.

## 6. Output structure conventions

- Produce an issue memorandum with a short executive summary first, then numbered issues sorted by severity.
- Define the severity scale once at the top, then use it uniformly for every entry.
- For each issue include:
  - severity;
  - agreement section or clause reference;
  - cross-reference to the related document, schedule, or data point;
  - description of the deficiency;
  - practical risk;
  - recommended drafting resolution;
  - authority or doctrine supporting the concern.
- Keep each issue self-contained and complete; do not leave a defect at the level of observation alone.
- Use concise, transaction-facing language, and avoid generic legal platitudes.
- End with a Recommended Actions block that assigns next steps to the appropriate role and anchors them to the closing timeline or other transaction milestone.
- Use conventional memorandum formatting rather than a checklist or table unless the source material is best handled that way.
