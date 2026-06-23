---
name: triage-counterparty-redlines-company-msa-template
task_id: intellectual-property/triage-counterparty-redlines-to-company-msa-template
description: Triaging a counterparty's redlined MSA against the company's standard template and playbook, incorporating deal context and insurance details, to produce a prioritized deviations report.
activates_for: [planner, solver, checker]
---

# Skill: Triage Counterparty Redlines to Company MSA Template

## 1. Subject-matter triage

- This is a comparison-and-issue-spotting task, not a pure drafting task.
- Treat the clean company template as the baseline, the counterparty redline as the deviation set, and the playbook plus deal context as the decision rules.
- If only one version of the agreement is available, stop and identify the missing comparison source before assessing risk.
- If multiple documents govern the same term, first list the governing documents and resolve which source controls the review order.

## 2. Failure modes the skill is correcting

- Reviewing a redline only as marked changes and missing silent deletions, reordered provisions, or unmarked structural edits.
- Failing to compare the redline against the clean template and playbook together, which causes misclassification of deviations.
- Overlooking deal-specific pre-agreed terms in the summary or term sheet and treating their absence as acceptable.
- Ignoring insurance schedules, certificates, or coverage summaries when the redline changes insurance obligations.
- Treating liability-cap or indemnity edits as generic rather than calibrating them to the engagement’s risk profile.
- Summarizing issues without a clear severity ranking, recommendation, or reasoned response position.
- Collapsing distinct deviations into one blended comment, which hides negotiation priorities.
- Describing a deviation without tying it to the relevant MSA section and the affected fallback or acceptable position in the playbook.

## 3. Legal frameworks / domain conventions that apply

- The company template is the baseline form; deviations are measured against the playbook’s preferred position and any stated fallback.
- Classify each deviation as within bounds, negotiable, or outside tolerance, using the playbook’s language and decision logic.
- Silent changes matter as much as tracked changes; deletions, swaps, and section moves can change risk even when no markup is visible.
- Deal context can override the default playbook if the summary identifies a pre-approved term, but any such override should be confirmed against the redlined draft.
- Insurance edits must be reviewed against the actual coverage documentation and any stated insurance requirements; if the edited requirement is not aligned with the source coverage record, flag it for review.
- Liability limitations, indemnities, and related risk allocations should be assessed by reference to the exposure profile created by the transaction, including operational, IP, and third-party claim risk.
- Use ordinary MSA triage conventions: retain the company baseline where possible, accept only changes already allowed by the playbook, and escalate anything that shifts substantive risk, remedies, or coverage obligations.
- When the source documents provide a governing standard, cite it by name in the issue entry rather than using conclusory labels alone.

## 4. Analytical scaffolds

1. Establish the review set: clean template, counterparty redline, playbook, deal summary, and any insurance materials.
2. Enumerate the issue universe before analysis:
   - all tracked edits,
   - all silent deletions or structural changes,
   - all pre-agreed terms,
   - all insurance-related provisions,
   - all liability and indemnity edits,
   - any other clause flagged by the playbook.
3. For each item, compare the redline to the template and the playbook position, then determine whether the change is acceptable, negotiable, or unacceptable.
4. For each issue, identify:
   - the exact MSA section or schedule,
   - what changed from the template,
   - the controlling playbook position or deal-context instruction,
   - the risk introduced by the change,
   - the recommended company response.
5. Where the redline narrows insurance obligations, check the requirement against the available coverage evidence and flag mismatches or unsupported assumptions.
6. Where the redline changes liability cap, exclusions, indemnity scope, termination rights, service levels, or similar risk allocators, assess whether the change materially alters the company’s downside or leverage.
7. Preserve a strict priority order in the report: outside-tolerance items first, then negotiable items, then acceptable confirmations.
8. Do not stop at description; each issue entry should end with a severity label, the governing source, and the operational or transactional consequence.

## 5. Vertical / structural / temporal relationships

- Compare terms at three levels: clause text, defined terms, and schedule or exhibit language.
- Check whether a change in one clause silently breaks a cross-reference elsewhere.
- Check whether a deletion in the body is replicated, contradicted, or left hanging in an exhibit, attachment, or insurance schedule.
- If a term is stated as pre-agreed, verify both its inclusion and its placement; a term buried in a different section may still be functionally acceptable, but should be noted.
- If the redline changes a timing concept, such as notice, cure, renewal, trailing coverage, or survival, assess the downstream effect on enforcement and claim handling.

## 6. Output structure conventions

- Produce a prioritized deviation report, organized by severity and then by issue type.
- Use an explicit ordinal severity scale at the top of the report and apply it uniformly to every entry.
- For each entry, include:
  - MSA section or exhibit
  - template baseline
  - counterparty change
  - playbook classification
  - severity
  - risk or consequence
  - recommended response
- Separate silent changes from affirmative edits so deletions and structural shifts are not lost.
- Include a distinct section for pre-agreed terms that are missing, altered, or misplaced.
- Include a distinct section for insurance-related deviations and note any mismatch with the supplied coverage materials.
- Keep the language action-oriented and concise; every entry should be ready for negotiation or escalation.
- End with a short recommended-actions section that assigns next-step ownership and urgency.
- If the primary deliverable is a document file, ensure the report is written as the operative artifact, not merely described, and confirm that the file exists and is non-empty before concluding.
