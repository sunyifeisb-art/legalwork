---
name: its-draft-export-license-application
task_id: international-trade-sanctions/draft-export-license-application
description: Produces a BIS export license application narrative and a pre-filing issues memorandum that identifies document deficiencies, transshipment disclosure obligations, missing export filing history, and unauthorized signatories that must be resolved before submission.
activates_for: [planner, solver, checker]
---

# Skill: Draft BIS Export License Application

## 1. Subject-matter triage

- Use this skill when the task is to draft a BIS export license application narrative for a controlled item and separately produce a pre-filing compliance memorandum.
- Treat the memorandum as a screening gate, not a recap: it should identify defects that must be fixed before filing and issues that can be disclosed or explained in the narrative.
- First determine whether the source set contains one shipment/export request or multiple alternative scenarios. If multiple, enumerate each shipment, party, destination, filing history, and control basis before analyzing them one by one.
- If the source set indicates only a single transaction, state that affirmatively and keep the analysis limited to that transaction.

## 2. Failure modes the skill is correcting

- Drafting the narrative before isolating pre-filing deficiencies, which risks submitting an incomplete or misleading application.
- Failing to disclose a known onward transfer, intermediate destination, or re-export plan in the narrative when the facts call for transparency.
- Overlooking mismatches among the purchase order, end-use certificate, consignee details, freight forwarder details, and shipment history.
- Treating an end-use certificate as valid without checking whether the signatory can bind the end user.
- Ignoring a prior export record that lacks the expected filing reference or shipment identifier, which may signal a prior unfiled export issue.
- Omitting a required transaction participant or control basis explanation, leaving the filing incomplete.
- Turning an advisory memorandum into a conclusion-only memo without specific corrective steps, responsible owners, and timing.
- Stating legal conclusions without tying them to the governing export-control authority.

## 3. Legal frameworks / domain conventions that apply

- BIS export licensing practice requires a narrative that accurately describes the item, end use, end user, parties to the transaction, and any facts bearing on licensing review.
- Export-control false-statement and omission risk is triggered when a filing leaves out material facts known to the applicant; the narrative should be complete and candid.
- If the source documents identify a transshipment, onward movement, or future third-country destination, disclose it plainly in the narrative and frame any requested license around the disclosed facts.
- If the purchase order and end-use certificate do not align on quantity, party identity, or transaction terms, resolve the inconsistency before filing or explain the corrected record in the memo.
- An end-use certificate is only as good as the authority of its signer; a certificate signed by someone without authority to bind the recipient should be treated as defective until re-executed.
- Freight forwarder and other transaction participants should be identified with enough specificity to match the source record and avoid an incomplete filing.
- A prior export that lacks an export filing reference or shipment tracking reference should be flagged as a possible compliance issue and evaluated for corrective action.
- The narrative should address each applicable reason for control for the controlled item and explain why the proposed export is consistent with U.S. export policy under those reasons.
- If the compliance screening materials identify denied-party, sanctions, or destination concerns, integrate those facts into the memo and, where appropriate, the narrative.
- Cite the governing authority for each legal proposition relied on, using the statute, regulation, or other authority as identified in the source materials or as generally recognized in export-control practice.

## 4. Analytical scaffolds

1. Build a source-document inventory first: item description, control basis, consignee, end user, end use, destination, freight forwarder, purchase order, end-use certificate, shipment history, screening results, and any correspondence about onward movement.
2. Classify each issue as Critical, High, Medium, or Low, using the same scale throughout the memo.
3. For each issue, state the factual trigger, the governing authority or control concept, the practical impact on the filing, and the corrective step.
4. For each issue, tie the defect to the relevant source document(s) that interact with it, such as the PO, end-use certificate, screening memo, or prior shipment record.
5. Where a transshipment or onward destination is disclosed, decide whether it belongs in the memo as a filing risk and in the narrative as an affirmative disclosure.
6. Compare the transaction documents for consistency on quantity, identities, authority, and routing before drafting any narrative language.
7. For the control-basis section, map each reason for control to a short, factual explanation showing why the export request is supportable under the stated facts.
8. If prior export history is incomplete, flag the gap, describe the compliance concern, and note whether a voluntary disclosure or internal investigation should be considered before filing.
9. End the memo with concrete corrective actions assigned to a role and tied to filing timing.

## 5. Vertical / structural / temporal relationships

- Distinguish between pre-filing defects that must be cured before submission and narrative facts that can be disclosed without blocking filing.
- Distinguish among exporter, consignee, end user, freight forwarder, and any intermediary or onward destination; do not collapse them into a single party label.
- Track whether the source documents describe a current transaction, a prior shipment, or a contemplated future re-export, because the compliance significance differs by timing.
- If the facts show a chain of documents, use the controlling document hierarchy to resolve conflicts: the most specific transaction document, the end-use certificate, then the shipment and screening records.
- When the analysis turns on authority to sign or bind, identify who signed, for whom, and under what corporate or agency authority.
- When multiple destinations or route points appear, separate the export destination from any later transfer destination and disclose both only as supported by the record.

## 6. Output structure conventions

- Produce two deliverables: a compliance issues memorandum and a draft application narrative.
- In the issues memorandum, open with the severity scale and then list each issue separately with:
  - severity
  - issue title
  - source facts
  - governing authority or export-control concept
  - impact on filing
  - required remediation
  - responsible role
  - timing anchor
- Make each issue self-contained and complete; do not leave an issue at the level of description alone.
- For every issue, include the specific source-document cross-reference that creates or resolves the problem.
- The memorandum should end with a concise Recommended Actions block that assigns next steps to the business owner, trade compliance, or counsel and ties them to the filing milestone.
- In the draft narrative, use plain, filing-ready prose that accurately describes the item, end use, parties, destination, routing facts, and any disclosed onward movement.
- In the narrative, expressly address each applicable reason for control and explain the compliance posture in neutral, non-argumentative language.
- Do not omit a known transshipment or routing fact; if disclosure is needed, present it clearly and consistently with the memo.
- Keep the narrative aligned to the source record; do not introduce facts not supported by the documents.
- Before finalizing, verify that both deliverables are complete, internally consistent, and contain operative content rather than placeholders or summaries.
