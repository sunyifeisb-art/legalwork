---
name: review-distressed-credit-facility-scenario-01
task_id: bankruptcy-restructuring/review-distressed-credit-facility/scenario-01
description: Ensures a distressed credit facility review memo identifies collateral-package scope issues, tests whether any proposed debtor-in-possession financing or similar rescue financing is practically and contractually feasible against the facility it is intended to address, and calculates any standstill or forbearance expiration as a restructuring deadline.
activates_for: [planner, solver, checker]
---

# Skill: Review Distressed Credit Facility — Issue Identification Memorandum

## 1. Subject-matter triage
- Treat this as a distressed-credit review of the full facility stack and related transaction documents, not a generic contract summary.
- First identify all time-sensitive restructuring constraints: standstill, forbearance, maturity, covenant default, acceleration, and any consent deadline.
- Then map the documents into issue buckets: collateral, guarantees, lender consent mechanics, rescue-financing feasibility, EBITDA/covenant compliance, ownership/change-of-control, assignment risk, and cross-agreement spillover.
- If only one relevant period, party group, or financing path exists, say so explicitly; otherwise enumerate each and analyze them separately.

## 2. Failure modes the skill is correcting
- Missing the standstill or forbearance end date and therefore failing to anchor the restructuring timeline.
- Treating the facility in isolation and overlooking provisions in related agreements that independently trigger on a change of control or similar event.
- Missing a collateral-package gap created when a pledge limitation is drafted for one entity type but applied more broadly than intended.
- Failing to recognize structural subordination where operating-subsidiary creditors sit ahead of parent-level lenders because a subsidiary is not a guarantor.
- Assuming rescue financing is feasible without testing whether the authorized financing capacity can actually support the repayment conditions tied to it.
- Overlooking lender-blocking power, hostile assignment risk, or required-consent mechanics that can control the workout process.
- Accepting pro forma EBITDA add-backs without testing whether the claimed synergies, savings, or other adjustments are supportable within the applicable time window.

## 3. Legal frameworks / domain conventions that apply
- Collateral scope must be read by entity type, grant language, and defined collateral limitations; a limitation that does not fit the entity actually owning assets can leave a material gap in the secured package.
- Structural subordination is a priority problem, not a drafting nicety: if a parent lender lacks guarantees from operating subsidiaries, the lender’s practical recovery may be junior to the subs’ creditors.
- Rescue financing or similar reset financing must be tested against any contractual cap, repayment condition, or consent requirement; if the facility to be repaid exceeds the permitted financing headroom, the structure may be unworkable.
- Lender consent thresholds matter as much as the covenant text; identify whether a single holder or small group can block amendments, waivers, defaults, or releases under the voting provisions.
- EBITDA add-backs, synergies, and cost-savings adjustments should be tested against the agreement’s express timing and support requirements; unearned add-backs may inflate compliance headroom.
- Standstill and forbearance periods are operative deadlines and should be calculated from the documents as written, including any extensions or automatic termination language.
- Change-of-control definitions in the facility can propagate to equity arrangements, JV agreements, puts, call rights, and similar side documents that incorporate the same trigger.
- Open-market assignment provisions can create a hostile-lender risk if a creditor can accumulate a blocking position or strategic veto rights.
- Cite the controlling contractual provision or generally recognized legal doctrine for each conclusion drawn from the documents; do not state a legal effect without naming the rule, clause, or standard supporting it.

## 4. Analytical scaffolds
- Review the documents section by section, then cross-check defined terms against operative provisions and related agreements.
- For each issue, use the same closure sequence:
  - Provision / authority.
  - Problem.
  - Scale or threshold, using the source documents’ own numbers, dates, or voting mechanics.
  - Interaction with another clause, schedule, or related document.
  - Downstream consequence for the client.
  - Recommended fix or next step.
- Treat every issue as incomplete unless it ties a document-based threshold to a cross-document interaction and a concrete restructuring consequence.
- For timing questions, compute the relevant date from the source documents and state it as a restructuring deadline in plain terms.
- If multiple lenders, facilities, tranches, or trigger dates exist, enumerate them first and then analyze each on its own terms; do not collapse distinct mechanics into one generalized pass.
- Apply a uniform severity scale across the memo and assign a severity level to every issue, with a one-line rationale for the level selected.
- Use the source documents’ terminology for covenants, defaults, waivers, events of default, permitted debt, liens, and control rights.

## 5. Vertical / structural / temporal relationships
- Separate upstream holding-company debt from operating-company debt and analyze how creditor priority shifts across the structure.
- Identify any subsidiary, restricted entity, or non-guarantor whose assets or cash flow sit outside the direct collateral or guarantee net.
- Trace whether a covenant default, control event, or financing amendment in the credit facility automatically ripples into side agreements or equity arrangements.
- Build a deadline timeline that places standstill expiration, covenant test dates, reporting dates, consent windows, maturity dates, and any acceleration-related dates in chronological order.
- When a deadline drives transaction urgency, make that linkage explicit: date, source provision, and practical consequence.

## 6. Output structure conventions
- Write a numbered issues memo in conventional legal style, not as a checklist dump.
- Begin with a short severity legend, using an ordinal scale such as Critical / High / Medium / Low, defined once and used consistently.
- Include a deadline timeline section that lists the key restructuring dates in chronological order.
- For each issue, use a compact sub-structure: Severity; Provision / Authority; Problem; Scale; Cross-Reference; Consequence; Recommendation.
- End with an explicit Recommended Actions section that gives imperative next steps, assigns a responsible role, and ties each step to a source-document deadline or restructuring milestone.
- Keep the memo focused on restructuring-relevant risks; do not summarize ordinary boilerplate unless it changes the risk analysis.
