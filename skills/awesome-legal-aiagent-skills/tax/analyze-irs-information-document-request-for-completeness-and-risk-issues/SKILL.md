---
name: analyze-irs-idr-for-completeness-and-risk-issues
task_id: tax/analyze-irs-information-document-request-for-completeness-and-risk-issues
description: An IDR analysis memorandum should address each request item, identify the legal and factual issues raised, estimate the associated tax and penalty exposure where possible, and recommend an audit strategy — not merely catalog what the IRS asked for.
activates_for: [planner, solver, checker]
---

# Skill: Analyze IRS Information Document Request for Completeness and Risk Issues

## 1. Subject-matter triage (only if applicable)

- Treat the IDR as a sequenced issue-spotting exercise, not a document inventory.
- Read the request set as a whole before analyzing any single item; the point is to infer the IRS theory, not just answer isolated asks.
- If the source set includes multiple tax years, entities, return positions, or form families, enumerate them first and analyze each separately.
- If only one year, one entity, or one issue is actually in scope, state that explicitly and explain why.

## 2. Failure modes the skill is correcting

- Answering only the obvious requests while skipping technical, narrow, or evidentiary items that may drive the audit narrative.
- Treating the memo as a checklist of requested documents rather than an analysis of legal exposure and defense posture.
- Failing to distinguish substantive income tax adjustments from separate penalty regimes, especially information-reporting penalties.
- Omitting the interaction among related requests, where one item may corroborate, undermine, or expand the risk raised by another.
- Giving issue descriptions without a consequence, severity, and next-step recommendation.
- Using legal conclusions without identifying the governing authority that supports them.
- Losing sight of audit strategy: the memo must tell the client what response posture fits each issue.

## 3. Legal frameworks / domain conventions that apply

- **Issue-specific tax law:** For each item, identify the governing Code provision, Treasury regulation, or other controlling authority that determines whether the position is correct.
- **Penalties:** Evaluate accuracy-related penalties, information-return penalties, and any other applicable penalty regime separately from the underlying tax adjustment.
- **Interest:** Where exposure is estimated, include interest as a distinct component tied to the applicable federal tax rules.
- **Basis and depreciation:** When the IDR implicates depreciation, basis, or asset disposition, test whether adjusted basis reflects prior elections, prior deductions, and accumulated depreciation before the current-year computation.
- **Loss and reimbursement offsets:** If the facts involve insurance proceeds or similar reimbursements, test whether the claimed deduction or loss must be reduced by the offsetting recovery.
- **Temporal applicability:** If the request points to a deduction, credit, or reporting rule whose availability may have changed across years, confirm the rule in force for the relevant period before stating exposure.
- **International reporting:** If the IDR suggests a possible failure to file required international information returns, assess that filing failure as a separate exposure stream from any income tax issue.
- **Authority standard:** Every substantive proposition should be anchored to a named authority, not just framed as a conclusion.

## 4. Analytical scaffolds

- Work item by item in the same order as the IDR.
- For each request item, do four things: identify the legal issue, state the taxpayer’s apparent position, state the correct position if the record supports one, and estimate the resulting exposure.
- Scale each issue against a concrete source-document figure, timing point, or threshold where available; do not leave an issue abstract.
- Cross-reference related documents, schedules, or requests that interact with the item, especially where one item corroborates, contradicts, or amplifies another.
- State the downstream consequence of the issue: tax adjustment, penalty, reporting failure, exam expansion, settlement leverage, or documentation burden.
- Rate the issue on a uniform ordinal scale defined once in the memo, and apply that scale consistently.
- For every issue, identify a recommended audit posture: concede, contest, narrow, supplement, settle, or seek penalty abatement, as appropriate to the facts.
- If exposure can be estimated, present the components separately rather than blending them into one number.
- If the source set does not permit a reliable numeric estimate, say so and explain what additional information is needed.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Where the IDR links multiple years, entities, accounts, or reporting regimes, map those relationships before analysis.
- Note whether one request depends on another request, or whether a supporting document may resolve several items at once.
- If a period-specific rule, filing deadline, or election date matters, place the issue in time and explain why that timing changes the analysis.
- If the same facts create both an income tax issue and a separate reporting or penalty issue, keep those tracks distinct while explaining how they interact.
- When an item appears minor in isolation but is part of a broader pattern, state that pattern and the audit implication.

## 6. Output structure conventions

- Produce a tax issue memorandum in the same sequence as the IDR items.
- Give each entry a short title, then: request summary, legal issue, taxpayer position, correct position, exposure, severity, audit strategy, and supporting authority.
- Use a consistent severity legend at the top of the memorandum, such as Critical / High / Medium / Low, and apply it to every item.
- For each item, include the issue’s scale, cross-reference to related source materials, and downstream consequence.
- Where exposure is available, break it into tax, penalty, interest, and total exposure; where not, explain the limiting factor.
- Conclude with a concise summary table ranking the items by severity and response priority.
- End with an explicit Recommended Actions block that assigns the next step to a responsible role and ties it to a practical timing anchor derived from the audit process or the source documents.
