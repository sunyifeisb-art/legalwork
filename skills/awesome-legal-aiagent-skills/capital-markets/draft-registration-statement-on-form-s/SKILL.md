---
name: draft-registration-statement-on-form-s1
task_id: capital-markets/draft-registration-statement-on-form-s
description: Form S-1 drafting where the baseline produces a structurally complete prospectus but does not apply structure-specific disclosure requirements or produce the companion issues memo identifying cross-document discrepancies.
activates_for: [planner, solver, checker]
---

# Skill: Draft Registration Statement on Form S-1

## 1. Subject-matter triage
- This is a drafting task with a required companion issues memo.
- Treat the registration statement as the primary deliverable and the memo as secondary.
- Before finishing, ensure the S-1 draft is the operative product, not a summary of what should go into it.
- If the source set contains multiple versions of a fact, identify and reconcile them rather than averaging them.

## 2. Failure modes the skill is correcting
- The draft may look structurally complete while omitting disclosure that is specific to the issuer’s capital structure, governance, or IPO posture.
- The memo may be omitted or reduced to general observations instead of a concrete cross-document discrepancy list.
- The draft may carry forward figures from one source without checking whether another source controls the same item.
- The dilution section may be written narratively without a traceable per-share build.
- Non-GAAP measures may be repeated without a check that each adjustment is reconcilable to GAAP.
- The prospectus may fail to flag risks that arise from the issuer’s equity structure, compensation history, or related-party activity.
- If the offering facts change across documents, the draft can become internally inconsistent unless those differences are surfaced explicitly.

## 3. Legal frameworks / domain conventions that apply
- Follow the Form S-1 / Securities Act of 1933 disclosure architecture, including the core prospectus sections customarily required for an IPO registration statement.
- If the issuer qualifies as an Emerging Growth Company, disclose the status and the specific accommodations relied on under Securities Act and JOBS Act practice, and note the circumstances under which the status ends.
- If post-offering voting power is concentrated, disclose controlled-company status and the exchange-rule consequences under applicable listing standards.
- If the issuer has multiple classes of common stock or other disparate voting rights, address governance concentration and market-index or investor-perception implications as risk disclosure.
- If redeemable or otherwise outside-the-issuer-control preferred equity exists pre-IPO, consider the balance-sheet classification and the IPO conversion effect in the capitalization presentation under applicable GAAP.
- If there are equity awards granted at potentially problematic exercise prices, disclose the potential accounting, tax, and employee-relations consequences.
- Material related-party transactions must be disclosed with the relationship, economics, approvals, and conflicts under SEC related-party disclosure conventions.
- Non-GAAP measures must be reconciled to the most directly comparable GAAP measure under Regulation G and Item 10(e) of Regulation S-K.
- Dilution must be shown as a per-share bridge from historical net tangible book value to pro forma net tangible book value and then to the public investor’s dilution.
- The memo should reflect that disclosure law is document-driven: where the source documents conflict, the draft must pick a controlling source and say why.

## 4. Analytical scaffolds
- Draft the standard IPO sections in a market-conventional Form S-1 sequence, including summary, risks, proceeds, dividend policy, capitalization, dilution, business, management, related-party disclosure, principal holders, stock description, underwriting, legal matters, and financial statements/MD&A.
- For each section, ask whether the issuer’s structure changes the default IPO disclosure package.
- Build the risk factor set around facts that are specific to the issuer, not generic capital-markets boilerplate.
- For governance and equity structure issues, test whether control, board composition, voting disparity, transfer restrictions, or investor rights require special disclosure.
- For financial presentation, trace each figure back to the financial statements, capitalization table, and any source memo or draft.
- For any ratio, per-share number, or reconciliation, verify the arithmetic against the source materials before writing it into the draft.
- When the source set gives competing figures, identify the controlling source, explain the mismatch, and preserve the unresolved issue for the memo.
- If an item depends on a missing fact, mark it as an open point instead of filling in a guess.

## 5. Vertical / structural / temporal relationships
- Organize the analysis by document hierarchy: company facts, capital structure, governance, financial statements, then offering mechanics.
- Track pre-offering, pro forma, and post-offering positions separately.
- Distinguish historical results from pro forma adjustments and from forward-looking disclosure.
- When a legal or accounting consequence depends on timing, tie it to the relevant phase of the transaction rather than collapsing it into a single statement.
- For any issue that spans more than one source document, state the source interaction, the controlling fact pattern, and the transaction consequence.

## 6. Output structure conventions
- Produce two deliverables: the S-1 draft and the companion issues memorandum.
- Draft first, memo second.
- The S-1 draft should be complete and presentation-ready, using conventional prospectus section headings rather than a rubric-style checklist.
- The memo should be a true advisory document: each entry should identify the discrepancy or risk, state the severity using a consistent ordinal scale defined at the top, cite the controlling authority or controlling source where relevant, explain the consequence, and close with a concrete recommended action.
- For each memo item, include the competing source points, the source that should control if the record supports it, and the specific follow-up needed if it does not.
- When describing legal or disclosure propositions, name the governing authority or convention supporting the position rather than stating conclusions baldly.
- End the memo with a short action list directed to the responsible company or deal team roles, tied to the IPO timeline or filing milestone.
- Before finalizing, confirm that the draft file exists and is populated with operative disclosure, and that the memo file exists and contains issue-specific recommendations rather than a generic summary.
