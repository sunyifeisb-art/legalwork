---
name: draft-quarterly-report-on-form-10-q
task_id: capital-markets/draft-quarterly-report-on-form-10
description: Form 10-Q drafting from multiple source documents where the baseline populates standard sections but may miss disclosure obligations triggered by events during the quarter, such as acquisitions, regulatory matters, workforce changes, system migrations, or subsequent events.
activates_for: [planner, solver, checker]
---

# Skill: Draft Quarterly Report on Form 10-Q

## 1. Subject-matter triage

- Treat the Form 10-Q as a full-period periodic report, not a financial-statement-only exercise.
- Separate source inputs into: financial reporting, quarter events, legal/regulatory matters, controls, capital returns, and post-period events.
- If multiple source documents speak to the same matter, identify the controlling source for drafting and note the discrepancy rather than silently harmonizing it.
- If the source set contains only one item for a category, say so affirmatively before drafting that section.

## 2. Failure modes the skill is correcting

- Baseline drafts the financial statements and MD&A from the financial data provided but does not review the non-financial source documents to identify disclosure obligations they may trigger.
- Baseline may omit periodic-report repurchase disclosure where buybacks occurred during the quarter.
- Baseline may not flag cross-document discrepancies between narrative notes and the financial data, and may not make clear which source is treated as controlling for drafting purposes.
- Baseline may flatten quarter-specific events into generic boilerplate instead of tying the disclosure to the operative facts in the source set.
- Baseline may state controls conclusions in tentative language instead of a clear effectiveness conclusion.
- Baseline may draft individual sections in isolation and miss spillover between acquisition accounting, contingencies, MD&A, controls, and subsequent-events disclosure.

## 3. Legal frameworks / domain conventions that apply

- Periodic reporting under Exchange Act reporting conventions requires a complete Form 10-Q in the prescribed order, with Part I financial statements, MD&A, and controls, followed by Part II items as applicable.
- Interim financial reporting should be drafted from the financial data source, with arithmetic, classification, and internal-consistency checks before narrative finalization.
- Acquisition disclosures should track business-combination accounting conventions, including acquisition-date accounting, identified asset and liability classes, goodwill, and any pro forma information required by materiality and available data.
- Contingency disclosure should follow the applicable loss-contingency framework and distinguish between accrual, reasonably possible exposure, and qualitative description based on the record.
- Workforce, litigation, investigation, and regulatory matters should be placed in the section that best matches their legal character and stage, not merely repeated wherever convenient.
- Material control changes during a system migration or similar transition belong in controls disclosure, with remediation or monitoring described if relevant.
- Subsequent-event analysis should capture post-balance-sheet declarations, distributions, or similar actions that affect period-end disclosure.
- Repurchase disclosure should be presented in the periodic-report format for the quarter, with the monthly breakdown and remaining authorization as supported by the source set.
- Disclosure controls conclusions should be stated plainly and consistently, without hedging if the source facts support a definitive conclusion.

## 4. Analytical scaffolds

- Start by inventorying all source documents by topic, date, and function, then map each to the Form 10-Q section it affects.
- For each quarter event, ask whether it changes revenue, margins, operating income, liquidity, contingencies, controls, or required footnote disclosure.
- Draft the financial statements and notes from the financial source set first; verify balance-sheet and cash-flow consistency before moving to narrative sections.
- Review MD&A for required discussion of material period-over-period changes, including product, margin, operating expense, acquisition effects, regulatory matters, and liquidity/capital resources.
- Review legal and operational source documents for disclosure triggers, then place each disclosure in the most specific applicable section.
- If there are multiple dates, parties, scenarios, or periods relevant to an issue, enumerate them before analyzing so each can be addressed separately.
- When an issue depends on more than one document, compare the documents explicitly, identify the conflict or gap, and state which source controls the draft.
- When a disclosure is advisory in nature, end the section with concrete drafting or follow-up actions tied to the responsible business or legal function and the relevant filing milestone.

## 5. Vertical / structural / temporal relationships

- Keep the filing in SEC form order and preserve the separation between Part I and Part II items.
- Link quarterly events forward into MD&A, controls, legal proceedings, and subsequent-events sections only where the facts require it.
- Tie post-period developments back to the balance sheet date and distinguish them from in-period events.
- If a technology migration, restructuring, acquisition integration, or regulatory matter affects more than one section, align the descriptions so they are consistent across the filing.
- Treat the financial statements as the anchor, the notes as the explanatory layer, and the narrative sections as the place where consequences are discussed.
- Where one source document updates or conflicts with another, show the relationship temporally and hierarchically rather than blending the sources into a single unsupported statement.

## 6. Output structure conventions

- Produce a single, complete Form 10-Q draft suitable for conversion into a .docx filing.
- Use conventional SEC section structure and populate all applicable Part I and Part II items.
- Include bracketed notes for unresolved discrepancies, missing inputs, or company decisions required before filing.
- Make all material quarter-event disclosures specific to the source set rather than generic.
- State the disclosure controls conclusion in direct, unqualified language supported by the facts in the source set.
- Where repurchases occurred, include the periodic-report repurchase table in the conventional monthly format.
- Before finalizing, confirm that the draft contains operative filing language, not just an outline or descriptive summary.
- Flag every cross-document discrepancy clearly and indicate the drafting assumption adopted for each one.
- If a section is not applicable on the facts, state that explicitly in the draft in the manner customary for a Form 10-Q.
