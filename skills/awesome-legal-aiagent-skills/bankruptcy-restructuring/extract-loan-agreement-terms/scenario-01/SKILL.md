---
name: extract-loan-agreement-terms-scenario-01
task_id: bankruptcy-restructuring/extract-loan-agreement-terms/scenario-01
description: Ensures a loan term extraction memo covers financial covenant terms, cross-default mechanics across related facilities, mandatory prepayment provisions, change-of-control definition differences, and near-term strategic deadlines relevant to restructuring planning.
activates_for: [planner, solver, checker]
---

# Skill: Extract Loan Agreement Terms — Restructuring Strategy Development

## 1. Subject-matter triage (only if applicable)

- This is a document-extraction and issue-spotting exercise, not a rewrite. Read the credit documents as a set and extract the terms that drive restructuring leverage, default sequencing, and timing.
- First determine whether multiple facilities, tranches, or related agreements are in scope. If so, enumerate each one explicitly before analysis and keep the memo row-based by facility.
- Treat the intercreditor agreement as a separate control document. Extract its transfer, enforcement, payment, standstill, and turnover mechanics only to the extent they affect restructuring strategy.
- If the source set contains only one facility or one relevant covenant period, say so affirmatively and do not force a cross-facility comparison.

## 2. Failure modes the skill is correcting

- Agent summarizes the loan package generally but misses the terms that actually constrain strategy: maturities, covenant tests, default interest, sweep mechanics, mandatory prepayments, consent thresholds, and control-transfer triggers.
- Agent reads each agreement in isolation and fails to trace how a default in one document interacts with defaults, blockers, or enforcement rights in another.
- Agent extracts economics but omits timing: cure periods, notice windows, testing dates, springing covenants, springing cash dominion, reporting deadlines, and maturity walls.
- Agent identifies a covenant or default without tying it to the relevant threshold, related provision, and practical consequence for negotiations or filing strategy.
- Agent omits distinctions across facilities in change-of-control, permitted indebtedness, restricted payments, asset sales, or prepayment provisions that can create uneven lender leverage.
- Agent gives a narrative summary instead of a usable restructuring memo organized around decision points and deadlines.

## 3. Legal frameworks / domain conventions that apply

- Credit agreement terms are read by section, defined term, and schedule. Preserve the agreement’s own terminology and map cross-references, rather than paraphrasing away the operative mechanics.
- Financial covenant analysis should identify the covenant, the applicable test period, the metric used, and whether it is a maintenance or incurrence test.
- Default analysis should distinguish between event of default, automatic acceleration, optional acceleration, and standstill-limited remedies under intercreditor arrangements.
- Cross-default and cross-acceleration provisions must be traced against each related debt instrument separately, because the trigger threshold, grace period, and excluded indebtedness may differ.
- Change-of-control provisions often differ across facilities and may include direct/indirect ownership changes, board control shifts, or asset-sale driven control transfers.
- Mandatory prepayment provisions should be extracted by source of proceeds and by priority: asset sales, insurance/condemnation, incurrence proceeds, equity proceeds, and excess cash flow.
- Intercreditor documents commonly govern enforcement standstills, purchase rights, turnover, release mechanics, voting, and priority of payments; those provisions often determine the real restructuring path.
- For any legal proposition relied on, identify the controlling source in the agreement itself or the governing authority used by the document set; do not state a conclusion without the rule or clause that supports it.

## 4. Analytical scaffolds

- For each facility, extract:
  - borrower and guarantor scope
  - principal amount and outstanding balance if stated
  - maturity date and extension mechanics
  - interest rate, default rate, floors, and PIK features if any
  - amortization and scheduled repayment profile
  - financial covenants, test dates, and headroom mechanics
  - restricted payments, investments, indebtedness, liens, and asset sale baskets
  - mandatory prepayment triggers and application waterfall
  - cross-default, cross-acceleration, and bankruptcy default language
  - change-of-control definition and consent consequences
  - reporting obligations, field exam rights, borrowing base mechanics, and notice requirements
  - amendment and waiver thresholds, sacred-right concepts, and lender class voting rules
- For intercreditor analysis, extract:
  - payment block and standstill periods
  - enforcement control and purchase options
  - turnover and priority rules
  - release provisions and access to collateral proceeds
  - debtor-in-possession or rescue financing constraints if addressed
- For strategic timing, build a chronological list of:
  - near-term reporting dates
  - covenant test dates
  - notice or cure deadlines
  - springing event triggers
  - maturity or repricing cliffs
  - any consent or refinancing windows
- For each material issue, pair the term with its threshold or trigger, the clause it interacts with, and the restructuring consequence.
- When multiple facilities are present, compare them in a single matrix so differences in trigger, remedy, and leverage are visible at a glance.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Compare the facilities vertically: first-lien versus junior debt, revolving versus term debt, secured versus unsecured, and any pari passu or subordinated layer.
- Track whether an event in a junior instrument can cascade upward into a senior default, or whether a senior default gives rise to junior payment blockage or enforcement restrictions.
- Identify temporal sequencing: which obligations mature first, which tests are next, which notices must be given before a default ripens, and which cure periods run concurrently or consecutively.
- Note any springing mechanics that activate only after leverage, liquidity, or availability falls below a specified level.
- Where the intercreditor agreement changes ordinary contract rights, state the practical effect on negotiation leverage, enforcement timing, and holdout risk.

## 6. Output structure conventions

- Produce a structured memo in conventional legal-memo form, using headings that track the document set rather than the rubric.
- Include a facility-by-facility table that captures the operative terms and another comparison table for differences across facilities.
- Include a separate section for intercreditor constraints and another for near-term deadlines in chronological order.
- Use concise, extraction-oriented prose; avoid advocacy unless it is tied to a strategic consequence.
- Preserve quoted terms only when necessary to capture a defined term or operative carveout, and do not overquote.
- End with a short action-oriented section that identifies the restructuring implications of the extracted terms and the immediate follow-up items for the team.
