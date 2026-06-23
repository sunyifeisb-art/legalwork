---
name: identify-issues-in-cre-clo-offering-memorandum
task_id: structured-finance-securitization/identify-issues-in-offering-memorandum
description: Reviewing a preliminary offering memorandum for a CRE CLO transaction from a placement agent perspective to identify genuine structural and disclosure issues, explain their significance for investor decision-making and placement agent liability, and distinguish them from provisions consistent with CRE CLO market practice.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Preliminary Offering Memorandum for CRE CLO Transaction

## 1. Subject-matter triage
- Treat the offering memorandum and related deal documents as a coordinated disclosure package, not isolated papers.
- Separate true structural or disclosure defects from ordinary managed-structure flexibility and market-standard CRE CLO language.
- Focus on issues that affect pricing, allocation, investor reliance, transferability, servicing outcomes, or placement-agent exposure.
- If the source set contains multiple tranches, pools, or transfer scenarios, enumerate them first and analyze each separately before collapsing to any overall conclusion.

## 2. Failure modes the skill is correcting
- Flagging a term as problematic without explaining why it changes investor underwriting, execution risk, or liability exposure.
- Missing how a disclosure gap interacts with another document term that softens, contradicts, or amplifies the same risk.
- Treating limited loan-level disclosure as a formatting issue rather than an underwriting and pricing problem.
- Overstating ordinary CRE CLO discretion as a defect when the document clearly cabins it and the market tolerates it.
- Ignoring conflicts among manager, servicer, borrower, equity, or affiliate relationships when the structure depends on those actors.
- Missing drafting artifacts copied from other transactions that suggest stale or inapplicable mechanics.
- Failing to distinguish closing-date protections from ongoing post-closing protections where the distinction matters to collateral drift.
- Omitting a concise remediation recommendation tied to the relevant deal participant and timing.

## 3. Legal frameworks / domain conventions that apply
- CRE CLO waterfalls: identify where hedge cash flows, note interest, principal, and diversion mechanics sit relative to one another, and whether the memorandum explains the resulting priority and risk allocation.
- Investor disclosure and anti-fraud framing: assess whether material collateral, servicing, concentration, extension, and conflict information is presented with enough specificity to support informed reliance under the securities law disclosure framework applicable to the offering.
- Manager / special servicer / affiliate conflicts: identify affiliated relationships and evaluate whether governance, consent, or disclosure mechanics address them in a way consistent with market practice.
- Collateral protection mechanics: determine which offered tranches receive overcollateralization or similar protections and whether any offered tranche lacks an expected structural response to collateral deterioration.
- Claims and remediation process: determine whether a neutral third-party review or other independent process exists for representation and warranty or related claims; if absent, assess the enforcement gap.
- Concentration limits and drift: determine whether concentration tests operate only at closing or continue over time, and whether the pool can become more concentrated as assets amortize, exit, or extend.
- Modification and extension authority: identify whether extension, modification, forbearance, or workout authority is objectively bounded or effectively open-ended.
- Cross-border transfer and retention: assess whether the memorandum addresses any risk that note transfers into other jurisdictions may trigger separate securitization retention or similar compliance regimes.
- Drafting consistency: identify provisions that appear imported from other deals, refer to absent parties or mechanics, or otherwise create internal inconsistency.
- Market-practice filter: ordinary managed CRE CLO features should be noted as standard unless the drafting creates a concrete gap, ambiguity, or misallocation.

## 4. Analytical scaffolds
1. Build an issue inventory by topic: waterfall, collateral disclosure, conflicts, protections, claims process, concentration, modification authority, cross-border retention, and drafting artifacts.
2. For each issue, identify the exact document location, the affected transaction component, and the source clause or schedule that interacts with it.
3. State the issue’s scale using a concrete figure or threshold drawn from the documents when available, such as collateral size, tranche size, term, concentration level, or contractual headroom.
4. Explain the downstream consequence for investor decision-making, pricing, execution, or placement-agent liability.
5. Classify severity using a uniform ordinal scale defined at the outset of the memorandum, and apply it consistently to every issue.
6. If the same topic appears in multiple documents, reconcile the provisions and note any inconsistency or omission.
7. Where a provision looks standard, say so explicitly and explain why it does not require remediation.
8. End each issue with a practical fix: revise disclosure, add an express qualifier, align mechanics across documents, or clarify governance.

## 5. Vertical / structural / temporal relationships
- Compare closing-date tests to ongoing tests; a closing-only constraint may become ineffective if the structure permits later drift.
- Compare protection mechanics across tranches; a cure for one class may not protect another, and that divergence should be stated.
- Track how extension authority can feed concentration drift when assets roll, extend, or refinance.
- Check whether claims-resolution mechanics and cash-flow protections operate in separate layers so that an investor can face both weak enforcement and weak economics at once.

## 6. Output structure conventions
- Produce a memorandum-style issue list organized by numbered issues.
- Define the severity scale once near the start, then assign a severity to every issue.
- For each issue, include: short issue title, severity, document reference, why it matters, the interacting provision or related document, and the recommended resolution.
- Make the consequence explicit and transactional: pricing, diligence, closing, transferability, enforcement, or liability exposure.
- Separate a concluding section for matters reviewed and deemed consistent with CRE CLO market practice, with brief reasons.
- Include a final Recommended Actions block with imperative steps directed to the appropriate deal participant and tied to a timing anchor from the transaction timeline or, if none exists, to the nearest closing or pricing milestone.
