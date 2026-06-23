---
name: compare-permit-conditions-against-regulatory-requirements
task_id: environmental-esg/compare-permit-conditions-against-regulatory-requirements
description: Guides comparison of issued permit conditions against the underlying regulatory requirements by identifying conditions that are more stringent, less stringent, or procedurally deficient relative to applicable statutory and regulatory standards without relying on scenario-specific facts.
activates_for: [planner, solver, checker]
---

# Skill: Compare Permit Conditions against Regulatory Requirements — Compliance Gap Analysis Memorandum

## 1. Subject-matter triage
- Confirm whether the source set includes one air permit, one water permit, or both; if both are present, analyze each permit separately before comparing any overlapping compliance themes.
- Identify the governing requirements summary, the operative permit text, and any application or fact summary needed to interpret whether a condition is tied to current legal authority.
- Treat each permit condition, monitoring term, recordkeeping term, and reporting term as a discrete comparison unit unless the permit expressly cross-references a bundled provision.

## 2. Failure modes the skill is correcting
- Baseline characterizes permit conditions as compliant or deficient without tracing each condition back to the specific authority that governs it.
- Baseline does not distinguish between conditions that are legally required, conditions that are more stringent than required, and conditions that fall short of minimum regulatory requirements.
- Baseline misses permit conditions that address the wrong regulatory standard, such as applying obsolete or inapplicable control criteria instead of the current rule set.
- Baseline omits procedural deficiencies in how conditions are written that affect enforceability or compliance monitoring adequacy.
- Baseline collapses multiple permits, programs, or compliance dimensions into one blended conclusion instead of analyzing each regulatory lane on its own terms.

## 3. Legal frameworks / domain conventions that apply
- Clean Air Act Title V: evaluate whether the permit incorporates all applicable requirements, including federal source standards, hazardous air pollutant standards, major source permitting requirements, and incorporated state implementation plan provisions; assess permit-shield or analogous protections only if the application record supports them.
- NPDES / water pollution control permitting: compare effluent limits against technology-based and water-quality-based requirements, and consider antidegradation and anti-backsliding principles where relevant under the governing state or federal program.
- BACT / LAER concepts: for any major new source or major modification, test whether the stated control requirement matches the applicable case-by-case standard and procedural record.
- Monitoring, recordkeeping, and reporting: assess whether each condition states a method, frequency, averaging period, and reporting cadence sufficient to demonstrate compliance with the underlying limit.
- State implementation plan or equivalent state permitting provisions: identify any state-specific emission limits, control requirements, or procedural rules that function as applicable requirements.
- Compare every legal conclusion to a named source of authority, using the relevant statute, regulation, or permit-program provision rather than a conclusory label.

## 4. Analytical scaffolds
- Build a comparison inventory for each permit before writing conclusions: list the operative conditions, the governing requirement for each condition, and the document location or program hook that links them.
- For each permit condition, determine whether it is:
  - meets requirements,
  - more stringent than required,
  - less stringent than required, or
  - procedurally deficient.
- For every issue entry, include four closing moves: scale the issue against the stated limit or threshold, cross-reference the interacting requirement or related condition, identify the consequence of the gap for compliance or enforcement, and state the corrective step.
- If multiple units, pollutants, outfalls, emission points, compliance periods, or monitoring streams are present, enumerate them first and analyze each one on its own row or subpart rather than using a single representative example.
- When a condition is facially compliant but implemented through an ambiguous trigger, undefined term, or incomplete method, treat the drafting defect as a procedural deficiency rather than a substantive limit violation.
- For air permits, verify that all applicable requirements are captured for each emission unit and that any case-by-case control determination is tied to the right major-source or modification standard.
- For water permits, verify that each effluent limit reflects the current technology-based or water-quality-based standard and that any antidegradation showing is complete when the permit relies on it.
- For monitoring and reporting provisions, test whether the permit supplies enough detail to allow a regulator or operator to determine compliance without guesswork.
- Use a uniform severity scale defined once at the top of the memo, and apply it consistently across all findings.
- Close each finding with an explicit recommended action written as an imperative and tied to the responsible function or office and the relevant compliance timeline or permit milestone.

## 5. Vertical / structural / temporal relationships
- Analyze the relationship between higher-order legal requirements, permit conditions, and implementing monitoring terms in that order; do not assess a lower-level clause without identifying the controlling higher-level requirement.
- When a condition depends on another section, schedule, attachment, or incorporated document, treat the incorporated material as part of the same compliance chain and test the chain end-to-end.
- If the permit has effective dates, compliance dates, renewal dates, phased-in obligations, or interim milestones, compare each condition against the correct time period rather than a generic present-tense standard.
- If the source set includes both air and water permits, keep them in separate program tracks and only compare them on shared drafting issues after the program-specific analysis is complete.

## 6. Output structure conventions
- Draft a compliance gap analysis memorandum organized by permit type and then by regulatory program within each permit type.
- Begin with a short methods note stating the severity scale and the comparison method used.
- For each permit, include a structured comparison table with columns for permit condition, controlling authority, assessment, severity, consequence, and recommended action.
- Follow each table with concise narrative analysis of the most significant findings, focusing on why the condition is legally sufficient, over-stringent, under-stringent, or procedurally defective.
- Distinguish findings that warrant agency correction from items the facility may want to address proactively.
- Use legally conventional labels rather than rubric-like labels, but keep the classification of each finding explicit and uniform.
- End with a Recommended Actions section that states what should be corrected, who should act, and when action should occur relative to the permitting or compliance timeline.
- The deliverable filename must match the task instructions exactly.
