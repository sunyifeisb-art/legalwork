---
name: its-review-tcp-scenario-02
task_id: international-trade-sanctions/review-technology-control-plan/scenario-02
description: Produces an ITAR compliance issues memorandum for a Technology Control Plan review in connection with an upcoming manufacturing license renewal, emphasizing renewal disclosure obligations, training enforcement follow-through, cloud migration version-control gaps, and multi-facility coordination deficiencies at a category level without scenario-specific details.
activates_for: [planner, solver, checker]
---

# Skill: Review Technology Control Plan for ITAR Compliance Gaps and Deficiencies

## 1. Subject-matter triage

- Treat this as a compliance-gap review, not a pure summary. Identify concrete deficiencies, then separate those from areas where the TCP is presently adequate.
- If the source set contains multiple facilities, systems, employee groups, versions, or dates, enumerate each relevant item before analysis rather than collapsing them into one pass.
- For renewal timing, distinguish issues that are already live from issues that must be remediated, disclosed, or otherwise addressed before submission.
- If the deliverable requests an issues memorandum, the memo is the primary output; do not substitute a narrative overview for issue-by-issue analysis.

## 2. Failure modes the skill is correcting

- Flagging control weaknesses without tying them to the governing export-control framework, the specific TCP language, and the operational consequence to the client.
- Treating training non-completion as the only problem, while missing the separate failure to suspend system access when the TCP requires it.
- Not identifying the specific non-completing employees, their roles, and the level of controlled access they retained or lost.
- Missing that a later cloud migration can make the existing TCP stale if it does not govern the current storage environment.
- Overlooking that multi-facility operations require coordinated handling of foreign nationals, system access, travel, and reporting between sites.
- Writing issues that stop at description instead of closing with scale, document cross-reference, and downstream impact.
- Using generic priority language without an explicit ordinal severity scale.
- Providing diagnoses without an action-oriented recommendation tied to a responsible role and timing.

## 3. Legal frameworks / domain conventions that apply

- Apply the ITAR framework governing controlled technical data, access restrictions, deemed exports or transfers, foreign person access limitations, and country-based prohibitions.
- Use the TCP as the operational control document; identify where the supporting compliance materials confirm, contradict, or extend it.
- For renewal context, assess whether known deficiencies should be remediated or disclosed before the license renewal package is filed, and note sequencing implications.
- For training enforcement, treat access suspension for non-completion as a distinct compliance control if the TCP so provides; failure to enforce that control is a separate deficiency from the training lapse itself.
- For cloud migration, compare the TCP version date against the migration date and assess whether the existing controls still map to the current environment, including cloud-hosted technical data and access controls.
- For multi-facility operations, assess whether the TCP coordinates cross-site movement of foreign nationals, data, hardware, and access rights across locations.
- Cite the controlling ITAR authority for each legal proposition relied on, including the relevant regulation and section when available.

## 4. Analytical scaffolds

- Build the memo issue-by-issue. For each issue, state the deficiency, the governing authority, the source documents, the severity, the practical consequence, and the recommended fix.
- Start each issue by anchoring it to a concrete source fact, such as a date, headcount, role category, system status, facility relationship, or documented control failure.
- For every issue, include:
  - the operative control or requirement at stake,
  - the document that shows the gap,
  - the way the gap interacts with other compliance materials,
  - the operational, regulatory, or renewal consequence.
- When reviewing training records, identify the affected individuals, their role categories, and the access status relevant to the TCP; do not stop at aggregate completion metrics.
- When reviewing cloud migration materials, test whether the TCP predates the migration and whether any cloud environment now holding controlled data is outside the TCP’s stated controls.
- When reviewing multi-facility materials, test whether the TCP covers site-to-site coordination, foreign-national handling, and access governance across locations.
- For each material deficiency, assess whether the issue may need to be surfaced in renewal materials or remediated before filing.
- If the source set supports a balanced view, include a separate section for TCP-compliant or satisfactory areas to show the review is not one-sided.

## 5. Vertical / structural / temporal relationships

- Give priority to the most current version of the TCP, then reconcile it against later compliance materials, migration records, training reports, and access logs.
- Use document dates to determine sequence: a later operational change may reveal a version-control gap even if earlier controls were adequate when adopted.
- Where records span more than one facility or system, track relationships vertically from policy to implementation to evidence of enforcement.
- Where a later report references an earlier control, determine whether the later report confirms compliance, exposes drift, or shows that the control was never operationalized.
- If the source documents include multiple employee groups or locations, review them as distinct cohorts unless the documents affirmatively show identical treatment.

## 6. Output structure conventions

- Write a memorandum with an issue-by-issue structure using conventional issue labels.
- Define a simple ordinal severity scale once near the top, and apply it consistently to every issue entry.
- For each issue, include: issue heading, severity, concise description, governing authority, source document citation, why it matters, and recommendation.
- Close every issue with a concrete consequence statement that reflects the source record and the renewal context.
- Include a separate section for compliant or adequate aspects of the TCP, if supported by the documents.
- End with a Recommended Actions section that uses imperative verbs, identifies the responsible role from the record, and ties each action to a filing deadline, renewal milestone, or other timely anchor.
- Keep citations specific and source-grounded; do not generalize away the controlling rule or the supporting document.
- Preserve a balanced, professional tone suited to an issues memorandum, not a litigation brief.
