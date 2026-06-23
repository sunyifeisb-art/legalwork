---
name: draft-regulatory-compliance-memo-holding-company
task_id: insurance/draft-regulatory-compliance-memorandum
description: Agents drafting a regulatory compliance memorandum for an insurance holding company system analyze affiliated transactions in isolation as well as in combination, identify filing and approval issues across all potentially affected jurisdictions, verify any internal compliance conclusions against the underlying calculations, and assess premium-to-surplus and related capital adequacy concerns.
activates_for: [planner, solver, checker]
---

# Skill: Draft Regulatory Compliance Memorandum — Insurance Holding Company System Act Compliance

## 1. Subject-matter triage

- Treat the task as a privileged, regulatory compliance memorandum, not a transaction summary.
- Separate the Q4 affiliated-transaction universe into distinct transaction types, then evaluate each insurer and each relevant jurisdiction on its own terms before drawing system-level conclusions.
- If the source set contains more than one affiliated transaction, affiliate, insurer, domicile, or filing path, enumerate them up front and analyze each item once; do not collapse multiple entities or periods into a single representative pass.
- Distinguish:
  - filing triggers from prior-approval triggers,
  - insurer-level analysis from holding-company-level analysis,
  - domicile filing obligations from non-domiciliary notice obligations,
  - technical compliance from remediation risk.

## 2. Failure modes the skill is correcting

- Internal compliance conclusions are accepted without verifying the underlying materiality calculations; errors in those calculations can lead to incorrect conclusions about filing or approval requirements.
- The analysis addresses only one filing path for each transaction without identifying additional jurisdictions where affiliated transactions may trigger independent obligations.
- Multiple affiliated transactions are analyzed in isolation when their combined effect may change materiality, capital, or supervisory attention.
- Premium-to-surplus considerations are omitted, leaving unaddressed a recurring capital adequacy issue for property/casualty groups.
- The memo identifies defects but does not state the downstream regulatory consequence of each defect.
- The memo names issues without grading severity, making remediation sequencing unclear.
- Recommendations are vague, untethered to responsible roles, or missing a timing anchor.
- Legal conclusions are stated without naming the controlling Insurance Holding Company System Act concept, state-law rule, or other authority that supports them.

## 3. Legal frameworks / domain conventions that apply

- Insurance holding company system regime: affiliated transactions may require advance notice, filing, or prior approval depending on transaction type, amount, and jurisdiction-specific thresholds.
- Materiality analysis: compare each transaction against the applicable statutory or regulatory base for each affected insurer; confirm the denominator and measurement period before concluding that a filing is or is not required.
- Services arrangements: evaluate annual consideration and related payments against the relevant threshold for each insurer and each jurisdiction; missed filings should be treated as remediation items, not as harmless technicalities.
- Dividends and distributions: classify the payment under the ordinary-dividend / extraordinary-dividend framework using the governing state statute or regulation; misclassification can convert a permitted payment into a prior-approval issue.
- Capital contributions and capital support: test any upstream or downstream contribution against the receiving insurer’s surplus and any state-specific filing trigger.
- Pooling or intercompany arrangement amendments: confirm whether each participating insurer’s domicile requires a separate filing or notice; parent-level submission does not necessarily satisfy all jurisdictions.
- Disclosure forms and annual statements: review completeness, consistency, and conflict disclosures against the underlying transaction documents and board materials.
- Premium-to-surplus oversight: compare net written premium to policyholders’ surplus for each insurer using the applicable supervisory convention; highlight concentrations that may invite scrutiny even if no explicit threshold is crossed.
- Exam findings and corrective action plans: track each examiner directive, submission deadline, implementation milestone, and completion status.
- Deemed-approval mechanics: where a statute or regulation provides a silent-approval period, track the filing date and response window precisely before stating that approval is effective.
- Privilege and work-product conventions: frame the memo as counsel-directed compliance analysis and avoid unnecessary factual recitation beyond what is needed to support the legal assessment.

## 4. Analytical scaffolds

