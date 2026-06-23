---
name: sec-reporting-compliance-timeline
task_id: corporate-governance/assess-compliance-timeline-for-new-sec-reporting-requirements
description: Compliance timeline assessment identifying obligations, errors, and gaps across multiple new SEC reporting requirements, including filer status classification, cybersecurity disclosures, and executive compensation clawback rules, using general rule-based analysis rather than scenario-specific conclusions.
activates_for: [planner, solver, checker]
---

# Skill: SEC Reporting Requirements Compliance Timeline Assessment

## 1. Subject-matter triage
- Treat this as a multi-issue regulatory timeline review across distinct SEC compliance tracks.
- First identify the universe of reporting obligations implicated by the source set, then sort them by regulatory area and triggering event.
- If the documents contain multiple fiscal periods, reporting entities, or triggering events, enumerate them before analysis and keep each timeline separate.
- If a single entity or period is actually in scope, say so explicitly and explain why the remaining materials do not create a separate track.

## 2. Failure modes the skill is correcting
- Accepting a filer-status determination that rests on only one prong of the applicable test, which distorts every downstream filing deadline.
- Failing to validate compliance dates stated in internal guidance against the governing rule’s effective date and any phase-in schedule.
- Missing the restatement-to-clawback connection, especially where the lookback period reaches into prior periods not obvious from current management reporting.
- Overlooking cybersecurity governance or incident disclosure gaps because the annual-report discussion is partial, outdated, or mismatched to the company’s risk profile.
- Treating policy existence as enough when the rule requires scope, approval, maintenance, and disclosure.
- Collapsing distinct disclosure obligations into one generic “SEC compliance” issue, which hides urgency and responsible ownership.
- Giving conclusions without naming the controlling rule, regulation, or authority supporting them.

## 3. Legal frameworks / domain conventions that apply
- Filer status classification: apply the full multi-prong test for the relevant filer category, then use that category to determine periodic-report deadlines and related disclosure burdens.
- Periodic reporting deadlines: compute due dates from the relevant fiscal-year end or triggering event under the applicable SEC framework.
- Cybersecurity disclosure framework: assess required disclosure of cybersecurity risk management, strategy, governance, and incident reporting obligations for the filer category at issue.
- Clawback framework: evaluate whether a compliant policy exists for recovery of incentive-based compensation following an accounting restatement; confirm scope, governance, and disclosure mechanics.
- Restatement interaction: any prior-period restatement may require retrospective analysis of incentive-based compensation earned during the applicable lookback period.
- Internal-control and certification framework: determine which certifications, management assessments, and auditor-attestation requirements apply based on filer category and reporting status.
- Beneficial ownership disclosure framework: governance rights granted to a significant holder may alter the disclosure analysis when combined with equity ownership.
- Insider-trading policy framework: verify adoption, maintenance, approval, and required disclosure of a compliant insider-trading policy.
- Governing authority should be cited by name and section or part where feasible, including the relevant SEC rule, form item, or Exchange Act provision.

## 4. Analytical scaffolds
- Build a regulatory matrix with one row per obligation track and columns for source document, governing authority, trigger, due date, current status, defect type, severity, and consequence.
- For filer status, test every required prong of the applicable classification and map the resulting category to all downstream filing deadlines.
- For cybersecurity, compare the document’s disclosures against the required categories: risk management, governance, strategy, and incident response/reporting.
- For clawback, test policy scope against the covered-person definition, then test any restatement against the applicable lookback period and recovery analysis.
- For timeline issues, distinguish between hard deadlines, conditional deadlines, and internal target dates; do not treat internal estimates as controlling unless they match the rule.
- For external guidance, cross-check each stated date or sequencing assumption against the governing rule and phase-in schedule before carrying it forward.
- For beneficial ownership, analyze governance rights separately from equity percentage and then assess the combined effect on disclosure and filing obligations.
- For insider-trading policy, verify existence, approval authority, disclosure location, and whether the policy is current and operative.
- For each issue, include: severity, governing authority, source document reference, why the document is wrong or incomplete, and the downstream compliance consequence.
- Use an ordinal severity scale defined once at the top of the memo and apply it consistently across all entries.
- Rank issues by urgency, with imminent filing or disclosure obligations ahead of structural policy gaps and standalone disclosure deficiencies.
- End each issue with a practical action tied to a responsible role and a timing anchor.

## 5. Vertical / structural / temporal relationships
- An incorrect filer category cascades into incorrect filing deadlines, disclosure triggers, and potentially incorrect internal-control conclusions.
- Restatement and clawback are temporally linked to the restatement event, not to current-period awareness; the lookback may reach into prior compensation periods.
- A document’s internal compliance calendar is not controlling if it conflicts with the governing rule or phase-in schedule.
- Governance-rights analysis may depend on the combination of rights and equity holdings, so separate the rights package from the ownership percentage before concluding.
- Treat the timeline as forward-looking from the triggering event, but flag retrospective obligations where the rule reaches back into prior periods.
- If multiple obligations share the same trigger, preserve their distinct deadlines rather than merging them into a single “SEC due date.”

## 6. Output structure conventions
- Write a compliance timeline memorandum organized by regulatory area, not as a free-form narrative.
- Start with a short executive summary that identifies the highest-risk gaps and the most time-sensitive obligations.
- Include a brief methodology note identifying the source set reviewed and the controlling authorities applied.
- For each issue, provide: severity, regulatory area, controlling authority, source document reference, obligation, defect/gap, deadline or trigger date, consequence, and recommended action.
- Use specific calendar dates where the source set and governing rule permit derivation; otherwise state the triggering event and explain the timing logic.
- Keep timeline entries chronological within each regulatory area when dates are known.
- Conclude with a prioritized action plan that assigns responsibility to the relevant officer, counsel, or business owner and states the timing anchor.
- Surface verbatim quotes from internal documents only when they are necessary to identify the exact language at issue; otherwise paraphrase and cite the source document.
