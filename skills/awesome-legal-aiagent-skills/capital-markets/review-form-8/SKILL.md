---
name: review-form-8-k-compliance
task_id: capital-markets/review-form-8
description: Form 8-K compliance review where the baseline identifies triggered Items but misses exhibit-level deficiencies, cover page accuracy issues, and ancillary filing obligations created by the reported transaction.
activates_for: [planner, solver, checker]
---

# Skill: Review Draft Form 8-K for SEC Compliance Deficiencies

## 2. Failure modes the skill is correcting

- Reviews identify the likely triggered Item(s) but fail to test whether each Item’s disclosure is complete, internally consistent, and tied to the exact triggering event.
- Reviews miss cover-page defects, including the earliest-event date, issuer identifiers, ticker information, state of incorporation, and current shares outstanding as of the filing date.
- Reviews do not check exhibit indexing, exhibit labeling, or whether every referenced agreement or schedule is actually filed.
- Reviews overlook transaction-linked filing obligations that arise outside the 8-K itself, including follow-on notices and later amendment requirements.
- Reviews stop at issue description and do not state the practical consequence of the deficiency for SEC compliance, closing, or downstream disclosure risk.
- Reviews fail to anchor each legal conclusion to the controlling Form 8-K item, rule, or exhibit requirement.

## 3. Legal frameworks / domain conventions that apply

- Item-by-Item disclosure: A Form 8-K must report only the items actually triggered by the underlying event, but each triggered item must be tested against its own required content elements and timing.
- Cover page requirements: The cover page must accurately reflect the registrant’s identity, event date, issuer identifiers, and shares outstanding as of a date proximate to filing.
- Exhibit requirements: Item-based disclosure must be supported by the correct exhibit index; all material definitive agreements and other documents expressly referenced in the filing should be included and labeled under the appropriate exhibit number.
- Transaction-linked disclosure: A transaction may require ancillary SEC filings or later amendments where the event creates additional reporting obligations beyond the initial 8-K.
- Forward-looking statements practice: If the draft uses predictive or cautionary language, assess whether a cautionary statement or safe-harbor legend is included and placed appropriately.
- Cross-document consistency: Dates, names, consideration terms, securities counts, and closing mechanics must match the source documents and the checklist; inconsistencies are defects even if each sentence is otherwise grammatical.
- Authority-based review: State the controlling Item, exhibit rule, or filing obligation for every conclusion; do not rely on generic “SEC compliance” phrasing alone.

## 4. Analytical scaffolds

- First identify every event in the source set that could trigger a Form 8-K item, then test each candidate item separately rather than merging them into a single pass.
- For each triggered item, confirm the mandatory disclosure elements, the timing of the event, and whether the draft omits a required subpoint, qualifier, or attached document.
- Compare the draft against the deal documents and filing checklist for names, dates, amounts, securities counts, consideration structure, closing conditions, and post-closing obligations.
- Review the cover page against the source documents for the earliest-event date and shares-outstanding figure, then verify the remaining issuer-identification data for consistency.
- Review the exhibit index against every agreement, amendment, notice, or ancillary document referenced anywhere in the draft or checklist; missing or misnumbered exhibits should be flagged separately.
- If the draft includes forward-looking statements, test for an accompanying cautionary legend or safe-harbor treatment in the proper location.
- If the transaction creates a separate filing or later amendment duty, identify the obligation, the trigger, and the timing anchor stated in the source materials.
- When identifying a deficiency, tie it to the governing item or rule, explain the interaction with related disclosure or exhibit language, and state the filing or transaction consequence.

## 6. Output structure conventions

- Produce a form-check memorandum organized by Form 8-K item number, then separate sections for the cover page and exhibit index, using conventional legal memo headings.
- Begin with a brief summary of the review scope and a concise severity legend using an ordinal scale such as Critical / High / Medium / Low; apply that scale uniformly to every issue.
- For each issue, include: the affected item or exhibit reference, the defect, the controlling rule or item requirement, the severity, the cross-document inconsistency or interaction, the consequence, and the corrective action.
- Do not collapse distinct defects into a single umbrella comment when they arise from different items, different exhibits, different dates, or different obligations.
- Where more than one triggering item or exhibit exists, address each one in a separate, clearly labeled entry.
- End with a Recommended Actions section that assigns the action to the appropriate role identified in the source materials and includes a timing anchor tied to filing, closing, or amendment timing.