1. Build a transaction inventory for all Q4 2024 affiliated transactions, grouped by type, counterparty, insurer, amount base, and implicated jurisdiction.
2. For each transaction, identify the governing rule, the relevant threshold or trigger, the measurement base, and whether the source documents support the internal compliance conclusion.
3. For each issue, close the analysis by:
   - stating the relevant scale or threshold drawn from the documents,
   - cross-referencing the other source document, schedule, board action, or filing that interacts with it,
   - stating the concrete downstream consequence for the client if the point is not cured.
4. Services or shared-services arrangements:
   - test each insurer separately,
   - check whether annualized consideration or equivalent value crosses the filing trigger,
   - identify every jurisdiction with a distinct filing or notice path,
   - recommend retroactive filing, amendment, or supplement if a filing was omitted or incomplete.
5. Dividends or distributions:
   - verify the classification under the governing state framework,
   - compare the payment against the ordinary-dividend standard,
   - flag any approval defect, disclosure defect, or mismatch between board approval and regulatory treatment.
6. Capital contributions and upstream support:
   - test the contribution against the receiving insurer’s surplus,
   - determine whether the contribution itself creates a filing or notice obligation,
   - flag any capital adequacy concern if the contribution appears to be relied on as a substitute for surplus.
7. Pooling, reinsurance, or other interaffiliate structural amendments:
   - identify all participating insurers and their domiciles,
   - check whether each domicile has its own filing path,
   - note any omission as a distinct regulatory exposure.
8. Disclosure and filing-document review:
   - compare the filing form, attachments, and supporting schedules to the operative transaction documents,
   - identify omitted conflicts, inconsistent dates, misnamed entities, or unsupported narrative statements,
   - recommend corrected or supplemental filings where needed.
9. Premium-to-surplus review:
   - compute the ratio insurer by insurer using the source data,
   - compare each result to the applicable supervisory benchmark or management policy,
   - flag concentrations, trends, or outliers that may draw examination attention.
10. Exam-corrective-action review:
   - list each exam directive and deadline,
   - assess completion status and evidence of completion,
   - identify items at risk and the compliance consequence of delay.
11. If the internal memo reaches a conclusion that appears unsupported, re-run the calculation from the source figures before accepting it.
12. End with specific remedial steps tied to a person or role and to a filing, board, or regulatory milestone.

## 5. Vertical / structural / temporal relationships

- Organize the memo by transaction type, then by insurer, then by jurisdiction.
- Where a single transaction implicates multiple entities or states, present the vertical relationship explicitly: parent, affiliate, downstream insurer, and each affected domicile or notice jurisdiction.
- Where the same conduct spans multiple dates, separate:
  - authorization date,
  - execution date,
  - filing date,
  - effective date,
  - review or response deadline.
- If the source set contains an internal compliance memo, compare its conclusion against the supporting documents line by line before relying on it.
- If the source set includes both system-level and entity-level data, reconcile them only after the entity-level analysis is complete.
- Do not assume one jurisdiction’s treatment carries over to another; state-law variations control the filing and approval analysis.

## 6. Output structure conventions

- Write the deliverable as a privileged regulatory compliance memorandum.
- Use a conventional legal memo structure:
  - issue summary,
  - factual/transaction background,
  - analysis by transaction type,
  - jurisdiction-by-jurisdiction filing matrix,
  - internal memo verification or error-correction section,
  - remediation and action plan,
  - conclusion.
- Include an explicit severity label for each identified issue using a consistent ordinal scale defined once near the top of the memo.
- For each issue entry, state the governing authority by name and section or rule where available.
- For each issue entry, include:
  - the threshold or scale at issue,
  - the interacting document or provision,
  - the consequence if uncorrected,
  - the recommended remediation.
- End with a Recommended Actions section that lists each action in imperative form, identifies the responsible role, and ties the timing to a filing deadline, board meeting, regulatory response window, or other concrete milestone.
- If the task requires a matrix, make it compact but complete, with each row tied to one transaction-jurisdiction pairing rather than a generalized narrative.
- Avoid bare conclusions; every conclusion should be anchored to the governing rule, the source facts, and the practical consequence.
