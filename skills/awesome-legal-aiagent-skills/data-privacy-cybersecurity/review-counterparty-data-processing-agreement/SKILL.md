---
name: review-counterparty-data-processing-agreement
task_id: data-privacy-cybersecurity/review-counterparty-data-processing-agreement
description: Counterparty DPA issue identification memos fail when the agent does not use the internal data protection playbook as the primary benchmark and does not reconcile the executed MSA's scope and liability provisions against the DPA's terms before producing an issue-focused memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Review Counterparty Data Processing Agreement — Issue Identification Memorandum

## 2. Failure modes the skill is correcting

- Reviewing the DPA only against generic privacy law instead of the internal playbook, which causes the memo to miss policy-mandated standards that may be stricter than baseline law.
- Failing to reconcile the DPA with the executed MSA, especially where scope, liability, indemnity, governing law, or risk allocation differ across the two documents.
- Treating privacy-team concerns as background commentary rather than as issue candidates that must be confirmed or rejected against the contract text.
- Reading the security summary as a checklist item rather than as evidence of what the counterparty’s actual posture can support.
- Stopping at issue description without stating severity, the applicable benchmark, the contractual cross-reference, and the practical consequence.
- Producing a generic memo that does not end with concrete negotiating actions assigned to the right internal owner.

## 3. Legal frameworks / domain conventions that apply

- Use the internal data protection playbook as the primary benchmark, then layer in baseline DPA requirements and any applicable privacy/security law. Distinguish mandatory legal gaps from policy-only gaps.
- Check the DPA for the core controller/processor architecture: roles, permitted processing, instructions, confidentiality, sub-processor controls, assistance, security, breach notice, deletion/return, audit, transfer, and data subject support.
- Reconcile the DPA against the executed MSA for scope alignment and for any conflict in liability, indemnification, remedies, limitation language, or precedence mechanics.
- Use the security summary as factual support for whether the counterparty’s commitments are realistic, complete, and consistent with its stated controls.
- Treat sub-processor approval, notice, and objection mechanics as a standard pressure point; general permission without meaningful change notice or control is a common issue.
- When the source documents identify governing authority, incorporate it by name and section. When they do not, rely on the controlling privacy and security authorities ordinarily used for DPAs in the relevant jurisdiction.
- Keep the memorandum issue-focused: this is not a full markup, a legal opinion letter, or a deal recap.

## 4. Analytical scaffolds

- Start by reading the playbook and mapping each requirement to one of three bins: mandatory, preferred, or topic-specific escalation.
- Read the executed MSA next and extract the provisions that can interact with the DPA, especially scope, liability, indemnity, audit, precedence, and term/termination mechanics.
- Review the privacy-team concerns as a candidate issue list; confirm each one, reject it with a short reason, or restate it more precisely if the document supports a narrower version.
- Review the security summary as evidence of actual posture; flag any DPA commitment that is broader than the counterparty’s described controls or narrower than the playbook expects.
- For each issue, record: the DPA clause or section, the gap category, the governing standard, severity, the interacting document or clause, the practical consequence, and the recommended position.
- If the DPA raises multiple categories of issues, organize them by document section rather than by theme only, so the reader can see where each problem sits in the paper.
- If a topic appears in only one source document, say so expressly; do not imply a conflict where none exists.
- Use the source documents’ own terminology where possible, but do not quote internal language verbatim unless necessary to identify the clause.

## 5. Vertical / structural / temporal relationships (only if applicable)

- Where the DPA and MSA both address the same subject, identify which document should control and whether the DPA is silent, inconsistent, or more protective than the MSA.
- Where an issue depends on future conduct, identify the operative trigger, notice period, objection window, cure period, or deletion timeline, rather than describing the obligation abstractly.
- Where the security summary and DPA diverge, tie the mismatch to the practical effect on actual implementation, not just contract language.
- Where a privacy concern depends on a missing definition or cross-reference, follow the chain through the defined term, related schedule, and any incorporated policy.
- Where the source materials contain multiple processors, subprocessors, business units, or services, analyze each separately if the documents treat them differently; do not collapse distinct relationships into one pass.
- Where the playbook tiers requirements, label the issue by tier so the memo shows whether the fix is mandatory or a negotiation preference.

## 6. Output structure conventions

- Issue memorandum in conventional legal format: short executive summary, issue table or issue list, then brief analysis under document sections.
- Define severity once using an ordinal scale such as Critical / High / Medium / Low, and apply it consistently to every issue.
- For each issue, include: section reference, concise issue statement, severity, governing standard, cross-reference to the interacting document or clause, and recommended fix or negotiation position.
- Each issue should close with the real-world consequence of leaving it unresolved, framed as operational, regulatory, commercial, or litigation risk.
- Include a short summary of which concerns were confirmed, partially confirmed, or rejected from the privacy-team note.
- Include a brief overall negotiating posture at the top: e.g. must-fix, should-fix, or acceptable with reservations, based on the combined playbook/MSA/security review.
- End with a Recommended Actions section that assigns each next step to an internal role and ties it to a practical timing anchor drawn from the transaction or review process.
- Use the filename exactly as instructed for the memo deliverable.
