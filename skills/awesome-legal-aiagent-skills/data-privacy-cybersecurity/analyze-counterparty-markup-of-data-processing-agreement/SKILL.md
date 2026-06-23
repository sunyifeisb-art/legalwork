---
name: analyze-counterparty-markup-of-data-processing-agreement
task_id: data-privacy-cybersecurity/analyze-counterparty-markup-of-data-processing-agreement
description: DPA redline reviews lose rigour when the agent treats playbook positions as optional and fails to cross-reference the broader commercial agreement when assessing risk of counterparty changes.
activates_for: [planner, solver, checker]
---

# Skill: Analyze Counterparty Markup of Data Processing Agreement — Deviation Report

## 1. Subject-matter triage (only if applicable)

- This task is a markup-analysis workflow, not a clean drafting exercise: read the template, the redline, the negotiation playbook, the cover email, and the MSA together before drawing conclusions.
- Treat the DPA as a control document that must be reconciled with the commercial agreement; do not let the redline analysis drift into a standalone privacy commentary.
- If the source set includes multiple DPAs, amendments, schedules, jurisdictions, or processing scopes, enumerate them first and analyze each separately rather than blending them into one pass.

## 2. Failure modes the skill is correcting

- Reviewing the redlined DPA in isolation instead of triangulating against the original template, the playbook, and the MSA, which hides removals or dilution of baseline privacy protections.
- Missing where the counterparty’s edits conflict with the commercial deal architecture on scope, liability, indemnity, audit, or assistance obligations.
- Treating negotiable preferences as if they were mandatory privacy terms, or vice versa, and therefore mis-prioritizing the report.
- Describing deviations without tying each one to a concrete response, which leaves the output non-actionable.
- Relying on styling alone to show changes; the output must remain readable and reviewable even if exported or flattened.

## 3. Legal frameworks / domain conventions that apply

- Mandatory DPA baseline: processor obligations, instructions, security measures, sub-processor controls, deletion or return on termination, audit/inspection rights, breach notice, and assistance with data-subject requests and compliance.
- Security standard: technical and organizational measures appropriate to the risk, assessed in context rather than by slogan language.
- Sub-processor regime: written authorization mechanics, flow-down obligations, notice of changes where required, and preservation of controller oversight.
- Agreement hierarchy: the DPA must fit within the MSA’s commercial envelope on scope, liability, and indemnity, while preserving non-waivable privacy obligations.
- Playbook discipline: each clause should be measured against the company’s stated position category, then escalated or accepted accordingly.
- Where a legal proposition is stated, anchor it to the controlling authority named in the source materials or to the applicable privacy regulation, standard form, or internal playbook rule that supports it.

## 4. Analytical scaffolds

- Start with the baseline: original template, then playbook, then cover email, then the counterparty redline.
- For each changed clause, identify: what the template said, what the counterparty changed, what the playbook position is, whether the MSA already addresses the point, and whether the change affects privacy risk or deal consistency.
- Classify every issue by clause type: mandatory privacy term, negotiated company position, or flexible commercial term.
- For every issue, close the analysis with three moves:
  - anchor the concern to a concrete source-document figure, trigger, term, scope, or procedural threshold where one exists;
  - cross-reference the clause, schedule, or related agreement provision that interacts with the change;
  - state the downstream consequence for the client in practical terms, including regulatory, operational, litigation, or transaction risk.
- Do not stop at “this is better/worse”; provide the reason the deviation matters and the exact bargaining move that follows from that reason.
- If the playbook or cover email indicates a deal-specific concession, note it explicitly and adjust the recommendation rather than treating the template as immutable.

## 5. Vertical / structural / temporal relationships (only if applicable)

- The MSA governs the commercial frame; the DPA should not create inconsistent allocations of liability, indemnity, limitation of liability, or scope.
- Priority and sequencing matter: later amendments, side letters, or negotiated exceptions may override a template position only if the source documents clearly do so.
- Operational timing matters for privacy obligations: notice, objection, deletion, return, and assistance commitments should be checked against any stated response windows or go-live milestones in the source set.
- If a clause depends on another instrument or schedule, report the dependency rather than analyzing the clause as self-contained.

## 6. Output structure conventions

- Use a prioritized deviation report in table form, with an explicit ordinal severity scale defined once at the top of the report and applied uniformly to every row.
- For each row, include the operative clause reference, the template baseline, the counterparty change, the playbook position, the MSA cross-check, the severity, the legal/commercial impact, and the recommended response.
- Mark every substantive change in a way that survives plain-text export; do not rely only on formatting.
- Keep recommendations concrete and action-oriented: state whether to accept, reject, narrow, clarify, or escalate, and explain why in one line.
- End with a short recommended actions section that sequences the next negotiation steps and identifies the role that should take each step.
- If a deliverable filename is specified, the deviation report should be prepared for that filename and not displaced by a summary-only response.
