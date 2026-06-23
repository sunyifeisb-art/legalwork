---
name: draft-markup-of-lp-interest-transfer-agreement
task_id: funds-asset-management/draft-markup-of-limited-partner-interest-transfer-agreement
description: Redline a buyer’s draft limited partner interest transfer agreement from the seller’s perspective, converting a buyer-favorable draft into a seller-protective document by adding closing conditions, tax provisions, and other transfer protections identified by reviewing the governing partnership agreement, related side arrangements, financing terms, and capital account information.
activates_for: [planner, solver, checker]
---

# Skill: Seller-Protective Redline of LP Interest Transfer Agreement

## 1. Subject-matter triage
- Treat the buyer’s draft transfer agreement as the primary deliverable and the issues memo as secondary.
- Review the source set in this order: governing partnership agreement, any side arrangements, financing terms, then capital account and payment data.
- Identify whether there is one transfer, one transferee, and one closing path; if multiple parties, interests, or tranches exist, analyze each separately before drafting.
- Confirm whether any lender, consenting party, or notice recipient must be addressed before closing.

## 2. Failure modes the skill is correcting
- Produces a memo about problems but never actually marks up the agreement.
- Misses transfer restrictions, consent mechanics, or notice/waiver steps embedded in the fund documents.
- Fails to convert economic or tax issues into operative closing conditions, reps, covenants, or purchase price mechanics.
- Leaves pending capital calls, accrued obligations, or transfer-date allocations ambiguous.
- Gives commentary without clear priority, severity, or actionability.
- Relies on styled edits only, so changes are not legible after export.

## 3. Legal frameworks / domain conventions that apply
- **Transfer mechanics under the governing partnership agreement:** Track any consent rights, transfer prohibitions, qualifications for permitted transferees, minimum ownership or commitment requirements, rights of first refusal or similar election rights, notice periods, and evidence of waiver or expiration that must precede closing.
- **Financing and borrowing-base constraints:** If a subscription facility or similar credit arrangement ties availability to investor commitments, a transfer may require lender consent, a release, or a confirmation that borrowing-base or collateral consequences have been addressed. Use the governing finance documents to determine whether consent, notice, or a substitution mechanic is required.
- **Tax compliance and withholding:** Add customary buyer tax representations and delivery obligations where transfer status, residency, withholding, reporting, or information-form delivery affects the transaction or the fund’s compliance.
- **Basis and administrative cost allocation:** If the transfer triggers a tax, accounting, or administrative regime, allocate who bears the related cost and who prepares or delivers the needed filings or notices.
- **Pending capital and unpaid amounts:** Address unpaid capital calls, accrued expenses, and any other as-of-closing payment items explicitly, including whether they are paid at closing, netted, assumed, or remain with the transferor.
- **Authority-based drafting:** State the rule or document provision that supports each protective change; do not recite a conclusion without anchoring it to the operative source.

## 4. Analytical scaffolds
- **Step 1 — Map the transfer constraints.** Extract every transfer-related restriction, condition, notice, election, qualification, or documentary deliverable from the partnership agreement and related side arrangements.
- **Step 2 — Test financing impact.** Determine whether the transfer affects lender rights, collateral coverage, investor substitution, or facility notices.
- **Step 3 — Reconcile economics and capital items.** Compare the draft against the capital account statement and any unpaid or accrued amounts to determine what must be settled at signing or closing.
- **Step 4 — Draft operative protections.** Convert each issue into a concrete redline: closing condition, representation, covenant, indemnity, payment mechanic, tax allocation, or documentary delivery.
- **Step 5 — Annotate each change.** For every substantive edit, explain why it is needed and what risk it removes for the seller.
- **Step 6 — Separate must-fix from should-fix.** Use a uniform severity scale in the memo and reserve the strongest label for items that can block closing or create material exposure.
- **Step 7 — Preserve plain-text readability.** Every redline must remain understandable even if formatting is stripped in conversion.

## 5. Vertical / structural / temporal relationships
- Identify what must happen before signing, between signing and closing, and at closing.
- If the fund documents require prior notice, waiver, election expiration, or lender sign-off, make those events express conditions precedent rather than implied background assumptions.
- If transfer effectiveness depends on post-closing cooperation, specify the continuing obligations and who must act.
- When multiple documents interact, reconcile them so the transfer agreement does not override the partnership agreement, side arrangements, or financing terms by accident.
- Tie capital-account or payment allocations to the closing date, record date, or other operative temporal anchor used in the source documents.

## 6. Output structure conventions
- Produce two files: the redlined transfer agreement first, then the issues memo.
- The redline must use robust textual change markers that survive export, such as `[DELETED: ...]`, `[INSERTED: ...]`, and `[REPLACED: old → new]`, and each substantive change should include a short `[Rationale: ...]` note.
- Do not rely on visual styling alone to show edits.
- The redlined agreement should read as an operative contract, not as commentary about proposed changes.
- The issues memo should use a uniform ordinal severity scale defined at the top, and each issue entry should state the source provision, the seller risk if ignored, the downstream consequence, and the specific contractual change made or needed.
- Use conventional deal-document sectioning rather than the rubric’s internal checklist format.
- End the memo with a concise Recommended Actions block that assigns each next step to a responsible role and a timing anchor tied to signing, closing, or another transaction milestone.
- Where a legal proposition is relied on, cite the controlling authority or source document provision by name and section as reflected in the source set or generally recognized practice.
