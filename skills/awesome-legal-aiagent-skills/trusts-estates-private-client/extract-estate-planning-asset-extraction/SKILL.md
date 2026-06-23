---
name: extract-estate-planning-asset-extraction
task_id: trusts-estates-private-client/extract-estate-planning-asset-extraction
description: Closes the gap where agents compile asset schedules using a net worth summary without verifying whether irrevocable trust assets are incorrectly included in the client's owned-asset total, and without identifying ineffective beneficiary designations and their estate and income tax consequences.
activates_for: [planner, solver, checker]
---

# Skill: Estate Planning Asset Extraction — Comprehensive Asset Schedule

## 1. Subject-matter triage

- Treat the source set as a mixed inventory-and-beneficiary exercise, not a simple balance-sheet transcription.
- Separate asset ownership from beneficiary status at the outset; the same document set may contain both title evidence and designation evidence.
- If the source materials include multiple statements, summaries, and trust/account records, privilege the controlling document for each asset class and use summaries only as a cross-check.
- If only one asset category appears in the source set, say so explicitly before analyzing it.

## 2. Failure modes the skill is correcting

- Accepting a summary figure without identifying whether assets held in irrevocable trusts have been improperly counted as client-owned assets.
- Failing to cross-reference life insurance beneficiary designations against currently existing, properly named trusts; a designation naming a trust that does not exist, was never funded, or uses an incorrect name or date may be ineffective and may cause proceeds to pass through probate rather than directly to intended beneficiaries.
- Including the estate or another non-person entity as a retirement account beneficiary without flagging the distribution consequence; proceeds passing to a non-person beneficiary can lose individual beneficiary distribution options and may be subject to accelerated payout rules rather than a longer distribution period.
- Listing personal property as a single aggregate figure rather than identifying each item individually with a separately supported value.
- Not producing a reconciled owned-asset total that explains the difference between the stated net worth figure and the correctly computed client-owned figure.
- Collapsing distinct title, trust, and beneficiary questions into one narrative so that an asset is listed without a clear classification.

## 3. Legal frameworks / domain conventions that apply

- Irrevocable trust treatment: if a trust is irrevocable and funded separately from the client's individual estate, its assets are generally not owned by the client and should be analyzed separately from the client-owned total; the beneficiary or co-trustee relationship does not itself make the corpus personally owned.
- Life insurance beneficiary designation effectiveness: a designation should be tested for whether the named beneficiary exists and is identifiable; if the named trust does not exist, was revoked, or is misidentified by name or date, the designation may be ineffective and the proceeds may default under the policy or by law.
- Retirement account beneficiary designation — non-person beneficiary: when an estate or other non-person is named as beneficiary, accelerated distribution rules may apply regardless of the decedent's age; compare the resulting payout timing and administrative effects against the options available for an individual or qualifying trust beneficiary.
- Inherited retirement account rules: distribution rules depend on the beneficiary's status; non-person beneficiaries and most non-qualifying trusts generally receive less favorable payout treatment, while eligible designated beneficiaries and qualifying trusts may have more favorable options.
- Personal property valuation: each item of personal property with a separately appraised or documented value should appear as a separate line in the asset schedule; collapsing multiple items into a single aggregate figure obscures the basis for the stated value and is inadequate for estate inventory or planning purposes.
- Beneficiary designations on file with the administrator control the payout analysis, not the estate plan document alone; the operative record must be checked against the plan documents and trust instruments.
- Use the governing trust instrument, account agreement, policy form, and appraisal/supporting schedule as the controlling authorities for classification and valuation.

## 4. Analytical scaffolds

1. Enumerate every asset, account, policy, business interest, and personal item appearing in the source set before analyzing any one item.
2. For each enumerated item, identify:
   - title holder or controlling beneficiary category,
   - asset type,
   - source document supporting the entry,
   - value or basis if stated,
   - whether the item is included in the client-owned total, tracked separately, or excluded.
3. For any trust-related asset, determine whether the trust is revocable or irrevocable from the controlling instrument; if irrevocable, list the asset separately and exclude it from the client-owned total.
4. For any life insurance item, extract the beneficiary designation, compare it to the operative trust and policy records, and flag mismatches, nonexistent beneficiaries, revoked trusts, or misidentified trust references.
5. For any retirement account, identify the named beneficiary and classify the payout consequence based on whether the beneficiary is an individual, qualifying trust, estate, or other non-person entity.
6. For personal property, break out each separately supported item; do not aggregate unrelated items into one line unless the source documents themselves provide only a single combined line with no better support.
7. Reconcile the owned-asset total by summing only assets properly attributable to the client, then compare that result against any stated net worth or summary total and explain the variance item by item.
8. Treat every flag as a mini-issue: identify the factual trigger, the governing rule, the cross-document conflict, and the downstream planning or administration consequence.

## 5. Vertical / structural / temporal relationships

- Trust documents determine whether a trust is revocable or irrevocable and what property it holds; verify trust status from the instrument, not from a summary label.
- Account statements, policy records, and beneficiary forms control beneficiary analysis only as to the date and record they reflect; later plan drafts do not override a contrary operative designation unless the record shows a valid update.
- Summary letters and net worth schedules are useful reconciliation tools but can contain classification errors that must be corrected against the underlying records.
- Where a designation depends on a trust's existence or proper naming, compare the designation date, trust execution date, and any amendment or revocation document.
- Where an asset appears in multiple documents, resolve the conflict by hierarchy of control: operative title or designation record, then supporting statement, then summary.
- If the source set contains only one of multiple related records, note the limitation and avoid inferring an unstated beneficiary or ownership structure.

## 6. Output structure conventions

- Produce a single master asset schedule in a clean, spreadsheet-like format suitable for conversion to a document.
- Start with a brief classification key defining the ownership and beneficiary categories used in the schedule.
- Then present the asset schedule by conventional categories such as: client-owned probate assets, client-owned non-probate assets, revocable trust assets, irrevocable trust assets listed separately and excluded from owned-asset total, retirement assets, insurance assets, business interests, and personal property.
- Give each line item a clear description, title/beneficiary status, source reference, value, and planning note.
- Keep irrevocable-trust assets in a distinct section and do not include them in the client-owned subtotal.
- List personal property item by item with separate values and support.
- Include a reconciled owned-asset total and a short reconciliation narrative that explains any difference from the source summary figure step by step.
- Add an issues and planning flags section after the schedule; for each flag, state the issue, the governing rule, the document conflict, the consequence, and the suggested corrective action.
- Use an ordinal severity label for each planning flag, applied consistently across the schedule.
- End with a concise Recommended Actions block listing the next steps, the responsible person or role if identifiable from the source set, and the timing anchor tied to the estate-planning review or account-update process.
- Cite the controlling authority or governing document for each legal proposition relied on, whether that authority is a statute, regulation, instrument provision, account agreement, policy record, or appraisal document.
