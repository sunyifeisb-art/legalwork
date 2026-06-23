---
name: hls-analyze-compliance-program-gaps
task_id: healthcare-life-sciences/analyze-compliance-program-gaps
description: Identifies structural and documentary gaps in a healthcare data privacy compliance program using incident records, vendor tracking, audit findings, and governance minutes to produce a remediation-focused memorandum.
activates_for: [planner, solver, checker]
---

# Skill: Healthcare Data Privacy Compliance Program Gap Analysis

## 1. Subject-matter triage

- Treat the source set as a compliance-program diagnostic, not a narrative summary: separate program design gaps, operating-effectiveness gaps, documentation gaps, and escalation/oversight gaps.
- If multiple incident records, vendors, audits, or reporting periods are present, enumerate them first and analyze each on its own record; do not merge distinct events into one generalized finding.
- If the materials involve both privacy and security obligations, keep the analysis distinct but cross-reference where the same control failure affects both regimes.
- If the source set contains an active investigation, breach notice clock, corrective-action commitment, or board reporting deadline, anchor remediation urgency to that milestone.

## 2. Failure modes the skill is correcting

- Generic risk labels replace evidence-based deficiency findings; every issue must be tied to a specific document, event, process, or control failure.
- Findings stop at description and do not close on scale, interaction, and consequence; a gap analysis must show how large the issue is, what other materials it affects, and why it matters.
- The memo omits the governing authority for each proposition, leaving legal conclusions unsupported.
- Governance defects are treated as secondary even though oversight structure, reporting cadence, and accountability lines often determine program adequacy.
- Notification and investigation obligations are blended with internal control weaknesses, obscuring what is a reportability problem versus a safeguards problem.
- Remediation is framed as generic best practice instead of an action plan tied to the program owner and the relevant external deadline.
- Severity is implied rather than stated, making prioritization unusable for decision-makers.
- Multiple roles or regulatory capacities are collapsed, masking separate compliance duties that may apply in parallel.

## 3. Legal frameworks / domain conventions that apply

- Breach notification analysis should track the applicable privacy framework’s notice trigger, recipient categories, timing rules, and any media-notice requirement.
- Where the record lacks a complete risk assessment, analyze whether the incident must be treated as presumptively reportable under the applicable privacy rule.
- Business associate documentation must be in place before PHI disclosure, and missing, expired, or incomplete terms may create independent compliance exposure.
- Security governance should be evaluated for formal officer designation, current risk analysis, administrative safeguards, and technical safeguards.
- Role-based training should be measured against workforce function and PHI access, not against a single uniform curriculum.
- Minimum-necessary practices should be assessed for both routine workflow design and exceptions.
- Oversight conventions matter: reporting lines, committee review, escalation paths, and documentation retention are part of the compliance program itself.
- Cite the controlling authority for each proposition by statute, regulation, or other recognized authority used in the source set or in standard healthcare privacy practice.

## 4. Analytical scaffolds

1. Build the issue list from the source documents in discrete units: each issue should correspond to one deficiency, one control failure, or one governance gap.
2. For each issue, include three closing moves: scale the problem against a document-based figure, date, population, workflow, or exposure; cross-reference the related policy, log, agreement, audit finding, or minute; and state the downstream consequence for the organization.
3. For each issue, state the specific evidentiary basis rather than a generic reference to “the record”; identify the relevant incident, vendor, audit note, policy, or meeting entry.
4. Assign an ordinal severity level to every issue using one consistent scale stated once at the top of the memo; apply the same scale across the entire analysis.
5. Pair each deficiency with the governing rule that supports the conclusion; do not assert a legal conclusion without a named authority.
6. Distinguish program-design deficiencies from implementation failures and from missing documentation; the remediation path may differ for each.
7. Trace who owns the remediation and who receives escalation inside the organization, especially where oversight and compliance functions are split.
8. When the materials show multiple reporting obligations or multiple regulated roles, analyze each obligation separately before comparing overlap or conflict.
9. Treat external deadlines, response windows, and board reporting commitments as sequencing constraints for the remediation roadmap.
10. If the source set does not contain enough information to quantify a point precisely, use the closest document-based proxy and say what remains unconfirmed.

## 5. Vertical / structural / temporal relationships

- Map each issue vertically from root cause to control gap to downstream exposure: policy, procedure, implementation, monitoring, and escalation.
- Identify whether a defect sits at the enterprise level, a function level, or a case-specific level; governance remedies should match the level at which the failure occurred.
- Note temporal relationships where a later audit, complaint, or incident shows that an earlier control weakness persisted; continuity of failure increases severity.
- If a remediation step depends on another unresolved issue, state the dependency explicitly so the reader can sequence fixes correctly.
- Where board or committee minutes show repeated discussion without closure, treat the repetition as evidence of ineffective oversight rather than a standalone administrative note.

## 6. Output structure conventions

- Memorandum format with a short executive summary that identifies the overall issue set, the highest-severity findings, and the main remediation themes.
- Define the severity scale once near the start, then use it uniformly for every issue.
- Present each issue in a compact analytical paragraph or bullet set with this order: description, evidentiary basis, controlling authority, severity, scale/interaction/consequence, and remedial direction.
- Use industry-conventional headings rather than a rubric-style checklist; keep the structure readable for a compliance audience.
- End with an explicit Recommended Actions section that uses imperative verbs, identifies the responsible role or function, and ties each action to a deadline, regulatory window, board meeting, or other concrete timing anchor.
- Include a concise table or appendix-style recap listing issue, severity, authority, owner, and timing anchor.
- Keep the memo focused on findings and fixes; avoid reciting background material unless it supports a specific deficiency finding.
