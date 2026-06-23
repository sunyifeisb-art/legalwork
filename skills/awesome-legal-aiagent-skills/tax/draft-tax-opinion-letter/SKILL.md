---
name: draft-tax-opinion-letter-section-355
task_id: tax/draft-tax-opinion-letter
description: A federal income tax opinion letter on a spin-off transaction should analyze the statutory and regulatory requirements for a tax-free reorganization and distribution with multi-factor reasoning and factual support, and should address the principal requirements in separate sections with appropriate opinion qualification language.
activates_for: [planner, solver, checker]
---

# Skill: Draft Federal Income Tax Opinion Letter — Section 355 Spin-Off

## 1. Subject-matter triage
- Treat the transaction as a formal tax opinion letter for a Form 10 exhibit, not a deal memo or checklist.
- Identify whether the transaction involves one or more distributed businesses, a parent corporation, a controlled corporation, boot or debt proceeds, pre-closing asset reshaping, or any acquisition activity that could affect qualification.
- If the source set reflects only one spin-off structure, say so and analyze that structure directly; if it reflects multiple alternatives or entities, enumerate them first and analyze each separately.
- Gather the facts needed to support an opinion: ownership, asset and business history, distribution mechanics, debt and cash flows, investment assets, intercompany items, and any representations that bear on intent, use of proceeds, or acquisition plans.

## 2. Failure modes the skill is correcting
- Announcing tax-free conclusions without tying them to the governing statutory and regulatory tests.
- Skipping the anti-abuse overlays that can defeat qualification even when the core statutory elements appear met.
- Failing to analyze cash, debt, or other non-stock property received in the transaction and whether any required use or retirement occurs within the permitted window.
- Omitting the earnings-and-profits allocation methodology or leaving shareholder basis and holding-period consequences unstated.
- Writing a conclusory opinion that does not separate each principal requirement into its own reasoned section.
- Using absolute language where tax opinions conventionally require a graduated level of confidence and explicit reliance on assumptions and representations.
- Citing conclusions without naming the controlling Code, regulation, or other authority that supports them.

## 3. Legal frameworks / domain conventions that apply
- **Section 355 and related reorganization rules.** Analyze the distribution under the governing provisions for tax-free spin-offs and any related corporate reorganization rules, including nonrecognition treatment for the transfer of assets and distribution of stock or securities. Coordinate corporate-level consequences with shareholder-level consequences where relevant.
- **Active trade or business.** Address the operating history of each business, the required period of active conduct, and any acquisition, contribution, or restructuring history that could affect continuity. If continuity or expansion doctrine is implicated, apply it to the facts and cite the rule being used.
- **Device prohibition.** Evaluate whether the transaction is principally a device for distributing earnings and profits. Consider pro rata mechanics, cash-rich balance sheets, investment assets, and any prearranged dispositions or redemptions, while also weighing business purpose and continuity indicators.
- **Plan / acquisition overlays.** If there are acquisitions, discussions, or nearby transactions that could be integrated with the distribution, analyze whether the facts suggest a plan or arrangement that could disqualify the transaction. Rely on explicit representations where appropriate and identify any presumptions or rebuttal concepts that control.
- **Boot and proceeds limitations.** If non-stock property, cash, or debt proceeds are received, analyze whether they are distributed to qualifying recipients or applied to qualifying debt retirement within the applicable period, and identify any excess that could produce corporate gain.
- **Investment asset mix.** Apply the applicable post-transaction asset-ratio concept to determine whether either corporation has an impermissible concentration of passive investment assets immediately after any required step. Identify the asset classes used in the analysis and state the governing ratio concept.
- **Earnings and profits.** State the methodology for allocating earnings and profits between the corporations, typically using relative value principles under the applicable rules, and describe the result in principled terms.
- **Opinion qualification language.** Use the customary graduated confidence formulation for each legal conclusion. Include standard caveats: current-law basis, reliance on representations, assumptions as to facts, and the nonbinding nature of the opinion on taxing authorities.

## 4. Analytical scaffolds
- Start with a concise facts section that captures the ownership structure, businesses conducted, distribution mechanics, debt and cash elements, relevant transaction history, and any items the analysis depends on.
- For each principal tax requirement, use a separate headed section and reason from facts to rule to conclusion:
  - active trade or business,
  - device,
  - acquisition / plan issues,
  - boot or proceeds use,
  - asset-mix / investment-property concerns,
  - earnings-and-profits allocation,
  - nonrecognition and related tax consequences.
- In each section, cite the controlling authority by name and section or regulation, then apply the facts to the rule.
- Where more than one corporation, business, asset pool, or transaction step matters, enumerate the items first and then analyze each item in the same order.
- Do not collapse distinct statutory or factual questions into a single conclusion; separate them when the governing analysis differs.
- Use factual qualifiers only where supported by the source documents, and flag any assumption that the opinion depends on.
- Close each conclusion with calibrated opinion language rather than an absolute guaranty.
- End with a caveats section that states the current-law basis, reliance on representations, factual assumptions, and nonbinding status.

## 5. Vertical / structural / temporal relationships
- Track how pre-transaction history affects post-transaction qualification, especially where a business was acquired, combined, or expanded before the distribution.
- Track how distribution mechanics interact with later events, including any planned sales, redemptions, debt repayments, or asset transfers that occur around the same time.
- When the analysis depends on a lookback or hold period, state the relevant timing relationship and tie the conclusion to the period actually covered by the facts.
- When multiple entities are involved, state which entity holds which assets, which entity conducts which business, and which entity bears any gain, debt, or allocation consequence at each step.
- If a single factual point affects more than one test, analyze its effect in every affected section rather than assuming the conclusion carries over.

## 6. Output structure conventions
- Draft as a formal tax opinion letter addressed to the board of directors or equivalent governing body of the relevant corporation.
- Use conventional opinion-letter organization with a factual recitation, issue-specific analysis sections, calibrated conclusions, and a separate caveats / assumptions section.
- Write in the tone of a real external opinion, not a note or outline.
- Keep the opinion self-contained: every legal conclusion should be paired with the rule supporting it and the facts making it applicable.
- If the source documents support only a single transaction path, state that and avoid unnecessary alternative analysis.
- If the transaction involves several entities or steps, enumerate them before analysis and preserve that ordering throughout the letter.
- Conclude with the standard limitations section rather than embedding caveats inside the merits analysis.
- Produce the opinion as the named deliverable file, `tax-opinion-letter.docx`.
