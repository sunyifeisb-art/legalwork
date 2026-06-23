---
name: draft-indenture-for-auto-loan-abs
task_id: structured-finance-securitization/draft-indenture-for-auto-loan-abs-transaction
description: Drafting a trust indenture for an auto loan ABS issuance by adapting a prior transaction template to a new structure that introduces a non-advancing servicer, turbo principal waterfall, and subordinated note class, while flagging structural issues that require resolution before the document is finalized.
activates_for: [planner, solver, checker]
---

# Skill: Draft Trust Indenture for Auto Loan ABS Transaction

## 1. Subject-matter triage (only if applicable)

- Treat the prior indenture as the baseline drafting architecture, then conform it to the new deal documents without carrying forward assumptions that depend on a different servicing, waterfall, or note-capitalization structure.
- Draft the operative indenture first; treat the issues memo as secondary and dependent on the completed draft existing and containing operative text.
- If a term, amount, date, class feature, or covenant is not confirmed by the deal documents, leave a visible placeholder and surface the gap for resolution rather than inventing a market-standard fill.

## 2. Failure modes the skill is correcting

- Reusing precedent language that conflicts with the actual transaction mechanics, especially where the transaction departs from a standard advancing-servicer or pro rata structure.
- Omitting class-specific economics, payment mechanics, transfer limits, or maturity provisions for a newly introduced subordinated class.
- Drafting waterfall language that does not reflect actual collections, priority mechanics, or triggers for principal re-direction.
- Failing to reconcile reserve, enhancement, servicing, tax, and control provisions across the indenture as integrated transaction mechanics.
- Delivering only a draft without a separate issues memo that identifies conflicts, open points, and proposed fix language.
- Reproducing source-document text too closely instead of converting it into clean operative drafting.

## 3. Legal frameworks / domain conventions that apply

- Construe the indenture as the governing operative instrument for noteholder rights, trustee powers, payment mechanics, transfer restrictions, defaults, and redemption, with defined terms and cross-references updated consistently throughout.
- Draft the conveyance/grant provisions so the receivables transfer, related security, and proceeds are vested in the trustee with full chain-of-title language and any necessary perfection mechanics.
- For a non-advancing servicing structure, noteholder payments should track actual collections and the available-funds construct should not imply a servicer duty to make up shortfalls absent an express advance obligation.
- For a turbo principal structure, principal should apply sequentially to the most senior outstanding class until paid in full before subordinate classes receive principal, unless the deal documents create a different trigger or carve-out.
- For a subordinated class, confirm transfer restrictions, minimum denominations, and eligible-transferee limits consistent with the offering structure and any resale constraints.
- For public-debt or holder-rights sensitivities, test whether any amendment, waiver, or distribution deferral provision could impair payment rights and whether holder-consent or class-vote mechanics are required under the governing note documents.
- Accrual mechanics, day-count conventions, legal final maturities, and interest rates must be stated class by class and period by period where needed; do not assume one convention carries across all classes.
- Overcollateralization, reserve accounts, and other credit enhancement features should be stated as integrated balance-sheet mechanics, including target, floor, replenishment priority, and release conditions.
- Control rights should be tied to a clearly defined controlling class standard and direction threshold, with trustee instruction mechanics aligned to noteholder voting and default status.
- Optional redemption/call rights should be drafted as transaction-specific clean-up mechanics keyed to the pool-balance threshold and any notice or compliance conditions.
- Events of default should cover payment failure, insolvency-type events, servicing failures, and other trigger events only to the extent supported by the source documents and the transaction structure.
- Non-petition, tax, book-entry, risk-retention, and backup-servicer provisions should be carried through as standard securitization conventions only after conforming them to the actual parties and document set.

## 4. Analytical scaffolds

1. Start from the prior indenture’s article and section architecture, then update party names, defined terms, exhibit references, schedules, and cross-references before substantive drafting.
2. Map each note class separately: principal amount, interest rate, day-count convention, payment dates, legal final maturity, denomination, transfer limits, and any subordination or lockout feature.
3. Draft the grant and perfection provisions first, because they anchor the trustee’s rights and the downstream waterfall and default provisions.
4. Draft the interest waterfall with actual-collections language, reserve mechanics, fees, senior expenses, note interest, and any shortfall handling consistent with the non-advancing structure.
5. Draft the principal waterfall as a sequential-pay framework with the turbo feature expressly moving all available principal to the most senior outstanding class until paid, subject to any documented exceptions.
6. Insert overcollateralization and reserve-account provisions as integrated enhancement mechanics: define the target, floor, build, release, draw, and replenishment sequence, and align them with waterfall priority.
7. Draft control, amendment, and voting provisions so the controlling class standard, direction rights, and any class-consent triggers are internally consistent.
8. Draft redemption and optional call provisions only after confirming the threshold, notice mechanics, source of funds, and any conditions precedent.
9. Draft default and remedy provisions to fit the servicing model, then align trustee rights, noteholder remedies, and servicer replacement mechanics.
10. Draft transfer restrictions and legends for subordinate or privately placed notes only after confirming eligible purchasers and minimum denomination requirements.
11. Use the issues memo to capture each gap, ambiguity, or inconsistency, and for each one identify the affected provision, the practical consequence, and proposed conforming language.

## 5. Vertical / structural / temporal relationships (only if applicable)

- The non-advancing servicing model and the available-funds cap operate together: when collections slow, both interest support and principal support can compress at the same time, so the waterfall must avoid implying any backstop from the servicer.
- The turbo principal feature and the subordinate class interact temporally: subordinate principal may be deferred for an extended period, so the indenture should state clearly when, if ever, that class begins to receive principal.
- Overcollateralization and reserve replenishment can compete for the same collections; the drafting should resolve whether one builds before the other, whether one is released before the other, and what happens when both are under target or at floor.
- Control rights may shift over time as senior classes amortize; draft the controlling-class definition so it updates automatically with the outstanding balance hierarchy rather than requiring manual intervention.
- Call rights, maturity dates, and default triggers should be read together so that an optional redemption does not accidentally conflict with final distribution mechanics or event-of-default remedies.

## 6. Output structure conventions

- Produce the indenture as the primary deliverable and ensure it is complete, operative, and internally consistent before preparing any memo.
- The issues memo should be a standalone advisory document that identifies each conflict, gap, or open drafting point, explains why it matters, and proposes conforming language or a drafting path to resolve it.
- Organize the memo by topic in conventional transaction-order sections such as party/defined-term alignment, note terms, waterfall mechanics, enhancement features, control and voting, transfer restrictions, defaults and remedies, and boilerplate conformity.
- For each issue, include a severity label using a single ordinal scale defined at the top of the memo, and use that scale consistently throughout.
- For each issue, state the affected provision, the reason it is unresolved, the transactional consequence, and the proposed language or next-step fix.
- Where multiple note classes, dates, or mechanics are in play, address them separately rather than collapsing them into a single combined issue.
- End the memo with a concise Recommended Actions block that assigns each action to the appropriate role and ties it to the deal-closing or document-finalization milestone.
- Before finishing, confirm by file name that the indenture file exists and is non-empty, and that the memo file exists and is non-empty.
