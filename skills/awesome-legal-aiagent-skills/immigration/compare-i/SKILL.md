---
name: compare-i9-roster-audit
task_id: immigration/compare-i
description: Cross-audit comparing an employee roster against employment eligibility verification records to identify compliance gaps at the individual employee level, with employee-specific documentation, timing, and reverification analysis.
activates_for: [planner, solver, checker]
---

# Skill: Compare I-9 Records Against Employee Roster

## 2. Failure modes the skill is correcting

- Agents collapse the audit into a general compliance narrative and fail to tie each gap to a specific employee identifier, hire date, and record status, making remediation non-operational.
- Agents identify missing or late records without showing the date logic that makes the defect verifiable from the source set.
- Agents flag expired authorization only as a category and omit the affected employees, the record status, and whether reverification occurred.
- Agents miss the distinction between ordinary reverification failures and improper reverification of permanent resident documentation, which can trigger a separate anti-discrimination concern.
- Agents treat roster-to-record mismatches as a document review instead of a reconciliation exercise across the full employee population.
- Agents omit a severity hierarchy, leaving the report unable to prioritize remediation.
- Agents give findings without concrete next steps, deadline anchors, or accountable roles.

## 3. Legal frameworks / domain conventions that apply

- Employment eligibility verification is required for each covered employee using the prescribed form and acceptable-document framework; a missing or incomplete record is a substantive compliance gap. Cite the governing employment eligibility verification rules by name when characterizing the defect.
- Section 2 must be completed by the employer within the third business day after the employee’s first day of work; weekends and federal holidays are excluded when counting business days.
- Temporary work authorization documents carry expiration dates; where the underlying authorization expires, the employer must complete reverification on time using the proper follow-up mechanism.
- Lawful permanent resident status does not expire when the physical card expires; requesting reverification solely because the card expired is improper and may implicate anti-discrimination rules under the federal employment verification regime.
- The roster and the verification log must be reconciled as complementary source sets: the roster shows who is employed and when they started, and the record log shows whether a compliant verification file exists.
- A deficiency should be framed by its regulatory consequence, not just by its paperwork status: missing records, late completion, unverifiable status, and improper reverification have different compliance implications and remediation paths.
- When a legal proposition is stated, anchor it to the controlling authority or standard that supports it rather than using unsupported conclusory labels.

## 4. Analytical scaffolds

1. **Roster-to-record reconciliation**
   - Build a complete employee-by-employee match between the roster and the verification log.
   - Enumerate every employee on the roster before analysis so no person is implicitly omitted.
   - For each employee, determine whether a record exists, whether it is complete, and whether the record status matches the roster status.

2. **Timing analysis**
   - For each record with a completion date, compare the hire date to the employer-completion date.
   - Count business days only, using the source calendar rules if provided; otherwise, apply the standard business-day convention.
   - State the elapsed timing in the finding so the defect can be independently checked.

3. **Expiration and reverification analysis**
   - For each employee with expiring authorization, identify the expiration date and whether a reverification entry exists.
   - Flag any expired authorization with no follow-up action as a separate defect from late initial completion.
   - If the source set includes a later date tied to follow-up review, confirm it lines up with the expiration event.

4. **Permanent resident reverification screen**
   - Isolate any employee whose documentation reflects permanent resident status.
   - Check whether the record shows reverification triggered by card expiration alone.
   - Treat that as a distinct concern and do not merge it into ordinary document-expiration findings.

5. **Section completeness and document validity**
   - Check for a signed and dated attestation, consistent status selection, and a permissible document combination where the source log provides enough information to assess it.
   - Do not infer compliance from a partially completed entry.

6. **Issue closure discipline**
   - Each finding should close with: the scale or timing detail that makes it measurable, the source-set cross-reference that shows why it matters, and the downstream operational or regulatory consequence.
   - If a finding cannot be measured from the source set, say what is missing instead of overstating certainty.

7. **Aggregation after employee-level review**
   - After the employee-level table is complete, group findings by deficiency type for the summary.
   - Keep the aggregate summary secondary to the employee-specific analysis.

## 5. Vertical / structural / temporal relationships

- Use hire date, first day of work, record completion date, and expiration date as distinct temporal anchors; do not conflate them.
- Treat the roster as the population baseline and the verification log as the compliance evidence set; mismatches arise from comparing those two vertically related records.
- Where the source set contains multiple employees with the same defect type, keep each employee in a separate row before aggregating by category.
- Preserve chronology in the report: hire event, initial verification, expiration, reverification, and current status should appear in that order when available.
- If only one employee or one defect class is actually present, state that affirmatively; do not imply a broader sample than the source set supports.

## 6. Output structure conventions

- Open with a brief methodology note that states the roster and record log were reconciled employee by employee.
- Define an ordinal severity scale once at the top and apply it uniformly to every finding.
- Use an employee-level findings table with columns for employee identifier, hire date, record status, deficiency type, relevant dates, severity, and concise consequence.
- For each finding, include the date logic or status logic, the controlling compliance rule or standard, and a short explanation of impact.
- Separate ordinary verification defects from any permanent resident reverification concern.
- Follow the employee-level table with an aggregate summary by deficiency type.
- End with a Recommended Actions section that assigns each step to a role and ties it to an immediate or otherwise concrete timing anchor.
- Keep remediation specific to the defect type: create missing records, correct late completion notation, complete reverification, or isolate and escalate any improper permanent resident reverification issue.
- If the source set does not support a particular conclusion, say so explicitly rather than filling the gap with assumptions.
