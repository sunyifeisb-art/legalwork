---
name: extract-beneficiary-designations-from-existing-beneficiary-designation-forms
task_id: trusts-estates-private-client/extract-beneficiary-designations-from-existing-beneficiary-designation-forms
description: Closes the gap where agents list beneficiary designations without tracing contingent and derivative beneficiaries, flagging handwritten amendment validity risks, identifying accounts with no effective designation, and addressing retirement-account distribution implications for non-spouse beneficiaries.
activates_for: [planner, solver, checker]
---

# Skill: Extract and Reconcile Beneficiary Designations from Multiple Account Forms

## 1. Subject-matter triage

- Treat the source set as a cross-document reconciliation exercise: beneficiary forms, trust or estate summary material, and any related account records must be read together.
- First enumerate every account or form in scope, then extract the designation details for each before drawing conclusions.
- If only one account is present, say so explicitly and confirm there are no companion accounts that could carry separate designations.
- Preserve the distinction between primary, contingent, and derivative takers; do not flatten them into a single beneficiary list.

## 2. Failure modes the skill is correcting

- Listing named beneficiaries without tracing what happens if a beneficiary is deceased, disclaimed, or otherwise does not take; the report must follow the designation language through contingent and derivative paths.
- Missing that a handwritten alteration or interlineation may be ineffective if it does not comply with the form’s completion and execution instructions.
- Failing to identify accounts with no effective designation, no contingent beneficiary, or a designation that is incomplete on its face.
- Assuming that one account update automatically carries over to related or companion accounts; separate registrations often require separate review.
- Omitting retirement-account distribution consequences when a non-spouse beneficiary is named on a retirement asset.
- Ignoring conflicts between beneficiary forms and the broader estate plan or any divorce-related transfer directive reflected in the source materials.
- Reporting issues without tying them to the affected account, the governing document language, and the practical consequence if the designation is not corrected.

## 3. Legal frameworks / domain conventions that apply

- Read the designation form as the controlling operative instrument for that account unless the source set shows a superseding court order, settlement term, or later validly executed replacement form.
- Apply the form’s own completion instructions to determine whether an amendment, strike-through, or added language is valid; if the instructions are not followed, flag the change as vulnerable.
- If a beneficiary predeceases the owner and the form uses per stirpes or similar language, trace the share to the beneficiary’s descendants only as the designation language permits.
- For accounts lacking an effective designation, determine the default distribution path under the plan or account terms as reflected in the source set and note the administrative effect of that default.
- For retirement accounts naming a non-spouse beneficiary, identify the applicable inherited-account distribution regime and whether any beneficiary category changes the result; note trust-designation implications where the trust is the recipient or intermediary.
- Where estate documents are provided, compare them against the forms to identify alignment or mismatch in beneficiary intent.
- Where a divorce decree, settlement, or comparable order appears in the source set, treat it as potentially controlling over an earlier designation if the document or governing law so provides.

## 4. Analytical scaffolds

1. Create a complete account inventory from all source documents: account type, institution or plan sponsor, account identifier if shown, form date, owner, primary beneficiary, contingent beneficiary, amendment history, and any related notes.
2. For each account, read the designation literally and map the distribution path in order: primary taker, then contingent taker, then any derivative takers if the form language requires it.
3. For each account with a deceased or unavailable named beneficiary, state what happens next under the form language and the default terms referenced in the source set.
4. For each handwritten or otherwise altered form, test the alteration against the form’s execution and completion requirements; flag validity risk where compliance cannot be confirmed.
5. For each retirement account, identify whether the designated beneficiary is a spouse, non-spouse individual, trust, estate, or other category and summarize the distribution implications that follow from that category.
6. Compare all beneficiary forms against the trust summary memo and any estate-planning or marital documents in the source set; identify conflicts, omissions, or apparent stale designations.
7. For each issue, state: the affected account, the governing document or rule, the practical consequence, and the recommended corrective step.
8. Rank issues by severity using a defined ordinal scale and keep the same scale throughout the report.

## 5. Vertical / structural / temporal relationships

- Separate accounts that may appear related but legally stand alone; an individual retirement account, Roth account, brokerage account, and employer-plan account may each carry different beneficiary designations.
- Earlier forms are superseded only by later valid forms or controlling orders; do not assume an apparent intent change became effective without proper execution.
- A designation that is valid when signed may still create an unintended result if a named beneficiary later dies or if the owner’s family structure changes.
- Trust provisions and will provisions describe overall intent, but beneficiary forms control nonprobate transfers unless the source set shows a superior instruction.
- If multiple documents conflict over time, use the later valid controlling document for the same account and note the transition point.

## 6. Output structure conventions

- Write a single beneficiary-designation report in conventional legal-analysis form.
- Use this sequence: concise overview; account-by-account extraction table; issue analysis; prioritized recommendations.
- Define a four-level severity scale at the outset and apply it consistently to every issue entry.
- Each account row should include: account, source document, date, current primary beneficiary, contingent beneficiary, amendment notes, and status flag.
- Each issue entry should include: severity, account, issue statement, governing document or rule, consequence, and recommended fix.
- When the source set does not support a conclusion, say that the point is indeterminate from the materials rather than guessing.
- End with a short Recommended Actions section that assigns each action to an appropriate role and ties it to an immediate or milestone-based timing cue.
