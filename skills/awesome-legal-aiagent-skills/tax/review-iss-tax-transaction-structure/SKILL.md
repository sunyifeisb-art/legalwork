---
name: review-iss-tax-transaction-structure
task_id: tax/review-iss-tax-transaction-structure
description: Reviewing a tax transaction structure memorandum for a § 338(h)(10) deal requires independently verifying the aggregate deemed sale price computation against the applicable regulatory formula, identifying structural issues that could affect the election, and flagging state conformity risks by jurisdiction.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Tax Transaction Structure Memorandum

## 1. Subject-matter triage (only if applicable)

- Use this skill for issue-spotting and gap review of a transaction tax memorandum supporting a stock acquisition structured with a § 338(h)(10) election.
- Triage the source set before analyzing: identify the memorandum, purchase agreement, entity tax records, equity roll materials, organizational documents, key operating contracts, license schedules, and state footprint materials.
- If the deal involves multiple target entities, multiple states, or multiple shareholder classes, treat each as a distinct review lane and do not blend them into one generalized risk statement.

## 2. Failure modes the skill is correcting

- Accepting the memorandum’s deemed sale price analysis without independently checking the governing formula and the allocation that follows from it.
- Flagging state conformity only in general terms rather than jurisdiction by jurisdiction.
- Missing the partnership hot-assets issue when the target or a subsidiary holds a partnership interest.
- Overlooking consent, transfer, or right-of-first-refusal provisions in operating agreements and material contracts that may react differently to a deemed asset sale structure.
- Treating non-transferable licenses as merely operational when they also create valuation and allocation inconsistencies.
- Ignoring rollover equity mechanics that can make shareholder consent or election mechanics unstable.
- Failing to test S-corporation validity and the interaction with shareholder eligibility.
- Missing trapped C-corporation tax attributes that may retain limited value only at the corporate level.

## 3. Legal frameworks / domain conventions that apply

- **§ 338(h)(10) and the Treasury regulations:** Verify the deemed asset sale treatment under the governing election rules and the implementing regulations, including the purchaser’s assumed liabilities treatment and the computation of aggregate deemed sale price. Cite the applicable Code provision and regulation section when discussing the rule.
- **All-shareholder consent requirement for S-corporation election treatment:** Confirm that the relevant shareholders can validly consent and that the election mechanics are not undermined by a rollover or other non-cash consideration structure. Cite the S-corporation election rules and election-consent provisions.
- **S-corporation eligibility rules:** Test whether any disqualified shareholder, trust issue, foreign owner issue, or other eligibility defect could invalidate the S status at a relevant time.
- **Partnership hot-assets rules:** If an equity interest in a partnership is held, apply the partnership disposition rules requiring ordinary income treatment for unrealized receivables and substantially appreciated inventory. Cite the partnership gain-character rules and related regulations.
- **Change-of-control and transfer restrictions:** Review operating agreements, JV agreements, and material contracts for transfer, consent, and ROFR provisions that may be triggered by a deemed asset sale even where a straight stock transfer would not.
- **Non-transferable license rules:** Identify licenses that cannot transfer by operation of law and assess whether the memorandum’s valuation and purchase-price allocation are internally consistent with that constraint.
- **State conformity rules:** Compare each significant operating jurisdiction’s conformity to the federal election and note the consequences for basis, gain character, and filing posture in that jurisdiction.
- **Corporate attribute limitation rules:** If the target came from C-corporation status, determine whether credits or similar attributes are trapped at the entity level and whether any statutory carry use is available only against residual corporate-level tax.

## 4. Analytical scaffolds

- Start by listing the distinct review populations: target entities, shareholder groups, partnership interests, significant states, material contracts, and material licenses. Analyze each population separately.
- For each issue, close the loop with three moves: identify the relevant scale from the source set, cross-reference the interacting document or provision, and state the downstream transaction, tax, or operational consequence.
- When discussing deemed sale price or allocation, apply the governing formula first, then test whether the memo’s allocation, residual, and goodwill treatment remain coherent.
- When discussing state conformity, build a jurisdiction-by-jurisdiction matrix rather than a narrative paragraph.
- When discussing contract and license restrictions, tie the trigger language to the chosen structure and explain whether the consequence is legal, commercial, or allocation-related.
- When discussing S-status and shareholder consent, test the election mechanics against the shareholder record and closing structure, not against the purchase agreement alone.
- When discussing trapped attributes, state both the source period and the permitted use period or limitation.
- Every legal conclusion should be tied to a cited authority by name and section or comparable controlling source.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Distinguish between federal tax consequences, state tax consequences, and non-tax commercial consequences; do not collapse them into one issue.
- Distinguish between pre-closing eligibility facts, closing mechanics, and post-closing filing or compliance effects.
- If the memo relies on a deemed asset sale concept, test whether that deeming affects: allocation, license transferability, covenant triggers, shareholder consent, and state filing positions.
- If multiple jurisdictions appear in the source materials, review them individually and note any non-conforming state separately.
- If multiple contracts or licenses are implicated, analyze each one that is material rather than referencing the category as a whole.

## 6. Output structure conventions

- Produce an issue-spotting report, not a rewrite of the memorandum.
- Use an ordinal severity scale defined once at the top of the report and apply it uniformly to each issue.
- Organize the body by severity, with the most serious issues first.
- For each issue, include: severity, concise issue statement, governing authority, source-document cross-reference, quantified or scoped impact from the record, downstream consequence, and recommended action.
- Include a dedicated executive summary that highlights the highest-severity items and the practical closing or filing implications.
- Include a jurisdiction-by-jurisdiction table for state conformity analysis with columns for jurisdiction, conformity status, consequence, and action.
- End with an explicit Recommended Actions section that assigns the action to an appropriate role and anchors timing to the relevant closing, filing, or diligence milestone.
