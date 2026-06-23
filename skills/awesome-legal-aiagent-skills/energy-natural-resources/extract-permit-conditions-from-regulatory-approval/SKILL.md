---
name: extract-permit-conditions-compliance-matrix-wind-solar
task_id: energy-natural-resources/extract-permit-conditions-from-regulatory-approval
description: Guides construction of a compliance tracking matrix from multiple regulatory approvals by assigning responsible parties to every condition, identifying cross-approval conflicts, flagging missing approvals, and producing a Critical Issues section for time-sensitive or deal-blocking items.
activates_for: [planner, solver, checker]
---

# Skill: Extract Permit Conditions from Regulatory Approvals — Compliance Tracking Matrix

## 1. Subject-matter triage (only if applicable)

- First determine which approvals are actually in the source set and treat each approval as a separate extraction pass.
- If the task references an approval that is missing, flag that omission immediately and do not assume its conditions.
- Keep the project timeline in view while extracting conditions so each obligation is anchored to the relevant construction, commissioning, or operational milestone.

## 2. Failure modes the skill is correcting

- Baseline tabulates conditions but omits the responsible-party column, producing a matrix that is informative but not actionable for project management purposes.
- Baseline does not produce a Critical Issues section distinguishing the most time-sensitive or deal-blocking conditions from routine compliance requirements.
- Baseline collapses multiple approvals into a single blended summary, which obscures which obligation came from which instrument and prevents conflict spotting.
- Baseline identifies obligations but fails to state when they trigger, when they are due, and what project event controls the deadline.
- Baseline notes problems descriptively but does not rank them by severity or state the next step needed to close them.

## 3. Legal frameworks / domain conventions that apply

- Compliance tracking matrix structure: a complete compliance matrix should include, for each condition, the approval source and condition number, a description of the obligation, the trigger event that activates the obligation, the deadline (absolute date or relative to a project milestone), the responsible party, and current status; the responsible-party column translates legal obligations into project management assignments.
- Cross-approval decommissioning bond discrepancy: if two separate approvals both require a decommissioning bond but specify different amounts, assess whether both requirements apply, identify the discrepancy, and verify the controlling amount with the relevant authorities before proceeding.
- Construction commencement definition inconsistency: if different approvals define the same trigger term differently, identify the inconsistency, compare how each definition affects timing, and assess whether harmonization or clarification is needed to avoid missing a triggered obligation.
- Timing conflicts between regulatory approvals: if one approval imposes a construction or operational deadline that conflicts with another approval's requirements, sequence activities to satisfy both; where a project is subject to aviation-related review for tall structures, coordinate the review's duration and any expiration with construction timing.
- Setback and buffer interactions: if one approval imposes a buffer or setback and another approval imposes a different or additional setback, assess whether the requirements are additive or overlapping and quantify the effect on the development footprint.
- Missing regulatory approval: if the matrix is expected to address conditions from an approval that has not been provided, flag the gap prominently because the missing approval cannot be tracked and may contain conditions that affect scheduling or design.
- Construction season restrictions: environmental approvals may restrict construction activities during certain periods; incorporate those restrictions into the project schedule and flag any overlap with the planned construction window as a scheduling risk.
- Regulatory versus contractual commercial operation date: if a regulatory approval defines commercial operation differently from project contractual documents, compare the definitions and assess whether the project can satisfy both without a compliance gap.
- Technical standard edition ambiguity: if an approval references a technical standard without specifying the applicable edition, flag the ambiguity and seek clarification on the controlling edition.
- Noise measurement methodology: if a noise limit is stated without a measurement methodology, flag the ambiguity and seek clarification before construction begins.
- Reactive power and interconnection obligations: if permits or interconnection documents specify reactive power requirements, track the required threshold and monitor whether design changes could affect compliance.
- Environmental mitigation fee acreage calculations: if a mitigation fee is computed based on disturbed acreage, verify that all relevant disturbed areas are included in the calculation and flag any potential undercount.
- Treat every legal or regulatory proposition as authority-backed: cite the controlling approval provision, rule, statute, or standard identified in the source set, and do not state a compliance conclusion without naming the basis for it.
- Use an ordinal severity scale consistently across all issues so the reader can distinguish critical blockers from routine tracking items.

## 4. Analytical scaffolds

- Enumerate the approvals first, then extract conditions from each approval in sequence; do not merge sources until after the source-by-source pass is complete.
- For each condition, populate the matrix with source, condition number, obligation, trigger, deadline, responsible party, current status, and any linked milestone or dependency.
- After extraction, run a cross-approval review for conflicts, overlaps, sequencing problems, missing definitions, missing approvals, and schedule collisions.
- For every issue identified, state the severity, the controlling authority or provision, the interacting document or condition, and the project consequence.
- Keep a running list of time-sensitive items that require immediate clarification, external confirmation, or schedule adjustment.
- Critical Issues section: identify conditions that are time-sensitive, deal-blocking, or currently unresolvable; each critical issue should state the condition, the specific risk, the controlling authority, and the recommended next step.
- If the source set suggests multiple obligations for the same subject matter, preserve each obligation as a separate row before deciding whether they overlap or conflict.

## 5. Vertical / structural / temporal relationships

- Construction timing constraints from environmental approvals may constrain or extend the project schedule independently of contractual milestones; the project schedule should reflect both contractual and regulatory constraints.
- Setback and buffer requirements interact with siting design; any reduction in usable development area from regulatory requirements may affect project capacity and revenue projections.
- Deadlines tied to notice, filing, commencement, commissioning, or operation should be anchored to the project timeline entry that actually triggers them, not to an assumed generic start date.
- If one approval uses a defined term differently from another approval, preserve the distinction in the matrix and flag the timing effect rather than harmonizing the terms silently.

## 6. Output structure conventions

- Produce a compliance tracking matrix in a structured table with one row per condition or obligation and columns that make the source, trigger, deadline, responsible party, status, and related project milestone visible.
- Include a severity field for any issues or exceptions, using a clearly stated ordinal scale applied consistently throughout the document.
- Add a cross-approval issues section after the matrix for conflicts, ambiguities, sequencing problems, and missing approvals.
- End with a Critical Issues section that isolates the most urgent, unresolvable, or deal-blocking items and pairs each with the controlling authority and the next recommended step.
- Include a Recommended Actions section with concise, imperative action items assigned to the relevant project role and tied to the nearest milestone or deadline.
- Ensure the document is written as an operative tracking tool, not a narrative summary: every row should be usable for compliance follow-up.
