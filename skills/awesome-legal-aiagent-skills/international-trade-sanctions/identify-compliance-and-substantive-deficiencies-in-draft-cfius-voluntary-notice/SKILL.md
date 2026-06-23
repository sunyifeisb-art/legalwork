---
name: its-identify-cfius-voluntary-notice-deficiencies
task_id: international-trade-sanctions/identify-compliance-and-substantive-deficiencies-in-draft-cfius-voluntary-notice
description: Produces a categorized deficiency memorandum for a draft CFIUS voluntary notice that identifies disclosure gaps, omitted ancillary agreements, board nomination rights analysis issues, government contract omissions, regulatory correspondence non-disclosures, and mandatory filing trigger analysis.
activates_for: [planner, solver, checker]
---

# Skill: Identify Compliance and Substantive Deficiencies in a Draft CFIUS Voluntary Notice

## 1. Subject-matter triage (only if applicable)

- Treat the draft notice as a disclosure-completeness and risk-assessment exercise, not a generic corporate diligence summary.
- Identify every foreign person, related entity, and transaction document that must be checked against the notice; if the source set includes multiple parties, multiple agreements, or multiple periods, enumerate them before analyzing.
- Separate filing-completeness defects from substantive risk defects; a notice can be complete enough to file yet still understate national security sensitivity.

## 2. Failure modes the skill is correcting

- Comparing the notice to a generic CFIUS template instead of testing each disclosure against the governing notice requirements and source documents.
- Missing side letters, oral understandings, amendments, supplemental arrangements, and other ancillary agreements that alter economics, governance, information rights, or representations.
- Treating board nomination rights as ordinary governance language instead of analyzing what the nominee will see, influence, or approve in sensitive areas.
- Overlooking government contracts, subcontracts, grants, and classified work that should be disclosed as part of the target’s public-sector exposure.
- Failing to surface regulatory correspondence that may evidence compliance issues or agency concern.
- Allowing an understated business description or NAICS code to mute the transaction’s true sensitivity.
- Skipping the ownership-tracing exercise needed to test whether a foreign government substantial interest creates a mandatory filing issue.
- Identifying an issue without tying it to source-document support, the interacting provision, and the practical consequence for filing, review, or remedy.

## 3. Legal frameworks / domain conventions that apply

- Apply the CFIUS voluntary notice framework under 31 C.F.R. Part 800, including the notice content requirements, definitions of foreign person and covered transaction, and mandatory filing concepts where relevant.
- For completeness questions, compare the notice against the required identity, ownership, control, transaction, business, and contact disclosures expected by the regulations and by the source documents.
- For ancillary agreements, treat any related agreement, side letter, voting agreement, governance arrangement, or informal understanding as potentially material if it affects rights, obligations, or risk allocation.
- For director nomination rights, analyze national security significance through access to material nonpublic information, sensitive technology, classified or government-related work, and decision-making authority.
- For government contracts, treat omissions as material where the target’s work includes federal, state, or foreign government business, classified work, or public research funding.
- For regulatory correspondence, assess whether the correspondence reflects export-control, sanctions, investment, or other agency concerns that should be disclosed to CFIUS.
- For business-description accuracy, verify whether the NAICS code and narrative description accurately reflect the target’s primary activities and sensitivity.
- For mandatory filing analysis, trace ownership through the acquiror’s chain of control to determine whether a foreign government substantial interest or other filing trigger is implicated under the applicable rule.
- Cite the governing authority for each proposition relied upon, using the relevant regulation, statute, or other controlling source identified in the materials or otherwise applicable to the issue.

## 4. Analytical scaffolds

1. Build a party map: list each foreign person, related entity, and filing-relevant affiliate; confirm the notice identifies them with the required completeness.
2. Build a document map: list the main transaction agreement plus every side letter, amendment, supplement, governance agreement, and other ancillary document in the source set.
3. Compare the notice disclosure to the document map and flag any omitted or inconsistently described agreement, term, or understanding.
4. For each board nomination or observer right, analyze the scope of access, committee participation, and decision rights tied to sensitive information or government-facing operations.
5. Compare the notice’s government-contract disclosure to the complete contracts schedule, including grants, subcontracts, and classified or special-access work if present.
6. Review regulatory correspondence for disclosures that bear on compliance status, enforcement risk, or agency concern.
7. Test the business description and NAICS code against the source record for understatement, overgeneralization, or mismatch with the target’s actual operations.
8. Trace ownership and control through each tier of the acquiror structure to assess whether a foreign government substantial interest or other mandatory filing trigger is implicated.
9. For each issue, identify the controlling authority, the specific mismatch, the national security or filing consequence, and the correction needed for resubmission.
10. If a source item is absent from the record, note the absence explicitly and explain what further document review is needed rather than assuming completeness.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Track relationships across the transaction stack: definitive agreement, side letters, governance documents, financing documents, operating covenants, and disclosure schedules.
- Track relationships across ownership tiers: parent, intermediate entities, ultimate beneficial owners, and any governmental interests that may be indirect rather than direct.
- Track relationships across time: pre-signing correspondence, signing documents, interim period covenants, and post-signing amendments or supplements.
- Track relationships across function: what a provision says, what document it appears in, what other document modifies it, and what operational or national security risk it creates.
- When a later document narrows, expands, or contradicts an earlier one, treat the later document as part of the same disclosure universe and test the notice against both.

## 6. Output structure conventions

- Produce a categorized issue memorandum in conventional legal memo form, using clear headings for compliance omissions, substantive gaps, and inaccuracies.
- Include a legend for severity using an ordinal scale stated once at the top, and apply that same scale uniformly to every issue.
- For each issue, state:
  - the controlling authority or disclosure rule,
  - the specific omission, inconsistency, or understatement,
  - why it matters for CFIUS review or filing completeness,
  - the consequence if not corrected,
  - the proposed corrective action.
- Tie each issue to the source set with enough specificity that the reader can locate the relevant agreement, schedule, or correspondence.
- Where multiple related defects exist, separate them into distinct issues unless they are inseparable in substance.
- End with a concise Recommended Actions section that assigns each action to the responsible role and a timing anchor tied to the filing or resubmission process.
- Keep the memo categorical and operational; do not narrate the review process or summarize the documents without identifying a defect.
