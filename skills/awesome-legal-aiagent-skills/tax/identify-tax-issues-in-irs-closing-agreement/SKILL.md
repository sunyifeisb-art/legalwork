---
name: identify-tax-issues-in-irs-closing-agreement
task_id: tax/identify-tax-issues-in-irs-closing-agreement
description: Reviewing a draft IRS closing agreement for issues requires independently verifying computed amounts for directional and arithmetic correctness, assessing structural deficiencies such as missing treaty-relief protection, signing authority, and non-precedential language, and identifying any state tax reporting obligations triggered by the settlement.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in IRS Closing Agreement

## 1. Subject-matter triage (only if applicable)

- Treat the draft closing agreement as an issue-spotting and comparison task, not a drafting exercise.
- First identify whether the source set contains one or more adjusted items, jurisdictions, taxpayers, periods, or signatories; if there is more than one, enumerate them before analyzing each one.
- If only one item is actually in scope, say so explicitly and explain why the analysis does not branch.
- Confirm the controlling tax posture before analysis: federal settlement mechanics, any treaty-relief overlay, any reserve accounting effect, any state conformity or federal-adjustment reporting consequence, and any execution/authority requirement.

## 2. Failure modes the skill is correcting

- Accepting the closing agreement's stated settlement amount without independently checking whether the foreign tax credit adjustment is directionally correct; a misdirected credit adjustment can overstate or understate the settlement.
- Failing to reconcile the settlement figure against the underlying supporting documents, including any interest component, tax reserve balance, and any separate adjustment buckets that must be analyzed distinctly.
- Missing treaty-based relief language that preserves the taxpayer's ability to seek a correlative adjustment abroad and avoid double taxation.
- Overlooking whether the signatory has authority to bind the taxpayer and whether the agreement needs an officer certification or board approval support.
- Treating finality language as sufficient without checking that the agreement is also explicitly non-precedential for other periods or transactions.
- Missing state reporting duties triggered by a final federal adjustment, including deadlines, amended-return obligations, limitations-period consequences, and penalties.
- Collapsing the reserve analysis into a single net number without separating the incremental charge from any favorable reserve release.
- Accepting a lump-sum interest figure without a period-by-period computation that can be independently verified.

## 3. Legal frameworks / domain conventions that apply

- **Foreign tax credit mechanics:** The closing agreement must reflect the correct direction and magnitude of any foreign tax credit adjustment under the Internal Revenue Code and applicable regulations. A reduction in creditable foreign taxes generally increases U.S. tax; a deduction-based item can move differently. Verify the governing statutory and regulatory basis in the source materials and recompute the resulting settlement effect.
- **Closing-agreement authority and finality:** A closing agreement must be executed under the federal closing-agreement authority, and the document should be final and conclusive only as to the matters and periods covered. Check for authority to bind the taxpayer and for language limiting the agreement to the specific facts and years at issue.
- **Treaty relief / mutual agreement procedure:** If the settlement has cross-border transfer-pricing or double-tax consequences, the taxpayer may need express preservation of treaty-based relief rights, including a request for correlative relief under the applicable treaty article and mutual agreement procedure. Confirm the agreement does not waive or impair that path.
- **State federal-adjustment reporting:** Many states require prompt reporting of final federal tax changes, sometimes with amended returns, notices, or payment within a specified period after finality. Identify the implicated states from the source set and apply the relevant reporting rule or deadline referenced there or in generally recognized state procedure.
- **Financial reporting reserve convention:** If the settlement exceeds an existing tax reserve, the incremental expense and any reserve release must be analyzed separately so the net effect is not obscured. Compare the settlement to the reserve balance and note whether additional charge recognition is required before any release.
- **Interest computation convention:** Any stated interest should be supported by a period-specific computation tied to the relevant accrual periods and rates. A lump-sum amount should be flagged if the support is not traceable.
- **General citation discipline:** Every legal conclusion should be tied to a controlling authority, such as the relevant Code section, Treasury regulation, treaty article, state reporting rule, or other cited authority appearing in or supporting the source documents.

## 4. Analytical scaffolds

Issue-by-issue analysis with a uniform severity scale:
- Use an ordinal severity field for every issue, with one scale defined once at the outset and applied consistently.
- Rank issues by legal and economic consequence, then by execution risk.

For each issue, close the analysis with all of the following:
1. A quantified anchor drawn from the source documents or a clearly identified threshold in the record.
2. A cross-reference to the clause, schedule, exhibit, return position, reserve entry, or other document element that interacts with the issue.
3. A downstream consequence for the client, such as tax cost, double-tax exposure, reporting burden, execution defect, or financial statement impact.

Suggested issue sequence:
1. Foreign tax credit adjustment: verify the direction of the adjustment, recompute the settlement effect, and compare it to the stated amount.
2. Treaty relief / correlative adjustment: identify the affected cross-border item, check whether rights to seek foreign relief are preserved, and confirm the relevant treaty and procedure are referenced.
3. Authority and execution: identify the signatory, test binding authority, and confirm any internal approvals needed before execution.
4. Non-precedential language: verify that the agreement limits effect to the audited facts and periods and does not create precedent for other years or transactions.
5. State reporting: identify affected jurisdictions, reporting steps, deadlines, and any extension or penalty risk.
6. Reserve adequacy: compare the reserve to the settlement, isolate any incremental charge, and separate any reserve release.
7. Interest support: test whether the interest component is supported by a period-by-period calculation.

When a legal proposition is stated, pair it with the authority that supports it rather than describing the conclusion in the abstract.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Distinguish federal, treaty, state, and financial-reporting consequences; do not merge them into one bucket.
- Distinguish the base tax adjustment, interest, reserve charge, and reserve release; each has a different function and should be analyzed separately.
- Track timing from audited year to final agreement to state-reporting deadline to any foreign-relief filing window; sequencing matters.
- If more than one period, entity, or jurisdiction is involved, analyze each separately rather than using a representative example.
- If the agreement depends on a condition precedent, approval, certification, or filing, identify whether it must occur before signature, at execution, or after finality.

## 6. Output structure conventions

- Produce a concise issue memorandum, not a generic summary.
- Open with a short executive overview naming the highest-severity issues first.
- Provide a defined severity legend once, then apply it uniformly to each issue entry.
- For each issue, include: issue title, severity, governing authority, source-document cross-reference, analysis, and recommended fix.
- Keep the analysis comparative and concrete; if an amount, deadline, or authority is available, use it.
- Include a separate section for recommended actions that assigns each action to a responsible role and ties it to a deadline or milestone.
- End with a practical execution checklist covering signature readiness, filing/reporting follow-up, and any needed revision of the closing agreement before execution.
