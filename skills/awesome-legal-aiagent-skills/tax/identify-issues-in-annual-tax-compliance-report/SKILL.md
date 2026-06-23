---
name: identify-issues-in-annual-tax-compliance-report
task_id: tax/identify-issues-in-annual-tax-compliance-report
description: Reviewing a draft annual tax compliance report requires checking the arithmetic and legal basis for each material computation, verifying the applicable tax rules for the relevant period, and quantifying any discrepancies identified.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Annual Tax Compliance Report

## 2. Failure modes the skill is correcting

- Treating a reported tax line item as correct without independently testing the underlying inputs, assumptions, and intermediate calculations.
- Applying a year-end rule, rate, or limitation without checking whether a mid-period event changes the measurement period or requires proration.
- Accepting a credit, deduction, or basis computation without recomputing the source figures and tracing any special classification rule that affects eligibility.
- Using an outdated definition, threshold, or inclusion rule for the relevant tax year.
- Identifying an issue in prose but failing to state its magnitude, legal hook, or practical consequence.
- Spotting multiple entities, jurisdictions, periods, or attributes in the source set but analyzing only a representative sample.
- Giving conclusions without naming the controlling authority or without tying the conclusion to the document set.
- Producing diagnoses without concrete corrective steps.

## 3. Legal frameworks / domain conventions that apply

- **Accelerated cost recovery / bonus depreciation:** Confirm the property category, placed-in-service date, and governing allowance for the relevant tax year before accepting the reported deduction. Cite the controlling Code or regulatory authority for the year at issue.
- **Timing-sensitive limitation rules:** Where an acquisition, disposition, ownership change, or status change occurs during the year, test whether the rule requires a short-period or partial-year adjustment before relying on the reported amount. Cite the governing statute, regulation, or published guidance.
- **Credit-base computations:** Independently recompute the base-period metric, average, ratio, or cap from the underlying data rather than relying on the report’s stated result. Identify any special exclusion or classification rule that affects the computation and cite the authority supporting it.
- **Specially classified expenditures:** If the report treats an item as eligible only if a heightened standard is met, check that the factual support actually addresses that standard and cite the applicable authority.
- **Compensation or covered-person rules:** Apply the correct year-specific definition and inclusion rule for officers, employees, owners, or other covered persons; do not assume prior-year definitions remain valid. Cite the relevant statute, regulation, or administrative guidance.
- **Jurisdictional tax rates and surtaxes:** Verify the applicable combined rate for each jurisdiction and tax year, including any supplemental tax or surcharge, and cite the relevant rate authority or filing guidance.
- **Nexus and filing footprint:** Compare the jurisdictions shown in the report against the factual contacts, sales activity, and filing history in the source materials to identify jurisdictions that require nexus analysis or filing consideration. Cite the relevant nexus standard or filing rule.
- **Controlling authority discipline:** Every legal conclusion should be anchored to a named source of authority, not merely to a conclusion drawn from the report.

## 4. Analytical scaffolds

### Step 1: Enumerate the workstream before analysis
- List every distinct entity, jurisdiction, period, schedule, credit, deduction, or other reporting bucket that is actually in scope.
- If only one item is truly in scope, say so affirmatively and explain why no broader set is implicated.
- Do not compress multiple buckets into a single pass if they differ by tax year, jurisdiction, or legal rule.

### Step 2: Review each item using the same sequence
1. Identify the reported line item and the governing rule category.
2. Recompute the figure or test the legal premise from the source inputs.
3. Compare the reported treatment to the governing rule.
4. State the magnitude of any discrepancy using the source figures only.
5. Cross-check any interacting schedule, footnote, or supporting document.
6. State the downstream consequence for the client.
7. Record the corrective procedural step that should follow.

### Step 3: Issue-closing triad for every entry
- Quantify the issue against the relevant source figure, threshold, exposure, or timing measure.
- Cross-reference the interacting provision, schedule, or source document that affects the result.
- State the concrete consequence, such as increased tax, filing exposure, penalty risk, refund risk, or the need for amended reporting.

### Step 4: Use a consistent severity lens
- Assign each issue an ordinal severity level using a short scale defined once at the top of the memo.
- Apply the scale uniformly and explain the rating in one sentence tied to magnitude, certainty, and compliance impact.
- Keep severity distinct from narrative urgency.

### Step 5: Apply the rule authority explicitly
- For each legal proposition, name the controlling authority by statute, regulation, guidance, or other recognized source.
- If the source documents identify the authority, use that citation form.
- If not, rely on the generally accepted tax authority for the issue type.

## 5. Vertical / structural / temporal relationships

- Track the reporting period against the legal measurement period; do not assume a calendar-year rule applies to a fiscal-year or short-period filing without checking.
- Track ownership, acquisition, disposition, or classification changes that occur mid-period and test whether they alter the applicable computation.
- Cross-reference the tax return summary, workpapers, footnotes, elections, and support schedules against one another; an item is not resolved if it appears only in one place.
- Where multiple jurisdictions are involved, separate the analysis by jurisdiction and tax year before comparing rates, nexus facts, or filing obligations.
- Where a line item depends on another schedule, reverse-engineer the dependency chain before accepting the final number.
- Do not resolve timing or rate questions in the abstract; tie them to the exact item and period reflected in the source materials.

## 6. Output structure conventions

- Produce an issue memorandum in ordinary tax-transaction style, organized by reporting topic and then by item within that topic.
- Begin with a brief severity key using an ordinal scale such as Critical / High / Medium / Low.
- For each issue, include:
  - a concise issue heading,
  - the severity level,
  - the reported treatment,
  - the recalculated or corrected treatment where applicable,
  - the governing authority,
  - the discrepancy or risk magnitude,
  - the interacting schedule or document,
  - the downstream consequence,
  - the recommended corrective step.
- When arithmetic is involved, show the reported figure and the corrected figure; do not just state that the amount is wrong.
- When the issue is legal rather than arithmetic, identify the specific rule that changes the treatment and the resulting filing or compliance implication.
- Finish with a short Recommended Actions section that lists concrete next steps in imperative form, assigns each step to the relevant role, and anchors timing to the filing or review process.
- Keep the memorandum self-contained, but do not invent facts, amounts, or authorities not supported by the source materials.
