---
name: extract-ballot-tallies-from-voting-report
task_id: bankruptcy-restructuring/extract-ballot-tallies-from-voting-report
description: Ensures a ballot tabulation spreadsheet applies the applicable voting-acceptance threshold to each class independently, logs ballot irregularities with their legal basis and recommended treatment, and models sensitivity scenarios showing whether class results change when irregular ballots are excluded or included.
activates_for: [planner, solver, checker]
---

# Skill: Extract Ballot Tallies from Voting Report

## 1. Subject-matter triage

- Treat the voting report as the primary source of truth for ballot extraction, but cross-check against any attached exhibits, notices, objections, or court orders that affect whether a ballot is counted.
- First enumerate each voting class or claimant pool in scope, then process each class separately; do not merge classes or infer class-wide results from a subset.
- If only one class exists, say so explicitly and explain why no cross-class comparison is needed.
- Confirm whether the report contains ballots that are timely, late, duplicate, designated, provisional, partially completed, insider, or otherwise challenged before tabulating results.

## 2. Failure modes the skill is correcting

- Agent produces a summary table without reconciling the ballot population against excluded and non-voting holders for each class.
- Agent records counts but omits irregular ballots, the reason each ballot is treated as irregular, and the legal basis for inclusion, exclusion, or provisional treatment.
- Agent fails to verify whether the reported tallies mathematically tie to the underlying ballot detail and class totals.
- Agent gives one global acceptance result instead of determining acceptance independently for each class under the applicable voting standard.
- Agent omits scenario testing for alternative treatments of irregular ballots, so the spreadsheet does not show whether class outcomes change under different assumptions.
- Agent states a conclusion that a class accepts or rejects without identifying the governing rule that supports that conclusion.

## 3. Legal frameworks / domain conventions that apply

- Apply the governing plan-voting or solicitation standard to each class independently; acceptance is class-specific unless the source documents expressly provide otherwise.
- Use the plan, disclosure statement, voting procedures, court order, and any applicable confirmation-order or solicitation-order language as the controlling authorities for whether a ballot counts.
- Designated ballots excluded by court order or ballot instruction are not included in the acceptance calculation; record the designation basis and the consequence for the tally.
- Late ballots are generally excluded unless the governing order or procedures provide a basis to count them; identify the controlling provision before including any late vote.
- Duplicate ballots require identification of the controlling ballot under the governing procedures; log the duplicate and state which ballot governs.
- Provisional, contingent, or disputed claims may require separate treatment; identify whether the vote is counted, counted provisionally, or excluded under the governing authority.
- Insider or affiliated ballots may require separate analysis under the voting rules or confirmation framework; test a scenario that isolates their effect when relevant.
- For each class, reconcile total allowed claims, counted ballots, excluded ballots, and non-voting holders to the class total reflected in the report.
- For rejecting or deemed-rejecting classes, identify the downstream confirmation implication tied to class-level acceptance under the governing bankruptcy framework.
- Cite the controlling authority for each legal proposition in the spreadsheet notes or narrative cell: identify the plan provision, court order, rule, or other authority that supports the treatment.

## 4. Analytical scaffolds

- Build the workbook from the report in a source-first sequence: extract the raw ballot data, normalize class labels, reconcile totals, then compute class-level summaries.
- For each class, calculate and verify:
  - total allowed claims amount
  - total holders
  - accepting ballots by count and amount
  - rejecting ballots by count and amount
  - excluded ballots by count and amount
  - non-voting holders by count and amount
  - acceptance percentages by count and by amount
  - stated result and whether the threshold is met
- Do not hardcode assumptions when a field is ambiguous; instead, flag the ambiguity and carry it into the irregularities or notes section.
- If the report provides multiple tallies or footed tables, reconcile them against each other before populating the summary tab.
- Treat every discrepancy as a separate item: identify the affected class, the source figures, the mismatch, the likely cause, and the corrective treatment.
- For each irregular ballot, record enough detail to permit traceability back to the source report without reproducing unnecessary narrative.
- Where the report uses alternative treatment rules, model the baseline and the alternative scenario side by side so changes in class outcome are visible.
- If a scenario does not change the class outcome, state that explicitly rather than leaving the tab blank.
- If a scenario is not applicable to a class, mark it as not applicable with the reason.

## 5. Vertical / structural / temporal relationships

- Preserve the hierarchy from debtor or plan class to individual ballot to irregularity and then to scenario treatment.
- Keep summary-level results tied to the class, while detail-level entries stay tied to a specific ballot, creditor, or claim.
- Where the report contains date-sensitive voting information, distinguish timely, late, and otherwise time-qualified ballots in the detail tab.
- Where a ballot is designated, excluded, or treated provisionally after a later order or instruction, reflect the temporal basis for that treatment.
- If a ballot is corrected, superseded, or duplicated, retain the sequence of events so the spreadsheet shows which submission controlled at each point.
- Ensure the sensitivity tab compares like with like: same class, same underlying allowed claim base, different treatment assumption.

## 6. Output structure conventions

- Output a spreadsheet named `ballot-tabulation-summary.xlsx`.
- Use industry-conventional tabs rather than a rubric-like checklist; include a primary summary tab, a ballot-level detail tab, an irregularities tab, and a scenario/sensitivity tab.
- The summary tab should present one row per class with the class-level totals, percentages, result, threshold status, and a concise note field for key reconciliation points.
- The detail tab should present one row per ballot or voting record with creditor or holder name, class, claim amount, vote direction, timing status, counted/excluded/provisional status, and any designation or exclusion reason.
- The irregularities tab should present one row per issue with a short description, affected record, amount, controlling authority, treatment taken, and any discrepancy noted.
- The sensitivity tab should present alternate treatment assumptions and the resulting class outcome, with enough context to show whether the result changes.
- Include a short notes or commentary area in the workbook for the governing authority, assumptions used for ambiguous entries, and any class-level confirmation implications for rejecting classes.
- Where a discrepancy exists, flag it plainly in the workbook rather than burying it in prose; the reader should be able to identify mismatches from the spreadsheet alone.
- Before finishing, verify that the workbook is populated, internally consistent, and saved under the required filename.
