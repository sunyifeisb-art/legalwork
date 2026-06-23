---
name: draft-fee-letter
task_id: banking-finance/draft-fee-letter
description: Drafts a fee letter for a leveraged acquisition financing, reconciling fee economics across deal documents and flagging cross-document inconsistencies in a separate issues memo.
activates_for: [planner, solver, checker]
---

# Skill: Fee Letter Drafting with Issues Memo (Senior Secured Credit Facility)

## 1. Subject-matter triage
- Treat the fee letter as the operative economics document, not a summary of deal terms.
- Draft the fee letter first; draft the issues memorandum only after the fee letter text is complete and internally coherent.
- If the source set contains both a draft fee letter and related financing documents, identify whether the task is a single-document drafting exercise or a cross-document reconciliation exercise; if multiple fee concepts appear, enumerate them before drafting.

## 2. Failure modes the skill is correcting
- Treating a fee as merely payable at closing when the operative documents indicate a different timing concept, such as earned status upon signing or another triggering event.
- Omitting a regulatory disclosure carve-out from the confidentiality provision, creating a compliance problem for regulated entities.
- Failing to reconcile ticking fee start dates across related deal documents.
- Leaving out standalone survival language for fee obligations, creating an enforceability gap if the commitment letter terminates before fees are paid.
- Collapsing distinct economics into a single generic fee provision instead of tracking the actual transaction mechanics document by document.
- Producing an issues memo that notes discrepancies but does not tie each one to the controlling source and a practical fix.

## 3. Legal frameworks / domain conventions that apply
- Ticking fee: identify the accrual start date in each relevant document, reconcile any inconsistency, and state the operative timing in the draft.
- Earned vs. payable distinction: verify whether a fee is characterized as earned upon signing or another trigger, as opposed to merely payable at closing, and reflect that characterization consistently.
- Ticking fee refundability: determine whether the fee is creditable or refundable against other closing fees and draft the treatment expressly if the documents are silent or inconsistent.
- Regulatory disclosure carve-out: include an exception in confidentiality language for disclosures required by law, regulation, supervisory request, or similar authority.
- Revolver commitment fee step-down: if present, specify the trigger, measurement source, and timing mechanics so the fee curve can be administered without ambiguity.
- OID mechanics: state that original issue discount is treated as a discount on proceeds rather than a separate cash fee payment, and keep the sources-and-uses presentation aligned.
- MFN/pricing protection on flex: if pricing flexibility can be exercised, address whether earlier-committed lenders receive corresponding protection.
- SOFR floor interaction with flex: if pricing flex affects spread, address how any floor concept interacts with the revised pricing.
- Survival: include standalone survival language so fee obligations continue as intended after termination of the commitment letter or related financing document.
- Hold amount context: if the structure contemplates a retained hold amount, verify whether it affects the fee economics and draft accordingly.
- Governing priority: if the deal documents specify hierarchy or control language, use that hierarchy to resolve inconsistencies in the draft and in the issues memo.

## 4. Analytical scaffolds
1. Fee inventory: enumerate each fee concept reflected in the source set before drafting; if only one fee concept is truly in scope, state that expressly.
2. Timing analysis: determine when each fee is earned, payable, accrued, refundable, or creditable; preserve any distinctions rather than flattening them.
3. Document reconciliation: cross-check the commitment letter, term sheet, committee materials, precedent, and ancillary deal papers for inconsistent economics, triggers, or carve-outs.
4. OID and sources-and-uses check: confirm that any discount economics are described as proceeds discounting and that the financing math presentation matches the operative text.
5. Confidentiality and regulatory carve-out check: ensure the confidentiality provision permits required disclosures without undercutting the fee letter’s general confidentiality framework.
6. Survival and termination check: confirm fee obligations survive as needed after termination or expiration of related commitments.
7. Issues memo method: for each inconsistency, identify the source document, describe the mismatch, explain the practical consequence, and state a high-level proposed fix.

## 5. Vertical / structural / temporal relationships
- Track vertical relationships between the fee letter and the underlying commitment package: where the documents overlap, the fee letter should not silently diverge from the economics or carve-outs elsewhere.
- Track temporal relationships for accrual, signing, funding, closing, expiration, and termination; the operative date should be stated with precision wherever timing changes the economics.
- If multiple documents use different terminology for the same event, normalize the terminology in the draft and note the divergence in the issues memo.
- If a document’s hierarchy clause or incorporation language resolves a conflict, follow that allocation rather than averaging conflicting formulations.

## 6. Output structure conventions
- Draft the fee letter as a complete operative document with integrated fee provisions, confidentiality carve-out, survival language, and any other terms needed to make the economics executable.
- Draft the issues memorandum as a separate advisory deliverable with a clear severity scale stated once at the top and applied uniformly to each issue.
- For each issue, include the source document, the nature of the inconsistency, the consequence for the transaction, and a proposed resolution at a high level.
- End the issues memorandum with a concise Recommended Actions section that assigns an action, a responsible role, and a timing anchor tied to the transaction milestone.
- Keep the fee letter and issues memorandum internally consistent; do not let the memo propose fixes that the draft does not reflect unless the inconsistency is expressly identified as unresolved.
- Before finalizing, confirm that the fee-letter file is complete and contains operative clauses, and that the issues memorandum is complete and contains actual issue entries rather than a narrative summary.
