---
name: review-privilege-log-clawback-review
task_id: litigation-dispute-resolution/review-privilege-log-clawback-review
description: Assessing an opposing party's privilege log for defensibility requires reviewing each log entry against the applicable privilege standards and cross-referencing sample documents to identify log entries with insufficient descriptions, unsupported privilege claims, or documents that appear to have been improperly withheld, producing both a deficiency memo and a clawback candidate list.
activates_for: [planner, solver, checker]
---

# Skill: Privilege Log Review and Clawback Analysis — Deficiency Memo and Clawback Candidate List

## 1. Subject-matter triage

- Treat the privilege log, sample documents, engagement materials, common-interest materials, and expert disclosures as separate source sets, then reconcile them before drawing any conclusion.
- Read the full log first to identify the asserted privilege types, recurring custodians, date ranges, and any systemic description problems.
- Enumerate the distinct document groups, privilege theories, and claimant relationships before analysis so each entry is tested against the correct standard.
- If the record shows only one relevant relationship, doctrine, or expert category, state that expressly and analyze it as a single scope issue.

## 2. Failure modes the skill is correcting

- Reviewing log entries in isolation, without cross-referencing the sample documents that reveal whether the logged description matches the actual content.
- Treating generic document descriptions as enough when they do not let the requesting party and court assess the claim.
- Assuming attorney-client protection from the presence of a businessperson, consultant, or other non-lawyer without showing a legal advice communication involving counsel.
- Treating ordinary-course materials as work product merely because litigation later existed or the document was later used in the dispute.
- Accepting common-interest assertions without confirming the written agreement, covered parties, subject matter, and time period.
- Misclassifying expert materials by ignoring whether the expert is testifying or consulting and whether the communication falls within the applicable expert-discovery rules.
- Collapsing form defects and substance defects into one bucket, which obscures the remedy and the clawback posture.
- Issuing conclusions without tying them to controlling privilege, work-product, common-interest, or expert-discovery authority.

## 3. Legal frameworks / domain conventions that apply

- A privilege log entry must contain enough information to permit assessment of the claim without disclosing the privileged substance; vague labels, boilerplate descriptions, and unexplained privilege codes are ordinarily deficient.
- Attorney-client privilege generally requires a communication, counsel participation or the provision of legal advice, and an expectation of confidentiality; purely business communications do not satisfy the doctrine.
- Work-product protection generally requires preparation because of litigation or anticipated litigation, not merely relevance to a dispute.
- Common-interest protection extends existing privilege only where the record supports a shared legal interest and a matching agreement or equivalent proof of coordinated legal strategy.
- Expert-discovery rules distinguish consulting from testifying experts and often limit the confidentiality of attorney-expert communications, draft reports, and related materials depending on the governing rule set.
- A materially deficient log can support waiver arguments or targeted production requests, but the remedy depends on the type and extent of the defect.
- Use the controlling authority supplied in the record if present; otherwise anchor each legal proposition in the applicable privilege, work-product, common-interest, or expert-discovery rule and the relevant procedural standard governing log sufficiency.

## 4. Analytical scaffolds

- For each source set, identify the governing privilege theory before comparing entries to documents.
- For each log entry:
  - compare the stated description to the sample document, if one exists;
  - test whether the description supports the asserted privilege on its face;
  - test whether the actual document, if reviewed, fits the asserted privilege theory;
  - classify the entry as adequately supported, form-deficient, substance-deficient, or a clawback candidate.
- When common-interest is asserted, verify the written agreement or equivalent proof, then check whether the parties, subject matter, and timeframe actually match the logged communication.
- When expert material is involved, separate testifying-expert materials from consulting-expert materials and apply the correct disclosure and protection rules to each.
- For entries that appear withheld improperly, identify the feature that creates the problem, the document reference that shows it, and the practical consequence for production or clawback.
- When the record contains multiple relevant documents or periods, analyze each item separately rather than using a representative sample.

## 5. Vertical / structural / temporal relationships

- Track the chronology of the attorney-client relationship, litigation anticipation, common-interest arrangement, and expert engagement, because privilege support often turns on timing.
- Compare document date, sender, recipient, and role of each participant against the asserted privilege theory.
- If a communication predates the relevant engagement, agreement, or litigation posture, flag the timing mismatch explicitly.
- If later materials rely on earlier protected communications, distinguish the derivative issue from the underlying privilege claim.
- Where multiple custodians or business units appear, note whether the log groups them properly or masks distinct privilege questions.

## 6. Output structure conventions

- Deficiency analysis memo:
  - open with a short methodology section describing the source sets reviewed and the privilege standards applied;
  - then organize the body by deficiency type, not by document alone;
  - include separate treatment for form defects, substantive defects, common-interest issues, expert-document issues, and waiver/clawback risks;
  - for each issue, identify the log entry reference, the sample document reference if available, the governing authority, and the consequence for the claim.
- Each issue entry should include:
  - a severity label using one consistent ordinal scale defined once at the top;
  - the precise log reference;
  - the privilege theory asserted;
  - the defect identified;
  - the effect on defensibility or production risk;
  - the recommended next step.
- Clawback candidate list:
  - one row per candidate;
  - include log-entry reference, sample-document reference if applicable, asserted privilege, issue type, severity, and recommended action;
  - keep rows separate for distinct documents, even if the same defect recurs.
- End the memo with a concise Recommended Actions block that assigns each action to a responsible role and ties it to the next procedural milestone or response deadline reflected in the record.
- Use the exact filenames required by the task instructions for the two deliverables.
