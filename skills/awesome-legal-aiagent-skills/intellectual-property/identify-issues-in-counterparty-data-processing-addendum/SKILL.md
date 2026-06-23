---
name: identify-issues-counterparty-dpa
task_id: intellectual-property/identify-issues-in-counterparty-data-processing-addendum
description: Reviewing a counterparty data processing addendum against internal playbook guidance and underlying commercial-agreement summary terms to produce a prioritized issue memo with redline recommendations.
activates_for: [planner, solver, checker]
---

# Skill: Identify Issues in Counterparty Data Processing Addendum

## 1. Subject-matter triage
- Use this skill when the task is to review a counterparty DPA, compare it to internal privacy/playbook positions and the underlying commercial terms, and produce an issue memo with redline recommendations.
- If multiple governing documents are provided, treat the DPA, the playbook, and the commercial-summary terms as separate inputs and compare them clause by clause; do not analyze the DPA in isolation.
- If only one DPA is provided, state that the comparison set is incomplete and limit findings to the text actually supplied.

## 2. Failure modes the skill is correcting
- Reviewing the addendum without anchoring it to both the playbook and the commercial-summary terms, which misses conflicts, silent overrides, and inconsistent defined terms.
- Treating privacy/compliance issues as generic contract edits rather than operational and regulatory risk items with different urgency levels.
- Flagging deviations without linking them to the affected processing activity, data flow, or related clause that makes the deviation material.
- Writing issue notes that describe the problem but do not convert it into a usable redline recommendation.
- Failing to distinguish between mandatory privacy terms, negotiable guardrails, and acceptable fallback language.
- Summarizing in the abstract instead of tying each issue to the actual section, interaction, and downstream consequence.
- Using vague priority labels without a consistent severity scale.

## 3. Legal frameworks / domain conventions that apply
- Assess the DPA against the applicable processor/controller framework in the relevant privacy law, including the allocation of roles, processing instructions, confidentiality, security, subprocessors, assistance, breach notice, deletion/return, audits, and transfers.
- Check whether the DPA covers the customary mandatory processing details: nature and purpose of processing, categories of personal data, categories of data subjects, duration, and documented instructions.
- Review subprocessor language for consent architecture, notice-and-objection mechanics, flow-down obligations, and responsibility for acts of subprocessors.
- Review assistance obligations for data-subject requests, security incidents, DPIAs/assessments, and regulator inquiries; the obligation should be operationally usable, not merely aspirational.
- Review security language for specificity, implementation responsibility, and a standard that can be tested against the processing environment.
- Review breach-notification language for prompt notice tied to the controller’s compliance timeline and cooperation obligations.
- Review deletion/return language for timing, format, retained copies, certification, and exceptions required by law.
- Review transfer language for the relevant transfer mechanism and any incorporated standard clauses or equivalent safeguards.
- Review audit language for direct audit rights or a defensible alternative assurance model.
- Use the governing authority identified in the source documents; where the source is silent, rely on the controlling privacy framework ordinarily used for the relevant processing arrangement.

## 4. Analytical scaffolds
1. Identify the document set and the scope of comparison: DPA, playbook guidance, and commercial-summary terms.
2. Enumerate the provisions that must be checked in the DPA, then compare each against the playbook and the commercial-summary terms.
3. For each deviation, determine whether it is a hard conflict, a missing protection, a permissive fallback, or an acceptable market alternative.
4. For each issue, capture the relevant section, the source of the mismatch, the practical risk, and the best correction.
5. Compare each issue against any cross-referenced clause that changes its effect, including incorporated policies, schedules, annexes, or ordering provisions.
6. For breach notice, subprocessor control, deletion/return, transfer, and audit language, test whether the wording functions in practice under the stated workflow and timing.
7. For security and assistance obligations, test specificity, measurable performance, and whether the clause is enforceable without extra negotiation.
8. When the DPA conflicts with the commercial-summary terms, separate those conflicts into their own set of findings before general drafting issues.
9. Convert each finding into redline-ready language, using explicit replacement or insertion text rather than description alone.
10. Prioritize findings by legal risk, operational impact, and likelihood of creating a downstream compliance or transaction problem.

## 5. Vertical / structural / temporal relationships
- Trace each DPA provision against any incorporated schedule, annex, policy, or order-form term that modifies it.
- Identify whether the commercial-summary terms override, supplement, or narrow the DPA; if the relationship is unclear, flag the ambiguity.
- Check whether obligations are triggered at signing, during processing, upon notice, upon request, or at termination, and note any timing mismatch.
- Where the source documents refer to multiple data flows, processing purposes, or jurisdictions, treat each materially different flow as a separate comparison point rather than collapsing them into one analysis pass.
- If a clause relies on another document for a key term, confirm that the referenced document is actually attached, incorporated, and consistent.

## 6. Output structure conventions
- Produce a prioritized issue memo, organized from highest to lowest risk, with a consistent ordinal severity scale defined once at the top.
- Use a conventional issue-memo structure: executive summary, prioritized findings, conflicts with commercial-summary terms, and recommended redlines or fallback edits.
- For each issue, include: the affected section, severity, the mismatch with the playbook or commercial-summary terms, the legal or operational risk, the clause interaction that makes it material, and the recommended redline.
- For each issue, state the practical consequence for the client and the clause or document that creates the interaction.
- Include redline recommendations in a form that can be pasted into drafting, using explicit replacement or insertion text where possible.
- If the source documents identify controlling law or authority, cite it when explaining the issue; do not state a legal conclusion without naming the supporting rule, statute, regulation, or recognized authority.
- End with a Recommended Actions block that assigns each next step to a responsible role and a timing anchor tied to the review or signing process.
- Keep the memo self-contained and readable as a stand-alone issue memorandum for legal and business stakeholders.
