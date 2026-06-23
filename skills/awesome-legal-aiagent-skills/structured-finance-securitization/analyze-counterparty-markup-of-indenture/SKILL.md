---
name: analyze-counterparty-markup-of-clo-indenture
task_id: structured-finance-securitization/analyze-counterparty-markup-of-indenture
description: Reviewing a counterparty redline of a CLO indenture where changes to coverage test thresholds, portfolio constraints, and structural triggers must be evaluated against a negotiation playbook, deal materials, and the counterparty's own characterization of its changes.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of CLO Indenture — Redline Review Memorandum

## 1. Subject-matter triage

- Confirm the source set: base indenture, counterparty redline, cover letter, playbook, OM excerpt, and client emails.
- Build the issue set from the redline itself, not from the cover letter summary.
- If the redline touches multiple tranches, tests, baskets, or triggers, enumerate them first and analyze each separately.
- Treat the memorandum as an advisory issue review, not a generic deal summary.

## 2. Failure modes the skill is correcting

- Accepting the counterparty’s characterization of changes as complete or accurate without verifying the actual markup.
- Reading only the provisions discussed in the playbook and missing silent but material edits.
- Missing how a revised test threshold changes diversion mechanics and equity cash flow.
- Treating structural edits as “technical” when they alter timing, control, redemption, or refinancing flexibility.
- Collapsing distinct changes into one combined comment and losing the independent consequence of each.
- Omitting the practical effect of a constraint by failing to tie it to the portfolio profile described in the deal materials.
- Ending with diagnosis only, without a specific recommended client position.

## 3. Legal frameworks / domain conventions that apply

- CLO overcollateralization tests compare eligible collateral value against outstanding note balances; tighter thresholds increase the chance of diversion from junior distributions to senior paydown.
- Interest coverage tests operate on interest proceeds versus note interest obligations; a higher required ratio can trigger earlier diversion even if principal coverage remains adequate.
- Portfolio quality constraints, including weighted-average life, covenant-lite concentration, and discount obligation treatment, directly affect manager flexibility and trading capacity.
- Clean-up call and optional redemption mechanics affect the timing of equity exit and the ability to terminate the structure efficiently.
- Refinancing and re-pricing provisions are core economic tools; caps or consent hurdles can materially limit value capture.
- Mandatory redemption and tax-related termination mechanics must be read for trigger standard, notice mechanics, cure or delay rights, and liquidation process.
- For any legal or drafting proposition, cite the controlling authority as reflected in the source documents or the governing transaction language, and do not state a legal conclusion without naming the clause, rule, or provision supporting it.

## 4. Analytical scaffolds

1. Inventory every substantive change in the redline before prioritizing any one issue.
2. For each change, identify: the affected provision, the pre- and post-change effect, and whether the playbook addresses it.
3. For each coverage-test change, state the relevant threshold, the impacted note class or tranche, and the diversion consequence at the revised level.
4. For each portfolio constraint change, explain the practical effect on manager flexibility using the OM excerpt and any portfolio composition facts in the record.
5. For each structural or timing change, test whether it alters control, cure rights, redemption timing, or liquidation path.
6. Compare the cover letter’s description to the actual markup and flag any mismatch between characterization and effect.
7. Assign an ordinal severity to each issue and explain the ranking in one line.
8. Close each issue with: scale/threshold, interaction with another clause or document, and downstream consequence for the client.

## 5. Vertical / structural / temporal relationships

- Test changes can interact with waterfall mechanics: a revised threshold may not change nominal economics alone, but it changes the point at which cash is diverted.
- Portfolio constraints can compound each other; a tighter trading constraint paired with a shorter reinvestment period can reduce the manager’s ability to maintain coverage.
- Redemption, refinancing, and cleanup provisions should be read together because a change in one can offset or amplify the practical effect of the others.
- Timing language matters: notice periods, cure windows, calculation dates, and effective dates can shift leverage even when the substantive standard appears unchanged.
- If multiple tranches or classes are affected, note whether the change is local to one series or propagates through common definitions and shared waterfall terms.

## 6. Output structure conventions

- Use a conventional redline review memo format with a short deal overview, issue-by-issue analysis, severity labels, and a concise bottom-line summary.
- Define the severity scale once at the top and apply it uniformly to every issue.
- For each issue, include: clause or concept changed, what the markup does, playbook status, practical and economic impact, and recommended client position.
- Use explicit textual markup conventions in the memo when reproducing changed language or comparing formulations, so the change remains legible even outside the original styling.
- Attribute factual statements to the relevant source document or redline location.
- End with a Recommended Actions section that names the responsible role and a timing anchor tied to the deal process or any deadline in the materials.
- Keep the memo focused on substantive, client-facing consequences rather than line-by-line editorial commentary.
