---
name: review-ma-transaction-invoice
task_id: corporate-ma/review-ma-transaction-invoice-against-fee-arrangement
description: Guides preparation of a billing deviation report identifying deviations between an M&A outside counsel invoice and the applicable fee arrangement, including invoice review, issue categorization, and dollar-impact quantification.
activates_for: [planner, solver, checker]
---

# Skill: M&A Invoice Billing Deviation Report

## 2. Failure modes the skill is correcting

- The review spots a billing issue but does not tie it to the controlling fee arrangement term, rate authorization, staffing approval, or expense rule that makes it a deviation.
- The analysis identifies a variance but fails to quantify the dollar effect from the invoice line(s), leaving the client without a usable dispute figure.
- The review treats the invoice as a standalone artifact and misses that the engagement letter, approval communications, and rate card may interact to control different aspects of billing.
- The report flags timekeepers or rates without checking whether later written approvals, exceptions, or revised schedules superseded the base arrangement.
- The review notes noncompliant billing practices, such as vague descriptions, block billing, minimum increments, duplicated entries, or improper expenses, but does not connect each practice to the billing standard and its economic impact.
- The output lists issues without ranking them by severity, making it harder to prioritize recovery or follow-up.
- The report describes defects but stops short of a concrete next step for correction, reduction, or client response.

## 3. Legal frameworks / domain conventions that apply

- Treat the engagement letter and any incorporated fee arrangement materials as the controlling billing contract; read the invoice against the full set of billing terms, including rate structure, staffing rules, invoicing mechanics, and expense treatment.
- Compare billed rates to the approved rate card and any later written rate change or exception; the approved control document governs unless a later authorization clearly supersedes it.
- Where pre-approval is required for particular timekeepers, billing by an unapproved timekeeper is a deviation even if the hourly rate itself is within the schedule.
- Where the billing standards require task-specific descriptions, discrete time entries, or no block billing, entries that aggregate multiple activities may support a reduction or disallowance under the applicable standard.
- Apply ordinary invoice-review conventions for expenses: verify whether the charge is reimbursable, whether it should be passed through at cost, and whether any markup, duplication, or unsupported cost should be disallowed.
- Use a severity scale defined once at the top and apply it uniformly to each issue so the report can be triaged quickly.
- Anchor each issue in the source set: identify the controlling provision, cross-reference any approving communication or rate revision, and explain the business consequence of the variance.

## 4. Analytical scaffolds

- Inventory the source set first: identify the engagement letter, any staffing or rate approvals, the operative rate card, and the invoice period in scope.
- If more than one invoice period, rate version, or approval set exists, enumerate each one before analysis and review them separately rather than blending them into a single pass.
- Extract the governing billing rules into a working table: approved rates, approved timekeepers or approval process, billing standards, expense rules, and any exception procedure.
- Review the invoice line by line, or by logical billing unit, and test each entry for:
  - approved timekeeper status;
  - billed rate versus approved rate;
  - billing-description sufficiency;
  - compliance with time-entry conventions;
  - expense eligibility and support.
- For each deviation, state the governing rule, the conflicting invoice line or pattern, and whether any later approval or carveout changes the result.
- Quantify the dollar effect of each deviation using the invoice figures and the applicable approved amount or disallowance methodology.
- Where an issue involves a practice rather than a simple rate mismatch, estimate the noncompliant portion conservatively and explain the basis for the adjustment.
- Rank issues by severity using a stable ordinal scale tied to materiality, recoverability, and likelihood of dispute.
- Keep the analysis issue-specific: one row or entry per distinct deviation category or billing theme, with separate impacts where the controlling facts differ.
- For each issue, include the downstream consequence for the client, such as overpayment exposure, dispute leverage, budget variance, or the need for a billing objection.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Where the invoice spans multiple phases, billing cycles, or amendment periods, analyze each period against the rate or approval set that was operative during that period.
- Where a later approval, revised rate card, or email exception modifies an earlier baseline, treat the chronology as controlling and note whether the later document narrows or expands the permitted billing.
- Where multiple timekeepers or staff levels are implicated, separate them by role or approval status rather than averaging across categories.
- Where a single line item combines multiple tasks or multiple charged components, separate the components if the source material permits; otherwise explain why a reduction method is being used.
- Where multiple expense types appear, distinguish pass-through disbursements, third-party charges, internal overhead, and any reimbursable costs subject to caps or exclusions.

## 6. Output structure conventions

- Produce one billing-deviation report file only.
- Open with a short executive summary that states the overall disputed amount and breaks it out by issue category.
- Define the severity scale at the top, then use it consistently for every finding.
- Present the body in descending severity and then descending dollar impact within each severity band.
- For each issue, use a compact entry that includes: issue title, severity, governing source, conflicting invoice treatment, dollar impact, and consequence.
- Group findings by conventional billing categories such as rate deviations, staffing/approval deviations, billing-practice deviations, and expense deviations.
- Include a final recommended-actions section that specifies who should act, what should be done, and when it should happen relative to the billing dispute or payment decision.
- Keep the tone audit-ready and dispute-oriented: factual, quantified, and linked to the governing billing terms.
