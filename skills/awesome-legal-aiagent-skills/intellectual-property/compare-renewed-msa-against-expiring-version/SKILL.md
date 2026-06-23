---
name: compare-renewed-msa-expiring-version
task_id: intellectual-property/compare-renewed-msa-against-expiring-version
description: Comprehensive deviation report comparing a renewed MSA against the expiring version and the applicable contract playbook, with analysis informed by internal correspondence.
activates_for: [planner, solver, checker]
---

# Skill: Compare Renewed MSA Against Expiring Version

## 1. Subject-matter triage
- Confirm the source set includes the expiring MSA, the renewed MSA, the current contract playbook, and the referenced emails before analyzing deviations.
- Treat the renewed draft as the operative text for renewal-period risk, but compare it against both the expiring agreement and the playbook to separate inherited terms from negotiated changes.
- If only one draft version is present, stop and identify the missing comparison source rather than inferring changes.

## 2. Failure modes the skill is correcting
- Treating renewal as a mechanical carry-forward instead of comparing every changed provision against the prior form and current playbook.
- Evaluating commercial terms in isolation from legal allocation terms that materially change the overall risk package.
- Missing business positions reflected in internal emails that should be traced into the renewed draft.
- Assuming the original playbook remains controlling without checking whether the current playbook position has shifted since execution.
- Describing differences without converting them into risk, impact, and recommended action.
- Collapsing multiple distinct deviations into one blended observation.
- Stating a conclusion about compliance with the playbook without identifying the governing playbook position or contract clause supporting it.

## 3. Legal frameworks / domain conventions that apply
- A renewal MSA should be read as the operative agreement for the renewal term, with amended provisions superseding inconsistent expiring terms unless the renewal expressly preserves the prior language.
- Commercial economics, service levels, indemnities, liability allocation, confidentiality, data use, audit rights, suspension rights, and termination mechanics are typically interdependent and should be assessed together where they shift the deal balance.
- Internal correspondence can evidence the business team’s renewal priorities, fallback positions, or accepted tradeoffs; unresolved gaps between those emails and the draft warrant reporting.
- Playbook review is a deviation exercise, not a generic fairness review: the question is whether the renewed draft departs from the current house position, and if so whether the deviation is acceptable.
- Materiality should be tied to the actual contract terms in the source set, not abstract severity labels alone.

## 4. Analytical scaffolds
- Version-by-version comparison: identify each substantive change in the renewed MSA relative to the expiring MSA, including additions, deletions, substitutions, and moved language.
- Playbook alignment check: for each change, identify the applicable playbook position and assess whether the renewed language conforms, narrows, expands, or omits it.
- Email cross-reference: identify any business ask, concession, or open issue discussed in the referenced emails and test whether the draft reflects it.
- Issue-closing analysis: for every deviation, state the scale or practical magnitude using the contract facts available, tie it to the interacting clause or related document, and explain the downstream consequence for the client.
- Unified commercial/legal read: evaluate pricing, service levels, remedies, liability, termination, and operational rights as one negotiated package rather than independent edits.
- Risk classification: assign each deviation an ordinal severity label and keep the scale consistent across the report, with a one-line rationale for the label.
- If multiple business units, time periods, service scopes, or counterparties are implicated in the source set, enumerate them first and analyze each separately rather than using a single representative example.

## 5. Vertical / structural / temporal relationships
- Track whether a change in one clause depends on, overrides, or is softened by another clause in the same draft.
- Flag whether the renewal introduces a new term, extends an existing term, or silently drops a protection that existed in the expiring MSA.
- Distinguish present renewal obligations from legacy obligations that survive or continue from the expiring agreement.
- Note whether a business concession in email correspondence appears intended for the renewal term but was not captured in the draft.
- Where the draft references playbook concepts through defined terms or fallback language, map those references to the actual operative clause and check for internal consistency.

## 6. Output structure conventions
- Produce a deviation report in conventional memo form, not as a bare issue list.
- Begin with a short executive summary that states the overall risk profile and the main categories of deviation.
- Include a defined severity scale once near the top, then use that same scale for every issue.
- Present the core analysis in a table with columns for: provision or topic, expiring MSA position, renewed MSA position, playbook position, email alignment, severity, and analysis.
- For each row, keep the analysis concise but complete: identify the deviation, explain why it matters, and state the practical consequence.
- End with a Recommendations section that gives imperative actions, assigns each to the relevant role, and anchors timing to the renewal workflow or other source-based milestone.
- Use file-appropriate professional drafting conventions for the requested `msa-deviation-report.docx`; do not rely on stylistic markup alone to communicate the issue set.
