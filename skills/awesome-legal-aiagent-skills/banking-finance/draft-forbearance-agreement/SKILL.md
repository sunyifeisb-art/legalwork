---
name: draft-forbearance-agreement
task_id: banking-finance/draft-forbearance-agreement
description: Draft a forbearance agreement and issues memo based on the governing credit documents and source materials, independently verifying each stated default and addressing key protective provisions for the lender.
activates_for: [planner, solver, checker]
---

# Skill: Forbearance Agreement Drafting with Issues Memo

## 1. Subject-matter triage
- Confirm the primary output is a complete forbearance agreement; draft it first, then prepare the issues memorandum after the operative document exists and is substantively populated.
- Identify all source documents that govern default, remedies, perfection, collateral, guaranties, intercreditor rights, and amendment/waiver mechanics before drafting any operative text.
- If the source set contains multiple potential defaults, multiple lenders, multiple obligors, or multiple collateral packages, enumerate them up front and analyze each separately rather than collapsing them into a single generalized treatment.

## 2. Failure modes the skill is correcting
- Using an incorrect interest accrual convention, producing an inaccurate stated figure or misstating the lender’s economic position.
- Accepting a stated default without independently verifying the underlying facts, covenant metric, notice requirement, or cure status.
- Drafting forbearance relief that is broader than the lender intends, or that silently waives remedies outside the agreed period.
- Omitting lender-protective conditions tied to perfection, collateral preservation, insurance, cash dominion, budget discipline, or maintenance of key agreements.
- Failing to account for third-party consent rights, intercreditor restrictions, or required acknowledgments that could limit enforcement or amendment authority.
- Ignoring the risk that an apparently administrative issue, such as a lapse in a filing or a contractual expiration, can become a substantive collateral or operational problem during the forbearance period.
- Repeating source-document figures without reconciling them against the governing provisions or the actual transaction status.

## 3. Legal frameworks / domain conventions that apply
- Interpret the forbearance against the governing credit agreement, guaranty, security documents, and any intercreditor or related control agreements; the amendment/waiver mechanics in those documents control what can be waived, released, or preserved.
- Verify each alleged Event of Default under the relevant contractual standard before including it in the recitals or schedules; if a breach depends on a metric, recalculate from the source data and cite the governing covenant text.
- Use the agreement’s own interest, default interest, and fee provisions; distinguish the contractual forbearance-period economics from any bankruptcy-related or statutory protections that may later govern a different forum.
- Confirm whether any borrowing-base, liquidity, reporting, or budget covenant is implicated, and resolve conflicts between the credit agreement and the term sheet by applying the more conservative lender-protective formulation unless the source documents clearly dictate otherwise.
- If collateral perfection depends on continuing filings, possession, control, title, or similar maintenance steps, include ongoing covenants that keep the lien package live through the forbearance period.
- If collateral includes assets exposed to environmental, insurance, casualty, tax, or title risk, preserve the lender’s rights to notice, remediation, and additional collateral support rather than assuming standard boilerplate is enough.
- If guarantors or other secured parties are expected to waive marshaling, impairment, or similar defenses, make the waiver express and confirm all required signatories are in the execution set.
- When the source materials reference a key commercial contract or operational dependency, test whether its expiration, termination, or amendment would materially undermine the lender’s protection during the forbearance period and condition relief accordingly.

## 4. Analytical scaffolds
1. Accrued economics: identify the governing day-count and interest provisions; calculate or verify the outstanding principal, accrued interest, and any fee or letter-of-credit exposure using the source documents, then align the draft recitals and payment mechanics with those figures.
2. Defaults: list each alleged default separately; verify the operative facts, the governing clause, any required notice, grace, or cure period, and whether the default is continuing at signing.
3. Forbearance scope: define the specific remedies being held in abeyance, the exact period of forbearance, and the events that terminate it automatically.
4. Lender protections: test whether the draft needs affirmative covenants on reporting, collateral access, budget compliance, cash management, insurance, taxes, perfection maintenance, and no further debt or liens.
5. Consent and acknowledgement stack: identify any consent, joinder, reaffirmation, release, non-reliance, or waiver required from obligors, guarantors, collateral owners, or third parties, and verify execution coverage.
6. Collateral and perfection maintenance: check for expiring filings, control arrangements, or other perfection steps; add continuation or replacement covenants where needed and tie them to a specific deadline or milestone.
7. Risk items to flag in the issues memo: reconcile any mismatch between the term sheet and controlling documents, any default whose factual basis is uncertain, any covenant that needs recalculation, and any operational risk that could impair enforcement during the forbearance period.

## 5. Vertical / structural / temporal relationships
- Treat the transaction as layered: governing documents set baseline rights, the forbearance agreement temporarily modifies enforcement, and ancillary acknowledgments or reaffirmations preserve the collateral and guarantee stack.
- Track time-sensitive items separately: signing date, effectiveness date, forbearance expiration, reporting due dates, continuation filing deadlines, cure windows, and any covenant tested over a rolling period.
- If the source set contains multiple obligors, lenders, guarantors, or collateral pools, map who owes what, who is bound by the waiver, and who must consent before any remedial action or release can take effect.
- Distinguish immediate covenant maintenance from end-of-period deliverables so the draft does not blur ongoing obligations with one-time closing deliverables.
- Where a source document refers to an external approval or consent, keep it outside the agreement unless and until the condition is satisfied; do not assume the forbearance can override a third party’s reserved rights.

## 6. Output structure conventions
- Forbearance agreement: produce a complete operative agreement with defined terms, recitals, forbearance grant, reservations of rights, acknowledgments, borrower and guarantor covenants, conditions precedent, default triggers, expiration/termination mechanics, release language as appropriate, and execution blocks.
- Issues memorandum: define a simple ordinal severity scale once, then list each issue with a severity label, concise analysis, cited governing provision or source authority, practical consequence, and a drafting or negotiation recommendation.
- Each issue entry should close the loop: identify the relevant scale or amount, tie it to another clause or document it affects, and state the downstream consequence for the lender or transaction.
- End the memorandum with a Recommended Actions block that assigns an imperative next step, the responsible role, and a timing anchor tied to signing, funding, or the forbearance deadline.
- Use the source documents’ terminology consistently for defined terms, collateral descriptions, parties, and remedy mechanics; do not invent labels that could create ambiguity.
- Confirm the drafted forbearance agreement is the non-empty primary deliverable and that the issues memorandum is secondary, with both documents containing operative analysis rather than mere summaries.
