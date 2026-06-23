---
name: analyze-counterparty-markup-of-cross
task_id: data-privacy-cybersecurity/analyze-counterparty-markup-of-cross
description: Redlining analysis loses discipline when the agent skips playbook hierarchy and fails to anchor each deviation to the governing transfer mechanism and transfer impact findings.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Cross-Border Data Transfer Agreement — Deviation Report

## 1. Subject-matter triage

- Confirm the review is limited to the counterparty markup, the original draft, the negotiation playbook, the transfer impact summary, and the partner instructions.
- Identify whether there is one governing transfer mechanism or multiple alternatives in play; if more than one, separate the analysis by mechanism and do not blend concessions across them.
- Treat the playbook as the negotiating baseline, but treat the transfer impact summary as a constraint on what may be conceded where the destination law or access risk changes the legal posture.

## 2. Failure modes the skill is correcting

- Treating the counterparty markup as a standalone document rather than comparing it against the original draft and playbook together.
- Missing how deletions, substitutions, and softening edits alter the transfer mechanism, supplementary measures, data-export scope, or processor chain.
- Confusing internal negotiating preference with a true compliance constraint under the relevant transfer regime.
- Failing to link each deviation to the transfer impact summary and partner instructions before assigning risk.
- Writing a narrative memo instead of a clause-by-clause deviation report with a clear severity signal and concrete response.
- Relying only on visual markup instead of recording every substantive change in text that survives export.
- Stating conclusions without tying them to the controlling privacy rule, transfer instrument, or other authority that supports the position.

## 3. Legal frameworks / domain conventions that apply

- Cross-border transfer rules applicable to the agreement, including adequacy-based transfers, standard contractual clauses, binding corporate rules, and permitted derogations where relevant.
- The transfer-impact methodology for assessing third-country law, public-authority access, redress availability, and the practical effectiveness of supplementary measures.
- Mandatory data-processing and transfer terms commonly required in this setting, including purpose limits, security commitments, sub-processor controls, audit rights, assistance obligations, deletion or return, and breach handling.
- Core privacy principles that constrain drafting choices, including data minimisation, purpose limitation, storage limitation, and accountability.
- Supplementary safeguards often used where adequacy is absent or uncertain, including encryption, pseudonymisation, access controls, and notice obligations around government access requests.
- Controlling authority should be named whenever a legal conclusion is stated, whether the source is the agreement itself or the applicable regime reflected in the materials.

## 4. Analytical scaffolds

- Read the original draft, playbook, transfer impact summary, and partner instructions before reviewing the markup.
- Establish the baseline position clause by clause, then identify every counterparty edit that deletes, narrows, broadens, or reorders the original.
- For each deviation, record: what changed, what the playbook allows or forbids, whether the transfer impact summary heightens or relaxes the risk, and whether partner instructions authorize the concession.
- Distinguish legal deficiency from commercial preference; a deviation may be negotiable yet still inconsistent with the transfer risk profile.
- Use a plain-text change convention for every substantive edit, so the deviation remains readable even without redline formatting.
- Assign a uniform ordinal severity label to every issue and keep the label consistent across the whole report.
- Where multiple clauses, schedules, or transfer features interact, cross-reference the related provisions before deciding the severity or response.

## 5. Vertical / structural / temporal relationships

- Hierarchy of authority: governing transfer law and the transfer-impact findings constrain the playbook; the playbook constrains day-to-day negotiation; partner instructions govern only within the room left by the first two.
- Preserve the chain from controller to processor to sub-processor when reviewing flow-down obligations, approval mechanics, audit access, and onward transfer restrictions.
- When an edit affects a later-stage obligation such as deletion, certification, cooperation, or notification, test whether it weakens an earlier data-export or safeguard commitment that the later clause depends on.
- If the agreement contains multiple data flows, security tiers, or geographic routes, analyze each separately rather than assuming one risk finding applies to all.

## 6. Output structure conventions

- Begin with a short executive summary stating scope, the governing materials reviewed, the overall risk posture, and the highest-severity items.
- Define the severity scale once at the top and apply it uniformly across the report.
- Present the core findings in a deviation table using conventional columns such as clause reference, original position, counterparty change, playbook position, transfer-impact effect, severity, and recommended response.
- For every issue entry, include the operative change in plain text and a short rationale tag so the reader can identify the edit without relying on formatting.
- Each issue entry should close with three explicit moves: the scale or threshold implicated, the related clause or document that interacts with it, and the downstream consequence for compliance, operations, or transaction risk.
- Separate legal deficiency from negotiating position where useful, but do not omit either.
- End with a Recommended Actions section that uses imperative verbs, names the responsible role, and ties each action to a timing anchor from the materials or the transaction timeline.
- Follow the requested document format for the final file and ensure the deliverable is the deviation report itself, not a summary of it.
