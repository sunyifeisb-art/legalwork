---
name: extract-key-obligations-msa
task_id: intellectual-property/extract-key-obligations-from-executed-master-services-agreement
description: Building a categorized obligation tracker from an executed master services agreement and related exhibits, requiring cross-document reconciliation, ambiguity identification, and flagging of compliance gaps.
activates_for: [planner, solver, checker]
---

# Skill: Extract Key Obligations from Executed Master Services Agreement

## 1. Subject-matter triage

Treat the master agreement body as the default source for baseline commercial, risk-allocation, confidentiality, dispute, and ownership terms; treat exhibits, schedules, statements of work, data addenda, security exhibits, and negotiation summaries as controlling on their narrower subject matter when they specifically address it. Reconcile the whole packet as one integrated deal record, not as isolated documents.

Before analysis, enumerate the distinct obligation buckets actually present in the source set and confirm whether a category is absent, present in one document only, or addressed inconsistently across documents. If multiple periods, services, counterparties, data types, or workstreams exist, track them separately rather than collapsing them into a single representative obligation.

## 2. Failure modes the skill is correcting

- Extracting obligations from the base agreement without reconciling exhibit-level overrides
- Missing conflicts, carve-outs, or silent deviations between the negotiation summary and the executed documents
- Treating ambiguous language as settled when the document set actually leaves scope, timing, or measurement basis unclear
- Omitting obligations that are standard for the deal structure and therefore should be flagged if absent
- Failing to distinguish hard obligations from aspirational, best-efforts, or process-only language
- Missing dependencies between one party’s performance and the other party’s acceptance, notice, approval, or cooperation duties
- Overlooking obligations that arise only on trigger events such as breach, audit, termination, renewal, or data incident
- Failing to identify where the document set is internally incomplete, inconsistent, or operationally hard to administer

## 3. Legal frameworks / domain conventions that apply

Apply the agreement’s own definitions first, then read each obligation against the surrounding clause structure and any incorporated exhibit hierarchy or order-of-precedence provision. Where the documents are silent, use ordinary contract-interpretation conventions: specific terms override general ones, later-dated or more specific exhibits may control if the hierarchy says so, and negotiated deviations should be reconciled rather than assumed away.

For obligation tracking, distinguish between:
- affirmative performance duties,
- conditional duties triggered by events,
- negative covenants,
- notice and reporting obligations,
- approval or consent requirements,
- payment and invoicing mechanics,
- audit, access, cooperation, and recordkeeping duties,
- confidentiality, data handling, security, and incident response duties,
- IP ownership, licensing, and use restrictions,
- termination, transition, and post-termination wind-down duties,
- insurance, compliance, and flow-down obligations.

Treat ambiguity as a risk issue when the obligation cannot be operationalized without guessing its scope, timing, metric, or responsible party. Treat gaps as issues when a standard operational or protective term is missing for the deal type, especially where the omission creates enforceability, compliance, or transition risk.

When legal propositions are stated, anchor them to the governing contractual text or to the applicable external rule being invoked in the analysis, rather than concluding by intuition. Use the document’s own hierarchy, defined terms, and incorporated standards to support the tracker.

## 4. Analytical scaffolds

1. Read the agreement hierarchy first: identify the operative document set, any precedence clause, and any exhibit order that determines which text governs on conflict.
2. Enumerate the obligation buckets present in the source set before analysis, then extract each obligation into a tracker row with source section, obligor, beneficiary, trigger, deadline, condition, and related document.
3. For each obligation, separate what is mandatory from what is permissive, discretionary, or process-oriented.
4. For each obligation, identify the performance metric, measurement method, or administrative mechanism, and flag any missing measurement basis.
5. Reconcile the same topic across the master agreement, exhibits, and negotiation summary; flag deviations, unresolved comments, or changes that appear only in one place.
6. Identify dependencies and sequencing: notice before cure, approval before work, invoicing before payment, audit before remediation, acceptance before deployment, termination before transition.
7. Flag obligations that appear only as a reference to another document without the referenced text being available or sufficiently incorporated.
8. Extract IP obligations separately: background rights, work product, license scope, use restrictions, assignment, moral-rights handling, and any joint-ownership or exploitation issue.
9. Extract data and security obligations separately: permitted use, safeguards, breach or incident notification, cooperation, return or deletion, certification, and access rights.
10. Extract payment and commercial obligations separately: fees, invoice support, expenses, withholding, crediting, offsets, tax handling, and any escalation or true-up mechanics.
11. Extract governance obligations separately: reporting cadence, meetings, escalation ladder, approval thresholds, and named contacts or decision makers.
12. Extract compliance and risk-transfer obligations separately: insurance, indemnity, warranty, confidentiality, export, sanctions, privacy, and record-retention duties.
13. For each issue, state the source, the precise ambiguity or gap, why it matters operationally or legally, and what additional text or confirmation is needed to close it.
14. If the agreement references a standard form, policy, or exhibit not attached, flag the missing incorporation package as a completeness issue.
15. If the engagement involves regulated data or industry-specific obligations, check for any special confidentiality, security, retention, or notification terms beyond baseline commercial protections.

## 5. Vertical / structural / temporal relationships

Map obligations vertically: master agreement → exhibit/schedule → statement of work → amendment/negotiation summary → incorporated policy or standard. A lower-level document may refine a higher-level obligation, but it should not silently contradict it.

Map obligations structurally by role: service provider duties, customer duties, mutual duties, and third-party flow-down duties. Note when an obligation is one-sided but depends on cooperation from the other side.

Map obligations temporally: pre-signing conditions, effective-date duties, onboarding duties, recurring duties, event-driven duties, cure periods, renewal windows, termination duties, and post-termination survival duties. If a timeline is implied but not stated, flag it as an administration gap.

Where duties cascade over time, track whether one deadline begins after notice, after approval, after milestone completion, or after a specified calendar event. If the source set uses multiple clocks for related duties, reconcile them and flag overlap or dead-zone risk.

## 6. Output structure conventions

- Use an obligation-tracker format, grouped by functional category such as commercial, operational, governance, IP, data/security, compliance, risk allocation, termination, and post-termination.
- For each row, include: category, obligation, obligor, beneficiary, source citation, timing/trigger, dependencies, and a concise flag for ambiguity, inconsistency, or gap.
- Separate confirmed obligations from issues. Do not mix commentary into the obligation text itself.
- For each issue, include a severity field using a simple ordinal scale defined once at the top of the document and apply it consistently.
- For each issue, include the source location, the exact nature of the inconsistency or omission, the practical consequence, and the recommended next step to resolve it.
- When comparing documents, reflect the comparison explicitly rather than burying it inside a narrative paragraph.
- End with a short Recommended Actions section that assigns each next step to the relevant business owner or counsel and ties it to a practical timing anchor from the deal lifecycle.
- Write the final file as a standalone work product suitable for circulation as an issue-and-obligation tracker, not as a memorandum about how to build one.
