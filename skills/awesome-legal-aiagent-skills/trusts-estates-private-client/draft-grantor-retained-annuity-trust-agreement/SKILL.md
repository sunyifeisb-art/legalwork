---
name: draft-grantor-retained-annuity-trust-agreement
task_id: trusts-estates-private-client/draft-grantor-retained-annuity-trust-agreement
description: Drafting a grantor retained annuity trust agreement for privately held shares requires identifying the applicable transfer and valuation mechanics, checking any ownership-transfer restrictions in the governing company documents, confirming trustee independence and authority, and flagging valuation and mortality considerations in the issues memo.
activates_for: [planner, solver, checker]
---

# Skill: Draft Grantor Retained Annuity Trust (GRAT) Agreement for Biotech Executive's Private Company Shares

## 1. Subject-matter triage
- Treat the agreement as the primary deliverable and the issues memorandum as secondary.
- Draft the GRAT instrument first, then prepare the memo only after the agreement file is complete and non-empty.
- If source documents present more than one valuation date, transfer condition, trustee option, beneficiary path, or trust term alternative, enumerate the alternatives before choosing the drafting path.
- If only one path is supported, say so expressly and proceed on that basis.

## 2. Failure modes the skill is correcting
- Drafting the annuity before confirming the actuarial sizing inputs that determine whether the retained interest is properly structured.
- Missing company-level transfer limits, consent rights, lockups, or repurchase mechanics that can block or condition funding.
- Treating a private-share valuation as settled when the supporting methodology, assumptions, or timing remain contestable.
- Overlooking mortality exposure during the trust term and the estate-tax consequence if the grantor dies before the term ends.
- Naming a trustee without checking independence, administrative authority, and ability to hold restricted equity.
- Failing to reconcile the GRAT with existing estate-planning documents, beneficiary designations, or competing transfer instructions.

## 3. Legal frameworks / domain conventions that apply
- A GRAT pays a fixed annuity to the grantor for a stated term, with remainder beneficiaries taking what remains at the end if the instrument is properly structured.
- A zeroed-out GRAT uses the applicable actuarial assumptions so the present value of the retained annuity interest approximately offsets the contributed property value.
- The annuity amount should be drafted as a formula tied to the applicable valuation assumptions and rate in effect at funding, rather than as a hard-coded amount that can drift out of alignment.
- The trust term must be long enough to permit the planning objective but short enough to manage mortality exposure.
- Private company shares often carry contractual transfer limits; governing equity documents, charter provisions, buy-sell terms, and similar restrictions must be read together before funding.
- A defensible fair-market-value appraisal is central to the funding analysis and should be treated as an input to the draft, not an afterthought.
- Trustee powers should match the practical needs of holding, voting, receiving distributions on, and disposing of restricted private equity.
- Common GRAT practice includes considering a series of shorter-term trusts when the objective is to manage mortality risk while capturing appreciation over time.
- Where the drafting relies on transfer-tax or estate-tax consequences, cite the controlling Internal Revenue Code provisions, Treasury regulations, or other governing authority in the agreement notes or memo rather than stating the result abstractly.

## 4. Analytical scaffolds
1. Identify the funding inputs: determine the contributed equity, the valuation date, the applicable actuarial assumptions, and any term choice reflected in the source documents.
2. Draft the annuity clause as a formula-driven provision that tracks the funding inputs and avoids accidental mismatch between stated amount and intended zeroed-out treatment.
3. Read the company documents together: identify transfer restrictions, consent requirements, rights of first refusal, lockups, repurchase rights, and any notice mechanics that affect funding.
4. Test the valuation support: note the methodology, the assumptions that could be challenged, and the specific value used for drafting.
5. Assess trustee fitness and authority: confirm independence, power over restricted shares, and authority to perform all administrative acts needed for the trust to function.
6. Check the remainder structure and administration mechanics: confirm beneficiary designations, contingent takers, tax-apportionment language if needed, governing law, and fiduciary administration provisions.
7. Cross-check the estate plan: flag any will, revocable trust, beneficiary designation, or prior transfer instruction that could conflict with the GRAT.
8. In the issues memorandum, state each problem with its controlling authority, the source-document interaction, the scale or practical magnitude drawn from the file, and the downstream consequence for the client.

## 5. Vertical / structural / temporal relationships
- Separate pre-funding issues from post-funding administration issues; do not blend a funding blocker with a later reporting or operation point.
- Separate document hierarchy issues from valuation issues; if a company document conditions transfer on consent, that question comes before any tax sizing refinement.
- Separate trust-term timing from mortality timing; the relevant question is whether the term chosen creates unacceptable estate-inclusion exposure if death occurs during the term.
- If multiple source documents speak to the same asset transfer, reconcile them in hierarchy order and flag any inconsistency rather than assuming the latest document controls.
- If the transfer mechanics depend on a notice period, approval window, or closing sequence, anchor the drafting to that temporal sequence.

## 6. Output structure conventions
- Deliver `grat-agreement.docx` as a complete trust instrument, not a summary of terms.
- The agreement should include the operative trust provisions, annuity formula language, term, remainder provisions, trustee powers, administrative provisions, grantor-trust treatment language, tax-related mechanics, and governing law.
- Deliver `issues-memorandum.docx` as a separate advisory memo.
- The memo should use an ordinal severity scale defined once at the top and applied consistently to each issue entry.
- Each issue entry should identify the problem, cite the controlling authority relied on, explain how the source documents interact, and state the consequence if unresolved.
- End the memo with a Recommended Actions section that uses imperative verbs, names the responsible role, and ties each action to a timing anchor or funding milestone.
- Before finishing, confirm that the primary agreement file exists, is non-empty, and contains operative clauses rather than a placeholder description.
- Avoid scenario-specific dollar figures, percentages, share counts, or reconciliation arithmetic unless they appear in the source documents and are necessary to the draft.
