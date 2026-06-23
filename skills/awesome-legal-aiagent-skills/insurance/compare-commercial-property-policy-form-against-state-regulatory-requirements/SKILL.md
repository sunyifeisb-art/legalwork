---
name: compare-commercial-property-policy-state-regulatory
task_id: insurance/compare-commercial-property-policy-form-against-state-regulatory-requirements
description: Agents conducting a policy form compliance review against state regulatory requirements should cross-reference prior objections, verify relevant statutory or regulatory periods for the applicable jurisdiction, and summarize gaps by severity tier.
activates_for: [planner, solver, checker]
---

# Skill: Compare Commercial Property Policy Form Against State Regulatory Requirements — Compliance Gap Analysis

## 1. Subject-matter triage
- Treat this as a jurisdiction-specific form comparison, not a generic policy critique.
- Identify the governing Colorado authority set before evaluating the form: statute, regulation, bulletin, or filing guidance that controls the reviewed provision.
- Identify whether the record contains prior objection letters, current form language, and any referenced filing history; compare all three rather than reviewing the form in isolation.
- If the source materials include more than one potentially relevant policy period or variant form, enumerate each before analysis and assess them separately.

## 2. Failure modes the skill is correcting
- Prior objection letters are not cross-referenced against current gaps, so repeat objections are missed or underweighted.
- The governing Colorado requirement is assumed rather than verified for the specific form issue being reviewed.
- A provision is flagged for substance but not tied to the controlling authority that makes it deficient.
- The review stops at description and does not state the downstream compliance consequence.
- Issues are not prioritized with a uniform severity scale, making triage and remediation planning difficult.
- Corrective guidance is generic and not tied to the specific regulatory defect.
- The analysis fails to distinguish a new issue from a known, repeated objection.

## 3. Legal frameworks / domain conventions that apply
- Compare each challenged provision against the controlling Colorado requirement that governs commercial property form content, filing acceptability, or mandated disclosure.
- Where a provision is governed by a minimum or required period, verify the period in the authority rather than relying on industry habit.
- Suit limitation provisions must be tested against the applicable Colorado rule or filing standard for property forms; a shorter contractual limitation may be objectionable.
- Mold or water-damage exclusions must be checked for any required carveback or exception tied to firefighting water or other mandated coverage preservation language.
- Nonrenewal and cancellation notice language must be checked against any Colorado advance-notice requirement applicable to the form.
- Any required risk disclosure language, including wildfire-related disclosure if implicated by the source set, must be compared to the exact required form or substance.
- Appraisal provisions must be reviewed for a neutral umpire selection mechanism and for any imbalance that gives one side unilateral control.
- Repeat objections from prior correspondence are aggravating because they suggest an unresolved filing deficiency; treat them as a severity escalator.
- Every legal conclusion must be anchored to a controlling authority, identified by name and section, regulation, or comparable citation form used in the source materials.

## 4. Analytical scaffolds
1. Build a provision-by-provision inventory of the policy form sections implicated by the Colorado requirements checklist and the prior objection letters.
2. For each issue, identify:
   - the governing authority,
   - the current policy wording,
   - the specific mismatch or omission,
   - the related prior objection, if any,
   - the compliance consequence if left unchanged.
3. For every issue, close the analysis in three steps:
   - measure the defect against the relevant threshold, period, or required wording;
   - cross-reference any interacting clause, endorsement, schedule, or prior objection;
   - state the practical consequence for filing acceptability, regulatory exposure, claims handling, or remediation cost.
4. Classify each issue on a uniform ordinal severity scale defined once at the top of the deliverable.
5. Elevate severity where the same objection appears in prior correspondence or where the defect affects a core coverage or claims-handling term.
6. Provide jurisdiction-specific corrective action for each issue, including revised language only where the authority requires exact or near-exact wording.
7. Where the source set contains multiple candidate periods, exceptions, or notice triggers, assess each separately rather than collapsing them into one.
8. Include a concise roll-up of issue counts by severity tier so the reviewer can triage remediation.

## 5. Vertical / structural / temporal relationships
- Compare the policy form to the controlling Colorado requirement at the same clause level: coverage grant, exclusion, condition, notice term, dispute resolution term, or disclosure.
- Track timing-sensitive provisions as written in the form against the governing advance-notice, limitation, or effective-date rule.
- If a prior objection letter predates the current filing, treat it as a historical reference point and test whether the same defect persists in the present version.
- If a later endorsement or amendment changes a core term, assess whether the change cures the objection or leaves the defect intact in modified form.
- If one provision depends on another, note the dependency so the reader can see whether a cure in one clause creates a new issue elsewhere.

## 6. Output structure conventions
- Use a compliance-gap-analysis format organized by issue type or policy section, not a narrative essay.
- State the severity scale once at the top, then apply it consistently to every issue.
- For each issue, include: severity, governing authority, current policy language summary, deficiency, prior-objection status, consequence, and recommended corrective action.
- Distinguish repeat objections from new issues with a clear label.
- Include a short summary that totals the gaps by severity tier.
- End with a Recommended Actions block that assigns an imperative action, the responsible role, and a timing anchor tied to the filing or response cycle.
- Keep the deliverable suitable for direct transfer into a memorandum or word-processing file named `compliance-gap-analysis.docx`.
