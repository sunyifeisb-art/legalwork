---
name: proxy-statement-sec-compliance-gap-analysis
task_id: corporate-governance/compare-proxy-statement-disclosures-against-sec-regulatory-requirements
description: Proxy statement compliance gap analysis identifying deficiencies in compensation disclosures, related-person disclosures, beneficial ownership disclosures, governance disclosures, equity-compensation reporting, insider-trading policy disclosures, and fee disclosures against applicable SEC regulatory requirements.
activates_for: [planner, solver, checker]
---

# Skill: Proxy Statement Disclosures vs. SEC Regulatory Requirements

## 1. Subject-matter triage

- Treat the draft proxy statement, supporting documents, and internal checklist as a comparison set; verify each disclosure area against the controlling SEC disclosure rule rather than relying on checklist labels.
- Separate disclosure topics that may appear adjacent in the proxy but are governed by different rules, including compensation, related-person transactions, ownership, governance, equity-plan reporting, trading policy, and audit fee disclosures.
- If only a subset of topics is actually in scope for the source package, state that explicitly and analyze only the in-scope items; do not assume all proxy topics are present.
- Before analysis, enumerate the disclosure categories actually present in the source set and map each to the corresponding source document(s) to avoid collapsing multiple disclosure obligations into one review pass.

## 2. Failure modes the skill is correcting

- Treating the internal checklist as dispositive without independently verifying each item against the underlying proxy draft and source materials.
- Merging distinct SEC disclosure obligations that share subject matter but require separate statements, tables, or narrative explanations.
- Comparing figures across documents without confirming that the same definition, period, and calculation convention is being used in each source.
- Accepting a “not applicable” or “compliant” designation where the underlying materials show a missing, incomplete, or internally inconsistent disclosure.
- Overlooking how a single questionnaire error can propagate into compensation, related-person, and ownership disclosures simultaneously.
- Stopping at issue identification without tying the deficiency to the controlling rule, the document conflict, and the filing consequence.
- Drafting a memo that lists problems but does not prioritize them for filing risk and remediation sequence.
- Failing to distinguish a disclosure gap from a source-data reconciliation problem that must be fixed before filing.

## 3. Legal frameworks / domain conventions that apply

- CD&A: review whether the narrative explains how compensation decisions are made and how any performance-based award is determined; for performance metrics, confirm the proxy discloses the metric, target, actual achievement, and resulting payout logic under Regulation S-K Item 402.
- Summary Compensation Table: confirm the reported amounts follow the required SEC methodology and are not inconsistent with committee-approved amounts merely because one source uses a different definition.
- Compensation committee interlocks: determine whether any director or executive relationship creates a reportable interlock under Regulation S-K Item 407 and related proxy disclosure requirements.
- Related-person transactions: assess whether a transaction, relationship, or arrangement involving a related person must be disclosed under Regulation S-K Item 404 and whether a material interest is present.
- Beneficial ownership: verify the beneficial ownership table against the applicable Exchange Act ownership standard and related disclosure rules, including indirect ownership and derivative holdings where required.
- Governance and board service disclosures: confirm the proxy adequately addresses director qualifications, time commitments, committee service, and any overboarding concerns consistent with proxy disclosure practice and applicable SEC requirements.
- Pay Versus Performance: if the company is subject to the rule, confirm the table covers the fiscal years required under Regulation S-K Item 402(v) for the company’s reporting posture.
- Insider-trading policy: confirm the proxy separately addresses hedging and pledging, rather than collapsing them into a single general prohibition if separate disclosure is required by the company’s policy or proxy convention.
- Section 16 delinquent filings: identify late Forms 3, 4, or 5 disclosures for directors and executive officers and confirm the proxy discloses them in the manner required by Exchange Act Section 16 and related rules.
- Audit fees: review the fee categories and year-over-year changes against the proxy fee disclosure requirements under Regulation S-K Item 9(e) and related audit committee disclosure conventions.
- Internal checklist review: treat checklist status as a hypothesis to be verified, not a legal conclusion; the controlling authority remains the SEC rule implicated by the disclosure topic.

## 4. Analytical scaffolds

- Use a topic-by-topic verification grid: for each disclosure category present, identify the governing rule, the source documents reviewed, the proxy language, the discrepancy if any, and the corrective action.
- For compensation narratives, test whether each described incentive or payout component is traceable to a metric, target, achievement level, and payout formula, and whether the result disclosed in the proxy matches the underlying source data.
- For committee interlocks and related-person issues, cross-check questionnaires, governance materials, and officer/director disclosures for overlapping relationships before deciding whether the proxy is complete.
- For ownership disclosures, reconcile the beneficial ownership table against the latest ownership reports and any other public ownership statement in the source set; flag unexplained mismatches.
- For governance disclosures, assess whether the proxy adequately explains board oversight, director commitments, and any time-conflict issue in a way that supports the board’s stated conclusion.
- For PVP, determine the required year count from the company’s reporting status and confirm the table spans that full period.
- For hedging and pledging, examine whether the proxy separately addresses each policy topic and whether any omission or combined treatment creates an incomplete disclosure.
- For audit fees, compare the reported categories and explanatory narrative to the prior period and assess whether a material shift is adequately explained.
- For each issue, state the governing rule, the factual mismatch, the filing impact, and the recommended correction in the same entry so the memo remains filing-oriented rather than abstract.
- Assign an ordinal severity to each issue using a consistent scale defined once at the top of the memo, and apply it uniformly.
- When an issue depends on multiple source documents, identify all relevant documents and resolve the inconsistency rather than citing only the draft proxy.
- If the source set contains only one relevant example of a topic, state that expressly and explain why no broader sampling is possible.

## 5. Vertical / structural / temporal relationships

- Questionnaire responses often feed multiple disclosure sections; treat outdated or incomplete questionnaires as a systemic risk, not a single-section problem.
- Compensation calculations should be reconciled before filing because a pre-filing correction is materially less costly than post-filing amendment or investor-relations remediation.
- Some disclosures are period-sensitive: ownership, audit fees, PVP, and delinquency reviews may depend on the latest fiscal year or most recent filing window, so confirm the operative period before comparing numbers.
- Where the proxy references one source date and the supporting documents use another, note the temporal mismatch and explain whether it affects the disclosure conclusion.

## 6. Output structure conventions

- Produce a prioritized compliance gap analysis memorandum, not a generic summary.
- Open with a short severity key, then present numbered findings in descending severity.
- For each finding, include: the disclosure topic; the controlling SEC authority; the deficiency; the source-document conflict or omission; the filing consequence; and the recommended fix.
- Make each finding self-contained and concrete; do not rely on a later section to supply the rule, the facts, or the remediation.
- Include a dedicated checklist-verification section identifying every internal checklist entry that is unsupported, misclassified, or contradicted by the source documents.
- Include a cross-document reconciliation section for mismatches between the proxy draft and supporting materials.
- End with a Recommended Actions block that assigns an imperative next step to the responsible role and ties it to the filing deadline or the next regulatory milestone.
- Write the memo so it can be dropped into a Word document as the operative product for the filing team.
