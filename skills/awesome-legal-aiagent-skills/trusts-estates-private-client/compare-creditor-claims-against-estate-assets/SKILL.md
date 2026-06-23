---
name: compare-creditor-claims-against-estate-assets
task_id: trusts-estates-private-client/compare-creditor-claims-against-estate-assets
description: Reconciling creditor claims against estate assets requires applying the governing probate priority framework, separating secured and unsecured components of each claim, and distinguishing allowable claims from those that are legally defective or inadequately documented.
activates_for: [planner, solver, checker]
---

# Skill: Compare Creditor Claims Against Estate Assets — Claims Reconciliation Memorandum

## 1. Subject-matter triage
- Treat the task as a claims-reconciliation and allowance analysis for an estate administration record, not as a beneficiary-distribution memo first and foremost.
- Identify the governing jurisdiction, probate posture, and any creditor-claim deadlines before analyzing amounts or priority.
- Determine whether the source set contains multiple claims, multiple asset classes, or multiple administrations; if so, enumerate them before analysis and run the same framework for each claimant and each asset pool.
- If the record contains only one claim or one asset pool, say so expressly and explain why no broader comparison is needed.

## 2. Failure modes the skill is correcting
- Accepting stated claim totals without reconciling them to invoices, account statements, assessments, loan papers, or other proof of obligation.
- Collapsing all claims into a single number instead of separating allowed, disputed, contingent, secured, unsecured, and deficiency components.
- Skipping the probate waterfall and projecting distributions before priority is applied.
- Treating collateral as a binary yes/no issue rather than valuing the secured portion against the collateral and isolating any deficiency.
- Missing threshold defects that can defeat or reduce a claim, including lack of authority, defective execution, post-death accrual limits, or a claim asserted against the wrong obligor.
- Failing to distinguish a fixed, supported liability from an estimate, reserve, or unliquidated exposure.
- Concluding that a claim is allowed or disallowed without naming the governing probate, contract, or evidentiary rule that supports the result.
- Ending with diagnosis only, without a recommended next step for the executor.

## 3. Legal frameworks / domain conventions that apply
- Estate claims are paid under a mandatory priority scheme supplied by the governing probate code or comparable state law; the dispositive plan yields to that statutory waterfall.
- Allowed claims require a valid legal basis and adequate proof of amount; unsupported items may be objected to, reduced, or held pending documentation.
- Secured claims are allowed only to the extent of collateral value; any shortfall is treated separately under the unsecured-claims framework.
- Guaranties, notes, leases, service agreements, and similar obligations must be tested for enforceability against the decedent’s estate under the governing contract and agency rules.
- A signature made in a representative capacity may bind an entity rather than the individual estate; the signing block and surrounding documents control that analysis.
- Post-death or post-administration charges may be limited by the governing probate law, accrual rules, or the terms of the underlying obligation.
- Tax or governmental claims should be separated into fixed assessed liabilities and unconfirmed or estimated exposures; only documented liabilities should be treated as allowed without reservation.
- No creditor can receive more than the legitimate amount of its claim, and no distribution analysis should assume payment ahead of higher-priority claims.
- Use the controlling authority identified in the file set where available; otherwise cite the applicable probate statute, contract doctrine, or evidence rule by name and section in the memo.
- For every legal conclusion, state the rule and the consequence for allowance, priority, or recovery.

## 4. Analytical scaffolds
1. Identify the governing jurisdiction, the claims register, the estate asset pool, and any deadlines or special administration events that affect allowance or payment.
2. Build a claimant-by-claimant inventory. For each claimant, record the asserted amount, supporting documents, claimed basis, potential priority tier, and any collateral or guaranty.
3. For each claim, determine whether it is:
   - allowed as stated,
   - allowed in reduced form,
   - partially secured and partially unsecured,
   - disputed pending documentation,
   - or objected to as legally defective.
4. For secured items, compare the claimed secured exposure to the current collateral value and state the secured portion and any deficiency separately.
5. For guaranty-based claims, identify the instrument, the obligor, and the facts showing enforceability against the estate.
6. For contract-based claims, identify the signer, signature capacity, and any language showing whether liability runs to the decedent personally, a fiduciary, or another entity.
7. For employment-related or service-related claims, test whether the source documents support an enforceable obligation, including any at-will, post-death, or accrual limitations.
8. For tax, governmental, or assessment claims, distinguish supported fixed liabilities from estimates, pending audits, or reserves.
9. For each claim lacking full support, specify exactly what document or fact is missing and what effect the gap has on allowance.
10. Reconcile all allowable claims against available estate assets under the priority waterfall, then determine whether any class is unpaid, partially paid, or preserved for deficiency treatment.
11. Identify any arithmetic mismatch between the claim papers and the claimed total, and resolve it by reference to the underlying source documents.
12. End with an executor-facing recommendation set that states the next step for each disputed or incomplete claim.

## 5. Vertical / structural / temporal relationships
- Separate the analysis by claimant, then by claim type, then by payment priority; do not merge distinct obligations into one narrative.
- Where one document controls another, use the hierarchy in the file set: executed instrument before summary schedule, amended paper before earlier draft, final assessment before estimate, and collateral valuation before unsecured deficiency.
- Treat timing carefully: pre-death obligations, post-death administration expenses, late-filed claims, and contingent claims may occupy different priority or allowance positions.
- If the same claimant asserts multiple theories, analyze each theory separately and note whether they stack, duplicate, or contradict each other.
- If a claim spans multiple assets or collateral sources, allocate the claim across those sources before doing any distribution analysis.
- If the estate file includes amendments, supplements, or updated statements, use the most recent controlling version and explain any supersession.
- Where a claim depends on an unresolved factual predicate, mark the issue as pending rather than forcing a final allowance conclusion.

## 6. Output structure conventions
- Open with a short executive summary stating the estate’s apparent claims exposure, the main disputed items, and whether the available assets appear sufficient after priority.
- Include a concise methodology note identifying the governing jurisdictional framework and the source hierarchy used.
- Present a claim-by-claim table or equivalent organized analysis with these fields:
  - creditor/claimant
  - asserted basis
  - asserted amount
  - supported amount
  - priority tier
  - secured / unsecured / deficiency split, if applicable
  - documentation status
  - recommended action
  - brief rationale with controlling authority
- For every claim entry, include an explicit ordinal severity label defined once near the top of the memo, using a consistent scale such as Critical / High / Medium / Low.
- For every claim entry, close the analysis by stating: the scale of the issue in relation to the claimed amount or asset pool, the source document or rule it interacts with, and the downstream consequence for the estate or beneficiaries.
- Distinguish allowed, disputed, contingent, and reserve amounts in separate columns or sentences; do not mix them in a single figure.
- Include a waterfall summary that shows priority categories in order and states the estate’s remaining capacity after each category is satisfied or reserved.
- If distribution to beneficiaries is addressed, make it clearly derivative of the claims analysis and based only on net estate after allowed claims and superior-priority reserves.
- End with a Recommended Actions block that gives specific next steps for the executor, each written as an imperative, tied to the responsible role, and anchored to a filing, response, or administration milestone.
- Keep the memo self-contained and document-driven; avoid unsupported assumptions and avoid conclusory labels without the governing rule stated alongside them.
