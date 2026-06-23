---
name: hls-extract-closing-conditions-merger
task_id: healthcare-life-sciences/extract-closing-conditions-from-merger-agreement
description: Extract closing conditions from a merger agreement into a structured matrix, categorizing each condition by burdened party and condition type, and assessing feasibility, unusual features, and procedural interactions that may affect closing.
activates_for: [planner, solver, checker]
---

# Skill: Extract Closing Conditions from Merger Agreement into Structured Closing Conditions Matrix

## 1. Subject-matter triage
- Treat Article VII as the primary source of closing conditions and read it together with defined terms, remedies, termination provisions, covenants, schedules, exhibits, disclosure letters, and any supporting regulatory or tax materials.
- Separate true closing conditions from covenants, termination triggers, bring-down standards, and post-closing obligations; do not blur obligations into conditions unless the agreement clearly makes them so.
- If only one transaction leg, one signer group, or one regulatory path is present, say so expressly; otherwise enumerate each party, condition set, and external approval path before analysis.

## 2. Failure modes the skill is correcting
- Conditions are listed without being organized by burdened party, condition type, and analytical significance, which obscures who must satisfy what and when.
- Conditions are summarized without testing whether they are actually feasible on the current facts, or whether supporting documents create hidden blockers, timing pressure, or sequencing constraints.
- Unusual, asymmetric, or heavily qualified conditions are not flagged for follow-up, including conditions tied to regulatory timing, tax deliverability, third-party consents, or the absence of a financing backstop.
- Cross-document interactions are missed, so a condition appears routine even though another covenant, schedule, or definition narrows it materially.
- The output gives labels instead of decision-useful risk ratings, or gives risk ratings without a short reason tied to the deal record.
- The analysis stops at description and does not state the downstream consequence if a condition is hard to satisfy, delayed, waived, or impossible.

## 3. Legal frameworks / domain conventions that apply
- Closing conditions should be grouped by the party bearing the burden, including mutual, buyer-side, and seller-side conditions; asymmetry matters because it affects waiver power, leverage, and closing sequence.
- Bring-down conditions should be read against the relevant accuracy standard in the agreement; compare any materiality qualifier, knowledge qualifier, or custom standard to the other side’s standard.
- The no-MAE condition should be evaluated together with the MAE definition, including carve-outs, baskets, and any special exceptions that expand or narrow closing risk.
- Tax opinion or tax-condition language should be tested against the stated opinion standard and the transaction structure; assess whether the facts make the deliverable realistically obtainable under that standard.
- Regulatory conditions should be tested for timing risk, remedy flexibility, divestiture latitude, and whether the outside date is long enough for the approval path described in the record.
- If the agreement lacks a financing condition, treat other exit features, including any reverse termination or similar allocation mechanism, as the practical risk-allocation architecture rather than a substitute for financing certainty.
- Any workforce, notice, or plant-closing language that must be satisfied before closing should be read as a covenant-condition bridge; check whether pre-closing actions could prevent satisfaction of closing conditions.
- Any patent, product, quality, reimbursement, or approval challenge that bears on a core asset should be checked for spillover into closing conditions, regulatory risk, or bring-down standards.

## 4. Analytical scaffolds
1. Enumerate every closing condition in Article VII and classify each one by burdened party, condition type, and whether it is mutual, buyer-side, or seller-side.
2. For each condition, state:
   - the precise trigger or deliverable,
   - the feasibility risk on the current facts,
   - any cross-reference to another clause, schedule, exhibit, definition, or supporting document,
   - the downstream consequence if the condition is delayed, impossible, or waived.
3. Test whether each condition is substantive or merely confirmatory, and flag any condition that appears to duplicate a covenant, termination right, or definition.
4. For bring-down conditions, compare the applicable standard on each side and note any asymmetry that changes closing leverage.
5. For MAE-linked conditions, identify the carve-outs and any missing carve-outs that could widen closing risk.
6. For tax-related conditions, assess whether the opinion or certification can be delivered on the present facts and whether any structural change or interim event undercuts deliverability.
7. For regulatory conditions, compare the likely approval path to the outside date and note whether any remedy cap, commitment limit, or divestiture ceiling appears realistic.
8. For any condition tied to workforce actions, notice periods, or operational changes, test whether pre-closing covenants create a hidden path to failure.
9. Assign an ordinal severity label to every entry using one uniform scale defined once at the top of the deliverable, and keep the rationale to one short line.
10. Prioritize the conditions that most likely control closing timing, closing certainty, or waiver strategy, and explain why they sit at the top of the list.

## 5. Vertical / structural / temporal relationships
- Organize the matrix first by burdened party, then by condition category, then by practical risk.
- Within each category, separate conditions that must be satisfied at signing, at closing, and by a pre-closing deadline.
- If multiple approvals or deliverables move on different clocks, show the sequencing relationship and identify the bottleneck.
- Track interactions between Article VII and termination, outside date, covenants, definitions, and remedy provisions so the reader can see whether one clause functionally governs another.
- If a condition depends on an external process, identify the approval chain, expected timing, and whether the deal timetable appears to absorb it.
- If the deal record includes competing factual versions, note the dependency and avoid treating the more favorable version as settled unless the source set supports it.

## 6. Output structure conventions
- Produce a closing-conditions matrix that is easy to scan and that groups all conditions by burdened party and condition type.
- Use a uniform ordinal severity field for every row, with the scale defined once up front and applied consistently.
- For each row, include the condition, burdened party, source anchor, feasibility assessment, cross-document interaction, risk rating, and practical consequence.
- Include a prioritized section that identifies the most decision-critical conditions and explains the closing impact in plain language.
- Include a short timing analysis that compares approval and deliverable timing against the outside date and any other deadline that constrains closing.
- End with explicit recommended actions, each framed as an imperative, assigned to a responsible role, and tied to a concrete timing anchor or transactional milestone.
- Use controlling authority where the analysis states a legal proposition: cite the governing statute, regulation, rule, or doctrinal source by name and section where applicable, rather than relying on conclusory labels.
- If the final deliverable is written to a file, ensure the file is the operative product and not merely a summary of it; the matrix itself should be complete and non-empty before any cover note is drafted.
