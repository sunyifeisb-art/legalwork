---
name: identify-preference-exposure-analysis
task_id: bankruptcy-restructuring/identify-preference-exposure-analysis
description: Ensures a preference exposure review memo checks the preparer's calculations, identifies transfers that may be subject to extended look-back treatment, applies the correct limitations period for avoidance actions, and confirms that only qualifying post-transfer new value is credited.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Preference Exposure Analysis

## 2. Failure modes the skill is correcting

- The analysis accepts the preparer’s exposure figures without independently verifying transfer dates, payment amounts, look-back treatment, or new value offsets.
- The report misstates the avoidance window, including by applying an ordinary period to recipients that may qualify for an extended look-back.
- The report credits new value that was delivered before the transfer, rather than only post-transfer new value, or otherwise misstates the timing basis for the defense.
- The report omits entity-level errors, pass-through property issues, or other threshold defects that change whether a transfer is even avoidable.
- The memo states conclusions without tying them to the governing bankruptcy rule, the interacting record source, and the practical effect on exposure.

## 3. Legal frameworks / domain conventions that apply

- Preference analysis under Bankruptcy Code section 547 requires a transfer of the debtor’s interest in property, to or for the benefit of a creditor, on account of an antecedent debt, while the debtor was insolvent, within the applicable look-back period, and enabling the creditor to receive more than in a Chapter 7 liquidation.
- The applicable look-back period depends on recipient category and transfer context; insider or specially treated recipients may require a longer reachback than ordinary trade creditors.
- Avoidance deadlines are controlled by the Bankruptcy Code and the applicable procedural rules governing trustee or estate representative actions; the correct deadline must be measured from the relevant bankruptcy event in the record.
- The contemporaneous exchange, ordinary course, subsequent new value, floating lien, and other defenses must be tested against the facts actually shown in the supporting records, not assumed from labels in the preparer’s report.
- New value credits only reduce exposure to the extent the value was delivered after the preferential transfer and remains otherwise available under the defense; pre-transfer value does not count.
- Payments that are merely pass-throughs, reimbursements, or other non-estate property transfers may fall outside preference exposure and should be excluded if the record supports that characterization.
- Bankruptcy preference issues are fact-intensive; correct analysis depends on identifying the actual transferor, transferee, date, amount, account path, and economic substance of each payment.

## 4. Analytical scaffolds

- Start by enumerating each transfer, recipient, and defense the preparer analyzed; if the report bundles multiple payments or recipients together, separate them before evaluating exposure.
- For each transfer, verify the operative record facts: payment date, amount, debtor entity, recipient entity, debt source, and whether the transfer falls within the asserted look-back period.
- Compare the preparer’s stated deadline and filing window to the controlling bankruptcy event dates in the record; flag any mismatch between the report’s timing assumption and the actual procedural posture.
- If the report treats a recipient as an ordinary creditor, test whether the documents support a specially treated category that changes the look-back analysis.
- For executive, officer, retention, severance, consulting, or commission payments, test whether the recipient category and transfer timing support an extended look-back or other special treatment.
- Recalculate any reported exposure using only the figures and offsets shown in the source records; isolate arithmetic mistakes, omitted transfers, duplicated credits, and mismatched totals.
- For new value, trace the chronology transfer-by-transfer and include only value delivered after the challenged transfer; identify any pre-transfer amount incorrectly credited.
- Test ordinary course and similar defenses only if the historical payment pattern, industry context, or secured-position data is actually present in the source set; note when the factual record is incomplete.
- Check whether the transfer involved a non-debtor affiliate, a misidentified obligor, or a pass-through account; if so, state the correct parties and the effect on exposure.
- For each issue, close the analysis by tying the error to the relevant record figure, the conflicting source document or legal rule, and the downstream impact on avoidance risk, settlement posture, or litigation strategy.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track the relationship between debtor, affiliate, intermediary, and ultimate payee; entity misalignment can defeat a preference theory or change the defensible amount.
- Track the relationship between prepetition and postpetition timing, since the preference defenses and limitations period turn on chronology.
- Track the relationship between the transfer and later value exchanges; only post-transfer value can offset earlier exposure.
- Track the relationship between the challenged payment and any related contract, invoice, payroll, cash-sweep, or reimbursement record that explains whether the transfer was for antecedent debt or non-estate property.

## 6. Output structure conventions

- Use a numbered issues memorandum with a short severity legend at the top using an ordinal scale such as Critical / High / Medium / Low.
- For each issue, include: Severity, Description of Error or Gap, Correct Analysis, Financial Impact, and Recommended Action.
- State the governing legal authority or rule for each issue by name and section or other controlling citation format used in the source materials or standard bankruptcy practice.
- Where multiple transfers or recipients are involved, provide a separate row, sub-bullet, or mini-table for each item rather than collapsing them into a single blended conclusion.
- Include a summary table comparing the preparer’s reported exposure, the corrected exposure, and the variance for each issue or transfer group.
- End with a Recommended Actions block that assigns an imperative action, a responsible role, and a timing anchor tied to the case or filing posture.
