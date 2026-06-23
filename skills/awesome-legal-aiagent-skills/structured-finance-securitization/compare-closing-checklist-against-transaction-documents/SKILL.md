---
name: compare-closing-checklist-against-transaction-documents
task_id: structured-finance-securitization/compare-closing-checklist-against-transaction-documents
description: Comparing a closing checklist against executed transaction documents where filing jurisdiction, missing parties in account control agreements, absent market-standard deliverables, and document title discrepancies each require independent legal assessment from the depositor's perspective.
activates_for: [planner, solver, checker]
---

# Skill: Compare Closing Checklist Against Transaction Documents — Discrepancy Report for Auto Loan Securitization

## 1. Subject-matter triage
- Use this skill when the assignment is to compare a closing checklist against executed transaction documents and report mismatches, omissions, or document-control issues from the depositor’s perspective.
- Treat the checklist as a control document, not as the source of legal sufficiency; the operative documents govern.
- Separate true legal defects from clerical inconsistencies, but do not minimize structural defects as housekeeping items.
- If the source set includes multiple tranches, collateral pools, filing packages, or closing dates, identify them explicitly before analysis and run the comparison separately for each.

## 2. Failure modes the skill is correcting
- Treating filing location as a clerical detail instead of testing whether the filing satisfies the applicable perfection regime.
- Checking only incorrect descriptions on listed items while overlooking required deliverables that are absent entirely.
- Collapsing all discrepancies into one severity bucket instead of ranking by legal invalidity, perfection risk, execution risk, and administrative consequence.
- Missing market-standard closing deliverables that are expected in a securitization even if not named in a single checklist line.
- Ignoring title, party-name, signature-block, or date mismatches that create ambiguity about what was actually delivered.
- Failing to connect a discrepancy to the downstream effect on closing, perfection, enforceability, servicing, or note issuance.
- Describing an issue without tying it to the controlling rule or practice authority that makes the issue material.

## 3. Legal frameworks / domain conventions that apply
- Apply the relevant secured-transactions filing rules to test whether a filing perfects the intended interest in the identified collateral; a filing in the wrong jurisdiction can leave the interest vulnerable or unperfected under UCC Article 9, including the debtor-location and filing-place rules in UCC §§ 9-301 through 9-307.
- For account control arrangements, verify that the account bank is bound to follow instructions from every party the agreement requires; omission of a required party can defeat control under UCC § 9-104 or comparable deposit-account control rules.
- For deliverables tied to closing or conditions precedent, compare the operative date, execution date, and closing date for internal consistency and compliance with the conditions stated in the deal documents.
- For publicly offered securitizations, confirm whether market practice or the transaction documents require a negative assurance letter, closing certificate, or similar opinion-supporting deliverable, and test the checklist against that requirement.
- Document titles, defined-term references, and exhibit labels matter: a title mismatch may be harmless if the substance is unmistakable, but it can also create ambiguity in enforcement, opinions, or closing certification.
- Backup servicing and similar structural protections may be required by the operative documents even when the checklist treats them as optional or omits them from a standalone line item.
- Where the source documents identify the governing rule, follow that authority as written; where they do not, rely on the generally accepted securitization and secured-transactions convention for the issue.
- State the governing authority for each legal proposition you rely on; do not state perfection, control, or enforceability conclusions without naming the rule or practice source supporting them.

## 4. Analytical scaffolds
1. Build the comparison inventory first: list every checklist item, every executed document, and every structurally required deliverable that the deal documents or market practice indicate should exist.
2. For each checklist line item, compare the checklist description, title, party names, dates, and stated purpose against the executed document.
3. For each discrepancy, determine whether it is:
   - a mismatch in description, title, party identity, date, or signature mechanics;
   - a missing required document;
   - a filing or perfection defect;
   - a control-arrangement defect;
   - or a market-standard deliverable omission.
4. For every filing or perfection document, identify the relevant debtor/collateral nexus, the filing jurisdiction required by the governing rule, and whether the checklist points to the correct filing.
5. For every control agreement, confirm that all parties whose instructions must be honored are included and that the control language matches the intended account-control function.
6. For every dated deliverable, test the date against closing mechanics, conditions precedent, and any timing covenant in the operative documents.
7. For every omitted deliverable, decide whether the omission is a true structural gap, a closing-condition gap, or a noncritical administrative omission.
8. Assign severity using a uniform ordinal scale defined once at the top of the report; reserve the highest severity for issues that create legal invalidity, perfection failure, or closing-blocking risk.
9. For each issue, explain the source-document basis, the governing rule or convention, and the client consequence in one compact analytical chain.
10. When more than one issue exists, keep each issue discrete; do not combine separate legal theories into a single entry.

## 5. Vertical / structural / temporal relationships
- A perfection failure in a filing that supports transfer to the trust can compromise the trust’s ability to hold the receivables free of competing claims.
- A defect in an account control arrangement can impair collection mechanics even if the underlying transfer is otherwise valid.
- An omitted backup servicing deliverable may create a condition-precedent failure or leave the structure without a required servicing fallback.
- A date mismatch can matter even when the document was signed, because closing deliverables often depend on same-day or pre-closing timing.
- Title mismatches are more serious when the title is used in opinions, bring-downs, or officer certificates; a harmless shorthand in one context may be a material ambiguity in another.

## 6. Output structure conventions
- Produce a numbered discrepancy report with a severity field for every entry using one ordinal scale defined at the start.
- Open with a short legend defining the severity scale and how it should be applied.
- For each entry, include: the checklist reference, the executed-document reference, the discrepancy description, the governing authority or practice basis, the legal or operational consequence, and the recommended corrective action.
- Keep the perspective anchored to the depositor: emphasize impacts on closing deliverability, perfection, enforceability, transfer mechanics, and deal administration.
- Include a final Recommended Actions block that groups immediate fix items, items requiring document revision, and items requiring confirmation or counsel sign-off.
- Phrase recommendations as operative steps, not summaries; identify the responsible deal role where the source materials make it clear.
- If a discrepancy is not legally material, say so explicitly and explain why it remains worth tracking or correcting.
